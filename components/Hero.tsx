import React from 'react';
import { HERO_CONTENT } from '../constants';
import { MousePosition } from '../types';
import GridScan from './GridScan';

interface HeroProps {
  mousePos: MousePosition;
}

const Hero: React.FC<HeroProps> = ({ mousePos }) => {
  // Calculate parallax offsets based on window center
  const xOffset = (mousePos.x - window.innerWidth / 2) / 50;
  const yOffset = (mousePos.y - window.innerHeight / 2) / 50;

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-black">
      
      {/* Background Grid - GridScan Component */}
      <div className="absolute inset-0 z-0">
        <GridScan
          sensitivity={0.55}
          lineThickness={1}
          linesColor="#392e4e"
          gridScale={0.1}
          scanColor="#FF9FFC"
          scanOpacity={0.4}
          enablePost
          bloomIntensity={0.6}
          chromaticAberration={0.002}
          noiseIntensity={0.01}
        />
      </div>

      {/* Floating Particles/Orbs */}
      <div 
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-phoenyx-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse-slow pointer-events-none"
        style={{ transform: `translate(${xOffset * 4}px, ${yOffset * 4}px)` }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-raiden-600 rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-pulse-slow pointer-events-none"
        style={{ transform: `translate(${xOffset * 3}px, ${yOffset * 3}px)` }}
      />

      {/* Main Content */}
      <div className="z-10 text-center perspective-container">
        
        <h1 
          className="text-xl md:text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600 mb-6 tracking-[0.5em]"
          style={{ 
             transform: `translate(${xOffset * 0.8}px, ${yOffset * 0.8}px)`
          }}
        >
          ALGOPHOENYX
        </h1>

        {/* Massive Animated Tagline */}
        <div 
          className="font-display font-black text-6xl md:text-8xl tracking-wider mb-8 leading-tight"
          style={{ transform: `translate(${xOffset}px, ${yOffset}px)` }}
        >
          <span className="text-slate-200 block md:inline mr-4">FALL.</span>
          <span className="phoenix-burn mr-4">CODE</span>
          <span className="text-slate-200 block md:inline">.BURN.</span>
        </div>

        <p 
          className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto mb-12 leading-relaxed"
          style={{ transform: `translate(${xOffset * 0.5}px, ${yOffset * 0.5}px)` }}
        >
          {HERO_CONTENT.description}
        </p>

        <div className="flex gap-6 justify-center">
          <button className="px-10 py-5 bg-white text-black font-display font-bold hover:bg-phoenyx-500 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)] skew-x-[-10deg]">
            <span className="skew-x-[10deg] inline-block">ENTER THE DOJO</span>
          </button>
          <button className="px-10 py-5 border border-slate-700 text-slate-300 font-mono hover:border-phoenyx-500 hover:text-phoenyx-500 transition-all duration-300 backdrop-blur-sm skew-x-[-10deg]">
             <span className="skew-x-[10deg] inline-block">VIEW PROTOCOL</span>
          </button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 animate-bounce text-slate-500 font-mono text-xs pointer-events-none">
        SCROLL TO INITIALIZE
      </div>
    </section>
  );
};

export default Hero;