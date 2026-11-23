import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/** Raíz de `src/`, a partir de `src/utils/__tests__/`. */
const SRC_DIR = resolve(import.meta.dirname, '../..');

/**
 * Componentes de mensajería que no tienen story `Mobile` propia: su móvil vive en una variante
 * con nombre dentro de `MessagePanel.stories.tsx` (tareas 43 a 48).
 */
const VARIANTES_MENSAJERIA: Record<string, string> = {
  MessageBubble: 'BubbleMobile',
  MessageAttachment: 'BubbleMobile',
  MessageComposer: 'ComposerMobile',
  MessageList: 'ThreadMobile',
  MessageThread: 'ThreadMobile',
  MessageDayDivider: 'ThreadMobile',
  MessageDock: 'DockMobile',
  MessageDockBar: 'DockMobile',
};

interface ExportacionDeValor {
  nombre: string;
  modulo: string;
}

/**
 * Nombres de componentes exportados como valor desde `src/index.ts`. Ignora los `export type`,
 * los hooks y las utilidades en minúscula, y las constantes en mayúsculas con guion bajo.
 */
function exportacionesDeComponentes(indexTexto: string): ExportacionDeValor[] {
  const exportaciones: ExportacionDeValor[] = [];
  for (const [, bloque, modulo] of indexTexto.matchAll(/export\s*\{([^}]*)\}\s*from\s*["']([^"']+)["']/g)) {
    for (const elemento of bloque.split(',').map((texto) => texto.trim()).filter(Boolean)) {
      if (elemento.startsWith('type ')) continue;
      const nombre = elemento.split(/\s+as\s+/).pop() ?? elemento;
      if (/^[A-Z][A-Za-z0-9]*$/.test(nombre)) exportaciones.push({ nombre, modulo });
    }
  }
  return exportaciones;
}

/** Carpeta del componente: el módulo puede apuntar a una carpeta o a un archivo dentro de ella. */
function carpetaDelModulo(modulo: string): string {
  const ruta = resolve(SRC_DIR, modulo);
  if (existsSync(ruta) && statSync(ruta).isDirectory()) return ruta;
  return resolve(ruta, '..');
}

function storiesDe(carpeta: string): Array<{ nombreArchivo: string; texto: string }> {
  return readdirSync(carpeta)
    .filter((archivo) => archivo.endsWith('.stories.tsx'))
    .map((archivo) => ({ nombreArchivo: archivo, texto: readFileSync(join(carpeta, archivo), 'utf8') }));
}

/** Motivo por el que el componente no tiene story móvil, o `null` si la tiene. */
function faltaStoryMovil(nombre: string, modulo: string): string | null {
  const carpeta = carpetaDelModulo(modulo);
  const stories = storiesDe(carpeta);
  const variante = VARIANTES_MENSAJERIA[nombre];

  if (variante) {
    const existe = stories.some(({ texto }) => new RegExp(`export const ${variante}\\b`).test(texto));
    return existe ? null : `falta la variante ${variante} en ${carpeta}`;
  }

  const cubierto = stories.some(
    // Acepta `Mobile` y las variantes con ese prefijo (`MobileApilada`, `MobileSinFilas`).
    ({ texto }) => /export const Mobile[A-Za-z0-9]*[\s:=]/.test(texto) && new RegExp(`\\b${nombre}\\b`).test(texto),
  );
  return cubierto ? null : `no tiene story Mobile que lo use en ${carpeta}`;
}

describe('cobertura de stories móviles (Requirement 10.3)', () => {
  const indexTexto = readFileSync(join(SRC_DIR, 'index.ts'), 'utf8');
  const componentes = exportacionesDeComponentes(indexTexto);

  it('detecta componentes exportados desde src/index.ts', () => {
    expect(componentes.length).toBeGreaterThan(20);
  });

  it('cada componente exportado tiene una story Mobile (o su variante de mensajería)', () => {
    const sinStoryMovil = componentes
      .map(({ nombre, modulo }) => {
        const motivo = faltaStoryMovil(nombre, modulo);
        return motivo ? `${nombre}: ${motivo}` : null;
      })
      .filter((linea): linea is string => linea !== null);
    expect(sinStoryMovil).toEqual([]);
  });
});
