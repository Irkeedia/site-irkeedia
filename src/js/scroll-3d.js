/* ============================================
   IRKEEDIA — Scroll-Driven 3D Experience
   Camera flies through a futuristic digital
   tunnel/space as user scrolls — Awwwards level
   
   Performance-optimized with adaptive quality:
   ULTRA → HIGH → MEDIUM → LOW → MINIMAL
   ============================================ */

import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── QUALITY PRESETS ────────────────────────────
const QUALITY = {
  ULTRA:   { particles: 2000, tunnelSegments: 40, tunnelLines: 16, floatingObjects: 20, beams: 6, beamSegments: 200, gridCrossLines: true, ringDetail: 64, pixelRatio: 2,   antialias: true,  fogFar: 80, lights: 5, frameSkip: 1, torusKnot: true  },
  HIGH:    { particles: 1200, tunnelSegments: 30, tunnelLines: 12, floatingObjects: 14, beams: 4, beamSegments: 120, gridCrossLines: true, ringDetail: 32, pixelRatio: 1.5, antialias: true,  fogFar: 65, lights: 3, frameSkip: 1, torusKnot: true  },
  MEDIUM:  { particles: 600,  tunnelSegments: 20, tunnelLines: 8,  floatingObjects: 8,  beams: 3, beamSegments: 80,  gridCrossLines: false, ringDetail: 24, pixelRatio: 1,   antialias: false, fogFar: 50, lights: 2, frameSkip: 1, torusKnot: false },
  LOW:     { particles: 300,  tunnelSegments: 12, tunnelLines: 6,  floatingObjects: 4,  beams: 2, beamSegments: 40,  gridCrossLines: false, ringDetail: 16, pixelRatio: 1,   antialias: false, fogFar: 40, lights: 1, frameSkip: 2, torusKnot: false },
  MINIMAL: { particles: 120,  tunnelSegments: 8,  tunnelLines: 4,  floatingObjects: 2,  beams: 1, beamSegments: 20,  gridCrossLines: false, ringDetail: 12, pixelRatio: 1,   antialias: false, fogFar: 30, lights: 1, frameSkip: 3, torusKnot: false },
}

// ─── CONFIG ─────────────────────────────────────
const CONFIG = {
  tunnelRadius: 8,
  tunnelLength: 300,
  colors: {
    primary: 0xc8ff00,
    secondary: 0x6b21a8,
    tertiary: 0xe040fb,
    grid: 0x1a1a2e,
    fog: 0x050505,
    bg: 0x050505,
  }
}

// ─── DEVICE DETECTION ───────────────────────────
function isMobile() {
  return window.innerWidth < 768 || 'ontouchstart' in window
}

function detectGPU(renderer) {
  const gl = renderer.getContext()
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
  if (debugInfo) {
    const gpuVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || ''
    const gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || ''
    return { vendor: gpuVendor, renderer: gpuRenderer }
  }
  return { vendor: '', renderer: '' }
}

function isLowEndGPU(gpuInfo) {
  const r = gpuInfo.renderer.toLowerCase()
  const lowEndPatterns = [
    'intel hd graphics', 'intel uhd graphics', 'intel(r) hd', 'intel(r) uhd',
    'mesa', 'llvmpipe', 'swiftshader', 'software', 'virgl',
    'adreno 5', 'adreno 4', 'mali-g5', 'mali-t', 'powervr',
  ]
  return lowEndPatterns.some(p => r.includes(p))
}

function detectInitialQuality(renderer) {
  const cores = navigator.hardwareConcurrency || 4
  const mem = navigator.deviceMemory || 4
  const gpuInfo = detectGPU(renderer)
  const mobile = isMobile()
  const lowGPU = isLowEndGPU(gpuInfo)

  console.log('[3D] GPU:', gpuInfo.renderer, '| Cores:', cores, '| RAM:', mem + 'GB', '| Mobile:', mobile, '| LowGPU:', lowGPU)

  if (mobile && (cores <= 4 || mem <= 3 || lowGPU)) return 'MINIMAL'
  if (mobile) return 'LOW'
  if (lowGPU && cores <= 4) return 'LOW'
  if (lowGPU || cores <= 4 || mem <= 4) return 'MEDIUM'
  if (cores >= 8 && mem >= 8 && !lowGPU) return 'ULTRA'
  return 'HIGH'
}

// ─── CUSTOM SHADERS ─────────────────────────────
const glowVertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying float vDistanceToCamera;
  uniform float uTime;
  
  void main() {
    vPosition = position;
    vNormal = normal;
    vec3 pos = position;
    float distortion = sin(pos.x * 2.0 + uTime * 0.5) * cos(pos.y * 2.0 + uTime * 0.3) * 0.15;
    pos += normal * distortion;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vDistanceToCamera = -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
`

const glowFragmentShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying float vDistanceToCamera;
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uOpacity;
  
  void main() {
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = 1.0 - abs(dot(viewDir, vNormal));
    fresnel = pow(fresnel, 2.0);
    float pulse = 0.7 + 0.3 * sin(uTime * 1.5 + vPosition.y * 0.5);
    float distFade = smoothstep(80.0, 10.0, vDistanceToCamera);
    float alpha = fresnel * pulse * distFade * uOpacity;
    gl_FragColor = vec4(uColor, alpha * 0.6);
  }
`

const particleVertexShader = `
  attribute float aSize;
  attribute float aAlpha;
  attribute float aSpeed;
  varying float vAlpha;
  uniform float uTime;
  uniform float uScrollProgress;
  uniform float uPixelRatio;
  
  void main() {
    vec3 pos = position;
    float angle = uTime * aSpeed + pos.z * 0.1;
    pos.x += sin(angle) * 0.5;
    pos.y += cos(angle * 0.7) * 0.3;
    pos.z = mod(pos.z + uScrollProgress * 50.0, 300.0) - 150.0;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float distToCamera = -mvPosition.z;
    float size = aSize * uPixelRatio * (200.0 / -mvPosition.z);
    gl_PointSize = clamp(size, 1.0, 16.0);
    vAlpha = aAlpha * smoothstep(100.0, 5.0, distToCamera);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const particleFragmentShader = `
  varying float vAlpha;
  uniform vec3 uColor;
  
  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.1, dist) * vAlpha;
    gl_FragColor = vec4(uColor, alpha);
  }
`

// ─── CAMERA PATH ────────────────────────────────
function createCameraPath() {
  const points = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(2, 1, -25),
    new THREE.Vector3(-3, 2, -55),
    new THREE.Vector3(1, -1, -85),
    new THREE.Vector3(-2, 3, -115),
    new THREE.Vector3(3, 0, -140),
    new THREE.Vector3(-1, -2, -165),
    new THREE.Vector3(2, 2, -190),
    new THREE.Vector3(0, 1, -215),
    new THREE.Vector3(-3, -1, -240),
    new THREE.Vector3(1, 2, -265),
    new THREE.Vector3(0, 0, -290),
  ]
  return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5)
}

// ─── TUNNEL ─────────────────────────────────────
function createTunnel(scene, q) {
  const tunnelGroup = new THREE.Group()
  const spacing = CONFIG.tunnelLength / q.tunnelSegments

  for (let i = 0; i < q.tunnelSegments; i++) {
    const radius = CONFIG.tunnelRadius + Math.sin(i * 0.3) * 2
    const geometry = new THREE.RingGeometry(radius - 0.1, radius, q.ringDetail, 1)
    const colorIdx = i % 3
    const colors = [CONFIG.colors.primary, CONFIG.colors.secondary, CONFIG.colors.tertiary]
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(colors[colorIdx]),
      transparent: true,
      opacity: 0.08 + Math.random() * 0.07,
      side: THREE.DoubleSide,
    })
    const ring = new THREE.Mesh(geometry, material)
    ring.position.z = -i * spacing
    ring.userData = { baseOpacity: material.opacity, speed: 0.2 + Math.random() * 0.5 }
    tunnelGroup.add(ring)
  }

  const lineSegments = Math.min(100, q.tunnelSegments * 3)
  for (let i = 0; i < q.tunnelLines; i++) {
    const angle = (i / q.tunnelLines) * Math.PI * 2
    const pts = []
    for (let j = 0; j < lineSegments; j++) {
      const z = -j * (CONFIG.tunnelLength / lineSegments)
      const wobble = Math.sin(j * 0.2 + angle) * 0.5
      const r = CONFIG.tunnelRadius + wobble
      pts.push(new THREE.Vector3(Math.cos(angle) * r, Math.sin(angle) * r, z))
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(pts)
    const material = new THREE.LineBasicMaterial({ color: CONFIG.colors.primary, transparent: true, opacity: 0.06 })
    tunnelGroup.add(new THREE.Line(geometry, material))
  }

  scene.add(tunnelGroup)
  return tunnelGroup
}

// ─── FLOATING OBJECTS ───────────────────────────
function createFloatingObjects(scene, q) {
  const objects = []
  const geometries = [
    () => new THREE.IcosahedronGeometry(0.8, 0),
    () => new THREE.OctahedronGeometry(0.7, 0),
    () => new THREE.TetrahedronGeometry(0.6, 0),
    () => new THREE.TorusGeometry(0.6, 0.15, 8, 16),
    () => q.torusKnot ? new THREE.TorusKnotGeometry(0.5, 0.15, 32, 6) : new THREE.DodecahedronGeometry(0.6, 0),
    () => new THREE.BoxGeometry(0.8, 0.8, 0.8),
  ]

  for (let i = 0; i < q.floatingObjects; i++) {
    const geomFactory = geometries[i % geometries.length]
    const geometry = geomFactory()
    const colorIdx = i % 3
    const colors = [CONFIG.colors.primary, CONFIG.colors.secondary, CONFIG.colors.tertiary]
    const material = new THREE.ShaderMaterial({
      vertexShader: glowVertexShader,
      fragmentShader: glowFragmentShader,
      uniforms: {
        uColor: { value: new THREE.Color(colors[colorIdx]) },
        uTime: { value: 0 },
        uOpacity: { value: 0.7 },
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      wireframe: true,
    })
    const mesh = new THREE.Mesh(geometry, material)
    const angle = Math.random() * Math.PI * 2
    const radius = 2 + Math.random() * 5
    mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, -Math.random() * CONFIG.tunnelLength)
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
    mesh.userData = {
      rotSpeed: { x: (Math.random() - 0.5) * 0.02, y: (Math.random() - 0.5) * 0.02, z: (Math.random() - 0.5) * 0.01 },
      floatSpeed: 0.5 + Math.random() * 1.5,
      floatAmp: 0.3 + Math.random() * 0.5,
      baseY: mesh.position.y,
    }
    scene.add(mesh)
    objects.push(mesh)
  }
  return objects
}

// ─── PARTICLES ──────────────────────────────────
function createParticles(scene, q) {
  const count = q.particles
  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const alphas = new Float32Array(count)
  const speeds = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const angle = Math.random() * Math.PI * 2
    const radius = 1 + Math.random() * 12
    positions[i3] = Math.cos(angle) * radius
    positions[i3 + 1] = Math.sin(angle) * radius
    positions[i3 + 2] = -Math.random() * CONFIG.tunnelLength
    sizes[i] = Math.random() * 3 + 1
    alphas[i] = Math.random() * 0.6 + 0.1
    speeds[i] = Math.random() * 0.5 + 0.1
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1))
  geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))

  const material = new THREE.ShaderMaterial({
    vertexShader: particleVertexShader,
    fragmentShader: particleFragmentShader,
    uniforms: {
      uColor: { value: new THREE.Color(CONFIG.colors.primary) },
      uTime: { value: 0 },
      uScrollProgress: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, q.pixelRatio) },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)
  return { points, material }
}

// ─── GRID FLOOR ─────────────────────────────────
function createGrid(scene, q) {
  const gridGroup = new THREE.Group()
  const gridMaterial = new THREE.LineBasicMaterial({ color: CONFIG.colors.grid, transparent: true, opacity: 0.3 })
  const gridSpacing = 2
  const gridWidth = 30

  for (let x = -gridWidth; x <= gridWidth; x += gridSpacing) {
    const pts = [new THREE.Vector3(x, -6, 0), new THREE.Vector3(x, -6, -CONFIG.tunnelLength)]
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMaterial.clone())
    line.material.opacity = 0.1 + (1 - Math.abs(x) / gridWidth) * 0.15
    gridGroup.add(line)
  }

  if (q.gridCrossLines) {
    for (let z = 0; z > -CONFIG.tunnelLength; z -= 5) {
      const pts = [new THREE.Vector3(-gridWidth, -6, z), new THREE.Vector3(gridWidth, -6, z)]
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMaterial.clone())
      line.material.opacity = 0.08
      gridGroup.add(line)
    }
  }

  scene.add(gridGroup)
  return gridGroup
}

// ─── ENERGY BEAMS ───────────────────────────────
function createEnergyBeams(scene, q) {
  const beams = []
  for (let i = 0; i < q.beams; i++) {
    const angle = (i / q.beams) * Math.PI * 2
    const radius = 4 + Math.random() * 3
    const pts = []
    for (let j = 0; j < q.beamSegments; j++) {
      const t = j / q.beamSegments
      const z = -t * CONFIG.tunnelLength
      const spiralAngle = angle + t * Math.PI * 4
      const r = radius + Math.sin(t * 20) * 0.5
      pts.push(new THREE.Vector3(Math.cos(spiralAngle) * r, Math.sin(spiralAngle) * r, z))
    }
    const colors = [CONFIG.colors.primary, CONFIG.colors.secondary, CONFIG.colors.tertiary]
    const material = new THREE.LineBasicMaterial({ color: colors[i % 3], transparent: true, opacity: 0.12 })
    const beam = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), material)
    scene.add(beam)
    beams.push(beam)
  }
  return beams
}

// ─── SECTION MARKERS ────────────────────────────
function createSectionMarkers(scene) {
  const markers = []
  const positions = [0.0, 0.18, 0.38, 0.58, 0.78, 0.95]
  positions.forEach((progress, i) => {
    const geometry = new THREE.TorusGeometry(4, 0.05, 8, 32)
    const material = new THREE.MeshBasicMaterial({ color: CONFIG.colors.primary, transparent: true, opacity: 0 })
    const marker = new THREE.Mesh(geometry, material)
    marker.position.z = -progress * CONFIG.tunnelLength
    marker.userData = { progress, index: i }
    scene.add(marker)
    markers.push(marker)
  })
  return markers
}

// ─── PERFORMANCE MONITOR ────────────────────────
class PerfMonitor {
  constructor(onDowngrade) {
    this.onDowngrade = onDowngrade
    this.lastCheck = performance.now()
    this.checkInterval = 3000
    this.degradeCount = 0
    this.maxDegrades = 3
    this.targetFPS = 35
    this.frameCount = 0
  }

  tick() {
    this.frameCount++
    const now = performance.now()

    if (now - this.lastCheck >= this.checkInterval) {
      const elapsed = (now - this.lastCheck) / 1000
      const fps = this.frameCount / elapsed

      console.log('[3D Perf] FPS:', fps.toFixed(1), '| Degrades:', this.degradeCount)

      if (fps < this.targetFPS && this.degradeCount < this.maxDegrades) {
        this.degradeCount++
        this.onDowngrade(this.degradeCount)
      }

      this.frameCount = 0
      this.lastCheck = now
    }
  }
}

// ─── MAIN INIT ──────────────────────────────────
export function initScroll3D() {
  const container = document.getElementById('scroll-3d-canvas')
  if (!container) return

  // Quick bail on truly low-end + mobile
  const cores = navigator.hardwareConcurrency || 2
  const mem = navigator.deviceMemory || 4
  if (isMobile() && cores <= 2 && mem <= 2) {
    container.style.display = 'none'
    return
  }

  // Create renderer first (need it for GPU detection)
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: true,
    })
  } catch (e) {
    console.warn('[3D] WebGL unavailable or software rendering, skipping')
    container.style.display = 'none'
    return
  }

  // Detect quality
  let qualityLevel = detectInitialQuality(renderer)
  let q = QUALITY[qualityLevel]
  console.log('[3D] Starting quality:', qualityLevel)

  // Scene Setup
  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(CONFIG.colors.bg, 5, q.fogFar)

  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 500)
  camera.position.set(0, 0, 0)

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, q.pixelRatio))
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2
  container.appendChild(renderer.domElement)

  // Create Scene Elements
  const cameraPath = createCameraPath()
  let tunnel = createTunnel(scene, q)
  let floatingObjects = createFloatingObjects(scene, q)
  let { points: particles, material: particleMaterial } = createParticles(scene, q)
  let grid = createGrid(scene, q)
  let beams = createEnergyBeams(scene, q)
  let markers = createSectionMarkers(scene)

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
  scene.add(ambientLight)

  const pointLights = []
  for (let i = 0; i < q.lights; i++) {
    const light = new THREE.PointLight(CONFIG.colors.primary, 0.5, 30)
    light.position.set(0, 0, -i * (CONFIG.tunnelLength / Math.max(q.lights, 1)))
    scene.add(light)
    pointLights.push(light)
  }

  // State
  let scrollProgress = 0
  let targetScrollProgress = 0
  let time = 0
  let isVisible = true
  let animId = null
  let globalOpacity = 0
  let frameSkip = q.frameSkip
  let frameCounter = 0

  // Scroll Tracking
  ScrollTrigger.create({
    trigger: '#smooth-content',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.5,
    onUpdate: (self) => { targetScrollProgress = self.progress },
  })

  // Visibility
  const observer = new IntersectionObserver(
    ([entry]) => { isVisible = entry.isIntersecting },
    { threshold: 0 }
  )
  observer.observe(container)

  // Entrance fade
  gsap.to({ val: 0 }, {
    val: 1,
    duration: 2,
    delay: 3.5,
    ease: 'power2.out',
    onUpdate() { globalOpacity = this.targets()[0].val }
  })

  // Mouse Parallax
  let mouseX = 0, mouseY = 0
  let targetMouseX = 0, targetMouseY = 0
  document.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2
  })

  // Downgrade handler
  function handleDowngrade(level) {
    const levels = ['ULTRA', 'HIGH', 'MEDIUM', 'LOW', 'MINIMAL']
    const currentIdx = levels.indexOf(qualityLevel)
    const newIdx = Math.min(currentIdx + 1, levels.length - 1)
    
    if (newIdx === currentIdx) {
      // Already at minimum — gracefully hide 3D
      console.log('[3D] Already at MINIMAL, hiding 3D')
      gsap.to(renderer.domElement, {
        opacity: 0,
        duration: 1,
        onComplete: () => {
          cancelAnimationFrame(animId)
          container.style.display = 'none'
        }
      })
      return
    }

    qualityLevel = levels[newIdx]
    q = QUALITY[qualityLevel]
    console.log('[3D] Downgrading to:', qualityLevel)

    // Apply renderer changes
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, q.pixelRatio))
    scene.fog.far = q.fogFar
    frameSkip = q.frameSkip

    // Remove excess floating objects
    while (floatingObjects.length > q.floatingObjects) {
      const obj = floatingObjects.pop()
      scene.remove(obj)
      obj.geometry.dispose()
      obj.material.dispose()
    }

    // Remove excess beams
    while (beams.length > q.beams) {
      const beam = beams.pop()
      scene.remove(beam)
      beam.geometry.dispose()
      beam.material.dispose()
    }

    // Remove excess point lights
    while (pointLights.length > q.lights) {
      const light = pointLights.pop()
      scene.remove(light)
    }

    // Remove grid cross lines if needed
    if (!q.gridCrossLines && grid.children.length > 31) {
      while (grid.children.length > 31) {
        const child = grid.children[grid.children.length - 1]
        grid.remove(child)
        child.geometry.dispose()
        child.material.dispose()
      }
    }

    // Brief quality indicator
    const indicator = document.getElementById('scroll3dLabel')
    if (indicator) {
      const prev = indicator.textContent
      indicator.textContent = 'QUALITE: ' + qualityLevel
      indicator.classList.add('is-visible')
      setTimeout(() => { indicator.textContent = prev }, 1500)
    }
  }

  // Performance monitor
  const perfMonitor = new PerfMonitor(handleDowngrade)

  // Render Loop
  function render() {
    animId = requestAnimationFrame(render)

    // Always tick perf monitor
    perfMonitor.tick()

    // Frame skip for low-end (render every Nth frame)
    frameCounter++
    if (frameSkip > 1 && frameCounter % frameSkip !== 0) return

    // Skip if not visible
    if (!isVisible || globalOpacity < 0.01) return

    time += 0.016 * frameSkip // compensate for skipped frames

    // Smooth scroll interpolation
    scrollProgress += (targetScrollProgress - scrollProgress) * 0.05

    // Smooth mouse
    mouseX += (targetMouseX - mouseX) * 0.05
    mouseY += (targetMouseY - mouseY) * 0.05

    // Camera Path
    const pathProgress = Math.min(scrollProgress * 0.95, 0.999)
    const cameraPos = cameraPath.getPointAt(pathProgress)
    const lookAtPos = cameraPath.getPointAt(Math.min(pathProgress + 0.02, 0.999))
    
    camera.position.copy(cameraPos)
    camera.position.x += mouseX * 0.8
    camera.position.y += mouseY * 0.4
    camera.lookAt(lookAtPos)
    
    const tangent = cameraPath.getTangentAt(pathProgress)
    camera.rotation.z = tangent.x * 0.15 + Math.sin(time * 0.3) * 0.02

    // Update Tunnel Rings
    const camZ = camera.position.z
    const tunnelChildren = tunnel.children
    for (let i = 0, l = tunnelChildren.length; i < l; i++) {
      const child = tunnelChildren[i]
      if (child.isMesh && child.userData.speed) {
        child.rotation.z += child.userData.speed * 0.005
        const dist = Math.abs(child.position.z - camZ)
        const proximity = Math.max(0, 1 - dist / 40)
        child.material.opacity = child.userData.baseOpacity * (0.5 + proximity * 1.5) * globalOpacity
      }
    }

    // Update Floating Objects
    for (let i = 0; i < floatingObjects.length; i++) {
      const obj = floatingObjects[i]
      obj.rotation.x += obj.userData.rotSpeed.x
      obj.rotation.y += obj.userData.rotSpeed.y
      obj.rotation.z += obj.userData.rotSpeed.z
      obj.position.y = obj.userData.baseY + Math.sin(time * obj.userData.floatSpeed) * obj.userData.floatAmp
      if (obj.material.uniforms) {
        obj.material.uniforms.uTime.value = time
        obj.material.uniforms.uOpacity.value = 0.7 * globalOpacity
      }
    }

    // Update Particles
    particleMaterial.uniforms.uTime.value = time
    particleMaterial.uniforms.uScrollProgress.value = scrollProgress

    // Update Beams
    for (let i = 0; i < beams.length; i++) {
      beams[i].rotation.z = time * 0.02 * (i % 2 === 0 ? 1 : -1)
      beams[i].material.opacity = (0.08 + Math.sin(time + i) * 0.04) * globalOpacity
    }

    // Update Section Markers
    for (let i = 0; i < markers.length; i++) {
      const marker = markers[i]
      const dist = Math.abs(marker.position.z - camZ)
      const proximity = Math.max(0, 1 - dist / 20)
      marker.material.opacity = proximity * 0.4 * globalOpacity
      marker.rotation.z = time * 0.5
      marker.rotation.x = Math.sin(time * 0.3) * 0.2
    }

    // Update Point Lights
    for (let i = 0; i < pointLights.length; i++) {
      pointLights[i].intensity = (0.3 + Math.sin(time + i * 2) * 0.2) * globalOpacity
      pointLights[i].color.setHSL((time * 0.05 + i * 0.2) % 1, 0.8, 0.5)
    }

    // Grid visibility
    grid.visible = globalOpacity > 0.1

    // Canvas opacity
    renderer.domElement.style.opacity = globalOpacity

    // Render
    renderer.render(scene, camera)
  }

  render()

  // Resize (debounced)
  let resizeTimeout
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }, 150)
  }, { passive: true })

  // Pause in background tab
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId)
      animId = null
    } else if (!animId) {
      perfMonitor.lastCheck = performance.now()
      perfMonitor.frameCount = 0
      render()
    }
  })

  return {
    destroy() {
      cancelAnimationFrame(animId)
      observer.disconnect()
      renderer.dispose()
      container.innerHTML = ''
    },
    getQuality() { return qualityLevel },
  }
}
