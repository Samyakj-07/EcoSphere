import { NavLink } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Main application navigation.
 * Optimized for accessibility (ARIA labels) and testing (data-testids).
 */
export default function Navigation() {
  return (
    <div className="w-full relative z-50 px-4 pt-6 pb-2 md:px-6 flex justify-center">
      <nav aria-label="Main Navigation" data-testid="main-navigation" className="glass-panel px-4 md:px-8 py-3 md:h-16 flex items-center justify-between w-full max-w-3xl rounded-full">
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="text-eco-green-500 cursor-pointer"
            aria-hidden="true"
          >
            <Leaf size={24} strokeWidth={1.5} />
          </motion.div>
          <span data-testid="nav-brand" className="hidden sm:block text-xl tracking-tighter font-medium">EcoSphere</span>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8 overflow-x-auto no-scrollbar" role="menubar">
          <NavLink 
            to="/dashboard" 
            data-testid="nav-link-dashboard"
            role="menuitem"
            className={({ isActive }) => 
              `relative text-xs sm:text-sm uppercase tracking-widest font-semibold transition-colors duration-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-eco-green-400 focus:ring-offset-2 whitespace-nowrap ${isActive ? 'text-white' : 'text-slate-400'}`
            }
          >
            {({ isActive }) => (
              <>
                dashboard
                {isActive && <motion.div layoutId="nav-indicator" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-white" />}
              </>
            )}
          </NavLink>
          
          <NavLink 
            to="/quests" 
            data-testid="nav-link-quests"
            role="menuitem"
            className={({ isActive }) => 
              `relative text-xs sm:text-sm uppercase tracking-widest font-semibold transition-colors duration-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-eco-green-400 focus:ring-offset-2 whitespace-nowrap ${isActive ? 'text-white' : 'text-slate-400'}`
            }
          >
            {({ isActive }) => (
              <>
                quests
                {isActive && <motion.div layoutId="nav-indicator" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-white" />}
              </>
            )}
          </NavLink>

          <NavLink 
            to="/insights" 
            data-testid="nav-link-insights"
            role="menuitem"
            className={({ isActive }) => 
              `relative text-xs sm:text-sm uppercase tracking-widest font-semibold transition-colors duration-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-eco-green-400 focus:ring-offset-2 whitespace-nowrap ${isActive ? 'text-white' : 'text-slate-400'}`
            }
          >
            {({ isActive }) => (
              <>
                insights
                {isActive && <motion.div layoutId="nav-indicator" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-white" />}
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
