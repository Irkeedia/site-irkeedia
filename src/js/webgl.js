/* ============================================
   IRKEEDIA — WebGL Module
   Lightweight Canvas 2D particle system
   Replaces Three.js for massive performance gain
   ============================================ */

import { isLowEnd as isLowEndDevice } from './perf.js'

// ─── CONFIG ─────────────────────────────────────
const CONFIG = {
  maxParticles: 900,       // desktop
  mobileParticles: 300,    // mobile / low-end
  lowEndParticles: 100,    // fallback
  color1: [160, 204, 0],   // #a0cc00
  color2: [110, 138, 0],   // #6e8a00
  mouseRadius: 120,
  mouseForce: 0.02,
  friction: 0.97,
  waveSpeed: 0.0004,
  targetFPS: 55,           // below this => reduce particles
  fpsCheckFrames: 60,      // check after N frames
}

// ─── HELPERS ────────────────────────────────────
function isMobile() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768
}

function isLowEnd() {
  const cores = navigator.hardwareConcurrency || 2
  const mem = navigator.deviceMemory || 4
  return cores <= 2 || mem <= 2
}

// ─── PARTICLE CLASS ─────────────────────────────
class Particle {
  constructor(w, h) {
    this.reset(w, h)
  }

  reset(w, h) {
    this.x = Math.random() * w
    this.y = Math.random() * h
    this.baseX = this.x
    this.baseY = this.y
    this.vx = 0
    this.vy = 0
    this.size = Math.random() * 2.5 + 0.5
    this.alpha = Math.random() * 0.35 + 0.05
    this.colorMix = Math.random()
    this.waveOffset = Math.random() * Math.PI * 2
    this.waveAmp = Math.random() * 20 + 5
  }
}

// ─── INIT WEBGL (Canvas 2D) ────────────────────
export function initWebGL() {
  const container = document.getElementById('hero-canvas')
  if (!container) return

  // Create canvas
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', { alpha: true })
  if (!ctx) return // No fallback needed, hero just has no particles
  container.appendChild(canvas)

  // Sizing — use lower pixel ratio for perf
  const dpr = Math.min(window.devicePixelRatio, isMobile() || isLowEndDevice() ? 1 : 1.5)
  let w, h

  function resize() {
    w = window.innerWidth
    h = window.innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  resize()

  // Determine particle count
  let particleCount = CONFIG.maxParticles
  if (isMobile()) particleCount = CONFIG.mobileParticles
  if (isLowEnd()) particleCount = CONFIG.lowEndParticles

  // Create particles
  let particles = []
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(w, h))
  }

  // Mouse
  let mouseX = -9999
  let mouseY = -9999
  let mouseActive = false

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
    mouseActive = true
  })
  document.addEventListener('mouseleave', () => {
    mouseActive = false
  })

  // Scroll tracking
  let scrollProgress = 0
  let isVisible = true

  // Use IntersectionObserver to pause when hero not visible
  const hero = container.closest('.hero') || container
  const visibilityObserver = new IntersectionObserver(
    ([entry]) => { isVisible = entry.isIntersecting },
    { threshold: 0 }
  )
  visibilityObserver.observe(hero)

  window.addEventListener('scroll', () => {
    const heroHeight = hero.offsetHeight || window.innerHeight
    scrollProgress = Math.min(window.scrollY / heroHeight, 1)
  }, { passive: true })

  // ── FPS adaptive quality ──
  let frameCount = 0
  let lastFpsTime = performance.now()
  let adapted = false

  function checkFPS() {
    if (adapted) return
    frameCount++
    if (frameCount >= CONFIG.fpsCheckFrames) {
      const now = performance.now()
      const avgFPS = (frameCount * 1000) / (now - lastFpsTime)
      if (avgFPS < CONFIG.targetFPS && particleCount > CONFIG.lowEndParticles) {
        // Reduce particles
        particleCount = Math.max(Math.floor(particleCount * 0.5), CONFIG.lowEndParticles)
        particles = particles.slice(0, particleCount)
        adapted = true
      }
      frameCount = 0
      lastFpsTime = now
    }
  }

  // ── Entrance fade ──
  let entranceAlpha = 0
  const entranceStart = performance.now()
  const entranceDuration = 2000

  // ── Draw ──
  let time = 0
  let animId

  function draw() {
    animId = requestAnimationFrame(draw)

    // Skip if not visible (huge perf save)
    if (!isVisible) return

    checkFPS()

    time += CONFIG.waveSpeed
    const now = performance.now()

    // Entrance fade
    if (entranceAlpha < 1) {
      entranceAlpha = Math.min((now - entranceStart) / entranceDuration, 1)
    }

    // Scroll fade
    const scrollAlpha = 1 - scrollProgress * 0.8
    const globalAlpha = entranceAlpha * scrollAlpha

    if (globalAlpha <= 0.01) return // Nothing to draw

    ctx.clearRect(0, 0, w, h)

    for (let i = 0; i < particleCount; i++) {
      const p = particles[i]

      // Wave motion
      const wave = time * 600
      p.baseX += Math.sin(wave + p.waveOffset) * 0.02
      p.baseY += Math.cos(wave * 0.7 + p.waveOffset) * 0.015

      // Spring back to base position
      p.vx += (p.baseX - p.x) * 0.003
      p.vy += (p.baseY - p.y) * 0.003

      // Mouse repulsion
      if (mouseActive) {
        const dx = p.x - mouseX
        const dy = p.y - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < CONFIG.mouseRadius) {
          const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius * CONFIG.mouseForce
          p.vx += dx * force
          p.vy += dy * force
        }
      }

      // Physics
      p.vx *= CONFIG.friction
      p.vy *= CONFIG.friction
      p.x += p.vx
      p.y += p.vy

      // Draw particle
      const alpha = p.alpha * globalAlpha
      if (alpha < 0.01) continue

      const r = CONFIG.color1[0] + (CONFIG.color2[0] - CONFIG.color1[0]) * p.colorMix
      const g = CONFIG.color1[1] + (CONFIG.color2[1] - CONFIG.color1[1]) * p.colorMix
      const b = CONFIG.color1[2] + (CONFIG.color2[2] - CONFIG.color1[2]) * p.colorMix

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r|0},${g|0},${b|0},${alpha})`
      ctx.fill()
    }
  }

  draw()

  // ── Resize ──
  let resizeTimeout
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      const oldW = w, oldH = h
      resize()
      // Reposition particles proportionally
      for (const p of particles) {
        p.x = (p.x / oldW) * w
        p.y = (p.y / oldH) * h
        p.baseX = (p.baseX / oldW) * w
        p.baseY = (p.baseY / oldH) * h
      }
    }, 150)
  }, { passive: true })

  // Cleanup
  return {
    destroy() {
      cancelAnimationFrame(animId)
      visibilityObserver.disconnect()
      canvas.remove()
    }
  }
}
