"use client";

import TodayTopicCard from "@/components/layout/LeftSection/TodayTopicCard/TodayTopicCard";
import RealtimeFeedRanking from "@/components/layout/LeftSection/RealtimeFeedRanking/RealtimeFeedRanking";

export default function HomeTab() {
  return (
    <div className="flex flex-col gap-[10px] pb-8 w-full">
      <TodayTopicCard />
      <RealtimeFeedRanking />
    </div>
  );
}
