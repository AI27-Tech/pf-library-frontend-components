import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider } from "./Divider";
import { Inline, Stack } from "../Layout";
import { responsiveStory } from "../../stories/responsiveStory";
import { LONG_TOKEN } from "../../stories/responsiveFixtures";

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

const mobileStory: Story = {
  render: () => (
    <main>
      <Stack gap={3}>
        <span>Sección superior</span>
        <Divider label={<span style={{ overflowWrap: "anywhere" }}>{LONG_TOKEN}</span>} />
        <span>Sección inferior</span>
        <Inline gap={3} style={{ height: 48 }}>
          <span>Izquierda</span>
          <Divider orientation="vertical" />
          <span>Derecha</span>
        </Inline>
      </Stack>
    </main>
  ),
};

/** Móvil: la etiqueta larga se parte dentro de la línea y el divisor vertical no desborda. */
export const Mobile: Story = responsiveStory("mobile", mobileStory);