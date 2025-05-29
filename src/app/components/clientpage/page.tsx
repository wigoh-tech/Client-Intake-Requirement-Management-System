'use client';

import { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import NotificationBell from '../additional/notificationbell';
import UserIntakeForm from '../additional/userIntakeform';
import ReviewSection from '../review/page';

export default function Clientpage() {
  const [clientId, setClientId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [requirementVersionId, setRequirementVersionId] = useState<number | null>(1);
  const [isReviewOpen, setIsReviewOpen] = useState(false); // ✅ Review section toggle

  useEffect(() => {
    async function fetchClientId() {
      try {
        const res = await fetch('/api/get-client-id');
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Failed to fetch client ID');
          setClientId(null);
          return;
        }

        if (data.clientId) {
          setClientId(data.clientId);
          setError(null);
          setRequirementVersionId(1); // Default version
        } else {
          setError('Client ID not found');
        }
      } catch (err) {
        setError('Failed to fetch client ID');
        console.error(err);
      }
    }

    fetchClientId();
  }, []);

  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <>
      <h3
        style={{
          color: '#333',
          fontFamily: 'Arial, sans-serif',
          fontSize: '18px',
          backgroundColor: '#f9f9f9',
          padding: '10px 15px',
          borderLeft: '4px solid #007BFF',
        }}
      >
        If you need customization Form, please contact Admin at:{' '}
        <a href="mailto:admin@gmail.com" style={{ color: '#007BFF', textDecoration: 'none' }}>
          admin@gmail.com
        </a>
      </h3>

      <div className="flex">
        {/* Left Side Buttons */}
        <div className="p-4 space-y-4">
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="px-4 py-2 bg-violet-400 rounded hover:bg-violet-600 w-full"
          >
            {showForm ? 'Hide User Form' : 'Open User Form'}
          </button>
        </div>

        {/* Right Side Content */}
        <div className="flex-1 p-4">
          {clientId ? <NotificationBell clientId={clientId} /> : <p>Loading...</p>}

          {clientId && showForm && <UserIntakeForm clientId={clientId} />}
        </div>
      </div>

      {/* ✅ Floating Icon Button to toggle Review Section */}
      <div
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '40px',
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => setIsReviewOpen((prev) => !prev)}
          style={{
            backgroundColor: '#9F2B68',
            border: 'none',
            borderRadius: '10px',
            width: '140px',
            height: '50px',
            display: 'flex',
            gap: '5px',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            textAlign: 'center',
            color: '#fff',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s',
          }}
          title={isReviewOpen ? 'Close Review' : 'Open Review'}
        >
          <MessageSquare size={24} />
          <p>Review</p>
        </button>
      </div>

      {/* ✅ Sliding Panel for Review Section */}
      <div
        style={{
          position: 'fixed',
          top: '90px',
          right: 0,
          width: '422px',
          maxHeight: '80vh',
          backgroundColor: '#fff',
          boxShadow: '0 0 10px rgba(0,0,0,0.15)',
          borderRadius: '10px 0 0 10px',
          overflowY: 'auto',
          padding: '20px',
          zIndex: 999,
          transform: isReviewOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        {requirementVersionId && <ReviewSection requirementVersionId={requirementVersionId} />}
      </div>
    </>
  );
}
