import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Modal } from "./Modal";
import { Button } from "../Button";
import { FormField } from "../Input/FormField";
import { Input } from "../Input/Input";

const meta = {
  title: "Components/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    open: false,
    onClose: () => {},
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    open: { control: false },
    onClose: { control: false },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: { title: "Modal title", size: "md" },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal {...args} open={open} onClose={() => setOpen(false)}>
          <p>
            This is a controlled modal. Close it with the × button, the Escape
            key, or by clicking the overlay.
          </p>
        </Modal>
      </>
    );
  },
};

export const WithFooter: Story = {
  args: { title: "Delete item", size: "sm" },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Delete
        </Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                Delete
              </Button>
            </>
          }
        >
          Are you sure you want to delete this item? This action cannot be
          undone.
        </Modal>
      </>
    );
  },
};

export const WithForm: Story = {
  args: { title: "Create user", size: "md" },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>New user</Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Save</Button>
            </>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", paddingBottom: "0.5rem" }}>
            <FormField label="Name" required>
              <Input placeholder="Jane Doe" />
            </FormField>
            <FormField label="Email" required>
              <Input type="email" placeholder="you@example.com" />
            </FormField>
          </div>
        </Modal>
      </>
    );
  },
};
