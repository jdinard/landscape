/* ============================================================
   UI: state, shared components, steps 1-7 (homeowner)
   ============================================================ */
var RM = false;
try { RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { RM = false; }

var S = {
  propFound: false, propLoading: false,
  shots: [false, false, false], shot: 0, refOk: null,
  dims: { width: 62, depth: 38, patioKeep: true, patioW: 14, patioD: 12, bedDepth: 6, beds: { house: true, back: true, side: false }, slope: 'gentle', sun: 'afternoon', soil: 'clay', water: 'low', styles: { native: true, modern: true, cottage: true, evergreen: true }, budget: '15-20', maint: 'low', deer: 'some', pets: { dog: true, cat: false, kids: false } },
  run: { a: 0, b: 0, code: '', verified: false, marketing: false },
  variant: 'native', favs: { native: true }, baPos: 30, share: false, card: null, cardFrom: null, wrong: {},
  edits: { deeper: false, deer: false, tree: false }, chat: [], typing: null, lastEdit: null,
  quote: { code: '', phoneOk: false, sms: false, mkt: false, train: false, times: { am: true, pm: false, sat: true }, submitted: false },
  lead: { sel: 'a3', approved: false, editing: false, msg: null, replied: false, booked: false },
  layout: 'signature',
  studio: { tier: 'signature', fix: false, render: false, year: 1, layers: { site: true, beds: true, plants: true, labels: true, sun: true, util: true, dims: true } },
  est: { tier: 'signature', sodRate: 200, sodDone: false, subDone: false, approved: false },
  prop: { scope: null, scopeOk: false, notesOk: false, confirm: false, sent: false },
  portal: { tier: 'signature', add: { lights: false, care: false, barrel: false }, name: '', agree: false, signed: false, method: 'ach', paid: false, paying: false },
  down: { poOk: false, sub: 'wait', schedOk: false, installed: false }
};

var YEARS = [0, 3, 5, 10];
var YEAR_LABEL = ['Install', 'Year 3', 'Year 5', 'Year 10'];
var CREDITS = { 's04-ai-working': 96, 's06-assistant': 53, 's08-lead-agent': 4, 's09-layout': 60, 's10-studio': 22, 's11-estimate': 8, 's12-proposal': 8, 's14-downstream': 22 };
var ALLOWANCE = 6000, START_LEFT = 4485, WIDGET_CAP = 600, WIDGET_USED = 288;

function ic(n, c) { return '<svg class="ic' + (c ? ' ' + c : '') + '" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; }
function tag(t) { return '<span class="tag ' + t + '">' + t.toUpperCase() + '</span>'; }
function rating(n) { return '<span class="rating r' + n + '">' + n + '/5 · Central Ohio</span>'; }
function deerPill(d) { return '<span class="rating d' + d + '">Deer ' + d + '</span>'; }
function plantName(sp, short) { var p = PLANTS[sp]; return short ? esc(p.common) : '<em>' + esc(p.bot) + '</em>' + (p.cv ? ' ' + esc(p.cv) : '') + ' · ' + esc(p.common); }

/* ---------- step registry ---------- */
var ACTS = [
  { n: 'Act 1', t: 'Homeowner on Greenleaf\'s website', sub: 'Dream Yard Visualizer, white-label widget' },
  { n: 'Act 2', t: 'Greenleaf Grounds Co. office', sub: 'Company web app' },
  { n: 'Act 3', t: 'Client approval, then the agents', sub: 'Client portal and downstream agents' }
];
var STEPS = [
  { id: 'overview', act: -1, short: 'Start here', title: 'Rootline AI design walkthrough' },
  { id: 's01-address', act: 0, short: 'Visualize your yard', title: 'Visualize your yard: address and property', who: 'Ada, on her phone', tags: ['mvp'] },
  { id: 's02-photos', act: 0, short: 'Guided photos', title: 'Guided photo capture', who: 'Ada', tags: ['mvp'] },
  { id: 's03-dimensions', act: 0, short: 'Real dimensions', title: 'Real dimensions and wishes', who: 'Ada', tags: ['mvp'] },
  { id: 's04-ai-working', act: 0, short: 'AI agents at work', title: 'The agents read, measure and paint', who: 'Scene service and render queue', ai: true, tags: ['mvp'] },
  { id: 's05-mockups', act: 0, short: 'Photoreal mockups', title: 'Four styles, labeled with real plants', who: 'Ada and Chidi', ai: true, tags: ['mvp'] },
  { id: 's06-assistant', act: 0, short: 'Design assistant', title: 'Edit the design by asking', who: 'Ada with the design assistant', ai: true, tags: ['v1', 'v2'] },
  { id: 's07-quote', act: 0, short: 'Get a quote', title: 'Get a quote from Greenleaf', who: 'Ada', tags: ['mvp'] },
  { id: 's08-lead-agent', act: 1, short: 'Lead follow-up', title: 'Lead Follow-up agent drafts, Sam approves', who: 'Sam Kowalski, estimator', ai: true, tags: ['mvp'] },
  { id: 's09-layout', act: 1, short: 'AI layouts to scale', title: 'Three to-scale layouts from the site visit', who: 'Jess Morales, designer', ai: true, tags: ['v1'] },
  { id: 's10-studio', act: 1, short: 'Design Studio', title: 'Design Studio: plan, validation, takeoff', who: 'Jess Morales', ai: true, tags: ['mvp', 'v1'] },
  { id: 's11-estimate', act: 1, short: 'Estimating agent', title: 'Estimating agent drafts, Sam adjusts and approves', who: 'Sam Kowalski', ai: true, tags: ['mvp'] },
  { id: 's12-proposal', act: 1, short: 'AI-drafted proposal', title: 'Good / Better / Best proposal, reviewed and sent', who: 'Sam Kowalski', ai: true, tags: ['mvp'] },
  { id: 's13-portal', act: 2, short: 'Client signs and pays', title: 'Client portal: choose, sign, pay the deposit', who: 'Ada, on her phone', tags: ['mvp'] },
  { id: 's14-downstream', act: 2, short: 'Agents take over', title: 'After approval: jobs, POs, schedule, care', who: 'Agents, Sam and Luis', ai: true, tags: ['mvp', 'v1'] },
  { id: 's15-recap', act: 2, short: 'Recap', title: 'Recap: every AI action, who approved, what it cost', who: 'Erin Castillo, owner', tags: ['mvp', 'v1'] }
];
function stepIndex(id) { for (var i = 0; i < STEPS.length; i++) if (STEPS[i].id === id) return i; return 0; }
function creditsThrough(idx) { var t = 0; for (var i = 1; i <= idx; i++) t += CREDITS[STEPS[i].id] || 0; return t; }
var TOTAL_CREDITS = creditsThrough(STEPS.length - 1);

/* narrative completion: visiting a later step completes the scripted actions of earlier ones */
var ENSURE = {
  's01-address': function () { S.propFound = true; S.propLoading = false; },
  's02-photos': function () { S.shots = [true, true, true]; S.refOk = true; },
  's04-ai-working': function () { S.run.a = 4; S.run.code = '482913'; S.run.verified = true; S.run.b = 3; },
  's06-assistant': function () { ['deeper', 'deer', 'tree'].forEach(function (k) { if (!S.edits[k]) applyEdit(k, true); }); S.typing = null; },
  's07-quote': function () { if (!S.quote.submitted) { S.quote.code = '307158'; S.quote.phoneOk = true; S.quote.sms = true; S.quote.submitted = true; } },
  's08-lead-agent': function () { S.lead.approved = true; S.lead.replied = true; S.lead.booked = true; S.lead.editing = false; },
  's10-studio': function () { S.studio.fix = true; S.studio.render = true; },
  's11-estimate': function () { S.est.sodRate = 150; S.est.sodDone = true; S.est.subDone = true; S.est.approved = true; },
  's12-proposal': function () { S.prop.scopeOk = true; S.prop.notesOk = true; S.prop.sent = true; S.prop.confirm = false; },
  's13-portal': function () { if (!S.portal.paid) { S.portal.name = S.portal.name || 'Ada Okafor'; S.portal.agree = true; S.portal.signed = true; S.portal.paid = true; } }
};
function ensureBefore(idx) { for (var i = 1; i < idx; i++) { var f = ENSURE[STEPS[i].id]; if (f) f(); } }

/* ---------- design accessors ---------- */
function wDesign() { return designWidget(S); }
function fDesign(tier) { return designFinal(tier || 'signature', S.studio.fix); }
function est(tier) { return estimate(fDesign(tier), { tier: tier || 'signature', sodRate: S.est.sodRate }); }
function tierPrice(tier) { return est(tier).t.price; }
var TIER_NAME = { essential: 'Essential', signature: 'Signature', showcase: 'Showcase' };
var TIER_GBB = { essential: 'Good', signature: 'Better', showcase: 'Best' };
var ADDONS = {
  lights: { name: 'Path lighting, 6 low-voltage fixtures', price: Math.ceil((6 * 118 + 265 + (6 * 1.1 + 2) * LABOR) / 0.58 / 5) * 5, note: 'Warm 2700K on the steppers and patio' },
  care: { name: 'Season-one establishment care, 6 visits', price: Math.ceil((6 * 1.5 * LABOR + 20) / 0.58 / 5) * 5, note: 'Drip check, weeding, controller tune-ups' },
  barrel: { name: 'Rain barrel at the left downspout', price: Math.ceil((189 + 1.5 * LABOR) / 0.58 / 5) * 5, note: '65 gal with diverter and stand' }
};
function portalTotals() {
  var base = tierPrice(S.portal.tier), add = 0;
  Object.keys(S.portal.add).forEach(function (k) { if (S.portal.add[k] && !(k === 'lights' && false)) add += ADDONS[k].price; });
  var tot = base + add;
  var dep = r2(tot * 0.3), mid = r2(tot * 0.4), fin = r2(tot - dep - mid);
  return { base: base, add: add, tot: tot, dep: dep, mid: mid, fin: fin };
}

/* ---------- frames ---------- */
function phone(inner, opt) {
  opt = opt || {};
  var brand = '<div class="brand"><span class="logo">' + ic('leaf') + '</span><span><b>Greenleaf Grounds Co.</b><small>' + esc(opt.sub || 'Dream Yard Visualizer') + '</small></span><span class="sp"></span>' + (opt.right || '<span class="faint">' + ic('menu') + '</span>') + '</div>';
  var sheet = S.card && opt.cards ? cardSheet(S.card) : '';
  return '<div class="phone pt-phone" style="position:relative" role="group" aria-label="' + esc(opt.label || 'Phone screen') + '"><div class="status"><span>9:41</span><span class="bat">5G ' + ic('battery', 's') + '</span></div><div class="body pt-pbody" data-keep="pbody">' + brand + '<div class="pbody-pad">' + inner + '</div><div class="pfoot">' + esc(opt.foot || 'greenleafgrounds.com/visualize · Powered by Rootline') + '</div></div>' + sheet + '</div>';
}
function browser(url, inner, label) {
  return '<div class="frame-scroll"><div class="browser" role="group" aria-label="' + esc(label || 'Desktop screen') + '"><div class="browser-bar"><div class="dots" aria-hidden="true"><i></i><i></i><i></i></div><div class="url">' + esc(url) + '</div></div>' + inner + '</div></div>';
}
var NAV = [['today', 'Today'], ['inbox', 'Inbox'], ['approve', 'Approvals'], ['users', 'Clients'], ['dollar', 'Sales'], ['pen', 'Design'], ['calendar', 'Schedule'], ['clipboard', 'Jobs'], ['bank', 'Money'], ['leaf', 'Plants']];
function appShell(active, main, counts) {
  counts = counts || {};
  var nav = NAV.map(function (n) { var on = n[1] === active; var b = counts[n[1]] ? '<span class="badge">' + counts[n[1]] + '</span>' : ''; return '<span class="item' + (on ? ' active' : '') + '"' + (on ? ' aria-current="page"' : '') + '>' + ic(n[0]) + n[1] + b + '</span>'; }).join('');
  var idx = stepIndex(cur());
  var left = START_LEFT - creditsThrough(idx);
  return '<div class="app pt-app"><nav class="app-side" aria-label="Company app navigation (concept)"><div class="co"><span class="logo">' + ic('leaf') + '</span><span><b>Greenleaf Grounds Co.</b><small>Columbus, OH · Pro</small></span></div>' + nav + '<div class="sidefoot">AI credits <b>' + num(left) + '</b> of 6,000 left<div class="meter"><i style="width:' + (left / ALLOWANCE * 100).toFixed(1) + '%"></i></div></div></nav><div class="app-main">' + main + '</div></div>';
}
function ctxCard(title, items, extra) {
  return '<aside class="big-view" aria-label="About this screen"><div class="card"><h3 style="font-size:.95rem">' + esc(title) + '</h3><ul style="margin:6px 0 0;padding-left:18px;display:grid;gap:5px;font-size:.82rem;color:var(--text-2)">' + items.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul></div>' + (extra || '') + '</aside>';
}

/* ---------- before/after ---------- */
function baHTML(key, beforeSvg, after, opt) {
  opt = opt || {};
  var labs = (after.labels || []).map(function (l) {
    var left = l.u / 6.4, hide = left < S.baPos ? ' hide' : '';
    return '<button type="button" class="plabel' + hide + (S.card === l.sp ? ' on' : '') + '" style="left:' + left.toFixed(2) + '%;top:' + (l.v / 4).toFixed(2) + '%" data-act="card" data-sp="' + l.sp + '" data-k="lab-' + key + '-' + l.sp + '" aria-label="Plant ' + l.n + ': ' + esc(PLANTS[l.sp].common) + '" data-u="' + left.toFixed(2) + '">' + l.n + '</button>';
  }).join('');
  return '<div class="scene ba" data-ba="' + key + '" style="--pos:' + S.baPos + '%">' + beforeSvg + '<div class="ba-after">' + after.svg + '</div><div class="ba-line"><span class="ba-knob" aria-hidden="true">◀▶</span></div><span class="ba-tag l">Before</span><span class="ba-tag r">' + esc(opt.after || 'After · about 3 years') + '</span><span class="ai-badge">' + ic('spark') + 'AI artist rendering</span><input class="ba-range" type="range" min="0" max="100" value="' + S.baPos + '" aria-label="Drag to compare before and after" data-k="ba-' + key + '">' + labs + '</div>';
}
function sceneHTML(obj, opt) {
  opt = opt || {};
  var labs = (obj.labels || []).map(function (l) { return '<button type="button" class="plabel' + (S.card === l.sp ? ' on' : '') + '" style="left:' + (l.u / 6.4).toFixed(2) + '%;top:' + (l.v / 4).toFixed(2) + '%" data-act="' + (opt.act || 'card') + '" data-sp="' + l.sp + '" data-k="lab-' + (opt.key || 's') + '-' + l.sp + '" aria-label="Plant ' + l.n + ': ' + esc(PLANTS[l.sp].common) + '">' + l.n + '</button>'; }).join('');
  return '<div class="scene">' + obj.svg + (opt.badge === false ? '' : '<span class="ai-badge">' + ic('spark') + 'AI artist rendering</span>') + (opt.chip ? '<span class="stale">' + opt.chip + '</span>' : '') + labs + '</div>';
}

/* ---------- variants (Mode A restyle presets) ---------- */
var VARIANTS = {
  native: { name: 'Native pollinator', short: 'Native pollinator', edge: 'stone', mulch: 'brown', range: [15500, 19500], blurb: 'Curved beds, natural stone edge, Ohio natives with bloom from May to frost.' },
  modern: { name: 'Clean modern', short: 'Clean modern', edge: 'steel', mulch: 'charcoal', straight: true, range: [16000, 20500], blurb: 'Straight steel-edged beds, a tight palette of 3 plants massed in rows.', rows: [['gem', 'f'], ['cal', 'm'], ['all', 'r']] },
  cottage: { name: 'Cottage', short: 'Cottage', edge: 'brick', mulch: 'brown', range: [15000, 19000], blurb: 'Layered perennials and a soft brick edge, color all summer.', rows: [['ile', 'f'], ['phl', 'm'], ['rud', 'm'], ['sal', 'r'], ['nep', 'r']] },
  evergreen: { name: 'Low-maintenance evergreen', short: 'Low-care evergreen', edge: 'spade', mulch: 'brown', range: [14500, 18000], blurb: 'Evergreen structure and native grasses; mulch, not mowing.', rows: [['ile', 'f'], ['spo', 'm'], ['jhz', 'r']] }
};
var VORDER = ['native', 'modern', 'cottage', 'evergreen'];
function variantPlants(key, des) {
  if (key === 'native') return des.plants;
  var v = VARIANTS[key], out = [];
  ['A', 'C'].forEach(function (bk) {
    var b = des.beds[bk]; if (!b) return;
    var x0 = bk === 'A' ? 8.6 : des.patio.x1 + 0.7, x1 = bk === 'A' ? des.patio.x0 - 0.7 : des.W - 8.6, d = b.depth;
    var depthOf = { f: 3, m: Math.max(3.9, (3 + d - 1) / 2), r: d - 1 };
    var byRow = {}; v.rows.forEach(function (r) { (byRow[r[1]] = byRow[r[1]] || []).push(r[0]); });
    Object.keys(byRow).forEach(function (row) {
      var sps = byRow[row], y = depthOf[row];
      var spread = Math.max.apply(null, sps.map(function (k) { return growth(PLANTS[k], 3).w; }));
      var step = Math.max(1.4, spread * 0.95), n = Math.max(1, Math.floor((x1 - x0) / step));
      for (var i = 0; i <= n; i++) { var sp = sps[i % sps.length]; out.push({ sp: sp, bed: bk, x: x0 + (x1 - x0) * (n ? i / n : 0.5), y: y + ((i % 2) ? 0.2 : -0.1) }); }
    });
  });
  return out;
}
function variantScene(key, opt) {
  opt = opt || {};
  var des = wDesign(), v = VARIANTS[key];
  var pl = variantPlants(key, des);
  var vis = pl.filter(function (q) { return q.bed !== 'B'; });
  var nm = numberMap(vis);
  return { obj: scenePhoto({ des: des, plants: pl, straight: v.straight, edgeStyle: v.edge, mulch: v.mulch, numberMap: nm, highlight: opt.highlight, highlightPlants: opt.hotSp, ariaLabel: 'AI artist rendering of the Okafors\' backyard in the ' + v.name + ' style, about 3 years after planting' }), nmap: nm, plants: vis };
}
function beforeScene(card) { return scenePhoto({ des: wDesign(), before: true, card: card, ariaLabel: 'Before: patchy lawn and bare soil along the back of a two-story house, with the existing paver patio, the AC unit and a wood fence on each side' }).svg; }

/* ---------- plant card (bottom sheet inside the phone) ---------- */
function cardSheet(sp) {
  var p = PLANTS[sp]; var c = counts({ plants: (S.cardFrom || []) })[sp];
  var why = [esc(p.why)];
  if (p.deer === 'A' || p.deer === 'B') why.push('Deer ' + DEER_TXT[p.deer] + ': fits your "deer visit sometimes" answer.');
  else why.push('<span class="wrn">Deer ' + DEER_TXT[p.deer] + '.</span> You said deer visit sometimes, so the assistant can swap it.');
  if (sp === 'ile') why.push('Dog: berries rated mild in the KB, so it stays along the house.');
  return '<div class="sheet-wrap" data-act="closecard" data-self="1"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="card-h" data-stop="1">' +
    '<div class="flex" style="justify-content:space-between"><span class="pill ok">' + ic('leaf', 's') + 'From Greenleaf\'s Central Ohio palette</span><button type="button" class="btn sm" data-act="closecard" data-k="card-close">Close</button></div>' +
    '<div class="mt10">' + plantPic(sp) + '</div>' +
    '<h3 id="card-h">' + esc(p.common.charAt(0).toUpperCase() + p.common.slice(1)) + '</h3><div class="muted" style="font-size:.8rem"><em>' + esc(p.bot) + '</em> ' + esc(p.cv) + (c ? ' · ' + c + ' in this design' : '') + '</div>' +
    '<div class="facts">' + rating(p.rr) + deerPill(p.deer) + '<span class="pill">' + esc(NATIVE_TXT[p.native]) + '</span><span class="pill">Mature ' + p.h[2] + ' × ' + p.w[2] + ' ft</span><span class="pill">' + esc(p.sun) + '</span></div>' +
    '<div class="tiny faint" style="text-transform:uppercase;letter-spacing:.06em;font-weight:700">Why it fits your yard</div><ul>' + why.map(function (w) { return '<li>' + w + '</li>'; }).join('') + '</ul>' +
    '<div class="tiny faint mt10" style="text-transform:uppercase;letter-spacing:.06em;font-weight:700">Bloom and care</div><ul><li>' + esc(p.bloom) + '</li>' + p.care.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
    '<p class="disclaim mt10">Shown at about 3 years in the rendering. KB note: "' + esc(p.note) + '" Ratings are sample data from the curated Plant Region Profile for Central Ohio.</p>' +
    '<div class="mt6">' + (S.wrong[sp] ? '<span class="okline">' + ic('check') + 'Thanks: sent to Rootline\'s plant curators</span>' : '<button type="button" class="btn xs ghost" data-act="wrong" data-sp="' + sp + '" data-k="wrong">' + ic('flag', 's') + ' This plant looks wrong</button>') + '</div>' +
    '</div></div>';
}

/* ================= STEP SCREENS (Act 1) ================= */
var SCREEN = {}, BTS = {};

SCREEN['s01-address'] = function () {
  var found = S.propFound;
  var body = '<span class="pill ok" style="align-self:flex-start">' + ic('spark', 's') + 'Free · about 3 minutes</span>' +
    '<h2 class="ptitle">Visualize your yard</h2><p class="psub">See your yard redesigned with plants that thrive in Central Ohio, sized to your real measurements.</p>' +
    '<div class="fld">Which area?<div class="seg" role="group" aria-label="Area"><button type="button" aria-pressed="true">Backyard</button><button type="button" aria-pressed="false" data-act="noop">Front yard</button><button type="button" aria-pressed="false" data-act="noop">One bed</button></div></div>' +
    '<form class="fld" data-form="addr"><label for="addr">Your address</label><div class="inrow"><input id="addr" class="inp" value="1876 Glenn Ave, Upper Arlington, OH 43221" autocomplete="street-address" data-k="addr"><button class="btn primary" type="submit" data-k="find">' + ic('search') + 'Find</button></div><span class="hint">We only use it to check Greenleaf\'s service area and find your lot.</span></form>';
  if (S.propLoading) body += '<div class="loading"><span class="spin"></span>Checking Greenleaf\'s service area and your lot…</div>';
  if (found) {
    body += '<div class="okline rise">' + ic('check') + 'In Greenleaf\'s service area · Upper Arlington</div>' +
      '<div class="pcard rise"><div class="minimap">' + aerialSVG() + '</div><dl class="kv mt10"><dt>Lot</dt><dd>0.21 ac · 66 × 140 ft</dd><dt>House</dt><dd>1,820 sq ft footprint</dd><dt>Backyard</dt><dd>About 62 × 38 ft <span class="faint">(you will confirm)</span></dd><dt>Region</dt><dd>Central Ohio · USDA zone 6b</dd><dt>Soil</dt><dd>Heavy clay, slow drainage</dd><dt>Deer</dt><dd>Moderate pressure nearby</dd><dt>Back of house</dt><dd>Faces southwest (218°)</dd></dl></div>' +
      '<button type="button" class="btn primary" style="justify-content:center" data-act="next" data-k="s01-next">Looks right · next: photos ' + ic('arrow-r') + '</button>';
  }
  return '<div class="dev-row">' + phone(body, { label: 'Ada\'s phone: Greenleaf\'s Dream Yard Visualizer' }) + ctxCard('Where this happens', ['Greenleaf\'s own website, greenleafgrounds.com/visualize. The widget is white-label: Greenleaf\'s logo and colors, a "Powered by Rootline" footnote.', 'Before any AI runs, the address must be inside Greenleaf\'s service area. Out-of-area visitors stop here and cost no credits.', '<b>Try it:</b> press Find. The parcel, house footprint and the curated Region come back in under a second.']) + '</div>';
};
BTS['s01-address'] = function () {
  return { what: 'The homeowner starts on Greenleaf\'s website. Rootline checks the service area first, then resolves the parcel, the house footprint and the curated plant Region that every later step uses. Nothing here is generative.',
    agents: [['Dream Yard Visualizer · property service', 'Deterministic lookups, no model calls', true]],
    trace: [['session.create_anonymous', 'Widget session token; bot check passed', '120 ms', 1], ['geo.geocode', '1876 Glenn Ave → rooftop match (coordinates kept internal, rounded)', '90 ms', 1], ['service_area.check', 'Inside Greenleaf\'s "Columbus NW" polygon', '18 ms', 1], ['property.lookup', 'Parcel 0.21 ac (66 × 140 ft), footprint 1,820 sq ft', '410 ms', 1], ['region.resolve', 'Central Ohio (Great Lakes and Ohio Valley), USDA 6b (2023 map), EPA ecoregion 55', '35 ms', 1], ['site.context', 'Soil: heavy clay (soil survey). Deer: moderate (Region default)', '60 ms', 1]].map(function (t) { return { c: t[0], r: t[1], ms: t[2], det: t[3], done: S.propFound }; }),
    hitl: [['Ada', 'confirms the property before anything is generated.'], ['Greenleaf', 'is not involved yet. No lead exists until Ada asks for a quote.']], levels: ['T0 read-only lookups'],
    credits: { n: 0, note: 'Parcel lookups are their own meter (1 parcel lookup), not AI credits.' },
    tags: [['mvp', 'widget, service-area check, parcel and footprint import, Region resolution']],
    specs: 'Spec: 11 §4.6 AIM-AUD-01 · 11 §4.1 AIM-CAP-06 · 12 KB-RGN-02, KB-RGN-04 · 22 §4.4 (parcel lookups) · 16 (widget embed)' };
};

var SHOTS = [
  { t: 'Back door, looking out', q: 86, req: true },
  { t: 'Back corner, toward the house', q: 84, req: true },
  { t: 'Kitchen window view', q: 79, req: false }
];
function shotScene(i) { return i === 1 ? beforeScene(true) : sceneOut(i === 2 ? 'window' : 'door'); }
SCREEN['s02-photos'] = function () {
  var i = S.shot, cap = S.shots;
  var view = '<div class="scene capview" style="aspect-ratio:4/3">' + shotScene(i) + '<span class="guide"></span><span class="level"></span>' +
    '<span class="chipo" style="left:8px;top:8px">Shot ' + (i + 1) + ' of 3' + (SHOTS[i].req ? '' : ' · optional') + '</span><span class="chipo" style="right:8px;top:8px">1x lens · light good</span><span class="chipo" style="left:50%;top:58%;transform:translateX(-50%)">Level ✓ roll 1.2°</span>' +
    (i === 1 ? '<span class="chipo" style="left:56%;top:30%;background:var(--sky-600)">Patio door detected</span><span class="chipo" style="left:10%;bottom:10%;background:var(--sky-600)">Card found ✓</span>' : '') + '</div>';
  var ref = (i === 1 || (cap[1] && S.refOk === null)) ? '<div class="pcard soft"><b style="font-size:.8rem">We found your patio door. Is it about 80 in tall?</b><div class="flex mt6"><button type="button" class="chip" aria-pressed="' + (S.refOk === true) + '" data-act="ref" data-v="1" data-k="ref1">Yes, about 80 in</button><button type="button" class="chip" aria-pressed="' + (S.refOk === false) + '" data-act="ref" data-v="0" data-k="ref0">Not sure</button></div><p class="tiny faint mt6">Known sizes are always confirmed, never assumed. The printable calibration card on the lawn helps too.</p></div>' : '';
  var shots = '<div class="shots">' + SHOTS.map(function (s, k) {
    return '<button type="button" class="shot" aria-pressed="' + (k === i) + '" data-act="shot" data-i="' + k + '" data-k="shot' + k + '">' + (cap[k] ? '<span class="scene">' + shotScene(k) + '</span>' : '<span class="ph0">' + (k + 1) + '</span>') + '<b>' + (k + 1) + ' · ' + esc(s.t) + '</b><span>' + (cap[k] ? 'Quality <b class="num">' + s.q + '</b> ✓' : (s.req ? 'Required' : 'Optional')) + '</span></button>';
  }).join('') + '</div>';
  var q = cap[i] ? SHOTS[i].q : null;
  var qual = q ? '<div class="pcard"><div class="qbar"><span>Quality</span><span class="track"><i style="width:' + q + '%"></i></span><span class="mono">' + q + '/100</span></div><div class="qgrid mt6"><span>Sharpness (25%)</span><span class="mono">23/25</span><span>Exposure (20%)</span><span class="mono">17/20</span><span>Horizon (10%)</span><span class="mono">10/10</span><span>Framing (20%)</span><span class="mono">' + (q - 59) + '/20</span><span>Lens (10%)</span><span class="mono">10/10</span><span>Obstructions (15%)</span><span class="mono">' + (i === 0 ? 9 : 9) + '/15 · garden hose kept</span></div><div class="okline mt6">' + ic('check') + 'Good to go</div></div>' : '<p class="tiny faint">Each photo gets a quality score. Below 50 we ask for a retake.</p>';
  var ready = cap[0] && cap[1];
  var body = '<h2 class="ptitle">Take 3 photos</h2><p class="psub">Stand where you would show a friend your yard. We check every shot on your phone before it uploads.</p>' + view + ref +
    '<div class="flex"><button type="button" class="btn primary" data-act="take" data-k="take">' + ic('camera') + (cap[i] ? 'Retake' : 'Take photo') + '</button><button type="button" class="btn" data-act="samples" data-k="samples">Use sample photos</button><label class="btn ghost" style="font-weight:600">' + ic('upload') + 'Upload<input type="file" accept="image/*" class="sr-only" data-file="1" aria-label="Upload a photo instead"></label></div>' + shots + qual +
    '<button type="button" class="btn ' + (ready ? 'primary' : '') + '" style="justify-content:center" data-act="next" data-k="s02-next"' + (ready ? '' : ' disabled') + '>Next: a few questions ' + ic('arrow-r') + '</button>';
  return '<div class="dev-row">' + phone(body, { label: 'Guided capture on Ada\'s phone' }) + ctxCard('Guided capture, not "send us a picture"', ['Backyard shot list: from the back door looking out, from the back corner toward the house, plus an optional kitchen-window view.', 'On-device checks: horizon level, 1x lens (not the 0.5x ultra-wide), light, blur and framing. Obstructions like the garden hose are kept and masked, never removed.', '<b>Try it:</b> press <i>Use sample photos</i> or <i>Take photo</i> for each slot, then answer the door question.']) + '</div>';
};
BTS['s02-photos'] = function () {
  var c = S.shots;
  return { what: 'Capture runs on the phone with no network needed: a live assistant checks level, lens, light and framing, and scores each photo. A reference object (the patio door, confirmed by Ada) and an optional calibration card give the scale solver real lengths later.',
    agents: [['On-device capture assistant', 'Quality gate and reference detection on the phone', true]],
    trace: [{ c: 'capture.quality(shot 1)', r: '86/100 · roll 1.2° · 1x lens', ms: '40 ms', det: 1, done: c[0] }, { c: 'capture.detect_reference(shot 2)', r: 'Patio door ≈ 80 in, calibration card on lawn', ms: '60 ms', det: 1, done: c[1] }, { c: 'capture.quality(shot 2)', r: '84/100 · hose detected, kept and masked', ms: '40 ms', det: 1, done: c[1] }, { c: 'capture.exif', r: '26 mm eq., heading 38° toward the house, GPS rounded and internal only', ms: '5 ms', det: 1, done: c[1] }, { c: 'reference.confirm', r: S.refOk === null ? 'Waiting for Ada' : (S.refOk ? 'Ada: "about 80 in"' : 'Ada: not sure · door dropped from calibration'), ms: '', human: 1, done: S.refOk !== null }, { c: 'upload.photos', r: (c.filter(Boolean).length) + ' photos, hashed and cached for scene analysis', ms: '1.4 s', det: 1, done: c[0] && c[1] }],
    hitl: [['Ada', 'retakes any photo under 50 and confirms the door height. Assumed sizes are never used unconfirmed.']], levels: ['T0 on-device checks'],
    credits: { n: 0, note: 'Quality checks run on the phone.' },
    tags: [['mvp', 'guided capture, quality gate, reference objects and calibration card']],
    specs: 'Spec: 11 §4.1 AIM-CAP-01, AIM-CAP-02 · 11 §6.2 S1 guided capture wireframe' };
};

function dimsSummary() {
  var d = S.dims, des = wDesign(), msgs = [];
  if (d.width > 200) msgs.push('Over 200 ft wide: Greenleaf will use the aerial import instead.');
  if (d.width < 20 || d.depth < 12) msgs.push('That is very small for this preview; the designer will confirm on site.');
  if (d.bedDepth < 2) msgs.push('Beds need at least 2 ft of depth.');
  if (d.bedDepth > d.depth / 2) msgs.push('Bed depth is more than half the yard depth. Is that right?');
  if (d.patioW * d.patioD > 0.8 * d.width * d.depth) msgs.push('The patio is larger than 80% of the yard.');
  var area = d.width * d.depth, patio = d.patioKeep ? d.patioW * d.patioD : 0;
  return '<div class="ph"><span>Your yard, to scale</span><span class="mono" style="letter-spacing:0">live</span></div>' +
    '<div class="minimap plan-wrap">' + planSVG(des, { mini: true, labels: 'none', layers: { sun: false, util: false }, year: 3, aria: 'Live to-scale sketch of the backyard from your dimensions' }) + '</div>' +
    '<dl class="kv mt6"><dt>Backyard</dt><dd class="num">' + d.width + ' × ' + d.depth + ' ft = ' + num(area) + ' sq ft</dd><dt>Patio kept</dt><dd class="num">' + num(patio) + ' sq ft</dd><dt>New beds</dt><dd class="num">≈ ' + num(Math.round(des.bedArea / 10) * 10) + ' sq ft at ' + d.bedDepth + ' ft deep</dd><dt>Lawn left</dt><dd class="num">≈ ' + num(Math.round((area - patio - des.bedArea) / 10) * 10) + ' sq ft</dd></dl>' +
    (msgs.length ? '<div class="warnline mt6">' + ic('warn') + '<span>' + msgs.map(esc).join('<br>') + '</span></div>' : '<div class="okline mt6">' + ic('check') + 'Dimensions look consistent with your parcel</div>');
}
function numField(key, label, unit, min, max) { return '<label class="fld">' + label + '<span class="unit"><input class="inp num" type="number" inputmode="decimal" min="' + min + '" max="' + max + '" step="1" value="' + S.dims[key] + '" data-bind="dims.' + key + '" data-k="d-' + key + '"><span>' + unit + '</span></span></label>'; }
function segField(key, label, opts) { return '<div class="fld">' + label + '<div class="seg" role="group" aria-label="' + esc(label) + '">' + opts.map(function (o) { return '<button type="button" aria-pressed="' + (S.dims[key] === o[0]) + '" data-act="dimset" data-f="' + key + '" data-v="' + o[0] + '" data-k="seg-' + key + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div></div>'; }
function selField(key, label, opts) { return '<label class="fld">' + label + '<select class="inp" data-bind="dims.' + key + '" data-k="sel-' + key + '">' + opts.map(function (o) { return '<option value="' + o[0] + '"' + (S.dims[key] === o[0] ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select></label>'; }
SCREEN['s03-dimensions'] = function () {
  var d = S.dims;
  var styleChips = VORDER.map(function (k) { return '<button type="button" class="chip" aria-pressed="' + !!d.styles[k] + '" data-act="style" data-v="' + k + '" data-k="sty-' + k + '">' + (k === 'native' ? '★ ' : '') + esc(VARIANTS[k].name) + '</button>'; }).join('');
  var body = '<h2 class="ptitle">Tell us about your yard</h2><p class="psub">Five quick questions, then real dimensions. Real numbers make plant counts and prices real.</p>' +
    '<div class="pcard"><h4>1 · Styles to try <span class="faint" style="font-weight:500">(up to 4; ★ is your first pick)</span></h4><div class="chips">' + styleChips + '</div><p class="tiny faint mt6">Xeriscape is hidden: too few plants in the Central Ohio palette suit it on wet clay.</p></div>' +
    '<div class="pcard"><div class="g2">' + selField('budget', '2 · Budget', [['7-15', '$7,500-$15,000'], ['15-20', '$15,000-$20,000'], ['20-30', '$20,000-$30,000'], ['30+', '$30,000+']]) + segField('maint', '3 · Upkeep', [['low', 'Low'], ['med', 'Medium'], ['high', 'High']]) + '</div><div class="g2 mt10">' + segField('deer', '4 · Deer', [['none', 'None'], ['some', 'Some'], ['heavy', 'Heavy']]) +
    '<div class="fld">5 · Pets and kids<div class="chips">' + [['dog', 'Dog'], ['cat', 'Cat'], ['kids', 'Kids under 5']].map(function (p) { return '<button type="button" class="chip" aria-pressed="' + !!d.pets[p[0]] + '" data-act="pet" data-v="' + p[0] + '" data-k="pet-' + p[0] + '">' + p[1] + '</button>'; }).join('') + '</div></div></div></div>' +
    '<div class="pcard"><h4>Real dimensions <span class="pill info" style="margin-left:4px">recommended</span></h4><div class="g2">' + numField('width', 'Yard width (along house)', 'ft', 5, 500) + numField('depth', 'Yard depth (house to back line)', 'ft', 3, 500) + '</div>' +
    '<div class="g3 mt10"><label class="fld">Patio<span class="check" style="margin-top:6px"><input type="checkbox" ' + (d.patioKeep ? 'checked' : '') + ' data-bind="dims.patioKeep" data-k="d-pk"><span>Keep it</span></span></label>' + numField('patioD', 'Patio depth', 'ft', 4, 40) + numField('patioW', 'Patio width', 'ft', 4, 40) + '</div>' +
    '<div class="g2 mt10">' + numField('bedDepth', 'Bed depth', 'ft', 2, 15) + selField('slope', 'Slope', [['flat', 'Flat (under 2%)'], ['gentle', 'Gentle (2-8%)'], ['moderate', 'Moderate (8-15%)'], ['steep', 'Steep (15-33%)']]) + '</div>' +
    '<div class="fld mt10">Where do you want beds?<div class="chips">' + [['house', 'Along the house'], ['back', 'Along the back fence'], ['side', 'Along the side fences']].map(function (b) { return '<button type="button" class="chip" aria-pressed="' + !!d.beds[b[0]] + '" data-act="bedwhere" data-v="' + b[0] + '" data-k="bw-' + b[0] + '">' + b[1] + '</button>'; }).join('') + '</div></div>' +
    '<div class="g2 mt10">' + selField('sun', 'Sun', [['afternoon', 'Afternoon sun along the back'], ['full', 'Full sun most of the day'], ['shade', 'Mostly shade'], ['auto', 'Estimate it for me']]) + selField('soil', 'Soil', [['clay', 'Clay (from soil survey)'], ['loam', 'Loam'], ['sand', 'Sandy'], ['unknown', 'Not sure']]) + '</div>' +
    '<div class="mt10">' + selField('water', 'Water use', [['low', 'Prefer low-water plants'], ['any', 'No preference'], ['days', 'We have watering-day limits']]) + '</div></div>' +
    '<div class="pcard soft" id="dims-sum" aria-live="polite">' + dimsSummary() + '</div>' +
    '<button type="button" class="btn primary" style="justify-content:center" data-act="next" data-k="s03-next">Show me my designs ' + ic('arrow-r') + '</button>';
  return '<div class="dev-row">' + phone(body, { label: 'Dimensions and preferences form on Ada\'s phone' }) + ctxCard('A structured form, not free text', ['Every answer becomes a hard or soft constraint: deer and pets filter the plant list, budget picks the tier, maintenance filters the KB maintenance level.', 'Real dimensions feed the scale solver (weight 0.75) and set bed sizes, plant counts and the price range.', '<b>Try it:</b> change the yard width, bed depth or patio size. The to-scale sketch and totals update live, and the assistant and the plan later use what you enter.']) + '</div>';
};
BTS['s03-dimensions'] = function () {
  var d = S.dims, des = wDesign(), k = Object.keys(d.styles).filter(function (s) { return d.styles[s]; });
  return { what: 'The answers become structured constraints stored canonically (feet here, meters in the database). Nothing is generated yet; the live sketch is drawn client-side from the same geometry engine the plan and mockups use.',
    agents: [['Constraint compiler', 'Validation rules from the dimension form', true]],
    trace: [{ c: 'form.validate', r: 'Width ' + d.width + ' ft, depth ' + d.depth + ' ft, bed ' + d.bedDepth + ' ft (≥ 2 ft, ≤ yard depth)', ms: '2 ms', det: 1, done: 1 }, { c: 'constraints.compile', r: 'Hard: deer ' + d.deer + ', dog-safe, zone 6b, clay. Soft: low upkeep, low water, ' + k.length + ' styles', ms: '6 ms', det: 1, done: 1 }, { c: 'sketch.render', r: 'Beds ≈ ' + num(Math.round(des.bedArea)) + ' sq ft drawn to scale', ms: '4 ms', det: 1, done: 1 }],
    hitl: [['Ada', 'owns every answer and can skip any field. The designer re-confirms measurements at the site visit.']], levels: ['T0 validation only'],
    credits: { n: 0, note: 'No AI work yet.' },
    tags: [['mvp', 'structured dimension form (the widget shows 5 quick questions plus optional real dimensions; pros see every field)']],
    specs: 'Spec: 11 §4.1 AIM-CAP-03 (field table, validation) · 11 §4.2 AIM-UND-03 (form dimensions weight 0.75) · 06 §4.17.1' };
};

/* ---------- s04 agent run ---------- */
var RUN_A = [
  ['Reading your photos', 'House, lawn, 2 bare beds, patio, fence and the AC unit (kept as is)'],
  ['Measuring', 'Scale set from your 62 ft width, the 14 ft patio edge and the 80 in door: ±4%'],
  ['Finding the sun', 'Back of the house faces southwest (218°): about 6.8 h of sun, mostly afternoon'],
  ['We found your lawn, 2 beds and your patio', 'Mask preview below. Something wrong? Tap to fix it.']
];
var RUN_B = [
  ['Choosing plants for Central Ohio', '86 plants in Greenleaf\'s palette → 41 fit your yard (deer, dog, zone 6b, clay, low upkeep)'],
  ['Painting 4 styles', '16 images, 4 per style, with your house and patio left untouched'],
  ['Your designs are ready', 'Labeled with real plants from the regional plant list']
];
function runItem(t, state) { return '<div class="runitem ' + state + '"><span class="st">' + (state === 'done' ? ic('check') : state === 'run' ? '<span class="spin"></span>' : '') + '</span><span><b>' + esc(t[0]) + '</b><small>' + esc(t[1]) + '</small></span></div>'; }
SCREEN['s04-ai-working'] = function () {
  var R = S.run, des = wDesign();
  var a = RUN_A.map(function (t, i) { return runItem(t, R.a > i ? 'done' : (R.a === i ? 'run' : 'wait')); }).join('');
  var mask = R.a >= 4 ? '<div class="rise"><div class="scene">' + scenePhoto({ des: des, before: true, overlay: 'seg', ariaLabel: 'Segmentation overlay on photo 2: sky, roof, house, protected windows and door, fences, AC unit, bare beds, lawn and patio, with calibration lines A to B on the 14 ft patio edge and the 80 inch door' }).svg + '</div><div class="legend-sm mt6"><span><i style="background:var(--sky-500)"></i>sky</span><span><i style="background:var(--stone-450)"></i>house</span><span><i style="background:var(--stone-900)"></i>protected</span><span><i style="background:var(--moss-400)"></i>lawn</span><span><i style="background:var(--clay-600)"></i>bed</span><span><i style="background:var(--marigold-400)"></i>patio</span><span><i style="background:var(--clay-500)"></i>fence</span></div></div>' : '';
  var gate = '';
  if (R.a >= 4 && !R.verified) {
    gate = '<div class="pcard rise" style="border-color:var(--primary)"><h4>' + ic('lock') + ' Verify to see your designs</h4><p class="tiny muted">Greenleaf sends a one-time code to protect your design and their AI budget. The code is not a marketing opt-in.</p>' +
      '<form class="fld mt6" data-form="otp"><label for="otp-email">Email</label><div class="inrow"><input id="otp-email" class="inp" type="email" value="ada.okafor@example.com" data-k="otp-email"><button type="submit" class="btn" data-k="otp-send">' + (R.code ? 'Resend' : 'Send code') + '</button></div></form>' +
      (R.code ? '<div class="mt6"><div class="codebox" aria-label="Code entered: ' + R.code.split('').join(' ') + '">' + R.code.split('').map(function (c) { return '<span>' + c + '</span>'; }).join('') + '</div><span class="tiny faint">Code autofilled from your email (simulated)</span></div>' : '') +
      '<label class="check mt6"><input type="checkbox" ' + (R.marketing ? 'checked' : '') + ' data-bind="run.marketing" data-k="otp-mkt"><span>Email me design tips and offers from Greenleaf (optional)</span></label>' +
      '<button type="button" class="btn primary mt6" style="justify-content:center;width:100%" data-act="verify" data-k="otp-verify"' + (R.code ? '' : ' disabled') + '>Verify and show my designs</button></div>';
  }
  var b = '';
  if (R.verified) {
    b = RUN_B.map(function (t, i) { return runItem(t, R.b > i ? 'done' : (R.b === i ? 'run' : 'wait')); }).join('');
    if (R.b >= 2) b += '<div class="vthumbs rise">' + VORDER.map(function (k, i) { var ready = R.b >= 3 || i < 2; return '<div class="thumb" style="cursor:default">' + (ready ? '<span class="scene">' + variantScene(k).obj.svg + '</span>' : '<span class="ph0" style="aspect-ratio:16/11;display:grid;place-items:center"><span class="spin"></span></span>') + '<span>' + esc(VARIANTS[k].name) + ' · 4 variants</span></div>'; }).join('') + '</div>';
    if (R.b >= 3) b += '<button type="button" class="btn primary rise" style="justify-content:center" data-act="next" data-k="s04-next">See my designs ' + ic('arrow-r') + '</button>';
  }
  var running = (R.a < 4) || (R.verified && R.b < 3);
  var body = '<div class="flex" style="justify-content:space-between"><h2 class="ptitle">Designing your yard</h2>' + (running ? '<button type="button" class="btn xs" data-act="skip" data-k="skip">Skip</button>' : '') + '</div><p class="psub">In real life this takes about a minute. Your house, windows and patio are never repainted.</p><div class="runlist" aria-live="polite">' + a + '</div>' + mask + gate + (R.verified ? '<div class="runlist" aria-live="polite">' + b + '</div>' : '');
  return '<div class="dev-row">' + phone(body, { label: 'AI run on Ada\'s phone' }) + ctxCard('Four services, one pipeline', ['<b>Scene understanding:</b> segmentation with protected masks, metric depth, scale calibration from the dimensions Ada typed, and sun orientation.', '<b>Verification gate:</b> Greenleaf runs the widget in <span class="mono">verify_first</span> mode, the gate the widget ships with for design partners. Anonymous visitors see the mask preview only.', '<b>Plants first, pixels second:</b> the palette resolver picks KB plants for the Region before any image is generated, and the image model may only draw those plants.', '<b>Try it:</b> watch the trace on the right, send and enter the code, or press Skip.']) + '</div>';
};
BTS['s04-ai-working'] = function () {
  var R = S.run;
  var T = [
    ['photo.segment(shot 2)', '11 classes; protected: house, windows, door, AC', '1.9 s', R.a >= 1],
    ['photo.depth(shot 2)', 'Metric depth map (monocular), cached by photo hash', '0.8 s', R.a >= 1],
    ['scene.calibrate_scale', 'Card 1%, patio A-B 14 ft 1%, door 80 in 2%, width 62 ft 3% → ±4%', '0.2 s', R.a >= 2],
    ['scene.sun', 'Facade 218° SW; house bed ≈ 6.8 h, afternoon-heavy', '0.1 s', R.a >= 3],
    ['scene.analysis_saved', 'Scene Analysis v1 (immutable); mask preview shown', '40 ms', R.a >= 4],
    ['gate.verify (verify_first)', R.verified ? 'Ada verified a•••@example.com' : 'Waiting for Ada', '', R.verified, 'human'],
    ['region.palette("Central Ohio")', '86 plants in Greenleaf\'s palette (KB release 2026.11.06-1)', '0.1 s', R.b >= 1],
    ['kb.search_plants(constraints)', '41 candidates: deer A-B (C allowed at "some"), dog-safe, zone 6b + margin, clay OK, invasives blocked', '0.3 s', R.b >= 1],
    ['palette.resolve(4 styles)', 'Native 8 species · Modern 3 · Cottage 5 · Evergreen 3', '0.4 s', R.b >= 2],
    ['credits.hold(4 × 24)', '96 credits held from Greenleaf\'s widget pool', '20 ms', R.b >= 2],
    ['restyle.preview × 4', '16 images ≈ 1 MP, plant reference images attached, protected pixels composited back', '9.6 s', R.b >= 3],
    ['render.qa', 'Labels mapped to KB plants; 0 hallucination flags; C2PA stamped', '1.1 s', R.b >= 3],
    ['credits.settle', '96 settled', '15 ms', R.b >= 3]
  ];
  var firstPending = -1; T.forEach(function (t, i) { if (firstPending < 0 && !t[3]) firstPending = i; });
  return { what: 'Scene understanding runs once per photo and is reused by every mode. Greenleaf\'s widget uses the <span class="mono">verify_first</span> gate, so the visitor verifies before any credits are spent. Then the palette resolver chooses Central Ohio plants that pass Ada\'s constraints, and four restyle sets are painted with those plants only.',
    agents: [['Scene service', 'Segmentation, depth, scale, sun (self-hosted models)', false], ['Palette resolver + render queue', 'Mode A photo restyle via the AI Gateway', false]],
    trace: T.map(function (t, i) { return { c: t[0], r: t[1], ms: t[2], done: t[3], running: i === firstPending && (t[4] !== 'human'), human: t[4] === 'human' }; }),
    hitl: [['Ada', 'can correct masks ("this is a bed") and must verify before rendering.'], ['Greenleaf', 'controls the gate mode and a monthly widget cap (default 600 credits).']], levels: ['T0 analysis', 'Verify gate before spend'],
    credits: { n: 96, note: '4 website visualizer preview sets × 24 credits, drawn from Greenleaf\'s pool under the widget cap (' + (WIDGET_USED + 96) + ' of 600 used this month).' },
    tags: [['mvp', 'scene analysis, scale calibration, sun orientation, region-locked palettes, Mode A restyle, verification gate']],
    specs: 'Spec: 11 §4.2 AIM-UND-01 to -05, -07 · 11 §4.4 AIM-FID-01 · 11 §4.3 Mode A · 11 §4.6 AIM-AUD-01 gate modes · 11 §5.1 · 22 §4.4.1 (24 credits per set) · 24 C11-019' };
};

/* ---------- s05 mockups ---------- */
SCREEN['s05-mockups'] = function () {
  var key = S.variant, v = VARIANTS[key], vs = variantScene(key);
  S.cardFrom = vs.plants;
  var thumbs = '<div class="thumbs" role="group" aria-label="Style">' + VORDER.map(function (k) { return '<button type="button" class="thumb" aria-pressed="' + (k === key) + '" data-act="variant" data-v="' + k + '" data-k="var-' + k + '"><span class="scene">' + variantScene(k).obj.svg + '</span><span>' + esc(VARIANTS[k].short) + (S.favs[k] ? ' ♥' : '') + '</span></button>'; }).join('') + '</div>';
  var c = counts({ plants: vs.plants });
  var list = '<div class="plist">' + Object.keys(vs.nmap).map(function (sp) { var p = PLANTS[sp]; return '<button type="button" class="prow" data-act="card" data-sp="' + sp + '" data-k="row-' + sp + '"><span class="pn">' + vs.nmap[sp] + '</span><span>' + plantName(sp) + '<small>' + c[sp] + ' × ' + esc(p.size) + ' · deer ' + p.deer + ' · ' + esc(NATIVE_TXT[p.native]) + '</small></span>' + '<span class="rating r' + p.rr + '">' + p.rr + '/5</span></button>'; }).join('') + '</div>';
  var body = '<div class="flex" style="justify-content:space-between"><h2 class="ptitle">Your new backyard</h2><span class="okline tiny">' + ic('check') + 'a•••@example.com</span></div>' + thumbs +
    baHTML('p', beforeScene(), vs.obj) +
    '<div class="flex" style="justify-content:space-between"><span style="font-size:.8rem"><b>' + esc(v.name) + '</b> <span class="faint">· best of 4 · ' + Object.keys(vs.nmap).length + ' plant types</span></span><button type="button" class="btn xs" data-act="fav" data-k="fav" aria-pressed="' + !!S.favs[key] + '">' + (S.favs[key] ? '♥ Saved' : '♡ Save') + '</button></div>' +
    '<p class="tiny muted">' + esc(v.blurb) + '</p>' + list +
    '<p class="tiny faint">Not in this photo: your back-fence bed, behind the camera. It is part of your plan in the next step.</p>' +
    '<div class="pcard soft"><div class="ph"><span>Typical range for a design like this</span></div><b class="num" style="font-size:1rem">' + money(v.range[0]) + ' - ' + money(v.range[1]) + '</b> <span class="tiny faint">estimate, not a quote</span><div class="okline mt6">' + ic('check') + 'Overlaps your $15k-$20k budget</div></div>' +
    '<p class="disclaim">Artist rendering — plants and scale are approximate. Greenleaf\'s written plan and plant list are what gets installed.</p>' +
    '<div class="flex"><button type="button" class="btn sm" data-act="share" data-k="share">' + (S.share ? ic('check') + 'Vote link sent to Chidi' : ic('users') + 'Ask Chidi to vote') + '</button></div>' +
    '<div class="g2"><button type="button" class="btn ai" style="justify-content:center" data-act="goto" data-to="s06-assistant" data-k="s05-edit">' + ic('chat') + 'Edit with the assistant</button><button type="button" class="btn primary" style="justify-content:center" data-act="goto" data-to="s07-quote" data-k="s05-quote">Get a quote</button></div>';
  var big = '<aside class="big-view" aria-label="Enlarged view"><div class="cap">' + ic('eye', 's') + 'Enlarged view of Ada\'s screen, for this walkthrough. Same image, same labels.</div>' + baHTML('big', beforeScene(), vs.obj) + '<div class="card"><h3 style="font-size:.95rem">What is real here</h3><ul style="margin:6px 0 0;padding-left:18px;display:grid;gap:5px;font-size:.82rem;color:var(--text-2)"><li>Every numbered label is a plant from Greenleaf\'s curated Central Ohio palette, with its Region rating and deer rating from the KB.</li><li>The badge and disclaimer are fixed: tenants can reword the disclaimer but not remove it.</li><li><b>Try it:</b> switch styles, drag the before/after divider, open a plant card, save a favorite.</li></ul></div></aside>';
  return '<div class="dev-row">' + phone(body, { label: 'Results on Ada\'s phone', cards: true }) + big + '</div>';
};
BTS['s05-mockups'] = function () {
  var vs = variantScene(S.variant);
  return { what: 'Results of the four restyle sets. Labels come from the vision QA pass, which maps each painted plant region to the palette plant it was conditioned on. Opening a card is a plain Plant KB read. The price range comes from Greenleaf\'s Price Book assemblies, never from the image.',
    agents: [['Render QA labels', 'Region → KB plant id mapping from the run', false], ['Plant KB', 'Plant Region Profiles for Central Ohio', true]],
    trace: [{ c: 'kb.get_plant_cards', r: Object.keys(vs.nmap).length + ' Plant Region Profiles (' + esc(VARIANTS[S.variant].name) + ')', ms: '90 ms', det: 1, done: 1 }, { c: 'pricebook.range(style, dims)', r: money(VARIANTS[S.variant].range[0]) + '-' + money(VARIANTS[S.variant].range[1]) + ' from Greenleaf assemblies; labeled an estimate', ms: '40 ms', det: 1, done: 1 }, { c: 'session.favorite', r: Object.keys(S.favs).filter(function (k) { return S.favs[k]; }).map(function (k) { return VARIANTS[k].short; }).join(', ') || 'none yet', ms: '12 ms', det: 1, done: 1 }, { c: 'share.family_link', r: S.share ? 'Vote link sent; Chidi votes without verifying' : 'Not used yet', ms: '', det: 1, done: S.share }],
    hitl: [['Ada and Chidi', 'pick favorites. Favorites and votes travel with the lead to Greenleaf.']], levels: ['T0 reads'],
    credits: { n: 0, note: 'Browsing is free. An HD download of one favorite would be 20 credits.' },
    tags: [['mvp', 'labels linked to KB plants, "AI artist rendering" badge and disclaimer, plant cards, price range, family share']],
    specs: 'Spec: 11 §4.4 AIM-FID-04, AIM-FID-07, AIM-FID-08 · 11 §6.6 S5 wireframe · 12 KB-PRP-01 ratings · 06 §4.17.1' };
};

/* ---------- s06 assistant ---------- */
var PROMPTS = { deeper: 'Make the bed by the house 2 ft deeper', deer: 'Swap anything deer will eat', tree: 'Add a small tree for privacy on the left' };
function applyEdit(k, silent) {
  var before = wDesign(), bc = counts(before);
  S.edits[k] = true;
  var after = wDesign(), ac = counts(after);
  var msg = { k: k, user: PROMPTS[k] };
  if (k === 'deeper') {
    var dA = after.beds.A.area - before.beds.A.area;
    msg.ai = 'Done. The bed by the house (Bed A) is now ' + (S.dims.bedDepth + 2) + ' ft deep instead of ' + S.dims.bedDepth + '. I added 3 little bluestem to fill the new middle row so it still reads as layered, and kept the inkberry 3 ft off the foundation.';
    msg.diff = ['Bed A: ' + S.dims.bedDepth + ' ft → ' + (S.dims.bedDepth + 2) + ' ft deep · +' + Math.round(dA) + ' sq ft', '+3 little bluestem \'Standing Ovation\' #1', 'Mulch +' + (takeoff(after).mulch - takeoff(before).mulch).toFixed(1) + ' yd³ · lawn −' + Math.round(dA) + ' sq ft'];
    msg.val = 'Checked AC clearance, foundation spacing and bed depth ≥ 1.5 × largest shrub';
  } else if (k === 'deer') {
    var n = bc.phl || 0;
    msg.ai = 'Your favorite had ' + n + ' \'Jeana\' garden phlox, which deer occasionally browse hard (KB rating C). I swapped them for \'Claire Grace\' wild bergamot: same height, same July color, an Ohio native, and deer rated A. Everything else was already rated A or B.';
    msg.diff = [n + ' × Phlox paniculata \'Jeana\' (deer C) → ' + n + ' × Monarda fistulosa \'Claire Grace\' (deer A)', 'Bed C: 3 · rear border: 4', 'Price about the same'];
    msg.val = Math.round(deerShare(after) * after.plants.length) + ' of ' + after.plants.length + ' plants now deer A or B';
  } else {
    msg.ai = 'I added a small privacy bed by the left fence with a \'Taylor\' eastern red cedar: an Ohio-native evergreen that stays about 3-4 ft wide but grows past 20 ft, so it screens the neighbor\'s upstairs window without shading your beds. Five little bluestem soften its base. One flag: cedar hosts cedar-apple rust, so no apple trees nearby.';
    msg.diff = ['New Bed D · privacy bed · ' + Math.round(after.beds.D.area) + ' sq ft', '+1 Juniperus virginiana \'Taylor\' 6-7 ft · +5 little bluestem', 'Edging +' + Math.round(after.beds.D.edge) + ' LF'];
    msg.val = '4 ft off the fence, clear of the AC; deer B; dog: not flagged';
  }
  msg.plants = after.plants.length;
  S.chat.push(msg); S.lastEdit = k;
  if (!silent) S.typing = null;
}
SCREEN['s06-assistant'] = function () {
  var des = wDesign(), nm = numberMap(des.plants.filter(function (q) { return q.bed !== 'B'; }).concat(des.plants));
  var hl = S.lastEdit === 'deeper' ? ['A'] : S.lastEdit === 'tree' ? ['D'] : null;
  var hot = S.lastEdit === 'deer' ? ['mon'] : null;
  var photo = scenePhoto({ des: des, numberMap: nm, highlight: hl, highlightPlants: hot, ariaLabel: 'Plan-to-photo rendering of the edited design: ' + des.plants.length + ' plants' });
  S.cardFrom = des.plants;
  var plan = planSVG(des, { mini: true, labels: 'num', nmap: nm, highlight: hl, hotSp: hot, layers: { sun: false, util: false }, year: 3, aria: 'To-scale plan of the edited design with ' + Object.keys(des.beds).length + ' beds and ' + des.plants.length + ' plants, numbered like the photo' });
  var chip = S.lastEdit ? '<span class="pill ai">' + ic('spark', 's') + 'Re-painted: ' + (S.lastEdit === 'deeper' ? 'Bed A' : S.lastEdit === 'deer' ? 'bergamot' : 'Bed D') + '</span>' : '';
  var chat = '<div class="msg ai"><span class="who">' + ic('spark', 's') + 'Greenleaf design assistant</span>Hi Ada! I turned your Native pollinator favorite into a to-scale plan from your measurements: ' + (3 + (S.edits.tree ? 0 : 0)) + ' beds, 61 plants. What would you like to change?<div class="diff"><div class="dh"><span>Plan created</span><span class="cost">3 + 20 credits</span></div><ul><li>Bed A by the house · Bed B along the back fence · Bed C by the patio</li><li>Photo re-rendered to match the plan exactly</li></ul></div></div>';
  S.chat.forEach(function (m) {
    chat += '<div class="msg me">' + esc(m.user) + '</div><div class="msg ai rise"><span class="who">' + ic('spark', 's') + 'Greenleaf design assistant</span>' + esc(m.ai) + '<div class="diff"><div class="dh"><span>Plan change</span><span class="cost">2 + 8 credits</span></div><ul>' + m.diff.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul><div class="val">' + ic('check', 's') + esc(m.val) + '</div><div class="flex mt6"><button type="button" class="btn xs" data-act="undo" data-v="' + m.k + '" data-k="undo-' + m.k + '">Undo</button><span class="tiny faint">Plants now: ' + m.plants + '</span></div></div></div>';
  });
  if (S.typing) chat += '<div class="msg me">' + esc(PROMPTS[S.typing]) + '</div><div class="msg ai"><span class="who">' + ic('spark', 's') + 'Thinking · checking the plan</span><span class="typing"><i></i><i></i><i></i></span></div>';
  var allDone = S.edits.deeper && S.edits.deer && S.edits.tree;
  var sugg = '<div class="chips" role="group" aria-label="Suggested requests">' + Object.keys(PROMPTS).map(function (k) { return '<button type="button" class="chip ai" data-act="prompt" data-v="' + k + '" data-k="pr-' + k + '"' + (S.edits[k] || S.typing ? ' disabled' : '') + '>' + ic('spark', 's') + esc(PROMPTS[k]) + '</button>'; }).join('') + '</div>';
  var body = '<div class="flex" style="justify-content:space-between"><h2 class="ptitle" style="font-size:1.15rem">Edit your design</h2>' + chip + '</div>' +
    sceneHTML(photo, { key: 'a6' }) +
    '<div class="plan-wrap">' + plan + '</div><p class="tiny faint">Same numbers in the photo and the plan: the plan is the source of truth, and the photo is re-painted from it.</p>' +
    '<div class="chat" aria-live="polite">' + chat + '</div>' + (allDone ? '' : sugg) +
    '<form class="inrow" data-form="chat"><input class="inp" placeholder="Ask for a change…" aria-label="Ask the design assistant for a change" data-k="chat-in"><button class="btn ai" type="submit" data-k="chat-send" aria-label="Send">' + ic('send') + '</button></form>' +
    (allDone ? '<div class="pcard soft rise"><b style="font-size:.82rem">Your design: ' + Object.keys(des.beds).length + ' beds · ' + des.plants.length + ' plants · Ohio-native ' + Math.round(nativeShare(des) * 100) + '% · deer A/B ' + Math.round(deerShare(des) * 100) + '%</b><button type="button" class="btn primary mt6" style="width:100%;justify-content:center" data-act="next" data-k="s06-next">Get a quote with this design ' + ic('arrow-r') + '</button></div>' : '');
  var big = '<aside class="big-view" aria-label="Enlarged view"><div class="cap">' + ic('eye', 's') + 'Enlarged view of Ada\'s screen: photo and plan, linked.</div>' + sceneHTML(photo, { key: 'b6' }) + '<div class="plan-wrap">' + planSVG(des, { labels: 'num', nmap: nm, highlight: hl, hotSp: hot, layers: { sun: false, util: false }, year: 3, aria: 'Enlarged to-scale plan' }) + '</div><div class="card"><ul style="margin:0;padding-left:18px;display:grid;gap:5px;font-size:.82rem;color:var(--text-2)"><li>Each request becomes a plan command (resize a bed, swap plants, add a feature), then validation, then a re-paint of only the changed area.</li><li><b>Try it:</b> click the three suggestions. Watch Bed A grow, the phlox become bergamot, and the cedar appear on the left in both views.</li></ul></div></aside>';
  return '<div class="dev-row">' + phone(body, { label: 'Design assistant on Ada\'s phone', cards: true }) + big + '</div>';
};
BTS['s06-assistant'] = function () {
  var tr = [{ c: 'layout.starter_plan(dims, favorite)', r: 'Solver places the favorite\'s labeled plants in beds sized from the form: 3 beds, 61 plants', ms: '1.2 s', done: 1 }, { c: 'palette.recommend', r: 'Fills the back-fence bed from the same palette', ms: '0.6 s', done: 1 }, { c: 'render.plan_to_photo', r: 'Photo 2 re-rendered from the plan; labels = plan ids', ms: '14 s', done: 1 }];
  var steps = { deeper: ['design.select_objects("bed by the house")', 'Bed A (confidence 0.97)', 'design.resize_bed(A, lawn edge, +2 ft)', 'solver adds 3 SCH SO; layout.validate: OK', 'render.region(Bed A)'], deer: ['kb.check(deer, palette)', '7 PHL JE rated C; all others A-B', 'design.swap_plants(PHL JE → role match)', '3 options; chose MON CG (deer A, Ohio native)', 'render.region(bergamot)'], tree: ['design.add_feature(tree, "left")', 'Privacy bed by the left fence', 'kb.search_plants(small tree, evergreen, narrow, deer A-B)', 'JUN TAY; layout.validate: AC clearance OK', 'render.region(Bed D)'] };
  Object.keys(steps).forEach(function (k) { var s = steps[k], d = S.edits[k]; tr.push({ c: s[0], r: s[1], ms: '0.4 s', done: d, running: S.typing === k }); tr.push({ c: s[2], r: s[3], ms: '0.9 s', done: d, running: S.typing === k }); tr.push({ c: s[4], r: 'Targeted re-render, 8 credits', ms: '11 s', done: d }); });
  var n = ['deeper', 'deer', 'tree'].filter(function (k) { return S.edits[k]; }).length;
  return { what: 'The design assistant is a scoped Copilot agent with design tools. Every request goes through the design command bus, so it is undoable and audited, and it can only use plants from the KB. The photo is re-painted from the plan, never the other way round.',
    agents: [['Design Assistant (A24)', 'Scoped agent: intent → plan commands → validation → re-render', false]],
    trace: tr,
    hitl: [['Ada', 'asks for each change and can undo any of them. Credits are quoted before work starts (shown on each diff card).'], ['Greenleaf', 'pays from its widget pool and sees every edit on the lead.']], levels: ['T1 plan drafts', 'Undoable diff cards'],
    credits: { n: 53, note: 'Starter plan 3 + plan-to-photo 20, then 2 per committed chat turn + 8 per targeted re-render. Edits made: ' + n + ' of 3.' },
    tags: [['v1', 'design assistant (AIM-GEN-D) and plan-to-photo (AIM-GEN-B) are V1 and specified for designers'], ['v2', 'opening the assistant to homeowners inside the widget is this walkthrough\'s proposal, not yet in the spec (compare C06-016 client plant swaps, V2)']],
    specs: 'Spec: 11 §4.3 AIM-GEN-D (tool surface, intent catalog) · 11 §5.5 Mode D · 11 §4.5 AIM-SYNC-01, -03 · 17 A24 · 22 §4.4.1 (chat turn 1 or 2, re-render 8, plan-to-photo 20, palette 3)' };
};

/* ---------- s07 quote ---------- */
SCREEN['s07-quote'] = function () {
  var Q = S.quote, des = wDesign();
  if (Q.submitted) {
    var body0 = '<div class="pcard rise" style="text-align:center;padding:18px 12px"><div style="width:52px;height:52px;border-radius:50%;background:var(--ok-bg);display:grid;place-items:center;margin:0 auto">' + ic('check') + '</div><h2 class="ptitle">You\'re all set, Ada!</h2><p class="psub mt6">Greenleaf usually replies within a few minutes during business hours. Sam Kowalski, their estimator, will reach out ' + (Q.sms ? 'by text' : 'by email') + ' to book a visit.</p><div class="mt10"><span class="event">lead.created · LEAD-4417</span></div></div>' +
      '<div class="pcard soft"><h4>What Greenleaf receives</h4><ul style="margin:0;padding-left:18px;font-size:.76rem;color:var(--text-2);display:grid;gap:3px"><li>3 photos with masks and the scale calibration</li><li>Your dimensions and the 5 answers</li><li>4 style sets, favorites and Chidi\'s vote</li><li>The edited plan: ' + des.plants.length + ' plants in ' + Object.keys(des.beds).length + ' beds</li></ul></div>' +
      '<button type="button" class="btn primary" style="justify-content:center" data-act="next" data-k="s07-next">See what happens at Greenleaf ' + ic('arrow-r') + '</button>';
    return '<div class="dev-row">' + phone(body0, { label: 'Quote request confirmation' }) + ctxCard('From visitor to qualified lead', ['The session converts into a Lead with every artifact attached, so the site visit starts from a real plan.', 'Consent is recorded per channel with the exact text shown. Training use of photos stays off unless Ada opted in.']) + '</div>';
  }
  var ph = S.quote.phoneOk;
  var body = '<h2 class="ptitle">Get a quote from Greenleaf</h2><p class="psub">A designer visits, measures, and turns this into a real plan and price.</p>' +
    '<div class="pcard" style="display:grid;grid-template-columns:110px 1fr;gap:9px;align-items:center"><span class="scene" style="aspect-ratio:16/11">' + scenePhoto({ des: des, numberMap: {}, ariaLabel: 'Your saved design' }).svg + '</span><span style="font-size:.76rem"><b>Native pollinator · edited 3 times</b><br>' + Object.keys(des.beds).length + ' beds · ' + des.plants.length + ' plants<br><span class="num">Typical range $16,800-$18,900</span><span class="okline">' + ic('check') + 'Inside your budget</span></span></div>' +
    '<form data-form="quote" class="pbody-pad" style="padding:0;gap:9px">' +
    '<div class="g2"><label class="fld">Name<input class="inp" value="Ada Okafor" autocomplete="name" data-k="q-name"></label><label class="fld">Partner (optional)<input class="inp" value="Chidi Okafor" data-k="q-p"></label></div>' +
    '<label class="fld">Email<span class="inrow"><input class="inp" value="ada.okafor@example.com" readonly data-k="q-email"><span class="okline">' + ic('check') + 'verified</span></span></label>' +
    '<div class="fld"><label for="q-phone">Mobile</label><div class="inrow"><input id="q-phone" class="inp" value="(614) 555-0142" autocomplete="tel" data-k="q-phone"' + (ph ? ' readonly' : '') + '>' + (ph ? '<span class="okline">' + ic('check') + 'verified</span>' : '<button type="button" class="btn sm" data-act="qcode" data-k="q-code">' + (Q.code ? 'Resend' : 'Text me a code') + '</button>') + '</div>' +
    (Q.code && !ph ? '<div class="inrow mt6"><div class="codebox" aria-label="Code ' + Q.code.split('').join(' ') + '">' + Q.code.split('').map(function (c) { return '<span>' + c + '</span>'; }).join('') + '</div><button type="button" class="btn sm primary" data-act="qverify" data-k="q-verify">Verify</button></div><span class="hint">Code autofilled from the text message (simulated). One-time codes are transactional, not marketing.</span>' : '') + '</div>' +
    '<div class="fld">Best times for a visit<div class="chips">' + [['am', 'Weekday mornings'], ['pm', 'Weekday afternoons'], ['sat', 'Saturdays']].map(function (t) { return '<button type="button" class="chip" aria-pressed="' + !!Q.times[t[0]] + '" data-act="qtime" data-v="' + t[0] + '" data-k="qt-' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div></div>' +
    '<label class="fld">Anything we should know?<textarea class="inp" rows="3" data-k="q-notes">Our Lab uses the back corner. The left corner by the downspout stays wet after storms.</textarea></label>' +
    '<label class="check"><input type="checkbox" ' + (Q.sms ? 'checked' : '') + ' data-bind="quote.sms" data-k="q-sms"><span>Text me about this project (visit scheduling and project updates). Msg and data rates may apply. Reply STOP to opt out.</span></label>' +
    '<label class="check"><input type="checkbox" ' + (Q.mkt ? 'checked' : '') + ' data-bind="quote.mkt" data-k="q-mkt"><span>Send me seasonal tips and offers from Greenleaf.</span></label>' +
    '<label class="check"><input type="checkbox" ' + (Q.train ? 'checked' : '') + ' data-bind="quote.train" data-k="q-train"><span>Let Rootline use my photos to improve its AI (off unless you choose it).</span></label>' +
    '<p class="disclaim">Greenleaf Grounds Co. and Rootline will use your photos to prepare your design.</p>' +
    '<button type="submit" class="btn primary" style="justify-content:center" data-k="q-submit"' + (ph ? '' : ' disabled') + '>Request my free design visit</button>' + (ph ? '' : '<span class="hint" style="text-align:center">Verify your mobile number first</span>') + '</form>';
  return '<div class="dev-row">' + phone(body, { label: 'Quote request form on Ada\'s phone' }) + ctxCard('Consent that holds up', ['The three checkboxes are separate and unticked by default: project texts, marketing, and AI training use of photos.', 'Verifying the phone lets Greenleaf\'s Lead Follow-up agent text Ada, but only if she ticks project texts. Otherwise the agent uses email.', '<b>Try it:</b> text a code, verify, tick "Text me about this project", then request the visit.']) + '</div>';
};
BTS['s07-quote'] = function () {
  var Q = S.quote;
  return { what: 'The visualizer session becomes a Lead in Greenleaf\'s CRM with every artifact attached. The one-time code proves the phone number; consent is stored per channel with the exact wording, so later agents check it at send time.',
    agents: [['Lead pipeline (CRM)', 'Session → Lead conversion and consent ledger', true]],
    trace: [{ c: 'otp.send(sms)', r: Q.code ? 'Transactional code to (614) 555-0142' : 'Not sent yet', ms: '0.8 s', det: 1, done: !!Q.code }, { c: 'otp.verify', r: Q.phoneOk ? 'Mobile verified' : 'Waiting', ms: '30 ms', det: 1, done: Q.phoneOk, human: !Q.phoneOk }, { c: 'consent.record', r: 'Project texts: ' + (Q.sms ? 'yes' : 'no') + ' · marketing: ' + (Q.mkt ? 'yes' : 'no') + ' · AI training: ' + (Q.train ? 'yes' : 'no') + ' (text v3, timestamp)', ms: '15 ms', det: 1, done: Q.submitted }, { c: 'lead.create(session)', r: 'LEAD-4417: photos, masks, dimensions, 4 sets, favorites, 3 edits, budget', ms: '0.2 s', det: 1, done: Q.submitted }, { c: 'lead.score', r: '86/100: verified, budget match, 3 edits, partner vote', ms: '40 ms', det: 1, done: Q.submitted }, { c: 'event lead.created', r: 'Lead Follow-up agent (A3) triggered; office manager notified', ms: '', det: 1, done: Q.submitted }],
    hitl: [['Ada', 'chooses each consent separately; nothing is pre-ticked.'], ['Tasha Greene', '(office manager) is notified of the new lead.']], levels: ['T2 internal write: lead created'],
    credits: { n: 0, note: 'Creating the lead uses no AI credits.' },
    tags: [['mvp', 'lead capture, one-time codes, consent ledger'], ['v1', 'lead scoring']],
    specs: 'Spec: 11 §5.1 steps 7-10 · 11 §4.6 AIM-AUD-01 consent and lead quality signals · 03 (Lead Inbox) · 16 (consent ledger) · 17 §4.5.4 trigger' };
};
