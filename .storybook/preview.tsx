import { useEffect } from 'react'
import type { Preview } from '@storybook/react-vite'
import '../src/styles/tokens.css'
import '../src/styles/base.css'

// Viewports de responsividad (tarea 1.12). Son las únicas opciones del toolbar de viewport.
const VIEWPORTS = {
  mobile: { name: 'Móvil 375', styles: { width: '375px', height: '667px' }, type: 'mobile' },
  tablet: { name: 'Tablet 768', styles: { width: '768px', height: '1024px' }, type: 'tablet' },
  desktop: { name: 'Escritorio 1280', styles: { width: '1280px', height: '800px' }, type: 'desktop' },
} as const;
const preview: Preview = {
  parameters: {
    viewport: {
      options: VIEWPORTS,
    },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },

  // Global theme switcher shown in the Storybook toolbar.
  globalTypes: {
    theme: {
      description: 'UI library theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    theme: 'light',
  },

  decorators: [
    (Story, context) => {
      const theme = context.globals.theme ?? 'light'
      useEffect(() => {
        const root = document.documentElement
        root.setAttribute('data-theme', theme)
        // Paint the canvas background from the theme surface token.
        document.body.style.backgroundColor = 'var(--ui-color-surface-muted)'
        document.body.style.color = 'var(--ui-color-text)'
      }, [theme])
      return <Story />
    },
  ],
};

export default preview;
