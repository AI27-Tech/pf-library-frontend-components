// Type declarations for CSS Modules imported in components.
declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Plain CSS side-effect imports (tokens.css, base.css).
declare module "*.css";
