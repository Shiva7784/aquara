# 🌊 AQUARA — Into the Deep | Cinematic Underwater Web Experience

[![Next.js](https://img.shields.io/badge/Next.js-16.3-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?style=for-the-badge&logo=greensock&logoColor=black)](https://greensock.com/gsap/)
[![Lenis](https://img.shields.io/badge/Lenis_Scroll-1.3-8B5CF6?style=for-the-badge)](https://lenis.darkroom.engineering/)

A luxury, interactive 6-chapter scroll-bound underwater web experience. Built with **Next.js 16 (App Router)**, **GSAP ScrollTrigger**, **Lenis Inertial Scroll**, and frame-synced **HTML5 video playback**.

---

## 🌟 Key Features

* **🎥 Frame-Synced Scroll Video**: Dynamic canvas-free video playback perfectly pinned to the user's scroll progress (`useScrollVideo` hook with smooth interpolation).
* **📖 6 Interactive Story Chapters**:
  1. `01 — THE DEEP`: Atmospheric hero entrance with glowing title typography.
  2. `02 — THE REVEAL`: Fluid transition introducing performance narrative elements.
  3. `03 — MOVEMENT`: Editorial grid showcasing fluid underwater choreography.
  4. `04 — THE RUINS`: Sunken architectural depth with bioluminescent caustics.
  5. `05 — DESCENT`: Deep abyssal zoom effect into dark ocean trenches.
  6. `06 — THE SURFACE`: Serene finale CTA with smooth return-to-surface interaction.
* **✨ Dynamic Ocean Shaders & Effects**: Custom React canvas overlays including **Film Grain**, **Vignette**, **Bioluminescent Water Particles**, and **Dynamic Light Rays**.
* **📱 Responsive & Mobile Optimized**: Multi-device video assets (`underwater-desktop.mp4` & `underwater-mobile.mp4`) with adaptive breakpoints.
* **⚡ Ultra-Performance Architecture**: Zero dead code, full static pre-rendering, hardware-accelerated CSS transforms, and reduced-motion fallbacks.

---

## 🛠️ Tech Stack & Dependencies

* **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
* **Library**: [React 19](https://react.dev/)
* **Language**: [TypeScript 5](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Animation & Scroll Engine**:
  * [GSAP (GreenSock)](https://greensock.com/gsap/) + `ScrollTrigger`
  * [Lenis Smooth Scroll](https://lenis.darkroom.engineering/)
* **Icons**: [Lucide React](https://lucide.dev/)

---

## 📁 Project Architecture

```
aquara/
├── public/
│   ├── icon.svg                     # Custom AQUARA ocean favicon
│   ├── images/
│   │   ├── caustics-bg.png          # Bioluminescent caustic texture
│   │   └── editorial-mermaid.png    # Chapter 03 editorial artwork
│   └── videos/
│       ├── underwater-desktop.mp4   # 4K desktop scroll video
│       ├── underwater-mobile.mp4    # Optimized mobile vertical video
│       └── underwater-poster.jpg    # Video fallback poster
├── src/
│   ├── app/
│   │   ├── globals.css              # Global styles & design system
│   │   ├── icon.svg                 # App Router favicon
│   │   ├── layout.tsx               # Root layout & OpenGraph metadata
│   │   └── page.tsx                 # Single page application entry
│   ├── components/
│   │   ├── chapters/                # 6 Cinematic Scroll Chapters
│   │   │   ├── HeroChapter.tsx
│   │   │   ├── RevealChapter.tsx
│   │   │   ├── MovementChapter.tsx
│   │   │   ├── StoryChapter.tsx
│   │   │   ├── DescentChapter.tsx
│   │   │   └── FinalChapter.tsx
│   │   ├── cinematic/               # Video Core & Pinned Experience
│   │   │   ├── ChapterProgress.tsx
│   │   │   ├── CinematicExperience.tsx
│   │   │   └── CinematicVideo.tsx
│   │   ├── effects/                 # Visual Canvas Effects
│   │   │   ├── FilmGrain.tsx
│   │   │   ├── LightRays.tsx
│   │   │   ├── Vignette.tsx
│   │   │   └── WaterParticles.tsx
│   │   ├── navigation/              # Navigation Bar & Menu
│   │   │   ├── MenuButton.tsx
│   │   │   └── Navbar.tsx
│   │   └── ui/                      # Micro UX Components
│   │       ├── MagneticButton.tsx
│   │       ├── ScrollIndicator.tsx
│   │       └── SectionLabel.tsx
│   ├── hooks/
│   │   ├── useLenis.ts              # Smooth scroll controller
│   │   ├── useMediaQuery.ts         # Breakpoint listener
│   │   ├── useReducedMotion.ts      # Accessibility check
│   │   └── useScrollVideo.ts        # Scroll-to-video timeline sync
│   ├── lib/
│   │   ├── constants.ts             # Chapter configurations
│   │   ├── gsap.ts                  # GSAP plugin initialization
│   │   └── video.ts                 # Video helper utilities
│   └── types/
│       └── cinematic.ts             # TypeScript interfaces
└── next.config.ts                   # Next.js optimization config
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js 18.x** or higher installed.

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/aquara.git
cd aquara
npm install
```

### 3. Development Server
Run the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build
To create an optimized production build:

```bash
npm run build
npm run start
```

---

## ⚡ Performance Optimizations

* **Canvas-Free Video Syncing**: Uses direct `requestAnimationFrame` video scrubbing avoiding WebGL overhead while maintaining 60 FPS scrolling.
* **Selective Preloading**: Media is loaded asynchronously with poster image fallback.
* **Layout Isolation**: Layered `z-index` stacking preventing unnecessary re-renders during high-speed scrolling.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Crafted with passion for cinematic web experiences. 🌊
</p>
