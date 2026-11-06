import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sidebar, SidebarGroup, SidebarItem } from "./Sidebar";

const meta = {
  title: "Components/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

function Icon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

const icons = {
  home: "M3 11l9-8 9 8M5 10v10h14V10",
  orders: "M6 2l1 4h10l1-4M4 6h16l-1 14H5z",
  customers: "M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M12 7a4 4 0 100 0M23 21v-2a4 4 0 00-3-3.87",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 008 19.4",
};

export const Interactive: Story = {
  render: () => {
    const [active, setActive] = useState("home");
    const [collapsed, setCollapsed] = useState(false);

    const item = (id: string, label: string, icon: string, badge?: number) => (
      <SidebarItem
        icon={<Icon path={icon} />}
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
          header={collapsed ? <Icon path={icons.home} /> : <span>Acme Admin</span>}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((v) => !v)}
        >
          <SidebarGroup label="Main">
            {item("home", "Dashboard", icons.home)}
            {item("orders", "Orders", icons.orders, 12)}
            {item("customers", "Customers", icons.customers)}
          </SidebarGroup>
          <SidebarGroup label="System">
            {item("settings", "Settings", icons.settings)}
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
        <SidebarItem as="a" href="#intro" active icon={<Icon path={icons.home} />}>
          Introduction
        </SidebarItem>
        <SidebarItem as="a" href="#install" icon={<Icon path={icons.orders} />}>
          Installation
        </SidebarItem>
      </Sidebar>
    </div>
  ),
};
