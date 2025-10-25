"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import RequireAuth from "@/components/auth/RequireAuth";

export default function AdminDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/system");
  }, [router]);

  return (
    <RequireAuth>
      <div className="min-h-screen bg-slate-50" />
    </RequireAuth>
  );
}
