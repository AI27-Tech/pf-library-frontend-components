export type Presence = "online" | "offline";

const LOCALE = "es-MX";

export function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function initials(name?: string) {
  if (!name) return "";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function parseFecha(fecha: Date | string): Date | null {
  const d = typeof fecha === "string" ? new Date(fecha) : fecha;
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Hora local `HH:mm` en es-MX. Devuelve cadena vacía si la fecha no es válida. */
export function formatHora(fecha: Date | string): string {
  const d = parseFecha(fecha);
  if (!d) return "";
  return d.toLocaleTimeString(LOCALE, { hour: "2-digit", minute: "2-digit" });
}

/** Fecha y hora cortas en es-MX, por ejemplo "12 nov, 10:40". */
export function formatFechaHora(fecha: Date | string): string {
  const d = parseFecha(fecha);
  if (!d) return "";
  return d.toLocaleString(LOCALE, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

/** Tamaño legible en KB o MB. */
export function formatearTamano(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/** Misma fecha local (año, mes y día). */
export function esMismoDia(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Clave `YYYY-MM-DD` del día local de una fecha. Cadena vacía si la fecha no es válida. */
export function claveDiaLocal(fecha: string): string {
  const d = parseFecha(fecha);
  if (!d) return "";
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

/** Etiqueta de un divisor de día: "Hoy", "Ayer" o la fecha larga en es-MX. */
export function etiquetaDia(fecha: Date, ahora: Date, textos: { today: string; yesterday: string }): string {
  if (esMismoDia(fecha, ahora)) return textos.today;
  const ayer = new Date(ahora);
  ayer.setDate(ayer.getDate() - 1);
  if (esMismoDia(fecha, ayer)) return textos.yesterday;
  return fecha.toLocaleDateString(LOCALE, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: fecha.getFullYear() === ahora.getFullYear() ? undefined : "numeric",
  });
}

/**
 * ¿Está el scroll cerca del final? `umbralPx` es la distancia máxima desde el fondo.
 * Función pura para poder probarla sin layout.
 */
export function isNearBottom(
  medidas: { scrollHeight: number; scrollTop: number; clientHeight: number },
  umbralPx: number,
): boolean {
  return medidas.scrollHeight - medidas.scrollTop - medidas.clientHeight <= umbralPx;
}

/**
 * Genera un UUID v4 para `clientMessageId` (clave de idempotencia del envío).
 * Usa `crypto.randomUUID` y, en contextos donde no existe, `getRandomValues`.
 */
export function generarClientMessageId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
