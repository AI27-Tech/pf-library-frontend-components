import { Skeleton } from "../Skeleton/Skeleton";
import { cx } from "../../utils/cx";
import styles from "./Table.module.css";

/**
 * Anchos de texto de las celdas, en porcentaje. Se repiten por columna con un patrón
 * fijo, para no dar un aspecto de rejilla uniforme sin usar `Math.random` (que
 * causaría diferencias entre servidor y cliente).
 */
const CELL_WIDTHS = [80, 60, 70, 50];

export interface SkeletonRowsProps {
  /** Número de filas en carga. */
  rows: number;
  /** Número de columnas de datos. */
  columns: number;
  /** Agrega la celda de la columna de selección. */
  selectable: boolean;
  /** Agrega la celda de la columna de expansión. */
  expandable: boolean;
}

/**
 * Filas en carga de `Table`. Solo devuelve `<tr>`: el contenedor `<tbody>` lo pone
 * `Table`. Usa las clases de `Table`, así que respeta la densidad, la selección y la
 * expansión.
 */
export function SkeletonRows({ rows, columns, selectable, expandable }: SkeletonRowsProps) {
  return (
    <>
      {Array.from({ length: rows }, (_, rowIndex) => (
        <tr key={rowIndex} className={styles.row}>
          {expandable && <td className={cx(styles.td, styles.expandCell)} />}
          {selectable && (
            <td className={cx(styles.td, styles.selectCell)}>
              <Skeleton variant="rect" width="1rem" height="1rem" />
            </td>
          )}
          {Array.from({ length: columns }, (_, columnIndex) => (
            <td key={columnIndex} className={styles.td}>
              <Skeleton width={`${CELL_WIDTHS[columnIndex % CELL_WIDTHS.length]}%`} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
