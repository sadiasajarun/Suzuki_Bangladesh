/* ============================================================
   Suzuki Bangladesh — Lenis smooth scroll initialization
   ============================================================
   Sets up smooth scroll with Lenis. Integrates with GSAP
   ScrollTrigger so scroll-driven animations stay accurate.
   Respects prefers-reduced-motion.
   ============================================================ */

(function initLenis() {
  // Bail if user prefers reduced motion — native scroll is fine
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    console.info('[Lenis] Reduced motion — skipping smooth scroll init.');
    return;
  }

  // Bail if Lenis isn't loaded (defensive — script may load async)
  if (typeof Lenis === 'undefined') {
    console.warn('[Lenis] Library not yet loaded. Will retry on DOMContentLoaded.');
    document.addEventListener('DOMContentLoaded', initLenis);
    return;
  }

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // ease-out-expo
    smoothWheel: true,
    smoothTouch: false, // mobile uses native scroll for performance
  });

  // Expose globally so other modules (GSAP, debug) can access
  window.__lenis = lenis;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // GSAP ScrollTrigger integration (if loaded)
  if (typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
})();
