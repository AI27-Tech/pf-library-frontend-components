import { useRef, type KeyboardEvent, type ReactNode } from "react";
import styles from "./MessagePanel.module.css";
import { SendIcon } from "./shared";

export interface MessageComposerProps {
  /** Texto actual del borrador (controlado). */
  value: string;
  /** Llamado en cada cambio. */
  onChange: (value: string) => void;
  /** Llamado cuando el usuario envía (Enter o botón de envío). */
  onSend: () => void;
  /** Texto placeholder. */
  placeholder?: string;
  /** Deshabilitar entrada y envío. */
  disabled?: boolean;
  /** Control de envío final personalizado (por defecto un botón de icono de envío). */
  sendButton?: ReactNode;
}

export function MessageComposer({
  value,
  onChange,
  onSend,
  placeholder = "Write a message…",
  disabled = false,
}: MessageComposerProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const canSend = value.trim().length > 0 && !disabled;

  const send = () => {
    if (!canSend) return;
    onSend();
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
        placeholder={placeholder}
        disabled={disabled}
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
