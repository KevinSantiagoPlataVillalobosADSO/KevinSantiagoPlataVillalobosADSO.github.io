/**
 * Reveal al hacer scroll: añade .is-visible una sola vez por elemento.
 * Re-animar en cada pasada sería una interfaz peleando con quien lee.
 *
 * Los reveals con máscara (data-reveal="clip") empiezan con clip-path al 100 %:
 * su área visible es 0 y IntersectionObserver nunca los vería entrar. Para
 * ellos se observa el contenedor padre, que sí ocupa espacio.
 */
export function initReveal() {
  const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const targets = new Map<Element, HTMLElement[]>();

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        targets.get(entry.target)?.forEach((el) => el.classList.add('is-visible'));
        targets.delete(entry.target);
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
  );

  elements.forEach((el) => {
    const target = el.dataset.reveal === 'clip' && el.parentElement ? el.parentElement : el;
    const list = targets.get(target);
    if (list) list.push(el);
    else targets.set(target, [el]);
  });

  targets.forEach((_, target) => observer.observe(target));
}
