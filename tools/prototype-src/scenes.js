/* ============================================================
   Scene renderers: photo mockups (pseudo-perspective projection of the
   same plan coordinates), segmentation overlay, outward shots, aerial,
   to-scale plan, plant card illustrations.
   ============================================================ */
var UID = 0;
function uid(p) { UID += 1; return (p || 'u') + UID; }
function rnd(seed) { var x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); }
function f1(n) { return Math.round(n * 10) / 10; }
function pts(a) { return a.map(function (p) { return f1(p[0]) + ',' + f1(p[1]); }).join(' '); }
function pathD(a, close) { return 'M' + a.map(function (p) { return f1(p[0]) + ',' + f1(p[1]); }).join('L') + (close ? 'Z' : ''); }

function projector(W) {
  var cx = W * 0.45;
  return function (x, y, z) {
    z = z || 0;
    var s = 8.4 * (1 + y / 40);
    var v = 300 + 5.0 * y + 0.03 * y * y;
    return [320 + (x - cx) * s, v - z * s * 0.92, s];
  };
}

/* smooth bumpy dome (shrubs, perennials) */
function dome(u, v, rw, rh, seed, n) {
  n = n || 18;
  var a = [[u - rw, v]];
  for (var i = 0; i <= n; i++) {
    var t = Math.PI - (Math.PI * i / n);
    var k = 1 + 0.07 * Math.sin(seed * 3.7 + i * 2.1) + 0.04 * Math.sin(seed + i * 5.3);
    a.push([u + rw * Math.cos(t) * (0.98 + 0.03 * Math.sin(i + seed)), v - rh * Math.sin(t) * k]);
  }
  a.push([u + rw, v]);
  return pathD(a, true);
}
function blob(u, v, r, seed, n) {
  n = n || 14; var a = [];
  for (var i = 0; i < n; i++) { var t = i / n * Math.PI * 2; var k = 1 + 0.13 * Math.sin(seed * 2.3 + i * 1.9) + 0.07 * Math.sin(seed + i * 3.7); a.push([u + r * Math.cos(t) * k, v + r * 0.82 * Math.sin(t) * k]); }
  return pathD(a, true);
}

/* one plant in the photo */
function glyph(sp, u, v, s, year, seed, extra) {
  var p = PLANTS[sp]; var g = growth(p, year);
  var w = g.w * s, h = g.h * s * 0.92, o = '';
  var cls = 'gl g-' + sp + (extra || '');
  switch (sp) {
    case 'cer': {
      var th = h * 0.42;
      o += '<path d="M' + f1(u) + ',' + f1(v) + ' C' + f1(u - 1) + ',' + f1(v - th * 0.5) + ' ' + f1(u + 2) + ',' + f1(v - th * 0.8) + ' ' + f1(u) + ',' + f1(v - th) + ' M' + f1(u) + ',' + f1(v - th * 0.7) + ' L' + f1(u - w * 0.18) + ',' + f1(v - th * 1.15) + ' M' + f1(u + 1) + ',' + f1(v - th * 0.8) + ' L' + f1(u + w * 0.2) + ',' + f1(v - th * 1.2) + '" class="trunk"/>';
      o += '<path d="' + blob(u - w * 0.16, v - h * 0.66, w * 0.3, seed) + '" class="can2"/>';
      o += '<path d="' + blob(u + w * 0.17, v - h * 0.7, w * 0.29, seed + 2) + '" class="can2"/>';
      o += '<path d="' + blob(u, v - h * 0.8, w * 0.34, seed + 4) + '" class="can1"/>';
      for (var i = 0; i < 9; i++) o += '<circle cx="' + f1(u + (rnd(seed + i) - 0.5) * w * 0.7) + '" cy="' + f1(v - h * (0.55 + rnd(seed + i * 3) * 0.4)) + '" r="' + f1(Math.max(1.2, w * 0.022)) + '" class="leafhl"/>';
      break;
    }
    case 'jun': {
      var a = [[u - w * 0.5, v]];
      for (var j = 0; j <= 10; j++) { var t = j / 10; a.push([u - w * 0.5 * (1 - t * 0.85) * (1 + 0.08 * Math.sin(j * 2 + seed)), v - h * t]); }
      for (var j2 = 10; j2 >= 0; j2--) { var t2 = j2 / 10; a.push([u + w * 0.5 * (1 - t2 * 0.85) * (1 + 0.08 * Math.cos(j2 * 2 + seed)), v - h * t2]); }
      o += '<path d="' + pathD(a, true) + '" class="col"/>';
      for (var k = 0; k < 8; k++) o += '<path d="M' + f1(u - w * 0.25 + rnd(seed + k) * w * 0.5) + ',' + f1(v - h * (0.1 + k * 0.1)) + ' l' + f1(w * 0.12) + ',' + f1(-h * 0.05) + '" class="colhl"/>';
      break;
    }
    case 'ile': case 'gem': case 'ite': case 'jhz': case 'ams': case 'nep': {
      var hh = sp === 'jhz' ? h * 1.2 : h;
      o += '<path d="' + dome(u, v, w / 2, hh, seed) + '" class="m"/>';
      if (sp === 'ams' || sp === 'nep') { for (var q = 0; q < 10; q++) { var ux = u + (rnd(seed + q) - 0.5) * w * 0.8; o += '<path d="M' + f1(ux) + ',' + f1(v - 1) + ' q' + f1((rnd(q + seed) - 0.5) * 4) + ',' + f1(-hh * 0.6) + ' ' + f1((rnd(q * 2 + seed) - 0.5) * 6) + ',' + f1(-hh * (0.7 + rnd(q) * 0.3)) + '" class="fine"/>'; } }
      if (sp === 'nep') for (var q2 = 0; q2 < 7; q2++) o += '<ellipse cx="' + f1(u + (rnd(seed + q2 * 5) - 0.5) * w * 0.8) + '" cy="' + f1(v - hh * (0.6 + rnd(seed + q2) * 0.35)) + '" rx="' + f1(w * 0.08) + '" ry="' + f1(hh * 0.12) + '" class="fl"/>';
      if (sp === 'ite') for (var q3 = 0; q3 < 6; q3++) { var ux3 = u + (rnd(seed + q3 * 7) - 0.5) * w * 0.75, uy3 = v - hh * (0.45 + rnd(seed + q3) * 0.5); o += '<path d="M' + f1(ux3) + ',' + f1(uy3) + ' q' + f1(w * 0.05) + ',' + f1(hh * 0.12) + ' ' + f1(w * 0.12) + ',' + f1(hh * 0.18) + '" class="fl"/>'; }
      if (sp === 'ile' || sp === 'gem' || sp === 'jhz') for (var q4 = 0; q4 < 6; q4++) o += '<ellipse cx="' + f1(u + (rnd(seed + q4 * 3) - 0.5) * w * 0.7) + '" cy="' + f1(v - hh * (0.2 + rnd(seed + q4 * 9) * 0.6)) + '" rx="' + f1(Math.max(1, w * 0.05)) + '" ry="' + f1(Math.max(0.6, w * 0.025)) + '" class="hl"/>';
      break;
    }
    case 'sch': case 'pan': case 'cal': case 'spo': {
      var n = sp === 'spo' ? 14 : 11;
      for (var b = 0; b < n; b++) {
        var t3 = b / (n - 1) - 0.5;
        var top = sp === 'spo' ? h * (0.7 + 0.3 * (1 - Math.abs(t3) * 2)) : h * (0.82 + rnd(seed + b) * 0.18);
        var spread = sp === 'spo' ? w * 0.95 : w * 0.55;
        o += '<path d="M' + f1(u + t3 * w * 0.25) + ',' + f1(v) + ' Q' + f1(u + t3 * spread * 0.5) + ',' + f1(v - top * 0.55) + ' ' + f1(u + t3 * spread) + ',' + f1(v - top) + '" class="bl"/>';
      }
      if (sp === 'pan') o += '<ellipse cx="' + f1(u) + '" cy="' + f1(v - h * 0.9) + '" rx="' + f1(w * 0.34) + '" ry="' + f1(h * 0.16) + '" class="haze"/>';
      if (sp === 'cal') for (var c2 = 0; c2 < 6; c2++) { var x2 = u + (c2 / 5 - 0.5) * w * 0.4; o += '<path d="M' + f1(x2) + ',' + f1(v - h * 0.6) + ' L' + f1(x2 + (c2 - 2.5) * 0.4) + ',' + f1(v - h * 1.12) + '" class="plume"/>'; }
      break;
    }
    default: { // flowering perennials
      o += '<path d="' + dome(u, v, w * 0.45, h * 0.55, seed, 12) + '" class="base"/>';
      var nf = sp === 'sal' ? 7 : 6;
      for (var f = 0; f < nf; f++) {
        var fx = u + (f / (nf - 1) - 0.5) * w * 0.8 + (rnd(seed + f) - 0.5) * 3;
        var fy = v - h * (0.7 + rnd(seed + f * 3) * 0.3);
        o += '<path d="M' + f1(fx) + ',' + f1(v - h * 0.3) + ' L' + f1(fx) + ',' + f1(fy) + '" class="stem"/>';
        var r = Math.max(1.6, w * 0.075);
        if (sp === 'ech' || sp === 'rud') o += '<ellipse cx="' + f1(fx) + '" cy="' + f1(fy) + '" rx="' + f1(r * 1.5) + '" ry="' + f1(r * 0.75) + '" class="fl"/><circle cx="' + f1(fx) + '" cy="' + f1(fy - r * 0.3) + '" r="' + f1(r * 0.55) + '" class="ctr"/>';
        else if (sp === 'sal') o += '<path d="M' + f1(fx) + ',' + f1(fy + r * 1.6) + ' L' + f1(fx) + ',' + f1(fy - r * 1.8) + '" class="spike" style="stroke-width:' + f1(r * 0.9) + '"/>';
        else o += '<circle cx="' + f1(fx) + '" cy="' + f1(fy) + '" r="' + f1(r * (sp === 'all' ? 1.25 : 1.05)) + '" class="fl"/>';
      }
    }
  }
  return '<g class="' + cls + '">' + o + '</g>';
}

/* the house, fences and patio shared by every photo */
function sceneBase(W, P, id, before) {
  var o = '';
  o += '<defs><linearGradient id="' + id + 'sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sky-a"/><stop offset="1" class="sky-b"/></linearGradient>' +
    '<pattern id="' + id + 'sid" width="8" height="6" patternUnits="userSpaceOnUse"><rect width="8" height="6" class="siding"/><path d="M0,5.5 H8" class="siding-line"/></pattern></defs>';
  o += '<rect width="640" height="320" fill="url(#' + id + 'sky)"/>';
  // far trees
  [[40, 168, 64, 1], [130, 150, 58, 2], [250, 140, 52, 3], [390, 134, 60, 4], [520, 150, 58, 5], [610, 168, 62, 6], [330, 150, 46, 7]].forEach(function (t, i) { o += '<path d="' + blob(t[0], t[1], t[2], t[3]) + '" class="' + (i % 2 ? 'bgt1' : 'bgt2') + '"/>'; });
  // neighbor's house (left) seen over the fence
  o += '<path d="M0,196 L78,182 L78,292 L0,296 Z" class="nb-wall"/><path d="M0,182 L86,170 L78,182 L0,196 Z" class="nb-roof"/><rect x="22" y="206" width="26" height="30" class="nb-win"/><path d="M35,206 V236" class="ph-mull"/>';
  // lawn
  o += '<path d="M' + pts([P(-3, -6), P(W + 3, -6), P(W + 3, 44), P(-3, 44)]) + 'Z" class="' + (before ? 'ph-lawn-tired' : 'ph-lawn') + '"/>';
  if (!before) for (var k = 0; k < W; k += 6) o += '<path d="M' + pts([P(k, -1), P(k + 3, -1), P(k + 3, 44), P(k, 44)]) + 'Z" class="ph-stripe"/>';
  // fences
  [0, W].forEach(function (fx) {
    o += '<path d="M' + pts([P(fx, -6, 0), P(fx, 34, 0), P(fx, 34, 6), P(fx, -6, 6)]) + 'Z" class="ph-fence"/>';
    for (var y = -5; y < 34; y += 1.25) { var a = P(fx, y, 0), b = P(fx, y, 6); if (a[0] > -40 && a[0] < 680) o += '<path d="M' + f1(a[0]) + ',' + f1(a[1]) + ' L' + f1(b[0]) + ',' + f1(b[1]) + '" class="ph-fence-l"/>'; }
  });
  // house
  var h0 = P(7, 0, 0), h1 = P(W - 7, 0, 0), e0 = P(7, 0, 22), e1 = P(W - 7, 0, 22);
  o += '<path d="M' + pts([P(5, 0, 22), P(W - 5, 0, 22), P(W - 14, 0, 31.5), P(14, 0, 31.5)]) + 'Z" class="ph-roof"/>';
  o += '<path d="M' + f1(P(5, 0, 22)[0]) + ',' + f1(e0[1]) + ' H' + f1(P(W - 5, 0, 22)[0]) + '" class="ph-eave"/>';
  o += '<rect x="' + f1(h0[0]) + '" y="' + f1(e0[1]) + '" width="' + f1(h1[0] - h0[0]) + '" height="' + f1(h0[1] - e0[1]) + '" fill="url(#' + id + 'sid)"/>';
  o += '<rect x="' + f1(h0[0]) + '" y="' + f1(P(7, 0, 1.3)[1]) + '" width="' + f1(h1[0] - h0[0]) + '" height="' + f1(h0[1] - P(7, 0, 1.3)[1]) + '" class="ph-found"/>';
  var win = function (xc, wft, z0, z1) { var a = P(xc - wft / 2, 0, z1), b = P(xc + wft / 2, 0, z0); return '<rect x="' + f1(a[0]) + '" y="' + f1(a[1]) + '" width="' + f1(b[0] - a[0]) + '" height="' + f1(b[1] - a[1]) + '" class="ph-win"/><path d="M' + f1((a[0] + b[0]) / 2) + ',' + f1(a[1]) + ' V' + f1(b[1]) + ' M' + f1(a[0]) + ',' + f1((a[1] + b[1]) / 2) + ' H' + f1(b[0]) + '" class="ph-mull"/><rect x="' + f1(a[0] - 2) + '" y="' + f1(b[1]) + '" width="' + f1(b[0] - a[0] + 4) + '" height="3" class="ph-sill"/>'; };
  var pc = (P.patio ? P.patio : 37);
  [12.5, 20, W - 20.5, W - 13].forEach(function (x) { o += win(x, 4, 13.5, 19); });
  [13, 20.5].forEach(function (x) { o += win(x, 4.5, 4, 10); });
  o += win(W - 13, 4, 4.5, 9.5);
  var d0 = P(pc - 3, 0, 7.2), d1 = P(pc + 3, 0, 0);
  o += '<rect x="' + f1(d0[0]) + '" y="' + f1(d0[1]) + '" width="' + f1(d1[0] - d0[0]) + '" height="' + f1(d1[1] - d0[1]) + '" class="ph-door"/><rect x="' + f1(d0[0] + 2) + '" y="' + f1(d0[1] + 2) + '" width="' + f1((d1[0] - d0[0]) / 2 - 3) + '" height="' + f1(d1[1] - d0[1] - 3) + '" class="ph-glass"/><rect x="' + f1((d0[0] + d1[0]) / 2 + 1) + '" y="' + f1(d0[1] + 2) + '" width="' + f1((d1[0] - d0[0]) / 2 - 3) + '" height="' + f1(d1[1] - d0[1] - 3) + '" class="ph-glass"/>';
  [7.6, W - 7.6].forEach(function (x) { var a = P(x, 0, 22), b = P(x + 0.45, 0, 0); o += '<rect x="' + f1(a[0]) + '" y="' + f1(a[1]) + '" width="' + f1(b[0] - a[0]) + '" height="' + f1(b[1] - a[1]) + '" class="ph-down"/>'; });
  var gm = P(W - 6.6, 0, 3.6), gm2 = P(W - 5.6, 0, 2.2); o += '<rect x="' + f1(gm[0]) + '" y="' + f1(gm[1]) + '" width="' + f1(gm2[0] - gm[0]) + '" height="' + f1(gm2[1] - gm[1]) + '" class="ph-ac"/>';
  // AC unit beside the house (left side yard)
  var ac0 = P(2.2, -1.5, 3), ac1 = P(5.2, -1.5, 0);
  o += '<rect x="' + f1(ac0[0]) + '" y="' + f1(ac0[1]) + '" width="' + f1(ac1[0] - ac0[0]) + '" height="' + f1(ac1[1] - ac0[1]) + '" rx="2" class="ph-ac"/>';
  for (var g = 1; g < 5; g++) { var yy = ac0[1] + (ac1[1] - ac0[1]) * g / 5; o += '<path d="M' + f1(ac0[0] + 3) + ',' + f1(yy) + ' H' + f1(ac1[0] - 3) + '" class="ph-acg"/>'; }
  return o;
}

function patioSVG(des, P) {
  var pt = des.patio, o = '';
  o += '<path d="M' + pts([P(pt.x0, 0), P(pt.x1, 0), P(pt.x1, pt.d), P(pt.x0, pt.d)]) + 'Z" class="ph-paver"/>';
  for (var y = 1; y < pt.d; y += 1) { var a = P(pt.x0, y), b = P(pt.x1, y); o += '<path d="M' + f1(a[0]) + ',' + f1(a[1]) + ' L' + f1(b[0]) + ',' + f1(b[1]) + '" class="ph-joint"/>'; }
  for (var x = pt.x0 + 1.5; x < pt.x1; x += 1.5) { var c = P(x, 0), d = P(x, pt.d); o += '<path d="M' + f1(c[0]) + ',' + f1(c[1]) + ' L' + f1(d[0]) + ',' + f1(d[1]) + '" class="ph-joint"/>'; }
  var e0 = P(pt.x0, pt.d), e1 = P(pt.x1, pt.d);
  o += '<path d="M' + f1(e0[0]) + ',' + f1(e0[1]) + ' L' + f1(e1[0]) + ',' + f1(e1[1]) + ' L' + f1(e1[0]) + ',' + f1(e1[1] + 3) + ' L' + f1(e0[0]) + ',' + f1(e0[1] + 3) + 'Z" class="ph-patio-edge"/>';
  if (des.landing) { var L = des.landing; o += '<path d="M' + pts([P(L.x0, L.y0), P(L.x1, L.y0), P(L.x1, L.y1), P(L.x0, L.y1)]) + 'Z" class="ph-flag"/>'; }
  return o;
}

/* Photo mockup. o = { des, before, variant ('native' etc.), year, labels (bool), visibleBeds, straight, edgeStyle, mulch, plants (override list), highlight: [bed ids], ariaLabel, overlay ('seg') } */
function scenePhoto(o) {
  var des = o.des, W = des.W, P = projector(W); P.patio = (des.patio.x0 + des.patio.x1) / 2;
  var id = uid('sc'), s = '';
  s += sceneBase(W, P, id, o.before);
  s += patioSVG(des, P);
  var vis = { A: 1, C: 1, D: 1 };
  var labels = [];
  if (o.before) {
    s += '<path d="M' + pts([P(8, 0), P(des.patio.x0, 0), P(des.patio.x0, 1.6), P(8, 1.8)]) + 'Z" class="ph-soil"/><path d="M' + pts([P(des.patio.x1, 0), P(W - 8, 0), P(W - 8, 1.6), P(des.patio.x1, 1.6)]) + 'Z" class="ph-soil"/>';
    [[10, 1], [14, 1.2], [19, 0.9], [25, 1.1], [47, 1], [52, 1.2]].forEach(function (w, i) { var a = P(w[0], w[1]); s += '<path d="M' + f1(a[0]) + ',' + f1(a[1]) + ' l-3,-7 M' + f1(a[0]) + ',' + f1(a[1]) + ' l2,-8 M' + f1(a[0]) + ',' + f1(a[1]) + ' l5,-5" class="ph-weed"/>'; });
    [[6, 13, 30], [22, 7, 18], [44, 18, 34], [56, 9, 22], [33, 20, 40], [14, 19, 26], [3, 4, 14]].forEach(function (pch, i) { var a = P(pch[0], pch[1]); s += '<ellipse cx="' + f1(a[0]) + '" cy="' + f1(a[1]) + '" rx="' + f1(pch[2] * a[2] / 8) + '" ry="' + f1(pch[2] * a[2] / 40) + '" class="' + (i % 3 === 2 ? 'ph-dirt' : 'ph-patch') + '"/>'; });
    if (o.card) { var c0 = P(19, 13), c1 = P(21.2, 14.2); s += '<path d="M' + pts([c0, [c1[0], c0[1] - 1], c1, [c0[0], c1[1] + 1]]) + 'Z" class="ph-card"/>'; s += '<rect x="' + f1(c0[0] + 3) + '" y="' + f1(c0[1] + 1) + '" width="4" height="3" class="ph-card-m"/><rect x="' + f1(c1[0] - 7) + '" y="' + f1(c1[1] - 4) + '" width="4" height="3" class="ph-card-m"/>'; }
  } else {
    var beds = des.beds;
    Object.keys(beds).forEach(function (k) {
      if (!vis[k]) return; var b = beds[k];
      var outline = b.outline;
      if (o.straight && (k === 'A' || k === 'C')) { var x0 = k === 'A' ? 8 : des.patio.x1, x1 = k === 'A' ? des.patio.x0 : W - 8; outline = [[x0, 0], [x1, 0], [x1, b.depth], [x0, b.depth]]; }
      var pp = outline.map(function (q) { return P(q[0], q[1]); });
      s += '<path d="' + pathD(pp, true) + '" class="ph-mulch' + (o.mulch === 'charcoal' ? ' dark' : '') + '"/>';
      var front = (o.straight && (k === 'A' || k === 'C')) ? [outline[2], outline[3]] : b.front;
      var fp = front.map(function (q) { return P(q[0], q[1]); });
      var es = o.edgeStyle || 'stone';
      if (es === 'stone') { var step = 1.15; var L = polyLen(front), n = Math.floor(L / step); for (var i = 0; i <= n; i++) { var q = pointAt(front, i / n); var a = P(q[0], q[1]); s += '<ellipse cx="' + f1(a[0]) + '" cy="' + f1(a[1]) + '" rx="' + f1(a[2] * 0.62) + '" ry="' + f1(a[2] * 0.3) + '" class="' + (i % 2 ? 'ph-stone1' : 'ph-stone0') + '"/>'; } }
      else if (es === 'brick') s += '<path d="' + pathD(fp) + '" class="ph-brick"/>';
      else if (es === 'steel') s += '<path d="' + pathD(fp) + '" class="ph-steel"/>';
      else s += '<path d="' + pathD(fp) + '" class="ph-spade"/>';
      if (o.highlight && o.highlight.indexOf(k) >= 0) s += '<path d="' + pathD(pp, true) + '" class="ph-hl"/>';
    });
    // steppers and boulders (final designs)
    des.boulders.forEach(function (bd, i) { if (bd[1] > 26) return; var a = P(bd[0], bd[1]); s += '<path d="' + dome(a[0], a[1], a[2] * 1.1, a[2] * 0.9, i + 3, 10) + '" class="ph-boulder"/>'; });
    var plist = (o.plants || des.plants).filter(function (pl) { return vis[pl.bed] && pl.y < 27; }).slice().sort(function (a, b) { return a.y - b.y; });
    var nmap = o.numberMap || {};
    var first = {};
    plist.forEach(function (pl, i) {
      var a = P(pl.x, pl.y);
      var hl = (o.highlightPlants && o.highlightPlants.indexOf(pl.sp) >= 0) ? ' hot' : '';
      s += glyph(pl.sp, a[0], a[1], a[2] * 1.22, o.year == null ? 3 : o.year, i * 7.1 + pl.x, hl);
      var gg = growth(PLANTS[pl.sp], o.year == null ? 3 : o.year);
      var top = a[1] - gg.h * a[2] * 1.22 * 0.92;
      if (!first[pl.sp] || pl.y > first[pl.sp].y) first[pl.sp] = { u: a[0], v: top, y: pl.y, sp: pl.sp };
    });
    Object.keys(first).forEach(function (k) { if (nmap[k]) labels.push({ n: nmap[k], sp: k, u: first[k].u, v: Math.max(14, first[k].v - 8) }); });
  }
  if (o.overlay === 'seg') s += segOverlay(des, P);
  var aria = o.ariaLabel || '';
  return { svg: '<svg viewBox="0 0 640 400" role="img" aria-label="' + esc(aria) + '" preserveAspectRatio="xMidYMid slice">' + s + '</svg>', labels: labels };
}
function pointAt(chain, t) {
  var L = polyLen(chain), target = L * t, acc = 0;
  for (var i = 1; i < chain.length; i++) { var d = Math.hypot(chain[i][0] - chain[i - 1][0], chain[i][1] - chain[i - 1][1]); if (acc + d >= target) { var k = d ? (target - acc) / d : 0; return [chain[i - 1][0] + (chain[i][0] - chain[i - 1][0]) * k, chain[i - 1][1] + (chain[i][1] - chain[i - 1][1]) * k]; } acc += d; }
  return chain[chain.length - 1];
}

function segOverlay(des, P) {
  var W = des.W, s = '';
  var e0 = P(5, 0, 22), e1 = P(W - 5, 0, 22), r0 = P(14, 0, 31.5), r1 = P(W - 14, 0, 31.5);
  var h0 = P(7, 0, 0), h1 = P(W - 7, 0, 0);
  s += '<path d="M0,0 H640 V' + f1(e0[1] - 30) + ' H0 Z" class="sgm sgm-sky"/>';
  s += '<path d="M' + pts([e0, e1, r1, r0]) + 'Z" class="sgm sgm-roof"/>';
  s += '<path d="M' + pts([[h0[0], e0[1]], [h1[0], e1[1]], h1, h0]) + 'Z" class="sgm sgm-house"/>';
  var pc = (des.patio.x0 + des.patio.x1) / 2;
  var prot = function (xc, wft, z0, z1) { var a = P(xc - wft / 2, 0, z1), b = P(xc + wft / 2, 0, z0); return 'M' + f1(a[0]) + ',' + f1(a[1]) + 'H' + f1(b[0]) + 'V' + f1(b[1]) + 'H' + f1(a[0]) + 'Z'; };
  s += '<path d="' + [12.5, 20, W - 20.5, W - 13].map(function (x) { return prot(x, 4, 13.5, 19); }).join('') + prot(13, 4.5, 4, 10) + prot(20.5, 4.5, 4, 10) + prot(W - 13, 4, 4.5, 9.5) + prot(pc, 6, 0, 7.2) + '" class="sgm sgm-protect"/>';
  s += '<path d="M' + pts([P(0, -6, 0), P(0, 34, 0), P(0, 34, 6), P(0, -6, 6)]) + 'Z M' + pts([P(W, -6, 0), P(W, 34, 0), P(W, 34, 6), P(W, -6, 6)]) + 'Z" class="sgm sgm-fence"/>';
  var ac0 = P(2.2, -1.5, 3), ac1 = P(5.2, -1.5, 0);
  s += '<rect x="' + f1(ac0[0]) + '" y="' + f1(ac0[1]) + '" width="' + f1(ac1[0] - ac0[0]) + '" height="' + f1(ac1[1] - ac0[1]) + '" class="sgm sgm-util"/>';
  s += '<path d="M' + pts([P(8, 0), P(des.patio.x0, 0), P(des.patio.x0, 1.6), P(8, 1.8)]) + 'Z M' + pts([P(des.patio.x1, 0), P(W - 8, 0), P(W - 8, 1.6), P(des.patio.x1, 1.6)]) + 'Z" class="sgm sgm-bed"/>';
  s += '<path d="M' + pts([P(1, 0.2), P(W - 1, 0.2), P(W - 1, 30), P(1, 30)]) + 'Z" class="sgm sgm-lawn"/>';
  s += '<path d="M' + pts([P(des.patio.x0, 0), P(des.patio.x1, 0), P(des.patio.x1, des.patio.d), P(des.patio.x0, des.patio.d)]) + 'Z" class="sgm sgm-patio"/>';
  // calibration
  var a = P(des.patio.x0, des.patio.d), b = P(des.patio.x1, des.patio.d);
  s += '<path d="M' + f1(a[0]) + ',' + f1(a[1] + 9) + ' H' + f1(b[0]) + ' M' + f1(a[0]) + ',' + f1(a[1] + 3) + ' v12 M' + f1(b[0]) + ',' + f1(b[1] + 3) + ' v12" class="cal-line"/>';
  s += '<g class="cal-pin" transform="translate(' + f1(a[0]) + ' ' + f1(a[1]) + ')"><circle r="8"/><text y="3.5" text-anchor="middle">A</text></g><g class="cal-pin" transform="translate(' + f1(b[0]) + ' ' + f1(b[1]) + ')"><circle r="8"/><text y="3.5" text-anchor="middle">B</text></g>';
  var dd0 = P(pc + 3.6, 0, 7.2), dd1 = P(pc + 3.6, 0, 0);
  s += '<path d="M' + f1(dd0[0]) + ',' + f1(dd0[1]) + ' V' + f1(dd1[1]) + ' M' + f1(dd0[0] - 4) + ',' + f1(dd0[1]) + ' h8 M' + f1(dd1[0] - 4) + ',' + f1(dd1[1]) + ' h8" class="cal-line"/>';
  var chip = function (x, y, t, cls) { var w = t.length * 6.2 + 14; return '<g class="' + (cls || 'sgm-chip') + '"><rect x="' + f1(x) + '" y="' + f1(y) + '" width="' + f1(w) + '" height="18" rx="9"/><text x="' + f1(x + w / 2) + '" y="' + f1(y + 12.5) + '" text-anchor="middle">' + esc(t) + '</text></g>'; };
  s += chip(10, 10, 'sky 0.99') + chip(250, e0[1] - 24, 'roof 0.97') + chip(200, e0[1] + 30, 'house 0.98') + chip(dd0[0] + 6, dd0[1] + 12, 'door · 80 in · 2%', 'cal-tag') + chip(6, 252, 'fence 0.94') + chip(ac0[0] - 4, ac0[1] - 22, 'AC · protected') + chip(20, 350, 'lawn 0.96') + chip(P(16, 1)[0], P(16, 1)[1] + 4, 'bed 0.88') + chip((a[0] + b[0]) / 2 - 52, a[1] + 14, 'A-B 14 ft · 1%', 'cal-tag') + chip(470, 120, 'trees 0.91') + chip(h1[0] - 92, e0[1] + 70, 'protected', 'sgm-chip');
  return s;
}

/* outward shots for capture thumbnails */
function sceneOut(kind) {
  var id = uid('so'), s = '';
  s += '<defs><linearGradient id="' + id + 'k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sky-a"/><stop offset="1" class="sky-b"/></linearGradient></defs><rect width="640" height="400" fill="url(#' + id + 'k)"/>';
  [[60, 150, 70, 1], [190, 140, 60, 2], [330, 130, 66, 3], [470, 146, 62, 4], [600, 136, 70, 5]].forEach(function (t, i) { s += '<path d="' + blob(t[0], t[1], t[2], t[3]) + '" class="' + (i % 2 ? 'bgt1' : 'bgt2') + '"/>'; });
  s += '<path d="' + blob(560, 110, 120, 9) + '" class="bgt2"/><path d="M560,230 V300" class="trunk" style="stroke-width:8"/>';
  s += '<path d="M0,220 H640 V262 H0 Z" class="ph-fence"/>';
  for (var x = 6; x < 640; x += 11) s += '<path d="M' + x + ',220 V262" class="ph-fence-l"/>';
  s += '<path d="M0,262 H640 V400 H0 Z" class="ph-lawn-tired"/>';
  [[120, 320, 60], [380, 350, 80], [520, 300, 40], [250, 290, 34]].forEach(function (p, i) { s += '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="' + p[2] + '" ry="' + (p[2] / 5) + '" class="' + (i === 1 ? 'ph-dirt' : 'ph-patch') + '"/>'; });
  s += '<path d="M440,300 C470,320 520,330 560,360" class="ph-hose"/>';
  if (kind === 'window') { s += '<path d="M0,0 H640 V400 H0 Z M40,30 V370 H600 V30 Z" class="win-frame" fill-rule="evenodd"/><path d="M320,30 V370 M40,200 H600" class="win-mull"/>'; }
  return '<svg viewBox="0 0 640 400" role="img" aria-label="' + (kind === 'window' ? 'Kitchen window view of the backyard' : 'View from the back door toward the back fence, with patchy lawn and the neighbor\'s maple at right') + '" preserveAspectRatio="xMidYMid slice">' + s + '</svg>';
}

/* aerial of the parcel (feet) */
function aerialSVG(o) {
  o = o || {};
  var s = '', id = uid('ae');
  s += '<defs><pattern id="' + id + 'h" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0,0 V3" class="ae-hatch"/></pattern></defs>';
  s += '<rect x="-80" y="-40" width="300" height="230" class="ae-ground"/>';
  // neighbor lots
  [[-70, 0], [70, 0]].forEach(function (n) { s += '<rect x="' + n[0] + '" y="0" width="66" height="140" class="ae-lot"/><rect x="' + (n[0] + 9) + '" y="' + 58 + '" width="46" height="38" class="ae-roof2"/>'; });
  s += '<path d="' + blob(132, 22, 15, 3) + '" class="ae-tree"/><path d="' + blob(-40, 30, 12, 5) + '" class="ae-tree"/><path d="' + blob(170, 120, 13, 7) + '" class="ae-tree"/>';
  // street
  s += '<rect x="-80" y="152" width="300" height="26" class="ae-street"/><text x="140" y="169" class="ae-t">Glenn Ave</text>';
  // parcel
  s += '<rect x="0" y="0" width="66" height="140" class="ae-parcel"/>';
  s += '<rect x="2" y="2" width="62" height="38" class="ae-back"/>';
  s += '<rect x="9" y="40" width="48" height="40" class="ae-roof"/><rect x="40" y="80" width="18" height="22" class="ae-roof"/>';
  s += '<rect x="44" y="102" width="12" height="50" class="ae-drive"/>';
  s += '<rect x="32" y="28" width="14" height="12" class="ae-patio"/>';
  s += '<text x="33" y="20" text-anchor="middle" class="ae-t b">Backyard ≈ 62 × 38 ft</text>';
  s += '<text x="33" y="64" text-anchor="middle" class="ae-t w">1,820 sq ft</text>';
  s += '<g transform="translate(196 18)"><circle r="9" class="ae-nc"/><path d="M0,-7 L3,2 L0,0.5 L-3,2 Z" class="ae-n"/><text y="-11" text-anchor="middle" class="ae-t">N</text></g>';
  return '<svg viewBox="-80 -40 300 230" role="img" aria-label="Aerial view of the parcel at 1876 Glenn Ave: a 66 by 140 foot lot with the house footprint, the driveway to Glenn Ave and the backyard of about 62 by 38 feet highlighted">' + s + '</svg>';
}

/* number map for species present in a design (stable order) */
function numberMap(list) {
  var present = {}; list.forEach(function (pl) { present[pl.sp] = 1; });
  var m = {}, n = 0; SP_ORDER.forEach(function (k) { if (present[k]) { n += 1; m[k] = n; } });
  return m;
}

/* to-scale plan in feet. o: { year, layers, labels ('num'|'code'|'none'), nmap, highlight, warn, mini, id, aria, showSun, showUtil, pins, dims } */
function planSVG(des, o) {
  o = o || {};
  var W = des.W, D = des.D, id = uid('pl'), L = o.layers || {};
  var on = function (k) { return L[k] !== false; };
  var yr = o.year == null ? 3 : o.year;
  var s = '';
  s += '<defs><pattern id="' + id + 'g" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M5,0 H0 V5" class="pl-grid"/></pattern>' +
    '<pattern id="' + id + 'h" width="1.2" height="1.2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0,0 V1.2" class="pl-hatch"/></pattern>' +
    '<pattern id="' + id + 'p" width="2" height="1" patternUnits="userSpaceOnUse"><rect width="2" height="1" class="pl-paver"/><path d="M0,0 H2 M1,0 V1" class="pl-joint"/></pattern>' +
    '<pattern id="' + id + 'm" width="1.4" height="1.4" patternUnits="userSpaceOnUse"><rect width="1.4" height="1.4" class="pl-mulch"/><circle cx="0.4" cy="0.5" r="0.12" class="pl-mdot"/><circle cx="1.1" cy="1.1" r="0.1" class="pl-mdot"/></pattern>' +
    '<clipPath id="' + id + 'c"><rect x="0" y="0" width="' + W + '" height="' + D + '"/></clipPath></defs>';
  s += '<rect x="-7" y="-12" width="' + (W + 14) + '" height="' + (D + 20) + '" class="pl-bg"/>';
  s += '<rect x="0" y="0" width="' + W + '" height="' + D + '" class="pl-turf"/>';
  if (!o.mini) s += '<rect x="0" y="0" width="' + W + '" height="' + D + '" fill="url(#' + id + 'g)"/>';
  // sun layer
  if (on('sun') && o.showSun) {
    s += '<g clip-path="url(#' + id + 'c)"><circle cx="' + (W + 4) + '" cy="' + (D + 1) + '" r="13" class="pl-shade"/></g>';
    s += '<text x="' + (W - 6.5) + '" y="' + (D - 8.4) + '" class="pl-t s">≈3.5 h</text><text x="12" y="' + (D - 13) + '" class="pl-t s sunt">full sun 6.8-7.4 h</text>';
  }
  // site
  if (on('site')) {
    s += '<rect x="7" y="-9" width="' + (W - 14) + '" height="9" fill="url(#' + id + 'h)" class="pl-house"/>';
    if (!o.mini) s += '<text x="' + (W / 2 - 12) + '" y="-4" class="pl-t">House (existing, 2 stories)</text>';
    s += '<rect x="2" y="-4" width="3" height="3" class="pl-ac"/>' + (o.mini ? '' : '<text x="1.6" y="-5" class="pl-t s">AC</text>');
    s += '<rect x="' + des.patio.x0 + '" y="0" width="' + des.patio.w + '" height="' + des.patio.d + '" fill="url(#' + id + 'p)" class="pl-patio"/>';
    if (!o.mini) s += '<text x="' + (des.patio.x0 + 1) + '" y="' + (des.patio.d - 1.2) + '" class="pl-t s">Patio 14 × 12 (keep)</text>';
    if (des.landing) s += '<rect x="' + des.landing.x0 + '" y="' + des.landing.y0 + '" width="' + (des.landing.x1 - des.landing.x0) + '" height="' + (des.landing.y1 - des.landing.y0) + '" class="pl-flag"/>';
    s += '<path d="M0,-11 V' + D + ' H' + W + ' V-11" class="pl-lot"/>';
  }
  // utilities and pins
  if (on('util') && o.showUtil) {
    var gx = W - 6.6, gx2 = des.patio.x1, gy2 = 9;
    s += '<path d="M' + gx + ',0 L' + gx2 + ',' + gy2 + '" class="pl-gasbuf"/><path d="M' + gx + ',0 L' + gx2 + ',' + gy2 + '" class="pl-gas"/>';
    s += '<text x="' + (gx2 + 1.8) + '" y="' + (gy2 + 2.2) + '" class="pl-t s gas">Gas line · 5 ft no-tree buffer</text>';
    s += '<ellipse cx="9.5" cy="2.6" rx="3.2" ry="2" class="pl-wet"/><text x="1" y="' + (o.mini ? 6 : 7.6) + '" class="pl-t s">' + (o.mini ? '' : 'Wet spot (downspout)') + '</text>';
    s += '<circle cx="' + (W + 4) + '" cy="' + (D + 1) + '" r="13" class="pl-nbtree"/>';
  }
  // beds
  if (on('beds')) {
    Object.keys(des.beds).forEach(function (k) {
      var b = des.beds[k];
      s += '<path d="' + pathD(b.outline, true) + '" fill="url(#' + id + 'm)" class="pl-bed"/>';
      s += '<path d="' + pathD(b.front) + '" class="pl-edge"/>';
      if (o.highlight && o.highlight.indexOf(k) >= 0) s += '<path d="' + pathD(b.outline, true) + '" class="pl-hl"/>';
    });
  }
  des.steppers.forEach(function (st, i) { s += '<ellipse cx="' + f1(st[0]) + '" cy="' + f1(st[1]) + '" rx="1.15" ry="0.9" transform="rotate(' + (i * 23 % 40 - 20) + ' ' + f1(st[0]) + ' ' + f1(st[1]) + ')" class="pl-step"/>'; });
  des.boulders.forEach(function (bd, i) { s += '<path d="' + blob(bd[0], bd[1], 1.2, i + 2, 9) + '" class="pl-boulder"/>'; });
  des.lights.forEach(function (lt) { s += '<circle cx="' + lt[0] + '" cy="' + lt[1] + '" r="0.45" class="pl-light"/><circle cx="' + lt[0] + '" cy="' + lt[1] + '" r="1.4" class="pl-lightr"/>'; });
  // plants
  if (on('plants')) {
    var order = des.plants.slice().sort(function (a, b) { return (PLANTS[b.sp].kind === 'tree') - (PLANTS[a.sp].kind === 'tree'); });
    order.forEach(function (pl) {
      var p = PLANTS[pl.sp], g = growth(p, yr), r = Math.max(0.35, g.w / 2);
      var hot = o.hotSp && o.hotSp.indexOf(pl.sp) >= 0 ? ' hot' : '';
      if (p.kind === 'tree') {
        s += '<circle cx="' + f1(pl.x) + '" cy="' + f1(pl.y) + '" r="' + f1(r) + '" class="pc pc-' + pl.sp + ' can' + hot + '"/><circle cx="' + f1(pl.x) + '" cy="' + f1(pl.y) + '" r="0.5" class="pc-trunk"/>';
      } else {
        s += '<circle cx="' + f1(pl.x) + '" cy="' + f1(pl.y) + '" r="' + f1(r) + '" class="pc pc-' + pl.sp + hot + '"/>';
        if (!o.mini && (p.kind === 'shrub')) s += '<path d="M' + f1(pl.x - r * 0.5) + ',' + f1(pl.y) + ' H' + f1(pl.x + r * 0.5) + ' M' + f1(pl.x) + ',' + f1(pl.y - r * 0.5) + ' V' + f1(pl.y + r * 0.5) + '" class="pc-x"/>';
      }
      if (o.warn && pl.shade && pl.sp === 'ech') s += '<circle cx="' + f1(pl.x) + '" cy="' + f1(pl.y) + '" r="' + f1(r + 0.55) + '" class="pc-warn"/>';
    });
    if (o.warn) { var sh = des.plants.filter(function (q) { return q.shade && q.sp === 'ech'; }); if (sh.length) { var wx = sh[1].x, wy = sh[1].y - 3.4; s += '<g class="pl-warnb"><circle cx="' + f1(wx) + '" cy="' + f1(wy) + '" r="1.25"/><text x="' + f1(wx) + '" y="' + f1(wy + 0.55) + '" text-anchor="middle">!</text></g>'; } }
  }
  // labels
  if (on('labels') && o.labels && o.labels !== 'none' && on('plants')) {
    var groups = {};
    des.plants.forEach(function (pl) { var k = pl.bed + ':' + pl.sp + (pl.shade ? ':s' : ''); (groups[k] = groups[k] || []).push(pl); });
    var nm = o.nmap || numberMap(des.plants);
    Object.keys(groups).forEach(function (k) {
      var g = groups[k], sp = g[0].sp, cx = 0, cy = 0;
      g.forEach(function (q) { cx += q.x; cy += q.y; }); cx /= g.length; cy /= g.length;
      if (PLANTS[sp].kind === 'tree') { cx += 1.6; cy -= 1.6; }
      if (o.labels === 'num') {
        s += '<g class="pl-num"><circle cx="' + f1(cx) + '" cy="' + f1(cy) + '" r="' + (o.mini ? 1.35 : 1.05) + '"/><text x="' + f1(cx) + '" y="' + f1(cy + (o.mini ? 0.5 : 0.4)) + '" text-anchor="middle">' + nm[sp] + '</text></g>';
      } else {
        var t = g.length + ' ' + PLANTS[sp].code.split(' ')[0];
        var w = t.length * 0.66 + 0.8;
        s += '<g class="pl-code"><rect x="' + f1(cx - w / 2) + '" y="' + f1(cy - 0.75) + '" width="' + f1(w) + '" height="1.5" rx="0.4"/><text x="' + f1(cx) + '" y="' + f1(cy + 0.42) + '" text-anchor="middle">' + esc(t) + '</text></g>';
      }
    });
  }
  // dims, north arrow, scale bar
  if (on('dims') && o.dims !== false) {
    s += '<path d="M0,' + (D + 2.2) + ' H' + W + ' M0,' + (D + 1.2) + ' v2 M' + W + ',' + (D + 1.2) + ' v2" class="pl-dim"/><text x="' + (W / 2) + '" y="' + (D + 4.4) + '" text-anchor="middle" class="pl-t d">' + W + "'-0\"</text>";
    s += '<path d="M' + (W + 2.2) + ',0 V' + D + ' M' + (W + 1.2) + ',0 h2 M' + (W + 1.2) + ',' + D + ' h2" class="pl-dim"/><text x="' + (W + 4.6) + '" y="' + (D / 2) + '" text-anchor="middle" class="pl-t d" transform="rotate(90 ' + (W + 4.6) + ' ' + (D / 2) + ')">' + D + "'-0\"</text>";
    if (des.beds.A) { var dA = des.beds.A.depth; s += '<path d="M5.6,0 V' + dA + ' M4.8,0 h1.6 M4.8,' + dA + ' h1.6" class="pl-dim a"/><text x="4.2" y="' + (dA / 2 + 0.5) + '" text-anchor="end" class="pl-t d a">' + f1(dA) + "'</text>"; }
  }
  if (!o.mini) {
    s += '<g transform="translate(' + (W - 3) + ' -7.2) rotate(-38)"><circle r="2.1" class="pl-nc"/><path d="M0,-1.8 L0.8,0.8 L0,0.3 L-0.8,0.8 Z" class="pl-n"/></g><text x="' + (W - 3) + '" y="-9.9" text-anchor="middle" class="pl-t s">N</text>';
    s += '<g transform="translate(1 ' + (D + 3.4) + ')"><rect x="0" y="0" width="5" height="0.7" class="pl-sb1"/><rect x="5" y="0" width="5" height="0.7" class="pl-sb2"/><rect x="10" y="0" width="10" height="0.7" class="pl-sb1"/><text x="0" y="2.4" class="pl-t s">0</text><text x="9.4" y="2.4" class="pl-t s">10</text><text x="19" y="2.4" class="pl-t s">20 ft</text></g>';
  }
  var vb = o.mini ? '-3 -10 ' + (W + 9) + ' ' + (D + 16) : '-7 -12 ' + (W + 14) + ' ' + (D + 20);
  return '<svg viewBox="' + vb + '" role="img" aria-label="' + esc(o.aria || 'To-scale plan') + '"' + (o.cls ? ' class="' + o.cls + '"' : '') + '>' + s + '</svg>';
}

/* small plant illustration for plant cards */
function plantPic(sp) {
  var s = '<rect width="160" height="100" class="kb-bg"/><path d="M0,80 C40,74 120,74 160,80 V100 H0 Z" class="kb-mulch"/>';
  var p = PLANTS[sp]; var isTree = p.kind === 'tree';
  var scale = isTree ? (sp === 'jun' ? 3.0 : 2.4) : (p.h[2] > 4 ? 13 : 20);
  s += glyph(sp, 80, 84, scale, sp === 'jun' ? 8 : p.ytm, 3);
  return '<svg viewBox="0 0 160 100" class="kb-pic" role="img" aria-label="' + esc(p.common + ' illustration') + '">' + s + '</svg>';
}
