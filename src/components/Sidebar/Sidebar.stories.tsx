import { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { House, Package, Settings, Users } from "lucide-react";
import { Sidebar, SidebarGroup, SidebarItem } from "./Sidebar";

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
