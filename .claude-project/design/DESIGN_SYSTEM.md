# Variation B — "MotoGP Aggressive" (Ultraviolette-leaning)

**Design DNA:** Cinematic darkness. Racing-line motifs in the type and grid. Heat-on-cold contrast (amber + cyan against pure black). Scroll feels like cornering — pinned, weighted, decisive. Sound-design ready (engine drones, mechanical clicks).

**When this wins:** When Suzuki wants the young performance audience to *feel* the championship. When the brand needs to be the loudest in the room without yelling.

---

## 1. Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--bg-canvas` | `#050505` | True black (slightly lifted to avoid OLED smear) |
| `--bg-elevated` | `#0E0E10` | Cards, modal surfaces |
| `--bg-track` | `#16161A` | Section dividers — evokes asphalt |
| `--ink-primary` | `#FAFAFA` | Headlines (off-white, never pure white — feels less digital) |
| `--ink-secondary` | `#9A9AA0` | Body |
| `--ink-tertiary` | `#5A5A60` | Captions |
| `--accent-suzuki` | `#0033A0` | Suzuki blue — primary accent, used for racing-line motifs |
| `--accent-suzuki-electric` | `#3D6FFF` | Electric variant — high-energy callouts |
| `--accent-heat` | `#FF6B1A` | Heat amber — engine ignition, brake glow, RPM redline (slightly hotter than Variation A) |
| `--accent-cool` | `#22D3EE` | Cyan — ABS modulation, cooled state |
| `--accent-victory` | `#FFD24A` | MotoGP gold — championship moments only (Section 7 + final climax) |
| `--racing-line` | `linear-gradient(90deg, #0033A0 0%, #3D6FFF 50%, #0033A0 100%)` | Section dividers, scroll progress indicator |
| `--shadow-thermal` | `0 0 60px rgba(255, 107, 26, 0.25)` | Heat glow on engine elements |
| `--shadow-track` | `0 24px 48px rgba(0, 0, 0, 0.6)` | Card depth |

**Palette philosophy:** Pure black + Suzuki blue + heat amber. Cyan and gold reserved for specific moments. Never use more than 3 accent colors in a single viewport.

---

## 2. Typography

| Style | Font | Size | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|---|
| Display 1 (hero headline) | `'Druk Wide Bold', 'Inter Display', sans-serif` | clamp(56px, 8vw, 144px) | 800 | -0.04em | 0.95 |
| Display 2 (section header) | `'Druk Wide Bold', 'Inter Display', sans-serif` | clamp(40px, 5vw, 80px) | 800 | -0.03em | 1.0 |
| Heading 1 | `'Inter Display', sans-serif` | clamp(28px, 3vw, 44px) | 700 | -0.01em | 1.15 |
| Heading 2 | `'Inter Display', sans-serif` | 22px | 600 | 0 | 1.3 |
| Body Large | `'Inter', sans-serif` | 18px | 400 | 0.005em | 1.55 |
| Body | `'Inter', sans-serif` | 16px | 400 | 0.005em | 1.55 |
| Caption | `'Inter', sans-serif` | 13px | 500 | 0.02em | 1.45 |
| Tag (eyebrow) | `'Diatype Mono', 'JetBrains Mono', monospace` | 11px | 600 | 0.2em (uppercase) | 1.4 |
| Stat / Counter | `'Druk Wide Bold', sans-serif` | clamp(48px, 6vw, 96px) | 800 | -0.04em | 1 |

**Pairing:** Druk Wide for compressed, racing-poster headlines. Inter Display for sub-heads. Inter for body. Mono only on technical eyebrows.

**Italics:** Allowed on action verbs in headlines ("*Born* on the racetrack"). Italic Druk has a forward lean that mirrors a leaning bike.

---

## 3. Spacing & Layout

- **Base unit:** 4px (denser than Variation A)
- **Section vertical rhythm:** 160px (desktop) / 96px (tablet) / 72px (mobile)
- **Container max-width:** 1600px (wider than A — more cinematic)
- **Asymmetric grid:** 12-column with intentional offsets — section content often nudged left or right of center for kinetic feel
- **Component density:** Tighter — copy hugs imagery, callouts overlap edges of media

---

## 4. Components

### Buttons

| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| Primary | `--accent-suzuki` | `--ink-primary` | 1px `--accent-suzuki-electric` | bg shifts to `--accent-suzuki-electric`, racing-line shimmer animates across (300ms) |
| Primary Heat | `--accent-heat` | `#0F0F12` | none | thermal pulse (`--shadow-thermal`) intensifies, slight scale 1.02 (allowed in this variation only — calibrated for kinetic feel) |
| Secondary | transparent | `--ink-primary` | 1.5px `--ink-primary` | border shifts to `--accent-heat`, text shifts to `--accent-heat`, racing-line underline animates in |
| Ghost | transparent | `--ink-secondary` | none | underline scales from left, text shifts to `--ink-primary` |

Border-radius: 2px (just enough to feel intentional). Padding: `18px 36px` desktop. Font: 14px / 700 / uppercase / 0.08em letter-spacing.

### Cards

- `--bg-elevated` background with optional 1px gradient border via `border-image`
- 4px border-radius
- `--shadow-track` depth
- Hover: card lifts 2px, shadow deepens, optional racing-line stripe flickers along the top edge
- Active card has `--accent-suzuki-electric` left border (3px, full height)

### Forms

- Inputs: `--bg-elevated` bg, 1.5px border `rgba(255,255,255,0.1)`, 4px border-radius
- Focus: border shifts to `--accent-suzuki-electric`, glow pulse for 300ms then settles, label scales up 0.9 → 1.05
- Validation: success = `--accent-cool` border + checkmark icon; error = `--accent-heat` border + alert icon

### Navbar

- Fixed top, 72px tall — slightly shorter than A for more screen real estate
- Background: `rgba(5, 5, 5, 0.92)` + `backdrop-filter: blur(32px) saturate(180%)`
- Bottom edge: 1px `--racing-line` gradient
- Nav links: 13px / 700 / uppercase / 0.1em letter-spacing
- Active link: amber underline with racing-line gradient
- "Bikes" hover: full-width drawer drops 480px tall with 5 categories, each card has a looping silhouette animation (subtle horizontal drift)

---

## 5. Motion Principles

- **Easing:** Custom cubic-bezier `cubic-bezier(0.16, 1, 0.3, 1)` for entrances (overshoot-free spring), `cubic-bezier(0.7, 0, 0.84, 0)` for exits (rapid fade). Designed to feel like a throttle response.
- **Durations:**
  - Micro: 240ms
  - Standard: 480ms
  - Reveal: 900ms
  - Cinematic scroll: 1500ms+
- **Sound design hooks:** Optional ambient idle drone behind sections, subtle mechanical click on activation, RPM rise-fall synced to scroll. Mute by default with prominent unmute control.
- **Scroll-driven (Sections 4 + 5):** Same architecture as A but with **environment transitions** — background swaps between abstract environment states (urban → monsoon → highway dusk → foggy morning) via opacity layering. Each environment is a CSS gradient + animated SVG noise pattern, not a video.
- **Racing-line scroll progress indicator:** Right-edge vertical bar, 2px wide, fills with `--racing-line` gradient as user scrolls through Sections 4 + 5.
- **Allowed kinetic patterns:** subtle marquee on section dividers (eyebrow text loops slowly), counter ticks (mileage / RPM), engine-pulse opacity oscillations.
- **Reduced motion:** All cinematic scroll degrades to static; counters jump to final value; sound auto-mutes.

---

## 6. Section 4 (Technology) Treatment

- Background cycles 4 abstract environments via CSS gradient + animated SVG noise overlay (0% → 25% urban-day, 25% → 50% monsoon-rain, 50% → 75% highway-dusk, 75% → 100% foggy-morning)
- Bike silhouette: 2px `--ink-primary` stroke + Suzuki blue accent areas. Slight horizontal drift to simulate riding
- 6 activations originate from anatomically correct points on the bike. Each origin = pulsing SVG circle with thermal-glow filter. Connecting line = SVG path with `stroke-dasharray` flowing animation
- Callout cards float with 4px border-radius, racing-line top edge, 32px padding, large eyebrow tag (Mono uppercase) + Druk Wide headline + Inter body
- Climax (all 6 unite): all origins light up, bike fills with `--accent-suzuki-electric`, 1.5s sustained glow, then `--accent-victory` flash for 200ms, fade to next section

## 7. Section 5 (Engine Showcase) Treatment

- Background: pure `--bg-canvas` with subtle radial gradient from center
- Engine SVG fills 60% of viewport width, centered. Heat glow filter (`--shadow-thermal`) on hot components
- Reveal: each component translates outward + rotates 5–15° for dynamic feel. Translation distance scales with component size (oil cooling system separates further than the ECU chip)
- Callout slides from right, occupies 36% width. Tag in `--accent-heat`. Body in `--ink-primary`
- Reassembly: 2.5s of choreographed re-merger. Final ignition = full engine fill with `--accent-heat` for 800ms, white flash for 100ms (peak ignition), settle to idle `--accent-suzuki` glow. RPM needle SVG arc animates 0 → 9000 → 4000 (idle)
- Audio cue (optional): deep V-twin start from 0.5s before ignition flash through 1s after settle

---

## 8. Iconography

- Custom icon set (do not use Lucide / Heroicons)
- Mix of outline (1.5px) and duotone (Suzuki blue + amber) — duotone for active state
- Racing-themed symbols: chevron, leaning rider silhouette, MotoGP fairing outline, RPM gauge dial

---

## 9. Imagery Direction

- Photography: high-contrast, dramatic side-lighting. Brake-disc heat blooms welcomed
- Bikes leaning into corners, knee-down silhouettes, rain-spray dynamics
- Environment imagery: stylized — Bangladesh roads abstracted into shape and light, not literal photos
- MotoGP-adjacent: track curve markers, pit-lane numerals, sector-time typography

---

## 10. Accessibility

- Contrast verified AA on all text — `--ink-primary` on `--bg-canvas` = 17.5:1
- Focus: 2px `--accent-suzuki-electric` outline, 3px offset
- Reduced motion: scroll-driven sections fully degrade. Audio off by default
- Keyboard: full nav including drawer triggers and modal returns

---

**Variation B inspiration:** Ultraviolette.com, Lamborghini Huracán microsites, Sennheiser high-end product pages, racing posters of the 1970s.
