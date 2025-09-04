"use client";

import { useState, useCallback } from "react";
import styled from "styled-components";
import { FloatingInputModal } from "@/components/layout/FloatingInputModal";
import { FloatingButton } from "@/components/common/Button/Floating/FloatingButton";
import type { Feed } from "@/types/feeds";

interface FloatingButtonWithModalProps {
  sectionStatus: "feeds" | "comments";
  targetFeed: Feed | null;
}

export default function FloatingButtonWithModal({
  sectionStatus,
  targetFeed,
}: FloatingButtonWithModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSubmit = useCallback((content: string) => {
    console.log("Submitted content:", content);
    setIsModalOpen(false);
  }, []);

  const actionType = sectionStatus === "comments" ? "댓글" : "피드";

  return (
    <>
      <FloatingButtonContainer>
        <FloatingButton
          state={isModalOpen ? "close" : "add"}
          onToggle={handleToggleModal}
        />
      </FloatingButtonContainer>

      {isModalOpen && (
        <FloatingInputModal
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          actionType={actionType}
          feedId={targetFeed?.id}
        />
      )}
    </>
  );
}

const FloatingButtonContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
`;
