'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import Column from './Column';
import IntakeForm from '../intakeForm';

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

const KanbanBoard = () => {
  const [columns, setColumns] = useState<ColumnType>({
    todo: [],
    inProgress: [],
    done: [],
  });

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // ✅ Load all tasks and group by column
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
            clientId: item.clientId, // ✅ Include clientId
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

  // ✅ When a task is moved
  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = source.droppableId as keyof ColumnType;
    const destColumn = destination.droppableId as keyof ColumnType;

    if (
      sourceColumn === destColumn &&
      source.index === destination.index
    )
      return;

    const sourceTasks = Array.from(columns[sourceColumn]);
    const destinationTasks = Array.from(columns[destColumn]);
    const [movedTask] = sourceTasks.splice(source.index, 1);

    destinationTasks.splice(destination.index, 0, movedTask);

    // Optimistically update UI
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

      // ✅ If clientId not already present, fetch it
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
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '16px' }}>
          {Object.entries(columns).map(([key, tasks]) => (
            <div key={key}>
              <Column columnId={key} tasks={tasks} onTaskClick={handleTaskClick} />
            </div>
          ))}
        </div>
      </DragDropContext>

      {selectedTask && (
        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
          <IntakeForm showOnlyView clientId={selectedTask.clientId} />
        </div>
      )}
    </>
  );
};

export default KanbanBoard;
