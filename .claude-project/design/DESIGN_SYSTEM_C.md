# Variation C — "Local Warm" (Yamaha BD-leaning, BD-rooted)

**Design DNA:** Premium with warmth. Suzuki blue retained but balanced by warm cream + sand tones. Trust signals foregrounded. BD-specific motifs (rickshaw color cues, monsoon-blue sky, Hill Tracts dawn). Type that's bold but human, never cold. Less scroll-driven cinematic, more grounded photography.

**When this wins:** When Suzuki wants to be loved as the local hero. When the audience is the daily commuter and the existing-owner first.

---

## 1. Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--bg-canvas` | `#0F1216` | Deep blue-black (warmer than pure black) |
| `--bg-elevated` | `#1A1F26` | Cards |
| `--bg-cream` | `#F4ECDF` | Inverted sections (testimonials, news, service trust) — provides warm contrast |
| `--bg-cream-soft` | `#EDE2D0` | Cream alternate for layering |
| `--ink-primary` | `#FFFFFF` | On dark surfaces |
| `--ink-on-cream` | `#1F1614` | On cream surfaces — warm dark, not pure black |
| `--ink-secondary` | `#A8B0BC` | Dark surface body |
| `--ink-on-cream-soft` | `#5A4D44` | Cream surface body |
| `--accent-suzuki` | `#0033A0` | Primary brand blue — used confidently, not sparingly |
| `--accent-suzuki-deep` | `#001F66` | Pressed states, active rows |
| `--accent-warm` | `#D97706` | Warm amber — slightly more orange than A/B (BD harvest tone) |
| `--accent-river` | `#0EA5A4` | Teal — Bay of Bengal cue, water + monsoon callouts |
| `--accent-jasmine` | `#F4DD80` | Pale yellow — used for trust badges, hotline emphasis |
| `--accent-rice` | `#86A874` | Muted green — eco / efficiency callouts (SEP) |
| `--border-soft` | `rgba(255,255,255,0.12)` | Hairline borders on dark |
| `--border-on-cream` | `rgba(31,22,20,0.12)` | Hairline on cream |

**Palette philosophy:** Multi-tonal but disciplined. Cream sections create breathing rooms between dark cinematic sections. BD-rooted secondary accents (jasmine, river-teal, rice-green) appear in trust/community moments only.

---

## 2. Typography

| Style | Font | Size | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|---|
| Display 1 (hero headline) | `'Hanken Grotesk Black', 'Inter', sans-serif` | clamp(48px, 6vw, 88px) | 900 | -0.025em | 1.05 |
| Display 2 (section header) | `'Hanken Grotesk Bold', 'Inter', sans-serif` | clamp(32px, 4vw, 56px) | 700 | -0.015em | 1.1 |
| Heading 1 | `'Hanken Grotesk Bold', sans-serif` | clamp(24px, 2.5vw, 36px) | 700 | -0.005em | 1.2 |
| Heading 2 | `'Hanken Grotesk', sans-serif` | 20px | 600 | 0 | 1.3 |
| Body Large | `'Inter', sans-serif` | 18px | 400 | 0 | 1.65 |
| Body | `'Inter', sans-serif` | 16px | 400 | 0 | 1.65 |
| Caption | `'Inter', sans-serif` | 14px | 400 | 0 | 1.5 |
| Tag (eyebrow) | `'Inter', sans-serif` | 12px | 700 | 0.12em (uppercase) | 1.4 |
| Quote (testimonials) | `'Source Serif Pro Italic', Georgia, serif` | 22px | 400 italic | 0 | 1.5 |

**Pairing:** Hanken Grotesk has a human warmth that Inter Display doesn't — it feels like a brand that talks to you. Source Serif italic on quotes adds editorial trust. No monospace except optional code-style tags on technical specs.

---

## 3. Spacing & Layout

- **Base unit:** 8px
- **Section vertical rhythm:** 96px (desktop) / 72px (tablet) / 56px (mobile)
- **Container max-width:** 1280px (tighter than A/B — more editorial-magazine feel)
- **Centered grid** with predictable 12-col / 32px gutters — no asymmetric play
- **Cream-section breaks:** Every 2–3 sections, alternate cream and dark for editorial pacing
- **Component density:** Editorial — copy and image have equal weight, generous baseline grid

---

## 4. Components

### Buttons

| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| Primary | `--accent-suzuki` | `--ink-primary` | none | bg shifts to `--accent-suzuki-deep`, subtle scale to 1.01 (allowed in this variation for warmth) |
| Primary on Cream | `--accent-suzuki` | `--ink-primary` | none | same |
| Secondary | transparent | `--ink-primary` (or `--ink-on-cream`) | 1.5px current ink | bg fills to current ink with 8% opacity |
| Hotline (special) | `--accent-warm` | `--ink-on-cream` | none | warmth glow + phone-icon shake (subtle, 1 cycle) |
| Ghost | transparent | `--ink-secondary` | none | underline animates, no color change |

Border-radius: 8px (rounded — softer than A's 0px, B's 2px). Padding: `14px 28px`. Font: 15px / 700 / 0.02em letter-spacing (NOT uppercase — sentence case for warmth).

### Cards

- `--bg-elevated` on dark, `--bg-cream-soft` on cream
- 12px border-radius (more rounded than A/B for friendliness)
- 1px hairline border
- Hover: 4px lift via shadow, no border color change
- Trust cards (testimonials, service trust): cream bg, 16px border-radius (extra-rounded)

### Forms

- Inputs: full bordered (1.5px), 8px radius
- Focus: border shifts to `--accent-suzuki`, soft halo (not sharp glow)
- Labels: above input, 14px / 600 (sentence case)
- Helper: 13px in `--ink-secondary` below input
- Validation: green check / amber warning — color-blind accessible icons paired

### Navbar

- Fixed top, 80px tall
- Background: `rgba(15, 18, 22, 0.95)` with `backdrop-filter: blur(20px)`
- Nav links: 15px / 600 / sentence case (NOT uppercase — friendlier)
- "Hotline 16638" badge in navbar top-right with `--accent-jasmine` background and phone icon — clickable, opens tap-to-call
- "Bikes" hover: drawer with 5 category cards in 2x3 grid, each card has a still photo + bike count + "View" CTA

### Trust Badges (variation-specific component)

- Pill shape, 4px / 8px padding, 10px border-radius
- `--accent-jasmine` background or `--bg-cream-soft` for cream sections
- Examples: "100+ Year Heritage", "Hotline 16638", "Free Test Ride", "Genuine Parts Only"

---

## 5. Motion Principles

- **Easing:** Standard `ease-out` for most micro-interactions, `ease-in-out` for cinematic moments. Slightly more relaxed than A/B
- **Durations:**
  - Micro: 220ms
  - Standard: 380ms
  - Reveal: 700ms
  - Cinematic scroll: 1100ms
- **Scroll-driven (Sections 4 + 5):** Less aggressive than A/B. Section 4 doesn't pin for 4-5 viewport heights — instead, it pins for 2 viewport heights and uses a horizontal scroll (snap-aligned) for the 6 activations. More accessible on lower-end devices
- **Allowed kinetic patterns:** Image cross-dissolves, gentle fade-ups (40px translate + opacity 0→1), scroll-triggered counter animations
- **Forbidden:** Heavy parallax, sound by default, cursor trail effects, marquee on body copy

---

## 6. Section 4 (Technology) Treatment

- Background: subtle `--bg-elevated` with a static BD-road photograph (Hill Tracts dawn) at 8% opacity, no animation
- Layout: bike silhouette anchored bottom-left, callouts arrayed to the right in a 2-column stack (3 callouts top, 3 bottom)
- Each activation: scroll-triggered fade-up + animated origin pulse + callout reveal
- Tag eyebrows in `--accent-warm`, headlines in `--ink-primary`, sub-line in `--ink-secondary`
- Climax: all 6 origins fade to `--accent-suzuki` simultaneously, headline overlay "Six Systems. One Bike." appears bottom-center for 2s, then fades

## 7. Section 5 (Engine Showcase) Treatment

- Cream-section break — section background is `--bg-cream` for warm editorial framing
- Engine rendered in dark `--bg-canvas` panel centered on cream background (60% width)
- Reveals scroll-triggered, less choreographed than A/B — components fade-translate without rotation
- Callouts in cream side panels with editorial styling (italicized lead-line + body)
- Reassembly + ignition: panel returns to dark, ignition glow in `--accent-warm`, RPM needle animates with subtle bounce (allowed here for warmth), rider stories carousel begins immediately after on cream background — natural editorial flow

---

## 8. Iconography

- Heroicons (outline + solid) — familiar to the BD developer ecosystem and matches Yamaha BD reference
- 24px standalone, 20px inline
- Custom icons only for: Hotline (phone with dial visible), MotoGP DNA (chevron leaning), Service (gear-check), Genuine Parts (Suzuki S mark)

---

## 9. Imagery Direction

- Photography: real Bangladesh — Dhaka traffic, monsoon-wet roads, Hill Tracts dawn, Cox's Bazar coast. Riders shown face-forward with personality (not silhouettes — variation A/B's neutrality is replaced with relatability)
- Editorial layouts: image + caption in italics, lots of whitespace, magazine-style spreads on cream sections
- Bike photography: in context (rider on bike on road) more than studio
- Trust photography: real dealers, real service centers, real community meetups

---

## 10. Accessibility

- Contrast: AAA on cream sections (best for long-form reading), AA elsewhere
- Focus: 3px `--accent-suzuki` outline, 4px offset, rounded 8px
- Reduced motion: scroll-triggered fade-ups disable; everything visible immediately on viewport entry
- Color-blind: every state communicated by both color AND icon (success check, warning triangle, error X)
- Hotline 16638 visible from every screen — accessibility for low-literacy users

---

**Variation C inspiration:** Yamaha Bangladesh, Royal Enfield product pages, *Vogue India* editorial, Daraz BD trust patterns, BD newspaper inserts.
