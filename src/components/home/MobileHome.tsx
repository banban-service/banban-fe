"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";
import LeftSection from "@/components/layout/LeftSection/LeftSection";
import RightSection from "@/components/layout/RightSection/RightSection";
import BottomTabBar, { type TabType } from "@/components/mobile/BottomTabBar";
import NotificationsPage from "@/components/mobile/pages/NotificationsPage";
import ProfilePage from "@/components/mobile/pages/ProfilePage";
import { SectionContext } from "@/components/layout/RightSection/SectionContext";
import type { Feed } from "@/types/feeds";
import FloatingButtonWithModal from "@/components/common/FloatingButtonWithModal";
import { useAuthStore } from "@/store/useAuthStore";
import { usePoll } from "@/hooks/usePoll";
import NoTopicState from "@/components/layout/LeftSection/TodayTopicCard/NoTopicState";
import { useNotifications } from "@/hooks/useNotifications";

export default function MobileHome() {
  const [sectionStatus, setSectionStatus] = useState<"feeds" | "comments">(
    "feeds",
  );
  const [targetFeed, setTargetFeed] = useState<Feed | null>(null);
  const [mobileActiveTab, setMobileActiveTab] = useState<TabType>("home");
  const { isLoggedIn } = useAuthStore();
  const { data: pollData, isLoading: isPollLoading } = usePoll();

  // 알림 데이터 (읽지 않은 알림 개수 확인용)
  const { data: notificationsData } = useNotifications({ enabled: isLoggedIn });
  const unreadCount = notificationsData?.pages[0]?.data.unreadCount ?? 0;

  const sectionContextValue = useMemo(
    () => ({
      sectionStatus,
      setSectionStatus,
      targetFeed,
      setTargetFeed,
    }),
    [sectionStatus, targetFeed],
  );

  // Poll 데이터가 없을 때 (로딩 완료 후)
  if (!isPollLoading && !pollData) {
    return (
      <FullScreenContainer>
        <NoTopicState
          message="오늘의 주제가 없습니다"
          description="잠시 후 다시 시도해주세요"
        />
      </FullScreenContainer>
    );
  }

  return (
    <SectionContext.Provider value={sectionContextValue}>
      <ContentContainer>
        <MainContentWrapper>
          {mobileActiveTab === "home" && <LeftSection />}
          {mobileActiveTab === "feeds" && <RightSection />}
          {mobileActiveTab === "notifications" && <NotificationsPage />}
          {mobileActiveTab === "profile" && <ProfilePage />}

          {/* 피드 탭에서만 피드 작성 플러스 버튼 표시 (투표 완료 시에만) */}
          {isLoggedIn && pollData?.hasVoted && mobileActiveTab === "feeds" && (
            <FloatingButtonWithModal
              sectionStatus="feeds"
              targetFeed={null}
            />
          )}
        </MainContentWrapper>
      </ContentContainer>
      <BottomTabBar
        activeTab={mobileActiveTab}
        onTabChange={setMobileActiveTab}
        hasUnreadNotifications={unreadCount > 0}
      />
    </SectionContext.Provider>
  );
}

const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
  padding-top: 64px;
  padding-bottom: 64px; /* 하단 탭바 공간 확보 */
  height: 100dvh;
  overflow: hidden;
`;

const MainContentWrapper = styled.div`
  display: block;
  width: 100%;
  max-width: 100%;
  height: 100%;
  overflow-y: auto;
`;

const FullScreenContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100dvh;
  background-color: #f8fafc;
`;
