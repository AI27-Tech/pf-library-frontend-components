import { Search } from "lucide-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { responsiveStory } from "../../stories/responsiveStory";
import { LONG_TOKEN } from "../../stories/responsiveFixtures";

const meta = {
  title: "Components/Input/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    placeholder: "Type something...",
    size: "md",
    invalid: false,
    disabled: false,
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    startAdornment: { control: false },
    endAdornment: { control: false },
  },
  decorators: [
    (Story, context) => (
      <div style={context.parameters.responsive === true ? undefined : { width: 280 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: "Hello world" },
};

export const Invalid: Story = {
  args: { invalid: true, defaultValue: "not-an-email" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Disabled" },
};

export const WithAdornments: Story = {
  args: {
    startAdornment: <Search />,
    placeholder: "Search...",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <Input {...args} size="sm" placeholder="Small" />
      <Input {...args} size="md" placeholder="Medium" />
      <Input {...args} size="lg" placeholder="Large" />
    </div>
  ),
};

export const StateError: Story = {
  args: { state: "error", defaultValue: "No válido" },
};

export const StateWarning: Story = {
  args: { state: "warning", defaultValue: "Revisar" },
};

export const StateSuccess: Story = {
  args: { state: "success", defaultValue: "Correcto" },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: "Solo lectura" },
};

/** El botón de borrar solo aparece cuando hay texto. */
export const Clearable: Story = {
  args: { clearable: true, defaultValue: "Borra este texto" },
};

/** En `type="password"`, el botón alterna entre ver y ocultar el texto. */
export const PasswordToggle: Story = {
  args: { type: "password", passwordToggle: true, defaultValue: "secreto" },
};

/** Movil: campo con limpiar, campo de contrasena, valor largo y area de texto con contador. */
const mobileStory: Story = {
  render: () => (
    <main>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Input clearable defaultValue={LONG_TOKEN} placeholder="Placa de la unidad" />
        <Input type="password" passwordToggle defaultValue="secreto" placeholder="Contrasena" />
        <Textarea aria-label="Observaciones del viaje" showCount maxLength={200} defaultValue="Observaciones del viaje" />
      </div>
    </main>
  ),
};
export const Mobile: Story = responsiveStory("mobile", mobileStory);
