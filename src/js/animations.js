/* ============================================
   IRKEEDIA — Animations Module
   All scroll-triggered & entrance animations
   ============================================ */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger)

// ─── HERO ENTRANCE ──────────────────────────────
export function heroEntrance() {
  const h1 = document.querySelector('.hero-title h1')
  if (!h1) return

  const split = new SplitType(h1, { types: 'chars' })

  const tl = gsap.timeline({ delay: 0.2 })

  // Chars reveal
  tl.from(split.chars, {
    yPercent: 120,
    opacity: 0,
    rotateX: -40,
    stagger: 0.02,
    duration: 1,
    ease: 'power4.out',
  })

  // Tag reveal
  .from('.reveal-inner', {
    yPercent: 100,
    duration: 0.8,
    ease: 'power3.out',
  }, '-=0.5')

  // Description + CTA
  .to('.hero-desc .reveal-up', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
  }, '-=0.4')

  .to('.hero-cta .reveal-up', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
  }, '-=0.5')

  // Scroll indicator
  .from('.hero-scroll-indicator', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power2.out',
  }, '-=0.3')

  return tl
}

// ─── TEXT SPLIT ANIMATIONS ──────────────────────
export function initTextAnimations() {
  // [data-split] — char-by-char reveal on scroll
  const splitEls = document.querySelectorAll('[data-split]')
  splitEls.forEach((el) => {
    // Skip hero h1  
    if (el.closest('.hero-title')) return

    const split = new SplitType(el, { types: 'chars' })
    gsap.from(split.chars, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      yPercent: 100,
      opacity: 0,
      stagger: 0.015,
      duration: 0.8,
      ease: 'power3.out',
    })
  })

  // [data-split-words] — word opacity scrub
  const wordEls = document.querySelectorAll('[data-split-words]')
  wordEls.forEach((el) => {
    const split = new SplitType(el, { types: 'words' })
    split.words.forEach((word) => {
      gsap.set(word, { opacity: 0.15 })
    })
    gsap.to(split.words, {
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        end: 'bottom 30%',
        scrub: 0.5,
      },
      opacity: 1,
      stagger: 0.1,
      ease: 'none',
    })
  })

  // .reveal-up elements
  const reveals = document.querySelectorAll('.reveal-up')
  reveals.forEach((el) => {
    if (el.closest('.hero')) return
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    })
  })
}

// ─── 3D SERVICE CARDS (scroll-driven deformation) ───
export function initServices3D() {
  const cards = document.querySelectorAll('.s3d-card')
  if (!cards.length) return

  // Skip on mobile
  if (window.innerWidth < 768) {
    cards.forEach((card) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 60,
        duration: 0.8,
        ease: 'power3.out',
      })
    })
    return
  }

  cards.forEach((card, i) => {
    const inner = card.querySelector('.s3d-card-inner')
    const visual = card.querySelector('.s3d-card-visual')
    const content = card.querySelector('.s3d-card-content')
    const glow = card.querySelector('.s3d-card-glow')
    const isEven = i % 2 === 1

    // === Scroll-driven 3D transform ===
    // Cards start rotated/scaled and flatten as they enter viewport
    gsap.fromTo(card, {
      rotateX: 12,
      rotateY: isEven ? -8 : 8,
      scale: 0.88,
      opacity: 0,
      y: 120,
    }, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      opacity: 1,
      y: 0,
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        end: 'top 35%',
        scrub: 0.8,
      },
      ease: 'none',
    })

    // === Exit: card deforms as it leaves top ===
    gsap.to(card, {
      rotateX: -8,
      scale: 0.92,
      opacity: 0.3,
      scrollTrigger: {
        trigger: card,
        start: 'bottom 30%',
        end: 'bottom -10%',
        scrub: 0.5,
      },
    })

    // === Visual parallax inside card ===
    if (visual) {
      gsap.fromTo(visual, {
        scale: 1.15,
      }, {
        scale: 1,
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      })
    }

    // === Content stagger reveal ===
    if (content) {
      const children = content.children
      gsap.from(children, {
        scrollTrigger: {
          trigger: card,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 30,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power3.out',
      })
    }

    // === Animated glow rotation ===
    if (glow) {
      let angle = 0
      ScrollTrigger.create({
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          angle = (self.progress * 360 + i * 90) % 360
          glow.style.setProperty('--glow-angle', `${angle}deg`)
        },
      })
    }

    // === Mouse 3D tilt on hover ===
    inner.addEventListener('mousemove', (e) => {
      const rect = inner.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5

      gsap.to(card, {
        rotateY: x * 8,
        rotateX: -y * 5,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    })

    inner.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
        overwrite: 'auto',
      })
    })
  })
}

// ─── MARQUEE ────────────────────────────────────
export function initMarquee() {
  const marquees = document.querySelectorAll('.marquee')

  marquees.forEach((marquee) => {
    const inner = marquee.querySelector('.marquee-inner')
    if (!inner) return

    const direction = marquee.getAttribute('data-direction') || 'left'
    const speed = parseFloat(marquee.getAttribute('data-speed')) || 1

    // Clone for seamless loop
    const clone = inner.cloneNode(true)
    marquee.appendChild(clone)

    const innerWidth = inner.scrollWidth
    const dur = innerWidth / (60 * speed)

    const xFrom = direction === 'left' ? 0 : -innerWidth
    const xTo = direction === 'left' ? -innerWidth : 0

    ;[inner, clone].forEach((el, i) => {
      gsap.fromTo(el, 
        { x: xFrom },
        {
          x: xTo,
          duration: dur,
          ease: 'none',
          repeat: -1,
        }
      )
    })

    // Scroll velocity skew
    ScrollTrigger.create({
      onUpdate: (self) => {
        const skew = self.getVelocity() / 400
        gsap.to([inner, clone], {
          skewX: Math.max(-4, Math.min(4, skew)),
          duration: 0.3,
          ease: 'power2.out',
        })
      },
    })
  })
}

// ─── PARALLAX ───────────────────────────────────
export function initParallax() {
  const elements = document.querySelectorAll('.parallax-element')
  elements.forEach((el) => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el.closest('.parallax-wrap') || el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
      },
      yPercent: -15,
      ease: 'none',
    })
  })
}

// ─── ANIMATED COUNTERS ──────────────────────────
export function initCounters() {
  const counters = document.querySelectorAll('[data-count]')
  counters.forEach((el) => {
    const target = parseInt(el.getAttribute('data-count'), 10)
    const numEl = el.querySelector('.stat-num')
    if (!numEl) return

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate() {
            numEl.textContent = Math.floor(this.targets()[0].val)
          },
        })
      },
    })
  })
}

// ─── WORK / PROJECT ANIMATIONS ──────────────────
export function initWorkAnimations() {
  const items = document.querySelectorAll('.work-item')

  items.forEach((item) => {
    const visual = item.querySelector('.work-item-visual')
    if (!visual) return

    // Clip-path reveal
    gsap.fromTo(visual, {
      clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
    }, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      duration: 1.2,
      ease: 'power4.out',
    })

    // Info fade in
    const info = item.querySelector('.work-item-info')
    if (info) {
      gsap.from(info, {
        scrollTrigger: {
          trigger: item,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.out',
      })
    }
  })

  // Scroll velocity skew
  ScrollTrigger.create({
    onUpdate: (self) => {
      const skew = self.getVelocity() / 600
      gsap.to(items, {
        skewY: Math.max(-2, Math.min(2, skew)),
        duration: 0.3,
        ease: 'power2.out',
      })
    },
  })
}

// ─── PROCESS STEPS ANIMATION ────────────────────
export function initProcessAnimations() {
  const steps = document.querySelectorAll('.process-step')

  steps.forEach((step, i) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 70%',
      end: 'bottom 30%',
      onEnter: () => step.classList.add('is-active'),
      onLeaveBack: () => {
        if (i > 0) step.classList.remove('is-active')
      },
    })

    // Stagger content reveal
    const content = step.querySelector('.process-step-content')
    const visual = step.querySelector('.process-step-visual')

    if (content) {
      gsap.from(content, {
        scrollTrigger: {
          trigger: step,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        x: -30,
        duration: 0.8,
        ease: 'power3.out',
      })
    }

    if (visual) {
      gsap.from(visual, {
        scrollTrigger: {
          trigger: step,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        delay: 0.2,
        ease: 'power3.out',
      })
    }
  })
}

// ─── SECTION REVEALS ────────────────────────────
export function initSectionReveals() {
  // Section tags slide-in
  document.querySelectorAll('.section-tag').forEach((tag) => {
    gsap.from(tag, {
      scrollTrigger: {
        trigger: tag,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      x: -20,
      duration: 0.6,
      ease: 'power3.out',
    })
  })

  // About image clip-path reveal
  const aboutImg = document.querySelector('.about-image-block')
  if (aboutImg) {
    gsap.fromTo(aboutImg, {
      clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
    }, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      scrollTrigger: {
        trigger: aboutImg,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
      duration: 1.4,
      ease: 'power4.out',
    })
  }

  // Contact section staggers
  const contactGrid = document.querySelector('.contact-grid')
  if (contactGrid) {
    gsap.from(contactGrid.children, {
      scrollTrigger: {
        trigger: contactGrid,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 40,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out',
    })
  }

  // Tech pills stagger
  const techPills = document.querySelectorAll('.tech-pill')
  if (techPills.length) {
    gsap.from(techPills, {
      scrollTrigger: {
        trigger: '.tech-orbit',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      scale: 0.8,
      stagger: 0.04,
      duration: 0.5,
      ease: 'back.out(1.5)',
    })
  }

  // Number blocks
  document.querySelectorAll('.number-block').forEach((block, i) => {
    gsap.from(block, {
      scrollTrigger: {
        trigger: block,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      x: -20,
      duration: 0.6,
      delay: i * 0.1,
      ease: 'power3.out',
    })
  })
}

// ─── FOOTER ANIMATION ───────────────────────────
export function initFooterAnimation() {
  const footer = document.querySelector('.footer')
  if (!footer) return

  gsap.from('.footer-bar', {
    scrollTrigger: {
      trigger: footer,
      start: 'top 90%',
      toggleActions: 'play none none none',
    },
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power3.out',
  })
}

// ─── INIT ALL ───────────────────────────────────
export function initAllAnimations() {
  initTextAnimations()
  initServices3D()
  initMarquee()
  initParallax()
  initCounters()
  initWorkAnimations()
  initProcessAnimations()
  initSectionReveals()
  initFooterAnimation()
}
