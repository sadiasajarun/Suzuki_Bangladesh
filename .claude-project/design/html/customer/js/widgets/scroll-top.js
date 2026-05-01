/* ============================================================
   Scroll-to-top widget
   ============================================================
   Pinned button in the bottom-right corner of every page.
     · Hidden at the top of the page
     · Fades in once the user has scrolled past TRIGGER_PX
     · Click smooth-scrolls back to top (instant if reduced-motion)
   Auto-injects its own DOM, so pages just need to include this
   script — no markup changes required.
   ============================================================ */

(function scrollTopInit() {
  'use strict';

  const TRIGGER_PX = 320;   // how far the user must scroll before it appears

  function ready() {
    // Bail if a button is already present (e.g., re-injected during HMR/dev)
    if (document.querySelector('.stt-btn')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'stt-btn';
    btn.setAttribute('aria-label', 'Scroll back to top');
    btn.setAttribute('data-testid', 'scroll-top');
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 15l6-6 6 6" />
      </svg>
    `;
    document.body.appendChild(btn);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* --- visibility ------------------------------------------------ */
    let visible = false;
    function update() {
      const shouldShow = window.scrollY > TRIGGER_PX;
      if (shouldShow !== visible) {
        visible = shouldShow;
        btn.classList.toggle('is-visible', visible);
      }
    }

    /* --- scroll listener with rAF throttle ------------------------- */
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    }, { passive: true });

    /* --- click handler -------------------------------------------- */
    btn.addEventListener('click', () => {
      // If Lenis is mounted, prefer its scrollTo for the smooth-scroll
      // pipeline the rest of the page uses; fall back to the native
      // window.scrollTo otherwise.
      if (window.lenis && typeof window.lenis.scrollTo === 'function') {
        window.lenis.scrollTo(0, { duration: reduced ? 0 : 1.0 });
      } else {
        window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      }
      // Move focus back to the document start so keyboard users land
      // on the navbar after the scroll completes.
      const target = document.querySelector('header, nav, main') || document.body;
      try { target.focus({ preventScroll: true }); } catch (_) { /* old browsers */ }
    });

    update();   // initial state — hidden if at top
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
