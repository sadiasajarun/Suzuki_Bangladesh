/* ============================================================
   SECTION 2 — Why Suzuki Is Different · v3
   ============================================================
   Split into two physically separate sections in the markup:
     · #section-2-why-suzuki  — eyebrow + wordmark + white card
     · #section-2b-suzuki-flow — the racing-line flow (its own scroll-trigger)
   This file wires both:
     1. WORDMARK section: one-time letter + card GSAP intros, plus
        the photo-letter fallback so missing bg images render solid.
     2. FLOW section: replayable IntersectionObserver toggling
        `.is-flowing` on the .ws-flow root — path draws on enter,
        resets on full exit so the next scroll re-animates it.
   ============================================================ */

(function whySuzukiInit() {
  'use strict';

  function ready() {
    const wordmarkSection = document.getElementById('section-2-why-suzuki');
    const flowSection     = document.getElementById('section-2b-suzuki-flow');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ============================================================
       WORDMARK SECTION — letter intros + photo fallback
       ============================================================ */
    if (wordmarkSection) {
      // Photo fallback: if a letter's bg image 404s, strip it so the
      // CSS solid-white fallback applies (otherwise the letter goes
      // transparent because of background-clip: text).
      wordmarkSection.querySelectorAll('.ws-letter[style*="background-image"]').forEach((el) => {
        const m = el.style.backgroundImage.match(/url\((['"]?)(.*?)\1\)/);
        if (!m) return;
        const probe = new Image();
        probe.onerror = () => {
          el.style.backgroundImage = '';
          el.dataset.photoMissing = 'true';
        };
        probe.src = m[2];
      });

      if (reduced) {
        wordmarkSection.classList.add('is-revealed');
      } else {
        let hasIntroPlayed = false;
        const introIO = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.intersectionRatio >= 0.25 && !hasIntroPlayed) {
              hasIntroPlayed = true;
              wordmarkSection.classList.add('is-revealed');
              if (typeof gsap !== 'undefined') {
                const letters = wordmarkSection.querySelectorAll('.ws-letter');
                gsap.from(letters, {
                  opacity: 0,
                  y: 24,
                  duration: 0.8,
                  stagger: 0.06,
                  ease: 'power3.out',
                });
                const card = wordmarkSection.querySelector('.ws-card');
                if (card) {
                  gsap.from(card, {
                    opacity: 0,
                    y: 32,
                    duration: 0.8,
                    delay: 0.4,
                    ease: 'power3.out',
                  });
                }
              }
              introIO.disconnect();
            }
          });
        }, { threshold: [0, 0.25] });
        introIO.observe(wordmarkSection);
      }
    }

    /* ============================================================
       FLOW SECTION — replayable racing-line animation
       ============================================================ */
    if (!flowSection) return;

    const flow = flowSection.querySelector('[data-ws-flow]');
    const flowPath = flowSection.querySelector('[data-ws-flow-path]');
    if (!flow) return;

    // Measure the SVG path so the stroke-dasharray matches its true length.
    if (flowPath) {
      try {
        const ref = flowSection.querySelector('#ws-flow-path');
        if (ref && typeof ref.getTotalLength === 'function') {
          const len = Math.ceil(ref.getTotalLength());
          flow.style.setProperty('--ws-path-length', len);
        }
      } catch (err) {
        /* CSS fallback `--ws-path-length: 1600` covers this */
      }
    }

    if (reduced) {
      flow.classList.add('is-flowing');
      return;
    }

    /* Replayable observer:
         - ENTER (ratio ≥ 0.2) → add `.is-flowing`, path draws + cards stagger
         - EXIT  (ratio === 0) → remove `.is-flowing`, ready for next entry
       Threshold tuned to fire when the section is well into the
       viewport so the animation lands where the user can see it. */
    let active = false;
    const flowIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio >= 0.2 && !active) {
          active = true;
          flow.classList.add('is-flowing');
        } else if (entry.intersectionRatio === 0 && active) {
          active = false;
          flow.classList.remove('is-flowing');
        }
      });
    }, { threshold: [0, 0.2] });
    flowIO.observe(flowSection);

    console.info('[ws] Section 2 (v3) wired — wordmark + standalone flow observers active.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
