import type { Meta, StoryObj } from "@storybook/react-vite";

import { PageHeader } from "./page-header";

const meta = {
  title: "Vibework/Components/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    title: "Astryx + Tailwind",
    description:
      "RedwoodSDK RSC on Cloudflare Workers. Astryx ships pre-built component CSS; Tailwind handles layout and token-backed utilities via the design-system bridge.",
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ShortCopy: Story = {
  args: {
    title: "Quick start",
    description: "Build UI in isolation with Storybook.",
  },
};
