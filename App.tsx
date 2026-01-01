import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Trinity from './components/Trinity';
import SkillDNA from './components/SkillDNA';
import NexusTerminal from './components/NexusTerminal';
import CyberCursor from './components/CyberCursor';
import { MousePosition } from './types';

const App: React.FC = () => {
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="bg-void min-h-screen text-white selection:bg-phoenyx-500 selection:text-white">
      {/* Global Cursor Effect */}
      <CyberCursor />

      <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center mix-blend-difference pointer-events-none">
        <div className="font-display font-bold text-xl pointer-events-auto cursor-pointer">
          PHOENYX<span className="text-phoenyx-500">.</span>IO
        </div>
        <div className="font-mono text-xs hidden md:block opacity-50">
          STATUS: ONLINE // v4.1
        </div>
        <button className="pointer-events-auto px-6 py-2 border border-white/20 hover:bg-white hover:text-black transition-colors font-mono text-xs uppercase">
          Login
        </button>
      </nav>

      <Hero mousePos={mousePos} />
      
      <div className="relative z-10 bg-void border-t border-slate-900 shadow-[0_-50px_100px_rgba(2,6,23,1)]">
        <Trinity />
        <SkillDNA />
        <NexusTerminal />
      </div>

      <footer className="bg-black py-12 border-t border-slate-900">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-slate-600 text-sm font-mono">
          <div>
            &copy; 2026 Echoes Nexus. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="hover:text-phoenyx-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-phoenyx-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-phoenyx-500 transition-colors">Protocol</a>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default App;