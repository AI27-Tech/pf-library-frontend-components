# Tareas — Componentes de mensajes alineados al contrato v0.1.0-tracer.9

Antes de empezar, resolver D1 a D6 de `design.md`. D5 y D6 dependen de los consumidores.

- [ ] 1. Confirmar decisiones D1 a D6
  - Validar con Product Management, BFF (`pf-svc-bff`) y frontends consumidores.
  - Confirmar que el contrato de referencia es `v0.1.0-tracer.9` y que `go.mod` del BFF apunta a esa versión o planear la subida.
  - _Requisitos: R1.5, R2.4, R5, R6_

- [ ] 2. Crear el tipo `Mensaje` y tipos asociados
  - `src/components/MessagePanel/types.ts` con `AudienciaAutor`, `EstadoConversacion`, `Mensaje`, `EnviarMensajeEntrada`.
  - Exportar desde `MessagePanel/index.ts` y `src/index.ts`.
  - _Requisitos: R1.1 a R1.4_

- [ ] 3. Actualizar `MessageBubble`
  - Props `mensaje`, `aliasMostrado`, `creadoEn`, `own`, `adjuntos`, `slotAuditoria`.
  - Alias deprecados `author` y `time` según D5.
  - Usar `formatSmartTimestamp` de `utils.ts`.
  - _Requisitos: R2.1 a R2.3, R3.1, R3.2_

- [ ] 4. Actualizar `MessageComposer`
  - `onSend` recibe `EnviarMensajeEntrada`. Generar `clientMessageId` con `crypto.randomUUID()`.
  - Recorte de espacios y no enviar cuerpo vacío.
  - Prop `estadoConversacion` y texto `textoSoloLectura`.
  - _Requisitos: R5.1 a R5.4, R6.1_

- [ ] 5. Actualizar `MessageList`
  - Props `hayMas`, `onCargarAnteriores`, `ultimaSecuencia`.
  - Auto-scroll según `ultimaSecuencia` cuando se pase; comportamiento actual si no.
  - _Requisitos: R4.1 a R4.3, R7.1, R7.2_

- [ ] 6. Actualizar `MessageDock`
  - Campo `conversacionId` en `DockConversation`.
  - _Requisitos: R8.1_

- [ ] 7. Pruebas unitarias
  - Casos listados en la sección "Historias y pruebas" de `design.md`.
  - Proyecto `unit` (`pnpm test`).
  - _Requisitos: R2 a R6_

- [ ] 8. Migrar historias de Storybook
  - `MessagePanel.stories.tsx`: datos al tipo `Mensaje`, historias con `Interno`, `Cliente` y `solo_lectura`.
  - _Requisitos: R1, R2, R6_

- [ ] 9. Verificación de la librería
  - `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build:lib` en código 0.
  - Revisar que `dist/index.d.ts` expone `Mensaje`, `AudienciaAutor`, `EstadoConversacion`, `EnviarMensajeEntrada`.
  - _Requisitos: R1.1, R1.2_

- [ ] 10. CHANGELOG y versión
  - Entrada en `CHANGELOG.md` con el mapeo de campos (sección "Changed" y "Added").
  - Subir a la beta siguiente si D6 se aprueba.
  - _Requisitos: Compatibilidad_
