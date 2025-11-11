import { apiFetch } from "@/lib/apiFetch";
import { BanbanResponse, PollResponse } from "@/types/api";
import { Poll } from "@/types/poll";
import { useAuthStore, waitForAuthReady } from "@/store/useAuthStore";

export const fetchPoll = async (date?: string): Promise<Poll> => {
  const hasDate = typeof date === "string" && date.trim().length > 0;
  const endpoint = hasDate
    ? `/polls?poll_date=${encodeURIComponent(date.trim())}`
    : "/polls";

  if (typeof window !== "undefined") {
    await waitForAuthReady();
  }

  const { isLoggedIn } = useAuthStore.getState();

  const response: PollResponse = await apiFetch(endpoint, {
    skipAuth: !isLoggedIn,
  });
  return response.data;
};

export const makeVote = async ({
  id,
}: {
  id: number;
}): Promise<BanbanResponse> => {
  return await apiFetch("/polls/votes", {
    method: "POST",
    body: JSON.stringify({ poll_option_id: id }),
  });
};
