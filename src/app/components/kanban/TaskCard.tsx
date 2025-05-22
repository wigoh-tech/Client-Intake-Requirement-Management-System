import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

const getCardStyle = (columnId: string) => {
  switch (columnId) {
    case 'todo':
      return {
        background: '#fff8db',
        border: '1px solid #f7d98c',
        color: '#996c00',
      };
    case 'inProgress':
      return {
        background: '#e0e0e0',
        border: '1px solid #bdbdbd',
        color: '#555',
        filter: 'blur(0.3px)',
      };
    case 'done':
      return {
        background: '#d4f5dc',
        border: '1px solid #8fdc9d',
        color: '#256029',
      };
    default:
      return {};
  }
};

const TaskCard = ({ task, index, columnId ,onClick}: any) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          onClick={onClick}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            padding: '12px 16px',
            margin: '10px 0',
            borderRadius: '10px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
            fontSize: '16px',
            transition: 'all 0.2s ease',
            cursor: 'grab',
            ...getCardStyle(columnId),
            ...provided.draggableProps.style,
          }}
        >
          {task.content}
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;