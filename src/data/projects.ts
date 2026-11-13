/**
 * ─────────────────────────────────────────────────────────────
 *  PROYECTOS — los cuatro de abajo son EJEMPLOS (placeholder: true).
 *  Reemplázalos por tus proyectos reales y elimina `placeholder`.
 *
 *  Para usar una captura real:
 *    1. Guarda la imagen en src/assets/projects/ (JPG/PNG, ~2000 px de ancho, 16:10).
 *    2. Impórtala arriba:   import capturaAlfa from '@/assets/projects/alfa.jpg';
 *    3. Úsala en el proyecto: image: capturaAlfa, imageAlt: 'Qué se ve en la captura'
 *  Astro la optimiza en el build (AVIF/WebP, varios tamaños, lazy loading).
 *
 *  Mientras no haya imagen se muestra una maqueta abstracta (`mockup`).
 * ─────────────────────────────────────────────────────────────
 */
import type { ImageMetadata } from 'astro';

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
  /** Muestra la etiqueta "Contenido de ejemplo". Quítalo al poner datos reales. */
  placeholder?: boolean;
}

export const projects: Project[] = [
  {
    title: 'Proyecto Alfa',
    summary:
      'Describe aquí qué problema resuelve el proyecto, para quién lo construiste y qué lo hace interesante a nivel técnico. Dos o tres líneas bastan.',
    year: '20XX',
    role: 'Full stack',
    tags: ['Laravel', 'Vue.js', 'MySQL'],
    repo: 'https://github.com/tu-usuario/proyecto-alfa',
    demo: 'https://tu-usuario.github.io/proyecto-alfa',
    mockup: 'dashboard',
    placeholder: true,
  },
  {
    title: 'Proyecto Beta',
    summary:
      'Un buen resumen menciona el contexto, tu papel y el resultado. Evita listar tecnologías aquí: ya aparecen debajo.',
    year: '20XX',
    role: 'Backend',
    tags: ['PHP', 'APIs REST', 'JavaScript'],
    repo: 'https://github.com/tu-usuario/proyecto-beta',
    mockup: 'web',
    placeholder: true,
  },
  {
    title: 'Proyecto Gamma',
    summary:
      'Si el proyecto tiene demo pública, enlázala. Si es privado, explica el reto y muestra una captura sin datos sensibles.',
    year: '20XX',
    role: 'Frontend',
    tags: ['React', 'APIs REST'],
    repo: 'https://github.com/tu-usuario/proyecto-gamma',
    demo: 'https://tu-usuario.github.io/proyecto-gamma',
    mockup: 'mobile',
    placeholder: true,
  },
  {
    title: 'Proyecto Delta',
    summary:
      'Para proyectos sin demo, el enlace al repositorio y un README claro hacen el trabajo. Cuenta qué aprendiste.',
    year: '20XX',
    role: 'Datos',
    tags: ['SQL', 'Informix'],
    repo: 'https://github.com/tu-usuario/proyecto-delta',
    mockup: 'code',
    placeholder: true,
  },
];
