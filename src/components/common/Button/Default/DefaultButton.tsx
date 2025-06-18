import React from "react";
import styled, { css } from "styled-components";

interface DefaultButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive: boolean;
  children: React.ReactNode;
}

interface StyledProps {
  $isActive: boolean;
};

const cursorStyle = css<StyledProps>`
  cursor: ${({ $isActive }) => ($isActive ? 'pointer' : 'default')};
`;

const hoverStyle = css<StyledProps>`
  ${({ $isActive }) =>
    $isActive &&
    css`
      &:hover {
        background-color: #D5D7DA;
      }
    `}
`;

const baseStyle = css`
  transition: background-color 0.4s ease;
`;

const BackgroundStyle = styled.button<StyledProps>`
  display: flex;

  background-color: #FFFFFF;

  border: 1px solid #D5D7DA;
  border-radius: 8px;

  box-shadow: 0px 1px 2px rgba(10, 13, 18, 0.05);

  padding: 8px 14px;

  user-select: none;
  
  ${baseStyle}
  ${cursorStyle}
  ${hoverStyle}

  &:disabled {
    border-color: #E9EAEB;
    color: #D5D7DA;
  }
`;

const ContentStyle = styled.div`
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 14px;

  line-height: 20px;
`;

export const DefaultButton = ({ isActive, onClick, children, ...rest }: DefaultButtonProps) => {
  return (
    <BackgroundStyle 
      $isActive={isActive}
      disabled={!isActive}
      onClick={onClick}
      {...rest}
    >
      <ContentStyle>
        {children}
      </ContentStyle>
    </BackgroundStyle>
  )
}