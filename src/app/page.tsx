"use client";

import Header from "@/components/layout/Header";
import LeftSection from "@/components/layout/LeftSection/LeftSection";
import RightSection from "@/components/layout/RightSection/RightSection";
import useAuth from "@/hooks/useAuth";

export default function Home() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="relative mx-auto w-fit">
      {<Header isLoggedIn={isLoggedIn} isNew />}
      <div className="flex gap-6 pt-[64px] h-[100dvh]">
        <LeftSection />
        <RightSection />
      </div>
    </div>
  );
}
