# Plan: Migrate Portfolio from Vite to Hugo + Add Blog

## Context

The current site is a single-page portfolio built with Vite + TypeScript + Tailwind CSS v4 + GSAP, deployed to GitHub Pages. The goal is to migrate to Hugo to support a new Blog section (the primary motivation), while retaining the exact same dark theme, animations, and visual design.

---

## Approach Overview

- **Tailwind CSS v4**: Hugo Pipes + PostCSS (via `@tailwindcss/postcss` plugin) — no separate Node build step needed beyond `npm install`
- **GSAP**: Load from CDN; convert `main.ts` to plain JS (just remove types + imports)
- **Content**: Extract hardcoded projects/experience/skills/testimonials into Hugo `data/` YAML files
- **Blog**: Markdown files in `content/blog/`, with list and single templates styled to match the portfolio theme

---

## Target Directory Structure

```
me/
├── hugo.toml
├── package.json                  # Tailwind + PostCSS only
├── postcss.config.js
├── archetypes/blog.md
├── assets/
│   ├── css/main.css              # Tailwind v4 + @theme tokens
│   └── js/main.js                # GSAP animations (plain JS)
├── content/
│   ├── _index.md                 # Homepage front matter
│   └── blog/
│       ├── _index.md             # Blog list page
│       └── hello-world.md        # Example post
├── data/
│   ├── projects.yaml
│   ├── experience.yaml
│   ├── skills.yaml
│   └── testimonials.yaml
├── layouts/
│   ├── _default/
│   │   ├── baseof.html           # Base shell (<html>, <head>, <body>)
│   │   ├── list.html             # Blog listing page
│   │   └── single.html           # Blog post page
│   ├── index.html                # Homepage (calls all section partials)
│   └── partials/
│       ├── head.html             # Meta, fonts, Tailwind CSS via Hugo Pipes
│       ├── nav.html              # Fixed nav (+ Blog link)
│       ├── hero.html
│       ├── profile.html
│       ├── projects.html         # Loops over data/projects.yaml
│       ├── experience.html       # Loops over data/experience.yaml
│       ├── skills.html           # Loops over data/skills.yaml
│       ├── testimonials.html     # Loops over data/testimonials.yaml
│       ├── footer.html
│       ├── scroll-to-top.html
│       └── scripts.html          # GSAP CDN + main.js
├── static/images/
│   ├── hero.jpg
│   └── profile-enhanced.png
└── .github/workflows/main.yml    # Hugo + Node build
```

---

## Implementation Steps

### Step 1: Scaffold Hugo project
- Run `hugo new site . --force` in the repo root
- Write `hugo.toml` with baseURL (`https://yagamilight1987.github.io/me/`), title, Goldmark unsafe HTML enabled, and `build.buildStats` for Tailwind
- Create `package.json` with `tailwindcss`, `@tailwindcss/postcss`, `@tailwindcss/typography`
- Create `postcss.config.js` pointing to `@tailwindcss/postcss`
- Run `npm install`

### Step 2: Move static assets
- Move `public/hero.jpg` → `static/images/hero.jpg`
- Move `public/profile-enhanced.png` → `static/images/profile-enhanced.png`
- Remove old `public/` directory contents

### Step 3: Create base template + head partial
- `layouts/_default/baseof.html` — HTML shell calling partials for head, nav, main block, scroll-to-top, scripts
- `layouts/partials/head.html` — charset, viewport, title, Google Fonts preconnect/link, Tailwind CSS processed via `resources.PostCSS | minify | fingerprint`

### Step 4: Create CSS + JS assets
- `assets/css/main.css` — same `@theme` tokens as current `src/style.css`, plus `@plugin "@tailwindcss/typography"` and `@source` directives for `layouts/` and `content/`
- `assets/js/main.js` — convert `src/main.ts` to plain JS: remove `import` statements and type annotations, use CDN globals (`gsap`, `ScrollTrigger`). All DOM selectors preserved exactly

### Step 5: Create data files
- Extract content from `index.html` into `data/projects.yaml`, `data/experience.yaml`, `data/skills.yaml`, `data/testimonials.yaml`

### Step 6: Create all section partials
- Decompose `index.html` into partials: `nav.html`, `hero.html`, `profile.html`, `projects.html`, `experience.html`, `skills.html`, `testimonials.html`, `footer.html`, `scroll-to-top.html`, `scripts.html`
- Data-driven partials use `{{ range site.Data.* }}` loops
- Nav adds "Blog" link; uses `{{ if not .IsHome }}` prefix for anchor links from non-homepage pages
- Hero uses inline `style` attribute for background image to handle baseURL subpath: `style="background-image: url('{{ "images/hero.jpg" | relURL }}')"`
- All GSAP-targeted classes/IDs preserved exactly: `#hero-section`, `#hero-title`, `.horiz-gallery-wrapper`, `.horiz-gallery-strip`, `.testimonial-card`, `#scroll-to-top`

### Step 7: Create homepage template
- `layouts/index.html` — defines `"main"` block, calls all section partials in order

### Step 8: Create blog templates
- `layouts/_default/list.html` — blog listing at `/blog/`, card-based layout matching portfolio theme (gunmetal cards, blood-red accents, charcoal borders)
- `layouts/_default/single.html` — blog post with `prose-invert` typography, styled code blocks (blood-red on gunmetal), blood-red blockquote borders, back-to-blog link
- `archetypes/blog.md` — default front matter (title, date, description, tags)

### Step 9: Create content files
- `content/_index.md` — homepage (just front matter, no body)
- `content/blog/_index.md` — blog list page front matter
- `content/blog/hello-world.md` — one example blog post

### Step 10: Update CI/CD
- Replace Bun/Vite workflow with Hugo + Node:
  - `peaceiris/actions-hugo@v3` (extended edition for PostCSS)
  - `actions/setup-node@v4` (for npm/PostCSS deps)
  - Build: `npm ci && hugo --minify`
  - Output path: `./public` (Hugo default)

### Step 11: Clean up old files
- Remove: `src/`, `vite.config.ts`, `tsconfig.json`, `bun.lock`, old `index.html`, old `public/`
- Update `CLAUDE.md` with new Hugo commands and architecture

---

## Key Technical Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Tailwind in Hugo | Hugo Pipes + PostCSS | Official Hugo mechanism; no separate build step |
| GSAP loading | CDN (jsdelivr, pinned v3.12.5) | Avoids needing JS bundler; browser caching |
| TypeScript → JS | Manual strip of types | Only ~5 type annotations to remove; trivial conversion |
| Repeatable content | Hugo `data/` YAML files | Easy to edit without touching templates |
| Blog typography | `@tailwindcss/typography` prose-invert | Markdown rendering with dark theme out of the box |
| Background image URL | Inline `style` with `relURL` | Correctly handles GitHub Pages subpath (`/me/`) |

---

## Verification

After implementation, run `hugo server` and check:
1. **Homepage** renders identically — all 7 sections with correct layout, colors, fonts
2. **GSAP animations** work — hero text scramble, hero stagger fade-in, horizontal testimonial scroll, scroll-to-top button
3. **Blog list** renders at `/blog/` with dark-themed cards
4. **Blog post** renders with proper prose typography (headings, code blocks, links)
5. **Navigation** works from both homepage (anchor scroll) and blog pages (navigate to `/#section`)
6. **Responsive layout** — test at mobile and desktop breakpoints
7. **Production build** — `hugo --minify` succeeds without errors

---

## Files Modified/Created Summary

**New files**: ~25 (Hugo templates, partials, data files, config, content)
**Modified**: `.github/workflows/main.yml`, `CLAUDE.md`
**Deleted**: `src/`, `vite.config.ts`, `tsconfig.json`, `bun.lock`, `index.html`, `public/`
