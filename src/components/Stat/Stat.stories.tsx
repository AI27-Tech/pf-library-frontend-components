import type { Meta, StoryObj } from "@storybook/react-vite";
import { Clock, Truck } from "lucide-react";
import { Stat } from "./Stat";
import { Grid } from "../Layout";

const meta = {
  title: "Components/Stat",
  component: Stat,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Solo valor. */
export const Basic: Story = {
  args: { label: "Viajes activos", value: "24" },
};

/** Con icono y texto de apoyo. */
export const WithIconAndHelp: Story = {
  args: {
    label: "Unidades en ruta",
    value: "18",
    icon: <Truck />,
    helpText: "De 22 unidades asignadas",
  },
};

/** Tendencia al alza: en verde. */
export const TrendUp: Story = {
  args: {
    label: "Viajes cerrados",
    value: "312",
    trend: { direction: "up", value: "+12 %" },
  },
};

/** Tendencia a la baja: en rojo. */
export const TrendDown: Story = {
  args: {
    label: "Viajes cerrados",
    value: "280",
    trend: { direction: "down", value: "-6 %" },
  },
};

/** Sin cambio: en color atenuado. */
export const TrendFlat: Story = {
  args: {
    label: "Incidencias",
    value: "0",
    trend: { direction: "flat", value: "Sin cambio" },
  },
};

/** Con `invertTrend`, subir se ve en rojo: por ejemplo, un tiempo de respuesta. */
export const InvertedTrend: Story = {
  args: {
    label: "Tiempo de respuesta",
    value: "14 min",
    icon: <Clock />,
    trend: { direction: "up", value: "+3 min" },
    invertTrend: true,
    helpText: "Promedio de la semana",
  },
};

/** Estado de carga con esqueletos. */
export const Loading: Story = {
  args: { label: "Viajes activos", value: "", loading: true },
};

/** Varias métricas en una rejilla. */
export const Group: Story = {
  args: { label: "Viajes activos", value: "24" },
  render: () => (
    <Grid minItemWidth="12rem" gap={3} style={{ maxWidth: 720 }}>
      <Stat label="Viajes activos" value="24" trend={{ direction: "up", value: "+3" }} />
      <Stat label="Unidades" value="18" trend={{ direction: "flat", value: "0" }} />
      <Stat label="Incidencias" value="2" trend={{ direction: "down", value: "-1" }} invertTrend />
    </Grid>
  ),
};
