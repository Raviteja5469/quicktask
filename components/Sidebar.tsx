import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  PieChart, 
  Settings, 
  LogOut,
  Sparkles,
  Search
} from 'lucide-react';
import { api } from '../services/api';



const Sidebar: React.FC<SidebarProps> = ({ onAiClick }) => {
  // --- NEW: User State ---
  const [user, setUser] = useState({ name: 'User', email: 'Pro Plan' });

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

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/home' },
    { icon: CheckSquare, label: 'My Tasks', path: '/dashboard/tasks' },
    { icon: PieChart, label: 'Analytics', path: '/dashboard/analytics' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white/50 dark:bg-black/50 backdrop-blur-xl border-r border-gray-200 dark:border-neutral-800 z-40 hidden lg:flex flex-col">
      {/* Logo Area */}
      <div className="p-8">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white">
          <div className="bg-primary p-1 rounded-md">
            <CheckSquare size={18} strokeWidth={3} className="text-black" />
          </div>
          <span className="text-xl font-bold tracking-tight">QuickTask</span>
        </div>
      </div>

      {/* Nav Links */}
      <div className="flex-1 px-4 space-y-2">
        <div className="mb-6 relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
             <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-neutral-900 border-none rounded-xl text-sm focus:ring-1 focus:ring-primary outline-none text-slate-700 dark:text-gray-300 placeholder-gray-400"
             />
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive 
                ? 'bg-slate-900 dark:bg-primary text-white dark:text-black font-semibold shadow-lg shadow-slate-200 dark:shadow-none' 
                : 'text-slate-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-white'}
            `}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Bottom Area: AI & Profile */}
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-neutral-800">
            <img 
                src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-neutral-800"
            />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
            <button onClick={api.logout} className="text-gray-400 hover:text-slate-900 dark:hover:text-white" title="Logout">
                <LogOut size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;