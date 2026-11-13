import {
  createContext,
  useContext,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cx } from "../../utils/cx";
import styles from "./Tabs.module.css";

interface TabsContextValue {
  /** Valor de la pestaña activa. */
  active: string;
  /** Activa una pestaña por su valor. */
  select: (value: string) => void;
  /** Prefijo para derivar los `id` de pestañas y paneles. */
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(component: string): TabsContextValue {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error(`${component} debe usarse dentro de <Tabs>.`);
  }
  return context;
}

function tabId(baseId: string, value: string) {
  return `${baseId}-tab-${value}`;
}

function panelId(baseId: string, value: string) {
  return `${baseId}-panel-${value}`;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** Valor de la pestaña activa (modo controlado). */
  value?: string;
  /** Valor inicial sin control externo (modo no controlado). */
  defaultValue?: string;
  /** Se llama al activar una pestaña. */
  onChange?: (value: string) => void;
  children?: ReactNode;
}

/**
 * Contenedor de pestañas. Úsalo con `TabList`, `Tab` y `TabPanel`.
 * Controlado con `value` y `onChange`, o no controlado con `defaultValue`.
 */
export function Tabs({
  value,
  defaultValue = "",
  onChange,
  className,
  children,
  ...props
}: TabsProps) {
  const baseId = useId();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const active = isControlled ? value : internalValue;

  function select(next: string) {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  }

  return (
    <TabsContext.Provider value={{ active, select, baseId }}>
      <div className={cx(styles.tabs, className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/**
 * Fila de pestañas. Navegación con teclado: flechas izquierda y derecha (con vuelta),
 * `Home` y `End`. Las pestañas deshabilitadas se omiten.
 */
export function TabList({ className, children, onKeyDown, ...props }: TabListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    const tabs = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)') ?? [],
    );
    if (tabs.length === 0) return;

    const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
    const base = current === -1 ? 0 : current;
    let next: number;

    switch (event.key) {
      case "ArrowRight":
        next = (base + 1) % tabs.length;
        break;
      case "ArrowLeft":
        next = (base - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    // Activación automática: el clic activa la pestaña y el foco ya está en ella.
    tabs[next].focus();
    tabs[next].click();
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation="horizontal"
      className={cx(styles.tabList, className)}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TabProps extends Omit<HTMLAttributes<HTMLButtonElement>, "value"> {
  /** Identificador de la pestaña. Debe coincidir con el `value` de su `TabPanel`. */
  value: string;
  /** Icono antes de la etiqueta. */
  icon?: ReactNode;
  /** Insignia después de la etiqueta, por ejemplo un conteo. */
  badge?: ReactNode;
  /** Deshabilita la pestaña. No recibe foco ni se activa. */
  disabled?: boolean;
  children?: ReactNode;
}

/** Botón de una pestaña. Solo la activa queda en el orden de tabulación (roving tabindex). */
export function Tab({ value, icon, badge, disabled = false, className, children, ...props }: TabProps) {
  const { active, select, baseId } = useTabsContext("Tab");
  const isActive = active === value;

  return (
    <button
      type="button"
      role="tab"
      id={tabId(baseId, value)}
      aria-selected={isActive}
      aria-controls={panelId(baseId, value)}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      className={cx(styles.tab, isActive && styles.active, className)}
      onClick={() => select(value)}
      {...props}
    >
      {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
      <span className={styles.label}>{children}</span>
      {badge != null && <span className={styles.badge}>{badge}</span>}
    </button>
  );
}

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Debe coincidir con el `value` de la `Tab` que controla este panel. */
  value: string;
  children?: ReactNode;
}

/** Panel de contenido. Solo monta su contenido cuando su pestaña está activa. */
export function TabPanel({ value, className, children, ...props }: TabPanelProps) {
  const { active, baseId } = useTabsContext("TabPanel");
  const isActive = active === value;

  return (
    <div
      role="tabpanel"
      id={panelId(baseId, value)}
      aria-labelledby={tabId(baseId, value)}
      tabIndex={0}
      hidden={!isActive}
      className={cx(styles.panel, className)}
      {...props}
    >
      {isActive ? children : null}
    </div>
  );
}
