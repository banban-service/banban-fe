interface User {
  userId: number;
  username: string;
  profileImage: string;
}

interface AdMeta {
  campaignId: string;
  ctaLabel: string;
}

interface Feed {
  id: number;
  type: "USER" | "AD";
  user: User;
  content: string;
  adUrl: null | string;
  adMeta: AdMeta | string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isMine: boolean;
}

interface FeedsRequest {
  lastId: number;
  size: number;
}

interface FeedsResponse {
  code: number;
  status: "SUCCESS" | "FAIL";
  data: Feed[];
  hasNext: boolean;
  size: number;
  numberOfElements: number;
}

// User는 추후 User 타입으로 변경. 충돌 가능성 때문에 여기에 두겠습니다.
export type { Feed, User, AdMeta, FeedsRequest, FeedsResponse };