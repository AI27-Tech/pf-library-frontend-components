import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MessageBubble, MessageList } from './MessageList';
import { MessagePanel } from './MessagePanel';
import { MessageThread } from './MessageThread';
import { MessageComposer } from './MessageComposer';
import { MessageDockBar, type DockConversation } from './MessageDock';
import { ConversationStatus } from './ConversationStatus';
import type { Mensaje } from './types';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

/** Mensaje completo, con la forma del contrato `Mensaje` de v0.1.0-tracer.40. */
const mensajeBase: Mensaje = {
  id: 'm-1',
  conversacionId: 'c-1',
  secuencia: 1,
  clientMessageId: '11111111-1111-4111-8111-111111111111',
  audienciaAutor: 'Interno',
  aliasMostrado: 'Central C4',
  cuerpo: 'Unidad entrando al corredor.',
  creadoEn: new Date().toISOString(),
  actorReal: '0b6f2c1e-3d1a-4f7e-9a55-2e7c1d9a8b10',
  rolAlEnviar: 'monitorista',
};

function mensajeEn(secuencia: number, cuerpo: string, extra: Partial<Mensaje> = {}): Mensaje {
  return {
    ...mensajeBase,
    id: `m-${secuencia}`,
    secuencia,
    cuerpo,
    clientMessageId: `cmid-${secuencia}`,
    ...extra,
  };
}

describe('MessageBubble con Mensaje', () => {
  it('muestra cuerpo, alias y hora del mensaje', () => {
    render(<MessageBubble mensaje={mensajeBase} />);
    expect(screen.getByText('Unidad entrando al corredor.')).toBeInTheDocument();
    expect(screen.getByText('Central C4')).toBeInTheDocument();
    // La hora sale en es-MX (por ejemplo "10:40 a. m."), así que se valida solo el formato hh:mm.
    expect(screen.getByText(/\d{1,2}:\d{2}/)).toBeInTheDocument();
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

  it('en un envío fallido muestra el motivo y el botón de reintento solo si hay onRetry', async () => {
    const onRetry = vi.fn();
    const { rerender } = render(
      <MessageBubble own deliveryStatus="failed" deliveryError="Sin conexión" onRetry={onRetry}>
        Hola
      </MessageBubble>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('No se envió: Sin conexión');
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(onRetry).toHaveBeenCalledTimes(1);

    rerender(<MessageBubble own deliveryStatus="failed">Hola</MessageBubble>);
    expect(screen.queryByRole('button', { name: 'Reintentar' })).not.toBeInTheDocument();
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

  it('muestra el texto de lista vacía', () => {
    render(<MessageList empty>{null}</MessageList>);
    expect(screen.getByText('Aún no hay mensajes')).toBeInTheDocument();
  });

  it('expone el registro con role="log" y aria-live', () => {
    render(<MessageList>{null}</MessageList>);
    const log = screen.getByRole('log');
    expect(log).toHaveAttribute('aria-live', 'polite');
    expect(log).toHaveAttribute('aria-relevant', 'additions');
  });
});

describe('MessageThread', () => {
  const isOwn = (m: Mensaje) => m.audienciaAutor === 'Interno';

  it('ordena por secuencia aunque creadoEn llegue desordenado y descarta ids repetidos', () => {
    const mensajes = [
      mensajeEn(2, 'segundo', { creadoEn: '2026-11-06T10:00:00Z' }),
      mensajeEn(1, 'primero', { creadoEn: '2026-11-06T11:00:00Z' }),
      mensajeEn(2, 'segundo repetido', { creadoEn: '2026-11-06T10:00:00Z' }),
    ];
    const { container } = render(<MessageThread mensajes={mensajes} isOwn={isOwn} />);
    const textos = Array.from(container.querySelectorAll('[class*="bubbleBody"]')).map((el) => el.textContent);
    expect(textos).toEqual(['primero', 'segundo']);
  });

  it('un pendiente se quita cuando llega el mensaje con su clientMessageId', () => {
    const pendiente = {
      clientMessageId: 'cmid-2',
      cuerpo: 'enviando esto',
      creadoEn: new Date().toISOString(),
      deliveryStatus: 'sending' as const,
    };
    const { rerender } = render(<MessageThread mensajes={[mensajeEn(1, 'hola')]} isOwn={isOwn} pendientes={[pendiente]} />);
    expect(screen.getByText('enviando esto')).toBeInTheDocument();

    rerender(
      <MessageThread
        mensajes={[mensajeEn(1, 'hola'), mensajeEn(2, 'enviando esto', { clientMessageId: 'cmid-2' })]}
        isOwn={isOwn}
        pendientes={[pendiente]}
      />,
    );
    expect(screen.getAllByText('enviando esto')).toHaveLength(1);
  });

  it('marca los mensajes posteriores a la última secuencia leída con "Mensajes nuevos"', () => {
    render(
      <MessageThread
        mensajes={[mensajeEn(1, 'leido'), mensajeEn(2, 'nuevo')]}
        isOwn={isOwn}
        ultimaSecuenciaLeida={1}
      />,
    );
    expect(screen.getByText('Mensajes nuevos')).toBeInTheDocument();
  });

  it('muestra el estado vacío cuando no hay mensajes ni pendientes', () => {
    render(<MessageThread mensajes={[]} isOwn={isOwn} emptyState={<p>Nada aún</p>} />);
    expect(screen.getByText('Nada aún')).toBeInTheDocument();
  });
});

describe('MessagePanel', () => {
  it('el encabezado no tiene botones anidados', () => {
    const { container } = render(<MessagePanel name="Central C4" onClose={() => {}} />);
    expect(container.querySelector('button button')).toBeNull();
  });

  it('minimiza y expande sin estado externo', async () => {
    const { container } = render(<MessagePanel name="Central C4">Contenido</MessagePanel>);
    const cuerpo = container.querySelector('[data-open]');
    expect(cuerpo).toHaveAttribute('data-open', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'Minimizar' }));
    expect(cuerpo).toHaveAttribute('data-open', 'false');
    await userEvent.click(screen.getByRole('button', { name: 'Expandir' }));
    expect(cuerpo).toHaveAttribute('data-open', 'true');
  });

  it('en modo controlado notifica el cambio y no cambia por su cuenta', async () => {
    const onOpenChange = vi.fn();
    render(<MessagePanel name="Central C4" open={false} onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Expandir' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('button', { name: 'Expandir' })).toBeInTheDocument();
  });

  it('con keepMounted en false desmonta el contenido al minimizar', async () => {
    render(<MessagePanel name="Central C4" keepMounted={false}>Contenido oculto</MessagePanel>);
    await userEvent.click(screen.getByRole('button', { name: 'Minimizar' }));
    expect(screen.queryByText('Contenido oculto')).not.toBeInTheDocument();
  });

  it('al expandir por el usuario, el foco va al primer campo de texto', async () => {
    render(
      <MessagePanel name="Central C4" defaultOpen={false} composer={<MessageComposer value="" onChange={() => {}} onSend={() => {}} />} />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Expandir' }));
    expect(screen.getByRole('textbox', { name: 'Mensaje' })).toHaveFocus();
  });

  it('muestra la barra de herramientas y el aviso cuando se pasan', () => {
    render(<MessagePanel name="Central C4" toolbar={<span>Reclamar</span>} notice={<span>Conflicto de versión</span>} />);
    expect(screen.getByText('Reclamar')).toBeInTheDocument();
    expect(screen.getByText('Conflicto de versión')).toBeInTheDocument();
  });
});

describe('ConversationStatus', () => {
  it('muestra "En el pool" cuando no hay responsable', () => {
    render(<ConversationStatus estado="abierta" reclamadaPor={null} />);
    expect(screen.getByText('En el pool')).toBeInTheDocument();
  });

  it('prioriza "Reclamada por ti" sobre el nombre', () => {
    render(<ConversationStatus estado="abierta" reclamadaPor="Ana" reclamoPropio />);
    expect(screen.getByText('Reclamada por ti')).toBeInTheDocument();
    expect(screen.queryByText('Reclamada por Ana')).not.toBeInTheDocument();
  });

  it('no muestra responsable cuando no hay datos de reclamo (vista del cliente)', () => {
    render(<ConversationStatus estado="abierta" />);
    expect(screen.queryByText(/Reclamada|En el pool/)).not.toBeInTheDocument();
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

  it('no envía con Enter mientras el IME está componiendo', () => {
    const onSend = vi.fn();
    render(<MessageComposer value="nihao" onChange={() => {}} onSend={onSend} />);
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Mensaje' }), { key: 'Enter', isComposing: true });
    expect(onSend).not.toHaveBeenCalled();
  });

  it('en solo_lectura deshabilita el campo y muestra el texto de estado', () => {
    render(
      <MessageComposer value="borrador" onChange={() => {}} onSend={() => {}} estadoConversacion="solo_lectura" />,
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

  it('con sending bloquea el envío para evitar doble envío', async () => {
    const onSend = vi.fn();
    render(<MessageComposer value="Hola" onChange={() => {}} onSend={onSend} sending />);
    expect(screen.getByRole('button', { name: 'Enviar mensaje' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'Mensaje' })).toBeDisabled();
    expect(onSend).not.toHaveBeenCalled();
  });

  it('muestra el contador desde el 80 % del máximo', () => {
    render(<MessageComposer value="abcdefghij" onChange={() => {}} onSend={() => {}} maxLength={12} />);
    expect(screen.getByText('10 / 12')).toBeInTheDocument();
  });
});

describe('MessageDockBar', () => {
  it('llama onSelect con conversacionId cuando existe, y con id si no', async () => {
    const onSelect = vi.fn();
    const conversaciones: DockConversation[] = [
      { id: 'fila-1', conversacionId: 'conv-abc', name: 'Central C4' },
      { id: 'fila-2', name: 'Escolta 07' },
    ];
    render(<MessageDockBar open conversations={conversaciones} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: /Central C4/ }));
    await userEvent.click(screen.getByRole('button', { name: /Escolta 07/ }));
    expect(onSelect.mock.calls.map((c) => c[0])).toEqual(['conv-abc', 'fila-2']);
  });

  it('el encabezado no tiene botones anidados', () => {
    const { container } = render(<MessageDockBar unreadCount={2} />);
    expect(container.querySelector('button button')).toBeNull();
  });
});
