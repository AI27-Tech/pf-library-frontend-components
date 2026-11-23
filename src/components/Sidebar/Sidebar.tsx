import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ElementType,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useBreakpoint } from "../../utils/useBreakpoint";
import { useFocusTrap } from "../../utils/useFocusTrap";
import styles from "./Sidebar.module.css";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Área de encabezado / marca en la parte superior. */
  header?: ReactNode;
  /** Contenido del encabezado cuando la barra está contraída (por ejemplo, un logo pequeño). Si se omite, el encabezado queda vacío al contraer. */
  headerCollapsed?: ReactNode;
  /** Área de pie de página en la parte inferior. Solo se renderiza si se pasa. */
  footer?: ReactNode;
  /**
   * Si la barra lateral se contrae solo a iconos (controlado). Si no se pasa, en tablet la barra
   * va contraída por defecto (ver `autoCollapseOnTablet`) y el usuario la expande con su botón;
   * en escritorio, va expandida.
   */
  collapsed?: boolean;
  /** Llamado cuando se hace clic en el botón de colapso integrado. Omitir para ocultarlo. */
  onToggleCollapse?: () => void;
  /**
   * En móvil, si el panel está abierto (controlado). Con `false`, el panel queda fuera de
   * pantalla. Usar junto con `SidebarTrigger` y `onMobileOpenChange`.
   */
  mobileOpen?: boolean;
  /** Se llama cuando el panel móvil pide abrirse o cerrarse (Escape, fondo, elegir un elemento). */
  onMobileOpenChange?: (open: boolean) => void;
  /** En tablet, contraer la barra cuando `collapsed` no se pasa. Por defecto: `true`. */
  autoCollapseOnTablet?: boolean;
  /** Contenido de navegación (elementos SidebarItem / SidebarGroup). */
  children?: ReactNode;
}

/**
 * Barra lateral de navegación. En móvil es un panel que se abre con `SidebarTrigger`:
 * tiene fondo, trampa de foco y se cierra con Escape, con un toque en el fondo o al elegir
 * un elemento. Al cerrarse, el foco vuelve al control que lo abrió.
 */
export function Sidebar({
  header,
  headerCollapsed,
  footer,
  collapsed,
  onToggleCollapse,
  mobileOpen = false,
  onMobileOpenChange,
  autoCollapseOnTablet = true,
  onClick,
  className,
  children,
  ...props
}: SidebarProps) {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";
  const panelOpen = isMobile && mobileOpen;
  // En tablet sin `collapsed` controlado, la barra contraída es estado propio y el usuario la expande.
  const autoCollapsed = collapsed === undefined && breakpoint === "tablet" && autoCollapseOnTablet;
  const [tabletExpanded, setTabletExpanded] = useState(false);
  const isCollapsed = isMobile ? false : collapsed ?? (autoCollapsed ? !tabletExpanded : false);
  const showToggle = !isMobile && (onToggleCollapse !== undefined || autoCollapsed);

  function handleToggle() {
    if (autoCollapsed) setTabletExpanded((value) => !value);
    onToggleCollapse?.();
  }

  const panelRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const requestClose = useCallback(() => onMobileOpenChange?.(false), [onMobileOpenChange]);

  // Al abrir se guarda el elemento con foco; al cerrar se devuelve el foco ahí.
  useEffect(() => {
    if (!panelOpen) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    return () => returnFocusRef.current?.focus?.();
  }, [panelOpen]);

  // Escape cierra el panel móvil.
  useEffect(() => {
    if (!panelOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") requestClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [panelOpen, requestClose]);

  // Si el ancho pasa a tablet o escritorio con el panel abierto, se cierra.
  useEffect(() => {
    if (!isMobile && mobileOpen) onMobileOpenChange?.(false);
  }, [isMobile, mobileOpen, onMobileOpenChange]);

  useFocusTrap(panelRef, panelOpen);

  function handleClick(event: ReactMouseEvent<HTMLElement>) {
    onClick?.(event);
    const target = event.target as HTMLElement;
    if (panelOpen && target.closest?.("[data-sidebar-item]")) requestClose();
  }

  return (
    <>
      {panelOpen && (
        <div
          data-sidebar-backdrop
          className={styles.backdrop}
          onClick={requestClose}
          aria-hidden="true"
        />
      )}
      <nav
        ref={panelRef}
        className={cx(
          styles.sidebar,
          isCollapsed && styles.collapsed,
          panelOpen && styles.open,
          className,
        )}
        data-collapsed={isCollapsed || undefined}
        data-mobile-open={panelOpen || undefined}
        onClick={handleClick}
        {...props}
      >
        {(header || headerCollapsed) && (
          <div className={styles.header}>
            <div className={styles.headerContent}>{isCollapsed ? headerCollapsed : header}</div>
          </div>
        )}
        <div className={styles.nav}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
        {showToggle && (
          <div className={styles.toggleRow}>
            <button
              type="button"
              className={styles.toggle}
              onClick={handleToggle}
              aria-label={isCollapsed ? "Expandir barra lateral" : "Contraer barra lateral"}
              aria-expanded={!isCollapsed}
              title={isCollapsed ? "Expandir barra lateral" : "Contraer barra lateral"}
            >
              {isCollapsed ? <PanelLeftOpen aria-hidden="true" /> : <PanelLeftClose aria-hidden="true" />}
            </button>
          </div>
        )}
      </nav>
    </>
  );
}

export interface SidebarTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  /** Si el panel móvil está abierto. Se refleja en `aria-expanded`. */
  open?: boolean;
  /** Etiqueta accesible del botón. */
  label?: string;
}

/**
 * Botón de 44 px que abre el panel de `Sidebar` en móvil. Solo se ve en móvil; en tablet
 * y escritorio la barra está visible y no se necesita.
 */
export function SidebarTrigger({
  open = false,
  label = "Abrir menú de navegación",
  className,
  ...props
}: SidebarTriggerProps) {
  return (
    <button
      type="button"
      className={cx(styles.trigger, className)}
      aria-label={label}
      aria-expanded={open}
      {...props}
    >
      <Menu aria-hidden="true" />
    </button>
  );
}

export interface SidebarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Etiqueta del grupo mostrada arriba de los elementos. */
  label?: ReactNode;
}

export function SidebarGroup({
  label,
  className,
  children,
  ...props
}: SidebarGroupProps) {
  return (
    <div className={className} {...props}>
      {label && <div className={styles.groupLabel}>{label}</div>}
      {children}
    </div>
  );
}

export interface SidebarItemProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Marca este elemento como la ruta activa. */
  active?: boolean;
  /** Icono inicial. */
  icon?: ReactNode;
  /** Insignia final (por ejemplo, un conteo). */
  badge?: ReactNode;
  /** Renderizar como un elemento diferente (por ejemplo "a" o un Link de router). Por defecto: "button". */
  as?: ElementType;
  /** Etiqueta de accesibilidad usada como título cuando se contrae. */
  label?: string;
  /** href cuando se renderiza como un anchor. */
  href?: string;
}

export function SidebarItem({
  active = false,
  icon,
  badge,
  as,
  label,
  className,
  children,
  ...props
}: SidebarItemProps) {
  const Component = (as ?? "button") as ElementType;
  const extraProps =
    Component === "button" ? { type: "button" as const } : {};

  return (
    <Component
      className={cx(styles.item, active && styles.active, className)}
      aria-current={active ? "page" : undefined}
      title={label}
      data-sidebar-item=""
      {...extraProps}
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{children ?? label}</span>
      {badge != null && <span className={styles.badge}>{badge}</span>}
    </Component>
  );
}
