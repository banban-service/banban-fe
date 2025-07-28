import styled from "styled-components";
import { CommentTab } from "../CommentTab";
import { CommentHead } from "../Block/CommentHead";
import { useContext } from "react";
import { SectionContext } from "../SectionContext";
import { Comment } from "../Block/Comment";

const CommentsPanel = () => {
  const { targetFeed } = useContext(SectionContext);

  return (
    <>
      <CommentTab />
      {targetFeed === null ? (
        <div>오류! 댓글이 없습니다!</div>
      ) : (
        <>
          <CommentHead feedProps={targetFeed} />
          <StyledDivider />
          <Comment feedProps={targetFeed} />
          <Comment feedProps={targetFeed} />
          <Comment feedProps={targetFeed} />
          <Comment feedProps={targetFeed} />
          <Comment feedProps={targetFeed} />
          <Comment feedProps={targetFeed} />
          <Comment feedProps={targetFeed} />
        </>
      )}
    </>
  );
};

const StyledDivider = styled.div`
  border-top: 1px solid #f3f3f3;
  margin: 4px 0 0 0;
`;

export { CommentsPanel };
