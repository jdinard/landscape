/* screens-web-more: Operations, Team, Marketing, Reports, Automations and Settings in the Company web app.
   Registered with RL.screen(id, fn). Data: c.D (app/data.js). Gating: c.has, c.feat, c.allowed, c.sees, c.inLens.
   Spec refs: 13 (operations), 15 (team), 16 (marketing), 17 (automations, agents), 18 (reports),
   02 §7.2-§7.7 (roles, team, support access), 21 §5.2 (settings), 22 §4 and §9 (plans, seats, meters). */
(() => {
'use strict';
const RL = window.RL, h = RL.h, { esc, icon, money, num } = h;
const I = RL.idx;

// ---------- shared helpers ----------
const hs = s => { let x = 7; for (const ch of String(s)) x = (x * 31 + ch.charCodeAt(0)) >>> 0; x ^= x >>> 16; x = Math.imul(x, 0x45d9f3b) >>> 0; x ^= x >>> 16; return x >>> 0; };
/* In-content banner: one text block (mx-banner is a flex row meant for the frame top), rounded. */
const bnr = (html, tone) => `<div class="mx-banner ${tone || 'info'}" style="border:1px solid var(--border);border-radius:8px"><span>${html}</span></div>`;
/* Toggle without the browser's default button chrome (.tgl in app.css does not reset border and background). */
const TGL_STYLE = 'style="border:0;background:none;padding:2px 0;text-align:left"';
const tg = (label, key, def) => h.toggle(label, key, def).replace('<button type="button" class="tgl', `<button type="button" ${TGL_STYLE} class="tgl`);
const mini = (v, max, tone) => `<span style="display:inline-block;width:56px;vertical-align:middle">${h.progress(v, max, tone)}</span>`;
const crewOf = (D, name) => (D.crews.find(cr => cr.lead === name || cr.members.includes(name)) || {}).name || '-';
const pick = (s, arr) => arr[hs(s) % arr.length];
const rnd = (s, a, b) => a + hs(s) % (b - a + 1);
/* Write access: the grant's first token holds W, D or X (02 §10.1). 'F' means not in the matrix (full). */
const writes = (c, cap) => { const g = String(c.can(cap) || '-'); if (g === 'F') return true; if (/^-/.test(g)) return false; return /[WDX]/.test(g.split(/[\s/]/)[0]); };
const roPill = (c, cap) => writes(c, cap) ? '' : h.pill('Read only', '', 'eye');
const ask = c => `Ask ${esc(c.owner)} (owner) to change this.`;
const isOwner = c => c.role === 'owner';
const fieldRole = c => c.role === 'crew_lead' || c.role === 'technician';
const stateOf = c => ((c.t.city.match(/,\s*([A-Z]{2})/) || [])[1]) || 'OH';
const prefix = c => (c.t.branches[0] || 'HQ').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() || 'HQ';
const dates = c => c.winter ? ['Jan 12', 'Jan 13', 'Jan 14', 'Jan 15', 'Jan 18', 'Jan 20', 'Jan 25', 'Feb 1'] : ['May 11', 'May 12', 'May 13', 'May 14', 'May 17', 'May 18', 'May 20', 'May 24'];
const past = c => c.winter ? ['Jan 11', 'Jan 8', 'Jan 6', 'Jan 4', 'Dec 30', 'Dec 21', 'Dec 14', 'Dec 2'] : ['May 10', 'May 7', 'May 6', 'May 4', 'Apr 30', 'Apr 26', 'Apr 19', 'Apr 12'];
const num0 = (k, d) => { const v = parseFloat(RL.ui[k]); return isNaN(v) ? d : v; };
/* Field-class aware mask that also honours 'self' grants (pay_rate, employee_pii). */
const seesFor = (c, fc, name) => { const v = String(c.fc(fc)); if (/^-/.test(v)) return false; if (v === 'self') return name === c.who; return true; };
const maskFor = (c, fc, name, val) => seesFor(c, fc, name) ? val : `<span class="masked" title="Hidden: field class ${esc(fc)} is '${esc(c.fc(fc))}' for ${esc(c.role)} (02 §10.2)">•••</span>`;
/* A button that shows a toast and stays on the page (mock action). */
const tbtn = (label, msg, o) => { o = o || {}; return `<button type="button" class="btn${o.kind ? ' ' + o.kind : ''}${o.sm ? ' sm' : ''}" data-act="more-toast" data-msg="${esc(msg)}"${o.disabled ? ' disabled' : ''}${o.title ? ` title="${esc(o.title)}"` : ''}>${o.icon ? icon(o.icon) : ''}${label}</button>`; };
RL.act('more-toast', (el) => { RL.closeModal(); RL.toast(esc(el.dataset.msg || 'Done (mock).')); return false; });
const seg = (key, opts, cur) => `<span class="flex gap4">${opts.map(([v, l]) => h.btn(l, { ui: key, val: v, sm: true, kind: cur === v ? 'primary' : 'ghost', pressed: String(cur === v) })).join('')}</span>`;
const lockPill = (label) => h.pill(label || 'Not in plan', 'warn', 'lock');
const inlineLock = (c, key) => isOwner(c) ? h.lock(c, key) : h.note(`${esc((I.FEATS[key] || {}).name || key)} is not part of ${esc(c.plan.name)}. ${ask(c)}`);
const statusPill = (s) => {
  const tone = /^(OK|Active|Approved|Paid|Received|Matched|Connected|Done|Sent|Live|Healthy|Verified|Closed|Hired|Enabled|Recordable)/i.test(s) ? 'ok'
    : /(overdue|expired|down|hold|failed|blocked|EXP|rejected|denied|missing)/i.test(s) ? 'danger'
      : /(pending|draft|expiring|warn|review|variance|waiting|partial|in shop|due|invited|not started)/i.test(s) ? 'warn' : 'info';
  return h.pill(esc(s), tone);
};
const kv2 = (rows) => h.kv(rows);
const sec = (title, body, o) => h.card(Object.assign({ title, body }, o || {}));

/* Plan and seat math (22 §4.2, §4.3). */
const interval = c => (c.planCode === 'starter' || c.planCode === 'design_solo') ? 'monthly' : 'annual';
const basePrice = c => interval(c) === 'annual' ? (c.plan.annual || c.plan.monthly || 0) : (c.plan.monthly || c.plan.annual || 0);
function seats(c) {
  const t = c.t, D = c.D, pl = c.plan;
  const office = Math.max(D.people.filter(p => p.seat === 'office').length, Math.round(t.people_peak * .08));
  const bk = D.people.some(p => p.role === 'bookkeeper') ? 1 : 0;
  const fieldPeak = Math.max(0, t.people_peak - office - bk);
  const fieldWinter = Math.max(0, t.people_winter - office - bk);
  const field = c.winter ? fieldWinter : fieldPeak;
  const designers = D.people.filter(p => p.role === 'designer').length || ((t.modules.includes('install_projects') || t.design_only) ? 1 : 0);
  const inc = { office: pl.office_seats, field: pl.field_seats, designer: pl.designer_seats || 0 };
  const ex = { office: pl.extra_office || 0, field: pl.extra_field || 0, designer: pl.extra_designer || 0 };
  const over = (u, i) => i == null ? 0 : Math.max(0, u - i);
  return { office, field, fieldPeak, fieldWinter, designers, bk, inc, ex, oOffice: over(office, inc.office), oField: over(field, inc.field), oDesigner: over(designers, inc.designer) };
}
/* Credits used: same basis as the top bar, but scaled to the plan in view (see report: top bar ignores plan override). */
const credits = c => { const inc = c.plan.ai_credits || 0; return { inc, used: Math.round(inc * .58), pack: c.planCode === 'starter' ? 0 : 1000 }; };

// =====================================================================
// OPERATIONS (13)
// =====================================================================
const MODES = [
  { id: 'off', name: 'Off', scope: 'MVP', who: 'Solo and lawn-only operators', on: 'Price Book materials only, receipts to jobs, load-out lists from visits', acct: 'Purchases expensed to the job' },
  { id: 'light', name: 'Light', scope: 'MVP', who: '2-15 person companies', on: 'Yard and truck locations, job-direct POs, receive, issue to job, truck par lists', acct: 'Expensed; on-hand is memo only' },
  { id: 'standard', name: 'Standard', scope: 'V1', who: 'Design/build and maintenance firms with a yard', on: 'Perpetual stock, moving-average cost, reservations, reorder points, cycle counts', acct: 'Inventory asset; issues post to job cost' },
  { id: 'advanced', name: 'Advanced', scope: 'V1', who: 'Multi-branch, chemical- or nursery-heavy firms', on: 'Bins, lots and expiry, serials, branch transfers, FIFO, consignment', acct: 'As Standard, plus in-transit' },
];
const MODE_PLAN = { starter: ['off'], grow: ['off', 'light', 'standard'], pro: ['off', 'light', 'standard', 'advanced'], enterprise: ['off', 'light', 'standard', 'advanced'] };
const modeOk = (c, id) => (MODE_PLAN[c.planCode] || ['off']).includes(id);
const invMode = c => { const def = c.planCode === 'starter' || c.t.people_peak <= 3 ? 'off' : 'light'; const m = RL.ui['ops.mode'] || def; return modeOk(c, m) ? m : def; };
const VENDORS_X = [['Stone and block yard (illustrative)', 'Hardscape materials', 'Net 30'], ['Irrigation parts distributor (illustrative)', 'Irrigation', 'Net 30'], ['Equipment dealer (illustrative)', 'Equipment and parts', 'Due on receipt'], ['Bulk salt supplier (illustrative)', 'Ice melt', 'Net 15']];

function buyLists(c) {
  const d = dates(c);
  return c.D.jobs.filter(j => ['Install', 'Lawn program', 'Irrigation', 'Lighting', 'Maintenance'].includes(j.type)).slice(0, 6).map((j, i) => ({
    id: 'BUY-' + j.id.slice(2), job: j.id, client: j.client, title: j.title, lines: rnd(j.id, 4, 16), needBy: d[(i + 2) % d.length],
    est: Math.round(j.value * (.16 + (hs(j.id) % 9) / 100) / 5) * 5,
    yard: rnd(j.id + 'y', 0, 3), status: ['Ready to order', 'Partly ordered', 'Ordered', 'Ready to order', 'Pulled from yard', 'Ordered'][i],
  }));
}
function purchaseOrders(c) {
  const D = c.D, bp = prefix(c), d = dates(c);
  const vend = D.vendors.filter(v => v.category !== 'Subcontractor' && v.category !== 'Fuel').map(v => v.name).concat(VENDORS_X.map(v => v[0]));
  const st = ['Draft', 'Pending approval', 'Sent', 'Acknowledged', 'Partly received', 'Received', 'Billed', 'Closed'];
  const ops = (c.t.cast && c.t.cast.ops_manager) || c.owner;
  return buyLists(c).concat(buyLists(c).slice(0, 2).map(b => Object.assign({}, b, { id: b.id + 'S', job: '', stock: true, est: Math.round(b.est * .6) }))).map((b, i) => {
    const total = b.est;
    const approval = b.stock ? (total > 2500 ? 'Needs approval: owner' : 'Approved by ' + ops) : total <= 2500 ? 'Auto-approved: budget fit' : total > 5000 ? 'Needs approval: owner' : 'Approved by ' + ops;
    return { id: `${bp}-PO-00${4213 + i * 7}`, vendor: b.stock ? vend[3 % vend.length] : vend[i % vend.length], job: b.job || 'Stock: ' + c.t.branches[0] + ' yard', client: b.stock ? '-' : b.client, total, status: st[(i + 1) % st.length], needBy: d[(i + 3) % d.length], approval, lines: b.lines, rev: i % 3 === 2 ? 2 : 1 };
  });
}
function bills(c) {
  return purchaseOrders(c).filter(p => /Received|Billed|Partly|Closed|Acknowledged/.test(p.status)).slice(0, 5).map((p, i) => {
    const varc = [0, 38.4, 0, -12, 0][i]; const why = ['Matched', 'price_variance', 'Matched', 'no_receipt', 'duplicate_suspected'][i];
    return { id: 'B-' + (221 + i * 3), vendor: p.vendor, po: p.id, po_amt: p.total, bill: Math.round((p.total + varc) * 100) / 100, varc, result: why, mode: i === 3 ? '2-way (service, no receipt needed)' : '2-way' };
  });
}
function assets(c) {
  const D = c.D, out = [];
  const cls = n => (D.equipment.find(e => e.name === n) || {}).kind || (/Pickup|F-250|F-350|Truck/i.test(n) ? 'vehicle' : /trailer/i.test(n) ? 'trailer' : /mower/i.test(n) ? 'mower' : /loader/i.test(n) ? 'heavy_equipment' : /plow/i.test(n) ? 'snow_equipment' : /blower/i.test(n) ? 'handheld' : 'other');
  D.equipment.forEach((e, i) => {
    const m = String(e.meter).match(/(\d+)\s*(.*)/) || [0, 0, 'h'];
    const miles = /mi/.test(m[2]);
    const k2 = cls(e.name), road = k2 === 'vehicle' || k2 === 'trailer';
    let next = e.next;
    if (road && /Blades|Oil change in/.test(next)) next = 'Oil change due in 800 mi';
    if (!road && /DVIR/.test(next)) next = k2 === 'mower' ? 'Hours not entered 3 days' : 'OK';
    if (!road && /DOT/.test(next)) next = k2 === 'snow_equipment' ? 'Pre-season prep checklist' : 'Service due in 25 h';
    if (k2 === 'mower' && next === 'OK' && i === 1) next = 'Blades due';
    out.push({ id: e.id, name: e.name, cls: k2, meter: miles ? num(+m[1] * 100) + ' mi' : num(+m[1]) + ' h', crew: e.crew, next, status: 'Active', year: 2017 + (hs(e.id) % 8), cost: [14800, 12900, 61500, 48900, 3300, 9800, 15400, 7600][i % 8] });
  });
  D.crews.forEach((cr, i) => {
    if (i > 0) out.push({ id: 'EQ-' + (40 + i), name: cr.truck + ' (1-ton dump)', cls: 'vehicle', meter: num(41000 + (hs(cr.truck) % 70000)) + ' mi', crew: cr.name, next: i === 2 ? 'Registration Jun 3' : 'OK', status: 'Active', year: 2018 + (hs(cr.truck) % 7), cost: 58000 });
    out.push({ id: 'EQ-' + (60 + i), name: 'Open trailer 6x14 #' + (i + 1), cls: 'trailer', meter: '-', crew: cr.name, next: i === 1 ? 'Defect: brake light' : i === 3 ? 'Breakaway test due' : 'OK', status: i === 1 ? 'Down' : 'Active', year: 2016 + (hs(cr.name) % 9), cost: 5200 });
  });
  return out.sort((x, y) => x.id.localeCompare(y.id, 'en', { numeric: true }));
}
const CHEM = [
  { name: 'Granular pre-emergent, prodiamine 0.38%', epa: '00000-101', ai: 'Prodiamine', signal: 'Caution', rup: false, rei: 0, rate: '3.0 lb / 1,000 sq ft', max: '2 apps / yr', uom: 'bag 50 lb', qty: 64, sds: 'Mar 2026' },
  { name: 'Broadleaf herbicide, 3-way amine', epa: '00000-214', ai: '2,4-D + MCPP-p + dicamba', signal: 'Warning', rup: false, rei: 24, rate: '1.5 fl oz / 1,000 sq ft', max: '2 apps / yr', uom: 'gal', qty: 7.5, sds: 'Jan 2026' },
  { name: 'Grub preventive granular, chlorantraniliprole', epa: '00000-322', ai: 'Chlorantraniliprole 0.067%', signal: 'Caution', rup: false, rei: 0, rate: '2.9 lb / 1,000 sq ft', max: '1 app / yr', uom: 'bag 40 lb', qty: 22, sds: 'Feb 2025' },
  { name: 'Nonselective herbicide, glyphosate 41%', epa: '00000-417', ai: 'Glyphosate', signal: 'Caution', rup: false, rei: 4, rate: '2 oz / gal spot', max: 'Label', uom: 'gal', qty: 4, sds: 'Aug 2025' },
  { name: 'Fungicide, propiconazole 14.3%', epa: '00000-528', ai: 'Propiconazole', signal: 'Caution', rup: false, rei: 24, rate: '2 fl oz / 1,000 sq ft', max: '4 apps / yr', uom: 'gal', qty: 2.5, sds: 'Oct 2024' },
  { name: 'Restricted-use insecticide (example)', epa: '00000-633', ai: 'Bifenthrin 7.9%', signal: 'Warning', rup: true, rei: 12, rate: '0.25 fl oz / 1,000 sq ft', max: 'Label', uom: 'qt', qty: 3, sds: 'Jun 2025' },
];

RL.screen('web.ops', (c, a) => {
  const D = c.D, mode = invMode(c), bl = buyLists(c), po = purchaseOrders(c), eq = assets(c);
  const openPo = po.filter(p => !/Closed|Billed/.test(p.status));
  const due = eq.filter(e => e.next !== 'OK');
  const match = bills(c).filter(b => b.result !== 'Matched');
  const f = c.feat('inventory');
  const modeCard = m => {
    const ok = modeOk(c, m.id), cur = mode === m.id;
    const pill = cur ? h.pill('Current', 'ok', 'check') : ok ? '' : lockPill(m.id === 'advanced' ? 'Pro' : m.id === 'off' ? '' : 'Grow and Pro');
    const btn = cur ? '' : ok && writes(c, 'inventory') ? h.btn(m.scope === 'V1' && mode !== 'off' ? 'Switch (opening count)' : 'Switch to ' + m.name, { sm: true, ui: 'ops.mode', val: m.id }) : '';
    return `<div class="plan-c${cur ? ' on' : ''}"><div class="flex between"><b>${m.name}</b><span class="flex gap4">${h.tag(m.scope)}${pill}</span></div><div class="tiny t3">${esc(m.who)}</div><div class="small">${esc(m.on)}</div><div class="tiny t2">${esc(m.acct)}</div>${btn ? `<div>${btn}</div>` : ''}</div>`;
  };
  return h.page({ title: 'Operations', sub: `${esc(c.t.branches.join(', '))} · inventory mode <b>${MODES.find(m => m.id === mode).name}</b>${f.note ? ' · ' + esc(f.note) : ''}`, actions: (writes(c, 'purchase_order') ? h.btn('New purchase order', { kind: 'primary', icon: 'plus', modal: 'more-new-po' }) : '') + h.btn('Buy lists', { go: 'web.purchasing' }) + roPill(c, 'inventory') })
    + (a.state === 'limit' ? bnr(`${icon('info')} Included with limits on ${esc(c.plan.name)}: ${esc(a.limit || '')}. ${isOwner(c) ? 'Pro adds multi-location stock and, from V1, Advanced mode.' : ask(c)}`, 'info') : '')
    + h.kpis([
      { label: 'Buy lists to order', value: bl.filter(b => /Ready|Partly/.test(b.status)).length, delta: bl.reduce((s, b) => s + b.lines, 0) + ' lines across ' + bl.length + ' jobs' },
      { label: 'Open purchase orders', value: openPo.length, delta: h.mask(c, 'cost', money(openPo.reduce((s, p) => s + p.total, 0))) + ' committed' },
      { label: 'Bills in match queue', value: match.length, delta: match.length ? '2-way match exceptions' : 'All matched', tone: match.length ? 'warn' : 'ok' },
      { label: 'Assets due for service', value: due.length, delta: eq.filter(e => e.status === 'Down').length + ' down, ' + eq.filter(e => /DVIR/.test(e.next)).length + ' DVIR overdue', tone: 'warn' },
      { label: 'Chemical SDS to review', value: CHEM.filter(x => /2024|Feb 2025/.test(x.sds)).length, delta: 'Older than 12 months' },
    ])
    + sec('Inventory mode', h.cols('4', MODES.map(modeCard)) + (mode === 'standard' || mode === 'advanced' ? bnr(`${icon('warn')} Switching up to ${mode === 'standard' ? 'Standard' : 'Advanced'} needs an opening count per location. The cutover date must fall in an open accounting period; ${c.winter ? 'January is a good time, yards are quiet.' : 'the off-season (Dec to Feb) is recommended.'} Until the count posts, the branch stays in its old mode (13 §4.1.6).`, 'warn') : '') + h.note('Switching up never loses data; switching down archives detail. Mode is per branch (13 §4.1.6).'), { sub: 'Off and Light ship at MVP. Standard and Advanced ship at V1.' })
    + h.cols('21', [
      sec('Buy lists from signed jobs', h.table([
        { k: 'job', label: 'Job', m: true },
        { k: 'client', label: 'Client', fmt: (v, r) => `${esc(v)}<div class="tiny t3">${esc(r.title)}</div>` },
        { k: 'lines', label: 'Lines', n: true },
        { k: 'needBy', label: 'Need by' },
        { k: 'est', label: 'Est. cost', n: true, fmt: v => h.mask(c, 'cost', money(v)) },
        { k: 'status', label: 'Status', fmt: v => statusPill(v) },
      ], bl, { go: 'web.purchasing', x: r => r.job, dense: true, empty: 'No signed jobs with material lines.' }), { flush: true, sub: 'Sourcing per line: pull from yard, blanket PO release, or preferred vendor (13 §4.8.1)' }),
      `<div class="stack12">${sec('Assets needing attention', h.list(due.sort((x, y) => (y.status === 'Down') - (x.status === 'Down')).slice(0, 5).map(e => ({ icon: e.cls === 'vehicle' || e.cls === 'trailer' ? 'truck' : 'wrench', tone: /Down|Defect|overdue/.test(e.next + e.status) ? 'danger' : 'warn', title: esc(e.name), sub: esc(e.next) + ' · ' + esc(e.crew), right: e.status === 'Down' ? h.pill('Down', 'danger') : '', go: 'web.equipment' }))) || h.empty('Nothing due.'), { flush: true })}
      ${sec('Open POs', h.list(openPo.slice(0, 4).map(p => ({ icon: 'receipt', title: `<span class="mono nowrap">${esc(p.id)}</span>`, sub: esc(p.vendor.replace(' (illustrative)', '')) + '<div class="mt8">' + statusPill(p.status) + '</div>', go: 'web.purchasing' }))), { flush: true })}</div>`,
    ]);
});
RL.modal('more-new-po', c => {
  const v = c.D.vendors.filter(x => x.category !== 'Subcontractor').map(x => x.name).concat(VENDORS_X.map(x => x[0]));
  const lim = { owner: 'unlimited', office_manager: '$5,000', ops_manager: '$2,500', crew_lead: '$300 (field purchase)' }[c.role] || '$0';
  return { title: 'New purchase order', body: h.field('Vendor', h.select(v, v[0])) + h.field('Ship to', h.select([c.t.branches[0] + ' yard', 'Job site (from job)', 'Will-call'], c.t.branches[0] + ' yard')) + h.field('Job (optional)', h.select(['Stock purchase'].concat(c.D.jobs.slice(0, 6).map(j => j.id + ' · ' + j.client)), 'Stock purchase')) + h.field('Need by', h.input(dates(c)[3])) + h.note(`Your approval limit: <b>${lim}</b> (purchase_order = ${esc(c.can('purchase_order'))}). Job POs from a buy list auto-approve when every line fits the job's material budget +10% and the total is under $2,500 (13 §4.8.3).`), foot: h.btn('Cancel', { act: 'noop' }) + tbtn('Create draft', 'Draft PO created. Add lines, then send with the vendor confirmation link.', { kind: 'primary' }) };
});

RL.screen('web.inventory', (c, a) => {
  const D = c.D, mode = invMode(c), off = mode === 'off';
  const tab = h.tab('inv.tab', 'items');
  const locs = [{ id: 'LOC-1', name: c.t.branches[0] + ' yard', type: 'Yard', items: D.inventory.length, value: D.inventory.reduce((s, i) => s + i.qty * (8 + hs(i.id) % 40), 0) }]
    .concat(D.crews.map((cr, i) => ({ id: 'LOC-' + (2 + i), name: cr.truck + ' (' + cr.name + ')', type: 'Truck', items: 4 + i % 3, value: 600 + (hs(cr.truck) % 900) })));
  const multi = c.t.branches.length > 1 && c.has('inventory') && c.feat('inventory').s === 'Y';
  const uomRow = (it) => ({ 'cu yd': '1 cu yd = 13.5 bags (2 cu ft)', ton: '1 ton = 0.74 cu yd (#57 stone, density 2,700 lb)', 'sq ft': '1 pallet = 120 sq ft; waste 5%', bag: '1 bag = 50 lb; covers 25-50 sq ft (joint width)', each: 'Buy #3 container, sell each', piece: '1 piece = 16 ft; stakes 4 per piece' }[it.uom] || '');
  const cost = it => 8 + hs(it.id) % 40;
  let body;
  if (tab === 'items') body = (off ? bnr(`${icon('info')} Off mode: items live in the Price Book as materials. No stock is tracked; receipts attach straight to jobs and load-out lists come from scheduled visits (13 §4.1.6).`, 'info') : '') + h.table([
    { k: 'name', label: 'Item', fmt: (v, r) => `<b>${esc(v)}</b><div class="tiny t3 mono">${esc(r.id)}</div>` },
    { k: 'uom', label: 'Stock UOM' },
    { k: 'conv', label: 'Conversion', fmt: (v, r) => `<span class="tiny t2">${esc(uomRow(r))}</span>` },
    { k: 'qty', label: off ? 'On hand' : 'On hand (memo)', n: true, fmt: (v, r) => off ? '<span class="t3">not tracked</span>' : `${num(v)}${r.min && v <= r.min * 1.2 ? ' ' + h.pill('Low', 'warn') : ''}` },
    { k: 'min', label: 'Truck par / min', n: true, fmt: v => off || !v ? '-' : num(v) },
    { k: 'cost', label: 'Avg cost', n: true, fmt: (v, r) => h.mask(c, 'cost', money(cost(r), { cents: true })) },
    { k: 'yard', label: 'Location' },
  ], D.inventory.map(i => Object.assign({ conv: '', cost: 0 }, i)), { dense: true });
  else if (tab === 'locations') body = (c.feat('inventory').s === 'L' && c.planCode === 'grow' ? bnr(`${icon('info')} Grow includes 1 yard plus truck locations. Multi-location stock is in Pro.`, 'info') : '') + h.table([
    { k: 'name', label: 'Location', fmt: (v, r) => `<b>${esc(v)}</b><div class="tiny t3 mono">${esc(r.id)}</div>` },
    { k: 'type', label: 'Type' }, { k: 'items', label: 'Items with stock', n: true },
    { k: 'value', label: 'Memo value', n: true, fmt: v => h.mask(c, 'cost', money(v)) },
    { k: 'id', label: '', fmt: (v, r) => r.type === 'Truck' ? h.btn('Par list', { sm: true, ui: 'inv.tab', val: 'par' }) : '' },
  ], off ? [] : locs, { dense: true, empty: 'Off mode has no stock locations. Switch to Light on the Operations page to track yard and truck quantities.' }) + (multi ? h.note(`Pro: ${esc(c.t.branches.join(', '))} each keep their own yard.`) : '');
  else if (tab === 'par') {
    const cr = D.crews[0] || { truck: 'Truck', name: '-' };
    body = sec(`Truck par list: ${esc(cr.truck)} (${esc(cr.name)})`, h.table([{ k: 'item', label: 'Item' }, { k: 'par', label: 'Par', n: true }, { k: 'now', label: 'On truck', n: true }, { k: 'load', label: 'Load out', n: true, fmt: v => v > 0 ? `<b>${v}</b>` : '-' }],
      [['Trimmer line .095 (spool)', 2, 1], ['Bar oil (qt)', 4, 1], ['Fertilizer 24-0-11 (bag)', 6, 2], ['Steel edging stakes (box)', 1, 1], ['Contractor bags (box)', 2, 0], ['Polymeric sand (bag)', 4, 4]].map(([item, par, now]) => ({ item, par, now, load: par - now })), { dense: true }), { flush: true, actions: tbtn('Print load-out sheet', 'Load-out sheet sent to the crew app for tomorrow 6:30 am.', { sm: true, icon: 'download' }) });
  } else if (tab === 'moves') body = h.table([
    { k: 'when', label: 'When' }, { k: 'type', label: 'Movement', fmt: v => h.pill(esc(v), v === 'Issue to job' ? 'info' : v === 'Receive' ? 'ok' : '') },
    { k: 'item', label: 'Item' }, { k: 'qty', label: 'Qty', n: true }, { k: 'ref', label: 'Reference', m: true }, { k: 'by', label: 'By' },
  ], D.inventory.slice(0, 6).map((it, i) => ({ when: past(c)[i] + ' ' + ['7:02', '6:48', '15:10', '9:30', '13:22', '7:15'][i], type: ['Receive', 'Issue to job', 'Transfer to truck', 'Issue to job', 'Adjust (count)', 'Receive'][i], item: it.name, qty: [12, -4, -6, -2, -1, 40][i], ref: [purchaseOrders(c)[0].id, (D.jobs[i] || D.jobs[0]).id, 'LOC-2', (D.jobs[i + 1] || D.jobs[0]).id, 'Memo count', purchaseOrders(c)[2].id][i], by: i % 2 ? (D.crews[0] ? D.crews[0].lead : c.who) : ((c.t.cast && c.t.cast.ops_manager) || c.owner) })), { dense: true }) + h.note(off ? 'Off mode records receipts against jobs only.' : 'Light mode: quantities are memo; purchases post as job expense, not inventory asset.');
  else body = sec('Cycle counts', h.note('Cycle counts, reorder points and ABC counting arrive with Standard mode.') + h.list([
    { icon: 'clipboard', title: 'Full count: ' + esc(c.t.branches[0]) + ' yard', sub: 'Required as the opening count when switching to Standard', right: h.tag('V1') },
    { icon: 'refresh', title: 'Weekly cycle count: fast movers', sub: 'Mulch, polymeric sand, fertilizer', right: h.tag('V1') },
  ]), { flush: true });
  return h.page({ title: c.tr('Inventory and yards', 'Inventario y patios'), sub: `Mode ${esc(MODES.find(m => m.id === mode).name)} · ${off ? 'no stock tracked' : locs.length + ' locations'} · ${D.inventory.length} items`, actions: (writes(c, 'inventory') && !off ? tbtn('Receive without PO', 'Receipt started: scan a packing slip or pick items.', { icon: 'download' }) + h.btn('Operations', { go: 'web.ops' }) : h.btn('Change mode', { go: 'web.ops' })) + roPill(c, 'inventory') })
    + (fieldRole(c) ? h.note('Crew roles record load-out and usage only; costs are hidden (02 §10.2).') : '')
    + h.tabs('inv.tab', [['items', 'Items and UOM', D.inventory.length], ['locations', 'Locations', off ? 0 : locs.length], ['par', 'Truck par lists'], ['moves', 'Movements'], ['counts', 'Counts ' + h.tag('V1')]], 'items') + body;
});

RL.screen('web.purchasing', (c) => {
  const tab = h.tab('po.tab', c.role === 'bookkeeper' ? 'match' : 'pos');
  const po = purchaseOrders(c), bl = buyLists(c), bs = bills(c);
  const lim = { owner: 'Unlimited', office_manager: '$5,000', ops_manager: '$2,500', crew_lead: '$300 field purchases' }[c.role] || 'None';
  let body;
  if (tab === 'buy') body = h.table([
    { k: 'id', label: 'Buy list', m: true }, { k: 'job', label: 'Job', m: true }, { k: 'client', label: 'Client' }, { k: 'lines', label: 'Lines', n: true },
    { k: 'yard', label: 'From yard', n: true }, { k: 'needBy', label: 'Need by' }, { k: 'est', label: 'Est. cost', n: true, fmt: v => h.mask(c, 'cost', money(v)) },
    { k: 'status', label: '', fmt: (v, r) => /Ready|Partly/.test(v) && writes(c, 'purchase_order') ? tbtn('Create POs', `${r.lines - r.yard} lines grouped into POs by vendor; ${r.yard} pulled from yard.`, { sm: true }) : statusPill(v) },
  ], bl, { dense: true });
  else if (tab === 'pos') body = h.table([
    { k: 'id', label: 'PO', m: true, fmt: (v, r) => `${esc(v)}${r.rev > 1 ? ' <span class="tiny t3">rev ' + r.rev + '</span>' : ''}` },
    { k: 'vendor', label: 'Vendor' }, { k: 'job', label: 'Job / stock', fmt: (v, r) => `<span class="mono tiny">${esc(v)}</span><div class="tiny t3">${esc(r.client)}</div>` },
    { k: 'total', label: 'Total', n: true, fmt: v => h.mask(c, 'cost', money(v)) }, { k: 'needBy', label: 'Need by' },
    { k: 'approval', label: 'Approval', fmt: v => `<span class="tiny">${/Needs/.test(v) ? h.pill(esc(v), 'warn') : esc(v)}</span>` },
    { k: 'status', label: 'Status', fmt: v => statusPill(v) },
  ], po, { dense: true }) + h.note('Vendors acknowledge, propose dates and flag substitutions on a no-login confirmation link. Changes after sending raise the revision and re-send a diff (13 §4.8.3).');
  else if (tab === 'receive') {
    const p = po.find(x => /Acknowledged|Partly/.test(x.status)) || po[0];
    const lines = (c.D.inventory.length ? c.D.inventory : [{ name: 'Material', uom: 'each' }]).slice(0, 4).map((it, i) => ({ item: it.name, uom: it.uom, ordered: [20, 6, 240, 12][i], received: [20, 0, 120, 12][i], now: RL.ui['po.recv'] === 'all' ? [0, 6, 120, 0][i] : 0 }));
    body = sec(`Receive against <span class="mono">${esc(p.id)}</span>`, h.table([{ k: 'item', label: 'Line' }, { k: 'uom', label: 'UOM' }, { k: 'ordered', label: 'Ordered', n: true }, { k: 'received', label: 'Received', n: true }, { k: 'now', label: 'Receiving now', n: true, fmt: v => v ? `<b>${v}</b>` : '0' }], lines, { dense: true })
      + `<div class="flex">${writes(c, 'purchase_order') || c.role === 'crew_lead' ? h.btn('Receive all open lines', { kind: 'primary', ui: 'po.recv', val: 'all' }) + tbtn('Photo of packing slip', 'Packing slip attached to the receipt.', { icon: 'camera' }) : ''}<span class="tiny t3">Receipts land at ${esc(c.t.branches[0])} yard or the job site; Light mode expenses them to the job.</span></div>`, { sub: esc(p.vendor) + ' · ' + esc(p.job) });
  } else body = bnr(`${icon('info')} 2-way match at MVP: bill vs PO price for services and non-stock purchases. 3-way match with receipts and tolerances arrives at V1 (13 §4.11.2).`, 'info') + h.table([
    { k: 'id', label: 'Bill', m: true }, { k: 'vendor', label: 'Vendor' }, { k: 'po', label: 'PO', m: true },
    { k: 'po_amt', label: 'PO', n: true, fmt: v => h.mask(c, 'cost', money(v, { cents: true })) }, { k: 'bill', label: 'Bill', n: true, fmt: v => h.mask(c, 'cost', money(v, { cents: true })) },
    { k: 'result', label: 'Result', fmt: (v, r) => v === 'Matched' ? h.pill('Matched', 'ok') : h.pill(esc(v) + (r.varc ? ' ' + (r.varc > 0 ? '+' : '') + money(r.varc, { cents: true }) : ''), 'warn') },
    { k: 'mode', label: 'Rule', fmt: v => `<span class="tiny t3">${esc(v)}</span>` },
    { k: 'id', label: '', fmt: (v, r) => r.result !== 'Matched' && (writes(c, 'purchase_order') || c.role === 'bookkeeper') ? tbtn('Resolve', `Bill ${v}: variance accepted to job cost with a note.`, { sm: true }) : '' },
  ], bs, { dense: true }) + `<div class="flex"><span class="tiny t2">Default tolerance: lesser of 2% or $25 per line; freight up to $75 per bill. Cumulative variance guard at 5% of the PO.</span>${h.tag('V1')}<span class="tiny t3">3-way match, AI bill intake (2 credits per page)</span></div>`;
  return h.page({ title: c.tr('Purchase orders', 'Órdenes de compra'), sub: `${po.length} POs · ${bl.length} buy lists · your approval limit: <b>${lim}</b>`, actions: (writes(c, 'purchase_order') ? h.btn('New PO', { kind: 'primary', icon: 'plus', modal: 'more-new-po' }) : '') + roPill(c, 'purchase_order') })
    + h.tabs('po.tab', [['buy', 'Buy lists', bl.length], ['pos', 'Purchase orders', po.length], ['receive', 'Receiving'], ['match', 'Bill match', bs.filter(b => b.result !== 'Matched').length]], 'pos') + body;
});

RL.screen('web.vendors', (c) => {
  const D = c.D, sub = D.vendors.find(v => v.category === 'Subcontractor');
  const all = D.vendors.filter(v => v.category !== 'Subcontractor').concat(VENDORS_X.map(([name, category, terms], i) => ({ id: 'VN-' + (70 + i), name, category, terms })));
  const gate = RL.ui['vn.gate'] || 'block';
  const subs = [
    { name: sub ? sub.name : 'Hardscape sub (illustrative)', trade: 'Hardscape install', gl: 'OK to Mar 2028', auto: 'OK to Mar 2028', wc: 'OK', ai: 'Named', w9: 'On file', lic: '-', status: 'Compliant' },
    { name: 'Tree crew partner (illustrative)', trade: 'Tree removal, ISA arborist', gl: c.winter ? 'Expires Jan 24' : 'Expires May 23', auto: 'OK', wc: 'OK', ai: 'Named', w9: 'On file', lic: 'ISA cert OK', status: 'Expiring in 12 days' },
    { name: 'Spray sub (illustrative)', trade: 'Mosquito and tick', gl: 'OK', auto: 'OK', wc: 'Exemption form', ai: 'Missing', w9: 'On file', lic: 'Applicator license expired', status: gate === 'block' ? 'Compliance hold' : 'Warning: expired' },
  ];
  return h.page({ title: 'Vendors and subcontractors', sub: `${all.length} vendors · ${subs.length} subcontractors · compliance gate: <b>${gate}</b>`, actions: (writes(c, 'vendor') ? h.btn('Add vendor', { icon: 'plus', act: 'more-toast' }) + tbtn('Invite subcontractor', 'Invite sent: the sub completes W-9, COI and licenses in the sub portal.', { kind: 'primary', icon: 'send' }) : '') + roPill(c, 'vendor') })
    + sec('Vendors', h.table([
      { k: 'name', label: 'Vendor', fmt: (v, r) => `<b>${esc(v)}</b><div class="tiny t3 mono">${esc(r.id)}</div>` },
      { k: 'category', label: 'Category' }, { k: 'terms', label: 'Terms' },
      { k: 'pl', label: 'Price list', fmt: (v, r) => /Fuel|Equipment/.test(r.category) ? '<span class="t3">-</span>' : `<span class="tiny">${esc(pick(r.name, ['CSV, updated Apr 2', 'PDF parsed, Mar 18', 'Manual, Feb 1']))}</span>` },
      { k: 'ytd', label: 'Spend YTD', n: true, fmt: (v, r) => h.mask(c, 'cost', money(Math.round(c.D.kpi.revenueYTD * (.02 + (hs(r.name) % 9) / 100) / 10) * 10)) },
      { k: 'bank', label: 'Remit to', fmt: () => h.mask(c, 'vendor_banking', '<span class="mono tiny">ACH ••6612</span>') },
    ], all.map(v => Object.assign({ pl: '', ytd: 0, bank: '' }, v)), { dense: true }), { flush: true, sub: 'Price lists at MVP are CSV or manual; supplier integrations L2-L4 later (13 §4.9)' })
    + sec('Subcontractor compliance', `<div class="flex between"><span class="small t2">Gate when a required document is expired:</span>${writes(c, 'vendor') ? seg('vn.gate', [['warn', 'Warn'], ['block', 'Block']], gate) : h.pill(gate, 'info')}</div>` + h.table([
      { k: 'name', label: 'Subcontractor', fmt: (v, r) => `<b>${esc(v)}</b><div class="tiny t3">${esc(r.trade)}</div>` },
      { k: 'gl', label: 'General liability', fmt: v => /Expires/.test(v) ? h.pill(esc(v), 'warn') : esc(v) }, { k: 'auto', label: 'Auto' }, { k: 'wc', label: 'Workers comp' },
      { k: 'ai', label: 'Addl. insured', fmt: v => v === 'Missing' ? h.pill('Missing', 'danger') : esc(v) }, { k: 'w9', label: 'W-9' },
      { k: 'lic', label: 'Licenses', fmt: v => /expired/.test(v) ? h.pill(esc(v), 'danger') : esc(v) },
      { k: 'status', label: 'Status', fmt: v => statusPill(v) },
    ], subs, { dense: true }) + (gate === 'block' ? bnr(`${icon('lock')} Block: a sub with any expired required document cannot get new work orders, cannot start work in the portal and is left out of AP payment runs until resolved. The owner can override per assignment with a reason (13 §4.13.1).`, 'warn') + (isOwner(c) ? `<div>${tbtn('Override for one assignment', 'Override recorded with your reason in the audit log.', { sm: true })}</div>` : '') : h.note('Warn: assignments are allowed with a warning banner.'))
      + `<div class="flex"><span class="tiny t3">Reminders to the sub at 30, 14 and 3 days before expiry; office at 14 days and on expiry.</span>${h.tag('V1')}<span class="tiny t3">AI COI reading from the ACORD 25 PDF</span></div>`, { sub: 'Requirements are set per trade and per client contract' });
});

RL.screen('web.equipment', (c, a) => {
  const list = assets(c), f = c.feat('equipment');
  const limit = c.planCode === 'starter' ? 10 : c.planCode === 'grow' ? 25 : null;
  const over = limit != null && list.length > limit;
  const tab = h.tab('eq.tab', 'registry');
  const pmOk = c.planCode !== 'starter';
  let body;
  if (tab === 'registry') body = h.table([
    { k: 'id', label: 'Asset', m: true },
    { k: 'name', label: 'Name', fmt: (v, r) => `<b>${esc(v)}</b><div class="tiny t3">${esc(r.cls)} · ${r.year}</div>` },
    { k: 'meter', label: 'Meter', n: true },
    { k: 'crew', label: 'Assigned' },
    { k: 'next', label: 'Next', fmt: v => v === 'OK' ? '<span class="t3">-</span>' : statusPill(v) },
    { k: 'status', label: 'Status', fmt: (v, r) => over && list.indexOf(r) >= limit ? (v === 'Down' ? statusPill(v) + ' ' : '') + h.pill('Read only (over limit)', 'warn') : statusPill(v) },
    { k: 'cost', label: 'Cost', n: true, fmt: v => h.mask(c, 'cost', money(v)) },
  ], list, { dense: true });
  else if (tab === 'dvir') body = h.table([
    { k: 'when', label: 'When' }, { k: 'asset', label: 'Vehicle / trailer' }, { k: 'driver', label: 'Driver' }, { k: 'type', label: 'Type' },
    { k: 'defects', label: 'Defects', fmt: v => v ? h.pill(esc(v), /brake/i.test(v) ? 'danger' : 'warn') : h.pill('None', 'ok') },
    { k: 'cert', label: 'Repair certified' },
  ], list.filter(x => x.cls === 'vehicle' || x.cls === 'trailer').slice(0, 6).map((x, i) => ({ when: past(c)[i % 3] + (i % 2 ? ' 16:40 post-trip' : ' 6:52 pre-trip'), asset: x.name, driver: x.crew !== '-' ? ((c.D.crews.find(cr => cr.name === x.crew) || {}).lead || '-') : '-', type: i % 2 ? 'Post-trip' : 'Pre-trip', defects: x.status === 'Down' ? 'Brake light out (safety-critical)' : i === 3 ? 'Wiper blade worn' : '', cert: x.status === 'Down' ? h.pill('Asset down until certified', 'danger') : i === 3 ? 'Not needed (minor)' : '-' })), { dense: true })
    + h.note('Electronic DVIR per 49 CFR 396.11 (verify). Safety-critical defects set the asset to Down and block assignment until a mechanic certifies the repair (13 §4.14.10).');
  else if (tab === 'pm') body = pmOk ? h.table([{ k: 'asset', label: 'Asset' }, { k: 'rule', label: 'Schedule' }, { k: 'next', label: 'Next due' }, { k: 'status', label: '', fmt: v => statusPill(v) }],
    list.slice(0, 5).map((x, i) => ({ asset: x.name, rule: x.cls === 'mower' ? 'Oil and filter every 100 h' : x.cls === 'vehicle' ? 'Service every 5,000 mi or 6 months' : 'Annual inspection', next: ['in 12 h', 'in 340 mi', 'Jun 3', 'in 48 h', 'Mar 1'][i], status: i === 0 ? 'Due soon' : 'Scheduled' })), { dense: true }) + h.note('PM schedules and maintenance work orders ship at V1 (13 §4.14.3).')
    : inlineLock(c, 'equipment') + h.note('Starter includes the registry, manual meters and DVIR. PM schedules need Grow or Pro.');
  else {
    const price = num0('eq.price', 14800), salv = num0('eq.salv', 3000), life = num0('eq.life', 4000), fuel = num0('eq.fuel', 4.1), rep = num0('eq.rep', 2.6);
    const per = (price - salv) / Math.max(1, life) + fuel + rep;
    body = h.cols('2', [sec('Cost per hour calculator', `<div class="cols cols-2">${h.field('Purchase price', h.input(price, { ui: 'eq.price', type: 'number' }))}${h.field('Salvage value', h.input(salv, { ui: 'eq.salv', type: 'number' }))}${h.field('Useful life (hours)', h.input(life, { ui: 'eq.life', type: 'number' }))}${h.field('Fuel per hour', h.input(fuel, { ui: 'eq.fuel', type: 'number' }))}${h.field('Repairs per hour', h.input(rep, { ui: 'eq.rep', type: 'number' }))}</div>`, { sub: 'MVP calculator; actuals from work orders at V1 (13 §4.14.7)' }),
      sec('Result', `<div class="kpis">${`<div class="kp"><span class="l">Equipment cost per hour</span><span class="v">${h.mask(c, 'cost', money(per, { cents: true }))}</span><span class="d">Depreciation ${h.mask(c, 'cost', money((price - salv) / Math.max(1, life), { cents: true }))}/h</span></div>`}</div>` + h.note('Feeds the Price Book equipment rate used in estimates. Changing it does not reprice sent proposals.'))]);
  }
  return h.page({ title: c.tr('Equipment and fleet', 'Equipo y flota'), sub: `${list.length} assets · ${list.filter(x => x.status === 'Down').length} down · meters entered in the crew app`, actions: (writes(c, 'equipment') && !fieldRole(c) ? (over ? tbtn('Add asset', 'Asset limit reached on ' + c.plan.name + '.', { disabled: true }) : h.btn('Add asset', { kind: 'primary', icon: 'plus', act: 'more-toast' })) + tbtn('Print QR tags', 'QR asset tags queued for printing.', { icon: 'download' }) : '') + roPill(c, 'equipment') })
    + (limit != null ? `<div class="cd"><div class="cd-b">${h.meter('Assets on ' + esc(c.plan.name), list.length, limit)}${over ? `<div class="small">${h.pill(list.length - limit + ' assets over the limit are read only', 'warn')} ${isOwner(c) ? h.btn('Compare plans', { sm: true, go: 'web.settings.subscription' }) : ask(c)}</div>` : `<div class="tiny t3">${esc(f.note || '')}. ${c.planCode === 'starter' ? 'Grow raises the limit to 25 and adds PM schedules.' : 'Pro has no asset limit.'}</div>`}</div></div>` : '')
    + h.tabs('eq.tab', [['registry', 'Registry', list.length], ['dvir', 'DVIR and defects'], ['pm', 'PM schedules ' + h.tag('V1')], ['cost', 'Cost per hour']], 'registry') + body;
});

RL.screen('web.chemicals', (c, a) => {
  const st = stateOf(c), cr = certRows(c);
  const blocked = cr.filter(p => p.lic === 'expired');
  const tab = h.tab('ch.tab', 'products');
  const logs = c.D.visits.filter(v => /Round|Grub|weed|fertil/i.test(v.service)).slice(0, 6);
  const basic = c.feat('chemical_logs').s === 'L';
  let body;
  if (tab === 'products') body = h.table([
    { k: 'name', label: 'Product', fmt: (v, r) => `<b>${esc(v)}</b>${r.rup ? ' ' + h.pill('Restricted use', 'danger') : ''}<div class="tiny t3">${esc(r.ai)}</div>` },
    { k: 'epa', label: 'EPA reg. no.', m: true, fmt: v => esc(v) + '<div class="tiny t3">illustrative</div>' },
    { k: 'signal', label: 'Signal', fmt: v => h.pill(esc(v), v === 'Caution' ? '' : 'warn') },
    { k: 'rei', label: 'REI', n: true, fmt: v => v ? v + ' h' : 'Until dry' },
    { k: 'rate', label: 'Label max rate', fmt: (v, r) => `<span class="tiny">${esc(v)}<br><span class="t3">${esc(r.max)}</span></span>` },
    { k: 'qty', label: 'On hand', n: true, fmt: (v, r) => num(v) + ' <span class="tiny t3">' + esc(r.uom) + '</span>' },
    { k: 'sds', label: 'SDS', fmt: v => `<a href="#" data-act="more-toast" data-msg="SDS opened (offline copy on every crew device).">${icon('book', 's')} rev. ${esc(v)}</a>${/2024|Feb 2025/.test(v) ? '<div>' + h.pill('Review', 'warn') + '</div>' : ''}` },
  ], CHEM, { dense: true });
  else if (tab === 'logs') body = h.table([
    { k: 'when', label: 'Applied' }, { k: 'client', label: 'Property', fmt: (v, r) => `${esc(v)}<div class="tiny t3">${esc(r.address)}</div>` },
    { k: 'product', label: 'Product and rate' }, { k: 'applicator', label: 'Applicator' }, { k: 'wx', label: 'Wind / temp' }, { k: 'ok', label: 'Record', fmt: v => statusPill(v) },
  ], (logs.length ? logs : c.D.visits.slice(0, 4)).map((v, i) => ({ when: (c.winter ? past(c)[6] : 'May ' + (10 - i % 3)) + ' ' + v.start, client: v.client, address: v.address, product: CHEM[i % 3].name.split(',')[0] + ' · ' + CHEM[i % 3].rate, applicator: (c.D.crews.find(x => x.name === v.crew) || {}).lead || v.crew, wx: `${4 + i % 6} mph · ${58 + i * 3}°F`, ok: i === 2 ? 'Missing REI notice' : 'Complete' })), { dense: true, empty: 'No applications logged.' })
    + h.note(`State recordkeeping for ${st}: product, EPA reg. no., rate, area, applicator license, wind and temperature, kept for the state retention period (14). ${basic ? 'Starter covers lawn and PHC basics.' : ''}`);
  else body = sec('Applicator licenses', h.table([
    { k: 'name', label: 'Applicator' }, { k: 'cat', label: `${st} category` }, { k: 'exp', label: 'Expires' },
    { k: 'lic', label: 'Status', fmt: v => v === 'expired' ? h.pill('Expired: logging blocked', 'danger') : v === 'expiring' ? h.pill('Expiring soon', 'warn') : v === 'supervised' ? h.pill('Under supervision', 'info') : h.pill('Valid', 'ok') },
  ], cr.filter(p => p.licCat), { dense: true }) + h.link('Open certifications', 'web.certs'), { flush: true });
  return h.page({ title: c.tr('Chemical inventory and SDS', 'Químicos y hojas SDS'), sub: `${CHEM.length} products · SDS library available offline in the crew app · state rules: ${st}`, actions: (writes(c, 'chemical_application') && !fieldRole(c) ? h.btn('Add product', { icon: 'plus', act: 'more-toast' }) : '') + roPill(c, 'chemical_application') + (basic ? h.pill('Starter: lawn/PHC basic', 'info') : '') })
    + (blocked.length ? bnr(`${icon('lock')} ${blocked.map(p => esc(p.name)).join(', ')}: applicator license expired. The crew app blocks chemical logging for ${blocked.length > 1 ? 'them' : 'this person'} until a renewal is on file, or allows it only as "under supervision" where ${st} permits (02 §10.1 note 3).`, 'danger') : '')
    + h.tabs('ch.tab', [['products', 'Products and SDS', CHEM.length], ['logs', 'Application records'], ['lic', 'Applicators', cr.filter(p => p.licCat).length]], 'products') + body
    + `<div class="flex">${h.tag('V1')}<span class="tiny t3">A16 Chemical Compliance agent checks wind, temperature, licensing and REI notices on every record.</span></div>`;
});

/* Credentials per field person (15 §4.5). Shared by certifications, chemicals and rehire. */
function certRows(c) {
  const st = stateOf(c), ppl = c.D.people.filter(p => p.seat === 'field').slice(0, 10);
  const d = c.winter ? ['Jan 24', 'Feb 9', 'Mar 3'] : ['May 23', 'Jun 9', 'Jul 3'];
  let li = 0;
  return ppl.map((p, i) => {
    const lead = p.role === 'crew_lead';
    const lic = lead ? ['valid', 'expired', 'expiring', 'valid'][(li++) % 4] : (i % 5 === 2 ? 'supervised' : null);
    return {
      name: p.name, role: p.role, crew: p.crew || crewOf(c.D, p.name), lead,
      licCat: lic ? (st === 'IL' ? 'Turf operator' : st === 'WI' ? 'Turf and landscape (3.0)' : 'Turfgrass (3A)') : '', lic: lic || '', exp: lic === 'expired' ? (c.winter ? 'Dec 31' : 'Apr 30') : lic === 'expiring' ? d[0] : lic ? pick(p.name, ['Dec 2027', 'Mar 2028', 'Oct 2027']) : '-',
      dl: i % 7 === 4 ? '-' : 'OK ' + (2027 + i % 3), cdl: lead && i % 2 === 0 ? (i === 2 ? 'Med card ' + d[1] : 'OK') : '-', fa: i % 3 === 0 ? 'OK 2027' : i % 3 === 1 ? 'Expiring ' + d[2] : '-',
      zt: i % 4 === 3 ? 'TRN' : 'AUTH', saw: lead ? 'AUTH' : i % 3 === 0 ? 'TRN' : '-',
    };
  });
}

// =====================================================================
// TEAM (15; 02 §7.3, §7.7)
// =====================================================================
const LOGIN = { owner: 'Passkey', office_manager: 'Passkey', estimator: 'Passkey', designer: 'Password + MFA', ops_manager: 'Passkey', bookkeeper: 'Password + TOTP', crew_lead: 'Phone + PIN', technician: 'Kiosk PIN' };
const rateOf = p => p.role === 'crew_lead' ? 23 + hs(p.name) % 5 + (hs(p.name) % 4) * .25 : p.role === 'technician' ? 17 + hs(p.name) % 4 + (hs(p.name) % 4) * .25 : 26 + hs(p.name) % 12;
/* People with season-aware states: in January most field staff are hibernated (02 §7.3). */
function roster(c) {
  const t = c.t, D = c.D;
  const nonField = D.people.filter(p => p.seat !== 'field').length;
  const winterField = Math.max(1, t.people_winter - nonField);
  let fi = 0;
  const rows = D.people.map((p, i) => {
    let status = p.status === 'hibernated' ? 'Hibernated' : 'Active';
    if (p.seat === 'field') { fi++; if (c.winter) status = fi <= winterField ? 'Active' : 'Hibernated'; }
    const seen = status === 'Hibernated' ? pick(p.name, ['Nov 21', 'Nov 26', 'Dec 4', 'Nov 14']) : p.seat === 'field' ? pick(p.name, ['6:45 am', '2 min', '7:02 am', '18 min']) : pick(p.name, ['1 h', '5 min', 'Yesterday', '3 h']);
    return Object.assign({}, p, { status, seen, login: status === 'Hibernated' ? '-' : LOGIN[p.role] || 'Passkey', mfa: p.seat === 'field' ? 'n/a' : 'Yes', rate: rateOf(p), crew: p.crew || crewOf(D, p.name), branch: t.branches[i % t.branches.length] });
  });
  if (!c.winter && t.people_peak > 3) rows.push({ id: 'U-INV1', name: 'Rafael Medina', role: 'technician', crew: '-', seat: 'field', status: 'Invited', seen: '-', login: 'Invite sent', mfa: 'n/a', rate: 18, lang: 'ES', branch: t.branches[0] });
  const sub = c.t.cast && c.t.cast.subcontractor;
  if (sub) rows.push({ id: 'U-SUB', name: sub, role: 'subcontractor', crew: '-', seat: 'free', status: 'Active', seen: 'Yesterday', login: 'Magic link', mfa: '-', rate: null, lang: 'EN', branch: t.branches[0] });
  return rows;
}
function rehireRows(c) {
  const hib = roster(c).filter(p => p.status === 'Hibernated');
  const replies = ['Returning', 'Returning', 'Returning', 'Not returning', 'No reply', 'Returning'];
  let leads = 0;
  return hib.map((p, i) => {
    const check = p.role === 'crew_lead' && leads++ === 0 ? 'Pest. license expired' : i === 4 ? 'Visa end date before start' : i === 9 ? 'No mobile number' : 'OK';
    return { id: p.id, name: p.name, crew: p.crew, role: p.role, rate: p.rate, sug: p.rate + .75, reply: replies[i % replies.length], check, block: check !== 'OK' };
  });
}

RL.screen('web.people', (c) => {
  const D = c.D, rows = roster(c), S = seats(c);
  const view = h.tab('pp.view', 'list');
  const counts = ['Active', 'Invited', 'Hibernated', 'Suspended'].map(s => [s, rows.filter(r => r.status === s).length]);
  const filt = RL.ui['pp.st'] || 'all';
  const canEdit = writes(c, 'employee');
  const rh = rehireRows(c);
  if (view === 'rehire') {
    const sel = (RL.ui['rh.sel'] != null ? String(RL.ui['rh.sel']) : rh.filter(r => !r.block && r.reply === 'Returning').map(r => r.id).join(',')).split(',').filter(Boolean);
    const seeRate = seesFor(c, 'pay_rate', '');
    const cols = [
      { k: 'id', label: '', fmt: (v, r) => r.block ? `<span title="Resolve the blocking check first">${icon('lock', 's')}</span>` : `<button type="button" ${TGL_STYLE} class="tgl${sel.includes(v) ? ' on' : ''}" data-act="rh-toggle" data-x="${esc(v)}" aria-pressed="${sel.includes(v)}" aria-label="Select ${esc(r.name)}"><i></i></button>` },
      { k: 'name', label: 'Name', fmt: (v, r) => `<b>${esc(v)}</b><div class="tiny t3">${esc(r.role)}</div>` }, { k: 'crew', label: 'Last crew' },
    ].concat(seeRate ? [{ k: 'rate', label: 'Last rate', n: true, fmt: v => money(v, { cents: true }) }, { k: 'sug', label: 'Suggested', n: true, fmt: v => `<b>${money(v, { cents: true })}</b>` }] : [])
      .concat([{ k: 'reply', label: 'Replied', fmt: v => statusPill(v) }, { k: 'check', label: 'Checks', fmt: v => v === 'OK' ? h.pill('OK', 'ok') : h.pill(esc(v), 'danger') }]);
    return h.page({ title: 'Rehire returning crew', crumbs: [['Team', 'web.people'], ['Rehire']], sub: `Season ${c.winter ? 2027 : 2027} · ${rh.length} hibernated field workers · ${rh.filter(r => r.reply === 'Returning').length} said returning · ${rh.filter(r => r.reply === 'No reply').length} no reply`, actions: h.btn('Back to team', { ui: 'pp.view', val: 'list' }) })
      + (rh.length ? sec('Select who comes back', h.table(cols, rh, { dense: true })
        + `<div class="cols cols-4">${h.field('Start date', h.input(c.winter ? 'Mar 15, 2027' : 'May 17, 2027'))}${h.field('Crew', h.select(['Keep last crew', 'Assign later'], 'Keep last crew'))}${h.field('Raise', h.select(seeRate ? ['Suggested (+$0.75/h)', 'Flat +$0.50/h', 'None'] : ['Company raise policy'], seeRate ? 'Suggested (+$0.75/h)' : 'Company raise policy'))}${h.field('Language', h.select(['Keep each person\'s', 'Spanish', 'English'], 'Keep each person\'s'))}</div>`
        + (seeRate ? h.note(`Pay rates are visible to you because pay_rate is '${esc(c.fc('pay_rate'))}' for ${esc(c.role)} (02 §10.2).`) : h.note('Rate columns are hidden: your role cannot read other people\'s pay rates (02 §7.7).'))
        + `<div class="flex">${tbtn('Preview welcome-back SMS (ES / EN)', '"Hola Luis, la temporada empieza el 15 de marzo. Responde SÍ para volver." Preview only.', { icon: 'chat' })}<span class="grow"></span>${canEdit ? tbtn(`Rehire ${sel.length} selected`, `${sel.length} people reactivated from the start date. Field seats count only once they are active (22 §4.3).`, { kind: 'primary', disabled: !sel.length }) + tbtn(`Send reminder to ${rh.filter(r => r.reply === 'No reply').length}`, 'Reminder SMS queued (quiet hours respected).') : h.pill('Read only', '', 'eye')}</div>`
        + h.note('Rows with a blocking check (expired pesticide license, visa end date before the start date, missing phone) cannot be selected until resolved.'), { sub: 'Hibernated people keep their history and cost $0' }) : h.empty('Nobody is hibernated right now. In January this list holds the people who left for the winter.'));
  }
  const shown = rows.filter(r => filt === 'all' || r.status === filt);
  const peak = c.t.people_peak;
  return h.page({ title: c.tr('Team', 'Equipo'), sub: `${rows.length} people${peak > rows.length ? ` shown of ${peak} at peak` : ''} · ${esc(c.t.branches.length > 1 ? c.t.branches.length + ' branches' : c.t.branches[0])}${c.winter ? ' · winter: crews hibernated' : ''}`, actions: (canEdit ? h.btn('Invite', { kind: 'primary', icon: 'plus', act: 'more-toast' }) + tbtn('Bulk import', 'CSV template downloaded.', { icon: 'upload' }) : '') + (canEdit || c.role === 'ops_manager' ? h.btn(`Rehire returning crew (${rh.filter(r => r.reply === 'Returning').length})`, { ui: 'pp.view', val: 'rehire', icon: 'refresh' }) : '') + roPill(c, 'employee') })
    + `<div class="flex">${[['all', 'All', rows.length]].concat(counts.map(([s, n]) => [s, s, n])).map(([v, l, n]) => h.btn(`${l} <span style="opacity:.7">${n}</span>`, { sm: true, ui: 'pp.st', val: v, kind: filt === v ? 'primary' : 'ghost', pressed: String(filt === v) })).join('')}<span class="grow"></span><span class="tiny t3">Branch: ${esc(c.t.branches[0])}${c.t.branches.length > 1 ? ' +' + (c.t.branches.length - 1) : ''}</span></div>`
    + sec('', h.table([
      { k: 'name', label: 'Name', fmt: (v, r) => `<span class="flex nw">${h.avatar(v)}<span><b>${esc(v)}</b><span class="tiny t3"> ${esc(r.lang || '')}</span><div class="tiny t3">${maskFor(c, 'employee_pii', v, esc(r.phone || '(614) 555-0100'))}</div></span></span>` },
      { k: 'role', label: 'Role', fmt: v => `<span class="mono tiny">${esc(v)}</span>` }, { k: 'crew', label: 'Crew' },
      { k: 'login', label: 'Login' }, { k: 'mfa', label: 'MFA' }, { k: 'seen', label: 'Last seen' },
      { k: 'status', label: 'Status', fmt: v => h.pill(esc(v), v === 'Active' ? 'ok' : v === 'Hibernated' ? 'info' : 'warn') },
      { k: 'rate', label: 'Pay rate', n: true, fmt: (v, r) => v == null ? '<span class="t3">-</span>' : (r.seat === 'field' ? maskFor(c, 'pay_rate', r.name, money(v, { cents: true }) + '/h') : maskFor(c, 'pay_rate', r.name, 'Salaried')) },
    ], shown, { dense: true }), { flush: true })
    + `<div class="cd"><div class="cd-b"><div class="flex between"><span class="small"><b>Seats:</b> ${S.office} office + ${S.field} active field + ${S.bk + (c.t.cast && c.t.cast.subcontractor ? 1 : 0)} free (bookkeeper, subs). Hibernated ${rows.filter(r => r.status === 'Hibernated').length} = $0.</span>${isOwner(c) ? h.btn('Plan and seats', { sm: true, go: 'web.settings.subscription' }) : ''}</div>${S.inc.field != null ? h.meter('Active field seats this month', S.field, S.inc.field) : ''}<div class="tiny t3">Field seats are billed on active count: a 25-person summer crew that shrinks to 4 in winter pays for 4 (22 §4.3). The crew app never blocks work for seat reasons.</div></div></div>`;
});
RL.act('rh-toggle', (el, ev, c) => {
  const rh = rehireRows(c);
  const cur = (RL.ui['rh.sel'] != null ? String(RL.ui['rh.sel']) : rh.filter(r => !r.block && r.reply === 'Returning').map(r => r.id).join(',')).split(',').filter(Boolean);
  const id = el.dataset.x; const i = cur.indexOf(id); if (i >= 0) cur.splice(i, 1); else cur.push(id);
  RL.ui['rh.sel'] = cur.join(',');
});

RL.screen('web.crews', (c) => {
  const D = c.D;
  if (!D.crews.length) return h.page({ title: 'Crews', sub: 'No crews' }) + h.empty(`${esc(c.t.name)} has no field crews. Installs are coordinated with outside contractors.`);
  const skills = { maintenance: ['Mowing', 'Edging', 'Pruning'], install: ['Pavers', 'Planting', 'Skid steer'], lawn: ['Applicator', 'Aeration'], irrigation: ['Backflow', 'Controllers'], enhancement: ['Mulch', 'Seasonal color'], lighting: ['Low voltage', 'Transformers'] };
  const winterOn = i => i < Math.max(1, Math.round(D.crews.length * c.t.people_winter / c.t.people_peak));
  const card = (cr, i) => {
    const stops = D.visits.filter(v => v.crewId === cr.id);
    const hrs = stops.reduce((s, v) => s + v.dur, 0) / 60;
    const on = !c.winter || winterOn(i);
    return `<section class="cd" style="border-top:4px solid ${cr.color}"><div class="cd-h"><div><h3>${esc(cr.name)}</h3><div class="sub">${esc(cr.type)} · ${esc(cr.truck)} · ${esc(cr.branch)}</div></div>${on ? h.pill(c.winter ? 'Snow route' : stops.length + ' stops today', c.winter ? 'info' : 'ok') : h.pill('Hibernated for winter', '')}</div><div class="cd-b">
      <div class="flex nw">${h.avatar(cr.lead)}<div><b>${esc(cr.lead)}</b><div class="tiny t3">Crew lead</div></div></div>
      <div class="flex gap4">${cr.members.map(m => `<span class="pill">${esc(m)}</span>`).join('') || '<span class="tiny t3">Solo</span>'}</div>
      <div class="flex gap4">${(skills[cr.type] || []).map(s => h.pill(esc(s), 'info')).join('')}</div>
      ${on && !c.winter ? `<div class="tiny t2">${hrs.toFixed(1)} h on site today · budget ${h.mask(c, 'budget_hours', (stops.reduce((s, v) => s + v.budgetHrs, 0)).toFixed(1) + ' crew-h')}</div>` : ''}
      ${writes(c, 'crew') ? `<div class="flex">${h.btn('Edit', { sm: true, modal: 'more-crew', x: cr.id })}${h.btn('Dispatch board', { sm: true, go: 'web.board' })}</div>` : ''}
    </div></section>`;
  };
  return h.page({ title: c.tr('Crews', 'Cuadrillas'), sub: `${D.crews.length} crews · ${D.crews.reduce((s, cr) => s + cr.members.length + 1, 0)} people assigned${c.winter ? ' · winter: ' + D.crews.filter((x, i) => winterOn(i)).length + ' active' : ''}`, actions: (writes(c, 'crew') ? h.btn('New crew', { kind: 'primary', icon: 'plus', modal: 'more-crew' }) : '') + roPill(c, 'crew') })
    + (c.role === 'crew_lead' ? h.note('Crew leads see their own crew roster and emergency contacts (employee = R/c).') : '')
    + h.cols('3', D.crews.map(card));
});
RL.modal('more-crew', (c, el) => {
  const cr = c.D.crews.find(x => x.id === (el && el.dataset.x)) || { name: 'New crew', lead: '', members: [], truck: '', type: 'maintenance' };
  const leads = c.D.people.filter(p => p.seat === 'field').map(p => p.name);
  return { title: cr.id ? 'Edit ' + esc(cr.name) : 'New crew', body: h.field('Name', h.input(cr.name)) + h.field('Crew lead', h.select(leads, cr.lead)) + h.field('Truck', h.input(cr.truck, { ph: 'Truck 21' })) + h.field('Type', h.select(['maintenance', 'install', 'lawn', 'irrigation', 'enhancement', 'lighting'], cr.type)) + h.note('Moving a person between crews moves their future visits. Crew leads need a valid applicator license for chemical visits.'), foot: h.btn('Cancel', { act: 'noop' }) + tbtn('Save crew', 'Crew saved.', { kind: 'primary' }) };
});

RL.screen('web.timesheets', (c) => {
  const D = c.D, own = c.role === 'crew_lead' ? (D.crews[0] || {}).name : null;
  const ts = D.timesheets.map((r, i) => Object.assign({}, r, { crew: r.crew !== '-' ? r.crew : crewOf(D, r.person), hrs: c.winter ? Math.round(r.hrs * .45 * 4) / 4 : r.hrs, ot: c.winter ? 0 : r.ot, idx: i })).filter(r => !own || r.crew === own);
  const approved = RL.ui['ts.all'] === '1';
  const done = String(RL.ui['ts.done'] || '').split(',');
  const exc = ts.filter(r => r.exceptions && !done.includes(String(r.idx)));
  const xp = ts.find(r => !r.exceptions && r.idx >= 2);
  const extra = !own && xp && !done.includes('mco') ? [{ person: xp.person, crew: xp.crew, kind: 'Missing clock-out', detail: `Tue: clock-in 6:52, last job segment at ${esc((D.visits[5] || D.visits[0] || { client: 'a client' }).client)} 14:51`, ai: 'Suggested clock-out 15:42: left the job geofence at 15:31, plus 11 min drive to the yard', idx: 'mco' }] : [];
  const clean = ts.filter(r => !r.exceptions && !(extra.length && r.idx === xp.idx));
  const rate = r => rateOf({ name: r.person, role: (D.people.find(p => p.name === r.person) || {}).role || 'technician' });
  const gross = ts.reduce((s2, r) => s2 + r.hrs * rate(r) + r.ot * rate(r) * 1.5, 0);
  const canApprove = writes(c, 'timesheet.approve');
  const week = c.winter ? 'Sun Jan 3 - Sat Jan 9, 2027' : 'Sun May 2 - Sat May 8, 2027';
  const seeRate = seesFor(c, 'pay_rate', '');
  const rows = exc.map(r => ({ icon: 'warn', tone: 'warn', title: `${esc(r.person)} <span class="tiny t3">${esc(r.crew)}</span> ${h.pill(/lunch/i.test(r.exceptions) ? 'Missed meal punch' : 'Edited by crew lead', 'warn')}`, sub: esc(r.exceptions) + ` · ${r.hrs} h reg, ${r.ot} h OT`, right: canApprove ? h.btn('Approve', { sm: true, kind: 'primary', act: 'ts-ok', x: String(r.idx) }) + tbtn('Note', 'Note added to the timesheet.', { sm: true }) : '' }));
  return h.page({ title: c.tr('Timesheets', 'Hojas de tiempo'), sub: `Week ${week} · weekly field pay calendar · cutoff Mon 10:00${own ? ' · first-level approval for ' + esc(own) : ''}`, actions: canApprove ? h.btn(approved ? 'Clean timesheets approved' : `Approve all clean (${clean.length})`, { kind: approved ? '' : 'primary', ui: 'ts.all', val: '1', icon: 'check', disabled: approved }) : roPill(c, 'timesheet.approve') })
    + h.kpis([
      { label: 'Regular hours', value: num(ts.reduce((s2, r) => s2 + r.hrs, 0)), delta: ts.length + ' people' },
      { label: 'Overtime', value: num(ts.reduce((s2, r) => s2 + r.ot, 0)), delta: c.winter ? 'Snow events only' : 'Weekly over 40 h', tone: 'warn' },
      { label: 'Exceptions', value: exc.length + extra.length, delta: exc.length + extra.length ? 'Need a decision' : 'All clear', tone: exc.length + extra.length ? 'warn' : 'ok' },
      { label: 'Est. gross', value: seeRate ? money(Math.round(gross)) : '•••', delta: seeRate ? 'Before taxes and burden' : 'Hidden: pay_rate field class' },
    ])
    + h.cols('21', [
      `<div class="stack12">${extra.map(e => sec(`${esc(e.person)} <span class="tiny t3">${esc(e.crew)}</span> ${h.pill(e.kind, 'warn')}`, `<div class="small t2">${e.detail}</div>` + h.aiCard({ agent: 'Timesheet Anomaly', level: 'L2', credits: 0.5, title: e.ai, why: 'Evidence: geofence exit and visit completion. A suggestion; you decide.', actions: canApprove ? h.btn('Accept 15:42', { sm: true, kind: 'primary', act: 'ts-ok', x: 'mco' }) + tbtn('Edit punch', 'Opened the punch editor.', { sm: true }) + tbtn('Ask crew lead', 'Question sent to the crew lead in the crew app.', { sm: true }) : '' }), { tone: 'warn' })).join('')}
      ${sec('Exceptions', rows.length ? h.list(rows) : h.empty('No other exceptions this week.'), { flush: true, sub: 'Missed meal punches, edits by crew leads, job time without a visit' })}</div>`,
      sec('Clean timesheets', h.table([
        { k: 'person', label: 'Person', fmt: (v, r) => `${esc(v)}<div class="tiny t3">${esc(r.crew)}</div>` }, { k: 'hrs', label: 'Reg', n: true }, { k: 'ot', label: 'OT', n: true },
        { k: 'status', label: '', fmt: v => approved || v === 'Approved' ? h.pill('Approved', 'ok') : h.pill('Pending', 'warn') },
      ], clean, { dense: true, empty: 'None' }), { flush: true, sub: 'Grouped by crew in the full view' }),
    ])
    + h.note('Every accepted AI suggestion stores its evidence and the approver. Approved weeks flow to payroll export (15 §4.8, §6.2).');
});
RL.act('ts-ok', (el) => { const cur = String(RL.ui['ts.done'] || '').split(',').filter(Boolean); cur.push(el.dataset.x); RL.ui['ts.done'] = cur.join(','); RL.toast('Timesheet approved.'); });

RL.screen('web.payroll', (c) => {
  const D = c.D, steps = ['Lock', 'Compute', 'Validate', 'Preview', 'Approve', 'Push', 'Post'];
  const step = Math.max(0, Math.min(6, +(RL.ui['pr.step'] || 3)));
  const prov = RL.ui['pr.prov'] || (c.t.id === 'reyes' ? 'QuickBooks Payroll' : 'Gusto');
  const S = seats(c), heads = Math.max(1, c.winter ? S.fieldWinter : S.fieldPeak);
  const reg = Math.round(heads * (c.winter ? 18 : 41) * 4) / 4, ot = c.winter ? Math.round(heads * .8) : Math.round(heads * 3.4 * 4) / 4;
  const avg = 19.4, g = reg * avg + ot * avg * 1.5;
  const lines = [['REG', reg, reg * avg], ['OT (regular rate incl. bonus)', ot, ot * avg * 1.5], ['PTO / sick', c.winter ? 8 : 16, (c.winter ? 8 : 16) * avg], ['Production bonus', null, c.winter ? 0 : heads * 24], ['Reimbursements', null, heads * 6.5]];
  const total = lines.reduce((s, l) => s + l[2], 0);
  const per = c.winter ? 'Jan 3 - Jan 9' : 'May 2 - May 8';
  const pp = seesFor(c, 'pay_rate', '');
  const body = step <= 2 ? h.list([
    { icon: 'check', tone: 'ok', title: 'All timesheets approved', sub: `${heads} people · locked ${c.winter ? 'Mon Jan 11 10:00' : 'Mon May 10 10:00'}` },
    { icon: 'warn', tone: 'warn', title: 'Overtime premium includes the production bonus (regular-rate true-up)', sub: 'FLSA regular rate: bonus spread over the week\'s hours (15 §4.9)' },
    { icon: 'info', tone: 'info', title: 'Validation: 0 blocking, 2 warnings, 1 info', sub: 'Youth hour limits checked; H-2B wage parity checked' },
  ]) : h.table([{ k: 0, label: 'Earning code' }, { k: 1, label: 'Hours', n: true, fmt: v => v == null ? '' : num(v) }, { k: 2, label: 'Amount', n: true, fmt: v => pp ? money(v, { cents: true }) : '•••' }], lines, { dense: true, foot: ['Total gross', '', pp ? money(total, { cents: true }) : '•••'] });
  return h.page({ title: 'Payroll export', sub: `Weekly field · ${per} · pay date ${c.winter ? 'Fri Jan 15' : 'Fri May 14'} · provider: <b>${esc(prov)}</b>`, actions: roPill(c, 'payroll_export.run') })
    + h.cols('21', [
      sec('Close pay period', h.steps(steps, step) + body + `<div class="flex">${step > 0 ? h.btn('Back', { ui: 'pr.step', val: String(step - 1), sm: true }) : ''}<span class="grow"></span>${total > 40000 && step === 4 ? '<span class="tiny t3">Two-person approval above $40,000</span>' : ''}${step < 6 ? h.btn(step === 5 ? 'Push to ' + esc(prov) : steps[step + 1], { ui: 'pr.step', val: String(step + 1), kind: 'primary', sm: true }) : h.pill('Posted to the ledger: payroll journal JE-10431', 'ok')}</div>`, { sub: 'Lock, compute, validate, preview, approve, push, post (15 §6.6)' }),
      `<div class="stack12">${sec('Export target', h.field('Provider', h.select(['Gusto', 'QuickBooks Payroll', 'ADP', 'Paychex', 'CSV (any provider)'], prov, { ui: 'pr.prov' })) + kv2([['Mapping', '14 earning codes mapped'], ['Employees matched', `${heads} of ${heads}`], ['Last push', past(c)[4] + ', 41 employees']]) + h.note('Rootline computes; the provider pays and files. Payroll journal posts to the ledger after the push.'))}
      ${c.has('payroll') ? sec('Embedded payroll ' + h.tag('V1'), h.pill('Active', 'ok')) : `<div>${isOwner(c) ? h.lock(c, 'payroll') : h.note('Embedded payroll is a V1 add-on. ' + ask(c))}</div>`}</div>`,
    ]);
});

RL.screen('web.certs', (c) => {
  const rows = certRows(c), st = stateOf(c);
  const view = h.tab('ct.view', 'matrix');
  const cell = v => !v || v === '-' ? '<span class="t3">-</span>' : /^OK/.test(v) ? h.pill(esc(v), 'ok') : /Expir|Med card/.test(v) ? h.pill(esc(v), 'warn') : v === 'AUTH' ? h.pill('AUTH', 'ok') : v === 'TRN' ? h.pill('In training', 'info') : esc(v);
  const lic = r => !r.lic ? '<span class="t3">-</span>' : r.lic === 'expired' ? h.pill('EXP ' + esc(r.exp), 'danger') : r.lic === 'expiring' ? h.pill('Exp ' + esc(r.exp), 'warn') : r.lic === 'supervised' ? h.pill('Under supv.', 'info') : h.pill('OK ' + esc(r.exp), 'ok');
  const exp = rows.find(r => r.lic === 'expired'), soon = rows.find(r => r.lic === 'expiring');
  const enforce = h.on('ct.block', true);
  const conflicts = [];
  if (exp) conflicts.push({ icon: 'lock', tone: 'danger', title: `${esc(exp.name)}: applicator license expired ${esc(exp.exp)}`, sub: `${enforce ? 'Chemical logging is blocked in the crew app' : 'Warning only'} · ${c.winter ? '0 chemical visits until spring' : '4 weed-control visits on ' + esc(exp.crew) + ' this week'}`, right: writes(c, 'certification') ? tbtn('Request renewal proof', 'Upload link sent by SMS (ES).', { sm: true }) : '' });
  if (soon) conflicts.push({ icon: 'warn', tone: 'warn', title: `${esc(soon.name)}: license expires ${esc(soon.exp)}`, sub: `3 fertilizer rounds on ${esc(soon.crew)} after that date need ${esc(soon.licCat)}`, right: writes(c, 'certification') ? tbtn('Reassign visits', 'Visits moved to a licensed applicator on another crew.', { sm: true }) : '' });
  const body = view === 'matrix' ? h.table([
    { k: 'name', label: 'Employee', fmt: (v, r) => `<b>${esc(v)}</b>${r.lead ? ' <span class="tiny t3">(L)</span>' : ''}<div class="tiny t3">${esc(r.crew)}</div>` },
    { k: 'dl', label: 'Driver lic.', fmt: cell }, { k: 'cdl', label: 'CDL / med', fmt: cell },
    { k: 'lic', label: `Pesticide (${st})`, fmt: (v, r) => lic(r) }, { k: 'fa', label: 'First aid', fmt: cell },
    { k: 'zt', label: 'Zero-turn', fmt: cell }, { k: 'saw', label: 'Chainsaw', fmt: cell },
  ], rows, { dense: true })
    : h.table([{ k: 'name', label: 'Employee' }, { k: 'what', label: 'Credential' }, { k: 'when', label: 'Expires' }, { k: 'st', label: '', fmt: v => statusPill(v) }],
      rows.filter(r => r.lic === 'expired' || r.lic === 'expiring' || /Expir|Med/.test(r.fa + r.cdl)).map(r => ({ name: r.name, what: r.lic === 'expired' || r.lic === 'expiring' ? 'Pesticide applicator ' + r.licCat : /Med/.test(r.cdl) ? 'DOT medical card' : 'First aid / CPR', when: r.lic ? r.exp : (r.cdl.match(/(\w+ \d+)$/) || r.fa.match(/(\w+ \d+)$/) || [, '-'])[1], st: r.lic === 'expired' ? 'Expired' : 'Expiring' })), { dense: true });
  return h.page({ title: c.tr('Certifications and licenses', 'Certificaciones y licencias'), sub: `${rows.length} field people · ${st} applicator rules · reminders at 60, 30 and 14 days`, actions: (writes(c, 'certification') ? h.btn('Add credential', { icon: 'plus', act: 'more-toast' }) : '') + roPill(c, 'certification') })
    + (conflicts.length ? sec('Future conflicts', h.list(conflicts), { flush: true, tone: exp ? 'danger' : 'warn' }) : '')
    + `<div class="flex between">${h.tabs('ct.view', [['matrix', 'Matrix'], ['exp', 'Expiring list']], 'matrix')}${writes(c, 'certification') ? tg('Block chemical logging when a license is expired', 'ct.block', true) : h.pill(enforce ? 'Expired licenses block chemical logging' : 'Warn only', 'info')}</div>`
    + body + h.note('Legend: OK active · Exp within 60 days · EXP expired · AUTH authorized · In training. "Under supv." means the person may apply under a licensed applicator where state rules allow (15 §4.5, §6.3).');
});

RL.screen('web.safety', (c) => {
  const D = c.D, ppl = D.people.filter(p => p.seat === 'field');
  const nm = i => (ppl[i % Math.max(1, ppl.length)] || { name: c.who }).name;
  const cases = [
    { id: 'SC-2027-014', who: nm(2), when: c.winter ? 'Jan 6 10:20' : 'May 4 10:20', what: 'Hand laceration changing a trimmer head', type: 'Injury', rec: 'Recordable: restricted', days: '0 away, 2 restricted', clock: 'OSHA 301 done' },
    { id: 'SC-2027-015', who: nm(4), when: c.winter ? 'Jan 9 06:10' : 'May 7 14:05', what: c.winter ? 'Slip on ice at a plow site, bruised hip' : 'Heat exhaustion symptoms, rested and hydrated', type: c.winter ? 'Injury' : 'Illness', rec: 'Decision needed', days: '-', clock: '3d 22h left for the 301 record' },
    { id: 'SC-2027-016', who: nm(1), when: c.winter ? 'Jan 11 15:30' : 'May 10 15:30', what: 'Trailer gate struck a parked car (no injury)', type: 'Property damage', rec: 'Not recordable', days: '-', clock: 'Insurer notified' },
    { id: 'NM-2027-031', who: nm(3), when: c.winter ? 'Jan 7 08:00' : 'May 6 08:00', what: 'Near miss: mower on a slope near a retaining wall', type: 'Near miss', rec: 'Not recordable', days: '-', clock: 'Toolbox talk assigned' },
  ];
  const sel = cases.find(x => x.id === RL.ui['sf.case']) || cases[1];
  const talks = c.winter ? [['Cold stress and frostbite', 92], ['Slips on ice, three points of contact', 88], ['Plow truck pre-trip checks', 100]] : [['Heat illness prevention (water, rest, shade)', 94], ['Mower rollover on slopes', 81], ['Hearing protection with blowers', 76]];
  return h.page({ title: c.tr('Safety and incidents', 'Seguridad e incidentes'), sub: `${cases.length} cases this year · OSHA 300 log ${c.winter ? '· 300A summary posts Feb 1 to Apr 30' : 'current'}`, actions: (writes(c, 'incident') ? h.btn('Report incident', { kind: 'primary', icon: 'plus', act: 'more-toast' }) : '') + tbtn('Download OSHA 300', 'OSHA 300 log exported (PDF and CSV).', { icon: 'download' }) })
    + (c.winter ? bnr(`${icon('info')} OSHA 300A summary for 2026 must be certified and posted from Feb 1 to Apr 30 (verify). ${writes(c, 'incident') ? 'Draft is ready to review.' : ''}`, 'info') : '')
    + h.kpis([{ label: 'Recordable cases (YTD)', value: 1 }, { label: 'Days away', value: 0 }, { label: 'Restricted days', value: 2 }, { label: 'Days since lost-time injury', value: c.winter ? 212 : 331, tone: 'ok', delta: 'Crew app shows the streak' }])
    + h.cols('21', [
      sec('Cases', h.table([
        { k: 'id', label: 'Case', m: true }, { k: 'who', label: 'Employee' }, { k: 'what', label: 'What happened', fmt: (v, r) => `${esc(v)}<div class="tiny t3">${esc(r.when)} · ${esc(r.type)}</div>` },
        { k: 'rec', label: 'OSHA', fmt: v => statusPill(v) },
        { k: 'id', label: '', fmt: v => h.btn(v === sel.id ? 'Open' : 'View', { sm: true, ui: 'sf.case', val: v, kind: v === sel.id ? 'primary' : '' }) },
      ], cases, { dense: true }), { flush: true }),
      sec(`Case ${esc(sel.id)}`, kv2([['Employee', esc(sel.who)], ['When', esc(sel.when)], ['Clocks', esc(sel.clock)], ['Days', esc(sel.days)]])
        + (sel.rec === 'Decision needed' ? h.aiCard({ agent: 'Copilot', level: 'L1', credits: 1, title: 'Suggestion, not a decision: likely not recordable if only first aid was given', why: '29 CFR 1904.7: first aid only (rest, fluids, bandage) is not medical treatment. The safety admin must pick the decision.' }) + (writes(c, 'incident') ? `<div class="flex">${tbtn('Recordable', 'Decision saved with your rationale.', { sm: true })}${tbtn('Not recordable', 'Decision saved with your rationale.', { sm: true })}</div>` : '') : '')
        + h.note('Reported in Spanish by voice and translated. Medical details are a privacy case when required.')),
    ])
    + sec('Toolbox talks this week', h.bars(talks.map(([l, p]) => ({ label: esc(l), value: p, max: 100, right: p + '% signed', tone: p < 80 ? 'warn' : '' }))) + h.note('EN and ES, read aloud in the crew app; sign-off with a tap.'));
});

RL.screen('web.hiring', (c) => {
  const D = c.D, S = seats(c);
  const need = Math.max(2, Math.round((S.fieldPeak - S.fieldWinter) * .3));
  const names = ['José Luna', 'Kevin Ortiz', 'Ana Flores', 'Marcus Lee', 'Daniel Soto', 'Brianna Hall', 'Luis Peña', 'Oscar Reyes', 'Tom Becker', 'Maria Castillo'];
  const card = (n, i, stage) => ({ title: esc(n), sub: `${i % 2 ? 'Applied in Spanish' : 'Applied in English'} · ${['Indeed', 'Referral: ' + ((D.crews[0] || {}).lead || 'crew lead'), 'Yard sign QR', 'Website'][i % 4]}`, meta: (i % 3 === 0 ? h.pill('Zero-turn: 1+ season', 'info') : '') + (stage === 'Offer' ? h.pill('Offer sent', 'ok') : '') });
  const stages = [['Applied', names.slice(0, 4)], ['Phone screen', names.slice(4, 6)], ['Interview', names.slice(6, 8)], ['Offer', names.slice(8, 9)], ['Hired', names.slice(9, 10)]];
  const tab = h.tab('hr.tab', 'pipe');
  const h2b = [['Prevailing wage determination', 'Agent', 'Dec 28', 'Done'], ['Labor certification filed (Jan 1-16 window)', 'Agent', 'Jan 2', 'Done'], ['Recruitment report', 'Agent', 'Feb 5', c.winter ? 'Not started' : 'Done'], ['I-129 petition', 'Agent', 'Feb 26', c.winter ? 'Not started' : 'Done'], ['Consular appointments (6 workers)', 'Workers', 'Mar 12-28', c.winter ? 'Not started' : 'Done'], ['Housing ready (1 unit, 6 beds)', 'Office', 'Mar 25', c.winter ? 'Waiting' : 'Done']];
  return h.page({ title: 'Hiring', tags: h.tag('V1'), sub: `${c.winter ? 'Spring hiring rush starts now' : 'Peak season backfill'} · target ${need} seasonal technicians by ${c.winter ? 'Mar 15' : 'May 24'}`, actions: writes(c, 'employee') ? h.btn('New job post', { kind: 'primary', icon: 'plus', act: 'more-toast' }) + tbtn('Copy apply link (ES/EN)', 'Apply link copied: 3-minute mobile apply, no resume needed.', { icon: 'link' }) : roPill(c, 'employee') })
    + h.tabs('hr.tab', [['pipe', 'Applicants', names.length], ['h2b', 'H-2B season ' + h.tag('V1')], ['posts', 'Job posts', 2]], 'pipe')
    + (tab === 'pipe' ? h.board(stages.map(([t, list], si) => ({ title: t, cards: list.map((n, i) => card(n, i + si, t)) }))) + h.aiCard({ agent: 'Hiring Assistant', level: 'L2', credits: 1, title: 'Application summaries and translation only', body: 'Summarizes each application in the reviewer\'s language. It never ranks or rejects applicants; people decide (17 A25, 15 AI-2).' })
      : tab === 'h2b' ? h.note('Not legal advice. Confirm all filings and obligations with your attorney or agent.') + h.table([{ k: 0, label: 'Milestone' }, { k: 1, label: 'Owner' }, { k: 2, label: 'Due' }, { k: 3, label: 'Status', fmt: v => statusPill(v) }], h2b, { dense: true }) + h.kv([['Date of need', 'Apr 1, 2027'], ['Workers', '6 returning, 0 new'], ['Guarantee', '3/4 of hours offered per period, tracked from timesheets']])
        : h.table([{ k: 0, label: 'Post' }, { k: 1, label: 'Pay range' }, { k: 2, label: 'Languages' }, { k: 3, label: 'Applicants', n: true }], [['Landscape technician (seasonal)', seesFor(c, 'pay_rate', '') ? '$18 - $22 / h' : 'Shown on the post', 'EN, ES', 8], ['Crew lead, maintenance', seesFor(c, 'pay_rate', '') ? '$24 - $28 / h' : 'Shown on the post', 'EN, ES', 2]], { dense: true }));
});

// =====================================================================
// MARKETING (16)
// =====================================================================
const EMAIL_INC = { starter: 2000, grow: 10000, pro: 50000, enterprise: 50000, design_solo: 2000 };
function campaignsFor(c) {
  const base = c.D.campaigns.map(x => Object.assign({}, x));
  if (c.winter) {
    const w = [['Spring cleanup early-bird', 'Scheduled Feb 15', 0, null, null], ['2027 maintenance renewals', 'Sent', 1460, 47, 22], ['Snow service reminder (commercial)', 'Sent', 210, 61, 9], ['Review request after visit (journey)', 'Always on', 140, 55, 41]];
    base.forEach((x, i) => { const r = w[i]; if (r) Object.assign(x, { name: r[0], status: r[1], sent: r[2], open: r[3], conv: r[4] }); });
  }
  return base.map((x, i) => Object.assign(x, { channel: ['Email + SMS', 'Email', 'Email', 'SMS'][i % 4], segment: ['Turf over 3,000 sq ft', 'Maintenance, mulch last year', 'All active residential', 'Completed visits'][i % 4], rev: x.conv ? Math.round(x.sent * x.conv / 100 * 0.18) * 185 : 0 }));
}
RL.screen('web.campaigns', (c, a) => {
  const list = campaignsFor(c), tab = h.tab('cm.tab', 'list');
  const adv = c.has('marketing_advanced'), canSend = writes(c, 'campaign') && c.role !== 'designer';
  const emInc = EMAIL_INC[c.planCode] || 2000, emUsed = Math.round(emInc * (c.winter ? .21 : .46));
  const smsInc = c.plan.sms || 500, smsUsed = Math.round(smsInc * .44);
  const nCl = c.t.clients;
  const segs = [['Maintenance clients without a spring cleanup', Math.round(nCl * .41), 'Agreement active, no spring cleanup visit'], ['Turf over 3,000 sq ft (cool-season)', Math.round(nCl * .33), 'Property turf area, Region'], ['Lapsed: no visit in 12 months', Math.round(nCl * .12), 'Last completed visit'], ['Commercial and HOA contacts', Math.round(nCl * .08), 'Client type'], ['Promoters (NPS 9-10)', Math.round(nCl * .21), 'Latest NPS answer']];
  const journeys = [['New client welcome', 'R17', 'Agreement activated: welcome email, portal invite, crew intro photo', 'On'], ['Review request after visit', 'R5', 'Job completed or 4th visit: ask once, one reminder after 3 days', 'On'], ['Unsigned proposal nudge', 'R20', 'Viewed, not signed after 3 days: estimator task plus optional nudge', 'On'], ['Spring cleanup offer', 'R8', 'Feb 15: proposal add-on to maintenance clients without one', c.winter ? 'Scheduled' : 'Done for 2027']];
  let body;
  if (tab === 'list') body = h.table([
    { k: 'name', label: 'Campaign', fmt: (v, r) => `<b>${esc(v)}</b><div class="tiny t3">${esc(r.segment)} · ${esc(r.channel)}</div>` },
    { k: 'status', label: 'Status', fmt: v => statusPill(v) }, { k: 'sent', label: 'Sent', n: true, fmt: (v, r) => /Scheduled|Draft/.test(r.status) ? (v ? `<span class="t3">${num(v)} queued</span>` : '-') : v ? num(v) : '-' },
    { k: 'open', label: 'Opened', n: true, fmt: v => v != null ? v + '%' : '-' }, { k: 'conv', label: 'Booked', n: true, fmt: v => v != null ? v + '%' : '-' },
    { k: 'rev', label: 'Revenue (last touch)', n: true, fmt: v => v ? h.mask(c, 'price', money(v)) : '-' },
  ], list, { dense: true }) + h.note('Attribution at MVP is first touch and last touch. Multi-touch needs Advanced Marketing (V1).')
    + sec('Lead sources this season (last touch)', h.table([{ k: 0, label: 'Source' }, { k: 1, label: 'Leads', n: true }, { k: 2, label: 'Won', n: true }, { k: 3, label: 'Revenue', n: true, fmt: v => h.mask(c, 'price', money(v)) }, { k: 4, label: 'Spend', n: true, fmt: v => v ? h.mask(c, 'cost', money(v)) : '-' }],
      [['Google Business Profile', 64, 22, 61400, 0], ['Referral', 31, 17, 48200, 250], ['Website form', 48, 14, 39800, 1200], ['Campaign email and SMS', 39, 16, 16300, 0], ['Yard signs and truck wrap', 18, 6, 11900, 900]].map(r => c.winter ? [r[0], Math.round(r[1] * .2), Math.round(r[2] * .2), Math.round(r[3] * .15), Math.round(r[4] * .2)] : r), { dense: true }), { flush: true, sub: 'Spend is entered by hand at MVP; ad platform sync arrives at V1 (16 §4.5.3)' });
  else if (tab === 'journeys') body = h.list(journeys.map(([n, r, d, s]) => ({ icon: 'bolt', tone: s === 'On' ? 'ok' : '', title: `${esc(n)} <span class="tiny t3 mono">${r}</span>`, sub: esc(d), right: statusPill(s) }))) + h.note('Prebuilt journeys are in every plan. Editing steps or building new multi-step journeys needs the journey builder.');
  else if (tab === 'segments') body = h.table([{ k: 0, label: 'Segment' }, { k: 1, label: 'Clients', n: true, fmt: v => num(v) }, { k: 2, label: 'Built from', fmt: v => `<span class="tiny t3">${esc(v)}</span>` }, { k: 0, label: '', fmt: v => canSend ? tbtn('Use', `New campaign drafted for "${v}".`, { sm: true }) : '' }], segs, { dense: true }) + h.note('Consent is checked per channel at send time; opted-out and do-not-contact clients are removed automatically (16 §4.21).');
  else body = adv ? sec('Journey: lapsed client win-back', h.steps(['Trigger: no visit in 12 months', 'Email: we miss you', 'Wait 5 days', 'If not opened: SMS', 'If booked: stop', 'Task: owner call'], 6) + `<div class="flex">${h.tag('V1')}<span class="tiny t3">Branches, waits, A/B splits, holdout groups and multi-touch attribution.</span></div>`, { sub: 'Advanced Marketing' + (c.planCode === 'pro' ? ' (included in Pro)' : '') }) : inlineLock(c, 'marketing_advanced');
  return h.page({ title: 'Campaigns', sub: `${list.length} campaigns · ${segs.length} saved segments${a.state === 'limit' ? ' · ' + esc(a.limit) : ''}`, actions: (canSend ? h.btn('New campaign', { kind: 'primary', icon: 'plus', modal: 'more-campaign' }) : writes(c, 'campaign') ? h.btn('New draft', { icon: 'plus', modal: 'more-campaign' }) + h.pill('Drafts only, no send', 'info') : '') + roPill(c, 'campaign') })
    + `<div class="cd"><div class="cd-b"><div class="cols cols-3">${h.meter('Marketing emails this month', emUsed, emInc)}${h.meter('SMS segments this month', smsUsed, smsInc)}<div class="stack8"><span class="small"><b>10DLC marketing campaign</b></span>${c.planCode === 'starter' ? h.pill('Not registered: marketing SMS off', 'warn') : h.pill('Approved · active', 'ok')}</div></div><div class="tiny t3">Transactional SMS is registered for every Company at signup; marketing SMS needs its own registered campaign (16 §4.20).</div></div></div>`
    + h.tabs('cm.tab', [['list', 'Campaigns', list.length], ['journeys', 'Prebuilt journeys', journeys.length], ['segments', 'Segments', segs.length], ['builder', 'Journey builder ' + (adv ? h.tag('V1') : icon('lock', 's'))]], 'list') + body;
});
RL.modal('more-campaign', c => ({ title: 'New campaign', body: h.field('Name', h.input(c.winter ? 'Spring cleanup early-bird' : 'Mulch refresh, June slots')) + h.field('Segment', h.select(['Maintenance clients without a spring cleanup', 'Turf over 3,000 sq ft (cool-season)', 'Lapsed: no visit in 12 months'], 'Turf over 3,000 sq ft (cool-season)')) + h.field('Channel', h.select(['Email', 'SMS', 'Email + SMS'], 'Email + SMS')) + h.field('Message', h.textarea(`${c.t.name}: aeration and overseeding for your lawn is {price_from_turf_area} on your usual route day. Reply YES to book. STOP to opt out.`)) + h.aiCard({ agent: 'Copilot', level: 'L1', credits: 1, title: 'Draft the email body in your voice', actions: tbtn('Draft (1 credit)', 'Draft added below the SMS text.', { sm: true, kind: 'ai' }) }) + h.note('Price blocks pull each client\'s price from turf area. Quiet hours and frequency caps apply (16 §4.21.3).'), foot: h.btn('Cancel', { act: 'noop' }) + (c.role === 'designer' ? tbtn('Save draft', 'Draft saved for the office to send.', { kind: 'primary' }) : tbtn('Schedule send', 'Campaign scheduled. Consent is checked again at send time.', { kind: 'primary' })) }));

RL.screen('web.reviews', (c) => {
  const D = c.D, can = writes(c, 'review.respond');
  const drafted = RL.ui['rv.draft'] === '1';
  const stars = n => `<span style="color:var(--marigold-600)" aria-label="${n} stars">${'★'.repeat(n)}</span><span class="t3">${'★'.repeat(5 - n)}</span>`;
  const rv = D.reviews.map((r, i) => Object.assign({}, r, { matched: i < 3 ? D.clients[(i * 3) % D.clients.length].name : null, replied: i === 0 || i === 1 }));
  const low = rv.find(r => r.stars <= 3);
  const nps = { p: 62, n: 25, d: 13 };
  const crewLead = (D.crews[0] || {}).lead || 'the crew lead';
  return h.page({ title: 'Reviews and NPS', sub: `Google Business Profile connected · ${c.winter ? 'NPS next sends in May' : 'Relationship NPS sent May 3'}`, actions: can ? tbtn('Send requests now (14 eligible)', '14 review requests queued. Eligibility never depends on satisfaction or NPS.', { kind: 'primary', icon: 'send' }) : '' })
    + bnr(`${icon('shield')} No review gating: every eligible client gets the same ask after a completed job or their 4th visit, at most once per 180 days. Requests never depend on satisfaction, NPS or complaints, and never carry incentives (16 §4.12.1).`, 'info')
    + h.kpis([{ label: 'Google rating', value: '4.8', delta: '186 reviews · +9 in 30 days', tone: 'ok' }, { label: 'Requests sent (30 d)', value: c.winter ? 38 : 212, delta: (c.winter ? 26 : 31) + '% left a review' }, { label: 'Relationship NPS', value: '+' + (nps.p - nps.d), delta: 'n = 214 responses' }, { label: 'Open detractor tasks', value: 3, delta: '48-hour SLA', tone: 'warn' }])
    + h.cols('21', [
      sec('Recent reviews', h.list(rv.map(r => ({ icon: 'star', tone: r.stars <= 3 ? 'warn' : 'ok', title: `${stars(r.stars)} <b>${esc(r.name)}</b> <span class="tiny t3">${esc(r.when)}</span>`, sub: `“${esc(r.text)}”${r.matched ? ` · matched to ${esc(r.matched)}` : ''}`, right: r.replied ? h.pill('Replied', 'ok') : h.pill('Needs reply', 'warn') })))
        + (low ? `<div style="padding:0 12px 12px">${h.aiCard({ agent: 'Review and Reputation (A18)', level: 'L2', credits: 1, title: drafted ? 'Draft reply ready for approval' : `Draft a reply to ${esc(low.name)}`, body: drafted ? `“Thank you for the honest feedback. You are right that the patio timeline updates were slow, and we are sorry. Please call me at the office so we can make it right. ${esc(c.owner)}”` : 'Thanks the reviewer, references the service, never shares private details, invites an offline follow-up with a named contact.', why: 'Replies need human approval at MVP. Auto-post for short 5-star reviews is an opt-in at V1.', actions: can ? (drafted ? tbtn('Approve and post', 'Reply posted to Google.', { sm: true, kind: 'primary' }) + h.btn('Edit', { sm: true, ui: 'rv.draft', val: '0' }) : h.btn('Draft reply (1 credit)', { sm: true, kind: 'ai', ui: 'rv.draft', val: '1' })) : '' })}</div>` : ''), { flush: true }),
      `<div class="stack12">${sec('NPS', h.bars([{ label: 'Promoters (9-10)', value: nps.p, max: 100, right: nps.p + '%' }, { label: 'Passives (7-8)', value: nps.n, max: 100, right: nps.n + '%', tone: 'info' }, { label: 'Detractors (0-6)', value: nps.d, max: 100, right: nps.d + '%', tone: 'danger' }]) + h.note('Detractors get a follow-up task (48 h). Promoters become eligible for a referral ask. NPS never gates review requests.'))}
      ${sec('Kudos for crews', h.list([{ icon: 'users', tone: 'ok', title: `${esc(crewLead)}'s crew`, sub: '“Careful with the gate and the dog”', right: h.pill('Sent to crew app', 'ok') }]) + h.note('No per-employee review quotas or leaderboards.'), { flush: true })}</div>`,
    ]);
});

RL.screen('web.referrals', (c, a) => {
  const D = c.D, can = writes(c, 'referral'), lim = c.feat('referrals').s === 'L';
  const st = ['Lead created', 'Qualified', 'Reward pending approval', 'Reward issued', 'Invited', 'Flagged: shared address'];
  const rows = D.clients.filter(x => x.type === 'residential').slice(0, 6).map((cl, i) => ({ by: cl.name, code: (c.t.brand.portal.split('.')[1] || c.t.id).slice(0, 14) + '.com/r/' + cl.name.split(' ')[0].toUpperCase().slice(0, 6), ref: ['Avery Cole', 'Nina Park', 'Sam Ortiz', 'Lena Fox', '-', 'Chris Dale'][i], status: st[i], reward: i === 3 ? 50 : i === 2 ? 50 : 0, when: past(c)[i] }));
  return h.page({ title: 'Referrals', tags: h.tag('V1'), sub: `Program: give $25, get $50 credit · ${rows.length} referrals this season${lim ? ' · ' + esc(c.feat('referrals').note || 'Starter: account credit rewards only') : ''}`, actions: can ? h.btn('Program settings', { modal: 'more-ref' }) + tbtn('Print crew referral cards', 'QR referral cards queued (crews leave them after visits).', { icon: 'download' }) : roPill(c, 'referral') })
    + h.kpis([{ label: 'Referred leads', value: 14, delta: 'This season' }, { label: 'Qualified', value: 6, delta: 'First invoice paid' }, { label: 'Rewards issued', value: h.mask(c, 'price', money(250)), delta: 'As credit memos' }, { label: 'Flagged by fraud checks', value: 1, tone: 'warn', delta: 'Owner review' }])
    + sec('Referrals', h.table([
      { k: 'by', label: 'Referrer', fmt: (v, r) => `<b>${esc(v)}</b><div class="tiny t3 mono">${esc(r.code)}</div>` }, { k: 'ref', label: 'Referred' }, { k: 'when', label: 'When' },
      { k: 'status', label: 'Status', fmt: v => statusPill(v) }, { k: 'reward', label: 'Reward', n: true, fmt: v => v ? money(v) : '-' },
      { k: 'status', label: '', fmt: v => /pending/.test(v) && (can || c.role === 'bookkeeper') ? tbtn('Approve reward', 'Credit memo issued and posted to the marketing expense account.', { sm: true, kind: 'primary' }) : /Flagged/.test(v) && can ? tbtn('Review', 'Opened the fraud check: same address as the referrer.', { sm: true }) : '' },
    ], rows, { dense: true }), { flush: true, sub: 'Invited, lead created, qualified, reward pending, issued; reversed if the referee refunds within 30 days' })
    + `<div class="flex"><span class="tiny t3">Rewards per recipient are tracked against the IRS information-reporting threshold; the bookkeeper is alerted (verify the threshold with your CPA).</span>${lim ? lockPill('Gift cards and charity rewards: Grow and Pro') : ''}</div>`;
});
RL.modal('more-ref', c => ({ title: 'Referral program', body: h.field('Referrer reward', h.select(['$50 account credit', 'One free mow', 'Gift card $50 (V1)'], '$50 account credit')) + h.field('Referee reward', h.select(['$25 off first service', '10% off first month'], '$25 off first service')) + h.field('Qualifies when', h.select(['First invoice paid in full', 'First invoice over $150 paid'], 'First invoice paid in full')) + h.field('Cap per referrer per year', h.input('5')) + h.note('Self-referral and shared address, phone or payment fingerprint are blocked. Referral asks are never tied to a review.'), foot: h.btn('Cancel', { act: 'noop' }) + tbtn('Save program', 'Program saved; terms page updated on your website.', { kind: 'primary' }) }));

RL.screen('web.website', (c) => {
  const D = c.D, can = writes(c, 'website'), publish = can && c.role !== 'designer';
  const host = c.t.brand.portal.replace(/^portal\./, 'www.').replace('.rootline.app', '.rootline.site');
  const book = c.feat('online_booking');
  const pages = [['Home', 'Template: Prairie', 'Live'], ['Services (6)', 'From enabled service lines', 'Live'], ['Service areas (4)', 'One per real service area, unique content', 'Live'], ['Project gallery', `${D.jobs.filter(j => j.status === 'Complete').length + 9} completed jobs, client consent on file`, 'Live'], [`Plant pages: ${esc(c.t.region)}`, 'From the Plant KB palette', 'Live'], ['Request a quote / book online', 'Booking widget', book.s === 'L' ? 'Limited' : 'Live'], ['SMS terms and privacy', 'Auto-published for 10DLC', 'Live']];
  const svc = [['Weekly mowing', 'Per visit from turf area', '$42 - $68', 'High'], ['Spring cleanup', 'Lot size and beds', '$240 - $520', 'Medium'], ['Core aeration', 'Turf area', '$95 - $180', 'High'], ['Mulch install', 'Bed area from aerial', 'Quote after review', 'Low: site visit']];
  return h.page({ title: 'Website and booking', tags: h.tag('V1'), sub: `<span class="mono">${esc(host)}</span> · ${c.planCode === 'pro' ? '1 site included in Pro' : 'Website + Online Booking add-on'}`, actions: (publish ? tbtn('Publish changes', 'Site published. Service-area pages passed the duplicate-content check.', { kind: 'primary', icon: 'globe' }) : can ? h.pill('Content and gallery only, no publish', 'info') : roPill(c, 'website')) + h.btn('Preview', { act: 'more-toast' }) })
    + h.kpis([{ label: 'Visitors (30 d)', value: num(c.winter ? 1180 : 4620) }, { label: 'Form and booking leads', value: c.winter ? 21 : 96, delta: 'Attributed to source' }, { label: 'Online bookings', value: c.winter ? 3 : 38, delta: 'Instant-priced' }, { label: 'Visualizer leads', value: c.winter ? 9 : 27, delta: '"See your yard redesigned"', tone: 'info' }])
    + h.cols('2', [
      sec('Pages', h.table([{ k: 0, label: 'Page' }, { k: 1, label: 'Source', fmt: v => `<span class="tiny t3">${v}</span>` }, { k: 2, label: '', fmt: v => statusPill(v) }], pages, { dense: true }), { flush: true }),
      sec('Instant quotes and booking', h.table([{ k: 0, label: 'Bookable service' }, { k: 1, label: 'Priced from', fmt: v => `<span class="tiny">${esc(v)}</span>` }, { k: 2, label: 'Range', fmt: v => h.mask(c, 'price', esc(v)) }, { k: 3, label: 'Confidence', fmt: v => h.pill(esc(v), /High/.test(v) ? 'ok' : /Low/.test(v) ? 'warn' : 'info') }], svc, { dense: true })
        + h.note('Low-confidence measurements fall back to "we will confirm the price" instead of a firm quote (16 §4.3.4).') + (book.s === 'L' ? `<div>${lockPill('Starter: booking limited; instant quotes need Grow')}</div>` : ''), { flush: true }),
    ])
    + sec('Widgets for an existing site', `<div class="flex">${['Quote request form', 'Booking widget', 'Yard visualizer', 'Reviews carousel'].map(w => h.pill(esc(w), 'info')).join('')}<span class="grow"></span>${tbtn('Copy embed code', 'Embed snippet copied.', { sm: true, icon: 'copy' })}</div>` + h.note('Widgets work on any website; the hosted site is optional.'));
});

RL.screen('web.receptionist', (c) => {
  const D = c.D, can = writes(c, 'campaign') && c.role !== 'designer';
  const recep = c.has('ai_receptionist'), fr = c.feat('ai_receptionist');
  const tb = h.on('rc.textback', true);
  const callers = D.leads.slice(0, 7);
  const calls = callers.map((l, i) => ({ when: (c.winter ? 'Jan 11 ' : 'May 10 ') + ['8:12 am', '9:47 am', '11:03 am', '12:30 pm', '2:41 pm', '6:58 pm', '8:15 pm'][i], from: l.name, src: ['Google Business', 'Truck wrap', 'Website (DNI)', 'Yard sign', 'Website (DNI)', 'Google Business', 'Direct'][i], dur: ['3:42', '0:00', '6:10', '1:55', '0:00', '4:20', '0:00'][i], out: ['Booked site visit', 'Missed: text-back sent', 'Quote requested', 'Existing client', 'Missed: text-back sent', 'Booked', recep ? 'AI answered: booked' : 'Voicemail transcribed'][i] }));
  const voiceInc = { starter: 300, grow: 1000, pro: 3000 }[c.planCode] || 1000;
  const mins = recep ? (c.planCode === 'pro' ? { inc: 200, used: c.winter ? 41 : 132 } : { inc: 100, used: c.winter ? 18 : 74 }) : null;
  return h.page({ title: 'Calls and AI receptionist', sub: `Main line ${'(614) 555-0142'} · ${4} tracking numbers · recording with disclosure, kept 13 months`, actions: can ? tbtn('Add tracking number', 'Number provisioned and labeled "Door hangers".', { icon: 'plus' }) : roPill(c, 'campaign') })
    + h.kpis([{ label: 'Calls (30 d)', value: c.winter ? 96 : 412 }, { label: 'Answer rate', value: c.winter ? '88%' : '81%' }, { label: 'Missed, texted back', value: c.winter ? 9 : 47, delta: 'Within 30 seconds' }, { label: 'First-call bookings', value: c.winter ? 14 : 63, tone: 'ok' }])
    + h.cols('21', [
      sec('Call log', h.table([{ k: 'when', label: 'When' }, { k: 'from', label: 'Caller' }, { k: 'src', label: 'Source' }, { k: 'dur', label: 'Length', n: true }, { k: 'out', label: 'Outcome', fmt: v => statusPill(v) }], calls, { dense: true }) + h.note('Transcription and summary cost 2 credits per call or voicemail. AI receptionist time is metered in minutes, not credits.'), { flush: true }),
      `<div class="stack12">${sec('Missed-call text-back', (can ? tg('Send a text within 30 seconds', 'rc.textback', true) : h.pill(tb ? 'On' : 'Off', tb ? 'ok' : '')) + `<div class="small t2" style="background:var(--surface-2);padding:8px;border-radius:8px">“Sorry we missed you, this is ${esc(c.t.name)}. How can we help? Reply here or request a visit online. Reply STOP to opt out.”</div>` + h.note('Mobile numbers only, inside quiet hours, once per caller.'))}
      ${sec('Call routing', kv2([['Business hours', 'Mon-Fri 7:00-5:00, Sat 8:00-12:00'], ['After hours', recep ? 'AI receptionist' : 'Voicemail with transcription'], ['Ring group', 'Office (sequential)'], ['Minutes', `${num(c.winter ? 640 : 2210)} / ${num(voiceInc)} included`]]))}</div>`,
    ])
    + (recep ? sec('AI receptionist ' + h.tag('V1'), `<div class="cols cols-2"><div class="stack8">${h.meter('AI receptionist minutes this month', mins.used, mins.inc, { unit: 'min' })}<div class="tiny t3">${c.planCode === 'pro' ? 'Pro includes 200 min' : 'Add-on includes 100 min'}, then $0.39/min. At the ceiling, calls fall back to voicemail with transcription.</div></div><div class="stack8">${h.field('Answers', h.select(['After hours and overflow', 'After hours only', 'All calls (24/7)'], 'After hours and overflow', { ui: 'rc.mode' }))}${h.field('Languages', h.select(['English and Spanish', 'English only'], 'English and Spanish'))}</div></div>` + h.aiCard({ agent: 'AI Receptionist (A23)', level: 'L2', title: 'Qualifies callers and books site visits into open schedule slots', why: 'Never quotes firm prices or takes card payments. Discloses that it is an AI assistant at the start of the call.' }))
      : `<div>${isOwner(c) ? h.lock(c, 'ai_receptionist') : h.note('AI receptionist is a V1 add-on. ' + ask(c))}</div>${fr.s === 'A' ? h.note('Until then, call tracking, voicemail with transcription and missed-call text-back cover after-hours calls (MVP).') : ''}`);
});

// =====================================================================
// REPORTS (18)
// =====================================================================
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SEASON = [.012, .018, .05, .1, .13, .12, .115, .11, .1, .1, .06, .03];
function money13(c) {
  const k = c.D.kpi, ytd = c.winter ? Math.round(k.revenueLY * .012) : k.revenueYTD;
  return { ytd, mtd: c.winter ? ytd : k.revenueMTD, goal: Math.round((c.winter ? k.revenueLY * .013 : k.revenueMTD * 1.06) / 100) * 100, ly: Math.round((c.winter ? k.revenueLY * .011 : k.revenueYTD * .9) / 100) * 100 };
}
RL.screen('web.dashboards', (c) => {
  const D = c.D, k = D.kpi, m = money13(c);
  const roleTabs = { owner: ['owner', 'ops', 'sales', 'office'], office_manager: ['office', 'sales', 'ops'], ops_manager: ['ops'], estimator: ['sales'], designer: ['design'], bookkeeper: ['owner', 'office'], observer: ['owner'] }[c.role] || ['owner'];
  const names = { owner: 'Owner command center', ops: 'Operations', sales: 'Sales', office: 'Office', design: 'My designs' };
  const tab = roleTabs.includes(RL.ui['db.tab']) ? RL.ui['db.tab'] : roleTabs[0];
  const pipe = D.opps.filter(o => o.stage !== 'Won');
  const pv = pipe.reduce((s, o) => s + o.value, 0), wv = pipe.reduce((s, o) => s + o.value * o.prob / 100, 0);
  const carr = D.agreements.reduce((s, a) => s + a.value, 0);
  let body;
  if (tab === 'owner') {
    /* Sample invoices are few; scale aging to a realistic AR (about 4.5% of annual revenue) keeping the bucket shares. */
    const ag0 = D.aging, tot0 = (ag0.current + ag0.d30 + ag0.d60 + ag0.d90) || 1, arTot = Math.round(k.revenueLY * (c.winter ? .03 : .045) / 100) * 100;
    const ar = { current: Math.round(arTot * ag0.current / tot0), d30: Math.round(arTot * ag0.d30 / tot0), d60: Math.round(arTot * ag0.d60 / tot0), d90: Math.round(arTot * ag0.d90 / tot0) };
    const curM = c.winter ? 0 : 4;
    const sw = col => `<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${col};margin-right:4px;vertical-align:-1px"></span>`;
    body = h.kpis([
      { label: 'Revenue MTD', value: h.kmoney(m.mtd), delta: (m.mtd >= m.goal ? '+' : '') + Math.round(100 * (m.mtd - m.goal) / m.goal) + '% vs goal', tone: m.mtd >= m.goal ? 'ok' : 'warn' },
      { label: 'Revenue YTD', value: h.kmoney(m.ytd), delta: '+' + Math.round(100 * (m.ytd - m.ly) / m.ly) + '% vs last year', tone: 'ok' },
      { label: 'Gross margin', value: h.mask(c, 'margin', k.gm + '%'), delta: 'Target 42%' },
      { label: 'Cash on hand', value: h.mask(c, 'client_financial', h.kmoney(k.cash)), delta: 'Bank + own Stripe balance' },
      { label: 'Backlog', value: h.mask(c, 'price', h.kmoney(Math.round(k.revenueLY * (c.winter ? .21 : .14)))), delta: (c.winter ? 9.5 : k.backlogWeeks) + ' weeks' },
    ])
      + h.cols('21', [
        sec('Revenue by month', h.colchart(MONTHS, [{ values: SEASON.map((s, i) => i < curM ? Math.round(k.revenueLY * 1.08 * s) : i === curM ? m.mtd : 0), cls: 'c1' }, { values: SEASON.map(s => Math.round(k.revenueLY * s)), cls: 'c3' }], { money: true, label: 'Revenue by month this year and last year' }) + `<div class="flex tiny t3"><span>${sw('var(--primary)')}This year (earned, ${c.today.month} to date)</span><span>${sw('var(--marigold-400)')}Last year</span><span class="grow"></span><span class="mono">revenue_earned</span></div>`),
        `<div class="stack12">${sec('Receivables', h.bars([{ label: 'Current', value: ar.current, right: h.mask(c, 'client_financial', money(ar.current)) }, { label: '1-30 days', value: ar.d30, right: h.mask(c, 'client_financial', money(ar.d30)), tone: 'warn' }, { label: '31-60 days', value: ar.d60, right: h.mask(c, 'client_financial', money(ar.d60)), tone: 'warn' }, { label: '61+ days', value: ar.d90, right: h.mask(c, 'client_financial', money(ar.d90)), tone: 'danger' }]) + `<div class="tiny t3">DSO (countback) 34 days · 2 failed autopays this week</div>`)}
        ${sec('Pipeline and recurring', kv2([['Open pipeline', h.mask(c, 'price', money(pv))], ['Weighted', h.mask(c, 'price', money(Math.round(wv)))], ['Close rate (90 d)', k.closeRate + '%'], ['Contracted recurring (CARR)', h.mask(c, 'price', money(carr))], ['Revenue per man-hour', h.mask(c, 'price', '$' + (c.winter ? 61 : 58))], ['Labor % of revenue', h.mask(c, 'cost', (c.winter ? 38 : 31) + '%')]]))}</div>`,
      ])
      + (c.inLens('V1') ? `<div class="flex">${h.tag('V1')}<span class="small">Peers: your gross margin is at the 61st percentile of 23 peers in your region, size band and service mix.</span>${c.has('benchmarks') ? h.link('Open benchmarks', 'web.benchmarks') : lockPill('Grow and Pro')}</div>` : '')
      + (c.role === 'observer' ? h.note('Observer: read-only dashboards and margin, no client PII, no client-list exports (22 §4.3).') : '');
  } else if (tab === 'ops') {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const util = (cr, d) => c.winter ? (d < 2 && cr.type === 'maintenance' ? 64 : 0) : Math.min(118, 62 + (hs(cr.name + d) % 52));
    const cellc = v => v === 0 ? 'var(--surface-3)' : v > 105 ? 'var(--danger-bg)' : v > 90 ? 'var(--warn-bg)' : 'var(--ok-bg)';
    const heat = D.crews.length ? `<div class="tb-wrap"><table class="tb dense"><thead><tr><th>Crew</th>${days.map(d => `<th class="n">${d}</th>`).join('')}</tr></thead><tbody>${D.crews.map(cr => `<tr><td><b>${esc(cr.name)}</b></td>${days.map((d, i) => { const v = i === 5 && !c.winter ? (hs(cr.name) % 3 ? 0 : 55) : util(cr, i); return `<td class="n" style="background:${cellc(v)}">${v ? v + '%' : '-'}</td>`; }).join('')}</tr>`).join('')}</tbody></table></div>` : h.empty('No crews.');
    const risk = D.jobs.filter(j => j.status === 'In progress').map(j => ({ id: j.id, client: j.client, burn: Math.round(100 * j.actualHrs / j.budgetHrs), prog: 40 + hs(j.id) % 45 })).filter(j => j.burn - j.prog > 15).slice(0, 4);
    body = h.kpis([{ label: 'Visits today', value: `${k.visitsDone} / ${k.visitsToday}`, delta: 'Done / scheduled' }, { label: 'On-time visits', value: (c.winter ? 97 : 93) + '%', tone: 'ok' }, { label: 'Hours vs budget (week)', value: h.mask(c, 'budget_hours', '+4%'), tone: 'warn' }, { label: 'Callbacks (30 d)', value: '1.8%' }])
      + h.cols('21', [sec('Crew utilization this week', heat + h.note('Green under 90%, amber 90-105%, red over 105% of available crew hours.')), sec('Jobs at risk', risk.length ? h.list(risk.map(j => ({ icon: 'warn', tone: 'warn', title: `<span class="mono">${esc(j.id)}</span> ${esc(j.client)}`, sub: `Hours burn ${j.burn}% vs progress ${j.prog}%`, go: 'web.job', x: j.id }))) : h.empty('No jobs over the 15-point burn threshold.'), { flush: true })]);
  } else if (tab === 'sales') {
    const own = c.role === 'estimator';
    const opp = own ? D.opps.filter(o => o.owner === c.who) : D.opps;
    const stages = ['New', 'Qualified', 'Site visit', 'Designing', 'Proposal sent', 'Won'];
    body = h.kpis([{ label: 'Close rate (value, 90 d)', value: k.closeRate + '%' }, { label: 'Average ticket won', value: h.mask(c, 'price', money(Math.round(D.opps.reduce((s, o) => s + o.value, 0) / D.opps.length))) }, { label: 'Lead response (median)', value: '6 min', delta: 'Lead Follow-up agent on', tone: 'ok' }, { label: 'Proposals viewed, unsigned > 7 d', value: D.proposals.filter(p => p.status === 'Viewed').length, tone: 'warn' }])
      + h.cols('2', [sec(own ? 'My pipeline by stage' : 'Pipeline by stage', h.bars(stages.map(s => { const v = opp.filter(o => o.stage === s).reduce((t, o) => t + o.value, 0); return { label: s, value: v, right: h.mask(c, 'price', h.kmoney(v)) }; }))),
        sec('Close rate by rep', h.bars((c.t.cast ? [c.t.cast.estimator, c.t.cast.owner].filter(Boolean) : [c.owner]).filter((v, i, arr) => arr.indexOf(v) === i).filter(n => !own || n === c.who).map((n, i) => ({ label: esc(n), value: [42, 51][i] || 40, max: 100, right: ([42, 51][i] || 40) + '%' }))) + h.note(own ? 'You see your own pipeline (dashboard = R/o).' : 'Estimate accuracy by rep arrives at V1.'))]);
  } else if (tab === 'design') {
    body = h.kpis([{ label: 'Designs in progress', value: D.designs.filter(d => /progress|Draft/.test(d.status)).length }, { label: 'In client review', value: D.designs.filter(d => d.status === 'Client review').length }, { label: 'Approved this season', value: D.designs.filter(d => d.status === 'Approved').length, tone: 'ok' }, { label: 'Mockups generated', value: D.designs.reduce((s, d) => s + d.mockups, 0) }])
      + sec('Designer dashboard ' + h.tag('V1'), h.table([{ k: 'id', label: 'Design', m: true }, { k: 'client', label: 'Client' }, { k: 'status', label: 'Status', fmt: v => statusPill(v) }, { k: 'updated', label: 'Updated' }], D.designs.slice(0, 6), { dense: true, go: 'web.designs' }), { flush: true });
  } else {
    const notInv = D.visits.filter(v => v.status === 'Done').length;
    body = sec('Office worklists', h.list([
      { icon: 'receipt', tone: 'warn', title: `${notInv} completed visits not yet invoiced`, sub: h.mask(c, 'price', money(notInv * 58)) + ' unbilled', go: 'web.invoices' },
      { icon: 'card', tone: 'danger', title: '2 failed autopay charges', sub: 'Update-card links sent; retry tomorrow', go: 'web.payments' },
      { icon: 'clock', tone: 'warn', title: `${D.agreements.length > 3 ? 4 : 1} agreements expiring in 30-90 days`, sub: 'Renewal offers drafted', go: 'web.agreements' },
      { icon: 'pen', tone: 'warn', title: `${D.proposals.filter(p => p.status === 'Viewed').length} proposals viewed but unsigned for 7+ days`, sub: 'Nudges ready', go: 'web.proposals' },
      { icon: 'chat', tone: 'info', title: '3 client requests open over 48 hours', go: 'web.inbox' },
      { icon: 'shield', tone: 'warn', title: '1 subcontractor COI expiring', sub: 'Tree crew partner, 12 days', go: 'web.vendors' },
    ]), { flush: true });
  }
  return h.page({ title: 'Dashboards', sub: `${esc(names[tab])} · ${c.today.label} · certified KPIs, refreshed every 15 min`, actions: (writes(c, 'dashboard') ? tbtn('Schedule email', 'Dashboard scheduled: Mondays 6:30 am as PDF.', { icon: 'mail' }) : '') + tbtn('Export PDF', 'PDF exported.', { icon: 'download' }) })
    + (roleTabs.length > 1 ? h.tabs('db.tab', roleTabs.map(t => [t, names[t]]), roleTabs[0]) : '') + body;
});

RL.screen('web.report_builder', (c) => {
  const D = c.D, src = RL.ui['rb.src'] || 'Jobs', grp = RL.ui['rb.grp'] || 'Service line';
  const metrics = [['rb.m1', 'Revenue earned', true], ['rb.m2', 'Gross margin %', true], ['rb.m3', 'Budget vs actual hours', false], ['rb.m4', 'Visits completed', false]];
  const on = metrics.filter(([kk, , d]) => h.on(kk, d));
  const groups = grp === 'Crew' ? D.crews.map(cr => cr.name) : grp === 'Month' ? (c.winter ? ['Oct', 'Nov', 'Dec', 'Jan'] : ['Feb', 'Mar', 'Apr', 'May']) : [...new Set(D.jobs.map(j => j.type))];
  const rows = groups.map(g => { const js = D.jobs.filter(j => grp === 'Service line' ? j.type === g : (hs(j.id + g) % 3 === 0)); const rev = js.reduce((s, j) => s + j.value, 0) || 4200 + hs(g) % 9000; const cost = js.reduce((s, j) => s + j.cost, 0) || rev * .58; return { g, rev, gm: Math.round(100 * (rev - cost) / rev), hrs: Math.round(100 * (js.reduce((s, j) => s + j.actualHrs, 0) || 10) / (js.reduce((s, j) => s + j.budgetHrs, 0) || 10)), visits: 20 + hs(g) % 140 }; });
  const cols = [{ k: 'g', label: esc(grp) }].concat(on.map(([kk, l]) => ({ k: { 'rb.m1': 'rev', 'rb.m2': 'gm', 'rb.m3': 'hrs', 'rb.m4': 'visits' }[kk], label: l, n: true, fmt: v => kk === 'rb.m1' ? h.mask(c, 'price', money(v)) : kk === 'rb.m2' ? h.mask(c, 'margin', v + '%') : kk === 'rb.m3' ? h.mask(c, 'budget_hours', v + '%') : num(v) })));
  const saved = [['Job cost by phase', 'Weekly, Mon 7:00', 'Owner, ops'], ['AR aging with notes', 'Daily', 'Office'], ['Chemical applications by applicator', 'Monthly', 'Owner']];
  return h.page({ title: 'Report builder', tags: h.tag('V1'), sub: 'Certified metrics only; anything new is labeled exploratory (18 §4.5)', actions: writes(c, 'dashboard') ? tbtn('Save report', 'Report saved to Reports.', { kind: 'primary' }) + tbtn('Schedule delivery', 'Scheduled: Mondays 7:00 am to you as CSV and PDF.', { icon: 'mail' }) : roPill(c, 'dashboard') })
    + h.cols('12', [
      sec('Build', h.field('Data source', h.select(['Jobs', 'Visits', 'Invoices', 'Time entries', 'Leads and opportunities'], src, { ui: 'rb.src' })) + `<div class="fld"><span>Metrics</span><div class="stack8">${metrics.map(([kk, l, d]) => tg(esc(l), kk, d)).join('')}</div></div>` + h.field('Group by', h.select(['Service line', 'Crew', 'Month'], grp, { ui: 'rb.grp' })) + h.field('Filter', h.select(['This season', 'Last 90 days', 'Last year'], 'This season')) + h.note('Margin and cost columns follow your field-class visibility.')),
      sec('Preview', on.length ? h.table(cols, rows, { dense: true }) + h.colchart(rows.map(r => r.g.slice(0, 10)), [{ values: rows.map(r => r.rev), cls: 'c1' }], { money: true, h: 130 }) : h.empty('Pick at least one metric.'), { sub: esc(src) + ' · ' + esc(grp) }),
    ])
    + sec('Saved and scheduled', h.table([{ k: 0, label: 'Report' }, { k: 1, label: 'Delivery' }, { k: 2, label: 'Recipients' }], saved, { dense: true }), { flush: true, sub: 'Scheduled delivery ships at MVP for standard reports' });
});

RL.screen('web.benchmarks', (c) => {
  const t = c.t, rev = c.D.kpi.revenueLY;
  const band = rev < 5e5 ? 'under $500k' : rev < 1e6 ? '$500k-1M' : rev < 2.5e6 ? '$1-2.5M' : rev < 5e6 ? '$2.5-5M' : rev < 1e7 ? '$5-10M' : '$10M+';
  const mix = t.revenue_mix || {};
  const arche = (mix.installs || 0) >= 50 ? 'Design/build-led' : (mix.lawn_programs || 0) >= 50 ? 'Lawn/PHC applicator' : ((mix.maintenance || 0) + (mix.commercial_maintenance || 0)) >= 60 ? 'Maintenance-led' : (mix.snow || 0) >= 25 ? 'Snow-heavy' : 'Full-service mixed';
  const optIn = h.on('bm.in', true);
  const n = 23 + hs(t.id) % 20;
  const rows = [['Gross margin %', c.D.kpi.gm, 36, 41, 46, 'margin', '%'], ['Revenue per man-hour', 58, 49, 55, 63, 'price', '$'], ['Labor % of revenue', 31, 36, 33, 29, 'cost', '%'], ['DSO (days)', 34, 47, 38, 29, null, ''], ['Agreement renewal rate', 86, 74, 81, 88, null, '%'], ['Close rate (value)', c.D.kpi.closeRate, 31, 38, 47, null, '%']];
  const fmt = (v, u) => u === '$' ? '$' + v : v + u;
  const lowerBetter = l => /Labor|DSO/.test(l);
  const pctile = (r) => { const [l, v, p25, p50, p75] = r; const lb = lowerBetter(l); const s = lb ? -1 : 1; const x = s * (v - p50) / Math.max(1, Math.abs(p75 - p50)); return Math.max(5, Math.min(95, Math.round(50 + x * 25))); };
  return h.page({ title: 'Peer benchmarks', tags: h.tag('V1'), sub: `Peers: Great Lakes and Ohio Valley · ${esc(band)} · ${esc(arche)} (n = ${n}) · Q${c.winter ? 4 : 1} ${c.winter ? 2026 : 2027}`, actions: isOwner(c) ? tg('Contribute and compare', 'bm.in', true) : '' })
    + (optIn ? h.table([
      { k: 0, label: 'Metric' }, { k: 1, label: 'You', n: true, fmt: (v, r) => `<b>${r[5] ? h.mask(c, r[5], fmt(v, r[6])) : fmt(v, r[6])}</b>` },
      { k: 2, label: 'P25', n: true, fmt: (v, r) => fmt(v, r[6]) }, { k: 3, label: 'Median', n: true, fmt: (v, r) => fmt(v, r[6]) }, { k: 4, label: 'P75', n: true, fmt: (v, r) => fmt(v, r[6]) },
      { k: 0, label: 'Your rank', fmt: (v, r) => { const p = pctile(r); return `<span class="flex nw">${mini(p, 100, p >= 75 ? '' : p >= 50 ? 'info' : 'warn')}<span class="tiny nowrap">${p}th</span></span>`; } },
      { k: 0, label: 'Quartile', fmt: (v, r) => { const p = pctile(r); return h.pill(p >= 75 ? 'Top' : p >= 50 ? 'Second' : p >= 25 ? 'Third' : 'Bottom', p >= 75 ? 'ok' : p >= 50 ? 'info' : 'warn'); } },
      { k: 0, label: '', fmt: (v, r) => isOwner(c) ? tbtn('Set goal to P75', `Goal for ${v} set to the cohort P75.`, { sm: true }) : '' },
    ], rows, { dense: true }) + h.cols('2', [sec('Privacy rules', h.list([{ icon: 'shield', title: 'At least 10 companies per published cell', sub: 'Otherwise the view falls back to a broader cohort and says so' }, { icon: 'users', title: 'P25, median and P75 only; P10 and P90 when n is 30 or more', sub: 'No minimums, maximums or small-cell means' }, { icon: 'lock', title: 'No client, property, employee or transaction data leaves your Company', sub: 'Quarterly batch; no on-demand recomputation' }]), { flush: true }), sec('Biggest gaps to median', h.list([{ icon: 'arrow-r', tone: 'warn', title: 'DSO 34 days vs 38: strength', sub: 'Autopay share ' + c.D.kpi.autopayPct + '%' }, { icon: 'arrow-r', tone: 'info', title: 'Renewal rate 86% vs 81%: strength', sub: 'Renewal desk in Sales' }]), { flush: true })])
      : h.card({ title: 'Benchmarks are opt-in', body: `<p class="small t2">Turn on "Contribute and compare" to share pseudonymized, aggregate metrics and see where ${esc(t.name)} stands. You can turn it off any time; it takes effect at the next quarterly release.</p>` }));
});

RL.screen('web.forecasts', (c) => {
  const k = c.D.kpi;
  const rain = h.on('fc.rain', false), late = h.on('fc.late', false), buy = h.on('fc.buy', false);
  const wk = Array.from({ length: 13 }, (_, i) => i + 1);
  const start = k.cash;
  const base = c.winter ? [-.08, -.10, -.06, -.12, -.05, -.09, -.04, .03, -.10, .06, .04, .12, .15] : [.10, -.18, .12, -.15, .08, -.32, .14, -.12, .16, -.10, .18, -.08, .15];
  const flow = base.map((f, j) => { const i = j + 1; let v = f * start; if (rain && (c.winter ? i >= 12 : i === 3 || i === 4)) v -= start * .09; if (late && i >= 2 && i <= 6) v -= start * .03; if (late && i === 7) v += start * .15; if (buy && i === (c.winter ? 10 : 3)) v -= 68000; return v; });
  let bal = start; const ends = flow.map(v => (bal += v, Math.max(0, Math.round(bal))));
  const low = Math.min(...ends), lowWk = ends.indexOf(low) + 1;
  const thr = Math.round(start * (c.winter ? .35 : .6) / 1000) * 1000;
  const labels = wk.map(i => 'W' + i);
  const cap = [['Maintenance', c.winter ? 320 : 1540, c.winter ? 180 : 1610], ['Installs', c.winter ? 160 : 720, c.winter ? 90 : 860], ['Lawn applications (licensed)', c.winter ? 0 : 260, c.winter ? 0 : 300], ['Irrigation', c.winter ? 40 : 210, c.winter ? 10 : 190]];
  const fmt = v => h.mask(c, 'client_financial', h.kmoney(v));
  return h.page({ title: '13-week forecasts', tags: h.tag('V1'), sub: `Cash and capacity · re-runs nightly and on material events · backtest error 6.8% (MAPE)`, actions: tbtn('Export', 'Forecast exported to CSV.', { icon: 'download' }) })
    + (low < thr ? bnr(`${icon('warn')} Low point ${fmt(low)} in week ${lowWk} is under your ${fmt(thr)} threshold. Levers: speed up collections, move a purchase, draw on the line of credit.`, 'warn') : '')
    + h.kpis([{ label: 'Opening cash', value: fmt(start), delta: 'Reconciled bank + Stripe in transit' }, { label: 'Low point (P50)', value: fmt(low), delta: 'Week ' + lowWk, tone: low < thr ? 'warn' : 'ok' }, { label: 'Week 13 (P50)', value: fmt(ends[12]), delta: `P10 ${fmt(Math.round(ends[12] * .82))} · P90 ${fmt(Math.round(ends[12] * 1.14))}` }, { label: 'Scenarios on', value: [rain, late, buy].filter(Boolean).length }])
    + h.cols('21', [sec('Weekly ending cash', h.colchart(labels, [{ values: ends, cls: low < thr ? 'c3' : 'c1' }], { money: true, line: ends.map(() => thr), label: '13-week cash forecast' }) + `<div class="flex tiny t3"><span>Bars: P50 ending cash</span><span>Dashed line: your low-cash threshold</span></div>`),
      sec('Scenarios', `<div class="stack8">${tg('Lose 2 weeks to rain in ' + (c.winter ? 'April' : 'May'), 'fc.rain', false)}${tg('Biggest commercial client pays 30 days late', 'fc.late', false)}${tg('Buy a $68,000 skid steer', 'fc.buy', false)}</div>` + h.note('Inflows use each client\'s predicted payment date; outflows use payroll, AP due dates and recurring expenses (18 §4.9.1).'))])
    + sec('Capacity: next 13 weeks', h.table([{ k: 0, label: 'Division' }, { k: 1, label: 'Available hours', n: true, fmt: v => num(v) }, { k: 2, label: 'Demand hours', n: true, fmt: v => num(v) }, { k: 0, label: 'Gap', n: true, fmt: (v, r) => { const g = r[1] - r[2]; return g < 0 ? h.pill(num(g) + ' h', 'danger') : h.pill('+' + num(g) + ' h', 'ok'); } }], cap, { dense: true }) + h.aiCard({ agent: 'Copilot', level: 'L1', credits: 1, title: c.winter ? 'Hire 3 seasonal technicians to start by Mar 15' : 'Add a Saturday install shift for 4 weeks or sub out 140 hours of pavers', why: 'Demand includes scheduled visits, backlog and weighted pipeline hours.' }), { flush: false });
});

// =====================================================================
// AUTOMATIONS AND AGENTS (17)
// =====================================================================
const RULES = [
  ['R3', 'Speed-to-lead', 'lead.created', 'Run Lead Follow-up; if no reply in 15 min, push to the office', 'MVP', 340],
  ['R6', 'Invoice reminder ladder', 'invoice.overdue', 'Reminders at 3, 10 and 21 days', 'MVP', 0],
  ['R4', 'On the way and visit done messages', 'visit.started', 'SMS with ETA; visit report with photos when done', 'MVP', 0],
  ['R5', 'Review request (uniform eligibility)', 'job.completed', 'Wait 2 h, send review request, one reminder after 3 days', 'MVP', 0],
  ['R17', 'New client welcome', 'agreement.activated', 'Welcome email, portal invite, crew intro photo', 'MVP', 0],
  ['R1', 'Proposal approved: kick off the job', 'proposal.approved', 'Create job, request deposit, draft POs, schedule task', 'MVP', 0],
  ['R2', 'Deposit chaser', 'proposal.approved', 'Wait 2 days; SMS; wait 3 days; task for the estimator', 'MVP', 0],
  ['R18', 'Failed payment recovery', 'payment.failed', 'SMS and email with an update-card link', 'MVP', 0],
  ['R19', 'Complaint recovery', 'message.received', 'AI classify complaint; task to ops (2 h SLA); pause marketing', 'MVP', 120],
  ['R20', 'Unsigned proposal nudge', 'proposal.viewed', 'After 3 days unsigned: estimator task and optional nudge', 'MVP', 0],
];
const RECIPES = [['R8', 'Spring cleanup campaign', 'Feb 15 cron', 'MVP'], ['R10', 'Irrigation start-up scheduling', 'After last average frost', 'MVP'], ['R12', '5-step fertilizer program', 'Agreement rounds', 'MVP'], ['R7', 'Seasonal agreement renewal', '60 days before end', 'V1'], ['R11', 'Irrigation winterization', 'Low of 28°F forecast', 'V1'], ['R15', 'Job cost overrun alert', 'Labor 10% over at phase', 'V1'], ['R16', 'Certification expiry', '60 days before expiry', 'V1'], ['R21', 'Low inventory reorder', 'Below reorder point', 'V1'], ['R25', 'Rain-day protocol', 'Forecast threshold', 'V1']];
const ruleLimit = c => c.planCode === 'starter' ? 5 : c.planCode === 'grow' ? 50 : null;
const ruleOn = (c, id, i) => { const v = RL.ui['au.on.' + id]; if (v != null) return v === '1'; return c.planCode === 'starter' ? i < 5 : i !== 9; };
const activeRules = c => RULES.filter((r, i) => ruleOn(c, r[0], i)).length;
RL.act('au-toggle', (el, ev, c) => {
  const id = el.dataset.x, i = RULES.findIndex(r => r[0] === id), on = ruleOn(c, id, i), lim = ruleLimit(c);
  if (!on && lim != null && activeRules(c) >= lim) { RL.toast(`${lim} of ${lim} rules active on ${c.plan.name}. Turn one off${c.role === 'owner' ? ' or upgrade' : ', or ask ' + c.owner + ' to upgrade'}.`); return false; }
  RL.ui['au.on.' + id] = on ? '0' : '1';
});
RL.act('au-install', (el, ev, c) => { const lim = ruleLimit(c); if (lim != null && activeRules(c) >= lim) { RL.toast(`Installed as off: ${lim} of ${lim} rules already active on ${c.plan.name}.`); return false; } RL.toast(`Recipe ${el.dataset.x} installed and turned on.`); return false; });

RL.screen('web.automations', (c, a) => {
  const tab = h.tab('au.tab', 'rules'), lim = ruleLimit(c), act = activeRules(c), can = writes(c, 'automation');
  const nl = RL.ui['au.nl'] === '1';
  let body;
  if (tab === 'rules') body = h.table([
    { k: 0, label: '', fmt: (v, r) => { const on = ruleOn(c, v, RULES.indexOf(r)); return can ? `<button type="button" ${TGL_STYLE} class="tgl${on ? ' on' : ''}" data-act="au-toggle" data-x="${v}" aria-pressed="${on}" aria-label="${on ? 'Turn off' : 'Turn on'} ${esc(r[1])}"><i></i></button>` : h.pill(on ? 'On' : 'Off', on ? 'ok' : ''); } },
    { k: 1, label: 'Rule', fmt: (v, r) => `<b>${esc(v)}</b> <span class="tiny t3 mono">${r[0]}</span><div class="tiny t3">${esc(r[3])}</div>` },
    { k: 2, label: 'Trigger', m: true },
    { k: 5, label: 'AI credits / mo', n: true, fmt: v => v ? `${h.ai('')} about ${num(Math.round(v * Math.min(1, (c.plan.ai_credits || 2000) / 2000) / 10) * 10 || 10)}` : '<span class="t3">0</span>' },
    { k: 0, label: 'Runs (30 d)', n: true, fmt: (v, r) => ruleOn(c, v, RULES.indexOf(r)) ? num((hs(v + c.t.id) % (c.winter ? 60 : 400)) + (c.winter ? 3 : 40)) : '<span class="t3">-</span>' },
  ], RULES, { dense: true });
  else if (tab === 'recipes') body = h.table([{ k: 0, label: '#', m: true }, { k: 1, label: 'Recipe' }, { k: 2, label: 'Trigger' }, { k: 3, label: 'Scope', fmt: v => h.tag(v) }, { k: 0, label: '', fmt: (v, r) => can && (r[3] === 'MVP' || c.inLens(r[3])) ? h.btn('Install', { sm: true, act: 'au-install', x: v }) : '' }], RECIPES, { dense: true }) + h.note('Recipes are curated by Rootline and stay editable after install (17 §4.6.6).');
  else body = h.table([{ k: 0, label: 'When' }, { k: 1, label: 'Rule' }, { k: 2, label: 'Record', m: true }, { k: 3, label: 'Result', fmt: v => statusPill(v) }, { k: 4, label: 'Credits', n: true }],
    [[c.today.short + ' 7:42', 'Speed-to-lead', c.D.leads[0].id, 'Done', '3'], [c.today.short + ' 7:15', 'On the way message', c.D.visits[3] ? c.D.visits[3].id : 'V-1', 'Done', '0'], [c.today.short + ' 6:00', 'Invoice reminder ladder', c.D.invoices[3].id, 'Waiting for approval', '0'], [past(c)[0] + ' 21:10', 'Review request', c.D.jobs[3].id, 'Skipped: quiet hours, retry 8:00', '0'], [past(c)[0] + ' 15:02', 'Complaint recovery', 'MSG-8812', 'Done', '1'], [past(c)[1] + ' 9:30', 'Deposit chaser', c.D.proposals[1].id, 'Failed: no mobile number', '0']], { dense: true }) + h.note('Each run keeps its trigger record, steps, approvals and credit cost. Runs are idempotent and retried with backoff (17 §4.6.4).');
  return h.page({ title: 'Automations', sub: `${act} rules active${lim != null ? ` of ${lim} on ${esc(c.plan.name)}` : ' · unlimited on ' + esc(c.plan.name)}`, actions: can ? h.btn('New rule', { kind: 'primary', icon: 'plus', ui: 'au.tab', val: 'rules' }) : roPill(c, 'automation') })
    + (lim != null ? `<div class="cd"><div class="cd-b">${h.meter('Active rules on ' + esc(c.plan.name), act, lim)}${act >= lim ? `<div class="small">${h.pill(`${act} of ${lim} rules active`, 'warn')} ${isOwner(c) ? 'Grow allows 50 rules; Pro is unlimited. ' + h.btn('Compare plans', { sm: true, go: 'web.settings.subscription' }) : ask(c)}</div>` : ''}</div></div>` : '')
    + (can ? sec('Describe an automation', h.textarea(RL.ui['au.text'] || 'When a client cancels their maintenance agreement, ask why with a one-question survey, then tell me if they say price.', { ui: 'au.text', label: 'Automation in plain words' }) + `<div class="flex">${h.btn(nl ? 'Redraft' : 'Draft automation', { kind: 'ai', icon: 'spark', ui: 'au.nl', val: '1' })}<span class="tiny t3">1 credit · creates an inactive draft you review</span></div>`
      + (nl ? h.aiCard({ agent: 'Copilot', level: 'L2', credits: 1, title: 'Draft: Cancellation reason survey', body: h.steps(['Trigger: agreement.cancelled', 'Send survey (SMS or email)', 'AI step: classify answer (price, quality, moving, other)', 'If price: notify owner', 'Else: log reason'], 5), why: 'About 6 runs per month, about 6 credits. The AI step output is data: it feeds the condition, it cannot choose actions (17 §4.6.7).', actions: tbtn('Save as draft (off)', 'Saved as an inactive draft. Turn it on from the rule list.', { sm: true, kind: 'primary' }) + h.btn('Discard', { sm: true, ui: 'au.nl', val: '0' }) }) : ''), { tone: 'ai' }) : '')
    + h.tabs('au.tab', [['rules', 'Rules', RULES.length], ['recipes', 'Recipe library', RECIPES.length], ['runs', 'Run history']], 'rules') + body;
});

const AGENTS_V1 = [['A8', 'Bookkeeping', 'L2', 'Bank feed sync', 2], ['A9', 'AP (bills)', 'L2', 'Per bill page', 2], ['A13', 'Renewal', 'L2', '60 days before end', 6], ['A17', 'Timesheet Anomaly', 'L2', 'Daily before export', 0.5], ['A21', 'Procurement', 'L2', 'Job created', 4]];
const TIER = { A1: 'T0', A2: 'T1', A3: 'T3', A4: 'T1', A5: 'T3', A6: 'T1', A7: 'T2', A8: 'T2', A9: 'T2', A13: 'T3', A17: 'T1', A21: 'T2', A18: 'T3' };
RL.screen('web.agents', (c) => {
  const D = c.D, can = writes(c, 'ai_agent.configure'), cr = credits(c), v1 = c.feat('agents_v1');
  const mvp = D.agents.filter(x => !/V1/.test(x.name)).concat([{ id: 'A18', name: 'Review and Reputation', level: 'L2', cadence: 'Job completed', credits: 1 }]);
  const v1list = D.agents.filter(x => /V1/.test(x.name)).map(x => ({ id: x.id, name: x.name.replace(' (V1)', ''), level: x.level, cadence: x.cadence, credits: x.credits })).concat(AGENTS_V1.map(([id, name, level, cadence, credits]) => ({ id, name, level, cadence, credits })));
  const v1ok = v1.s === 'Y' || v1.s === 'L', v1cap = v1.s === 'L' ? 3 : null;
  const capOf = (ag, i) => Math.round((cr.inc || 300) * [0.04, .1, .15, .08, .05, .12, .1, .05, .08, .04, .05, .06, .05][i % 13] / 10) * 10;
  const row = (ag, i, isV1) => {
    const lv = RL.ui['ag.lv.' + ag.id] || ag.level;
    const locked = isV1 && (!v1ok || (v1cap != null && i >= v1cap));
    const cap = capOf(ag, i), used = Math.round(cap * (.2 + (hs(ag.id) % 60) / 100));
    const maxL = TIER[ag.id] === 'T0' ? 'L4' : TIER[ag.id] === 'T3' ? 'L3' : 'L4';
    const opts = ['L0', 'L1', 'L2', 'L3', 'L4'].filter(l => l <= maxL).map(l => [l, l + ' ' + { L0: 'Off', L1: 'Suggest', L2: 'Approve', L3: 'Act + notify', L4: 'Autonomous' }[l]]);
    return { id: ag.id, name: ag.name, isV1, locked, cad: ag.cadence, cost: ag.credits, lv, cap, used, opts, tier: TIER[ag.id] || 'T1' };
  };
  const rows = mvp.map((x, i) => row(x, i, false)).concat(v1list.map((x, i) => row(x, i, true)));
  const sel = rows.find(r => r.id === RL.ui['ag.sel']) || rows[0];
  const done = String(RL.ui['ag.done'] || '').split(',');
  const inv = D.invoices.find(x => x.status === 'Overdue') || D.invoices[0];
  const inbox = [
    { id: 'q1', agent: 'Collections reminders (A5)', title: `Send a payment reminder to ${esc(inv.client)}, ${money(inv.balance)}, overdue`, body: '“Hi, a friendly reminder that invoice ' + esc(inv.id) + ' is past due. You can pay securely here: {link}. Reply with any questions.”', conf: 'High: matches the reminder template, no open dispute', cr: 1, lv: 'L2' },
    { id: 'q2', agent: 'Lead Follow-up (A3)', title: `Reply to ${esc(D.leads[0].name)} and offer a site visit ${c.winter ? 'Thu Jan 14 at 10:00' : 'Thu May 13 at 10:00'}`, body: `“Thanks for reaching out about ${esc(D.leads[0].service.toLowerCase())}. ${esc((c.t.cast && c.t.cast.estimator) || c.owner)} can stop by Thursday at 10. Does that work?”`, conf: 'Medium: slot from the estimator\'s calendar', cr: 4, lv: 'L2' },
    { id: 'q3', agent: 'Estimating from notes (A6)', title: `Draft estimate for ${esc(D.opps[1].client)} from a voice memo`, body: '14 lines mapped to the Price Book; 2 lines need a quantity.', conf: 'Low: 2 quantities guessed', cr: 8, lv: 'L2' },
  ].filter(q => !done.includes(q.id));
  return h.page({ title: 'AI agents', sub: `${rows.filter(r => !r.locked && r.lv !== 'L0').length} agents on · ${num(cr.used)} of ${num(cr.inc)} credits used this month`, actions: roPill(c, 'ai_agent.configure') + (isOwner(c) ? h.btn('Credits and caps', { go: 'web.settings.subscription' }) : '') })
    + sec('Roster', h.table([
        { k: 'name', label: 'Agent', fmt: (v, r) => `<b>${esc(v)}</b> <span class="tiny t3 mono">${r.id} · ${r.tier}</span>${r.isV1 ? ' ' + h.tag('V1') : ''}<div class="tiny t3">${esc(r.cad)} · ${r.cost} cr per run</div>` },
        { k: 'lv', label: 'Autonomy', fmt: (v, r) => r.locked ? lockPill(v1ok ? 'Grow: 3 V1 agents' : 'Grow and Pro') : can ? h.select(r.opts, v, { ui: 'ag.lv.' + r.id, label: 'Autonomy for ' + r.name }) : h.pill(esc(v), 'ai') },
        { k: 'cap', label: 'Cap / mo', n: true, fmt: (v, r) => r.locked ? '-' : num(v) },
        { k: 'used', label: 'Used', n: true, fmt: (v, r) => r.locked ? '-' : `<span class="flex nw">${mini(v, r.cap, v / r.cap > .8 ? 'warn' : 'ai')}<span class="tiny">${num(v)}</span></span>` },
        { k: 'id', label: '', fmt: (v, r) => r.locked ? '' : h.btn('Log', { sm: true, ui: 'ag.sel', val: v, kind: sel.id === v ? 'primary' : 'ghost' }) },
      ], rows, { dense: true }) + h.note(`L0 off, L1 suggest, L2 draft and approve, L3 act and notify (5-minute undo), L4 autonomous within budget. External or money actions (T3) stop at L3; card charges and signatures (T4) are never done by AI (17 §4.1.2, §4.3).${v1.s === 'L' ? ' Grow includes up to 3 V1 agents.' : v1.s === '-' ? ' V1 agents are not available on ' + esc(c.plan.name) + '.' : ''}`), { flush: true })
    + h.cols('2', [sec(`Approval inbox <span class="tiny t3">${inbox.length}</span>`, inbox.length ? inbox.map(q => h.aiCard({ agent: q.agent, level: q.lv, credits: q.cr, title: q.title, body: `<div class="small">${q.body}</div><div class="tiny t3">Confidence: ${esc(q.conf)}</div>`, actions: can ? h.btn('Approve', { sm: true, kind: 'primary', act: 'ag-done', x: q.id }) + h.btn('Edit', { sm: true, act: 'ag-done', x: q.id }) + h.btn('Reject', { sm: true, act: 'ag-done', x: q.id }) : '<span class="tiny t3">Routed to people who can approve</span>' })).join('') : h.empty('Inbox zero. Items unhandled for 24 hours escalate to the owner.')),
      sec(`Run log: ${esc(sel.name)}`, h.timeline([{ when: c.today.short + ' 6:15', text: `Ran · ${sel.cost} cr · ${sel.lv}`, tone: 'ai' }, { when: past(c)[0] + ' 6:15', text: `Ran · ${sel.cost} cr · 1 item approved`, tone: 'ok' }, { when: past(c)[1] + ' 6:15', text: 'Skipped: daily cap reached', tone: 'warn' }])),
    ]);
});
RL.act('ag-done', (el) => { const cur = String(RL.ui['ag.done'] || '').split(',').filter(Boolean); cur.push(el.dataset.x); RL.ui['ag.done'] = cur.join(','); RL.toast('Done. Your decision feeds this Company\'s examples, not model training.'); });

// =====================================================================
// SETTINGS (21 §5.2; 02 §7.2, §7.6; 22 §4, §9)
// =====================================================================
const fx = (c, cap) => (label, value, hint, o) => h.field(label, h.input(value, Object.assign({ ro: !writes(c, cap) }, o || {})), hint);
const sx = (c, cap) => (label, opts, value, hint) => h.field(label, writes(c, cap) ? h.select(opts, value) : h.input(value, { ro: true }), hint);
const saveBar = (c, cap, msg) => writes(c, cap) ? `<div class="flex">${tbtn('Save changes', msg || 'Saved. The change is recorded in the audit log.', { kind: 'primary' })}<span class="tiny t3">Changes are audited with who, when and the old value.</span></div>` : h.note(`Read only for ${esc(c.roleObj.name)} (${esc(c.can(cap))}). ${ask(c)}`);
const tz = c => ({ IL: 'America/Chicago (Central)', WI: 'America/Chicago (Central)', MI: 'America/Detroit (Eastern)', IN: 'America/Indiana/Indianapolis (Eastern)' }[stateOf(c)] || 'America/New_York (Eastern)');
const domainOf = c => (c.t.brand.portal.match(/portal\.([a-z]+)\.example/) || [])[1] ? c.t.brand.portal.replace(/^portal\./, '') : c.t.id + '.example';

RL.screen('web.settings.company', (c) => {
  const f = fx(c, 'company.settings'), s = sx(c, 'company.settings'), t = c.t, st = stateOf(c);
  const multi = c.feat('multi_branch');
  const locs = t.branches.map((b, i) => ({ name: b + (i === 0 ? ' (main)' : ''), addr: `${1200 + i * 340} Industrial Pkwy, ${b}`, type: i === 0 ? 'Office and yard' : 'Branch yard', crews: c.D.crews.filter(cr => cr.branch === b).length }));
  return h.page({ title: 'Company profile and locations', sub: `${esc(t.name)} · ${esc(t.city)} · ${esc(c.seg.name)}`, actions: roPill(c, 'company.settings') })
    + h.cols('2', [
      sec('Profile', `<div class="cols cols-2">${f('Legal name', t.name.replace(' Co.', ' Company LLC'))}${f('Doing business as', t.name)}${h.field('EIN', `<span class="inp ro">${h.mask(c, 'vendor_banking', '<span class="mono">••-•••4410</span>')}</span>`, 'Shown after step-up to owner and bookkeeper')}${f('Main phone', '(614) 555-0142')}${f('Website', 'https://' + domainOf(c))}${f('Billing email', 'billing@' + domainOf(c))}</div>` + h.field('Logo', `<span class="flex"><span class="logo" style="width:34px;height:34px;border-radius:8px;display:grid;place-items:center;color:#fff;font-weight:800;background:${esc(t.brand.color)}">${esc(t.brand.logo)}</span>${writes(c, 'company.settings') ? tbtn('Replace', 'Logo uploaded; portal and documents update.', { sm: true, icon: 'upload' }) : ''}</span>`)),
      sec('Regional and fiscal', `<div class="cols cols-2">${s('Time zone', [tz(c)], tz(c))}${s('Week starts', ['Sunday', 'Monday'], 'Sunday')}${s('Fiscal year starts', ['January', 'April', 'October'], 'January', c.role === 'bookkeeper' ? 'Bookkeepers read fiscal and tax settings' : '')}${s('Accounting basis', ['Accrual', 'Cash'], 'Accrual')}${f('Sales tax registration', st + ' vendor license ' + h.esc('•••• 2291'))}${s('Units', ['Imperial (ft, sq ft, gal)', 'Metric'], 'Imperial (ft, sq ft, gal)')}${s('Default language for crews', ['Spanish', 'English'], 'Spanish')}${f('Plant region', t.region)}</div>`),
    ])
    + sec('Locations and branches', h.table([{ k: 'name', label: 'Location' }, { k: 'addr', label: 'Address' }, { k: 'type', label: 'Type' }, { k: 'crews', label: 'Crews', n: true }], locs, { dense: true })
      + `<div class="flex">${multi.s === 'Y' ? (writes(c, 'company.settings') ? h.btn('Add branch', { sm: true, icon: 'plus', act: 'more-toast' }) : '') + h.tag('V1') + '<span class="tiny t3">Branches with their own numbering, price books and P&L (Pro).</span>' : lockPill('Multiple branches: Pro') + '<span class="tiny t3">One location with yard and trucks is included in every plan.</span>'}</div>`, { flush: false })
    + sec('Business hours and service area', `<div class="cols cols-3">${f('Office hours', 'Mon-Fri 7:00-5:00')}${f('Field hours', 'Mon-Sat 6:30-6:00')}${f('Service radius', '25 mi from ' + t.branches[0])}</div>` + saveBar(c, 'company.settings'));
});

const SEAT_OF = { owner: 'office', office_manager: 'office', estimator: 'office', designer: 'office', ops_manager: 'office', crew_lead: 'field', technician: 'field', bookkeeper: 'free', subcontractor: 'free', observer: 'free' };
const GRANTS = [['estimate.update:own', 'Estimates: update own', 'office'], ['invoice.create', 'Invoices: create', 'office'], ['campaign.send', 'Marketing: send campaigns', 'office'], ['design.edit', 'Design Studio: edit', 'designer'], ['visit.complete:crew', 'Visits: complete for crew', 'field'], ['timesheet.approve:crew', 'Timesheets: first-level approval', 'field'], ['dashboard.read', 'Dashboards: read only', 'free']];
RL.screen('web.settings.users', (c, a) => {
  const D = c.D, S = seats(c), can = writes(c, 'role');
  const tab = h.tab('su.tab', 'editor');
  const allUsers = roster(c).filter(p => p.status !== 'Hibernated'), users = allUsers.slice(0, 12);
  const lim = c.feat('custom_roles'), cap = lim.s === 'L' ? 2 : null;
  const custom = [['Crew Lead - Irrigation', 'crew_lead', 3, 'field'], ['Account manager (commercial)', 'ops_manager', 1, 'office']].slice(0, cap == null ? 2 : Math.min(2, cap));
  const field = D.people.filter(p => p.seat === 'field');
  const who = RL.ui['su.user'] || (c.t.cast && c.t.cast.crew_lead) || (field[0] || D.people[0]).name;
  const person = D.people.find(p => p.name === who) || field[0] || D.people[0];
  const g = GRANTS.find(x => x[0] === (RL.ui['su.perm'] || 'estimate.update:own')) || GRANTS[0];
  const curSeat = SEAT_OF[person.role] || 'office';
  const first = person.name.split(' ')[0];
  const rank = { free: 0, field: 1, office: 2, designer: 3 };
  const nextSeat = rank[g[2]] > rank[curSeat] ? g[2] : curSeat;
  let effect;
  if (nextSeat === curSeat) effect = `Giving ${esc(first)} <span class="mono">${esc(g[0])}</span> keeps ${esc(first)} on a ${curSeat} seat. No billing change.`;
  else if (nextSeat === 'office') effect = `Giving ${esc(first)} <span class="mono">${esc(g[0])}</span> makes ${esc(first)} an office seat ` + (S.inc.office != null && S.office < S.inc.office ? `(fills an included seat: ${S.office + 1} of ${S.inc.office} on ${esc(c.plan.name)}, no extra charge)` : `(<b>${money(S.ex.office)}/month on ${esc(c.plan.name)}</b>, you use ${S.office} of ${S.inc.office} included)`) + (curSeat === 'field' ? ' and frees one active field seat.' : '.');
  else if (nextSeat === 'designer') effect = `Giving ${esc(first)} <span class="mono">${esc(g[0])}</span> adds a designer entitlement on top of an office seat (${S.designers < S.inc.designer ? 'included' : money(S.ex.designer || 79) + '/month'}).`;
  else effect = `Giving ${esc(first)} <span class="mono">${esc(g[0])}</span> makes ${esc(first)} a field seat, billed only in months when active.`;
  const fv = [['Price (sell prices, totals)', 'Locked by guardrail for field roles'], ['Cost (unit costs, burden)', ''], ['Margin', 'Locked by guardrail'], ['Budgeted hours', ''], ['Pay rates (others)', 'Own pay rate: Company setting'], ['Client contact (phone, email)', 'Masked calling and texting on'], ['Access secrets (gate codes)', 'Window: 60 min before and after the visit']];
  const fvOn = i => person.seat === 'field' ? [false, false, false, true, false, false, true][i] : [true, true, person.role === 'owner', true, false, true, true][i];
  let body;
  if (tab === 'users') body = h.table([
    { k: 'name', label: 'User', fmt: (v, r) => `<span class="flex nw">${h.avatar(v)}<b>${esc(v)}</b></span>` }, { k: 'role', label: 'Role', fmt: v => `<span class="mono tiny">${esc(v)}</span>` },
    { k: 'role', label: 'Seat (from permissions)', fmt: v => h.pill(SEAT_OF[v] || 'office', SEAT_OF[v] === 'free' ? 'ok' : SEAT_OF[v] === 'field' ? 'info' : '') }, { k: 'mfa', label: 'MFA' }, { k: 'status', label: 'Status', fmt: v => statusPill(v) },
  ], users, { dense: true }) + h.note(`${allUsers.length > users.length ? `Showing ${users.length} of ${allUsers.length}. ` : ""}Seat type comes from effective permissions, not the role name (22 §4.3).`);
  else if (tab === 'roles') body = h.table([{ k: 'name', label: 'Role' }, { k: 'key', label: 'Key', m: true }, { k: 'n', label: 'Users', n: true }, { k: 'seat', label: 'Seat', fmt: v => h.pill(esc(v), '') }, { k: 'kind', label: '', fmt: v => v === 'custom' ? h.pill('Custom', 'info') : '<span class="tiny t3">Built in</span>' }],
    Object.keys(SEAT_OF).filter(k2 => k2 !== 'observer' || c.inLens('V1')).map(k2 => ({ name: (I.ROLES[k2] || {}).name || k2, key: k2, n: D.people.filter(p => p.role === k2).length + (k2 === 'subcontractor' && c.t.cast && c.t.cast.subcontractor ? 1 : 0), seat: SEAT_OF[k2], kind: 'built-in' }))
      .concat(custom.map(([n, base, u, s]) => ({ name: n, key: 'custom: from ' + base, n: u, seat: s, kind: 'custom' }))), { dense: true })
    + `<div class="flex">${cap != null ? h.meter('Custom roles on ' + esc(c.plan.name), custom.length, cap) : h.pill('Unlimited custom roles on ' + esc(c.plan.name), 'ok')}${can ? (cap != null && custom.length >= cap ? tbtn('New custom role', `${cap} of ${cap} custom roles used on ${c.plan.name}.`, { disabled: true }) : h.btn('Clone a role', { sm: true, icon: 'copy', ui: 'su.tab', val: 'editor' })) : ''}</div>`;
  else body = h.cols('21', [
    sec(`Role editor: ${esc(person.name)} (${esc(person.role)})`, `<div class="cols cols-2">${h.field('User', h.select(D.people.slice(0, 14).map(p => [p.name, p.name + ' · ' + p.role]), person.name, { ui: 'su.user' }))}${h.field('Add permission', h.select(GRANTS.map(x => [x[0], x[1] + ' (' + x[0] + ')']), g[0], { ui: 'su.perm' }))}</div>`
      + bnr(`${icon(nextSeat === curSeat ? 'check' : 'dollar')} ${effect}`, nextSeat === curSeat ? 'info' : 'warn')
      + h.table([{ k: 0, label: 'Field visibility' }, { k: 1, label: 'Read', fmt: (v, r) => `<span class="tgl${fvOn(r[2]) ? ' on' : ''}" aria-hidden="true"><i></i></span>` }, { k: 1, label: 'Note', fmt: v => `<span class="tiny t3">${esc(v)}</span>` }], fv.map((r, i) => [r[0], r[1], i]), { dense: true })
      + `<div class="cols cols-2">${h.field('Purchase on the fly', h.input(person.seat === 'field' ? '$300' : '$2,500', { ro: !can }))}${h.field('Timesheet edit without approval', h.input('1.0 h', { ro: !can }))}</div>`
      + `<div class="flex">${can ? tbtn('Save', `Saved. ${first}'s seat ${nextSeat === curSeat ? 'is unchanged' : 'changes to ' + nextSeat} from today; billing is prorated.`, { kind: 'primary' }) : ''}${tbtn('View as this role', 'Opened a read-only preview as ' + person.role + '.', { icon: 'eye' })}<span class="tiny t3">Impact: 1 user</span></div>`),
    sec('Guardrails', h.list([{ icon: 'shield', title: 'Anti-escalation', sub: 'You can assign only roles whose grants are less than or equal to your own; ops managers assign field roles in their branch.' }, { icon: 'lock', title: 'Owner-only permissions', sub: 'Stripe connection, bank accounts, roles, subscription, data export.' }, { icon: 'eye', title: 'Field roles never see prices, costs or margins', sub: 'Locked in every custom role cloned from a field role.' }]) + (can ? '' : h.note(ask(c))), { flush: true }),
  ]);
  return h.page({ title: 'Users, roles and permissions', sub: `${allUsers.length} users · ${S.office} office seats · ${cap != null ? `${custom.length} of ${cap} custom roles on ${esc(c.plan.name)}` : custom.length + ' custom roles'}`, actions: (can ? h.btn('Invite user', { kind: 'primary', icon: 'plus', act: 'more-toast' }) : '') + roPill(c, 'role') })
    + h.tabs('su.tab', [['editor', 'Role editor'], ['roles', 'Roles', Object.keys(SEAT_OF).length + custom.length], ['users', 'Users', allUsers.length]], 'editor') + body;
});

RL.screen('web.settings.service_lines', (c) => {
  const t = c.t, can = writes(c, 'company.settings');
  // Module catalog from 14 §4.0.1 (tenants.json module_catalog); snow_ice_full is the paid add-on on top of Snow Lite
  const lines = [['core_maintenance', 'General maintenance', 'Mowing, pruning, cleanups, recurring visits and agreements', 'MVP', 'Always on'], ['install_projects', 'Install projects and hardscape', 'Phases, takeoffs, the 811 gate, warranties', 'MVP', null], ['lawn_phc', 'Lawn and Plant Health Care programs', 'Rounds, applications, chemical records', 'MVP', null], ['irrigation', 'Irrigation', 'Systems, start-ups, repairs, winterizations', 'MVP', null], ['commercial_grounds', 'Commercial grounds', 'SOW specs, quality audits, enhancement pipeline, property reports', 'MVP', null], ['seasonal_campaigns', 'Seasonal campaigns', 'Aeration, overseeding, cleanups, mulch season', 'MVP', null], ['snow_ice', 'Snow Lite', 'Storm visit logging, per-push invoices, proof PDF', 'MVP', 'Included in every plan'], ['snow_ice_full', 'Snow and Ice (full module)', 'Storm events, triggers, Storm Command Center', 'V1', 'snow_ice'], ['landscape_lighting', 'Landscape lighting', 'Fixtures, transformers, service plans', 'V1', null], ['holiday_lighting', 'Holiday lighting', 'Install, takedown and storage', 'V1', null], ['backflow', 'Backflow testing', 'Tests and municipal submission (needs irrigation)', 'V1', null], ['smart_irrigation', 'Smart irrigation', 'Controller integrations, water budgets, leak alerts', 'V1', null], ['mosquito_pest', 'Mosquito and pest', 'Mosquito, tick and perimeter programs', 'V1', null], ['tree_care', 'Tree care', 'Tree inventory, ISA risk, prescriptions, crane jobs', 'V2', 'tree_care']];
  const on = id => { const v = RL.ui['sl.' + id]; if (v != null) return v === 'true'; return id === 'snow_ice_full' ? c.has('snow_ice') : id === 'core_maintenance' || t.modules.includes(id); };
  return h.page({ title: 'Service lines and modules', sub: `${lines.filter(l => on(l[0])).length} enabled · modules a Company does not enable are hidden from navigation for everyone (21 §5.2)`, actions: roPill(c, 'company.settings') })
    + sec('', h.table([
      { k: 0, label: '', fmt: (v, r) => { const ad = r[4] && I.ADDONS[r[4]] ? I.ADDONS[r[4]] : null; const has = !ad || c.has(r[4]); return can && has && v !== 'core_maintenance' && (r[3] === 'MVP' || c.inLens(r[3])) ? tg('', 'sl.' + v, on(v)) : h.pill(on(v) ? 'On' : 'Off', on(v) ? 'ok' : ''); } },
      { k: 1, label: 'Service line', fmt: (v, r) => `<b>${esc(v)}</b> ${h.tag(r[3])}<div class="tiny t3">${esc(r[2])}</div>` },
      { k: 4, label: 'Price', fmt: v => !v ? '<span class="tiny t3">Included</span>' : !I.ADDONS[v] ? h.pill(v, 'ok') : `<span class="tiny">${esc(I.ADDONS[v].price)}</span>` },
      { k: 0, label: '', fmt: (v, r) => { if (!r[4] || r[4] === 'Included in every plan') return ''; if (on(v) || c.has(r[4])) return h.pill('Active', 'ok'); return isOwner(c) ? h.btn('Start 30-day trial', { sm: true, act: 'trial' }) : '<span class="tiny t3">Owner can add</span>'; } },
    ], lines, { dense: true }), { flush: true })
    + h.note('A paying Company can trial a module its plan does not include for 30 days, once per module. At expiry with open commitments (a live storm event, enrolled programs) the module winds down instead of switching off (22 §4.6).') + saveBar(c, 'company.settings');
});

RL.screen('web.settings.price_book', (c, a) => {
  const D = c.D, can = writes(c, 'price_book'), tab = h.tab('pb.tab', 'items');
  const lim = c.feat('estimating').s === 'L';
  const items = [['MAT-110', 'Shredded hardwood mulch', 'Material', 'cu yd', 28, 62], ['MAT-140', 'Paver, tumbled cobble', 'Material', 'sq ft', 4.1, 9.8], ['MAT-152', 'Polymeric sand', 'Material', 'bag', 24, 46], ['PL-1100', 'Little Lime Hydrangea #3', 'Plant', 'each', 21, 64], ['PL-1104', 'Purple Coneflower #1', 'Plant', 'each', 6.5, 18], ['LAB-01', 'Install labor', 'Labor', 'man-hour', 31.2, 68], ['LAB-04', 'Maintenance labor', 'Labor', 'man-hour', 27.4, 58], ['EQ-20', 'Zero-turn mower 60"', 'Equipment', 'hour', 9.8, 24], ['SUB-3', 'Excavation (sub)', 'Subcontract', 'job', 1800, 2340]];
  const rates = [['Mow and trim, open turf', '1,000 sq ft', '0.9 min', 'Company actuals (V1)'], ['Edge beds', '100 ln ft', '6 min', 'Default'], ['Install mulch by wheelbarrow', 'cu yd', '0.55 h', 'Company actuals (V1)'], ['Install pavers incl. base', '100 sq ft', '6.5 man-hours', 'Default'], ['Plant #3 shrub', 'each', '0.25 h', 'Default'], ['Core aeration', '1,000 sq ft', '1.4 min', 'Default']];
  const used = lim ? 186 : D.inventory.length * 40 + 312;
  let body;
  if (tab === 'items') body = h.table([
    { k: 0, label: 'Code', m: true }, { k: 1, label: 'Item' }, { k: 2, label: 'Type' }, { k: 3, label: 'Unit' },
    { k: 4, label: 'Cost', n: true, fmt: v => h.mask(c, 'cost', money(v, { cents: true })) }, { k: 5, label: 'Price', n: true, fmt: v => h.mask(c, 'price', money(v, { cents: true })) },
    { k: 4, label: 'Margin', n: true, fmt: (v, r) => h.mask(c, 'margin', Math.round(100 * (r[5] - v) / r[5]) + '%') },
  ], items, { dense: true });
  else if (tab === 'rates') body = h.table([{ k: 0, label: 'Task' }, { k: 1, label: 'Per' }, { k: 2, label: 'Rate', n: true, fmt: v => h.mask(c, 'budget_hours', esc(v)) }, { k: 3, label: 'Source', fmt: v => /V1/.test(v) ? `<span class="tiny">${esc(v.replace(' (V1)', ''))}</span> ${h.tag('V1')}` : `<span class="tiny t3">${esc(v)}</span>` }], rates, { dense: true }) + h.note('Production rates turn takeoff quantities into budget hours on estimates. The feedback loop from job actuals arrives at V1 (18 §4.4.4).');
  else if (tab === 'kits') body = h.list([{ icon: 'layers', title: 'Paver patio, per 100 sq ft', sub: 'Pavers 105 sq ft (5% waste), base 2.2 tons, sand 0.6 ton, edge restraint 40 ln ft, 6.5 man-hours', right: h.mask(c, 'price', money(2480)) }, { icon: 'layers', title: 'Foundation bed refresh, per 100 sq ft', sub: 'Mulch 0.9 cu yd, edging 40 ln ft, 6 shrubs #3, 2.5 man-hours', right: h.mask(c, 'price', money(890)) }, { icon: 'layers', title: 'Spring cleanup, standard lot', sub: 'Debris haul, bed cleanup, first mow, 3.5 man-hours', right: h.mask(c, 'price', money(385)) }]);
  else body = `<div class="cols cols-3">${fx(c, 'price_book')('Labor burden', '24%', 'Payroll taxes, workers comp, benefits')}${fx(c, 'price_book')('Overhead recovery', '$14.80 / man-hour', 'From the overhead budget')}${fx(c, 'price_book')('Target gross margin', h.esc('42%'))}${fx(c, 'price_book')('Material markup default', '35%')}${fx(c, 'price_book')('Minimum visit charge', '$45')}${fx(c, 'price_book')('Drive time billing', 'Included in rates')}</div>` + (c.sees('cost') ? '' : h.note('Cost and burden fields are hidden for your role.'));
  return h.page({ title: 'Price book and production rates', sub: `${c.planCode === 'pro' && c.t.branches.length > 1 ? c.t.branches.length + ' price books (per branch)' : '1 price book'} · ${num(used)} items${fieldRole(c) ? ' · names only for field roles' : ''}`, actions: (can ? h.btn('Add item', { kind: 'primary', icon: 'plus', act: 'more-toast' }) + tbtn('Import CSV', 'Price list import started: map columns, preview changes.', { icon: 'upload' }) : '') + roPill(c, 'price_book') })
    + (lim ? `<div class="cd"><div class="cd-b">${h.meter('Price Book items on ' + esc(c.plan.name), used, 200)}<div class="tiny t3">Starter: 1 price book, 200 items. ${isOwner(c) ? 'Grow removes the limit.' : ask(c)}</div></div></div>` : '')
    + h.tabs('pb.tab', [['items', 'Items', num(used)], ['kits', 'Kits', 3], ['rates', 'Production rates', rates.length], ['overhead', 'Overhead and burden']], 'items') + body;
});

RL.screen('web.settings.payments', (c) => {
  const D = c.D, own = isOwner(c);
  const vol = Math.round(D.payments.reduce((s, p) => s + p.amount, 0) * (c.winter ? .35 : 1.6) / 10) * 10;
  const m3 = [Math.round(vol * .86), Math.round(vol * .94), vol];
  const avg = Math.round((m3[0] + m3[1] + m3[2]) / 3);
  const fee = Math.min(avg * .005, avg / 120 * 10);
  const starter = c.planCode === 'starter';
  const pm = [['pm.card', 'Cards (credit and debit)', true], ['pm.ach', 'ACH bank debit (lower fee)', true], ['pm.wallet', 'Apple Pay and Google Pay', true], ['pm.cof', 'Card on file and autopay', true], ['pm.partial', 'Partial payments on invoices', false], ['pm.tips', 'Tips on field payments', false]];
  const connected = RL.ui['pay.conn'] !== '0';
  return h.page({ title: 'Payments (Stripe connection)', sub: 'Your clients pay you through your own Stripe account. Stripe\'s fees go to Stripe. Rootline adds nothing on standard plans.', actions: own ? '' : h.pill('Owner-only changes', '', 'lock') })
    + h.cols('2', [
      sec('Stripe account', connected ? h.kv([['Account', '<span class="mono">acct_••••9KQ</span> (Standard, connected)'], ['Charges', h.pill('Enabled', 'ok')], ['Payouts', h.pill('Enabled · daily', 'ok')], ['Identity', h.pill('Verified', 'ok')], ['Payout bank', h.mask(c, 'vendor_banking', '<span class="mono">Checking ••4410</span>')], ['Disputes (90 d)', '0 open · 1 won']])
        + `<div class="flex">${own ? tbtn('Open Stripe dashboard', 'Opened your Stripe dashboard in a new tab.', { icon: 'external' }) + h.btn('Disconnect', { sm: true, ui: 'pay.conn', val: '0' }) : `<span class="tiny t3">Only ${esc(c.owner)} can connect or disconnect Stripe (stripe_connection = ${esc(c.can('stripe_connection'))}).</span>`}</div>`
        : h.empty('Not connected. Invoices still send; clients can pay by check until Stripe is connected.') + (own ? `<div>${h.btn('Connect your Stripe account', { kind: 'primary', ui: 'pay.conn', val: '1' })}</div>` : '')),
      sec('Payment methods offered', `<div class="stack8">${pm.map(([kk, l, d]) => own ? tg(esc(l), kk, d) : `<span class="flex">${h.pill(h.on(kk, d) ? 'On' : 'Off', h.on(kk, d) ? 'ok' : '')}${esc(l)}</span>`).join('')}</div>` + h.note('Card surcharges, where legal, are the Company\'s revenue and follow state rules (verify). Rootline never holds client funds.')),
    ])
    + sec('How Rootline charges for client payments ' + h.tag('V1'), starter ? `<div class="cols cols-2"><div class="plan-c${RL.ui['pay.pag'] === '1' ? '' : ' on'}"><b>Zero markup (standard)</b><div class="pr">$${c.plan.monthly}<small>/mo</small></div><div class="tiny t2">Rootline fee on payments: 0%</div><div class="tiny">At your volume: <b>${money(c.plan.monthly, { cents: true })}/mo</b></div></div><div class="plan-c${RL.ui['pay.pag'] === '1' ? ' on' : ''}"><b>Pay-as-you-grow</b><div class="pr">$39<small>/mo + 0.5% per payment, max $10</small></div><div class="tiny t2">No fee on tips. Fees show in your own Stripe dashboard.</div><div class="tiny">At your volume: <b>${money(39 + fee, { cents: true })}/mo</b></div></div></div>`
      + `<div class="small t2">Online client payments, last 3 months: ${m3.map(v => money(v)).join(', ')} · average ${money(avg)}/month. Break-even is about $8,000/month on monthly Starter.</div>`
      + (own ? `<div class="flex">${tg('I understand the 0.5% fee is in addition to Stripe\'s fees', 'pay.ack', false)}${h.btn(RL.ui['pay.pag'] === '1' ? 'Switch back to zero markup' : 'Switch to pay-as-you-grow', { sm: true, kind: 'primary', ui: 'pay.pag', val: RL.ui['pay.pag'] === '1' ? '0' : '1', disabled: RL.ui['pay.pag'] !== '1' && !h.on('pay.ack', false) })}</div>` : '')
      + h.note('Opt-in only. If your volume passes break-even for 2 months in a row we tell you and offer a one-click switch back (22 §9.7).')
      : `<div class="flex">${h.pill('Zero markup: Rootline fee 0%', 'ok')}<span class="small t2">Pay-as-you-grow is an opt-in Starter option. On ${esc(c.plan.name)} there is no Rootline fee on client payments.</span></div>`);
});

RL.screen('web.settings.accounting', (c) => {
  const can = writes(c, 'accounting_sync'), qbo = c.t.books === 'qbo_system';
  const mode = RL.ui['ac.mode'] || (qbo ? 'qbo' : 'ledger');
  const rules = [['Invoice posted', '1100 Accounts receivable', '4000-4200 Revenue by service line'], ['Client payment (Stripe)', '1050 Stripe clearing', '1100 Accounts receivable'], ['Stripe payout', '1000 Operating checking + 6300 Fees', '1050 Stripe clearing'], ['Deposit on proposal', '1050 Stripe clearing', '2100 Customer deposits'], ['Level billing installment', '1100 Accounts receivable', '2150 Deferred revenue'], ['Payroll journal', '5000 Direct labor', '2300 Payroll liabilities'], ['Vendor bill (job)', '5100 Materials (job cost)', '2000 Accounts payable']];
  return h.page({ title: 'Accounting setup', sub: mode === 'ledger' ? 'Rootline Ledger is the system of record · chart template: landscape contractor' : 'QuickBooks Online is the system of record · Books screens are hidden', actions: roPill(c, 'accounting_sync') })
    + sec('System of record', `<div class="cols cols-3">${[['ledger', 'Rootline Ledger', 'Double-entry GL, auto-posting, bank feed, P&L and balance sheet', 'MVP'], ['qbo', 'QuickBooks Online sync', 'Rootline sends invoices, payments and job costs; QuickBooks keeps the books', 'MVP'], ['xero', 'Xero sync', 'Same sync model for Xero', 'V1']].map(([id, n, d, sc]) => `<div class="plan-c${mode === id ? ' on' : ''}"><div class="flex between"><b>${n}</b>${h.tag(sc)}</div><div class="tiny t2">${d}</div>${mode === id ? h.pill('Current', 'ok', 'check') : can && (sc === 'MVP' || c.inLens(sc)) ? h.btn('Switch', { sm: true, ui: 'ac.mode', val: id }) : ''}</div>`).join('')}</div>` + h.note('Switching the system of record takes effect at the start of an open period and never rewrites posted entries.'))
    + (mode === 'ledger' ? h.cols('21', [sec('Posting rules', h.table([{ k: 0, label: 'Event' }, { k: 1, label: 'Debit' }, { k: 2, label: 'Credit' }], rules, { dense: true }), { flush: true }),
      sec('Periods and defaults', h.kv([['Chart template', 'Landscape contractor (Rootline standard)'], ['Books closed through', c.winter ? 'Nov 30, 2026' : 'Mar 31, 2027'], ['Lock date', c.winter ? 'Nov 30, 2026' : 'Mar 31, 2027'], ['Default deposit account', '1000 Operating checking'], ['Bank feeds', c.has('ledger_plus') ? '2 connected' : '1 connected (Ledger Essentials)']]) + (can ? tbtn('Close next period', 'Close checklist opened.', { sm: true }) : ''))])
      : sec('QuickBooks Online sync', h.kv([['Company file', esc(c.t.name) + ' (QuickBooks Online)'], ['Last sync', c.today.short + ' 6:02 am · 41 records'], ['Errors', h.pill('1: tax code missing on INV-3311', 'warn')], ['Items mapped', '212 of 214']]) + (can ? `<div class="flex">${tbtn('Sync now', 'Sync queued.', { sm: true, kind: 'primary' })}${tbtn('Fix mapping', 'Mapping editor opened.', { sm: true })}</div>` : '')))
    + saveBar(c, 'accounting_sync');
});

RL.screen('web.settings.portal', (c) => {
  const t = c.t, can = writes(c, 'company.settings'), b = RL.portalBrand(c);
  const rules = [['pr.photos', 'Show visit photos and reports', true], ['pr.req', 'Clients can submit requests', true], ['pr.crew', 'Show crew first names on visit notices', true], ['pr.coown', 'Co-owners can manage payment methods', false], ['pr.sched', 'Clients can reschedule within 48 h', false]];
  const com = c.feat('portal_commercial');
  return h.page({ title: 'Portal and branding', sub: `White-label portal at <span class="mono">${esc(b.host)}</span>`, actions: roPill(c, 'company.settings') })
    + h.cols('2', [
      sec('Brand kit', `<div class="cols cols-2">${h.field('Logo', `<span class="flex"><span class="logo" style="width:34px;height:34px;border-radius:8px;display:grid;place-items:center;color:#fff;font-weight:800;background:${esc(t.brand.color)}">${esc(t.brand.logo)}</span>${can ? tbtn('Replace', 'Logo updated.', { sm: true }) : ''}</span>`)}${fx(c, 'company.settings')('Brand color', t.brand.color)}${sx(c, 'company.settings')('Font', ['Inter', 'Source Serif', 'System'], 'Inter')}${fx(c, 'company.settings')('Reply-to email', 'office@' + domainOf(c))}</div>`
        + `<div class="site-top" style="border:1px solid var(--border);border-radius:8px"><span class="logo" style="background:${esc(t.brand.color)}">${esc(t.brand.logo)}</span><b>${esc(t.name)}</b><span class="tiny t3" style="margin-left:auto">Preview: portal header</span></div>`),
      sec('Custom domain', h.kv([['Domain', `<span class="mono">${esc(b.host)}</span>`], ['DNS (CNAME)', h.pill('Verified', 'ok')], ['TLS certificate', h.pill('Issued · auto-renews', 'ok')], ['Email sending (SPF, DKIM)', h.pill('Verified', 'ok')]]) + (can ? tbtn('Check DNS again', 'DNS records verified.', { sm: true, icon: 'refresh' }) : '')),
    ])
    + sec('Portal rules', `<div class="stack8">${rules.map(([kk, l, d]) => can ? tg(esc(l), kk, d) : `<span class="flex">${h.pill(h.on(kk, d) ? 'On' : 'Off', h.on(kk, d) ? 'ok' : '')}${esc(l)}</span>`).join('')}</div>`
      + `<div class="flex">${h.tag('V1')}<span class="small">Commercial multi-property portal with approval workflows: ${com.s === 'L' ? esc(com.note) : com.s === 'Y' ? 'included' : 'not in plan'}</span></div>` + saveBar(c, 'company.settings'));
});

RL.screen('web.settings.notifications', (c) => {
  const can = writes(c, 'company.settings');
  const tpl = [['On the way', 'SMS', 'EN, ES', 'Transactional', `${c.t.name}: {crew_lead}'s crew is on the way, ETA {eta}. Reply STOP to opt out.`], ['Visit summary', 'Email + portal', 'EN, ES', 'Transactional', 'Your visit is done. Photos and notes: {link}'], ['Rain delay', 'SMS', 'EN, ES', 'Transactional', 'Rain today: your visit moves to {new_date}.'], ['Invoice sent', 'Email', 'EN', 'Transactional', 'Invoice {number} for {amount} is ready: {link}'], ['Payment receipt', 'Email', 'EN', 'Transactional', 'Thanks, we received {amount}.'], ['Proposal sent', 'Email', 'EN', 'Transactional', '{estimator} sent you a proposal: {link}'], ['Seasonal offer', 'SMS', 'EN', 'Marketing', 'Aeration for your lawn is {price}. Reply YES to book.']];
  const reg = c.planCode === 'starter' ? [['Brand', 'Approved'], ['Customer care and notifications campaign', 'Approved'], ['Marketing campaign', 'Not registered']] : [['Brand', 'Approved'], ['Customer care and notifications campaign', 'Approved'], ['Marketing campaign', 'Approved']];
  const sel = tpl.find(x => x[0] === RL.ui['nt.sel']) || tpl[0];
  return h.page({ title: 'Notifications and templates', sub: `${tpl.length} templates · quiet hours 8 pm to 8 am local · consent checked on every send`, actions: roPill(c, 'company.settings') })
    + h.cols('21', [
      sec('Templates', h.table([{ k: 0, label: 'Template', fmt: v => `<b>${esc(v)}</b>` }, { k: 1, label: 'Channel' }, { k: 2, label: 'Languages' }, { k: 3, label: 'Type', fmt: v => h.pill(esc(v), v === 'Marketing' ? 'warn' : '') }, { k: 0, label: '', fmt: v => h.btn(v === sel[0] ? 'Editing' : 'Edit', { sm: true, ui: 'nt.sel', val: v, kind: v === sel[0] ? 'primary' : 'ghost' }) }], tpl, { dense: true }), { flush: true }),
      `<div class="stack12">${sec('Edit: ' + esc(sel[0]), (can ? h.textarea(sel[4], { label: 'Template text' }) : `<div class="small">${esc(sel[4])}</div>`) + h.note('Variables in braces fill from the record. Spanish versions are reviewed by a person before first use.') + (can ? tbtn('Save template', 'Template saved.', { sm: true, kind: 'primary' }) : ''))}
      ${sec('10DLC registration', h.list(reg.map(([n, s]) => ({ icon: s === 'Approved' ? 'check' : 'warn', tone: s === 'Approved' ? 'ok' : 'warn', title: esc(n), right: statusPill(s) }))) + (c.planCode === 'starter' ? h.note('Marketing SMS stays off until the marketing campaign is registered. Fees are passed through at cost on Starter and monthly plans (16 §4.20).') : ''), { flush: true })}</div>`,
    ])
    + sec('Consent and frequency', `<div class="cols cols-3">${fx(c, 'company.settings')('Quiet hours', '8:00 pm - 8:00 am (recipient local time)')}${fx(c, 'company.settings')('Marketing messages per client', 'Max 4 per month')}${sx(c, 'company.settings')('Opt-out keywords', ['STOP, UNSUBSCRIBE, CANCEL, END, QUIT', 'STOP only'], 'STOP, UNSUBSCRIBE, CANCEL, END, QUIT')}</div>` + saveBar(c, 'company.settings'));
});

RL.screen('web.settings.integrations', (c, a) => {
  const can = writes(c, 'integration'), api = c.feat('api');
  const quota = { starter: 10000, grow: 50000, pro: 250000 }[c.planCode] || 250000;
  const readOnly = c.planCode === 'starter';
  const apps = [['Stripe', 'Payments (your own account)', 'Connected', 'MVP'], [c.t.books === 'qbo_system' ? 'QuickBooks Online' : 'Bank feed (aggregator)', c.t.books === 'qbo_system' ? 'System of record' : 'Ledger bank feed', 'Connected', 'MVP'], ['Google Business Profile', 'Reviews and replies', 'Connected', 'MVP'], ['Payroll provider', 'Payroll export (Gusto, ADP, QuickBooks Payroll)', 'Connected', 'MVP'], ['Calendar sync', 'Google or Microsoft 365 calendars', 'Not connected', 'MVP'], ['Telematics', 'Engine hours and GPS for equipment', 'Not connected', 'V1'], ['MCP server', 'Let your own AI tools read Rootline with your permissions', 'Not connected', 'V1']];
  const hooks = [['https://hooks.' + domainOf(c) + '/rootline', 'invoice.paid, job.completed', 'Healthy', '99.9%'], ['https://example.com/crm-sync', 'client.created', 'Failing: 3 retries', '71%']];
  return h.page({ title: 'Integrations and API', sub: `Public API ${readOnly ? 'read-only, ' : ''}${num(quota)} calls per day on ${esc(c.plan.name)}`, actions: roPill(c, 'integration') })
    + sec('Connected apps', h.table([{ k: 0, label: 'App', fmt: (v, r) => `<b>${esc(v)}</b> ${r[3] !== 'MVP' ? h.tag(r[3]) : ''}<div class="tiny t3">${esc(r[1])}</div>` }, { k: 2, label: 'Status', fmt: v => statusPill(v) }, { k: 2, label: '', fmt: (v, r) => can && (r[3] === 'MVP' || c.inLens(r[3])) ? h.btn(v === 'Connected' ? 'Manage' : 'Connect', { sm: true, act: 'more-toast' }) : '' }], apps, { dense: true }), { flush: true })
    + h.cols('2', [
      sec('API keys', `<div class="cd-b" style="padding:0">${h.meter('Calls today', c.winter ? Math.round(quota * .04) : Math.round(quota * .23), quota)}</div>` + h.table([{ k: 0, label: 'Key' }, { k: 1, label: 'Scope' }, { k: 2, label: 'Last used' }], [['rl_live_••••7Qd2', readOnly ? 'Read only' : 'Read and write', '2 min ago'], ['rl_live_••••a19K', 'Read only: reports', 'Yesterday']], { dense: true })
        + `<div class="flex">${can ? tbtn('Create key', readOnly ? 'Read-only key created. Write scopes need Grow.' : 'Key created. Copy it now; it is shown once.', { sm: true, icon: 'key' }) : ''}${readOnly ? lockPill('Write access: Grow and Pro') : ''}</div>`),
      sec('Webhooks', h.table([{ k: 0, label: 'Endpoint', fmt: v => `<span class="mono tiny">${esc(v)}</span>` }, { k: 1, label: 'Events', fmt: v => `<span class="tiny">${esc(v)}</span>` }, { k: 2, label: 'Status', fmt: v => statusPill(v) }], hooks, { dense: true }) + h.note('Signed payloads, retries with backoff for 24 hours, replay from the delivery log.')),
    ]);
});

RL.screen('web.settings.data', (c) => {
  const can = c.allowed('data_export.run'), own = isOwner(c), off = c.role === 'office_manager', bk = c.role === 'bookkeeper';
  const step = +(RL.ui['dt.step'] || 0);
  const src = RL.ui['dt.src'] || 'Jobber';
  const hist = [['Clients and properties', 'CSV', c.winter ? 'Dec 2' : 'Mar 3', `${c.t.clients} clients, ${Math.round(c.t.clients * 1.1)} properties`, 'Done'], ['Price book', 'CSV', c.winter ? 'Dec 2' : 'Mar 3', '214 items', 'Done'], ['Open invoices', 'QuickBooks', c.winter ? 'Dec 4' : 'Mar 5', '38 invoices', 'Done: 2 skipped (duplicates)']];
  const sandbox = c.feat('sandbox');
  return h.page({ title: 'Data import and export', sub: 'Your data is yours: export everything at any time, including after you leave', actions: '' })
    + h.cols('2', [
      sec('Import', h.steps(['Source', 'Upload', 'Map fields', 'Preview', 'Import'], step) + `<div class="cols cols-2">${h.field('Source', h.select(['Jobber', 'LMN', 'QuickBooks', 'CSV (any system)'], src, { ui: 'dt.src' }))}${h.field('Records', h.select(['Clients and properties', 'Price book', 'Open invoices', 'Agreements', 'Equipment'], 'Clients and properties'))}</div>`
        + (step >= 3 ? h.table([{ k: 0, label: 'Source field' }, { k: 1, label: 'Rootline field' }, { k: 2, label: 'Sample' }], [['Client Name', 'Client name', esc(c.D.clients[1].name)], ['Service Street', 'Property address', esc(c.D.clients[1].address)], ['Phone', 'Primary phone', '(614) 555-0137'], ['Tags', 'Tags', 'Weekly, Autopay']], { dense: true }) : '')
        + `<div class="flex">${step > 0 ? h.btn('Back', { sm: true, ui: 'dt.step', val: String(step - 1) }) : ''}${step < 4 ? h.btn(['Choose file', 'Upload', 'Map fields', 'Import ' + c.t.clients + ' records'][step], { sm: true, kind: 'primary', ui: 'dt.step', val: String(step + 1) }) : h.pill('Imported · undo available for 7 days', 'ok')}</div>`
        + h.note('Import formats follow each vendor\'s own export and can change; verify before migrating. Grow and Pro annual plans include a free migration concierge.')),
      sec('Export', h.list([
        { icon: 'download', title: 'Full Company export', sub: 'Every record, files and the ledger as CSV and JSON', right: own ? tbtn('Export', 'Export started. A download link arrives by email (passkey step-up done).', { sm: true }) : lockPill('Owner') },
        { icon: 'users', title: 'Client list', sub: off ? 'Over 1,000 clients needs a second approver' : 'Names, contacts, properties', right: own || off ? tbtn(off && c.t.clients > 1000 ? 'Request export' : 'Export', off && c.t.clients > 1000 ? 'Export requested; the owner must approve (dual control).' : 'Client list exported.', { sm: true }) : lockPill('Owner, office') },
        { icon: 'bank', title: 'Financial export', sub: 'GL, AR, AP, tax reports', right: own || bk ? tbtn('Export', 'Financial export ready.', { sm: true }) : lockPill('Owner, bookkeeper') },
      ]) + (can ? '' : h.note('Your role cannot run exports.')), { flush: true }),
    ])
    + sec('History', h.table([{ k: 0, label: 'Import' }, { k: 1, label: 'Source' }, { k: 2, label: 'When' }, { k: 3, label: 'Records' }, { k: 4, label: 'Result', fmt: v => statusPill(v) }], hist, { dense: true }), { flush: true })
    + sec('Sample data and sandbox', `<div class="flex between">${own ? tg('Show the demo company (Greenleaf Grounds Co., a full sample year) while you set up', 'dt.demo', false) : '<span class="small">Demo company: owner setting</span>'}<span class="flex gap4">${h.tag('V1')}<span class="tiny t3">Sandbox tenant: ${sandbox.s === 'Y' ? 'included' : sandbox.s === 'A' ? '$99/mo add-on' : 'Pro add-on'}</span></span></div>`);
});

function planDiff(c, to) {
  const out = [], from = c.planCode;
  const ord = { starter: 0, grow: 1, pro: 2, enterprise: 3 };
  if (ord[to] > ord[from]) return out;
  RL.P.plans.features.forEach(f => {
    const a = (f.plans[from] || {}).s, b = (f.plans[to] || {}).s;
    if ((a === 'Y' || a === 'L') && (b === 'A' || b === '-') && f.scope !== 'V2' && f.scope !== 'V3' && !c.t.addons.includes((f.plans[to] || {}).addon)) out.push(f.name.split(/[,:(]/)[0].trim() + (b === 'A' ? ' (becomes an add-on)' : ''));
  });
  return out.slice(0, 8);
}
const PCS = ['starter', 'grow', 'pro', 'enterprise'];
const CMP = [['automations', 'Active automation rules', ['5', '50', 'Unlimited', '']], ['custom_roles', 'Custom roles', ['', '2', '', '']], ['equipment', 'Equipment assets', ['10', '25', '', '']], ['inventory', 'Inventory', ['Off mode', '1 yard', 'Multi-site', '']],
  ['agents_v1', 'V1 AI agents', ['', '3', '', '']], ['report_builder', 'Report builder', []], ['benchmarks', 'Benchmarks', []], ['forecasts', '13-week forecasts', []], ['website', 'Website builder', ['', '', '1 site', '']], ['ai_receptionist', 'AI receptionist', ['', '', '200 min', '']], ['marketing_advanced', 'Journey builder', []], ['sso', 'SSO (SAML, OIDC)', []]];
RL.screen('web.settings.subscription', (c) => {
  const t = c.t, pl = c.plan, S = seats(c), cr = credits(c), own = isOwner(c);
  const iv = interval(c), base = basePrice(c);
  const founding = ['S1', 'S2', 'S3'].includes(c.seg.id) && pl.public;
  const net = founding ? Math.round(base * 75) / 100 : base;
  const seatCost = S.oOffice * S.ex.office + S.oField * S.ex.field + S.oDesigner * S.ex.designer;
  const addons = [['snow_ice', 'snow_ice'], ['ai_receptionist', 'ai_receptionist'], ['website', 'website'], ['marketing_advanced', 'marketing_advanced'], ['ledger_advanced', 'ledger_advanced'], ['design_3d', 'design_3d'], ['payroll', 'payroll']].map(([code, feat]) => {
    const ad = I.ADDONS[code], fs = c.feat(feat), on = t.addons.includes(code);
    const state = on ? 'Active' : fs.s === 'Y' ? 'Included in ' + pl.name : fs.s === 'A' ? 'Not active' : 'Not available';
    return { code, name: ad.name, price: ad.price, scope: ad.scope, state };
  }).filter(x => x.state !== 'Not available');
  const addCost = t.addons.includes('snow_ice') ? (c.winter ? 79 : 0) : 0;
  const smsInc = pl.sms || 0, smsUsed = Math.round(smsInc * .44);
  const voiceInc = { starter: 300, grow: 1000, pro: 3000 }[c.planCode] || 0;
  const stor = pl.storage_gb || 0;
  const packBuy = cr.pack && !c.winter ? 25 : 0;
  const tax = Math.round((seatCost + addCost + packBuy + (iv === 'monthly' ? net : 0)) * .0575 * 100) / 100;
  const due = (iv === 'monthly' ? net : 0) + seatCost + addCost + packBuy + tax;
  const nextDate = c.winter ? 'Feb 1' : 'Jun 1';
  const caps = [['Technicians', '20 per user'], ['Crew leads', '40 per user'], ['Estimators', '300 per user'], ['Designers', '800 per user'], ['Office', '500 per user'], ['Owner', 'No cap']];
  const wmFrom = RL.ui['wm.from'] || 'Dec 1', wmTo = RL.ui['wm.to'] || 'Mar 1';
  const plans = ['starter', 'grow', 'pro', 'enterprise'].map(k2 => I.PLANS[k2]);
  const ord = { starter: 0, grow: 1, pro: 2, enterprise: 3, design_solo: -1 };
  const ro = own ? '' : bnr(`${icon('lock')} Read only. Only ${esc(c.owner)} (owner) can change the plan, add-ons, credit packs and caps (rootline_subscription = ${esc(c.can('rootline_subscription'))}).`, 'info');
  const seatRow = (l, inc, used, over, per, note) => ({ l, inc: inc == null ? 'Unlimited' : inc, used, over, cost: over * per, note });
  const seatRows = [seatRow('Office users', S.inc.office, S.office, S.oOffice, S.ex.office), seatRow('Designer seats', S.inc.designer, S.designers, S.oDesigner, S.ex.designer), seatRow('Crew users (active this month)', S.inc.field, S.field, S.oField, S.ex.field, c.winter ? 'Winter: only active crew count' : ''), seatRow('Bookkeeper (free)', 1, S.bk, 0, 0), seatRow('Observers (free, up to 3)', 3, 1, 0, 0)];
  return h.page({ title: 'Plan, billing and AI credits', sub: `${esc(t.name)} · billed to ACH ••4410 · billing email billing@${esc(domainOf(c))}`, actions: own ? tbtn('Download all invoices', 'Invoices exported as PDF.', { icon: 'download' }) : '' })
    + ro
    + `<div class="cd"><div class="cd-b"><div class="flex between"><div><div class="tiny t3" style="letter-spacing:.06em">PLAN</div><div style="font-size:1.25rem;font-weight:720">${esc(pl.name)} · ${iv === 'annual' ? 'Annual (USD)' : 'Monthly (USD)'}</div></div>${own ? h.btn('Change plan', { kind: 'primary', ui: 'sb.tab', val: 'plans' }) : ''}</div><div class="flex">${'<span class="small t2">' + (founding ? money(base * .75, { cents: true }) + '/mo after discount (list ' + money(base) + ')' : money(base) + '/mo') + (iv === 'annual' ? ' billed annually' : '') + ' · renews ' + (iv === 'annual' ? 'Mar 1, 2028' : nextDate) + '</span>'}${founding ? h.pill('Founding Customer -25% on base', 'ok') : ''}${h.pill(iv === 'annual' ? 'Price Lock until Mar 1, 2028' : '60 days notice before any price change', 'info', 'shield')}</div><div class="tiny t3">Price Lock: annual customers keep their list price for 24 months; after that, increases are capped at 7% per year with 90 days notice (22 §4.7).</div></div></div>`
    + h.tabs('sb.tab', [['usage', 'Seats and usage'], ['credits', 'AI credits'], ['addons', 'Add-ons', addons.length], ['invoices', 'Invoices'], ['winter', 'Winter Mode ' + h.tag('V1')], ['plans', 'Compare plans']], 'usage')
    + (() => {
      const tab = h.tab('sb.tab', 'usage');
      if (tab === 'usage') return h.cols('21', [
        sec('Seats', h.table([{ k: 'l', label: 'Seat' }, { k: 'inc', label: 'Included', n: true }, { k: 'used', label: 'In use', n: true }, { k: 'over', label: 'Billed extra', n: true, fmt: v => v ? `<b>${v}</b>` : '-' }, { k: 'cost', label: 'Next invoice', n: true, fmt: (v, r) => money(v, { cents: true }) + (r.note ? `<div class="tiny t3">${esc(r.note)}</div>` : '') }], seatRows, { dense: true, foot: ['Seats total', '', '', '', money(seatCost, { cents: true })] }) + h.note(`Extra seats on ${esc(pl.name)}: office ${money(S.ex.office)}, field ${money(S.ex.field)}, designer ${money(S.ex.designer)} per month. Field seats count active users only (22 §4.3).`), { flush: true }),
        sec('Usage this period', `<div class="stack8">${h.meter('AI credits', cr.used, cr.inc)}${cr.pack ? `<div class="tiny t3">+ ${num(cr.pack)} pack credits (expire in 12 months)</div>` : ''}${smsInc ? h.meter('SMS segments', smsUsed, smsInc) + `<div class="tiny t3">Hard cap ${num(smsInc * 3)} (3x included, owner-set)</div>` : ''}${voiceInc ? h.meter('Call minutes', Math.round(voiceInc * (c.winter ? .21 : .74)), voiceInc) : ''}${stor ? h.meter('Storage', Math.round(stor * .24), stor, { unit: 'GB' }) : ''}</div>`),
      ]) + sec(`Upcoming invoice preview (${nextDate})`, h.kv([['Base plan', iv === 'annual' ? money(net, { cents: true }) + '/mo <span class="t3">(prepaid annually)</span>' : money(net, { cents: true }) + (founding ? ' <span class="t3">(Founding -25%)</span>' : '')], ['Extra seats', money(seatCost, { cents: true })], ['Add-ons', addCost ? money(addCost, { cents: true }) + ' (Snow and Ice, in season)' : '$0.00'], ['Usage', packBuy ? money(packBuy, { cents: true }) + ' (1,000-credit pack, bought ' + past(c)[2] + ')' : '$0.00'], ['Estimated tax', money(tax, { cents: true })], ['Due', `<b>${money(due, { cents: true })}</b>`]]) + h.note('Seats and usage are billed monthly in arrears. Never blocks getting paid: invoicing, portal payments and the ledger stay on in every billing state.'));
      if (tab === 'credits') return h.cols('2', [
        sec('Credit packs', `<div class="stack8">${[['1000', '1,000 credits', '$25'], ['5000', '5,000 credits', '$100'], ['20000', '20,000 credits', '$340']].map(([n, l, p]) => `<div class="flex between"><span><b>${l}</b> <span class="t3">${p}</span></span>${own ? h.btn('Buy', { sm: true, modal: 'more-pack', x: n }) : ''}</div>`).join('')}</div>` + h.note('Soft stop at 0 with a one-click pack purchase. Every AI action shows its cost before it runs (22 §4.4.1).')
          + `<div class="flex between"><span class="small"><b>Auto top-up</b> <span class="t3">Off by default</span></span>${own ? tg('', 'sb.topup', false) : h.pill(h.on('sb.topup', false) ? 'On' : 'Off', '')}</div>${h.on('sb.topup', false) ? h.field('Monthly ceiling', h.select(['$25', '$100', '$340'], '$100')) : ''}`),
        sec('Per-role credit caps', h.table([{ k: 0, label: 'Role' }, { k: 1, label: 'Cap per month' }], caps, { dense: true }) + (own ? tbtn('Edit caps', 'Caps saved. Users see their remaining budget before each action.', { sm: true }) : '') + h.note('Per-agent caps are set on Automations > AI agents.'), { flush: false }),
      ]) + sec('Rate card (examples)', h.table([{ k: 'action', label: 'Action' }, { k: 'credits', label: 'Credits', n: true }, { k: 'scope', label: '', fmt: v => h.tag(v) }], RL.P.plans.ai_credit_rates.filter(r => r.scope === 'MVP').slice(0, 8), { dense: true }), { flush: true });
      if (tab === 'addons') return sec('Add-ons', h.table([{ k: 'name', label: 'Add-on', fmt: (v, r) => `<b>${esc(v)}</b> ${h.tag(r.scope)}` }, { k: 'price', label: 'Price', fmt: v => `<span class="tiny">${esc(v)}</span>` }, { k: 'state', label: 'Status', fmt: v => statusPill(v === 'Not active' ? 'Off' : v) }, { k: 'code', label: '', fmt: (v, r) => !own ? '' : r.state === 'Active' ? tbtn('Remove', 'Removal takes effect at the end of the period; data stays read only.', { sm: true }) : r.state === 'Not active' ? tbtn('Add', `${r.name} added; prorated on the next invoice.`, { sm: true, kind: 'primary' }) : '' }], addons, { dense: true }) + h.note('An add-on that a higher tier includes is removed on upgrade with prorated credit (22 §4.5).'), { flush: true });
      if (tab === 'invoices') return sec('Rootline invoices', h.table([{ k: 0, label: 'Invoice', m: true }, { k: 1, label: 'Date' }, { k: 2, label: 'Amount', n: true }, { k: 3, label: 'Status', fmt: v => statusPill(v) }, { k: 0, label: '', fmt: () => tbtn('PDF', 'Invoice PDF downloaded.', { sm: true, icon: 'download' }) }],
        (c.winter ? [['RL-26-1201', 'Jan 1, 2027', 0.82], ['RL-26-1101', 'Dec 1, 2026', 0.74], ['RL-26-1001', 'Nov 1, 2026', 0.9]] : [['RL-27-0501', 'May 1, 2027', 1.1], ['RL-27-0401', 'Apr 1, 2027', 0.96], ['RL-27-0301', 'Mar 1, 2027', iv === 'annual' ? 12 : 1]]).map(([id, d, f]) => [id, d, money(Math.round((iv === 'annual' && f < 5 ? seatCost * f + 9 : base * f + seatCost * .9) * 100) / 100, { cents: true }), 'Paid']), { dense: true }) + h.kv([['Payment method', 'ACH debit, Checking ••4410 ' + (own ? h.btn('Update', { sm: true, act: 'more-toast' }) : '')], ['Tax ID', 'On file']]), { flush: true });
      if (tab === 'winter') {
        const wm = iv === 'monthly';
        const mo = c.plan.monthly || base;
        return sec('Schedule Winter Mode', `<div class="cols cols-3">${h.field('Pause from', own && wm ? h.select(['Nov 15', 'Dec 1', 'Dec 15'], wmFrom, { ui: 'wm.from' }) : h.input(wmFrom, { ro: true }))}${h.field('Resume on', own && wm ? h.select(['Feb 15', 'Mar 1', 'Mar 15'], wmTo, { ui: 'wm.to' }) : h.input(wmTo, { ro: true }))}${h.field('Used in the last 12 months', h.input('0 of 4 months', { ro: true }))}</div>`
          + h.table([{ k: 0, label: 'Your bill' }, { k: 1, label: 'Now (monthly)', n: true }, { k: 2, label: 'During Winter Mode', n: true }], [['Base plan', money(mo, { cents: true }), money(mo * .25, { cents: true }) + ' (25%)'], [`Extra office seats (${S.oOffice})`, money(S.oOffice * S.ex.office, { cents: true }), '$0 (beyond 2 read only)'], ['Snow and Ice', t.addons.includes('snow_ice') ? 'In season' : '-', t.addons.includes('snow_ice') ? 'Stays on' : '-']], { dense: true })
          + h.cols('2', [`<div><b class="small">Keeps working</b>${h.list(['Invoicing, autopay, statements', 'Client portal and client payments', 'Ledger, bank feeds, month-end close', 'CRM (read) and unified inbox', 'Service agreement billing'].map(x => ({ icon: 'check', tone: 'ok', title: x })))}</div>`, `<div><b class="small">Pauses</b>${h.list([t.addons.includes('snow_ice') ? 'Crew app except snow users' : 'Crew app (no snow module)', 'New proposals and designs', 'AI generation (included credits pause; packs stay valid)', 'Campaigns and Match leads'].map(x => ({ icon: 'pause', title: x })))}</div>`])
          + (wm ? (own ? `<div class="flex">${tbtn('Schedule Winter Mode', `Winter Mode scheduled ${wmFrom} to ${wmTo}. We will remind you 14 days before resume.`, { kind: 'primary' })}<span class="tiny t3">Pick 2 users who keep editing in winter.</span></div>` : '') : h.note(`Winter Mode is for monthly plans (up to 4 months in any rolling 12). ${esc(t.name)} is on annual billing; field seats already drop with activity in winter.`)), { sub: 'Base drops to 25% of list; the Company keeps getting paid (22 §9.8)' });
      }
      return h.cols('4', plans.map(p => {
        const cur = p.code === c.planCode, up = ord[p.code] > ord[c.planCode];
        const price = p.public && p.annual ? `${money(p.annual)}<small>/mo annual</small>` : `<small style="display:block;line-height:1.35;padding:6px 0">${esc(p.annual_note || 'Custom')}</small>`;
        return `<div class="plan-c${cur ? ' on' : ''}"><div class="flex between"><b>${esc(p.name)}</b>${p.scope !== 'MVP' ? h.tag(p.scope) : ''}</div><div class="pr">${price}</div><div class="tiny t2">${p.office_seats != null ? p.office_seats + ' office' : esc(p.office_note || '')} · ${p.field_seats != null ? p.field_seats + ' active field' : esc(p.field_note || 'Unlimited field')} · ${p.ai_credits ? num(p.ai_credits) + ' AI credits' : esc(p.ai_note || '')}</div><div class="tiny t3">${esc(p.for)}</div>${cur ? h.pill('Current plan', 'ok', 'check') : own ? (p.public ? h.btn(up ? 'Upgrade' : 'Downgrade', { sm: true, kind: up ? 'primary' : '', modal: 'more-plan', x: p.code }) : tbtn('Talk to sales', 'A specialist will reach out within one business day.', { sm: true })) : ''}</div>`;
      })) + sec('What changes between plans', h.table([{ k: 'name', label: 'Capability', fmt: (v, r) => `${esc(v)} ${r.tag}` }].concat(PCS.map(pc => ({ k: pc, label: esc(I.PLANS[pc].name), fmt: v => `<span class="nw">${h.chip(v.s)}${v.note ? ` <span class="tiny t3">${esc(v.note)}</span>` : ''}</span>` }))),
        CMP.filter(([k2]) => I.FEATS[k2]).map(([k2, name, notes]) => Object.assign({ name, tag: I.FEATS[k2].scope !== 'MVP' ? h.tag(I.FEATS[k2].scope) : '' }, ...PCS.map((pc, j) => ({ [pc]: { s: (I.FEATS[k2].plans[pc] || {}).s || '-', note: notes[j] || '' } })))), { dense: true })
        + `<div class="flex tiny t3">${h.chip('Y')} included ${h.chip('L')} included with a limit ${h.chip('A')} paid add-on ${h.chip('-')} not on this plan</div>`)
        + h.note('Upgrades are immediate and prorated. Downgrades take effect at the end of the period or term, after an entitlement check lists what goes read only (22 §4.7).');
    })();
});
RL.modal('more-pack', (c, el) => {
  const n = +(el && el.dataset.x) || 1000, price = { 1000: 25, 5000: 100, 20000: 340 }[n] || 25;
  return { title: 'Buy AI credits', body: h.kv([['Pack', num(n) + ' credits'], ['Price', money(price, { cents: true }) + ' + tax'], ['Charged to', 'ACH debit, Checking ••4410'], ['Expires', '12 months after purchase'], ['Balance after', num(credits(c).inc - credits(c).used + n) + ' credits']]) + h.note('Packs are used after the monthly allowance. Credits are refunded automatically when a generation fails.'), foot: h.btn('Cancel', { act: 'noop' }) + tbtn(`Buy for ${money(price)}`, `${num(n)} credits added. Receipt emailed.`, { kind: 'primary' }) };
});
RL.modal('more-plan', (c, el) => {
  const to = (el && el.dataset.x) || 'grow', p = I.PLANS[to], S = seats(c);
  const ord = { starter: 0, grow: 1, pro: 2, enterprise: 3, design_solo: -1 };
  const up = ord[to] > ord[c.planCode];
  const lost = planDiff(c, to);
  const seatsNote = !up && p.field_seats != null && S.field > p.field_seats ? `<li>Included active field seats drop from ${c.plan.field_seats} to ${p.field_seats}; you have ${S.field} active (extra billed at ${money(p.extra_field)} each)</li>` : '';
  const officeNote = !up && p.office_seats != null && S.office > p.office_seats ? `<li>Included office seats drop to ${p.office_seats}; you have ${S.office} (extra ${money(p.extra_office)} each)</li>` : '';
  return { title: (up ? 'Upgrade to ' : 'Downgrade to ') + esc(p.name), body: h.kv([['New price', p.public ? money(p.annual || p.monthly) + '/mo' + (p.annual ? ' billed annually' : '') : esc(p.annual_note || 'Custom')], ['Takes effect', up ? 'Now, prorated' : 'End of the current term'], ['AI credits', num(p.ai_credits || 0) + ' per month']]) + (up ? h.note('New entitlements are available instantly. Add-ons this plan includes are removed with prorated credit.') : `<div class="small"><b>Entitlement check: what goes read only or off</b><ul class="small" style="margin:6px 0 0;padding-left:18px">${officeNote}${seatsNote}${lost.map(l => `<li>${esc(l)}</li>`).join('') || '<li>Nothing changes for features you use.</li>'}</ul></div>` + h.note('Data is never deleted on a downgrade; it stays read only.')), foot: h.btn('Cancel', { act: 'noop' }) + tbtn(up ? 'Upgrade now' : 'Schedule downgrade', up ? `Upgraded to ${p.name}.` : `Downgrade to ${p.name} scheduled for the end of the term.`, { kind: up ? 'primary' : 'danger' }) };
});

RL.screen('web.settings.security', (c) => {
  const own = isOwner(c), can = writes(c, 'security_policy'), grantCap = c.can('support_access.grant');
  const canGrant = !/^-/.test(String(grantCap));
  const viewOnly = /view-only/.test(String(grantCap));
  const tab = h.tab('sc.tab', 'access');
  const granted = RL.ui['sc.grant'] === '1';
  const asUser = RL.ui['sc.as'] || ((c.t.cast && c.t.cast.crew_lead) ? c.t.cast.crew_lead + ' (crew_lead)' : c.owner + ' (owner)');
  const people = c.D.people.slice(0, 8).map(p => p.name + ' (' + p.role + ')');
  const kind = viewOnly ? 'view' : (RL.ui['sc.kind'] || 'view');
  const log = [[c.winter ? 'Dec 14' : 'Apr 22', 'Maya S. (Rootline Support)', 'Ticket 4702: import mapping', 'View only, 24 h', c.owner, 'Expired'], [c.winter ? 'Nov 3' : 'Mar 9', 'Devin R. (Rootline Support)', 'Ticket 4511: QuickBooks sync', 'View and change, 4 h', c.owner, 'Revoked early']];
  const audit = [[c.today.short + ' 7:41', c.owner, 'Role changed', 'Custom role "Crew Lead - Irrigation": +timesheet.approve:crew'], [c.today.short + ' 7:02', (c.t.cast && c.t.cast.office_manager) || c.owner, 'Export run', 'Client list (412 rows)'], [past(c)[0] + ' 16:20', c.owner, 'Stripe payout bank viewed', 'Step-up with passkey'], [past(c)[0] + ' 9:15', 'Rootline Support (Maya S.)', 'Support session ended', 'Ticket 4702, view only'], [past(c)[1] + ' 11:03', (c.t.cast && c.t.cast.bookkeeper) || c.owner, 'Period closed', c.winter ? 'Nov 2026' : 'Mar 2027'], [past(c)[2] + ' 8:30', 'System', 'New device sign-in', 'Chrome on Windows, Columbus OH']];
  let body;
  if (tab === 'access') body = h.cols('2', [
    sec('Rootline Support is asking for access', granted ? bnr(`${icon('eye')} Access granted: ${kind === 'view' ? 'view only' : 'view and make changes'} as ${esc(asUser)} for 72 hours. Support sees a banner with the ticket number and a countdown.`, 'warn') + `<div class="flex">${h.btn('Revoke now', { kind: 'danger', sm: true, ui: 'sc.grant', val: '0' })}</div>`
      : h.kv([['Ticket', '4821: "Crew ' + esc((c.D.crews[0] || { name: 'M3' }).name) + ' cannot see today\'s route"'], ['Requested by', 'Maya S. (Rootline Support)']])
      + (canGrant ? `<div class="stack8">${h.field('Access type', viewOnly ? h.input('View only (your role can grant view-only access)', { ro: true }) : seg('sc.kind', [['view', 'View only'], ['edit', 'View and make changes']], kind))}${h.field('As user', h.select(people, asUser, { ui: 'sc.as' }))}${h.field('Duration', h.select(['4 hours', '24 hours', '72 hours'], '72 hours'))}</div>` : '')
      + (canGrant ? `<div class="flex">${tbtn('Deny', 'Request denied. Support was notified.', {})}${h.btn('Grant access', { kind: 'primary', ui: 'sc.grant', val: '1' })}</div>` : h.note('Only the owner or office manager can answer support requests.')), { tone: granted ? 'warn' : '' }),
    sec('What support access means', h.list([
      { icon: 'eye-off', tone: 'ok', title: 'Support will not see', sub: 'Pay rates, SSNs, bank details, card data, passwords' },
      { icon: 'clock', title: 'Time-boxed', sub: 'Ends automatically; you can revoke at any moment' },
      { icon: 'shield', title: 'Visible on both sides', sub: 'Staff work under a "Viewing as" banner with the ticket number' },
      { icon: 'list', title: 'Logged', sub: 'Every session and action is written to your audit log' },
    ]), { flush: true }),
  ]) + sec('Support access log', h.table([{ k: 0, label: 'When' }, { k: 1, label: 'Who' }, { k: 2, label: 'Why' }, { k: 3, label: 'Scope' }, { k: 4, label: 'Granted by' }, { k: 5, label: 'Status', fmt: v => h.pill(esc(v), v === 'Active' ? 'warn' : '') }], (granted ? [[c.today.short, 'Maya S. (Rootline Support)', 'Ticket 4821', (kind === 'view' ? 'View only' : 'View and change') + ', 72 h', c.who, 'Active']] : []).concat(log), { dense: true }) + h.note('Consent, scope and a visible log for every session (02 §7.6).'), { flush: true });
  else if (tab === 'mfa') body = h.cols('2', [
    sec('Sign-in policy', h.table([{ k: 0, label: 'Who' }, { k: 1, label: 'Requirement' }, { k: 2, label: 'Enrolled', n: true }], [['Owner', 'Passkey, or password + MFA', '1 / 1'], ['Office roles', 'MFA required', `${seats(c).office - 1} / ${seats(c).office - 1}`], ['Bookkeeper', 'MFA required (TOTP or passkey)', '1 / 1'], ['Crew leads and technicians', 'Phone OTP + app PIN or biometrics', 'n/a'], ['Clients', 'Magic link; passkey optional', 'n/a']], { dense: true }) + `<div class="cols cols-2">${h.field('Session length (office)', can ? h.select(['12 hours', '7 days', '30 days'], '7 days') : h.input('7 days', { ro: true }))}${h.field('Step-up for sensitive data', can ? h.select(['Passkey or MFA, every 15 min', 'Every time'], 'Passkey or MFA, every 15 min') : h.input('Passkey or MFA, every 15 min', { ro: true }))}</div>`, { flush: false }),
    sec('Your sessions', h.table([{ k: 0, label: 'Device' }, { k: 1, label: 'Where' }, { k: 2, label: 'Last active' }], [['Safari on iPhone (this device)', esc(c.t.city), 'Now'], ['Chrome on Mac', esc(c.t.city), '2 h ago'], ['Rootline app on iPad', esc(c.t.city), 'Yesterday']], { dense: true }) + `<div class="flex">${tbtn('Sign out everywhere else', 'Signed out of 2 other sessions.', { sm: true })}</div>`, { flush: true }),
  ]);
  else if (tab === 'audit') body = sec('Audit log', h.table([{ k: 0, label: 'When' }, { k: 1, label: 'Who' }, { k: 2, label: 'Action', fmt: v => `<b>${esc(v)}</b>` }, { k: 3, label: 'Detail', fmt: v => `<span class="tiny">${esc(v)}</span>` }], audit, { dense: true }) + `<div class="flex">${tbtn('Export CSV', 'Audit log exported.', { sm: true, icon: 'download' })}<span class="tiny t3">Kept 7 years. Security events about owners are not shown to other roles.</span></div>`, { flush: true });
  else body = c.has('sso') ? sec('Single sign-on ' + h.tag('V1'), `<div class="cols cols-2">${h.field('Protocol', h.select(['SAML 2.0', 'OIDC'], 'SAML 2.0'))}${h.field('IdP metadata URL', h.input('https://idp.example.com/metadata.xml', { ro: !can }))}</div>` + tg('Require SSO for office roles', 'sc.sso', true) + h.note('Field roles keep phone OTP + PIN. SCIM provisioning arrives at V2.'))
    : `<div>${inlineLock(c, 'sso')}</div>` + h.note('SSO (SAML or OIDC) is Enterprise only and ships at V1.');
  return h.page({ title: 'Security and audit log', sub: `MFA on for every office user · ${granted ? '1 active support session' : 'no active support sessions'}`, actions: roPill(c, 'security_policy') })
    + h.tabs('sc.tab', [['access', 'Support access', granted ? 1 : 1], ['mfa', 'MFA and sessions'], ['audit', 'Audit log'], ['sso', 'SSO ' + (c.has('sso') ? h.tag('V1') : icon('lock', 's'))]], 'access') + body;
});

})();
