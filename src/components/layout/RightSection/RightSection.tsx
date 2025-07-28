import styled from "styled-components";
import FeedsTab from "./FeedsTab/FeedsTab";
import FeedStream from "./FeedStream";
import { createContext, useState, Dispatch, useRef } from "react";
import { useCalculatedHeight } from "./useCalculateHeight";

export const SectionContext = createContext<{
  sectionStatus: "feeds" | "comments";
  setSectionStatus: Dispatch<React.SetStateAction<"feeds" | "comments">>;
}>({
  sectionStatus: "feeds",
  setSectionStatus: () => {},
});

export default function RightSection() {
  const [sectionStatus, setSectionStatus] = useState<"feeds" | "comments">(
    "feeds",
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const calculatedHeight = useCalculatedHeight(containerRef);

  const value = {
    sectionStatus,
    setSectionStatus,
  };

  return (
    <SectionContext.Provider value={value}>
      <StyledContainer $calculatedHeight={calculatedHeight} ref={containerRef}>
        {sectionStatus === "feeds" ? (
          <>
            <FeedsTab />
            <StyledDivider />
            <FeedStream />
          </>
        ) : (
          <StyledCommentsContainer>comments</StyledCommentsContainer>
        )}
      </StyledContainer>
    </SectionContext.Provider>
  );
}

const StyledCommentsContainer = styled.div`
  width: inherit;

  display: flex;
  flex-direction: row;
  gap: 10px;
  padding: 10px 16px;

  align-items: start;
`;

const StyledContainer = styled.div<{ $calculatedHeight?: number }>`
  width: 430px;
  height: ${(props) =>
    props.$calculatedHeight !== 0 ? `${props.$calculatedHeight}px` : "100%"};

  overflow: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

  display: flex;
  flex-direction: column;

  background-color: #fff;
  padding: 10px 10px 0 10px;
  border-radius: 8px 8px 0 0;

  margin-top: 16px;

  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.15);
`;

const StyledDivider = styled.div`
  border-top: 1px solid #f3f3f3;
  margin: 4px 0 0 0;
`;
