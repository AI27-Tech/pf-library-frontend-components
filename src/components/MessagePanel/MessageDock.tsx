import { useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ChevronUp, Minus } from "lucide-react";
import styles from "./MessagePanel.module.css";
import { Avatar, IconButton } from "./shared";
import { DOCK_LABELS, resolverLabels, type DockLabels } from "./labels";
import { Badge } from "../Badge";
import { Popover } from "../Popover";
import { cx, formatFechaHora } from "./utils";

export interface MessageDockProps {
  /** La barra principal de "Mensajería" (usualmente un `MessageDockBar`). */
  bar?: ReactNode;
  /** Paneles de conversación abiertos (elementos `MessagePanel`). */
  children?: ReactNode;
  /** Contenido del chip "+N": las conversaciones que no caben en pantalla. */
  overflow?: ReactNode;
  /** Número de conversaciones en overflow. Con valor mayor que cero aparece el chip. */
  overflowCount?: number;
  /** Textos del muelle en español. */
  labels?: Partial<DockLabels>;
  className?: string;
}

/**
 * Muelle fijo en la esquina inferior derecha, en portal a `document.body`.
 * Contiene la barra principal y los paneles abiertos; lo que no cabe se agrupa en un chip "+N".
 */
export function MessageDock({ bar, children, overflow, overflowCount = 0, labels: labelsPersonalizadas, className }: MessageDockProps) {
  const labels = resolverLabels(DOCK_LABELS, labelsPersonalizadas);
  const [overflowAbierto, setOverflowAbierto] = useState(false);
  const anclaRef = useRef<HTMLButtonElement>(null);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className={cx(styles.dock, className)} role="region" aria-label={labels.dock}>
      <div className={styles.panels}>
        {children}
        {overflowCount > 0 && (
          <>
            <button
              ref={anclaRef}
              type="button"
              className={styles.overflowChip}
              aria-label={`${labels.overflow} (${overflowCount})`}
              aria-expanded={overflowAbierto}
              onClick={() => setOverflowAbierto((v) => !v)}
            >
              +{overflowCount}
            </button>
            <Popover
              anchorRef={anclaRef}
              open={overflowAbierto}
              onClose={() => setOverflowAbierto(false)}
              position="top"
              align="end"
            >
              <div className={styles.overflowList}>{overflow}</div>
            </Popover>
          </>
        )}
      </div>
      {bar && <div className={styles.bar}>{bar}</div>}
    </div>,
    document.body,
  );
}

export interface DockConversation {
  /** Identificador de la fila en la lista. */
  id: string;
  /** Id de la conversación del contrato. Si falta, se usa `id`. */
  conversacionId?: string;
  name: string;
  /** Vista previa del último mensaje. Opcional: el consumidor decide si la muestra. */
  preview?: string;
  /** Marca de tiempo ISO 8601 del último mensaje. */
  lastMessageAt?: string;
  avatar?: { src?: string; name?: string };
  unread?: boolean;
  /** Insignia opcional a la derecha de la fila (por ejemplo, un estado). */
  badge?: ReactNode;
}

export interface MessageDockBarProps {
  /** Título de la barra. Por defecto: "Mensajería". */
  title?: ReactNode;
  /** Si la lista de conversaciones está expandida. */
  open?: boolean;
  /** Alternar la lista abierta o cerrada. */
  onToggle?: () => void;
  /** Número de conversaciones no leídas, mostrado como insignia. */
  unreadCount?: number;
  /** Conversaciones mostradas cuando la barra está expandida. */
  conversations?: DockConversation[];
  /** Llamado con `conversacionId` (o `id` si no existe) al elegir una conversación. */
  onSelect?: (id: string) => void;
  /** Contenido personalizado en lugar de la lista integrada. */
  children?: ReactNode;
  /** Textos de la barra en español. */
  labels?: Partial<DockLabels>;
}

export function MessageDockBar({
  title,
  open = false,
  onToggle,
  unreadCount,
  conversations,
  onSelect,
  children,
  labels: labelsPersonalizadas,
}: MessageDockBarProps) {
  const labels = resolverLabels(DOCK_LABELS, labelsPersonalizadas);
  const listaId = useId();
  const tituloMostrado = title ?? labels.title;

  return (
    <section className={cx(styles.surface, styles.barSurface)} aria-label={labels.barLabel}>
      <div className={cx(styles.header, open && styles.expanded)}>
        <button
          type="button"
          className={styles.headerMain}
          aria-expanded={open}
          aria-controls={listaId}
          onClick={onToggle}
        >
          <span className={styles.headerText}>
            <span className={styles.name}>{tituloMostrado}</span>
          </span>
          {unreadCount != null && unreadCount > 0 && <Badge variant="escort" pill>{unreadCount}</Badge>}
        </button>
        <span className={styles.headerActions}>
          <IconButton label={open ? labels.minimize : labels.expand} onClick={onToggle}>
            {open ? <Minus /> : <ChevronUp />}
          </IconButton>
        </span>
      </div>

      <div id={listaId} className={styles.convoList} hidden={!open}>
        {open &&
          (children ??
            conversations?.map((c) => (
              <div key={c.id} className={styles.convoRow}>
                <button
                  type="button"
                  className={styles.convoItem}
                  onClick={() => onSelect?.(c.conversacionId ?? c.id)}
                >
                  <Avatar src={c.avatar?.src} name={c.avatar?.name ?? c.name} />
                  <span className={styles.convoText}>
                    <span className={styles.convoName}>{c.name}</span>
                    {c.preview && <span className={styles.convoPreview}>{c.preview}</span>}
                  </span>
                  {c.lastMessageAt && <span className={styles.convoTime}>{formatFechaHora(c.lastMessageAt)}</span>}
                  {c.unread && <span className={styles.unread} role="img" aria-label={labels.unread} />}
                </button>
                {c.badge}
              </div>
            )))}
      </div>
    </section>
  );
}
