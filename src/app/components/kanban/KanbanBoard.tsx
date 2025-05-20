'use client';
import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import Column from './Column';

type Task = {
  id: string;
  content: string;
  client: {
    userName: string;
    email: string;
  };
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
  
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;
  
    const sourceColumn = source.droppableId as keyof ColumnType;
    const destColumn = destination.droppableId as keyof ColumnType;
  
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
    } catch (error) {
      console.error('Failed to update status in DB:', error);
    }
  };
  

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: '16px' }}>
        {Object.entries(columns).map(([key, tasks]) => (
          <Column key={key} columnId={key} tasks={tasks} />
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
