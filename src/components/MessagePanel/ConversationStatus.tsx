import { Check } from "lucide-react";
import { Badge, type BadgeVariant } from "../Badge";
import styles from "./MessagePanel.module.css";
import { STATUS_LABELS, resolverLabels, type StatusLabels } from "./labels";
import { formatFechaHora } from "./utils";
import type { EstadoConversacion } from "./types";

export interface ConversationStatusProps {
  /** Estado del ciclo de vida de la conversación. */
  estado: EstadoConversacion;
  /** Hasta cuándo se puede escribir (ISO 8601). Se muestra solo si viene. */
  escrituraHasta?: string | null;
  /** Si el responsable marcó la conversación como atendida. */
  atendida?: boolean;
  /**
   * Nombre de quien tiene el reclamo activo. `null` significa que está en el pool.
   * `undefined` oculta la línea de responsable (vista del cliente, sin datos de reclamo).
   */
  reclamadaPor?: string | null;
  /** Si el reclamo activo es del visor actual. Tiene prioridad sobre `reclamadaPor`. */
  reclamoPropio?: boolean;
  /** Textos de la interfaz en español. */
  labels?: Partial<StatusLabels>;
}

const TONO_ESTADO: Record<EstadoConversacion, BadgeVariant> = {
  abierta: "secure",
  solo_lectura: "warning",
  cerrada: "neutral",
};

/** Fila compacta con el estado de la conversación, el responsable y la ventana de escritura. No decide permisos. */
export function ConversationStatus({
  estado,
  escrituraHasta,
  atendida = false,
  reclamadaPor,
  reclamoPropio = false,
  labels: labelsPersonalizadas,
}: ConversationStatusProps) {
  const labels = resolverLabels(STATUS_LABELS, labelsPersonalizadas);

  let responsable: string | null = null;
  if (reclamoPropio) responsable = labels.reclamadaPorTi;
  else if (typeof reclamadaPor === "string" && reclamadaPor !== "") responsable = labels.reclamadaPor(reclamadaPor);
  else if (reclamadaPor === null) responsable = labels.enElPool;

  const fechaEscritura = escrituraHasta ? formatFechaHora(escrituraHasta) : "";

  return (
    <div className={styles.status}>
      <Badge variant={TONO_ESTADO[estado]} pill>
        {labels[estado]}
      </Badge>
      {responsable && <span className={styles.statusText}>{responsable}</span>}
      {atendida && (
        <span className={styles.statusText}>
          <Check aria-hidden="true" />
          {labels.atendida}
        </span>
      )}
      {fechaEscritura && <span className={styles.statusText}>{labels.escribeHasta(fechaEscritura)}</span>}
    </div>
  );
}
