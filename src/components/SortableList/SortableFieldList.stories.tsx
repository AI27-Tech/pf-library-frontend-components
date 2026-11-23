import { useRef, useState, type FormEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MapPin } from "lucide-react";
import { SortableFieldList, type SortableFieldItem } from "./SortableFieldList";
import { Input } from "../Input";
import { FormField } from "../Input/FormField";
import { Form, FormSection, FormActions } from "../Form";
import { Button } from "../Button";
import { Alert } from "../Alert";
import { responsiveStory } from "../../stories/responsiveStory";

const meta = {
  title: "Components/SortableFieldList",
  component: SortableFieldList,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof SortableFieldList>;

export default meta;
type Story = StoryObj<typeof meta>;

interface Destino extends SortableFieldItem {
  valor: string;
}

/** Etiqueta fija de cada posición. No cambia al reordenar. */
const etiquetaDePosicion = (index: number) => `Destino ${index + 1}`;

const destinosIniciales: Destino[] = [
  { id: "d1", label: "Destino 1", required: true, valor: "Veracruz" },
  { id: "d2", label: "Destino 2", required: true, valor: "Tlaxcala" },
  { id: "d3", label: "Destino 3", required: true, valor: "Puebla" },
];

/** Renumera el nombre de cada tarjeta según su posición, para los lectores de pantalla y los botones. */
function renumerar(lista: Destino[]): Destino[] {
  return lista.map((destino, index) => ({ ...destino, label: etiquetaDePosicion(index) }));
}

/** Destinos intermedios: reordenables, con control de texto, quitar y agregar al final. */
export const Destinos: Story = {
  args: { items: destinosIniciales, onReorder: () => {}, slotLabel: etiquetaDePosicion, renderField: () => null },
  render: () => {
    const [destinos, setDestinos] = useState(destinosIniciales);
    const siguienteId = useRef(destinosIniciales.length + 1);
    return (
      <div style={{ maxWidth: 560 }}>
        <SortableFieldList<Destino>
          aria-label="Destinos intermedios"
          items={destinos}
          onReorder={(lista) => setDestinos(renumerar(lista))}
          slotLabel={etiquetaDePosicion}
          renderField={(destino) => (
            <Input
              aria-label={destino.label}
              defaultValue={destino.valor}
              startAdornment={<MapPin aria-hidden="true" />}
            />
          )}
          onRemove={(destino) => setDestinos(renumerar(destinos.filter((d) => d.id !== destino.id)))}
          onAdd={() => {
            siguienteId.current += 1;
            setDestinos((actual) =>
              renumerar([...actual, { id: `d${siguienteId.current}`, label: "", required: true, valor: "" }]),
            );
          }}
          addLabel="Agregar otro destino"
        />
      </div>
    );
  },
};

/** Sin elementos, solo se ve el botón para agregar. */
export const Vacia: Story = {
  args: { items: [], onReorder: () => {}, slotLabel: etiquetaDePosicion, renderField: () => null, onAdd: () => {} },
};

/** Con `disabled`, ningún campo se mueve, se quita ni se agrega. */
export const Deshabilitada: Story = {
  args: { items: destinosIniciales, onReorder: () => {}, slotLabel: etiquetaDePosicion, renderField: () => null },
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <SortableFieldList<Destino>
        aria-label="Destinos intermedios"
        items={destinosIniciales}
        onReorder={() => {}}
        slotLabel={etiquetaDePosicion}
        renderField={(destino) => <Input aria-label={destino.label} defaultValue={destino.valor} disabled />}
        onRemove={() => {}}
        onAdd={() => {}}
        disabled
        addLabel="Agregar otro destino"
      />
    </div>
  ),
};

/**
 * Dentro de un formulario. El estado vive en el portal: la lista recibe `items` y entrega la lista
 * nueva en `onReorder`. Los errores se muestran por campo (`Input state="error"`) al intentar enviar.
 * La lista no va dentro de `FormField`, porque `FormField` inyecta `id` e `invalid` en su hijo.
 */
function FormularioViaje() {
  const [origen, setOrigen] = useState("Ciudad de México");
  const [destinoFinal, setDestinoFinal] = useState("Oaxaca");
  const [destinos, setDestinos] = useState<Destino[]>(destinosIniciales);
  const [intentoEnviar, setIntentoEnviar] = useState(false);
  const [resumen, setResumen] = useState<string | null>(null);
  const siguienteId = useRef(destinosIniciales.length + 1);

  const vacio = (valor: string) => valor.trim() === "";
  const origenInvalido = intentoEnviar && vacio(origen);
  const destinoFinalInvalido = intentoEnviar && vacio(destinoFinal);

  function cambiarValor(id: string, valor: string) {
    setDestinos((actual) => actual.map((d) => (d.id === id ? { ...d, valor } : d)));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIntentoEnviar(true);
    const hayErrores = vacio(origen) || vacio(destinoFinal) || destinos.some((d) => vacio(d.valor));
    if (hayErrores) {
      setResumen(null);
      return;
    }
    setResumen([origen, ...destinos.map((d) => d.valor), destinoFinal].join(" → "));
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <Form onSubmit={onSubmit}>
        <FormField label="Origen" required error={origenInvalido ? "Indica el origen." : undefined}>
          <Input
            value={origen}
            onChange={(event) => setOrigen(event.target.value)}
            startAdornment={<MapPin aria-hidden="true" />}
          />
        </FormField>

        <FormSection
          title="Destinos intermedios"
          description="Agrega destinos intermedios entre el origen y el destino final."
        >
          <SortableFieldList<Destino>
            aria-label="Destinos intermedios"
            items={destinos}
            onReorder={(lista) => setDestinos(renumerar(lista))}
            slotLabel={etiquetaDePosicion}
            renderField={(destino) => (
              <Input
                aria-label={destino.label}
                value={destino.valor}
                onChange={(event) => cambiarValor(destino.id, event.target.value)}
                state={intentoEnviar && vacio(destino.valor) ? "error" : undefined}
                startAdornment={<MapPin aria-hidden="true" />}
              />
            )}
            onRemove={(destino) =>
              setDestinos((actual) => renumerar(actual.filter((d) => d.id !== destino.id)))
            }
            onAdd={() => {
              siguienteId.current += 1;
              const id = `d${siguienteId.current}`;
              setDestinos((actual) => renumerar([...actual, { id, label: "", required: true, valor: "" }]));
            }}
            addLabel="Agregar otro destino"
          />
        </FormSection>

        <FormField
          label="Destino final"
          required
          error={destinoFinalInvalido ? "Indica el destino final." : undefined}
        >
          <Input
            value={destinoFinal}
            onChange={(event) => setDestinoFinal(event.target.value)}
            startAdornment={<MapPin aria-hidden="true" />}
          />
        </FormField>

        {resumen && (
          <Alert variant="success" title="Viaje guardado">
            {resumen}
          </Alert>
        )}

        <FormActions>
          <Button variant="ghost" type="button" onClick={() => setResumen(null)}>
            Cancelar
          </Button>
          <Button type="submit">Guardar viaje</Button>
        </FormActions>
      </Form>
    </div>
  );
}

/** Ejemplo de uso dentro de un formulario, con validación al enviar. */
export const EnFormulario: Story = {
  args: { items: [], onReorder: () => {}, slotLabel: etiquetaDePosicion, renderField: () => null },
  render: () => <FormularioViaje />,
};

const mobileStory: Story = {
  args: { items: [], onReorder: () => {}, slotLabel: etiquetaDePosicion, renderField: () => null },
  render: () => {
    const [destinos, setDestinos] = useState(destinosIniciales);
    return (
      <main>
        <SortableFieldList<Destino>
          aria-label="Destinos intermedios"
          items={destinos}
          onReorder={(lista) => setDestinos(renumerar(lista))}
          slotLabel={etiquetaDePosicion}
          renderField={(destino) => (
            <Input
              aria-label={destino.label}
              defaultValue={destino.valor}
              startAdornment={<MapPin aria-hidden="true" />}
            />
          )}
          onRemove={(destino) => setDestinos(renumerar(destinos.filter((d) => d.id !== destino.id)))}
          onAdd={() => {}}
          addLabel="Agregar otro destino"
        />
      </main>
    );
  },
};

/** Móvil: el control ocupa el ancho disponible y el botón de agregar sigue completo. */
export const Mobile: Story = responsiveStory("mobile", mobileStory);
