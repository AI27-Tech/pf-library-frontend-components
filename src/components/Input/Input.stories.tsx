import { Search } from "lucide-react";
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
    startAdornment: <Search />,
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

export const StateError: Story = {
  args: { state: "error", defaultValue: "No válido" },
};

export const StateWarning: Story = {
  args: { state: "warning", defaultValue: "Revisar" },
};

export const StateSuccess: Story = {
  args: { state: "success", defaultValue: "Correcto" },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: "Solo lectura" },
};

/** El botón de borrar solo aparece cuando hay texto. */
export const Clearable: Story = {
  args: { clearable: true, defaultValue: "Borra este texto" },
};

/** En `type="password"`, el botón alterna entre ver y ocultar el texto. */
export const PasswordToggle: Story = {
  args: { type: "password", passwordToggle: true, defaultValue: "secreto" },
};
