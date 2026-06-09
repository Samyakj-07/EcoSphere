import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import Navigation from './components/Navigation';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Insights from './pages/Insights';
import Quests from './pages/Quests';
import { EcoProvider } from './context/EcoContext';
import Background3D from './components/Background3D';

function App() {
  const location = useLocation();

  return (
    <EcoProvider>
      {/* Fixed Full-Screen 3D Background */}
      <div className="fixed inset-0 z-[-1] bg-slate-950">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Background3D />
        </Canvas>
      </div>

      {/* Force h-screen and prevent global scroll on desktop */}
      <div className="h-screen w-full font-sans selection:bg-eco-green-500/30 flex flex-col text-slate-100 overflow-hidden">
        {location.pathname !== '/' && <Navigation />}
        <div className="flex-1 w-full max-w-7xl mx-auto px-6 pb-6 pt-2 relative z-10 flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/quests" element={<Quests />} />
              <Route path="/insights" element={<Insights />} />
            </Routes>
          </AnimatePresence>
        </div>
      </div>
    </EcoProvider>
  );
}

export default App;
