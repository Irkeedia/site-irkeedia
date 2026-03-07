/* ============================================
   IRKEEDIA — Project Page Init
   Lightweight init for project detail pages
   ============================================ */

import './styles/main.css'
import './styles/project.css'

// ─── CUSTOM CURSOR (lightweight, no GSAP) ───────
;(function initCursor() {
  const cursor = document.querySelector('.cursor')
  const follower = document.querySelector('.cursor-follower')
  if (!cursor || !follower) return
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return

  let mouseX = window.innerWidth / 2
  let mouseY = window.innerHeight / 2
  let followerX = mouseX
  let followerY = mouseY

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`
  })

  function tick() {
    followerX += (mouseX - followerX) * 0.12
    followerY += (mouseY - followerY) * 0.12
    follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)

  // Hover states on interactive elements
  document.querySelectorAll('a, button, [data-cursor]').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('is-active')
      follower.classList.add('is-active')
    })
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-active')
      follower.classList.remove('is-active')
    })
  })
})()

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault()
    const target = document.querySelector(anchor.getAttribute('href'))
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
})

// Fade-in sections on scroll (re-triggers when scrolling back)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
      } else {
        entry.target.classList.remove('is-visible')
      }
    })
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
)

document.querySelectorAll('.project-section, .feature-card, .info-block, .archi-block, .project-stack, .project-cta-banner').forEach((el) => {
  el.style.opacity = '0'
  el.style.transform = 'translateY(30px)'
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
  observer.observe(el)
})

// Add visible styles
const style = document.createElement('style')
style.textContent = `
  .project-section.is-visible,
  .feature-card.is-visible,
  .info-block.is-visible,
  .archi-block.is-visible,
  .project-stack.is-visible,
  .project-cta-banner.is-visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`
document.head.appendChild(style)

// Stagger feature cards
document.querySelectorAll('.feature-grid').forEach((grid) => {
  const cards = grid.querySelectorAll('.feature-card')
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`
  })
})

// Stagger info blocks
document.querySelectorAll('.info-row').forEach((row) => {
  const blocks = row.querySelectorAll('.info-block')
  blocks.forEach((block, i) => {
    block.style.transitionDelay = `${i * 0.1}s`
  })
})
