# Claude Code Usage Monitor — Product Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, Apple-product-page-style static landing page for the customized Claude Code Usage Monitor and deploy it to `kisookim.github.io/claude-code-usage-monitor/`.

**Architecture:** A single long-scroll static page — `index.html` + `styles.css` + `main.js` + self-hosted fonts + real screenshot assets. No build step, no framework, no runtime CDN. Scroll reveals via `IntersectionObserver`. Served by GitHub Pages from a dedicated repo under the KisooKim account; the Windows `.exe` is distributed as a GitHub Release asset of that same repo.

**Tech Stack:** Plain HTML5, modern CSS (custom properties, `clamp()`, container-friendly fl/grid), vanilla JS, Geist Sans (OFL) self-hosted, GitHub Pages, GitHub Releases, `gh` CLI for deploy.

## Global Constraints

These apply to **every** task — copied verbatim from the spec.

- **No build step / no framework / no runtime CDN.** Files served as-is.
- **Single page** — `index.html` only. No multi-page, no docs portal.
- **Aesthetic (one committed direction):** near-black canvas, Claude orange accent, refined grotesque type, generous whitespace, restrained staggered scroll reveals. No purple gradients, no glassmorphism cliché, no uniform card grid, no Inter/Roboto/Arial.
- **Design tokens (exact):**
  - `--bg: #0A0A0B`  `--bg-elev: #141416`  `--bg-elev-2: #1C1C1F`
  - `--text: #F5F5F7`  `--text-dim: #A1A1AA`  `--text-faint: #6E6E76`
  - `--accent: #D97757` (Claude)  `--accent-2: #C9C9D0` (Codex)
  - `--border: rgba(255,255,255,0.08)`  `--radius: 16px`
  - container max-width `1120px`; section vertical padding `clamp(80px,12vw,160px)`
- **Font:** Geist Sans, self-hosted woff2 (OFL — free to self-host). System grotesque fallback stack while loading. NOT Inter/Roboto/Arial.
- **Motion:** reveal = opacity 0→1 + translateY(24px→0), 600ms `cubic-bezier(.2,.7,.2,1)`, staggered. `@media (prefers-reduced-motion: reduce)` disables all reveals/transitions.
- **Accessibility:** semantic landmarks, `alt` on every image, visible `:focus-visible`, contrast ≥ 4.5:1 for body text.
- **Product name:** `Claude Code Usage Monitor` (verbatim).
- **Tagline:** `Your Claude Code limits, always in sight.` (verbatim).
- **Canonical URLs (use exactly these):**
  - `DOWNLOAD_URL` = `https://github.com/KisooKim/claude-code-usage-monitor/releases/latest/download/claude-code-usage-monitor.exe`
  - `REPO_URL` = `https://github.com/KisooKim/claude-code-usage-monitor`
  - `SITE_URL` = `https://kisookim.github.io/claude-code-usage-monitor/`
  - `UPSTREAM_URL` = `https://github.com/CodeZeno/Claude-Code-Usage-Monitor`
- **Requirements copy (verbatim):** `Windows 10 or 11` · `Claude Code (CLI or App) installed and signed in` · `Optional: Codex CLI for Codex usage`
- **First-run note (verbatim intent):** the build is unsigned, so Windows SmartScreen shows "Windows protected your PC" on first launch → click **More info → Run anyway**. A few Windows 11 machines with Smart App Control ON may block it more firmly.
- **Attribution (verbatim intent):** based on the open-source `CodeZeno/Claude-Code-Usage-Monitor` (MIT).
- **Local preview command (all verification steps):** from the site root, `python -m http.server 8000` → open `http://localhost:8000/`.
- **Commit after every task.** DRY, YAGNI.

## File Structure

```
claude-monitor-site/
  index.html              # the entire page (semantic sections)
  styles.css              # all styles; :root design tokens at top
  main.js                 # IntersectionObserver reveals + nav frost-on-scroll
  fonts/
    Geist-Regular.woff2
    Geist-Medium.woff2
    Geist-SemiBold.woff2
  assets/
    panel-hero.webp        # default Hybrid Dark panel (hero)
    theme-vibrancy.webp
    theme-fluent.webp
    theme-hybrid-light.webp
    multi-account.webp      # best-effort
    tray-badge.webp
    corner-hover.webp       # best-effort/optional
    favicon.png
    og-cover.png            # 1200x630 social card
  README.md
  .gitignore
  docs/superpowers/...      # spec + this plan (already committed)
```

Responsibilities: `index.html` = structure/content; `styles.css` = all presentation (tokens → base → components → sections → responsive); `main.js` = the only behavior (reveal + frost). One responsibility per file; no inline styles/scripts beyond the tiny no-JS reveal fallback.

---

### Task 1: Scaffold — tokens, base layout, fonts, preview

**Files:**
- Create: `claude-monitor-site/index.html`
- Create: `claude-monitor-site/styles.css`
- Create: `claude-monitor-site/main.js`
- Create: `claude-monitor-site/.gitignore`
- Create: `claude-monitor-site/README.md`
- Create: `claude-monitor-site/fonts/` (download Geist woff2 into it)

**Interfaces:**
- Produces: the design-token CSS custom properties (`:root` block above), the `.container` wrapper class, the `.reveal` class hook used by all later sections, and `main.js` exporting nothing (runs on `DOMContentLoaded`).

- [ ] **Step 1: Download Geist Sans woff2 (OFL)**

```bash
cd claude-monitor-site && mkdir -p fonts
# Geist is OFL (vercel/geist-font). Fetch the three weights used by the design.
base="https://github.com/vercel/geist-font/raw/main/packages/next/dist/fonts/geist-sans"
curl -sL "$base/Geist-Regular.woff2"  -o fonts/Geist-Regular.woff2
curl -sL "$base/Geist-Medium.woff2"   -o fonts/Geist-Medium.woff2
curl -sL "$base/Geist-SemiBold.woff2" -o fonts/Geist-SemiBold.woff2
ls -lh fonts/
```

Expected: three non-empty `.woff2` files. If the raw URL 404s (repo layout changed), fall back to `npm pack geist` and copy `dist/fonts/geist-sans/*.woff2` out of the tarball, or download from https://vercel.com/font. Do NOT substitute Inter/Roboto.

- [ ] **Step 2: Write `.gitignore` and `README.md`**

`.gitignore`:
```gitignore
.DS_Store
Thumbs.db
*.log
node_modules/
```

`README.md`:
```markdown
# Claude Code Usage Monitor — product site

Static landing page. No build step.

## Preview
    python -m http.server 8000
Open http://localhost:8000/

## Deploy
GitHub Pages from this repo's `main` branch root.
Served at https://kisookim.github.io/claude-code-usage-monitor/

Based on the open-source CodeZeno/Claude-Code-Usage-Monitor (MIT).
```

- [ ] **Step 3: Write `styles.css` (tokens + base + container + reveal)**

```css
/* ---- tokens ---- */
:root{
  --bg:#0A0A0B; --bg-elev:#141416; --bg-elev-2:#1C1C1F;
  --text:#F5F5F7; --text-dim:#A1A1AA; --text-faint:#6E6E76;
  --accent:#D97757; --accent-2:#C9C9D0;
  --border:rgba(255,255,255,.08); --radius:16px;
  --container:1120px;
  --pad-section:clamp(80px,12vw,160px);
  --font:'Geist',ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif;
}
/* ---- fonts ---- */
@font-face{font-family:'Geist';src:url('fonts/Geist-Regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'Geist';src:url('fonts/Geist-Medium.woff2') format('woff2');font-weight:500;font-display:swap}
@font-face{font-family:'Geist';src:url('fonts/Geist-SemiBold.woff2') format('woff2');font-weight:600;font-display:swap}
/* ---- base ---- */
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--text);font-family:var(--font);
  font-size:18px;line-height:1.6;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}
h1,h2,h3{line-height:1.05;letter-spacing:-.02em;font-weight:600;margin:0}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:4px}
.container{max-width:var(--container);margin-inline:auto;padding-inline:clamp(20px,5vw,40px)}
/* ---- reveal ---- */
.reveal{opacity:0;transform:translateY(24px);
  transition:opacity .6s cubic-bezier(.2,.7,.2,1),transform .6s cubic-bezier(.2,.7,.2,1)}
.reveal.is-visible{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  .reveal{opacity:1!important;transform:none!important;transition:none!important}
}
```

- [ ] **Step 4: Write `main.js` (reveal observer; frost hook added in Task 2)**

```js
document.addEventListener('DOMContentLoaded',()=>{
  const els=document.querySelectorAll('.reveal');
  if(!('IntersectionObserver'in window)){els.forEach(e=>e.classList.add('is-visible'));return;}
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting){en.target.classList.add('is-visible');io.unobserve(en.target);} });
  },{threshold:.15,rootMargin:'0px 0px -10% 0px'});
  els.forEach(e=>io.observe(e));
});
```

- [ ] **Step 5: Write `index.html` skeleton (landmarks + asset hooks)**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Claude Code Usage Monitor</title>
  <link rel="icon" href="assets/favicon.png">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header id="nav"><!-- Task 2 --></header>
  <main>
    <section id="hero"><!-- Task 3 --></section>
    <!-- feature sections: Tasks 4-8 -->
    <section id="download"><!-- Task 9 --></section>
  </main>
  <footer id="footer"><!-- Task 10 --></footer>
  <script src="main.js"></script>
</body>
</html>
```

- [ ] **Step 6: Verify locally**

Run: `cd claude-monitor-site && python -m http.server 8000` then open `http://localhost:8000/`.
Expected: blank dark (`#0A0A0B`) page, no console errors, Network tab shows the three Geist woff2 loading (200). Confirm the body background is near-black.

- [ ] **Step 7: Commit**

```bash
git add index.html styles.css main.js .gitignore README.md fonts/
git commit -m "feat: scaffold static site — tokens, base styles, fonts, reveal"
```

---

### Task 2: Capture real screenshots of the app

**Files:**
- Create: `claude-monitor-site/assets/panel-hero.webp`, `theme-vibrancy.webp`, `theme-fluent.webp`, `theme-hybrid-light.webp`, `tray-badge.webp`, and best-effort `multi-account.webp`, `corner-hover.webp`

**Interfaces:**
- Produces: the real image files referenced by Tasks 3–8. Filenames are fixed (above) so later tasks reference them without ambiguity.

> This task needs the running app and may need **user assistance** for theme switching / multi-account / corner-hover states. Capture what is reliably automatable; for the rest, give the user precise instructions and let them drop the file in, or fall back to the closest real shot. Never fabricate a fake UI.

- [ ] **Step 1: Launch the build**

```bash
exe="/c/Users/kisoo/Sharing/Development/Claude-Code-Usage-Monitor/target/release/claude-code-usage-monitor.exe"
ls -lh "$exe"   # confirm present (~0.8 MB)
powershell.exe -NoProfile -Command "Start-Process '$(cygpath -w "$exe")'"
```
Expected: the app starts (tray icon and/or corner-hover panel per its saved settings).

- [ ] **Step 2: Capture the full screen (default Hybrid Dark panel visible)**

Trigger the panel (hover the configured hot-corner, or click the tray icon), then:
```bash
powershell.exe -NoProfile -Command "Add-Type -AssemblyName System.Windows.Forms,System.Drawing; \$b=[System.Windows.Forms.Screen]::PrimaryScreen.Bounds; \$bmp=New-Object Drawing.Bitmap \$b.Width,\$b.Height; \$g=[Drawing.Graphics]::FromImage(\$bmp); \$g.CopyFromScreen(\$b.Location,[Drawing.Point]::Empty,\$b.Size); \$bmp.Save('C:\\Users\\kisoo\\AppData\\Local\\Temp\\claude\\fullscreen.png'); \$g.Dispose(); \$bmp.Dispose()"
```
Expected: a full-screen PNG in the scratch temp dir with the panel visible.

- [ ] **Step 3: Crop the panel region and convert to webp**

Use Python (Pillow available) to crop to the panel and export optimized webp. Determine the panel rect from the screenshot (Read the PNG as an image to find coordinates), then:
```python
from PIL import Image
im = Image.open(r'C:\Users\kisoo\AppData\Local\Temp\claude\fullscreen.png')
# left, top, right, bottom — set from the visible panel bounds
crop = im.crop((L, T, R, B))
crop.save(r'C:\Users\kisoo\Sharing\Development\claude-monitor-site\assets\panel-hero.webp','WEBP',quality=90,method=6)
```
Expected: `assets/panel-hero.webp` exists, shows the panel cleanly, < 200 KB.

- [ ] **Step 4: Capture each theme**

Right-click the panel → **Settings → Panel Theme** → pick each of macOS Vibrancy, Windows 11 Fluent, Refined Hybrid Light; re-run Steps 2–3 saving to `theme-vibrancy.webp`, `theme-fluent.webp`, `theme-hybrid-light.webp`. (Theme switching via the menu is hard to automate — request the user to switch themes between captures if needed.)

- [ ] **Step 5: Capture tray badge + best-effort multi-account / corner-hover**

Crop the notification-area tray icon → `tray-badge.webp`. If 2+ accounts are configured, capture the multi-account column layout → `multi-account.webp`; otherwise skip and note it. Optionally capture the corner-hover pop → `corner-hover.webp`.

- [ ] **Step 6: Verify the assets**

Read each produced webp (as image) and confirm it shows the intended state, is reasonably sized, and is not blank/torn. List any shot that fell back or was skipped.

- [ ] **Step 7: Commit**

```bash
git add assets/*.webp
git commit -m "assets: real app screenshots (panel, themes, tray)"
```

---

### Task 3: Sticky mini-nav

**Files:**
- Modify: `index.html` (`#nav`)
- Modify: `styles.css` (append nav styles)
- Modify: `main.js` (add frost-on-scroll)

**Interfaces:**
- Consumes: `.container` (Task 1).
- Produces: the `#download` anchor target (filled in Task 9) referenced by the nav CTA.

- [ ] **Step 1: Markup — replace `#nav`**

```html
<header id="nav">
  <div class="container nav-row">
    <a class="nav-brand" href="#hero">Claude Code Usage Monitor</a>
    <a class="btn btn-sm" href="#download">Download</a>
  </div>
</header>
```

- [ ] **Step 2: Styles — append to `styles.css`**

```css
#nav{position:sticky;top:0;z-index:50;transition:background .3s,border-color .3s,backdrop-filter .3s;
  border-bottom:1px solid transparent}
#nav.frost{background:rgba(10,10,11,.72);backdrop-filter:saturate(160%) blur(18px);border-bottom-color:var(--border)}
.nav-row{display:flex;align-items:center;justify-content:space-between;height:64px}
.nav-brand{font-weight:600;font-size:16px;letter-spacing:-.01em}
.btn{display:inline-flex;align-items:center;gap:.5em;background:var(--accent);color:#1a1109;
  font-weight:600;padding:14px 26px;border-radius:999px;transition:transform .15s,filter .15s;will-change:transform}
.btn:hover{filter:brightness(1.06);transform:translateY(-1px)}
.btn-sm{padding:9px 18px;font-size:15px}
```

- [ ] **Step 3: Behavior — append to `main.js` inside the DOMContentLoaded handler**

```js
  const nav=document.getElementById('nav');
  const onScroll=()=>nav.classList.toggle('frost',window.scrollY>12);
  onScroll(); window.addEventListener('scroll',onScroll,{passive:true});
```

- [ ] **Step 4: Verify**

Serve, open. Expected: nav is transparent at top; after scrolling >12px it gains the frosted translucent background + bottom border. The Download button is orange, pill-shaped, and jumps to `#download` (currently empty — fine).

- [ ] **Step 5: Commit**

```bash
git add index.html styles.css main.js
git commit -m "feat: sticky frosted nav with download CTA"
```

---

### Task 4: Hero

**Files:**
- Modify: `index.html` (`#hero`)
- Modify: `styles.css`

**Interfaces:**
- Consumes: `.btn`, `.container`, `assets/panel-hero.webp` (Task 2).

- [ ] **Step 1: Markup — replace `#hero`**

```html
<section id="hero">
  <div class="container hero-inner">
    <p class="eyebrow reveal">For Windows · Claude Code &amp; Codex</p>
    <h1 class="reveal">Your Claude Code limits,<br>always in sight.</h1>
    <p class="hero-sub reveal">A lightweight Windows widget that shows how much of your
      5-hour and 7-day usage windows you have left — without opening a terminal.</p>
    <div class="hero-cta reveal">
      <a class="btn" href="#download">Download for Windows</a>
      <span class="hero-req">Windows 10 / 11 · ~0.8 MB</span>
    </div>
    <div class="hero-art reveal">
      <img src="assets/panel-hero.webp" width="520"
           alt="The Claude Code Usage Monitor panel showing 5-hour and 7-day usage bars with a reset countdown">
    </div>
  </div>
</section>
```

- [ ] **Step 2: Styles**

```css
#hero{padding-top:clamp(60px,10vw,120px);padding-bottom:var(--pad-section);text-align:center;
  background:radial-gradient(120% 80% at 50% -10%,rgba(217,119,87,.14),transparent 60%)}
.hero-inner{display:flex;flex-direction:column;align-items:center;gap:24px}
.eyebrow{color:var(--accent);font-weight:600;font-size:14px;letter-spacing:.04em;text-transform:uppercase;margin:0}
#hero h1{font-size:clamp(40px,7vw,76px)}
.hero-sub{max-width:620px;color:var(--text-dim);font-size:clamp(17px,2.2vw,21px);margin:0}
.hero-cta{display:flex;flex-direction:column;align-items:center;gap:10px;margin-top:8px}
.hero-req{color:var(--text-faint);font-size:14px}
.hero-art{margin-top:36px}
.hero-art img{margin-inline:auto;border-radius:var(--radius);
  box-shadow:0 30px 80px -20px rgba(0,0,0,.7),0 0 0 1px var(--border)}
```

- [ ] **Step 3: Verify**

Serve, open. Expected: big centered headline (Geist, tight tracking), orange eyebrow, dimmed subtitle, orange Download CTA, requirements line, and the panel screenshot below with a soft shadow and a faint warm glow behind the hero. On scroll-in the elements fade/rise (stagger). Resize to ~375px wide — text and image stay readable, no overflow.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: hero section with panel art and primary CTA"
```

---

### Task 5: Feature pattern + "Always in sight"

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

**Interfaces:**
- Produces: the reusable `.feature` row component (visual + copy, alternating) used by Tasks 6–8. Class contract: `.feature` (grid), `.feature.reverse` (flips order), `.feature-copy`, `.feature-art`.

- [ ] **Step 1: Markup — insert after `#hero`, before `#download`**

```html
<section class="feature-block">
  <div class="container feature reveal">
    <div class="feature-copy">
      <h2>Always in sight</h2>
      <p>A small panel sits by your taskbar with a <strong>5-hour</strong> bar and a
        <strong>7-day</strong> bar, plus a live countdown to each reset. One glance tells you
        how close you are — no terminal, no provider dashboard.</p>
    </div>
    <div class="feature-art">
      <img src="assets/panel-hero.webp" loading="lazy" width="460"
           alt="Usage panel with 5-hour and 7-day bars and a reset countdown">
    </div>
  </div>
</section>
```

- [ ] **Step 2: Styles (the reusable pattern)**

```css
.feature-block{padding-block:var(--pad-section)}
.feature{display:grid;grid-template-columns:1fr 1fr;gap:clamp(32px,6vw,88px);align-items:center}
.feature.reverse .feature-copy{order:2}
.feature-copy h2{font-size:clamp(30px,4.5vw,48px);margin-bottom:18px}
.feature-copy p{color:var(--text-dim);font-size:clamp(16px,2vw,19px);margin:0}
.feature-copy strong{color:var(--text);font-weight:600}
.feature-art img{width:100%;border-radius:var(--radius);box-shadow:0 24px 60px -24px rgba(0,0,0,.7),0 0 0 1px var(--border)}
@media (max-width:760px){
  .feature{grid-template-columns:1fr}
  .feature.reverse .feature-copy{order:0}
}
```

- [ ] **Step 3: Verify**

Serve, open. Expected: two-column row (copy left, image right) that collapses to a single stacked column under 760px. Reveal fires on scroll. Image has the same shadow/border language as the hero.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: reusable feature row + 'Always in sight' section"
```

---

### Task 6: "Four themes" showcase

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `.feature-block`, `.container`; `theme-*.webp` (Task 2).

- [ ] **Step 1: Markup — insert after Task 5's block**

```html
<section class="feature-block alt">
  <div class="container">
    <div class="section-head reveal">
      <h2>Four themes, one glance</h2>
      <p>Match your desktop — macOS Vibrancy, Windows&nbsp;11 Fluent, or a refined hybrid in dark and light.</p>
    </div>
    <div class="theme-grid">
      <figure class="theme-card reveal"><img src="assets/theme-hybrid-light.webp" loading="lazy"
        alt="Panel in Refined Hybrid Light theme"><figcaption>Refined Hybrid Light</figcaption></figure>
      <figure class="theme-card reveal"><img src="assets/theme-vibrancy.webp" loading="lazy"
        alt="Panel in macOS Vibrancy theme"><figcaption>macOS Vibrancy</figcaption></figure>
      <figure class="theme-card reveal"><img src="assets/theme-fluent.webp" loading="lazy"
        alt="Panel in Windows 11 Fluent theme"><figcaption>Windows 11 Fluent</figcaption></figure>
      <figure class="theme-card reveal"><img src="assets/panel-hero.webp" loading="lazy"
        alt="Panel in Refined Hybrid Dark theme"><figcaption>Refined Hybrid Dark</figcaption></figure>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Styles**

```css
.feature-block.alt{background:var(--bg-elev)}
.section-head{text-align:center;max-width:680px;margin:0 auto clamp(40px,6vw,72px)}
.section-head h2{font-size:clamp(30px,4.5vw,48px);margin-bottom:14px}
.section-head p{color:var(--text-dim);font-size:clamp(16px,2vw,19px);margin:0}
.theme-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(16px,2.5vw,28px)}
.theme-card{margin:0}
.theme-card img{width:100%;border-radius:12px;box-shadow:0 16px 40px -20px rgba(0,0,0,.7),0 0 0 1px var(--border)}
.theme-card figcaption{margin-top:12px;text-align:center;color:var(--text-dim);font-size:14px}
@media (max-width:900px){.theme-grid{grid-template-columns:repeat(2,1fr)}}
@media (max-width:480px){.theme-grid{grid-template-columns:1fr}}
```

- [ ] **Step 3: Verify**

Serve, open. Expected: centered section heading, then a 4-up row of theme cards on an elevated (`--bg-elev`) band; collapses to 2-up under 900px, 1-up under 480px. If any theme shot was skipped in Task 2, that card uses the closest available real shot — note it.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: four-theme showcase grid"
```

---

### Task 7: "Multiple accounts & Codex"

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `.feature` (reverse variant), `multi-account.webp` (or fallback) from Task 2.

- [ ] **Step 1: Markup**

```html
<section class="feature-block">
  <div class="container feature reverse reveal">
    <div class="feature-copy">
      <h2>Every account. Both providers.</h2>
      <p>Track multiple Claude accounts side by side, and add <strong>Codex</strong> in its own column.
        Each account shows its email and its own bars; the panel widens only for the providers you use.</p>
    </div>
    <div class="feature-art">
      <img src="assets/multi-account.webp" loading="lazy" width="460"
           alt="Panel showing Claude and Codex provider columns, each with per-account usage bars">
    </div>
  </div>
</section>
```

- [ ] **Step 2: Styles** — none new (reuses `.feature.reverse`). If `multi-account.webp` was not captured, swap the `src` to `assets/panel-hero.webp` and adjust the copy to drop the multi-column claim; note the fallback in the commit.

- [ ] **Step 3: Verify**

Serve, open. Expected: a feature row with copy on the right, image on the left (reverse), collapsing cleanly on mobile.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: multi-account & Codex section"
```

---

### Task 8: "Tray badges & corner hover" + "Private by design"

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `.feature`, `tray-badge.webp` / `corner-hover.webp` (Task 2).

- [ ] **Step 1: Markup — tray/corner feature row**

```html
<section class="feature-block alt">
  <div class="container feature reveal">
    <div class="feature-copy">
      <h2>Pick how it shows up</h2>
      <p>A <strong>tray badge</strong> with your current usage percentage, or a <strong>hot-corner panel</strong>
        that appears when your cursor hits a screen corner. Drag it where you like — it remembers.</p>
    </div>
    <div class="feature-art">
      <img src="assets/tray-badge.webp" loading="lazy" width="460"
           alt="System tray icon showing a usage percentage badge">
    </div>
  </div>
</section>
```

- [ ] **Step 2: Markup — "Private by design" (copy-forward, centered)**

```html
<section class="feature-block">
  <div class="container section-head reveal">
    <h2>Private by design</h2>
    <p>It reads only your local Claude Code credentials and talks only to Anthropic's usage endpoint.
      No accounts to create, no telemetry. <a class="link" href="REPO_URL">It's open source</a> — read every line.</p>
  </div>
</section>
```
(Replace `REPO_URL` with the literal value from Global Constraints.)

- [ ] **Step 3: Styles**

```css
.link{color:var(--accent);text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px}
.link:hover{filter:brightness(1.1)}
```

- [ ] **Step 4: Verify**

Serve, open. Expected: tray feature row on an elevated band, then a centered "Private by design" statement with an orange open-source link pointing at `REPO_URL`. If `corner-hover.webp` exists, it may be used instead of/with the tray shot.

- [ ] **Step 5: Commit**

```bash
git add index.html styles.css
git commit -m "feat: tray/corner section + private-by-design"
```

---

### Task 9: Download section

**Files:**
- Modify: `index.html` (`#download`)
- Modify: `styles.css`

**Interfaces:**
- Consumes: `.btn`, `DOWNLOAD_URL` (Global Constraints).
- Produces: the `#download` target the nav + hero CTAs scroll to.

- [ ] **Step 1: Markup — replace `#download`**

```html
<section id="download">
  <div class="container dl-inner reveal">
    <h2>Get Claude Code Usage Monitor</h2>
    <a class="btn btn-lg" href="https://github.com/KisooKim/claude-code-usage-monitor/releases/latest/download/claude-code-usage-monitor.exe">
      Download for Windows</a>
    <ul class="dl-req">
      <li>Windows 10 or 11</li>
      <li>Claude Code (CLI or App) installed and signed in</li>
      <li>Optional: Codex CLI for Codex usage</li>
    </ul>
    <p class="dl-note">First launch: this build is unsigned, so Windows SmartScreen shows
      “Windows protected your PC.” Click <strong>More info → Run anyway</strong>.
      (A few Windows&nbsp;11 PCs with Smart App Control on may block it more firmly.)</p>
  </div>
</section>
```

- [ ] **Step 2: Styles**

```css
#download{padding-block:var(--pad-section);text-align:center;
  background:radial-gradient(120% 90% at 50% 120%,rgba(217,119,87,.12),transparent 60%)}
.dl-inner{display:flex;flex-direction:column;align-items:center;gap:22px}
#download h2{font-size:clamp(32px,5vw,56px)}
.btn-lg{padding:18px 38px;font-size:18px}
.dl-req{list-style:none;padding:0;margin:6px 0 0;color:var(--text-dim);display:flex;
  flex-direction:column;gap:6px;font-size:15px}
.dl-note{max-width:560px;color:var(--text-faint);font-size:14px;line-height:1.6;margin:8px 0 0}
.dl-note strong{color:var(--text-dim)}
```

- [ ] **Step 3: Verify**

Serve, open. Expected: centered download block with a large orange CTA whose `href` is exactly `DOWNLOAD_URL`, the three requirements lines, and the honest first-run note. Clicking the nav/hero "Download" scrolls here. (The link will 404 until the release exists in Task 11 — expected for now.)

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: download section with release link and first-run note"
```

---

### Task 10: Footer + attribution

**Files:**
- Modify: `index.html` (`#footer`)
- Modify: `styles.css`

**Interfaces:**
- Consumes: `REPO_URL`, `UPSTREAM_URL`.

- [ ] **Step 1: Markup — replace `#footer`**

```html
<footer id="footer">
  <div class="container footer-row">
    <span>Claude Code Usage Monitor</span>
    <nav class="footer-links">
      <a class="link" href="https://github.com/KisooKim/claude-code-usage-monitor">GitHub</a>
      <a class="link" href="https://github.com/CodeZeno/Claude-Code-Usage-Monitor">Upstream project</a>
    </nav>
  </div>
  <div class="container footer-fine">
    Based on the open-source <a class="link" href="https://github.com/CodeZeno/Claude-Code-Usage-Monitor">CodeZeno/Claude-Code-Usage-Monitor</a> · MIT License · Made by Kisoo
  </div>
</footer>
```

- [ ] **Step 2: Styles**

```css
#footer{border-top:1px solid var(--border);padding-block:48px;color:var(--text-dim)}
.footer-row{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}
.footer-links{display:flex;gap:24px}
.footer-fine{margin-top:18px;color:var(--text-faint);font-size:13px}
```

- [ ] **Step 3: Verify**

Serve, open. Expected: footer with product name + GitHub/Upstream links, and a fine-print line crediting CodeZeno + MIT + "Made by Kisoo". Both links resolve to the constant URLs.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: footer with upstream attribution and license"
```

---

### Task 11: Responsive, a11y, performance, SEO/OG pass

**Files:**
- Modify: `index.html` (head meta), `styles.css`
- Create: `assets/og-cover.png` (1200×630), `assets/favicon.png`

**Interfaces:**
- Consumes: all prior sections; `SITE_URL`, `panel-hero.webp`.

- [ ] **Step 1: Add SEO + Open Graph meta to `<head>`**

```html
  <meta name="description" content="A lightweight Windows widget that shows your Claude Code (and Codex) 5-hour and 7-day usage at a glance.">
  <link rel="canonical" href="https://kisookim.github.io/claude-code-usage-monitor/">
  <meta property="og:title" content="Claude Code Usage Monitor">
  <meta property="og:description" content="Your Claude Code limits, always in sight.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://kisookim.github.io/claude-code-usage-monitor/">
  <meta property="og:image" content="https://kisookim.github.io/claude-code-usage-monitor/assets/og-cover.png">
  <meta name="twitter:card" content="summary_large_image">
```

- [ ] **Step 2: Make favicon + OG cover**

```python
from PIL import Image
# favicon from the app icon
ico = Image.open(r'C:\Users\kisoo\Sharing\Development\Claude-Code-Usage-Monitor\src\icons\256x256.png').convert('RGBA')
ico.resize((64,64)).save(r'...\claude-monitor-site\assets\favicon.png')
# OG cover: panel art centered on the dark canvas
og = Image.new('RGB',(1200,630),(10,10,11))
panel = Image.open(r'...\claude-monitor-site\assets\panel-hero.webp').convert('RGBA')
panel.thumbnail((640,640))
og.paste(panel,((1200-panel.width)//2,(630-panel.height)//2),panel)
og.save(r'...\claude-monitor-site\assets\og-cover.png')
```
(Optionally composite the product name text; a clean centered panel on the canvas is acceptable.)

- [ ] **Step 3: Accessibility + reduced-motion audit**

Confirm: every `<img>` has a meaningful `alt`; headings are a single `h1` then `h2`s; `:focus-visible` ring is visible when tabbing; with OS "reduce motion" on, no reveals animate (the `prefers-reduced-motion` block from Task 1 handles this). Check body text contrast (`--text` on `--bg`, `--text-dim` on `--bg`/`--bg-elev`) ≥ 4.5:1.

- [ ] **Step 4: Mobile + performance check**

Resize to 375px: nav, hero, every feature row, theme grid, download, footer stack cleanly with no horizontal scroll. Confirm below-the-fold images use `loading="lazy"`. Total page weight (images optimized) is modest (target < ~1.5 MB).

- [ ] **Step 5: Verify (screenshot review)**

Capture desktop and mobile screenshots of the full page and review against the Apple-style intent (whitespace, type, restrained motion). Fix any spacing/scale issues inline.

- [ ] **Step 6: Commit**

```bash
git add index.html styles.css assets/og-cover.png assets/favicon.png
git commit -m "feat: SEO/OG meta, favicon, a11y + responsive + perf pass"
```

---

### Task 12: Deploy to GitHub Pages + publish the Release

**Files:**
- None in-tree beyond what exists; this task is repo creation + push + Pages + Release.

**Interfaces:**
- Consumes: the finished site; the built `claude-code-usage-monitor.exe`.
- Produces: live `SITE_URL` and a working `DOWNLOAD_URL`.

> Needs GitHub auth as **KisooKim**. Use `gh`; if not authenticated, `devauth login github` (account `kisoo`) or `gh auth login`. This step is user-facing/irreversible — confirm before pushing.

- [ ] **Step 1: Confirm `gh` auth identity**

```bash
gh auth status   # must show the KisooKim (sincerityandaudacity) account
```
Expected: authenticated as the account that owns `kisookim.github.io`. If not, authenticate first.

- [ ] **Step 2: Create the repo and push the site**

```bash
cd claude-monitor-site
gh repo create KisooKim/claude-code-usage-monitor --public --source=. --remote=origin --push
```
Expected: repo created, current `main` pushed.

- [ ] **Step 3: Enable GitHub Pages (deploy from `main` root)**

```bash
gh api -X POST repos/KisooKim/claude-code-usage-monitor/pages \
  -f 'source[branch]=main' -f 'source[path]=/' 2>/dev/null || \
gh api -X PUT repos/KisooKim/claude-code-usage-monitor/pages \
  -f 'source[branch]=main' -f 'source[path]=/'
```
Expected: Pages enabled. (Or enable via the repo Settings → Pages UI if the API call is rejected.)

- [ ] **Step 4: Publish the Release with the exe asset**

```bash
exe="/c/Users/kisoo/Sharing/Development/Claude-Code-Usage-Monitor/target/release/claude-code-usage-monitor.exe"
gh release create v1.4.3 "$exe" --repo KisooKim/claude-code-usage-monitor \
  --title "Claude Code Usage Monitor v1.4.3" \
  --notes "Windows build. Unsigned — on first launch, SmartScreen will warn; choose More info → Run anyway."
```
Expected: the release exists and `DOWNLOAD_URL` (`/releases/latest/download/claude-code-usage-monitor.exe`) resolves to the asset.

- [ ] **Step 5: Verify live**

```bash
curl -s -o /dev/null -w "site:%{http_code}\n" https://kisookim.github.io/claude-code-usage-monitor/
curl -sI https://github.com/KisooKim/claude-code-usage-monitor/releases/latest/download/claude-code-usage-monitor.exe | grep -i -E "HTTP|location" | head -3
```
Expected: site returns 200 (allow a few minutes for Pages to build); the download URL redirects (302) to the asset. Open the live site in a browser and confirm it renders and the Download button downloads the exe.

- [ ] **Step 6: Final commit / housekeeping**

Update `STATUS.md`/`TODO.md` for the new site project if desired, and confirm the live URL to the user.

---

## Self-Review

**1. Spec coverage:**
- IA sections (nav/hero/5 feature areas/download/footer) → Tasks 3–10. ✓
- Aesthetic + tokens + motion → Task 1 + Global Constraints. ✓
- Real screenshots → Task 2. ✓
- Distribution (Release asset + first-run note) → Tasks 9, 12. ✓
- Attribution/MIT → Task 10. ✓
- Deployment to subpath under KisooKim → Task 12. ✓
- Accessibility / responsive / perf / SEO+OG → Task 11. ✓
- Non-goals (no build/framework/CDN, single page) honored throughout. ✓

**2. Placeholder scan:** No "TBD/TODO". The only deferred concretes are coordinate values for cropping (inherently capture-time) and the `gh`/Pages enable which may need the Settings UI — both have explicit fallbacks. `REPO_URL`/`DOWNLOAD_URL` etc. are defined once and the literal strings are shown in the markup tasks.

**3. Type/name consistency:** Asset filenames (`panel-hero.webp`, `theme-*.webp`, `tray-badge.webp`, `multi-account.webp`, `og-cover.png`, `favicon.png`) are defined in Task 2/11 and referenced identically in Tasks 4–8/11. CSS class contract (`.btn`, `.container`, `.reveal`, `.feature`/`.reverse`, `.section-head`, `.feature-block.alt`, `.link`) is introduced before reuse. `#download` anchor produced in Task 9, referenced by Tasks 3–4. ✓

## Execution Handoff

Plan saved. See options below.
