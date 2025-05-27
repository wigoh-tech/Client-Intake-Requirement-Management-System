'use client';

import { useEffect, useState } from 'react';

type Question = {
  id: number;
  question: string;
};

type AnswersMap = Record<number, string>;

export default function UserIntakeForm({ clientId }: { clientId: string }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnswersMap>({});
  const [previousAnswers, setPreviousAnswers] = useState<AnswersMap>({});
  const [formType, setFormType] = useState<'view' | 'edit'>('view');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch questions on mount
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch('/api/intake-questions');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch questions');

        setQuestions(Array.isArray(data) ? data : data.questions || []);
      } catch (err: any) {
        setError(err.message || 'Error fetching questions');
      }
    }

    fetchQuestions();
  }, []);

  // Fetch saved answers when clientId is ready
  useEffect(() => {
    if (!clientId) return;

    async function fetchAnswers() {
      try {
        const res = await fetch(`/api/intake?clientId=${encodeURIComponent(clientId)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch answers');

        if (Array.isArray(data.answers) && data.answers.length > 0) {
          const filledAnswers: AnswersMap = {};
          data.answers.forEach((ans: { questionId: number; answer: string }) => {
            filledAnswers[ans.questionId] = ans.answer;
          });

          setAnswers(filledAnswers);
          setPreviousAnswers(filledAnswers);
          setFormType('view');
        } else {
          setAnswers({});
          setPreviousAnswers({});
          setFormType('edit'); // no answers, so edit mode
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching answers');
      }
    }
    fetchAnswers();
  }, [clientId]);

  // Filter questions to only those that have answers
  useEffect(() => {
    if (questions.length === 0) return;

    // Filter questions where answers exist
    const filtered = questions.filter((q) => answers[q.id] !== undefined);
    setFilteredQuestions(filtered);
  }, [questions, answers]);

  // Handle input changes
  function handleInputChange(questionId: number, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  // Submit updated answers
  async function handleSubmit() {
    setLoading(true);
    setError(null);

    const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
      questionId: Number(questionId),
      answer,
    }));

    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, answers: answersArray }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to submit answers');

      setPreviousAnswers({ ...answers });
      setFormType('view');
    } catch (err: any) {
      setError(err.message || 'Error submitting answers');
    } finally {
      setLoading(false);
    }
  }

  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!clientId) return <p>Loading client info...</p>;
  if (questions.length === 0) return <p>Loading questions...</p>;

  return (
    <div className="max-w-xl mx-auto p-4 border rounded shadow-sm">
        
      <h2 className="text-2xl font-bold mb-4">Intake Form</h2>
      <button
          className="px-6 py-2 min-w-[120px] text-center text-white bg-violet-600 border border-violet-600 rounded active:text-violet-500 hover:bg-transparent hover:text-violet-600 focus:outline-none focus:ring"
          onClick={async () => {
            if (!clientId) return;

            try {
              const res = await fetch(`/api/export-csv?clientId=${clientId}`);
              if (!res.ok) {
                alert('Download failed');
                return;
              }

              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `intake_${clientId}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            } catch (err) {
              console.error('Download error:', err);
            }
          }}
        >
          Download
        </button>
      {filteredQuestions.length === 0 && formType === 'view' && (
        <p>No answered questions to display.</p>
      )}

      {filteredQuestions.map((q) => (
        <div key={q.id} className="mb-4">
          <p className="font-medium mb-1">{q.question}</p>

          {formType === 'view' ? (
            <p className="p-2 bg-gray-100 rounded">
              {previousAnswers[q.id] ?? <em>No answer provided</em>}
            </p>
          ) : (
            <input
              type="text"
              className="w-full border rounded p-2"
              value={answers[q.id] || ''}
              onChange={(e) => handleInputChange(q.id, e.target.value)}
              placeholder="Your answer"
            />
          )}
        </div>
      ))}

      {formType === 'view' ? (
        <button
          onClick={() => setFormType('edit')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Edit
        </button>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      )}
    </div>
  );
}
