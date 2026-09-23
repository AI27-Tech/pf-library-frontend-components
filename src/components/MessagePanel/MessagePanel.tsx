import type { ReactNode } from "react";
import styles from "./MessagePanel.module.css";
import {
  Avatar,
  IconButton,
  MinimizeIcon,
  ExpandIcon,
  CloseIcon,
} from "./shared";
import { cx, type Presence } from "./utils";

export interface MessagePanelProps {
  /** Nombre del compañero de conversación / grupo. */
  name: ReactNode;
  /** Línea secundaria bajo el nombre (por ejemplo "Activo ahora"). */
  subtitle?: ReactNode;
  /** Avatar del compañero. */
  avatar?: { src?: string; name?: string };
  /** Punto de presencia en el avatar. */
  presence?: Presence;
  /** Si el panel está expandido. Cuando es falso se contrae a la barra de encabezado. */
  open?: boolean;
  /** Llamado cuando se hace clic en el encabezado (alternar minimizar/expandir). */
  onToggle?: () => void;
  /** Llamado cuando se hace clic en el botón de cerrar. Omitir para ocultar el botón. */
  onClose?: () => void;
  /** Contenido de la lista de mensajes (MessageList con elementos hijos MessageBubble). */
  children?: ReactNode;
  /** Compositor renderizado en la parte inferior (usualmente un MessageComposer). */
  composer?: ReactNode;
  className?: string;
}

export function MessagePanel({
  name,
  subtitle,
  avatar,
  presence,
  open = true,
  onToggle,
  onClose,
  children,
  composer,
  className,
}: MessagePanelProps) {
  return (
    <section className={cx(styles.surface, className)} aria-label={typeof name === "string" ? name : "Conversation"}>
      <button
        type="button"
        className={cx(styles.header, open && styles.expanded)}
        onClick={onToggle}
        aria-expanded={open}
      >
        {avatar && <Avatar src={avatar.src} name={avatar.name} presence={presence} />}
        <span className={styles.headerTitle}>
          <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            <span className={styles.name}>{name}</span>
            {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
          </span>
        </span>
        <span className={styles.headerActions}>
          <IconButton label={open ? "Minimize" : "Expand"} onClick={onToggle}>
            {open ? <MinimizeIcon /> : <ExpandIcon />}
          </IconButton>
          {onClose && (
            <IconButton label="Close conversation" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
        </span>
      </button>

      {open && (
        <>
          {children}
          {composer}
        </>
      )}
    </section>
  );
}
