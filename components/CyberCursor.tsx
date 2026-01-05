import React, { useState, useEffect, useRef } from 'react';

interface RiftPoint {
  id: number;
  x: number;
  y: number;
  angle: number;
  length: number;
  thickness: number;
  clipPath: string;
}

// Characters for the matrix rain inside the tear
const MATRIX_CHARS = "01ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍXYZ";

// Generates a jagged, horizontal slash shape
const generateSlashPath = () => {
    const points = [];
    points.push('0% 50%');
    
    // Top edge (random jagged points)
    const steps = 5;
    for(let i=1; i<steps; i++) {
        const x = (i / steps) * 100;
        const y = Math.random() * 35; // 0-35%
        points.push(`${x}% ${y}%`);
    }
    
    points.push('100% 50%');
    
    // Bottom edge
    for(let i=steps-1; i>0; i--) {
        const x = (i / steps) * 100;
        const y = 65 + Math.random() * 35; // 65-100%
        points.push(`${x}% ${y}%`);
    }
    
    return `polygon(${points.join(', ')})`;
};

const RiftParticle = ({ x, y, angle, length, thickness, clipPath }: RiftPoint) => {
    const [rain, setRain] = useState<string[]>([]);
    
    useEffect(() => {
        // Calculate how many columns we need to cover the area
        // Since we counter-rotate the text, we need enough coverage for the diagonal
        // A safe bet is using the maximum dimension for both rows and cols logic roughly
        const maxDim = Math.max(length, thickness);
        const cols = Math.ceil(maxDim / 10) + 2; 
        
        const newRain = Array(cols).fill('').map(() => {
             let s = '';
             // Length of string
             const charCount = Math.ceil(maxDim / 10) + 4;
             for(let i=0; i<charCount; i++) s += MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
             return s;
        });
        setRain(newRain);
    }, [length, thickness]);

    return (
        <div 
            className="fixed pointer-events-none z-[9999] flex justify-center items-center"
            style={{ 
                left: x, 
                top: y,
                width: `${length}px`,
                height: `${thickness}px`,
                transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                clipPath: clipPath,
                // We use a container filter/shadow to simulate the glowing edge of the tear
                filter: 'drop-shadow(0 0 5px rgba(16, 185, 129, 0.5))',
                animation: 'tear-open 0.6s forwards',
            }}
        >
            {/* 
               Counter-rotate the inner content so the "Matrix" stays vertical 
               relative to the screen, creating a "window" effect.
               Scale up slightly to ensure text covers the jagged edges.
            */}
            <div 
                className="absolute flex gap-1 justify-center items-center bg-black"
                style={{
                    width: `${Math.max(length, thickness) * 1.5}px`,
                    height: `${Math.max(length, thickness) * 1.5}px`,
                    transform: `rotate(${-angle}deg)`,
                }}
            >
                {rain.map((str, i) => (
                    <div 
                        key={i} 
                        className="text-[10px] leading-[10px] font-mono font-bold text-emerald-500/90 writing-mode-vertical" 
                        style={{ 
                            writingMode: 'vertical-rl',
                            textOrientation: 'upright',
                            animation: `rain-fall ${0.3 + Math.random() * 0.4}s infinite linear` 
                        }}
                    >
                        {str}
                    </div>
                ))}
            </div>
        </div>
    );
};

const CyberCursor: React.FC = () => {
  const [rifts, setRifts] = useState<RiftPoint[]>([]);
  const idRef = useRef(0);
  const lastPosRef = useRef<{ x: number, y: number } | null>(null);

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      // Throttle updates via RAF
      if (animationFrameId) return;

      animationFrameId = requestAnimationFrame(() => {
        const currentX = e.clientX;
        const currentY = e.clientY;

        if (lastPosRef.current) {
            const dx = currentX - lastPosRef.current.x;
            const dy = currentY - lastPosRef.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Calculate angle of movement (in degrees)
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            // Only spawn if moved enough
            if (distance > 10) {
                const rift: RiftPoint = {
                    id: idRef.current++,
                    x: currentX,
                    y: currentY,
                    angle: angle,
                    // Length depends on speed (stretched out)
                    length: Math.min(200, 40 + distance * 2),
                    // Thickness varies slightly randomly but stays relatively thin
                    thickness: 20 + Math.random() * 20, 
                    clipPath: generateSlashPath()
                };

                setRifts(prev => {
                    const newRifts = [...prev, rift];
                    // Limit number of active rifts
                    if (newRifts.length > 8) return newRifts.slice(newRifts.length - 8);
                    return newRifts;
                });
            }
        }
        
        lastPosRef.current = { x: currentX, y: currentY };
        animationFrameId = 0;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    const cleanupInterval = setInterval(() => {
        setRifts(prev => prev.length > 0 ? prev.slice(1) : prev);
    }, 60);

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        clearInterval(cleanupInterval);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {rifts.map(rift => (
        <RiftParticle 
            key={rift.id}
            {...rift}
        />
      ))}
    </>
  );
};

export default CyberCursor;