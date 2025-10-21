import styled from "styled-components";
import { useFeeds } from "@/hooks/useFeeds";
import { useInView } from "react-intersection-observer";
import { Fragment, useEffect, useRef } from "react";
import { Block } from "../Block";
import useScrollPositionStore from "@/store/useScrollPositionStore";
import { usePoll } from "@/hooks/usePoll";
import { useFeedFilterStore } from "@/store/useFeedFilterStore";

export default function FeedStream() {
  const { sortBy, filterType } = useFeedFilterStore();
  const {
    data: todayPoll,
    isLoading: isPollLoading,
    isError: isPollError,
  } = usePoll();
  const pollId = todayPoll?.id;

  const feedsEnabled = typeof pollId === "number";

  const feedsQuery = useFeeds(
    {
      sort_by: sortBy,
      filter_type: filterType,
      poll_id: pollId,
    },
    {
      enabled: feedsEnabled,
    },
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isFeedsLoading,
  } = feedsQuery;

  const [scrollTrigger, isInView] = useInView({
    threshold: 0,
  });

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { scrollPosition, setScrollPosition } = useScrollPositionStore();

  useEffect(() => {
    if (!feedsEnabled) return;
    if (hasNextPage && isInView) {
      fetchNextPage();
    }
  }, [isInView, hasNextPage, feedsEnabled, fetchNextPage]);

  useEffect(() => {
    if (scrollPosition > 0) {
      scrollRef.current?.scrollTo(0, scrollPosition);
    }

    const handleScrollEnd = () => {
      setScrollPosition(scrollRef.current?.scrollTop || 0);
    };

    const debounce = (callback: () => void, wait: number) => {
      let timeout: number;

      return () => {
        clearTimeout(timeout);
        timeout = window.setTimeout(callback, wait);
      };
    };

    scrollRef.current?.addEventListener(
      "scroll",
      debounce(handleScrollEnd, 200),
    );

    return () => {
      scrollRef.current?.removeEventListener(
        "scroll",
        debounce(handleScrollEnd, 200),
      );
    };
  }, []);

  return (
    <StyledFeedStreamContainer ref={scrollRef}>
      {isPollLoading && (
        <div className="flex h-full items-center justify-center text-sm text-slate-500">
          오늘의 투표를 불러오는 중입니다...
        </div>
      )}

      {!isPollLoading && !feedsEnabled && !isPollError && (
        <div className="flex h-full items-center justify-center text-sm text-slate-500">
          오늘의 투표가 없어 관련 피드를 불러오지 않았습니다.
        </div>
      )}

      {!isPollLoading && isPollError && (
        <div className="flex h-full items-center justify-center text-sm text-red-500">
          투표 정보를 불러오지 못해 피드를 표시할 수 없습니다.
        </div>
      )}

      {feedsEnabled &&
        (isFeedsLoading ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            피드를 불러오는 중입니다...
          </div>
        ) : (
          <>
            {data?.pages?.map((page, index) => (
              <Fragment key={`page-${index}`}>
                {page?.data?.content?.map((item, idx, array) => {
                  const isSecondFromLast = idx === array.length - 4;
                  const itemKey =
                    item.type === "AD"
                      ? `ad-${item.id}-${idx}`
                      : `feed-${item.id}`;

                  return (
                    <Fragment key={itemKey}>
                      {isSecondFromLast && hasNextPage && (
                        <div ref={scrollTrigger} />
                      )}
                      {item.type === "USER" || item.type === "NOTICE" ? (
                        <Block
                          type="feed"
                          feedProps={item}
                          pollData={todayPoll}
                        />
                      ) : (
                        <Block
                          type="ad"
                          feedProps={item}
                          pollData={todayPoll}
                        />
                      )}
                    </Fragment>
                  );
                })}
              </Fragment>
            ))}
            <div className="flex h-30 items-center justify-center">
              {isFetchingNextPage ? (
                <div>로딩중...</div>
              ) : (
                <p className="text-gray-500">
                  {hasNextPage ? "" : "불러올 피드가 없습니다"}
                </p>
              )}
            </div>
          </>
        ))}
    </StyledFeedStreamContainer>
  );
}

const StyledFeedStreamContainer = styled.div`
  height: 100%;

  overflow: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  & > :first-child {
    margin-top: 10px;
  }
`;
