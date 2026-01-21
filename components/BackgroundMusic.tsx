import React, { useState, useRef, useEffect } from 'react';
import { Music, Volume2, VolumeX, Play, Pause, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BackgroundMusic: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.3); // Default volume 30%
    const [isExpanded, setIsExpanded] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const collapseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Single premium melodic track
    const track = {
        name: "Serene Lofi",
        url: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3",
        type: "Chill Beats"
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Auto-collapse logic
    const startAutoCloseTimer = (duration = 3000) => {
        if (collapseTimeoutRef.current) clearTimeout(collapseTimeoutRef.current);
        collapseTimeoutRef.current = setTimeout(() => {
            setIsExpanded(false);
        }, duration);
    };

    const cancelAutoCloseTimer = () => {
        if (collapseTimeoutRef.current) clearTimeout(collapseTimeoutRef.current);
    };

    useEffect(() => {
        if (isExpanded) {
            startAutoCloseTimer(3000); // Default 3s idle close
        }
        return () => cancelAutoCloseTimer();
    }, [isExpanded, volume]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        }
        setIsPlaying(!isPlaying);

        // If we just started playing, start the timer to auto-close
        startAutoCloseTimer(3000);
    };



    return (
        <>
            <audio
                ref={audioRef}
                src={track.url}
                loop
                preload="auto"
            />

            <motion.div
                className="fixed bottom-6 right-6 z-50 flex items-end flex-col gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                onMouseEnter={cancelAutoCloseTimer}
                onMouseLeave={() => isExpanded && startAutoCloseTimer(1200)} // Quick close on leave
            >
                {/* Expanded Controls */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex flex-col gap-4 w-56 mb-2"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
                                    <Disc size={20} className="text-white" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="text-white text-xs font-bold truncate">{track.name}</h4>
                                    <p className="text-slate-400 text-[10px]">{track.type}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                                <button
                                    onClick={() => { setIsMuted(!isMuted); if (audioRef.current) audioRef.current.muted = !isMuted; }}
                                    className="p-2 hover:bg-white/10 rounded-full text-slate-300 transition-colors"
                                >
                                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                </button>

                                <button
                                    onClick={togglePlay}
                                    className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-white/20"
                                >
                                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                                </button>
                            </div>

                            {/* Volume Slider */}
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={volume}
                                onChange={(e) => { setVolume(parseFloat(e.target.value)); startAutoCloseTimer(3000); }}
                                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Toggle Button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border border-white/10 backdrop-blur-md transition-all ${isPlaying
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-cyan-500/20'
                        : 'bg-slate-900/80 text-slate-400 hover:text-white'
                        }`}
                >
                    <Music size={20} className={isPlaying ? 'animate-pulse' : ''} />
                </motion.button>
            </motion.div>

            <style>{`
                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
};
