import { useEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { Check, TriangleAlert, X } from "lucide-react";
import { SkeletonText, Skeleton } from "../Skeleton";
import { cx } from "../Input/utils";
import styles from "./Timeline.module.css";
import { TIMELINE_LABELS, type TimelineLabels } from "./labels";
import type { TimelineItemData, TimelineStatus } from "./types";
import {
  orientacionEfectiva,
  ordenarItems,
  resolverLabels,
  tramoSolido,
  type TimelineOrientation,
} from "./timelineUtils";

export interface TimelineProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  items: TimelineItemData[];
  /** `vertical` por defecto. */
  orientation?: TimelineOrientation;
  /** `alternate` reparte el contenido a los dos lados cuando hay espacio. Por defecto: `start`. */
  align?: "start" | "alternate";
  /** Tamaño del marcador. Por defecto: `md`. */
  size?: "sm" | "md" | "lg";
  /** Ancho mínimo de cada punto en horizontal. Por defecto: `8rem`. */
  minItemWidth?: string;
  /** Ancho del contenedor (px) por debajo del cual una línea horizontal se muestra vertical. */
  stackBelow?: number;
  /** Cuántos puntos mostrar antes del control "Mostrar más". */
  maxVisible?: number;
  /** Invierte el orden visual sin cambiar el arreglo recibido. */
  reverse?: boolean;
  /** Vuelve clicable el contenido de cada punto. Recibe el punto y su índice en `items`. */
  onItemClick?: (item: TimelineItemData, index: number) => void;
  /** Muestra esqueletos en lugar de los puntos. */
  loading?: boolean;
  /** Cuántos esqueletos mostrar al cargar. Por defecto: 4. */
  loadingItems?: number;
  /** Contenido cuando no hay puntos. */
  emptyState?: ReactNode;
  /** Textos en español. Lo que no se pase conserva su valor por defecto. */
  labels?: Partial<TimelineLabels>;
}

const ICONO_POR_ESTADO: Partial<Record<TimelineStatus, ReactNode>> = {
  completed: <Check aria-hidden="true" />,
  error: <X aria-hidden="true" />,
  warning: <TriangleAlert aria-hidden="true" />,
};

export function Timeline({
  items,
  orientation = "vertical",
  align = "start",
  size = "md",
  minItemWidth = "8rem",
  stackBelow,
  maxVisible,
  reverse = false,
  onItemClick,
  loading = false,
  loadingItems = 4,
  emptyState,
  labels: labelsPersonalizadas,
  className,
  style,
  "aria-label": ariaLabel,
  ...rest
}: TimelineProps) {
  const labels = resolverLabels(TIMELINE_LABELS, labelsPersonalizadas);
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [ancho, setAncho] = useState<number | undefined>(undefined);
  const [desbordado, setDesbordado] = useState(false);
  const [expandido, setExpandido] = useState(false);

  // Mide el contenedor, no la ventana. Sin ResizeObserver (jsdom) el ancho queda indefinido.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    const medir = () => {
      setAncho(root.clientWidth);
      const scroller = scrollerRef.current;
      setDesbordado(scroller !== null && scroller.scrollWidth > scroller.clientWidth + 1);
    };
    const observador = new ResizeObserver(medir);
    observador.observe(root);
    medir();
    return () => observador.disconnect();
  }, []);

  const orientacion = orientacionEfectiva(orientation, stackBelow, ancho);
  const ordenados = ordenarItems(items, reverse);
  const hayRecorte = maxVisible !== undefined && ordenados.length > maxVisible;
  const visibles = hayRecorte && !expandido ? ordenados.slice(0, maxVisible) : ordenados;
  const claveActual = items.find((item) => item.status === "current")?.id;

  // Centra el punto actual cuando hay scroll horizontal. Sin animación si el usuario lo pide.
  useEffect(() => {
    if (!desbordado || orientacion !== "horizontal" || claveActual === undefined) return;
    const actual = scrollerRef.current?.querySelector<HTMLElement>('[aria-current="step"]');
    const reducirMovimiento = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    actual?.scrollIntoView?.({ inline: "center", block: "nearest", behavior: reducirMovimiento ? "auto" : "smooth" });
  }, [claveActual, desbordado, orientacion]);

  const estiloRaiz = { ...style, ["--tl-min-item" as string]: minItemWidth } as CSSProperties;
  const atributosRaiz = {
    "data-orientation": orientacion,
    "data-align": align,
    "data-size": size,
    "data-overflow": desbordado || undefined,
  };

  let contenido: ReactNode;
  if (loading) {
    contenido = (
      <div className={styles.list} aria-busy="true">
        {Array.from({ length: loadingItems }, (_, i) => (
          <div key={i} className={styles.item}>
            <div className={styles.rail}>
              <Skeleton variant="circle" width="var(--tl-marker)" />
            </div>
            <div className={styles.content}>
              <SkeletonText lines={2} />
            </div>
          </div>
        ))}
      </div>
    );
  } else if (items.length === 0) {
    contenido = (
      <div className={styles.empty} role="status">
        {emptyState ?? labels.empty}
      </div>
    );
  } else {
    const visiblesOrdenados = visibles.map((v) => v.item);
    contenido = (
      <>
        <div
          ref={scrollerRef}
          className={styles.scroller}
          role={desbordado ? "region" : undefined}
          tabIndex={desbordado ? 0 : undefined}
          aria-label={desbordado ? ariaLabel : undefined}
        >
          <ol className={styles.list} aria-label={desbordado ? undefined : ariaLabel}>
            {visibles.map(({ item, index }, i) => {
              const estado: TimelineStatus = item.status ?? "upcoming";
              const esUltimo = i === visibles.length - 1;
              const solido = tramoSolido(visiblesOrdenados, i, reverse);
              const icono = item.icon ?? ICONO_POR_ESTADO[estado];

              const cuerpo = (
                <>
                  <span className={styles.header}>
                    <span className={styles.title}>{item.title}</span>
                    {item.timestamp !== undefined &&
                      (item.dateTime ? (
                        <time className={styles.timestamp} dateTime={item.dateTime}>
                          {item.timestamp}
                        </time>
                      ) : (
                        <span className={styles.timestamp}>{item.timestamp}</span>
                      ))}
                  </span>
                  {item.description && <span className={styles.description}>{item.description}</span>}
                  {item.content && <span className={styles.extra}>{item.content}</span>}
                  <span className="ui-sr-only">{labels[estado]}</span>
                </>
              );

              return (
                <li
                  key={item.id}
                  className={styles.item}
                  data-status={estado}
                  aria-current={estado === "current" ? "step" : undefined}
                >
                  <div className={styles.rail}>
                    <span className={styles.marker}>{icono}</span>
                    {!esUltimo && (
                      <span
                        className={cx(styles.connector, solido && styles.connectorSolid)}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className={styles.content}>
                    {onItemClick ? (
                      <button type="button" className={styles.clickable} onClick={() => onItemClick(item, index)}>
                        {cuerpo}
                      </button>
                    ) : (
                      cuerpo
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
        {hayRecorte && (
          <button
            type="button"
            className={styles.toggle}
            aria-expanded={expandido}
            onClick={() => setExpandido((v) => !v)}
          >
            {expandido ? labels.showLess : labels.showMore(ordenados.length - (maxVisible ?? 0))}
          </button>
        )}
      </>
    );
  }

  return (
    <div ref={rootRef} className={cx(styles.root, className)} style={estiloRaiz} {...atributosRaiz} {...rest}>
      {contenido}
    </div>
  );
}
