import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import styles from "./Choice.module.css";
import { cx } from "./utils";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Label rendered next to the checkbox. */
  label?: ReactNode;
  /** Ref forwarded to the underlying input element. */
  inputRef?: Ref<HTMLInputElement>;
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function Checkbox({
  label,
  disabled,
  className,
  inputRef,
  ...props
}: CheckboxProps) {
  return (
    <label className={cx(styles.choice, styles.checkbox, disabled && styles.disabled, className)}>
      <input
        ref={inputRef}
        type="checkbox"
        className={styles.nativeInput}
        disabled={disabled}
        {...props}
      />
      <span className={styles.box} aria-hidden="true">
        <CheckIcon />
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}
