import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
    fullWidth: false,
    loading: false,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "danger"],
      description: "Estilo visual del botón.",
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
      description: "Tamaño del botón.",
    },
    fullWidth: {
      control: "boolean",
      description: "Expandir el botón para llenar su contenedor.",
    },
    loading: {
      control: "boolean",
      description: "Mostrar un spinner de carga y deshabilitar interacción.",
    },
    disabled: {
      control: "boolean",
      description: "Deshabilitar el botón.",
    },
    onClick: { action: "clicked" },
    startIcon: { control: false },
    endIcon: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Área de juego impulsada por el panel de controles. */
export const Playground: Story = {};

/** La acción predeterminada, énfasis alto. */
export const Primary: Story = {
  args: { variant: "primary", children: "Primary" },
};

/** Acción de menor énfasis, emparejada con un botón primario. */
export const Secondary: Story = {
  args: { variant: "secondary", children: "Secondary" },
};

/** Enfatizado con un borde en lugar de relleno. */
export const Outline: Story = {
  args: { variant: "outline", children: "Outline" },
};

/** Estilos mínimos para acciones terciarias. */
export const Ghost: Story = {
  args: { variant: "ghost", children: "Ghost" },
};

/** Acción destructiva, usar con precaución. */
export const Danger: Story = {
  args: { variant: "danger", children: "Delete" },
};

/** Todas las variantes lado a lado. */
export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="outline">Outline</Button>
      <Button {...args} variant="ghost">Ghost</Button>
      <Button {...args} variant="danger">Danger</Button>
    </div>
  ),
};

/** Los tres tamaños disponibles. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
};

/** Botones con iconos principales y secundarios. */
export const WithIcons: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <Button {...args} startIcon={<PlusIcon />}>Add item</Button>
      <Button {...args} variant="outline" endIcon={<ArrowIcon />}>Next</Button>
      <Button {...args} variant="ghost" startIcon={<PlusIcon />} aria-label="Add" />
    </div>
  ),
};

/** El estado de carga desactiva la interacción y muestra un spinner. */
export const Loading: Story = {
  args: { loading: true, children: "Saving..." },
};

/** Estado deshabilitado. */
export const Disabled: Story = {
  args: { disabled: true, children: "Disabled" },
};

/** Se expande para llenar el contenedor padre. */
export const FullWidth: Story = {
  args: { fullWidth: true, children: "Full width" },
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
