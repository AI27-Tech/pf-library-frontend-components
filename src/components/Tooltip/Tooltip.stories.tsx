import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip } from "./Tooltip";

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
