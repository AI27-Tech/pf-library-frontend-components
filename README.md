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
- **Timeline**: historia de estados en vertical u horizontal, con alternada, `stackBelow`, `maxVisible` y `reverse`.
- **DatePicker**: `Calendar`, `DateInput`, `TimePicker` y `DateTimeInput`. El contrato de valores estÃ¡ en la secciÃ³n de fechas y horas.
- **Skeleton, Spinner y ProgressBar**: estados de carga.
- **Breadcrumb, Stack, Inline, Grid y Popover**: navegaciÃ³n, disposiciÃ³n y contenido flotante.
- **MensajerÃ­a (piezas nuevas)**: `ConversationStatus`, `MessageThread`, `MessageAttachment`, `MessageDock` y `useMessageDock`. Ver la secciÃ³n de mensajerÃ­a.

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

## Instalación y uso en una app (@ai27-tech/ui)

Guía definitiva para instalar y usar la librería en una app (cliente /
administrador). **Todos estos pasos se hacen en el repo de la app que consume la
librería**, no en este repo.

El paquete se publica de forma **privada** en **GitHub Packages** bajo el scope
`@ai27-tech`. Por eso hacen falta dos cosas: apuntar el scope al registry correcto
y autenticarse con un token de GitHub.

> **Un solo nombre de variable en todo el flujo:** tanto para **consumir** como
> para **publicar** se usa `NODE_AUTH_TOKEN`. Es el nombre que npm/pnpm y GitHub
> Actions (`setup-node`) reconocen de forma nativa. El `.npmrc` y la variable de
> entorno deben coincidir exactamente; un desajuste deja el token vacío y produce
> `401` o `404` (la causa #1 de los fallos de instalación).

### TL;DR (los 3 pasos que resuelven el 90% de los errores)

```ini
# 1. .npmrc en la raíz de la app
@ai27-tech:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

```powershell
# 2. Token en la terminal (mismo nombre que en el .npmrc: NODE_AUTH_TOKEN)
$env:NODE_AUTH_TOKEN="tu_token_con_read:packages"
```

```bash
# 3. Instalar (beta mientras no haya estable)
pnpm add @ai27-tech/ui@beta
```

### Requisitos

- **Node.js 20+**
- **pnpm** (npm/yarn también funcionan con el mismo `.npmrc`)
- Un **Personal Access Token (classic) de GitHub** con el scope **`read:packages`**
  (y `repo` si el repositorio de la librería es privado).

### 1. Generar el token de GitHub

GitHub → **Settings** → **Developer settings** → **Personal access tokens** →
**Tokens (classic)** → **Generate new token (classic)**. Marca **`read:packages`**
(y `repo` si el repo es privado), genera y **copia el token** (empieza por
`ghp_...`). Un token sin `read:packages` es la segunda causa más común de `401`.

### 2. Configurar el registry (`.npmrc`)

Crea un `.npmrc` en la **raíz del proyecto de la app** con exactamente estas dos
líneas:

```ini
@ai27-tech:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

- La primera línea enruta **solo** el scope `@ai27-tech` a GitHub Packages; el
  resto de dependencias siguen viniendo del registry público de npm.
- La segunda toma el token desde la variable `NODE_AUTH_TOKEN`.

> **Seguridad:** el archivo usa `${NODE_AUTH_TOKEN}` (una *referencia*), no el
> token literal. Por eso es seguro versionarlo. **Nunca** pegues el token real aquí.

### 3. Proveer el token como variable de entorno

El nombre debe coincidir con el del `.npmrc` (`NODE_AUTH_TOKEN`).

```powershell
# PowerShell (Windows)
$env:NODE_AUTH_TOKEN="ghp_tuTokenDeLectura"
```

```bash
# bash / zsh (macOS / Linux)
export NODE_AUTH_TOKEN="ghp_tuTokenDeLectura"
```

Dura solo mientras la terminal esté abierta; para que persista, defínelo en las
variables de entorno del sistema o en tu perfil de shell.

**En CI:**

- **GitHub Actions (misma organización):** mapea el `secrets.GITHUB_TOKEN`
  integrado a `NODE_AUTH_TOKEN` (igual que el workflow de publicación):
  ```yaml
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  ```
- **Vercel / Netlify / otros:** crea una variable de entorno secreta llamada
  `NODE_AUTH_TOKEN` en la configuración del proyecto.

### 4. Instalar el paquete

```bash
# Versión beta (mientras no haya versión estable publicada)
pnpm add @ai27-tech/ui@beta

# Cuando exista versión estable
pnpm add @ai27-tech/ui
```

`react` y `react-dom` son **peer dependencies**; una app Next ya los incluye. Si
tu proyecto no los tiene: `pnpm add react react-dom`. Versión actual publicada:
**`0.2.0-beta.1`** (por eso hay que pedir `@beta`).

### 5. Importar los estilos (una sola vez)

Importa la hoja de estilos compilada una única vez en la raíz de la app (por
ejemplo, `app/layout.tsx`). Incluye los design tokens, los estilos base globales y
el CSS de todos los componentes:

```ts
import "@ai27-tech/ui/styles.css";
```

### 6. Cargar la fuente Inter

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

### 7. Usar los componentes

```tsx
import { Button, Table, Modal } from "@ai27-tech/ui";
```

### Iconos

La librería incluye `lucide-react` empaquetado en `dist`. Las apps **no** necesitan instalarlo para usar `@ai27-tech/ui`.

### Modo oscuro

El tema se controla con tokens. Actívalo estableciendo `data-theme` en `<html>`:

```html
<html data-theme="dark">  <!-- o "light"; por defecto sigue la preferencia del sistema -->
```

### Solución de problemas

| Síntoma | Causa probable | Solución |
| --- | --- | --- |
| `401 Unauthorized` al instalar | Token ausente, expirado, o el nombre de la variable no coincide con el del `.npmrc` | Verifica que `NODE_AUTH_TOKEN` esté exportado **en la misma terminal** y que el `.npmrc` use `${NODE_AUTH_TOKEN}` |
| `401 Unauthorized` con token presente | El token no tiene el scope `read:packages` | Regenera el token marcando `read:packages` (y `repo` si el repo es privado) |
| `404 Not Found` | Falta `@beta`, o el `.npmrc` no tiene la línea del registry | Usa `pnpm add @ai27-tech/ui@beta` y confirma la línea `@ai27-tech:registry=...` |
| `ERR_PNPM_FETCH_401` / `ERR_PNPM_FETCH_404` | Lo mismo que arriba, reportado por pnpm | Aplica las soluciones de `401` / `404` |
| La variable sale vacía en Windows | Usaste sintaxis de cmd (`%NODE_AUTH_TOKEN%`) | En PowerShell usa `$env:NODE_AUTH_TOKEN="..."` |
| El token no persiste entre terminales | Se definió solo para esa sesión | Defínelo en variables de entorno del sistema o en el perfil del shell |
| Componentes sin estilos | No se importó el CSS | Añade `import "@ai27-tech/ui/styles.css"` en el layout raíz |
| Fuente distinta a Inter | Inter no está cargada | Carga Inter con `next/font` en el layout |
| Cambié el token y sigue fallando | pnpm cacheó la respuesta anterior | Borra `node_modules`, corre `pnpm store prune` y reinstala |

**Diagnóstico rápido:**

```powershell
# 1. ¿La variable está definida en ESTA terminal?
echo $env:NODE_AUTH_TOKEN     # PowerShell
echo $NODE_AUTH_TOKEN         # bash/zsh

# 2. ¿pnpm resuelve el registry del scope?
npm config get @ai27-tech:registry
```

Si el `echo` sale vacío, el token no está disponible para pnpm: ahí está el
problema, vuelve al paso 3.

### `.gitignore` de la app

El `.npmrc` con `${NODE_AUTH_TOKEN}` **puede versionarse** (no contiene secretos).
Lo que **sí** debe ignorarse son los archivos donde vive el token real:

```gitignore
# Variables de entorno (contienen el token real)
.env
.env.local
.env.*.local
```

### Actualizar a nuevas versiones

```bash
pnpm update @ai27-tech/ui        # dentro del rango de package.json
pnpm add @ai27-tech/ui@latest    # última estable
pnpm add @ai27-tech/ui@beta      # última beta
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

## Fechas y horas: contrato de valores (@ai27-tech/ui)

Aplica a `DateInput`, `Calendar`, `TimePicker` y `DateTimeInput`.

- **Fecha** (`DateInput`, `Calendar`): `YYYY-MM-DD`. Sin fecha, `""`. Al escribir se usa `DD/MM/AAAA`. `displayFormat="AAAA Mmm DD"` cambia solo la visualización cuando el campo no tiene foco.
- **Hora** (`TimePicker`): `HH:mm` o `HH:mm:ss`, siempre en 24 h. `format="12h"` cambia solo la visualización. Sin hora, `""`. Se emite solo cuando todos los segmentos requeridos están completos.
- **Fecha y hora** (`DateTimeInput`): `YYYY-MM-DDTHH:mm`, o `YYYY-MM-DDTHH:mm:ss` con `withSeconds`. Sin valor, `""`. Se emite solo cuando fecha y hora están completas.
- **Hora de pared**: los valores no llevan zona horaria. La librería no los convierte con `new Date(string)`. Quien guarda el valor decide la zona.
- **Límites** `min` y `max`: inclusivos. En `DateTimeInput`, la hora solo se restringe el día del límite.
- **Modo controlado**: con `value`, el padre es la fuente de verdad. Si no actualiza `value`, el campo vuelve al valor vigente al confirmar. Sin `value`, el componente guarda su propio valor.
- **Límites de `DateTimeInput`**: no acepta formatos de escritura distintos a `DD/MM/AAAA` para la fecha ni `HH:mm` para la hora. No tiene `dateParser` ni `valueFormat` personalizados.

## Mensajería (`MessagePanel`): contrato y reglas (@ai27-tech/ui)

Contrato de referencia: `pf-pkg-contracts`, tag `v0.1.0-tracer.40`, `contracts/openapi/mensajeria.yaml`. La librería no importa el contrato: el consumidor convierte el JSON a los tipos de `src/components/MessagePanel/types.ts`.

### Campo del contrato → prop de la librería

| Contrato (`mensajeria.yaml`) | Prop o tipo en la librería | Quién lo usa |
| --- | --- | --- |
| `Mensaje.secuencia` | `Mensaje.secuencia` (orden de la lista) | `MessageThread` |
| `Mensaje.audiencia_autor` | `Mensaje.audienciaAutor`; `isOwn` lo decide el consumidor | `MessageThread` |
| `Mensaje.alias_mostrado` | `Mensaje.aliasMostrado` / `aliasMostrado` | `MessageBubble` |
| `Mensaje.creado_en` | `Mensaje.creadoEn` / `creadoEn` (hora local) | `MessageBubble`, `MessageThread` (divisores) |
| `Mensaje.cuerpo` | `Mensaje.cuerpo` / `children` | `MessageBubble` |
| `Mensaje.adjuntos_ids` | `Mensaje.adjuntosIds`; el consumidor resuelve los adjuntos en `renderAttachments` | `MessageThread`, `MessageAttachment` |
| `Mensaje.actor_real`, `rol_al_enviar` | Solo en `renderAudit` (no se muestran por defecto) | Consumidor (audiencia Interno) |
| `Conversacion.estado` | `estadoConversacion` (`abierta`, `solo_lectura`, `cerrada`) | `MessageComposer`, `ConversationStatus` |
| `Conversacion.escritura_hasta` | `ConversationStatus.escrituraHasta` | `ConversationStatus` |
| `Conversacion.reclamo_activo` | `ConversationStatus.reclamadaPor` y `reclamoPropio`; el portal resuelve el nombre | `ConversationStatus` |
| `Conversacion.atendida_en` | `ConversationStatus.atendida` (booleano) | `ConversationStatus` |
| `Conversacion.ultima_secuencia` | `MessageList.ultimaSecuencia` | `MessageList` |
| `Conversacion.hay_mas` | `hayMas` y `onCargarAnteriores` | `MessageList`, `MessageThread` |
| `ReciboEntrada.hasta_secuencia` | `ultimaSecuenciaLeida` (solo el divisor "Mensajes nuevos") | `MessageThread` |
| `EnviarMensajeEntrada.client_message_id`, `cuerpo`, `adjuntos_ids` | `onSend({ clientMessageId, cuerpo })` y `onAttach` | `MessageComposer` |
| `EnviarMensajeEntrada.version_reclamo_esperada`, `motivo_override` | No los conoce la librería: el consumidor los agrega al llamar a la API | Consumidor |

### Reglas de la conversación (la librería no las aplica)

La librería solo muestra lo que recibe. El consumidor decide qué botones aparecen y el servidor valida cada acción.

| Acción | Quién puede | Fuente |
| --- | --- | --- |
| Reclamar | Solo si la conversación está en el pool. Con responsable activo responde `409`, aunque la versión sea la vigente | DEC-123 |
| Responder | Solo el responsable con reclamo activo | Addendum §4 (punto 4) |
| Liberar | El responsable del reclamo | Addendum §4 (punto 6) |
| Transferir | El responsable. En V1 la transferencia devuelve la conversación al pool; no se dirige a un ejecutivo concreto | DEC-119 |
| Marcar atendida | Acción explícita del responsable. Responder no la marca | DEC-117 |
| Ver y leer | Supervisor y coordinador solo leen conversaciones (sin acciones de reclamo) | DEC-131 |
| Override de supervisor | Cerrado en V1: el envío no lleva `motivo_override` | DEC-107 |

Errores del servidor: `409` por conflicto de versión o de reclamo, y `403` por falta de permiso. Se muestran con `MessageComposer`/`MessagePanel` `notice` o con un `MessageBubble` en estado `failed`.

## Timeline: uso (@ai27-tech/ui)

Muestra la historia de estados de un elemento, por ejemplo el historial de un viaje.

```tsx
<Timeline
  orientation="horizontal"
  stackBelow={560}
  items={[
    { id: 'SOLICITADO', title: 'Solicitado', timestamp: '10 nov, 08:12', dateTime: '2026-11-10T08:12:00Z', status: 'completed' },
    { id: 'EN_TRANSITO', title: 'En recorrido', description: 'Parada 2 de 3', status: 'current' },
    { id: 'CERRADO', title: 'Cerrado', status: 'upcoming' },
  ]}
/>
```

- `status`: `completed`, `current`, `upcoming` (por defecto), `error` o `warning`. El punto `current` lleva `aria-current="step"`.
- Con `dateTime` la marca de tiempo se renderiza como `<time>`.
- `labels` cambia los textos en español (por ejemplo `showMore`, `empty` o los nombres de estado).
- La librería usa el tamaño del contenedor, no el de la ventana, para decidir si una línea horizontal se muestra vertical (`stackBelow`).
