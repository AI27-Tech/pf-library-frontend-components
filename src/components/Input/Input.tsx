import { useRef, useState, type InputHTMLAttributes, type ReactNode, type Ref } from "react";
import styles from "./Input.module.css";
import { cx, type InputSize } from "./utils";

export type InputState = "error" | "warning" | "success" | undefined;

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Tamaño de la entrada. */
  size?: InputSize;
  /** Estado de validación del campo: error (rojo), warning (naranja), success (verde). */
  state?: InputState;
  /** Marca el campo como inválido (también establece aria-invalid). Deprecated: usar `state="error"` en su lugar. */
  invalid?: boolean;
  /** Contenido renderizado antes del texto (icono, prefijo). */
  startAdornment?: ReactNode;
  /** Contenido renderizado después del texto (icono, sufijo, acción). */
  endAdornment?: ReactNode;
  /** Ref reenviado al elemento de entrada subyacente. */
  inputRef?: Ref<HTMLInputElement>;
  /** Muestra un botón para borrar el valor. No aparece en campos deshabilitados ni de solo lectura. */
  clearable?: boolean;
  /** Se llama al pulsar el botón de borrar, después de vaciar el campo. */
  onClear?: () => void;
  /** En `type="password"`, muestra un botón para ver u ocultar el texto. */
  passwordToggle?: boolean;
}

/** Asigna un valor a un ref de objeto o de función. */
function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    (ref as { current: T | null }).current = value;
  }
}

function ClearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
      {hidden && <path d="M3 3l18 18" />}
    </svg>
  );
}

export function Input({
  size = "md",
  state,
  invalid = false,
  startAdornment,
  endAdornment,
  disabled,
  readOnly,
  clearable = false,
  onClear,
  passwordToggle = false,
  type,
  value,
  defaultValue,
  onChange,
  className,
  inputRef,
  ...props
}: InputProps) {
  const innerRef = useRef<HTMLInputElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  // Valor sin control, para decidir si mostrar el botón de borrar.
  const [uncontrolledValue, setUncontrolledValue] = useState(String(defaultValue ?? ""));

  // Mapear `invalid` prop a `state` para retrocompatibilidad
  const effectiveState = invalid ? "error" : state;
  // La clase de error se llama `invalid` en el CSS; `error` es el nombre del estado.
  const stateClass =
    effectiveState === "error"
      ? styles.invalid
      : effectiveState === "warning"
        ? styles.warning
        : effectiveState === "success"
          ? styles.success
          : undefined;

  const currentValue = value !== undefined ? String(value) : uncontrolledValue;
  const interactive = !disabled && !readOnly;
  const showClear = clearable && interactive && currentValue !== "";
  const isPassword = type === "password";
  const showToggle = passwordToggle && isPassword && interactive;

  /** Vacía el campo como si el usuario lo hubiera borrado, para que `onChange` reciba `""`. */
  function clear() {
    const element = innerRef.current;
    if (element) {
      const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setValue?.call(element, "");
      element.dispatchEvent(new Event("input", { bubbles: true }));
      element.focus();
    }
    onClear?.();
  }

  return (
    <div
      className={cx(
        styles.field,
        styles[size],
        stateClass,
        disabled && styles.disabled,
        readOnly && styles.readOnly,
        className,
      )}
      data-size={size}
      data-state={effectiveState}
    >
      {startAdornment && (
        <span className={styles.adornment} aria-hidden="true">
          {startAdornment}
        </span>
      )}
      <input
        ref={(element) => {
          innerRef.current = element;
          assignRef(inputRef, element);
        }}
        className={styles.control}
        type={isPassword && showToggle && revealed ? "text" : type}
        disabled={disabled}
        readOnly={readOnly}
        value={value}
        defaultValue={defaultValue}
        onChange={(event) => {
          setUncontrolledValue(event.target.value);
          onChange?.(event);
        }}
        aria-invalid={effectiveState === "error" || undefined}
        {...props}
      />
      {endAdornment && (
        <span className={styles.adornment}>{endAdornment}</span>
      )}
      {(showClear || showToggle) && (
        <span className={styles.actions}>
          {showClear && (
            <button
              type="button"
              className={styles.actionButton}
              aria-label="Borrar"
              onClick={clear}
            >
              <ClearIcon />
            </button>
          )}
          {showToggle && (
            <button
              type="button"
              className={styles.actionButton}
              aria-label={revealed ? "Ocultar contraseña" : "Mostrar contraseña"}
              aria-pressed={revealed}
              onClick={() => setRevealed((current) => !current)}
            >
              <EyeIcon hidden={revealed} />
            </button>
          )}
        </span>
      )}
    </div>
  );
}
