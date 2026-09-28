import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "./Tooltip.module.css";

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
export function Tooltip({ children, x, y }: TooltipProps) {
  // Sin DOM (SSR) no hay dónde portalar: no renderizamos nada.
  if (typeof document === "undefined") return null;

  return createPortal(
    <span
      className={styles.tooltip}
      role="tooltip"
      aria-hidden="true"
      style={{ left: x, top: y }}
    >
      {children}
    </span>,
    document.body,
  );
}
