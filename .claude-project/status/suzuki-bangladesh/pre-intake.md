# Pre-intake Form — Suzuki Bangladesh

> Please fill out the form below before our first meeting.
> It takes about 5 minutes and helps us prepare for the kickoff.

---

**App/Service Name:** Suzuki Bangladesh (project codename: `suzuki-bangladesh`)
Public product: redesigned **suzuki.com.bd** — premium digital experience platform for Suzuki Bangladesh, operated by Rancon Motor Bikes Limited (RMBL).

2. **What does this app do?** (1-2 sentences)
A premium digital experience platform for Suzuki Bangladesh that showcases the full motorcycle lineup, MotoGP heritage, and engine technology to create brand awareness and excite bikers. Users can explore bikes, book test rides, locate dealers, apply for EMI/financing, schedule service appointments, and shop genuine parts and accessories.

3. **Target platforms:** Web (responsive, mobile-first)
Primary focus is a redesigned responsive website. Native mobile apps are not in current scope but the web experience must be flawless on mobile since the majority of Bangladeshi traffic is mobile.

4. **Desired store registration:** Web only
No app store registration needed. Progressive Web App (PWA) capabilities are **out of scope for v1**; can be revisited post-launch for offline dealer locator and service booking.

4a. **If mobile (iOS/Android): Native features needed?**
Not applicable — web only. However, the responsive web should leverage:
- [x] GPS / location (for dealer locator and nearest service center)
- [x] Camera / photo upload (for service requests, warranty claims, and accessories shop reviews)
- [ ] Biometric login — not needed
- [ ] Offline mode — not needed initially

4b. **Push notifications needed?** Yes (web push notifications)
Trigger events:
- New bike launches and model announcements
- Active offers (Eid offers, Bank EMI deals, festive promotions)
- Test ride confirmation and reminders
- Service appointment reminders and completion updates
- Order status changes for shop purchases (accessories, engine oil, genuine parts)
- MotoGP race updates and Suzuki Ecstar team news (for engaged biker community)

5. **Who are the main users?**
- **Aspirational young riders (18–28):** Performance enthusiasts eyeing Gixxer 250, Gixxer SF 250, GSX-R150 — the hero audience for brand storytelling
- **Daily commuters (25–40):** Practical buyers looking at Gixxer base, GSX 125, Hayate EP, Access 125
- **Existing Suzuki owners:** For service booking, genuine parts, accessories, and upgrades
- **Dealers and service partners:** Need clear support channels and dealer locator visibility
- **Internal staff:** Content admin (news CMS), service manager (booking inbox), EMI lead manager, dealer staff (inventory + test ride confirmations)

6. **Is this replacing a manual process or existing system?**
Yes — replacing the existing **suzuki.com.bd** website built on Next.js. The current site is functional but transactional in feel; it does not match the brand's MotoGP heritage or the premium positioning Suzuki Bangladesh wants to establish.

- **Current tools:** Existing Next.js website, API at `api-v2.suzuki.com.bd`, hotline **16638** for direct customer queries, physical dealer network across Bangladesh
- **Current scale:** Suzuki Bangladesh (operated by Rancon Motor Bikes Ltd.) has nationwide dealership coverage with thousands of monthly bike sales and service interactions across the country
- **Migration considerations:** Need to preserve existing product database, news archive (going back to 2018, ~200+ articles), service booking system, and shop functionality while completely reimagining the front-end experience

7. **Reference apps/sites:**
- **Ultraviolette (ultraviolette.com)** — cinematic storytelling, premium dark aesthetic, scroll-driven narrative, hero video treatment, typography hierarchy, making a motorcycle feel like a piece of art
- **Tesla (tesla.com)** — minimal confident UI, full-bleed product photography, scroll-triggered transitions, clean information architecture, presenting tech specs without overwhelming users
- **Yamaha Bangladesh (yamahabd.com)** — local market context, BD-specific user expectations, EMI/financing presentation, dealer locator flow
- **What to specifically reference:**
  - From Ultraviolette: hero treatment, engine showcase animation style, cinematic copy voice
  - From Tesla: bike configurator flow, scroll-based section reveals, minimal navigation
  - From Yamaha BD: pricing display, EMI calculator, local trust signals

8. **Desired launch date:**
To be confirmed by client. Recommended phased approach:
- **Phase 1 (8–10 weeks):** Homepage redesign + bike detail pages
- **Phase 2 (4–6 weeks):** Service booking, shop, dealer locator
- **Phase 3 (4 weeks):** News, Life at Suzuki, MotoGP heritage section
Target full launch within 4–5 months from kickoff.

9. **Any additional context:**

**Brand assets and heritage to leverage:**
- 100+ year Suzuki global heritage (founded 1920 by Michio Suzuki)
- MotoGP DNA: Joan Mir (2020 World Champion on Suzuki), Team SUZUKI ECSTAR, Alex Rins podium history
- Suzuki Oil Cooling System (SOCS) — proprietary technology and key differentiator
- Siam Ahmed as "Face of Suzuki" — Bangladeshi actor and brand ambassador
- Rancon Motor Bikes Ltd. as the trusted local manufacturer/distributor
- Hotline **16638** (must remain prominent in header + footer + service flows)

**Current bike lineup (10 models):**
Gixxer 250 (BDT 379,950), Gixxer SF 250 (BDT 429,950), GSX-R150 (BDT 524,950), Gixxer SF (BDT 329,950), Gixxer (BDT 229,950), Gixxer Monotone (BDT 199,950), Gixxer Classic Matt (BDT 202,950), Access 125 (BDT 215,000), Hayate EP (BDT 118,000), GSX 125 (BDT 141,950)

**Key business goals for the redesign:**
- Create brand awareness and excitement among bikers (emotional, not just transactional)
- Showcase engine technology and MotoGP heritage as core differentiators
- Position Suzuki as premium and aspirational vs. competitors (Yamaha, Honda, Bajaj, TVS)
- Drive test ride bookings, EMI applications, and dealer footfall
- Make the site feel "extraordinary" — Tesla/Ultraviolette-level premium

**Technical/content considerations:**
- Hero section requires high-production cinematic video (real Bangladesh roads + MotoGP/track footage)
- Engine showcase + technology sections require 3D motion graphics (commissioned from a 3D studio, not AI-generated)
- Language: **English only for v1.** No Bangla copy, no react-i18next infrastructure. Full bilingual (English/Bangla toggle) deferred to Phase-2
- Existing news archive (~200+ articles, 2018–2024) needs to be migrated and properly categorized
- Payment gateway integrations already in place must be preserved
- Test ride form, service booking, and shop checkout flows are critical conversion paths

**Operating company:** Rancon Motor Bikes Limited (RMBL), official manufacturer and distributor of Suzuki motorcycles in Bangladesh.

**Detailed brief follows in Appendices A–F below.**

---

## Appendix A: Sitemap (Public + Auth-gated + Admin)

### Public Pages

| Slug | Page | Notes |
|---|---|---|
| `/` | Home | 11 sections — see Appendix B |
| `/bikes` | Bike landing (category filter + animated nav) | Apple-style visual category filter (Scooter / Sports / Super Sports / Commuter / Performance Sports) |
| `/bikes/{slug}` | Individual bike detail (10 pages) | One per current model — Gixxer 250, Gixxer SF 250, GSX-R150, Gixxer SF, Gixxer, Gixxer Monotone, Gixxer Classic Matt, Access 125, Hayate EP, GSX 125 |
| `/bikes/configurator` | Bike configurator (NEW — see Appendix E.2) | Filter-driven: category → engine → brake → color → personalized preview |
| `/test-ride` | Test ride booking (NEW dedicated page) | Calendar + nearest dealer + multi-bike comparison option |
| `/service` | Service landing | Packages with trust signals + booking entry |
| `/service/book` | Service booking flow | Service type → location → slot → bike details → confirmation |
| `/shop` | Shop landing | 3 categories: Genuine Parts, Engine Oils, Accessories |
| `/shop/{category}` | Category listing | Genuine Parts / Engine Oils / Accessories |
| `/shop/{category}/{slug}` | Product detail | Stock status, specs, fitment, reviews |
| `/dealers` | Dealer locator | Map + GPS-based nearest list + per-dealer test-ride / inventory |
| `/news` | News & MotoGP updates | Migrated archive (~200 articles since 2018) + new editorial |
| `/news/{slug}` | News article | |
| `/life-at-suzuki` | Life at Suzuki landing | Glimpse hub: culture + careers + events + brand films |
| `/life-at-suzuki/careers` | Career listings | Vacancies — see open question Q-OQ-08 below |
| `/life-at-suzuki/events` | Events & meetups | Suzuki rider community |
| `/contact` | Contact | Hotline 16638 prominent + form + WhatsApp + map |
| `/about` | About RMBL + heritage | Brand story, MotoGP DNA, leadership |
| `/legal/{*}` | Privacy, Terms, Cookies, Returns | Standard legal pages |

### Auth-gated (customer)

| Slug | Page | Notes |
|---|---|---|
| `/login`, `/signup` | Auth pages | Phone OTP recommended — see Q-OQ-01 |
| `/account` | Account dashboard | Profile + saved addresses + preferences |
| `/account/orders` | Shop order history | Status + tracking + reorder |
| `/account/service` | Service booking history + tracker | Live status updates |
| `/account/test-rides` | Test-ride history + upcoming | Reschedule / cancel |
| `/account/saved` | Saved bikes + wishlist | |
| `/account/owner-portal` | Owner Portal (NEW — see Appendix E.10) | Bike registration, warranty, service history, accessory recommendations |
| `/cart`, `/checkout` | Cart + checkout | Guest checkout allowed; account preferred |

### Admin / Staff

| Slug | Page | Role |
|---|---|---|
| `/admin/news` | News CMS | content-admin |
| `/admin/bookings/test-rides` | Test ride inbox | dealer-staff, admin |
| `/admin/bookings/service` | Service appointment manager | service-manager, admin |
| `/admin/orders` | Shop order management | shop-admin, admin |
| `/admin/leads/emi` | EMI lead inbox | sales-admin, admin |
| `/admin/inventory` | Per-dealer inventory (NEW — see Appendix E.6) | dealer-staff, admin |
| `/admin/dealers` | Dealer directory management | admin |
| `/admin/users` | User & role management | admin |

---

## Appendix B: Homepage Section Detail (11 sections)

> Copy ordering preserved from client brief, with two of my recommended additions marked `[ADD]`.

| # | Section | Purpose | Notes / improvements I'm suggesting |
|---|---|---|---|
| 1 | **Hero banner** | Animated cinematic hero with bold headline; latest models featured | See Appendix E.1 — adaptive hero (time-of-day, geo-aware) |
| 2 | **Why Suzuki is different** | Less copy, more punch — key differentiators | 4 differentiators max: SOCS, MotoGP DNA, Made-for-Bangladesh, Service network |
| 3 | **Find your perfect Suzuki** | Bike showcase / shop entry, eye-catching | See Appendix E.2 — pair with "Bike Personality Quiz" for lead capture |
| 4 | **Suzuki Technology** | 6-activation 3D scroll experience: SOCS, SEP, FI, ABS, 6-Speed, MotoGP DNA | See Appendix B.1 (full storyboard preserved). For prototype: storyboard mockup only. ⚠️ Verify "SEP (Suzuki Eco Performance)" is an actual marketed Suzuki tech (Q-OQ-02) |
| 5 | **Engine Showcase** | 8-reveal 3D exploded-view of 250cc oil-cooled engine | See Appendix B.2 (full storyboard preserved). ⚠️ CAD source from Suzuki Japan via Rancon — high-risk dependency, needs Plan B (Q-OQ-03) |
| 6 | **Best Deals** | Active offers — Eid, Bank EMI, festive promos | Add countdown timers + dealer-specific deal flags |
| 7 | **MotoGP Heritage** | Suzuki + MotoGP history; Joan Mir 2020 championship | Recommend timeline scrubber + "DNA Comparison" between owner's bike and GSX-RR. ⚠️ MotoGP imagery licensing required (Q-OQ-07) |
| 8 | **Why Suzuki is Safe** | Safety differentiators (ABS, frame engineering, lighting) | Pair with rider stories from Section 9 (one rider per safety claim) |
| 9 | **Rider Real Stories** | Real Bangladesh rider testimonials | Video format > text. Add "Submit your story" CTA for community engagement |
| `[ADD]` | **Bangladesh Pride / Local-First** | "Built in Japan. Tested on Bangladesh roads." | Show real BD testing — Dhaka traffic, monsoon, Hill Tracts. Differentiates from competitors (suggested between sections 9 and 10) |
| 10 | **Service Section** | Trust + service package highlight + book CTA | Live slot availability widget, GPS-driven nearest service center |
| 11 | **Top News** | Recent articles + MotoGP updates + product launches | 3 cards max — pull from /news. Add Suzuki Ecstar feed if licensing allows |
| 12 | **Final CTA** | Conversion close — Book Test Ride / Find Dealer / Apply EMI | Multi-CTA grid. Weight by user behavior (returning visitor sees EMI calculator front) |

### B.1 Section 4 — Suzuki Technology (preserved storyboard)

> 6 sequential activations on a hero Gixxer SF 250 (MotoGP edition, blue colorway). Photorealistic 3D model with separately-modeled systems (engine block, oil cooling, exhaust, brakes, ABS, gearbox, FI, chassis, fairing, wheels, chain, suspension). Stylized rider silhouette (not photorealistic).

**Environment cycles:** Urban (Dhaka) → Monsoon → Highway dusk → Foggy morning. Cool blues + dark greys + warm accents (brake glow, ignition, exhaust heat).

**Activations:**
1. **SOCS (Oil Cooling)** — Engine X-ray, amber oil particles cooling red→blue. *"Dhaka traffic doesn't scare this engine."*
2. **SEP (Eco Performance)** — Piston comparison, friction zones dissolving, mileage counter. *"More kilometers. Same tank."* ⚠️ verify branding
3. **FI (Fuel Injection)** — Foggy state, fuel mist precision spray + ignition. *"First crank. Every morning."*
4. **Dual-Channel ABS** — Monsoon state, simultaneous brake calipers, ghost-bike comparison. *"Monsoon roads. Confident stops."*
5. **6-Speed Gearbox** — Highway state, internal gear cluster, RPM/speed indicators per gear. *"Built for the highway. Smooth in the city."*
6. **MotoGP DNA** — Track-mode environment, split-screen with Joan Mir's GSX-RR, knee-down corner. *"The same engineering that won the World Championship."*

**Climax:** All 6 systems light up in unison; bike rides forward.

**Scroll behavior:** Sticky-pinned section, scroll-driven timeline, 4–5 viewport heights of scroll. Scroll-back reverses cleanly. Mobile fallback = swipe carousel + optional "Watch full sequence" video.

**Tech stack (recommended):** Three.js / React Three Fiber + GSAP ScrollTrigger. Spline as fast-build alternative. Pre-rendered MP4 fallback (1920×1080, 60fps, <8MB) for mobile.

**Performance targets:** 60fps desktop, 30fps mobile (2022+), <3s load on 4G, <25MB total section weight, Draco geometry compression, Basis texture compression, lazy-load when 1 viewport away.

**Color palette:** `#0A0A0A` matte black, `#0033A0` Suzuki blue, `#FFA726` warm amber (heat), `#00BCD4` cool cyan (cooled state), `#FFFFFF` headlines, `#B0B0B0` body.

**Typography:** Bold sans-serif headlines (Suzuki brand font / Inter Bold / Söhne Bold). All-caps letter-spaced tags. 16–18px body.

**Motion principles:** Weighted, mechanical, ease-out for reveals, ease-in-out for camera, no Disney bounce.

**Accessibility:** "Pause animations" toggle (respects `prefers-reduced-motion`), static fallback view with all 6 callouts, screen-reader-readable callouts regardless of animation state.

**Audio (optional):** Ambient idle drone, RPM rise/fall on scroll, mechanical click on activation, environment-transition whoosh. Mute by default.

**Production estimate:** 8–12 weeks; BDT 8–25 lakh local, 5–10× international (Active Theory, Resn, Locomotive tier).

**Success metrics:** 45+s avg time, 70%+ scroll-through, callout tap rate, video-fallback view rate, social shares.

### B.2 Section 5 — Engine Showcase (preserved storyboard)

> Photorealistic 3D 250cc oil-cooled SOCS engine in dramatic darkness. 8 sequential reveals via "exploded view" choreography. Ends with reassembly, ignition, RPM sweep.

**Engine spec (verify with Rancon — Q-OQ-02):** 250cc single-cylinder 4-stroke, oil-cooled SOCS, FI, 6-speed, ~26 PS @ 9000 RPM, ~22.6 Nm @ 7300 RPM.

**8 Reveals:**

| # | Component | Animation | Rider benefit |
|---|---|---|---|
| 1 | **SOCS** (hero, longest 8–10s) | Cylinder head detaches, glowing amber oil channels spraying piston/cylinder, red→blue heat zones | "Performs consistently in 38°C BD summers and stop-and-go Dhaka traffic" |
| 2 | **High-Compression Piston** | Cylinder block opens, 4-stroke cycle in slow-mo, ignition spark | "Lighter pistons → faster response, better mileage, smoother ride" |
| 3 | **Electronic Fuel Injection** | Throttle body close-up, precision spray vs. carburetor mess comparison | "Instant cold starts. No choke. Better mileage. Cleaner emissions." |
| 4 | **4-Valve Cylinder Head** | Valve train sync, blue intake particles + orange exhaust particles | "More efficient breathing → more power, smoother high RPM, better efficiency" |
| 5 | **Balanced Crankshaft** | Bottom-end exposed, connecting rod cycle, counterweight balance | "Less vibration. Smoother rides. Less fatigue on highway trips." |
| 6 | **6-Speed Gearbox** | Gearbox housing splits, six gears engaging in cascade, RPM/speed per gear | "1st for Dhaka traffic. 6th for Dhaka–Chittagong highway." |
| 7 | **ECU** | Computer chip + animated data lines pulsing to all components, live readouts | "Engine adapts to weather, altitude, riding style — automatically" |
| 8 | **Reassembly + Ignition** | All components fly back, internal glow, deep startup sound, RPM sweep, heat shimmer | Final headline: *"26 horses. One heartbeat. Engineered in Japan, built for Bangladesh."* + CTA: "Book a Test Ride" |

**Interactive mode:** rotate engine, tap components for details, toggle Assembled / Exploded / X-ray.

---

## Appendix C: Page-Level Detail (Beyond Homepage)

### C.1 Bike pages

- **Navbar bike hover:** Animated featured-bike preview on hover; each bike highlighted with subtle motion.
- **Banner with category animations:** Hero strip cycles category visuals (Scooter / Sports / Super Sports / Commuter / Performance Sports) with smooth transitions.
- **Visual category filter (Apple-style):** Default = generic gallery view. Selecting a category swaps the gallery into category-only bikes with category-specific lighting/treatment.
- **Bike configurator:** filter chain `category → engine → brake → color` produces a personalized 3D preview. See Appendix E.2 for the upgrade I'm recommending.
- **Individual bike detail:** Hero photo (full-bleed), 360° spin viewer, color picker (each color shown on a Bangladesh-appropriate road), specs grid, "What's in the Box" (service kit, warranty, insurance bundle), "Compare with similar Suzuki" (never with competitors), CTAs: Book Test Ride / Get EMI Quote / Find Dealer / Save.

### C.2 Service page

- **Trust-first layout:** Service center count, certified technicians count, average turnaround, 5-star reviews carousel.
- **Service packages:** General service / Periodic service / Engine work / Body work — pricing visible, what's included, duration, before/after photos.
- **CTA strategy:** "Book Service Now" (primary) + "Find Service Center" (secondary) + "Service My Bike Calculator" (curiosity-driven, predicts cost from bike + km).
- **Live slot calendar (NEW — see Appendix E.5):** real-time availability per service center.
- **Post-booking:** Service tracker (status updates: Received → In Diagnosis → In Service → Quality Check → Ready for Pickup).

### C.3 Shop page (e-commerce)

- **Categories:** Genuine Parts / Engine Oils / Accessories.
- **Quick-purchase format:** Card-grid with stock badge, price, fitment preview ("Fits: Gixxer 250, Gixxer SF 250, GSX-R150").
- **Cross-sell intelligence (NEW):** "Riders who bought GSX-R150 oil also bought…"
- **QR fitment scanner (NEW — see Appendix E.7):** Scan bike's QR sticker (under seat) → auto-show compatible parts.
- **Cart + checkout:** Guest checkout supported; account checkout preferred. Multiple payment methods (see Q-OQ-04).

### C.4 Dealer locator

- **Map view:** Bangladesh map with all dealers as pins. Cluster on zoom-out.
- **Location-permission flow:** "Share location to see nearest dealers" → list view sorted by distance, with travel-time estimate.
- **Per-dealer card:** Name, address, hotline, hours, services offered (Sales / Service / Both), Google Maps directions link, WhatsApp deep link.
- **NEW (E.6):** Real-time inventory at each dealer + "Reserve for test ride" per dealer.

### C.5 Life at Suzuki

- **Hub layout:** Tabs or vertical sections — Vacancies / Culture / News & Events / Brand films.
- **Career listings:** Pull from real ATS or static list (see Q-OQ-08).
- **Culture:** Office life, employee testimonials, training programs, MotoGP heritage as company-wide DNA.
- **News & Events:** Filtered subset of /news tagged as internal/community events.
- **Rider Community (NEW):** Suzuki rider clubs across BD, monthly meetups, photo contests.

### C.6 Contact

- Hotline **16638** prominent (header callout + page hero).
- Email + contact form.
- WhatsApp Business deep-link (BD users heavily prefer WhatsApp).
- Map of HQ + dealer network link.

---

## Appendix D: E-commerce, Engagement, and Cross-cutting Features

### D.1 Auth (login / signup)

- ✅ **Confirmed:** **Phone OTP** (BD-typical) as primary + **Google login** as secondary. Email+password skipped for v1.
- **Why:** OTP is the dominant auth pattern in BD; Google login covers the diaspora and laptop users without requiring an additional credential set.

### D.2 Cart & checkout

- **Add-to-cart everywhere relevant:** Shop products, Bike accessories bundles, Service packages.
- **Guest checkout:** Yes, with phone number for tracking; soft prompt to create account post-purchase.
- ✅ **Confirmed payments: SSLCommerz only** — single integration handles cards + bKash + Nagad + bank EMI partners through one gateway. No direct bKash/Nagad SDK integration in v1 (reduces vendor surface, faster to ship).

### D.3 Cookies / Lead-capture popup

- **Reframing:** Don't conflate GDPR cookie banner with lead capture — they're different concerns.
  - **Cookie consent banner:** GDPR/PDPA-compliant, accept/customize/reject, persistent footer link.
  - **Lead capture (separate):** Exit-intent popup with EMI calculator preview + email/phone capture + WhatsApp opt-in. OR progressive: after 30s on bike-detail page, soft prompt for "Get pricing on WhatsApp."
- **Why:** Mixing them harms trust and may breach data laws.

### D.4 Chatbot

- **Client requested:** FB Messenger Chatbot.
- **My recommendation (multi-channel):** Messenger + **WhatsApp Business** + on-site live chat. WhatsApp is dominant in BD. Single bot brain, multiple surfaces.
- **Bot capabilities:** Test ride booking, EMI eligibility check, service appointment, dealer connection, FAQ.
- **Human handoff:** Escalate to hotline 16638 or human agent for complex queries.

### D.5 Push notifications

- Web Push (browser) + WhatsApp templates as fallback for off-browser audience.
- See pre-intake item 4b for trigger events.

---

## Appendix E: Strategic Improvement Suggestions

> Where I think a better idea exists than the brief specifies. Each numbered for cross-reference.

### E.1 Adaptive hero (smarter than a single video)

- **First visit:** Cinematic 8s hero video.
- **Returning visit:** Cycles 3–4 different bike heroes based on prior interest (saved bikes / viewed pages).
- **Time-of-day adaptive:** Dawn / dusk / night colorways.
- **Geo-aware (with consent):** If user is in Sylhet/Chittagong/Dhaka, the road in the hero matches their city.
- **Why:** Tesla and Apple use this kind of personalization; it dramatically lifts session depth.

### E.2 Bike Personality Quiz (in "Find your perfect Suzuki")

- Replace the configurator-only flow with a 5-question quiz: commute distance / weekend rides / experience level / budget / thrill vs. comfort → recommends 1–2 bikes + EMI estimate + nearest dealer.
- **Why:** Yamaha BD does a lighter version; Suzuki should leapfrog. Captures strong leads (each quiz = email/phone capture opportunity).

### E.3 MotoGP "DNA Comparison"

- In the MotoGP heritage section, let the user pick their Suzuki bike and see how its specs / geometry / ergonomics map to Joan Mir's GSX-RR (lean angle, brake response, weight ratio).
- **Why:** Turns abstract heritage into personal ownership pride. Highly shareable on social.

### E.4 Bangladesh Pride / Local-First section (homepage)

- Suggested as an additional homepage section between Rider Stories and Service.
- Theme: "Built in Japan. Tested on Bangladesh roads." Real BD road-testing — Dhaka traffic, monsoon, Hill Tracts.
- **Why:** Differentiates from Honda/Yamaha global-brand sites which feel imported. Suzuki BD has a unique "rooted in BD" story (Rancon, 16638, dealer network).

### E.5 Live service slot calendar

- Real-time availability per service center, GPS-driven nearest-first.
- "Book in [next available slot] near [my location]" — one-click flow.
- Service tracker post-booking → reminder push notifications → return-customer retention.
- **Why:** No competitor in BD does live slots. Strong differentiator.

### E.6 Real-time dealer inventory

- Each dealer card on `/dealers` shows live inventory: "Gixxer SF 250 in stock — Gulshan dealer."
- "Reserve for test ride" per dealer (puts a hold on a specific bike).
- **Why:** Removes the #1 friction point in BD bike purchase ("Is it actually available?").

### E.7 QR fitment scanner (Shop)

- Each Suzuki bike has a QR sticker under the seat. Scan it on `/shop` → only show parts that fit *that specific bike*.
- **Why:** Industry-leading. Solves the "wrong part" returns problem in genuine-parts e-commerce.

### E.8 Multi-channel chatbot (Messenger + WhatsApp + Live Chat)

- See Appendix D.4. WhatsApp is the missed channel in the original brief.

### E.9 Lead-capture vs. cookie consent — separate concerns

- See Appendix D.3. Important for compliance and user trust.

### E.10 Owner Portal (`/account/owner-portal`)

- Post-purchase hub: bike registration, warranty status, service history, accessory recommendations, SOS contact, manual download.
- **Why:** Drives retention and accessory sales — currently nowhere on suzuki.com.bd. The 4th user persona (Existing Owners) has no dedicated UX without it.

### E.11 Accessibility & performance (cross-cutting)

- All animation-heavy sections must respect `prefers-reduced-motion` and provide static fallbacks.
- BD internet realities: 3G fallback strategy, aggressive lazy-loading, < 3s LCP on 4G.
- WCAG 2.1 AA compliance on all conversion flows (test ride, EMI, checkout, service booking).

---

## Appendix F: Open Questions — Status (all locked)

> All Q-OQ items have been answered. These locked answers feed `/fullstack-pm`.

| Tag | Question | ✅ Locked Answer |
|---|---|---|
| Q-OQ-01 | Auth method | **Phone OTP primary + Google login secondary.** Email+password skipped for v1. |
| Q-OQ-02 | Engine spec / SEP branding | **Use placeholder values for prototype.** Engine specs (26 PS / 22.6 Nm) and "SEP" branding tagged `[verify with Rancon]` inline. Client to confirm via Rancon before any production copy. |
| Q-OQ-03 | 3D model source | **CSS/SVG scroll-driven animations** for prototype (locked in Appendix G). Photoreal 3D vendor work is a separate Phase-1 deliverable. CAD-source decision deferred. |
| Q-OQ-04 | Payment gateways | **SSLCommerz only** (single gateway handles cards + bKash + Nagad + bank EMI partners). No direct bKash/Nagad SDK in v1. |
| Q-OQ-05 | EMI flow scope | **Phase-1: EMI calculator widget + lead form.** Affects /test-ride page CTA — primary CTA "Book Test Ride", secondary CTA "Get EMI Quote" → calculator. Real-time bank eligibility deferred to Phase-2. |
| Q-OQ-06 | Backend strategy | **Fresh NestJS backend.** Not BFF-wrapping `api-v2.suzuki.com.bd`. /fullstack-dev D4 (database) + D5 (backend) both fully in scope. Existing data migration handled separately during Phase-1. |
| Q-OQ-07 | MotoGP imagery | **Stylized placeholder imagery in prototype** — silhouettes, generic racing iconography, no Joan Mir / Suzuki Ecstar identifiable footage. Real archival licensing handled in Phase-1 production. |
| Q-OQ-08 | Career listings source | **Static markdown for v1.** ATS integration (BambooHR / Lever) deferred to Phase-3. |
| Q-OQ-09 | Brand voice | **Blended.** Premium/Tesla-clean default; MotoGP-aggressive on Sections 4 + 7; Bengali-warm on Sections 9, Service, Community. |
| Q-OQ-10 | Bilingual scope | **English only for v1.** No react-i18next infrastructure, no Bangla copy. Bilingual toggle deferred to Phase-2. |
| Q-OQ-11 | Roles & admin scope | **Prototype: customer + admin (combined staff role).** Production: customer + content-admin + service-manager + dealer-staff + sales-admin + admin. |
| Q-OQ-12 | Today's prototype scope | **8 pages:** Home, /bikes, /bikes/gixxer-sf-250, /test-ride, /service, /shop, /dealers, /contact. |

---

## Appendix G: Today's prototype scope (proposal)

For today's HTML prototype submission:

**Pages to generate (8):**
1. Home (all 11+ sections, but with placeholder treatments for heavy 3D — see below)
2. Bike landing (`/bikes`) — Apple-style category filter + hero gallery
3. Bike detail (`/bikes/gixxer-sf-250`) — hero of the lineup; the others can be templated later
4. Test ride booking (`/test-ride`) — conversion flow demo
5. Service landing (`/service`) — trust + packages + booking entry
6. Shop landing (`/shop`) — 3-category hero + featured products
7. Dealer locator (`/dealers`) — map mockup + per-dealer cards
8. Contact (`/contact`) — hotline 16638 + form + WhatsApp

**Heavy-3D sections (Section 4 + 5) handling for prototype:** ✅ **CONFIRMED — pure CSS/SVG**

Approach: **CSS + SVG scroll-driven animations** simulating motion (parallax, glow pulses, X-ray reveals via clip-path, animated indicator lines, particle-flow via SVG `<animate>`/`<animateMotion>`, gear cascades via SVG transform animation, exploded-view choreography via CSS keyframes synced to scroll progress).

Why this approach (and not stock video / WebGL / YouTube embeds):
- Fully self-contained — no external assets, no licensing risk
- Brand-customizable end-to-end (Suzuki blue glows, amber heat, cyan cool — all CSS variables)
- Mobile-friendly, lightweight (no MP4/WebGL bundle weight)
- Respects `prefers-reduced-motion` natively
- Acts as the visual stand-in for the eventual photoreal 3D vendor work in Phase-1

**Section 4 — 6 activations (Technology):** Sticky-pinned section, scroll progress drives a CSS timeline. Each activation is a layered SVG composition (bike silhouette + system origin point + animated overlay + connecting line + callout card). Glow/pulse via CSS `@keyframes`. Environment background swaps via opacity transitions.

**Section 5 — 8 reveals (Engine showcase):** Animated SVG exploded engine diagram. Each reveal = a component group transform (translate + rotate) plus a callout panel fade-in. Reassembly = reversed timeline. Final ignition = CSS pulse + RPM-needle SVG arc animation.

The final photoreal 3D vendor work (8–12 weeks, BDT 8–25 lakh, per Appendix B.1) remains a separate Phase-1 deliverable. Today's prototype communicates the storytelling structure, visual ambition, and motion design language — all without external media dependencies.

**Brand voice (Q-OQ-09):** ✅ **Blended**
- Premium/Tesla-clean as default
- MotoGP-aggressive on Section 4 (Technology) + Section 7 (MotoGP Heritage)
- Bengali-warm on Section 9 (Rider Stories) + Service section + Community/Life at Suzuki

**Prototype scope (Q-OQ-12):** ✅ **8 pages** (per Appendix G list above)

**Out-of-scope for today:**
- Bike configurator (E.2 quiz) — concept only
- Live service slot calendar (E.5) — concept only
- Real-time dealer inventory (E.6) — concept only
- QR fitment scanner (E.7) — concept only
- Owner Portal (E.10) — page stub only
- News archive migration — placeholder articles
- Auth/cart/checkout flows — UI shells, not functional
