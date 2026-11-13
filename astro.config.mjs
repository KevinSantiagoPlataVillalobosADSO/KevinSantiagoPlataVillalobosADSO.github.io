import { defineConfig, fontProviders } from 'astro/config';

/**
 * GitHub Pages
 * ------------
 * En GitHub Actions, el workflow (.github/workflows/deploy.yml) inyecta:
 *   SITE_URL  → p. ej. "https://tu-usuario.github.io"
 *   BASE_PATH → "/nombre-del-repo" (repo de proyecto) o "" (repo tu-usuario.github.io)
 * Así el sitio funciona en cualquiera de los dos casos sin tocar este archivo.
 * Si usas un dominio propio, define SITE_URL con él y deja BASE_PATH vacío.
 */
const site = process.env.SITE_URL || 'https://kevinsantiagoplatavillalobosadso.github.io';
const base = process.env.BASE_PATH || '/';

/** Fuentes servidas desde node_modules (sin CDN externa): preload + fallback métrico automático. */
const localNpm = fontProviders.npm({ remote: false });

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  compressHTML: true,
  devToolbar: { enabled: false },
  // 'class' permite estilar desde un componente padre la clase que pasa a un hijo.
  scopedStyleStrategy: 'class',
  // Sin Markdown en el sitio; Shiki usa estilos inline incompatibles con la CSP.
  markdown: { syntaxHighlight: false },
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      // El único chunk grande es Three.js (~130 KB gzip) y se carga en diferido
      // cuando el navegador está ocioso: no afecta al primer pintado.
      chunkSizeWarningLimit: 600,
    },
  },
  fonts: [
    {
      provider: localNpm,
      name: 'Geist Variable',
      cssVariable: '--font-geist',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      options: { package: '@fontsource-variable/geist' },
    },
    {
      provider: localNpm,
      name: 'Geist Mono Variable',
      cssVariable: '--font-geist-mono',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
      options: { package: '@fontsource-variable/geist-mono' },
    },
    {
      provider: localNpm,
      name: 'Instrument Serif',
      cssVariable: '--font-instrument',
      weights: [400],
      styles: ['normal', 'italic'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['ui-serif', 'Georgia', 'serif'],
      options: { package: '@fontsource/instrument-serif' },
    },
  ],
  /**
   * GitHub Pages no permite configurar cabeceras HTTP, así que la política de
   * seguridad se entrega como <meta http-equiv="content-security-policy">.
   * Astro calcula los hashes de cada script/estilo inline en el build.
   */
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "media-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'none'",
      ],
      scriptDirective: { resources: ["'self'"] },
      styleDirective: { resources: ["'self'"] },
    },
  },
});
