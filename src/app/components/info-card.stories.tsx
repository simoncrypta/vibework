import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { InfoCard } from "./info-card";

const meta = {
  title: "Vibework/Components/InfoCard",
  component: InfoCard,
  tags: ["autodocs", "test"],
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
    tags: ["RSC", "Tailwind", "Edge"],
    description:
      "Pages stay Server Components. Controlled inputs and local state live in small client islands.",
    ctaLabel: "Get started",
    onCtaClick: fn(),
  },
} satisfies Meta<typeof InfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("RSC")).toBeVisible();
    await expect(canvas.getByText("Tailwind")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Get started" }));
    await expect(args.onCtaClick).toHaveBeenCalledOnce();
  },
};

export const SingleTag: Story = {
  args: {
    tags: ["New"],
    description: "A focused card with one tag and a short call to action.",
    ctaLabel: "Learn more",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("New")).toBeVisible();
    await expect(
      canvas.getByText("A focused card with one tag and a short call to action."),
    ).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Learn more" })).toBeEnabled();
  },
};
