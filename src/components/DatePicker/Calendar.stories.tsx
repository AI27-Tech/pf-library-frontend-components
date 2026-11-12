import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar } from "./Calendar";

const meta = {
  title: "Components/DatePicker/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    locale: "es-MX",
    weekStartsOn: 1,
  },
  argTypes: {
    weekStartsOn: { control: "inline-radio", options: [0, 1] },
    locale: { control: "text" },
    value: { control: "text" },
    min: { control: "text" },
    max: { control: "text" },
    isDateDisabled: { control: false },
    onChange: { control: false },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { value: "2026-03-05" },
};

/** Solo se pueden elegir fechas entre `min` y `max`. Los días fuera de rango se ven deshabilitados. */
export const WithRange: Story = {
  args: { value: "2026-03-12", min: "2026-03-05", max: "2026-03-25" },
};

export const SundayFirst: Story = {
  args: { value: "2026-03-05", weekStartsOn: 0 },
};

/** `isDateDisabled` bloquea fechas concretas. Aquí se bloquean los domingos y el 10 de marzo. */
export const DisabledDates: Story = {
  args: {
    value: "2026-03-05",
    isDateDisabled: (value: string) => {
      if (value === "2026-03-10") return true;
      const [y, m, d] = value.split("-").map(Number);
      return new Date(Date.UTC(y, m - 1, d)).getUTCDay() === 0;
    },
  },
};

/** Teclado: flechas mueven el día, PageUp/PageDown el mes, Shift + flechas el año, Home/End el inicio y fin de la semana, Enter o Espacio seleccionan. */
export const KeyboardHelp: Story = {
  args: { value: "2026-03-05", autoFocus: true },
};
