import { afterEach, describe, expect, it, vi } from "vitest";
import {
  addDays,
  addMonths,
  buildMonthGrid,
  compareDates,
  daysInMonth,
  formatDisplayDate,
  formatISODate,
  isLeapYear,
  isWithin,
  parseDisplayDate,
  parseISODate,
  today,
  weekdayOf,
} from "./dateUtils";

afterEach(() => {
  vi.useRealTimers();
});

describe("años bisiestos y días del mes", () => {
  it.each([
    [2024, true],
    [2000, true],
    [1900, false],
    [2100, false],
    [2025, false],
  ])("isLeapYear(%i) es %s", (y, expected) => {
    expect(isLeapYear(y)).toBe(expected);
  });

  it("febrero tiene 29 días en año bisiesto y 28 en otro", () => {
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2025, 2)).toBe(28);
  });

  it("los meses de 30 y 31 días son correctos", () => {
    expect(daysInMonth(2026, 4)).toBe(30);
    expect(daysInMonth(2026, 12)).toBe(31);
  });
});

describe("aritmética de fechas", () => {
  it("addDays cruza fin de mes, fin de año y bisiesto", () => {
    expect(formatISODate(addDays({ y: 2025, m: 12, d: 31 }, 1))).toBe("2026-01-01");
    expect(formatISODate(addDays({ y: 2024, m: 2, d: 28 }, 1))).toBe("2024-02-29");
    expect(formatISODate(addDays({ y: 2025, m: 3, d: 1 }, -1))).toBe("2025-02-28");
  });

  it("addMonths desde el día 31 usa el último día del mes destino", () => {
    expect(formatISODate(addMonths({ y: 2025, m: 1, d: 31 }, 1))).toBe("2025-02-28");
    expect(formatISODate(addMonths({ y: 2024, m: 1, d: 31 }, 1))).toBe("2024-02-29");
    expect(formatISODate(addMonths({ y: 2025, m: 3, d: 31 }, 1))).toBe("2025-04-30");
  });

  it("addMonths conserva el día cuando el mes destino lo tiene", () => {
    expect(formatISODate(addMonths({ y: 2025, m: 1, d: 15 }, 1))).toBe("2025-02-15");
  });

  it("addMonths cruza el año hacia adelante y hacia atrás", () => {
    expect(formatISODate(addMonths({ y: 2025, m: 11, d: 10 }, 3))).toBe("2026-02-10");
    expect(formatISODate(addMonths({ y: 2025, m: 1, d: 31 }, -2))).toBe("2024-11-30");
    expect(formatISODate(addMonths({ y: 2025, m: 1, d: 31 }, -13))).toBe("2023-12-31");
  });

  it("weekdayOf devuelve 0 para domingo y 6 para sábado", () => {
    // 2026-01-04 es domingo; 2026-01-10 es sábado.
    expect(weekdayOf({ y: 2026, m: 1, d: 4 })).toBe(0);
    expect(weekdayOf({ y: 2026, m: 1, d: 10 })).toBe(6);
    // 2026-01-01 es jueves.
    expect(weekdayOf({ y: 2026, m: 1, d: 1 })).toBe(4);
  });

  it("compareDates ordena por año, mes y día", () => {
    expect(compareDates({ y: 2025, m: 1, d: 1 }, { y: 2025, m: 1, d: 2 })).toBeLessThan(0);
    expect(compareDates({ y: 2025, m: 2, d: 1 }, { y: 2025, m: 1, d: 31 })).toBeGreaterThan(0);
    expect(compareDates({ y: 2025, m: 1, d: 1 }, { y: 2025, m: 1, d: 1 })).toBe(0);
  });
});

describe("rejilla del mes", () => {
  it("siempre tiene 6 semanas de 7 días", () => {
    const grid = buildMonthGrid(2026, 2, 1);
    expect(grid).toHaveLength(6);
    grid.forEach((week) => expect(week).toHaveLength(7));
  });

  it("con weekStartsOn 1 la primera columna es lunes", () => {
    // Enero 2026 empieza en jueves; la semana del lunes empieza el 29 de diciembre.
    const grid = buildMonthGrid(2026, 1, 1);
    expect(formatISODate(grid[0][0])).toBe("2025-12-29");
    grid.forEach((week) => expect(weekdayOf(week[0])).toBe(1));
  });

  it("con weekStartsOn 0 la primera columna es domingo", () => {
    const grid = buildMonthGrid(2026, 1, 0);
    expect(formatISODate(grid[0][0])).toBe("2025-12-28");
    grid.forEach((week) => expect(weekdayOf(week[0])).toBe(0));
  });

  it("incluye los días de meses vecinos y el primer día del mes en su lugar", () => {
    const grid = buildMonthGrid(2026, 1, 0);
    const flat = grid.flat().map(formatISODate);
    expect(flat).toContain("2025-12-28");
    expect(flat).toContain("2026-01-01");
    expect(flat).toContain("2026-01-31");
    expect(flat).toContain("2026-02-01");
  });
});

describe("texto ISO", () => {
  it("parseISODate acepta fechas válidas, incluido 29 de febrero bisiesto", () => {
    expect(parseISODate("2024-02-29")).toEqual({ y: 2024, m: 2, d: 29 });
    expect(parseISODate("2026-12-31")).toEqual({ y: 2026, m: 12, d: 31 });
  });

  it.each([
    "2025-02-29",
    "2025-13-01",
    "2025-00-10",
    "2025-04-31",
    "2025-1-01",
    "20250101",
    "2025/01/01",
    "",
    "texto",
  ])("parseISODate rechaza %j", (text) => {
    expect(parseISODate(text)).toBeNull();
  });

  it("formatISODate rellena con ceros", () => {
    expect(formatISODate({ y: 2026, m: 3, d: 5 })).toBe("2026-03-05");
  });
});

describe("texto de visualización", () => {
  it.each(["05/03/2026", "05-03-2026", "05.03.2026"])(
    "parseDisplayDate acepta %s con su separador",
    (text) => {
      expect(parseDisplayDate(text)).toEqual({ y: 2026, m: 3, d: 5 });
    },
  );

  it("parseDisplayDate acepta un día y mes de un dígito", () => {
    expect(parseDisplayDate("5/3/2026")).toEqual({ y: 2026, m: 3, d: 5 });
  });

  it("parseDisplayDate ignora espacios alrededor del texto", () => {
    expect(parseDisplayDate("  05/03/2026 ")).toEqual({ y: 2026, m: 3, d: 5 });
  });

  it.each([
    "05/03/26",
    "05/03-2026",
    "31/02/2026",
    "29/02/2025",
    "00/03/2026",
    "05/13/2026",
    "2026/03/05",
    "05 03 2026",
    "",
  ])("parseDisplayDate rechaza %j", (text) => {
    expect(parseDisplayDate(text)).toBeNull();
  });

  it("formatDisplayDate escribe DD/MM/AAAA", () => {
    expect(formatDisplayDate({ y: 2026, m: 3, d: 5 })).toBe("05/03/2026");
  });

  it("formatDisplayDate y parseDisplayDate son inversos", () => {
    const date = { y: 2024, m: 2, d: 29 };
    expect(parseDisplayDate(formatDisplayDate(date))).toEqual(date);
  });
});

describe("límites min y max", () => {
  const min = { y: 2026, m: 1, d: 10 };
  const max = { y: 2026, m: 1, d: 20 };

  it("incluye los extremos del rango", () => {
    expect(isWithin(min, min, max)).toBe(true);
    expect(isWithin(max, min, max)).toBe(true);
  });

  it("rechaza fechas fuera del rango", () => {
    expect(isWithin({ y: 2026, m: 1, d: 9 }, min, max)).toBe(false);
    expect(isWithin({ y: 2026, m: 1, d: 21 }, min, max)).toBe(false);
  });

  it("un límite ausente no restringe", () => {
    expect(isWithin({ y: 1990, m: 1, d: 1 }, undefined, max)).toBe(true);
    expect(isWithin({ y: 2100, m: 1, d: 1 }, min, null)).toBe(true);
    expect(isWithin({ y: 2100, m: 1, d: 1 })).toBe(true);
  });
});

describe("today", () => {
  it("lee la fecha local del reloj", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 5, 23, 59));
    expect(today()).toEqual({ y: 2026, m: 3, d: 5 });
  });
});
