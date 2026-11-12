import type { Key, ReactNode } from "react";

/** Estado de un punto de la línea del tiempo. */
export type TimelineStatus = "completed" | "current" | "upcoming" | "error" | "warning";

export interface TimelineItemData {
  /** Identificador estable del punto. Se usa como `key`. */
  id: Key;
  title: ReactNode;
  description?: ReactNode;
  /** Marca de tiempo visible (por ejemplo "10 nov, 08:12"). */
  timestamp?: ReactNode;
  /** Fecha en ISO 8601. Si viene, la marca se renderiza como `<time dateTime>`. */
  dateTime?: string;
  /** Icono que reemplaza al icono por defecto del estado. */
  icon?: ReactNode;
  /** Por defecto: `upcoming`. */
  status?: TimelineStatus;
  /** Contenido libre bajo la descripción. */
  content?: ReactNode;
}
