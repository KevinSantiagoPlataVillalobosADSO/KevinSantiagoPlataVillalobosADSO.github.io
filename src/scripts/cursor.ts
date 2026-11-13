/**
 * Etiqueta contextual del puntero.
 * Movimiento decorativo que sigue al ratón → muelle amortiguado (no easing fijo),
 * así se puede interrumpir en cualquier momento sin saltos.
 */
export function initCursor() {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.querySelector<HTMLElement>('[data-cursor-root]');
  const label = document.querySelector<HTMLElement>('[data-cursor-label]');
  if (!root || !label || !fine.matches || reduce.matches) return;

  let x = 0;
  let y = 0;
  let tx = 0;
  let ty = 0;
  let raf = 0;
  let last = 0;
  let placed = false;
  let current: Element | null = null;

  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    // Seguimiento exponencial independiente del frame rate (~ muelle crítico)
    const k = 1 - Math.exp(-dt * 22);
    x += (tx - x) * k;
    y += (ty - y) * k;
    root.style.transform = `translate3d(${x}px, ${y}px, 0)`;

    if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = 0;
    }
  };

  const show = (target: Element) => {
    if (target === current) return;
    current = target;
    label.textContent = target.getAttribute('data-cursor') ?? '';
    root.setAttribute('data-visible', '');
  };

  const hide = () => {
    if (!current) return;
    current = null;
    root.removeAttribute('data-visible');
  };

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      tx = e.clientX;
      ty = e.clientY;

      if (!placed) {
        x = tx;
        y = ty;
        placed = true;
      }

      const target = (e.target as Element | null)?.closest('[data-cursor]');
      if (target) show(target);
      else hide();

      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    },
    { passive: true },
  );

  document.documentElement.addEventListener('pointerleave', hide);
  window.addEventListener('blur', hide);
}
