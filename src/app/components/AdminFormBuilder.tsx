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

export default function AdminFormBuilder({ onSelect }: { onSelect: (id: string) => void }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");

  useEffect(() => {
    fetch('/api/client')
      .then(res => res.json())
      .then(data => setClients(data));
  }, []);
  useEffect(() => {
    // Check if user is admin
    fetch('/api/user/user-role')
      .then(res => res.json())
      .then(data => setIsAdmin(data.role === 'admin'));

    // Load all intake questions
    fetch('/api/intake-questions')
      .then(res => res.json())
      .then(data => setAvailableQuestions(data));
  }, []);

  const selectedItems = selectedQuestions.map(id =>
    availableQuestions.find((q: any) => q.id === id)
  );

  if (!isAdmin) return <div className="p-6 text-red-500">Access denied</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Form Builder (Admin)</h1>

      <div className="grid grid-cols-2 gap-6">
        {/* Left: Available Questions */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-3">Available Questions</h2>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
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

        {/* Right: Selected + Drag and Drop */}
        <div className="bg-white p-4 rounded shadow">
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
                  q ? <SortableQuestion key={q.id} id={q.id} question={q.question} onRemove={() =>
                    setSelectedQuestions(selectedQuestions.filter(id => id !== q.id))
                  } /> : null
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
      <select
        id="client"
        className="border p-2 rounded w-full"
        value={selectedClientId}
        onChange={(e) => setSelectedClientId(e.target.value)}
      >
        <option value="">-- Select --</option>
        {clients.map((client: any) => (
          <option key={client.id} value={client.id}>
            {client.userName} ({client.email})
          </option>
        ))}
      </select>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
