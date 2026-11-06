# Diseño — Select con variante buscable

## Estado actual (verificado en `src/components/Input/Select.tsx`)

- Un `<button>` dispara `isOpen`. La lista se renderiza como `div` con `button` por opción.
- No hay navegación por teclado ni `role` ARIA de combobox o listbox.
- El filtro no existe.
- El valor inicial usa `defaultValue ?? placeholder ? "" : undefined`. Por precedencia de operadores, `defaultValue` se ignora cuando hay `placeholder` (ver R7).
- Estilos: `Input.module.css` (campo y tamaños), `SelectCustom.module.css` (wrapper, disparador, lista).

## Decisiones

| # | Decisión | Opción recomendada | Alternativa | Estado |
|---|---|---|---|---|
| D1 | Corregir la precedencia de `defaultValue ?? placeholder` (R7) | Corregir en esta spec: `defaultValue ?? ""` cuando hay `placeholder` | Dejarlo como está y abrir un bug aparte | **Pendiente de confirmación** |
| D2 | Textos visibles ("Sin resultados", placeholder de búsqueda) | Props con valor por defecto en español: `noResultsText`, `searchPlaceholder` | Solo en inglés, como los textos actuales ("Select...") | **Pendiente de confirmación** |
| D3 | Cómo se activa la variante | `variant?: "default" \| "searchable"` | Prop booleana `searchable` | Recomendada: `variant`, pedida así en el requerimiento |

Ninguna de estas decisiones contradice `components-library-steering.md`. D1 cambia el comportamiento de la variante por defecto, por eso requiere confirmación.

## API pública (aditiva)

```ts
export type SelectVariant = "default" | "searchable";

export interface SelectProps {
  // ...props existentes sin cambios...
  /** Variante. "searchable" permite escribir para filtrar. Por defecto: "default". */
  variant?: SelectVariant;
  /** Placeholder del campo de búsqueda. Solo variante "searchable". */
  searchPlaceholder?: string;   // D2
  /** Texto cuando no hay coincidencias. Solo variante "searchable". */
  noResultsText?: string;       // D2, por defecto "Sin resultados"
}
```

`SelectOption` y `SelectProps` siguen exportados desde `src/components/Input/index.ts` y `src/index.ts`. Ningún prop se elimina ni se renombra.

## Estructura

- `Select.tsx` conserva el componente público y decide la variante. La variante por defecto queda como está, salvo la corrección de D1.
- `SelectSearchable.tsx` (nuevo, mismo directorio): implementa la variante buscable. Recibe las mismas props relevantes que `Select`. No se exporta desde `index.ts`; solo lo usa `Select`.
- `filterOptions.ts` (nuevo, mismo directorio): función pura `filterOptions(options, query)`. Normaliza con `String.prototype.normalize("NFD")` y quita marcas diacríticas. Compara con `includes` sobre el texto en minúsculas. Es la única fuente de la regla de filtrado y la prueba unitaria la cubre directamente.
- Estilos: se reutilizan `styles.field`, `styles[size]`, `styles.invalid`, `styles.disabled` de `Input.module.css`, y `selectStyles.dropdown`, `selectStyles.option`, `selectStyles.optionSelected` de `SelectCustom.module.css`. Si hace falta una clase para el campo de texto, se agrega en `SelectCustom.module.css` usando solo tokens existentes.

## Comportamiento de la variante buscable

Estado interno:

- `query: string`: texto escrito. Vacío cuando no hay edición.
- `isOpen: boolean`.
- `activeIndex: number`: índice de la opción resaltada dentro de las opciones visibles y habilitadas. `-1` si ninguna.
- `isEditing: boolean`: `true` desde que el usuario escribe hasta que selecciona, cierra o pierde el foco.

Reglas:

1. El texto mostrado en el campo es `query` mientras `isEditing` es `true`. Si no, es el `label` del valor vigente, o `placeholder` si no hay valor.
2. Escribir abre la lista, pone `isEditing = true` y recalcula `visible = filterOptions(options, query)`.
3. `activeIndex` se reinicia al primer habilitado visible cada vez que cambia `query`.
4. Enter con `activeIndex >= 0` ejecuta la selección. Sin resaltado no hace nada.
5. Escape cierra, pone `isEditing = false` y restaura el texto del valor vigente.
6. Blur del campo cierra y restaura igual que Escape. El `mousedown` en una opción usa `preventDefault` para que el blur no cancele el clic.
7. La selección llama a `onChange(value)` en modo no controlado y en el controlado, igual que la variante por defecto.

Accesibilidad (patrón ARIA combobox con listbox):

- Input: `role="combobox"`, `aria-expanded={isOpen}`, `aria-controls={listboxId}`, `aria-autocomplete="list"`, `aria-activedescendant={activeId | undefined}`, `aria-invalid` cuando aplica.
- Lista: `id={listboxId}`, `role="listbox"`. Cada opción: `id`, `role="option"`, `aria-selected`, `aria-disabled` cuando aplica.
- `listboxId` se genera con `useId()` de React, no con un contador global.

## Tests (cuando se implemente)

Proyecto `unit` de vitest, con `@testing-library/react` y `@testing-library/user-event` (ya instalados por E8-T1):

- `filterOptions`: sin texto, coincidencia parcial, sin distinguir acentos ni mayúsculas, sin coincidencias.
- Escribir filtra, Enter selecciona, Escape restaura, Tab cierra.
- Flechas no dan la vuelta y omiten opciones deshabilitadas.
- Atributos ARIA presentes y `aria-activedescendant` apunta a una opción existente.
- Modo controlado y no controlado.
- R7: `defaultValue` con `placeholder` muestra el label de `defaultValue`.

## Historias de Storybook

En `Select.stories.tsx`, agregar `Searchable`, `SearchableWithoutResults` y `SearchableDisabledOptions`. Los stories existentes no cambian.

## Riesgos

- El cambio de `SelectCustom.module.css` afecta la variante por defecto si se toca una clase compartida. Por eso la clase nueva se agrega sin modificar las existentes.
- Cambiar la precedencia de `defaultValue` (D1) puede alterar pantallas que dependían del valor vacío. Revisar los consumidores antes de publicar (`pf-web-frontend-internal`, `pf-web-frontend-client`).
