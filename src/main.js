/* ============================================
   IRKEEDIA — Main Entry Point
   Orchestrates all modules initialization
   ============================================ */

import './styles/main.css'

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

// ─── BOOT SEQUENCE ──────────────────────────────
async function init() {
  // 1. Start WebGL immediately (renders behind preloader)
  initWebGL()

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
}

// ─── START ──────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
