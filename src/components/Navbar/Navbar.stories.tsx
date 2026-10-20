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

function LogoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l9 5v10l-9 5-9-5V7z" />
      <path d="M12 12l9-5M12 12v10M12 12L3 7" />
    </svg>
  );
}

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
            <LogoIcon />
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
