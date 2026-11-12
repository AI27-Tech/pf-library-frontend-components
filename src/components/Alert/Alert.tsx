import type { HTMLAttributes, ReactNode } from "react";
import { CircleCheck, CircleX, Info, TriangleAlert, X } from "lucide-react";
import { cx } from "../../utils/cx";
import styles from "./Alert.module.css";

export type AlertVariant = "info" | "success" | "warning" | "danger";

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Tono del mensaje. Por defecto: "info". */
  variant?: AlertVariant;
  /** Título corto. */
  title?: ReactNode;
  /** Cuerpo del mensaje. */
  children?: ReactNode;
  /** Icono que reemplaza al de la variante. */
  icon?: ReactNode;
  /** Muestra un botón de cierre y se llama al pulsarlo. Omitir para ocultarlo. */
  onDismiss?: () => void;
}

const DEFAULT_ICON: Record<AlertVariant, ReactNode> = {
  info: <Info />,
  success: <CircleCheck />,
  warning: <TriangleAlert />,
  danger: <CircleX />,
};

/**
 * Mensaje de estado en línea. `warning` y `danger` usan `role="alert"` (se anuncian de inmediato).
 * `info` y `success` usan `role="status"`.
 */
export function Alert({
  variant = "info",
  title,
  children,
  icon,
  onDismiss,
  className,
  ...props
}: AlertProps) {
  const urgent = variant === "warning" || variant === "danger";

  return (
    <div
      role={urgent ? "alert" : "status"}
      className={cx(styles.alert, styles[variant], className)}
      {...props}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon ?? DEFAULT_ICON[variant]}
      </span>

      <div className={styles.content}>
        {title && <p className={styles.title}>{title}</p>}
        {children && <div className={styles.body}>{children}</div>}
      </div>

      {onDismiss && (
        <button type="button" className={styles.close} aria-label="Cerrar" onClick={onDismiss}>
          <X aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
