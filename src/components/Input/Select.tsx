import { ChevronDown } from "lucide-react";
import type { Ref } from "react";
import { useRef, useState, useEffect } from "react";
import styles from "./Input.module.css";
import selectStyles from "./SelectCustom.module.css";
import { cx, type InputSize } from "./utils";
import type { InputState } from "./Input";
import { SelectSearchable } from "./SelectSearchable";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps {
  /** Size of the select. */
  size?: InputSize;
  /** Marks the field as invalid (also sets aria-invalid). Equivale a `state="error"`. */
  invalid?: boolean;
  /** Estado de validación: error (rojo), warning (naranja), success (verde). */
  state?: InputState;
  /** Solo lectura: el valor se ve, pero no se puede abrir la lista para cambiarlo. */
  readOnly?: boolean;
  /** Identificador del control. `FormField` lo asocia a su etiqueta. */
  id?: string;
  /** Ids de textos de ayuda o error. `FormField` lo completa. */
  "aria-describedby"?: string;
  /** Options to render. */
  options?: SelectOption[];
  /** Placeholder shown as a disabled first option. */
  placeholder?: string;
  /** Currently selected value. */
  value?: string | number;
  /** Default value. */
  defaultValue?: string | number;
  /** Handler for value changes. */
  onChange?: (value: string | number) => void;
  /** Disabled state. */
  disabled?: boolean;
  /** Custom classname. */
  className?: string;
  /** Ref forwarded to the underlying div element. */
  selectRef?: Ref<HTMLDivElement>;
  /** Variante. "searchable" permite escribir para filtrar las opciones. Por defecto: "default". */
  variant?: SelectVariant;
  /** Placeholder del campo de búsqueda. Solo para la variante "searchable". Tiene prioridad sobre `placeholder`. Por defecto: "Buscar..." (o `placeholder` si se pasa). */
  searchPlaceholder?: string;
  /** Texto cuando ninguna opción coincide. Solo para la variante "searchable". Por defecto: "Sin resultados". */
  noResultsText?: string;
}

export type SelectVariant = "default" | "searchable";

/** Despacha a la variante indicada. La variante por defecto no cambia de DOM ni de comportamiento. */
export function Select(props: SelectProps) {
  if (props.variant === "searchable") {
    return <SelectSearchable {...props} />;
  }
  return <SelectDefault {...props} />;
}

function SelectDefault({
  size = "md",
  invalid = false,
  state,
  readOnly = false,
  id,
  "aria-describedby": describedBy,
  options = [],
  placeholder,
  value: controlledValue,
  defaultValue,
  onChange,
  disabled,
  className,
  selectRef,
}: SelectProps) {
  const effectiveState = invalid ? "error" : state;
  const interactive = !disabled && !readOnly;
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | number | undefined>(
    defaultValue ?? (placeholder ? "" : undefined),
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const selectedValue = isControlled ? controlledValue : internalValue;
  const selectedOption = options.find((opt) => opt.value === selectedValue);
  const displayLabel = selectedOption?.label || placeholder || "Select...";

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string | number) => {
    if (!isControlled) {
      setInternalValue(optionValue);
    }
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div
      ref={selectRef || dropdownRef}
      className={selectStyles.selectCustom}
      data-size={size}
    >
      <button
        id={id}
        className={cx(
          styles.field,
          styles[size],
          effectiveState === "error" && styles.invalid,
          effectiveState === "warning" && styles.warning,
          effectiveState === "success" && styles.success,
          disabled && styles.disabled,
          readOnly && styles.readOnly,
          selectStyles.trigger,
          className,
        )}
        onClick={() => interactive && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-invalid={effectiveState === "error" || undefined}
        aria-describedby={describedBy}
        type="button"
      >
        <span className={selectStyles.displayValue}>{displayLabel}</span>
        <span
          className={cx(styles.adornment, styles.selectArrow)}
          aria-hidden="true"
        >
          <ChevronDown />
        </span>
      </button>

      {isOpen && !disabled && (
        <div className={selectStyles.dropdown}>
          <div className={selectStyles.listContainer}>
            {placeholder && (
              <div className={selectStyles.option}>
                <button
                  type="button"
                  className={selectStyles.optionButton}
                  disabled
                  onClick={() => {}}
                >
                  {placeholder}
                </button>
              </div>
            )}
            {options.map((option) => (
              <div
                key={option.value}
                className={cx(
                  selectStyles.option,
                  selectedValue === option.value &&
                    selectStyles.optionSelected,
                )}
              >
                <button
                  type="button"
                  className={selectStyles.optionButton}
                  disabled={option.disabled}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                >
                  {option.label}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
