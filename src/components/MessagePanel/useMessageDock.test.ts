import { describe, expect, it } from 'vitest';
import { capacidadPara, DOCK_INITIAL_STATE, dockReducer, longitudEnPx, type DockState } from './useMessageDock';

const conCapacidad = (capacity: number): DockState => ({ ...DOCK_INITIAL_STATE, capacity });

describe('dockReducer', () => {
  it('abrir pone el panel al frente y lo expande', () => {
    let estado = dockReducer(conCapacidad(3), { type: 'open', id: 'a' });
    estado = dockReducer(estado, { type: 'open', id: 'b' });
    estado = dockReducer(estado, { type: 'toggle', id: 'a' });
    estado = dockReducer(estado, { type: 'open', id: 'a' });
    expect(estado.order).toEqual(['a', 'b']);
    expect(estado.minimized.a).toBe(false);
  });

  it('cerrar quita el panel del orden y de los minimizados', () => {
    let estado = dockReducer(conCapacidad(3), { type: 'open', id: 'a' });
    estado = dockReducer(estado, { type: 'toggle', id: 'a' });
    estado = dockReducer(estado, { type: 'close', id: 'a' });
    expect(estado.order).toEqual([]);
    expect(estado.minimized).toEqual({});
  });

  it('alternar minimiza un panel abierto y vuelve a expandirlo', () => {
    let estado = dockReducer(conCapacidad(3), { type: 'open', id: 'a' });
    estado = dockReducer(estado, { type: 'toggle', id: 'a' });
    expect(estado.minimized.a).toBe(true);
    estado = dockReducer(estado, { type: 'toggle', id: 'a' });
    expect(estado.minimized.a).toBe(false);
  });

  it('alternar un panel cerrado lo abre', () => {
    const estado = dockReducer(conCapacidad(3), { type: 'toggle', id: 'x' });
    expect(estado.order).toEqual(['x']);
  });

  it('cerrar un panel que no existe no cambia el estado', () => {
    const inicial = conCapacidad(3);
    expect(dockReducer(inicial, { type: 'close', id: 'nadie' })).toBe(inicial);
  });

  it('alterna la barra', () => {
    const estado = dockReducer(conCapacidad(3), { type: 'toggleBar' });
    expect(estado.barOpen).toBe(true);
  });

  it('la capacidad nunca baja de 1', () => {
    expect(dockReducer(conCapacidad(3), { type: 'setCapacity', capacity: 0 }).capacity).toBe(1);
    expect(dockReducer(conCapacidad(3), { type: 'setCapacity', capacity: -4 }).capacity).toBe(1);
  });

  it('con capacidad 1, un segundo panel queda en overflow', () => {
    let estado = dockReducer(conCapacidad(1), { type: 'open', id: 'a' });
    estado = dockReducer(estado, { type: 'open', id: 'b' });
    expect(estado.order.slice(0, estado.capacity)).toEqual(['b']);
    expect(estado.order.slice(estado.capacity)).toEqual(['a']);
  });
});

describe('capacidadPara', () => {
  it('calcula cuántos paneles caben en el ancho disponible', () => {
    // 1280 px de ventana: 1280 - 288 (barra) - 32 (márgenes) = 960 px. Cada panel ocupa 320 + 16 px, así que caben 2.
    expect(capacidadPara(1280, 320, 288, 16)).toBe(2);
    // 1400 px dejan 1080 px: 1080 / 336 = 3.2, caben 3.
    expect(capacidadPara(1400, 320, 288, 16)).toBe(3);
  });

  it('nunca devuelve menos de 1, aunque la ventana sea muy angosta', () => {
    expect(capacidadPara(320, 320, 288, 16)).toBe(1);
  });
});

describe('longitudEnPx', () => {
  it('convierte rem y px', () => {
    expect(longitudEnPx(' 20rem ', 0)).toBe(320);
    expect(longitudEnPx('300px', 0)).toBe(300);
  });

  it('usa el respaldo cuando el valor no se entiende', () => {
    expect(longitudEnPx('', 288)).toBe(288);
  });
});
