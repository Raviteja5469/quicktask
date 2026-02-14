import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Bell, Menu, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { Task } from '../types';

const DashboardLayout: React.FC = () => {
//   const { toggleTheme } = useTheme();
  const { theme, toggleTheme } = useTheme();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  

  // Real Data State
  const [user, setUser] = useState({ name: 'User' });
  const [urgentTasks, setUrgentTasks] = useState<Task[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  useEffect(() => {
    // 1. Load User
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        try {
            setUser(JSON.parse(storedUser));
        } catch (e) {
            console.error("Failed to parse user data");
        }
    }

    // 2. Fetch Urgent Tasks (High Priority & Not Completed)
    const fetchNotifications = async () => {
        setLoadingNotifs(true);
        try {
            const allTasks = await api.fetchTasks();
            const highPri = allTasks.filter(
                t => t.priority === 'high' && t.status !== 'completed'
            );
            setUrgentTasks(highPri);
        } catch (error) {
            console.error("Failed to fetch notifications");
        } finally {
            setLoadingNotifs(false);
        }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="flex min-h-screen bg-canvas-light dark:bg-canvas-dark text-slate-900 dark:text-white transition-colors duration-300">
      <Sidebar onAiClick={() => setIsAiOpen(true)} />
      
      <main className="flex-1 lg:ml-64 p-6 lg:p-10 relative">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold dark:text-white mb-1">
                    Good Morning, {user.name.split(' ')[0]}
                </h1>
                <p className="text-slate-500 dark:text-gray-400 text-sm">
                   Make today count.
                </p>
            </div>
            
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setIsAiOpen(true)}
                    className="w-[40px] h-[40px] flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all"
                >
                    <Sparkles size={16} />
                </button>
                <button 
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-slate-700 dark:text-gray-300"
                    aria-label="Toggle Theme"
                    >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
                
                {/* Notification Bell */}
                <div className="relative">
                    <button 
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-slate-600 dark:text-gray-400 relative"
                    >
                        <Bell size={20} />
                        {urgentTasks.length > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-black animate-pulse"></span>
                        )}
                    </button>

                    {/* Notification Popover */}
                    <AnimatePresence>
                        {isNotifOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-12 w-80 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800 z-50 overflow-hidden"
                            >
                                <div className="p-4 border-b border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/50 flex justify-between items-center">
                                    <h3 className="font-semibold text-sm">Urgent Tasks</h3>
                                    <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-bold">
                                        {urgentTasks.length}
                                    </span>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {loadingNotifs ? (
                                        <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-gray-400"/></div>
                                    ) : urgentTasks.length > 0 ? (
                                        urgentTasks.map(task => (
                                            <div key={task.id} className="p-4 border-b border-gray-50 dark:border-neutral-800 last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className="text-sm font-medium text-slate-800 dark:text-gray-200 line-clamp-1">{task.title}</p>
                                                    <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded">HIGH</span>
                                                </div>
                                                <p className="text-xs text-gray-500 line-clamp-1">{task.description}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-sm text-gray-500">
                                            No urgent tasks. You're all caught up!
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>

        {/* Content Area */}
        <Outlet />
      </main>

      {/* AI Slide-Over Panel */}
      <AnimatePresence>
        {isAiOpen && (
            <>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsAiOpen(false)}
                    className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
                />
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white dark:bg-neutral-900 z-[70] shadow-2xl flex flex-col border-l border-gray-200 dark:border-neutral-800"
                >
                    <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-neutral-900 dark:to-neutral-900">
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                            <Sparkles size={20} />
                            <h2 className="font-bold text-lg">AI Assistant</h2>
                        </div>
                        <button onClick={() => setIsAiOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    
                    {/* Placeholder for AI Chat */}
                    <div className="flex-1 flex flex-col items-center justify-center p-10 text-center text-gray-400">
                         <Sparkles size={48} className="mb-4 opacity-20" />
                         <p className="text-sm">Connect your Vector Database to enable the AI features.</p>
                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;