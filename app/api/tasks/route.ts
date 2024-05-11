// pages/api/tasks.js
import { NextApiRequest, NextApiResponse } from 'next';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

let tasks: Task[] = [];

export const GET = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ tasks });
};

export const POST = (req: NextApiRequest, res: NextApiResponse) => {
  const { title } = req.body;
  const newTask = { id: tasks.length + 1, title, completed: false };
  tasks.push(newTask);
  res.status(201).json({ task: newTask });
};

export const DELETE = (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.body;
  tasks = tasks.filter((task) => task.id !== id);
  res.status(200).json({ message: 'Task deleted' });
};

export const handleNotAllowed = (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
};

