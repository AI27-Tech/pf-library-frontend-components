import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus } from "lucide-react";
import { Section } from "./Section";
import { Button } from "../Button";
import { responsiveStory } from "../../stories/responsiveStory";
import { LONG_TOKEN } from "../../stories/responsiveFixtures";

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

const mobileStory: Story = {
  render: () => (
    <main>
      <Section
        title="Unidades asignadas al viaje"
        description="Lista de unidades con su patrulla y custodio."
        divider
        actions={<Button size="sm" startIcon={<Plus />}>Agregar</Button>}
      >
        <p style={{ margin: 0, overflowWrap: "anywhere" }}>{LONG_TOKEN}</p>
        <p style={{ margin: 0 }}>
          Texto largo de bitácora que debe envolverse dentro del ancho disponible sin empujar la
          página hacia un lado.
        </p>
      </Section>
      <Section title="Historial de estados" collapsible defaultCollapsed={false}>
        <p style={{ margin: 0 }}>Contenido que se pliega y se despliega desde el encabezado.</p>
      </Section>
    </main>
  ),
};

/** Móvil: el relleno lateral de pantalla se ve, las acciones se mantienen dentro y el texto largo se parte. */
export const Mobile: Story = responsiveStory("mobile", mobileStory);