import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar } from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Components/Common/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  args: {
    src: "https://cdn.mhnse.com/news/photo/202411/350509_402876_5441.jpg",
    alt: "사용자 아바타",
    size: 50,
  },
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {};

export const BrokenImage: Story = {
  args: {
    src: "/no_img.png",
    size: 20,
    background: "transparent",
  },
};
