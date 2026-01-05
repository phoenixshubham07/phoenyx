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

type LoginStep = 
  | 'INIT' 
  | 'ACCOUNT_CHECK' 
  | 'USERNAME' 
  | 'PASSWORD' 
  | 'CREATE_USERNAME' 
  | 'CREATE_PASSWORD' 
  | 'PROCESSING' 
  | 'CREATING' 
  | 'DONE';

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
        addLine("USER DATABASE LOADED.", 'SYSTEM');
        addLine("DO YOU HAVE AN EXISTING ACCOUNT? (Y/N)", 'SYSTEM');
        setStep('ACCOUNT_CHECK');
      }, 3000);

      return () => {
        timeouts.forEach(clearTimeout);
      };
    }
  }, [step, addLine]);

  // Auto-focus input
  useEffect(() => {
    if (['ACCOUNT_CHECK', 'USERNAME', 'PASSWORD', 'CREATE_USERNAME', 'CREATE_PASSWORD', 'DONE'].includes(step)) {
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

    // Display user input
    if (step === 'PASSWORD' || step === 'CREATE_PASSWORD') {
        addLine("•".repeat(val.length), 'USER');
    } else {
        addLine(val, 'USER');
    }

    // --- State Machine Logic ---
    
    if (step === 'ACCOUNT_CHECK') {
        const isYes = val.toLowerCase().startsWith('y');
        if (isYes) {
            setTimeout(() => {
                 addLine("INITIATING LOGIN SEQUENCE...", 'SYSTEM');
                 addLine("PLEASE ENTER YOUR EMAIL/USERNAME:", 'SYSTEM');
                 setStep('USERNAME');
            }, 400);
        } else {
            setTimeout(() => {
                 addLine("INITIATING NEW USER PROTOCOL...", 'SYSTEM');
                 addLine("ESTABLISHING NEURAL PATHWAY...", 'SYSTEM');
                 addLine("ENTER DESIRED EMAIL/USERNAME:", 'SYSTEM');
                 setStep('CREATE_USERNAME');
            }, 600);
        }
    }

    // --- Login Flow ---
    else if (step === 'USERNAME') {
      setTimeout(() => {
         addLine(`IDENTITY RECOGNIZED: [${val.toUpperCase()}]`, 'SYSTEM', 'SUCCESS');
         addLine("ENTER PASSWORD:", 'SYSTEM');
         setStep('PASSWORD');
      }, 600);
    } 
    else if (step === 'PASSWORD') {
      setStep('PROCESSING');
      addLine("VERIFYING HASH...", 'SYSTEM', 'WARNING');
      
      // Verification Simulation (Always fails for "demo" vibe, or could succeed)
      setTimeout(() => {
        addLine("ERROR: INVALID CREDENTIALS.", 'SYSTEM', 'ERROR');
        addLine("PROTOCOL BETA ACCESS RESTRICTED.", 'SYSTEM', 'ERROR');
        addLine("RESTART SEQUENCE? (Y/N)", 'SYSTEM', 'WARNING');
        setStep('DONE');
      }, 2000);
    } 

    // --- Sign Up Flow ---
    else if (step === 'CREATE_USERNAME') {
        setTimeout(() => {
            addLine(`AVAILABILITY CONFIRMED: [${val.toUpperCase()}]`, 'SYSTEM', 'SUCCESS');
            addLine("SET SECURE ACCESS KEY:", 'SYSTEM');
            setStep('CREATE_PASSWORD');
        }, 500);
   }
   else if (step === 'CREATE_PASSWORD') {
       setStep('CREATING');
       addLine("ENCRYPTING DATA...", 'SYSTEM', 'WARNING');
       setTimeout(() => {
           addLine("GENERATING NEURAL SIGNATURE...", 'SYSTEM');
       }, 800);
       setTimeout(() => {
            addLine("ACCOUNT CREATION SUCCESSFUL.", 'SYSTEM', 'SUCCESS');
            addLine("WELCOME TO THE NEXUS, INITIATE.", 'SYSTEM', 'SUCCESS');
            addLine("RETURN TO MAIN MENU? (Y/N)", 'SYSTEM', 'WARNING');
            setStep('DONE');
       }, 2500);
   }

    // --- Completion ---
    else if (step === 'DONE') {
       if (val.toLowerCase().startsWith('y')) {
           // If we just finished creating an account successfully, Y takes us back to main app
           const lastSysMsg = lines.filter(l => l.sender === 'SYSTEM').pop()?.text || "";
           if (lastSysMsg.includes("MAIN MENU")) {
               onBack();
           } else {
               // Otherwise (failed login), restart sequence
               sequenceStarted.current = false;
               setStep('INIT');
           }
       } else {
         onBack();
       }
    }
  };

  const isInputHidden = step === 'INIT' || step === 'PROCESSING' || step === 'CREATING';
  const isSecure = step === 'PASSWORD' || step === 'CREATE_PASSWORD';

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-mono flex items-center justify-center">
      
      {/* 3D Background */}
      <AuthGateVisualizer isSecureMode={isSecure} activityLevel={isInputHidden ? 0.2 : 0.8} />
      
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
               {!isInputHidden && (
                 <form onSubmit={handleSubmit} className="mt-4 flex items-center text-cyan-500 text-lg">
                    <span className="mr-3 font-bold opacity-80">{step === 'DONE' ? 'CMD' : 'INPUT'}&gt;</span>
                    <input 
                      ref={inputRef}
                      type={isSecure ? "password" : "text"}
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