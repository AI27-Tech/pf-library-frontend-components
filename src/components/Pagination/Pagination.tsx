import styles from "./Pagination.module.css";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface PaginationProps {
  /** Current page (1-based). */
  page: number;
  /** Number of items per page. */
  pageSize: number;
  /** Total number of items across all pages. */
  total: number;
  /** Called when the user selects a different page. */
  onPageChange: (page: number) => void;
  /** Called when the page size changes. Enables the size selector. */
  onPageSizeChange?: (pageSize: number) => void;
  /** Page size options for the selector. Default: [10, 25, 50, 100]. */
  pageSizeOptions?: number[];
  /** How many page buttons to show around the current page. Default: 1. */
  siblingCount?: number;
  /** Show the "X–Y of Z" results text. Default: true. */
  showInfo?: boolean;
  className?: string;
}

const DOTS = "dots";

/** Builds the list of page numbers with ellipsis, e.g. [1, "dots", 4,5,6, "dots", 20]. */
function getPageRange(
  current: number,
  totalPages: number,
  siblingCount: number,
): Array<number | typeof DOTS> {
  // Show all pages if few enough: first + last + current±siblings + 2 dots.
  const totalToShow = siblingCount * 2 + 5;
  if (totalPages <= totalToShow) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(current - siblingCount, 1);
  const rightSibling = Math.min(current + siblingCount, totalPages);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < totalPages - 1;

  const range: Array<number | typeof DOTS> = [];

  if (!showLeftDots && showRightDots) {
    const leftCount = siblingCount * 2 + 3;
    for (let i = 1; i <= leftCount; i++) range.push(i);
    range.push(DOTS, totalPages);
  } else if (showLeftDots && !showRightDots) {
    range.push(1, DOTS);
    const rightCount = siblingCount * 2 + 3;
    for (let i = totalPages - rightCount + 1; i <= totalPages; i++) range.push(i);
  } else {
    range.push(1, DOTS);
    for (let i = leftSibling; i <= rightSibling; i++) range.push(i);
    range.push(DOTS, totalPages);
  }

  return range;
}

function PrevIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  siblingCount = 1,
  showInfo = true,
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(page, 1), totalPages);
  const pages = getPageRange(current, totalPages, siblingCount);

  const from = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const to = Math.min(current * pageSize, total);

  const goTo = (p: number) => {
    if (p < 1 || p > totalPages || p === current) return;
    onPageChange(p);
  };

  return (
    <nav className={cx(styles.pagination, className)} aria-label="Pagination">
      {showInfo && (
        <span className={styles.info}>
          <b>{from}</b>–<b>{to}</b> of <b>{total}</b>
        </span>
      )}

      {onPageSizeChange && (
        <label className={styles.pageSize}>
          Rows
          <select
            className={styles.pageSizeSelect}
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label="Rows per page"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className={styles.controls}>
        <button
          type="button"
          className={cx(styles.page, styles.arrow)}
          onClick={() => goTo(current - 1)}
          disabled={current <= 1}
          aria-label="Previous page"
        >
          <PrevIcon />
        </button>

        {pages.map((p, i) =>
          p === DOTS ? (
            <span key={`dots-${i}`} className={styles.ellipsis} aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              className={cx(styles.page, p === current && styles.active)}
              onClick={() => goTo(p)}
              aria-label={`Page ${p}`}
              aria-current={p === current ? "page" : undefined}
            >
              {p}
            </button>
          ),
        )}

        <button
          type="button"
          className={cx(styles.page, styles.arrow)}
          onClick={() => goTo(current + 1)}
          disabled={current >= totalPages}
          aria-label="Next page"
        >
          <NextIcon />
        </button>
      </div>
    </nav>
  );
}
