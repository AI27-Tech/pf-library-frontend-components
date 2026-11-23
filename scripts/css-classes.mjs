#!/usr/bin/env node
/**
 * Manifiesto normalizado de clases CSS de `src/` (tarea 51.3).
 *
 * Lista los nombres de clase de cada selector, sin hash de módulo ni línea. Las stories
 * (`src/stories/`) quedan fuera: sus utilidades son solo para pruebas y no se publican.
 *
 * Uso: `node scripts/css-classes.mjs` regenera `docs/css-classes.manifest.json`.
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = join(RAIZ, 'src');
const MANIFEST_PATH = join(RAIZ, 'docs', 'css-classes.manifest.json');

/** Carpetas de `src/` que no cuentan para el manifiesto. */
const EXCLUIDAS = ['stories'];

/** Reemplaza los comentarios por espacios, para no leer nombres de clase dentro de ellos. */
function quitarComentarios(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, (coincidencia) => coincidencia.replace(/[^\n]/g, ' '));
}

/** Nombres de clase de un CSS. Un punto seguido de dígito (`0.5rem`) no cuenta: el nombre empieza por letra o guion bajo. */
export function extraerClases(css) {
  const texto = quitarComentarios(css);
  const clases = new Set();
  for (const [, nombre] of texto.matchAll(/\.(-?[A-Za-z_][A-Za-z0-9_-]*)/g)) {
    clases.add(nombre);
  }
  return clases;
}

/** Todos los `.css` de `src/`, con su ruta relativa a `src/`, sin las carpetas excluidas. */
export function archivosCss(dir = SRC_DIR) {
  const encontrados = [];
  const recorrer = (actual) => {
    for (const entrada of readdirSync(actual, { withFileTypes: true })) {
      const ruta = join(actual, entrada.name);
      if (entrada.isDirectory()) {
        const relativa = relative(dir, ruta);
        if (!EXCLUIDAS.includes(relativa)) recorrer(ruta);
      } else if (entrada.name.endsWith('.css')) {
        encontrados.push(ruta);
      }
    }
  };
  recorrer(dir);
  return encontrados.map((ruta) => ({ ruta, relativa: relative(dir, ruta).split(sep).join('/') }));
}

/** Clases de todo `src/` (sin stories), ordenadas y sin repetir. */
export function clasesDeFuentes(dir = SRC_DIR) {
  const todas = new Set();
  for (const { ruta } of archivosCss(dir)) {
    for (const clase of extraerClases(readFileSync(ruta, 'utf8'))) todas.add(clase);
  }
  return [...todas].sort();
}

function generarManifiesto() {
  return {
    descripcion:
      'Clases CSS de src/ normalizadas (sin hash de módulo ni línea). Generado por scripts/css-classes.mjs. Las clases existentes no se renombran; las nuevas llevan prefijo ui-.',
    clases: clasesDeFuentes(),
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const manifiesto = generarManifiesto();
  writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifiesto, null, 2)}\n`, 'utf8');
  console.log(`Manifiesto escrito en ${relative(RAIZ, MANIFEST_PATH)} con ${manifiesto.clases.length} clases.`);
}
