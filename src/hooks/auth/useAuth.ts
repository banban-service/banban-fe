import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function useAuth() {
  const router = useRouter();
  const pathname = usePathname();

  const user = useAuthStore((s) => s.user);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    if (error === "회원가입이 필요합니다." && pathname !== "/login") {
      router.push("/login");
    }
  }, [error, router, pathname]);

  return {
    user,
    isLoggedIn,
    login,
    logout,
    loading,
    error,
    checkAuth,
  };
}
