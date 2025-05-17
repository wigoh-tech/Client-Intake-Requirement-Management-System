import React from 'react';
import { Droppable } from '@hello-pangea/dnd';

import TaskCard from './TaskCard';

const Column = ({ columnId, tasks }: any) => {
  return (
    <Droppable droppableId={columnId}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            background: '#ffffff',
            padding: '20px',
            width: '280px',
            minHeight: '320px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e0e0e0',
            transition: 'background 0.3s ease',
          }}
        >
          <h4
            style={{
              fontSize: '18px',
              marginBottom: '16px',
              fontWeight: '600',
              color: '#333',
              letterSpacing: '0.5px',
            }}
          >
            {columnId.toUpperCase()}
          </h4>
          {tasks.map((task: any, index: number) => (
            <TaskCard
              key={`${columnId}-${task.id}`}
              task={task}
              index={index}
              columnId={columnId}
            />
          ))}

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default Column;
