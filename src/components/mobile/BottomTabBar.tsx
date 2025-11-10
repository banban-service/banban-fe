import styled from "styled-components";
import { HomeIcon, FeedIcon, BellIcon, UserIcon } from "@/components/svg";

export type TabType = "home" | "feeds" | "notifications" | "profile";

interface BottomTabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  hasUnreadNotifications?: boolean;
}

export default function BottomTabBar({
  activeTab,
  onTabChange,
  hasUnreadNotifications = false,
}: BottomTabBarProps) {
  return (
    <Container>
      <TabButton
        $active={activeTab === "home"}
        onClick={() => onTabChange("home")}
        aria-label="홈"
      >
        <HomeIcon
          width={24}
          height={24}
          color={activeTab === "home" ? "#3f13ff" : "#535862"}
        />
        <TabLabel $active={activeTab === "home"}>홈</TabLabel>
      </TabButton>

      <TabButton
        $active={activeTab === "feeds"}
        onClick={() => onTabChange("feeds")}
        aria-label="피드"
      >
        <FeedIcon
          width={24}
          height={24}
          color={activeTab === "feeds" ? "#3f13ff" : "#535862"}
        />
        <TabLabel $active={activeTab === "feeds"}>피드</TabLabel>
      </TabButton>

      <TabButton
        $active={activeTab === "notifications"}
        onClick={() => onTabChange("notifications")}
        aria-label="알림"
      >
        <IconWrapper>
          <BellIcon
            width={24}
            height={24}
            color={activeTab === "notifications" ? "#3f13ff" : "#535862"}
          />
          {hasUnreadNotifications && <UnreadDot />}
        </IconWrapper>
        <TabLabel $active={activeTab === "notifications"}>알림</TabLabel>
      </TabButton>

      <TabButton
        $active={activeTab === "profile"}
        onClick={() => onTabChange("profile")}
        aria-label="프로필"
      >
        <UserIcon
          width={24}
          height={24}
          color={activeTab === "profile" ? "#3f13ff" : "#535862"}
        />
        <TabLabel $active={activeTab === "profile"}>프로필</TabLabel>
      </TabButton>
    </Container>
  );
}

const Container = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #ffffff;
  border-top: 1px solid #d5d7da;
  padding: 8px 0;
  padding-bottom: max(8px, env(safe-area-inset-bottom));
  z-index: 100;
  height: 64px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex: 1;
  border: none;
  background: none;
  cursor: pointer;
  padding: 8px;
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.95);
  }
`;

const TabLabel = styled.span<{ $active: boolean }>`
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? "600" : "400")};
  color: ${({ $active }) => ($active ? "#3f13ff" : "#535862")};
  transition: color 0.2s ease;
`;

const IconWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UnreadDot = styled.div`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ff474f;
  border: 2px solid #ffffff;
`;
