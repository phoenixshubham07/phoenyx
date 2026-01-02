import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToNexus } from '../services/geminiService';
import { ChatMessage } from '../types';

const NexusTerminal: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Neural Nexus Online. Authenticated. Ask me about the Phoenyx Protocol.', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight } = messagesContainerRef.current;
      messagesContainerRef.current.scrollTo({
        top: scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Format history for Gemini
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await sendMessageToNexus(userMsg.text, history);

    setMessages(prev => [...prev, {
      role: 'model',
      text: responseText,
      timestamp: new Date()
    }]);
    setIsLoading(false);
  };

  return (
    <section className="py-24 bg-[#050a1f] relative overflow-hidden border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            CONSULT THE NEXUS
          </h2>
          <p className="text-slate-500 font-mono text-sm mt-2">
            Direct link to AlgoAmaterasu Logic Core via Gemini 3 Flash
          </p>
        </div>

        {/* Terminal Container */}
        <div className="w-full bg-black rounded-lg border border-slate-700 shadow-[0_0_40px_rgba(6,182,212,0.1)] overflow-hidden flex flex-col h-[500px]">
          
          {/* Terminal Header */}
          <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-xs font-mono text-slate-500">nexus_protocol_v4.1.exe</div>
          </div>

          {/* Messages Area */}
          <div 
            ref={messagesContainerRef}
            className="flex-grow p-6 overflow-y-auto font-mono text-sm space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-slate-800 text-white border border-slate-600' 
                    : 'bg-cyan-950/30 text-cyan-300 border border-cyan-900'
                }`}>
                  <span className="block text-[10px] opacity-50 mb-1">
                    {msg.role === 'user' ? '>> CANDIDATE' : '>> NEXUS'}
                  </span>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-cyan-500 animate-pulse text-xs">
                &gt; Analyzing Neural Pathways...
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="bg-slate-900 p-4 border-t border-slate-800 flex gap-2">
            <span className="text-cyan-500 font-mono pt-2">{'>'}</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query the database..."
              className="flex-grow bg-transparent border-none text-white font-mono focus:ring-0 focus:outline-none"
            />
            <button 
              type="submit"
              disabled={isLoading}
              className="bg-cyan-900 hover:bg-cyan-700 text-cyan-100 px-4 py-1 rounded text-xs font-mono transition-colors uppercase disabled:opacity-50"
            >
              Execute
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NexusTerminal;