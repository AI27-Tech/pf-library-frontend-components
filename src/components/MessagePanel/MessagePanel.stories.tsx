import { useEffect, useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ConversationStatus } from "./ConversationStatus";
import { MessageAttachment } from "./MessageAttachment";
import { MessageComposer } from "./MessageComposer";
import { MessageDock, MessageDockBar, type DockConversation } from "./MessageDock";
import { MessagePanel } from "./MessagePanel";
import { MessageThread } from "./MessageThread";
import { useMessageDock } from "./useMessageDock";
import type { EstadoConversacion, Mensaje, MensajePendiente } from "./types";
import { generarClientMessageId } from "./utils";

const meta = {
  title: "Components/MessagePanel",
  component: MessagePanel,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { name: "Central C4" },
} satisfies Meta<typeof MessagePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Actor del visor en las historias. Los mensajes con este `actorReal` se muestran propios. */
const VISOR = "ejecutivo-ana";

const hace = (minutos: number) => new Date(Date.now() - minutos * 60_000).toISOString();

function mensaje(
  secuencia: number,
  cuerpo: string,
  minutos: number,
  extra: Partial<Mensaje> = {},
): Mensaje {
  return {
    id: `m-${secuencia}`,
    conversacionId: "conv-1",
    secuencia,
    clientMessageId: `cmid-${secuencia}`,
    audienciaAutor: "Interno",
    aliasMostrado: "Central C4",
    cuerpo,
    creadoEn: hace(minutos),
    actorReal: "otro-operador",
    ...extra,
  };
}

const propio = (secuencia: number, cuerpo: string, minutos: number): Mensaje =>
  mensaje(secuencia, cuerpo, minutos, { actorReal: VISOR, aliasMostrado: "Yo", rolAlEnviar: "ejecutivo" });

const isOwn = (m: Mensaje) => m.actorReal === VISOR;

const hilo: Mensaje[] = [
  mensaje(1, "Unidad TTR-8821 entrando a Arco Norte.", 42, { aliasMostrado: "Central C4", audienciaAutor: "Cliente" }),
  mensaje(2, "Confirmado, escolta enlazada.", 41),
  mensaje(3, "Llegamos a la caseta 3.", 12),
  propio(4, "Recibido. Sigue el enlace.", 11),
  propio(5, "Cualquier cambio avísame.", 10),
  propio(6, "Ok, gracias.", 2),
];

/** Estado mínimo para que la conversación de demo responda a los envíos. */
function useConversacion(inicial: Mensaje[]) {
  const [mensajes, setMensajes] = useState(inicial);
  const enviar = (cuerpo: string) => {
    setMensajes((prev) => [
      ...prev,
      propio(prev.length + 1, cuerpo, 0),
    ]);
  };
  return { mensajes, enviar };
}

function Compositor({
  onSend,
  estado = "abierta",
  sending = false,
  maxLength,
  onAttach,
}: {
  onSend: (cuerpo: string) => void;
  estado?: EstadoConversacion;
  sending?: boolean;
  maxLength?: number;
  onAttach?: () => void;
}) {
  const [borrador, setBorrador] = useState("");
  return (
    <MessageComposer
      value={borrador}
      onChange={setBorrador}
      onSend={(envio) => {
        onSend(envio.cuerpo);
        setBorrador("");
      }}
      estadoConversacion={estado}
      sending={sending}
      maxLength={maxLength}
      onAttach={onAttach}
    />
  );
}

/** Panel con hilo y compositor funcionales, sin estado externo. */
function PanelDemo(props: Partial<ComponentProps<typeof MessagePanel>> & { inicial?: Mensaje[]; estado?: EstadoConversacion }) {
  const { inicial = hilo, estado = "abierta", ...resto } = props;
  const { mensajes, enviar } = useConversacion(inicial);
  return (
    <MessagePanel
      name="Central C4"
      subtitle="Viaje 1042"
      avatar={{ name: "Central C4" }}
      presence="online"
      {...resto}
      composer={
        <Compositor onSend={enviar} estado={estado} maxLength={500} />
      }
    >
      <MessageThread mensajes={mensajes} isOwn={isOwn} ultimaSecuenciaLeida={4} />
    </MessagePanel>
  );
}

/** Panel expandido con el hilo completo. */
export const Abierto: Story = {
  render: () => (
    <div style={{ position: "fixed", right: 16, bottom: 0 }}>
      <PanelDemo />
    </div>
  ),
};

/** Minimizado: solo queda la barra de encabezado. */
export const Minimizado: Story = {
  render: () => (
    <div style={{ position: "fixed", right: 16, bottom: 0 }}>
      <PanelDemo defaultOpen={false} />
    </div>
  ),
};

/** Controlado: el estado `open` lo guarda el consumidor. */
export const Controlado: Story = {
  render: () => {
    const [abierto, setAbierto] = useState(true);
    return (
      <div style={{ position: "fixed", right: 16, bottom: 0, display: "grid", gap: 8 }}>
        <button type="button" onClick={() => setAbierto((v) => !v)}>
          Cambiar desde fuera ({abierto ? "abierto" : "minimizado"})
        </button>
        <PanelDemo open={abierto} onOpenChange={setAbierto} />
      </div>
    );
  },
};

/** Barra de herramientas y aviso de estado, con `toolbar` y `notice`. */
export const ConToolbarYAviso: Story = {
  render: () => (
    <div style={{ position: "fixed", right: 16, bottom: 0 }}>
      <PanelDemo
        toolbar={<button type="button">Reclamar</button>}
        notice={<span>Otro ejecutivo tiene el reclamo. Espera a que lo libere.</span>}
      />
    </div>
  ),
};

/** Sin permiso de escritura: el campo queda deshabilitado con el texto de solo lectura. */
export const SoloLectura: Story = {
  render: () => (
    <div style={{ position: "fixed", right: 16, bottom: 0 }}>
      <PanelDemo
        estado="solo_lectura"
        toolbar={<ConversationStatus estado="solo_lectura" reclamadaPor="Ana Ruiz" />}
      />
    </div>
  ),
};

/** Conversación cerrada: lectura sin escritura. */
export const Cerrada: Story = {
  render: () => (
    <div style={{ position: "fixed", right: 16, bottom: 0 }}>
      <PanelDemo
        estado="cerrada"
        toolbar={<ConversationStatus estado="cerrada" reclamadaPor={null} atendida />}
      />
    </div>
  ),
};

/** Carga inicial: esqueletos en lugar del hilo. */
export const Cargando: Story = {
  render: () => (
    <div style={{ position: "fixed", right: 16, bottom: 0 }}>
      <MessagePanel name="Central C4">
        <MessageThread mensajes={[]} isOwn={isOwn} loading />
      </MessagePanel>
    </div>
  ),
};

/** Sin mensajes: texto de lista vacía por defecto. */
export const Vacio: Story = {
  render: () => (
    <div style={{ position: "fixed", right: 16, bottom: 0 }}>
      <MessagePanel name="Central C4">
        <MessageThread mensajes={[]} isOwn={isOwn} />
      </MessagePanel>
    </div>
  ),
};

/** Envíos en curso y fallidos, con reintento. */
export const MensajesFallidosYEnviando: Story = {
  render: () => {
    const pendientes: MensajePendiente[] = [
      { clientMessageId: generarClientMessageId(), cuerpo: "Revisa la caseta 4", creadoEn: hace(0), deliveryStatus: "sending" },
      {
        clientMessageId: generarClientMessageId(),
        cuerpo: "Confirma la hora de salida",
        creadoEn: hace(0),
        deliveryStatus: "failed",
        deliveryError: "Sin conexión",
        onRetry: () => undefined,
      },
    ];
    return (
      <div style={{ position: "fixed", right: 16, bottom: 0 }}>
        <MessagePanel name="Central C4" composer={<Compositor onSend={() => undefined} sending />}>
          <MessageThread mensajes={hilo} isOwn={isOwn} pendientes={pendientes} />
        </MessagePanel>
      </div>
    );
  },
};

/** Adjuntos con los tres estados: listo, subiendo y con error. */
export const ConAdjuntos: Story = {
  render: () => {
    const adjuntos: Mensaje[] = [
      propio(1, "Manifiesto de carga adjunto.", 5),
      mensaje(2, "Foto del sello.", 4, { actorReal: "otro-operador" }),
    ];
    return (
      <div style={{ position: "fixed", right: 16, bottom: 0 }}>
        <MessagePanel name="Central C4" composer={<Compositor onSend={() => undefined} />}>
          <MessageThread
            mensajes={adjuntos}
            isOwn={isOwn}
            renderAttachments={(m) =>
              m.secuencia === 1 ? (
                <MessageAttachment nombre="manifiesto-carga.pdf" tamano={248_000} tipoMedio="application/pdf" onOpen={() => undefined} />
              ) : (
                <>
                  <MessageAttachment nombre="sello.jpg" tamano={1_400_000} tipoMedio="image/jpeg" estado="uploading" />
                  <MessageAttachment nombre="video.mp4" tamano={52_000_000} tipoMedio="video/mp4" estado="error" />
                </>
              )
            }
          />
        </MessagePanel>
      </div>
    );
  },
};

/** Auditoría por mensaje, visible solo cuando el consumidor la pasa. */
export const ConAuditoria: Story = {
  render: () => (
    <div style={{ position: "fixed", right: 16, bottom: 0 }}>
      <MessagePanel name="Central C4">
        <MessageThread
          mensajes={hilo}
          isOwn={isOwn}
          renderAudit={(m) => (m.rolAlEnviar ? `${m.rolAlEnviar} · ${m.actorReal}` : null)}
        />
      </MessagePanel>
    </div>
  ),
};

/** Ancho angosto: el panel ocupa lo que haya disponible. */
export const VistaAngosta: Story = {
  render: () => (
    <div style={{ width: 340, height: 520, position: "fixed", right: 0, bottom: 0 }}>
      <PanelDemo />
    </div>
  ),
};

/* ── Muelle ─────────────────────────────────────────────────────────────── */

const conversacionesDemo = [
  "Central C4",
  "Despacho Bajío",
  "Escolta 07",
  "Escolta 12",
  "Operación Norte",
  "Cliente Logística",
];

function MuelleDemo({ total, capacidad = 3 }: { total: number; capacidad?: number }) {
  const nombres = conversacionesDemo.slice(0, total);
  const dock = useMessageDock({ maxPanels: capacidad });
  const [mensajes, setMensajes] = useState<Record<string, Mensaje[]>>(
    Object.fromEntries(nombres.map((n, i) => [`c${i}`, [mensaje(1, `Mensaje de prueba en ${n}`, 4 + i)]])),
  );

  // Al montar se abren todas, para que el muelle muestre el overflow.
  useEffect(() => {
    [...nombres.keys()].reverse().forEach((i) => dock.open(`c${i}`));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filas: DockConversation[] = nombres.map((n, i) => ({
    id: `c${i}`,
    name: n,
    preview: `Mensaje de prueba en ${n}`,
    lastMessageAt: hace(4 + i),
    unread: i < 2,
  }));

  const porId = (id: string) => nombres[Number(id.slice(1))];
  const panelesAbiertos = dock.panels.map((p) => ({ ...p, nombre: porId(p.id) }));
  const enOverflow = dock.overflow.map((id) => ({ id, nombre: porId(id) }));

  return (
    <div style={{ height: 520, padding: "1rem", color: "var(--ui-color-text-muted)" }}>
      Área de la app. Las conversaciones se anclan abajo a la derecha.
      <MessageDock
        overflowCount={enOverflow.length}
        overflow={enOverflow.map((c) => (
          <button key={c.id} type="button" onClick={() => dock.open(c.id)} style={{ padding: 8, textAlign: "left" }}>
            {c.nombre}
          </button>
        ))}
        bar={
          <MessageDockBar
            open={dock.barOpen}
            onToggle={dock.toggleBar}
            unreadCount={filas.filter((f) => f.unread).length}
            conversations={filas}
            onSelect={(id) => dock.open(id)}
          />
        }
      >
        {panelesAbiertos.map((p) => (
          <MessagePanel
            key={p.id}
            name={p.nombre}
            open={!p.minimized}
            onOpenChange={() => dock.toggle(p.id)}
            onClose={() => dock.close(p.id)}
            composer={
              <Compositor
                onSend={(cuerpo) =>
                  setMensajes((prev) => ({
                    ...prev,
                    [p.id]: [...(prev[p.id] ?? []), propio((prev[p.id]?.length ?? 0) + 1, cuerpo, 0)],
                  }))
                }
              />
            }
          >
            <MessageThread mensajes={mensajes[p.id] ?? []} isOwn={isOwn} />
          </MessagePanel>
        ))}
      </MessageDock>
    </div>
  );
}

/** Muelle con una conversación abierta. */
export const Muelle1: Story = {
  render: () => <MuelleDemo total={1} />,
};

/** Muelle con tres conversaciones, todas caben. */
export const Muelle3: Story = {
  render: () => <MuelleDemo total={3} />,
};

/** Muelle con seis conversaciones: tres visibles y el resto en el chip "+N". */
export const Muelle6: Story = {
  render: () => <MuelleDemo total={6} />,
};

/** Barra de mensajería con no leídos y vista previa, sin muelle. */
export const BarraConNoLeidos: Story = {
  render: () => {
    const conversaciones: DockConversation[] = [
      { id: "a", name: "Central C4", preview: "Confirmado, escolta enlazada.", lastMessageAt: hace(3), unread: true },
      { id: "b", name: "Despacho Bajío", preview: "¿Estatus de la ruta 12?", lastMessageAt: hace(70), unread: false },
    ];
    return (
      <div style={{ position: "fixed", right: 16, bottom: 0 }}>
        <MessageDockBar open unreadCount={1} conversations={conversaciones} />
      </div>
    );
  },
};
