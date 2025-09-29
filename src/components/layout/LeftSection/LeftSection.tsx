import RealtimeFeedRanking from "@/components/layout/LeftSection/RealtimeFeedRanking/RealtimeFeedRanking";
import TodayTopicCard from "@/components/layout/LeftSection/TodayTopicCard/TodayTopicCard";
import styled from "styled-components";
import ConfirmModal from "./TodayTopicCard/ConfirmModal";

export default function LeftSection() {
  return (
    <StyledContainer>
      <TodayTopicCard />
      <RealtimeFeedRanking />
      <ConfirmModal onClose={() => {}} onVote={() => {}} />
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 12px;
  padding-bottom: 32px;
`;
