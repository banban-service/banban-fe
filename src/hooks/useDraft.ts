import { useCallback, useRef } from "react";

export const useDraft = (actionType: string) => {
  const hasRestoredDraft = useRef(false);

  const saveDraft = useCallback((content: string) => {
    if (actionType === '피드') {
      localStorage.setItem('feed-draft', content);
      // 저장하면 폐기 플래그는 제거
      localStorage.removeItem('feed-draft-discarded');
    }
  }, [actionType]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem('feed-draft');
  }, []);

  const discardDraft = useCallback(() => {
    localStorage.removeItem('feed-draft');
    localStorage.setItem('feed-draft-discarded', 'true');
  }, []);

  const restoreDraft = useCallback((setContent: (content: string) => void) => {
    const currentDraftContent = typeof window !== 'undefined' ? localStorage.getItem('feed-draft') || '' : '';
    const currentHasDiscarded = typeof window !== 'undefined' ? localStorage.getItem('feed-draft-discarded') === 'true' : false;

    if (actionType === '피드' && currentDraftContent && !hasRestoredDraft.current && !currentHasDiscarded) {
      setContent(currentDraftContent);
      hasRestoredDraft.current = true;
      return true; // 토스트 표시 가능
    }
    return false; // 토스트 표시 불가
  }, [actionType]);

  return { draftContent: '', saveDraft, clearDraft, discardDraft, restoreDraft };
};
