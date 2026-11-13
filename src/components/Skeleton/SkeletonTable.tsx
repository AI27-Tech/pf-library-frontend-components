import type { HTMLAttributes, Key } from "react";
import { Table, type Column } from "../Table";

export interface SkeletonTableProps extends HTMLAttributes<HTMLDivElement> {
  /** Número de filas en carga. Por defecto: 5. */
  rows?: number;
  /** Número de columnas en carga. Por defecto: 4. */
  columns?: number;
  /** Densidad de filas. Por defecto: "comfortable". */
  density?: "comfortable" | "compact";
  /** Muestra la columna de selección. */
  selectable?: boolean;
  /** Muestra la columna de expansión. */
  expandable?: boolean;
}

const noop = () => {};

/**
 * Tabla en carga para usar fuera de un `Table`. Es un `Table` con `loading`, así que
 * usa las mismas densidades, columnas y celdas. Dentro de un `Table` real, usar
 * `loading` en vez de este componente.
 */
export function SkeletonTable({
  rows = 5,
  columns = 4,
  density = "comfortable",
  selectable = false,
  expandable = false,
  className,
  ...props
}: SkeletonTableProps) {
  const placeholderColumns: Column<unknown>[] = Array.from({ length: columns }, (_, index) => ({
    key: `skeleton-${index}`,
    header: null,
  }));
  const noSelection = new Set<Key>();

  return (
    <div role="status" aria-busy="true" className={className} {...props}>
      <span className="ui-sr-only">Cargando</span>
      <Table<unknown>
        columns={placeholderColumns}
        data={[]}
        loading
        loadingRows={rows}
        density={density}
        hoverable={false}
        selectedKeys={selectable ? noSelection : undefined}
        onSelectionChange={selectable ? noop : undefined}
        expandedContent={expandable ? () => null : undefined}
        aria-label="Cargando tabla"
      />
    </div>
  );
}
