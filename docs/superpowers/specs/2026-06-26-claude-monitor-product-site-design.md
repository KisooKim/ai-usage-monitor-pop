# Claude Code Usage Monitor — Product Website Design

**Date:** 2026-06-26
**Status:** Approved design, pending spec review
**Owner:** Kisoo Kim

## Goal

A polished, Apple-product-page-style landing page that presents the customized
**Claude Code Usage Monitor** (the personal fork) as a standalone product. A
visitor lands, understands what it is and why they want it, sees real
screenshots of the UI, and downloads an installer file to run on Windows.

The page is served as a sub-path of the user's GitHub Pages site
(`kisookim.github.io/<repo>/`).

## Non-Goals (YAGNI)

- No multi-page site, blog, or docs portal — one long scrolling page.
- No build tooling / framework (no Astro, Next, Tailwind build).
- No backend, analytics pipeline, newsletter, or telemetry.
- No winget instructions on the page (user chose direct download). The winget
  path belongs to the upstream build, not this fork.
- No in-page theme switcher demo or live web emulation of the app — static
  screenshots only.
- No code signing in v1 (tracked as a future improvement, not a blocker).

## Audience

Windows 10/11 users who already run Claude Code (CLI or App) and want an
always-visible "how close am I to my limit?" display. Secondary: Codex CLI users
who want the same for Codex.

## Information Architecture (single long scroll)

1. **Sticky mini-nav** — product name (left), `Download` button (right).
   Transparent over hero; turns to a translucent frosted bar on scroll.
2. **Hero** — large product name, one-line tagline, primary
   `Download for Windows` CTA, a quiet `Windows 10 / 11` requirements line, and
   the panel hero visual (the floating panel screenshot on the dark canvas).
3. **Feature sections** (alternating large-visual + short copy, scroll reveal):
   - **Always in sight** — the floating panel: 5h + 7d bars, live reset countdown.
   - **Four themes** — showcase row: macOS Vibrancy, Windows 11 Fluent, Refined
     Hybrid Dark, Refined Hybrid Light.
   - **Multiple accounts & Codex** — provider columns (Claude left, Codex right),
     per-account email + bars.
   - **Tray badges & corner hover** — tray icon usage badge; the two display
     modes (tray icon vs. hot-corner panel).
   - **Private by design** — reads only local Claude Code OAuth credentials
     (`~/.claude/.credentials.json`), talks only to `api.anthropic.com`. Open
     source.
4. **Download section** — large CTA, requirements list, **honest first-run note**
   (unsigned build → Windows SmartScreen warning → "More info → Run anyway"),
   current version + file size.
5. **Footer** — GitHub (open source) link, **upstream attribution** (based on
   the open-source `CodeZeno/Claude-Code-Usage-Monitor`, MIT), MIT license,
   "made by Kisoo".

## Visual / Aesthetic Spec

One committed direction (per the project design guide — pick one extreme and
commit; avoid AI-slop defaults):

- **Canvas:** near-black (`#0A0A0B`-ish), premium dark. The translucent panel
  reads best on dark.
- **Accent:** Claude orange `#D97757` (matches the product's fixed brand accent).
  Codex grey `#C9C9D0` as a secondary accent where Codex is shown.
- **Typography:** a refined neutral grotesque, **self-hosted** — Satoshi or Geist
  (NOT Inter/Roboto/Arial). Large, tight letter-spacing display sizes for
  headings, generous line-height for body.
- **Layout:** generous whitespace, centered hero, full-bleed feature visuals,
  asymmetric where it adds life — never a uniform card grid.
- **Motion:** restrained, staggered scroll-reveals (fade + small translate).
  CSS scroll-driven animations where supported, `IntersectionObserver` fallback.
  No scattered micro-interactions; no parallax soup.
- **No** purple gradients, no glassmorphism cliché, no stock cards.

## Assets Needed (real screenshots)

Captured from the actual release build (`target/release/claude-code-usage-monitor.exe`):

| Shot | Content | Notes |
|------|---------|-------|
| hero panel | floating panel, default Hybrid Dark, with 5h/7d bars + countdown | primary hero image |
| theme: vibrancy | panel in macOS Vibrancy | |
| theme: fluent | panel in Windows 11 Fluent | |
| theme: hybrid-light | panel in Refined Hybrid Light | |
| multi-account | Claude + Codex provider columns | may require 2 accounts configured |
| tray badges | tray icon usage badge(s) | crop of notification area |
| corner-hover | panel popping from a screen corner | optional / best-effort |

**Capture plan:** launch the build, switch themes via the right-click menu,
screen-capture the panel region, then trim/frame on the dark canvas. Some states
(theme switching, multi-account, corner-hover) are fiddly to capture
programmatically — **user assistance may be requested** for those shots. Where a
real capture is impractical (e.g., multi-account with no second account), note it
and fall back to the closest available real shot rather than a fabricated mockup.

## Tech Architecture

Static, no build step (Approach A):

```
claude-monitor-site/
  index.html          # the page
  styles.css          # bespoke CSS (custom properties for theme tokens)
  main.js             # scroll-reveal (IntersectionObserver), nav frost-on-scroll
  fonts/              # self-hosted Satoshi/Geist woff2
  assets/             # screenshots (optimized .webp/.png) + favicon/og image
  README.md
```

- Plain HTML + CSS + a small vanilla JS file. No bundler, no runtime CDN.
- Responsive: single-column stack on mobile; the page must read well on phones.
- Performance: optimized images (`webp`, sized), lazy-load below-the-fold shots,
  system-font fallback while web fonts load.
- Accessibility: semantic landmarks, alt text on every screenshot, visible focus
  states, sufficient contrast, `prefers-reduced-motion` disables reveals.

## Distribution / Download Mechanics

- The `Download for Windows` button links to a **GitHub Release asset**
  (`claude-code-usage-monitor.exe`) published under the user's own GitHub
  account/repo — not bundled into the Pages repo.
- The page states the file size and version next to the CTA.
- **First-run note** (honest, prominent but tasteful): the build is unsigned, so
  Windows SmartScreen shows "Windows protected your PC" on first launch; the user
  clicks "More info → Run anyway". Note that a small set of Windows 11 machines
  with Smart App Control ON may block it more firmly.
- **Future improvement (not v1):** code signing (e.g., free OSS paths via
  SignPath or Azure Trusted Signing) to remove the warning.

## Attribution / Licensing

This is a fork of `CodeZeno/Claude-Code-Usage-Monitor` (MIT). The page presents
the fork as a product but **keeps clear upstream credit and the MIT license** in
the footer. Honest provenance, not erasure of the original.

## Deployment

- Develop in `Development/claude-monitor-site/` (its own git repo).
- Publish as a GitHub repo under the **KisooKim (`sincerityandaudacity`, devauth
  alias `kisoo`)** account that owns `kisookim.github.io`, with GitHub Pages
  enabled (deploy from `main` branch root, or `/docs`).
- Served at `kisookim.github.io/<repo>/` (e.g.
  `kisookim.github.io/claude-code-usage-monitor/`).

## Open Items (confirm before/at deploy)

1. ~~Which GitHub account owns `kisookim.github.io`?~~ **RESOLVED:** GitHub user
   `KisooKim` (`sincerityandaudacity`, devauth alias `kisoo`). The
   `kisookim/kisookim.github.io` repo exists and the site is **already live**.
   Remaining sub-decision (deploy-time only, same final URL either way):
   - **(a) Separate repo** `claude-code-usage-monitor` under KisooKim, Pages
     enabled → `kisookim.github.io/claude-code-usage-monitor/`. Isolated; does
     not touch the existing live site. **Default.**
   - **(b) Subfolder** inside the existing `kisookim.github.io` repo →
     same URL, but becomes part of the existing site.
2. **Product name:** keeping "Claude Code Usage Monitor" (default). Change only if
   the user wants a distinct brand.
3. **Aesthetic:** dark canvas + Claude orange (assumed approved).

## Success Criteria

- A single static page that builds to `index.html` + assets with no build step.
- Apple-product-page feel: clean dark canvas, real screenshots, restrained motion.
- A working `Download for Windows` CTA pointing at a real release asset.
- Honest first-run guidance and upstream attribution present.
- Responsive and accessible (reduced-motion, alt text, contrast).
- Deployable to `kisookim.github.io/<repo>/` once the account/repo is confirmed.
