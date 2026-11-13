import { useId, useState, type HTMLAttributes, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cx } from "../../utils/cx";
import styles from "./Section.module.css";

export interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Título de la sección. Enlaza la región con `aria-labelledby`. */
  title?: ReactNode;
  /** Texto breve bajo el título. */
  description?: ReactNode;
  /** Acciones a la derecha del encabezado. */
  actions?: ReactNode;
  /** Muestra una línea divisoria bajo el encabezado. */
  divider?: boolean;
  /** Permite plegar el contenido desde el encabezado. */
  collapsible?: boolean;
  /** Estado de plegado controlado. Con `true`, el contenido está oculto. */
  collapsed?: boolean;
  /** Estado inicial de plegado sin control externo. Por defecto: `false`. */
  defaultCollapsed?: boolean;
  /** Se llama al plegar o desplegar. */
  onCollapsedChange?: (collapsed: boolean) => void;
}

/**
 * Sección con título. Con `collapsible`, el encabezado es un botón con `aria-expanded`.
 * Admite modo controlado (`collapsed`) y no controlado (`defaultCollapsed`).
 */
export function Section({
  title,
  description,
  actions,
  divider = false,
  collapsible = false,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  className,
  children,
  ...props
}: SectionProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const contentId = `${id}-content`;

  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isControlled = collapsed !== undefined;
  const isCollapsed = isControlled ? collapsed : internalCollapsed;

  function toggle() {
    const next = !isCollapsed;
    if (!isControlled) setInternalCollapsed(next);
    onCollapsedChange?.(next);
  }

  const titleContent = (
    <>
      {title && <span id={titleId} className={styles.title}>{title}</span>}
      {description && <span className={styles.description}>{description}</span>}
    </>
  );

  const hasHeader = title || description || actions || collapsible;

  return (
    <section
      aria-labelledby={title ? titleId : undefined}
      className={cx(styles.section, divider && styles.divided, className)}
      {...props}
    >
      {hasHeader && (
        <div className={styles.header}>
          {collapsible ? (
            <h2 className={styles.heading}>
              <button
                type="button"
                className={styles.toggle}
                aria-expanded={!isCollapsed}
                aria-controls={contentId}
                onClick={toggle}
              >
                {titleContent}
                <ChevronDown
                  aria-hidden="true"
                  className={cx(styles.chevron, isCollapsed && styles.chevronCollapsed)}
                />
              </button>
            </h2>
          ) : (
            <div className={styles.titleGroup}>{titleContent}</div>
          )}
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      )}

      <div id={contentId} className={styles.content} hidden={collapsible && isCollapsed}>
        {children}
      </div>
    </section>
  );
}
