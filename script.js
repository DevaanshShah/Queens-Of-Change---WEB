/* ============================================================
   Queens of Change Foundation — Volunteer Page
   Vanilla JS: dark mode · nav scroll state · reveal · counters · form
   ============================================================ */

(() => {
  'use strict';

  /* ---------- DARK MODE TOGGLE ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const STORAGE_KEY = 'qoc-theme';

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') {
    root.setAttribute('data-theme', saved);
  }
  // Otherwise: keep the default `dark` set in the HTML (hero looks best dark).

  themeToggle?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
  });

  /* ---------- NAVBAR SCROLL STATE ---------- */
  const navbar = document.querySelector('.navbar');
  const updateNav = () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  /* ---------- MOBILE NAV ---------- */
  const hamburger = document.getElementById('hamburger');
  hamburger?.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      document.body.classList.remove('nav-open');
      hamburger?.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- SCROLL REVEAL ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  /* ---------- STAT COUNTERS (Indian numbering aware) ---------- */
  const formatIndian = (n) => n.toLocaleString('en-IN');
  const formatPlain  = (n) => n.toLocaleString('en-US');

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const fmt = el.dataset.format === 'indian' ? formatIndian : formatPlain;
    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = fmt(value) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const statNums = document.querySelectorAll('.impact-num');
  if ('IntersectionObserver' in window) {
    const statIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statNums.forEach(n => statIO.observe(n));
  } else {
    statNums.forEach(animateCounter);
  }

  /* ---------- VOLUNTEER FORM ---------- */
  const form = document.getElementById('volunteerForm');
  const success = document.getElementById('formSuccess');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    form.style.transition = 'opacity .3s ease, transform .3s ease';
    form.style.opacity = '0';
    form.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      form.hidden = true;
      success.hidden = false;
      success.classList.add('is-visible', 'visible');
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 320);
  });

  /* ---------- BACK TO TOP ---------- */
  const backBtn = document.getElementById('backToTop');
  const onScroll = () => {
    if (window.scrollY > 800) {
      backBtn.hidden = false;
      requestAnimationFrame(() => backBtn.classList.add('is-visible'));
    } else {
      backBtn.classList.remove('is-visible');
      setTimeout(() => { if (window.scrollY <= 800) backBtn.hidden = true; }, 300);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  backBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- CONSOLE EASTER EGG ---------- */
  console.log(
    '%c👑 Queens of Change Foundation',
    'font: 600 16px Georgia; color: #c9a227; padding: 6px 0;'
  );
  console.log(
    '%cHer Strength. Her Story. Our Change.',
    'font: italic 13px Georgia; color: #7a1f3d;'
  );
})();
