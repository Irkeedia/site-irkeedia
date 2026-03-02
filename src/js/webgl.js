/* ============================================
   IRKEEDIA — WebGL Module
   Three.js Particle System for Hero Section
   Interactive particle field with shaders
   ============================================ */

import * as THREE from 'three'
import gsap from 'gsap'

// ─── VERTEX SHADER ──────────────────────────────
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uSize;
  uniform float uScrollProgress;

  attribute float aScale;
  attribute float aRandom;

  varying float vAlpha;
  varying float vRandom;

  void main() {
    vec3 pos = position;

    // Organic wave motion (multi-frequency sin/cos)
    float t = uTime * 0.25;
    pos.x += sin(pos.y * 0.4 + t) * cos(pos.z * 0.3 + t * 0.7) * 0.5;
    pos.y += cos(pos.x * 0.35 + t * 0.8) * sin(pos.z * 0.45 + t * 0.5) * 0.4;
    pos.z += sin(pos.x * 0.25 + pos.y * 0.35 + t * 0.6) * 0.6;

    // Secondary micro-motion
    pos.x += sin(pos.z * 1.2 + t * 2.0) * 0.08;
    pos.y += cos(pos.x * 1.5 + t * 1.8) * 0.06;

    // Scroll-based dispersion
    pos *= 1.0 + uScrollProgress * 0.3;

    // Transform to view space FIRST
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Mouse repulsion in VIEW SPACE (screen-aligned, immune to model rotation)
    vec2 mouseViewPos = uMouse * 4.0;
    float distToMouse = length(mvPosition.xy - mouseViewPos);
    float mouseInfluence = smoothstep(3.5, 0.0, distToMouse);
    mvPosition.z += mouseInfluence * 2.0;
    vec2 dir = normalize(mvPosition.xy - mouseViewPos + vec2(0.001));
    mvPosition.xy += dir * mouseInfluence * 0.7;

    gl_PointSize = uSize * aScale * (180.0 / -mvPosition.z);
    gl_PointSize = max(gl_PointSize, 1.0);

    gl_Position = projectionMatrix * mvPosition;

    // Alpha based on distance to camera — toned down for text readability
    vAlpha = smoothstep(18.0, 2.0, -mvPosition.z) * (0.12 + aScale * 0.38);
    vRandom = aRandom;
  }
`

// ─── FRAGMENT SHADER ────────────────────────────
const fragmentShader = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;

  varying float vAlpha;
  varying float vRandom;

  void main() {
    // Soft circle shape
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float alpha = smoothstep(0.5, 0.15, dist) * vAlpha;

    // Mix between two colors based on random
    vec3 color = mix(uColor1, uColor2, vRandom);

    // Subtle glow at center — reduced for text readability
    float glow = smoothstep(0.5, 0.0, dist) * 0.12;
    color += glow;

    gl_FragColor = vec4(color, alpha);
  }
`

// ─── INIT WEBGL ─────────────────────────────────
export function initWebGL() {
  const container = document.getElementById('hero-canvas')
  if (!container) return

  // Scene setup
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  )
  camera.position.z = 6

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.appendChild(renderer.domElement)

  // ── Particles ──
  const particleCount = 2500
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const scales = new Float32Array(particleCount)
  const randoms = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    // Random distribution in a cube
    positions[i * 3]     = (Math.random() - 0.5) * 16
    positions[i * 3 + 1] = (Math.random() - 0.5) * 14
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12

    scales[i] = Math.random() * 0.8 + 0.2
    randoms[i] = Math.random()
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
  geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

  // Shader material
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uSize: { value: 2.2 },
      uScrollProgress: { value: 0 },
      uColor1: { value: new THREE.Color('#a0cc00') },
      uColor2: { value: new THREE.Color('#6e8a00') },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  const particles = new THREE.Points(geometry, material)
  scene.add(particles)

  // ── Add subtle connecting lines (constellation effect) ──
  const lineGeometry = new THREE.BufferGeometry()
  const lineCount = 200
  const linePositions = new Float32Array(lineCount * 6)

  for (let i = 0; i < lineCount; i++) {
    const idx1 = Math.floor(Math.random() * particleCount)
    const idx2 = Math.floor(Math.random() * particleCount)

    linePositions[i * 6]     = positions[idx1 * 3]
    linePositions[i * 6 + 1] = positions[idx1 * 3 + 1]
    linePositions[i * 6 + 2] = positions[idx1 * 3 + 2]
    linePositions[i * 6 + 3] = positions[idx2 * 3]
    linePositions[i * 6 + 4] = positions[idx2 * 3 + 1]
    linePositions[i * 6 + 5] = positions[idx2 * 3 + 2]
  }

  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))

  const lineMaterial = new THREE.LineBasicMaterial({
    color: new THREE.Color('#c8ff00'),
    transparent: true,
    opacity: 0.03,
    blending: THREE.AdditiveBlending,
  })

  const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
  scene.add(lines)

  // ── Mouse tracking ──
  const mouse = { x: 0, y: 0 }
  const targetMouse = { x: 0, y: 0 }

  document.addEventListener('mousemove', (e) => {
    targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1
    targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1
  })

  // ── Scroll progress ──
  let scrollProgress = 0

  window.addEventListener('scroll', () => {
    const heroHeight = container.closest('.hero')?.offsetHeight || window.innerHeight
    scrollProgress = Math.min(window.scrollY / heroHeight, 1)
  })

  // ── Animation loop ──
  const clock = new THREE.Clock()

  function animate() {
    requestAnimationFrame(animate)

    const elapsed = clock.getElapsedTime()

    // Smooth mouse follow
    mouse.x += (targetMouse.x - mouse.x) * 0.05
    mouse.y += (targetMouse.y - mouse.y) * 0.05

    // Update uniforms
    material.uniforms.uTime.value = elapsed
    material.uniforms.uMouse.value.set(mouse.x, mouse.y)
    material.uniforms.uScrollProgress.value = scrollProgress

    // Subtle global rotation
    particles.rotation.y = elapsed * 0.03
    particles.rotation.x = Math.sin(elapsed * 0.05) * 0.1

    lines.rotation.y = elapsed * 0.025
    lines.rotation.x = Math.sin(elapsed * 0.04) * 0.08

    // Fade out particles as user scrolls
    material.uniforms.uSize.value = 2.2 * (1 - scrollProgress * 0.5)
    lineMaterial.opacity = 0.03 * (1 - scrollProgress)

    renderer.render(scene, camera)
  }

  animate()

  // ── Resize handler ──
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  window.addEventListener('resize', onResize)

  // ── Entrance animation ──
  gsap.from(material.uniforms.uSize, {
    value: 0,
    duration: 2.5,
    ease: 'power3.out',
    delay: 0.3,
  })

  return { scene, camera, renderer, particles, material }
}
