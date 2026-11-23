import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx";
import styles from "./DescriptionList.module.css";

export interface DescriptionListItem {
  /** Nombre del dato. */
  label: ReactNode;
  /** Valor del dato. `null`, `undefined` o `""` se muestran como `emptyValue`. */
  value: ReactNode;
  /** Columnas que ocupa el elemento. Se limita al número de columnas de la lista en cada breakpoint. */
  span?: number;
}

export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
  /** Pares de nombre y valor. */
  items: DescriptionListItem[];
  /**
   * Número de columnas, de 1 a 4. Por defecto: 2. En móvil siempre es 1; en tablet
   * nunca supera 2; en escritorio es el número indicado.
   */
  columns?: 1 | 2 | 3 | 4;
  /** Disposición de cada par. Por defecto: "vertical" (nombre sobre valor). En móvil, "horizontal" se apila. */
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
  const tabletColumns = Math.min(columns, 2);
  const listVars = {
    "--ui-dl-cols-tablet": String(tabletColumns),
    "--ui-dl-cols-desktop": String(columns),
    ...style,
  } as CSSProperties;

  return (
    <dl
      className={cx(styles.list, className)}
      data-orientation={orientation}
      style={listVars}
      {...props}
    >
      {items.map((item, index) => {
        const itemVars = item.span
          ? ({
              "--ui-dl-span-tablet": String(Math.min(item.span, tabletColumns)),
              "--ui-dl-span-desktop": String(Math.min(item.span, columns)),
            } as CSSProperties)
          : undefined;
        return (
          <div key={index} className={styles.item} style={itemVars}>
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
