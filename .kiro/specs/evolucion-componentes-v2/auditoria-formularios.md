# Auditoría de formularios (tarea 18)

**Estado:** 18.1 hecha (revisión de código). 18.2 pendiente: acordar con el equipo qué cambios entran.
**Método:** lectura de CSS y TSX de `src/components/Input/` y `src/components/Form/`. No se ejecutó en navegador ni se midieron alturas. Lo marcado como "por lectura" es una inferencia del código que falta confirmar.
**Fuera de esta pasada:** `SelectSearchable.tsx` (variante `searchable` de `Select`), las stories y `Select.test.tsx`.

---

## 1. Estado actual por control

| Control | Altura | Radio | Foco | Deshabilitado | Error | Solo lectura | Tamaños |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `Input` | Por padding y `font-size` del tamaño (no fija) | `--ui-radius` (4px) | Borde + anillo (`:focus-within`) | Fondo `surface-muted`, opacidad 0.55, cursor | **No se ve** (ver H1). `warning` y `success` sí | No | `sm`, `md`, `lg` |
| `Select` (default) | Igual que `Input` (mismas clases) | `--ui-radius` | Igual que `Input` | Sí | Sí, con `invalid` | No hay prop | `sm`, `md`, `lg` |
| `Textarea` | `min-height: 4.5rem`, redimensionable en vertical | `--ui-radius` | Igual que `Input` | Sí | Sí, con `invalid` | No | `sm`, `md`, `lg` |
| `Checkbox` | Caja fija de 1.15rem | `--ui-radius-sm` (2px) | Anillo en la caja (`focus-visible`) | Opacidad 0.55, cursor | No | No | No tiene |
| `Radio` | Caja fija de 1.15rem, circular | Círculo | Igual que `Checkbox` | Igual que `Checkbox` | No | No | No tiene |
| `Switch` | Pista 2.5 × 1.4rem | Píldora | Anillo en la pista | Igual que `Checkbox` | No | No | No tiene |
| `FormField` | Sin control propio | n/a | n/a | n/a | Texto con `role="alert"`; no marca el control | n/a | n/a |
| `Form` y subcomponentes | Layout | n/a | n/a | n/a | n/a | n/a | n/a |

Los tokens que usan los controles existen en `src/styles/tokens.css` (modo claro y oscuro). `--ui-color-danger-border` existe, pero ningún control lo usa.

---

## 2. Hallazgos

Severidad: **alta** = el usuario no ve o no puede usar una señal; **media** = afecta accesibilidad o consistencia de API; **baja** = cosmético o de convención.

### H1. `Input` no muestra el estado de error (alta)

`Input.tsx` aplica `styles[effectiveState]`. Con `invalid` o `state="error"`, la clase resultante es `styles.error`. `Input.module.css` no define `.error`; define `.invalid`. El borde rojo nunca se aplica. `aria-invalid` sí se pone, así que el control se anuncia como inválido pero no se ve.

`Select` y `Textarea` usan `styles.invalid` y sí se ven. El fallo es solo de `Input`.

Consecuencia: `FormField` con `error` sobre un `Input` muestra solo el texto de error, sin el borde rojo.

Corrección propuesta: mapear `error` a `invalid` en `Input.tsx`, o agregar `.error` como alias. No cambia la API.

### H2. `FormField` no cablea el `Select` (alta)

`FormField` inyecta `id` y `aria-describedby` en su hijo. `SelectDefault` no recibe ninguno de los dos: no los desestructura ni los pasa al botón. Efectos:

- El `<label htmlFor>` apunta a un id que no existe. El `Select` queda sin nombre accesible.
- El texto de error y de ayuda no se asocia al control.

Corrección propuesta: aceptar `id` y `aria-describedby` en `SelectDefault` y pasarlos al `<button>`. Revisar `SelectSearchable` con el mismo criterio (pendiente).

### H3. `FormField` pasa `invalid` a checkbox, radio y switch (media)

`FormField` inyecta `invalid` en todo hijo, incluidos `Checkbox`, `Radio` y `Switch`. Esos componentes no declaran `invalid`, así que la prop termina en el `<input>` por `...props`. Por lectura, React avisa en desarrollo por un atributo no booleano en el DOM. Además, estos controles no tienen estado de error visual, así que el inyectado no tiene efecto.

Corrección propuesta: que `FormField` solo inyecte `invalid` cuando el hijo lo acepta, o que estos controles lo consuman y muestren un estado de error.

### H4. No hay estado de solo lectura (media)

Ningún control define estilos para `readOnly`. `Input` y `Textarea` reciben el atributo por props, pero el usuario no ve diferencia con un campo editable. Hoy `Checkbox`, `Radio` y `Switch` tampoco lo distinguen.

Decisión pendiente: definir la apariencia (por ejemplo, fondo `surface-container-low` y sin cambio de borde al enfocar). Requiere acuerdo de diseño.

### H5. API de estados de validación inconsistente (media)

- `Input`: `state` (`error`, `warning`, `success`) y `invalid` marcado como deprecated.
- `Textarea` y `Select`: solo `invalid`. No pueden mostrar `warning` ni `success`.
- `Checkbox`, `Radio` y `Switch`: no tienen ninguno.

Corrección propuesta: un solo modelo de estados para todos los controles. Si se agrega `state` a `Textarea` y `Select`, es una adición compatible con la API actual.

### H6. Radios y alturas no uniformes (baja)

- `Input` usa radio de 4px (`--ui-radius`). `Checkbox` usa 2px (`--ui-radius-sm`). Puede ser intencional, pero no está documentado.
- La caja de `Checkbox` mide 18.4px. Un `Input` `md` es más alto por padding y `font-size` (estimación, no medida). Un checkbox junto a un campo de texto se ve pequeño.

### H7. `Choice` no tiene tamaños (baja)

`Checkbox`, `Radio` y `Switch` no tienen prop `size`. `Input`, `Textarea` y `Select` sí tienen `sm`, `md` y `lg`. Un formulario denso no puede usar checkbox compactos.

### H8. Convención de idioma y código (baja)

- Los comentarios de `Input.tsx`, `Textarea.tsx`, `Checkbox.tsx`, `Radio.tsx` y `Switch.tsx` están en inglés. La convención del workspace pide español.
- `Form.tsx` define su propio `cx` en lugar de usar `Input/utils.ts`.

### H9. Estilos de `Choice.module.css` (info)

`.nativeInput` se posiciona en absoluto sin que `.choice` sea `position: relative`. El efecto visual es nulo porque el input mide 1px y está recortado. Revisar solo si aparece un desplazamiento en un formulario real.

---

## 3. Estado de las mejoras candidatas (R19.2)

| Candidata | Estado actual |
| --- | --- |
| Alturas y estados unificados | Parcial. Ver H1, H4, H5, H7 |
| `FormField` con indicador de opcional | No existe. Solo hay asterisco para requerido |
| Contador de caracteres | No existe en `Textarea` ni en `FormField` |
| `FormField` con orientación horizontal | No existe. Solo apilado vertical |
| `Input` con `clearable` | No existe. `endAdornment` permitiría montarlo sin cambiar la API |
| `Input` con mostrar/ocultar contraseña | No existe. Mismo caso que `clearable` |
| `FormActions` pegajoso | No existe |
| `FormSection` colapsable | No existe. Es un `fieldset` sin control de colapso |
| `FormRow` | Existe. Apila en una columna por debajo de 560px |

---

## 4. Propuesta para el acuerdo (18.2)

Separar lo que corrige un defecto de lo que agrega funcionalidad.

- **Correcciones sin cambio de API:** H1, H2, H3. Propuesta: entran sin discusión, porque el comportamiento actual no cumple lo que la API promete.
- **Cambios de consistencia:** H4, H5, H7. Requieren decisión de diseño o de API.
- **Convenciones:** H8. Entra al tocar cada archivo, según la convención del workspace.
- **Funcionalidades nuevas:** las candidatas de la sección 3. Cada una se acepta o se descarta. Las que se aceptan pasan a las tareas 24 y 25.

Restricciones del `design.md`: ningún cambio altera la API existente, no se agregan colores nuevos y se reutilizan `Input.module.css`, `Choice.module.css` y `FormField.module.css`.

## 5. Decisiones acordadas (18.2)

Fuente: respuesta del equipo a las preguntas de esta sección. Fecha de la respuesta: pendiente de registrar.

| # | Tema | Decisión | Detalle |
| --- | --- | --- | --- |
| 1 | H1, H2, H3 | **Se corrigen.** | Sin cambio de API. |
| 2 | H4, solo lectura | **Se hace explícito.** | Propuesta de apariencia, usando solo tokens existentes: fondo `--ui-color-surface-container-low`, borde `--ui-color-border-subtle`, texto `--ui-color-text`, cursor `default`. El anillo de foco se mantiene, para que el campo siga siendo visible con teclado. Aplica a `Input`, `Textarea` y `Select`. Pendiente confirmar el detalle visual en Storybook. |
| 3 | Radios | **Se unifican.** | Supuesto: la caja de `Checkbox` y `Radio` usa `--ui-radius` (4px), igual que `Input`. `Switch` mantiene su forma de píldora y `Radio` su forma circular. |
| 4 | Candidatas | **Se aceptan las de la sección 3.** | Supuesto: "de acuerdo" aplica a la lista completa de R19.2. `FormRow` ya existe y no requiere decisión. Pendiente confirmar que la lista esté completa. |

### Lo que sigue

- 18.2 queda cumplida con estas decisiones.
- Las tareas 24 y 25 se detallan en subtareas a partir de esta tabla. Eso queda para el siguiente paso.
