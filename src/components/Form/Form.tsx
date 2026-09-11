import type { FormHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import styles from "./Form.module.css";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

/**
 * Layout wrapper for forms. Agnostic about state management — works with
 * controlled inputs, React Hook Form, or plain uncontrolled forms.
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
  /** Section title, rendered as a legend. */
  title?: ReactNode;
  /** Optional description below the title. */
  description?: ReactNode;
}

/** Groups related fields with an optional title and description. */
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
  /** Number of columns on wide screens. Default: 2. */
  columns?: number;
}

/** Lays out multiple fields side by side, stacking on small screens. */
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
  /** Horizontal alignment of the actions. Default: "end". */
  align?: "start" | "end" | "between" | "center";
}

/** Action bar for submit / cancel buttons. */
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
