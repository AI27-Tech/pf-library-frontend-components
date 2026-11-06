# Requisitos — Componentes de mensajes alineados al contrato v0.1.0-tracer.9

## Contexto

Los componentes de mensajería (`src/components/MessagePanel/`) se crearon antes de que el contrato publicara la mensajería. Hoy modelan una conversación genérica: `author`, `time`, `own`, `text`. El contrato `@ai27-tech/contracts` en su último tag, `v0.1.0-tracer.9`, define la forma real de un mensaje. Esta spec alinea los componentes con esa forma.

Fuente verificada: `contracts/openapi/mensajeria.yaml` en el tag `v0.1.0-tracer.9`, schemas `Mensaje`, `PaginaMensajes`, `EnviarMensajeEntrada`, `Conversacion`, `Audiencia` y `EstadoConversacion`. El cliente TypeScript generado (`packages/api-client-ts`) tiene las mismas rutas.

## Mapeo de campos (contrato → librería)

| Campo del contrato `Mensaje` | Tipo en contrato | Estado en la librería hoy | Requisito |
|---|---|---|---|
| `id` | string (Id) | No existe | R1 |
| `conversacion_id` | string (Id) | No existe | R1 |
| `secuencia` | int64, orden por conversación | No existe; el orden lo decide quien llama | R1, R4 |
| `client_message_id` | string (Id), idempotencia | No existe | R1, R5 |
| `audiencia_autor` | enum `Cliente` \| `Interno` | No existe; `own` es un booleano | R1, R3 |
| `alias_mostrado` | string | Equivale a `author` | R1, R2 |
| `actor_real` | uuid, nullable, solo Interno | No existe | R3 |
| `rol_al_enviar` | rol, nullable, solo Interno | No existe | R3 |
| `cuerpo` | string | Equivale a `text` (children) | R1, R2 |
| `adjuntos_ids` | array de Id | No existe | R2 |
| `creado_en` | date-time | Equivale a `time` (string) | R1, R2 |

Otros schemas del mismo contrato que afectan a los componentes:

- `Conversacion.estado`: `abierta` | `solo_lectura` | `cerrada`. Con `solo_lectura` o `cerrada` no hay envío.
- `PaginaMensajes`: `items` y `hay_mas`. La historia se pide con `antes_de` / `despues_de`.
- `EnviarMensajeEntrada`: `client_message_id` y `cuerpo` son obligatorios. `adjuntos_ids` es opcional.

## Glosario

- **Mensaje de contrato**: objeto que cumple el schema `Mensaje` del tag `v0.1.0-tracer.9`.
- **Audiencia**: `Cliente` o `Interno`. Es la audiencia de dominio del autor (DEC-054), no el claim `aud`.
- **Visor**: quien consulta la conversación. No viene en el contrato. `own` depende del visor.

## Requisitos

### R1. Tipo `Mensaje` de la librería

1. La librería exporta un tipo `Mensaje` con los campos del contrato y su misma nulabilidad y opcionalidad.
2. `audiencia_autor` se modela como unión de cadenas `"Cliente" | "Interno"`. Los valores se preservan exactamente.
3. `secuencia` es un entero. La librería no lo convierte a `number` con redondeo ni lo reemplaza por `creado_en`.
4. Los nombres de campo del tipo siguen el contrato, en camelCase de TypeScript, y conservan los sustantivos de dominio en español (ver `naming-conventions.md`, sección 4). Ejemplos: `secuenciaMensaje`, `audienciaAutor`, `clientMessageId` (D2).
5. El tipo no importa `@ai27-tech/contracts`. La librería es un paquete de UI y no debe depender del paquete de contratos (D1).

### R2. Render de un mensaje

1. `MessageBubble` muestra `cuerpo`, `aliasMostrado` y `creadoEn` (formateado con el formateador existente en `utils.ts`).
2. `MessageBubble` no inventa datos. Si falta `aliasMostrado`, no muestra un nombre.
3. Los adjuntos se muestran por medio de un slot (`adjuntos?: ReactNode`). La librería no conoce URLs ni descarga bytes.
4. Un mensaje con `audienciaAutor` distinto del visor se alinea a un lado y uno propio al otro. Ese cálculo lo hace el consumidor y lo pasa en `own`, porque el contrato no contiene el visor (D3).

### R3. Campos solo internos

1. `actorReal` y `rolAlEnviar` son opcionales en el tipo y no se renderizan por defecto.
2. Si el consumidor pasa `actorReal` o `rolAlEnviar`, la librería los expone solo en un slot explícito de auditoría. Nunca se muestran en la vista de cliente.
3. La librería no decide la audiencia del visor. Esa regla vive en el BFF.

### R4. Orden por secuencia

1. `MessageList` muestra los mensajes en el orden que recibe. No reordena por `creadoEn`.
2. Las claves de React usan `id` (o `clientMessageId` mientras el envío está pendiente). No usan el índice ni `creadoEn`.
3. El auto-scroll se dispara cuando cambia la última `secuencia`, no cuando cambia la longitud de la lista.

### R5. Envío e idempotencia

1. `MessageComposer` genera `clientMessageId` (UUID v4) por cada envío nuevo y lo entrega en `onSend`.
2. `onSend` pasa a recibir `{ cuerpo, clientMessageId }`. El cambio es aditivo: un callback sin parámetros sigue compilando.
3. Si el consumidor reintenta, usa el mismo `clientMessageId`. El componente no genera uno nuevo para un reintento.
4. El compositor no envía cuerpos vacíos (`minLength: 1` del contrato) y recorta espacios al inicio y final.

### R6. Estado de la conversación

1. Cuando el consumidor indica que la conversación está en `solo_lectura` o `cerrada`, `MessageComposer` se deshabilita y muestra un texto de estado.
2. La librería no calcula el estado. Recibe `estadoConversacion` o `disabled` desde fuera (D4).

### R7. Historia y paginación

1. `MessageList` acepta `hayMas` y `onCargarAnteriores`. Si `hayMas` es verdadero, muestra un control para pedir más historia.
2. La librería no pide datos. El consumidor llama a `listarMensajes?antes_de=<secuencia más antigua>`.

### R8. Dock de conversaciones

1. `DockConversation` puede recibir `conversacionId`. El campo `id` actual se conserva para compatibilidad.
2. El indicador de no leídos (`unread`) lo calcula el consumidor a partir de `ultima_secuencia` y el recibo de lectura. La librería solo lo muestra.

## Compatibilidad

- `MessageBubble` cambia su API: `author`, `time` y `own` se reemplazan por `aliasMostrado`, `creadoEn` y `own`. Es un cambio incompatible para los consumidores actuales. Ver D5 en `design.md`.
- El cambio de `onSend` es aditivo.
- Los props de `MessagePanel` y `MessageDock` no se eliminan.

## Fuera de alcance

- Edición o borrado de mensajes. El contrato no los soporta en V1.
- Adjuntos: solo el slot. La subida y la descarga las hace el consumidor con `crearIntencionSubida`.
- Realtime: la librería no abre conexiones SSE.
- Panel de auditoría: no se construye aquí.
- Cambios en el paquete de contratos.
