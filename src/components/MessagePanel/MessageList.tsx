import { useEffect, useRef, type ReactNode } from "react";
import styles from "./MessagePanel.module.css";
import { Avatar } from "./shared";
import { cx } from "./utils";

export interface MessageBubbleProps {
  /** Whether the message was sent by the current user. */
  own?: boolean;
  /** Author name (shown for "other" messages in group chats). */
  author?: string;
  /** Timestamp label, e.g. "10:42". */
  time?: string;
  /** Show an avatar next to the bubble. */
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

/** Centered divider between days ("HOY", "AYER", a date...). */
export function MessageDayDivider({ children }: { children: ReactNode }) {
  return <div className={styles.dayDivider}>{children}</div>;
}

export interface MessageListProps {
  /** Auto-scroll to the bottom when children change. Default: true. */
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
