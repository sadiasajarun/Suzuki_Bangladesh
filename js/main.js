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

  // ---------------------------------------------------------------
  // Lazy-load background images. Any element with `data-bg` has
  // its CSS background-image set to that URL once it's within
  // 400 px of the viewport. Saves 1–2 MB on first paint for the
  // homepage's photo-clipped letters + find-bike category covers.
  // ---------------------------------------------------------------
  const bgEls = document.querySelectorAll('[data-bg]');
  if (bgEls.length) {
    const hydrate = (el) => {
      const src = el.dataset.bg;
      if (!src) return;
      el.style.backgroundImage = "url('" + src + "')";
      el.removeAttribute('data-bg');
    };
    if (!('IntersectionObserver' in window)) {
      bgEls.forEach(hydrate);
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            hydrate(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '400px 0px' });
      bgEls.forEach((el) => io.observe(el));
    }
  }

  // Mark body as ready (CSS can fade in)
  document.body.classList.add('is-ready');

  // Future phase modules (Hero, Tech, Engine) will register their own
  // ScrollTrigger timelines here once each phase is approved.

  console.info('[Suzuki BD] main.js initialized — Phase 1 (foundation) ready.');
});
