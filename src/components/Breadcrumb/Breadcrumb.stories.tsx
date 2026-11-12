import type { AnchorHTMLAttributes, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Folder, House, Package, Truck } from "lucide-react";
import { Breadcrumb, type BreadcrumbItemData } from "./Breadcrumb";

const meta = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicItems: BreadcrumbItemData[] = [
  { label: "Inicio", href: "#inicio" },
  { label: "Viajes", href: "#viajes" },
  { label: "Viaje 2045" },
];

/** Ruta básica: los elementos anteriores son enlaces y el último es la página actual. */
export const Basic: Story = {
  args: { items: basicItems },
};

/** Cada elemento con su icono antes de la etiqueta. */
export const WithIcons: Story = {
  args: {
    items: [
      { label: "Inicio", href: "#inicio", icon: <House /> },
      { label: "Viajes", href: "#viajes", icon: <Truck /> },
      { label: "Viaje 2045", icon: <Package /> },
    ],
  },
};

/** Elementos con `onClick` en lugar de `href`: se renderizan como botón. */
export const WithClickHandlers: Story = {
  args: {
    items: [
      { label: "Inicio", onClick: () => alert("Ir a inicio") },
      { label: "Clientes", onClick: () => alert("Ir a clientes") },
      { label: "Cliente Acme" },
    ],
  },
};

/** Componente tipo `Link` de un router. Simula la navegación sin cambiar de página. */
function FakeRouterLink({
  href,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { children?: ReactNode }) {
  return (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault();
        alert(`Navegación interna a ${href}`);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

/** Enlaces con el componente `as` (por ejemplo, el `Link` del router). */
export const WithRouterLink: Story = {
  args: {
    items: [
      { label: "Inicio", href: "/inicio", as: FakeRouterLink, icon: <House /> },
      { label: "Carpetas", href: "/carpetas", as: FakeRouterLink, icon: <Folder /> },
      { label: "Documentos" },
    ],
  },
};

/** Con `maxItems`, los intermedios se pliegan tras un botón "…" que abre un popover. */
export const Collapsed: Story = {
  args: {
    maxItems: 3,
    items: [
      { label: "Inicio", href: "#inicio" },
      { label: "Clientes", href: "#clientes" },
      { label: "Cliente Acme", href: "#cliente" },
      { label: "Viajes", href: "#viajes" },
      { label: "Viaje 2045", href: "#viaje" },
      { label: "Bitácora" },
    ],
  },
};

/** Etiquetas largas: se truncan con puntos suspensivos y muestran el texto completo en `title`. */
export const LongLabels: Story = {
  args: {
    items: [
      { label: "Operaciones de transporte de carga interurbana" },
      { label: "Seguimiento de viajes con custodia y patrulla escolta en ruta nacional" },
      { label: "Bitácora del viaje con incidencias registradas durante el trayecto" },
    ],
  },
  render: (args) => (
    <div style={{ width: 360 }}>
      <Breadcrumb {...args} />
    </div>
  ),
};

/** Separador personalizado en lugar del chevron por defecto. */
export const CustomSeparator: Story = {
  args: {
    separator: "/",
    items: basicItems,
  },
};
