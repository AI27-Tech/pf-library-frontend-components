import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import styles from "./Input.module.css";
import { cx, type InputSize } from "./utils";

export type InputState = "error" | "warning" | "success" | undefined;

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Tamaño de la entrada. */
  size?: InputSize;
  /** Estado de validación del campo: error (rojo), warning (naranja), success (verde). */
  state?: InputState;
  /** Marca el campo como inválido (también establece aria-invalid). Deprecated: usar `state="error"` en su lugar. */
  invalid?: boolean;
  /** Contenido renderizado antes del texto (icono, prefijo). */
  startAdornment?: ReactNode;
  /** Contenido renderizado después del texto (icono, sufijo, acción). */
  endAdornment?: ReactNode;
  /** Ref reenviado al elemento de entrada subyacente. */
  inputRef?: Ref<HTMLInputElement>;
}

export function Input({
  size = "md",
  state,
  invalid = false,
  startAdornment,
  endAdornment,
  disabled,
  className,
  inputRef,
  ...props
}: InputProps) {
  // Mapear `invalid` prop a `state` para retrocompatibilidad
  const effectiveState = invalid ? "error" : state;

  return (
    <div
      className={cx(
        styles.field,
        styles[size],
        effectiveState && styles[effectiveState],
        disabled && styles.disabled,
        className,
      )}
      data-size={size}
      data-state={effectiveState}
    >
      {startAdornment && (
        <span className={styles.adornment} aria-hidden="true">
          {startAdornment}
        </span>
      )}
      <input
        ref={inputRef}
        className={styles.control}
        disabled={disabled}
        aria-invalid={effectiveState === "error" || undefined}
        {...props}
      />
      {endAdornment && (
        <span className={styles.adornment}>{endAdornment}</span>
      )}
    </div>
  );
}
