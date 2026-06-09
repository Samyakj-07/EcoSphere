import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Float, Cloud, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

// Constants for reliable asset loading
const FLAMINGO_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Flamingo.glb';
const PARROT_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Parrot.glb';

// Preload models for performance
useGLTF.preload(FLAMINGO_URL);
useGLTF.preload(PARROT_URL);

/**
 * Interface defining the properties for a 3D animated bird.
 */
interface BirdPropProps {
  url: string;
  zOffset: number;
  height: number;
  speed?: number;
  phase?: number;
  scale?: number;
}

/**
 * Renders an animated 3D bird that flies across the screen in a linear ping-pong pattern.
 * @param {BirdPropProps} props - The configuration for the bird's flight and model.
 */
const BirdProp: React.FC<BirdPropProps> = React.memo(({ url, zOffset, height, speed = 1, phase = 0, scale = 1 }) => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, group);
  
  // Optimization: Memoize the cloned scene to prevent expensive re-allocations
  const clone = useMemo(() => scene.clone(), [scene]);

  React.useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const actionName = Object.keys(actions)[0];
      actions[actionName]?.play();
      actions[actionName]!.timeScale = speed * 1.5; 
    }
  }, [actions, speed]);

  useFrame((state) => {
    if (group.current) {
      const distance = 15; // Flight path amplitude
      const t = state.clock.elapsedTime * speed * 0.2 + phase;
      
      const x = Math.sin(t) * distance;
      const y = height + Math.sin(state.clock.elapsedTime * 2 + phase) * 0.4;
      
      group.current.position.set(x, y, zOffset);
      
      const isMovingRight = Math.cos(t) > 0;
      group.current.rotation.y = isMovingRight ? Math.PI / 2 : -Math.PI / 2;
    }
  });

  return (
    <group ref={group} scale={scale}>
      <primitive object={clone} />
    </group>
  );
});

/**
 * Interface for the water droplet props.
 */
interface DropPropProps {
  speed?: number;
  rotationIntensity?: number;
  floatIntensity?: number;
  position: [number, number, number];
  scale?: number;
}

/**
 * Renders a highly refractive, glass-like water droplet.
 * @param {DropPropProps} props - The floating and spatial configuration.
 */
const DropProp: React.FC<DropPropProps> = React.memo((props) => {
  // Optimization: Memoize geometry to save GPU memory across instances
  const geometry = useMemo(() => new THREE.SphereGeometry(0.5, 32, 32), []);

  return (
    <Float {...props}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial 
          color="#38bdf8" 
          roughness={0} 
          transmission={1} 
          thickness={1} 
          ior={1.33} 
        />
      </mesh>
    </Float>
  );
});

/**
 * The main background composition containing atmospheric clouds and floating props.
 */
const FloatingProps: React.FC = React.memo(() => {
  const propsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (propsRef.current) {
      propsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group>
      <React.Suspense fallback={null}>
        <BirdProp url={FLAMINGO_URL} zOffset={-5} height={2} speed={1.5} phase={-Math.PI / 4} scale={0.015} />
        <BirdProp url={PARROT_URL} zOffset={-7} height={-1} speed={1.8} phase={3 * Math.PI / 4} scale={0.02} />
      </React.Suspense>
      
      <group ref={propsRef}>
        <DropProp speed={2} rotationIntensity={0} floatIntensity={2} position={[3, 1, -6]} scale={0.4} />
        <DropProp speed={1.5} rotationIntensity={0} floatIntensity={1.5} position={[-2, 2, -8]} scale={0.5} />
      </group>
      
      <Cloud position={[0, -5, -15]} speed={0.2} opacity={0.15} color="#e2e8f0" />
      <Cloud position={[8, 5, -20]} speed={0.1} opacity={0.1} color="#f8fafc" />
    </group>
  );
});

/**
 * The 3D Canvas environment and lighting setup.
 */
const Background3D: React.FC = React.memo(() => {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
      <directionalLight position={[-5, -5, -5]} intensity={1} color="#f8fafc" />
      <Environment preset="city" />
      <FloatingProps />
    </>
  );
});

export default Background3D;
