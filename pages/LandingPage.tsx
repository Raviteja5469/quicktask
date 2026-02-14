import React from 'react';
import Navbar from '../components/Navbar';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, BarChart3, Zap, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

  return (
    <div className="min-h-screen bg-canvas-light dark:bg-canvas-dark text-slate-900 dark:text-white overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-primary text-sm font-medium mb-8 border border-slate-200 dark:border-neutral-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                v2.0 is now live
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-slate-900 dark:text-white">
              Organize your chaos.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-gray-500">
                Amplify your focus.
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl text-slate-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              QuickTask merges aesthetic minimalism with powerful project management features. Experience the flow state like never before.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-slate-900 dark:bg-primary text-white dark:text-black rounded-full font-bold text-lg hover:transform hover:scale-105 transition-all duration-200 shadow-xl shadow-slate-200 dark:shadow-primary/20 flex items-center gap-2"
              >
                Get Started Free <ArrowRight size={20} />
              </button>
              <button className="px-8 py-4 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white rounded-full font-bold text-lg border border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                View Demo
              </button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 pointer-events-none opacity-40 dark:opacity-20">
            <div className="absolute top-20 right-0 w-96 h-96 bg-purple-200 dark:bg-purple-900 rounded-full blur-3xl opacity-50 mix-blend-multiply filter"></div>
            <div className="absolute top-40 left-0 w-96 h-96 bg-primary/30 rounded-full blur-3xl opacity-50 mix-blend-multiply filter"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white dark:bg-black relative">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                    { icon: BarChart3, title: 'Task Analytics', desc: 'Visualize your productivity trends with beautiful, interactive charts.' },
                    { icon: Zap, title: 'Productivity Tracking', desc: 'Focus modes and time-tracking built directly into your workflow.' },
                    { icon: Lock, title: 'Cloud Sync', desc: 'End-to-end encrypted synchronization across all your devices.' }
                ].map((feature, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 }}
                        className="p-8 rounded-3xl bg-gray-50 dark:bg-neutral-900 border border-transparent hover:border-gray-200 dark:hover:border-neutral-800 transition-colors"
                    >
                        <div className="w-14 h-14 bg-white dark:bg-black rounded-2xl flex items-center justify-center mb-6 shadow-sm text-primary">
                            <feature.icon size={28} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 dark:text-white">{feature.title}</h3>
                        <p className="text-slate-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-12 px-6 border-t border-gray-200 dark:border-neutral-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-slate-500 dark:text-gray-500">
                © 2023 QuickTask Inc. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm font-medium text-slate-600 dark:text-gray-400">
                <a href="#" className="hover:text-primary">Privacy</a>
                <a href="#" className="hover:text-primary">Terms</a>
                <a href="#" className="hover:text-primary">Twitter</a>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;