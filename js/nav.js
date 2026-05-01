/* ============================================================
   Suzuki Bangladesh — Navbar behavior (Phase 2)
   ============================================================
   Responsibilities:
     1. Scroll-driven background (transparent → dark blur after 100px)
     2. Bikes mega menu open/close (hover, focus, click-outside, Esc)
     3. Mega menu category filters (filter pill toggling)
     4. Mobile overlay menu (open/close, body scroll lock, focus trap)
     5. Keyboard a11y across all of the above
   ============================================================ */

(function navInit() {
  'use strict';

  const nav = document.querySelector('.nav');
  if (!nav) return;

  // ---------- 1. Scroll-driven background ----------
  const SCROLL_THRESHOLD = 100;
  let scrolled = false;
  const onScroll = () => {
    const isPastThreshold = (window.scrollY || window.pageYOffset) > SCROLL_THRESHOLD;
    if (isPastThreshold !== scrolled) {
      nav.classList.toggle('is-scrolled', isPastThreshold);
      scrolled = isPastThreshold;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- 2. Mega menu ----------
  const megaTrigger = nav.querySelector('[data-nav-trigger="mega"]');
  const mega = nav.querySelector('.nav__mega');
  let megaOpen = false;
  let megaHoverTimer = null;

  const openMega = () => {
    if (megaOpen) return;
    nav.classList.add('has-mega-open');
    megaTrigger?.setAttribute('aria-expanded', 'true');
    megaOpen = true;
  };
  const closeMega = () => {
    if (!megaOpen) return;
    nav.classList.remove('has-mega-open');
    megaTrigger?.setAttribute('aria-expanded', 'false');
    megaOpen = false;
  };
  const toggleMega = () => (megaOpen ? closeMega() : openMega());

  if (megaTrigger && mega) {
    /* Bikes is now an <a href="bikes.html"> — clicks navigate to the
       lineup page. The mega menu still opens on hover (mouse) or focus
       (keyboard tab) so users can preview without leaving the page. */

    // Hover open with small delay (avoids flicker on quick mouseovers)
    const HOVER_OPEN_DELAY = 60;
    const HOVER_CLOSE_DELAY = 180;
    const onEnter = () => {
      clearTimeout(megaHoverTimer);
      megaHoverTimer = setTimeout(openMega, HOVER_OPEN_DELAY);
    };
    const onLeave = () => {
      clearTimeout(megaHoverTimer);
      megaHoverTimer = setTimeout(closeMega, HOVER_CLOSE_DELAY);
    };
    megaTrigger.addEventListener('mouseenter', onEnter);
    megaTrigger.addEventListener('mouseleave', onLeave);
    mega.addEventListener('mouseenter', onEnter);
    mega.addEventListener('mouseleave', onLeave);

    // Keyboard a11y — focusing the trigger opens the mega so Tab users
    // can browse the lineup without losing the click-to-navigate behaviour.
    megaTrigger.addEventListener('focus', openMega);

    // Click outside closes
    document.addEventListener('click', (e) => {
      if (!megaOpen) return;
      if (!nav.contains(e.target)) closeMega();
    });

    // Escape closes (and returns focus to the trigger)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && megaOpen) {
        closeMega();
        megaTrigger.focus();
      }
    });

    // Tabbing out of the mega menu closes it
    mega.addEventListener('focusout', (e) => {
      // relatedTarget is null when focus leaves the page entirely or moves outside the mega
      if (!mega.contains(e.relatedTarget) && !megaTrigger.contains(e.relatedTarget)) {
        closeMega();
      }
    });
  }

  // ---------- 3. Mega menu filters ----------
  const filterButtons = nav.querySelectorAll('.nav__mega-filter');
  const bikeCards = nav.querySelectorAll('.nav__mega-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update aria-pressed on buttons
      filterButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));

      // Show/hide cards
      bikeCards.forEach((card) => {
        const cat = card.dataset.category;
        const visible = filter === 'all' || cat === filter;
        card.classList.toggle('is-hidden', !visible);
      });
    });
  });

  // ---------- 4. Mobile overlay ----------
  const mobileToggle = nav.querySelector('[data-nav-trigger="mobile"]');
  const mobileClose = nav.querySelector('[data-nav-trigger="mobile-close"]');
  const mobileOverlay = nav.querySelector('.nav__mobile-overlay');
  let mobileOpen = false;
  let lastFocusedBeforeMobile = null;

  // Tabbable selectors inside the overlay (for focus trap)
  const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const openMobile = () => {
    if (mobileOpen) return;
    lastFocusedBeforeMobile = document.activeElement;
    mobileOverlay.removeAttribute('hidden');
    nav.classList.add('has-mobile-open');
    mobileToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (window.__lenis) window.__lenis.stop();
    // Focus the close button (first interactive in the overlay)
    requestAnimationFrame(() => mobileClose?.focus());
    mobileOpen = true;
  };

  const closeMobile = () => {
    if (!mobileOpen) return;
    nav.classList.remove('has-mobile-open');
    mobileToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (window.__lenis) window.__lenis.start();
    // Wait for transition to finish, then hide and restore focus
    setTimeout(() => {
      mobileOverlay.setAttribute('hidden', '');
      lastFocusedBeforeMobile?.focus?.();
    }, 400);
    mobileOpen = false;
  };

  if (mobileToggle && mobileOverlay) {
    mobileToggle.addEventListener('click', openMobile);
    mobileClose?.addEventListener('click', closeMobile);

    // Escape + focus trap
    mobileOverlay.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMobile();
        return;
      }
      if (e.key === 'Tab') {
        const focusable = mobileOverlay.querySelectorAll(FOCUSABLE);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // Tapping a mobile link should also close the overlay
    mobileOverlay.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', () => {
        // Slight delay so smooth-scroll target is hit before overlay hides
        setTimeout(closeMobile, 50);
      });
    });
  }

  // ---------- 5. Resize: close mobile if we leave mobile breakpoint ----------
  const mql = window.matchMedia('(min-width: 1025px)');
  const onBreakpointChange = (e) => {
    if (e.matches && mobileOpen) closeMobile();
    if (!e.matches && megaOpen) closeMega();
  };
  if (mql.addEventListener) mql.addEventListener('change', onBreakpointChange);
  else mql.addListener(onBreakpointChange);
})();
