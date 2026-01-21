import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const InstallPWA = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Check if already in standalone mode
        const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
        setIsStandalone(isStandaloneMode);

        if (isStandaloneMode) return;

        // iOS Detection
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(isIosDevice);

        if (isIosDevice) {
            // Show prompt for iOS users after a small delay
            // Show prompt for iOS users after a small delay
            // Removed permanent localStorage check to ensure it shows for testing/fixing
            setTimeout(() => setShowInstallPrompt(true), 3000);
        } else {
            // Standard PWA (Android/Desktop)
            const handler = (e: any) => {
                e.preventDefault();
                setDeferredPrompt(e);
                setShowInstallPrompt(true);
            };
            window.addEventListener('beforeinstallprompt', handler);
            return () => window.removeEventListener('beforeinstallprompt', handler);
        }
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
    };

    const handleClose = () => {
        setShowInstallPrompt(false);
        // Removed permanent setting to allow testing
        // if (isIOS) {
        //    sessionStorage.setItem('ios_install_prompt_seen', 'true'); // Optional: Use session storage instead
        // }
    };

    if (isStandalone) return null;

    return (
        <AnimatePresence>
            {showInstallPrompt && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-[100]"
                >
                    <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex flex-col gap-4 relative overflow-hidden">
                        {/* Glow Effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

                        <div className="flex items-center gap-4">
                            <div className="bg-slate-800 p-3 rounded-xl shrink-0">
                                <img src="/logo-192.png" alt="Geniusphere" className="w-10 h-10 rounded-lg object-cover" />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-white text-sm">Install Geniusphere</h3>
                                <p className="text-slate-400 text-xs mt-1">
                                    {isIOS ? "Install specifically for iOS" : "Add to Home Screen for better experience"}
                                </p>
                            </div>

                            <button
                                onClick={handleClose}
                                className="p-2 text-slate-400 hover:text-white transition-colors self-start"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* IOS Specific Instructions */}
                        {isIOS ? (
                            <div className="text-sm text-slate-300 bg-slate-800/50 p-3 rounded-lg border border-white/5">
                                <p className="mb-2 flex items-center gap-2">
                                    1. Tap the <span className="font-bold text-blue-400">Share</span> button <span className="inline-block"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg></span>
                                </p>
                                <p className="flex items-center gap-2">
                                    2. Select <span className="font-bold text-white">Add to Home Screen</span> (Scroll down)
                                </p>
                            </div>
                        ) : (
                            <button
                                onClick={handleInstallClick}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Download size={16} /> Install App
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
