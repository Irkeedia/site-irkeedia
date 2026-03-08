/* ============================================
  IRKEEDIA — Seamless Ambient Audio

  Strategy:
  1) Try autoplay with sound directly
  2) If blocked, start muted (always allowed)
  3) On first gesture, force audible playback

  Position persists via sessionStorage.
  ============================================ */

const STORAGE_TIME = 'irkeedia-audio-time'
const STORAGE_PLAYED = 'irkeedia-audio-played'

export function initAudio() {
  if (window.__irkeediaAudio) return
  window.__irkeediaAudio = true

  const audio = document.createElement('audio')
  audio.id = 'irkeedia-ambient-audio'
  audio.src = '/audio/ambient.mp3'
  audio.loop = true
  audio.preload = 'auto'
  audio.style.display = 'none'
  document.body.appendChild(audio)

  audio.volume = 0.4
  let isAudible = false
  let startedMutedFallback = false

  // ─── Restore position ────────────────────────
  audio.addEventListener('loadedmetadata', () => {
    const saved = parseFloat(sessionStorage.getItem(STORAGE_TIME))
    if (!isNaN(saved) && saved > 0 && saved < audio.duration) {
      audio.currentTime = saved
    }
    startAudio()
  }, { once: true })

  // Handle already-loaded (browser cache)
  if (audio.readyState >= 1) {
    const saved = parseFloat(sessionStorage.getItem(STORAGE_TIME))
    if (!isNaN(saved) && saved > 0) audio.currentTime = saved
    startAudio()
  }

  function startAudio() {
    if (!audio.paused) return

    // 1) Try autoplay with sound
    audio.muted = false
    audio.volume = 0.4
    audio.play().then(() => {
      isAudible = true
      sessionStorage.setItem(STORAGE_PLAYED, 'true')
      removeGestureListeners()
      console.log('[Audio] ✓ Playing with sound')
    }).catch(() => {
      // 2) Fallback: autoplay muted (usually allowed)
      audio.muted = true
      audio.volume = 0
      audio.play().then(() => {
        startedMutedFallback = true
        sessionStorage.setItem(STORAGE_PLAYED, 'true')
        console.log('[Audio] Started muted (waiting user gesture for sound)')
      }).catch((err) => {
        console.log('[Audio] Autoplay blocked entirely:', err.message)
      })
    })
  }

  // ─── Gesture fallback (guaranteed unlock path) ─
  function onGesture() {
    if (isAudible) return

    // Force audible playback on first interaction
    audio.muted = false
    audio.volume = 0.4
    audio.play().then(() => {
      isAudible = true
      removeGestureListeners()
      console.log('[Audio] ✓ Sound unlocked by gesture')
    }).catch(() => {
      // Retry once after a tiny delay in the same interaction window
      setTimeout(() => {
        audio.muted = false
        audio.volume = 0.4
        audio.play().then(() => {
          isAudible = true
          removeGestureListeners()
          console.log('[Audio] ✓ Sound unlocked by delayed retry')
        }).catch(() => {})
      }, 30)
    })
  }

  const gestureEvents = ['click', 'mousedown', 'keydown', 'touchstart', 'pointerdown']

  function addGestureListeners() {
    gestureEvents.forEach(evt =>
      document.addEventListener(evt, onGesture, { capture: true, passive: true })
    )
  }
  function removeGestureListeners() {
    gestureEvents.forEach(evt =>
      document.removeEventListener(evt, onGesture, { capture: true })
    )
  }

  addGestureListeners()

  // ─── Save position ───────────────────────────
  audio.addEventListener('timeupdate', () => {
    if (audio.currentTime > 0) {
      sessionStorage.setItem(STORAGE_TIME, audio.currentTime.toFixed(2))
    }
  })
  window.addEventListener('beforeunload', () => {
    if (audio.currentTime > 0) {
      sessionStorage.setItem(STORAGE_TIME, audio.currentTime.toFixed(2))
    }
  })

  // ─── Visibility API ──────────────────────────
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      audio.pause()
    } else {
      if (!audio.paused || startedMutedFallback || isAudible) {
        audio.play().catch(() => {})
      }
    }
  })

  // ─── Safety nets ─────────────────────────────
  audio.addEventListener('ended', () => {
    audio.currentTime = 0
    audio.play().catch(() => {})
  })

  audio.addEventListener('error', () => {
    setTimeout(() => {
      audio.load()
      audio.play().catch(() => {})
    }, 3000)
  })
}
