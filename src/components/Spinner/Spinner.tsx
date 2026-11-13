import { cx } from "../../utils/cx";
import styles from "./Spinner.module.css";

export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps {
  /** Tamaño del indicador. Por defecto: "md". */
  size?: SpinnerSize;
  /** Texto que anuncia el lector de pantalla. Por defecto: "Cargando". */
  label?: string;
  /** Clase adicional. */
  className?: string;
}

/** Indicador de carga giratorio. Para carga de contenido, preferir `Skeleton`. */
export function Spinner({ size = "md", label = "Cargando", className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cx(styles.spinner, styles[size], className)}
    />
  );
}
