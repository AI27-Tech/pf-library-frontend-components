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
  /** Variante de estado, mapeado a señales tácticas de AI27. */
  variant?: BadgeVariant;
  /** Mostrar un indicador de estado inicial. */
  dot?: boolean;
  /** Animar el indicador (para alertas en vivo/activas, por ejemplo jamming). Implica `dot`. */
  pulse?: boolean;
  /** Usar una forma de píldora completamente redondeada. */
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
