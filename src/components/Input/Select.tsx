import type { SelectHTMLAttributes, ReactNode, Ref } from "react";
import styles from "./Input.module.css";
import { cx, type InputSize } from "./utils";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size" | "children"> {
  /** Size of the select. */
  size?: InputSize;
  /** Marks the field as invalid (also sets aria-invalid). */
  invalid?: boolean;
  /** Options to render. Alternatively, pass <option> children. */
  options?: SelectOption[];
  /** Placeholder shown as a disabled first option. */
  placeholder?: string;
  /** Custom option children (overrides `options`). */
  children?: ReactNode;
  /** Ref forwarded to the underlying select element. */
  selectRef?: Ref<HTMLSelectElement>;
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function Select({
  size = "md",
  invalid = false,
  options,
  placeholder,
  disabled,
  className,
  selectRef,
  children,
  value,
  defaultValue,
  ...props
}: SelectProps) {
  const hasControlledValue = value !== undefined;
  return (
    <div
      className={cx(
        styles.field,
        styles.select,
        styles[size],
        invalid && styles.invalid,
        disabled && styles.disabled,
        className,
      )}
      data-size={size}
    >
      <select
        ref={selectRef}
        className={styles.control}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        value={value}
        defaultValue={
          defaultValue ?? (placeholder && !hasControlledValue ? "" : undefined)
        }
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children ??
          options?.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
      </select>
      <span className={cx(styles.adornment, styles.selectArrow)} aria-hidden="true">
        <ChevronIcon />
      </span>
    </div>
  );
}
