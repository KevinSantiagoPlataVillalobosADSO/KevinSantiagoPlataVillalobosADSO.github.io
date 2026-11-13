/** Secciones navegables. El índice se usa en la cabecera y en cada sección. */
export const sections = [
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'stack', label: 'Stack' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'trayectoria', label: 'Trayectoria' },
  { id: 'contacto', label: 'Contacto' },
] as const;

export type SectionId = (typeof sections)[number]['id'];

export const sectionIndex = (id: SectionId) =>
  String(sections.findIndex((s) => s.id === id) + 1).padStart(2, '0');
