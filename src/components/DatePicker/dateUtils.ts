/** Fecha de calendario, sin hora ni zona. El mes va de 1 a 12. */
export interface DateParts {
  y: number;
  m: number;
  d: number;
}

/** Primer día de la semana: 0 = domingo, 1 = lunes (valor por defecto, D8). */
export type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const ISO_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
// Acepta `/`, `-` o `.` como separador, siempre el mismo en ambas posiciones.
const DISPLAY_PATTERN = /^(\d{1,2})([/.-])(\d{1,2})\2(\d{4})$/;
const MS_PER_DAY = 86_400_000;

/** Marca de medianoche UTC de una fecha de calendario. Evita `new Date(string)`. */
function utcTime({ y, m, d }: DateParts): number {
  const date = new Date(0);
  // setUTCFullYear evita que Date.UTC convierta los años 0 a 99 en 1900 a 1999.
  date.setUTCFullYear(y, m - 1, d);
  return date.getTime();
}

/** Convierte una marca UTC en fecha de calendario. */
function fromUtcTime(time: number): DateParts {
  const date = new Date(time);
  return {
    y: date.getUTCFullYear(),
    m: date.getUTCMonth() + 1,
    d: date.getUTCDate(),
  };
}

function pad(value: number, length: number): string {
  return String(value).padStart(length, "0");
}

/** Valida mes y día. Devuelve la fecha o `null` si no existe. */
function validate(y: number, m: number, d: number): DateParts | null {
  if (m < 1 || m > 12) return null;
  if (d < 1 || d > daysInMonth(y, m)) return null;
  return { y, m, d };
}

export function isLeapYear(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

export function daysInMonth(y: number, m: number): number {
  const days = [31, isLeapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days[m - 1];
}

/** Día de la semana: 0 = domingo a 6 = sábado. */
export function weekdayOf(date: DateParts): number {
  return new Date(utcTime(date)).getUTCDay();
}

export function addDays(date: DateParts, days: number): DateParts {
  return fromUtcTime(utcTime(date) + days * MS_PER_DAY);
}

/**
 * Suma meses. Si el día no existe en el mes destino, usa el último día de ese mes
 * (31 de enero + 1 mes = 28 o 29 de febrero).
 */
export function addMonths(date: DateParts, months: number): DateParts {
  const total = date.y * 12 + (date.m - 1) + months;
  const y = Math.floor(total / 12);
  const m = total - y * 12 + 1;
  const d = Math.min(date.d, daysInMonth(y, m));
  return { y, m, d };
}

/** Orden cronológico: negativo si `a` es anterior, 0 si son iguales, positivo si es posterior. */
export function compareDates(a: DateParts, b: DateParts): number {
  return a.y - b.y || a.m - b.m || a.d - b.d;
}

/** Indica si la fecha está en el rango cerrado [min, max]. Un límite ausente no restringe. */
export function isWithin(
  date: DateParts,
  min?: DateParts | null,
  max?: DateParts | null,
): boolean {
  if (min && compareDates(date, min) < 0) return false;
  if (max && compareDates(date, max) > 0) return false;
  return true;
}

/** Lee `AAAA-MM-DD`. Devuelve `null` si el formato o la fecha no son válidos. */
export function parseISODate(text: string): DateParts | null {
  const match = ISO_PATTERN.exec(text);
  if (!match) return null;
  return validate(Number(match[1]), Number(match[2]), Number(match[3]));
}

/** Escribe `AAAA-MM-DD`. */
export function formatISODate(date: DateParts): string {
  return `${pad(date.y, 4)}-${pad(date.m, 2)}-${pad(date.d, 2)}`;
}

/**
 * Rejilla de 6 semanas (42 días) para un mes. Incluye días de los meses vecinos
 * para completar las semanas.
 */
export function buildMonthGrid(
  y: number,
  m: number,
  weekStartsOn: WeekStart,
): DateParts[][] {
  const first: DateParts = { y, m, d: 1 };
  const offset = (weekdayOf(first) - weekStartsOn + 7) % 7;
  const start = addDays(first, -offset);
  return Array.from({ length: 6 }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => addDays(start, week * 7 + day)),
  );
}

/** Lee `DD/MM/AAAA` con `/`, `-` o `.`. Devuelve `null` si no es válida. */
export function parseDisplayDate(text: string): DateParts | null {
  const match = DISPLAY_PATTERN.exec(text.trim());
  if (!match) return null;
  return validate(Number(match[4]), Number(match[3]), Number(match[1]));
}

/** Escribe `DD/MM/AAAA`. */
export function formatDisplayDate(date: DateParts): string {
  return `${pad(date.d, 2)}/${pad(date.m, 2)}/${pad(date.y, 4)}`;
}

/** Fecha de hoy en la zona local. Es la única función que lee el reloj. */
export function today(): DateParts {
  const now = new Date();
  return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
}
