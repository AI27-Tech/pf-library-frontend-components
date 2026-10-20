import type { ReactNode, HTMLAttributes, ElementType } from "react";
import styles from "./Sidebar.module.css";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Área de encabezado / marca en la parte superior. */
  header?: ReactNode;
  /** Área de pie de página en la parte inferior (debajo del control de colapso). */
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
      {header && <div className={styles.header}>{header}</div>}

      <div className={styles.nav}>{children}</div>

      {onToggleCollapse && (
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.collapseBtn}
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expandir barra lateral" : "Contraer barra lateral"}
            aria-expanded={!collapsed}
          >
            <ChevronIcon />
            {!collapsed && <span>Contraer</span>}
          </button>
        </div>
      )}

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

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
