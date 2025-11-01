"use client";

import styled from "styled-components";
import { media } from "@/constants/breakpoints";

interface MobileTabBarProps {
  activeTab: "poll" | "feeds";
  onTabChange: (tab: "poll" | "feeds") => void;
}

export default function MobileTabBar({
  activeTab,
  onTabChange,
}: MobileTabBarProps) {
  return (
    <Container>
      <TabButton
        $isActive={activeTab === "poll"}
        onClick={() => onTabChange("poll")}
      >
        🔥 투표
      </TabButton>
      <TabButton
        $isActive={activeTab === "feeds"}
        onClick={() => onTabChange("feeds")}
      >
        💬 피드
      </TabButton>
    </Container>
  );
}

const Container = styled.div`
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background-color: white;
  border-top: 1px solid #e2e8f0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
  z-index: 40;
  gap: 0;

  ${media.mobile} {
    display: flex;
  }
`;

const TabButton = styled.button<{ $isActive: boolean }>`
  flex: 1;
  padding: 12px 16px;
  border: none;
  background-color: ${(props) => (props.$isActive ? "white" : "#f8fafc")};
  color: ${(props) => (props.$isActive ? "#ff474f" : "#94a3b8")};
  font-size: 14px;
  font-weight: ${(props) => (props.$isActive ? "600" : "500")};
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: ${(props) =>
    props.$isActive ? "3px solid #ff474f" : "3px solid transparent"};

  &:active {
    background-color: #f1f5f9;
  }
`;
