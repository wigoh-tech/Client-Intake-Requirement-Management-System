// src/app/client/components/kanban/KanbanBoard.tsx
'use client';
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import Column from './Column';

const initialData = {
    todo: [
      { id: 'task-1', content: 'Draft Requirement' },
    ],
    inProgress: [
      { id: 'task-2', content: 'Client Feedback' },
      { id: 'task-3', content: 'Follow Up' },
    ],
    done: [
      { id: 'task-4', content: 'Finalized' },
    ],
  };
  
  

const KanbanBoard = () => {
  const [columns, setColumns] = useState<{
    [key in 'todo' | 'inProgress' | 'done']: { id: string; content: string }[];
  }>(initialData);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    const sourceCol = [...columns[source.droppableId as 'todo' | 'inProgress' | 'done']];
    if (!destination) return;
    const destCol = [...columns[destination.droppableId as 'todo' | 'inProgress' | 'done']];
    const [movedItem] = sourceCol.splice(source.index, 1);
    destCol.splice(destination.index, 0, movedItem);

    setColumns({
      ...columns,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol,
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: '16px' }}>
        {Object.entries(columns).map(([key, items]) => (
          <Column key={key} columnId={key} tasks={items} />
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
