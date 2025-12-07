'use client';

import { useState, useEffect } from 'react';

/**
 * Loading Progress Bar
 * Shows progress for async operations
 */
export function LoadingProgress({ isLoading = false, progress = null }) {
    const [displayProgress, setDisplayProgress] = useState(0);

    useEffect(() => {
        if (isLoading) {
            // Simulate progress if not provided
            if (progress === null) {
                const interval = setInterval(() => {
                    setDisplayProgress(prev => {
                        if (prev >= 90) return prev; // Cap at 90% until actually done
                        return prev + Math.random() * 10;
                    });
                }, 300);

                return () => clearInterval(interval);
            } else {
                setDisplayProgress(progress);
            }
        } else {
            // Complete the progress bar
            setDisplayProgress(100);
            setTimeout(() => setDisplayProgress(0), 500);
        }
    }, [isLoading, progress]);

    if (!isLoading && displayProgress === 0) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-black">
            <div
                className="h-full bg-gradient-to-r from-[#00ff88] via-[#00cc66] to-[#00ff88] transition-all duration-300 ease-out shadow-[0_0_10px_rgba(0,255,136,0.5)]"
                style={{ width: `${displayProgress}%` }}
            />
        </div>
    );
}

/**
 * Spinner Component
 */
export function Spinner({ size = 'md', className = '' }) {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    return (
        <div className={`${sizes[size]} ${className}`}>
            <div className="w-full h-full rounded-full border-2 border-white/20 border-t-[#00ff88] animate-spin" />
        </div>
    );
}

/**
 * Loading Overlay
 * Full-screen loading with message
 */
export function LoadingOverlay({ message = 'Loading...', show = false }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center animate-fade-in">
            <div className="text-center space-y-4">
                <Spinner size="xl" className="mx-auto" />
                <p className="text-white text-lg font-medium">{message}</p>
            </div>
        </div>
    );
}

/**
 * Inline Loading
 * Small loader for inline use
 */
export function InlineLoading({ message = 'Loading...' }) {
    return (
        <div className="flex items-center justify-center gap-3 p-4">
            <Spinner size="sm" />
            <span className="text-gray-400 text-sm">{message}</span>
        </div>
    );
}

export default LoadingProgress;
