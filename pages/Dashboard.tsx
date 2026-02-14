import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Bell, Menu, X, Send, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_TASKS } from '../constants';

const DashboardLayout: React.FC = () => {
  const { toggleTheme } = useTheme();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // --- NEW: User State ---
  const [user, setUser] = useState({ name: 'User' });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        try {
            setUser(JSON.parse(storedUser));
        } catch (e) {
            console.error("Failed to parse user data");
        }
    }
  }, []);
  // -----------------------

  // Filter high priority tasks for notifications
  const urgentTasks = MOCK_TASKS.filter(t => t.priority === 'high');

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
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-slate-600 dark:text-gray-400"
                    title="Toggle Theme"
                >
                    <Menu className="lg:hidden" size={24} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}/>
                </button>
                
                {/* Notification Bell */}
                <div className="relative">
                    <button 
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-slate-600 dark:text-gray-400 relative"
                    >
                        <Bell size={20} />
                        {urgentTasks.length > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-black"></span>
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
                                <div className="p-4 border-b border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/50">
                                    <h3 className="font-semibold text-sm">Urgent Tasks</h3>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {urgentTasks.length > 0 ? (
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

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                                <Sparkles size={14} />
                            </div>
                            <div className="bg-gray-100 dark:bg-neutral-800 p-4 rounded-2xl rounded-tl-none text-sm text-slate-700 dark:text-gray-300">
                                Hello {user.name.split(' ')[0]}! I've analyzed your project deadlines. You have a board meeting on Tuesday that requires preparation. Should I draft an agenda for you?
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-100 dark:border-neutral-800">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Ask AI anything..."
                                className="w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                <Send size={14} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;