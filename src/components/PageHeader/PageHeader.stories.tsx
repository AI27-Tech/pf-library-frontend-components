import type { Meta, StoryObj } from "@storybook/react-vite";
import { Download, Plus, Truck, Users } from "lucide-react";
import { PageHeader } from "./PageHeader";
import { Breadcrumb } from "../Breadcrumb";
import { Button } from "../Button";
import { Tab, TabList, TabPanel, Tabs } from "../Tabs";
import { Section } from "../Section";
import { DescriptionList } from "../DescriptionList";
import { Stat } from "../Stat";
import { Alert } from "../Alert";
import { Grid, Stack } from "../Layout";
import { responsiveStory } from "../../stories/responsiveStory";
import { LONG_TOKEN } from "../../stories/responsiveFixtures";

const meta = {
  title: "Components/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const breadcrumb = (
  <Breadcrumb
    items={[
      { label: "Inicio", href: "#inicio" },
      { label: "Viajes", href: "#viajes" },
      { label: "Viaje 2045" },
    ]}
  />
);

/** Solo título y descripción. */
export const Basic: Story = {
  args: {
    title: "Viajes",
    description: "Seguimiento de los viajes activos y cerrados.",
  },
};

/** Con ruta de navegación y acciones a la derecha. */
export const WithBreadcrumbAndActions: Story = {
  args: {
    title: "Viaje 2045",
    description: "Origen Monterrey, destino Querétaro.",
    breadcrumb,
    actions: (
      <>
        <Button variant="outline" startIcon={<Download />}>Exportar</Button>
        <Button startIcon={<Plus />}>Nuevo viaje</Button>
      </>
    ),
  },
};

/** Zona inferior con pestañas, como en la pantalla de detalle. */
export const WithTabs: Story = {
  args: {
    title: "Viaje 2045",
    breadcrumb,
    children: (
      <Tabs defaultValue="resumen">
        <TabList aria-label="Secciones del viaje">
          <Tab value="resumen">Resumen</Tab>
          <Tab value="unidades" badge={2}>Unidades</Tab>
          <Tab value="historial" disabled>Historial</Tab>
        </TabList>
        <TabPanel value="resumen">Contenido del resumen.</TabPanel>
        <TabPanel value="unidades">Unidades asignadas al viaje.</TabPanel>
      </Tabs>
    ),
  },
};

/** En pantallas angostas, las acciones pasan debajo del título. */
export const Narrow: Story = {
  args: {
    title: "Viaje 2045",
    description: "Las acciones pasan debajo del título en pantallas angostas.",
    actions: <Button startIcon={<Plus />}>Nuevo</Button>,
  },
  render: (args) => (
    <div style={{ width: 360 }}>
      <PageHeader {...args} />
    </div>
  ),
};

/**
 * Pantalla de ejemplo: muestra cómo reemplaza `PageHeader` el patrón de `Card` + `Button`
 * con `Tabs`, `Section`, `DescriptionList`, `Stat` y `Alert`.
 */
export const ExampleScreen: Story = {
  args: { title: "Viaje 2045" },
  render: () => (
    <Stack gap={5}>
      <PageHeader
        title="Viaje 2045"
        description="Monterrey a Querétaro. Seguimiento del servicio."
        breadcrumb={breadcrumb}
        actions={
          <>
            <Button variant="outline" startIcon={<Download />}>Exportar</Button>
            <Button startIcon={<Plus />}>Nueva incidencia</Button>
          </>
        }
      >
        <Tabs defaultValue="resumen">
          <TabList aria-label="Secciones del viaje">
            <Tab value="resumen">Resumen</Tab>
            <Tab value="unidades" badge={2}>Unidades</Tab>
          </TabList>
          <TabPanel value="resumen">
            <Stack gap={5}>
              <Alert variant="warning" title="Sin señal desde hace 12 minutos">
                La unidad no reporta posición. Revisar con el monitorista.
              </Alert>
              <Grid minItemWidth="12rem" gap={3}>
                <Stat label="Hitos cumplidos" value="4 de 6" icon={<Truck />} />
                <Stat
                  label="ETA"
                  value="18:40"
                  trend={{ direction: "down", value: "-15 min" }}
                  invertTrend
                  helpText="Frente a la estimación inicial"
                />
                <Stat label="Custodios" value="3" icon={<Users />} trend={{ direction: "flat", value: "0" }} />
              </Grid>
              <Section title="Datos del servicio" description="Información capturada por la operación." collapsible divider>
                <DescriptionList
                  columns={2}
                  items={[
                    { label: "Cliente", value: "Acme Logística" },
                    { label: "Tipo de monitoreo", value: "Patrulla y custodio" },
                    { label: "Operador", value: "" },
                    { label: "Tracto", value: "TR-204" },
                  ]}
                />
              </Section>
            </Stack>
          </TabPanel>
          <TabPanel value="unidades">Unidades asignadas al viaje.</TabPanel>
        </Tabs>
      </PageHeader>
    </Stack>
  ),
};

const rutaLarga = (
  <Breadcrumb
    maxItems={3}
    items={[
      { label: "Inicio", href: "#inicio" },
      { label: "Operación de viajes en curso", href: "#operacion" },
      { label: "Bitácora de cruces fronterizos", href: "#bitacora" },
      { label: "Unidades con incidencias abiertas", href: "#unidades" },
      { label: "Tracto con remolque de tres ejes", href: "#tracto" },
      { label: "Viaje 2045" },
    ]}
  />
);

const encabezadoResponsive = {
  breadcrumb: rutaLarga,
  title: LONG_TOKEN,
  description: "Resumen del viaje, con su estado y las acciones disponibles.",
  actions: (
    <>
      <Button startIcon={<Plus />}>Nuevo</Button>
      <Button variant="secondary" startIcon={<Download />}>Exportar</Button>
      <Button variant="outline">Cerrar</Button>
    </>
  ),
};

const mobileStory: Story = {
  args: encabezadoResponsive,
  render: (args) => (
    <main>
      <div style={{ padding: "var(--ui-space-4)", background: "var(--ui-color-surface)", borderRadius: "var(--ui-radius)" }}>
        <PageHeader {...args} />
      </div>
    </main>
  ),
};

/** Móvil: la ruta se pliega, el título largo se parte y las acciones quedan debajo del título. */
export const Mobile: Story = responsiveStory("mobile", mobileStory);

const tabletStory: Story = {
  args: encabezadoResponsive,
  render: (args) => (
    <main>
      <div style={{ padding: "var(--ui-space-4)", background: "var(--ui-color-surface)", borderRadius: "var(--ui-radius)" }}>
        <PageHeader {...args} />
      </div>
    </main>
  ),
};

/** Tablet: el mismo encabezado en 768 px. Las acciones quedan junto al título. */
export const Tablet: Story = responsiveStory("tablet", tabletStory);