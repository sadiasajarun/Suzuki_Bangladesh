/* ============================================================
   HERO SECTION — Hero v5 behavior
   ============================================================
   Adapted from Claude Design's Hero v5 standalone artifact.
   Boots on window 'load' so GSAP + the bike images are ready.
   Self-contained: doesn't depend on other section scripts.

   Responsibilities:
     - Bike data + carousel (4 featured bikes, auto-advance)
     - White-background knockout for JPEG bike photos
     - Trim transparent borders so all bikes render at uniform size
     - Speed-line particles
     - Leader lines from spec cards to bike anchor points
     - Entrance GSAP timeline (slashes → nav-area → headline → bike → specs)
     - Scroll parallax on hero
     - prefers-reduced-motion fallback
     - Visible-fallback if anything throws
   ============================================================ */

(function heroInit() {
  'use strict';

  /* ============================================================
     BIKE DATA
     ============================================================ */
  const BIKES = [
    {
      id: 'gixxer-sf-250',
      pre: 'Featured · 250cc Sport',
      name: ['Gixxer', ' SF ', '250'],
      price: '4,29,950',
      img: 'assets/images/bikes/gixxer-sf-250.webp',
      cc: 249,
      knockout: false,
      scale: 1.0,
      specs: { engine: 249, power: 26.5, mileage: 40 },
      anchors: { engine: [0.42, 0.42], power: [0.55, 0.55], mileage: [0.62, 0.40] },
    },
    {
      id: 'gsx-r150',
      pre: 'Track-Bred · 150cc Supersport',
      name: ['GSX', '-R', '150'],
      price: '3,79,950',
      img: 'assets/images/bikes/gsx-r150.webp',
      cc: 147,
      knockout: false,
      scale: 1.0,
      specs: { engine: 147, power: 19.0, mileage: 45 },
      anchors: { engine: [0.42, 0.45], power: [0.55, 0.58], mileage: [0.62, 0.42] },
    },
    {
      id: 'gixxer-150',
      pre: 'Streetfighter · 150cc Naked',
      name: ['Gixxer', ' ', '150'],
      price: '2,49,950',
      img: 'assets/images/bikes/gixxer-sf-250.webp',
      cc: 155,
      knockout: false,
      scale: 1.0,
      specs: { engine: 155, power: 13.6, mileage: 48 },
      anchors: { engine: [0.42, 0.42], power: [0.55, 0.55], mileage: [0.62, 0.40] },
    },
    {
      id: 'access-125',
      pre: 'Daily · 125cc Scooter',
      name: ['Access', ' ', '125'],
      price: '1,89,950',
      img: 'assets/images/bikes/access-125.jpg',
      cc: 124,
      knockout: true,
      scale: 1.0,
      specs: { engine: 124, power: 8.7, mileage: 64 },
      anchors: { engine: [0.42, 0.45], power: [0.55, 0.55], mileage: [0.62, 0.45] },
    },
  ];

  let activeIdx = 0;
  let userInteracted = false;
  const AUTO_MS = 6000;

  /* ============================================================
     IMAGE PROCESSING — knockout + trim
     ============================================================ */
  function _drawToCanvas(img) {
    const c = document.createElement('canvas');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return { canvas: c, ctx };
  }

  function _knockoutPixels(canvas, ctx, tolerance) {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const px = data.data;
    const corners = [
      [0, 0], [canvas.width - 1, 0],
      [0, canvas.height - 1], [canvas.width - 1, canvas.height - 1],
    ].map(([x, y]) => {
      const i = (y * canvas.width + x) * 4;
      return [px[i], px[i + 1], px[i + 2]];
    });
    const bgR = Math.round(corners.reduce((s, c) => s + c[0], 0) / 4);
    const bgG = Math.round(corners.reduce((s, c) => s + c[1], 0) / 4);
    const bgB = Math.round(corners.reduce((s, c) => s + c[2], 0) / 4);
    const bgLum = (bgR + bgG + bgB) / 3;
    if (bgLum < 80) return false;

    for (let i = 0; i < px.length; i += 4) {
      const dr = px[i] - bgR, dg = px[i + 1] - bgG, db = px[i + 2] - bgB;
      const dist = Math.sqrt(dr * dr + dg * dg + db * db);
      if (dist < tolerance) {
        px[i + 3] = 0;
      } else if (dist < tolerance * 2.2) {
        px[i + 3] = Math.round(((dist - tolerance) / (tolerance * 1.2)) * 255);
      }
    }
    ctx.putImageData(data, 0, 0);
    return true;
  }

  function _trimTransparent(canvas, ctx, alphaThreshold = 8) {
    const w = canvas.width, h = canvas.height;
    const data = ctx.getImageData(0, 0, w, h).data;
    let top = h, left = w, right = 0, bottom = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const a = data[(y * w + x) * 4 + 3];
        if (a > alphaThreshold) {
          if (x < left) left = x;
          if (x > right) right = x;
          if (y < top) top = y;
          if (y > bottom) bottom = y;
        }
      }
    }
    if (right < left || bottom < top) return canvas;
    const padX = Math.round((right - left) * 0.015);
    const padY = Math.round((bottom - top) * 0.015);
    left = Math.max(0, left - padX);
    top  = Math.max(0, top - padY);
    right = Math.min(w - 1, right + padX);
    bottom = Math.min(h - 1, bottom + padY);

    const cropped = document.createElement('canvas');
    cropped.width = right - left + 1;
    cropped.height = bottom - top + 1;
    const cctx = cropped.getContext('2d');
    cctx.drawImage(canvas, left, top, cropped.width, cropped.height, 0, 0, cropped.width, cropped.height);
    return cropped;
  }

  async function knockoutWhite(url, tolerance = 28) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const { canvas, ctx } = _drawToCanvas(img);
          _knockoutPixels(canvas, ctx, tolerance);
          const trimmed = _trimTransparent(canvas, ctx);
          resolve(trimmed.toDataURL('image/png'));
        } catch (err) {
          console.warn('[hero] knockoutWhite failed for', url, err);
          resolve(url);
        }
      };
      img.onerror = () => resolve(url);
      img.src = url;
    });
  }

  async function trimImage(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const { canvas, ctx } = _drawToCanvas(img);
          const trimmed = _trimTransparent(canvas, ctx);
          resolve(trimmed.toDataURL('image/png'));
        } catch (err) {
          console.warn('[hero] trimImage failed for', url, err);
          resolve(url);
        }
      };
      img.onerror = () => resolve(url);
      img.src = url;
    });
  }

  async function preprocessKnockouts() {
    await Promise.all(BIKES.map(async (b) => {
      const newSrc = b.knockout ? await knockoutWhite(b.img) : await trimImage(b.img);
      b.img = newSrc;
    }));
  }

  /* ============================================================
     THUMBNAIL RENDER
     ============================================================ */
  function renderThumbs() {
    const thumbStrip = document.getElementById('hero-thumbStrip');
    if (!thumbStrip) return;
    thumbStrip.innerHTML = '';
    BIKES.forEach((b, i) => {
      const t = document.createElement('button');
      t.className = 'thumb' + (i === activeIdx ? ' active' : '');
      t.setAttribute('role', 'tab');
      t.setAttribute('aria-selected', i === activeIdx ? 'true' : 'false');
      t.setAttribute('aria-label', `Show Suzuki ${b.name.join('').trim()}`);
      t.dataset.idx = i;
      t.dataset.testid = `hero-thumb-${b.id}`;
      t.innerHTML = `
        <div class="thumb-img-box"><img class="thumb-img" src="${b.img}" alt="" loading="lazy" /></div>
        <div class="thumb-name">${b.name.join('').trim()}</div>
        <div class="thumb-cc">${b.cc}cc</div>
      `;
      t.addEventListener('click', () => selectBike(i, true));
      thumbStrip.appendChild(t);
    });
  }

  /* ============================================================
     BIKE SWAP
     ============================================================ */
  function selectBike(idx, fromUser) {
    if (idx === activeIdx) return;
    if (fromUser) { userInteracted = true; stopAutoAdvance(); }

    const thumbStrip = document.getElementById('hero-thumbStrip');
    [...thumbStrip.children].forEach((el, i) => {
      el.classList.toggle('active', i === idx);
      el.setAttribute('aria-selected', i === idx ? 'true' : 'false');
    });

    const b = BIKES[idx];
    const bikeImg = document.getElementById('hero-bikeImg');
    const bikeWrap = document.getElementById('hero-bikeWrap');
    const redHalo = document.getElementById('hero-redHalo');

    const tl = gsap.timeline();
    tl.to(bikeWrap, { x: -60, opacity: 0, rotation: -8, duration: 0.3, ease: 'power2.in' })
      .add(() => {
        bikeImg.src = b.img;
        bikeImg.alt = `Suzuki ${b.name.join('').trim()}`;
        bikeImg.style.setProperty('--bike-scale', b.scale ?? 1);
        document.getElementById('hero-bikePre').textContent = b.pre;
        document.getElementById('hero-bikeName').innerHTML = `${b.name[0]}<span class="accent">${b.name[1]}</span>${b.name[2]}`;
        document.getElementById('hero-bikePrice').innerHTML = `<span class="currency">BDT</span> ${b.price}`;
        setSpecTargets(b.specs);
        countUpStats();
        document.getElementById('hero-spec-engine').dataset.anchor = b.anchors.engine.join(',');
        document.getElementById('hero-spec-power').dataset.anchor = b.anchors.power.join(',');
        document.getElementById('hero-spec-mileage').dataset.anchor = b.anchors.mileage.join(',');
        requestAnimationFrame(() => requestAnimationFrame(updateLeaders));
      })
      .fromTo(bikeWrap,
        { x: 120, opacity: 0, rotation: 30 },
        { x: 0, opacity: 1, rotation: 0, duration: 0.85, ease: 'power3.out' });

    gsap.fromTo(redHalo, { scale: 0.8 }, { scale: 1.08, duration: 0.25, ease: 'power2.out', yoyo: true, repeat: 1 });
    activeIdx = idx;
  }

  function setSpecTargets(specs) {
    document.querySelector('#hero-spec-engine .num').dataset.target  = specs.engine;
    document.querySelector('#hero-spec-power .num').dataset.target   = specs.power;
    document.querySelector('#hero-spec-mileage .num').dataset.target = specs.mileage;
  }

  /* ============================================================
     AUTO-ADVANCE
     ============================================================ */
  let progressTween = null;

  function startAutoAdvance() {
    if (userInteracted) return;
    if (progressTween) progressTween.kill();
    const progressBar = document.getElementById('hero-progressBar');
    progressTween = gsap.fromTo(progressBar,
      { scaleX: 0 },
      { scaleX: 1, duration: AUTO_MS / 1000, ease: 'none',
        onComplete: () => {
          const next = (activeIdx + 1) % BIKES.length;
          selectBike(next, false);
          startAutoAdvance();
        }
      });
  }
  function stopAutoAdvance() {
    if (progressTween) progressTween.kill();
    gsap.to(document.getElementById('hero-progressBar'), { opacity: 0, duration: 0.3 });
  }

  /* ============================================================
     PARTICLES
     ============================================================ */
  function spawnParticles() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const container = document.getElementById('hero-particles');
    if (!container) return;
    const count = window.innerWidth < 768 ? 6 : 10;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const w = 80 + Math.random() * 220;
      p.style.width = w + 'px';
      p.style.top = (Math.random() * 100) + '%';
      p.style.right = '-300px';
      p.style.setProperty('--p-color', Math.random() < 0.3 ? '#FF1A2E' : 'rgba(255,255,255,0.55)');
      container.appendChild(p);
      animateParticle(p);
    }
  }
  function animateParticle(p) {
    const dur = 4 + Math.random() * 6;
    const opacity = 0.2 + Math.random() * 0.2;
    const startDelay = Math.random() * 5;
    gsap.fromTo(p,
      { x: 0, opacity: 0 },
      { x: -(window.innerWidth + 400), opacity, duration: dur, delay: startDelay, ease: 'none',
        onComplete: () => {
          p.style.top = (Math.random() * 100) + '%';
          animateParticle(p);
        }
      });
  }

  /* ============================================================
     LEADER LINES
     ============================================================ */
  function updateLeaders() {
    if (window.innerWidth < 768) return;
    const hero = document.getElementById('hero');
    const bikeWrap = document.getElementById('hero-bikeWrap');
    if (!hero || !bikeWrap) return;
    const hr = hero.getBoundingClientRect();
    const wrap = bikeWrap.getBoundingClientRect();

    const cardKeys = ['engine', 'power', 'mileage'];
    cardKeys.forEach(key => {
      const card = document.getElementById(`hero-spec-${key}`);
      const path = document.getElementById(`hero-leader-${key}`);
      const dot  = document.getElementById(`hero-leader-${key}-dot`);
      if (!card || !path) return;

      const cr = card.getBoundingClientRect();
      const [ax, ay] = (card.dataset.anchor || '0.5,0.5').split(',').map(Number);
      const bikeAx = wrap.left - hr.left + ax * wrap.width;
      const bikeAy = wrap.top  - hr.top  + ay * wrap.height;
      const cardCx = (cr.left + cr.right) / 2 - hr.left;
      const onLeft = cardCx < (hr.width / 2);
      const startX = onLeft ? (cr.right - hr.left) : (cr.left - hr.left);
      const startY = (cr.top + cr.bottom) / 2 - hr.top;
      const midX = onLeft ? Math.min(startX + 60, bikeAx - 40) : Math.max(startX - 60, bikeAx + 40);
      const midY = startY;

      path.setAttribute('points', `${startX},${startY} ${midX},${midY} ${bikeAx},${bikeAy}`);
      dot.setAttribute('cx', bikeAx);
      dot.setAttribute('cy', bikeAy);
    });
  }

  window.addEventListener('resize', updateLeaders);

  /* ============================================================
     ENTRANCE SEQUENCE
     ============================================================ */
  function runEntrance() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const redHalo = document.getElementById('hero-redHalo');

    if (reduce) {
      const el = (id) => document.getElementById(id);
      if (el('hero-scrollCue')) el('hero-scrollCue').style.opacity = 1;
      if (redHalo) redHalo.style.opacity = 0.45;
      if (el('hero-bikeShadow')) el('hero-bikeShadow').style.opacity = 0.7;
      if (el('hero-eyebrow')) el('hero-eyebrow').classList.add('lit');
      if (el('hero-headline')) {
        el('hero-headline').classList.add('lit');
        el('hero-headline').style.opacity = 1;
      }
      const hlMega = el('hero-hlMega');
      if (hlMega) { hlMega.style.opacity = 1; hlMega.style.transform = 'none'; }
      const hlEd = el('hero-hlEditorial');
      if (hlEd) { hlEd.style.opacity = 1; hlEd.style.transform = 'none'; }
      document.querySelectorAll('#hero-hlEditorial .hl-line').forEach(node => { node.style.opacity = 1; node.style.transform = 'none'; });
      const lockup = el('hero-brandLockup');
      if (lockup) { lockup.style.opacity = 1; lockup.style.transform = 'none'; }
      countUpStats();
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 0–400ms: slashes draw down
    tl.to('.hero .slash-1', { scaleY: 1, duration: 0.9, ease: 'power4.out' }, 0)
      .to('.hero .slash-2', { scaleY: 1, duration: 1.0, ease: 'power4.out' }, 0.08)
      .to('.hero .slash-3', { scaleY: 1, duration: 1.1, ease: 'power4.out' }, 0.16)
      .to('.hero .slash-4', { scaleY: 1, duration: 1.2, ease: 'power4.out' }, 0.24);

    // 300ms: eyebrow tag fade in
    tl.to('#hero-eyebrow', { opacity: 1, duration: 0.5 }, 0.3)
      .add(() => document.getElementById('hero-eyebrow')?.classList.add('lit'), 0.4);

    // 0.45s: MEGA outline word reveals BEHIND the bike
    tl.add(() => document.getElementById('hero-headline')?.classList.add('lit'), 0.45);
    tl.fromTo('#hero-hlMega',
      { opacity: 0, y: 30, scale: 0.94 },
      { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out' },
      0.4);
    tl.fromTo('#hero-hlEditorial',
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      0.65);
    tl.fromTo('#hero-hlEditorial .hl-line',
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
      0.7);

    // 1.2s: brand lockup
    tl.fromTo('#hero-brandLockup',
      { opacity: 0, x: -16, y: -8 },
      { opacity: 1, x: 0, y: 0, duration: 0.8, ease: 'power3.out' },
      1.2);

    // 600ms: bike entrance
    tl.fromTo('#hero-bikeWrap',
      { x: 280, y: 40, opacity: 0, rotation: 30, transformOrigin: '20% 80%' },
      { x: 0, y: 0, opacity: 1, rotation: 0, duration: 1.4, ease: 'power4.out' },
      0.6);

    // Halo
    tl.fromTo(redHalo,
      { opacity: 0, scale: 0.6 },
      { opacity: 0.45, scale: 1, duration: 1.4, ease: 'power3.out' },
      0.7);

    // Beam sweep
    tl.fromTo('#hero-beam',
      { scaleX: 0 },
      { scaleX: 1, duration: 0.7, ease: 'power3.inOut' },
      1.1)
      .to('#hero-beam', { opacity: 0, duration: 0.6 }, 1.85);

    // Shadow
    tl.to('#hero-bikeShadow', { opacity: 0.7, duration: 0.6 }, 1.7);

    // Spec cards + leader lines
    tl.add(() => updateLeaders(), 1.55);
    tl.fromTo('.hero .spec-card',
      { y: 8, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'power3.out' },
      1.6);
    tl.to(['#hero-leader-engine', '#hero-leader-engine-dot'],  { opacity: 0.55, duration: 0.5 }, 1.7);
    tl.to(['#hero-leader-power', '#hero-leader-power-dot'],    { opacity: 0.55, duration: 0.5 }, 1.85);
    tl.to(['#hero-leader-mileage', '#hero-leader-mileage-dot'],{ opacity: 0.55, duration: 0.5 }, 2.0);
    tl.add(() => countUpStats(), 1.8);

    // 2.0s: bike id + ctas + thumbs
    tl.fromTo('#hero-bikeId', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 2.0);
    tl.fromTo('#hero-ctas .btn-hero',
      { scale: 0.95, opacity: 0, y: 10 },
      { scale: 1, opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(1.4)' },
      2.1);
    tl.fromTo('#hero-thumbWrap', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, 2.2);
    tl.to('#hero-scrollCue', { opacity: 1, duration: 0.5 }, 2.6);
    tl.add(() => startAutoAdvance(), 2.8);
  }

  /* ============================================================
     STAT COUNTERS
     ============================================================ */
  function countUpStats() {
    document.querySelectorAll('.hero .spec-card .num').forEach(el => {
      const target = parseFloat(el.dataset.target);
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const obj = { v: 0 };
      gsap.killTweensOf(obj);
      gsap.to(obj, {
        v: target,
        duration: 0.8,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = decimals ? obj.v.toFixed(decimals) : Math.round(obj.v);
        }
      });
    });
  }

  /* ============================================================
     SCROLL PARALLAX (hero-only)
     ============================================================ */
  function initParallax() {
    const hero = document.getElementById('hero');
    const bikeWrap = document.getElementById('hero-bikeWrap');
    const redHalo = document.getElementById('hero-redHalo');
    if (!hero || !bikeWrap || !redHalo) return;
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!reduce && y < window.innerHeight) {
          hero.style.transform = `translateY(${-y * 0.4}px)`;
          const scale = 1 + Math.min(y / window.innerHeight, 1) * 0.05;
          bikeWrap.style.transform = `scale(${scale})`;
          const haloOpacity = Math.max(0, 0.45 - (y / window.innerHeight) * 0.45);
          redHalo.style.opacity = haloOpacity;
        }
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ============================================================
     LOGO KNOCKOUT
     ============================================================ */
  async function prepareLogo() {
    try {
      const knocked = await knockoutWhite('assets/images/logo/suzuki-logo.png', 60);
      const wm = document.getElementById('hero-watermark');
      if (wm) wm.style.backgroundImage = `url(${knocked})`;
      const blMark = document.getElementById('hero-blMark');
      if (blMark) blMark.style.backgroundImage = `url(${knocked})`;
      const fb = document.querySelector('.hero .watermark-fallback');
      if (fb) fb.style.display = 'none';
    } catch (err) {
      console.warn('[hero] prepareLogo failed:', err);
    }
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function withTimeout(promise, ms, label) {
    return Promise.race([
      promise,
      new Promise((resolve) => setTimeout(() => {
        console.warn(`[hero] ${label} timed out after ${ms}ms — continuing without`);
        resolve();
      }, ms))
    ]);
  }

  function forceVisibleFallback() {
    const ids = ['hero-eyebrow', 'hero-headline', 'hero-hlMega', 'hero-hlEditorial', 'hero-brandLockup', 'hero-bikeId', 'hero-ctas', 'hero-thumbWrap', 'hero-redHalo', 'hero-bikeShadow'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.style.opacity = '1'; el.style.transform = ''; }
    });
    document.querySelectorAll('.hero .spec-card').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    document.querySelectorAll('.hero .slash').forEach(el => { el.style.transform = 'scaleY(1)'; });
    document.getElementById('hero-eyebrow')?.classList.add('lit');
    document.getElementById('hero-headline')?.classList.add('lit');
    countUpStats();
    updateLeaders();
  }

  window.addEventListener('load', async () => {
    if (typeof gsap === 'undefined') {
      console.error('[hero] GSAP not loaded — skipping hero entrance.');
      return;
    }
    if (!document.getElementById('hero')) {
      console.warn('[hero] No #hero element on this page — skipping.');
      return;
    }

    spawnParticles();
    initParallax();

    try {
      await withTimeout(
        Promise.all([preprocessKnockouts(), prepareLogo()]),
        4000,
        'image preprocessing'
      );
    } catch (err) {
      console.warn('[hero] image preprocessing threw:', err);
    }

    const bikeImg = document.getElementById('hero-bikeImg');
    if (bikeImg) {
      bikeImg.src = BIKES[0].img;
      bikeImg.style.setProperty('--bike-scale', BIKES[0].scale ?? 1);
    }

    try { renderThumbs(); } catch (err) { console.warn('[hero] renderThumbs threw:', err); }

    const thumbStrip = document.getElementById('hero-thumbStrip');
    if (thumbStrip) {
      thumbStrip.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault();
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        const next = (activeIdx + dir + BIKES.length) % BIKES.length;
        selectBike(next, true);
        thumbStrip.children[next]?.focus();
      });
    }

    // CTA handlers (hooks for future routing)
    document.getElementById('hero-btn-primary')?.addEventListener('click', () => {
      console.info('[hero] CTA: Explore Lineup → /bikes');
    });
    document.getElementById('hero-btn-secondary')?.addEventListener('click', () => {
      console.info('[hero] CTA: Book Test Ride → /test-ride');
    });

    try {
      runEntrance();
    } catch (err) {
      console.error('[hero] runEntrance threw, forcing visible fallback:', err);
      forceVisibleFallback();
    }
  });
})();
