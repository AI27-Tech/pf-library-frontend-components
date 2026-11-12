import type { Meta, StoryObj } from "@storybook/react-vite";
import { ConversationStatus } from "./ConversationStatus";

const meta = {
  title: "Components/MessagePanel/ConversationStatus",
  component: ConversationStatus,
  tags: ["autodocs"],
  args: { estado: "abierta" },
} satisfies Meta<typeof ConversationStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Conversación abierta, sin responsable y con escritura hasta una fecha. */
export const Abierta: Story = {
  args: { estado: "abierta", reclamadaPor: undefined, escrituraHasta: "2026-11-12T18:00:00Z" },
};

/** Solo lectura: el campo del compositor queda deshabilitado. */
export const SoloLectura: Story = {
  args: { estado: "solo_lectura", reclamadaPor: "Ana Ruiz" },
};

/** Cerrada. */
export const Cerrada: Story = {
  args: { estado: "cerrada", reclamadaPor: null },
};

/** El reclamo activo es del visor actual. */
export const ReclamoPropio: Story = {
  args: { estado: "abierta", reclamoPropio: true, reclamadaPor: "Yo" },
};

/** El reclamo activo lo tiene otra persona. */
export const ReclamoAjeno: Story = {
  args: { estado: "abierta", reclamadaPor: "Luis Ortega" },
};

/** Sin reclamo: la conversación está en el pool. */
export const EnElPool: Story = {
  args: { estado: "abierta", reclamadaPor: null },
};

/** Marcada como atendida por el responsable. */
export const Atendida: Story = {
  args: { estado: "abierta", reclamadaPor: "Ana Ruiz", atendida: true },
};

/**
 * Vista del cliente: sin datos de reclamo, la fila solo muestra el estado.
 * `reclamadaPor` queda sin valor, así que no aparece responsable ni pool.
 */
export const VistaDelCliente: Story = {
  args: { estado: "abierta" },
};
