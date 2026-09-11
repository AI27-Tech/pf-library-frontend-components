import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
    fullWidth: false,
    loading: false,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "danger"],
      description: "Visual style of the button.",
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
      description: "Size of the button.",
    },
    fullWidth: {
      control: "boolean",
      description: "Stretch the button to fill its container.",
    },
    loading: {
      control: "boolean",
      description: "Show a loading spinner and disable interaction.",
    },
    disabled: {
      control: "boolean",
      description: "Disable the button.",
    },
    onClick: { action: "clicked" },
    startIcon: { control: false },
    endIcon: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground driven by the controls panel. */
export const Playground: Story = {};

/** The default, high-emphasis action. */
export const Primary: Story = {
  args: { variant: "primary", children: "Primary" },
};

/** Lower-emphasis action, paired with a primary button. */
export const Secondary: Story = {
  args: { variant: "secondary", children: "Secondary" },
};

/** Emphasized with a border instead of a fill. */
export const Outline: Story = {
  args: { variant: "outline", children: "Outline" },
};

/** Minimal styling for tertiary actions. */
export const Ghost: Story = {
  args: { variant: "ghost", children: "Ghost" },
};

/** Destructive action, use with caution. */
export const Danger: Story = {
  args: { variant: "danger", children: "Delete" },
};

/** All variants side by side. */
export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="outline">Outline</Button>
      <Button {...args} variant="ghost">Ghost</Button>
      <Button {...args} variant="danger">Danger</Button>
    </div>
  ),
};

/** The three available sizes. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
};

/** Buttons with leading and trailing icons. */
export const WithIcons: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <Button {...args} startIcon={<PlusIcon />}>Add item</Button>
      <Button {...args} variant="outline" endIcon={<ArrowIcon />}>Next</Button>
      <Button {...args} variant="ghost" startIcon={<PlusIcon />} aria-label="Add" />
    </div>
  ),
};

/** Loading state disables interaction and shows a spinner. */
export const Loading: Story = {
  args: { loading: true, children: "Saving..." },
};

/** Disabled state. */
export const Disabled: Story = {
  args: { disabled: true, children: "Disabled" },
};

/** Stretches to fill the parent container. */
export const FullWidth: Story = {
  args: { fullWidth: true, children: "Full width" },
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
