/* =========================================================
   NetGenX — Cinematic Engine
   Lenis smooth scroll + GSAP ScrollTrigger driven parallax,
   pinned horizontal gallery, scrubbed kinetic manifesto,
   marquee, 3D tilt, spotlight, magnetic buttons, progress.
   Pure progressive enhancement — everything degrades safely.
   ========================================================= */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var desktop = function () { return window.matchMedia('(min-width: 861px)').matches; };

  /* ---------- Inject ambient FX layers ---------- */
  function el(cls) { var d = document.createElement('div'); d.className = cls; d.setAttribute('aria-hidden', 'true'); return d; }
  var progress = el('scroll-progress');
  document.body.appendChild(progress);
  if (!reduce) {
    document.body.appendChild(el('fx-aurora'));
    document.body.appendChild(el('fx-grain'));
  }

  /* ---------- Marquee: clone track for seamless loop ---------- */
  document.querySelectorAll('.marquee-track').forEach(function (track) {
    track.innerHTML += track.innerHTML;
  });

  /* ---------- Scroll progress bar ---------- */
  function setProgress(scrollY) {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? Math.min(scrollY / h, 1) : 0;
    progress.style.width = (p * 100) + '%';
  }

  if (reduce) {
    var hl = document.getElementById('hero-logo');
    if (hl && hl.pauseAnimations) hl.pauseAnimations();   // freeze SMIL logo animation
    setProgress(window.scrollY);
    window.addEventListener('scroll', function () { setProgress(window.scrollY); }, { passive: true });
    return;
  }

  /* ---------- Smooth scroll (Lenis) ---------- */
  var lenis = null;
  var Lenis = window.Lenis;
  if (Lenis && !reduce) {
    lenis = new Lenis({
      duration: 1.1,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6
    });
    document.documentElement.classList.add('lenis');
    lenis.on('scroll', function (e) { setProgress(e.animatedScroll != null ? e.animatedScroll : window.scrollY); });
    // smooth in-page anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      a.addEventListener('click', function (ev) {
        var t = document.querySelector(id);
        if (t) { ev.preventDefault(); lenis.scrollTo(t, { offset: -80 }); }
      });
    });
  } else {
    window.addEventListener('scroll', function () { setProgress(window.scrollY); }, { passive: true });
  }
  setProgress(window.scrollY);

  /* ---------- GSAP wiring ---------- */
  var gsap = window.gsap;
  var ST = window.ScrollTrigger;
  var hasGSAP = !!(gsap && ST);

  // Lenis needs a rAF pump. If GSAP is present we let its ticker drive it
  // (better sync with ScrollTrigger); otherwise run our own loop so smooth
  // scroll never freezes when GSAP fails to load.
  if (lenis && !hasGSAP) {
    var rafLoop = function (t) { lenis.raf(t); requestAnimationFrame(rafLoop); };
    requestAnimationFrame(rafLoop);
  }

  if (hasGSAP) {
    document.body.classList.add('cine-on');
    gsap.registerPlugin(ST);
    if (lenis) {
      lenis.on('scroll', ST.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    /* Hero: fade + rise as it leaves, layered parallax on children */
    var hero = document.querySelector('.hero');
    if (hero) {
      gsap.to('.hero-inner', {
        yPercent: -12, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
      });
    }

    /* Generic parallax */
    gsap.utils.toArray('[data-parallax]').forEach(function (node) {
      var amt = parseFloat(node.getAttribute('data-parallax')) || 60;
      var trig = node.closest('section') || node;
      gsap.fromTo(node, { y: amt }, {
        y: -amt, ease: 'none',
        scrollTrigger: { trigger: trig, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* Pinned horizontal pillars gallery */
    var pillarsWrap = document.querySelector('[data-pillars]');
    if (pillarsWrap) {
      var track = pillarsWrap.querySelector('.pillars-track');
      var dots = document.querySelectorAll('.pillars-progress span');
      var mm = gsap.matchMedia();
      mm.add('(min-width: 1025px)', function () {
        pillarsWrap.classList.add('is-pinned');
        var dist = function () { return Math.max(0, track.scrollWidth - pillarsWrap.clientWidth); };
        var tw = gsap.to(track, {
          x: function () { return -dist(); },
          ease: 'none',
          scrollTrigger: {
            trigger: pillarsWrap,
            start: 'top top',
            end: function () { return '+=' + dist(); },
            pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true,
            onUpdate: function (self) {
              if (!dots.length) return;
              var idx = Math.round(self.progress * (dots.length - 1));
              dots.forEach(function (d, i) { d.style.background = i <= idx ? 'var(--accent-cyan)' : 'var(--border-strong)'; });
            }
          }
        });
        return function () { pillarsWrap.classList.remove('is-pinned'); gsap.set(track, { x: 0 }); };
      });
    }

    /* Pinned scrubbing manifesto — words light up as you scroll */
    var man = document.querySelector('[data-manifesto]');
    if (man) {
      var words = man.querySelectorAll('.manifesto-text .w');
      if (words.length) {
        man.classList.add('is-scrub');
        var mm2 = gsap.matchMedia();
        mm2.add('(min-width: 1025px)', function () {
          var tl = gsap.to(words, {
            opacity: 1, filter: 'blur(0px)', stagger: 0.4, ease: 'none',
            scrollTrigger: { trigger: man, start: 'top top', end: '+=110%', scrub: 0.4, pin: true, anticipatePin: 1, invalidateOnRefresh: true }
          });
          return function () { gsap.set(words, { opacity: 1, filter: 'blur(0px)' }); };
        });
        mm2.add('(max-width: 1024px)', function () {
          gsap.to(words, {
            opacity: 1, filter: 'blur(0px)', stagger: 0.08, ease: 'none',
            scrollTrigger: { trigger: man, start: 'top 80%', end: 'bottom 60%', scrub: 0.4 }
          });
        });
      }
    }

    /* Section reveals — hand the base .reveal set a richer, scrubless entrance */
    gsap.utils.toArray('[data-cine-reveal]').forEach(function (node) {
      gsap.from(node, {
        y: 60, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: node, start: 'top 85%' }
      });
    });

    window.addEventListener('load', function () { ST.refresh(); });
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(function () { ST.refresh(); }); }
  }

  /* ---------- 3D tilt + spotlight on cards & pillars ---------- */
  if (fine) {
    document.body.classList.add('tilt-on');
    var tiltables = document.querySelectorAll('.card:not(.form-card):not(.info-card), .pillar');
    tiltables.forEach(function (card) {
      card.classList.add('spot');
      var rect = null;
      card.addEventListener('mouseenter', function () { rect = card.getBoundingClientRect(); });
      card.addEventListener('mousemove', function (e) {
        if (!rect) rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        card.style.setProperty('--mx', (px * 100) + '%');
        card.style.setProperty('--my', (py * 100) + '%');
        var max = 5;
        card.style.setProperty('--rx', ((px - 0.5) * max * 2).toFixed(2) + 'deg');
        card.style.setProperty('--ry', (-(py - 0.5) * max * 2).toFixed(2) + 'deg');
      });
      card.addEventListener('mouseleave', function () {
        rect = null;
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });

    /* ---------- Magnetic primary buttons ---------- */
    document.querySelectorAll('.btn.btn-primary, [data-magnetic]').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + (x * 0.22).toFixed(1) + 'px,' + (y * 0.32).toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }
})();
