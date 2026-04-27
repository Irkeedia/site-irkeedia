/* ============================================
   IRKEEDIA — Project Page Init
   Lightweight init for project detail pages
   ============================================ */

import './styles/main.css'
import './styles/project.css'
import { initCookies } from './js/cookies.js'
import { applyPerfClass } from './js/perf.js'

// Apply performance tier CSS class
applyPerfClass()

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

initCookies()

// Navigation classique (rechargement complet) : la SPA injectait le HTML sans
// transition fluide et provoquait un flash désagréable entre pages projet.
