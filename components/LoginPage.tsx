import React, { useState, useEffect, useRef, useCallback } from 'react';
import AuthGateVisualizer from './AuthGateVisualizer';

interface LoginPageProps {
  onBack: () => void;
}

type TerminalLine = {
  id: string;
  text: string;
  sender: 'SYSTEM' | 'USER';
  variant?: 'DEFAULT' | 'ERROR' | 'SUCCESS' | 'WARNING';
};

type LoginStep = 'INIT' | 'USERNAME' | 'PASSWORD' | 'PROCESSING' | 'DONE';

const LoginPage: React.FC<LoginPageProps> = ({ onBack }) => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [step, setStep] = useState<LoginStep>('INIT');
  const [cursorVisible, setCursorVisible] = useState(true);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sequenceStarted = useRef(false);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines, step]);

  // Blinking Cursor
  useEffect(() => {
    const i = setInterval(() => setCursorVisible(v => !v), 500);
    return () => clearInterval(i);
  }, []);

  const addLine = useCallback((text: string, sender: 'SYSTEM' | 'USER', variant: TerminalLine['variant'] = 'DEFAULT') => {
    setLines(prev => [...prev, { 
      id: Math.random().toString(36).substring(2, 11), 
      text, 
      sender, 
      variant 
    }]);
  }, []);

  // Boot Sequence
  useEffect(() => {
    if (step === 'INIT' && !sequenceStarted.current) {
      sequenceStarted.current = true;
      setLines([]); // Clear only on fresh start
      
      const timeouts: number[] = [];
      const schedule = (fn: () => void, ms: number) => {
        timeouts.push(window.setTimeout(fn, ms));
      };

      schedule(() => addLine("ESTABLISHING SECURE CONNECTION...", 'SYSTEM'), 500);
      schedule(() => addLine("LOADING NEURAL EMBEDDINGS...", 'SYSTEM'), 1500);
      schedule(() => addLine("CRYPTOGRAPHIC HANDSHAKE: SYNCHRONIZED.", 'SYSTEM', 'SUCCESS'), 2400);
      schedule(() => {
        addLine("PLEASE IDENTIFY YOURSELF.", 'SYSTEM');
        setStep('USERNAME');
      }, 3000);

      return () => {
        // We only clear timeouts if component unmounts.
        // If we want to persist state across re-renders (strict mode), we rely on the ref check.
        timeouts.forEach(clearTimeout);
      };
    }
  }, [step, addLine]);

  // Auto-focus input
  useEffect(() => {
    if (step === 'USERNAME' || step === 'PASSWORD' || step === 'DONE') {
      const timer = setTimeout(() => {
        if(inputRef.current) inputRef.current.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() && step !== 'DONE') return;
    
    const val = inputValue;
    setInputValue('');

    if (step === 'USERNAME') {
      addLine(val, 'USER');
      // Simulate lookup delay
      setTimeout(() => {
         addLine(`IDENTITY RECOGNIZED: [${val.toUpperCase()}]`, 'SYSTEM', 'SUCCESS');
         addLine("ENTER ACCESS KEY:", 'SYSTEM');
         setStep('PASSWORD');
      }, 600);
    } else if (step === 'PASSWORD') {
      addLine("•".repeat(val.length), 'USER');
      setStep('PROCESSING');
      
      addLine("VERIFYING HASH...", 'SYSTEM', 'WARNING');
      
      // Verification Simulation
      setTimeout(() => {
        addLine("ERROR: INVALID CREDENTIALS.", 'SYSTEM', 'ERROR');
        addLine("PROTOCOL BETA ACCESS RESTRICTED.", 'SYSTEM', 'ERROR');
        addLine("RETRY SEQUENCE? (Y/N)", 'SYSTEM', 'WARNING');
        setStep('DONE');
      }, 2000);
    } else if (step === 'DONE') {
       addLine(val, 'USER');
       if (val.toLowerCase() === 'y' || val.toLowerCase() === 'yes') {
         sequenceStarted.current = false; // Reset lock for restart
         setStep('INIT');
       } else {
         onBack();
       }
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-mono flex items-center justify-center">
      
      {/* 3D Background */}
      <AuthGateVisualizer isSecureMode={step === 'PASSWORD'} activityLevel={step === 'USERNAME' ? 0.8 : 0} />
      
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/70 z-10 pointer-events-none"></div>

      {/* Scanlines Effect */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-20 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]"></div>

      {/* Terminal Window */}
      <div className="relative z-20 w-full max-w-3xl p-6">
         <div className="bg-slate-950/90 border border-slate-700/80 rounded-lg shadow-[0_0_100px_rgba(0,0,0,0.8)] backdrop-blur-md flex flex-col min-h-[500px] max-h-[80vh] animate-in fade-in zoom-in duration-500">
            
            {/* Terminal Header */}
            <div className="bg-slate-900/80 px-4 py-3 border-b border-slate-800 flex justify-between items-center select-none">
               <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.6)]"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
               </div>
               <div className="text-xs text-slate-500 uppercase tracking-[0.2em] font-bold">NEXUS_GATEWAY_V4.1</div>
            </div>

            {/* Terminal Content */}
            <div 
              className="p-8 flex-grow flex flex-col font-mono text-sm md:text-base leading-relaxed overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent" 
              onClick={() => inputRef.current?.focus()}
            >
               {lines.map(line => (
                 <div key={line.id} className={`mb-2 ${line.sender === 'USER' ? 'text-right' : 'text-left'}`}>
                    <span className={`inline-block px-2 py-1 rounded ${
                       line.variant === 'ERROR' ? 'text-red-500' :
                       line.variant === 'SUCCESS' ? 'text-emerald-400' :
                       line.variant === 'WARNING' ? 'text-yellow-400' :
                       line.sender === 'USER' ? 'text-cyan-300' : 'text-slate-300'
                    }`}>
                       {line.sender === 'SYSTEM' && <span className="mr-2 opacity-50 text-slate-500">&gt;</span>}
                       {line.text}
                    </span>
                 </div>
               ))}
               
               {/* Input Area */}
               {(step !== 'PROCESSING' && step !== 'INIT') && (
                 <form onSubmit={handleSubmit} className="mt-4 flex items-center text-cyan-500 text-lg">
                    <span className="mr-3 font-bold opacity-80">{step === 'DONE' ? 'CMD' : 'INPUT'}&gt;</span>
                    <input 
                      ref={inputRef}
                      type={step === 'PASSWORD' ? "password" : "text"}
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      className="bg-transparent border-none outline-none flex-grow text-cyan-300 font-bold caret-transparent p-0 m-0"
                      autoFocus
                      autoComplete="off"
                      spellCheck={false}
                    />
                    <span className={`w-2.5 h-5 bg-cyan-500 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}></span>
                 </form>
               )}
               <div ref={bottomRef} />
            </div>
         </div>
         
         <div className="mt-6 text-center">
            <button 
              onClick={onBack} 
              className="text-xs text-slate-500 hover:text-white transition-colors uppercase tracking-[0.3em] hover:bg-white/10 px-4 py-2 rounded"
            >
               [ ESCAPE TO LANDING ]
            </button>
         </div>
      </div>
    </div>
  );
};

export default LoginPage;