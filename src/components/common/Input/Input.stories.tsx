import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "./Input";
import { AtSignIcon } from "../../svg/AtSignIcon";

/**
 * `Input` 컴포넌트는 사용자의 입력을 받기 위한 여러 하위 컴포넌트로 구성된 컴파운드 컴포넌트입니다.
 * `Input.Label`, `Input.Field`, `Input.ErrorMessage`를 조합하여 사용합니다.
 *
 * - **접근성**: `Label`, `Field`, `ErrorMessage` 간의 `id`, `htmlFor`, `aria-describedby` 등은
 *   내부적으로 자동 처리되므로 별도의 설정이 필요 없습니다.
 * - **유연성**: 각 하위 컴포넌트는 `...rest` props를 지원하므로, 표준 HTML 속성을 자유롭게 전달할 수 있습니다. 
 * - **react-hook-form**: 일반 form 태그 내부에서도 문제 없이 사용 가능하며, "react-hook-form" 과 함께 사용 가능합니다.
 */
const meta = {
  title: "components/common/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    $width: {
      control: "number",
      description: "컴포넌트의 전체 너비 설정",
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ### 기본 사용법 (유효한 상태)
 *
 * 가장 기본적인 `Input` 컴포넌트의 조합입니다. `Input.Label`과 `Input.Field`를 사용합니다.
 * `$isValidate` prop을 `true`로 설정하여 유효한 상태를 표시합니다.
 */
export const ValidState: Story = {
  args: {
    $width: 300,
    children: undefined,
  },
  render: (args) => (
    <Input {...args}>
      <Input.Label>이메일</Input.Label>
      <Input.Field $isValidate={true} placeholder="이메일을 입력하세요" />
    </Input>
  ),
};

/**
 * ### 유효하지 않은 상태
 *
 * `$isValidate` prop을 `false`로 설정하고 `Input.ErrorMessage`를 추가하여
 * 유효하지 않은 상태를 사용자에게 명확하게 보여줄 수 있습니다.
 */
export const InvalidState: Story = {
  args: {
    $width: 300,
    children: undefined,
  },
  render: (args) => (
    <Input {...args}>
      <Input.Label>이메일</Input.Label>
      <Input.Field
        $isValidate={false}
        defaultValue="invalid-email@gmai"
        aria-label="잘못된 이메일 형식"
      />
      <Input.ErrorMessage>
        이메일 형식이 올바르지 않습니다.
      </Input.ErrorMessage>
    </Input>
  ),
};

/**
 * ### 아이콘과 함께 사용
 *
 * `Input.Field`의 `$icon` prop에 아이콘 컴포넌트를 전달하여 입력 필드 내부에 아이콘을 표시할 수 있습니다.
 */
export const WithIcon: Story = {
  args: {
    $width: 300,
    children: undefined,
  },
  render: (args) => (
    <Input {...args}>
      <Input.Field
        $isValidate={true}
        $icon={<AtSignIcon width={16} height={16} />}
        placeholder="사용자 ID를 검색하세요"
      />
    </Input>
  ),
};

/**
 * ### 인터랙티브 유효성 검사
 *
 * 실제 폼(Form) 환경에서 사용자가 입력할 때마다 유효성을 검사하는 예제입니다.
 * `react-hook-form`를 사용하여 입력 값과 유효성 상태를 관리합니다.
 */
export const InteractiveValidation: Story = {
  args: {
    $width: 300,
    children: undefined,
  },
  render: (args) => {
    const {
      register,
      formState: { errors },
    } = useForm<{ email: string }>({
      mode: 'onChange',
      defaultValues: { email: '' },
    });

    return (
      <Input {...args}>
        <Input.Label>가입할 이메일</Input.Label>
        <Input.Field
          type="email"
          placeholder="test@example.com"
          {...register('email', {
            required: '이메일은 필수 항목입니다',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: '올바른 이메일 주소를 입력해주세요',
            },
          })}
          $isValidate={!errors.email}
        />
        {errors.email && (
          <Input.ErrorMessage>
            {errors.email.message}
          </Input.ErrorMessage>
        )}
      </Input>
    );
  },
};
