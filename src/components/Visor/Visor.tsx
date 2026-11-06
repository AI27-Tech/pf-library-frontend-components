import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Headphones,
  Maximize,
  RotateCcw,
  RotateCw,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Button } from '../Button';
import styles from './Visor.module.css';

/**
 * Tipo genérico para un medio (imagen o audio)
 */
export interface Medium {
  id: string;
  type: 'IMAGE' | 'AUDIO';
  label: string;
  comment?: string;
}

/**
 * Props del componente Visor
 */
export interface VisorProps<T extends Medium = Medium> {
  /** Array de medios a visualizar */
  mediums: T[];
  /** Índice inicial del medio a mostrar */
  initialIndex?: number;
  /** Callback cuando se cierra el visor */
  onClose: () => void;
  /**
   * Función para resolver la URL del medio.
   * Debe ser estable (definida fuera del componente o memoizada).
   */
  resolveUrl: (medium: T) => Promise<string> | string;
}

// ===================================================================
// ZOOM Y TRANSFORMACIÓN
// ===================================================================

const ZOOM_MIN = 1;
const ZOOM_MAX = 8;
const ZOOM_STEP = 0.25;

function clampZoom(z: number): number {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));
}

interface Transform {
  zoom: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
}

const INITIAL_TRANSFORM: Transform = {
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  rotation: 0,
};

// ===================================================================
// COMPONENTE PRINCIPAL: VISOR
// ===================================================================

export function Visor<T extends Medium = Medium>({
  mediums,
  initialIndex = 0,
  onClose,
  resolveUrl,
}: VisorProps<T>) {
  const [index, setIndex] = useState(initialIndex);
  const [resolved, setResolved] = useState<{ id: string; url: string } | null>(null);

  const medium = mediums[index];
  const url = resolved && medium && resolved.id === medium.id ? resolved.url : null;

  const previous = useCallback(() => {
    setIndex((i) => (i - 1 + mediums.length) % mediums.length);
  }, [mediums.length]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % mediums.length);
  }, [mediums.length]);

  // Resuelve la URL del medio actual
  const mediumId = medium?.id;
  useEffect(() => {
    if (!medium) return;
    let alive = true;
    void Promise.resolve(resolveUrl(medium)).then((u) => {
      if (alive) setResolved({ id: medium.id, url: u });
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediumId, resolveUrl]);

  // Teclado: navegación y cierre
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
      else if (event.key === 'ArrowLeft') previous();
      else if (event.key === 'ArrowRight') next();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, previous, next]);

  if (!medium) return null;

  const isAudio = medium.type === 'AUDIO';

  return (
    <div
      className={styles.visor}
      role="dialog"
      aria-modal="true"
      aria-label={`Visor: ${medium.label}`}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.label}>{medium.label}</span>
          <span className={styles.position}>
            {index + 1} / {mediums.length}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} aria-label="Cerrar visor">
          <X />
        </Button>
      </header>

      {/* Contenido principal */}
      <div className={styles.container}>
        {mediums.length > 1 && (
          <Button
            variant="ghost"
            onClick={previous}
            aria-label="Anterior"
            className={styles.navButton + ' ' + styles.navPrevious}
          >
            <ChevronLeft />
          </Button>
        )}

        {isAudio ? (
          <VisorAudio medium={medium} url={url} />
        ) : (
          <VisorImage key={medium.id} medium={medium} url={url} />
        )}

        {mediums.length > 1 && (
          <Button
            variant="ghost"
            onClick={next}
            aria-label="Siguiente"
            className={styles.navButton + ' ' + styles.navNext}
          >
            <ChevronRight />
          </Button>
        )}
      </div>
    </div>
  );
}

// ===================================================================
// VISOR DE IMAGEN: ZOOM, ROTACIÓN, DESPLAZAMIENTO
// ===================================================================

function VisorImage<T extends Medium = Medium>({ medium, url }: { medium: T; url: string | null }) {
  const [transform, setTransform] = useState<Transform>(INITIAL_TRANSFORM);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const reset = useCallback(() => setTransform(INITIAL_TRANSFORM), []);

  const changeZoom = useCallback((delta: number) => {
    setTransform((prev) => {
      const zoom = clampZoom(prev.zoom + delta);
      if (zoom === 1) return { ...prev, zoom, offsetX: 0, offsetY: 0 };
      return { ...prev, zoom };
    });
  }, []);

  const rotate = useCallback((degrees: number) => {
    setTransform((prev) => ({ ...prev, rotation: (prev.rotation + degrees + 360) % 360 }));
  }, []);

  // Teclado para imagen
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      switch (event.key) {
        case '+':
        case '=':
          changeZoom(ZOOM_STEP * 2);
          break;
        case '-':
          changeZoom(-ZOOM_STEP * 2);
          break;
        case 'r':
        case 'R':
          rotate(90);
          break;
        case '0':
          reset();
          break;
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [changeZoom, rotate, reset]);

  // Zoom con rueda
  const canvasRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = canvasRef.current;
    if (!node) return;
    function onWheel(event: WheelEvent) {
      event.preventDefault();
      changeZoom(event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP);
    }
    node.addEventListener('wheel', onWheel, { passive: false });
    return () => node.removeEventListener('wheel', onWheel);
  }, [changeZoom]);

  function onMouseDown(event: React.MouseEvent) {
    if (transform.zoom <= 1) return;
    lastPoint.current = { x: event.clientX, y: event.clientY };
    setDragging(true);
  }

  function onMouseMove(event: React.MouseEvent) {
    const point = lastPoint.current;
    if (!point) return;
    const dx = event.clientX - point.x;
    const dy = event.clientY - point.y;
    lastPoint.current = { x: event.clientX, y: event.clientY };
    setTransform((prev) => ({ ...prev, offsetX: prev.offsetX + dx, offsetY: prev.offsetY + dy }));
  }

  function endDrag() {
    lastPoint.current = null;
    setDragging(false);
  }

  return (
    <>
      <div
        ref={canvasRef}
        className={styles.canvas}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        style={{ cursor: transform.zoom > 1 ? (dragging ? 'grabbing' : 'grab') : 'default' }}
      >
        {url ? (
          <img
            src={url}
            alt={medium.comment ?? medium.label}
            draggable={false}
            className={styles.image}
            style={{
              transform: `translate(${transform.offsetX}px, ${transform.offsetY}px) scale(${transform.zoom}) rotate(${transform.rotation}deg)`,
              transition: dragging ? 'none' : 'transform 120ms ease-out',
            }}
          />
        ) : (
          <p className={styles.loading}>Cargando…</p>
        )}
      </div>

      {/* Controles de imagen */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarContent} role="toolbar" aria-label="Controles de imagen">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => changeZoom(-ZOOM_STEP)}
            disabled={transform.zoom <= ZOOM_MIN}
            aria-label="Alejar"
            title="Alejar (−)"
          >
            <ZoomOut />
          </Button>

          <span className={styles.zoomDisplay}>{Math.round(transform.zoom * 100)}%</span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => changeZoom(ZOOM_STEP)}
            disabled={transform.zoom >= ZOOM_MAX}
            aria-label="Acercar"
            title="Acercar (+)"
          >
            <ZoomIn />
          </Button>

          <span className={styles.separator} aria-hidden="true" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => rotate(-90)}
            aria-label="Rotar a la izquierda"
            title="Rotar a la izquierda"
          >
            <RotateCcw />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => rotate(90)}
            aria-label="Rotar a la derecha"
            title="Rotar a la derecha (r)"
          >
            <RotateCw />
          </Button>

          <span className={styles.separator} aria-hidden="true" />

          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            aria-label="Ajustar a pantalla"
            title="Ajustar a pantalla (0)"
          >
            <Maximize />
          </Button>
        </div>
      </div>
    </>
  );
}

// ===================================================================
// VISOR DE AUDIO: REPRODUCTOR
// ===================================================================

function VisorAudio<T extends Medium = Medium>({ medium, url }: { medium: T; url: string | null }) {
  return (
    <div className={styles.audioContainer}>
      <div className={styles.audioIconWrapper}>
        <Headphones />
      </div>

      <div className={styles.audioContent}>
        <p className={styles.audioLabel}>{medium.label}</p>
        {medium.comment && <p className={styles.audioComment}>{medium.comment}</p>}
      </div>

      {url === null ? (
        <p className={styles.audioLoading}>Cargando…</p>
      ) : url === '' ? (
        <p className={styles.audioLoading}>Audio no disponible</p>
      ) : (
        <audio key={url} src={url} controls autoPlay className={styles.audioPlayer} />
      )}
    </div>
  );
}
