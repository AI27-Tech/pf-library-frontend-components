import { useRef, type KeyboardEvent, type ReactNode, type RefObject } from "react";
import { Paperclip, Send } from "lucide-react";
import { Spinner } from "../Spinner";
import styles from "./MessagePanel.module.css";
import { COMPOSER_LABELS, resolverLabels, type ComposerLabels } from "./labels";
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
  /** Hay un envío en curso: bloquea el campo y el botón para evitar doble envío. */
  sending?: boolean;
  /** Abrir el selector de archivos. El botón solo aparece si se pasa. */
  onAttach?: () => void;
  /** Longitud máxima del cuerpo. Desde el 80 % se muestra el contador. */
  maxLength?: number;
  /** Ref del campo de texto, por ejemplo para enfocarlo desde fuera. */
  composerRef?: RefObject<HTMLTextAreaElement | null>;
  /** Enfoca el campo al montar. */
  autoFocus?: boolean;
  /** Control de envío personalizado. Por defecto, un botón con icono de envío. */
  sendButton?: ReactNode;
  /** Estado de la conversación. Con `solo_lectura` o `cerrada` no se puede escribir ni enviar. */
  estadoConversacion?: EstadoConversacion;
  /** Texto que reemplaza al placeholder en solo lectura. Por defecto, `labels.readOnly`. */
  textoSoloLectura?: string;
  /** Textos del compositor en español. */
  labels?: Partial<ComposerLabels>;
}

export function MessageComposer({
  value,
  onChange,
  onSend,
  placeholder,
  disabled = false,
  sending = false,
  onAttach,
  maxLength,
  composerRef,
  autoFocus = false,
  sendButton,
  estadoConversacion = "abierta",
  textoSoloLectura,
  labels: labelsPersonalizadas,
}: MessageComposerProps) {
  const labels = resolverLabels(COMPOSER_LABELS, labelsPersonalizadas);
  const refInterna = useRef<HTMLTextAreaElement>(null);
  const ref = composerRef ?? refInterna;

  const soloLectura = estadoConversacion === "solo_lectura" || estadoConversacion === "cerrada";
  const inactivo = disabled || soloLectura || sending;
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
    // Durante la composición de IME (acentos, japonés, etc.) Enter confirma el texto, no envía.
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const autoGrow = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const mostrarContador = maxLength !== undefined && value.length >= maxLength * 0.8;

  return (
    <div className={styles.composerWrap}>
      <div className={styles.composer}>
        {onAttach && (
          <button
            type="button"
            className={styles.attachBtn}
            onClick={onAttach}
            disabled={inactivo}
            aria-label={labels.attach}
          >
            <Paperclip />
          </button>
        )}
        <textarea
          ref={ref}
          className={styles.composerInput}
          value={value}
          rows={1}
          maxLength={maxLength}
          autoFocus={autoFocus}
          placeholder={soloLectura ? (textoSoloLectura ?? labels.readOnly) : (placeholder ?? labels.placeholder)}
          disabled={inactivo}
          aria-label={labels.message}
          onChange={(e) => {
            onChange(e.target.value);
            autoGrow(e.target);
          }}
          onKeyDown={handleKeyDown}
        />
        {sendButton ?? (
          <button
            type="button"
            className={styles.sendBtn}
            onClick={send}
            disabled={!canSend}
            aria-label={labels.send}
          >
            {sending ? <Spinner size="sm" label={labels.send} /> : <Send />}
          </button>
        )}
      </div>
      {mostrarContador && (
        <span className={styles.counter} aria-live="polite">
          {value.length} / {maxLength}
        </span>
      )}
    </div>
  );
}
