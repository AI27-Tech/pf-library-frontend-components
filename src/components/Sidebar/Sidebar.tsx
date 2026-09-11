import type { ReactNode, HTMLAttributes, ElementType } from "react";
import styles from "./Sidebar.module.css";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Header / brand area at the top. */
  header?: ReactNode;
  /** Footer area at the bottom (below the collapse control). */
  footer?: ReactNode;
  /** Whether the sidebar is collapsed to icons only (controlled). */
  collapsed?: boolean;
  /** Called when the built-in collapse button is clicked. Omit to hide it. */
  onToggleCollapse?: () => void;
  /** Navigation content (SidebarItem / SidebarGroup elements). */
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
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
          >
            <ChevronIcon />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      )}

      {footer && <div className={styles.footer}>{footer}</div>}
    </nav>
  );
}

export interface SidebarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Group label shown above the items. */
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
  /** Marks this item as the active route. */
  active?: boolean;
  /** Leading icon. */
  icon?: ReactNode;
  /** Trailing badge (e.g. a count). */
  badge?: ReactNode;
  /** Render as a different element (e.g. "a" or a router Link). Default: "button". */
  as?: ElementType;
  /** Accessible label used as title when collapsed. */
  label?: string;
  /** href when rendered as an anchor. */
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
