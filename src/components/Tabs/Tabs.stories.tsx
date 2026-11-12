import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Map as MapIcon, Truck, Users } from "lucide-react";
import { Tab, TabList, TabPanel, Tabs } from "./Tabs";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** No controlado: `defaultValue` fija la pestaña inicial. */
export const Uncontrolled: Story = {
  render: () => (
    <Tabs defaultValue="resumen" style={{ maxWidth: 560 }}>
      <TabList aria-label="Secciones">
        <Tab value="resumen">Resumen</Tab>
        <Tab value="unidades">Unidades</Tab>
        <Tab value="ruta">Ruta</Tab>
      </TabList>
      <TabPanel value="resumen">Contenido del resumen.</TabPanel>
      <TabPanel value="unidades">Contenido de las unidades.</TabPanel>
      <TabPanel value="ruta">Contenido de la ruta.</TabPanel>
    </Tabs>
  ),
};

/** Controlado: el estado vive en el consumidor. */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("unidades");
    return (
      <Tabs value={value} onChange={setValue} style={{ maxWidth: 560 }}>
        <TabList aria-label="Secciones">
          <Tab value="resumen">Resumen</Tab>
          <Tab value="unidades">Unidades</Tab>
        </TabList>
        <TabPanel value="resumen">Resumen. Activa: {value}</TabPanel>
        <TabPanel value="unidades">Unidades. Activa: {value}</TabPanel>
      </Tabs>
    );
  },
};

/** Iconos e insignias en las pestañas. */
export const WithIconsAndBadges: Story = {
  render: () => (
    <Tabs defaultValue="unidades" style={{ maxWidth: 560 }}>
      <TabList aria-label="Secciones">
        <Tab value="unidades" icon={<Truck />} badge={4}>Unidades</Tab>
        <Tab value="custodios" icon={<Users />} badge={12}>Custodios</Tab>
        <Tab value="mapa" icon={<MapIcon />}>Mapa</Tab>
      </TabList>
      <TabPanel value="unidades">Cuatro unidades asignadas.</TabPanel>
      <TabPanel value="custodios">Doce custodios disponibles.</TabPanel>
      <TabPanel value="mapa">Vista de mapa.</TabPanel>
    </Tabs>
  ),
};

/** Pestaña deshabilitada: no recibe foco y se omite con las flechas. */
export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="resumen" style={{ maxWidth: 560 }}>
      <TabList aria-label="Secciones">
        <Tab value="resumen">Resumen</Tab>
        <Tab value="historial" disabled>Historial</Tab>
        <Tab value="notas">Notas</Tab>
      </TabList>
      <TabPanel value="resumen">Usa las flechas: se salta Historial.</TabPanel>
      <TabPanel value="notas">Notas del viaje.</TabPanel>
    </Tabs>
  ),
};

/** Muchas pestañas: la lista se desplaza en horizontal. */
export const Overflow: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Tabs defaultValue="p1">
        <TabList aria-label="Secciones">
          {Array.from({ length: 8 }, (_, i) => (
            <Tab key={i} value={`p${i + 1}`}>Pestaña {i + 1}</Tab>
          ))}
        </TabList>
        {Array.from({ length: 8 }, (_, i) => (
          <TabPanel key={i} value={`p${i + 1}`}>Contenido {i + 1}</TabPanel>
        ))}
      </Tabs>
    </div>
  ),
};
