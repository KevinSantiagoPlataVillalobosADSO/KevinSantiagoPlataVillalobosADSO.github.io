/**
 * Copiar el correo al portapapeles con confirmación visual y anunciada.
 * Si la API no está disponible (contexto no seguro), se selecciona el texto
 * del enlace para que se pueda copiar a mano.
 */
export function initCopy() {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
    const value = button.dataset.copy ?? '';
    const status = button.parentElement?.querySelector<HTMLElement>('[data-copy-status]');
    let timer = 0;

    button.addEventListener('click', async () => {
      let ok = false;
      try {
        await navigator.clipboard.writeText(value);
        ok = true;
      } catch {
        const link = button.parentElement?.querySelector('a');
        if (link) {
          const range = document.createRange();
          range.selectNodeContents(link);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }

      if (status) {
        status.textContent = ok
          ? 'Correo copiado al portapapeles.'
          : 'No se pudo copiar automáticamente. El correo quedó seleccionado.';
      }

      if (!ok) return;
      button.dataset.state = 'done';
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        button.dataset.state = 'idle';
        if (status) status.textContent = '';
      }, 2200);
    });
  });
}
