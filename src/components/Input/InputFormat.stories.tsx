import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateInput } from "../DatePicker/DateInput";
import { FormField } from "./FormField";
import { Input } from "./Input";
import type { InputFormat } from "./inputFormat";

const meta = {
  title: "Components/Input/Validación de captura",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "La prop `format` de `Input` descarta los caracteres no permitidos al escribir, pegar o soltar texto, y `onChange` recibe el valor ya limpio. También fija el teclado móvil (`inputMode`). Prueba escribir o pegar texto con caracteres inválidos en cada campo.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Campo controlado que muestra el valor que recibe el portal. */
function Demo({
  format,
  label,
  help,
  placeholder,
  maxLength,
  type,
}: {
  format: InputFormat;
  label: string;
  help: string;
  placeholder?: string;
  maxLength?: number;
  type?: string;
}) {
  const [value, setValue] = useState("");
  return (
    <FormField label={label} helpText={help}>
      <Input
        format={format}
        type={type}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        clearable
        onChange={(event) => setValue(event.target.value)}
      />
    </FormField>
  );
}

/** Un campo por formato. Pega `Ab-12 x.5 +` en cualquiera para ver qué se queda. */
export const Formatos: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--ui-space-4)" }}>
      <Demo format="digits" label="Folio (digits)" help="Solo dígitos; conserva ceros a la izquierda." placeholder="00123" maxLength={10} />
      <Demo format="integer" label="Cantidad (integer)" help="Entero; el signo - solo al inicio." placeholder="-25" />
      <Demo format="decimal" label="Peso en toneladas (decimal)" help="Un solo punto decimal; el signo - solo al inicio." placeholder="12.5" />
      <Demo format="phone" label="Teléfono (phone)" help="Dígitos, espacios, guion y paréntesis; + solo al inicio." placeholder="+52 55 1234 5678" maxLength={20} />
      <Demo format="letters" label="Nombre (letters)" help="Letras con acentos, espacios, apóstrofo, punto y guion." placeholder="José Ñandú" />
      <Demo format="alphanumeric" label="Placa o contenedor (alphanumeric)" help="Letras y dígitos, sin espacios ni símbolos." placeholder="ABC123" maxLength={12} />
      <Demo format="email" label="Correo (email)" help="No admite espacios." placeholder="nombre@empresa.mx" type="email" />
    </div>
  ),
};

/** El campo de texto de `DateInput` solo admite dígitos y `/`, `-`, `.`, con máximo 10 caracteres. */
export const Fecha: Story = {
  render: () => (
    <FormField label="Fecha de salida" helpText="Escribe letras o más de 10 caracteres: se descartan. La barra se agrega sola.">
      <DateInput clearable />
    </FormField>
  ),
};
