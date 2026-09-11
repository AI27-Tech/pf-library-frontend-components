import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import styles from "./Choice.module.css";
import { cx } from "./utils";

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Label rendered next to the switch. */
  label?: ReactNode;
  /** Ref forwarded to the underlying input element. */
  inputRef?: Ref<HTMLInputElement>;
}

export function Switch({
  label,
  disabled,
  className,
  inputRef,
  ...props
}: SwitchProps) {
  return (
    <label className={cx(styles.choice, styles.switch, disabled && styles.disabled, className)}>
      <input
        ref={inputRef}
        type="checkbox"
        role="switch"
        className={styles.nativeInput}
        disabled={disabled}
        {...props}
      />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}
