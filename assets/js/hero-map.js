/* =========================================================
   NetGenX — Animated global-network hero background
   Re-implements the D3 world-map design (land + glowing
   cloud nodes + hub + shimmering arcs). Loads D3/topojson
   + world atlas from CDN; falls back to the static image
   if anything fails. Respects prefers-reduced-motion (the
   shimmer is paused via CSS).
   ========================================================= */
(function () {
  'use strict';
  var host = document.getElementById('hero-map');
  if (!host) return;

  function load(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = src; s.async = true; s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  Promise.all([
    load('https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js'),
    load('https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js')
  ])
    .then(function () { return fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'); })
    .then(function (r) { return r.json(); })
    .then(function (topo) { draw(topo); })
    .catch(function (e) { console.warn('[hero-map] live map unavailable, using static fallback', e); });

  function draw(topo) {
    var d3 = window.d3, topojson = window.topojson;
    if (!d3 || !topojson) return;
    var W = 2560, H = 1340;
    var feats = topojson.feature(topo, topo.objects.countries).features
      .filter(function (f) { return f.properties && f.properties.name !== 'Antarctica'; });

    host.innerHTML = '';
    var svg = d3.select(host).append('svg')
      .attr('viewBox', '0 0 ' + W + ' ' + H)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('width', '100%').attr('height', '100%')
      .attr('class', 'hero-bg-svg')
      .style('display', 'block');

    svg.append('defs').html(
      '<linearGradient id="hm-land" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#dbe8fa"/><stop offset="1" stop-color="#c5d8f3"/>' +
      '</linearGradient>' +
      '<radialGradient id="hm-hubglow">' +
        '<stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/>' +
        '<stop offset="0.35" stop-color="#cfe6ff" stop-opacity="0.75"/>' +
        '<stop offset="1" stop-color="#cfe6ff" stop-opacity="0"/>' +
      '</radialGradient>' +
      '<radialGradient id="hm-dotglow">' +
        '<stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/>' +
        '<stop offset="0.4" stop-color="#7ab6f6" stop-opacity="0.9"/>' +
        '<stop offset="1" stop-color="#7ab6f6" stop-opacity="0"/>' +
      '</radialGradient>' +
      '<filter id="hm-glow" x="-300%" y="-300%" width="700%" height="700%">' +
        '<feGaussianBlur stdDeviation="5" result="b"/>' +
        '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>' +
      '</filter>' +
      '<filter id="hm-softblur" x="-150%" y="-150%" width="400%" height="400%">' +
        '<feGaussianBlur stdDeviation="7"/>' +
      '</filter>'
    );

    var projection = d3.geoEquirectangular()
      .fitSize([W, H], { type: 'FeatureCollection', features: feats });
    var path = d3.geoPath(projection);

    // Landmasses
    svg.append('g').selectAll('path').data(feats).join('path')
      .attr('d', path)
      .attr('fill', 'url(#hm-land)')
      .attr('stroke', '#bcd4f2')
      .attr('stroke-width', 0.7)
      .attr('stroke-opacity', 0.55);

    var P = function (c) { return projection(c); };

    var nodes = {
      na: { lng: -100, lat: 42, type: 'cloud' },
      eu: { lng: 6,   lat: 49, type: 'hub' },
      af: { lng: 21,  lat: 2,  type: 'cloud' },
      as: { lng: 88,  lat: 60, type: 'cloud' },
      au: { lng: 140, lat: -28, type: 'cloud' },
      sa: { lng: -58, lat: -12, type: 'cloud' }
    };
    Object.keys(nodes).forEach(function (k) { var n = nodes[k]; var p = P([n.lng, n.lat]); n.x = p[0]; n.y = p[1]; });

    var links = [['eu','na'],['eu','af'],['eu','as'],['eu','sa'],['na','sa'],['af','au'],['as','au'],['na','as'],['af','sa'],['au','sa']];

    var arcPath = function (a, b) {
      var p1 = nodes[a], p2 = nodes[b];
      var mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
      var dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      var cy = my - dist * 0.22;
      return 'M' + p1.x + ',' + p1.y + ' Q' + mx + ',' + cy + ' ' + p2.x + ',' + p2.y;
    };

    var arcs = svg.append('g');
    arcs.append('g').attr('class', 'arc-glow').selectAll('path').data(links).join('path')
      .attr('d', function (d) { return arcPath(d[0], d[1]); })
      .attr('fill', 'none').attr('stroke', '#9cc8ff').attr('stroke-width', 7)
      .attr('stroke-linecap', 'round').attr('filter', 'url(#hm-softblur)');
    arcs.append('g').selectAll('path').data(links).join('path')
      .attr('d', function (d) { return arcPath(d[0], d[1]); })
      .attr('fill', 'none').attr('stroke', '#6fb0fb').attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.85).attr('stroke-linecap', 'round');

    // Subtle coastal sparkles
    var sparks = [[-122,52],[44,56],[120,32],[-52,62],[150,-18],[26,-30],[-78,8],[100,12]];
    var sg = svg.append('g');
    sparks.forEach(function (s) {
      var p = P(s);
      sg.append('circle').attr('cx', p[0]).attr('cy', p[1]).attr('r', 11)
        .attr('fill', 'url(#hm-dotglow)').attr('opacity', 0.55);
    });

    var CLOUD = 'M20,66 C9,66 0,57 0,46 C0,36 8,28 18,28 C20,15 31,6 45,6 C58,6 69,14 72,27 C82,28 90,36 90,46 C90,57 81,66 70,66 Z';
    var addCloud = function (x, y) {
      var s = 1.55, stem = 78, ch = 66 * s, cw = 90 * s;
      var g = svg.append('g').attr('transform', 'translate(' + x + ',' + y + ')');
      g.append('circle').attr('r', 9).attr('fill', '#4a9bf5').attr('filter', 'url(#hm-glow)');
      g.append('circle').attr('r', 4).attr('fill', '#ffffff');
      g.append('line').attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', -stem)
        .attr('stroke', '#bcd6f5').attr('stroke-width', 1.6);
      var c = g.append('g').attr('transform', 'translate(' + (-cw / 2) + ',' + (-stem - ch) + ') scale(' + s + ')');
      c.append('path').attr('d', CLOUD)
        .attr('fill', 'rgba(255,255,255,0.94)').attr('stroke', '#a9ccf2')
        .attr('stroke-width', 1.4).attr('filter', 'url(#hm-glow)');
      [30, 41, 52].forEach(function (by) {
        c.append('rect').attr('x', 24).attr('y', by).attr('width', 42).attr('height', 8).attr('rx', 2.5)
          .attr('fill', '#dbeafe').attr('stroke', '#7fb0ee').attr('stroke-width', 0.9);
        c.append('circle').attr('cx', 60).attr('cy', by + 4).attr('r', 1.8).attr('fill', '#4a9bf5');
        c.append('rect').attr('x', 28).attr('y', by + 2.5).attr('width', 14).attr('height', 3).attr('rx', 1.5).attr('fill', '#aacdf3');
      });
    };

    var addHub = function (x, y) {
      var g = svg.append('g').attr('transform', 'translate(' + x + ',' + y + ')');
      g.append('circle').attr('r', 70).attr('fill', 'url(#hm-hubglow)');
      g.append('circle').attr('r', 36).attr('fill', 'url(#hm-hubglow)');
      [[-90,0,90,0],[0,-90,0,90],[-64,-64,64,64],[-64,64,64,-64]].forEach(function (r) {
        g.append('line').attr('x1', r[0]).attr('y1', r[1]).attr('x2', r[2]).attr('y2', r[3])
          .attr('stroke', '#cfe6ff').attr('stroke-width', 1.4).attr('stroke-opacity', 0.55);
      });
      g.append('circle').attr('r', 7).attr('fill', '#ffffff').attr('filter', 'url(#hm-glow)');
    };

    Object.keys(nodes).forEach(function (k) {
      var n = nodes[k];
      if (n.type === 'cloud') addCloud(n.x, n.y); else addHub(n.x, n.y);
    });

    // live map drew successfully -> hide the static fallback
    var wrap = host.closest('.hero-bg');
    if (wrap) wrap.classList.add('has-live-map');
  }
})();
