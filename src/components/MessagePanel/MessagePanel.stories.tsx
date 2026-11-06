import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MessagePanel } from "./MessagePanel";
import { MessageDock, MessageDockBar, type DockConversation } from "./MessageDock";
import { MessageList, MessageBubble, MessageDayDivider } from "./MessageList";
import { MessageComposer } from "./MessageComposer";

const meta = {
  title: "Components/MessagePanel",
  component: MessagePanel,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof MessagePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

interface Msg {
  id: number;
  own: boolean;
  author: string;
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  avatarName: string;
  online: boolean;
  messages: Msg[];
}

const initialConversations: Conversation[] = [
  {
    id: "c4",
    name: "Central C4",
    avatarName: "Central C4",
    online: true,
    messages: [
      { id: 1, own: false, author: "Central C4", text: "Unidad TTR-8821 entrando a Arco Norte.", time: "10:40" },
      { id: 2, own: true, author: "Yo", text: "Confirmado, escolta enlazada.", time: "10:41" },
    ],
  },
  {
    id: "dispatch",
    name: "Despacho Bajío",
    avatarName: "Despacho Bajío",
    online: false,
    messages: [
      { id: 1, own: false, author: "Despacho Bajío", text: "¿Estatus de la ruta 12?", time: "09:15" },
    ],
  },
  {
    id: "escort",
    name: "Escolta 07",
    avatarName: "Escolta 07",
    online: true,
    messages: [
      { id: 1, own: false, author: "Escolta 07", text: "En posición.", time: "08:02" },
    ],
  },
];

/** Muelle de conversación múltiple estilo LinkedIn completo, totalmente controlado. */
export const MultiConversation: Story = {
  args: { name: "" },
  render: () => {
    const [conversations, setConversations] = useState(initialConversations);
    const [barOpen, setBarOpen] = useState(true);
    // Paneles abiertos: id -> ¿expandido?
    const [openPanels, setOpenPanels] = useState<Record<string, boolean>>({ c4: true });
    const [drafts, setDrafts] = useState<Record<string, string>>({});

    const openConversation = (id: string) => {
      setOpenPanels((prev) => ({ ...prev, [id]: true }));
    };
    const togglePanel = (id: string) => {
      setOpenPanels((prev) => ({ ...prev, [id]: !prev[id] }));
    };
    const closePanel = (id: string) => {
      setOpenPanels((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    };

    const send = (id: string) => {
      const text = (drafts[id] ?? "").trim();
      if (!text) return;
      setConversations((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  { id: c.messages.length + 1, own: true, author: "Yo", text, time: "now" },
                ],
              }
            : c,
        ),
      );
      setDrafts((prev) => ({ ...prev, [id]: "" }));
    };

    const dockConversations: DockConversation[] = conversations.map((c) => ({
      id: c.id,
      name: c.name,
      preview: c.messages[c.messages.length - 1]?.text,
      avatar: { name: c.avatarName },
      unread: false,
    }));

    return (
      <div style={{ height: 520, padding: "1rem", color: "var(--ui-color-text-muted)" }}>
        Área de la app. Las conversaciones se anclan abajo a la derecha.

        <MessageDock
          bar={
            <MessageDockBar
              title="Mensajería"
              open={barOpen}
              onToggle={() => setBarOpen((v) => !v)}
              unreadCount={2}
              conversations={dockConversations}
              onSelect={openConversation}
            />
          }
        >
          {conversations
            .filter((c) => c.id in openPanels)
            .map((c) => {
              const open = openPanels[c.id];
              return (
                <MessagePanel
                  key={c.id}
                  name={c.name}
                  subtitle={c.online ? "Activo ahora" : "Desconectado"}
                  avatar={{ name: c.avatarName }}
                  presence={c.online ? "online" : "offline"}
                  open={open}
                  onToggle={() => togglePanel(c.id)}
                  onClose={() => closePanel(c.id)}
                  composer={
                    <MessageComposer
                      value={drafts[c.id] ?? ""}
                      onChange={(v) => setDrafts((prev) => ({ ...prev, [c.id]: v }))}
                      onSend={() => send(c.id)}
                      placeholder="Escribe un mensaje…"
                    />
                  }
                >
                  <MessageList>
                    <MessageDayDivider>Hoy</MessageDayDivider>
                    {c.messages.map((m) => (
                      <MessageBubble
                        key={m.id}
                        own={m.own}
                        author={m.author}
                        time={m.time}
                        avatar={m.own ? undefined : { name: m.author }}
                      >
                        {m.text}
                      </MessageBubble>
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
    const [open, setOpen] = useState(true);
    const [draft, setDraft] = useState("");
    return (
      <div style={{ height: 480, display: "flex", alignItems: "flex-end", padding: "1rem" }}>
        <MessagePanel
          name="Central C4"
          subtitle="Activo ahora"
          avatar={{ name: "Central C4" }}
          presence="online"
          open={open}
          onToggle={() => setOpen((v) => !v)}
          onClose={() => setOpen(false)}
          composer={
            <MessageComposer
              value={draft}
              onChange={setDraft}
              onSend={() => setDraft("")}
            />
          }
        >
          <MessageList>
            <MessageBubble own={false} author="Central C4" time="10:40" avatar={{ name: "Central C4" }}>
              Unidad entrando al corredor.
            </MessageBubble>
            <MessageBubble own time="10:41">
              Recibido.
            </MessageBubble>
          </MessageList>
        </MessagePanel>
      </div>
    );
  },
};
