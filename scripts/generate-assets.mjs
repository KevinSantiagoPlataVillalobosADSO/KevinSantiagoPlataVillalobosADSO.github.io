/**
 * Genera los recursos estáticos que dependen de tus datos:
 *   public/og.png               imagen para redes sociales (1200×630)
 *   public/favicon.svg          favicon vectorial
 *   public/favicon-48.png       favicon PNG de respaldo
 *   public/apple-touch-icon.png icono para iOS (180×180)
 *   public/cv.pdf               CV de EJEMPLO (solo si no existe uno)
 *
 * Uso:  npm run assets
 * Vuelve a ejecutarlo cuando cambies tu nombre o tu rol en src/data/profile.ts.
 * Requiere Node ≥ 22.18 (lee profile.ts directamente gracias a type stripping).
 */
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = (file) => resolve(root, 'public', file);

const { profile } = await import('../src/data/profile.ts');
const name = `${profile.firstName} ${profile.lastName}`;

const C = { bg: '#0e0e0c', fg: '#efece4', muted: '#9b988e', faint: '#67645c', accent: '#ff6a3d' };
const esc = (s) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/* ── Núcleo de puntos (mismo motivo que el hero) ───────────────── */
function orbDots({ cx, cy, r, count, tilt = 0.35 }) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  let dots = '';
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const t = golden * i;
    let x = Math.cos(t) * rad;
    let z = Math.sin(t) * rad;
    // inclinación ligera para dar volumen
    const yy = y * Math.cos(tilt) - z * Math.sin(tilt);
    z = y * Math.sin(tilt) + z * Math.cos(tilt);
    const front = (z + 1) / 2;
    const px = cx + x * r;
    const py = cy + yy * r;
    const size = 0.8 + front * 1.6;
    const glow = Math.sin(t * 0.7 + y * 4) > 0.82;
    dots += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${size.toFixed(2)}" fill="${glow ? C.accent : C.fg}" fill-opacity="${(0.12 + front * 0.78).toFixed(2)}"/>`;
  }
  return dots;
}

/** PRNG determinista: la imagen sale idéntica en cada ejecución. */
function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ringDots({ cx, cy, rx, ry, rot, count, occluder }) {
  const rand = mulberry32(7);
  let dots = '';
  for (let i = 0; i < count; i++) {
    const a = rand() * Math.PI * 2;
    const spread = 1 + (rand() - 0.5) * 0.06;
    const x = Math.cos(a) * rx * spread;
    const y = Math.sin(a) * ry * spread;
    const px = cx + x * Math.cos(rot) - y * Math.sin(rot);
    const py = cy + x * Math.sin(rot) + y * Math.cos(rot);
    const behind = Math.sin(a) < 0;
    // La mitad trasera del anillo queda oculta por la esfera
    if (behind && Math.hypot(px - occluder.cx, py - occluder.cy) < occluder.r) continue;
    const opacity = behind ? 0.3 : 0.75;
    const fill = rand() > 0.94 ? C.accent : C.fg;
    dots += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(0.7 + rand() * 0.8).toFixed(2)}" fill="${fill}" fill-opacity="${opacity}"/>`;
  }
  return dots;
}

/* ── Open Graph 1200×630 ───────────────────────────────────────── */
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="0.74" cy="0.42" r="0.5">
      <stop offset="0" stop-color="${C.accent}" stop-opacity="0.32"/>
      <stop offset="1" stop-color="${C.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="${C.bg}"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  ${orbDots({ cx: 860, cy: 340, r: 170, count: 1300 })}
  ${ringDots({ cx: 860, cy: 340, rx: 270, ry: 58, rot: -0.36, count: 700, occluder: { cx: 860, cy: 340, r: 168 } })}
  <line x1="64" y1="64" x2="1136" y2="64" stroke="${C.fg}" stroke-opacity="0.14"/>
  <text x="64" y="100" font-family="Consolas, 'Courier New', monospace" font-size="18" letter-spacing="2" fill="${C.muted}">PORTAFOLIO</text>
  <text x="1136" y="100" text-anchor="end" font-family="Consolas, 'Courier New', monospace" font-size="18" letter-spacing="2" fill="${C.muted}">${esc(profile.role.toUpperCase())}</text>
  <text x="58" y="500" font-family="'Segoe UI', 'Helvetica Neue', Arial, sans-serif" font-weight="600" font-size="150" letter-spacing="-8" fill="${C.fg}">${esc(profile.firstName)}</text>
  <text x="64" y="566" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="56" fill="${C.muted}">${esc(profile.lastName)}</text>
  <circle cx="1124" cy="552" r="7" fill="${C.accent}"/>
  <text x="1104" y="559" text-anchor="end" font-family="Consolas, 'Courier New', monospace" font-size="18" letter-spacing="1" fill="${C.muted}">${esc(profile.roleSecondary.toUpperCase())}</text>
</svg>`;

/* ── Favicon: núcleo + órbita ──────────────────────────────────── */
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${C.bg}"/>
  <circle cx="32" cy="32" r="11" fill="${C.fg}"/>
  <ellipse cx="32" cy="32" rx="23" ry="7.5" fill="none" stroke="${C.accent}" stroke-width="3.5" transform="rotate(-24 32 32)"/>
</svg>
`;

/* ── PDF mínimo válido (CV de ejemplo) ─────────────────────────── */
function placeholderPdf(lines) {
  const pdfEsc = (s) => s.replace(/[\\()]/g, (c) => `\\${c}`);
  const text = lines
    .map(([size, y, str]) => `BT /F1 ${size} Tf 72 ${y} Td (${pdfEsc(str)}) Tj ET`)
    .join('\n');
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    `<< /Length ${Buffer.byteLength(text, 'latin1')} >>\nstream\n${text}\nendstream`,
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [];
  objects.forEach((obj, i) => {
    offsets.push(Buffer.byteLength(pdf, 'latin1'));
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });
  const xref = Buffer.byteLength(pdf, 'latin1');
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('');
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(pdf, 'latin1');
}

await mkdir(resolve(root, 'public'), { recursive: true });

await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile(out('og.png'));
await writeFile(out('favicon.svg'), favicon);
await sharp(Buffer.from(favicon)).resize(48, 48).png().toFile(out('favicon-48.png'));
await sharp(Buffer.from(favicon.replace('rx="14"', 'rx="0"')))
  .resize(180, 180)
  .png()
  .toFile(out('apple-touch-icon.png'));

if (!existsSync(out('cv.pdf'))) {
  await writeFile(
    out('cv.pdf'),
    placeholderPdf([
      [24, 760, `${name} (CV de ejemplo)`],
      [12, 726, 'Este archivo es un marcador de posición.'],
      [12, 706, 'Reemplaza public/cv.pdf por tu currículum en PDF'],
      [12, 686, 'y vuelve a publicar el sitio.'],
    ]),
  );
  console.log('· cv.pdf de ejemplo creado (reemplázalo por tu CV real)');
}

console.log(`✓ Assets generados para "${name}" en /public`);
