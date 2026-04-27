/* ============================================
   IRKEEDIA LABS — consentement cookies
   Sans écran d’entrée plein écran (supprimé à la demande).
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
  localStorage.setItem(
    COOKIE_KEY,
    JSON.stringify({
      version: CONSENT_VERSION,
      timestamp: Date.now(),
      choices,
    }),
  )
  window.dispatchEvent(new CustomEvent('cookie-consent', { detail: choices }))
}

function applyConsent(choices) {
  window.dispatchEvent(new CustomEvent('cookie-consent', { detail: choices }))
}

/** Premier chargement : même préférences que l’ancien bouton « Entrer ». */
export function initCookies() {
  const existing = getConsent()
  if (existing) {
    applyConsent(existing.choices)
    return
  }
  setConsent({ necessary: true, analytics: true, marketing: true })
}

export function reopenCookies() {
  localStorage.removeItem(COOKIE_KEY)
  initCookies()
}
