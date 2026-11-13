/**
 * Carga diferida de la escena 3D: Three.js (~130 KB gzip) nunca bloquea el
 * primer pintado. Se importa cuando el navegador está ocioso y solo si tiene
 * sentido (sin Save-Data). Si algo falla, queda el fallback CSS del núcleo.
 */
export function initHeroScene() {
  const host = document.querySelector<HTMLElement>('[data-hero]');
  const canvas = host?.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
  const anchor = host?.querySelector<HTMLElement>('[data-hero-orb]');
  if (!host || !canvas || !anchor) return;

  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return;

  const start = () => {
    import('./scene')
      .then(({ createHeroScene }) => createHeroScene({ host, canvas, anchor }))
      .catch(() => {
        /* Fallback CSS visible: no hay nada más que hacer. */
      });
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(start, { timeout: 1200 });
  } else {
    setTimeout(start, 250);
  }
}
