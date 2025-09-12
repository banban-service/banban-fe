import { apiFetch } from "@/lib/apiFetch";
import { FeedResponse } from "@/types/api";

export interface HotFeed {
  content: string;
  direction: "UP" | "DOWN";
  feed_id: number;
  rank: number;
  rank_change: number;
}

export const fetchHotFeed = async (): Promise<HotFeed[]> => {
  const response: FeedResponse<HotFeed> = await apiFetch("/feeds/hot");
  return response.feeds;
};
