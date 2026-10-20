import { Fragment, type ReactNode, type Key } from "react";
import styles from "./Table.module.css";

export type SortDirection = "asc" | "desc";

export interface SortState {
  /** Clave de columna actualmente ordenada. */
  key: string;
  /** Dirección de ordenamiento. */
  direction: SortDirection;
}

export interface Column<T> {
  /** Clave única. También se usa como clave de ordenamiento. */
  key: string;
  /** Contenido del encabezado. */
  header: ReactNode;
  /** Función que devuelve el contenido de la celda para una fila. */
  cell?: (row: T, rowIndex: number) => ReactNode;
  /** Acceso a propiedad usado cuando `cell` no se proporciona. */
  accessor?: keyof T;
  /** Alineación horizontal. */
  align?: "left" | "center" | "right";
  /** Si la columna puede ser ordenada (renderiza un control de ordenamiento). */
  sortable?: boolean;
  /** Ancho fijo, por ejemplo "120px" o "20%". */
  width?: string;
}

export interface TableProps<T> {
  /** Definiciones de columnas. */
  columns: Column<T>[];
  /** Datos de filas. */
  data: T[];
  /** Devuelve una clave estable para una fila. Por defecto el índice de la fila. */
  rowKey?: (row: T, index: number) => Key;
  /** Estado de ordenamiento controlado. */
  sort?: SortState | null;
  /** Llamado cuando se hace clic en un encabezado ordenable. */
  onSortChange?: (sort: SortState) => void;
  /** Llamado cuando se hace clic en una fila. Hace las filas interactivas. */
  onRowClick?: (row: T, index: number) => void;
  /** Conjunto controlado de claves de fila seleccionadas. Habilita la columna de selección. */
  selectedKeys?: Set<Key>;
  /** Llamado cuando cambia la selección. */
  onSelectionChange?: (keys: Set<Key>) => void;
  /**
   * Renderiza un panel de detalles expandible debajo de una fila. Cuando se proporciona,
   * se agrega una columna de control de expandir/contraer. Devuelve null para hacer que
   * una fila no sea expandible.
   */
  expandedContent?: (row: T, rowIndex: number) => ReactNode;
  /** Conjunto controlado de claves de fila expandidas. */
  expandedKeys?: Set<Key>;
  /** Llamado cuando se expande o contrae una fila. */
  onExpandedChange?: (keys: Set<Key>) => void;
  /** Estado de carga. Muestra un spinner en lugar de filas. */
  loading?: boolean;
  /** Contenido mostrado cuando no hay datos. */
  emptyState?: ReactNode;
  /** Densidad de filas. */
  density?: "comfortable" | "compact";
  /** Resaltar filas al pasar el mouse. Por defecto: true. */
  hoverable?: boolean;
  className?: string;
  /** Etiqueta de accesibilidad / leyenda para la tabla. */
  "aria-label"?: string;
}

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function alignClass(align?: Column<unknown>["align"]) {
  if (align === "center") return styles.alignCenter;
  if (align === "right") return styles.alignRight;
  return undefined;
}

function SortIcon({ state }: { state: SortDirection | null }) {
  return (
    <span
      className={cx(
        styles.sortIcon,
        state !== null && styles.active,
        state === "desc" && styles.desc,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M6 11l6-6 6 6" />
      </svg>
    </span>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function Table<T>({
  columns,
  data,
  rowKey,
  sort,
  onSortChange,
  onRowClick,
  selectedKeys,
  onSelectionChange,
  expandedContent,
  expandedKeys,
  onExpandedChange,
  loading = false,
  emptyState = "No data to display.",
  density = "comfortable",
  hoverable = true,
  className,
  "aria-label": ariaLabel,
}: TableProps<T>) {
  const selectable = Boolean(selectedKeys && onSelectionChange);
  const expandable = Boolean(expandedContent);
  const getKey = (row: T, index: number): Key =>
    rowKey ? rowKey(row, index) : index;
  const totalCols =
    columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0);

  const toggleExpanded = (key: Key) => {
    if (!onExpandedChange) return;
    const next = new Set(expandedKeys ?? []);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onExpandedChange(next);
  };

  const allSelected =
    selectable && data.length > 0 &&
    data.every((row, i) => selectedKeys!.has(getKey(row, i)));

  const handleSort = (col: Column<T>) => {
    if (!col.sortable || !onSortChange) return;
    const nextDirection: SortDirection =
      sort?.key === col.key && sort.direction === "asc" ? "desc" : "asc";
    onSortChange({ key: col.key, direction: nextDirection });
  };

  const toggleAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(data.map((row, i) => getKey(row, i))));
    }
  };

  const toggleRow = (key: Key) => {
    if (!onSelectionChange || !selectedKeys) return;
    const next = new Set(selectedKeys);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onSelectionChange(next);
  };

  return (
    <div className={cx(styles.wrapper, className)}>
      <table
        className={cx(
          styles.table,
          styles[`density-${density}`],
          hoverable && styles.hoverable,
        )}
        aria-label={ariaLabel}
      >
        <thead className={styles.thead}>
          <tr>
            {expandable && <th className={cx(styles.th, styles.expandCell)} aria-hidden="true" />}
            {selectable && (
              <th className={cx(styles.th, styles.selectCell)}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="Select all rows"
                />
              </th>
            )}
            {columns.map((col) => {
              const isSorted = sort?.key === col.key;
              return (
                <th
                  key={col.key}
                  className={cx(
                    styles.th,
                    alignClass(col.align),
                    col.sortable && styles.sortable,
                  )}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={col.sortable ? () => handleSort(col) : undefined}
                  aria-sort={
                    isSorted
                      ? sort!.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                >
                  <span className={styles.thContent}>
                    {col.header}
                    {col.sortable && (
                      <SortIcon state={isSorted ? sort!.direction : null} />
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td className={styles.state} colSpan={totalCols}>
                <span className={styles.spinner} aria-label="Cargando" />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td className={styles.state} colSpan={totalCols}>
                {emptyState}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => {
              const key = getKey(row, rowIndex);
              const isSelected = selectable && selectedKeys!.has(key);
              const detail = expandedContent?.(row, rowIndex);
              const isExpanded =
                expandable && !!detail && !!expandedKeys?.has(key);
              return (
                <Fragment key={key}>
                  <tr
                    className={cx(
                      styles.row,
                      onRowClick && styles.clickableRow,
                      isSelected && styles.selected,
                      isExpanded && styles.expandedRow,
                    )}
                    onClick={
                      onRowClick ? () => onRowClick(row, rowIndex) : undefined
                    }
                  >
                    {expandable && (
                      <td
                        className={cx(styles.td, styles.expandCell)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {detail != null && (
                          <button
                            type="button"
                            className={cx(styles.expandBtn, isExpanded && styles.expanded)}
                            onClick={() => toggleExpanded(key)}
                            aria-label={isExpanded ? "Contraer fila" : "Expandir fila"}
                            aria-expanded={isExpanded}
                          >
                            <ChevronIcon />
                          </button>
                        )}
                      </td>
                    )}
                    {selectable && (
                      <td
                        className={cx(styles.td, styles.selectCell)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(key)}
                          aria-label="Seleccionar fila"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cx(styles.td, alignClass(col.align))}
                      >
                        {col.cell
                          ? col.cell(row, rowIndex)
                          : col.accessor
                            ? (row[col.accessor] as ReactNode)
                            : null}
                      </td>
                    ))}
                  </tr>
                  {isExpanded && (
                    <tr className={styles.detailRow}>
                      <td className={styles.detailCell} colSpan={totalCols}>
                        {detail}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
