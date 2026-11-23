/** Token de 72 caracteres sin espacios: fuerza el desborde si el texto no se parte. */
export const LONG_TOKEN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.repeat(2);

/** Número largo de 16 dígitos, para cifras que no caben en una celda estrecha. */
export const LONG_NUMBER = '1234567890123456';

export interface FixtureItem {
  id: number;
  etiqueta: string;
}

/**
 * Genera `n` elementos para listas, etiquetas y tabs de las pruebas responsivas.
 * Lanza un error si `n` es menor que 20, porque las stories necesitan una lista larga.
 */
export function makeItems(n: number): FixtureItem[] {
  if (n < 20) {
    throw new RangeError(`makeItems requiere al menos 20 elementos, se pidieron ${n}`);
  }
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    etiqueta: `Elemento ${String(i + 1).padStart(2, '0')}`,
  }));
}

/** Viaje de ejemplo, con los datos que muestran las stories de dominio. */
export const viaje = {
  folio: 'VJ-2026-000481',
  origen: 'Monterrey, Nuevo León',
  destino: 'Querétaro, Querétaro',
  estado: 'EN_RUTA',
  cliente: 'Transportes del Norte, S. A. de C. V.',
  etaEstimada: '2026-11-19T18:30',
} as const;

/** Unidad de transporte de ejemplo. */
export const unidad = {
  placa: 'ABC-123-A',
  tipo: 'Tracto con remolque de 3 ejes',
  patrulla: 'PT-07',
} as const;

/** Custodio de ejemplo. */
export const custodio = {
  nombre: 'Juan Pérez Martínez',
  credencial: 'CUS-0042',
  telefono: '+52 81 5555 0123',
} as const;

/** Entrada de bitácora de ejemplo. */
export const bitacora = {
  hora: '08:14',
  evento: 'Salida de origen con sello de seguridad verificado',
  responsable: 'Monitorista 3',
} as const;
