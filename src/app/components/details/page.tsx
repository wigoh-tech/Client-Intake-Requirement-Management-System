import React from 'react'
import { useUser } from '@clerk/nextjs';
import KanbanBoard from '../kanban/KanbanBoard';
export default function Details() {
    const { user, isLoaded } = useUser();
    if (!isLoaded) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <table className="table-auto border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border">ID</th>
                        <th className="px-4 py-2 border">Email</th>
                        <th className="px-4 py-2 border">Username</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b">{user?.id}</td>
                        <td className="py-2 px-4 border-b">{user?.primaryEmailAddress?.emailAddress}</td>
                        <td className="py-2 px-4 border-b">{user?.username || 'N/A'}</td>
                    </tr>
                </tbody>
            </table>
            <KanbanBoard />
        </div>
    )
}

