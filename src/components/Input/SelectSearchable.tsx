import { useEffect, useId, useState, type KeyboardEvent } from "react";
import styles from "./Input.module.css";
import selectStyles from "./SelectCustom.module.css";
import { filterOptions } from "./filterOptions";
import type { SelectOption, SelectProps } from "./Select";
import { cx } from "./utils";

export type SelectSearchableProps = SelectProps;

/** Índice del primer elemento habilitado de la lista, o -1 si no hay ninguno. */
function firstEnabledIndex(options: SelectOption[]): number {
  return options.findIndex((option) => !option.disabled);
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/**
 * Variante buscable de `Select`. El campo es un combobox: escribir filtra las
 * opciones y las flechas, Enter, Escape y Tab controlan la lista.
 */
export function SelectSearchable({
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
  searchPlaceholder,
  noResultsText = "Sin resultados",
}: SelectSearchableProps) {
  const effectiveState = invalid ? "error" : state;
  const listboxId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [internalValue, setInternalValue] = useState<string | number | undefined>(defaultValue);

  const isControlled = controlledValue !== undefined;
  const selectedValue = isControlled ? controlledValue : internalValue;
  const selectedOption = options.find((option) => option.value === selectedValue);
  const selectedLabel = selectedOption?.label ?? "";

  // Mientras el usuario no escribe, la lista muestra todas las opciones.
  const visible = filterOptions(options, isEditing ? query : "");
  const optionId = (index: number) => `${listboxId}-opt-${index}`;
  const activeId = isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined;

  // Mantiene visible en la lista la opción resaltada con el teclado.
  useEffect(() => {
    if (activeId) {
      document.getElementById(activeId)?.scrollIntoView?.({ block: "nearest" });
    }
  }, [activeId]);

  const closeAndRestore = () => {
    setIsOpen(false);
    setIsEditing(false);
    setQuery("");
    setActiveIndex(-1);
  };

  const selectOption = (option: SelectOption) => {
    if (option.disabled) return;
    if (!isControlled) {
      setInternalValue(option.value);
    }
    onChange?.(option.value);
    closeAndRestore();
  };

  const handleInputChange = (text: string) => {
    setQuery(text);
    setIsEditing(true);
    setIsOpen(true);
    setActiveIndex(firstEnabledIndex(filterOptions(options, text)));
  };

  const openList = () => {
    if (disabled || isOpen) return;
    setIsOpen(true);
    setActiveIndex(firstEnabledIndex(visible));
  };

  const moveActive = (direction: 1 | -1) => {
    // Sin dar la vuelta: se detiene en el primero y en el último habilitado.
    const enabled = visible
      .map((option, index) => (option.disabled ? -1 : index))
      .filter((index) => index >= 0);
    if (enabled.length === 0) return;

    const next =
      direction === 1
        ? enabled.find((index) => index > activeIndex)
        : [...enabled].reverse().find((index) => index < activeIndex);
    if (next !== undefined) setActiveIndex(next);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          openList();
        } else {
          moveActive(1);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (isOpen) moveActive(-1);
        break;
      case "Enter": {
        const option = isOpen && activeIndex >= 0 ? visible[activeIndex] : undefined;
        if (option) {
          event.preventDefault();
          selectOption(option);
        }
        break;
      }
      case "Escape":
        if (isOpen) {
          event.preventDefault();
          closeAndRestore();
        }
        break;
      case "Tab":
        closeAndRestore();
        break;
    }
  };

  const displayText = isEditing ? query : selectedLabel;

  return (
    <div ref={selectRef} className={selectStyles.selectCustom} data-size={size}>
      <div
        className={cx(
          styles.field,
          styles[size],
          effectiveState === "error" && styles.invalid,
          effectiveState === "warning" && styles.warning,
          effectiveState === "success" && styles.success,
          disabled && styles.disabled,
          readOnly && styles.readOnly,
          selectStyles.trigger,
          selectStyles.searchBox,
          className,
        )}
      >
        <input
          id={id}
          type="text"
          role="combobox"
          className={selectStyles.searchInput}
          value={displayText}
          placeholder={searchPlaceholder ?? placeholder ?? "Buscar..."}
          disabled={disabled}
          readOnly={readOnly}
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          aria-invalid={effectiveState === "error" || undefined}
          aria-describedby={describedBy}
          autoComplete="off"
          onChange={(event) => handleInputChange(event.target.value)}
          onClick={readOnly ? undefined : openList}
          onKeyDown={readOnly ? undefined : handleKeyDown}
          onBlur={closeAndRestore}
        />
        <span className={cx(styles.adornment, styles.selectArrow)} aria-hidden="true">
          <ChevronIcon />
        </span>
      </div>

      {isOpen && !disabled && (
        <div className={selectStyles.dropdown}>
          <div id={listboxId} role="listbox" className={selectStyles.listContainer}>
            {visible.map((option, index) => {
              const isSelected = selectedValue === option.value;
              return (
                <div
                  key={option.value}
                  className={cx(selectStyles.option, isSelected && selectStyles.optionSelected)}
                  role="presentation"
                >
                  <div
                    id={optionId(index)}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled || undefined}
                    className={cx(
                      selectStyles.optionButton,
                      index === activeIndex && selectStyles.optionActive,
                      option.disabled && selectStyles.optionDisabled,
                    )}
                    // Evita que el campo pierda el foco antes de que el clic llegue a la opción.
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectOption(option)}
                    onMouseEnter={() => !option.disabled && setActiveIndex(index)}
                  >
                    {option.label}
                  </div>
                </div>
              );
            })}
          </div>
          {visible.length === 0 && (
            <div className={selectStyles.emptyState} role="status">
              {noResultsText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
