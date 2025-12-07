'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

/**
 * PWA Install Prompt Component
 * Shows install banner for PWA capability
 */
export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registered:', registration);
          })
          .catch((error) => {
            console.log('SW registration failed:', error);
          });
      });
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Check if user has dismissed before
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setTimeout(() => setShowInstallBanner(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('App is running as PWA');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`User response: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showInstallBanner) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-8 md:w-96 z-[9980] animate-slide-up">
      <div className="bg-gradient-to-br from-[#00ff88]/20 to-cyan-500/20 backdrop-blur-xl border border-[#00ff88]/30 rounded-2xl p-4 shadow-2xl shadow-[#00ff88]/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#00ff88]/20 flex items-center justify-center flex-shrink-0">
            <Download className="w-6 h-6 text-[#00ff88]" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-lg mb-1">
              Install VeStream
            </h3>
            <p className="text-gray-300 text-sm mb-3">
              Add to your home screen for a better experience and offline access.
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                className="flex-1 bg-[#00ff88] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#00ff88]/90 transition-all"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                Later
              </button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
