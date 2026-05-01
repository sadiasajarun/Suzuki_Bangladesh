/* ============================================================
   hero-anchor-debug.js — anchor-picker debug mode
   ============================================================
   Activated by ?anchors in the URL. Adds a floating panel + a
   crosshair on the bike to let you click the right spots and
   capture the BIKES.anchors values for engine / power / mileage
   on every carousel bike. Once tuning is done, click "Copy as
   JSON" and paste the result into the BIKES array.

   This file no-ops if `?anchors` is not in the URL — safe to
   include in production. Reads internals from window.__heroDebug
   (set by hero.js when the same flag is detected).
   ============================================================ */

(() => {
  const ENABLED = (() => {
    try { return new URLSearchParams(location.search).has('anchors'); }
    catch (err) { return false; }
  })();
  if (!ENABLED) return;

  const ANCHOR_KEYS = ['engine', 'power', 'mileage'];
  const KEY_LABELS  = { engine: 'Engine', power: 'Max Power', mileage: 'Mileage' };
  let activeKey = 'engine';

  // hero.js exposes its internals async (after image preprocessing).
  // Wait for the signal before booting the panel.
  if (window.__heroDebug) {
    init(window.__heroDebug);
  } else {
    window.addEventListener('hero:debug-ready', () => init(window.__heroDebug), { once: true });
  }

  function init(debug) {
    const { BIKES, selectBike, updateLeaders } = debug;
    if (!BIKES || !selectBike || !updateLeaders) {
      console.error('[anchor-debug] hero.js debug hooks missing');
      return;
    }

    /* ------------------------------------------------------------
       Build & inject the panel + crosshair into the DOM
       ------------------------------------------------------------ */
    const panel = document.createElement('div');
    panel.className = 'hero-anchor-panel';
    panel.innerHTML = `
      <h3>Anchor tuner</h3>
      <label>
        Bike
        <select data-anchor-bike>
          ${BIKES.map((b, i) => `<option value="${i}">${b.id}</option>`).join('')}
        </select>
      </label>
      <div class="hero-anchor-rows" data-anchor-rows></div>
      <div class="hero-anchor-cursor" data-anchor-cursor>Cursor: —, —</div>
      <div class="hero-anchor-help">
        Click the bike to set the active anchor.<br>
        <kbd>1</kbd>/<kbd>2</kbd>/<kbd>3</kbd> switch anchor &nbsp;
        <kbd>←</kbd>/<kbd>→</kbd> switch bike &nbsp;
        <kbd>Esc</kbd> close
      </div>
      <div class="hero-anchor-actions">
        <button class="is-secondary" data-anchor-reset>Reset bike</button>
        <button data-anchor-copy>Copy as JSON</button>
      </div>
    `;
    document.body.appendChild(panel);

    const toast = document.createElement('div');
    toast.className = 'hero-anchor-toast';
    document.body.appendChild(toast);

    const crosshair = document.createElement('div');
    crosshair.className = 'hero-anchor-crosshair';
    const bikeWrap = document.getElementById('hero-bikeWrap');
    if (bikeWrap) bikeWrap.appendChild(crosshair);

    const bikeSelect  = panel.querySelector('[data-anchor-bike]');
    const rowsEl      = panel.querySelector('[data-anchor-rows]');
    const cursorEl    = panel.querySelector('[data-anchor-cursor]');
    const copyBtn     = panel.querySelector('[data-anchor-copy]');
    const resetBtn    = panel.querySelector('[data-anchor-reset]');

    /* Snapshot original anchors so "Reset bike" works */
    const originals = BIKES.map((b) => JSON.parse(JSON.stringify(b.anchors)));

    /* ------------------------------------------------------------
       Render — refresh the rows for the current bike
       ------------------------------------------------------------ */
    function render() {
      bikeSelect.value = String(debug.activeIdx);
      const bike = BIKES[debug.activeIdx];
      rowsEl.innerHTML = ANCHOR_KEYS.map((k, i) => {
        const [x, y] = bike.anchors[k];
        const cls = k === activeKey ? 'hero-anchor-row is-active' : 'hero-anchor-row';
        return `
          <div class="${cls}" data-anchor-key="${k}">
            <span class="hero-anchor-row-key">${i + 1}</span>
            <span class="hero-anchor-row-name">${KEY_LABELS[k]}</span>
            <span class="hero-anchor-row-val">${x.toFixed(3)}, ${y.toFixed(3)}</span>
          </div>
        `;
      }).join('');
      // Re-bind row clicks (innerHTML wipes them)
      rowsEl.querySelectorAll('[data-anchor-key]').forEach((row) => {
        row.addEventListener('click', () => setActiveKey(row.dataset.anchorKey));
      });
    }

    function setActiveKey(k) {
      if (!ANCHOR_KEYS.includes(k)) return;
      activeKey = k;
      render();
    }

    /* ------------------------------------------------------------
       Bike selector — change the active bike
       ------------------------------------------------------------ */
    bikeSelect.addEventListener('change', () => {
      const idx = Number(bikeSelect.value);
      selectBike(idx, true);
      // selectBike is async (300ms exit anim) — re-render after it lands
      setTimeout(render, 350);
    });

    /* ------------------------------------------------------------
       Click on the bike → set active anchor to that spot
       ------------------------------------------------------------ */
    if (bikeWrap) {
      bikeWrap.addEventListener('click', (e) => {
        const rect = bikeWrap.getBoundingClientRect();
        const x = +((e.clientX - rect.left) / rect.width).toFixed(3);
        const y = +((e.clientY - rect.top)  / rect.height).toFixed(3);
        if (x < 0 || x > 1 || y < 0 || y > 1) return;

        const bike = BIKES[debug.activeIdx];
        bike.anchors[activeKey] = [x, y];

        // Also update the live data-anchor on the spec card so
        // updateLeaders() reads the new value.
        const card = document.getElementById(`hero-spec-${activeKey}`);
        if (card) card.dataset.anchor = `${x},${y}`;

        updateLeaders();
        render();
      });

      /* Mouse-move crosshair tracking */
      bikeWrap.addEventListener('mouseenter', () => crosshair.classList.add('is-tracking'));
      bikeWrap.addEventListener('mouseleave', () => {
        crosshair.classList.remove('is-tracking');
        cursorEl.textContent = 'Cursor: —, —';
      });
      bikeWrap.addEventListener('mousemove', (e) => {
        const rect = bikeWrap.getBoundingClientRect();
        const x = (e.clientX - rect.left);
        const y = (e.clientY - rect.top);
        crosshair.style.left = `${x}px`;
        crosshair.style.top  = `${y}px`;
        const nx = (x / rect.width).toFixed(3);
        const ny = (y / rect.height).toFixed(3);
        cursorEl.textContent = `Cursor: ${nx}, ${ny}`;
      });
    }

    /* ------------------------------------------------------------
       Keyboard shortcuts
       ------------------------------------------------------------ */
    document.addEventListener('keydown', (e) => {
      // Don't interfere with form inputs
      if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;

      if (e.key === '1') setActiveKey('engine');
      else if (e.key === '2') setActiveKey('power');
      else if (e.key === '3') setActiveKey('mileage');
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        const next = (debug.activeIdx + dir + BIKES.length) % BIKES.length;
        selectBike(next, true);
        setTimeout(render, 350);
        e.preventDefault();
      } else if (e.key === 'Escape') {
        panel.style.display = 'none';
        crosshair.classList.remove('is-tracking');
      }
    });

    /* ------------------------------------------------------------
       Reset & Copy
       ------------------------------------------------------------ */
    resetBtn.addEventListener('click', () => {
      const idx = debug.activeIdx;
      BIKES[idx].anchors = JSON.parse(JSON.stringify(originals[idx]));
      ANCHOR_KEYS.forEach((k) => {
        const [x, y] = BIKES[idx].anchors[k];
        const card = document.getElementById(`hero-spec-${k}`);
        if (card) card.dataset.anchor = `${x},${y}`;
      });
      updateLeaders();
      render();
      flashToast('Bike anchors reset');
    });

    copyBtn.addEventListener('click', async () => {
      const out = {};
      BIKES.forEach((b) => {
        out[b.id] = {
          engine:  b.anchors.engine.map((n) => +n.toFixed(3)),
          power:   b.anchors.power.map((n) => +n.toFixed(3)),
          mileage: b.anchors.mileage.map((n) => +n.toFixed(3)),
        };
      });
      const text = JSON.stringify(out, null, 2);
      try {
        await navigator.clipboard.writeText(text);
        flashToast('Copied to clipboard');
        console.info('[anchor-debug] anchors:\n' + text);
      } catch (err) {
        flashToast('Copy failed — see console');
        console.warn('[anchor-debug] clipboard failed', err);
        console.info('[anchor-debug] anchors:\n' + text);
      }
    });

    function flashToast(msg) {
      toast.textContent = msg;
      toast.classList.add('is-visible');
      setTimeout(() => toast.classList.remove('is-visible'), 1800);
    }

    // First render
    render();
    console.info('[anchor-debug] panel ready. Use 1/2/3 + click on bike.');
  }
})();
