# Tareas — E8-T1 CI y línea base de calidad (librería de componentes)

- [x] 1. Agregar el proyecto de vitest `unit` en jsdom
  - devDependencies añadidas: `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event` (+ `husky`, `lint-staged` para la tarea 4)
  - Segundo proyecto `unit` agregado en `test.projects` de `vite.config.ts` (jsdom, include `src/**/*.test.{ts,tsx}`, setup `vitest.setup.ts`); el proyecto `storybook` queda intacto
  - Para los matchers de jest-dom en typecheck se agregó `src/vitest-env.d.ts` (referencia a `@testing-library/jest-dom/vitest`), excluido del build de publicación en `tsconfig.build.json`
  - _Requisitos: R1_

- [x] 2. Agregar scripts y la prueba mínima
  - Scripts en `package.json`: `test` (`vitest run --project unit`), `test:watch`, `typecheck` (`tsc -b`), `prepare` (`husky`)
  - `src/components/Button/Button.test.tsx`: render, contenido, onClick, disabled y aria-busy — **4 pruebas, pasan**
  - `pnpm test`=0, `pnpm typecheck`=0, `pnpm lint`=0, `pnpm build:lib`=0 (dist sin archivos de test ni el d.ts)
  - _Requisitos: R1, R2_

- [x] 3. Crear el workflow de CI
  - `.github/workflows/ci.yml`: disparo `push` a `pf-lf-m/d/q` + `pull_request`; job `calidad` con install + lint + typecheck + test (solo proyecto `unit`)
  - `publish.yml` sin tocar. Node 22, pnpm 12.3.4. YAML validado.
  - _Requisitos: R3, R4_

- [x] 3b. Agregar los workflows de promoción
  - `promotion-pr-dq.yml` y `promotion-pr-qm.yml` copiados de `pf-svc-identidad` sin cambios. YAML validado.
  - _Requisitos: R8_

- [x] 4. Alinear husky (prettier NO introducido)
  - `husky` y `lint-staged` en devDeps; script `prepare: husky`; config `lint-staged` (`*.{ts,tsx}` → `eslint --fix`)
  - `.husky/pre-commit` creado: `lint-staged` + `tsc -b`. **Decisión: no se introdujo prettier** (no estaba en el repo; reformatearía archivos existentes). Queda abierto para confirmar con el equipo.
  - _Requisitos: R5_

- [ ] 5. Subir rama y abrir PR hacia dev
  - **Pendiente: requiere push, que no se hace sin autorización del usuario.**
  - _Requisitos: R3_

- [ ] 6. Prueba negativa deliberada
  - Romper la prueba o un tipo, confirmar rojo, revertir, confirmar verde
  - _Requisitos: R7_

- [ ] 7. Branch protection (requiere permisos de admin)
  - Marcar `calidad` como required en `pf-lf-d` (ver guía compartida)
  - _Requisitos: R6_
