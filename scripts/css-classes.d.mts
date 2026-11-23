/** Tipos del módulo `css-classes.mjs`, para que los tests de `src/` lo importen con tipos. */
export function extraerClases(css: string): Set<string>;
export function archivosCss(dir?: string): Array<{ ruta: string; relativa: string }>;
export function clasesDeFuentes(dir?: string): string[];
