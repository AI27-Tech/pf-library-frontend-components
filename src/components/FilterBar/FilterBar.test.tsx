import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterBar, type FilterDefinition } from './FilterBar';

const opciones = [
  { label: 'México', value: 'mx' },
  { label: 'Argentina', value: 'ar' },
];

describe('FilterBar', () => {
  it('usa el select por defecto cuando no se indica variante', () => {
    const filtros: FilterDefinition[] = [{ key: 'pais', label: 'País', options: opciones }];
    render(<FilterBar filters={filtros} />);
    expect(screen.getByRole('button', { name: 'Todos' })).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('muestra el select buscable cuando el filtro indica variante "searchable"', () => {
    const filtros: FilterDefinition[] = [
      { key: 'pais', label: 'País', options: opciones, variant: 'searchable' },
    ];
    render(<FilterBar filters={filtros} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('pasa searchPlaceholder al campo buscable', () => {
    const filtros: FilterDefinition[] = [
      {
        key: 'pais',
        label: 'País',
        options: opciones,
        variant: 'searchable',
        searchPlaceholder: 'Buscar país',
      },
    ];
    render(<FilterBar filters={filtros} />);
    expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', 'Buscar país');
  });

  it('emite onFilterChange con la clave y el valor al elegir en el buscable', async () => {
    const onFilterChange = vi.fn();
    const filtros: FilterDefinition[] = [
      { key: 'pais', label: 'País', options: opciones, variant: 'searchable' },
    ];
    render(<FilterBar filters={filtros} onFilterChange={onFilterChange} />);
    await userEvent.type(screen.getByRole('combobox'), 'arg');
    await userEvent.click(screen.getByRole('option', { name: 'Argentina' }));
    expect(onFilterChange).toHaveBeenCalledWith('pais', 'ar');
  });
});
