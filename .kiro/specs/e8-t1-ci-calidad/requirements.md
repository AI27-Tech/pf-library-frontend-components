# E8-T1 — CI y línea base de calidad (librería de componentes)

| | |
| --- | --- |
| **Épica / eje** | E8 — frontend (eje de entrega, no épica funcional) |
| **Tarea** | E8-T1 — CI y línea base de calidad de los tres repos de frontend |
| **Repositorio** | `pf-library-frontend-components` (`@ai27-tech/ui`) |
| **Rama base** | `pf-lf-d` (dev) |
| **Rama de trabajo** | `feature/e8-t1-ci-calidad` |
| **Fuente** | `ai27-platform-context/docs/historias-tecnicas/E8-panel-admin.md` → E8-T1 |
| **Dependencias** | Ninguna |

## Alcance de este spec

E8-T1 abarca tres repos. Este spec cubre **solo** `pf-library-frontend-components`. Los otros dos tienen su propio spec.

De los tres repos, la librería es la que menos validación tiene: su único workflow es `publish.yml`, que se dispara al publicar un release y **no valida nada antes**. Y no existe script `test`.

E8-T1, por instrucción del equipo, incluye también el **flujo de ramas dev → qa → main** copiado del patrón de los backends (`pf-svc-identidad`, `pf-pkg-contracts`), con merge manual. La **publicación de la librería no cambia**: `publish.yml` se mantiene intacto y sigue disparándose por release (decisión: opción A).

## Historia técnica

Como equipo de desarrollo, necesito que lint, typecheck y pruebas corran en cada pull request de `@ai27-tech/ui`, para que un cambio que rompe el build o un componente no se publique.

## Estado verificado hoy (rama dev)

- Scripts presentes: `build`, `build:lib`, `lint`, `dev`, `preview`, `storybook`, `build-storybook`. **No hay script `test`**, aunque `vitest`, `playwright` y `@vitest/browser-playwright` están en devDependencies.
- `vite.config.ts` define `test.projects` con un único proyecto `storybook` que corre en **navegador real** vía Storybook addon + Playwright. Es infraestructura pesada para CI y depende de las stories.
- `.github/workflows/` solo tiene `publish.yml` (dispara en `release: published`).
- `.npmrc` enruta el scope `@ai27-tech` a GitHub Packages con `NODE_AUTH_TOKEN`.
- **No hay husky** ni `.husky/`.
- `src/` exporta ~20 componentes desde `index.ts`.

## Requisitos

### R1 — Script `test` ejecutable en CI
El repo DEBE tener un script `test` que corra pruebas unitarias sin exigir un navegador real ni el stack de Storybook, para que sea estable y rápido en CI. Se agrega un proyecto de vitest en jsdom para pruebas de componentes, independiente del proyecto `storybook` existente.

**Criterios de aceptación:**
- `pnpm test` corre en un runner de CI sin pasos de navegador adicionales y pasa.
- El proyecto `storybook` existente no se rompe ni se elimina; queda disponible aparte.

### R2 — Al menos una prueba real
DEBE existir al menos una prueba unitaria real (no vacía). Prueba mínima: render de `Button` y verificación de su contenido/rol.

### R3 — Workflow de CI (estilo plataforma)
El repo DEBE tener un workflow de GitHub Actions alineado al patrón de los backends: dispara en **push a las tres ramas** (`pf-lf-m`, `pf-lf-d`, `pf-lf-q`) y en **cada `pull_request`**, y ejecuta `lint`, `typecheck` (build de tipos) y `test`.

**Criterios de aceptación:**
- Un PR con error de lint, de tipos o una prueba rota falla el workflow.
- Tras una promoción fusionada, el push a la rama destino vuelve a correr el CI.

### R4 — `publish.yml` intacto (opción A)
El workflow de publicación NO DEBE cambiar: sigue en `release: published` y no se le agregan pasos. La validación vive en el nuevo `ci.yml` de PR. La publicación de la librería **no se migra** al modelo por-tag de `pf-pkg-contracts` en esta tarea.

### R8 — Flujo de ramas automatizado (dev → qa → main)
El repo DEBE adoptar el flujo de promoción de la plataforma, copiando `promotion-pr-dq.yml` y `promotion-pr-qm.yml` de `pf-svc-identidad` sin cambios (derivan la rama por sufijo, funcionan con `pf-lf-d/q/m`). **No fusionan**: merge manual en ambos tramos. No se crea auto-merge.

**Criterios de aceptación:**
- Un push a `pf-lf-d` crea/actualiza el PR hacia `pf-lf-q`; un push a `pf-lf-q`, hacia `pf-lf-m`.
- Ningún workflow fusiona automáticamente.

### R5 — Alinear husky
DEBE agregarse `.husky/pre-commit` alineado con el de los portales (lint + typecheck sobre lo staged / proyecto), para que la línea base de calidad sea consistente en los tres repos.

### R6 — Compuerta de fusión (fuera del código)
Un PR con el workflow en rojo NO DEBE poder fusionarse. Requiere branch protection con required checks en `pf-lf-d`. Se entrega la guía de activación; la activa alguien con permisos de admin.

### R7 — Prueba negativa deliberada
DEBE demostrarse con una prueba negativa deliberada que la compuerta bloquea. Se revierte tras confirmarla.

## Fuera de alcance

- No se migra el proyecto `storybook` de vitest ni se cambia su enfoque de navegador.
- No se agregan pruebas para todos los componentes: solo la mínima para cerrar la línea base.
- No se toca `build:lib` ni la lógica de publicación.
- Umbral de cobertura: fuera de alcance.
