// Declaraciones de tipo para módulos CSS importados en componentes.
declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Importaciones de efectos secundarios de CSS simples (tokens.css, base.css).
declare module "*.css";
