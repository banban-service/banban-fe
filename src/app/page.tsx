"use client";

import { useSafeMediaQuery } from "@/hooks/useMediaQuery";
import MobileHome from "@/components/home/MobileHome";
import DesktopHome from "@/components/home/DesktopHome";

export default function Home() {
  const isMobile = useSafeMediaQuery("(max-width: 767px)");

  return isMobile ? <MobileHome /> : <DesktopHome />;
}
