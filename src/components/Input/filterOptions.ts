import type { SelectOption } from "./Select";

/** Normaliza un texto para comparar: sin acentos, sin mayúsculas y sin espacios sobrantes. */
export function normalizeText(text: string): string {
  return text.normalize("NFD").replace(/\p{M}/gu, "").trim().toLowerCase();
}

/**
 * Devuelve las opciones cuyo `label` contiene el texto buscado.
 * Sin texto, devuelve todas las opciones.
 */
export function filterOptions<T extends SelectOption>(options: T[], query: string): T[] {
  const needle = normalizeText(query);
  if (!needle) return options;
  return options.filter((option) => normalizeText(option.label).includes(needle));
}
