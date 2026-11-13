import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Timeline } from "./Timeline";
import type { TimelineItemData } from "./types";
import { orientacionEfectiva, ordenarItems, tramoSolido } from "./timelineUtils";

const pasos: TimelineItemData[] = [
  { id: "SOLICITADO", title: "Solicitado", timestamp: "10 nov, 08:12", status: "completed" },
  { id: "APROBADO", title: "Aprobado", timestamp: "10 nov, 09:03", status: "completed" },
  { id: "EN_TRANSITO", title: "En recorrido", description: "Parada 2 de 3", status: "current" },
  { id: "CERRADO", title: "Cerrado", status: "upcoming" },
];

describe("orientacionEfectiva", () => {
  it("muestra vertical una línea horizontal en un contenedor más angosto que stackBelow", () => {
    expect(orientacionEfectiva("horizontal", 560, 400)).toBe("vertical");
  });

  it("conserva horizontal si el contenedor es igual o más ancho", () => {
    expect(orientacionEfectiva("horizontal", 560, 560)).toBe("horizontal");
  });

  it("usa la orientación pedida sin medida", () => {
    expect(orientacionEfectiva("horizontal", 560, undefined)).toBe("horizontal");
  });
});

describe("tramoSolido", () => {
  it("es sólido solo si el punto que origina el tramo está completado", () => {
    expect(tramoSolido(pasos, 0, false)).toBe(true);
    expect(tramoSolido(pasos, 2, false)).toBe(false);
    expect(tramoSolido(pasos, pasos.length - 1, false)).toBe(false);
  });

  it("con reverse, el tramo lo origina el punto siguiente en el orden de datos", () => {
    const visuales = [...pasos].reverse();
    // En orden visual: CERRADO, EN_TRANSITO, APROBADO, SOLICITADO. El tramo entre EN_TRANSITO y APROBADO
    // lo origina APROBADO (completado), así que es sólido.
    expect(tramoSolido(visuales, 1, true)).toBe(true);
    // El tramo entre CERRADO y EN_TRANSITO lo origina EN_TRANSITO (current): punteado.
    expect(tramoSolido(visuales, 0, true)).toBe(false);
  });
});

describe("ordenarItems", () => {
  it("conserva el índice original al invertir", () => {
    const orden = ordenarItems(pasos, true);
    expect(orden[0]).toEqual({ item: pasos[3], index: 3 });
    expect(orden[3]).toEqual({ item: pasos[0], index: 0 });
  });
});

describe("Timeline", () => {
  it("renderiza una lista ordenada con un punto por elemento y marca el punto actual", () => {
    const { container } = render(<Timeline items={pasos} />);
    const puntos = container.querySelectorAll("li");
    expect(puntos).toHaveLength(4);
    expect(container.querySelector('[aria-current="step"]')).toHaveTextContent("En recorrido");
  });

  it("agrega el texto de estado para lectores de pantalla", () => {
    render(<Timeline items={pasos} />);
    // Dos puntos están completados en el historial de prueba.
    expect(screen.getAllByText("Completado", { selector: ".ui-sr-only" })).toHaveLength(2);
    expect(screen.getByText("En curso", { selector: ".ui-sr-only" })).toBeInTheDocument();
    expect(screen.getByText("Pendiente", { selector: ".ui-sr-only" })).toBeInTheDocument();
  });

  it("usa <time> con dateTime cuando el punto lo trae", () => {
    const { container } = render(
      <Timeline items={[{ id: "a", title: "Creado", timestamp: "10 nov", dateTime: "2026-11-10T08:12:00Z" }]} />,
    );
    const hora = container.querySelector("time");
    expect(hora).toHaveAttribute("dateTime", "2026-11-10T08:12:00Z");
    expect(hora).toHaveTextContent("10 nov");
  });

  it("con reverse muestra el más reciente primero sin cambiar el arreglo", () => {
    const { container } = render(<Timeline items={pasos} reverse />);
    const primero = container.querySelector("li");
    expect(primero).toHaveTextContent("Cerrado");
    expect(pasos[0].id).toBe("SOLICITADO");
  });

  it("con maxVisible oculta puntos y el control se expande y colapsa", async () => {
    const { container } = render(<Timeline items={pasos} maxVisible={2} />);
    expect(container.querySelectorAll("li")).toHaveLength(2);
    const control = screen.getByRole("button", { name: "Mostrar 2 más" });
    expect(control).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(control);
    expect(container.querySelectorAll("li")).toHaveLength(4);
    expect(screen.getByRole("button", { name: "Mostrar menos" })).toHaveAttribute("aria-expanded", "true");
  });

  it("con onItemClick el contenido es un botón y recibe el índice original", async () => {
    const onItemClick = vi.fn();
    render(<Timeline items={pasos} reverse onItemClick={onItemClick} />);
    await userEvent.click(screen.getByRole("button", { name: /Cerrado/ }));
    expect(onItemClick).toHaveBeenCalledWith(pasos[3], 3);
  });

  it("sin onItemClick no hay botones en los puntos", () => {
    render(<Timeline items={pasos} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("sin puntos muestra el estado vacío por defecto y el personalizado si se pasa", () => {
    const { rerender } = render(<Timeline items={[]} />);
    expect(screen.getByRole("status")).toHaveTextContent("Sin eventos");
    rerender(<Timeline items={[]} emptyState={<p>Nada aún</p>} />);
    expect(screen.getByText("Nada aún")).toBeInTheDocument();
  });

  it("con loading muestra esqueletos y ningún punto", () => {
    const { container } = render(<Timeline items={pasos} loading loadingItems={3} />);
    expect(container.querySelectorAll("li")).toHaveLength(0);
    expect(container.querySelectorAll('[aria-busy="true"] > div')).toHaveLength(3);
  });

  it("con 1 punto no dibuja conector", () => {
    const { container } = render(<Timeline items={[pasos[0]]} />);
    expect(container.querySelectorAll("li")).toHaveLength(1);
    expect(container.querySelector('[class*="connector"]')).toBeNull();
  });

  it("reemplaza el icono por defecto por icon", () => {
    render(<Timeline items={[{ id: "a", title: "Revisión", status: "warning", icon: <span>icono propio</span> }]} />);
    expect(screen.getByText("icono propio")).toBeInTheDocument();
  });
});
