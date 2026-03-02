# ◈ IRKEEDIA — Digital Craft Studio

> Studio de création digitale — Web Design, Apps Natives, IA, Robotique & Développement Sur Mesure.

![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-0.170-000000?logo=threedotjs&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?logo=greensock&logoColor=white)
![License](https://img.shields.io/badge/License-Proprietary-red)

---

## ✦ Aperçu

Site vitrine immersif pour **IRKEEDIA**, conçu pour candidater aux [Awwwards](https://www.awwwards.com/). Chaque interaction, animation et pixel est pensé pour offrir une expérience premium.

### Fonctionnalités clés

- **WebGL Particle System** — Champ de particules interactif (Three.js + GLSL shaders custom) avec répulsion souris en view space
- **Animations 3D au scroll** — Cartes services avec déformation perspective, tilt souris et glow animé (GSAP + ScrollTrigger)
- **Smooth Scroll** — Lenis pour un défilement fluide synchronisé avec GSAP
- **Liquid Fill Buttons** — Remplissage directionnel depuis le point d'entrée du curseur
- **Curseur custom** — Dot instantané + follower avec lerp, modes magnétiques
- **Preloader animé** — Split curtain avec compteur et timeline GSAP
- **i18n FR/EN** — Switch de langue complet avec persistance localStorage
- **Text Split Animations** — Reveal par caractère/mot au scroll (SplitType)
- **Responsive** — Adapté desktop, tablette, mobile

---

## ✦ Stack technique

| Catégorie | Technologies |
|-----------|-------------|
| **Bundler** | Vite 6.x |
| **3D / WebGL** | Three.js, GLSL Shaders |
| **Animations** | GSAP 3.12, ScrollTrigger |
| **Scroll** | Lenis |
| **Texte** | SplitType |
| **Fonts** | Syne, Space Grotesk, JetBrains Mono |
| **Langage** | Vanilla JS (ES Modules) |

---

## ✦ Structure du projet

```
├── index.html              # Page unique (SPA)
├── package.json
├── vite.config.js
└── src/
    ├── main.js              # Point d'entrée — boot sequence
    ├── styles/
    │   └── main.css         # Styles complets (variables, responsive)
    └── js/
        ├── core.js          # Smooth scroll, preloader, curseur, nav, magnétique
        ├── animations.js    # Scroll animations, services 3D, marquees, parallax
        ├── webgl.js         # Three.js particle system + GLSL shaders
        ├── liquid-button.js # Boutons à remplissage directionnel
        └── i18n.js          # Système de traduction FR ↔ EN
```

---

## ✦ Démarrage rapide

```bash
# Cloner le repo
git clone https://github.com/Irkeedia/site-irkeedia.git
cd site-irkeedia

# Installer les dépendances
npm install

# Lancer le serveur de dev
npm run dev
```

Le site sera disponible sur `http://localhost:3000` (ou le prochain port disponible).

---

## ✦ Build production

```bash
npm run build
npm run preview
```

Les fichiers optimisés seront générés dans le dossier `dist/`.

---

## ✦ Services présentés

| # | Service | Stack |
|---|---------|-------|
| 01 | Web Design & Développement | React, Next.js, GSAP, Three.js, Tailwind |
| 02 | Applications Natives Android | Kotlin, Jetpack Compose, Firebase, Material 3 |
| 03 | IA & Automatisation | OpenAI, LangChain, Python, RAG, Vector DB |
| 04 | Développement Sur Mesure | Node.js, PostgreSQL, Docker, AWS, GraphQL |
| 05 | Bases de Données Custom | PostgreSQL, MongoDB, Redis, MySQL, Supabase |
| 06 | Robotique Firmware & Software | C/C++, Rust, Arduino, ESP32, ROS |
| 07 | IA Locale & On-Premise | Ollama, LLaMA, GGUF, vLLM, PyTorch |
| 08 | Installation Multi-OS | Arch Linux, Debian, NixOS, Bash, Docker |

---

## ✦ Palette & Design tokens

```
Background:  #050505
Accent:      #c8ff00
Text:        #e8e8e8
Card BG:     #111111
Border:      rgba(255,255,255,0.06)
```

**Fonts:** Syne (display) · Space Grotesk (body) · JetBrains Mono (mono)

---

## ✦ Auteur

**IRKEEDIA** — [hello@irkeedia.com](mailto:hello@irkeedia.com)

---

<p align="center">
  <sub>◈ Crafted with precision — Every pixel is intentional.</sub>
</p>
