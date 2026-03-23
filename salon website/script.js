/* ══════════════════════════════════════════════
   UNIQUE BEAUTY SALON — SCRIPT
   Scroll animations · Count-up · Navbar · Menu
══════════════════════════════════════════════ */

(function () {

  /* ── NAVBAR scroll shadow ─────────────────── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks  = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── HAMBURGER ────────────────────────────── */
  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () =>
    hamburger.classList.contains('open') ? closeMenu() : openMenu()
  );

  mobileLinks.forEach(l => l.addEventListener('click', closeMenu));

  document.addEventListener('click', (e) => {
    if (hamburger.classList.contains('open') && !navbar.contains(e.target)) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) closeMenu();
  });

  /* Active nav link */
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  /* ── SCROLL ANIMATIONS ────────────────────── */
  // Repeated every time element enters/leaves viewport

  const SELECTORS = [
    '.animate-up',
    '.animate-card',
    '.animate-left',
    '.animate-right',
    '.animate-hero-left',
    '.animate-hero-right',
    '.animate-stat',
  ].join(', ');

  const animEls = document.querySelectorAll(SELECTORS);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Trigger count-up for stats
        if (entry.target.classList.contains('animate-stat')) {
          countUp(entry.target);
        }
      } else {
        entry.target.classList.remove('in-view');
        // Reset stat number so it counts again next scroll
        if (entry.target.classList.contains('animate-stat')) {
          const numEl = entry.target.querySelector('.stat-num');
          if (numEl) numEl.textContent = '0';
        }
      }
    });
  }, { threshold: 0.15 });

  animEls.forEach(el => observer.observe(el));

  /* ── COUNT-UP ANIMATION ───────────────────── */
  function countUp(statEl) {
    const numEl  = statEl.querySelector('.stat-num');
    if (!numEl) return;

    const target   = parseFloat(numEl.dataset.target);
    const isFloat  = target % 1 !== 0;
    const duration = 1400;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = target * eased;

      numEl.textContent = isFloat
        ? current.toFixed(1)
        : Math.floor(current).toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        numEl.textContent = isFloat
          ? target.toFixed(1)
          : target.toLocaleString();
      }
    }

    requestAnimationFrame(step);
  }

  /* ── Hero animations fire on load ────────── */
  window.addEventListener('load', () => {
    document.querySelectorAll('.animate-hero-left, .animate-hero-right')
      .forEach(el => el.classList.add('in-view'));
  });

})();