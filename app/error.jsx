'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * Global Error Boundary for Next.js App Router
 * Catches and displays errors gracefully
 */
export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="relative mb-8">
          {/* Error Icon */}
          <div className="w-24 h-24 mx-auto rounded-full bg-red-500/10 flex items-center justify-center border-4 border-red-500/30">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>

          {/* Glowing effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-red-500/5 blur-2xl" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-4">
          Oops! Something went wrong
        </h2>

        <p className="text-gray-400 mb-2">
          {error?.message || 'An unexpected error occurred while loading this page.'}
        </p>

        <p className="text-gray-500 text-sm mb-8">
          Don't worry, we're here to help. Try refreshing the page or go back home.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={() => reset()}
            className="bg-[#00ff88] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#00ff88]/90 transition-all"
          >
            Try Again
          </Button>

          <Button
            onClick={() => window.location.href = '/'}
            className="bg-white/10 text-white px-6 py-3 rounded-lg font-bold hover:bg-white/20 transition-all border border-white/20"
          >
            Go Home
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && error?.stack && (
          <details className="mt-8 text-left">
            <summary className="text-gray-400 text-sm cursor-pointer hover:text-white mb-2">
              Error Details (Dev Only)
            </summary>
            <pre className="bg-white/5 border border-white/10 rounded-lg p-4 text-xs text-red-400 overflow-auto max-h-64">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
