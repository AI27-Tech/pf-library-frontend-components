import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressBar } from "./ProgressBar";
import { responsiveStory } from "../../stories/responsiveStory";

const meta = {
  title: "Components/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Progreso determinado: 40 %. */
export const Determinada: Story = {
  args: { value: 40, label: "Progreso de la carga" },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <ProgressBar {...args} />
    </div>
  ),
};

/** Progreso indeterminado: se desplaza sin saber cuánto falta. */
export const Indeterminada: Story = {
  args: { label: "Procesando" },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <ProgressBar {...args} />
    </div>
  ),
};

/** Bordes: 0 %, 100 %, y valores fuera de rango que se ajustan a 0 y 100. */
export const Bordes: Story = {
  render: () => (
    <div style={{ maxWidth: 360, display: "grid", gap: "var(--ui-space-3)" }}>
      <ProgressBar value={0} label="Cero" />
      <ProgressBar value={100} label="Completo" />
      <ProgressBar value={-10} label="Por debajo del rango" />
      <ProgressBar value={130} label="Por encima del rango" />
    </div>
  ),
};

/** Altura chica y mediana. */
export const Tamanos: Story = {
  render: () => (
    <div style={{ maxWidth: 360, display: "grid", gap: "var(--ui-space-3)" }}>
      <ProgressBar value={60} size="sm" label="Pequeña" />
      <ProgressBar value={60} size="md" label="Mediana" />
    </div>
  ),
};

/** Movil: barras de distintos tamanos en un contenedor angosto, con una etiqueta visible larga encima de cada una. */
const mobileStory: Story = {
  render: () => (
    <main>
      <div style={{ width: "16rem", display: "grid", gap: "var(--ui-space-3)" }}>
        <p style={{ margin: 0, overflowWrap: "anywhere" }}>Avance de carga del viaje VJ-2026-000481 y sus paradas intermedias</p>
        <ProgressBar value={35} label="Avance del viaje" size="sm" />
        <p style={{ margin: 0, overflowWrap: "anywhere" }}>Sincronizacion de bitacora de la unidad PT-07 con el centro de monitoreo</p>
        <ProgressBar value={72} label="Sincronizacion" size="md" />
        <ProgressBar label="Cargando" />
      </div>
    </main>
  ),
};
export const Mobile: Story = responsiveStory("mobile", mobileStory);
