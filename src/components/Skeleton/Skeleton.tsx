import type { CSSProperties, HTMLAttributes } from "react";
import { cx } from "../../utils/cx";
import { Card, CardBody } from "../Card";
import styles from "./Skeleton.module.css";

export type SkeletonVariant = "text" | "circle" | "rect";
export type SkeletonAnimation = "shimmer" | "pulse" | false;

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /** Forma del placeholder. Por defecto: "text". */
  variant?: SkeletonVariant;
  /** Ancho: número en px o cadena CSS. */
  width?: number | string;
  /** Alto: número en px o cadena CSS. */
  height?: number | string;
  /** Animación del placeholder. Por defecto: "shimmer". */
  animation?: SkeletonAnimation;
}

export interface SkeletonTextProps extends HTMLAttributes<HTMLDivElement> {
  /** Número de líneas. Por defecto: 3. */
  lines?: number;
  /** Ancho de la última línea. Por defecto: "60%". */
  lastLineWidth?: string;
}

export interface SkeletonCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Número de líneas de texto. Por defecto: 3. */
  lines?: number;
  /** Muestra un bloque de medio antes del texto. Por defecto: false. */
  media?: boolean;
}

function toCssSize(value: number | string | undefined) {
  return typeof value === "number" ? `${value}px` : value;
}

/**
 * Placeholder de un bloque de contenido que aún no cargó.
 *
 * Es decorativo: `aria-hidden`. El aviso para lectores de pantalla lo da el
 * contenedor (`SkeletonText`, `SkeletonCard`, `SkeletonTable`) con `role="status"`.
 */
export function Skeleton({
  variant = "text",
  width,
  height,
  animation = "shimmer",
  className,
  style,
  ...props
}: SkeletonProps) {
  // Un círculo con solo ancho es cuadrado: el alto sigue al ancho.
  const resolvedHeight = variant === "circle" && height === undefined ? width : height;
  const inlineStyle: CSSProperties = {
    width: toCssSize(width),
    height: toCssSize(resolvedHeight),
    ...style,
  };

  return (
    <span
      {...props}
      aria-hidden="true"
      className={cx(
        styles.skeleton,
        styles[variant],
        animation === "pulse" && styles.pulse,
        animation === false && styles.static,
        className,
      )}
      style={inlineStyle}
    />
  );
}

function SkeletonLines({ lines, lastLineWidth }: { lines: number; lastLineWidth: string }) {
  return (
    <>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 ? lastLineWidth : undefined}
        />
      ))}
    </>
  );
}

/** Varias líneas de texto en carga. */
export function SkeletonText({
  lines = 3,
  lastLineWidth = "60%",
  className,
  ...props
}: SkeletonTextProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      className={cx(styles.group, className)}
      {...props}
    >
      <span className="ui-sr-only">Cargando</span>
      <SkeletonLines lines={lines} lastLineWidth={lastLineWidth} />
    </div>
  );
}

/**
 * Tarjeta en carga. Usa `Card` como contenedor, así que el padding, el borde y el
 * radio son los mismos que una `Card` real.
 */
export function SkeletonCard({ lines = 3, media = false, className, ...props }: SkeletonCardProps) {
  return (
    <Card
      {...props}
      role="status"
      aria-busy="true"
      variant="outlined"
      padding="md"
      className={className}
    >
      <span className="ui-sr-only">Cargando</span>
      <CardBody className={styles.group}>
        {media && <Skeleton variant="rect" className={styles.media} />}
        <SkeletonLines lines={lines} lastLineWidth="60%" />
      </CardBody>
    </Card>
  );
}
