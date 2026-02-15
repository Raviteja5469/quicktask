import axios from 'axios';
import { Task, AnalyticsData, User } from '../types';


// ⚠️ CHECK: Ensure your backend terminal says "Running on port 5000"
const NODE_API_URL = import.meta.env.VITE_NODE_API_URL || 'http://localhost:5001/api';
const PYTHON_API_URL = import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:8000';

const nodeClient = axios.create({ baseURL: NODE_API_URL });

nodeClient.interceptors.request.use(request => {
    console.log('🚀 Starting Request:', request.method?.toUpperCase(), request.url);
    return request;
});

// 👇 ADD THIS RESPONSE INTERCEPTOR (Optional but helpful)
nodeClient.interceptors.response.use(
    response => {
        console.log('✅ Response:', response.status, response.config.url);
        return response;
    },
    error => {
        console.error('❌ Error:', error.response?.status, error.config?.url);
        return Promise.reject(error);
    }
);

// Interceptor: This is where the "Magic" happens
// We attach the token to every request so the backend knows who we are.
nodeClient.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('user');
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;
  
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const api = {
  // --- AUTH ---
  login: async (credentials: any) => {
    const response = await nodeClient.post('/users/login', credentials);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (userData: any) => {
    const response = await nodeClient.post('/users', userData);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // --- TASKS ---
  // We don't send ID here because the Token in the header handles it!
  fetchTasks: async (): Promise<Task[]> => {
    const response = await nodeClient.get('/tasks');
    return response.data;
  },

  createTask: async (task: Task): Promise<Task> => {
    // MongoDB creates the ID, so we remove any temp ID from frontend
    const { id, ...taskData } = task;
    const response = await nodeClient.post('/tasks', taskData);
    return response.data;
  },
  
  updateTaskStatus: async (taskId: string, status: string) => {
    const response = await nodeClient.put(`/tasks/${taskId}`, { status });
    return response.data;
  },

  updateTask: async (task: Task): Promise<Task> => {
    const response = await nodeClient.put(`/tasks/${task.id}`, task);
    return response.data;
  },

  deleteTask: async (taskId: string): Promise<void> => {
    await nodeClient.delete(`/tasks/${taskId}`);
  },

  // --- USER PROFILE ---
  updateProfile: async (userData: any) => {
    const response = await nodeClient.put('/users/profile', userData);
    if (response.data.token) {
       localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  deleteAccount: async () => {
    await nodeClient.delete('/users/profile');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // --- ANALYTICS ---
  fetchAnalytics: async (): Promise<AnalyticsData> => {
    const storedUser = localStorage.getItem('user');
    const user: User | null = storedUser ? JSON.parse(storedUser) : null;
    
    // Safety check
    if (!user || !user._id) {
        console.error("User ID missing from local storage");
        throw new Error("User ID not found");
    }

    // Call Python Service
    const response = await axios.get(`${PYTHON_API_URL}/analytics/${user._id}`);
    return response.data;
  }
};