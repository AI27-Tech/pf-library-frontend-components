import { Search } from "lucide-react";
import type { ReactNode } from "react";
import { Table, type TableLabels, type TableProps } from "../Table";
import { Input } from "../Input/Input";
import { FilterBar, type FilterDefinition, type FilterValues } from "../FilterBar";
import { Button } from "../Button";
import styles from "./FilterTable.module.css";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// Re-export types from FilterBar for convenience
export type { FilterDefinition, FilterValues };

/** Textos de la barra y del pie de FilterTable. Cada uno se puede sobrescribir con `labels`. */
export interface FilterTableLabels {
  /** Placeholder del cuadro de búsqueda. */
  search: string;
  /** Texto del botón que limpia la búsqueda y los filtros. */
  clear: string;
  /** Conteo cuando hay un solo resultado. Usa `{n}` para el número. */
  resultsOne: string;
  /** Conteo cuando hay cero o más de un resultado. Usa `{n}` para el número. */
  resultsMany: string;
}

const defaultLabels: FilterTableLabels = {
  search: "Buscar...",
  clear: "Limpiar",
  resultsOne: "{n} resultado",
  resultsMany: "{n} resultados",
};

// `labels` lo usa FilterTable para sus textos; los de Table se pasan con `tableLabels`.
export interface FilterTableProps<T> extends Omit<TableProps<T>, "labels"> {
  /** Texto de búsqueda actual (controlado). */
  search?: string;
  /** Llamado cuando cambia el texto de búsqueda. Omitir para ocultar el cuadro de búsqueda. */
  onSearchChange?: (value: string) => void;
  /** Placeholder para el cuadro de búsqueda. Por defecto: `labels.search`. */
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
  /**
   * Disposición de los filtros. `panel` muestra la cuadrícula completa (por defecto).
   * `toolbar` muestra la búsqueda y un botón "Filtros (n)" que abre los filtros en un popover.
   */
  filterLayout?: "panel" | "toolbar";
  /** Textos de la barra y del pie. Parciales: los no indicados usan los valores en español. */
  labels?: Partial<FilterTableLabels>;
  /** Textos de la tabla interna. Se pasan a `Table`. */
  tableLabels?: Partial<TableLabels>;
}

export function FilterTable<T>({
  search,
  onSearchChange,
  searchPlaceholder,
  filters,
  filterValues,
  onFilterChange,
  toolbarActions,
  onClear,
  totalCount,
  hideCount = false,
  rootClassName,
  filterLayout = "panel",
  labels: labelsProp,
  tableLabels,
  ...tableProps
}: FilterTableProps<T>) {
  const labels: FilterTableLabels = { ...defaultLabels, ...labelsProp };
  const placeholder = searchPlaceholder ?? labels.search;
  const showSearch = Boolean(onSearchChange);
  const showFilters = Boolean(filters && filters.length > 0);
  const showToolbar = showSearch || showFilters || Boolean(toolbarActions) || Boolean(onClear);
  const count = totalCount ?? tableProps.data.length;
  const countText = (count === 1 ? labels.resultsOne : labels.resultsMany).replace(
    "{n}",
    String(count),
  );

  const searchInput = (
    <Input
      className={styles.search}
      value={search ?? ""}
      onChange={(e) => onSearchChange!(e.target.value)}
      placeholder={placeholder}
      startAdornment={<Search />}
      aria-label={labels.search}
      type="search"
    />
  );

  const footer = !hideCount && (
    <div className={styles.footer}>
      <span className={styles.count}>{countText}</span>
    </div>
  );

  // Con filtros, la barra de FilterBar reemplaza la barra de herramientas.
  if (showFilters) {
    const isToolbar = filterLayout === "toolbar";

    return (
      <div className={cx(styles.root, rootClassName)}>
        <div className={styles.topSection}>
          {/* En `toolbar` la búsqueda vive dentro de FilterBar, en la misma fila. */}
          {showSearch && !isToolbar && searchInput}

          <FilterBar
            layout={filterLayout}
            filters={filters!.map((f) => ({ ...f, label: f.label || f.placeholder || f.key }))}
            filterValues={filterValues}
            onFilterChange={onFilterChange}
            onClear={onClear}
            showClear={Boolean(onClear)}
            showFilterCount={true}
            searchValue={search}
            onSearchChange={isToolbar ? onSearchChange : undefined}
            searchPlaceholder={placeholder}
            loading={tableProps.loading}
            labels={{ search: placeholder, clearAll: labels.clear }}
          />
        </div>

        <Table {...tableProps} labels={tableLabels} />

        {footer}
      </div>
    );
  }

  // Barra de herramientas sin filtros
  return (
    <div className={cx(styles.root, rootClassName)}>
      {showToolbar && (
        <div className={styles.toolbar}>
          {showSearch && searchInput}

          {(toolbarActions || onClear) && (
            <div className={styles.actions}>
              {onClear && (
                <Button variant="ghost" size="sm" onClick={onClear}>
                  {labels.clear}
                </Button>
              )}
              {toolbarActions}
            </div>
          )}
        </div>
      )}

      <Table {...tableProps} labels={tableLabels} />

      {footer}
    </div>
  );
}
