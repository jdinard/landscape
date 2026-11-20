/* Walkthrough: invoicing, payments and the books (docs 07, 08, 09). Account codes from doc 09 §4.2. */

function je(rows, note) {
  var d = 0, c = 0;
  var body = rows.map(function (r) { d += r[1] || 0; c += r[2] || 0; return '<tr><td>' + esc(r[0]) + '</td><td class="n">' + (r[1] ? money(r[1], true) : '') + '</td><td class="n">' + (r[2] ? money(r[2], true) : '') + '</td></tr>'; }).join('');
  return '<table class="wt-je"><thead><tr><th>Account</th><th class="n">Debit</th><th class="n">Credit</th></tr></thead><tbody>' + body + '<tr class="tot"><td>' + (note || (Math.abs(d - c) < 0.005 ? 'Balanced' : 'NOT BALANCED')) + '</td><td class="n">' + money(d, true) + '</td><td class="n">' + money(c, true) + '</td></tr></tbody></table>';
}
var MONEY_NAV = [['today', 'Today'], ['approve', 'Approvals'], ['users', 'Clients'], ['clipboard', 'Jobs'], ['dollar', 'Invoices'], ['card', 'Payments'], ['bank', 'Banking'], ['book', 'Ledger'], ['chart', 'Reports'], ['cog', 'Settings']];
function shell(active, main, counts) { return appShell(active, main, { nav: MONEY_NAV, counts: counts }); }

var WT = {
  title: 'Rootline walkthrough: invoicing, payments and the books',
  short: 'Invoicing, payments and the books',
  ovTitle: 'Invoicing, payments and the books',
  startLeft: 4186,
  acts: [
    { n: 'Act 1', t: 'Bill the work', sub: 'The month-end run and the client\'s invoice' },
    { n: 'Act 2', t: 'Get paid', sub: 'Payments, collections, a dispute' },
    { n: 'Act 3', t: 'Keep the books', sub: 'Payouts, bank feeds, bills, job costing' },
    { n: 'Act 4', t: 'Close and report', sub: 'Deferred revenue, tax, close, statements, QuickBooks' }
  ],
  steps: [
    { id: 'm01-run', act: 0, short: 'Billing run', title: 'The month-end billing run', who: 'Tasha', tags: ['mvp'] },
    { id: 'm02-invoice', act: 0, short: 'Client invoice', title: 'The Okafors\' milestone invoice, as they see it', who: 'The Okafors', tags: ['mvp'] },
    { id: 'm03-pay', act: 1, short: 'Client pays', title: 'Paying by bank transfer into Greenleaf\'s Stripe account', who: 'The Okafors', tags: ['mvp'] },
    { id: 'm04-collect', act: 1, short: 'Collections', title: 'AR aging and the collections agent', who: 'Tasha, collections agent', ai: true, tags: ['mvp', 'v1'] },
    { id: 'm05-dispute', act: 1, short: 'Dispute', title: 'A card dispute, answered with evidence', who: 'Erin, dispute agent', ai: true, tags: ['mvp'] },
    { id: 'm06-payout', act: 2, short: 'Payout', title: 'A Stripe payout, reconciled to the bank', who: 'Priya', tags: ['mvp'] },
    { id: 'm07-bank', act: 2, short: 'Bank feed', title: 'Bank feed categorization with the bookkeeping agent', who: 'Priya, bookkeeping agent', ai: true, tags: ['mvp', 'v1'] },
    { id: 'm08-bills', act: 2, short: 'Bills', title: 'A nursery bill, matched to the PO and receipt', who: 'Priya, AP agent', ai: true, tags: ['mvp', 'v1'] },
    { id: 'm09-jobcost', act: 2, short: 'Job costing', title: 'Job costing for the Okafors\' install', who: 'Erin', tags: ['mvp'] },
    { id: 'm10-deferred', act: 3, short: 'Deferred revenue', title: 'Level billing, deferred revenue and the season-end true-up', who: 'Priya', tags: ['mvp'] },
    { id: 'm11-close', act: 3, short: 'Tax and close', title: 'Sales tax, the close checklist and the CPA\'s view', who: 'Priya, outside CPA', tags: ['mvp'] },
    { id: 'm12-statements', act: 3, short: 'Statements', title: 'P&L by division, balance sheet and cash', who: 'Erin', tags: ['mvp'] },
    { id: 'm13-qbo', act: 3, short: 'QuickBooks', title: 'Optional QuickBooks Online sync', who: 'Priya', tags: ['mvp'] },
    { id: 'm14-recap', act: 3, short: 'Recap', title: 'Recap: from work done to closed books', who: 'Everyone', tags: [] }
  ],
  credits: { 'm04-collect': 4, 'm05-dispute': 1, 'm07-bank': 10, 'm08-bills': 4 },
  state: { exc: { po: false, ver: false, cert: false }, sent: false, method: 'ach', paid: false, collect: false, plan: false, dispute: false, matched: false, bulk: false, rule: false, billOk: false, trueup: false, locked: false, div: 'all', conflict: '' },
  ov: {
    eyebrow: 'Clickable walkthrough · money and books',
    h: 'From work done to closed books, in one system',
    lede: 'Rootline bills the work, collects into each landscaper\'s own Stripe account and keeps a real double-entry ledger, so the books close themselves instead of being rebuilt in another app. Follow Greenleaf\'s month end: the billing run, the Okafors\' milestone invoice and bank payment, collections and a card dispute, a Stripe payout matched to the bank, bank-feed categorization, a nursery bill, job costing, deferred revenue, sales tax, the close, financial statements and an optional QuickBooks mirror.',
    cast: [
      { h: 'Greenleaf office', icon: 'leaf', items: [['Tasha Greene', 'office manager, runs billing and collections'], ['Priya Shah', 'bookkeeper, reconciles and closes'], ['Erin Castillo', 'owner, approves write-offs and disputes']] },
      { h: 'Outside', icon: 'users', items: [['Ada and Chidi Okafor', 'design-build clients from the AI design walkthrough'], ['Dana Whitaker, CPA', 'Greenleaf\'s outside accountant, firm access'], ['Maple Hill Nursery', 'plant supplier (fictional)']] },
      { h: 'Agents', icon: 'spark', items: [['Collections (A5)', 'reminders and payment-plan offers'], ['Dispute Evidence (A28)', 'assembles the evidence packet'], ['Bookkeeping (A8) and AP (A9)', 'bank categorization and bill capture [V1]']] }
    ],
    extra: '<p class="wt-note mt14">Account codes follow the chart of accounts in doc 09. Ohio sales tax on landscaping services is shown at 8.0% and marked "verify".</p>'
  },
  screens: {}, bts: {}, actions: {}, inputs: {}, ensure: {}
};

/* m01 */
WT.screens['m01-run'] = function (S) {
  var ex = [['po', 'Maple Ridge HOA: PO number required', 'Enter PO 4471 from the board\'s approval'], ['ver', 'Kovacs mulch enhancement: visit not verified', 'Marco verified it at 3:12 PM'], ['cert', 'Westbrook Church: tax exemption certificate expired', 'New certificate on file']];
  var open = ex.filter(function (e) { return !S.exc[e[0]]; }).length;
  var main = '<div class="apphead"><span class="crumb">Invoices › Billing runs</span><h3>September billing run</h3>' + (S.sent ? pill('ok', 'Sent') : pill('warn', open + ' exceptions')) + '<span class="sp"></span>' + (S.sent ? '' : '<button type="button" class="btn sm primary" data-act="send" data-k="send"' + (open ? ' disabled' : '') + '>Approve and send 214 invoices</button>') + '</div>' +
    '<div class="wt-kpis"><div class="wt-kpi"><div class="l">Per visit</div><div class="v">128</div><div class="d">$41,206</div></div><div class="wt-kpi"><div class="l">Level installments</div><div class="v">61</div><div class="d">$17,940</div></div><div class="wt-kpi"><div class="l">T&amp;M enhancements</div><div class="v">14</div><div class="d">$9,385</div></div><div class="wt-kpi"><div class="l">Milestones</div><div class="v">3</div><div class="d">$19,820</div></div><div class="wt-kpi"><div class="l">Snow, commercial</div><div class="v">8</div><div class="d">$22,600</div></div><div class="wt-kpi"><div class="l">Total</div><div class="v">$110,951</div><div class="d">+ tax $8,428</div></div></div>' +
    '<div class="panel mt10"><h4>Exceptions</h4><ul class="wt-list">' + ex.map(function (e) { var ok = S.exc[e[0]]; return '<li class="wt-row' + (ok ? ' soft' : '') + '"><span class="wt-ic ' + (ok ? 'ok' : 'warn') + '">' + ic(ok ? 'check' : 'warn') + '</span><span>' + e[1] + '<span class="sub">' + (ok ? e[2] : 'Held out of the run until fixed') + '</span></span>' + (ok ? '<span></span>' : '<button type="button" class="btn xs" data-act="exc" data-v="' + e[0] + '" data-k="exc' + e[0] + '">Fix</button>') + '</li>'; }).join('') + '</ul></div>' +
    (S.sent ? '<div class="toast mt10">' + ic('check') + '214 invoices sent: 189 by email, 21 by text, 4 by mail. 61 autopay charges scheduled for Oct 1.</div>' : '');
  return browser('app.rootline.com/t/greenleaf/invoices/runs/2026-09', shell('Invoices', main), 'Greenleaf office: billing run');
};
WT.actions.exc = function (el, S) { S.exc[el.getAttribute('data-v')] = true; };
WT.actions.send = function (el, S) { S.sent = true; };
WT.ensure['m01-run'] = function (S) { S.exc = { po: true, ver: true, cert: true }; S.sent = true; };
WT.bts['m01-run'] = function (S) {
  return {
    what: 'Every billable event (a completed visit, a T&M ticket, a milestone, a snow push) becomes a billable item. The monthly run turns items into invoices according to each agreement\'s billing schedule, and holds anything that isn\'t ready in an exception queue, so nothing goes out wrong and nothing is forgotten.',
    agents: [['Billing Engine', 'Billable items, schedules and runs', 1]],
    trace: [{ c: 'billing_run.preview(Sep)', r: '214 invoices from 1,962 billable items', ms: '2.4 s', det: true }, { c: 'billing_run.exceptions', r: '3 held: PO missing, unverified visit, expired certificate', ms: '—', det: true }, { c: 'billing_run.post(Sep)', r: S.sent ? '214 issued; ledger postings P1-P13' : 'waiting for approval', ms: S.sent ? '6.1 s' : '', det: true, human: !S.sent }],
    hitl: [['Tasha', 'fixes exceptions and approves the run; multi-level approval is available for larger companies [V1].']],
    tags: [['mvp', 'billing engine, runs, exception queue, delivery by email, text and mail']],
    specs: 'Spec: 07 §4.1-4.2 (billable items, billing runs), §4.4 (invoice states) · 09 (posting rules)'
  };
};

/* m02 */
WT.screens['m02-invoice'] = function (S) {
  var doc = '<div class="inv-doc"><div class="hd"><div><b>Greenleaf Grounds Co.</b><div class="tiny faint">Columbus, Ohio · greenleafgrounds.com</div></div><div style="text-align:right"><b>Invoice INV-3121</b><div class="tiny faint">Project P-1203 · Okafor backyard</div></div></div>' +
    '<table class="data tight"><tbody><tr><td>Contract (Better tier, signed)</td><td class="num">$17,590.00</td></tr><tr><td>Milestone 1: deposit at signing (30%), paid</td><td class="num">$5,277.00</td></tr><tr><td><b>Milestone 2: planting complete (40%)</b></td><td class="num"><b>$7,036.00</b></td></tr><tr><td>Remaining after this invoice (30%, at the final walkthrough)</td><td class="num">$5,277.00</td></tr></tbody></table>' +
    '<div class="flex mt10"><span class="tiny">Proof of service:</span>' + pill('', '24 planting photos') + pill('', '70 plants registered for warranty') + pill('', 'As-built plan') + '</div>' +
    '<div class="wt-note mt6">Sales tax is included in the contract price per Greenleaf\'s terms (Ohio taxability of landscaping: verify).</div>' +
    '<div class="flex mt10"><a class="btn primary sm" href="#m03-pay">Pay $7,036.00</a><span class="tiny faint">Due on receipt · bank transfer has no fee</span></div></div>';
  var right = ctxCard('Invoices that explain themselves', ['Milestone invoices show the contract, what\'s been paid and what\'s left, so there are no surprises at the end.', 'Proof of service travels with the invoice: photos, registered plants and the as-built plan, which also helps if a payment is ever disputed.', 'Clients pay from the email, a text link or the portal.']);
  return devRow('<div style="flex:1 1 440px;min-width:0">' + browser('portal.greenleafgrounds.com/invoices/INV-3121', '<div style="padding:14px">' + doc + '</div>', 'Client portal: invoice') + '</div>', right);
};
WT.bts['m02-invoice'] = function (S) {
  return {
    what: 'The planting-complete milestone was reached in the crew app, so the 40% milestone invoice went out in the run. The deposit paid at signing was held as a customer deposit (a liability) until work started, and the invoice shows it.',
    agents: [['Billing Engine', 'Milestone billing gated on phase completion', 1]],
    trace: [{ c: 'phase.completed(P-1203, planting)', r: 'milestone 2 unlocked', ms: '—', det: true }, { c: 'invoice.issued(INV-3121, $7,036.00)', r: 'attachments: photos, plant registry, as-built', ms: '80 ms', det: true }, { c: 'ledger.post(P-milestone)', r: 'Dr 1200 AR $7,036.00 / Cr 4300 Design-Build Revenue $7,036.00', ms: '12 ms', det: true }],
    hitl: [['Tasha', 'approved the run that included this invoice.']],
    tags: [['mvp', 'milestone billing, deposits, proof-of-service attachments, portal invoices']],
    specs: 'Spec: 07 §4.2.5-4.2.6 (deposits, milestones), §4.6 (templates, attachments) · 06 (portal invoices)'
  };
};

/* m03 */
WT.screens['m03-pay'] = function (S) {
  var ach = S.method === 'ach';
  var body = '<p class="ptitle">Pay INV-3121</p><p class="psub">Okafor backyard · planting complete</p><div class="pcard"><div class="flex"><b class="num" style="font-size:1.3rem">$7,036.00</b></div></div>' +
    '<div class="wt-list"><button type="button" class="wt-row' + (ach ? ' sel' : '') + '" data-act="method" data-v="ach" data-k="mach"><span class="wt-ic ok">' + ic('bank') + '</span><span><b>Bank account (ACH)</b><span class="sub">Chase checking ••6621 · no fee</span></span>' + pill('ok', 'No fee') + '</button><button type="button" class="wt-row' + (!ach ? ' sel' : '') + '" data-act="method" data-v="card" data-k="mcard"><span class="wt-ic">' + ic('card') + '</span><span><b>Card</b><span class="sub">Visa ••4242</span></span><span></span></button></div>' +
    (S.paid ? '<div class="toast">' + ic('check') + (ach ? 'Payment started. Bank transfers take up to 4 business days to clear.' : 'Paid by card.') + '</div>' : '<button type="button" class="btn primary bigbtn" data-act="pay" data-k="pay" style="justify-content:center;min-height:48px">Pay $7,036.00</button>') +
    '<div class="wt-note">Paid to Greenleaf Grounds Co. through its own Stripe account. Rootline never holds your money.</div>';
  var right = '<div class="wt-stack" style="flex:1 1 320px;min-width:0">' + ctxCard('Why bank transfer is the default for large invoices', ['ACH costs a fraction of a card fee (the docs assume 0.8% capped at $5, verify), so Greenleaf offers it first on big invoices.', 'An ACH payment over $5,000 is accepted when started, but the next phase is scheduled only after the money clears (OD-23).', 'Card surcharging is not offered at MVP; it comes with compliance gating at [V1].']) +
    (S.paid ? '<div class="panel"><h4>Ledger when it clears</h4>' + je([['1050 Stripe Clearing - USD', 7036, 0], ['1200 Accounts Receivable', 0, 7036]]) + '<div class="wt-note mt6">The ' + (ach ? '$5.00 ACH fee' : 'card fee') + ' posts when Stripe pays out (next step).</div></div>' : '') + '</div>';
  return devRow(phone(body, { sub: 'Client portal', label: 'Client phone: pay invoice' }), right);
};
WT.actions.method = function (el, S) { S.method = el.getAttribute('data-v'); S.paid = false; };
WT.actions.pay = function (el, S) { S.paid = true; };
WT.ensure['m03-pay'] = function (S) { S.paid = true; };
WT.bts['m03-pay'] = function (S) {
  return {
    what: 'The client pays through the Payment Element on Greenleaf\'s connected Stripe account. Bank transfers use Financial Connections to verify the account instantly. The invoice is marked paid only when Stripe confirms; for ACH that is when it clears, and the next project phase waits for it on payments over $5,000.',
    agents: [['Payments', 'Direct charge on the connected account; webhooks', 1]],
    trace: [{ c: 'payment_intent.create(us_bank_account, $7,036.00)', r: 'on Greenleaf\'s connected account', ms: '600 ms', det: true }, { c: 'payments.payment.pending', r: S.paid ? 'ACH initiated; invoice "payment pending"' : 'waiting', ms: S.paid ? '—' : '', det: true, pending: !S.paid }, { c: 'payments.payment.succeeded (day 3)', r: S.paid ? 'invoice paid; Dr 1050 / Cr 1200' : '', ms: S.paid ? '—' : '', det: true, pending: !S.paid }, { c: 'project.gate(final phase)', r: 'scheduled after funds clear (over $5,000)', ms: '—', det: true }],
    hitl: [['The Okafors', 'choose how to pay; no one at Greenleaf touches card data (PCI SAQ-A).']],
    tags: [['mvp', 'card and ACH on the Company\'s own Stripe account, Financial Connections, webhooks'], ['v1', 'surcharging with compliance gating, Canadian PAD']],
    specs: 'Spec: 08 §4.3-4.6 (methods, flows), §4.22 (webhooks) · 24 OD-19, OD-23'
  };
};

/* m04 */
WT.screens['m04-collect'] = function (S) {
  var drafts = [['Hollins', '$199.80', '12 days', 'Friendly reminder with pay link'], ['Abel', '$412.00', '24 days', 'Second reminder; offers bank transfer'], ['Ferris', '$1,284.00', '41 days', 'Payment plan offer: 3 × $428 [V1]'], ['Northgate Dental', '$2,160.00', '63 days', 'Service hold suggested: needs Erin']];
  var main = '<div class="apphead"><span class="crumb">Payments › Receivables</span><h3>Accounts receivable</h3><span class="sp"></span>' + pill('', 'DSO 31 days') + '</div>' +
    '<div class="aging"><div><div class="l">Current</div><div class="v">$46,210</div></div><div><div class="l">1-30</div><div class="v">$8,904</div></div><div class="warn"><div class="l">31-60</div><div class="v">$3,118</div></div><div class="bad"><div class="l">61-90</div><div class="v">$2,160</div></div><div><div class="l">90+</div><div class="v">$0</div></div></div>' +
    '<div class="panel mt10"><div class="ph">Collections agent (A5) · 4 drafts <span class="pill info">L2</span></div><ul class="wt-list">' + drafts.map(function (d, i) { return '<li class="wt-row ai"><span class="wt-ic ai">' + ic(i === 3 ? 'lock' : 'mail') + '</span><span><b>' + d[0] + ' · ' + d[1] + '</b><span class="sub">' + d[2] + ' overdue · ' + d[3] + '</span></span>' + (S.collect ? (i === 3 ? pill('warn', 'Waiting for Erin') : pill('ok', 'Sent')) : '') + '</li>'; }).join('') + '</ul>' +
    '<div class="flex mt10">' + (S.collect ? '<span class="okline">' + ic('check') + '3 reminders sent by Tasha; the service hold went to Erin</span>' : '<button type="button" class="btn sm primary" data-act="collect" data-k="collect">' + ic('check') + 'Approve the 3 reminders</button><span class="cost">4 credits</span>') + '</div></div>' +
    '<div class="wt-callout warn mt10">A service hold pauses non-safety work for a client who hasn\'t paid. It never stops irrigation shut-offs or snow on safety routes, and it needs the owner\'s approval.</div>';
  return browser('app.rootline.com/t/greenleaf/payments/receivables', shell('Payments', main, { Approvals: S.collect ? 1 : 4 }), 'Greenleaf office: receivables');
};
WT.actions.collect = function (el, S) { S.collect = true; };
WT.bts['m04-collect'] = function (S) {
  return {
    what: 'Aging buckets update as payments land. The Collections agent drafts the right next step for each overdue client from Greenleaf\'s dunning sequence: reminders, a payment plan, or a service hold suggestion that only the owner can approve. Late fees, if Greenleaf charges them, follow the state limits table.',
    agents: [['Collections agent (A5)', 'Tiered follow-up, payment plans, hold suggestions', 0], ['Dunning rules', 'Sequences, late-fee limits, holds', 1]],
    trace: [{ c: 'ar.aging(today)', r: '4 clients past due', ms: '120 ms', det: true }, { c: 'agent.A5.draft(×4)', r: '3 messages + 1 hold suggestion', ms: '4.8 s' }, { c: 'approval.decide(Tasha)', r: S.collect ? '3 approved and sent' : 'waiting', ms: S.collect ? 'human' : '', human: !S.collect }, { c: 'approval.route(service hold → owner)', r: 'Erin decides', ms: '—', det: true }],
    hitl: [['Tasha', 'approves reminders.'], ['Erin', 'approves service holds and write-offs above Tasha\'s limit.']],
    levels: ['A5 at L2 (the day-3 reminder may earn L3 later)', 'Risk tier T3: client messages'],
    creditNote: '4 drafts at 1 credit each (Copilot drafting).',
    tags: [['mvp', 'aging, dunning sequences, reminders, service holds with safety exemptions'], ['v1', 'full collections agent with payment plans']],
    specs: 'Spec: 07 §4.8-4.10 (AR, late fees, dunning, holds) · 17 §4.5.6 (A5) · 18 (DSO)'
  };
};

/* m05 */
WT.screens['m05-dispute'] = function (S) {
  var ev = [['file', 'Signed proposal and terms (e-signature audit trail)'], ['camera', '6 visit photos, GPS- and time-stamped at the property'], ['clock', 'Crew time on site: 2 h 40 m, 3 people'], ['mail', 'Completion notice opened by the client on Apr 19'], ['chat', 'Client\'s text: "Looks great, thanks!"']];
  var main = '<div class="apphead"><span class="crumb">Payments › Disputes</span><h3>Dispute · Lindqvist · $485.00 spring cleanup</h3>' + (S.dispute ? pill('info', 'Evidence submitted') : pill('warn', 'Respond in 7 days')) + '</div>' +
    '<div class="wt-cols"><div class="panel"><div class="ph">Dispute Evidence agent (A28)</div><p class="tiny muted">Reason given by the card issuer: "Product or service not provided".</p><ul class="wt-list mt6">' + ev.map(function (e) { return '<li class="wt-row soft"><span class="wt-ic ok">' + ic(e[0]) + '</span><span>' + e[1] + '</span><span>' + ic('check') + '</span></li>'; }).join('') + '</ul>' +
    '<div class="wt-bubble ai mt10">Greenleaf completed the spring cleanup at 41 Rustic Pl on April 18 as agreed in the signed proposal of April 2. GPS-stamped photos show the beds cleared and the lawn edged; the client confirmed by text on April 19.</div>' +
    '<div class="flex mt10">' + (S.dispute ? '<span class="okline">' + ic('check') + 'Submitted by Erin to Stripe</span>' : '<button type="button" class="btn sm primary" data-act="dispute" data-k="dispute">Submit evidence</button><span class="cost">1 credit</span>') + '</div></div>' +
    '<div class="panel"><h4>Ledger when the dispute opened</h4>' + je([['1075 Disputed Payments Receivable', 485, 0], ['6155 Dispute Fees', 15, 0], ['1050 Stripe Clearing - USD', 0, 500]]) + '<div class="wt-note mt6">If Greenleaf wins, the funds return and 1075 clears; if it loses, 1075 moves to 6170 Bad Debt Expense. Stripe charges $15 when a US dispute opens and another $15 when it is countered; the counter fee comes back if Greenleaf wins.</div></div></div>';
  return browser('app.rootline.com/t/greenleaf/payments/disputes/dp_1Q8', shell('Payments', main), 'Greenleaf office: dispute');
};
WT.actions.dispute = function (el, S) { S.dispute = true; };
WT.bts['m05-dispute'] = function (S) {
  return {
    what: 'Disputes are won with evidence, and Rootline already has it: the signed proposal, GPS- and time-stamped visit photos, crew time and the client\'s own messages. The Dispute Evidence agent assembles the packet and drafts the narrative; Erin reviews and submits it to Stripe from Rootline. The ledger tracks the disputed amount separately until it\'s decided.',
    agents: [['Dispute Evidence (A28)', 'Assembles evidence, drafts the narrative', 0], ['Payments', 'Dispute webhooks and submission', 1]],
    trace: [{ c: 'payments.dispute.opened(dp_1Q8)', r: '$485.00 · not provided', ms: '—', det: true }, { c: 'ledger.post(dispute.opened)', r: 'Dr 1075, Dr 6155 / Cr 1050', ms: '12 ms', det: true }, { c: 'agent.A28.assemble', r: '5 evidence items + narrative', ms: '3.4 s' }, { c: 'stripe.dispute.submit_evidence', r: S.dispute ? 'submitted by Erin' : 'waiting', ms: S.dispute ? '900 ms' : '', det: true, human: !S.dispute }],
    hitl: [['Erin', 'reviews and submits; disputes are never answered automatically.']],
    levels: ['A28 at L2'],
    creditNote: 'Narrative drafting: 1 credit; evidence assembly is deterministic.',
    tags: [['mvp', 'dispute handling with automatic evidence assembly']],
    specs: 'Spec: 08 §4.18-4.19 (disputes) · 17 (A28) · 09 (1075, 6155 postings)'
  };
};

/* m06 */
WT.screens['m06-payout'] = function (S) {
  var main = '<div class="apphead"><span class="crumb">Banking › Stripe payouts</span><h3>Payout po_1Q9 · $12,174.27</h3>' + (S.matched ? pill('ok', 'Reconciled') : pill('info', 'Arrived in bank')) + '</div>' +
    '<div class="wt-cols"><div class="panel"><h4>What\'s in it</h4><table class="data tight"><tbody><tr><td>38 card and ACH payments</td><td class="num">$12,512.30</td></tr><tr><td>1 refund (Ferris, duplicate charge)</td><td class="num">-$57.80</td></tr><tr><td>Stripe fees</td><td class="num">-$280.23</td></tr><tr><td><b>Paid to Operating Checking</b></td><td class="num"><b>$12,174.27</b></td></tr></tbody></table>' +
    '<div class="panel soft mt10"><div class="ph">Bank feed · Chase Operating ••0418</div><div class="wt-row' + (S.matched ? ' sel' : '') + '"><span class="wt-ic">' + ic('bank') + '</span><span>STRIPE TRANSFER ST-Q9X2<span class="sub">Oct 2 · $12,174.27</span></span>' + (S.matched ? pill('ok', 'Matched') : '<button type="button" class="btn xs primary" data-act="match" data-k="match">Match</button>') + '</div></div></div>' +
    '<div class="panel"><h4>Journal entry JE-10518 (posted automatically)</h4>' + je([['1010 Operating Checking', 12174.27, 0], ['6150 Merchant Processing Fees', 280.23, 0], ['1050 Stripe Clearing - USD', 0, 12454.50]]) + '<div class="wt-note mt6">Stripe Clearing nets the payments in ($12,512.30) and the refund out ($57.80) to $12,454.50, which leaves with the payout. The clearing account returns to zero for this payout.</div></div></div>';
  return browser('app.rootline.com/t/greenleaf/banking/payouts/po_1Q9', shell('Banking', main), 'Greenleaf office: payout reconciliation');
};
WT.actions.match = function (el, S) { S.matched = true; };
WT.ensure['m06-payout'] = function (S) { S.matched = true; };
WT.bts['m06-payout'] = function (S) {
  return {
    what: 'Every Stripe payout is a bundle of payments, refunds and fees. Rootline reads the payout\'s balance transactions, posts the fees and the transfer automatically, and matches the deposit line in the bank feed, so the Stripe clearing account always ties out. This is the step most landscapers do by hand in QuickBooks today.',
    agents: [['Payments reconciliation', 'Balance transactions to ledger', 1], ['Bank feeds', 'Plaid transactions, matching', 1]],
    trace: [{ c: 'payout.paid(po_1Q9)', r: '40 balance transactions', ms: '—', det: true }, { c: 'ledger.post(JE-10518)', r: 'fees $280.23, transfer $12,174.27', ms: '20 ms', det: true }, { c: 'bank.match(ST-Q9X2 ↔ po_1Q9)', r: S.matched ? 'exact match on amount and reference' : 'suggested', ms: '30 ms', det: true }],
    hitl: [['Priya', 'confirms suggested matches; exact matches can auto-confirm by rule.']],
    tags: [['mvp', 'payout reconciliation, fee posting, Plaid bank feeds, matching']],
    specs: 'Spec: 08 §4.17 (payouts and fee reconciliation, worked entries) · 09 §4.6 (banking)'
  };
};

/* m07 */
WT.screens['m07-bank'] = function (S) {
  var tx = [['SHELL OIL 57442', '$86.40', '5330 Fuel (Truck 12)', 0.97], ['SITEONE LANDSCAPE SUP', '$1,212.18', '5230 Materials - Mulch, Soil and Compost · job J-1188', 0.92], ['HOME DEPOT #3817', '$64.12', '5280 Inventory Shrink? split suggested', 0.61], ['VERIZON WIRELESS', '$412.33', '6240 Telephone and Internet', 0.99], ['OHIO BWC', '$318.00', '6050 Payroll Taxes and Benefits - Admin', 0.88]];
  var main = '<div class="apphead"><span class="crumb">Banking › Chase Operating</span><h3>To review · 38</h3><span class="sp"></span>' + (S.bulk ? pill('ok', '31 accepted') : '<button type="button" class="btn sm primary" data-act="bulk" data-k="bulk">Accept 31 with confidence ≥ 0.90</button>') + '</div>' +
    '<div class="panel"><div class="ph">Bookkeeping agent (A8) suggestions <span class="pill info">V1 · L2</span></div><table class="data tight"><thead><tr><th>Bank line</th><th class="num">Amount</th><th>Suggested account</th><th class="num">Confidence</th></tr></thead><tbody>' + tx.map(function (t) { return '<tr><td>' + t[0] + '</td><td class="num">' + t[1] + '</td><td>' + t[2] + '</td><td class="num">' + (t[3] >= 0.9 ? pill('ok', t[3].toFixed(2)) : pill('warn', t[3].toFixed(2))) + '</td></tr>'; }).join('') + '<tr><td colspan="4" class="tiny faint">+ 33 more</td></tr></tbody></table>' +
    '<div class="wt-callout mt10"><b>Home Depot</b> had two kinds of items on one receipt; the agent suggests splitting it between job materials and shop supplies, and asks for the receipt photo.</div>' +
    '<div class="flex mt10">' + (S.rule ? '<span class="okline">' + ic('check') + 'Rule saved: SHELL OIL → 5330 Fuel, vehicle from the fuel card</span>' : '<button type="button" class="btn sm" data-act="rule" data-k="rule">Make a rule for Shell fuel</button>') + '<span class="cost">10 credits (quoted for 38 lines)</span></div></div>';
  return browser('app.rootline.com/t/greenleaf/banking/review', shell('Banking', main), 'Greenleaf office: bank review');
};
WT.actions.bulk = function (el, S) { S.bulk = true; };
WT.actions.rule = function (el, S) { S.rule = true; };
WT.bts['m07-bank'] = function (S) {
  return {
    what: 'Bank and card lines arrive through Plaid. Rules handle the repeat ones at MVP; at V1 the Bookkeeping agent suggests an account, a job and a class for the rest, with a confidence score. Priya accepts the confident ones in bulk, fixes the odd one and turns patterns into rules, so next month needs less review.',
    agents: [['Bank feed rules', 'Deterministic rules from past decisions [MVP]', 1], ['Bookkeeping agent (A8)', 'Account, job and class suggestions [V1]', 0]],
    trace: [{ c: 'plaid.transactions.sync(Chase ••0418)', r: '38 new lines', ms: '1.9 s', det: true }, { c: 'agent.A8.categorize(38)', r: '31 ≥ 0.90, 6 between 0.6-0.9, 1 split', ms: '7.2 s' }, { c: 'bank.accept(31)', r: S.bulk ? 'posted' : 'waiting', ms: S.bulk ? '300 ms' : '', det: true, human: !S.bulk }, { c: 'rule.create(SHELL OIL → 5330)', r: S.rule ? 'saved' : 'not yet', ms: S.rule ? '20 ms' : '', det: true, pending: !S.rule }],
    hitl: [['Priya', 'approves categorizations; the agent never posts on its own at L2.']],
    levels: ['A8 at L2'],
    creditNote: 'Agent task run, quoted before it ran: 10 credits for 38 lines.',
    tags: [['mvp', 'Plaid feeds, rules, reconciliation UI'], ['v1', 'Bookkeeping agent suggestions']],
    specs: 'Spec: 09 §4.6 (banking), BK-01-05 · 17 §4.5.9 (A8) · 22 §4.4.1'
  };
};

/* m08 */
WT.screens['m08-bills'] = function (S) {
  var lines = [['Cercis canadensis 1.5" cal B&B', 1, 189.00, 189.00, 'ok'], ['Panicum \'Northwind\' #3', 7, 18.50, 18.90, 'var'], ['Amsonia hubrichtii #2', 8, 16.75, 16.75, 'ok'], ['Ilex glabra \'Shamrock\' #3', 4, 24.00, 24.00, 'ok'], ['Ilex glabra \'Gem Box\' #3 (substitution)', 2, 26.50, 26.50, 'ok']];
  var main = '<div class="apphead"><span class="crumb">Bills › Inbox</span><h3>Maple Hill Nursery · invoice 88214</h3>' + (S.billOk ? pill('ok', 'Approved · pay Oct 15') : pill('info', 'Matched to PO-1188')) + '</div>' +
    '<div class="wt-cols"><div class="panel"><div class="ph">AP agent (A9) extraction <span class="pill info">V1</span></div><table class="data tight"><thead><tr><th>Line</th><th class="num">Qty</th><th class="num">PO</th><th class="num">Bill</th></tr></thead><tbody>' + lines.map(function (l) { return '<tr><td>' + l[0] + '</td><td class="num">' + l[1] + '</td><td class="num">' + money(l[2], true) + '</td><td class="num">' + money(l[3], true) + (l[4] === 'var' ? ' ' + pill('warn', '+$0.40') : '') + '</td></tr>'; }).join('') + '<tr><td colspan="4" class="tiny faint">+ 6 more lines · bill total $2,946.40</td></tr></tbody></table>' +
    '<div class="wt-note mt6">3-way match: bill ↔ PO-1188 ↔ receipt RC-771 (Andrés checked 70 plants in). One price is $0.40 a plant over the PO, inside the 2% tolerance.</div></div>' +
    '<div class="panel"><h4>Ledger when approved</h4>' + je([['2020 Goods Received Not Invoiced', 2943.60, 0], ['5270 Purchase Price Variance', 2.80, 0], ['2000 Accounts Payable', 0, 2946.40]]) + '<div class="wt-note mt6">The plants were costed to job P-1203 (5220 Materials - Plants) when they were received.</div>' +
    '<div class="flex mt10">' + (S.billOk ? '<span class="okline">' + ic('check') + 'Approved by Priya; scheduled for payment Oct 15</span>' : '<button type="button" class="btn sm primary" data-act="billOk" data-k="billOk">Approve bill</button><span class="cost">4 credits (2 pages)</span>') + '</div></div></div>';
  return browser('app.rootline.com/t/greenleaf/bills/88214', shell('Approvals', main), 'Greenleaf office: vendor bill');
};
WT.actions.billOk = function (el, S) { S.billOk = true; };
WT.bts['m08-bills'] = function (S) {
  return {
    what: 'A vendor emails a PDF invoice to Greenleaf\'s bills address. At MVP, rules-based OCR reads the header; at V1 the AP agent extracts every line and matches it three ways against the purchase order and the receiving record from the job site. Small variances inside tolerance post to purchase price variance; bigger ones stop for review. Bank-detail changes in vendor emails are never applied by AI.',
    agents: [['AP agent (A9)', 'Line-item extraction and 3-way match [V1]', 0], ['AP rules', 'Tolerances, approvals, payment scheduling', 1]],
    trace: [{ c: 'email.received(bills@)', r: '2-page PDF from Maple Hill Nursery', ms: '—', det: true }, { c: 'agent.A9.extract', r: '11 lines, total $2,946.40', ms: '5.6 s' }, { c: 'match.three_way(PO-1188, RC-771)', r: '1 variance +$0.40 within 2%', ms: '40 ms', det: true }, { c: 'approval.decide(Priya)', r: S.billOk ? 'approved; pay Oct 15' : 'waiting', ms: S.billOk ? 'human' : '', human: !S.billOk }],
    hitl: [['Priya', 'approves bills; payments over her limit go to Erin.']],
    levels: ['A9 at L2', 'Risk tier T4 for bank-detail changes: people only'],
    creditNote: 'Document understanding: 2 credits a page × 2 pages.',
    tags: [['mvp', 'bills, approvals, rules-based header OCR, 3-way match'], ['v1', 'AP agent line extraction']],
    specs: 'Spec: 09 §4.5 (AP), AI2 · 13 §4.10 (3-way match) · 17 §4.5.10 (A9)'
  };
};

/* m09 */
WT.screens['m09-jobcost'] = function (S) {
  var rows = [['Labor', 3920, 4240, '124 h vs 114.6 h budgeted'], ['Materials', 5212, 5318, 'substitution, 2 replacement plants'], ['Equipment', 640, 702, 'skid steer 0.6 h over'], ['Other', 430, 380, 'one dump trip instead of two']];
  var est = rows.reduce(function (t, r) { return t + r[1]; }, 0), act = rows.reduce(function (t, r) { return t + r[2]; }, 0), price = 17590;
  var main = '<div class="apphead"><span class="crumb">Jobs › P-1203</span><h3>Okafor backyard · job costing</h3>' + pill('info', 'Install complete') + '</div>' +
    '<div class="wt-kpis"><div class="wt-kpi"><div class="l">Contract</div><div class="v">' + money(price) + '</div></div><div class="wt-kpi"><div class="l">Estimated cost</div><div class="v">' + money(est) + '</div><div class="d">sold at 42.0% gross margin</div></div><div class="wt-kpi"><div class="l">Actual cost</div><div class="v">' + money(act) + '</div><div class="d">' + ((price - act) / price * 100).toFixed(1) + '% gross margin</div></div><div class="wt-kpi"><div class="l">Billed</div><div class="v">70%</div><div class="d">$12,313 of $17,590</div></div></div>' +
    '<div class="panel mt10"><h4>Estimate vs actual</h4><div class="cost-bars">' + rows.map(function (r) { var mx = 6000; return '<div class="cb"><span>' + r[0] + '</span><span class="tr"><i class="' + (r[2] > r[1] ? 'over' : '') + '" style="width:' + (r[2] / mx * 100).toFixed(1) + '%"></i><b style="left:' + (r[1] / mx * 100).toFixed(1) + '%"></b></span><span class="num tiny">' + money(r[2]) + ' vs ' + money(r[1]) + '<span class="sub" style="display:block;color:var(--text-3)">' + r[3] + '</span></span></div>'; }).join('') + '</div><div class="wt-note mt6">Bar = actual; black mark = estimate. Labor includes burden at Greenleaf\'s rate; equipment at its actual cost per hour.</div></div>' +
    '<div class="wt-callout mt10">The labor overrun came from planting in heavy clay. The estimating engine learns from it: Greenleaf\'s actual production rate for #3 shrubs in clay feeds back into the next estimate.</div>';
  return browser('app.rootline.com/t/greenleaf/jobs/P-1203/costing', shell('Jobs', main), 'Greenleaf office: job costing');
};
WT.bts['m09-jobcost'] = function (S) {
  return {
    what: 'Every hour, material, machine hour and dump fee lands on the job as it happens: crew time segments, receipts from the field, equipment cost per hour and bills. So job costing is live, not a month-end reconstruction. The owner sees where the margin went, and the real production rates feed back into estimating.',
    agents: [['Job costing', 'Actuals from time, inventory, equipment and AP', 1]],
    trace: [{ c: 'jobcost.rollup(P-1203)', r: 'labor 124 h, materials $5,318, equipment $702, other $380', ms: '90 ms', det: true }, { c: 'production_rate.actual(#3 shrubs, clay)', r: '0.52 h each vs 0.40 h budget', ms: '30 ms', det: true }],
    hitl: [['Erin', 'reviews margin; Sam adjusts production rates for clay sites.']],
    tags: [['mvp', 'job costing by cost type, estimate vs actual, production-rate feedback']],
    specs: 'Spec: 09 §4.8 (job costing, WIP) · 18 §4.4 (production rates) · 03 (estimating)'
  };
};

/* m10 */
WT.screens['m10-deferred'] = function (S) {
  var main = '<div class="apphead"><span class="crumb">Ledger › Deferred revenue</span><h3>Level-billed agreements · season to date</h3></div>' +
    '<div class="wt-kpis"><div class="wt-kpi"><div class="l">Agreements</div><div class="v">61</div></div><div class="wt-kpi"><div class="l">Billed</div><div class="v">$107,640</div></div><div class="wt-kpi"><div class="l">Earned (visits done)</div><div class="v">$111,215</div></div><div class="wt-kpi"><div class="l">Unbilled earned</div><div class="v">$3,575</div><div class="d">billing behind the work</div></div></div>' +
    '<div class="panel mt10"><h4>Season-end true-up · SA-0977 · Delgado</h4><dl class="kv"><dt>Planned</dt><dd>30 visits at $73</dd><dt>Done</dt><dd>25 visits (5 weather skips)</dd><dt>Allowance</dt><dd>3 weather skips without credit</dd><dt>Credit due</dt><dd class="num">2 × $73 = $146.00</dd><dt>Billed</dt><dd>8 × $273.75 = $2,190.00</dd></dl>' +
    (S.trueup ? '<div class="mt10">' + je([['4100 Maintenance Revenue', 146, 0], ['2180 Customer Credits', 0, 146]]) + '<div class="okline mt6">' + ic('check') + 'Credit applied to next season\'s first installment; client notified</div></div>' : '<div class="flex mt10"><button type="button" class="btn sm primary" data-act="trueup" data-k="trueup">Post true-up</button><span class="tiny faint">or refund to the card</span></div>') + '</div>';
  return browser('app.rootline.com/t/greenleaf/ledger/deferred', shell('Ledger', main), 'Greenleaf office: deferred revenue');
};
WT.actions.trueup = function (el, S) { S.trueup = true; };
WT.bts['m10-deferred'] = function (S) {
  return {
    what: 'Level billing smooths cash for clients, but revenue is earned when visits happen. Rootline keeps an earned-value meter per agreement: installments billed ahead of the work sit in deferred revenue, work done ahead of billing shows as unbilled. At season end the true-up applies the skip policy automatically.',
    agents: [['Billing Engine', 'Earned-value meter and true-up', 1]],
    trace: [{ c: 'agreements.earned_value(61 level-billed)', r: 'billed $107,640 · earned $111,215', ms: '400 ms', det: true }, { c: 'trueup.compute(SA-0977)', r: '2 skips beyond allowance → $146 credit', ms: '15 ms', det: true }, { c: 'ledger.post(trueup)', r: S.trueup ? 'Dr 4100 / Cr 2180' : 'waiting', ms: S.trueup ? '12 ms' : '', det: true, pending: !S.trueup }],
    hitl: [['Priya', 'posts true-ups; refunds instead of credits follow the refund approval limits.']],
    tags: [['mvp', 'level billing with earned value, deferred revenue, automatic true-up']],
    specs: 'Spec: 07 §4.2.3 (level billing), §4.3 (skip policy) · 09 (deferred revenue recognition)'
  };
};

/* m11 */
WT.screens['m11-close'] = function (S) {
  var steps = [['All bank and card accounts reconciled', true], ['Stripe clearing ties to zero', true], ['AR and AP agings reviewed', true], ['Payroll journal imported (Gusto)', true], ['Deferred revenue and true-ups posted', true], ['Depreciation run', true], ['Sales tax liability reviewed', true]];
  var main = '<div class="apphead"><span class="crumb">Ledger › Close</span><h3>September close</h3>' + (S.locked ? pill('ok', 'Locked') : pill('info', '7 of 7 done')) + '</div>' +
    '<div class="wt-cols"><div class="panel"><h4>Checklist</h4><ul class="close-list">' + steps.map(function (s) { return '<li><span>' + ic('check') + '</span><span>' + s[0] + '</span><span class="tiny faint">Priya</span></li>'; }).join('') + '</ul><div class="flex mt10">' + (S.locked ? '<span class="okline">' + ic('lock') + 'September locked. Reopening needs an approved request and a second approver after 90 days.</span>' : '<button type="button" class="btn sm primary" data-act="lock" data-k="lock">' + ic('lock') + 'Lock September</button>') + '</div></div>' +
    '<div class="wt-stack"><div class="panel"><h4>Sales tax · September (verify rates)</h4><table class="data tight"><thead><tr><th>Jurisdiction</th><th class="num">Taxable</th><th class="num">Tax</th></tr></thead><tbody><tr><td>Franklin County, OH (8.0%)</td><td class="num">$92,616</td><td class="num">$7,409.28</td></tr><tr><td>Delaware County, OH (7.25%)</td><td class="num">$14,055</td><td class="num">$1,018.99</td></tr><tr><td>Exempt (church, school)</td><td class="num">$4,280</td><td class="num">$0.00</td></tr></tbody></table><div class="wt-note mt6">Balance in 2101 Sales Tax Payable - Ohio matches. Filing through a partner is [V1].</div></div>' +
    '<div class="panel soft"><h4>' + ic('users') + ' Accountant Hub</h4><p class="tiny muted">Dana Whitaker, CPA sees Greenleaf with firm access: trial balance, adjusting entries she can propose, the close status of all her clients. No extra seat cost.</p></div></div></div>';
  return browser('app.rootline.com/t/greenleaf/ledger/close/2026-09', shell('Ledger', main), 'Greenleaf office: close');
};
WT.actions.lock = function (el, S) { S.locked = true; };
WT.ensure['m11-close'] = function (S) { S.locked = true; };
WT.bts['m11-close'] = function (S) {
  return {
    what: 'Because postings happen when events happen, month-end is a checklist, not a project. Priya confirms each step, reviews sales tax by jurisdiction and locks the period. Greenleaf\'s outside CPA works in the same books through the free Accountant Hub.',
    agents: [['Ledger', 'Period close, locks, reports', 1]],
    trace: [{ c: 'close.checklist(Sep)', r: '7 of 7 complete', ms: '—', det: true }, { c: 'report.sales_tax(Sep)', r: '$8,428.27 owed; ties to 2101', ms: '220 ms', det: true }, { c: 'period.lock(Sep)', r: S.locked ? 'locked by Priya' : 'open', ms: S.locked ? '15 ms' : '', det: true, human: !S.locked }],
    hitl: [['Priya', 'locks the period.'], ['Erin, or Priya under Erin\'s policy', 'can reopen it; older periods need two approvers.']],
    tags: [['mvp', 'close checklist, period locks, sales tax liability, Accountant Hub (basic)'], ['v1', 'automated sales tax filing']],
    specs: 'Spec: 09 §4.1.5 (periods and locks), §4.12 (close), §4.16 (sales tax) · 07 §4.5 · 02 (Accountant Hub)'
  };
};

/* m12 */
WT.screens['m12-statements'] = function (S) {
  var D = { maintenance: [62840, 38110], design: [41230, 25890], snow: [6880, 4120] };
  var keys = S.div === 'all' ? ['maintenance', 'design', 'snow'] : [S.div];
  var rev = keys.reduce(function (t, k) { return t + D[k][0]; }, 0), cogs = keys.reduce(function (t, k) { return t + D[k][1]; }, 0), opex = S.div === 'all' ? 24310 : Math.round(24310 * D[S.div][0] / 110950);
  var main = '<div class="apphead"><span class="crumb">Reports › Financial statements</span><h3>Profit and loss · September</h3><span class="sp"></span><div class="seg" role="group" aria-label="Division">' + [['all', 'All'], ['maintenance', 'Maintenance'], ['design', 'Design-build'], ['snow', 'Snow']].map(function (d) { return '<button type="button" data-act="div" data-v="' + d[0] + '" data-k="d' + d[0] + '" aria-pressed="' + (S.div === d[0]) + '">' + d[1] + '</button>'; }).join('') + '</div></div>' +
    '<div class="wt-cols wide-left"><div class="panel"><table class="data tight pl"><tbody><tr class="h"><td>Revenue</td><td class="n">' + money(rev) + '</td></tr><tr><td>Cost of revenue (labor, materials, equipment, subs)</td><td class="n">' + money(cogs) + '</td></tr><tr class="t"><td>Gross profit</td><td class="n">' + money(rev - cogs) + ' (' + ((rev - cogs) / rev * 100).toFixed(1) + '%)</td></tr><tr><td>Overhead' + (S.div === 'all' ? '' : ' (allocated by revenue)') + '</td><td class="n">' + money(opex) + '</td></tr><tr class="t"><td>Net operating income</td><td class="n">' + money(rev - cogs - opex) + '</td></tr></tbody></table><div class="wt-note mt6">Snow in September is pre-season salt and contracts billed early (illustrative).</div></div>' +
    '<div class="wt-stack"><div class="panel"><h4>Balance sheet (Sep 30)</h4><dl class="kv"><dt>Cash</dt><dd class="num">$184,210</dd><dt>Receivables</dt><dd class="num">$60,392</dd><dt>Customer deposits</dt><dd class="num">$21,440</dd><dt>Deferred revenue</dt><dd class="num">$8,925</dd><dt>Equipment loans</dt><dd class="num">$96,300</dd></dl></div><div class="panel"><h4>Cash this month</h4><dl class="kv"><dt>Collected</dt><dd class="num">$118,604</dd><dt>Paid out</dt><dd class="num">$97,882</dd><dt>Net</dt><dd class="num">+$20,722</dd></dl></div></div></div>';
  return browser('app.rootline.com/t/greenleaf/reports/pl/2026-09', shell('Reports', main), 'Greenleaf office: financial statements');
};
WT.actions.div = function (el, S) { S.div = el.getAttribute('data-v'); };
WT.bts['m12-statements'] = function (S) {
  return {
    what: 'Statements come straight from the ledger with division and job dimensions on every line, so Erin can see maintenance, design-build and snow separately without spreadsheets. The numbers tie to the KPI dashboards because both read the same postings.',
    agents: [['Reports', 'P&L, balance sheet, cash from the ledger', 1]],
    trace: [{ c: 'report.pl(Sep, division=' + S.div + ')', r: 'from 6,212 journal lines', ms: '310 ms', det: true }, { c: 'report.balance_sheet(Sep 30)', r: 'balanced', ms: '180 ms', det: true }],
    hitl: [['Erin and the CPA', 'read; the reports never change the books.']],
    tags: [['mvp', 'P&L by division and class, balance sheet, cash summary, budget vs actual']],
    specs: 'Spec: 09 §4.10 (financial statements) · 18 (KPI Dictionary)'
  };
};

/* m13 */
WT.screens['m13-qbo'] = function (S) {
  var map = [['4100 Maintenance Revenue', 'Lawn Maintenance Income'], ['4300 Design-Build and Installation Revenue', 'Landscape Installs'], ['1050 Stripe Clearing - USD', 'Stripe (bank)'], ['6150 Merchant Processing Fees', 'Merchant Fees']];
  var main = '<div class="apphead"><span class="crumb">Settings › Integrations</span><h3>QuickBooks Online</h3>' + pill('ok', 'Mirror mode') + '<span class="sp"></span>' + pill('', 'Last sync 2 min ago') + '</div>' +
    '<div class="wt-cols"><div class="panel"><h4>Mode</h4><p class="tiny muted">Rootline\'s ledger is the book of record. QuickBooks receives a mirror of invoices, payments, fees, payouts and journal summaries for the CPA who still works there. Using QuickBooks is optional.</p><table class="data tight mt6"><thead><tr><th>Rootline account</th><th>QuickBooks account</th></tr></thead><tbody>' + map.map(function (m) { return '<tr><td>' + m[0] + '</td><td>' + m[1] + '</td></tr>'; }).join('') + '</tbody></table></div>' +
    '<div class="panel"><h4>Sync issue</h4><div class="wt-callout warn">Invoice INV-3107 was edited in QuickBooks (line amount changed from $292.00 to $280.00).</div>' +
    (S.conflict ? '<div class="okline mt6">' + ic('check') + (S.conflict === 'revert' ? 'QuickBooks copy restored from Rootline' : 'Credit memo CM-212 for $12.00 created in Rootline and synced') + '</div>' : '<div class="flex mt10"><button type="button" class="btn sm primary" data-act="conflict" data-v="revert" data-k="crev">Restore QuickBooks from Rootline</button><button type="button" class="btn sm" data-act="conflict" data-v="memo" data-k="cmemo">Issue a $12 credit memo instead</button></div>') +
    '<div class="wt-note mt6">One failing record never blocks the rest of a client\'s sync; it waits here with the reason.</div></div></div>';
  return browser('app.rootline.com/t/greenleaf/settings/integrations/quickbooks', shell('Settings', main), 'Greenleaf office: QuickBooks sync');
};
WT.actions.conflict = function (el, S) { S.conflict = el.getAttribute('data-v'); };
WT.bts['m13-qbo'] = function (S) {
  return {
    what: 'Companies can keep QuickBooks Online for their CPA without it running their books. In mirror mode Rootline pushes the postings with an account map; edits made in QuickBooks show up as sync issues, and the fix is made where the book of record lives. One bad record is isolated instead of blocking a whole client.',
    agents: [['Accounting sync', 'QuickBooks Online connector, mapping, conflicts', 1]],
    trace: [{ c: 'qbo.sync(push, Sep)', r: '214 invoices, 196 payments, 1 payout journal', ms: '48 s', det: true }, { c: 'qbo.cdc(changes since last sync)', r: '1 edit to INV-3107 in QuickBooks', ms: '1.2 s', det: true }, { c: 'sync.resolve(INV-3107)', r: S.conflict ? (S.conflict === 'revert' ? 'QuickBooks restored' : 'credit memo CM-212') : 'waiting for Priya', ms: S.conflict ? '900 ms' : '', det: true, human: !S.conflict }],
    hitl: [['Priya', 'resolves sync issues; nothing in Rootline changes because of an edit in QuickBooks unless she says so.']],
    tags: [['mvp', 'QuickBooks Online connector, migration, mirror mode'], ['v1', 'Xero and QuickBooks Desktop']],
    specs: 'Spec: 09 §4.13-4.15 (QuickBooks and Xero, modes A-C, conflicts) · 24 §4.6'
  };
};

/* m14 */
WT.screens['m14-recap'] = function (S) {
  var rows = [['Billing run', 'Billing Engine', 'Rules', 'Tasha', '0'], ['Client payment', 'Stripe on Greenleaf\'s account', 'Rules', 'The Okafors', '0'], ['Collections', 'Collections agent (A5)', 'AI', 'Tasha, Erin', '4'], ['Dispute', 'Dispute Evidence agent (A28)', 'AI', 'Erin', '1'], ['Payout', 'Reconciliation and bank match', 'Rules', 'Priya', '0'], ['Bank feed', 'Bookkeeping agent (A8)', 'AI [V1]', 'Priya', '10'], ['Vendor bill', 'AP agent (A9) and 3-way match', 'AI [V1]', 'Priya', '4'], ['Job costing, deferred revenue, tax, close, statements, QuickBooks', 'Ledger', 'Rules', 'Priya, Erin', '0']];
  return '<div class="wt-cols wide-left"><div class="panel"><h4>Everything that ran</h4><div class="table-scroll"><table class="data tight"><thead><tr><th>Step</th><th>What ran</th><th>Kind</th><th>Approved by</th><th class="num">Credits</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + (/AI/.test(r[2]) ? pill('ai', r[2]) : pill('', r[2])) + '</td><td>' + r[3] + '</td><td class="num">' + r[4] + '</td></tr>'; }).join('') + '<tr><td colspan="4"><b>Total</b></td><td class="num"><b>19</b></td></tr></tbody></table></div></div>' +
    '<div class="wt-stack"><div class="panel"><h4>Why this matters</h4><p class="tiny muted">Every posting in this walkthrough was balanced and made when the event happened: invoice, deposit, payment, fee, payout, dispute, bill, true-up. That is why the close is a checklist and why QuickBooks is optional.</p></div><div class="panel"><h4>Scope</h4><div style="display:grid;gap:5px"><div class="tagrow">' + tag('mvp') + '<span class="note">billing engine, payments, dunning, disputes, payout reconciliation, bank feeds and rules, bills and 3-way match, job costing, deferred revenue, close, statements, QuickBooks Online</span></div><div class="tagrow">' + tag('v1') + '<span class="note">Bookkeeping and AP agents, payment plans, surcharging, tax filing, Xero and QuickBooks Desktop</span></div></div></div>' +
    '<div class="flex"><a class="btn" href="#overview">' + ic('arrow-l') + 'Back to start</a><a class="btn" href="prototype.html">AI design walkthrough</a><a class="btn primary" href="walkthroughs.html">All walkthroughs ' + ic('arrow-r') + '</a></div></div></div>';
};
WT.bts['m14-recap'] = function (S) {
  return {
    what: 'Money in Rootline is mostly rules: billing, payments, postings, reconciliation and reports. AI agents help where there is judgment or reading to do (collections messages, dispute narratives, categorizing bank lines, reading vendor bills), and a person approves each of them.',
    hitl: [['People approved', 'the billing run, every collection message, the dispute, every categorization, the bill and the close.']],
    creditNote: '19 credits for the month\'s money work.',
    tags: [['mvp', 'most of the money loop'], ['v1', 'Bookkeeping and AP agents']],
    specs: 'Spec: 07, 08, 09, 13, 17, 18, 24'
  };
};
