import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import styles from "./Input.module.css";
import { cx, type InputSize } from "./utils";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Size of the input. */
  size?: InputSize;
  /** Marks the field as invalid (also sets aria-invalid). */
  invalid?: boolean;
  /** Content rendered before the text (icon, prefix). */
  startAdornment?: ReactNode;
  /** Content rendered after the text (icon, suffix, action). */
  endAdornment?: ReactNode;
  /** Ref forwarded to the underlying input element. */
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
