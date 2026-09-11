import { useState, type ReactNode, type HTMLAttributes } from "react";
import styles from "./Navbar.module.css";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  /** Brand / logo area, usually a link to home. */
  brand?: ReactNode;
  /** Navigation links (typically NavbarLink elements). */
  links?: ReactNode;
  /** Right-aligned actions (buttons, avatar, etc.). */
  actions?: ReactNode;
  /** Stick to the top of the viewport. */
  sticky?: boolean;
}

export function Navbar({
  brand,
  links,
  actions,
  sticky = false,
  className,
  ...props
}: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className={cx(styles.navbar, sticky && styles.sticky, className)}
      {...props}
    >
      {brand && <div className={styles.brand}>{brand}</div>}

      {links && (
        <div className={cx(styles.links, !open && styles.closed)}>{links}</div>
      )}

      {actions && <div className={styles.actions}>{actions}</div>}

      {links && (
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      )}
    </nav>
  );
}

export interface NavbarLinkProps
  extends HTMLAttributes<HTMLAnchorElement> {
  /** Marks the link as the current page. */
  active?: boolean;
  /** Optional leading icon. */
  icon?: ReactNode;
  href?: string;
}

export function NavbarLink({
  active = false,
  icon,
  className,
  children,
  ...props
}: NavbarLinkProps) {
  return (
    <a
      className={cx(styles.link, active && styles.active, className)}
      aria-current={active ? "page" : undefined}
      {...props}
    >
      {icon}
      {children}
    </a>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
