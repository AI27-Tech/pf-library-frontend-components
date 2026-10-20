import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import styles from "./Badge.module.css";
import { Tooltip } from "../Tooltip";

export type BadgeVariant =
  | "secure"
  | "alert"
  | "escort"
  | "warning"
  | "neutral";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Variante de estado, mapeado a señales tácticas de AI27. */
  variant?: BadgeVariant;
  /** Mostrar un indicador de estado inicial. */
  dot?: boolean;
  /** Animar el indicador (para alertas en vivo/activas, por ejemplo jamming). Implica `dot`. */
  pulse?: boolean;
  /** Usar una forma de píldora completamente redondeada. */
  pill?: boolean;
  /**
   * Recortar el texto largo con puntos suspensivos ("…") en vez de dejar que el
   * badge crezca o se corte contra el borde del contenedor. Útil en espacios
   * angostos como celdas de una rejilla o una tabla.
   *
   * - `true`: recorta al ancho disponible del contenedor.
   * - un número (px) o string CSS (p. ej. `"8rem"`): fija el ancho máximo del badge.
   *
   * Cuando se recorta y el texto no cabe, se muestra el valor completo en un
   * tooltip al pasar el cursor (ver `tooltip`).
   */
  truncate?: boolean | number | string;
  /**
   * Solo aplica junto con `truncate`. Al pasar el cursor, el badge se despliega a
   * su ancho completo para leer todo el texto (sin animación de scroll) y vuelve a
   * recortarse al salir. Útil cuando el usuario necesita ver el valor completo sin
   * depender del tooltip nativo. El badge expandido flota por encima de sus vecinos.
   */
  expandOnHover?: boolean;
  /**
   * Solo aplica junto con `truncate`. Da al badge un ancho FIJO en vez de un
   * máximo, de modo que todos los badges truncados midan lo mismo y se vean
   * parejos y compactos (útil en una rejilla o columna). El ancho es el mismo
   * que controla `truncate` (por defecto ~5rem).
   */
  fixedWidth?: boolean;
  /**
   * Solo aplica junto con `truncate`. Controla cómo se muestra el texto completo
   * cuando está recortado, al pasar el cursor:
   *
   * - `"custom"` (por defecto): tooltip propio, estilizado e instantáneo. Se
   *   posiciona con `position: fixed`, así no lo recorta ningún contenedor con
   *   `overflow: hidden` (p. ej. la imagen de una card).
   * - `"native"`: usa el atributo `title` del navegador (con retraso y estilo del SO).
   * - `false`: sin tooltip.
   */
  tooltip?: "custom" | "native" | false;
  children?: ReactNode;
}

interface TooltipState {
  text: string;
  x: number;
  y: number;
}

export function Badge({
  variant = "neutral",
  dot = false,
  pulse = false,
  pill = false,
  truncate = false,
  expandOnHover = false,
  fixedWidth = false,
  tooltip = "custom",
  className,
  children,
  style,
  title,
  onMouseEnter,
  onMouseLeave,
  ...props
}: BadgeProps) {
  const showDot = dot || pulse;
  const isTruncated = truncate !== false;
  // Expandir al hover solo tiene sentido si además se está truncando.
  const canExpand = isTruncated && expandOnHover;
  // Ancho fijo solo tiene sentido si además se está truncando.
  const isFixedWidth = isTruncated && fixedWidth;

  // Ancho máximo opcional: número → px; string → tal cual. Se expone como
  // variable CSS que la clase .truncate consume.
  const maxWidth =
    typeof truncate === "number"
      ? `${truncate}px`
      : typeof truncate === "string"
        ? truncate
        : undefined;

  const mergedStyle: CSSProperties | undefined = maxWidth
    ? { ...style, ["--ui-badge-max-width" as string]: maxWidth }
    : style;

  // El texto completo, solo si el contenido es una cadena (para el tooltip/title).
  const fullText = typeof children === "string" ? children : undefined;

  // ── Medición de desbordamiento ───────────────────────────────────────────
  // El tooltip solo tiene sentido si el texto no cabe. Medimos scrollWidth vs
  // clientWidth del texto recortado; si no desborda, no mostramos nada.
  const textRef = useRef<HTMLSpanElement>(null);
  const [overflowing, setOverflowing] = useState(false);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el || !isTruncated) {
      setOverflowing(false);
      return;
    }
    const medir = () => setOverflowing(el.scrollWidth > el.clientWidth + 1);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children, isTruncated]);

  // ── Tooltip propio ─────────────────────────────────────────────────────────
  // Se activa solo con truncate + tooltip="custom" + texto que desborda + texto
  // disponible como cadena. Cuando no aplica, no se renderiza nada nuevo, así que
  // los badges existentes (sin truncate) no cambian en absoluto.
  const useCustomTooltip =
    isTruncated && tooltip === "custom" && overflowing && fullText !== undefined;

  const [tip, setTip] = useState<TooltipState | null>(null);

  const handleEnter = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      onMouseEnter?.(e);
      if (!useCustomTooltip || !fullText) return;
      const rect = e.currentTarget.getBoundingClientRect();
      // Posición: centrado horizontalmente sobre el badge, justo encima.
      setTip({
        text: fullText,
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    },
    [useCustomTooltip, fullText, onMouseEnter],
  );

  const handleLeave = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      onMouseLeave?.(e);
      setTip(null);
    },
    [onMouseLeave],
  );

  // El title nativo se usa solo si se pidió explícitamente tooltip="native"
  // (o si el usuario pasó su propio title). Con el tooltip propio no ponemos
  // title para no duplicar.
  const nativeTitle =
    title !== undefined
      ? title
      : isTruncated && tooltip === "native" && overflowing
        ? fullText
        : undefined;

  return (
    <span
      className={cx(
        styles.badge,
        styles[variant],
        pill && styles.pill,
        isTruncated && styles.truncate,
        isFixedWidth && styles.fixedWidth,
        canExpand && styles.expandable,
        className,
      )}
      style={mergedStyle}
      {...props}
      title={nativeTitle}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {showDot && (
        <span
          className={cx(styles.dot, pulse && styles.pulse)}
          aria-hidden="true"
        />
      )}
      {isTruncated ? (
        <span ref={textRef} className={styles.truncateText}>
          {children}
        </span>
      ) : (
        children
      )}
      {/* Tooltip propio (componente Tooltip): flota sobre cualquier contenedor con
          overflow:hidden. Solo se monta cuando hay hover sobre texto recortado. */}
      {tip && (
        <Tooltip x={tip.x} y={tip.y}>
          {tip.text}
        </Tooltip>
      )}
    </span>
  );
}
