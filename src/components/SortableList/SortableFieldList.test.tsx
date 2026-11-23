import { useState, type FormEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SortableFieldList, type SortableFieldItem } from "./SortableFieldList";
import { indexFromMidpoints, moveItem } from "./sortableUtils";

const destinos: SortableFieldItem[] = [
  { id: "d1", label: "Destino 1", required: true },
  { id: "d2", label: "Destino 2", required: true },
  { id: "d3", label: "Destino 3", required: true },
];

function renderLista(overrides: Partial<Parameters<typeof SortableFieldList>[0]> = {}) {
  return render(
    <SortableFieldList
      items={destinos}
      onReorder={() => {}}
      slotLabel={(index) => `Destino ${index + 1}`}
      renderField={(item) => <input aria-label={`Valor de ${item.label}`} />}
      {...overrides}
    />,
  );
}

/** Lista con estado: aplica cada reordenamiento como lo haría el portal. */
function ListaConEstado() {
  const [items, setItems] = useState<SortableFieldItem[]>(destinos);
  return (
    <SortableFieldList
      items={items}
      onReorder={(lista) => setItems(lista)}
      slotLabel={(index) => `Destino ${index + 1}`}
      renderField={(item) => <input aria-label={`Valor de ${item.label}`} defaultValue={item.label} />}
    />
  );
}

describe("moveItem", () => {
  it("mueve un elemento hacia abajo y hacia arriba", () => {
    expect(moveItem(["a", "b", "c"], 0, 2)).toEqual(["b", "c", "a"]);
    expect(moveItem(["a", "b", "c"], 2, 0)).toEqual(["c", "a", "b"]);
  });

  it("no cambia nada si origen y destino son iguales o el origen no existe", () => {
    expect(moveItem(["a", "b"], 1, 1)).toEqual(["a", "b"]);
    expect(moveItem(["a", "b"], 5, 0)).toEqual(["a", "b"]);
  });

  it("limita el destino al rango de la lista y no modifica la original", () => {
    const original = ["a", "b", "c"];
    expect(moveItem(original, 0, 99)).toEqual(["b", "c", "a"]);
    expect(original).toEqual(["a", "b", "c"]);
  });
});

describe("indexFromMidpoints", () => {
  const mids = [20, 60, 100];

  it("elige la fila cuyo centro está más cerca", () => {
    expect(indexFromMidpoints(mids, 10)).toBe(0);
    expect(indexFromMidpoints(mids, 75)).toBe(1);
    expect(indexFromMidpoints(mids, 500)).toBe(2);
    expect(indexFromMidpoints(mids, -500)).toBe(0);
  });

  it("devuelve 0 sin filas", () => {
    expect(indexFromMidpoints([], 10)).toBe(0);
  });
});

describe("SortableFieldList", () => {
  it("muestra la etiqueta, el asterisco y el control de cada elemento", () => {
    renderLista();
    expect(screen.getByText("Destino 1")).toBeInTheDocument();
    expect(screen.getAllByText("*")).toHaveLength(3);
    expect(screen.getByLabelText("Valor de Destino 2")).toBeInTheDocument();
  });

  it("no muestra asterisco en un elemento que no es obligatorio", () => {
    renderLista({ items: [{ id: "x", label: "Opcional" }] });
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("muestra un icono de quitar por fila y llama onRemove con el elemento", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    renderLista({ onRemove });
    expect(screen.getAllByRole("button", { name: /^Quitar/ })).toHaveLength(3);
    await user.click(screen.getByRole("button", { name: "Quitar Destino 2" }));
    expect(onRemove).toHaveBeenCalledWith(destinos[1]);
  });

  it("no muestra quitar si no hay onRemove", () => {
    renderLista();
    expect(screen.queryByRole("button", { name: /^Quitar/ })).not.toBeInTheDocument();
  });

  it("agrega al final con el botón de agregar, con el texto que se pase en addLabel", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    renderLista({ onAdd, addLabel: "Agregar otro destino" });
    await user.click(screen.getByRole("button", { name: "Agregar otro destino" }));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it("reordena con teclado y devuelve la lista nueva con el cambio", async () => {
    const user = userEvent.setup();
    const onReorder = vi.fn();
    renderLista({ onReorder });
    screen.getByRole("button", { name: "Reordenar Destino 1" }).focus();
    await user.keyboard(" {ArrowDown}{ArrowDown} ");
    const [lista, cambio] = onReorder.mock.calls[0];
    expect(lista.map((item: SortableFieldItem) => item.id)).toEqual(["d2", "d3", "d1"]);
    expect(cambio).toEqual({ id: "d1", from: 0, to: 2 });
  });

  it("no mueve más allá de los extremos", async () => {
    const user = userEvent.setup();
    const onReorder = vi.fn();
    renderLista({ onReorder });
    screen.getByRole("button", { name: "Reordenar Destino 1" }).focus();
    await user.keyboard(" {ArrowUp}{ArrowUp} ");
    expect(onReorder).not.toHaveBeenCalled();
  });

  it("Escape cancela sin llamar a onReorder y lo anuncia", async () => {
    const user = userEvent.setup();
    const onReorder = vi.fn();
    renderLista({ onReorder });
    screen.getByRole("button", { name: "Reordenar Destino 1" }).focus();
    await user.keyboard(" {ArrowDown}{Escape}");
    expect(onReorder).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent("Reordenamiento cancelado");
  });

  it("anuncia la posición a lectores de pantalla", async () => {
    const user = userEvent.setup();
    renderLista();
    screen.getByRole("button", { name: "Reordenar Destino 1" }).focus();
    await user.keyboard(" ");
    expect(screen.getByRole("status")).toHaveTextContent("Destino 1 tomado. Posición 1 de 3.");
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("status")).toHaveTextContent("Destino 1, posición 2 de 3.");
  });

  it("con disabled no reordena, no quita y no agrega", async () => {
    const user = userEvent.setup();
    const onReorder = vi.fn();
    const onRemove = vi.fn();
    const onAdd = vi.fn();
    renderLista({ onReorder, onRemove, onAdd, disabled: true });
    expect(screen.getByRole("button", { name: "Reordenar Destino 1" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Quitar Destino 1" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Agregar" }));
    expect(onAdd).not.toHaveBeenCalled();
    expect(onReorder).not.toHaveBeenCalled();
    expect(onRemove).not.toHaveBeenCalled();
  });

  it("un elemento con disabled no se puede mover", () => {
    renderLista({ items: [{ ...destinos[0], disabled: true }, destinos[1]] });
    expect(screen.getByRole("button", { name: "Reordenar Destino 1" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Reordenar Destino 2" })).toBeEnabled();
  });

  it("dentro de un form, agregar y quitar no envían el formulario", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <SortableFieldList
          items={destinos}
          onReorder={() => {}}
          slotLabel={(index) => `Destino ${index + 1}`}
          renderField={() => null}
          onRemove={() => {}}
          onAdd={() => {}}
        />
      </form>,
    );
    await user.click(screen.getByRole("button", { name: "Agregar" }));
    await user.click(screen.getByRole("button", { name: "Quitar Destino 1" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("al reordenar, las etiquetas de posición se quedan y la tarjeta cambia de posición", async () => {
    const user = userEvent.setup();
    render(<ListaConEstado />);
    screen.getByRole("button", { name: "Reordenar Destino 1" }).focus();
    await user.keyboard(" {ArrowDown} ");

    const etiquetas = screen
      .getAllByRole("listitem")
      .map((li) => li.querySelector("span")?.firstChild?.textContent);
    expect(etiquetas).toEqual(["Destino 1", "Destino 2", "Destino 3"]);
    const valores = screen.getAllByRole("textbox").map((el) => (el as HTMLInputElement).value);
    expect(valores).toEqual(["Destino 2", "Destino 1", "Destino 3"]);
  });

  it("los textos se cambian con labels", () => {
    renderLista({ onRemove: () => {}, labels: { remove: (nombre) => `Eliminar ${nombre}` } });
    expect(screen.getByRole("button", { name: "Eliminar Destino 3" })).toBeInTheDocument();
  });
});
