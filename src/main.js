import './styles/main.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import SplitType from 'split-type'
import { applyPerfClass, isLowEnd } from './js/perf.js'

gsap.registerPlugin(ScrollTrigger)

applyPerfClass()

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
// Sur machine modeste, on garde la mise en page mais pas les couches animées
// plein écran : c'est là que passe l'essentiel du coût de compositing.
const lightweight = isLowEnd()

/* ============================================================
   Scroll lissé — Lenis pilote, GSAP suit.
   ============================================================ */
function initSmoothScroll() {
  if (reduced) return null

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })

  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  // Les ancres passent par Lenis pour garder le lissage.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href')
      if (!id || id === '#') return
      const target = document.querySelector(id)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target, { offset: -60 })
    })
  })

  if (import.meta.env.DEV) window.__lenis = lenis

  return lenis
}

/* ============================================================
   Jauge de progression
   ============================================================ */
function initProgress() {
  const bar = document.getElementById('progress')
  if (!bar) return
  gsap.to(bar, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.2 },
  })
}

/* ============================================================
   Scènes photo : parallaxe de l'image + lumière qui balaie
   ============================================================ */
function initStages() {
  if (lightweight) {
    document.querySelectorAll('[data-light]').forEach((el) => el.remove())
    return
  }

  document.querySelectorAll('[data-media]').forEach((stage) => {
    const img = stage.querySelector('[data-parallax]')
    const light = stage.querySelector('[data-light]')

    const tl = gsap.timeline({
      scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
    })

    if (img) {
      const amount = Number(img.dataset.parallax || 14)
      tl.fromTo(img, { yPercent: -amount }, { yPercent: amount, ease: 'none' }, 0)
    }

    if (light) {
      // La source lumineuse traverse le cadre en diagonale pendant le scroll.
      // Uniquement des transforms : le dégradé n'est jamais repeint, la carte
      // graphique se contente de déplacer une couche déjà rendue.
      tl.fromTo(
        light,
        { xPercent: 0, yPercent: 0, scale: 1 },
        { xPercent: 95, yPercent: 110, scale: 1.25, ease: 'none' },
        0,
      )
    }
  })
}

/* ============================================================
   Entrées de chapitre : titre ligne par ligne, texte, fiche technique
   ============================================================ */
function initChapters() {
  document.querySelectorAll('.chapter').forEach((chapter) => {
    const title = chapter.querySelector('[data-split]')
    const bits = chapter.querySelectorAll(
      '.chapter-index, .chapter-copy .eyebrow, .chapter-lead, .chapter-actions',
    )
    const specs = chapter.querySelectorAll('.chapter-specs li')

    const tl = gsap.timeline({
      scrollTrigger: { trigger: chapter, start: 'top 62%', once: true },
    })

    if (title) {
      const split = new SplitType(title, { types: 'lines,words' })
      gsap.set(title, { autoAlpha: 1 })
      tl.from(split.words, {
        yPercent: 118,
        duration: 1.05,
        ease: 'expo.out',
        stagger: 0.06,
      })
    }

    tl.from(bits, { y: 26, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.09 }, 0.15)
    tl.from(specs, { y: 18, autoAlpha: 0, duration: 0.65, ease: 'power3.out', stagger: 0.06 }, 0.35)
  })
}

/* ============================================================
   Hero : entrée à l'ouverture, sortie en fondu au scroll
   ============================================================ */
function initHero() {
  const hero = document.querySelector('.hero')
  if (!hero) return

  const inner = hero.querySelector('.hero-inner')
  gsap.from(inner.children, {
    y: 34,
    autoAlpha: 0,
    duration: 1.1,
    ease: 'power3.out',
    stagger: 0.09,
    delay: 0.15,
  })

  gsap.to(inner, {
    y: -60,
    autoAlpha: 0,
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'center center', end: 'bottom top', scrub: 0.5 },
  })
}

/* ============================================================
   Manifeste : les mots s'allument au fil du scroll
   ============================================================ */
function initManifesto() {
  const target = document.querySelector('[data-words]')
  if (!target) return

  const split = new SplitType(target, { types: 'words' })
  gsap.to(split.words, {
    opacity: 1,
    ease: 'none',
    stagger: 0.4,
    scrollTrigger: { trigger: target, start: 'top 78%', end: 'bottom 52%', scrub: 0.4 },
  })
}

/* ============================================================
   Bandeaux défilants : vitesse et sens pilotés par le scroll
   ============================================================ */
function initTickers() {
  document.querySelectorAll('[data-ticker]').forEach((track) => {
    // Duplique le contenu pour boucler sans couture sur -50 %.
    track.append(...Array.from(track.children).map((n) => n.cloneNode(true)))

    const base = Number(track.dataset.speed || 1)
    const loop = gsap.to(track, { xPercent: -50, duration: 26, ease: 'none', repeat: -1 })
    loop.timeScale(base)

    if (reduced) return

    const speed = { value: base }
    ScrollTrigger.create({
      onUpdate(self) {
        const v = self.getVelocity()
        const dir = v === 0 ? 1 : Math.sign(v)
        const boost = gsap.utils.clamp(1, 7, 1 + Math.abs(v) / 550)
        gsap.to(speed, {
          value: base * dir * boost,
          duration: 0.25,
          overwrite: true,
          onUpdate: () => loop.timeScale(speed.value),
          onComplete: () => {
            // Retour progressif à la vitesse de croisière.
            gsap.to(speed, {
              value: base,
              duration: 1.2,
              onUpdate: () => loop.timeScale(speed.value),
            })
          },
        })
      },
    })
  })
}

/* ============================================================
   Header : blanc au-dessus des scènes photo, opaque ailleurs
   ============================================================ */
function initHeader() {
  const header = document.getElementById('header')
  if (!header) return

  const update = () => header.classList.toggle('is-stuck', window.scrollY > 8)
  update()
  window.addEventListener('scroll', update, { passive: true })

  const over = new Set()
  document.querySelectorAll('[data-media]').forEach((stage) => {
    ScrollTrigger.create({
      trigger: stage,
      start: 'top top+=74',
      end: 'bottom top+=74',
      onToggle(self) {
        if (self.isActive) over.add(stage)
        else over.delete(stage)
        header.classList.toggle('is-over-media', over.size > 0)
      },
    })
  })
}

/* ============================================================
   Thème clair / sombre
   ============================================================ */
function initTheme() {
  const toggle = document.getElementById('themeToggle')
  if (!toggle) return

  toggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('ik-theme', next)
    } catch (e) {
      /* stockage indisponible : le thème reste valable pour la session */
    }
  })
}

/* ============================================================
   Menu mobile
   ============================================================ */
function initMenu() {
  const btn = document.getElementById('menuBtn')
  const links = document.getElementById('navLinks')
  if (!btn || !links) return

  const close = () => {
    links.classList.remove('is-open')
    btn.setAttribute('aria-expanded', 'false')
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation()
    const open = links.classList.toggle('is-open')
    btn.setAttribute('aria-expanded', String(open))
  })

  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', close))
  document.addEventListener('click', (e) => {
    if (!links.contains(e.target) && !btn.contains(e.target)) close()
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close()
  })
}

/* ============================================================
   Filtres de l'index
   ============================================================ */
function initFilters() {
  const bar = document.getElementById('filters')
  const grid = document.getElementById('boardGrid')
  const empty = document.getElementById('boardEmpty')
  if (!bar || !grid) return

  const pins = Array.from(grid.querySelectorAll('.pin'))
  const buttons = Array.from(bar.querySelectorAll('.filter'))

  const matches = (pin, key) => (pin.dataset.cat || '').split(/\s+/).includes(key)

  buttons.forEach((btn) => {
    const key = btn.dataset.filter
    const count = key === 'all' ? pins.length : pins.filter((p) => matches(p, key)).length
    const tally = document.createElement('b')
    tally.textContent = String(count)
    btn.append(tally)
  })

  function apply(key) {
    let shown = 0
    pins.forEach((pin) => {
      const visible = key === 'all' || matches(pin, key)
      pin.classList.toggle('is-hidden', !visible)
      if (!visible) return
      shown++
      // Rejoue l'entrée en cascade sur le nouveau sous-ensemble.
      pin.style.setProperty('--d', `${Math.min(shown, 12) * 40}ms`)
      pin.style.animation = 'none'
      void pin.offsetWidth
      pin.style.animation = ''
    })
    if (empty) empty.hidden = shown > 0
    ScrollTrigger.refresh()
  }

  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter')
    if (!btn) return
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)))
    apply(btn.dataset.filter)
  })
}

/* ============================================================
   Révélation simple des blocs éditoriaux
   ============================================================ */
function initReveal() {
  const items = document.querySelectorAll('.reveal')
  if (!items.length) return

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'))
    return
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-in')
        io.unobserve(entry.target)
      })
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
  )

  items.forEach((el) => io.observe(el))
}

/* ============================================================
   Amorçage
   ============================================================ */
function init() {
  initTheme()
  initMenu()
  initFilters()
  initReveal()

  const year = document.getElementById('year')
  if (year) year.textContent = String(new Date().getFullYear())

  initSmoothScroll()
  initHeader()

  if (reduced) return

  initProgress()
  initStages()
  initHero()
  initChapters()
  initManifesto()
  initTickers()

  // Les polices changent la hauteur des lignes : on recalcule après leur chargement.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh())
  }
  window.addEventListener('load', () => ScrollTrigger.refresh())
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
