'use client';

import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

/**
 * Offline Detector
 * Shows a banner when the user loses internet connection
 */
export default function OfflineDetector() {
    const [isOnline, setIsOnline] = useState(true);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        setIsOnline(navigator.onLine);

        const handleOnline = () => {
            setIsOnline(true);
            setShowBanner(false);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowBanner(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!showBanner) return null;

    return (
        <div
            className={`fixed top-0 left-0 right-0 z-[100] ${isOnline
                    ? 'bg-green-500/90'
                    : 'bg-red-500/90'
                } backdrop-blur-md border-b border-white/10 px-4 py-3 text-center animate-slide-down`}
        >
            <div className="container mx-auto flex items-center justify-center gap-2">
                {isOnline ? (
                    <>
                        <Wifi className="w-5 h-5 text-white" />
                        <span className="text-white font-medium">
                            Back online! Your connection has been restored.
                        </span>
                    </>
                ) : (
                    <>
                        <WifiOff className="w-5 h-5 text-white" />
                        <span className="text-white font-medium">
                            You're offline. Please check your internet connection.
                        </span>
                    </>
                )}
            </div>
        </div>
    );
}
