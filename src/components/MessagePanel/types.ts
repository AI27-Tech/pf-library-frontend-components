/** Audiencia de dominio del autor (contrato `Audiencia`, DEC-054). */
export type AudienciaAutor = "Cliente" | "Interno";

/** Estado del ciclo de vida de la conversación (contrato `EstadoConversacion`). */
export type EstadoConversacion = "abierta" | "solo_lectura" | "cerrada";

/** Estado de entrega de un mensaje enviado desde este visor (optimista). */
export type DeliveryStatus = "sending" | "sent" | "failed";

/**
 * Mensaje tal como lo entrega el contrato `Mensaje` (v0.1.0-tracer.40, `contracts/openapi/mensajeria.yaml`).
 * La librería no importa `@ai27-tech/contracts`: el consumidor convierte el JSON a este tipo.
 */
export interface Mensaje {
  id: string;
  conversacionId: string;
  /** Orden del mensaje dentro de la conversación. Entero, no fecha. Campo `secuencia` del contrato. */
  secuencia: number;
  clientMessageId: string;
  audienciaAutor: AudienciaAutor;
  /** Identidad presentada. Para el cliente es el comercial de AI27. */
  aliasMostrado: string;
  cuerpo: string;
  adjuntosIds?: string[];
  /** Marca de tiempo ISO 8601. */
  creadoEn: string;
  /** Solo audiencia Interno. La librería no lo muestra salvo en `renderAudit`. */
  actorReal?: string | null;
  /** Solo audiencia Interno. Se usa `string` hasta resolver la brecha del enum `Rol` (D18). */
  rolAlEnviar?: string | null;
}

/** Entrada de envío (contrato `EnviarMensajeEntrada`, parte que controla el compositor). */
export interface EnviarMensajeEntrada {
  clientMessageId: string;
  cuerpo: string;
  adjuntosIds?: string[];
}

/** Envío optimista: un mensaje que aún no tiene `secuencia`. */
export interface MensajePendiente {
  clientMessageId: string;
  cuerpo: string;
  creadoEn: string;
  deliveryStatus: DeliveryStatus;
  deliveryError?: string;
  onRetry?: () => void;
}

/** Estado visual de un adjunto. */
export type AdjuntoEstado = "ready" | "uploading" | "error";
