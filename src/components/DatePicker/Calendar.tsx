import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { cx } from "../Input/utils";
import styles from "./Calendar.module.css";
import {
  addDays,
  addMonths,
  buildMonthGrid,
  compareDates,
  daysInMonth,
  formatISODate,
  isWithin,
  parseISODate,
  today,
  weekdayOf,
  type DateParts,
  type WeekStart,
} from "./dateUtils";

export type CalendarView = "days" | "months" | "years";

export interface CalendarProps {
  /** Fecha seleccionada en `YYYY-MM-DD`. `""` o sin valor significa ninguna selección. */
  value?: string;
  /** Se llama con la fecha elegida en `YYYY-MM-DD`. */
  onChange?: (value: string) => void;
  /** Primera fecha seleccionable en `YYYY-MM-DD`. Inclusiva. */
  min?: string;
  /** Última fecha seleccionable en `YYYY-MM-DD`. Inclusiva. */
  max?: string;
  /** Marca fechas individuales como no seleccionables. */
  isDateDisabled?: (value: string) => boolean;
  /** Idioma para nombres de meses y días. Por defecto: "es-MX". */
  locale?: string;
  /** Primer día de la semana: 0 = domingo, 1 = lunes. Por defecto: 1 (D8). */
  weekStartsOn?: WeekStart;
  /** Enfoca la celda activa al montar. */
  autoFocus?: boolean;
  className?: string;
}

const DEFAULT_LOCALE = "es-MX";
const DEFAULT_WEEK_START: WeekStart = 1;
/** Domingo 7 de enero de 2024. Sirve de referencia para los encabezados de día. */
const REFERENCE_SUNDAY: DateParts = { y: 2024, m: 1, d: 7 };
/** Meses por paso de navegación según la vista. */
const STEP_MONTHS: Record<CalendarView, number> = { days: 1, months: 12, years: 144 };
const YEARS_PER_BLOCK = 12;

interface Formatters {
  month: Intl.DateTimeFormat;
  monthYear: Intl.DateTimeFormat;
  weekdayShort: Intl.DateTimeFormat;
  weekdayLong: Intl.DateTimeFormat;
  dayLabel: Intl.DateTimeFormat;
}

function createFormatters(locale: string): Formatters {
  // Las fechas se construyen con Date.UTC y se formatean en UTC, así el nombre
  // del día no cambia según la zona horaria del navegador.
  const utc = { timeZone: "UTC" } as const;
  return {
    month: new Intl.DateTimeFormat(locale, { ...utc, month: "long" }),
    monthYear: new Intl.DateTimeFormat(locale, { ...utc, month: "long", year: "numeric" }),
    weekdayShort: new Intl.DateTimeFormat(locale, { ...utc, weekday: "short" }),
    weekdayLong: new Intl.DateTimeFormat(locale, { ...utc, weekday: "long" }),
    dayLabel: new Intl.DateTimeFormat(locale, {
      ...utc,
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };
}

function toUtc(date: DateParts): Date {
  return new Date(Date.UTC(date.y, date.m - 1, date.d));
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Lleva la fecha al rango [min, max]. */
function clampDate(date: DateParts, min: DateParts | null, max: DateParts | null): DateParts {
  if (min && compareDates(date, min) < 0) return min;
  if (max && compareDates(date, max) > 0) return max;
  return date;
}

/** Posición del día dentro de su semana, contando desde `weekStartsOn`. */
function offsetInWeek(date: DateParts, weekStartsOn: WeekStart): number {
  return (weekdayOf(date) - weekStartsOn + 7) % 7;
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  const points = direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6";
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points={points} />
    </svg>
  );
}

export function Calendar({
  value,
  onChange,
  min,
  max,
  isDateDisabled,
  locale = DEFAULT_LOCALE,
  weekStartsOn = DEFAULT_WEEK_START,
  autoFocus = false,
  className,
}: CalendarProps) {
  const minDate = useMemo(() => (min ? parseISODate(min) : null), [min]);
  const maxDate = useMemo(() => (max ? parseISODate(max) : null), [max]);
  const formatters = useMemo(() => createFormatters(locale), [locale]);

  // Sin prop `value`, el calendario guarda la selección por su cuenta.
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState("");
  const currentValue = value ?? internalValue;
  const selected = parseISODate(currentValue);

  const [view, setView] = useState<CalendarView>("days");
  // `focus` es la fecha con foco de teclado. Su mes es el mes visible.
  const [focus, setFocus] = useState<DateParts>(() =>
    clampDate(selected ?? today(), minDate, maxDate),
  );
  const gridRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef(autoFocus);

  // Si la selección cambia desde fuera, el foco la sigue. Se ajusta durante el render
  // y no en un efecto, para evitar un render extra.
  const [syncedValue, setSyncedValue] = useState(currentValue);
  if (currentValue !== syncedValue) {
    setSyncedValue(currentValue);
    const parsed = parseISODate(currentValue);
    if (parsed) setFocus(parsed);
  }

  // Mueve el foco DOM a la celda activa después de una acción de teclado.
  useEffect(() => {
    if (!pendingFocus.current || view !== "days") return;
    pendingFocus.current = false;
    gridRef.current?.querySelector<HTMLElement>('[data-focus="true"]')?.focus();
  });

  function isDayDisabled(date: DateParts): boolean {
    if (!isWithin(date, minDate, maxDate)) return true;
    return isDateDisabled?.(formatISODate(date)) ?? false;
  }

  // Un mes está deshabilitado si ninguno de sus días cae en el rango.
  function isMonthDisabled(y: number, m: number): boolean {
    const first: DateParts = { y, m, d: 1 };
    const last: DateParts = { y, m, d: daysInMonth(y, m) };
    return !(
      (!maxDate || compareDates(first, maxDate) <= 0) &&
      (!minDate || compareDates(last, minDate) >= 0)
    );
  }

  function isYearDisabled(y: number): boolean {
    const first: DateParts = { y, m: 1, d: 1 };
    const last: DateParts = { y, m: 12, d: 31 };
    return !(
      (!maxDate || compareDates(first, maxDate) <= 0) &&
      (!minDate || compareDates(last, minDate) >= 0)
    );
  }

  function selectDate(date: DateParts) {
    if (isDayDisabled(date)) return;
    const iso = formatISODate(date);
    if (!isControlled) setInternalValue(iso);
    setFocus(date);
    onChange?.(iso);
  }

  function moveFocus(next: DateParts) {
    setFocus(next);
    pendingFocus.current = true;
  }

  function handleDayKeyDown(event: KeyboardEvent<HTMLDivElement>, date: DateParts) {
    // Con Shift, las flechas y PageUp/PageDown avanzan o retroceden un año.
    const yearStep = event.shiftKey;
    let next: DateParts;

    switch (event.key) {
      case "ArrowLeft":
        next = yearStep ? addMonths(date, -12) : addDays(date, -1);
        break;
      case "ArrowRight":
        next = yearStep ? addMonths(date, 12) : addDays(date, 1);
        break;
      case "ArrowUp":
        next = yearStep ? addMonths(date, -12) : addDays(date, -7);
        break;
      case "ArrowDown":
        next = yearStep ? addMonths(date, 12) : addDays(date, 7);
        break;
      case "PageUp":
        next = addMonths(date, yearStep ? -12 : -1);
        break;
      case "PageDown":
        next = addMonths(date, yearStep ? 12 : 1);
        break;
      case "Home":
        next = addDays(date, -offsetInWeek(date, weekStartsOn));
        break;
      case "End":
        next = addDays(date, 6 - offsetInWeek(date, weekStartsOn));
        break;
      case "Enter":
      case " ":
      case "Spacebar":
        event.preventDefault();
        selectDate(date);
        return;
      default:
        return;
    }

    event.preventDefault();
    moveFocus(next);
  }

  const todayParts = today();
  const weekdayIndexes = Array.from({ length: 7 }, (_, i) => (weekStartsOn + i) % 7);
  const weeks = buildMonthGrid(focus.y, focus.m, weekStartsOn);

  let title: string;
  let prevLabel: string;
  let nextLabel: string;
  if (view === "days") {
    title = capitalize(formatters.monthYear.format(toUtc(focus)));
    prevLabel = "Mes anterior";
    nextLabel = "Mes siguiente";
  } else if (view === "months") {
    title = String(focus.y);
    prevLabel = "Año anterior";
    nextLabel = "Año siguiente";
  } else {
    const blockStart = Math.floor(focus.y / YEARS_PER_BLOCK) * YEARS_PER_BLOCK;
    title = `${blockStart} – ${blockStart + YEARS_PER_BLOCK - 1}`;
    prevLabel = "Bloque anterior de años";
    nextLabel = "Bloque siguiente de años";
  }

  function nextTitleView(): CalendarView {
    return view === "days" ? "months" : "years";
  }

  function shiftFocus(direction: -1 | 1) {
    setFocus(addMonths(focus, direction * STEP_MONTHS[view]));
  }

  function renderDay(date: DateParts) {
    const iso = formatISODate(date);
    const isFocused = compareDates(date, focus) === 0;
    const isSelected = selected !== null && compareDates(date, selected) === 0;
    const isToday = compareDates(date, todayParts) === 0;
    const disabled = isDayDisabled(date);
    return (
      <div
        key={iso}
        role="gridcell"
        className={cx(
          styles.day,
          date.m !== focus.m && styles.outside,
          isToday && styles.today,
          isSelected && styles.selected,
          disabled && styles.disabled,
        )}
        data-date={iso}
        data-focus={isFocused}
        tabIndex={isFocused ? 0 : -1}
        aria-selected={isSelected}
        aria-disabled={disabled || undefined}
        aria-current={isToday ? "date" : undefined}
        aria-label={formatters.dayLabel.format(toUtc(date))}
        onClick={() => selectDate(date)}
        onKeyDown={(event) => handleDayKeyDown(event, date)}
      >
        {date.d}
      </div>
    );
  }

  return (
    <div className={cx(styles.calendar, className)}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.navButton}
          aria-label={prevLabel}
          onClick={() => shiftFocus(-1)}
        >
          <ChevronIcon direction="left" />
        </button>
        {view === "years" ? (
          <span className={styles.title}>{title}</span>
        ) : (
          <button
            type="button"
            className={styles.title}
            onClick={() => setView(nextTitleView())}
          >
            {title}
          </button>
        )}
        <button
          type="button"
          className={styles.navButton}
          aria-label={nextLabel}
          onClick={() => shiftFocus(1)}
        >
          <ChevronIcon direction="right" />
        </button>
      </div>

      {view === "days" && (
        <div ref={gridRef} role="grid" aria-label={title} className={styles.grid}>
          <div role="row" className={styles.row}>
            {weekdayIndexes.map((weekday) => {
              const reference = addDays(REFERENCE_SUNDAY, weekday);
              return (
                <div
                  key={weekday}
                  role="columnheader"
                  className={styles.weekday}
                  aria-label={formatters.weekdayLong.format(toUtc(reference))}
                >
                  {formatters.weekdayShort.format(toUtc(reference))}
                </div>
              );
            })}
          </div>
          {weeks.map((week) => (
            <div role="row" key={formatISODate(week[0])} className={styles.row}>
              {week.map(renderDay)}
            </div>
          ))}
        </div>
      )}

      {view === "months" && (
        <div className={styles.cells} role="group" aria-label={String(focus.y)}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
            const disabled = isMonthDisabled(focus.y, m);
            const isSelected = selected !== null && selected.y === focus.y && selected.m === m;
            return (
              <button
                key={m}
                type="button"
                className={cx(styles.cell, isSelected && styles.selected)}
                disabled={disabled}
                aria-pressed={isSelected}
                onClick={() => {
                  setFocus({ y: focus.y, m, d: Math.min(focus.d, daysInMonth(focus.y, m)) });
                  setView("days");
                }}
              >
                {capitalize(formatters.month.format(toUtc({ y: focus.y, m, d: 1 })))}
              </button>
            );
          })}
        </div>
      )}

      {view === "years" && (
        <div className={styles.cells} role="group" aria-label={title}>
          {Array.from({ length: YEARS_PER_BLOCK }, (_, i) => Math.floor(focus.y / YEARS_PER_BLOCK) * YEARS_PER_BLOCK + i).map((y) => {
            const disabled = isYearDisabled(y);
            const isSelected = selected !== null && selected.y === y;
            return (
              <button
                key={y}
                type="button"
                className={cx(styles.cell, isSelected && styles.selected)}
                disabled={disabled}
                aria-pressed={isSelected}
                onClick={() => {
                  setFocus({ y, m: focus.m, d: Math.min(focus.d, daysInMonth(y, focus.m)) });
                  setView("months");
                }}
              >
                {y}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
