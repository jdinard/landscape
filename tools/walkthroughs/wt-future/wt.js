/* Walkthrough: the future, clearly labeled moonshots (doc 23, with 12, 14, 17, 18, 20, 22).
   Every screen is a concept for a later scope tier; tags follow doc 23 §4.4 and doc 24. */

var FX_NAV = [['today', 'Today'], ['approve', 'Approvals'], ['users', 'Clients'], ['map', 'Properties'], ['calendar', 'Schedule'], ['dollar', 'Sales'], ['bank', 'Money'], ['chart', 'Reports'], ['spark', 'Autopilot'], ['cog', 'Settings']];
function fxShell(active, main) { return appShell(active, main, { nav: FX_NAV, navLabel: 'Future concept navigation' }); }
function banner(id, first, head) { return '<div class="future-banner">' + ic('spark') + '<span><b>' + id + '</b> · concept · first slice ' + tag(first) + ' · full bet ' + head.map(tag).join(' ') + '</span></div>'; }

var WT = {
  title: 'Rootline walkthrough: the future, clearly labeled moonshots',
  short: 'The future: moonshots',
  ovTitle: 'The future: moonshots',
  startLeft: 4180,
  acts: [
    { n: 'Act 1', t: 'The property\'s living record', sub: 'Digital twin, Passport, AR' },
    { n: 'Act 2', t: 'Autonomy and sensing', sub: 'Robot mowers, closed-loop irrigation, plant health' },
    { n: 'Act 3', t: 'Money and markets', sub: 'Predictive pricing, working capital, sustainability' },
    { n: 'Act 4', t: 'The self-driving back office', sub: 'Autopilot, voice, your own AI' }
  ],
  steps: [
    { id: 'fx01-twin', act: 0, short: 'Digital twin', title: 'The Okafor property, a living record', who: 'Erin Castillo, Jess Morales', ai: true, tags: ['v1', 'v2', 'v3'] },
    { id: 'fx02-passport', act: 0, short: 'Landscape Passport', title: 'A Landscape Passport transfers at the home sale', who: 'The Brennans, the buyers', tags: ['v1', 'v2', 'v3'] },
    { id: 'fx03-ar', act: 0, short: 'AR in the yard', title: 'Seeing year 5 in the yard with AR', who: 'Kate Harmon', tags: ['v2'] },
    { id: 'fx04-robots', act: 1, short: 'Robot mowers', title: 'A robotic mower fleet at Maple Ridge', who: 'Luis Ortega', tags: ['v2', 'v3'] },
    { id: 'fx05-irrigation', act: 1, short: 'Closed-loop water', title: 'Soil sensors close the irrigation loop', who: 'Devon Price', tags: ['v1', 'v3'] },
    { id: 'fx06-plant-health', act: 1, short: 'Plant health AI', title: 'A crew photo, a diagnosis and a prescription', who: 'Marco Ruiz, Luis', ai: true, tags: ['v1', 'v2'] },
    { id: 'fx07-pricing', act: 2, short: 'Predictive pricing', title: 'Price against Greenleaf\'s own win history', who: 'Sam Kowalski', ai: true, tags: ['v1', 'v2'] },
    { id: 'fx08-capital', act: 2, short: 'Spring Ramp', title: 'Partner-funded working capital for spring', who: 'Erin', tags: ['v2', 'v3'] },
    { id: 'fx09-esg', act: 2, short: 'Sustainability', title: 'A sustainability report for the HOA board', who: 'Erin, Maple Ridge HOA', tags: ['v1', 'v2'] },
    { id: 'fx10-autopilot', act: 3, short: 'Autopilot', title: 'Autopilot: policies, not prompts', who: 'Erin', ai: true, tags: ['v1', 'v2', 'v3'] },
    { id: 'fx11-voice', act: 3, short: 'Oye Rootline', title: 'A Spanish voice assistant on the crew\'s phone', who: 'Javier Torres', ai: true, tags: ['v1', 'v2'] },
    { id: 'fx12-mcp', act: 3, short: 'Your own AI', title: 'The owner\'s own AI assistant, connected safely', who: 'Erin', ai: true, tags: ['v1', 'v2'] },
    { id: 'fx13-recap', act: 3, short: 'Recap', title: 'Recap: rails now, bets on evidence', who: 'Everyone', tags: [] }
  ],
  credits: {},
  state: { twinVisit: false, consent: false, accepted: false, arYear: 5, botTask: false, loop: false, rx: false, price: 14896, shared: false, sent: false, raise: false, voice: 0, mcp: false },
  ov: {
    eyebrow: 'Clickable walkthrough · clearly labeled V1, V2 and V3 bets',
    h: 'One platform that holds every property\'s geometry, plants, visits and books can do things a stack of tools never can.',
    lede: 'These screens are concepts for later scope tiers, each labeled with its first slice and its full bet. They reuse the people and properties from the other walkthroughs: the Okafors\' living property record, the Brennans\' Landscape Passport at their home sale, Kate Harmon seeing year 5 in AR, robots and soil sensors at Maple Ridge, a plant diagnosis from a crew photo, pricing from Greenleaf\'s own win history, partner-funded spring capital, a sustainability report, Autopilot policies, a Spanish voice assistant and an MCP server for the owner\'s own AI.',
    cast: [
      { h: 'Greenleaf', icon: 'building', items: [['Erin Castillo', 'owner'], ['Luis Ortega', 'ops manager'], ['Sam Kowalski', 'estimator'], ['Jess Morales', 'designer'], ['Devon Price', 'irrigation technician'], ['Marco Ruiz, Javier Torres', 'Crew 2']] },
      { h: 'Clients', icon: 'users', items: [['The Okafors', 'design-build'], ['The Brennans', 'weekly mowing, moving away'], ['Kate Harmon', 'Design Studio walkthrough'], ['Maple Ridge HOA', 'commercial']] },
      { h: 'Principles', icon: 'shield', items: [['Rails before bets', 'cheap data foundations in MVP and V1'], ['Stage gates', 'every bet advances on evidence, with kill criteria'], ['Data rights', 'tenant data belongs to the Company; cross-tenant use is aggregated and opt-in']] }
    ],
    extra: '<p class="wt-note mt14">Nothing on these screens is a release promise. Tags describe scope order, not dates. Partner-funded fintech never routes client money through Rootline.</p>'
  },
  screens: {}, bts: {}, actions: {}, inputs: {}, ensure: {}
};

/* fx01 */
WT.screens['fx01-twin'] = function (S) {
  var pis = [['Cercis canadensis', 'Bed B · installed Sep', 'Healthy · 5.8 ft (predicted 5.5)'], ['Ilex glabra \'Shamrock\' ×4', 'Bed A', S.twinVisit ? '3 healthy · 1 replaced (warranty)' : '3 healthy · 1 browning'], ['Schizachyrium \'Standing Ovation\' ×21', 'Beds A, B, D', 'Healthy · ahead of growth curve'], ['Echinacea \'PowWow White\' ×15', 'Beds A-C', '2 missing after winter · flagged']];
  var tl = [['Sep 22', 'Install complete · 70 plant instances created from the as-built'], ['Oct 6', 'First maintenance visit · 14 photos tagged to plants'], ['Jun 9', 'Warranty claim WC-0091 (Ilex, bed A)'], ['Jun 14', S.twinVisit ? 'Mowing visit: Marco\'s photos updated 12 plant instances' : 'Next: mowing visit']];
  var main = banner('M-01 Persistent property digital twin', 'v1', ['v2', 'v3']) + '<div class="apphead"><span class="crumb">Properties › Okafor</span><h3>Property record</h3></div><div class="wt-cols"><div class="panel"><h4>Timeline</h4><div class="tl">' + tl.map(function (t) { return '<div class="tl-item"><span class="d">' + t[0] + '</span><span>' + t[1] + '</span></div>'; }).join('') + '</div>' + (S.twinVisit ? '' : '<button type="button" class="btn sm primary mt10" data-act="twinVisit" data-k="twinVisit">Complete Jun 14 mowing visit</button>') + '</div>' +
    '<div class="panel"><h4>Plant instances</h4><div class="pi-grid">' + pis.map(function (p) { return '<div class="pi"><b>' + p[0] + '</b><span class="muted">' + p[1] + '</span><span>' + p[2] + '</span></div>'; }).join('') + '</div></div></div>';
  return browser('app.rootline.com/properties/okafor/twin', fxShell('Properties', main), 'Property digital twin (concept)');
};
WT.actions.twinVisit = function (el, S) { S.twinVisit = true; };
WT.ensure['fx01-twin'] = function (S) { S.twinVisit = true; };
WT.bts['fx01-twin'] = function (S) {
  return {
    what: 'Every visit already captures geotagged photos, and the as-built design already knows every plant. The digital twin joins them: each plant is an instance with a health history and a growth curve compared with the Plant KB\'s prediction, so an ordinary mowing visit updates the record without extra work. It becomes the base for warranties, renewals and the Passport.',
    agents: [['Twin update', 'Matches visit photos to plant instances', 0]],
    trace: [{ c: 'visit.photos(Jun 14, 14 photos)', r: S.twinVisit ? '12 plant instances matched' : 'waiting', ms: '', pending: !S.twinVisit }, { c: 'growth.compare(KB curve)', r: 'Cercis +0.3 ft vs prediction', ms: '', det: true }, { c: 'plant_performance_ledger.append', r: S.twinVisit ? '12 observations' : '', ms: '', det: true, pending: !S.twinVisit }],
    hitl: [['Jess', 'reviews flagged plants; nothing is replaced automatically.']],
    creditNote: 'Future bet: AI costs will be published on the rate card before it ships.',
    tags: [['v1', 'first slice: plant instances and photo tagging on the property'], ['v2', 'twin with growth tracking'], ['v3', 'full digital twin']],
    specs: 'Spec: 23 M-01, §5.1, rails R-01 to R-03 · 10 (as-built) · 12 (growth curves)'
  };
};

/* fx02 */
WT.screens['fx02-passport'] = function (S) {
  var doc = '<div class="panel"><h4>' + ic('book') + ' Landscape Passport · 612 Evening St</h4><ul style="margin:0;padding-left:18px;font-size:.76rem;color:var(--text-2);display:grid;gap:3px"><li>Lawn 8,960 sq ft · weekly mowing history, 3 seasons</li><li>Irrigation: 9 zones, PVB backflow (passed Apr 2027), controller schedule</li><li>Aeration and overseeding each fall</li><li>No personal data, invoices or payment methods</li></ul></div>';
  var main = banner('M-12 Landscape Passport', 'v1', ['v2', 'v3']) + '<div class="apphead"><span class="crumb">Properties › Brennan</span><h3>Home sale: transfer the Passport</h3></div><div class="wt-cols">' + doc +
    '<div class="panel"><h4>Transfer</h4><div class="tl"><div class="tl-item"><span class="d">Step 1</span><span>' + (S.consent ? pill('ok', 'Rachel Brennan consented') : '<button type="button" class="btn xs primary" data-act="consent" data-k="consent">Rachel consents to share</button>') + '</span></div><div class="tl-item"><span class="d">Step 2</span><span>' + (S.accepted ? pill('ok', 'The buyers accepted') : '<button type="button" class="btn xs" data-act="accepted" data-k="accepted"' + (S.consent ? '' : ' disabled') + '>Buyers accept the Passport</button>') + '</span></div><div class="tl-item"><span class="d">Step 3</span><span>' + (S.accepted ? 'Greenleaf may send the new owners one welcome message with the current mowing price; anything more needs their consent.' : '…') + '</span></div></div></div></div>';
  return browser('app.rootline.com/properties/brennan/passport', fxShell('Properties', main), 'Landscape Passport (concept)');
};
WT.actions.consent = function (el, S) { S.consent = true; };
WT.actions.accepted = function (el, S) { S.accepted = true; };
WT.ensure['fx02-passport'] = function (S) { S.consent = true; S.accepted = true; };
WT.bts['fx02-passport'] = function (S) {
  return {
    what: 'A home\'s landscape is a real asset with a history nobody keeps. The Passport is a consented summary of the property record (plants, irrigation and lighting maps, service history, warranties) that the seller can share with buyers or an agent. It never includes the seller\'s personal or payment data, and the buyers decide whether Greenleaf can contact them.',
    agents: [['Passport transfer', 'Consent-gated property summary', 1]],
    trace: [{ c: 'passport.assemble(612 Evening St)', r: 'property facts only', ms: '400 ms', det: true }, { c: 'consent.seller', r: S.consent ? 'granted' : 'waiting', ms: '', det: true, pending: !S.consent }, { c: 'consent.buyer', r: S.accepted ? 'accepted; 1 welcome message allowed' : '', ms: '', det: true, pending: !S.accepted }],
    hitl: [['The Brennans', 'decide to share.'], ['The buyers', 'decide to accept and whether to be contacted.']],
    tags: [['v1', 'first slice: shareable property summary'], ['v2', 'transfer at sale'], ['v3', 'agent reports and the homeowner network']],
    specs: 'Spec: 23 M-12, §5.4 · 16 §4.21 (consent) · 20 (data rights)'
  };
};

/* fx03 */
WT.screens['fx03-ar'] = function (S) {
  var r = { 1: 0.45, 5: 0.8, 10: 1 }[S.arYear];
  var view = '<div class="ar-view" aria-label="Phone camera view with AR plants"><span class="house"></span>' +
    '<span class="pl" style="left:16%;top:40%;width:' + (90 * r) + 'px;height:' + (90 * r) + 'px"></span><span class="tagl" style="left:16%;top:36%">Serviceberry · year ' + S.arYear + '</span>' +
    '<span class="pl" style="left:44%;top:52%;width:' + (40 * r) + 'px;height:' + (40 * r) + 'px"></span><span class="pl" style="left:56%;top:53%;width:' + (40 * r) + 'px;height:' + (40 * r) + 'px"></span><span class="tagl" style="left:46%;top:47%">Hydrangea \'Bobo\'</span>' +
    '<span class="pl" style="left:30%;top:66%;width:' + (28 * r) + 'px;height:' + (28 * r) + 'px;background:rgba(150,140,210,.6)"></span><span class="pl" style="left:66%;top:66%;width:' + (28 * r) + 'px;height:' + (28 * r) + 'px;background:rgba(150,140,210,.6)"></span></div>';
  var body = view + '<div class="seg mt6">' + [1, 5, 10].map(function (y) { return '<button type="button" data-act="arYear" data-v="' + y + '" data-k="ar' + y + '" aria-pressed="' + (S.arYear === y) + '">Year ' + y + '</button>'; }).join('') + '</div><p class="tiny muted mt6">Anchored to the ground and the house corners; plants at the KB\'s size for that year.</p>';
  return '<div>' + banner('M-03 AR "See it in your yard"', 'v2', ['v2']) + devRow(phone(body, { brand: 'Greenleaf Grounds Co.', sub: 'Your design · AR', label: 'Homeowner phone: AR view', k: 'ar', noBrand: false }), ctxCard('Why it sells', ['Kate walks around her real yard and sees the design at year 1, 5 and 10.', 'Sizes come from the same KB growth curves as the Design Studio\'s 3D view.', 'AR uses the device\'s own scene understanding; no special hardware.'])) + '</div>';
};
WT.actions.arYear = function (el, S) { S.arYear = +el.getAttribute('data-v'); };
WT.bts['fx03-ar'] = function (S) {
  return {
    what: 'The design already has geometry and plants with growth data. AR places them on the actual lawn, anchored to the ground and the house, at install, year 5 or year 10, so clients can walk the future yard before they sign.',
    agents: [['AR preview', 'Design objects and KB sizes in AR', 1]],
    trace: [{ c: 'ar.anchor(ground, house corners)', r: 'tracking', ms: '—', det: true }, { c: 'growth.size(year ' + S.arYear + ')', r: 'KB curves', ms: '4 ms', det: true }],
    hitl: [['Kate', 'explores; nothing changes the design.']],
    creditNote: 'Future bet: no AI credits; AR runs on the device.',
    tags: [['v2', 'AR preview for homeowners (first slice and full bet)']],
    specs: 'Spec: 23 M-03 · 10 DS-MOB-06, DS-3D-06'
  };
};

/* fx04 */
WT.screens['fx04-robots'] = function (S) {
  var map = '<div class="robot-map" aria-label="Robot positions at Maple Ridge common areas"><span class="pond"></span><span class="lane" style="top:20%"></span><span class="lane" style="top:35%"></span><span class="lane" style="top:50%"></span><span class="lane" style="top:65%"></span><span class="bot" style="left:20%;top:16%">1</span><span class="bot ' + (S.botTask ? '' : 'alert') + '" style="left:60%;top:34%">2</span><span class="bot" style="left:34%;top:62%">3</span></div>';
  var main = banner('M-05 Robotic mower fleet orchestration', 'v2', ['v3']) + '<div class="apphead"><span class="crumb">Properties › Maple Ridge HOA</span><h3>Robot fleet · 3 units · common areas 6.2 ac</h3></div><div class="wt-cols"><div class="panel">' + map + '<dl class="kv mt6"><dt>This week</dt><dd>5.1 of 6.2 ac mowed by robots</dd><dt>Crew time saved</dt><dd>7.5 h (Crew 2 trims and edges only)</dd><dt>Cost per acre</dt><dd>robots $9.80 · crew $31.40</dd></dl></div>' +
    '<div class="panel"><h4>Alert</h4>' + (S.botTask ? '<div class="okline">' + ic('check') + 'Task added to Crew 2\'s Tuesday stop at Maple Ridge: free R-2, check the pond-edge boundary wire (photo attached)</div>' : '<div class="wt-callout warn">R-2 stuck near the pond edge for 40 min; boundary looks shifted.<div class="mt6"><button type="button" class="btn xs primary" data-act="botTask" data-k="botTask">Make it a crew task</button></div></div>') + '</div></div>';
  return browser('app.rootline.com/properties/maple-ridge/robots', fxShell('Properties', main), 'Robot fleet (concept)');
};
WT.actions.botTask = function (el, S) { S.botTask = true; };
WT.ensure['fx04-robots'] = function (S) { S.botTask = true; };
WT.bts['fx04-robots'] = function (S) {
  return {
    what: 'Robot mowers are cheap per acre but need people for setup, trimming and rescues. Rootline orchestrates them with the crews: robots take the open turf, the schedule assigns trim and edge visits, alerts become tasks on the next crew stop, and job cost compares robot and crew acres honestly.',
    agents: [['Fleet orchestration', 'OEM integrations, alerts to tasks, cost per acre', 1]],
    trace: [{ c: 'oem.status(3 robots)', r: 'R-2 stuck 40 min', ms: '—', det: true }, { c: 'task.create(Crew 2, Tue stop)', r: S.botTask ? 'added with photo' : 'suggested', ms: '', det: true, pending: !S.botTask }, { c: 'jobcost.per_acre(robot vs crew)', r: '$9.80 vs $31.40', ms: '', det: true }],
    hitl: [['Luis', 'decides which areas robots mow.']],
    creditNote: 'Future bet: priced per robot, not in AI credits.',
    tags: [['v2', 'first slice: robot status and alerts to tasks'], ['v3', 'full fleet orchestration']],
    specs: 'Spec: 23 M-05, §5.3 · 04 (schedule) · 09 (job cost)'
  };
};

/* fx05 */
WT.screens['fx05-irrigation'] = function (S) {
  var days = [['Mon', 32, 18, 18], ['Tue', 29, 18, 12], ['Wed', 35, 18, 0], ['Thu', 30, 18, 14], ['Fri', 27, 18, 16]];
  var bars = '<div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;align-items:end;height:130px">' + days.map(function (d) { var v = S.loop ? d[3] : d[2]; return '<div style="display:grid;gap:3px;align-items:end;height:100%;grid-template-rows:1fr auto"><div style="display:flex;align-items:end;height:100%"><span style="flex:1;height:' + (v / 20 * 100) + '%;background:var(--sky-100);border:1px solid var(--sky-700);border-radius:4px 4px 0 0"></span></div><div class="tiny" style="text-align:center"><b>' + d[0] + '</b><br>' + v + ' min · ' + d[1] + '% VWC</div></div>'; }).join('') + '</div>';
  var main = banner('M-07 Closed-loop smart irrigation', 'v1', ['v3']) + '<div class="apphead"><span class="crumb">Properties › Maple Ridge HOA</span><h3>Zone 12 · entrance island · soil sensor</h3></div><div class="wt-cols"><div class="panel"><h4>Run time per day ' + (S.loop ? '(closed loop)' : '(fixed schedule)') + '</h4>' + bars + '<div class="seg mt6"><button type="button" data-act="loop" data-v="0" data-k="l0" aria-pressed="' + !S.loop + '">Fixed schedule</button><button type="button" data-act="loop" data-v="1" data-k="l1" aria-pressed="' + S.loop + '">Closed loop</button></div></div>' +
    '<div class="panel"><h4>How the loop decides</h4><ul style="margin:0;padding-left:18px;font-size:.76rem;color:var(--text-2);display:grid;gap:3px"><li>Soil moisture from the sensor vs the hydrozone\'s target from the Plant KB</li><li>Reference ET and tomorrow\'s rain forecast</li><li>Guardrails: never below the plant\'s minimum; local watering-day rules</li></ul><dl class="kv mt6"><dt>Water this week</dt><dd>' + (S.loop ? '60 min vs 90 fixed (−33%)' : '90 min') + '</dd></dl></div></div>';
  return browser('app.rootline.com/properties/maple-ridge/irrigation', fxShell('Properties', main), 'Closed-loop irrigation (concept)');
};
WT.actions.loop = function (el, S) { S.loop = el.getAttribute('data-v') === '1'; };
WT.bts['fx05-irrigation'] = function (S) {
  return {
    what: 'Smart controllers (V1 in the service-line module) are the first slice. Adding soil-moisture sensors closes the loop: each day, run times are set from measured moisture against the plants\' needs from the KB, reference ET and the rain forecast, within guardrails. Water saved feeds the sustainability report.',
    agents: [['Irrigation loop', 'Daily run-time decisions within guardrails', 1]],
    trace: [{ c: 'sensor.vwc(zone 12, daily)', r: '27-35%', ms: '—', det: true }, { c: 'loop.decide(target from KB hydrozone, ET, forecast)', r: S.loop ? '60 min this week' : 'fixed 90 min', ms: '', det: true }, { c: 'controller.schedule(write)', r: S.loop ? 'applied; logged' : 'not applied', ms: '', det: true, pending: !S.loop }],
    hitl: [['Devon', 'sets guardrails; the HOA can revoke control.']],
    creditNote: 'Future bet: a monitoring fee per site that the Company resells, not AI credits.',
    tags: [['v1', 'first slice: smart controller integrations and alerts'], ['v3', 'closed-loop control with sensors']],
    specs: 'Spec: 23 M-07, §5.2 · 14 §4.2.6-4.2.7 · 12 (hydrozones)'
  };
};

/* fx06 */
WT.screens['fx06-plant-health'] = function (S) {
  var photo = '<div style="height:150px;border-radius:10px;background:linear-gradient(180deg,#9db8d6 0 30%,#7d9a5a 30% 100%);position:relative"><div style="position:absolute;left:44%;top:6%;width:12%;height:88%;background:#7a6650;border-radius:4px"></div><div style="position:absolute;left:28%;top:2%;width:44%;height:34%;border-radius:50%;background:rgba(110,140,80,.45);border:2px dashed rgba(255,255,255,.7)"></div><span class="tagl" style="position:absolute;left:30%;top:40%;font-size:.6rem;background:rgba(0,0,0,.55);color:#fff;padding:1px 4px;border-radius:4px">thin canopy · bark splits</span></div>';
  var body = '<p class="ptitle" style="font-size:1rem">Ash, Maple Ridge pond path</p>' + photo + (S.rx ? '' : '<div class="wt-bubble ai mt6">Signs consistent with emerald ash borer: canopy thinning, woodpecker damage, bark splits. Confidence 0.71. Confirm on site: look for D-shaped exit holes.</div>');
  var right = '<div class="wt-stack" style="flex:1 1 340px;min-width:0">' + banner('M-08 Plant health AI with prescriptions', 'v1', ['v2']) + '<div class="panel"><h4>Prescription options</h4><table class="data tight"><tbody><tr><td>Remove and grind (sub: Tall Oaks)</td><td class="num">$1,650</td></tr><tr><td>Trunk injection by a licensed applicator, if canopy loss is under the label threshold</td><td class="num">$385</td></tr><tr><td>Replacement tree from the KB (not ash)</td><td class="num">$640</td></tr></tbody></table>' + (S.rx ? '<div class="okline mt6">' + ic('check') + 'Luis confirmed exit holes on site; enhancement proposal sent to the HOA</div>' : '<button type="button" class="btn sm primary mt6" data-act="rx" data-k="rx">Confirm on site and propose</button>') + '</div></div>';
  return devRow(phone(body, { brand: 'Rootline Crew', sub: 'Marco Ruiz · Crew 2', logo: 'truck', label: 'Crew app: plant health photo', k: 'ph' }), right);
};
WT.actions.rx = function (el, S) { S.rx = true; };
WT.ensure['fx06-plant-health'] = function (S) { S.rx = true; };
WT.bts['fx06-plant-health'] = function (S) {
  return {
    what: 'A crew member\'s photo is checked against the Plant KB\'s pests and diseases for the Region and season. The AI gives a probable cause with a confidence and a check to confirm on site, never a final diagnosis, and the prescription options come from the price book and the Company\'s licensed services. A person confirms before anything is sold.',
    agents: [['Plant health AI', 'Photo plus KB region and season to a probable cause', 0], ['Prescriptions', 'Options from the price book and credentials', 1]],
    trace: [{ c: 'photo.analyze(KB: Fraxinus, Central Ohio, June)', r: 'EAB 0.71 · ash yellows 0.09', ms: '4 s' }, { c: 'prescriptions(price book, credentials)', r: '3 options', ms: '60 ms', det: true }, { c: 'confirm.site(Luis)', r: S.rx ? 'confirmed · proposal sent' : 'waiting', ms: '', det: true, pending: !S.rx, human: !S.rx }],
    hitl: [['Luis', 'confirms on site; the AI never sells a treatment by itself.']],
    creditNote: 'Future bet: AI costs will be published on the rate card before it ships.',
    tags: [['v1', 'first slice: photo triage with KB pest data'], ['v2', 'prescriptions and PHC upsell']],
    specs: 'Spec: 23 M-08 · 12 (pests and diseases by Region) · 14 (PHC programs)'
  };
};

/* fx07 */
WT.screens['fx07-pricing'] = function (S) {
  var prices = [12800, 13400, 14000, 14600, 14896, 15400, 16000];
  function win(p) { return Math.round(100 / (1 + Math.exp((p - 15400) / 900))); }
  function margin(p) { return (1 - 8480 / p) * 100; }
  var pts = prices.map(function (p, i) { return [20 + i * 60, 120 - win(p)]; });
  var svg = '<svg class="wt-svg" viewBox="0 0 420 140" role="img" aria-label="Win probability by price"><polyline points="' + pts.map(function (p) { return p.join(','); }).join(' ') + '" fill="none" stroke="#4e7a3e" stroke-width="2"/>' + prices.map(function (p, i) { var on = p === S.price; return '<circle cx="' + pts[i][0] + '" cy="' + pts[i][1] + '" r="' + (on ? 6 : 3) + '" fill="' + (on ? '#2f5a25' : '#9fbf8a') + '"/><text x="' + (pts[i][0] - 14) + '" y="136" font-size="8" fill="#555">$' + (p / 1000).toFixed(1) + 'k</text>'; }).join('') + '</svg>';
  var main = banner('M-22 Predictive pricing', 'v1', ['v2']) + '<div class="apphead"><span class="crumb">Sales › P-1288 · Harmon</span><h3>Price guidance</h3></div><div class="wt-cols"><div class="panel"><h4>Win probability by price</h4>' + svg + '<div class="seg mt6" style="flex-wrap:wrap">' + prices.map(function (p) { return '<button type="button" data-act="price" data-v="' + p + '" data-k="p' + p + '" aria-pressed="' + (S.price === p) + '">$' + num(p) + '</button>'; }).join('') + '</div></div>' +
    '<div class="panel"><h4>At $' + num(S.price) + '</h4><dl class="kv"><dt>Win probability</dt><dd>' + win(S.price) + '%</dd><dt>Gross margin</dt><dd>' + margin(S.price).toFixed(1) + '%</dd><dt>Based on</dt><dd>Greenleaf\'s own 214 design-build proposals: size, season, neighborhood, lead source</dd></dl><div class="wt-note mt6">Never uses other companies\' prices. Sam sets the price; the model only shows the trade-off.</div></div></div>';
  return browser('app.rootline.com/sales/P-1288/pricing', fxShell('Sales', main), 'Predictive pricing (concept)');
};
WT.actions.price = function (el, S) { S.price = +el.getAttribute('data-v'); };
WT.bts['fx07-pricing'] = function (S) {
  return {
    what: 'Predictive pricing learns from the Company\'s own proposals: which sizes, seasons, neighborhoods and lead sources won at what price. It shows the estimator the trade-off between win probability and margin. It never uses cross-tenant price data, and the estimator always sets the price.',
    agents: [['Pricing model', 'Win probability from the tenant\'s own win/loss history', 0]],
    trace: [{ c: 'model.features(P-1288)', r: '$14.9k design-build, spring, Worthington, referral', ms: '30 ms', det: true }, { c: 'model.win_curve', r: 'at $' + num(S.price) + ': see panel', ms: '80 ms' }],
    hitl: [['Sam', 'chooses the price.']],
    creditNote: 'Future bet: included in the Pro tier per doc 23; no per-use credits planned.',
    tags: [['v1', 'first slice: rule-based price guidance'], ['v2', 'learned win-probability curves']],
    specs: 'Spec: 23 M-22 · 18 (benchmark privacy: no cross-tenant prices) · 03 (proposals)'
  };
};

/* fx08 */
WT.screens['fx08-capital'] = function (S) {
  var main = banner('M-16 Working capital from ledger data ("Spring Ramp")', 'v2', ['v3']) + '<div class="apphead"><span class="crumb">Money › Financing</span><h3>Spring Ramp</h3></div><div class="wt-cols"><div class="panel"><h4>Why now</h4><div class="tiny">March payroll for the spring crew, nursery prepay discounts and H-2B costs arrive before April\'s revenue. Greenleaf\'s books show $412,000 of signed agreements for the season.</div>' + (S.shared ? '' : '<button type="button" class="btn sm primary mt10" data-act="shared" data-k="shared">Share 24 months of ledger data with a partner lender</button>') + '</div>' +
    '<div class="panel">' + (S.shared ? '<h4>Offer from a partner lender</h4><dl class="kv"><dt>Line</dt><dd>$60,000, draw as needed Feb-May</dd><dt>Cost</dt><dd>shown in full by the lender, with an APR</dd><dt>Repayment</dt><dd>fixed schedule from Greenleaf\'s bank account; never taken from client payments</dd></dl><div class="wt-note mt6">Rootline is not the lender and never holds funds. Erin can revoke data sharing at any time.</div>' + (S.sent ? '<div class="okline mt6">' + ic('check') + 'Erin chose to compare it with her bank\'s line first</div>' : '<button type="button" class="btn sm mt6" data-act="sent" data-k="sent">Save the offer to compare</button>') : '<p class="tiny muted">No data is shared until Erin says so.</p>') + '</div></div>';
  return browser('app.rootline.com/money/financing', fxShell('Money', main), 'Working capital (concept)');
};
WT.actions.shared = function (el, S) { S.shared = true; };
WT.actions.sent = function (el, S) { S.sent = true; };
WT.ensure['fx08-capital'] = function (S) { S.shared = true; S.sent = true; };
WT.bts['fx08-capital'] = function (S) {
  return {
    what: 'Landscape companies spend before they earn every spring. A real ledger with signed agreements is better evidence than a bank statement, so with the owner\'s consent a partner lender can make an offer. Rootline earns a referral fee, is never the lender, never holds funds and never repays loans from client payments.',
    agents: [['Spring Ramp', 'Consented data share to licensed partners', 1]],
    trace: [{ c: 'consent.data_share(lender, 24 months)', r: S.shared ? 'granted, revocable' : 'not granted', ms: '', det: true, pending: !S.shared }, { c: 'partner.offer', r: S.shared ? '$60,000 line' : '', ms: '', det: true, pending: !S.shared }],
    hitl: [['Erin', 'decides whether to share data and whether to take any offer.']],
    creditNote: 'Future bet: partner referral fees, not AI credits.',
    tags: [['v2', 'first slice: consented data share and partner offers'], ['v3', 'full working-capital program']],
    specs: 'Spec: 23 M-16, §4.11, §5.5 · 08 (Rootline never holds funds) · 09 (ledger)'
  };
};

/* fx09 */
WT.screens['fx09-esg'] = function (S) {
  var main = banner('M-09 ESG and sustainability reporting', 'v1', ['v2']) + '<div class="apphead"><span class="crumb">Reports › Maple Ridge HOA</span><h3>Sustainability snapshot · 2027 season</h3></div><div class="wt-kpis"><div class="wt-kpi"><div class="l">Fuel</div><div class="v">412 gal</div><div class="d">fuel cards, this account</div></div><div class="wt-kpi"><div class="l">Est. CO2e</div><div class="v">3.7 t</div><div class="d">fuel × emission factors (verify)</div></div><div class="wt-kpi"><div class="l">Battery equipment</div><div class="v">38%</div><div class="d">of handheld hours</div></div><div class="wt-kpi"><div class="l">Water</div><div class="v">−18%</div><div class="d">vs last season</div></div><div class="wt-kpi"><div class="l">Native plants</div><div class="v">46%</div><div class="d">of new plantings (KB)</div></div></div>' +
    '<div class="panel mt10 tiny">Every number links to its source records. Estimates are labeled as estimates; the board gets a PDF in the portal with the method on the last page.</div>';
  return browser('app.rootline.com/reports/maple-ridge/sustainability', fxShell('Reports', main), 'Sustainability report (concept)');
};
WT.bts['fx09-esg'] = function (S) {
  return {
    what: 'Commercial clients and HOA boards increasingly ask for sustainability numbers. Rootline already has fuel from fuel cards, equipment hours, irrigation use and plant origins from the KB, so a snapshot is a report, not a project. Methods and estimates are disclosed with each number.',
    agents: [['Sustainability snapshot', 'Fuel, equipment, water and plant data to a report', 1]],
    trace: [{ c: 'fuel.sum(Maple Ridge, season)', r: '412 gal', ms: '—', det: true }, { c: 'emissions.estimate(factors)', r: '3.7 t CO2e (estimate)', ms: '', det: true }, { c: 'kb.native_share(new plantings)', r: '46%', ms: '', det: true }],
    hitl: [['Erin', 'reviews before sharing with the board.']],
    creditNote: 'Future bet: a commercial add-on, not AI credits.',
    tags: [['v1', 'first slice: Sustainability Snapshot'], ['v2', 'full ESG reporting']],
    specs: 'Spec: 23 M-09 · 13 (fuel cards) · 14 (irrigation) · 12 (native status) — verify emission factors'
  };
};

/* fx10 */
WT.screens['fx10-autopilot'] = function (S) {
  var rows = [['Invoicing', 'L3: acts, reports daily', '186 invoices sent', 'T2'], ['Collections', S.raise ? 'L3 under $500 · L2 above' : 'L2: suggests, I approve', S.raise ? '31 reminders sent, 4 waited' : '35 reminders approved by Tasha', 'T2'], ['Scheduling', 'L2: suggests, I approve', '6 rain-day moves approved', 'T2'], ['Purchasing', 'L1: drafts only', '4 PO drafts', 'T3'], ['Refunds and write-offs', 'Never automatic', '—', 'T4']];
  var main = banner('M-23 Autopilot: the self-driving back office', 'v1', ['v2', 'v3']) + '<div class="apphead"><span class="crumb">Autopilot</span><h3>Policies and this week\'s report</h3></div><div class="panel"><table class="data tight"><thead><tr><th>Domain</th><th>Autonomy</th><th>This week</th><th>Risk tier</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td class="tiny">' + r[2] + '</td><td>' + pill(r[3] === 'T4' ? 'danger' : r[3] === 'T3' ? 'warn' : '', r[3]) + '</td></tr>'; }).join('') + '</tbody></table></div>' +
    '<div class="wt-callout ai mt10">' + (S.raise ? ic('check') + ' Collections raised to L3 for balances under $500. You can lower it any time; every action is in the audit log.' : '<b>Earned autonomy:</b> you approved 35 of 35 collection reminders unchanged over 6 weeks. Let Autopilot send reminders under $500 on its own? <button type="button" class="btn xs primary" data-act="raise" data-k="raise">Raise to L3 under $500</button>') + '</div>';
  return browser('app.rootline.com/autopilot', fxShell('Autopilot', main), 'Autopilot policies (concept)');
};
WT.actions.raise = function (el, S) { S.raise = true; };
WT.ensure['fx10-autopilot'] = function (S) { S.raise = true; };
WT.bts['fx10-autopilot'] = function (S) {
  return {
    what: 'Autopilot runs the back office from policies the owner sets per domain, using the same autonomy levels (L0-L4) and risk tiers (T0-T4) as every agent. Autonomy is earned: a track record of approvals unchanged leads to a suggestion, never an automatic promotion. T4 actions such as refunds and write-offs are never automatic.',
    agents: [['Autopilot', 'Domain policies over the agent catalog', 0]],
    trace: [{ c: 'policy.evaluate(week)', r: '231 actions · 9 waited for approval · 0 T4', ms: '—', det: true }, { c: 'earned_autonomy(collections)', r: '35 of 35 unchanged', ms: '', det: true }, { c: 'policy.update(collections L3 < $500)', r: S.raise ? 'updated by Erin' : 'suggested', ms: '', det: true, pending: !S.raise, human: !S.raise }],
    hitl: [['Erin', 'sets and changes every policy.']],
    levels: ['L0-L4 autonomy', 'T0-T4 risk tiers', 'T4 never automatic'],
    creditNote: 'Future bet: an Autopilot tier; agent runs are quoted in credits as today.',
    tags: [['v1', 'first slice: domain policies over existing agents'], ['v2', 'earned autonomy suggestions'], ['v3', 'self-driving back office']],
    specs: 'Spec: 23 M-23 · 17 (autonomy levels and risk tiers, Approval Inbox)'
  };
};

/* fx11 */
WT.screens['fx11-voice'] = function (S) {
  var lines = [['me', 'Oye Rootline, registra 3 yardas de mantillo en el trabajo Delgado.'], ['ai', 'Registré: 3 yardas de mantillo en el trabajo Delgado. ¿Correcto?'], ['me', 'Sí.'], ['ai', 'Listo. Quedan 1 yarda reservada para Delgado en el búnker B2.']];
  var shown = lines.slice(0, S.voice * 2);
  var body = '<p class="ptitle" style="font-size:1rem">Oye Rootline</p><div class="wt-thread">' + shown.map(function (l) { return '<div class="wt-bubble ' + (l[0] === 'me' ? 'me' : 'ai') + '">' + l[1] + '</div>'; }).join('') + '</div>' + (S.voice < 2 ? '<button type="button" class="mic-btn mt10" data-act="voice" data-k="voice" style="display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:10px;border-radius:999px;border:1.5px dashed var(--ai-solid);background:var(--ai-bg);color:var(--ai-text);font:inherit;font-weight:600;cursor:pointer">' + ic('mic') + (S.voice === 0 ? 'Mantenga para hablar' : 'Responder "Sí"') + '</button>' : '');
  return '<div>' + banner('M-20 Voice-first crew assistant', 'v1', ['v2']) + devRow(phone(body, { brand: 'Rootline Crew', sub: 'Javier Torres · Crew 2', logo: 'truck', label: 'Crew app: voice assistant', k: 'vo' }), ctxCard('Hands busy, gloves on', ['Every write is read back for confirmation before it saves.', 'Uses the same permissions and risk tiers as tapping the screen.', 'Spanish and English; works with the noise of a mower nearby.'])) + '</div>';
};
WT.actions.voice = function (el, S) { S.voice = Math.min(2, S.voice + 1); };
WT.ensure['fx11-voice'] = function (S) { S.voice = 2; };
WT.bts['fx11-voice'] = function (S) {
  return {
    what: 'Crews often can\'t use a touchscreen. The voice assistant turns speech into the same actions the app offers, in Spanish or English, with a read-back before anything is written and the same risk-tiered confirmations as the screen. Voice notes already ship earlier in the crew app; this bet makes voice a full interface.',
    agents: [['Voice assistant', 'Speech to Action Layer calls with read-back', 0]],
    trace: [{ c: 'asr(es) → intent(log_material)', r: S.voice >= 1 ? '3 yd³ mulch · J-2417' : 'waiting', ms: S.voice >= 1 ? '900 ms' : '', pending: S.voice < 1 }, { c: 'readback.confirm', r: S.voice >= 2 ? '"Sí"' : '', ms: '', det: true, pending: S.voice < 2 }, { c: 'inventory.issue(B2 → J-2417, 3 yd³)', r: S.voice >= 2 ? 'posted' : '', ms: '', det: true, pending: S.voice < 2 }],
    hitl: [['Javier', 'confirms every write.']],
    creditNote: 'Voice is metered per minute on the published rate card (1 credit a minute today).',
    tags: [['v1', 'first slice: voice commands for common actions'], ['v2', 'voice-first assistant']],
    specs: 'Spec: 23 M-20 · 17 (Action Layer, read-back) · 05 (voice notes) · 13 (inventory issue)'
  };
};

/* fx12 */
WT.screens['fx12-mcp'] = function (S) {
  var main = banner('M-24 App marketplace and MCP ecosystem', 'v1', ['v2']) + '<div class="apphead"><span class="crumb">Settings › Connected AI</span><h3>Erin\'s own AI assistant</h3></div><div class="wt-cols"><div class="panel"><h4>Connection</h4><dl class="kv"><dt>Client</dt><dd>Erin\'s AI assistant (her own subscription)</dd><dt>Server</dt><dd>Rootline MCP server</dd><dt>Scopes</dt><dd>read: clients, invoices, reports · write: none</dd><dt>Acts as</dt><dd>Erin (owner), with the same permissions and audit</dd></dl></div>' +
    '<div class="panel"><h4>In her assistant</h4><div class="wt-thread"><div class="wt-bubble me">What did we invoice Maple Ridge this year, and is anything overdue?</div>' + (S.mcp ? '<div class="wt-bubble ai">Tool: rootline.invoices.search(client: Maple Ridge HOA, 2027) → 9 invoices, $64,800 invoiced, $57,600 paid, 1 open for $7,200 due in 6 days, nothing overdue.</div>' : '<button type="button" class="btn sm" data-act="mcp" data-k="mcp">Run</button>') + '</div></div></div>';
  return browser('app.rootline.com/settings/connected-ai', fxShell('Settings', main), 'MCP server (concept)');
};
WT.actions.mcp = function (el, S) { S.mcp = true; };
WT.ensure['fx12-mcp'] = function (S) { S.mcp = true; };
WT.bts['fx12-mcp'] = function (S) {
  return {
    what: 'Owners already use their own AI assistants. A Rootline MCP server exposes the same Action Layer the app uses, with scoped, revocable permissions, so an outside assistant can answer questions or (if allowed) take actions as that user, under the same risk tiers and audit log. An app marketplace follows on the same API.',
    agents: [['MCP server', 'Scoped tools over the Action Layer', 1]],
    trace: [{ c: 'oauth.grant(Erin, read scopes)', r: 'granted, revocable', ms: '—', det: true }, { c: 'mcp.tool(invoices.search)', r: S.mcp ? '9 invoices' : 'waiting', ms: S.mcp ? '240 ms' : '', det: true, pending: !S.mcp }, { c: 'audit.log(connected AI)', r: S.mcp ? '1 read' : '', ms: '', det: true, pending: !S.mcp }],
    hitl: [['Erin', 'chooses scopes and can revoke them.']],
    creditNote: 'Future bet: tool calls through MCP use no Rootline AI credits; the outside assistant is Erin\'s own.',
    tags: [['v1', 'first slice: MCP server with read and scoped write tools'], ['v2', 'app marketplace']],
    specs: 'Spec: 23 M-24 · 20 (public API, Action Layer parity) · 17 (risk tiers)'
  };
};

/* fx13 */
WT.screens['fx13-recap'] = function (S) {
  var rows = [['M-01 Digital twin', 'V1', 'V2/V3'], ['M-12 Landscape Passport', 'V1', 'V2/V3'], ['M-03 AR for homeowners', 'V2', 'V2'], ['M-05 Robotic mower fleets', 'V2', 'V3'], ['M-07 Closed-loop irrigation', 'V1', 'V3'], ['M-08 Plant health AI', 'V1', 'V2'], ['M-22 Predictive pricing', 'V1', 'V2'], ['M-16 Spring Ramp working capital', 'V2', 'V3'], ['M-09 Sustainability reporting', 'V1', 'V2'], ['M-23 Autopilot', 'V1', 'V2/V3'], ['M-20 Voice assistant', 'V1', 'V2'], ['M-24 MCP and app marketplace', 'V1', 'V2']];
  return '<div class="panel"><table class="data tight"><thead><tr><th>Bet</th><th>First slice</th><th>Full bet</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>'; }).join('') + '</tbody></table><p class="tiny muted mt10">12 of the 33 bets in doc 23. Each moves through Explore, Prototype, Pilot, Beta and GA on evidence, with a kill criterion, approved in the platform owner\'s innovation review.</p></div>' +
    '<div class="flex mt14"><a class="btn" href="#overview">' + ic('arrow-l') + 'Back to start</a><a class="btn" href="index.html">The vision</a><a class="btn primary" href="walkthroughs.html">All walkthroughs ' + ic('arrow-r') + '</a></div>';
};
WT.bts['fx13-recap'] = function (S) {
  return {
    what: 'Rails before bets: cheap foundations in MVP and V1 (stable object IDs, plant instances, rich photo metadata, a consent ledger, Action Layer parity, a Region on every property) keep these bets possible. Each bet then has to earn its way forward on evidence.',
    hitl: [['You (platform owner)', 'approve every stage-gate promotion and every kill.']],
    tags: [['v1', 'first slices of several bets'], ['v2', 'most headline bets'], ['v3', 'twin, robots, closed loop, capital, Autopilot at full scope']],
    specs: 'Spec: 23 (whole document) · 24 (scope authority)'
  };
};
