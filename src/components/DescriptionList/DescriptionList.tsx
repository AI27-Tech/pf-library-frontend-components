import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx";
import styles from "./DescriptionList.module.css";

export interface DescriptionListItem {
  /** Nombre del dato. */
  label: ReactNode;
  /** Valor del dato. `null`, `undefined` o `""` se muestran como `emptyValue`. */
  value: ReactNode;
  /** Columnas que ocupa el elemento. Se limita al número de columnas de la lista. */
  span?: number;
}

export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
  /** Pares de nombre y valor. */
  items: DescriptionListItem[];
  /** Número de columnas, de 1 a 4. Por defecto: 2. */
  columns?: 1 | 2 | 3 | 4;
  /** Disposición de cada par. Por defecto: "vertical" (nombre sobre valor). */
  orientation?: "vertical" | "horizontal";
  /** Texto para valores vacíos. Por defecto: "—". */
  emptyValue?: ReactNode;
}

function isEmptyValue(value: ReactNode): boolean {
  return value === null || value === undefined || value === "";
}

/** Lista de datos clave-valor con `dl`, `dt` y `dd`. */
export function DescriptionList({
  items,
  columns = 2,
  orientation = "vertical",
  emptyValue = "—",
  className,
  style,
  ...props
}: DescriptionListProps) {
  return (
    <dl
      className={cx(styles.list, className)}
      data-orientation={orientation}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        ...style,
      } as CSSProperties}
      {...props}
    >
      {items.map((item, index) => {
        const span = item.span ? Math.min(item.span, columns) : undefined;
        return (
          <div
            key={index}
            className={styles.item}
            style={span ? { gridColumn: `span ${span}` } : undefined}
          >
            <dt className={styles.label}>{item.label}</dt>
            <dd className={styles.value}>
              {isEmptyValue(item.value) ? <span className={styles.empty}>{emptyValue}</span> : item.value}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
