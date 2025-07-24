interface MockUser {
  user_id: number | null;
  username: string;
  profile_image: string;
}

interface MockAdMeta {
  campaignId: string;
  ctaLabel: string;
}

interface MockFeed {
  id: number;
  type: "USER" | "AD";
  user: MockUser;
  content: string;
  ad_url: string | null;
  ad_meta: MockAdMeta | null;
  created_at: string;
  like_count: number;
  comment_count: number;
  isLiked: boolean;
  isMine: boolean;
}

interface MockFeedsRequest {
  last_id: number;
  size: number;
}

interface MockFeedsResponse {
  code: number;
  status: "SUCCESS" | "FAIL";
  data: MockFeed[];
  hasNext: boolean;
  size: number;
  numberOfElements: number;
}

export type { MockAdMeta, MockFeed, MockFeedsRequest, MockFeedsResponse, MockUser };
