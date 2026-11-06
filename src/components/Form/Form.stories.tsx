import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form, FormSection, FormRow, FormActions } from "./Form";
import { FormField } from "../Input/FormField";
import { Input } from "../Input/Input";
import { Select } from "../Input/Select";
import { Textarea } from "../Input/Textarea";
import { Switch } from "../Input/Switch";
import { Button } from "../Button";

const meta = {
  title: "Components/Form",
  component: Form,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: { children: null },
  render: () => (
    <Form onSubmit={(e) => e.preventDefault()}>
      <FormField label="Full name" required>
        <Input placeholder="Jane Doe" />
      </FormField>
      <FormField label="Email" required helpText="We'll never share it.">
        <Input type="email" placeholder="you@example.com" />
      </FormField>
      <FormActions>
        <Button variant="ghost" type="button">Cancel</Button>
        <Button type="submit">Save</Button>
      </FormActions>
    </Form>
  ),
};

export const WithSectionsAndRows: Story = {
  args: { children: null },
  render: () => (
    <Form onSubmit={(e) => e.preventDefault()}>
      <FormSection title="Personal info" description="Basic details about you.">
        <FormRow>
          <FormField label="First name" required>
            <Input placeholder="Jane" />
          </FormField>
          <FormField label="Last name" required>
            <Input placeholder="Doe" />
          </FormField>
        </FormRow>
        <FormField label="Email" required>
          <Input type="email" placeholder="you@example.com" />
        </FormField>
      </FormSection>

      <FormSection title="Address">
        <FormField label="Street">
          <Input placeholder="123 Main St" />
        </FormField>
        <FormRow columns={3}>
          <FormField label="City">
            <Input placeholder="City" />
          </FormField>
          <FormField label="State">
            <Input placeholder="State" />
          </FormField>
          <FormField label="ZIP">
            <Input placeholder="00000" />
          </FormField>
        </FormRow>
      </FormSection>

      <FormActions align="between">
        <Button variant="ghost" type="button">Back</Button>
        <Button type="submit">Continue</Button>
      </FormActions>
    </Form>
  ),
};

export const ControlledWithValidation: Story = {
  args: { children: null },
  render: () => {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [bio, setBio] = useState("");
    const [notify, setNotify] = useState(true);
    const [submitted, setSubmitted] = useState(false);

    const emailError =
      submitted && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? "Enter a valid email address."
        : undefined;
    const roleError = submitted && !role ? "Please select a role." : undefined;

    return (
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <FormField label="Email" required error={emailError}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </FormField>

        <FormField label="Role" required error={roleError}>
          <Select
            placeholder="Select a role"
            value={role}
            onChange={(valor) => setRole(String(valor))}
            options={[
              { label: "Admin", value: "admin" },
              { label: "Editor", value: "editor" },
              { label: "Viewer", value: "viewer" },
            ]}
          />
        </FormField>

        <FormField label="Bio" helpText="Optional short description.">
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Tell us about yourself"
          />
        </FormField>

        <Switch
          label="Email notifications"
          checked={notify}
          onChange={(e) => setNotify(e.target.checked)}
        />

        <FormActions>
          <Button type="submit">Create account</Button>
        </FormActions>
      </Form>
    );
  },
};
