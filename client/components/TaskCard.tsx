import React, { useState, useRef, useEffect } from 'react';
import { Clock, MoreVertical, Loader2, Trash2, Edit2 } from 'lucide-react';
import { Task } from '../types';
import { api } from '../services/api'; 

interface TaskCardProps {
  task: Task;
  onUpdate?: () => void; 
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate }) => {
  const [updating, setUpdating] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // ✅ FIX 1: Handle both _id (Mongo) and id (Frontend)
  // This prevents the "undefined" error in your API call
  const taskId = task._id || (task as any).id; 

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      default: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === task.status) return;
    if (!taskId) {
        console.error("❌ Error: Task ID is missing!", task);
        return;
    }

    setUpdating(true);
    try {
      console.log(`🚀 Updating Task: ${taskId} -> ${newStatus}`);
      await api.updateTaskStatus(taskId, newStatus);
      if (onUpdate) onUpdate(); 
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if(!taskId) return;
    if(confirm('Are you sure you want to delete this task?')) {
        try {
            await api.deleteTask(taskId); // Ensure you have this in api.ts
            if (onUpdate) onUpdate();
        } catch (e) { console.error(e); }
    }
  }

  return (
    <div className="group break-inside-avoid mb-6 bg-white dark:bg-neutral-900 rounded-2xl p-5 shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-neutral-800 transition-all duration-200 relative">
      
      {/* Header: Priority & Menu */}
      <div className="flex justify-between items-start mb-3">
        <span className={`text-xs font-bold px-2 py-1 rounded-lg uppercase tracking-wider ${
          task.priority === 'high' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
          task.priority === 'medium' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' :
          'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
        }`}>
          {task.priority}
        </span>

        {/* ✅ FIX 2: Proper Dropdown Menu */}
        <div className="relative" ref={menuRef}>
            <button 
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-400 transition-colors"
            >
                <MoreVertical size={16} />
            </button>

            {showMenu && (
                <div className="absolute right-0 top-8 w-32 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-gray-100 dark:border-neutral-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center gap-2">
                        <Edit2 size={14} /> Edit
                    </button>
                    <button 
                        onClick={handleDelete}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                    >
                        <Trash2 size={14} /> Delete
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* Title & Description */}
      <h3 className="font-bold text-gray-900 dark:text-white mb-2 leading-tight">{task.title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">
        {task.description}
      </p>

      {/* Footer: Date & Status Dropdown */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-neutral-800">
        <div className="flex items-center text-xs text-gray-400">
          <Clock size={12} className="mr-1" />
          {new Date(task.dueDate).toLocaleDateString()}
        </div>

        {/* Status Badge / Dropdown */}
        <div className="relative">
          {updating ? (
            <Loader2 size={16} className="animate-spin text-gray-400" />
          ) : (
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`
                appearance-none cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-full border outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-neutral-900
                ${getStatusColor(task.status)}
              `}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;