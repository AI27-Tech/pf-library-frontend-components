import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./Select";

const options = [
  { label: "United States", value: "us" },
  { label: "Mexico", value: "mx" },
  { label: "Spain", value: "es" },
  { label: "Argentina", value: "ar" },
];

const meta = {
  title: "Components/Input/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { options, placeholder: "Select a country", size: "md" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Preselected: Story = {
  args: { defaultValue: "mx" },
};

export const Invalid: Story = {
  args: { invalid: true },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "us" },
};

export const DarkMode: Story = {
  args: { defaultValue: "mx" },
  decorators: [
    (Story) => (
      <div
        style={{
          width: 280,
          padding: "1rem",
          borderRadius: "0.5rem",
          backgroundColor: "#1c222e",
          color: "#e2e8f0",
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const DarkModeWithRoles: Story = {
  args: {
    options: [
      { label: "Admin", value: "admin" },
      { label: "Editor", value: "editor" },
      { label: "Viewer", value: "viewer" },
      { label: "Auditor", value: "auditor" },
    ],
    placeholder: "Select a role",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: 280,
          padding: "1rem",
          borderRadius: "0.5rem",
          backgroundColor: "#1c222e",
          color: "#e2e8f0",
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    backgrounds: { default: "dark" },
  },
};
