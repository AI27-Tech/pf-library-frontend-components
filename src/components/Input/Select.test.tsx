import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select, type SelectOption } from './Select';
import { filterOptions, normalizeText } from './filterOptions';

const paises: SelectOption[] = [
  { label: 'México', value: 'mx' },
  { label: 'Estados Unidos', value: 'us' },
  { label: 'España', value: 'es', disabled: true },
  { label: 'Argentina', value: 'ar' },
];

describe('filterOptions', () => {
  it('devuelve todas las opciones cuando el texto está vacío', () => {
    expect(filterOptions(paises, '  ')).toHaveLength(4);
  });

  it('coincide sin distinguir mayúsculas ni acentos', () => {
    expect(filterOptions(paises, 'MEXICO').map((o) => o.value)).toEqual(['mx']);
  });

  it('coincide por subcadena', () => {
    expect(filterOptions(paises, 'unidos').map((o) => o.value)).toEqual(['us']);
  });

  it('devuelve vacío cuando nada coincide', () => {
    expect(filterOptions(paises, 'zzz')).toEqual([]);
  });

  it('normalizeText quita acentos y pasa a minúsculas', () => {
    expect(normalizeText('Ñandú Ó')).toBe('nandu o');
  });
});

describe('Select (variante por defecto)', () => {
  it('no agrega roles de combobox ni campo de texto', () => {
    render(<Select options={paises} placeholder="Elige" />);
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Elige' })).toBeInTheDocument();
  });

  it('abre la lista y selecciona una opción con clic', async () => {
    const onChange = vi.fn();
    render(<Select options={paises} placeholder="Elige" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Elige' }));
    await userEvent.click(screen.getByRole('button', { name: 'Argentina' }));
    expect(onChange).toHaveBeenCalledWith('ar');
  });

  it('defaultValue con placeholder muestra el label de la opción por defecto', () => {
    render(<Select options={paises} defaultValue="mx" placeholder="Elige" />);
    expect(screen.getByRole('button', { name: 'México' })).toBeInTheDocument();
    expect(screen.queryByText('Elige')).not.toBeInTheDocument();
  });
});

describe('Select (variante buscable)', () => {
  it('expone un combobox con atributos ARIA del patrón listbox', async () => {
    render(<Select variant="searchable" options={paises} placeholder="Elige" />);
    const campo = screen.getByRole('combobox');
    expect(campo).toHaveAttribute('aria-expanded', 'false');
    expect(campo).toHaveAttribute('aria-autocomplete', 'list');

    await userEvent.click(campo);
    expect(campo).toHaveAttribute('aria-expanded', 'true');
    const lista = screen.getByRole('listbox');
    expect(campo).toHaveAttribute('aria-controls', lista.id);
  });

  it('filtra las opciones mientras el usuario escribe', async () => {
    render(<Select variant="searchable" options={paises} placeholder="Elige" />);
    await userEvent.type(screen.getByRole('combobox'), 'mex');
    const opciones = screen.getAllByRole('option');
    expect(opciones.map((o) => o.textContent)).toEqual(['México']);
  });

  it('muestra el texto de sin resultados sin permitir seleccionar', async () => {
    const onChange = vi.fn();
    render(
      <Select
        variant="searchable"
        options={paises}
        placeholder="Elige"
        noResultsText="Nada aquí"
        onChange={onChange}
      />,
    );
    await userEvent.type(screen.getByRole('combobox'), 'zzz');
    expect(screen.getByRole('status')).toHaveTextContent('Nada aquí');
    await userEvent.keyboard('{Enter}');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('selecciona con Enter sobre la opción resaltada', async () => {
    const onChange = vi.fn();
    render(<Select variant="searchable" options={paises} placeholder="Elige" onChange={onChange} />);
    await userEvent.type(screen.getByRole('combobox'), 'arg');
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('ar');
    expect(screen.getByRole('combobox')).toHaveValue('Argentina');
  });

  it('mueve el resaltado con flechas, sin dar la vuelta y omitiendo deshabilitadas', async () => {
    const onChange = vi.fn();
    render(<Select variant="searchable" options={paises} placeholder="Elige" onChange={onChange} />);
    const campo = screen.getByRole('combobox');
    await userEvent.click(campo);

    // Al abrir, la primera opción habilitada queda resaltada.
    const activoActual = () => document.getElementById(campo.getAttribute('aria-activedescendant')!);
    expect(activoActual()).toHaveTextContent('México');

    await userEvent.keyboard('{ArrowDown}');
    expect(activoActual()).toHaveTextContent('Estados Unidos');

    // España está deshabilitada: desde Estados Unidos la flecha salta a Argentina.
    await userEvent.keyboard('{ArrowDown}');
    expect(activoActual()).toHaveTextContent('Argentina');

    // Al llegar al final no da la vuelta.
    await userEvent.keyboard('{ArrowDown}');
    expect(document.getElementById(campo.getAttribute('aria-activedescendant')!)).toHaveTextContent('Argentina');

    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('ar');
  });

  it('Escape cierra la lista y restaura el valor vigente', async () => {
    render(<Select variant="searchable" options={paises} defaultValue="mx" placeholder="Elige" />);
    const campo = screen.getByRole('combobox');
    expect(campo).toHaveValue('México');

    await userEvent.clear(campo);
    await userEvent.type(campo, 'arg');
    await userEvent.keyboard('{Escape}');
    expect(campo).toHaveAttribute('aria-expanded', 'false');
    expect(campo).toHaveValue('México');
  });

  it('Tab cierra la lista y restaura el valor vigente sin cambiarlo', async () => {
    const onChange = vi.fn();
    render(<Select variant="searchable" options={paises} placeholder="Elige" onChange={onChange} />);
    await userEvent.type(screen.getByRole('combobox'), 'arg');
    await userEvent.tab();
    expect(screen.getByRole('combobox')).toHaveValue('');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('usa "Buscar..." como placeholder de búsqueda por defecto', () => {
    render(<Select variant="searchable" options={paises} />);
    expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', 'Buscar...');
  });

  it('modo controlado: muestra el label del valor recibido', () => {
    render(<Select variant="searchable" options={paises} value="us" onChange={() => {}} />);
    expect(screen.getByRole('combobox')).toHaveValue('Estados Unidos');
  });

  it('modo no controlado: conserva la selección interna', async () => {
    render(<Select variant="searchable" options={paises} placeholder="Elige" />);
    const campo = screen.getByRole('combobox');
    await userEvent.type(campo, 'mex');
    await userEvent.keyboard('{Enter}');
    expect(campo).toHaveValue('México');
  });

  it('marca aria-invalid cuando invalid es verdadero', () => {
    render(<Select variant="searchable" options={paises} invalid />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });
});
