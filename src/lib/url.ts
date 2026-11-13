/**
 * Rutas compatibles con GitHub Pages: en un repo de proyecto el sitio vive
 * en /nombre-del-repo/, así que todo recurso de /public debe pasar por aquí.
 */
const BASE = import.meta.env.BASE_URL;

export function withBase(path = ''): string {
  const base = BASE.endsWith('/') ? BASE : `${BASE}/`;
  return base + path.replace(/^\/+/, '');
}

export function absoluteUrl(path: string, site: URL | undefined): string {
  return new URL(withBase(path), site ?? 'http://localhost:4321').href;
}

export const isExternal = (href: string) => /^https?:\/\//i.test(href);
