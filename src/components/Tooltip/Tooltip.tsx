import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "./Tooltip.module.css";
import { clampToViewport } from "../../utils/responsive/position";

export interface TooltipProps {
  /** Texto o contenido a mostrar dentro del tooltip. */
  children: ReactNode;
  /** Coordenada horizontal (viewport, px): el tooltip se centra sobre este punto. */
  x: number;
  /** Coordenada vertical (viewport, px): borde superior del elemento anclado. */
  y: number;
}

/**
 * Tooltip flotante posicionado con `position: fixed` a partir de coordenadas de
 * viewport.
 *
 * Se renderiza mediante un **portal a `document.body`**. Esto es esencial: si el
 * tooltip viviera dentro del árbol de su disparador, cualquier ancestro con
 * `transform`, `filter` o `backdrop-filter` (p. ej. el badge sobre una imagen usa
 * `backdrop-filter`) crearía un contexto de contención que ataría su `position:
 * fixed` a ese ancestro —y un `overflow: hidden` cercano lo recortaría—. Con el
 * portal, el tooltip cuelga del `body` y su posición se ancla al viewport real.
 *
 * Es un componente de presentación puro: no mide, no escucha el hover ni decide
 * cuándo mostrarse. Quien lo usa (p. ej. `Badge`) controla su visibilidad y le
 * pasa la posición ya calculada (con `getBoundingClientRect`).
 */
/** Margen mínimo entre el tooltip y el borde de la ventana, en px. */
const VIEWPORT_MARGIN = 8;

export function Tooltip({ children, x, y }: TooltipProps) {
  const ref = useRef<HTMLSpanElement>(null);
  // Centro horizontal ajustado para que el tooltip no se salga por los lados.
  const [centerX, setCenterX] = useState(x);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    function recalculate() {
      if (!el) return;
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      const { left } = clampToViewport(
        { top: y, left: x - width / 2, width, height: 0 },
        { width, height },
        { width: window.innerWidth, height: window.innerHeight },
        VIEWPORT_MARGIN,
      );
      setCenterX(left + width / 2);
    }
    recalculate();
    // El ancho cambia al girar la pantalla, al cargar la fuente o al partir el texto.
    window.addEventListener("resize", recalculate);
    window.addEventListener("orientationchange", recalculate);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(recalculate);
    observer?.observe(el);
    return () => {
      window.removeEventListener("resize", recalculate);
      window.removeEventListener("orientationchange", recalculate);
      observer?.disconnect();
    };
  }, [x, y, children]);

  // Sin DOM (SSR) no hay donde portalar: no renderizamos nada.
  if (typeof document === "undefined") return null;

  return createPortal(
    <span
      ref={ref}
      className={styles.tooltip}
      role="tooltip"
      aria-hidden="true"
      style={{ left: centerX, top: y }}
    >
      {children}
    </span>,
    document.body,
  );
}
