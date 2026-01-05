import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface GuardianProps {
  isSecureMode: boolean; // True when password field is focused
  activityLevel: number; // 0 to 1, based on typing speed/input length
}

const GuardianCore: React.FC<GuardianProps> = ({ isSecureMode, activityLevel }) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  // Colors
  const normalColor = new THREE.Color('#0d9488'); // Darker Teal (Inari)
  const alertColor = new THREE.Color('#c2410c'); // Darker Orange (Phoenyx)
  const activeColor = new THREE.Color('#7c3aed'); // Darker Purple (Raiden)

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const mouseX = (state.mouse.x * Math.PI) / 4;
    const mouseY = (state.mouse.y * Math.PI) / 4;

    // Base Rotation Speed
    const baseSpeed = 0.5 + (activityLevel * 2);
    const alertMultiplier = isSecureMode ? 2.5 : 1;

    // Lerp colors based on state
    const targetColor = isSecureMode ? alertColor : (activityLevel > 0 ? activeColor : normalColor);
    
    if (coreRef.current) {
      // Core pulses and looks at mouse
      coreRef.current.rotation.x = THREE.MathUtils.lerp(coreRef.current.rotation.x, mouseY, 0.1);
      coreRef.current.rotation.y = THREE.MathUtils.lerp(coreRef.current.rotation.y, mouseX, 0.1);
      
      // Pulse scale
      const pulse = 1 + Math.sin(t * 2 * alertMultiplier) * 0.1;
      coreRef.current.scale.setScalar(pulse);
      
      // Update material color
      (coreRef.current.material as THREE.MeshStandardMaterial).color.lerp(targetColor, 0.1);
      (coreRef.current.material as THREE.MeshStandardMaterial).emissive.lerp(targetColor, 0.1);
    }

    if (shellRef.current) {
      shellRef.current.rotation.z -= 0.005 * baseSpeed * alertMultiplier;
      shellRef.current.rotation.x += 0.002 * baseSpeed * alertMultiplier;
    }

    // Rings rotate on different axes
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.2 * baseSpeed * alertMultiplier;
      ring1Ref.current.rotation.y = t * 0.1 * baseSpeed;
      (ring1Ref.current.material as THREE.MeshStandardMaterial).emissive.lerp(targetColor, 0.1);
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = t * -0.3 * baseSpeed * alertMultiplier + 1;
      (ring2Ref.current.material as THREE.MeshStandardMaterial).emissive.lerp(targetColor, 0.1);
    }
    if (ring3Ref.current) {
        ring3Ref.current.rotation.y = t * 0.4 * baseSpeed * alertMultiplier;
        ring3Ref.current.rotation.z = t * 0.1;
        (ring3Ref.current.material as THREE.MeshStandardMaterial).emissive.lerp(targetColor, 0.1);
    }
  });

  return (
    <group>
      {/* Central Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial 
            wireframe 
            emissiveIntensity={2} 
            transparent
            opacity={0.8}
        />
      </mesh>

      {/* Outer Shell of Particles/Geo */}
      <group ref={shellRef}>
         <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh>
              <octahedronGeometry args={[2.5, 0]} />
              <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.05} />
            </mesh>
         </Float>
      </group>

      {/* Rotating Security Rings */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.5, 0.02, 16, 100]} />
        <meshStandardMaterial color="#1e293b" emissiveIntensity={0.5} />
      </mesh>

      <mesh ref={ring2Ref} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[4.2, 0.03, 16, 100]} />
        <meshStandardMaterial color="#1e293b" emissiveIntensity={0.5} />
      </mesh>
      
      <mesh ref={ring3Ref} rotation={[0, Math.PI / 2, 0]}>
         <torusGeometry args={[2.8, 0.05, 16, 3]} />
         <meshStandardMaterial color="#1e293b" emissiveIntensity={1} wireframe />
      </mesh>
      
      {/* Dynamic Light Source inside core */}
      <pointLight 
        position={[0, 0, 0]} 
        intensity={isSecureMode ? 4 : 2} 
        color={isSecureMode ? '#f97316' : '#14b8a6'} 
        distance={15} 
      />
    </group>
  );
};

interface VisualizerProps {
  isSecureMode: boolean;
  activityLevel: number;
}

const AuthGateVisualizer: React.FC<VisualizerProps> = ({ isSecureMode, activityLevel }) => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ antialias: true, alpha: false }}>
        <color attach="background" args={['#020617']} />
        
        {/* Environment */}
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        <Sparkles count={150} scale={12} size={2} speed={0.4} opacity={0.3} color={isSecureMode ? "#f97316" : "#14b8a6"} />
        
        {/* Main Subject */}
        <GuardianCore isSecureMode={isSecureMode} activityLevel={activityLevel} />

        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <fog attach="fog" args={['#020617', 5, 20]} />
      </Canvas>
    </div>
  );
};

export default AuthGateVisualizer;