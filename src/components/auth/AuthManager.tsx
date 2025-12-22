"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { AUTH_SILENT_CHECK_INTERVAL_MS } from "@/constants/auth";

export default function AuthManager() {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const lastCheckRef = useRef(0);
  const checkingRef = useRef(false);

  useEffect(() => {
    const shouldSkip = () => {
      if (!isLoggedIn) return true;
      if (checkingRef.current) return true;

      if (!accessToken) return true;

      const now = Date.now();
      const elapsed = now - lastCheckRef.current;
      const MIN_INTERVAL = AUTH_SILENT_CHECK_INTERVAL_MS; // 최소 1분 간격

      if (elapsed < MIN_INTERVAL) {
        return true;
      }

      lastCheckRef.current = now;
      return false;
    };

    const runSilentCheck = () => {
      if (shouldSkip()) return;

      checkingRef.current = true;
      checkAuth({ silent: true })
        .catch(() => {
          // silent 모드 실패는 별도 알림 없이 무시
        })
        .finally(() => {
          checkingRef.current = false;
        });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        runSilentCheck();
      }
    };

    const handleFocus = () => {
      runSilentCheck();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [accessToken, checkAuth, isLoggedIn]);

  return null;
}
