# Requisitos — Select con variante buscable

## Contexto

`Select` (`src/components/Input/Select.tsx`) es un botón que despliega una lista de opciones. No permite escribir para filtrar. Esta spec agrega una variante que conserva el despliegue actual y además permite escribir sobre el campo para filtrar las opciones.

La variante por defecto no cambia de comportamiento visual ni de API. El cambio es aditivo.

## Glosario

- **Variante por defecto**: el `Select` actual, con botón de despliegue.
- **Variante buscable** (`variant="searchable"`): campo de texto que filtra las opciones mientras el usuario escribe. Sigue el patrón ARIA *combobox with listbox popup*.

## Requisitos

### R1. Activación de la variante

1. Cuando el consumidor no pasa `variant`, o pasa `variant="default"`, el componente se comporta igual que hoy.
2. Cuando el consumidor pasa `variant="searchable"`, el campo acepta escritura y muestra la lista filtrada.
3. Los props existentes (`options`, `value`, `defaultValue`, `onChange`, `placeholder`, `size`, `invalid`, `disabled`, `className`, `selectRef`) funcionan igual en ambas variantes.

### R2. Filtrado

1. Al escribir, la lista muestra solo las opciones cuyo `label` contiene el texto escrito.
2. El filtro no distingue mayúsculas, minúsculas ni acentos ("mexico" coincide con "México").
3. Las opciones deshabilitadas (`disabled: true`) aparecen en la lista, deshabilitadas y sin poder elegirse, igual que en la variante por defecto.
4. Sin texto escrito, se muestran todas las opciones.
5. Si ninguna opción coincide, se muestra un mensaje de "sin resultados" dentro del despliegue. Ese mensaje no es seleccionable.

### R3. Selección

1. Hacer clic en una opción o presionar Enter sobre la opción resaltada la selecciona. El campo muestra su `label`, se cierra la lista y se dispara `onChange(value)`.
2. Al seleccionar, el texto escrito se reemplaza por el `label` de la opción elegida.
3. Presionar Escape con la lista abierta cierra la lista y restaura el `label` del valor vigente, descartando el texto escrito.
4. Salir del campo (Tab o clic fuera) cierra la lista. Si el texto no corresponde a una opción elegida, se restaura el `label` del valor vigente.
5. Un valor no coincidente nunca se queda como valor seleccionado.

### R4. Teclado y accesibilidad

1. Flecha abajo y flecha arriba mueven el resaltado entre opciones habilitadas. Al llegar al final o al inicio no dan la vuelta.
2. Flecha abajo abre la lista si está cerrada.
3. El campo expone `role="combobox"`, `aria-expanded`, `aria-controls` (apuntando a la lista), `aria-activedescendant` (opción resaltada) y `aria-autocomplete="list"`.
4. La lista expone `role="listbox"` y cada opción `role="option"` con `aria-selected` y `aria-disabled` cuando corresponda.
5. El foco visible sigue el mismo tratamiento que los demás controles de la librería.
6. Se respeta `prefers-reduced-motion` si la lista usa alguna transición.

### R5. Estados y apariencia

1. `size`, `invalid` y `disabled` producen las mismas alturas, radios y estados visuales que en la variante por defecto. Ambas variantes comparten las mismas clases de campo.
2. No se introducen colores, fuentes ni valores de tamaño fuera de los tokens existentes (ver `components-library-steering.md`, secciones 1 y 3).
3. `aria-invalid` se aplica en la variante buscable igual que en la variante por defecto.
4. **La variante por defecto conserva el mismo DOM y los mismos nombres accesibles que hoy.** Concretamente: el disparador sigue siendo un `<button type="button">` con la clase de trigger (`_trigger_` en el módulo CSS), su nombre accesible sigue siendo el placeholder o el label del valor, y no se agregan roles ARIA de combobox. `FilterBar` y `ImageGrid` dependen de esto.

### R6. Control del valor

1. Modo controlado (`value`) y no controlado (`defaultValue`) funcionan en la variante buscable.
2. Cuando el valor cambia desde fuera, el campo muestra el `label` correspondiente.

### R7. Corrección existente (requiere confirmación, ver `design.md` D1)

1. En la variante por defecto, `defaultValue` debe respetarse aunque el componente reciba `placeholder`. Hoy el valor inicial es `""` cuando hay `placeholder`, así que `defaultValue` se ignora (la expresión `defaultValue ?? placeholder ? "" : undefined` se evalúa como `(defaultValue ?? placeholder) ? ...`).

### R8. Consumidores existentes (regresión)

1. `FilterBar` (usa `Select` por defecto) debe seguir funcionando sin cambios en su código.
2. Los tests del frontend interno que dependen del `Select` deben pasar contra la librería nueva, sin modificarlos. Son como mínimo:
   - `pf-web-frontend-internal/tests/viajes/BandejaViajes.test.tsx` (localiza el trigger por clase `_trigger_` y por rol `button`).
   - `pf-web-frontend-internal/tests/viajes/DashboardMonitoreo.test.tsx` (mismo patrón, selector de vista del `FilterBar`).
   - `pf-web-frontend-internal/tests/viajes/CrearViaje.test.tsx` y `HistoricoViaje.test.tsx`, si usan el `Select` a través de `FormField` o `FilterBar`.
3. Antes de publicar, se registra el resultado de esos tests con la versión actual de la librería (línea base), para distinguir una regresión de un fallo previo.

## Fuera de alcance

- Selección múltiple.
- Carga asíncrona de opciones o búsqueda en servidor.
- Crear opciones nuevas desde el campo.
- Cambios en otros componentes de `Input`.
