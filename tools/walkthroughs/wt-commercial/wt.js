/* Walkthrough: commercial and HOA accounts. Maple Ridge HOA facts match screens-field-client-admin.html
   (5 properties, community manager Denise Walker of Brightway CM, FY budget $167,880, enhancement budget $42,000). */

var PROPS = [['North Entrance and Clubhouse', '3.4 ac', 1680], ['Pond Commons and Walking Trail', '5.1 ac', 2160], ['Pool and Amenity Center', '1.2 ac', 1080], ['Section 3 Islands and Medians', '14 islands', 1440], ['Westgate Entrance', '0.8 ac', 840]];
function shellC(active, main, counts) { return appShell(active, main, { counts: counts }); }
function portal(main) {
  var nav = [['home', 'Portfolio'], ['approve', 'Approvals'], ['inbox', 'Requests'], ['chart', 'Reports'], ['dollar', 'Invoices'], ['file', 'Documents']];
  return appShell('', main, { nav: nav, co: 'Greenleaf Grounds Co.', coSub: 'Client portal · Maple Ridge HOA', foot: '', navLabel: 'Client portal navigation (concept)' });
}

var WT = {
  title: 'Rootline walkthrough: commercial and HOA accounts',
  short: 'Commercial and HOA accounts',
  ovTitle: 'Commercial and HOA accounts',
  startLeft: 4152,
  acts: [
    { n: 'Act 1', t: 'Win the contract', sub: 'RFP, estimate, board approval' },
    { n: 'Act 2', t: 'Run the sites', sub: 'Site maps, inspections, enhancements, snow' },
    { n: 'Act 3', t: 'Bill, report and renew', sub: 'Consolidated billing, portfolio, renewal' }
  ],
  steps: [
    { id: 'h01-rfp', act: 0, short: 'RFP', title: 'The HOA\'s RFP, parsed into a scope matrix', who: 'Sam, RFP parser', ai: true, tags: ['v1'] },
    { id: 'h02-estimate', act: 0, short: 'Estimate', title: 'A per-month commercial estimate across 5 properties', who: 'Sam', tags: ['mvp', 'v1'] },
    { id: 'h03-approval', act: 0, short: 'Board approval', title: 'The board approves by quorum in the portal', who: 'Denise, the board', tags: ['v1'] },
    { id: 'h04-sitemap', act: 1, short: 'Site map', title: 'Site maps, service specs and contacts', who: 'Luis', tags: ['mvp', 'v1'] },
    { id: 'h05-inspection', act: 1, short: 'Inspection', title: 'A scored quality inspection at Pond Commons', who: 'Luis', tags: ['v1'] },
    { id: 'h06-enhancement', act: 1, short: 'Enhancement', title: 'An enhancement proposal against the HOA\'s budget', who: 'Sam, the board', tags: ['mvp', 'v1'] },
    { id: 'h07-snow', act: 1, short: 'Storm night', title: 'A storm night across the HOA\'s sites', who: 'Luis, Crew 2', tags: ['mvp', 'v1'] },
    { id: 'h08-billing', act: 2, short: 'Consolidated billing', title: 'Consolidated billing for a management company', who: 'Tasha', tags: ['v1'] },
    { id: 'h09-portfolio', act: 2, short: 'Portfolio', title: 'The property manager\'s portfolio and monthly report', who: 'Denise', ai: true, tags: ['v1'] },
    { id: 'h10-renewal', act: 2, short: 'Renewal', title: 'Renewal with an escalator, back to the board', who: 'Renewal agent, Erin', ai: true, tags: ['v1'] },
    { id: 'h11-recap', act: 2, short: 'Recap', title: 'Recap: approvals, agents and scope', who: 'Everyone', tags: [] }
  ],
  credits: { 'h01-rfp': 30, 'h09-portfolio': 2, 'h10-renewal': 2 },
  state: { rfpOk: false, snowModel: 'push', votes: 1, sent: false, poOk: false, insp: false, wo: false, enhVotes: 2, scheduled: false, storm: 0, byProp: false, report: false, renew: false },
  ov: {
    eyebrow: 'Clickable walkthrough · commercial and HOA',
    h: 'Commercial accounts have more people, more rules and more paperwork. Rootline handles all three.',
    lede: 'Follow Greenleaf as it wins and runs the grounds contract for Maple Ridge HOA, five properties managed by Brightway Community Management: an RFP parsed into a cited scope matrix, a per-month estimate across zones, a board vote by quorum with a PO, site maps and contacts with scopes, a scored inspection, an enhancement against the HOA\'s budget, a storm night, consolidated billing, the property manager\'s portfolio and a renewal back to the board. Commercial accounts are mostly the [V1] scope wave; the scope tag on each step says what ships first.',
    cast: [
      { h: 'Maple Ridge HOA', icon: 'building', items: [['Denise Walker', 'community manager, Brightway CM (primary contact and approver)'], ['Paul Chen, Grace Okoye, Linda Ross', 'board members who vote'], ['Mark Feld', 'board member whose term has ended'], ['Tom Reyes', 'clubhouse manager (property contact)']] },
      { h: 'Greenleaf Grounds Co.', icon: 'leaf', items: [['Sam Kowalski', 'estimator'], ['Luis Ortega', 'operations and account manager'], ['Tasha Greene', 'office manager'], ['Erin Castillo', 'owner']] },
      { h: 'Agents', icon: 'spark', items: [['RFP / Bid Parser (A10)', 'scope matrix with citations and risk flags'], ['Renewal (A13)', 'escalator and renewal draft'], ['Report summaries', 'monthly property report']] }
    ],
    extra: '<p class="wt-note mt14">Prices are illustrative. Maple Ridge\'s budget and properties match the HOA portfolio concept screen.</p>'
  },
  screens: {}, bts: {}, actions: {}, inputs: {}, ensure: {}
};

/* h01 */
WT.screens['h01-rfp'] = function (S) {
  var rows = [['Mowing', '28 cuts, Apr 1-Nov 15, 3.5 in height', 'p. 9', ''], ['Beds', 'Weed and edge monthly; mulch refresh in May', 'p. 10', ''], ['Irrigation', 'Start-up, monthly checks, winterization; backflow test', 'p. 12', ''], ['Snow', 'Plow at 2 in; walks salted; response within 2 h, 24/7', 'p. 18', 'risk'], ['Penalties', '$250 per missed visit as liquidated damages', 'p. 31', 'risk'], ['Payment', 'Net 60 days', 'p. 36', 'risk'], ['Insurance', '$2M general liability, HOA named as additional insured', 'p. 40', ''], ['Dates', 'Walkthrough Jan 12 · bids due Jan 30', 'p. 2', '']];
  var main = '<div class="apphead"><span class="crumb">Sales › Opportunities › Maple Ridge HOA</span><h3>Grounds RFP 2027 · 42 pages</h3>' + pill('info', 'Bid due Jan 30') + '</div>' +
    '<div class="panel"><div class="ph">RFP / Bid Parser (A10) <span class="pill info">V1 · L1</span></div><table class="data tight"><thead><tr><th>Scope item</th><th>Requirement</th><th>Source</th><th></th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td><b>' + r[0] + '</b></td><td>' + r[1] + '</td><td><span class="cite">' + r[2] + '</span></td><td>' + (r[3] ? pill('warn', 'Risk') : '') + '</td></tr>'; }).join('') + '</tbody></table>' +
    '<div class="ai-box mt10"><div class="ai-h">' + ic('spark') + 'Risk notes</div><ul><li>2-hour snow response at 5 sites needs a second plow truck on storm nights.</li><li>$250 per missed visit: rain moves are allowed under section 7.2; confirm at the walkthrough.</li><li>Net 60 terms: about $14,000 of receivables carried; price accordingly.</li></ul></div>' +
    '<div class="flex mt10">' + (S.rfpOk ? '<span class="okline">' + ic('check') + 'Sam reviewed every row against the PDF and marked 3 questions for the walkthrough</span>' : '<button type="button" class="btn sm primary" data-act="rfpOk" data-k="rfpOk">Mark reviewed</button>') + '<span class="cost">30 credits (quoted before the run)</span></div></div>';
  return browser('app.rootline.com/t/greenleaf/sales/opportunities/maple-ridge', shellC('Sales', main), 'Greenleaf office: RFP scope matrix');
};
WT.actions.rfpOk = function (el, S) { S.rfpOk = true; };
WT.bts['h01-rfp'] = function (S) {
  return {
    what: 'Commercial RFPs are long PDFs. The RFP / Bid Parser reads the package and builds a scope matrix where every row cites its page, plus dates and risk flags. It never fills in the bid by itself: Sam checks each row against the source before anything is priced.',
    agents: [['RFP / Bid Parser (A10)', 'Scope matrix, dates, risk flags with citations', 0]],
    trace: [{ c: 'document.ingest(RFP, 42 pages)', r: 'text, tables, 3 site maps', ms: '8.4 s', det: true }, { c: 'agent.A10.scope_matrix', r: '8 scope rows, 3 risk flags, 2 dates', ms: '26 s' }, { c: 'review.mark(Sam)', r: S.rfpOk ? 'reviewed against the PDF' : 'waiting', ms: S.rfpOk ? 'human' : '', human: !S.rfpOk }],
    hitl: [['Sam', 'reviews every row; citations make it quick to check.']],
    levels: ['A10 at L1: suggests only'],
    creditNote: 'Agent task run quoted before it ran: 30 credits for a 42-page package.',
    tags: [['v1', 'RFP intake and the RFP / Bid Parser'], ['v2', 'bid/no-bid scorecard']],
    specs: 'Spec: 17 §4.5.11 (A10) · 03 §4.11 (commercial bids) · 24 C03-039, C17-017'
  };
};

/* h02 */
WT.screens['h02-estimate'] = function (S) {
  var freq = [['Mowing and trimming', '28', '$41,160'], ['Bed maintenance (weed, edge)', '12', '$18,720'], ['Shrub pruning', '2', '$9,840'], ['Fertilization and weed control', '5', '$8,280'], ['Leaf cleanup', '2', '$8,400']];
  var snow = S.snowModel === 'push' ? '<tr><td>Plow per push (5 lots and drives)</td><td class="num">$740 a push</td></tr><tr><td>Salt walks per application</td><td class="num">$285 an application</td></tr>' : '<tr><td>Seasonal snow, 5 sites, up to 12 events</td><td class="num">$14,400</td></tr><tr><td>Events beyond 12</td><td class="num">$740 a push</td></tr>';
  var main = '<div class="apphead"><span class="crumb">Sales › Estimates</span><h3>E-2410 · Maple Ridge HOA · grounds 2027</h3>' + pill('ok', 'Margin on target') + '</div>' +
    '<div class="wt-cols"><div class="wt-stack"><div class="panel"><h4>Properties and zones (measured)</h4><table class="data tight"><thead><tr><th>Property</th><th>Size</th><th class="num">Per month</th></tr></thead><tbody>' + PROPS.map(function (p) { return '<tr><td>' + p[0] + '</td><td>' + p[1] + '</td><td class="num">' + money(p[2]) + '</td></tr>'; }).join('') + '<tr><td><b>Grounds maintenance</b></td><td></td><td class="num"><b>$7,200</b></td></tr></tbody></table><div class="wt-note mt6">12 monthly payments = $86,400 a year, allocated to properties by measured workload.</div></div>' +
    '<div class="panel"><h4>Frequency table</h4><table class="data tight"><thead><tr><th>Service</th><th class="num">Times</th><th class="num">Annual</th></tr></thead><tbody>' + freq.map(function (f) { return '<tr><td>' + f[0] + '</td><td class="num">' + f[1] + '</td><td class="num">' + f[2] + '</td></tr>'; }).join('') + '</tbody></table></div></div>' +
    '<div class="wt-stack"><div class="panel"><h4>Irrigation</h4><dl class="kv"><dt>Annual</dt><dd class="num">$9,600</dd><dt>Includes</dt><dd>Start-up, 6 checks, winterization, 3 backflow tests</dd></dl></div>' +
    '<div class="panel"><h4>Snow</h4><div class="seg" role="group" aria-label="Snow pricing"><button type="button" data-act="snowModel" data-v="push" data-k="sp" aria-pressed="' + (S.snowModel === 'push') + '">Per push ' + tag('mvp') + '</button><button type="button" data-act="snowModel" data-v="season" data-k="ss" aria-pressed="' + (S.snowModel === 'season') + '">Seasonal with cap ' + tag('v1') + '</button></div><table class="data tight mt6"><tbody>' + snow + '</tbody></table><div class="wt-note mt6">' + (S.snowModel === 'push' ? 'Per-push billing from Snow Lite storm logs ships at MVP.' : 'Seasonal contracts with caps and floors come with the full Snow & Ice module at V1.') + '</div></div>' +
    '<div class="panel soft"><h4>Enhancements</h4><p class="tiny muted">Not in the contract: the HOA approves each project against its own $42,000 enhancement budget.</p></div></div></div>';
  return browser('app.rootline.com/t/greenleaf/sales/estimates/E-2410', shellC('Sales', main), 'Greenleaf office: commercial estimate');
};
WT.actions.snowModel = function (el, S) { S.snowModel = el.getAttribute('data-v'); };
WT.bts['h02-estimate'] = function (S) {
  return {
    what: 'Each property is measured into zones (turf, beds, curbs, pond edge), and the estimating engine prices labor from Greenleaf\'s production rates and the RFP\'s frequencies, then spreads the annual price into 12 monthly payments allocated to each property. Snow can be priced per push at MVP, or as a seasonal contract with a cap at V1.',
    agents: [['Estimating engine', 'Production rates, frequency table, margin', 1]],
    trace: [{ c: 'property.measure(5 sites)', r: 'turf 9.8 ac, beds 41,200 sq ft, curb 2,900 lf, pond edge 420 lf', ms: '6.2 s', det: true }, { c: 'estimate.frequency_price', r: '$86,400 / yr → $7,200 / mo', ms: '40 ms', det: true }, { c: 'estimate.snow(' + S.snowModel + ')', r: S.snowModel === 'push' ? '$740 per push, $285 per salting' : '$14,400 seasonal, 12-event cap', ms: '10 ms', det: true }],
    hitl: [['Sam', 'prices it; discounts below Greenleaf\'s margin floor need Erin\'s approval.']],
    tags: [['mvp', 'estimating engine, per-push snow from Snow Lite'], ['v1', 'commercial hierarchy, per-zone SOW, seasonal snow contracts']],
    specs: 'Spec: 03 EST-02-EST-12 · 14 §4.6.1 (commercial SOW), §4.3 (snow) · 24 C03-007, C14-030'
  };
};

/* h03 */
WT.screens['h03-approval'] = function (S) {
  var voters = [['PC', 'Paul Chen', 'President', S.votes >= 1 ? 'yes' : ''], ['GO', 'Grace Okoye', 'Treasurer', S.votes >= 2 ? 'yes' : ''], ['LR', 'Linda Ross', 'Member', S.votes >= 3 ? 'yes' : ''], ['MF', 'Mark Feld', 'Term ended Dec 31', 'block'], ['AH', 'Ana Hill', 'Member', '']];
  var approved = S.votes >= 3;
  var main = '<div class="apphead"><h3>Proposal · Grounds maintenance 2027</h3>' + (approved ? pill('ok', 'Approved 3 of 5') : pill('info', S.votes + ' of 3 needed')) + '</div>' +
    '<div class="wt-cols"><div class="panel"><h4>Board vote</h4><div class="wt-stack">' + voters.map(function (v) { return '<div class="vote ' + v[3] + '"><span class="av ' + (v[3] === 'yes' ? '' : 'c') + '">' + v[0] + '</span><span><b>' + v[1] + '</b><span class="tiny faint" style="display:block">' + v[2] + '</span></span>' + (v[3] === 'yes' ? pill('ok', 'Yes') : v[3] === 'block' ? pill('', 'Can\'t vote') : pill('', 'Pending')) + '</div>'; }).join('') + '</div>' +
    (approved ? '' : '<button type="button" class="btn sm mt10" data-act="vote" data-k="vote">Simulate the next vote</button>') + '<div class="wt-note mt6">Policy: 3 of 5 current board members; votes are tied to this proposal version. Denise endorsed it first.</div></div>' +
    '<div class="wt-stack"><div class="panel"><h4>Purchase order</h4><label class="fld">PO number<input class="inp" value="MRH-2027-001" readonly></label><div class="okline mt6">' + ic('check') + 'Matches the HOA\'s PO format</div></div>' +
    (approved ? '<div class="toast">' + ic('check') + 'Contract executed: Service Agreement SA-2201 · 5 properties · starts Apr 1</div><div class="panel soft"><dl class="kv"><dt>Maintenance</dt><dd>$7,200 / month</dd><dt>Irrigation</dt><dd>$9,600 / year</dd><dt>Snow</dt><dd>' + (S.snowModel === 'push' ? 'Per push' : 'Seasonal') + '</dd><dt>Terms</dt><dd>Net 60 · PO MRH-2027-001</dd></dl></div>' : '<div class="wt-callout">The proposal becomes a contract only when the policy is met. A vote from someone whose board term has ended doesn\'t count.</div>') + '</div></div>';
  return browser('portal.greenleafgrounds.com/approvals/proposal-2410', portal(main), 'Client portal: board approval');
};
WT.actions.vote = function (el, S) { S.votes = Math.min(3, S.votes + 1); };
WT.ensure['h03-approval'] = function (S) { S.votes = 3; };
WT.bts['h03-approval'] = function (S) {
  return {
    what: 'HOAs approve as a board. Rootline\'s approval policies support n-of-m quorums, sequential approvers, required PO numbers and term expiry, and each vote is tied to the exact proposal version. When the quorum is met, the proposal becomes a signed Service Agreement with the PO attached.',
    agents: [['Approval policies', 'Quorum, terms, PO validation', 1]],
    trace: [{ c: 'approval.policy(Maple Ridge)', r: '3 of 5 current board members; PO required', ms: '—', det: true }, { c: 'vote.recorded(×' + S.votes + ')', r: S.votes + ' yes · Mark Feld blocked (term ended)', ms: '—', det: true }, { c: 'proposal.executed(E-2410)', r: S.votes >= 3 ? 'SA-2201 created with PO MRH-2027-001' : 'waiting for quorum', ms: S.votes >= 3 ? '60 ms' : '', det: true, pending: S.votes < 3 }],
    hitl: [['Denise and the board', 'endorse and vote in the portal; Greenleaf can see progress but can\'t vote.']],
    tags: [['v1', 'quorum and sequential approvals, PO validation, term expiry'], ['v2', 'board meeting workflows (ballots, packets)']],
    specs: 'Spec: 02 §5.11 (client contact roles, approval policies) · 06 §4.16 · 24 §4.6 #17'
  };
};

/* h04 */
WT.screens['h04-sitemap'] = function (S) {
  var map = '<svg class="wt-svg" viewBox="0 0 320 190" role="img" aria-label="Site map of North Entrance and Clubhouse with service zones"><rect width="320" height="190" fill="var(--surface-3)"/><rect class="zone-hard" x="0" y="150" width="320" height="40"/><polygon class="zone-turf" points="10,20 150,20 150,140 10,140"/><rect class="zone-bldg" x="190" y="30" width="90" height="50"/><polygon class="zone-turf" points="170,95 310,95 310,140 170,140"/><path class="zone-bed" d="M10 140 Q80 120 150 140 L150 150 L10 150 Z"/><path class="zone-bed" d="M180 82 Q235 92 290 82 L290 92 L180 92 Z"/><rect class="zone-hard" x="150" y="20" width="20" height="130"/><text x="40" y="80" class="zone-lbl">T1 Entrance lawn</text><text x="200" y="122" class="zone-lbl">T2 Clubhouse lawn</text><text x="30" y="162" class="zone-lbl">B1 Monument bed</text><text x="205" y="60" class="zone-lbl" fill="var(--stone-0)">Clubhouse</text><text x="186" y="90" class="zone-lbl">B2</text></svg>';
  var contacts = [['Denise Walker', 'Brightway CM', 'primary, approver'], ['Grace Okoye', 'Board treasurer', 'approver, billing'], ['Tom Reyes', 'Clubhouse manager', 'property contact'], ['Board members', '4 others', 'approver (by policy)']];
  var main = '<div class="apphead"><span class="crumb">Clients › Maple Ridge HOA › North Entrance and Clubhouse</span><h3>Site map and service specs</h3></div>' +
    '<div class="wt-cols wide-left"><div>' + map + '<table class="data tight mt10"><thead><tr><th>Zone</th><th>Spec</th></tr></thead><tbody><tr><td>T1, T2 turf</td><td>Mow 3.5 in, 28 cuts, clippings mulched; no blowing onto street</td></tr><tr><td>B1, B2 beds</td><td>Weed and edge monthly; 2 in hardwood mulch in May; seasonal color in B1</td></tr><tr><td>Walks</td><td>Blow after each visit; salt on snow nights (P1)</td></tr></tbody></table></div>' +
    '<div class="panel"><h4>Contacts and what they can do</h4><ul class="wt-list">' + contacts.map(function (c) { return '<li class="wt-row soft"><span class="wt-ic">' + ic('user') + '</span><span><b>' + c[0] + '</b><span class="sub">' + c[1] + '</span></span>' + pill('info', c[2]) + '</li>'; }).join('') + '</ul><div class="wt-note mt6">Tom sees visit times and photos for the clubhouse only; only approvers see proposals; only billing contacts see invoices.</div></div></div>';
  return browser('app.rootline.com/t/greenleaf/clients/maple-ridge/properties/north-entrance', shellC('Clients', main), 'Greenleaf office: site map');
};
WT.bts['h04-sitemap'] = function (S) {
  return {
    what: 'Each property gets a site map drawn on the same to-scale model the Design Studio uses, with zones carrying their own service specs. The crew app shows the same map, so "B1 monument bed" means the same thing to Luis, the crew and the HOA. Contacts get scopes, so each person sees only what they should.',
    agents: [['Site model', 'Zones and specs on the shared property map', 1]],
    trace: [{ c: 'sitemap.zones(North Entrance)', r: '2 turf, 2 bed, walks', ms: '—', det: true }, { c: 'contacts.scopes(Maple Ridge)', r: 'primary, approver, billing, property contact', ms: '—', det: true }],
    hitl: [['Luis', 'sets zones and specs; Denise manages the HOA\'s contacts in the portal.']],
    tags: [['mvp', 'client contacts with scopes, property maps'], ['v1', 'zone-level SOW and commercial hierarchy']],
    specs: 'Spec: 14 §4.6.1 · 02 §5.11 · 06 §3.3 · 10 (site model)'
  };
};

/* h05 */
WT.screens['h05-inspection'] = function (S) {
  var cats = [['Turf', 4.5], ['Beds and weeds', 3.5], ['Edging', 4.0], ['Litter and debris', 5.0], ['Irrigation', 4.0]];
  var main = '<div class="apphead"><span class="crumb">Jobs › Inspections</span><h3>Pond Commons and Walking Trail · monthly inspection</h3>' + (S.insp ? pill('ok', 'Shared with the HOA') : pill('info', 'Draft')) + '</div>' +
    '<div class="wt-cols"><div class="panel"><h4>Scores</h4><table class="data tight"><tbody>' + cats.map(function (c) { return '<tr><td>' + c[0] + '</td><td class="num"><span class="score' + (c[1] < 4 ? ' mid' : '') + '">' + c[1].toFixed(1) + '</span></td></tr>'; }).join('') + '<tr><td><b>Overall</b></td><td class="num"><span class="score">4.1</span></td></tr></tbody></table><div class="wt-note mt6">8 photos, GPS- and time-stamped. Scored by Luis Ortega.</div></div>' +
    '<div class="wt-stack"><div class="panel"><h4>Deficiency</h4><div class="wt-row"><span class="wt-ic warn">' + ic('warn') + '</span><span>Trail beds need weeding (south loop)<span class="sub">3 photos</span></span>' + (S.wo ? pill('ok', 'WO-3318 · May 14') : '<button type="button" class="btn xs primary" data-act="wo" data-k="wo">Create work order</button>') + '</div><div class="wt-note mt6">Corrective work is part of the contract; it doesn\'t bill extra.</div></div>' +
    (S.insp ? '<div class="toast">' + ic('check') + 'Score 4.1 shared with Denise; trend and photos in the portal</div>' : '<button type="button" class="btn primary" data-act="insp" data-k="insp">Share inspection with the HOA</button>') + '</div></div>';
  return browser('app.rootline.com/t/greenleaf/jobs/inspections/IN-0912', shellC('Jobs', main), 'Greenleaf office: inspection');
};
WT.actions.wo = function (el, S) { S.wo = true; };
WT.actions.insp = function (el, S) { S.insp = true; };
WT.ensure['h05-inspection'] = function (S) { S.wo = true; S.insp = true; };
WT.bts['h05-inspection'] = function (S) {
  return {
    what: 'Commercial clients judge vendors on quality. Luis scores each property monthly with a checklist and photos; low categories create corrective work orders that the crew sees on its route. Sharing the score with the HOA builds trust and feeds the property scorecard.',
    agents: [['Quality audits', 'Scored checklists, deficiencies to work orders', 1]],
    trace: [{ c: 'inspection.scored(Pond Commons)', r: '4.1 overall; beds 3.5', ms: '—', det: true }, { c: 'work_order.create(trail beds)', r: S.wo ? 'WO-3318 scheduled May 14' : 'waiting', ms: S.wo ? '40 ms' : '', det: true, pending: !S.wo }, { c: 'portal.publish(inspection)', r: S.insp ? 'visible to Denise' : 'draft', ms: S.insp ? '30 ms' : '', det: true, pending: !S.insp }],
    hitl: [['Luis', 'scores and decides what the client sees.']],
    tags: [['v1', 'scored quality audits per zone (commercial expansion)']],
    specs: 'Spec: 14 §4.6.2 (site inspections) · 24 C14-030 · 18 C18-024 (property scorecard)'
  };
};

/* h06 */
WT.screens['h06-enhancement'] = function (S) {
  var approved = S.enhVotes >= 3;
  var main = '<div class="apphead"><h3>North entrance refresh · enhancement</h3>' + (approved ? pill('ok', 'Approved') : pill('info', S.enhVotes + ' of 3 approvals')) + '</div>' +
    '<div class="wt-cols"><div class="panel"><h4>Proposal</h4><dl class="kv"><dt>Scope</dt><dd>3 Cercis canadensis and seasonal color in the monument bed</dd><dt>Price</dt><dd class="num">$8,640.00</dd><dt>PO</dt><dd>MRH-2027-014 (format valid)</dd><dt>Includes</dt><dd>AI mockup, plan, plant list (14), 4 photos</dd></dl><div class="wt-note mt6">Mockup made with the AI design flow and labeled as an artist\'s rendering.</div></div>' +
    '<div class="wt-stack"><div class="panel"><h4>Enhancement budget (HOA, this year)</h4><div class="cost-bars" style="display:grid;gap:6px"><div class="tiny">Used $21,100 · this project $8,640 · remaining after $12,260 of $42,000</div><div class="prog-bar" style="height:12px;border-radius:6px;background:var(--surface-3);overflow:hidden;display:flex"><i style="display:block;width:50.2%;background:var(--moss-400)"></i><i style="display:block;width:20.6%;background:var(--marigold-400)"></i></div></div></div>' +
    '<div class="panel"><h4>Board approvals</h4><div class="tiny muted">Paul Chen ✓ · Grace Okoye ✓ · ' + (approved ? 'Linda Ross ✓' : 'Linda Ross, Ana Hill pending') + '</div>' + (approved ? (S.scheduled ? '<div class="okline mt6">' + ic('check') + 'Scheduled for Crew 1, week of May 18; plants on PO-1204</div>' : '<button type="button" class="btn sm primary mt6" data-act="sched" data-k="sched">Schedule the work</button>') : '<button type="button" class="btn sm mt6" data-act="enhVote" data-k="enhVote">Simulate Linda\'s vote</button>') + '</div></div></div>';
  return browser('portal.greenleafgrounds.com/approvals/enh-2027-014', portal(main), 'Client portal: enhancement approval');
};
WT.actions.enhVote = function (el, S) { S.enhVotes = 3; };
WT.actions.sched = function (el, S) { S.scheduled = true; };
WT.ensure['h06-enhancement'] = function (S) { S.enhVotes = 3; S.scheduled = true; };
WT.bts['h06-enhancement'] = function (S) {
  return {
    what: 'Enhancements are where commercial accounts grow. Sam captures the opportunity, illustrates it with an AI mockup and sends a PO-ready proposal that shows how much of the HOA\'s enhancement budget it uses. The board approves by quorum; approval schedules the work and orders the plants.',
    agents: [['Enhancement pipeline', 'Capture, budget checks, approvals', 1]],
    trace: [{ c: 'enhancement.propose(EN-2027-014)', r: '$8,640 · PO MRH-2027-014', ms: '—', det: true }, { c: 'budget.check(Maple Ridge enhancements)', r: 'uses 41% of $20,900 remaining', ms: '20 ms', det: true }, { c: 'approval.quorum(3 of 5)', r: S.enhVotes >= 3 ? 'met' : S.enhVotes + ' of 3', ms: '—', det: true }, { c: 'job.create + po.draft', r: S.scheduled ? 'Crew 1, week of May 18; PO-1204' : 'after approval', ms: S.scheduled ? '90 ms' : '', det: true, pending: !S.scheduled }],
    hitl: [['The board', 'approves; Sam and Luis schedule.']],
    creditNote: 'The mockup was made earlier in the AI design flow; no new credits here.',
    tags: [['mvp', 'enhancement capture'], ['v1', 'AI-illustrated, PO-ready pipeline with budgets and board packs']],
    specs: 'Spec: 14 §4.6.3 · 06 §4.16.3 · 11 (board packs) · 24 C14-031, C06-034'
  };
};

/* h07 */
WT.screens['h07-snow'] = function (S) {
  var sites = [['North Entrance and Clubhouse', 'P1'], ['Pond Commons trail lot', 'P2'], ['Pool and Amenity Center', 'P2'], ['Section 3 drives', 'P3'], ['Westgate Entrance', 'P1']];
  var main = '<div class="apphead"><span class="crumb">Schedule › Storm night</span><h3>' + ic('snow') + ' Jan 14 · 3.5 in overnight</h3>' + pill('info', S.storm + ' of 5 sites done') + '</div>' +
    '<div class="wt-cols wide-left"><div class="panel"><h4>Maple Ridge sites (Snow Lite site list)</h4><ul class="wt-list">' + sites.map(function (s, i) { var done = i < S.storm; return '<li class="wt-row' + (done ? ' sel' : ' soft') + '"><span class="wt-ic ' + (done ? 'ok' : '') + '">' + ic(done ? 'check' : 'snow') + '</span><span><b>' + s[0] + '</b><span class="sub">' + (done ? 'Plowed and salted · GPS photos · ' + ['2:14', '2:58', '3:31', '4:10', '4:52'][i] + ' AM' : 'Priority ' + s[1]) + '</span></span>' + pill(s[1] === 'P1' ? 'warn' : '', s[1]) + '</li>'; }).join('') + '</ul>' + (S.storm < 5 ? '<button type="button" class="btn sm mt10" data-act="storm" data-k="storm">Simulate the next site completed</button>' : '<div class="toast mt10">' + ic('check') + '5 sites done by 5:20 AM, inside the 2-hour response window</div>') + '</div>' +
    '<div class="wt-stack"><div class="panel"><h4>Billing from the logs</h4><dl class="kv"><dt>Pushes</dt><dd class="num">5 × $148 = $740</dd><dt>Salting</dt><dd class="num">$285</dd><dt>Storm total</dt><dd class="num">$1,025</dd></dl><div class="wt-note mt6">Lines go onto the monthly invoice with the per-site proof PDFs.</div></div>' +
    '<div class="panel soft"><h4>With the full module ' + tag('v1') + '</h4><ul style="margin:0;padding-left:18px;font-size:.78rem;color:var(--text-2)"><li>Storm event created from the weather feed at the 2 in trigger</li><li>Site maps with priorities and no-pile areas</li><li>Salt inventory per site</li><li>Sealed proof packets for slip-and-fall defense</li><li>Seasonal caps and floors, subcontractor plowers</li></ul></div></div></div>';
  return browser('app.rootline.com/t/greenleaf/schedule/storm/2027-01-14', shellC('Schedule', main), 'Greenleaf office: storm night');
};
WT.actions.storm = function (el, S) { S.storm = Math.min(5, S.storm + 1); };
WT.ensure['h07-snow'] = function (S) { S.storm = 5; };
WT.bts['h07-snow'] = function (S) {
  return {
    what: 'At MVP, Snow Lite runs storm nights from a priority site list: crews log each site with timestamped GPS photos, and the logs become per-push and per-application invoice lines plus a proof PDF per site. The full Snow & Ice module at V1 adds the storm event engine, site maps, salt inventory and sealed proof packets.',
    agents: [['Snow Lite', 'Storm visits on the standard visit pipeline', 1]],
    trace: [{ c: 'snow.site_list(Maple Ridge)', r: '5 sites by priority', ms: '—', det: true }, { c: 'visit.completed(storm ×' + S.storm + ')', r: S.storm + ' sites logged with GPS photos', ms: '—', det: true, pending: !S.storm }, { c: 'billable_item.create(per push, per application)', r: S.storm === 5 ? '$1,025 for the storm' : 'as sites finish', ms: '—', det: true, pending: S.storm < 5 }],
    hitl: [['Luis', 'watches the night; Tasha reviews storm billing before the monthly invoice.']],
    tags: [['mvp', 'Snow Lite site list, storm logs, per-push billing, proof PDFs'], ['v1', 'full Snow & Ice module']],
    specs: 'Spec: 14 §4.3.0 (Snow Lite), §4.3.1-4.3.8 (full module) · 07 §4.2.10'
  };
};

/* h08 */
WT.screens['h08-billing'] = function (S) {
  var mr = PROPS.map(function (p) { return [p[0], p[2]]; });
  var main = '<div class="apphead"><span class="crumb">Money › Statements</span><h3>Brightway Community Management · January statement</h3><span class="sp"></span><label class="wt-toggle"><input type="checkbox" data-in="byProp" data-k="byProp"' + (S.byProp ? ' checked' : '') + '>By property</label></div>' +
    '<div class="panel"><table class="data tight"><thead><tr><th>Client · property</th><th>PO</th><th class="num">Amount</th></tr></thead><tbody>' +
    '<tr><td colspan="3"><b>Maple Ridge HOA</b> · bill to: Maple Ridge HOA, c/o Brightway CM</td></tr>' +
    (S.byProp ? mr.map(function (p) { return '<tr><td>&nbsp;&nbsp;' + p[0] + ' · maintenance</td><td>MRH-2027-001</td><td class="num">' + money(p[1], true) + '</td></tr>'; }).join('') : '<tr><td>&nbsp;&nbsp;Grounds maintenance, 5 properties</td><td>MRH-2027-001</td><td class="num">$7,200.00</td></tr>') +
    '<tr><td>&nbsp;&nbsp;Storm Jan 14: 5 pushes, 1 salting</td><td>MRH-2027-001</td><td class="num">$1,025.00</td></tr>' +
    '<tr><td colspan="3"><b>Cedar Run Condominiums</b> · bill to: Cedar Run COA, c/o Brightway CM</td></tr><tr><td>&nbsp;&nbsp;Grounds maintenance, 3 buildings</td><td>CR-118</td><td class="num">$3,900.00</td></tr><tr><td>&nbsp;&nbsp;Storm Jan 14: 3 pushes</td><td>CR-118</td><td class="num">$444.00</td></tr>' +
    '<tr><td colspan="2"><b>Statement total</b></td><td class="num"><b>$12,569.00</b></td></tr></tbody></table><div class="wt-note mt6">Two separate legal bill-to entities on one statement for the management company. Each HOA gets its own invoice and tax treatment; HOAs are not tax-exempt by default (verify Ohio rules). Net 60.</div></div>';
  return browser('app.rootline.com/t/greenleaf/money/statements/brightway-2027-01', shellC('Money', main), 'Greenleaf office: consolidated statement');
};
WT.inputs.byProp = function (el, S) { S.byProp = el.checked; };
WT.bts['h08-billing'] = function (S) {
  return {
    what: 'Property management companies want one statement for many communities, but each HOA is its own legal customer with its own PO, budget and tax treatment. Consolidated billing keeps per-property bill-to entities and rolls them into one statement for Brightway, with lines that can be shown by property.',
    agents: [['Billing Engine', 'Per-property bill-to, PO limits, portfolio statements', 1]],
    trace: [{ c: 'billing_run.post(Jan, Brightway portfolio)', r: '2 invoices (Maple Ridge, Cedar Run)', ms: '300 ms', det: true }, { c: 'po.check(MRH-2027-001, CR-118)', r: 'within PO limits', ms: '15 ms', det: true }, { c: 'statement.portfolio(Brightway)', r: '$12,569.00', ms: '120 ms', det: true }],
    hitl: [['Tasha', 'approves the run; Denise approves invoices in the portal if the HOA requires it [V1].']],
    tags: [['v1', 'consolidated portfolio billing, client-side AP approval'], ['mvp', 'statements, PO numbers']],
    specs: 'Spec: 07 §4.4.10 (consolidated billing), §4.8 (statements) · 24 C07-025'
  };
};

/* h09 */
WT.screens['h09-portfolio'] = function (S) {
  var main = '<div class="apphead"><h3>Maple Ridge HOA · 5 properties</h3><span class="sp"></span>' + pill('', 'Denise Walker · Brightway CM') + '</div>' +
    '<div class="wt-kpis"><div class="wt-kpi"><div class="l">Visits on schedule</div><div class="v">98%</div><div class="d">59 of 60 · 1 rain delay</div></div><div class="wt-kpi"><div class="l">Inspection score</div><div class="v">4.4 / 5</div><div class="d delta up">+0.1</div></div><div class="wt-kpi"><div class="l">Budget used</div><div class="v">$64,650</div><div class="d">of $167,880 this year</div></div><div class="wt-kpi"><div class="l">Open balance</div><div class="v">$8,040</div><div class="d">ACH autopay</div></div></div>' +
    '<div class="panel mt10"><div class="ph">April report · 5 properties · PDF ' + (S.report ? aiChip('Summary reviewed by Greenleaf ops') : '') + '</div>' + (S.report ? '<div class="ai-box"><div class="ai-h">' + ic('spark') + 'Summary</div><p class="tiny">In April, crews completed all 18 scheduled visits across 5 properties. Spring cleanup and the first mow finished by April 16, and pre-emergent went down on all turf on April 8 and 9. Irrigation start-up found 6 broken rotor heads in zones 2 and 7, now repaired. Pond Commons scored 4.1 because trail beds need weeding, scheduled for May 14.</p></div>' : '<button type="button" class="btn sm ai" data-act="report" data-k="report">' + ic('spark') + 'Draft the April summary</button> <span class="cost">2 credits</span>') + '</div>';
  return browser('portal.greenleafgrounds.com/portfolio/maple-ridge-hoa', portal(main), 'Client portal: portfolio');
};
WT.actions.report = function (el, S) { S.report = true; };
WT.ensure['h09-portfolio'] = function (S) { S.report = true; };
WT.bts['h09-portfolio'] = function (S) {
  return {
    what: 'Denise manages several communities and reports to boards. Her portfolio shows service, quality, budget and balance across the HOA\'s properties, and the monthly report pairs Greenleaf\'s data (visits, repairs, applications, photos) with a short AI-written summary that Greenleaf ops reviews before it goes out.',
    agents: [['Monthly property report', 'AI summary from visits, inspections and repairs [V1]', 0], ['Portfolio dashboard', 'Service, quality and budget [V1]', 1]],
    trace: [{ c: 'report.collect(Maple Ridge, April)', r: '18 visits, 6 repairs, 2 applications, 31 photos', ms: '600 ms', det: true }, { c: 'copilot.summarize(report)', r: S.report ? '1 paragraph, numbers grounded' : 'not drafted', ms: S.report ? '2.8 s' : '', pending: !S.report }, { c: 'review.ops(Luis)', r: S.report ? 'approved' : '', ms: S.report ? 'human' : '', pending: !S.report }],
    hitl: [['Luis', 'reviews the summary before Denise sees it.']],
    creditNote: 'Report summary: 2 credits.',
    tags: [['v1', 'portfolio dashboard, monthly property reports, property scorecard'], ['mvp', 'property switcher and per-property pages']],
    specs: 'Spec: 06 §4.16.1 · 14 §4.6.4 · 18 §4.14.1 · 24 C06-033, C14-032'
  };
};

/* h10 */
WT.screens['h10-renewal'] = function (S) {
  var main = '<div class="apphead"><h3>Approvals</h3>' + pill('info', S.renew ? '0 waiting' : '1 waiting') + '</div><div class="panel"><div class="ph">Renewal agent (A13) · SA-2201 · Maple Ridge HOA</div>' +
    '<div class="wt-cols"><div><dl class="kv"><dt>This year</dt><dd>$7,200 / month · 98% on schedule · 4.4 inspections</dd><dt>Escalator</dt><dd>CPI-linked, capped at 4% (contract §9)</dd><dt>Proposed</dt><dd class="num"><b>$7,452 / month</b> (+3.5%)</dd><dt>Snow</dt><dd>Offer the seasonal contract with a cap (V1)</dd><dt>Churn risk</dt><dd>' + pill('ok', 'Low') + '</dd></dl></div>' +
    '<div class="wt-bubble ai">Dear Denise and the Maple Ridge board: thank you for a strong year. Your grounds contract renews April 1 at $7,452 a month under the contract\'s CPI escalator (+3.5%). The attached scorecard shows 98% of visits on schedule and an average inspection score of 4.4. We\'re also offering a seasonal snow contract with a 12-event cap for budget certainty.</div></div>' +
    '<div class="flex mt10">' + (S.renew ? '<span class="okline">' + ic('check') + 'Approved by Erin · sent to the board for a 3-of-5 vote</span>' : '<button type="button" class="btn sm primary" data-act="renew" data-k="renew">' + ic('check') + 'Approve and send to the board</button><span class="cost">2 credits</span>') + '</div></div>';
  return browser('app.rootline.com/t/greenleaf/approvals', shellC('Approvals', main), 'Greenleaf office: renewal approval');
};
WT.actions.renew = function (el, S) { S.renew = true; };
WT.bts['h10-renewal'] = function (S) {
  return {
    what: 'The Renewal agent applies the contract\'s escalator, adds the year\'s performance evidence and drafts the renewal for the board. Erin approves the price; the renewal then goes through the same board approval policy as the original contract.',
    agents: [['Renewal agent (A13)', 'Escalator, evidence, renewal draft', 0]],
    trace: [{ c: 'agreement.renewal_due(SA-2201)', r: '60 days before April 1', ms: '—', det: true }, { c: 'escalator.cpi(cap 4%)', r: '+3.5% → $7,452 / month', ms: '20 ms', det: true }, { c: 'agent.A13.draft', r: S.renew ? 'approved by Erin' : 'waiting', ms: '2.1 s', human: !S.renew }, { c: 'approval.policy(board 3 of 5)', r: S.renew ? 'vote opened in the portal' : '', ms: S.renew ? '—' : '', det: true, pending: !S.renew }],
    hitl: [['Erin', 'approves the price.'], ['The board', 'votes on the renewal.']],
    levels: ['A13 at L2'],
    creditNote: 'Renewal draft: 2 credits.',
    tags: [['v1', 'Renewal agent, renewals in the portal'], ['mvp', 'auto-renewal with escalators and notice rules']],
    specs: 'Spec: 17 §4.5.14 (A13) · 07 §4.3 · 02 §5.11'
  };
};

/* h11 */
WT.screens['h11-recap'] = function (S) {
  var rows = [['RFP', 'RFP / Bid Parser (A10)', 'AI [V1]', 'Sam', '30'], ['Estimate', 'Estimating engine', 'Rules', 'Sam, Erin', '0'], ['Contract', 'Approval policy: 3 of 5', 'Rules [V1]', 'The board', '0'], ['Inspection', 'Scored audit and work order', 'Rules [V1]', 'Luis', '0'], ['Enhancement', 'Budget check and quorum', 'Rules [V1]', 'The board', '0'], ['Storm night', 'Snow Lite logs and billing', 'Rules', 'Luis, Tasha', '0'], ['Billing', 'Consolidated statement', 'Rules [V1]', 'Tasha', '0'], ['Monthly report', 'AI summary', 'AI [V1]', 'Luis', '2'], ['Renewal', 'Renewal agent (A13)', 'AI [V1]', 'Erin, the board', '2']];
  return '<div class="wt-cols wide-left"><div class="panel"><h4>Everything that ran</h4><div class="table-scroll"><table class="data tight"><thead><tr><th>Step</th><th>What ran</th><th>Kind</th><th>Approved by</th><th class="num">Credits</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + (/AI/.test(r[2]) ? pill('ai', r[2]) : pill('', r[2])) + '</td><td>' + r[3] + '</td><td class="num">' + r[4] + '</td></tr>'; }).join('') + '<tr><td colspan="4"><b>Total</b></td><td class="num"><b>34</b></td></tr></tbody></table></div></div>' +
    '<div class="wt-stack"><div class="panel"><h4>Scope</h4><div style="display:grid;gap:5px"><div class="tagrow">' + tag('mvp') + '<span class="note">estimating engine, client contact scopes, statements, Snow Lite per-push billing, enhancement capture, property pages</span></div><div class="tagrow">' + tag('v1') + '<span class="note">commercial hierarchy, RFP parser, quorum approvals, zone SOW and scored audits, PO-ready enhancement pipeline, consolidated billing, portfolio dashboard and reports, full snow module, Renewal agent</span></div><div class="tagrow">' + tag('v2') + '<span class="note">board meeting workflows</span></div></div></div>' +
    '<div class="flex"><a class="btn" href="#overview">' + ic('arrow-l') + 'Back to start</a><a class="btn" href="screens-field-client-admin.html#portal-hoa">HOA portfolio screen</a><a class="btn primary" href="walkthroughs.html">All walkthroughs ' + ic('arrow-r') + '</a></div></div></div>';
};
WT.bts['h11-recap'] = function (S) {
  return {
    what: 'Commercial work runs on approvals, evidence and budgets. Rootline keeps the board, the property manager and the crew on the same records, and AI helps where reading and writing take time: the RFP, the monthly report and the renewal.',
    hitl: [['People approved', 'the bid review, the contract, the enhancement, the storm billing, the report and the renewal.']],
    creditNote: '34 credits, mostly the 42-page RFP.',
    tags: [['v1', 'most commercial features'], ['mvp', 'the foundations they build on']],
    specs: 'Spec: 02, 03, 06, 07, 10, 14, 17, 18, 24'
  };
};
