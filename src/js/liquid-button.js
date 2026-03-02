/* ============================================
   IRKEEDIA — Liquid Button Module
   Directional liquid fill: fills FROM where 
   the cursor enters, drains TOWARD where 
   the cursor exits
   ============================================ */

import gsap from 'gsap'

export function initLiquidButtons() {
  const buttons = document.querySelectorAll('.btn-liquid')

  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return

  buttons.forEach((btn) => {
    const fill = btn.querySelector('.btn-liquid-fill')
    if (!fill) return

    let isHovered = false

    btn.addEventListener('mouseenter', (e) => {
      isHovered = true
      const rect = btn.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Kill any running animation so we can restart cleanly
      gsap.killTweensOf(fill)

      // Position the fill circle at entry point
      gsap.set(fill, {
        left: x,
        top: y,
        xPercent: -50,
        yPercent: -50,
      })

      // Add filled state for text color inversion
      btn.classList.add('is-filled')

      // Expand from 0 to cover entire button
      gsap.fromTo(fill, {
        scale: 0,
        opacity: 1,
      }, {
        scale: 2.5,
        duration: 1.2,
        ease: 'power3.out',
      })
    })

    btn.addEventListener('mouseleave', (e) => {
      isHovered = false
      const rect = btn.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Kill running animation
      gsap.killTweensOf(fill)

      // Remove filled state
      btn.classList.remove('is-filled')

      // Reposition toward exit point and shrink
      gsap.to(fill, {
        left: x,
        top: y,
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.in',
      })
    })

    // Track mouse for subtle movement of fill center while hovered
    btn.addEventListener('mousemove', (e) => {
      if (!isHovered) return
      const rect = btn.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      gsap.to(fill, {
        left: x,
        top: y,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    })
  })
}
