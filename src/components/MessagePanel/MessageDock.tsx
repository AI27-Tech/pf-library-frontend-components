import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "./MessagePanel.module.css";
import {
  Avatar,
  IconButton,
  MinimizeIcon,
  ExpandIcon,
} from "./shared";
import { cx } from "./utils";
import { Badge } from "../Badge";

export interface MessageDockProps {
  /** La barra principal de "Mensajería" (usualmente un MessageDockBar). */
  bar?: ReactNode;
  /** Paneles de conversación abiertos (elementos MessagePanel). */
  children?: ReactNode;
  className?: string;
}

/**
 * Fila fija, renderizada en portal anclada en la parte inferior derecha que contiene la barra principal
 * de mensajería más cualquier panel de conversación abierto, estilo LinkedIn.
 */
export function MessageDock({ bar, children, className }: MessageDockProps) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className={cx(styles.dock, className)} aria-label="Messaging" role="region">
      <div className={styles.panels}>{children}</div>
      {bar && <div className={styles.bar}>{bar}</div>}
    </div>,
    document.body,
  );
}

export interface DockConversation {
  id: string;
  name: string;
  preview?: string;
  avatar?: { src?: string; name?: string };
  unread?: boolean;
}

export interface MessageDockBarProps {
  /** Título de la barra. Por defecto: "Mensajería". */
  title?: ReactNode;
  /** Si la lista de conversación está expandida. */
  open?: boolean;
  /** Alternar la lista abierta/cerrada. */
  onToggle?: () => void;
  /** Número de conversaciones no leídas, mostrado como una insignia. */
  unreadCount?: number;
  /** Conversaciones mostradas cuando está expandida. */
  conversations?: DockConversation[];
  /** Llamado cuando se selecciona una conversación de la lista. */
  onSelect?: (id: string) => void;
  /** Contenido personalizado en lugar de la lista de conversación integrada. */
  children?: ReactNode;
}

export function MessageDockBar({
  title = "Messaging",
  open = false,
  onToggle,
  unreadCount,
  conversations,
  onSelect,
  children,
}: MessageDockBarProps) {
  return (
    <section className={cx(styles.surface, styles.barSurface)} aria-label="Messaging">
      <button
        type="button"
        className={cx(styles.header, open && styles.expanded)}
        onClick={onToggle}
        aria-expanded={open}
      >
        <span className={styles.headerTitle}>
          <span className={styles.name}>{title}</span>
          {unreadCount != null && unreadCount > 0 && (
            <Badge variant="escort" pill>
              {unreadCount}
            </Badge>
          )}
        </span>
        <span className={styles.headerActions}>
          <IconButton label={open ? "Minimize" : "Expand"} onClick={onToggle}>
            {open ? <MinimizeIcon /> : <ExpandIcon />}
          </IconButton>
        </span>
      </button>

      {open && (
        <div className={styles.convoList}>
          {children ??
            conversations?.map((c) => (
              <button
                key={c.id}
                type="button"
                className={styles.convoItem}
                onClick={() => onSelect?.(c.id)}
              >
                <Avatar src={c.avatar?.src} name={c.avatar?.name ?? c.name} />
                <span className={styles.convoText}>
                  <span className={styles.convoName}>{c.name}</span>
                  {c.preview && <span className={styles.convoPreview}>{c.preview}</span>}
                </span>
                {c.unread && <span className={styles.unread} aria-label="Unread" />}
              </button>
            ))}
        </div>
      )}
    </section>
  );
}
