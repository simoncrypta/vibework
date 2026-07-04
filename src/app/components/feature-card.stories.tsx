import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { FeatureCard } from "./feature-card";

const meta = {
  title: "Vibework/Components/FeatureCard",
  component: FeatureCard,
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
  args: {
    badges: [
      { label: "RSC", variant: "info" },
      { label: "Tailwind", variant: "success" },
      { label: "Astryx", variant: "neutral" },
    ],
    description:
      "Prefer Astryx layout primitives (VStack, HStack, Card) for structure; use Tailwind on wrappers and className overrides.",
    ctaLabel: "Get started",
    onCtaClick: fn(),
  },
} satisfies Meta<typeof FeatureCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleBadge: Story = {
  args: {
    badges: [{ label: "New", variant: "info" }],
    description: "A focused card with one badge and a short call to action.",
    ctaLabel: "Learn more",
  },
};
