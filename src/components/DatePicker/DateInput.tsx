import { CalendarDays, X } from "lucide-react";
import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Input } from "../Input/Input";
import type { InputSize } from "../Input/utils";
import { Popover } from "../Popover/Popover";
import { Calendar } from "./Calendar";
import styles from "./DateInput.module.css";
import {
  formatDisplayDate,
  formatISODate,
  isWithin,
  parseDisplayDate,
  parseISODate,
  type DateParts,
  type WeekStart,
} from "./dateUtils";

export interface DatePreset {
  /** Texto del botón. */
  label: string;
  /** Fecha en `YYYY-MM-DD`, o una función que la calcula al elegir el preset. */
  value: string | (() => string);
}

export interface DateInputProps {
  /** Fecha vigente en `YYYY-MM-DD`. `""` significa sin fecha. Activa el modo controlado. */
  value?: string;
  /** Fecha inicial en modo no controlado. */
  defaultValue?: string;
  /** Se llama solo cuando la fecha vigente cambia. Emite `YYYY-MM-DD` o `""`. */
  onChange?: (value: string) => void;
  /** Primera fecha aceptada en `YYYY-MM-DD`. Inclusiva. */
  min?: string;
  /** Última fecha aceptada en `YYYY-MM-DD`. Inclusiva. */
  max?: string;
  /** Atajos que se muestran junto al calendario. */
  presets?: DatePreset[];
  /** Muestra un botón para borrar la fecha. */
  clearable?: boolean;
  /** Texto de ayuda del campo vacío. Por defecto: "DD/MM/AAAA". */
  placeholder?: string;
  size?: InputSize;
  /** Marca el campo como inválido. */
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  id?: string;
  name?: string;
  "aria-describedby"?: string;
  /** Idioma del calendario y de los meses visuales. Por defecto: "es-MX". */
  locale?: string;
  /**
   * Formato con el que se muestra la fecha cuando el campo no tiene foco.
   * Solo afecta a la visualización: al escribir siempre se usa `DD/MM/AAAA`.
   * Por defecto: "DD/MM/AAAA".
   */
  displayFormat?: "DD/MM/AAAA" | "AAAA Mmm DD";
  /** Primer día de la semana: 0 = domingo, 1 = lunes. Por defecto: 1 (D8). */
  weekStartsOn?: WeekStart;
  className?: string;
}

const DEFAULT_LOCALE = "es-MX";
const DEFAULT_WEEK_START: WeekStart = 1;

/** Convierte `YYYY-MM-DD` a texto `DD/MM/AAAA`. Devuelve `""` si no es válida. */
function toDisplay(iso: string): string {
  const parts = parseISODate(iso);
  return parts ? formatDisplayDate(parts) : "";
}

/**
 * Convierte `YYYY-MM-DD` a `AAAA Mmm DD` (por ejemplo `2026 Nov 12`).
 * El mes sale de `Intl` sin punto final y con la primera letra en mayúscula.
 */
function toVisualDisplay(iso: string, locale: string): string {
  const parts = parseISODate(iso);
  if (!parts) return "";
  const monthText = new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" })
    .format(new Date(Date.UTC(parts.y, parts.m - 1, parts.d)))
    .replace(/\.$/, "");
  const month = monthText.charAt(0).toUpperCase() + monthText.slice(1);
  return `${parts.y} ${month} ${String(parts.d).padStart(2, "0")}`;
}

function resolvePreset(preset: DatePreset): string {
  return typeof preset.value === "function" ? preset.value() : preset.value;
}

export function DateInput({
  value,
  defaultValue = "",
  onChange,
  min,
  max,
  presets,
  clearable = false,
  placeholder = "DD/MM/AAAA",
  size = "md",
  invalid = false,
  disabled = false,
  readOnly = false,
  id,
  name,
  "aria-describedby": describedBy,
  locale = DEFAULT_LOCALE,
  weekStartsOn = DEFAULT_WEEK_START,
  displayFormat = "DD/MM/AAAA",
  className,
}: DateInputProps) {
  const generatedId = useId();
  const popoverId = `${generatedId}-calendario`;
  const anchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const minDate = useMemo<DateParts | null>(() => (min ? parseISODate(min) : null), [min]);
  const maxDate = useMemo<DateParts | null>(() => (max ? parseISODate(max) : null), [max]);

  // Modo controlado si llega `value`; si no, la fecha la guarda el componente.
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const committed = value ?? internalValue;
  const committedText = toDisplay(committed);

  // Texto escrito por la persona. Se confirma en blur o Enter.
  const [text, setText] = useState(committedText);
  const [syncedCommitted, setSyncedCommitted] = useState(committed);
  if (committed !== syncedCommitted) {
    setSyncedCommitted(committed);
    setText(committedText);
  }

  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  // Solo visual: el campo muestra el formato elegido solo cuando ni el campo ni su calendario tienen interacción.
  const showVisual = displayFormat !== "DD/MM/AAAA" && !focused && !open;
  const visualText = toVisualDisplay(committed, locale);

  function emit(next: string) {
    if (next === committed) return;
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  }

  /** Confirma el texto. Si no es una fecha válida o está fuera de rango, vuelve al valor vigente. */
  function commitText() {
    const trimmed = text.trim();
    if (trimmed === "") {
      if (clearable) {
        emit("");
        setText("");
      } else {
        setText(committedText);
      }
      return;
    }
    const parsed = parseDisplayDate(trimmed);
    if (parsed && isWithin(parsed, minDate, maxDate)) {
      emit(formatISODate(parsed));
      setText(formatDisplayDate(parsed));
    } else {
      setText(committedText);
    }
  }

  function openPanel() {
    setText(committedText);
    setOpen(true);
  }

  function focusPanel() {
    document
      .getElementById(popoverId)
      ?.querySelector<HTMLElement>('[data-focus="true"]')
      ?.focus();
  }

  /**
   * Elige una fecha desde el calendario o un preset. Cierra el panel.
   * El foco vuelve al botón de calendario, no al campo: así el campo no queda en edición
   * y muestra el formato visual de inmediato.
   */
  function choose(iso: string) {
    // Con `clearable`, elegir la fecha que ya está seleccionada la borra (como Mantine).
    const next = clearable && iso === committed ? "" : iso;
    emit(next);
    setText(toDisplay(next));
    setOpen(false);
    triggerRef.current?.focus();
  }

  function clear() {
    emit("");
    setText("");
    inputRef.current?.focus();
  }

  /** Cierre por clic fuera o Escape. Si el foco estaba en el panel, vuelve al campo. */
  function handleClose() {
    const panel = document.getElementById(popoverId);
    setOpen(false);
    if (panel && document.activeElement && panel.contains(document.activeElement)) {
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      commitText();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (open) {
        focusPanel();
      } else {
        openPanel();
      }
      return;
    }
    if (event.key === "Tab") {
      setOpen(false);
    }
  }

  const interactive = !disabled && !readOnly;
  const showClear = clearable && interactive && committed !== "";

  return (
    <div ref={anchorRef} className={[styles.root, className].filter(Boolean).join(" ")}>
      <Input
        inputRef={inputRef}
        id={id}
        name={name}
        size={size}
        invalid={invalid}
        disabled={disabled}
        readOnly={readOnly}
        aria-describedby={describedBy}
        aria-haspopup="dialog"
        aria-expanded={open}
        inputMode="numeric"
        placeholder={placeholder}
        autoComplete="off"
        value={showVisual ? visualText : text}
        onChange={(event) => setText(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          commitText();
        }}
        onKeyDown={handleKeyDown}
        endAdornment={
          <span className={styles.actions}>
            {showClear && (
              <button
                type="button"
                className={styles.iconButton}
                aria-label="Borrar fecha"
                onClick={clear}
              >
                <X />
              </button>
            )}
            <button
              ref={triggerRef}
              type="button"
              className={styles.iconButton}
              aria-label="Abrir calendario"
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls={popoverId}
              disabled={!interactive}
              onClick={() => (open ? setOpen(false) : openPanel())}
            >
              <CalendarDays />
            </button>
          </span>
        }
      />

      <Popover
        id={popoverId}
        anchorRef={anchorRef}
        open={open}
        onClose={handleClose}
        onPositioned={focusPanel}
        role="dialog"
        aria-label="Calendario"
      >
        <div className={styles.panel}>
          {presets && presets.length > 0 && (
            <div className={styles.presets}>
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className={styles.preset}
                  onClick={() => choose(resolvePreset(preset))}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}
          <Calendar
            value={committed}
            onChange={choose}
            min={min}
            max={max}
            locale={locale}
            weekStartsOn={weekStartsOn}
          />
        </div>
      </Popover>
    </div>
  );
}
