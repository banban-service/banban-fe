"use client";

interface Props {
  children?: React.ReactNode;
}

import { ToastProvider } from "@/components/common/Toast/ToastContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
  
export const NextProvider = ({ children }: Props) => {
  return (
    <QueryProviders>
      <ToastProvider>{children}</ToastProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryProviders>
  );
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
            staleTime: 5 * 60 * 1000, // 5분: 피드는 자주 안 바뀌므로 캐시 재사용
            gcTime: 10 * 60 * 1000, // 10분: 메모리에 캐시 유지
            retry: 1, // 네트워크 일시적 오류 대응 (1번 재시도)
            refetchOnWindowFocus: false, // 모바일에서 불필요
            refetchOnMount: true, // 탭 전환 시 최신 데이터 확인 (stale이면 리패칭)
          },
          mutations: {
            retry: false,
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