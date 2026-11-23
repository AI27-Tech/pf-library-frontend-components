/**
 * Estado y transiciones del muelle de mensajería. Funciones puras: no leen el DOM
 * ni el ancho de la ventana. El hook `useMessageDock` decide los límites y los aplica.
 */

/** Un panel del muelle, visible en una ranura. */
export interface DockPanelState {
  id: string;
  /** `true` si el panel está minimizado (solo muestra el encabezado). */
  minimized: boolean;
}

export interface DockState {
  /** Ids de las conversaciones del muelle, la más reciente primero. Incluye las que están en overflow. */
  order: string[];
  /** Paneles minimizados. Ausente o `false` significa expandido. */
  minimized: Record<string, boolean>;
  /** Si la lista de conversaciones de la barra está expandida. */
  barOpen: boolean;
  /** Cuántas ranuras de panel caben en pantalla. Mínimo 1. Lo que sobra va a overflow. */
  capacity: number;
  /** Cuántos paneles pueden estar expandidos a la vez. Mínimo 1. Al exceder, se minimiza el más antiguo. */
  maxOpen: number;
}

export type DockAction =
  | { type: "open"; id: string }
  | { type: "close"; id: string }
  | { type: "toggle"; id: string }
  | { type: "toggleBar" }
  | { type: "setLimits"; capacity: number; maxOpen: number };

export const DOCK_INITIAL_STATE: DockState = {
  order: [],
  minimized: {},
  barOpen: false,
  capacity: 3,
  maxOpen: 3,
};

/**
 * Minimiza los paneles expandidos más antiguos hasta que queden `maxOpen` expandidos.
 * `protegido` nunca se minimiza (es el panel que el usuario acaba de abrir).
 * `order` va del más reciente al más antiguo, así que se recorre desde el final.
 */
function minimizarExceso(
  order: string[],
  minimized: Record<string, boolean>,
  maxOpen: number,
  protegido?: string,
): Record<string, boolean> {
  const resultado = { ...minimized };
  let abiertos = order.filter((id) => resultado[id] !== true).length;
  for (let i = order.length - 1; i >= 0 && abiertos > maxOpen; i--) {
    const id = order[i];
    if (id === protegido || resultado[id] === true) continue;
    resultado[id] = true;
    abiertos--;
  }
  return resultado;
}

/**
 * Transición del muelle.
 * - `open`: pone el panel al frente y lo expande. Si ya hay `maxOpen` expandidos, minimiza
 *   el más antiguo. Un panel minimizado conserva su borrador: aquí solo cambia su estado visual.
 * - `toggle`: minimiza un panel expandido; en cualquier otro caso lo abre (así un panel en
 *   overflow vuelve a una ranura visible).
 */
export function dockReducer(state: DockState, action: DockAction): DockState {
  switch (action.type) {
    case "open": {
      const order = [action.id, ...state.order.filter((id) => id !== action.id)];
      const minimized = minimizarExceso(
        order,
        { ...state.minimized, [action.id]: false },
        state.maxOpen,
        action.id,
      );
      return { ...state, order, minimized };
    }
    case "close": {
      if (!state.order.includes(action.id)) return state;
      const minimized = { ...state.minimized };
      delete minimized[action.id];
      return { ...state, order: state.order.filter((id) => id !== action.id), minimized };
    }
    case "toggle": {
      const expandido = state.order.includes(action.id) && state.minimized[action.id] !== true;
      if (expandido) {
        return { ...state, minimized: { ...state.minimized, [action.id]: true } };
      }
      return dockReducer(state, { type: "open", id: action.id });
    }
    case "toggleBar":
      return { ...state, barOpen: !state.barOpen };
    case "setLimits": {
      const capacity = Math.max(1, Math.floor(action.capacity));
      const maxOpen = Math.max(1, Math.floor(action.maxOpen));
      if (capacity === state.capacity && maxOpen === state.maxOpen) return state;
      const minimized = minimizarExceso(state.order, state.minimized, maxOpen);
      return { ...state, capacity, maxOpen, minimized };
    }
  }
}
