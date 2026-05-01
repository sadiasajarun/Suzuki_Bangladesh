/* ============================================================
   offers.html — page logic
   ============================================================
   - Filter offers by category (All / Commuter / Sports / Scooter)
   - Sort by Biggest Saving / Lowest Price / Highest Price
   - Save offers to a wishlist (localStorage), heart icon toggles
   - Subscribe-for-alerts email form (saves to suzuki-bd-leads)
   ============================================================ */

(() => {
  const WISHLIST_KEY = 'suzuki-bd-wishlist';
  const LEADS_KEY    = 'suzuki-bd-leads';

  const state = {
    filter: 'all',     // 'all' | 'commuter' | 'sports' | 'scooter'
    sort:   'savings', // 'savings' | 'price-asc' | 'price-desc'
  };

  const grid       = document.querySelector('[data-offer-grid]');
  const cards      = grid ? Array.from(grid.querySelectorAll('[data-offer-card]')) : [];
  const filterEls  = document.querySelectorAll('[data-of-filter]');
  const sortEl     = document.querySelector('[data-of-sort]');
  const countEl    = document.querySelector('[data-offer-count]');
  const emptyEl    = document.querySelector('[data-of-empty]');

  /* ============================================================
     1. WISHLIST — save offers
     ============================================================ */
  function loadWishlist() {
    try { return new Set(JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]')); }
    catch (err) { return new Set(); }
  }
  function saveWishlist(set) {
    try { localStorage.setItem(WISHLIST_KEY, JSON.stringify([...set])); }
    catch (err) { /* ignore */ }
  }
  let wishlist = loadWishlist();

  function syncWishlistButtons() {
    document.querySelectorAll('[data-of-save]').forEach((btn) => {
      const id = btn.closest('[data-offer-card]')?.dataset.offerCard;
      if (!id) return;
      const saved = wishlist.has(id);
      btn.dataset.saved = String(saved);
      btn.setAttribute('aria-pressed', String(saved));
      btn.setAttribute('aria-label', saved ? 'Remove from wishlist' : 'Save for later');
    });
  }

  /* ============================================================
     2. FILTER + SORT + RENDER
     ============================================================ */
  function applyState() {
    // Filter
    const visible = cards.filter((card) => {
      const cat = (card.dataset.category || '').toLowerCase();
      if (state.filter === 'all') return true;
      return cat === state.filter;
    });

    // Sort within visible
    visible.sort((a, b) => {
      const sa = Number(a.dataset.save || 0);
      const sb = Number(b.dataset.save || 0);
      const pa = Number(a.dataset.price || 0);
      const pb = Number(b.dataset.price || 0);
      if (state.sort === 'savings')   return sb - sa;
      if (state.sort === 'price-asc') return pa - pb;
      if (state.sort === 'price-desc')return pb - pa;
      return 0;
    });

    // Re-attach to grid in sorted order; hide non-matching
    cards.forEach((c) => c.classList.add('is-hidden'));
    visible.forEach((c) => {
      c.classList.remove('is-hidden');
      grid.appendChild(c);
    });

    // Empty state
    if (emptyEl) emptyEl.hidden = visible.length > 0;

    // Count
    if (countEl) {
      countEl.innerHTML = visible.length === cards.length
        ? `<strong>${cards.length}</strong> active offers`
        : `<strong>${visible.length}</strong> of ${cards.length} offers`;
    }

    // Filter pill aria-pressed
    filterEls.forEach((el) => {
      el.setAttribute('aria-pressed', String(el.dataset.ofFilter === state.filter));
    });

    syncWishlistButtons();
  }

  /* ============================================================
     3. WIRE
     ============================================================ */
  filterEls.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.filter = btn.dataset.ofFilter;
      applyState();
    });
  });
  sortEl?.addEventListener('change', () => {
    state.sort = sortEl.value;
    applyState();
  });

  // Wishlist toggles
  grid?.addEventListener('click', (e) => {
    const saveBtn = e.target.closest('[data-of-save]');
    if (saveBtn) {
      const id = saveBtn.closest('[data-offer-card]')?.dataset.offerCard;
      if (!id) return;
      if (wishlist.has(id)) wishlist.delete(id);
      else wishlist.add(id);
      saveWishlist(wishlist);
      syncWishlistButtons();
    }
    // Reset filters from empty state
    const reset = e.target.closest('[data-of-reset]');
    if (reset) {
      state.filter = 'all';
      applyState();
    }
  });
  document.querySelector('[data-of-empty]')?.addEventListener('click', (e) => {
    if (e.target.closest('[data-of-reset]')) {
      state.filter = 'all';
      applyState();
    }
  });

  /* ============================================================
     4. ALERTS EMAIL FORM
     ============================================================ */
  const alertForm = document.querySelector('[data-of-alerts-form]');
  const alertStatus = document.querySelector('[data-of-alerts-status]');
  alertForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(alertForm);
    const email = (fd.get('email') || '').toString().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (alertStatus) {
        alertStatus.textContent = 'Enter a valid email.';
        alertStatus.dataset.state = 'error';
      }
      return;
    }
    try {
      const raw = localStorage.getItem(LEADS_KEY);
      const list = raw ? JSON.parse(raw) : [];
      if (!list.some((l) => l.email === email)) {
        list.push({ email, at: new Date().toISOString(), source: 'offers-alerts', page: location.pathname });
        localStorage.setItem(LEADS_KEY, JSON.stringify(list));
      }
    } catch (err) { /* ignore */ }
    if (alertStatus) {
      alertStatus.textContent = "You're on the list. We'll email when offers drop.";
      alertStatus.dataset.state = 'success';
    }
    alertForm.reset();
  });

  /* ============================================================
     5. INIT
     ============================================================ */
  applyState();
})();
