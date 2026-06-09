import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Environment, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Interface for the EcoVisualizer component.
 */
interface EcoVisualizerProps {
  score: number; // 0 (best) to 100 (worst)
}

/**
 * Renders the interactive 3D representation of the user's Eco-Score.
 * Highly optimized using useMemo and React.memo.
 * @param {EcoVisualizerProps} props - The score data.
 */
const EcoSphereBlob: React.FC<EcoVisualizerProps> = React.memo(({ score }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Calculate distortion and speed based on score
  const distort = 0.2 + (score / 100) * 0.6;
  const speed = 1 + (score / 100) * 4;
  
  // Color interpolates based on health
  const targetColor = useMemo(() => {
    if (score < 40) return new THREE.Color('#34d399'); // Emerald
    if (score < 70) return new THREE.Color('#fbbf24'); // Amber
    return new THREE.Color('#f43f5e'); // Rose
  }, [score]);

  // Optimization: Memoize geometry to save GPU allocations
  const geometry = useMemo(() => new THREE.SphereGeometry(1.5, 64, 64), []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smooth color transition
      const material = meshRef.current.material as THREE.MeshPhysicalMaterial;
      material.color.lerp(targetColor, delta * 2);
      
      // Interactive Wow Factor: Follow mouse movements
      const targetRotationX = -state.mouse.y * 0.5;
      const targetRotationY = state.mouse.x * 0.5;
      
      meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.1;
      meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} geometry={geometry}>
        <MeshDistortMaterial
          distort={distort}
          speed={speed}
          roughness={0.1}
          metalness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={0.8}
          thickness={1.5}
          color={targetColor}
          emissive={targetColor}
          emissiveIntensity={0.5}
        />
      </mesh>
      {score < 40 && (
        <Sparkles count={50} scale={4} size={2} speed={0.4} opacity={0.5} color="#34d399" />
      )}
    </Float>
  );
});

/**
 * Main 3D Canvas component for the EcoSphere visualization.
 */
const EcoVisualizer: React.FC<EcoVisualizerProps> = React.memo(({ score }) => {
  return (
    <div data-testid="eco-visualizer-container" className="relative flex items-center justify-center w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} className="w-full h-full drop-shadow-2xl">
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <directionalLight position={[-5, -5, -5]} intensity={1} />
        <Environment preset="city" />
        <EcoSphereBlob score={score} />
      </Canvas>
      
      {/* Overlay Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span data-testid="eco-score-display" className="text-5xl md:text-7xl font-light text-slate-800 drop-shadow-md">{score}</span>
        <span className="text-xs md:text-sm uppercase tracking-[0.3em] font-bold text-slate-600 mt-2">Footprint</span>
      </div>
    </div>
  );
});

export default EcoVisualizer;
