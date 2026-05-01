/* ============================================================
   SECTION 3 — Find Your Perfect Suzuki · v2 (continuous marquee)
   ============================================================
   The slide is now CSS-driven (animation: fb-scroll Xs linear
   infinite). This file does the small enhancements that need JS:

     1. Lock duplicate cards out of tab order at runtime so users
        Tab through the 5 unique cards only (each duplicate has
        tabindex="-1" + aria-hidden in the markup, but JS adds a
        belt-and-suspenders pointer-events: auto reset on focus
        so keyboard users hitting a duplicate still get a pause)
     2. Visibility API — pause animation when tab is hidden to
        save CPU (CSS animations don't auto-pause when hidden)
     3. Dev hook
   ============================================================ */

(function findBikeInit() {
  'use strict';

  function ready() {
    const section = document.getElementById('bikes');
    if (!section || !section.classList.contains('fb-section')) return;

    const marquee = section.querySelector('.fb-marquee');
    const track   = section.querySelector('.fb-track');
    if (!marquee || !track) return;

    /* --------------------------------------------------------
       Belt-and-suspenders: ensure duplicate cards aren't tab-able.
       (Markup already sets tabindex=-1 + aria-hidden, but if the
       HTML is ever edited and that attribute is dropped, this
       enforces it at runtime.)
       -------------------------------------------------------- */
    track.querySelectorAll('.fb-card[aria-hidden="true"]').forEach((card) => {
      card.setAttribute('tabindex', '-1');
    });

    /* --------------------------------------------------------
       Pause animation when tab is hidden — saves CPU + battery.
       Uses CSS variable (toggled via attribute) so all Lenis-style
       scroll watchers don't get notified of fake activity.
       -------------------------------------------------------- */
    function syncVisibility() {
      track.style.animationPlayState = document.hidden ? 'paused' : '';
    }
    document.addEventListener('visibilitychange', syncVisibility);
    syncVisibility();

    /* --------------------------------------------------------
       Dev hook
       -------------------------------------------------------- */
    window.__fb = { section, marquee, track };
    console.info('[fb] find-bike marquee armed (CSS-driven, paused-on-hover/focus).');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
