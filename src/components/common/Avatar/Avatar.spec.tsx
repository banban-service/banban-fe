import { screen } from "@testing-library/react";
import React from "react";
import render from "@/utils/test/render";
import { Avatar } from "./Avatar";

it("아바타에 부여한 주소의 이미지가 알맞은 사이즈로 렌더링된다", async () => {
  const altText = "사용자 프로필 이미지";
  await render(<Avatar src="/love.jpg" alt={altText} size={50} />);

  const img = screen.getByAltText(altText);

  expect(img).toBeInTheDocument();
});

it("이미지가 지정된 크기와 스타일로 렌더링된다", async () => {
  const size = 48;
  await render(<Avatar src="/love.jpg" alt="avatar" size={size} />);
  const img = screen.getByRole("img");

  expect(img).toHaveAttribute("width", size.toString());
  expect(img).toHaveAttribute("height", size.toString());
  expect(img).toHaveStyle({ objectFit: "cover" });
});

it("접근성을 위해 role이나 aria-label이 설정된다면 올바르게 전달된다", async () => {
  await render(<Avatar src="/love.jpg" alt="사용자 아바타" size={40} />);
  const img = screen.getByRole("img", { name: "사용자 아바타" }); // alt가 aria-label 역할
  expect(img).toBeInTheDocument();
});
