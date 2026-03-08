/* ============================================
   IRKEEDIA — Cinematic Entry Gate
   Canvas constellation · Reveal typography · Premium CTA
   Cookies accepted silently on entry.
   ============================================ */

const COOKIE_KEY = 'irkeedia_consent'
const CONSENT_VERSION = 1

function getConsent() {
  try {
    const raw = localStorage.getItem(COOKIE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (data.version !== CONSENT_VERSION) return null
    return data
  } catch { return null }
}

function setConsent(choices) {
  localStorage.setItem(COOKIE_KEY, JSON.stringify({
    version: CONSENT_VERSION, timestamp: Date.now(), choices,
  }))
  window.dispatchEvent(new CustomEvent('cookie-consent', { detail: choices }))
}

function applyConsent(choices) {
  window.dispatchEvent(new CustomEvent('cookie-consent', { detail: choices }))
}

/* ─── CONSTELLATION CANVAS ─────────────────────── */
class Constellation {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.particles = []
    this.mouse = { x: -9999, y: -9999 }
    this.running = true
    this.imploding = false
    this.implosionTarget = { x: 0, y: 0 }

    this.resize()
    this.init()
    this.bind()
    this.loop()
  }

  resize() {
    this.w = this.canvas.width = window.innerWidth
    this.h = this.canvas.height = window.innerHeight
  }

  init() {
    const count = Math.min(120, Math.floor((this.w * this.h) / 8000))
    this.particles = []
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 1 + Math.random() * 2,
        alpha: 0.3 + Math.random() * 0.5,
      })
    }
  }

  bind() {
    window.addEventListener('resize', () => { this.resize(); this.init() })
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX
      this.mouse.y = e.clientY
    })
  }

  loop() {
    if (!this.running) return
    this.update()
    this.draw()
    requestAnimationFrame(() => this.loop())
  }

  update() {
    const mx = this.mouse.x, my = this.mouse.y

    for (const p of this.particles) {
      if (this.imploding) {
        const dx = this.implosionTarget.x - p.x
        const dy = this.implosionTarget.y - p.y
        p.vx += dx * 0.02
        p.vy += dy * 0.02
        p.vx *= 0.96
        p.vy *= 0.96
      } else {
        // Mouse repulsion
        const dx = p.x - mx, dy = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150) {
          const force = (150 - dist) / 150 * 0.8
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }
        p.vx *= 0.98
        p.vy *= 0.98
      }

      p.x += p.vx
      p.y += p.vy

      if (!this.imploding) {
        if (p.x < 0) p.x = this.w
        if (p.x > this.w) p.x = 0
        if (p.y < 0) p.y = this.h
        if (p.y > this.h) p.y = 0
      }
    }
  }

  draw() {
    const ctx = this.ctx
    ctx.clearRect(0, 0, this.w, this.h)

    const maxDist = 140

    // Lines
    for (let i = 0; i < this.particles.length; i++) {
      const a = this.particles[i]
      for (let j = i + 1; j < this.particles.length; j++) {
        const b = this.particles[j]
        const dx = a.x - b.x, dy = a.y - b.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.15
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(200, 255, 0, ${opacity})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }

      // Mouse lines
      const mdx = a.x - this.mouse.x, mdy = a.y - this.mouse.y
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy)
      if (mDist < 200) {
        const opacity = (1 - mDist / 200) * 0.25
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(this.mouse.x, this.mouse.y)
        ctx.strokeStyle = `rgba(200, 255, 0, ${opacity})`
        ctx.lineWidth = 0.8
        ctx.stroke()
      }
    }

    // Dots
    for (const p of this.particles) {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(200, 255, 0, ${p.alpha})`
      ctx.fill()
    }
  }

  implode(x, y) {
    this.imploding = true
    this.implosionTarget = { x, y }
  }

  destroy() {
    this.running = false
  }
}

/* ─── FLASH BURST ──────────────────────────────── */
function flashBurst(gate) {
  const flash = document.createElement('div')
  flash.className = 'gate-flash'
  gate.appendChild(flash)
  requestAnimationFrame(() => flash.classList.add('active'))
}

/* ─── CREATE GATE DOM ──────────────────────────── */
function createEntryGate() {
  const gate = document.createElement('div')
  gate.className = 'entry-gate'
  gate.innerHTML = `
    <canvas class="gate-canvas"></canvas>
    <div class="gate-content">
      <div class="gate-logo" aria-hidden="true">
        <span class="gate-logo-mark">◈</span>
      </div>
      <h1 class="gate-title">
        ${'IRKEEDIA'.split('').map((l, i) =>
          `<span class="gate-letter" style="animation-delay:${0.8 + i * 0.07}s">${l}</span>`
        ).join('')}
      </h1>
      <p class="gate-tagline">Digital Craft Studio</p>
      <button class="gate-cta">
        <span class="gate-cta-bg"></span>
        <span class="gate-cta-border"></span>
        <span class="gate-cta-text">Entrer</span>
      </button>
      <div class="gate-hint">Cliquez pour commencer l'expérience</div>
    </div>
  `
  document.body.appendChild(gate)
  return gate
}

/* ─── INIT ─────────────────────────────────────── */
export function initEntryGate() {
  if (window.__irkeediaEntryGateReady) return
  window.__irkeediaEntryGateReady = true

  document.querySelectorAll('.cc-banner').forEach((el) => el.remove())

  const existing = getConsent()
  if (existing) applyConsent(existing.choices)

  const gate = createEntryGate()
  document.body.classList.add('entry-gate-open')

  const canvas = gate.querySelector('.gate-canvas')
  const constellation = new Constellation(canvas)

  requestAnimationFrame(() => {
    requestAnimationFrame(() => gate.classList.add('is-visible'))
  })

  const cta = gate.querySelector('.gate-cta')

  cta.addEventListener('click', (e) => {
    if (gate.classList.contains('is-leaving')) return

    setConsent({ necessary: true, analytics: true, marketing: true })

    // Implosion
    const rect = cta.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    constellation.implode(cx, cy)

    gate.classList.add('is-imploding')

    // Flash after implosion converges
    setTimeout(() => {
      flashBurst(gate)
      gate.classList.remove('is-visible')
      gate.classList.add('is-leaving')
    }, 700)

    setTimeout(() => {
      constellation.destroy()
      gate.remove()
      document.body.classList.remove('entry-gate-open')
    }, 1400)
  })
}

export function initCookies() {
  const existing = getConsent()
  if (existing) applyConsent(existing.choices)
}

export function reopenCookies() {
  localStorage.removeItem(COOKIE_KEY)
  if (window.__irkeediaEntryGateReady) window.__irkeediaEntryGateReady = false
  initEntryGate()
}
