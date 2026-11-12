import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form, FormSection, FormRow, FormActions } from "./Form";
import { FormField } from "../Input/FormField";
import { Input } from "../Input/Input";
import { Select } from "../Input/Select";
import { Textarea } from "../Input/Textarea";
import { Switch } from "../Input/Switch";
import { Button } from "../Button";
import { Checkbox } from "../Input/Checkbox";
import { DateInput } from "../DatePicker/DateInput";
import { TimePicker } from "../DatePicker/TimePicker";

const meta = {
  title: "Components/Form",
  component: Form,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: { children: null },
  render: () => (
    <Form onSubmit={(e) => e.preventDefault()}>
      <FormField label="Full name" required>
        <Input placeholder="Jane Doe" />
      </FormField>
      <FormField label="Email" required helpText="We'll never share it.">
        <Input type="email" placeholder="you@example.com" />
      </FormField>
      <FormActions>
        <Button variant="ghost" type="button">Cancel</Button>
        <Button type="submit">Save</Button>
      </FormActions>
    </Form>
  ),
};

export const WithSectionsAndRows: Story = {
  args: { children: null },
  render: () => (
    <Form onSubmit={(e) => e.preventDefault()}>
      <FormSection title="Personal info" description="Basic details about you.">
        <FormRow>
          <FormField label="First name" required>
            <Input placeholder="Jane" />
          </FormField>
          <FormField label="Last name" required>
            <Input placeholder="Doe" />
          </FormField>
        </FormRow>
        <FormField label="Email" required>
          <Input type="email" placeholder="you@example.com" />
        </FormField>
      </FormSection>

      <FormSection title="Address">
        <FormField label="Street">
          <Input placeholder="123 Main St" />
        </FormField>
        <FormRow columns={3}>
          <FormField label="City">
            <Input placeholder="City" />
          </FormField>
          <FormField label="State">
            <Input placeholder="State" />
          </FormField>
          <FormField label="ZIP">
            <Input placeholder="00000" />
          </FormField>
        </FormRow>
      </FormSection>

      <FormActions align="between">
        <Button variant="ghost" type="button">Back</Button>
        <Button type="submit">Continue</Button>
      </FormActions>
    </Form>
  ),
};

export const ControlledWithValidation: Story = {
  args: { children: null },
  render: () => {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [bio, setBio] = useState("");
    const [notify, setNotify] = useState(true);
    const [submitted, setSubmitted] = useState(false);

    const emailError =
      submitted && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? "Enter a valid email address."
        : undefined;
    const roleError = submitted && !role ? "Please select a role." : undefined;

    return (
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <FormField label="Email" required error={emailError}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </FormField>

        <FormField label="Role" required error={roleError}>
          <Select
            placeholder="Select a role"
            value={role}
            onChange={(valor) => setRole(String(valor))}
            options={[
              { label: "Admin", value: "admin" },
              { label: "Editor", value: "editor" },
              { label: "Viewer", value: "viewer" },
            ]}
          />
        </FormField>

        <FormField label="Bio" helpText="Optional short description.">
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Tell us about yourself"
          />
        </FormField>

        <Switch
          label="Email notifications"
          checked={notify}
          onChange={(e) => setNotify(e.target.checked)}
        />

        <FormActions>
          <Button type="submit">Create account</Button>
        </FormActions>
      </Form>
    );
  },
};

/** `FormActions` con `sticky` se queda al fondo del área visible mientras el formulario se desplaza. */
export const StickyActions: Story = {
  args: { children: null },
  render: () => (
    // El contenedor con scroll no tiene padding: la barra va de borde a borde.
    // El padding está dentro de los campos.
    <Form onSubmit={(e) => e.preventDefault()}>
      <div style={{ height: 320, overflowY: "auto", border: "1px solid var(--ui-color-border-subtle)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", padding: "1rem" }}>
          {Array.from({ length: 8 }, (_, index) => (
            <FormField key={index} label={`Campo ${index + 1}`}>
              <Input />
            </FormField>
          ))}
        </div>
        <FormActions sticky>
          <Button variant="ghost" type="button">Cancel</Button>
          <Button type="submit">Save</Button>
        </FormActions>
      </div>
    </Form>
  ),
};

/** `FormSection` con `collapsible` pliega su contenido desde el título. `defaultOpen={false}` empieza plegada. */
export const CollapsibleSections: Story = {
  args: { children: null },
  render: () => (
    <Form onSubmit={(e) => e.preventDefault()}>
      <FormSection title="Datos generales" description="Información básica" collapsible>
        <FormRow columns={2}>
          <FormField label="Nombre" required>
            <Input />
          </FormField>
          <FormField label="Correo">
            <Input type="email" />
          </FormField>
        </FormRow>
      </FormSection>
      <FormSection title="Preferencias" collapsible defaultOpen={false}>
        <Switch label="Recibir avisos" />
      </FormSection>
    </Form>
  ),
};

/** `FormRow` con tres columnas. En pantallas angostas se apila en una sola columna. */
export const Rows: Story = {
  args: { children: null },
  render: () => (
    <Form onSubmit={(e) => e.preventDefault()}>
      <FormRow columns={3}>
        <FormField label="Ciudad">
          <Input />
        </FormField>
        <FormField label="Estado">
          <Input />
        </FormField>
        <FormField label="Código postal">
          <Input />
        </FormField>
      </FormRow>
    </Form>
  ),
};

/** Formulario completo con los pickers nuevos: fecha, hora, secciones plegables y barra de acciones pegajosa. */
export const FullFormWithPickers: Story = {
  args: { children: null },
  render: function FullFormWithPickersStory() {
    const [date, setDate] = useState("2026-03-05");
    const [time, setTime] = useState("09:30");
    return (
      <Form onSubmit={(e) => e.preventDefault()}>
        <FormSection title="Viaje" description="Fecha y hora de salida">
          <FormRow columns={2}>
            <FormField label="Fecha de salida" required>
              <DateInput value={date} onChange={setDate} clearable displayFormat="AAAA Mmm DD" />
            </FormField>
            <FormField label="Hora de salida" required>
              <TimePicker value={time} onChange={setTime} clearable min="06:00" max="22:00" />
            </FormField>
          </FormRow>
        </FormSection>
        <FormSection title="Contacto" collapsible>
          <FormRow>
            <FormField label="Nombre" required>
              <Input />
            </FormField>
            <FormField label="Correo" showOptional>
              <Input type="email" />
            </FormField>
          </FormRow>
          <FormField label="Comentarios" showOptional>
            <Textarea showCount maxLength={200} />
          </FormField>
        </FormSection>
        <FormSection title="Confirmación">
          <Checkbox label="Acepto los términos" />
        </FormSection>
        <FormActions sticky>
          <Button variant="ghost" type="button">Cancel</Button>
          <Button type="submit">Save</Button>
        </FormActions>
      </Form>
    );
  },
};
