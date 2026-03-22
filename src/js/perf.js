/* ============================================
   IRKEEDIA — Performance Detection Module
   Shared utility for all modules to adapt
   their complexity to device capability.
   ============================================ */

let _tier = null // 'high' | 'mid' | 'low'

function detect() {
  const cores = navigator.hardwareConcurrency || 2
  const mem = navigator.deviceMemory || 4 // unsupported in Firefox/Safari → default 4
  const mobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768

  // Mobile low-end
  if (mobile && (cores <= 4 || mem <= 3)) return 'low'
  if (mobile) return 'mid'

  // Desktop
  if (cores >= 8 && mem >= 8) return 'high'
  if (cores >= 6) return 'mid'

  return 'low'
}

/** @returns {'high'|'mid'|'low'} */
export function perfTier() {
  if (!_tier) _tier = detect()
  return _tier
}

export function isLowEnd() { return perfTier() === 'low' }
export function isMidEnd() { return perfTier() === 'mid' }
export function isHighEnd() { return perfTier() === 'high' }

/**
 * Apply CSS class to <html> so CSS can adapt (e.g., disable backdrop-filter).
 * Call once at boot.
 */
export function applyPerfClass() {
  document.documentElement.classList.add('perf-' + perfTier())
}
