'use client'
// pages/index.js
import React, { useState, useEffect } from 'react';
import Task from '@/components/Tasks';

interface TaskType {
  id: number;
  task: {
    title: string;
    completed: boolean;
  };
}

export default function Home() {
  const [tasks, setTasks] = useState<TaskType[]>([]);

  useEffect(() => {
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data.tasks))
      .catch((error) => console.error('Error fetching tasks:', error));
  }, []);

  return (
    <div>
      <h1>Welcome to Task Manager!</h1>
      {tasks.map((task) => (
        <Task key={task.id} task={{ id: task.id, ...task.task }} />
      ))}
    </div>
  );
}
