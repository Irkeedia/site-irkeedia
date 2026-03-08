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

  const audio = document.createElement('audio')
  audio.src = '/audio/ambient.mp3'
  audio.loop = true
  audio.volume = 0.4
  audio.preload = 'auto'
  // Append to DOM — some browsers are more permissive with DOM audio
  audio.style.display = 'none'
  document.body.appendChild(audio)

  let isPlaying = false
  let hasStarted = false

  // ─── Restore position once audio is ready ─────
  function restorePosition() {
    const savedTime = parseFloat(sessionStorage.getItem(STORAGE_TIME))
    if (!isNaN(savedTime) && savedTime > 0 && isFinite(audio.duration) && savedTime < audio.duration) {
      audio.currentTime = savedTime
    }
  }

  // Wait for metadata to be loaded before setting currentTime
  audio.addEventListener('loadedmetadata', restorePosition, { once: true })

  // ─── Save position continuously ───────────────
  audio.addEventListener('timeupdate', () => {
    if (audio.currentTime > 0) {
      sessionStorage.setItem(STORAGE_TIME, audio.currentTime.toFixed(2))
    }
  })

  // ─── Save position on page unload ─────────────
  window.addEventListener('beforeunload', () => {
    if (audio.currentTime > 0) {
      sessionStorage.setItem(STORAGE_TIME, audio.currentTime.toFixed(2))
    }
  })

  // ─── Play ─────────────────────────────────────
  async function play() {
    if (isPlaying) return
    try {
      const p = audio.play()
      if (p && p.then) {
        await p
      }
      isPlaying = true
      hasStarted = true
      sessionStorage.setItem(STORAGE_PLAYED, 'true')
      console.log('[Audio] Playing at', audio.currentTime.toFixed(1) + 's')
      // Remove interaction listeners once we're confirmed playing
      removeListeners()
    } catch (e) {
      isPlaying = false
      console.log('[Audio] Autoplay blocked:', e.message || e)
    }
  }

  // ─── First interaction → start music ──────────
  function onInteraction() {
    if (isPlaying) return
    play()
  }

  const events = ['click', 'keydown', 'touchstart', 'scroll', 'mousemove', 'pointerdown']

  function addListeners() {
    events.forEach(evt => {
      document.addEventListener(evt, onInteraction, {
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

  // ─── Try immediate autoplay ───────────────────
  const wasPlaying = sessionStorage.getItem(STORAGE_PLAYED) === 'true'
  if (wasPlaying) {
    // User already interacted on a previous page — try autoplay
    play()
    // Also retry after a short delay (some browsers need the page to settle)
    setTimeout(() => { if (!isPlaying) play() }, 500)
    setTimeout(() => { if (!isPlaying) play() }, 2000)
  }

  // Always add interaction listeners as fallback
  addListeners()

  // ─── Visibility: pause in background, resume on focus ─
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (isPlaying) {
        audio.pause()
        isPlaying = false
      }
    } else if (hasStarted) {
      // Resume when tab becomes visible again
      setTimeout(() => play(), 100)
    }
  })

  // ─── Safety: if loop somehow fails, restart ───
  audio.addEventListener('ended', () => {
    isPlaying = false
    audio.currentTime = 0
    play()
  })

  // ─── Error recovery ───────────────────────────
  audio.addEventListener('error', (e) => {
    console.warn('[Audio] Error:', e)
    isPlaying = false
    // Retry after delay
    setTimeout(() => {
      audio.load()
      if (hasStarted) play()
    }, 3000)
  })
}
