/* ============================================
   IRKEEDIA — i18n Module
   Full FR ↔ EN language switching
   ============================================ */

import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ─── TRANSLATIONS ───────────────────────────────
const translations = {
  fr: {
    // Nav
    'nav.status': 'Hub de projets digitaux',

    // Menu
    'menu.home': 'Accueil',
    'menu.services': 'Hub',
    'menu.work': 'Projets',
    'menu.process': 'Processus',
    'menu.about': 'À propos',
    'menu.contact': 'Contact',
    'menu.socials': 'Réseaux',
    'menu.contactLabel': 'Contact',
    'menu.locationLabel': 'Localisation',
    'menu.location': 'France — Disponible dans le monde entier',

    // Hero
    'hero.tag': 'Organisation IRKEEDIA — Hub 2026',
    'hero.title': '<span class="hero-line">IRKEEDIA, le</span><span class="hero-line">hub de nos <span class="text-stroke">apps</span></span><span class="hero-line">et <span class="text-accent">sites</span></span>',
    'hero.desc': 'Une vitrine simple et moderne pour explorer nos applications, sites web et projets IA en un seul endroit.',
    'hero.cta': 'Voir les projets',

    // Marquee 1
    'marquee1.1': 'APPLICATIONS',
    'marquee1.2': 'SITES WEB',
    'marquee1.3': 'PROJETS IA',
    'marquee1.4': 'OPEN SOURCE',
    'marquee1.5': 'OUTILS INTERNES',
    'marquee1.6': 'EXPÉRIMENTATIONS',

    // Services
    'services.tag': '(01) — Hub',
    'services.title': 'Ce que vous trouverez ici',
    'services.desc': 'Un accès rapide par catégories pour parcourir les projets IRKEEDIA sans friction.',
    'services.explore': 'Voir la catégorie',

    's1.title': 'Apps<br/>Mobiles & Desktop',
    's1.desc': 'Applications utiles et concrètes, pensées pour de vrais usages: offline, performance, expérience soignée.',
    's2.title': 'Sites Web<br/>& Interfaces',
    's2.desc': 'Sites vitrines, dashboards et interfaces modernes: rapides, lisibles, responsives et orientés utilisateur.',
    's3.title': 'IA, Agents<br/>& Automatisations',
    's3.desc': "Expérimentations IA et outils automatisés pour gagner du temps, structurer l'information et augmenter la productivité.",
    's4.title': 'Infra &<br/>Lab Technique',
    's4.desc': 'Un laboratoire technique pour hébergement, self-hosting, sécurité et déploiement de projets robustes.',

    // Work
    'work.tag': '(02) — Projets',
    'work.title': 'Projets<br/>sélectionnés',
    'work.desc': 'Une sélection de projets publiés dans le hub, avec leur contexte et les choix techniques principaux.',
    'work.viewAll': 'Parcourir le hub',
    'work.featured': 'En vedette',
    'work.p1.cat': 'Robotique & IA',
    'work.p1.type': 'Robot IA autonome — Raspberry Pi 5, Hailo 8L, vision, voix, personnalité',
    'work.p2.cat': 'App Hybride',
    'work.p2.type': 'Encyclopédie offline-first — Assistant IA Charlie + Chat P2P Bluetooth',
    'work.p3.cat': 'Self-Hosting',
    'work.p3.type': 'Serveur personnel et interface web — FastAPI, PWA, gestion multi-utilisateurs',
    'work.p4.cat': 'App Native',
    'work.p4.type': 'Lecteur musical Android élégant pour créations Suno AI — Flutter',

    // Process
    'process.tag': '(03) — Parcours',
    'process.title': 'Comment<br/>lire le hub',
    'process.s1.title': 'Explorer',
    'process.s1.desc': 'Parcourez les catégories pour identifier rapidement les projets qui vous intéressent.',
    'process.s2.title': 'Comprendre',
    'process.s2.desc': 'Chaque fiche explique le contexte, les choix techniques et la stack utilisée.',
    'process.s3.title': 'Approfondir',
    'process.s3.desc': 'Accédez aux détails des réalisations: architecture, fonctionnalités clés et pistes d\'évolution.',
    'process.s4.title': 'Échanger',
    'process.s4.desc': 'Un projet vous parle ? Contactez-nous pour discuter, partager des idées ou collaborer.',

    // Marquee 2
    'marquee2.1': 'CLARTÉ',
    'marquee2.2': 'SIMPLICITÉ',
    'marquee2.3': 'MODERNITÉ',
    'marquee2.4': 'UTILITÉ',

    // About
    'about.tag': '(04) — À propos',
    'about.title': 'Qui nous<br/>sommes',
    'about.manifesto': "IRKEEDIA est une organisation orientée création: on conçoit, on teste, on publie, puis on partage les résultats de manière transparente.",
    'about.p1': "Ce site n'est pas une boutique: c'est un hub de présentation de nos apps, sites web et expériences techniques.",
    'about.p2': 'Objectif: centraliser les projets, montrer la démarche et offrir une navigation claire pour découvrir rapidement ce que nous construisons.',
    'about.stat1': 'Projets présentés',
    'about.stat2': 'Stacks utilisées',
    'about.stat3': "Années d'évolution",
    'about.est': 'Est. 2023',
    'about.techLabel': 'Stack Technique',

    // Contact
    'contact.tag': '(05) — Contact',
    'contact.title': 'Un retour,<br/>une idée ?',
    'contact.intro': "Tu veux échanger autour d'un projet du hub, proposer une collaboration ou juste discuter tech ? Écris-nous.",
    'contact.name': 'Votre nom',
    'contact.email': 'Votre email',
    'contact.subject': 'Sujet du projet',
    'contact.message': 'Votre message',
    'contact.send': 'Envoyer',

    // Footer
    'footer.rights': 'Tous droits réservés',

    // Meta
    'meta.title': 'IRKEEDIA — Hub de projets digitaux',
    'meta.description': 'Hub IRKEEDIA: présentation d\'applications, sites web et projets IA. Une vitrine moderne, simple et claire.',
  },

  en: {
    // Nav
    'nav.status': 'Digital projects hub',

    // Menu
    'menu.home': 'Home',
    'menu.services': 'Hub',
    'menu.work': 'Work',
    'menu.process': 'Process',
    'menu.about': 'About',
    'menu.contact': 'Contact',
    'menu.socials': 'Socials',
    'menu.contactLabel': 'Contact',
    'menu.locationLabel': 'Location',
    'menu.location': 'France — Remote Worldwide',

    // Hero
    'hero.tag': 'IRKEEDIA Organization — Hub 2026',
    'hero.title': '<span class="hero-line">IRKEEDIA, a</span><span class="hero-line">hub for our <span class="text-stroke">apps</span></span><span class="hero-line">and <span class="text-accent">websites</span></span>',
    'hero.desc': 'A clean and modern showcase to explore our apps, websites and AI projects in one place.',
    'hero.cta': 'Browse projects',

    // Marquee 1
    'marquee1.1': 'APPLICATIONS',
    'marquee1.2': 'WEBSITES',
    'marquee1.3': 'AI PROJECTS',
    'marquee1.4': 'OPEN SOURCE',
    'marquee1.5': 'INTERNAL TOOLS',
    'marquee1.6': 'EXPERIMENTS',

    // Services
    'services.tag': '(01) — Hub',
    'services.title': 'What you will find here',
    'services.desc': 'Quick category access to navigate IRKEEDIA projects with a simple flow.',
    'services.explore': 'View category',

    's1.title': 'Mobile & Desktop<br/>Apps',
    's1.desc': 'Useful apps built for real-world usage: offline support, performance and polished user experience.',
    's2.title': 'Websites<br/>& Interfaces',
    's2.desc': 'Modern websites, dashboards and interfaces: fast, readable, responsive and user-focused.',
    's3.title': 'AI, Agents<br/>& Automation',
    's3.desc': 'AI experiments and automation tools to save time, structure knowledge and improve productivity.',
    's4.title': 'Infra &<br/>Tech Lab',
    's4.desc': 'A technical lab around hosting, self-hosting, security and robust project deployment.',

    // Work
    'work.tag': '(02) — Work',
    'work.title': 'Selected<br/>projects',
    'work.desc': 'A curated set of projects from the hub, with context and key technical decisions.',
    'work.viewAll': 'Browse the hub',
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
    'process.tag': '(03) — Journey',
    'process.title': 'How to<br/>use the hub',
    'process.s1.title': 'Explore',
    'process.s1.desc': 'Browse categories to quickly find the projects that match your interests.',
    'process.s2.title': 'Understand',
    'process.s2.desc': 'Each page explains context, technical choices and stack used.',
    'process.s3.title': 'Go deeper',
    'process.s3.desc': 'Open project details for architecture, key features and evolution ideas.',
    'process.s4.title': 'Connect',
    'process.s4.desc': 'If a project resonates with you, reach out to discuss ideas or collaboration.',

    // Marquee 2
    'marquee2.1': 'CLARITY',
    'marquee2.2': 'SIMPLICITY',
    'marquee2.3': 'MODERN',
    'marquee2.4': 'USEFUL',

    // About
    'about.tag': '(04) — About',
    'about.title': 'Who we<br/>are',
    'about.manifesto': 'IRKEEDIA is a creation-focused organization: we build, test, publish, then share outcomes transparently.',
    'about.p1': 'This website is not a storefront. It is a hub that presents our apps, websites and technical experiments.',
    'about.p2': 'Goal: centralize projects, explain the approach and make exploration clear and effortless.',
    'about.stat1': 'Projects showcased',
    'about.stat2': 'Stacks in use',
    'about.stat3': 'Years evolving',
    'about.est': 'Est. 2023',
    'about.techLabel': 'Tech Stack',

    // Contact
    'contact.tag': '(05) — Contact',
    'contact.title': 'Feedback or<br/>an idea?',
    'contact.intro': 'Want to discuss a project from the hub, suggest a collaboration, or just talk tech? Reach out.',
    'contact.name': 'Your name',
    'contact.email': 'Your email',
    'contact.subject': 'Project subject',
    'contact.message': 'Your message',
    'contact.send': 'Send',

    // Footer
    'footer.rights': 'All rights reserved',

    // Meta
    'meta.title': 'IRKEEDIA — Digital project hub',
    'meta.description': 'IRKEEDIA hub: showcase of applications, websites and AI projects. Modern, simple and clear.',
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

  // Always apply to keep content consistent with translations source
  applyTranslations(currentLang)
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
