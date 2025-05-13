'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterClient() {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [clientId, setClientId] = useState(''); 
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: any = { userName, email , clientId};
        if (clientId.trim()) payload.id = clientId; 

        const res = await fetch('/api/client', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            setSubmitted(true); 
        } else {
            const data = await res.json();
            alert('Error: ' + data.error);
        }
    };

    if (submitted) {
        return (
            <div className="max-w-md mx-auto p-4 shadow rounded">
                <h1 className="text-xl font-bold">Client Registered!</h1>
                <p className="mt-2">Thank you for registering.</p>
            </div>
        );
    }
    return (
        <div className="max-w-md mx-auto p-4 shadow rounded">
            <h1 className="text-xl mb-4 font-bold">Register Client</h1>
            <form onSubmit={handleSubmit}>
                <label className="block mb-2">
                    User Name:
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                        required
                    />
                </label>

                <label className="block mb-2">
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                        required
                    />
                </label>

                <label className="block mb-2">
                    Client ID (Optional):
                    <input
                        type="text"
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                        placeholder="e.g. 12ERE2"
                    />
                </label>

                <button type="submit" className="bg-blue-600 text-white p-2 rounded mt-4">
                    Register
                </button>
            </form>
        </div>
    );
}
