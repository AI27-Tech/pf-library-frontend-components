import type { ReactNode, HTMLAttributes, ElementType } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
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
  /** Si la barra lateral se contrae solo a iconos (controlado). */
  collapsed?: boolean;
  /** Llamado cuando se hace clic en el botón de colapso integrado. Omitir para ocultarlo. */
  onToggleCollapse?: () => void;
  /** Contenido de navegación (elementos SidebarItem / SidebarGroup). */
  children?: ReactNode;
}

export function Sidebar({
  header,
  headerCollapsed,
  footer,
  collapsed = false,
  onToggleCollapse,
  className,
  children,
  ...props
}: SidebarProps) {
  return (
    <nav
      className={cx(styles.sidebar, collapsed && styles.collapsed, className)}
      data-collapsed={collapsed || undefined}
      {...props}
    >
      {(header || headerCollapsed) && (
        <div className={styles.header}>
          <div className={styles.headerContent}>{collapsed ? headerCollapsed : header}</div>
        </div>
      )}

      <div className={styles.nav}>{children}</div>

      {footer && <div className={styles.footer}>{footer}</div>}

      {onToggleCollapse && (
        <div className={styles.toggleRow}>
          <button
            type="button"
            className={styles.toggle}
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expandir barra lateral" : "Contraer barra lateral"}
            aria-expanded={!collapsed}
            title={collapsed ? "Expandir barra lateral" : "Contraer barra lateral"}
          >
            {collapsed ? <PanelLeftOpen aria-hidden="true" /> : <PanelLeftClose aria-hidden="true" />}
          </button>
        </div>
      )}
    </nav>
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
      {...extraProps}
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{children ?? label}</span>
      {badge != null && <span className={styles.badge}>{badge}</span>}
    </Component>
  );
}


