import { Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { useEco } from '../context/EcoContext';

const containerVars: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVars: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Quests() {
  const { quests, points } = useEco();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full h-full flex flex-col"
    >
      <header className="mb-6 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-white drop-shadow-md">Smart Quests</h1>
          <p className="text-slate-300 mt-2 text-lg">Weekly challenges dynamically generated for you.</p>
        </div>
        <div className="glass-panel px-6 py-3 flex flex-col items-center">
          <span className="text-xs uppercase font-semibold tracking-wider text-slate-400">Total Points</span>
          <span className="text-2xl font-medium text-eco-green-400 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
            <Sparkles size={20} /> {points}
          </span>
        </div>
      </header>
      <motion.main 
        variants={containerVars}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2 pb-6 pt-2"
      >
        {quests.map(quest => {
          const progress = (quest.currentCount / quest.targetCount) * 100;
          return (
            <motion.div variants={itemVars} key={quest.id} className={`glass-panel p-6 relative overflow-hidden transition-all duration-300 ${quest.completed ? 'opacity-70 border-eco-green-500/50 bg-eco-green-900/10' : ''}`}>
              {!quest.completed && (
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles size={64} className="text-eco-peach-400" />
                </div>
              )}
              <h3 className="font-medium text-white text-xl mb-2 relative z-10 flex items-center gap-2">
                {quest.title} {quest.completed && <CheckCircle2 className="text-eco-green-500" size={24} />}
              </h3>
              
              <p className="text-slate-300 text-sm mb-6 relative z-10 h-10">{quest.description}</p>
              
              {!quest.completed ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-600">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-amber-400 to-eco-peach-400 rounded-full shadow-sm"
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-400">{quest.currentCount} / {quest.targetCount}</span>
                  </div>
                  <div className="flex items-center gap-2 text-eco-peach-400 text-sm font-medium">
                    <Sparkles size={16} />
                    <span>Reward: {quest.points} Points</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-eco-green-400 font-medium">
                  <CheckCircle2 size={20} />
                  <span>+{quest.points} Points Earned</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.main>
    </motion.div>
  );
}
