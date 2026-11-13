/**
 * Texto que se ilumina palabra a palabra según el progreso de scroll.
 * Propósito: ritmo de lectura en una declaración larga (storytelling).
 *
 *  · Solo escucha scroll mientras el bloque está en pantalla.
 *  · Escribe la opacidad directamente en cada palabra (no vía variable en el
 *    padre: eso recalcularía estilos de todos los hijos en cada frame).
 *  · Sin JS o con movimiento reducido, el texto se ve completo.
 */
export function initWordLight() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const blocks = document.querySelectorAll<HTMLElement>('[data-word-light]');
  if (!blocks.length || reduce.matches) return;

  blocks.forEach((block) => {
    const words = Array.from(block.querySelectorAll<HTMLElement>('.w'));
    if (!words.length) return;

    const MIN = 0.16;
    const cache = new Float32Array(words.length).fill(-1);
    let active = false;
    let queued = false;

    const update = () => {
      queued = false;
      const rect = block.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 cuando el bloque asoma por abajo; 1 cuando su final pasa el 40 % superior
      const start = vh * 0.9;
      const end = vh * 0.4;
      const progress = (start - rect.top) / (rect.height + (start - end));
      const lit = Math.min(Math.max(progress, 0), 1) * (words.length + 3) - 1.5;

      for (let i = 0; i < words.length; i++) {
        const t = Math.min(Math.max(lit - i, 0), 1);
        const value = Math.round((MIN + (1 - MIN) * t) * 100) / 100;
        if (cache[i] !== value) {
          cache[i] = value;
          words[i].style.opacity = String(value);
        }
      }
    };

    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };

    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !active) {
        active = true;
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        update();
      } else if (!entry.isIntersecting && active) {
        active = false;
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        update();
      }
    }).observe(block);

    update();
  });
}
