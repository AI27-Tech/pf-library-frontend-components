import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";
import { ImageGrid } from "../ImageGrid";
import { ImageCard } from "../ImageCard";

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    children: "Custodia activa",
    variant: "escort",
    dot: false,
    pulse: false,
    pill: false,
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["secure", "alert", "escort", "warning", "neutral"],
    },
    dot: { control: "boolean" },
    pulse: { control: "boolean" },
    pill: { control: "boolean" },
    truncate: { control: "boolean" },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Las señales de estado táctico del sistema AI27. */
export const StatusSignals: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
      <Badge variant="secure" dot>Custodia activa</Badge>
      <Badge variant="escort" dot>Escolta enlazada</Badge>
      <Badge variant="warning" dot>Demora en ruta</Badge>
      <Badge variant="alert" pulse>Jamming detectado</Badge>
      <Badge variant="neutral">Sin datos</Badge>
    </div>
  ),
};

/** Etiquetas de estado de ruta típicamente mostradas en tablas. */
export const RouteTags: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
      <Badge variant="secure" pill>EN RUTA</Badge>
      <Badge variant="alert" pill>DESVÍO</Badge>
      <Badge variant="escort" pill>CUSTODIA ACTIVA</Badge>
    </div>
  ),
};

export const AllVariants: Story = {
  args: {
    pulse: true
  },

  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-start" }}>
      {(["secure", "escort", "warning", "alert", "neutral"] as const).map((v) => (
        <Badge key={v} variant={v} dot>
          {v}
        </Badge>
      ))}
    </div>
  )
};

/**
 * Estados largos con `truncate`: el texto se recorta con "…" en vez de cortarse
 * contra el borde o desbordar la card. Al pasar el cursor, el `title` nativo
 * muestra el texto completo. Cada recuadro simula una celda angosta de la rejilla.
 */
export const TruncatedInNarrowCells: Story = {
  render: () => {
    const estados = [
      { label: "FALLA-MECANICA", variant: "warning" as const },
      { label: "EN-RECORRIDO", variant: "secure" as const },
      { label: "PARADA-BANO", variant: "escort" as const },
      { label: "SIN-NOVEDAD", variant: "neutral" as const },
      { label: "ESTADO-TRANSITORIO", variant: "warning" as const },
      { label: "ACCIDENTE", variant: "alert" as const },
    ];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 150px)", gap: "1rem" }}>
          {estados.map((e) => (
            <div
              key={e.label}
              style={{
                border: "1px solid #2d3748",
                borderRadius: "0.5rem",
                padding: "0.5rem",
                display: "flex",
                justifyContent: "flex-end",
                background: "#1c222e",
              }}
            >
              <Badge variant={e.variant} truncate>
                {e.label}
              </Badge>
            </div>
          ))}
        </div>
        <p style={{ fontSize: "0.75rem", color: "#888", fontStyle: "italic" }}>
          💡 Con truncate, el texto largo se recorta con "…" y no se sale de la celda.
          Pasa el cursor sobre un badge para ver el texto completo en el tooltip.
        </p>
      </div>
    );
  },
};

/** Comparación: sin `truncate` (se corta feo) vs. con `truncate` (recorte limpio). */
export const TruncateComparison: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <p style={{ fontSize: "0.75rem", color: "#888", margin: "0 0 0.5rem" }}>Sin truncate:</p>
        <div style={{ width: 120, border: "1px dashed #ef4444", padding: "0.5rem", display: "flex", justifyContent: "flex-end", overflow: "hidden" }}>
          <Badge variant="warning">FALLA-MECANICA</Badge>
        </div>
      </div>
      <div>
        <p style={{ fontSize: "0.75rem", color: "#888", margin: "0 0 0.5rem" }}>Con truncate:</p>
        <div style={{ width: 120, border: "1px dashed #22c55e", padding: "0.5rem", display: "flex", justifyContent: "flex-end", overflow: "hidden" }}>
          <Badge variant="warning" truncate>FALLA-MECANICA</Badge>
        </div>
      </div>
    </div>
  ),
};

/**
 * `truncate` + `expandOnHover`: en reposo el badge está recortado con "…", y al
 * pasar el cursor se despliega completo para leer todo el texto, sin animación de
 * scroll. El badge expandido flota por encima de los vecinos.
 */
export const ExpandOnHover: Story = {
  render: () => {
    const estados = [
      { label: "FALLA-MECANICA", variant: "warning" as const },
      { label: "ESTADO-TRANSITORIO", variant: "secure" as const },
      { label: "PARADA-BANO", variant: "escort" as const },
    ];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 150px)", gap: "1rem" }}>
          {estados.map((e) => (
            <div
              key={e.label}
              style={{
                border: "1px solid #2d3748",
                borderRadius: "0.5rem",
                padding: "0.5rem",
                display: "flex",
                justifyContent: "flex-end",
                background: "#1c222e",
              }}
            >
              <Badge variant={e.variant} truncate expandOnHover>
                {e.label}
              </Badge>
            </div>
          ))}
        </div>
        <p style={{ fontSize: "0.75rem", color: "#888", fontStyle: "italic" }}>
          💡 Recortado en reposo; al pasar el cursor se despliega completo para leerlo.
        </p>
      </div>
    );
  },
};

// Datos que reproducen la galería: muchas cards angostas con hora (izquierda) y
// un estado largo (derecha) sobre la imagen.
const ESTADOS_GRID = [
  { label: "FALLA-MECANICA", variant: "warning" as const },
  { label: "EN-RECORRIDO", variant: "secure" as const },
  { label: "PARADA-BANO", variant: "escort" as const },
  { label: "SIN-NOVEDAD", variant: "neutral" as const },
  { label: "ESTADO-TRANSITORIO", variant: "warning" as const },
  { label: "ACCIDENTE", variant: "alert" as const },
];

const CARDS_GRID = Array.from({ length: 12 }, (_, i) => {
  const estado = ESTADOS_GRID[i % ESTADOS_GRID.length]!;
  return {
    id: `card-${i}`,
    hora: `${(6 + (i % 18)).toString().padStart(2, "0")}:${((i * 7) % 60).toString().padStart(2, "0")}`,
    ...estado,
  };
});

/**
 * Escenario real: `ImageGrid` de 6 columnas como en la galería, con badges de
 * estado largos en la esquina superior derecha. Con `truncate` en el `BadgeConfig`,
 * el estado se recorta con "…" y no se corta contra el borde ni se sale de la card.
 * El texto completo se lee en el tooltip nativo (pasar el cursor).
 *
 * Nota: en el `ImageCard` NO se usa `expandOnHover`, porque el contenedor de imagen
 * recorta (overflow:hidden) y cortaría el badge expandido. Para leer todo el valor
 * dentro del grid, el tooltip de `truncate` es la vía adecuada.
 */
export const InImageGrid: Story = {
  render: () => (
    <div style={{ width: "min(1100px, 90vw)" }}>
      <ImageGrid
        items={CARDS_GRID}
        columns={6}
        gap="1rem"
        showCount={false}
        renderItem={(card) => (
          <ImageCard
            key={card.id}
            alt="Evidencia"
            title={card.id}
            subtitle="2.4 MB"
            onClick={() => {}}
            badges={[
              { label: card.hora, variant: "neutral", position: "left" },
              {
                label: card.label,
                variant: card.variant,
                position: "right",
                truncate: true,
                fixedWidth: true,
              },
            ]}
          >
            {/* Fondo sólido en lugar de una imagen remota, para una story estable. */}
            <div style={{ width: "100%", height: "100%", background: "#2a3444" }} />
          </ImageCard>
        )}
      />
      <p style={{ fontSize: "0.75rem", color: "#888", fontStyle: "italic", marginTop: "1rem" }}>
        💡 Los estados largos de la esquina derecha se recortan con "…" y no se
        salen de la card. Pasa el cursor sobre uno para leer el valor completo.
      </p>
    </div>
  ),
};

/**
 * DIAGNÓSTICO: badges con `truncate` + `fixedWidth` fuera de ImageCard.
 * Si aquí todos miden lo mismo, el ancho fijo funciona en el Badge y cualquier
 * diferencia en el grid viene de la interacción con ImageCard.
 */
export const FixedWidthDiagnostic: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-start" }}>
      <Badge variant="warning" truncate fixedWidth>FALLA-MECANICA</Badge>
      <Badge variant="secure" truncate fixedWidth>OK</Badge>
      <Badge variant="alert" truncate fixedWidth>ACCIDENTE</Badge>
      <Badge variant="escort" truncate fixedWidth>ESTADO-TRANSITORIO-MUY-LARGO</Badge>
      <p style={{ fontSize: "0.75rem", color: "#888", fontStyle: "italic" }}>
        💡 Los cuatro badges deben tener EXACTAMENTE el mismo ancho (7rem).
      </p>
    </div>
  ),
};
