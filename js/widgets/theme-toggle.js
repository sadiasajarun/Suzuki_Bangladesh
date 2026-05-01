/* ============================================================
   Theme toggle widget — dark / light mode
   ============================================================
   - Auto-injects a sun/moon button into .nav__actions on every page.
   - Reads the preferred mode from localStorage; falls back to the
     OS preference (prefers-color-scheme).
   - The actual theme is applied as early as possible by an inline
     script in <head> (see each page) so there is no FOUC flash.
     This file just wires the toggle button itself.
   ============================================================ */

(function themeToggleInit() {
  'use strict';

  const STORAGE_KEY = 'suzuki-theme';
  const ICON_MOON = '<svg viewBox="0 0 24 24" class="icon-moon" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  const ICON_SUN  = '<svg viewBox="0 0 24 24" class="icon-sun"  aria-hidden="true"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.93" y1="4.93" x2="7.05" y2="7.05"/><line x1="16.95" y1="16.95" x2="19.07" y2="19.07"/><line x1="4.93" y1="19.07" x2="7.05" y2="16.95"/><line x1="16.95" y1="7.05" x2="19.07" y2="4.93"/></svg>';

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  }

  function applyTheme(mode) {
    if (mode === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    try { localStorage.setItem(STORAGE_KEY, mode); } catch (_) { /* private mode */ }
  }

  function ready() {
    if (document.querySelector('.theme-toggle')) return;

    const slot = document.querySelector('.nav__actions');
    if (!slot) return;     // some pages may not have a navbar — skip silently

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label', 'Toggle dark / light theme');
    btn.setAttribute('data-testid', 'theme-toggle');
    btn.innerHTML = ICON_MOON + ICON_SUN;

    // Insert before the hotline link so the visual order is:
    //   [theme] [hotline] [book CTA] [mobile-menu]
    const hotline = slot.querySelector('.nav__hotline');
    if (hotline) {
      slot.insertBefore(btn, hotline);
    } else {
      slot.prepend(btn);
    }

    btn.addEventListener('click', () => {
      const next = currentTheme() === 'light' ? 'dark' : 'light';
      applyTheme(next);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
