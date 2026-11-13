import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateTimeInput } from "./DateTimeInput";
import { FormField } from "../Input/FormField";

const meta = {
  title: "Components/DatePicker/DateTimeInput",
  component: DateTimeInput,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    size: "md",
    invalid: false,
    disabled: false,
    readOnly: false,
    withSeconds: false,
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    withSeconds: { control: "boolean" },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    defaultTime: { control: "text" },
    min: { control: "text" },
    max: { control: "text" },
    value: { control: "text" },
    dateProps: { control: false },
    timeProps: { control: false },
    onChange: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 460 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DateTimeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { value: "2026-03-05T09:30" },
};

export const WithSeconds: Story = {
  args: { withSeconds: true, value: "2026-03-05T09:30:15" },
};

/** Si el usuario elige fecha con la hora vacía, se usa `defaultTime`. */
export const DefaultTime: Story = {
  args: { defaultTime: "08:00" },
};

/** La hora solo se restringe el día del límite. Otros días no tienen restricción de hora. */
export const WithRange: Story = {
  args: {
    value: "2026-03-05T09:30",
    min: "2026-03-05T08:00",
    max: "2026-03-25T18:00",
  },
};

export const Invalid: Story = {
  args: { invalid: true, value: "" },
};

export const Disabled: Story = {
  args: { disabled: true, value: "2026-03-05T09:30" },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <DateTimeInput {...args} size="sm" value="2026-03-05T09:30" />
      <DateTimeInput {...args} size="md" value="2026-03-05T09:30" />
      <DateTimeInput {...args} size="lg" value="2026-03-05T09:30" />
    </div>
  ),
};

/**
 * Parte a medias: si solo se elige fecha o solo hora, el valor combinado queda vacío (`""`)
 * y no se emite hasta que las dos partes estén completas.
 */
export const PartialState: Story = {
  render: function PartialStateStory(args) {
    const [value, setValue] = useState("");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <DateTimeInput {...args} value={value} onChange={setValue} />
        <small>Valor emitido: {value || "(vacío: falta una parte)"}</small>
      </div>
    );
  },
};

/**
 * Para vaciar las dos partes desde fuera, cambia la `key` del componente. Un `value=""`
 * externo no borra una parte que ya está a medias.
 */
export const ResetWithKey: Story = {
  render: function ResetWithKeyStory(args) {
    const [value, setValue] = useState("2026-03-05T09:30");
    const [resetKey, setResetKey] = useState(0);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <DateTimeInput key={resetKey} {...args} value={value} onChange={setValue} />
        <button
          type="button"
          onClick={() => {
            setValue("");
            setResetKey((current) => current + 1);
          }}
        >
          Reiniciar
        </button>
        <small>Valor: {value || "(vacío)"}</small>
      </div>
    );
  },
};

/** Dentro de `FormField`: el `id`, `invalid` y `aria-describedby` llegan automáticamente. */
export const InFormField: Story = {
  render: (args) => (
    <FormField label="Inicio del viaje" required helpText="Fecha y hora de salida" error={args.invalid ? "Fecha y hora requeridas" : undefined}>
      <DateTimeInput {...args} />
    </FormField>
  ),
  args: { value: "2026-03-05T09:30" },
};
