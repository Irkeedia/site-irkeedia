/* ============================================
   IRKEEDIA — Entry Gate + Cookie Consent
   Fullscreen entry interface shown on each
   site entry. Replaces cookie popup banner.
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
  applyConsent(choices)
}

function applyConsent(choices) {
  window.dispatchEvent(new CustomEvent('cookie-consent', { detail: choices }))
}

function createEntryGate() {
  const gate = document.createElement('div')
  gate.className = 'entry-gate'
  gate.setAttribute('role', 'dialog')
  gate.setAttribute('aria-label', 'Entrer dans l\'expérience')

  gate.innerHTML = `
    <div class="entry-gate__panel">
      <span class="entry-gate__kicker">IRKEEDIA EXPERIENCE</span>
      <h1 class="entry-gate__title">Entrer dans l'expérience</h1>
      <p class="entry-gate__text">
        En entrant, vous activez l'expérience immersive et choisissez votre préférence cookies.
      </p>

      <div class="entry-gate__cookies">
        <p class="entry-gate__cookies-title">Préférences cookies</p>
        <p class="entry-gate__cookies-text">Essentiels toujours actifs. Optionnels selon votre choix.</p>
      </div>

      <div class="entry-gate__actions">
        <button class="entry-gate__btn entry-gate__btn--ghost" data-entry="reject">
          Entrer avec essentiels
        </button>
        <button class="entry-gate__btn entry-gate__btn--primary" data-entry="accept">
          Entrer et accepter tout
        </button>
      </div>
    </div>
  `

  document.body.appendChild(gate)
  return gate
}

function removeLegacyCookieBanner() {
  document.querySelectorAll('.cc-banner').forEach((el) => el.remove())
}

export function initEntryGate() {
  if (window.__irkeediaEntryGateReady) return
  window.__irkeediaEntryGateReady = true

  removeLegacyCookieBanner()

  const existing = getConsent()
  if (existing) {
    applyConsent(existing.choices)
  }

  const gate = createEntryGate()
  document.body.classList.add('entry-gate-open')

  requestAnimationFrame(() => {
    gate.classList.add('is-visible')
  })

  const choicesAccept = {
    necessary: true,
    analytics: true,
    marketing: true,
  }

  const choicesReject = {
    necessary: true,
    analytics: false,
    marketing: false,
  }

  gate.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-entry]')
    if (!btn) return

    const mode = btn.getAttribute('data-entry')
    setConsent(mode === 'accept' ? choicesAccept : choicesReject)

    gate.classList.remove('is-visible')
    gate.classList.add('is-leaving')
    setTimeout(() => {
      gate.remove()
      document.body.classList.remove('entry-gate-open')
    }, 420)
  })
}

// Compat: no popup anymore
export function initCookies() {
  const existing = getConsent()
  if (existing) {
    applyConsent(existing.choices)
  }
}

export function reopenCookies() {
  localStorage.removeItem(COOKIE_KEY)
  if (window.__irkeediaEntryGateReady) {
    window.__irkeediaEntryGateReady = false
  }
  initEntryGate()
}
