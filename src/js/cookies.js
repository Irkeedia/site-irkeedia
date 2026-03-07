/* ============================================
   IRKEEDIA — Cookie Consent System
   Original design with real cookie management
   ============================================ */

const COOKIE_KEY = 'irkeedia_consent'
const CONSENT_VERSION = 1

// Cookie categories
const CATEGORIES = {
  necessary: { label: 'Essentiels', desc: 'Navigation, sécurité, préférences', locked: true },
  analytics: { label: 'Analytiques', desc: 'Statistiques de visite anonymes', locked: false },
  marketing: { label: 'Marketing', desc: 'Publicités personnalisées', locked: false },
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
  const data = {
    version: CONSENT_VERSION,
    timestamp: Date.now(),
    choices,
  }
  localStorage.setItem(COOKIE_KEY, JSON.stringify(data))
  applyConsent(choices)
}

function applyConsent(choices) {
  // Dispatch custom event for other scripts to listen
  window.dispatchEvent(new CustomEvent('cookie-consent', { detail: choices }))

  // Example: load analytics if accepted
  if (choices.analytics) {
    // Placeholder for analytics script injection
    // e.g. load Google Analytics, Plausible, etc.
  }

  if (choices.marketing) {
    // Placeholder for marketing scripts
  }
}

// ─── CRUMB PARTICLES ────────────────────────────
function spawnCrumbs(button) {
  const rect = button.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2

  for (let i = 0; i < 18; i++) {
    const crumb = document.createElement('div')
    crumb.className = 'cookie-crumb'
    const angle = (Math.PI * 2 * i) / 18 + (Math.random() - 0.5) * 0.6
    const dist = 60 + Math.random() * 100
    const size = 3 + Math.random() * 6
    const hue = 30 + Math.random() * 25
    crumb.style.cssText = `
      left: ${cx}px; top: ${cy}px;
      width: ${size}px; height: ${size}px;
      --tx: ${Math.cos(angle) * dist}px;
      --ty: ${Math.sin(angle) * dist - 40}px;
      --rot: ${Math.random() * 720 - 360}deg;
      background: hsl(${hue}, 60%, ${45 + Math.random() * 20}%);
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `
    document.body.appendChild(crumb)
    crumb.addEventListener('animationend', () => crumb.remove())
  }
}

// ─── BUILD BANNER HTML ──────────────────────────
function createBanner() {
  const banner = document.createElement('div')
  banner.className = 'cookie-banner'
  banner.setAttribute('role', 'dialog')
  banner.setAttribute('aria-label', 'Consentement cookies')

  banner.innerHTML = `
    <div class="cookie-banner-backdrop"></div>
    <div class="cookie-card">
      <!-- Animated cookie icon -->
      <div class="cookie-icon-wrap">
        <div class="cookie-icon">
          <div class="cookie-body">
            <div class="cookie-chip" style="top:18%;left:25%"></div>
            <div class="cookie-chip" style="top:45%;left:60%"></div>
            <div class="cookie-chip" style="top:70%;left:30%"></div>
            <div class="cookie-chip" style="top:30%;left:70%"></div>
            <div class="cookie-chip" style="top:65%;left:65%"></div>
            <div class="cookie-crack c1"></div>
            <div class="cookie-crack c2"></div>
          </div>
        </div>
        <div class="cookie-glow"></div>
      </div>

      <div class="cookie-content">
        <h3 class="cookie-title">Un cookie ? 🍪</h3>
        <p class="cookie-desc">
          On utilise des cookies pour améliorer votre expérience. 
          Les essentiels sont toujours actifs — le reste, c'est vous qui décidez.
        </p>

        <!-- Toggle categories -->
        <div class="cookie-toggles">
          ${Object.entries(CATEGORIES).map(([key, cat]) => `
            <div class="cookie-toggle-row" data-cat="${key}">
              <div class="cookie-toggle-info">
                <span class="cookie-toggle-label">${cat.label}</span>
                <span class="cookie-toggle-desc">${cat.desc}</span>
              </div>
              <label class="cookie-switch ${cat.locked ? 'cookie-switch--locked' : ''}">
                <input type="checkbox" ${cat.locked ? 'checked disabled' : ''} data-cookie-cat="${key}" />
                <span class="cookie-switch-track">
                  <span class="cookie-switch-thumb"></span>
                </span>
              </label>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Actions -->
      <div class="cookie-actions">
        <button class="cookie-btn cookie-btn--reject" data-action="reject">
          <span>Refuser</span>
        </button>
        <button class="cookie-btn cookie-btn--accept" data-action="accept">
          <span>Tout accepter</span>
          <svg class="cookie-btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>

      <button class="cookie-btn-save" data-action="save">
        Sauvegarder mes choix
      </button>
    </div>
  `

  document.body.appendChild(banner)
  return banner
}

// ─── SHOW / HIDE ────────────────────────────────
function showBanner(banner) {
  // Micro-delay for CSS transition trigger
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      banner.classList.add('is-visible')
    })
  })
}

function hideBanner(banner, callback) {
  banner.classList.add('is-leaving')
  banner.classList.remove('is-visible')
  banner.addEventListener('transitionend', function handler(e) {
    if (e.target !== banner.querySelector('.cookie-card')) return
    banner.removeEventListener('transitionend', handler)
    banner.remove()
    if (callback) callback()
  })
  // Fallback removal
  setTimeout(() => { if (banner.parentNode) banner.remove() }, 1200)
}

// ─── INIT ───────────────────────────────────────
export function initCookies() {
  const existing = getConsent()
  if (existing) {
    applyConsent(existing.choices)
    return
  }

  const banner = createBanner()

  // Accept all
  banner.querySelector('[data-action="accept"]').addEventListener('click', (e) => {
    spawnCrumbs(e.currentTarget)
    const choices = {}
    Object.keys(CATEGORIES).forEach(k => choices[k] = true)
    setConsent(choices)
    hideBanner(banner)
  })

  // Reject non-essential
  banner.querySelector('[data-action="reject"]').addEventListener('click', () => {
    const choices = {}
    Object.keys(CATEGORIES).forEach(k => choices[k] = CATEGORIES[k].locked)
    setConsent(choices)
    hideBanner(banner)
  })

  // Save custom choices
  banner.querySelector('[data-action="save"]').addEventListener('click', (e) => {
    spawnCrumbs(e.currentTarget)
    const choices = {}
    banner.querySelectorAll('[data-cookie-cat]').forEach(input => {
      choices[input.dataset.cookieCat] = input.checked
    })
    setConsent(choices)
    hideBanner(banner)
  })

  // Show with delay for smooth page load
  setTimeout(() => showBanner(banner), 1800)
}

// ─── RE-OPEN (for mentions légales link etc.) ───
export function reopenCookies() {
  // Remove previous consent and re-show
  localStorage.removeItem(COOKIE_KEY)
  const banner = createBanner()
  // Pre-fill with previous choices if any
  showBanner(banner)

  banner.querySelector('[data-action="accept"]').addEventListener('click', (e) => {
    spawnCrumbs(e.currentTarget)
    const choices = {}
    Object.keys(CATEGORIES).forEach(k => choices[k] = true)
    setConsent(choices)
    hideBanner(banner)
  })

  banner.querySelector('[data-action="reject"]').addEventListener('click', () => {
    const choices = {}
    Object.keys(CATEGORIES).forEach(k => choices[k] = CATEGORIES[k].locked)
    setConsent(choices)
    hideBanner(banner)
  })

  banner.querySelector('[data-action="save"]').addEventListener('click', (e) => {
    spawnCrumbs(e.currentTarget)
    const choices = {}
    banner.querySelectorAll('[data-cookie-cat]').forEach(input => {
      choices[input.dataset.cookieCat] = input.checked
    })
    setConsent(choices)
    hideBanner(banner)
  })
}
