import { initialTasks } from '../data/tasks';
import { initialAnalytics } from '../data/analytics';
import { Task, AnalyticsData } from '../types';

// Simulate a database delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage (initialized from TS data)
// In a real app, this would be your database.
let tasksCache: Task[] = [...initialTasks];
let analyticsCache: AnalyticsData = initialAnalytics;

export const api = {
  fetchTasks: async (): Promise<Task[]> => {
    await delay(300); // Simulate network latency
    return [...tasksCache];
  },

  createTask: async (task: Task): Promise<Task> => {
    await delay(500);
    // Add to our "database"
    tasksCache = [task, ...tasksCache];
    console.log("Task saved to mock DB:", task);
    return task;
  },

  updateTask: async (task: Task): Promise<Task> => {
    await delay(400);
    tasksCache = tasksCache.map(t => t.id === task.id ? task : t);
    console.log("Task updated in mock DB:", task);
    return task;
  },

  deleteTask: async (taskId: string): Promise<void> => {
    await delay(300);
    tasksCache = tasksCache.filter(t => t.id !== taskId);
    console.log("Task deleted from mock DB:", taskId);
  },

  fetchAnalytics: async (): Promise<AnalyticsData> => {
    await delay(300);
    return analyticsCache;
  }
};