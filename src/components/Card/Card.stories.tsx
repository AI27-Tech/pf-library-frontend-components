import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardHeader, CardBody, CardFooter } from "./Card";
import { Button } from "../Button";

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { variant: "outlined", padding: "md" },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["outlined", "elevated", "filled"],
    },
    padding: {
      control: "inline-radio",
      options: ["none", "sm", "md", "lg"],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader title="Card title" subtitle="Supporting text" />
      <CardBody>
        This is the body of the card. Use it for any content you need to show.
      </CardBody>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader title="Confirm action" subtitle="This cannot be undone" />
      <CardBody>Are you sure you want to delete this item?</CardBody>
      <CardFooter>
        <Button variant="ghost">Cancel</Button>
        <Button variant="danger">Delete</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithMediaAndAction: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader
        title="Storage"
        subtitle="72% used"
        media={<DiskIcon />}
        action={<Button size="sm" variant="outline">Manage</Button>}
      />
      <CardBody>You are using 7.2 GB of your 10 GB plan.</CardBody>
    </Card>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1rem" }}>
      {(["outlined", "elevated", "filled"] as const).map((v) => (
        <Card key={v} variant={v}>
          <CardHeader title={v} subtitle="Card variant" />
          <CardBody>Content for the {v} variant.</CardBody>
        </Card>
      ))}
    </div>
  ),
};

export const Clickable: Story = {
  render: (args) => (
    <Card {...args} onClick={() => alert("Card clicked")}>
      <CardHeader title="Clickable card" subtitle="Press Enter or Space" />
      <CardBody>The whole card acts as a button.</CardBody>
    </Card>
  ),
};

function DiskIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M8 4v4h6V4" />
    </svg>
  );
}
