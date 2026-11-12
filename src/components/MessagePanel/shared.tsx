import { ChevronUp, Minus, Send, X } from "lucide-react";
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
  return (<Minus />
  );
}

export function CloseIcon() {
  return (<X />
  );
}

export function ExpandIcon() {
  return (<ChevronUp />
  );
}

export function SendIcon() {
  return (<Send />
  );
}
