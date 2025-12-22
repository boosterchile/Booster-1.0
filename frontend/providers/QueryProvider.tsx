import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';

/**
 * QueryClient configuration with optimized defaults for SmartAICargo
 */
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes - data considered fresh
            gcTime: 10 * 60 * 1000, // 10 minutes - cache time (formerly cacheTime)
            retry: 1, // Retry failed requests once
            refetchOnWindowFocus: false, // Don't refetch on window focus
            refetchOnReconnect: true, // Refetch on reconnect
        },
        mutations: {
            retry: 0, // Don't retry mutations
        },
    },
});

interface QueryProviderProps {
    children: ReactNode;
}

/**
 * Provider component that wraps the app with React Query functionality
 * Includes DevTools in development mode
 */
export const QueryProvider = ({ children }: QueryProviderProps) => (
    <QueryClientProvider client={queryClient}>
        {children}
        {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        )}
    </QueryClientProvider>
);

export { queryClient };
