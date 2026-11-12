import type { HTMLAttributes, ReactNode } from "react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { Card, CardBody } from "../Card";
import { Skeleton } from "../Skeleton";
import { cx } from "../../utils/cx";
import styles from "./Stat.module.css";

export type TrendDirection = "up" | "down" | "flat";

export interface StatTrend {
  /** Dirección del cambio. */
  direction: TrendDirection;
  /** Valor del cambio, por ejemplo "+12 %". */
  value: ReactNode;
}

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  /** Nombre de la métrica. */
  label: ReactNode;
  /** Valor principal. */
  value: ReactNode;
  /** Icono decorativo en la esquina superior derecha. */
  icon?: ReactNode;
  /** Texto de apoyo bajo el valor. */
  helpText?: ReactNode;
  /** Tendencia del valor frente a un periodo anterior. */
  trend?: StatTrend;
  /** Invierte el significado de subir y bajar (por ejemplo, en un tiempo de respuesta). */
  invertTrend?: boolean;
  /** Muestra esqueletos en lugar del valor y la tendencia. */
  loading?: boolean;
}

const TREND_TEXT: Record<TrendDirection, string> = {
  up: "Sube",
  down: "Baja",
  flat: "Sin cambio",
};

const TREND_ICON: Record<TrendDirection, typeof ArrowUp> = {
  up: ArrowUp,
  down: ArrowDown,
  flat: Minus,
};

/** Tono de color según el significado del cambio. Con `invertTrend`, subir es negativo. */
function trendTone(direction: TrendDirection, invertTrend: boolean): "positive" | "negative" | "neutral" {
  if (direction === "flat") return "neutral";
  const upIsGood = !invertTrend;
  const isGood = direction === "up" ? upIsGood : !upIsGood;
  return isGood ? "positive" : "negative";
}

/** Métrica con valor, tendencia y texto de apoyo, sobre `Card`. */
export function Stat({
  label,
  value,
  icon,
  helpText,
  trend,
  invertTrend = false,
  loading = false,
  className,
  ...props
}: StatProps) {
  const TrendIcon = trend ? TREND_ICON[trend.direction] : null;

  return (
    <Card variant="outlined" className={cx(styles.stat, className)} aria-busy={loading || undefined} {...props}>
      <CardBody>
        <div className={styles.header}>
          <span className={styles.label}>{label}</span>
          {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
        </div>

        {loading ? (
          <div className={styles.loading}>
            <Skeleton variant="text" width="6rem" height="1.5rem" />
            <Skeleton variant="text" width="8rem" />
          </div>
        ) : (
          <>
            <span className={styles.value}>{value}</span>
            {trend && TrendIcon && (
              <span
                className={styles.trend}
                data-tone={trendTone(trend.direction, invertTrend)}
              >
                <TrendIcon aria-hidden="true" className={styles.trendIcon} />
                <span className="ui-sr-only">{TREND_TEXT[trend.direction]}</span>
                {trend.value}
              </span>
            )}
            {helpText && <span className={styles.help}>{helpText}</span>}
          </>
        )}
      </CardBody>
    </Card>
  );
}
