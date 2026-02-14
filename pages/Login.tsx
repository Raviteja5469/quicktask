import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    navigate('/dashboard/home');
  };

  return (
    <div className="min-h-screen bg-canvas-light dark:bg-canvas-dark flex items-center justify-center p-6 text-slate-900 dark:text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6">
             <div className="bg-primary p-1.5 rounded-lg text-black">
                <CheckSquare size={24} strokeWidth={3} />
            </div>
            <span className="text-2xl font-bold tracking-tight">QuickTask</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-slate-500 dark:text-gray-400">Enter your credentials to access your workspace.</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-gray-100 dark:border-neutral-800 shadow-xl shadow-gray-200/50 dark:shadow-none space-y-6">
            <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">Email Address</label>
                <input 
                    type="email" 
                    defaultValue="admin@quicktask.com"
                    className="w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-gray-300">Password</label>
                <input 
                    type="password" 
                    defaultValue="password"
                    className="w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                />
            </div>
            
            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-gray-400">
                    <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                    Remember me
                </label>
                <a href="#" className="text-primary hover:underline font-medium">Forgot password?</a>
            </div>

            <button type="submit" className="w-full bg-slate-900 dark:bg-primary text-white dark:text-black py-4 rounded-xl font-bold hover:opacity-90 transition-opacity">
                Sign In
            </button>
        </form>
        
        <p className="text-center mt-8 text-sm text-slate-500 dark:text-gray-500">
            Don't have an account? <a href="#" className="text-primary font-bold hover:underline">Sign up</a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
