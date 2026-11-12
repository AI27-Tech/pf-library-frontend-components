import { Check } from "lucide-react";
import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import styles from "./Choice.module.css";
import { cx, type InputSize } from "./utils";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Label rendered next to the checkbox. */
  label?: ReactNode;
  /** Ref forwarded to the underlying input element. */
  inputRef?: Ref<HTMLInputElement>;
  /** Tamaño del control. Por defecto: "md". */
  size?: InputSize;
  /** Marca el control como inválido (aria-invalid y borde de error). */
  invalid?: boolean;
}

export function Checkbox({
  label,
  disabled,
  className,
  inputRef,
  size = "md",
  invalid = false,
  ...props
}: CheckboxProps) {
  return (
    <label
      className={cx(
        styles.choice,
        styles.checkbox,
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
        className={styles.nativeInput}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        {...props}
      />
      <span className={styles.box} aria-hidden="true">
        <Check strokeWidth={3} />
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}
