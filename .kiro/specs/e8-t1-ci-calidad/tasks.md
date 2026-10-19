# Tareas — E8-T1 CI y línea base de calidad (librería de componentes)

- [ ] 1. Agregar el proyecto de vitest `unit` en jsdom
  - Añadir devDependencies: `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`
  - Añadir un segundo proyecto `unit` en `test.projects` de `vite.config.ts` (jsdom, include `src/**/*.test.{ts,tsx}`, setup con jest-dom)
  - Verificar que el proyecto `storybook` existente sigue definido e intacto
  - _Requisitos: R1_

- [ ] 2. Agregar scripts y la prueba mínima
  - Scripts en `package.json`: `test` (`vitest run --project unit`), `test:watch`, `typecheck` (`tsc -b`)
  - Crear `src/components/Button/Button.test.tsx`: render + contenido + onClick
  - Ejecutar `pnpm test` y confirmar verde
  - _Requisitos: R1, R2_

- [ ] 3. Crear el workflow de CI
  - `.github/workflows/ci.yml`: disparo `push` a `pf-lf-m/d/q` + `pull_request`; job `calidad` con install + lint + typecheck + test
  - No tocar `publish.yml`
  - _Requisitos: R3, R4_

- [ ] 3b. Agregar los workflows de promoción
  - Copiar `promotion-pr-dq.yml` y `promotion-pr-qm.yml` de `pf-svc-identidad` sin cambios
  - _Requisitos: R8_

- [ ] 4. Alinear husky (confirmar alcance de prettier)
  - Añadir `husky`, `lint-staged` a devDeps; script `prepare: husky`; config `lint-staged`
  - Crear `.husky/pre-commit` (eslint --fix + tsc -b; prettier solo si se decide introducirlo)
  - Confirmar con el equipo si se introduce prettier en la librería
  - _Requisitos: R5_

- [ ] 5. Subir rama y abrir PR hacia dev
  - `git push -u origin feature/e8-t1-ci-calidad`
  - `gh pr create` hacia `pf-lf-d`; confirmar workflow verde
  - _Requisitos: R3_

- [ ] 6. Prueba negativa deliberada
  - Romper la prueba o un tipo, confirmar rojo, revertir, confirmar verde
  - _Requisitos: R7_

- [ ] 7. Branch protection (requiere permisos de admin)
  - Marcar `calidad` como required en `pf-lf-d` (ver guía compartida)
  - _Requisitos: R6_
