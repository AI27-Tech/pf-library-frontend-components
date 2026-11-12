import {
  Fragment,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import inputStyles from "../Input/Input.module.css";
import { cx, type InputSize } from "../Input/utils";
import { Popover } from "../Popover/Popover";
import styles from "./TimePicker.module.css";
import {
  EMPTY_SEGMENTS,
  fieldRange,
  fromSeconds,
  formatTime,
  isRangeBlocked,
  pad2,
  parseTime,
  segmentsFromTime,
  stepValue,
  timeFromSegments,
  toSeconds,
  typeDigit,
  type FieldRange,
  type Period,
  type TimeField,
  type TimeFormat,
  type TimeSegments,
} from "./timeUtils";

/** Grupo de presets con etiqueta. Cada valor es `HH:mm` o `HH:mm:ss`. */
export interface TimePreset {
  label?: string;
  values: string[];
}

export interface TimePickerProps {
  /** Hora vigente en `HH:mm` o `HH:mm:ss` (24 h). `""` significa sin hora. Activa el modo controlado. */
  value?: string;
  /** Hora inicial en modo no controlado. */
  defaultValue?: string;
  /** Se llama solo cuando la hora vigente cambia. Emite `HH:mm[:ss]` en 24 h, o `""`. */
  onChange?: (value: string) => void;
  /** Muestra AM/PM y las horas de 1 a 12. Por defecto: "24h". */
  format?: TimeFormat;
  /** Agrega el segmento de segundos. */
  withSeconds?: boolean;
  /** Pasos de las flechas y de las opciones del dropdown. Por defecto: 1. */
  hoursStep?: number;
  minutesStep?: number;
  secondsStep?: number;
  /** Primera hora aceptada en `HH:mm[:ss]`. Inclusiva. */
  min?: string;
  /** Última hora aceptada en `HH:mm[:ss]`. Inclusiva. */
  max?: string;
  /** Muestra el dropdown al enfocar un segmento. Por defecto: true. */
  withDropdown?: boolean;
  /** Lado de apertura del dropdown. Por defecto: "auto". */
  dropdownPosition?: "bottom" | "top" | "auto";
  /** Atajos de hora. Una cadena es un botón; un grupo tiene su etiqueta. */
  presets?: Array<string | TimePreset>;
  /** Cierra el dropdown al elegir un preset. Por defecto: true. */
  closeDropdownOnPresetSelect?: boolean;
  /** Muestra un botón para borrar la hora. */
  clearable?: boolean;
  size?: InputSize;
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  id?: string;
  name?: string;
  "aria-describedby"?: string;
  className?: string;
}

const FIELD_LABEL: Record<TimeField, string> = {
  h: "Horas",
  m: "Minutos",
  s: "Segundos",
  period: "AM/PM",
};

const FIELD_PLACEHOLDER: Record<TimeField, string> = {
  h: "HH",
  m: "MM",
  s: "SS",
  period: "AM/PM",
};

const PERIODS: Exclude<Period, "">[] = ["AM", "PM"];

function withField(segments: TimeSegments, field: TimeField, value: string): TimeSegments {
  switch (field) {
    case "h":
      return { ...segments, h: value };
    case "m":
      return { ...segments, m: value };
    case "s":
      return { ...segments, s: value };
    case "period":
      return { ...segments, period: value as Period };
  }
}

/** Valores de un campo numérico desde el mínimo del rango, saltando según `step`. */
function stepped(range: FieldRange, step: number): number[] {
  const values: number[] = [];
  for (let value = range.min; value <= range.max; value += step) {
    values.push(value);
  }
  return values;
}

function stepOf(step: number): number {
  return Math.max(1, Math.floor(step));
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export function TimePicker({
  value,
  defaultValue = "",
  onChange,
  format = "24h",
  withSeconds = false,
  hoursStep = 1,
  minutesStep = 1,
  secondsStep = 1,
  min,
  max,
  withDropdown = true,
  dropdownPosition = "auto",
  presets,
  closeDropdownOnPresetSelect = true,
  clearable = false,
  size = "md",
  invalid = false,
  disabled = false,
  readOnly = false,
  id,
  name,
  "aria-describedby": describedBy,
  className,
}: TimePickerProps) {
  const generatedId = useId();
  const panelId = `${generatedId}-horas`;
  const anchorRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<Array<HTMLInputElement | null>>([]);

  const minSec = useMemo(() => {
    const parts = min ? parseTime(min) : null;
    return parts ? toSeconds(parts) : null;
  }, [min]);
  const maxSec = useMemo(() => {
    const parts = max ? parseTime(max) : null;
    return parts ? toSeconds(parts) : null;
  }, [max]);

  const fields = useMemo<TimeField[]>(() => {
    const list: TimeField[] = ["h", "m"];
    if (withSeconds) list.push("s");
    if (format === "12h") list.push("period");
    return list;
  }, [withSeconds, format]);

  // Modo controlado si llega `value`; si no, la hora la guarda el componente.
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const committed = value ?? internalValue;

  // Segmentos mientras se escribe. Pueden estar a medias sin que el valor cambie.
  const [segments, setSegments] = useState<TimeSegments>(() =>
    segmentsFromTime(parseTime(committed), format, withSeconds),
  );
  const [syncedValue, setSyncedValue] = useState(committed);
  // Si el valor cambia desde fuera, se reemplazan los segmentos. Se ajusta durante el render.
  if (committed !== syncedValue) {
    setSyncedValue(committed);
    setSegments(segmentsFromTime(parseTime(committed), format, withSeconds));
  }

  const [open, setOpen] = useState(false);
  const interactive = !disabled && !readOnly;
  const dropdownOpen = open && withDropdown && interactive;
  const hasInput = fields.some((field) => segments[field] !== "");

  function commit(next: string) {
    if (next === committed) return;
    setSyncedValue(next);
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  }

  /**
   * Aplica un cambio a los segmentos. Emite cuando la hora queda completa.
   * Un segmento vacío borra el valor emitido. Un segmento a medias no lo borra.
   */
  function applyEdit(next: TimeSegments) {
    setSegments(next);
    const complete = timeFromSegments(next, format, withSeconds);
    if (complete !== null) {
      commit(complete);
      return;
    }
    const cleared = fields.some((field) => next[field] === "");
    if (cleared && committed !== "") {
      commit("");
    }
  }

  /**
   * Al salir del campo:
   * - Una hora incompleta vuelve al valor vigente.
   * - Una hora completa fuera de `min`/`max` se ajusta al límite más cercano.
   */
  function leaveField() {
    const complete = timeFromSegments(segments, format, withSeconds);
    if (complete === null) {
      setSegments(segmentsFromTime(parseTime(committed), format, withSeconds));
      return;
    }
    const parts = parseTime(complete);
    if (!parts) return;
    const seconds = toSeconds(parts);
    let clamped = seconds;
    if (minSec !== null && seconds < minSec) clamped = minSec;
    if (maxSec !== null && seconds > maxSec) clamped = maxSec;
    if (clamped === seconds) return;
    const text = formatTime(fromSeconds(clamped), withSeconds);
    setSegments(segmentsFromTime(parseTime(text), format, withSeconds));
    commit(text);
  }

  function focusSegment(index: number) {
    const target = Math.max(0, Math.min(index, fields.length - 1));
    segmentRefs.current[target]?.focus();
  }

  function typeInto(field: Exclude<TimeField, "period">, digit: number, index: number) {
    const result = typeDigit(segments[field], digit, fieldRange(field, format));
    if (!result) return;
    applyEdit(withField(segments, field, result.value));
    if (result.advance) focusSegment(index + 1);
  }

  function stepField(field: TimeField, delta: 1 | -1) {
    if (field === "period") {
      const next: Period =
        segments.period === "" ? (delta > 0 ? "AM" : "PM") : segments.period === "AM" ? "PM" : "AM";
      applyEdit(withField(segments, field, next));
      return;
    }
    const step = field === "h" ? hoursStep : field === "m" ? minutesStep : secondsStep;
    const next = stepValue(segments[field], delta, fieldRange(field, format), stepOf(step));
    applyEdit(withField(segments, field, next));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>, field: TimeField, index: number) {
    if (event.key === "Tab" || event.ctrlKey || event.metaKey) return;
    // Los segmentos son de solo lectura: toda escritura pasa por aquí.
    event.preventDefault();
    if (!interactive) return;

    if (/^\d$/.test(event.key) && field !== "period") {
      typeInto(field, Number(event.key), index);
      return;
    }
    switch (event.key) {
      case "Backspace":
      case "Delete":
        applyEdit(withField(segments, field, ""));
        return;
      case "ArrowUp":
        stepField(field, 1);
        return;
      case "ArrowDown":
        stepField(field, -1);
        return;
      case "ArrowLeft":
        focusSegment(index - 1);
        return;
      case "ArrowRight":
        focusSegment(index + 1);
        return;
    }
    if (field === "period") {
      const letter = event.key.toUpperCase();
      if (letter === "A") applyEdit(withField(segments, field, "AM"));
      if (letter === "P") applyEdit(withField(segments, field, "PM"));
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    if (!interactive) return;
    const parts = parseTime(event.clipboardData.getData("text"));
    if (!parts) return;
    event.preventDefault();
    applyEdit(segmentsFromTime(parts, format, withSeconds));
  }

  /** Cierra el dropdown y ajusta la hora al salir de todo el control. Un movimiento entre segmentos o al panel no cuenta. */
  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget as Node | null;
    if (next && (anchorRef.current?.contains(next) || document.getElementById(panelId)?.contains(next))) {
      return;
    }
    setOpen(false);
    leaveField();
  }

  function clear() {
    applyEdit(EMPTY_SEGMENTS);
  }

  function applyPreset(text: string) {
    const parts = parseTime(text);
    if (!parts) return;
    applyEdit(segmentsFromTime(parts, format, withSeconds));
    if (closeDropdownOnPresetSelect) setOpen(false);
  }

  /** Hora de 24 horas que corresponde al segmento de horas, o `null` si falta el período en 12 h. */
  function currentHour24(): number | null {
    if (segments.h.length !== 2) return null;
    if (format === "24h") return Number(segments.h);
    if (segments.period === "") return null;
    return (Number(segments.h) % 12) + (segments.period === "PM" ? 12 : 0);
  }

  function isOptionDisabled(field: TimeField, option: number): boolean {
    if (minSec === null && maxSec === null) return false;
    if (field === "period") return false;

    if (field === "h") {
      // En 12 h sin período se revisan las dos mitades del día.
      const candidates =
        format === "24h"
          ? [option]
          : segments.period !== ""
            ? [(option % 12) + (segments.period === "PM" ? 12 : 0)]
            : [option % 12, (option % 12) + 12];
      return candidates.every((hour) =>
        isRangeBlocked(hour * 3600, hour * 3600 + 3599, minSec, maxSec),
      );
    }

    const hour = currentHour24();
    if (hour === null) return false;
    const hourStart = hour * 3600;

    if (field === "m") {
      const start = hourStart + option * 60;
      return isRangeBlocked(start, start + 59, minSec, maxSec);
    }
    // field === "s"
    if (segments.m.length !== 2) return false;
    const second = hourStart + Number(segments.m) * 60 + option;
    return isRangeBlocked(second, second, minSec, maxSec);
  }

  function pickOption(field: TimeField, option: number | Period) {
    const next = typeof option === "number" ? pad2(option) : option;
    applyEdit(withField(segments, field, next));
  }

  // Lleva la opción vigente a la vista al abrir el dropdown.
  useEffect(() => {
    if (!dropdownOpen) return;
    document
      .getElementById(panelId)
      ?.querySelectorAll<HTMLElement>('[aria-selected="true"]')
      .forEach((element) => element.scrollIntoView?.({ block: "nearest" }));
  }, [dropdownOpen, panelId]);

  const presetGroups = (presets ?? []).map((preset) =>
    typeof preset === "string" ? { label: undefined, values: [preset] } : preset,
  );

  function renderOptions(field: TimeField) {
    if (field === "period") {
      return PERIODS.map((period) => (
        <div
          key={period}
          role="option"
          className={styles.option}
          aria-selected={segments.period === period}
          aria-disabled={undefined}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => pickOption("period", period)}
        >
          {period}
        </div>
      ));
    }
    const range = fieldRange(field, format);
    const step = stepOf(field === "h" ? hoursStep : field === "m" ? minutesStep : secondsStep);
    return stepped(range, step).map((option) => {
      const label = pad2(option);
      const blocked = isOptionDisabled(field, option);
      return (
        <div
          key={option}
          role="option"
          className={styles.option}
          aria-selected={segments[field] === label}
          aria-disabled={blocked || undefined}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            if (!blocked) pickOption(field, option);
          }}
        >
          {label}
        </div>
      );
    });
  }

  return (
    <div ref={anchorRef} className={cx(styles.root, className)} onBlur={handleBlur}>
      <div
        className={cx(
          inputStyles.field,
          inputStyles[size],
          invalid && inputStyles.invalid,
          disabled && inputStyles.disabled,
          styles.container,
        )}
      >
        {fields.map((field, index) => (
          <Fragment key={field}>
            {index > 0 && (
              <span className={styles.separator} aria-hidden="true">
                {field === "period" ? " " : ":"}
              </span>
            )}
            <input
              ref={(element) => {
                segmentRefs.current[index] = element;
              }}
              id={index === 0 ? id : undefined}
              name={index === 0 ? name : undefined}
              type="text"
              inputMode="numeric"
              readOnly
              className={cx(styles.segment, field === "period" && styles.period)}
              value={segments[field]}
              placeholder={FIELD_PLACEHOLDER[field]}
              aria-label={FIELD_LABEL[field]}
              aria-invalid={invalid || undefined}
              aria-describedby={index === 0 ? describedBy : undefined}
              aria-haspopup={withDropdown ? "listbox" : undefined}
              disabled={disabled}
              onFocus={() => {
                if (interactive && withDropdown) setOpen(true);
              }}
              onKeyDown={(event) => handleKeyDown(event, field, index)}
              onPaste={handlePaste}
            />
          </Fragment>
        ))}
        {((clearable && hasInput) || withDropdown) && interactive && (
          <span className={styles.actions}>
            {clearable && hasInput && (
              <button
                type="button"
                className={styles.actionButton}
                aria-label="Borrar hora"
                onClick={clear}
              >
                <ClearIcon />
              </button>
            )}
            {withDropdown && (
              <button
                type="button"
                className={styles.actionButton}
                aria-label="Abrir horas"
                aria-expanded={dropdownOpen}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => setOpen((current) => !current)}
              >
                <ClockIcon />
              </button>
            )}
          </span>
        )}
      </div>

      {withDropdown && (
        <Popover
          id={panelId}
          anchorRef={anchorRef}
          open={dropdownOpen}
          onClose={() => setOpen(false)}
          position={dropdownPosition}
          role="dialog"
          aria-label="Horas"
        >
          <div className={styles.panel}>
            {presetGroups.length > 0 && (
              <div className={styles.presets}>
                {presetGroups.map((group, groupIndex) => (
                  <div key={group.label ?? groupIndex} className={styles.presetGroup}>
                    {group.label && <span className={styles.presetLabel}>{group.label}</span>}
                    {group.values.map((text) => (
                      <button
                        key={text}
                        type="button"
                        className={styles.preset}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => applyPreset(text)}
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
            <div className={styles.columns}>
              {fields.map((field) => (
                <div key={field} role="listbox" aria-label={FIELD_LABEL[field]} className={styles.column}>
                  {renderOptions(field)}
                </div>
              ))}
            </div>
          </div>
        </Popover>
      )}
    </div>
  );
}
