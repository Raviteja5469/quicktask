import React, { useState, useEffect, useRef } from 'react';
import TaskCard from '../../components/TaskCard';
import MasonryGrid from '../../components/MasonryGrid';
import { Plus, Filter, ArrowUpDown, X, AlertCircle, Save, Trash2, Search, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '../../types';
import { api } from '../../services/api';

const MyTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- FILTERS STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Date Range Filter
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: '', to: '' });
  const calendarRef = useRef<HTMLDivElement>(null);

  // --- EDITING STATE ---
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    tags: '',
  });
  const [calculatedPriority, setCalculatedPriority] = useState<'low' | 'medium' | 'high'>('low');

  // --- LOAD TASKS ---
  useEffect(() => {
    api.fetchTasks().then((data) => {
        setTasks(data);
        setIsLoading(false);
    });
  }, []);

  // --- CLICK OUTSIDE CALENDAR ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- SMART PRIORITY LOGIC ---
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

  // --- HANDLERS ---
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
          dueDate: task.dueDate,
          tags: task.tags.join(', ')
      });
      setIsPanelOpen(true);
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const processedTags = newTask.tags.split(',').map(t => t.trim()).filter(t => t);

    if (editingTaskId) {
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
        const finalTask: Task = {
            id: Math.random().toString(36).substr(2, 9), 
            title: newTask.title,
            description: newTask.description,
            dueDate: newTask.dueDate,
            tags: processedTags,
            status: 'pending',
            priority: calculatedPriority
        };
        
        const created = await api.createTask(finalTask);
        setTasks([created, ...tasks]);
    }

    setIsPanelOpen(false);
    setNewTask({ title: '', description: '', dueDate: '', tags: '' });
  };

  const handleDeleteTask = async (taskId: string) => {
      if (window.confirm('Are you sure you want to delete this task?')) {
          await api.deleteTask(taskId);
          setTasks(tasks.filter(t => t.id !== taskId));
          if (editingTaskId === taskId) setIsPanelOpen(false);
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

  // --- FILTERING LOGIC ---
  const filteredTasks = tasks
    .filter(t => {
        if (filterPriority !== 'All' && t.priority !== filterPriority.toLowerCase()) return false;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesTitle = t.title.toLowerCase().includes(query);
            const matchesTags = t.tags.some(tag => tag.toLowerCase().includes(query));
            if (!matchesTitle && !matchesTags) return false;
        }
        if (dateRange.from && dateRange.to) {
            const taskDate = new Date(t.dueDate).setHours(0,0,0,0);
            const fromDate = new Date(dateRange.from).setHours(0,0,0,0);
            const toDate = new Date(dateRange.to).setHours(0,0,0,0);
            if (taskDate < fromDate || taskDate > toDate) return false;
        }
        return true;
    })
    .sort((a, b) => {
        const dateA = new Date(a.dueDate).getTime();
        const dateB = new Date(b.dueDate).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  return (
    /* PREMIUM LAYOUT UPDATE:
      1. h-[calc(100vh-9rem)] -> Forces container to fill remaining screen height (adjust 9rem based on your header size)
      2. flex-col -> Stacks header (static) and grid (scrollable)
    */
    <div className="flex flex-col h-[calc(100vh-9rem)]">
      
      {/* --- STATIC HEADER AREA (Will NOT Scroll) --- */}
      <div className="flex-none mb-6">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
            <h2 className="text-2xl font-bold dark:text-white shrink-0">My Tasks</h2>
            
            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                 {/* Search */}
                 <div className="relative flex-1 min-w-[200px] group">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                     <input 
                        type="text" 
                        placeholder="Search by title or #tag..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none dark:text-white transition-all shadow-sm"
                     />
                     {searchQuery && (
                         <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
                             <X size={14} />
                         </button>
                     )}
                 </div>

                 {/* Date Filter */}
                 <div className="relative" ref={calendarRef}>
                     <button 
                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                        className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all ${
                            (dateRange.from || dateRange.to)
                            ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400'
                            : 'bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-slate-700 dark:text-gray-300 hover:bg-gray-50'
                        }`}
                     >
                         <CalendarIcon size={18} />
                         <span className="hidden sm:inline">
                             {(dateRange.from && dateRange.to) 
                                ? (dateRange.from === dateRange.to ? dateRange.from : `${dateRange.from} - ${dateRange.to}`) 
                                : 'Date Range'}
                         </span>
                     </button>

                     <AnimatePresence>
                         {isCalendarOpen && (
                             <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-12 w-72 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800 z-50 p-4"
                             >
                                 <div className="flex justify-between items-center mb-4">
                                     <h3 className="font-bold text-sm dark:text-white">Filter by Date</h3>
                                     {(dateRange.from || dateRange.to) && (
                                         <button 
                                            onClick={() => setDateRange({ from: '', to: '' })}
                                            className="text-xs text-red-500 hover:underline"
                                         >
                                             Clear
                                         </button>
                                     )}
                                 </div>
                                 <div className="space-y-3">
                                     <div>
                                         <label className="block text-xs font-semibold text-gray-500 mb-1">From</label>
                                         <input 
                                            type="date" 
                                            value={dateRange.from}
                                            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-lg p-2 text-sm dark:text-white focus:ring-1 focus:ring-primary"
                                         />
                                     </div>
                                     <div>
                                         <label className="block text-xs font-semibold text-gray-500 mb-1">To</label>
                                         <input 
                                            type="date" 
                                            value={dateRange.to}
                                            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-lg p-2 text-sm dark:text-white focus:ring-1 focus:ring-primary"
                                         />
                                     </div>
                                     <button 
                                        onClick={() => setIsCalendarOpen(false)}
                                        className="w-full mt-2 py-2 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg text-xs font-bold"
                                     >
                                         Apply Filter
                                     </button>
                                 </div>
                             </motion.div>
                         )}
                     </AnimatePresence>
                 </div>

                 {/* Filters */}
                 <div className="relative">
                     <select 
                        className="appearance-none pl-9 pr-8 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary outline-none dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                        onChange={(e) => setFilterPriority(e.target.value)}
                     >
                        <option>All</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                     </select>
                     <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                 </div>

                 <div className="relative">
                     <select 
                        className="appearance-none pl-9 pr-8 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary outline-none dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                        onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                     >
                        <option value="asc">Earliest First</option>
                        <option value="desc">Latest First</option>
                     </select>
                     <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                 </div>

                <button 
                    onClick={openCreatePanel}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-primary text-white dark:text-black rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                    <Plus size={18} />
                    <span className="hidden sm:inline">New Task</span>
                </button>
            </div>
        </div>
      </div>

      {/* --- SCROLLABLE CONTENT AREA (Premium Feel) --- */}
      <div className="flex-1 overflow-y-auto pr-2 pb-10 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-neutral-800 scrollbar-track-transparent">
          {isLoading ? (
              <div className="flex justify-center py-20">
                  <Loader2 className="animate-spin text-primary" size={32} />
              </div>
          ) : (
            <>
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 dark:bg-neutral-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-neutral-800">
                        <p className="text-gray-500 font-medium">No tasks match your filters.</p>
                        <button onClick={() => {setSearchQuery(''); setDateRange({from:'',to:''}); setFilterPriority('All')}} className="text-primary text-sm mt-2 hover:underline">
                            Clear all filters
                        </button>
                    </div>
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
            </>
          )}
      </div>

      {/* Side Panel (Overlay) */}
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