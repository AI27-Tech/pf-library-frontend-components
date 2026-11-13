import { ArrowUp, ChevronRight, ChevronsUpDown } from "lucide-react";
import { Fragment, type ReactNode, type Key } from "react";
import styles from "./Table.module.css";
import { SkeletonRows } from "./SkeletonRows";
import { Checkbox } from "../Input/Checkbox";
import { EmptyState } from "../EmptyState";

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
  /** Ancho mínimo, por ejemplo "120px". */
  minWidth?: string;
  /** Corta el contenido con puntos suspensivos cuando no cabe en la celda. */
  truncate?: boolean;
}

/** Textos de la interfaz de Table. Cada uno se puede sobrescribir con `labels`. */
export interface TableLabels {
  /** Mensaje cuando no hay filas. */
  empty: string;
  /** Etiqueta accesible del checkbox de seleccionar todas. */
  selectAll: string;
  /** Etiqueta accesible del checkbox de cada fila. */
  selectRow: string;
  /** Etiqueta accesible del botón para expandir una fila. */
  expandRow: string;
  /** Etiqueta accesible del botón para contraer una fila. */
  collapseRow: string;
  /** Etiqueta accesible de la tabla mientras carga, si no se pasa `aria-label`. */
  loading: string;
}

const defaultLabels: TableLabels = {
  empty: "No hay datos para mostrar.",
  selectAll: "Seleccionar todas las filas",
  selectRow: "Seleccionar fila",
  expandRow: "Expandir fila",
  collapseRow: "Contraer fila",
  loading: "Cargando",
};

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
  /** Estado de carga. Muestra filas en skeleton en lugar de datos. */
  loading?: boolean;
  /** Número de filas en skeleton mientras carga. Por defecto: 5. */
  loadingRows?: number;
  /** Contenido mostrado cuando no hay datos. Por defecto: un `EmptyState` con `labels.empty`. */
  emptyState?: ReactNode;
  /**
   * Barra de acciones masivas. Se muestra encima de la tabla cuando hay filas seleccionadas
   * y recibe las claves seleccionadas.
   */
  bulkActions?: (selectedKeys: Set<Key>) => ReactNode;
  /** Textos de la interfaz. Parciales: los no indicados usan los valores en español. */
  labels?: Partial<TableLabels>;
  /** Densidad de filas. */
  density?: "comfortable" | "compact";
  /** Resaltar filas al pasar el mouse. Por defecto: true. */
  hoverable?: boolean;
  /**
   * Fija el encabezado al hacer scroll vertical. El contenedor necesita una altura máxima
   * (por ejemplo, vía `className`) para que el scroll ocurra dentro de la tabla. Por defecto: false.
   */
  stickyHeader?: boolean;
  /** Rayas alternas en las filas. Por defecto: true. */
  striped?: boolean;
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

/** Columna ordenable: sin orden activo muestra dos flechas atenuadas; con orden, una sola flecha. */
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
      {state === null ? <ChevronsUpDown /> : <ArrowUp />}
    </span>
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
  loadingRows = 5,
  emptyState,
  bulkActions,
  labels: labelsProp,
  density = "comfortable",
  hoverable = true,
  stickyHeader = false,
  striped = true,
  className,
  "aria-label": ariaLabel,
}: TableProps<T>) {
  const labels: TableLabels = { ...defaultLabels, ...labelsProp };
  const selectedCount = selectedKeys?.size ?? 0;
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
      {bulkActions && selectedCount > 0 && (
        <div className={styles.bulkBar}>
          <span className={styles.bulkCount} aria-live="polite">
            {selectedCount} {selectedCount === 1 ? "seleccionada" : "seleccionadas"}
          </span>
          <div className={styles.bulkActions}>{bulkActions(selectedKeys!)}</div>
        </div>
      )}
      <table
        className={cx(
          styles.table,
          styles[`density-${density}`],
          hoverable && styles.hoverable,
          striped && styles.striped,
          stickyHeader && styles.stickyHeader,
        )}
        aria-label={ariaLabel ?? (loading ? labels.loading : undefined)}
        aria-busy={loading || undefined}
      >
        <thead className={styles.thead}>
          <tr>
            {expandable && <th className={cx(styles.th, styles.expandCell)} aria-hidden="true" />}
            {selectable && (
              <th className={cx(styles.th, styles.selectCell)}>
                <Checkbox
                  size="sm"
                  checked={allSelected}
                  onChange={toggleAll}
                  disabled={loading}
                  aria-label={labels.selectAll}
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
                    col.truncate && styles.truncate,
                  )}
                  style={{ width: col.width, minWidth: col.minWidth }}
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
            <SkeletonRows
              rows={loadingRows}
              columns={columns.length}
              selectable={selectable}
              expandable={expandable}
            />
          ) : data.length === 0 ? (
            <tr>
              <td className={styles.state} colSpan={totalCols}>
                {emptyState ?? <EmptyState title={labels.empty} size="sm" />}
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
                            aria-label={isExpanded ? labels.collapseRow : labels.expandRow}
                            aria-expanded={isExpanded}
                          >
                            <ChevronRight />
                          </button>
                        )}
                      </td>
                    )}
                    {selectable && (
                      <td
                        className={cx(styles.td, styles.selectCell)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          size="sm"
                          checked={isSelected}
                          onChange={() => toggleRow(key)}
                          aria-label={labels.selectRow}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cx(
                          styles.td,
                          alignClass(col.align),
                          col.truncate && styles.truncate,
                        )}
                        style={col.minWidth ? { minWidth: col.minWidth } : undefined}
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
