
import React, { useState, useEffect } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import { Lightbulb, ShieldCheck, Laptop, LineChart, Globe, Rocket, Zap, Brain } from 'lucide-react';

const motion = motionBase as any;

export const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [textIndex, setTextIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const texts = [
    "Initializing Core Systems...",
    "Calibrating AI Neural Net...",
    "Establishing Secure Link...",
    "Welcome to Geniusphere."
  ];

  useEffect(() => {
    // Progress bar simulation
    const interval = setInterval(() => {
        setProgress(prev => {
            if (prev >= 100) {
                clearInterval(interval);
                setTimeout(onComplete, 600);
                return 100;
            }
            // Non-linear progress for realism
            return Math.min(prev + Math.random() * 8, 100); 
        });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
      if (progress < 30) setTextIndex(0);
      else if (progress < 60) setTextIndex(1);
      else if (progress < 90) setTextIndex(2);
      else setTextIndex(3);
  }, [progress]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black" />
      
      {/* Rotating Ring */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none"
      >
         <div className="w-[600px] h-[600px] border border-dashed border-cyan-500/30 rounded-full" />
         <div className="absolute w-[500px] h-[500px] border border-white/5 rounded-full" />
      </motion.div>

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-blue-500/40 rounded-full"
            initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                scale: 0 
            }}
            animate={{ 
                y: [null, Math.random() * -100],
                opacity: [0, 0.8, 0],
                scale: [0, Math.random() * 2, 0]
            }}
            transition={{ 
                duration: 2 + Math.random() * 3, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: Math.random() * 2
            }}
            style={{ width: Math.random() * 4 + 2, height: Math.random() * 4 + 2 }}
          />
      ))}

      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-6">
        {/* Central Icon Morphing */}
        <div className="relative w-24 h-24 mb-12 flex items-center justify-center">
            <motion.div
                className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
            />
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={textIndex}
                    initial={{ scale: 0.5, opacity: 0, rotateY: 90 }}
                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                    exit={{ scale: 0.5, opacity: 0, rotateY: -90 }}
                    transition={{ duration: 0.4 }}
                    className="text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                >
                    {textIndex === 0 && <Brain size={64} className="text-cyan-400" />}
                    {textIndex === 1 && <Laptop size={64} className="text-blue-400" />}
                    {textIndex === 2 && <ShieldCheck size={64} className="text-green-400" />}
                    {textIndex === 3 && <Rocket size={64} className="text-purple-400" />}
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full mb-6 overflow-hidden relative border border-white/5">
            <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 relative"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear", duration: 0.1 }}
            >
                <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-white/50 to-transparent" />
            </motion.div>
        </div>

        {/* Text */}
        <div className="h-8 flex items-center justify-center w-full">
          <AnimatePresence mode="wait">
            <motion.p 
                key={textIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-cyan-200/80 font-mono text-sm tracking-wider uppercase text-center"
            >
                {texts[textIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
        
        <div className="mt-2 text-xs text-slate-600 font-mono">
            {Math.round(progress)}% COMPLETE
        </div>
      </div>
    </div>
  );
};
