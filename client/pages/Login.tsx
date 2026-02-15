import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, User, Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api'; // Import the real API

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Add error state
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
        if (isLogin) {
            // Call Real Login API
            await api.login({ 
                email: formData.email, 
                password: formData.password 
            });
        } else {
            // Call Real Register API
            await api.register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
        }
        
        // On success, redirect to dashboard
        navigate('/dashboard/home');

    } catch (err: any) {
        console.error("Auth Error:", err);
        // Show error message from backend or default
        setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
        setIsLoading(false);
    }
  };

  const toggleMode = () => {
      setIsLogin(!isLogin);
      setError(null);
      setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="min-h-screen bg-canvas-light dark:bg-canvas-dark flex items-center justify-center p-6 text-slate-900 dark:text-white transition-colors duration-300">
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
             <div className="bg-primary p-2 rounded-xl text-black shadow-lg shadow-primary/20">
                <CheckSquare size={24} strokeWidth={3} />
            </div>
            <span className="text-2xl font-bold tracking-tight">QuickTask</span>
          </div>
          
          <AnimatePresence mode='wait'>
            <motion.div
                key={isLogin ? 'login-text' : 'signup-text'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
            >
                <h1 className="text-3xl font-bold mb-2">
                    {isLogin ? 'Welcome back' : 'Create an account'}
                </h1>
                <p className="text-slate-500 dark:text-gray-400">
                    {isLogin 
                        ? 'Enter your credentials to access your workspace.' 
                        : 'Start organizing your life with QuickTask today.'}
                </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Auth Form */}
        <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-gray-100 dark:border-neutral-800 shadow-2xl shadow-gray-200/50 dark:shadow-black/50 overflow-hidden relative">
            
            {/* Error Message Display */}
            <AnimatePresence>
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm flex items-start gap-2"
                    >
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                
                {/* Name Field (Sign Up Only) */}
                <AnimatePresence>
                    {!isLogin && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    required={!isLogin}
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="John Doe"
                                    className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-xl pl-11 pr-4 py-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Email Field */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="email" 
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="name@company.com"
                            className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-xl pl-11 pr-4 py-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div>
                    <div className="flex justify-between items-center mb-2 ml-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="password" 
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            placeholder="••••••••"
                            className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-xl pl-11 pr-4 py-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-slate-900 dark:bg-primary text-white dark:text-black py-4 rounded-xl font-bold hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>
                            {isLogin ? 'Sign In' : 'Create Account'}
                            <ArrowRight size={18} strokeWidth={2.5} />
                        </>
                    )}
                </button>
            </form>
        </div>
        
        {/* Toggle Footer */}
        <motion.p 
            layout
            className="text-center mt-8 text-sm text-slate-500 dark:text-gray-500"
        >
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
                onClick={toggleMode} 
                className="text-primary font-bold hover:underline outline-none"
            >
                {isLogin ? 'Sign up' : 'Log in'}
            </button>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;