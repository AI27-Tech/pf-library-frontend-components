import { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { House, Package, Settings, Truck, Users } from "lucide-react";
import { Sidebar, SidebarGroup, SidebarItem, SidebarTrigger } from "./Sidebar";
import { responsiveStory } from "../../stories/responsiveStory";

const meta = {
  title: "Components/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: () => {
    const [active, setActive] = useState("home");
    const [collapsed, setCollapsed] = useState(false);

    const item = (id: string, label: string, icon: ReactNode, badge?: number) => (
      <SidebarItem
        icon={icon}
        active={active === id}
        badge={badge}
        label={label}
        onClick={() => setActive(id)}
      >
        {label}
      </SidebarItem>
    );

    return (
      <div style={{ height: 420, display: "flex" }}>
        <Sidebar
          header={<span>Acme Admin</span>}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((v) => !v)}
        >
          <SidebarGroup label="Main">
            {item("home", "Dashboard", <House />)}
            {item("orders", "Orders", <Package />, 12)}
            {item("customers", "Customers", <Users />)}
          </SidebarGroup>
          <SidebarGroup label="System">
            {item("settings", "Settings", <Settings />)}
          </SidebarGroup>
        </Sidebar>
        <div style={{ padding: "1rem", flex: 1 }}>
          Content area — active: <strong>{active}</strong>
        </div>
      </div>
    );
  },
};

export const AsLinks: Story = {
  render: () => (
    <div style={{ height: 300, display: "flex" }}>
      <Sidebar header={<span>Docs</span>}>
        <SidebarItem as="a" href="#intro" active icon={<House />}>
          Introduction
        </SidebarItem>
        <SidebarItem as="a" href="#install" icon={<Package />}>
          Installation
        </SidebarItem>
      </Sidebar>
    </div>
  ),
};

export const WithHeaderAndToggle: Story = {
  render: () => (
    <div style={{ height: 300, display: "flex" }}>
      <Sidebar
        header={<span>Acme Admin</span>}
        onToggleCollapse={() => {}}
      >
        <SidebarItem icon={<House />} active>
          Dashboard
        </SidebarItem>
      </Sidebar>
    </div>
  ),
};

export const ToggleWithoutHeader: Story = {
  render: () => (
    <div style={{ height: 300, display: "flex" }}>
      <Sidebar onToggleCollapse={() => {}}>
        <SidebarItem icon={<House />} active>
          Dashboard
        </SidebarItem>
        <SidebarItem icon={<Package />}>Orders</SidebarItem>
      </Sidebar>
    </div>
  ),
};

export const Collapsed: Story = {
  render: () => (
    <div style={{ height: 300, display: "flex" }}>
      <Sidebar
        header={<span>Acme Admin</span>}
        collapsed
        onToggleCollapse={() => {}}
      >
        <SidebarItem icon={<House />} active>
          Dashboard
        </SidebarItem>
        <SidebarItem icon={<Package />} badge={3}>
          Orders
        </SidebarItem>
      </Sidebar>
    </div>
  ),
};

/** Logo distinto según el estado: completo al expandir y solo icono al contraer. */
export const ConLogoAlContraer: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false);
    return (
      <div style={{ height: 420, display: "flex" }}>
        <Sidebar
          header={<strong>Acme Admin</strong>}
          headerCollapsed={<House aria-label="Acme" />}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((v) => !v)}
        >
          <SidebarItem icon={<House />} active label="Dashboard">
            Dashboard
          </SidebarItem>
          <SidebarItem icon={<Package />} badge={3} label="Orders">
            Orders
          </SidebarItem>
          <SidebarItem icon={<Users />} label="Customers">
            Customers
          </SidebarItem>
        </Sidebar>
        <div style={{ padding: "1rem", flex: 1 }}>Contenido. Usa el botón de la esquina inferior para contraer.</div>
      </div>
    );
  },
};

const elementosDeDominio = [
  { id: "viajes", label: "Viajes", icon: <Truck /> },
  { id: "bitacora", label: "Bitácora", icon: <House /> },
  { id: "unidades", label: "Unidades", icon: <Package /> },
  { id: "custodios", label: "Custodios", icon: <Users /> },
  { id: "operadores", label: "Operadores", icon: <Users /> },
  { id: "patrullas", label: "Patrullas", icon: <Package /> },
  { id: "clientes", label: "Clientes", icon: <House /> },
  { id: "incidencias", label: "Incidencias", icon: <Package /> },
  { id: "estadias", label: "Estadías", icon: <Package /> },
  { id: "reportes", label: "Reportes", icon: <Settings /> },
  { id: "configuracion", label: "Configuración", icon: <Settings /> },
];

/** Panel móvil controlado: el disparador abre la barra y la barra se cierra al elegir un elemento. */
function EjemploResponsive() {
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState("viajes");
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar mobileOpen={abierto} onMobileOpenChange={setAbierto}>
        <SidebarGroup label="Operación">
          {elementosDeDominio.slice(0, 6).map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activo === item.id}
              onClick={() => setActivo(item.id)}
            >
              {item.label}
            </SidebarItem>
          ))}
        </SidebarGroup>
        <SidebarGroup label="Catálogos">
          {elementosDeDominio.slice(6).map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activo === item.id}
              onClick={() => setActivo(item.id)}
            >
              {item.label}
            </SidebarItem>
          ))}
        </SidebarGroup>
      </Sidebar>
      <main style={{ flex: 1, minWidth: 0, padding: "var(--ui-space-4)" }}>
        <SidebarTrigger open={abierto} onClick={() => setAbierto(true)} />
        <p>Sección activa: {elementosDeDominio.find((item) => item.id === activo)?.label}</p>
      </main>
    </div>
  );
}

const mobileStory: Story = {
  render: () => <EjemploResponsive />,
};

/** Móvil: el panel está cerrado; el disparador de 44 px lo abre sobre un fondo. */
export const Mobile: Story = responsiveStory("mobile", mobileStory);

const tabletStory: Story = {
  render: () => <EjemploResponsive />,
};

/** Tablet: la barra va contraída a iconos. */
export const Tablet: Story = responsiveStory("tablet", tabletStory);