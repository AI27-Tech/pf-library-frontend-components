# Diseño — E8-T1 CI y línea base de calidad (librería de componentes)

## Problema

La librería no tiene forma de probar nada en CI: no hay script `test` y el único proyecto de vitest (`storybook`) corre en navegador real, lo que es caro y frágil para un gate de PR. Hay que darle una ruta de prueba unitaria ligera sin romper lo que ya existe.

## Decisiones de diseño

### Un segundo proyecto de vitest en jsdom (no tocar el de storybook)

`vite.config.ts` ya define `test.projects` con un proyecto `storybook`. Se **agrega** un segundo proyecto `unit`:
- Entorno `jsdom` (no navegador). Requiere `jsdom` como devDependency (ya lo usan los portales; se añade aquí).
- `include` acotado a `src/**/*.test.{ts,tsx}` para no colisionar con las stories.
- `setupFiles` con `@testing-library/jest-dom` para matchers de DOM (se añade como devDependency, igual que en los portales).

Así `pnpm test` corre **ambos** proyectos; en CI se invoca solo el proyecto `unit` con `vitest run --project unit` para evitar el navegador. El script `test` del package corre `unit`; el `storybook` queda disponible con su propio invocador si se quiere.

**Alternativa descartada:** reusar el proyecto `storybook` en CI. Exige instalar navegadores y levantar el runner de Storybook en cada PR; más lento y más frágil, justo lo que E8-T1 quiere evitar ("primero que las pruebas corran").

### Scripts en package.json

- `test`: `vitest run --project unit`
- `test:watch`: `vitest --project unit`
- `typecheck`: `tsc -b` (ya existe como parte de `build`; se expone como script propio para el workflow)

### Prueba mínima

`src/components/Button/Button.test.tsx`: render de `<Button>` con `@testing-library/react`, assert de que el texto aparece y responde a `onClick`. `Button` es el componente más simple y ya se exporta desde `index.ts`.

### Husky

Agregar `.husky/pre-commit` equivalente al de los portales, adaptado: `lint-staged` + `tsc -b`. Requiere `husky` y `lint-staged` como devDependencies y el script `prepare: husky`. Config `lint-staged` en `package.json` para `*.{ts,tsx}` → eslint --fix + prettier.

> Nota: la librería hoy no tiene prettier en devDeps. Si no se quiere introducir prettier aquí, el pre-commit se limita a `eslint --fix` + `tsc -b`. Decisión a confirmar en la tarea 4.

## Workflow de CI

Archivo `.github/workflows/ci.yml`, disparo estilo plataforma:
```yaml
on:
  push:
    branches: [pf-lf-m, pf-lf-d, pf-lf-q]
  pull_request:
```

Job `calidad`:
- `pnpm install --frozen-lockfile`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`

Node 22, pnpm (la versión que fije el repo). `publish.yml` no se toca.

## Workflows de promoción (flujo de ramas)

Se copian de `pf-svc-identidad` sin cambios: `promotion-pr-dq.yml` (`on: push: branches: ['*-d']`) y `promotion-pr-qm.yml` (`on: push: branches: ['*-q']`). Derivan la rama destino del sufijo, así que funcionan con `pf-lf-d/q/m`. **No fusionan**; merge manual. No se crea `automerge-promotion.yml`.

> Requiere habilitar en la org "Allow GitHub Actions to create and approve pull requests". Se anota en la guía.

## Compuerta de fusión

Igual que los otros repos: el workflow no bloquea por sí solo. Se entrega guía de branch protection para marcar `calidad` como required en `pf-lf-d`.

## Prueba negativa deliberada

Romper la prueba de `Button` o un tipo, confirmar rojo en el PR, revertir.

## Riesgos

- **Conflicto entre proyectos de vitest:** si el `include` del proyecto `unit` no está bien acotado, podría intentar correr stories como tests. Se acota a `*.test.tsx`.
- **Introducir prettier donde no estaba:** puede reformatear archivos existentes. Por eso el pre-commit de la librería se mantiene mínimo salvo decisión explícita.
