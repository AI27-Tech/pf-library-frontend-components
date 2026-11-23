import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell } from "lucide-react";
import { Alert } from "./Alert";
import { Button } from "../Button";
import { responsiveStory } from "../../stories/responsiveStory";
import { Stack } from "../Layout";

const meta = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Información: `role="status"`. */
export const Info: Story = {
  args: { variant: "info", title: "Cambios pendientes", children: "El viaje se actualizará en el siguiente ciclo." },
};

/** Éxito: `role="status"`. */
export const Success: Story = {
  args: { variant: "success", title: "Viaje guardado", children: "Los cambios ya están visibles para el cliente." },
};

/** Advertencia: `role="alert"`. */
export const Warning: Story = {
  args: { variant: "warning", title: "Sin señal", children: "La unidad no reporta posición desde hace 12 minutos." },
};

/** Peligro: `role="alert"`. */
export const Danger: Story = {
  args: { variant: "danger", title: "Error al asignar", children: "La unidad ya tiene un viaje activo." },
};

/** Todas las variantes juntas, para comparar contraste en tema claro y oscuro. */
export const AllVariants: Story = {
  render: () => (
    <Stack gap={3} style={{ maxWidth: 560 }}>
      <Alert variant="info" title="Información">Mensaje informativo.</Alert>
      <Alert variant="success" title="Éxito">Acción completada.</Alert>
      <Alert variant="warning" title="Advertencia">Revisar antes de continuar.</Alert>
      <Alert variant="danger" title="Peligro">Acción no permitida.</Alert>
    </Stack>
  ),
};

/** Con botón de cierre. */
export const Dismissible: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);
    return (
      <Stack gap={3} style={{ maxWidth: 560 }}>
        {visible ? (
          <Alert variant="info" title="Mantenimiento programado" onDismiss={() => setVisible(false)}>
            El sistema estará en pausa el sábado a las 02:00.
          </Alert>
        ) : (
          <button type="button" onClick={() => setVisible(true)}>Mostrar de nuevo</button>
        )}
      </Stack>
    );
  },
};

/** Icono propio en lugar del de la variante. */
export const CustomIcon: Story = {
  args: { variant: "info", icon: <Bell />, title: "Notificación", children: "Tienes un mensaje nuevo." },
};

/** Movil: tres alertas con mensaje largo, dos acciones y boton de cerrar. */
const mobileStory: Story = {
  args: { children: null },
  render: () => (
    <main>
      <Stack gap={3}>
        <Alert variant="info" title="Cambios pendientes" onDismiss={() => {}}>
          El viaje VJ-2026-000481 se actualizara en el siguiente ciclo de monitoreo, cuando la unidad reporte su posicion.
          <Stack gap={2} style={{ marginTop: 8 }}>
            <Button variant="primary">Ver viaje</Button>
            <Button variant="secondary">Ver bitacora</Button>
          </Stack>
        </Alert>
        <Alert variant="warning" title="Sin senal" onDismiss={() => {}}>
          La unidad no reporta posicion desde hace 12 minutos. El custodio debe confirmar por radio el estado de la carga.
        </Alert>
        <Alert variant="danger" title="Error al asignar" onDismiss={() => {}}>
          La unidad ya tiene un viaje activo y no puede recibir una nueva asignacion hasta cerrar el anterior.
          <Stack gap={2} style={{ marginTop: 8 }}>
            <Button variant="danger">Reasignar</Button>
            <Button variant="secondary">Cancelar</Button>
          </Stack>
        </Alert>
      </Stack>
    </main>
  ),
};
export const Mobile: Story = responsiveStory("mobile", mobileStory);
