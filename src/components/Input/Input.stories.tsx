import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";

const meta = {
  title: "Components/Input/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    placeholder: "Type something...",
    size: "md",
    invalid: false,
    disabled: false,
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    startAdornment: { control: false },
    endAdornment: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: "Hello world" },
};

export const Invalid: Story = {
  args: { invalid: true, defaultValue: "not-an-email" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Disabled" },
};

export const WithAdornments: Story = {
  args: {
    startAdornment: <SearchIcon />,
    placeholder: "Search...",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <Input {...args} size="sm" placeholder="Small" />
      <Input {...args} size="md" placeholder="Medium" />
      <Input {...args} size="lg" placeholder="Large" />
    </div>
  ),
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}
