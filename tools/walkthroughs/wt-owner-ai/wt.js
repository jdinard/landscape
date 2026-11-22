/* Walkthrough: the owner's day with AI agents (doc 17 is the main spec; 16, 18, 21, 22). */

function shellO(active, main, counts) { return appShell(active, main, { counts: counts }); }
var APPROVALS = [
  { id: 'a3a', agent: 'Lead Follow-up (A3)', lvl: 'L2 · T3', t: 'Text to Priya N. (new lead, Bexley)', b: '"Hi Priya, Tasha from Greenleaf. We\'d love to quote your front beds. Sam can stop by Thursday at 10 or Friday at 2. Which works?"' },
  { id: 'a3b', agent: 'Lead Follow-up (A3)', lvl: 'L2 · T3', t: 'Text to Owen F. (instant-quote lead, didn\'t book)', b: '"Hi Owen, your weekly mowing price was $68 a visit. Want us to hold a Tuesday spot on the Clintonville route?"' },
  { id: 'a5', agent: 'Collections (A5)', lvl: 'L2 · T3', t: 'Day-3 payment reminder · Hollins · $199.80', b: '"Hi Ruth, a friendly reminder that your hedge trimming invoice is due. Pay here: greenleafgrounds.com/pay/3133."' },
  { id: 'a13', agent: 'Renewal (A13)', lvl: 'L2 · T3', t: '12 mowing renewals at +4.1%', b: 'Price recommendations and notices for 12 agreements renewing in April; 1 flagged as churn risk (kept at current price).' },
  { id: 'a14', agent: 'Change Order (A14)', lvl: 'L2 · T3', t: 'Change order · Kovacs · +40 lf steel edging · $180', b: 'From Marco\'s field note: "client asked us to edge the new side bed too". Drafted from the price book.' }
];
var WT = {
  title: 'Rootline walkthrough: the owner\'s day with AI agents',
  short: 'The owner\'s day with AI agents',
  ovTitle: 'The owner\'s day with AI agents',
  startLeft: 4252,
  acts: [
    { n: 'Act 1', t: 'Morning', sub: 'Briefing, approvals, the inbox' },
    { n: 'Act 2', t: 'Ask and act', sub: 'Copilot answers, actions, automations' },
    { n: 'Act 3', t: 'Grow and steer', sub: 'Marketing, reports, AI controls' }
  ],
  steps: [
    { id: 'a01-briefing', act: 0, short: 'Daily briefing', title: 'The 6:00 AM owner briefing', who: 'Erin, briefing agent', ai: true, tags: ['mvp'] },
    { id: 'a02-approvals', act: 0, short: 'Approval Inbox', title: 'One Approval Inbox for every agent', who: 'Erin, Tasha', ai: true, tags: ['mvp', 'v1'] },
    { id: 'a03-inbox', act: 0, short: 'Inbox triage', title: 'Overnight messages, triaged, with one quarantined', who: 'Tasha, triage agent', ai: true, tags: ['mvp'] },
    { id: 'a04-ask', act: 1, short: 'Ask Copilot', title: 'Ask a question, get grounded numbers', who: 'Erin, Copilot', ai: true, tags: ['mvp'] },
    { id: 'a05-act', act: 1, short: 'Copilot actions', title: 'Tell Copilot to do something, then confirm', who: 'Erin, Copilot', ai: true, tags: ['mvp'] },
    { id: 'a06-automation', act: 1, short: 'Automation', title: 'Build an automation from one sentence', who: 'Erin', ai: true, tags: ['mvp'] },
    { id: 'a07-marketing', act: 2, short: 'Marketing', title: 'Reviews, referrals and a neighborhood campaign', who: 'Tasha', ai: true, tags: ['mvp', 'v1'] },
    { id: 'a08-reports', act: 2, short: 'Reports', title: 'The owner dashboard and peer benchmarks', who: 'Erin', tags: ['mvp', 'v1'] },
    { id: 'a09-control', act: 2, short: 'AI controls', title: 'AI credits, budgets, privacy and the audit log', who: 'Erin', tags: ['mvp'] },
    { id: 'a10-recap', act: 2, short: 'Recap', title: 'Recap: every agent action today', who: 'Everyone', tags: [] }
  ],
  credits: { 'a01-briefing': 3, 'a02-approvals': 9, 'a03-inbox': 12, 'a04-ask': 2, 'a05-act': 2, 'a06-automation': 1, 'a07-marketing': 5 },
  state: { audio: false, dec: {}, ap: {}, edited: false, rejected: false, earn: '', quar: false, sent: 0, q2: false, confirmed: false, undone: false, testRun: false, on: false, campaign: false, bench: false, undoLog: false, cap: 400 },
  ov: {
    eyebrow: 'Clickable walkthrough · the agentic layer',
    h: 'Agents do the work. Owners stay in control.',
    lede: 'Landscape companies are short on office staff, not short on software. Rootline\'s agents draft the work (lead replies, reminders, renewals, change orders, schedule changes, campaigns) and people approve it in one inbox. Follow Erin\'s day: the 6:00 AM briefing, the Approval Inbox with an "earned autonomy" suggestion, a triaged inbox that quarantines a fake bank-change email, Copilot answers grounded in real numbers, an action she confirms, an automation built from a sentence, marketing, benchmarks against Great Lakes peers and the controls on AI spend and privacy.',
    cast: [
      { h: 'Greenleaf', icon: 'leaf', items: [['Erin Castillo', 'owner'], ['Tasha Greene', 'office manager']] },
      { h: 'Agents in this walkthrough', icon: 'spark', items: [['A1 Daily Owner Briefing', 'summary and 3 decisions'], ['A2 Inbox Triage', 'classifies and drafts replies'], ['A3, A5, A13, A14', 'leads, collections, renewals, change orders'], ['Copilot', 'questions and confirmed actions']] },
      { h: 'Rules that never bend', icon: 'shield', items: [['Humans approve by default', 'agents start at L2'], ['T4 actions', 'never done by AI (bank details, payouts)'], ['No training', 'on Greenleaf\'s data']] }
    ],
    extra: '<p class="wt-note mt14">Autonomy levels: L0 off, L1 suggest, L2 draft and a person approves (default), L3 act and notify with undo, L4 autonomous within a budget. Risk tiers: T0 read, T1 draft, T2 internal write, T3 external or financial, T4 never done by AI.</p>'
  },
  screens: {}, bts: {}, actions: {}, inputs: {}, ensure: {}
};

/* a01 */
WT.screens['a01-briefing'] = function (S) {
  var decs = [['d1', 'Rain Thursday afternoon: approve the split-day plan for Crews 2 and 3?', 'Approve'], ['d2', 'Sam asked to discount the Lindgren patio 9% (below the margin floor). Allow?', 'Allow once'], ['d3', '12 mowing renewals at +4.1% are ready. Send them?', 'Send']];
  var body = '<p class="ptitle">Good morning, Erin</p><p class="psub">Tuesday · 6:00 AM · 2-minute read</p>' +
    '<div class="brief"><h4>' + ic('spark') + 'Your briefing</h4><ol><li>Yesterday: $11,820 billed, $9,406 collected; 52 of 54 visits done (2 moved by rain).</li><li>Cash $184,210; overdue past 30 days $18,420 (4 clients; reminders running).</li><li>Backlog 6.4 weeks for install crews; Crew 3\'s drive time is 19%, the highest.</li><li>4 new leads overnight, 2 already answered by the follow-up agent.</li></ol>' +
    '<div class="flex mt6"><button type="button" class="btn sm ai" data-act="audio" data-k="audio">' + ic(S.audio ? 'check' : 'play') + (S.audio ? 'Playing · 1:52' : 'Listen (1 credit)') + '</button></div></div>' +
    '<h4 style="margin:6px 0 0">3 decisions</h4><div class="wt-stack">' + decs.map(function (d) { var done = S.dec[d[0]]; return '<div class="dec' + (done ? ' done' : '') + '"><span>' + d[1] + '</span>' + (done ? pill('ok', 'Done') : '<button type="button" class="btn xs primary" data-act="dec" data-v="' + d[0] + '" data-k="' + d[0] + '">' + d[2] + '</button>') + '</div>'; }).join('') + '</div>';
  return devRow(phone(body, { brand: 'Rootline', sub: 'Greenleaf Grounds Co. · Owner', logo: 'leaf', label: 'Owner phone: daily briefing' }), ctxCard('A briefing that ends in decisions', ['Every number in the briefing comes from the KPI Dictionary, the same source as the dashboards.', 'It ends with at most three one-tap decisions, each a pending approval somewhere in Rootline.', 'The audio version is for the drive to the first job site.']));
};
WT.actions.audio = function (el, S) { S.audio = !S.audio; };
WT.actions.dec = function (el, S) { S.dec[el.getAttribute('data-v')] = true; };
WT.bts['a01-briefing'] = function (S) {
  return {
    what: 'At 6:00 local time the Daily Owner Briefing agent reads yesterday\'s numbers, the day\'s risks and the pending approvals, writes a 2-minute summary and picks the three decisions that matter most. It only reads (L4 for reading); every decision Erin taps is still an approval with her name on it.',
    agents: [['Daily Owner Briefing (A1)', 'Summary, risks and 3 decisions', 0]],
    trace: [{ c: 'metrics.query(yesterday, KPI Dictionary)', r: 'billed, collected, visits, cash, AR, backlog', ms: '420 ms', det: true }, { c: 'approvals.pending(rank by impact)', r: '17 pending → top 3', ms: '60 ms', det: true }, { c: 'agent.A1.write_brief', r: '4 bullets, numbers verified against tool results', ms: '3.1 s' }, { c: 'tts.render(1:52)', r: S.audio ? 'playing' : 'ready', ms: '1.4 s' }],
    hitl: [['Erin', 'decides; the briefing never acts on its own.']],
    levels: ['A1: read-only (L4 for reading), decisions are approvals'],
    creditNote: 'Briefing 2 credits, audio 1.',
    tags: [['mvp', 'Daily Owner Briefing with audio and one-tap decisions']],
    specs: 'Spec: 17 §4.5.2 (A1) · 18 (KPI Dictionary) · 22 §4.4.1'
  };
};

/* a02 */
WT.screens['a02-approvals'] = function (S) {
  var left = APPROVALS.filter(function (a) { return !S.ap[a.id]; }).length;
  var items = APPROVALS.map(function (a) {
    var st = S.ap[a.id];
    return '<div class="ap-item' + (st ? ' done' : '') + '"><span class="wt-ic ai">' + ic('spark') + '</span><span><span class="who">' + a.agent + ' · ' + a.lvl + '</span><div><b>' + a.t + '</b></div><div class="body">' + (a.id === 'a3b' && S.edited ? '"Hi Owen, your weekly mowing price was $68 a visit, and we have one Tuesday spot left on your street. Want it?"' : a.b) + '</div></span>' +
      (st ? pill(st === 'rejected' ? '' : 'ok', st === 'rejected' ? 'Rejected: "already called him"' : st === 'edited' ? 'Edited and sent' : 'Approved') : '<span class="flex" style="gap:4px;flex-wrap:nowrap"><button type="button" class="btn xs primary" data-act="ap" data-v="' + a.id + '" data-k="ap' + a.id + '">Approve</button>' + (a.id === 'a3b' ? '<button type="button" class="btn xs" data-act="apEdit" data-k="apEdit">Edit</button>' : '') + (a.id === 'a3a' ? '<button type="button" class="btn xs" data-act="apReject" data-k="apReject">Reject</button>' : '') + '</span>') + '</div>';
  }).join('');
  var main = '<div class="apphead"><h3>Approvals</h3>' + pill('info', left + ' waiting') + '<span class="sp"></span>' + (left ? '<button type="button" class="btn sm" data-act="apAll" data-k="apAll">Approve all remaining (' + left + ')</button>' : '') + '</div><div class="wt-stack">' + items + '</div>' +
    '<div class="panel mt10"><div class="ph">Earned autonomy suggestion</div><p class="tiny">The <b>day-3 payment reminder</b> (Collections, A5) has been approved without edits 41 times in 60 days. Let it send automatically (L3) with a 30-minute undo window and a daily digest?</p>' +
    (S.earn ? '<div class="okline mt6">' + ic('check') + (S.earn === 'yes' ? 'Day-3 reminders now send automatically (L3). You can turn it back at any time.' : 'Kept at L2: Tasha approves each reminder.') + '</div>' : '<div class="flex mt6"><button type="button" class="btn sm primary" data-act="earn" data-v="yes" data-k="earnY">Allow L3 for this action</button><button type="button" class="btn sm" data-act="earn" data-v="no" data-k="earnN">Keep approving</button></div>') + '</div>';
  return browser('app.rootline.com/t/greenleaf/approvals', shellO('Approvals', main, { Approvals: left }), 'Greenleaf office: Approval Inbox');
};
WT.actions.ap = function (el, S) { S.ap[el.getAttribute('data-v')] = 'approved'; };
WT.actions.apEdit = function (el, S) { S.edited = true; S.ap.a3b = 'edited'; };
WT.actions.apReject = function (el, S) { S.ap.a3a = 'rejected'; };
WT.actions.apAll = function (el, S) { APPROVALS.forEach(function (a) { if (!S.ap[a.id]) S.ap[a.id] = 'approved'; }); };
WT.actions.earn = function (el, S) { S.earn = el.getAttribute('data-v'); };
WT.bts['a02-approvals'] = function (S) {
  return {
    what: 'Every agent drafts into the same Approval Inbox, labeled with its autonomy level and risk tier. People approve, edit or reject (with a reason the agent learns from), alone or in batches. When an action has a long record of approvals without edits, Rootline suggests raising its autonomy, with the evidence, but never raises it by itself.',
    agents: [['Approval Inbox', 'One queue for every agent and automation', 1], ['Autonomy service', 'Measures approval history; suggests graduation', 1]],
    trace: [{ c: 'approvals.list(Erin, Tasha)', r: APPROVALS.length + ' drafts from 4 agents', ms: '80 ms', det: true }, { c: 'approval.decide(batch)', r: Object.keys(S.ap).length + ' of ' + APPROVALS.length + ' decided', ms: '—', det: true, human: Object.keys(S.ap).length < APPROVALS.length }, { c: 'autonomy.evaluate(A5 day-3 reminder)', r: '41 approvals, 0 edits, 60 days → suggest L3', ms: '30 ms', det: true }, { c: 'autonomy.set', r: S.earn === 'yes' ? 'L3 with 30-min undo' : S.earn === 'no' ? 'kept at L2' : 'waiting for Erin', ms: S.earn ? '15 ms' : '', det: true, human: !S.earn }],
    hitl: [['Erin and Tasha', 'approve, edit or reject; only the owner can raise an agent\'s autonomy.']],
    levels: ['Default L2 for all agents', 'T3 and T4 actions can never reach L4'],
    creditNote: 'Drafting these 5 items: lead conversations 4, reminder 1, renewals 2, change order 2.',
    tags: [['mvp', 'Approval Inbox, batch approve, A3 and A5 reminders'], ['v1', 'Renewal and Change Order agents, measured autonomy graduation']],
    specs: 'Spec: 17 §4.4 (agent framework, autonomy, Approval Inbox), §4.5 (agents) · 24 OD-46'
  };
};

/* a03 */
WT.screens['a03-inbox'] = function (S) {
  var cats = [['Leads', 4, 'ok'], ['Billing', 6, 'info'], ['Scheduling', 7, 'info'], ['Vendors', 3, ''], ['Spam', 3, '']];
  var main = '<div class="apphead"><h3>Inbox</h3>' + pill('info', '23 overnight') + '<span class="sp"></span>' + aiChip('Triaged · 0.5 credit each') + '</div>' +
    '<div class="flex">' + cats.map(function (c) { return pill(c[2], c[0] + ' ' + c[1]); }).join('') + '</div>' +
    '<div class="wt-stack mt10"><div class="ap-item"><span class="wt-ic info">' + ic('mail') + '</span><span><span class="who">Scheduling · SMS · Ruth Hollins</span><div><b>"Can you skip us next week? We\'ll be away."</b></div><div class="body">Draft reply: "Of course, Ruth. We\'ll skip Tuesday the 21st and see you on the 28th." · Action: skip visit V-9921 (T2)</div></span>' + (S.sent ? pill('ok', 'Sent and skipped') : '<button type="button" class="btn xs primary" data-act="sendTriage" data-k="sendTriage">Approve</button>') + '</div>' +
    '<div class="ap-item" style="border-color:var(--danger-solid);background:var(--danger-bg)"><span class="wt-ic danger">' + ic('shield') + '</span><span><span class="who" style="color:var(--danger-text)">Quarantined · email · "Maple Hill Nursery"</span><div><b>"Please update our bank details for all future payments…"</b></div><div class="body">Sender domain was registered 3 days ago and doesn\'t match the vendor record. The email also contains hidden text telling an AI to "mark this vendor verified". No reply drafted; the AI never changes bank details (T4).</div></span>' + (S.quar ? pill('', 'Reported to Priya') : '<button type="button" class="btn xs" data-act="quar" data-k="quar">Report</button>') + '</div></div>' +
    '<div class="wt-callout mt10">Inbound email, texts and PDFs are treated as untrusted content: instructions inside them are never followed, and anything touching money or bank details goes to a person.</div>';
  return browser('app.rootline.com/t/greenleaf/inbox', shellO('Inbox', main, { Inbox: 23 }), 'Greenleaf office: triaged inbox');
};
WT.actions.sendTriage = function (el, S) { S.sent = 1; };
WT.actions.quar = function (el, S) { S.quar = true; };
WT.bts['a03-inbox'] = function (S) {
  return {
    what: 'The Inbox Triage agent reads every inbound email, text and web form, labels it, drafts a reply and proposes the action (skip a visit, book a site visit). Content from outside is quarantined from the agent\'s instructions: hidden text asking the AI to do something is ignored, and a suspicious bank-change request goes straight to a person.',
    agents: [['Inbox Triage (A2)', 'Classification, drafts, proposed actions', 0], ['Injection defense', 'Quarantined extraction, taint tracking, sender checks', 1]],
    trace: [{ c: 'agent.A2.classify(23)', r: '4 leads, 6 billing, 7 scheduling, 3 vendors, 3 spam', ms: '6.8 s' }, { c: 'security.scan(email from maple-hill-nursery.co)', r: 'new domain, hidden instruction text → quarantined', ms: '90 ms', det: true }, { c: 'policy.block(bank_details.change, T4)', r: 'AI cannot act; routed to Priya', ms: '—', det: true }, { c: 'approval.decide(Tasha, skip V-9921)', r: S.sent ? 'approved; reply sent' : 'waiting', ms: S.sent ? 'human' : '', human: !S.sent }],
    hitl: [['Tasha', 'approves replies and actions.'], ['Priya', 'verifies any bank change by phone with a known contact.']],
    levels: ['A2 at L2', 'Bank detail changes: T4, people only'],
    creditNote: '23 messages × 0.5 credit, rounded up: 12.',
    tags: [['mvp', 'unified inbox, Inbox Triage agent, prompt-injection defenses']],
    specs: 'Spec: 17 §4.5.3 (A2), §4.9 (prompt-injection defense) · 16 (unified inbox) · 22 §4.4.1'
  };
};

/* a04 */
WT.screens['a04-ask'] = function (S) {
  var jobs = [['P-1150 Morgan retaining wall', '$38,400', '12.4%', 'wall base redo after inspection'], ['P-1171 Sato patio', '$22,900', '31.8%', 'rock in excavation, 14 h over'], ['P-1188 Kim residence', '$24,860', '39.1%', 'phase 3 labor overrun']];
  var main = '<div class="apphead"><h3>' + ic('spark') + ' Copilot</h3></div><div class="wt-thread">' +
    '<div class="wt-bubble me">What\'s my gross margin on installs this year vs last?</div>' +
    '<div class="wt-bubble ai"><b>Design-build gross margin: 41.2% this year vs 38.6% last year</b> (year to date, Jan 1 to Sep 30, same period).<br>Revenue $612,400 · cost of revenue $360,100.<small>Metric: gross_margin_pct, division design-build (KPI Dictionary) · from ledger postings · 1 credit</small></div>' +
    (S.q2 ? '<div class="wt-bubble me">Which jobs dragged it down?</div><div class="wt-bubble ai"><table class="data tight"><thead><tr><th>Job</th><th class="num">Price</th><th class="num">Margin</th><th>Why</th></tr></thead><tbody>' + jobs.map(function (j) { return '<tr><td>' + j[0] + '</td><td class="num">' + j[1] + '</td><td class="num">' + j[2] + '</td><td>' + j[3] + '</td></tr>'; }).join('') + '</tbody></table>The Morgan wall alone cost 1.9 points of margin. <small>Source: job costing · 1 credit</small></div><div class="flex"><button type="button" class="btn sm">Show as report</button><button type="button" class="btn sm">Pin to dashboard</button></div>' : '<div class="flex"><button type="button" class="btn sm ai" data-act="q2" data-k="q2">' + ic('spark') + 'Which jobs dragged it down?</button></div>') + '</div>';
  return browser('app.rootline.com/t/greenleaf/copilot', shellO('Reports', main), 'Greenleaf office: Copilot');
};
WT.actions.q2 = function (el, S) { S.q2 = true; };
WT.ensure['a04-ask'] = function (S) { S.q2 = true; };
WT.bts['a04-ask'] = function (S) {
  return {
    what: 'Copilot answers questions through the same tools the app uses, with Erin\'s permissions. Numbers come from certified metrics in the KPI Dictionary, and a grounding check makes sure every figure in the answer appears in a tool result. If a number can\'t be grounded, Copilot says so instead of guessing.',
    agents: [['Copilot', 'Permission-aware tools, generative UI', 0], ['Number grounding', 'Every figure traced to a tool result', 1]],
    trace: [{ c: 'metrics.query(gross_margin_pct, design-build, YTD vs prior YTD)', r: '41.2% vs 38.6%', ms: '310 ms', det: true }, { c: 'grounding.check(answer)', r: '4 of 4 numbers grounded', ms: '20 ms', det: true }, { c: 'jobcost.lowest_margin(design-build, YTD)', r: S.q2 ? '3 jobs with causes from notes' : 'not asked', ms: S.q2 ? '240 ms' : '', det: true, pending: !S.q2 }],
    hitl: [['Erin', 'reads; questions never change data.']],
    levels: ['T0 read'],
    creditNote: '1 credit a question.',
    tags: [['mvp', 'Copilot with certified metrics and number grounding'], ['v1', 'exploratory analytics and "why" analysis']],
    specs: 'Spec: 17 §4.2 (Copilot), §4.3 (grounding) · 18 §4.3 (KPI Dictionary), §4.10'
  };
};

/* a05 */
WT.screens['a05-act'] = function (S) {
  var moves = [['Lindgren patio, day 3 of 4', 'Thu → Fri', 'Text: "Your patio crew will be back Friday instead of Thursday because of the forecast."'], ['Okafor final walkthrough', 'Thu 2:00 → Fri 9:00', 'Text to Ada and Chidi with the new time'], ['Westgate bed refresh', 'Thu → Fri', 'Email to Denise Walker (HOA)']];
  var main = '<div class="apphead"><h3>' + ic('spark') + ' Copilot</h3></div><div class="wt-thread"><div class="wt-bubble me">Move Thursday\'s Crew 1 jobs to Friday and tell the clients.</div>' +
    '<div class="wt-bubble ai"><b>Here\'s the change. Nothing happens until you confirm.</b><table class="data tight mt6"><thead><tr><th>Job</th><th>Move</th><th>Message</th></tr></thead><tbody>' + moves.map(function (m) { return '<tr><td>' + m[0] + '</td><td>' + m[1] + '</td><td class="tiny">' + m[2] + '</td></tr>'; }).join('') + '</tbody></table><div class="tiny mt6">Friday capacity: Crew 1 has 7.5 h open; these need 7 h. The Okafor walkthrough moves into a free morning slot.</div><small>Risk tier T3 (client messages and schedule changes) · 2 credits</small></div>' +
    (S.confirmed ? '<div class="toast">' + ic('check') + (S.undone ? 'Undone: all 3 jobs back on Thursday; no messages were sent.' : 'Done: 3 jobs moved; 3 messages queued to send in 10 minutes.') + '</div>' + (S.undone ? '' : '<button type="button" class="btn sm" data-act="undo" data-k="undo">Undo (9:42 left)</button>') : '<div class="flex"><button type="button" class="btn sm primary" data-act="confirm" data-k="confirm">Confirm 3 moves and 3 messages</button><button type="button" class="btn sm">Change something</button></div>') + '</div>';
  return browser('app.rootline.com/t/greenleaf/copilot', shellO('Schedule', main), 'Greenleaf office: Copilot action');
};
WT.actions.confirm = function (el, S) { S.confirmed = true; };
WT.actions.undo = function (el, S) { S.undone = true; };
WT.bts['a05-act'] = function (S) {
  return {
    what: 'Copilot can act, but only through the same typed actions the app exposes, with Erin\'s permissions. It shows a diff and the messages first. T3 actions need an explicit confirmation, and client messages wait in an undo window before they go out.',
    agents: [['Copilot', 'Plans actions through the Action Layer', 0], ['Action Layer', 'Typed tools with risk tiers', 1]],
    trace: [{ c: 'schedule.find(Crew 1, Thursday)', r: '3 jobs', ms: '60 ms', det: true }, { c: 'capacity.check(Crew 1, Friday)', r: '7.5 h open, 7 h needed', ms: '40 ms', det: true }, { c: 'messages.draft(×3)', r: '2 texts, 1 email', ms: '1.8 s' }, { c: 'confirm(T3)', r: S.confirmed ? 'confirmed by Erin' : 'waiting', ms: S.confirmed ? 'human' : '', human: !S.confirmed }, { c: 'undo.window(10 min)', r: S.undone ? 'undone; nothing sent' : (S.confirmed ? 'messages queued' : ''), ms: '', det: true, pending: !S.confirmed }],
    hitl: [['Erin', 'confirms; the undo window covers anything sent outside Greenleaf.']],
    levels: ['T2 internal writes confirm once', 'T3 external messages: confirm, then a 10-minute undo'],
    creditNote: 'Plan and drafts: 2 credits.',
    tags: [['mvp', 'Copilot actions with confirmation tiers and undo']],
    specs: 'Spec: 17 §4.2.3 (actions), §4.4.2 (risk tiers T0-T4), §13 (Copilot time machine)'
  };
};

/* a06 */
WT.screens['a06-automation'] = function (S) {
  var main = '<div class="apphead"><span class="crumb">Settings › Automations</span><h3>New automation</h3>' + (S.on ? pill('ok', 'On') : pill('', 'Draft')) + '</div>' +
    '<label class="fld">Describe it<input class="inp" readonly value="When a proposal over $10k is approved, request the deposit, tell Jess, create the job and order the plants"></label>' +
    '<div class="recipe mt10"><div class="rs"><b>When</b><span>Proposal accepted</span></div><div class="rs"><b>If</b><span>Total is over $10,000</span></div><div class="rs"><b>Then</b><span>Send the deposit request (if not paid at signing)</span></div><div class="rs"><b>Then</b><span>Notify Jess Morales in the app and by email</span></div><div class="rs"><b>Then</b><span>Create the project with phases from the estimate</span></div><div class="rs ai"><b>Then</b><span>Ask the Procurement agent (A21) to draft POs for the plants ' + tag('v1') + ' (drafts go to the Approval Inbox)</span></div></div>' +
    '<div class="panel mt10"><h4>Test on a past proposal</h4>' + (S.testRun ? '<div class="tiny">Ran on <b>P-1203 Okafor ($17,590)</b> without changing anything: deposit already paid at signing → skipped; Jess notified (simulated); project with 4 phases (simulated); 2 POs drafted for Maple Hill Nursery (simulated).</div>' : '<button type="button" class="btn sm" data-act="testRun" data-k="testRun">Run test on P-1203</button>') + '</div>' +
    '<div class="flex mt10">' + (S.on ? '<span class="okline">' + ic('check') + 'On. Runs are free; the agent step drafts for approval.</span>' : '<button type="button" class="btn sm primary" data-act="autoOn" data-k="autoOn"' + (S.testRun ? '' : ' disabled') + '>Turn on</button><span class="cost">1 credit to write it</span>') + '</div>';
  return browser('app.rootline.com/t/greenleaf/settings/automations/new', shellO('Settings', main), 'Greenleaf office: automation builder');
};
WT.actions.testRun = function (el, S) { S.testRun = true; };
WT.actions.autoOn = function (el, S) { S.on = true; };
WT.ensure['a06-automation'] = function (S) { S.testRun = true; S.on = true; };
WT.bts['a06-automation'] = function (S) {
  return {
    what: 'Erin describes the workflow in a sentence and Rootline writes it as a deterministic recipe: a trigger, conditions and actions, versioned and durably executed. A test run on a past proposal shows exactly what would have happened without touching anything. Once on, runs cost nothing; only the agent step uses AI, and it drafts for approval.',
    agents: [['Automation Builder', 'Natural-language authoring into a recipe', 0], ['Workflow engine', 'Durable execution (Temporal), loop guards', 1]],
    trace: [{ c: 'automation.author(nl)', r: '1 trigger, 1 condition, 4 actions', ms: '2.4 s' }, { c: 'automation.test(P-1203)', r: S.testRun ? 'simulated: 1 skipped, 3 would run' : 'not run', ms: S.testRun ? '600 ms' : '', det: true, pending: !S.testRun }, { c: 'automation.enable(v1)', r: S.on ? 'on' : 'draft', ms: S.on ? '20 ms' : '', det: true, human: S.testRun && !S.on }],
    hitl: [['Erin', 'reviews and turns it on; each run is logged and can be paused.']],
    creditNote: 'Writing the recipe: 1 credit. Runs are deterministic and free.',
    tags: [['mvp', 'Automation Builder, natural-language authoring, test mode, recipe library'], ['v1', 'Procurement agent step']],
    specs: 'Spec: 17 §4.6 (Automation Builder, recipes) · 20 (Temporal workflows)'
  };
};

/* a07 */
WT.screens['a07-marketing'] = function (S) {
  var main = '<div class="apphead"><h3>Grow</h3></div><div class="wt-cols"><div class="wt-stack"><div class="panel"><h4>' + ic('star') + ' Reviews ' + tag('mvp') + '</h4><dl class="kv"><dt>Requests sent</dt><dd>38 this month</dd><dt>New reviews</dt><dd>14 · average 4.8</dd><dt>Rule</dt><dd>Every completed job or 4th visit; never filtered by satisfaction</dd></dl></div>' +
    '<div class="panel"><h4>' + ic('users') + ' Referrals ' + tag('v1') + '</h4><dl class="kv"><dt>Shared links</dt><dd>22</dd><dt>Booked</dt><dd>6 · $50 credit each to the referrer</dd></dl></div></div>' +
    '<div class="panel"><h4>' + ic('map') + ' Neighborhood campaign ' + tag('v1') + '</h4><p class="tiny muted">Around Crew 2\'s Tuesday route: 412 homes within 3 streets of current clients.</p>' +
    (S.campaign ? '<div class="ai-box"><div class="ai-h">' + ic('spark') + 'Drafted postcard</div><p class="tiny"><b>"Your neighbors on Evening St already trust Greenleaf."</b> We mow on your street every Tuesday, so adding your lawn is easy: weekly mowing from $63 a visit. Scan for your price in 1 minute.</p><div class="tiny faint">Postcard with QR code · USPS EDDM to carrier route 43085-C014 (950 addresses: EDDM mails the whole route, which covers the 412 homes) · SMS only to the 37 contacts who opted in</div></div><dl class="kv mt6"><dt>Cost</dt><dd>$247 postage (950 × $0.26 EDDM Retail) + print</dd><dt>Approval</dt><dd>Tasha · sends Monday</dd></dl>' : '<button type="button" class="btn sm ai" data-act="campaign" data-k="campaign">' + ic('spark') + 'Draft the campaign (5 credits)</button>') + '</div></div>';
  return browser('app.rootline.com/t/greenleaf/grow', shellO('Clients', main), 'Greenleaf office: marketing');
};
WT.actions.campaign = function (el, S) { S.campaign = true; };
WT.ensure['a07-marketing'] = function (S) { S.campaign = true; };
WT.bts['a07-marketing'] = function (S) {
  return {
    what: 'Growth comes from happy clients and dense routes. Review requests go out on uniform rules (filtering by satisfaction is not allowed). The referral program rewards clients who bring neighbors. A neighborhood campaign targets the streets around an existing route, drafted by AI, with mail for everyone and texts only for people who opted in.',
    agents: [['Marketing content', 'Postcard and door-hanger copy', 0], ['Consent ledger', 'TCPA consent for every text', 1]],
    trace: [{ c: 'reviews.request(uniform rule)', r: '38 sent, 14 reviews', ms: '—', det: true }, { c: 'audience.near_route(Crew 2, Tue, 3 streets)', r: '412 homes; 37 SMS-consented', ms: '300 ms', det: true }, { c: 'content.draft(postcard, SMS)', r: S.campaign ? 'drafted; EDDM route 43085-C014 picked to cover the 412 homes; Tasha to approve' : 'not drafted', ms: S.campaign ? '3.6 s' : '', pending: !S.campaign }],
    hitl: [['Tasha', 'approves every campaign before it sends.']],
    creditNote: 'Marketing content set: 5 credits.',
    tags: [['mvp', 'review requests on uniform rules, NPS, basic campaigns'], ['v1', 'referral program, neighborhood campaigns, EDDM']],
    specs: 'Spec: 16 §4.12 (reviews), §4.14 (referrals), §4.15 (neighborhood marketing) · 17 (A18) · 22 §4.4.1'
  };
};

/* a08 */
WT.screens['a08-reports'] = function (S) {
  var bench = [['Gross margin', '44.1%', '41.0%', '35.5% - 47.0%'], ['Revenue per man-hour', '$61.90', '$58.20', '$51 - $66'], ['Days to get paid (DSO)', '31', '38', '27 - 49'], ['Drive time share', '15%', '17%', '12% - 22%']];
  var main = '<div class="apphead"><h3>Today</h3><span class="sp"></span>' + pill('', 'May') + '</div>' +
    '<div class="wt-kpis"><div class="wt-kpi"><div class="l">Revenue MTD</div><div class="v">$68,240</div></div><div class="wt-kpi"><div class="l">Gross margin</div><div class="v">44.1%</div></div><div class="wt-kpi"><div class="l">Cash</div><div class="v">$184,210</div></div><div class="wt-kpi"><div class="l">Overdue &gt; 30 d</div><div class="v">$18,420</div></div><div class="wt-kpi"><div class="l">Backlog</div><div class="v">6.4 wks</div></div></div>' +
    '<div class="panel mt10"><div class="ph">Benchmarks ' + tag('v1') + ' beta</div>' + (S.bench ? '<p class="tiny muted">Peers: Great Lakes and Ohio Valley · $1-2.5M revenue · design-build and maintenance · 34 companies (shown only when at least 10 contribute)</p><table class="data tight bench"><thead><tr><th>Metric</th><th class="n">You</th><th class="n">Peer median</th><th class="n">Middle half</th></tr></thead><tbody>' + bench.map(function (b) { return '<tr><td>' + b[0] + '</td><td class="n you">' + b[1] + '</td><td class="n">' + b[2] + '</td><td class="n">' + b[3] + '</td></tr>'; }).join('') + '</tbody></table><div class="wt-note mt6">Prices and wages are never benchmarked; only performance ratios.</div>' : '<button type="button" class="btn sm" data-act="bench" data-k="bench">Compare with peers</button>') + '</div>';
  return browser('app.rootline.com/t/greenleaf/today', shellO('Today', main), 'Greenleaf office: owner dashboard');
};
WT.actions.bench = function (el, S) { S.bench = true; };
WT.ensure['a08-reports'] = function (S) { S.bench = true; };
WT.bts['a08-reports'] = function (S) {
  return {
    what: 'The owner dashboard reads the same certified metrics the Copilot and the briefing use. Benchmarks compare Greenleaf with similar companies in the same macro-region, from anonymized data that companies choose to contribute, with minimum group sizes and no price or wage comparisons.',
    agents: [['Reporting', 'KPI Dictionary metrics', 1], ['Benchmarking', 'Opt-in, k ≥ 10, dominance limits', 1]],
    trace: [{ c: 'metrics.today(owner)', r: '5 tiles', ms: '220 ms', det: true }, { c: 'benchmarks.cell(Great Lakes and Ohio Valley, $1-2.5M, mix)', r: S.bench ? 'n = 34, passes privacy thresholds' : 'not requested', ms: S.bench ? '180 ms' : '', det: true, pending: !S.bench }],
    hitl: [['Erin', 'chose to contribute anonymized data, which is what unlocks benchmarks.']],
    tags: [['mvp', 'owner dashboard, KPI Dictionary, report library'], ['v1', 'benchmarks beta with privacy thresholds']],
    specs: 'Spec: 18 §4.1-4.3, §4.11 (benchmarking and privacy rules) · 24 OD-69'
  };
};

/* a09 */
WT.screens['a09-control'] = function (S) {
  var use = [['Copilot questions and drafts', 412], ['Lead Follow-up (A3)', 318], ['Inbox Triage (A2)', 286], ['Photo mockups and layouts', 520], ['Daily briefing (A1)', 90], ['Field notes (A4)', 122]];
  var max = 520, total = use.reduce(function (t, u) { return t + u[1]; }, 0);
  var main = '<div class="apphead"><span class="crumb">Settings › AI</span><h3>AI usage and controls</h3><span class="sp"></span>' + pill('info', num(total) + ' of 6,000 credits used') + '</div>' +
    '<div class="wt-cols"><div class="panel"><h4>Credits this month by agent and feature</h4><table class="data tight"><tbody>' + use.map(function (u) { return '<tr><td>' + u[0] + '</td><td style="width:45%"><span class="mini-bar" style="width:' + (u[1] / max * 100).toFixed(0) + '%"></span></td><td class="num">' + num(u[1]) + '</td></tr>'; }).join('') + '</tbody></table>' +
    '<label class="fld mt10">Monthly cap for Lead Follow-up (A3)<input type="range" min="100" max="800" step="50" data-in="cap" data-k="cap" value="' + S.cap + '"><span class="hint">' + S.cap + ' credits; when reached, new leads get the deterministic text-back only</span></label></div>' +
    '<div class="wt-stack"><div class="panel"><h4>' + ic('shield') + ' Privacy</h4><label class="wt-toggle"><input type="checkbox" checked disabled>Never use Greenleaf\'s data to train models</label><div class="wt-note mt6">On for every Company and can\'t be turned off. Optional pooled learning for estimates is a separate opt-in.</div></div>' +
    '<div class="panel"><h4>' + ic('list') + ' AI audit log</h4><ul class="wt-list"><li class="wt-row soft"><span class="mono tiny">9:41</span><span>Copilot moved 3 Crew 1 jobs to Friday<span class="sub">confirmed by Erin</span></span>' + (S.undoLog ? pill('', 'Reverted') : '<button type="button" class="btn xs" data-act="undoLog" data-k="undoLog">Revert</button>') + '</li><li class="wt-row soft"><span class="mono tiny">8:12</span><span>A5 sent a day-3 reminder (L3)<span class="sub">undo window passed</span></span><span></span></li><li class="wt-row soft"><span class="mono tiny">6:00</span><span>A1 wrote the briefing<span class="sub">read-only</span></span><span></span></li></ul></div></div></div>';
  return browser('app.rootline.com/t/greenleaf/settings/ai', shellO('Settings', main), 'Greenleaf office: AI controls');
};
WT.inputs.cap = function (el, S) { S.cap = parseInt(el.value, 10); };
WT.actions.undoLog = function (el, S) { S.undoLog = true; };
WT.bts['a09-control'] = function (S) {
  return {
    what: 'Erin can see exactly what AI is costing and doing. Credits are broken down by agent and feature, each agent can have a monthly cap with a deterministic fallback when it\'s reached, training on Greenleaf\'s data is off for good, and every AI action is in an immutable audit log, where changes made through Copilot can be reverted.',
    agents: [['AI metering', 'Credit ledger, caps, fallbacks', 1], ['Audit log', 'Immutable record of every AI action', 1]],
    trace: [{ c: 'credits.by_agent(this month)', r: '1,748 used of 6,000', ms: '90 ms', det: true }, { c: 'cap.set(A3)', r: S.cap + ' credits / month', ms: '10 ms', det: true }, { c: 'audit.revert(copilot action 9:41)', r: S.undoLog ? 'jobs restored; clients told' : 'available', ms: S.undoLog ? '120 ms' : '', det: true, pending: !S.undoLog }],
    hitl: [['Erin', 'sets caps and policies; only owners change AI settings.']],
    tags: [['mvp', 'credit metering, budgets and caps, no-training policy, AI audit log'], ['v1', 'Copilot time machine across all AI changes']],
    specs: 'Spec: 17 §4.11 (metering), §4.12 (privacy), §4.13 (audit) · 22 §4.4.1 · 19 (AI ops)'
  };
};

/* a10 */
WT.screens['a10-recap'] = function (S) {
  var rows = [['Daily briefing', 'A1', 'Read-only', 'Erin\'s 3 decisions', '3'], ['Approval Inbox', 'A3, A5, A13, A14', 'L2 drafts', 'Erin, Tasha', '9'], ['Inbox triage', 'A2', 'L2 drafts; T4 blocked', 'Tasha, Priya', '12'], ['Questions', 'Copilot', 'T0 read', 'Erin', '2'], ['Schedule change', 'Copilot', 'T3 confirm + undo', 'Erin', '2'], ['Automation', 'Builder', 'Deterministic runs', 'Erin', '1'], ['Neighborhood campaign', 'Marketing content', 'L2 draft', 'Tasha', '5']];
  return '<div class="wt-cols wide-left"><div class="panel"><h4>Every agent action today</h4><div class="table-scroll"><table class="data tight"><thead><tr><th>What</th><th>Who acted</th><th>Guardrail</th><th>Approved by</th><th class="num">Credits</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td><td class="num">' + r[4] + '</td></tr>'; }).join('') + '<tr><td colspan="4"><b>Total</b></td><td class="num"><b>34</b></td></tr></tbody></table></div></div>' +
    '<div class="wt-stack"><div class="panel"><h4>The principles</h4><ul style="margin:0;padding-left:18px;font-size:.8rem;color:var(--text-2);display:grid;gap:4px"><li>Agents draft; people approve by default.</li><li>Autonomy is earned per action, from evidence, and only the owner raises it.</li><li>Numbers are grounded in certified metrics.</li><li>Outside content can\'t give the AI instructions; money changes stay with people.</li><li>Every AI action is logged, costed and reversible where possible.</li></ul></div>' +
    '<div class="flex"><a class="btn" href="#overview">' + ic('arrow-l') + 'Back to start</a><a class="btn" href="prototype.html">AI design walkthrough</a><a class="btn primary" href="walkthroughs.html">All walkthroughs ' + ic('arrow-r') + '</a></div></div></div>';
};
WT.bts['a10-recap'] = function (S) {
  return {
    what: 'The agentic layer is one Action Layer shared by Copilot, agents, automations, the API and the MCP server, with one trust system around it: risk tiers, autonomy levels, approvals, grounding, injection defenses, metering and audit.',
    hitl: [['Erin and Tasha', 'approved or confirmed every action that reached a client or changed the schedule.']],
    creditNote: '34 credits for the owner\'s and office\'s AI work today.',
    tags: [['mvp', 'briefing, Approval Inbox, triage, Copilot, automations, controls'], ['v1', 'renewal and change-order agents, autonomy graduation, benchmarks, referrals, neighborhood campaigns, MCP server']],
    specs: 'Spec: 17 (whole doc) · 16 · 18 · 22 §4.4.1'
  };
};
