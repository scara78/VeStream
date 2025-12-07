'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

/**
 * Splash Screen Component
 * Shows VeStream logo on app startup
 */
export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Hide splash screen after 2 seconds
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
        >
            <div className="text-center animate-fade-in">
                {/* Logo */}
                <div className="relative w-32 h-32 mx-auto mb-8">
                    <Image
                        src="/logo.png"
                        alt="VeStream Logo"
                        fill
                        className="animate-slow-zoom object-contain"
                        priority
                    />
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-[#00ff88]/20 rounded-full blur-3xl animate-pulse" />
                </div>

                {/* App Name */}
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00ff88] to-white bg-clip-text text-transparent mb-2">
                    VeStream
                </h1>
                <p className="text-gray-400 text-sm">Premium Streaming Experience</p>

                {/* Loading indicator */}
                <div className="mt-8 flex justify-center gap-2">
                    <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </div>
    );
}
