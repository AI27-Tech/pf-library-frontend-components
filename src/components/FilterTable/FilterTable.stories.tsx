import { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilterTable, type FilterValues } from "./FilterTable";
import type { Column, SortState } from "../Table";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

const allUsers: User[] = [
  { id: 1, name: "Ada Lovelace", email: "ada@example.com", role: "admin", active: true },
  { id: 2, name: "Alan Turing", email: "alan@example.com", role: "editor", active: true },
  { id: 3, name: "Grace Hopper", email: "grace@example.com", role: "editor", active: false },
  { id: 4, name: "Linus Torvalds", email: "linus@example.com", role: "viewer", active: true },
  { id: 5, name: "Margaret Hamilton", email: "margaret@example.com", role: "admin", active: false },
];

const roleLabels: Record<string, string> = {
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
};

const columns: Column<User>[] = [
  { key: "name", header: "Name", accessor: "name", sortable: true },
  { key: "email", header: "Email", accessor: "email" },
  { key: "role", header: "Role", cell: (u) => roleLabels[u.role], sortable: true },
  {
    key: "active",
    header: "Status",
    align: "center",
    cell: (u) => (
      <span style={{ color: u.active ? "var(--ui-color-success)" : "var(--ui-color-text-muted)" }}>
        {u.active ? "Active" : "Inactive"}
      </span>
    ),
  },
];

const meta: Meta<typeof FilterTable<User>> = {
  title: "Components/FilterTable",
  component: FilterTable,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof FilterTable<User>>;

export const Interactive: Story = {
  render: () => {
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState<FilterValues>({ role: "", status: "" });
    const [sort, setSort] = useState<SortState | null>(null);

    const data = useMemo(() => {
      let rows = allUsers;
      if (search.trim()) {
        const q = search.toLowerCase();
        rows = rows.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q),
        );
      }
      if (filters.role) rows = rows.filter((u) => u.role === filters.role);
      if (filters.status)
        rows = rows.filter((u) =>
          filters.status === "active" ? u.active : !u.active,
        );
      if (sort) {
        const key = sort.key as keyof User;
        rows = [...rows].sort((a, b) => {
          const av = a[key];
          const bv = b[key];
          const cmp = av < bv ? -1 : av > bv ? 1 : 0;
          return sort.direction === "asc" ? cmp : -cmp;
        });
      }
      return rows;
    }, [search, filters, sort]);

    const isActive = Boolean(search || filters.role || filters.status);

    return (
      <div>
        <div style={{ marginBottom: "2rem", background: "#1e1e2e", padding: "1.5rem", borderRadius: "8px" }}>
          <h3 style={{ marginTop: 0, color: "#e2e8f0" }}>📋 COPY ESTE CÓDIGO PARA USAR EN TU PROYECTO:</h3>
          <pre style={{ background: "#0f0f1e", color: "#7c9df0", padding: "1rem", borderRadius: "6px", fontSize: "0.85rem", overflow: "auto" }}>{`import { FilterTable, type FilterValues } from '@ai27-tech/ui';
import { useState, useMemo } from 'react';

export function MyUserTable() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<FilterValues>({ role: '' });
  
  // Tu array de datos
  const allUsers = [
    { id: 1, name: 'Juan', email: 'juan@example.com', role: 'admin' },
    { id: 2, name: 'María', email: 'maria@example.com', role: 'editor' },
  ];

  const columns = [
    { key: 'name', header: 'Nombre', accessor: 'name', sortable: true },
    { key: 'email', header: 'Email', accessor: 'email' },
    { key: 'role', header: 'Rol', accessor: 'role' },
  ];

  // Aplicar filtros y búsqueda
  const filteredData = useMemo(() => {
    let rows = allUsers;
    
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(u => 
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    }
    
    if (filters.role) {
      rows = rows.filter(u => u.role === filters.role);
    }
    
    return rows;
  }, [search, filters]);

  return (
    <FilterTable
      columns={columns}
      data={filteredData}
      rowKey={(user) => user.id}
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder="Buscar por nombre o email..."
      filters={[
        {
          key: 'role',
          label: 'ROL',
          placeholder: 'Todos',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
          ],
        },
      ]}
      filterValues={filters}
      onFilterChange={(key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
      }}
      onClear={() => {
        setSearch('');
        setFilters({ role: '' });
      }}
    />
  );
}`}</pre>
        </div>

        <FilterTable
          columns={columns}
          data={data}
          rowKey={(u) => u.id}
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by name or email..."
          filters={[
            {
              key: "role",
              label: "ROLE",
              placeholder: "All roles",
              options: [
                { label: "Admin", value: "admin" },
                { label: "Editor", value: "editor" },
                { label: "Viewer", value: "viewer" },
              ],
            },
            {
              key: "status",
              label: "STATUS",
              placeholder: "All statuses",
              options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ],
            },
          ]}
          filterValues={filters}
          onFilterChange={(key, value) =>
            setFilters((prev: FilterValues) => ({ ...prev, [key]: value }))
          }
          onClear={
            isActive
              ? () => {
                  setSearch("");
                  setFilters({ role: "", status: "" });
                }
              : undefined
          }
          sort={sort}
          onSortChange={setSort}
          emptyState="No users match your filters."
        />
      </div>
    );
  },
};
