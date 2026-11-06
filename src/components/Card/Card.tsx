import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Card.module.css";

export type CardVariant = "outlined" | "elevated" | "filled";
export type CardPadding = "none" | "sm" | "md" | "lg";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Estilo visual de la tarjeta. */
  variant?: CardVariant;
  /** Escala de relleno interno aplicado a secciones. */
  padding?: CardPadding;
  /**
   * Cuando se establece, la tarjeta se renderiza como botón y se vuelve accesible por teclado.
   * Usar para tarjetas que navegan o desencadenan una acción.
   */
  onClick?: HTMLAttributes<HTMLDivElement>["onClick"];
}

export function Card({
  variant = "outlined",
  padding = "md",
  onClick,
  className,
  children,
  ...props
}: CardProps) {
  const isClickable = Boolean(onClick);
  return (
    <div
      className={cx(
        styles.card,
        styles[variant],
        styles[`padding-${padding}`],
        isClickable && styles.clickable,
        className,
      )}
      data-variant={variant}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                (e.currentTarget as HTMLElement).click();
              }
            }
          : undefined
      }
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Título principal. */
  title?: ReactNode;
  /** Texto secundario debajo del título. */
  subtitle?: ReactNode;
  /** Media inicial (icono, avatar). */
  media?: ReactNode;
  /** Acción final (botón, menú). */
  action?: ReactNode;
}

export function CardHeader({
  title,
  subtitle,
  media,
  action,
  className,
  children,
  ...props
}: CardHeaderProps) {
  return (
    <div className={cx(styles.header, className)} {...props}>
      {media && <div className={styles.media}>{media}</div>}
      <div className={styles.headerText}>
        {title && <h3 className={styles.title}>{title}</h3>}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {children}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}

export function CardBody({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx(styles.body, className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx(styles.footer, className)} {...props}>
      {children}
    </div>
  );
}
