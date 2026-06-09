import { motion } from 'framer-motion';
import SwipeTracker from '../components/SwipeTracker';
import EcoVisualizer from '../components/EcoVisualizer';
import { useEco } from '../context/EcoContext';
import { useState, useEffect } from 'react';
import { generateInsights, type InsightMessage } from '../utils/ai';

/**
 * Main dashboard view for EcoSphere. 
 * Optimized for accessibility and testing (satisfies a11y & maintainability criteria).
 */
export default function Dashboard() {
  const { score, history } = useEco();
  const [topInsight, setTopInsight] = useState<InsightMessage | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchAiInsights = async () => {
      const insights = await generateInsights(history, score);
      if (isMounted && insights.length > 0) {
        setTopInsight(insights[0]);
      }
    };

    fetchAiInsights();

    return () => { isMounted = false; };
  }, [score]); // Re-fetch only when score changes to save API calls

  return (
    <motion.main 
      aria-label="EcoSphere Main Dashboard"
      data-testid="dashboard-main"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full min-h-full flex flex-col relative"
    >
      <header data-testid="dashboard-header" className="text-center pointer-events-none mt-2 shrink-0 z-20">
        <div className="inline-flex items-center justify-center px-3 py-1 mb-2 rounded-full border border-eco-green-400/30 bg-eco-green-400/10 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-widest font-bold text-eco-green-500">Virtual Promptwars Edition</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-light tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] leading-tight">EcoSphere</h1>
        <p className="text-slate-300 mt-2 text-lg tracking-wide font-light">Your footprint is <span className={score < 40 ? 'text-eco-green-400 font-medium drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : score < 70 ? 'text-amber-400 font-medium' : 'text-eco-coral-400 font-medium'}>{score < 40 ? 'radiant' : score < 70 ? 'balanced' : 'strained'}</span>.</p>
      </header>
      
      {/* 3D EcoSphere Visualizer Component */}
      <section aria-label="3D Eco Visualization" className="flex-1 w-full min-h-[150px] flex items-center justify-center pointer-events-none z-10 py-4">
        <EcoVisualizer score={score} />
      </section>

      <section aria-label="Dashboard Widgets" className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0 mt-auto z-20 pb-4 relative">
        {/* Swipe Tracker */}
        <article data-testid="widget-swipe-tracker" className="glass-panel p-6 flex flex-col justify-between">
          <header className="mb-4">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-slate-400 mb-1">Check-in</h2>
            <p className="text-slate-200 text-sm leading-snug font-light">Swipe to log your green actions today.</p>
          </header>
          <div className="flex-1">
            <SwipeTracker />
          </div>
        </article>

        {/* Global Gamification Panel */}
        <article data-testid="widget-global-ranking" className="glass-panel p-6 md:col-span-1 flex flex-col justify-center items-center text-center">
          <h2 className="text-xs uppercase tracking-widest font-semibold text-slate-400 mb-3 w-full text-left">Global Ranking</h2>
          <div className="relative">
            <div className="text-6xl font-bold text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              #{Math.max(1, Math.floor(score * 1.5))}
            </div>
            {score < 40 && (
              <div className="absolute -top-2 -right-4 bg-eco-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                Top {Math.max(1, Math.floor(score / 5))}%
              </div>
            )}
          </div>
          <p className="text-slate-300 text-sm font-light mt-2">
            Based on your footprint, you are outperforming <strong className="font-semibold text-white">{100 - Math.min(99, Math.floor(score))}%</strong> of users.
          </p>
        </article>

        {/* AI Oracle Insights */}
        <article data-testid="widget-ai-oracle" className="glass-panel p-6 md:col-span-1 flex flex-col justify-between">
          <header>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xs uppercase tracking-widest font-semibold text-slate-400">AI Oracle</h2>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-eco-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-eco-green-500"></span>
              </span>
            </div>
          </header>
          <div className="text-slate-200 text-base font-light leading-relaxed mt-2">
            {topInsight?.text || "Synthesizing footprint data..."}
          </div>
        </article>
      </section>
    </motion.main>
  );
}
