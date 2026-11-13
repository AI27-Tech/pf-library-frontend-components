import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronUp, Minus, X } from "lucide-react";
import styles from "./MessagePanel.module.css";
import { Avatar, IconButton } from "./shared";
import { PANEL_LABELS, resolverLabels, type PanelLabels } from "./labels";
import { cx, type Presence } from "./utils";

export interface MessagePanelProps {
  /** Nombre del compañero de conversación. */
  name: ReactNode;
  /** Línea secundaria bajo el nombre (por ejemplo "Viaje 1042"). */
  subtitle?: ReactNode;
  /** Avatar del compañero. */
  avatar?: { src?: string; name?: string };
  /** Punto de presencia en el avatar. */
  presence?: Presence;
  /** Expandido o minimizado. Si se pasa, el panel es controlado. */
  open?: boolean;
  /** Estado inicial cuando el panel no es controlado. Por defecto: true. */
  defaultOpen?: boolean;
  /** Llamado con el nuevo estado cada vez que el usuario minimiza o expande. */
  onOpenChange?: (abierto: boolean) => void;
  /** Llamado al alternar, además de `onOpenChange`. Se conserva por compatibilidad. */
  onToggle?: () => void;
  /** Llamado al pulsar cerrar. Omitir para ocultar el botón. */
  onClose?: () => void;
  /** Barra de acciones sobre la conversación, debajo del encabezado. */
  toolbar?: ReactNode;
  /** Aviso de estado (por ejemplo un reclamo rechazado), debajo de `toolbar`. */
  notice?: ReactNode;
  /** Lista de mensajes (`MessageList` o `MessageThread`). */
  children?: ReactNode;
  /** Compositor, en la parte inferior del cuerpo. */
  composer?: ReactNode;
  /**
   * Si `true` (por defecto), el contenido sigue montado al minimizar.
   * Con `false` se desmonta y se vuelve a montar al expandir.
   */
  keepMounted?: boolean;
  /** Textos de la interfaz. Lo que no se pase conserva el valor en español. */
  labels?: Partial<PanelLabels>;
  className?: string;
}

export function MessagePanel({
  name,
  subtitle,
  avatar,
  presence,
  open,
  defaultOpen = true,
  onOpenChange,
  onToggle,
  onClose,
  toolbar,
  notice,
  children,
  composer,
  keepMounted = true,
  labels: labelsPersonalizadas,
  className,
}: MessagePanelProps) {
  const labels = resolverLabels(PANEL_LABELS, labelsPersonalizadas);
  const [internoAbierto, setInternoAbierto] = useState(defaultOpen);
  const estaAbierto = open ?? internoAbierto;

  const titleId = useId();
  const bodyId = useId();
  const headerMainRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  // Solo el clic del usuario mueve el foco; un cambio externo de `open` no lo mueve.
  const alternadoPorUsuario = useRef(false);

  const alternar = () => {
    const siguiente = !estaAbierto;
    alternadoPorUsuario.current = true;
    if (open === undefined) setInternoAbierto(siguiente);
    onOpenChange?.(siguiente);
    onToggle?.();
  };

  useEffect(() => {
    if (!alternadoPorUsuario.current) return;
    alternadoPorUsuario.current = false;
    if (estaAbierto) {
      // Al expandir por acción del usuario, el foco va al primer campo de texto habilitado.
      const campo = bodyRef.current?.querySelector<HTMLTextAreaElement>("textarea:not(:disabled)");
      campo?.focus();
    } else if (bodyRef.current?.contains(document.activeElement)) {
      // Al minimizar con el foco dentro del cuerpo, el foco vuelve al encabezado.
      headerMainRef.current?.focus();
    }
  }, [estaAbierto]);

  return (
    <section className={cx(styles.surface, className)} aria-labelledby={titleId}>
      <div className={cx(styles.header, estaAbierto && styles.expanded)}>
        <button
          ref={headerMainRef}
          type="button"
          className={styles.headerMain}
          aria-expanded={estaAbierto}
          aria-controls={bodyId}
          onClick={alternar}
        >
          {avatar && <Avatar src={avatar.src} name={avatar.name} presence={presence} />}
          <span className={styles.headerText}>
            <span id={titleId} className={styles.name}>
              {name}
            </span>
            {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
          </span>
        </button>
        <span className={styles.headerActions}>
          <IconButton label={estaAbierto ? labels.minimize : labels.expand} onClick={alternar}>
            {estaAbierto ? <Minus /> : <ChevronUp />}
          </IconButton>
          {onClose && (
            <IconButton label={labels.close} onClick={onClose}>
              <X />
            </IconButton>
          )}
        </span>
      </div>

      <div id={bodyId} className={styles.collapsible} data-open={estaAbierto}>
        <div className={styles.collapsibleInner}>
          {(keepMounted || estaAbierto) && (
            <div ref={bodyRef} className={styles.panelBody}>
              {toolbar && <div className={styles.toolbar}>{toolbar}</div>}
              {notice && <div className={styles.notice}>{notice}</div>}
              {children}
              {composer}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
