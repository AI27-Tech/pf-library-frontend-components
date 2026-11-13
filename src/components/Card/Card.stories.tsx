import { HardDrive } from "lucide-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardHeader, CardBody, CardFooter } from "./Card";
import { Button } from "../Button";

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { variant: "outlined", padding: "md" },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["outlined", "elevated", "filled"],
    },
    padding: {
      control: "inline-radio",
      options: ["none", "sm", "md", "lg"],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader title="Título de la tarjeta" subtitle="Texto de apoyo" />
      <CardBody>
        Este es el cuerpo de la tarjeta. Úsalo para cualquier contenido que necesites mostrar.
      </CardBody>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader title="Confirmar acción" subtitle="Esto no se puede deshacer" />
      <CardBody>¿Está seguro de que desea eliminar este elemento?</CardBody>
      <CardFooter>
        <Button variant="ghost">Cancelar</Button>
        <Button variant="danger">Eliminar</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithMediaAndAction: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader
        title="Almacenamiento"
        subtitle="72% usado"
        media={<HardDrive />}
        action={<Button size="sm" variant="outline">Gestionar</Button>}
      />
      <CardBody>Estás usando 7.2 GB de tu plan de 10 GB.</CardBody>
    </Card>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1rem" }}>
      {(["outlined", "elevated", "filled"] as const).map((v) => (
        <Card key={v} variant={v}>
          <CardHeader title={v} subtitle="Variante de tarjeta" />
          <CardBody>Contenido para la variante {v}.</CardBody>
        </Card>
      ))}
    </div>
  ),
};

export const Clickable: Story = {
  render: (args) => (
    <Card {...args} onClick={() => alert("Tarjeta clickeada")}>
      <CardHeader title="Tarjeta clickeable" subtitle="Presiona Enter o Espacio" />
      <CardBody>Toda la tarjeta actúa como un botón.</CardBody>
    </Card>
  ),
};

