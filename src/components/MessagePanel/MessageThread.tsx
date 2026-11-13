import { Fragment, useMemo, type ReactNode } from "react";
import { MessageBubble, MessageDayDivider, MessageList, type MessageListProps } from "./MessageList";
import { groupMessages } from "./groupMessages";
import { LIST_LABELS, resolverLabels } from "./labels";
import type { MensajePendiente, Mensaje } from "./types";
import { etiquetaDia } from "./utils";

export interface MessageThreadProps extends Omit<MessageListProps, "children" | "ultimoEsPropio" | "ultimaSecuencia" | "empty"> {
  /** Mensajes confirmados por el servidor. Se ordenan por `secuencia`, nunca por `creadoEn`. */
  mensajes: Mensaje[];
  /** Si el mensaje lo envió el visor actual (por ejemplo, `actorReal` igual al sujeto). */
  isOwn: (mensaje: Mensaje) => boolean;
  /** Envíos optimistas que aún no tienen `secuencia`. Se quitan cuando llega su `clientMessageId`. */
  pendientes?: MensajePendiente[];
  /** Contenido de auditoría por mensaje (actor real, rol). Solo se muestra si se pasa. */
  renderAudit?: (mensaje: Mensaje) => ReactNode;
  /** Adjuntos ya resueltos por mensaje. */
  renderAttachments?: (mensaje: Mensaje) => ReactNode;
  /** Última `secuencia` leída por el visor. Los mensajes posteriores llevan el divisor "Mensajes nuevos". */
  ultimaSecuenciaLeida?: number;
  /** Sin mensajes ni pendientes, en lugar de la lista vacía por defecto. */
  emptyState?: ReactNode;
}

/** Ordena por `secuencia` ascendente y descarta ids repetidos (se queda la primera aparición). */
function ordenarYDeduplicar(mensajes: Mensaje[]): Mensaje[] {
  const vistos = new Set<string>();
  const unicos = mensajes.filter((m) => {
    if (vistos.has(m.id)) return false;
    vistos.add(m.id);
    return true;
  });
  return [...unicos].sort((a, b) => a.secuencia - b.secuencia);
}

/** Lista de mensajes con agrupación, divisores de día, mensajes nuevos y envíos pendientes. */
export function MessageThread({
  mensajes,
  isOwn,
  pendientes = [],
  renderAudit,
  renderAttachments,
  ultimaSecuenciaLeida,
  labels: labelsPersonalizadas,
  loading = false,
  emptyState,
  ...resto
}: MessageThreadProps) {
  const labels = resolverLabels(LIST_LABELS, labelsPersonalizadas);

  const ordenados = useMemo(() => ordenarYDeduplicar(mensajes), [mensajes]);
  const grupos = useMemo(() => groupMessages(ordenados), [ordenados]);

  // Un pendiente se descarta cuando el servidor confirma un mensaje con su mismo clientMessageId.
  const confirmados = new Set(ordenados.map((m) => m.clientMessageId));
  const pendientesVisibles = pendientes.filter((p) => !confirmados.has(p.clientMessageId));

  const ultimo = ordenados[ordenados.length - 1];
  const ultimoEsPropio = pendientesVisibles.length > 0 || (ultimo !== undefined && isOwn(ultimo));
  const ahora = new Date();

  // Solo el primer mensaje posterior a la última secuencia leída lleva el divisor.
  const primerNuevo = ordenados.find(
    (m) => ultimaSecuenciaLeida !== undefined && m.secuencia > ultimaSecuenciaLeida,
  );
  const vacio = ordenados.length === 0 && pendientesVisibles.length === 0;

  return (
    <MessageList
      {...resto}
      labels={labelsPersonalizadas}
      loading={loading}
      empty={!loading && vacio}
      emptyState={emptyState}
      ultimaSecuencia={ultimo?.secuencia}
      ultimoEsPropio={ultimoEsPropio}
    >
      {grupos.map((grupo, indice) => {
        const primero = grupo.items[0]?.mensaje;
        return (
          <Fragment key={grupo.dia || `sin-dia-${indice}`}>
            {primero && (
              <MessageDayDivider>
                {etiquetaDia(new Date(primero.creadoEn), ahora, {
                  today: labels.today,
                  yesterday: labels.yesterday,
                })}
              </MessageDayDivider>
            )}
            {grupo.items.map(({ mensaje, groupPosition }) => {
              const debeMarcarNuevos = mensaje.id === primerNuevo?.id;
              return (
                <Fragment key={mensaje.id}>
                  {debeMarcarNuevos && <MessageDayDivider>{labels.unreadDivider}</MessageDayDivider>}
                  <MessageBubble
                    mensaje={mensaje}
                    own={isOwn(mensaje)}
                    groupPosition={groupPosition}
                    adjuntos={renderAttachments?.(mensaje)}
                    slotAuditoria={renderAudit?.(mensaje)}
                  />
                </Fragment>
              );
            })}
          </Fragment>
        );
      })}
      {pendientesVisibles.map((pendiente) => (
        <MessageBubble
          key={pendiente.clientMessageId}
          own
          creadoEn={pendiente.creadoEn}
          deliveryStatus={pendiente.deliveryStatus}
          deliveryError={pendiente.deliveryError}
          onRetry={pendiente.onRetry}
        >
          {pendiente.cuerpo}
        </MessageBubble>
      ))}
    </MessageList>
  );
}
