"use client";

import { useState, useCallback, useEffect } from "react";
import { useToast } from "../../common/Toast/useToast";
import { useDraft } from "../../../hooks/useDraft";
import { useFeedSubmission } from "../../../hooks/useFeedSubmission";
import { FeedInputForm } from "./FeedInputForm";
import { CancelConfirmModal } from "./CancelConfirmModal";

interface TargetUser {
  nickname: string;
  description: string;
  avatarUrl: string;
  highlightText?: string; // 강조할 텍스트
  voteTextColor?: string; // 투표 텍스트 색상
}

interface FloatingInputModalProps {
  onClose: () => void;
  onSubmit: (content: string) => void;
  actionType?: "댓글" | "피드"; // 등록할 콘텐츠 타입
}

export const FloatingInputModal = ({
  onClose,
  onSubmit,
  actionType = "댓글",
}: FloatingInputModalProps) => {
  // 커스텀 훅 사용
  const { saveDraft, clearDraft, discardDraft, restoreDraft } = useDraft(actionType);
  const { isSubmitting, submitFeed } = useFeedSubmission();

  // 간단한 상태만 관리
  const [content, setContent] = useState('');
  const [targetUser, setTargetUser] = useState<TargetUser | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const { showToast } = useToast();

  // 초안 복원
  useEffect(() => {
    const wasRestored = restoreDraft(setContent);
    if (wasRestored) {
      showToast({
        type: 'info',
        message: '이전에 작성하던 내용을 불러왔습니다.',
        duration: 2000
      });
    }
  }, [restoreDraft, showToast]);

  // 제출 핸들러
  const handleSubmit = useCallback(async () => {
    const success = await submitFeed(content, actionType);
    if (success) {
      if (actionType === '피드') {
        clearDraft();
      }
      onSubmit(content.trim());
      setContent('');
      onClose();
    }
  }, [content, actionType, submitFeed, clearDraft, onSubmit, onClose]);

  // 취소 핸들러
  const handleCancel = useCallback(() => {
    if (actionType === '피드' && content.trim()) {
      setShowCancelConfirm(true);
    } else {
      onClose();
    }
  }, [actionType, content, onClose]);

  // 키보드 이벤트 핸들러
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  }, [handleSubmit, handleCancel]);

  // 콘텐츠 변경 핸들러
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    saveDraft(newContent);
  }, [saveDraft]);

  // 사용자 정보 로드 핸들러
  const handleUserLoaded = useCallback((user: TargetUser) => {
    setTargetUser(user);
  }, []);

  const handleUserError = useCallback((error: Error) => {
    console.error("Failed to load user info:", error);
  }, []);

  return (
    <>
      <FeedInputForm
        content={content}
        onContentChange={handleContentChange}
        onKeyDown={handleKeyDown}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        targetUser={targetUser}
        onUserLoaded={handleUserLoaded}
        onUserError={handleUserError}
        actionType={actionType}
        isSubmitting={isSubmitting}
      />

      {showCancelConfirm && (
        <CancelConfirmModal
          onSave={() => {
            saveDraft(content);
            showToast({
              type: 'info',
              message: '작성 중인 내용이 임시 저장되었습니다.',
              duration: 2000
            });
            setShowCancelConfirm(false);
            onClose();
          }}
          onDiscard={() => {
            discardDraft();
            setShowCancelConfirm(false);
            onClose();
          }}
          onCancel={() => setShowCancelConfirm(false)}
        />
      )}
    </>
  );
};
