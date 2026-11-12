import { Box } from "lucide-react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Navbar, NavbarLink } from "./Navbar";
import { Button } from "../Button";

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
