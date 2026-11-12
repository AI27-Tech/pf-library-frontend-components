import {
  useId,
  cloneElement,
  isValidElement,
  type ReactNode,
  type ReactElement,
} from "react";
import styles from "./FormField.module.css";
import { cx } from "./utils";

export interface FormFieldProps {
  /** Field label. */
  label?: ReactNode;
  /** Helper text shown below the control. */
  helpText?: ReactNode;
  /** Error message. When set, the field is treated as invalid. */
  error?: ReactNode;
  /** Marks the field as required (adds an asterisk). */
  required?: boolean;
  /** Muestra "(opcional)" junto a la etiqueta de los campos no requeridos. Por defecto: false. */
  showOptional?: boolean;
  /** Disposición: `vertical` (etiqueta arriba) u `horizontal` (etiqueta a la izquierda). Por defecto: "vertical". */
  orientation?: "vertical" | "horizontal";
  /** Explicit id for the control. Auto-generated if omitted. */
  htmlFor?: string;
  className?: string;
  /**
   * The control element (Input, Select, Textarea, etc.).
   * Its `id`, `aria-describedby` and `invalid` props are wired automatically
   * when it is a single valid element.
   */
  children: ReactNode;
}

// Props we try to inject into the child control for accessibility wiring.
interface InjectableProps {
  id?: string;
  invalid?: boolean;
  "aria-describedby"?: string;
}

export function FormField({
  label,
  helpText,
  error,
  required = false,
  showOptional = false,
  orientation = "vertical",
  htmlFor,
  className,
  children,
}: FormFieldProps) {
  const generatedId = useId();
  const controlId = htmlFor ?? generatedId;
  const helpId = `${controlId}-help`;
  const errorId = `${controlId}-error`;
  const describedBy =
    [error ? errorId : null, helpText ? helpId : null].filter(Boolean).join(" ") ||
    undefined;

  let control = children;
  if (isValidElement(children)) {
    const child = children as ReactElement<InjectableProps>;
    control = cloneElement(child, {
      id: child.props.id ?? controlId,
      invalid: child.props.invalid ?? Boolean(error),
      "aria-describedby":
        [child.props["aria-describedby"], describedBy]
          .filter(Boolean)
          .join(" ") || undefined,
    });
  }

  return (
    <div className={cx(styles.field, orientation === "horizontal" && styles.horizontal, className)}>
      {label && (
        <label className={styles.label} htmlFor={controlId}>
          {label}
          {required && (
            <span className={styles.required} aria-hidden="true">
              *
            </span>
          )}
          {!required && showOptional && <span className={styles.optional}> (opcional)</span>}
        </label>
      )}
      {control}
      {error ? (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      ) : (
        helpText && (
          <span id={helpId} className={styles.help}>
            {helpText}
          </span>
        )
      )}
    </div>
  );
}
