import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toast, ToastContainer, type ToastVariant, type ToastPosition } from "./Toast";
import { Button } from "../Button";

const meta = {
  title: "Components/Toast",
  component: Toast,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    variant: "info",
    title: "Checkpoint verificado",
    children: "La unidad TTR-8821 pasó el punto de control Arco Norte.",
    dismissible: true,
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["info", "success", "warning", "error"],
    },
    duration: { control: "number" },
    onClose: { control: false },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A single toast, rendered inline for preview. */
export const Single: Story = {
  render: (args) => (
    <div style={{ width: 360 }}>
      <Toast {...args} onClose={() => {}} />
    </div>
  ),
};

/** All severities side by side. */
export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: 360 }}>
      <Toast variant="info" title="En ruta" onClose={() => {}}>
        Unidad avanzando por el corredor Bajío.
      </Toast>
      <Toast variant="success" title="Custodia activa" onClose={() => {}}>
        Escolta enlazada correctamente.
      </Toast>
      <Toast variant="warning" title="Demora en ruta" onClose={() => {}}>
        Tiempo de permanencia por encima del umbral.
      </Toast>
      <Toast variant="error" title="Jamming detectado" onClose={() => {}}>
        Pérdida de señal GPS en el sector 7.
      </Toast>
    </div>
  ),
};

interface ToastItem {
  id: number;
  variant: ToastVariant;
  title: string;
  message: string;
}

let nextId = 1;

/** The real usage: a fixed bottom-right stack driven by your own state. */
export const FixedBottomRight: Story = {
  render: () => {
    const [position, setPosition] = useState<ToastPosition>("bottom-right");
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const push = (variant: ToastVariant, title: string, message: string) => {
      setToasts((prev) => [...prev, { id: nextId++, variant, title, message }]);
    };
    const remove = (id: number) =>
      setToasts((prev) => prev.filter((t) => t.id !== id));

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Button size="sm" onClick={() => push("info", "En ruta", "Unidad TTR-8821 en movimiento.")}>
            Info
          </Button>
          <Button size="sm" variant="secondary" onClick={() => push("success", "Custodia activa", "Escolta enlazada.")}>
            Success
          </Button>
          <Button size="sm" variant="outline" onClick={() => push("warning", "Demora", "Permanencia excedida.")}>
            Warning
          </Button>
          <Button size="sm" variant="danger" onClick={() => push("error", "Jamming detectado", "Pérdida de señal GPS.")}>
            Error
          </Button>
        </div>

        <label style={{ fontSize: "0.8125rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
          Posición:
          <select value={position} onChange={(e) => setPosition(e.target.value as ToastPosition)}>
            <option value="bottom-right">bottom-right</option>
            <option value="bottom-left">bottom-left</option>
            <option value="top-right">top-right</option>
            <option value="top-left">top-left</option>
            <option value="top-center">top-center</option>
            <option value="bottom-center">bottom-center</option>
          </select>
        </label>

        <ToastContainer position={position}>
          {toasts.map((t) => (
            <Toast
              key={t.id}
              variant={t.variant}
              title={t.title}
              duration={5000}
              onClose={() => remove(t.id)}
            >
              {t.message}
            </Toast>
          ))}
        </ToastContainer>
      </div>
    );
  },
};

/** With an inline dispatch CTA, per the AI27 corridor alerts pattern. */
export const WithActions: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <Toast
        variant="error"
        title="Desvío de ruta"
        onClose={() => {}}
        actions={
          <>
            <Button size="sm" variant="danger">Contactar C4</Button>
            <Button size="sm" variant="ghost">Desviar a corredor seguro</Button>
          </>
        }
      >
        La unidad abandonó el corredor autorizado.
      </Toast>
    </div>
  ),
};
