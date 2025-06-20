import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DefaultButton } from './DefaultButton';
import { describe, it, expect, vi } from 'vitest';

describe('DefaultButton', () => {
  it('버튼 텍스트가 정상적으로 렌더링된다', () => {
    render(<DefaultButton>Click me</DefaultButton>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('클릭 시 onClick 핸들러가 호출된다', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<DefaultButton onClick={onClick}>Click me</DefaultButton>);
    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalled();
  });

  it('비활성 상태에서 클릭 시 반응하지 않는다', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(
      <DefaultButton
        isActive={false}
        onClick={onClick}
      >
        Click me
      </DefaultButton>
    );

    await user.click(screen.getByRole('button'));

    expect(onClick).not.toHaveBeenCalled(); 
  });
});