import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./Spinner";

const meta = {
  title: "Components/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tamaño mediano (por defecto). */
export const Medio: Story = {
  args: { size: "md" },
};

/** Tamaños chico y grande. */
export const Tamanos: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--ui-space-4)" }}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};

/** Etiqueta personalizada para el lector de pantalla. */
export const ConEtiqueta: Story = {
  args: { size: "md", label: "Guardando cambios" },
};
