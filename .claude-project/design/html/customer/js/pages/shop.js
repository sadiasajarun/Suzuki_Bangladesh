/* ============================================================
   shop.html — page logic
   ============================================================
   Responsibilities:
     1. Read product metadata from the DOM (data-* on each card)
     2. Maintain a running cart in sessionStorage
     3. Add-to-cart button → push line + open the drawer
     4. Drawer: render lines with qty controls + remove + total
     5. Navbar cart badge stays in sync
     6. Smooth-scroll for the showcase cards
   ============================================================ */

(() => {
  const STORAGE_KEY = 'suzuki-bd-cart';
  const fmtBDT = (n) => 'BDT ' + n.toLocaleString('en-US');

  /* ============================================================
     1. State — { id: { id, name, sku, price, qty, category, icon } }
     ============================================================ */
  let cart = {};

  function loadCart() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      cart = raw ? JSON.parse(raw) : {};
    } catch (err) {
      cart = {};
    }
  }
  function saveCart() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (err) { /* ignore quota */ }
  }
  function totalItems() {
    return Object.values(cart).reduce((sum, l) => sum + l.qty, 0);
  }
  function totalPrice() {
    return Object.values(cart).reduce((sum, l) => sum + l.qty * l.price, 0);
  }

  /* ============================================================
     2. Add to cart
     ============================================================ */
  function addToCart(product) {
    const existing = cart[product.id];
    if (existing) {
      existing.qty += 1;
    } else {
      cart[product.id] = { ...product, qty: 1 };
    }
    saveCart();
    render();
    bumpBadge();
  }

  function changeQty(id, delta) {
    if (!cart[id]) return;
    cart[id].qty += delta;
    if (cart[id].qty <= 0) {
      delete cart[id];
    }
    saveCart();
    render();
  }

  function removeLine(id) {
    delete cart[id];
    saveCart();
    render();
  }

  /* ============================================================
     3. Drawer open / close
     ============================================================ */
  const drawer = document.querySelector('[data-cart-drawer]');
  const backdrop = document.querySelector('[data-cart-backdrop]');
  let lastFocusedBeforeDrawer = null;

  function openDrawer() {
    if (!drawer) return;
    lastFocusedBeforeDrawer = document.activeElement;
    drawer.classList.add('is-open');
    backdrop?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    // Focus first focusable inside the drawer
    drawer.querySelector('button, a')?.focus();
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    backdrop?.classList.remove('is-open');
    document.body.style.overflow = '';
    lastFocusedBeforeDrawer?.focus();
  }

  /* ============================================================
     4. Render — sync DOM with state
     ============================================================ */
  const drawerBody = document.querySelector('[data-cart-body]');
  const totalEl = document.querySelector('[data-cart-total]');
  const checkoutBtn = document.querySelector('[data-cart-checkout]');
  const badgeEl = document.querySelector('[data-cart-badge]');

  function render() {
    if (badgeEl) {
      const count = totalItems();
      badgeEl.textContent = count > 0 ? String(count) : '';
      badgeEl.dataset.count = String(count);
    }
    if (totalEl) totalEl.textContent = fmtBDT(totalPrice());
    if (checkoutBtn) checkoutBtn.disabled = totalItems() === 0;
    if (!drawerBody) return;

    const lines = Object.values(cart);
    if (lines.length === 0) {
      drawerBody.innerHTML = `
        <div class="sh-drawer-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" stroke="currentColor">
            <path d="M3 3h2l2 13h11l2-9H6"/>
            <circle cx="9" cy="20" r="1.5"/>
            <circle cx="17" cy="20" r="1.5"/>
          </svg>
          <p>Your cart is empty.<br />Pick a part to get started.</p>
        </div>`;
      return;
    }

    drawerBody.innerHTML = lines.map((l) => {
      const tint = l.tintA || 'rgba(228, 5, 33, 0.2)';
      const icon = l.icon || '<circle cx="12" cy="12" r="6" />';
      return `
        <div class="sh-line" data-line="${l.id}">
          <div class="sh-line-thumb" style="--card-tint-a:${tint}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${icon}</svg>
          </div>
          <div class="sh-line-info">
            <h4 class="sh-line-name">${escapeHtml(l.name)}</h4>
            <span class="sh-line-meta">
              SKU ${escapeHtml(l.sku)} · <strong>${fmtBDT(l.price * l.qty)}</strong>
            </span>
          </div>
          <div class="sh-line-controls">
            <div class="sh-qty">
              <button type="button" data-qty-down="${l.id}" aria-label="Decrease quantity">−</button>
              <span>${l.qty}</span>
              <button type="button" data-qty-up="${l.id}" aria-label="Increase quantity">+</button>
            </div>
            <button type="button" class="sh-line-remove" data-remove="${l.id}" aria-label="Remove ${escapeHtml(l.name)}">×</button>
          </div>
        </div>`;
    }).join('');
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }

  function bumpBadge() {
    if (!badgeEl) return;
    badgeEl.classList.remove('is-bumped');
    void badgeEl.offsetWidth;        // restart the animation
    badgeEl.classList.add('is-bumped');
  }

  /* ============================================================
     5. Wire events
     ============================================================ */
  function wire() {
    // Add-to-cart buttons on product cards
    document.querySelectorAll('[data-add-to-cart]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('[data-product]');
        if (!card) return;
        const product = {
          id: card.dataset.product,
          name: card.dataset.name,
          sku: card.dataset.sku,
          price: Number(card.dataset.price) || 0,
          category: card.dataset.category,
          icon: card.dataset.icon || '',
          tintA: card.dataset.tintA || '',
        };
        addToCart(product);
        // Visual feedback on the button
        btn.classList.add('is-just-added');
        const originalText = btn.dataset.originalText || btn.textContent;
        btn.dataset.originalText = originalText;
        btn.textContent = 'Added';
        setTimeout(() => {
          btn.classList.remove('is-just-added');
          btn.textContent = originalText;
        }, 1200);
        // Auto-open the drawer briefly on first add
        if (!drawer.classList.contains('is-open')) openDrawer();
      });
    });

    // Cart trigger in navbar
    document.querySelectorAll('[data-cart-trigger]').forEach((btn) => {
      btn.addEventListener('click', openDrawer);
    });

    // Drawer close + backdrop click
    document.querySelectorAll('[data-cart-close]').forEach((btn) => {
      btn.addEventListener('click', closeDrawer);
    });
    backdrop?.addEventListener('click', closeDrawer);

    // Esc closes the drawer
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer?.classList.contains('is-open')) closeDrawer();
    });

    // Delegated qty + remove inside the drawer body
    drawerBody?.addEventListener('click', (e) => {
      const target = e.target.closest('button');
      if (!target) return;
      if (target.dataset.qtyUp)   changeQty(target.dataset.qtyUp,   +1);
      if (target.dataset.qtyDown) changeQty(target.dataset.qtyDown, -1);
      if (target.dataset.remove)  removeLine(target.dataset.remove);
    });

    // Showcase cards: smooth-scroll to their section
    document.querySelectorAll('[data-show-target]').forEach((card) => {
      card.addEventListener('click', (e) => {
        const targetId = card.dataset.showTarget;
        const target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Checkout — prototype only (no real backend)
    checkoutBtn?.addEventListener('click', () => {
      if (totalItems() === 0) return;
      alert(`Order confirmed.\n\nTotal: ${fmtBDT(totalPrice())}\n\n(Prototype — real checkout coming soon. Call 16638 to complete the order.)`);
      cart = {};
      saveCart();
      render();
      closeDrawer();
    });
  }

  /* ============================================================
     6. Init
     ============================================================ */
  function init() {
    loadCart();
    wire();
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
