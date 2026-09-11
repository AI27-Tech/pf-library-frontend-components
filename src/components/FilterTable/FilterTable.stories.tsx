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
            placeholder: "All roles",
            options: [
              { label: "Admin", value: "admin" },
              { label: "Editor", value: "editor" },
              { label: "Viewer", value: "viewer" },
            ],
          },
          {
            key: "status",
            placeholder: "All statuses",
            options: [
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ],
          },
        ]}
        filterValues={filters}
        onFilterChange={(key, value) =>
          setFilters((prev) => ({ ...prev, [key]: value }))
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
    );
  },
};
