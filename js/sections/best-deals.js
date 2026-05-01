/* ============================================================
   SECTION 5 — Best Deals (slideshow)
   ============================================================
   Manages the prev/next + dot navigation. The number of visible
   cards comes from the CSS variable --bd-visible (1 / 2 / 3
   depending on viewport). Track translation is computed in pixels
   (offsetWidth + gap) so it's accurate at every breakpoint.

   Mobile (≤640px): native scroll-snap takes over; this script
   bails out and lets the browser handle horizontal swiping.
   ============================================================ */

(function bestDealsInit() {
  'use strict';

  function ready() {
    const section = document.getElementById('offers');
    if (!section || !section.classList.contains('bd-section')) return;

    const viewport = section.querySelector('.bd-viewport');
    const track    = section.querySelector('.bd-track');
    const cards    = section.querySelectorAll('.bd-card');
    const prevBtn  = section.querySelector('[data-bd-prev]');
    const nextBtn  = section.querySelector('[data-bd-next]');
    const dots     = section.querySelectorAll('.bd-dot');
    const counter  = section.querySelector('.bd-counter strong');
    const counterTotal = section.querySelector('.bd-counter .total');

    if (!viewport || !track || !cards.length) return;

    let current = 0;
    let visible = getVisibleCount();
    let maxIndex = Math.max(0, cards.length - visible);

    function getVisibleCount() {
      // Read the CSS var the section uses, fallback to media-query inference
      const cssValue = getComputedStyle(section).getPropertyValue('--bd-visible').trim();
      const n = parseInt(cssValue, 10);
      if (!Number.isNaN(n) && n > 0) return n;
      const w = window.innerWidth;
      if (w <= 640) return 1;
      if (w <= 1024) return 2;
      return 3;
    }

    function isMobile() { return window.matchMedia('(max-width: 640px)').matches; }

    function recalc() {
      visible = getVisibleCount();
      maxIndex = Math.max(0, cards.length - visible);
      if (current > maxIndex) current = maxIndex;
      paint();
    }

    function paint() {
      if (isMobile()) {
        // Mobile: native scroll handles it; clear any inline transform
        track.style.transform = '';
        return;
      }
      const cardW = cards[0].offsetWidth;
      const gap   = parseInt(getComputedStyle(track).gap, 10) || 16;
      const moveX = current * (cardW + gap);
      track.style.transform = `translate3d(-${moveX}px, 0, 0)`;

      // Disable arrows at boundaries
      if (prevBtn) prevBtn.disabled = current === 0;
      if (nextBtn) nextBtn.disabled = current >= maxIndex;

      // Counter
      if (counter) counter.textContent = String(current + 1).padStart(2, '0');

      // Dots — only one is "active" per current page
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
    }

    function go(i) {
      current = Math.max(0, Math.min(maxIndex, i));
      paint();
    }
    function next() { go(current + 1); }
    function prev() { go(current - 1); }

    /* ---- Wire controls ---- */
    prevBtn?.addEventListener('click', prev);
    nextBtn?.addEventListener('click', next);
    dots.forEach((dot, i) => dot.addEventListener('click', () => go(i)));

    /* ---- Keyboard support on the section ---- */
    section.addEventListener('keydown', (e) => {
      if (isMobile()) return;
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    });

    /* ---- Resize: recalc visible count + boundaries ---- */
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(recalc, 120);
    });

    /* ---- Initial counter total ---- */
    if (counterTotal) counterTotal.textContent = String(cards.length).padStart(2, '0');

    recalc();

    /* ---- Dev hook ---- */
    window.__bd = { section, go, next, prev, current: () => current };
    console.info('[bd] best deals slider wired —', cards.length, 'cards,', visible, 'visible.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
