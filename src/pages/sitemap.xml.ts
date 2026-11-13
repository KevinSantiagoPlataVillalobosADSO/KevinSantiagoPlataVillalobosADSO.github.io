import type { APIRoute } from 'astro';
import { absoluteUrl } from '@/lib/url';

/** Sitio de una página: el sitemap se genera a mano, sin integración extra. */
export const GET: APIRoute = ({ site }) => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${absoluteUrl('', site)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
