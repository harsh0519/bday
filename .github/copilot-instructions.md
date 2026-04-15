---
name: Birthday Website Instructions
description: Project-specific guidance for developing Sarah's interactive birthday website—a Next.js 16 SPA with GSAP animations, Three.js 3D graphics, and custom interactions.
---

# Birthday Website Development Guide

This is an interactive, cinematic birthday website for Sarah. It combines animations, a timeline of memories, gallery, and personalized messaging with rich visual effects.

## Project Overview

- **Type**: Single-page Next.js 16.2.3 application with Client Components
- **Purpose**: Immersive birthday experience with animations, 3D graphics, audio, and personalization
- **Key Technologies**: React 19, GSAP, Three.js, Framer Motion, Lenis, Howler

## Getting Started

### Build & Run Commands

```bash
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Production build
npm start         # Start production server
npm run lint      # Run ESLint
```

### Development

After `npm install` (dependencies already installed), run `npm run dev` and open http://localhost:3000.

## Architecture & Patterns

### Core Structure

```
app/
  layout.tsx                    # Root layout (fonts, metadata)
  page.tsx                      # Main orchestrator (Lenis setup, section sequencing)
  config.ts                     # Centralized config (name, memories, music URL)
  components/
    sections/                   # Full-screen presentation sections
      IntroSection.tsx          # Hero + 3D star field + name reveal
      TimelineSection.tsx       # Horizontal scroll memory cards
      StarsSection.tsx          # Love reasons display
      GallerySection.tsx        # Polaroid-style photos
      LoveLetterSection.tsx     # Personalized love letter
      WishSection.tsx           # Birthday message
      index.ts                  # Barrel exports
    ui/                         # Reusable interactive components
      SectionWrapper.tsx        # Consistent section layout
      AudioPlayer.tsx           # Music control with vinyl animation
      CustomCursor.tsx          # Trailing heart cursor effect
      PageProgress.tsx          # Scroll progress indicator
      DebugPanel.tsx            # Dev metrics (scroll position, section)
      index.ts                  # Barrel exports
  lib/
    gsap.ts                     # GSAP + ScrollTrigger config
    three-scene.ts              # Three.js utilities (stars, particles)
    confetti.ts                 # Particle effects
```

### Component Conventions

**Sections** (`app/components/sections/`):
- Exported as named functions: `export function SectionName() { ... }`
- Always wrapped in `<SectionWrapper>` for consistent styling
- All use `'use client'` directive
- Minimum height: `min-h-screen`
- Background: `bg-[#0a0008]` (dark purple-black)
- Text gradient: `linear-gradient(120deg, #ff6b9d, #ffd700)` with `backgroundClip: 'text'`
- Setup/cleanup in `useEffect` with `useRef` for DOM access

**UI Components** (`app/components/ui/`):
- Reusable, composable building blocks
- Use Framer Motion for micro-interactions
- Three.js canvas rendering requires proper cleanup on unmount
- Follow naming: PascalCase for components

**Configuration** (`app/config.ts`):
- All user-specific data (name, memories, photos, music URL) lives here
- Typed interfaces (`Memory`, `Photo`, etc.)
- Sections conditionally render based on config presence—add data to enable features

### Color Palette (Fixed)

Use these consistently across designs:
- Primary pink: `#ff6b9d`
- Gold accent: `#ffd700`
- Dark background: `#0a0008`
- Tailwind arbitrary values: `from-[#ff6b9d]`, `to-[#ffd700]`, `bg-[#0a0008]`

## Animation Libraries

### GSAP (lib/gsap.ts)

GSAP is pre-configured with ScrollTrigger and other plugins. Import from centralized config:

```typescript
import { gsap, ScrollTrigger } from '@/lib/gsap';

// Example: scroll-driven animation
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.to('.element', {
      scrollTrigger: {
        trigger: '.element',
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
      },
      duration: 2,
      opacity: 1,
    });
  });
  return () => ctx.revert();
}, []);
```

**Key Patterns**:
- Use `gsap.context()` for scoped animations (auto-cleanup on component unmount)
- ScrollTrigger connects to Lenis—always use relative values (`start: 'top center'`, etc.)
- Text animations: `gsap.to(element, { text: 'new text', duration: 1.5 })`

### Three.js (lib/three-scene.ts)

Three.js is used for 3D graphics (star fields, particle systems). Utility functions available in `lib/three-scene.ts`.

```typescript
import * as THREE from 'three';

// Example: setting up a scene
useEffect(() => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  
  // Create geometry and add to scene
  const stars = createStarField(200); // utility from lib/three-scene.ts
  scene.add(stars);
  
  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };
  animate();
  
  // Cleanup
  return () => {
    renderer.dispose();
    geometry.dispose();
    material.dispose();
  };
}, []);
```

**Gotchas**:
- Always dispose of geometries, materials, and renderers in cleanup
- Handle window resize with `camera.aspect = w / h; camera.updateProjectionMatrix()`
- Canvas alpha transparency: `alpha: true` in WebGLRenderer

### Framer Motion

Used for UI animations (card flips, button hovers, reveals):

```typescript
<motion.div
  initial={{ x: 100, opacity: 0 }}
  whileInView={{ x: 0, opacity: 1 }}
  whileHover={{ scale: 1.05 }}
  transition={{ type: 'spring', stiffness: 100 }}
>
  Content
</motion.div>
```

### Lenis (Smooth Scroll)

Lenis is initialized once in `page.tsx` and overrides default browser scrolling. **Do not initialize in components**—it's a page-level singleton.

```typescript
// In page.tsx
const lenis = new Lenis({ duration: 1.2, easing: ... });
lenis.on('scroll', () => ScrollTrigger.update());
// RAF loop updates Lenis and ScrollTrigger together
```

### Audio (react-howler + Howler)

Background music via `<AudioPlayer>`:

```typescript
<Howl>
  {
    src: ['/path/to/music.mp3'],
    loop: true,
    volume: 0.5,
    format: ['mp3'],
  }
</Howl>
```

## Important: Next.js 16.2.3 Breaking Changes

Per [AGENTS.md](AGENTS.md): This is **NOT** the standard Next.js you may know. This version has breaking changes in APIs, conventions, and file structure.

**Always check** `node_modules/next/dist/docs/` before using unfamiliar APIs or patterns. Reference:
- [Next.js 16 Migration Guide](https://nextjs.org/docs/upgrading)
- Official release notes for 16.2.3

Common differences from earlier versions:
- App Router is stable; Pages Router deprecated
- `next/font` has evolved
- CSP header handling changed
- Dynamic imports may behave differently

## Development Tips

### Debug Panel

A `<DebugPanel>` component shows real-time metrics:
- Current scroll position
- Active section name
- Section bounding boxes

Enable it in the UI during development to understand scroll behavior and GSAP triggers.

### Custom Cursor

`<CustomCursor>` adds trailing heart effects. Disables default cursor via CSS. Keep font sizes in mind when positioning—hearts trail based on mouse position.

### Adding New Sections

1. Create a new component in `app/components/sections/`
2. Export as named function, use `'use client'`
3. Wrap in `<SectionWrapper>`
4. Add to barrel export `app/components/sections/index.ts`
5. Import and add to `page.tsx`
6. (Optional) Add config data to `app/config.ts` to conditionally render

### Common Amendments

**Adding memories**: Update `memoryCards` array in `app/config.ts` with `Memory` type objects.

**Adding photos**: Update `photos` array in `app/config.ts` with `Photo` type objects.

**Changing music**: Update `musicUrl` in `app/config.ts`.

**Adjusting animation timing**: GSAP durations and Lenis easing in respective `lib/` files and component effects.

## Caveats

- **Client-only**: Every interactive section uses `'use client'`—no SSR. Hydration mismatches are unlikely but test on initial load.
- **Canvas rendering**: Three.js canvases require window dimensions; use refs and useEffect for setup.
- **Memory management**: Always dispose Three.js resources in cleanup; remove GSAP contexts to avoid memory leaks.
- **Scroll conflicts**: Lenis overrides default scroll—ScrollTrigger is aware of it, but custom scroll listeners may conflict.
- **CSP headers**: Content Security Policy allows `'unsafe-eval'` for GSAP/Three.js. Keep this in production config.

## Useful Paths & References

- **Config**: [app/config.ts](app/config.ts)
- **Sections**: [app/components/sections/](app/components/sections/)
- **UI Components**: [app/components/ui/](app/components/ui/)
- **GSAP Setup**: [app/lib/gsap.ts](app/lib/gsap.ts)
- **Three.js Utilities**: [app/lib/three-scene.ts](app/lib/three-scene.ts)
- **Main Page**: [app/page.tsx](app/page.tsx)
- **Warning (Next.js 16)**: [AGENTS.md](AGENTS.md)

## Next Steps

Once you're familiar with the structure:
1. Review `app/config.ts` to see available customization options
2. Open `app/page.tsx` to understand section sequencing
3. Explore one section (e.g., `IntroSection.tsx`) to see animation patterns
4. Try running `npm run dev` and interact with the animations in browser DevTools
