/* ============================================================
   chat.js — site-wide mock Messenger chatbot
   ============================================================
   - Floating bubble bottom-right (red, with pulse halo)
   - Click → slides up a chat panel with a Suzuki greeting
   - Quick-reply chips: each simulates a brief bot conversation
     (typing dots → response with deep-link CTA)
   - Footer: "Continue on Messenger" → m.me/SuzukiBangladeshOfficial
     and "Call 16638" — these are real
   - Conversation state persists across pages via sessionStorage
     so navigating doesn't reset the thread
   - Self-injects markup so the only integration is one <script>
     tag per page
   ============================================================ */

(() => {
  /* Detect path depth so deep links from /bikes/<slug>.html resolve */
  const isNested = window.location.pathname.includes('/bikes/');
  const prefix = isNested ? '../' : '';

  /* ============================================================
     1. CHAT FLOWS — keyed by chip id
     ============================================================ */
  const FLOWS = {
    'test-ride': {
      user: "I'd like to book a test ride.",
      bot: "Awesome — most riders book one in under 2 minutes. Pick your bike, dealer, and time on the test-ride page and we'll call you within 24 hours to confirm.",
      action: { label: 'Book Test Ride', href: prefix + 'test-ride.html' },
    },
    'dealers': {
      user: "Where is my nearest dealer?",
      bot: "We have 500+ authorised dealers across all 8 divisions. Open the dealer locator and tap 'Find dealers near me' to sort by distance.",
      action: { label: 'Open Locator', href: prefix + 'dealers.html' },
    },
    'parts': {
      user: "I need genuine parts.",
      bot: "Got you — air filter, oil filter, brake pads, Ecstar oils, helmets, and more direct from RMBL. Free delivery over BDT 5,000.",
      action: { label: 'Open Shop', href: prefix + 'shop.html' },
    },
    'pricing': {
      user: "What does a Suzuki cost?",
      bot: "From BDT 1,18,000 (Hayate EP) to BDT 5,24,950 (GSX-R150). Filter the lineup by category, engine, and use-case to find the right one for you.",
      action: { label: 'See All Bikes', href: prefix + 'bikes.html' },
    },
    'human': {
      user: "Can I talk to a human?",
      bot: "Of course. Tap below to open Messenger or call our 24/7 hotline at 16638 — we're rarely more than 5 minutes away.",
      action: null,
    },
  };

  const GREETING = "Hi! 👋 I'm Suzuki BD's assistant. How can I help you today?";

  const STORAGE_KEY = 'suzuki-bd-chat';
  const SUPPRESS_KEY = 'suzuki-bd-chat-suppressed';

  /* ============================================================
     2. STATE — persisted thread across navigations within the
     same browsing session
     ============================================================ */
  let isOpen = false;
  let messages = [];          // [{ role: 'bot' | 'user', html: '…', action?: {…} }]
  function loadThread() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      messages = raw ? JSON.parse(raw) : [];
    } catch (err) { messages = []; }
  }
  function saveThread() {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); }
    catch (err) { /* ignore quota */ }
  }

  /* ============================================================
     3. INJECT MARKUP
     ============================================================ */
  function inject() {
    if (document.querySelector('[data-cw-bubble]')) return;
    const root = document.createElement('div');
    root.setAttribute('data-cw-root', '');
    root.innerHTML = `
      <button type="button" class="cw-bubble" data-cw-bubble aria-label="Open chat with Suzuki Bangladesh" aria-haspopup="dialog" aria-expanded="false">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span class="cw-bubble-badge" data-cw-badge></span>
      </button>

      <div class="cw-panel" data-cw-panel role="dialog" aria-label="Chat with Suzuki Bangladesh">
        <header class="cw-header">
          <div class="cw-avatar" aria-hidden="true">S</div>
          <div class="cw-header-text">
            <p class="cw-header-name">Suzuki Bangladesh</p>
            <span class="cw-header-status">Typically replies in 5 min</span>
          </div>
          <button type="button" class="cw-close-btn" data-cw-close aria-label="Close chat">×</button>
        </header>

        <div class="cw-thread" data-cw-thread aria-live="polite"></div>

        <div class="cw-chips" data-cw-chips role="group" aria-label="Quick replies">
          <button type="button" class="cw-chip" data-cw-chip="test-ride">Book a test ride</button>
          <button type="button" class="cw-chip" data-cw-chip="dealers">Find a dealer</button>
          <button type="button" class="cw-chip" data-cw-chip="parts">Genuine parts</button>
          <button type="button" class="cw-chip" data-cw-chip="pricing">Pricing</button>
          <button type="button" class="cw-chip" data-cw-chip="human">Talk to a human</button>
        </div>

        <footer class="cw-footer">
          <a href="https://m.me/SuzukiBangladeshOfficial" target="_blank" rel="noopener" class="cw-footer-btn">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2C6.5 2 2 6.1 2 11.1c0 2.7 1.3 5 3.4 6.6V22l3.1-1.7c.8.2 1.6.3 2.5.3 5.5 0 10-4.1 10-9.1S17.5 2 12 2z"/>
              <path d="M5 13.5l3-3 2.5 2 2.5-2 3 3"/>
            </svg>
            On Messenger
          </a>
          <a href="tel:16638" class="cw-footer-btn">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            Call 16638
          </a>
        </footer>
      </div>
    `;
    document.body.appendChild(root);
  }

  /* ============================================================
     4. RENDER
     ============================================================ */
  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function render() {
    const thread = document.querySelector('[data-cw-thread]');
    if (!thread) return;
    thread.innerHTML = messages.map((m) => {
      const cls = m.role === 'bot' ? 'cw-msg--bot' : 'cw-msg--user';
      const action = m.action
        ? `<a class="cw-action" href="${escapeHtml(m.action.href)}">${escapeHtml(m.action.label)}</a>`
        : '';
      return `<div class="cw-msg ${cls}">${escapeHtml(m.text)}${action ? '<br />' + action : ''}</div>`;
    }).join('');
    thread.scrollTop = thread.scrollHeight;
  }

  function pushMsg(role, text, action) {
    messages.push({ role, text, action });
    saveThread();
    render();
  }

  function showTyping() {
    const thread = document.querySelector('[data-cw-thread]');
    if (!thread) return null;
    const el = document.createElement('div');
    el.className = 'cw-typing';
    el.innerHTML = '<span></span><span></span><span></span>';
    thread.appendChild(el);
    thread.scrollTop = thread.scrollHeight;
    return el;
  }

  /* ============================================================
     5. WIRE
     ============================================================ */
  function open() {
    isOpen = true;
    document.querySelector('[data-cw-bubble]')?.classList.add('is-open');
    document.querySelector('[data-cw-bubble]')?.setAttribute('aria-expanded', 'true');
    document.querySelector('[data-cw-panel]')?.classList.add('is-open');
    // Clear unread badge
    const badge = document.querySelector('[data-cw-badge]');
    if (badge) badge.textContent = '';
    // First open of the session — seed the greeting
    if (messages.length === 0) {
      setTimeout(() => pushMsg('bot', GREETING), 250);
    }
  }
  function close() {
    isOpen = false;
    document.querySelector('[data-cw-bubble]')?.classList.remove('is-open');
    document.querySelector('[data-cw-bubble]')?.setAttribute('aria-expanded', 'false');
    document.querySelector('[data-cw-panel]')?.classList.remove('is-open');
  }

  function handleChip(id) {
    const flow = FLOWS[id];
    if (!flow) return;
    pushMsg('user', flow.user);
    const typing = showTyping();
    setTimeout(() => {
      typing?.remove();
      pushMsg('bot', flow.bot, flow.action || undefined);
    }, 700);
  }

  function wire() {
    document.querySelector('[data-cw-bubble]')?.addEventListener('click', () => isOpen ? close() : open());
    document.querySelector('[data-cw-close]')?.addEventListener('click', close);
    document.querySelectorAll('[data-cw-chip]').forEach((chip) => {
      chip.addEventListener('click', () => handleChip(chip.dataset.cwChip));
    });
    // Esc closes
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) close();
    });
  }

  /* ============================================================
     6. INIT
     ============================================================ */
  function init() {
    loadThread();
    inject();
    wire();
    render();

    // If thread is empty, show an unread badge on the bubble after 4 s
    // to nudge first-time visitors. Skip if user already engaged.
    if (messages.length === 0 && !sessionStorage.getItem(SUPPRESS_KEY)) {
      setTimeout(() => {
        if (isOpen) return;
        const badge = document.querySelector('[data-cw-badge]');
        if (badge) badge.textContent = '1';
      }, 4000);
    }

    // First user interaction with the page suppresses the auto-pulse
    // (it's annoying once you've seen it).
    const suppressPulse = () => {
      const bubble = document.querySelector('[data-cw-bubble]');
      bubble?.classList.add('is-suppressed');
      sessionStorage.setItem(SUPPRESS_KEY, '1');
      window.removeEventListener('scroll', suppressPulse);
      window.removeEventListener('click', suppressPulse);
    };
    if (sessionStorage.getItem(SUPPRESS_KEY)) {
      document.querySelector('[data-cw-bubble]')?.classList.add('is-suppressed');
    } else {
      window.addEventListener('scroll', suppressPulse, { once: true, passive: true });
      window.addEventListener('click', suppressPulse, { once: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
