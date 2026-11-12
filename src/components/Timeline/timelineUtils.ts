import type { TimelineItemData } from "./types";

export type TimelineOrientation = "vertical" | "horizontal";

/**
 * Orientación que se pinta. Una línea horizontal se muestra vertical cuando el contenedor
 * mide menos que `stackBelow`. Sin medida (`ancho` indefinido, por ejemplo sin ResizeObserver)
 * se usa la orientación pedida.
 */
export function orientacionEfectiva(
  orientation: TimelineOrientation,
  stackBelow: number | undefined,
  ancho: number | undefined,
): TimelineOrientation {
  if (orientation === "horizontal" && stackBelow !== undefined && ancho !== undefined && ancho < stackBelow) {
    return "vertical";
  }
  return orientation;
}

/**
 * ¿Hay línea entre el punto `indice` y el siguiente en el orden visual?
 * El tramo lo origina el punto anterior en el orden de datos: con `reverse`, ese punto es el siguiente visual.
 * Es sólido solo si el punto originador está `completed`.
 */
export function tramoSolido<T extends Pick<TimelineItemData, "status">>(
  visibles: T[],
  indice: number,
  reverse: boolean,
): boolean {
  if (indice >= visibles.length - 1) return false;
  const origen = reverse ? visibles[indice + 1] : visibles[indice];
  return origen.status === "completed";
}

/** Orden visual: invierte los datos si `reverse`, conservando el índice original de cada punto. */
export function ordenarItems<T>(items: T[], reverse: boolean): Array<{ item: T; index: number }> {
  const conIndice = items.map((item, index) => ({ item, index }));
  return reverse ? conIndice.reverse() : conIndice;
}

/** Combina textos por defecto con los del consumidor. */
export function resolverLabels<T extends object>(defaults: T, personalizados?: Partial<T>): T {
  return { ...defaults, ...personalizados };
}
