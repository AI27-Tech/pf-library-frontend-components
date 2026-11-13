import { useEffect, useRef, useState, type ReactNode } from "react";
import { SkeletonText } from "../Skeleton";
import styles from "./MessagePanel.module.css";
import { Avatar } from "./shared";
import { BUBBLE_LABELS, LIST_LABELS, resolverLabels, type BubbleLabels, type ListLabels } from "./labels";
import type { GroupPosition } from "./groupMessages";
import type { DeliveryStatus, Mensaje } from "./types";
import { cx, formatHora, isNearBottom } from "./utils";

export interface MessageBubbleProps {
  /** Mensaje completo del contrato. Si se pasa, de aquí salen cuerpo, alias y fecha. */
  mensaje?: Mensaje;
  /** Si el mensaje lo envió el visor actual. Lo calcula el consumidor (`MessageThread` usa `isOwn`). */
  own?: boolean;
  /** Identidad presentada del autor. Sustituye a `mensaje.aliasMostrado`. */
  aliasMostrado?: string;
  /** Marca de tiempo ISO 8601. Se muestra como hora local. */
  creadoEn?: string;
  /** Adjuntos ya resueltos por el consumidor (ver `MessageAttachment`). */
  adjuntos?: ReactNode;
  /** Contenido de auditoría (actor real, rol al enviar). Solo se renderiza si se pasa. */
  slotAuditoria?: ReactNode;
  /** Avatar al lado de la burbuja, en el primer mensaje del grupo de otro autor. */
  avatar?: { src?: string; name?: string };
  /** Posición dentro del grupo de autor. Define radios, alias y hora. Por defecto: `single`. */
  groupPosition?: GroupPosition;
  /** Estado de entrega de un envío optimista. */
  deliveryStatus?: DeliveryStatus;
  /** Motivo del fallo de entrega, mostrado junto al estado `failed`. */
  deliveryError?: string;
  /** Reintento de envío. El botón solo aparece si existe. */
  onRetry?: () => void;
  /** Cuerpo del mensaje. Sustituye a `mensaje.cuerpo`. */
  children?: ReactNode;
  /** Textos de la burbuja en español. */
  labels?: Partial<BubbleLabels>;
  /**
   * @deprecated Usar `aliasMostrado`. Se retira en la siguiente beta mayor.
   */
  author?: string;
  /**
   * @deprecated Usar `creadoEn`. Se retira en la siguiente beta mayor.
   */
  time?: string;
}

const CLASE_GRUPO: Record<GroupPosition, string> = {
  single: styles.groupSingle,
  first: styles.groupFirst,
  middle: styles.groupMiddle,
  last: styles.groupLast,
};

export function MessageBubble({
  mensaje,
  own = false,
  aliasMostrado,
  creadoEn,
  adjuntos,
  slotAuditoria,
  avatar,
  groupPosition = "single",
  deliveryStatus,
  deliveryError,
  onRetry,
  children,
  labels: labelsPersonalizadas,
  author,
  time,
}: MessageBubbleProps) {
  const labels = resolverLabels(BUBBLE_LABELS, labelsPersonalizadas);
  const alias = aliasMostrado ?? mensaje?.aliasMostrado ?? author;
  const cuerpo = children ?? mensaje?.cuerpo;
  const fecha = creadoEn ?? mensaje?.creadoEn;
  const hora = fecha ? formatHora(fecha) : (time ?? "");

  const mostrarAlias = !own && (groupPosition === "first" || groupPosition === "single") && Boolean(alias);
  const mostrarHora = (groupPosition === "last" || groupPosition === "single") && Boolean(hora);

  return (
    <div className={cx(styles.msgRow, own ? styles.own : styles.other)}>
      {avatar && !own && mostrarAlias && <Avatar src={avatar.src} name={avatar.name} />}
      <div className={cx(styles.bubble, CLASE_GRUPO[groupPosition])}>
        {mostrarAlias && <span className={styles.author}>{alias}</span>}
        <span className={styles.bubbleBody}>{cuerpo}</span>
        {adjuntos}
        {slotAuditoria && <div className={styles.audit}>{slotAuditoria}</div>}
        {deliveryStatus === "sending" && <span className={styles.delivery}>{labels.sending}</span>}
        {deliveryStatus === "failed" && (
          <span className={cx(styles.delivery, styles.deliveryError)} role="alert">
            {labels.failed}
            {deliveryError ? `: ${deliveryError}` : ""}
            {onRetry && (
              <button type="button" className={styles.retry} onClick={onRetry}>
                {labels.retry}
              </button>
            )}
          </span>
        )}
        {mostrarHora && !deliveryStatus && <span className={styles.time}>{hora}</span>}
      </div>
    </div>
  );
}

/** Divisor centrado entre días ("Hoy", "Ayer", una fecha) o marca de "Mensajes nuevos". */
export function MessageDayDivider({ children }: { children: ReactNode }) {
  return <div className={styles.dayDivider}>{children}</div>;
}

export interface MessageListProps {
  /** Auto-desplazarse al final cuando llega un mensaje. Por defecto: true. */
  autoScroll?: boolean;
  /** Hay mensajes anteriores por pedir (`hay_mas` del contrato). */
  hayMas?: boolean;
  /** Pide la historia anterior. El consumidor llama a la API con `antes_de`. */
  onCargarAnteriores?: () => void;
  /** Mientras se carga la historia anterior, el botón muestra "Cargando…" y se conserva la posición. */
  loadingPrevious?: boolean;
  /**
   * Secuencia del último mensaje. Si se pasa, el desplazamiento automático solo ocurre cuando cambia.
   * Si no se pasa, se desplaza en cada render (comportamiento anterior).
   */
  ultimaSecuencia?: number;
  /** El último mensaje lo envió el visor: se desplaza aunque el usuario esté arriba. */
  ultimoEsPropio?: boolean;
  /** Muestra esqueletos de burbujas en lugar del contenido. */
  loading?: boolean;
  /** Sin mensajes. Con `emptyState` se muestra ese contenido; si no, un texto por defecto. */
  empty?: boolean;
  emptyState?: ReactNode;
  /** Textos de la lista en español. */
  labels?: Partial<ListLabels>;
  children?: ReactNode;
}

/** Distancia desde el fondo, en píxeles, dentro de la cual se considera "cerca del final" (4 rem). */
function umbralCercaDelFinal(): number {
  const tamanoBase = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return (Number.isNaN(tamanoBase) ? 16 : tamanoBase) * 4;
}

function EsqueletoMensajes() {
  return (
    <div aria-busy="true">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className={cx(styles.msgRow, i % 2 === 0 ? styles.other : styles.own)}>
          <div className={styles.bubble}>
            <SkeletonText lines={2} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MessageList({
  autoScroll = true,
  hayMas = false,
  onCargarAnteriores,
  loadingPrevious = false,
  ultimaSecuencia,
  ultimoEsPropio = false,
  loading = false,
  empty = false,
  emptyState,
  labels: labelsPersonalizadas,
  children,
}: MessageListProps) {
  const labels = resolverLabels(LIST_LABELS, labelsPersonalizadas);
  const ref = useRef<HTMLDivElement>(null);
  const cercaDelFinal = useRef(true);
  const primeraVez = useRef(true);
  const alturaAntesDeCargar = useRef<number | null>(null);
  const [pendientes, setPendientes] = useState(0);

  const irAlFinal = () => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  const alDesplazar = () => {
    const el = ref.current;
    if (!el) return;
    cercaDelFinal.current = isNearBottom(el, umbralCercaDelFinal());
    if (cercaDelFinal.current) setPendientes(0);
  };

  // Sin `ultimaSecuencia`: se desplaza en cada render (comportamiento anterior).
  useEffect(() => {
    if (autoScroll && ultimaSecuencia === undefined) irAlFinal();
  });

  // Con `ultimaSecuencia`: solo se desplaza cuando llega un mensaje nuevo.
  useEffect(() => {
    if (ultimaSecuencia === undefined) return;
    if (primeraVez.current) {
      primeraVez.current = false;
      if (autoScroll) irAlFinal();
      return;
    }
    if (!autoScroll) return;
    if (cercaDelFinal.current || ultimoEsPropio) {
      irAlFinal();
      setPendientes(0);
    } else {
      setPendientes((n) => n + 1);
    }
    // `ultimoEsPropio` solo influye cuando llega un mensaje nuevo, así que no se vigila por separado.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ultimaSecuencia]);

  // Al cargar historia anterior, se conserva la posición visual: se compensa el alto que se agregó arriba.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (loadingPrevious) {
      alturaAntesDeCargar.current = el.scrollHeight;
    } else if (alturaAntesDeCargar.current !== null) {
      el.scrollTop += el.scrollHeight - alturaAntesDeCargar.current;
      alturaAntesDeCargar.current = null;
    }
  }, [loadingPrevious]);

  return (
    <div className={styles.listWrap}>
      <div
        ref={ref}
        className={styles.body}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        onScroll={alDesplazar}
      >
        {hayMas && onCargarAnteriores && (
          <button
            type="button"
            className={styles.dayDivider}
            disabled={loadingPrevious}
            onClick={onCargarAnteriores}
          >
            {loadingPrevious ? labels.loadingPrevious : labels.loadPrevious}
          </button>
        )}
        {loading ? (
          <EsqueletoMensajes />
        ) : empty ? (
          (emptyState ?? <p className={styles.emptyText}>{labels.empty}</p>)
        ) : (
          children
        )}
      </div>
      {pendientes > 0 && (
        <button
          type="button"
          className={styles.newMessages}
          onClick={() => {
            irAlFinal();
            setPendientes(0);
          }}
        >
          {labels.newMessages(pendientes)}
        </button>
      )}
    </div>
  );
}
