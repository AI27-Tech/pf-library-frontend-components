import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateInput } from "./DateInput";
import { FormField } from "../Input/FormField";
import { Modal } from "../Modal/Modal";
import { addDays, formatISODate, today } from "./dateUtils";

const meta = {
  title: "Components/DatePicker/DateInput",
  component: DateInput,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    placeholder: "DD/MM/AAAA",
    size: "md",
    invalid: false,
    disabled: false,
    readOnly: false,
    clearable: false,
    locale: "es-MX",
    weekStartsOn: 1,
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    weekStartsOn: { control: "inline-radio", options: [0, 1] },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    clearable: { control: "boolean" },
    value: { control: "text" },
    min: { control: "text" },
    max: { control: "text" },
    presets: { control: false },
    onChange: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const presets = [
  { label: "Hoy", value: () => formatISODate(today()) },
  { label: "En 7 días", value: () => formatISODate(addDays(today(), 7)) },
  { label: "Mañana", value: () => formatISODate(addDays(today(), 1)) },
];

export const Default: Story = {};

export const WithValue: Story = {
  args: { value: "2026-03-05" },
};

export const WithPresets: Story = {
  args: { value: "2026-03-05", presets },
};

export const Clearable: Story = {
  args: { value: "2026-03-05", clearable: true },
};

/** Solo se aceptan fechas entre `min` y `max`. Escribir una fecha fuera de rango vuelve al valor vigente. */
export const WithRange: Story = {
  args: { value: "2026-03-12", min: "2026-03-05", max: "2026-03-25" },
};

export const Invalid: Story = {
  args: { value: "", invalid: true },
};

export const Disabled: Story = {
  args: { value: "2026-03-05", disabled: true },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <DateInput {...args} size="sm" value="2026-03-05" />
      <DateInput {...args} size="md" value="2026-03-05" />
      <DateInput {...args} size="lg" value="2026-03-05" />
    </div>
  ),
};

/** Dentro de `FormField`: el `id`, `invalid` y `aria-describedby` llegan automáticamente. */
export const InFormField: Story = {
  render: (args) => (
    <FormField label="Fecha de inicio" helpText="Formato DD/MM/AAAA" error={args.invalid ? "Fecha inválida" : undefined}>
      <DateInput {...args} />
    </FormField>
  ),
  args: { clearable: true, value: "2026-03-05" },
};

/** Dentro de `Modal`: el panel del calendario debe seguir encima y cerrar solo con su propio Escape. */
export const InModal: Story = {
  render: function InModalStory(args) {
    const [open, setOpen] = useState(true);
    const [value, setValue] = useState("2026-03-05");
    return (
      <>
        <button type="button" onClick={() => setOpen(true)}>
          Abrir modal
        </button>
        <Modal open={open} onClose={() => setOpen(false)} title="Programar viaje" size="md">
          <DateInput {...args} value={value} onChange={setValue} presets={presets} clearable />
        </Modal>
      </>
    );
  },
};

/** Formato visual `AAAA Mmm DD`, con el mes en español. Sin foco se muestra así; al enfocar el campo vuelve a `DD/MM/AAAA` para escribir. */
export const VisualFormat: Story = {
  args: { displayFormat: "AAAA Mmm DD", locale: "es-MX" },
  render: function VisualFormatStory(args) {
    const [value, setValue] = useState("2026-11-12");
    return <DateInput {...args} value={value} onChange={setValue} />;
  },
};

/** Controlado: el valor vive en el padre. Si el padre no actualiza `value`, el campo vuelve al valor vigente al confirmar. */
export const Controlled: Story = {
  render: function ControlledStory(args) {
    const [value, setValue] = useState("2026-03-05");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <DateInput {...args} value={value} onChange={setValue} clearable />
        <small>Valor: {value || "(vacío)"}</small>
      </div>
    );
  },
};
