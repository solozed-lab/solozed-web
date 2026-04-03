# [Solozed](https://solozed.com)

> The Age of AI, the grace to be.

A personal website built with Astro and React, featuring immersive WebGL animations.

## Tech Stack

| Category | Choice |
|----------|--------|
| Framework | [Astro](https://astro.build) v6 |
| UI Library | React 19 |
| Animations | [Motion](https://motion.dev) + [OGL](https://oframe.github.io/ogl/) (WebGL) |
| Build Tool | Vite (built into Astro) |
| Language | TypeScript |

## Features

- Static site generation with Astro
- React islands for interactive components
- WebGL-powered background animations
- Sitemap auto-generation
- SEO-optimized with custom meta tags

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
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── react/          # React components with client:load
│   ├── layouts/
│   │   └── Layout.astro     # Base layout
│   ├── pages/
│   │   └── index.astro      # Homepage
│   └── styles/
│       └── global.css
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

## License

MIT License - see [LICENSE](./LICENSE)
