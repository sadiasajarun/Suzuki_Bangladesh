/* ============================================================
   Suzuki Bangladesh — Main entry point
   ============================================================
   Bootstraps the homepage. Loaded with type="module" but
   uses no imports (deps come from CDN globals: gsap, Lenis).
   Module mode just gives us deferred + strict execution.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // GSAP ScrollTrigger registration
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Lucide icons render (icons defined via <i data-lucide="..."> in markup)
  if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }

  // Mark body as ready (CSS can fade in)
  document.body.classList.add('is-ready');

  // Future phase modules (Hero, Tech, Engine) will register their own
  // ScrollTrigger timelines here once each phase is approved.

  console.info('[Suzuki BD] main.js initialized — Phase 1 (foundation) ready.');
});
