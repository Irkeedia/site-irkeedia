/* ============================================
   IRKEEDIA — Immersive Entry Gate
   Fullscreen black. One phrase. Click. Boom.
   Cookies are accepted silently on entry.
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
  } catch {
    return null
  }
}

function setConsent(choices) {
  localStorage.setItem(COOKIE_KEY, JSON.stringify({
    version: CONSENT_VERSION,
    timestamp: Date.now(),
    choices,
  }))
  window.dispatchEvent(new CustomEvent('cookie-consent', { detail: choices }))
}

function applyConsent(choices) {
  window.dispatchEvent(new CustomEvent('cookie-consent', { detail: choices }))
}

// ─── PARTICLE EXPLOSION ────────────────────────
function spawnParticles(cx, cy) {
  const count = 80
  const frag = document.createDocumentFragment()

  for (let i = 0; i < count; i++) {
    const p = document.createElement('span')
    p.className = 'gate-particle tech-particle'

    const angle = Math.random() * Math.PI * 2
    const distance = 50 + Math.random() * 400
    const tx = Math.cos(angle) * distance
    const ty = Math.sin(angle) * distance
    const size = 1 + Math.random() * 4
    const duration = 0.4 + Math.random() * 0.8

    p.style.cssText = `
      left:${cx}px; top:${cy}px;
      width:${size}px; height:${size}px;
      --tx:${tx}px; --ty:${ty}px;
      animation-duration:${duration}s;
      animation-delay:${(Math.random() * 0.05).toFixed(3)}s;
    `
    frag.appendChild(p)
  }

  document.body.appendChild(frag)

  setTimeout(() => {
    document.querySelectorAll('.gate-particle').forEach((p) => p.remove())
  }, 1400)
}

// ─── CREATE GATE ────────────────────────────────
function createEntryGate() {
  const gate = document.createElement('div')
  gate.className = 'entry-gate'
  gate.innerHTML = `
    <div class="tech-grid"></div>
    <div class="tech-scanline"></div>
    <div class="tech-hud">
      <div class="tech-hud-corners">
        <span></span><span></span><span></span><span></span>
      </div>
      <div class="tech-system-text typing-effect">_SYS.STATUS: NEURAL_LINK_READY</div>
      <div class="tech-title">IRKEEDIA PROTOCOL</div>
      <button class="tech-enter-btn">
        <span class="btn-bracket">[</span> 
        <span class="btn-text">INITIALISER L'IMMERSION</span> 
        <span class="btn-bracket">]</span>
      </button>
      <div class="tech-system-text blink">AWAITING_USER_INPUT...</div>
    </div>
  `
  document.body.appendChild(gate)
  return gate
}

// ─── INIT ───────────────────────────────────────
export function initEntryGate() {
  if (window.__irkeediaEntryGateReady) return
  window.__irkeediaEntryGateReady = true

  document.querySelectorAll('.cc-banner').forEach((el) => el.remove())

  const existing = getConsent()
  if (existing) applyConsent(existing.choices)

  const gate = createEntryGate()
  document.body.classList.add('entry-gate-open')

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      gate.classList.add('is-visible')
    })
  })

  const enterBtn = gate.querySelector('.tech-enter-btn')

  enterBtn.addEventListener('click', (e) => {
    setConsent({ necessary: true, analytics: true, marketing: true })

    const rect = enterBtn.getBoundingClientRect()
    spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2)

    gate.classList.remove('is-visible')
    gate.classList.add('is-leaving')

    setTimeout(() => {
      gate.remove()
      document.body.classList.remove('entry-gate-open')
    }, 800)
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
