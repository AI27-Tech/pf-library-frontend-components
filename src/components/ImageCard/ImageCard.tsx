import type { HTMLAttributes, ReactNode } from "react";
import styles from "./ImageCard.module.css";
import { Badge, type BadgeVariant } from "../Badge";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface BadgeConfig {
  label: ReactNode;
  variant?: BadgeVariant;
  /** Show a leading status dot. */
  dot?: boolean;
  /** Animate the dot (for live/active alerts). Implies `dot`. */
  pulse?: boolean;
  /** Use a fully rounded pill shape. */
  pill?: boolean;
  /** Position of the badge: "left" or "right". Default: "right" */
  position?: "left" | "right";
}

export interface ImageCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** URL of the main image. */
  src: string;
  /** Alt text for the image. */
  alt: string;
  /** Main title displayed below the image. */
  title: ReactNode;
  /** Secondary text below the title. */
  subtitle?: ReactNode;
  /** Array of badge configurations (up to 2 badges). */
  badges?: BadgeConfig[];
  /** Additional content below subtitle. */
  footer?: ReactNode;
  /** Make the whole card clickable. */
  onClick?: HTMLAttributes<HTMLDivElement>["onClick"];
  /** Visual variant of the card. */
  variant?: "outlined" | "elevated" | "filled";
}

export function ImageCard({
  src,
  alt,
  title,
  subtitle,
  badges,
  footer,
  onClick,
  variant = "outlined",
  className,
  ...props
}: ImageCardProps) {
  const isClickable = Boolean(onClick);
  const badgesToShow = (badges || []).slice(0, 2);

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
      {/* Image container with badges overlay */}
      <div className={styles.imageContainer}>
        <img src={src} alt={alt} className={styles.image} />
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

      {/* Content below image */}
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}
