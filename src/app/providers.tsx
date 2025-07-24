"use client";

interface Props {
  children?: React.ReactNode;
}

import { ToastProvider } from "@/components/common/Toast/ToastContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

export const NextProvider = ({ children }: Props) => {
  return <ToastProvider>{children}</ToastProvider>;
};

interface ProvidersProps {
  children: ReactNode;
}

export function QueryProviders({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
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