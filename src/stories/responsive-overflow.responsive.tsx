import { cleanup, render } from '@testing-library/react';
import { composeStories, composeStory, setProjectAnnotations } from '@storybook/react-vite';
import { page } from 'vitest/browser';
import axe from 'axe-core';
import { afterEach, describe, expect, it } from 'vitest';
import preview from '../../.storybook/preview';

setProjectAnnotations(preview);

/** Anchos de prueba de desbordamiento, en píxeles CSS (móvil pequeño, móvil, tablet y escritorio). */
export const OVERFLOW_WIDTHS = [320, 375, 768, 1280] as const;

const VIEWPORT_HEIGHT = 800;

/** Lado mínimo de un objetivo táctil, en píxeles CSS. */
export const TOUCH_TARGET_MIN_PX = 44;

const INTERACTIVE_SELECTOR = [
  'a[href]',
  'button',
  'input',
  'select',
  'textarea',
  '[role="button"]',
  '[role="tab"]',
  '[role="checkbox"]',
  '[role="switch"]',
].join(', ');

/**
 * Elementos interactivos de `root` que miden menos de 44 x 44 px.
 * Excluye los que tienen `[data-touch-extended]`, porque amplían su área de toque con `::after`.
 * Las pruebas de cada componente (tarea N.3) lo usan para exigir el objetivo táctil.
 */
export function touchTargetViolations(root: ParentNode = document): Array<{
  element: string;
  width: number;
  height: number;
}> {
  return Array.from(root.querySelectorAll<HTMLElement>(INTERACTIVE_SELECTOR))
    .filter((el) => !el.hasAttribute('data-touch-extended'))
    .map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        element: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : ''),
        width: rect.width,
        height: rect.height,
      };
    })
    .filter((m) => m.width < TOUCH_TARGET_MIN_PX || m.height < TOUCH_TARGET_MIN_PX);
}

/** Espera dos cuadros de animación para que el layout se asiente tras cambiar el ancho. */
async function settle(): Promise<void> {
  // Las animaciones de entrada (p. ej. Toast) cambian la opacidad; se espera a las finitas. Las infinitas (skeletons) no terminan nunca y no se esperan.
  const finite = document.getAnimations().filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity);
  await Promise.allSettled(finite.map((animation) => animation.finished));
  await new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve(undefined)));
  });
}

/** Modo de a11y de la story: `error` la hace fallar, `todo` solo la informa. */
function a11yMode(parameters: unknown): string | undefined {
  return (parameters as { a11y?: { test?: string } } | undefined)?.a11y?.test;
}

/** Stories marcadas como responsivas (`parameters.responsive === true`), de todos los archivos `*.stories.tsx`. */
type StoryModule = Parameters<typeof composeStories>[0];
const storyModules = import.meta.glob<StoryModule>('../**/*.stories.tsx', { eager: true });
const responsiveStories = Object.entries(storyModules).flatMap(([file, mod]) => {
  const composed: Record<string, ReturnType<typeof composeStory>> = composeStories(mod);
  return Object.entries(composed)
    .filter(([, Story]) => Story.parameters?.responsive === true)
    .map(([name, Story]) => ({ id: `${file} :: ${name}`, Story }));
});

afterEach(() => {
  cleanup();
});

describe('Responsive_Story: desbordamiento y accesibilidad por ancho', () => {
  if (responsiveStories.length === 0) {
    it.todo('todavía no hay Responsive_Story registradas');
  }

  for (const { id, Story } of responsiveStories) {
    describe(id, () => {
      const axeIt = a11yMode(Story.parameters) === 'error' ? it : it.skip;
      for (const width of OVERFLOW_WIDTHS) {
        it(`no desborda la página a ${width} px`, async () => {
          await page.viewport(width, VIEWPORT_HEIGHT);
          render(<Story />);
          await settle();
          const root = document.documentElement;
          expect(root.scrollWidth, `scrollWidth en ${width} px`).toBeLessThanOrEqual(root.clientWidth);
        });

        axeIt(`cumple axe a ${width} px (a11y.test: error)`, async () => {
          await page.viewport(width, VIEWPORT_HEIGHT);
          render(<Story />);
          await settle();
          const results = await axe.run(document.body);
          const report = results.violations.map(
            (v) => `${v.id}: ${v.help} -> ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
          );
          expect(report, `violaciones de a11y en ${width} px`).toEqual([]);
        });
      }
    });
  }
});
