/** Audiencia de dominio del autor (contrato `Audiencia`, DEC-054). */
export type AudienciaAutor = "Cliente" | "Interno";

/** Estado del ciclo de vida de la conversación (contrato `EstadoConversacion`). */
export type EstadoConversacion = "abierta" | "solo_lectura" | "cerrada";

/**
 * Mensaje tal como lo entrega el contrato `Mensaje` (v0.1.0-tracer.9).
 * La librería no importa `@ai27-tech/contracts`: el consumidor convierte el JSON a este tipo.
 */
export interface Mensaje {
  id: string;
  conversacionId: string;
  /** Orden del mensaje dentro de la conversación. Entero, no fecha. */
  secuenciaMensaje: number;
  clientMessageId: string;
  audienciaAutor: AudienciaAutor;
  /** Identidad presentada. Para el cliente es el comercial de AI27. */
  aliasMostrado: string;
  cuerpo: string;
  adjuntosIds?: string[];
  /** Marca de tiempo ISO 8601. */
  creadoEn: string;
  /** Solo audiencia Interno. La librería no lo muestra salvo en `slotAuditoria`. */
  actorReal?: string | null;
  /** Solo audiencia Interno. Se usa `string` hasta resolver la brecha del enum `Rol`. */
  rolAlEnviar?: string | null;
}

/** Entrada de envío (contrato `EnviarMensajeEntrada`). */
export interface EnviarMensajeEntrada {
  clientMessageId: string;
  cuerpo: string;
  adjuntosIds?: string[];
}
