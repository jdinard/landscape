/* ============================================================
   Rootline AI design walkthrough: core model (no DOM)
   Geometry is in feet. x = 0 at the left fence, y = 0 at the house wall,
   y = D at the back lot line. One model feeds the plan, the photo
   mockup, the takeoff, the estimate, the proposal and the POs.
   ============================================================ */
var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
var money = function (n, cents) { var v = Math.abs(n); var s = v.toLocaleString('en-US', { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 }); return (n < 0 ? '-$' : '$') + s; };
var num = function (n, d) { return Number(n).toLocaleString('en-US', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); };
var r2 = function (n) { return Math.round(n * 100) / 100; };
var ceilTo = function (n, step) { return Math.ceil(n / step - 1e-9) * step; };

/* ---------- Plant Knowledge Base sample (Central Ohio Region profiles) ---------- */
var PLANTS = {
  cer: { code: 'CER CAN', bot: 'Cercis canadensis', cv: '', common: 'eastern redbud', kind: 'tree', size: '1.5" cal B&B', h: [8, 20, 25], w: [5, 18, 25], ytm: 20, rate: 'moderate', deer: 'B', native: 'oh', rr: 5, sun: 'Full sun to part shade', bloom: 'Magenta-pink, April, before the leaves', water: 'Moderate', note: 'Proven small tree for Central Ohio; tolerates our clay if it is not waterlogged.', care: ['Water deeply once a week through the first summer (drip zone 2 covers it).', 'Prune only to remove crossing branches, right after bloom.', 'Keep mulch 3 in from the trunk.'], why: 'A native small tree with spring color that stays in scale with a 38 ft yard.' },
  jun: { code: 'JUN TAY', bot: 'Juniperus virginiana', cv: "'Taylor'", common: 'eastern red cedar (columnar)', kind: 'tree', size: '6-7 ft B&B', h: [6.5, 22, 25], w: [2, 3.5, 4], ytm: 15, rate: 'moderate', deer: 'B', native: 'oh', rr: 4, sun: 'Full sun', bloom: 'Evergreen; blue berry-like cones on female plants', water: 'Low once established', note: 'Narrow native evergreen for screening. Cedar-apple rust host: keep away from apples and crabapples.', care: ['Water weekly for the first two summers.', 'No shearing needed: it grows narrow on its own.', 'Check for bagworms in June.'], why: 'Year-round privacy from the neighbor on the left in a 4 ft wide footprint.' },
  ile: { code: 'ILE SH', bot: 'Ilex glabra', cv: "'Shamrock'", common: 'inkberry', kind: 'shrub', size: '#3', h: [1.5, 3.5, 4], w: [1.5, 3.5, 4], ytm: 6, rate: 'moderate', deer: 'B', native: 'na', rr: 4, sun: 'Full sun to part shade', bloom: 'Evergreen; small black berries', water: 'Moderate; tolerates wet clay', note: 'Tolerates our wet clay; tip-prune in spring to keep it full.', care: ['Tip-prune in early spring; never shear in fall.', 'Berries are rated mild for dogs in the KB: planted along the house, away from the dog run.'], why: 'Evergreen structure along the foundation that deer seldom touch.' },
  gem: { code: 'ILE GB', bot: 'Ilex glabra', cv: "'Gem Box'", common: 'compact inkberry', kind: 'shrub', size: '#3', h: [1.2, 2.4, 2.5], w: [1.2, 2.4, 2.5], ytm: 6, rate: 'slow', deer: 'B', native: 'na', rr: 4, sun: 'Full sun to part shade', bloom: 'Evergreen, fine-textured', water: 'Moderate', note: 'Boxwood stand-in for low formal edges.', care: ['Light trim in late spring if you want a crisp edge.'], why: 'A clipped-looking evergreen line without boxwood blight risk.' },
  ite: { code: 'ITE LH', bot: 'Itea virginica', cv: "'Little Henry'", common: 'Virginia sweetspire', kind: 'shrub', size: '#3', h: [1.2, 2.5, 3], w: [1.2, 3, 3.5], ytm: 5, rate: 'moderate', deer: 'B', native: 'na', rr: 4, sun: 'Full sun to part shade', bloom: 'White fragrant spikes in June; red-purple fall color', water: 'Moderate to wet', note: 'Happy in the wet spot by the downspout.', care: ['Cut out a few of the oldest stems in late winter.', 'Spreads slowly by suckers: pull extras in spring.'], why: 'Handles the soggy clay by your left downspout and colors up in fall.' },
  sch: { code: 'SCH SO', bot: 'Schizachyrium scoparium', cv: "'Standing Ovation'", common: 'little bluestem', kind: 'grass', size: '#1', h: [0.8, 2.6, 3], w: [0.5, 1.3, 1.5], ytm: 3, rate: 'fast', deer: 'A', native: 'oh', rr: 5, sun: 'Full sun', bloom: 'Blue-green summer, copper-red fall', water: 'Low once established', note: 'Upright selection that does not flop. In heavy clay we set crowns slightly high.', care: ['Cut back to 4 in in March.', 'No fertilizer needed.'], why: 'Native prairie grass, deer leave it alone, and it stands up through winter.' },
  ech: { code: 'ECH PWB', bot: 'Echinacea purpurea', cv: "'Pow Wow Wild Berry'", common: 'coneflower', kind: 'perennial', size: '#1', h: [0.8, 2, 2.2], w: [0.6, 1.6, 1.8], ytm: 3, rate: 'fast', deer: 'B', native: 'oh', rr: 5, sun: 'Full sun', bloom: 'Berry-pink, June to September', water: 'Low to moderate', note: 'Reliable bloomer in Central Ohio; young buds are sometimes nibbled.', care: ['Leave seed heads for goldfinches; cut back in spring.', 'Divide every 4 years if it gets crowded.'], why: 'Long summer bloom for pollinators; a nativar of an Ohio native.' },
  ams: { code: 'AMS HUB', bot: 'Amsonia hubrichtii', cv: '', common: 'threadleaf bluestar', kind: 'perennial', size: '#2', h: [1, 2.6, 3], w: [1, 2.8, 3], ytm: 4, rate: 'moderate', deer: 'A', native: 'na', rr: 5, sun: 'Full sun to part shade', bloom: 'Pale blue stars in May; gold fall color', water: 'Low', note: 'Milky sap: deer and rabbits avoid it.', care: ['Cut back by a third after bloom if it flops.', 'Long-lived: no dividing needed.'], why: 'Feathery texture all season and the best gold fall color in the palette.' },
  pan: { code: 'PAN NW', bot: 'Panicum virgatum', cv: "'Northwind'", common: 'switchgrass', kind: 'grass', size: '#3', h: [2, 5, 5.5], w: [1, 2.2, 2.5], ytm: 3, rate: 'fast', deer: 'A', native: 'oh', rr: 5, sun: 'Full sun', bloom: 'Airy plumes in August', water: 'Low to moderate; tolerates wet', note: 'Ramrod-straight native grass for the back of a border.', care: ['Cut to 6 in in late winter.', 'Divide after 5 years if the center thins.'], why: 'A tall native screen along the back line that never needs staking.' },
  mon: { code: 'MON CG', bot: 'Monarda fistulosa', cv: "'Claire Grace'", common: 'wild bergamot', kind: 'perennial', size: '#1', h: [0.8, 3, 3.5], w: [0.7, 2, 2.5], ytm: 3, rate: 'fast', deer: 'A', native: 'oh', rr: 4, sun: 'Full sun', bloom: 'Lavender, July to August', water: 'Low', note: 'Mildew-resistant selection of an Ohio native; aromatic leaves deter deer.', care: ['Optional: cut back by half in early June for a bushier plant.', 'Thin stems every 3 years for air flow.'], why: 'A bee magnet that deer avoid: it replaced the phlox after your deer edit.' },
  phl: { code: 'PHL JE', bot: 'Phlox paniculata', cv: "'Jeana'", common: 'garden phlox', kind: 'perennial', size: '#1', h: [0.8, 3, 3.5], w: [0.6, 2, 2.2], ytm: 3, rate: 'fast', deer: 'C', native: 'oh', rr: 5, sun: 'Full sun', bloom: 'Lavender-pink, July to September', water: 'Moderate', note: 'Butterfly favorite with strong mildew resistance.', care: ['Deadhead for a second flush.'], why: 'Long, fragrant bloom that butterflies love. Deer rating C: occasionally severely damaged.' },
  cal: { code: 'CAL KF', bot: 'Calamagrostis × acutiflora', cv: "'Karl Foerster'", common: 'feather reed grass', kind: 'grass', size: '#3', h: [2, 4.5, 5], w: [1, 2, 2], ytm: 3, rate: 'fast', deer: 'A', native: 'no', rr: 5, sun: 'Full sun', bloom: 'Tan plumes from June', water: 'Moderate; tolerates clay', note: 'Vertical accent that holds its shape all winter.', care: ['Cut to 4 in in March.'], why: 'Strong vertical lines for a clean modern look.' },
  all: { code: 'ALL MIL', bot: 'Allium', cv: "'Millenium'", common: 'ornamental onion', kind: 'perennial', size: '#1', h: [0.6, 1.5, 1.6], w: [0.6, 1.3, 1.5], ytm: 3, rate: 'moderate', deer: 'A', native: 'no', rr: 5, sun: 'Full sun', bloom: 'Rose-purple globes, July to August', water: 'Low', note: 'Perennial Plant of the Year 2018; tidy foliage all season.', care: ['Cut seed heads after bloom if you want no seedlings.'], why: 'Crisp globes of color in a tidy mass.' },
  nep: { code: 'NEP WL', bot: 'Nepeta × faassenii', cv: "'Walker's Low'", common: 'catmint', kind: 'perennial', size: '#1', h: [0.8, 2.3, 2.5], w: [1, 3, 3], ytm: 2, rate: 'fast', deer: 'A', native: 'no', rr: 5, sun: 'Full sun', bloom: 'Blue-violet, May to September with a trim', water: 'Low', note: 'Shear after the first flush for repeat bloom.', care: ['Shear by half in late June.'], why: 'Soft cottage froth along the edge that deer avoid.' },
  rud: { code: 'RUD GS', bot: 'Rudbeckia fulgida', cv: "'Goldsturm'", common: 'black-eyed Susan', kind: 'perennial', size: '#1', h: [0.8, 2.2, 2.5], w: [0.8, 2, 2.5], ytm: 2, rate: 'fast', deer: 'B', native: 'oh', rr: 5, sun: 'Full sun to part sun', bloom: 'Gold, July to September', water: 'Moderate', note: 'Spreads into a drift; easy to share.', care: ['Divide every 3-4 years.'], why: 'Late-summer gold that keeps the cottage look going.' },
  sal: { code: 'SAL CAR', bot: 'Salvia nemorosa', cv: "'Caradonna'", common: 'meadow sage', kind: 'perennial', size: '#1', h: [0.8, 1.8, 2], w: [0.6, 1.5, 1.8], ytm: 2, rate: 'fast', deer: 'A', native: 'no', rr: 5, sun: 'Full sun', bloom: 'Violet spikes, May to July', water: 'Low', note: 'Dark stems, long bloom with deadheading.', care: ['Cut back after the first flush.'], why: 'Vertical violet spikes for early summer.' },
  spo: { code: 'SPO HET', bot: 'Sporobolus heterolepis', cv: '', common: 'prairie dropseed', kind: 'grass', size: '#1', h: [0.6, 2, 2.5], w: [0.6, 2, 2.5], ytm: 4, rate: 'slow', deer: 'A', native: 'oh', rr: 4, sun: 'Full sun', bloom: 'Fine fountain; airy, scented seed heads in fall', water: 'Low', note: 'Slow to establish in heavy clay; plant crowns slightly high.', care: ['Cut back in March. Otherwise leave it alone.'], why: 'The lowest-maintenance native grass we grow.' },
  jhz: { code: 'JUN BC', bot: 'Juniperus horizontalis', cv: "'Blue Chip'", common: 'creeping juniper', kind: 'shrub', size: '#3', h: [0.4, 0.8, 1], w: [1.5, 5, 6], ytm: 6, rate: 'moderate', deer: 'B', native: 'na', rr: 4, sun: 'Full sun', bloom: 'Evergreen groundcover, plum in winter', water: 'Low', note: 'Needs sun and drainage; keep it out of the wet corner.', care: ['No pruning; pull grass out of the mat in spring.'], why: 'An evergreen mat that replaces mowing and weeding.' }
};
var SP_ORDER = ['cer', 'jun', 'ile', 'gem', 'ite', 'pan', 'cal', 'ams', 'sch', 'spo', 'mon', 'phl', 'ech', 'rud', 'nep', 'sal', 'all', 'jhz'];
var DEER_TXT = { A: 'A · rarely damaged', B: 'B · seldom severely damaged', C: 'C · occasionally severely damaged', D: 'D · frequently severely damaged' };
var NATIVE_TXT = { oh: 'Native to Ohio', na: 'North American native (not Ohio)', no: 'Not native' };

/* size at a design year (logistic growth, DS-3D-03) */
function growth(p, year) {
  if (year <= 0) return { h: p.h[0], w: p.w[0] };
  var k = { slow: 5, moderate: 6.5, fast: 8 }[p.rate] || 6;
  var t = Math.min(1, year / p.ytm);
  var g = 1 / (1 + Math.exp(-k * (t - 0.45)));
  var g0 = 1 / (1 + Math.exp(k * 0.45));
  var gn = (g - g0) / (1 - g0);
  return { h: p.h[0] + (p.h[2] - p.h[0]) * gn, w: p.w[0] + (p.w[2] - p.w[0]) * gn };
}

/* ---------- Geometry helpers ---------- */
function catmull(pts, seg) {
  seg = seg || 8;
  if (pts.length < 3) return pts.slice();
  var out = [];
  for (var i = 0; i < pts.length - 1; i++) {
    var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || pts[i + 1];
    for (var j = 0; j < seg; j++) {
      var t = j / seg, t2 = t * t, t3 = t2 * t;
      out.push([
        0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
      ]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}
function polyLen(pts) { var L = 0; for (var i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; }
function polyArea(pts) { var a = 0; for (var i = 0; i < pts.length; i++) { var p = pts[i], q = pts[(i + 1) % pts.length]; a += p[0] * q[1] - q[0] * p[1]; } return Math.abs(a / 2); }

/* ---------- The design ----------
   p = { W, D, dA, dB, dC, bedD (bool), cerIn ('C' widget | 'B' final), phase ('widget'|'final'),
         deeper, deerSwap, fix (shade fix), tier ('essential'|'signature'|'showcase') } */
function makeDesign(p) {
  var W = p.W, D = p.D, sx = W / 62;
  var dA = p.dA, dB = p.dB, dC = p.dC;
  var patio = { x0: Math.round(W * 0.6 - 7), w: 14, d: 12 };
  patio.x1 = patio.x0 + patio.w;
  var house = { x0: 7, x1: W - 7 };
  var beds = {};
  // Bed A: house bed, left of the patio
  var aFront = catmull([[8, dA * 0.8], [12.5, dA * 1.03], [18.5, dA * 0.93], [24.5, dA * 1.05], [patio.x0, dA]]);
  beds.A = { id: 'A', name: 'House bed', front: aFront, outline: [[8, 0], [patio.x0, 0]].concat(aFront.slice().reverse()), edge: polyLen([[8, 0], [8, dA * 0.8]]) + polyLen(aFront), sun: '6.8 h · afternoon-heavy', depth: dA };
  // Bed C: patio bed, right of the patio
  var cx1 = W - 8;
  var cFront = catmull([[patio.x1, dC], [patio.x1 + (cx1 - patio.x1) * 0.35, dC * 0.94], [patio.x1 + (cx1 - patio.x1) * 0.7, dC * 1.05], [cx1, dC * 0.8]]);
  beds.C = { id: 'C', name: 'Patio bed', front: cFront, outline: [[patio.x1, 0], [cx1, 0]].concat(cFront.slice().reverse()), edge: polyLen(cFront) + dC * 0.8, sun: '7.2 h · full sun', depth: dC };
  // Bed B: rear border along the back lot line
  var bul = p.cerIn === 'B' ? 1.42 : 1.0;
  var bFront = catmull([[2, D - dB * 0.85], [9 * sx, D - dB * 1.0], [19 * sx, D - dB * 0.9], [29 * sx, D - dB * 1.04], [39 * sx, D - dB * (1 + (bul - 1) * 0.85)], [46 * sx, D - dB * bul], [53 * sx, D - dB * 0.98], [W - 2, D - dB * 0.82]]);
  beds.B = { id: 'B', name: 'Rear border', front: bFront, outline: [[2, D]].concat(bFront).concat([[W - 2, D]]), edge: polyLen(bFront), sun: '7.4 h west · 3.5 h east end', depth: dB };
  if (p.bedD) {
    var y0 = D * 10 / 38, y1 = D * 22.4 / 38;
    var dFront = catmull([[0, y0], [4.2, y0 - 0.3], [7.6, y0 + 2.2], [8.4, (y0 + y1) / 2], [7.6, y1 - 2.3], [4, y1 + 0.2], [0, y1]]);
    beds.D = { id: 'D', name: 'Privacy bed', front: dFront, outline: dFront.slice(), edge: polyLen(dFront), sun: '6.1 h', depth: 8.4 };
  }
  var bedArea = 0, edge = 0;
  Object.keys(beds).forEach(function (k) { var b = beds[k]; b.area = polyArea(b.outline); bedArea += b.area; edge += b.edge; });

  /* plants: [sp, bed, x, y] in feet */
  var P = [];
  var add = function (sp, bed, x, y) { P.push({ sp: sp, bed: bed, x: x, y: y }); };
  var midA = (3 + dA - 1) / 2;
  // Bed A
  add('ite', 'A', 9.6, 2.4); add('ite', 'A', 12.0, 3.8); add('ite', 'A', 9.9, dA - 1.6);
  [15.5, 19.5, 23.5, 27.5].forEach(function (x) { add('ile', 'A', x, 3.0); });
  var schA = p.deeper ? [14.6, 16.6, 18.6, 20.6, 22.6, 24.6, 26.6] : [14.6, 18.6, 22.6, 26.6];
  schA.forEach(function (x, i) { add('sch', 'A', x, midA + (i % 2 ? 0.35 : -0.25)); });
  [13.5, 16, 18.5, 21, 23.5, 26, 28.5].forEach(function (x, i) { add('ech', 'A', x, dA - 1.0 + (i % 2 ? 0.25 : 0)); });
  // Bed C (x scaled from 44..54)
  var cxp = function (x) { return patio.x1 + (x - 44) * (cx1 - patio.x1) / 10; };
  var mid = p.deerSwap ? 'mon' : 'phl';
  if (p.cerIn === 'C') add('cer', 'C', cxp(52.4), 3.0);
  [45.8, 48.4, p.cerIn === 'C' ? 47.1 : 51.2].forEach(function (x, i) { add(mid, 'C', cxp(x), (p.cerIn === 'C' && i === 2) ? dC - 2.6 : 2.4); });
  [45.2, 47.4, 49.6, 51.8, 53.2].forEach(function (x, i) { add('ech', 'C', cxp(x), dC - (i % 2 ? 0.9 : 1.2) - (i === 4 ? 0.6 : 0)); });
  // Bed B
  var by = function (v) { return D - v; };
  if (p.cerIn === 'B') add('cer', 'B', 44 * sx, by(4.6));
  [5, 10.5, 16, 21.5, 27, 32.5, 38].forEach(function (x) { add('pan', 'B', x * sx, by(1.6)); });
  [7.5, 12.5, 17.5, 22.5].forEach(function (x, i) { add(mid, 'B', x * sx, by(3.4 + (i % 2 ? 0.3 : 0))); });
  [[26, 3.4], [30, 3.0], [34, 3.5], [49, 2.0], [52.5, 2.3], [55.5, 1.8], [58.2, 2.4], [39.5, 2.2]].forEach(function (a) { add('ams', 'B', a[0] * sx, by(a[1])); });
  [4.5, 7, 9.5, 12, 14.5, 17, 19.5, 22, 24.5].forEach(function (x, i) { add('sch', 'B', x * sx, by(dB - 1.0 + (i % 2 ? 0.25 : 0))); });
  [[28, 5.0], [31, 5.3], [34, 4.9]].forEach(function (a) { add('ech', 'B', a[0] * sx, by(Math.min(a[1], dB - 0.8))); });
  [[54.6, 4.4], [56.6, 3.9], [58.4, 4.6]].forEach(function (a) { add(p.fix ? 'ite' : 'ech', 'B', a[0] * sx, by(Math.min(a[1], dB - 1.0)), true); P[P.length - 1].shade = true; });
  // Bed D
  if (p.bedD) {
    var yd = function (y) { return y * D / 38; };
    add('jun', 'D', 3.4, yd(16.2));
    [[6.2, 12.6], [6.8, 15.2], [6.6, 17.8], [5.6, 20.4], [2.8, 20.6]].forEach(function (a) { add('sch', 'D', a[0], yd(a[1])); });
  }
  P.forEach(function (pl, i) { pl.id = 'p' + i; });

  // tier extras (hardscape accents)
  var steppers = [], boulders = [], landing = null, lights = [];
  var tier = p.tier || 'signature';
  if (p.phase === 'final') boulders = [[36.5 * sx, D - 3.8], [41 * sx, D - 2.0], [11 * sx, D - 4.9]];
  if (p.phase === 'final' && tier !== 'essential') {
    // sandstone steppers from the patio corner to the rear border
    for (var i = 0; i < 9; i++) { var t = i / 8; steppers.push([patio.x0 + 3 - t * 6 + Math.sin(t * 3.1) * 2.2, patio.d + 1.6 + t * (D - dB * 1.05 - patio.d - 2.6)]); }
  }
  if (p.phase === 'final' && tier === 'showcase') {
    landing = { x0: patio.x0 + 5, x1: patio.x1, y0: patio.d, y1: patio.d + 4 };
    boulders.push([57 * sx, D - 3.4]);
  }
  if (p.lights) lights = [[patio.x0 - 0.6, 13.5], [24, 22], [22.5, 28], [33, D - 6.6], [47, D - 6.9], [56, 7.2]];
  return { p: p, W: W, D: D, patio: patio, house: house, beds: beds, plants: P, bedArea: bedArea, edge: edge, steppers: steppers, boulders: boulders, landing: landing, lights: lights };
}

function counts(des) { var c = {}; des.plants.forEach(function (pl) { c[pl.sp] = (c[pl.sp] || 0) + 1; }); return c; }
function countsByBed(des) { var c = {}; des.plants.forEach(function (pl) { (c[pl.bed] = c[pl.bed] || {}); c[pl.bed][pl.sp] = (c[pl.bed][pl.sp] || 0) + 1; }); return c; }

/* ---------- Tier container sizes and unit costs (Greenleaf Price Book, sample) ---------- */
var SIZES = {
  essential: { cer: ['1.25" cal B&B', 138], jun: ['5-6 ft B&B', 158], ile: ['#2', 19.5], ite: ['#2', 18.5], pan: ['#2', 13.25], ams: ['#1', 9.5], sch: ['#1', 9.25], ech: ['#1', 9.75], mon: ['#1', 9.25] },
  signature: { cer: ['1.5" cal B&B', 165], jun: ['6-7 ft B&B', 189], ile: ['#3', 27.5], ite: ['#3', 26], pan: ['#3', 17.5], ams: ['#2', 14.25], sch: ['#1', 9.25], ech: ['#1', 9.75], mon: ['#1', 9.25] },
  showcase: { cer: ['2" cal B&B, multi-stem', 225], jun: ['7-8 ft B&B', 205], ile: ['#5', 38], ite: ['#5', 36], pan: ['#3', 17.5], ams: ['#2', 14.25], sch: ['#1', 9.25], ech: ['#1', 9.75], mon: ['#1', 9.25] }
};
var INSTALL_HRS = { tree: 2.0, '#5': 0.55, '#3': 0.40, '#2': 0.25, '#1': 0.15 };
var LABOR = 34.20, CLAY = 1.20, MARGIN = 0.42;

function takeoff(des) {
  var W = des.W, D = des.D;
  var patioA = des.patio.w * des.patio.d + (des.landing ? (des.landing.x1 - des.landing.x0) * (des.landing.y1 - des.landing.y0) : 0);
  var stepA = des.steppers.length * 3.4;
  var lawn = W * D - des.bedArea - patioA - stepA;
  var mulch = ceilTo(des.bedArea * 3 / 324 * 1.05, 0.5);
  var compost = ceilTo(des.bedArea * 2 / 324 * 1.15, 0.5);
  var edgeLF = Math.round(des.edge);
  var pieces = Math.ceil(edgeLF * 1.02 / 16);
  var stakes = Math.ceil(edgeLF * 12 / 30);
  var c = counts(des);
  return { bedArea: des.bedArea, lawn: lawn, mulch: mulch, compost: compost, edgeLF: edgeLF, pieces: pieces, stakes: stakes, counts: c, plants: des.plants.length, topsoil: ceilTo(lawn * 1 / 324 * 1.15, 0.5), sodSf: lawn * 1.05, pallets: Math.ceil(lawn * 1.05 / 450), steppers: des.steppers.length, boulders: des.boulders.length, landing: des.landing ? (des.landing.x1 - des.landing.x0) * (des.landing.y1 - des.landing.y0) : 0, lights: des.lights.length, drip: Math.round(des.bedArea * 0.75) };
}

/* ---------- Estimate engine (one pricing engine for Studio, Estimate and Proposal) ----------
   opts: { tier, sodRate } */
function estimate(des, opts) {
  opts = opts || {};
  var tier = opts.tier || des.p.tier || 'signature';
  var sz = SIZES[tier];
  var T = takeoff(des);
  var lines = [];
  var L = function (ph, id, name, math, qty, unit, hrs, mat, eq, sub, other, extra) {
    var o = { ph: ph, id: id, name: name, math: math, qty: qty, unit: unit, hrs: r2(hrs || 0), mat: r2(mat || 0), eq: r2(eq || 0), sub: r2(sub || 0), other: r2(other || 0) };
    for (var k in extra) o[k] = extra[k];
    o.labor = r2(o.hrs * LABOR);
    o.cost = r2(o.labor + o.mat + o.eq + o.sub + o.other);
    lines.push(o); return o;
  };
  var A = T.bedArea;
  // Phase 1 · Site and bed prep
  L(1, 'layout', 'Utility locate (811) and paint bed lines', '811 ticket + layout from Design D-1203', 1, 'ea', 2.0, 0, 0, 0, 0);
  L(1, 'sod-beds', 'Remove turf in new beds, sod cutter', num(A) + ' sq ft ÷ 150 sq ft/man-hr', Math.round(A), 'sq ft', A / 150, 0, 110, 0, 0);
  L(1, 'compost', 'Compost, 2 in tilled into clay', num(A) + ' sq ft × 2 in ÷ 324 × 1.15 settle → ' + T.compost.toFixed(1) + ' yd³ ÷ 1.0 yd³/man-hr × 1.20 clay', T.compost, 'yd³', T.compost / 1.0 * CLAY, T.compost * 44, 95, 0, 0);
  // Phase 2 · Drip irrigation
  var zones = 2;
  L(2, 'drip', 'Inline drip, 0.6 gph at 18 in, 2 zones', T.drip + ' LF ÷ 45 LF/man-hr + 3 man-hrs per zone', T.drip, 'LF', T.drip / 45 + zones * 3, T.drip * 0.42 + zones * 185, 0, 0, 0);
  L(2, 'controller', 'Smart controller, valves and wiring', 'Wi-Fi controller, 2 valves, wire', 1, 'ea', 2.5, 248, 0, 0, 0);
  L(2, 'backflow', 'Backflow preventer and permit (licensed plumber)', 'Sub allowance: no quote on file yet', 1, 'ea', 0, 0, 0, 520, 0, { flag: 'sub' });
  // Phase 3 · Planting
  var c = T.counts;
  var trees = ['cer', 'jun'].filter(function (k) { return c[k]; });
  var treeMat = trees.reduce(function (s, k) { return s + c[k] * sz[k][1]; }, 0);
  var treeN = trees.reduce(function (s, k) { return s + c[k]; }, 0);
  L(3, 'trees', 'Trees, balled and burlapped', trees.map(function (k) { return c[k] + ' ' + PLANTS[k].code + ' ' + sz[k][0]; }).join(' + ') + ' · ' + treeN + ' × 2.0 man-hrs × 1.20 clay', treeN, 'ea', treeN * 2.0 * CLAY, treeMat + treeN * 19, 0, 0, 0);
  var groups = {};
  ['ile', 'ite', 'pan', 'ams', 'sch', 'ech', 'mon', 'phl'].forEach(function (k) { if (!c[k]) return; var s = (sz[k] || ['#1', 9.25])[0]; (groups[s] = groups[s] || []).push(k); });
  ['#5', '#3', '#2', '#1'].forEach(function (s) {
    var g = groups[s]; if (!g) return;
    var n = g.reduce(function (a, k) { return a + c[k]; }, 0);
    var mat = g.reduce(function (a, k) { return a + c[k] * (sz[k] || ['#1', 9.25])[1]; }, 0);
    L(3, 'plants' + s.slice(1), 'Plants, ' + s + ' containers', g.map(function (k) { return c[k] + ' ' + PLANTS[k].code; }).join(' + ') + ' · ' + n + ' × ' + INSTALL_HRS[s].toFixed(2) + ' man-hrs × 1.20 clay', n, 'ea', n * INSTALL_HRS[s] * CLAY, mat, 0, 0, 0);
  });
  L(3, 'starter', 'Starter fertilizer, mycorrhizae, first deep watering', 'Kit per 70 plants', 1, 'ea', 1.0, 45, 0, 0, 0);
  // Phase 4 · Hardscape accents
  if (T.steppers) L(4, 'steppers', 'Sandstone steppers, 24-30 in, set on screenings', T.steppers + ' steppers × 0.80 man-hrs × 1.20 clay · 1.3 t × $360', T.steppers, 'ea', T.steppers * 0.8 * CLAY, 1.3 * 360 + 60, 0, 0, 0);
  if (T.landing) L(4, 'landing', 'Flagstone landing off the patio, ' + T.landing + ' sq ft', T.landing + ' sq ft × 0.33 man-hrs · stone, base and joints', T.landing, 'sq ft', T.landing * 0.33, T.landing * 14.5, 0, 0, 0);
  if (T.boulders) L(4, 'boulders', 'Accent boulders, 18-30 in', T.boulders + ' boulders · ' + (T.boulders * 0.55).toFixed(1) + ' t × $165 · mini skid steer 1 day', T.boulders, 'ea', T.boulders * 1.0, T.boulders * 0.55 * 165, 285, 0, 0);
  if (T.lights) L(4, 'lights', 'Low-voltage path lights, 2700K, transformer and wire', T.lights + ' fixtures + 150 W transformer + 180 LF wire', T.lights, 'ea', T.lights * 1.1 + 2, T.lights * 118 + 265, 0, 0, 0);
  // Phase 5 · Lawn, edging, mulch, finish
  L(5, 'edging', 'Steel edging 1/8 in × 16 ft, black', T.edgeLF + ' LF × 1.02 ÷ 16 ft → ' + T.pieces + ' pieces, ' + T.stakes + ' stakes · ' + T.edgeLF + ' LF ÷ 25 LF/man-hr', T.edgeLF, 'LF', T.edgeLF / 25, T.pieces * 58, 0, 0, 0);
  L(5, 'mulch', 'Double-shredded hardwood mulch, 3 in', num(A) + ' sq ft × 3 in ÷ 324 × 1.05 → ' + T.mulch.toFixed(1) + ' yd³ ÷ 1.5 yd³/man-hr', T.mulch, 'yd³', T.mulch / 1.5, T.mulch * 38, 0, 0, 0);
  var sodRate = opts.sodRate || 200;
  {
    var lawnHrs = T.lawn / 150 + T.topsoil / 1.5 + T.sodSf / sodRate;
    L(5, 'lawn', 'Lawn renovation: strip, 1 in topsoil, new sod', num(T.lawn) + ' sq ft ÷ 150 strip + ' + T.topsoil.toFixed(1) + ' yd³ ÷ 1.5 + ' + num(T.sodSf) + ' sq ft sod ÷ ' + sodRate + ' sq ft/man-hr', Math.round(T.lawn), 'sq ft', lawnHrs, T.pallets * 450 * 0.44 + T.topsoil * 36, 0, 0, 0, { flag: 'gate', sodRate: sodRate });
  }
  var loads = Math.ceil(A / 600) + Math.ceil(T.lawn / 600);
  L(5, 'haul', 'Haul-off: sod and spoils', loads + ' loads × $95 · Franklin County transfer station', loads, 'loads', 0, 0, 0, 0, loads * 95);
  L(5, 'finish', 'Final cleanup, walkthrough and care handoff', 'Crew lead + designer', 1, 'ea', 2.5, 0, 160, 0, 0);

  var sum = function (k) { return r2(lines.reduce(function (s, l) { return s + l[k]; }, 0)); };
  var t = { hrs: sum('hrs'), labor: sum('labor'), mat: sum('mat'), eq: sum('eq'), sub: sum('sub'), other: sum('other') };
  t.direct = r2(t.labor + t.mat + t.eq + t.sub + t.other);
  t.raw = r2(t.direct / (1 - MARGIN));
  t.price = Math.ceil(t.raw / 5) * 5;
  t.gp = r2(t.price - t.direct);
  t.gm = t.gp / t.price;
  t.markup = t.gp / t.direct;
  t.ovh = r2(t.direct * 0.416);
  t.net = r2(t.gp - t.ovh);
  t.deposit = r2(t.price * 0.30);
  t.days = t.hrs / 3 / 9;
  return { lines: lines, t: t, T: T, tier: tier };
}

/* the walkthrough's canonical designs */
function designWidget(S) {
  var d = S.dims;
  return makeDesign({ W: d.width, D: d.depth, dA: d.bedDepth + (S.edits.deeper ? 2 : 0), dB: d.bedDepth, dC: d.bedDepth, bedD: S.edits.tree, cerIn: 'C', phase: 'widget', deeper: S.edits.deeper, deerSwap: S.edits.deer, fix: false });
}
function designFinal(tier, fix) {
  var dB = tier === 'essential' ? 5.5 : 6;
  return makeDesign({ W: 62, D: 38, dA: 8, dB: dB, dC: 6, bedD: true, cerIn: 'B', phase: 'final', deeper: true, deerSwap: true, fix: !!fix, tier: tier });
}
function nativeShare(des) { var c = counts(des), n = 0, t = 0; for (var k in c) { t += c[k]; if (PLANTS[k].native === 'oh') n += c[k]; } return t ? n / t : 0; }
function deerShare(des) { var c = counts(des), n = 0, t = 0; for (var k in c) { t += c[k]; if (PLANTS[k].deer === 'A' || PLANTS[k].deer === 'B') n += c[k]; } return t ? n / t : 0; }
