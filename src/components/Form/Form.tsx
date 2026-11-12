import { useId, useState, type FormHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import styles from "./Form.module.css";
import { cx } from "../Input/utils";

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

/**
 * Envolvedor de diseño para formularios. Agnóstico respecto a la gestión del estado — funciona con
 * inputs controlados, React Hook Form, o formularios sin control simples.
 */
export function Form({ className, children, ...props }: FormProps) {
  return (
    <form className={cx(styles.form, className)} {...props}>
      {children}
    </form>
  );
}

export interface FormSectionProps
  extends Omit<HTMLAttributes<HTMLFieldSetElement>, "title"> {
  /** Título de la sección, renderizado como una leyenda. */
  title?: ReactNode;
  /** Descripción opcional debajo del título. */
  description?: ReactNode;
  /** Permite plegar y desplegar el contenido desde el título. Por defecto: false. */
  collapsible?: boolean;
  /** Estado inicial cuando `collapsible` está activo y no se controla con `open`. Por defecto: true. */
  defaultOpen?: boolean;
  /** Estado abierto controlado. Activa el modo controlado. */
  open?: boolean;
  /** Se llama al plegar o desplegar la sección. */
  onOpenChange?: (open: boolean) => void;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={cx(styles.chevron, open && styles.chevronOpen)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/** Agrupa campos relacionados con un título y descripción opcionales. */
export function FormSection({
  title,
  description,
  collapsible = false,
  defaultOpen = true,
  open,
  onOpenChange,
  className,
  children,
  ...props
}: FormSectionProps) {
  const contentId = `${useId()}-contenido`;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = open ?? internalOpen;

  function toggle() {
    const next = !isOpen;
    if (open === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  }

  return (
    <fieldset className={cx(styles.section, className)} {...props}>
      {title && (
        <legend className={styles.legend}>
          {collapsible ? (
            <button
              type="button"
              className={styles.trigger}
              aria-expanded={isOpen}
              aria-controls={contentId}
              onClick={toggle}
            >
              {title}
              <ChevronIcon open={isOpen} />
            </button>
          ) : (
            title
          )}
        </legend>
      )}
      {description && <p className={styles.sectionDescription}>{description}</p>}
      {collapsible ? (
        <div id={contentId} hidden={!isOpen} className={styles.content}>
          {children}
        </div>
      ) : (
        children
      )}
    </fieldset>
  );
}

export interface FormRowProps extends HTMLAttributes<HTMLDivElement> {
  /** Número de columnas en pantallas amplias. Por defecto: 2. */
  columns?: number;
}

/** Distribuye múltiples campos lado a lado, apilándose en pantallas pequeñas. */
export function FormRow({
  columns = 2,
  className,
  children,
  style,
  ...props
}: FormRowProps) {
  return (
    <div
      className={cx(styles.row, className)}
      style={{ ["--form-row-cols" as string]: columns, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

export interface FormActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** Alineación horizontal de las acciones. Por defecto: "end". */
  align?: "start" | "end" | "between" | "center";
  /** Fija la barra al fondo del área visible mientras se desplaza el formulario. Por defecto: false. */
  sticky?: boolean;
}

/** Barra de acciones para botones de envío / cancelación. */
export function FormActions({
  align = "end",
  sticky = false,
  className,
  children,
  ...props
}: FormActionsProps) {
  return (
    <div
      className={cx(
        styles.actions,
        styles[`align-${align}`],
        sticky && styles.sticky,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
