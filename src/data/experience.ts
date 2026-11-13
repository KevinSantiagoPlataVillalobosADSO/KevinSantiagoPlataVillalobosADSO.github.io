/**
 * ─────────────────────────────────────────────────────────────
 *  TRAYECTORIA — experiencia laboral y formación.
 *  Ordénalas de la más reciente a la más antigua.
 *  Para una entrada de ejemplo, añade `placeholder: true`.
 * ─────────────────────────────────────────────────────────────
 */

export type TimelineKind = 'work' | 'education';

export interface TimelineEntry {
  kind: TimelineKind;
  period: string;
  /** Marca la entrada como actual (muestra el indicador "Ahora"). */
  current?: boolean;
  title: string;
  org: string;
  location?: string;
  summary: string;
  tags?: string[];
  placeholder?: boolean;
}

export const kindLabels: Record<TimelineKind, string> = {
  work: 'Experiencia',
  education: 'Formación',
};

export const timeline: TimelineEntry[] = [
  {
    kind: 'work',
    period: '2025 — Hoy',
    current: true,
    title: 'Programador',
    org: 'Comfenalco Santander',
    location: 'Bucaramanga',
    summary:
      'Me quedé como programador tras las prácticas gracias a un proyecto. Actualizo módulos de facturación, construyo tableros de información para directivos —empecé con la fase inicial de un proyecto de Business Intelligence— y mantengo documentación activa de bases de datos. Próximo reto: el panel de control principal de trabajadores.',
  },
  {
    kind: 'education',
    period: '2023 — Hoy',
    title: 'Formación continua',
    org: 'Cursos y autoformación',
    summary:
      'Ahora en capacitación en inteligencia artificial. Antes, Apropiación de Conceptos en Ciberseguridad (2023): protección de datos, buenas prácticas y prevención de vulnerabilidades.',
  },
  {
    kind: 'work',
    period: '2024 — 2025',
    title: 'Practicante de software',
    org: 'Comfenalco Santander',
    location: 'Bucaramanga',
    summary:
      'Documenté las bases de datos de la empresa a partir de sus tablas de catálogo (systables y syscolumns) para identificar estructuras, tablas y campos, y facilitar su organización y análisis técnico.',
  },
  {
    kind: 'education',
    period: '2022 — 2025',
    title: 'Tecnólogo en Análisis y Desarrollo de Software',
    org: 'SENA · CIMI',
    summary:
      'Análisis, diseño y desarrollo de software, bases de datos, desarrollo web y pruebas. En paralelo seguí formándome por mi cuenta desde casa.',
  },
  {
    kind: 'education',
    period: '2022',
    title: 'Fundamentos de Programación y Tecnologías Digitales',
    org: 'MinTIC · Misión TIC 2022',
    summary: 'Formación en fundamentos de programación.',
  },
];
