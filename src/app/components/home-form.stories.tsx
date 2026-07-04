import type { Meta, StoryObj } from "@storybook/react-vite";

import { HomeForm } from "./home-form";

const meta = {
  title: "Vibework/Components/HomeForm",
  component: HomeForm,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HomeForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
