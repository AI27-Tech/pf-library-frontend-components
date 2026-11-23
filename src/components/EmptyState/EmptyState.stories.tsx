import type { Meta, StoryObj } from "@storybook/react-vite";
import { Inbox, Plus } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { Button } from "../Button";
import { responsiveStory } from "../../stories/responsiveStory";
import { LONG_TOKEN } from "../../stories/responsiveFixtures";

const meta = {
  title: "Components/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Título con icono y acción. */
export const Default: Story = {
  args: {
    icon: <Inbox />,
    title: "No hay viajes",
    description: "Cuando se cree un viaje, aparecerá en esta lista.",
    action: <Button startIcon={<Plus />}>Nuevo viaje</Button>,
  },
};

/** Sin icono ni acción. */
export const TitleOnly: Story = {
  args: { title: "Sin resultados" },
};

/** Tamaño pequeño para paneles estrechos. */
export const Small: Story = {
  args: {
    size: "sm",
    icon: <Inbox />,
    title: "Sin notificaciones",
    description: "No hay mensajes pendientes.",
  },
};

const mobileStory: Story = {
  args: {
    icon: <Inbox />,
    title: LONG_TOKEN,
    description: LONG_TOKEN,
    action: <Button startIcon={<Plus />}>Nuevo viaje</Button>,
  },
  render: (args) => (
    <main>
      <EmptyState {...args} />
    </main>
  ),
};

/** Móvil: el título y la descripción largos se parten y la acción se acierta con el pulgar. */
export const Mobile: Story = responsiveStory("mobile", mobileStory);