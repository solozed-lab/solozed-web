# [Solozed](https://solozed.com)

> The Age of AI, the grace to be.

A personal website built with Astro and React, featuring immersive WebGL animations and a blog section with glassmorphism design.

## Tech Stack

| Category | Choice |
|----------|--------|
| Framework | [Astro](https://astro.build) v6 |
| UI Library | React 19 |
| Animations | [Motion](https://motion.dev) + [OGL](https://oframe.github.io/ogl/) (WebGL) |
| Build Tool | Vite (built into Astro) |
| Language | TypeScript |
| Testing | [Playwright](https://playwright.dev) |

## Features

- Static site generation with Astro
- React islands for interactive components
- WebGL-powered background animations (ShapeGrid + Aurora)
- Blog section with MDX content and glassmorphism UI
- SEO-optimized with Open Graph, Twitter Card, and GEO tags
- Sitemap auto-generation
- WCAG AA color contrast compliance testing
- Social links with hover effects

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
/
├── public/
│   ├── email.svg
│   ├── favicon.svg
│   ├── medium.svg
│   ├── robots.txt
│   ├── x.svg
│   └── youtube.svg
├── src/
│   ├── components/
│   │   ├── BlogNav.astro       # Blog navigation
│   │   ├── Footer.astro        # Footer with social icons
│   │   ├── OrbBackground.tsx    # Canvas animation (blog pages)
│   │   └── react/
│   │       ├── Aurora.tsx       # WebGL aurora shader
│   │       ├── Aurora.css
│   │       ├── BackgroundLayer.tsx
│   │       ├── ShapeGrid.tsx    # WebGL grid with hover effects
│   │       └── ShinyText.tsx    # Animated text with shine effect
│   ├── content/
│   │   └── blog/               # MDX blog posts
│   ├── layouts/
│   │   └── Layout.astro         # Base layout with SEO meta
│   ├── pages/
│   │   ├── index.astro          # Homepage
│   │   └── blog/
│   │       ├── index.astro     # Blog list page
│   │       └── [slug].astro    # Blog post detail page
│   └── styles/
│       └── global.css
├── e2e/
│   └── color-contrast.spec.ts   # WCAG AA contrast tests
├── astro.config.mjs
└── package.json
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at localhost:4321 |
| `npm run build` | Build production bundle to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run astro` | Run Astro CLI (e.g., `astro add`) |

## Blog Design System

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#F5F8FA` | Page background |
| Primary | `#38D9D9` | Accent color (cyan) |
| Link | `#0E7490` | Article links |
| Text | `#1E293B` | Headlines |
| Body | `#475569` | Body text |
| Bold | `#F29719` | Strong emphasis |

## License

MIT License - see [LICENSE](./LICENSE)
