/* ============================================================
   test-ride.html — page logic
   ============================================================
   Responsibilities:
     1. Read ?bike=<slug> from URL — pre-select that tile
     2. Bike picker: click a tile to choose; updates hidden input,
        scrolls swatch into view, shows confirmation badge
     3. Dealer cascade: Division → District → Dealer dropdown
     4. Date constraints: min today, max today + 30 days
     5. Form validation on submit; on success replace the form
        with a confirmation card showing the booking summary
     6. Reset link to start over
   ============================================================ */

(() => {
  /* ============================================================
     1. BIKE LIST — small index for the picker; the picker tiles
     are also rendered server-side in the markup, so this is just
     used for cross-referencing names + the URL pre-select.
     ============================================================ */
  const BIKES = {
    'gixxer-sf-250':       'Gixxer SF 250',
    'gsx-r150':            'GSX-R150',
    'gixxer-250':          'Gixxer 250',
    'gixxer-sf':           'Gixxer SF',
    'gixxer':              'Gixxer',
    'gixxer-classic-matt': 'Gixxer Classic Matt',
    'gixxer-monotone':     'Gixxer Monotone',
    'access-125':          'Access 125',
    'gsx-125':             'GSX 125',
    'hayate-ep':           'Hayate EP',
  };

  /* ============================================================
     2. DEALERS — kept in sync with dealers.js (subset: name +
     division + district is enough here)
     ============================================================ */
  const DEALERS = [
    { id: 'dhk-flagship',  name: 'Suzuki Flagship Store',     division: 'Dhaka',     district: 'Dhaka' },
    { id: 'dhk-uttara',    name: 'Suzuki Uttara',              division: 'Dhaka',     district: 'Dhaka' },
    { id: 'dhk-mirpur',    name: 'Suzuki Mirpur',              division: 'Dhaka',     district: 'Dhaka' },
    { id: 'dhk-dhanmondi', name: 'Suzuki Dhanmondi',           division: 'Dhaka',     district: 'Dhaka' },
    { id: 'dhk-narayan',   name: 'Suzuki Narayanganj',         division: 'Dhaka',     district: 'Narayanganj' },
    { id: 'dhk-gazipur',   name: 'Suzuki Gazipur',             division: 'Dhaka',     district: 'Gazipur' },
    { id: 'ctg-agrabad',   name: 'Suzuki Chattogram (Agrabad)',division: 'Chattogram',district: 'Chattogram' },
    { id: 'ctg-cox',       name: 'Suzuki Cox’s Bazar',         division: 'Chattogram',district: 'Cox’s Bazar' },
    { id: 'ctg-comilla',   name: 'Suzuki Cumilla',             division: 'Chattogram',district: 'Cumilla' },
    { id: 'khu-khulna',    name: 'Suzuki Khulna',              division: 'Khulna',    district: 'Khulna' },
    { id: 'khu-jessore',   name: 'Suzuki Jashore',             division: 'Khulna',    district: 'Jashore' },
    { id: 'raj-rajshahi',  name: 'Suzuki Rajshahi',            division: 'Rajshahi',  district: 'Rajshahi' },
    { id: 'raj-bogura',    name: 'Suzuki Bogura',              division: 'Rajshahi',  district: 'Bogura' },
    { id: 'syl-sylhet',    name: 'Suzuki Sylhet',              division: 'Sylhet',    district: 'Sylhet' },
    { id: 'bar-barisal',   name: 'Suzuki Barishal',            division: 'Barisal',   district: 'Barishal' },
    { id: 'ran-rangpur',   name: 'Suzuki Rangpur',             division: 'Rangpur',   district: 'Rangpur' },
    { id: 'ran-dinajpur',  name: 'Suzuki Dinajpur',            division: 'Rangpur',   district: 'Dinajpur' },
    { id: 'mym-mymensingh',name: 'Suzuki Mymensingh',          division: 'Mymensingh',district: 'Mymensingh' },
  ];

  /* ============================================================
     3. STATE
     ============================================================ */
  const state = {
    bike: null,
    division: '',
    district: '',
    dealer: '',
  };

  /* ============================================================
     4. WIRE: bike picker
     ============================================================ */
  const bikeTiles = document.querySelectorAll('[data-bike-tile]');
  const bikeInput = document.querySelector('[name="bike"]');
  const bikeBadge = document.querySelector('[data-bike-badge]');

  function selectBike(slug, scrollIntoView) {
    if (!BIKES[slug]) return;
    state.bike = slug;
    bikeTiles.forEach((t) => {
      const active = t.dataset.bikeTile === slug;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-pressed', String(active));
    });
    if (bikeInput) bikeInput.value = slug;
    if (bikeBadge) {
      bikeBadge.textContent = BIKES[slug];
      bikeBadge.classList.add('is-visible');
    }
    if (scrollIntoView) {
      const tile = document.querySelector(`[data-bike-tile="${slug}"]`);
      tile?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  bikeTiles.forEach((tile) => {
    tile.addEventListener('click', () => {
      selectBike(tile.dataset.bikeTile, false);
    });
  });

  /* ============================================================
     5. WIRE: dealer cascade
     ============================================================ */
  const divisionSelect = document.querySelector('[name="division"]');
  const districtSelect = document.querySelector('[name="district"]');
  const dealerSelect   = document.querySelector('[name="dealer"]');

  function populateDistricts() {
    if (!districtSelect) return;
    districtSelect.innerHTML = '<option value="">Select district</option>';
    if (!state.division) {
      districtSelect.disabled = true;
      return;
    }
    const districts = [...new Set(
      DEALERS.filter((d) => d.division === state.division).map((d) => d.district)
    )].sort();
    districts.forEach((d) => {
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = d;
      districtSelect.appendChild(opt);
    });
    districtSelect.disabled = false;
  }
  function populateDealers() {
    if (!dealerSelect) return;
    dealerSelect.innerHTML = '<option value="">Select dealer</option>';
    if (!state.division) {
      dealerSelect.disabled = true;
      return;
    }
    const list = DEALERS.filter((d) =>
      d.division === state.division &&
      (!state.district || d.district === state.district)
    );
    list.forEach((d) => {
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = `${d.name} — ${d.district}`;
      dealerSelect.appendChild(opt);
    });
    dealerSelect.disabled = list.length === 0;
  }

  divisionSelect?.addEventListener('change', () => {
    state.division = divisionSelect.value;
    state.district = '';
    populateDistricts();
    populateDealers();
  });
  districtSelect?.addEventListener('change', () => {
    state.district = districtSelect.value;
    populateDealers();
  });

  /* ============================================================
     6. WIRE: date constraints (min today, max +30 days)
     ============================================================ */
  const dateInput = document.querySelector('[name="date"]');
  if (dateInput) {
    const fmt = (d) => d.toISOString().split('T')[0];
    const today = new Date();
    const maxDate = new Date(); maxDate.setDate(today.getDate() + 30);
    dateInput.min = fmt(today);
    dateInput.max = fmt(maxDate);
  }

  /* ============================================================
     7. WIRE: time slot pills (radio-equivalent)
     ============================================================ */
  document.querySelectorAll('[data-slot]').forEach((pill) => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('[data-slot]').forEach((p) => {
        p.classList.toggle('is-active', p === pill);
        p.setAttribute('aria-pressed', String(p === pill));
      });
      const slotInput = document.querySelector('[name="slot"]');
      if (slotInput) slotInput.value = pill.dataset.slot;
    });
  });

  /* ============================================================
     8. FORM SUBMIT — validate, then show confirmation card
     ============================================================ */
  const form = document.querySelector('[data-test-ride-form]');
  const stage = document.querySelector('[data-form-stage]');
  const successCard = document.querySelector('[data-form-success]');

  function validate(payload) {
    const errors = [];
    if (!payload.bike)          errors.push('Pick a bike to ride.');
    if (!payload.dealer)        errors.push('Pick a dealer location.');
    if (!payload.date)          errors.push('Pick a date.');
    if (!payload.slot)          errors.push('Pick a time slot.');
    if (!payload.fullname)      errors.push('Enter your full name.');
    if (!/^[+\d\s-]{8,}$/.test(payload.phone || '')) errors.push('Enter a valid phone number.');
    if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) errors.push('Email looks off.');
    if (!payload.licenseAck)    errors.push('Confirm you have a valid licence.');
    return errors;
  }

  function showSuccess(payload) {
    if (!successCard || !stage) return;
    const dealerObj = DEALERS.find((d) => d.id === payload.dealer);
    const detail = (sel, value) => {
      const el = successCard.querySelector(sel);
      if (el) el.textContent = value;
    };
    detail('[data-sum-name]',   payload.fullname);
    detail('[data-sum-bike]',   BIKES[payload.bike] || '—');
    detail('[data-sum-dealer]', dealerObj ? dealerObj.name : '—');
    detail('[data-sum-when]',   `${payload.date} · ${payload.slot}`);
    detail('[data-sum-phone]',  payload.phone);

    // Hide form, show success
    stage.hidden = true;
    successCard.hidden = false;
    successCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function resetForm() {
    if (!form || !stage || !successCard) return;
    form.reset();
    state.bike = null;
    state.division = '';
    state.district = '';
    state.dealer = '';
    bikeTiles.forEach((t) => { t.classList.remove('is-active'); t.setAttribute('aria-pressed', 'false'); });
    if (bikeBadge) { bikeBadge.textContent = ''; bikeBadge.classList.remove('is-visible'); }
    document.querySelectorAll('[data-slot]').forEach((p) => { p.classList.remove('is-active'); p.setAttribute('aria-pressed', 'false'); });
    populateDistricts();
    populateDealers();
    stage.hidden = false;
    successCard.hidden = true;
    stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = {
      bike:       fd.get('bike') || state.bike,
      division:   fd.get('division'),
      district:   fd.get('district'),
      dealer:     fd.get('dealer'),
      date:       fd.get('date'),
      slot:       fd.get('slot'),
      fullname:   (fd.get('fullname') || '').toString().trim(),
      phone:      (fd.get('phone') || '').toString().trim(),
      email:      (fd.get('email') || '').toString().trim(),
      notes:      (fd.get('notes') || '').toString().trim(),
      licenseAck: fd.get('licenseAck') === 'on',
    };

    const errors = validate(payload);
    const errBox = document.querySelector('[data-form-errors]');
    if (errors.length) {
      if (errBox) {
        errBox.hidden = false;
        errBox.innerHTML = `<strong>Please fix:</strong><ul>${errors.map((e) => `<li>${e}</li>`).join('')}</ul>`;
        errBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    if (errBox) errBox.hidden = true;
    showSuccess(payload);
  });

  document.querySelector('[data-form-reset]')?.addEventListener('click', resetForm);

  /* ============================================================
     9. INIT — preselect bike from ?bike=<slug>
     ============================================================ */
  function init() {
    try {
      const params = new URLSearchParams(window.location.search);
      const slug = params.get('bike');
      if (slug && BIKES[slug]) selectBike(slug, true);
    } catch (err) {
      // ignore
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
