import React, { useState, useEffect } from 'react';
import TaskCard from '../../components/TaskCard';
import MasonryGrid from '../../components/MasonryGrid';
import { Plus, Filter, ArrowUpDown, X, AlertCircle, Save, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '../../types';
import { api } from '../../services/mockApi';

const MyTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);

  // Editing State
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Form State
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    tags: '',
  });
  const [calculatedPriority, setCalculatedPriority] = useState<'low' | 'medium' | 'high'>('low');

  // Load Tasks
  useEffect(() => {
    api.fetchTasks().then((data) => {
        setTasks(data);
        setIsLoading(false);
    });
  }, []);

  // Smart Priority Logic
  useEffect(() => {
    if (!newTask.dueDate) return;

    const due = new Date(newTask.dueDate);
    const now = new Date();
    const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      setCalculatedPriority('high');
    } else if (diffHours < 72) {
      setCalculatedPriority('medium');
    } else {
      setCalculatedPriority('low');
    }
  }, [newTask.dueDate]);

  // Actions
  const openCreatePanel = () => {
      setEditingTaskId(null);
      setNewTask({ title: '', description: '', dueDate: '', tags: '' });
      setIsPanelOpen(true);
  };

  const openEditPanel = (task: Task) => {
      setEditingTaskId(task.id);
      setNewTask({
          title: task.title,
          description: task.description,
          dueDate: task.dueDate, // Assuming format YYYY-MM-DD compatible with type="date"
          tags: task.tags.join(', ')
      });
      setIsPanelOpen(true);
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Process tags
    const processedTags = newTask.tags.split(',').map(t => t.trim()).filter(t => t);

    if (editingTaskId) {
        // Update existing task
        const originalTask = tasks.find(t => t.id === editingTaskId);
        if (!originalTask) return;

        const updatedTask: Task = {
            ...originalTask,
            title: newTask.title,
            description: newTask.description,
            dueDate: newTask.dueDate,
            tags: processedTags,
            priority: calculatedPriority
        };

        await api.updateTask(updatedTask);
        setTasks(tasks.map(t => t.id === editingTaskId ? updatedTask : t));
    } else {
        // Create new task
        const finalTask: Task = {
            id: Math.random().toString(36).substr(2, 9),
            title: newTask.title,
            description: newTask.description,
            dueDate: newTask.dueDate,
            tags: processedTags,
            status: 'pending',
            priority: calculatedPriority
        };
        
        await api.createTask(finalTask);
        setTasks([finalTask, ...tasks]);
    }

    setIsPanelOpen(false);
    setNewTask({ title: '', description: '', dueDate: '', tags: '' });
  };

  const handleDeleteTask = async (taskId: string) => {
      if (window.confirm('Are you sure you want to delete this task?')) {
          await api.deleteTask(taskId);
          setTasks(tasks.filter(t => t.id !== taskId));
          // If we are deleting the task currently being edited, close the panel
          if (editingTaskId === taskId) {
              setIsPanelOpen(false);
          }
      }
  };

  const handleCompleteTask = async (taskId: string) => {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
          const updatedTask = { ...task, status: 'completed' as const };
          await api.updateTask(updatedTask);
          setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
      }
  };

  const filteredTasks = tasks
    .filter(t => filterPriority === 'All' ? true : t.priority === filterPriority.toLowerCase())
    .sort((a, b) => {
        const dateA = new Date(a.dueDate).getTime();
        const dateB = new Date(b.dueDate).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="relative min-h-[80vh]">
      {/* Top Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold dark:text-white">My Tasks</h2>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:flex-none">
                 <select 
                    className="w-full appearance-none pl-10 pr-8 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary outline-none dark:text-white"
                    onChange={(e) => setFilterPriority(e.target.value)}
                 >
                    <option>All Priorities</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                 </select>
                 <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
             </div>

             <div className="relative flex-1 md:flex-none">
                 <select 
                    className="w-full appearance-none pl-10 pr-8 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary outline-none dark:text-white"
                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                 >
                    <option value="asc">Due Date (Soonest)</option>
                    <option value="desc">Due Date (Latest)</option>
                 </select>
                 <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
             </div>

            <button 
                onClick={openCreatePanel}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-primary text-white dark:text-black rounded-xl font-bold text-sm shadow-lg hover:transform hover:scale-105 transition-all"
            >
                <Plus size={18} />
                Create Task
            </button>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
          <div className="text-center py-20 text-gray-500">Loading tasks...</div>
      ) : (
        <MasonryGrid>
            <AnimatePresence>
                {filteredTasks.map(task => (
                    <TaskCard 
                        key={task.id} 
                        task={task} 
                        onEdit={openEditPanel}
                        onDelete={handleDeleteTask}
                        onComplete={handleCompleteTask}
                    />
                ))}
            </AnimatePresence>
        </MasonryGrid>
      )}

      {/* Create/Edit Task Side Panel */}
      <AnimatePresence>
        {isPanelOpen && (
            <>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsPanelOpen(false)}
                    className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
                />
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white dark:bg-neutral-900 z-[70] shadow-2xl flex flex-col border-l border-gray-200 dark:border-neutral-800"
                >
                    <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-gray-50 dark:bg-neutral-900">
                        <h2 className="font-bold text-xl dark:text-white">
                            {editingTaskId ? 'Edit Task' : 'Create New Task'}
                        </h2>
                        <button onClick={() => setIsPanelOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-full transition-colors text-slate-500">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8">
                        <form onSubmit={handleSaveTask} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Task Title</label>
                                <input 
                                    required
                                    autoFocus
                                    value={newTask.title}
                                    onChange={e => setNewTask({...newTask, title: e.target.value})}
                                    type="text" 
                                    placeholder="What needs to be done?" 
                                    className="w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-xl p-4 text-lg font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary placeholder-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                                <textarea 
                                    value={newTask.description}
                                    onChange={e => setNewTask({...newTask, description: e.target.value})}
                                    rows={5}
                                    placeholder="Add details, links, or notes..." 
                                    className="w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-xl p-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Due Date</label>
                                    <input 
                                        required
                                        type="date" 
                                        value={newTask.dueDate}
                                        onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                                        className="w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-xl p-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary [&::-webkit-calendar-picker-indicator]:dark:invert"
                                    />
                                </div>
                                
                                <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-neutral-700">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Projected Priority</label>
                                    <div className={`flex items-center gap-3 font-bold ${
                                        calculatedPriority === 'high' ? 'text-red-500' :
                                        calculatedPriority === 'medium' ? 'text-orange-500' :
                                        'text-green-500'
                                    }`}>
                                        <AlertCircle size={20} />
                                        <span className="capitalize">{calculatedPriority} Priority</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Calculated automatically based on the due date proximity.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tags</label>
                                <input 
                                    value={newTask.tags}
                                    onChange={e => setNewTask({...newTask, tags: e.target.value})}
                                    type="text" 
                                    placeholder="e.g. Design, Urgent (comma separated)" 
                                    className="w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-xl p-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            
                            {/* Spacer */}
                            <div className="h-4"></div>

                            <div className="flex gap-4">
                                {editingTaskId && (
                                    <button 
                                        type="button"
                                        onClick={() => handleDeleteTask(editingTaskId)}
                                        className="px-4 py-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                                <button 
                                    type="submit"
                                    className="flex-1 py-4 bg-slate-900 dark:bg-primary text-white dark:text-black rounded-xl font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                                >
                                    <Save size={20} />
                                    {editingTaskId ? 'Update Task' : 'Save Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyTasks;