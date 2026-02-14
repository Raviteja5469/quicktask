import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, Bell, Shield, LogOut } from 'lucide-react';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold mb-8 dark:text-white">Settings</h2>

      <div className="space-y-6">
        {/* Profile */}
        <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-gray-100 dark:border-neutral-800">
            <h3 className="text-lg font-bold mb-6 dark:text-white">Profile Information</h3>
            <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">First Name</label>
                        <input type="text" value="Alex" readOnly className="w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-xl p-3 text-slate-700 dark:text-gray-300" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Last Name</label>
                        <input type="text" value="Designer" readOnly className="w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-xl p-3 text-slate-700 dark:text-gray-300" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                    <input type="email" value="alex@quicktask.com" readOnly className="w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-xl p-3 text-slate-700 dark:text-gray-300" />
                </div>
                <button className="self-start px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black font-semibold rounded-xl">
                    Update Password
                </button>
            </div>
        </div>

        {/* Preferences */}
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

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                         <div className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-lg">
                            <Bell size={20} className="text-blue-500" />
                        </div>
                        <div>
                            <p className="font-medium dark:text-white">Notifications</p>
                            <p className="text-xs text-gray-500">Receive email alerts for high priority tasks</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
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
                    <button className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-colors">
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
