import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "./Button";
import { Input, Textarea, Select, Checkbox, Radio, Switch, FormField } from "./Input";
import { Badge } from "./Badge";
import { Modal } from "./Modal";
import { Toast, ToastContainer } from "./Toast";
import { Table } from "./Table";
import { Card } from "./Card";

/**
 * Galería de componentes en modo oscuro.
 * 
 * Esto verifica que todos los componentes sean legibles, accesibles y tengan
 * suficiente contraste en modo oscuro (data-theme="dark").
 * 
 * Abre DevTools (F12) y verifica contraste con:
 * - Chrome: Accessibility → Color Contrast
 * - WebAIM: https://webaim.org/resources/contrastchecker/
 */
const meta: Meta = {
  title: "DarkMode / Galería de Componentes",
  parameters: {
    layout: "padded",
    backgrounds: {
      default: "dark",
    },
  },
  decorators: [
    (Story) => {
      // Forzar tema oscuro
      return (
        <div style={{ backgroundColor: "#1c222e", color: "#e2e8f0", padding: "2rem", minHeight: "100vh" }}>
          <Story />
        </div>
      );
    },
  ],
};

export default meta;

// ─────────────────────────────────────────────────────────────────────────────
// Input & Form Controls
// ─────────────────────────────────────────────────────────────────────────────

export const Inputs: StoryObj = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "400px" }}>
      <div>
        <h3 style={{ marginBottom: "1rem", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Input — Normal
        </h3>
        <Input placeholder="Placeholder text" />
      </div>

      <div>
        <h3 style={{ marginBottom: "1rem", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Input — Con valor
        </h3>
        <Input value="Texto capturado" onChange={() => {}} />
      </div>

      <div>
        <h3 style={{ marginBottom: "1rem", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Input — Focus
        </h3>
        <Input placeholder="Haz click aquí" autoFocus />
      </div>

      <div>
        <h3 style={{ marginBottom: "1rem", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Input — Deshabilitado
        </h3>
        <Input placeholder="No editable" disabled />
      </div>

      <div>
        <h3 style={{ marginBottom: "1rem", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Input — Inválido
        </h3>
        <Input placeholder="Error state" invalid value="Valor inválido" onChange={() => {}} />
      </div>

      <div>
        <h3 style={{ marginBottom: "1rem", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Textarea
        </h3>
        <Textarea placeholder="Escribe aquí..." />
      </div>

      <div>
        <h3 style={{ marginBottom: "1rem", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          FormField con Label y Help
        </h3>
        <FormField label="Email" required helpText="Usaremos esto para contactarte">
          <Input placeholder="tu@email.com" />
        </FormField>
      </div>
    </div>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// Select
// ─────────────────────────────────────────────────────────────────────────────

export const Selects: StoryObj = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "400px" }}>
      <div>
        <h3 style={{ marginBottom: "1rem", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Select — Normal
        </h3>
        <Select placeholder="Elige una opción" options={[
          { value: "1", label: "Opción 1" },
          { value: "2", label: "Opción 2" },
          { value: "3", label: "Opción 3" },
        ]} />
      </div>

      <div>
        <h3 style={{ marginBottom: "1rem", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Select — Con valor seleccionado
        </h3>
        <Select 
          value="2"
          onChange={() => {}}
          options={[
            { value: "1", label: "Opción 1" },
            { value: "2", label: "Opción 2 (seleccionada)" },
            { value: "3", label: "Opción 3" },
          ]} 
        />
      </div>

      <div>
        <h3 style={{ marginBottom: "1rem", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Select — Deshabilitado
        </h3>
        <Select disabled placeholder="No editable" options={[
          { value: "1", label: "Opción 1" },
        ]} />
      </div>
    </div>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// Checkboxes & Radios
// ─────────────────────────────────────────────────────────────────────────────

export const Checkboxes: StoryObj = {
  render: () => {
    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(true);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
        <h3 style={{ marginBottom: "0.5rem", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Checkbox — Normal
        </h3>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
          <Checkbox checked={checked1} onChange={(e) => setChecked1(e.target.checked)} />
          <span>Opción 1 (sin marcar)</span>
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
          <Checkbox checked={checked2} onChange={(e) => setChecked2(e.target.checked)} />
          <span>Opción 2 (marcada)</span>
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", opacity: 0.55 }}>
          <Checkbox disabled />
          <span>Opción 3 (deshabilitada)</span>
        </label>
      </div>
    );
  },
};

export const Radios: StoryObj = {
  render: () => {
    const [selected, setSelected] = useState("option2");

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
        <h3 style={{ marginBottom: "0.5rem", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Radio — Grupo
        </h3>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
          <Radio name="group" value="option1" checked={selected === "option1"} onChange={(e) => setSelected(e.target.value)} />
          <span>Opción 1</span>
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
          <Radio name="group" value="option2" checked={selected === "option2"} onChange={(e) => setSelected(e.target.value)} />
          <span>Opción 2 (seleccionada)</span>
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", opacity: 0.55 }}>
          <Radio name="group" value="option3" disabled />
          <span>Opción 3 (deshabilitada)</span>
        </label>
      </div>
    );
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Switch
// ─────────────────────────────────────────────────────────────────────────────

export const Switches: StoryObj = {
  render: () => {
    const [on1, setOn1] = useState(false);
    const [on2, setOn2] = useState(true);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
        <h3 style={{ marginBottom: "0.5rem", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Switch
        </h3>
        <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
          <Switch checked={on1} onChange={(e) => setOn1(e.target.checked)} />
          <span>Desactivado</span>
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
          <Switch checked={on2} onChange={(e) => setOn2(e.target.checked)} />
          <span>Activado</span>
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", opacity: 0.55 }}>
          <Switch disabled />
          <span>Deshabilitado</span>
        </label>
      </div>
    );
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Buttons
// ─────────────────────────────────────────────────────────────────────────────

export const Buttons: StoryObj = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "600px" }}>
      <div>
        <h3 style={{ marginBottom: "1rem", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Primary
        </h3>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Button variant="primary">Default</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: "1rem", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Secondary
        </h3>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Button variant="secondary">Default</Button>
          <Button variant="secondary" disabled>Disabled</Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: "1rem", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Ghost
        </h3>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Button variant="ghost">Default</Button>
          <Button variant="ghost" disabled>Disabled</Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: "1rem", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Outline
        </h3>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Button variant="outline">Default</Button>
          <Button variant="outline" disabled>Disabled</Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: "1rem", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Danger
        </h3>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Button variant="danger">Delete</Button>
          <Button variant="danger" disabled>Disabled</Button>
        </div>
      </div>
    </div>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// Badge
// ─────────────────────────────────────────────────────────────────────────────

export const Badges: StoryObj = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "600px" }}>
      <div>
        <h3 style={{ marginBottom: "1rem", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Variantes
        </h3>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Badge variant="secure">Secure</Badge>
          <Badge variant="alert">Alert</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="neutral">Neutral</Badge>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: "1rem", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Con Punto
        </h3>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Badge variant="secure" dot>Activo</Badge>
          <Badge variant="alert" dot>Error</Badge>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: "1rem", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Pill
        </h3>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Badge variant="secure" pill>Seguro</Badge>
          <Badge variant="alert" pill>Alerta</Badge>
        </div>
      </div>
    </div>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// Table
// ─────────────────────────────────────────────────────────────────────────────

export const Tables: StoryObj = {
  render: () => (
    <Table<{ id: string; name: string; status: string; date: string }>
      columns={[
        { key: "id", header: "ID", width: "4rem" },
        { key: "name", header: "Nombre" },
        { key: "status", header: "Estado", align: "center" },
        { key: "date", header: "Fecha", align: "right" },
      ]}
      data={[
        { id: "1", name: "Elemento 1", status: "Activo", date: "2026-09-23" },
        { id: "2", name: "Elemento 2", status: "Inactivo", date: "2026-09-22" },
        { id: "3", name: "Elemento 3", status: "Activo", date: "2026-09-21" },
        { id: "4", name: "Elemento 4", status: "Pendiente", date: "2026-09-20" },
      ]}
      hoverable
    />
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// Card
// ─────────────────────────────────────────────────────────────────────────────

export const Cards: StoryObj = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", maxWidth: "800px" }}>
      <Card>
        <h3 style={{ marginBottom: "0.5rem" }}>Card Básica</h3>
        <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0 }}>
          Contenido de prueba en modo oscuro
        </p>
      </Card>

      <Card variant="outlined">
        <h3 style={{ marginBottom: "0.5rem" }}>Card Outlined</h3>
        <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0 }}>
          Variante con borde
        </p>
      </Card>

      <Card>
        <h3 style={{ marginBottom: "0.5rem" }}>Card Con Padding</h3>
        <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: 0 }}>
          Padding personalizado en modo oscuro
        </p>
      </Card>
    </div>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// Modal
// ─────────────────────────────────────────────────────────────────────────────

export const Modals: StoryObj = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Button variant="primary" onClick={() => setIsOpen(true)}>
          Abrir Modal
        </Button>

        {isOpen && (
          <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Modal en Modo Oscuro">
            <p>
              Este modal prueba la visibilidad en modo oscuro. El overlay debe ser sutil, el contenido legible y los controles accesibles.
            </p>
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", marginTop: "1rem" }}>
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={() => setIsOpen(false)}>
                Aceptar
              </Button>
            </div>
          </Modal>
        )}
      </div>
    );
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Toast
// ─────────────────────────────────────────────────────────────────────────────

export const Toasts: StoryObj = {
  render: () => {
    const [toasts, setToasts] = useState<Array<{ id: string; variant: "info" | "success" | "warning" | "error"; title: string; message: string }>>([]);

    const addToast = (variant: "info" | "success" | "warning" | "error", title: string, message: string) => {
      const id = Math.random().toString();
      setToasts((prev) => [...prev, { id, variant, title, message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "400px" }}>
        <Button variant="primary" onClick={() => addToast("info", "Info", "Este es un toast de información")}>
          Info Toast
        </Button>
        <Button variant="success" onClick={() => addToast("success", "Éxito", "Operación completada")}>
          Success Toast
        </Button>
        <Button onClick={() => addToast("warning", "Advertencia", "Algo requiere atención")}>
          Warning Toast
        </Button>
        <Button variant="danger" onClick={() => addToast("error", "Error", "Algo salió mal")}>
          Error Toast
        </Button>

        <ToastContainer position="bottom-right">
          {toasts.map((toast) => (
            <Toast key={toast.id} variant={toast.variant} title={toast.title}>
              {toast.message}
            </Toast>
          ))}
        </ToastContainer>
      </div>
    );
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Accesibilidad — Checklist
// ─────────────────────────────────────────────────────────────────────────────

export const AccesibilityChecklist: StoryObj = {
  render: () => (
    <div style={{ maxWidth: "600px" }}>
      <h2 style={{ marginBottom: "1.5rem" }}>Checklist de Accesibilidad en Modo Oscuro</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ padding: "1rem", backgroundColor: "#242b3a", borderRadius: "0.25rem", borderLeft: "4px solid #7c9df0" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>✓ Input</h3>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "#94a3b8" }}>
            Select icon visible, placeholder legible, focus ring prominente
          </p>
        </div>

        <div style={{ padding: "1rem", backgroundColor: "#242b3a", borderRadius: "0.25rem", borderLeft: "4px solid #7c9df0" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>✓ Checkbox / Radio</h3>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "#94a3b8" }}>
            Estados disabled claros, label color correcto, focus ring visible
          </p>
        </div>

        <div style={{ padding: "1rem", backgroundColor: "#242b3a", borderRadius: "0.25rem", borderLeft: "4px solid #7c9df0" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>✓ Button</h3>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "#94a3b8" }}>
            Focus visible con outline + shadow, todos los estados accesibles
          </p>
        </div>

        <div style={{ padding: "1rem", backgroundColor: "#242b3a", borderRadius: "0.25rem", borderLeft: "4px solid #7c9df0" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>✓ Badge</h3>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "#94a3b8" }}>
            Neutral variant con mejor contraste, todos los colores accesibles
          </p>
        </div>

        <div style={{ padding: "1rem", backgroundColor: "#242b3a", borderRadius: "0.25rem", borderLeft: "4px solid #7c9df0" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>✓ Table</h3>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "#94a3b8" }}>
            Row hover visible, headers legibles, borders sutiles pero claros
          </p>
        </div>

        <div style={{ padding: "1rem", backgroundColor: "#242b3a", borderRadius: "0.25rem", borderLeft: "4px solid #7c9df0" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>✓ Modal / Toast</h3>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "#94a3b8" }}>
            Overlay sutil, contenido legible, close button accesible
          </p>
        </div>
      </div>

      <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#0e1117", borderRadius: "0.25rem", border: "1px solid #2d3748" }}>
        <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Para verificar contraste:
        </h3>
        <ol style={{ margin: "0.5rem 0 0 1rem", fontSize: "0.875rem", color: "#94a3b8", paddingLeft: "1rem" }}>
          <li>Abre DevTools (F12)</li>
          <li>Inspecciona cualquier elemento</li>
          <li>En Accessibility → Color Contrast, verifica WCAA AA (4.5:1)</li>
          <li>O usa WebAIM: https://webaim.org/resources/contrastchecker/</li>
        </ol>
      </div>
    </div>
  ),
};
