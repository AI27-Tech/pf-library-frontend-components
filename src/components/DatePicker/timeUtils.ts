/** Formato de hora: 24 horas o 12 horas con AM/PM. */
export type TimeFormat = "24h" | "12h";

/** Segmentos editables del campo. `period` solo existe en formato 12 horas. */
export type TimeField = "h" | "m" | "s" | "period";

export type Period = "" | "AM" | "PM";

/**
 * Estado de cada segmento. Las horas se guardan como se muestran (00 a 23 en 24 h,
 * 01 a 12 en 12 h). Un segmento puede tener un solo dígito mientras se escribe.
 */
export interface TimeSegments {
  h: string;
  m: string;
  s: string;
  period: Period;
}

/** Hora del día en 24 horas. */
export interface TimeParts {
  hour: number;
  minute: number;
  second: number;
}

export interface FieldRange {
  min: number;
  max: number;
}

export interface DigitResult {
  /** Valor del segmento después de escribir el dígito. */
  value: string;
  /** Si el foco debe pasar al siguiente segmento. */
  advance: boolean;
}

export const EMPTY_SEGMENTS: TimeSegments = { h: "", m: "", s: "", period: "" };

/** Acepta `H:mm`, `HH:mm`, `HH:mm:ss`. Los segundos son opcionales. */
const TIME_PATTERN = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;
/** Solo `HH:mm`, para `getTimeRange`. */
const HOUR_MINUTE_PATTERN = /^(\d{2}):(\d{2})$/;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_MINUTE = 60;

export function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

/** Lee `H:mm`, `HH:mm` o `HH:mm:ss` en 24 horas. Devuelve `null` si no es válida. */
export function parseTime(text: string): TimeParts | null {
  const match = TIME_PATTERN.exec(text.trim());
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const second = match[3] !== undefined ? Number(match[3]) : 0;
  if (hour > 23 || minute > 59 || second > 59) return null;
  return { hour, minute, second };
}

export function toSeconds(time: TimeParts): number {
  return time.hour * SECONDS_PER_HOUR + time.minute * SECONDS_PER_MINUTE + time.second;
}

export function fromSeconds(total: number): TimeParts {
  return {
    hour: Math.floor(total / SECONDS_PER_HOUR),
    minute: Math.floor((total % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE),
    second: total % SECONDS_PER_MINUTE,
  };
}

/** Escribe `HH:mm`, o `HH:mm:ss` con `withSeconds`. Siempre en 24 horas. */
export function formatTime(time: TimeParts, withSeconds: boolean): string {
  const base = `${pad2(time.hour)}:${pad2(time.minute)}`;
  return withSeconds ? `${base}:${pad2(time.second)}` : base;
}

export function fieldRange(field: Exclude<TimeField, "period">, format: TimeFormat): FieldRange {
  if (field === "h") {
    return format === "24h" ? { min: 0, max: 23 } : { min: 1, max: 12 };
  }
  return { min: 0, max: 59 };
}

/** Convierte una hora de 24 horas en los segmentos del formato indicado. */
export function segmentsFromTime(
  time: TimeParts | null,
  format: TimeFormat,
  withSeconds: boolean,
): TimeSegments {
  if (!time) return EMPTY_SEGMENTS;
  const seconds = withSeconds ? pad2(time.second) : "";
  if (format === "24h") {
    return { h: pad2(time.hour), m: pad2(time.minute), s: seconds, period: "" };
  }
  return {
    h: pad2(time.hour % 12 || 12),
    m: pad2(time.minute),
    s: seconds,
    period: time.hour >= 12 ? "PM" : "AM",
  };
}

/**
 * Valor `HH:mm[:ss]` en 24 horas, o `null` si falta algún segmento requerido.
 * Solo se emite un valor cuando todos los segmentos están completos.
 */
export function timeFromSegments(
  segments: TimeSegments,
  format: TimeFormat,
  withSeconds: boolean,
): string | null {
  if (segments.h.length !== 2 || segments.m.length !== 2) return null;
  if (withSeconds && segments.s.length !== 2) return null;
  if (format === "12h" && segments.period === "") return null;
  let hour = Number(segments.h);
  if (format === "12h") {
    hour = (hour % 12) + (segments.period === "PM" ? 12 : 0);
  }
  return formatTime(
    { hour, minute: Number(segments.m), second: withSeconds ? Number(segments.s) : 0 },
    withSeconds,
  );
}

/**
 * Aplica un dígito a un segmento.
 * - Con un dígito previo, si la combinación es válida, completa y avanza.
 * - Si la combinación no es válida, usa el dígito solo (con cero delante) y avanza.
 * - Sin dígito previo, un dígito que no puede ser decenas completa el valor y avanza.
 * Devuelve `null` si el dígito no cabe en el rango.
 */
export function typeDigit(current: string, digit: number, range: FieldRange): DigitResult | null {
  const fits = (value: number) => value >= range.min && value <= range.max;

  if (current.length === 1) {
    const candidate = Number(current + String(digit));
    if (fits(candidate)) return { value: pad2(candidate), advance: true };
    return fits(digit) ? { value: pad2(digit), advance: true } : null;
  }

  if (digit * 10 > range.max) {
    return fits(digit) ? { value: pad2(digit), advance: true } : null;
  }
  return { value: String(digit), advance: false };
}

/** Suma o resta un paso con vuelta al otro extremo del rango. Un segmento vacío empieza en el extremo. */
export function stepValue(current: string, delta: 1 | -1, range: FieldRange, step: number): string {
  const size = range.max - range.min + 1;
  if (current === "") {
    return pad2(delta > 0 ? range.min : range.max);
  }
  const offset = Number(current) - range.min + delta * step;
  return pad2(range.min + (((offset % size) + size) % size));
}

/** Indica si un intervalo de segundos queda completamente fuera de `[min, max]`. */
export function isRangeBlocked(
  startSec: number,
  endSec: number,
  minSec: number | null,
  maxSec: number | null,
): boolean {
  if (minSec !== null && endSec < minSec) return true;
  if (maxSec !== null && startSec > maxSec) return true;
  return false;
}

/**
 * Genera horas desde `start` hasta `end` (incluida), separadas por `interval`.
 * Todos los valores son `HH:mm`. Devuelve `[]` si algún valor no es `HH:mm`,
 * si el intervalo es 0 o si `end` es anterior a `start`.
 */
export function getTimeRange(options: { start: string; end: string; interval: string }): string[] {
  const start = parseHourMinute(options.start);
  const end = parseHourMinute(options.end);
  const interval = parseHourMinute(options.interval);
  if (start === null || end === null || interval === null) return [];
  if (interval === 0 || end < start) return [];

  const values: string[] = [];
  for (let current = start; current <= end; current += interval) {
    values.push(formatTime(fromSeconds(current), false));
  }
  return values;
}

/** Devuelve los segundos de un `HH:mm` válido, o `null`. */
function parseHourMinute(text: string): number | null {
  if (!HOUR_MINUTE_PATTERN.test(text)) return null;
  const time = parseTime(text);
  return time ? toSeconds(time) : null;
}
