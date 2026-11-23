import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./Checkbox";
import { Radio } from "./Radio";
import { Switch } from "./Switch";
import { responsiveStory } from "../../stories/responsiveStory";
import { LONG_TOKEN } from "../../stories/responsiveFixtures";

const meta = {
  title: "Components/Input/Choice",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checkboxes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
    </div>
  ),
};

export const Radios: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <Radio name="demo" label="Option A" defaultChecked />
      <Radio name="demo" label="Option B" />
      <Radio name="demo" label="Option C" />
      <Radio name="demo" label="Disabled" disabled />
    </div>
  ),
};

export const Switches: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <Switch label="Off" />
      <Switch label="On" defaultChecked />
      <Switch label="Disabled" disabled />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <Checkbox size="sm" label="Pequeño" />
      <Checkbox size="md" label="Mediano" />
      <Checkbox size="lg" label="Grande" />
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <Checkbox invalid label="Acepto los términos" />
      <Radio invalid label="Opción requerida" />
      <Switch invalid label="Activo" />
    </div>
  ),
};

/** Movil: diez casillas, un grupo de radios y varios interruptores, con etiquetas de dominio largas. */
const mobileStory: Story = {
  render: () => (
    <main>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <fieldset>
          <legend>Unidades a monitorear</legend>
          {Array.from({ length: 10 }, (_, i) => (
            <Checkbox key={i} label={`Unidad ${String(i + 1).padStart(2, "0")} ${LONG_TOKEN}`} />
          ))}
        </fieldset>
        <fieldset>
          <legend>Tipo de custodia</legend>
          <Radio name="custodia-movil" value="armada" label="Custodia armada con escolta" />
          <Radio name="custodia-movil" value="patrulla" label="Acompanamiento con patrulla" />
          <Radio name="custodia-movil" value="mixta" label={`Mixta ${LONG_TOKEN}`} />
        </fieldset>
        <fieldset>
          <legend>Avisos</legend>
          <Switch label="Avisar al cliente al salir de origen" />
          <Switch label="Avisar a operacion en incidencia" />
          <Switch label={`Notificar por correo y mensaje ${LONG_TOKEN}`} />
        </fieldset>
      </div>
    </main>
  ),
};
export const Mobile: Story = responsiveStory("mobile", mobileStory);
