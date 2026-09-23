import type { HTMLAttributes, ReactNode } from "react";
import { useState } from "react";
import styles from "./ImageCarousel.module.css";

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
  const [scrollPositions, setScrollPositions] = useState<Record<number, number>>({});

  const handleScroll = (sectionIndex: number, direction: "left" | "right", visibleItems: number) => {
    const container = document.querySelector(
      `[data-carousel-section="${sectionIndex}"]`
    ) as HTMLElement;

    if (!container) return;

    const currentScroll = scrollPositions[sectionIndex] || 0;
    const itemWidth = container.offsetWidth / visibleItems;
    const scrollAmount = itemWidth + (parseInt(gap) || 16);

    const newScroll =
      direction === "left"
        ? Math.max(0, currentScroll - scrollAmount)
        : currentScroll + scrollAmount;

    container.scrollLeft = newScroll;
    setScrollPositions((prev) => ({ ...prev, [sectionIndex]: newScroll }));
  };

  return (
    <div className={cx(styles.carousel, className)} {...props}>
      {sections.map((section, sectionIdx) => {
        if (hideEmpty && section.items.length === 0) return null;

        const visibleItems = section.visibleItems || 4;

        return (
          <div key={sectionIdx} className={styles.section}>
            {/* Encabezado de sección */}
            <div className={styles.sectionHeader}>
              <div className={styles.headerContent}>
                <h2 className={styles.sectionTitle}>{section.title}</h2>
                {section.badge && (
                  <div className={styles.sectionBadge}>{section.badge}</div>
                )}
              </div>
              {section.location && (
                <div className={styles.sectionLocation}>{section.location}</div>
              )}
            </div>

            {/* Contenedor del carrusel */}
            <div className={styles.carouselWrapper}>
              {section.showArrows !== false && (
                <button
                  className={cx(styles.navButton, styles.prev)}
                  onClick={() => handleScroll(sectionIdx, "left", visibleItems)}
                  aria-label="Desplazar a la izquierda"
                >
                  ‹
                </button>
              )}

              <div
                className={styles.itemsContainer}
                data-carousel-section={sectionIdx}
                style={{ gap }}
              >
                {section.items.map((item, itemIdx) =>
                  renderItem(item, itemIdx)
                )}
              </div>

              {section.showArrows !== false && (
                <button
                  className={cx(styles.navButton, styles.next)}
                  onClick={() => handleScroll(sectionIdx, "right", visibleItems)}
                  aria-label="Scroll right"
                >
                  ›
                </button>
              )}
            </div>

            {/* Item count */}
            <div className={styles.itemCount}>
              {section.items.length} item{section.items.length !== 1 ? "s" : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
}
