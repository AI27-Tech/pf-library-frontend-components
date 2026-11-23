/** Viewports que puede usar una Responsive_Story. Coinciden con las claves de `VIEWPORTS` en `.storybook/preview.tsx`. */
export type ResponsiveViewport = 'mobile' | 'tablet';

/** Etiqueta que filtra las Responsive_Story en el proyecto `responsive` de Vitest. */
export const RESPONSIVE_TAG = 'responsive';

/** Forma mínima de una story de Storybook que la fábrica necesita. */
interface StoryLike {
  globals?: Record<string, unknown>;
  parameters?: Record<string, unknown>;
  tags?: string[];
}

/**
 * Convierte una story en Responsive_Story: fija el viewport con el global de Storybook,
 * marca `parameters.responsive` y agrega la etiqueta `responsive`. El addon de Storybook
 * no filtra por parámetros, así que el proyecto `responsive` filtra por la etiqueta.
 * La regla de a11y pasa a `error` únicamente en estas stories.
 *
 * No escribe anchos en línea: el ancho lo aplica Storybook según `VIEWPORTS`.
 *
 * @example
 * export const Mobile = responsiveStory('mobile', { args: { ... } });
 */
export function responsiveStory<S extends StoryLike>(viewport: ResponsiveViewport, story: S): S {
  const parentA11y = (story.parameters?.a11y ?? {}) as Record<string, unknown>;
  const parentTags = story.tags ?? [];
  return {
    ...story,
    globals: {
      ...story.globals,
      viewport: { value: viewport, isRotated: false },
    },
    parameters: {
      ...story.parameters,
      responsive: true,
      a11y: { ...parentA11y, test: parentA11y.test ?? 'error' },
    },
    tags: parentTags.includes(RESPONSIVE_TAG) ? parentTags : [...parentTags, RESPONSIVE_TAG],
  };
}
