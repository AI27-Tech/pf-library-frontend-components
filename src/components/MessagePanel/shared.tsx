import type { ReactNode } from "react";
import styles from "./MessagePanel.module.css";
import { cx, initials, type Presence } from "./utils";

export interface AvatarProps {
  /** URL de la imagen. Cuando está ausente, se muestran las iniciales. */
  src?: string;
  /** Nombre completo, usado para alt text e iniciales como respaldo. */
  name?: string;
  /** Punto de presencia. Omitir para ocultarlo. */
  presence?: Presence;
}

export function Avatar({ src, name, presence }: AvatarProps) {
  return (
    <span className={styles.avatar}>
      {src ? <img src={src} alt={name ?? ""} /> : initials(name)}
      {presence && (
        <span
          className={cx(styles.presence, presence === "online" && styles.online)}
          aria-label={presence === "online" ? "En línea" : "Desconectado"}
        />
      )}
    </span>
  );
}

export function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: (e: React.MouseEvent) => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={styles.iconBtn}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
    >
      {children}
    </button>
  );
}

export function MinimizeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M5 12h14" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 15l-6-6-6 6" />
    </svg>
  );
}

export function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
    </svg>
  );
}
