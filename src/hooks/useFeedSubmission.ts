import { useState, useCallback } from "react";
import { useToast } from "../components/common/Toast/useToast";
import { useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/apiFetch";

export const useFeedSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const submitFeed = useCallback(async (content: string, actionType: string) => {
    if (!content.trim() || isSubmitting) return false;

    setIsSubmitting(true);
    try {
      await apiFetch('/feeds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim()
        })
      });

      showToast({
        type: 'success',
        message: `${actionType}이 성공적으로 등록되었습니다!`,
        duration: 3000
      });

      queryClient.invalidateQueries({ queryKey: ['feeds'] });
      return true; // 성공
    } catch (error) {
      console.error('Failed to submit feed:', error);
      showToast({
        type: 'error',
        message: `${actionType} 등록에 실패했습니다. 다시 시도해주세요.`,
        duration: 4000
      });
      return false; // 실패
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, showToast, queryClient]);

  return { isSubmitting, submitFeed };
};
