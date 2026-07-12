/**
 * Portfolio — Ajith K · "Terminal" theme
 * Boot-sequence hero, keyboard navigation, scroll reveal, counters, nav.
 */
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ── THEME TOGGLE ── */
  const root = document.documentElement;
  const themeBtn = $('#theme-toggle');
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('theme', t); } catch (e) {}
    if (themeBtn) themeBtn.setAttribute('aria-pressed', String(t === 'light'));
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'light' ? '#F4F1EA' : '#0A0B0D');
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      setTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    });
  }

  /* ── NAV: scroll state + active link ── */
  const nav = $('#main-nav');
  const setNav = () => nav && nav.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', setNav, { passive: true });
  setNav();

  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');
  function highlight() {
    const y = window.scrollY + 140;
    let current = '';
    sections.forEach(s => { if (y >= s.offsetTop) current = s.id; });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current}`));
  }
  window.addEventListener('scroll', highlight, { passive: true });
  highlight();

  /* ── MOBILE MENU ── */
  const menuBtn = $('#menu-btn');
  const mobile  = $('#mobile-menu');
  let menuOpen = false;
  if (menuBtn && mobile) {
    const toggle = (open) => {
      menuOpen = open;
      mobile.classList.toggle('open', open);
      menuBtn.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
      menuBtn.setAttribute('aria-expanded', String(open));
    };
    menuBtn.addEventListener('click', () => toggle(!menuOpen));
    $$('a', mobile).forEach(a => a.addEventListener('click', () => toggle(false)));
  }

  /* ── SMOOTH SCROLL ── */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const t = $(id);
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.offsetTop - 70, behavior: reduced ? 'auto' : 'smooth' });
    });
  });

  /* ── SCROLL REVEAL ── */
  const revealEls = $$('.reveal');
  if (!reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('revealed'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  /* ── STAT COUNTERS ── */
  const counters = $$('.counter[data-target]');
  if (counters.length && !reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target, target = parseInt(el.dataset.target, 10);
        let n = 0;
        const step = Math.max(1200 / target, 40);
        const tick = () => { n++; el.textContent = n; if (n < target) setTimeout(tick, step); };
        setTimeout(tick, step);
        io.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(el => io.observe(el));
  } else {
    counters.forEach(el => { el.textContent = el.dataset.target; });
  }

  /* ── HERO STATS: staggered entrance ── */
  const heroStatus = $('.hero-status');
  if (heroStatus) {
    if (reduced || !('IntersectionObserver' in window)) {
      heroStatus.classList.add('stats-in');
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if (en.isIntersecting) { heroStatus.classList.add('stats-in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.4 });
      io.observe(heroStatus);
    }
  }

  /* ── BOOT TERMINAL (signature) ── */
  const boot = $('#boot');
  if (boot && !reduced) {
    const seq = [
      { cmd: true,  parts: [['prompt', 'ajith@portfolio'], ['plain', ':'], ['path', '~'], ['plain', '$ whoami']] },
      { cmd: false, parts: [['out', '→ Ajith K · Backend Engineer']] },
      { cmd: true,  parts: [['prompt', 'ajith@portfolio'], ['plain', ':'], ['path', '~'], ['plain', '$ cat stack.txt']] },
      { cmd: false, parts: [['key', '→ Django · FastAPI · Odoo 18 · PostgreSQL']] },
      { cmd: true,  parts: [['prompt', 'ajith@portfolio'], ['plain', ':'], ['path', '~'], ['plain', '$ ./status --now']] },
      { cmd: false, parts: [['ok', '● open to freelance & full-time']] },
    ];
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    async function typeSeg(lineEl, cls, text) {
      const span = document.createElement('span');
      if (cls !== 'plain') span.className = cls;
      lineEl.appendChild(span);
      for (const ch of text) { span.textContent += ch; await sleep(18 + Math.random() * 28); }
    }

    async function run() {
      boot.textContent = '';
      for (const line of seq) {
        const el = document.createElement('span');
        el.className = 'tl';
        boot.appendChild(el);
        if (line.cmd) {
          for (const [cls, text] of line.parts) await typeSeg(el, cls, text);
          await sleep(340);
        } else {
          el.innerHTML = line.parts.map(([c, t]) =>
            `<span class="${c}">${t.replace('&', '&amp;')}</span>`).join('');
          await sleep(520);
        }
      }
      const last = document.createElement('span');
      last.className = 'tl';
      last.innerHTML = '<span class="prompt">ajith@portfolio</span>:<span class="path">~</span>$ <span class="term-cursor"></span>';
      boot.appendChild(last);
    }
    // small delay so the hero settles first
    setTimeout(run, 650);
  }

  /* ── KEYBOARD NAVIGATION + HELP MODAL ── */
  const overlay = $('#kb-overlay');
  const openHelp  = () => overlay && overlay.classList.add('open');
  const closeHelp = () => overlay && overlay.classList.remove('open');
  $('#kbd-open')?.addEventListener('click', openHelp);
  $('#kb-close')?.addEventListener('click', closeHelp);
  overlay?.addEventListener('click', e => { if (e.target === overlay) closeHelp(); });

  const jump = { h: '#home', a: '#about', s: '#services', k: '#skills', w: '#work', c: '#contact', e: '#experience' };
  let gArmed = false, gTimer;
  const go = (sel) => { const t = $(sel); if (t) window.scrollTo({ top: t.offsetTop - 70, behavior: reduced ? 'auto' : 'smooth' }); };

  document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.metaKey || e.ctrlKey || e.altKey) return;

    if (e.key === 'Escape') { closeHelp(); return; }
    if (e.key === '?') { e.preventDefault(); overlay.classList.toggle('open'); return; }

    if (gArmed && jump[e.key]) { e.preventDefault(); go(jump[e.key]); gArmed = false; clearTimeout(gTimer); return; }

    if (e.key === 'g') { gArmed = true; clearTimeout(gTimer); gTimer = setTimeout(() => gArmed = false, 900); return; }
    if (e.key === 'j') { window.scrollBy({ top: 140, behavior: 'smooth' }); return; }
    if (e.key === 'k') { window.scrollBy({ top: -140, behavior: 'smooth' }); return; }
    gArmed = false;
  });

  /* ── BACK TO TOP ── */
  const top = $('#back-to-top');
  if (top) {
    window.addEventListener('scroll', () => top.classList.toggle('visible', window.scrollY > 500), { passive: true });
    top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
  }

  /* ── CONSOLE EASTER EGG ── */
  console.log('%c$ whoami', 'font-family:monospace;font-size:13px;color:#FFB000;');
  console.log('%c→ Ajith K · Backend Engineer — Django · FastAPI · Odoo', 'font-family:monospace;font-size:12px;color:#9AA0AB;');
  console.log('%c→ github.com/ajithkalidasan', 'font-family:monospace;font-size:12px;color:#FFB000;');
})();
