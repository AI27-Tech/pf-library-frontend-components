# Diseño — Componentes de mensajes alineados al contrato v0.1.0-tracer.9

## Estado actual (verificado en `src/components/MessagePanel/`)

| Archivo | Export | Props relevantes hoy |
|---|---|---|
| `MessagePanel.tsx` | `MessagePanel` | `name`, `subtitle`, `avatar`, `presence`, `open`, `onToggle`, `onClose`, `children`, `composer` |
| `MessageList.tsx` | `MessageList`, `MessageBubble`, `MessageDayDivider`, `MessageTypingIndicator` | `MessageBubble`: `own`, `author`, `time`, `avatar`, `children` |
| `MessageComposer.tsx` | `MessageComposer` | `value`, `onChange`, `onSend: () => void`, `placeholder`, `disabled`, `sendButton` |
| `MessageDock.tsx` | `MessageDock`, `MessageDockBar` | `DockConversation`: `id`, `name`, `preview`, `avatar`, `unread` |
| `utils.ts` | `formatSmartTimestamp`, `initials`, `cx`, tipo `Presence` | |

El contrato no tiene `author` ni `time`. `own` no existe en el contrato. Por eso el cambio no es solo de nombres: el modelo de datos cambia.

## Decisiones

| # | Decisión | Opción recomendada | Alternativa | Estado |
|---|---|---|---|---|
| D1 | ¿La librería importa tipos de `@ai27-tech/contracts`? | **No.** La librería define su tipo `Mensaje` con la misma forma. El consumidor (BFF o frontend) convierte del JSON del contrato a este tipo | Depender de `@ai27-tech/contracts` para tomar los tipos generados | **Pendiente de confirmación** |
| D2 | Nombres de campo en TypeScript | camelCase con sustantivos de dominio en español: `secuenciaMensaje`, `audienciaAutor`, `aliasMostrado`, `cuerpo`, `adjuntosIds`, `creadoEn`, `clientMessageId`, `conversacionId` | Copiar el snake_case del contrato (`audiencia_autor`) | **Pendiente de confirmación.** La convención de nombres permite el español en sustantivos de dominio. El snake_case rompería el estilo de la librería |
| D3 | Cómo se calcula `own` | El consumidor pasa `own` (derivado del visor y `actor_real` o `audiencia_autor`) | Que la librería compare `audienciaAutor` con un prop `audienciaVisor` | Recomendada: `own` explícito. Evita que la librería conozca la regla de audiencia (DEC-054, BFF) |
| D4 | Estado de la conversación | Prop `disabled` existente, más un helper documentado que mapea `solo_lectura` y `cerrada` | Prop nueva `estadoConversacion` con la unión del contrato | Recomendada: prop `estadoConversacion` opcional. Si no se pasa, el comportamiento es el actual |
| D5 | Compatibilidad de `MessageBubble` | Cambio incompatible en la versión beta siguiente, documentado en `CHANGELOG.md`. Mantener alias deprecados `author`, `time` durante un beta | Mantener `author`/`time` para siempre y agregar los nuevos | **Pendiente de confirmación** con consumidores (`pf-web-frontend-internal`, `pf-web-frontend-client`) |
| D6 | Versión | Beta siguiente (`0.2.0-beta.7`) por el cambio incompatible | Mantener `beta.6` | Pendiente de confirmación |

## Tipos (nuevo archivo `src/components/MessagePanel/types.ts`)

```ts
/** Audiencia de dominio del autor (contrato `Audiencia`, DEC-054). */
export type AudienciaAutor = "Cliente" | "Interno";

/** Estado del ciclo de vida de la conversación (contrato `EstadoConversacion`). */
export type EstadoConversacion = "abierta" | "solo_lectura" | "cerrada";

/** Mensaje tal como lo entrega la historia del contrato `Mensaje`. */
export interface Mensaje {
  id: string;
  conversacionId: string;
  secuenciaMensaje: number;          // int64 en el contrato; orden por conversación
  clientMessageId: string;
  audienciaAutor: AudienciaAutor;
  aliasMostrado: string;
  cuerpo: string;
  adjuntosIds?: string[];
  creadoEn: string;                  // date-time ISO 8601
  /** Solo audiencia Interno. No se muestra en vista de cliente. */
  actorReal?: string | null;
  /** Solo audiencia Interno. */
  rolAlEnviar?: string | null;
}

/** Entrada de envío (contrato `EnviarMensajeEntrada`). */
export interface EnviarMensajeEntrada {
  clientMessageId: string;
  cuerpo: string;
  adjuntosIds?: string[];
}
```

Nota sobre `secuenciaMensaje`: `number` de JavaScript es exacto hasta 2^53. La secuencia de una conversación no se acerca a ese límite. Si cambia, el tipo se revisa.

Nota sobre `rolAlEnviar: string`: el contrato usa `$ref` a `_comunes.yaml#/components/schemas/Rol`. La librería no tiene el enum de roles, así que usa `string` hasta que se decida si los roles se importan (D1). Esto es una brecha conocida, no una decisión.

## Cambios por componente

### `MessageBubble` (`MessageList.tsx`)

- Props nuevas: `mensaje?: Mensaje` (opcional, para usar el objeto completo) y, como equivalente, `aliasMostrado`, `creadoEn`, `own`, `adjuntos`.
- Si el consumidor pasa `mensaje`, la librería toma de ahí `cuerpo`, `aliasMostrado` y `creadoEn`.
- `adjuntos?: ReactNode` se renderiza debajo del cuerpo.
- `actorReal` y `rolAlEnviar` solo se renderizan si se pasa `slotAuditoria?: ReactNode`. La librería no los muestra por sí misma (R3).
- Props deprecadas (D5): `author` → `aliasMostrado`, `time` → `creadoEn`. Siguen funcionando durante un beta con aviso en JSDoc (`@deprecated`).
- `key` en la lista: responsabilidad de `MessageList` consumidor (`mensaje.id`). Documentado en la historia.

### `MessageList`

- Props nuevas: `hayMas?: boolean`, `onCargarAnteriores?: () => void`, mostrados como un control al inicio de la lista.
- El auto-scroll depende de un prop `ultimaSecuencia?: number`. Si no se pasa, se mantiene el comportamiento actual (depende de cambios en `children`). Si se pasa, solo se dispara cuando cambia (R4.3).

### `MessageComposer`

- `onSend: (envio: EnviarMensajeEntrada) => void`. Compatible con `() => void` porque TypeScript acepta un callback con menos parámetros.
- Genera `clientMessageId` con `crypto.randomUUID()` al inicio de cada envío. Para reintentos, el consumidor pasa `clientMessageIdReintento?: string` o el componente conserva el último id hasta que el envío termina (decisión de implementación, ver tarea 4).
- Recorta el cuerpo y no envía si queda vacío.
- Prop nueva `estadoConversacion?: EstadoConversacion`. Con `solo_lectura` o `cerrada`, el compositor queda deshabilitado y muestra `textoSoloLectura` (texto por defecto en español: "Conversación en solo lectura").

### `DockConversation` (`MessageDock.tsx`)

- Campo nuevo `conversacionId?: string`. `id` se conserva. Si falta `conversacionId`, se usa `id`.

## Compatibilidad y versión

- Cambio incompatible: `MessageBubble` (solo si D5 se aprueba sin alias). Documentar en `CHANGELOG.md` bajo "Changed" con el mapeo `author` → `aliasMostrado`, `time` → `creadoEn`.
- Cambios aditivos: `onSend`, `hayMas`, `estadoConversacion`, `conversacionId`, `mensaje`.
- Publicar como `0.2.0-beta.7` (D6).

## Historias y pruebas (cuando se implemente)

- `MessagePanel.stories.tsx`: migrar los datos de ejemplo al tipo `Mensaje`. Agregar una historia con `audienciaAutor` `Interno` y `Cliente`, y otra con `estadoConversacion="solo_lectura"`.
- Pruebas unitarias: render de `aliasMostrado` y `creadoEn`, `own` alinea el mensaje, `actorReal` no aparece sin `slotAuditoria`, `onSend` recibe `clientMessageId` con formato UUID, reintento con el mismo id, cuerpo vacío no envía, `solo_lectura` deshabilita el compositor.
- Verificar que `dist/` exporta los tipos nuevos (`pnpm build:lib`).

## Brechas con el contrato (no se resuelven en esta spec)

- `_comunes.yaml#/components/schemas/Rol` no está en la librería. Se usa `string`.
- `MessagePanel` no recibe `conversacionId`. Se pasa en `DockConversation` (R8).
- El contrato de `mensajeria` no tiene paginación por `cursor` para mensajes, solo `antes_de` / `despues_de` con `limite`. Por eso `onCargarAnteriores` recibe la secuencia desde el consumidor y no un cursor genérico.
