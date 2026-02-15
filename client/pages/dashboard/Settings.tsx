import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, Bell, Shield, Key, Loader2, Check } from 'lucide-react';
import { api } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState({ name: '', email: '' });
  
  // Password Update State
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const getNames = (fullName: string) => {
      const parts = fullName.split(' ');
      return { first: parts[0] || '', last: parts.slice(1).join(' ') || '' };
  };
  const { first, last } = getNames(user.name);

  // --- HANDLERS ---
  const handleUpdatePassword = async () => {
      if (!newPassword) return;
      setIsSaving(true);
      try {
          await api.updateProfile({ password: newPassword });
          setSuccessMsg('Password updated successfully');
          setNewPassword('');
          setTimeout(() => {
              setSuccessMsg('');
              setShowPasswordInput(false);
          }, 2000);
      } catch (err) {
          alert('Failed to update password');
      } finally {
          setIsSaving(false);
      }
  };

  const handleDeleteAccount = async () => {
      if (window.confirm("ARE YOU SURE? This will permanently delete your account and ALL your tasks. This cannot be undone.")) {
          try {
              await api.deleteAccount();
          } catch (err) {
              alert('Failed to delete account');
          }
      }
  };

  return (
    <div className="max-w-3xl pb-20">
      <h2 className="text-2xl font-bold mb-8 dark:text-white">Settings</h2>

      <div className="space-y-6">
        {/* Profile */}
        <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-gray-100 dark:border-neutral-800">
            <h3 className="text-lg font-bold mb-6 dark:text-white">Profile Information</h3>
            <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">First Name</label>
                        <input type="text" value={first} readOnly className="w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-xl p-3 text-slate-700 dark:text-gray-300 opacity-70" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Last Name</label>
                        <input type="text" value={last} readOnly className="w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-xl p-3 text-slate-700 dark:text-gray-300 opacity-70" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                    <input type="email" value={user.email} readOnly className="w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-xl p-3 text-slate-700 dark:text-gray-300 opacity-70" />
                </div>
                
                {/* Password Update Section */}
                <div>
                    {!showPasswordInput ? (
                        <button 
                            onClick={() => setShowPasswordInput(true)}
                            className="self-start px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black font-semibold rounded-xl flex items-center gap-2"
                        >
                            <Key size={16} /> Update Password
                        </button>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-gray-50 dark:bg-neutral-800 p-4 rounded-xl border border-gray-100 dark:border-neutral-700"
                        >
                             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">New Password</label>
                             <div className="flex gap-2">
                                 <input 
                                    type="password" 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="flex-1 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-600 rounded-lg p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                 />
                                 <button 
                                    onClick={handleUpdatePassword}
                                    disabled={isSaving || !newPassword}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
                                 >
                                     {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                                     Save
                                 </button>
                                 <button 
                                    onClick={() => setShowPasswordInput(false)}
                                    className="px-4 py-2 text-gray-500 hover:text-slate-900 dark:hover:text-white"
                                 >
                                     Cancel
                                 </button>
                             </div>
                             {successMsg && <p className="text-green-500 text-sm mt-2 font-medium">{successMsg}</p>}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>

        {/* Preferences (Visual only for now) */}
        <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-gray-100 dark:border-neutral-800">
            <h3 className="text-lg font-bold mb-6 dark:text-white">App Preferences</h3>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-lg">
                            {theme === 'light' ? <Sun size={20} className="text-orange-500"/> : <Moon size={20} className="text-purple-400"/>}
                        </div>
                        <div>
                            <p className="font-medium dark:text-white">Dark Mode</p>
                            <p className="text-xs text-gray-500">Adjust the appearance of the app</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                </div>
            </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-2xl border border-red-100 dark:border-red-900/30">
            <div className="flex items-start gap-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg text-red-600">
                    <Shield size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2">Danger Zone</h3>
                    <p className="text-sm text-red-600/80 dark:text-red-400/70 mb-6">
                        Deleting your account is permanent. All your data will be wiped immediately.
                    </p>
                    <button 
                        onClick={handleDeleteAccount}
                        className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-colors"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;