
'use client'
import { useEffect, useState } from 'react';
import FileUpload from './uploadFile';
import ReviewSection from '../components/review/page';

export default function IntakeForm() {
  const [questions, setQuestions] = useState<{
    options: string | boolean;
    fieldType: string;
    id: number;
    question: string;
  }[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [clientId, setClientId] = useState('123WER');
  const [formType, setFormType] = useState<'intake' | 'view'>('intake');
  const [previousAnswers, setPreviousAnswers] = useState<Record<number, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    // Fetch questions
    fetch("/api/intake-questions")
      .then((res) => res.json())
      .then(setQuestions);

    // Fetch previous answers for this client
    fetch(`/api/intake?clientId=${clientId}`)
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
        }
      });
  }, [clientId]);

  const handleSubmit = async () => {
    if (formType === 'view' && isEditing) {
      // Submit full intake answers in edit mode (for requirement version update)
      const fullAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId: parseInt(questionId, 10),
        answer: typeof answer === 'string' ? answer.trim() : answer,
      }));

      try {
        const res = await fetch('/api/intake', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientId,
            answers: fullAnswers,
          }),
        });

        if (res.ok) {
          alert('Requirement version updated successfully!');
          setIsEditing(false);

          // ✅ Send email after successful update
          const formattedAnswers = Object.entries(answers)
            .map(([questionId, answer]) => `<p><strong>Q${questionId}:</strong> ${answer}</p>`)
            .join('');

          try {
            const emailResponse = await fetch('/api/send-mail', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to: 'misham.d24@gmail.com',
                subject: `Intake Form Updated by Client ${clientId}`,
                text: 'An intake form has been updated.',
                html: `
                  <h3>Updated Intake Form</h3>
                  <p><strong>Client ID:</strong> ${clientId}</p>
                  ${formattedAnswers}
                  <p>Updated on: ${new Date().toLocaleString()}</p>
                `,
              }),
            });

            const contentType = emailResponse.headers.get('content-type');

            if (emailResponse.ok && contentType?.includes('application/json')) {
              const result = await emailResponse.json();
              console.log('Email sent (update):', result);
            } else {
              const text = await emailResponse.text();
              console.error('Unexpected response from /api/send-mail (update):', text);
            }
          } catch (error: any) {
            console.error('Email send error (update):', error?.message || error);
          }

        } else {
          const data = await res.json();
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        alert(`Network error: ${errorMessage}`);
      }

      return;
    }

    // Intake submission
    const submission = {
      clientId,
      answers: Object.entries(answers).map(([questionId, answer]) => ({
        questionId: parseInt(questionId, 10),
        answer: typeof answer === 'string' ? answer.trim() : answer,
      })),
      formType,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });

      if (response.ok) {
        alert('Submission successful!');
        setAnswers({});
        setIsEditing(false);
        setFormType('view');

        const formattedAnswers = Object.entries(answers)
          .map(([questionId, answer]) => `<p><strong>Q${questionId}:</strong> ${answer}</p>`)
          .join('');

        try {
          const emailResponse = await fetch('/api/send-mail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: 'misham.d24@gmail.com',
              subject: `New Intake Form Submitted by Client ${clientId}`,
              text: 'A new intake form has been submitted.', // optional plain-text fallback
              html: `
              <h3>New Intake Form Submitted</h3>
              <p><strong>Client ID:</strong> ${clientId}</p>
              ${formattedAnswers}
              <p>Submitted on: ${new Date().toLocaleString()}</p>
            `,
            }),
          });

          const contentType = emailResponse.headers.get('content-type');

          if (emailResponse.ok && contentType?.includes('application/json')) {
            const result = await emailResponse.json();
            console.log('Email sent:', result);
          } else {
            const text = await emailResponse.text();
            console.error('Unexpected response from /api/send-mail:', text);
          }
        } catch (error: any) {
          console.error('Email send error:', error?.message || error);
        }

      } else {
        const data = await response.json();
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
        {!hasSubmitted ? (
          <button
            onClick={() => {
              setFormType('intake');
              setIsEditing(false);
            }}
            className={`py-2 px-4 ${formType === 'intake' ? 'bg-blue-600 text-white' : 'bg-gray-200'} rounded-lg`}
          >
            Intake Form
          </button>
        ) : (
          <button></button>)}
        <button
          onClick={() => {
            setFormType('view');
            setIsEditing(false);
          }}
          className={`py-2 px-4 ${formType === 'view' ? 'bg-blue-600 text-white' : 'bg-gray-200'} rounded-lg`}
        >
          View Details
        </button>
      </div>

      {(formType === 'view' || (formType === 'intake' && !hasSubmitted)) && (
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
                    <FileUpload questionId={q.id} clientId={clientId} />
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
                    <FileUpload questionId={q.id} clientId={clientId} />
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
              className="text-blue-600 hover:underline"
            >
              Edit
            </button>
          )}

          {(formType === 'intake' || isEditing) && (
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Submit
            </button>
          )}

          {formType === 'view' && (
            <ReviewSection requirementVersionId={1} user={{ name: "John" }} />
          )}
        </div>
      )}

    </div>
  );

}


