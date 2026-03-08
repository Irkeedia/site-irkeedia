/* ============================================
   IRKEEDIA — Seamless Ambient Audio
   Background music that persists across pages.
   No button — auto-plays on first interaction
   and resumes position when navigating.
   ============================================ */

const STORAGE_TIME = 'irkeedia-audio-time'
const STORAGE_PLAYED = 'irkeedia-audio-played'

export function initAudio() {
  // Prevent double-init
  if (window.__irkeediaAudio) return
  window.__irkeediaAudio = true

  const audio = new Audio('/audio/ambient.mp3')
  audio.loop = true
  audio.volume = 0.4
  audio.preload = 'auto'

  let isPlaying = false
  let hasStarted = false

  // ─── Restore position from previous page ──────
  const savedTime = parseFloat(sessionStorage.getItem(STORAGE_TIME))
  if (!isNaN(savedTime) && savedTime > 0) {
    audio.currentTime = savedTime
  }

  // ─── Save position continuously ───────────────
  audio.addEventListener('timeupdate', () => {
    sessionStorage.setItem(STORAGE_TIME, audio.currentTime.toFixed(2))
  })

  // ─── Save position on page unload ─────────────
  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem(STORAGE_TIME, audio.currentTime.toFixed(2))
  })

  // ─── Play ─────────────────────────────────────
  async function play() {
    if (isPlaying) return
    try {
      await audio.play()
      isPlaying = true
      hasStarted = true
      sessionStorage.setItem(STORAGE_PLAYED, 'true')
      console.log('[Audio] Playing at', audio.currentTime.toFixed(1) + 's')
    } catch (e) {
      // Autoplay blocked — will retry on user interaction
      console.log('[Audio] Autoplay blocked, waiting for interaction')
    }
  }

  // ─── Try immediate autoplay ───────────────────
  // If user already interacted on a previous page, browsers
  // often allow autoplay. Try it immediately.
  const wasPlaying = sessionStorage.getItem(STORAGE_PLAYED) === 'true'
  if (wasPlaying) {
    play()
  }

  // ─── First interaction → start music ──────────
  function onInteraction() {
    if (hasStarted) return
    removeListeners()
    play()
  }

  const events = ['click', 'keydown', 'touchstart', 'scroll', 'mousemove']

  function addListeners() {
    events.forEach(evt => {
      document.addEventListener(evt, onInteraction, {
        once: false,
        passive: true,
        capture: true,
      })
    })
  }

  function removeListeners() {
    events.forEach(evt => {
      document.removeEventListener(evt, onInteraction, { capture: true })
    })
  }

  // Always add listeners as fallback (autoplay may have been blocked)
  addListeners()

  // ─── Visibility: pause in background, resume on focus ─
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (isPlaying) {
        audio.pause()
        isPlaying = false
      }
    } else {
      if (hasStarted) {
        play()
      }
    }
  })

  // ─── Safety: if loop fails, restart ───────────
  audio.addEventListener('ended', () => {
    isPlaying = false
    audio.currentTime = 0
    play()
  })
}
