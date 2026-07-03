import type { Meta, StoryObj } from "@storybook/react-vite";

import { TokenSwatch } from "./token-swatch";

const meta = {
  title: "Components/TokenSwatch",
  component: TokenSwatch,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-48">
        <Story />
      </div>
    ),
  ],
  args: {
    token: "bg-surface",
    description: "Cards, panels",
    className: "bg-surface",
  },
} satisfies Meta<typeof TokenSwatch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Surface: Story = {};

export const Body: Story = {
  args: {
    token: "bg-body",
    description: "Page background",
    className: "bg-body",
  },
};

export const Muted: Story = {
  args: {
    token: "bg-muted",
    description: "Subtle emphasis",
    className: "bg-muted",
  },
};
