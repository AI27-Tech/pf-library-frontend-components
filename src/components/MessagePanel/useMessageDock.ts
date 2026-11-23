import { useCallback, useEffect, useReducer } from "react";
import { getBreakpoint } from "../../utils/breakpoints";
import { DOCK_INITIAL_STATE, dockReducer, type DockPanelState } from "./dockState";

export { DOCK_INITIAL_STATE, dockReducer } from "./dockState";
export type { DockAction, DockPanelState, DockState } from "./dockState";

/** Lee una longitud CSS en píxeles. Soporta `px` y `rem`; si no entiende el valor usa el respaldo. */
export function longitudEnPx(valor: string, respaldoPx: number, pxPorRem = 16): number {
  const texto = valor.trim();
  const numero = parseFloat(texto);
  if (Number.isNaN(numero)) return respaldoPx;
  if (texto.endsWith("rem")) return numero * pxPorRem;
  if (texto.endsWith("px")) return numero;
  return respaldoPx;
}

/** Cuántos paneles caben: el ancho disponible menos la barra y los márgenes, entre el ancho de un panel. */
export function capacidadPara(
  anchoVentana: number,
  anchoPanel: number,
  anchoBarra: number,
  separacion: number,
): number {
  const disponible = anchoVentana - anchoBarra - separacion * 2;
  return Math.max(1, Math.floor(disponible / (anchoPanel + separacion)));
}

interface UseMessageDockOptions {
  /**
   * Fija la capacidad y el máximo de paneles expandidos, sin depender del ancho de la ventana.
   * Sin esta opción, en móvil y tablet solo un panel queda expandido (el resto se minimiza),
   * y en escritorio caben tantos paneles expandidos como ranuras.
   */
  maxPanels?: number;
}

/** Estado del muelle: paneles abiertos, minimizados, overflow y barra. */
export function useMessageDock(opciones: UseMessageDockOptions = {}) {
  const { maxPanels } = opciones;
  const [state, dispatch] = useReducer(dockReducer, DOCK_INITIAL_STATE);

  const recalcular = useCallback(() => {
    if (maxPanels !== undefined) {
      dispatch({ type: "setLimits", capacity: maxPanels, maxOpen: maxPanels });
      return;
    }
    const estilos = getComputedStyle(document.documentElement);
    const anchoPanel = longitudEnPx(estilos.getPropertyValue("--ui-surface-panel-width"), 320);
    const anchoBarra = longitudEnPx(estilos.getPropertyValue("--ui-surface-panel-width-sm"), 288);
    const capacity = capacidadPara(window.innerWidth, anchoPanel, anchoBarra, 16);
    const maxOpen = getBreakpoint(window.innerWidth) === "desktop" ? capacity : 1;
    dispatch({ type: "setLimits", capacity, maxOpen });
  }, [maxPanels]);

  useEffect(() => {
    recalcular();
    if (maxPanels !== undefined) return;
    window.addEventListener("resize", recalcular);
    return () => window.removeEventListener("resize", recalcular);
  }, [maxPanels, recalcular]);

  const visibles = state.order.slice(0, state.capacity);
  const overflow = state.order.slice(state.capacity);

  return {
    panels: visibles.map((id): DockPanelState => ({ id, minimized: state.minimized[id] === true })),
    overflow,
    barOpen: state.barOpen,
    open: useCallback((id: string) => dispatch({ type: "open", id }), []),
    close: useCallback((id: string) => dispatch({ type: "close", id }), []),
    toggle: useCallback((id: string) => dispatch({ type: "toggle", id }), []),
    toggleBar: useCallback(() => dispatch({ type: "toggleBar" }), []),
  };
}
