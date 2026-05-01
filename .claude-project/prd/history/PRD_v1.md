# Suzuki Bangladesh — Product Requirements Document

**Version:** 1.0
**Date:** 2026-04-30
**Status:** Draft (PM Track P2 — Pending P3 design approval)
**Owner:** Sajarun Sadia (PM, Rancon Motor Bikes Ltd.)
**Operating Company:** Rancon Motor Bikes Limited (RMBL), official manufacturer + distributor of Suzuki motorcycles in Bangladesh

---

## 0. Project Overview

### Product

**Name:** Suzuki Bangladesh (suzuki.com.bd redesign)
**Type:** Premium responsive web platform
**Deadline:** Phased — Phase 1 launch ~10 weeks from kickoff (homepage + bike detail), full launch ~4–5 months
**Status:** Draft

### Description

A premium digital experience platform for Suzuki Bangladesh that showcases the full motorcycle lineup, MotoGP heritage, and proprietary engine technology to create brand awareness and excite bikers. Visitors can explore bikes, book test rides, locate dealers, apply for EMI/financing, schedule service appointments, and shop genuine parts and accessories. The redesign replaces an existing transactional Next.js site with a Tesla/Ultraviolette-level cinematic experience built mobile-first for the dominant Bangladeshi mobile traffic.

### Goals

1. **Create brand awareness and excitement among bikers** — emotional, not just transactional. Make the site feel "extraordinary."
2. **Showcase engine technology and MotoGP heritage** as core differentiators (SOCS, FI, ABS, 6-speed, MotoGP DNA via Joan Mir 2020 championship).
3. **Drive conversion**: test ride bookings, EMI applications, dealer footfall, shop purchases, service bookings.
4. **Position Suzuki as premium and aspirational** vs. Yamaha, Honda, Bajaj, TVS in the BD market.

### Target Audience

| Audience | Description |
|----------|-------------|
| **Primary** | Aspirational young riders (18–28) — performance enthusiasts eyeing Gixxer 250, Gixxer SF 250, GSX-R150. Hero audience for brand storytelling. |
| **Secondary** | Daily commuters (25–40) — practical buyers looking at Gixxer base, GSX 125, Hayate EP, Access 125 |
| **Tertiary** | Existing Suzuki owners — service booking, parts, accessories, upgrades |
| **Tertiary** | Dealers + service partners — support channels and locator visibility |

### User Types

| Type | DB Value | Description | Key Actions |
|------|----------|-------------|-------------|
| **Customer** | `0` | Public visitor / authenticated rider | Browse bikes, book test ride, apply EMI, book service, shop parts, locate dealer |
| **Admin** | `99` | RMBL staff (combined role for prototype) | Manage news, service bookings, EMI leads, orders, inventory, dealers |

> Production split: `content-admin` (10), `service-manager` (20), `dealer-staff` (30), `sales-admin` (40), `admin` (99). Prototype uses combined `admin` to keep scope tight.

### User Status

| Status | DB Value | Behavior |
|--------|----------|----------|
| **Active** | `0` | Full access |
| **Suspended** | `1` | Cannot log in — show: "Your account is paused. Contact 16638 for help." |
| **Withdrawn** | `2` | Data retained 90 days then deleted |

### MVP Scope (Phase 1)

**Included (today's prototype, 8 pages):**
- Homepage with 11+ sections (hero, why-different, bike showcase, technology 3D scroll, engine showcase 3D explode, deals, MotoGP, safety, rider stories, Bangladesh-pride, service, news, final CTA)
- Bike landing (`/bikes`) with Apple-style category filter
- Bike detail (`/bikes/gixxer-sf-250`) — hero of the lineup
- Test ride booking (`/test-ride`) with calendar + nearest dealer
- Service landing (`/service`) with packages + booking entry
- Shop landing (`/shop`) with 3 categories
- Dealer locator (`/dealers`) with map + GPS-based nearest
- Contact (`/contact`) with hotline + WhatsApp + form
- Cookie consent + lead-capture popups (separate concerns)
- Multi-channel chatbot UI shells (FB Messenger + WhatsApp + on-site live chat)

**Excluded (deferred to Phase 2 / Phase 3):**
- Real-time service slot calendar with live availability
- Real-time dealer inventory + per-dealer reservation
- QR fitment scanner on shop
- Bike Personality Quiz (E.2)
- Owner Portal (`/account/owner-portal`)
- News archive migration (200+ articles, 2018–2024) — stub articles only in v1
- Real-time bank EMI eligibility check
- Bilingual English/Bangla toggle (i18n) — English only for v1
- Native mobile apps + PWA capabilities
- Photoreal 3D vendor work (CSS+SVG stand-ins for prototype)
- Career ATS integration (BambooHR / Lever)

---

## 1. Terminology

### Core Concepts

| Term | Definition |
|------|------------|
| **Suzuki Bangladesh** | RMBL-operated official Suzuki motorcycle brand for the Bangladesh market |
| **RMBL** | Rancon Motor Bikes Limited — official manufacturer and distributor |
| **Hotline 16638** | Suzuki Bangladesh's dedicated customer hotline (must remain prominent everywhere) |
| **SOCS** | Suzuki Oil Cooling System — pressurized oil jets directed at cylinder head + piston underside; core differentiator |
| **MotoGP DNA** | Brand position — engineering heritage from Suzuki Ecstar's MotoGP program (Joan Mir 2020 World Championship) |
| **Test Ride** | Customer requests to try a bike at a dealer before purchase |
| **EMI** | Equated Monthly Installment — financing flow for bike purchase via partner banks |

### User Roles

| Role | Description |
|------|-------------|
| **Guest** | Anyone — browse public pages, view bikes/dealers/news, submit test ride / EMI / contact forms |
| **Customer** | Authenticated rider (phone OTP or Google) — book test rides, save bikes, view order/service/test-ride history, checkout shop |
| **Admin** | RMBL staff — manage news CMS, service bookings, EMI lead inbox, shop orders, dealer directory, inventory |

### Status Values

| Enum | Values | Description |
|------|--------|-------------|
| **TestRideStatus** | `REQUESTED`, `CONFIRMED`, `COMPLETED`, `NO_SHOW`, `CANCELLED` | Test ride lifecycle |
| **ServiceBookingStatus** | `RECEIVED`, `IN_DIAGNOSIS`, `IN_SERVICE`, `QUALITY_CHECK`, `READY_FOR_PICKUP`, `COMPLETED`, `CANCELLED` | Service appointment lifecycle (visible in customer service tracker) |
| **EmiLeadStatus** | `NEW`, `CONTACTED`, `QUALIFIED`, `CONVERTED`, `CLOSED` | EMI inbox states |
| **ShopOrderStatus** | `PENDING_PAYMENT`, `PAID`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `REFUNDED` | Order lifecycle |
| **BikeCategory** | `SCOOTER`, `SPORTS`, `SUPER_SPORTS`, `COMMUTER`, `PERFORMANCE_SPORTS` | Bike taxonomy on /bikes |

### Technical Terms

| Term | Definition |
|------|------------|
| **Pre-intake form** | Client-completed questionnaire that fed P1-spec ([pre-intake.md](.claude-project/status/suzuki-bangladesh/pre-intake.md)) |
| **CSS+SVG scroll-driven animation** | Sticky-pinned section whose timeline is driven by user scroll progress; activations, glow effects, and exploded-view choreography rendered with CSS keyframes + SVG transforms (no WebGL, no video files, no external deps) |
| **Role-folder HTML** | `.claude-project/design/html/<role>/*.html` structure used by `/fullstack-dev` Tier 3 validation |
| **PRD hash snapshot** | SHA-256 of canonical PRD recorded in `DESIGN_STATUS.md#prd_hash_at_generation`; gates Dev handoff |

---

## 2. System Modules

### Module 1 — Bike Catalog & Discovery

Public-facing motorcycle browsing experience: cinematic hero, category filter, individual bike detail, configurator entry.

#### Main Features

1. **Bike Listing** — grid of all 10 current models with thumbnail, price (BDT), category badge, "View Details" CTA
2. **Apple-style Category Filter** — Scooter / Sports / Super Sports / Commuter / Performance Sports — selecting a category swaps the gallery into category-only bikes with category-specific lighting
3. **Bike Detail Page** — full-bleed hero, 360°-spin viewer placeholder, color picker (each color shown on a BD road), specs grid, "What's in the Box", "Compare with similar Suzuki" (never with competitors), CTA grid
4. **Bike Configurator (entry point)** — filter chain: category → engine → brake → color → personalized 3D preview (concept-level for prototype)
5. **Hover navbar bike preview** — animated featured bike with each bike highlighted on hover

#### Technical Flow

##### Browse + Filter

1. Visitor lands on `/bikes`
2. Default state: generic gallery view of all 10 bikes
3. Visitor selects category → JS filter narrows the grid + applies category-specific background
4. Click "View Details" → `/bikes/{slug}` (e.g., `/bikes/gixxer-sf-250`)
5. On detail page: visitor selects color → hero image swaps + environment shot updates
6. Visitor clicks "Book Test Ride" → routes to `/test-ride?bike=gixxer-sf-250`

---

### Module 2 — Test Ride Booking

Conversion-critical flow that connects the browsing experience to the dealer network.

#### Main Features

1. **Calendar slot picker** — date + time slot per dealer
2. **Nearest dealer auto-detect** — GPS permission → list dealers sorted by distance
3. **Multi-bike comparison ride** — select 1–3 bikes for the same appointment
4. **Customer details capture** — name, phone (OTP-verified), preferred contact channel (WhatsApp / call)
5. **Confirmation** — push notification + WhatsApp + email; reschedule/cancel via account dashboard
6. **Secondary CTA — EMI Quote** — links to calculator on bike detail or test-ride page

#### Technical Flow

1. Visitor clicks "Book Test Ride" from any surface
2. App pre-fills bike if launched from bike-detail context
3. Visitor grants location permission → nearest dealer auto-selected
4. Visitor picks slot from calendar → confirms phone number
5. App verifies via OTP (Phase 1 simulation; full OTP in Phase 2)
6. On success: confirmation page + push notification + WhatsApp template + dealer-staff inbox notification
7. On failure: clear error message, fallback to phone hotline 16638

---

### Module 3 — Service Booking + Tracker

Trust-first service experience with package highlighting and post-booking visibility.

#### Main Features

1. **Service package showcase** — General / Periodic / Engine work / Body work, with pricing visible, included items, duration, before/after photos
2. **Trust signals foregrounded** — service center count, certified technicians, average turnaround, 5-star reviews carousel
3. **Live slot calendar** (concept widget for prototype; real-time in Phase 2)
4. **Service Cost Calculator** — "Service My Bike Calculator" — predicts cost from bike + km
5. **Service tracker** — post-booking status visibility: Received → InDiagnosis → InService → QualityCheck → ReadyForPickup
6. **Reminder push notifications** — service appointment reminders + completion updates

#### Technical Flow

1. Customer browses `/service` → sees packages + trust block
2. Clicks "Book Service Now" → `/service/book`
3. Selects service type → location (or GPS-detect) → slot
4. Enters bike details (model, registration, KM) → confirmation
5. After service center receives bike: status updates fire push notifications
6. Customer can view live status from `/account/service`

---

### Module 4 — Shop (E-commerce)

Quick-purchase experience for genuine parts, engine oils, accessories.

#### Main Features

1. **3-category landing** — Genuine Parts / Engine Oils / Accessories
2. **Product cards** — image, price, stock badge, fitment preview ("Fits: Gixxer 250, Gixxer SF 250, GSX-R150")
3. **Cross-sell intelligence** — "Riders who bought GSX-R150 oil also bought…" row
4. **QR fitment scanner** (Phase 2) — scan bike's QR sticker → only show compatible parts
5. **Cart + checkout** — guest checkout with phone; account checkout preferred; SSLCommerz payment
6. **Order tracking** — shipped / delivered / returned status visible from `/account/orders`

#### Technical Flow

1. Visitor browses `/shop` → 3-category landing
2. Drills into category → filtered list with stock + fitment
3. Adds to cart → cart drawer shows running total + "Continue Shopping" / "Checkout"
4. Checkout: phone (OTP) → shipping address → SSLCommerz hosted payment
5. On success: order confirmation + email + WhatsApp + tracking link
6. On payment failure: cart preserved, error message, retry CTA

---

### Module 5 — Dealer Locator

Map-based dealer discovery with location-aware nearest list.

#### Main Features

1. **Bangladesh map view** — all dealers as pins, cluster on zoom-out
2. **Location-permission flow** — "Share location to see nearest dealers" → list sorted by distance + travel time
3. **Per-dealer card** — name, address, hotline 16638, hours, services_offered (Sales / Service / Both), Google Maps directions, WhatsApp deep link
4. **Real-time inventory** (Phase 2) — "Gixxer SF 250 in stock at Gulshan dealer"
5. **Reserve for test ride** (Phase 2) — per-dealer hold

---

### Module 6 — News + MotoGP Updates

Editorial hub combining migrated archive with new content.

#### Main Features

1. **Article listing** — paginated, filtered by tag (MotoGP / Product Launches / Offers / Community)
2. **Article detail** — hero image, body, share, related articles
3. **News CMS (admin)** — create / edit / publish / unpublish / schedule
4. **MotoGP feed** — Suzuki Ecstar updates, race results, championship retrospectives

> ~200 articles (2018–2024) migrated from existing site. v1 prototype has placeholder articles only.

---

### Module 7 — Authentication + Account

Phone OTP primary, Google login secondary, customer dashboard.

#### Main Features

1. **Phone OTP login/signup** — BD-typical flow
2. **Google login** — secondary option
3. **Account dashboard** — profile, saved addresses, preferences
4. **Order history** (`/account/orders`)
5. **Service booking history + tracker** (`/account/service`)
6. **Test ride history** (`/account/test-rides`)
7. **Saved bikes / wishlist** (`/account/saved`)
8. **Owner Portal** (`/account/owner-portal` — Phase 2)

---

### Module 8 — Admin (Combined Staff Role for Prototype)

Internal management tools — production splits into 5 sub-roles.

#### Main Features

1. **News CMS** (`/admin/news`) — content publishing
2. **Test ride inbox** (`/admin/bookings/test-rides`) — confirm / reschedule / cancel
3. **Service appointment manager** (`/admin/bookings/service`) — slot management, status transitions
4. **Shop order management** (`/admin/orders`) — fulfillment, refunds
5. **EMI lead inbox** (`/admin/leads/emi`) — sales follow-up
6. **Dealer directory** (`/admin/dealers`) — CRUD on dealer + service-center records
7. **User & role management** (`/admin/users`) — staff onboarding (Phase 2)

---

## 3. User Application

### 3.1 Page Architecture

**Stack:** React 19 + React Router 7 (framework mode) + TypeScript strict + Tailwind CSS v4 + Redux Toolkit (async thunks for READ ops, direct service calls for mutations) + httpService Axios orchestrator

#### Route Groups

| Group | Access |
|-------|--------|
| Public | Anyone (Guest + Customer) |
| Auth | Unauthenticated only (login/signup) |
| Customer | Authenticated customer |
| Admin | Staff (combined `admin` role for prototype) |

#### Page Map

**Public**

| Route | Page | In Today's Prototype? |
|-------|------|---|
| `/` | Home (11+ sections) | ✅ |
| `/bikes` | Bike landing (category filter) | ✅ |
| `/bikes/gixxer-sf-250` | Bike detail — Gixxer SF 250 hero | ✅ |
| `/bikes/{slug}` | Bike detail (other 9 models) | Phase 2 templated |
| `/bikes/configurator` | Configurator | ❌ (concept link only) |
| `/test-ride` | Test ride booking | ✅ |
| `/service` | Service landing | ✅ |
| `/service/book` | Service booking flow | Phase 2 |
| `/shop` | Shop landing | ✅ |
| `/shop/{category}` | Category listing | Phase 2 |
| `/shop/{category}/{slug}` | Product detail | Phase 2 |
| `/dealers` | Dealer locator | ✅ |
| `/news` | News listing | Phase 2 |
| `/news/{slug}` | News article | Phase 2 |
| `/life-at-suzuki` | Life at Suzuki | Phase 3 |
| `/life-at-suzuki/careers` | Careers | Phase 3 |
| `/life-at-suzuki/events` | Events | Phase 3 |
| `/contact` | Contact | ✅ |
| `/about` | About / heritage | Phase 3 |
| `/legal/{*}` | Privacy / Terms / Cookies / Returns | Phase 3 |

**Auth**

| Route | Page |
|-------|------|
| `/login` | Phone OTP + Google |
| `/signup` | Phone OTP signup |

**Customer**

| Route | Page |
|-------|------|
| `/account` | Profile dashboard |
| `/account/orders` | Order history |
| `/account/service` | Service tracker |
| `/account/test-rides` | Test ride history |
| `/account/saved` | Saved bikes |
| `/cart` | Cart |
| `/checkout` | Checkout (SSLCommerz) |

**Admin**

| Route | Page |
|-------|------|
| `/admin/news` | News CMS |
| `/admin/bookings/test-rides` | Test ride inbox |
| `/admin/bookings/service` | Service appointments |
| `/admin/orders` | Shop orders |
| `/admin/leads/emi` | EMI leads |
| `/admin/dealers` | Dealer directory |
| `/admin/users` | Users & roles (Phase 2) |

---

### 3.2 Feature List by Page (today's prototype scope)

#### `/` — Home

The hero conversion surface. 11+ sections in stated order:

1. **Hero banner** — full-bleed cinematic placeholder with bold headline, latest models featured, primary CTA "Book Test Ride", secondary CTA "Explore Bikes"
2. **Why Suzuki is different** — 4 key differentiators (less copy, more punch): SOCS, MotoGP DNA, Made-for-Bangladesh, Service Network
3. **Find your perfect Suzuki** — bike showcase grid linking into `/bikes`, secondary "Bike Personality Quiz" CTA (concept stub)
4. **Suzuki Technology** — sticky-pinned CSS+SVG scroll-driven section with 6 sequential activations: SOCS, SEP `[verify with Rancon]`, FI, ABS, 6-Speed, MotoGP DNA. Each activation: origin point on bike silhouette + animated overlay + callout card + connecting indicator line. Scroll-back reverses cleanly. Mobile fallback: swipeable carousel
5. **Engine Showcase** — animated SVG exploded-view of 250cc oil-cooled engine with 8 sequential reveals: SOCS, Piston, FI, Cylinder Head, Crankshaft, Gearbox, ECU, Reassembly+Ignition. Final CTA "Experience It — Book a Test Ride"
6. **Best Deals** — active offers grid (Eid / Bank EMI / festive) with countdown timers + dealer-specific deal flags
7. **MotoGP Heritage** — Suzuki + MotoGP timeline scrubber, "DNA Comparison" widget (your bike vs. GSX-RR concept), stylized imagery (no licensed footage)
8. **Why Suzuki is Safe** — safety differentiators (ABS, frame, lighting), paired with rider stories
9. **Rider Real Stories** — testimonial carousel + "Submit your story" CTA
10. **Bangladesh Pride** — "Built in Japan. Tested on Bangladesh roads." with BD scenes (Dhaka traffic, monsoon, Hill Tracts)
11. **Service** — package highlight + GPS-driven nearest service center + book CTA
12. **Top News** — 3 most recent articles + MotoGP update card
13. **Final CTA** — multi-CTA grid: Book Test Ride / Find Dealer / Apply EMI / Talk on WhatsApp

Persistent: header navbar with hover-driven bike preview; footer with hotline 16638 + Rancon attribution + dealer locator link; floating WhatsApp + Messenger + live-chat triggers; cookie consent banner; lead-capture exit-intent popup.

---

#### `/bikes` — Bike Landing

- Apple-style category filter chips (Scooter / Sports / Super Sports / Commuter / Performance Sports)
- Default: generic gallery view of all 10 bikes
- Selecting category swaps gallery into category-only bikes with category-specific background lighting
- Each card: hero image, name, price BDT, category badge, "View Details" CTA
- Below grid: bike configurator entry banner ("Build Your Suzuki — filter by engine, brake, color")
- Persistent navbar with featured-bike hover animation

---

#### `/bikes/gixxer-sf-250` — Gixxer SF 250 Detail (hero of the lineup)

- Full-bleed hero with cinematic photography placeholder + headline
- 360°-spin viewer placeholder (concept; static image with rotation hint)
- Color picker (5 swatches) — selecting a color swaps hero image to that color shown on a BD road
- Specs grid: engine (250cc oil-cooled SOCS, FI, 6-speed), power (~26 PS @ 9000 RPM `[verify with Rancon]`), torque (~22.6 Nm @ 7300 RPM `[verify with Rancon]`), weight, fuel capacity
- "What's in the Box" — service kit, warranty (2-year / 30,000 km), insurance bundle option
- "Compare with similar Suzuki" — links to Gixxer 250 + GSX-R150 (never competitor bikes)
- Sticky CTA grid: Book Test Ride / Get EMI Quote / Find Dealer / Save
- Bottom: Section 4-style mini engine showcase pulled from homepage
- Reviews carousel (rider testimonials)

---

#### `/test-ride` — Test Ride Booking

- Headline: "Ride before you decide."
- Step 1: pick bike(s) — pre-filled if arrived from bike detail; multi-bike comparison ride supported
- Step 2: pick dealer — GPS permission → nearest list, or manual select
- Step 3: pick date + time slot from calendar
- Step 4: customer details — name, phone (OTP placeholder), preferred contact (WhatsApp / call), notes
- Confirmation panel: summary + "Confirm Booking" primary CTA + "Get EMI Quote" secondary CTA
- Trust signals at bottom: "Free for first-time visitors", "Hotline 16638 if you need help"

---

#### `/service` — Service Landing

- Hero: trust signals — "X service centers across Bangladesh", "Y certified technicians", "Avg turnaround Z hours"
- Service package cards: General / Periodic / Engine work / Body work — each with price, included items, duration, "Book This Package" CTA
- "Service My Bike Calculator" widget — bike model + KM → estimated cost
- Live slot calendar concept widget — "Next available slot at your nearest center: tomorrow 10:30 AM"
- Trust block: 5-star review carousel, before/after photos, certifications
- Final CTA grid: Book Service Now / Find Service Center / Talk on WhatsApp

---

#### `/shop` — Shop Landing

- 3-category hero — Genuine Parts / Engine Oils / Accessories — each with hero image + "Shop Category" CTA
- Featured products row — top 6 popular products with stock badge, price, fitment preview
- Cross-sell teaser — "Riders who bought GSX-R150 oil also bought…"
- Trust block — "Genuine Suzuki parts only" + warranty mention + return policy link
- Floating cart icon (top-right) with running count

---

#### `/dealers` — Dealer Locator

- Bangladesh map mockup with dealer pins (concept; real Mapbox/Google integration in Phase 2)
- "Share location for nearest dealers" CTA → permission flow → list sorted by distance + travel time
- Per-dealer card: name, address, hotline (defaults to 16638 with dealer-specific extension if available), hours, services_offered (Sales / Service / Both badges), Google Maps directions link, WhatsApp deep link, "Reserve for test ride" CTA (Phase 2)
- Filter chips: All / Sales / Service / Both
- Footer: "Don't see your area? Call 16638"

---

#### `/contact` — Contact

- Hero: hotline 16638 large + tap-to-call
- Contact form: name, phone, email (optional), topic (dropdown: Sales / Service / EMI / Spare Parts / Other), message — submit triggers admin EMI/lead inbox
- WhatsApp Business deep link
- HQ map (RMBL HQ) + address
- Quick links: Find Dealer, Book Test Ride, Book Service

---

### 3.3 Cross-cutting UI Elements

**Persistent across all pages:**

- **Header navbar** — Suzuki logo (links to `/`) + nav: Bikes / Service / Shop / Dealers / News / About / Contact + Login/Account button + cart icon. Bikes link triggers a featured-bike hover preview animation
- **Footer** — Hotline 16638 prominent, RMBL attribution, social links, dealer locator link, legal links, payment partner badges (SSLCommerz logo)
- **Floating chat triggers** — FB Messenger button + WhatsApp Business button + on-site live chat trigger (UI shells; functional in Phase 2)
- **Cookie consent banner** — bottom-fixed, accept / customize / reject (GDPR-style, separate from lead capture)
- **Exit-intent lead-capture popup** — fires after 30s on bike-detail or before tab-close on homepage; preview of EMI calculator + email/phone/WhatsApp opt-in
- **Push notification opt-in prompt** — soft, dismissible

---

## 4. Admin Dashboard

> Combined `admin` role for prototype; production splits into 5 sub-roles (content-admin, service-manager, dealer-staff, sales-admin, admin)

### 4.1 Page Architecture

**Access:** `admin` role only, gated by `ProtectedRoute requiredRole="admin"`

| Route | Page |
|-------|------|
| `/admin` | Dashboard Overview |
| `/admin/news` | News CMS |
| `/admin/bookings/test-rides` | Test ride inbox |
| `/admin/bookings/service` | Service appointments |
| `/admin/orders` | Shop orders |
| `/admin/leads/emi` | EMI leads |
| `/admin/dealers` | Dealer directory |
| `/admin/users` | Users & roles (Phase 2) |

### 4.2 Feature List by Page

#### `/admin` — Dashboard Overview

- KPI cards: total customers (last 30d), test rides booked, EMI leads, shop orders, service appointments
- Charts: bookings over time, lead funnel (NEW → CONTACTED → QUALIFIED → CONVERTED), order revenue
- Recent activity feed
- Quick links to each module

> For prototype: stub admin dashboard so role-coverage gate passes (≥1 HTML in `design/html/admin/`).

#### `/admin/news` — News CMS

- Article list with search + filter (status: published / draft / scheduled)
- Create / edit / publish / unpublish / schedule
- Tag management
- Hero image upload

#### `/admin/bookings/test-rides`

- Inbox of test ride requests
- Filter by status (REQUESTED / CONFIRMED / COMPLETED / NO_SHOW / CANCELLED), dealer, date range
- Confirm / reschedule / cancel actions
- Per-request detail with customer contact info + notes

#### `/admin/bookings/service`

- Service appointment manager
- Slot calendar view per service center
- Status transitions (Received → InDiagnosis → InService → QualityCheck → ReadyForPickup)
- Push notification trigger on status change

#### `/admin/orders`

- Shop order management
- Filter by status, date range, customer
- Fulfillment, refund, cancellation actions
- SSLCommerz transaction reference visible

#### `/admin/leads/emi`

- EMI lead inbox
- Filter by status (NEW / CONTACTED / QUALIFIED / CONVERTED / CLOSED), bike, bank preference
- Assign to sales rep
- Activity log per lead

#### `/admin/dealers`

- Dealer + service center directory
- CRUD on dealer records: name, address, lat/long, hotline extension, hours, services_offered
- Map view of dealer network

---

## 5. Tech Stack

### Architecture

Three-layer architecture: backend API + customer frontend + admin frontend (potentially merged with role-based routing).

```
suzuki-bangladesh/
├── backend/      ← NestJS API (fresh build, not BFF wrap of api-v2.suzuki.com.bd)
├── frontend/     ← React 19 + React Router 7 customer + admin app (role-based routing)
└── docs/         ← PROJECT_KNOWLEDGE / API / DATABASE generated by /fullstack-dev D2
```

### Technologies

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Backend | NestJS | 10.x | API server, modular DDD |
| Language | TypeScript | 5.x strict | Type safety |
| ORM | TypeORM | 0.3.x | Database access via repository pattern |
| Database | PostgreSQL | 16.x | Primary data store (UUID primary keys, soft delete via BaseEntity) |
| Frontend | React | 19.x | UI |
| Routing | React Router 7 | 7.x (framework mode) | Client routing with file-based config |
| State | Redux Toolkit | latest | READ ops via createAsyncThunk in service files; mutations via direct service calls |
| CSS | Tailwind CSS | 4.x | Styling, brand tokens |
| Build | Vite | 5.x | Bundler |
| Forms | React Hook Form + Zod + Shadcn `<Form>` | latest | Mandatory pattern per project rules |
| HTTP client | Axios | 1.x | Via `httpService.ts` orchestrator + `httpMethods/` factories |

### Third-Party Integrations

| Service | Purpose | Phase |
|---------|---------|-------|
| **SSLCommerz** | Payment gateway (cards + bKash + Nagad + bank EMI through one integration) | Phase 1 |
| **Phone OTP** (provider TBD — likely SSL Wireless or Twilio MENA) | Customer auth primary | Phase 1 |
| **Google OAuth** | Customer auth secondary | Phase 1 |
| **Google Maps / Mapbox** | Dealer locator map | Phase 1 |
| **Web Push API** | Browser push notifications | Phase 1 |
| **WhatsApp Business API** | Notifications + chatbot surface | Phase 2 (UI shell in Phase 1) |
| **Facebook Messenger Platform** | Chatbot surface | Phase 2 (UI shell in Phase 1) |
| **Live chat (Crisp / Tawk / Intercom)** | On-site chat | Phase 2 (UI shell in Phase 1) |
| **MailHog → SES / Sendgrid** | Transactional email | Phase 1 |
| **S3 / DigitalOcean Spaces** | Asset storage (bike photos, hero videos, news media) | Phase 1 |
| **Sentry** | Error monitoring | Phase 1 |

### Key Decisions

| Decision | Rationale |
|----------|-----------|
| Fresh NestJS backend (not BFF wrap of `api-v2.suzuki.com.bd`) | Cleaner long-term architecture; existing API has accumulated legacy. Migration handled separately. |
| Phone OTP primary auth | BD-typical; lower friction than email+password; majority traffic is mobile |
| SSLCommerz only (vs. integrating bKash/Nagad/banks individually) | Single vendor surface; faster to ship; SSLCommerz aggregates the BD payment ecosystem |
| English-only v1 (no i18n infra) | Focuses scope; bilingual deferred to Phase 2 |
| CSS+SVG scroll animations (vs. WebGL / stock video / YouTube embeds) for 3D sections | Self-contained, brand-customizable, mobile-friendly, no licensing risk, lighter to load. WebGL/3D vendor work is a separate Phase 1 deliverable. |
| Combined `admin` role in v1 (vs. 5 split roles) | Reduces frontend layout-coverage gate burden; production split planned |
| Photoreal 3D engine vendor work split out from PM track | Vendor production is 8-12 weeks, BDT 8-25 lakh; orthogonal to web build |

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Required, no fallback (project rule) |
| `SSLCOMMERZ_STORE_ID` | Payment gateway store ID |
| `SSLCOMMERZ_STORE_PASSWORD` | Payment gateway secret |
| `SSLCOMMERZ_BASE_URL` | sandbox or production endpoint |
| `OTP_PROVIDER_API_KEY` | Phone OTP provider |
| `GOOGLE_OAUTH_CLIENT_ID` | Google login |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Google login |
| `GOOGLE_MAPS_API_KEY` | Dealer locator map |
| `WHATSAPP_BUSINESS_API_TOKEN` | Phase 2 |
| `MESSENGER_PAGE_TOKEN` | Phase 2 |
| `MAIL_HOST` / `MAIL_USER` / `MAIL_PASS` | Transactional email |
| `S3_BUCKET` / `S3_ACCESS_KEY` / `S3_SECRET_KEY` / `S3_REGION` | Asset storage |
| `SENTRY_DSN` | Error monitoring |
| `FRONTEND_URL` | Used in CORS and email templates |
| `BACKEND_URL` | Used in OAuth redirects |

### Non-Functional Requirements

- **Performance**: LCP < 2.5s on 4G, bundle < 500KB (gzipped initial), aggressive lazy-loading for Section 4 + 5, Draco geometry compression if WebGL is later added
- **Accessibility**: WCAG 2.1 AA on all conversion flows (test ride, EMI, checkout, service booking); respect `prefers-reduced-motion`; bilingual selectors deferred (English-only v1)
- **Security**: JWT in httpOnly cookies (no localStorage), CSRF protection, refresh token rotation, no JWT_SECRET fallback, SSLCommerz hosted payment (no card data on our servers)
- **Mobile**: Mobile-first responsive at 375 / 768 / 1024 / 1440 breakpoints; no horizontal scroll at 375px; touch targets ≥ 44×44px
- **SEO**: Server-side rendering or static prerendering for public pages; structured data for bikes (Product schema), dealers (LocalBusiness), articles (Article); sitemap.xml + robots.txt
- **Browser support**: Last 2 versions of Chrome, Safari, Firefox, Edge; iOS Safari 15+, Android Chrome 100+
- **Internet realities**: 3G fallback for Bangladesh — graceful degradation when bandwidth low; image lazy-loading; Section 4 + 5 fall back to static frames if `connection.effectiveType` is `slow-2g` or `2g`

---

## 6. Open Questions

| # | Question | Context / Impact | Owner | Status |
|:-:|----------|-----------------|-------|--------|
| 1 | Confirm engine specs for Gixxer SF 250 (26 PS @ 9000 RPM, 22.6 Nm @ 7300 RPM) | Section 5 reveals + bike detail specs page | Client (via Rancon) | ⏳ Open — placeholder used in prototype, tagged `[verify with Rancon]` |
| 2 | Is "SEP (Suzuki Eco Performance)" an actual marketed Suzuki technology, or should it be dropped/renamed? | Section 4 Activation 2 storyboard | Client (via Rancon) | ⏳ Open — placeholder used in prototype |
| 3 | 3D engine vendor selection — local (Magnito Digital, Asiatic Mindshare), regional (Royal Enfield / TVS Apache studios), or international (Active Theory / Resn / Locomotive)? | Required for Phase 1 photoreal 3D production (8-12 weeks) | Client + RMBL leadership | ⏳ Open — orthogonal to prototype |
| 4 | MotoGP imagery licensing — confirmed access to Joan Mir / Suzuki Ecstar / GSX-RR archival footage? | Section 7 + Activation 6 | Client + Suzuki Japan | ⏳ Open — prototype uses stylized silhouettes |
| 5 | News archive migration scope — full 200+ articles or curated subset? | `/news` content depth + admin CMS scope | Client + content team | ⏳ Open — prototype uses placeholder articles |
| 6 | Owner Portal scope (`/account/owner-portal`) for v1 vs. Phase 2 | Drives 4th user persona UX | Client | ⏳ Open — Phase 2 in current plan |
| 7 | Career listings — static markdown for v1, ATS in Phase 3 — confirm acceptable | Hiring workflow tooling | RMBL HR | ⏳ Open — defaulted to static |
| 8 | Existing `api-v2.suzuki.com.bd` migration plan — does data migration to fresh NestJS run in parallel or after launch? | Phase 1 timeline impact | Client + dev lead | ⏳ Open — flagged as separate work-stream |
| 9 | Phase 1 launch date — needs client confirmation against the 8–10 week + 4–6 week + 4 week phased plan | Schedule for vendor coordination, content production, launch marketing | Client | ⏳ Open |
| 10 | Bike-specific QR sticker placement (under seat) — does Rancon already produce these, or new initiative? | QR fitment scanner (Phase 2) feasibility | Client + manufacturing | ⏳ Open — Phase 2 |

---

**Generated:** 2026-04-30
**Source seed:** `.claude-project/status/suzuki-bangladesh/seed-suzuki-bd-v1.yaml`
**Source pre-intake:** `.claude-project/status/suzuki-bangladesh/pre-intake.md`
**Next:** P3-design — domain research + 3 design system variations + representative HTML showcase
