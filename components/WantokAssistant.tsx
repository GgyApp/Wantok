
import React, { useState, useRef, useEffect } from 'react';
import { chatWithWantok, findPlaces } from '../services/geminiService';
import { ChatMessage } from '../types';

export const WantokAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
      { id: '1', role: 'model', text: 'Monin! I am Wantok Bot. Ask me anything about PNG or click "Find Places" to search maps.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'chat' | 'maps'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
        if (mode === 'maps') {
            // Use Maps Grounding (Gemini 2.5 Flash)
            const result = await findPlaces(input);
            const botMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: result.text,
                isMapResult: true,
                mapData: result.chunks
            };
            setMessages(prev => [...prev, botMsg]);
        } else {
            // Use Gemini 3 Pro Chat
            const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
            const responseText = await chatWithWantok(userMsg.text, history);
            const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
            setMessages(prev => [...prev, botMsg]);
        }
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen) {
      return (
          <button 
            onClick={() => setIsOpen(true)}
            className="absolute bottom-24 right-6 w-14 h-14 bg-white rounded-full shadow-xl shadow-black/30 flex items-center justify-center border-4 border-[#FAD201] z-40 animate-scale-in hover:scale-110 transition"
          >
             <span className="material-symbols-rounded text-3xl text-black">smart_toy</span>
          </button>
      );
  }

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center pointer-events-auto">
        <div className="w-full sm:w-[380px] h-[80%] bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col animate-slide-up">
            
            {/* Header */}
            <div className="bg-[#1a1a1a] p-4 flex justify-between items-center text-white border-b border-gray-800">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-rounded text-[#FAD201]">smart_toy</span>
                    <div>
                        <h3 className="font-bold text-sm">Wantok Bot</h3>
                        <p className="text-[10px] text-gray-400">Powered by Gemini 3 Pro</p>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-800 rounded-full">
                    <span className="material-symbols-rounded">close</span>
                </button>
            </div>

            {/* Mode Switcher */}
            <div className="flex border-b border-gray-100 bg-gray-50 p-1">
                <button 
                  onClick={() => setMode('chat')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${mode === 'chat' ? 'bg-white shadow text-black' : 'text-gray-500'}`}
                >
                    Chat
                </button>
                <button 
                  onClick={() => setMode('maps')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 ${mode === 'maps' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                >
                    <span className="material-symbols-rounded text-xs">map</span>
                    Find Places
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-100 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${
                            msg.role === 'user' 
                            ? 'bg-[#CE1126] text-white rounded-br-none' 
                            : 'bg-white text-gray-800 rounded-bl-none'
                        }`}>
                            {msg.text}
                            
                            {/* Render Map Links if available */}
                            {msg.isMapResult && msg.mapData && (
                                <div className="mt-3 space-y-2">
                                    {msg.mapData.map((chunk: any, idx: number) => {
                                        if (chunk.web?.uri) {
                                            return (
                                                <a key={idx} href={chunk.web.uri} target="_blank" rel="noreferrer" className="block text-xs text-blue-600 underline truncate bg-blue-50 p-1 rounded">
                                                    {chunk.web.title || "View Web Result"}
                                                </a>
                                            )
                                        }
                                        // Specific maps chunk parsing depends on API exact return, usually contains URI in web object or specific maps object
                                        return null; 
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white rounded-2xl p-3 rounded-bl-none shadow-sm flex gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-2">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={mode === 'maps' ? "e.g., Markets in Lae..." : "Ask me anything..."}
                    className="flex-1 bg-gray-100 border-none rounded-full px-4 py-3 text-sm focus:ring-2 focus:ring-[#CE1126] outline-none"
                />
                <button 
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    className={`p-3 rounded-full flex items-center justify-center transition ${!input.trim() ? 'bg-gray-200 text-gray-400' : 'bg-[#CE1126] text-white shadow-lg'}`}
                >
                    <span className="material-symbols-rounded">send</span>
                </button>
            </div>
        </div>
    </div>
  );
};
