/** Valor aceptado por `cx`: una clase, o un valor vacío que se descarta. */
export type ClassValue = string | false | null | undefined;

/**
 * Une nombres de clase CSS omitiendo los valores vacíos o falsos.
 *
 * @example
 * cx("ui-btn", isActive && "ui-btn--active", undefined) // "ui-btn ui-btn--active"
 */
export function cx(...values: ClassValue[]): string {
  return values.filter((value): value is string => Boolean(value)).join(" ");
}
