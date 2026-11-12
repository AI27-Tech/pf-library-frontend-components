import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx";
import styles from "./Divider.module.css";

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /** Dirección de la línea. Por defecto: "horizontal". */
  orientation?: "horizontal" | "vertical";
  /** Texto centrado en la línea (solo horizontal). */
  label?: ReactNode;
}

/** Separador visual con etiqueta opcional. */
export function Divider({
  orientation = "horizontal",
  label,
  className,
  ...props
}: DividerProps) {
  if (orientation === "horizontal" && label) {
    return (
      <div className={cx(styles.labeled, className)} role="separator" aria-orientation="horizontal" {...props}>
        <span className={styles.line} aria-hidden="true" />
        <span className={styles.label}>{label}</span>
        <span className={styles.line} aria-hidden="true" />
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cx(styles.divider, styles[orientation], className)}
      {...props}
    />
  );
}
