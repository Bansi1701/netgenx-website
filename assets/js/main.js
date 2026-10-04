/* =========================================================
   NetGenX: Core interactions
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
  /* ---------- Case studies carousel ----------
     Auto-advances, but stops the moment a person is likely reading or steering:
     hover, keyboard focus, scrolled out of view, or a hidden tab. The explicit
     pause button exists because auto-moving content needs a stop control that
     works for keyboard users, not just a hover that they never trigger. */
  const casesWrap = document.querySelector('.cases-wrap');
  if (casesWrap) {
    const track = casesWrap.querySelector('.cases');
    const prevBtn = casesWrap.querySelector('.cases-prev');
    const nextBtn = casesWrap.querySelector('.cases-next');
    const playBtn = casesWrap.querySelector('.cases-play');
    const counter = casesWrap.querySelector('.cases-count');
    const cards = Array.from(track.children);
    const DELAY = 4500;
    let timer = null;
    let pausedByUser = false;

    const stepWidth = () => {
      if (cards.length < 2) return track.clientWidth;
      return cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left;
    };
    const maxScroll = () => track.scrollWidth - track.clientWidth;
    const current = () => {
      /* At the far end the track stops short of a whole card, so rounding gives
         one less than the real final stop. Report the true last index there, or
         the wrap-to-start condition can never be satisfied. */
      if (track.scrollLeft >= maxScroll() - 2) return lastIndex();
      return Math.round(track.scrollLeft / stepWidth());
    };

    /* Last index you can actually scroll to: the track stops short of
       cards.length - 1 because several cards are visible at once. */
    const lastIndex = () => Math.ceil(maxScroll() / stepWidth());

    /* Where we intend to be. A smooth scroll is still travelling when the next
       decision gets made, so steering off scrollLeft would read a stale position
       and the autoplay would never reach the end to wrap. */
    let desired = 0;

    function goTo(i) {
      const target = Math.max(0, Math.min(i, lastIndex()));
      desired = target;
      track.scrollTo({ left: Math.min(target * stepWidth(), maxScroll()) });
      /* Update from the target, not from scrollLeft: a smooth scroll has not
         landed yet, so reading scrollLeft here would leave the counter and the
         buttons a step behind, and prev would stay disabled after the first move. */
      sync(target);
    }

    function sync(idx) {
      const i = (idx === undefined) ? current() : idx;
      const last = lastIndex();
      casesWrap.classList.toggle('can-prev', i > 0);
      casesWrap.classList.toggle('can-next', i < last);
      prevBtn.disabled = i <= 0;
      nextBtn.disabled = i >= last;
      /* At the final stop the last card is fully visible, so report the total
         rather than the leftmost card's number. */
      const shown = (i >= last) ? cards.length : i + 1;
      if (counter) counter.textContent = shown + ' / ' + cards.length;
    }

    function advance() {
      /* wrap back to the first card rather than stalling at the end */
      goTo(desired >= lastIndex() ? 0 : desired + 1);
    }

    function play() {
      if (prefersReduced || pausedByUser || timer) return;
      timer = setInterval(advance, DELAY);
    }
    function halt() { if (timer) { clearInterval(timer); timer = null; } }
    /* a manual move should not be immediately overridden by the timer */
    function nudge(fn) { halt(); fn(); if (!pausedByUser) setTimeout(play, DELAY); }

    prevBtn.addEventListener('click', () => nudge(() => goTo(current() - 1)));
    nextBtn.addEventListener('click', () => nudge(() => goTo(current() + 1)));
    track.addEventListener('scroll', () => requestAnimationFrame(() => {
      desired = current();
      sync();
    }), { passive: true });

    casesWrap.addEventListener('mouseenter', halt);
    casesWrap.addEventListener('mouseleave', play);
    casesWrap.addEventListener('focusin', halt);
    casesWrap.addEventListener('focusout', () => { if (!casesWrap.contains(document.activeElement)) play(); });
    track.addEventListener('pointerdown', halt, { passive: true });

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        pausedByUser = !pausedByUser;
        playBtn.setAttribute('aria-pressed', String(pausedByUser));
        playBtn.setAttribute('aria-label', pausedByUser ? 'Resume automatic scrolling' : 'Pause automatic scrolling');
        if (pausedByUser) halt(); else play();
      });
    }

    document.addEventListener('visibilitychange', () => { document.hidden ? halt() : play(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((e) => (e.isIntersecting ? play() : halt()));
      }, { threshold: 0.25 }).observe(casesWrap);
    } else {
      play();
    }
    sync();
  }

  /* Contact form: posts to the endpoint in the form's action (a third-party form
     service, since a static host has no backend) and keeps the inline success state
     instead of handing the visitor off to the provider's own page. */
  const sentModal = document.getElementById('sent-modal');
  if (sentModal) {
    const done = sentModal.querySelector('[data-close-sent]');
    if (done) done.addEventListener('click', () => sentModal.close());
    /* click outside the card closes it, matching what the backdrop looks like it does */
    sentModal.addEventListener('click', (e) => { if (e.target === sentModal) sentModal.close(); });
  }

  const form = document.querySelector('form[data-contact-form]');
  if (form) {
    const ok = form.querySelector('.form-success');
    const bad = form.querySelector('.form-error');
    const btn = form.querySelector('button[type="submit"]');
    const btnText = btn ? btn.innerHTML : '';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (bad) bad.classList.remove('show');
      if (btn) { btn.disabled = true; btn.innerHTML = 'Sending&hellip;'; }

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form)
        });
        /* The provider answers 200 with {"success":"false"} when the sending domain
           is not activated yet, so the body decides, not the status code. Trusting
           res.ok alone would show the visitor "Thanks!" while nothing was delivered. */
        let data = {};
        try { data = await res.json(); } catch (_) {}
        if (!res.ok || String(data.success) !== 'true') {
          throw new Error(data.message || ('HTTP ' + res.status));
        }
        /* Confirm in a dialog. Anything without showModal() falls back to the
           inline message, so the visitor is never left wondering. */
        const dlg = document.getElementById('sent-modal');
        if (dlg && typeof dlg.showModal === 'function') {
          dlg.showModal();
        } else if (ok) {
          ok.classList.add('show');
          ok.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'center' });
        }
        form.reset();
      } catch (err) {
        /* never swallow it: the visitor gets the email address as a fallback */
        if (bad) bad.classList.add('show');
      } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = btnText; }
      }
    });
  }
})();
