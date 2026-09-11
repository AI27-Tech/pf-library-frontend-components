# Cómo consumir @ai27-tech/ui en una app

Guía para instalar y usar la librería de componentes en los proyectos Next
(cliente / administrador). Todos estos pasos se hacen **en el repo de la app**,
no en el repo de la librería.

---

## Requisitos

- Node.js 20+
- pnpm
- Un **token de GitHub** con permiso `read:packages` (para descargar el paquete
  privado desde GitHub Packages).

---

## 1. Configurar el registry (`.npmrc`)

Crea un archivo `.npmrc` en la raíz del proyecto con:

```ini
@ai27-tech:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Esto enruta el scope `@ai27-tech` a GitHub Packages y toma el token desde la
variable de entorno `GITHUB_TOKEN`.

> **Seguridad:** este archivo usa `${GITHUB_TOKEN}` (una referencia), **no** el
> token real. Por eso es seguro versionarlo. **Nunca** escribas el token literal
> aquí.

---

## 2. Proveer el token

El token con `read:packages` debe estar disponible como variable de entorno.

### En local (por sesión de terminal)

```powershell
# PowerShell (Windows)
$env:GITHUB_TOKEN="tu_token_de_lectura"
```

```bash
# bash / zsh (macOS / Linux)
export GITHUB_TOKEN="tu_token_de_lectura"
```

### En CI

- **GitHub Actions (misma organización):** usa el `secrets.GITHUB_TOKEN`
  integrado, no hace falta crear nada.
- **Otros CI (Vercel, etc.):** guarda el token como variable de entorno secreta
  llamada `GITHUB_TOKEN` en la configuración del servicio.

### Cómo generar el token

GitHub → Settings → Developer settings → Personal access tokens → **Tokens
(classic)** → Generate new token. Marca el scope **`read:packages`** (y `repo` si
el repositorio es privado).

---

## 3. Instalar el paquete

```bash
# Versión beta (mientras no haya versión estable publicada)
pnpm add @ai27-tech/ui@beta

# Cuando exista versión estable
pnpm add @ai27-tech/ui
```

> `react` y `react-dom` son *peer dependencies*; una app Next ya los incluye.

---

## 4. Importar los estilos y la fuente

Importa la hoja de estilos **una sola vez** en el layout raíz, y carga la fuente
Inter (la librería la referencia pero no la empaqueta).

```tsx
// app/layout.tsx  (App Router)
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

---

## 5. Usar los componentes

```tsx
import { Button, Table, Modal } from "@ai27-tech/ui";

export default function Page() {
  return <Button variant="primary">Hola</Button>;
}
```

---

## 6. Modo oscuro

El tema se controla con el atributo `data-theme` en `<html>`:

```html
<html data-theme="dark">  <!-- o "light"; por defecto sigue el sistema -->
```

Puedes alternarlo con un botón, o usar una librería como `next-themes` que ya
escribe ese atributo.

---

## .gitignore de la app

El `.npmrc` con `${GITHUB_TOKEN}` **puede versionarse** (no contiene secretos).

Lo que **sí** debe ignorarse son los archivos de entorno donde vive el token real.
Asegúrate de que el `.gitignore` de la app incluya:

```gitignore
# Variables de entorno (contienen el token real)
.env
.env.local
.env.*.local
```

> Si por algún motivo alguien pusiera el token literal dentro del `.npmrc`
> (no recomendado), entonces también habría que ignorar el `.npmrc`. Con el
> enfoque de variable de entorno, no es necesario.

---

## Problemas comunes

| Error | Causa | Solución |
| --- | --- | --- |
| `401 Unauthorized` al instalar | Token ausente o sin `read:packages` | Verifica `GITHUB_TOKEN` y sus permisos |
| `404 Not Found` | Falta `@beta`, o el `.npmrc` no tiene la línea del registry | Usa `pnpm add @ai27-tech/ui@beta` y revisa el `.npmrc` |
| Componentes sin estilos | No se importó el CSS | Añade `import "@ai27-tech/ui/styles.css"` en el layout |
| Fuente distinta a Inter | Inter no está cargada | Carga Inter con `next/font` en el layout |

---

## Actualizar a nuevas versiones

```bash
pnpm update @ai27-tech/ui        # dentro del rango de package.json
pnpm add @ai27-tech/ui@latest    # última estable
pnpm add @ai27-tech/ui@beta      # última beta
```
