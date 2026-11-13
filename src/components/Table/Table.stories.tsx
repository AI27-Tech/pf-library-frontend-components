import { useMemo, useState } from "react";
import type { Key } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table, type Column, type SortState } from "./Table";
import { Badge } from "../Badge";
import { Button } from "../Button";
import { Pagination } from "../Pagination";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

const users: User[] = [
  { id: 1, name: "Ada Lovelace", email: "ada@example.com", role: "Administrador", active: true },
  { id: 2, name: "Alan Turing", email: "alan@example.com", role: "Editor", active: true },
  { id: 3, name: "Grace Hopper", email: "grace@example.com", role: "Editor", active: false },
  { id: 4, name: "Linus Torvalds", email: "linus@example.com", role: "Visualizador", active: true },
];

const columns: Column<User>[] = [
  { key: "name", header: "Nombre", accessor: "name", sortable: true },
  { key: "email", header: "Correo", accessor: "email" },
  { key: "role", header: "Rol", accessor: "role", sortable: true },
  {
    key: "active",
    header: "Estado",
    align: "center",
    cell: (u) => (
      <span style={{ color: u.active ? "var(--ui-color-success)" : "var(--ui-color-text-muted)" }}>
        {u.active ? "Activo" : "Inactivo"}
      </span>
    ),
  },
];

const meta: Meta<typeof Table<User>> = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Table<User>>;

export const Basic: Story = {
  args: {
    columns,
    data: users,
    rowKey: (u) => u.id,
    "aria-label": "Usuarios",
  },
};

export const Compact: Story = {
  args: {
    columns,
    data: users,
    rowKey: (u) => u.id,
    density: "compact",
  },
};

/** Sin filas: muestra el `EmptyState` por defecto con el texto de `labels.empty`. */
export const Empty: Story = {
  args: {
    columns,
    data: [],
  },
};

/** Vacío con un `emptyState` propio, que reemplaza al por defecto. */
export const EmptyPersonalizado: Story = {
  args: {
    columns,
    data: [],
    emptyState: "No hay usuarios que coincidan con la búsqueda.",
  },
};

export const Loading: Story = {
  args: {
    columns,
    data: [],
    loading: true,
    loadingRows: 4,
    "aria-label": "Cargando usuarios",
  },
};

/** Carga con columna de selección y de expansión: las filas en skeleton conservan ambas columnas. */
export const LoadingConSeleccionYExpansion: Story = {
  args: {
    columns,
    data: [],
    loading: true,
    loadingRows: 4,
    selectedKeys: new Set<Key>(),
    onSelectionChange: () => {},
    expandedContent: () => null,
    "aria-label": "Cargando usuarios",
  },
};

export const LoadingCompacta: Story = {
  args: {
    columns,
    data: [],
    loading: true,
    density: "compact",
    "aria-label": "Cargando usuarios",
  },
};

/** Sin rayas alternas, para listas donde las rayas distraen. */
export const SinRayas: Story = {
  args: {
    columns,
    data: users,
    rowKey: (u) => u.id,
    striped: false,
  },
};

/** Encabezado fijo dentro de un contenedor con altura máxima. Desplázate para ver la fijación y la sombra. */
export const EncabezadoFijo: Story = {
  render: () => {
    const muchos: User[] = Array.from({ length: 40 }, (_, i) => ({
      id: i + 1,
      name: `Operador ${i + 1}`,
      email: `op${i + 1}@example.com`,
      role: ["Administrador", "Editor", "Visualizador"][i % 3],
      active: i % 4 !== 0,
    }));
    // El contenedor limita la altura; la tabla hace el scroll vertical dentro de él.
    return (
      <div style={{ maxHeight: "320px", overflowY: "auto" }}>
        <Table
          columns={columns}
          data={muchos}
          rowKey={(u) => u.id}
          stickyHeader
          density="compact"
          aria-label="Operadores"
        />
      </div>
    );
  },
};

/** Columnas con `minWidth` y `truncate`: el texto largo se corta con puntos suspensivos. */
export const MinWidthYTruncado: Story = {
  render: () => {
    const cols: Column<User>[] = [
      { key: "name", header: "Nombre", accessor: "name", minWidth: "10rem", truncate: true },
      {
        key: "email",
        header: "Correo",
        accessor: "email",
        truncate: true,
        minWidth: "12rem",
      },
      { key: "role", header: "Rol", accessor: "role" },
    ];
    const largos: User[] = users.map((u) => ({
      ...u,
      name: `${u.name}, con un nombre muy largo para ver el corte del texto`,
      email: `${u.email.replace("@", ".operacion.larga@")}`,
    }));
    return (
      <div style={{ maxWidth: "32rem" }}>
        <Table columns={cols} data={largos} rowKey={(u) => u.id} density="compact" />
      </div>
    );
  },
};

export const Sortable: Story = {
  render: () => {
    const [sort, setSort] = useState<SortState | null>({ key: "name", direction: "asc" });
    const sorted = useMemo(() => {
      if (!sort) return users;
      const key = sort.key as keyof User;
      return [...users].sort((a, b) => {
        const av = a[key];
        const bv = b[key];
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return sort.direction === "asc" ? cmp : -cmp;
      });
    }, [sort]);

    return (
      <Table
        columns={columns}
        data={sorted}
        rowKey={(u) => u.id}
        sort={sort}
        onSortChange={setSort}
      />
    );
  },
};

export const Selectable: Story = {
  render: () => {
    const [selected, setSelected] = useState<Set<Key>>(new Set([1]));
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ fontSize: "0.875rem", color: "var(--ui-color-text-muted)" }}>
          {selected.size} seleccionadas
        </div>
        <Table
          columns={columns}
          data={users}
          rowKey={(u) => u.id}
          selectedKeys={selected}
          onSelectionChange={setSelected}
        />
      </div>
    );
  },
};

/** Con filas seleccionadas aparece la barra de acciones masivas encima de la tabla. */
export const AccionesMasivas: Story = {
  render: () => {
    const [selected, setSelected] = useState<Set<Key>>(new Set([1, 3]));
    return (
      <Table
        columns={columns}
        data={users}
        rowKey={(u) => u.id}
        selectedKeys={selected}
        onSelectionChange={setSelected}
        bulkActions={(keys) => (
          <>
            <Button size="sm" variant="outline" onClick={() => alert(`Exportar ${keys.size}`)}>
              Exportar
            </Button>
            <Button size="sm" variant="danger" onClick={() => setSelected(new Set())}>
              Desactivar
            </Button>
          </>
        )}
      />
    );
  },
};

/** Textos de la interfaz sobrescritos con `labels`. */
export const EtiquetasPersonalizadas: Story = {
  args: {
    columns,
    data: users,
    rowKey: (u) => u.id,
    selectedKeys: new Set<Key>(),
    onSelectionChange: () => {},
    labels: {
      selectAll: "Marcar todos los usuarios",
      selectRow: "Marcar usuario",
      empty: "Aún no hay usuarios registrados.",
    },
  },
};

export const ClickableRows: Story = {
  args: {
    columns,
    data: users,
    rowKey: (u) => u.id,
    onRowClick: (u) => alert(`Clic en ${u.name}`),
  },
};

/** Estado mostrado como Badge dentro de una celda. */
export const WithBadges: Story = {
  render: () => {
    const cols: Column<User>[] = [
      {
        key: "name",
        header: "Unidad",
        // Celda compuesta: nombre en la parte superior, id debajo en texto desaturado.
        cell: (u) => (
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.3 }}>
            <span style={{ fontWeight: 600 }}>{u.name}</span>
            <span style={{ fontSize: "0.6875rem", color: "var(--ui-color-text-muted)" }}>
              TTR-{String(8800 + u.id)}
            </span>
          </div>
        ),
        sortable: true,
      },
      { key: "role", header: "Rol", accessor: "role" },
      {
        key: "status",
        header: "Estado",
        align: "center",
        cell: (u) =>
          u.active ? (
            <Badge variant="secure" dot>En ruta</Badge>
          ) : (
            <Badge variant="neutral">Detenido</Badge>
          ),
      },
    ];
    return <Table columns={cols} data={users} rowKey={(u) => u.id} density="compact" />;
  },
};

/** Filas expandibles que revelan un panel de detalle. */
export const Expandable: Story = {
  render: () => {
    const [expanded, setExpanded] = useState<Set<Key>>(new Set([1]));
    return (
      <Table
        columns={columns}
        data={users}
        rowKey={(u) => u.id}
        expandedKeys={expanded}
        onExpandedChange={setExpanded}
        expandedContent={(u) => (
          <div style={{ display: "flex", gap: "2rem", fontSize: "0.8125rem" }}>
            <div>
              <div style={{ color: "var(--ui-color-text-muted)", fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Correo
              </div>
              {u.email}
            </div>
            <div>
              <div style={{ color: "var(--ui-color-text-muted)", fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Rol
              </div>
              {u.role}
            </div>
            <div>
              <div style={{ color: "var(--ui-color-text-muted)", fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Estado
              </div>
              {u.active ? "Activo" : "Inactivo"}
            </div>
          </div>
        )}
      />
    );
  },
};

/** Paginación estilo servidor conduciendo la ventana de datos de la tabla. */
export const WithPagination: Story = {
  render: () => {
    // Simular un dataset más grande.
    const allRows: User[] = Array.from({ length: 137 }, (_, i) => ({
      id: i + 1,
      name: `Operador ${i + 1}`,
      email: `op${i + 1}@example.com`,
      role: ["Administrador", "Editor", "Visualizador"][i % 3],
      active: i % 4 !== 0,
    }));

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const pageRows = useMemo(() => {
      const start = (page - 1) * pageSize;
      return allRows.slice(start, start + pageSize);
    }, [page, pageSize, allRows]);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <Table columns={columns} data={pageRows} rowKey={(u) => u.id} density="compact" />
        <Pagination
          page={page}
          pageSize={pageSize}
          total={allRows.length}
          onPageChange={setPage}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPage(1);
          }}
        />
      </div>
    );
  },
};
