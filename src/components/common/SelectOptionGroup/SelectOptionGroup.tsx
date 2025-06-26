'use client'

import React from 'react';
import styled from 'styled-components';
import { CSSProperties } from 'styled-components';
import { DefaultButton } from '@/components/common/Button';

type SelectOptionGroupStyleProps = Pick<CSSProperties, 'width' | 'height' | 'rowGap'>

interface SelectOptionGroupProps extends SelectOptionGroupStyleProps {
  firstOption: string
  secondOption: string
}

interface GradientStyleProps {
  fromColor: string;
  toColor: string;
}

const ButtonStyle = styled(DefaultButton)<GradientStyleProps>`
  display: flex;
  justify-content: center;

  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to right, 
      ${({ fromColor }) => fromColor} 0%,
      ${({ toColor }) => toColor} 100%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 0;
  }

  & > * {
    position: relative;
    z-index: 1;
  }

  &:hover::before {
    opacity: 1;
  }

  & > div {
    background: linear-gradient(
      to right, 
      ${({ fromColor }) => fromColor} 0%,
      ${({ toColor }) => toColor} 100%
    );
    background-clip: text;
    color: transparent;
    transition: all 0.4s ease;
  }

  &:hover > div {
    background: white;
    background-clip: text;
    color: transparent;
  }
`

const SelectOptionGroupStyle = styled.div<SelectOptionGroupStyleProps>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};

  display: flex;
  flex-direction: column;
  row-gap: ${({ rowGap }) => rowGap};
`

export const SelectOptionGroup = ({ firstOption, secondOption, ...styleProps }: SelectOptionGroupProps) => {
  return (
    <SelectOptionGroupStyle {...styleProps}>
      <ButtonStyle fromColor="#FF05CE" toColor="#FF474F">
        {firstOption}
      </ButtonStyle>
      <ButtonStyle fromColor="#6142FF" toColor="#1478FF">
        {secondOption}
      </ButtonStyle>
    </SelectOptionGroupStyle>
  )
}
