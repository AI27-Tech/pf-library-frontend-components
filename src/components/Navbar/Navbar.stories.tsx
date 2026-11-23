import { Box } from "lucide-react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Navbar, NavbarLink } from "./Navbar";
import { Button } from "../Button";
import { responsiveStory } from "../../stories/responsiveStory";

const meta = {
  title: "Components/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => {
    const [current, setCurrent] = useState("dashboard");
    const link = (id: string, label: string) => (
      <NavbarLink
        href="#"
        active={current === id}
        onClick={(e) => {
          e.preventDefault();
          setCurrent(id);
        }}
      >
        {label}
      </NavbarLink>
    );
    return (
      <Navbar
        brand={
          <>
            <Box />
            Acme
          </>
        }
        links={
          <>
            {link("dashboard", "Dashboard")}
            {link("orders", "Orders")}
            {link("customers", "Customers")}
            {link("settings", "Settings")}
          </>
        }
        actions={
          <>
            <Button variant="ghost" size="sm">Sign in</Button>
            <Button size="sm">Get started</Button>
          </>
        }
      />
    );
  },
};

export const Sticky: Story = {
  render: () => (
    <div style={{ height: 200 }}>
      <Navbar
        sticky
        brand={<>Acme</>}
        links={
          <>
            <NavbarLink href="#" active>Home</NavbarLink>
            <NavbarLink href="#">Products</NavbarLink>
            <NavbarLink href="#">Pricing</NavbarLink>
          </>
        }
        actions={<Button size="sm">Contact</Button>}
      />
      <div style={{ padding: "1rem" }}>Scroll content…</div>
    </div>
  ),
};

const enlacesDeDominio = ["Viajes", "Bitácora", "Unidades", "Custodios", "Clientes", "Reportes"];

const barraResponsive = (
  <Navbar
    brand={
      <>
        <Box />
        Transportes del Norte, S. A. de C. V.
      </>
    }
    links={
      <>
        {enlacesDeDominio.map((etiqueta, indice) => (
          <NavbarLink key={etiqueta} href="#" active={indice === 0}>
            {etiqueta}
          </NavbarLink>
        ))}
      </>
    }
    actions={<Button size="sm">Salir</Button>}
  />
);

const mobileStory: Story = {
  render: () => barraResponsive,
};

/** Móvil: solo marca y botón de menú; al abrirlo, los enlaces caben en el ancho. */
export const Mobile: Story = responsiveStory("mobile", mobileStory);

const tabletStory: Story = {
  render: () => barraResponsive,
};

/** Tablet: la misma barra en 768 px. Los enlaces se ven en línea. */
export const Tablet: Story = responsiveStory("tablet", tabletStory);