import type { HTMLAttributes, ReactNode } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "../Button";
import { cx } from "../../utils/cx";
import { SORTABLE_FIELD_LABELS, type SortableFieldListLabels } from "./labels";
import { useSortable, type SortableChange, type SortableDragItem } from "./useSortable";
import styles from "./SortableFieldList.module.css";

export type { SortableChange } from "./useSortable";

export interface SortableFieldItem extends SortableDragItem {
  /** Identificador estable del elemento. */
  id: string;
  /** Nombre del elemento para lectores de pantalla y para los textos de sus botones, por ejemplo "Destino 2". */
  label: string;
  /** Marca la posición como obligatoria con un asterisco. */
  required?: boolean;
  /** Impide mover este elemento. */
  disabled?: boolean;
}

export interface SortableFieldListProps<T extends SortableFieldItem = SortableFieldItem>
  extends Omit<HTMLAttributes<HTMLUListElement>, "children" | "onChange"> {
  /** Elementos en su orden actual. El orden lo guarda el consumidor. */
  items: T[];
  /** Se llama al soltar un elemento en otra posición, con la lista ya reordenada. */
  onReorder: (items: T[], change: SortableChange) => void;
  /**
   * Etiqueta fija de cada posición, por ejemplo "Destino 1". No se mueve al arrastrar:
   * al reordenar se mueve la tarjeta y la etiqueta se queda en su lugar.
   */
  slotLabel: (index: number) => ReactNode;
  /** Dibuja el control de cada tarjeta, por ejemplo un `Input`. El portal decide qué control usar. */
  renderField: (item: T, index: number) => ReactNode;
  /** Muestra un icono para quitar en cada tarjeta y lo llama con el elemento de esa tarjeta. */
  onRemove?: (item: T) => void;
  /** Muestra el botón para agregar un elemento al final de la lista. */
  onAdd?: () => void;
  /** Texto del botón de agregar. Por defecto, `labels.add`. */
  addLabel?: ReactNode;
  /** Bloquea el reordenamiento, quitar y agregar. */
  disabled?: boolean;
  /** Sobrescribe los textos por defecto (en español). */
  labels?: Partial<SortableFieldListLabels>;
}

/**
 * Lista de campos repetibles y reordenables, por ejemplo los destinos de un viaje.
 * Cada posición tiene una etiqueta fija (`slotLabel`) y, debajo, una tarjeta con asa para arrastrar,
 * el control y un icono para quitar. Al arrastrar solo se mueve la tarjeta; la etiqueta de la posición
 * se queda en su lugar. El botón de agregar va al final. Funciona con mouse, dedo y teclado
 * (espacio toma y suelta, flechas mueven, escape cancela). El orden lo guarda el consumidor:
 * `onReorder` entrega la lista nueva y el consumidor la pasa en `items`.
 */
export function SortableFieldList<T extends SortableFieldItem = SortableFieldItem>({
  items,
  onReorder,
  slotLabel,
  renderField,
  onRemove,
  onAdd,
  addLabel,
  disabled = false,
  labels,
  className,
  ...props
}: SortableFieldListProps<T>) {
  const text = { ...SORTABLE_FIELD_LABELS, ...labels };
  const sortable = useSortable({
    items,
    onReorder,
    disabled,
    text,
    nameOf: (item) => item.label,
  });

  return (
    <div className={cx(styles.root, className)}>
      {/* Una posición por índice: el `li` y su etiqueta no cambian de sitio; la tarjeta sí. */}
      <ul className={styles.list} {...props}>
        {items.map((item, index) => {
          const isDragged = sortable.isDragging(item.id);
          const drop = sortable.dropPosition(index);
          const handle = sortable.handleProps(item, index);
          const rowDisabled = disabled || Boolean(item.disabled);
          return (
            <li key={index} className={styles["ui-sortable-slot"]}>
              <span className={styles["ui-sortable-slot-label"]}>
                {slotLabel(index)}
                {item.required && (
                  <>
                    <span className={styles.required} aria-hidden="true">
                      *
                    </span>
                    <span className="ui-sr-only">{`, ${text.required}`}</span>
                  </>
                )}
              </span>
              <div
                key={item.id}
                ref={sortable.rowRef(item.id)}
                className={cx(styles.row, isDragged && styles["ui-sortable-dragging"])}
                data-dragging={isDragged || undefined}
                data-drop={drop}
              >
                <button type="button" className={styles["ui-sortable-handle"]} {...handle}>
                  <GripVertical aria-hidden="true" />
                </button>
                <div className={styles.control}>{renderField(item, index)}</div>
                {onRemove && (
                  <button
                    type="button"
                    className={styles["ui-sortable-remove"]}
                    aria-label={text.remove(item.label)}
                    disabled={rowDisabled}
                    onClick={() => onRemove(item)}
                  >
                    <Trash2 aria-hidden="true" />
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {onAdd && (
        <Button
          type="button"
          variant="outline"
          fullWidth
          startIcon={<Plus />}
          disabled={disabled}
          onClick={onAdd}
        >
          {addLabel ?? text.add}
        </Button>
      )}
      <span id={sortable.instructionsId} className="ui-sr-only">
        {sortable.instructions}
      </span>
      <span className="ui-sr-only" role="status" aria-live="polite" aria-atomic="true">
        {sortable.announcement}
      </span>
    </div>
  );
}
