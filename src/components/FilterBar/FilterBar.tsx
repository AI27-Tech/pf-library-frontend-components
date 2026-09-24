import type { HTMLAttributes, ReactNode } from "react";
import { Grid3x3, List } from "lucide-react";
import { Select, type SelectOption } from "../Input/Select";
import { Button } from "../Button";
import styles from "./FilterBar.module.css";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface FilterDefinition {
  /** Clave única para este filtro */
  key: string;
  /** Etiqueta mostrada arriba del filtro */
  label: ReactNode;
  /** Opciones mostradas en el select */
  options: SelectOption[];
  /** Placeholder mostrado cuando no hay valor seleccionado */
  placeholder?: string;
  /** Icono u visual opcional */
  icon?: ReactNode;
}

export type FilterValues = Record<string, string>;

export interface FilterBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Definiciones de filtros */
  filters: FilterDefinition[];
  /** Valores de filtro actual (controlado) */
  filterValues?: FilterValues;
  /** Llamado cuando cambia un valor de filtro */
  onFilterChange?: (key: string, value: string) => void;
  /** Llamado cuando los filtros deben ser borrados */
  onClear?: () => void;
  /** Mostrar/ocultar el botón de limpiar */
  showClear?: boolean;
  /** Valor de entrada de búsqueda (integración de búsqueda opcional) */
  searchValue?: string;
  /** Llamado cuando cambia la búsqueda */
  onSearchChange?: (value: string) => void;
  /** Placeholder de búsqueda */
  searchPlaceholder?: string;
  /** Mostrar conteo de filtros activos */
  showFilterCount?: boolean;
  /** Mostrar chips de filtros activos (por defecto: true) */
  showActiveFilterChips?: boolean;
  /** Habilitar selector de vista (grid/list). Por defecto: false */
  enableViewToggle?: boolean;
  /** Modo de vista actual */
  viewMode?: "grid" | "list";
  /** Callback cuando cambia el modo de vista */
  onViewModeChange?: (mode: "grid" | "list") => void;
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
  showActiveFilterChips = true,
  enableViewToggle = false,
  viewMode = "grid",
  onViewModeChange,
  className,
  ...props
}: FilterBarProps) {
  const activeFilterCount = Object.values(filterValues).filter((val) => val).length;
  const hasSearch = Boolean(onSearchChange);

  // Construir lista de filtros activos con etiquetas amigables
  const activeFilters = filters
    .filter((filter) => filterValues[filter.key])
    .map((filter) => {
      const selectedValue = filterValues[filter.key];
      const selectedOption = filter.options.find((opt) => opt.value === selectedValue);
      return {
        key: filter.key,
        label: filter.label,
        displayValue: selectedOption?.label || selectedValue,
      };
    });

  const handleRemoveFilter = (filterKey: string) => {
    onFilterChange?.(filterKey, "");
  };

  return (
    <div className={cx(styles.filterBar, className)} {...props}>
      {/* Encabezado */}
      <div className={styles.header}>
        <h3 className={styles.title}>Filtros</h3>
        {showFilterCount && activeFilterCount > 0 && (
          <span className={styles.badge}>{activeFilterCount}</span>
        )}
        
        {/* Selector de vista integrado en el header - Toggle entre iconos */}
        {enableViewToggle && onViewModeChange && (
          <div className={styles.viewToggleGroup}>
            {/* Grid option */}
            <label className={styles.viewToggleLabel}>
              <input
                type="radio"
                name="viewMode"
                value="grid"
                checked={viewMode === "grid"}
                onChange={() => onViewModeChange("grid")}
                className={styles.viewToggleInput}
                aria-label="Vista de grilla"
              />
              <span className={styles.viewToggleOption} title="Grilla">
                <Grid3x3 size={18} />
              </span>
            </label>

            {/* List option */}
            <label className={styles.viewToggleLabel}>
              <input
                type="radio"
                name="viewMode"
                value="list"
                checked={viewMode === "list"}
                onChange={() => onViewModeChange("list")}
                className={styles.viewToggleInput}
                aria-label="Vista de lista"
              />
              <span className={styles.viewToggleOption} title="Lista">
                <List size={18} />
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className={styles.content}>
        {/* Búsqueda (si aplica) */}
        {hasSearch && (
          <div className={styles.searchBox}>
            <SearchIcon />
            <input
              type="search"
              className={styles.searchInput}
              value={searchValue ?? ""}
              onChange={(e) => onSearchChange!(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label="Búsqueda"
            />
          </div>
        )}

        {/* Chips de filtros activos */}
        {showActiveFilterChips && activeFilters.length > 0 && (
          <div className={styles.activeFiltersChips}>
            {activeFilters.map((filter) => (
              <button
                key={filter.key}
                className={styles.filterChip}
                onClick={() => handleRemoveFilter(filter.key)}
                aria-label={`Eliminar filtro ${filter.label}: ${filter.displayValue}`}
                type="button"
              >
                <span className={styles.chipLabel}>
                  {filter.label}: <strong>{filter.displayValue}</strong>
                </span>
                <span className={styles.chipRemove} aria-hidden="true">
                  ✕
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Cuadrícula de filtros */}
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
                placeholder={filter.placeholder ?? "Todos"}
                value={filterValues[filter.key] ?? ""}
                onChange={(valor) => onFilterChange?.(filter.key, String(valor))}
              />
            </div>
          ))}
        </div>

        {/* Acciones */}
        {showClear && activeFilterCount > 0 && (
          <div className={styles.actions}>
            <Button variant="ghost" size="sm" onClick={onClear}>
              Limpiar todos los filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
