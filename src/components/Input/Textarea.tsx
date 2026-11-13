import { useState, type Ref, type TextareaHTMLAttributes } from "react";
import styles from "./Input.module.css";
import { cx, type InputSize } from "./utils";
import type { InputState } from "./Input";

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  /** Size of the textarea. */
  size?: InputSize;
  /** Marks the field as invalid (also sets aria-invalid). Equivale a `state="error"`. */
  invalid?: boolean;
  /** Estado de validación: error (rojo), warning (naranja), success (verde). */
  state?: InputState;
  /** Muestra el contador de caracteres. Si hay `maxLength`, muestra `actual/máximo`. */
  showCount?: boolean;
  /** Ref forwarded to the underlying textarea element. */
  textareaRef?: Ref<HTMLTextAreaElement>;
}

export function Textarea({
  size = "md",
  invalid = false,
  state,
  showCount = false,
  disabled,
  readOnly,
  className,
  textareaRef,
  rows = 3,
  maxLength,
  value,
  defaultValue,
  onChange,
  ...props
}: TextareaProps) {
  const effectiveState = invalid ? "error" : state;
  // Contador en modo no controlado: se actualiza con cada cambio.
  const [uncontrolledLength, setUncontrolledLength] = useState(String(defaultValue ?? "").length);
  const currentLength = typeof value === "string" ? value.length : uncontrolledLength;

  const stateClass =
    effectiveState === "error"
      ? styles.invalid
      : effectiveState === "warning"
        ? styles.warning
        : effectiveState === "success"
          ? styles.success
          : undefined;

  return (
    <>
      <div
        className={cx(
          styles.field,
          styles.textarea,
          styles[size],
          stateClass,
          disabled && styles.disabled,
          readOnly && styles.readOnly,
          className,
        )}
        data-size={size}
      >
        <textarea
          ref={textareaRef}
          className={styles.control}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={effectiveState === "error" || undefined}
          rows={rows}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={(event) => {
            setUncontrolledLength(event.target.value.length);
            onChange?.(event);
          }}
          {...props}
        />
      </div>
      {showCount && (
        <span className={styles.counter}>
          {maxLength !== undefined ? `${currentLength}/${maxLength}` : currentLength}
        </span>
      )}
    </>
  );
}
