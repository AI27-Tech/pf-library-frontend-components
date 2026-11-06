import { useEffect, useRef, type ReactNode } from "react";
import styles from "./MessagePanel.module.css";
import { Avatar } from "./shared";
import { cx } from "./utils";

export interface MessageBubbleProps {
  /** Si el mensaje fue enviado por el usuario actual. */
  own?: boolean;
  /** Nombre del autor (mostrado para mensajes "otros" en chats grupales). */
  author?: string;
  /** Etiqueta de marca de tiempo, por ejemplo "10:42". */
  time?: string;
  /** Mostrar un avatar al lado de la burbuja. */
  avatar?: { src?: string; name?: string };
  children?: ReactNode;
}

export function MessageBubble({
  own = false,
  author,
  time,
  avatar,
  children,
}: MessageBubbleProps) {
  return (
    <div className={cx(styles.msgRow, own ? styles.own : styles.other)}>
      {avatar && !own && <Avatar src={avatar.src} name={avatar.name} />}
      <div className={styles.bubble}>
        {author && !own && <span className={styles.author}>{author}</span>}
        <span>{children}</span>
        {time && <span className={styles.time}>{time}</span>}
      </div>
    </div>
  );
}

/** Indicador animado de "escribiendo..." */
export function MessageTypingIndicator({
  author,
  avatar,
}: {
  author?: string;
  avatar?: { src?: string; name?: string };
}) {
  return (
    <div className={cx(styles.msgRow, styles.other)}>
      {avatar && <Avatar src={avatar.src} name={avatar.name} />}
      <div className={styles.bubble}>
        {author && <span className={styles.author}>{author}</span>}
        <div className={styles.typingIndicator}>
          <span className={styles.typingDot}></span>
          <span className={styles.typingDot}></span>
          <span className={styles.typingDot}></span>
        </div>
      </div>
    </div>
  );
}

/** Divisor centrado entre días ("HOY", "AYER", una fecha...). */
export function MessageDayDivider({ children }: { children: ReactNode }) {
  return <div className={styles.dayDivider}>{children}</div>;
}

export interface MessageListProps {
  /** Auto-desplazarse al final cuando cambian los elementos hijos. Por defecto: true. */
  autoScroll?: boolean;
  children?: ReactNode;
}

export function MessageList({ autoScroll = true, children }: MessageListProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoScroll) return;
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  });

  return (
    <div className={styles.body} ref={ref}>
      {children}
    </div>
  );
}
