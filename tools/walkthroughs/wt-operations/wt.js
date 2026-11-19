/* Walkthrough: purchasing, inventory, fleet and subcontractors (doc 13, with 03, 04, 05, 09, 12, 17).
   Ledger accounts from doc 09: 2000 AP, 2020 GRNI, 1230 Vendor Claims, 1320 Plants inventory, 5210 Hardscape materials, 5410 Subcontractors. */

function je(rows, note) {
  var d = 0, c = 0;
  var body = rows.map(function (r) { d += r[1] || 0; c += r[2] || 0; return '<tr><td>' + esc(r[0]) + '</td><td class="n">' + (r[1] ? money(r[1], true) : '') + '</td><td class="n">' + (r[2] ? money(r[2], true) : '') + '</td></tr>'; }).join('');
  return '<table class="wt-je"><thead><tr><th>Account</th><th class="n">Debit</th><th class="n">Credit</th></tr></thead><tbody>' + body + '<tr class="tot"><td>' + (note || (Math.abs(d - c) < 0.005 ? 'Balanced' : 'NOT BALANCED')) + '</td><td class="n">' + money(d, true) + '</td><td class="n">' + money(c, true) + '</td></tr></tbody></table>';
}
var OPS_NAV = [['today', 'Today'], ['approve', 'Approvals'], ['clipboard', 'Jobs'], ['box', 'Purchasing'], ['layers', 'Inventory'], ['truck', 'Equipment'], ['building', 'Vendors and subs'], ['bank', 'Money'], ['calendar', 'Schedule'], ['cog', 'Settings']];
function opsShell(active, main, counts) { return appShell(active, main, { nav: OPS_NAV, counts: counts, navLabel: 'Operations navigation (concept)' }); }

/* Delgado patio J-2417 materials (estimate budget $5,042.00). */
var BUY = [
  ['Pavers, tumbled 60 mm, Harvest blend', '640 sq ft + 5% waste', '6 pallets (112 sq ft each)', 'Buy · Buckeye Hardscape Supply', 3427.20, 3500],
  ['#57 stone (base)', '9 tons', '9 t', 'Buy · Scioto Aggregates', 342.00, 360],
  ['Bedding sand', '4 tons', '4 t', 'Buy · Scioto Aggregates', 136.00, 140],
  ['Polymeric sand, tan', '12 bags', '12 bags', 'Buy · Buckeye Hardscape Supply', 384.00, 400],
  ['Paver edge restraint', '110 ft', '11 × 10 ft', 'Buy · Buckeye Hardscape Supply', 104.50, 110],
  ['Hydrangea \'Bobo\' #3', '6', '6', 'Buy · nursery (availability check)', 195.00, 196],
  ['Ilex glabra \'Gem Box\' #3', '8', '8', 'Buy · Maple Hill Nursery', 212.00, 224],
  ['Double-shredded hardwood mulch', '4 yd³', '4 yd³', 'Pull from yard · bunker B2', 112.00, 112]
];

var WT = {
  title: 'Rootline walkthrough: purchasing, inventory, fleet and subcontractors',
  short: 'Purchasing, inventory, fleet and subs',
  ovTitle: 'Purchasing, inventory, fleet and subcontractors',
  startLeft: 4262,
  acts: [
    { n: 'Act 1', t: 'Buy', sub: 'Buy list, workbench, vendor confirmation' },
    { n: 'Act 2', t: 'Receive and store', sub: 'On-site receiving, holding yard, bunkers' },
    { n: 'Act 3', t: 'Equipment and fleet', sub: 'Cost per hour, repairs and service' },
    { n: 'Act 4', t: 'Subs and job cost', sub: 'Compliance gate, sub invoice, the job\'s numbers' }
  ],
  steps: [
    { id: 'op01-buylist', act: 0, short: 'Buy list', title: 'A signed patio becomes a buy list', who: 'Luis Ortega', tags: ['mvp'] },
    { id: 'op02-workbench', act: 0, short: 'Workbench', title: 'The Monday purchasing workbench', who: 'Luis, Procurement agent', ai: true, tags: ['mvp', 'v1'] },
    { id: 'op03-vendor', act: 0, short: 'Vendor confirms', title: 'The vendor confirms the delivery from a link', who: 'Kelly Shaw (vendor), Elena Delgado', tags: ['mvp', 'v1'] },
    { id: 'op04-receive', act: 1, short: 'Receive on site', title: 'Receiving on site with a scale ticket', who: 'Andrés Vega', ai: true, tags: ['mvp'] },
    { id: 'op05-yard', act: 1, short: 'Yard and bunkers', title: 'Plants as living inventory, and the mulch bunker', who: 'Tomás Reyes, Luis', tags: ['mvp', 'v1'] },
    { id: 'op06-rate', act: 2, short: 'Cost per hour', title: 'What a mower really costs per hour', who: 'Erin Castillo, Luis', tags: ['mvp', 'v1'] },
    { id: 'op07-shop', act: 2, short: 'Repairs and service', title: 'A trailer defect is repaired and certified; a mower is due', who: 'Ray Dunn (mechanic)', tags: ['mvp', 'v1'] },
    { id: 'op08-subgate', act: 3, short: 'Sub compliance', title: 'A subcontractor is blocked until its insurance is current', who: 'Tasha Greene, Greg Patterson (sub)', ai: true, tags: ['mvp', 'v1'] },
    { id: 'op09-subpay', act: 3, short: 'Sub invoice', title: 'The sub invoices from the portal with a lien waiver', who: 'Greg, Priya Shah', tags: ['v1'] },
    { id: 'op10-jobcost', act: 3, short: 'Job cost', title: 'Estimate vs committed vs actual for the patio', who: 'Erin, Luis', tags: ['mvp'] },
    { id: 'op11-recap', act: 3, short: 'Recap', title: 'Recap: from design to dump truck', who: 'Everyone', tags: [] }
  ],
  credits: { 'op02-workbench': 14, 'op04-receive': 2, 'op08-subgate': 2 },
  state: { src: {}, built: false, split: '', approved: false, sent: false, ack: false, win: false, ticket: false, damage: false, received: false, water: false, loss: false, count: false, release: false, hours: 800, published: false, cert: false, pm: false, coi: 0, swo: false, inv: false, waiver: false, billOk: false },
  ov: {
    eyebrow: 'Clickable walkthrough · back of the house',
    h: 'The estimate is the demand signal. Every pallet, plant, machine and sub is tracked from the sale to the job\'s profit.',
    lede: 'Greenleaf just sold Elena Delgado a 640 sq ft paver patio. Follow it from the signed proposal to a buy list, consolidated purchase orders on Monday, a vendor confirming a 7 a.m. drop from a link, the crew receiving stone on site with a scale ticket, plants in the holding yard, a mulch bunker count, a mower\'s real cost per hour, a trailer repair, a tree subcontractor blocked by an expired insurance certificate, and the patio\'s estimate vs committed vs actual cost.',
    cast: [
      { h: 'Greenleaf', icon: 'building', items: [['Luis Ortega', 'ops manager, buys and runs the yard'], ['Tasha Greene', 'office manager, PO approvals to $5,000'], ['Andrés Vega', 'Crew 1 lead, installs'], ['Tomás Reyes', 'yard and holding-yard care'], ['Ray Dunn', 'mechanic'], ['Priya Shah', 'bookkeeper'], ['Erin Castillo', 'owner']] },
      { h: 'Outside', icon: 'users', items: [['Elena Delgado', 'client, Upper Arlington'], ['Kelly Shaw', 'Buckeye Hardscape Supply (fictional)'], ['Greg Patterson', 'Tall Oaks Tree Service, subcontractor (fictional)'], ['Maple Hill Nursery', 'plant supplier (fictional)']] },
      { h: 'Agents', icon: 'spark', items: [['Procurement (A21)', 'groups buy lines into draft POs [V1]'], ['Document reading', 'scale tickets and insurance certificates'], ['Rules', 'budget-fit approval, compliance gate, PM triggers']] }
    ],
    extra: '<p class="wt-note mt14">Spring 2027, week of April 19. Prices are illustrative. Vendor and client money never moves through Rootline.</p>'
  },
  screens: {}, bts: {}, actions: {}, inputs: {}, ensure: {}
};

/* op01 */
WT.screens['op01-buylist'] = function (S) {
  var main = '<div class="apphead"><span class="crumb">Jobs › J-2417</span><h3>Delgado patio · buy list</h3>' + pill('ok', 'Proposal signed · deposit paid') + '</div>' +
    '<div class="panel"><table class="data tight"><thead><tr><th>Item (from the estimate)</th><th>Needed</th><th>Buy as</th><th>Sourcing</th><th class="num">Est. cost</th></tr></thead><tbody>' + BUY.map(function (b) { return '<tr><td>' + b[0] + '</td><td>' + b[1] + '</td><td class="tiny">' + b[2] + '</td><td class="tiny">' + (/Pull/.test(b[3]) ? pill('ok', b[3]) : b[3]) + '</td><td class="num">' + money(b[4], true) + '</td></tr>'; }).join('') + '</tbody></table>' +
    '<div class="wt-note mt6">Units convert automatically: square feet to pallets, cubic yards to tons at each material\'s density, plants by container size. Special-order pavers waited for the signed proposal.</div>' +
    (S.built ? '<div class="okline mt6">' + ic('check') + '7 lines sent to Monday\'s workbench; 4 yd³ of mulch reserved in bunker B2</div>' : '<button type="button" class="btn sm primary mt10" data-act="built" data-k="built">Send to the purchasing workbench</button>') + '</div>';
  return browser('app.rootline.com/jobs/J-2417/buy-list', opsShell('Jobs', main), 'Job buy list');
};
WT.actions.built = function (el, S) { S.built = true; };
WT.ensure['op01-buylist'] = function (S) { S.built = true; };
WT.bts['op01-buylist'] = function (S) {
  return {
    what: 'When the proposal is signed, Rootline turns the estimate\'s material and plant lines (which came from the design takeoff) into a buy list with need-by dates from the schedule. Each line gets a sourcing decision: pull from yard stock, release against a blanket PO, or buy from the preferred vendor at the current price list. Non-refundable special orders wait for the signature.',
    agents: [['Buy list (4.8.1)', 'Estimate lines to purchase units and sourcing', 1]],
    trace: [{ c: 'proposal.executed(P-1231)', r: 'job J-2417 created, install week of Apr 19', ms: '—', det: true }, { c: 'buylist.generate(J-2417)', r: '8 lines', ms: '300 ms', det: true }, { c: 'uom.convert(sq ft→pallets, yd³→tons)', r: '640 sq ft + 5% → 6 pallets', ms: '20 ms', det: true }, { c: 'inventory.reserve(mulch, B2, 4 yd³)', r: S.built ? 'reserved' : 'proposed', ms: '40 ms', det: true }],
    hitl: [['Luis', 'can change any sourcing decision before buying.']],
    tags: [['mvp', 'item master and units, buy lists from estimates and takeoffs, reservations, sourcing rules']],
    specs: 'Spec: 13 §4.1.2, §4.8.1, §5.1 · 03 (estimate lines) · 10 (takeoff)'
  };
};

/* op02 */
WT.screens['op02-workbench'] = function (S) {
  var pos = [
    ['COL-PO-004213', 'Scioto Aggregates', 'Tue 7:00 · 2 drops (Delgado, Hendricks)', [['#57 stone 9 t · bedding sand 4 t (Delgado)', 478.00], ['River rock 3 t (Hendricks)', 171.00]], 'auto'],
    ['COL-PO-004214', 'Buckeye Hardscape Supply', 'Tue 7:30 · Delgado driveway', [['Pavers 6 pallets', 3427.20], ['Polymeric sand 12 bags', 384.00], ['Edge restraint 11 × 10 ft', 104.50]], 'approve'],
    ['COL-PO-004215', 'Maple Hill Nursery', 'Mon · holding yard', [['Delgado: 8 Ilex \'Gem Box\', ' + (S.split === 'split' ? '4' : '6') + ' Hydrangea \'Bobo\'', S.split === 'split' ? 340.00 : 404.00], ['Hendricks: 22 shrubs and perennials', 611.50]], 'auto']
  ];
  if (S.split === 'split') pos.push(['COL-PO-004216', 'Oakwood Nursery', 'Mon · holding yard', [['Delgado: 2 Hydrangea \'Bobo\' #3', 67.00]], 'auto']);
  var cards = pos.map(function (p) {
    var tot = p[3].reduce(function (t, l) { return t + l[1]; }, 0);
    var st = p[4] === 'auto' ? pill('ok', 'Auto-approved: budget fit') : (S.approved ? pill('ok', 'Approved by Tasha') : pill('warn', 'Over $2,500: needs Tasha'));
    return '<div class="po-card"><div class="hd"><b>' + p[0] + '</b><span>' + p[1] + '</span><span class="sp" style="flex:1"></span>' + st + '</div><div class="tiny muted">' + p[2] + '</div>' + p[3].map(function (l) { return '<div class="ln"><span>' + l[0] + '</span><span class="num">' + money(l[1], true) + '</span></div>'; }).join('') + '<div class="ln"><b>Total</b><b class="num">' + money(tot, true) + '</b></div></div>';
  }).join('');
  var avail = S.split ? '<div class="okline">' + ic('check') + (S.split === 'split' ? 'Split: 4 from Maple Hill, 2 from Oakwood Nursery (in stock, $33.50 each)' : 'Kept 6 on Maple Hill for Thursday delivery') + '</div>' :
    '<div class="wt-callout warn"><b>Availability:</b> Maple Hill has 4 of 6 Hydrangea \'Bobo\' #3 this week. Oakwood Nursery lists 9 at $33.50.<div class="flex mt6"><button type="button" class="btn xs primary" data-act="split" data-v="split" data-k="split">Split the order</button><button type="button" class="btn xs" data-act="split" data-v="wait" data-k="wait">Wait for Thursday</button></div></div>';
  var main = '<div class="apphead"><span class="crumb">Purchasing › Workbench</span><h3>Week of April 19 · 3 jobs, 1 mulch round</h3>' + aiChip('Drafted by Procurement agent') + '</div>' +
    '<div class="wt-cols wide-left"><div class="wt-stack">' + cards + '</div><div class="wt-stack">' + avail +
    '<div class="panel"><h4>Approvals</h4><div class="tiny">POs from a job\'s buy list approve themselves when every line fits the estimate budget (+10%) and the PO is under $2,500. Luis can approve up to $2,500; PO-004214 goes to Tasha ($5,000 limit).</div>' + (S.approved ? '' : '<button type="button" class="btn sm mt6" data-act="approved" data-k="approved">Approve PO-004214 as Tasha</button>') + '</div>' +
    '<div class="panel">' + (S.sent ? '<div class="okline">' + ic('check') + 'POs sent by email and text with confirmation links</div>' : '<button type="button" class="btn sm primary" data-act="sent" data-k="sent"' + (S.approved && S.split ? '' : ' disabled') + '>Send all POs</button><div class="wt-note mt6">Resolve availability and approval first.</div>') + '</div></div></div>';
  return browser('app.rootline.com/purchasing/workbench', opsShell('Purchasing', main, { Approvals: S.approved ? 0 : 1 }), 'Purchasing workbench');
};
WT.actions.split = function (el, S) { S.split = el.getAttribute('data-v'); };
WT.actions.approved = function (el, S) { S.approved = true; };
WT.actions.sent = function (el, S) { S.sent = true; };
WT.ensure['op02-workbench'] = function (S) { S.split = 'split'; S.approved = true; S.sent = true; };
WT.bts['op02-workbench'] = function (S) {
  return {
    what: 'On Monday the Procurement agent groups every open buy line for the week (three installs and a spring mulch round) into draft purchase orders by vendor and delivery date: one multi-drop stone order, one paver order and one nursery order to the holding yard. The mulch round draws from the yard bunker. It checks nursery availability and suggests a split when a size is short. POs that fit the sold budget approve themselves; the rest follow each person\'s approval limit.',
    agents: [['Procurement (A21)', 'Groups lines into draft POs, checks availability [V1]', 0], ['PO approval rules', 'Budget fit and role limits [MVP]', 1]],
    trace: [{ c: 'agent.A21.compile(week of Apr 19)', r: '31 buy lines from 3 jobs; mulch round reserved from bunker B2', ms: '7 s' }, { c: 'nursery.availability(Maple Hill, Oakwood)', r: 'Hydrangea \'Bobo\' #3: 4 of 6 at Maple Hill', ms: '1.2 s' }, { c: 'po.draft(by vendor, delivery date)', r: S.split === 'split' ? '4 POs' : '3 POs', ms: '400 ms' }, { c: 'approval.route', r: S.approved ? 'PO-004214 approved by Tasha; others budget fit' : 'PO-004214 waiting for Tasha ($3,915.70)', ms: '—', det: true, human: !S.approved }, { c: 'po.send(email + SMS links)', r: S.sent ? 'sent' : 'waiting', ms: S.sent ? '1.4 s' : '', det: true, pending: !S.sent }],
    hitl: [['Luis', 'decides on the split; sending a PO is always a person\'s action (T3).'], ['Tasha', 'approves the PO above Luis\'s limit.']],
    creditNote: 'An agent task run is quoted before it starts: 14 credits for this week\'s workbench.',
    tags: [['mvp', 'POs with budget-fit auto-approval and role limits, PO links'], ['v1', 'purchasing workbench, Procurement agent, nursery availability, blanket POs and releases']],
    specs: 'Spec: 13 §4.8.2, §4.8.3, §4.9.4, §5.1 · 17 A21 · 02 (purchase_order.approve_max)'
  };
};

/* op03 */
WT.screens['op03-vendor'] = function (S) {
  var body = '<p class="ptitle" style="font-size:1rem">PO COL-PO-004214</p><p class="psub">From Greenleaf Grounds Co. · no login needed</p><div class="pcard tiny"><dl class="kv"><dt>Deliver to</dt><dd>1932 Lytham Rd, Upper Arlington (Delgado)</dd><dt>Drop</dt><dd>Left side of the driveway on plywood; keep the neighbor\'s drive clear</dd><dt>Lines</dt><dd>6 pallets pavers · 12 bags poly sand · 11 edge restraint</dd><dt>Requested</dt><dd>Tue Apr 20, 7:00-8:00</dd></dl></div>' +
    (S.ack ? '<div class="okline">' + ic('check') + 'Acknowledged · Kelly Shaw</div>' : '<button type="button" class="btn primary" style="justify-content:center" data-act="ack" data-k="ack">Acknowledge PO</button>') +
    (S.ack ? (S.win ? '<div class="okline">' + ic('check') + 'Confirmed Tue 7:00-8:00 · boom truck, needs 12 ft clearance</div>' : '<button type="button" class="btn" style="justify-content:center" data-act="win" data-k="win">Confirm the window</button>') : '') +
    '<p class="tiny muted mt6">Out of stock or a different date? Flag it here; Greenleaf sees it right away.</p>';
  var client = '<div class="wt-sms"><div class="wt-bubble them">Hi Elena, Greenleaf here. Your pavers arrive tomorrow (Tue) between 7 and 8 AM on the left side of the driveway. The crew starts Wednesday. Reply with any questions.<small>' + (S.win ? 'Scheduled for Mon 4:00 PM' : 'Waiting for the vendor to confirm') + '</small></div></div>';
  var gantt = '<div class="panel mt10"><h4>Dispatch board · Tue Apr 20</h4><div class="wt-gantt"><div class="g-row"><span>Deliveries</span><div class="g-track"><span class="g-blk alt" style="left:0%;width:16%">Scioto 7:00</span><span class="g-blk ' + (S.win ? 'alt' : 'warn') + '" style="left:8%;width:16%">Buckeye 7:30' + (S.win ? '' : '?') + '</span></div></div><div class="g-row"><span>Crew 1</span><div class="g-track"><span class="g-blk" style="left:2%;width:40%">Tree removal prep</span><span class="g-blk" style="left:46%;width:44%">Hendricks beds</span></div></div></div></div>';
  return withPhone(browser('app.rootline.com/schedule/2027-04-20', opsShell('Schedule', '<div class="apphead"><h3>Delivery and the client</h3></div><div class="wt-cols"><div class="panel"><h4>Client text (automatic, day before)</h4>' + client + '</div><div class="panel"><h4>PO status</h4><dl class="kv"><dt>COL-PO-004213</dt><dd>' + pill('ok', 'Confirmed 7:00') + '</dd><dt>COL-PO-004214</dt><dd>' + (S.win ? pill('ok', 'Confirmed 7:30') : S.ack ? pill('info', 'Acknowledged') : pill('', 'Sent')) + '</dd><dt>COL-PO-004215</dt><dd>' + pill('ok', 'Confirmed Mon') + '</dd></dl></div></div>' + gantt), 'Dispatch board with deliveries'),
    phone(body, { brand: 'Greenleaf Grounds Co.', sub: 'Purchase order link', label: 'Vendor phone: PO confirmation link', k: 've' }));
};
WT.actions.ack = function (el, S) { S.ack = true; };
WT.actions.win = function (el, S) { S.win = true; };
WT.ensure['op03-vendor'] = function (S) { S.ack = true; S.win = true; };
WT.bts['op03-vendor'] = function (S) {
  return {
    what: 'Each PO goes out as a PDF with a secure confirmation link, by email or text. The vendor acknowledges, confirms or proposes a delivery window and flags substitutions, with no login. Confirmed deliveries appear on the dispatch board next to the crews, and the client gets a text the day before with where the pallets will land.',
    agents: [['PO confirmation link [MVP]', 'Acknowledge, confirm windows, flag lines', 1], ['Delivery scheduling [V1]', 'Deliveries on the dispatch board, client notice', 1]],
    trace: [{ c: 'po.link.open(004214)', r: 'opened by Kelly Shaw', ms: '—', det: true }, { c: 'po.acknowledge', r: S.ack ? 'acknowledged' : 'waiting', ms: S.ack ? '—' : '', det: true, pending: !S.ack }, { c: 'delivery.confirm(Tue 7:00-8:00)', r: S.win ? 'on the dispatch board' : '', ms: S.win ? '200 ms' : '', det: true, pending: !S.win }, { c: 'sms.schedule(client, day before)', r: S.win ? 'Mon 4:00 PM' : '', ms: '', det: true, pending: !S.win }],
    hitl: [['Kelly (vendor)', 'confirms from the link.'], ['Luis', 'sees any change before it surprises the crew.']],
    tags: [['mvp', 'PO email and SMS links with acknowledgment and revisions'], ['v1', 'delivery windows on the dispatch board, client delivery notices']],
    specs: 'Spec: 13 §4.8.3 (sending), §4.10 · 04 (dispatch board) · 16 (client texts)'
  };
};

/* op04 */
WT.screens['op04-receive'] = function (S) {
  var body = '<p class="ptitle" style="font-size:1rem">Receive · Delgado patio</p><p class="psub">Scioto PO-004213 · Buckeye PO-004214</p>' +
    '<div class="pcard tiny">' + (S.ticket ? '<div class="flex">' + ic('file') + '<b>Scale ticket #44817</b></div><dl class="kv mt6"><dt>#57 stone</dt><dd>9.18 t (ordered 9, within 5%)</dd><dt>Bedding sand</dt><dd>4.06 t (ordered 4)</dd></dl>' : '<button type="button" class="btn sm" data-act="ticket" data-k="ticket">' + ic('camera') + 'Photo of the scale ticket</button>') + '</div>' +
    '<div class="pcard tiny"><dl class="kv"><dt>Pavers</dt><dd>6 of 6 pallets</dd><dt>Poly sand</dt><dd>12 of 12</dd><dt>Edge</dt><dd>11 of 11</dd></dl>' + (S.damage ? '<div class="wt-callout warn mt6">About 20 sq ft broken on pallet 4 · photo attached · credit requested</div>' : '<button type="button" class="btn xs mt6" data-act="damage" data-k="damage">' + ic('warn') + 'Note damage</button>') + '</div>' +
    (S.received ? '<div class="okline">' + ic('check') + 'Received · RC-802 · 7:41 AM</div>' : '<button type="button" class="btn primary" style="justify-content:center" data-act="received" data-k="received"' + (S.ticket ? '' : ' disabled') + '>Confirm receipt</button>');
  var right = '<div class="wt-stack" style="flex:1 1 340px;min-width:0"><div class="panel"><h4>Posted to the job (job-direct receipt)</h4>' + (S.received ? je([['5210 Materials - Hardscape (J-2417)', 4402.58, 0], ['2020 Goods Received Not Invoiced', 0, 4402.58]]) + '<div class="wt-note mt6">Stone and sand at the weighed tons: 9.18 t × $38.00 and 4.06 t × $34.00. The bills will match against this receipt.</div>' : '<p class="tiny muted">Nothing posts until the crew lead confirms.</p>') + '</div>' +
    (S.damage ? '<div class="panel"><h4>Vendor credit request</h4><div class="tiny">20 sq ft × $5.10 = <b>$102.00</b> on PO-004214, with the photo. The bill match will expect the credit.</div></div>' : '') + '</div>';
  return devRow(phone(body, { brand: 'Rootline Crew', sub: 'Andrés Vega · Crew 1', logo: 'truck', label: 'Crew app: receiving', k: 'rc' }), right);
};
WT.actions.ticket = function (el, S) { S.ticket = true; };
WT.actions.damage = function (el, S) { S.damage = true; };
WT.actions.received = function (el, S) { S.received = true; };
WT.ensure['op04-receive'] = function (S) { S.ticket = true; S.damage = true; S.received = true; };
WT.bts['op04-receive'] = function (S) {
  return {
    what: 'The crew lead receives deliveries on site from the crew app, even offline. A photo of the scale ticket is read so bulk materials are received at the weighed tons, not the ordered tons; damage is noted with a photo and becomes a credit request. Confirming posts the cost straight to the job (job-direct) against goods received not invoiced, ready for the vendor\'s bill.',
    agents: [['Receiving (4.4.1)', 'Receive against PO, quantities and damage', 1], ['Document reading', 'Reads the scale ticket', 0]],
    trace: [{ c: 'doc.read(scale ticket photo)', r: S.ticket ? '#57 9.18 t · sand 4.06 t · ticket 44817' : 'waiting for the photo', ms: S.ticket ? '2.6 s' : '', pending: !S.ticket }, { c: 'tolerance.check(±5% bulk)', r: S.ticket ? 'within tolerance' : '', ms: '10 ms', det: true, pending: !S.ticket }, { c: 'receipt.post(RC-802) → inventory.IN1 job-direct', r: S.received ? 'Dr 5210 / Cr 2020 $4,402.58' : '', ms: S.received ? '90 ms' : '', det: true, pending: !S.received }],
    hitl: [['Andrés', 'counts, photographs and confirms; nothing posts without him.']],
    creditNote: 'Reading the one-page scale ticket is 2 credits.',
    tags: [['mvp', 'receive against PO in the crew app, field receipts, job-direct posting'], ['v1', 'returns to vendor and credit tracking']],
    specs: 'Spec: 13 §4.4.1, §4.4.4, §4.8.5 · 09 inventory.IN1, 2020 GRNI · 05 (offline capture)'
  };
};

/* op05 */
WT.screens['op05-yard'] = function (S) {
  var level = S.release ? 82 : 31;
  var main = '<div class="apphead"><span class="crumb">Inventory › Columbus yard</span><h3>Holding yard and bunkers</h3>' + pill('info', 'Standard mode') + '</div>' +
    '<div class="wt-cols"><div class="panel"><h4>Holding batch HB-0419 · 36 plants</h4><dl class="kv"><dt>Received</dt><dd>Mon Apr 19 from Maple Hill and Oakwood</dd><dt>For</dt><dd>Delgado (14) · Hendricks (22)</dd><dt>Nursery guarantee</dt><dd>30 days from delivery</dd></dl>' +
    '<div class="wt-callout ' + (S.water ? '' : 'warn') + ' mt6">' + (S.water ? ic('check') + ' Watering set: daily at 7:00 through Friday, assigned to Tomás' : '<b>Heat and no rain:</b> 86°F Wednesday, no rain for 5 days. Containers this size dry out in a day.<div class="mt6"><button type="button" class="btn xs primary" data-act="water" data-k="water">Create daily watering tasks</button></div>') + '</div>' +
    '<div class="mt6">' + (S.loss ? '<div class="okline">' + ic('check') + '1 Ilex \'Gem Box\' recorded as a loss; claim sent to Maple Hill under the guarantee</div>' : '<div class="tiny">Tomás\'s health check photo: 1 Ilex \'Gem Box\' with root rot.</div><button type="button" class="btn xs mt6" data-act="loss" data-k="loss">Record loss and claim the guarantee</button>') + '</div>' +
    (S.loss ? '<div class="mt6">' + je([['1230 Vendor Claims (Maple Hill)', 26.50, 0], ['1320 Inventory - Plants (Holding Yard)', 0, 26.50]]) + '</div>' : '') + '</div>' +
    '<div class="panel"><h4>Bunker B2 · double-shredded hardwood</h4><div class="bunker" aria-label="Bunker fill level"><i style="height:' + level + '%"></i><span class="par" style="bottom:42%">reorder at 50 yd³</span></div>' +
    '<dl class="kv mt6"><dt>Count</dt><dd>' + (S.count ? '18 × 12 ft × 4.75 ft avg = 38.0 yd³ (±10%)' : 'last count 3 weeks ago') + '</dd><dt>Reserved</dt><dd>4 yd³ Delgado · 46 yd³ mulch round</dd><dt>Blanket PO</dt><dd>1,200 yd³ at $28.00 · 412 used</dd></dl>' +
    (S.count ? '' : '<button type="button" class="btn xs mt6" data-act="count" data-k="count">Count the bunker</button>') + (S.count && !S.release ? '<button type="button" class="btn xs primary mt6" data-act="release" data-k="release">Release 60 yd³ against the blanket PO</button>' : '') + (S.release ? '<div class="okline mt6">' + ic('check') + 'REL-07: 60 yd³ Thursday · blanket 472 of 1,200 used</div>' : '') + '</div></div>';
  return browser('app.rootline.com/inventory/columbus-yard', opsShell('Inventory', main), 'Holding yard and bunkers');
};
WT.actions.water = function (el, S) { S.water = true; };
WT.actions.loss = function (el, S) { S.loss = true; };
WT.actions.count = function (el, S) { S.count = true; };
WT.actions.release = function (el, S) { S.release = true; };
WT.ensure['op05-yard'] = function (S) { S.water = true; S.loss = true; S.count = true; S.release = true; };
WT.bts['op05-yard'] = function (S) {
  return {
    what: 'Plants are living inventory. A holding batch records where each plant is going and starts the nursery guarantee clock; the weather forecast creates watering tasks; a health check records a dead plant as a loss and, inside the guarantee, books it as a claim against the nursery instead of an expense. Bulk bunkers are counted as an estimated volume from their dimensions, and falling below the reorder point releases mulch against the season\'s blanket PO.',
    agents: [['Holding yard (4.7)', 'Batches, weather-driven care, losses and claims [V1]', 1], ['Bunker counts and reorder (4.5, 4.6)', 'Volume estimate, par levels, blanket releases', 1]],
    trace: [{ c: 'weather.forecast(Columbus, 5 days)', r: '86°F Wed, 0 in rain', ms: '300 ms', det: true }, { c: 'care.tasks(HB-0419)', r: S.water ? 'daily watering ×5 → Tomás' : 'suggested', ms: '', det: true, pending: !S.water }, { c: 'plant_loss → inventory.IN6 (under guarantee)', r: S.loss ? 'Dr 1230 / Cr 1320 $26.50' : '', ms: '', det: true, pending: !S.loss }, { c: 'bunker.count(B2)', r: S.count ? '38.0 yd³; 50 reserved → reorder' : '', ms: '', det: true, pending: !S.count }, { c: 'blanket.release(REL-07, 60 yd³)', r: S.release ? 'sent' : '', ms: '', det: true, pending: !S.release }],
    hitl: [['Tomás', 'waters, checks and photographs plants.'], ['Luis', 'releases the mulch.']],
    tags: [['mvp', 'Light inventory mode, full counts, reservations'], ['v1', 'Standard mode with ledger posting, holding batches, weather care tasks, plant losses and nursery claims, blanket POs, reorder points']],
    specs: 'Spec: 13 §4.1.6, §4.5, §4.6, §4.7 · 09 inventory.IN6, 1230, 1320 · 12 (plant care data)'
  };
};

/* op06 */
WT.screens['op06-rate'] = function (S) {
  var h = S.hours;
  var c2 = function (v) { return Math.round(v * 100) / 100; };
  var dep = c2(2750 / h), coc = c2(595 / h), ins = c2(300 / h), fuel = 4.32, rep = 2.00, wear = 0.50, tot = c2(dep + coc + ins + fuel + rep + wear);
  var r2 = function (v) { return money(v, true); };
  var main = '<div class="apphead"><span class="crumb">Equipment › MW-07</span><h3>60 in commercial zero-turn · rate card</h3>' + pill('', 'Crew 2') + '</div>' +
    '<div class="wt-cols"><div class="panel"><h4>Calculator</h4><div class="seg mt6">' + [800, 600].map(function (v) { return '<button type="button" data-act="hours" data-v="' + v + '" data-k="h' + v + '" aria-pressed="' + (h === v) + '">' + v + ' h a year</button>'; }).join('') + '</div>' +
    '<div class="rate-grid mt10"><span>Depreciation ($14,000 − $3,000 over 4 seasons)</span><span>' + r2(dep) + '</span><span>Cost of capital (7% on $8,500)</span><span>' + r2(coc) + '</span><span>Insurance and storage</span><span>' + r2(ins) + '</span><span>Fuel (1.2 gal/h × $3.60)</span><span>' + r2(fuel) + '</span><span>Maintenance and repairs</span><span>' + r2(rep) + '</span><span>Blades and tires</span><span>' + r2(wear) + '</span><span class="t">Cost per hour</span><span class="t">' + r2(tot) + '</span></div>' +
    (S.published ? '<div class="okline mt10">' + ic('check') + 'Published to Estimating: $11.38/h (800 h)</div>' : '<button type="button" class="btn sm primary mt10" data-act="publish" data-k="publish">Publish $11.38/h to Estimating</button>') + '</div>' +
    '<div class="panel"><h4>Actuals, trailing 12 months ' + tag('v1') + '</h4><dl class="kv"><dt>Hours (telematics)</dt><dd>702</dd><dt>Fuel (fuel card)</dt><dd>1.3 gal/h</dd><dt>Repairs (work orders)</dt><dd>$2.40/h</dd><dt>Actual cost</dt><dd><b>$12.78/h</b></dd><dt>Recovered in bids</dt><dd>$11.38/h</dd><dt>Under-recovered</dt><dd style="color:var(--danger-text)"><b>$983</b> this season</dd></dl><div class="wt-note mt6">Fewer hours than planned is the biggest driver: the same mower costs about 13% more per hour at 600 h than at 800 h.</div></div></div>';
  return browser('app.rootline.com/equipment/MW-07/rate', opsShell('Equipment', main), 'Equipment rate card');
};
WT.actions.hours = function (el, S) { S.hours = +el.getAttribute('data-v'); };
WT.actions.publish = function (el, S) { S.published = true; S.hours = 800; };
WT.ensure['op06-rate'] = function (S) { S.published = true; };
WT.bts['op06-rate'] = function (S) {
  return {
    what: 'Equipment is a costed asset. The rate card adds ownership cost spread over expected hours to operating cost per hour, and the result is the only mower rate Estimating can use, so nobody guesses. From V1 the same card is recomputed from real data (telematics hours, fuel cards, work orders, depreciation in the ledger) and shows whether this season\'s bids actually paid for the machine.',
    agents: [['Rate card (4.14.7)', 'Calculator [MVP], trailing-12-month actuals [V1]', 1]],
    trace: [{ c: 'rate.compute(MW-07, ' + S.hours + ' h)', r: (S.hours === 800 ? '$11.38' : '$12.89') + '/h', ms: '10 ms', det: true }, { c: 'rate.publish(Estimating)', r: S.published ? '$11.38/h' : 'not yet', ms: '', det: true, pending: !S.published }, { c: 'actuals.trailing12(telematics, fuel, WOs, ledger)', r: '$12.78/h · under-recovered $983', ms: '1.1 s', det: true }],
    hitl: [['Erin', 'decides whether to raise the published rate or plan more hours for the machine.']],
    tags: [['mvp', 'asset registry, manual meters, rate calculator published to Estimating'], ['v1', 'actuals from telematics, fuel cards and work orders; over/under-recovery']],
    specs: 'Spec: 13 §4.14.1, §4.14.2, §4.14.7-4.14.9 · 03 (equipment rates) · 18 (equipment_cost_per_hour)'
  };
};

/* op07 */
WT.screens['op07-shop'] = function (S) {
  var main = '<div class="apphead"><span class="crumb">Equipment › Shop</span><h3>Defects and service</h3></div><div class="wt-cols">' +
    '<div class="panel"><h4>' + ic('warn') + ' TR-4 · right tail light out</h4><dl class="kv"><dt>Reported</dt><dd>Marco Ruiz, pre-trip DVIR, with photo</dd><dt>Status</dt><dd>' + (S.cert ? pill('ok', 'In service') : pill('danger', 'Out of service (lights)')) + '</dd><dt>Work</dt><dd>LED lamp $38.50 from parts stock · 0.4 h</dd></dl>' +
    (S.cert ? '<div class="okline mt6">' + ic('check') + 'Repair certified by Ray Dunn · next pre-trip shows the certification</div>' : '<button type="button" class="btn sm primary mt10" data-act="cert" data-k="cert">Certify the repair (Ray Dunn)</button>') + '</div>' +
    '<div class="panel"><h4>' + ic('wrench') + ' MW-07 · 500-hour service due</h4><dl class="kv"><dt>Hour meter</dt><dd>496.4 h (telematics)</dd><dt>Due</dt><dd>500 h: oil, filters, blades, belt check</dd><dt>Crew 2 week</dt><dd>~38 mower hours scheduled</dd></dl>' +
    (S.pm ? '<div class="okline mt6">' + ic('check') + 'WO-0314 Saturday 7:00 · spare mower MW-11 assigned to Crew 2 Monday if needed</div>' : '<button type="button" class="btn sm mt10" data-act="pm" data-k="pm">Schedule for Saturday</button>') + '</div></div>';
  return browser('app.rootline.com/equipment/shop', opsShell('Equipment', main, { Equipment: (S.cert ? 0 : 1) + (S.pm ? 0 : 1) }), 'Equipment shop');
};
WT.actions.cert = function (el, S) { S.cert = true; };
WT.actions.pm = function (el, S) { S.pm = true; };
WT.ensure['op07-shop'] = function (S) { S.cert = true; S.pm = true; };
WT.bts['op07-shop'] = function (S) {
  return {
    what: 'The defect Marco found in the crew walkthrough\'s DVIR set the trailer to out of service, so no crew could hitch it. The mechanic fixes it and signs a repair certification, which the next driver sees before starting the route. Preventive maintenance runs on hour meters: as the mower nears 500 hours a work order is created for a day the crew isn\'t using it.',
    agents: [['DVIR and defect records [MVP]', 'Out-of-service rules, repair certification', 1], ['PM schedules and work orders [V1]', 'Meter-based service, parts, mechanic time', 1]],
    trace: [{ c: 'dvir.defect(TR-4, lights)', r: 'asset down; rigs with TR-4 blocked', ms: '—', det: true }, { c: 'repair.certify(Ray Dunn)', r: S.cert ? 'certified; TR-4 in service' : 'waiting', ms: S.cert ? '—' : '', det: true, pending: !S.cert, human: !S.cert }, { c: 'pm.trigger(MW-07, 500 h)', r: '496.4 h; due this week', ms: '20 ms', det: true }, { c: 'wo.schedule(WO-0314)', r: S.pm ? 'Saturday 7:00' : '', ms: '', det: true, pending: !S.pm }],
    hitl: [['Ray', 'certifies the repair; the system won\'t clear a safety defect without his name.']],
    tags: [['mvp', 'DVIR, defect records, repair certification, registration reminders'], ['v1', 'PM schedules, work orders, parts inventory, mechanic time']],
    specs: 'Spec: 13 §4.14.3, §4.14.4, §4.14.10 · 05 (DVIR in the crew app) · 15 (mechanic time)'
  };
};

/* op08 */
WT.screens['op08-subgate'] = function (S) {
  var ok = S.coi >= 2;
  var main = '<div class="apphead"><span class="crumb">Vendors and subs › Tall Oaks Tree Service</span><h3>Assign: remove a dead ash at the Delgado job</h3></div>' +
    (ok ? '<div class="wt-callout">' + ic('check') + ' Compliance cleared. ' + (S.swo ? 'Sub work order SWO-118 sent: $1,450, Wed Apr 21.' : '<button type="button" class="btn xs primary" data-act="swo" data-k="swo">Send sub work order SWO-118 ($1,450)</button>') + '</div>' : '<div class="wt-callout danger"><b>Blocked:</b> general liability certificate expired Mar 31. Tall Oaks can\'t be assigned, start work or be paid until it\'s current. Only the owner can override, with a reason.</div>') +
    '<div class="wt-cols mt10"><div class="panel"><h4>Compliance file</h4><dl class="kv"><dt>W-9</dt><dd>' + pill('ok', 'On file') + '</dd><dt>General liability</dt><dd>' + (ok ? pill('ok', '$1M / $2M, to Mar 2028') : pill('danger', 'Expired Mar 31')) + '</dd><dt>Auto</dt><dd>' + (ok ? pill('ok', '$1M') : pill('', 'on the old certificate')) + '</dd><dt>Workers\' comp</dt><dd>' + (ok ? pill('ok', 'Ohio BWC certificate') : pill('', 'on the old certificate')) + '</dd><dt>Additional insured</dt><dd>' + (ok ? pill('ok', 'Greenleaf named') : '—') + '</dd><dt>Arborist</dt><dd>' + pill('ok', 'ISA certified on staff') + '</dd></dl></div>' +
    '<div class="panel"><h4>Upload request</h4>' + (S.coi === 0 ? '<button type="button" class="btn sm primary" data-act="coi" data-k="coi0">Text Greg an upload link</button><div class="wt-note mt6">Automatic reminders went out at 30, 14 and 3 days.</div>' : S.coi === 1 ? '<div class="tiny"><b>New certificate uploaded (ACORD 25).</b> Read by AI:</div><dl class="kv mt6"><dt>GL</dt><dd>$1M per occurrence / $2M aggregate</dd><dt>Auto</dt><dd>$1M combined single limit</dd><dt>Additional insured</dt><dd>Greenleaf Grounds Co. ✓</dd><dt>Expires</dt><dd>Mar 31, 2028</dd></dl><button type="button" class="btn sm primary mt6" data-act="coi" data-k="coi1">Confirm and clear the hold</button>' : '<div class="okline">' + ic('check') + 'Confirmed by Tasha</div>') + '</div></div>';
  var sub = '<p class="ptitle" style="font-size:1rem">Greenleaf needs a current certificate</p><div class="pcard tiny">Your general liability certificate expired Mar 31. Upload the new one to keep getting work.</div>' + (S.coi >= 1 ? '<div class="okline">' + ic('check') + 'Uploaded · COI_TallOaks_2027.pdf</div>' : '<button type="button" class="btn" style="justify-content:center">' + ic('upload') + 'Upload certificate</button>') + (S.swo ? '<div class="pcard tiny mt6"><b>New work order SWO-118</b><br>Remove dead ash, Delgado · Wed Apr 21 · $1,450<div class="flex mt6"><span class="pill ok">Accepted</span></div></div>' : '');
  return withPhone(browser('app.rootline.com/subs/tall-oaks', opsShell('Vendors and subs', main), 'Subcontractor compliance'), phone(sub, { brand: 'Rootline sub portal', sub: 'Tall Oaks Tree Service', logo: 'building', label: 'Subcontractor phone: sub portal', k: 'sb' }));
};
WT.actions.coi = function (el, S) { S.coi = Math.min(2, S.coi + 1); };
WT.actions.swo = function (el, S) { S.swo = true; };
WT.ensure['op08-subgate'] = function (S) { S.coi = 2; S.swo = true; };
WT.bts['op08-subgate'] = function (S) {
  return {
    what: 'Subcontractor compliance actually blocks. With the gate set to block, a sub with an expired required document can\'t be assigned, can\'t start work in the portal and is left out of payment runs. The sub uploads a new insurance certificate from a link; AI reads the ACORD 25 form (limits, dates, additional insured) and the office confirms before the hold clears.',
    agents: [['Compliance gate [MVP]', 'Block or warn per Company setting', 1], ['COI reading [V1]', 'Extracts limits, dates and additional insured wording', 0]],
    trace: [{ c: 'compliance.check(Tall Oaks)', r: ok2(S) ? 'all current' : 'GL expired Mar 31 → block', ms: '30 ms', det: true }, { c: 'sms.upload_link(Greg)', r: S.coi >= 1 ? 'uploaded' : 'waiting', ms: '', det: true, pending: S.coi < 1 }, { c: 'doc.read(ACORD 25)', r: S.coi >= 1 ? 'GL $1M/$2M, auto $1M, AI: Greenleaf, exp 2028-03-31' : '', ms: S.coi >= 1 ? '4 s' : '', pending: S.coi < 1 }, { c: 'compliance.confirm(Tasha)', r: S.coi >= 2 ? 'hold cleared' : '', ms: '', det: true, pending: S.coi < 2, human: S.coi === 1 }, { c: 'sub_work_order.send(SWO-118)', r: S.swo ? 'accepted in the portal' : '', ms: '', det: true, pending: !S.swo }],
    hitl: [['Tasha', 'confirms what the AI read.'], ['Erin', 'is the only one who can override the block, with a reason.']],
    creditNote: 'Reading the one-page certificate is 2 credits.',
    tags: [['mvp', 'sub onboarding basics, W-9 and COI tracking, expiry reminders, compliance gate'], ['v1', 'AI COI reading, sub portal, sub work orders']],
    specs: 'Spec: 13 §4.13.1-4.13.3 · 02 (subcontractor role) · 22 §4.4.1 (document understanding)'
  };
};
function ok2(S) { return S.coi >= 2; }

/* op09 */
WT.screens['op09-subpay'] = function (S) {
  var sub = '<p class="ptitle" style="font-size:1rem">SWO-118 · invoice</p><div class="pcard tiny"><dl class="kv"><dt>Work</dt><dd>Dead ash removed, stump ground, chips hauled</dd><dt>Photos</dt><dd>4 (before and after)</dd><dt>Amount</dt><dd>$1,450.00</dd></dl></div>' +
    (S.inv ? '<div class="okline">' + ic('check') + 'Invoice submitted</div>' : '<button type="button" class="btn primary" style="justify-content:center" data-act="inv" data-k="inv">Submit invoice</button>') +
    (S.inv ? (S.waiver ? '<div class="okline">' + ic('check') + 'Conditional waiver signed</div>' : '<div class="pcard tiny">Sign a conditional lien waiver for this payment (Greenleaf\'s template)</div><button type="button" class="btn" style="justify-content:center" data-act="waiver" data-k="waiver">Sign waiver</button>') : '');
  var main = '<div class="apphead"><span class="crumb">Money › Bills</span><h3>Tall Oaks Tree Service · SWO-118</h3>' + (S.billOk ? pill('ok', 'Approved for the Friday payment run') : pill('info', S.inv ? 'In review' : 'Waiting for the sub')) + '</div>' +
    '<div class="panel"><dl class="kv"><dt>Matched to</dt><dd>SWO-118 ($1,450.00) · completion photos · Andrés confirmed on site</dd><dt>Compliance</dt><dd>' + pill('ok', 'Current') + '</dd><dt>Lien waiver</dt><dd>' + (S.waiver ? pill('ok', 'Conditional on file; unconditional requested after payment clears') : pill('warn', 'Not yet signed')) + '</dd><dt>Retainage</dt><dd>none on this job</dd></dl>' +
    (S.billOk ? '<div class="mt10">' + je([['5410 Subcontractors (J-2417)', 1450, 0], ['2000 Accounts Payable', 0, 1450]]) + '</div>' : '<button type="button" class="btn sm primary mt10" data-act="billOk" data-k="billOk"' + (S.waiver ? '' : ' disabled') + '>Approve bill (Priya)</button>') + '</div>';
  return withPhone(browser('app.rootline.com/money/bills/tall-oaks-swo-118', opsShell('Money', main), 'Subcontractor bill'), phone(sub, { brand: 'Rootline sub portal', sub: 'Tall Oaks Tree Service', logo: 'building', label: 'Subcontractor phone: invoice and waiver', k: 'sp' }));
};
WT.actions.inv = function (el, S) { S.inv = true; };
WT.actions.waiver = function (el, S) { S.waiver = true; };
WT.actions.billOk = function (el, S) { S.billOk = true; };
WT.ensure['op09-subpay'] = function (S) { S.inv = true; S.waiver = true; S.billOk = true; };
WT.bts['op09-subpay'] = function (S) {
  return {
    what: 'The sub invoices against the work order from the portal, with photos, and signs a conditional lien waiver for this payment. The bill matches the work order and the crew lead\'s confirmation, posts to the job\'s subcontractor cost and joins the next payment run. Payment itself goes from Greenleaf\'s bank, not through Rootline; the unconditional waiver is requested once it clears.',
    agents: [['Sub invoices and lien waivers [V1]', 'Portal invoice, waiver e-sign, payment-run inclusion', 1]],
    trace: [{ c: 'portal.invoice(SWO-118)', r: S.inv ? '$1,450.00 with 4 photos' : 'waiting', ms: '', det: true, pending: !S.inv }, { c: 'lien_waiver.sign(conditional)', r: S.waiver ? 'signed, hash stored' : '', ms: '', det: true, pending: !S.waiver }, { c: 'bill.approve → ap.AP1', r: S.billOk ? 'Dr 5410 / Cr 2000 $1,450.00' : '', ms: S.billOk ? '80 ms' : '', det: true, pending: !S.billOk, human: S.waiver && !S.billOk }],
    hitl: [['Greg', 'invoices and signs.'], ['Priya', 'approves the bill and runs payments.']],
    tags: [['v1', 'sub portal invoices, lien waivers, retainage, payment-run holds']],
    specs: 'Spec: 13 §4.13.4, §4.13.5 · 09 ap.AP1, ap.AP4, 5410 (verify state waiver rules)'
  };
};

/* op10 */
WT.screens['op10-jobcost'] = function (S) {
  var rows = [['Materials', 5042.00, 4912.70, 4402.58], ['Subcontractor', 1500.00, 1450.00, 1450.00], ['Equipment', 280.00, 0, 267.80], ['Labor', 3960.00, 0, 2312.00]];
  var max = 5200;
  var bars = rows.map(function (r) { return '<div class="jc-bar"><span>' + r[0] + '</span><div class="tr"><i class="c" style="width:' + (Math.max(r[2], r[3]) / max * 100).toFixed(1) + '%"></i><i class="a" style="width:' + (r[3] / max * 100).toFixed(1) + '%"></i><i class="e" style="width:' + (r[1] / max * 100).toFixed(1) + '%"></i></div></div>'; }).join('');
  var main = '<div class="apphead"><span class="crumb">Jobs › J-2417</span><h3>Delgado patio · job cost</h3>' + pill('info', 'Install day 2 of 4') + '</div>' +
    '<div class="panel"><table class="data tight"><thead><tr><th>Cost type</th><th class="num">Estimate</th><th class="num">Committed</th><th class="num">Actual</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r[0] + '</td><td class="num">' + money(r[1], true) + '</td><td class="num">' + (r[2] ? money(r[2], true) : '—') + '</td><td class="num">' + money(r[3], true) + '</td></tr>'; }).join('') + '</tbody></table>' +
    '<div class="mt10">' + bars + '</div><div class="wt-note">Line: estimate. Blue: committed. Green: actual so far.</div></div>' +
    '<div class="wt-cols mt10"><div class="panel"><h4>Where each number comes from</h4><ul style="margin:0;padding-left:18px;font-size:.76rem;color:var(--text-2);display:grid;gap:3px"><li>Committed: the POs and SWO-118, plus 4 yd³ of reserved mulch</li><li>Materials actual: receipt RC-802 (plants and mulch not issued yet)</li><li>Equipment: mini skid steer 6.5 h at its published $41.20/h</li><li>Labor: approved hours at base rate plus burden</li></ul></div>' +
    '<div class="panel"><h4>Forecast</h4><dl class="kv"><dt>Materials</dt><dd>$130 under budget, before the $102 paver credit</dd><dt>Gross margin</dt><dd>on track for 44% vs 42% estimated</dd></dl></div></div>';
  return browser('app.rootline.com/jobs/J-2417/cost', opsShell('Jobs', main), 'Job cost');
};
WT.bts['op10-jobcost'] = function (S) {
  return {
    what: 'Because purchasing, receiving, equipment and subs all post to the job, the patio\'s cost is live while the crew is still on site: estimate, committed (what\'s on order) and actual (what has arrived or been worked). Commitments warn about overruns before the bills arrive, not a month later.',
    agents: [['Job costing', 'Estimate vs committed vs actual by cost type', 1]],
    trace: [{ c: 'commitments(J-2417)', r: 'POs $4,800.70 + reserved $112.00 + SWO $1,450.00', ms: '120 ms', det: true }, { c: 'actuals(J-2417)', r: 'receipts, sub bill, equipment usage, approved time', ms: '200 ms', det: true }, { c: 'forecast.margin', r: '44% vs 42% estimated', ms: '30 ms', det: true }],
    hitl: [['Erin and Luis', 'read it; nothing here needs approval.']],
    tags: [['mvp', 'commitments, job-direct receipts, job cost by cost type']],
    specs: 'Spec: 13 §4.8.8, §5.1 · 09 (job costing, WIP) · 18 (job profitability)'
  };
};

/* op11 */
WT.screens['op11-recap'] = function (S) {
  var rows = [['Buy list from the signed estimate', 'Rules', 'MVP'], ['Workbench: grouped POs, availability split', 'Procurement agent (A21)', 'V1'], ['PO approval by budget fit and limits', 'Rules', 'MVP'], ['Vendor confirmation link, deliveries on the board', 'Rules', 'MVP and V1'], ['On-site receiving with a scale ticket', 'Document reading', 'MVP'], ['Holding yard care, loss and nursery claim', 'Rules', 'V1'], ['Bunker count and blanket release', 'Rules', 'V1'], ['Mower cost per hour, actuals', 'Rules', 'MVP and V1'], ['Defect repair certified; PM scheduled', 'Rules', 'MVP and V1'], ['Sub blocked until insurance is current', 'Gate and document reading', 'MVP and V1'], ['Sub invoice and lien waiver', 'Portal', 'V1'], ['Live job cost', 'Ledger', 'MVP']];
  return '<div class="panel"><table class="data tight"><thead><tr><th>Step</th><th>Automation</th><th>Scope</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>'; }).join('') + '</tbody></table><p class="tiny muted mt10">18 AI credits in total: the workbench run and two document reads. Every PO, receipt, certification and approval was a person\'s decision.</p></div>' +
    '<div class="flex mt14"><a class="btn" href="#overview">' + ic('arrow-l') + 'Back to start</a><a class="btn" href="wt-money.html">Invoicing, payments and the books</a><a class="btn primary" href="walkthroughs.html">All walkthroughs ' + ic('arrow-r') + '</a></div>';
};
WT.bts['op11-recap'] = function (S) {
  return {
    what: 'The design-to-dump-truck chain: the estimate creates demand, purchasing groups it, vendors confirm from a link, the crew receives on site, the yard keeps plants alive and bunkers stocked, equipment is costed from real data, subs are paid only when compliant, and every movement lands on the job\'s cost.',
    hitl: [['Luis, Tasha, Andrés, Tomás, Ray, Priya and Erin', 'made every decision the agents prepared.']],
    tags: [['mvp', 'buy lists, POs, receiving, Light inventory, DVIR, rate calculator, sub compliance gate, job cost'], ['v1', 'workbench and A21, Standard inventory, holding yard, PM work orders, actuals, sub portal and waivers'], ['v2', 'distributor punchout and EDI, predictive maintenance']],
    specs: 'Spec: 13 (whole module) · 03, 04, 05, 09, 12, 17'
  };
};
