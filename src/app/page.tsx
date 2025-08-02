"use client";

import Header from "@/components/layout/Header";
import LeftSection from "@/components/layout/LeftSection/LeftSection";
import RightSection from "@/components/layout/RightSection/RightSection";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  return (
    <div className="relative mx-auto w-fit">
      {
        <Header
          isLoggedIn={isLoggedIn}
          isNew
          onLogin={() => {
            router.push("/login");
          }}
        />
      }
      <div className="flex gap-6 pt-[64px] h-[100dvh]">
        <LeftSection />
        <RightSection />
      </div>
    </div>
  );
}
