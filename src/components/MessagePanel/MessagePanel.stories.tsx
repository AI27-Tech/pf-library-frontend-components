import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MessagePanel } from "./MessagePanel";
import { MessageDock, MessageDockBar, type DockConversation } from "./MessageDock";
import { MessageList, MessageBubble, MessageDayDivider } from "./MessageList";
import { MessageComposer } from "./MessageComposer";
import type { AudienciaAutor, EstadoConversacion, Mensaje } from "./types";
import { generarClientMessageId } from "./utils";

const meta = {
  title: "Components/MessagePanel",
  component: MessagePanel,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof MessagePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Audiencia del visor en las historias. Los mensajes con esta audiencia se muestran propios. */
const VISOR_INTERNO: AudienciaAutor = "Interno";

interface Conversacion {
  id: string;
  nombre: string;
  online: boolean;
  estado: EstadoConversacion;
  mensajes: Mensaje[];
}

function mensaje(
  conversacionId: string,
  secuenciaMensaje: number,
  audienciaAutor: AudienciaAutor,
  aliasMostrado: string,
  cuerpo: string,
  creadoEn: string,
  extra: Partial<Mensaje> = {},
): Mensaje {
  return {
    id: `${conversacionId}-${secuenciaMensaje}`,
    conversacionId,
    secuenciaMensaje,
    clientMessageId: generarClientMessageId(),
    audienciaAutor,
    aliasMostrado,
    cuerpo,
    creadoEn,
    ...extra,
  };
}

const conversacionesIniciales: Conversacion[] = [
  {
    id: "c4",
    nombre: "Central C4",
    online: true,
    estado: "abierta",
    mensajes: [
      mensaje("c4", 1, "Cliente", "Central C4", "Unidad TTR-8821 entrando a Arco Norte.", "2026-11-06T10:40:00-06:00"),
      mensaje("c4", 2, "Interno", "Yo", "Confirmado, escolta enlazada.", "2026-11-06T10:41:00-06:00", {
        actorReal: "0b6f2c1e-3d1a-4f7e-9a55-2e7c1d9a8b10",
        rolAlEnviar: "monitorista",
      }),
    ],
  },
  {
    id: "dispatch",
    nombre: "Despacho Bajío",
    online: false,
    estado: "abierta",
    mensajes: [
      mensaje("dispatch", 1, "Cliente", "Despacho Bajío", "¿Estatus de la ruta 12?", "2026-11-06T09:15:00-06:00"),
    ],
  },
  {
    id: "escort",
    nombre: "Escolta 07",
    online: true,
    estado: "solo_lectura",
    mensajes: [
      mensaje("escort", 1, "Cliente", "Escolta 07", "En posición.", "2026-11-06T08:02:00-06:00"),
    ],
  },
];

/** Muelle de conversación múltiple estilo LinkedIn completo, totalmente controlado. */
export const MultiConversation: Story = {
  args: { name: "" },
  render: () => {
    const [conversaciones, setConversaciones] = useState(conversacionesIniciales);
    const [barAbierta, setBarAbierta] = useState(true);
    // Paneles abiertos: id -> ¿expandido?
    const [panelesAbiertos, setPanelesAbiertos] = useState<Record<string, boolean>>({ c4: true });
    const [borradores, setBorradores] = useState<Record<string, string>>({});

    const abrirConversacion = (id: string) => {
      setPanelesAbiertos((prev) => ({ ...prev, [id]: true }));
    };
    const alternarPanel = (id: string) => {
      setPanelesAbiertos((prev) => ({ ...prev, [id]: !prev[id] }));
    };
    const cerrarPanel = (id: string) => {
      setPanelesAbiertos((prev) => {
        const siguiente = { ...prev };
        delete siguiente[id];
        return siguiente;
      });
    };

    const enviar = (id: string, cuerpo: string) => {
      setConversaciones((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c;
          const secuencia = c.mensajes.length + 1;
          return {
            ...c,
            mensajes: [
              ...c.mensajes,
              mensaje(c.id, secuencia, VISOR_INTERNO, "Yo", cuerpo, new Date().toISOString()),
            ],
          };
        }),
      );
      setBorradores((prev) => ({ ...prev, [id]: "" }));
    };

    const conversacionesDock: DockConversation[] = conversaciones.map((c) => ({
      id: c.id,
      conversacionId: c.id,
      name: c.nombre,
      preview: c.mensajes[c.mensajes.length - 1]?.cuerpo,
      avatar: { name: c.nombre },
      unread: false,
    }));

    return (
      <div style={{ height: 520, padding: "1rem", color: "var(--ui-color-text-muted)" }}>
        Área de la app. Las conversaciones se anclan abajo a la derecha.

        <MessageDock
          bar={
            <MessageDockBar
              title="Mensajería"
              open={barAbierta}
              onToggle={() => setBarAbierta((v) => !v)}
              unreadCount={2}
              conversations={conversacionesDock}
              onSelect={abrirConversacion}
            />
          }
        >
          {conversaciones
            .filter((c) => c.id in panelesAbiertos)
            .map((c) => {
              const abierto = panelesAbiertos[c.id];
              const ultimo = c.mensajes[c.mensajes.length - 1];
              return (
                <MessagePanel
                  key={c.id}
                  name={c.nombre}
                  subtitle={c.online ? "Activo ahora" : "Desconectado"}
                  avatar={{ name: c.nombre }}
                  presence={c.online ? "online" : "offline"}
                  open={abierto}
                  onToggle={() => alternarPanel(c.id)}
                  onClose={() => cerrarPanel(c.id)}
                  composer={
                    <MessageComposer
                      value={borradores[c.id] ?? ""}
                      onChange={(v) => setBorradores((prev) => ({ ...prev, [c.id]: v }))}
                      onSend={(envio) => enviar(c.id, envio.cuerpo)}
                      placeholder="Escribe un mensaje…"
                      estadoConversacion={c.estado}
                    />
                  }
                >
                  <MessageList ultimaSecuencia={ultimo?.secuenciaMensaje}>
                    <MessageDayDivider>Hoy</MessageDayDivider>
                    {c.mensajes.map((m) => (
                      <MessageBubble
                        key={m.id}
                        mensaje={m}
                        own={m.audienciaAutor === VISOR_INTERNO}
                        avatar={m.audienciaAutor === VISOR_INTERNO ? undefined : { name: m.aliasMostrado }}
                      />
                    ))}
                  </MessageList>
                </MessagePanel>
              );
            })}
        </MessageDock>
      </div>
    );
  },
};

/** Un único panel de conversación, en línea (no acoplado). */
export const SinglePanel: Story = {
  args: { name: "" },
  render: () => {
    const [abierto, setAbierto] = useState(true);
    const [borrador, setBorrador] = useState("");
    const mensajes: Mensaje[] = [
      mensaje("c4", 1, "Cliente", "Central C4", "Unidad entrando al corredor.", "2026-11-06T10:40:00-06:00"),
      mensaje("c4", 2, "Interno", "Yo", "Recibido.", "2026-11-06T10:41:00-06:00"),
    ];
    return (
      <div style={{ height: 480, display: "flex", alignItems: "flex-end", padding: "1rem" }}>
        <MessagePanel
          name="Central C4"
          subtitle="Activo ahora"
          avatar={{ name: "Central C4" }}
          presence="online"
          open={abierto}
          onToggle={() => setAbierto((v) => !v)}
          onClose={() => setAbierto(false)}
          composer={
            <MessageComposer
              value={borrador}
              onChange={setBorrador}
              onSend={() => setBorrador("")}
            />
          }
        >
          <MessageList ultimaSecuencia={mensajes[mensajes.length - 1].secuenciaMensaje}>
            {mensajes.map((m) => (
              <MessageBubble
                key={m.id}
                mensaje={m}
                own={m.audienciaAutor === VISOR_INTERNO}
                avatar={m.audienciaAutor === VISOR_INTERNO ? undefined : { name: m.aliasMostrado }}
              />
            ))}
          </MessageList>
        </MessagePanel>
      </div>
    );
  },
};

/** Vista de cliente: el visor es `Cliente`. Los mensajes de la operación se muestran sin campos internos. */
export const VistaCliente: Story = {
  args: { name: "" },
  render: () => {
    const mensajes: Mensaje[] = [
      mensaje("c4", 1, "Interno", "Coordinación AI27", "Su unidad salió de planta.", "2026-11-06T10:40:00-06:00", {
        actorReal: "0b6f2c1e-3d1a-4f7e-9a55-2e7c1d9a8b10",
        rolAlEnviar: "monitorista",
      }),
      mensaje("c4", 2, "Cliente", "Cliente", "Gracias.", "2026-11-06T10:41:00-06:00"),
    ];
    return (
      <div style={{ height: 480, display: "flex", alignItems: "flex-end", padding: "1rem" }}>
        <MessagePanel name="Coordinación AI27" subtitle="Servicio TTR-8821" open>
          <MessageList ultimaSecuencia={mensajes[mensajes.length - 1].secuenciaMensaje}>
            {mensajes.map((m) => (
              <MessageBubble key={m.id} mensaje={m} own={m.audienciaAutor === "Cliente"} />
            ))}
          </MessageList>
        </MessagePanel>
      </div>
    );
  },
};

/** Vista interna con el slot de auditoría: muestra actor real y rol solo porque la historia lo pide. */
export const VistaInternaConAuditoria: Story = {
  args: { name: "" },
  render: () => {
    const mensajes: Mensaje[] = [
      mensaje("c4", 1, "Interno", "Yo", "Confirmado.", "2026-11-06T10:41:00-06:00", {
        actorReal: "0b6f2c1e-3d1a-4f7e-9a55-2e7c1d9a8b10",
        rolAlEnviar: "monitorista",
      }),
    ];
    return (
      <div style={{ height: 480, display: "flex", alignItems: "flex-end", padding: "1rem" }}>
        <MessagePanel name="Central C4" open>
          <MessageList ultimaSecuencia={mensajes[0].secuenciaMensaje}>
            {mensajes.map((m) => (
              <MessageBubble
                key={m.id}
                mensaje={m}
                own
                slotAuditoria={
                  <span style={{ fontSize: "0.75rem" }}>
                    {m.actorReal} · {m.rolAlEnviar}
                  </span>
                }
              />
            ))}
          </MessageList>
        </MessagePanel>
      </div>
    );
  },
};

/** Conversación en solo lectura: el compositor no acepta texto ni envío. */
export const SoloLectura: Story = {
  args: { name: "" },
  render: () => {
    const mensajes: Mensaje[] = [
      mensaje("escort", 1, "Cliente", "Escolta 07", "En posición.", "2026-11-06T08:02:00-06:00"),
    ];
    return (
      <div style={{ height: 480, display: "flex", alignItems: "flex-end", padding: "1rem" }}>
        <MessagePanel name="Escolta 07" open>
          <MessageList ultimaSecuencia={mensajes[0].secuenciaMensaje} hayMas onCargarAnteriores={() => {}}>
            {mensajes.map((m) => (
              <MessageBubble key={m.id} mensaje={m} />
            ))}
          </MessageList>
          <MessageComposer
            value=""
            onChange={() => {}}
            onSend={() => {}}
            estadoConversacion="solo_lectura"
            textoSoloLectura="Conversación en solo lectura"
          />
        </MessagePanel>
      </div>
    );
  },
};
