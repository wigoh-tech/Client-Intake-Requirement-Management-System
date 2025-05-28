
'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import Column from './Column';
import UserIntakeForm from '../additional/userIntakeform';
import ReviewSection from '../review/page';
import { MessageSquare } from 'lucide-react'; // You can install lucide-react or replace with emoji/icon

type Task = {
  id: string;
  content: string;
  client: {
    userName: string;
    email: string;
  };
  clientId?: string;
};

type ColumnType = {
  [key in 'todo' | 'inProgress' | 'done']: Task[];
};

export default function KanbanBoard () {
  const [columns, setColumns] = useState<ColumnType>({
    todo: [],
    inProgress: [],
    done: [],
  });

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/requirement');
        const data = await res.json();

        const grouped: ColumnType = {
          todo: [],
          inProgress: [],
          done: [],
        };

        data.forEach((item: any) => {
          const task: Task = {
            id: String(item.id),
            content: item.answer,
            client: item.client,
            clientId: item.clientId,
          };

          const status = item.status as keyof ColumnType;
          if (grouped[status]) {
            grouped[status].push(task);
          }
        });

        setColumns(grouped);
      } catch (error) {
        console.error('Error loading requirements:', error);
      }
    };

    fetchData();
  }, []);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = source.droppableId as keyof ColumnType;
    const destColumn = destination.droppableId as keyof ColumnType;

    if (sourceColumn === destColumn && source.index === destination.index) return;

    const sourceTasks = Array.from(columns[sourceColumn]);
    const destinationTasks = Array.from(columns[destColumn]);
    const [movedTask] = sourceTasks.splice(source.index, 1);

    destinationTasks.splice(destination.index, 0, movedTask);

    setColumns({
      ...columns,
      [sourceColumn]: sourceTasks,
      [destColumn]: destinationTasks,
    });

    try {
      await fetch(`/api/requirement/${movedTask.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: destColumn }),
      });

      if (!movedTask.clientId) {
        const response = await fetch(`/api/requirement/${movedTask.id}`);
        const data = await response.json();
        movedTask.clientId = data.clientId;
      }

      setSelectedTask(movedTask);
    } catch (error) {
      console.error('Failed to update status in DB:', error);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask((prev) => (prev?.id === task.id ? null : task));
    setIsChatOpen(false); // Close chatbox when switching task
  };

  return (
    <>
      {/* Toggle Icon Button */}
      {selectedTask && (
        <div style={{ position: 'fixed', bottom: '30px', right: '40px', zIndex: 1000 }}>
          <button
            onClick={() => setIsChatOpen((prev) => !prev)}
            style={{
              backgroundColor: '#9F2B68',
              border: 'none',
              borderRadius: '10px',
              width: '140px',
              height: '50px',
              display: 'flex',
              gap:'5px',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              textAlign:'center',
              color: '#fff',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
            }}
            title={isChatOpen ? 'Close Chat' : 'Open Chat'}
          >
            
            <MessageSquare size={24} /><p>Let's chat</p>
          </button>
        </div>
      )}

      {/* Kanban Columns */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '16px', marginTop: '150px', marginLeft: '100px' }}>
          {Object.entries(columns).map(([key, tasks]) => (
            <div key={key}>
              <Column columnId={key} tasks={tasks} onTaskClick={handleTaskClick} />
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* User Intake Form */}
      {selectedTask?.clientId && (
        <div style={{ marginTop: '24px', padding: '16px', borderRadius: '8px' }}>
          <UserIntakeForm clientId={selectedTask.clientId} />
        </div>
      )}

      {/* Animated Chatbox */}
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
          transform: isChatOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        {selectedTask && <ReviewSection requirementVersionId={1} />}
      </div>
    </>
  );
};



