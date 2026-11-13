/**
 * Iconografía resuelta en build (cero JS en el cliente).
 *  · UI: Lucide (trazo), importados uno a uno.
 *  · Tecnologías: Simple Icons (logos oficiales, CC0).
 * Para añadir un logo, busca su nombre en https://simpleicons.org e
 * impórtalo aquí con el prefijo `si`.
 */
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Mail,
  MapPin,
  Menu,
  X,
} from 'lucide-static';
import {
  siAngular,
  siCss,
  siGit,
  siGithub,
  siGo,
  siHtml5,
  siJavascript,
  siLaravel,
  siMysql,
  siOpenjdk,
  siPhp,
  siPython,
  siReact,
  siRust,
  siTypescript,
  siVuedotjs,
} from 'simple-icons';

export const uiIcons = {
  'arrow-down': ArrowDown,
  'arrow-up': ArrowUp,
  'arrow-up-right': ArrowUpRight,
  check: Check,
  copy: Copy,
  download: Download,
  mail: Mail,
  'map-pin': MapPin,
  menu: Menu,
  x: X,
} as const;

export type IconName = keyof typeof uiIcons;

export const techIcons = {
  angular: siAngular,
  css: siCss,
  git: siGit,
  github: siGithub,
  go: siGo,
  html5: siHtml5,
  // Simple Icons no incluye el logo de Java (marca de Oracle); Duke, de OpenJDK, lo sustituye.
  java: siOpenjdk,
  javascript: siJavascript,
  laravel: siLaravel,
  mysql: siMysql,
  php: siPhp,
  python: siPython,
  react: siReact,
  rust: siRust,
  typescript: siTypescript,
  vue: siVuedotjs,
} as const;

export type TechIcon = keyof typeof techIcons;

/** Extrae el contenido interno de un SVG de Lucide para re-envolverlo con nuestros atributos. */
export function svgInner(svg: string): string {
  return svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim();
}
