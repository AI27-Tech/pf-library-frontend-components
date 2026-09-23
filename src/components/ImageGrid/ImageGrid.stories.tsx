import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ImageGrid } from "./ImageGrid";
import type { FilterDefinition, FilterValues } from "../FilterBar";
import { ImageCard } from "../ImageCard";

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
            src={item.image}
            alt={item.name}
            title={item.timestamp}
            subtitle={item.name}
            footer={<small>{item.resolution}</small>}
            badges={[
              { label: item.status, position: "left", variant: "neutral" },
              { label: item.category, position: "right" },
            ]}
          />
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
              src={item.image}
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
            />
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
            src={item.image}
            alt={item.name}
            title={item.timestamp}
            subtitle={item.name}
            footer={<small>{item.resolution}</small>}
            badges={[
              { label: item.status, position: "left", variant: "neutral" },
              { label: item.category, position: "right" },
            ]}
          />
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

export const CustomColumns: Story = {
  args: {},
  render: () => (
    <div style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "3rem" }}>
        <h3>2 columnas - COPY ESTE CÓDIGO:</h3>
        <pre style={{ background: "#1e1e2e", color: "#e2e8f0", padding: "1rem", borderRadius: "8px", overflow: "auto" }}>{`import { ImageGrid } from '@ai27-tech/ui';
import { ImageCard } from '@ai27-tech/ui';

export function My2ColumnGrid() {
  const items = [/* tu array de datos */];

  return (
    <ImageGrid
      items={items}
      columns={2}
      renderItem={(item) => (
        <ImageCard
          key={item.id}
          src={item.image}
          alt={item.name}
          title={item.title}
          subtitle={item.subtitle}
          badges={[
            { label: item.status, position: "left" },
            { label: item.type, position: "right" },
          ]}
        />
      )}
    />
  );
}`}</pre>
        <ImageGrid<ForensicEvidence>
          items={mockEvidence}
          columns={2}
          renderItem={(item) => (
            <ImageCard
              key={item.id}
              src={item.image}
              alt={item.name}
              title={item.timestamp}
              subtitle={item.name}
              footer={<small>{item.resolution}</small>}
              badges={[
                { label: item.status, position: "left", variant: "neutral" },
                { label: item.category, position: "right" },
              ]}
            />
          )}
          showCount={true}
        />
      </div>

      <div style={{ marginBottom: "3rem" }}>
        <h3>3 columnas - COPY ESTE CÓDIGO:</h3>
        <pre style={{ background: "#1e1e2e", color: "#e2e8f0", padding: "1rem", borderRadius: "8px", overflow: "auto" }}>{`import { ImageGrid } from '@ai27-tech/ui';
import { ImageCard } from '@ai27-tech/ui';

export function My3ColumnGrid() {
  const items = [/* tu array de datos */];

  return (
    <ImageGrid
      items={items}
      columns={3}
      renderItem={(item) => (
        <ImageCard
          key={item.id}
          src={item.image}
          alt={item.name}
          title={item.title}
          subtitle={item.subtitle}
          badges={[
            { label: item.status, position: "left" },
            { label: item.type, position: "right" },
          ]}
        />
      )}
    />
  );
}`}</pre>
        <ImageGrid<ForensicEvidence>
          items={mockEvidence}
          columns={3}
          renderItem={(item) => (
            <ImageCard
              key={item.id}
              src={item.image}
              alt={item.name}
              title={item.timestamp}
              subtitle={item.name}
              footer={<small>{item.resolution}</small>}
              badges={[
                { label: item.status, position: "left", variant: "neutral" },
                { label: item.category, position: "right" },
              ]}
            />
          )}
          showCount={true}
        />
      </div>

      <div>
        <h3>6 columnas (Thumbnails) - COPY ESTE CÓDIGO:</h3>
        <pre style={{ background: "#1e1e2e", color: "#e2e8f0", padding: "1rem", borderRadius: "8px", overflow: "auto" }}>{`import { ImageGrid } from '@ai27-tech/ui';
import { ImageCard } from '@ai27-tech/ui';

export function MyThumbnailGrid() {
  const items = [/* tu array de datos */];

  return (
    <ImageGrid
      items={items}
      columns={6}
      gap="0.75rem"
      renderItem={(item) => (
        <ImageCard
          key={item.id}
          src={item.image}
          alt={item.name}
          title={item.title}
          badges={[
            { label: item.status, position: "left" },
          ]}
        />
      )}
      showCount={false}
    />
  );
}`}</pre>
        <ImageGrid<ForensicEvidence>
          items={mockEvidence}
          columns={6}
          renderItem={(item) => (
            <ImageCard
              key={item.id}
              src={item.image}
              alt={item.name}
              title={item.timestamp}
              subtitle={item.name}
              footer={<small>{item.resolution}</small>}
              badges={[
                { label: item.status, position: "left", variant: "neutral" },
                { label: item.category, position: "right" },
              ]}
            />
          )}
          showCount={true}
        />
      </div>
    </div>
  ),
};

export const GridWithFiltersExample: Story = {
  args: {},
  render: () => (
    <div style={{ padding: "2rem" }}>
      <h3>Grid Con Filtros - COPY ESTE CÓDIGO:</h3>
      <pre style={{ background: "#1e1e2e", color: "#e2e8f0", padding: "1rem", borderRadius: "8px", overflow: "auto", marginBottom: "2rem" }}>{`import { ImageGrid, type FilterValues } from '@ai27-tech/ui';
import { ImageCard } from '@ai27-tech/ui';
import { useState } from 'react';

export function FilteredImageGrid() {
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  
  const items = [/* tu array de datos */];

  return (
    <ImageGrid
      items={items}
      columns={4}
      filters={[
        {
          key: 'category',
          label: 'CATEGORÍA',
          placeholder: 'Todas',
          options: [
            { label: 'Tipo A', value: 'typeA' },
            { label: 'Tipo B', value: 'typeB' },
          ],
        },
      ]}
      filterValues={filterValues}
      onFilterChange={(key, value) => {
        setFilterValues((prev) => ({ ...prev, [key]: value }));
      }}
      onClear={() => setFilterValues({})}
      matchesFilters={(item, filters) => {
        if (!filters.category) return true;
        return item.category === filters.category;
      }}
      renderItem={(item) => (
        <ImageCard
          key={item.id}
          src={item.image}
          alt={item.name}
          title={item.title}
          subtitle={item.subtitle}
        />
      )}
    />
  );
}`}</pre>
      <ImageGrid<ForensicEvidence>
        items={mockEvidence}
        filters={filters}
        columns={4}
        filterValues={{}}
        onFilterChange={() => {}}
        renderItem={(item) => (
          <ImageCard
            key={item.id}
            src={item.image}
            alt={item.name}
            title={item.timestamp}
            subtitle={item.name}
            badges={[
              { label: item.status, position: "left", variant: "neutral" },
              { label: item.category, position: "right" },
            ]}
          />
        )}
        matchesFilters={() => true}
      />
    </div>
  ),
};
