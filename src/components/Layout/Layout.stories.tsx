import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Grid, Inline, Stack } from "./Layout";

const meta = {
  title: "Components/Layout",
  component: Stack,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const Box = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      padding: "var(--ui-space-2)",
      border: "1px solid var(--ui-color-border)",
      borderRadius: "var(--ui-radius)",
      background: "var(--ui-color-surface)",
      color: "var(--ui-color-text)",
      fontSize: "var(--ui-text-body-md-size)",
    }}
  >
    {children}
  </div>
);

/** Columna con separación de 3. */
export const StackDefault: Story = {
  render: () => (
    <Stack gap={3} style={{ maxWidth: 320 }}>
      <Box>Primero</Box>
      <Box>Segundo</Box>
      <Box>Tercero</Box>
    </Stack>
  ),
};

/** Columna con alineación al centro en el eje transversal. */
export const StackAligned: Story = {
  render: () => (
    <Stack gap={2} align="center" style={{ width: 320 }}>
      <Box>Centrado</Box>
      <Box>También centrado</Box>
    </Stack>
  ),
};

/** Fila que envuelve cuando no caben los elementos. */
export const InlineWrap: Story = {
  render: () => (
    <Inline gap={2} style={{ maxWidth: 280 }}>
      {Array.from({ length: 6 }, (_, i) => (
        <Box key={i}>Elemento {i + 1}</Box>
      ))}
    </Inline>
  ),
};

/** Fila sin envoltura: los elementos se encogen o desbordan. */
export const InlineNoWrap: Story = {
  render: () => (
    <Inline gap={2} wrap={false} justify="between" style={{ width: 420 }}>
      <Box>Izquierda</Box>
      <Box>Derecha</Box>
    </Inline>
  ),
};

/** Separación 0 y 6 para ver los extremos de la escala. */
export const GapScale: Story = {
  render: () => (
    <Stack gap={0} style={{ maxWidth: 320 }}>
      <Box>Gap 0</Box>
      <Box>Gap 0</Box>
      <Stack gap={6}>
        <Box>Gap 6</Box>
        <Box>Gap 6</Box>
      </Stack>
    </Stack>
  ),
};

/** Columnas fijas: tres columnas iguales. */
export const GridColumns: Story = {
  render: () => (
    <Grid columns={3} gap={3}>
      {Array.from({ length: 6 }, (_, i) => (
        <Box key={i}>Celda {i + 1}</Box>
      ))}
    </Grid>
  ),
};

/** Columnas automáticas con ancho mínimo: se reacomoda con el ancho de la pantalla. */
export const GridMinItemWidth: Story = {
  render: () => (
    <Grid minItemWidth="10rem" gap={3} style={{ width: 520 }}>
      {Array.from({ length: 7 }, (_, i) => (
        <Box key={i}>Tarjeta {i + 1}</Box>
      ))}
    </Grid>
  ),
};

/** Si se pasan `columns` y `minItemWidth`, gana `columns`. */
export const GridColumnsWinsOverMin: Story = {
  render: () => (
    <Grid columns={2} minItemWidth="20rem" gap={2} style={{ width: 520 }}>
      <Box>Columna 1</Box>
      <Box>Columna 2</Box>
      <Box>Columna 1</Box>
      <Box>Columna 2</Box>
    </Grid>
  ),
};
