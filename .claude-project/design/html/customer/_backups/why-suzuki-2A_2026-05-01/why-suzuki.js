/* ============================================================
   SECTION 2 — Why Suzuki Is Different (Phase 2A)
   ============================================================
   Builds the foundation: GSAP ScrollTrigger pin, blueprint sketch
   fade-in tied to scroll progress, traveling timeline dot, right-
   edge scroll progress bar.

   Phase 2B will add: heading entrance, 4 differentiator reveals,
   year flip, per-point visual cues.
   Phase 2C will add: 104 climax, mobile carousel, reduced-motion
   fallback.
   ============================================================ */

(function whySuzukiInit() {
  'use strict';

  function ready() {
    // Bail if libraries missing — section degrades to a static stack
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[ws] GSAP/ScrollTrigger missing — section will not pin/scrub.');
      // Reveal sketches statically so the layout still has visual content
      document.querySelectorAll('.ws-sketch').forEach(s => s.classList.add('is-visible'));
      return;
    }

    const section = document.getElementById('section-2-why-suzuki');
    if (!section) {
      console.info('[ws] No #section-2-why-suzuki on this page — skipping.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const sketches = Array.from(document.querySelectorAll('.ws-sketch'));
    const railDot   = section.querySelector('.ws-rail-dot');
    const progBar   = section.querySelector('.ws-progress-bar');
    const reduced   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* --------------------------------------------------------
       Reduced motion: skip pinning, show everything statically
       -------------------------------------------------------- */
    if (reduced) {
      sketches.forEach(s => s.classList.add('is-visible'));
      console.info('[ws] reduced-motion — skipping pin and scrub.');
      return;
    }

    /* --------------------------------------------------------
       Mobile (≤767px): also skip the pin behaviour — Phase 2C
       will replace it with a vertical card carousel. For now
       just reveal everything statically so the section still
       reads correctly on a phone.
       -------------------------------------------------------- */
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (isMobile) {
      sketches.forEach(s => s.classList.add('is-visible'));
      console.info('[ws] mobile viewport — pin disabled (Phase 2C will add carousel).');
      return;
    }

    /* --------------------------------------------------------
       Pre-process sketches: each carries data-reveal-at (% of
       section scroll where it should fade in) so we can do a
       cheap threshold-check on each scrub frame.
       -------------------------------------------------------- */
    const sketchData = sketches.map(el => ({
      el,
      threshold: parseFloat(el.dataset.revealAt || '0') / 100,
      visible: false,
    }));

    /* --------------------------------------------------------
       Timeline dot — travels from top of rail to bottom over
       the section's scroll length. Anchor at 5%–95% of rail
       so the dot stays inside the visible track.
       -------------------------------------------------------- */
    function placeRailDot(progress) {
      if (!railDot) return;
      // Map progress (0..1) to vertical % within the rail's visible
      // track. The CSS gives the rail top: clamp(2rem, 6vh, 5rem)
      // and bottom: same — we use 0..100% of the rail's parent height
      // since the parent's padding is absorbed by the .ws-rail-line.
      const min = 5, max = 95;            // %
      const y = min + (max - min) * progress;
      railDot.style.top = `${y}%`;
    }
    placeRailDot(0);

    /* --------------------------------------------------------
       MAIN SCROLL TRIGGER — pins the section and scrubs a
       master progress value. Phase 2B/2C subscribe additional
       sub-timelines to this same trigger.
       -------------------------------------------------------- */
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=400%',          // 4 viewport heights of scroll inside this section
      pin: true,
      pinSpacing: true,
      scrub: 1,
      anticipatePin: 1,       // smoother pin on fast scroll
      onUpdate: (self) => {
        const p = self.progress;       // 0..1

        // 1. Right-edge scroll progress bar
        if (progBar) progBar.style.height = `${p * 100}%`;

        // 2. Timeline dot travels down the rail
        placeRailDot(p);

        // 3. Sketch fade-in — toggle .is-visible on each crossing
        sketchData.forEach((s) => {
          if (!s.visible && p >= s.threshold) {
            s.el.classList.add('is-visible');
            s.visible = true;
          } else if (s.visible && p < s.threshold - 0.02) {
            // Hysteresis: re-hide on reverse only after a small gap
            s.el.classList.remove('is-visible');
            s.visible = false;
          }
        });
      },
    });

    /* --------------------------------------------------------
       Lenis ↔ ScrollTrigger sync — Lenis is initialised in
       lenis-init.js and exposed on window.__lenis. If GSAP's
       ticker hasn't been wired to it yet, the existing init
       handles it; otherwise ScrollTrigger.update() is already
       being called per Lenis frame from lenis-init.js.
       -------------------------------------------------------- */

    /* --------------------------------------------------------
       Recompute on resize (debounced via ScrollTrigger.refresh)
       -------------------------------------------------------- */
    window.addEventListener('resize', () => {
      // ScrollTrigger handles its own refresh on resize; this is
      // just for our derived state to keep the dot positioned right.
      placeRailDot(trigger.progress);
    }, { passive: true });

    /* --------------------------------------------------------
       Dev hook — expose for debugging
       -------------------------------------------------------- */
    window.__ws = { section, trigger, sketches: sketchData };
    console.info('[ws] Phase 2A pin + sketch scrub initialised.');
  }

  // Boot after DOM is ready (defer attribute should make this safe but
  // we double-check for paranoid race conditions with GSAP load order)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
