import React, { useEffect, useState } from 'react';
import StatsRow from '../../components/StatsRow';
import TaskCard from '../../components/TaskCard';
import MasonryGrid from '../../components/MasonryGrid';
import { api } from '../../services/api';
import { Task, StatCardData } from '../../types';
import { Loader2, Filter } from 'lucide-react';

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<StatCardData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 1️⃣ NEW STATE: Track the active filter
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');

  const refreshDashboard = async () => {
    try {
        const tasksData = await api.fetchTasks(); 
        setTasks(tasksData);

        // Stats Calculation
        const totalTasks = tasksData.length;
        const completedTasks = tasksData.filter(t => t.status === 'completed').length;
        const activeTasks = totalTasks - completedTasks;
        const efficiency = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        setStats([
            { label: 'Total Tasks', value: totalTasks, iconName: 'Layout', trend: 'Total', positive: true },
            { label: 'In Progress', value: activeTasks, iconName: 'Clock', trend: 'Active', positive: true },
            { label: 'Completed', value: completedTasks, iconName: 'CheckCircle', trend: 'Done', positive: true },
            { label: 'Efficiency', value: `${efficiency}%`, iconName: 'TrendingUp', trend: 'Rate', positive: true }
        ]);

    } catch (error) {
        console.error("Failed to refresh dashboard", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    refreshDashboard();
  }, []);

  // 2️⃣ FILTER LOGIC: Sort tasks based on selection
  const filteredTasks = tasks.filter(task => {
    if (filterStatus === 'all') return true;
    return task.status === filterStatus;
  });

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

      {/* Header Row with Filter Options */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold dark:text-white">Task Playground</h2>
            <div className="text-sm text-gray-500">Manage your recent tasks</div>
          </div>

          {/* 3️⃣ NEW UI: Filter Tabs */}
          <div className="flex p-1 bg-gray-100 dark:bg-neutral-900 rounded-xl">
            {(['all', 'pending', 'in-progress', 'completed'] as const).map((status) => (
                <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`
                        px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200
                        ${filterStatus === status 
                            ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }
                    `}
                >
                    {status === 'in-progress' ? 'In Progress' : status}
                </button>
            ))}
          </div>
      </div>

      {filteredTasks.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-neutral-900 rounded-3xl border border-dashed border-gray-200 dark:border-neutral-800">
              <p className="text-gray-500">
                  {filterStatus === 'all' 
                    ? "No tasks found. Create one to get started!" 
                    : `No ${filterStatus} tasks found.`}
              </p>
          </div>
      ) : (
        // 4️⃣ PASS FILTERED TASKS
        <MasonryGrid>
            {filteredTasks.slice(0, 10).map((task) => (
                <TaskCard 
                    key={task._id || (task as any).id} 
                    task={task} 
                    onUpdate={refreshDashboard} 
                />
            ))}
        </MasonryGrid>
      )}
    </>
  );
};

export default Home;