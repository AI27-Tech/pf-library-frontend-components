import type { HTMLAttributes, ReactNode } from "react";
import styles from "./ImageCard.module.css";
import { Badge, type BadgeVariant } from "../Badge";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface BadgeConfig {
  label: ReactNode;
  variant?: BadgeVariant;
  /** Mostrar un indicador de estado inicial. */
  dot?: boolean;
  /** Animar el indicador (para alertas en vivo/activas). Implica `dot`. */
  pulse?: boolean;
  /** Usar una forma de píldora completamente redondeada. */
  pill?: boolean;
  /** Posición del badge: "left" o "right". Predeterminado: "right" */
  position?: "left" | "right";
}

export interface ImageCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** URL de la imagen principal. Omitir o pasar vacío para mostrar contenido personalizado (children). */
  src?: string;
  /** Texto alternativo para la imagen. */
  alt: string;
  /** Título principal mostrado debajo de la imagen. */
  title: ReactNode;
  /** Texto secundario debajo del título. */
  subtitle?: ReactNode;
  /** Array de configuraciones de badge (hasta 2 badges). */
  badges?: BadgeConfig[];
  /** Contenido adicional debajo del subtítulo. */
  footer?: ReactNode;
  /** Contenido personalizado para el área de imagen (p. ej., ícono para audio). Se muestra si `src` está vacío o es falsy. */
  children?: ReactNode;
  /** Hacer toda la tarjeta clickeable. */
  onClick?: HTMLAttributes<HTMLDivElement>["onClick"];
  /** Variante visual de la tarjeta. */
  variant?: "outlined" | "elevated" | "filled";
}

export function ImageCard({
  src,
  alt,
  title,
  subtitle,
  badges,
  footer,
  children,
  onClick,
  variant = "outlined",
  className,
  ...props
}: ImageCardProps) {
  const isClickable = Boolean(onClick);
  const badgesToShow = (badges || []).slice(0, 2);
  const hasCustomContent = children && (!src || src === '');

  return (
    <div
      className={cx(
        styles.imageCard,
        styles[variant],
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
      {/* Contenedor de imagen con overlay de badges */}
      <div className={styles.imageContainer}>
        {hasCustomContent ? (
          <div className={styles.customContent}>
            {children}
          </div>
        ) : src ? (
          <img src={src} alt={alt} className={styles.image} />
        ) : (
          <div className={styles.customContent} />
        )}
        {badgesToShow.length > 0 && (
          <div className={styles.badgesContainer}>
            {badgesToShow.map((badge, idx) => (
              <div
                key={idx}
                className={`${styles.badgeWrapper} ${
                  badge.position === "left" ? styles.left : styles.right
                }`}
              >
                <Badge
                  variant={badge.variant || "neutral"}
                  dot={badge.dot}
                  pulse={badge.pulse}
                  pill={badge.pill}
                  className={styles.badge}
                >
                  {badge.label}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contenido debajo de la imagen */}
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}
