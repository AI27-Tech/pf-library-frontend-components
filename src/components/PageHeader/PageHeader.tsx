import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx";
import styles from "./PageHeader.module.css";

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Título de la página. */
  title: ReactNode;
  /** Texto breve bajo el título. */
  description?: ReactNode;
  /** Ruta de navegación, normalmente un `Breadcrumb`. Se muestra arriba del título. */
  breadcrumb?: ReactNode;
  /** Acciones de la página (botones). Pasan debajo del título en pantallas angostas. */
  actions?: ReactNode;
  /** Zona inferior, por ejemplo `Tabs`. */
  children?: ReactNode;
  /** Nivel del título. Por defecto: "h1". */
  titleAs?: "h1" | "h2";
}

/** Encabezado de página: ruta, título, descripción, acciones y una zona inferior. */
export function PageHeader({
  title,
  description,
  breadcrumb,
  actions,
  children,
  titleAs = "h1",
  className,
  ...props
}: PageHeaderProps) {
  const heading =
    titleAs === "h2" ? (
      <h2 className={styles.title}>{title}</h2>
    ) : (
      <h1 className={styles.title}>{title}</h1>
    );

  return (
    <header className={cx(styles.pageHeader, className)} {...props}>
      {breadcrumb && <div className={styles.breadcrumb}>{breadcrumb}</div>}

      <div className={styles.top}>
        <div className={styles.text}>
          {heading}
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>

      {children && <div className={styles.body}>{children}</div>}
    </header>
  );
}
