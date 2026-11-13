import {
  createElement,
  useCallback,
  useRef,
  useState,
  type ElementType,
  type HTMLAttributes,
  type MouseEvent,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { ChevronRight, Ellipsis } from "lucide-react";
import { Popover } from "../Popover";
import { cx } from "../../utils/cx";
import styles from "./Breadcrumb.module.css";

export interface BreadcrumbItemData {
  /** Texto o nodo del elemento. Si es cadena, se usa también como `title`. */
  label: ReactNode;
  /** Destino del enlace. Sin `href`, `onClick` ni `as` el elemento no es interactivo. */
  href?: string;
  /** Icono antes de la etiqueta. */
  icon?: ReactNode;
  /** Acción al hacer clic (por ejemplo, navegar con estado interno). */
  onClick?: MouseEventHandler;
  /** Componente a renderizar, por ejemplo el `Link` del router. */
  as?: ElementType;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  /** Elementos de la ruta, del más general al actual. El último es la página actual. */
  items: BreadcrumbItemData[];
  /** Separador entre elementos. Por defecto, un chevron decorativo. */
  separator?: ReactNode;
  /** Máximo de elementos visibles. Si hay más, los intermedios se pliegan tras un botón "…". Mínimo efectivo: 2. */
  maxItems?: number;
}

const DEFAULT_SEPARATOR = <ChevronRight aria-hidden="true" />;

function resolveComponent(item: BreadcrumbItemData): ElementType {
  if (item.as) return item.as;
  if (item.href) return "a";
  if (item.onClick) return "button";
  return "span";
}

function ItemContent({ item }: { item: BreadcrumbItemData }) {
  return (
    <>
      {item.icon && <span className={styles.icon} aria-hidden="true">{item.icon}</span>}
      <span className={styles.label}>{item.label}</span>
    </>
  );
}

/** Renderiza un elemento navegable (todos menos el último). */
function BreadcrumbLink({
  item,
  onActivate,
}: {
  item: BreadcrumbItemData;
  onActivate?: () => void;
}) {
  const component = resolveComponent(item);
  const title = typeof item.label === "string" ? item.label : undefined;
  const extraProps = component === "button" ? { type: "button" as const } : {};

  // createElement: el tipo puede ser un `as` del consumidor, que el linter no acepta como JSX dinámico durante el render.
  return createElement(
    component,
    {
      className: styles.link,
      title,
      href: item.href,
      onClick: (event: MouseEvent<Element>) => {
        item.onClick?.(event);
        onActivate?.();
      },
      ...extraProps,
    },
    <ItemContent item={item} />,
  );
}

/**
 * Ruta de navegación. Renderiza `nav > ol` y marca el último elemento con `aria-current="page"`.
 *
 * Con `maxItems`, se muestran el primer elemento, un botón "…" y los últimos `maxItems - 1`.
 * El botón abre un `Popover` con los elementos ocultos.
 */
export function Breadcrumb({
  items,
  separator = DEFAULT_SEPARATOR,
  maxItems,
  className,
  "aria-label": ariaLabel = "Ruta de navegación",
  ...props
}: BreadcrumbProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const ellipsisRef = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const limit = maxItems === undefined ? undefined : Math.max(2, maxItems);
  const collapsed = limit !== undefined && items.length > limit;
  const tailCount = limit !== undefined ? limit - 1 : 0;

  const hidden = collapsed ? items.slice(1, items.length - tailCount) : [];
  const visible: Array<{ item: BreadcrumbItemData; index: number }> = collapsed
    ? [
        { item: items[0], index: 0 },
        ...items.slice(items.length - tailCount).map((item, i) => ({
          item,
          index: items.length - tailCount + i,
        })),
      ]
    : items.map((item, index) => ({ item, index }));

  const lastIndex = items.length - 1;
  const renderSeparator = (isLast: boolean) =>
    !isLast && <span className={styles.separator} aria-hidden="true">{separator}</span>;

  return (
    <nav aria-label={ariaLabel} className={cx(styles.breadcrumb, className)} {...props}>
      <ol className={styles.list}>
        {visible.map(({ item, index }, position) => {
          const isLast = index === lastIndex;
          const showEllipsisBefore = collapsed && position === 1;
          return (
            <li key={index} className={styles.listItem}>
              {showEllipsisBefore && (
                <>
                  <button
                    ref={ellipsisRef}
                    type="button"
                    className={styles.ellipsis}
                    aria-haspopup="true"
                    aria-expanded={menuOpen}
                    aria-label="Mostrar rutas ocultas"
                    onClick={() => setMenuOpen((value) => !value)}
                  >
                    <Ellipsis aria-hidden="true" />
                  </button>
                  {renderSeparator(false)}
                  <Popover
                    anchorRef={ellipsisRef}
                    open={menuOpen}
                    onClose={closeMenu}
                    aria-label="Rutas ocultas"
                    className={styles.menu}
                  >
                    <ul className={styles.menuList}>
                      {hidden.map((hiddenItem, i) => (
                        <li key={i}>
                          <BreadcrumbLink item={hiddenItem} onActivate={closeMenu} />
                        </li>
                      ))}
                    </ul>
                  </Popover>
                </>
              )}
              {isLast ? (
                <span className={styles.current} aria-current="page" title={typeof item.label === "string" ? item.label : undefined}>
                  <ItemContent item={item} />
                </span>
              ) : (
                <BreadcrumbLink item={item} />
              )}
              {renderSeparator(isLast)}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
