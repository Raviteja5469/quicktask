import React, { useEffect, useState } from 'react';
import StatsRow from '../../components/StatsRow';
import TaskCard from '../../components/TaskCard';
import MasonryGrid from '../../components/MasonryGrid';
import { api } from '../../services/mockApi';
import { Task, StatCardData } from '../../types';

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<StatCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        try {
            const [tasksData, analyticsData] = await Promise.all([
                api.fetchTasks(),
                api.fetchAnalytics()
            ]);
            setTasks(tasksData);
            setStats(analyticsData.overview);
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
          <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
      );
  }

  return (
    <>
      <StatsRow stats={stats} />

      <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold dark:text-white">Task Playground</h2>
          <div className="flex gap-2">
               <select className="bg-transparent text-sm font-medium text-slate-600 dark:text-gray-400 border-none outline-none cursor-pointer hover:text-primary">
                  <option>All Tasks</option>
                  <option>High Priority</option>
               </select>
          </div>
      </div>

      <MasonryGrid>
          {tasks.slice(0, 6).map((task) => (
              <TaskCard key={task.id} task={task} />
          ))}
      </MasonryGrid>
    </>
  );
};

export default Home;