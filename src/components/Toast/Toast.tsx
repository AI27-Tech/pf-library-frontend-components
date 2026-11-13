import { CircleCheck, CircleX, Info, TriangleAlert, X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "./Toast.module.css";

export type ToastVariant = "info" | "success" | "warning" | "error";

export type ToastPosition =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left"
  | "top-center"
  | "bottom-center";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface ToastProps {
  /** Severidad, impulsa el color de acento e icono predeterminado. */
  variant?: ToastVariant;
  /** Línea de título en negrita. */
  title?: ReactNode;
  /** Mensaje de apoyo. */
  children?: ReactNode;
  /** Acciones en línea (por ejemplo, botones de CTA). */
  actions?: ReactNode;
  /** Llamado cuando el toast solicita cerrar (botón cerrar o auto-cierre). */
  onClose?: () => void;
  /** Retraso de auto-cierre en ms. 0 o undefined lo deshabilita. */
  duration?: number;
  /** Mostrar el botón de cerrar. Por defecto: true. */
  dismissible?: boolean;
  /** Anular el icono inicial. Pasar null para ocultarlo. */
  icon?: ReactNode | null;
  className?: string;
}

const icons: Record<ToastVariant, ReactNode> = {
  info: <Info />,
  success: <CircleCheck />,
  warning: <TriangleAlert />,
  error: <CircleX />,
};

export function Toast({
  variant = "info",
  title,
  children,
  actions,
  onClose,
  duration,
  dismissible = true,
  icon,
  className,
}: ToastProps) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!duration || duration <= 0) return;
    const id = window.setTimeout(() => onCloseRef.current?.(), duration);
    return () => window.clearTimeout(id);
  }, [duration]);

  const resolvedIcon = icon === undefined ? icons[variant] : icon;

  return (
    <div
      className={cx(styles.toast, styles[variant], className)}
      role={variant === "error" || variant === "warning" ? "alert" : "status"}
      aria-live={variant === "error" || variant === "warning" ? "assertive" : "polite"}
    >
      {resolvedIcon && (
        <span className={styles.icon} aria-hidden="true">
          {resolvedIcon}
        </span>
      )}
      <div className={styles.content}>
        {title && <div className={styles.title}>{title}</div>}
        {children && <div className={styles.message}>{children}</div>}
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      {dismissible && onClose && (
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Descartar"
        >
          <X />
        </button>
      )}
    </div>
  );
}

export interface ToastContainerProps {
  /** Corner of the viewport. Default: "bottom-right". */
  position?: ToastPosition;
  /** Los toasts a renderizar (usualmente elementos <Toast>). */
  children?: ReactNode;
  className?: string;
}

/**
 * Región fija, renderizada en portal que apila toasts en una esquina de la ventana gráfica.
 * Mantén la lista de toasts en tu propio estado y renderiza elementos hijos <Toast>.
 */
export function ToastContainer({
  position = "bottom-right",
  children,
  className,
}: ToastContainerProps) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={cx(styles.container, styles[position], className)}
      role="region"
      aria-label="Notifications"
    >
      {children}
    </div>,
    document.body,
  );
}
