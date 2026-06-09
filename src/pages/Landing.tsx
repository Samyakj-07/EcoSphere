import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Leaf, ArrowRight } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.8 }}
      className="w-full h-full flex flex-col items-center justify-center relative z-20 text-center px-6"
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="glass-panel p-8 md:p-16 flex flex-col items-center max-w-2xl w-full"
      >
        <div className="w-20 h-20 rounded-full bg-eco-green-900/50 border border-eco-green-500/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(52,211,153,0.2)]">
          <Leaf size={40} className="text-eco-green-400" />
        </div>
        
        <div className="inline-flex items-center justify-center px-3 py-1 mb-4 rounded-full border border-eco-green-400/30 bg-eco-green-400/10 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-widest font-bold text-eco-green-400">Virtual Promptwars Edition</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] mb-4">
          EcoSphere
        </h1>
        
        <p className="text-lg md:text-xl text-slate-300 font-light mb-10 max-w-lg leading-relaxed">
          AI-Powered Eco-Intelligence. Track, analyze, and shrink your carbon footprint in real-time.
        </p>
        
        <button 
          onClick={() => navigate('/dashboard')}
          className="group relative inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-full text-sm uppercase tracking-widest font-bold transition-all hover:bg-eco-green-400 hover:text-white hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] focus:outline-none focus:ring-4 focus:ring-eco-green-500/50"
        >
          Initialize App
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </motion.main>
  );
}
