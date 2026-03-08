/* ============================================
   IRKEEDIA — Cookie Consent System
   Awwwards-level editorial design
   ============================================ */

const COOKIE_KEY = 'irkeedia_consent'
const CONSENT_VERSION = 1

const CATEGORIES = {
  necessary: { label: 'Essentiels', locked: true },
  analytics: { label: 'Analytiques', locked: false },
  marketing: { label: 'Marketing', locked: false },
}

// ─── CONSENT STORAGE ────────────────────────────
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
    version: CONSENT_VERSION,
    timestamp: Date.now(),
    choices,
  }))
  applyConsent(choices)
}

function applyConsent(choices) {
  window.dispatchEvent(new CustomEvent('cookie-consent', { detail: choices }))
}

// ─── DISSOLVE PARTICLES ─────────────────────────
function dissolveCard(card, callback) {
  const rect = card.getBoundingClientRect()
  const particleCount = 35
  const frag = document.createDocumentFragment()

  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div')
    p.className = 'cc-particle'
    const x = rect.left + Math.random() * rect.width
    const y = rect.top + Math.random() * rect.height
    const tx = (Math.random() - 0.5) * 200
    const ty = -30 - Math.random() * 120
    const size = 2 + Math.random() * 4
    const delay = Math.random() * 0.15
    p.style.cssText = `
      left:${x}px;top:${y}px;
      width:${size}px;height:${size}px;
      --tx:${tx}px;--ty:${ty}px;
      animation-delay:${delay}s;
    `
    frag.appendChild(p)
  }
  document.body.appendChild(frag)

  card.classList.add('cc-dissolving')

  setTimeout(() => {
    document.querySelectorAll('.cc-particle').forEach(p => p.remove())
    callback?.()
  }, 900)
}

// ─── STAGGER TEXT REVEAL ────────────────────────
function staggerReveal(container) {
  const items = container.querySelectorAll('.cc-reveal')
  items.forEach((el, i) => {
    el.style.transitionDelay = `${0.08 + i * 0.06}s`
  })
}

// ─── BUILD BANNER ───────────────────────────────
function createBanner() {
  const banner = document.createElement('div')
  banner.className = 'cc-banner'
  banner.setAttribute('role', 'dialog')
  banner.setAttribute('aria-label', 'Consentement cookies')

  banner.innerHTML = `
    <div class="cc-card">
      <div class="cc-line cc-reveal">
        <span class="cc-mono">COOKIES</span>
        <span class="cc-separator"></span>
      </div>

      <p class="cc-text cc-reveal">
        Ce site utilise des cookies pour fonctionner correctement et mesurer son audience.
      </p>

      <div class="cc-categories cc-reveal">
        ${Object.entries(CATEGORIES).map(([key, cat]) => `
          <label class="cc-cat ${cat.locked ? 'cc-cat--locked' : ''}" data-cat="${key}">
            <input type="checkbox" ${cat.locked ? 'checked disabled' : ''} data-cookie-cat="${key}" />
            <span class="cc-cat-indicator">
              <span class="cc-cat-dot"></span>
            </span>
            <span class="cc-cat-label">${cat.label}</span>
          </label>
        `).join('')}
      </div>

      <div class="cc-actions cc-reveal">
        <button class="cc-btn cc-btn--ghost" data-action="reject">Refuser</button>
        <button class="cc-btn cc-btn--primary" data-action="accept">
          Accepter
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></svg>
        </button>
      </div>
    </div>
  `

  document.body.appendChild(banner)
  return banner
}

// ─── BIND EVENTS ────────────────────────────────
function bindBanner(banner) {
  const card = banner.querySelector('.cc-card')

  banner.querySelector('[data-action="accept"]').addEventListener('click', () => {
    const choices = {}
    Object.keys(CATEGORIES).forEach(k => choices[k] = true)
    setConsent(choices)
    dissolveCard(card, () => banner.remove())
  })

  banner.querySelector('[data-action="reject"]').addEventListener('click', () => {
    const choices = {}
    Object.keys(CATEGORIES).forEach(k => choices[k] = CATEGORIES[k].locked)
    setConsent(choices)
    card.classList.add('cc-exit')
    setTimeout(() => banner.remove(), 600)
  })

  // Toggle categories — save on any change
  banner.querySelectorAll('.cc-cat:not(.cc-cat--locked)').forEach(label => {
    label.addEventListener('click', () => {
      // Let the checkbox toggle first
      requestAnimationFrame(() => {
        // Visual feedback
        label.classList.add('cc-cat--flash')
        setTimeout(() => label.classList.remove('cc-cat--flash'), 400)
      })
    })
  })
}

// ─── SHOW ───────────────────────────────────────
function showBanner(banner) {
  const card = banner.querySelector('.cc-card')
  staggerReveal(card)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      banner.classList.add('is-visible')
    })
  })
}

// ─── INIT ───────────────────────────────────────
export function initCookies() {
  const existing = getConsent()
  if (existing) {
    applyConsent(existing.choices)
    return
  }

  const banner = createBanner()
  bindBanner(banner)
  setTimeout(() => showBanner(banner), 2000)
}

// ─── RE-OPEN ────────────────────────────────────
export function reopenCookies() {
  localStorage.removeItem(COOKIE_KEY)
  const banner = createBanner()
  bindBanner(banner)
  showBanner(banner)
}
