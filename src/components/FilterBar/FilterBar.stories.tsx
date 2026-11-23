import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilterBar, type FilterDefinition, type FilterValues } from "./FilterBar";
import { responsiveStory } from "../../stories/responsiveStory";

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

const filtrosViaje: FilterDefinition[] = [
  {
    key: "cliente",
    label: "Cliente",
    placeholder: "Todos los clientes",
    options: [
      { label: "Transportes del Norte", value: "norte" },
      { label: "Acme Logística", value: "acme" },
    ],
  },
  {
    key: "estado",
    label: "Estado",
    placeholder: "Todos los estados",
    options: [
      { label: "En ruta", value: "ruta" },
      { label: "Detenido", value: "detenido" },
    ],
  },
  {
    key: "origen",
    label: "Origen",
    placeholder: "Todos los orígenes",
    options: [{ label: "Monterrey, N. L.", value: "mty" }],
  },
  {
    key: "destino",
    label: "Destino",
    placeholder: "Todos los destinos",
    options: [{ label: "Querétaro, Qro.", value: "qro" }],
  },
  {
    key: "fecha",
    label: "Fecha",
    placeholder: "Todas las fechas",
    options: [
      { label: "Hoy", value: "hoy" },
      { label: "Esta semana", value: "semana" },
    ],
  },
  {
    key: "unidad",
    label: "Unidad",
    placeholder: "Todas las unidades",
    options: [{ label: "ABC-123-A", value: "abc" }],
  },
];

/** Barra de filtros con estado propio: la story no guarda valores, así que aquí se controlan. */
function FiltrosViaje({ colapsable }: { colapsable: boolean }) {
  const [valores, setValores] = useState<FilterValues>({});
  const [busqueda, setBusqueda] = useState("");
  return (
    <main>
      <FilterBar
        filters={filtrosViaje}
        filterValues={valores}
        onFilterChange={(clave, valor) => setValores((previo) => ({ ...previo, [clave]: valor }))}
        onClear={() => setValores({})}
        searchValue={busqueda}
        onSearchChange={setBusqueda}
        collapsibleOnMobile={colapsable}
      />
    </main>
  );
}

const movilStory: Story = {
  render: () => <FiltrosViaje colapsable={false} />,
};

/** Móvil: seis filtros en una columna, cada control al 100 %, siempre visibles. */
export const Mobile: Story = responsiveStory("mobile", movilStory);

const movilColapsableStory: Story = {
  render: () => <FiltrosViaje colapsable={true} />,
};

/** Móvil con `collapsibleOnMobile`: los filtros arrancan ocultos y el botón de 44 px los muestra. */
export const MobileColapsable: Story = responsiveStory("mobile", movilColapsableStory);

const tabletStory: Story = {
  render: () => <FiltrosViaje colapsable={false} />,
};

/** Tablet: la barra en 768 px, con los filtros siempre visibles. */
export const Tablet: Story = responsiveStory("tablet", tabletStory);