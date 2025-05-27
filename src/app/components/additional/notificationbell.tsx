'use client';

import { useState, useEffect, useRef } from 'react';

type Notification = {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  formId?: number;
};

type Question = {
  id: number;
  question: string;
};

export default function NotificationBell({ clientId }: { clientId: string }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Your Assigned Form');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Fetch notifications
  useEffect(() => {
    if (!clientId || !showNotifications) return;

    fetch(`/api/notifications?clientId=${encodeURIComponent(clientId)}`)
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error('Failed to fetch notifications:', err));
  }, [clientId, showNotifications]);

  // Fetch form questions when notification clicked
  const handleNotificationClick = async (formId?: number) => {
    if (!formId) return;

    try {
      const res = await fetch(`/api/form-assign/${formId}`);
      const data = await res.json();

      if (Array.isArray(data.questions)) {
        setQuestions(data.questions);
        setAnswers({});
        setShowModal(true);
      }
    } catch (error) {
      console.error('Failed to fetch form data:', error);
    }
  };

  // Submit answers
  const handleSubmit = async () => {
    const payload = {
      clientId,
      answers: Object.entries(answers).map(([questionId, answer]) => ({
        questionId: Number(questionId),
        answer,
      })),
    };

    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        alert('Answers submitted successfully');
        setShowModal(false);
      } else {
        alert(result.message || 'Failed to submit');
      }
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Submission failed');
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Bell Button */}
      <button
        onClick={() => setShowNotifications((prev) => !prev)}
        aria-label="Toggle Notifications"
        className="relative text-3xl p-2 rounded-full hover:text-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
      >
        🔔
        {notifications.some((n) => !n.isRead) && (
          <span className="absolute top-1 right-1 inline-block w-3 h-3 bg-red-600 rounded-full"></span>
        )}
      </button>

      {/* Dropdown */}
      {showNotifications && (
        <div
          ref={dropdownRef}
          className="mt-2 w-80 max-h-96 overflow-y-auto bg-white border rounded shadow-lg"
        >
          <h3 className="font-semibold p-3 border-b">Notifications</h3>
          {notifications.length === 0 ? (
            <p className="p-3 text-gray-500">No notifications</p>
          ) : (
            <ul>
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className="p-3 border-b hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleNotificationClick(n.formId)}
                >
                  <p className="text-sm">{n.message}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}


      {showModal && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
            <h2 className="text-xl font-bold mb-4">{modalTitle}</h2>

            {questions.length === 0 ? (
              <p>No questions found.</p>
            ) : (
              questions.map((q) => (
                <div key={q.id} className="mb-4">
                  <p className="font-medium">{q.question}</p>
                  <input
                    type="text"
                    className="mt-1 border p-2 w-full rounded"
                    placeholder="Your answer"
                    value={answers[q.id] || ''}
                    onChange={(e) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [q.id]: e.target.value,
                      }))
                    }
                  />
                </div>
              ))
            )}

            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
            >
              ×
            </button>

            {/* Submit Button */}
            {questions.length > 0 && (
              <button
                onClick={handleSubmit}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
