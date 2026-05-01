/* ============================================================
   technology.html — page logic
   ============================================================
   Three responsibilities:

   1. Scroll-spy — highlight the active item in the sticky left
      rail as the user scrolls. Active item gets .is-active +
      red left border + 1.05x scale (handled in CSS).

   2. Reveal-on-view — when a .tk-tech section enters the
      viewport, add .is-revealed so the staggered eyebrow →
      headline → visual → body → specs animation runs (CSS).

   3. Scroll-progress flow — for the SOCS hero technology, drive
      a CSS custom property `--socs-flow` (0.5–2.0) on the SVG
      element so the oil-particle animation speed matches how
      far the user has scrolled into that section.

   All three are pure IntersectionObserver / scroll listeners —
   no GSAP needed for this layer (GSAP is loaded but reserved
   for future phases).
   ============================================================ */

(() => {
  const sections = document.querySelectorAll('[data-tk-tech]');
  const navLinks = document.querySelectorAll('[data-tk-index-link]');
  const mobileSelect = document.querySelector('[data-tk-mobile-select]');
  const socsSvg = document.querySelector('[data-socs-svg]');

  if (!sections.length) return;

  /* ============================================================
     1. REVEAL-ON-VIEW
     ============================================================ */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        revealIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
  sections.forEach((s) => revealIO.observe(s));

  /* ============================================================
     2. SCROLL-SPY — sets the active rail item based on which
     section currently dominates the viewport.
     ============================================================ */
  function setActive(id) {
    navLinks.forEach((link) => {
      const active = link.dataset.tkIndexLink === id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    if (mobileSelect && mobileSelect.value !== id) {
      mobileSelect.value = id;
    }
  }

  // Track currently most-visible section.
  // Trigger zone: section's top has crossed ~30% of viewport from top.
  const spyIO = new IntersectionObserver((entries) => {
    // Pick the entry that's most visible right now
    const visible = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActive(visible.target.id);
  }, {
    rootMargin: '-30% 0px -55% 0px',
    threshold: [0, 0.25, 0.5, 0.75, 1],
  });
  sections.forEach((s) => spyIO.observe(s));

  /* ============================================================
     3. SIDEBAR LINKS — smooth scroll on click + ARIA
     ============================================================ */
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.dataset.tkIndexLink;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActive(id);
      }
    });
  });

  mobileSelect?.addEventListener('change', () => {
    const id = mobileSelect.value;
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ============================================================
     4. SOCS FLOW — drive --socs-flow by scroll progress through
     the SOCS section. Throttled via rAF.
     ============================================================ */
  if (socsSvg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const socsSection = document.getElementById('socs');
    if (socsSection) {
      let ticking = false;
      const updateFlow = () => {
        const rect = socsSection.getBoundingClientRect();
        const vh = window.innerHeight;
        // Progress: 0 when section just enters viewport bottom,
        // 1 when it fully passes top. Clamped.
        const progress = Math.max(0, Math.min(1,
          (vh - rect.top) / (vh + rect.height)
        ));
        // Map progress 0→1 to flow speed 0.7→2.0 (faster as user scrolls deeper)
        const flow = (0.7 + progress * 1.3).toFixed(2);
        socsSvg.style.setProperty('--socs-flow', flow);
        ticking = false;
      };
      const onScroll = () => {
        if (!ticking) {
          requestAnimationFrame(updateFlow);
          ticking = true;
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      updateFlow();
    }
  }
})();
