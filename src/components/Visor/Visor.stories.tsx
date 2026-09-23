import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Visor, type Medium } from './Visor';
import { Button } from '../Button';

const meta = {
  title: 'Components/Visor',
  component: Visor,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    mediums: [],
    initialIndex: 0,
    onClose: () => {},
    resolveUrl: (medium) => medium.id,
  },
} satisfies Meta<typeof Visor>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock mediums para las stories
const mockMediums: Medium[] = [
  {
    id: '1',
    type: 'IMAGE',
    label: 'Foto 1 - Frontal',
    comment: 'Vista frontal del vehículo',
  },
  {
    id: '2',
    type: 'IMAGE',
    label: 'Foto 2 - Lateral',
    comment: 'Vista lateral derecha',
  },
  {
    id: '3',
    type: 'AUDIO',
    label: 'Audio 1 - Inspección',
    comment: 'Grabación de audio de la inspección',
  },
  {
    id: '4',
    type: 'IMAGE',
    label: 'Foto 3 - Trasera',
    comment: 'Vista trasera del vehículo',
  },
];

// Función para resolver URLs
const mockResolveUrl = async (medium: Medium): Promise<string> => {
  if (medium.type === 'AUDIO') {
    return '';
  }
  return 'https://images.unsplash.com/photo-1516611590658-1acbb0cbdac3?w=1200&h=675&fit=crop';
};

const codeBasic = `import { Visor, type Medium } from '@ai27-tech/ui';
import { useState } from 'react';

export function MyVisor() {
  const [isOpen, setIsOpen] = useState(false);

  const mediums: Medium[] = [
    { id: '1', type: 'IMAGE', label: 'Foto 1' },
    { id: '2', type: 'IMAGE', label: 'Foto 2' },
  ];

  const resolveUrl = async (m: Medium) => 
    \`https://example.com/images/\${m.id}.jpg\`;

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Abrir visor
      </button>
      {isOpen && (
        <Visor
          mediums={mediums}
          initialIndex={0}
          onClose={() => setIsOpen(false)}
          resolveUrl={resolveUrl}
        />
      )}
    </>
  );
}`;

const codeAudio = `import { Visor, type Medium } from '@ai27-tech/ui';
import { useState } from 'react';

export function MyVisorWithAudio() {
  const [isOpen, setIsOpen] = useState(false);

  const mediums: Medium[] = [
    { id: '1', type: 'IMAGE', label: 'Foto Evidencia' },
    { 
      id: '2', 
      type: 'AUDIO', 
      label: 'Audio Grabado',
      comment: 'Grabación de inspección'
    },
  ];

  const resolveUrl = async (m: Medium) => {
    if (m.type === 'AUDIO') {
      return \`https://example.com/audio/\${m.id}.mp3\`;
    }
    return \`https://example.com/images/\${m.id}.jpg\`;
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Abrir Visor
      </button>
      {isOpen && (
        <Visor
          mediums={mediums}
          onClose={() => setIsOpen(false)}
          resolveUrl={resolveUrl}
        />
      )}
    </>
  );
}`;

const codeControlled = `import { Visor, type Medium } from '@ai27-tech/ui';
import { useState } from 'react';

export function ControlledVisor() {
  const [isOpen, setIsOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const mediums: Medium[] = [/* tu array */];

  const openFromIndex = (index: number) => {
    setStartIndex(index);
    setIsOpen(true);
  };

  return (
    <>
      <div>
        {mediums.map((m, idx) => (
          <button key={m.id} 
                  onClick={() => openFromIndex(idx)}>
            {m.label}
          </button>
        ))}
      </div>
      {isOpen && (
        <Visor
          mediums={mediums}
          initialIndex={startIndex}
          onClose={() => setIsOpen(false)}
          resolveUrl={(m) => \`/api/mediums/\${m.id}\`}
        />
      )}
    </>
  );
}`;

export const BasicImage: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem', background: '#1e1e2e', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0, color: '#e2e8f0' }}>📷 VISOR BÁSICO - COPY ESTE CÓDIGO:</h3>
          <pre
            style={{
              background: '#0f0f1e',
              color: '#7c9df0',
              padding: '1rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              overflow: 'auto',
            }}
          >
            {codeBasic}
          </pre>
        </div>

        <Button onClick={() => setIsOpen(true)}>Abrir Visor</Button>

        {isOpen && (
          <Visor
            mediums={mockMediums.filter((m) => m.type === 'IMAGE')}
            initialIndex={0}
            onClose={() => setIsOpen(false)}
            resolveUrl={mockResolveUrl}
          />
        )}
      </div>
    );
  },
};

export const WithAudio: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem', background: '#1e1e2e', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0, color: '#e2e8f0' }}>🎵 VISOR CON AUDIO - COPY ESTE CÓDIGO:</h3>
          <pre
            style={{
              background: '#0f0f1e',
              color: '#7c9df0',
              padding: '1rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              overflow: 'auto',
            }}
          >
            {codeAudio}
          </pre>
        </div>

        <Button onClick={() => setIsOpen(true)}>Abrir Visor</Button>

        {isOpen && (
          <Visor
            mediums={mockMediums}
            initialIndex={0}
            onClose={() => setIsOpen(false)}
            resolveUrl={mockResolveUrl}
          />
        )}
      </div>
    );
  },
};

export const ControlledExample: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [startIndex, setStartIndex] = useState(0);

    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem', background: '#1e1e2e', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0, color: '#e2e8f0' }}>🎮 VISOR CONTROLADO - COPY ESTE CÓDIGO:</h3>
          <pre
            style={{
              background: '#0f0f1e',
              color: '#7c9df0',
              padding: '1rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              overflow: 'auto',
            }}
          >
            {codeControlled}
          </pre>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {mockMediums.map((m, idx) => (
            <Button
              key={m.id}
              onClick={() => {
                setStartIndex(idx);
                setIsOpen(true);
              }}
            >
              Abrir desde: {m.label}
            </Button>
          ))}
        </div>

        {isOpen && (
          <Visor
            mediums={mockMediums}
            initialIndex={startIndex}
            onClose={() => setIsOpen(false)}
            resolveUrl={mockResolveUrl}
          />
        )}
      </div>
    );
  },
};

export const KeyboardShortcuts: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem', background: '#1e1e2e', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0, color: '#e2e8f0' }}>⌨️ ATAJOS DE TECLADO DISPONIBLES:</h3>
          <div style={{ color: '#e2e8f0', fontSize: '0.9rem', lineHeight: '1.6' }}>
            <p style={{ margin: '0.5rem 0' }}>
              <strong>Navegación:</strong> ← Anterior | → Siguiente
            </p>
            <p style={{ margin: '0.5rem 0' }}>
              <strong>Imagen:</strong> + Acercar | − Alejar | R Rotar | 0 Ajustar pantalla
            </p>
            <p style={{ margin: '0.5rem 0' }}>
              <strong>General:</strong> Esc Cerrar | Rueda del ratón Zoom (en imagen)
            </p>
          </div>
        </div>

        <Button onClick={() => setIsOpen(true)}>Abrir Visor (prueba los atajos)</Button>

        {isOpen && (
          <Visor
            mediums={mockMediums}
            initialIndex={0}
            onClose={() => setIsOpen(false)}
            resolveUrl={mockResolveUrl}
          />
        )}
      </div>
    );
  },
};
