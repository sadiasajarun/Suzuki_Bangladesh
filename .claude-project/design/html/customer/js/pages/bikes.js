/* ============================================================
   bikes.html — page logic
   ============================================================
   Three things to wire:

     1. Animated category banner
        - Each category card scroll-reveals + bike silhouette pans
        - Click on a category = scroll to configurator with that
          category pre-selected

     2. Visual configurator (Apple-style)
        - Three filter axes: Category, Engine cc, Use case
        - One personalisation axis: Color (per-bike swatches)
        - As filters narrow, preview swaps to the best match
          (or shows "X bikes match" if multiple)

     3. Full grid
        - Re-filters live with the same filter state so the page
          feels like one configurator
   ============================================================ */

(() => {
  /* ============================================================
     1. BIKE DATA — single source of truth
     ============================================================
     Keep in sync with the navbar mega-menu in index.html and the
     hard-coded grid cards in bikes.html. Categories follow the
     official suzuki.com.bd/bikes taxonomy.
     ============================================================ */
  /* Each bike's colors[] entry maps to a real per-variant image at
     assets/images/bikes/<slug>/color-N.webp. Files were imported in
     filename-alphabetical order from the user's source folder, so the
     mapping below assumes that order. The hex codes drive the swatch
     dots in the UI — they don't need to match the paint exactly,
     they just need to look distinct. Names + hex can be edited
     freely; only the image path needs to match a real file. */
  const BIKES = [
    {
      id: 'gixxer-sf-250',
      name: 'Gixxer SF 250',
      tagline: 'MotoGP-bred fully-faired flagship.',
      category: 'super-sports',
      engineCc: 250,
      engineBucket: '250',
      useCases: ['weekend', 'track'],
      price: 429950,
      colors: [
        { id: 'matte-black',     name: 'Matte Black',          hex: '#0E0E0E', image: 'assets/images/bikes/gixxer-sf-250/color-1.webp' },
        { id: 'metallic-blue',   name: 'Metallic Triton Blue', hex: '#0F4E8B', image: 'assets/images/bikes/gixxer-sf-250/color-2.webp' },
        { id: 'nitro-neon',      name: 'Nitro Neon',           hex: '#7ED321', image: 'assets/images/bikes/gixxer-sf-250/color-3.webp' },
        { id: 'pearl-mira-red',  name: 'Pearl Mira Red',       hex: '#9B1B22', image: 'assets/images/bikes/gixxer-sf-250/color-4.webp' },
        { id: 'sparkle-silver',  name: 'Sparkle Silver',       hex: '#A8ABB0', image: 'assets/images/bikes/gixxer-sf-250/color-5.webp' },
      ],
    },
    {
      id: 'gsx-r150',
      name: 'GSX-R150',
      tagline: 'Track-ready DOHC supersport.',
      category: 'performance-sports',
      engineCc: 150,
      engineBucket: '155',
      useCases: ['track', 'weekend'],
      price: 524950,
      colors: [
        { id: 'yellow-black', name: 'Yellow / Black', hex: '#F8E71C', image: 'assets/images/bikes/gsx-r150/color-1.webp' },
        { id: 'red-black',    name: 'Red / Black',    hex: '#D0021B', image: 'assets/images/bikes/gsx-r150/color-2.webp' },
      ],
    },
    {
      id: 'gixxer-250',
      name: 'Gixxer 250',
      tagline: 'Naked streetfighter, 250cc.',
      category: 'sports',
      engineCc: 250,
      engineBucket: '250',
      useCases: ['weekend', 'daily'],
      price: 379950,
      colors: [
        { id: 'metallic-black', name: 'Metallic Black', hex: '#1A1A1A', image: 'assets/images/bikes/gixxer-250/color-1.webp' },
        { id: 'pearl-mira-red', name: 'Pearl Mira Red', hex: '#9B1B22', image: 'assets/images/bikes/gixxer-250/color-2.webp' },
        { id: 'nardo-grey',     name: 'Nardo Grey',     hex: '#858C98', image: 'assets/images/bikes/gixxer-250/color-3.webp' },
        { id: 'metallic-blue',  name: 'Metallic Blue',  hex: '#1F4FB4', image: 'assets/images/bikes/gixxer-250/color-4.webp' },
      ],
    },
    {
      id: 'gixxer-sf',
      name: 'Gixxer SF',
      tagline: 'Faired sports for the everyday rider.',
      category: 'sports',
      engineCc: 155,
      engineBucket: '155',
      useCases: ['weekend', 'daily'],
      price: 329950,
      colors: [
        { id: 'glass-sparkle-black',  name: 'Glass Sparkle Black',  hex: '#111111', image: 'assets/images/bikes/gixxer-sf/color-1.webp' },
        { id: 'metallic-triton-blue', name: 'Metallic Triton Blue', hex: '#0F4E8B', image: 'assets/images/bikes/gixxer-sf/color-2.webp' },
        { id: 'lemon-silver',         name: 'Lemon / Silver',       hex: '#ACBE00', image: 'assets/images/bikes/gixxer-sf/color-3.webp' },
      ],
    },
    {
      id: 'gixxer',
      name: 'Gixxer',
      tagline: 'Naked muscle. Real-world ergonomics.',
      category: 'commuter',
      engineCc: 155,
      engineBucket: '155',
      useCases: ['daily', 'weekend'],
      price: 229950,
      colors: [
        { id: 'glass-sparkle-black', name: 'Glass Sparkle Black', hex: '#111111', image: 'assets/images/bikes/gixxer/color-1.webp' },
        { id: 'pearl-mira-red',      name: 'Pearl Mira Red',      hex: '#9B1B22', image: 'assets/images/bikes/gixxer/color-2.webp' },
        { id: 'metallic-blue',       name: 'Metallic Blue',       hex: '#1F4FB4', image: 'assets/images/bikes/gixxer/color-3.webp' },
      ],
    },
    {
      id: 'gixxer-classic-matt',
      name: 'Gixxer Classic Matt',
      tagline: 'Matte-classic finish. Same Gixxer DNA.',
      category: 'commuter',
      engineCc: 155,
      engineBucket: '155',
      useCases: ['daily'],
      price: 202950,
      colors: [
        { id: 'matt-classic-grey', name: 'Matt Classic Grey', hex: '#3A3A3A', image: 'assets/images/bikes/gixxer-classic-matt/color-1.webp' },
        { id: 'matt-bronze',       name: 'Matt Bronze',       hex: '#5C4A3A', image: 'assets/images/bikes/gixxer-classic-matt/color-2.webp' },
      ],
    },
    {
      id: 'gixxer-monotone',
      name: 'Gixxer Monotone',
      tagline: 'Stealth monotone. Pure Gixxer ride.',
      category: 'commuter',
      engineCc: 155,
      engineBucket: '155',
      useCases: ['daily'],
      price: 199950,
      colors: [
        { id: 'monotone-black', name: 'Monotone Black', hex: '#0F0F0F', image: 'assets/images/bikes/gixxer-monotone/color-1.webp' },
        { id: 'monotone-red',   name: 'Monotone Red',   hex: '#9B1B22', image: 'assets/images/bikes/gixxer-monotone/color-2.webp' },
        { id: 'monotone-blue',  name: 'Monotone Blue',  hex: '#1F4FB4', image: 'assets/images/bikes/gixxer-monotone/color-3.webp' },
        { id: 'monotone-grey',  name: 'Monotone Grey',  hex: '#5C5F66', image: 'assets/images/bikes/gixxer-monotone/color-4.webp' },
      ],
    },
    {
      id: 'access-125',
      name: 'Access 125',
      tagline: 'Premium scooter. Family-friendly.',
      category: 'scooter',
      engineCc: 125,
      engineBucket: '125',
      useCases: ['daily'],
      price: 215000,
      colors: [
        { id: 'pearl-mira-red',  name: 'Pearl Mira Red',  hex: '#9B1B22', image: 'assets/images/bikes/access-125/color-1.webp' },
        { id: 'metallic-sonic',  name: 'Metallic Sonic',  hex: '#5C5F66', image: 'assets/images/bikes/access-125/color-2.webp' },
        { id: 'pearl-blue',      name: 'Pearl Blue',      hex: '#1F4FB4', image: 'assets/images/bikes/access-125/color-3.webp' },
      ],
    },
    {
      id: 'gsx-125',
      name: 'GSX 125',
      tagline: 'Sports-style commuter at 125cc.',
      category: 'commuter',
      engineCc: 125,
      engineBucket: '125',
      useCases: ['daily'],
      price: 141950,
      colors: [
        { id: 'sonic-silver', name: 'Sonic Silver',  hex: '#7A7E84', image: 'assets/images/bikes/gsx-125/color-1.webp' },
        { id: 'race-red',     name: 'Race Red',      hex: '#E40521', image: 'assets/images/bikes/gsx-125/color-2.webp' },
        { id: 'race-blue',    name: 'Race Blue',     hex: '#1F4FB4', image: 'assets/images/bikes/gsx-125/color-3.webp' },
      ],
    },
    {
      id: 'hayate-ep',
      name: 'Hayate EP',
      tagline: 'Efficient daily commuter.',
      category: 'commuter',
      engineCc: 113,
      engineBucket: '125',
      useCases: ['daily'],
      price: 118000,
      colors: [
        { id: 'glass-sparkle-black', name: 'Glass Sparkle Black', hex: '#111111', image: 'assets/images/bikes/hayate-ep/color-1.webp' },
        { id: 'metallic-blue',       name: 'Metallic Blue',       hex: '#1F4FB4', image: 'assets/images/bikes/hayate-ep/color-2.webp' },
        { id: 'pearl-red',           name: 'Pearl Red',           hex: '#9B1B22', image: 'assets/images/bikes/hayate-ep/color-3.webp' },
        { id: 'sparkle-silver',      name: 'Sparkle Silver',      hex: '#A8ABB0', image: 'assets/images/bikes/hayate-ep/color-4.webp' },
      ],
    },
  ];

  /* ============================================================
     2. STATE — what the user has selected
     ============================================================ */
  const state = {
    category: null,    // 'scooter' | 'commuter' | 'sports' | 'super-sports' | 'performance-sports' | null
    engine: null,      // '125' | '155' | '250' | null
    useCase: null,     // 'daily' | 'weekend' | 'track' | null
    activeBikeId: null,
    activeColorId: null,
  };

  const fmtBDT = (n) => 'BDT ' + n.toLocaleString('en-US');

  /* ============================================================
     3. CATEGORY BANNER — click to scroll to configurator
     ============================================================ */
  function wireCategoryBanner() {
    const cards = document.querySelectorAll('[data-category-card]');
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const category = card.dataset.categoryCard;
        state.category = category;
        // Scroll to configurator
        const target = document.getElementById('configurator');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        applyState();
      });
    });
  }

  /* ============================================================
     4. CONFIGURATOR — filter pills + preview swap
     ============================================================ */
  function wireConfigurator() {
    document.querySelectorAll('.cf-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        const axis = pill.dataset.axis;       // 'category' | 'engine' | 'useCase'
        const value = pill.dataset.value;     // pill value
        // Toggle: clicking the same pill clears the axis
        state[axis] = state[axis] === value ? null : value;
        applyState();
      });
    });

    const resetBtn = document.querySelector('[data-cf-reset]');
    if (resetBtn) {
      resetBtn.addEventListener('click', clearAllFilters);
    }

    // Prev / next slider arrows on the preview pane — cycle through
    // currently-matching bikes without changing the filter state.
    if (previewPrev) previewPrev.addEventListener('click', () => stepMatch(-1));
    if (previewNext) previewNext.addEventListener('click', () => stepMatch(+1));
  }

  function stepMatch(delta) {
    const matches = getMatches();
    if (matches.length < 2) return;
    const currentIdx = Math.max(0, matches.findIndex((b) => b.id === state.activeBikeId));
    const nextIdx = (currentIdx + delta + matches.length) % matches.length;
    state.activeBikeId = matches[nextIdx].id;
    state.activeColorId = null;        // reset to default colour for the new bike
    applyState();
  }

  function clearAllFilters() {
    state.category = null;
    state.engine = null;
    state.useCase = null;
    state.activeBikeId = null;
    state.activeColorId = null;
    applyState();
  }

  /* ============================================================
     5. FILTER BIKES — return matches for current state
     ============================================================ */
  function bikeMatchesFilters(b, filters) {
    if (filters.category && b.category !== filters.category) return false;
    if (filters.engine && b.engineBucket !== filters.engine) return false;
    if (filters.useCase && !b.useCases.includes(filters.useCase)) return false;
    return true;
  }
  function getMatches() {
    return BIKES.filter((b) => bikeMatchesFilters(b, state));
  }
  /* For each pill on a given axis, would adding it to the current
     state still yield at least one match? Used to grey out pills
     that would lead to a 0-match dead-end. */
  function pillWouldMatch(axis, value) {
    const hypo = { ...state, [axis]: value };
    return BIKES.some((b) => bikeMatchesFilters(b, hypo));
  }

  /* ============================================================
     6. RENDER — preview, color swatches, count, grid filter
     ============================================================ */
  const previewEl = document.querySelector('.cf-preview');
  const previewImg = document.querySelector('[data-cf-preview-img]');
  const previewName = document.querySelector('[data-cf-preview-name]');
  const previewTagline = document.querySelector('[data-cf-preview-tagline]');
  const previewPrice = document.querySelector('[data-cf-preview-price]');
  const previewMeta = document.querySelector('[data-cf-preview-meta]');
  const previewCTA = document.querySelector('[data-cf-preview-cta]');
  const previewSwatchesEl = document.querySelector('[data-cf-swatches]');
  const previewBadgeEl = document.querySelector('[data-cf-match-count]');
  const previewEmpty = document.querySelector('[data-cf-empty]');
  const previewBody = document.querySelector('[data-cf-body]');
  const previewPrev = document.querySelector('[data-cf-prev]');
  const previewNext = document.querySelector('[data-cf-next]');
  const previewPos = document.querySelector('[data-cf-pos]');
  const gridEl = document.querySelector('[data-bike-grid]');
  const gridCountEl = document.querySelector('[data-grid-count]');
  const chipsEl = document.querySelector('[data-bg-chips]');

  function applyState() {
    // 1. Sync filter pills: aria-pressed + .is-disabled
    //    A pill is disabled if adding it to the current state would
    //    yield zero matches. Active pills (already pressed) stay
    //    clickable so the user can deselect them.
    document.querySelectorAll('.cf-pill').forEach((pill) => {
      const axis = pill.dataset.axis;
      const value = pill.dataset.value;
      const isActive = state[axis] === value;
      pill.setAttribute('aria-pressed', String(isActive));

      // A pill stays clickable if (a) it's currently active, or
      // (b) adding it to the state would still yield matches.
      const enabled = isActive || pillWouldMatch(axis, value);
      pill.classList.toggle('is-disabled', !enabled);
      if (enabled) pill.removeAttribute('aria-disabled');
      else pill.setAttribute('aria-disabled', 'true');
    });

    // 2. Compute matches
    const matches = getMatches();

    // 3. Update match count badge
    if (previewBadgeEl) {
      const all = BIKES.length;
      previewBadgeEl.textContent = matches.length === all
        ? `${all} bikes`
        : `${matches.length} of ${all} match`;
    }

    // 4. Pick the active bike for the preview. If the previously-
    //    active bike no longer matches the filters, fall back to
    //    matches[0]. Track the index in the matches array so the
    //    prev/next slider can cycle through them.
    let bike = null;
    let matchIndex = 0;
    if (state.activeBikeId) {
      const idx = matches.findIndex((b) => b.id === state.activeBikeId);
      if (idx >= 0) {
        bike = matches[idx];
        matchIndex = idx;
      } else {
        // Active bike was filtered out — snap to first match
        bike = matches[0] || null;
        if (bike) state.activeBikeId = bike.id;
      }
    } else if (matches.length > 0) {
      bike = matches[0];
    }

    // 4b. Slider visibility — only when more than one match
    if (previewEl) {
      previewEl.classList.toggle('is-multi', matches.length > 1);
    }
    if (previewPos && matches.length > 0) {
      previewPos.textContent = `${matchIndex + 1} / ${matches.length}`;
    }

    // 5. Render preview
    if (bike) {
      // Pick active color (default to first if none set or invalid)
      let color = bike.colors.find((c) => c.id === state.activeColorId);
      if (!color) color = bike.colors[0];

      if (previewBody) previewBody.hidden = false;
      if (previewEmpty) previewEmpty.hidden = true;

      if (previewImg) {
        previewImg.src = color.image;
        previewImg.alt = `Suzuki ${bike.name} in ${color.name}`;
      }
      if (previewName) previewName.textContent = bike.name;
      if (previewTagline) previewTagline.textContent = bike.tagline;
      if (previewPrice) previewPrice.textContent = `From ${fmtBDT(bike.price)}`;
      if (previewMeta) {
        previewMeta.innerHTML = '';
        const meta = [
          { label: 'Engine', value: `${bike.engineCc} cc` },
          { label: 'Category', value: prettyCategory(bike.category) },
          { label: 'Built for', value: bike.useCases.map(prettyUseCase).join(' · ') },
        ];
        meta.forEach((row) => {
          const li = document.createElement('li');
          li.innerHTML = `<span>${row.label}</span><strong>${row.value}</strong>`;
          previewMeta.appendChild(li);
        });
      }
      if (previewCTA) {
        previewCTA.href = `bikes/${bike.id}.html`;
        previewCTA.dataset.bikeId = bike.id;
      }

      // Color swatches
      if (previewSwatchesEl) {
        previewSwatchesEl.innerHTML = '';
        bike.colors.forEach((c) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'cf-swatch' + (c.id === color.id ? ' is-active' : '');
          btn.style.background = c.hex;
          btn.setAttribute('aria-label', c.name);
          btn.title = c.name;
          btn.dataset.colorId = c.id;
          btn.addEventListener('click', () => {
            state.activeBikeId = bike.id;
            state.activeColorId = c.id;
            applyState();
          });
          previewSwatchesEl.appendChild(btn);
        });
      }
    } else {
      // No matches — show empty state
      if (previewBody) previewBody.hidden = true;
      if (previewEmpty) previewEmpty.hidden = false;
    }

    // 6. Filter the grid
    if (gridEl) {
      const cards = gridEl.querySelectorAll('[data-bike-card]');
      let visible = 0;
      cards.forEach((card) => {
        const id = card.dataset.bikeCard;
        const match = matches.find((b) => b.id === id);
        const show = !!match;
        card.classList.toggle('is-hidden', !show);
        if (show) visible++;
      });
      if (gridCountEl) {
        gridCountEl.textContent = visible === BIKES.length ? `All ${BIKES.length}` : `${visible}`;
      }
    }

    // 7. Render the active-filter chips beneath "The full lineup"
    renderChips();
  }

  /* ============================================================
     7. CHIPS — render active-filter chips + Clear-all
     ============================================================ */
  function renderChips() {
    if (!chipsEl) return;
    const active = [
      state.category && { axis: 'category', label: prettyCategory(state.category) },
      state.engine   && { axis: 'engine',   label: prettyEngine(state.engine) },
      state.useCase  && { axis: 'useCase',  label: prettyUseCase(state.useCase) },
    ].filter(Boolean);

    if (active.length === 0) {
      chipsEl.hidden = true;
      chipsEl.innerHTML = '';
      return;
    }
    chipsEl.hidden = false;
    chipsEl.innerHTML =
      `<span class="bg-chips-label">› Filtering by</span>` +
      active.map((a) =>
        `<button type="button" class="bg-chip" data-bg-chip="${a.axis}" aria-label="Remove ${a.label} filter">
          ${a.label}<span class="bg-chip-x" aria-hidden="true">×</span>
        </button>`
      ).join('') +
      `<button type="button" class="bg-clear" data-bg-clear>Clear all</button>`;
  }

  function prettyEngine(e) {
    return ({ '125': '125 cc', '155': '150 – 155 cc', '250': '250 cc' })[e] || `${e} cc`;
  }

  function prettyCategory(c) {
    return ({
      'scooter': 'Scooter',
      'commuter': 'Commuter',
      'sports': 'Sports',
      'super-sports': 'Super Sports',
      'performance-sports': 'Performance Sports',
    })[c] || c;
  }
  function prettyUseCase(u) {
    return ({
      'daily': 'Daily commute',
      'weekend': 'Weekend cruise',
      'track': 'Track-ready',
    })[u] || u;
  }

  /* ============================================================
     7. GRID CARD CLICK — pick the bike + jump to configurator
     ============================================================ */
  function wireGridCards() {
    if (!gridEl) return;
    gridEl.querySelectorAll('[data-bike-card]').forEach((card) => {
      const previewBtn = card.querySelector('[data-bike-preview]');
      if (!previewBtn) return;
      previewBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = card.dataset.bikeCard;
        state.activeBikeId = id;
        state.activeColorId = null;
        applyState();
        const target = document.getElementById('configurator');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ============================================================
     8. CHIP CLICK HANDLER — delegated from the chips container
     ============================================================ */
  function wireChips() {
    if (!chipsEl) return;
    chipsEl.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-bg-chip]');
      if (chip) {
        const axis = chip.dataset.bgChip;
        state[axis] = null;
        // If the active bike is no longer in matches, applyState
        // handles the fallback automatically.
        applyState();
        return;
      }
      const clear = e.target.closest('[data-bg-clear]');
      if (clear) {
        clearAllFilters();
      }
    });
  }

  /* ============================================================
     9. INIT
     ============================================================ */
  function init() {
    wireCategoryBanner();
    wireConfigurator();
    wireGridCards();
    wireChips();
    applyState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
