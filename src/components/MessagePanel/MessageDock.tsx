import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "./MessagePanel.module.css";
import {
  Avatar,
  IconButton,
  MinimizeIcon,
  ExpandIcon,
} from "./shared";
import { cx } from "./utils";
import { Badge } from "../Badge";

export interface MessageDockProps {
  /** The main "Messaging" bar (usually a MessageDockBar). */
  bar?: ReactNode;
  /** Open conversation panels (MessagePanel elements). */
  children?: ReactNode;
  className?: string;
}

/**
 * Fixed, portal-rendered row anchored bottom-right that holds the main
 * messaging bar plus any open conversation panels, LinkedIn-style.
 */
export function MessageDock({ bar, children, className }: MessageDockProps) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className={cx(styles.dock, className)} aria-label="Messaging" role="region">
      <div className={styles.panels}>{children}</div>
      {bar && <div className={styles.bar}>{bar}</div>}
    </div>,
    document.body,
  );
}

export interface DockConversation {
  id: string;
  name: string;
  preview?: string;
  avatar?: { src?: string; name?: string };
  unread?: boolean;
}

export interface MessageDockBarProps {
  /** Bar title. Default: "Messaging". */
  title?: ReactNode;
  /** Whether the conversation list is expanded. */
  open?: boolean;
  /** Toggle the list open/closed. */
  onToggle?: () => void;
  /** Number of unread conversations, shown as a badge. */
  unreadCount?: number;
  /** Conversations shown when expanded. */
  conversations?: DockConversation[];
  /** Called when a conversation is selected from the list. */
  onSelect?: (id: string) => void;
  /** Custom content instead of the built-in conversation list. */
  children?: ReactNode;
}

export function MessageDockBar({
  title = "Messaging",
  open = false,
  onToggle,
  unreadCount,
  conversations,
  onSelect,
  children,
}: MessageDockBarProps) {
  return (
    <section className={cx(styles.surface, styles.barSurface)} aria-label="Messaging">
      <button
        type="button"
        className={cx(styles.header, open && styles.expanded)}
        onClick={onToggle}
        aria-expanded={open}
      >
        <span className={styles.headerTitle}>
          <span className={styles.name}>{title}</span>
          {unreadCount != null && unreadCount > 0 && (
            <Badge variant="escort" pill>
              {unreadCount}
            </Badge>
          )}
        </span>
        <span className={styles.headerActions}>
          <IconButton label={open ? "Minimize" : "Expand"} onClick={onToggle}>
            {open ? <MinimizeIcon /> : <ExpandIcon />}
          </IconButton>
        </span>
      </button>

      {open && (
        <div className={styles.convoList}>
          {children ??
            conversations?.map((c) => (
              <button
                key={c.id}
                type="button"
                className={styles.convoItem}
                onClick={() => onSelect?.(c.id)}
              >
                <Avatar src={c.avatar?.src} name={c.avatar?.name ?? c.name} />
                <span className={styles.convoText}>
                  <span className={styles.convoName}>{c.name}</span>
                  {c.preview && <span className={styles.convoPreview}>{c.preview}</span>}
                </span>
                {c.unread && <span className={styles.unread} aria-label="Unread" />}
              </button>
            ))}
        </div>
      )}
    </section>
  );
}
