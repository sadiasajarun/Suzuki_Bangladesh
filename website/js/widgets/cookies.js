/* ============================================================
   cookies.js — site-wide cookie consent + lead capture
   ============================================================
   - Slides up from bottom-left on first visit
   - 3 cookie categories: Essential (locked on), Analytics, Marketing
   - Optional email field — opting in adds the visitor as a lead
   - Stores decision in localStorage so the popup doesn't reappear
   - Stores leads in localStorage as a mock array (no backend yet)
   - "Cookie settings" link can re-open it from anywhere by setting
     localStorage.removeItem('suzuki-bd-consent') in the console
   - Self-injects markup so integration is one <script> tag per page
   ============================================================ */

(() => {
  const CONSENT_KEY = 'suzuki-bd-consent';
  const LEADS_KEY   = 'suzuki-bd-leads';

  /* ============================================================
     1. INJECT MARKUP
     ============================================================ */
  function inject() {
    if (document.querySelector('[data-ck-popup]')) return;
    const root = document.createElement('div');
    root.setAttribute('data-ck-root', '');
    root.innerHTML = `
      <aside class="ck-popup" data-ck-popup role="dialog" aria-labelledby="ck-title" aria-describedby="ck-body">
        <header class="ck-header">
          <span class="ck-icon" aria-hidden="true">🍪</span>
          <h2 class="ck-title" id="ck-title">We use <em>cookies</em>.</h2>
        </header>

        <p class="ck-body" id="ck-body">
          Essential cookies keep this site running. Optional ones help us improve it and (if you're interested) send you launch news + offers. You're in control.
          <a href="legal/cookies.html">Learn more</a>
        </p>

        <div class="ck-cats" role="group" aria-label="Cookie preferences">
          <div class="ck-cat">
            <div class="ck-cat-label">
              <span class="ck-cat-name">Essential</span>
              <span class="ck-cat-desc">Always on · keeps the site working</span>
            </div>
            <label class="ck-switch">
              <input type="checkbox" checked disabled />
              <span class="ck-switch-track"></span>
            </label>
          </div>
          <div class="ck-cat">
            <div class="ck-cat-label">
              <span class="ck-cat-name">Analytics</span>
              <span class="ck-cat-desc">Anonymous · helps us improve</span>
            </div>
            <label class="ck-switch">
              <input type="checkbox" data-ck-cat="analytics" />
              <span class="ck-switch-track"></span>
            </label>
          </div>
          <div class="ck-cat">
            <div class="ck-cat-label">
              <span class="ck-cat-name">Marketing</span>
              <span class="ck-cat-desc">Personalised ads · campaigns</span>
            </div>
            <label class="ck-switch">
              <input type="checkbox" data-ck-cat="marketing" />
              <span class="ck-switch-track"></span>
            </label>
          </div>
        </div>

        <div class="ck-lead">
          <p class="ck-lead-label">Want launch updates &amp; exclusive offers?</p>
          <div class="ck-lead-row">
            <input
              type="email"
              class="ck-lead-input"
              data-ck-email
              placeholder="your@email.com (optional)"
              autocomplete="email"
              aria-label="Your email for launch updates"
            />
          </div>
        </div>

        <div class="ck-actions ck-actions--3">
          <button type="button" class="ck-btn ck-btn--ghost"  data-ck-action="reject">Reject</button>
          <button type="button" class="ck-btn ck-btn--save"   data-ck-action="save">Save</button>
          <button type="button" class="ck-btn ck-btn--accept" data-ck-action="accept">Accept All</button>
        </div>
      </aside>

      <div class="ck-toast" data-ck-toast role="status" aria-live="polite"></div>
    `;
    document.body.appendChild(root);
  }

  /* ============================================================
     2. STATE
     ============================================================ */
  function hasConsent() {
    try { return !!localStorage.getItem(CONSENT_KEY); }
    catch (err) { return false; }
  }
  function saveConsent(consent) {
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ ...consent, at: new Date().toISOString() })); }
    catch (err) { /* ignore */ }
  }
  function saveLead(email) {
    if (!email) return false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
    try {
      const raw = localStorage.getItem(LEADS_KEY);
      const list = raw ? JSON.parse(raw) : [];
      // Dedupe
      if (list.some((l) => l.email === email)) return false;
      list.push({ email, at: new Date().toISOString(), source: 'cookies-popup', page: location.pathname });
      localStorage.setItem(LEADS_KEY, JSON.stringify(list));
      return true;
    } catch (err) { return false; }
  }

  /* ============================================================
     3. SHOW / HIDE / TOAST
     ============================================================ */
  let popup, toast;
  function show() {
    if (!popup) return;
    // Defer to next frame so the CSS transition kicks in
    requestAnimationFrame(() => popup.classList.add('is-open'));
  }
  function hide() {
    if (!popup) return;
    popup.classList.remove('is-open');
  }
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    setTimeout(() => toast.classList.remove('is-visible'), 3200);
  }

  /* ============================================================
     4. ACTIONS
     ============================================================ */
  function getEmail() {
    const input = popup?.querySelector('[data-ck-email]');
    return input ? input.value.trim() : '';
  }
  function getConsentFromUI() {
    return {
      essential: true,
      analytics: !!popup?.querySelector('[data-ck-cat="analytics"]')?.checked,
      marketing: !!popup?.querySelector('[data-ck-cat="marketing"]')?.checked,
    };
  }

  function onAcceptAll() {
    saveConsent({ essential: true, analytics: true, marketing: true });
    const leadOK = saveLead(getEmail());
    hide();
    showToast(leadOK ? "Thanks — you're on the list." : 'Cookie preferences saved.');
  }
  function onSave() {
    saveConsent(getConsentFromUI());
    const leadOK = saveLead(getEmail());
    hide();
    showToast(leadOK ? "Thanks — you're on the list." : 'Cookie preferences saved.');
  }
  function onReject() {
    saveConsent({ essential: true, analytics: false, marketing: false });
    hide();
    showToast('Only essential cookies kept.');
  }

  function wire() {
    popup = document.querySelector('[data-ck-popup]');
    toast = document.querySelector('[data-ck-toast]');
    popup?.querySelector('[data-ck-action="accept"]')?.addEventListener('click', onAcceptAll);
    popup?.querySelector('[data-ck-action="save"]')?.addEventListener('click', onSave);
    popup?.querySelector('[data-ck-action="reject"]')?.addEventListener('click', onReject);

    // If marketing is toggled on, gently nudge the user toward the email field
    popup?.querySelector('[data-ck-cat="marketing"]')?.addEventListener('change', (e) => {
      if (e.target.checked) popup.querySelector('[data-ck-email]')?.focus();
    });
  }

  /* ============================================================
     5. INIT
     ============================================================ */
  function init() {
    if (hasConsent()) return;          // already decided — don't show again
    inject();
    wire();
    // Slight delay so the popup doesn't flash with the page paint
    setTimeout(show, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
