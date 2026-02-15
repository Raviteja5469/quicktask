import React from 'react';
import { Task } from '../types';
import { motion } from 'framer-motion';
import { Trash2, Check, Edit2, Clock } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onComplete?: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onComplete }) => {
  const priorityColor = {
    high: 'text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400',
    medium: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400',
    low: 'text-green-500 bg-green-50 dark:bg-green-900/20 dark:text-green-400',
  };

  const isCompleted = task.status === 'completed';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isCompleted ? 0.6 : 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group relative mb-6 break-inside-avoid rounded-2xl p-6 transition-all duration-300
        ${isCompleted ? 'bg-gray-50 dark:bg-neutral-900/50' : 'bg-white dark:bg-neutral-900'}
        border border-gray-100 dark:border-neutral-800
        shadow-sm hover:shadow-xl dark:hover:shadow-primary/5
        overflow-hidden`}
    >
        {/* Accent Bar for Dark Mode aesthetics */}
        <div className={`absolute top-0 left-0 w-1 h-full transition-opacity duration-300 
            ${task.priority === 'high' ? 'bg-primary' : 'bg-transparent'} 
            dark:opacity-100 opacity-0`} 
        />

      <div className="flex justify-between items-start mb-3">
        <span className={`px-2 py-1 text-xs font-semibold rounded-md ${priorityColor[task.priority]}`}>
          {task.priority.toUpperCase()}
        </span>
        
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
             {onComplete && !isCompleted && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onComplete(task.id); }}
                    className="p-1.5 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                    title="Mark as Completed"
                >
                    <Check size={14} />
                </button>
             )}
             {onEdit && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                    className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500 dark:text-gray-400"
                    title="Edit Task"
                >
                    <Edit2 size={14} />
                </button>
             )}
             {onDelete && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                    className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                    title="Delete Task"
                >
                    <Trash2 size={14} />
                </button>
             )}
        </div>
      </div>

      <h3 className={`text-lg font-bold text-slate-900 dark:text-gray-100 mb-2 leading-tight ${isCompleted ? 'line-through text-gray-400 dark:text-gray-600' : ''}`}>
        {task.title}
      </h3>
      
      <p className="text-sm text-slate-500 dark:text-gray-400 mb-4 leading-relaxed">
        {task.description}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 dark:border-neutral-800">
        <div className="flex gap-2 flex-wrap">
            {task.tags.map(tag => (
                <span key={tag} className="text-xs text-gray-400 dark:text-gray-500">#{tag}</span>
            ))}
        </div>
        <div className="flex items-center text-xs text-gray-400 font-medium whitespace-nowrap ml-2">
            <Clock size={12} className="mr-1" />
            {task.dueDate}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;