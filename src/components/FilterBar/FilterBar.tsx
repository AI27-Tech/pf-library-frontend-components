import type { HTMLAttributes, ReactNode } from "react";
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
      {/* Encabezado */}
      <div className={styles.header}>
        <h3 className={styles.title}>Filtros</h3>
        {showFilterCount && activeFilterCount > 0 && (
          <span className={styles.badge}>{activeFilterCount}</span>
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
                onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
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
