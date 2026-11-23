import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { archivosCss, clasesDeFuentes } from '../../../scripts/css-classes.mjs';

/** Raíz del repo, a partir de `src/utils/__tests__/`. */
const RAIZ = resolve(import.meta.dirname, '../../..');
const SRC_DIR = join(RAIZ, 'src');

interface ManifiestoClases {
  descripcion: string;
  clases: string[];
}

function leerManifiesto(): ManifiestoClases {
  return JSON.parse(readFileSync(join(RAIZ, 'docs', 'css-classes.manifest.json'), 'utf8')) as ManifiestoClases;
}

describe('compatibilidad con Tailwind (Requirement 13)', () => {
  it('package.json no declara tailwindcss, @tailwindcss/* ni postcss (13.1)', () => {
    const pkg = JSON.parse(readFileSync(join(RAIZ, 'package.json'), 'utf8')) as {
      dependencies?: Record<string, string>;
      peerDependencies?: Record<string, string>;
    };
    const declaradas = [...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.peerDependencies ?? {})];
    const prohibidas = declaradas.filter((nombre) => nombre === 'tailwindcss' || nombre.startsWith('@tailwindcss/') || nombre === 'postcss');
    expect(prohibidas).toEqual([]);
  });

  it('ningún CSS de src/ declara @layer (13.5). Las stories quedan fuera: sus utilidades simulan Tailwind y no se publican', () => {
    const conLayer = archivosCss(SRC_DIR)
      .filter(({ ruta }) => /@layer\b/.test(readFileSync(ruta, 'utf8')))
      .map(({ relativa }) => relativa);
    expect(conLayer).toEqual([]);
  });

  it('las clases del manifiesto siguen existiendo: ninguna se renombra ni se borra (13.11)', () => {
    const actuales = new Set(clasesDeFuentes(SRC_DIR));
    const desaparecidas = leerManifiesto().clases.filter((clase) => !actuales.has(clase));
    expect(desaparecidas).toEqual([]);
  });

  it('toda clase fuera del manifiesto lleva el prefijo ui- (13.12)', () => {
    const enManifiesto = new Set(leerManifiesto().clases);
    const nuevasSinPrefijo = clasesDeFuentes(SRC_DIR).filter((clase) => !enManifiesto.has(clase) && !clase.startsWith('ui-'));
    expect(nuevasSinPrefijo).toEqual([]);
  });
});
