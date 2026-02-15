import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, CheckSquare } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-white/10 backdrop-blur-md bg-white/70 dark:bg-black/70 transition-colors duration-300"
    >
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <div className="bg-primary p-1.5 rounded-lg text-black">
            <CheckSquare size={20} strokeWidth={3} />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">QuickTask</span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-gray-400">
        <a href="#features" className="hover:text-primary transition-colors">Features</a>
        <a href="#about" className="hover:text-primary transition-colors">About</a>
        <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-slate-700 dark:text-gray-300"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        
        <button 
            onClick={() => navigate('/login')}
            className="px-5 py-2 rounded-full bg-slate-900 dark:bg-primary dark:text-black text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
            Log In
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
