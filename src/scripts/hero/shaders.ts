/**
 * Shaders de partículas. Todo el movimiento ocurre en la GPU:
 * la CPU solo actualiza un puñado de uniforms por frame.
 *
 * aKind: 0 = núcleo (esfera), 1 = anillo orbital, 2 = polvo ambiental.
 */

// Ruido simplex 3D — Ashima Arts / Stefan Gustavson (MIT).
const simplex = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

export const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uScale;        // px por unidad de mundo a distancia 1 (ya incluye DPR)
uniform float uSizeFactor;   // corrige el tamaño de punto según la escala del núcleo
uniform vec3 uPointer;       // puntero proyectado al plano z = 0 (mundo)
uniform float uPointerStrength;
uniform vec2 uLens;          // (radio, empuje) de la lente, proporcional al núcleo
uniform float uScroll;       // 0 → 1 a medida que el hero sale de pantalla
uniform float uIntro;        // 0 → 1 al cargar: las partículas convergen
uniform vec3 uCenter;        // centro del núcleo en el mundo
uniform vec2 uDepth;         // (cerca, lejos) del núcleo respecto a la cámara

attribute float aRandom;
attribute float aKind;

varying float vGlow;
varying float vAlpha;

${simplex}

void main() {
  vec3 p = position;
  float glow = 0.0;
  float alpha = 1.0;

  if (aKind < 0.5) {
    // Núcleo: desplazamiento radial con dos octavas de ruido
    vec3 dir = normalize(p);
    float n = snoise(dir * 1.25 + vec3(0.0, uTime * 0.1, uTime * 0.06));
    float n2 = snoise(dir * 3.4 - vec3(uTime * 0.05));
    p = dir * length(p) * (1.0 + n * 0.1 + n2 * 0.025);
    // El acento solo en las crestas: brasa puntual, no un baño naranja
    glow = smoothstep(0.38, 0.8, n) * 0.9;
    alpha = 0.9;
  } else if (aKind < 1.5) {
    // Anillo: cada partícula orbita a su propia velocidad
    float a = uTime * (0.05 + aRandom * 0.035);
    float c = cos(a);
    float s = sin(a);
    p.xz = mat2(c, -s, s, c) * p.xz;
    p.y += sin(uTime * 0.5 + aRandom * 6.2831) * 0.02;
    glow = step(0.95, aRandom) * 0.85;
    alpha = 0.6;
  } else {
    // Polvo: deriva lenta para dar profundidad al fondo
    p.x += cos(uTime * 0.08 + aRandom * 6.2831) * 0.18;
    p.y += sin(uTime * 0.12 + aRandom * 6.2831) * 0.22;
    alpha = 0.28;
  }

  vec4 world = modelMatrix * vec4(p, 1.0);
  vec3 outward = normalize(world.xyz - uCenter + vec3(0.0001));

  // Lente del cursor: aparta y enciende las partículas cercanas
  if (aKind < 1.5) {
    vec2 d = world.xy - uPointer.xy;
    float dist = length(d);
    float f = (1.0 - smoothstep(0.0, uLens.x, dist)) * uPointerStrength;
    f *= f; // caída suave: el centro de la lente empuja, el borde apenas roza
    world.xy += normalize(d + vec2(0.0001)) * f * uLens.y;
    world.z += f * uLens.y * 0.6;
    glow = max(glow, f * 0.85);
  }

  // Dispersión al hacer scroll + convergencia de entrada
  float spread = uScroll * (0.5 + aRandom * 2.4) + (1.0 - uIntro) * (1.2 + aRandom * 2.8);
  world.xyz += outward * spread;

  vec4 mv = viewMatrix * world;
  gl_Position = projectionMatrix * mv;

  float depth = -mv.z;
  float size = (aKind < 1.5 ? 0.021 : 0.03) * (0.55 + aRandom * 0.95) * (1.0 + glow * 0.7) * uSizeFactor;
  gl_PointSize = max(size * uScale / depth, 1.0);

  // Las partículas traseras se apagan: profundidad sin luces ni sombras
  float front = 1.0 - smoothstep(uDepth.x, uDepth.y, depth);
  float twinkle = 0.78 + 0.22 * sin(uTime * (0.6 + aRandom * 1.4) + aRandom * 40.0);

  vAlpha = alpha * mix(0.16, 1.0, front) * twinkle * (1.0 - uScroll * 0.85) * uIntro;
  vGlow = glow;
}
`;

export const fragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uAccent;

varying float vGlow;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float core = 1.0 - smoothstep(0.0, 0.5, d);
  core *= core;
  vec3 color = mix(uColor, uAccent, clamp(vGlow, 0.0, 1.0));
  gl_FragColor = vec4(color, core * vAlpha);
}
`;
