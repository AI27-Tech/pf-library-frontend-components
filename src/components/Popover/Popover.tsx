import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { cx } from "../../utils/cx";
import styles from "./Popover.module.css";

export interface PopoverProps {
  /** Elemento al que se ancla el popover. */
  anchorRef: RefObject<HTMLElement | null>;
  /** Controla la visibilidad. */
  open: boolean;
  /** Llamado al hacer clic fuera del popover y del ancla, o al presionar Escape. */
  onClose: () => void;
  /** Lado de apertura. `auto` abre abajo si cabe y arriba si no. Por defecto: "auto". */
  position?: "bottom" | "top" | "auto";
  /** Alineación horizontal respecto al ancla. Por defecto: "start". */
  align?: "start" | "end";
  /** Separación en px entre el ancla y el popover. Por defecto: 4. */
  offset?: number;
  /** Iguala el ancho del popover al ancho del ancla. */
  matchAnchorWidth?: boolean;
  /** Rol ARIA del contenedor. Por defecto: "dialog". */
  role?: "dialog" | "listbox" | "menu";
  /** Etiqueta de accesibilidad del contenedor. */
  "aria-label"?: string;
  id?: string;
  /** Clase adicional para el contenedor. */
  className?: string;
  /**
   * Se llama una vez por apertura, cuando el popover ya es visible y está posicionado.
   * Úsalo para mover el foco a su contenido: antes de eso el contenido está oculto y no admite foco.
   */
  onPositioned?: () => void;
  /** Contenido del popover. El consumidor controla su propio espaciado. */
  children: ReactNode;
}

/** Distancia mínima en px entre el popover y los bordes del viewport. */
const VIEWPORT_MARGIN = 8;

/**
 * Contenedor flotante anclado a un elemento.
 *
 * Se renderiza en un portal a `document.body` y se posiciona con `position: fixed`
 * usando `getBoundingClientRect` del ancla. Así no lo recorta un ancestro con
 * `overflow: hidden` ni lo afecta un `transform` cercano.
 *
 * Solo gestiona posición y cierre (clic fuera y Escape). El manejo de foco lo
 * decide cada consumidor.
 *
 * `Escape` se escucha en `window` en fase de captura y detiene la propagación.
 * Así, un popover dentro de `Modal` cierra solo el popover, porque el `Modal`
 * escucha `Escape` en `document`.
 */
export function Popover({
  anchorRef,
  open,
  onClose,
  position = "auto",
  align = "start",
  offset = 4,
  matchAnchorWidth = false,
  role = "dialog",
  "aria-label": ariaLabel,
  id,
  className,
  onPositioned,
  children,
}: PopoverProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const notifiedRef = useRef(false);

  // Avisa una sola vez por apertura, ya con el contenido visible.
  useEffect(() => {
    if (!open) {
      notifiedRef.current = false;
      return;
    }
    if (coords && !notifiedRef.current) {
      notifiedRef.current = true;
      onPositioned?.();
    }
  }, [open, coords, onPositioned]);

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    const content = contentRef.current;
    if (!anchor || !content) return;

    const anchorRect = anchor.getBoundingClientRect();
    // Se aplica el ancho antes de medir, para que la altura corresponda a ese ancho.
    content.style.width = matchAnchorWidth ? `${anchorRect.width}px` : "";

    const contentWidth = matchAnchorWidth ? anchorRect.width : content.offsetWidth;
    const contentHeight = content.offsetHeight;

    const spaceBelow = window.innerHeight - anchorRect.bottom - offset;
    const spaceAbove = anchorRect.top - offset;
    const opensUp =
      position === "top" ||
      (position === "auto" && spaceBelow < contentHeight && spaceAbove > spaceBelow);
    const rawTop = opensUp
      ? anchorRect.top - offset - contentHeight
      : anchorRect.bottom + offset;
    // Si no cabe abajo ni arriba, se mantiene dentro del viewport aunque tape el ancla.
    const maxTop = window.innerHeight - contentHeight - VIEWPORT_MARGIN;
    const top = Math.max(VIEWPORT_MARGIN, Math.min(rawTop, maxTop));

    const rawLeft = align === "end" ? anchorRect.right - contentWidth : anchorRect.left;
    const maxLeft = window.innerWidth - contentWidth - VIEWPORT_MARGIN;
    const left = Math.max(VIEWPORT_MARGIN, Math.min(rawLeft, maxLeft));

    setCoords({ top, left });
  }, [anchorRef, position, align, offset, matchAnchorWidth]);

  // Antes de pintar: medir y colocar en la misma pasada, para evitar un salto visible.
  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, updatePosition]);

  // Reposicionar al hacer scroll de cualquier ancestro (captura) y al cambiar el tamaño.
  useEffect(() => {
    if (!open) return;
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  // Cierre por clic fuera (el ancla no cuenta como "fuera") y por Escape.
  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (contentRef.current?.contains(target) || anchorRef.current?.contains(target)) {
        return;
      }
      onClose();
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      onClose();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [open, onClose, anchorRef]);

  if (!open || typeof document === "undefined") return null;

  // Antes de la primera medición el contenido se oculta para no mostrar una posición provisional.
  const style: CSSProperties = coords
    ? { top: coords.top, left: coords.left }
    : { top: 0, left: 0, visibility: "hidden" };

  return createPortal(
    <div
      ref={contentRef}
      id={id}
      role={role}
      aria-label={ariaLabel}
      className={cx(styles.popover, className)}
      style={style}
    >
      {children}
    </div>,
    document.body,
  );
}
