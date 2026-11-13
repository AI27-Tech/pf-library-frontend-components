import type { Meta, StoryObj } from "@storybook/react-vite";
import { Truck } from "lucide-react";
import { Timeline } from "./Timeline";
import type { TimelineItemData } from "./types";

const meta = {
  title: "Components/Timeline",
  component: Timeline,
  tags: ["autodocs"],
  args: { items: [] },
  decorators: [
    (Historia) => (
      <div style={{ maxWidth: 720, padding: "1rem" }}>
        <Historia />
      </div>
    ),
  ],
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Genera `n` puntos con estados repartidos: completados, uno actual y el resto pendientes. */
function generar(n: number): TimelineItemData[] {
  return Array.from({ length: n }, (_, i) => {
    const status = i < n / 2 ? "completed" : i === Math.floor(n / 2) ? "current" : "upcoming";
    return { id: `paso-${i + 1}`, title: `Paso ${i + 1}`, timestamp: `Nov ${(i % 28) + 1}`, status };
  });
}

const historial: TimelineItemData[] = [
  { id: "SOLICITADO", title: "Solicitado", timestamp: "10 nov, 08:12", dateTime: "2026-11-10T08:12:00Z", status: "completed" },
  { id: "APROBADO", title: "Aprobado", timestamp: "10 nov, 09:03", dateTime: "2026-11-10T09:03:00Z", status: "completed" },
  { id: "ASIGNADO", title: "Asignado", timestamp: "10 nov, 09:20", status: "completed" },
  { id: "EN_TRANSITO", title: "En recorrido", description: "Parada 2 de 3", status: "current" },
  { id: "EN_DESTINO", title: "Arribo a destino", status: "upcoming" },
  { id: "CERRADO", title: "Cerrado", status: "upcoming" },
];

/** Vertical con los estados del historial. */
export const Vertical: Story = { args: { items: historial } };

/** Horizontal: los puntos se reparten el ancho. */
export const Horizontal: Story = { args: { items: historial, orientation: "horizontal" } };

/** Vertical alternada: el contenido va a los dos lados en contenedores anchos. */
export const Alternada: Story = { args: { items: historial, align: "alternate" } };

/** Horizontal alternada: el contenido va arriba y abajo de la línea. */
export const HorizontalAlternada: Story = {
  args: { items: historial, orientation: "horizontal", align: "alternate" },
};

export const Un1Punto: Story = { args: { items: generar(1) } };
export const Tres: Story = { args: { items: generar(3) } };
export const Doce: Story = { args: { items: generar(12), orientation: "horizontal" } };
export const Cien: Story = { args: { items: generar(100), orientation: "horizontal" } };

/** Con `maxVisible`, el resto se muestra con "Mostrar más". */
export const MaxVisible: Story = { args: { items: generar(12), maxVisible: 4 } };

/** `reverse` muestra el más reciente primero, sin tocar los datos. */
export const Reverse: Story = { args: { items: historial, reverse: true } };

/** Horizontal que se vuelve vertical por debajo de 560 px de contenedor. */
export const StackBelow: Story = {
  args: { items: historial, orientation: "horizontal", stackBelow: 560 },
};

export const Cargando: Story = { args: { items: [], loading: true } };
export const Vacio: Story = { args: { items: [] } };

export const Tamanos: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "2rem" }}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size}>
          <strong>{size}</strong>
          <Timeline size={size} items={historial.slice(0, 3)} />
        </div>
      ))}
    </div>
  ),
};

export const Estados: Story = {
  args: {
    items: [
      { id: "1", title: "Completado", status: "completed" },
      { id: "2", title: "En curso", status: "current" },
      { id: "3", title: "Pendiente", status: "upcoming" },
      { id: "4", title: "Error al asignar", status: "error" },
      { id: "5", title: "Aviso de parada", status: "warning" },
    ],
  },
};

/** Icono propio en lugar del icono por defecto del estado. */
export const IconosPropios: Story = {
  args: {
    items: [
      { id: "1", title: "En camino", status: "completed", icon: <Truck aria-hidden="true" /> },
      { id: "2", title: "Descargando", status: "current", icon: <Truck aria-hidden="true" /> },
    ],
  },
};

/** Ancho angosto: el contenido se ajusta sin desbordar. */
export const Angosta: Story = {
  decorators: [
    (Historia) => (
      <div style={{ width: 300 }}>
        <Historia />
      </div>
    ),
  ],
  args: { items: historial },
};

/** Puntos clicables con hover y foco visibles. */
export const ConClic: Story = {
  args: {
    items: historial,
    onItemClick: (item, index) => alert(`${item.title} (${index})`),
  },
};

/**
 * Historial de estados del viaje con los nombres de negocio de `viaje.estados.yaml`
 * (contrato `v0.1.0-tracer.40`). Los pasos no van en orden de aparición real: es una muestra.
 */
export const HistorialDelViaje: Story = {
  args: {
    orientation: "horizontal",
    stackBelow: 560,
    items: [
      { id: "SOLICITADO", title: "Solicitado", timestamp: "10 nov, 08:12", status: "completed" },
      { id: "APROBADO", title: "Aprobado", timestamp: "10 nov, 09:03", status: "completed" },
      { id: "ASIGNADO", title: "Asignado", timestamp: "10 nov, 09:20", status: "completed" },
      { id: "PATRULLA_EN_CAMINO", title: "Patrulla en camino", status: "completed" },
      { id: "EN_TRANSITO", title: "En recorrido", description: "Parada 2 de 3", status: "current" },
      { id: "EN_DESTINO", title: "Arribo a destino", status: "upcoming" },
      { id: "EN_DESCARGA", title: "En descarga", status: "upcoming" },
      { id: "CERRADO", title: "Cerrado", status: "upcoming" },
    ],
  },
};
