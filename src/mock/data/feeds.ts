import { FeedApi } from "../types/feeds";

const mockFeeds: FeedApi[] = Array.from({ length: 32 }, (_, i): FeedApi => {
  const id = i + 1;
  const isAdFeed = id % 20 === 0;

  return {
    id: id,
    type: isAdFeed ? "AD" : "USER",
    user: {
      user_id: isAdFeed ? null : id + 100 ,
      username: isAdFeed ? 'Ad' : `User${id}`,
      profile_image: `https://picsum.photos/200/200?random=${id}`,
    },
    content: `This is a mock feed content number ${id}. It's designed to test the UI and data fetching.`,
    ad_url: isAdFeed ? `https://picsum.photos/600/400?random=${id}` : null,
    ad_meta: isAdFeed ? {
      campaignId: "ECO-202507",
      ctaLabel: "바로 보기"
    } : null,
    created_at: new Date(
      Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
    ).toISOString(),
    like_count: Math.floor(Math.random() * 1000),
    comment_count: Math.floor(Math.random() * 200),
    isLiked: Math.random() > 0.5,
    isMine: Math.random() > 0.8,
  };
});

export { mockFeeds };
