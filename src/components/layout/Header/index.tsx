"use client";

import React from "react";
import { DefaultButton } from "@/components/common/Button";
import { BellIcon, UserIcon, DotIcon, BanBanLogo } from "@/components/svg";
import styled from "styled-components";

interface HeaderProps {
  isLoggedIn: boolean;
  isNew: boolean;
}
export default function Header({
  isLoggedIn = false,
  isNew = false,
}: HeaderProps) {
  return (
    <StyledHeader>
      <BanBanWrapper>
        <BanBanLogo />
      </BanBanWrapper>
      <ButtonContainer>
        {isLoggedIn ? (
          <>
            <IconWrapper>
              <BellIcon />
              {isNew && <DotIndicator />}
            </IconWrapper>
            <IconWrapper>
              <UserIcon />
            </IconWrapper>
          </>
        ) : (
          <>
            <TransparentButton>로그인</TransparentButton>
            <PrimaryButton>회원가입</PrimaryButton>
          </>
        )}
      </ButtonContainer>
    </StyledHeader>
  );
}

const StyledHeader = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 999;
  max-width: 1440px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 32px;
  background-color: #f9f8ff;
`;

const BanBanWrapper = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const ButtonContainer = styled.div`
  margin-left: auto;
  height: 100%;
  display: flex;
  align-items: center;
  width: fit-content;
  gap: 12px;
`;

const TransparentButton = styled(DefaultButton)`
  background-color: transparent;
  color: #535862;
  border: none;
  width: 78px;
  height: 44px;
  padding: 10px 18px;
  font-size: 16px;
`;

const PrimaryButton = styled(DefaultButton)`
  background-color: #3f13ff;
  color: white;
  border: none;
  width: 92px;
  height: 44px;
  padding: 10px 18px;
  font-size: 16px;
`;

const IconWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
`;

const DotIndicator = styled(DotIcon)`
  position: absolute;
  right: 13px;
  top: 9px;
`;
