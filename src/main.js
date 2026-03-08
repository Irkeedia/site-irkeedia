/* ============================================
   IRKEEDIA — Main Entry Point
   Orchestrates all modules initialization
   ============================================ */

import './styles/main.css'
import './styles/cookies.css'

import {
  initSmoothScroll,
  initPreloader,
  initCursor,
  initMagnetic,
  initNav,
  initHeroParallax,
} from './js/core.js'

import {
  heroEntrance,
  initAllAnimations,
} from './js/animations.js'

import { initWebGL } from './js/webgl.js'
import { initLiquidButtons } from './js/liquid-button.js'
import { initI18n } from './js/i18n.js'
import { initWave } from './js/wave.js'
import { initCookies } from './js/cookies.js'
import { initScroll3D } from './js/scroll-3d.js'
import { initAudio } from './js/audio.js'

// ─── 3D SCROLL UI (progress bar, dots, label) ──
function initScroll3DUI() {
  const progressBar = document.getElementById('scroll3dProgress')
  const progressFill = document.getElementById('scroll3dProgressFill')
  const dotsContainer = document.getElementById('scroll3dDots')
  const label = document.getElementById('scroll3dLabel')
  if (!progressBar || !progressFill) return

  const dots = dotsContainer ? dotsContainer.querySelectorAll('.scroll-3d-depth-dot') : []
  const sectionNames = ['HERO', 'SERVICES', 'PROJETS', 'PROCESSUS', 'À PROPOS', 'CONTACT']
  const sectionIds = ['hero', 'services', 'work', 'process', 'about', 'contact']

  let hasScrolled = false

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = Math.min(scrollTop / docHeight, 1)

    // Show/hide progress bar
    if (scrollTop > 100 && !hasScrolled) {
      hasScrolled = true
      progressBar.classList.add('is-visible')
      if (label) label.classList.add('is-visible')
    } else if (scrollTop <= 100 && hasScrolled) {
      hasScrolled = false
      progressBar.classList.remove('is-visible')
      if (label) label.classList.remove('is-visible')
    }

    // Update progress fill
    progressFill.style.height = (progress * 100) + '%'

    // Update dots
    const currentSectionIndex = Math.min(
      Math.floor(progress * sectionIds.length),
      sectionIds.length - 1
    )
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i <= currentSectionIndex)
    })

    // Update label
    if (label) {
      label.textContent = sectionNames[currentSectionIndex] || 'ESPACE 3D'
    }
  }, { passive: true })
}

// ─── BOOT SEQUENCE ──────────────────────────────
async function init() {
  // 1. Start WebGL immediately (renders behind preloader)
  initWebGL()

  // 1.5 Start 3D scroll experience
  initScroll3D()
  initScroll3DUI()

  // 2. Run preloader and wait for it to complete
  await initPreloader()

  // 3. Initialize smooth scroll
  initSmoothScroll()

  // 4. Hero entrance animation (after preloader)
  heroEntrance()

  // 5. Initialize interactive systems
  initCursor()
  initNav()
  initMagnetic()
  initHeroParallax()
  initLiquidButtons()
  initI18n()

  // 6. Initialize all scroll-based animations
  initAllAnimations()

  // 7. Procedural wave footer edge
  initWave()

  // 8. Cookie consent
  initCookies()

  // 9. Ambient audio
  initAudio()
}

// ─── START ──────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
