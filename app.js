/* ============================================================
   TARASY GĄSKI — app.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── STICKY HEADER SHADOW ───────────────────────────────
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10
        ? '0 4px 24px rgba(0,0,0,0.25)'
        : '0 2px 20px rgba(0,0,0,0.2)';
    });
  }

  // ─── HAMBURGER MENU ─────────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('open');
      hamburger.classList.toggle('open');
    });
    document.querySelectorAll('.nav a').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  // ─── SMOOTH SCROLL z offsetem headera ───────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = (header ? header.offsetHeight : 72) + 16;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });

  // ─── SWIPER GALERIA ─────────────────────────────────────
  if (document.querySelector('.mySwiper')) {
    new Swiper('.mySwiper', {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      autoplay: { delay: 4500, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        768:  { slidesPerView: 2, spaceBetween: 16 },
        1024: { slidesPerView: 3, spaceBetween: 20 },
      }
    });
  }

  // ─── MULTI-FILTR TABELI (piętro + pokoje + status) ──────
  const activeFilters = { floor: 'all', rooms: 'all', status: 'all' };

  function applyFilters() {
    const rows = document.querySelectorAll('#lokale-tbody tr[data-lokal]');
    rows.forEach(row => {
      const floorMatch  = activeFilters.floor  === 'all' || row.dataset.floor  === activeFilters.floor;
      const roomsMatch  = activeFilters.rooms  === 'all' || row.dataset.rooms  === activeFilters.rooms;
      const statusMatch = activeFilters.status === 'all' || row.dataset.status === activeFilters.status;
      row.style.display = (floorMatch && roomsMatch && statusMatch) ? '' : 'none';
    });
  }

  document.querySelectorAll('[data-filter-floor]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-filter-floor]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilters.floor = btn.dataset.filterFloor;
      applyFilters();
    });
  });

  document.querySelectorAll('[data-filter-rooms]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-filter-rooms]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilters.rooms = btn.dataset.filterRooms;
      applyFilters();
    });
  });

  document.querySelectorAll('[data-filter-status]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-filter-status]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilters.status = btn.dataset.filterStatus;
      applyFilters();
    });
  });

  // Stary system filtrów (kompatybilność z sekcjami legacy)
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('tbody tr[data-floor]').forEach(row => {
        row.style.display = (filter === 'all' || row.dataset.floor === filter) ? '' : 'none';
      });
    });
  });

  // ─── PLAN OSIEDLA — PRZEŁĄCZANIE KONDYGNACJI ────────────
  const floorTabs = document.querySelectorAll('.floor-tab');
  const floorPlans = document.querySelectorAll('.floor-plan-img');
  floorTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      floorTabs.forEach(t => t.classList.remove('active'));
      floorPlans.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const floor = tab.dataset.floor;
      const target = document.querySelector(`.floor-plan-img[data-floor="${floor}"]`);
      if (target) target.classList.add('active');
    });
  });

  // ─── HOTSPOT → HIGHLIGHT W TABELI ───────────────────────
  document.querySelectorAll('.hotspot').forEach(hs => {
    hs.addEventListener('click', () => {
      const nr = hs.dataset.lokal;
      const row = document.querySelector(`tr[data-lokal="${nr}"]`);
      if (!row) return;
      document.querySelectorAll('tbody tr').forEach(r => r.classList.remove('highlighted'));
      row.classList.add('highlighted');
      row.style.display = '';
      const offset = (header ? header.offsetHeight : 72) + 32;
      window.scrollTo({ top: row.offsetTop - offset, behavior: 'smooth' });
    });
  });

  // ─── VIDEO PLAY OVERLAY ──────────────────────────────────
  document.querySelectorAll('.video-card').forEach(card => {
    const video = card.querySelector('video');
    const overlay = card.querySelector('.video-overlay');
    if (!video || !overlay) return;
    overlay.addEventListener('click', () => {
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
      video.play();
    });
    video.addEventListener('pause', () => {
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'auto';
    });
    video.addEventListener('ended', () => {
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'auto';
    });
  });

  // ─── FAQ ACCORDION ───────────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = btn.classList.contains('open');
      // zamknij wszystkie
      document.querySelectorAll('.faq-question').forEach(q => {
        q.classList.remove('open');
        if (q.nextElementSibling) q.nextElementSibling.classList.remove('open');
      });
      if (!isOpen) {
        btn.classList.add('open');
        if (answer) answer.classList.add('open');
      }
    });
  });

  // ─── FADE UP ANIMACJE ────────────────────────────────────
  const fadeEls = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => observer.observe(el));

  // ─── HERO STICKY SCROLL — wyłanianie budynku z owalu ───
  // Mechanizm identyczny z ustkaflow.pl:
  //   #hero = 200vh (scroll space), .hero-split = sticky (100vh)
  //   progress 0→1 animuje: clip-path ellipse (oval → pełna kolumna), parallax, content fade-in

  const heroSection  = document.getElementById('hero');
  const imgClip      = document.querySelector('.hero-img-clip');
  const heroImg      = document.querySelector('.hero-img');
  const contentCol   = document.querySelector('.hero-content-col');
  const locationChip = document.querySelector('.hero-location-chip');

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function lerp(a, b, t)    { return a + (b - a) * t; }

  function updateHeroAnim() {
    if (!heroSection || !imgClip || !heroImg) return;
    if (window.innerWidth <= 1024) return; // na mobile CSS ustawia wartosci finalne

    const scrollY     = window.scrollY;
    const heroTop     = heroSection.offsetTop;
    const scrollSpace = heroSection.offsetHeight - window.innerHeight; // ~100vh
    const raw         = Math.max(0, Math.min(1, (scrollY - heroTop) / scrollSpace));
    const p           = easeOutCubic(raw);

    // 1. Maska owalna: ellipse(32% 36%) → ellipse(80% 80%) — odsłania całe zdjęcie
    const rx = lerp(32, 80, p);
    const ry = lerp(36, 80, p);
    const cy = lerp(54, 50, p);
    imgClip.style.clipPath = `ellipse(${rx}% ${ry}% at 50% ${cy}%)`;

    // 2. Obraz: lekki parallax — budynek wyłania się z owalu
    heroImg.style.transform = `translateY(${lerp(6, 0, p)}%) scale(${lerp(1.08, 1.0, p)})`;

    // 3. Prawa kolumna: fade-in + slide-up z 20% opoznieniem
    const cp = easeOutCubic(Math.max(0, Math.min(1, (raw - 0.2) / 0.6)));
    if (contentCol) {
      contentCol.style.opacity   = cp;
      contentCol.style.transform = `translateY(${lerp(32, 0, cp)}px)`;
    }

    // 4. Location chip: pojawia sie najpozniej (50% progress)
    const lp = easeOutCubic(Math.max(0, Math.min(1, (raw - 0.5) / 0.4)));
    if (locationChip) {
      locationChip.style.opacity   = lp;
      locationChip.style.transform = `translateY(${lerp(12, 0, lp)}px)`;
    }
  }

  if (heroSection && window.innerWidth > 1024) {
    window.addEventListener('scroll', updateHeroAnim, { passive: true });
    window.addEventListener('resize', updateHeroAnim, { passive: true });
    updateHeroAnim();
  }

  // ─── INQUIRY PANEL (widget zapytaj o apartament) ────────
  const inquiryPanel   = document.getElementById('inquiryPanel');
  const inquiryClose   = document.getElementById('inquiryClose');
  const inquiryTab     = document.getElementById('inquiryTab');
  const inquiryForm    = document.getElementById('inquiryForm');
  const inquirySuccess = document.getElementById('inquirySuccess');

  if (inquiryPanel && inquiryClose && inquiryTab) {
    inquiryClose.addEventListener('click', () => {
      inquiryPanel.classList.add('is-hidden');
      inquiryTab.classList.add('is-visible');
    });
    inquiryTab.addEventListener('click', () => {
      inquiryPanel.classList.remove('is-hidden');
      inquiryTab.classList.remove('is-visible');
    });
  }

  if (inquiryForm && inquirySuccess) {
    inquiryForm.addEventListener('submit', e => {
      e.preventDefault();
      const rodoEl = inquiryForm.querySelector('#inquiry-rodo');
      if (rodoEl && !rodoEl.checked) {
        alert('Proszę zaakceptować zgodę na przetwarzanie danych.');
        return;
      }
      if (!inquiryForm.checkValidity()) { inquiryForm.reportValidity(); return; }
      const submitBtn = inquiryForm.querySelector('.inquiry-submit');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Wysyłanie…'; }
      setTimeout(() => {
        inquirySuccess.style.display = 'block';
        if (submitBtn) submitBtn.style.display = 'none';
      }, 800);
    });
  }

  // ─── FORMULARZ ──────────────────────────────────────────
  const form = document.getElementById('kontakt-form');
  if (form) {
    // Wypełnij dropdown jeśli URL ma parametr ?lokal=
    const urlParams = new URLSearchParams(window.location.search);
    const lokalParam = urlParams.get('lokal');
    if (lokalParam) {
      const select = document.getElementById('lokal-select');
      if (select) {
        Array.from(select.options).forEach(opt => {
          if (opt.value.startsWith(lokalParam) || opt.text.startsWith(lokalParam)) {
            opt.selected = true;
          }
        });
      }
    }

    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const rodo = form.querySelector('#rodo');
      if (rodo && !rodo.checked) {
        alert('Proszę zaakceptować zgodę na przetwarzanie danych osobowych.');
        return;
      }
      btn.textContent = 'Wysyłanie…';
      btn.disabled = true;
      setTimeout(() => {
        form.innerHTML = `
          <div style="text-align:center;padding:48px 0;">
            <div style="font-size:56px;margin-bottom:16px;color:var(--color-accent)">✓</div>
            <h3 style="color:var(--color-primary);font-size:22px;margin-bottom:10px">Dziękujemy za kontakt!</h3>
            <p style="color:var(--color-muted)">Odezwiemy się w ciągu 24 godzin roboczych.</p>
          </div>`;
      }, 1200);
    });
  }

});
