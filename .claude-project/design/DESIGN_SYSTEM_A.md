# Variation A — "Premium Clean" (Tesla-leaning)

**Design DNA:** Confident minimalism. Heavy reliance on full-bleed photography. Generous whitespace. Restrained color palette. Type as architecture. Motion that feels expensive — slow, weighted, never decorative.

**When this wins:** When Suzuki wants to feel inevitable. When the bike does the talking.

---

## 1. Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--bg-canvas` | `#0A0A0A` | Page background (deep matte black) |
| `--bg-elevated` | `#141414` | Cards, modal surfaces |
| `--bg-soft` | `#1F1F1F` | Hover states, subtle dividers |
| `--ink-primary` | `#FFFFFF` | Headlines, primary text |
| `--ink-secondary` | `#B0B0B0` | Body, labels |
| `--ink-tertiary` | `#6B6B6B` | Captions, disabled |
| `--accent-suzuki` | `#0033A0` | Suzuki blue — used sparingly for CTAs and key accents |
| `--accent-suzuki-glow` | `#1A4DC9` | Glow / hover variant |
| `--accent-warm` | `#FFA726` | Warm amber — heat zones (SOCS), ignition |
| `--accent-cool` | `#00BCD4` | Cool cyan — cooled engine state, ABS |
| `--border-hairline` | `rgba(255,255,255,0.08)` | 1px hairline borders |
| `--shadow-glass` | `0 0 40px rgba(0, 51, 160, 0.15)` | Suzuki blue glow on focused elements |

**Palette philosophy:** 90% black + white + grey. Suzuki blue used as a precision tool, not wallpaper. No gradients larger than a button. No rainbow accents.

---

## 2. Typography

| Style | Font | Size | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|---|
| Display 1 (hero headline) | `'Söhne Bold', 'Inter', sans-serif` | clamp(48px, 6vw, 96px) | 700 | -0.02em | 1.05 |
| Display 2 (section header) | `'Söhne Bold', 'Inter', sans-serif` | clamp(36px, 4vw, 64px) | 700 | -0.01em | 1.1 |
| Heading 1 | Same | clamp(28px, 3vw, 40px) | 600 | -0.005em | 1.2 |
| Heading 2 | Same | 24px | 600 | 0 | 1.3 |
| Body Large | `'Söhne', 'Inter', sans-serif` | 18px | 400 | 0 | 1.6 |
| Body | Same | 16px | 400 | 0 | 1.6 |
| Caption | Same | 14px | 400 | 0.01em | 1.5 |
| Tag (eyebrow) | `'Söhne Mono', 'JetBrains Mono', monospace` | 12px | 500 | 0.15em (uppercase) | 1.4 |

**Pairing:** A single bold sans-serif family does most of the work. Mono only on technical eyebrows ("SUZUKI OIL COOLING SYSTEM").

---

## 3. Spacing & Layout

- **Base unit:** 8px (Tailwind default)
- **Section vertical rhythm:** 120px (desktop) / 80px (tablet) / 64px (mobile)
- **Container max-width:** 1440px with 64px desktop / 32px tablet / 16px mobile horizontal padding
- **Grid:** 12-column with 32px gutters desktop, 6-column 16px gutters mobile
- **Component density:** Generous. Empty space is a feature, not a bug.

---

## 4. Components

### Buttons

| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| Primary | `--accent-suzuki` | `--ink-primary` | none | bg shifts to `--accent-suzuki-glow` + 200ms ease-out |
| Secondary | transparent | `--ink-primary` | 1px `--ink-primary` | bg fills to `--ink-primary`, text inverts to `--bg-canvas` |
| Ghost | transparent | `--ink-secondary` | none | text shifts to `--ink-primary` + underline animates in |

Border-radius: 0 (sharp corners). Padding: `16px 32px` desktop / `12px 24px` mobile. Font: 16px / 600 / uppercase / 0.05em letter-spacing.

### Cards

- `--bg-elevated` background
- 1px `--border-hairline` border
- 0px border-radius (consistent with buttons)
- 32px internal padding
- Hover: subtle `--shadow-glass` glow + 1px border shifts to `rgba(255,255,255,0.16)`

### Forms

- Inputs: transparent bg, 1px bottom border `--border-hairline`, no rounded corners
- Focus: bottom border shifts to `--accent-suzuki`, `--shadow-glass` underneath
- Labels: tag-style (Mono uppercase 12px) above input
- Error: bottom border shifts to `#FF3B30`, helper text below in same color

### Navbar

- Fixed top, 80px tall desktop / 64px mobile
- Background: `rgba(10, 10, 10, 0.85)` with `backdrop-filter: blur(24px)`
- Nav links: 14px / 500 / uppercase / 0.08em letter-spacing
- Hover on `Bikes` link: triggers a 380px-tall preview drawer with featured-bike SVG fade-in

---

## 5. Motion Principles

- **Easing:** `cubic-bezier(0.25, 0.1, 0.25, 1)` — slow start, smooth end. No `ease-in-out`. No bouncy springs.
- **Durations:**
  - Micro (button hover, link underline): 200ms
  - Standard (card lift, drawer open): 400ms
  - Reveal (section enter, hero fade): 800ms
  - Cinematic (scroll-driven activation): 1200ms+
- **Scroll-driven (Sections 4 + 5):** Sticky-pinned, scroll progress maps linearly to a CSS custom property `--scroll-progress` (0 → 1) that drives keyframe positions, opacity, and SVG transforms.
- **Reduced motion:** All scroll-driven animations replaced by static fallback (callouts visible all at once, fade-in on viewport entry only).
- **Forbidden:** Disney-bounce, scale-on-hover, rotate-on-hover, particle confetti, marquee scrolling.

---

## 6. Section 4 (Technology) Treatment

- Background: pure `--bg-canvas`. No environment imagery.
- Bike rendered as a single-tone SVG silhouette, weight 1.5px stroke, fill `none`.
- Each activation: SVG `<g>` group with a pulsing `--accent-suzuki-glow` filter. Origin point = small circle SVG marker. Connecting line = SVG `<path>` with `stroke-dasharray` animation. Callout = floating card, 1px hairline border, 32px padding.
- 6 activations stack vertically as scroll progresses. Each occupies ~15% of total scroll range.
- Climax: all 6 origin markers light up in unison, bike silhouette fills with `--accent-suzuki` for 1.5s, then fades.

## 7. Section 5 (Engine Showcase) Treatment

- Background: gradient from `--bg-canvas` (top) to `#000000` (bottom).
- Engine rendered as layered SVG, each component a separate `<g>` with id (`#cylinder-head`, `#piston`, `#crankshaft`, etc.).
- Reveal animation: each component translates outward via CSS `transform: translate3d()` driven by scroll-progress custom properties.
- Callout panel slides in from the right (40% width on desktop, full-width below 768px).
- Reassembly: scroll-back reverses the explode; final state shows engine intact with subtle `--accent-warm` glow filter for 2s, then fades.

---

## 8. Iconography

- Stroke-only SVG, 1.5px weight
- 24px standalone, 16px inline
- Two icon sets: outline (default) and filled (active state)
- Custom Suzuki MotoGP DNA chevron mark for hero badges

---

## 9. Imagery Direction

- Photography: full-bleed, extreme contrast, single light source, deep shadows
- Bikes always in motion or in dramatic stillness (never showroom-flat)
- Riders always silhouetted (never face-forward) — preserves identity neutrality
- Environment colors muted to monochrome; bike retains color

---

## 10. Accessibility

- Min contrast: AA (4.5:1) verified for all text on black backgrounds
- Focus states: 2px `--accent-suzuki` outline, 2px offset, no border-radius
- Reduced-motion fallback: all scroll-driven sections degrade to static callout grid

---

**Variation A inspiration:** Tesla.com, Apple Pro Display XDR product pages, Bang & Olufsen.
