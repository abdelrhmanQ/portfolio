# Portfolio Rebuild — Documentation

## Overview

The portfolio was rebuilt from a single static `index.html` / `style.css` / `main.js` into a **Vite + React 19 + TypeScript** application with a lazy-loaded **react-three-fiber** 3D globe intro, a site-wide **Liquid Glass** (glassmorphism) theme driven entirely by CSS variables, and data-driven 3D-tilt project cards. All original copy, images, and links are preserved; only structure and styling changed. The old files are kept untouched in `legacy/` for reference.

**Commands:** `npm run dev` (dev server), `npm run build` (type-check + production build), `npm run preview` (serve the build).

---

## Project structure

```
├── index.html                     Vite entry — fonts + #root, loads src/main.tsx
├── package.json                   Scripts + dependencies
├── vite.config.ts                 Vite config: React plugin, Tailwind v4 plugin, "@" → ./src alias
├── tsconfig.json                  Strict TypeScript, bundler resolution, "@/*" paths
├── components.json                shadcn configuration (components live in /components/ui)
├── DOCUMENTATION.md               This file
├── legacy/                        The original static site, untouched (backup)
├── public/
│   └── me1.png me2.png …          Original images (referenced as "/me1.png" etc.)
└── src/
    ├── main.tsx                   React entry point
    ├── App.tsx                    Top-level state machine: intro → entering → entered
    ├── styles/
    │   ├── theme.css              ALL Liquid Glass design tokens (single source of truth)
    │   └── globals.css            Tailwind import + base styles + all component CSS
    ├── lib/utils.ts               cn() class-merge helper (shadcn convention)
    ├── data/projects.ts           Project interface + PROJECTS array (the only place projects live)
    ├── hooks/
    │   ├── usePrefersReducedMotion.ts   Live media-query hook
    │   └── useActiveSection.ts          IntersectionObserver → active nav link
    └── components/
        ├── GlobeIntro/            Feature 1 — 3D globe entry screen
        │   ├── GlobeIntro.tsx     State machine + overlay + keyboard/skip handling
        │   ├── GlobeScene.tsx     The <Canvas>: lights, code globe, stars, atmosphere, camera
        │   ├── CodeGlobe.tsx      Rotating "planet of code" (procedural canvas texture)
        │   ├── PointerParallax.tsx  Damped pointer-follow tilt for the globe group
        │   ├── Atmosphere.tsx     Additive fresnel rim-glow shader
        │   ├── Starfield.tsx      3 parallax point-cloud layers (reference component, rebuilt in WebGL)
        │   ├── CameraRig.tsx      The zoom-in dolly animation
        │   ├── IntroFallback.tsx  CSS-only loader while the 3D bundle downloads
        │   └── constants.ts       Every tuning knob (speeds, durations, radii, star counts)
        ├── ProjectCard/           Feature 3 — 3D tilt glass cards
        │   ├── ProjectCard.tsx    Memoised, data-driven card
        │   └── useTilt.ts         rAF-throttled pointer-tilt hook
        ├── ui/                    shadcn-convention shared components
        │   ├── cosmic-overlay.tsx Horizon glow + staggered title (reference component, DOM part)
        │   ├── spotlight-background.tsx  Drifting light beams behind the glass (framer-motion)
        │   └── reveal.tsx         Scroll-into-view entrance wrapper
        ├── Cursor/Cursor.tsx      Custom dot + lagging-ring cursor
        ├── layout/                Navbar.tsx, Footer.tsx
        └── sections/              Hero.tsx, Pointing.tsx, Projects.tsx, About.tsx, Contact.tsx
```

---

## Every component/function, per file

### `src/App.tsx`
- **`App()`** — owns the single piece of global state: `phase: 'intro' | 'entering' | 'entered'`.
  - Renders `<GlobeIntro>` (via `React.lazy` + `<Suspense fallback={<IntroFallback/>}>`) while phase ≠ `entered`; renders the portfolio while phase ≠ `intro`. During `entering` both exist → cross-fade.
  - Props passed down: `onTransitionStart` (→ `entering`, mounts portfolio beneath the fading overlay) and `onEnter` (→ `entered`, unmounts the intro and releases all Three.js resources).
  - Side effects: toggles `body.no-scroll` while the intro is up.
  - Why lazy: three.js + r3f are ~870 kB minified; the initial JS payload stays at ~240 kB.

### `src/components/GlobeIntro/GlobeIntro.tsx`
- **`GlobeIntro({ onTransitionStart, onEnter })`** — full-screen entry overlay with the internal state machine `idle → zooming → transitioning → done`.
  - `activate()` — on click/tap/Enter/Space. Reduced motion skips straight to `transitioning` (no zoom, fade only).
  - `beginTransition()` — enters `transitioning` (adds the `--leaving` class → CSS opacity fade) and calls `onTransitionStart`. Fired mid-zoom by the camera rig, by the skip button, or directly under reduced motion.
  - `finish()` — guarded by a ref so it runs once; sets `done` and calls `onEnter`. Triggered by the root's `transitionend` (opacity), with a `setTimeout` fallback in case the event never fires.
  - Accessibility: root is `role="button"`, auto-focused on mount, and a separate visible "Skip intro" button — keyboard users are never trapped.

### `src/components/GlobeIntro/GlobeScene.tsx`
- **`GlobeScene({ phase, reducedMotion, onZoomFadePoint })`** — the r3f `<Canvas>` (dpr capped at 1.75 for mid-range devices) containing lights, `<Starfield>`, `<CodeGlobe>`, `<Atmosphere>`, `<CameraRig>`. R3F auto-disposes declarative scene objects when the canvas unmounts.

### `src/components/GlobeIntro/CodeGlobe.tsx`
- **`createCodeTexture()`** — paints a 2048×1024 offscreen canvas with randomly assembled code tokens from `CODE_TOKENS` (violet keywords, cyan strings, blue calls, amber numbers, dim punctuation — colours mirror theme.css) over a deep-indigo vertical gradient (`SURFACE_GRADIENT`), and wraps it as a `THREE.CanvasTexture`. "Active" rows (`BRIGHT_LINE_CHANCE`) get a faint highlight bar plus a `shadowBlur` glow, like the focused line in an editor. No image download — generated at mount.
- **`CodeGlobe({ paused })`** — the sphere itself, slow ambient spin via `useFrame` (`rotation.y += SPEED * delta`, frame-rate independent); `paused` freezes it under reduced motion. The texture doubles as an **emissive map** (`emissiveIntensity 0.55`) so the code stays readable on the unlit side.
  - Side effects: texture is memoised once per mount and **disposed on unmount** (manually created, so manually released).

### `src/components/GlobeIntro/Atmosphere.tsx`
- **`Atmosphere()`** — slightly larger sphere with a custom `ShaderMaterial`: back-side, additive-blended fresnel rim. The opaque earth depth-occludes the centre, leaving only the silhouette halo. Material is memoised and disposed on unmount.

### `src/components/GlobeIntro/Starfield.tsx`
- **`createStarPositions(count)`** — random points in a spherical shell (18–46 units), returned as a `Float32Array`. Computed **once** per mount inside `useMemo` — the reference component's "regenerate random `box-shadow`s on every mount" problem is gone.
- **`StarLayer({ config, paused })`** — one `THREE.Points` cloud; rotates at its layer's own speed in `useFrame`. Geometry + material disposed on unmount.
- **`Starfield({ paused })`** — renders the three layers from `STAR_LAYERS`; different speeds/sizes = the parallax-depth effect, but inside the same WebGL scene as the globe.

### `src/components/GlobeIntro/CameraRig.tsx`
- **`easeInOutCubic(t)`** — easing for the dolly (nothing linear).
- **`CameraRig({ phase, onZoomFadePoint })`** — advances a progress ref by `delta / ZOOM_DURATION_S` each frame and lerps `camera.position.z` from 7 → 2.15. Fires `onZoomFadePoint` exactly once at 50% progress so the cross-fade overlaps the end of the dolly. Guarded so the skip/reduced-motion path (which never starts a zoom) doesn't move the camera. Renders `null`.

### `src/components/GlobeIntro/PointerParallax.tsx`
- **`PointerParallax({ disabled, children })`** — wraps the globe + atmosphere in a group that tilts gently (±0.07 rad) toward the pointer using `THREE.MathUtils.damp` (frame-rate-independent smoothing). Reads R3F's built-in normalized pointer inside the existing frame loop — no extra event listeners. `disabled` (reduced motion) leaves the group static.

### `src/components/GlobeIntro/IntroFallback.tsx`
- **`IntroFallback()`** — pulsing CSS orb + "loading…" label; shown by `<Suspense>` while the 3D chunk downloads. Zero WebGL cost.

### `src/components/GlobeIntro/constants.ts`
- All named constants: globe radius/segments/rotation speed/tilt, code-texture dimensions/font metrics, camera start/end/FOV, zoom duration, fade duration, fade start fraction, atmosphere scale/colour, `STAR_LAYERS` configs, starfield shell radii. Change behaviour here, not in components.

### `src/components/ui/cosmic-overlay.tsx`
- **`CosmicOverlay({ title, subtitle, hint, hidden })`** — the DOM half of the cosmic reference component: bottom horizon glow (two radial gradients in theme colours) + per-word staggered title reveal (each word gets `animation-delay: 0.4s + i * 0.12s`; the keyframe animates opacity, translateY, blur and letter-spacing). `pointer-events: none` so clicks reach the intro's enter handler; `hidden` fades it during the zoom. Words are split in `useMemo`.

### `src/components/ui/spotlight-background.tsx`
- **`Spotlight({ className, ...motionProps })`** — one drifting light beam (`motion.div`); size/colour/position come from the `.spotlight--*` CSS classes (theme-token radial gradients, `mix-blend-mode: screen`).
- **`SpotlightBackground({ children })`** — fixed, pointer-events-none overlay with three beams (blue/violet/cyan) drifting on 14/17/20 s mirrored ease-in-out loops (framer-motion), plus a `z-index: 1` content wrapper. Because the site's panels use `backdrop-filter`, the moving light refracts through the glass. Uses framer-motion's `useReducedMotion` — beams render static when reduced motion is set. Wraps the whole portfolio in `App.tsx`.

### `src/components/ui/reveal.tsx`
- **`Reveal({ children, delay, className })`** — IntersectionObserver wrapper: adds `reveal--visible` when 10% enters the viewport, observes once then disconnects. `delay` (ms) staggers grid children. Reduced motion handled in CSS (content simply visible).

### `src/components/ProjectCard/useTilt.ts`
- **`useTilt({ maxTiltDeg = 10 })`** — returns a ref to attach to any element.
  - `pointermove` (mouse **and** touch) only updates a *target* state; a `requestAnimationFrame` loop **lerps the current state toward the target** (`LERP_FACTOR 0.14`) and writes `--tilt-x/--tilt-y/--glow-x/--glow-y/--card-lift/--card-scale` on the element each frame — smooth spring-like motion with **zero React re-renders**. The loop self-stops once values settle (`SETTLE_EPSILON`), so idle cost is zero.
  - Hover lift (12px) and scale (1.02) ride the same lerp; the CSS deliberately has **no transition on transform** (see comment in globals.css) so JS and CSS never fight.
  - Tilt bounded to ±`maxTiltDeg` (±10°); `pointerleave`/`pointercancel` ease everything back to rest.
  - Disabled entirely under reduced motion. Cleanup removes all listeners and cancels any pending frame.

### `src/components/ProjectCard/ProjectCard.tsx`
- **`ProjectCard({ project })`** — glass card rendered 100% from the `Project` object (tag line = `techStack.join(' · ')`, links mapped). Wrapped in `React.memo` — project data never changes at runtime, so cards skip re-renders. The actual 3D transform lives in CSS (`rotateX/rotateY/translateZ/scale` from the custom properties + `will-change: transform`) — no physics engine, no per-frame React work.

### `src/components/Cursor/Cursor.tsx`
- **`Cursor()`** — accent dot (follows the pointer directly) + ring (lags via lerp in a `requestAnimationFrame` loop). Hover state via a delegated `pointerover` + `closest()` check (no per-element listeners like the original). Renders `null` on coarse pointers (touch) and under reduced motion — native cursor untouched there. Cleanup removes listeners, cancels the rAF loop, and strips the body classes. The original's canvas particle trail was deliberately dropped (see trade-offs).

### `src/components/layout/Navbar.tsx`
- **`Navbar()`** — fixed bar that gains the glass treatment (`backdrop-filter`) after 40 px of scroll; active link from `useActiveSection`; hamburger + full-screen glass mobile menu.
  - Side effects: scroll listener (passive), `body.no-scroll` while the menu is open, and a media-query listener that force-closes the menu if the viewport grows past 768 px.

### `src/components/layout/Footer.tsx`
- **`Footer()`** — static footer, original copy.

### `src/components/sections/*.tsx`
- **`Hero()`** — original hero copy/CTAs/photo; chips restyled as dark glass (readability over the bright photo). Entrance animations are pure CSS (disabled under reduced motion via the global media query).
- **`Pointing()`** — "follow the direction" section, wrapped in `<Reveal>` blocks.
- **`Projects()`** — maps `PROJECTS` → `<Reveal delay={i * 130}><ProjectCard/></Reveal>`. No per-project markup.
- **`About()`** — decorative code block + bio; inline styles from the old HTML replaced with classes.
- **`Contact()`** — contact cards generated from a local `CONTACT_CHANNELS` array (same GitHub/email/WhatsApp links + SVGs).

### `src/hooks/usePrefersReducedMotion.ts`
- **`usePrefersReducedMotion()`** — boolean state synced to `(prefers-reduced-motion: reduce)`, updates live via the media-query `change` event.

### `src/hooks/useActiveSection.ts`
- **`useActiveSection(sectionIds)`** — one IntersectionObserver (threshold 0.4) over the given section elements; returns the id of the section currently in view.

### `src/data/projects.ts`
- **`Project`** interface + **`PROJECTS`** array — see "Data shape" below.

### `src/lib/utils.ts`
- **`cn(...inputs)`** — `clsx` + `tailwind-merge`, the standard shadcn class helper.

---

## Theme tokens reference (`src/styles/theme.css`)

| Variable | Value | Controls |
|---|---|---|
| `--bg` / `--bg-deep` | `#080b12` / `#05070d` | Page background / intro space background |
| `--surface`, `--surface-2` | `#0e1220`, `#141a2c` | Opaque surfaces (image placeholders) |
| `--text` / `--text-muted` / `--text-dim` | `#e8eaf2` / `#8b93ad` / `#565d78` | Type colour hierarchy |
| `--accent` / `--accent-2` / `--accent-3` | `#4f9eff` / `#a78bfa` / `#22d3ee` | Blue / violet / cyan accents |
| `--glow-blue/purple/cyan` | low-alpha rgba | Ambient blob gradients behind the glass |
| `--glass-bg` / `--glass-bg-hover` | white @ 5% / 8% | Glass panel fill (rest / hover) |
| `--glass-bg-strong` | `rgba(16,21,36,.72)` | Darker glass (chips over photos) + no-`backdrop-filter` fallback |
| `--glass-border` / `--glass-border-hover` | white @ 12% / blue @ 35% | Panel borders |
| `--glass-highlight` | white @ 16% | Inner top highlight (glass depth) |
| `--glass-blur` / `--glass-blur-strong` | `18px` / `26px` (12/16 on mobile) | `backdrop-filter` radii |
| `--shadow-glass` / `--shadow-glass-hover` | layered shadows + inset highlight | Panel depth (rest / hover) |
| `--radius-sm/md/lg/full` | `10/16/24/999px` | Corner radius scale |
| `--ease-out-expo` | `cubic-bezier(.16,1,.3,1)` | The site-wide easing |
| `--hover-scale` | `1.02` | Gentle interaction scale |
| `--duration-fast/slow` | `.3s` / `.65s` | Transition durations (slow = intro fade) |
| `--container-max` / `--space-section` | `1200px` / `clamp(5rem,10vw,8rem)` | Layout width / section rhythm |
| `--font-display/body/mono` | Cormorant Garamond / DM Sans / Space Mono | Type stacks |

The reusable recipe is the `.glass-panel` class in `globals.css`; cards/chips/nav/contact links all use the same tokens.

---

## Data shape

```ts
interface Project {
  id: string                                  // stable React key
  title: string
  description: string
  techStack: string[]                         // rendered joined with " · "
  image: { src: string; alt: string }         // src is a /public path
  links: { label: string; href: string }[]    // rendered as buttons
}
```

Example entry:

```ts
{
  id: 'shop-system',
  title: 'Shop System',
  description: 'A responsive e-commerce website that allows users to…',
  techStack: ['HTML', 'CSS', 'JavaScript', 'Node.js'],
  image: { src: '/PROJECT1.png', alt: 'Shop System — e-commerce storefront' },
  links: [{ label: 'Live Demo', href: 'https://ff-alpha-one.vercel.app/' }],
}
```

---

## How to extend

- **Add a project:** drop the image in `public/`, add one object to `PROJECTS` in `src/data/projects.ts`. Nothing else.
- **Retheme the site:** edit tokens in `src/styles/theme.css` only.
- **Globe rotation speed / zoom feel:** `GLOBE_ROTATION_SPEED`, `CAMERA_END_Z`, `ZOOM_DURATION_S` in `src/components/GlobeIntro/constants.ts`.
- **More/fewer stars:** `STAR_LAYERS` in the same file.
- **Change what the code planet says:** edit the `CODE_TOKENS` array in `src/components/GlobeIntro/CodeGlobe.tsx`.
- **Card tilt range:** `MAX_TILT_DEG` in `ProjectCard.tsx` (or pass a different `maxTiltDeg` to `useTilt`).
- **Change the intro title:** props on `<CosmicOverlay>` inside `GlobeIntro.tsx`.
- **Add a nav section:** add to `NAV_LINKS` in `Navbar.tsx`; the active-highlight observer picks it up automatically.
- **Add shadcn components:** `npx shadcn@latest add <component>` — `components.json` already points at `@/components/ui`.

---

## Trade-offs & known limitations

- **`backdrop-filter` support:** ~96% of browsers; an `@supports` fallback swaps glass panels to a solid dark surface elsewhere. Blur radii are reduced on ≤768 px viewports because backdrop blur is GPU-expensive on phones.
- **3D chunk size:** three.js + r3f + drei is ~868 kB minified (~234 kB gzip). It is code-split and lazy-loaded, so the initial page is ~365 kB JS (~116 kB gzip, incl. framer-motion) + 47 kB CSS; the fallback orb shows while it streams.
- **framer-motion (~41 kB gzip):** added for the spotlight background's declarative infinite keyframe drifts and its `useReducedMotion` hook — the one new dependency of this pass.
- **Cursor particle trail dropped:** the original comet-trail canvas ran an unconditional rAF loop with shadow-blurred arcs per frame; kept the dot+ring, dropped the particles for performance. Custom cursor is disabled on touch and under reduced motion.
- **Globe texture is procedural:** the code-planet surface is drawn on an offscreen canvas at mount (zero download, ~1 ms). Token layout is random per visit, so the planet looks slightly different each load — intentional; make `createCodeTexture` deterministic if you ever want it pixel-stable.
- **StrictMode double-mount (dev only):** effects mount/unmount twice in dev; all disposal paths are idempotent, production is unaffected.
