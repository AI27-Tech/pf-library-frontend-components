import type { FormHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import styles from "./Form.module.css";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

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
}

/** Agrupa campos relacionados con un título y descripción opcionales. */
export function FormSection({
  title,
  description,
  className,
  children,
  ...props
}: FormSectionProps) {
  return (
    <fieldset className={cx(styles.section, className)} {...props}>
      {title && <legend className={styles.legend}>{title}</legend>}
      {description && <p className={styles.sectionDescription}>{description}</p>}
      {children}
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
}

/** Barra de acciones para botones de envío / cancelación. */
export function FormActions({
  align = "end",
  className,
  children,
  ...props
}: FormActionsProps) {
  return (
    <div className={cx(styles.actions, styles[`align-${align}`], className)} {...props}>
      {children}
    </div>
  );
}
