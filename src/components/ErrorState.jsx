'use client';

import React from 'react';
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * Error State Component
 * Displays user-friendly error messages with retry options
 */
export default function ErrorState({
  error,
  onRetry,
  title = 'Something went wrong',
  description,
  showRetry = true
}) {
  // Determine error type
  const isNetworkError = error?.message?.includes('timeout') ||
    error?.message?.includes('fetch failed') ||
    error?.message?.includes('Failed to fetch') ||
    error?.message?.includes('ETIMEDOUT');

  const isAPIError = error?.message?.includes('API error');

  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <div className="max-w-md text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
              {isNetworkError ? (
                <WifiOff className="w-10 h-10 text-red-500" />
              ) : (
                <AlertCircle className="w-10 h-10 text-red-500" />
              )}
            </div>
            <div className="absolute inset-0 w-20 h-20 rounded-full bg-red-500/20 animate-ping" />
          </div>
        </div>

        {/* Error Message */}
        <h3 className="text-xl font-bold text-white mb-2">
          {isNetworkError ? 'Connection Issue' : title}
        </h3>

        <p className="text-gray-400 mb-6">
          {description || (
            isNetworkError
              ? 'Unable to connect to the server. Please check your internet connection and try again.'
              : isAPIError
                ? 'There was a problem fetching data from the server. This might be temporary.'
                : 'An unexpected error occurred. Please try again later.'
          )}
        </p>

        {/* Error Details (collapsible) */}
        {error?.message && (
          <details className="mb-6 text-left">
            <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-400 transition-colors">
              Technical details
            </summary>
            <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10">
              <code className="text-xs text-red-400 break-all">
                {error.message}
              </code>
            </div>
          </details>
        )}

        {/* Actions */}
        {showRetry && onRetry && (
          <div className="flex gap-3 justify-center">
            <Button
              onClick={onRetry}
              className="flex items-center gap-2 px-6 py-3 bg-[#00ff88] text-black font-semibold rounded-lg hover:bg-[#00cc66] transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>

            <Button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
            >
              Go Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Inline Error Message
 * Smaller error component for inline use
 */
export function InlineError({ message, onRetry }) {
  return (
    <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
        <p className="text-sm text-red-400">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-4 px-3 py-1 text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}

/**
 * Network Status Banner
 * Shows when user is offline
 */
export function NetworkStatusBanner({ isOnline }) {
  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white px-4 py-2 text-center text-sm font-medium">
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="w-4 h-4" />
        <span>You are offline. Some features may not be available.</span>
      </div>
    </div>
  );
}
