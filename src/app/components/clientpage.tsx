'use client';

import { useEffect, useState } from 'react';
import NotificationBell from './additional/notificationbell';
import UserIntakeForm from './additional/userIntakeform';
import IntakeForm from './intakeForm';
import ReviewSection from './review/page';

export default function Clientpage() {
  const [clientId, setClientId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false); // New: toggle state
  const [showIntakeForm, setShowIntakeForm] = useState(false);
  const [requirementVersionId, setRequirementVersionId] = useState<number | null>(null);

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
          // Optionally set a default requirementVersionId here if needed
          setRequirementVersionId(1); // Example: default version id
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
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 w-full"
          >
            {showForm ? 'Hide User Form' : 'Open User Form'}
          </button>

          <button
            onClick={() => setShowIntakeForm((prev) => !prev)}
            className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 w-full"
          >
            {showIntakeForm ? 'Hide default Intake Form' : 'Open Default Intake Form'}
          </button>
        </div>

        {/* Right Side Content */}
        <div className="flex-1 p-4">
          {clientId ? <NotificationBell clientId={clientId} /> : <p>Loading...</p>}

          {clientId && showForm && (
            <>
              <UserIntakeForm clientId={clientId} />
              <ReviewSection requirementVersionId={1} />
            </>
          )}

          {clientId && showIntakeForm && requirementVersionId !== null && (
            <IntakeForm
              clientId={clientId}
              showOnlyView={false}
              requirementVersionId={requirementVersionId}
            />
          )}
        </div>
      </div>
    </>
  );
}
