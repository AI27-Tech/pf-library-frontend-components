import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import styles from "./Choice.module.css";
import { cx } from "./utils";

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Label rendered next to the radio. */
  label?: ReactNode;
  /** Ref forwarded to the underlying input element. */
  inputRef?: Ref<HTMLInputElement>;
}

export function Radio({
  label,
  disabled,
  className,
  inputRef,
  ...props
}: RadioProps) {
  return (
    <label className={cx(styles.choice, styles.radio, disabled && styles.disabled, className)}>
      <input
        ref={inputRef}
        type="radio"
        className={styles.nativeInput}
        disabled={disabled}
        {...props}
      />
      <span className={styles.box} aria-hidden="true">
        <span className={styles.radioDot} />
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}
