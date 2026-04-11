# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Solozed is a personal website built with Astro v6 and React 19, featuring immersive WebGL animations. The site is statically generated and deployed at https://solozed.com.

## Commands

```bash
npm run dev      # Start dev server at localhost:4321
npm run build    # Build production bundle to ./dist/
npm run preview  # Preview production build locally
npm run astro    # Run Astro CLI (e.g., npm run astro add)
```

**Node requirement:** >=22.12.0

## Architecture

### Astro + React Hybrid

Astro handles static site generation (SSG). React components are hydrated as "islands" using `client:load` directive. This means:
- Astro files (`.astro`) are static by default
- Interactive components must explicitly opt into client-side hydration
- All React components in `src/components/react/` are used with `client:load`

### Page Structure

```
src/
├── layouts/Layout.astro   # Base HTML layout with SEO meta, fonts, structured data
├── pages/index.astro      # Homepage - composes React islands
├── components/react/      # React islands (hydrated)
│   ├── BackgroundLayer.tsx    # Container for ShapeGrid + Aurora
│   ├── ShapeGrid.tsx          # WebGL grid with hover effects (OGL)
│   ├── Aurora.tsx              # WebGL aurora shader (OGL)
│   └── ShinyText.tsx           # Animated text with shine effect (Motion)
└── styles/global.css       # Global styles (overflow hidden, dark theme)
```

### WebGL Animation Stack

- **OGL** (`ogl` package): Low-level WebGL renderer for ShapeGrid and Aurora
- **Motion** (`motion` package): React animation library for ShinyText
- Both use inline GLSL shaders (VERT/FRAG constants in Aurora.tsx)
- BackgroundLayer composes ShapeGrid and Aurora as sibling divs with z-index layering

### SEO/GEO Setup

Layout.astro includes comprehensive meta tags:
- Open Graph, Twitter Card
- GEO tags (geo.region, geo.placename, geo.position)
- Structured data (JSON-LD for WebSite and Organization)
- Baidu, Sogou, Naver, Google site verifications (placeholders)

### Integrations

- `@astrojs/react`: React integration
- `@astrojs/sitemap`: Auto-generates sitemap.xml on build
- `site` config in astro.config.mjs set to `https://solozed.com`

### TypeScript

Extends `astro/tsconfigs/strict`. JSX is configured for React 19 with `jsxImportSource: react`.

## Adding New Pages

1. Create `src/pages/[page].astro` with frontmatter importing Layout
2. Add React components with `client:load` for interactivity
3. New routes are automatically included in sitemap.xml

## Blog Section

### Content Collection

Blog posts are in `src/content/blog/` as MDX files with frontmatter:

```yaml
---
title: Article Title
description: Short description
pubDate: 2026-04-06
tags: ["Frontend", "Astro"]
---
```

Schema is defined in `src/content.config.ts` using Astro's Content Layer API.

### Routing

- List page: `src/pages/blog/index.astro`
- Detail page: `src/pages/blog/[slug].astro`

**Important:** Use `post.id` (not `post.slug`) for routing. Astro v6's glob loader provides `id` which includes the file extension.

### Blog Components

- `BlogNav.astro` - Glass capsule nav with `theme` prop ('dark' | 'light')
- `OrbBackground.tsx` - Canvas animation with breathing orbs (used in blog pages)
- `Footer.astro` - Simple copyright footer

### Design System (Blog)

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#F5F8FA` | Page background |
| Primary | `#38D9D9` | Accent color (cyan) |
| Link | `#0E7490` | Article links (WCAG AA) |
| Text | `#1E293B` | Headlines |
| Body | `#475569` | Body text |
| Bold | `#F29719` | Strong emphasis |

Glass cards use `backdrop-filter: blur(32px)` with `rgba(255,255,255,0.28)` background.

### Tag Color System

Tags use deterministic color assignment via `getTagColor(tag)` function (hash-based). No hardcoded per-tag CSS classes.

## Git Workflow

- **Never modify `main` directly.** All feature development and bug fixes must happen in a separate branch.
- Before making any changes, create a new branch from `main` (e.g. `feat/your-feature`, `fix/your-issue`).
- After the change is complete and verified, merge it back into `main`.
- Delete the branch after merging.
