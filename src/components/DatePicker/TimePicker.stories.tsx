import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimePicker } from "./TimePicker";
import { FormField } from "../Input/FormField";
import { getTimeRange } from "./timeUtils";

const meta = {
  title: "Components/DatePicker/TimePicker",
  component: TimePicker,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    format: "24h",
    withSeconds: false,
    withDropdown: true,
    dropdownPosition: "auto",
    clearable: false,
    size: "md",
    invalid: false,
    disabled: false,
    readOnly: false,
  },
  argTypes: {
    format: { control: "inline-radio", options: ["24h", "12h"] },
    withSeconds: { control: "boolean" },
    withDropdown: { control: "boolean" },
    dropdownPosition: { control: "inline-radio", options: ["auto", "bottom", "top"] },
    clearable: { control: "boolean" },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    hoursStep: { control: "number" },
    minutesStep: { control: "number" },
    secondsStep: { control: "number" },
    min: { control: "text" },
    max: { control: "text" },
    value: { control: "text" },
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
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { value: "14:30" },
};

/** Formato de 12 horas: el segmento de AM/PM se agrega automáticamente. */
export const TwelveHours: Story = {
  args: { format: "12h", value: "14:30" },
};

export const WithSeconds: Story = {
  args: { withSeconds: true, value: "08:15:45" },
};

/** Pasos de flechas y de opciones: horas de 1 en 1, minutos de 15 en 15. */
export const CustomSteps: Story = {
  args: { minutesStep: 15, value: "09:30" },
};

export const WithPresets: Story = {
  args: {
    value: "08:00",
    presets: [
      "09:00",
      { label: "Turno matutino", values: ["07:00", "08:00", "09:00"] },
      { label: "Turno vespertino", values: ["14:00", "15:00", "16:00"] },
    ],
  },
};

/** Las opciones fuera de `min`/`max` aparecen deshabilitadas. Al salir del campo, una hora fuera de rango se ajusta al límite. */
export const WithRange: Story = {
  args: { value: "12:00", min: "09:00", max: "17:30" },
};

export const DropdownTop: Story = {
  args: { value: "10:00", dropdownPosition: "top" },
};

export const Invalid: Story = {
  args: { value: "", invalid: true },
};

export const Clearable: Story = {
  args: { value: "10:45", clearable: true },
};

export const Disabled: Story = {
  args: { value: "10:45", disabled: true },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <TimePicker {...args} size="sm" value="10:45" />
      <TimePicker {...args} size="md" value="10:45" />
      <TimePicker {...args} size="lg" value="10:45" />
    </div>
  ),
};

/** Dentro de `FormField`: el `id`, `invalid` y `aria-describedby` llegan automáticamente. */
export const InFormField: Story = {
  render: (args) => (
    <FormField label="Hora de salida" helpText="Formato 24 horas" error={args.invalid ? "Hora inválida" : undefined}>
      <TimePicker {...args} />
    </FormField>
  ),
  args: { value: "10:45", clearable: true },
};

/** Controlado: el valor vive en el padre. Escribe o elige una hora y revisa el valor emitido. */
export const Controlled: Story = {
  render: function ControlledStory(args) {
    const [value, setValue] = useState("10:45");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <TimePicker {...args} value={value} onChange={setValue} clearable />
        <small>Valor: {value || "(vacío)"}</small>
      </div>
    );
  },
};

/** `getTimeRange` genera una lista de horas para usar como presets. */
export const GeneratedPresets: Story = {
  args: {
    value: "08:00",
    presets: [{ label: "Cada 30 minutos", values: getTimeRange({ start: "08:00", end: "10:00", interval: "00:30" }) }],
  },
};
