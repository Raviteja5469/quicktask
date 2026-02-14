import React, { useEffect, useState } from 'react';
import StatsRow from '../../components/StatsRow';
import TaskCard from '../../components/TaskCard';
import MasonryGrid from '../../components/MasonryGrid';
import { api } from '../../services/api';
import { Task, StatCardData } from '../../types';
import { Loader2 } from 'lucide-react';

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<StatCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        try {
            // 1. Fetch Tasks 
            const tasksData = await api.fetchTasks();
            setTasks(tasksData);

            // 2. Calculate Stats Locally (To fix the "0" issue)
            const totalTasks = tasksData.length;
            const completedTasks = tasksData.filter(t => t.status === 'completed').length;
            const activeTasks = totalTasks - completedTasks; 

            // Calculate Efficiency (just for display)
            const efficiency = totalTasks > 0 
                ? Math.round((completedTasks / totalTasks) * 100) 
                : 0;

            const calculatedStats: StatCardData[] = [
                { 
                    label: 'Total Tasks', 
                    value: totalTasks, 
                    iconName: 'Layout',
                    trend: '+4%', // You can make this dynamic later
                    positive: true
                },
                { 
                    label: 'In Progress', 
                    value: activeTasks, // <--- THE FIX
                    iconName: 'Clock', 
                    trend: 'Active', 
                    positive: true 
                },
                { 
                    label: 'Completed', 
                    value: completedTasks, 
                    iconName: 'CheckCircle', 
                    trend: `+${completedTasks}`, 
                    positive: true 
                },
                { 
                    label: 'Efficiency', 
                    value: `${efficiency}%`, 
                    iconName: 'TrendingUp', 
                    trend: '+2.4%', 
                    positive: true 
                }
            ];

            setStats(calculatedStats);

        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    loadData();
  }, []);

  if (loading) {
      return (
          <div className="flex items-center justify-center h-96">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
      );
  }

  return (
    <>
      <StatsRow stats={stats} />

      <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold dark:text-white">Task Playground</h2>
          <div className="text-sm text-gray-500">
             Showing recent tasks
          </div>
      </div>

      {tasks.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-neutral-900 rounded-3xl border border-dashed border-gray-200 dark:border-neutral-800">
              <p className="text-gray-500">No tasks found. Create one to get started!</p>
          </div>
      ) : (
        <MasonryGrid>
            {tasks.slice(0, 8).map((task) => (
                <TaskCard key={task.id} task={task} />
            ))}
        </MasonryGrid>
      )}
    </>
  );
};

export default Home;