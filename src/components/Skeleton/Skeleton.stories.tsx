import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton, SkeletonText, SkeletonCard } from "./Skeleton";
import { SkeletonTable } from "./SkeletonTable";

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Forma de texto (por defecto): altura de una línea y ancho completo. */
export const Texto: Story = {
  args: { variant: "text", width: 240 },
};

/** Forma circular: avatar o icono en carga. Con solo `width`, el alto sigue al ancho. */
export const Circulo: Story = {
  args: { variant: "circle", width: 48 },
};

/** Bloque rectangular: imagen o área de contenido. */
export const Rectangulo: Story = {
  args: { variant: "rect", width: 320, height: 120 },
};

/** Animación de pulso en lugar de barrido. */
export const Pulso: Story = {
  args: { variant: "rect", width: 320, height: 60, animation: "pulse" },
};

/** Sin animación: útil cuando el placeholder no debe moverse. */
export const SinAnimacion: Story = {
  args: { variant: "rect", width: 320, height: 60, animation: false },
};

/** Varias líneas de texto. La última línea es más corta, como un párrafo real. */
export const LineasDeTexto: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <SkeletonText lines={4} />
    </div>
  ),
};

/** Tarjeta en carga con la misma forma que `Card`. */
export const TarjetaEnCarga: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <SkeletonCard lines={3} />
    </div>
  ),
};

/** Tarjeta en carga con bloque de medio. */
export const TarjetaConMedio: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <SkeletonCard lines={2} media />
    </div>
  ),
};

/** Tabla en carga fuera de un `Table`. */
export const TablaEnCarga: Story = {
  render: () => <SkeletonTable rows={4} columns={4} />,
};

/** Tabla en carga con selección y expansión. */
export const TablaEnCargaConSeleccionYExpansion: Story = {
  render: () => <SkeletonTable rows={4} columns={3} selectable expandable />,
};

/** Tabla en carga compacta. */
export const TablaEnCargaCompacta: Story = {
  render: () => <SkeletonTable rows={6} columns={4} density="compact" />,
};
