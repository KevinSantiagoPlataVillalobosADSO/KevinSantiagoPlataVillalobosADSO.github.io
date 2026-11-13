/**
 * ─────────────────────────────────────────────────────────────
 *  PERFIL — tus datos.
 *
 *  Los textos largos están redactados a partir de lo que contaste
 *  (y de tu CV). Revisa que suenen a ti y ajústalos con libertad.
 *  Lo que sigue marcado con  PENDIENTE  aún es un placeholder.
 *
 *  Convención: en los textos largos, *palabra* se muestra en
 *  serif itálica (acento tipográfico).
 *
 *  Este archivo no debe importar nada: lo lee también el script
 *  `npm run assets` (imagen Open Graph, favicon y CV de ejemplo).
 * ─────────────────────────────────────────────────────────────
 */

export interface SocialLink {
  label: string;
  /** Texto corto visible, p. ej. "@usuario". */
  handle: string;
  href: string;
}

export const profile = {
  firstName: 'Kevin',
  lastName: 'Plata',

  role: 'Software Developer',
  roleSecondary: 'Full Stack Developer',

  location: 'Bucaramanga, Colombia',

  /** Indicador en la cabecera. Pon `open: false` para ocultarlo. */
  availability: {
    open: true,
    label: 'Abierto a proyectos y asesorías',
  },

  /** Frase corta del hero. */
  intro:
    'Programador full stack en Comfenalco Santander. Construyo módulos, tableros e interfaces pensando siempre en cómo mejorar la experiencia de quien los usa.',

  email: 'ksantiagoplata@gmail.com',

  /** Archivo dentro de /public. PENDIENTE: public/cv.pdf sigue siendo el CV de ejemplo. */
  cvFile: 'cv.pdf',

  /** Redes. Añade, quita o reordena. */
  socials: [
    {
      label: 'GitHub',
      handle: '@KevinSantiagoPlataVillalobosADSO',
      href: 'https://github.com/KevinSantiagoPlataVillalobosADSO',
    },
    {
      label: 'LinkedIn',
      handle: 'in/tiago-plata-520656213',
      href: 'https://www.linkedin.com/in/tiago-plata-520656213/',
    },
    {
      label: 'Instagram',
      handle: '@thiago.silver77',
      href: 'https://www.instagram.com/thiago.silver77/',
    },
  ] satisfies SocialLink[],

  /** Sección "Sobre mí". */
  about: {
    statement:
      'Me gustan los problemas que *parecen* no tener salida. Soy curioso, proactivo y creo que la experiencia de quien usa un sistema siempre se puede *mejorar.*',
    blocks: [
      {
        title: 'Quién soy',
        body: 'Programador full stack en Comfenalco Santander. Me formé como tecnólogo en el SENA mientras aprendía por mi cuenta desde casa, y tengo formación en diseño gráfico.',
      },
      {
        title: 'Cómo trabajo',
        body: 'Con curiosidad y proactividad: investigo, pregunto y propongo. Busco que cada entrega mejore la experiencia de quien usa el sistema; siempre hay algo que innovar.',
      },
      {
        title: 'Con qué trabajo',
        body: 'Lo que más uso: TypeScript, Vue 3, CSS, PHP y Go. Ahora mismo me estoy capacitando en inteligencia artificial.',
        link: { href: '#stack', label: 'Ver stack' },
      },
    ] as { title: string; body: string; link?: { href: string; label: string } }[],
    interests: [
      'Problemas que parecen no tener salida',
      'Tableros que convierten datos en decisiones',
      'Módulos existentes que necesitan actualizarse',
      'Bases de datos que piden ser documentadas',
    ],
    principles: [
      {
        title: 'La curiosidad va primero.',
        body: 'Entender cómo funciona algo es el primer paso para mejorarlo.',
      },
      {
        title: 'Toda experiencia es mejorable.',
        body: 'Siempre hay un detalle que puede hacerle el trabajo más fácil a alguien.',
      },
      {
        title: 'Ningún problema está cerrado.',
        body: 'Si parece no tener salida, todavía no lo hemos mirado desde el ángulo correcto.',
      },
    ],
  },

  contactNote:
    'Hoy trabajo en Comfenalco Santander, pero siempre estoy abierto a escuchar un proyecto, dar una asesoría o simplemente hablar de código.',

  seo: {
    description:
      'Portafolio de Kevin Plata, Software Developer y Full Stack Developer en Bucaramanga, Colombia. Stack tecnológico, trayectoria y contacto.',
    /** Formato idioma_REGIÓN, p. ej. es_CO, es_MX, es_ES. */
    locale: 'es_CO',
  },
} as const;

export const fullName = `${profile.firstName} ${profile.lastName}`;
