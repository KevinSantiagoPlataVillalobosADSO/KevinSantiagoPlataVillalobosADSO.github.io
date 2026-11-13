/**
 * ─────────────────────────────────────────────────────────────
 *  STACK — tecnologías agrupadas por categoría.
 *
 *  · Añade, quita o mueve tecnologías entre grupos libremente.
 *  · `icon`: logo oficial (ver claves disponibles en src/lib/icons.ts).
 *    Si no hay logo, se muestra `abbr` (o las 3 primeras letras).
 *  · `level` es OPCIONAL y aparece en la leyenda:
 *      'frequent'     → Uso frecuente
 *      'intermediate' → Nivel medio
 *      'learning'     → En formación
 *    Las tecnologías sin `level` se muestran sin indicador.
 * ─────────────────────────────────────────────────────────────
 */
import type { TechIcon } from '@/lib/icons';

export type TechLevel = 'frequent' | 'intermediate' | 'learning';

export interface Tech {
  name: string;
  icon?: TechIcon;
  abbr?: string;
  level?: TechLevel;
}

export interface StackGroup {
  id: string;
  title: string;
  description: string;
  items: Tech[];
}

export const levelLabels: Record<TechLevel, string> = {
  frequent: 'Uso frecuente',
  intermediate: 'Nivel medio',
  learning: 'En formación',
};

export const stack: StackGroup[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    description: 'Mi terreno más fuerte, sobre todo con Vue 3 y TypeScript.',
    items: [
      { name: 'TypeScript', icon: 'typescript', level: 'frequent' },
      { name: 'Vue 3', icon: 'vue', level: 'frequent' },
      { name: 'CSS3', icon: 'css', level: 'frequent' },
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'HTML5', icon: 'html5' },
      { name: 'Angular', icon: 'angular', level: 'intermediate' },
      { name: 'React', icon: 'react', level: 'intermediate' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    description: 'Lenguajes, lógica de negocio y APIs.',
    items: [
      { name: 'PHP', icon: 'php', level: 'frequent' },
      { name: 'Go', icon: 'go', level: 'frequent' },
      { name: 'Laravel', icon: 'laravel' },
      { name: 'Java', icon: 'java', level: 'intermediate' },
      { name: 'Python', icon: 'python', level: 'intermediate' },
      { name: 'C#', abbr: 'C#', level: 'intermediate' },
      // El logo de .NET es la propia palabra: junto al nombre se leería dos veces.
      { name: '.NET', abbr: 'NET', level: 'intermediate' },
      { name: 'Rust', icon: 'rust', level: 'intermediate' },
      { name: 'APIs REST', abbr: 'API' },
    ],
  },
  {
    id: 'datos',
    title: 'Datos',
    description: 'Modelado, consultas y bases de datos relacionales.',
    items: [
      { name: 'SQL', abbr: 'SQL' },
      // El logo oficial de MySQL incluye texto diminuto, ilegible a este tamaño.
      { name: 'MySQL', abbr: 'MY' },
      { name: 'Informix', abbr: 'IFX' },
    ],
  },
  {
    id: 'herramientas',
    title: 'Herramientas',
    description: 'Control de versiones y trabajo en equipo.',
    items: [
      { name: 'Git', icon: 'git' },
      { name: 'GitHub', icon: 'github' },
    ],
  },
  {
    id: 'formacion',
    title: 'En formación',
    description: 'Lo que estoy estudiando ahora mismo.',
    items: [{ name: 'Inteligencia artificial', abbr: 'IA', level: 'learning' }],
  },
];

export const techCount = stack.reduce((n, g) => n + g.items.length, 0);
