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
    'hero.tag': 'Studio de Création Digitale — 2026',
    'hero.title': '<span class="hero-line">Nous créons</span><span class="hero-line">des <span class="text-stroke">expériences</span></span><span class="hero-line">digitales qui <span class="text-accent">comptent</span></span>',
    'hero.desc': 'Sites immersifs · Applications natives · Solutions IA sur mesure. Chaque pixel est intentionnel.',
    'hero.cta': 'Démarrer un projet',

    // Marquee 1
    'marquee1.1': 'WEB DESIGN',
    'marquee1.2': 'APPS NATIVES',
    'marquee1.3': 'INTELLIGENCE ARTIFICIELLE',
    'marquee1.4': 'DÉVELOPPEMENT CUSTOM',
    'marquee1.5': 'UX / UI DESIGN',
    'marquee1.6': 'ROBOTIQUE & FIRMWARE',
    'marquee1.7': 'BASES DE DONNÉES',
    'marquee1.8': 'IA LOCALE',

    // Services
    'services.tag': '(01) — Services',
    'services.title': 'Nos expertises',
    'services.desc': 'De la conception à la livraison, des solutions taillées pour impressionner et performer.',
    'services.explore': 'Explorer',

    's1.title': 'Web Design<br/>& Développement',
    's1.desc': 'Sites web immersifs, sur mesure. UI/UX premium, animations GSAP/WebGL, performances optimales. Chaque pixel est intentionnel.',
    's2.title': 'Applications<br/>Natives Android',
    's2.desc': "Apps performantes et intuitives. De la conception au déploiement Play Store, architecture moderne, zéro compromis sur l'expérience.",
    's3.title': 'IA &<br/>Automatisation',
    's3.desc': "Chatbots intelligents, automatisation de processus, analyse prédictive. L'IA au service de votre croissance, intégrée nativement.",
    's4.title': 'Développement<br/>Sur Mesure',
    's4.desc': 'APIs robustes, architectures scalables, features complexes. Code propre, performant, maintenable. Du backend au DevOps.',
    's5.title': 'Bases de Données<br/>Custom',
    's5.desc': "Conception d'architectures de données sur mesure. Modélisation, optimisation, migrations et administration de bases SQL & NoSQL.",
    's6.title': 'Robotique<br/>Firmware & Software',
    's6.desc': 'Développement firmware embarqué et logiciels de contrôle. Du microcontrôleur au robot complet, électronique et code fusionnés.',
    's7.title': 'IA Locale<br/>& On-Premise',
    's7.desc': 'Déploiement de modèles IA en local. Inférence privée, fine-tuning, LLMs on-premise. Vos données restent chez vous.',
    's8.title': 'Installation<br/>Multi-OS',
    's8.desc': 'Installation et configuration Linux, dual-boot, serveurs. Arch, Debian, Ubuntu, NixOS — environnements optimisés et sécurisés.',

    // Work
    'work.tag': '(02) — Projets',
    'work.title': 'Projets<br/>sélectionnés',
    'work.desc': 'Chaque projet est une collaboration unique. Voici quelques réalisations dont nous sommes fiers.',
    'work.viewAll': 'Voir tout',
    'work.featured': 'En vedette',
    'work.p1.cat': 'Web Design',
    'work.p1.type': 'E-commerce immersif avec expérience 3D interactive',
    'work.p2.cat': 'App Native',
    'work.p2.type': 'App Android — Visualisation 3D temps réel',
    'work.p3.cat': 'IA & Data',
    'work.p3.type': 'Dashboard analytics prédictif propulsé par IA',
    'work.p4.cat': 'Web Design',
    'work.p4.type': 'Site vitrine luxe — WebGL & Motion Design immersif',

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
    'hero.tag': 'Digital Craft Studio — 2026',
    'hero.title': '<span class="hero-line">We craft</span><span class="hero-line">digital <span class="text-stroke">experiences</span></span><span class="hero-line">that <span class="text-accent">matter</span></span>',
    'hero.desc': 'Immersive websites · Native apps · Bespoke AI solutions. Every pixel is intentional.',
    'hero.cta': 'Start a project',

    // Marquee 1
    'marquee1.1': 'WEB DESIGN',
    'marquee1.2': 'NATIVE APPS',
    'marquee1.3': 'ARTIFICIAL INTELLIGENCE',
    'marquee1.4': 'CUSTOM DEVELOPMENT',
    'marquee1.5': 'UX / UI DESIGN',
    'marquee1.6': 'ROBOTICS & FIRMWARE',
    'marquee1.7': 'DATABASES',
    'marquee1.8': 'LOCAL AI',

    // Services
    'services.tag': '(01) — Services',
    'services.title': 'Our expertise',
    'services.desc': 'From concept to delivery, solutions crafted to impress and perform.',
    'services.explore': 'Explore',

    's1.title': 'Web Design<br/>& Development',
    's1.desc': 'Immersive, bespoke websites. Premium UI/UX, GSAP/WebGL animations, optimal performance. Every pixel is intentional.',
    's2.title': 'Native Android<br/>Applications',
    's2.desc': 'Performant and intuitive apps. From design to Play Store deployment, modern architecture, zero compromise on experience.',
    's3.title': 'AI &<br/>Automation',
    's3.desc': 'Intelligent chatbots, process automation, predictive analytics. AI at the service of your growth, natively integrated.',
    's4.title': 'Custom<br/>Development',
    's4.desc': 'Robust APIs, scalable architectures, complex features. Clean, performant, maintainable code. From backend to DevOps.',
    's5.title': 'Custom Database<br/>Architecture',
    's5.desc': 'Bespoke data architecture design. Modeling, optimization, migrations and administration of SQL & NoSQL databases.',
    's6.title': 'Robotics<br/>Firmware & Software',
    's6.desc': 'Embedded firmware and control software development. From microcontrollers to complete robots, electronics and code merged.',
    's7.title': 'Local AI<br/>& On-Premise',
    's7.desc': 'On-premise AI model deployment. Private inference, fine-tuning, on-premise LLMs. Your data stays with you.',
    's8.title': 'Multi-OS<br/>Installation',
    's8.desc': 'Linux installation and setup, dual-boot, servers. Arch, Debian, Ubuntu, NixOS — optimized and secured environments.',

    // Work
    'work.tag': '(02) — Work',
    'work.title': 'Selected<br/>projects',
    'work.desc': "Each project is a unique collaboration. Here are some achievements we're proud of.",
    'work.viewAll': 'View all',
    'work.featured': 'Featured',
    'work.p1.cat': 'Web Design',
    'work.p1.type': 'Immersive e-commerce with interactive 3D experience',
    'work.p2.cat': 'Native App',
    'work.p2.type': 'Android App — Real-time 3D visualization',
    'work.p3.cat': 'AI & Data',
    'work.p3.type': 'AI-powered predictive analytics dashboard',
    'work.p4.cat': 'Web Design',
    'work.p4.type': 'Luxury showcase — Immersive WebGL & Motion Design',

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
