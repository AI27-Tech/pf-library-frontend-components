import { BREAKPOINTS, type Breakpoint } from './breakpoints';
import { useMediaQuery } from './useMediaQuery';

const IS_TABLET_OR_WIDER = `(min-width: ${BREAKPOINTS.tablet.rem})`;
const IS_DESKTOP = `(min-width: ${BREAKPOINTS.desktop.rem})`;

/**
 * Breakpoint actual del viewport, reactivo al cambiar el ancho.
 *
 * En servidor, o sin `matchMedia`, devuelve `mobile`.
 */
export function useBreakpoint(): Breakpoint {
  const isTabletOrWider = useMediaQuery(IS_TABLET_OR_WIDER);
  const isDesktop = useMediaQuery(IS_DESKTOP);
  if (isDesktop) return 'desktop';
  if (isTabletOrWider) return 'tablet';
  return 'mobile';
}
