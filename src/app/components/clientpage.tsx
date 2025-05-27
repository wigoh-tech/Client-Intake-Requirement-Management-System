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
    <div className="flex">
      {/* Left Side Button */}
      {/* Left Side Buttons */}
      <div className="p-4 space-y-4">
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
        >
          {showForm ? 'Hide User Form' : 'Open User Form'}
        </button>

        <button
          onClick={() => setShowIntakeForm((prev) => !prev)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
        >
          {showIntakeForm ? 'Hide Intake Form' : 'Open Intake Form'}
        </button>
      </div>


      {/* Right Side Content */}
      <div className="flex-1 p-4">
        {clientId ? <NotificationBell clientId={clientId} /> : <p>Loading...</p>}
        {clientId && showForm && <><UserIntakeForm clientId={clientId} /><ReviewSection requirementVersionId={1} /></>}
        {clientId && showIntakeForm && (
          <><IntakeForm clientId={clientId} showOnlyView={false} /><ReviewSection requirementVersionId={1} /></>
        )}
                 
      </div>
    </div>
  );
}
