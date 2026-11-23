import { useSyncExternalStore } from 'react';

/**
 * Indica si una media query coincide y se actualiza cuando cambia.
 *
 * Usa `useSyncExternalStore` sobre `matchMedia`. En servidor, o donde no existe
 * `matchMedia`, devuelve `false`: en ese caso la disposición la decide el CSS.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return () => {};
      }
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return false;
      }
      return window.matchMedia(query).matches;
    },
    () => false,
  );
}
