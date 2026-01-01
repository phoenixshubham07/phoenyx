import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html, Line, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { DNA_TOPICS } from '../constants';

// Augment the JSX namespace to include Three.js elements used by @react-three/fiber
// This handles cases where automatic type inference from R3F fails or is missing.
// We extend both global JSX and React.JSX to cover different project configurations.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      octahedronGeometry: any;
      meshStandardMaterial: any;
      ambientLight: any;
      hemisphereLight: any;
      directionalLight: any;
      pointLight: any;
      fog: any;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      octahedronGeometry: any;
      meshStandardMaterial: any;
      ambientLight: any;
      hemisphereLight: any;
      directionalLight: any;
      pointLight: any;
      fog: any;
    }
  }
}

// --- Types ---
interface NodeProps {
  position: THREE.Vector3;
  color: string;
  label: string;
  isHovered: boolean;
  onHover: (status: boolean) => void;
}

// --- Individual DNA Node (Base) ---
const DnaBase = ({ position, color, label, isHovered, onHover }: NodeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
        // Pulsate if hovered
        const scale = isHovered ? 1.5 : 1;
        meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
        meshRef.current.rotation.z += 0.01;
    }
  });

  return (
    <group position={position}>
      <mesh 
        ref={meshRef}
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
      >
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial 
            color={isHovered ? "#ffffff" : color} 
            emissive={color}
            emissiveIntensity={isHovered ? 2 : 0.5}
            wireframe={!isHovered}
        />
      </mesh>
      
      {/* Floating Label */}
      <Html distanceFactor={10} center>
        <div className={`transition-all duration-300 ${isHovered ? 'opacity-100 scale-110' : 'opacity-40 scale-90'} pointer-events-none`}>
          <div className="bg-black/80 backdrop-blur-md border border-slate-700 px-3 py-1 rounded text-xs font-mono whitespace-nowrap text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]">
            <span className="text-phoenyx-500 mr-2">>></span>{label}
          </div>
        </div>
      </Html>
    </group>
  );
};

// --- Connection Line between strands ---
const DnaBond = ({ start, end }: { start: THREE.Vector3, end: THREE.Vector3 }) => {
    return (
        <Line 
            points={[start, end]} 
            color="#334155" 
            transparent 
            opacity={0.3} 
            lineWidth={1} 
        />
    );
};

// --- The Double Helix Structure ---
const DoubleHelix = () => {
    const group = useRef<THREE.Group>(null);
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    // Generate Helix Data
    const helixData = useMemo(() => {
        const points = [];
        const radius = 2.5;
        const height = 15;
        const turns = 2.5;
        const count = DNA_TOPICS.length; 
        
        for (let i = 0; i < count; i++) {
            const t = (i / count);
            const angle = t * Math.PI * 2 * turns;
            const y = (t * height) - (height / 2);

            // Strand A
            const x1 = Math.cos(angle) * radius;
            const z1 = Math.sin(angle) * radius;
            
            // Strand B (Offset by PI)
            const x2 = Math.cos(angle + Math.PI) * radius;
            const z2 = Math.sin(angle + Math.PI) * radius;

            points.push({
                idx: i,
                topic: DNA_TOPICS[i],
                posA: new THREE.Vector3(x1, y, z1),
                posB: new THREE.Vector3(x2, y, z2),
                colorA: i % 2 === 0 ? "#f97316" : "#8b5cf6", // Orange / Purple
                colorB: "#14b8a6" // Teal
            });
        }
        return points;
    }, []);

    useFrame((state) => {
        if (group.current) {
            // Rotate the entire helix slowly
            group.current.rotation.y = state.clock.getElapsedTime() * 0.1;
        }
    });

    return (
        <group ref={group}>
            {helixData.map((data) => (
                <React.Fragment key={data.idx}>
                    {/* Node Strand A (Main Topics) */}
                    <DnaBase 
                        position={data.posA} 
                        color={data.colorA} 
                        label={data.topic} 
                        isHovered={hoveredNode === `A-${data.idx}`}
                        onHover={(h) => setHoveredNode(h ? `A-${data.idx}` : null)}
                    />
                    
                    {/* Node Strand B (Complementary/Abstract) */}
                    <DnaBase 
                        position={data.posB} 
                        color={data.colorB} 
                        label={`0x${data.idx.toString(16).toUpperCase()}`} 
                        isHovered={hoveredNode === `B-${data.idx}`}
                        onHover={(h) => setHoveredNode(h ? `B-${data.idx}` : null)}
                    />

                    {/* Connection Bond */}
                    <DnaBond start={data.posA} end={data.posB} />
                    
                    {/* Vertical Backbone Connectors (Optional visual flair) */}
                    {data.idx > 0 && (
                        <>
                            <Line points={[helixData[data.idx-1].posA, data.posA]} color={data.colorA} transparent opacity={0.2} lineWidth={2} />
                            <Line points={[helixData[data.idx-1].posB, data.posB]} color={data.colorB} transparent opacity={0.2} lineWidth={2} />
                        </>
                    )}
                </React.Fragment>
            ))}
        </group>
    );
};

// --- Animated Lighting Component ---
const AnimatedLighting = () => {
    const mainLightRef = useRef<THREE.DirectionalLight>(null);

    useFrame((state) => {
        if (mainLightRef.current) {
            const t = state.clock.getElapsedTime();
            // Oscillate intensity for "breathing" effect
            mainLightRef.current.intensity = 0.8 + Math.sin(t * 0.5) * 0.3;
            // Slight position shift for dynamic shadows
            mainLightRef.current.position.x = 5 + Math.sin(t * 0.2) * 2;
        }
    });

    return (
        <>
            {/* Softer Ambient Fill */}
            <ambientLight intensity={0.3} />
            
            {/* Hemisphere Light for soft gradient (Sky vs Ground) */}
            <hemisphereLight 
                color="#475569" // Slate sky
                groundColor="#000000" // Void ground
                intensity={0.5} 
            />

            {/* Main Animated Directional Light */}
            <directionalLight 
                ref={mainLightRef} 
                position={[5, 10, 5]} 
                color="#ffffff" 
            />

            {/* Brand Accent Lights */}
            <pointLight position={[15, 5, 5]} intensity={1.2} color="#f97316" distance={30} />
            <pointLight position={[-15, -5, -5]} intensity={1.2} color="#8b5cf6" distance={30} />
        </>
    );
};

const SkillDNAVisualizer: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 12], fov: 40 }} gl={{ alpha: true, antialias: true }}>
        <AnimatedLighting />
        
        {/* Floating Particle Dust */}
        <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />
        
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
            <DoubleHelix />
        </Float>
        
        <fog attach="fog" args={['#020617', 5, 30]} />
      </Canvas>
    </div>
  );
};

export default SkillDNAVisualizer;