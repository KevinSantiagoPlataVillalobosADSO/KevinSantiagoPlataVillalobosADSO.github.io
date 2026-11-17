/**
 * ─────────────────────────────────────────────────────────────
 *  PROYECTOS — se muestran en este orden.
 *
 *  Para añadir uno:
 *    1. Guarda la captura en src/assets/projects/ (JPG/PNG, ~2000 px de ancho, 16:10).
 *    2. Impórtala arriba:   import captura from '@/assets/projects/nombre.jpg';
 *    3. Úsala en el proyecto: image: captura, imageAlt: 'Qué se ve en la captura'
 *  Astro la optimiza en el build (AVIF/WebP, varios tamaños, lazy loading).
 *
 *  Sin imagen se muestra una maqueta abstracta (`mockup`).
 *  `placeholder: true` añade la etiqueta "Contenido de ejemplo".
 * ─────────────────────────────────────────────────────────────
 */
import type { ImageMetadata } from 'astro';
import voidworm from '@/assets/projects/voidworm.jpg';
import iaGenerativa from '@/assets/projects/ia-generativa.jpg';

export type MockupKind = 'dashboard' | 'web' | 'mobile' | 'code';

export interface Project {
  title: string;
  summary: string;
  year: string;
  role: string;
  tags: string[];
  repo?: string;
  demo?: string;
  image?: ImageMetadata;
  imageAlt?: string;
  mockup?: MockupKind;
  /** Muestra la etiqueta "Contenido de ejemplo". */
  placeholder?: boolean;
}

const github = 'https://github.com/KevinSantiagoPlataVillalobosADSO';
const pages = 'https://kevinsantiagoplatavillalobosadso.github.io';

export const projects: Project[] = [
  {
    title: 'VoidWorm',
    summary:
      'Videojuego arcade ambientado en el espacio: un gusano de energía devora todo lo que encuentra para superar cinco niveles mientras tres jefes lo persiguen. Hecho con JavaScript puro, sin motores ni dependencias: el fondo, los objetos, los jefes y los sonidos se generan por código. Se juega con teclado o en pantallas táctiles, e incluye una bitácora con las decisiones técnicas.',
    year: '2026',
    role: 'Concepto y desarrollo',
    tags: ['JavaScript', 'Canvas', 'HTML5', 'CSS3'],
    repo: `${github}/VOIDWORMJS`,
    demo: `${pages}/VOIDWORMJS/`,
    image: voidworm,
    imageAlt: 'Partida de VoidWorm: un gusano luminoso avanza entre esferas de energía sobre un fondo espacial.',
  },
  {
    title: '¿Qué es la IA generativa?',
    summary:
      'Página divulgativa que explica la IA generativa en tres pasos, con ejemplos, riesgos y recursos. Su parte central es una mini-IA interactiva: colocas puntos de dos clases, la entrenas y ves en vivo cómo el modelo ajusta sus parámetros para separarlos.',
    year: '2026',
    role: 'Frontend',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Canvas'],
    repo: `${github}/ia-generativa-mockup`,
    demo: `${pages}/ia-generativa-mockup/`,
    image: iaGenerativa,
    imageAlt: 'Portada de la página: el titular «Una máquina que aprende a crear, no solo a responder» junto a una ilustración de líneas que convergen.',
  },
];
