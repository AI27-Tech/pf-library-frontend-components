import type { HTMLAttributes, ReactNode } from "react";
import styles from "./ImageCarousel.module.css";
import { useBreakpoint } from "../../utils/useBreakpoint";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface CarouselSection<T> {
  /** Título/etiqueta de la sección */
  title: ReactNode;
  /** Insignia o indicador de estado */
  badge?: ReactNode;
  /** Información de ubicación/lugar */
  location?: ReactNode;
  /** Array de elementos a mostrar en el carrusel */
  items: T[];
  /** Número de elementos visibles (por defecto: 4) */
  visibleItems?: number;
  /** Si mostrar flechas de navegación */
  showArrows?: boolean;
}

export interface ImageCarouselProps<T>
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Array de secciones */
  sections: CarouselSection<T>[];
  /** Función de renderización para cada elemento */
  renderItem: (item: T, index: number) => ReactNode;
  /** Brecha entre elementos (por defecto: "1rem") */
  gap?: string;
  /** Ocultar sección si está vacía (por defecto: true) */
  hideEmpty?: boolean;
}

export function ImageCarousel<T>({
  sections,
  renderItem,
  gap = "1rem",
  hideEmpty = true,
  className,
  ...props
}: ImageCarouselProps<T>) {

  const bp = useBreakpoint();
  const isMobile = bp === "mobile";

  // Desplaza exactamente un elemento (o la vista completa si no hay elementos). En movil, una vista = un elemento.
  const handleScroll = (sectionIndex: number, direction: "left" | "right", visibleItems: number) => {
    const container = document.querySelector(`[data-carousel-section="${sectionIndex}"]`) as HTMLElement | null;
    if (!container) return;

    const first = container.firstElementChild as HTMLElement | null;
    const gapPx = parseFloat(gap) || 16;
    const step = first ? first.offsetWidth + gapPx : container.offsetWidth / (isMobile ? 1 : visibleItems);
    const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
    const currentScroll = container.scrollLeft;
    const newScroll = direction === "left" ? Math.max(0, currentScroll - step) : Math.min(maxScroll, currentScroll + step);

    container.scrollTo({ left: newScroll, behavior: "smooth" });
  };

  return (
    <div className={cx(styles.carousel, className)} {...props}>
      {sections.map((section, sectionIdx) => {
        if (hideEmpty && section.items.length === 0) return null;

        const visibleItems = section.visibleItems || 4;

        return (
          <div key={sectionIdx} className={styles.section}>
            {/* Encabezado de sección con flechas de navegación */}
            <div className={styles.sectionHeader}>
              <div className={styles.headerContent}>
                <h2 className={styles.sectionTitle}>{section.title}</h2>
                {section.badge && (
                  <div className={styles.sectionBadge}>{section.badge}</div>
                )}
                {section.location && (
                  <div className={styles.sectionLocation}>{section.location}</div>
                )}
              </div>
              
              {/* Flechas de navegación en el encabezado */}
              {section.showArrows !== false && (
                <div className={styles.headerControls}>
                  <button
                    className={cx(styles.navButton, styles.prev)}
                    onClick={() => handleScroll(sectionIdx, "left", visibleItems)}
                    aria-label="Desplazar a la izquierda"
                  >
                    ‹
                  </button>
                  <button
                    className={cx(styles.navButton, styles.next)}
                    onClick={() => handleScroll(sectionIdx, "right", visibleItems)}
                    aria-label="Scroll right"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>

            {/* Divisor */}
            <div className={styles.divider}></div>

            {/* Contenedor del carrusel */}
            <div className={styles.carouselWrapper}>
              <div
                className={styles.itemsContainer}
                data-carousel-section={sectionIdx} tabIndex={0}
                style={{ gap }}
              >
                {section.items.map((item, itemIdx) =>
                  renderItem(item, itemIdx)
                )}
              </div>
            </div>

            {/* Item count discreto */}
            {section.items.length > 0 && (
              <div className={styles.itemCount}>
                {section.items.length} item{section.items.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
