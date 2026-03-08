/* ============================================
   IRKEEDIA — Ambient Audio Controller
   Background music with mute/unmute toggle
   Respects autoplay policies + localStorage
   ============================================ */

export function initAudio() {
  const btn = document.getElementById('audioToggle')
  if (!btn) return

  const audio = new Audio('/audio/ambient.mp3')
  audio.loop = true
  audio.volume = 0.35
  audio.preload = 'auto'

  const STORAGE_KEY = 'irkeedia-audio-muted'
  let isMuted = localStorage.getItem(STORAGE_KEY) === 'true'
  let hasInteracted = false
  let isPlaying = false

  // ─── UI update ─────────────────────────────────
  function updateUI() {
    btn.classList.toggle('is-muted', isMuted)
    btn.setAttribute('aria-label', isMuted ? 'Activer la musique' : 'Couper la musique')
  }

  // ─── Try to play ──────────────────────────────
  async function tryPlay() {
    if (isMuted || isPlaying) return
    try {
      await audio.play()
      isPlaying = true
      btn.classList.add('is-playing')
    } catch (e) {
      // Autoplay blocked — will retry on interaction
      console.log('[Audio] Autoplay blocked, waiting for interaction')
    }
  }

  // ─── Toggle ───────────────────────────────────
  function toggle() {
    isMuted = !isMuted
    localStorage.setItem(STORAGE_KEY, isMuted)
    updateUI()

    if (isMuted) {
      audio.pause()
      isPlaying = false
      btn.classList.remove('is-playing')
    } else {
      tryPlay()
    }
  }

  // ─── First interaction handler ────────────────
  function onFirstInteraction() {
    if (hasInteracted) return
    hasInteracted = true

    // Remove listeners
    document.removeEventListener('click', onFirstInteraction)
    document.removeEventListener('keydown', onFirstInteraction)
    document.removeEventListener('touchstart', onFirstInteraction)
    document.removeEventListener('scroll', onFirstInteraction)

    // Auto-play if not muted
    if (!isMuted) {
      // Small delay to let preloader finish
      setTimeout(() => tryPlay(), 1500)
    }
  }

  // ─── Init ─────────────────────────────────────
  updateUI()

  // Button click
  btn.addEventListener('click', (e) => {
    e.stopPropagation()
    if (!hasInteracted) {
      hasInteracted = true
      document.removeEventListener('click', onFirstInteraction)
      document.removeEventListener('keydown', onFirstInteraction)
      document.removeEventListener('touchstart', onFirstInteraction)
      document.removeEventListener('scroll', onFirstInteraction)
    }
    toggle()
  })

  // Listen for any user interaction to unlock autoplay
  document.addEventListener('click', onFirstInteraction, { once: false })
  document.addEventListener('keydown', onFirstInteraction, { once: false })
  document.addEventListener('touchstart', onFirstInteraction, { once: false })
  document.addEventListener('scroll', onFirstInteraction, { once: false, passive: true })

  // Pause when tab is hidden, resume when visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (isPlaying) {
        audio.pause()
      }
    } else {
      if (!isMuted && hasInteracted) {
        tryPlay()
      }
    }
  })

  // Handle audio ending (safety — shouldn't happen with loop=true)
  audio.addEventListener('ended', () => {
    isPlaying = false
    if (!isMuted) {
      audio.currentTime = 0
      tryPlay()
    }
  })

  return {
    mute() { if (!isMuted) toggle() },
    unmute() { if (isMuted) toggle() },
    isMuted() { return isMuted },
  }
}
