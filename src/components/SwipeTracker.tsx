import { useState } from 'react';
import { Check, X, RotateCcw } from 'lucide-react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { useEco, type ActionId } from '../context/EcoContext';

const DAILY_ACTIONS: { id: ActionId; text: string; impact: number }[] = [
  { id: 'reusable_cup', text: "Did you use a reusable cup today?", impact: -5 },
  { id: 'plant_based', text: "Ate a plant-based meal?", impact: -15 },
  { id: 'transit_bike', text: "Walked, biked or took public transit?", impact: -20 },
  { id: 'cold_wash', text: "Washed clothes in cold water?", impact: -10 },
  { id: 'no_food_waste', text: "Had zero food waste today?", impact: -10 },
  { id: 'second_hand', text: "Bought something second-hand instead of new?", impact: -25 },
  { id: 'short_shower', text: "Took a shower under 5 minutes?", impact: -5 },
  { id: 'turn_off_lights', text: "Turned off lights when leaving rooms?", impact: -2 },
];

export default function SwipeTracker() {
  const { logAction } = useEco();
  const [currentIndex, setCurrentIndex] = useState(0);
  const controls = useAnimation();
  const x = useMotionValue(0);
  
  // Transform x position into rotation and opacity
  const rotate = useTransform(x, [-150, 0, 150], [-15, 0, 15]);
  const opacity = useTransform(x, [-150, -50, 0, 50, 150], [0, 1, 1, 1, 0]);
  const bgIndicator = useTransform(x, [-150, 0, 150], ["#9f1239", "#0f172a", "#064e3b"]); // dark rose to slate to dark green

  if (currentIndex >= DAILY_ACTIONS.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="h-[200px] flex flex-col items-center justify-center text-eco-green-400 text-center p-4"
      >
        <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Check size={48} className="mb-4 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
        </motion.div>
        <p className="text-lg font-medium text-white drop-shadow-md">All caught up for today!</p>
        <button 
          onClick={() => setCurrentIndex(0)} 
          className="mt-6 text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <RotateCcw size={12} /> Reset Dailies for testing
        </button>
      </motion.div>
    );
  }

  const currentAction = DAILY_ACTIONS[currentIndex];

  const handleDragEnd = async (_event: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 100 || velocity > 500) {
      // Swiped Right (Yes)
      await controls.start({ x: 300, opacity: 0, transition: { duration: 0.2 } });
      logAction(currentAction.id, currentAction.text, currentAction.impact);
      setCurrentIndex((prev) => prev + 1);
      controls.set({ x: 0, opacity: 1 });
    } else if (offset < -100 || velocity < -500) {
      // Swiped Left (No)
      await controls.start({ x: -300, opacity: 0, transition: { duration: 0.2 } });
      setCurrentIndex((prev) => prev + 1);
      controls.set({ x: 0, opacity: 1 });
    } else {
      // Snap back
      controls.start({ x: 0, transition: { type: "spring", bounce: 0.5 } });
    }
  };



  return (
    <div className="relative h-[200px] flex items-center justify-center perspective-1000">
      <motion.div 
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x, rotate, opacity, backgroundColor: bgIndicator as any }}
        className="absolute inset-0 border border-slate-700 shadow-xl rounded-2xl p-6 flex flex-col justify-between cursor-grab active:cursor-grabbing z-10"
      >
        <p className="text-white font-medium text-center text-lg mt-2 pointer-events-none">{currentAction.text}</p>
        
        <div className="flex justify-between mt-4 pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-600 text-slate-300 flex items-center justify-center">
            <X size={24} />
          </div>
          <div className="w-14 h-14 rounded-full bg-eco-green-900/50 border border-eco-green-500 text-eco-green-400 flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.3)]">
            <Check size={24} />
          </div>
        </div>
      </motion.div>
      
      {/* Background hint card */}
      <div className="absolute inset-2 bg-slate-900 border border-slate-800 rounded-2xl -z-10 opacity-50"></div>
    </div>
  );
}
