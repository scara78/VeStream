'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

/**
 * React Query Provider
 * Enhanced with aggressive caching to reduce API calls
 */
export default function QueryProvider({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache for 1 hour, consider stale after 30 minutes
            staleTime: 1000 * 60 * 30, // 30 minutes
            cacheTime: 1000 * 60 * 60, // 1 hour

            // Retry failed requests with exponential backoff
            retry: 2,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

            // Don't refetch on window focus (too aggressive for streaming app)
            refetchOnWindowFocus: false,

            // Refetch on mount only if data is stale
            refetchOnMount: false,

            // Don't refetch on reconnect
            refetchOnReconnect: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
