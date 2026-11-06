import { useEffect, useRef, type ReactNode } from "react";
import styles from "./MessagePanel.module.css";
import { Avatar } from "./shared";
import { cx, formatSmartTimestamp } from "./utils";
import type { Mensaje } from "./types";

export interface MessageBubbleProps {
  /** Mensaje completo del contrato. Si se pasa, de aquí salen cuerpo, alias y fecha. */
  mensaje?: Mensaje;
  /** Si el mensaje fue enviado por el visor actual. Lo calcula el consumidor (D3). */
  own?: boolean;
  /** Identidad presentada del autor. Sustituye a `mensaje.aliasMostrado`. */
  aliasMostrado?: string;
  /** Marca de tiempo ISO 8601. Se formatea con `formatSmartTimestamp`. */
  creadoEn?: string;
  /** Adjuntos ya resueltos por el consumidor (la librería no descarga bytes). */
  adjuntos?: ReactNode;
  /** Contenido de auditoría (actor real, rol al enviar). Solo se renderiza si se pasa. */
  slotAuditoria?: ReactNode;
  /** Mostrar un avatar al lado de la burbuja. */
  avatar?: { src?: string; name?: string };
  /** Cuerpo del mensaje. Sustituye a `mensaje.cuerpo`. */
  children?: ReactNode;
  /**
   * @deprecated Usar `aliasMostrado`. Se retira en la siguiente beta mayor.
   */
  author?: string;
  /**
   * @deprecated Usar `creadoEn`. Se retira en la siguiente beta mayor.
   */
  time?: string;
}

export function MessageBubble({
  mensaje,
  own = false,
  aliasMostrado,
  creadoEn,
  adjuntos,
  slotAuditoria,
  avatar,
  children,
  author,
  time,
}: MessageBubbleProps) {
  const alias = aliasMostrado ?? mensaje?.aliasMostrado ?? author;
  const cuerpo = children ?? mensaje?.cuerpo;
  const fecha = creadoEn ?? mensaje?.creadoEn;
  const etiquetaFecha = fecha ? formatSmartTimestamp(fecha) : time;

  return (
    <div className={cx(styles.msgRow, own ? styles.own : styles.other)}>
      {avatar && !own && <Avatar src={avatar.src} name={avatar.name} />}
      <div className={styles.bubble}>
        {alias && !own && <span className={styles.author}>{alias}</span>}
        <span>{cuerpo}</span>
        {adjuntos}
        {slotAuditoria}
        {etiquetaFecha && <span className={styles.time}>{etiquetaFecha}</span>}
      </div>
    </div>
  );
}

/** Indicador animado de "escribiendo..." */
export function MessageTypingIndicator({
  author,
  avatar,
}: {
  author?: string;
  avatar?: { src?: string; name?: string };
}) {
  return (
    <div className={cx(styles.msgRow, styles.other)}>
      {avatar && <Avatar src={avatar.src} name={avatar.name} />}
      <div className={styles.bubble}>
        {author && <span className={styles.author}>{author}</span>}
        <div className={styles.typingIndicator}>
          <span className={styles.typingDot}></span>
          <span className={styles.typingDot}></span>
          <span className={styles.typingDot}></span>
        </div>
      </div>
    </div>
  );
}

/** Divisor centrado entre días ("HOY", "AYER", una fecha...). */
export function MessageDayDivider({ children }: { children: ReactNode }) {
  return <div className={styles.dayDivider}>{children}</div>;
}

export interface MessageListProps {
  /** Auto-desplazarse al final. Por defecto: true. */
  autoScroll?: boolean;
  /** Hay mensajes anteriores por pedir (`hay_mas` del contrato). */
  hayMas?: boolean;
  /** Pide la historia anterior. El consumidor llama a la API con `antes_de`. */
  onCargarAnteriores?: () => void;
  /**
   * Secuencia del último mensaje. Si se pasa, el auto-scroll solo ocurre cuando cambia.
   * Si no se pasa, se mantiene el comportamiento anterior (desplazarse en cada render).
   */
  ultimaSecuencia?: number;
  children?: ReactNode;
}

export function MessageList({
  autoScroll = true,
  hayMas = false,
  onCargarAnteriores,
  ultimaSecuencia,
  children,
}: MessageListProps) {
  const ref = useRef<HTMLDivElement>(null);

  const desplazarAlFinal = () => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  // Sin `ultimaSecuencia`: se desplaza en cada render (comportamiento anterior).
  useEffect(() => {
    if (autoScroll && ultimaSecuencia === undefined) desplazarAlFinal();
  });

  // Con `ultimaSecuencia`: solo se desplaza cuando cambia la secuencia.
  useEffect(() => {
    if (autoScroll && ultimaSecuencia !== undefined) desplazarAlFinal();
  }, [autoScroll, ultimaSecuencia]);

  return (
    <div className={styles.body} ref={ref}>
      {hayMas && onCargarAnteriores && (
        <button type="button" className={styles.dayDivider} onClick={onCargarAnteriores}>
          Cargar mensajes anteriores
        </button>
      )}
      {children}
    </div>
  );
}
