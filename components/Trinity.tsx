import React from 'react';
import { PERSONAS } from '../constants';
import ParallaxCard from './ParallaxCard';

const Trinity: React.FC = () => {
  return (
    <section className="py-24 px-6 md:px-12 bg-void relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            THE TRINITY
          </h2>
          <p className="text-slate-400 font-mono">
            The Intellectual, Social, and Evaluative Framework.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {PERSONAS.map((persona) => (
            <ParallaxCard key={persona.id} className="h-[500px]" intensity={15}>
              <div className="relative h-full w-full bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-xl overflow-hidden group hover:border-opacity-50 hover:border-white transition-colors duration-300 shadow-2xl">
                
                {/* Background Gradient Effect */}
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${persona.gradient} opacity-10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 group-hover:opacity-20 transition-opacity duration-500`} />

                {/* Content Layer (z-index for 3D separation) */}
                <div className="relative z-10 flex flex-col h-full transform transition-transform duration-300 group-hover:translate-z-[20px]">
                  
                  {/* Header */}
                  <div className="mb-6">
                    <span className={`font-mono text-xs font-bold tracking-widest uppercase ${persona.color} mb-2 block`}>
                      {persona.title}
                    </span>
                    <h3 className="text-3xl font-display font-bold text-white">
                      {persona.name}
                    </h3>
                  </div>

                  {/* Body */}
                  <p className="text-slate-300 text-sm leading-relaxed mb-8 flex-grow">
                    {persona.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-3 border-t border-slate-800 pt-6">
                    {persona.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-xs text-slate-400 font-mono">
                        <span className={`w-1.5 h-1.5 rounded-full mr-3 ${persona.color.replace('text-', 'bg-')}`}></span>
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Hover visual cue */}
                  <div className={`mt-6 text-right ${persona.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-mono text-xs`}>
                    // INITIALIZING...
                  </div>
                </div>
              </div>
            </ParallaxCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trinity;