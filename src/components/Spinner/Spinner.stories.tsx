import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./Spinner";
import { responsiveStory } from "../../stories/responsiveStory";

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

/** Movil: los tres tamanos dentro de un contenedor de 320 px, con una etiqueta larga. */
const mobileStory: Story = {
  render: () => (
    <main>
      <div style={{ width: 320, display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
        <Spinner size="md" label="Cargando el historial de bitacora de la unidad PT-07 y sus paradas" />
      </div>
    </main>
  ),
};
export const Mobile: Story = responsiveStory("mobile", mobileStory);
