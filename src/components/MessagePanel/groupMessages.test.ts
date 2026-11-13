import { describe, expect, it } from 'vitest';
import { groupMessages, VENTANA_AGRUPACION_MS } from './groupMessages';
import type { Mensaje } from './types';

function m(id: number, creadoEn: string, extra: Partial<Mensaje> = {}): Mensaje {
  return {
    id: `m-${id}`,
    conversacionId: 'c-1',
    secuencia: id,
    clientMessageId: `cmid-${id}`,
    audienciaAutor: 'Interno',
    aliasMostrado: 'Central C4',
    cuerpo: `mensaje ${id}`,
    creadoEn,
    actorReal: 'actor-a',
    ...extra,
  };
}

// Fechas locales con hora fija para que el día no dependa de la zona horaria del servidor de pruebas.
const base = new Date(2026, 10, 6, 10, 0, 0);
const enMinutos = (min: number) => new Date(base.getTime() + min * 60_000).toISOString();

describe('groupMessages', () => {
  it('agrupa mensajes del mismo autor a menos de 5 minutos', () => {
    const [grupo] = groupMessages([m(1, enMinutos(0)), m(2, enMinutos(1)), m(3, enMinutos(2))]);
    expect(grupo.items.map((i) => i.groupPosition)).toEqual(['first', 'middle', 'last']);
  });

  it('corta el grupo cuando cambia el autor', () => {
    const [grupo] = groupMessages([m(1, enMinutos(0)), m(2, enMinutos(1), { actorReal: 'actor-b' })]);
    expect(grupo.items.map((i) => i.groupPosition)).toEqual(['single', 'single']);
  });

  it('corta el grupo cuando hay 5 minutos o más entre mensajes', () => {
    const limite = VENTANA_AGRUPACION_MS / 60_000;
    const [grupo] = groupMessages([m(1, enMinutos(0)), m(2, enMinutos(limite))]);
    expect(grupo.items.map((i) => i.groupPosition)).toEqual(['single', 'single']);
  });

  it('corta el grupo y abre un día nuevo al cambiar de día local', () => {
    const ayerNoche = new Date(2026, 10, 5, 23, 58, 0).toISOString();
    const grupos = groupMessages([m(1, ayerNoche), m(2, enMinutos(0))]);
    expect(grupos).toHaveLength(2);
    expect(grupos.map((g) => g.items[0].groupPosition)).toEqual(['single', 'single']);
  });

  it('una fecha inválida no se agrupa con sus vecinos', () => {
    const grupos = groupMessages([m(1, 'no-es-fecha'), m(2, 'no-es-fecha')]);
    expect(grupos.flatMap((g) => g.items.map((i) => i.groupPosition))).toEqual(['single', 'single']);
  });

  it('devuelve una lista vacía sin mensajes', () => {
    expect(groupMessages([])).toEqual([]);
  });
});
