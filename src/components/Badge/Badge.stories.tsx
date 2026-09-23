import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    children: "Custodia activa",
    variant: "escort",
    dot: false,
    pulse: false,
    pill: false,
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["secure", "alert", "escort", "warning", "neutral"],
    },
    dot: { control: "boolean" },
    pulse: { control: "boolean" },
    pill: { control: "boolean" },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Las señales de estado táctico del sistema AI27. */
export const StatusSignals: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
      <Badge variant="secure" dot>Custodia activa</Badge>
      <Badge variant="escort" dot>Escolta enlazada</Badge>
      <Badge variant="warning" dot>Demora en ruta</Badge>
      <Badge variant="alert" pulse>Jamming detectado</Badge>
      <Badge variant="neutral">Sin datos</Badge>
    </div>
  ),
};

/** Etiquetas de estado de ruta típicamente mostradas en tablas. */
export const RouteTags: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
      <Badge variant="secure" pill>EN RUTA</Badge>
      <Badge variant="alert" pill>DESVÍO</Badge>
      <Badge variant="escort" pill>CUSTODIA ACTIVA</Badge>
    </div>
  ),
};

export const AllVariants: Story = {
  args: {
    pulse: true
  },

  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-start" }}>
      {(["secure", "escort", "warning", "alert", "neutral"] as const).map((v) => (
        <Badge key={v} variant={v} dot>
          {v}
        </Badge>
      ))}
    </div>
  )
};
