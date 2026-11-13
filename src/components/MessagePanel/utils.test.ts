import { describe, expect, it } from 'vitest';
import { isNearBottom } from './utils';

describe('isNearBottom', () => {
  it('es verdadero cuando la distancia al fondo está dentro del umbral', () => {
    // 1000 de alto total, viewport de 400, desplazado a 560: quedan 40 px por bajar.
    expect(isNearBottom({ scrollHeight: 1000, scrollTop: 560, clientHeight: 400 }, 64)).toBe(true);
  });

  it('es falso cuando el usuario está lejos del fondo', () => {
    expect(isNearBottom({ scrollHeight: 1000, scrollTop: 200, clientHeight: 400 }, 64)).toBe(false);
  });

  it('incluye el borde exacto del umbral', () => {
    // Quedan exactamente 64 px por bajar.
    expect(isNearBottom({ scrollHeight: 1000, scrollTop: 536, clientHeight: 400 }, 64)).toBe(true);
  });

  it('es verdadero cuando no hay nada que desplazar', () => {
    expect(isNearBottom({ scrollHeight: 300, scrollTop: 0, clientHeight: 400 }, 64)).toBe(true);
  });
});
