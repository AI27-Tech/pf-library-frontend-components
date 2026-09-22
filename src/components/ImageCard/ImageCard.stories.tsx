import type { Meta, StoryObj } from "@storybook/react-vite";
import { ImageCard } from "./ImageCard";

const meta = {
  title: "Components/ImageCard",
  component: ImageCard,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    src: "https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=400&h=225&fit=crop",
    alt: "Sample vehicle image",
    title: "Vehicle Title",
    subtitle: "Supporting information",
    variant: "outlined",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ImageCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    title: "Volvo FH16",
    subtitle: "Truck in transit",
  },
};

export const WithBadges: Story = {
  args: {
    title: "Volvo FH16",
    subtitle: "Route: Mexico City → Monterrey",
    badges: [
      { label: "En Ruta", variant: "escort", dot: true, position: "left" },
      { label: "4.2 hrs", variant: "neutral", position: "right" },
    ],
  },
};

export const BadgeOptionsShowcase: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "1fr 1fr" }}>
      {/* With dot */}
      <div style={{ width: 280 }}>
        <ImageCard
          src="https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=400&h=225&fit=crop"
          alt="Truck"
          title="Con dot (indicador)"
          subtitle="Estado visible"
          badges={[
            { label: "Active", variant: "secure", dot: true, position: "left" },
            { label: "2 hrs", variant: "neutral", dot: true, position: "right" },
          ]}
        />
      </div>

      {/* With pulse animation */}
      <div style={{ width: 280 }}>
        <ImageCard
          src="https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=400&h=225&fit=crop"
          alt="Truck"
          title="Con pulse (animado)"
          subtitle="Alerta en vivo"
          badges={[
            { label: "Jamming", variant: "alert", pulse: true, position: "left" },
            { label: "Critical", variant: "alert", position: "right" },
          ]}
        />
      </div>

      {/* With pill shape */}
      <div style={{ width: 280 }}>
        <ImageCard
          src="https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=400&h=225&fit=crop"
          alt="Truck"
          title="Con pill (redondeado)"
          subtitle="Etiquetas de estado"
          badges={[
            { label: "EN RUTA", variant: "escort", pill: true, position: "left" },
            { label: "CUSTODIA", variant: "escort", pill: true, position: "right" },
          ]}
        />
      </div>

      {/* Combined: dot + pill */}
      <div style={{ width: 280 }}>
        <ImageCard
          src="https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=400&h=225&fit=crop"
          alt="Truck"
          title="Dot + Pill"
          subtitle="Indicador en píldora"
          badges={[
            { label: "ACTIVO", variant: "secure", dot: true, pill: true, position: "left" },
            { label: "LIVE", variant: "secure", dot: true, pill: true, position: "right" },
          ]}
        />
      </div>

      {/* Combined: pulse + pill */}
      <div style={{ width: 280 }}>
        <ImageCard
          src="https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=400&h=225&fit=crop"
          alt="Truck"
          title="Pulse + Pill"
          subtitle="Alerta animada redondeada"
          badges={[
            { label: "ALERTA", variant: "alert", pulse: true, pill: true, position: "left" },
            { label: "URGENTE", variant: "alert", pulse: true, pill: true, position: "right" },
          ]}
        />
      </div>

      {/* All variants with dot */}
      <div style={{ width: 280 }}>
        <ImageCard
          src="https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=400&h=225&fit=crop"
          alt="Truck"
          title="Todas las variantes"
          subtitle="Con dot"
          badges={[
            { label: "Seguro", variant: "secure", dot: true, position: "left" },
            { label: "Alerta", variant: "alert", dot: true, position: "right" },
          ]}
        />
      </div>

      {/* Warning + Neutral variants */}
      <div style={{ width: 280 }}>
        <ImageCard
          src="https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=400&h=225&fit=crop"
          alt="Truck"
          title="Warning y Neutral"
          subtitle="Con combinaciones"
          badges={[
            { label: "RETRASO", variant: "warning", pill: true, dot: true, position: "left" },
            { label: "Info", variant: "neutral", dot: false, position: "right" },
          ]}
        />
      </div>
    </div>
  ),
};

export const WithFooter: Story = {
  args: {
    title: "Volvo FH16",
    subtitle: "Route: Mexico City → Monterrey",
    badges: [
      { label: "En Ruta", variant: "escort", dot: true, position: "left" },
      { label: "4.2 hrs", variant: "neutral", position: "right" },
    ],
    footer: (
      <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
        📍 Querétaro • 45% progress
      </div>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "1fr 1fr 1fr" }}>
      {(["outlined", "elevated", "filled"] as const).map((v) => (
        <div key={v} style={{ width: 320 }}>
          <ImageCard
            variant={v}
            src="https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=400&h=225&fit=crop"
            alt="Truck"
            title={`${v} Variant`}
            subtitle="Vehicle information"
            badges={[
              { label: "Active", variant: "secure", dot: true, position: "left" },
              { label: "2 hrs ETA", variant: "neutral", position: "right" },
            ]}
          />
        </div>
      ))}
    </div>
  ),
};

export const BadgeVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "1fr 1fr" }}>
      {(["secure", "alert", "escort", "warning", "neutral"] as const).map((variant) => (
        <div key={variant} style={{ width: 280 }}>
          <ImageCard
            src="https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=400&h=225&fit=crop"
            alt="Truck"
            title="Vehicle Status"
            subtitle={`${variant} badge example`}
            badges={[
              { label: variant.toUpperCase(), variant, dot: true, position: "left" },
              { label: "Status", variant: "neutral", position: "right" },
            ]}
          />
        </div>
      ))}
    </div>
  ),
};

export const Clickable: Story = {
  args: {
    title: "Volvo FH16",
    subtitle: "Route: Mexico City → Monterrey",
    badges: [
      { label: "En Ruta", variant: "escort", dot: true, position: "left" },
      { label: "4.2 hrs", variant: "neutral", position: "right" },
    ],
    onClick: () => alert("Card clicked!"),
  },
};

export const WithDetailedFooter: Story = {
  args: {
    title: "Dina Roadster",
    subtitle: "Delivery Status",
    badges: [
      { label: "Entregado", variant: "secure", dot: true, position: "left" },
      { label: "Completado", variant: "neutral", position: "right" },
    ],
    footer: (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>📦 12 paquetes</span>
        <span>✓ 100% completo</span>
      </div>
    ),
  },
};
