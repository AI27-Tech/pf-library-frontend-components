import type { Mensaje } from "./types";
import { claveDiaLocal } from "./utils";

/** Posición de una burbuja dentro de su grupo de autor. Define radios, alias y hora. */
export type GroupPosition = "single" | "first" | "middle" | "last";

export interface GroupedMessage {
  mensaje: Mensaje;
  groupPosition: GroupPosition;
}

export interface MessageDayGroup {
  /** Día local `YYYY-MM-DD`. Vacío si la fecha del primer mensaje no es válida. */
  dia: string;
  items: GroupedMessage[];
}

/** Ventana máxima entre dos mensajes del mismo autor para seguir agrupados. */
export const VENTANA_AGRUPACION_MS = 5 * 60 * 1000;

function mismoAutor(a: Mensaje, b: Mensaje): boolean {
  if (a.audienciaAutor !== b.audienciaAutor) return false;
  return (a.actorReal ?? a.aliasMostrado) === (b.actorReal ?? b.aliasMostrado);
}

/**
 * Dos mensajes consecutivos forman parte del mismo grupo cuando son del mismo día local,
 * del mismo autor y con menos de 5 minutos de diferencia. Una fecha inválida corta el grupo.
 */
function continuaGrupo(anterior: Mensaje, siguiente: Mensaje): boolean {
  const t1 = Date.parse(anterior.creadoEn);
  const t2 = Date.parse(siguiente.creadoEn);
  if (Number.isNaN(t1) || Number.isNaN(t2)) return false;
  if (claveDiaLocal(anterior.creadoEn) !== claveDiaLocal(siguiente.creadoEn)) return false;
  return mismoAutor(anterior, siguiente) && Math.abs(t2 - t1) < VENTANA_AGRUPACION_MS;
}

/**
 * Agrupa mensajes ya ordenados por `secuencia` en días y en grupos de autor.
 * Función pura: no lee el DOM ni la hora actual.
 */
export function groupMessages(mensajes: Mensaje[]): MessageDayGroup[] {
  const grupos: MessageDayGroup[] = [];

  mensajes.forEach((mensaje, i) => {
    const anterior = mensajes[i - 1];
    const siguiente = mensajes[i + 1];
    const conAnterior = anterior !== undefined && continuaGrupo(anterior, mensaje);
    const conSiguiente = siguiente !== undefined && continuaGrupo(mensaje, siguiente);

    let groupPosition: GroupPosition = "single";
    if (conAnterior && conSiguiente) groupPosition = "middle";
    else if (conAnterior) groupPosition = "last";
    else if (conSiguiente) groupPosition = "first";

    const dia = claveDiaLocal(mensaje.creadoEn);
    const grupoActual = grupos[grupos.length - 1];
    const item: GroupedMessage = { mensaje, groupPosition };
    if (grupoActual && grupoActual.dia === dia && dia !== "") {
      grupoActual.items.push(item);
    } else {
      grupos.push({ dia, items: [item] });
    }
  });

  return grupos;
}
