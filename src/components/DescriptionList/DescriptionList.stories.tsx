import type { Meta, StoryObj } from "@storybook/react-vite";
import { DescriptionList } from "./DescriptionList";
import { responsiveStory } from "../../stories/responsiveStory";
import { LONG_TOKEN, viaje } from "../../stories/responsiveFixtures";

const meta = {
  title: "Components/DescriptionList",
  component: DescriptionList,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  { label: "Cliente", value: "Acme Logística" },
  { label: "Origen", value: "Monterrey, N. L." },
  { label: "Destino", value: "Querétaro, Qro." },
  { label: "Tracto", value: "TR-204" },
];

/** Nombre sobre valor, en dos columnas. */
export const Vertical: Story = {
  args: { items, columns: 2, orientation: "vertical" },
};

/** Nombre y valor en la misma fila. */
export const Horizontal: Story = {
  args: { items, columns: 1, orientation: "horizontal", style: { maxWidth: 480 } },
};

/** Tres columnas. */
export const ThreeColumns: Story = {
  args: { items, columns: 3 },
};

/** Un elemento ocupa dos columnas. */
export const WithSpan: Story = {
  args: {
    columns: 3,
    items: [
      { label: "Cliente", value: "Acme Logística", span: 2 },
      { label: "Tracto", value: "TR-204" },
      { label: "Observaciones", value: "Llegada prevista con retraso por lluvia en la ruta.", span: 3 },
    ],
  },
};

/** Valores vacíos muestran el texto de `emptyValue`. */
export const EmptyValues: Story = {
  args: {
    columns: 2,
    emptyValue: "Sin dato",
    items: [
      { label: "Operador", value: "" },
      { label: "Custodio", value: null },
      { label: "Patrulla", value: undefined },
      { label: "Tracto", value: "TR-204" },
    ],
  },
};

const fichaViaje = [
  { label: "Folio", value: viaje.folio },
  { label: "Origen", value: viaje.origen },
  { label: "Destino", value: viaje.destino },
  { label: "Cliente", value: viaje.cliente },
  { label: "Estado", value: viaje.estado },
  { label: "ETA estimada", value: viaje.etaEstimada },
  { label: "Referencia", value: LONG_TOKEN },
  { label: "Observaciones", value: "" },
];

const mobileStory: Story = {
  args: { items: fichaViaje, columns: 4, orientation: "horizontal" },
  render: (args) => (
    <main>
      <DescriptionList {...args} />
    </main>
  ),
};

/** Móvil: una columna; cada par se apila (nombre sobre valor) y los valores largos se parten. */
export const Mobile: Story = responsiveStory("mobile", mobileStory);

const tabletStory: Story = {
  args: { items: fichaViaje, columns: 4, orientation: "horizontal" },
  render: (args) => (
    <main>
      <DescriptionList {...args} />
    </main>
  ),
};

/** Tablet: la misma ficha con dos columnas como máximo. */
export const Tablet: Story = responsiveStory("tablet", tabletStory);