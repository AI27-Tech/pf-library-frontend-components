import { useState } from "react";
import type { InputSize } from "../Input/utils";
import { DateInput, type DateInputProps } from "./DateInput";
import { TimePicker, type TimePickerProps } from "./TimePicker";
import { parseISODate } from "./dateUtils";
import styles from "./DateTimeInput.module.css";

export interface DateTimeInputProps {
  /** Fecha y hora en `YYYY-MM-DDTHH:mm` (o `YYYY-MM-DDTHH:mm:ss` con `withSeconds`). `""` es vacío. */
  value?: string;
  /** Valor inicial en modo no controlado. */
  defaultValue?: string;
  /** Se llama solo cuando el valor combinado cambia. Emite `""` cuando una de las partes queda vacía. */
  onChange?: (value: string) => void;
  /** Incluye segundos en la parte de hora. */
  withSeconds?: boolean;
  /** Hora que se usa cuando el usuario elige una fecha y la hora está vacía. */
  defaultTime?: string;
  /** Límite inferior `YYYY-MM-DDTHH:mm`. La hora se valida solo si la fecha coincide con el límite. */
  min?: string;
  /** Límite superior `YYYY-MM-DDTHH:mm`. La hora se valida solo si la fecha coincide con el límite. */
  max?: string;
  /** Props adicionales para la parte de fecha. */
  dateProps?: Partial<DateInputProps>;
  /** Props adicionales para la parte de hora. */
  timeProps?: Partial<TimePickerProps>;
  size?: InputSize;
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  id?: string;
  "aria-describedby"?: string;
  className?: string;
}

interface Parts {
  date: string;
  time: string;
}

const DATETIME_PATTERN = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}(?::\d{2})?)$/;

/** Separa `YYYY-MM-DDTHH:mm[:ss]` en fecha y hora. Devuelve partes vacías si no coincide. */
function splitDateTime(value: string): Parts {
  const match = DATETIME_PATTERN.exec(value);
  if (!match || !parseISODate(match[1])) return { date: "", time: "" };
  return { date: match[1], time: match[2] };
}

/** Junta las partes solo cuando ambas están completas. */
function combine(parts: Parts): string {
  return parts.date && parts.time ? `${parts.date}T${parts.time}` : "";
}

export function DateTimeInput({
  value,
  defaultValue = "",
  onChange,
  withSeconds = false,
  defaultTime,
  min,
  max,
  dateProps,
  timeProps,
  size = "md",
  invalid = false,
  disabled = false,
  readOnly = false,
  id,
  "aria-describedby": describedBy,
  className,
}: DateTimeInputProps) {
  // Modo controlado si llega `value`; si no, el valor combinado lo guarda el componente.
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const committed = value ?? internalValue;

  // Partes mientras se editan. Una parte puede quedar sola sin que el valor combinado cambie.
  const [parts, setParts] = useState<Parts>(() => splitDateTime(committed));
  const [syncedValue, setSyncedValue] = useState(committed);
  // Un valor externo no vacío reemplaza las dos partes. Un valor vacío no borra una parte a medias.
  if (committed !== syncedValue) {
    setSyncedValue(committed);
    const next = splitDateTime(committed);
    if (next.date || next.time) setParts(next);
  }

  function commit(next: string) {
    if (next === committed) return;
    setSyncedValue(next);
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  }

  function update(next: Parts) {
    setParts(next);
    const complete = combine(next);
    if (complete !== "") {
      commit(complete);
    } else if (committed !== "") {
      commit("");
    }
  }

  const minParts = min ? splitDateTime(min) : null;
  const maxParts = max ? splitDateTime(max) : null;
  // La hora solo se restringe cuando la fecha elegida coincide con la fecha del límite.
  const timeMin = minParts && parts.date === minParts.date ? minParts.time : undefined;
  const timeMax = maxParts && parts.date === maxParts.date ? maxParts.time : undefined;

  function handleDateChange(date: string) {
    update({ date, time: date && !parts.time ? (defaultTime ?? "") : parts.time });
  }

  function handleTimeChange(time: string) {
    update({ date: parts.date, time });
  }

  return (
    <div className={[styles.row, className].filter(Boolean).join(" ")}>
      <div className={styles.date}>
        <DateInput
          {...dateProps}
          id={id}
          aria-describedby={describedBy}
          size={size}
          invalid={invalid}
          disabled={disabled}
          readOnly={readOnly}
          value={parts.date}
          onChange={handleDateChange}
          min={minParts?.date || undefined}
          max={maxParts?.date || undefined}
        />
      </div>
      <div className={styles.time}>
        <TimePicker
          withSeconds={withSeconds}
          {...timeProps}
          size={size}
          invalid={invalid}
          disabled={disabled}
          readOnly={readOnly}
          aria-describedby={describedBy}
          value={parts.time}
          onChange={handleTimeChange}
          min={timeMin}
          max={timeMax}
        />
      </div>
    </div>
  );
}
