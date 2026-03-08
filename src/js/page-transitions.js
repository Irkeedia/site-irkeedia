/* ============================================
   IRKEEDIA — Audio-Aware Page Transitions
   Ensures audio keeps playing across page
   navigations by:
   1. Saving position before navigation
   2. On new page: restoring + autoplay via
      user activation from the click event
   ============================================ */

export function initPageTransitions() {
  // Intercept internal link clicks to save audio state
  // and prepare for seamless restart on the next page
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]')
    if (!link) return

    const href = link.getAttribute('href')
    if (!href) return

    // Only handle internal navigations (same site)
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return
    if (href.startsWith('http') && !href.startsWith(window.location.origin)) return
    if (link.target === '_blank') return

    // This is an internal link click — save audio state
    const audio = document.querySelector('audio')
    if (audio && audio.currentTime > 0) {
      sessionStorage.setItem('irkeedia-audio-time', audio.currentTime.toFixed(2))
      sessionStorage.setItem('irkeedia-audio-played', 'true')
    }
  }, { capture: true, passive: true })
}
