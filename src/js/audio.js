/* ============================================
   IRKEEDIA — Seamless Ambient Audio
   Background music across all pages.
   
   Strategy:
   1. Start muted autoplay (ALWAYS allowed by browsers)
   2. Unmute programmatically after playback begins
      (Chrome allows changing .muted on playing media)
   3. Fallback: unmute on first natural interaction
   
   Resumes position across pages via sessionStorage.
   ============================================ */

const STORAGE_TIME = 'irkeedia-audio-time'
const STORAGE_PLAYED = 'irkeedia-audio-played'

export function initAudio() {
  if (window.__irkeediaAudio) return
  window.__irkeediaAudio = true

  const audio = document.createElement('audio')
  audio.src = '/audio/ambient.mp3'
  audio.loop = true
  audio.preload = 'auto'
  audio.style.display = 'none'
  document.body.appendChild(audio)

  let isUnmuted = false

  // ─── Restore position once audio is ready ─────
  audio.addEventListener('loadedmetadata', () => {
    const saved = parseFloat(sessionStorage.getItem(STORAGE_TIME))
    if (!isNaN(saved) && saved > 0 && saved < audio.duration) {
      audio.currentTime = saved
    }
    startMuted()
  }, { once: true })

  // If loadedmetadata already fired (cached), start now
  if (audio.readyState >= 1) {
    const saved = parseFloat(sessionStorage.getItem(STORAGE_TIME))
    if (!isNaN(saved) && saved > 0) {
      audio.currentTime = saved
    }
    startMuted()
  }

  // ─── Phase 1: Start playing muted (guaranteed) ─
  function startMuted() {
    if (!audio.paused) return // already playing
    audio.muted = true
    audio.volume = 0
    audio.play().then(() => {
      console.log('[Audio] ✓ Playing muted — attempting unmute...')
      sessionStorage.setItem(STORAGE_PLAYED, 'true')
      // Phase 2: try to unmute programmatically
      attemptUnmute()
    }).catch(err => {
      console.log('[Audio] Muted autoplay failed:', err.message)
    })
  }

  // ─── Phase 2: Unmute (programmatic) ───────────
  function attemptUnmute() {
    if (isUnmuted) return

    // Small delay to let the browser settle
    setTimeout(() => {
      if (isUnmuted || audio.paused) return
      audio.muted = false
      audio.volume = 0.4

      // Check if browser paused it after unmuting
      setTimeout(() => {
        if (!audio.paused && !audio.muted) {
          // Success! Audio is playing with sound
          isUnmuted = true
          console.log('[Audio] ✓ Unmuted programmatically at', audio.currentTime.toFixed(1) + 's')
          removeGestureListeners()
        } else {
          // Browser blocked the unmute — re-mute and wait for gesture
          console.log('[Audio] Programmatic unmute blocked, waiting for gesture')
          audio.muted = true
          audio.volume = 0
          // Make sure it's still playing muted
          if (audio.paused) {
            audio.play().catch(() => {})
          }
        }
      }, 100)
    }, 150)
  }

  // ─── Phase 3 (fallback): Unmute on user gesture ─
  function unmute() {
    if (isUnmuted) return
    audio.muted = false
    audio.volume = 0.4
    isUnmuted = true
    sessionStorage.setItem(STORAGE_PLAYED, 'true')

    if (audio.paused) {
      audio.play().then(() => {
        console.log('[Audio] ✓ Playing (gesture fallback)')
      }).catch(() => {})
    } else {
      console.log('[Audio] ✓ Unmuted via gesture at', audio.currentTime.toFixed(1) + 's')
    }
    removeGestureListeners()
  }

  function onGesture() {
    if (isUnmuted) return
    unmute()
  }

  const gestureEvents = ['click', 'mousedown', 'keydown', 'touchstart', 'pointerdown']

  function addGestureListeners() {
    gestureEvents.forEach(evt => {
      document.addEventListener(evt, onGesture, { capture: true, passive: true })
    })
  }

  function removeGestureListeners() {
    gestureEvents.forEach(evt => {
      document.removeEventListener(evt, onGesture, { capture: true })
    })
  }

  // Always add gesture listeners as safety net
  addGestureListeners()

  // ─── Save position ────────────────────────────
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

  // ─── Visibility API ───────────────────────────
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      audio.pause()
    } else if (!audio.paused || isUnmuted) {
      audio.play().catch(() => {})
    }
  })

  // ─── Safety nets ──────────────────────────────
  audio.addEventListener('ended', () => {
    audio.currentTime = 0
    audio.play().catch(() => {})
  })

  audio.addEventListener('error', () => {
    setTimeout(() => {
      audio.load()
      audio.muted = !isUnmuted
      audio.volume = isUnmuted ? 0.4 : 0
      audio.play().catch(() => {})
    }, 3000)
  })
}
