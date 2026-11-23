/**
 * Formatos de captura de `Input`. Cada formato define qué caracteres se aceptan;
 * lo demás se descarta al escribir, pegar o soltar texto.
 *
 * - `text`: sin restricción.
 * - `digits`: solo dígitos (códigos, folios, CP). Conserva ceros a la izquierda.
 * - `integer`: entero con signo `-` opcional al inicio.
 * - `decimal`: número con un solo punto decimal y signo `-` opcional al inicio.
 * - `phone`: dígitos, espacios, `-`, `(`, `)` y un `+` solo al inicio.
 * - `letters`: letras (con acentos), espacios, apóstrofo, punto y guion. Sin dígitos.
 * - `alphanumeric`: letras y dígitos, sin espacios ni símbolos (placas, contenedores).
 * - `email`: sin espacios.
 */
export type InputFormat =
  | "text"
  | "digits"
  | "integer"
  | "decimal"
  | "phone"
  | "letters"
  | "alphanumeric"
  | "email";

/** Atributo `inputMode` que corresponde a cada formato (teclado móvil adecuado). */
export const INPUT_MODE_BY_FORMAT: Partial<
  Record<InputFormat, "numeric" | "decimal" | "tel" | "email">
> = {
  digits: "numeric",
  integer: "numeric",
  decimal: "decimal",
  phone: "tel",
  email: "email",
};

/** Deja solo el signo `-` inicial; elimina cualquier otro. */
function keepLeadingMinus(text: string): string {
  const negative = text.startsWith("-");
  return (negative ? "-" : "") + text.replace(/-/g, "");
}

/** Deja solo el primer punto decimal. */
function keepFirstDot(text: string): string {
  const first = text.indexOf(".");
  if (first === -1) return text;
  return text.slice(0, first + 1) + text.slice(first + 1).replace(/\./g, "");
}

/**
 * Elimina los caracteres que el formato no admite. Es una función pura:
 * `sanitizeInput("digits", "12ab3") === "123"`.
 *
 * Un valor intermedio como `"-"` o `"1."` se conserva para no estorbar al escribir;
 * la validez del número final queda a cargo del portal.
 */
export function sanitizeInput(format: InputFormat, text: string): string {
  switch (format) {
    case "text":
      return text;
    case "digits":
      return text.replace(/\D/g, "");
    case "integer":
      return keepLeadingMinus(text.replace(/[^\d-]/g, ""));
    case "decimal":
      return keepFirstDot(keepLeadingMinus(text.replace(/[^\d.-]/g, "")));
    case "phone": {
      const plus = text.startsWith("+") ? "+" : "";
      return plus + text.replace(/[^\d\s()-]/g, "");
    }
    case "letters":
      return text.replace(/[^\p{L}\p{M}\s'.-]/gu, "");
    case "alphanumeric":
      return text.replace(/[^\p{L}\p{M}\p{N}]/gu, "");
    case "email":
      return text.replace(/\s/g, "");
  }
}
