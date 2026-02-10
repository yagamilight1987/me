# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website + blog built with Hugo, Tailwind CSS v4, and GSAP animations. Deployed to GitHub Pages via GitHub Actions.

## Commands

- **Dev server:** `hugo server` (with live reload)
- **Build:** `hugo --minify` (outputs to `./public`)
- **New blog post:** `hugo new content blog/my-post.md`
- **Install deps:** `bun install` (for Tailwind CSS PostCSS pipeline)

There are no tests or linting configured.

## Architecture

Hugo static site with two page types: a portfolio homepage and a blog.

- **`layouts/index.html`** — Homepage template, calls section partials in order
- **`layouts/partials/`** — Decomposed sections: `hero.html`, `profile.html`, `projects.html`, `experience.html`, `skills.html`, `testimonials.html`, `nav.html`, `footer.html`, `scroll-to-top.html`, `scripts.html`, `head.html`
- **`layouts/_default/baseof.html`** — Base HTML shell shared by all pages
- **`layouts/_default/list.html`** — Blog listing page at `/blog/`
- **`layouts/_default/single.html`** — Individual blog post template
- **`data/`** — YAML files for repeatable content: `projects.yaml`, `experience.yaml`, `skills.yaml`, `testimonials.yaml`. Templates loop over these with `site.Data.*`
- **`content/blog/`** — Markdown blog posts with YAML front matter
- **`assets/css/main.css`** — Tailwind v4 import + `@theme` tokens + `@tailwindcss/typography` plugin. Processed via Hugo Pipes + PostCSS
- **`assets/js/main.js`** — GSAP animations (horizontal testimonial carousel, hero text scramble, stagger fade-ins, scroll-to-top button). GSAP loaded from CDN in `scripts.html`
- **`static/images/`** — Static assets (hero.jpg, profile-enhanced.png)

## Design System

- **Dark theme only** — Background: `onyx` (#0D0D0D), cards: `gunmetal` (#1A1A1A)
- **Accent color:** `blood-red` (#E62E2E) used for highlights, links, and decorative elements
- **Font:** Space Grotesk (loaded via Google Fonts in head partial)
- **Animations:** All done via GSAP + ScrollTrigger (not CSS keyframes)
- **Blog typography:** Uses `prose-invert` from `@tailwindcss/typography` with custom overrides for blood-red links and gunmetal code blocks

## Conventions

- Tailwind utility-first — no custom component CSS classes
- Semantic HTML with `<section>`, `<article>`, `<nav>` landmarks
- Mobile-first responsive design using Tailwind's `md:` breakpoint
- Bun as the package manager (CI also uses Bun)
- Content edits go in `data/*.yaml` files, not in templates
- GSAP DOM selectors to preserve: `#hero-section`, `#hero-title`, `.horiz-gallery-wrapper`, `.horiz-gallery-strip`, `.testimonial-card`, `#scroll-to-top`
