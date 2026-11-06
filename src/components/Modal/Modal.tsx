import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

export type ModalSize = "sm" | "md" | "lg";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface ModalProps {
  /** Controla la visibilidad. */
  open: boolean;
  /** Llamado cuando el usuario solicita cerrar (Escape, clic en overlay, botón de cerrar). */
  onClose: () => void;
  /** Título mostrado en el encabezado. Omitir para ocultar el encabezado predeterminado. */
  title?: ReactNode;
  /** Contenido del modal. */
  children?: ReactNode;
  /** Contenido del pie, típicamente botones de acción. */
  footer?: ReactNode;
  /** Preset de ancho máximo. */
  size?: ModalSize;
  /** Cerrar al hacer clic en el overlay. Por defecto: true. */
  closeOnOverlayClick?: boolean;
  /** Cerrar al presionar Escape. Por defecto: true. */
  closeOnEsc?: boolean;
  /** Mostrar el botón de cerrar (×) en el encabezado. Por defecto: true. */
  showCloseButton?: boolean;
  /** Clase adicional para el elemento de diálogo. */
  className?: string;
  /** Etiqueta de accesibilidad cuando no hay título visible. */
  "aria-label"?: string;
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  className,
  "aria-label": ariaLabel,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();

  // Escape to close + focus trap.
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && closeOnEsc) {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusables = Array.from(
          dialog.querySelectorAll<HTMLElement>(FOCUSABLE),
        );
        if (focusables.length === 0) {
          e.preventDefault();
          dialog.focus();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [open, closeOnEsc, onClose]);

  // Lock body scroll and manage focus while open.
  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    // Move focus into the dialog.
    const dialog = dialogRef.current;
    const firstFocusable = dialog?.querySelector<HTMLElement>(FOCUSABLE);
    (firstFocusable ?? dialog)?.focus();

    return () => {
      document.body.style.overflow = overflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  const handleOverlayMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className={styles.overlay} onMouseDown={handleOverlayMouseDown}>
      <div
        ref={dialogRef}
        className={cx(styles.dialog, styles[size], className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={!title ? ariaLabel : undefined}
        tabIndex={-1}
      >
        {(title || showCloseButton) && (
          <div className={styles.header}>
            {title && (
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                className={styles.close}
                onClick={onClose}
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        )}
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
