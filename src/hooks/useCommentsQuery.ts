
import { useInfiniteQuery } from "@tanstack/react-query";
import { getComments } from "@/api/getComments";
import type { CommentResponse } from "@/types/comments";

interface UseCommentsQueryParams {
  feedId: number;
  size?: number;
}

export const useCommentsQuery = ({ feedId, size = 20 }: UseCommentsQueryParams) => {
  return useInfiniteQuery<CommentResponse>({
    queryKey: ["comments", feedId],
    queryFn: ({ pageParam }) =>
      getComments({ feedId, lastId: pageParam as number | null, size }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (!lastPage.data.hasNext) {
        return undefined;
      }
      const lastComment = lastPage.data.content[lastPage.data.content.length - 1];
      return lastComment?.id ?? undefined;
    },
    enabled: !!feedId,
  });
};
