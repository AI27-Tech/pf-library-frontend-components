import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus } from "lucide-react";
import { Section } from "./Section";
import { Button } from "../Button";

const meta = {
  title: "Components/Section",
  component: Section,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

const contenido = <p style={{ margin: 0 }}>Contenido de la sección.</p>;

/** Sección con título y descripción. */
export const Basic: Story = {
  args: {
    title: "Datos generales",
    description: "Información del servicio.",
    children: contenido,
  },
};

/** Línea divisoria bajo el encabezado y acciones a la derecha. */
export const WithActionsAndDivider: Story = {
  args: {
    title: "Unidades",
    divider: true,
    actions: <Button size="sm" startIcon={<Plus />}>Agregar</Button>,
    children: contenido,
  },
};

/** Plegable sin control externo: el estado inicial es desplegado. */
export const CollapsibleUncontrolled: Story = {
  args: {
    title: "Historial",
    collapsible: true,
    defaultCollapsed: false,
    children: contenido,
  },
};

/** Plegable controlado: el estado lo guarda el consumidor. */
export const CollapsibleControlled: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(true);
    return (
      <Section
        title="Controlada"
        description={collapsed ? "Contraída" : "Desplegada"}
        collapsible
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
      >
        {contenido}
      </Section>
    );
  },
};

/** Sin título: no hay encabezado ni etiqueta de región. */
export const WithoutTitle: Story = {
  args: { children: contenido },
};
