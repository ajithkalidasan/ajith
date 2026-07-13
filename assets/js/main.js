/**
 * Portfolio — Ajith K · "Modernist" theme
 * Progressive enhancement only: scroll-reveal + active nav link.
 * The page is fully functional and styled without JS.
 */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // Mark JS available so reveal elements start hidden (see styles.css).
  document.documentElement.classList.add('js');

  /* ── SCROLL REVEAL ── */
  var revealEls = $$('.reveal');
  if (!reduced && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('revealed'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('revealed'); });
  }

  /* ── ACTIVE NAV LINK ── */
  var sections = $$('main section[id]');
  var navLinks = $$('.nav-links a[href^="#"]');
  function highlight() {
    var y = window.scrollY + 140;
    var current = '';
    sections.forEach(function (s) { if (y >= s.offsetTop) current = s.id; });
    navLinks.forEach(function (l) {
      l.setAttribute('aria-current', l.getAttribute('href') === '#' + current ? 'page' : 'false');
    });
  }
  window.addEventListener('scroll', highlight, { passive: true });
  highlight();

  /* ── CONSOLE NOTE ── */
  console.log('%cAjith K — Backend Engineer', 'font-family:Archivo,sans-serif;font-size:13px;font-weight:800;color:#ec3013;');
  console.log('%cDjango · FastAPI · Odoo — github.com/ajithkalidasan', 'font-size:12px;color:#605d5d;');
})();
