import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import styles from "./Input.module.css";
import { cx, type InputSize } from "./utils";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Tamaño de la entrada. */
  size?: InputSize;
  /** Marca el campo como inválido (también establece aria-invalid). */
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
  invalid = false,
  startAdornment,
  endAdornment,
  disabled,
  className,
  inputRef,
  ...props
}: InputProps) {
  return (
    <div
      className={cx(
        styles.field,
        styles[size],
        invalid && styles.invalid,
        disabled && styles.disabled,
        className,
      )}
      data-size={size}
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
        aria-invalid={invalid || undefined}
        {...props}
      />
      {endAdornment && (
        <span className={styles.adornment}>{endAdornment}</span>
      )}
    </div>
  );
}
