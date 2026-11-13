/**
 * Imágenes personales. Se mantienen fuera de profile.ts para que ese
 * archivo no tenga imports (lo lee también el script de assets).
 *
 * Retrato (sección "Sobre mí"):
 *   1. Guarda tu foto en src/assets/retrato.jpg (vertical, 4:5, ~1200 px de ancho).
 *   2. Descomenta las dos líneas de abajo.
 */
import type { ImageMetadata } from 'astro';

// import retrato from '@/assets/retrato.jpg';
// export const portrait: ImageMetadata | undefined = retrato;
export const portrait: ImageMetadata | undefined = undefined;
export const portraitAlt = 'Retrato de Kevin Plata'; // PENDIENTE: describe tu foto cuando la añadas
