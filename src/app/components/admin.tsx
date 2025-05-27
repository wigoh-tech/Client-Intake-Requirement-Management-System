import React, { useState } from 'react';
import AdminFormBuilder from './AdminFormBuilder';
import KanbanBoard from './kanban/KanbanBoard';

function Admin() {
  const [activeComponent, setActiveComponent] = useState<'kanban' | 'form' | null>(null);

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setActiveComponent('kanban')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Open Kanban Board
        </button>
        <button
          onClick={() => setActiveComponent('form')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Open Admin Form Builder
        </button>
      </div>

      <div className="mt-4">
        {activeComponent === 'kanban' && <KanbanBoard />}
        {activeComponent === 'form' && <AdminFormBuilder onSelect={function (id: string): void {
                  throw new Error('Function not implemented.');
              } } />}
      </div>
    </div>
  );
}

export default Admin;
