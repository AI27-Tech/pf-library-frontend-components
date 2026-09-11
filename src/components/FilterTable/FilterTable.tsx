import type { ReactNode } from "react";
import { Table, type TableProps } from "../Table";
import { Input } from "../Input/Input";
import { Select, type SelectOption } from "../Input/Select";
import { Button } from "../Button";
import styles from "./FilterTable.module.css";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface FilterDefinition {
  /** Unique key for this filter, used in the values map. */
  key: string;
  /** Options shown in the select. */
  options: SelectOption[];
  /** Placeholder shown when no value is selected. */
  placeholder?: string;
}

/** Map of filter key -> selected value (empty string means "all"). */
export type FilterValues = Record<string, string>;

export interface FilterTableProps<T> extends TableProps<T> {
  /** Current search text (controlled). */
  search?: string;
  /** Called when the search text changes. Omit to hide the search box. */
  onSearchChange?: (value: string) => void;
  /** Placeholder for the search box. */
  searchPlaceholder?: string;
  /** Declarative select filters shown in the toolbar. */
  filters?: FilterDefinition[];
  /** Current filter values (controlled). */
  filterValues?: FilterValues;
  /** Called when a filter value changes. */
  onFilterChange?: (key: string, value: string) => void;
  /** Extra actions rendered on the right of the toolbar. */
  toolbarActions?: ReactNode;
  /** Whether any filter/search is active (shows a "Clear" button). */
  onClear?: () => void;
  /** Total count shown in the footer. Defaults to data length. */
  totalCount?: number;
  /** Hide the results count footer. */
  hideCount?: boolean;
  /** Extra class for the root wrapper. */
  rootClassName?: string;
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

export function FilterTable<T>({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  filterValues,
  onFilterChange,
  toolbarActions,
  onClear,
  totalCount,
  hideCount = false,
  rootClassName,
  ...tableProps
}: FilterTableProps<T>) {
  const showSearch = Boolean(onSearchChange);
  const showFilters = Boolean(filters && filters.length > 0);
  const showToolbar = showSearch || showFilters || Boolean(toolbarActions) || Boolean(onClear);
  const count = totalCount ?? tableProps.data.length;

  return (
    <div className={cx(styles.root, rootClassName)}>
      {showToolbar && (
        <div className={styles.toolbar}>
          {showSearch && (
            <Input
              className={styles.search}
              value={search ?? ""}
              onChange={(e) => onSearchChange!(e.target.value)}
              placeholder={searchPlaceholder}
              startAdornment={<SearchIcon />}
              aria-label="Search"
              type="search"
            />
          )}

          {showFilters && (
            <div className={styles.filters}>
              {filters!.map((f) => (
                <Select
                  key={f.key}
                  className={styles.filter}
                  options={f.options}
                  placeholder={f.placeholder ?? "All"}
                  value={filterValues?.[f.key] ?? ""}
                  onChange={(e) => onFilterChange?.(f.key, e.target.value)}
                  aria-label={f.placeholder ?? f.key}
                />
              ))}
            </div>
          )}

          {(toolbarActions || onClear) && (
            <div className={styles.actions}>
              {onClear && (
                <Button variant="ghost" size="sm" onClick={onClear}>
                  Clear
                </Button>
              )}
              {toolbarActions}
            </div>
          )}
        </div>
      )}

      <Table {...tableProps} />

      {!hideCount && (
        <div className={styles.footer}>
          <span className={styles.count}>
            {count} {count === 1 ? "result" : "results"}
          </span>
        </div>
      )}
    </div>
  );
}
