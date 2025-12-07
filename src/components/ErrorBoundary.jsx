'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { trackError } from '@/lib/analytics';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to analytics
    trackError('ErrorBoundary', error.message);

    // Log error details for debugging
    console.error('Error Boundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
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
                Oops! Something went wrong
              </h1>
              <p className="text-gray-400 mb-6">
                We encountered an unexpected error. Don't worry, it's not your fault!
              </p>

              {/* Error Details (only in development) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-black/50 rounded-lg border border-red-500/20 text-left">
                  <p className="text-red-400 text-sm font-mono mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="text-xs text-gray-500">
                      <summary className="cursor-pointer hover:text-gray-400">
                        Stack trace
                      </summary>
                      <pre className="mt-2 overflow-auto max-h-40">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={this.handleReset}
                  className="flex items-center gap-2 bg-[#00ff88] text-black hover:bg-[#00ff88]/90 px-6 py-3 rounded-lg font-semibold"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  className="flex items-center gap-2 bg-white/10 text-white hover:bg-white/20 px-6 py-3 rounded-lg font-semibold"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              </div>

              {/* Help Text */}
              <p className="mt-6 text-sm text-gray-500">
                If this problem persists, please try clearing your browser cache or contact support.
              </p>
            </div>

            {/* Ambient Effects */}
            <div className="fixed top-1/4 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Lightweight Error Fallback Component
 * Can be used with React Error Boundaries or Next.js error.tsx
 */
export function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error?.message || 'An unexpected error occurred'}</p>
          <Button
            onClick={resetErrorBoundary}
            className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 px-6 py-3 rounded-lg font-semibold"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;
