import type { ReactNode } from "react";
import styles from "./MessagePanel.module.css";
import {
  Avatar,
  IconButton,
  MinimizeIcon,
  ExpandIcon,
  CloseIcon,
} from "./shared";
import { cx, type Presence } from "./utils";

export interface MessagePanelProps {
  /** Name of the conversation peer / group. */
  name: ReactNode;
  /** Secondary line under the name (e.g. "Active now"). */
  subtitle?: ReactNode;
  /** Peer avatar. */
  avatar?: { src?: string; name?: string };
  /** Presence dot on the avatar. */
  presence?: Presence;
  /** Whether the panel is expanded. When false it collapses to the header bar. */
  open?: boolean;
  /** Called when the header is clicked (toggle minimize/expand). */
  onToggle?: () => void;
  /** Called when the close button is clicked. Omit to hide the button. */
  onClose?: () => void;
  /** Message list content (MessageList with MessageBubble children). */
  children?: ReactNode;
  /** Composer rendered at the bottom (usually a MessageComposer). */
  composer?: ReactNode;
  className?: string;
}

export function MessagePanel({
  name,
  subtitle,
  avatar,
  presence,
  open = true,
  onToggle,
  onClose,
  children,
  composer,
  className,
}: MessagePanelProps) {
  return (
    <section className={cx(styles.surface, className)} aria-label={typeof name === "string" ? name : "Conversation"}>
      <button
        type="button"
        className={cx(styles.header, open && styles.expanded)}
        onClick={onToggle}
        aria-expanded={open}
      >
        {avatar && <Avatar src={avatar.src} name={avatar.name} presence={presence} />}
        <span className={styles.headerTitle}>
          <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            <span className={styles.name}>{name}</span>
            {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
          </span>
        </span>
        <span className={styles.headerActions}>
          <IconButton label={open ? "Minimize" : "Expand"} onClick={onToggle}>
            {open ? <MinimizeIcon /> : <ExpandIcon />}
          </IconButton>
          {onClose && (
            <IconButton label="Close conversation" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
        </span>
      </button>

      {open && (
        <>
          {children}
          {composer}
        </>
      )}
    </section>
  );
}
