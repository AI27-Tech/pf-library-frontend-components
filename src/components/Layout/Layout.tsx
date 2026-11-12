import type { CSSProperties, ElementType, HTMLAttributes } from "react";
import { cx } from "../../utils/cx";
import styles from "./Layout.module.css";

/** Escala de separación. Cada valor usa `--ui-space-N` (0 es sin separación). */
export type Gap = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Align = "start" | "center" | "end" | "stretch";
export type Justify = "start" | "center" | "end" | "between" | "around";

const ALIGN_VALUES: Record<Align, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
};

const JUSTIFY_VALUES: Record<Justify, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
};

function gapValue(gap: Gap): string {
  return gap === 0 ? "0" : `var(--ui-space-${gap})`;
}

interface FlexProps extends HTMLAttributes<HTMLElement> {
  /** Separación entre hijos, de 0 a 6. Por defecto: 3. */
  gap?: Gap;
  /** Alineación en el eje transversal. */
  align?: Align;
  /** Distribución en el eje principal. */
  justify?: Justify;
  /** Elemento HTML a renderizar. Por defecto: "div". */
  as?: ElementType;
}

export type StackProps = FlexProps;

/** Apila hijos en columna. */
export function Stack({
  gap = 3,
  align,
  justify,
  as: Component = "div",
  className,
  style,
  children,
  ...props
}: StackProps) {
  return (
    <Component
      className={cx(styles.stack, className)}
      style={{
        gap: gapValue(gap),
        alignItems: align && ALIGN_VALUES[align],
        justifyContent: justify && JUSTIFY_VALUES[justify],
        ...style,
      } as CSSProperties}
      {...props}
    >
      {children}
    </Component>
  );
}

export interface InlineProps extends FlexProps {
  /** Permite que los hijos pasen a la línea siguiente cuando no caben. Por defecto: true. */
  wrap?: boolean;
}

/** Ordena hijos en fila. */
export function Inline({
  gap = 2,
  align = "center",
  justify,
  wrap = true,
  as: Component = "div",
  className,
  style,
  children,
  ...props
}: InlineProps) {
  return (
    <Component
      className={cx(styles.inline, className)}
      style={{
        gap: gapValue(gap),
        flexWrap: wrap ? "wrap" : "nowrap",
        alignItems: ALIGN_VALUES[align],
        justifyContent: justify && JUSTIFY_VALUES[justify],
        ...style,
      } as CSSProperties}
      {...props}
    >
      {children}
    </Component>
  );
}

export interface GridProps extends HTMLAttributes<HTMLElement> {
  /** Separación entre celdas, de 0 a 6. Por defecto: 3. */
  gap?: Gap;
  /** Número fijo de columnas. Si se pasa junto con `minItemWidth`, gana este valor. */
  columns?: number;
  /** Ancho mínimo de cada columna. Las columnas se calculan solas (`auto-fit`). Ejemplo: "12rem". */
  minItemWidth?: string;
  /** Elemento HTML a renderizar. Por defecto: "div". */
  as?: ElementType;
}

/** Rejilla de columnas fijas o automáticas. */
export function Grid({
  gap = 3,
  columns,
  minItemWidth,
  as: Component = "div",
  className,
  style,
  children,
  ...props
}: GridProps) {
  let template: string | undefined;
  if (columns !== undefined) {
    template = `repeat(${columns}, minmax(0, 1fr))`;
  } else if (minItemWidth) {
    template = `repeat(auto-fit, minmax(min(${minItemWidth}, 100%), 1fr))`;
  }

  return (
    <Component
      className={cx(styles.grid, className)}
      style={{
        gap: gapValue(gap),
        gridTemplateColumns: template,
        ...style,
      } as CSSProperties}
      {...props}
    >
      {children}
    </Component>
  );
}
