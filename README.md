# ◈ IRKEEDIA — Digital Craft Studio

> Studio de création digitale — IA Locale, Robotique, Infrastructure On-Premise & Développement Sur Mesure.

![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-0.170-000000?logo=threedotjs&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?logo=greensock&logoColor=white)
![Lenis](https://img.shields.io/badge/Lenis-1.1-111111)
![License](https://img.shields.io/badge/License-Proprietary-red)

---

## ✦ Aperçu

Site vitrine immersif pour **IRKEEDIA**, conçu avec une ambition [Awwwards](https://www.awwwards.com/). L'expérience repose sur une **scène 3D plein écran pilotée par le scroll** : la caméra voyage à travers un tunnel futuriste pendant que l'utilisateur défile le contenu. Chaque interaction, animation et pixel est pensé pour offrir une expérience premium.

---

## ✦ Scroll-Driven 3D Experience

Le cœur visuel du site est une scène Three.js en plein écran qui réagit au scroll de la page. Inspiré des sites récompensés aux Awwwards, l'utilisateur traverse un univers 3D immersif tout en consultant le contenu.

### Architecture de la scène 3D

| Élément | Description | Détails techniques |
|---------|-------------|-------------------|
| **Tunnel lumineux** | Anneaux concentriques colorés (vert accent / violet / magenta) disposés le long de l'axe Z | `RingGeometry` avec opacité pulsée selon la proximité caméra. Jusqu'à 40 segments + 16 lignes longitudinales avec wobble sinusoïdal |
| **Trajectoire caméra** | Spline Catmull-Rom à 12 points de contrôle, la caméra suit le chemin au scroll | `CatmullRomCurve3` avec lookAt en avance de 2%, roll dynamique basé sur la tangente + oscillation subtile |
| **Particules GLSL** | Champ de 2000 particules (mode ULTRA) avec shaders custom | Vertex shader : mouvement spiralé + déplacement Z au scroll. Fragment shader : points circulaires soft avec `smoothstep`. Blending additif |
| **Objets géométriques flottants** | Icosaèdres, octaèdres, tétraèdres, torus, torus knots, cubes en wireframe | Shader Fresnel custom avec glow pulsé, distorsion vertex temporelle, rotation multi-axes et flottement sinusoïdal |
| **Grille sol** | Plan de grille perspective style Tron/cyberpunk à Y=-6 | Lignes X/Z avec opacité dégressive vers les bords. Lignes croisées optionnelles (ULTRA/HIGH) |
| **Faisceaux d'énergie** | Spirales lumineuses traversant le tunnel | Lignes hélicoïdales à 4 tours complets, rotation lente opposée, opacité sinusoïdale |
| **Marqueurs de section** | Portails toroïdaux positionnés aux sections du site | `TorusGeometry`, s'illuminent quand la caméra passe à proximité (< 20 unités) |
| **Éclairage dynamique** | Points lumineux le long du chemin avec couleur HSL cyclique | Intensité oscillante × opacité globale, teinte qui évolue dans le temps |
| **Parallaxe souris** | La caméra se décale sub­tilement selon la position du curseur | Offset X ± 0.8, offset Y ± 0.4 avec interpolation lerp à 5% |
| **Fog volumétrique** | Brouillard de scène pour la profondeur | `THREE.Fog` adaptative (near=5, far=30→80 selon qualité) |

### Shaders GLSL Custom

**Glow Shader (objets flottants)** :
- Vertex : distorsion sinusoïdale sur la normale
- Fragment : effet Fresnel (dot product viewDir/normal), pulse temporel, atténuation distance

**Particle Shader** :
- Vertex : mouvement spiralé (`sin`/`cos` × speed), décalage Z modulaire au scroll, atténuation taille par distance
- Fragment : disque circulaire souple (`smoothstep` radial), alpha × distance

### Système de Qualité Adaptative (5 niveaux)

Le moteur 3D ajuste automatiquement la complexité de la scène selon les capacités de la machine :

```
ULTRA → HIGH → MEDIUM → LOW → MINIMAL → (masquage gracieux)
```

| Paramètre | ULTRA | HIGH | MEDIUM | LOW | MINIMAL |
|-----------|-------|------|--------|-----|---------|
| Particules | 2000 | 1200 | 600 | 300 | 120 |
| Segments tunnel | 40 | 30 | 20 | 12 | 8 |
| Lignes tunnel | 16 | 12 | 8 | 6 | 4 |
| Objets flottants | 20 | 14 | 8 | 4 | 2 |
| Faisceaux | 6 | 4 | 3 | 2 | 1 |
| Détail anneaux | 64 | 32 | 24 | 16 | 12 |
| Pixel Ratio | 2x | 1.5x | 1x | 1x | 1x |
| Antialiasing | ✅ | ✅ | ❌ | ❌ | ❌ |
| Grille croisée | ✅ | ✅ | ❌ | ❌ | ❌ |
| Torus Knots | ✅ | ✅ | ❌ | ❌ | ❌ |
| Lumières | 5 | 3 | 2 | 1 | 1 |
| Frame Skip | ×1 | ×1 | ×1 | ×2 | ×3 |

### Détection automatique du hardware

Au démarrage, le système analyse :

1. **GPU** via `WEBGL_debug_renderer_info` — détecte Intel HD/UHD, Mesa, LLVMPipe, SwiftShader, Adreno 4/5, Mali-T/G5, PowerVR
2. **CPU** via `navigator.hardwareConcurrency` — nombre de cœurs
3. **RAM** via `navigator.deviceMemory` — mémoire disponible
4. **Mobile** via viewport width + détection tactile
5. **`failIfMajorPerformanceCaveat`** — refuse l'init si le navigateur utilise du rendu software

### Mécanismes de protection performance

| Mécanisme | Description |
|-----------|-------------|
| **PerfMonitor** | Classe dédiée, analyse le FPS réel toutes les 3 secondes |
| **Auto-downgrade** | Si FPS < 35, descend d'un niveau (max 3 downgrades en cascade) |
| **Frame Skipping** | En LOW : rendu 1 frame/2. En MINIMAL : 1 frame/3, avec compensation temporelle |
| **IntersectionObserver** | Stoppe le rendu si le canvas sort du viewport |
| **Page Visibility** | `visibilitychange` suspend le rendu en onglet background, reset le compteur FPS au retour |
| **Dispose GPU** | Chaque objet/matériau supprimé libère proprement la mémoire GPU (`geometry.dispose()`, `material.dispose()`) |
| **Masquage gracieux** | Si même MINIMAL lag → fade-out CSS sur 1s puis `display: none` et `cancelAnimationFrame` |
| **Bail-out précoce** | Mobile ≤ 2 cœurs + ≤ 2 Go RAM → la 3D ne s'initialise pas |

---

## ✦ Fonctionnalités principales

- **Scroll 3D immersif** — Scène Three.js plein écran avec caméra pilotée par le scroll via CatmullRom spline
- **WebGL Particle System** — Champ de particules interactif (Canvas 2D + shaders) dans le hero avec répulsion souris
- **Sections semi-transparentes** — Glass morphism sur les sections pour laisser transparaître la scène 3D en arrière-plan
- **Animations 3D au scroll** — Cartes services avec déformation perspective, tilt souris et glow animé (GSAP + ScrollTrigger)
- **Smooth Scroll** — Lenis pour un défilement fluide synchronisé avec GSAP
- **Liquid Fill Buttons** — Remplissage directionnel depuis le point d'entrée du curseur
- **Curseur custom** — Dot instantané + follower avec lerp, modes magnétiques et mode "View" pour les projets
- **Preloader animé** — Split curtain avec compteur et timeline GSAP
- **i18n FR/EN** — Switch de langue complet avec persistance `localStorage`
- **Text Split Animations** — Reveal par caractère/mot au scroll (SplitType)
- **Indicateurs 3D** — Barre de progression verticale, dots de navigation par section, label de section flottant
- **Responsive** — Adapté desktop, tablette, mobile. 3D désactivée proprement sur petits écrans

---

## ✦ Stack technique

| Catégorie | Technologies |
|-----------|-------------|
| **Bundler** | Vite 6.x |
| **3D / WebGL** | Three.js, GLSL Shaders custom (Fresnel, particules) |
| **Animations** | GSAP 3.12, ScrollTrigger |
| **Scroll** | Lenis |
| **Texte** | SplitType |
| **Fonts** | Syne (display), Space Grotesk (body), JetBrains Mono (mono) |
| **Langage** | Vanilla JS (ES Modules), aucun framework |
| **Tone Mapping** | ACES Filmic (Three.js) |

---

## ✦ Structure du projet

```
├── index.html                      # Page principale avec scène 3D intégrée
├── orion.html                      # Projet — Robot IA ORION V5
├── survival-codex.html             # Projet — Encyclopédie offline-first
├── nexusnas.html                   # Projet — Serveur NAS privé
├── suno-player.html                # Projet — Lecteur musical Suno AI
├── service-ia-locale.html          # Service — IA Locale & On-Premise
├── service-robotique.html          # Service — Robotique & IA Embarquée
├── service-logiciels-ia.html       # Service — Logiciels IA Sur Mesure
├── service-infrastructure.html     # Service — Infrastructure & Sécurité
├── mentions-legales.html           # Mentions légales
├── package.json
├── vite.config.js
├── vercel.json
└── src/
    ├── main.js                     # Point d'entrée — boot sequence + 3D UI
    ├── project-init.js             # Init des pages projets/services
    ├── styles/
    │   ├── main.css                # Styles complets (variables, responsive, 3D overlay)
    │   ├── project.css             # Styles pages projets
    │   └── cookies.css             # Bandeau cookies
    └── js/
        ├── core.js                 # Smooth scroll (Lenis), preloader, curseur, nav, magnétique
        ├── animations.js           # Scroll animations, services 3D cards, marquees, parallax
        ├── scroll-3d.js            # ★ Scène Three.js — tunnel 3D scroll-driven + qualité adaptive
        ├── webgl.js                # Système de particules Canvas 2D (hero)
        ├── liquid-button.js        # Boutons à remplissage directionnel
        ├── wave.js                 # Vague procédurale footer (canvas)
        ├── i18n.js                 # Système de traduction FR ↔ EN
        └── cookies.js              # Consentement cookies RGPD
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

Le site sera disponible sur `http://localhost:3000`.

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
| 01 | IA Locale & On-Premise | Ollama, LLaMA, vLLM, PyTorch, GGUF |
| 02 | Robotique & IA Embarquée | C/C++, Rust, ROS, Hailo, Raspberry Pi |
| 03 | Logiciels IA Sur Mesure | Python, LangChain, RAG, FastAPI, Vector DB |
| 04 | Infrastructure & Sécurité | Linux, Docker, Proxmox, WireGuard, NixOS |

---

## ✦ Projets en vitrine

| Projet | Type | Stack |
|--------|------|-------|
| **ORION V5** | Robot IA autonome | Python, Flask, Hailo 8L, Ollama, Arduino |
| **Survival Codex** | Encyclopédie offline-first | App hybride, IA Charlie, Chat P2P Bluetooth |
| **NexusNAS** | Serveur de stockage privé | FastAPI, PWA, multi-utilisateurs |
| **Suno Player** | Lecteur musical Android | Flutter, Dart, just_audio |

---

## ✦ Palette & Design tokens

```
Background:    #050505
Elevated:      #0c0c0c
Card:          #111111
Surface:       #1a1a1a
Accent:        #c8ff00
Accent dim:    #a3d600
Text:          #f0f0f0
Text muted:    #555555
Border:        rgba(255,255,255,0.06)
```

**Couleurs 3D :**
```
Primary:     #c8ff00  (vert accent)
Secondary:   #6b21a8  (violet)
Tertiary:    #e040fb  (magenta)
Grid:        #1a1a2e  (bleu sombre)
Fog / BG:    #050505
```

**Fonts :** Syne (display) · Space Grotesk (body) · JetBrains Mono (mono)

---

## ✦ Architecture technique détaillée

### Boot Sequence (`main.js`)

```
1. initWebGL()          → Particules Canvas 2D dans le hero
2. initScroll3D()       → Scène Three.js plein écran (tunnel, particules GLSL, objets 3D)
3. initScroll3DUI()     → Barre de progression, dots de navigation, label de section
4. await initPreloader() → Compteur 0→100, split curtain, attente chargement
5. initSmoothScroll()   → Lenis + synchronisation GSAP ticker
6. heroEntrance()       → Reveal caractère par caractère, tag, desc, CTA
7. initCursor()         → Dot + follower avec modes hover
8. initNav()            → Scroll direction detection, menu overlay
9. initMagnetic()       → Effet magnétique sur les éléments interactifs
10. initHeroParallax()  → Parallaxe du hero au scroll
11. initLiquidButtons() → Remplissage directionnel au hover
12. initI18n()          → FR/EN avec localStorage
13. initAllAnimations() → Text splits, services 3D, marquees, counters, parallax, reveals
14. initWave()          → Canvas edge du footer
15. initCookies()       → Bandeau RGPD
```

### Render Pipeline 3D (par frame)

```
1. PerfMonitor.tick()           → Mesure FPS, downgrade si < 35
2. Frame skip check             → Saute des frames en LOW/MINIMAL
3. Visibility check             → IntersectionObserver + opacity > 0.01
4. Scroll interpolation         → Lerp 5% vers la cible ScrollTrigger
5. Mouse interpolation          → Lerp 5% vers la position curseur
6. Camera path update           → Position sur spline + parallaxe souris + roll
7. Tunnel rings update          → Rotation + opacité par proximité caméra
8. Floating objects update      → Rotation multi-axes + flottement + shader uniforms
9. Particles update             → uTime + uScrollProgress dans les shaders
10. Beams update                → Rotation lente + opacité pulsée
11. Section markers update      → Opacité par proximité + rotation
12. Point lights update         → Intensité oscillante + couleur HSL cyclique
13. Grid visibility             → On/off selon globalOpacity
14. renderer.render()           → Draw call Three.js
```

---

## ✦ Auteur

**IRKEEDIA** — [hello@irkeedia.com](mailto:hello@irkeedia.com)

---

<p align="center">
  <sub>◈ Crafted with precision — Every pixel is intentional.</sub>
</p>
