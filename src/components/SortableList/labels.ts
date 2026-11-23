/** Textos por defecto de SortableFieldList, en español. Se sobrescriben con `labels`. */
export const SORTABLE_FIELD_LABELS = {
  handle: (name: string) => `Reordenar ${name}`,
  remove: (name: string) => `Quitar ${name}`,
  /** Texto por defecto del botón de agregar. */
  add: "Agregar",
  /** Texto para lectores de pantalla del indicador de campo obligatorio. */
  required: "obligatorio",
  instructions:
    "Presiona espacio para tomar el elemento, las flechas arriba y abajo para moverlo, espacio para soltarlo y escape para cancelar.",
  lifted: (name: string, position: number, total: number) =>
    `${name} tomado. Posición ${position} de ${total}.`,
  moved: (name: string, position: number, total: number) =>
    `${name}, posición ${position} de ${total}.`,
  dropped: (name: string, position: number, total: number) =>
    `${name} soltado en la posición ${position} de ${total}.`,
  cancelled: (name: string) => `Reordenamiento cancelado. ${name} conserva su posición.`,
};

export type SortableFieldListLabels = typeof SORTABLE_FIELD_LABELS;
