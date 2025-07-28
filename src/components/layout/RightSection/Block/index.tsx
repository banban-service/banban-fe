import type { Feed } from "@/types/feeds";
import { AdBlock } from "./AdBlock";
import { FeedBlock } from "./FeedBlock";
import { CommentHeadBlock } from "./CommentHeadBlock";
import { CommentBlock } from "./CommentBlock";
import { CommentContent } from "@/types/comments";

type BlockType = "feed" | "ad" | "commentHead" | "comment";

type BlockProps =
  | { type: "feed" | "ad" | "commentHead"; feedProps: Feed }
  | { type: "comment"; commentProps: CommentContent };

const Block = (props: BlockProps) => {
  switch (props.type) {
    case "ad":
      return <AdBlock props={props.feedProps} />;
    case "feed":
      return <FeedBlock props={props.feedProps} />;
    case "commentHead":
      return <CommentHeadBlock props={props.feedProps} />;
    case "comment":
      return <CommentBlock props={props.commentProps} />;
    default:
      return null;
  }
};

export { Block };
export type { BlockType, BlockProps };