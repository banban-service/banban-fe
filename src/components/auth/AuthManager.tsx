"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthManager() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      checkAuth();
    }
  }, [checkAuth]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkAuth({ silent: true }).catch(() => {
          // silent 모드 실패는 별도 알림 없이 무시
        });
      }
    };

    const handleFocus = () => {
      checkAuth({ silent: true }).catch(() => {});
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [checkAuth]);

  return null;
}
