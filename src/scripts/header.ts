/**
 * Cabecera: estado "con scroll", sección activa en la navegación y menú móvil.
 * Todo con IntersectionObserver: sin listeners de scroll.
 */
export function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const sentinel = document.querySelector<HTMLElement>('[data-header-sentinel]');

  if (header && sentinel) {
    new IntersectionObserver(([entry]) => {
      header.toggleAttribute('data-scrolled', !entry.isIntersecting);
    }).observe(sentinel);
  }

  initActiveSection();
  initMenu();
}

function initActiveSection() {
  const links = new Map<string, HTMLAnchorElement>();
  document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]').forEach((a) => {
    links.set(a.dataset.navLink!, a);
  });
  if (!links.size) return;

  const setCurrent = (id: string | null) => {
    links.forEach((a, key) => {
      if (key === id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  };

  // Una franja fina en el centro de la pantalla decide qué sección está activa.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setCurrent(entry.target.id);
      }
    },
    { rootMargin: '-45% 0px -54% 0px' },
  );

  links.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });

  // Al volver al hero no hay sección activa.
  const hero = document.getElementById('inicio');
  if (hero) {
    new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setCurrent(null);
      },
      { rootMargin: '-45% 0px -54% 0px' },
    ).observe(hero);
  }
}

function initMenu() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-menu]');
  const openBtn = document.querySelector<HTMLButtonElement>('[data-menu-open]');
  const closeBtn = dialog?.querySelector<HTMLButtonElement>('[data-menu-close]');
  if (!dialog || !openBtn) return;

  openBtn.addEventListener('click', () => {
    dialog.showModal();
    openBtn.setAttribute('aria-expanded', 'true');
  });

  closeBtn?.addEventListener('click', () => dialog.close());

  dialog.addEventListener('close', () => {
    openBtn.setAttribute('aria-expanded', 'false');
  });

  // Al cerrar, el <dialog> devuelve el foco al botón "Menú" y eso cancela el
  // scroll suave del ancla. Por eso el desplazamiento se hace a mano, en el
  // frame siguiente, y el foco pasa a la sección (útil con teclado/lector).
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  dialog.querySelectorAll<HTMLAnchorElement>('[data-menu-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = link.hash ? document.getElementById(link.hash.slice(1)) : null;
      if (!target) {
        dialog.close(); // En otras páginas (404) se navega a la home normalmente.
        return;
      }
      event.preventDefault();
      dialog.close();
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
        history.pushState(null, '', link.hash);
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  });

  // Si la ventana pasa a escritorio con el menú abierto, se cierra.
  const desktop = window.matchMedia('(min-width: 64rem)');
  desktop.addEventListener('change', (e) => {
    if (e.matches && dialog.open) dialog.close();
  });
}
