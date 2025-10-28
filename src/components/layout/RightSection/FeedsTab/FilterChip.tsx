import styled from "styled-components";

interface FilterChipProps {
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function FilterChip({
  active,
  onClick,
  disabled = false,
}: FilterChipProps) {
  return (
    <StyledChip
      $active={active}
      onClick={disabled ? undefined : onClick}
      $disabled={disabled}
    >
      ⚡ 같은 편만 보기
    </StyledChip>
  );
}

const StyledChip = styled.button<{ $active: boolean; $disabled: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 16px;
  border: none;
  background: ${({ $active, $disabled }) =>
    $disabled
      ? "#f5f5f5"
      : $active
        ? "linear-gradient(to right, #6142FF, #1478FF)"
        : "#f0f0f0"};
  color: ${({ $active, $disabled }) =>
    $disabled ? "#9e9e9e" : $active ? "#fff" : "#71727a"};
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? "700" : "400")};
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: ${({ $active }) =>
      $active ? "linear-gradient(to right, #5235E8, #1269E8)" : "#e8e8e8"};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;
