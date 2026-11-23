import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { clampToViewport, type Rect } from '../responsive/position';

interface Scenario {
  vw: number;
  vh: number;
  margin: number;
  anchor: Rect;
  panel: { width: number; height: number };
}

/**
 * Escenario válido: el ancla queda completa dentro del viewport menos el margen, y el
 * panel cabe en ancho (aunque puede ser más alto que el espacio disponible).
 */
const scenarioArb: fc.Arbitrary<Scenario> = fc
  .record({
    vw: fc.integer({ min: 320, max: 1280 }),
    vh: fc.integer({ min: 480, max: 1000 }),
    margin: fc.integer({ min: 0, max: 16 }),
  })
  .chain(({ vw, vh, margin }) =>
    fc
      .record({
        width: fc.integer({ min: 1, max: 200 }),
        height: fc.integer({ min: 1, max: 80 }),
      })
      .chain((size) =>
        fc.record({
          anchor: fc.record({
            left: fc.integer({ min: margin, max: vw - margin - size.width }),
            top: fc.integer({ min: margin, max: vh - margin - size.height }),
            width: fc.constant(size.width),
            height: fc.constant(size.height),
          }),
          panel: fc.record({
            width: fc.integer({ min: 1, max: vw - 2 * margin }),
            height: fc.integer({ min: 1, max: vh }),
          }),
        }),
      )
      .map(({ anchor, panel }) => ({ vw, vh, margin, anchor, panel })),
  );

describe('clampToViewport', () => {
  // Property 5: Paneles flotantes dentro del viewport
  // Validates: Requirements 5.12, 5.13, 6.6, 6.7
  it('deja el panel (con maxHeight) dentro del viewport menos el margen', () => {
    fc.assert(
      fc.property(scenarioArb, ({ vw, vh, margin, anchor, panel }) => {
        const r = clampToViewport(anchor, panel, { width: vw, height: vh }, margin);
        expect(r.maxHeight).toBeGreaterThanOrEqual(0);
        expect(r.maxHeight).toBeLessThanOrEqual(panel.height);
        expect(r.top).toBeGreaterThanOrEqual(margin);
        expect(r.top + r.maxHeight).toBeLessThanOrEqual(vh - margin);
        expect(r.left).toBeGreaterThanOrEqual(margin);
        expect(r.left + panel.width).toBeLessThanOrEqual(vw - margin);
      }),
    );
  });

  it('el panel nunca tapa el ancla: queda debajo o encima de ella', () => {
    fc.assert(
      fc.property(scenarioArb, ({ vw, vh, margin, anchor, panel }) => {
        const r = clampToViewport(anchor, panel, { width: vw, height: vh }, margin);
        const anchorBottom = anchor.top + anchor.height;
        const below = r.top >= anchorBottom;
        const above = r.top + r.maxHeight <= anchor.top;
        expect(below || above).toBe(true);
      }),
    );
  });

  it('si el panel cabe sin ajuste, la posición no cambia', () => {
    fc.assert(
      fc.property(scenarioArb, ({ vw, vh, margin, anchor, panel }) => {
        const r = clampToViewport(anchor, panel, { width: vw, height: vh }, margin);
        const anchorBottom = anchor.top + anchor.height;
        const spaceBelow = vh - margin - anchorBottom;
        const spaceAbove = anchor.top - margin;
        if (panel.height <= spaceBelow) {
          expect(r.top).toBe(anchorBottom);
          expect(r.maxHeight).toBe(panel.height);
        } else if (panel.height <= spaceAbove) {
          expect(r.top).toBe(anchor.top - panel.height);
          expect(r.maxHeight).toBe(panel.height);
        }
        if (anchor.left + panel.width <= vw - margin) {
          expect(r.left).toBe(anchor.left);
        }
      }),
    );
  });

  it('idempotencia: volver a aplicarlo con el mismo ancla y el maxHeight devuelto da el mismo resultado', () => {
    fc.assert(
      fc.property(scenarioArb, ({ vw, vh, margin, anchor, panel }) => {
        const viewport = { width: vw, height: vh };
        const first = clampToViewport(anchor, panel, viewport, margin);
        const second = clampToViewport(
          anchor,
          { width: panel.width, height: first.maxHeight },
          viewport,
          margin,
        );
        expect(second).toEqual(first);
      }),
    );
  });
});
