import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilterBar, type FilterDefinition, type FilterValues } from "./FilterBar";

const filtros: FilterDefinition[] = [
  {
    key: "pais",
    label: "País",
    placeholder: "Todos los países",
    options: [
      { label: "México", value: "mx" },
      { label: "Argentina", value: "ar" },
      { label: "Colombia", value: "co" },
    ],
  },
  {
    key: "estado",
    label: "Estado",
    placeholder: "Todos los estados",
    options: [
      { label: "Activo", value: "active" },
      { label: "Inactivo", value: "inactive" },
    ],
  },
  {
    key: "tipo",
    label: "Tipo de viaje",
    placeholder: "Todos los tipos",
    options: [
      { label: "Carga completa", value: "completa" },
      { label: "Parcial", value: "parcial" },
    ],
  },
];

const meta = {
  title: "Components/FilterBar",
  component: FilterBar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { filters: filtros },
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Estado controlado: la story guarda los valores y la búsqueda para que la barra responda a los cambios. */
function Controlado({
  layout,
  valoresIniciales = {},
  busquedaInicial,
  loading = false,
  conBusqueda = true,
}: {
  layout: "panel" | "toolbar";
  valoresIniciales?: FilterValues;
  busquedaInicial?: string;
  loading?: boolean;
  conBusqueda?: boolean;
}) {
  const [valores, setValores] = useState<FilterValues>(valoresIniciales);
  const [busqueda, setBusqueda] = useState(busquedaInicial ?? "");
  return (
    <FilterBar
      layout={layout}
      filters={filtros}
      filterValues={valores}
      onFilterChange={(key, value) => setValores((prev) => ({ ...prev, [key]: value }))}
      onClear={() => {
        setValores({});
        setBusqueda("");
      }}
      searchValue={busqueda}
      onSearchChange={conBusqueda ? setBusqueda : undefined}
      loading={loading}
    />
  );
}

/** Disposición `panel`: todos los filtros visibles en una cuadrícula. Es la disposición por defecto. */
export const Panel: Story = {
  render: () => <Controlado layout="panel" />,
};

/** Disposición `toolbar`: búsqueda y botón "Filtros" que abre los filtros en un popover. */
export const Toolbar: Story = {
  render: () => <Controlado layout="toolbar" />,
};

export const PanelConFiltrosActivos: Story = {
  render: () => (
    <Controlado layout="panel" valoresIniciales={{ pais: "mx", estado: "active" }} busquedaInicial="Ada" />
  ),
};

/** Con filtros activos, el botón muestra el conteo: "Filtros (2)". Los chips se quitan con su botón. */
export const ToolbarConFiltrosActivos: Story = {
  render: () => (
    <Controlado layout="toolbar" valoresIniciales={{ pais: "mx", estado: "active" }} />
  ),
};

/** Sin búsqueda: solo se muestran los filtros. */
export const SinBusqueda: Story = {
  render: () => <Controlado layout="panel" conBusqueda={false} />,
};

/** Estado de carga: búsqueda, filtros y botón de filtros quedan deshabilitados. */
export const Cargando: Story = {
  render: () => <Controlado layout="toolbar" loading valoresIniciales={{ pais: "ar" }} />,
};

export const CargandoPanel: Story = {
  render: () => <Controlado layout="panel" loading />,
};

/** Filtro buscable: el campo permite escribir para filtrar las opciones. */
export const FiltroBuscable: Story = {
  render: () => {
    const [valores, setValores] = useState<FilterValues>({});
    return (
      <FilterBar
        layout="panel"
        filters={[
          {
            key: "pais",
            label: "País",
            variant: "searchable",
            searchPlaceholder: "Buscar país...",
            noResultsText: "Ningún país coincide",
            placeholder: "Todos los países",
            options: [
              { label: "México", value: "mx" },
              { label: "Argentina", value: "ar" },
              { label: "Colombia", value: "co" },
            ],
          },
        ]}
        filterValues={valores}
        onFilterChange={(key, value) => setValores((prev) => ({ ...prev, [key]: value }))}
      />
    );
  },
};

/** Selector de vista (cuadrícula y lista), con el modo de lista activo. */
export const ConSelectorDeVista: Story = {
  render: () => {
    const [modo, setModo] = useState<"grid" | "list">("list");
    return (
      <FilterBar
        layout="panel"
        filters={filtros}
        enableViewToggle
        viewMode={modo}
        onViewModeChange={setModo}
      />
    );
  },
};
