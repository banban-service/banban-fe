import type { Feed } from "@/types/feeds";
import { AdBlock } from "./AdBlock";
import { FeedBlock } from "./FeedBlock";
import { CommentHeadBlock } from "./CommentHeadBlock";
import { CommentBlock } from "./CommentBlock";

type BlockType = "feed" | "ad" | "commentHead" | "comment";

interface BlockProps {
  type: BlockType;
  feedProps: Feed;
}

const Block = ({ type, feedProps }: BlockProps) => {
  switch (type) {
    case "ad":
      return <AdBlock feedProps={feedProps} />;
    case "feed":
      return <FeedBlock feedProps={feedProps} />;
    case "commentHead":
      return <CommentHeadBlock feedProps={feedProps} />;
    case "comment":
      return <CommentBlock feedProps={feedProps} />;
    default:
      return null;
  }
}

export { Block };
export type { BlockType, BlockProps };