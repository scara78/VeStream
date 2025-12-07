'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * Global Error Component
 * Catches errors in the root layout
 */
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log error to console
    console.error('Global Error:', error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="bg-black">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full">
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10 text-center">
              {/* Error Icon */}
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 border-2 border-red-500/50 flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
              </div>

              {/* Error Message */}
              <h1 className="text-2xl font-bold text-white mb-3">
                Critical Error
              </h1>
              <p className="text-gray-400 mb-6">
                A critical error has occurred. Please try reloading the page.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => reset()}
                  className="flex items-center gap-2 bg-[#00ff88] text-black hover:bg-[#00ff88]/90 px-6 py-3 rounded-lg font-semibold"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
                <Button
                  onClick={() => window.location.href = '/'}
                  className="flex items-center gap-2 bg-white/10 text-white hover:bg-white/20 px-6 py-3 rounded-lg font-semibold"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
