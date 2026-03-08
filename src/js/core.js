/* ============================================
   IRKEEDIA — Core Module
   Preloader, Cursor, Navigation, Smooth Scroll,
   Magnetic Effect
   ============================================ */

import gsap from 'gsap'
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── SMOOTH SCROLL (LENIS) ─────────────────────
export function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    gestureDirection: 'vertical',
    smoothWheel: true,
    smoothTouch: false,
    touchMultiplier: 2,
  })

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)

  // Anchor links smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault()
      const target = document.querySelector(anchor.getAttribute('href'))
      if (target) lenis.scrollTo(target, { offset: 0 })
    })
  })

  return lenis
}

// ─── PRELOADER ──────────────────────────────────
export function initPreloader() {
  return new Promise((resolve) => {
    const preloader = document.getElementById('preloader')
    if (!preloader) { resolve(); return }

    const bgTop = preloader.querySelector('.preloader-bg-top')
    const bgBottom = preloader.querySelector('.preloader-bg-bottom')
    const logoText = preloader.querySelector('.preloader-logo-text')
    const counter = preloader.querySelector('.preloader-counter')
    const lineInner = preloader.querySelector('.preloader-line-inner')
    const center = preloader.querySelector('.preloader-center')
    const enterBtn = document.getElementById('preloaderEnter')
    const countWrap = preloader.querySelector('.preloader-count')
    const lineWrap = preloader.querySelector('.preloader-line')

    document.body.style.overflow = 'hidden'

    // ─── Phase 1: Loading animation ────────────────
    const loadTl = gsap.timeline({
      onComplete: showEnterGate,
    })

    // 1. Reveal logo text
    loadTl.from(logoText, {
      yPercent: 120,
      duration: 0.9,
      ease: 'power3.out',
    })

    // 2. Counter 0 → 100
    .to({ val: 0 }, {
      val: 100,
      duration: 2.2,
      ease: 'power2.inOut',
      onUpdate() {
        counter.textContent = Math.floor(this.targets()[0].val)
      },
    }, 0.3)

    // 3. Progress line
    .to(lineInner, {
      width: '100%',
      duration: 2.2,
      ease: 'power2.inOut',
    }, 0.3)

    // ─── Phase 2: Show "ENTRER" gate ─────────────
    function showEnterGate() {
      // Fade out counter & line
      gsap.to([countWrap, lineWrap], {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          if (countWrap) countWrap.style.display = 'none'
          if (lineWrap) lineWrap.style.display = 'none'
        }
      })

      // Show enter button
      setTimeout(() => {
        if (enterBtn) enterBtn.classList.add('is-visible')
      }, 300)

      // Listen for click anywhere on preloader
      preloader.addEventListener('click', onEnterClick, { once: true })
      preloader.addEventListener('touchstart', onEnterClick, { once: true })
      // Also keyboard
      document.addEventListener('keydown', onEnterKey)
    }

    function onEnterKey(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        onEnterClick()
      }
    }

    // ─── Phase 3: User clicked → reveal site ────
    function onEnterClick() {
      // Clean up
      preloader.removeEventListener('click', onEnterClick)
      preloader.removeEventListener('touchstart', onEnterClick)
      document.removeEventListener('keydown', onEnterKey)

      // Reveal timeline
      const revealTl = gsap.timeline({
        onComplete: () => {
          preloader.style.display = 'none'
          document.body.style.overflow = ''
          document.body.classList.add('is-loaded')
          resolve()
        },
      })

      // Center fades out
      revealTl.to(center, {
        opacity: 0,
        y: -30,
        duration: 0.5,
        ease: 'power2.in',
      })

      // Background splits open
      .to(bgTop, {
        yPercent: -100,
        duration: 1,
        ease: 'power4.inOut',
      })
      .to(bgBottom, {
        yPercent: 100,
        duration: 1,
        ease: 'power4.inOut',
      }, '<')
    }
  })
}

// ─── CUSTOM CURSOR ──────────────────────────────
export function initCursor() {
  const cursor = document.querySelector('.cursor')
  const follower = document.querySelector('.cursor-follower')
  const cursorText = document.querySelector('.cursor-text')

  if (!cursor || !follower) return
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return

  let mouseX = window.innerWidth / 2
  let mouseY = window.innerHeight / 2
  let cursorX = mouseX
  let cursorY = mouseY
  let followerX = mouseX
  let followerY = mouseY

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
    // Cursor dot follows instantly — no lag
    gsap.set(cursor, { x: mouseX, y: mouseY })
  })

  gsap.ticker.add(() => {
    const dtFollower = 0.12

    followerX += (mouseX - followerX) * dtFollower
    followerY += (mouseY - followerY) * dtFollower

    gsap.set(follower, { x: followerX, y: followerY })
  })

  // Interactive hover states
  const interactives = document.querySelectorAll('a, button, .magnetic, [data-cursor]')
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('is-active')
      follower.classList.add('is-active')
    })
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-active')
      follower.classList.remove('is-active')
    })
  })

  // Project hover — "View" text in cursor
  const projectItems = document.querySelectorAll('[data-cursor-text]')
  projectItems.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      const text = el.getAttribute('data-cursor-text') || 'View'
      if (cursorText) cursorText.textContent = text
      cursor.classList.add('is-active')
      follower.classList.add('is-view')
    })
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-active')
      follower.classList.remove('is-view')
    })
  })
}

// ─── MAGNETIC EFFECT ────────────────────────────
export function initMagnetic() {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return

  const elements = document.querySelectorAll('.magnetic')

  elements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      gsap.to(el, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.4,
        ease: 'power2.out',
      })
    })

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1.2, 0.4)',
      })
    })
  })
}

// ─── NAVIGATION ─────────────────────────────────
export function initNav() {
  const nav = document.getElementById('nav')
  const toggle = document.getElementById('menu-toggle')
  const overlay = document.getElementById('menu-overlay')
  const menuBg = overlay ? overlay.querySelector('.menu-bg') : null
  const menuContent = overlay ? overlay.querySelector('.menu-content') : null
  const links = document.querySelectorAll('.menu-link')

  if (!nav || !toggle || !overlay) return

  let isOpen = false

  function openMenu() {
    isOpen = true
    toggle.classList.add('is-open')
    overlay.classList.add('is-open')

    // Stagger links and info blocks with GSAP
    gsap.fromTo('.menu-link', {
      yPercent: 100,
      opacity: 0,
    }, {
      yPercent: 0,
      opacity: 1,
      stagger: 0.06,
      duration: 0.7,
      delay: 0.35,
      ease: 'power3.out',
    })

    gsap.fromTo('.menu-info-block', {
      opacity: 0,
      y: 20,
    }, {
      opacity: 1,
      y: 0,
      stagger: 0.08,
      duration: 0.5,
      delay: 0.5,
      ease: 'power3.out',
    })
  }

  function closeMenu() {
    isOpen = false
    toggle.classList.remove('is-open')
    overlay.classList.remove('is-open')
  }

  toggle.addEventListener('click', () => {
    if (isOpen) closeMenu()
    else openMenu()
  })

  links.forEach((link) => {
    link.addEventListener('click', () => {
      if (isOpen) closeMenu()
    })
  })

  // Escape key closes menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeMenu()
  })

  // Nav visibility & scroll behavior
  ScrollTrigger.create({
    onUpdate: (self) => {
      const y = self.scroll()

      if (y > 10) nav.classList.add('is-visible')

      if (y > 100) {
        nav.classList.add('is-filled')
      } else {
        nav.classList.remove('is-filled')
      }

      if (y > window.innerHeight) {
        if (self.direction === 1) {
          nav.classList.add('is-hidden')
        } else {
          nav.classList.remove('is-hidden')
        }
      } else {
        nav.classList.remove('is-hidden')
      }
    },
  })

  setTimeout(() => {
    nav.classList.add('is-visible')
  }, 100)
}

// ─── HERO PARALLAX ON MOUSE ─────────────────────
export function initHeroParallax() {
  if ('ontouchstart' in window) return

  const heroContent = document.querySelector('.hero-content')
  if (!heroContent) return

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2
    const y = (e.clientY / window.innerHeight - 0.5) * 2

    gsap.to('.hero-title', {
      x: -x * 15,
      y: -y * 8,
      duration: 1.2,
      ease: 'power2.out',
    })

    gsap.to('.hero-tag', {
      x: -x * 8,
      y: -y * 4,
      duration: 1.2,
      ease: 'power2.out',
    })

    gsap.to('.hero-desc', {
      x: -x * 5,
      y: -y * 3,
      duration: 1.2,
      ease: 'power2.out',
    })
  })
}
