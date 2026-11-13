import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import styles from "./Choice.module.css";
import { cx, type InputSize } from "./utils";

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Label rendered next to the switch. */
  label?: ReactNode;
  /** Ref forwarded to the underlying input element. */
  inputRef?: Ref<HTMLInputElement>;
  /** Tamaño del control. Por defecto: "md". */
  size?: InputSize;
  /** Marca el control como inválido (aria-invalid y borde de error). */
  invalid?: boolean;
}

export function Switch({
  label,
  disabled,
  className,
  inputRef,
  size = "md",
  invalid = false,
  ...props
}: SwitchProps) {
  return (
    <label
      className={cx(
        styles.choice,
        styles.switch,
        size === "sm" && styles.sizeSm,
        size === "lg" && styles.sizeLg,
        invalid && styles.invalid,
        disabled && styles.disabled,
        className,
      )}
    >
      <input
        ref={inputRef}
        type="checkbox"
        role="switch"
        className={styles.nativeInput}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        {...props}
      />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}
