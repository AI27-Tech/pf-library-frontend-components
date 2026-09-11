import { useRef, type KeyboardEvent, type ReactNode } from "react";
import styles from "./MessagePanel.module.css";
import { SendIcon } from "./shared";

export interface MessageComposerProps {
  /** Current draft text (controlled). */
  value: string;
  /** Called on every change. */
  onChange: (value: string) => void;
  /** Called when the user sends (Enter or send button). */
  onSend: () => void;
  /** Placeholder text. */
  placeholder?: string;
  /** Disable input and sending. */
  disabled?: boolean;
  /** Custom trailing send control (defaults to a send icon button). */
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
    // Reset height after clearing.
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
        aria-label="Message"
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
        aria-label="Send message"
      >
        <SendIcon />
      </button>
    </div>
  );
}
