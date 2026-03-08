/* ============================================
   IRKEEDIA — Seamless Ambient Audio
   
   Strategy: Web Audio API bypass.
   1. <audio muted> → autoplay always allowed
   2. createMediaElementSource() routes sound 
      through Web Audio graph (ignores .muted)
   3. audioContext.resume() is the ONLY gate
      — Chrome often allows it on return visits
      — fallback: first natural interaction
   
   Position persists via sessionStorage.
   ============================================ */

const STORAGE_TIME = 'irkeedia-audio-time'
const STORAGE_PLAYED = 'irkeedia-audio-played'

export function initAudio() {
  if (window.__irkeediaAudio) return
  window.__irkeediaAudio = true

  const audio = document.createElement('audio')
  audio.src = '/audio/ambient.mp3'
  audio.loop = true
  audio.muted = true          // ← Required for guaranteed autoplay
  audio.preload = 'auto'
  audio.crossOrigin = 'anonymous'
  audio.style.display = 'none'
  document.body.appendChild(audio)

  let soundActive = false
  let audioCtx = null
  let gainNode = null

  // ─── Web Audio API setup ──────────────────────
  // Sound goes through GainNode → destination,
  // completely bypassing the element's .muted property
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    audioCtx = new AC()
    const source = audioCtx.createMediaElementSource(audio)
    gainNode = audioCtx.createGain()
    gainNode.gain.value = 0.4
    source.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    console.log('[Audio] Web Audio API graph ready')
  } catch (e) {
    console.log('[Audio] Web Audio API unavailable:', e.message)
    // Fallback: direct element (will need gesture for unmute)
    audioCtx = null
  }

  // ─── Restore position ────────────────────────
  audio.addEventListener('loadedmetadata', () => {
    const saved = parseFloat(sessionStorage.getItem(STORAGE_TIME))
    if (!isNaN(saved) && saved > 0 && saved < audio.duration) {
      audio.currentTime = saved
    }
    beginPlayback()
  }, { once: true })

  // Handle already-loaded (browser cache)
  if (audio.readyState >= 1) {
    const saved = parseFloat(sessionStorage.getItem(STORAGE_TIME))
    if (!isNaN(saved) && saved > 0) audio.currentTime = saved
    beginPlayback()
  }

  // ─── Start playback (muted → guaranteed) ─────
  function beginPlayback() {
    if (!audio.paused) {
      tryActivateSound()
      return
    }
    audio.play().then(() => {
      console.log('[Audio] ✓ Element playing (muted)')
      sessionStorage.setItem(STORAGE_PLAYED, 'true')
      tryActivateSound()
    }).catch(err => {
      console.log('[Audio] Even muted play failed:', err.message)
    })
  }

  // ─── Activate sound via AudioContext.resume() ─
  function tryActivateSound() {
    if (soundActive || !audioCtx) return

    audioCtx.resume().then(() => {
      if (audioCtx.state === 'running') {
        soundActive = true
        console.log('[Audio] ✓ Sound active! (Web Audio API)')
        removeGestureListeners()
      }
    }).catch(() => {})

    // Retry a few times — some browsers need a moment
    setTimeout(() => {
      if (soundActive || !audioCtx) return
      audioCtx.resume().then(() => {
        if (audioCtx.state === 'running') {
          soundActive = true
          console.log('[Audio] ✓ Sound active (delayed resume)')
          removeGestureListeners()
        }
      }).catch(() => {})
    }, 500)

    setTimeout(() => {
      if (soundActive || !audioCtx) return
      audioCtx.resume().catch(() => {})
      if (audioCtx.state === 'running') {
        soundActive = true
        removeGestureListeners()
      }
    }, 1500)
  }

  // ─── Gesture fallback ────────────────────────
  function onGesture() {
    if (soundActive) return

    if (audioCtx) {
      audioCtx.resume().then(() => {
        soundActive = true
        console.log('[Audio] ✓ Sound via gesture (Web Audio)')
        removeGestureListeners()
      }).catch(() => {})
    } else {
      // No Web Audio: direct unmute
      audio.muted = false
      audio.volume = 0.4
      soundActive = true
      if (audio.paused) audio.play().catch(() => {})
      console.log('[Audio] ✓ Sound via gesture (direct)')
      removeGestureListeners()
    }

    // Start playback if needed
    if (audio.paused) audio.play().catch(() => {})
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
      if (audioCtx) audioCtx.suspend().catch(() => {})
    } else {
      audio.play().catch(() => {})
      if (audioCtx && soundActive) audioCtx.resume().catch(() => {})
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
