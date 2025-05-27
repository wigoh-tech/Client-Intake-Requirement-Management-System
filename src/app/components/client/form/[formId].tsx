'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Question = {
  id: number;
  question: string;
  fieldType: string;
  options?: string | null;
};

export default function ClientForm() {
  const { formId } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchForm() {
      try {
        const res = await fetch(`/api/form-assign/${formId}`);
        const data = await res.json();

        if (res.ok) {
          setQuestions(data.questions || []);
        } else {
          console.error('Error fetching form:', data.message);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchForm();
  }, [formId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Assigned Form</h1>
      {questions.map((q) => (
        <div key={q.id} className="mb-4 p-3 border rounded bg-gray-50">
          <label className="block mb-1 font-medium">{q.question}</label>
          <input type="text" className="mt-1 border p-2 w-full rounded" />
        </div>
      ))}
    </div>
  );
}
