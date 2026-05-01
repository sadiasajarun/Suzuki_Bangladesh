/* ============================================================
   SECTION 4 — Engine Showcase
   ============================================================
   IntersectionObserver triggers a one-shot stagger that fades
   the six feature callouts in sequence as the section enters
   the viewport. Reduced motion: all callouts visible instantly.
   ============================================================ */

(function engineShowcaseInit() {
  'use strict';

  function ready() {
    const section = document.getElementById('engine');
    if (!section || !section.classList.contains('es-section')) return;

    const callouts = section.querySelectorAll('.es-callout');
    if (!callouts.length) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      callouts.forEach((c) => c.classList.add('is-revealed'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callouts.forEach((c, idx) => {
            setTimeout(() => c.classList.add('is-revealed'), idx * 140);
          });
          io.disconnect();
        }
      });
    }, {
      rootMargin: '-15% 0px -15% 0px',
      threshold: 0.15,
    });

    io.observe(section);

    window.__es = { section, callouts };
    console.info('[es] engine showcase wired —', callouts.length, 'callouts.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
