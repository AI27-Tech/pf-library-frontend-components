import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Grid } from './Layout';

function varsOf(element: HTMLElement) {
  return {
    mobile: element.style.getPropertyValue('--ui-grid-cols-mobile'),
    tablet: element.style.getPropertyValue('--ui-grid-cols-tablet'),
    desktop: element.style.getPropertyValue('--ui-grid-cols-desktop'),
  };
}

describe('Grid', () => {
  it('con un número: móvil 1, tablet como máximo 2 y escritorio el número completo', () => {
    const { container } = render(<Grid columns={4}>{null}</Grid>);
    expect(varsOf(container.firstElementChild as HTMLElement)).toEqual({
      mobile: '1',
      tablet: '2',
      desktop: '4',
    });
  });

  it('con un número menor que 2, tablet no supera ese número', () => {
    const { container } = render(<Grid columns={1}>{null}</Grid>);
    expect(varsOf(container.firstElementChild as HTMLElement)).toEqual({
      mobile: '1',
      tablet: '1',
      desktop: '1',
    });
  });

  it('con un mapa, cada breakpoint hereda del inmediato menor cuando no se define', () => {
    const { container } = render(<Grid columns={{ mobile: 1, desktop: 4 }}>{null}</Grid>);
    expect(varsOf(container.firstElementChild as HTMLElement)).toEqual({
      mobile: '1',
      tablet: '1',
      desktop: '4',
    });
  });

  it('con un mapa completo usa el valor de cada breakpoint', () => {
    const { container } = render(
      <Grid columns={{ mobile: 1, tablet: 3, desktop: 6 }}>{null}</Grid>,
    );
    expect(varsOf(container.firstElementChild as HTMLElement)).toEqual({
      mobile: '1',
      tablet: '3',
      desktop: '6',
    });
  });

  it('si se pasan columns y minItemWidth, gana columns', () => {
    const { container } = render(
      <Grid columns={2} minItemWidth="12rem">
        {null}
      </Grid>,
    );
    const element = container.firstElementChild as HTMLElement;
    expect(element.style.gridTemplateColumns).toBe('');
    expect(varsOf(element).desktop).toBe('2');
  });

  it('sin columns, minItemWidth sigue fijando la plantilla en línea', () => {
    const { container } = render(<Grid minItemWidth="12rem">{null}</Grid>);
    const element = container.firstElementChild as HTMLElement;
    expect(element.style.gridTemplateColumns).toContain('auto-fit');
    expect(varsOf(element).desktop).toBe('');
  });
});
