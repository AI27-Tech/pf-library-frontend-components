import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MessageBubble, MessageList } from './MessageList';
import { MessageComposer } from './MessageComposer';
import { MessageDockBar, type DockConversation } from './MessageDock';
import type { Mensaje } from './types';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

const mensajeBase: Mensaje = {
  id: 'm-1',
  conversacionId: 'c-1',
  secuenciaMensaje: 1,
  clientMessageId: '11111111-1111-4111-8111-111111111111',
  audienciaAutor: 'Interno',
  aliasMostrado: 'Central C4',
  cuerpo: 'Unidad entrando al corredor.',
  creadoEn: new Date().toISOString(),
  actorReal: '0b6f2c1e-3d1a-4f7e-9a55-2e7c1d9a8b10',
  rolAlEnviar: 'monitorista',
};

describe('MessageBubble con Mensaje', () => {
  it('muestra cuerpo, alias y fecha formateada del mensaje', () => {
    render(<MessageBubble mensaje={mensajeBase} />);
    expect(screen.getByText('Unidad entrando al corredor.')).toBeInTheDocument();
    expect(screen.getByText('Central C4')).toBeInTheDocument();
    expect(screen.getByText(/^Today /)).toBeInTheDocument();
  });

  it('no muestra el alias en un mensaje propio', () => {
    render(<MessageBubble mensaje={mensajeBase} own />);
    expect(screen.queryByText('Central C4')).not.toBeInTheDocument();
  });

  it('no expone actorReal ni rolAlEnviar sin slotAuditoria', () => {
    render(<MessageBubble mensaje={mensajeBase} />);
    expect(screen.queryByText(mensajeBase.actorReal!)).not.toBeInTheDocument();
    expect(screen.queryByText('monitorista')).not.toBeInTheDocument();
  });

  it('renderiza slotAuditoria solo cuando el consumidor lo pasa', () => {
    render(<MessageBubble mensaje={mensajeBase} slotAuditoria={<span>auditoria-visible</span>} />);
    expect(screen.getByText('auditoria-visible')).toBeInTheDocument();
  });

  it('no muestra fecha cuando creadoEn no es válida', () => {
    const { container } = render(<MessageBubble creadoEn="no-es-fecha">Hola</MessageBubble>);
    expect(container.textContent).not.toContain('NaN');
    expect(container.textContent).toBe('Hola');
  });

  it('sigue aceptando los alias deprecados author y time', () => {
    render(<MessageBubble author="Escolta 07" time="10:42">Recibido.</MessageBubble>);
    expect(screen.getByText('Escolta 07')).toBeInTheDocument();
    expect(screen.getByText('10:42')).toBeInTheDocument();
  });
});

describe('MessageList', () => {
  it('muestra el control de historia anterior cuando hay_mas es verdadero', async () => {
    const onCargar = vi.fn();
    render(<MessageList hayMas onCargarAnteriores={onCargar}>{null}</MessageList>);
    await userEvent.click(screen.getByRole('button', { name: 'Cargar mensajes anteriores' }));
    expect(onCargar).toHaveBeenCalledTimes(1);
  });

  it('no muestra el control cuando hay_mas es falso', () => {
    render(<MessageList hayMas={false} onCargarAnteriores={() => {}}>{null}</MessageList>);
    expect(screen.queryByRole('button', { name: 'Cargar mensajes anteriores' })).not.toBeInTheDocument();
  });
});

describe('MessageComposer', () => {
  it('envía el cuerpo recortado con un clientMessageId UUID', async () => {
    const onSend = vi.fn();
    render(<MessageComposer value="  Hola  " onChange={() => {}} onSend={onSend} />);
    await userEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }));
    expect(onSend).toHaveBeenCalledTimes(1);
    const envio = onSend.mock.calls[0][0];
    expect(envio.cuerpo).toBe('Hola');
    expect(envio.clientMessageId).toMatch(UUID);
  });

  it('genera un clientMessageId distinto en cada envío', async () => {
    const onSend = vi.fn();
    render(<MessageComposer value="Hola" onChange={() => {}} onSend={onSend} />);
    const boton = screen.getByRole('button', { name: 'Enviar mensaje' });
    await userEvent.click(boton);
    await userEvent.click(boton);
    expect(onSend.mock.calls[0][0].clientMessageId).not.toBe(onSend.mock.calls[1][0].clientMessageId);
  });

  it('no envía un cuerpo vacío ni solo espacios', async () => {
    const onSend = vi.fn();
    render(<MessageComposer value="   " onChange={() => {}} onSend={onSend} />);
    expect(screen.getByRole('button', { name: 'Enviar mensaje' })).toBeDisabled();
    await userEvent.click(screen.getByRole('textbox', { name: 'Mensaje' }));
    await userEvent.keyboard('{Enter}');
    expect(onSend).not.toHaveBeenCalled();
  });

  it('en solo_lectura deshabilita el campo y muestra el texto de estado', () => {
    render(
      <MessageComposer
        value="borrador"
        onChange={() => {}}
        onSend={() => {}}
        estadoConversacion="solo_lectura"
      />,
    );
    const campo = screen.getByRole('textbox', { name: 'Mensaje' });
    expect(campo).toBeDisabled();
    expect(campo).toHaveAttribute('placeholder', 'Conversación en solo lectura');
    expect(screen.getByRole('button', { name: 'Enviar mensaje' })).toBeDisabled();
  });

  it('en cerrada también deshabilita el envío', () => {
    render(<MessageComposer value="Hola" onChange={() => {}} onSend={() => {}} estadoConversacion="cerrada" />);
    expect(screen.getByRole('textbox', { name: 'Mensaje' })).toBeDisabled();
  });
});

describe('MessageDockBar', () => {
  it('llama onSelect con conversacionId cuando existe, y con id si no', async () => {
    const onSelect = vi.fn();
    const conversaciones: DockConversation[] = [
      { id: 'fila-1', conversacionId: 'conv-abc', name: 'Central C4' },
      { id: 'fila-2', name: 'Escolta 07' },
    ];
    render(
      <MessageDockBar open conversations={conversaciones} onSelect={onSelect} />,
    );
    await userEvent.click(screen.getByRole('button', { name: /Central C4/ }));
    await userEvent.click(screen.getByRole('button', { name: /Escolta 07/ }));
    expect(onSelect.mock.calls.map((c) => c[0])).toEqual(['conv-abc', 'fila-2']);
  });
});
