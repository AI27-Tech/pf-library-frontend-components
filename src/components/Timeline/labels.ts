/** Textos por defecto de Timeline, en español. Se sobrescriben con `labels`. */
export const TIMELINE_LABELS = {
  completed: "Completado",
  current: "En curso",
  upcoming: "Pendiente",
  error: "Error",
  warning: "Aviso",
  showMore: (n: number) => `Mostrar ${n} más`,
  showLess: "Mostrar menos",
  empty: "Sin eventos",
};
export type TimelineLabels = typeof TIMELINE_LABELS;
