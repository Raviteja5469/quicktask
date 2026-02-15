import React from 'react';
import { Layout, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatCardData } from '../types';

interface StatsRowProps {
    stats: StatCardData[];
}

// Helper to map string to component
const getIcon = (name: string) => {
  switch (name) {
    case 'Layout': return <Layout className="w-5 h-5" />;
    case 'CheckCircle': return <CheckCircle className="w-5 h-5" />;
    case 'Clock': return <Clock className="w-5 h-5" />;
    case 'TrendingUp': return <TrendingUp className="w-5 h-5" />;
    default: return <Layout className="w-5 h-5" />;
  }
};

const StatsRow: React.FC<StatsRowProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</span>
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-neutral-800 text-slate-700 dark:text-primary">
              {getIcon(stat.iconName || 'Layout')}
            </div>
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
            {stat.trend && (
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                stat.positive 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-red-100 text-red-700'
                }`}>
                {stat.trend}
                </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsRow;