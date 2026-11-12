import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Popover, type PopoverProps } from "./Popover";
import { Modal } from "../Modal";
import { Button } from "../Button";
import { Input } from "../Input";

const meta = {
  title: "Components/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Popover>;

export default meta;

interface PopoverDemoProps
  extends Partial<Omit<PopoverProps, "anchorRef" | "open" | "onClose">> {
  /** Texto del botón que actúa como ancla. */
  anchorLabel?: string;
  /** Estira el botón ancla al ancho de su contenedor. */
  anchorFullWidth?: boolean;
  /** Estilos del contenedor del ancla (posición de prueba). */
  anchorStyle?: CSSProperties;
  children?: ReactNode;
}

// Las stories usan `render` con el demo: sus props son opcionales, por eso se tipan con él.
type Story = StoryObj<PopoverDemoProps>;

/**
 * Ancla con `Button` de la librería y popover controlado. Cierra con clic fuera o Escape.
 *
 * El ancla es un `span` que envuelve al botón: `Button` no reenvía `ref`, y el popover
 * mide el elemento contenedor, que tiene el mismo tamaño que el botón.
 */
function PopoverDemo({
  anchorLabel = "Abrir popover",
  anchorFullWidth = false,
  anchorStyle,
  children,
  ...popoverProps
}: PopoverDemoProps) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <div style={anchorStyle}>
      <span
        ref={anchorRef}
        style={{ display: anchorFullWidth ? "flex" : "inline-flex" }}
      >
        <Button
          variant="secondary"
          fullWidth={anchorFullWidth}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {anchorLabel}
        </Button>
      </span>
      <Popover
        {...popoverProps}
        anchorRef={anchorRef}
        open={open}
        onClose={() => setOpen(false)}
      >
        {children ?? (
          <div style={{ display: "grid", gap: "var(--ui-space-2)", minWidth: 220 }}>
            <p style={{ margin: 0 }}>Contenido del popover.</p>
            <Input size="sm" placeholder="Escribe aquí" aria-label="Campo de prueba" />
            <Button variant="outline" size="sm">
              Acción
            </Button>
          </div>
        )}
      </Popover>
    </div>
  );
}

/** Popover abajo del ancla: posición por defecto con espacio suficiente. */
export const Abajo: Story = {
  render: () => (
    <div style={{ padding: "6rem 2rem" }}>
      <PopoverDemo position="bottom" />
    </div>
  ),
};

/** Popover arriba del ancla. */
export const Arriba: Story = {
  render: () => (
    <div style={{ padding: "12rem 2rem 2rem" }}>
      <PopoverDemo position="top" />
    </div>
  ),
};

/**
 * `position="auto"` con poco espacio debajo del ancla: el ancla está pegada al borde
 * inferior del viewport, así que el popover se abre arriba.
 */
export const AutomaticoConPocoEspacio: Story = {
  render: () => (
    <PopoverDemo
      position="auto"
      anchorStyle={{ position: "fixed", bottom: 8, left: 16 }}
    />
  ),
};

/** `matchAnchorWidth`: el popover iguala el ancho del ancla. */
export const AnchoDelAncla: Story = {
  render: () => (
    <div style={{ padding: "6rem 2rem", width: 320 }}>
      <PopoverDemo
        anchorLabel="Ancla de 320 px de ancho"
        matchAnchorWidth
        anchorFullWidth
      />
    </div>
  ),
};

/** `align="end"`: el borde derecho del popover queda alineado con el ancla. */
export const AlineadoAlFinal: Story = {
  render: () => (
    <div style={{ padding: "6rem 2rem", display: "flex", justifyContent: "flex-end" }}>
      <PopoverDemo position="bottom" align="end" />
    </div>
  ),
};

/**
 * Dentro de un contenedor con `overflow: hidden` y altura limitada. El popover no se
 * recorta, porque se renderiza en `document.body`.
 */
export const ContenedorConOverflowOculto: Story = {
  render: () => (
    <div
      style={{
        overflow: "hidden",
        height: 120,
        width: 360,
        margin: "2rem",
        padding: "1rem",
        border: "1px solid var(--ui-color-border)",
        borderRadius: "var(--ui-radius-lg)",
      }}
    >
      <PopoverDemo position="bottom" />
    </div>
  ),
};

function ModalDemo() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div style={{ padding: "2rem" }}>
      <Button onClick={() => setModalOpen(true)}>Abrir modal</Button>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Modal con popover"
        footer={<Button onClick={() => setModalOpen(false)}>Cerrar</Button>}
      >
        <p style={{ marginTop: 0 }}>El popover se abre desde el botón de abajo.</p>
        <PopoverDemo position="bottom" anchorLabel="Abrir popover en modal" />
      </Modal>
    </div>
  );
}

/**
 * Popover dentro de un `Modal`. Verificar: `Escape` cierra solo el popover y no el
 * modal; el clic dentro del popover no cierra el modal; `Tab` dentro del popover
 * puede salir del DOM del diálogo sin que el focus trap lo retenga.
 */
export const DentroDeModal: Story = {
  render: () => <ModalDemo />,
};
