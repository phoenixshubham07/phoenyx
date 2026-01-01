import React, { Suspense } from 'react';
import SkillDNAVisualizer from './SkillDNAVisualizer';

const SkillDNA: React.FC = () => {
  return (
    <section className="relative w-full h-[120vh] bg-void overflow-hidden flex flex-col items-center justify-center">
      
      {/* Background 3D Layer */}
      <div className="absolute inset-0 z-0">
         <Suspense fallback={<div className="flex items-center justify-center h-full text-phoenyx-500 font-mono animate-pulse">BOOTING DNA SEQUENCE...</div>}>
            <SkillDNAVisualizer />
         </Suspense>
      </div>

      {/* Overlay Content - Glassmorphism */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pointer-events-none">
        <div className="flex flex-col md:flex-row justify-between items-end h-full pt-20 pb-20">
          
          {/* Left Side: Title */}
          <div className="max-w-xl">
             <div className="inline-block border border-phoenyx-500/30 bg-phoenyx-900/10 backdrop-blur-sm px-4 py-1 rounded-full text-phoenyx-500 font-mono text-xs mb-6">
                SYSTEM CORE: ACTIVE
             </div>
             <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 drop-shadow-[0_0_15px_rgba(0,0,0,1)]">
               SKILL <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">DNA</span>
             </h2>
             <p className="text-slate-300 text-lg md:text-xl font-light backdrop-blur-sm bg-black/30 p-4 rounded-lg border-l-2 border-phoenyx-500">
               Your technical proficiency encoded into a living, evolving double helix. 
               Every submission, every optimization, every failure mutates your DNA.
             </p>
          </div>

          {/* Right Side: Stats (Floating) */}
          <div className="mt-10 md:mt-0 flex flex-col gap-4 pointer-events-auto">
             <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-6 rounded-xl w-64 hover:border-phoenyx-500 transition-colors group">
                <div className="text-xs font-mono text-slate-500 mb-2">SEQUENCE 01</div>
                <div className="text-2xl font-bold text-white group-hover:text-phoenyx-400 transition-colors">Technical Proficiency</div>
                <div className="w-full bg-slate-800 h-1 mt-3 rounded-full overflow-hidden">
                   <div className="bg-phoenyx-500 h-full w-[85%] animate-pulse"></div>
                </div>
             </div>

             <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-6 rounded-xl w-64 hover:border-raiden-500 transition-colors group">
                <div className="text-xs font-mono text-slate-500 mb-2">SEQUENCE 02</div>
                <div className="text-2xl font-bold text-white group-hover:text-raiden-400 transition-colors">Algorithmic Intuition</div>
                 <div className="w-full bg-slate-800 h-1 mt-3 rounded-full overflow-hidden">
                   <div className="bg-raiden-500 h-full w-[72%] animate-pulse delay-75"></div>
                </div>
             </div>

             <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-6 rounded-xl w-64 hover:border-inari-500 transition-colors group">
                <div className="text-xs font-mono text-slate-500 mb-2">SEQUENCE 03</div>
                <div className="text-2xl font-bold text-white group-hover:text-inari-400 transition-colors">System Architecture</div>
                 <div className="w-full bg-slate-800 h-1 mt-3 rounded-full overflow-hidden">
                   <div className="bg-inari-500 h-full w-[94%] animate-pulse delay-150"></div>
                </div>
             </div>
          </div>

        </div>
      </div>
      
      {/* Vignette Overlay for cinematic feel */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#020617_90%)]" />

    </section>
  );
};

export default SkillDNA;