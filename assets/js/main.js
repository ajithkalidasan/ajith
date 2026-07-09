/**
 * Portfolio — Ajith K
 * Main JavaScript: typewriter, scroll reveal, code window, nav, counters
 */

(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ────────────────────────────────
     NAV — scroll effect + active link
  ──────────────────────────────── */

  const nav = document.getElementById('main-nav');

  function updateNav() {
    if (window.scrollY > 60) {
      nav?.classList.add('scrolled');
    } else {
      nav?.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  function highlightNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
        const id = section.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  /* ────────────────────────────────
     MOBILE MENU
  ──────────────────────────────── */

  const menuBtn    = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  let menuOpen     = false;

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      menuOpen = !menuOpen;
      mobileMenu.classList.toggle('open', menuOpen);
      menuBtn.innerHTML = menuOpen
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
      menuBtn.setAttribute('aria-expanded', menuOpen);
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuOpen = false;
        mobileMenu.classList.remove('open');
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ────────────────────────────────
     SMOOTH SCROLL
  ──────────────────────────────── */

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      window.scrollTo({
        top: target.offsetTop - offset,
        behavior: reducedMotion ? 'auto' : 'smooth'
      });
    });
  });

  /* ────────────────────────────────
     SCROLL REVEAL
  ──────────────────────────────── */

  if (!reducedMotion) {
    const revealEls = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  /* ────────────────────────────────
     TYPEWRITER
  ──────────────────────────────── */

  const typeEl = document.getElementById('typewriter');
  const roles  = ['Django Developer', 'FastAPI Engineer', 'Odoo ERP Specialist', 'Backend Developer'];
  let roleIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  let speed    = 100;
  let timer;

  function type() {
    if (!typeEl) return;
    const current = roles[roleIdx];

    if (reducedMotion) {
      typeEl.textContent = current;
      roleIdx = (roleIdx + 1) % roles.length;
      timer = setTimeout(type, 3000);
      return;
    }

    if (deleting) {
      typeEl.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      speed = 45;
    } else {
      typeEl.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      speed = 95;
    }

    if (!deleting && charIdx === current.length) {
      speed = 2200;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting = false;
      roleIdx  = (roleIdx + 1) % roles.length;
      speed    = 400;
    }

    timer = setTimeout(type, speed);
  }

  if (typeEl) setTimeout(type, 800);
  window.addEventListener('beforeunload', () => clearTimeout(timer));

  /* ────────────────────────────────
     STAT COUNTERS
  ──────────────────────────────── */

  const counterEls = document.querySelectorAll('.counter[data-target]');

  if (counterEls.length && !reducedMotion) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const dur    = 1400;
        const step   = dur / target;
        let current  = 0;

        const tick = () => {
          current++;
          el.textContent = current;
          if (current < target) setTimeout(tick, step);
        };

        setTimeout(tick, step);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => counterObserver.observe(el));
  } else {
    counterEls.forEach(el => { el.textContent = el.dataset.target; });
  }

  /* ────────────────────────────────
     CODE WINDOW FILE SWITCHER
  ──────────────────────────────── */

  const codeTabs     = document.querySelectorAll('.code-tab');
  const codeSnippets = document.querySelectorAll('.code-snippet');
  let codeInterval;
  let currentCode = 0;

  function switchCode(idx) {
    codeTabs.forEach((t, i) => t.classList.toggle('active', i === idx));
    codeSnippets.forEach((s, i) => {
      s.classList.toggle('active', i === idx);
    });
    currentCode = idx;
  }

  codeTabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      clearInterval(codeInterval);
      switchCode(i);
      startCodeCycle();
    });
  });

  function startCodeCycle() {
    if (reducedMotion) return;
    codeInterval = setInterval(() => {
      switchCode((currentCode + 1) % codeTabs.length);
    }, 4500);
  }

  if (codeTabs.length) startCodeCycle();

  /* ────────────────────────────────
     BACK TO TOP
  ──────────────────────────────── */

  const backToTop = document.getElementById('back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ────────────────────────────────
     CONSOLE EASTER EGG
  ──────────────────────────────── */

  console.log('%c⚡ Ajith K — Backend Developer', 'font-size:15px;font-weight:bold;color:#4D80FF;');
  console.log('%cPython · Odoo · Django · PostgreSQL', 'font-size:12px;color:#8B96B5;');
  console.log('%c→ https://github.com/ajithkalidasan', 'font-size:12px;color:#4D80FF;');

})();
