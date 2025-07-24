interface UserApi {
  user_id: number | null;
  username: string;
  profile_image: string;
}

interface AdMetaApi {
  campaignId: string;
  ctaLabel: string;
}

interface FeedApi {
  id: number;
  type: "USER" | "AD";
  user: UserApi;
  content: string;
  ad_url: string | null;
  ad_meta: AdMetaApi | null;
  created_at: string;
  like_count: number;
  comment_count: number;
  isLiked: boolean;
  isMine: boolean;
}

interface FeedRequestApi {
  last_id: number;
  size: number;
}

interface FeedsResponseApi {
  code: number;
  status: "SUCCESS" | "FAIL";
  data: FeedApi[];
  hasNext: boolean;
  size: number;
  numberOfElements: number;
}

export type { FeedApi, FeedRequestApi, FeedsResponseApi, UserApi };
