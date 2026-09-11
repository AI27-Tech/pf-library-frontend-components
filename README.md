# Librería de Componentes Frontend (@ai27-tech/ui)

Librería de componentes React reutilizables para los proyectos frontend del equipo AI27, alineada con el design system de AI27 Tactical Operations.

## Stack tecnológico

- React 19 + TypeScript
- Vite (modo librería)
- CSS Modules + design tokens (`--ui-*`)
- Storybook (documentación y pruebas visuales)

## Componentes

- **Button** — variantes, tamaños, estado de carga e iconos
- **Badge** — chips de estado táctico (secure, alert, escort, warning, neutral)
- **Inputs** — Input, Textarea, Select, Checkbox, Radio, Switch, FormField
- **Card** — con Header / Body / Footer y variantes de elevación
- **Modal** — controlado, con portal, focus trap y cierre por overlay/Escape
- **Toast** — notificaciones fijas con severidades y auto-cierre
- **MessagePanel** — mensajería multi-conversación estilo LinkedIn
- **Table** — tabla controlada con orden, selección, densidad y filas expandibles
- **Pagination** — paginación controlada (pensada para paginación de servidor)
- **Form** — layout de formularios (Form, FormSection, FormRow, FormActions)
- **FilterTable** — Table con barra de búsqueda y filtros
- **Navbar** — barra de navegación superior responsive
- **Sidebar** — navegación lateral colapsable

---

## Desarrollo de la librería

Para trabajar en este repositorio (no en las apps que la consumen).

### Requisitos

- Node.js 20+
- pnpm

### Instalación

```bash
pnpm install
```

### Storybook

Storybook es el entorno principal para desarrollar y visualizar los componentes.
Levántalo en local con:

```bash
pnpm storybook
```

Se abre en `http://localhost:6006`. Desde ahí puedes ver cada componente, sus
variantes y estados, alternar entre tema claro / oscuro (icono de sol/luna en la
barra superior) y revisar accesibilidad.

Para generar una versión estática de Storybook (por ejemplo, para desplegarla):

```bash
pnpm build-storybook
```

### Build de la librería

Genera el paquete distribuible en `dist/` (JS ESM + CJS, CSS y tipos `.d.ts`):

```bash
pnpm build:lib
```

### Otros comandos

```bash
pnpm dev       # servidor de desarrollo de Vite (playground)
pnpm lint      # ESLint
```

---

## Uso del paquete en una app (@ai27-tech/ui)

La librería se publica en **GitHub Packages** bajo el scope `@ai27-tech`.

### 1. Configurar el registry

Agrega un `.npmrc` en la app que la consume (cliente / administrador) para que el
scope resuelva a GitHub Packages, autenticado con un token con permiso
`read:packages`:

```ini
@ai27-tech:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Define `GITHUB_TOKEN` en tu entorno (local y en CI). En GitHub Actions, el
`secrets.GITHUB_TOKEN` integrado sirve para lecturas dentro de la misma
organización.

### 2. Instalar

```bash
pnpm add @ai27-tech/ui
# react y react-dom son peer dependencies (ya presentes en una app Next)
```

### 3. Importar los estilos (una sola vez)

Importa la hoja de estilos compilada una única vez en la raíz de la app (por
ejemplo, `app/layout.tsx`). Incluye los design tokens, los estilos base globales y
el CSS de todos los componentes:

```ts
import "@ai27-tech/ui/styles.css";
```

### 4. Cargar la fuente Inter

La librería referencia Inter mediante el token `--ui-font-family`, pero no
empaqueta la fuente. Cárgala en cada app, por ejemplo con `next/font`:

```tsx
// app/layout.tsx
import { Inter } from "next/font/google";
import "@ai27-tech/ui/styles.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

### 5. Usar los componentes

```tsx
import { Button, Table, Modal } from "@ai27-tech/ui";
```

### Modo oscuro

El tema se controla con tokens. Actívalo estableciendo `data-theme` en `<html>`:

```html
<html data-theme="dark">  <!-- o "light"; por defecto sigue la preferencia del sistema -->
```

---

## Publicación (mantenedores)

```bash
pnpm build:lib        # genera dist/ (JS + .d.ts + ui-library.css)
npm pack --dry-run    # inspecciona exactamente qué se publicaría (sin publicar)
# Requiere NODE_AUTH_TOKEN con permiso write:packages
pnpm publish
```

---

## Estructura del proyecto

```
src/
  components/    # Componentes UI reutilizables
  styles/        # Estilos y tokens compartidos (tokens.css, base.css)
  index.ts       # Punto de entrada / exports públicos
```

## Licencia

Uso interno — Equipo AI27
