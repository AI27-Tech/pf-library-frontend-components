import { Fragment, type ReactNode, type Key } from "react";
import styles from "./Table.module.css";

export type SortDirection = "asc" | "desc";

export interface SortState {
  /** Column key currently sorted. */
  key: string;
  /** Sort direction. */
  direction: SortDirection;
}

export interface Column<T> {
  /** Unique key. Also used as the sort key. */
  key: string;
  /** Header content. */
  header: ReactNode;
  /** Function returning the cell content for a row. */
  cell?: (row: T, rowIndex: number) => ReactNode;
  /** Property accessor used when `cell` is not provided. */
  accessor?: keyof T;
  /** Horizontal alignment. */
  align?: "left" | "center" | "right";
  /** Whether the column can be sorted (renders a sort control). */
  sortable?: boolean;
  /** Fixed width, e.g. "120px" or "20%". */
  width?: string;
}

export interface TableProps<T> {
  /** Column definitions. */
  columns: Column<T>[];
  /** Row data. */
  data: T[];
  /** Returns a stable key for a row. Defaults to the row index. */
  rowKey?: (row: T, index: number) => Key;
  /** Controlled sort state. */
  sort?: SortState | null;
  /** Called when a sortable header is clicked. */
  onSortChange?: (sort: SortState) => void;
  /** Called when a row is clicked. Makes rows interactive. */
  onRowClick?: (row: T, index: number) => void;
  /** Controlled set of selected row keys. Enables the selection column. */
  selectedKeys?: Set<Key>;
  /** Called when the selection changes. */
  onSelectionChange?: (keys: Set<Key>) => void;
  /**
   * Renders an expandable detail panel below a row. When provided, an
   * expand/collapse control column is added. Return null to make a row
   * non-expandable.
   */
  expandedContent?: (row: T, rowIndex: number) => ReactNode;
  /** Controlled set of expanded row keys. */
  expandedKeys?: Set<Key>;
  /** Called when a row is expanded or collapsed. */
  onExpandedChange?: (keys: Set<Key>) => void;
  /** Loading state. Shows a spinner instead of rows. */
  loading?: boolean;
  /** Content shown when there is no data. */
  emptyState?: ReactNode;
  /** Row density. */
  density?: "comfortable" | "compact";
  /** Highlight rows on hover. Default: true. */
  hoverable?: boolean;
  className?: string;
  /** Accessible caption / label for the table. */
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
                <span className={styles.spinner} aria-label="Loading" />
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
                            aria-label={isExpanded ? "Collapse row" : "Expand row"}
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
                          aria-label="Select row"
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
