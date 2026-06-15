/* =========================================================
   NetGenX — Core interactions
   Nav, custom cursor, scroll reveal, count-up stats,
   hero word reveal, mobile menu, page veil, form.
   ========================================================= */
(function () {
  'use strict';
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ---------- Page veil (load flash) ---------- */
  const veil = document.querySelector('.page-veil');
  if (veil) {
    window.addEventListener('load', () => setTimeout(() => veil.classList.add('hidden'), 250));
    // safety: never trap the page
    setTimeout(() => veil.classList.add('hidden'), 2500);
  }

  /* ---------- Sticky nav state ---------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const closeMenu = () => { document.body.classList.remove('menu-open'); toggle && toggle.setAttribute('aria-expanded', 'false'); };
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.querySelectorAll('.mobile-menu a').forEach((a) => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- Custom cursor ---------- */
  if (!isTouch && !prefersReduced) {
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.append(dot, ring);
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    const hoverSel = 'a, button, .card, input, select, textarea, .partner, [data-cursor]';
    document.addEventListener('mouseover', (e) => { if (e.target.closest(hoverSel)) document.body.classList.add('cursor-hover'); });
    document.addEventListener('mouseout', (e) => { if (e.target.closest(hoverSel)) document.body.classList.remove('cursor-hover'); });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-l, .reveal-r, .reveal-scale, [data-stagger], [data-draw]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add('in-view');
        // stagger children
        if (el.hasAttribute('data-stagger')) {
          const step = parseInt(el.getAttribute('data-stagger') || '90', 10) || 90;
          Array.from(el.children).forEach((c, i) => { c.style.transitionDelay = (i * step) + 'ms'; });
        }
        obs.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  /* ---------- SVG path draw lengths ---------- */
  document.querySelectorAll('.draw-path').forEach((path) => {
    try { const len = path.getTotalLength(); path.style.setProperty('--len', Math.ceil(len)); } catch (e) {}
  });

  /* ---------- Count-up stats ---------- */
  const formatNum = (val, decimals) => {
    if (decimals > 0) return val.toFixed(decimals);
    return Math.round(val).toLocaleString('en-US');
  };
  const countEls = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && countEls.length) {
    const cio = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.getAttribute('data-count'));
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const decimals = (el.getAttribute('data-count').split('.')[1] || '').length;
        if (prefersReduced) { el.textContent = prefix + formatNum(target, decimals) + suffix; obs.unobserve(el); return; }
        const dur = 1600; let startT = null;
        const tick = (t) => {
          if (startT === null) startT = t;
          const p = Math.min((t - startT) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + formatNum(target * eased, decimals) + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = prefix + formatNum(target, decimals) + suffix;
        };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });
    countEls.forEach((el) => cio.observe(el));
  }

  /* ---------- Hero word reveal ---------- */
  const headlines = document.querySelectorAll('[data-words]');
  headlines.forEach((h) => {
    const html = h.innerHTML;
    // split on <br> to preserve line breaks, wrap each line in a mask
    const lines = html.split(/<br\s*\/?>/i);
    h.innerHTML = lines.map((line) => {
      const words = line.trim().split(/\s+/).filter(Boolean).map((w) => `<span class="line-mask"><span class="reveal-word">${w}</span></span>`).join(' ');
      return words;
    }).join('<br>');
    const words = h.querySelectorAll('.reveal-word');
    if (prefersReduced) { words.forEach((w) => w.classList.add('in')); return; }
    requestAnimationFrame(() => {
      words.forEach((w, i) => { w.style.transitionDelay = (i * 70 + 200) + 'ms'; setTimeout(() => w.classList.add('in'), 0); });
      // trigger after layout
      setTimeout(() => words.forEach((w) => w.classList.add('in')), 30);
    });
  });

  /* ---------- Active nav link by path ---------- */
  const here = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-link[data-page]').forEach((a) => {
    if (a.getAttribute('data-page') === here) a.setAttribute('aria-current', 'page');
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = '2026'; });

  /* ---------- Contact form (demo handler) ---------- */
  const form = document.querySelector('form[data-demo-form]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const ok = form.querySelector('.form-success');
      if (ok) { ok.classList.add('show'); ok.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'center' }); }
      form.reset();
    });
  }
})();
