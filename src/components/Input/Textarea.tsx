import type { TextareaHTMLAttributes, Ref } from "react";
import styles from "./Input.module.css";
import { cx, type InputSize } from "./utils";

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  /** Size of the textarea. */
  size?: InputSize;
  /** Marks the field as invalid (also sets aria-invalid). */
  invalid?: boolean;
  /** Ref forwarded to the underlying textarea element. */
  textareaRef?: Ref<HTMLTextAreaElement>;
}

export function Textarea({
  size = "md",
  invalid = false,
  disabled,
  className,
  textareaRef,
  rows = 3,
  ...props
}: TextareaProps) {
  return (
    <div
      className={cx(
        styles.field,
        styles.textarea,
        styles[size],
        invalid && styles.invalid,
        disabled && styles.disabled,
        className,
      )}
      data-size={size}
    >
      <textarea
        ref={textareaRef}
        className={styles.control}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        rows={rows}
        {...props}
      />
    </div>
  );
}
