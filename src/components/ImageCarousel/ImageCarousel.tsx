import type { HTMLAttributes, ReactNode } from "react";
import { useState } from "react";
import styles from "./ImageCarousel.module.css";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface CarouselSection<T> {
  /** Section title/label */
  title: ReactNode;
  /** Badge or status indicator */
  badge?: ReactNode;
  /** Location/place information */
  location?: ReactNode;
  /** Array of items to display in carousel */
  items: T[];
  /** Number of visible items (default: 4) */
  visibleItems?: number;
  /** Whether to show navigation arrows */
  showArrows?: boolean;
}

export interface ImageCarouselProps<T>
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Array of sections */
  sections: CarouselSection<T>[];
  /** Render function for each item */
  renderItem: (item: T, index: number) => ReactNode;
  /** Gap between items (default: "1rem") */
  gap?: string;
  /** Hide section if empty (default: true) */
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
            {/* Section Header */}
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

            {/* Carousel Container */}
            <div className={styles.carouselWrapper}>
              {section.showArrows !== false && (
                <button
                  className={cx(styles.navButton, styles.prev)}
                  onClick={() => handleScroll(sectionIdx, "left", visibleItems)}
                  aria-label="Scroll left"
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
