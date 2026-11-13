import { FileText, Image, Paperclip } from "lucide-react";
import { Spinner } from "../Spinner";
import styles from "./MessagePanel.module.css";
import type { AdjuntoEstado } from "./types";
import { cx, formatearTamano } from "./utils";

export interface MessageAttachmentProps {
  /** Nombre del archivo. Se trunca con puntos suspensivos si es largo. */
  nombre: string;
  /** Tamaño en bytes. Se muestra en KB o MB. */
  tamano?: number;
  /** Tipo MIME (`image/png`, `application/pdf`...). Elige el icono. */
  tipoMedio?: string;
  /** `ready` (por defecto), `uploading` o `error`. */
  estado?: AdjuntoEstado;
  /** Abrir o descargar. Solo se muestra como botón cuando el estado es `ready`. */
  onOpen?: () => void;
  /** Texto del estado de subida y de error, en español por defecto. */
  labels?: { uploading?: string; error?: string };
}

function iconoPara(tipoMedio?: string) {
  if (tipoMedio?.startsWith("image/")) return <Image aria-hidden="true" />;
  if (tipoMedio === "application/pdf") return <FileText aria-hidden="true" />;
  return <Paperclip aria-hidden="true" />;
}

/** Chip de adjunto. La librería no descarga ni sube bytes: el consumidor controla el estado. */
export function MessageAttachment({
  nombre,
  tamano,
  tipoMedio,
  estado = "ready",
  onOpen,
  labels,
}: MessageAttachmentProps) {
  const contenido = (
    <>
      {estado === "uploading" ? <Spinner size="sm" label={labels?.uploading ?? "Subiendo"} /> : iconoPara(tipoMedio)}
      <span className={styles.attachmentText}>
        <span className={styles.attachmentName}>{nombre}</span>
        <span className={styles.attachmentMeta}>
          {estado === "error"
            ? (labels?.error ?? "Error al subir")
            : estado === "uploading"
              ? (labels?.uploading ?? "Subiendo…")
              : tamano !== undefined
                ? formatearTamano(tamano)
                : ""}
        </span>
      </span>
    </>
  );

  if (estado === "ready" && onOpen) {
    return (
      <button type="button" className={styles.attachment} onClick={onOpen} aria-label={`Abrir ${nombre}`}>
        {contenido}
      </button>
    );
  }

  return (
    <span className={cx(styles.attachment, estado === "error" && styles.attachmentError)}>{contenido}</span>
  );
}
