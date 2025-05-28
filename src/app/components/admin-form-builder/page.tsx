'use client';
import { useEffect, useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Menu, X } from 'lucide-react';

export default function AdminFormBuilder({ onSelect }: { onSelect: (id: string) => void }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    fetch('/api/client')
      .then(res => res.json())
      .then(data => setClients(data));
  }, []);

  useEffect(() => {
    fetch('/api/user/user-role')
      .then(res => res.json())
      .then(data => setIsAdmin(data.role === 'admin'));

    fetch('/api/intake-questions')
      .then(res => res.json())
      .then(data => setAvailableQuestions(data));
  }, []);

  const selectedItems = selectedQuestions.map(id =>
    availableQuestions.find((q: any) => q.id === id)
  );

  if (!isAdmin) return <div className="p-6 text-red-500">Access denied</div>;

  return (
    <div className="max-w-6xl mx-auto mt-20 relative">

      {/* Toggle Button fixed under header top-left */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="fixed top-[4.5rem] left-4 z-40 p-2 mt-5 rounded-full bg-purple-600 text-white hover:bg-purple-700 shadow-lg"
        aria-label={showSidebar ? 'Close sidebar' : 'Open sidebar'}
      >
        {showSidebar ? <X /> : <Menu />}
      </button>

      {/* Sidebar sliding in from left, under header */}
      <div
  className={`fixed top-[4.5rem] mt-13 left-0 h-[calc(100vh-4.5rem)] w-80 bg-white shadow-xl p-4 overflow-y-auto z-30 transition-transform duration-300 ease-in-out
    ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
    scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-200
  `}
>
        <h2 className="text-xl font-semibold mb-3">Available Questions</h2>
        <div className="space-y-2">
          {availableQuestions.map((q: any) => (
            <div
              key={q.id}
              className="p-2 border rounded bg-gray-50 flex justify-between items-center"
            >
              <span>{q.question}</span>
              <button
                className="text-sm text-blue-600"
                onClick={() =>
                  !selectedQuestions.includes(q.id) &&
                  setSelectedQuestions([...selectedQuestions, q.id])
                }
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content (centered) with padding so toggle button doesn't overlap */}
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-3">Form Questions</h2>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={({ active, over }) => {
              if (active.id !== over?.id) {
                const oldIndex = selectedQuestions.indexOf(active.id as number);
                const newIndex = selectedQuestions.indexOf(over?.id as number);
                setSelectedQuestions((items) => arrayMove(items, oldIndex, newIndex));
              }
            }}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={selectedQuestions}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {selectedItems.map((q: any) =>
                  q ? (
                    <SortableQuestion
                      key={q.id}
                      id={q.id}
                      question={q.question}
                      onRemove={() =>
                        setSelectedQuestions(selectedQuestions.filter(id => id !== q.id))
                      }
                    />
                  ) : null
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <select
          id="client"
          className="border p-2 rounded w-full mb-4"
          value={selectedClientId}
          onChange={(e) => setSelectedClientId(e.target.value)}
        >
          <option value="">-- Select Client --</option>
          {clients.map((client: any) => (
            <option key={client.id} value={client.id}>
              {client.userName} ({client.email})
            </option>
          ))}
        </select>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={async () => {
            if (!selectedClientId) {
              alert("Please select a client first.");
              return;
            }
            if (selectedQuestions.length === 0) {
              alert("Please select at least one question.");
              return;
            }

            const res = await fetch('/api/form-assign', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                clientId: selectedClientId,
                questionIds: selectedQuestions,
              }),
            });

            const result = await res.json();
            if (res.ok) {
              alert("Form sent to client!");
            } else {
              alert(`Error: ${result.message}`);
            }
          }}
        >
          Send Form to Client
        </button>
      </div>
    </div>
  );
}

function SortableQuestion({
  id,
  question,
  onRemove,
}: {
  id: number;
  question: string;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="p-3 border rounded bg-violet-100 flex justify-between items-center"
    >
      <span>{question}</span>
      <button className="text-sm text-red-500 ml-4" onClick={onRemove}>
        Remove
      </button>
    </div>
  );
}



