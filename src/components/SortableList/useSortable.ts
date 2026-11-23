import {
  useCallback,
  useId,
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { SortableFieldListLabels } from "./labels";
import { indexFromMidpoints, moveItem } from "./sortableUtils";

/** Lo mÃ­nimo que necesita el hook de un elemento reordenable. */
export interface SortableDragItem {
  id: string;
  disabled?: boolean;
}

export interface SortableChange {
  /** Id del elemento movido. */
  id: string;
  /** PosiciÃ³n de origen (desde 0). */
  from: number;
  /** PosiciÃ³n final (desde 0). */
  to: number;
}

type DragMode = "pointer" | "keyboard";

interface DragState {
  id: string;
  from: number;
  to: number;
  mode: DragMode;
}

interface PointerSession {
  pointerId: number;
  startY: number;
  startCenter: number;
  midpoints: number[];
  element: HTMLElement;
}

export interface SortableHandleProps {
  ref: (node: HTMLButtonElement | null) => void;
  "aria-label": string;
  "aria-describedby": string;
  "aria-pressed": boolean | undefined;
  disabled: boolean;
  onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onPointerCancel: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<HTMLButtonElement>) => void;
  onBlur: () => void;
}

export interface UseSortableOptions<T extends SortableDragItem> {
  items: T[];
  onReorder: (items: T[], change: SortableChange) => void;
  disabled: boolean;
  /** Nombre en texto plano de un elemento, para los anuncios y las etiquetas. */
  nameOf: (item: T, index: number) => string;
  /** Textos ya combinados con los valores por defecto. */
  text: SortableFieldListLabels;
}

/**
 * Estado y eventos del reordenamiento por arrastre (puntero o teclado).
 * Lo usan las listas reordenables. El hook no pinta nada: el componente
 * recibe las props del asa, la posiciÃ³n de la lÃ­nea de destino y el anuncio.
 */
export function useSortable<T extends SortableDragItem>({
  items,
  onReorder,
  disabled,
  nameOf,
  text,
}: UseSortableOptions<T>) {
  const instructionsId = useId();
  const [drag, setDrag] = useState<DragState | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const dragRef = useRef<DragState | null>(null);
  const sessionRef = useRef<PointerSession | null>(null);
  const rowRefs = useRef(new Map<string, HTMLElement>());
  const handleRefs = useRef(new Map<string, HTMLButtonElement>());
  const pendingFocus = useRef<string | null>(null);

  const total = items.length;

  function updateDrag(next: DragState | null) {
    dragRef.current = next;
    setDrag(next);
  }

  function finish(commit: boolean, announce: boolean) {
    const current = dragRef.current;
    const session = sessionRef.current;
    if (session) {
      session.element.style.transform = "";
      sessionRef.current = null;
    }
    if (!current) return;
    updateDrag(null);
    const item = items[current.from];
    const name = item ? nameOf(item, current.from) : "";
    if (commit && current.to !== current.from) {
      pendingFocus.current = current.id;
      onReorder(moveItem(items, current.from, current.to), {
        id: current.id,
        from: current.from,
        to: current.to,
      });
      if (announce) setAnnouncement(text.dropped(name, current.to + 1, total));
    } else if (commit) {
      if (announce) setAnnouncement(text.dropped(name, current.from + 1, total));
    } else if (announce) {
      setAnnouncement(text.cancelled(name));
    }
  }

  // Tras reordenar, el asa conserva el foco aunque React haya movido el nodo.
  useLayoutEffect(() => {
    const id = pendingFocus.current;
    if (!id) return;
    pendingFocus.current = null;
    handleRefs.current.get(id)?.focus();
  }, [items]);

  // Si el elemento arrastrado desaparece a media interacciÃ³n, se cancela.
  useEffect(() => {
    const current = dragRef.current;
    if (current && items[current.from]?.id !== current.id) finish(false, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  function onPointerDown(event: ReactPointerEvent<HTMLButtonElement>, index: number) {
    if (disabled || event.button !== 0 || dragRef.current) return;
    const item = items[index];
    const element = rowRefs.current.get(item.id);
    if (!element) return;
    const midpoints = items.map((entry) => {
      const rect = rowRefs.current.get(entry.id)?.getBoundingClientRect();
      return rect ? rect.top + rect.height / 2 : 0;
    });
    event.currentTarget.setPointerCapture(event.pointerId);
    sessionRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startCenter: midpoints[index],
      midpoints,
      element,
    };
    updateDrag({ id: item.id, from: index, to: index, mode: "pointer" });
  }

  function onPointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    const session = sessionRef.current;
    const current = dragRef.current;
    if (!session || !current || event.pointerId !== session.pointerId) return;
    const dy = event.clientY - session.startY;
    session.element.style.transform = `translateY(${dy}px)`;
    const to = indexFromMidpoints(session.midpoints, session.startCenter + dy);
    if (to !== current.to) updateDrag({ ...current, to });
  }

  function onPointerEnd(event: ReactPointerEvent<HTMLButtonElement>, commit: boolean) {
    const session = sessionRef.current;
    if (!session || event.pointerId !== session.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    finish(commit, false);
  }

  function onKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    if (disabled) return;
    const current = dragRef.current;
    if (current?.mode === "pointer") return;
    const item = items[index];
    const name = nameOf(item, index);

    if (!current) {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        updateDrag({ id: item.id, from: index, to: index, mode: "keyboard" });
        setAnnouncement(text.lifted(name, index + 1, total));
      }
      return;
    }

    const move = (to: number) => {
      event.preventDefault();
      const clamped = Math.min(Math.max(to, 0), total - 1);
      if (clamped === current.to) return;
      updateDrag({ ...current, to: clamped });
      setAnnouncement(text.moved(name, clamped + 1, total));
    };

    switch (event.key) {
      case " ":
      case "Enter":
        event.preventDefault();
        finish(true, true);
        break;
      case "Escape":
        event.preventDefault();
        finish(false, true);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        move(current.to - 1);
        break;
      case "ArrowDown":
      case "ArrowRight":
        move(current.to + 1);
        break;
      case "Home":
        move(0);
        break;
      case "End":
        move(total - 1);
        break;
      default:
        break;
    }
  }

  const rowRef = useCallback(
    (id: string) => (node: HTMLElement | null) => {
      if (node) rowRefs.current.set(id, node);
      else rowRefs.current.delete(id);
    },
    [],
  );

  /** Props del asa de una fila. */
  function handleProps(item: T, index: number): SortableHandleProps {
    return {
      ref: (node) => {
        if (node) handleRefs.current.set(item.id, node);
        else handleRefs.current.delete(item.id);
      },
      "aria-label": text.handle(nameOf(item, index)),
      "aria-describedby": instructionsId,
      "aria-pressed": drag?.id === item.id && drag.mode === "keyboard" ? true : undefined,
      disabled: disabled || Boolean(item.disabled),
      onPointerDown: (event) => onPointerDown(event, index),
      onPointerMove,
      onPointerUp: (event) => onPointerEnd(event, true),
      onPointerCancel: (event) => onPointerEnd(event, false),
      onKeyDown: (event) => onKeyDown(event, index),
      onBlur: () => {
        if (dragRef.current?.mode === "keyboard") finish(false, false);
      },
    };
  }

  /** PosiciÃ³n de la lÃ­nea de destino para la fila `index`, si es la fila donde caerÃ¡ el elemento. */
  function dropPosition(index: number): "before" | "after" | undefined {
    if (!drag || drag.to === drag.from || drag.to !== index) return undefined;
    return drag.to > drag.from ? "after" : "before";
  }

  return {
    drag,
    announcement,
    instructionsId,
    instructions: text.instructions,
    rowRef,
    handleProps,
    dropPosition,
    isDragging: (id: string) => drag?.id === id,
  };
}
