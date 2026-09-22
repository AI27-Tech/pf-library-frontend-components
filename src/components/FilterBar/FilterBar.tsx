import type { HTMLAttributes, ReactNode } from "react";
import { Select, type SelectOption } from "../Input/Select";
import { Button } from "../Button";
import styles from "./FilterBar.module.css";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface FilterDefinition {
  /** Unique key for this filter */
  key: string;
  /** Label displayed above the filter */
  label: ReactNode;
  /** Options shown in the select */
  options: SelectOption[];
  /** Placeholder shown when no value is selected */
  placeholder?: string;
  /** Optional icon or visual */
  icon?: ReactNode;
}

export type FilterValues = Record<string, string>;

export interface FilterBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Filter definitions */
  filters: FilterDefinition[];
  /** Current filter values (controlled) */
  filterValues?: FilterValues;
  /** Called when a filter value changes */
  onFilterChange?: (key: string, value: string) => void;
  /** Called when filters should be cleared */
  onClear?: () => void;
  /** Show/hide the clear button */
  showClear?: boolean;
  /** Search input value (optional search integration) */
  searchValue?: string;
  /** Called when search changes */
  onSearchChange?: (value: string) => void;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Show count of active filters */
  showFilterCount?: boolean;
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

export function FilterBar({
  filters,
  filterValues = {},
  onFilterChange,
  onClear,
  showClear = true,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  showFilterCount = true,
  className,
  ...props
}: FilterBarProps) {
  const activeFilterCount = Object.values(filterValues).filter((val) => val).length;
  const hasSearch = Boolean(onSearchChange);

  return (
    <div className={cx(styles.filterBar, className)} {...props}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>Filtros</h3>
        {showFilterCount && activeFilterCount > 0 && (
          <span className={styles.badge}>{activeFilterCount}</span>
        )}
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Search (if applicable) */}
        {hasSearch && (
          <div className={styles.searchBox}>
            <SearchIcon />
            <input
              type="search"
              className={styles.searchInput}
              value={searchValue ?? ""}
              onChange={(e) => onSearchChange!(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label="Search"
            />
          </div>
        )}

        {/* Filters Grid */}
        <div className={styles.filtersGrid}>
          {filters.map((filter) => (
            <div key={filter.key} className={styles.filterColumn}>
              <label className={styles.filterLabel}>
                {filter.icon && <span className={styles.icon}>{filter.icon}</span>}
                <span>{filter.label}</span>
              </label>
              <Select
                className={styles.filterSelect}
                options={filter.options}
                placeholder={filter.placeholder ?? "All"}
                value={filterValues[filter.key] ?? ""}
                onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        {showClear && activeFilterCount > 0 && (
          <div className={styles.actions}>
            <Button variant="ghost" size="sm" onClick={onClear}>
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
