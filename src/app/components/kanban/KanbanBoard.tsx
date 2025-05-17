'use client';
import React, { useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import Column from './Column';

const initialData = {
  todo: [{ id: 'task-1', content: 'Draft Requirement' }],
  inProgress: [
    { id: 'task-2', content: 'Client Feedback' },
    { id: 'task-3', content: 'Follow Up' },
  ],
  done: [{ id: 'task-4', content: 'Finalized' }],
};

const KanbanBoard = () => {
  const [columns, setColumns] = useState<{
    [key in 'todo' | 'inProgress' | 'done']: { id: string; content: string }[];
  }>(initialData);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return; // dropped in the same place, no changes needed
    }

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same column
      const columnTasks = Array.from(
        columns[source.droppableId as keyof typeof columns]
      );
      const [movedTask] = columnTasks.splice(source.index, 1);
      columnTasks.splice(destination.index, 0, movedTask);

      setColumns({
        ...columns,
        [source.droppableId]: columnTasks,
      });
    } else {
      // Moving between different columns
      const sourceTasks = Array.from(
        columns[source.droppableId as keyof typeof columns]
      );
      const destinationTasks = Array.from(
        columns[destination.droppableId as keyof typeof columns]
      );

      const [movedTask] = sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, movedTask);

      setColumns({
        ...columns,
        [source.droppableId]: sourceTasks,
        [destination.droppableId]: destinationTasks,
      });
    }
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
