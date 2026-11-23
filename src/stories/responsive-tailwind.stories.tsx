import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../components/Badge';
import { Card, CardBody } from '../components/Card';
import { Stat } from '../components/Stat';
import { responsiveStory } from './responsiveStory';
import { LONG_TOKEN } from './responsiveFixtures';
import './tailwind-equivalents.css';

const meta = {
  title: 'Responsive/Tailwind',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Clases de utilidad alrededor de componentes de la librería. Las del contenedor cambian de
 * disposición en 40rem; los componentes responden con sus propios estilos. Ninguna clase de
 * utilidad toca el interior de un componente.
 */
function EjemploCoexistencia() {
  return (
    <main className="w-full">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Stat label="Viajes activos" value="128" />
        <Stat label="Unidad con identificador largo" value={LONG_TOKEN} />
        <Card>
          <CardBody>
            <Badge variant="secure">En ruta</Badge>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Badge variant="alert">Incidencia</Badge>
          </CardBody>
        </Card>
      </div>
      <p className="hidden sm:block">Visible desde 40rem (sm).</p>
      <p className="sm:hidden">Visible solo por debajo de 40rem.</p>
    </main>
  );
}

const movilStory: Story = {
  render: () => <EjemploCoexistencia />,
};

/** Móvil: una columna, el texto de solo móvil visible y el de sm oculto. */
export const Mobile: Story = responsiveStory('mobile', movilStory);

const tabletStory: Story = {
  render: () => <EjemploCoexistencia />,
};

/** Tablet (768 px): dos columnas desde 40rem; las mismas clases cambian en el mismo ancho que los componentes. */
export const Tablet: Story = responsiveStory('tablet', tabletStory);
