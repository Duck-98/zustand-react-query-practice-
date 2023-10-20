import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

export default {
  title: "Example/Card",
  component: Card,
} as Meta<typeof Card>;

type Story = StoryObj<typeof Card>;

export const SmallCard: Story = {
  args: {
    title: "Small card",
    description: "This is a small card.",
    size: "small",
    primary: true,
  },
};

export const MediumCard: Story = {
  args: {
    title: "Medium card",
    description: "This is a medium card.",
    size: "medium",
    primary: true,
  },
};

export const LargeCard: Story = {
  args: {
    title: "Large card",
    description: "This is a large card.",
    size: "large",
  },
};
