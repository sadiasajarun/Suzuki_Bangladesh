/* ============================================================
   dealers.html — page logic
   ============================================================
   Responsibilities:
     1. Seed an in-memory dealer dataset (18 across Bangladesh)
     2. Initialise a Leaflet map with OSM tiles + custom red markers
     3. Render the left-rail dealer card list
     4. Wire Division → District dependent dropdowns
     5. "Find dealers near me" — browser geolocation + Haversine
        distance + re-sort by nearest + drop user pin
     6. Card hover ↔ map marker highlight
     7. Card click → fly the map to that marker + open popup
   ============================================================ */

(() => {
  /* ============================================================
     1. DEALER DATA
     ============================================================
     Seeded with the Suzuki Flagship Store (real address) plus
     realistic placeholder dealers across all 8 divisions, with
     accurate city coordinates. Replace with real RMBL data when
     it's available.
     ============================================================ */
  const DEALERS = [
    // Dhaka Division
    { id: 'dhk-flagship',  name: 'Suzuki Flagship Store',     division: 'Dhaka',     district: 'Dhaka',      address: '210/A, Tejgaon Industrial Area, Dhaka 1208', phone: '+88029100711', lat: 23.7615, lng: 90.4036, type: 'flagship' },
    { id: 'dhk-uttara',    name: 'Suzuki Uttara',              division: 'Dhaka',     district: 'Dhaka',      address: 'Sector 3, Rabindra Sarani, Uttara, Dhaka 1230', phone: '+8801711000111', lat: 23.8743, lng: 90.4007, type: 'showroom' },
    { id: 'dhk-mirpur',    name: 'Suzuki Mirpur',              division: 'Dhaka',     district: 'Dhaka',      address: 'Main Road, Mirpur 10, Dhaka 1216', phone: '+8801711000112', lat: 23.8068, lng: 90.3686, type: 'showroom' },
    { id: 'dhk-dhanmondi', name: 'Suzuki Dhanmondi',           division: 'Dhaka',     district: 'Dhaka',      address: 'Mirpur Road, Dhanmondi 27, Dhaka 1205', phone: '+8801711000113', lat: 23.7535, lng: 90.3789, type: 'showroom' },
    { id: 'dhk-narayan',   name: 'Suzuki Narayanganj',         division: 'Dhaka',     district: 'Narayanganj',address: 'BB Road, Chashara, Narayanganj 1400', phone: '+8801711000114', lat: 23.6238, lng: 90.5000, type: 'showroom' },
    { id: 'dhk-gazipur',   name: 'Suzuki Gazipur',             division: 'Dhaka',     district: 'Gazipur',    address: 'Joydebpur, Chowrasta, Gazipur 1700', phone: '+8801711000115', lat: 23.9999, lng: 90.4203, type: 'showroom' },

    // Chattogram Division
    { id: 'ctg-agrabad',   name: 'Suzuki Chattogram (Agrabad)',division: 'Chattogram',district: 'Chattogram', address: 'Sheikh Mujib Road, Agrabad C/A, Chattogram 4100', phone: '+8801711000201', lat: 22.3357, lng: 91.8197, type: 'showroom' },
    { id: 'ctg-cox',       name: 'Suzuki Cox’s Bazar',    division: 'Chattogram',district: 'Cox’s Bazar', address: 'Hotel Motel Zone, Cox’s Bazar 4700', phone: '+8801711000202', lat: 21.4272, lng: 92.0058, type: 'showroom' },
    { id: 'ctg-comilla',   name: 'Suzuki Cumilla',             division: 'Chattogram',district: 'Cumilla',    address: 'Kandirpar, Cumilla 3500', phone: '+8801711000203', lat: 23.4607, lng: 91.1809, type: 'showroom' },

    // Khulna Division
    { id: 'khu-khulna',    name: 'Suzuki Khulna',              division: 'Khulna',    district: 'Khulna',     address: 'Khan Jahan Ali Road, Khulna 9100', phone: '+8801711000301', lat: 22.8456, lng: 89.5403, type: 'showroom' },
    { id: 'khu-jessore',   name: 'Suzuki Jashore',             division: 'Khulna',    district: 'Jashore',    address: 'M K Road, Jashore 7400', phone: '+8801711000302', lat: 23.1664, lng: 89.2081, type: 'showroom' },

    // Rajshahi Division
    { id: 'raj-rajshahi',  name: 'Suzuki Rajshahi',            division: 'Rajshahi',  district: 'Rajshahi',   address: 'Shaheb Bazar, Boalia, Rajshahi 6000', phone: '+8801711000401', lat: 24.3636, lng: 88.6241, type: 'showroom' },
    { id: 'raj-bogura',    name: 'Suzuki Bogura',              division: 'Rajshahi',  district: 'Bogura',     address: 'Nawabbari Road, Bogura 5800', phone: '+8801711000402', lat: 24.8465, lng: 89.3776, type: 'showroom' },

    // Sylhet Division
    { id: 'syl-sylhet',    name: 'Suzuki Sylhet',              division: 'Sylhet',    district: 'Sylhet',     address: 'Zindabazar, Sylhet 3100', phone: '+8801711000501', lat: 24.8949, lng: 91.8687, type: 'showroom' },

    // Barisal Division
    { id: 'bar-barisal',   name: 'Suzuki Barishal',            division: 'Barisal',   district: 'Barishal',   address: 'Sadar Road, Barishal 8200', phone: '+8801711000601', lat: 22.7010, lng: 90.3535, type: 'showroom' },

    // Rangpur Division
    { id: 'ran-rangpur',   name: 'Suzuki Rangpur',             division: 'Rangpur',   district: 'Rangpur',    address: 'Station Road, Rangpur 5400', phone: '+8801711000701', lat: 25.7439, lng: 89.2752, type: 'showroom' },
    { id: 'ran-dinajpur',  name: 'Suzuki Dinajpur',            division: 'Rangpur',   district: 'Dinajpur',   address: 'Goneshtola, Dinajpur 5200', phone: '+8801711000702', lat: 25.6217, lng: 88.6354, type: 'showroom' },

    // Mymensingh Division
    { id: 'mym-mymensingh', name: 'Suzuki Mymensingh',         division: 'Mymensingh',district: 'Mymensingh', address: 'Choto Bazar, Mymensingh 2200', phone: '+8801711000801', lat: 24.7471, lng: 90.4203, type: 'showroom' },
  ];

  /* ============================================================
     2. STATE
     ============================================================ */
  const state = {
    division: '',
    district: '',
    userLocation: null,         // { lat, lng } when geolocation succeeds
    activeId: null,
  };

  /* ============================================================
     3. UTILITIES
     ============================================================ */
  // Haversine — great-circle distance in km
  function distanceKm(a, b) {
    const R = 6371;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const x = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }
  function fmtKm(km) {
    if (km < 1) return `${Math.round(km * 1000)} m away`;
    return `${km.toFixed(1)} km away`;
  }
  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ============================================================
     4. MAP (Leaflet)
     ============================================================ */
  let map;
  const markers = new Map();         // dealerId → Leaflet marker
  let userMarker = null;

  function initMap() {
    if (typeof L === 'undefined') {
      console.error('[dealers] Leaflet not loaded.');
      return;
    }
    // Default view: centred on Dhaka, zoom shows the country
    map = L.map('dealers-map', {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView([23.685, 90.3563], 7);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Custom red SVG marker icon — matches site palette
    const redIcon = L.divIcon({
      className: 'dlr-marker',
      html: `<svg viewBox="0 0 32 44" aria-hidden="true">
               <path d="M16 0C7.2 0 0 7.2 0 16c0 11.5 16 28 16 28s16-16.5 16-28c0-8.8-7.2-16-16-16z" fill="#E40521" stroke="#fff" stroke-width="1.5"/>
               <circle cx="16" cy="16" r="6" fill="#fff"/>
             </svg>`,
      iconSize: [32, 44],
      iconAnchor: [16, 44],
      popupAnchor: [0, -38],
    });
    const flagshipIcon = L.divIcon({
      className: 'dlr-marker dlr-marker--flagship',
      html: `<svg viewBox="0 0 32 44" aria-hidden="true">
               <path d="M16 0C7.2 0 0 7.2 0 16c0 11.5 16 28 16 28s16-16.5 16-28c0-8.8-7.2-16-16-16z" fill="#E40521" stroke="#fff" stroke-width="1.5"/>
               <path d="M16 9 L19 14 L24 14 L20 17 L21.5 22 L16 19 L10.5 22 L12 17 L8 14 L13 14 Z" fill="#fff"/>
             </svg>`,
      iconSize: [38, 52],
      iconAnchor: [19, 52],
      popupAnchor: [0, -45],
    });

    DEALERS.forEach((d) => {
      const icon = d.type === 'flagship' ? flagshipIcon : redIcon;
      const marker = L.marker([d.lat, d.lng], { icon }).addTo(map);
      const popupHtml = `
        <div class="dlr-popup">
          <strong>${escapeHtml(d.name)}</strong>
          <p>${escapeHtml(d.address)}</p>
          <div class="dlr-popup-actions">
            <a href="tel:${d.phone}" class="dlr-popup-btn">Call</a>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${d.lat},${d.lng}" target="_blank" rel="noopener" class="dlr-popup-btn dlr-popup-btn--primary">Directions</a>
          </div>
        </div>`;
      marker.bindPopup(popupHtml, { closeButton: true, className: 'dlr-popup-wrap' });
      marker.on('click', () => {
        state.activeId = d.id;
        highlightCard(d.id, /*scroll*/ true);
      });
      markers.set(d.id, marker);
    });
  }

  /* ============================================================
     5. RENDER — left-rail dealer cards
     ============================================================ */
  const listEl    = document.querySelector('[data-dealer-list]');
  const countEl   = document.querySelector('[data-dealer-count]');
  const divisionSelect = document.querySelector('[data-division]');
  const districtSelect = document.querySelector('[data-district]');
  const findBtn   = document.querySelector('[data-find-dealers]');
  const nearMeBtn = document.querySelector('[data-find-nearby]');
  const nearMeStatus = document.querySelector('[data-nearme-status]');

  function getFiltered() {
    let list = DEALERS.slice();
    if (state.division) list = list.filter((d) => d.division === state.division);
    if (state.district) list = list.filter((d) => d.district === state.district);
    if (state.userLocation) {
      list = list.map((d) => ({ ...d, _dist: distanceKm(state.userLocation, d) }));
      list.sort((a, b) => a._dist - b._dist);
    } else {
      // Flagship first, then alphabetical
      list.sort((a, b) => {
        if (a.type === 'flagship') return -1;
        if (b.type === 'flagship') return 1;
        return a.name.localeCompare(b.name);
      });
    }
    return list;
  }

  function render() {
    if (!listEl) return;
    const list = getFiltered();
    if (countEl) {
      countEl.textContent = list.length === DEALERS.length
        ? `Showing all ${DEALERS.length}`
        : `${list.length} of ${DEALERS.length}`;
    }
    if (list.length === 0) {
      listEl.innerHTML = `
        <div class="dlr-empty">
          <p>No dealers match these filters.</p>
          <button type="button" data-clear-filters>Clear filters</button>
        </div>`;
      return;
    }
    listEl.innerHTML = list.map((d) => {
      const distance = d._dist != null ? `<span class="dlr-card-dist">${fmtKm(d._dist)}</span>` : '';
      const flagshipBadge = d.type === 'flagship'
        ? '<span class="dlr-card-badge">Flagship</span>'
        : '';
      const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${d.lat},${d.lng}`;
      return `
        <article class="dlr-card" data-dealer="${d.id}">
          ${flagshipBadge}
          <h3 class="dlr-card-name">${escapeHtml(d.name)}</h3>
          <p class="dlr-card-addr">${escapeHtml(d.address)}</p>
          <div class="dlr-card-actions">
            <a href="tel:${d.phone}" class="dlr-card-btn" data-dealer-call>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Call
            </a>
            <a href="${directionsHref}" target="_blank" rel="noopener" class="dlr-card-btn dlr-card-btn--primary" data-dealer-directions>
              <svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
              Directions
            </a>
          </div>
          ${distance}
        </article>`;
    }).join('');
  }

  function highlightCard(id, scrollIntoView) {
    if (!listEl) return;
    listEl.querySelectorAll('[data-dealer]').forEach((el) => {
      el.classList.toggle('is-active', el.dataset.dealer === id);
    });
    if (scrollIntoView) {
      const card = listEl.querySelector(`[data-dealer="${id}"]`);
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /* ============================================================
     6. WIRE EVENTS
     ============================================================ */
  function populateDistricts() {
    if (!districtSelect) return;
    const div = state.division;
    const current = districtSelect.value;
    districtSelect.innerHTML = '<option value="">Select District</option>';
    if (!div) {
      districtSelect.disabled = true;
      return;
    }
    const districts = [...new Set(DEALERS.filter((d) => d.division === div).map((d) => d.district))].sort();
    districts.forEach((dist) => {
      const opt = document.createElement('option');
      opt.value = dist;
      opt.textContent = dist;
      districtSelect.appendChild(opt);
    });
    districtSelect.disabled = false;
    if (districts.includes(current)) districtSelect.value = current;
  }

  function wire() {
    // Division change → repopulate Districts
    divisionSelect?.addEventListener('change', () => {
      state.division = divisionSelect.value;
      state.district = '';
      populateDistricts();
    });
    districtSelect?.addEventListener('change', () => {
      state.district = districtSelect.value;
    });

    // Find Dealers button → apply filters + render + fit map
    findBtn?.addEventListener('click', () => {
      render();
      const list = getFiltered();
      if (list.length > 0 && map) {
        const bounds = L.latLngBounds(list.map((d) => [d.lat, d.lng]));
        if (state.userLocation) bounds.extend([state.userLocation.lat, state.userLocation.lng]);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      }
    });

    // Find Nearby — geolocation
    nearMeBtn?.addEventListener('click', () => {
      if (!('geolocation' in navigator)) {
        if (nearMeStatus) {
          nearMeStatus.textContent = 'Geolocation not supported on this browser.';
          nearMeStatus.dataset.state = 'error';
        }
        return;
      }
      if (nearMeStatus) {
        nearMeStatus.textContent = 'Locating you…';
        nearMeStatus.dataset.state = 'loading';
      }
      nearMeBtn.disabled = true;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          state.userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          if (nearMeStatus) {
            nearMeStatus.textContent = 'Sorted by nearest to you.';
            nearMeStatus.dataset.state = 'success';
          }
          nearMeBtn.disabled = false;
          // Drop / move user marker
          if (map) {
            const userIcon = L.divIcon({
              className: 'dlr-marker dlr-marker--you',
              html: `<svg viewBox="0 0 32 32" aria-hidden="true">
                       <circle cx="16" cy="16" r="14" fill="rgba(228,5,33,0.15)"/>
                       <circle cx="16" cy="16" r="7"  fill="#E40521" stroke="#fff" stroke-width="2"/>
                     </svg>`,
              iconSize: [32, 32],
              iconAnchor: [16, 16],
            });
            if (userMarker) {
              userMarker.setLatLng([state.userLocation.lat, state.userLocation.lng]);
            } else {
              userMarker = L.marker([state.userLocation.lat, state.userLocation.lng], { icon: userIcon })
                .addTo(map)
                .bindPopup('<strong>You are here</strong>');
            }
            // Fit to user + nearest 5
            const list = getFiltered().slice(0, 5);
            const bounds = L.latLngBounds([
              [state.userLocation.lat, state.userLocation.lng],
              ...list.map((d) => [d.lat, d.lng]),
            ]);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
          }
          render();
        },
        (err) => {
          nearMeBtn.disabled = false;
          if (nearMeStatus) {
            nearMeStatus.textContent = err.code === 1
              ? 'Location permission denied. Filter by Division below instead.'
              : 'Couldn’t get your location. Try again or filter manually.';
            nearMeStatus.dataset.state = 'error';
          }
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
      );
    });

    // Card hover ↔ marker highlight
    listEl?.addEventListener('mouseover', (e) => {
      const card = e.target.closest('[data-dealer]');
      if (!card) return;
      const m = markers.get(card.dataset.dealer);
      m?._icon?.classList.add('is-hovered');
    });
    listEl?.addEventListener('mouseout', (e) => {
      const card = e.target.closest('[data-dealer]');
      if (!card) return;
      const m = markers.get(card.dataset.dealer);
      m?._icon?.classList.remove('is-hovered');
    });

    // Card click (anywhere not a button) → fly to marker
    listEl?.addEventListener('click', (e) => {
      // Ignore clicks on the action buttons
      if (e.target.closest('[data-dealer-call], [data-dealer-directions]')) return;
      const card = e.target.closest('[data-dealer]');
      if (!card) return;
      const id = card.dataset.dealer;
      const dealer = DEALERS.find((d) => d.id === id);
      const m = markers.get(id);
      if (dealer && m && map) {
        map.flyTo([dealer.lat, dealer.lng], 14, { duration: 0.6 });
        m.openPopup();
        highlightCard(id, false);
      }
    });

    // Clear-filters in empty state
    listEl?.addEventListener('click', (e) => {
      if (e.target.closest('[data-clear-filters]')) {
        state.division = '';
        state.district = '';
        if (divisionSelect) divisionSelect.value = '';
        populateDistricts();
        render();
      }
    });
  }

  /* ============================================================
     7. INIT
     ============================================================ */
  function init() {
    initMap();
    populateDistricts();
    render();
    wire();
  }

  // Leaflet loads async via <script defer>. Wait for both DOM + window load.
  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();
