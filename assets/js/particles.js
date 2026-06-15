/* =========================================================
   NetGenX — Flow Field "Data Currents" (canvas)
   Streamlines advected through an evolving pseudo-noise flow
   field. Silky trails, occasional bright data-packet pulses,
   cursor-driven eddies. Replaces the common dots-network look.
   DPR-aware · pauses off-screen/hidden · respects reduced motion.
   ========================================================= */
(function () {
  'use strict';
  var canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ctx = canvas.getContext('2d', { alpha: true });
  var TWO_PI = Math.PI * 2;

  // brand palette (rgb tuples)
  var BLUE = [37, 99, 235];
  var SKY = [14, 165, 233];
  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function rgba(c, a) { return 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + a + ')'; }

  var W = 0, H = 0, DPR = 1, t = 0;
  var parts = [];
  var mouse = { x: -9999, y: -9999, active: false };
  var raf = null, running = false;

  var TRAIL = 16;        // points kept per streamline
  var FIELD = 0.0016;    // spatial frequency of the flow field
  var MOUSE_R = 190;     // cursor influence radius

  function count() {
    var area = (window.innerWidth * window.innerHeight) / 1000;
    return Math.max(40, Math.min(prefersReduced ? 60 : 300, Math.round(area / 5.2)));
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }

  // smooth, slowly-evolving angle field built from layered sinusoids
  function flow(x, y) {
    var a = Math.sin(x * FIELD + t * 0.00028)
          + Math.cos(y * FIELD * 1.25 - t * 0.00022)
          + Math.sin((x + y) * FIELD * 0.6 + t * 0.0004)
          + 0.6 * Math.cos((x - y) * FIELD * 1.8 - t * 0.00015);
    return a * 1.35; // radians
  }

  function spawn(p, seeded) {
    p.x = Math.random() * W;
    p.y = Math.random() * H;
    p.life = 0;
    p.max = 140 + Math.random() * 180;
    p.pulse = Math.random() < 0.08;
    p.speed = (p.pulse ? 1.7 : 0.7 + Math.random() * 0.7);
    p.col = mix(BLUE, SKY, Math.random());
    p.alpha = (p.pulse ? 0.85 : 0.30 + Math.random() * 0.28);
    p.w = (p.pulse ? 2.0 : 0.7 + Math.random() * 0.9);
    p.trail = [{ x: p.x, y: p.y }];
    if (seeded) { for (var i = 0; i < TRAIL; i++) step(p, 16); } // pre-grow a trail
  }

  function step(p, dt) {
    var f = dt / 16.67;
    var ang = flow(p.x, p.y);
    var vx = Math.cos(ang) * p.speed;
    var vy = Math.sin(ang) * p.speed;

    if (mouse.active) {
      var dx = p.x - mouse.x, dy = p.y - mouse.y;
      var d = Math.hypot(dx, dy);
      if (d < MOUSE_R && d > 0.01) {
        var k = (1 - d / MOUSE_R);
        // swirl (tangential) + gentle outward push -> eddies around the cursor
        vx += (-dy / d) * k * 2.4 + (dx / d) * k * 0.8;
        vy += (dx / d) * k * 2.4 + (dy / d) * k * 0.8;
      }
    }

    p.x += vx * f; p.y += vy * f;
    p.trail.push({ x: p.x, y: p.y });
    if (p.trail.length > TRAIL) p.trail.shift();
    p.life += f;

    var m = 30;
    if (p.life > p.max || p.x < -m || p.x > W + m || p.y < -m || p.y > H + m) spawn(p, false);
  }

  function drawTrail(p) {
    var tr = p.trail;
    if (tr.length < 2) return;
    var head = tr[tr.length - 1], tail = tr[0];
    var g = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
    g.addColorStop(0, rgba(p.col, 0));
    g.addColorStop(1, rgba(p.col, p.alpha));

    // soft glow pass
    ctx.strokeStyle = rgba(p.col, p.alpha * 0.16);
    ctx.lineWidth = p.w * 3.2;
    trace(tr);
    // crisp core pass
    ctx.strokeStyle = g;
    ctx.lineWidth = p.w;
    trace(tr);

    if (p.pulse) { // glowing packet head
      ctx.beginPath();
      ctx.arc(head.x, head.y, p.w * 1.5, 0, TWO_PI);
      ctx.fillStyle = rgba(mix(p.col, [255, 255, 255], 0.4), Math.min(1, p.alpha + 0.1));
      ctx.fill();
    }
  }
  function trace(tr) {
    ctx.beginPath();
    ctx.moveTo(tr[0].x, tr[0].y);
    for (var i = 1; i < tr.length; i++) ctx.lineTo(tr[i].x, tr[i].y);
    ctx.stroke();
  }

  function frame(now) {
    t = now || 0;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < parts.length; i++) {
      if (!prefersReduced) step(parts[i], 16.67);
      drawTrail(parts[i]);
    }
    if (running) raf = requestAnimationFrame(frame);
  }

  function seed() {
    var n = count();
    parts = [];
    for (var i = 0; i < n; i++) { var p = {}; spawn(p, true); parts.push(p); }
  }

  function start() {
    if (running) return;
    running = true;
    if (prefersReduced) { frame(0); running = false; return; }
    raf = requestAnimationFrame(frame);
  }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.isIntersecting ? start() : stop(); });
    }, { threshold: 0 }).observe(canvas);
  }
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { resize(); seed(); }, 160);
  });

  var heroEl = canvas.closest('.hero') || canvas.parentElement;
  heroEl.addEventListener('mousemove', function (e) {
    var r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;
  });
  heroEl.addEventListener('mouseleave', function () { mouse.active = false; mouse.x = mouse.y = -9999; });

  resize();
  seed();
  start();
})();
