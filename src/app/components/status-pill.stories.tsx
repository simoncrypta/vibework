import type { Meta, StoryObj } from "@storybook/react-vite";

import { StatusPill } from "./status-pill";

const meta = {
  title: "Components/StatusPill",
  component: StatusPill,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    status: {
      control: "select",
      options: ["success", "error", "warning"],
    },
  },
  args: {
    status: "success",
    label: "Success",
  },
} satisfies Meta<typeof StatusPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {};

export const Error: Story = {
  args: {
    status: "error",
    label: "Error",
  },
};

export const Warning: Story = {
  args: {
    status: "warning",
    label: "Warning",
  },
};
