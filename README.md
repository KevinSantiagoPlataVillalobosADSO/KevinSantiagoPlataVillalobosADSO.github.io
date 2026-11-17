# Portafolio — Software Developer

Sitio personal estático construido con **Astro 7** y **Three.js**, listo para publicarse en **GitHub Pages**.

## Requisitos

- Node.js **22.12 o superior** (para `npm run assets` se necesita 22.18+)

## Comandos

| Comando           | Qué hace                                                        |
| ----------------- | --------------------------------------------------------------- |
| `npm install`     | Instala dependencias                                            |
| `npm run dev`     | Servidor local en `http://localhost:4321`                       |
| `npm run build`   | Genera el sitio estático en `dist/`                             |
| `npm run preview` | Sirve `dist/` para revisarlo antes de publicar                  |
| `npm run assets`  | Regenera imagen Open Graph, favicons y CV de ejemplo desde tus datos |

## Editar el contenido

Todo el contenido vive en `src/data/`. No hace falta tocar componentes.

| Archivo                     | Contenido                                                     |
| --------------------------- | ------------------------------------------------------------- |
| `src/data/profile.ts`       | Nombre, rol, intro, correo, redes, textos de "Sobre mí", SEO  |
| `src/data/stack.ts`         | Tecnologías por categoría (y nivel opcional)                  |
| `src/data/projects.ts`      | Proyectos, enlaces y capturas                                 |
| `src/data/experience.ts`    | Experiencia laboral y formación                               |
| `src/data/media.ts`         | Tu retrato                                                    |
| `public/cv.pdf`             | Tu CV (reemplaza el de ejemplo)                               |

Convención: en textos largos, `*palabra*` se muestra en serif itálica.

### Checklist antes de publicar

Busca `PENDIENTE` en `src/data/` y reemplaza:

- [x] Apellido, ubicación, correo y enlaces de redes
- [x] Textos del hero y de "Sobre mí" (redactados con tus datos: revísalos)
- [x] Disponibilidad (`availability.open`)
- [x] Proyectos reales (VoidWorm e IA generativa; añade más en `src/data/projects.ts`)
- [x] Experiencia y formación
- [ ] Retrato en `src/assets/retrato.jpg` (opcional)
- [ ] CV para la web en `public/cv.pdf` (sin teléfono, dirección ni fecha de nacimiento)
- [x] `npm run assets` para regenerar la imagen de redes con tu nombre

### Añadir una captura de proyecto

1. Guarda la imagen en `src/assets/projects/` (16:10, ~2000 px de ancho).
2. Impórtala en `src/data/projects.ts`: `import alfa from '@/assets/projects/alfa.jpg';`
3. En el proyecto: `image: alfa, imageAlt: 'Qué muestra la captura'`.

Astro la convierte a formatos modernos, genera varios tamaños y la carga en diferido.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub y sube el proyecto a la rama `main`.
   - Si se llama `tu-usuario.github.io`, el sitio queda en la raíz.
   - Con cualquier otro nombre, queda en `tu-usuario.github.io/nombre-del-repo/`.
2. En el repositorio: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Cada push a `main` compila y publica automáticamente (`.github/workflows/deploy.yml`).

No hay que configurar la URL a mano: el workflow detecta el dominio y la ruta base.

## Decisiones técnicas

**Dependencias (solo las necesarias):**

| Paquete | Para qué |
| --- | --- |
| `astro` | HTML estático prerenderizado: SEO completo, cero JS por defecto |
| `three` | Escena 3D del hero; se carga en diferido cuando el navegador está ocioso |
| `@fontsource*` | Fuentes servidas desde el propio sitio (sin CDN externa) |
| `lucide-static`, `simple-icons` | Iconos y logos resueltos en el build (cero JS) |

**Descartadas a propósito:**

- **GSAP**: CSS, IntersectionObserver y scroll-driven animations cubren todas las animaciones.
- **Lenis**: el scroll nativo respeta trackpads, teclado y accesibilidad.
- **React/Framer Motion**: no hay estado de interfaz que lo justifique.

**Rendimiento:**

- El JS inicial es mínimo; Three.js (~130 KB gzip) va en un chunk diferido.
- La escena se pausa fuera de pantalla y con la pestaña oculta.
- Hay menos partículas y DPR limitado en móvil.
- Las fuentes se precargan con métricas de respaldo ajustadas (CLS ≈ 0).

**Accesibilidad:**

- HTML semántico y enlace "Saltar al contenido".
- Foco visible y menú móvil con `<dialog>` nativo.
- Contraste AA.
- Con `prefers-reduced-motion`, la escena 3D queda estática y se eliminan desplazamientos y parallax.

**Seguridad:**

- Content Security Policy con hashes, generada por Astro.
- Sin scripts de terceros.
- `rel="noopener noreferrer"` en todos los enlaces externos.

## Estructura

```
src/
├── components/
│   ├── layout/      Header, Footer, Section, Seo, Cursor
│   ├── sections/    Hero, About, Stack, Projects, Experience, Contact
│   ├── projects/    ProjectItem, ProjectMockup
│   └── ui/          Button, Icon, SplitWords, TechLogo, PendingTag
├── data/            ← tu contenido
├── layouts/         BaseLayout
├── lib/             utilidades (rutas, iconos)
├── pages/           index, 404, robots.txt, sitemap.xml
├── scripts/         interacción (header, reveal, cursor, copiar, escena 3D)
└── styles/          tokens de diseño y estilos globales
```
