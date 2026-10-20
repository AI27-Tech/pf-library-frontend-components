import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormField } from "./FormField";
import { Input } from "./Input";
import { Select } from "./Select";
import { Textarea } from "./Textarea";

const meta = {
  title: "Components/Input/FormField",
  component: FormField,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithInput: Story = {
  args: {
    label: "Email",
    required: true,
    helpText: "We'll never share your email.",
    children: <Input type="email" placeholder="you@example.com" />,
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    error: "Please enter a valid email address.",
    children: <Input type="email" defaultValue="not-an-email" />,
  },
};

export const WithSelect: Story = {
  args: {
    label: "Country",
    children: (
      <Select
        placeholder="Select a country"
        options={[
          { label: "Mexico", value: "mx" },
          { label: "Spain", value: "es" },
        ]}
      />
    ),
  },
};

export const WithTextarea: Story = {
  args: {
    label: "Message",
    helpText: "Max 500 characters.",
    children: <Textarea placeholder="Your message..." rows={4} />,
  },
};

export const FullForm: Story = {
  args: { children: null },
  render: () => (
    <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <FormField label="Full name" required>
        <Input placeholder="Jane Doe" />
      </FormField>
      <FormField label="Email" required error="This field is required.">
        <Input type="email" placeholder="you@example.com" />
      </FormField>
      <FormField label="Bio" helpText="A short description.">
        <Textarea rows={3} placeholder="Tell us about yourself" />
      </FormField>
    </form>
  ),
};
