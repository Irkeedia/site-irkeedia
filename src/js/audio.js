/* ============================================
   IRKEEDIA — Seamless Ambient Audio
   Background music across all pages.
   Strategy: start muted (always allowed),
   unmute on user gesture. Resumes position
   across page navigations via sessionStorage.
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
  let hasInteracted = false

  const alreadyActivated = sessionStorage.getItem(STORAGE_PLAYED) === 'true'

  // ─── Restore position once audio is ready ─────
  audio.addEventListener('loadedmetadata', () => {
    const saved = parseFloat(sessionStorage.getItem(STORAGE_TIME))
    if (!isNaN(saved) && saved > 0 && saved < audio.duration) {
      audio.currentTime = saved
    }

    // If user already entered on a previous page,
    // start playing muted immediately (always allowed by browsers)
    if (alreadyActivated) {
      audio.muted = true
      audio.volume = 0
      audio.play().then(() => {
        console.log('[Audio] Started muted, waiting for gesture to unmute')
      }).catch(() => {})
    }
  }, { once: true })

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

  // ─── Unmute (the real "start") ────────────────
  function unmute() {
    if (isUnmuted) return
    audio.muted = false
    audio.volume = 0.4
    isUnmuted = true
    hasInteracted = true
    sessionStorage.setItem(STORAGE_PLAYED, 'true')

    // If audio wasn't playing yet (first page), start it
    if (audio.paused) {
      audio.play().then(() => {
        console.log('[Audio] ✓ Playing (first gesture)')
      }).catch(() => {})
    } else {
      console.log('[Audio] ✓ Unmuted at', audio.currentTime.toFixed(1) + 's')
    }

    removeGestureListeners()
  }

  // ─── User gesture handler ────────────────────
  function onGesture() {
    if (isUnmuted) return
    unmute()
  }

  // Only genuine user activation events
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

  // ─── Also try unmuted autoplay (may work if MEI is high) ─
  if (alreadyActivated) {
    // Try with sound — some browsers allow after previous engagement
    const tryUnmuted = () => {
      if (isUnmuted) return
      const testAudio = document.createElement('audio')
      testAudio.src = audio.src
      testAudio.volume = 0.01
      const p = testAudio.play()
      if (p && p.then) {
        p.then(() => {
          // Browser allows unmuted autoplay!
          testAudio.pause()
          testAudio.remove()
          unmute()
        }).catch(() => {
          testAudio.remove()
        })
      }
    }
    setTimeout(tryUnmuted, 200)
  }

  // Register gesture listeners
  addGestureListeners()

  // ─── Visibility API ───────────────────────────
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      audio.pause()
    } else if (hasInteracted) {
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
      if (hasInteracted) audio.play().catch(() => {})
    }, 3000)
  })
}
