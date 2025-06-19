import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DefaultButton } from '@/components/common/Button';

const meta: Meta<typeof DefaultButton> = {
  title: 'components/common/Button/DefaultButton',
  component: DefaultButton,
  tags: ["autodocs"],
  argTypes: {
    isActive: {
      description: "버튼의 활성화 유무",
    },
    children: {
      description: "내부 요소"
    },
    onClick: {
      description: "버튼의 클릭 이벤트", 
    }
  },
  args: {
    isActive: true
  }
};

export default meta;
type Story = StoryObj<typeof DefaultButton>;

export const Default: Story = {
  args: {
    isActive: true,
    children: "닫기",
  }
};