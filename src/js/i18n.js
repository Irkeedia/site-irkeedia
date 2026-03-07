/* ============================================
   IRKEEDIA — i18n Module
   Full FR ↔ EN language switching
   ============================================ */

import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ─── TRANSLATIONS ───────────────────────────────
const translations = {
  fr: {
    // Nav
    'nav.status': 'Disponible pour nouveaux projets',

    // Menu
    'menu.home': 'Accueil',
    'menu.services': 'Services',
    'menu.work': 'Projets',
    'menu.process': 'Processus',
    'menu.about': 'À propos',
    'menu.contact': 'Contact',
    'menu.socials': 'Réseaux',
    'menu.contactLabel': 'Contact',
    'menu.locationLabel': 'Localisation',
    'menu.location': 'France — Disponible dans le monde entier',

    // Hero
    'hero.tag': 'IA Locale & Robotique — 2026',
    'hero.title': '<span class="hero-line">Vos données</span><span class="hero-line">restent <span class="text-stroke">chez vous</span></span><span class="hero-line">l\'IA en <span class="text-accent">local</span></span>',
    'hero.desc': 'Intégration d\'IA locale · Robotique · Serveurs on-premise. Souveraineté totale sur vos données.',
    'hero.cta': 'Démarrer un projet',

    // Marquee 1
    'marquee1.1': 'IA LOCALE',
    'marquee1.2': 'ROBOTIQUE',
    'marquee1.3': 'PROTECTION DES DONNÉES',
    'marquee1.4': 'SERVEURS ON-PREMISE',
    'marquee1.5': 'LLMs PRIVÉS',
    'marquee1.6': 'IA EMBARQUÉE',

    // Services
    'services.tag': '(01) — Services',
    'services.title': 'Nos expertises',
    'services.desc': 'L\'intelligence artificielle au service de votre entreprise, sans compromis sur la confidentialité.',
    'services.explore': 'Explorer',

    's1.title': 'IA Locale<br/>& On-Premise',
    's1.desc': 'Déploiement de modèles IA directement dans vos locaux. Inférence privée, fine-tuning, LLMs on-premise. Vos données ne sortent jamais de votre réseau.',
    's2.title': 'Robotique<br/>& IA Embarquée',
    's2.desc': 'Robots intelligents avec IA embarquée. Vision, voix, navigation autonome. Du microcontrôleur au système complet, hardware et software fusionnés.',
    's3.title': 'Logiciels IA<br/>Sur Mesure',
    's3.desc': "Applications métier propulsées par l'IA locale. Médical, industrie, logistique — automatisation intelligente adaptée à votre secteur, sans cloud externe.",
    's4.title': 'Infrastructure<br/>& Sécurité',
    's4.desc': 'Serveurs bare-metal, NAS, clusters GPU. Architecture réseau souveraine, chiffrement, zéro dépendance cloud. Vos données sous votre contrôle total.',

    // Work
    'work.tag': '(02) — Projets',
    'work.title': 'Projets<br/>sélectionnés',
    'work.desc': 'Chaque projet est une collaboration unique. Voici quelques réalisations dont nous sommes fiers.',
    'work.viewAll': 'Voir tout',
    'work.featured': 'En vedette',
    'work.p1.cat': 'Robotique & IA',
    'work.p1.type': 'Robot IA autonome — Raspberry Pi 5, Hailo 8L, vision, voix, personnalité',
    'work.p2.cat': 'App Hybride',
    'work.p2.type': 'Encyclopédie offline-first — Assistant IA Charlie + Chat P2P Bluetooth',
    'work.p3.cat': 'Self-Hosting',
    'work.p3.type': 'Serveur de stockage réseau privé — FastAPI, PWA, multi-utilisateurs',
    'work.p4.cat': 'App Native',
    'work.p4.type': 'Lecteur musical Android élégant pour créations Suno AI — Flutter',

    // Process
    'process.tag': '(03) — Processus',
    'process.title': 'Notre<br/>méthode',
    'process.s1.title': 'Découverte',
    'process.s1.desc': 'Analyse approfondie de vos besoins, objectifs business et de votre audience. Audit technique et créatif.',
    'process.s2.title': 'Design',
    'process.s2.desc': 'Wireframes, prototypes interactifs, design system complet. Chaque détail est pensé et validé avec vous.',
    'process.s3.title': 'Développement',
    'process.s3.desc': 'Code propre et performant, animations fluides, tests rigoureux. On construit pour durer.',
    'process.s4.title': 'Lancement',
    'process.s4.desc': 'Déploiement optimisé, monitoring, accompagnement post-lancement. Votre succès est notre priorité.',

    // Marquee 2
    'marquee2.1': 'CRÉATIVITÉ',
    'marquee2.2': 'INNOVATION',
    'marquee2.3': 'PERFORMANCE',
    'marquee2.4': 'EXCELLENCE',

    // About
    'about.tag': '(04) — À propos',
    'about.title': 'Qui nous<br/>sommes',
    'about.manifesto': "Nous croyons que le digital est un art. Chaque projet est une œuvre unique, façonnée avec précision, passion et une obsession du détail.",
    'about.p1': "IRKEEDIA est un studio de création digitale fondé sur la conviction que chaque pixel compte. Spécialisés dans les expériences web haut de gamme, les applications natives Android et les solutions d'intelligence artificielle.",
    'about.p2': 'Notre approche fusionne expertise technique de pointe et vision créative audacieuse pour délivrer des projets qui impressionnent, convertissent et perdurent.',
    'about.stat1': 'Projets livrés',
    'about.stat2': 'Clients satisfaits',
    'about.stat3': "Ans d'expertise",
    'about.est': 'Est. 2023',
    'about.techLabel': 'Stack Technique',

    // Contact
    'contact.tag': '(05) — Contact',
    'contact.title': 'Parlons de<br/>votre projet',
    'contact.intro': "Vous avez un projet ambitieux ? Une idée qui mérite d'être sublimée ? Discutons-en.",
    'contact.name': 'Votre nom',
    'contact.email': 'Votre email',
    'contact.subject': 'Sujet du projet',
    'contact.message': 'Votre message',
    'contact.send': 'Envoyer',

    // Footer
    'footer.rights': 'Tous droits réservés',

    // Meta
    'meta.title': 'IRKEEDIA — Studio de Création Digitale',
    'meta.description': 'Studio de création digitale — Web Design, Apps Natives, IA & Développement Sur Mesure',
  },

  en: {
    // Nav
    'nav.status': 'Available for new projects',

    // Menu
    'menu.home': 'Home',
    'menu.services': 'Services',
    'menu.work': 'Work',
    'menu.process': 'Process',
    'menu.about': 'About',
    'menu.contact': 'Contact',
    'menu.socials': 'Socials',
    'menu.contactLabel': 'Contact',
    'menu.locationLabel': 'Location',
    'menu.location': 'France — Remote Worldwide',

    // Hero
    'hero.tag': 'Local AI & Robotics — 2026',
    'hero.title': '<span class="hero-line">Your data</span><span class="hero-line">stays <span class="text-stroke">with you</span></span><span class="hero-line">AI runs <span class="text-accent">locally</span></span>',
    'hero.desc': 'Local AI integration · Robotics · On-premise servers. Total sovereignty over your data.',
    'hero.cta': 'Start a project',

    // Marquee 1
    'marquee1.1': 'LOCAL AI',
    'marquee1.2': 'ROBOTICS',
    'marquee1.3': 'DATA PROTECTION',
    'marquee1.4': 'ON-PREMISE SERVERS',
    'marquee1.5': 'PRIVATE LLMs',
    'marquee1.6': 'EMBEDDED AI',

    // Services
    'services.tag': '(01) — Services',
    'services.title': 'Our expertise',
    'services.desc': 'Artificial intelligence serving your business, with zero compromise on privacy.',
    'services.explore': 'Explore',

    's1.title': 'Local AI<br/>& On-Premise',
    's1.desc': 'AI model deployment directly in your premises. Private inference, fine-tuning, on-premise LLMs. Your data never leaves your network.',
    's2.title': 'Robotics<br/>& Embedded AI',
    's2.desc': 'Intelligent robots with embedded AI. Vision, voice, autonomous navigation. From microcontroller to full system, hardware and software merged.',
    's3.title': 'Custom AI<br/>Software',
    's3.desc': 'Business applications powered by local AI. Medical, industrial, logistics — intelligent automation tailored to your sector, no external cloud.',
    's4.title': 'Infrastructure<br/>& Security',
    's4.desc': 'Bare-metal servers, NAS, GPU clusters. Sovereign network architecture, encryption, zero cloud dependency. Your data under your total control.',

    // Work
    'work.tag': '(02) — Work',
    'work.title': 'Selected<br/>projects',
    'work.desc': "Each project is a unique collaboration. Here are some achievements we're proud of.",
    'work.viewAll': 'View all',
    'work.featured': 'Featured',
    'work.p1.cat': 'Robotics & AI',
    'work.p1.type': 'Autonomous AI robot — Raspberry Pi 5, Hailo 8L, vision, voice, personality',
    'work.p2.cat': 'Hybrid App',
    'work.p2.type': 'Offline-first encyclopedia — Charlie AI assistant + Bluetooth P2P chat',
    'work.p3.cat': 'Self-Hosting',
    'work.p3.type': 'Private NAS server — FastAPI, PWA, multi-user',
    'work.p4.cat': 'Native App',
    'work.p4.type': 'Elegant Android music player for Suno AI creations — Flutter',

    // Process
    'process.tag': '(03) — Process',
    'process.title': 'Our<br/>method',
    'process.s1.title': 'Discovery',
    'process.s1.desc': 'In-depth analysis of your needs, business goals and audience. Technical and creative audit.',
    'process.s2.title': 'Design',
    'process.s2.desc': 'Wireframes, interactive prototypes, complete design system. Every detail is thought through and validated with you.',
    'process.s3.title': 'Develop',
    'process.s3.desc': 'Clean, performant code, fluid animations, rigorous testing. We build to last.',
    'process.s4.title': 'Launch',
    'process.s4.desc': 'Optimized deployment, monitoring, post-launch support. Your success is our priority.',

    // Marquee 2
    'marquee2.1': 'CREATIVITY',
    'marquee2.2': 'INNOVATION',
    'marquee2.3': 'PERFORMANCE',
    'marquee2.4': 'EXCELLENCE',

    // About
    'about.tag': '(04) — About',
    'about.title': 'Who we<br/>are',
    'about.manifesto': 'We believe digital is an art. Each project is a unique piece, shaped with precision, passion and an obsession for detail.',
    'about.p1': 'IRKEEDIA is a digital craft studio founded on the belief that every pixel counts. Specialized in high-end web experiences, native Android apps and artificial intelligence solutions.',
    'about.p2': 'Our approach merges cutting-edge technical expertise with bold creative vision to deliver projects that impress, convert and endure.',
    'about.stat1': 'Projects delivered',
    'about.stat2': 'Happy clients',
    'about.stat3': 'Years of expertise',
    'about.est': 'Est. 2023',
    'about.techLabel': 'Tech Stack',

    // Contact
    'contact.tag': '(05) — Contact',
    'contact.title': "Let's talk about<br/>your project",
    'contact.intro': "Got an ambitious project? An idea worth elevating? Let's discuss.",
    'contact.name': 'Your name',
    'contact.email': 'Your email',
    'contact.subject': 'Project subject',
    'contact.message': 'Your message',
    'contact.send': 'Send',

    // Footer
    'footer.rights': 'All rights reserved',

    // Meta
    'meta.title': 'IRKEEDIA — Digital Craft Studio',
    'meta.description': 'Digital craft studio — Web Design, Native Apps, AI & Custom Development',
  },
}

// ─── STATE ──────────────────────────────────────
let currentLang = 'fr'

export function getCurrentLang() {
  return currentLang
}

// ─── APPLY TRANSLATIONS ────────────────────────
function applyTranslations(lang) {
  const t = translations[lang]
  if (!t) return

  // Update <html lang>
  document.documentElement.lang = lang

  // Update document title & meta
  document.title = t['meta.title']
  const metaDesc = document.querySelector('meta[name="description"]')
  if (metaDesc) metaDesc.content = t['meta.description']

  // Simple text content swaps
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n')
    if (t[key] !== undefined) el.textContent = t[key]
  })

  // HTML content swaps (preserves inner markup like <br/>, <span>)
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.getAttribute('data-i18n-html')
    if (t[key] !== undefined) el.innerHTML = t[key]
  })

  // Cursor text on work items
  document.querySelectorAll('[data-cursor-text]').forEach((el) => {
    const cursorKey = el.getAttribute('data-i18n-cursor')
    if (cursorKey && t[cursorKey] !== undefined) {
      el.setAttribute('data-cursor-text', t[cursorKey])
    }
  })

  // Refresh ScrollTrigger positions (text length may change layout)
  setTimeout(() => ScrollTrigger.refresh(), 100)
}

// ─── TOGGLE UI ──────────────────────────────────
function updateToggleUI(lang) {
  document.querySelectorAll('.lang-option').forEach((el) => {
    el.classList.toggle(
      'lang-option--active',
      el.getAttribute('data-lang') === lang
    )
  })
}

// ─── SWITCH LANGUAGE ────────────────────────────
export function switchLang(lang) {
  if (lang === currentLang) return
  if (!translations[lang]) return

  currentLang = lang
  localStorage.setItem('irkeedia-lang', lang)

  applyTranslations(lang)
  updateToggleUI(lang)
}

// ─── INIT ───────────────────────────────────────
export function initI18n() {
  // Load saved preference
  currentLang = localStorage.getItem('irkeedia-lang') || 'fr'

  // Apply if not default FR (HTML is authored in FR)
  if (currentLang !== 'fr') {
    applyTranslations(currentLang)
  }
  updateToggleUI(currentLang)

  // Toggle click handler
  const toggle = document.getElementById('lang-toggle')
  if (toggle) {
    toggle.addEventListener('click', (e) => {
      const option = e.target.closest('.lang-option')
      if (option) {
        switchLang(option.getAttribute('data-lang'))
        return
      }
      // Click anywhere on toggle → swap
      switchLang(currentLang === 'fr' ? 'en' : 'fr')
    })

    // Keyboard support
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        switchLang(currentLang === 'fr' ? 'en' : 'fr')
      }
    })
  }
}
