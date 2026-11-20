import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Modal } from "./Modal";
import { responsiveStory } from "../../stories/responsiveStory";
import { LONG_TOKEN } from "../../stories/responsiveFixtures";
import { Button } from "../Button";
import { FormField } from "../Input/FormField";
import { Input } from "../Input/Input";

const meta = {
  title: "Components/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    open: false,
    onClose: () => {},
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    open: { control: false },
    onClose: { control: false },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: { title: "Modal title", size: "md" },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal {...args} open={open} onClose={() => setOpen(false)}>
          <p>
            This is a controlled modal. Close it with the × button, the Escape
            key, or by clicking the overlay.
          </p>
        </Modal>
      </>
    );
  },
};

export const WithFooter: Story = {
  args: { title: "Delete item", size: "sm" },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Delete
        </Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                Delete
              </Button>
            </>
          }
        >
          Are you sure you want to delete this item? This action cannot be
          undone.
        </Modal>
      </>
    );
  },
};

export const WithForm: Story = {
  args: { title: "Create user", size: "md" },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>New user</Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Save</Button>
            </>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", paddingBottom: "0.5rem" }}>
            <FormField label="Name" required>
              <Input placeholder="Jane Doe" />
            </FormField>
            <FormField label="Email" required>
              <Input type="email" placeholder="you@example.com" />
            </FormField>
          </div>
        </Modal>
      </>
    );
  },
};

/** Movil: modal grande con cuerpo largo, titulo largo y tres botones en el pie. */
const mobileStory: Story = {
  args: { children: null },
  render: () => (
    <main>
      <Modal
        open
        onClose={() => {}}
        size="lg"
        title={`Detalle del viaje ${LONG_TOKEN}`}
        footer={
          <>
            <Button variant="primary">Guardar</Button>
            <Button variant="secondary">Descartar</Button>
            <Button variant="ghost">Volver</Button>
          </>
        }
      >
        <div>
          <p>Linea de detalle 1 del viaje: la unidad cumple el itinerario, el custodio confirma cada parada y la bitacora se actualiza en tiempo real.</p>
          <p>Linea de detalle 2 del viaje: la unidad cumple el itinerario, el custodio confirma cada parada y la bitacora se actualiza en tiempo real.</p>
          <p>Linea de detalle 3 del viaje: la unidad cumple el itinerario, el custodio confirma cada parada y la bitacora se actualiza en tiempo real.</p>
          <p>Linea de detalle 4 del viaje: la unidad cumple el itinerario, el custodio confirma cada parada y la bitacora se actualiza en tiempo real.</p>
          <p>Linea de detalle 5 del viaje: la unidad cumple el itinerario, el custodio confirma cada parada y la bitacora se actualiza en tiempo real.</p>
          <p>Linea de detalle 6 del viaje: la unidad cumple el itinerario, el custodio confirma cada parada y la bitacora se actualiza en tiempo real.</p>
          <p>Linea de detalle 7 del viaje: la unidad cumple el itinerario, el custodio confirma cada parada y la bitacora se actualiza en tiempo real.</p>
          <p>Linea de detalle 8 del viaje: la unidad cumple el itinerario, el custodio confirma cada parada y la bitacora se actualiza en tiempo real.</p>
          <p>Linea de detalle 9 del viaje: la unidad cumple el itinerario, el custodio confirma cada parada y la bitacora se actualiza en tiempo real.</p>
          <p>Linea de detalle 10 del viaje: la unidad cumple el itinerario, el custodio confirma cada parada y la bitacora se actualiza en tiempo real.</p>
          <p>Linea de detalle 11 del viaje: la unidad cumple el itinerario, el custodio confirma cada parada y la bitacora se actualiza en tiempo real.</p>
          <p>Linea de detalle 12 del viaje: la unidad cumple el itinerario, el custodio confirma cada parada y la bitacora se actualiza en tiempo real.</p>
          <p>Linea de detalle 13 del viaje: la unidad cumple el itinerario, el custodio confirma cada parada y la bitacora se actualiza en tiempo real.</p>
          <p>Linea de detalle 14 del viaje: la unidad cumple el itinerario, el custodio confirma cada parada y la bitacora se actualiza en tiempo real.</p>
          <p>Linea de detalle 15 del viaje: la unidad cumple el itinerario, el custodio confirma cada parada y la bitacora se actualiza en tiempo real.</p>
          <p>Linea de detalle 16 del viaje: la unidad cumple el itinerario, el custodio confirma cada parada y la bitacora se actualiza en tiempo real.</p>
          <p>Linea de detalle 17 del viaje: la unidad cumple el itinerario, el custodio confirma cada parada y la bitacora se actualiza en tiempo real.</p>
          <p>Linea de detalle 18 del viaje: la unidad cumple el itinerario, el custodio confirma cada parada y la bitacora se actualiza en tiempo real.</p>
          <p>Linea de detalle 19 del viaje: la unidad cumple el itinerario, el custodio confirma cada parada y la bitacora se actualiza en tiempo real.</p>
          <p>Linea de detalle 20 del viaje: la unidad cumple el itinerario, el custodio confirma cada parada y la bitacora se actualiza en tiempo real.</p>
          <p>Linea de detalle 21 del viaje: la unidad cumple el itinerario, el custodio confirma cada parada y la bitacora se actualiza en tiempo real.</p>
          <p>Linea de detalle 22 del viaje: la unidad cumple el itinerario, el custodio confirma cada parada y la bitacora se actualiza en tiempo real.</p>
        </div>
      </Modal>
    </main>
  ),
};
export const Mobile: Story = responsiveStory("mobile", mobileStory);

/** Tablet: el mismo modal en 768 px. */
const tabletStory: Story = {
  args: { children: null },
  render: () => (
    <main>
      <Modal open onClose={() => {}} size="lg" title="Detalle del viaje" footer={<Button variant="primary">Cerrar</Button>}>
        <p>Detalle breve del viaje para la vista de tablet.</p>
      </Modal>
    </main>
  ),
};
export const Tablet: Story = responsiveStory("tablet", tabletStory);
