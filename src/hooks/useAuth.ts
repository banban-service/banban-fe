import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function useAuth() {
  const router = useRouter();
  const { user, isLoggedIn, login, logout, loading, error, checkAuth } =
    useAuthStore();

  useEffect(() => {
    if (error === "회원가입이 필요합니다." && router.pathname !== "/login") {
      router.push("/login");
    }
  }, [error, router]);

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
