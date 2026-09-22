import type { HTMLAttributes, ReactNode } from "react";
import { useState, useMemo } from "react";
import { FilterBar, type FilterDefinition, type FilterValues } from "../FilterBar";
import styles from "./ImageGrid.module.css";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export type ImageGridColumns = 1 | 2 | 3 | 4 | 5 | 6;

export type ImageGridProps<T> = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  items: T[];
  filters?: FilterDefinition[];
  filterValues?: FilterValues;
  onFilterChange?: (key: string, value: string) => void;
  renderItem: (item: T, index: number) => ReactNode;
  matchesFilters?: (item: T, activeFilters: Record<string, string>) => boolean;
  /** Number of columns to display. Options: 1, 2, 3, 4, 5, 6. Default: 4 */
  columns?: ImageGridColumns;
  gap?: string;
  emptyMessage?: ReactNode;
  showCount?: boolean;
  onClear?: () => void;
};

export function ImageGrid<T>({
  items,
  filters = [],
  filterValues: externalFilterValues,
  onFilterChange,
  renderItem,
  matchesFilters,
  columns = 4,
  gap = "1rem",
  emptyMessage = "No items found",
  showCount = true,
  onClear,
  className,
  ...props
}: ImageGridProps<T>) {
  const [internalFilterValues, setInternalFilterValues] = useState<FilterValues>({});

  // Use external values if controlled, otherwise use internal state
  const filterValues = externalFilterValues ?? internalFilterValues;

  const handleFilterChange = (key: string, value: string) => {
    if (onFilterChange) {
      onFilterChange(key, value);
    } else {
      setInternalFilterValues((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const filteredItems = useMemo(() => {
    const hasActiveFilters = Object.values(filterValues).some((val) => val);

    if (!hasActiveFilters) return items;

    if (matchesFilters) {
      return items.filter((item) => matchesFilters(item, filterValues));
    }

    return items;
  }, [items, filterValues, matchesFilters]);

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      setInternalFilterValues({});
    }
  };

  return (
    <div className={cx(styles.root, className)} {...props}>
      {/* FilterBar */}
      {filters.length > 0 && (
        <FilterBar
          filters={filters}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          onClear={handleClear}
          showClear={true}
          showFilterCount={true}
        />
      )}

      {/* Results Meta */}
      {showCount && (
        <div className={styles.resultsMeta}>
          <span>
            Showing {filteredItems.length} of {items.length} item
            {items.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Items Grid or Empty State */}
      {filteredItems.length > 0 ? (
        <div
          className={styles.itemsGrid}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap,
          }}
        >
          {filteredItems.map((item, idx) => renderItem(item, idx))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p className={styles.emptyMessage}>{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}
