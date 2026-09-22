import type { Meta, StoryObj } from "@storybook/react-vite";
import { ImageCarousel } from "./ImageCarousel";
import { ImageCard } from "../ImageCard";
import { Badge } from "../Badge";

const meta = {
  title: "Components/ImageCarousel",
  component: ImageCarousel,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    sections: [],
    renderItem: () => null,
  },
} satisfies Meta<typeof ImageCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

type ForensicItem = {
  id: string;
  name: string;
  image: string;
  size: string;
  timestamp: string;
  status?: string;
};

const mockForensicItems: ForensicItem[] = [
  {
    id: "1",
    name: "IRG_0814_FRONTAL.RAV",
    image: "https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=400&h=225&fit=crop",
    size: "4.2 MB",
    timestamp: "08:14",
    status: "SECURED",
  },
  {
    id: "2",
    name: "PLACA_ENGOMADO.RAV",
    image: "https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=400&h=225&fit=crop",
    size: "3.8 MB",
    timestamp: "08:16",
    status: "SECURED",
  },
  {
    id: "3",
    name: "MARCHAMO_FERNO.RAV",
    image: "https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=400&h=225&fit=crop",
    size: "5.1 MB",
    timestamp: "08:19",
    status: "SECURED",
  },
  {
    id: "4",
    name: "PUERTAS_TRAS.RAV",
    image: "https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=400&h=225&fit=crop",
    size: "4.6 MB",
    timestamp: "08:21",
    status: "SECURED",
  },
  {
    id: "5",
    name: "CABINA_OPERADOR.RAV",
    image: "https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=400&h=225&fit=crop",
    size: "7.2 MB",
    timestamp: "08:24",
    status: "SECURED",
  },
  {
    id: "6",
    name: "GUIA_EMBARQUE_PP.TIF",
    image: "https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=400&h=225&fit=crop",
    size: "2.1 MB",
    timestamp: "08:27",
    status: "SECURED",
  },
];

const mockForensicSections = [
  {
    title: "[01] INSPECCIÓN DE ORIGEN Y EMBARQUE",
    badge: <Badge variant="neutral" pill>6 EVIDENCIAS</Badge>,
    location: "PATIO INDUSTRIAL SAN MARTÍN",
    items: mockForensicItems.slice(0, 4),
    visibleItems: 4 as const,
  },
  {
    title: "[02] INCIDENCIAS Y TELEMETRÍA EN RUTA",
    badge: <Badge variant="alert" pill>2 ALERTAS CRÍTICAS</Badge>,
    location: "CORREDOR FED-570 • KM 44 - KM 82",
    items: mockForensicItems.slice(2, 6),
    visibleItems: 4 as const,
  },
  {
    title: "[03] LLEGADA Y COTEJO FORENSE",
    badge: <Badge variant="secure" pill>RESGUARDE SELLADO</Badge>,
    location: "CENTRO DE DISTRIBUCIÓN QUERÉTARO",
    items: mockForensicItems.slice(1, 5),
    visibleItems: 4 as const,
  },
];

export const Basic: Story = {
  args: {},
  render: () => (
    <div style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "2rem", background: "#1e1e2e", padding: "1.5rem", borderRadius: "8px" }}>
        <h3 style={{ marginTop: 0, color: "#e2e8f0" }}>📷 COPY ESTE CÓDIGO PARA USAR EN TU PROYECTO:</h3>
        <pre style={{ background: "#0f0f1e", color: "#7c9df0", padding: "1rem", borderRadius: "6px", fontSize: "0.8rem", overflow: "auto" }}>{`import { ImageCarousel, type CarouselSection } from '@ai27-tech/ui';
import { ImageCard } from '@ai27-tech/ui';
import { Badge } from '@ai27-tech/ui';

type MyItem = {
  id: string;
  name: string;
  image: string;
  timestamp: string;
};

export function MyCarousel() {
  const items: MyItem[] = [
    { id: '1', name: 'Foto 1', image: 'url...', timestamp: '08:14' },
    { id: '2', name: 'Foto 2', image: 'url...', timestamp: '08:16' },
  ];

  const sections: CarouselSection<MyItem>[] = [
    {
      title: '[01] MI SECCIÓN',
      badge: <Badge variant="neutral" pill>2 ITEMS</Badge>,
      location: 'Mi Ubicación',
      items: items,
      visibleItems: 4,
    },
  ];

  return (
    <ImageCarousel<MyItem>
      sections={sections}
      renderItem={(item) => (
        <ImageCard
          key={item.id}
          src={item.image}
          alt={item.name}
          title={item.timestamp}
          subtitle={item.name}
          badges={[
            { label: 'INFO', position: 'left' },
            { label: item.timestamp, position: 'right' },
          ]}
        />
      )}
      gap="1.5rem"
    />
  );
}`}</pre>
      </div>

      <ImageCarousel<ForensicItem>
        sections={mockForensicSections}
        renderItem={(item) => (
          <ImageCard
            key={item.id}
            src={item.image}
            alt={item.name}
            title={item.timestamp}
            subtitle={item.name}
            footer={<small>{item.size}</small>}
            badges={[
              { label: "DK", position: "left" },
              { label: item.timestamp, position: "right" },
            ]}
          />
        )}
        gap="1.5rem"
      />
    </div>
  ),
};

export const SingleSection: Story = {
  args: {},
  render: () => (
    <div style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "2rem", background: "#1e1e2e", padding: "1.5rem", borderRadius: "8px" }}>
        <h3 style={{ marginTop: 0, color: "#e2e8f0" }}>📷 UNA SOLA SECCIÓN - COPY ESTE CÓDIGO:</h3>
        <pre style={{ background: "#0f0f1e", color: "#7c9df0", padding: "1rem", borderRadius: "6px", fontSize: "0.8rem", overflow: "auto" }}>{`import { ImageCarousel } from '@ai27-tech/ui';
import { ImageCard } from '@ai27-tech/ui';
import { Badge } from '@ai27-tech/ui';

export function SingleSectionCarousel() {
  const items = [/* tu array */];

  return (
    <ImageCarousel
      sections={[
        {
          title: '[01] MI SECCIÓN ÚNICA',
          badge: <Badge variant="secure" pill>✓ COMPLETO</Badge>,
          location: 'Mi Ubicación',
          items: items,
          visibleItems: 4,
        },
      ]}
      renderItem={(item) => (
        <ImageCard
          key={item.id}
          src={item.image}
          alt={item.name}
          title={item.timestamp}
          subtitle={item.name}
          badges={[
            { label: 'EVIDENCE', position: 'left', variant: 'secure', dot: true },
            { label: item.timestamp, position: 'right' },
          ]}
        />
      )}
    />
  );
}`}</pre>
      </div>

      <ImageCarousel<ForensicItem>
        sections={[mockForensicSections[0]]}
        renderItem={(item) => (
          <ImageCard
            key={item.id}
            src={item.image}
            alt={item.name}
            title={item.timestamp}
            subtitle={item.name}
            footer={<small>{item.size}</small>}
            badges={[
              { label: "EVIDENCE", position: "left", variant: "secure", dot: true },
              { label: item.timestamp, position: "right" },
            ]}
          />
        )}
        gap="1rem"
      />
    </div>
  ),
};

export const WithoutArrows: Story = {
  args: {},
  render: () => (
    <div style={{ padding: "2rem" }}>
      <ImageCarousel<ForensicItem>
        sections={[
          {
            ...mockForensicSections[0],
            showArrows: false,
          },
        ]}
        renderItem={(item) => (
          <ImageCard
            key={item.id}
            src={item.image}
            alt={item.name}
            title={item.timestamp}
            subtitle={item.name}
            footer={<small>{item.size}</small>}
            badges={[
              { label: "DK", position: "left" },
              { label: item.timestamp, position: "right" },
            ]}
          />
        )}
        gap="1.5rem"
      />
    </div>
  ),
};

export const VariousVisibleItems: Story = {
  args: {},
  render: () => (
    <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "3rem" }}>
      <div style={{ marginBottom: "2rem", background: "#1e1e2e", padding: "1.5rem", borderRadius: "8px" }}>
        <h3 style={{ marginTop: 0, color: "#e2e8f0" }}>🎬 CONTROLAR ITEMS VISIBLES - COPY ESTE CÓDIGO:</h3>
        <pre style={{ background: "#0f0f1e", color: "#7c9df0", padding: "1rem", borderRadius: "6px", fontSize: "0.8rem", overflow: "auto" }}>{`import { ImageCarousel } from '@ai27-tech/ui';

export function CarouselWithVisibleItems() {
  // Cambia 'visibleItems' para mostrar 2, 3, 4, 5, o 6 items
  return (
    <ImageCarousel
      sections={[
        {
          title: 'Mi Carrusel',
          location: 'Mi ubicación',
          items: tusDatos,
          visibleItems: 4,  // ← Cambiar este número
        },
      ]}
      renderItem={(item) => <ImageCard {...item} />}
    />
  );
}

// Opciones comunes:
// visibleItems: 2  → Solo 2 items visible (cards grandes)
// visibleItems: 3  → 3 items visible
// visibleItems: 4  → 4 items visible (default)
// visibleItems: 5  → 5 items visible
// visibleItems: 6  → 6 items visible (compacto)`}</pre>
      </div>

      {[2, 3, 4, 5].map((visibleItems) => (
        <div key={visibleItems}>
          <h3 style={{ marginBottom: "1rem", color: "#e2e8f0" }}>
            {visibleItems} visible items
          </h3>
          <ImageCarousel<ForensicItem>
            sections={[
              {
                ...mockForensicSections[0],
                visibleItems: visibleItems as any,
              },
            ]}
            renderItem={(item) => (
              <ImageCard
                key={item.id}
                src={item.image}
                alt={item.name}
                title={item.timestamp}
                subtitle={item.name}
                footer={<small>{item.size}</small>}
                badges={[
                  { label: "DK", position: "left" },
                  { label: item.timestamp, position: "right" },
                ]}
              />
            )}
            gap="1rem"
          />
        </div>
      ))}
    </div>
  ),
};

export const EmptySectionHandling: Story = {
  args: {},
  render: () => (
    <div style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "2rem", background: "#1e1e2e", padding: "1.5rem", borderRadius: "8px" }}>
        <h3 style={{ marginTop: 0, color: "#e2e8f0" }}>📋 MÚLTIPLES SECCIONES - COPY ESTE CÓDIGO:</h3>
        <pre style={{ background: "#0f0f1e", color: "#7c9df0", padding: "1rem", borderRadius: "6px", fontSize: "0.8rem", overflow: "auto" }}>{`import { ImageCarousel, type CarouselSection } from '@ai27-tech/ui';
import { ImageCard } from '@ai27-tech/ui';
import { Badge } from '@ai27-tech/ui';

export function MultipleSectionsCarousel() {
  const sections: CarouselSection[] = [
    {
      title: '[01] PRIMERA SECCIÓN',
      badge: <Badge variant="neutral" pill>6 ITEMS</Badge>,
      location: 'Ubicación 1',
      items: datos1,
      visibleItems: 4,
    },
    {
      title: '[02] SEGUNDA SECCIÓN',
      badge: <Badge variant="alert" pill>2 ALERTAS</Badge>,
      location: 'Ubicación 2',
      items: datos2,
      visibleItems: 4,
    },
    {
      title: '[03] TERCERA SECCIÓN',
      badge: <Badge variant="secure" pill>✓ OK</Badge>,
      location: 'Ubicación 3',
      items: datos3,
      visibleItems: 4,
    },
  ];

  return (
    <ImageCarousel
      sections={sections}
      renderItem={(item) => (
        <ImageCard
          key={item.id}
          src={item.image}
          alt={item.name}
          title={item.title}
        />
      )}
      hideEmpty={true}
      gap="1rem"
    />
  );
}`}</pre>
      </div>

      <ImageCarousel<ForensicItem>
        sections={[
          mockForensicSections[0],
          {
            title: "[02] EMPTY SECTION",
            badge: <Badge variant="neutral" pill>0 EVIDENCIAS</Badge>,
            location: "NOBODY HOME",
            items: [],
            visibleItems: 4,
          },
          mockForensicSections[2],
        ]}
        renderItem={(item) => (
          <ImageCard
            key={item.id}
            src={item.image}
            alt={item.name}
            title={item.timestamp}
            subtitle={item.name}
            footer={<small>{item.size}</small>}
            badges={[
              { label: "DK", position: "left" },
              { label: item.timestamp, position: "right" },
            ]}
          />
        )}
        hideEmpty={true}
        gap="1rem"
      />
    </div>
  ),
};


