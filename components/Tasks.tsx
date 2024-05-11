// components/Task.js
import React from 'react';

interface TaskProps {
  task: {
    id: number;
    completed: boolean;
    title: string;
  };
}

export default function Task({ task }: TaskProps) {
  return (
    <div>
      <input type="checkbox" checked={task.completed} />
      <span>{task.title}</span>
      <button>Delete</button>
    </div>
  );
}
