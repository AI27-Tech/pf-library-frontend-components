import { cx } from "../../utils/cx";
import styles from "./ProgressBar.module.css";

export type ProgressBarSize = "sm" | "md";

export interface ProgressBarProps {
  /** Progreso de 0 a 100. Si se omite, la barra es indeterminada. Los valores fuera de rango se ajustan. */
  value?: number;
  /** Etiqueta accesible de la barra. */
  label?: string;
  /** Alto de la barra. Por defecto: "md". */
  size?: ProgressBarSize;
  /** Clase adicional. */
  className?: string;
}

/**
 * Barra de progreso determinada (con `value`) o indeterminada (sin `value`).
 * Con `prefers-reduced-motion`, la barra indeterminada queda estática al 40 %.
 */
export function ProgressBar({ value, label, size = "md", className }: ProgressBarProps) {
  const isIndeterminate = value === undefined;
  const clamped = isIndeterminate ? undefined : Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      className={cx(
        styles.track,
        styles[size],
        isIndeterminate && styles.indeterminate,
        className,
      )}
    >
      <div
        className={styles.fill}
        style={isIndeterminate ? undefined : { width: `${clamped}%` }}
      />
    </div>
  );
}
