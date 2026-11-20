import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip } from "./Tooltip";
import { responsiveStory } from "../../stories/responsiveStory";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * El Tooltip es un componente de presentación: se posiciona con `position: fixed`
 * a partir de coordenadas de viewport (x, y). No mide ni escucha eventos; quien lo
 * usa decide cuándo mostrarlo y le pasa la posición. Aquí lo fijamos en el centro
 * de la pantalla solo para verlo.
 *
 * En la práctica lo consume el `Badge` con `truncate`: al pasar el cursor sobre un
 * badge cuyo texto está recortado, aparece este tooltip con el valor completo.
 */
export const Default: Story = {
  args: {
    children: "Texto completo del estado que estaba recortado",
    x: 400,
    y: 300,
  },
  render: (args) => (
    <div style={{ height: 200, position: "relative" }}>
      <Tooltip {...args} />
    </div>
  ),
};

/** Movil: un tooltip en el borde izquierdo y otro en el derecho, con texto largo. */
const mobileStory: Story = {
  args: { children: null, x: 0, y: 0 },
  render: () => (
    <main>
      <div style={{ position: "relative", height: 320 }}>
        <Tooltip x={4} y={120}>Ver la bitacora completa de la unidad PT-07 con las paradas, firmas y evidencias</Tooltip>
        <Tooltip x={371} y={240}>Incidencia por retraso en la frontera de Nuevo Laredo con la carga pendiente</Tooltip>
      </div>
    </main>
  ),
};
export const Mobile: Story = responsiveStory("mobile", mobileStory);
