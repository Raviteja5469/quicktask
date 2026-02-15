import React from 'react';
import Navbar from '../components/Navbar';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, BarChart3, Zap, Lock, CheckCircle2, ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 30, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    };

  return (
    <div className="min-h-screen bg-canvas-light dark:bg-black text-slate-900 dark:text-white overflow-hidden selection:bg-primary/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >

            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-slate-900 dark:text-white max-w-5xl">
              Organize chaos. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-800 to-slate-500 dark:from-white dark:to-white/40">
                Amplify focus.
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl text-slate-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              QuickTask merges aesthetic minimalism with powerful analytics. Experience the flow state like never before with our AI-powered workspace.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <button 
                onClick={() => navigate('/login')}
                className="group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 flex items-center gap-2 overflow-hidden"
              >
                <span className="relative z-10">Get Started Free</span>
                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </button>
              <button className="px-8 py-4 bg-transparent text-slate-900 dark:text-white rounded-full font-bold text-lg border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                View Demo
              </button>
            </motion.div>

            {/* Dashboard Mockup - Floating Effect */}
            <motion.div 
                variants={itemVariants}
                className="mt-20 relative w-full max-w-6xl mx-auto perspective-1000"
            >
                <div className="absolute inset-0 bg-primary/20 blur-[120px] -z-10 opacity-30"></div>
                <motion.div
                    whileHover={{ scale: 1.02, rotateX: 2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="rounded-xl bg-gray-900/5 dark:bg-white/5 p-2 ring-1 ring-inset ring-gray-900/10 dark:ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4 backdrop-blur-sm"
                >
                    <img
                        src="/dashboard-mockup.png" // MAKE SURE TO ADD THIS IMAGE TO PUBLIC FOLDER
                        alt="QuickTask Dashboard"
                        className="rounded-md shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10 w-full object-cover"
                    />
                </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-10 border-y border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-widest mb-6">Trusted by productivity enthusiasts at</p>
            <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Placeholders for logos - easy to replace with SVGs */}
                <span className="text-xl font-bold font-sans dark:text-white">ACME Corp</span>
                <span className="text-xl font-bold font-serif dark:text-white">GlobalBank</span>
                <span className="text-xl font-bold font-mono dark:text-white">NextGen</span>
                <span className="text-xl font-bold dark:text-white">Starlight</span>
            </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-white dark:bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
            <div className="mb-20 text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 dark:text-white">Everything you need to <span className="text-primary">ship faster.</span></h2>
                <p className="text-lg text-slate-600 dark:text-gray-400">QuickTask isn't just a list. It's a complete operating system for your daily work, designed to keep you in the zone.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { 
                        icon: BarChart3, 
                        title: 'Real-time Analytics', 
                        desc: 'Stop guessing where your time goes. Visualize your productivity trends with beautiful, interactive charts powered by Python.',
                        color: 'bg-blue-500' 
                    },
                    { 
                        icon: Zap, 
                        title: 'Focus Mode', 
                        desc: 'Eliminate distractions. Our smart interface adapts to your workflow, highlighting only what matters right now.',
                        color: 'bg-amber-500' 
                    },
                    { 
                        icon: Lock, 
                        title: 'Secure by Design', 
                        desc: 'Enterprise-grade encryption for your data. We use JWT authentication and MongoDB for rock-solid persistence.',
                        color: 'bg-purple-500' 
                    }
                ].map((feature, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 }}
                        className="group p-8 rounded-3xl bg-slate-50 dark:bg-neutral-900 border border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary/5"
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg ${feature.color}`}>
                            <feature.icon size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 dark:text-white group-hover:text-primary transition-colors">{feature.title}</h3>
                        <p className="text-slate-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-slate-900 dark:bg-neutral-900 relative overflow-hidden text-center py-20 px-6 border border-slate-800 dark:border-white/10">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/30 blur-[100px] -z-10 rounded-full"></div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to regain control?</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">Join thousands of developers and designers who trust QuickTask to manage their daily workflows.</p>
            
            <button 
                onClick={() => navigate('/login')}
                className="px-10 py-5 bg-primary text-black rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors shadow-lg shadow-primary/25"
            >
                Start for free
            </button>

            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
                <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary"/> No credit card required</span>
                <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary"/> 14-day free trial</span>
                <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary"/> Cancel anytime</span>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center">
                    <span className="font-bold text-white dark:text-black">Q</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">QuickTask</span>
            </div>
            <div className="text-sm text-slate-500 dark:text-gray-500">
                © 2026 QuickTask Inc. Built for the future.
            </div>
            <div className="flex gap-6 text-sm font-medium text-slate-600 dark:text-gray-400">
                <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                <a href="#" className="hover:text-primary transition-colors">Terms</a>
                <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;