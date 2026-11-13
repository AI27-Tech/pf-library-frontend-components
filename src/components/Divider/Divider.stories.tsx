import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider } from "./Divider";
import { Inline, Stack } from "../Layout";

const meta = {
  title: "Components/Divider",
  component: Divider,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Línea horizontal simple. */
export const Horizontal: Story = {
  args: { orientation: "horizontal" },
  render: (args) => (
    <Stack gap={3} style={{ width: 320 }}>
      <span>Sección superior</span>
      <Divider {...args} />
      <span>Sección inferior</span>
    </Stack>
  ),
};

/** Con etiqueta centrada. */
export const WithLabel: Story = {
  args: { label: "o" },
  render: (args) => (
    <div style={{ width: 320 }}>
      <Divider {...args} />
    </div>
  ),
};

/** Línea vertical entre dos elementos en fila. */
export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <Inline gap={3} style={{ height: 48 }}>
      <span>Izquierda</span>
      <Divider {...args} />
      <span>Derecha</span>
    </Inline>
  ),
};
