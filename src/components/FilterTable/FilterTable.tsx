import type { ReactNode } from "react";
import { Table, type TableProps } from "../Table";
import { Input } from "../Input/Input";
import { FilterBar, type FilterDefinition, type FilterValues } from "../FilterBar";
import { Button } from "../Button";
import styles from "./FilterTable.module.css";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// Re-export types from FilterBar for convenience
export type { FilterDefinition, FilterValues };

export interface FilterTableProps<T> extends TableProps<T> {
  /** Texto de búsqueda actual (controlado). */
  search?: string;
  /** Llamado cuando cambia el texto de búsqueda. Omitir para ocultar el cuadro de búsqueda. */
  onSearchChange?: (value: string) => void;
  /** Placeholder para el cuadro de búsqueda. */
  searchPlaceholder?: string;
  /** Filtros select declarativos mostrados en la barra de herramientas. */
  filters?: FilterDefinition[];
  /** Valores de filtro actual (controlado). */
  filterValues?: FilterValues;
  /** Llamado cuando cambia un valor de filtro. */
  onFilterChange?: (key: string, value: string) => void;
  /** Acciones adicionales renderizadas a la derecha de la barra de herramientas. */
  toolbarActions?: ReactNode;
  /** Si cualquier filtro/búsqueda está activa (muestra un botón "Limpiar"). */
  onClear?: () => void;
  /** Conteo total mostrado en el pie de página. Por defecto: longitud de los datos. */
  totalCount?: number;
  /** Ocultar el pie de página del conteo de resultados. */
  hideCount?: boolean;
  /** Clase adicional para el envolvedor raíz. */
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

  // If we have filters, use FilterBar
  if (showFilters) {
    const filterBarFilters = filters!.map((f) => ({
      key: f.key,
      label: f.label || f.placeholder || f.key,
      options: f.options,
      placeholder: f.placeholder,
    }));

    return (
      <div className={cx(styles.root, rootClassName)}>
        {/* Búsqueda + FilterBar */}
        <div className={styles.topSection}>
          {showSearch && (
            <Input
              className={styles.search}
              value={search ?? ""}
              onChange={(e) => onSearchChange!(e.target.value)}
              placeholder={searchPlaceholder}
              startAdornment={<SearchIcon />}
              aria-label="Búsqueda"
              type="search"
            />
          )}

          <FilterBar
            filters={filterBarFilters}
            filterValues={filterValues}
            onFilterChange={onFilterChange}
            onClear={onClear}
            showClear={Boolean(onClear)}
            showFilterCount={true}
          />
        </div>

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

  // Original toolbar layout if no filters
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
