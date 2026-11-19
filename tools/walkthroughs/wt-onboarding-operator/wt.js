/* Walkthrough: getting started (a company switching from Jobber + QuickBooks) and the operator console.
   Tenant pricing per doc 22 §4.2; operator facts match screens-field-client-admin.html. */

var RB = { co: 'Riverbend Lawn & Landscape', sub: 'Grand Rapids, MI · Grow' };
function shellR(active, main, opt) { opt = opt || {}; return appShell(active, main, { co: RB.co, coSub: opt.trial ? 'Grand Rapids, MI · trial' : RB.sub, foot: '', counts: opt.counts }); }
var CON_NAV = [['home', 'Home'], ['users', 'Tenants'], ['refresh', 'Migrations'], ['dollar', 'Billing'], ['flag', 'Flags'], ['chat', 'Support'], ['leaf', 'Plant KB'], ['spark', 'AI Ops'], ['card', 'Payments'], ['shield', 'Compliance'], ['chart', 'Analytics']];
function consoleBar() { return '<div class="console-top">' + ic('leaf') + '<b>ROOTLINE CONSOLE</b><span class="pill">prod-us</span><span class="sp" style="flex:1"></span><span>Maya R. · support</span></div>'; }
function consoleShell(active, main) {
  return '<div class="console-top">' + ic('leaf') + '<b>ROOTLINE CONSOLE</b><span class="pill">prod-us</span><span class="sp" style="flex:1"></span><span>You · platform_owner</span></div>' + appShell(active, main, { nav: CON_NAV, co: 'Rootline', coSub: 'Operator console', foot: 'Staff actions are audited and reason-coded', navLabel: 'Operator console navigation (concept)' });
}

var WT = {
  title: 'Rootline walkthrough: getting started and the operator console',
  short: 'Getting started and the operator console',
  ovTitle: 'Getting started and the operator console',
  allowance: 2000, startLeft: 2000, creditOwner: 'Riverbend', plan: 'Grow',
  acts: [
    { n: 'Act 1', t: 'Sign up and set up', sub: 'Plan, setup, Stripe, migration, crew' },
    { n: 'Act 2', t: 'First win', sub: 'A first quote, the checklist done' },
    { n: 'Act 3', t: 'Operator console', sub: 'Tenants and consented support' },
    { n: 'Act 4', t: 'Plant KB, AI and billing', sub: 'Curation, AI operations, SaaS billing' }
  ],
  steps: [
    { id: 'o01-signup', act: 0, short: 'Sign up', title: 'Pick a plan and start a trial', who: 'Dan Mercer', tags: ['mvp'] },
    { id: 'o02-setup', act: 0, short: 'Setup', title: 'Setup: Region, service lines and the chart of accounts', who: 'Dan', tags: ['mvp'] },
    { id: 'o03-stripe', act: 0, short: 'Connect Stripe', title: 'Connect Riverbend\'s own Stripe account', who: 'Dan', tags: ['mvp'] },
    { id: 'o04-migrate', act: 0, short: 'Import', title: 'Import from Jobber and QuickBooks, reconciled to the cent', who: 'Dan', ai: true, tags: ['mvp'] },
    { id: 'o05-crew', act: 0, short: 'Price book and crew', title: 'A starter price book, Quick Quote templates and the crew', who: 'Dan', tags: ['mvp'] },
    { id: 'o06-firstwin', act: 1, short: 'First quote', title: 'The first quote goes out', who: 'Dan', tags: ['mvp'] },
    { id: 'o07-tenant', act: 2, short: 'Tenant 360', title: 'The platform owner\'s view of the new tenant', who: 'You', tags: ['mvp'] },
    { id: 'o08-support', act: 2, short: 'Support access', title: 'Support with the tenant\'s consent', who: 'Maya R., Dan', tags: ['mvp'] },
    { id: 'o09-kb', act: 3, short: 'Plant KB', title: 'Curating the Plant Knowledge Base for the Great Lakes', who: 'Maria Ortiz', ai: true, tags: ['mvp', 'v1'] },
    { id: 'o10-aiops', act: 3, short: 'AI operations', title: 'AI operations: routing, evals, cost and a kill switch', who: 'You', tags: ['mvp'] },
    { id: 'o11-billing', act: 3, short: 'SaaS billing', title: 'Rootline\'s own billing: plans, credit packs, Winter Mode', who: 'You, Dan', tags: ['mvp', 'v1'] },
    { id: 'o12-recap', act: 3, short: 'Recap', title: 'Recap: both sides of the platform', who: 'Everyone', tags: [] }
  ],
  credits: {},
  state: { tier: 'grow', svc: { mow: true, lawn: true, install: true, snow: true, irr: false }, coa: 'maint-install-snow', stripe: 0, mapped: false, dry: false, commit: false, invited: false, tdl: false, qq: false, grant: '', session: false, kb: {}, rating: false, release: false, kill: false, converted: false, pack: false, winter: false },
  ov: {
    eyebrow: 'Clickable walkthrough · both sides of the platform',
    h: 'A company gets running in a day. The operator runs the whole platform without touching anyone\'s money or data.',
    lede: 'Act 1 and 2 follow Riverbend Lawn & Landscape, an 8-person company in Grand Rapids switching from Jobber and QuickBooks Online: plan, setup, connecting its own Stripe account, a migration reconciled to the cent, the crew invited in Spanish and English, and a first quote. Acts 3 and 4 switch to you, the platform owner: the tenant\'s health, support that only happens with the tenant\'s consent, curating the Plant Knowledge Base for the Great Lakes, AI operations, and Rootline\'s own subscription billing.',
    cast: [
      { h: 'Riverbend Lawn & Landscape', icon: 'leaf', items: [['Dan Mercer', 'owner, 8 people, about 300 clients'], ['Keisha Mercer', 'office manager'], ['Crew', '6 field staff, 2 Spanish-first']] },
      { h: 'Rootline', icon: 'shield', items: [['You', 'platform owner (the founder)'], ['Maya R.', 'platform support'], ['Maria Ortiz', 'senior plant curator, Great Lakes and Ohio Valley']] },
      { h: 'Agents', icon: 'spark', items: [['Migration mapping', 'AI-assisted field mapping'], ['KB Curation (A26)', 'drafts plant traits with citations'], ['Support (A27)', 'answers tickets from docs']] }
    ],
    extra: '<p class="wt-note mt14">Riverbend is fictional. Prices follow doc 22. Operator numbers match the console concept screens.</p>'
  },
  screens: {}, bts: {}, actions: {}, inputs: {}, ensure: {}
};

/* o01 */
WT.screens['o01-signup'] = function (S) {
  var tiers = [['starter', 'Starter', '$69', '1 office · 3 field seats · 300 AI credits'], ['grow', 'Grow', '$249', '3 office · 10 field seats · 2,000 AI credits · Design Studio seat'], ['pro', 'Pro', '$529', '8 office · 30 field seats · 6,000 AI credits · 3D']];
  var main = '<div style="padding:16px"><p class="eyebrow">Rootline for landscape companies</p><h3 style="font-family:var(--font-display);font-size:1.4rem;margin:4px 0 10px">Pick a plan. Switch any time.</h3><div class="tiers3">' + tiers.map(function (t) { return '<button type="button" class="tier' + (S.tier === t[0] ? ' sel' : '') + '" data-act="tier" data-v="' + t[0] + '" data-k="t' + t[0] + '"><b>' + t[1] + '</b><span class="p">' + t[2] + '<span class="tiny faint">/mo, annual</span></span><span class="tiny">' + t[3] + '</span></button>'; }).join('') + '</div>' +
    '<div class="wt-cols mt10"><div class="panel soft tiny">Payments run on <b>your own Stripe account</b>, with zero markup by default. Snow Lite is included in every plan. Migration concierge is free on annual Grow.</div><div class="panel"><label class="fld">Company<input class="inp" value="Riverbend Lawn &amp; Landscape" readonly></label><label class="fld mt6">Work email<input class="inp" value="dan@riverbendlawn.com" readonly></label><button type="button" class="btn primary mt10">Start free trial</button></div></div></div>';
  return browser('rootline.com/pricing', main, 'Rootline pricing and signup');
};
WT.actions.tier = function (el, S) { S.tier = el.getAttribute('data-v'); };
WT.bts['o01-signup'] = function (S) {
  return {
    what: 'The tiers follow company size: Starter for 1-6 people, Grow for the core 5-25 person design-build-maintain firm, Pro for 20-80 people. Dan picks Grow. Seats count only active field staff, so seasonal crews don\'t cost money in winter. The trial creates a tenant with a sample-data sandbox next to his real account.',
    agents: [['Signup', 'Tenant creation, fraud screening, trial', 1]],
    trace: [{ c: 'tenant.create(Riverbend)', r: 'trial · plan ' + S.tier, ms: '300 ms', det: true }, { c: 'risk.screen(signup)', r: 'pass: business domain, Michigan LLC found', ms: '600 ms', det: true }, { c: 'sandbox.seed(Greenleaf sample data, West Michigan)', r: 'ready', ms: '2.1 s', det: true }],
    hitl: [['Dan', 'chooses the plan; no card needed for the trial.']],
    tags: [['mvp', 'Starter, Grow, Pro; active field seats; trials; sample-data sandbox']],
    specs: 'Spec: 22 §4.2 (tiers), §4.6 (trials) · 19 (signup fraud screening) · 21 (sandbox)'
  };
};

/* o02 */
WT.screens['o02-setup'] = function (S) {
  var svc = [['mow', 'Mowing and maintenance'], ['lawn', 'Lawn programs (fertilizer and weed control)'], ['install', 'Landscape installs'], ['snow', 'Snow Lite (included)'], ['irr', 'Irrigation']];
  var main = '<div class="apphead"><h3>Set up Riverbend</h3>' + pill('info', 'Step 2 of 6') + '</div>' +
    '<div class="wt-cols"><div class="wt-stack"><div class="panel"><h4>Your area</h4><dl class="kv"><dt>Address</dt><dd>1420 Leonard St NW, Grand Rapids</dd><dt>Region</dt><dd>West Michigan ' + pill('ok', 'Excellent coverage') + '</dd><dt>Hardiness</dt><dd>USDA zone 6a-6b (2023 map); Region spans 5b-6b</dd><dt>Notes</dt><dd>Lake-effect snow belt; salt-tolerant palettes on</dd></dl></div>' +
    '<div class="panel"><h4>Chart of accounts</h4><div class="seg">' + [['maint-install-snow', 'Maintenance + installs + snow'], ['maint', 'Maintenance only']].map(function (c) { return '<button type="button" data-act="coa" data-v="' + c[0] + '" data-k="c' + c[0] + '" aria-pressed="' + (S.coa === c[0]) + '">' + c[1] + '</button>'; }).join('') + '</div><div class="wt-note mt6">Landscape template with divisions; QuickBooks history maps onto it in the import step.</div></div></div>' +
    '<div class="panel"><h4>Service lines</h4>' + svc.map(function (x) { return '<label class="check" style="margin-bottom:6px"><input type="checkbox" data-in="svc" data-v="' + x[0] + '" data-k="sv' + x[0] + '"' + (S.svc[x[0]] ? ' checked' : '') + '><span>' + x[1] + '</span></label>'; }).join('') + '<div class="wt-note">Each line adds its own schedules, price book items and portal views. Irrigation can be turned on later.</div></div></div>';
  return browser('app.rootline.com/t/riverbend/setup', shellR('Settings', main, { trial: true }), 'Riverbend setup wizard');
};
WT.actions.coa = function (el, S) { S.coa = el.getAttribute('data-v'); };
WT.inputs.svc = function (el, S) { S.svc[el.getAttribute('data-v')] = el.checked; };
WT.bts['o02-setup'] = function (S) {
  return {
    what: 'The address puts Riverbend in the West Michigan Region, one of the six Great Lakes launch Regions with excellent Plant KB coverage, so its plant picker, palettes and care guides are local from day one. Service lines turn modules on, and a landscape chart-of-accounts template sets up the books by division.',
    agents: [['Setup wizard', 'Region lookup, modules, ledger template', 1]],
    trace: [{ c: 'region.lookup(1420 Leonard St NW)', r: 'West Michigan · zones 5b-6b · lake-effect belt', ms: '120 ms', det: true }, { c: 'modules.enable', r: Object.keys(S.svc).filter(function (k) { return S.svc[k]; }).join(', '), ms: '40 ms', det: true }, { c: 'ledger.template(' + S.coa + ')', r: 'chart of accounts created', ms: '200 ms', det: true }],
    hitl: [['Dan', 'confirms each setting; all can change later.']],
    tags: [['mvp', 'setup wizard, Region detection, service-line modules, chart-of-accounts templates']],
    specs: 'Spec: 21 (onboarding wizard) · 12 (Regions, Wave 1) · 14 §4.0 (modules) · 09 (CoA templates)'
  };
};

/* o03 */
WT.screens['o03-stripe'] = function (S) {
  var steps = ['Riverbend clicks Connect', 'Signs in on Stripe\'s own page and approves', 'Rootline checks capabilities'];
  var main = '<div class="apphead"><h3>Get paid</h3>' + pill('info', 'Step 3 of 6') + '</div>' +
    '<div class="wt-cols"><div class="panel"><h4>' + ic('card') + ' Connect your Stripe account</h4><p class="tiny muted">You already have a Stripe account from Jobber Payments? Riverbend\'s past processor account stays with that vendor; this connects an account <b>you</b> own. No account yet? Stripe creates one in a few minutes.</p>' +
    '<div class="wt-steps mt10">' + steps.map(function (t, i) { return '<span class="' + (S.stripe > i ? 'done' : S.stripe === i ? 'on' : '') + '">' + t + '</span>'; }).join('') + '</div>' +
    (S.stripe < 3 ? '<button type="button" class="btn primary mt10" data-act="stripe" data-k="stripe">' + ['Connect with Stripe', 'Continue on Stripe\'s page (simulated)', 'Check capabilities'][S.stripe] + '</button>' : '<div class="toast mt10">' + ic('check') + 'Connected: acct_1Rb…9Kx · cards, ACH and payouts enabled</div>') + '</div>' +
    '<div class="panel soft"><h4>' + ic('shield') + ' Whose money is it?</h4><ul style="margin:0;padding-left:18px;font-size:.78rem;color:var(--text-2);display:grid;gap:4px"><li>Client payments go straight to Riverbend\'s Stripe account and pay out to its bank.</li><li>Riverbend owns the account, the dashboard, disputes and payouts, and keeps saved cards if it ever leaves Rootline.</li><li>Rootline charges no markup on processing by default.</li><li>Rootline\'s staff can see account health, never move funds.</li></ul></div></div>';
  return browser('app.rootline.com/t/riverbend/setup/payments', shellR('Settings', main, { trial: true }), 'Riverbend: connect Stripe');
};
WT.actions.stripe = function (el, S) { S.stripe = Math.min(3, S.stripe + 1); };
WT.ensure['o03-stripe'] = function (S) { S.stripe = 3; };
WT.bts['o03-stripe'] = function (S) {
  return {
    what: 'Bring-your-own Stripe: Riverbend connects an account it owns through Stripe Connect. Rootline creates charges directly on that account, so funds never pass through Rootline. After connecting, Rootline checks the account\'s capabilities and keeps monitoring its health.',
    agents: [['Payments connection', 'Stripe Connect onboarding and capability checks', 1]],
    trace: [{ c: 'stripe.connect.authorize', r: S.stripe >= 2 ? 'approved on Stripe\'s page' : 'waiting', ms: S.stripe >= 2 ? '—' : '', det: true, pending: S.stripe < 2 }, { c: 'stripe.account.capabilities', r: S.stripe >= 3 ? 'card_payments, us_bank_account_ach, payouts: active' : '', ms: S.stripe >= 3 ? '400 ms' : '', det: true, pending: S.stripe < 3 }, { c: 'webhooks.register(connected account)', r: S.stripe >= 3 ? 'events flowing' : '', ms: S.stripe >= 3 ? '200 ms' : '', det: true, pending: S.stripe < 3 }],
    hitl: [['Dan', 'approves the connection on Stripe\'s own page; he can disconnect from either side.']],
    tags: [['mvp', 'Stripe Connect onboarding (own account), capability checks, health monitoring']],
    specs: 'Spec: 08 §4.1-4.2 (connection options, onboarding) · 24 OD-17 (Accounts v2 vs controller properties)'
  };
};

/* o04 */
WT.screens['o04-migrate'] = function (S) {
  var map = [['Client name', 'Client'], ['Service street 1', 'Property address'], ['Visit frequency', 'Agreement recurrence'], ['Line item: "Weekly Mow"', 'Price book: Weekly mowing'], ['Tags: "salt"', 'Snow Lite site list']];
  var main = '<div class="apphead"><h3>Bring your data</h3>' + pill('info', 'Step 4 of 6') + '</div><div class="wt-cols"><div class="panel"><h4>Jobber export (CSV) and QuickBooks Online</h4>' +
    (S.mapped ? map.map(function (m) { return '<div class="map-row"><span>' + m[0] + '</span><span>' + ic('arrow-r', 's') + '</span><span>' + m[1] + '</span>' + pill('ai', 'AI · 0.9+') + '</div>'; }).join('') : '<button type="button" class="btn ai" data-act="mapped" data-k="mapped">' + ic('spark') + 'Map my fields</button>') +
    (S.mapped ? (S.dry ? '<dl class="kv mt10"><dt>Clients</dt><dd>312 (7 duplicates merged)</dd><dt>Properties</dt><dd>341</dd><dt>Agreements</dt><dd>286 recurring jobs → agreements</dd><dt>Invoices</dt><dd>1,914 (last 24 months)</dd><dt>Open AR</dt><dd class="num">$18,233.40 = QuickBooks $18,233.40 ' + pill('ok', 'Matched') + '</dd></dl>' : '<button type="button" class="btn sm mt10" data-act="dry" data-k="dry">Run a dry run</button>') : '') + '</div>' +
    '<div class="wt-stack">' + (S.dry ? (S.commit ? '<div class="toast">' + ic('check') + 'Imported. You can roll back everything for 72 hours.</div>' : '<div class="panel"><h4>Warnings (3)</h4><ul style="margin:0;padding-left:18px;font-size:.78rem;color:var(--text-2)"><li>2 clients have no service address; imported as billing-only</li><li>14 inactive services from 2023 skipped</li><li>QuickBooks has 3 open credits; brought in as customer credits</li></ul><button type="button" class="btn sm primary mt10" data-act="commit" data-k="commit">Import for real</button></div>') : '') +
    '<div class="panel soft tiny">Saved cards stay in Jobber\'s processor and can\'t be copied by Rootline; autopay clients get a one-tap request to re-add a card on Riverbend\'s own Stripe account ' + tag('v1') + '.</div></div></div>';
  return browser('app.rootline.com/t/riverbend/setup/import', shellR('Settings', main, { trial: true }), 'Riverbend: migration');
};
WT.actions.mapped = function (el, S) { S.mapped = true; };
WT.actions.dry = function (el, S) { S.dry = true; };
WT.actions.commit = function (el, S) { S.commit = true; };
WT.ensure['o04-migrate'] = function (S) { S.mapped = true; S.dry = true; S.commit = true; };
WT.bts['o04-migrate'] = function (S) {
  return {
    what: 'Switching is the biggest fear, so migration is a product, not a services project. Rootline reads the competitor\'s own export as-is, AI suggests field mappings, a dry run shows exactly what will be created, open receivables reconcile to QuickBooks to the cent, and the whole import can be rolled back for 72 hours.',
    agents: [['Migration Center', 'Staged import, validation, rollback', 1], ['Field mapping', 'AI-suggested mappings with confidence', 0]],
    trace: [{ c: 'import.parse(jobber_export.zip)', r: '312 clients, 341 properties, 1,914 invoices', ms: '4.2 s', det: true }, { c: 'mapping.suggest', r: S.mapped ? '41 fields mapped, 3 need review' : 'waiting', ms: S.mapped ? '3.0 s' : '', pending: !S.mapped }, { c: 'import.dry_run + ar.reconcile(QuickBooks)', r: S.dry ? '$18,233.40 = $18,233.40' : '', ms: S.dry ? '11 s' : '', det: true, pending: !S.dry }, { c: 'import.commit (rollback 72 h)', r: S.commit ? 'done' : '', ms: S.commit ? '38 s' : '', det: true, pending: !S.commit }],
    hitl: [['Dan', 'reviews the dry run and commits; Rootline\'s migration team watches the queue.']],
    creditNote: 'Migration mapping is included; it doesn\'t use Riverbend\'s credits.',
    tags: [['mvp', 'Migration Center: CSV, Jobber and QuickBooks Online importers, dry run, AR reconciliation, rollback'], ['v1', 'card re-collection campaign for autopay clients (payment method continuity)']],
    specs: 'Spec: 19 PA-020-PA-023 (Migration Center, payment method continuity) · 09 (QuickBooks migration, opening balances) · 08 (card portability)'
  };
};

/* o05 */
WT.screens['o05-crew'] = function (S) {
  var crew = [['Héctor Salas', 'crew lead', 'es'], ['Ben Hollis', 'crew lead', 'en'], ['Rosa Díaz', 'technician', 'es'], ['Tyler Webb', 'technician', 'en'], ['Minh Nguyen', 'technician', 'en'], ['Jake Porter', 'technician', 'en']];
  var main = '<div class="apphead"><h3>Prices and people</h3>' + pill('info', 'Step 5 of 6') + '</div><div class="wt-cols"><div class="panel"><h4>Starter price book · West Michigan</h4><table class="data tight"><tbody><tr><td>Weekly mowing (by turf band)</td><td class="num">$55-$95</td></tr><tr><td>Spring cleanup</td><td class="num">from $190</td></tr><tr><td>Mulch top-dress per yd³ installed</td><td class="num">$118</td></tr><tr><td>Snow Lite: plow per push (driveway)</td><td class="num">$45</td></tr></tbody></table><div class="wt-note mt6">Prices imported from Jobber win where they exist; starter prices fill the gaps. 6 Quick Quote templates ready.</div></div>' +
    '<div class="panel"><h4>Invite the crew</h4><ul class="wt-list">' + crew.map(function (c) { return '<li class="wt-row soft"><span class="wt-ic">' + ic('user') + '</span><span>' + c[0] + '<span class="sub">' + c[1] + '</span></span>' + pill('', c[2] === 'es' ? 'Español' : 'English') + '</li>'; }).join('') + '</ul>' + (S.invited ? '<div class="okline mt6">' + ic('check') + '6 invites sent by text, each in the person\'s language</div>' : '<button type="button" class="btn sm primary mt6" data-act="invite" data-k="invite">Send invites by text</button>') +
    '<div class="wt-note mt6">Texting registration (10DLC) for Riverbend\'s number: ' + (S.tdl ? 'submitted, usually approved in a few days' : '<button type="button" class="btn xs" data-act="tdl" data-k="tdl">Start registration</button>') + '</div></div></div>';
  return browser('app.rootline.com/t/riverbend/setup/team', shellR('Settings', main, { trial: true }), 'Riverbend: price book and crew');
};
WT.actions.invite = function (el, S) { S.invited = true; };
WT.actions.tdl = function (el, S) { S.tdl = true; };
WT.ensure['o05-crew'] = function (S) { S.invited = true; S.tdl = true; };
WT.bts['o05-crew'] = function (S) {
  return {
    what: 'A Region-specific starter price book and Quick Quote templates fill the gaps the import left. Crew members get an invite by text in their own language, with a PIN for the shared tablet. Rootline starts the carrier registration for business texting (10DLC) right away, because it takes days.',
    agents: [['Setup', 'Price book merge, invites, 10DLC', 1]],
    trace: [{ c: 'pricebook.merge(imported, starter West Michigan)', r: '84 items: 61 imported, 23 starter', ms: '300 ms', det: true }, { c: 'invite.sms(×6)', r: S.invited ? '2 Spanish, 4 English' : 'waiting', ms: S.invited ? '1.1 s' : '', det: true, pending: !S.invited }, { c: 'tenDLC.register(brand, campaign)', r: S.tdl ? 'submitted to the carrier registry' : 'not started', ms: S.tdl ? '2.4 s' : '', det: true, pending: !S.tdl }],
    hitl: [['Dan', 'reviews prices and invites; Rootline handles the registration paperwork.']],
    tags: [['mvp', 'starter price books, Quick Quote templates, bilingual crew onboarding, managed 10DLC registration']],
    specs: 'Spec: 03 PB-01, EST-11 · 02 (seasonal onboarding) · 16 (10DLC) · 19 §4.10 (comms ops)'
  };
};

/* o06 */
WT.screens['o06-firstwin'] = function (S) {
  var chk = [['Plan chosen', true], ['Region and service lines', true], ['Stripe connected', true], ['Clients and history imported', true], ['Crew invited', true], ['Send a first quote', S.qq]];
  var main = '<div class="apphead"><h3>Getting started</h3>' + pill(S.qq ? 'ok' : 'info', S.qq ? 'Done' : '5 of 6') + '</div><div class="wt-cols"><div class="panel"><h4>Checklist</h4><ul class="wt-list">' + chk.map(function (c) { return '<li class="wt-row' + (c[1] ? ' soft' : '') + '"><span class="wt-ic ' + (c[1] ? 'ok' : '') + '">' + ic(c[1] ? 'check' : 'arrow-r') + '</span><span>' + c[0] + '</span><span></span></li>'; }).join('') + '</ul></div>' +
    '<div class="panel"><h4>First quote</h4><dl class="kv"><dt>Client</dt><dd>Hannah Olsen (imported)</dd><dt>Template</dt><dd>Weekly mowing</dd><dt>Turf</dt><dd>5,880 sq ft (aerial)</dd><dt>Price</dt><dd class="num">$62 a visit</dd></dl>' + (S.qq ? '<div class="toast mt10">' + ic('check') + 'Sent by text 1 min 52 s after opening. Welcome to Rootline!</div>' : '<button type="button" class="btn primary mt10" data-act="qq" data-k="qq">Send the quote</button>') + '</div></div>';
  return browser('app.rootline.com/t/riverbend/today', shellR('Today', main, { trial: true }), 'Riverbend: first win');
};
WT.actions.qq = function (el, S) { S.qq = true; };
WT.ensure['o06-firstwin'] = function (S) { S.qq = true; };
WT.bts['o06-firstwin'] = function (S) {
  return {
    what: 'Activation is measured by a first real result, not by setup screens. For a maintenance company that\'s a quote sent to a real client; Rootline\'s analytics track time to this first win for every new tenant.',
    agents: [['Activation tracking', 'First-win events per tenant', 1]],
    trace: [{ c: 'proposal.send(first)', r: S.qq ? 'sent' : 'waiting', ms: S.qq ? '300 ms' : '', det: true, pending: !S.qq }, { c: 'analytics.activation(Riverbend)', r: S.qq ? 'first win on day 1' : '', ms: '', det: true, pending: !S.qq }],
    hitl: [['Dan', 'sends it.']],
    tags: [['mvp', 'setup checklist, first-win tracking']],
    specs: 'Spec: 21 (onboarding, first win) · 19 §4.14 (activation funnel)'
  };
};

/* o07 */
WT.screens['o07-tenant'] = function (S) {
  var main = '<div class="apphead"><span class="crumb">Tenants</span><h3>Riverbend Lawn &amp; Landscape · TNT-61044</h3>' + pill('info', 'trial · day 3 of 14') + pill('', 'West Michigan') + '</div>' +
    '<div class="wt-kpis"><div class="wt-kpi"><div class="l">Health</div><div class="v">78</div><div class="d">imported, first win, crew invited</div></div><div class="wt-kpi"><div class="l">Plan</div><div class="v">Grow</div><div class="d">annual at conversion</div></div><div class="wt-kpi"><div class="l">Seats</div><div class="v">2 · 6</div><div class="d">office · field</div></div><div class="wt-kpi"><div class="l">AI credits</div><div class="v">24</div><div class="d">of 2,000</div></div></div>' +
    '<div class="wt-cols mt10"><div class="panel"><h4>Connected Stripe account</h4><dl class="kv"><dt>Charges</dt><dd>' + pill('ok', 'enabled') + '</dd><dt>Payouts</dt><dd>' + pill('ok', 'enabled') + '</dd><dt>Disputes (90 d)</dt><dd>0</dd></dl><div class="wt-note mt6">Health only. The console has no way to see client card data or move funds.</div></div>' +
    '<div class="panel"><h4>Status</h4><dl class="kv"><dt>Migration</dt><dd>MIG-2291 committed · rollback window 69 h</dd><dt>10DLC</dt><dd>' + pill('warn', 'pending carrier review') + '</dd><dt>Support access</dt><dd>' + pill('', 'none granted') + '</dd><dt>Client data</dt><dd>counts only, no names or addresses</dd></dl></div></div>';
  return browser('console.rootline.internal/tenants/TNT-61044', consoleShell('Tenants', main), 'Operator console: Tenant 360');
};
WT.bts['o07-tenant'] = function (S) {
  return {
    what: 'The operator console is a glass box, not god mode. You see each tenant\'s lifecycle, health score and the drivers behind it, migration status, connected-account health and texting registration, but only counts and statuses, never client names, addresses or money movement. Reading real tenant data needs the tenant\'s consent (next step).',
    agents: [['Operator console', 'Tenant directory, Tenant 360, health score', 1]],
    trace: [{ c: 'tenant.health(TNT-61044)', r: '78: import done, first win, crew invited; 10DLC pending', ms: '200 ms', det: true }, { c: 'stripe.account.health(connected)', r: 'charges and payouts enabled', ms: '150 ms', det: true }],
    hitl: [['You', 'watch; staff actions are audited and reason-coded.']],
    tags: [['mvp', 'tenant directory, Tenant 360, health score, payments oversight without access to funds']],
    specs: 'Spec: 19 PA-010-PA-013, PA-110 · 02 (platform staff permissions)'
  };
};

/* o08 */
WT.screens['o08-support'] = function (S) {
  var tenant = '<p class="ptitle">Access request</p><p class="psub">From Rootline support</p><div class="pcard"><dl class="kv"><dt>Who</dt><dd>Maya R., Rootline support</dd><dt>Why</dt><dd>"Your QuickBooks AR shows $18,233.40 but one client looks wrong"</dd><dt>Scope</dt><dd>Read only · migration records</dd><dt>For</dt><dd>72 hours</dd></dl></div>' + (S.grant ? '<div class="toast">' + ic('check') + 'Granted. You can end it any time and see everything they view.</div>' : '<button type="button" class="btn primary" data-act="grant" data-k="grant" style="justify-content:center">Allow read-only access</button><button type="button" class="btn" style="justify-content:center">Decline</button>');
  var cons = '<div class="apphead"><span class="crumb">Support › Ticket 8812</span><h3>Riverbend · AR question</h3></div>' + (S.grant ? '<div class="imp-banner">' + ic('eye') + 'Viewing as Riverbend · read-only · migration records · 71:58 left <span style="flex:1"></span><button type="button" class="btn xs">End session</button></div>' : '<div class="wt-callout warn">Access needed: request sent to Dan Mercer (owner). Nothing in Riverbend\'s account is visible yet.</div>') +
    (S.grant ? '<div class="panel mt10"><h4>Finding</h4><p class="tiny">Client "Olsen, H." was imported twice (once from Jobber, once from QuickBooks) with an $86.00 open invoice on each. Merge suggested to Dan; AR matches after the merge.</p></div><div class="panel soft mt6"><h4>Access log (visible to Riverbend)</h4><ul style="margin:0;padding-left:18px;font-size:.74rem;color:var(--text-2)"><li>Maya R. opened migration MIG-2291 · reason: ticket 8812</li><li>Maya R. viewed client "Olsen, H." (2 records)</li></ul></div>' : '');
  return withPhone(browser('console.rootline.internal/support/8812', consoleBar() + '<div style="padding:14px">' + cons + '</div>', 'Operator console: support'), phone(tenant, { brand: 'Rootline', sub: 'Riverbend · Dan Mercer', logo: 'leaf', label: 'Tenant owner phone: access request' }));
};
WT.actions.grant = function (el, S) { S.grant = 'read_only'; };
WT.ensure['o08-support'] = function (S) { S.grant = 'read_only'; };
WT.bts['o08-support'] = function (S) {
  return {
    what: 'Support can\'t open a tenant\'s data on its own. Maya requests a Support Access Grant with a scope, a reason and a time limit; the tenant owner approves it in the app; the session runs under a visible banner; and every view lands in an access log the tenant can read. Emergencies use break-glass access, which needs two staff approvals and notifies the tenant.',
    agents: [['Support access', 'Scoped, time-boxed grants with tenant consent', 1]],
    trace: [{ c: 'support.grant.request(read_only, migration, 72 h)', r: 'sent to Dan', ms: '—', det: true }, { c: 'support.grant.approve(Dan)', r: S.grant ? 'approved' : 'waiting', ms: S.grant ? 'human' : '', human: !S.grant }, { c: 'audit.log(tenant-visible)', r: S.grant ? '2 entries' : '', ms: '', det: true, pending: !S.grant }],
    hitl: [['Dan', 'grants or declines, and can end the session.'], ['You', 'approve break-glass with a second staff member if ever needed.']],
    tags: [['mvp', 'tenant-approved support access, banner, tenant-visible access log, break-glass']],
    specs: 'Spec: 19 PA-050-PA-054 · 02 §5.13 (support access) · 20 (audit)'
  };
};

/* o09 */
WT.screens['o09-kb'] = function (S) {
  var rows = [['Aronia melanocarpa \'Low Scape Mound\'', 'salt tolerance (soil)', 'unknown', 'moderate', 0.86], ['Rhus aromatica \'Gro-Low\'', 'salt tolerance (spray)', 'unknown', 'high', 0.91], ['Juniperus horizontalis \'Blue Chip\'', 'salt tolerance (spray)', 'moderate', 'high', 0.88]];
  var main = '<div class="apphead"><span class="crumb">Plant KB › Curator queue</span><h3>Region: West Michigan · deicing-salt tolerance</h3>' + pill('ai', 'KB Curation agent (A26) drafts') + '</div>' +
    '<div class="panel"><table class="data tight"><thead><tr><th>Plant</th><th>Field</th><th>Change</th><th class="num">Conf.</th><th></th></tr></thead><tbody>' + rows.map(function (r, i) { var st = S.kb[i]; return '<tr><td><i>' + r[0] + '</i></td><td>' + r[1] + '</td><td class="field-diff"><span class="old">' + r[2] + '</span> → <span class="new">' + r[3] + '</span><span class="sub" style="display:block;color:var(--text-3)">2 sources cited · extension salt list, arboretum</span></td><td class="num">' + r[4].toFixed(2) + '</td><td>' + (st ? pill(st === 'acc' ? 'ok' : '', st === 'acc' ? 'Accepted' : 'Edited') : '<span class="flex" style="gap:3px;flex-wrap:nowrap"><button type="button" class="btn xs primary" data-act="kbAcc" data-v="' + i + '" data-k="kb' + i + '">Accept</button><button type="button" class="btn xs" data-act="kbEdit" data-v="' + i + '" data-k="ke' + i + '">Edit</button></span>') + '</td></tr>'; }).join('') + '</tbody></table></div>' +
    '<div class="wt-cols mt10"><div class="panel"><h4>Regional rating session · West Michigan</h4><p class="tiny muted">3 raters (2 local nursery growers, 1 extension horticulturist) rated 40 shrubs for lake-effect sites.</p>' + (S.rating ? '<div class="okline">' + ic('check') + '38 ratings published; 2 held for a second source</div>' : '<button type="button" class="btn sm" data-act="rating" data-k="rating">Close the session</button>') + '</div>' +
    '<div class="panel"><h4>Release</h4>' + (S.release ? '<div class="toast">' + ic('check') + 'KB release published: 43 changes, changelog sent to tenants</div>' : '<button type="button" class="btn sm primary" data-act="release" data-k="release">Publish release</button>') + '</div></div>';
  return browser('console.rootline.internal/plant-kb/queue', consoleShell('Plant KB', main), 'Operator console: plant curation');
};
WT.actions.kbAcc = function (el, S) { S.kb[el.getAttribute('data-v')] = 'acc'; };
WT.actions.kbEdit = function (el, S) { S.kb[el.getAttribute('data-v')] = 'edit'; };
WT.actions.rating = function (el, S) { S.rating = true; };
WT.actions.release = function (el, S) { S.release = true; };
WT.ensure['o09-kb'] = function (S) { S.kb = { 0: 'acc', 1: 'acc', 2: 'edit' }; S.rating = true; S.release = true; };
WT.bts['o09-kb'] = function (S) {
  return {
    what: 'The Plant Knowledge Base is the operator\'s crown jewel. The KB Curation agent drafts trait values with cited sources and a confidence score; a curator accepts, edits or rejects each field, and critical traits need a second reviewer. Regional rating sessions with local experts set how well a plant does in each Region. Releases ship to every tenant with a changelog.',
    agents: [['KB Curation (A26)', 'Drafts traits and region profiles with citations [V1 self-serve]', 0], ['Curation workflow', 'Review queue, provenance, releases', 1]],
    trace: [{ c: 'agent.A26.enrich(400 Great Lakes shrubs, salt tolerance)', r: '312 drafts with citations', ms: '14 min' }, { c: 'review.decide(Maria)', r: Object.keys(S.kb).length + ' of 3 shown decided', ms: '—', det: true, human: Object.keys(S.kb).length < 3 }, { c: 'rating_session.close(West Michigan)', r: S.rating ? '38 published, 2 held' : 'open', ms: '', det: true, pending: !S.rating }, { c: 'kb.release_published', r: S.release ? '43 changes' : 'not yet', ms: S.release ? '1.2 s' : '', det: true, pending: !S.release }],
    hitl: [['Maria Ortiz', 'reviews every field; no AI draft is published without a curator.']],
    creditNote: 'Platform-side AI is Rootline\'s cost, not tenant credits.',
    tags: [['mvp', 'curator workflow, region builder, rating sessions, releases, seed pipeline'], ['v1', 'self-serve AI enrichment queue']],
    specs: 'Spec: 12 §4.4-4.5, §5.2, KB-SEED · 19 §4.7 (Plant KB operations) · 17 (A26)'
  };
};

/* o10 */
WT.screens['o10-aiops'] = function (S) {
  var routes = [['restyle.preview', 'Image editing model A', 'Model B', '0.91', '$0.034'], ['layout.plan', 'Claude, mid tier + solver', 'Claude, top tier', '0.88', '$0.062'], ['copilot.chat', 'Claude, small or mid tier', 'mid tier', '0.94', '$0.004'], ['inbox.classify', 'Claude, small tier', '—', '0.97', '$0.001']];
  var main = '<div class="apphead"><span class="crumb">AI Ops</span><h3>Model routing and economics</h3><span class="sp"></span>' + pill('ok', 'AI gross margin 71%') + '</div>' +
    '<div class="panel"><table class="data tight"><thead><tr><th>Task</th><th>Primary</th><th>Fallback</th><th class="num">Eval score</th><th class="num">Cost / call</th><th></th></tr></thead><tbody>' + routes.map(function (r, i) { var off = S.kill && i === 0; return '<tr><td class="mono tiny">' + r[0] + '</td><td>' + (off ? '<s>' + r[1] + '</s>' : r[1]) + '</td><td>' + (off ? '<b>' + r[2] + '</b> (active)' : r[2]) + '</td><td class="num">' + r[3] + '</td><td class="num">' + r[4] + '</td><td>' + (i === 0 ? (off ? pill('warn', 'Killed') : '<button type="button" class="btn xs" data-act="kill" data-k="kill">Kill switch</button>') : '') + '</td></tr>'; }).join('') + '</tbody></table>' +
    '<div class="wt-note mt6">New prompts and models ship only after passing the golden-set evaluation gates (for mockups: plant identity, house preservation, scale).</div></div>' +
    (S.kill ? '<div class="wt-callout warn mt10">Model A disabled for all tenants in 4 seconds after a quality alert; traffic moved to Model B. Tenants see no error, only a slightly slower render.</div>' : '');
  return browser('console.rootline.internal/ai-ops', consoleShell('AI Ops', main), 'Operator console: AI operations');
};
WT.actions.kill = function (el, S) { S.kill = true; };
WT.bts['o10-aiops'] = function (S) {
  return {
    what: 'Every AI call goes through the AI Gateway, which routes each task to a model with a fallback, meters cost per tenant against the credits charged, and enforces evaluation gates before new prompts or models go live. A kill switch can take a model out of service for everyone in seconds.',
    agents: [['AI Gateway', 'Routing, metering, caching, evals, kill switches', 1]],
    trace: [{ c: 'gateway.routes', r: '4 task routes shown (of 31)', ms: '—', det: true }, { c: 'eval.gate(restyle.preview, golden set)', r: 'passed: plant identity 0.91', ms: '—', det: true }, { c: 'route.kill(restyle.preview primary)', r: S.kill ? 'disabled; fallback active in 4 s' : 'available', ms: S.kill ? '4 s' : '', det: true, pending: !S.kill }],
    hitl: [['You', 'approve routing changes; kill switches can be pulled by on-call staff and are audited.']],
    tags: [['mvp', 'AI Gateway routing, prompt registry, eval release gates, cost per tenant, kill switches']],
    specs: 'Spec: 19 §4.9 (AI operations) · 20 §4.13 (AI Gateway) · 11 §8.2, §8.7'
  };
};

/* o11 */
WT.screens['o11-billing'] = function (S) {
  var main = '<div class="apphead"><span class="crumb">Billing</span><h3>Subscriptions on Rootline\'s own Stripe account</h3></div><div class="wt-cols"><div class="wt-stack">' +
    '<div class="panel"><h4>Riverbend · trial day 14</h4>' + (S.converted ? '<div class="okline">' + ic('check') + 'Converted to Grow, annual: $249/mo billed yearly ($2,988)</div>' : '<button type="button" class="btn sm primary" data-act="convert" data-k="convert">Simulate Dan converting</button>') +
    (S.converted ? '<div class="mt6">' + (S.pack ? '<div class="okline">' + ic('check') + 'Bought 1,000 AI credits for $25 (lasts 12 months)</div>' : '<button type="button" class="btn sm" data-act="pack" data-k="pack">Simulate a credit pack purchase</button>') + '</div>' : '') + '</div>' +
    '<div class="panel"><h4>Buckeye Turf and Tree · Winter Mode ' + tag('v1') + '</h4><p class="tiny muted">Monthly plan, slow season: the base price drops to 25% of list for up to 4 months in any 12. The field app is off except Snow Lite; invoicing, autopay, the portal and client payments stay on.</p>' + (S.winter ? '<div class="okline">' + ic('check') + 'Winter Mode Jan-Mar; resumes with one click, prorated</div>' : '<button type="button" class="btn sm" data-act="winter" data-k="winter">Apply Winter Mode</button>') + '</div></div>' +
    '<div class="panel soft"><h4>Two Stripe worlds, kept apart</h4><ul style="margin:0;padding-left:18px;font-size:.78rem;color:var(--text-2);display:grid;gap:4px"><li><b>Rootline\'s own Stripe account</b> bills companies for their subscription, seats and credit packs.</li><li><b>Each company\'s own Stripe account</b> collects from its clients. Rootline never holds those funds.</li><li>A company that stops paying Rootline can still collect from its own clients; dunning never blocks client payments.</li></ul></div></div>';
  return browser('console.rootline.internal/billing', consoleShell('Billing', main), 'Operator console: SaaS billing');
};
WT.actions.convert = function (el, S) { S.converted = true; };
WT.actions.pack = function (el, S) { S.pack = true; };
WT.actions.winter = function (el, S) { S.winter = true; };
WT.ensure['o11-billing'] = function (S) { S.converted = true; S.pack = true; S.winter = true; };
WT.bts['o11-billing'] = function (S) {
  return {
    what: 'Rootline bills its own customers with Stripe Billing on Rootline\'s own account: plans, active-seat counts, credit packs and seasonal Winter Mode. That account is completely separate from the companies\' own accounts, and dunning on Rootline\'s side never stops a company from getting paid by its clients.',
    agents: [['SaaS billing', 'Stripe Billing on the platform account; entitlements', 1]],
    trace: [{ c: 'subscription.convert(Riverbend, grow, annual)', r: S.converted ? '$2,988 invoiced' : 'trial', ms: S.converted ? '800 ms' : '', det: true, pending: !S.converted }, { c: 'credits.pack(1,000)', r: S.pack ? '$25 · ledger +1,000' : '', ms: S.pack ? '400 ms' : '', det: true, pending: !S.pack }, { c: 'tenant.winter_mode(Buckeye)', r: S.winter ? 'field seats paused' : '', ms: S.winter ? '200 ms' : '', det: true, pending: !S.winter }],
    hitl: [['You', 'set plans and prices; companies choose their own plan and packs.']],
    tags: [['mvp', 'Stripe Billing on the platform account, plans, seats, credit packs, dunning that never blocks client payments'], ['v1', 'Winter Mode pricing']],
    specs: 'Spec: 19 §4.3 (SaaS billing), PA-012 (lifecycle) · 22 §4.2-4.7 · 08 (two separate Stripe roles)'
  };
};

/* o12 */
WT.screens['o12-recap'] = function (S) {
  return '<div class="wt-cols"><div class="panel"><h4>The company\'s side</h4><ul style="margin:0;padding-left:18px;font-size:.8rem;color:var(--text-2);display:grid;gap:4px"><li>Plan and trial with a sample sandbox</li><li>Region detected; local plants from day one</li><li>Its own Stripe account connected</li><li>Jobber and QuickBooks imported, AR matched to the cent, 72-hour rollback</li><li>Crew invited in their languages; texting registration started</li><li>A first quote sent on day one</li></ul></div>' +
    '<div class="panel"><h4>The operator\'s side</h4><ul style="margin:0;padding-left:18px;font-size:.8rem;color:var(--text-2);display:grid;gap:4px"><li>Health and status without seeing client data or touching funds</li><li>Support only with the tenant\'s consent, logged where the tenant can see it</li><li>Plant KB curated with AI drafts and human review</li><li>AI routed, evaluated, costed and switchable in seconds</li><li>Subscriptions on Rootline\'s own Stripe account, separate from client money</li></ul></div></div>' +
    '<div class="flex mt14"><a class="btn" href="#overview">' + ic('arrow-l') + 'Back to start</a><a class="btn" href="screens-field-client-admin.html#admin-overview">Operator console screens</a><a class="btn primary" href="walkthroughs.html">All walkthroughs ' + ic('arrow-r') + '</a></div>';
};
WT.bts['o12-recap'] = function (S) {
  return {
    what: 'Rootline is built so a new company can switch in a day, and so the platform can be run by a small team without god-mode access: consent for data, no access to funds, AI under evaluation and kill switches, and a curated plant knowledge base that makes every tenant\'s designs local.',
    hitl: [['Dan', 'approved the plan, the Stripe connection, the import and the support access.'], ['You and your staff', 'curated plants, ran AI operations and billing, with every action audited.']],
    creditNote: 'No tenant AI credits were used beyond Riverbend\'s first steps; platform-side AI is Rootline\'s cost.',
    tags: [['mvp', 'nearly everything shown'], ['v1', 'self-serve KB enrichment queue, Winter Mode pricing']],
    specs: 'Spec: 02, 08, 09, 12, 16, 17, 19, 21, 22'
  };
};
