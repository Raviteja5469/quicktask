import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import { AnalyticsData } from '../../types';
import { Loader2, AlertCircle } from 'lucide-react';

const Analytics: React.FC = () => {
  const { theme } = useTheme();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAnalytics = async () => {
        try {
            const result = await api.fetchAnalytics();
            setData(result);
        } catch (err) {
            console.error("Analytics Error:", err);
            setError("Could not load analytics. Ensure the Python Service is running.");
        } finally {
            setLoading(false);
        }
    };
    loadAnalytics();
  }, []);

  const COLORS = theme === 'dark' 
    ? ['#EF4444', '#F97316', '#22C55E'] 
    : ['#DC2626', '#EA580C', '#16A34A'];

  const barColor = theme === 'dark' ? '#EAB308' : '#0F172A';
  const gridColor = theme === 'dark' ? '#262626' : '#E5E7EB';
  const textColor = theme === 'dark' ? '#9CA3AF' : '#6B7280';

  if (loading) return (
    <div className="flex items-center justify-center h-96">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-96 text-red-500 gap-2">
        <AlertCircle /> {error}
    </div>
  );

  if (!data) return null;

  return (
    <div className="space-y-8 pb-12">
      <h2 className="text-2xl font-bold dark:text-white">Analytics Overview</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.kpi.map((kpi, index) => (
            <div key={index} className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm">
                <p className="text-sm text-gray-500 mb-1">{kpi.label}</p>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{kpi.value}</h3>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart - Weekly Productivity */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-gray-100 dark:border-neutral-800 shadow-sm h-[400px]">
            <h3 className="text-lg font-bold mb-6 dark:text-white">Weekly Productivity</h3>
            {data.weeklyProductivity.length > 0 ? (
                <ResponsiveContainer width="100%" height="85%">
                    <BarChart data={data.weeklyProductivity}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                        <XAxis 
                            dataKey="name" 
                            stroke={textColor} 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                        />
                        <YAxis 
                            stroke={textColor} 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: theme === 'dark' ? '#171717' : '#fff',
                                border: 'none',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        <Bar dataKey="completed" fill={barColor} radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-gray-400">No data available</div>
            )}
        </div>

        {/* Pie Chart - Task Distribution */}
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-gray-100 dark:border-neutral-800 shadow-sm h-[400px]">
            <h3 className="text-lg font-bold mb-6 dark:text-white">Task Distribution</h3>
            {data.taskDistribution.reduce((acc, curr) => acc + curr.value, 0) > 0 ? (
                <>
                <ResponsiveContainer width="100%" height="85%">
                    <PieChart>
                        <Pie
                            data={data.taskDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={110}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.taskDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                             contentStyle={{ 
                                backgroundColor: theme === 'dark' ? '#171717' : '#fff',
                                border: 'none',
                                borderRadius: '12px',
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-2">
                    {data.taskDistribution.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-2 text-sm text-gray-500">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                            {entry.name}: {entry.value}
                        </div>
                    ))}
                </div>
                </>
            ) : (
                <div className="h-full flex items-center justify-center text-gray-400">No tasks to analyze</div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;