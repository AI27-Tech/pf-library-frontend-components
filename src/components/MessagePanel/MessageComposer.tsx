import { useRef, type KeyboardEvent, type ReactNode } from "react";
import styles from "./MessagePanel.module.css";
import { SendIcon } from "./shared";
import type { EnviarMensajeEntrada, EstadoConversacion } from "./types";
import { generarClientMessageId } from "./utils";

export interface MessageComposerProps {
  /** Texto actual del borrador (controlado). */
  value: string;
  /** Llamado en cada cambio. */
  onChange: (value: string) => void;
  /**
   * Llamado al enviar (Enter o botón). Recibe el cuerpo recortado y un `clientMessageId` nuevo.
   * Para reintentar, el consumidor reenvía el mismo objeto.
   */
  onSend: (envio: EnviarMensajeEntrada) => void;
  /** Texto placeholder. */
  placeholder?: string;
  /** Deshabilitar entrada y envío. */
  disabled?: boolean;
  /** Control de envío final personalizado (por defecto un botón de icono de envío). */
  sendButton?: ReactNode;
  /** Estado de la conversación. Con `solo_lectura` o `cerrada` no se puede escribir ni enviar. */
  estadoConversacion?: EstadoConversacion;
  /** Texto que se muestra cuando la conversación está en solo lectura o cerrada. */
  textoSoloLectura?: string;
}

export function MessageComposer({
  value,
  onChange,
  onSend,
  placeholder = "Write a message…",
  disabled = false,
  estadoConversacion = "abierta",
  textoSoloLectura = "Conversación en solo lectura",
}: MessageComposerProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const soloLectura = estadoConversacion === "solo_lectura" || estadoConversacion === "cerrada";
  const inactivo = disabled || soloLectura;
  const canSend = value.trim().length > 0 && !inactivo;

  const send = () => {
    if (!canSend) return;
    onSend({ clientMessageId: generarClientMessageId(), cuerpo: value.trim() });
    // Reiniciar altura después de limpiar.
    requestAnimationFrame(() => {
      if (ref.current) ref.current.style.height = "auto";
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const autoGrow = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  return (
    <div className={styles.composer}>
      <textarea
        ref={ref}
        className={styles.composerInput}
        value={value}
        rows={1}
        placeholder={soloLectura ? textoSoloLectura : placeholder}
        disabled={inactivo}
        aria-label="Mensaje"
        onChange={(e) => {
          onChange(e.target.value);
          autoGrow(e.target);
        }}
        onKeyDown={handleKeyDown}
      />
      <button
        type="button"
        className={styles.sendBtn}
        onClick={send}
        disabled={!canSend}
        aria-label="Enviar mensaje"
      >
        <SendIcon />
      </button>
    </div>
  );
}
