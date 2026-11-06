# Tareas — Componentes de mensajes alineados al contrato v0.1.0-tracer.9

Antes de empezar, resolver D1 a D6 de `design.md`. D5 y D6 dependen de los consumidores.

- [-] 1. Confirmar decisiones D1 a D6
  - Implementado con las opciones recomendadas en `design.md`: D1 no importa contratos, D2 nombres en español camelCase, D3 `own` explícito, D4 `estadoConversacion`, D5 alias `author`/`time` deprecados, D6 sin subir versión.
  - Pendiente: validar con Product Management, BFF (`pf-svc-bff`) y frontends consumidores.
  - Confirmado: el tag `v0.1.0-tracer.9` existe y `mensajeria.yaml` contiene los schemas `Mensaje`, `PaginaMensajes`, `EnviarMensajeEntrada`, `Conversacion`, `Audiencia` y `EstadoConversacion`.
  - Pendiente: confirmar que `go.mod` del BFF apunta a `tracer.9` o planear la subida.
  - _Requisitos: R1.5, R2.4, R5, R6_

- [x] 2. Crear el tipo `Mensaje` y tipos asociados
  - `src/components/MessagePanel/types.ts` con `AudienciaAutor`, `EstadoConversacion`, `Mensaje`, `EnviarMensajeEntrada`.
  - Exportados desde `MessagePanel/index.ts` y `src/index.ts`.
  - _Requisitos: R1.1 a R1.4_

- [x] 3. Actualizar `MessageBubble`
  - Props `mensaje`, `aliasMostrado`, `creadoEn`, `own`, `adjuntos`, `slotAuditoria`.
  - Alias deprecados `author` y `time` (D5), con `@deprecated` en JSDoc.
  - Fecha con `formatSmartTimestamp`. Nota: ese formateador devuelve texto en inglés ("Today", "days ago"), no en español.
  - _Requisitos: R2.1 a R2.3, R3.1, R3.2_

- [x] 4. Actualizar `MessageComposer`
  - `onSend` recibe `EnviarMensajeEntrada`. `clientMessageId` con `generarClientMessageId()` (`crypto.randomUUID` con respaldo).
  - Recorte de espacios y no enviar cuerpo vacío.
  - Prop `estadoConversacion` y `textoSoloLectura`.
  - _Requisitos: R5.1 a R5.4, R6.1_

- [x] 5. Actualizar `MessageList`
  - Props `hayMas`, `onCargarAnteriores`, `ultimaSecuencia`.
  - Con `ultimaSecuencia`, el auto-scroll solo ocurre cuando cambia. Sin ella, se mantiene el comportamiento anterior.
  - _Requisitos: R4.1 a R4.3, R7.1, R7.2_

- [x] 6. Actualizar `MessageDock`
  - Campo `conversacionId` en `DockConversation`. `onSelect` recibe `conversacionId ?? id`.
  - _Requisitos: R8.1_

- [x] 7. Pruebas unitarias
  - `MessagePanel.test.tsx`: 13 pruebas nuevas. Proyecto `unit` (`pnpm test`): 36 de 36 pasan.
  - _Requisitos: R2 a R6_

- [x] 8. Migrar historias de Storybook
  - `MessagePanel.stories.tsx` usa el tipo `Mensaje`. Historias nuevas: `VistaCliente`, `VistaInternaConAuditoria`, `SoloLectura`.
  - _Requisitos: R1, R2, R6_

- [x] 9. Verificación de la librería
  - `pnpm lint` (sobre `src`), `pnpm typecheck`, `pnpm test` y `pnpm build:lib` pasan.
  - `dist/index.d.ts` exporta `Mensaje`, `AudienciaAutor`, `EstadoConversacion` y `EnviarMensajeEntrada`.
  - Nota: `pnpm lint` sin argumentos recorre `dist/` y `storybook-static/` después de un build y falla con reglas no encontradas. Es un problema de configuración de ESLint aparte de esta spec.
  - _Requisitos: R1.1, R1.2_

- [x] 10. CHANGELOG y versión
  - Entradas en `CHANGELOG.md`: Agregado, Cambiado y Obsoleto, movidas a la sección `0.2.0-beta.7`.
  - Versión subida a `0.2.0-beta.7` en `package.json` (rama `chore/version-0.2.0-beta.7`). D6 se tomó como aprobado con la opción recomendada; falta confirmarlo.
  - _Requisitos: Compatibilidad_
