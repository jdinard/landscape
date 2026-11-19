/* Walkthrough: irrigation, lighting and other service lines (doc 14, with 04, 05, 06, 07, 09, 11, 12).
   Prices are illustrative price-book values from doc 14. */

function je(rows, note) {
  var d = 0, c = 0;
  var body = rows.map(function (r) { d += r[1] || 0; c += r[2] || 0; return '<tr><td>' + esc(r[0]) + '</td><td class="n">' + (r[1] ? money(r[1], true) : '') + '</td><td class="n">' + (r[2] ? money(r[2], true) : '') + '</td></tr>'; }).join('');
  return '<table class="wt-je"><thead><tr><th>Account</th><th class="n">Debit</th><th class="n">Credit</th></tr></thead><tbody>' + body + '<tr class="tot"><td>' + (note || (Math.abs(d - c) < 0.005 ? 'Balanced' : 'NOT BALANCED')) + '</td><td class="n">' + money(d, true) + '</td><td class="n">' + money(c, true) + '</td></tr></tbody></table>';
}
var SL_NAV = [['today', 'Today'], ['approve', 'Approvals'], ['users', 'Clients'], ['calendar', 'Schedule'], ['sprout', 'Lawn and PHC'], ['drop', 'Irrigation'], ['clipboard', 'Projects'], ['bolt', 'Lighting'], ['star', 'Holiday'], ['shield', 'Mosquito'], ['snow', 'Snow'], ['cog', 'Settings']];
function slShell(active, main, counts) { return appShell(active, main, { nav: SL_NAV, counts: counts, navLabel: 'Service lines navigation (concept)' }); }
function techPhone(inner, opt) { opt = opt || {}; return phone(inner, { brand: 'Rootline Crew', sub: opt.sub || 'Devon Price · Irrigation and lighting', logo: 'truck', label: opt.label || 'Crew app', k: opt.k, time: opt.time }); }

function holidaySVG(on) {
  var bulbs = '', i;
  for (i = 0; i <= 14; i++) { var x = 40 + i * 16; bulbs += '<circle cx="' + x + '" cy="118" r="3.2" fill="' + (on ? ['#ff5a4f', '#ffd27a', '#5ad17a', '#6aa8ff'][i % 4] : '#5b6573') + '"/>'; }
  for (i = 0; i <= 8; i++) { var px = 80 + i * 18.75, py = 118 - (i <= 4 ? i * 13 : (8 - i) * 13); bulbs += '<circle cx="' + px + '" cy="' + (py - 6) + '" r="3" fill="' + (on ? '#ffd27a' : '#5b6573') + '"/>'; }
  var tree = function (cx) { var t = '<path d="M' + cx + ' 120 l-18 52 h36 z" fill="#21402c"/>'; if (on) for (var k = 0; k < 9; k++) t += '<circle cx="' + (cx - 12 + (k * 7) % 24) + '" cy="' + (130 + k * 4.5) + '" r="2" fill="#fff3c4"/>'; return t; };
  return '<svg class="wt-svg" viewBox="0 0 320 190" role="img" aria-label="' + (on ? 'AI concept image of the house with roofline lights and wrapped trees' : 'House at dusk before lights') + '" style="background:#18202c"><rect x="0" y="172" width="320" height="18" fill="#1f2a1f"/><path d="M40 120 L80 120 L155 66 L230 120 L270 120 L270 172 L40 172 Z" fill="#2d3747" stroke="#46546a"/><rect x="140" y="140" width="22" height="32" fill="#3b2a1f"/><rect x="70" y="135" width="28" height="20" fill="' + (on ? '#e8c27a' : '#3e4a5c') + '"/><rect x="200" y="135" width="28" height="20" fill="' + (on ? '#e8c27a' : '#3e4a5c') + '"/>' + bulbs + tree(20) + tree(298) + (on ? '<circle cx="151" cy="104" r="9" fill="none" stroke="#2f7a45" stroke-width="4"/><text x="8" y="14" fill="#c7d2e0" font-size="9">Concept image · AI</text>' : '') + '</svg>';
}

var WT = {
  title: 'Rootline walkthrough: irrigation, lighting and other service lines',
  short: 'Irrigation, lighting and other service lines',
  ovTitle: 'Irrigation, lighting and other service lines',
  startLeft: 4228,
  acts: [
    { n: 'Act 1', t: 'Service lines', sub: 'Turn lines on, see the season' },
    { n: 'Act 2', t: 'Irrigation', sub: 'Start-ups, backflow, smart controllers' },
    { n: 'Act 3', t: 'Installs and warranties', sub: '811 gate, closeout, claims' },
    { n: 'Act 4', t: 'More lines', sub: 'Lighting, holiday, mosquito, tree care' }
  ],
  steps: [
    { id: 'sl01-lines', act: 0, short: 'Service lines', title: 'Turning service lines on, and the year at a glance', who: 'Erin Castillo', tags: ['mvp', 'v1'] },
    { id: 'sl02-wave', act: 1, short: 'Start-up wave', title: 'The spring start-up wave waits for the last freeze', who: 'Luis Ortega', tags: ['mvp'] },
    { id: 'sl03-startup', act: 1, short: 'Start-up visit', title: 'A start-up visit with a pre-authorized repair', who: 'Devon Price, the Brennans', tags: ['mvp'] },
    { id: 'sl04-backflow', act: 1, short: 'Backflow test', title: 'A backflow test, recorded and filed', who: 'Devon, Tasha Greene', tags: ['v1'] },
    { id: 'sl05-smart', act: 1, short: 'Leak alert', title: 'A smart-controller leak alert becomes a repair visit', who: 'Luis, Devon', tags: ['v1'] },
    { id: 'sl06-dig', act: 2, short: '811 gate', title: 'No digging without a clear 811 ticket', who: 'Andrés Vega', tags: ['mvp', 'v1'] },
    { id: 'sl07-warranty', act: 2, short: 'Warranty', title: 'Closeout, then a plant warranty claim', who: 'The Okafors, Jess Morales', ai: true, tags: ['mvp', 'v1'] },
    { id: 'sl08-lighting', act: 3, short: 'Lighting plan', title: 'A lighting service visit after dusk', who: 'Devon', ai: true, tags: ['v1'] },
    { id: 'sl09-holiday', act: 3, short: 'Holiday lights', title: 'Holiday lighting sold from a concept image', who: 'Sam Kowalski, a homeowner', ai: true, tags: ['v1'] },
    { id: 'sl10-mosquito', act: 3, short: 'Mosquito', title: 'A mosquito program with no-spray zones', who: 'The Brennans, Maria López', tags: ['v1'] },
    { id: 'sl11-tree', act: 3, short: 'Tree care', title: 'Tree care, a later module', who: 'Luis', tags: ['v2'] },
    { id: 'sl12-recap', act: 3, short: 'Recap', title: 'Recap: one platform for every line', who: 'Everyone', tags: [] }
  ],
  credits: { 'sl07-warranty': 2, 'sl08-lighting': 8, 'sl09-holiday': 40 },
  state: { lighting: false, wave: false, ran: false, head: false, ticket: false, approved: false, readings: false, filed: false, alert: false, remote: false, sched: false, resp: false, started: false, punch: false, claim: 0, volts: false, proposal: false, mock: false, circuit: false, booked: false, enrolled: false, zones: false },
  ov: {
    eyebrow: 'Clickable walkthrough · service lines',
    h: 'Every line a landscape company sells, with its own rules, in one schedule, one crew app and one set of books.',
    lede: 'Greenleaf sells maintenance, lawn programs, installs, irrigation and snow, and wants to add lighting, holiday lighting and mosquito. Follow a year of specialist work: turning a line on, a spring start-up wave held for a freeze, a start-up with a pre-authorized repair, a backflow test, a leak alert from a smart controller, an 811 ticket that blocks digging, a plant warranty claim, a lighting visit after dusk, holiday lights sold from a concept image, a mosquito program and tree care.',
    cast: [
      { h: 'Greenleaf', icon: 'building', items: [['Erin Castillo', 'owner'], ['Luis Ortega', 'ops manager'], ['Tasha Greene', 'office manager'], ['Devon Price', 'irrigation and lighting technician, certified backflow tester'], ['Andrés Vega', 'Crew 1 lead, installs'], ['Maria López', 'technician, licensed applicator'], ['Sam Kowalski', 'estimator'], ['Jess Morales', 'designer']] },
      { h: 'Clients', icon: 'users', items: [['Rachel and Tom Brennan', 'weekly mowing from the recurring walkthrough, plus irrigation'], ['Ada and Chidi Okafor', 'install from the AI design walkthrough'], ['Maple Ridge HOA', 'commercial account with smart controllers']] },
      { h: 'Engines', icon: 'cog', items: [['Program Engine', 'rounds and windows'], ['Application Compliance Engine', 'records, labels, notices'], ['Warranty Engine', 'terms, claims, reserve']] }
    ],
    extra: '<p class="wt-note mt14">Prices are illustrative price-book values from the service-line spec. Jurisdiction rules (one-call, backflow filing, pesticide) come from curated rule packs and are marked verify where they need first-hand confirmation.</p>'
  },
  screens: {}, bts: {}, actions: {}, inputs: {}, ensure: {}
};

/* sl01 */
WT.screens['sl01-lines'] = function (S) {
  var mods = [['Lawn and PHC', 'sprout', true, 'mvp', '412 enrolled'], ['Irrigation', 'drop', true, 'mvp', '142 systems'], ['Install projects', 'clipboard', true, 'mvp', '11 open'], ['Commercial grounds', 'building', true, 'mvp', '5 sites'], ['Snow Lite', 'snow', true, 'mvp', '64 sites'], ['Seasonal campaigns', 'flag', true, 'mvp', 'aeration, cleanups'], ['Landscape lighting', 'bolt', S.lighting, 'v1', S.lighting ? '11 systems imported' : 'off'], ['Holiday lighting', 'star', false, 'v1', 'off'], ['Mosquito and pest', 'shield', false, 'v1', 'off'], ['Backflow', 'drop', true, 'v1', '38 devices'], ['Tree care', 'leaf', false, 'v2', 'later']];
  var cal = [['Lawn and PHC', [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], 'x'], ['Irrigation', [0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0], 'x2'], ['Snow', [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1], 'x3'], ['Lighting', [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0], 'x4'], ['Holiday', [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1], 'x3'], ['Mosquito', [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0], 'x2']];
  var months = 'JFMAMJJASOND'.split('');
  var main = '<div class="apphead"><span class="crumb">Settings › Service lines</span><h3>What Greenleaf sells</h3></div><div class="mod-grid">' + mods.map(function (m) { return '<div class="mod' + (m[2] ? ' on' : '') + '"><div class="hd"><b>' + ic(m[1]) + ' ' + m[0] + '</b>' + tag(m[3]) + '</div><span class="tiny muted">' + m[4] + '</span>' + (m[0] === 'Landscape lighting' && !S.lighting ? '<button type="button" class="btn xs primary" data-act="lighting" data-k="lighting">Turn on</button>' : '') + '</div>'; }).join('') + '</div>' +
    (S.lighting ? '<div class="wt-callout mt10">' + ic('check') + ' Lighting on. The setup wizard imported 11 lighting systems (214 fixtures, 13 transformers) from the lighting layers of past Design Studio installs, and added Basic, Plus and Premium plans to the price book.</div>' : '') +
    '<div class="panel mt10"><h4>Year at a glance · Columbus (zone 6b)</h4><div class="cal"><span></span>' + months.map(function (m) { return '<span class="m">' + m + '</span>'; }).join('') + cal.map(function (r) { return '<span class="lb">' + r[0] + '</span>' + r[1].map(function (v) { return '<span class="' + (v ? r[2] : '') + '"></span>'; }).join(''); }).join('') + '</div><div class="wt-note mt6">Windows load from the Region default and shift with each year\'s weather.</div></div>';
  return browser('app.rootline.com/settings/service-lines', slShell('Settings', main), 'Service line settings');
};
WT.actions.lighting = function (el, S) { S.lighting = true; };
WT.ensure['sl01-lines'] = function (S) { S.lighting = true; };
WT.bts['sl01-lines'] = function (S) {
  return {
    what: 'Each service line is a module with its own settings, templates, rule packs, crew-app screens and portal widgets, built on shared engines (programs, compliance, warranties, storms). Turning one on runs a setup wizard; turning one off never deletes data or silently disables a safety gate. Lighting can seed itself from the lighting layers of designs Greenleaf already installed.',
    agents: [['Service-line framework', 'Module manifests, toggles, setup wizards', 1]],
    trace: [{ c: 'module.enable(landscape_lighting)', r: S.lighting ? 'enabled' : 'off', ms: S.lighting ? '200 ms' : '', det: true, pending: !S.lighting }, { c: 'wizard.import(design lighting layers)', r: S.lighting ? '11 systems · 214 fixtures · 13 transformers' : '', ms: S.lighting ? '2.4 s' : '', det: true, pending: !S.lighting }, { c: 'calendar.region_defaults(Central Ohio)', r: '6 lines', ms: '40 ms', det: true }],
    hitl: [['Erin', 'chooses which lines Greenleaf sells.']],
    tags: [['mvp', 'framework, lawn and PHC, irrigation, installs, commercial, Snow Lite, campaigns'], ['v1', 'backflow, smart irrigation, lighting, holiday lighting, mosquito, full Snow and Ice'], ['v2', 'tree care']],
    specs: 'Spec: 14 §4.0.1-4.0.6 · 10 (lighting layer) · 22 §4.2.1 (packaging)'
  };
};

/* sl02 */
WT.screens['sl02-wave'] = function (S) {
  var days = [['Mon 12', 31], ['Tue 13', 26], ['Wed 14', 33], ['Thu 15', 37], ['Fri 16', 41], ['Sat 17', 44], ['Sun 18', 46], ['Mon 19', 45]];
  var fc = '<div style="display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:4px">' + days.map(function (d) { var bad = d[1] < 28; return '<div class="wt-kpi" style="padding:6px;text-align:center"><div class="l">' + d[0] + '</div><div class="v" style="font-size:1rem;color:' + (bad ? 'var(--danger-text)' : 'inherit') + '">' + d[1] + '°</div></div>'; }).join('') + '</div>';
  var main = '<div class="apphead"><span class="crumb">Irrigation › Spring start-ups</span><h3>142 systems · window Apr 1 - May 15</h3>' + pill(S.wave ? 'ok' : 'warn', S.wave ? 'Wave released' : 'Held: freeze') + '</div>' +
    '<div class="panel"><h4>Overnight lows · Columbus</h4>' + fc + '<div class="wt-note mt6">Gate: no lows below 28°F for 5 days after the start date. Tuesday\'s 26°F moves the first safe start to Thursday.</div></div>' +
    '<div class="wt-cols mt10"><div class="panel"><h4>Wave plan</h4><dl class="kv"><dt>First wave</dt><dd>Thu Apr 15 - Fri Apr 23 · 96 systems</dd><dt>Second wave</dt><dd>Apr 26 - May 7 · 46 systems</dd><dt>Duration</dt><dd>20 min + 4 min a zone + 10 min a backflow device</dd><dt>Technicians</dt><dd>Devon and 1 trainee</dd></dl></div>' +
    '<div class="panel"><h4>Client notices</h4><div class="wt-sms"><div class="wt-bubble them">Hi Rachel, Greenleaf here. Your sprinkler start-up is Thu Apr 15, 8-10 AM. We\'ll need the basement shutoff and the garage controller. Tap to confirm access: greenleafgrounds.com/p/…<small>Sent 48 h before</small></div></div>' + (S.wave ? '<div class="okline mt6">' + ic('check') + '96 notices scheduled · 0 conflicts</div>' : '<button type="button" class="btn sm primary mt10" data-act="wave" data-k="wave">Release the first wave</button>') + '</div></div>';
  return browser('app.rootline.com/irrigation/startups/2027', slShell('Irrigation', main), 'Irrigation start-up wave');
};
WT.actions.wave = function (el, S) { S.wave = true; };
WT.ensure['sl02-wave'] = function (S) { S.wave = true; };
WT.bts['sl02-wave'] = function (S) {
  return {
    what: 'Irrigation start-ups are a program with a window and a weather gate: no start-up until the forecast stays above a hard-freeze threshold for several days, because pressurized pipes and backflow devices crack in a freeze. The wave is planned from each system\'s zone and device count, and clients get access instructions to confirm in the portal.',
    agents: [['Program Engine', 'Rounds, windows and weather gates', 1], ['Scheduling', 'Waves, durations, routes', 1]],
    trace: [{ c: 'forecast.lows(Columbus, 8 days)', r: 'min 26°F Tue Apr 13', ms: '300 ms', det: true }, { c: 'gate.freeze(28°F, 5 days)', r: 'first safe start Thu Apr 15', ms: '10 ms', det: true }, { c: 'wave.plan(142 systems)', r: '96 + 46', ms: '1.6 s', det: true }, { c: 'notices.schedule(access)', r: S.wave ? '96 scheduled' : 'waiting', ms: '', det: true, pending: !S.wave }],
    hitl: [['Luis', 'releases the wave.']],
    tags: [['mvp', 'irrigation seasonal services with freeze gates, duration model, client prep notices']],
    specs: 'Spec: 14 §4.2.3, §4.0.6 · 04 (routing) · 06 (portal access confirmation)'
  };
};

/* sl03 */
WT.screens['sl03-startup'] = function (S) {
  var zones = [['1', 'Front lawn rotors', 'ok'], ['2', 'Front beds drip', 'ok'], ['3', 'Side lawn spray', 'ok'], ['4', 'Back lawn spray', S.head ? 'fixed' : 'head'], ['5', 'Back lawn rotors', 'ok'], ['6', 'Patio beds drip', 'ok'], ['7', 'Back beds drip', S.ticket ? 'ticket' : 'valve'], ['8', 'Parkway spray', 'ok'], ['9', 'Side beds drip', 'ok']];
  var body = '<p class="ptitle" style="font-size:1rem">Start-up · Brennan</p><p class="psub">612 Evening St · 9 zones · PVB</p>' + (S.ran ? zones.map(function (z) {
    var st = z[2] === 'ok' ? pill('ok', 'OK') : z[2] === 'fixed' ? pill('ok', 'Head replaced') : z[2] === 'head' ? '<button type="button" class="btn xs primary" data-act="head" data-k="head">Replace head $45</button>' : z[2] === 'ticket' ? pill('info', 'Ticket') : '<button type="button" class="btn xs" data-act="ticket" data-k="ticket">Valve won\'t open</button>';
    return '<div class="zone-row"><span class="zn">Z' + z[0] + '</span><span>' + z[1] + '</span>' + st + '</div>';
  }).join('') : '<button type="button" class="btn primary" style="justify-content:center" data-act="ran" data-k="ran">Pressurize and run each zone</button>') +
    (S.ran ? '<div class="tiny muted mt6">Static 62 psi · rain sensor tested · schedule set for spring</div>' : '');
  var office = '<div class="panel"><h4>What gets billed</h4><table class="data tight"><tbody><tr><td>Spring start-up, up to 6 zones</td><td class="num">$85.00</td></tr><tr><td>3 extra zones × $9</td><td class="num">$27.00</td></tr><tr><td>Backflow device opened</td><td class="num">$25.00</td></tr>' + (S.head ? '<tr><td>Replace 4 in spray head (zone 4)</td><td class="num">$45.00</td></tr>' : '') + '</tbody></table><div class="wt-note mt6">The zone count comes from the system inventory, so the price is right on the first invoice. Pre-authorized repairs up to $150 need no call.</div></div>' +
    (S.ticket ? '<div class="panel"><h4>Repair ticket RT-2231 · zone 7</h4><div class="tiny">Valve won\'t open; likely solenoid. Estimate $165 is over the $150 pre-authorization, so the Brennans approve in the portal.</div>' + (S.approved ? '<div class="okline mt6">' + ic('check') + 'Approved by Rachel · scheduled Tue with Devon</div>' : '<button type="button" class="btn sm mt6" data-act="approved" data-k="approved">Simulate Rachel approving</button>') + '</div>' : '');
  return devRow(techPhone(body, { label: 'Technician app: start-up', k: 'su' }), '<div class="wt-stack" style="flex:1 1 340px;min-width:0">' + office + '</div>');
};
WT.actions.ran = function (el, S) { S.ran = true; };
WT.actions.head = function (el, S) { S.head = true; };
WT.actions.ticket = function (el, S) { S.ticket = true; };
WT.actions.approved = function (el, S) { S.approved = true; };
WT.ensure['sl03-startup'] = function (S) { S.ran = true; S.head = true; S.ticket = true; S.approved = true; };
WT.bts['sl03-startup'] = function (S) {
  return {
    what: 'The technician works zone by zone from the system inventory: controller, zones with photos and valve locations, and the backflow device. A broken head under the client\'s pre-authorized limit is fixed and billed on the spot. A bigger problem becomes a repair ticket the client approves in the portal. Every repair links to its zone, so a zone with repeated repairs is flagged for renovation.',
    agents: [['Irrigation module', 'System inventory, seasonal checklist, pricing from zone count', 1], ['Repair tickets', 'Pre-authorized limit and client approval', 1]],
    trace: [{ c: 'system.load(Brennan, 9 zones, PVB)', r: 'cached for offline', ms: '—', det: true }, { c: 'checklist.run(start-up)', r: S.ran ? '7 OK, 2 issues' : 'not started', ms: '', det: true, pending: !S.ran }, { c: 'repair.preauth(zone 4, $45 ≤ $150)', r: S.head ? 'fixed, billed' : '', ms: '', det: true, pending: !S.head }, { c: 'ticket.create(zone 7, $165 > $150)', r: S.ticket ? (S.approved ? 'approved by client' : 'waiting for the client') : '', ms: '', det: true, pending: !S.ticket, human: S.ticket && !S.approved }],
    hitl: [['Devon', 'diagnoses and fixes.'], ['Rachel Brennan', 'approves anything over her pre-authorized limit.']],
    tags: [['mvp', 'system inventory, zone maps (basic), start-ups, repair tickets, pre-authorized limits, pricing by zone count']],
    specs: 'Spec: 14 §4.2.1-4.2.4, §4.2.8 · 05 (crew app) · 06 (portal approvals) · 07 (invoice)'
  };
};

/* sl04 */
WT.screens['sl04-backflow'] = function (S) {
  var body = '<p class="ptitle" style="font-size:1rem">Backflow test · PVB</p><p class="psub">Brennan · ¾ in · serial on file</p><div class="pcard tiny"><dl class="kv"><dt>Tester</dt><dd>Devon Price · certification current</dd><dt>Gauge</dt><dd>calibrated 9 months ago</dd></dl></div>' +
    (S.readings ? '<div class="pcard tiny"><dl class="kv"><dt>Air inlet opened</dt><dd>1.4 psid (≥ 1.0)</dd><dt>Check valve held</dt><dd>1.6 psid (≥ 1.0)</dd><dt>Result</dt><dd>' + pill('ok', 'Pass') + '</dd></dl></div>' : '<button type="button" class="btn primary" style="justify-content:center" data-act="readings" data-k="readings">Enter field readings</button>');
  var main = '<div class="apphead"><span class="crumb">Irrigation › Backflow › File now</span><h3>Tests to file with the water purveyor</h3></div><div class="panel"><table class="data tight"><thead><tr><th>Property</th><th>Device</th><th>Result</th><th>Deadline</th><th></th></tr></thead><tbody><tr><td>Brennan</td><td>PVB ¾ in</td><td>' + (S.readings ? pill('ok', 'Pass') : pill('', 'Not tested')) + '</td><td>per city pack</td><td>' + (S.filed ? pill('ok', 'Filed · conf. 7Q42-118') : '<button type="button" class="btn xs primary" data-act="filed" data-k="filed"' + (S.readings ? '' : ' disabled') + '>Copy fields and mark filed</button>') + '</td></tr><tr><td>Maple Ridge HOA, entrance</td><td>RP 1 in</td><td>' + pill('ok', 'Pass') + '</td><td>per city pack</td><td>' + pill('ok', 'Filed') + '</td></tr></tbody></table>' +
    '<div class="wt-note mt6">Most purveyor portals have no public API, so Rootline prepares the jurisdiction\'s PDF and copy-ready fields and records the confirmation number. A test can\'t be recorded with an expired certification or an out-of-calibration gauge.</div></div>' +
    '<div class="panel mt10"><h4>Billing</h4><table class="data tight"><tbody><tr><td>Backflow test, first device</td><td class="num">$85.00</td></tr><tr><td>Filing fee (pass-through, if the city charges one)</td><td class="num">per pack</td></tr></tbody></table></div>';
  return withPhone(browser('app.rootline.com/irrigation/backflow/file-now', slShell('Irrigation', main), 'Backflow filing queue'), techPhone(body, { label: 'Technician app: backflow test', k: 'bf' }));
};
WT.actions.readings = function (el, S) { S.readings = true; };
WT.actions.filed = function (el, S) { S.filed = true; };
WT.ensure['sl04-backflow'] = function (S) { S.readings = true; S.filed = true; };
WT.bts['sl04-backflow'] = function (S) {
  return {
    what: 'Backflow assemblies are tested yearly by a certified tester and reported to the water purveyor. The test form follows the device type and judges pass or fail against the jurisdiction\'s thresholds; the tester\'s certification and gauge calibration are checked first. The office files from a queue with copy-ready fields and records the confirmation number, and clients get reminders before the next due date.',
    agents: [['Backflow (4.2.5)', 'Test forms, thresholds, jurisdiction packs, filing queue [V1]', 1]],
    trace: [{ c: 'credential.check(Devon, tester + gauge)', r: 'valid', ms: '20 ms', det: true }, { c: 'test.evaluate(PVB, readings)', r: S.readings ? 'pass: 1.4 / 1.6 psid' : 'waiting', ms: '', det: true, pending: !S.readings }, { c: 'filing.prepare(city pack)', r: S.readings ? 'PDF + fields' : '', ms: '', det: true, pending: !S.readings }, { c: 'filing.confirm(number)', r: S.filed ? '7Q42-118' : '', ms: '', det: true, pending: !S.filed }],
    hitl: [['Devon', 'tests and signs.'], ['Tasha', 'files and records the confirmation number.']],
    tags: [['v1', 'backflow tests, jurisdiction packs, filing queue, due-date reminders, commercial compliance view']],
    specs: 'Spec: 14 §4.2.5, §4.2.8 · 15 (tester credentials) · 07 (pass-through fees) — verify each purveyor\'s rules'
  };
};

/* sl05 */
WT.screens['sl05-smart'] = function (S) {
  var main = '<div class="apphead"><span class="crumb">Irrigation › Alerts</span><h3>Maple Ridge HOA · entrance controller</h3>' + pill('warn', 'High flow') + '</div>' +
    '<div class="wt-cols"><div class="panel"><h4>Alert from the smart controller</h4><dl class="kv"><dt>Zone</dt><dd>12 · entrance island spray</dd><dt>Flow</dt><dd>14.8 gpm vs 6.2 gpm normal</dd><dt>Seen</dt><dd>5:42 AM run, stopped by the master valve</dd><dt>Likely</dt><dd>broken lateral or missing nozzle</dd></dl>' +
    (S.alert ? '<div class="okline mt6">' + ic('check') + 'Repair ticket RT-2240 drafted · within the HOA\'s $250 pre-authorization</div>' : '<button type="button" class="btn sm primary mt10" data-act="alert" data-k="alert">Create the repair ticket</button>') + '</div>' +
    '<div class="panel"><h4>Repair visit</h4>' + (S.alert ? (S.sched ? '<div class="okline">' + ic('check') + 'Added to Devon\'s route today 1:30 PM · zone map and valve photo on his phone</div>' : '<button type="button" class="btn sm" data-act="sched" data-k="sched">Add to Devon\'s route today</button>') : '<p class="tiny muted">Waiting for the ticket.</p>') +
    (S.sched ? (S.remote ? '<div class="okline mt6">' + ic('check') + 'Devon ran zone 12 from his phone at the head: broken lateral found, fixed ($118)</div>' : '<button type="button" class="btn xs mt6" data-act="remote" data-k="remote">Run zone 12 from the phone</button>') : '') + '</div></div>' +
    '<div class="panel mt10"><h4>Water this month (budget = ET × plant factor × area)</h4><div class="tiny">5 Maple Ridge controllers · 41 zones · 2 zones over 125% of budget for 2 weeks → advisory sent to the property manager</div></div>';
  return browser('app.rootline.com/irrigation/alerts', slShell('Irrigation', main, { Irrigation: S.alert ? 0 : 1 }), 'Smart controller alert');
};
WT.actions.alert = function (el, S) { S.alert = true; };
WT.actions.sched = function (el, S) { S.sched = true; };
WT.actions.remote = function (el, S) { S.remote = true; };
WT.ensure['sl05-smart'] = function (S) { S.alert = true; S.sched = true; S.remote = true; };
WT.bts['sl05-smart'] = function (S) {
  return {
    what: 'With the property owner\'s consent, Rootline connects to smart controllers and turns their alarms into work: a high-flow alarm maps to a zone, drafts a priced repair ticket within the pre-authorized limit and lands on a technician\'s route with the zone map and valve photo. The technician can run the zone from the phone while standing at the head. Water budgets flag zones using far more than their plants need.',
    agents: [['Smart irrigation (4.2.6, 4.2.7)', 'Controller integrations, alerts, water budgets [V1]', 1]],
    trace: [{ c: 'controller.webhook(high_flow, zone 12)', r: '14.8 gpm vs 6.2', ms: '—', det: true }, { c: 'ticket.draft(RT-2240, preauth $250)', r: S.alert ? 'created' : 'suggested', ms: '', det: true, pending: !S.alert }, { c: 'route.insert(Devon, today)', r: S.sched ? '1:30 PM' : '', ms: '', det: true, pending: !S.sched }, { c: 'controller.zone_run(12, 5 min)', r: S.remote ? 'ran; logged with actor and reason' : '', ms: '', det: true, pending: !S.remote }],
    hitl: [['Luis', 'creates and schedules the repair.'], ['The HOA', 'can revoke contractor control in the portal at any time.']],
    tags: [['v1', 'Hydrawise and Rachio integrations, alerts to tickets, remote zone runs, water budgets'], ['v2', 'commercial controllers, advanced water budgets']],
    specs: 'Spec: 14 §4.2.6-4.2.8 · 20 (token storage) · 06 (contractor control consent)'
  };
};

/* sl06 */
WT.screens['sl06-dig'] = function (S) {
  var clear = S.resp;
  var body = '<p class="ptitle" style="font-size:1rem">Abbott front beds</p><p class="psub">Plant 22 shrubs and perennials · Crew 1</p>' +
    '<div class="pcard tiny"><dl class="kv"><dt>811 ticket</dt><dd>A7102-4418</dd><dt>Legal start</dt><dd>Thu 7:00</dd><dt>Utilities</dt><dd>' + (clear ? '5 of 5 responded' : '4 of 5 · gas pending') + '</dd></dl></div>' +
    (clear ? (S.started ? '<div class="okline">' + ic('check') + 'Excavation started 7:12 AM</div>' : '<button type="button" class="btn primary" style="justify-content:center" data-act="started" data-k="started">Start planting</button>') : '<div class="wt-callout danger">' + ic('lock') + ' Can\'t start: tree and shrub planting is excavation and needs a clear ticket. No override.</div>') +
    '<div class="pcard tiny mt6"><b>Private lines (not marked by 811)</b><br>Greenleaf\'s own as-built: irrigation lateral 3 ft from the walk, lighting cable along the bed edge.</div>';
  var main = '<div class="apphead"><span class="crumb">Projects › J-2421</span><h3>Dig ticket A7102-4418</h3>' + pill(clear ? 'ok' : 'warn', clear ? 'Clear to dig' : 'Waiting') + '</div><div class="panel"><dl class="kv"><dt>One-call center</dt><dd>Ohio (rule pack: 2 working days\' notice, verify)</dd><dt>Requested</dt><dd>Mon 9:14 AM · white-lined with photos</dd><dt>Legal start</dt><dd>Thu 7:00 AM</dd><dt>Responses</dt><dd>electric, water, telecom, cable: clear · gas: ' + (clear ? 'clear, marked yellow' : 'no response yet') + '</dd></dl>' +
    (clear ? '' : '<button type="button" class="btn sm mt10" data-act="resp" data-k="resp">' + ic('mail') + 'Positive response email arrives (gas)</button>') + '</div>';
  return withPhone(browser('app.rootline.com/projects/J-2421/dig-ticket', slShell('Projects', main), '811 dig ticket'), phone(body, { brand: 'Rootline Crew', sub: 'Andrés Vega · Crew 1', logo: 'truck', label: 'Crew app: dig gate', k: 'dg' }));
};
WT.actions.resp = function (el, S) { S.resp = true; };
WT.actions.started = function (el, S) { S.started = true; };
WT.ensure['sl06-dig'] = function (S) { S.resp = true; S.started = true; };
WT.bts['sl06-dig'] = function (S) {
  return {
    what: 'Any task tagged as excavation (planting trees, footings, trenching for irrigation or lighting) can\'t start in the crew app without a valid 811 ticket covering the property and date. There is no override. The legal start date comes from the state\'s one-call rule pack; positive responses from utilities are read from forwarded emails. Because one-call centers don\'t mark private lines, the crew also sees Greenleaf\'s own as-built irrigation and lighting.',
    agents: [['Dig ticket gate (4.5.6)', 'Rule packs, legal start, hard gate, offline cache [MVP]', 1], ['Positive response parsing [V1]', 'Reads utility responses from email', 0]],
    trace: [{ c: 'onecall.legal_start(Ohio pack)', r: 'Thu 7:00 AM', ms: '10 ms', det: true }, { c: 'response.parse(email from one-call center)', r: S.resp ? 'gas: clear' : 'waiting', ms: S.resp ? '1.8 s' : '', pending: !S.resp }, { c: 'gate.excavation(J-2421, Thu)', r: S.resp ? 'open' : 'closed (no override)', ms: '5 ms', det: true }, { c: 'visit.start(excavation)', r: S.started ? '7:12 AM' : '', ms: '', det: true, pending: !S.started }],
    hitl: [['Andrés', 'can only start when the gate opens; nobody can override it.']],
    tags: [['mvp', '811 dig tickets, rule packs, hard gate, private-line layers'], ['v1', 'positive response parsing']],
    specs: 'Spec: 14 §4.5.6 · 04 (dig-ticket scheduling gate) · 05 (offline gate) — verify per one-call center'
  };
};

/* sl07 */
WT.screens['sl07-warranty'] = function (S) {
  var claimUI = S.claim === 0 ? '<button type="button" class="btn sm" data-act="claim" data-k="claim0">Simulate a claim next June</button>' : '<div class="panel"><h4>Claim WC-0091 · Ilex glabra \'Shamrock\', bed A</h4><dl class="kv"><dt>From</dt><dd>Ada Okafor, portal, photo pinned on the plan</dd><dt>Coverage</dt><dd>shrubs 1 year · installed last September · in term</dd><dt>Conditions</dt><dd>watering log and visit photos look normal</dd></dl><div class="wt-bubble ai mt6">Likely winter burn on the exposed west corner of bed A. The Plant KB lists inkberry as hardy here, so this is establishment stress, not a poor fit. Suggest: replace in kind and add a burlap screen note to the care guide.</div>' +
    (S.claim === 1 ? '<button type="button" class="btn sm primary mt6" data-act="claim" data-k="claim1">Approve and schedule the replacement (Jess)</button>' : '<div class="okline mt6">' + ic('check') + 'Approved · replacement with Crew 1 on Jun 14 · carries the original term</div>' + je([['2410 Warranty Reserve', 38.40, 0], ['1320 Inventory - Plants', 0, 24.00], ['2310 Accrued Wages (0.5 h at cost)', 0, 14.40]])) + '</div>';
  var main = '<div class="apphead"><span class="crumb">Projects › P-1203</span><h3>Okafor backyard · closeout</h3>' + pill('ok', 'Install complete') + '</div><div class="wt-cols"><div class="panel"><h4>Punch list</h4><ul class="wt-list"><li class="wt-row soft"><span class="wt-ic ok">' + ic('check') + '</span><span>Re-stake the redbud</span><span></span></li><li class="wt-row soft"><span class="wt-ic ok">' + ic('check') + '</span><span>Top up mulch in bed C</span><span></span></li></ul>' +
    (S.punch ? '<div class="okline mt6">' + ic('check') + 'Signed off by the Okafors in the portal; final invoice released</div>' : '<button type="button" class="btn sm primary mt6" data-act="punch" data-k="punch">Simulate client sign-off</button>') + '</div>' +
    '<div class="panel"><h4>Closeout package</h4><ul style="margin:0;padding-left:18px;font-size:.76rem;color:var(--text-2);display:grid;gap:3px"><li>As-built plan and plant list (70 plants, with the 2 substitutions)</li><li>Care guide for each plant from the Plant KB</li><li>Warranty: trees and shrubs 1 year, perennials 1 growing season</li><li>Offer: maintenance program with bed care</li></ul></div></div><div class="mt10">' + (S.punch ? claimUI : '') + '</div>';
  return browser('app.rootline.com/projects/P-1203/closeout', slShell('Projects', main), 'Project closeout and warranty');
};
WT.actions.punch = function (el, S) { S.punch = true; };
WT.actions.claim = function (el, S) { S.claim = Math.min(2, S.claim + 1); };
WT.ensure['sl07-warranty'] = function (S) { S.punch = true; S.claim = 2; };
WT.bts['sl07-warranty'] = function (S) {
  return {
    what: 'The client signs off the punch list in the portal, which can release the final invoice. Closeout hands over the as-built plan, the plant list and a care guide generated from the Plant KB. When a plant fails, the client files a claim with a photo pinned on the plan; the Warranty Engine checks the term and conditions, AI suggests a probable cause from the KB, and the designer decides. The replacement draws on the warranty reserve accrued from install revenue.',
    agents: [['Warranty Engine', 'Terms, conditions, claims, reserve [V1 claims]', 1], ['Copilot with Plant KB', 'Suggests a probable cause', 0]],
    trace: [{ c: 'punchlist.signoff(Okafor)', r: S.punch ? 'signed; final invoice released' : 'waiting', ms: '', det: true, pending: !S.punch }, { c: 'warranty.check(WC-0091)', r: S.claim >= 1 ? 'in term; conditions met' : '', ms: '', det: true, pending: S.claim < 1 }, { c: 'ai.cause(KB: Ilex glabra, site, photos)', r: S.claim >= 1 ? 'winter burn, establishment stress' : '', ms: S.claim >= 1 ? '3 s' : '', pending: S.claim < 1 }, { c: 'warranty.WR2(replacement)', r: S.claim >= 2 ? 'Dr 2410 $38.40' : '', ms: '', det: true, pending: S.claim < 2, human: S.claim === 1 }],
    hitl: [['The Okafors', 'sign off and file the claim.'], ['Jess', 'decides the claim; the AI only suggests a cause.']],
    tags: [['mvp', 'punch lists, closeout package, care guides'], ['v1', 'warranty claims, replacement rules, reserve draw-down, nursery pass-back']],
    specs: 'Spec: 14 §4.5.7 · 09 warranty.WR1-WR2, 2410 · 12 (care guides) · 06 (claims in the portal)'
  };
};

/* sl08 */
WT.screens['sl08-lighting'] = function (S) {
  var fx = [[12, 70], [22, 70], [80, 70], [88, 70], [30, 30], [70, 30], [45, 82], [55, 82], [8, 40], [92, 40], [15, 88, 'low'], [25, 92, 'low'], [35, 94, 'low']];
  var map = '<div class="fix-map" aria-label="Fixture map at night"><span class="house"></span><span class="tx"></span><span class="lbl" style="left:28%;top:62%">TX-1</span>' + fx.map(function (f) { return '<i class="' + (S.volts ? (f[2] || '') : '') + '" style="left:' + f[0] + '%;top:' + f[1] + '%"></i>'; }).join('') + '<span class="lbl" style="left:4%;top:80%">Run 3</span></div>';
  var body = '<p class="ptitle" style="font-size:1rem">Lighting · Plus plan</p><p class="psub">Castellano · 28 fixtures · visit 7:55 PM (sunset + 20)</p>' + map +
    (S.volts ? '<div class="pcard tiny mt6"><dl class="kv"><dt>TX-1 tap</dt><dd>14 V</dd><dt>Run 3, farthest</dt><dd>10.6 V ' + pill('warn', 'low') + '</dd><dt>Lamps used</dt><dd>1 of 4 this year</dd></dl></div>' : '<button type="button" class="btn primary mt6" style="justify-content:center" data-act="volts" data-k="volts">Take voltage readings</button>');
  var right = '<div class="wt-stack" style="flex:1 1 340px;min-width:0"><div class="panel"><h4>Run 3 check</h4>' + (S.volts ? '<div class="tiny">Estimated drop = 160 W × 140 ft ÷ 7,500 (12 AWG) = <b>3.0 V</b>, so the end of the run sees about 11 V from the 14 V tap; it reads 10.6 V. The transformer is at 82% of its rating (rule: 80%).</div>' + (S.proposal ? '<div class="okline mt6">' + ic('check') + 'Proposal P-1340 drafted: re-wire run 3 to a hub and add a second transformer, $1,180 · sent to Sam to review</div>' : '<button type="button" class="btn sm ai mt6" data-act="proposal" data-k="proposal">' + ic('spark') + 'Draft a fix proposal</button>') : '<p class="tiny muted">Readings first.</p>') + '</div>' +
    '<div class="panel"><h4>Plan</h4><div class="tiny">Plus: 2 visits a year, up to 4 lamps and one free outage call. 28 fixtures × $9 × 2 visits = $504 a year, autopay on Greenleaf\'s Stripe account.</div></div></div>';
  return devRow(techPhone(body, { label: 'Technician app: lighting visit', k: 'lt', time: '7:58' }), right);
};
WT.actions.volts = function (el, S) { S.volts = true; };
WT.actions.proposal = function (el, S) { S.proposal = true; };
WT.ensure['sl08-lighting'] = function (S) { S.volts = true; S.proposal = true; };
WT.bts['sl08-lighting'] = function (S) {
  return {
    what: 'Lighting service plans turn a one-time install into recurring revenue. The fixture map comes from the design\'s lighting layer; visits are scheduled after sunset automatically; readings are compared with a voltage-drop estimate from the actual cable and load; and a low run drafts a fix proposal. Allowance counters show how many lamp replacements are left on the plan before anything becomes billable.',
    agents: [['Lighting module (4.7)', 'Inventory, night windows, voltage checks, plan allowances [V1]', 1], ['Estimate drafting', 'Fix proposal from the fixture map', 0]],
    trace: [{ c: 'window.night(sunset 7:35 PM + 20)', r: '7:55 PM visit', ms: '10 ms', det: true }, { c: 'voltage.estimate(run 3: 160 W, 140 ft, 12 AWG)', r: '3.0 V drop', ms: '5 ms', det: true }, { c: 'readings.record', r: S.volts ? 'run 3 end 10.6 V (low); TX-1 82%' : 'waiting', ms: '', det: true, pending: !S.volts }, { c: 'estimate.draft(re-wire to hub + transformer)', r: S.proposal ? '$1,180 draft for Sam' : '', ms: S.proposal ? '8 s' : '', pending: !S.proposal }],
    hitl: [['Devon', 'takes the readings.'], ['Sam', 'reviews and sends the proposal.']],
    creditNote: 'An estimate draft is 8 credits.',
    tags: [['v1', 'lighting inventory, voltage records and drop check, service plans, night scheduling, DST timers, outage tickets'], ['v2', 'smart transformer integrations']],
    specs: 'Spec: 14 §4.7.1-4.7.6 · 10 (lighting layer) · 03 (proposal) · 22 §4.4.1'
  };
};

/* sl09 */
WT.screens['sl09-holiday'] = function (S) {
  var lines = [['C9 LED, first-story eaves', '168 ft × $4.25', 714.00], ['C9 LED, second-story ridge', '64 ft × $5.75', 368.00], ['Tree wraps, 12 ft', '2 × $189', 378.00], ['Wreath, 36 in', '1 × $85', 85.00]];
  var tot = 1545.00;
  var main = '<div class="apphead"><span class="crumb">Holiday › Quotes</span><h3>Holiday lighting · 2210 Arlington Ave</h3>' + pill('', 'Lease: Greenleaf owns the lights') + '</div><div class="wt-cols"><div class="panel"><h4>Concept</h4>' + holidaySVG(S.mock) + (S.mock ? '<div class="wt-note mt6">Concept image, sized from the measured rooflines.</div>' : '<button type="button" class="btn sm ai mt6" data-act="mock" data-k="mock">' + ic('spark') + 'Create concept images (3)</button>') + '</div>' +
    '<div class="wt-stack"><div class="panel"><h4>Quote from measured rooflines</h4><table class="data tight"><tbody>' + lines.map(function (l) { return '<tr><td>' + l[0] + '<span class="sub" style="display:block;color:var(--text-3);font-size:.7rem">' + l[1] + '</span></td><td class="num">' + money(l[2], true) + '</td></tr>'; }).join('') + '<tr><td><b>Install, takedown and storage</b></td><td class="num"><b>' + money(tot, true) + '</b></td></tr></tbody></table></div>' +
    '<div class="panel"><h4>Safety and capacity</h4>' + (S.circuit ? '<div class="tiny">Front porch GFCI, 15 A: limit 1,440 W (80% of 15 A × 120 V). Planned display <b>1,210 W</b> ✓. Uses 232 linear ft of capacity on Nov 12.</div>' : '<button type="button" class="btn xs" data-act="circuit" data-k="circuit">Check the circuit load</button>') +
    (S.booked ? '<div class="okline mt6">' + ic('check') + 'Booked Nov 12 · 50% deposit $772.50 paid · bins QR-labeled for this house</div>' : '<button type="button" class="btn sm primary mt6" data-act="booked" data-k="booked"' + (S.circuit ? '' : ' disabled') + '>Simulate booking with deposit</button>') + '</div></div></div>';
  return browser('app.rootline.com/holiday/quotes/HQ-0088', slShell('Holiday', main), 'Holiday lighting quote');
};
WT.actions.mock = function (el, S) { S.mock = true; };
WT.actions.circuit = function (el, S) { S.circuit = true; };
WT.actions.booked = function (el, S) { S.booked = true; };
WT.ensure['sl09-holiday'] = function (S) { S.mock = true; S.circuit = true; S.booked = true; };
WT.bts['sl09-holiday'] = function (S) {
  return {
    what: 'Holiday lighting fills the fourth quarter when green-season crews would otherwise be laid off. An AI concept image from the house photo sells the display; the price comes from measured rooflines in the price book; a circuit check keeps the continuous load under 80% of the breaker; capacity is booked in linear feet, not visits; and the deposit lands in Greenleaf\'s own Stripe account as a customer deposit. Custom-cut strands live in QR-labeled bins assigned to the house.',
    agents: [['AI concept images', 'Holiday concepts from a house photo', 0], ['Holiday module (4.8)', 'Measured quoting, circuit check, linear-foot capacity, storage [V1]', 1]],
    trace: [{ c: 'ai.mockup_set(holiday, 3 images)', r: S.mock ? '3 concepts, labeled' : 'not yet', ms: S.mock ? '22 s' : '', pending: !S.mock }, { c: 'quote.measure(rooflines)', r: '168 ft eaves, 64 ft ridge, 2 trees', ms: '—', det: true }, { c: 'circuit.check(15 A GFCI)', r: S.circuit ? '1,210 W of 1,440 W' : '', ms: '', det: true, pending: !S.circuit }, { c: 'booking.deposit(50%) → billing.P2', r: S.booked ? '$772.50 to 2150 Customer Deposits' : '', ms: '', det: true, pending: !S.booked }],
    hitl: [['Sam', 'sends the quote.'], ['The homeowner', 'chooses a date and pays the deposit.']],
    creditNote: 'A photo mockup set is 40 credits.',
    tags: [['v1', 'holiday lighting: concepts, measured quotes, circuit checks, ownership models, storage bins, capacity in linear feet']],
    specs: 'Spec: 14 §4.8.1-4.8.7 · 11 (mockups) · 09 billing.P2-P3 · 22 §4.4.1'
  };
};

/* sl10 */
WT.screens['sl10-mosquito'] = function (S) {
  var dates = ['May 1', 'May 22', 'Jun 12', 'Jul 3', 'Jul 24', 'Aug 14', 'Sep 4', 'Sep 25'];
  var main = '<div class="apphead"><span class="crumb">Mosquito › Enrollment</span><h3>Brennan · barrier program</h3></div><div class="wt-cols"><div class="panel"><h4>Season (every 21 days)</h4><div class="flex" style="flex-wrap:wrap;gap:4px">' + dates.map(function (d) { return pill('info', d); }).join('') + '</div><dl class="kv mt10"><dt>Per treatment</dt><dd>$79 (up to ½ acre)</dd><dt>Season</dt><dd>$632.00, or $600.40 prepaid (5% off)</dd></dl>' +
    (S.enrolled ? '<div class="okline mt6">' + ic('check') + 'Enrolled, prepaid $600.40 · recognized per treatment</div>' : '<button type="button" class="btn sm primary mt6" data-act="enrolled" data-k="enrolled">Simulate the Brennans enrolling (prepay)</button>') + '</div>' +
    '<div class="panel"><h4>No-spray zones and rules</h4>' + (S.zones ? '<ul style="margin:0;padding-left:18px;font-size:.76rem;color:var(--text-2);display:grid;gap:3px"><li>Neighbor\'s vegetable garden: 25 ft buffer, drawn on the map</li><li>Backyard pond: label water setback enforced</li><li>Pollinators: "blooming plants avoided" confirmation on every record</li><li>Technician: Maria López, license category for mosquito confirmed</li></ul>' : '<button type="button" class="btn sm" data-act="zones" data-k="zones">Draw no-spray zones</button>') + '</div></div>';
  return browser('app.rootline.com/mosquito/enroll/brennan', slShell('Mosquito', main), 'Mosquito program');
};
WT.actions.enrolled = function (el, S) { S.enrolled = true; };
WT.actions.zones = function (el, S) { S.zones = true; };
WT.ensure['sl10-mosquito'] = function (S) { S.enrolled = true; S.zones = true; };
WT.bts['sl10-mosquito'] = function (S) {
  return {
    what: 'Mosquito and tick control is a high-margin add-on on the same routes. It reuses the program and compliance engines and adds interval scheduling, no-spray geometry (neighbors\' gardens, water setbacks from the label), a pollinator confirmation on every record, and a license check because mosquito work can need a different applicator category than turf.',
    agents: [['Mosquito module (4.9)', 'Intervals, no-spray zones, pollinator and water rules [V1]', 1], ['Application Compliance Engine', 'Records, labels, registries', 1]],
    trace: [{ c: 'program.intervals(21 days from May 1)', r: '8 treatments', ms: '10 ms', det: true }, { c: 'enroll(prepay 5%)', r: S.enrolled ? '$600.40 → deferred revenue' : 'waiting', ms: '', det: true, pending: !S.enrolled }, { c: 'geometry.no_spray(garden 25 ft, pond setback)', r: S.zones ? '2 zones' : '', ms: '', det: true, pending: !S.zones }, { c: 'credential.category(Maria, mosquito)', r: 'valid', ms: '20 ms', det: true }],
    hitl: [['The Brennans', 'enroll.'], ['Maria', 'confirms pollinator and buffer checks on each visit.']],
    tags: [['v1', 'mosquito and pest programs, no-spray zones, pollinator and water setbacks, rain re-treat']],
    specs: 'Spec: 14 §4.9.1-4.9.6 · 15 (license categories) · 09 billing.P5 (prepaid recognition)'
  };
};

/* sl11 */
WT.screens['sl11-tree'] = function (S) {
  var main = '<div class="apphead"><span class="crumb">Tree care</span><h3>A later module</h3>' + tag('v2') + '</div><div class="wt-cols"><div class="panel"><h4>What it will do</h4><ul style="margin:0;padding-left:18px;font-size:.78rem;color:var(--text-2);display:grid;gap:4px"><li>GPS tree inventory per property, with species from the Plant KB</li><li>Risk assessment aligned with ISA practice: likelihood of failure × impact → risk rating</li><li>Work prescriptions (prune types, cabling, removal) priced from the price book</li><li>Permits for right-of-way and protected trees</li><li>Crane jobs with lift plans and road closures</li></ul></div>' +
    '<div class="panel"><h4>Until then</h4><div class="tiny">Greenleaf subcontracts tree work (Tall Oaks Tree Service in the operations walkthrough) through sub work orders with a compliance gate. Tree Care will be a $59/mo add-on on Starter and Grow and included on Pro.</div></div></div>';
  return browser('app.rootline.com/tree-care', slShell('Settings', main), 'Tree care (later)');
};
WT.bts['sl11-tree'] = function (S) {
  return {
    what: 'Tree care is planned as a later module so the launch can focus on the lines Great Lakes maintenance firms run most. Until then, tree work runs through subcontractors with the compliance gate shown in the operations walkthrough.',
    hitl: [['Luis', 'subcontracts tree work today.']],
    tags: [['v2', 'tree inventory, risk assessment, prescriptions, permits, crane jobs']],
    specs: 'Spec: 14 §4.4 · 13 §4.13 (subcontractors) · 22 §4.2.1 (add-on pricing)'
  };
};

/* sl12 */
WT.screens['sl12-recap'] = function (S) {
  var rows = [['Turn lines on; season calendar', 'MVP framework; lighting V1'], ['Start-up wave held for a freeze', 'MVP'], ['Start-up with pre-authorized repair', 'MVP'], ['Backflow test and filing', 'V1'], ['Smart-controller leak alert', 'V1'], ['811 gate with no override', 'MVP (parsing V1)'], ['Closeout, then a warranty claim', 'MVP and V1'], ['Lighting visit after dusk', 'V1'], ['Holiday lights from a concept image', 'V1'], ['Mosquito program', 'V1'], ['Tree care', 'V2']];
  return '<div class="panel"><table class="data tight"><thead><tr><th>Step</th><th>Scope</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>'; }).join('') + '</tbody></table><p class="tiny muted mt10">50 AI credits in total: a warranty cause suggestion, a lighting fix proposal and a set of holiday concept images. Gates for freeze, 811, licenses and circuits are rules, not AI.</p></div>' +
    '<div class="flex mt14"><a class="btn" href="#overview">' + ic('arrow-l') + 'Back to start</a><a class="btn" href="wt-crew-day.html">A crew\'s day (lawn rounds and Snow Lite)</a><a class="btn primary" href="walkthroughs.html">All walkthroughs ' + ic('arrow-r') + '</a></div>';
};
WT.bts['sl12-recap'] = function (S) {
  return {
    what: 'Multi-line companies today run two to four niche tools. Rootline runs every line on one schedule, one crew app, one portal and one ledger, while each line keeps its own rules: freeze gates, backflow thresholds, dig tickets, voltage checks, circuit loads, no-spray zones and warranty terms.',
    hitl: [['Everyone', 'made the decisions; rules enforced the safety gates.']],
    tags: [['mvp', 'framework, lawn and PHC, irrigation, installs with the 811 gate, commercial, Snow Lite, campaigns'], ['v1', 'backflow, smart irrigation, lighting, holiday, mosquito, warranty claims, full snow'], ['v2', 'tree care']],
    specs: 'Spec: 14 (whole module) · 04, 05, 06, 07, 09, 11, 12'
  };
};
