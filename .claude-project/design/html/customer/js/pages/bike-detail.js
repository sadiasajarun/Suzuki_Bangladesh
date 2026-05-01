/* ============================================================
   bikes/<slug>.html — detail page logic
   ============================================================
   Three things to wire:
     1. Hero color picker — clicking a swatch swaps the hero
        photo (with a subtle fade) + updates the active label.
     2. Spec accordion — `<details>` elements are native, but we
        coordinate so opening any group keeps a smooth feel.
     3. Lazy fade-in on feature cards as they enter the viewport.
   ============================================================ */

(() => {
  /* ============================================================
     1. COLOR PICKER
     ============================================================ */
  function wireColorPicker() {
    const swatches = document.querySelectorAll('[data-bd-swatch]');
    const photo = document.querySelector('[data-bd-hero-photo]');
    const colorName = document.querySelector('[data-bd-color-name]');
    if (!swatches.length || !photo) return;

    swatches.forEach((sw) => {
      sw.addEventListener('click', () => {
        const newSrc = sw.dataset.image;
        const newName = sw.dataset.name;
        if (!newSrc) return;

        // Update aria + active state
        swatches.forEach((s) => {
          const active = s === sw;
          s.classList.toggle('is-active', active);
          s.setAttribute('aria-pressed', String(active));
        });

        // Smooth swap: fade out → swap src → fade in
        photo.classList.add('is-swapping');
        const next = new Image();
        next.onload = () => {
          photo.src = newSrc;
          photo.alt = `Suzuki bike in ${newName}`;
          // Allow next paint frame before fading back in
          requestAnimationFrame(() => {
            photo.classList.remove('is-swapping');
          });
        };
        next.onerror = () => {
          photo.classList.remove('is-swapping');
        };
        next.src = newSrc;

        // Update the displayed colour name
        if (colorName && newName) colorName.textContent = newName;
      });
    });
  }

  /* ============================================================
     2. FEATURE CARD REVEAL (IntersectionObserver)
     ============================================================ */
  function wireFeatureReveal() {
    const features = document.querySelectorAll('.bd-feature');
    if (!features.length || !('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    features.forEach((f, i) => {
      f.style.transitionDelay = `${(i % 4) * 60}ms`;
      io.observe(f);
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    wireColorPicker();
    wireFeatureReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
