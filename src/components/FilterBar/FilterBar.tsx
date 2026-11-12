import { useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { Grid3x3, List } from "lucide-react";
import { Select, type SelectOption, type SelectVariant } from "../Input/Select";
import { Button } from "../Button";
import { Popover } from "../Popover";
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
  /** Variante del select. "searchable" permite escribir para filtrar. Por defecto: "default". */
  variant?: SelectVariant;
  /** Placeholder del campo de búsqueda. Solo para la variante "searchable". */
  searchPlaceholder?: string;
  /** Texto cuando ninguna opción coincide. Solo para la variante "searchable". */
  noResultsText?: string;
}

export type FilterValues = Record<string, string>;

/** Textos de la interfaz de FilterBar. Cada uno se puede sobrescribir con `labels`. */
export interface FilterBarLabels {
  /** Título del panel y texto del botón "Filtros" en `layout="toolbar"`. */
  title: string;
  /** Placeholder del campo de búsqueda. */
  search: string;
  /** Texto del botón que quita todos los filtros. */
  clearAll: string;
  /** Opción que representa "sin filtro" cuando el filtro no define `placeholder`. */
  all: string;
  /** Etiqueta accesible del chip de un filtro activo. */
  remove: (label: string, value: string) => string;
}

const defaultLabels: FilterBarLabels = {
  title: "Filtros",
  search: "Buscar...",
  clearAll: "Limpiar todos los filtros",
  all: "Todos",
  remove: (label, value) => `Eliminar filtro ${label}: ${value}`,
};

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
  /** Placeholder de búsqueda. Por defecto: `labels.search`. */
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
  /**
   * Disposición. `panel` muestra todos los filtros en una cuadrícula (por defecto).
   * `toolbar` muestra una fila con búsqueda y un botón "Filtros (n)" que abre los filtros en un `Popover`.
   */
  layout?: "panel" | "toolbar";
  /** Textos de la interfaz. Parciales: los no indicados usan los valores en español. */
  labels?: Partial<FilterBarLabels>;
  /** Estado de carga. Deshabilita búsqueda, filtros y el botón de filtros. */
  loading?: boolean;
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
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
  searchPlaceholder,
  showFilterCount = true,
  showActiveFilterChips = true,
  enableViewToggle = false,
  viewMode = "grid",
  onViewModeChange,
  layout = "panel",
  labels: labelsProp,
  loading = false,
  className,
  ...props
}: FilterBarProps) {
  const labels: FilterBarLabels = { ...defaultLabels, ...labelsProp };
  const [popoverOpen, setPopoverOpen] = useState(false);
  const triggerAnchorRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const closePopover = () => setPopoverOpen(false);
  // El contenido del popover está oculto hasta medirse; el foco se mueve al panel ya visible.
  const focusPanel = () => panelRef.current?.focus();

  const activeFilterCount = Object.values(filterValues).filter((val) => val).length;
  const hasSearch = Boolean(onSearchChange);
  const isToolbar = layout === "toolbar";

  // Construir lista de filtros activos con etiquetas amigables
  const activeFilters = filters
    .filter((filter) => filterValues[filter.key])
    .map((filter) => {
      const selectedValue = filterValues[filter.key];
      const selectedOption = filter.options.find((opt) => opt.value === selectedValue);
      return {
        key: filter.key,
        label: filter.label,
        labelText: typeof filter.label === "string" ? filter.label : filter.key,
        displayValue: selectedOption?.label || selectedValue,
      };
    });

  const handleRemoveFilter = (filterKey: string) => {
    onFilterChange?.(filterKey, "");
  };

  const searchBox = hasSearch && (
    <div className={styles.searchBox}>
      <SearchIcon />
      <input
        type="search"
        className={styles.searchInput}
        value={searchValue ?? ""}
        onChange={(e) => onSearchChange!(e.target.value)}
        placeholder={searchPlaceholder ?? labels.search}
        aria-label="Búsqueda"
        disabled={loading}
      />
    </div>
  );

  const chips = showActiveFilterChips && activeFilters.length > 0 && (
    <div className={styles.activeFiltersChips}>
      {activeFilters.map((filter) => (
        <button
          key={filter.key}
          className={styles.filterChip}
          onClick={() => handleRemoveFilter(filter.key)}
          aria-label={labels.remove(filter.labelText, String(filter.displayValue))}
          type="button"
          disabled={loading}
        >
          <span className={styles.chipLabel}>
            {filter.label}: <strong>{filter.displayValue}</strong>
          </span>
          <span className={styles.chipRemove}>
            <CloseIcon />
          </span>
        </button>
      ))}
    </div>
  );

  const filtersGrid = (
    <div className={styles.filtersGrid}>
      {filters.map((filter) => {
        const value = filterValues[filter.key];
        const isActive = Boolean(value);
        return (
          <div key={filter.key} className={styles.filterColumn}>
            <label className={styles.filterLabel}>
              {filter.icon && <span className={styles.icon}>{filter.icon}</span>}
              <span>{filter.label}</span>
            </label>
            <Select
              className={cx(styles.filterSelect, isActive && styles.filterSelectActive)}
              options={filter.options}
              variant={filter.variant}
              searchPlaceholder={filter.searchPlaceholder}
              noResultsText={filter.noResultsText}
              placeholder={filter.placeholder ?? labels.all}
              value={value ?? ""}
              disabled={loading}
              onChange={(valor) => onFilterChange?.(filter.key, String(valor))}
            />
          </div>
        );
      })}
    </div>
  );

  const clearButton = showClear && activeFilterCount > 0 && (
    <Button variant="ghost" size="sm" onClick={onClear} disabled={loading}>
      {labels.clearAll}
    </Button>
  );

  const viewToggle = enableViewToggle && onViewModeChange && (
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
  );

  if (isToolbar) {
    return (
      <div className={cx(styles.filterBar, styles.toolbarLayout, className)} {...props}>
        <div className={styles.toolbar}>
          {hasSearch && <div className={styles.toolbarSearch}>{searchBox}</div>}

          <div ref={triggerAnchorRef} className={styles.triggerAnchor}>
            <Button
              variant="outline"
              size="sm"
              aria-haspopup="dialog"
              aria-expanded={popoverOpen}
              onClick={() => setPopoverOpen((open) => !open)}
              disabled={loading}
            >
              {activeFilterCount > 0 ? `${labels.title} (${activeFilterCount})` : labels.title}
            </Button>
          </div>

          {viewToggle}
        </div>

        {chips}

        <Popover
          anchorRef={triggerAnchorRef}
          open={popoverOpen}
          onClose={closePopover}
          align="start"
          role="dialog"
          aria-label={labels.title}
          onPositioned={focusPanel}
        >
          <div ref={panelRef} tabIndex={-1} className={styles.popoverPanel}>
            {filtersGrid}
            {clearButton && <div className={styles.actions}>{clearButton}</div>}
          </div>
        </Popover>
      </div>
    );
  }

  return (
    <div className={cx(styles.filterBar, className)} {...props}>
      {/* Encabezado */}
      <div className={styles.header}>
        <h3 className={styles.title}>{labels.title}</h3>
        {showFilterCount && activeFilterCount > 0 && (
          <span className={styles.badge}>{activeFilterCount}</span>
        )}

        {/* Selector de vista integrado en el header - Toggle entre iconos */}
        {viewToggle}
      </div>

      {/* Contenido */}
      <div className={styles.content}>
        {searchBox}
        {chips}
        {filtersGrid}
        {clearButton && <div className={styles.actions}>{clearButton}</div>}
      </div>
    </div>
  );
}
