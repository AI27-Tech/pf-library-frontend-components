import { useCallback, useEffect, useReducer } from "react";

export interface DockState {
  /** Ids de los paneles abiertos, el más reciente primero. */
  order: string[];
  /** Paneles minimizados. Ausente o `false` significa expandido. */
  minimized: Record<string, boolean>;
  /** Si la lista de conversaciones de la barra está expandida. */
  barOpen: boolean;
  /** Cuántos paneles caben en pantalla. Mínimo 1. */
  capacity: number;
}

export type DockAction =
  | { type: "open"; id: string }
  | { type: "close"; id: string }
  | { type: "toggle"; id: string }
  | { type: "toggleBar" }
  | { type: "setCapacity"; capacity: number };

export const DOCK_INITIAL_STATE: DockState = { order: [], minimized: {}, barOpen: false, capacity: 3 };

/**
 * Transición del muelle. Función pura: abrir un id lo pone al frente y lo expande;
 * cerrar lo quita; alternar expande o minimiza un panel abierto (y abre uno cerrado).
 */
export function dockReducer(state: DockState, action: DockAction): DockState {
  switch (action.type) {
    case "open": {
      const order = [action.id, ...state.order.filter((id) => id !== action.id)];
      return { ...state, order, minimized: { ...state.minimized, [action.id]: false } };
    }
    case "close": {
      if (!state.order.includes(action.id)) return state;
      const minimized = { ...state.minimized };
      delete minimized[action.id];
      return { ...state, order: state.order.filter((id) => id !== action.id), minimized };
    }
    case "toggle": {
      if (!state.order.includes(action.id)) return dockReducer(state, { type: "open", id: action.id });
      const actual = state.minimized[action.id] === true;
      return { ...state, minimized: { ...state.minimized, [action.id]: !actual } };
    }
    case "toggleBar":
      return { ...state, barOpen: !state.barOpen };
    case "setCapacity": {
      const capacity = Math.max(1, Math.floor(action.capacity));
      return capacity === state.capacity ? state : { ...state, capacity };
    }
  }
}

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
  /** Fija la capacidad en vez de calcularla desde el ancho de la ventana. */
  maxPanels?: number;
}

/** Estado del muelle: paneles abiertos, minimizados, overflow y barra. */
export function useMessageDock(opciones: UseMessageDockOptions = {}) {
  const { maxPanels } = opciones;
  const [state, dispatch] = useReducer(dockReducer, DOCK_INITIAL_STATE);

  const recalcular = useCallback(() => {
    if (maxPanels !== undefined) {
      dispatch({ type: "setCapacity", capacity: maxPanels });
      return;
    }
    const estilos = getComputedStyle(document.documentElement);
    const anchoPanel = longitudEnPx(estilos.getPropertyValue("--ui-surface-panel-width"), 320);
    const anchoBarra = longitudEnPx(estilos.getPropertyValue("--ui-surface-panel-width-sm"), 288);
    dispatch({
      type: "setCapacity",
      capacity: capacidadPara(window.innerWidth, anchoPanel, anchoBarra, 16),
    });
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
    panels: visibles.map((id) => ({ id, minimized: state.minimized[id] === true })),
    overflow,
    barOpen: state.barOpen,
    open: useCallback((id: string) => dispatch({ type: "open", id }), []),
    close: useCallback((id: string) => dispatch({ type: "close", id }), []),
    toggle: useCallback((id: string) => dispatch({ type: "toggle", id }), []),
    toggleBar: useCallback(() => dispatch({ type: "toggleBar" }), []),
  };
}
