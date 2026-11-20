import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar, SidebarItem, SidebarTrigger } from './Sidebar';

// jsdom no tiene matchMedia: useBreakpoint devuelve "mobile", así que estas pruebas cubren el panel móvil.

function Ejemplo() {
  const [abierto, setAbierto] = useState(false);
  return (
    <>
      <SidebarTrigger open={abierto} onClick={() => setAbierto(true)} />
      <Sidebar mobileOpen={abierto} onMobileOpenChange={setAbierto}>
        <SidebarItem>Viajes</SidebarItem>
        <SidebarItem>Unidades</SidebarItem>
      </Sidebar>
    </>
  );
}

describe('Sidebar en móvil', () => {
  it('SidebarTrigger refleja aria-expanded y tiene nombre accesible', async () => {
    render(<Ejemplo />);
    const disparador = screen.getByRole('button', { name: 'Abrir menú de navegación' });
    expect(disparador).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(disparador);
    expect(disparador).toHaveAttribute('aria-expanded', 'true');
  });

  it('muestra el fondo al abrir y lo quita al cerrar con Escape', async () => {
    render(<Ejemplo />);
    expect(document.querySelector('[data-sidebar-backdrop]')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Abrir menú de navegación' }));
    expect(document.querySelector('[data-sidebar-backdrop]')).not.toBeNull();
    await userEvent.keyboard('{Escape}');
    expect(document.querySelector('[data-sidebar-backdrop]')).toBeNull();
  });

  it('cierra al hacer clic en el fondo', async () => {
    render(<Ejemplo />);
    await userEvent.click(screen.getByRole('button', { name: 'Abrir menú de navegación' }));
    const fondo = document.querySelector('[data-sidebar-backdrop]') as HTMLElement;
    await userEvent.click(fondo);
    expect(document.querySelector('[data-sidebar-backdrop]')).toBeNull();
  });

  it('cierra al elegir un elemento y conserva su onClick', async () => {
    const elegido: string[] = [];
    function ConClic() {
      const [abierto, setAbierto] = useState(true);
      return (
        <Sidebar mobileOpen={abierto} onMobileOpenChange={setAbierto}>
          <SidebarItem onClick={() => elegido.push('viajes')}>Viajes</SidebarItem>
        </Sidebar>
      );
    }
    render(<ConClic />);
    await userEvent.click(screen.getByRole('button', { name: 'Viajes' }));
    expect(elegido).toEqual(['viajes']);
    expect(document.querySelector('[data-sidebar-backdrop]')).toBeNull();
  });

  it('devuelve el foco al disparador al cerrar', async () => {
    render(<Ejemplo />);
    const disparador = screen.getByRole('button', { name: 'Abrir menú de navegación' });
    await userEvent.click(disparador);
    await userEvent.keyboard('{Escape}');
    expect(disparador).toHaveFocus();
  });
});

describe('Sidebar en tablet', () => {
  it('va contraída por defecto y el usuario la expande y contrae con su botón', async () => {
    const anterior = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query === '(min-width: 40rem)',
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as unknown as typeof window.matchMedia;
    try {
      const { container } = render(
        <Sidebar>
          <SidebarItem label="Viajes">Viajes</SidebarItem>
        </Sidebar>,
      );
      const barra = container.querySelector('nav') as HTMLElement;
      expect(barra).toHaveAttribute('data-collapsed', 'true');
      await userEvent.click(screen.getByRole('button', { name: 'Expandir barra lateral' }));
      expect(barra).not.toHaveAttribute('data-collapsed');
      await userEvent.click(screen.getByRole('button', { name: 'Contraer barra lateral' }));
      expect(barra).toHaveAttribute('data-collapsed', 'true');
    } finally {
      window.matchMedia = anterior;
    }
  });
});