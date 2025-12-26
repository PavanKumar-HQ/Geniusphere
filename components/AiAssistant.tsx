import React, { useState, useRef, useEffect } from 'react';
// FIX: Import Chat for using the chat API which maintains conversation history.
import { GoogleGenAI, Chat } from '@google/genai';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { COURSES, SERVICES } from '../constants';
import { motion as motionBase, AnimatePresence } from 'framer-motion';

const motion = motionBase as any;

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hi! I'm the Geniusphere AI. Ask me about courses, services, or career advice." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // FIX: Add a ref to hold the chat instance.
  const chatRef = useRef<Chat | null>(null);

  // FIX: Initialize the chat session when the assistant is opened.
  useEffect(() => {
    if (isOpen && !chatRef.current) {
        const systemInstruction = `
        You are the AI Assistant for Geniusphere, a modern educational platform.
        
        Available Courses:
        ${COURSES.map(c => `- ${c.title} (${c.sector}): ${c.short_description}`).join('\n')}

        Available Services:
        ${SERVICES.map(s => `- ${s.title} (${s.category}): ${s.description}`).join('\n')}

        Your goal is to help users find the right course or service. Be professional, concise, and encouraging.
        If a user asks about a specific topic (e.g. "money"), recommend relevant courses (e.g. "Introduction to Finance").
      `;

      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction,
        },
      });
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!apiKey) {
      setMessages(prev => [...prev, { role: 'user', text: input }, { role: 'model', text: 'API Key is missing. Please configure process.env.API_KEY.' }]);
      setInput('');
      return;
    }

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      // FIX: Use the stateful chat.sendMessage API for conversational context instead of the stateless generateContent.
      if (!chatRef.current) {
        throw new Error("Chat not initialized.");
      }
      
      const response = await chatRef.current.sendMessage({ message: userMessage });

      const reply = response.text || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'model', text: reply }]);

    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the Geniusphere servers right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="mb-4 w-80 sm:w-96 h-[500px] bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-600 to-cyan-500 flex justify-between items-center">
              <div className="flex items-center gap-2 text-white">
                <Sparkles size={18} className="animate-pulse" />
                <span className="font-semibold">Geniusphere AI</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white" aria-label="Close AI Assistant">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-slate-700 text-slate-200 rounded-tl-none border border-white/5'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="flex justify-start"
                >
                  <div className="bg-slate-700 p-4 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-1">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", delay: 0 }}
                      className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", delay: 0.2 }}
                      className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", delay: 0.4 }}
                      className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
                    />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-slate-800/50 border-t border-white/5">
              <div className="flex items-center gap-2 bg-slate-900 border border-white/10 rounded-full px-4 py-2 focus-within:border-cyan-400/50 transition-colors">
                <input
                  type="text"
                  className="flex-1 bg-transparent outline-none text-white text-sm placeholder-slate-500"
                  placeholder="Ask about courses..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={handleSend} 
                  disabled={isLoading || !input.trim()}
                  className="text-cyan-400 hover:text-cyan-300 disabled:opacity-50 transition-colors"
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
        className={`p-4 rounded-full shadow-lg shadow-cyan-500/20 transition-colors duration-300 ${
            isOpen ? 'bg-slate-800 text-white' : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>
    </div>
  );
};