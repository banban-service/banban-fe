'use server';

import type { FeedRequest, FeedsResponse } from "@/types/feeds";
import { mockFeeds } from "../data/feeds";

const mockFeedsApi = ({
  lastId,
  size,
}: FeedRequest): Promise<FeedsResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const startIndex = lastId
        ? mockFeeds.findIndex((feed) => feed.id === lastId) + 1
        : 100;

      const data = mockFeeds.slice(startIndex, startIndex + size);

      const hasNext = startIndex + size < mockFeeds.length;

      const response: FeedsResponse = {
        code: 200,
        status: "SUCCESS",
        data: data,
        hasNext: hasNext,
        size: size,
        numberOfElements: data.length,
      };
      
      resolve(response);
    }, 500);
  });
};

export { mockFeedsApi };