import { motion } from 'framer-motion';
import { useEco } from '../context/EcoContext';
import { generateInsights } from '../utils/ai';

const containerVars = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVars = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Insights() {
  const { history, score } = useEco();
  const insights = generateInsights(history, score);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full h-full flex flex-col"
    >
      <header className="mb-6 shrink-0">
        <h1 className="text-4xl font-light tracking-tight text-white drop-shadow-md">Insights</h1>
        <p className="text-slate-300 mt-2 text-lg">Your impact analysis & AI coaching.</p>
      </header>
      
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden flex-1 pb-6 pt-2">
        <div className="glass-panel p-8 flex flex-col overflow-hidden">
          <h2 className="text-2xl font-light text-white mb-6 shrink-0">Oracle AI Analysis</h2>
          <motion.div variants={containerVars as any} initial="hidden" animate="show" className="flex flex-col gap-4 overflow-y-auto pr-2 pb-4">
            {insights.map(insight => (
              <motion.div 
                variants={itemVars as any}
                key={insight.id} 
                className={`p-5 rounded-3xl rounded-tl-sm text-sm leading-relaxed border shrink-0 ${
                  insight.type === 'praise' ? 'bg-eco-green-900/40 text-eco-green-400 border-eco-green-500/50' :
                  insight.type === 'suggestion' ? 'bg-blue-900/40 text-blue-300 border-blue-500/50' :
                  'bg-slate-800/40 text-slate-300 border-slate-600/50'
                }`}
              >
                {insight.text}
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        <div className="glass-panel p-8 flex flex-col overflow-hidden">
          <h2 className="text-2xl font-light text-white mb-6 shrink-0">Recent Logged Actions</h2>
          {history.length === 0 ? (
            <div className="h-48 bg-slate-800/50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-700 shrink-0">
              No actions logged yet.
            </div>
          ) : (
            <motion.div variants={containerVars as any} initial="hidden" animate="show" className="flex flex-col gap-3 overflow-y-auto pr-2 pb-4">
              {history.map((action, i) => (
                <motion.div variants={itemVars as any} key={i} className="flex items-center justify-between p-4 border border-slate-700 rounded-2xl bg-slate-900/40 hover:bg-slate-800 transition-colors shrink-0">
                  <span className="text-sm font-medium text-slate-200">{action.text}</span>
                  <span className="text-xs font-bold text-eco-green-400 bg-eco-green-900/50 px-2 py-1 border border-eco-green-500/30 rounded-full">{action.impact} Footprint</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </motion.div>
  );
}
