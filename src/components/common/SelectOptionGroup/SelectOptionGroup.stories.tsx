import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SelectOptionGroup } from './SelectOptionGroup';

const meta: Meta<typeof SelectOptionGroup> = {
  title: 'components/common/SelectOptionGroup',
  component: SelectOptionGroup,
  tags: ["autodocs"],
  args: {
    width: "600px",
    rowGap: "10px",
    firstOption: "24시간 자유, 월 300씩 들어오는 백수",
    secondOption: "주 52시간 근무, 월급 600 직장인"
  }
};

export default meta;
type Story = StoryObj<typeof SelectOptionGroup>;

export const Default: Story = {
  args: {
    width: "600px",
    rowGap: "10px",
    firstOption: "24시간 자유, 월 300씩 들어오는 백수",
    secondOption: "주 52시간 근무, 월급 600 직장인"
  }
};