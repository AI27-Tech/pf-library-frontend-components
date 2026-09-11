import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style of the button. */
  variant?: ButtonVariant;
  /** Size of the button. */
  size?: ButtonSize;
  /** Stretch the button to fill the width of its container. */
  fullWidth?: boolean;
  /** Show a loading spinner and disable interaction. */
  loading?: boolean;
  /** Element rendered before the label. */
  startIcon?: ReactNode;
  /** Element rendered after the label. */
  endIcon?: ReactNode;
}

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  startIcon,
  endIcon,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={cx(
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        loading && styles.loading,
        className,
      )}
      data-variant={variant}
      data-size={size}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {!loading && startIcon && (
        <span className={styles.icon} aria-hidden="true">
          {startIcon}
        </span>
      )}
      {children && <span className={styles.label}>{children}</span>}
      {!loading && endIcon && (
        <span className={styles.icon} aria-hidden="true">
          {endIcon}
        </span>
      )}
    </button>
  );
}
