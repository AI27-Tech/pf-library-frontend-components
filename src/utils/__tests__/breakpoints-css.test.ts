import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BREAKPOINTS } from '../breakpoints';

/** Raíz de `src/`, a partir de `src/utils/__tests__/`. */
const SRC_DIR = resolve(import.meta.dirname, '../..');
const MANIFEST_PATH = join(SRC_DIR, 'utils', 'breakpoints-legacy.manifest.json');

/** Literales permitidos por dirección: `min-width` entra en tablet o escritorio; `max-width` sale un píxel antes. */
const ALLOWED_MIN = new Set<string>([BREAKPOINTS.tablet.rem, BREAKPOINTS.desktop.rem]);
const ALLOWED_MAX = new Set<string>(['39.99rem', '63.99rem']);

interface WidthCondition {
  line: number;
  direction: 'min' | 'max';
  value: string;
  prelude: string;
}

interface Violation {
  file: string;
  line: number;
  condition: string;
}

/** Reemplaza los comentarios por espacios, para conservar las líneas originales. */
function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/[^\n]/g, ' '));
}

function lineOf(text: string, index: number): number {
  return text.slice(0, index).split('\n').length;
}

/** Extrae cada condición `min-width`/`max-width` de las reglas `@media` y `@container`. */
export function extractWidthConditions(css: string): WidthCondition[] {
  const text = stripComments(css);
  const conditions: WidthCondition[] = [];
  const ruleRe = /@(media|container)\b([^{;]*)\{/g;
  let rule: RegExpExecArray | null;
  while ((rule = ruleRe.exec(text)) !== null) {
    const prelude = rule[2];
    const widthRe = /\b(min|max)-width\s*:\s*([0-9.]+(?:rem|px|em))/g;
    let width: RegExpExecArray | null;
    while ((width = widthRe.exec(prelude)) !== null) {
      conditions.push({
        line: lineOf(text, rule.index),
        direction: width[1] as 'min' | 'max',
        value: width[2],
        prelude: prelude.trim(),
      });
    }
  }
  return conditions;
}

function isAllowed(condition: WidthCondition): boolean {
  return condition.direction === 'min'
    ? ALLOWED_MIN.has(condition.value)
    : ALLOWED_MAX.has(condition.value);
}

function listCssFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return listCssFiles(full);
    return entry.endsWith('.css') ? [full] : [];
  });
}

/** Ruta relativa a `src/`, con separadores `/`, como en el manifiesto. */
function toManifestPath(absolute: string): string {
  return relative(SRC_DIR, absolute).split(sep).join('/');
}

function readManifest(): string[] {
  const parsed = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')) as { files: string[] };
  return parsed.files;
}

function findViolations(): Violation[] {
  return listCssFiles(SRC_DIR).flatMap((absolute) => {
    const css = readFileSync(absolute, 'utf8');
    return extractWidthConditions(css)
      .filter((condition) => !isAllowed(condition))
      .map((condition) => ({
        file: toManifestPath(absolute),
        line: condition.line,
        condition: `${condition.direction}-width: ${condition.value}`,
      }));
  });
}

describe('umbrales de breakpoints en CSS', () => {
  it('el extractor reconoce @media y @container y omite los comentarios', () => {
    const sample = [
      '/* @media (max-width: 1024px) comentario */',
      '@media (max-width: 39.99rem) { .a { color: red; } }',
      '@container (min-width: 40rem) { .b { color: blue; } }',
      '@media (prefers-reduced-motion: reduce) { .c { transition: none; } }',
    ].join('\n');
    expect(extractWidthConditions(sample).map((c) => `${c.direction}:${c.value}`)).toEqual([
      'max:39.99rem',
      'min:40rem',
    ]);
  });

  it('cada umbral de src coincide con el Breakpoint_Set, salvo los archivos del manifiesto', () => {
    const legacy = new Set(readManifest());
    const violations = findViolations().filter((v) => !legacy.has(v.file));
    const report = violations.map((v) => `${v.file}:${v.line} ${v.condition}`).join('\n');
    expect(violations, report).toEqual([]);
  });

  it('cada archivo del manifiesto existe y todavía tiene un umbral fuera del Breakpoint_Set', () => {
    const violating = new Set(findViolations().map((v) => v.file));
    const missing = readManifest().filter((file) => {
      try {
        statSync(join(SRC_DIR, file));
        return false;
      } catch {
        return true;
      }
    });
    expect(missing, 'archivos del manifiesto que no existen').toEqual([]);

    const clean = readManifest().filter((file) => !violating.has(file));
    expect(clean, 'archivos que ya cumplen: quítalos del manifiesto').toEqual([]);
  });

  it.runIf(process.env.BREAKPOINTS_STRICT === '1')(
    'modo estricto: el manifiesto está vacío',
    () => {
      expect(readManifest()).toEqual([]);
    },
  );

  it('BREAKPOINTS de TypeScript coincide con los literales permitidos', () => {
    expect(BREAKPOINTS.tablet.rem).toBe('40rem');
    expect(BREAKPOINTS.desktop.rem).toBe('64rem');
    expect(BREAKPOINTS.tablet.px).toBe(40 * 16);
    expect(BREAKPOINTS.desktop.px).toBe(64 * 16);
  });
});
