/* Walkthrough: Design Studio in depth (doc 10, with 03, 06, 11, 12, 13, 14).
   The Harmon front yard, 77 Kenyonbrook Dr, Worthington, Ohio (fictional). Plan scale: 6 px = 1 ft. */

var DS_NAV = [['today', 'Today'], ['users', 'Clients'], ['pen', 'Design'], ['dollar', 'Sales'], ['calendar', 'Schedule'], ['clipboard', 'Jobs'], ['leaf', 'Plant KB'], ['cog', 'Settings']];
function dsShell(main) { return appShell('Design', main, { nav: DS_NAV, navLabel: 'Design Studio navigation (concept)' }); }
function tools(on) { var t = ['Select', 'Measure', 'Bed', 'Turf', 'Hardscape', 'Plants', 'Lighting', 'Irrigation', 'Text', 'Layers']; return '<div class="ds-tools">' + t.map(function (x) { return '<span class="t' + (x === on ? ' on' : '') + '">' + x + '</span>'; }).join('') + '</div>'; }

/* Plan drawing. o: { stage, moved, wide, option, sun, lights, irr, pins, tpz, carex, extraUp } */
function planSVG(o) {
  o = o || {};
  var s = '<svg class="wt-svg" viewBox="0 0 560 350" role="img" aria-label="' + esc(o.label || 'To-scale plan of the Harmon front yard') + '" style="background:#dfe8d2">';
  s += '<rect x="0" y="322" width="560" height="28" fill="#c9c6bf"/><text x="12" y="340" font-size="10" fill="#555">Kenyonbrook Dr</text>';
  s += '<rect x="8" y="8" width="544" height="310" fill="none" stroke="#8a8174" stroke-dasharray="6 4"/><text x="476" y="20" font-size="8" fill="#8a8174">Approx. parcel line</text>';
  s += '<rect x="420" y="60" width="70" height="262" fill="#cfcac2"/><text x="432" y="300" font-size="9" fill="#666">Drive</text>';
  s += '<rect x="150" y="14" width="250" height="110" fill="#d8d2c8" stroke="#8a8174"/><text x="255" y="72" font-size="11" fill="#6b6359">House</text><rect x="245" y="124" width="60" height="26" fill="#e3ddd3" stroke="#8a8174"/><text x="258" y="141" font-size="8" fill="#6b6359">Porch</text>';
  if (o.sun) s += '<rect x="150" y="124" width="250" height="20" fill="#5b7fa8" opacity=".35"/><rect x="150" y="144" width="250" height="26" fill="#e8a33a" opacity=".35"/><rect x="8" y="170" width="544" height="150" fill="#f2d24b" opacity=".22"/><text x="404" y="138" font-size="8" fill="#2f4f75">Part shade 2-4 h</text><text x="404" y="160" font-size="8" fill="#8a5a12">Part sun 4-6 h</text><text x="404" y="190" font-size="8" fill="#6b5a00">Full sun 6 h+</text>';
  var bed = 'M150 124 H245 V150 H305 V124 H400 V170 Q352 196 306 186 Q240 178 150 196 Z';
  if (o.stage >= 1) s += '<path d="' + bed + '" fill="#b08a62" opacity=".55" stroke="#7a5a3a"/>';
  s += '<circle cx="95" cy="230" r="90" fill="#6b8f5a" opacity=".22"/><circle cx="95" cy="230" r="5" fill="#5a4030"/><text x="104" y="226" font-size="8" fill="#3b5530">Existing red maple, 14 in DBH</text>';
  if (o.tpz) s += '<circle cx="95" cy="230" r="84" fill="none" stroke="' + (o.tpz === 'bad' ? '#b0413e' : '#5f7d4c') + '" stroke-dasharray="4 3"/><text x="40" y="150" font-size="8" fill="' + (o.tpz === 'bad' ? '#b0413e' : '#5f7d4c') + '">Tree protection zone 14 ft</text>';
  if (o.stage >= 1) s += '<circle cx="95" cy="230" r="48" fill="#b08a62" opacity=".55" stroke="#7a5a3a"/>';
  if (o.stage >= 1) {
    var w = (o.wide ? 5 : 4) * 6;
    var d = o.option === 'B' ? 'M420 236 H275 V150' : (o.tpzPath ? 'M420 236 C330 236 200 236 170 200 C160 186 230 170 275 150' : 'M420 236 C360 236 330 214 300 196 C285 186 276 172 275 150');
    s += '<path d="' + d + '" fill="none" stroke="' + (o.option === 'B' ? '#b7aa96' : '#c4b59c') + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/><path d="' + d + '" fill="none" stroke="#8f8170" stroke-width="1" stroke-dasharray="' + (o.option === 'B' ? '3 3' : '7 4 3 5') + '"/>';
    s += '<text x="330" y="252" font-size="9" fill="#5a4e40">' + (o.option === 'B' ? 'Paver walk' : 'Flagstone walk') + ' ' + (o.wide ? '5\'-0"' : '4\'-0"') + ' wide · ' + (o.wide ? '190' : '152') + ' sq ft</text>';
  }
  if (o.stage >= 2) {
    var amX = o.moved ? 182 : 172, amY = o.moved ? 182 : 158, amR = o.year ? 45 * o.year : 45;
    s += '<circle cx="' + amX + '" cy="' + amY + '" r="' + amR + '" fill="#7aa36a" opacity=".28" stroke="' + (o.moved ? '#4e7a3e' : '#b0413e') + '" stroke-dasharray="' + (o.moved ? '0' : '4 3') + '"/><circle cx="' + amX + '" cy="' + amY + '" r="3" fill="#2f5a25"/><text x="' + (amX - 18) + '" y="' + (amY + 3) + '" font-size="7" fill="#2f4a25">AME AB</text>';
    [[165, 135], [185, 135], [205, 135], [225, 135], [340, 135], [365, 135], [390, 135]].forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="7.5" fill="#3f6b3a" opacity=".75"/>'; });
    [[210, 160], [330, 156], [372, 154]].forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="12" fill="#e9eedd" stroke="#6b8f5a"/><text x="' + (p[0] - 8) + '" y="' + (p[1] + 3) + '" font-size="6" fill="#3b5530">HYD</text>'; });
    var nep = o.nepMoved ? [[160, 190], [184, 186], [208, 182], [232, 180], [318, 184], [342, 182], [366, 177], [388, 172], [256, 180]] : [[165, 150], [235, 152], [312, 146], [355, 146], [384, 150], [190, 182], [290, 180], [345, 178], [255, 176]];
    nep.forEach(function (p, i) { var shade = !o.nepMoved && i < 5; s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="8" fill="#9b8fd1" opacity=".75" stroke="' + (shade && o.valid ? '#b0413e' : 'none') + '" stroke-width="1.5"/>'; });
    if (o.carex) { for (var yy = 188; yy <= 272; yy += 8) for (var xx = 51; xx <= 139; xx += 8) { var dx = xx + ((yy / 8) % 2 ? 4 : 0) - 95, dy = yy - 230, rr = Math.sqrt(dx * dx + dy * dy); if (rr < 45 && rr > 8) s += '<circle cx="' + (dx + 95) + '" cy="' + yy + '" r="1.6" fill="#4e7a3e"/>'; } }
  }
  if (o.lights) {
    var pl = o.option === 'B' ? [[400, 252], [360, 252], [320, 252], [292, 220], [292, 190], [292, 165]] : [[400, 252], [358, 250], [322, 226], [300, 212], [288, 186], [290, 162]];
    pl.forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="4" fill="#ffd27a" stroke="#7a5a1a"/>'; });
    var up = [[80, 214], [112, 246], [o.moved ? 196 : 186, o.moved ? 194 : 172]].concat(o.extraUp ? [[70, 252], [118, 208]] : []);
    up.forEach(function (p) { s += '<path d="M' + p[0] + ' ' + (p[1] - 5) + ' l4 9 h-8 z" fill="#ffb347" stroke="#7a4a10"/>'; });
    s += '<rect x="396" y="112" width="10" height="10" fill="#8fa3bf" stroke="#3d4f69"/><text x="408" y="121" font-size="7" fill="#3d4f69">TX 150 W</text>';
  }
  if (o.irr) s += '<path d="' + bed + '" fill="none" stroke="#2f6fb0" stroke-width="2" stroke-dasharray="5 3"/><circle cx="95" cy="230" r="50" fill="none" stroke="#2f6fb0" stroke-width="2" stroke-dasharray="5 3"/><text x="300" y="118" font-size="8" fill="#2f6fb0">Zone 7 drip (beds)</text><text x="54" y="292" font-size="8" fill="#2f6fb0">Zone 8 drip (island)</text>';
  if (o.pins) [[o.pinA || [338, 232], '1'], [[176, 210], '2']].forEach(function (p) { s += '<circle cx="' + p[0][0] + '" cy="' + p[0][1] + '" r="8" fill="#b0413e"/><text x="' + (p[0][0] - 3) + '" y="' + (p[0][1] + 3) + '" font-size="9" fill="#fff" font-weight="700">' + p[1] + '</text>'; });
  s += '<g transform="translate(24 290)"><path d="M0 -14 l5 10 h-10 z" fill="#555" transform="rotate(180)"/><text x="-3" y="20" font-size="8" fill="#555">N</text></g><g transform="translate(470 300)"><rect width="60" height="4" fill="#555"/><text x="0" y="-3" font-size="8" fill="#555">10 ft</text></g>';
  return s + '</svg>';
}

/* Front elevation with the growth slider and season toggle. */
function elevSVG(yr, season) {
  var g = { install: 0, y3: 0.4, y5: 0.65, y10: 0.92, mature: 1 }[yr];
  function sz(i, m) { return i + (m - i) * g; }
  var col = { spring: ['#fbfbf3', '#7fa36a', '#3f6b3a', '#8fb37a'], summer: ['#5f8f4e', '#f1f3e6', '#3f6b3a', '#a99be0'], fall: ['#c9572f', '#e2b5b0', '#3f6b3a', '#8b8f6a'], winter: ['none', '#c8b48f', '#3f6b3a', 'none'] }[season];
  var s = '<svg class="wt-svg" viewBox="0 0 560 200" role="img" aria-label="Front elevation, ' + yr + ', ' + season + '" style="background:' + (season === 'winter' ? '#eef1f4' : '#eef4f8') + '"><rect x="0" y="170" width="560" height="30" fill="' + (season === 'winter' ? '#f4f6f8' : '#b9cc9a') + '"/>';
  s += '<rect x="150" y="80" width="250" height="90" fill="#d8d2c8" stroke="#8a8174"/><path d="M140 80 L275 30 L410 80 Z" fill="#9b8f80"/><rect x="262" y="120" width="26" height="50" fill="#7a5a3a"/>';
  s += '<rect x="56" y="70" width="8" height="100" fill="#5a4030"/>' + (season === 'winter' ? '<path d="M60 70 l-30 -40 M60 70 l28 -44 M60 90 l-38 -20 M60 90 l40 -18" stroke="#5a4030" stroke-width="2"/>' : '<ellipse cx="60" cy="50" rx="58" ry="48" fill="' + (season === 'fall' ? '#c23b22' : '#6b8f5a') + '" opacity=".85"/>');
  var h = sz(7, 20) * 5, w = sz(3, 15) * 5; var x = 182;
  s += '<rect x="' + (x - 2) + '" y="' + (170 - h * 0.35) + '" width="4" height="' + (h * 0.35) + '" fill="#6b5040"/>' + (col[0] === 'none' ? '<path d="M' + x + ' ' + (170 - h * 0.35) + ' l-' + (w / 2) + ' -' + (h * 0.6) + ' M' + x + ' ' + (170 - h * 0.35) + ' l' + (w / 2) + ' -' + (h * 0.6) + '" stroke="#6b5040" stroke-width="1.5"/>' : '<ellipse cx="' + x + '" cy="' + (170 - h * 0.65) + '" rx="' + (w / 2) + '" ry="' + (h * 0.35) + '" fill="' + col[0] + '" stroke="#6b8f5a"/>');
  [215, 330, 372].forEach(function (cx) { var hh = sz(1.5, 3.5) * 5, ww = sz(1.5, 4) * 5; s += '<ellipse cx="' + cx + '" cy="' + (170 - hh / 2) + '" rx="' + (ww / 2) + '" ry="' + (hh / 2) + '" fill="' + col[1] + '" stroke="#6b8f5a"/>'; });
  [235, 300, 352, 392].forEach(function (cx) { var hh = sz(1, 2.5) * 5; s += '<ellipse cx="' + cx + '" cy="' + (170 - hh / 2) + '" rx="' + (hh / 2) + '" ry="' + (hh / 2) + '" fill="' + col[2] + '"/>'; });
  if (col[3] !== 'none') [200, 250, 316, 360].forEach(function (cx) { var hh = sz(0.8, 1.5) * 5, ww = sz(0.8, 2.5) * 5; s += '<ellipse cx="' + cx + '" cy="' + (172 - hh / 2) + '" rx="' + (ww / 2) + '" ry="' + (hh / 2) + '" fill="' + col[3] + '" opacity=".9"/>'; });
  return s + '<text x="430" y="20" font-size="10" fill="#555">' + { install: 'Install', y3: 'Year 3', y5: 'Year 5', y10: 'Year 10', mature: 'Maturity' }[yr] + ' · ' + season + '</text></svg>';
}

var WT = {
  title: 'Rootline walkthrough: Design Studio in depth',
  short: 'Design Studio in depth',
  ovTitle: 'Design Studio in depth',
  startLeft: 4204,
  acts: [
    { n: 'Act 1', t: 'Site', sub: 'Address to site model, on-site sketch' },
    { n: 'Act 2', t: 'Design', sub: 'Hardscape, plants, sun, 3D, lighting, irrigation' },
    { n: 'Act 3', t: 'Sell', sub: 'Takeoff, options, client markup, plan set' },
    { n: 'Act 4', t: 'Build', sub: 'Change order and as-built' }
  ],
  steps: [
    { id: 'ds01-site', act: 0, short: 'Site model', title: 'An address becomes a to-scale site model', who: 'Jess Morales', tags: ['mvp', 'v1'] },
    { id: 'ds02-ipad', act: 0, short: 'On site', title: 'An offline site visit on the iPad', who: 'Jess, the Harmons', tags: ['mvp', 'v1'] },
    { id: 'ds03-hardscape', act: 1, short: 'Beds and walk', title: 'Beds and a flagstone walk, drawn to scale', who: 'Jess', tags: ['mvp'] },
    { id: 'ds04-plants', act: 1, short: 'Plants', title: 'Plants from the regional KB, checked live', who: 'Jess', tags: ['mvp'] },
    { id: 'ds05-sun3d', act: 1, short: 'Sun and 3D', title: 'Sun study, then 3D with growth and seasons', who: 'Jess', tags: ['v1'] },
    { id: 'ds06-layers', act: 1, short: 'Lighting and irrigation', title: 'Lighting and drip irrigation layers', who: 'Jess', tags: ['v1'] },
    { id: 'ds07-takeoff', act: 2, short: 'Takeoff', title: 'The design is the estimate', who: 'Jess, Sam Kowalski', tags: ['mvp'] },
    { id: 'ds08-options', act: 2, short: 'Options', title: 'Options, versions and a photo of the plan', who: 'Jess', ai: true, tags: ['mvp', 'v1'] },
    { id: 'ds09-markup', act: 2, short: 'Client markup', title: 'The Harmons mark up the plan in the portal', who: 'Kate Harmon, Jess', tags: ['v1'] },
    { id: 'ds10-planset', act: 2, short: 'Plan set', title: 'A plan set for the client and the crew', who: 'Jess', tags: ['mvp', 'v1'] },
    { id: 'ds11-change', act: 3, short: 'Change order', title: 'A change after the sale', who: 'Kate, Sam', tags: ['mvp'] },
    { id: 'ds12-asbuilt', act: 3, short: 'As-built', title: 'As-built: the plan becomes the property record', who: 'Andrés Vega, Jess', tags: ['v1'] },
    { id: 'ds13-recap', act: 3, short: 'Recap', title: 'Recap: one record from address to as-built', who: 'Everyone', tags: [] }
  ],
  credits: { 'ds08-options': 20 },
  state: { site: 0, trace: false, pins: false, synced: false, drawn: false, tpzFixed: false, placed: false, moved: false, nepMoved: false, carex: false, sun: false, yr: 'install', season: 'spring', lights: false, irr: false, hydro: false, pushed: false, option: 'A', render: false, shared: false, c1: false, c2: false, approved: false, exported: false, co: 0, asbuilt: false },
  ov: {
    eyebrow: 'Clickable walkthrough · Design Studio',
    h: 'A to-scale plan that prices itself, checks every plant against the region, and becomes the crew\'s construction set and the property\'s record.',
    lede: 'The AI design walkthrough shows a homeowner and the agents. This one follows the designer\'s craft. Jess Morales designs the Harmons\' front yard in Worthington: an address becomes a site model, an offline iPad visit, beds and a flagstone walk with base specs, plants from the Central Ohio KB with live validation, a sun study and 3D growth, lighting and drip layers, a takeoff pushed into an estimate, options and versions, client markup in the portal, a plan set, a change order after the sale and the as-built.',
    cast: [
      { h: 'Greenleaf', icon: 'building', items: [['Jess Morales', 'designer'], ['Sam Kowalski', 'estimator'], ['Andrés Vega', 'Crew 1 lead, installs']] },
      { h: 'Clients', icon: 'users', items: [['Kate and Ben Harmon', '77 Kenyonbrook Dr, Worthington (fictional)']] },
      { h: 'Engines', icon: 'cog', items: [['Site model', 'parcel, imagery, footprint, terrain'], ['Validation engine', 'zone, region rating, legal status, sun, deer, hydrozone, setbacks'], ['Takeoff rules', 'geometry to price-book quantities']] }
    ],
    extra: '<p class="wt-note mt14">Scale 1 ft = 6 px on the plan. Prices are illustrative. "Approximate parcel line, not a survey" appears on every plan.</p>'
  },
  screens: {}, bts: {}, actions: {}, inputs: {}, ensure: {}
};

/* ds01 */
WT.screens['ds01-site'] = function (S) {
  var states = ['pending', 'imagery_ready', 'parcel_ready', 'terrain_ready', 'ready'];
  var main = '<div class="apphead"><span class="crumb">Design › New</span><h3>77 Kenyonbrook Dr, Worthington</h3>' + pill(S.site >= 4 ? 'ok' : 'info', states[S.site]) + '</div>' +
    '<div class="wt-cols wide-left"><div><div class="ds-canvas">' + (S.site >= 1 ? planSVG({ stage: 0, tpz: S.site >= 4 ? 'ok' : '' }) : '<div style="height:240px;display:grid;place-items:center;color:#4b453b" class="tiny">Fetching imagery…</div>') + '</div></div>' +
    '<div class="wt-stack"><div class="panel"><h4>Site model</h4><dl class="kv"><dt>Imagery</dt><dd>' + (S.site >= 1 ? 'captured Jun 2026' : '…') + '</dd><dt>Parcel</dt><dd>' + (S.site >= 2 ? '0.31 ac · approximate, not a survey' : '…') + '</dd><dt>Footprint</dt><dd>' + (S.site >= 2 ? '42 × 18 ft, roof ridge 24 ft' : '…') + '</dd><dt>Terrain ' + tag('v1') + '</dt><dd>' + (S.site >= 3 ? '1 m lidar · 4% fall to the street; low spot at the NE downspout' : '…') + '</dd><dt>Region</dt><dd>Central Ohio · zone 6b · deer pressure high</dd></dl>' +
    (S.site < 4 ? '<button type="button" class="btn sm primary mt10" data-act="site" data-k="site">' + (S.site === 0 ? 'Build the site model' : 'Continue') + '</button>' : '') + '</div>' +
    '<div class="panel"><h4>Existing conditions ' + tag('v1') + '</h4>' + (S.trace ? '<div class="tiny">AI traced turf, the drive, one tree canopy and the house. 2 low-confidence edges highlighted. Jess tagged the tree: red maple, 14 in DBH, keep and protect (ring at 1 ft per inch).</div>' : '<button type="button" class="btn sm" data-act="trace" data-k="trace"' + (S.site >= 4 ? '' : ' disabled') + '>Auto-trace existing features</button>') + '</div></div></div>';
  return browser('app.rootline.com/design/harmon/site', dsShell(main), 'Design Studio: site model');
};
WT.actions.site = function (el, S) { if (S.site === 0) { S.site = 1; later(function () { S.site = 2; }, 500); later(function () { S.site = 3; }, 1000); later(function () { S.site = 4; }, 1500); } else S.site = 4; };
WT.actions.trace = function (el, S) { S.trace = true; };
WT.ensure['ds01-site'] = function (S) { S.site = 4; S.trace = true; };
WT.bts['ds01-site'] = function (S) {
  return {
    what: 'Typing the address starts parallel jobs for imagery, the parcel, the house footprint and terrain. Jess can start drawing as soon as imagery arrives. The parcel is always labeled approximate, not a survey. Terrain from public lidar gives slope and low spots; AI traces existing turf, beds, trees and paving into editable objects with confidence scores.',
    agents: [['Site model workflow', 'Imagery, parcel, footprint, terrain jobs', 1], ['Auto-trace [V1]', 'Segments existing conditions with confidence', 0]],
    trace: [{ c: 'geocode(77 Kenyonbrook Dr)', r: 'parcel centroid set as origin', ms: '300 ms', det: true }, { c: 'imagery + parcel + footprint', r: S.site >= 2 ? 'ready' : 'fetching', ms: S.site >= 2 ? '4 s' : '', det: true, running: S.site > 0 && S.site < 2, pending: S.site === 0 }, { c: 'terrain(USGS 1 m DEM)', r: S.site >= 3 ? 'slope 4%, 1 sink' : '', ms: S.site >= 3 ? '9 s' : '', det: true, pending: S.site < 3 }, { c: 'autotrace(existing)', r: S.trace ? '5 objects, 2 edges < 0.6' : 'not run', ms: S.trace ? '6 s' : '', pending: !S.trace }],
    hitl: [['Jess', 'confirms the traced edges and tags the tree to keep.']],
    creditNote: 'Building the site model and auto-tracing are included in the Design Studio seat.',
    tags: [['mvp', 'address to site, parcel, imagery, footprints, measurement'], ['v1', 'terrain and slope, AI auto-trace, site model versions']],
    specs: 'Spec: 10 §4.1 (DS-SITE-01 to 11), §5.1 · 12 (Region lookup)'
  };
};

/* ds02 */
WT.screens['ds02-ipad'] = function (S) {
  var ipad = '<div class="phone pt-phone" style="width:min(100%,520px);aspect-ratio:auto" role="group" aria-label="iPad: on-site sketch mode"><div class="status"><span>10:14</span><span class="bat">' + (S.synced ? '5G ' : ic('wifi-off', 's') + ' Offline ') + ic('battery', 's') + '</span></div><div class="body pt-pbody" style="padding:8px">' +
    '<div class="flex" style="justify-content:space-between"><b class="tiny">Harmon · on-site sketch</b>' + (S.synced ? pill('ok', 'Synced') : pill('warn', 'Offline · saved on iPad')) + '</div><div class="ds-canvas mt6">' + planSVG({ stage: 0, tpz: 'ok', pins: S.pins, pinA: [430, 180] }) + '</div>' +
    '<div class="flex mt6">' + (S.pins ? pill('', '2 photo pins · 3 notes') : '<button type="button" class="btn xs" data-act="pins" data-k="pins">' + ic('camera') + 'Pin photos and notes</button>') + (S.pins && !S.synced ? '<button type="button" class="btn xs primary" data-act="synced" data-k="synced">Back in signal: sync</button>' : '') + '</div></div></div>';
  var notes = '<div class="wt-stack" style="flex:1 1 300px;min-width:0"><div class="panel"><h4>From the walk with Kate and Ben</h4><ul style="margin:0;padding-left:18px;font-size:.78rem;color:var(--text-2);display:grid;gap:4px"><li>Want a walk from the drive to the porch; they cut across the lawn today</li><li>"Something that flowers in spring by the corner window"</li><li>Low-voltage lights on the walk; they have a smart controller with 2 spare stations</li><li>Keep the maple; deer every night</li></ul></div>' +
    '<div class="panel soft tiny">Today\'s and tomorrow\'s site visits are cached on the iPad automatically: the design, imagery, parcel, terrain and the Central Ohio plant list. Edits merge on sync with nothing lost.</div></div>';
  return devRow(ipad, notes);
};
WT.actions.pins = function (el, S) { S.pins = true; };
WT.actions.synced = function (el, S) { S.synced = true; };
WT.ensure['ds02-ipad'] = function (S) { S.pins = true; S.synced = true; };
WT.bts['ds02-ipad'] = function (S) {
  return {
    what: 'Jess sketches on the iPad with no signal in the Harmons\' yard. Photos are pinned where they were taken and attached to objects; notes are handwriting or voice. The design is a CRDT document, so edits made offline merge with no conflicts when the iPad reconnects.',
    agents: [['On-site sketch mode', 'Touch and Pencil, offline cache, photo pins', 1]],
    trace: [{ c: 'cache.prefetch(today\'s visits)', r: 'design, tiles, KB subset', ms: '—', det: true }, { c: 'photo.pin(geo + heading)', r: S.pins ? '2 photos, 3 notes' : 'waiting', ms: '', det: true, pending: !S.pins }, { c: 'crdt.sync(merge)', r: S.synced ? '41 ops merged, 0 conflicts' : 'offline', ms: S.synced ? '600 ms' : '', det: true, pending: !S.synced }],
    hitl: [['Jess', 'walks and sketches with the clients.']],
    tags: [['mvp', 'photo pins'], ['v1', 'touch and Pencil UI, offline design, GPS walk-and-trace, shape recognition'], ['v2', 'Bluetooth laser meters, LiDAR scans, AR preview']],
    specs: 'Spec: 10 §4.20 (DS-MOB-01 to 08), §5.6 · 20 (CRDT sync)'
  };
};

/* ds03 */
WT.screens['ds03-hardscape'] = function (S) {
  var bad = S.drawn && !S.tpzFixed;
  var main = '<div class="apphead"><span class="crumb">Design › Harmon › Option A</span><h3>Hardscape and beds</h3></div>' + tools('Hardscape') +
    '<div class="wt-cols wide-left"><div class="ds-canvas">' + planSVG({ stage: S.drawn ? 1 : 0, tpz: bad ? 'bad' : 'ok', tpzPath: bad }) + '</div>' +
    '<div class="wt-stack"><div class="panel"><h4>Flagstone walk</h4><dl class="kv"><dt>Width</dt><dd>4 ft · 152 sq ft</dd><dt>Surface</dt><dd>Ohio sandstone flagging, 1.5-2 in</dd><dt>Setting bed</dt><dd>1 in stone dust</dd><dt>Base</dt><dd>4 in compacted crushed limestone (verify local spec)</dd><dt>Edge</dt><dd>steel, both sides of the beds</dd></dl>' +
    (S.drawn ? '' : '<button type="button" class="btn sm primary mt10" data-act="drawn" data-k="drawn">Draw the walk and beds</button>') + '</div>' +
    (bad ? '<div class="wt-callout danger"><b>Inside the tree protection zone.</b> The first route cuts a 4 in base through 9 ft of the maple\'s root zone.<div class="mt6"><button type="button" class="btn xs primary" data-act="tpz" data-k="tpz">Re-route along the porch side</button></div></div>' : S.drawn ? '<div class="okline">' + ic('check') + 'Walk stays outside the 14 ft ring · beds 548 sq ft</div>' : '') + '</div></div>';
  return browser('app.rootline.com/design/harmon/a', dsShell(main), 'Design Studio: hardscape');
};
WT.actions.drawn = function (el, S) { S.drawn = true; };
WT.actions.tpz = function (el, S) { S.tpzFixed = true; };
WT.ensure['ds03-hardscape'] = function (S) { S.drawn = true; S.tpzFixed = true; };
WT.bts['ds03-hardscape'] = function (S) {
  return {
    what: 'Hardscape is drawn to scale with a construction spec (surface, setting bed, base depth, edge), because the spec drives the takeoff and the crew\'s build. Beds use smooth curves with live areas. The validation engine checks site rules as Jess draws: excavation inside a protected tree\'s root zone is flagged before it reaches a proposal.',
    agents: [['Drawing engine', 'Beds, hardscape with specs, snapping, dimensions', 1], ['Validation engine', 'Site rules: tree protection, setbacks', 1]],
    trace: [{ c: 'object.create(walk, flagstone, 4 ft)', r: S.drawn ? '152 sq ft' : 'waiting', ms: '', det: true, pending: !S.drawn }, { c: 'validate.site(TPZ, excavation)', r: S.drawn ? (S.tpzFixed ? 'clear' : 'walk base inside TPZ') : '', ms: '8 ms', det: true, pending: !S.drawn }, { c: 'object.edit(reroute)', r: S.tpzFixed ? 'clear of the 14 ft ring' : '', ms: '', det: true, pending: !S.tpzFixed }],
    hitl: [['Jess', 'draws and decides every route.']],
    tags: [['mvp', 'beds, turf, patios and walkways with specs, measurement, live validation of site rules']],
    specs: 'Spec: 10 §4.3, §4.4, §4.9, §4.11 · 13 (base materials)'
  };
};

/* ds04 */
WT.screens['ds04-plants'] = function (S) {
  var vals = [];
  if (S.placed) {
    vals.push([S.moved ? 'ok' : 'warn', 'Serviceberry \'Autumn Brilliance\': mature spread 15 ft; at 6 ft from the wall it will hit the house.', S.moved ? 'Moved to 9 ft' : '<button type="button" class="btn xs" data-act="moved" data-k="moved">Move to 9 ft</button>']);
    vals.push([S.nepMoved ? 'ok' : 'warn', 'Catmint \'Walker\'s Low\' ×5 in part shade (about 3.5 h of sun); it needs full sun to bloom.', S.nepMoved ? 'Moved to the sunny edge' : '<button type="button" class="btn xs" data-act="nep" data-k="nep">Move to the bed edge</button>']);
    vals.push(['danger', 'Client asked about a Bradford pear: since January 2023 Callery pear and its cultivars can\'t be sold, grown or planted in Ohio (OAC 901:5-30-01). KB alternatives: serviceberry, redbud.', 'Blocked']);
    vals.push(['ok', 'All plants hardy in zone 6b and rated Good or Excellent for Central Ohio.', '']);
  }
  var main = '<div class="apphead"><span class="crumb">Design › Harmon › Option A</span><h3>Planting</h3>' + pill('', 'Central Ohio · 6b') + '</div>' + tools('Plants') +
    '<div class="wt-cols wide-left"><div class="ds-canvas">' + planSVG({ stage: S.placed ? 2 : 1, tpz: 'ok', moved: S.moved, nepMoved: S.nepMoved, carex: S.carex, valid: true }) + '</div>' +
    '<div class="wt-stack"><div class="panel">' + (S.placed ? '<h4>Live checks</h4>' + vals.map(function (v) { return '<div class="val-row"><span class="wt-ic ' + (v[0] === 'ok' ? 'ok' : v[0] === 'danger' ? '' : 'warn') + '" style="' + (v[0] === 'danger' ? 'background:var(--danger-bg);color:var(--danger-text)' : '') + '">' + ic(v[0] === 'ok' ? 'check' : 'warn') + '</span><span>' + v[1] + '</span><span>' + v[2] + '</span></div>'; }).join('') : '<h4>Plant picker</h4><div class="tiny">Filtered to Central Ohio, zone 6b, part sun to full sun, deer resistant first. Symbols size to mature spread.</div><button type="button" class="btn sm primary mt10" data-act="placed" data-k="placed">Place the palette</button>') + '</div>' +
    (S.placed ? '<div class="panel"><h4>Fill the maple island</h4>' + (S.carex ? '<div class="okline">' + ic('check') + '143 Pennsylvania sedge plugs at 15 in on center, hand-planted (no machine digging inside the ring)</div>' : '<button type="button" class="btn sm" data-act="carex" data-k="carex">Fill bed with Carex pensylvanica</button>') + '</div>' : '') + '</div></div>';
  return browser('app.rootline.com/design/harmon/a', dsShell(main), 'Design Studio: planting');
};
WT.actions.placed = function (el, S) { S.placed = true; };
WT.actions.moved = function (el, S) { S.moved = true; };
WT.actions.nep = function (el, S) { S.nepMoved = true; };
WT.actions.carex = function (el, S) { S.carex = true; };
WT.ensure['ds04-plants'] = function (S) { S.placed = true; S.moved = true; S.nepMoved = true; S.carex = true; };
WT.bts['ds04-plants'] = function (S) {
  return {
    what: 'Plants only come from the Plant Knowledge Base, pre-filtered to the property\'s Region and zone, and every symbol is drawn at mature spread. One validation engine checks hardiness, the Region rating, legal status, sun, deer, water needs and setbacks as Jess places each plant. The fill-bed tool computes plant counts for groundcovers from the bed shape and spacing.',
    agents: [['Plant placement (4.10)', 'KB-only picker, mature-size symbols', 1], ['Validation engine (4.11)', 'Zone, region rating, legal status, sun, deer, setbacks', 1], ['Fill-bed algorithm', 'Counts and positions at a spacing', 1]],
    trace: [{ c: 'kb.palette(Central Ohio, 6b, deer: high)', r: '1 tree, 3 + 7 shrubs, 9 perennials', ms: '120 ms', det: true }, { c: 'validate.plants', r: S.placed ? (S.moved && S.nepMoved ? 'all clear; 1 request blocked by law' : 'setback and sun warnings') : '', ms: '14 ms', det: true, pending: !S.placed }, { c: 'fillbed(island, 15 in OC, hex)', r: S.carex ? '143 plugs' : '', ms: '30 ms', det: true, pending: !S.carex }],
    hitl: [['Jess', 'chooses every plant; warnings explain, she decides.']],
    tags: [['mvp', 'KB plant placement, mature-size symbols, live validation, fill-bed']],
    specs: 'Spec: 10 §4.10, §4.11, §5.5 · 12 (Region ratings, legal status; launch-state invasive plant rules in §1)'
  };
};

/* ds05 */
WT.screens['ds05-sun3d'] = function (S) {
  var yrs = [['install', 'Install'], ['y3', 'Year 3'], ['y5', 'Year 5'], ['y10', 'Year 10'], ['mature', 'Maturity']];
  var seasons = ['spring', 'summer', 'fall', 'winter'];
  var main = '<div class="apphead"><span class="crumb">Design › Harmon › Option A</span><h3>Sun and 3D</h3></div><div class="wt-cols"><div class="panel"><h4>Sun hours, Apr 15 - Sep 15</h4><div class="ds-canvas">' + planSVG({ stage: 2, tpz: 'ok', moved: true, nepMoved: true, carex: true, sun: S.sun }) + '</div>' + (S.sun ? '<div class="wt-note mt6">The house faces north: the first 3 ft of bed gets 2-4 h, the next 4 ft 4-6 h, the walk and island full sun under the maple\'s edge.</div>' : '<button type="button" class="btn sm primary mt6" data-act="sun" data-k="sun">Run the sun study</button>') + '</div>' +
    '<div class="panel"><h4>Front elevation in 3D</h4>' + elevSVG(S.yr, S.season) + '<div class="seg mt6">' + yrs.map(function (y) { return '<button type="button" data-act="yr" data-v="' + y[0] + '" data-k="y' + y[0] + '" aria-pressed="' + (S.yr === y[0]) + '">' + y[1] + '</button>'; }).join('') + '</div><div class="seg mt6">' + seasons.map(function (x) { return '<button type="button" data-act="season" data-v="' + x + '" data-k="s' + x + '" aria-pressed="' + (S.season === x) + '">' + x.charAt(0).toUpperCase() + x.slice(1) + '</button>'; }).join('') + '</div><div class="wt-note mt6">Sizes follow each plant\'s growth rate and years to maturity in the KB; colors follow its bloom and foliage calendar.</div></div></div>';
  return browser('app.rootline.com/design/harmon/a/3d', dsShell(main), 'Design Studio: sun and 3D');
};
WT.actions.sun = function (el, S) { S.sun = true; };
WT.actions.yr = function (el, S) { S.yr = el.getAttribute('data-v'); };
WT.actions.season = function (el, S) { S.season = el.getAttribute('data-v'); };
WT.ensure['ds05-sun3d'] = function (S) { S.sun = true; S.yr = 'y5'; };
WT.bts['ds05-sun3d'] = function (S) {
  return {
    what: 'The sun study casts the house\'s shadow through the growing season at the property\'s latitude and turns it into sun-hour classes, which the plant checks then use instead of guesses. The 3D view grows each plant along a curve from its KB growth rate and shows bloom, foliage and winter structure by season, so the Harmons see year 5, not just install day.',
    agents: [['Sun study (4.12)', 'Solar position, shadow mapping, sun-hour classes [V1]', 1], ['3D view (4.13)', 'Growth slider and seasons from KB data [V1]', 1]],
    trace: [{ c: 'sun.hours(Apr 15-Sep 15, 15-min samples)', r: S.sun ? '3 classes along the north wall' : 'not run', ms: S.sun ? '1.8 s' : '', det: true, pending: !S.sun }, { c: 'growth.size(' + S.yr + ')', r: 'logistic curve per KB growth_rate', ms: '4 ms', det: true }, { c: 'phenology(' + S.season + ')', r: 'bloom and foliage colors', ms: '2 ms', det: true }],
    hitl: [['Jess', 'uses it to explain the design.']],
    tags: [['mvp', 'manual sun tags'], ['v1', 'computed sun study, 3D view, growth slider, seasons'], ['v2', 'future shade, night mode']],
    specs: 'Spec: 10 §4.12, §4.13 · 12 (growth_rate, years_to_maturity, phenology)'
  };
};

/* ds06 */
WT.screens['ds06-layers'] = function (S) {
  var main = '<div class="apphead"><span class="crumb">Design › Harmon › Option A</span><h3>Lighting and irrigation layers</h3></div>' + tools(S.irr ? 'Irrigation' : 'Lighting') +
    '<div class="wt-cols wide-left"><div class="ds-canvas">' + planSVG({ stage: 2, tpz: 'ok', moved: true, nepMoved: true, carex: true, lights: S.lights, irr: S.irr }) + '</div><div class="wt-stack">' +
    '<div class="panel"><h4>Lighting</h4>' + (S.lights ? '<dl class="kv"><dt>Fixtures</dt><dd>6 path (3 W) · 3 up (7 W)</dd><dt>Load</dt><dd>39 W on a 150 W transformer (26%)</dd><dt>Longest run</dt><dd>95 ft of 12 AWG: drop 39 × 95 ÷ 7,500 = 0.5 V ✓</dd></dl>' : '<button type="button" class="btn sm primary" data-act="lights" data-k="lights">Add lights</button>') + '</div>' +
    '<div class="panel"><h4>Drip irrigation</h4>' + (S.irr ? '<dl class="kv"><dt>Controller</dt><dd>existing, stations 7 and 8</dd><dt>Zone 7</dt><dd>bed drip, 0.6 gph emitters</dd><dt>Zone 8</dt><dd>island drip under the maple</dd></dl>' + (S.hydro ? '<div class="okline mt6">' + ic('check') + 'Hydrozones match: catmint and sedge both low-to-moderate water</div>' : '<div class="wt-callout warn mt6">Zone 7 mixes the hydrangeas (moderate-high water) with catmint (low). <button type="button" class="btn xs" data-act="hydro" data-k="hydro">Give hydrangeas their own emitters</button></div>') : '<button type="button" class="btn sm" data-act="irr" data-k="irr"' + (S.lights ? '' : ' disabled') + '>Add drip zones</button>') + '</div></div></div>';
  return browser('app.rootline.com/design/harmon/a', dsShell(main), 'Design Studio: lighting and irrigation');
};
WT.actions.lights = function (el, S) { S.lights = true; };
WT.actions.irr = function (el, S) { S.irr = true; };
WT.actions.hydro = function (el, S) { S.hydro = true; };
WT.ensure['ds06-layers'] = function (S) { S.lights = true; S.irr = true; S.hydro = true; };
WT.bts['ds06-layers'] = function (S) {
  return {
    what: 'Lighting and irrigation are layers of the same plan. The lighting layer sizes the transformer and checks voltage drop on each run from the cable gauge and length; the irrigation layer assigns plants to zones and flags mixed water needs. Both become the property\'s inventory at handoff, which the lighting service plan and irrigation start-ups use later.',
    agents: [['Lighting layer (4.6)', 'Fixtures, transformer load, voltage drop [V1]', 1], ['Irrigation layer (4.7)', 'Zones, emitters, hydrozone check [V1]', 1]],
    trace: [{ c: 'lighting.load(9 fixtures)', r: S.lights ? '39 W of 150 W' : 'not placed', ms: '', det: true, pending: !S.lights }, { c: 'lighting.voltage_drop(95 ft, 12 AWG)', r: S.lights ? '0.5 V' : '', ms: '3 ms', det: true, pending: !S.lights }, { c: 'irrigation.hydrozone_check(zone 7)', r: S.irr ? (S.hydro ? 'match' : 'mixed water needs') : '', ms: '6 ms', det: true, pending: !S.irr }],
    hitl: [['Jess', 'places fixtures and zones.']],
    tags: [['v1', 'lighting and irrigation design layers, voltage-drop and hydrozone checks'], ['v2', 'hydraulic calculations']],
    specs: 'Spec: 10 §4.6, §4.7 · 14 §4.2, §4.7 (service after install)'
  };
};

/* ds07 */
WT.screens['ds07-takeoff'] = function (S) {
  var lines = [['Flagstone, 152 sq ft + 10% waste', '168 sq ft'], ['Crushed limestone base, 4 in', '2.63 t → 3 t'], ['Stone dust setting bed, 1 in', '0.63 t → 1 t'], ['Steel edging, bed perimeter 132 ft', '14 × 10 ft'], ['Mulch, 548 sq ft × 3 in', '5.07 yd³ → 6 yd³'], ['Plants', '1 tree · 10 shrubs · 9 perennials · 143 plugs'], ['Lighting', '9 fixtures · 150 W transformer · 220 ft 12 AWG'], ['Drip', '2 zones on existing controller']];
  var main = '<div class="apphead"><span class="crumb">Design › Harmon › Option A</span><h3>Takeoff and price</h3>' + (S.pushed ? pill('ok', 'Linked to estimate E-2290') : pill('info', 'Live')) + '</div><div class="wt-cols wide-left"><div class="panel"><h4>Takeoff (from geometry and rules)</h4><table class="data tight"><tbody>' + lines.map(function (l) { return '<tr><td>' + l[0] + '</td><td class="num tiny">' + l[1] + '</td></tr>'; }).join('') + '</tbody></table><div class="wt-note mt6">Rules belong to Greenleaf: waste, base depth, density, rounding. Change a bed and every line updates.</div></div>' +
    '<div class="wt-stack"><div class="panel"><h4>Live price</h4><div class="price-panel"><span>Hardscape</span><span>$4,980</span><span>Planting</span><span>$4,412</span><span>Lighting</span><span>$3,260</span><span>Irrigation</span><span>$1,180</span><span class="t">Total</span><span class="t">$13,832</span><span>Estimated margin</span><span>43.1% (target 42%)</span></div></div>' +
    '<div class="panel">' + (S.pushed ? '<div class="okline">' + ic('check') + 'Pushed to estimate E-2290 for Sam. Design v2 pinned; edits now show as a delta to sync.</div>' : '<button type="button" class="btn sm primary" data-act="pushed" data-k="pushed">Push to estimate</button>') + '</div></div></div>';
  return browser('app.rootline.com/design/harmon/a/takeoff', dsShell(main), 'Design Studio: takeoff');
};
WT.actions.pushed = function (el, S) { S.pushed = true; };
WT.ensure['ds07-takeoff'] = function (S) { S.pushed = true; };
WT.bts['ds07-takeoff'] = function (S) {
  return {
    what: 'The design is the estimate. Greenleaf\'s takeoff rules turn geometry into price-book quantities (waste, depth, density, rounding), and a live price panel shows price and margin while Jess draws. Pushing creates an estimate that stays linked to a pinned design version, so later edits arrive as a delta Sam can review instead of a re-type.',
    agents: [['Takeoff rules (4.15.1)', 'Geometry to quantities', 1], ['Live price panel (4.15.2)', 'Price and margin by group', 1], ['Push to estimate (4.15.3)', 'Linked estimate with version pin', 1]],
    trace: [{ c: 'takeoff.compute(option A)', r: '23 lines', ms: '40 ms', det: true }, { c: 'pricebook.price', r: '$13,832 · 43.1%', ms: '20 ms', det: true }, { c: 'estimate.create(E-2290, pin v2)', r: S.pushed ? 'linked' : 'waiting', ms: S.pushed ? '300 ms' : '', det: true, pending: !S.pushed }],
    hitl: [['Jess', 'pushes.'], ['Sam', 'owns the estimate and its pricing decisions.']],
    tags: [['mvp', 'takeoff rules, live price panel, push to estimate and stay linked']],
    specs: 'Spec: 10 §4.15, §5.2 · 03 (estimates) · 13 (buy lists from takeoffs)'
  };
};

/* ds08 */
WT.screens['ds08-options'] = function (S) {
  var main = '<div class="apphead"><span class="crumb">Design › Harmon</span><h3>Options and versions</h3></div><div class="seg">' + [['A', 'A: Flagstone walk · $13,832'], ['B', 'B: Paver walk · $12,592']].map(function (o) { return '<button type="button" data-act="option" data-v="' + o[0] + '" data-k="o' + o[0] + '" aria-pressed="' + (S.option === o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div>' +
    '<div class="wt-cols wide-left mt10"><div class="ds-canvas">' + planSVG({ stage: 2, tpz: 'ok', moved: true, nepMoved: true, carex: true, lights: true, option: S.option }) + '</div><div class="wt-stack"><div class="panel"><h4>Compare B with A</h4><div class="wt-diff"><span class="del">Flagstone 168 sq ft</span><span class="add">Concrete pavers 160 sq ft</span><span>Price −$1,240</span></div></div>' +
    '<div class="panel"><h4>Show the clients a photo of option ' + S.option + ' ' + tag('v1') + '</h4>' + (S.render ? '<div class="okline">' + ic('check') + 'Photo rendered from the plan\'s camera, geometry and plants; labeled "AI image of the design"</div>' : '<button type="button" class="btn sm ai" data-act="render" data-k="render">' + ic('spark') + 'Render this view</button>') + '</div>' +
    '<div class="panel"><h4>Versions</h4><div class="tiny">v1 site visit · v2 pushed to estimate · <b>v3 ' + (S.shared ? 'shared with the Harmons' : 'in review') + '</b></div>' + (S.shared ? '' : '<button type="button" class="btn sm primary mt6" data-act="shared" data-k="shared">Approve and share A and B</button>') + '</div></div></div>';
  return browser('app.rootline.com/design/harmon/options', dsShell(main), 'Design Studio: options');
};
WT.actions.option = function (el, S) { S.option = el.getAttribute('data-v'); };
WT.actions.render = function (el, S) { S.render = true; };
WT.actions.shared = function (el, S) { S.shared = true; };
WT.ensure['ds08-options'] = function (S) { S.render = true; S.shared = true; S.option = 'A'; };
WT.bts['ds08-options'] = function (S) {
  return {
    what: 'Options are branches of the same design, each with its own takeoff, and they map to proposal options. Versions are immutable snapshots taken automatically when the design is shared, pushed, approved, signed and sold. A photo of the plan is rendered from the plan\'s own camera, geometry and plants, so the image matches what will be built.',
    agents: [['Options and versions (4.14)', 'Branches, snapshots, compare', 1], ['Plan-to-photo [V1]', 'Photoreal render from the plan', 0]],
    trace: [{ c: 'option.fork(B: pavers)', r: '−$1,240', ms: '60 ms', det: true }, { c: 'render.plan_to_photo(option ' + S.option + ')', r: S.render ? '1 image, labeled' : 'not yet', ms: S.render ? '14 s' : '', pending: !S.render }, { c: 'version.snapshot(v3, shared)', r: S.shared ? 'shared to the portal' : 'in review', ms: '', det: true, pending: !S.shared }],
    hitl: [['Jess', 'approves the version before the clients see it.']],
    creditNote: 'A plan-to-photo render is 20 credits.',
    tags: [['mvp', 'options, versions, auto-snapshots'], ['v1', 'visual compare, propagate changes across options, plan-to-photo']],
    specs: 'Spec: 10 §4.14, §5.3, §4.13 (DS-3D-07) · 11 (renders) · 22 §4.4.1'
  };
};

/* ds09 */
WT.screens['ds09-markup'] = function (S) {
  var thread = '<div class="wt-thread"><div class="wt-bubble them"><b>1 · Kate:</b> Could the walk be a little wider so two of us fit side by side?</div>' + (S.c1 ? '<div class="wt-bubble me"><b>Jess:</b> Widened to 5 ft. It adds 38 sq ft of flagstone, +$1,064.<small>v4</small></div>' : '') +
    '<div class="wt-bubble them"><b>2 · Ben:</b> Love the serviceberry by the window. Will it block the window later?</div>' + (S.c2 ? '<div class="wt-bubble me"><b>Jess:</b> At 9 ft from the wall its mature spread clears the window; the year 10 view is in the 3D tab.</div>' : '') + '</div>';
  var main = '<div class="apphead"><span class="crumb">Client portal › Your design</span><h3>Harmon front yard · option A</h3>' + pill(S.approved ? 'ok' : 'info', S.approved ? 'Approved by Kate' : 'v3 shared') + '</div><div class="wt-cols wide-left"><div class="ds-canvas">' + planSVG({ stage: 2, tpz: 'ok', moved: true, nepMoved: true, carex: true, lights: true, pins: true, wide: S.c1 }) + '</div><div class="wt-stack"><div class="panel"><h4>Comments pinned on the plan</h4>' + thread + '</div>' +
    '<div class="panel">' + (!S.c1 ? '<button type="button" class="btn sm" data-act="c1" data-k="c1">Jess widens the walk (v4)</button>' : !S.c2 ? '<button type="button" class="btn sm" data-act="c2" data-k="c2">Jess answers Ben</button>' : S.approved ? '<div class="okline">' + ic('check') + 'Kate approved v4 · proposal P-1288 updated to $14,896</div>' : '<button type="button" class="btn sm primary" data-act="approved" data-k="approved">Simulate Kate approving v4</button>') + '</div></div></div>';
  return browser('greenleafgrounds.com/portal/designs/harmon', main, 'Client portal: design markup');
};
WT.actions.c1 = function (el, S) { S.c1 = true; };
WT.actions.c2 = function (el, S) { S.c2 = true; };
WT.actions.approved = function (el, S) { S.approved = true; };
WT.ensure['ds09-markup'] = function (S) { S.c1 = true; S.c2 = true; S.approved = true; };
WT.bts['ds09-markup'] = function (S) {
  return {
    what: 'Clients see the shared version in the portal and pin comments right on the plan. Jess answers in the thread and revises; the new version shows the price change from the takeoff delta. The client\'s approval is recorded against that exact version, and the proposal updates to match.',
    agents: [['Client markup (4.16)', 'Pinned comments, versions, approvals in the portal [V1]', 1]],
    trace: [{ c: 'comment.pin(2)', r: '2 threads', ms: '—', det: true }, { c: 'version.v4(walk 5 ft)', r: S.c1 ? '+38 sq ft, +$1,064' : 'waiting', ms: '', det: true, pending: !S.c1 }, { c: 'approval.client(v4)', r: S.approved ? 'Kate · proposal P-1288 $14,896' : '', ms: '', det: true, pending: !S.approved }],
    hitl: [['Kate and Ben', 'comment and approve.'], ['Jess', 'revises.']],
    tags: [['v1', 'portal client markup, pinned comments, version approvals']],
    specs: 'Spec: 10 §4.16, §5.4 · 06 (portal) · 03 (proposal updates)'
  };
};

/* ds10 */
WT.screens['ds10-planset'] = function (S) {
  function sheet(code, title, inner) { return '<div class="sheet"><b>' + code + ' ' + title + '</b><svg viewBox="0 0 120 70">' + inner + '</svg><div class="tb"><span>Greenleaf Grounds Co.</span><span>Harmon · v4</span></div></div>'; }
  var base = '<rect x="30" y="2" width="55" height="24" fill="#eee" stroke="#999"/><rect x="92" y="14" width="15" height="54" fill="#eee"/>';
  var sheets = [sheet('L-1', 'Site and existing', base + '<circle cx="20" cy="48" r="16" fill="none" stroke="#999" stroke-dasharray="2 2"/>'), sheet('L-2', 'Layout and hardscape', base + '<path d="M92 50 C75 50 66 44 60 38 C57 34 58 30 58 26" stroke="#a89880" stroke-width="5" fill="none"/><text x="34" y="62" font-size="5">5\'-0" · 38\'-0"</text>'), sheet('L-3', 'Planting plan', base + '<circle cx="40" cy="34" r="8" fill="#cfe0c3"/><circle cx="50" cy="30" r="3" fill="#6b8f5a"/><circle cx="66" cy="30" r="3" fill="#6b8f5a"/><circle cx="20" cy="48" r="10" fill="#d9e6cf"/>'), sheet('L-4', 'Lighting and irrigation', base + '<circle cx="80" cy="50" r="1.6" fill="#d9a400"/><circle cx="70" cy="46" r="1.6" fill="#d9a400"/><circle cx="62" cy="40" r="1.6" fill="#d9a400"/><path d="M30 26 H85 V36 Q60 42 30 40 Z" fill="none" stroke="#2f6fb0" stroke-dasharray="2 1"/>')];
  var main = '<div class="apphead"><span class="crumb">Design › Harmon › Export</span><h3>Plan set</h3></div><div class="sheet-grid">' + sheets.join('') + '</div>' +
    '<div class="wt-cols mt10"><div class="panel"><h4>What\'s on the sheets</h4><ul style="margin:0;padding-left:18px;font-size:.76rem;color:var(--text-2);display:grid;gap:3px"><li>Title block, north arrow, scale bar at 1 in = 10 ft</li><li>Dimensions, base and edge specs, plant schedule with sizes and counts</li><li>"Approximate parcel line, not a survey"</li><li>Lighting runs, transformer, drip zones and the controller</li></ul></div>' +
    '<div class="panel">' + (S.exported ? '<div class="okline">' + ic('check') + 'PDF sent to the portal; construction set added to the job for the crew\'s tablet</div>' : '<button type="button" class="btn sm primary" data-act="exported" data-k="exported">Export the plan set</button>') + '<div class="wt-note mt6">MVP exports a single sheet and images; the multi-sheet construction set is V1.</div></div></div>';
  return browser('app.rootline.com/design/harmon/export', dsShell(main), 'Design Studio: plan set');
};
WT.actions.exported = function (el, S) { S.exported = true; };
WT.ensure['ds10-planset'] = function (S) { S.exported = true; };
WT.bts['ds10-planset'] = function (S) {
  return {
    what: 'The same document prints as a plan set: site, layout and hardscape with dimensions and specs, a planting plan with a schedule, and lighting and irrigation. The client gets it in the portal, and the crew gets the construction set on the tablet, built from the version that was approved.',
    agents: [['Exports (4.18)', 'Sheets, title blocks, schedules, PDF', 1]],
    trace: [{ c: 'planset.render(v4, 4 sheets)', r: S.exported ? '4-page PDF' : 'not yet', ms: S.exported ? '3.2 s' : '', det: true, pending: !S.exported }, { c: 'construction_set.attach(job)', r: S.exported ? 'on the crew tablet' : '', ms: '', det: true, pending: !S.exported }],
    hitl: [['Jess', 'reviews and sends.']],
    tags: [['mvp', 'single-sheet PDF and image export'], ['v1', 'multi-sheet plan sets and construction sets'], ['v2', 'DWG export']],
    specs: 'Spec: 10 §4.18, §4.22, §6.7 · 05 (construction set on the crew app)'
  };
};

/* ds11 */
WT.screens['ds11-change'] = function (S) {
  var main = '<div class="apphead"><span class="crumb">Jobs › J-2436 · Harmon</span><h3>Change order CO-1</h3>' + pill(S.co >= 2 ? 'ok' : 'info', S.co >= 2 ? 'Signed' : S.co === 1 ? 'Sent' : 'Draft') + '</div><div class="wt-cols wide-left"><div class="ds-canvas">' + planSVG({ stage: 2, tpz: 'ok', moved: true, nepMoved: true, carex: true, lights: true, wide: true, extraUp: S.co >= 0 }) + '</div><div class="wt-stack">' +
    '<div class="panel"><h4>Kate: "Can we light the maple from both sides?"</h4><div class="wt-diff"><span class="add">+2 uplights (7 W)</span><span class="add">+30 ft 12 AWG cable</span><span>Load 53 W of 150 W · drop still under 1 V</span></div><dl class="kv mt6"><dt>Change</dt><dd>+$460.00</dd><dt>Version</dt><dd>sold v4 stays locked; v5 is the change</dd></dl></div>' +
    '<div class="panel">' + (S.co === 0 ? '<button type="button" class="btn sm primary" data-act="co" data-k="co0">Send CO-1 to the portal</button>' : S.co === 1 ? '<button type="button" class="btn sm" data-act="co" data-k="co1">Simulate Kate signing</button>' : '<div class="okline">' + ic('check') + 'Signed · invoice schedule +$460 · buy list +2 fixtures, +30 ft cable</div>') + '</div></div></div>';
  return browser('app.rootline.com/jobs/J-2436/change-orders', dsShell(main), 'Change order on a sold design');
};
WT.actions.co = function (el, S) { S.co = Math.min(2, S.co + 1); };
WT.ensure['ds11-change'] = function (S) { S.co = 2; };
WT.bts['ds11-change'] = function (S) {
  return {
    what: 'After the proposal is signed, the sold version is locked. A change starts a new version; the takeoff delta becomes a change order with its price, the client signs it in the portal, and the delta flows to the invoice schedule and the buy list. Nobody edits the sold record.',
    agents: [['Change orders (5.7)', 'Version delta to priced change order', 1]],
    trace: [{ c: 'version.delta(v4 → v5)', r: '+2 uplights, +30 ft cable', ms: '30 ms', det: true }, { c: 'lighting.recheck', r: '53 W, drop < 1 V', ms: '3 ms', det: true }, { c: 'change_order.sign(CO-1)', r: S.co >= 2 ? 'signed · +$460' : S.co === 1 ? 'sent' : 'draft', ms: '', det: true, pending: S.co < 2 }, { c: 'buylist.delta(J-2436)', r: S.co >= 2 ? '+2 fixtures, +30 ft' : '', ms: '', det: true, pending: S.co < 2 }],
    hitl: [['Kate', 'signs.'], ['Sam', 'sends the change order.']],
    tags: [['mvp', 'change orders from design deltas, locked sold versions']],
    specs: 'Spec: 10 §5.7, §5.3 · 03 (change orders) · 07 (invoice schedule) · 13 (buy list deltas)'
  };
};

/* ds12 */
WT.screens['ds12-asbuilt'] = function (S) {
  var main = '<div class="apphead"><span class="crumb">Design › Harmon</span><h3>As-built</h3>' + pill(S.asbuilt ? 'ok' : 'info', S.asbuilt ? 'as_built' : 'sold v5') + '</div><div class="wt-cols wide-left"><div class="ds-canvas">' + planSVG({ stage: 2, tpz: 'ok', moved: true, nepMoved: true, carex: true, lights: true, irr: true, wide: true, extraUp: true }) + '</div><div class="wt-stack">' +
    '<div class="panel"><h4>From the crew app</h4><ul style="margin:0;padding-left:18px;font-size:.76rem;color:var(--text-2);display:grid;gap:3px"><li>Path light 4 moved 1.5 ft to miss a root (photo)</li><li>Zone 8 valve box pinned with a photo</li><li>Sedge: 138 planted, 5 left out over roots</li></ul>' + (S.asbuilt ? '' : '<button type="button" class="btn sm primary mt6" data-act="asbuilt" data-k="asbuilt">Accept as-built (Jess)</button>') + '</div>' +
    (S.asbuilt ? '<div class="panel"><h4>Now the property record</h4><dl class="kv"><dt>Maintenance</dt><dd>bed area 548 sq ft and turf 2,940 sq ft for mowing and mulch quotes</dd><dt>Lighting</dt><dd>11 fixtures, 1 transformer → ready for a service plan</dd><dt>Irrigation</dt><dd>zones 7-8 added to the start-up program</dd><dt>Plants</dt><dd>warranty records for 1 tree, 10 shrubs, 9 perennials</dd></dl></div>' : '') + '</div></div>';
  return browser('app.rootline.com/design/harmon/as-built', dsShell(main), 'Design Studio: as-built');
};
WT.actions.asbuilt = function (el, S) { S.asbuilt = true; };
WT.ensure['ds12-asbuilt'] = function (S) { S.asbuilt = true; };
WT.bts['ds12-asbuilt'] = function (S) {
  return {
    what: 'The crew\'s field changes come back from the crew app as markups on the plan. Accepting them makes an as-built version, and that becomes the property\'s record: measurement sets for future mowing and mulch quotes, a lighting inventory ready for a service plan, irrigation zones in the start-up program, and plant records behind warranties and portal care guides.',
    agents: [['As-built (4.22)', 'Field markups to as-built version [V1]', 1]],
    trace: [{ c: 'field.markups(J-2436)', r: '3 changes with photos', ms: '—', det: true }, { c: 'version.as_built', r: S.asbuilt ? 'accepted by Jess' : 'waiting', ms: '', det: true, pending: !S.asbuilt }, { c: 'property.record.update', r: S.asbuilt ? 'measurement sets, lighting, irrigation, plants' : '', ms: S.asbuilt ? '400 ms' : '', det: true, pending: !S.asbuilt }],
    hitl: [['Andrés', 'records the changes.'], ['Jess', 'accepts the as-built.']],
    tags: [['v1', 'construction sets and as-builts'], ['mvp', 'measurement sets for maintenance pricing']],
    specs: 'Spec: 10 §4.22, §4.2 (DS-MEAS-07) · 14 (lighting and irrigation inventory) · 06 (care guides, warranties)'
  };
};

/* ds13 */
WT.screens['ds13-recap'] = function (S) {
  var rows = [['Site model from an address', 'MVP; terrain and auto-trace V1'], ['Offline iPad sketch', 'MVP photo pins; V1 offline design'], ['Beds and walk with specs; tree protection check', 'MVP'], ['KB plants with live validation and fill-bed', 'MVP'], ['Sun study, 3D growth and seasons', 'V1'], ['Lighting and drip layers', 'V1'], ['Takeoff pushed to a linked estimate', 'MVP'], ['Options, versions, plan-to-photo', 'MVP and V1'], ['Client markup and approval in the portal', 'V1'], ['Plan set and construction set', 'MVP single sheet; V1 set'], ['Change order after the sale', 'MVP'], ['As-built as the property record', 'V1']];
  return '<div class="panel"><table class="data tight"><thead><tr><th>Step</th><th>Scope</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>'; }).join('') + '</tbody></table><p class="tiny muted mt10">20 AI credits: one photo of the plan. Everything else here is the drawing engine, the KB and rules.</p></div>' +
    '<div class="flex mt14"><a class="btn" href="#overview">' + ic('arrow-l') + 'Back to start</a><a class="btn" href="prototype.html">AI design to a signed project</a><a class="btn primary" href="walkthroughs.html">All walkthroughs ' + ic('arrow-r') + '</a></div>';
};
WT.bts['ds13-recap'] = function (S) {
  return {
    what: 'One record from address to as-built: the site model, the design with validated plants, the estimate and proposal, the client\'s approval, the crew\'s construction set, the change order and the as-built that maintenance, lighting, irrigation and warranties all use.',
    hitl: [['Jess, Sam, the Harmons and Andrés', 'made every decision; the Studio checked and priced as they went.']],
    tags: [['mvp', 'site, drawing, KB plants, validation, takeoff, options and versions, change orders, single-sheet export'], ['v1', 'terrain, auto-trace, offline iPad, sun, 3D, lighting and irrigation layers, markup, plan sets, as-built'], ['v2', 'DWG, hydraulics, AR, laser and LiDAR capture']],
    specs: 'Spec: 10 (whole module) · 03, 06, 11, 12, 13, 14'
  };
};
