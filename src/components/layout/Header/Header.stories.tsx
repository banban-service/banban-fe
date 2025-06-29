import { Meta, StoryObj } from "@storybook/nextjs-vite";
import Header from ".";

const meta: Meta<typeof Header> = {
  title: "Components/Layout/Header",
  component: Header,
  tags: ["autodocs"],
  argTypes: {
    isLoggedIn: {
      control: "boolean",
      description: "로그인 상태 여부",
      defaultValue: false,
    },
    isNew: {
      control: "boolean",
      description: "새 알림 여부",
      defaultValue: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const LoggedOut: Story = {
  args: {
    isLoggedIn: false,
    isNew: false,
  },
};

export const LoggedInNoNotification: Story = {
  args: {
    isLoggedIn: true,
    isNew: false,
  },
};

export const LoggedInWithNotification: Story = {
  args: {
    isLoggedIn: true,
    isNew: true,
  },
};
