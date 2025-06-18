import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DefaultButton } from '@/components/common/Button';

const meta: Meta<typeof DefaultButton> = {
  title: 'components/common/Button/DefaultButton',
  component: DefaultButton,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof DefaultButton>;

export const Default: Story = {
  args: {
    isActive: true,
    children: "닫기",
  }
};