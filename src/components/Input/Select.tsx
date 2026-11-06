import type { Ref } from "react";
import { useRef, useState, useEffect } from "react";
import styles from "./Input.module.css";
import selectStyles from "./SelectCustom.module.css";
import { cx, type InputSize } from "./utils";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps {
  /** Size of the select. */
  size?: InputSize;
  /** Marks the field as invalid (also sets aria-invalid). */
  invalid?: boolean;
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

export function Select({
  size = "md",
  invalid = false,
  options = [],
  placeholder,
  value: controlledValue,
  defaultValue,
  onChange,
  disabled,
  className,
  selectRef,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | number | undefined>(
    defaultValue ?? placeholder ? "" : undefined,
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
        className={cx(
          styles.field,
          styles[size],
          invalid && styles.invalid,
          disabled && styles.disabled,
          selectStyles.trigger,
          className,
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        type="button"
      >
        <span className={selectStyles.displayValue}>{displayLabel}</span>
        <span
          className={cx(styles.adornment, styles.selectArrow)}
          aria-hidden="true"
        >
          <ChevronIcon />
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
