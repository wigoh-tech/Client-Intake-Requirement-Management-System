'use client';
import { useEffect, useMemo, useState } from 'react';
import FileUpload from './uploadFile';
import ReviewSection from '../components/review/page';

interface IntakeFormProps {
  showOnlyView?: boolean;
  clientId?: string;
  requirementVersionId: number;
}

export default function IntakeForm({
  showOnlyView = false,
  clientId: passedClientId,
  requirementVersionId,
}: IntakeFormProps){
  const [questions, setQuestions] = useState<{
    options: string | boolean;
    fieldType: string;
    id: number;
    question: string;
  }[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [clientId, setClientId] = useState<string | null>(null);
  const [formType, setFormType] = useState<'intake' | 'view'>('intake');
  const [previousAnswers, setPreviousAnswers] = useState<Record<number, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  useEffect(() => {
    if (passedClientId) {
      setClientId(passedClientId);
    } else {
      fetch("/api/get-client-id")
        .then((res) => res.json())
        .then((data) => {
          if (data.clientId) setClientId(data.clientId);
        });
    }
  }, [passedClientId]);

  const stableClientId = useMemo(() => clientId, [clientId]);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        // 1. Fetch the user role
        const resRole = await fetch('/api/user/user-role');
        if (!resRole.ok) throw new Error('Could not get role');
        const dataRole = await resRole.json();
        const isAdminUser = dataRole.role === 'admin';
        setIsAdmin(isAdminUser);
      } catch (err) {
        console.error(err);
        setIsAdmin(false);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    if (!isAdmin && !stableClientId) return; // Non-admin without clientId: do nothing

    fetch("/api/intake-questions")
      .then((res) => res.json())
      .then(setQuestions);

    if (stableClientId) {
      fetch(`/api/intake?clientId=${stableClientId}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.answers) && data.answers.length > 0) {
            setHasSubmitted(true);
            const filledAnswers: Record<number, string> = {};
            data.answers.forEach((submission: any) => {
              filledAnswers[submission.questionId] = submission.answer;
            });
            setPreviousAnswers(filledAnswers);
            setAnswers(filledAnswers);
            setFormType("view");
          }
        });
    } else if (isAdmin) {
      // Admin with no clientId: clear answers and show blank form (or view form)
      setHasSubmitted(false);
      setPreviousAnswers({});
      setAnswers({});
      setFormType("intake"); // or "view" depending on your UX choice
    }
  }, [stableClientId, isAdmin]);

  const handleSubmit = async () => {
    // Prepare answers as before
    const fullAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      questionId: parseInt(questionId, 10),
      answer: typeof answer === 'string' ? answer.trim() : answer,
    }));

    // If clientId is required for your backend, you can send null or 'admin' string or omit it
    const submissionPayload = {
      clientId: clientId || null,
      answers: fullAnswers,
      formType,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionPayload),
      });

      if (res.ok) {
        alert('Submission successful!');
        setAnswers({});
        setIsEditing(false);
        setFormType('view');
        // email sending logic as before ...
      } else {
        const data = await res.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`Network error: ${errorMessage}`);
    }
  };
 
  return (
    <div>
   
      <div className="flex space-x-4">
        {!showOnlyView && !hasSubmitted && (
          <button
            onClick={() => {
              setFormType('intake');
              setIsEditing(false);
            }}
            className={`px-6 py-2 min-w-[120px] text-center border rounded active:text-violet-500 focus:outline-none focus:ring
              ${formType === 'intake'
                ? 'bg-violet-600 text-white border-violet-600 hover:bg-transparent hover:text-violet-600'
                : 'bg-gray-200 text-violet-600 border-violet-600 hover:bg-transparent'
              }`}
          >
            Intake Form
          </button>
        )}

        <button
          onClick={() => {
            setFormType('view');
            setIsEditing(false);
          }}
          className={`px-6 py-2 min-w-[120px] text-center border rounded active:text-violet-500 focus:outline-none focus:ring
            ${formType === 'view'
              ? 'bg-violet-600 text-white border-violet-600 hover:bg-transparent hover:text-violet-500'
              : 'bg-gray-200 text-violet-600 border-violet-600 hover:bg-transparent'
            }`}
        >
          View Details
        </button>

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
      </div>

      {(isAdmin || formType === 'view' || (formType === 'intake' && !hasSubmitted)) && (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-md space-y-6 mt-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {formType === 'intake' ? 'Intake Form' : 'View Details'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {questions.map((q) => (
              <div key={q.id} className="space-y-2">
                <label className="block text-gray-700 font-medium">{q.question}</label>

                {(formType === 'intake' || isEditing) ? (
                  q.fieldType === 'textarea' ? (
                    <textarea
                      value={answers[q.id] || ''}
                      onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  ) : q.fieldType === 'radio' && q.options ? (
                    <div className="space-y-1">
                      {typeof q.options === 'string' &&
                        q.options.split(',').map((option, idx) => (
                          <label key={idx} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`question-${q.id}`}
                              value={option.trim()}
                              checked={answers[q.id] === option.trim()}
                              onChange={(e) =>
                                setAnswers({ ...answers, [q.id]: e.target.value })
                              }
                            />
                            <span>{option.trim()}</span>
                          </label>
                        ))}
                    </div>
                  ) : q.fieldType === 'file' ? (
                    <FileUpload questionId={q.id} clientId={clientId || ''} />
                  ) : (
                    <input
                      type={q.fieldType}
                      value={answers[q.id] || ''}
                      onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  )
                ) : (
                  q.fieldType === 'textarea' ? (
                    <textarea
                      value={previousAnswers[q.id] || ''}
                      disabled
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                    />
                  ) : q.fieldType === 'radio' && q.options ? (
                    <div className="space-y-1">
                      {typeof q.options === 'string' &&
                        q.options.split(',').map((option, idx) => (
                          <label key={idx} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`question-${q.id}`}
                              value={option.trim()}
                              checked={previousAnswers[q.id] === option.trim()}
                              disabled
                            />
                            <span>{option.trim()}</span>
                          </label>
                        ))}
                    </div>
                  ) : q.fieldType === 'file' ? (
                    <FileUpload questionId={q.id} clientId={clientId || ''} />
                  ) : (
                    <input
                      type={q.fieldType}
                      value={previousAnswers[q.id] || ''}
                      disabled
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                    />
                  )
                )}
              </div>
            ))}
          </div>

          {formType === 'view' && !isEditing && (
            <button
              onClick={() => {
                setIsEditing(true);
                setAnswers(previousAnswers);
              }}
              className="text-violet-600 hover:underline"
            >
              Edit
            </button>
          )}

          {(formType === 'intake' || isEditing) && (
            <button
              onClick={handleSubmit}
              className="w-full bg-violet-600 text-white font-semibold py-3 rounded-lg hover:bg-violet-700 transition"
            >
              Submit
            </button>
          )}

          {(formType === 'view' || showOnlyView) && (
             <ReviewSection requirementVersionId={requirementVersionId} />
          )}
        </div>
      )}

    </div>
  );

}


