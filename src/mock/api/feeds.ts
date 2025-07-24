'use server';

import { mockFeeds } from "../data/feeds";
import { FeedRequestApi, FeedsResponseApi } from "../types/feeds";

const mockFeedsApi = ({
  last_id,
  size,
}: FeedRequestApi): Promise<FeedsResponseApi> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const startIndex = last_id
        ? mockFeeds.findIndex((feed) => feed.id === last_id) + 1
        : 0;

      const data = mockFeeds.slice(startIndex, startIndex + size);

      const hasNext = startIndex + size < mockFeeds.length;

      const response: FeedsResponseApi = {
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