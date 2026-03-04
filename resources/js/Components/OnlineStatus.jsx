import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnlineStatus() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showStatus, setShowStatus] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setShowStatus(true);
            // Hide after 3 seconds when back online
            setTimeout(() => setShowStatus(false), 3000);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowStatus(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <AnimatePresence>
            {showStatus && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 24, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="fixed top-0 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md"
                    style={{
                        backgroundColor: isOnline ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white'
                    }}
                >
                    {isOnline ? (
                        <>
                            <Wifi className="w-5 h-5 animate-pulse" />
                            <span className="font-bold text-sm tracking-wide">Back Online</span>
                        </>
                    ) : (
                        <>
                            <WifiOff className="w-5 h-5 animate-bounce" />
                            <span className="font-bold text-sm tracking-wide">Connection Lost - Offline Mode</span>
                        </>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
