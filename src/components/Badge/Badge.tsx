import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Badge.module.css";

export type BadgeVariant =
  | "secure"
  | "alert"
  | "escort"
  | "warning"
  | "neutral";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Status variant, mapped to AI27 tactical signals. */
  variant?: BadgeVariant;
  /** Show a leading status dot. */
  dot?: boolean;
  /** Animate the dot (for live/active alerts, e.g. jamming). Implies `dot`. */
  pulse?: boolean;
  /** Use a fully rounded pill shape. */
  pill?: boolean;
  children?: ReactNode;
}

export function Badge({
  variant = "neutral",
  dot = false,
  pulse = false,
  pill = false,
  className,
  children,
  ...props
}: BadgeProps) {
  const showDot = dot || pulse;
  return (
    <span
      className={cx(styles.badge, styles[variant], pill && styles.pill, className)}
      {...props}
    >
      {showDot && (
        <span
          className={cx(styles.dot, pulse && styles.pulse)}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
