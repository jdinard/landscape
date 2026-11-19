/* Walkthrough: small and recurring jobs (weekly mowing from quote to paid visit).
   Numbers follow doc 03 EST-12 (9,000 sq ft turf, $73 a visit, 30 planned visits, $2,190 a season,
   8 installments of $273.75) and EST-11 (Quick Quote; mulch top-dress worked example $580). */

var SEASON = [['Apr', 4], ['May', 5], ['Jun', 4], ['Jul', 2], ['Aug', 2], ['Sep', 4], ['Oct', 5], ['Nov', 4]];
var TAX = 0.08; // Ohio taxes lawn-care services; Franklin County combined rate 8.0% (verify)

function visitPrice(turf, freq) { var base = Math.round(41 + turf * 0.00357); return freq === 'biweekly' ? base + 11 : base; }
function turfNow(S) { return S.exclude ? 8320 : 8960; }
function seasonVisits(freq) { return freq === 'biweekly' ? 16 : 30; }

var WT = {
  title: 'Rootline walkthrough: small and recurring jobs',
  short: 'Small and recurring jobs',
  ovTitle: 'Small and recurring jobs, from quote to paid visit',
  startLeft: 4212,
  acts: [
    { n: 'Act 1', t: 'Win the job', sub: 'Online, by phone or in the driveway' },
    { n: 'Act 2', t: 'Schedule it', sub: 'Agreement, route and a rain day' },
    { n: 'Act 3', t: 'Do the work', sub: 'The visit and a Spot-it upsell' },
    { n: 'Act 4', t: 'Get paid and keep the client', sub: 'Autopay, renewal, profitability' }
  ],
  steps: [
    { id: 'r01-quote', act: 0, short: 'Instant quote', title: 'An instant mowing quote on Greenleaf\'s website', who: 'The Brennans', tags: ['v1'] },
    { id: 'r02-book', act: 0, short: 'Book and sign', title: 'Pick a route day, sign and save a card', who: 'The Brennans', tags: ['v1'] },
    { id: 'r03-call', act: 0, short: 'Missed call', title: 'A missed call gets an answer in minutes', who: 'Kevin Mills, Tasha', ai: true, tags: ['mvp', 'v1'] },
    { id: 'r04-quick-quote', act: 0, short: 'Quick Quote', title: 'Quick Quote in the driveway, sent in under 2 minutes', who: 'Sam, the Patels', tags: ['mvp'] },
    { id: 'r05-agreement', act: 1, short: 'Agreement', title: 'The service agreement and its season of visits', who: 'Tasha', tags: ['mvp'] },
    { id: 'r06-route', act: 1, short: 'Route day', title: 'Insert the new client into Crew 2\'s Tuesday route', who: 'Luis', tags: ['mvp'] },
    { id: 'r07-rain', act: 1, short: 'Rain day', title: 'A rain day, replanned by the scheduling agent', who: 'Scheduling agent, Luis', ai: true, tags: ['v1'] },
    { id: 'r08-visit', act: 2, short: 'The visit', title: 'Crew 2 mows the Brennans\' lawn', who: 'Marco, the Brennans', tags: ['mvp'] },
    { id: 'r09-spot-it', act: 2, short: 'Spot it', title: 'A Spanish voice note becomes an aeration sale', who: 'Javier, Tasha', ai: true, tags: ['mvp'] },
    { id: 'r10-pay', act: 3, short: 'Invoice and autopay', title: 'Invoice, autopay and a declined card', who: 'Tasha, collections agent', ai: true, tags: ['mvp'] },
    { id: 'r11-renewal', act: 3, short: 'Renewal', title: 'Next season\'s renewal, drafted by the renewal agent', who: 'Renewal agent, Erin', ai: true, tags: ['v1'] },
    { id: 'r12-owner', act: 3, short: 'Owner view', title: 'How the maintenance business is doing', who: 'Erin', tags: ['mvp'] },
    { id: 'r13-recap', act: 3, short: 'Recap', title: 'Recap: what ran, who approved, what it cost', who: 'Everyone', tags: [] }
  ],
  credits: { 'r03-call': 6, 'r07-rain': 12, 'r09-spot-it': 3, 'r10-pay': 1, 'r11-renewal': 2 },
  state: {
    found: false, exclude: false, freq: 'weekly', fert: true, cleanup: false,
    startWk: 'Apr 6', day: 'Tue', signed: '', card: false, sms: false, booked: false,
    callApproved: false, callBooked: false,
    qqTpl: 'mowing', qqGate: 'single', qqSlope: 'flat', qqObs: 'few', qqTier: 'better', qqSent: false, qqSigned: false,
    billing: 'visit', published: false, rain: '', visitDone: false,
    voice: false, upsellSent: false, accepted: false,
    payPath: 'ok', reminder: false, paidLink: false, renewal: '', ownerQ: false
  },
  ov: {
    eyebrow: 'Clickable walkthrough · small and recurring jobs',
    h: 'Most landscape work is small and repeats. This is how Rootline runs it.',
    lede: 'Weekly grass cutting, mulch, cleanups and aeration are the bread and butter of a landscape company. Follow the Brennans from an instant quote on Greenleaf\'s website to a season of visits on Crew 2\'s Tuesday route, a rain day, a mowing visit, a Spanish voice note that turns into an aeration sale, autopay, a renewal and the owner\'s view of route profitability. A phone call and a driveway Quick Quote show the other ways in. Agents draft; people approve.',
    cast: [
      { h: 'Clients', icon: 'home', items: [['Rachel and Tom Brennan', 'new weekly mowing client, 612 Evening St, Worthington'], ['Anika and Raj Patel', 'Quick Quote in their driveway, Upper Arlington'], ['Kevin Mills', 'calls after hours about mowing']] },
      { h: 'Greenleaf Grounds Co.', icon: 'leaf', items: [['Sam Kowalski', 'estimator'], ['Tasha Greene', 'office manager'], ['Luis Ortega', 'operations manager'], ['Erin Castillo', 'owner']] },
      { h: 'Crew 2', icon: 'truck', items: [['Marco Ruiz', 'crew lead'], ['Maria López', 'technician'], ['Javier Torres', 'technician, Spanish-first']] },
      { h: 'Agents', icon: 'spark', items: [['Lead Follow-up (A3)', 'answers new leads in minutes'], ['Scheduling (A7)', 'replans rain days'], ['Field-Note (A4)', 'turns voice notes into upsells'], ['Collections (A5) and Renewal (A13)', 'chase payments, draft renewals']] }
    ],
    extra: '<p class="wt-note mt14">Prices are illustrative and follow the worked examples in doc 03. Ohio sales tax on lawn care is shown at the Franklin County rate of 8.0% (verify).</p>'
  },
  screens: {},
  bts: {},
  actions: {},
  inputs: {}
};

/* ---------- small SVGs ---------- */
function aerialSVG(S) {
  return '<svg class="wt-svg" viewBox="0 0 300 190" role="img" aria-label="Aerial view of 612 Evening St with the measured lawn outlined">' +
    '<rect class="aer-bg" x="0" y="0" width="300" height="190"/>' +
    '<rect x="0" y="168" width="300" height="22" fill="var(--stone-300)"/><text x="8" y="183" class="map-label">Evening St</text>' +
    '<polygon class="lawn-poly" points="22,108 278,108 278,162 22,162"/>' +
    '<polygon class="lawn-poly" points="22,14 160,14 160,62 22,62"/>' +
    '<polygon class="lawn-poly' + (S.exclude ? ' off' : '') + '" points="232,14 278,14 278,96 232,96"/>' +
    '<rect class="aer-house" x="64" y="62" width="104" height="44" rx="2"/><rect class="aer-house" x="182" y="40" width="44" height="40" rx="2"/>' +
    '<rect class="aer-drive" x="186" y="80" width="36" height="88"/>' +
    '<circle class="aer-tree" cx="48" cy="132" r="15"/><circle class="aer-tree" cx="120" cy="30" r="12"/>' +
    '<text x="140" y="140" class="map-label">Front 4,820 sq ft</text><text x="40" y="44" class="map-label">Back 3,500</text>' +
    '<text x="236" y="58" class="map-label">' + (S.exclude ? 'excluded' : '640') + '</text>' +
    '</svg>';
}
var STOPS = [[30, 150], [52, 128], [70, 140], [92, 118], [116, 132], [138, 112], [160, 124], [214, 92], [236, 110], [258, 88], [270, 62], [248, 44], [222, 56], [196, 38], [170, 50], [146, 34], [120, 46], [96, 30]];
var NEWSTOP = [186, 104];
function routeSVG(opt) {
  opt = opt || {};
  var pts = STOPS.slice(); var inserted = opt.inserted ? pts.slice(0, 7).concat([NEWSTOP], pts.slice(7)) : pts;
  var path = [[14, 168]].concat(inserted).map(function (p) { return p.join(','); }).join(' ');
  var streets = '<line class="map-street" x1="0" y1="160" x2="300" y2="160"/><line class="map-street" x1="0" y1="100" x2="300" y2="100"/><line class="map-street" x1="0" y1="40" x2="300" y2="40"/><line class="map-street" x1="60" y1="0" x2="60" y2="190"/><line class="map-street" x1="180" y1="0" x2="180" y2="190"/>';
  var dots = inserted.map(function (p, i) {
    var isNew = opt.inserted && p === NEWSTOP; var moved = opt.moved && i >= inserted.length - 7;
    return '<circle class="map-st' + (isNew ? ' new' : '') + (moved ? ' moved' : '') + '" cx="' + p[0] + '" cy="' + p[1] + '" r="6.5"/><text class="map-num" x="' + p[0] + '" y="' + (p[1] + 3) + '">' + (i + 1) + '</text>';
  }).join('');
  return '<svg class="wt-svg" viewBox="0 0 300 190" role="img" aria-label="Map of Crew 2\'s Tuesday route' + (opt.inserted ? ' with the Brennans inserted as stop 8' : '') + '">' + streets +
    (opt.inserted ? '<polyline class="map-route old" points="' + [[14, 168]].concat(pts).map(function (p) { return p.join(','); }).join(' ') + '"/>' : '') +
    '<polyline class="map-route" points="' + path + '"/><rect class="map-yard" x="6" y="160" width="16" height="16" rx="3"/><text x="26" y="184" class="map-label">Greenleaf yard</text>' + dots + '</svg>';
}
function lawnPhoto(after, label) {
  var stripe = after ? '<g opacity=".55">' + [0, 1, 2, 3, 4, 5, 6].map(function (i) { return '<rect x="' + (i * 22) + '" y="60" width="11" height="60" fill="var(--turf-dark)"/>'; }).join('') + '</g>' : '<g fill="var(--turf-dark)" opacity=".8"><path d="M8 82l3-9 3 9M30 96l3-11 3 11M52 78l3-8 3 8M78 102l3-10 3 10M104 88l3-9 3 9M126 98l3-10 3 10"/></g><circle cx="40" cy="72" r="4" fill="var(--marigold-400)"/><circle cx="96" cy="108" r="3" fill="var(--marigold-400)"/>';
  return '<svg viewBox="0 0 150 120" role="img" aria-label="' + esc(label) + '"><rect width="150" height="60" fill="var(--sky-100)"/><rect x="18" y="22" width="70" height="38" fill="var(--stone-300)"/><polygon points="14,24 53,6 92,24" fill="var(--stone-600)"/><rect x="0" y="60" width="150" height="60" fill="var(--turf)"/>' + stripe + (after ? '<line x1="0" y1="61" x2="150" y2="61" stroke="var(--paver)" stroke-width="3"/>' : '') + '</svg>';
}

/* ---------- r01 instant quote ---------- */
WT.screens['r01-quote'] = function (S) {
  var turf = turfNow(S), p = visitPrice(turf, S.freq), n = seasonVisits(S.freq);
  var addons = (S.fert ? 320 : 0) + (S.cleanup ? 240 : 0);
  var body = '<p class="ptitle">Get my mowing price</p><p class="psub">Measured from aerial imagery. No site visit needed for most lawns.</p>' +
    '<label class="fld">Your address<span class="inrow"><input class="inp" value="612 Evening St, Worthington, OH 43085" readonly aria-label="Address"><button type="button" class="btn sm primary" data-act="find" data-k="find">' + (S.found ? 'Found' : 'Find my lawn') + '</button></span></label>';
  if (S.found) {
    body += aerialSVG(S) + '<div class="pcard"><div class="flex"><b>Lawn: ' + num(turf) + ' sq ft</b>' + pill('ok', 'Measured · 91% confidence') + '</div><div class="wt-note">Imagery captured last May. Is this your lawn?</div>' +
      '<label class="check mt6"><input type="checkbox" data-in="exclude" data-k="exclude"' + (S.exclude ? ' checked' : '') + '><span>Leave out the strip behind the garage (we mow it ourselves)</span></label></div>' +
      '<div class="fld">How often<div class="seg" role="group" aria-label="Frequency"><button type="button" data-act="freq" data-v="weekly" data-k="fw" aria-pressed="' + (S.freq === 'weekly') + '">Weekly · ' + money(visitPrice(turf, 'weekly')) + '</button><button type="button" data-act="freq" data-v="biweekly" data-k="fb" aria-pressed="' + (S.freq === 'biweekly') + '">Every other week · ' + money(visitPrice(turf, 'biweekly')) + '</button></div></div>' +
      '<div class="pcard soft"><h4>Add to your season</h4><label class="check"><input type="checkbox" data-in="fert" data-k="fert"' + (S.fert ? ' checked' : '') + '><span><b>5-step fertilization and weed control</b> · 5 rounds, $64 each</span></label><label class="check mt6"><input type="checkbox" data-in="cleanup" data-k="cleanup"' + (S.cleanup ? ' checked' : '') + '><span><b>Spring cleanup</b> · beds, leaves, first edge · $240</span></label></div>' +
      '<div class="pcard"><dl class="kv"><dt>Per visit</dt><dd class="num">' + money(p) + ' + tax</dd><dt>Planned visits</dt><dd>' + n + ' (Apr to Nov)</dd><dt>Season</dt><dd class="num">' + money(p * n + addons) + ' + tax</dd></dl></div>' +
      '<a class="btn primary" href="#r02-book" style="justify-content:center">Choose a start date ' + ic('arrow-r') + '</a>';
  }
  return devRow(phone(body, { sub: 'Get my price', foot: 'greenleafgrounds.com/price', label: 'Homeowner phone: instant quote' }),
    ctxCard('What the homeowner sees', ['The address is matched to the parcel and the lawn is measured from aerial imagery; the outline is shown so the homeowner can correct it.', 'A firm price appears only when the measurement is confident enough; otherwise the page offers a price range or a site visit.', 'The price comes from the same visit model the estimator uses: mowing, trimming, blowing, setup and drive time, at Greenleaf\'s target margin.']));
};
WT.actions.find = function (el, S) { S.found = true; };
WT.inputs.exclude = function (el, S) { S.exclude = el.checked; };
WT.inputs.fert = function (el, S) { S.fert = el.checked; };
WT.inputs.cleanup = function (el, S) { S.cleanup = el.checked; };
WT.actions.freq = function (el, S) { S.freq = el.getAttribute('data-v'); };
WT.ensure = { 'r01-quote': function (S) { S.found = true; } };
WT.bts['r01-quote'] = function (S) {
  return {
    what: 'The homeowner enters an address. Rootline matches the parcel, measures the turf from aerial imagery with a confidence score, and prices the visit from Greenleaf\'s own mowing visit model. Leaving out the garage strip re-prices instantly. Online booking and public instant quotes are [V1]; the turf measurement itself is [MVP] and is what Quick Quote uses today.',
    agents: [['Aerial measurement', 'Segmentation of turf, beds, hardscape and canopy on the parcel', 1], ['Pricing engine', 'Visit model and the tenant\'s target margin', 1]],
    trace: [{ c: 'property.geocode("612 Evening St")', r: 'parcel 610-2283-00, 0.31 acres', ms: '90 ms', det: true }, { c: 'property.measure_turf(parcel)', r: '8,960 sq ft, confidence 0.91, imagery last May', ms: '1.4 s', det: true }, { c: 'price.visit_model(turf, weekly)', r: '$73 per visit at 15% net target', ms: '20 ms', det: true }],
    hitl: [['The homeowner', 'confirms or corrects the outline; area changes over 25% fall back to a range and a photo request.']],
    creditNote: 'Aerial measurement counts against the plan\'s parcel lookups, not AI credits.',
    tags: [['v1', 'online booking and public instant quotes'], ['mvp', 'aerial turf measurement and the visit model']],
    specs: 'Spec: 16 §4.3 and §5.1 · 03 EST-12, INTEL-03 · 22 §4.4 (parcel lookups)'
  };
};

/* ---------- r02 book ---------- */
WT.screens['r02-book'] = function (S) {
  var turf = turfNow(S), p = visitPrice(turf, S.freq), n = seasonVisits(S.freq), addons = (S.fert ? 320 : 0) + (S.cleanup ? 240 : 0);
  var body;
  if (!S.booked) {
    body = '<p class="ptitle">Pick your day</p><div class="pcard"><h4>Route days near you</h4>' +
      '<div class="wt-list"><button type="button" class="wt-row' + (S.day === 'Tue' ? ' sel' : '') + '" data-act="day" data-v="Tue" data-k="dTue"><span class="wt-ic ok">' + ic('truck') + '</span><span><b>Tuesdays</b><span class="sub">Your street is on Crew 2\'s Tuesday route · 3 openings</span></span>' + pill('ok', 'Best fit') + '</button>' +
      '<button type="button" class="wt-row' + (S.day === 'Thu' ? ' sel' : '') + '" data-act="day" data-v="Thu" data-k="dThu"><span class="wt-ic">' + ic('calendar') + '</span><span><b>Thursdays</b><span class="sub">Full for the season · join the waitlist</span></span>' + pill('', 'Waitlist') + '</button></div></div>' +
      '<div class="fld">First visit, week of<div class="chips">' + ['Mar 30', 'Apr 6', 'Apr 13'].map(function (w) { return '<button type="button" class="chip" data-act="wk" data-v="' + w + '" data-k="w' + w.replace(' ', '') + '" aria-pressed="' + (S.startWk === w) + '">' + w + '</button>'; }).join('') + '</div></div>' +
      '<div class="pcard soft"><h4>Your service agreement</h4><dl class="kv"><dt>Service</dt><dd>' + (S.freq === 'weekly' ? 'Weekly' : 'Every other week') + ' mowing, trim, edge, blow</dd><dt>Price</dt><dd class="num">' + money(p) + ' per visit + tax</dd><dt>Season</dt><dd>' + n + ' planned visits, ' + money(p * n + addons) + '</dd><dt>Weather</dt><dd>Up to 3 weather skips without credit</dd><dt>Cancel</dt><dd>Any time with 14 days\' notice</dd></dl></div>' +
      '<label class="fld">Type your name to sign<input class="inp" data-in="sign" data-live data-k="sign" value="' + esc(S.signed) + '" placeholder="Rachel Brennan"></label>' +
      '<div class="pcard"><h4>' + ic('card') + ' Card for autopay</h4>' + (S.card ? '<div class="okline">' + ic('check') + 'Visa ending 4242 saved</div>' : '<button type="button" class="btn sm" data-act="card" data-k="card">Add card</button>') + '<div class="wt-note mt6">Payments go to Greenleaf Grounds Co.\'s own Stripe account. Charged after each month\'s visits.</div></div>' +
      '<label class="check"><input type="checkbox" data-in="sms" data-k="sms"' + (S.sms ? ' checked' : '') + '><span>Text me day-ahead reminders and "on the way" notices (optional)</span></label>' +
      '<button type="button" class="btn primary" data-act="book" data-k="book"' + (S.signed.length > 2 && S.card ? '' : ' disabled') + ' style="justify-content:center">Sign and book</button>';
  } else {
    body = '<div class="toast">' + ic('check') + 'You\'re booked. Welcome to Greenleaf!</div><div class="pcard"><dl class="kv"><dt>First visit</dt><dd>Tuesday, week of ' + esc(S.startWk) + '</dd><dt>Crew</dt><dd>Crew 2 · Marco, Maria, Javier</dd><dt>Autopay</dt><dd>Visa ending 4242</dd><dt>Portal</dt><dd>Invite sent to rachel.b@example.com</dd></dl></div><p class="psub">Signed by ' + esc(S.signed || 'Rachel Brennan') + '. A copy of the agreement is in your portal.</p>';
  }
  var right = ctxCard('Created in Greenleaf\'s account', S.booked ? ['Client: Rachel and Tom Brennan, with a Property at 612 Evening St', 'Service Agreement SA-1042: ' + (S.freq === 'weekly' ? 'weekly' : 'every other week') + ' mowing, ' + n + ' planned visits' + (S.fert ? ', 5-step fertilization program' : ''), 'Visits generated for the season on Crew 2\'s Tuesday route', 'Saved card on Greenleaf\'s Stripe account; SMS consent ' + (S.sms ? 'recorded' : 'not given (email only)')] : ['Route days come from capacity: only days with room on a nearby route are offered.', 'The one-page agreement is e-signed (ESIGN/UETA) and stored on the Client.', 'SMS consent is a separate, unticked box, as TCPA requires.']);
  return devRow(phone(body, { sub: 'Book online', foot: 'greenleafgrounds.com/book', label: 'Homeowner phone: booking' }), right);
};
WT.actions.day = function (el, S) { S.day = el.getAttribute('data-v'); };
WT.actions.wk = function (el, S) { S.startWk = el.getAttribute('data-v'); };
WT.inputs.sign = function (el, S) { S.signed = el.value; };
WT.actions.card = function (el, S) { S.card = true; };
WT.inputs.sms = function (el, S) { S.sms = el.checked; };
WT.actions.book = function (el, S) { S.booked = true; };
WT.ensure['r02-book'] = function (S) { S.booked = true; S.signed = S.signed || 'Rachel Brennan'; S.card = true; S.sms = true; };
WT.bts['r02-book'] = function (S) {
  return {
    what: 'Capacity decides which days are offered: Rootline checks which crews already work near this street and how much time each route day has left. Signing creates the Client, Property, Service Agreement and the season\'s Visits in one step, and the card is saved with a Stripe SetupIntent on Greenleaf\'s own account.',
    agents: [['Booking automation', 'Deterministic workflow, no AI', 1]],
    trace: [{ c: 'capacity.route_days(near property)', r: 'Tue Crew 2: 3 openings · Thu: full', ms: '60 ms', det: true }, { c: 'agreement.create(SA-1042)', r: S.freq + ' mowing, ' + seasonVisits(S.freq) + ' visits', ms: '40 ms', det: true }, { c: 'visits.generate(SA-1042)', r: seasonVisits(S.freq) + ' visits, Apr to Nov', ms: '35 ms', det: true }, { c: 'stripe.setup_intent(connected account)', r: 'card saved for off-session charges', ms: '700 ms', det: true }, { c: 'portal.invite(Brennans)', r: 'welcome journey started', ms: '25 ms', det: true }],
    hitl: [['The homeowner', 'signs and saves the card; the crew lead confirms conditions on the first visit.']],
    tags: [['v1', 'self-serve booking from the website'], ['mvp', 'agreements, visit generation and card on file']],
    specs: 'Spec: 16 §5.1 · 04 §4.2 · 07 §4.3 · 08 (SetupIntents, mandates) · 02 (TCPA consent)'
  };
};

/* ---------- r03 missed call ---------- */
WT.screens['r03-call'] = function (S) {
  var sms = '<div class="wt-sms"><div class="tiny faint" style="text-align:center">Tue 7:42 PM · Missed call to Greenleaf</div>' +
    '<div class="wt-bubble them">Sorry we missed your call! This is Greenleaf Grounds Co. Get a mowing price in a minute: greenleafgrounds.com/price, or reply here and we\'ll call you back tomorrow.<small>Sent automatically 7:42 PM</small></div>' +
    '<div class="wt-bubble me">Thanks. I left a voicemail, need weekly mowing in Clintonville, corner lot<small>7:46 PM</small></div>' +
    (S.callApproved ? '<div class="wt-bubble them">Hi Kevin, Tasha from Greenleaf. Corner lots are no problem. Your lawn measures about 7,200 sq ft, so weekly mowing would be around $66 a visit. Want Sam to stop by Wednesday at 4:30 or Thursday at 9:00 to confirm?<small>8:02 AM</small></div><div class="wt-bubble me">Thursday 9 works<small>8:05 AM</small></div>' + (S.callBooked ? '<div class="wt-bubble them">Booked: Sam Kowalski, Thursday 9:00 AM. See you then!<small>8:05 AM · sent automatically</small></div>' : '') : '') + '</div>';
  var office = appShell('Inbox', '<div class="apphead"><h3>Inbox</h3><span class="sp"></span>' + pill('info', '2 new') + '</div>' +
    '<div class="panel"><div class="ph">Voicemail · Kevin Mills · 0:48 ' + aiChip('Transcribed and summarized · 2 credits') + '</div><p class="tiny muted" style="font-style:italic">"Hi, my name\'s Kevin Mills, I\'m at 3310 Calumet Street in Clintonville. Corner lot. Looking for someone to mow weekly starting in April. Call me back at 614-555-0148."</p><div class="ai-box mt6"><div class="ai-h">' + ic('spark') + 'Summary</div><ul><li>New lead: weekly mowing, corner lot, 3310 Calumet St (Clintonville)</li><li>Turf measured from aerial: about 7,200 sq ft · estimated $66 a visit</li><li>Preferred contact: text</li></ul></div></div>' +
    '<div class="panel mt10"><div class="ph">Approval · Lead Follow-up agent (A3) <span class="pill info">L2 draft, you approve</span></div><div class="wt-bubble ai">Hi Kevin, Tasha from Greenleaf. Corner lots are no problem. Your lawn measures about 7,200 sq ft, so weekly mowing would be around $66 a visit. Want Sam to stop by Wednesday at 4:30 or Thursday at 9:00 to confirm?</div>' +
    '<div class="flex mt10">' + (S.callApproved ? '<span class="okline">' + ic('check') + 'Sent 8:02 AM</span>' + (S.callBooked ? pill('ok', 'Site visit booked Thu 9:00') : '<button type="button" class="btn sm" data-act="callBook" data-k="callBook">Simulate Kevin\'s reply</button>') : '<button type="button" class="btn sm primary" data-act="callApprove" data-k="callApprove">' + ic('check') + 'Approve and send</button><button type="button" class="btn sm">Edit</button><span class="cost">4 credits for the conversation</span>') + '</div></div>');
  return '<div class="wt-cols wide-left"><div>' + browser('app.rootline.com/t/greenleaf/inbox', office, 'Greenleaf office inbox') + '</div><div>' + phone(sms, { brand: 'Messages', sub: 'Greenleaf Grounds Co.', logo: 'chat', label: 'Kevin\'s phone: text thread' }) + '</div></div>' +
    '<div class="wt-callout mt14">At [V1] the AI receptionist answers the call itself, qualifies Kevin, books the site visit and texts a summary; at [MVP] the missed call gets an instant text back and a transcribed voicemail.</div>';
};
WT.actions.callApprove = function (el, S) { S.callApproved = true; };
WT.actions.callBook = function (el, S) { S.callBooked = true; };
WT.bts['r03-call'] = function (S) {
  return {
    what: 'A call nobody answers is still a lead. The missed call triggers an instant text with a price link (deterministic, free). The voicemail is transcribed and summarized, the lawn is measured from the address, and the Lead Follow-up agent drafts a reply with a price range and two open slots from Sam\'s calendar. Tasha approves before anything goes to Kevin.',
    agents: [['Call tracking', 'Missed-call text-back, deterministic', 1], ['Transcription and summary', 'Voicemail to text and a lead summary', 0], ['Lead Follow-up (A3)', 'Qualify, quote a range, offer site-visit slots', 0]],
    trace: [{ c: 'call.missed(+1 614-555-0148)', r: 'text-back sent in 4 s', ms: '4 s', det: true }, { c: 'voicemail.transcribe(0:48)', r: 'transcript + summary', ms: '6 s' }, { c: 'lead.create(Kevin Mills)', r: 'source: phone · tracking number "Website"', ms: '30 ms', det: true }, { c: 'property.measure_turf(3310 Calumet St)', r: '7,200 sq ft, confidence 0.88', ms: '1.2 s', det: true }, { c: 'calendar.free_slots(Sam, site visits)', r: 'Wed 4:30 PM, Thu 9:00 AM', ms: '40 ms', det: true }, { c: 'agent.A3.draft_reply', r: S.callApproved ? 'approved by Tasha, sent' : 'waiting for approval', ms: S.callApproved ? '2.1 s' : '', human: !S.callApproved }],
    hitl: [['Tasha', 'approves or edits the first message to a new lead. Replies after that stay in the same thread.']],
    levels: ['A3 at L2: drafts, a person approves', 'Risk tier T3: external message'],
    creditNote: 'Voicemail transcription and summary 2 credits; the follow-up conversation 4 credits (rate card: 3-6 per conversation).',
    tags: [['mvp', 'missed-call text-back, voicemail transcription, Lead Follow-up agent'], ['v1', 'AI receptionist that answers the call']],
    specs: 'Spec: 16 §4.18-4.19 · 17 §4.5.4 (A3) · 22 §4.4.1 · 03 (lead intake)'
  };
};

/* ---------- r04 quick quote ---------- */
var QQ = {
  mowing: { name: 'Weekly mowing', base: 63 },
  mulch: { name: 'Mulch top-dress' },
  cleanup: { name: 'Spring cleanup' },
  aeration: { name: 'Core aeration and overseeding' }
};
function qqVisit(S) { var p = 63; if (S.qqGate === 'single') p += 2; if (S.qqGate === 'double') p += 4; if (S.qqSlope === 'moderate') p = Math.round(p * 1.08); if (S.qqObs === 'many') p = Math.round(p * 1.06); return p; }
function qqTiers(S) { var v = qqVisit(S); return { good: { n: 'Mow only', season: v * 30, per: v }, better: { n: 'Mow + 5-step fertilization', season: v * 30 + 5 * 52, per: v }, best: { n: 'Full care', season: v * 30 + 5 * 52 + 210 + 260, per: v } }; }
WT.screens['r04-quick-quote'] = function (S) {
  var tpl = S.qqTpl, body = '<p class="ptitle">Quick Quote</p><p class="psub">1440 Haddon Rd · Anika and Raj Patel</p><div class="chips" role="group" aria-label="Template">' +
    Object.keys(QQ).map(function (k) { return '<button type="button" class="chip" data-act="qqTpl" data-v="' + k + '" data-k="qq' + k + '" aria-pressed="' + (tpl === k) + '">' + QQ[k].name + '</button>'; }).join('') + '</div>';
  if (tpl === 'mowing') {
    var T = qqTiers(S);
    body += '<div class="pcard"><dl class="kv"><dt>Turf</dt><dd>6,240 sq ft ' + pill('ok', 'Aerial AI · 0.88') + '</dd><dt>Trim</dt><dd>280 lf (derived)</dd><dt>Frequency</dt><dd>Weekly, 30 planned visits</dd></dl></div>' +
      '<div class="fld">Gate<div class="seg">' + ['none', 'single', 'double'].map(function (v) { return '<button type="button" data-act="qqGate" data-v="' + v + '" data-k="g' + v + '" aria-pressed="' + (S.qqGate === v) + '">' + v + '</button>'; }).join('') + '</div></div>' +
      '<div class="fld">Slope<div class="seg">' + ['flat', 'moderate'].map(function (v) { return '<button type="button" data-act="qqSlope" data-v="' + v + '" data-k="s' + v + '" aria-pressed="' + (S.qqSlope === v) + '">' + v + '</button>'; }).join('') + '</div></div>' +
      '<div class="fld">Obstacles<div class="seg">' + ['few', 'many'].map(function (v) { return '<button type="button" data-act="qqObs" data-v="' + v + '" data-k="o' + v + '" aria-pressed="' + (S.qqObs === v) + '">' + v + '</button>'; }).join('') + '</div></div>' +
      '<div class="wt-list">' + ['good', 'better', 'best'].map(function (k) { var t = T[k]; return '<button type="button" class="wt-row' + (S.qqTier === k ? ' sel' : '') + '" data-act="qqTier" data-v="' + k + '" data-k="t' + k + '"><span class="wt-ic' + (S.qqTier === k ? ' ok' : '') + '">' + ic(S.qqTier === k ? 'check' : 'leaf') + '</span><span><b>' + t.n + '</b><span class="sub">' + money(t.per) + ' a visit · season ' + money(t.season) + '</span></span>' + (k === 'better' ? pill('ok', 'On target') : pill('', 'On target')) + '</button>'; }).join('') + '</div>' +
      (S.qqSent ? '<div class="toast">' + ic('check') + 'Sent by text 1 min 40 s after opening' + '</div>' + (S.qqSigned ? '<div class="okline">' + ic('check') + 'Anika signed · Visa saved · ' + qqTiers(S)[S.qqTier].n + '</div>' : '<button type="button" class="btn sm" data-act="qqSign" data-k="qqSign">Simulate Anika signing</button>') : '<button type="button" class="btn primary" data-act="qqSend" data-k="qqSend" style="justify-content:center">' + ic('send') + 'Send by text</button>');
  } else if (tpl === 'mulch') {
    body += '<div class="pcard"><dl class="kv"><dt>Beds</dt><dd>690 sq ft ' + pill('ok', 'From last season') + '</dd><dt>Depth</dt><dd>2 in</dd><dt>Product</dt><dd>Double-shred hardwood (last year\'s)</dd><dt>Access</dt><dd>Drive-up</dd></dl></div><div class="pcard soft"><dl class="kv"><dt>Volume</dt><dd>4.26 yd³ installed · 4.5 yd³ bought</dd><dt>Price</dt><dd class="num"><b>$580</b> ' + pill('ok', 'On target') + '</dd></dl><div class="wt-note mt6">The estimator typed only the depth. Burden, overhead and an 18% net target are already in the price.</div></div>';
  } else if (tpl === 'cleanup') {
    body += '<div class="pcard"><dl class="kv"><dt>Beds</dt><dd>1,120 sq ft</dd><dt>Turf</dt><dd>6,240 sq ft</dd><dt>Trees</dt><dd>4</dd><dt>Debris</dt><dd>Medium</dd></dl></div><div class="pcard soft"><dl class="kv"><dt>Basic</dt><dd class="num">$210</dd><dt>Standard</dt><dd class="num">$285 (adds first mow)</dd><dt>Premium</dt><dd class="num">$365 (adds pre-emergent)</dd></dl></div>';
  } else {
    body += '<div class="pcard"><dl class="kv"><dt>Turf</dt><dd>6,240 sq ft</dd><dt>Seed</dt><dd>Tall fescue blend</dd><dt>Slope</dt><dd>Flat</dd></dl></div><div class="pcard soft"><dl class="kv"><dt>Aerate</dt><dd class="num">$165</dd><dt>+ overseed</dt><dd class="num">$260</dd><dt>+ starter fertilizer</dt><dd class="num">$305</dd></dl></div>';
  }
  return devRow(phone(body, { brand: 'Rootline', sub: 'Sam Kowalski · estimator', logo: 'leaf', label: 'Estimator phone: Quick Quote', right: '<span class="pill ok">Offline-ready</span>' }),
    ctxCard('Quick Quote in the driveway', ['One of six shipped templates; each binds a pricing model to at most 5 visible inputs.', 'Quantities prefill from the Property\'s measurement; low-confidence values must be confirmed on site before sending.', 'A typed override within ±10% needs a reason; bigger cuts become an approval request.', 'The same Quick Quote handles one-off jobs: switch templates above.']));
};
['qqTpl', 'qqGate', 'qqSlope', 'qqObs', 'qqTier'].forEach(function (k) { WT.actions[k] = function (el, S) { S[k] = el.getAttribute('data-v'); }; });
WT.actions.qqSend = function (el, S) { S.qqSent = true; };
WT.actions.qqSign = function (el, S) { S.qqSigned = true; };
WT.bts['r04-quick-quote'] = function (S) {
  var T = qqTiers(S);
  return {
    what: 'Most quotes are small and repetitive, so Quick Quote is the 2-minute front door to the same pricing engine as a $40,000 patio. Each tap maps to a difficulty multiplier; the tiers are generated from the same inputs, so a three-option proposal costs Sam no extra typing. It works offline and re-prices on sync before sending.',
    agents: [['Pricing engine', 'Visit model, kits and margin floor', 1]],
    trace: [{ c: 'property.measurement(1440 Haddon Rd)', r: '6,240 sq ft turf, confidence 0.88', ms: '15 ms', det: true }, { c: 'price.visit_model(gate=' + S.qqGate + ', slope=' + S.qqSlope + ', obstacles=' + S.qqObs + ')', r: money(qqVisit(S)) + ' a visit', ms: '8 ms', det: true }, { c: 'estimate.tiers(good, better, best)', r: money(T.good.season) + ' · ' + money(T.better.season) + ' · ' + money(T.best.season), ms: '12 ms', det: true }, { c: 'proposal.send(sms, compact)', r: S.qqSent ? 'delivered; e-sign + card on file' : 'not sent yet', ms: S.qqSent ? '300 ms' : '', det: true }],
    hitl: [['Sam', 'chooses the template and taps conditions; overrides beyond ±10% go to Erin for approval.'], ['The Patels', 'pick a tier, sign and save a card on their phone.']],
    tags: [['mvp', 'Quick Quote templates, condition taps, tiers, SMS proposal with e-sign']],
    specs: 'Spec: 03 EST-11, EST-12, PROP-05 · 03 §6.7 (wireframe)'
  };
};

/* ---------- r05 agreement ---------- */
WT.screens['r05-agreement'] = function (S) {
  var p = 73, months = SEASON, max = 5;
  var bars = '<div class="mo-bars" aria-label="Planned visits by month">' + months.map(function (m) { return '<div><span class="num">' + m[1] + '</span><i class="' + (m[1] <= 2 ? 'alt' : '') + '" style="height:' + (m[1] / max * 64) + 'px"></i>' + m[0] + '</div>'; }).join('') + '</div>';
  var sched = S.billing === 'visit' ? months.map(function (m) { return '<tr><td>' + m[0] + '</td><td class="num">' + m[1] + ' × $73.00</td><td class="num">' + money(m[1] * p, true) + '</td></tr>'; }).join('') : months.map(function (m) { return '<tr><td>' + m[0] + '</td><td class="num">Installment</td><td class="num">$273.75</td></tr>'; }).join('');
  var main = '<div class="apphead"><span class="crumb">Clients › Rachel and Tom Brennan › 612 Evening St</span><h3>Service Agreement SA-1042</h3>' + pill('ok', 'Active') + '<span class="sp"></span><button type="button" class="btn sm">Amend</button></div>' +
    '<div class="wt-cols"><div class="wt-stack"><div class="panel"><h4>Scope</h4><dl class="kv"><dt>Service</dt><dd>Mowing, trim, edge, blow · weekly</dd><dt>Price</dt><dd class="num">$73.00 per visit</dd><dt>Planned</dt><dd>30 visits · $2,190.00</dd><dt>Program</dt><dd>5-step fertilization · 5 × $64</dd><dt>Weather</dt><dd>Up to 3 weather skips without credit</dd><dt>Renewal</dt><dd>Auto-renews; 30-day notice with any price change</dd></dl></div>' +
    '<div class="panel"><h4>Season of visits</h4>' + bars + '<div class="wt-note mt6">Weekly in spring and fall, every other week in July and August when dry (blue).</div></div></div>' +
    '<div class="panel"><h4>Billing</h4><div class="seg" role="group" aria-label="Billing mode"><button type="button" data-act="billing" data-v="visit" data-k="bv" aria-pressed="' + (S.billing === 'visit') + '">Per visit, monthly</button><button type="button" data-act="billing" data-v="level" data-k="bl" aria-pressed="' + (S.billing === 'level') + '">Level monthly</button></div>' +
    '<table class="data tight mt10"><thead><tr><th>Month</th><th class="num">Basis</th><th class="num">Amount</th></tr></thead><tbody>' + sched + '<tr><td><b>Season</b></td><td></td><td class="num"><b>$2,190.00</b></td></tr></tbody></table>' +
    '<div class="wt-note mt6">' + (S.billing === 'visit' ? 'Billed for completed visits only; skipped visits are not billed.' : 'Eight equal installments. An earned-value meter compares visits done with installments billed, and the season ends with an automatic true-up.') + ' Fertilization rounds bill as they are applied. Tax added per Ohio rules (verify).</div></div></div>';
  return browser('app.rootline.com/t/greenleaf/clients/brennan/agreements/SA-1042', appShell('Clients', main), 'Greenleaf office: service agreement');
};
WT.actions.billing = function (el, S) { S.billing = el.getAttribute('data-v'); };
WT.bts['r05-agreement'] = function (S) {
  return {
    what: 'The agreement is the running account for the season: what was sold, the visits generated from it, and how it bills. Switching between per-visit and level billing changes the invoice schedule, not the price. Level billing defers revenue and recognizes it as visits are performed, with an automatic true-up at season end.',
    agents: [['Billing Engine', 'Billable items, schedules and runs', 1]],
    trace: [{ c: 'agreement.billing_mode = ' + S.billing, r: S.billing === 'visit' ? '8 monthly invoices from completed visits' : '8 × $273.75, earned-value meter on', ms: '10 ms', det: true }, { c: 'ledger.posting_rules(SA-1042)', r: S.billing === 'visit' ? 'Dr 1200 AR / Cr 4100 Maintenance Revenue / Cr 2101 Sales Tax' : 'Dr 1200 AR / Cr 2200 Deferred Revenue / Cr 2101 Sales Tax; recognized per visit', ms: '6 ms', det: true }],
    hitl: [['Tasha', 'sets the billing mode and the skip policy; amendments are versioned.']],
    tags: [['mvp', 'service agreement lifecycle, per-visit and level billing with true-up']],
    specs: 'Spec: 07 §4.2-4.3 (level billing, skip credits, auto-renewal) · 03 EST-12 · 09 (posting rules)'
  };
};

/* ---------- r06 route ---------- */
WT.screens['r06-route'] = function (S) {
  var list = [['7:30', 'Hollins', 'Clintonville'], ['7:58', 'Abel', 'Clintonville'], ['8:21', 'Ferris', 'Clintonville'], ['…', '4 more', ''], ['10:46', 'Brennan (new)', 'Worthington', 1], ['11:13', 'Kovacs', 'Worthington'], ['…', '9 more', '']];
  var main = '<div class="apphead"><span class="crumb">Schedule › Routes</span><h3>Crew 2 · Tuesday route</h3>' + pill('info', '19 stops') + '<span class="sp"></span>' + (S.published ? pill('ok', 'Published') : '<button type="button" class="btn sm primary" data-act="publish" data-k="publish">Publish route</button>') + '</div>' +
    '<div class="wt-cols wide-left"><div>' + routeSVG({ inserted: true }) + '<div class="legend mt6"><span><i style="background:var(--accent)"></i>New stop</span><span><i style="background:var(--primary)"></i>Route after insertion</span><span><i style="background:var(--border-strong)"></i>Before</span></div></div>' +
    '<div class="wt-stack"><div class="panel"><h4>Insertion</h4><dl class="kv"><dt>Inserted</dt><dd>Stop 8, between Ferris and Kovacs</dd><dt>Drive added</dt><dd>+6 min</dd><dt>On site</dt><dd>21 min (2 people)</dd><dt>Day length</dt><dd>7 h 48 m of 8 h 30 m</dd><dt>Avg drive</dt><dd>9.0 → 8.7 min between stops</dd></dl></div>' +
    '<div class="panel"><h4>Stops</h4><ul class="wt-list">' + list.map(function (s) { return '<li class="wt-row' + (s[3] ? ' sel' : ' soft') + '"><span class="mono tiny">' + s[0] + '</span><span>' + esc(s[1]) + '<span class="sub">' + esc(s[2]) + '</span></span><span></span></li>'; }).join('') + '</ul></div>' +
    (S.published ? '<div class="toast">' + ic('check') + 'Day-ahead reminders queued for 19 clients at 3:00 PM Monday; "on the way" texts on.</div>' : '') + '</div></div>';
  return browser('app.rootline.com/t/greenleaf/schedule/routes/crew-2/tue', appShell('Schedule', main), 'Greenleaf office: route');
};
WT.actions.publish = function (el, S) { S.published = true; };
WT.ensure['r06-route'] = function (S) { S.published = true; };
WT.bts['r06-route'] = function (S) {
  return {
    what: 'New recurring clients are inserted into an existing route at the cheapest point, so a 21-minute mow adds only 6 minutes of driving. Route density (average drive between stops) improves as streets fill in, which is how small jobs become profitable. Publishing the route queues the day-ahead reminders and live "on the way" texts with an ETA window.',
    agents: [['Route optimizer', 'Sequencing and cheapest insertion (OR-Tools), deterministic', 1]],
    trace: [{ c: 'route.insert(Crew 2, Tue, Brennan)', r: 'position 8 · +6 min drive · fits the 8.5 h day', ms: '120 ms', det: true }, { c: 'route.publish(Crew 2, Tue)', r: S.published ? '19 stops published to the crew app' : 'draft', ms: S.published ? '40 ms' : '', det: true }, { c: 'messages.schedule(day_ahead, 19)', r: S.published ? 'queued for Monday 3:00 PM' : 'waits for publish', ms: S.published ? '20 ms' : '', det: true }],
    hitl: [['Luis', 'reviews and publishes the route; he can lock stops the optimizer must not move.']],
    tags: [['mvp', 'route sequencing and insertion, publish, reminders and ETA texts'], ['v1', 'multi-crew day and week optimization']],
    specs: 'Spec: 04 §4.6-4.9 (dispatch board, routing), §4.10.5 (ETA notices) · 18 (route density)'
  };
};

/* ---------- r07 rain day ---------- */
WT.screens['r07-rain'] = function (S) {
  var gantt = function (moved) {
    var tue = moved ? [[0, 52, '11 stops (6:30 start)'], [52, 8, 'yard']] : [[6, 46, '11 morning stops'], [52, 40, '7 afternoon stops (rain)']];
    var wed = moved ? [[0, 62, 'Wed route'], [64, 26, '+7 from Tue', 'ai']] : [[0, 62, 'Wed route'], [64, 26, 'open 2.6 h', 'warn']];
    function row(lbl, blks) { return '<div class="g-row"><span>' + lbl + '</span><div class="g-track">' + blks.map(function (b) { return '<span class="g-blk ' + (b[3] || (b[2] === 'yard' ? 'alt' : '')) + '" style="left:' + b[0] + '%;width:' + b[1] + '%">' + esc(b[2]) + '</span>'; }).join('') + '</div></div>'; }
    return '<div class="wt-gantt">' + row('Tue · Crew 2', tue) + row('Wed · Crew 2', wed) + '</div>';
  };
  var decided = S.rain === 'approved';
  var main = '<div class="apphead"><h3>Approvals</h3>' + pill('info', '1 waiting') + '</div>' +
    '<div class="panel"><div class="ph"><span>' + ic('rain', 's') + ' Weather · Tuesday</span><span>0.6 in of rain, 1 PM to 6 PM · 80%</span></div>' +
    '<div class="ai-box"><div class="ai-h">' + ic('spark') + 'Scheduling agent (A7) proposes a rain plan</div><ul><li>Start Crew 2 at 6:30 instead of 7:00 and finish the 11 morning stops before 1 PM.</li><li>Move the 7 afternoon stops to Wednesday, where Crew 2 has 2.6 hours open; nobody is pushed past Wednesday.</li><li>Text the 7 clients tonight; the Brennans keep their Tuesday visit.</li></ul><div class="flex mt6"><span class="cost">12 credits (quoted before the run)</span><span class="tiny faint">Confidence 0.86 · uses the rain-day playbook "Split the day"</span></div></div>' +
    '<h4 class="mt10">Before</h4>' + gantt(false) + '<h4 class="mt10">After</h4>' + gantt(true) +
    '<div class="panel soft mt10"><div class="ph">Message to the 7 clients</div><p class="tiny">"Hi from Greenleaf: rain is coming Tuesday afternoon, so your mowing moves to Wednesday. No action needed. Reply STOP to opt out."</p></div>' +
    '<div class="flex mt10">' + (decided ? '<span class="okline">' + ic('check') + 'Approved by Luis · 7 visits moved · 7 texts queued for 6:00 PM</span>' : '<button type="button" class="btn sm primary" data-act="rain" data-k="rainOk">' + ic('check') + 'Approve plan</button><button type="button" class="btn sm">Edit</button><button type="button" class="btn sm">Reject</button>') + '</div></div>';
  return browser('app.rootline.com/t/greenleaf/approvals', appShell('Approvals', main, { counts: { Approvals: decided ? 0 : 1 } }), 'Greenleaf office: approvals');
};
WT.actions.rain = function (el, S) { S.rain = 'approved'; };
WT.bts['r07-rain'] = function (S) {
  return {
    what: 'The forecast crosses the rain-day threshold, so the Scheduling agent drafts a plan from Greenleaf\'s rain-day playbook: start early, move only the afternoon stops, keep moves within one day, and notify affected clients. Luis sees a before-and-after diff and approves. Nothing moves until he does.',
    agents: [['Scheduling agent (A7)', 'Weather reschedules, gap filling, capacity checks', 0], ['Route optimizer', 'Re-sequences the changed days', 1]],
    trace: [{ c: 'weather.alert_raised(Tue, 0.6 in, 1-6 PM)', r: 'rain-day threshold crossed', ms: '—', det: true }, { c: 'agent.A7.plan(playbook="Split the day")', r: '7 stops to Wed; start 6:30', ms: '9.4 s' }, { c: 'route.check_capacity(Wed, Crew 2)', r: '2.6 h open; fits', ms: '80 ms', det: true }, { c: 'messages.draft(7 clients)', r: 'one template, localized', ms: '1.1 s' }, { c: 'approval.decide(Luis)', r: S.rain ? 'approved' : 'waiting', ms: S.rain ? 'human' : '', human: !S.rain }],
    hitl: [['Luis', 'approves, edits or rejects the plan; the agent cannot move visits or text clients on its own.']],
    levels: ['A7 at L2: drafts, a person approves', 'Risk tier T3: client messages and schedule changes'],
    creditNote: 'Agent task runs are quoted before they run (10-30 credits); this one used 12.',
    tags: [['v1', 'Scheduling agent and rain-day playbooks'], ['mvp', 'weather alerts and manual rescheduling']],
    specs: 'Spec: 17 §4.5.8 (A7) · 04 §4.9 (weather and rain-day playbooks) · 22 §4.4.1'
  };
};

/* ---------- r08 visit ---------- */
WT.screens['r08-visit'] = function (S) {
  var crew = '<p class="ptitle">Brennan · 612 Evening St</p><p class="psub">Stop 8 of 19 · arrived 10:46</p><div class="pcard soft"><div class="flex">' + pill('warn', 'Dog in back: Biscuit, friendly') + pill('', 'Gate code in app') + '</div></div>' +
    '<div class="pcard"><h4>Checklist</h4>' + ['Mow front and back (stripe pattern)', 'String trim fence line and beds', 'Edge walk and driveway', 'Blow hard surfaces'].map(function (t) { return '<label class="check"><input type="checkbox" checked disabled><span>' + t + '</span></label>'; }).join('') + '</div>' +
    '<div class="pcard"><h4>Photos</h4><div class="ba2"><div>' + lawnPhoto(false, 'Before photo of the front lawn') + '<div class="cap">Before 10:46</div></div><div>' + lawnPhoto(true, 'After photo of the striped front lawn') + '<div class="cap">After 11:05</div></div></div></div>' +
    (S.visitDone ? '<div class="toast">' + ic('check') + 'Visit complete · 19 min on site</div>' : '<button type="button" class="btn primary" data-act="visit" data-k="visit" style="justify-content:center">Complete visit (press and hold)</button>');
  var client = S.visitDone ? '<div class="wt-sms"><div class="wt-bubble them">Your lawn was mowed today by Crew 2 (Marco, Maria, Javier). Photos and notes: greenleafgrounds.com/p/v8812<small>11:06 AM</small></div><div class="ba2">' + '<div>' + lawnPhoto(false, 'Before photo') + '<div class="cap">Before</div></div><div>' + lawnPhoto(true, 'After photo') + '<div class="cap">After</div></div></div><div class="wt-bubble me">Looks great, thank you!<small>11:20 AM</small></div></div>' : '<div class="wt-sms"><div class="wt-bubble them">Greenleaf is on the way: Crew 2 should arrive between 10:30 and 11:00.<small>10:21 AM</small></div><div class="tiny faint" style="text-align:center">The visit summary arrives when the crew completes the visit.</div></div>';
  return devRow(phone(crew, { brand: 'Rootline Crew', sub: 'Crew 2 · Marco Ruiz', logo: 'truck', label: 'Crew lead phone: visit run sheet', right: '<span class="pill ok">Synced</span>' }), phone(client, { brand: 'Messages', sub: 'Greenleaf Grounds Co.', logo: 'chat', label: 'Client phone: visit summary', k: 'c' }));
};
WT.actions.visit = function (el, S) { S.visitDone = true; };
WT.ensure['r08-visit'] = function (S) { S.visitDone = true; };
WT.bts['r08-visit'] = function (S) {
  return {
    what: 'The crew sees only what it needs: the stop, hazards, the checklist and photo slots. Completing the visit stamps the time on site for job costing, attaches before and after photos, and sends the client a visit summary. The crew\'s full day in the app is its own walkthrough.',
    agents: [['Visit automation', 'Completion events and the client summary, deterministic', 1]],
    trace: [{ c: 'visit.arrived(geofence)', r: '10:46 · prompt accepted', ms: '—', det: true }, { c: 'visit.completed(V-8812)', r: S.visitDone ? '19 min on site · 2 photos' : 'in progress', ms: S.visitDone ? '—' : '', det: true }, { c: 'message.visit_summary(Brennans)', r: S.visitDone ? 'sent with photos' : 'waits for completion', ms: S.visitDone ? '300 ms' : '', det: true }],
    hitl: [['Marco', 'completes the visit with a press-and-hold; the client can reply in the thread.']],
    tags: [['mvp', 'crew run sheet, photos, ETA texts and visit summaries']],
    specs: 'Spec: 05 §4.4 (run sheet) · 04 §4.10.5 · 16 §4.22 (lifecycle messages) · see the crew-day walkthrough'
  };
};

/* ---------- r09 spot it ---------- */
WT.screens['r09-spot-it'] = function (S) {
  var crew = '<p class="ptitle">Spot it</p><p class="psub">Brennan · 612 Evening St</p><div class="pcard soft"><div class="flex">' + ic('mic') + '<b>Voice note · 0:38</b>' + pill('', 'Español') + '</div><p class="tiny mt6" style="font-style:italic">"En el patio de atrás hay dos parches secos cerca de la cerca, como de un metro cada uno, y un aspersor roto en la zona tres; está tirando agua a la entrada."</p></div>' +
    (S.voice ? '<div class="ai-box"><div class="ai-h">' + ic('spark') + 'English summary</div><ul><li>Two dry patches by the back fence, about 1 m each.</li><li>Broken sprinkler head in zone 3, spraying the driveway.</li></ul></div>' : '<button type="button" class="btn ai" data-act="voice" data-k="voice">' + ic('spark') + 'Send to the office</button>') +
    (S.accepted ? '<div class="toast">' + ic('check') + 'The Brennans said yes to aeration</div>' : '');
  var office = appShell('Approvals', '<div class="apphead"><h3>Approvals</h3>' + pill('info', S.upsellSent ? '0 waiting' : '2 waiting') + '</div>' +
    (S.voice ? '<div class="panel"><div class="ph">Field-Note agent (A4) · from Javier Torres</div><p class="tiny muted">Original kept in Spanish; translation reviewed by the agent\'s glossary.</p>' +
      '<div class="wt-list mt6"><div class="wt-row ai"><span class="wt-ic ai">' + ic('sprout') + '</span><span><b>Core aeration and overseeding</b><span class="sub">Quick Quote template · 8,960 sq ft · fall</span></span><span class="num"><b>$315</b></span></div>' +
      '<div class="wt-row ai"><span class="wt-ic ai">' + ic('drop') + '</span><span><b>Sprinkler head repair, zone 3</b><span class="sub">Service call + 1 rotor head</span></span><span class="num"><b>$101</b></span></div></div>' +
      '<div class="wt-bubble ai mt10">Hi Rachel, Javier on our crew noticed two dry patches by the back fence and a broken sprinkler head in zone 3 that\'s watering your driveway. We can fix the head for $101 and aerate and overseed in the fall for $315. Tap to add either: greenleafgrounds.com/o/8812</div>' +
      '<div class="flex mt10">' + (S.upsellSent ? '<span class="okline">' + ic('check') + 'Sent by Tasha' + (S.accepted ? ' · aeration accepted, added to the fall schedule (Oct 6)' : '') + '</span>' + (S.accepted ? '' : '<button type="button" class="btn sm" data-act="accept" data-k="accept">Simulate the Brennans accepting aeration</button>') : '<button type="button" class="btn sm primary" data-act="upsell" data-k="upsell">' + ic('check') + 'Approve and send</button><button type="button" class="btn sm">Edit</button>') + '</div></div>' : '<div class="panel soft"><p class="muted">Javier\'s note arrives here once he sends it.</p></div>'));
  return '<div class="wt-cols"><div>' + phone(crew, { brand: 'Rootline Crew', sub: 'Javier Torres · Crew 2', logo: 'truck', label: 'Technician phone: Spot it' }) + '</div><div>' + browser('app.rootline.com/t/greenleaf/approvals', office, 'Greenleaf office: approvals') + '</div></div>';
};
WT.actions.voice = function (el, S) { S.voice = true; };
WT.actions.upsell = function (el, S) { S.upsellSent = true; };
WT.actions.accept = function (el, S) { S.accepted = true; };
WT.ensure['r09-spot-it'] = function (S) { S.voice = true; S.upsellSent = true; S.accepted = true; };
WT.bts['r09-spot-it'] = function (S) {
  return {
    what: 'Crews see problems first. Javier records a note in Spanish; the Field-Note agent transcribes it, writes an English summary that keeps the original, and turns each issue into a priced offer from Greenleaf\'s Quick Quote templates. Tasha approves the message; the client accepts with one tap and the work lands on the schedule. Javier gets credit for the sale.',
    agents: [['Field-Note agent (A4)', 'Speech to text, ES to EN, extraction of issues and upsells', 0], ['Pricing engine', 'Prices each upsell from a template', 1]],
    trace: [{ c: 'voice.transcribe(es, 0:38)', r: S.voice ? 'transcript, confidence 0.94' : 'waiting', ms: S.voice ? '3.2 s' : '', pending: !S.voice }, { c: 'agent.A4.extract', r: S.voice ? '2 issues → 2 opportunities' : '', ms: S.voice ? '2.4 s' : '', pending: !S.voice }, { c: 'quickquote.price(aeration, 8,960 sq ft)', r: S.voice ? '$315' : '', ms: S.voice ? '9 ms' : '', det: true, pending: !S.voice }, { c: 'approval.decide(Tasha)', r: S.upsellSent ? 'approved; sent by SMS' : 'waiting', ms: S.upsellSent ? 'human' : '', human: S.voice && !S.upsellSent, pending: !S.voice }, { c: 'visit.schedule(aeration, Oct 6)', r: S.accepted ? 'added to Crew 2' : '', ms: S.accepted ? '50 ms' : '', det: true, pending: !S.accepted }],
    hitl: [['Tasha', 'approves the client message; prices come from templates, not from the model.'], ['The Brennans', 'accept or ignore each offer.']],
    levels: ['A4 at L2', 'Risk tier T3: client message'],
    creditNote: 'Voice note 1 credit a minute (1) plus two drafted offers (1 each).',
    tags: [['mvp', 'Spot it, voice notes with ES/EN translation, office-side extraction'], ['v1', 'one-tap action proposals on the crew device']],
    specs: 'Spec: 05 §4.11 (voice notes), §4.10 (Spot it) · 17 §4.5.5 (A4) · 03 EST-11'
  };
};

/* ---------- r10 invoice and pay ---------- */
WT.screens['r10-pay'] = function (S) {
  var lines = S.billing === 'level' ? [['September installment (level billing, 6 of 8)', 273.75]] : [['Weekly mowing · 4 visits in September (Sep 1, 8, 15, 22)', 292], ['Fertilization round 4 of 5 (Sep 8)', 64]];
  var sub = lines.reduce(function (t, l) { return t + l[1]; }, 0), tax = Math.round(sub * TAX * 100) / 100, tot = sub + tax;
  var je = S.billing === 'level' ? [['1200 Accounts Receivable', tot, 0], ['2200 Deferred Revenue', 0, sub], ['2101 Sales Tax Payable - Ohio', 0, tax]] : [['1200 Accounts Receivable', tot, 0], ['4100 Maintenance Revenue', 0, sub], ['2101 Sales Tax Payable - Ohio', 0, tax]];
  var jeHTML = '<table class="wt-je"><thead><tr><th>Account</th><th class="n">Debit</th><th class="n">Credit</th></tr></thead><tbody>' + je.map(function (r) { return '<tr><td>' + r[0] + '</td><td class="n">' + (r[1] ? money(r[1], true) : '') + '</td><td class="n">' + (r[2] ? money(r[2], true) : '') + '</td></tr>'; }).join('') + '<tr class="tot"><td>Balanced</td><td class="n">' + money(tot, true) + '</td><td class="n">' + money(tot, true) + '</td></tr></tbody></table>';
  var paid = S.payPath === 'ok' || S.paidLink;
  var payJE = '<table class="wt-je mt6"><tbody><tr><td>1050 Stripe Clearing - USD</td><td class="n">' + money(tot, true) + '</td><td class="n"></td></tr><tr><td>1200 Accounts Receivable</td><td class="n"></td><td class="n">' + money(tot, true) + '</td></tr></tbody></table>';
  var main = '<div class="apphead"><span class="crumb">Money › Invoices</span><h3>INV-3107 · Rachel and Tom Brennan</h3>' + (paid ? pill('ok', 'Paid') : pill('warn', 'Payment failed')) + '<span class="sp"></span><div class="seg" role="group" aria-label="Scenario"><button type="button" data-act="payPath" data-v="ok" data-k="pok" aria-pressed="' + (S.payPath === 'ok') + '">Autopay succeeds</button><button type="button" data-act="payPath" data-v="fail" data-k="pfail" aria-pressed="' + (S.payPath === 'fail') + '">Card declined</button></div></div>' +
    '<div class="wt-cols"><div class="wt-stack"><div class="panel"><h4>Lines</h4><table class="data tight"><tbody>' + lines.map(function (l) { return '<tr><td>' + l[0] + '</td><td class="num">' + money(l[1], true) + '</td></tr>'; }).join('') + '<tr><td>Ohio sales tax 8.0% (verify)</td><td class="num">' + money(tax, true) + '</td></tr><tr><td><b>Total</b></td><td class="num"><b>' + money(tot, true) + '</b></td></tr></tbody></table><div class="wt-note mt6">Attached: 4 visit summaries with photos; the fertilizer application notice.</div></div>' +
    '<div class="panel"><h4>Ledger · invoice issued</h4>' + jeHTML + '</div></div><div class="wt-stack">' +
    (S.payPath === 'ok' ? '<div class="panel"><h4>' + ic('card') + ' Autopay · Oct 1</h4><div class="okline">' + ic('check') + 'Visa ending 4242 charged ' + money(tot, true) + '</div><div class="wt-note">Charged on Greenleaf\'s own Stripe account.</div>' + payJE + '</div>' :
      '<div class="panel"><h4>' + ic('card') + ' Autopay · Oct 1</h4><div class="warnline">' + ic('warn') + 'Visa ending 4242 declined (insufficient funds)</div><div class="wt-note">Soft decline: retries on day 1, 3, 7 and 14. Hard declines are never retried.</div><div class="wt-steps mt6"><span class="done">Day 1 failed</span><span class="' + (S.paidLink ? 'done' : 'on') + '">Day 3</span><span>Day 7</span><span>Day 14</span></div></div>' +
      '<div class="panel"><div class="ph">Collections agent (A5) <span class="pill info">L2</span></div><div class="wt-bubble ai">Hi Rachel, your September invoice for ' + money(tot, true) + ' didn\'t go through on the card ending 4242. You can pay by bank transfer (no fee) or update your card here: greenleafgrounds.com/pay/INV-3107. Thanks!</div><div class="flex mt6">' +
      (S.reminder ? '<span class="okline">' + ic('check') + 'Sent by Tasha</span>' + (S.paidLink ? pill('ok', 'Paid by bank (ACH)') : '<button type="button" class="btn sm" data-act="paidLink" data-k="paidLink">Simulate Rachel paying</button>') : '<button type="button" class="btn sm primary" data-act="reminder" data-k="reminder">' + ic('check') + 'Approve reminder</button><span class="cost">1 credit</span>') + '</div>' + (S.paidLink ? payJE : '') + '</div>') + '</div></div>';
  return browser('app.rootline.com/t/greenleaf/money/invoices/INV-3107', appShell('Money', main), 'Greenleaf office: invoice');
};
WT.actions.payPath = function (el, S) { S.payPath = el.getAttribute('data-v'); };
WT.actions.reminder = function (el, S) { S.reminder = true; };
WT.actions.paidLink = function (el, S) { S.paidLink = true; };
WT.bts['r10-pay'] = function (S) {
  return {
    what: 'Completed visits roll into the month\'s invoice according to the billing mode chosen on the agreement (now: ' + (S.billing === 'level' ? 'level monthly' : 'per visit') + '). The invoice posts to Rootline\'s built-in ledger, and autopay charges the saved card on Greenleaf\'s own Stripe account. When a card fails, retries follow the schedule and the Collections agent drafts a friendly reminder that Tasha approves.',
    agents: [['Billing Engine', 'Monthly run from completed visits', 1], ['Payments', 'Off-session charge on the connected Stripe account', 1], ['Collections agent (A5)', 'Drafts reminders and payment-plan offers', 0]],
    trace: [{ c: 'billing_run.post(Sep, SA-1042)', r: 'INV-3107 issued', ms: '120 ms', det: true }, { c: 'ledger.post(invoice.issued)', r: 'balanced entry, 3 lines', ms: '15 ms', det: true }, { c: 'payments.charge_saved_method(INV-3107)', r: S.payPath === 'ok' ? 'succeeded' : 'card_declined (insufficient_funds)', ms: '900 ms', det: true }, S.payPath === 'ok' ? { c: 'ledger.post(payment.succeeded)', r: 'Dr 1050 / Cr 1200', ms: '12 ms', det: true } : { c: 'agent.A5.draft_reminder', r: S.reminder ? 'approved and sent' : 'waiting for approval', ms: '1.6 s', human: !S.reminder }],
    hitl: [['Tasha', 'approves collection messages; service holds for non-payment need her decision too.']],
    levels: ['A5 at L2 (L3 possible later for the day-3 reminder, if Erin allows it)'],
    creditNote: S.payPath === 'ok' ? 'No AI on the success path; the reminder on the failure path costs 1 credit.' : 'The drafted reminder costs 1 credit.',
    tags: [['mvp', 'billing runs, autopay, retries, reminders, ledger postings']],
    specs: 'Spec: 07 §4.2, §4.8 (dunning) · 08 §4.15 (retries) · 09 (posting rules P1, payments) · 17 §4.5.6 (A5)'
  };
};
WT.credits['r10-pay'] = 1;

/* ---------- r11 renewal ---------- */
WT.screens['r11-renewal'] = function (S) {
  var main = '<div class="apphead"><h3>Approvals</h3>' + pill('info', S.renewal ? '0 waiting' : '1 waiting') + '</div><div class="panel"><div class="ph">Renewal agent (A13) · SA-1042 · Brennan</div>' +
    '<div class="wt-cols"><div><dl class="kv"><dt>This season</dt><dd>30 planned · 28 done · 2 weather skips</dd><dt>Price now</dt><dd class="num">$73.00 a visit</dd><dt>Proposed</dt><dd class="num"><b>$76.00</b> (+4.1%, fuel and labor index)</dd><dt>Churn risk</dt><dd>' + pill('ok', 'Low') + ' paid on time, accepted an upsell, 1 positive reply</dd><dt>Notice</dt><dd>30 days before auto-renewal (Ohio rule table, verify)</dd></dl></div>' +
    '<div class="wt-bubble ai">Hi Rachel and Tom, thanks for a great first season with Greenleaf! Your mowing renews in April at $76 a visit (up $3, mostly fuel and labor). Your aeration is booked for October 6. Nothing to do if you\'d like to continue, or reply with any changes.</div></div>' +
    '<div class="flex mt10">' + (S.renewal ? '<span class="okline">' + ic('check') + 'Approved by Erin · notice scheduled for March 1</span>' : '<button type="button" class="btn sm primary" data-act="renew" data-k="renew">' + ic('check') + 'Approve renewal</button><button type="button" class="btn sm">Keep price at $73</button><span class="cost">2 credits</span>') + '</div></div>';
  return browser('app.rootline.com/t/greenleaf/approvals', appShell('Approvals', main), 'Greenleaf office: renewal approval');
};
WT.actions.renew = function (el, S) { S.renewal = 'approved'; };
WT.bts['r11-renewal'] = function (S) {
  return {
    what: 'Sixty days before the agreement ends, the Renewal agent proposes next season\'s price using Greenleaf\'s escalator rule and a churn-risk read, and drafts the notice. The state notice rules decide when the notice must go out. Erin approves the price; the client can accept by doing nothing or reply with changes.',
    agents: [['Renewal agent (A13)', 'Price recommendation, churn risk, renewal message', 0]],
    trace: [{ c: 'agreement.renewal_due(SA-1042)', r: '60 days before term end', ms: '—', det: true }, { c: 'pricing.escalator(fuel_labor_index)', r: '+4.1% → $76', ms: '20 ms', det: true }, { c: 'model.churn_risk(Brennans)', r: 'low (0.08)', ms: '300 ms' }, { c: 'agent.A13.draft_notice', r: S.renewal ? 'approved by Erin' : 'waiting', ms: '1.9 s', human: !S.renewal }],
    hitl: [['Erin', 'approves price changes; the escalator rule never applies itself.']],
    levels: ['A13 at L2', 'Risk tier T3: price change to a client'],
    creditNote: 'Price recommendation and message draft: 2 credits.',
    tags: [['v1', 'Renewal agent and churn-aware messaging'], ['mvp', 'auto-renewal with notice rules and fixed escalators']],
    specs: 'Spec: 17 §4.5.14 (A13) · 07 §4.3 (escalators, auto-renewal rule table) · 18 (churn model)'
  };
};

/* ---------- r12 owner ---------- */
WT.screens['r12-owner'] = function (S) {
  var crews = [['Crew 1 (install)', '—', '—', '—'], ['Crew 2', '$64.10', '13%', '96%'], ['Crew 3', '$58.40', '19%', '91%'], ['Crew 4', '$61.20', '15%', '94%']];
  var main = '<div class="apphead"><span class="crumb">Reports › Maintenance</span><h3>Maintenance business · this week</h3><span class="sp"></span>' + pill('', 'Week of Sep 14') + '</div>' +
    '<div class="wt-kpis"><div class="wt-kpi"><div class="l">Revenue / man-hour</div><div class="v">$61.90</div><div class="d delta up">+$2.30 vs last month</div></div><div class="wt-kpi"><div class="l">Drive time</div><div class="v">15%</div><div class="d">of crew hours</div></div><div class="wt-kpi"><div class="l">Visits done</div><div class="v">212 / 220</div><div class="d">7 moved by rain, 1 skip</div></div><div class="wt-kpi"><div class="l">Season to date</div><div class="v">$418k</div><div class="d">of $512k under agreement</div></div><div class="wt-kpi"><div class="l">Spot-it sales</div><div class="v">$3,940</div><div class="d">12 accepted this month</div></div><div class="wt-kpi"><div class="l">Overdue</div><div class="v">$1,860</div><div class="d">4 clients, reminders running</div></div></div>' +
    '<div class="wt-cols mt10"><div class="panel"><h4>Route profitability</h4><table class="data tight"><thead><tr><th>Crew</th><th class="num">Rev / man-hr</th><th class="num">Drive</th><th class="num">On time</th></tr></thead><tbody>' + crews.map(function (c) { return '<tr><td>' + c[0] + '</td><td class="num">' + c[1] + '</td><td class="num">' + c[2] + '</td><td class="num">' + c[3] + '</td></tr>'; }).join('') + '</tbody></table><div class="wt-note mt6">Crew 3\'s drive time is high: its Friday route crosses the river twice.</div></div>' +
    '<div class="panel"><h4>' + ic('spark') + ' Ask Copilot</h4>' + (S.ownerQ ? '<div class="wt-bubble me">Which routes should we fill first next spring?</div><div class="wt-bubble ai mt6">Crew 3\'s Friday route has the most room: 2.1 hours open and 19% drive time. Filling 5 stops on Kenny Rd and Bethel Rd would cut its drive time to about 15% (KPI Dictionary: route_drive_pct). The neighborhood campaign walkthrough shows how to target those streets.<small>Sources: route stats this season · 1 credit</small></div>' : '<button type="button" class="btn sm ai" data-act="ownerQ" data-k="ownerQ">' + ic('spark') + 'Which routes should we fill first next spring?</button>') + '</div></div>';
  return browser('app.rootline.com/t/greenleaf/reports/maintenance', appShell('Reports', main), 'Greenleaf office: maintenance report');
};
WT.actions.ownerQ = function (el, S) { S.ownerQ = true; };
WT.bts['r12-owner'] = function (S) {
  return {
    what: 'Small jobs pay when routes are dense and crews stay productive. Erin sees revenue per man-hour, drive time and on-time rate by crew, visits done against plan, season revenue against what the agreements are worth, and the upsells crews spotted. Every number comes from the KPI Dictionary, so the Copilot\'s answer matches the dashboard.',
    agents: [['Reporting', 'KPI Dictionary metrics, deterministic', 1], ['Copilot', 'Answers grounded in the same metrics', 0]],
    trace: [{ c: 'metrics.query(rev_per_man_hour, route_drive_pct, on_time_rate)', r: 'by crew, this week', ms: '180 ms', det: true }, { c: 'copilot.ask("fill routes")', r: S.ownerQ ? 'answered with sources' : 'not asked', ms: S.ownerQ ? '2.2 s' : '', pending: !S.ownerQ }],
    hitl: [['Erin', 'reads and decides; nothing changes without an action she confirms.']],
    creditNote: S.ownerQ ? 'The Copilot question costs 1 credit (not counted in this walkthrough\'s total).' : 'Dashboards are free; a Copilot question costs 1 credit.',
    tags: [['mvp', 'owner and ops dashboards, KPI Dictionary, certified Copilot answers']],
    specs: 'Spec: 18 §4.1-4.4 (dashboards, KPI Dictionary) · 17 (Copilot grounding)'
  };
};

/* ---------- r13 recap ---------- */
WT.screens['r13-recap'] = function (S) {
  var rows = [
    ['Instant quote', 'Aerial measurement + visit model', 'Deterministic', 'The Brennans', '0'],
    ['Booking', 'Agreement, visits, card on file', 'Deterministic', 'The Brennans', '0'],
    ['Missed call', 'Text-back; voicemail summary; Lead Follow-up (A3)', 'AI', 'Tasha', '6'],
    ['Quick Quote', 'Pricing engine, tiers, SMS proposal', 'Deterministic', 'Sam, the Patels', '0'],
    ['Route', 'Cheapest insertion, publish, reminders', 'Deterministic', 'Luis', '0'],
    ['Rain day', 'Scheduling agent (A7) plan', 'AI', 'Luis', '12'],
    ['Spot it', 'Field-Note agent (A4) summary and offers', 'AI', 'Tasha, the Brennans', '3'],
    ['Collections', 'Collections agent (A5) reminder', 'AI', 'Tasha', '1'],
    ['Renewal', 'Renewal agent (A13) price and notice', 'AI', 'Erin', '2']
  ];
  return '<div class="wt-cols wide-left"><div class="panel"><h4>Everything that ran</h4><div class="table-scroll"><table class="data tight rec-table"><thead><tr><th>Step</th><th>What ran</th><th>Kind</th><th>Approved by</th><th class="num">Credits</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + (r[2] === 'AI' ? pill('ai', 'AI') : pill('', 'Rules')) + '</td><td>' + r[3] + '</td><td class="num">' + r[4] + '</td></tr>'; }).join('') + '<tr><td colspan="4"><b>Total for the walkthrough</b></td><td class="num"><b>24</b></td></tr></tbody></table></div><p class="wt-note mt6">24 credits is 0.4% of Greenleaf\'s 6,000 monthly credits on Pro. Most of the loop is deterministic automation, which is free.</p></div>' +
    '<div class="wt-stack"><div class="panel"><h4>Scope</h4><div style="display:grid;gap:5px"><div class="tagrow">' + tag('mvp') + '<span class="note">Quick Quote, aerial turf measurement, agreements, level billing, routes, ETA texts, crew run sheet, Spot it, voice notes, autopay, reminders, dashboards</span></div><div class="tagrow">' + tag('v1') + '<span class="note">online booking and instant quotes, AI receptionist, Scheduling and Renewal agents, multi-crew optimization</span></div></div></div>' +
    '<div class="panel"><h4>The same loop runs</h4><p class="tiny muted">mulch and cleanups (Quick Quote templates), 5-step lawn programs with application records, irrigation start-ups and winterizations, and Snow Lite storm visits in winter.</p></div>' +
    '<div class="flex"><a class="btn" href="#overview">' + ic('arrow-l') + 'Back to start</a><a class="btn" href="index.html">Vision site</a><a class="btn primary" href="walkthroughs.html">All walkthroughs ' + ic('arrow-r') + '</a></div></div></div>';
};
WT.bts['r13-recap'] = function (S) {
  return {
    what: 'Small jobs run on rules: measurement, pricing, scheduling, routing, billing and payments are deterministic and free. AI shows up where judgment and language help (answering a lead, replanning a rain day, turning a crew\'s voice note into a sale, chasing a payment, drafting a renewal), and a person approves each time.',
    hitl: [['People approved', 'every client message, schedule change, price change and collection step in this walkthrough.']],
    creditNote: '24 credits across the whole loop.',
    tags: [['mvp', 'most of the loop'], ['v1', 'self-serve booking, AI receptionist, Scheduling and Renewal agents']],
    specs: 'Spec: 03, 04, 05, 07, 08, 09, 16, 17, 18, 22, 24'
  };
};
