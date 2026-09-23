import type { HTMLAttributes, ReactNode } from "react";
import { useState, useMemo } from "react";
import { FilterBar, type FilterDefinition, type FilterValues } from "../FilterBar";
import { Pagination } from "../Pagination";
import styles from "./ImageGrid.module.css";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export type ImageGridColumns = 1 | 2 | 3 | 4 | 5 | 6;

export type GridViewMode = "grid" | "list";

export type ImageGridProps<T> = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  items: T[];
  filters?: FilterDefinition[];
  filterValues?: FilterValues;
  onFilterChange?: (key: string, value: string) => void;
  renderItem: (item: T, index: number) => ReactNode;
  matchesFilters?: (item: T, activeFilters: Record<string, string>) => boolean;
  /** Número de columnas a mostrar. Opciones: 1, 2, 3, 4, 5, 6. Por defecto: 4 */
  columns?: ImageGridColumns;
  gap?: string;
  emptyMessage?: ReactNode;
  showCount?: boolean;
  onClear?: () => void;
  /** Habilitar paginación. Por defecto: false */
  enablePagination?: boolean;
  /** Items por página. Por defecto: 12 */
  itemsPerPage?: number;
  /** Habilitar selector de vista en el FilterBar. Por defecto: false */
  enableViewToggle?: boolean;
  /** Modo de vista actual (controlado). Si no se proporciona, usa estado interno */
  viewMode?: GridViewMode;
  /** Callback cuando el modo de vista cambia */
  onViewModeChange?: (mode: GridViewMode) => void;
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
  enablePagination = false,
  itemsPerPage = 12,
  enableViewToggle = false,
  viewMode: externalViewMode,
  onViewModeChange,
  ...props
}: ImageGridProps<T>) {
  const [internalFilterValues, setInternalFilterValues] = useState<FilterValues>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [internalViewMode, setInternalViewMode] = useState<GridViewMode>("grid");

  // Use external values if controlled, otherwise use internal state
  const filterValues = externalFilterValues ?? internalFilterValues;
  const viewMode = externalViewMode ?? internalViewMode;

  const handleViewModeChange = (mode: GridViewMode) => {
    if (onViewModeChange) {
      onViewModeChange(mode);
    } else {
      setInternalViewMode(mode);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    if (onFilterChange) {
      onFilterChange(key, value);
    } else {
      setInternalFilterValues((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
    // Reset pagination when filters change
    setCurrentPage(1);
  };

  const filteredItems = useMemo(() => {
    const hasActiveFilters = Object.values(filterValues).some((val) => val);

    if (!hasActiveFilters) return items;

    if (matchesFilters) {
      return items.filter((item) => matchesFilters(item, filterValues));
    }

    return items;
  }, [items, filterValues, matchesFilters]);

  // Paginación
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    if (!enablePagination) return filteredItems;

    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    return filteredItems.slice(startIdx, endIdx);
  }, [filteredItems, currentPage, itemsPerPage, enablePagination]);

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      setInternalFilterValues({});
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const displayColumns = viewMode === "list" ? 1 : columns;

  return (
    <div className={cx(styles.root, className)} {...props}>
      {/* Barra de filtros con selector de vista integrado */}
      {filters.length > 0 && (
        <FilterBar
          filters={filters}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          onClear={handleClear}
          showClear={true}
          showFilterCount={true}
          enableViewToggle={enableViewToggle}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />
      )}

      {/* Metadatos de resultados */}
      {showCount && (
        <div className={styles.resultsMeta}>
          <span>
            Mostrando {paginatedItems.length} de {filteredItems.length} elemento
            {filteredItems.length !== 1 ? "s" : ""} (total: {items.length})
          </span>
        </div>
      )}

      {/* Items Grid or List or Empty State */}
      {filteredItems.length > 0 ? (
        <>
          {viewMode === "list" ? (
            // Vista de lista
            <div className={styles.listContainer}>
              {paginatedItems.map((item, idx) => (
                <div key={idx} className={styles.listItem}>
                  {renderItem(item, idx)}
                </div>
              ))}
            </div>
          ) : (
            // Vista de grilla
            <div
              className={styles.itemsGrid}
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${displayColumns}, 1fr)`,
                gap,
              }}
            >
              {paginatedItems.map((item, idx) => renderItem(item, idx))}
            </div>
          )}

          {/* Paginación usando componente Pagination */}
          {enablePagination && totalPages > 1 && (
            <div style={{ marginTop: "1.5rem" }}>
              <Pagination
                page={currentPage}
                pageSize={itemsPerPage}
                total={filteredItems.length}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <div className={styles.empty}>
          <p className={styles.emptyMessage}>{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}
