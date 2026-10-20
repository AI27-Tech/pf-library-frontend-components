import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Headphones } from "lucide-react";
import { ImageGrid } from "./ImageGrid";
import type { FilterDefinition, FilterValues } from "../FilterBar";
import { ImageCard } from "../ImageCard";
import { Badge } from "../Badge";
import styles from "./ImageGrid.module.css";

const meta = {
  title: "Components/ImageGrid",
  component: ImageGrid,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    items: [],
    renderItem: () => null,
  },
} satisfies Meta<typeof ImageGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

type ForensicEvidence = {
  id: string;
  name: string;
  image: string;
  unit: string;
  category: string;
  status: string;
  timestamp: string;
  resolution: string;
  type: "image" | "audio";
};

const mockEvidence: ForensicEvidence[] = [
  {
    id: "1",
    name: "PERRO_SP921.RAV",
    image: "https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=400&h=225&fit=crop",
    unit: "YZ-490-LK",
    category: "RAW",
    status: "SELLADO",
    timestamp: "08:19",
    resolution: "1.9 MB",
    type: "audio",
  },
  {
    id: "2",
    name: "PLACA_FED.RAV",
    image: "https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=400&h=225&fit=crop",
    unit: "YZ-490-LK",
    category: "RAW",
    status: "SELLADO",
    timestamp: "08:21",
    resolution: "3.8 MB",
    type: "image",
  },
  {
    id: "3",
    name: "CAM_FRONTAL.JPG",
    image: "https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=400&h=225&fit=crop",
    unit: "AB-192-XX",
    category: "JPG",
    status: "DISPONIBLE",
    timestamp: "08:24",
    resolution: "2.7 MB",
    type: "image",
  },
  {
    id: "4",
    name: "SELLO_POST.RAV",
    image: "https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=400&h=225&fit=crop",
    unit: "AB-192-XX",
    category: "RAW",
    status: "COMPROMETIDO",
    timestamp: "08:32",
    resolution: "1.5 MB",
    type: "audio",
  },
  {
    id: "5",
    name: "REANIMO_RUTA_GPS.PNG",
    image: "https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=400&h=225&fit=crop",
    unit: "AB-192-XX",
    category: "PNG",
    status: "DISPONIBLE",
    timestamp: "09:40",
    resolution: "4.6 MB",
    type: "image",
  },
  {
    id: "6",
    name: "CAM_FRONTAL_KMGS.JPG",
    image: "https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=400&h=225&fit=crop",
    unit: "YZ-490-LK",
    category: "JPG",
    status: "SELLADO",
    timestamp: "09:15",
    resolution: "5.5 MB",
    type: "image",
  },
  {
    id: "7",
    name: "PUNTO_CONTROL_CHK.JPG",
    image: "https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=400&h=225&fit=crop",
    unit: "CD-123-YY",
    category: "JPG",
    status: "DISPONIBLE",
    timestamp: "13:28",
    resolution: "3.2 MB",
    type: "image",
  },
  {
    id: "8",
    name: "GUYA_SEALOZ.RAV",
    image: "https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=400&h=225&fit=crop",
    unit: "CD-123-YY",
    category: "RAV",
    status: "SELLADO",
    timestamp: "11:58",
    resolution: "6.9 MB",
    type: "audio",
  },
  {
    id: "9",
    name: "MANIFIESTO_DOC.PDF",
    image: "https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=400&h=225&fit=crop",
    unit: "AB-192-XX",
    category: "PDF",
    status: "DISPONIBLE",
    timestamp: "10:04",
    resolution: "1.2 MB",
    type: "image",
  },
  {
    id: "10",
    name: "CAM_LATERAL_IGD.RAV",
    image: "https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=400&h=225&fit=crop",
    unit: "YZ-490-LK",
    category: "RAW",
    status: "SELLADO",
    timestamp: "08:45",
    resolution: "3.9 MB",
    type: "image",
  },
  {
    id: "11",
    name: "GPS_CONSOLA.PNG",
    image: "https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=400&h=225&fit=crop",
    unit: "CD-123-YY",
    category: "PNG",
    status: "DISPONIBLE",
    timestamp: "12:40",
    resolution: "4.0 MB",
    type: "image",
  },
  {
    id: "12",
    name: "SENSOR_IR.RAV",
    image: "https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=400&h=225&fit=crop",
    unit: "AB-192-XX",
    category: "RAW",
    status: "COMPROMETIDO",
    timestamp: "09:28",
    resolution: "2.7 MB",
    type: "audio",
  },
];

const filters: FilterDefinition[] = [
  {
    key: "unit",
    label: "PLACA [UNIDAD]",
    placeholder: "All units",
    options: [
      { label: "YZ-490-LK", value: "YZ-490-LK" },
      { label: "AB-192-XX", value: "AB-192-XX" },
      { label: "CD-123-YY", value: "CD-123-YY" },
    ],
  },
  {
    key: "category",
    label: "TIPO [EVIDENCIA]",
    placeholder: "All types",
    options: [
      { label: "RAW", value: "RAW" },
      { label: "JPG", value: "JPG" },
      { label: "PNG", value: "PNG" },
      { label: "PDF", value: "PDF" },
    ],
  },
  {
    key: "status",
    label: "ESTADO [STATUS]",
    placeholder: "All statuses",
    options: [
      { label: "SELLADO", value: "SELLADO" },
      { label: "DISPONIBLE", value: "DISPONIBLE" },
      { label: "COMPROMETIDO", value: "COMPROMETIDO" },
    ],
  },
];

export const Basic: Story = {
  args: {},
  render: () => (
    <div style={{ padding: "2rem" }}>
      <ImageGrid<ForensicEvidence>
        items={mockEvidence}
        columns={4}
        renderItem={(item) => (
          <ImageCard
            key={item.id}
            src={item.type === "audio" ? "" : item.image}
            alt={item.name}
            title={item.timestamp}
            subtitle={item.name}
            footer={<small>{item.resolution}</small>}
            badges={[
              { label: item.status, position: "left", variant: "neutral" },
              { label: item.category, position: "right" },
            ]}
          >
            {item.type === "audio" && (
              <Headphones size={48} strokeWidth={1.5} color="rgba(255,255,255,0.5)" aria-hidden="true" />
            )}
          </ImageCard>
        )}
        showCount={true}
      />
    </div>
  ),
};

export const WithFilters: Story = {
  args: {},
  render: () => {
    const [filterValues, setFilterValues] = useState<FilterValues>({});

    return (
      <div style={{ padding: "2rem" }}>
        <ImageGrid<ForensicEvidence>
          items={mockEvidence}
          filters={filters}
          filterValues={filterValues}
          onFilterChange={(key, value) => {
            setFilterValues((prev: FilterValues) => ({ ...prev, [key]: value }));
          }}
          onClear={() => setFilterValues({})}
          columns={4}
          renderItem={(item) => (
            <ImageCard
              key={item.id}
              src={item.type === "audio" ? "" : item.image}
              alt={item.name}
              title={item.timestamp}
              subtitle={item.name}
              footer={<small>{item.resolution}</small>}
              badges={[
                {
                  label: item.status,
                  position: "left",
                  variant: item.status === "SELLADO" ? "secure" : item.status === "COMPROMETIDO" ? "alert" : "neutral",
                },
                { label: item.category, position: "right" },
              ]}
            >
              {item.type === "audio" && (
                <Headphones size={48} strokeWidth={1.5} color="rgba(255,255,255,0.5)" aria-hidden="true" />
              )}
            </ImageCard>
          )}
          matchesFilters={(item, filters) => {
            const unitMatch = !filters.unit || item.unit === filters.unit;
            const categoryMatch = !filters.category || item.category === filters.category;
            const statusMatch = !filters.status || item.status === filters.status;

            return unitMatch && categoryMatch && statusMatch;
          }}
          showCount={true}
          emptyMessage="No hay evidencias que coincidan con los filtros"
        />
      </div>
    );
  },
};

export const WithFiltersAndPagination: Story = {
  args: {},
  render: () => {
    const [filterValues, setFilterValues] = useState<FilterValues>({});

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Grid Con Filtros + Paginación</h2>
        <p style={{ marginBottom: "1rem", color: "#666", fontSize: "0.9rem" }}>
          Filtra por categoría, estado o unidad. La paginación muestra 8 items por página y se reinicia al cambiar filtros.
        </p>
        <ImageGrid<ForensicEvidence>
          items={mockEvidence}
          filters={filters}
          filterValues={filterValues}
          onFilterChange={(key, value) => {
            setFilterValues((prev: FilterValues) => ({ ...prev, [key]: value }));
          }}
          onClear={() => setFilterValues({})}
          columns={4}
          enablePagination={true}
          itemsPerPage={8}
          renderItem={(item) => (
            <ImageCard
              key={item.id}
              src={item.type === "audio" ? "" : item.image}
              alt={item.name}
              title={item.timestamp}
              subtitle={item.name}
              footer={<small>{item.resolution}</small>}
              badges={[
                {
                  label: item.status,
                  position: "left",
                  variant: item.status === "SELLADO" ? "secure" : item.status === "COMPROMETIDO" ? "alert" : "neutral",
                },
                { label: item.category, position: "right" },
              ]}
            >
              {item.type === "audio" && (
                <Headphones size={48} strokeWidth={1.5} color="rgba(255,255,255,0.5)" aria-hidden="true" />
              )}
            </ImageCard>
          )}
          matchesFilters={(item, filters) => {
            const unitMatch = !filters.unit || item.unit === filters.unit;
            const categoryMatch = !filters.category || item.category === filters.category;
            const statusMatch = !filters.status || item.status === filters.status;

            return unitMatch && categoryMatch && statusMatch;
          }}
          showCount={true}
          emptyMessage="No hay evidencias que coincidan con los filtros"
        />
      </div>
    );
  },
};

export const WithViewToggleAndPagination: Story = {
  args: {},
  render: () => {
    const [filterValues, setFilterValues] = useState<FilterValues>({});
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const handleViewModeChange = (mode: "grid" | "list") => {
      setViewMode(mode);
    };

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Grid Con Filtros + View Toggle + Paginación</h2>
        <p style={{ marginBottom: "1rem", color: "#666", fontSize: "0.9rem" }}>
          Prueba todos los controles: filtra, cambia vista (grid/lista) y navega páginas. Vista lista = diseño horizontal; vista grid = 4 columnas.
        </p>
        <ImageGrid<ForensicEvidence>
          items={mockEvidence}
          filters={filters}
          filterValues={filterValues}
          onFilterChange={(key, value) => {
            setFilterValues((prev: FilterValues) => ({ ...prev, [key]: value }));
          }}
          onClear={() => setFilterValues({})}
          columns={4}
          enableViewToggle={true}
          enablePagination={true}
          itemsPerPage={viewMode === "grid" ? 8 : 10}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          renderItem={(item) => {
            if (viewMode === "list") {
              // Renderizado tabla limpia con clases CSS
              return (
                <>
                  {/* Col 1: Timestamp */}
                  <div className={styles.listItemTime}>{item.timestamp}</div>

                  {/* Col 2: Nombre */}
                  <div className={styles.listItemName}>{item.name}</div>

                  {/* Col 3: Unidad */}
                  <div className={styles.listItemUnit}>{item.unit}</div>

                  {/* Col 4: Categoría */}
                  <div className={styles.listItemCategory}>{item.category}</div>

                  {/* Col 5: Tamaño */}
                  <div className={styles.listItemSize}>{item.resolution}</div>

                  {/* Col 6: Badge usando componente Badge */}
                  <div className={styles.listItemBadge}>
                    <Badge
                      variant={
                        item.status === "SELLADO"
                          ? "secure"
                          : item.status === "COMPROMETIDO"
                            ? "alert"
                            : "neutral"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                </>
              );
            }

            // Renderizado original para grid
            return (
              <ImageCard
                key={item.id}
                src={item.type === "audio" ? "" : item.image}
                alt={item.name}
                title={item.timestamp}
                subtitle={item.name}
                footer={<small>{item.resolution}</small>}
                badges={[
                  {
                    label: item.status,
                    position: "left",
                    variant: item.status === "SELLADO" ? "secure" : item.status === "COMPROMETIDO" ? "alert" : "neutral",
                  },
                  { label: item.category, position: "right" },
                ]}
              >
                {item.type === "audio" && (
                  <Headphones size={48} strokeWidth={1.5} color="rgba(255,255,255,0.5)" aria-hidden="true" />
                )}
              </ImageCard>
            );
          }}
          matchesFilters={(item, filters) => {
            const unitMatch = !filters.unit || item.unit === filters.unit;
            const categoryMatch = !filters.category || item.category === filters.category;
            const statusMatch = !filters.status || item.status === filters.status;

            return unitMatch && categoryMatch && statusMatch;
          }}
          showCount={true}
          emptyMessage="No hay evidencias que coincidan con los filtros"
        />
      </div>
    );
  },
};

export const NoFilters: Story = {
  args: {},
  render: () => (
    <div style={{ padding: "2rem" }}>
      <ImageGrid<ForensicEvidence>
        items={mockEvidence}
        columns={4}
        renderItem={(item) => (
          <ImageCard
            key={item.id}
            src={item.type === "audio" ? "" : item.image}
            alt={item.name}
            title={item.timestamp}
            subtitle={item.name}
            footer={<small>{item.resolution}</small>}
            badges={[
              { label: item.status, position: "left", variant: "neutral" },
              { label: item.category, position: "right" },
            ]}
          >
            {item.type === "audio" && (
              <Headphones size={48} strokeWidth={1.5} color="rgba(255,255,255,0.5)" aria-hidden="true" />
            )}
          </ImageCard>
        )}
        showCount={true}
      />
    </div>
  ),
};

export const EmptyState: Story = {
  args: {},
  render: () => (
    <div style={{ padding: "2rem" }}>
      <ImageGrid<ForensicEvidence>
        items={[]}
        filters={filters}
        columns={4}
        renderItem={(item) => (
          <ImageCard
            key={item.id}
            src={item.image}
            alt={item.name}
            title={item.timestamp}
            subtitle={item.name}
          />
        )}
        emptyMessage="No hay evidencias registradas"
        showCount={true}
      />
    </div>
  ),
};
