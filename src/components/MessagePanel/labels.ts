/**
 * Textos por defecto en español de MessagePanel. Cada componente acepta `labels`
 * con un subconjunto de estas claves; lo que no se pase conserva el valor de aquí.
 */

export const PANEL_LABELS = {
  minimize: "Minimizar",
  expand: "Expandir",
  close: "Cerrar conversación",
  conversation: "Conversación",
};
export type PanelLabels = typeof PANEL_LABELS;

export const DOCK_LABELS = {
  dock: "Muelle de mensajería",
  title: "Mensajería",
  barLabel: "Lista de conversaciones",
  minimize: "Minimizar",
  expand: "Expandir",
  unread: "Sin leer",
  overflow: "Más conversaciones",
};
export type DockLabels = typeof DOCK_LABELS;

export const LIST_LABELS = {
  loadPrevious: "Cargar mensajes anteriores",
  loadingPrevious: "Cargando…",
  newMessages: (n: number) => `${n} ${n === 1 ? "mensaje nuevo" : "mensajes nuevos"}`,
  unreadDivider: "Mensajes nuevos",
  empty: "Aún no hay mensajes",
  today: "Hoy",
  yesterday: "Ayer",
};
export type ListLabels = typeof LIST_LABELS;

export const BUBBLE_LABELS = {
  sending: "Enviando…",
  failed: "No se envió",
  retry: "Reintentar",
  you: "Tú",
};
export type BubbleLabels = typeof BUBBLE_LABELS;

export const COMPOSER_LABELS = {
  placeholder: "Escribe un mensaje…",
  readOnly: "Conversación en solo lectura",
  send: "Enviar mensaje",
  attach: "Adjuntar archivo",
  message: "Mensaje",
};
export type ComposerLabels = typeof COMPOSER_LABELS;

export const STATUS_LABELS = {
  abierta: "Abierta",
  solo_lectura: "Solo lectura",
  cerrada: "Cerrada",
  reclamadaPorTi: "Reclamada por ti",
  reclamadaPor: (nombre: string) => `Reclamada por ${nombre}`,
  enElPool: "En el pool",
  atendida: "Atendida",
  escribeHasta: (fecha: string) => `Escribe hasta ${fecha}`,
};
export type StatusLabels = typeof STATUS_LABELS;

/** Combina los textos por defecto con los que pasa el consumidor. */
export function resolverLabels<T extends object>(defaults: T, personalizados?: Partial<T>): T {
  return { ...defaults, ...personalizados };
}
