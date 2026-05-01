# Suzuki Bangladesh — Customer Website (Design Prototype)

Static HTML / CSS / JS prototype of the Suzuki Bangladesh customer-facing site.
Built as a hand-coded design prototype, with full responsive layouts,
scroll-driven animations (GSAP + Lenis), and a dark-default / light-mode
theming system.

## Run locally

This is a pure static site — no build step. Serve the folder with any
static file server:

```bash
# Option A — Node (npx)
npx serve .

# Option B — Python
python -m http.server 5500

# Option C — VS Code Live Server extension (right-click index.html → Open with Live Server)
```

Then open <http://localhost:5500> (or whichever port the server reports).

## Folder structure

```
website/
├── index.html                 # Homepage
├── bikes.html                 # Lineup browse page
├── dealers.html               # Dealer locator
├── offers.html                # Promotions / deals
├── service.html               # Service page (authorised centres + checklist)
├── shop.html                  # Genuine parts / engine oils / accessories
├── technology.html            # Tech showcase (SOCS, FI, ABS, etc.)
├── test-ride.html             # Test-ride booking
│
├── bikes/                     # Bike detail pages (one per model)
│   └── gsx-r150.html          # ✅ Implemented
│   └── …                      # (other models pending — see "Pending pages" below)
│
├── css/
│   ├── tokens.css             # Design tokens (colors, type, spacing, motion)
│   ├── base.css               # Resets + global typography
│   ├── components.css         # Shared button + form styles
│   ├── widgets.css            # Floating widgets (chat, cookies, scroll-top)
│   ├── theme-light.css        # Light-mode overrides (data-theme="light")
│   ├── sections/              # Per-section styles (one .css per section on index)
│   └── pages/                 # Page-specific styles (one .css per top-level page)
│
├── js/
│   ├── lenis-init.js          # Smooth scroll bootstrap
│   ├── nav.js                 # Navbar + mega-menu + mobile overlay
│   ├── main.js                # Site-wide IO observers + small utilities
│   ├── sections/              # Per-section JS modules (loaded by index.html)
│   ├── pages/                 # Per-page JS modules
│   └── widgets/               # Floating widget logic
│       ├── chat.js
│       ├── cookies.js
│       ├── scroll-top.js
│       └── theme-toggle.js
│
└── assets/
    ├── images/                # Bike photography, section imagery, logos
    ├── fonts/                 # Self-hosted webfonts (if any)
    ├── videos/                # Background video clips (hero, MotoGP)
    └── 3d/                    # 3D model assets (reserved)
```

## Theming

Dark mode is the default. The theme toggle in the navbar (sun/moon icon)
flips `data-theme="light"` on the `<html>` element and persists the choice
to `localStorage` (key: `suzuki-theme`). An inline boot script in each
page's `<head>` applies the saved theme before first paint to avoid a
flash of wrong colour.

## External libraries

Loaded via CDN inside each page's `<head>`:

- **GSAP 3.12** + **ScrollTrigger** — scroll-driven entrance animations
- **Lenis 1.0.42** — smooth scroll wheel handler
- **Three.js 0.160** — reserved for the engine-showcase 3D variant
- **Lucide** — icon set
- **Tailwind (CDN play)** — utility classes used sparingly inside HTML

## Hosting

The repo is ready for any static host:

- **GitHub Pages** — push to `main`, then Settings → Pages → Source = "Deploy from a branch" → `/` (root)
- **Netlify / Vercel** — drop the folder; build command empty; publish dir `.`
- **Plain Apache / Nginx** — copy the folder into the docroot

## Pending pages (placeholders in current build)

These are linked from the existing pages but have not been implemented yet:

**Bike detail pages** (template established at `bikes/gsx-r150.html`):

- `bikes/gixxer-sf-250.html`
- `bikes/gixxer-250.html`
- `bikes/gixxer-sf.html`
- `bikes/gixxer.html`
- `bikes/gixxer-classic-matt.html`
- `bikes/gixxer-monotone.html`
- `bikes/access-125.html`
- `bikes/gsx-125.html`
- `bikes/hayate-ep.html`

**News articles** (linked from the news section on `index.html`):

- `news/gixxer-250-motogp-edition.html`
- `news/gixxer-fi-disc-launch.html`
- `news/siam-ahmed-face-of-suzuki.html`

**Footer / nav linked pages** — none of these exist yet; they're placeholders
for future content:

- `about.html`, `news.html`, `careers.html`, `press.html`, `sitemap.html`
- `legal/privacy.html`, `legal/terms.html`, `legal/cookies.html`

**Other small gaps**:

- `assets/images/favicon.svg` — referenced in `<link rel="icon">` but
  not yet present (browsers fall back to no favicon)

## License

All code is © Suzuki Bangladesh / Rancon Motor Bikes Ltd. Imagery and
brand assets remain the property of Suzuki Motor Corporation. Redistribution
of this prototype is restricted to authorised collaborators.
