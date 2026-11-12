import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx";
import styles from "./EmptyState.module.css";

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Icono decorativo sobre el título. */
  icon?: ReactNode;
  /** Título corto de lo que falta. */
  title: ReactNode;
  /** Explicación y, si aplica, qué hacer a continuación. */
  description?: ReactNode;
  /** Acción principal, normalmente un `Button`. */
  action?: ReactNode;
  /** Tamaño. Por defecto: "md". */
  size?: "sm" | "md";
}

/** Estado vacío: icono, título, descripción y una acción opcional. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  size = "md",
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div className={cx(styles.emptyState, styles[size], className)} {...props}>
      {icon && <div className={styles.icon} aria-hidden="true">{icon}</div>}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
