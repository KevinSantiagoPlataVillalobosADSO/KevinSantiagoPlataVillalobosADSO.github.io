/**
 * Escena del hero: núcleo de partículas + anillo orbital + polvo ambiental.
 *
 * Decisiones de rendimiento:
 *  · Un solo WebGLRenderer, un solo material (un programa de shader).
 *  · Todo el movimiento en el vertex shader; la CPU solo escribe uniforms.
 *  · Densidad reducida en móvil / poca memoria; DPR limitado.
 *  · El bucle se detiene si el hero no está en pantalla o la pestaña está oculta.
 *  · Con prefers-reduced-motion se pinta un único fotograma estático.
 *
 * La posición y el tamaño del núcleo los decide el CSS: el script lee el
 * rectángulo de [data-hero-orb] y lo traduce a coordenadas de mundo.
 */
import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { fragmentShader, vertexShader } from './shaders';

interface SceneOptions {
  host: HTMLElement;
  canvas: HTMLCanvasElement;
  anchor: HTMLElement;
}

const FOV = 35;
const CAMERA_Z = 7;
const RADIUS = 1.5;
const HALF_FOV_TAN = Math.tan((FOV * Math.PI) / 360);

/** Color CSS hex → vec3 sRGB sin conversión (el shader escribe tal cual en el canvas). */
function cssColor(name: string, fallback: string): Vector3 {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const hex = /^#[0-9a-f]{6}$/i.test(raw) ? raw : fallback;
  const n = parseInt(hex.slice(1), 16);
  return new Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

function gauss(): number {
  // Box–Muller
  const u = 1 - Math.random();
  const v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function makeGeometry(positions: Float32Array, kind: number): BufferGeometry {
  const count = positions.length / 3;
  const random = new Float32Array(count);
  const kinds = new Float32Array(count).fill(kind);
  for (let i = 0; i < count; i++) random[i] = Math.random();

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('aRandom', new Float32BufferAttribute(random, 1));
  geometry.setAttribute('aKind', new Float32BufferAttribute(kinds, 1));
  return geometry;
}

/** Esfera de Fibonacci: distribución uniforme, sin polos amontonados. */
function buildCore(count: number): BufferGeometry {
  const pos = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const jitter = RADIUS * (1 + (Math.random() - 0.5) * 0.05);
    pos[i * 3] = Math.cos(theta) * r * jitter;
    pos[i * 3 + 1] = y * jitter;
    pos[i * 3 + 2] = Math.sin(theta) * r * jitter;
  }
  return makeGeometry(pos, 0);
}

function buildRing(count: number): BufferGeometry {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const band = Math.random() < 0.8;
    const radius = band ? 2.3 + gauss() * 0.08 : 2.55 + Math.random() * 0.95;
    const y = band ? gauss() * 0.022 : gauss() * 0.11;
    pos[i * 3] = Math.cos(a) * radius;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = Math.sin(a) * radius;
  }
  return makeGeometry(pos, 1);
}

function buildDust(count: number): BufferGeometry {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 16;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 9;
    pos[i * 3 + 2] = -Math.random() * 5;
  }
  return makeGeometry(pos, 2);
}

export function createHeroScene({ host, canvas, anchor }: SceneOptions) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compact = window.innerWidth < 768;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const lowPower = (nav.deviceMemory ?? 8) <= 4 || (navigator.hardwareConcurrency ?? 8) <= 4;
  const density = compact || lowPower ? 0.45 : 1;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
  } catch {
    return null; // Sin WebGL: se queda el fallback CSS.
  }

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.5 : 1.75));

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 60);
  camera.position.set(0, 0, CAMERA_Z);

  const uniforms = {
    uTime: { value: 0 },
    uScale: { value: 1 },
    uSizeFactor: { value: 1 },
    uPointer: { value: new Vector3(99, 99, 0) },
    uPointerStrength: { value: 0 },
    uLens: { value: new Vector2(0.6, 0.2) },
    uScroll: { value: 0 },
    uIntro: { value: reduceMotion.matches ? 1 : 0 },
    uCenter: { value: new Vector3() },
    uDepth: { value: new Vector2(CAMERA_Z - RADIUS, CAMERA_Z + RADIUS) },
    uColor: { value: cssColor('--fg', '#efece4') },
    uAccent: { value: cssColor('--accent', '#ff6a3d') },
  };

  const material = new ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: AdditiveBlending,
  });

  const root = new Group();
  const core = new Points(buildCore(Math.round(9000 * density)), material);
  const ringPivot = new Group();
  // Inclinación baja: el anillo se lee como una órbita elíptica, no como un halo.
  ringPivot.rotation.set(0.3, 0, -0.36);
  const ring = new Points(buildRing(Math.round(3200 * density)), material);
  const dust = new Points(buildDust(Math.round(420 * density)), material);
  // Los shaders desplazan vértices: el culling por bounding sphere no sirve.
  [core, ring, dust].forEach((p) => (p.frustumCulled = false));

  ringPivot.add(ring);
  root.add(core, ringPivot);
  scene.add(root, dust);

  // ── Layout: el CSS manda ────────────────────────────────────
  let visW = 1;
  let visH = 1;
  let baseX = 0;
  let baseY = 0;

  const layout = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;

    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    visH = 2 * HALF_FOV_TAN * CAMERA_Z;
    visW = visH * camera.aspect;

    const c = canvas.getBoundingClientRect();
    const a = anchor.getBoundingClientRect();
    const cx = a.left + a.width / 2 - c.left;
    const cy = a.top + a.height / 2 - c.top;
    baseX = (cx / w - 0.5) * visW;
    baseY = -(cy / h - 0.5) * visH;

    const diameter = (Math.min(a.width, a.height) / h) * visH;
    const scale = diameter / (RADIUS * 2);
    root.scale.setScalar(scale);
    root.position.set(baseX, baseY, 0);

    uniforms.uScale.value = (h * renderer.getPixelRatio()) / (2 * HALF_FOV_TAN);
    uniforms.uSizeFactor.value = Math.sqrt(scale);
    uniforms.uCenter.value.set(baseX, baseY, 0);
    uniforms.uDepth.value.set(CAMERA_Z - RADIUS * scale, CAMERA_Z + RADIUS * scale);
    // Lente sutil: ~45 % del radio del núcleo, empuje del 14 %
    uniforms.uLens.value.set(RADIUS * scale * 0.45, RADIUS * scale * 0.14);
  };

  // ── Puntero ─────────────────────────────────────────────────
  const pointerNdc = new Vector2(0, 0);
  const pointerTarget = new Vector3(99, 99, 0);
  let pointerInside = false;
  let touchPulse = 0;

  const toWorld = (clientX: number, clientY: number) => {
    const c = canvas.getBoundingClientRect();
    const nx = ((clientX - c.left) / c.width) * 2 - 1;
    const ny = -((clientY - c.top) / c.height) * 2 + 1;
    pointerNdc.set(nx, ny);
    // Cámara en el eje z mirando al origen: el plano z = 0 es lineal en NDC.
    pointerTarget.set((nx * visW) / 2, (ny * visH) / 2, 0);
    return c;
  };

  const onPointerMove = (e: PointerEvent) => {
    const c = toWorld(e.clientX, e.clientY);
    pointerInside = e.clientY >= c.top && e.clientY <= c.bottom;
    if (e.pointerType === 'touch') touchPulse = 1;
  };

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== 'touch') return;
    toWorld(e.clientX, e.clientY);
    uniforms.uPointer.value.copy(pointerTarget);
    touchPulse = 1;
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerdown', onPointerDown, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => (pointerInside = false));

  // ── Bucle ───────────────────────────────────────────────────
  let raf = 0;
  let last = 0;
  let time = 0;
  let introStart = -1;
  let tiltX = 0;
  let tiltY = 0;
  let onScreen = true;
  let pageVisible = !document.hidden;
  let ready = false;

  const markReady = () => {
    if (ready) return;
    ready = true;
    canvas.setAttribute('data-ready', '');
  };

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    time += dt;

    // Entrada: convergencia en ~2.4 s con ease-out cúbico
    if (introStart < 0) introStart = now;
    const t = Math.min((now - introStart) / 2400, 1);
    uniforms.uIntro.value = 1 - Math.pow(1 - t, 3);

    // Seguimiento exponencial (independiente del frame rate)
    const kSlow = 1 - Math.exp(-dt * 3);
    const kFast = 1 - Math.exp(-dt * 7);

    uniforms.uPointer.value.lerp(pointerTarget, kFast);
    touchPulse *= Math.exp(-dt * 1.6);
    const strengthTarget = Math.max(pointerInside ? 1 : 0, touchPulse);
    uniforms.uPointerStrength.value += (strengthTarget - uniforms.uPointerStrength.value) * kSlow;

    tiltX += (-pointerNdc.y * 0.14 - tiltX) * kSlow;
    tiltY += (pointerNdc.x * 0.24 - tiltY) * kSlow;
    root.rotation.x = tiltX;
    root.rotation.y = tiltY;
    core.rotation.y += dt * 0.05;

    // Scroll: el núcleo se dispersa y sube algo más despacio que el contenido
    const rect = host.getBoundingClientRect();
    const scroll = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1);
    uniforms.uScroll.value = scroll;
    root.position.y = baseY + scroll * visH * 0.18;

    uniforms.uTime.value = time;
    renderer.render(scene, camera);
    markReady();
  };

  const renderStatic = () => {
    uniforms.uTime.value = 14;
    uniforms.uIntro.value = 1;
    uniforms.uPointerStrength.value = 0;
    renderer.render(scene, camera);
    markReady();
  };

  const sync = () => {
    const shouldRun = onScreen && pageVisible && !reduceMotion.matches;
    if (shouldRun && !raf) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    } else if (!shouldRun && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
    if (reduceMotion.matches) renderStatic();
  };

  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    sync();
  }).observe(host);

  document.addEventListener('visibilitychange', () => {
    pageVisible = !document.hidden;
    sync();
  });

  reduceMotion.addEventListener('change', sync);

  new ResizeObserver(() => {
    layout();
    if (!raf) renderStatic();
  }).observe(canvas);

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    cancelAnimationFrame(raf);
    raf = 0;
    canvas.removeAttribute('data-ready');
  });

  layout();
  sync();

  return { layout };
}
