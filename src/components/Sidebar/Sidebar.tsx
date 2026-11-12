import type { ReactNode, HTMLAttributes, ElementType } from "react";
import styles from "./Sidebar.module.css";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Área de encabezado / marca en la parte superior. */
  header?: ReactNode;
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
      {(header || onToggleCollapse) && (
        <div className={styles.header}>
          {header && <div className={styles.headerContent}>{header}</div>}
          {onToggleCollapse && (
            <button
              type="button"
              className={styles.toggle}
              onClick={onToggleCollapse}
              aria-label={collapsed ? "Expandir barra lateral" : "Contraer barra lateral"}
              aria-expanded={!collapsed}
              title={collapsed ? "Expandir barra lateral" : "Contraer barra lateral"}
            >
              <PanelIcon />
            </button>
          )}
        </div>
      )}

      <div className={styles.nav}>{children}</div>

      {footer && <div className={styles.footer}>{footer}</div>}
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

function PanelIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" />
      <path d="M16 10l-2 2 2 2" />
    </svg>
  );
}
