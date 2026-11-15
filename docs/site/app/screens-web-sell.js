/* screens-web-sell: Today, Inbox, Clients, Sales and Design screens for the Company web app.
   Registered with RL.screen(id, fn). Shared helpers live at the top of this IIFE. */
(() => {
'use strict';
const RL = window.RL, h = RL.h, { esc, icon, money, num, kmoney } = h;

// ---------- shared helpers ----------
const U = (k, d) => (RL.ui[k] != null && RL.ui[k] !== '') ? RL.ui[k] : d;
const first = n => String(n || '').replace(/^The /, '').split(/[\s,(]/)[0];
const castOf = (c, role, fb) => (c.t.cast && c.t.cast[role]) || fb || (c.roleObj && c.roleObj.key === role ? c.who : c.owner);
const ZONES = { 'Central Ohio': '6a', 'Chicagoland and Northwest Indiana': '5b-6a', 'Southeast Michigan and Toledo': '6a', 'Southeast Wisconsin': '5b', 'West Michigan': '6a', 'Great Lakes + Wave 2': '5b-6b' };
const zoneOf = c => ZONES[c.t.region] || '6a';
const ar30 = D => D.aging.d30 + D.aging.d60 + D.aging.d90;
const arAll = D => D.aging.current + ar30(D);
const snowy = c => c.mod('snow_lite') || c.mod('snow_ice');
const solo = c => c.t.people_peak <= 3;
const designOnly = c => c.t.modules.includes('design_only');
const mk = (title) => `<span class="masked" title="${esc(title)}">•••</span>`;
const st = (s) => `<span style="${s}"></span>`;
const pct1 = n => (Math.round(n * 10) / 10).toFixed(1) + '%';
const pctR = n => Math.round(n) + '%';
const sum = (a, f) => a.reduce((s, x) => s + (f ? f(x) : x), 0);
const hsh = s => { let v = 7; for (const ch of String(s)) v = (v * 31 + ch.charCodeAt(0)) >>> 0; return v; };
const statTone = s => ({ Draft: '', 'In review': 'info', Sent: 'info', Viewed: 'accent', Approved: 'ok', Signed: 'ok', Declined: 'danger', Won: 'ok', Lost: 'danger', 'Client review': 'accent', 'In progress': 'info', 'As-built': 'ok', Overdue: 'danger', Paid: 'ok', Pending: 'warn', 'Pending client': 'warn', Applied: 'ok', Rejected: 'danger' }[s] || '');
const stPill = s => h.pill(esc(s), statTone(s));
const grid = (cols, items, gap) => `<div style="display:grid;grid-template-columns:${cols};gap:${gap || 12}px;align-items:start;min-width:0">${items.join('')}</div>`;
const row = (l, r, o) => `<div class="flex between nw small" style="${o || ''}"><span class="t2" style="min-width:0;overflow:hidden;text-overflow:ellipsis">${l}</span><span class="num nowrap">${r}</span></div>`;
const ownName = (c, by) => by === c.who;

// What contact detail a role sees (02 §10.2 client_contact)
const contactView = c => { if (!c.sees('client_contact')) return 'none'; const v = c.fc('client_contact'); if (/masked/.test(v)) return 'masked'; if (/billing/.test(v)) return 'billing'; return 'full'; };
const contactVal = (c, val, o) => {
  const v = contactView(c);
  if (v === 'full' || (v === 'billing' && o && o.billing)) return esc(val);
  if (v === 'masked') return `<span class="masked" title="Masked: ${esc(c.role)} reaches clients through the relay number, never the real one (02 §10.2, 16 §4.17.2)">relay only</span>`;
  return mk(`Hidden: client_contact is ${c.fc('client_contact')} for ${c.role} (02 §10.2)`);
};
// Client financial: full ledger, status chip, or nothing (02 §10.2 client_financial)
const finView = c => (c.fc('client_financial') === 'status chip' ? 'chip' : c.sees('client_financial') ? 'full' : 'none');
const arChip = cl => cl.pastDue ? h.pill(`Past due ${cl.pastDue} d`, 'danger') : cl.balance ? h.pill('Open balance', 'warn') : h.pill('Current', 'ok');
const balCell = (c, cl) => { const v = finView(c); return v === 'full' ? (cl.balance ? money(cl.balance) : '$0') : v === 'chip' ? arChip(cl) : mk(`Hidden: client_financial is not visible to ${c.role} (02 §10.2)`); };
// A field-class value that may be limited to own records ("RW (own)")
const fcOwn = (c, fc, own, value) => {
  if (!c.sees(fc)) return h.mask(c, fc, value);
  if (/\(own\)/.test(c.fc(fc)) && !own) return mk(`Hidden: ${fc} is visible to ${c.role} on own records only (02 §10.2)`);
  return value;
};
const seesOwn = (c, fc, own) => c.sees(fc) && (!/\(own\)/.test(c.fc(fc)) || own);
const marginCell = (c, gm, net, own, floor) => {
  const fl = floor == null ? 10 : floor;
  if (seesOwn(c, 'margin', own)) return h.pill(pct1(gm) + ' GM', net < 0 ? 'danger' : net < fl ? 'warn' : 'ok');
  if (/indicator/.test(c.fc('margin'))) return h.pill(net < 0 ? 'Below break-even' : net < fl ? 'Below floor' : 'On target', net < 0 ? 'danger' : net < fl ? 'warn' : 'ok');
  return h.mask(c, 'margin', '');
};
// Lock pill for a plan-gated sub-feature (owners can click through to the subscription page)
const lockPill = (c, key, label) => {
  const f = c.feat(key), u = (f.unlock || [])[0];
  const to = u ? (u.kind === 'addon' ? u.name + ' add-on' : u.name + ' plan') : 'Not available';
  const txt = `${icon('lock', 's')}${label ? esc(label) + ': ' : ''}${esc(to)}`;
  return c.role === 'owner' ? `<span class="pill warn" role="button" tabindex="0" style="cursor:pointer" data-go="web.settings.subscription" title="${esc((RL.idx.FEATS[key] || {}).name || key)}${u ? ' · ' + esc(u.price) : ''}">${txt}</span>` : `<span class="pill" title="Ask ${esc(c.owner)} (owner) to upgrade">${txt}</span>`;
};
const aiLeft = c => c.plan.ai_credits ? Math.max(0, c.plan.ai_credits - c.D.kpi.aiUsed) : null;
const creditLine = (c, cost) => { const l = aiLeft(c); return l == null ? `${cost} credits from purchased packs (Design Solo allotment not yet set)` : `Uses ${cost} credits. ${num(l)} of ${num(c.plan.ai_credits)} left this month.`; };
const avs = names => `<span class="flex gap4 nw">${names.filter(Boolean).map(n => h.avatar(n)).join('')}</span>`;
const seg = (key, opts, def) => `<span class="flex gap4">${opts.map(([v, l]) => h.btn(l, { sm: true, ui: key, val: v, pressed: String(U(key, def) === v), kind: U(key, def) === v ? 'primary' : '' })).join('')}</span>`;

// ---------- plants (Plant KB lens, 12) ----------
const NATIVE = /Sumac|Bluestem|Coneflower|Serviceberry|Chokeberry|Dropseed|Wild Ginger|Swamp White Oak|Sea Oats/;
const rating = p => {
  const r = p.rating;
  if (/^Recommended/.test(r)) return { k: 'rec', l: 'Recommended', tone: 'ok', n: /Bluestem|Dropseed|Serviceberry|Oak|Coneflower|Sumac/.test(p.common) ? 5 : 4 };
  if (/^Use with care/.test(r)) return { k: 'care', l: 'Use with care', tone: 'warn', n: 3, why: (r.match(/\((.*)\)/) || [])[1] || '' };
  if (/^Not recommended/.test(r)) return { k: 'not', l: 'Not recommended', tone: 'danger', n: 1, why: (r.match(/\((.*)\)/) || [])[1] || '' };
  return { k: 'inv', l: 'Invasive', tone: 'danger', n: 0, why: 'listed invasive, do not plant' };
};
const ratingPill = p => { const r = rating(p); return h.pill(r.l + (r.n ? ` ${r.n}/5` : ''), r.tone); };
const pcode = p => { const w = p.botanical.replace(/'[^']*'/g, m => m).split(/\s+/).filter(x => x !== 'x'); const g = (w[0] || '').replace(/'/g, '').slice(0, 3).toUpperCase(); const s = (w[1] || '').replace(/'/g, '').slice(0, 3).toUpperCase(); return g + ' ' + s; };
const plantPrice = p => ({ Tree: 485, Shrub: 85, Perennial: 28, Grass: 26, Groundcover: 14 }[p.type] || 40);
const plantSize = p => ({ Tree: '8 ft B&B', Shrub: '#3', Perennial: '#1', Grass: '#1', Groundcover: 'plug' }[p.type] || '#1');
const PL = name => RL.PLANTS.find(p => p.common === name);

// ---------- estimating engine (03 EST-02, EST-05, EST-09) ----------
const BURDEN = 28.16, FLH = 21, NET_T = [12, 14, 9, 16, 11, 6, 13, 15, 10, 12];
const catOf = t => /consultation|Concept|Planting plan/i.test(t) ? 'fee' : /patio|wall|walk|path|fire pit|backyard|renovation|refresh|Hardscape/i.test(t) ? 'build' : /Snow|Salt/i.test(t) ? 'snow' : /Irrigation|Backflow|Controller|Winter|start-up/i.test(t) ? 'irr' : /Light/i.test(t) ? 'light' : /Round|Grub|aeration|Overseed|fertil|weed/i.test(t) ? 'lawn' : /mow|Commercial maintenance/i.test(t) ? 'maint' : /planting|foundation|garden|border|shade|screen|design|Tree/i.test(t) ? 'plant' : 'enh';
// Base line library per category: [name, qty, unit, rate (units per man-hour, 0 = none), material $/unit, equipment $, sub $, kit?, tier] tier: g = in all, b = better+, x = best only
const LINES = {
  build: [['Layout, demo and haul-away', 1, 'lump', 0.12, 0, 180, 0, '', 'g'], ['Paver patio, herringbone', 320, 'sq ft', 4.21, 7.12, 625, 0, 'Paver patio per sq ft v3', 'g'], ['Seat wall and fire pit kit', 18, 'lin ft', 0.9, 58, 120, 0, 'Seat wall per lin ft v2', 'b'], ['Bed prep and soil amendment', 1574, 'sq ft', 120, 0.22, 95, 0, '', 'g'], ['Mulch, double-shred hardwood, 3 in', 15, 'cu yd', 0.75, 32, 0, 0, 'Mulch install v4', 'g'], ['Plants from takeoff (86)', 86, 'ea', 3.2, 31, 0, 0, '', 'g'], ['Steel edging', 229, 'lin ft', 25, 3.1, 0, 0, '', 'b'], ['Low-voltage lighting, 10 fixtures', 10, 'ea', 1.35, 118, 0, 0, 'Lighting per fixture v1', 'x'], ['Irrigation drip for new beds (sub)', 1, 'lump', 0, 0, 0, 1450, '', 'x'], ['Mobilization', 1, 'lump', 0.06, 0, 0, 0, '', 'g']],
  plant: [['Bed prep and soil amendment', 900, 'sq ft', 120, 0.22, 95, 0, '', 'g'], ['Mulch, double-shred hardwood, 3 in', 9, 'cu yd', 0.75, 32, 0, 0, 'Mulch install v4', 'g'], ['Shrubs #3 from palette', 24, 'ea', 4, 26, 0, 0, '', 'g'], ['Perennials and grasses #1', 60, 'ea', 10, 7.5, 0, 0, '', 'b'], ['Serviceberry 8 ft B&B', 3, 'ea', 0.5, 185, 60, 0, '', 'b'], ['Steel edging', 140, 'lin ft', 25, 3.1, 0, 0, '', 'b'], ['Drip conversion (sub)', 1, 'lump', 0, 0, 0, 980, '', 'x'], ['Mobilization', 1, 'lump', 0.12, 0, 0, 0, '', 'g']],
  maint: [['Mowing, 60 in ZTR, weekly', 30, 'visit', 1.4, 0, 9, 0, 'Mowing visit model v2', 'g'], ['String trimming and edging', 30, 'visit', 2.4, 0, 1.5, 0, '', 'g'], ['Blowing hardscape', 30, 'visit', 6, 0, 0.8, 0, '', 'g'], ['Spring cleanup', 1, 'visit', 0.16, 0, 24, 0, 'Cleanup kit v2', 'b'], ['Fall cleanup', 1, 'visit', 0.13, 0, 30, 0, 'Cleanup kit v2', 'b'], ['Mulch top-dress, 2 in', 6, 'cu yd', 0.75, 32, 0, 0, 'Mulch install v4', 'x'], ['Mobilization', 30, 'visit', 4, 0, 0, 0, '', 'g']],
  enh: [['Cleanup, debris level medium', 1, 'visit', 0.08, 0, 40, 0, 'Cleanup kit v2', 'g'], ['Shrub pruning, size class M', 28, 'ea', 6, 0, 0, 0, '', 'g'], ['Bed edging, spade-cut', 320, 'lin ft', 60, 0, 0, 0, '', 'b'], ['Mulch, double-shred hardwood, 2 in', 8, 'cu yd', 0.75, 32, 0, 0, 'Mulch install v4', 'b'], ['Disposal, 1 dump-trailer load', 1, 'load', 0, 60, 0, 0, '', 'g'], ['Pre-emergent in beds', 1, 'lump', 2, 45, 0, 0, '', 'x'], ['Mobilization', 1, 'lump', 0.5, 0, 0, 0, '', 'g']],
  irr: [['Irrigation service visit', 10, 'zone', 4, 6, 0, 0, 'Irrigation per zone v2', 'g'], ['Head replacements, rotor', 8, 'ea', 3, 24, 0, 0, '', 'g'], ['Backflow test and report', 1, 'ea', 1.5, 0, 0, 0, '', 'b'], ['Controller upgrade, smart, 12 zone', 1, 'ea', 0.5, 289, 0, 0, '', 'x'], ['Mobilization', 1, 'lump', 1.5, 0, 0, 0, '', 'g']],
  snow: [['Snow push, per event', 12, 'event', 0.4, 0, 85, 0, 'Snow per event v1', 'g'], ['Salt application, per event', 12, 'event', 1.2, 64, 22, 0, '', 'g'], ['Walks, hand shovel and ice melt', 12, 'event', 1, 18, 0, 0, '', 'b'], ['Snow relocation (sub, per hour)', 6, 'hour', 0, 0, 0, 165, '', 'x'], ['Site set-up and staking', 1, 'lump', 0.2, 60, 0, 0, '', 'g']],
  light: [['Path lights, brass', 8, 'ea', 1.35, 118, 0, 0, 'Lighting per fixture v1', 'g'], ['Uplights, trees', 4, 'ea', 1.1, 132, 0, 0, '', 'b'], ['Transformer 300 W, smart timer', 1, 'ea', 0.5, 340, 0, 0, '', 'g'], ['Wire runs, 12/2', 260, 'lin ft', 60, 0.85, 0, 0, '', 'g'], ['Night design visit', 1, 'visit', 0.5, 0, 0, 0, '', 'x']],
  lawn: [['Round application, granular', 5, 'round', 0.25, 72, 6, 0, 'Lawn program round v3', 'g'], ['Grub preventive', 1, 'round', 0.25, 95, 6, 0, '', 'b'], ['Core aeration', 1, 'visit', 0.33, 0, 38, 0, '', 'b'], ['Overseeding, tall fescue blend', 1, 'visit', 0.4, 120, 10, 0, '', 'x'], ['Mobilization', 7, 'visit', 4, 0, 0, 0, '', 'g']],
  fee: [['Site consultation and measure', 3, 'h', 1, 0, 0, 0, '', 'g'], ['Concept plan, 2 options', 8, 'h', 1, 0, 0, 0, '', 'g'], ['Planting plan with plant list', 6, 'h', 1, 0, 0, 0, '', 'b'], ['AI mockups (2 sets)', 2, 'set', 4, 6, 0, 0, '', 'b'], ['Install coordination visits', 2, 'visit', 0.5, 0, 0, 0, '', 'x']],
};
const RNDQ = (q, u) => u === 'lump' || u === 'visit' && q < 3 ? Math.max(1, Math.round(q)) : q >= 100 ? Math.round(q / 5) * 5 : q >= 10 ? Math.round(q) : Math.max(1, Math.round(q * 2) / 2);
function lineCost(l) {
  const mh = l.rate ? l.qty / l.rate : 0;
  const lab = mh * BURDEN, mat = l.qty * l.mat * (l.mat ? 1.05 : 0), eq = l.eq * (l.unit === 'visit' || l.unit === 'event' ? l.qty : 1), sub = l.sub * (l.unit === 'hour' ? l.qty : 1);
  return Object.assign(l, { mh, lab, matc: mat, eqc: eq, subc: sub, direct: lab + mat + eq + sub, oh: mh * FLH });
}
const sumL = (ls) => { const s = { mh: 0, lab: 0, matc: 0, eqc: 0, subc: 0, direct: 0, oh: 0 }; ls.forEach(l => Object.keys(s).forEach(k => { s[k] += l[k]; })); return s; };
// Derived view of an estimate: title/client follow the linked proposal so lists and editors agree.
function estOf(c, e) {
  const D = c.D, p = D.proposals.find(x => x.estimate === e.id);
  return Object.assign({}, e, p ? { title: p.title, client: p.client, clientId: p.clientId } : {});
}
const findEst = (c, id) => { const D = c.D; const e = D.estimates.find(x => x.id === id) || D.estimates[0]; return estOf(c, e); };
function estModel(c, e0) {
  const D = c.D, e = estOf(c, e0), idx = Math.max(0, D.estimates.findIndex(x => x.id === e.id));
  const net = NET_T[idx % NET_T.length], cat = catOf(e.title);
  const base = LINES[cat].map(([name, qty, unit, rate, mat, eq, sub, kit, tier]) => lineCost({ name, qty, unit, rate, mat, eq, sub, kit, tier }));
  const better = base.filter(l => l.tier !== 'x'), bs = sumL(better);
  const f = (e.value * (1 - net / 100)) / (bs.direct + bs.oh);
  const lines = base.map(l => lineCost(Object.assign({}, l, { qty: RNDQ(l.qty * f, l.unit), eq: l.eq * (l.unit === 'visit' || l.unit === 'event' ? 1 : f), sub: l.sub * (l.unit === 'hour' ? 1 : f) })));
  const tier = (t) => { const ls = lines.filter(l => t === 'good' ? l.tier === 'g' : t === 'better' ? l.tier !== 'x' : true); const s = sumL(ls); const be = s.direct + s.oh; const price = t === 'better' ? e.value : Math.ceil(be / (1 - net / 100) / 5) * 5; return Object.assign(s, { lines: ls, be, price, gm: 100 * (price - s.direct) / price, net: 100 * (price - be) / price, markup: 100 * (price - s.direct) / s.direct }); };
  const T = { good: tier('good'), better: tier('better'), best: tier('best') };
  return { e, cat, net, lines, T, gm: T.better.gm, netAct: T.better.net, own: ownName(c, e.by) };
}

// ---------- weather and season ----------
const wxNow = c => c.winter ? (snowy(c) ? { t: '19°F', s: 'Snow 3-5 in after 9 pm', ic: 'snow', tone: 'info' } : { t: '24°F', s: 'Clear, frozen ground', ic: 'sun', tone: '' }) : { t: '61°F', s: 'Rain 70% after 1 pm', ic: 'rain', tone: 'warn' };
const atRisk = c => { const n = c.D.visits.filter(v => parseInt(v.start, 10) >= 12 && v.status === 'Scheduled').length; return n || Math.min(14, c.D.visits.length); };
function weatherStrip(c) {
  const r = atRisk(c);
  const days = c.winter
    ? [['Tue', 'snow', '19°F', snowy(c) ? 'Snow 3-5 in overnight: 2 in push trigger armed' : 'Clear and cold', snowy(c) ? 'info' : ''], ['Wed', 'thermo', '14°F', snowy(c) ? 'Refreeze: salt refresh on priority sites' : 'Office day: spring designs', snowy(c) ? 'warn' : ''], ['Thu', 'sun', '27°F', 'Clear: dormant pruning OK', 'ok'], ['Fri', 'cloud', '30°F', 'Flurries under 1 in', ''], ['Sat', 'sun', '33°F', 'Clear', '']]
    : [['Tue', 'rain', '61°F', `Rain 70% after 1 pm: ${r} visits at risk`, 'warn'], ['Wed', 'sun', '66°F', 'Clear: catch-up capacity 9 h', 'ok'], ['Thu', 'wind', '64°F', 'Wind 16 mph: hold spray after 11 am', 'warn'], ['Fri', 'sun', '70°F', 'Clear', ''], ['Sat', 'cloud', '68°F', 'Cloudy, dry', '']];
  return h.card({ title: `Weather impact: next 5 days`, sub: `${esc(c.t.city)} · ${c.winter ? 'snow and planning season' : 'peak season'}`, body: `<div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px">${days.map(([d, ic, t, s, tone]) => `<div style="border:1px solid var(--border);border-radius:8px;padding:8px;background:${tone ? `var(--${tone}-bg)` : 'var(--surface-2)'}"><div class="flex between nw"><b class="small">${d}</b><span class="small num">${icon(ic, 's')} ${t}</span></div><div class="tiny t2" style="margin-top:4px">${s}</div></div>`).join('')}</div>`, actions: c.winter ? '' : h.btn('Review moves', { sm: true, act: 'td-moves' }) });
}
RL.act('td-moves', (el, ev, c) => { RL.toast(`Rain plan: ${atRisk(c)} afternoon visits moved to Wednesday (draft). Clients get a notice when you confirm.`); return false; });

// ---------- Today (21 §6.3, 17 A1) ----------
const greet = (c) => {
  const w = wxNow(c);
  return h.page({ title: `Good morning, ${esc(first(c.who))}`, sub: `${esc(c.today.label)} · ${icon(w.ic, 's')} ${w.t}, ${esc(w.s)}`,
    tags: `${h.pill(esc(c.roleObj.name), 'info')}${h.pill(esc(c.seg.id + ' · ' + c.seg.name))}${c.winter ? h.pill(snowy(c) ? 'Snow and planning season' : 'Planning and sales season', 'accent') : h.pill('Peak season', 'ok')}`,
    actions: h.btn('Customize Today', { icon: 'sliders', act: 'td-custom' }) + (c.allowed('copilot.use') ? h.btn('Ask Copilot', { kind: 'ai', icon: 'spark', modal: 'copilot' }) : '') });
};
RL.act('td-custom', () => { RL.toast('Customize Today (V1): add, remove and reorder widgets, with Move up / Move down for keyboard users (21 §6.3).'); return false; });
RL.act('td-do', (el, ev, c) => { RL.ui['td-done-' + el.dataset.val] = '1'; RL.toast(esc(el.title || 'Done') + ' (mock). Logged to the audit trail.'); });
RL.act('td-undo', (el) => { RL.ui['td-done-' + el.dataset.val] = ''; });
const doneOr = (key, btns, label) => RL.ui['td-done-' + key] ? `<span class="pill ok">${icon('check', 's')}${label || 'Done'}</span><button type="button" class="btn sm ghost" data-act="td-undo" data-val="${esc(key)}">Undo</button>` : btns;
const actBtn = (label, key, kind, title) => `<button type="button" class="btn sm${kind ? ' ' + kind : ''}" data-act="td-do" data-val="${esc(key)}" title="${esc(title || label)}">${label}</button>`;

function topEstForApproval(c) {
  const D = c.D;
  const list = D.estimates.map(e => estModel(c, e)).filter(m => m.e.value > 15000 && m.e.by !== c.owner);
  return list[0] || estModel(c, D.estimates[1] || D.estimates[0]);
}
function attentionItems(c) {
  const D = c.D, W = c.winter, items = [];
  const ap = topEstForApproval(c);
  const late = D.crews[1] || D.crews[0];
  const od = D.invoices.find(i => i.status === 'Overdue');
  const pv = D.proposals.find(p => /3 views/.test(p.viewed) && p.status !== 'Signed') || D.proposals[1];
  const ts = D.timesheets.filter(t => t.status === 'Pending').length;
  const ag = D.agreements.filter(a => a.client !== D.res.client)[0] || D.agreements[0];
  if (W && snowy(c)) items.push({ icon: 'snow', tone: 'info', title: `Storm armed: 3-5 in forecast after 9 pm, push trigger 2 in`, sub: `${Math.max(1, Math.min(D.crews.length, 4))} crews on call${c.mod('snow_ice') ? ', 1 sub, 26 sites in priority order' : ', snow route of 9 sites'}`, right: h.btn('Storm plan', { sm: true, go: 'web.snow' }), k: 'storm' });
  if (ap) items.push({ icon: 'approve', tone: 'warn', title: `Approve ${esc(ap.e.id)} ${esc(ap.e.client)} ${money(ap.e.value)}`, sub: `${esc(ap.e.title)} · over ${esc(first(ap.e.by))}'s $15,000 limit · ${seesOwn(c, 'margin', true) ? `margin ${pct1(ap.gm)} gross, ${pct1(ap.netAct)} net` : ''}`, right: doneOr('ap', actBtn('Approve', 'ap', 'primary', `Approved ${ap.e.id}`) + h.btn('Open', { sm: true, go: 'web.estimate', x: ap.e.id }), 'Approved'), k: 'ap' });
  if (!W && late) items.push({ icon: 'truck', tone: 'warn', title: `${esc(late.name)} running 35 min late (stop 6 of ${D.visits.filter(v => v.crew === late.name).length || 11})`, sub: `${esc(late.lead)} · traffic on I-270 · 2 clients get an updated arrival text`, right: doneOr('late', actBtn('Message crew', 'late', '', 'Message sent to ' + late.lead)), k: 'late' });
  if (W) items.push({ icon: 'refresh', tone: 'warn', title: `3 renewals over 8% need your approval`, sub: `Margin-target escalators on last season's actual hours (03 REN-02)`, right: h.btn('Review', { sm: true, go: 'web.renewals' }), k: 'ren' });
  if (od) items.push({ icon: 'dollar', tone: 'danger', title: `${esc(od.id)} ${esc(od.client)} ${money(od.balance)} overdue 31 days`, sub: od.po ? `${esc(od.po)} on file · reminder 2 of 3 drafted (A5)` : 'Reminder 2 of 3 drafted (A5)', right: doneOr('od', actBtn('Send reminder', 'od', '', 'Reminder sent for ' + od.id), 'Sent'), k: 'od' });
  if (ts && !W) items.push({ icon: 'clock', tone: '', title: `${ts} timesheets need approval`, sub: `${esc(D.crews[0] ? D.crews[0].name : 'Crew')} and 2 more · 1 missed lunch punch`, right: doneOr('ts', actBtn('Approve all', 'ts', '', 'Timesheets approved'), 'Approved'), k: 'ts' });
  if (W) items.push({ icon: 'box', tone: '', title: `Nursery pre-buy PO-3311 ${money(Math.round(D.kpi.revenueLY * 0.0043 / 10) * 10)}`, sub: 'Early-order discount 8% ends Jan 15 · spring install backlog 7.5 weeks', right: doneOr('po', actBtn('Approve', 'po', '', 'PO-3311 approved')), k: 'po' });
  if (pv) items.push({ icon: 'eye', tone: 'info', title: `${esc(pv.id)} viewed 3 times, unsigned`, sub: `${esc(pv.client)} · ${money(pv.value)} · last view 2 h ago on iPhone`, right: doneOr('pv', actBtn('Nudge', 'pv', '', 'Nudge sent to ' + pv.client), 'Nudged'), k: 'pv' });
  if (ag && !W) items.push({ icon: 'refresh', tone: '', title: `Renewal due: ${esc(ag.client)}`, sub: `${esc(ag.name)} · renews ${esc(ag.renews)} · ${esc(ag.escalator)}`, right: doneOr('ag', actBtn('Draft renewal', 'ag', '', 'Renewal drafted'), 'Drafted'), k: 'ag' });
  if (W) items.push({ icon: 'user', tone: '', title: `${D.people.filter(p => p.status === 'hibernated').length || 2} field seats hibernated`, sub: 'Not billed until reactivated (22 §4.3) · 2 return Feb 1 for dormant pruning', right: h.btn('Team', { sm: true, go: 'web.people' }), k: 'hib' });
  return items;
}
function briefing(c, o) {
  o = o || {};
  const D = c.D, W = c.winter, r = atRisk(c);
  if (!c.has('agents_mvp')) return h.card({ title: 'Daily Owner Briefing', sub: 'Agent A1', body: `<p class="small t2">The morning briefing with three one-tap decisions is not part of ${esc(c.plan.name)}.</p><div class="flex">${lockPill(c, 'agents_mvp', 'A1')}</div>` });
  const job = D.jobs.find(j => j.actualHrs > j.budgetHrs) || D.jobs[1];
  const leadsN = D.leads.filter(l => l.status === 'New').length;
  const pv = D.proposals.filter(p => /3 views/.test(p.viewed) && p.status !== 'Signed').length;
  const ap = topEstForApproval(c);
  const bullets = W ? [
    snowy(c) ? `Snow 3-5 in after 9 pm. The ${c.mod('snow_ice') ? 'storm event' : 'snow route'} is armed at a 2 in push trigger; ${Math.max(1, Math.min(D.crews.length, 4))} crews on call.` : 'Cold and dry all week: a good week to finish spring designs and send renewals.',
    `Renewals: ${D.agreements.length} agreements renew this season; 7 signed, 3 increases over 8% wait for you.`,
    `Cash ${kmoney(D.kpi.cash)}; deposits held ${kmoney(D.kpi.deposits)}. AR over 30 days ${money(ar30(D))}.`,
    `Spring sales: ${leadsN + 9} early-bird requests, ${pv} proposals viewed 3+ times unsigned, backlog ${D.kpi.backlogWeeks} weeks.`,
    `${D.people.filter(p => p.status === 'hibernated').length || 2} field seats hibernated and not billed; 1 applicator license renews in 30 days.`,
  ] : [
    `Rain 70% after 1 pm: ${r} afternoon visits at risk. Moves to Wednesday are drafted.`,
    `Yesterday: ${D.kpi.visitsToday - 3} of ${D.kpi.visitsToday} visits done; ${esc(job.crew)} ran ${Math.max(2, job.actualHrs - job.budgetHrs)} h over on ${esc(job.id)}.`,
    `Cash: ${money(D.kpi.deposits)} in deposits this month; a Stripe payout of $4,812 lands today. AR over 30 days ${money(ar30(D))}.`,
    `Sales: ${leadsN} new leads, all answered in under 5 minutes; ${pv || 1} proposal viewed 3+ times, unsigned.`,
    `People: 1 applicator license expires in 30 days; overtime risk on ${esc(D.crews[0] ? D.crews[0].name : 'Crew 1')} Friday.`,
  ];
  const decisions = W ? [
    ['d1', `Renewal at +6.5%: ${esc((D.agreements[1] || D.agreements[0]).client)}`, money(Math.round((D.agreements[1] || D.agreements[0]).value * 1.065))],
    ['d2', 'Nursery pre-buy PO-3311 (8% early-order discount)', money(Math.round(D.kpi.revenueLY * 0.0043 / 10) * 10)],
    ['d3', snowy(c) ? 'Call in 1 snow sub tonight for overflow sites' : `Send ${esc(D.proposals[0].id)} revised options`, snowy(c) ? '$165/h, 6 h cap' : money(D.proposals[0].value)],
  ] : [
    ['d1', `Approve ${esc(ap.e.id)} ${esc(ap.e.client)}`, money(ap.e.value)],
    ['d2', `Move ${r} afternoon visits to Wednesday`, `${r} clients notified`],
    ['d3', 'Nursery PO-3311 for next week\'s installs', money(2640)],
  ];
  const decHtml = decisions.map(([k, l, v]) => `<div class="flex between nw" style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:6px 8px"><span class="small" style="min-width:0"><b>${l}</b> <span class="t3">${v}</span></span><span class="flex nw gap4">${doneOr(k, actBtn('Approve', k, 'primary', l.replace(/<[^>]+>/g, '')) + actBtn('Later', k + 'x', 'ghost', 'Snoozed until tomorrow'), 'Approved')}</span></div>`).join('');
  const body = `<ul class="small" style="margin:0;padding-left:18px;display:grid;gap:4px">${bullets.map(b => `<li>${b}</li>`).join('')}</ul>
    <div class="tiny t3" style="font-weight:700;text-transform:uppercase;letter-spacing:.05em">3 decisions</div><div class="stack8">${decHtml}</div>`;
  return h.aiCard({ agent: o.variant ? `Daily briefing for ${esc(c.roleObj.name.toLowerCase())} (A1)` : 'Daily Owner Briefing (A1)', level: 'L2', credits: 2, title: `Assembled 6:15 am · ${o.variant ? 'role variant' : '2-minute read'}`, body, why: 'Numbers come from deterministic queries and pass the grounding check; bank feed synced 5:58 am. Approvals still run your permission checks.', actions: h.btn('Listen (+1 cr)', { sm: true, icon: 'play', act: 'td-audio' }) + h.btn('Open approvals', { sm: true, go: 'web.estimates' }) });
}
RL.act('td-audio', () => { RL.toast('Audio briefing queued: about 2 minutes, English (1 credit).'); return false; });

function attentionCard(c, items, title) {
  const done = items.filter(i => RL.ui['td-done-' + i.k]).length;
  const body = items.length ? h.list(items.map(i => ({ icon: i.icon, tone: i.tone, title: i.title, sub: i.sub, right: i.right }))) : h.empty('Nothing needs you right now. All crews are on schedule.');
  return h.card({ title: `${title || 'Needs your attention'} (${items.length - done})`, sub: 'Ranked by money at risk and urgency', body, flush: true });
}
function ownerKpis(c) {
  const D = c.D, W = c.winter;
  const mtd = W ? Math.round(D.kpi.revenueMTD * (snowy(c) ? 0.42 : 0.2)) : D.kpi.revenueMTD;
  return h.kpis([
    { label: 'Cash (operating + Stripe)', value: kmoney(D.kpi.cash), delta: 'Payout $4,812 today', tone: 'ok' },
    { label: 'AR open', value: h.mask(c, 'client_financial', money(arAll(D))), delta: `${money(ar30(D))} over 30 days`, tone: ar30(D) ? 'warn' : 'ok' },
    { label: 'Deposits held', value: kmoney(D.kpi.deposits), delta: 'Liability until applied', tone: 'info' },
    { label: `Revenue ${W ? 'January' : 'May'} to date`, value: kmoney(mtd), delta: W ? 'Snow and renewals' : '+11% vs last May', tone: W ? 'info' : 'ok' },
    { label: 'Gross margin YTD', value: h.mask(c, 'margin', D.kpi.gm + '%'), delta: 'Target 42%', tone: D.kpi.gm >= 42 ? 'ok' : 'warn' },
  ]);
}
function crewsCard(c, o) {
  const D = c.D;
  if (!D.crews.length) return '';
  if (c.winter) {
    const hib = D.people.filter(p => p.status === 'hibernated').length;
    const body = snowy(c) ? `${h.kv([['Event', `Jan 12-13 storm · 3-5 in · trigger 2 in`], ['On call', `${D.crews.slice(0, 4).map(x => esc(x.name)).join(', ')}`], ['Sites', c.mod('snow_ice') ? '26 in priority order · 4 hospital and retail first' : '9 driveways + 1 lot'], ['Salt', '38 t in the yard · 11 t per event']])}
      ${h.bars([{ label: 'Priority 1 sites', value: 0, max: 8, right: '0 / 8 pushed' }, { label: 'Salt applied', value: 0, max: 26, right: '0 / 26' }])}${h.note('Proof of service: timestamped GPS photos per push from the crew app.')}`
      : h.empty('No field work today. Crews are hibernated until spring.');
    return h.card({ title: snowy(c) ? 'Snow operations' : "Today's operations", sub: `${hib || 2} seats hibernated · not billed`, body, actions: snowy(c) ? h.btn('Snow board', { sm: true, go: 'web.snow' }) : '' });
  }
  const bars = D.crews.slice(0, o && o.max || 6).map((cr, i) => {
    const vs = D.visits.filter(v => v.crew === cr.name), dn = vs.filter(v => v.status === 'Done').length;
    const late = i === 1;
    return { label: `${esc(cr.name)} · ${esc(first(cr.lead))}`, value: dn + (vs.some(v => v.status === 'In progress') ? 0.5 : 0), max: vs.length || 1, tone: late ? 'warn' : '', right: `${dn}/${vs.length}${late ? ' late' : ''}` };
  });
  const mp = h.map({ seed: hsh(c.t.id) % 40, pins: D.visits.filter((v, i) => i % 2 === 0).slice(0, 18).map(v => ({ x: v.x, y: v.y, n: v.stop, tone: v.status === 'Done' ? 'done' : v.status === 'In progress' ? 'ok' : v.status === 'En route' ? 'info' : 'accent', label: v.client + ' · ' + v.service })), route: D.crews.slice(0, 3).map(cr => D.visits.filter(v => v.crew === cr.name).slice(0, 6).map(v => [v.x, v.y])).filter(r => r.length > 1), h: 200, label: 'Crews on the map' });
  return h.card({ title: o && o.map ? 'Crews on the map' : "Today's operations", sub: `Crews out ${D.kpi.crewsOut}/${D.crews.length} · visits ${D.kpi.visitsDone}/${D.kpi.visitsToday} done · 2 issues · 3 upsells flagged`, body: (o && o.map ? mp : '') + h.bars(bars), actions: h.btn('Dispatch', { sm: true, go: 'web.board' }) });
}
function pipelineCard(c) {
  const D = c.D, W = c.winter;
  const out = D.proposals.filter(p => ['Sent', 'Viewed'].includes(p.status));
  const won = D.proposals.filter(p => p.status === 'Signed');
  const stages = ['New', 'Qualified', 'Site visit', 'Designing', 'Proposal sent'];
  return h.card({ title: W ? 'Spring pipeline' : 'Pipeline and proposals out', sub: W ? 'Planning and sales season: book installs before crews return' : 'This week', body: `${grid('repeat(4,minmax(0,1fr))', [['New leads', D.leads.filter(l => l.status === 'New').length + (W ? 9 : 0)], ['Proposals out', out.length], ['Out value', kmoney(sum(out, p => p.value))], [W ? 'Signed since Dec 1' : 'Won this month', kmoney(sum(won, p => p.value))]].map(([l, v]) => `<div><div class="tiny t3">${l}</div><b class="num" style="font-size:1.05rem">${v}</b></div>`), 8)}
    ${h.bars(stages.map(s => { const os = D.opps.filter(o => o.stage === s); return { label: s, value: sum(os, o => o.value * o.prob / 100), right: `${os.length} · ${kmoney(sum(os, o => o.value))}` }; }))}
    ${row('Win rate (90 days)', D.kpi.closeRate + '%')}`, actions: h.btn('Pipeline', { sm: true, go: 'web.pipeline' }) });
}
function designQueue(c, o) {
  const D = c.D, due = ['Today', 'Tomorrow', 'Thu', 'Fri', 'Mon', 'May 20', 'May 22', 'Jan 19', 'Jan 21'];
  const ds = D.designs.filter(d => ['In progress', 'Client review', 'Draft'].includes(d.status));
  return h.card({ title: (o && o.title) || 'Design queue', sub: `${ds.length} open · ${esc(D.designs[0].designer)}`, flush: true, body: h.list(ds.slice(0, (o && o.max) || 5).map((d, i) => ({ icon: 'pen', tone: d.status === 'Client review' ? 'warn' : 'info', title: `${esc(d.id)} ${esc(d.title)}`, sub: `${esc(d.client)} · ${d.plants} plants · ${d.mockups} mockups · budget ${esc(d.budget)}`, right: `${stPill(d.status)}<span class="tiny t3">due ${c.winter ? due[(i + 7) % due.length] : due[i]}</span>`, go: 'web.studio', x: d.id }))), actions: h.btn('All designs', { sm: true, go: 'web.designs' }) });
}
function jobMarginCard(c) {
  const D = c.D;
  const js = D.jobs.filter(j => j.status !== 'Complete').slice(0, 5);
  return h.card({ title: 'Cash, deposits and margin by job', sub: 'Active jobs · budget vs actual hours', body: h.table([
    { k: 'id', label: 'Job', m: true },
    { k: 'client', label: 'Client', fmt: (v, j) => `<div class="small">${esc(v)}</div><div class="tiny t3">${esc(j.title)}</div>` },
    { k: 'value', label: 'Price', n: true, fmt: v => h.mask(c, 'price', money(v)) },
    { k: 'cost', label: 'Margin', n: true, fmt: (v, j) => h.mask(c, 'margin', pctR(100 * (j.value - v) / j.value)) },
    { k: 'actualHrs', label: 'Hours', n: true, fmt: (v, j) => `<span class="${v > j.budgetHrs ? 'b' : ''}" style="color:${v > j.budgetHrs ? 'var(--danger-text)' : 'inherit'}">${v}/${j.budgetHrs}</span>` },
  ], js, { go: 'web.job', dense: true }) });
}
function aiCreditsCard(c, o) {
  const pl = c.plan, used = c.D.kpi.aiUsed;
  return h.card({ title: (o && o.title) || 'AI credits', sub: pl.ai_credits ? `${esc(pl.name)} includes ${num(pl.ai_credits)} per month` : esc(pl.ai_note || ''), body: `${h.meter('Used this month', used, pl.ai_credits || 0)}
    ${h.bars([{ label: 'Mockup sets (40 cr)', value: Math.round(used * .55), tone: 'ai', right: num(Math.round(used * .55)) }, { label: 'Briefings and triage', value: Math.round(used * .2), tone: 'ai', right: num(Math.round(used * .2)) }, { label: 'Estimates from notes (8 cr)', value: Math.round(used * .15), tone: 'ai', right: num(Math.round(used * .15)) }, { label: 'Copilot', value: Math.round(used * .1), tone: 'ai', right: num(Math.round(used * .1)) }])}
    ${h.note('Credit cost is shown before every AI action runs (22 §4.4.1). Packs: 1k $25, 5k $100.')}`, actions: c.role === 'owner' ? h.btn('Buy pack', { sm: true, act: 'td-pack' }) : '' });
}
RL.act('td-pack', () => { RL.toast('Credit pack added (mock): 1,000 credits for $25.'); return false; });

function routeStops(c) {
  const D = c.D, cr = D.crews[0]; if (!cr) return '';
  const vs = D.visits.filter(v => v.crew === cr.name);
  if (c.winter) return h.card({ title: snowy(c) ? 'Snow route tonight' : 'Route and stops', sub: snowy(c) ? 'Trigger 2 in · expected start 3:30 am' : 'No visits scheduled', flush: true, body: snowy(c) ? h.list(D.clients.slice(0, 7).map((cl, i) => ({ icon: 'snow', tone: i < 2 ? 'warn' : 'info', title: `${i + 1}. ${esc(cl.name)}`, sub: `${esc(cl.address)} · ${cl.type === 'residential' ? 'Driveway push' : 'Lot push + salt'}${i < 2 ? ' · priority' : ''}`, right: h.pill(cl.type === 'residential' ? 'Per push $45' : 'Per push $185') }))) : h.empty('Off season: nothing on the route.') });
  return h.card({ title: 'Route and stops', sub: `${vs.length} stops · ${esc(cr.name)} · ${vs.filter(v => v.status === 'Done').length} done`, flush: true, body: h.list(vs.map(v => ({ icon: v.status === 'Done' ? 'check' : v.status === 'In progress' ? 'play' : 'pin', tone: v.status === 'Done' ? 'ok' : v.status === 'In progress' ? 'info' : '', title: `${v.stop}. ${esc(v.client)}`, sub: `${esc(v.start)} · ${esc(v.service)}${v.dog ? ' · dog: ' + esc(v.dog) : ''}`, right: h.pill(esc(v.status), v.status === 'Done' ? 'ok' : v.status === 'In progress' ? 'info' : '') }))), actions: h.btn('Open map', { sm: true, go: 'web.map' }) });
}
function unpaidCard(c) {
  const D = c.D, inv = D.invoices.filter(i => i.balance > 0).slice(0, 5);
  return h.card({ title: 'Unpaid invoices', sub: `${inv.length} open · ${money(sum(inv, i => i.balance))}`, flush: true, body: h.list(inv.map(i => ({ icon: 'receipt', tone: i.status === 'Overdue' ? 'danger' : i.status === 'Draft' ? '' : 'info', title: `${esc(i.client)} · ${money(i.balance)}`, sub: `${esc(i.id)} · ${esc(i.status)} · due ${esc(i.due)}`, right: i.status === 'Draft' ? doneOr('sd' + i.id, actBtn('Send', 'sd' + i.id, '', 'Sent ' + i.id), 'Sent') : doneOr('rm' + i.id, actBtn('Remind', 'rm' + i.id, '', 'Reminder sent'), 'Sent') }))), actions: h.btn('Invoices', { sm: true, go: 'web.invoices' }) });
}
function autopayCard(c) {
  const D = c.D, p = D.kpi.autopayPct / 100;
  return h.card({ title: 'Autopay coverage', sub: 'Cards and bank accounts on file, on your own Stripe', body: `<div class="flex nw" style="gap:14px">${h.donut(p, 'Autopay coverage')}<div class="small"><b>${D.clients.filter(c2 => c2.autopay).length} of ${D.clients.length} clients</b> pay automatically.<div class="t3 tiny">${D.clients.length - D.clients.filter(c2 => c2.autopay).length} still pay by check or link. Ask them in the next invoice email.</div></div></div>`, actions: doneOr('ap-ask', actBtn('Ask 6 clients', 'ap-ask', '', 'Autopay request sent to 6 clients'), 'Asked') });
}
function quickQuoteCard(c, o) {
  const depth = +U('qq-depth', '2'), sqft = +U('qq-sqft', '690'), acc = U('qq-acc', 'drive');
  const q = qqPrice(sqft, depth, acc);
  const own = true;
  return h.card({ title: 'Quick Quote', sub: 'Mulch top-dress template · 2 minutes, same engine as full estimates (03 EST-11)', body: `${grid('1fr 1fr', [h.field('Bed area', `<div class="flex nw"><input class="inp" value="${sqft}" data-ui-input="qq-sqft" aria-label="Bed area sq ft" style="width:90px"><span class="tiny t3">sq ft</span></div>`, h.pill('Aerial AI, Apr 2026, 0.88', 'info')), h.field('Depth', seg('qq-depth', [['2', '2 in'], ['3', '3 in']], '2'))], 8)}
    ${h.field('Access', seg('qq-acc', [['drive', 'Drive-up'], ['gate', 'Gate'], ['hand', 'Hand only']], 'drive'))}
    <div class="flex between" style="background:var(--surface-2);border-radius:8px;padding:8px 10px"><div><div class="tiny t3">Price</div><b style="font-size:1.25rem" class="num">${money(q.price)}</b> <span class="tiny t3">${q.yd} cu yd · ${q.mh.toFixed(1)} man-hours</span></div>${marginCell(c, q.gm, 18, own, 12)}</div>
    <div class="flex">${doneOr('qq', actBtn('Send by text', 'qq', 'primary', 'Quick Quote sent by SMS with e-sign link'), 'Sent')}${h.btn('Open full estimate', { sm: true, go: 'web.estimate' })}</div>` });
}
function qqPrice(sqft, depth, acc) {
  const vol = sqft * depth / 324, yd = Math.ceil(vol * 1.05 * 2) / 2, mult = acc === 'hand' ? 1.25 : acc === 'gate' ? 1.1 : 1;
  const mh = vol / 0.75 * mult + 1, direct = yd * 32 + mh * BURDEN, be = direct + mh * FLH;
  const price = Math.ceil(be / 0.82 / 5) * 5;
  return { yd, mh, price, gm: 100 * (price - direct) / price };
}

function ownerToday(c) {
  const D = c.D, sg = c.seg.id, W = c.winter, items = attentionItems(c);
  const wid = c.seg.today_widgets || [];
  const head = greet(c);
  if (sg === 'S1') {
    return head + h.note(`${esc(c.seg.name)}: Starter, ${esc(c.t.people_peak)} people at peak. Phone-first: this is the same Today ${esc(first(c.who))} reads in the truck. Widgets: ${wid.map(esc).join(', ')}.`)
      + grid('minmax(0,1.15fr) minmax(0,1fr)', [`<div class="stack12">${routeStops(c)}${attentionCard(c, items.slice(0, 4))}</div>`, `<div class="stack12">${unpaidCard(c)}${autopayCard(c)}${W ? '' : quickQuoteCard(c)}${briefing(c)}</div>`]);
  }
  if (sg === 'S6') {
    const cm = [['The Abernathy family', 'Can the rain garden move 4 ft toward the downspout?', 'DS-412', '2 h ago'], [D.clients[1] ? D.clients[1].name : 'Client', 'Love concept B. Is the serviceberry deer-proof?', 'DS-411', 'Yesterday'], [D.clients[3] ? D.clients[3].name : 'Client', 'Approved the plant list, sending the deposit Friday.', 'DS-414', 'May 9']];
    const dep = D.proposals.filter(p => ['Sent', 'Viewed', 'Signed'].includes(p.status));
    return head + h.note(`${esc(c.seg.name)}: Design Solo. Crews, routing and payroll are left out on purpose; Today shows ${wid.map(esc).join(', ').toLowerCase()}.`)
      + grid('minmax(0,1.3fr) minmax(0,1fr)', [`<div class="stack12">${designQueue(c, { max: 6 })}${h.card({ title: 'Client comments', sub: 'From the portal, on shared designs', flush: true, body: h.list(cm.map(([who, txt, id, when]) => ({ av: who, title: `${esc(who)} <span class="t3 tiny">on ${esc(id)} · ${esc(when)}</span>`, sub: esc(txt), right: h.btn('Reply', { sm: true, go: 'web.studio', x: id }) }))) })}</div>`,
        `<div class="stack12">${h.card({ title: 'Deposits due', sub: 'Design fees and retainers on your own Stripe', flush: true, body: h.list(dep.map(p => ({ icon: 'card', tone: p.status === 'Signed' ? 'ok' : 'warn', title: `${esc(p.client)} · ${money(p.deposit)}`, sub: `${esc(p.id)} ${esc(p.title)} · ${esc(p.status)}`, right: p.status === 'Signed' ? h.pill('Paid', 'ok') : doneOr('dp' + p.id, actBtn('Send link', 'dp' + p.id, '', 'Payment link sent'), 'Sent') }))) })}${aiCreditsCard(c)}${briefing(c)}</div>`]);
  }
  const left = [], right = [];
  left.push(attentionCard(c, items));
  right.push(briefing(c));
  const cards = [];
  wid.forEach(w => {
    if (w === 'Daily Owner Briefing') return;
    if (/Pipeline/.test(w)) cards.push(pipelineCard(c));
    else if (/Design queue/.test(w)) cards.push(designQueue(c));
    else if (/Crews on the map/.test(w)) cards.push(crewsCard(c, { map: !W }));
    else if (/margin by job/.test(w)) cards.push(jobMarginCard(c));
    else if (/Branch dashboards/.test(w)) cards.push(branchCard(c));
    else if (/Labor efficiency/.test(w)) cards.push(laborCard(c));
    else if (/Storm readiness/.test(w)) cards.push(stormCard(c));
    else if (/Renewals due/.test(w)) cards.push(renewalsMini(c));
    else if (/Approvals over limit/.test(w)) cards.push(approvalsCard(c));
    else if (/Program round/.test(w)) cards.push(programCard(c));
    else if (/wind gate/.test(w)) cards.push(windCard(c));
    else if (/Visits today/.test(w)) cards.push(crewsCard(c));
    else if (/Renewals and autopay/.test(w)) cards.push(renewalsMini(c, true));
    else if (/Seasonal wave/.test(w)) cards.push(waveCard(c));
    else if (/Backflow/.test(w)) cards.push(backflowCard(c));
    else if (/Repair tickets/.test(w)) cards.push(repairCard(c));
    else if (/Lighting proposals/.test(w)) cards.push(lightingCard(c));
    else if (/Locations league/.test(w)) cards.push(leagueCard(c));
    else if (/Royalty/.test(w)) cards.push(royaltyCard(c));
    else if (/Adoption/.test(w)) cards.push(adoptionCard(c));
  });
  const half = Math.ceil(cards.length / 2);
  return head + h.note(`${esc(c.seg.id)} market widgets: ${wid.map(esc).join(', ')}. Owner defaults per 21 §6.3; ranked attention list per 21 §18.2.`)
    + grid('minmax(0,1.15fr) minmax(0,1fr)', [left.join(''), right.join('')])
    + ownerKpis(c)
    + grid('minmax(0,1fr) minmax(0,1fr)', [`<div class="stack12">${cards.slice(0, half).join('')}</div>`, `<div class="stack12">${cards.slice(half).join('')}</div>`])
    + weatherStrip(c);
}
// Segment widgets (S3, S4, S5, S7)
function branchCard(c) {
  const D = c.D, br = c.t.branches.length > 1 ? c.t.branches : [c.t.branches[0]];
  const rows = br.map((b, i) => ({ id: b, rev: Math.round(D.kpi.revenueMTD * [0.48, 0.3, 0.22][i % 3]), eff: [97, 91, 102][i % 3], gm: [33, 28, 31][i % 3], visits: `${[34, 22, 20][i % 3] - (c.winter ? 30 : 0) > 0 ? [34, 22, 20][i % 3] : 0}`, crews: D.crews.filter(x => x.branch === b).length }));
  return h.card({ title: 'Branch dashboards', sub: 'One KPI definition across branches (18)', body: h.table([
    { k: 'id', label: 'Branch', fmt: v => `<b>${esc(v)}</b>` }, { k: 'crews', label: 'Crews', n: true }, { k: 'rev', label: c.winter ? 'Jan MTD' : 'May MTD', n: true, fmt: v => kmoney(c.winter ? Math.round(v * .42) : v) },
    { k: 'eff', label: 'Labor eff.', n: true, fmt: v => `<span style="color:${v < 95 ? 'var(--warn-text)' : 'inherit'}">${v}%</span>` }, { k: 'gm', label: 'GM', n: true, fmt: v => h.mask(c, 'margin', v + '%') },
  ], rows, { dense: true }), actions: h.btn('Dashboards', { sm: true, go: 'web.dashboards' }) });
}
function laborCard(c) {
  const D = c.D;
  return h.card({ title: 'Labor efficiency by crew', sub: 'Budget hours / actual hours, last 7 days', body: h.bars(D.crews.slice(0, 7).map((cr, i) => { const e = [104, 88, 97, 112, 93, 99, 85][i]; return { label: `${esc(cr.name)} · ${esc(cr.branch)}`, value: e, max: 120, tone: e < 90 ? 'danger' : e < 95 ? 'warn' : '', right: e + '%' }; })) });
}
function stormCard(c) {
  const W = c.winter;
  return h.card({ title: 'Storm readiness', sub: W ? 'Jan 12-13 event · Snow & Ice module' : 'Next season · contracts and equipment', tone: W ? 'warn' : '', body: W ? `${h.kv([['Forecast', '3-5 in after 9 pm, 2 in push trigger'], ['Sites', '214 across 3 branches · 38 priority 1'], ['Crews on call', '22 crews + 4 subs'], ['Salt', '412 t on hand · 61 t per event'], ['Proof', 'Sealed proof packets per site (V1)']])}${h.bars([{ label: 'Columbus', value: 9, max: 10, right: '9/10 ready' }, { label: 'Dayton', value: 6, max: 7, right: '6/7 ready' }, { label: 'Cincinnati', value: 4, max: 5, tone: 'warn', right: '4/5 · 1 plow down' }])}`
      : `${h.bars([{ label: 'Snow contracts renewed', value: 18, max: 26, right: '18/26' }, { label: 'Plows serviced', value: 11, max: 14, right: '11/14' }, { label: 'Salt pre-buy', value: 60, max: 100, right: '60%' }])}${h.note('Summer pre-season: renewals for snow go out in August.')}`, actions: h.btn('Snow board', { sm: true, go: 'web.snow' }) });
}
function renewalsMini(c, autopay) {
  const D = c.D, ags = D.agreements.slice(0, 4);
  return h.card({ title: autopay ? 'Renewals and autopay' : 'Renewals due', sub: `${ags.length} in the next 90 days`, flush: true, body: h.list(ags.map(a => ({ icon: 'refresh', tone: '', title: `${esc(a.client)} · ${money(a.value)}`, sub: `${esc(a.name)} · renews ${esc(a.renews)} · ${esc(a.escalator)}${autopay ? (a.autopay ? ' · autopay on' : ' · no autopay') : ''}`, right: h.btn('Review', { sm: true, go: 'web.renewals' }) }))) });
}
function approvalsCard(c) {
  const D = c.D, com = D.com;
  return h.card({ title: 'Approvals over limit', sub: 'Internal and client-side', flush: true, body: h.list([
    { icon: 'approve', tone: 'warn', title: `${esc(com.hoa)} enhancement $12,400`, sub: '2-of-5 board vote over $5,000 · 1 of 2 votes in', right: h.pill('Client vote', 'info') },
    { icon: 'approve', tone: 'warn', title: `${esc(D.estimates[2].id)} ${money(D.estimates[2].value)} from ${esc(first(D.estimates[2].by))}`, sub: 'Over the $15,000 estimator limit', right: doneOr('ol1', actBtn('Approve', 'ol1', 'primary', 'Approved'), 'Approved') },
    { icon: 'box', tone: '', title: 'PO-3318 Dayton salt top-up $9,150', sub: 'Over the $2,500 ops manager PO limit', right: doneOr('ol2', actBtn('Approve', 'ol2', '', 'PO approved'), 'Approved') },
  ]) });
}
function programCard(c) {
  const n = c.t.clients;
  return h.card({ title: 'Program round progress', sub: c.winter ? 'Round 1 pre-emergent opens Mar 20' : 'Round 2 fertilizer + crabgrass · window Apr 25 - May 25', body: c.winter ? h.bars([{ label: 'Programs renewed', value: Math.round(n * .71), max: n, right: `${Math.round(n * .71)}/${n}` }, { label: 'Autopay on file', value: Math.round(n * .64), max: n, right: '64%' }]) : h.bars([{ label: 'Round 2 applied', value: Math.round(n * .52), max: n, right: `${Math.round(n * .52)}/${n}` }, { label: 'Re-entry notices sent', value: Math.round(n * .51), max: n, right: num(Math.round(n * .51)) }, { label: 'Days left in window', value: 14, max: 30, tone: 'warn', right: '14' }]) });
}
function windCard(c) {
  return h.card({ title: 'Weather and wind gate', sub: 'Applications blocked above the label wind limit', tone: c.winter ? '' : 'warn', body: c.winter ? h.empty('No applications in January.') : h.kv([['Now', 'Wind 6 mph, gusts 11'], ['11 am', 'Wind 14 mph: spray gate closes for liquid broadleaf'], ['Rain', '70% after 1 pm: granular OK before noon'], ['Affected', '38 broadleaf visits moved to Wednesday (draft)']]) });
}
function waveCard(c) {
  const n = c.t.clients;
  return h.card({ title: 'Seasonal wave progress', sub: c.winter ? 'Spring start-ups book from Feb 15' : 'Spring start-ups', body: h.bars(c.winter ? [{ label: 'Start-ups pre-booked', value: Math.round(n * .22), max: n, right: num(Math.round(n * .22)) }] : [{ label: 'Start-ups done', value: Math.round(n * .58), max: n, right: `${num(Math.round(n * .58))}/${num(n)}` }, { label: 'Booked this week', value: Math.round(n * .14), max: n, tone: 'info', right: num(Math.round(n * .14)) }, { label: 'Not yet booked', value: Math.round(n * .28), max: n, tone: 'warn', right: num(Math.round(n * .28)) }]) });
}
function backflowCard(c) { return h.card({ title: 'Backflow tests due', sub: 'Municipal deadline Jun 30', body: h.bars([{ label: 'Tested and filed', value: 412, max: 960, right: '412' }, { label: 'Scheduled', value: 230, max: 960, tone: 'info', right: '230' }, { label: 'Not scheduled', value: 318, max: 960, tone: 'warn', right: '318' }]) }); }
function repairCard(c) { const D = c.D; return h.card({ title: 'Repair tickets', sub: '14 open · 3 over 48 h', flush: true, body: h.list(D.clients.slice(1, 4).map((cl, i) => ({ icon: 'wrench', tone: i === 0 ? 'danger' : 'warn', title: `${esc(cl.name)}: ${['Broken lateral, zone 4', 'Controller offline', 'Valve stuck open, zone 2'][i]}`, sub: `${esc(cl.address)} · opened ${['3 d', '2 d', '20 h'][i]} ago`, right: h.btn('Schedule', { sm: true, go: 'web.board' }) }))) }); }
function lightingCard(c) { const D = c.D; return h.card({ title: 'Lighting proposals', sub: 'Night mood renders (V1)', flush: true, body: h.list(D.proposals.slice(0, 3).map(p => ({ icon: 'sun', tone: 'info', title: `${esc(p.client)} · ${money(p.value)}`, sub: `${esc(p.id)} · ${esc(p.viewed)}`, right: stPill(p.status) }))) }); }
function leagueCard(c) { return h.card({ title: 'Locations league table', sub: '38 locations · same KPI definitions', body: h.table([{ k: 'l', label: 'Location' }, { k: 'r', label: 'Revenue MTD', n: true }, { k: 'e', label: 'Labor eff.', n: true }, { k: 'a', label: 'Adoption', n: true }], [['Indianapolis North', '$412k', '101%', '96%'], ['Carmel', '$388k', '98%', '92%'], ['Fishers', '$301k', '93%', '88%'], ['Greenwood', '$274k', '89%', '71%']].map(([l, r, e, a]) => ({ l, r, e, a })), { dense: true }) }); }
function royaltyCard(c) { return h.card({ title: 'Royalty base', sub: 'Franchise rollup (V2)', body: h.kv([['Gross sales MTD', '$11.4M'], ['Royalty 6%', '$684k'], ['Brand fund 2%', '$228k'], ['Late reporters', '2 locations']]) }); }
function adoptionCard(c) { return h.card({ title: 'Adoption by location', sub: 'Crew app daily active', body: h.bars([{ label: 'Crew app', value: 88, max: 100, right: '88%' }, { label: 'Portal autopay', value: 61, max: 100, right: '61%' }, { label: 'Standard price book', value: 94, max: 100, right: '94%' }]) }); }

function officeToday(c) {
  const D = c.D, W = c.winter;
  const th = threads(c).filter(t => !t.closed);
  const unsched = W ? [['Dormant pruning', D.clients[2], '3.5 h', 'Feb 2'], ['Spring cleanup (early-bird)', D.clients[4], '2.0 h', 'Mar 20'], ['Irrigation start-up', D.clients[6], '1.0 h', 'Apr 6']] : [['Fall cleanup carry-over', D.clients[2], '3.5 h', 'May 14'], ['Aeration + overseed', D.clients[4], '1.0 h', 'May 16'], ['Bed edging', D.clients[6], '1.5 h', 'May 17'], ['Mulch install', D.clients[8] || D.clients[1], '4.0 h', 'May 20']];
  const toInv = D.visits.filter(v => v.status === 'Done');
  const pays = D.payments.slice(0, 4);
  const left = [
    h.card({ title: 'Inbox needing reply', sub: `${th.length} open · ${th.filter(t => /SLA|Due in/.test(t.sla)).length} with SLA timers`, flush: true, body: h.list(th.slice(0, 5).map(t => ({ icon: t.chIcon, tone: t.urg >= 2 ? 'danger' : t.cls === 'new_lead' ? 'info' : '', title: `${esc(t.who)} <span class="tiny t3">${esc(t.ch)} · ${esc(t.when)}</span>`, sub: esc(t.preview), right: h.pill(esc(t.sla), /min|Due in 4/.test(t.sla) ? 'warn' : ''), go: 'web.inbox' }))), actions: h.btn('Inbox', { sm: true, go: 'web.inbox' }) }),
    h.card({ title: 'Unscheduled work', sub: `${unsched.length + 5} visits waiting · ${unsched.length} due within 10 days`, flush: true, body: h.list(unsched.map(([s, cl, hrs, due]) => ({ icon: 'calendar', title: `${esc(s)} · ${esc(cl ? cl.name : '')}`, sub: `${hrs} · due ${due}`, right: h.btn('Schedule', { sm: true, go: 'web.board' }) }))) }),
    h.card({ title: "Today's schedule exceptions", sub: W ? 'Snow event tonight' : '2 late, 1 skipped', flush: true, body: h.list(W ? [{ icon: 'snow', tone: 'info', title: 'Storm notice to 26 snow clients', sub: 'Template "Snow tonight, push from 3:30 am" ready to send', right: doneOr('sn', actBtn('Send', 'sn', '', 'Storm notices sent'), 'Sent') }] : [{ icon: 'truck', tone: 'warn', title: `${esc((D.crews[1] || D.crews[0] || {}).name || 'Crew 2')} running 35 min late`, sub: '2 clients get an updated arrival text', right: doneOr('lt', actBtn('Notify clients', 'lt', '', 'Arrival texts sent'), 'Sent') }, { icon: 'x', tone: 'danger', title: `Skipped: ${esc(D.visits[4] ? D.visits[4].client : 'stop 5')}`, sub: 'Locked gate, no answer · photo attached', right: doneOr('sk', actBtn('Reschedule', 'sk', '', 'Rescheduled to Wednesday'), 'Moved') }]) }),
  ];
  const right = [
    c.has('agents_mvp') ? briefing(c, { variant: true }) : '',
    h.card({ title: 'Invoices to send', sub: 'Visits completed but not invoiced', body: `${row(`${toInv.length + (W ? 0 : 6)} visits from today and yesterday`, money(sum(toInv, v => 45 + (v.stop * 7) % 30) + (W ? 0 : 1380)))}${row('Level-billing installments (June)', `${D.agreements.filter(a => /Level/.test(a.billing)).length} clients`)}<div class="flex">${doneOr('inv', actBtn('Review and send batch', 'inv', 'primary', 'Invoice batch sent'), 'Sent')}</div>` }),
    h.card({ title: 'Payments received', sub: 'Last 2 days · on your own Stripe', flush: true, body: h.list(pays.map(p => ({ icon: 'card', tone: 'ok', title: `${esc(p.client)} · ${money(p.amount)}`, sub: `${esc(p.invoice)} · ${esc(p.method)} · ${esc(p.date)}` }))) }),
    renewalsMini(c),
    h.card({ title: 'Timesheets and PIN resets', sub: 'Crew admin', flush: true, body: h.list([{ icon: 'clock', tone: 'warn', title: `${D.timesheets.filter(t => t.exceptions).length} timesheet exceptions`, sub: D.timesheets.find(t => t.exceptions) ? `${esc(D.timesheets.find(t => t.exceptions).person)}: ${esc(D.timesheets.find(t => t.exceptions).exceptions)}` : 'None', right: h.btn('Review', { sm: true, go: 'web.timesheets' }) }, { icon: 'key', title: `PIN reset request: ${esc(D.people.find(p => p.role === 'technician') ? D.people.find(p => p.role === 'technician').name : 'technician')}`, sub: 'Kiosk PIN locked after 5 tries', right: doneOr('pin', actBtn('Reset PIN', 'pin', '', 'PIN reset sent by SMS'), 'Reset') }]) }),
  ];
  return greet(c) + grid('minmax(0,1.1fr) minmax(0,1fr)', [`<div class="stack12">${left.join('')}</div>`, `<div class="stack12">${right.join('')}</div>`]);
}
function estimatorToday(c) {
  const D = c.D, me = c.who, W = c.winter;
  const mine = D.opps.filter(o => o.owner === me);
  const myP = D.proposals.filter(p => { const e = D.estimates.find(x => x.id === p.estimate); return e && e.by === me && ['Sent', 'Viewed'].includes(p.status); });
  const appts = [['8:30', 'Site visit', D.leads[2]], ['10:15', 'Design review', { name: D.res.client, address: D.res.property }], ['1:00', 'Site visit', D.leads[5]], ['3:30', W ? 'Renewal walk-through' : 'Measure for patio', D.leads[7]]];
  const wins = D.proposals.filter(p => p.status === 'Signed');
  return greet(c) + grid('minmax(0,1.1fr) minmax(0,1fr)', [
    `<div class="stack12">${h.card({ title: 'My appointments today', sub: `${appts.length} · drive time 1 h 10 m`, flush: true, body: h.list(appts.map(([t, kind, l]) => ({ icon: 'calendar', tone: kind === 'Site visit' ? 'info' : '', title: `${t} · ${kind}: ${esc(l ? l.name : '')}`, sub: `${esc(l ? l.address : '')}${kind === 'Site visit' ? ' · assessment checklist ready offline' : ''}`, right: h.btn('Directions', { sm: true, act: 'td-dir' }) }))) })}
      ${h.card({ title: 'Proposals awaiting client', sub: 'Viewed vs not viewed', flush: true, body: myP.length ? h.list(myP.map(p => ({ icon: /views/.test(p.viewed) ? 'eye' : 'send', tone: /views/.test(p.viewed) ? 'accent' : '', title: `${esc(p.id)} ${esc(p.client)} · ${money(p.value)}`, sub: `${esc(p.title)} · ${esc(p.viewed)}`, right: doneOr('nd' + p.id, actBtn('Nudge', 'nd' + p.id, '', 'Nudge sent'), 'Nudged'), go: 'web.proposal', x: p.id }))) : h.empty('No proposals out. Nice: everything is signed or in draft.') })}
      ${h.card({ title: 'Leads to contact', sub: 'Your leads and the branch pool', flush: true, body: h.list(D.leads.filter(l => l.status !== 'Qualified').slice(0, 4).map(l => ({ icon: 'user', tone: l.status === 'New' ? 'info' : '', title: `${esc(l.name)} · ${esc(l.service)}`, sub: `${esc(l.source)} · ${esc(l.age)} · ${esc(l.address)}`, right: h.pill(esc(l.status), l.status === 'New' ? 'info' : ''), go: 'web.leads' }))) })}</div>`,
    `<div class="stack12">${c.has('agents_mvp') ? h.aiCard({ agent: 'Lead Follow-up (A3)', level: 'L2', credits: 4, title: '3 follow-ups drafted for you', body: h.list(D.leads.slice(3, 6).map(l => ({ icon: 'chat', tone: 'ai', title: `${esc(l.name)}: day ${[1, 3, 7][D.leads.indexOf(l) % 3]} follow-up`, sub: `"Hi ${esc(first(l.name))}, still thinking about the ${esc(l.service.toLowerCase())}? I have Thursday 9:00 or Friday 1:30 open for a site visit."`, right: doneOr('fu' + l.id, actBtn('Send', 'fu' + l.id, 'ai', 'Follow-up sent'), 'Sent') }))), why: 'Credits are per conversation (4). Stops on reply, opt-out or your takeover. Quiet hours 8 pm to 8 am.' }) : lockPill(c, 'agents_mvp', 'A3')}
      ${h.card({ title: 'My pipeline by stage', sub: `${mine.length} open · ${kmoney(sum(mine, o => o.value))}`, body: h.bars(['New', 'Qualified', 'Site visit', 'Designing', 'Proposal sent'].map(s => { const os = mine.filter(o => o.stage === s); return { label: s, value: sum(os, o => o.value), right: `${os.length} · ${kmoney(sum(os, o => o.value))}` }; })) })}
      ${h.kpis([{ label: 'Win rate this month', value: D.kpi.closeRate + '%', delta: '+4 pts vs April', tone: 'ok' }, { label: 'Won this month', value: kmoney(sum(wins, p => p.value)), delta: `${wins.length} jobs`, tone: 'ok' }])}
      ${h.card({ title: 'Quick actions', body: `<div class="flex">${h.btn('Quick Quote', { kind: 'primary', icon: 'bolt', go: 'web.estimates' })}${h.btn('New estimate', { icon: 'plus', go: 'web.estimate' })}${h.btn('Book site visit', { icon: 'calendar', go: 'web.leads' })}</div>` })}</div>`]);
}
RL.act('td-dir', () => { RL.toast('Directions opened in Maps (mock).'); return false; });
function designerToday(c) {
  const D = c.D;
  const used = Math.round(D.kpi.aiUsed * .55), budget = c.plan.ai_credits ? Math.round(c.plan.ai_credits * .5) : 600;
  return greet(c) + grid('minmax(0,1.15fr) minmax(0,1fr)', [
    `<div class="stack12">${designQueue(c, { title: 'Designs in progress', max: 6 })}
     ${h.card({ title: 'Review requests', sub: 'Client and estimator comments', flush: true, body: h.list([{ av: D.res.primary, title: `${esc(D.res.primary)} on ${esc(D.designs[0].id)}`, sub: '"Could the patio be a bit bigger? And no plants deer love, please."', right: h.btn('Open', { sm: true, go: 'web.studio', x: D.designs[0].id }) }, { av: castOf(c, 'estimator'), title: `${esc(castOf(c, 'estimator'))} on ${esc(D.designs[1].id)}`, sub: '"Budget is $18k. Can we drop the second serviceberry?"', right: h.btn('Open', { sm: true, go: 'web.studio', x: D.designs[1].id }) }]) })}
     ${h.card({ title: 'Takeoffs to hand off', sub: 'Push to estimate keeps lines linked (10 §4.15.3)', flush: true, body: h.list(D.designs.filter(d => d.status === 'Approved').slice(0, 2).map(d => ({ icon: 'ruler', title: `${esc(d.id)} ${esc(d.title)}`, sub: `${d.plants} plants · ${num(d.area)} sq ft · ${esc(d.client)}`, right: doneOr('to' + d.id, actBtn('Push to estimate', 'to' + d.id, 'primary', 'Takeoff pushed to estimate'), 'Pushed') }))) })}</div>`,
    `<div class="stack12">${h.card({ title: 'Mockup jobs finished', sub: 'AI artist renderings, region-locked palette', body: `${grid('1fr 1fr', [h.photo('mockup', { badge: 'AI artist rendering', label: 'Concept A' }), h.photo('after', { badge: 'AI artist rendering', label: 'Concept B' })], 8)}<div class="small">${esc(D.designs[0].id)} · 4 concepts ready · ${zoneOf(c)} palette</div>`, actions: h.btn('Review', { sm: true, kind: 'ai', go: 'web.mockups' }) })}
     ${h.card({ title: 'AI credit budget', sub: 'Your share this month', body: h.meter('Design credits', used, budget) + h.note('40 credits per 4-concept set, 10 per refinement.') })}
     ${h.card({ title: 'Plant availability alerts', sub: 'Nursery feeds', body: c.has('nursery_availability') ? h.list([{ icon: 'leaf', tone: 'warn', title: "Little Bluestem 'Standing Ovation' #1", sub: 'Short at the wholesale nursery until Jun 1 · 24 needed on DS-410', right: h.btn('Swap', { sm: true, go: 'web.plants' }) }, { icon: 'leaf', tone: 'ok', title: 'Serviceberry 8 ft B&B back in stock', sub: '12 available · $185 each' }]) : `<div class="flex">${lockPill(c, 'nursery_availability')}</div><div class="tiny t3">Nursery availability ${h.tag('V1')} is on Grow and Pro.</div>` })}</div>`]);
}
function opsToday(c) {
  const D = c.D, W = c.winter;
  const over = D.jobs.filter(j => j.actualHrs > j.budgetHrs * 1.1 || j.actualHrs / j.budgetHrs > 0.9 && j.status === 'In progress').slice(0, 4);
  const eq = D.equipment.filter(e => /overdue|due/i.test(e.next)).slice(0, 3);
  return greet(c) + grid('minmax(0,1.1fr) minmax(0,1fr)', [
    `<div class="stack12">${crewsCard(c, { map: !W })}
     ${h.card({ title: 'Job cost alerts', sub: 'Over budget by more than 10%, or trending there', flush: true, body: h.list(over.map(j => ({ icon: 'warn', tone: j.actualHrs > j.budgetHrs * 1.1 ? 'danger' : 'warn', title: `${esc(j.id)} ${esc(j.client)}`, sub: `${esc(j.title)} · ${j.actualHrs}/${j.budgetHrs} h · phase ${esc(j.phase)}`, right: marginCell(c, 100 * (j.value - j.cost) / j.value, j.actualHrs > j.budgetHrs * 1.1 ? 4 : 11, true), go: 'web.job', x: j.id }))) })}
     ${h.card({ title: 'Change orders pending', flush: true, body: h.list(coList(c).filter(x => /Pending|Draft/.test(x.state)).slice(0, 3).map(x => ({ icon: 'clipboard', tone: 'warn', title: `${esc(x.id)} ${esc(x.job)} · ${x.delta >= 0 ? '+' : ''}${money(x.delta)}`, sub: `${esc(x.title)} · ${esc(x.state)}`, go: 'web.change_orders' }))) })}</div>`,
    `<div class="stack12">${c.has('agents_mvp') ? briefing(c, { variant: true }) : ''}
     ${h.card({ title: W ? 'Storm triggers' : 'Quality checks due', flush: true, body: W ? h.list([{ icon: 'snow', tone: 'info', title: 'Push trigger 2 in · forecast 3-5 in', sub: 'Crews paged at 2:30 am if the reading passes 1.5 in' }, { icon: 'thermo', tone: 'warn', title: 'Refreeze Wednesday 14°F', sub: 'Salt refresh on 38 priority sites' }]) : h.list(D.jobs.filter(j => j.status === 'Complete').slice(0, 3).map(j => ({ icon: 'check', title: `${esc(j.id)} ${esc(j.client)}`, sub: `${esc(j.title)} · punch list walk`, right: doneOr('qc' + j.id, actBtn('Assign', 'qc' + j.id, '', 'QC walk assigned'), 'Assigned') }))) })}
     ${h.card({ title: 'Equipment out of service', flush: true, body: h.list(eq.map(e => ({ icon: 'wrench', tone: /overdue/i.test(e.next) ? 'danger' : 'warn', title: esc(e.name), sub: `${esc(e.next)} · ${esc(e.crew)}`, go: 'web.equipment' }))) })}
     ${h.card({ title: 'Timesheet exceptions', flush: true, body: h.list(D.timesheets.filter(t => t.exceptions).slice(0, 3).map(t => ({ icon: 'clock', tone: 'warn', title: esc(t.person), sub: esc(t.exceptions), right: doneOr('tx' + t.person, actBtn('Approve', 'tx' + t.person, '', 'Approved with note'), 'Approved') }))) })}</div>`]) + weatherStrip(c);
}
function bookkeeperToday(c) {
  const D = c.D, qbo = c.t.books === 'qbo_system';
  if (qbo) return greet(c) + h.banner(`${icon('link')} QuickBooks Online is ${esc(c.t.name)}'s system of record, so Books is off. Today shows sync status and AR only.`, 'info') + grid('1fr 1fr', [h.card({ title: 'Sync to QuickBooks Online', body: h.kv([['Last sync', '6:02 am · 14 records'], ['Errors', '1: tax code missing on INV-3311'], ['Mapping', 'Design fees to 4010 Design income']]), actions: h.btn('Sync log', { sm: true, go: 'web.sync' }) }), h.card({ title: 'AR aging', body: h.bars([{ label: 'Current', value: D.aging.current, right: money(D.aging.current) }, { label: '1-30', value: D.aging.d30, tone: 'warn', right: money(D.aging.d30) }, { label: '31-60', value: D.aging.d60, tone: 'warn', right: money(D.aging.d60) }, { label: '60+', value: D.aging.d90, tone: 'danger', right: money(D.aging.d90) }]) })]);
  const toCat = D.bank.filter(b => b.ai || /Needs review/.test(b.match));
  const close = [['Bank feeds current (2 accounts)', true], ['Stripe clearing reconciled to payouts', true], ['Deposits applied to first invoices', true], ['AP bills entered and coded to jobs', false], ['Payroll journal from Gusto export', false], ['Sales tax liability reviewed', false], ['Lock April', false]];
  return greet(c) + grid('minmax(0,1.1fr) minmax(0,1fr)', [
    `<div class="stack12">${h.card({ title: 'Bank transactions to categorize', sub: `${toCat.length} need a decision · rules handled ${D.bank.length - toCat.length}`, flush: true, body: h.list(toCat.map(b => ({ icon: b.ai ? 'spark' : 'bank', tone: b.ai ? 'ai' : 'warn', title: `${esc(b.desc)} · ${money(b.amount, { cents: true })}`, sub: `${esc(b.date)} · ${esc(b.match)}`, right: doneOr('bk' + b.id, actBtn(b.ai ? 'Accept match' : 'Categorize', 'bk' + b.id, b.ai ? 'ai' : '', 'Matched'), 'Matched') }))), actions: h.btn('Banking', { sm: true, go: 'web.banking' }) })}
     ${h.card({ title: 'Reconciliation status by account', body: h.table([{ k: 'a', label: 'Account' }, { k: 'b', label: 'Balance', n: true }, { k: 's', label: 'Reconciled through' }], [{ a: '1000 Operating checking', b: money(D.kpi.cash), s: h.pill('Apr 30', 'ok') }, { a: '1050 Stripe clearing', b: money(Math.round(D.kpi.cash * .04)), s: h.pill('May 10 (daily)', 'ok') }, { a: '2010 Business card', b: money(-Math.round(D.kpi.cash * .03)), s: h.pill('Mar 31', 'warn') }], { dense: true }) })}</div>`,
    `<div class="stack12">${h.card({ title: 'Close checklist: April', sub: `${close.filter(x => x[1]).length} of ${close.length} done`, body: `${h.progress(close.filter(x => x[1]).length, close.length)}${close.map(([l, d]) => `<div class="flex small">${d ? icon('check') : icon('clock')}<span class="${d ? 't3' : ''}">${l}</span></div>`).join('')}`, actions: h.btn('Close', { sm: true, go: 'web.close' }) })}
     ${h.card({ title: 'Bills due', flush: true, body: h.list(D.vendors.slice(0, 3).map((v, i) => ({ icon: 'receipt', title: `${esc(v.name)} · ${money([1840.22, 2640, 3200][i], { cents: true })}`, sub: `${esc(v.terms)} · due ${['May 15', 'May 18', 'May 20'][i]}` }))) })}
     ${h.card({ title: 'Sync errors', body: h.list([{ icon: 'warn', tone: 'warn', title: 'Payroll export: 1 employee missing a pay rate', sub: 'Gusto export blocked until fixed', right: h.btn('Fix', { sm: true, go: 'web.payroll' }) }]) })}
     ${h.card({ title: 'AR aging', body: h.bars([{ label: 'Current', value: D.aging.current, right: money(D.aging.current) }, { label: '1-30', value: D.aging.d30, tone: 'warn', right: money(D.aging.d30) }, { label: '31-60', value: D.aging.d60, tone: 'warn', right: money(D.aging.d60) }, { label: '60+', value: D.aging.d90, tone: 'danger', right: money(D.aging.d90) }]) })}</div>`]);
}
function observerToday(c) {
  const D = c.D, k = D.kpi;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'], ly = [3, 4, 8, 11, 13], ty = [3.4, 4.1, 9.2, 12.6, 14.4];
  return greet(c) + h.banner(`${icon('eye')} Read-only observer view: dashboards and margin. No client names, contact details or exports (02 §5.7).`, 'info')
    + h.kpis([{ label: 'Revenue YTD', value: kmoney(k.revenueYTD), delta: '+9% vs last year', tone: 'ok' }, { label: 'Gross margin', value: h.mask(c, 'margin', k.gm + '%'), delta: 'Target 42%' }, { label: 'Cash', value: kmoney(k.cash) }, { label: 'Backlog', value: k.backlogWeeks + ' wk' }, { label: 'Close rate', value: k.closeRate + '%' }])
    + grid('1fr 1fr', [h.card({ title: 'Revenue by month', sub: 'This year vs last year, % of annual', body: h.colchart(months, [{ values: ly, cls: 'c2' }, { values: ty, cls: 'c1' }], { label: 'Revenue by month' }) }), h.card({ title: 'Margin by service line', body: h.bars([{ label: 'Installs', value: 38, max: 60, right: h.mask(c, 'margin', '38%') }, { label: 'Maintenance', value: 44, max: 60, right: h.mask(c, 'margin', '44%') }, { label: 'Enhancements', value: 51, max: 60, right: h.mask(c, 'margin', '51%') }, { label: 'Snow', value: 33, max: 60, right: h.mask(c, 'margin', '33%') }]) })]);
}
function crewToday(c) {
  const D = c.D, cr = D.crews.find(x => x.lead === c.who || x.members.includes(c.who)) || D.crews[0];
  if (!cr) return greet(c) + h.empty(c.tr('This Company has no crews.', 'Esta empresa no tiene cuadrillas.'));
  const vs = D.visits.filter(v => v.crew === cr.name);
  const tsh = D.timesheets.find(t => t.person === c.who) || D.timesheets[0] || { hrs: 38.5, ot: 0, status: 'Pending' };
  const inWin = v => v.status === 'In progress' || v.status === 'En route';
  return greet(c) + grid('minmax(0,1.4fr) minmax(0,1fr)', [
    h.card({ title: c.tr('My visits today', 'Mis visitas de hoy'), sub: `${esc(cr.name)} · ${esc(cr.truck)} · ${vs.length} ${c.tr('stops', 'paradas')}`, flush: true, body: c.winter ? h.empty(c.tr('No visits today. Snow call at 3:30 am if it passes 2 in.', 'Sin visitas hoy. Llamada de nieve a las 3:30 am si pasa de 2 pulgadas.')) : h.list(vs.map(v => ({ icon: v.status === 'Done' ? 'check' : 'pin', tone: v.status === 'Done' ? 'ok' : inWin(v) ? 'info' : '', title: `${v.stop}. ${esc(v.client)}`, sub: `${esc(v.start)} · ${esc(v.service)} · ${c.tr('budget', 'presupuesto')} ${h.mask(c, 'budget_hours', v.budgetHrs + ' h')}${v.gate ? ' · ' + (inWin(v) && c.sees('access_secret') ? esc(v.gate) : `<span class="masked" title="${c.tr('Gate codes show only during the visit window (02 §10.2)', 'Los códigos se ven solo durante la visita')}">${c.tr('gate code in window', 'código en ventana')}</span>`) : ''}`, right: `${contactVal(c, '')}<span class="tiny t3">${c.tr(v.status, { Done: 'Hecho', 'In progress': 'En curso', 'En route': 'En camino', Scheduled: 'Programado' }[v.status])}</span>` }))) }),
    `<div class="stack12">${h.card({ title: c.tr('Timesheet status', 'Estado de horas'), body: `${h.kv([[c.tr('This week', 'Esta semana'), `${tsh.hrs} h`], [c.tr('Overtime', 'Horas extra'), `${tsh.ot} h`], [c.tr('Status', 'Estado'), c.tr(tsh.status, tsh.status === 'Approved' ? 'Aprobado' : 'Pendiente')]])}${h.note(c.tr('Clock in and out in the crew app. Prices and client phone numbers are never shown to field roles.', 'Marca entrada y salida en la app. Los precios y teléfonos de clientes no se muestran.'))}` })}
     ${h.card({ title: c.tr('Messages', 'Mensajes'), body: h.list([{ icon: 'chat', title: c.tr('Office: rain after 1 pm, finish fronts first', 'Oficina: lluvia después de la 1, terminen frentes primero'), sub: '7:05 am' }]) })}</div>`]);
}
RL.screen('web.today', (c) => {
  const r = c.role;
  if (r === 'owner') return ownerToday(c);
  if (r === 'office_manager') return officeToday(c);
  if (r === 'estimator') return estimatorToday(c);
  if (r === 'designer') return designerToday(c);
  if (r === 'ops_manager') return opsToday(c);
  if (r === 'bookkeeper') return bookkeeperToday(c);
  if (r === 'observer') return observerToday(c);
  return crewToday(c);
});

// ---------- Inbox (16 §4.17, §6.2; 17 A2) ----------
const CH = { SMS: 'chat', Email: 'mail', Portal: 'home', 'Web form': 'globe', Call: 'phone', Voicemail: 'phone' };
function threads(c) {
  const D = c.D, W = c.winter, res = D.res, com = D.com, l0 = D.leads[0], cl = D.clients;
  const est = castOf(c, 'estimator', c.owner), des = castOf(c, 'designer', c.owner), off = castOf(c, 'office_manager', c.owner), bk = castOf(c, 'bookkeeper', off), ops = castOf(c, 'ops_manager', off);
  const comPerson = com.primary === com.company ? com.billing.replace(/ \(AP\)$/, '') : com.primary;
  const inv = D.invoices.find(i => i.po) || D.invoices[1];
  const sp = cl.find(x => x.type === 'residential' && x.name !== res.client && x.name !== (cl[1] || {}).name) || cl[2] || cl[0];
  const comp = cl[1] || cl[0];
  const crew = D.crews[0] ? D.crews[0].lead : 'the crew';
  const T = [
    { id: 'T1', ch: 'SMS', who: res.primary, client: res.client, clientId: res.clientId, phone: '(614) 555-0142', topic: 'design', cls: 'service_request', conf: 0.93, urg: 1, assigned: designOnly(c) ? c.owner : des, when: '7:42 am', sla: 'Due in 1 h 18 m', lang: 'EN', unread: true,
      msgs: [['in', 'Yesterday 8:41 pm', W ? `Hi! We loved the patio concept. Could the crew start in April instead of May? Also, are any of those plants ones the deer will eat?` : `Hi! We looked at the patio design again. Could it be a little bigger, and can we swap anything deer like to eat? We see them every night.`], ['sys', 'Yesterday 8:41 pm', `Proposal ${D.proposals[0].id} viewed (4th view, iPhone)`]],
      draft: W ? `Hi ${first(res.primary)}, yes, we can hold an April start if you sign by Feb 15. On deer: the roses in the side bed are the ones they like. Jess can swap them for fragrant sumac at no change in price.` : `Hi ${first(res.primary)}, happy to. We can take the patio from 16 x 20 to 18 x 20 ft (about +$1,010). The roses by the driveway are deer favorites, so Jess will swap them for fragrant sumac. Updated design by Thursday.` },
    { id: 'T2', ch: 'Web form', who: l0.name, client: null, phone: '(614) 555-0177', topic: 'sales', cls: 'new_lead', conf: 0.97, urg: 2, assigned: est, when: '7:31 am', sla: 'New lead · answered in 1 m 40 s', lang: 'EN', unread: true, lead: l0.id,
      msgs: [['in', '7:29 am', `Request: ${l0.service}. Address ${l0.address}. Budget about ${kmoney(l0.value)}. When could someone come look?`], ['ai', '7:31 am', `A3 Lead Follow-up replied: "Thanks ${first(l0.name)}! I can have ${first(est)} out Thursday 9:00, Friday 1:30 or Monday 10:00. Which works?"`]],
      draft: null, agent: 'A3 is handling this lead. It stops as soon as a person replies.' },
    { id: 'T3', ch: 'Email', who: comPerson, client: com.company, clientId: (cl.find(x => x.name === com.company) || {}).id, phone: 'ap@example.com', topic: 'billing', cls: 'billing_question', conf: 0.91, urg: 1, assigned: bk, when: '6:58 am', sla: 'Due in 3 h 02 m', lang: 'EN', unread: false,
      msgs: [['in', '6:58 am', `Re: ${inv.id}. Our AP system rejected this invoice: it needs PO ${inv.po || 'PO-44120'} on the face of the invoice. Can you reissue it? Thanks.`]],
      draft: `Hi ${first(comPerson)}, sorry about that. I've reissued ${inv.id} with ${inv.po || 'PO-44120'} printed on the invoice; the amount and due date are unchanged. You can also pay it from the portal by ACH.` },
    { id: 'T4', ch: 'Voicemail', who: comp.contact || comp.name, client: comp.name, clientId: comp.id, phone: comp.phone, topic: 'scheduling', cls: 'schedule_change', conf: 0.88, urg: 1, assigned: off, when: '6:40 am', sla: 'Due in 2 h 40 m', lang: 'EN', unread: true, crew: true,
      msgs: [['in', '6:40 am', `Voicemail 1:48. Transcript summary (2 cr): ${W ? 'asks whether the driveway will be plowed before 6:30 am tomorrow because of an early hospital shift.' : 'asks to skip Tuesday\'s mow because of a graduation party; wants grub control added this season.'}`]],
      draft: W ? `Hi ${first(comp.contact || comp.name)}, you're priority 2 on tonight's route, so we expect to push your driveway by 5:45 am. We'll text when the crew is on the way.` : `Hi ${first(comp.contact || comp.name)}, no problem: Tuesday's mow is skipped and your next visit is Tuesday the 18th. Grub control for your lawn is $96 this season; reply YES to add it.` },
    { id: 'T5', ch: 'SMS', who: sp.contact || sp.name, client: sp.name, clientId: sp.id, phone: sp.phone, topic: 'scheduling', cls: 'schedule_change', conf: 0.9, urg: 1, assigned: off, when: '6:22 am', sla: 'Due in 1 h 50 m', lang: 'ES', unread: true, crew: true,
      msgs: [['in', '6:22 am', W ? '¿Pueden quitar la nieve de la entrada antes de las 7? Salgo temprano mañana.' : '¿Pueden venir el jueves en vez del martes? Tenemos una fiesta el martes.'], ['tr', '', W ? 'Translated: Can you clear the driveway before 7? I leave early tomorrow.' : 'Translated: Can you come Thursday instead of Tuesday? We have a party on Tuesday.']],
      draft: W ? `¡Claro! Su entrada está en la ruta de esta noche y esperamos terminar antes de las 6:30 am. Le avisamos por texto.` : `¡Claro! Movimos su visita al jueves. ${first(crew)} llegará entre 9 y 11 am. Gracias por avisar.` },
    { id: 'T6', ch: 'Portal', who: (cl[1] || cl[0]).contact || (cl[1] || cl[0]).name, client: (cl[1] || cl[0]).name, clientId: (cl[1] || cl[0]).id, phone: (cl[1] || cl[0]).phone, topic: 'complaint', cls: 'complaint', conf: 0.86, urg: 2, assigned: ops, when: 'Yesterday 5:10 pm', sla: 'SLA at risk · 20 min', lang: 'EN', unread: false, crew: true,
      msgs: [['in', 'Yesterday 5:10 pm', W ? 'The plow pushed snow onto our front bed again and broke the edging. Please be more careful.' : 'The crew left the side gate open and our dog got out. He is fine but this cannot happen again.'], ['note', 'Yesterday 5:22 pm', `Internal: @${first(ops)} please call today. Photo QA shows the gate photo was skipped.`]],
      draft: W ? `I'm sorry about the bed. We'll repair the edging at no charge in spring and I've marked that bed as a no-push zone on the snow plan so it doesn't happen again.` : `I'm very sorry. I've added a "close gate" checklist step with a required photo for every visit to your home, and ${first(ops)} will call you this morning.` },
    { id: 'T7', ch: 'SMS', who: (cl[5] || cl[0]).contact || (cl[5] || cl[0]).name, client: (cl[5] || cl[0]).name, clientId: (cl[5] || cl[0]).id, phone: (cl[5] || cl[0]).phone, topic: 'consent', cls: 'opt_out_request', conf: 0.99, urg: 0, assigned: off, when: '6:02 am', sla: 'Closed by rule', lang: 'EN', unread: false, closed: true,
      msgs: [['in', '6:02 am', 'Please stop texting me, email is fine.'], ['sys', '6:02 am', 'Opt-out applied to SMS marketing and service texts before any draft. One confirmation sent: "You won\'t get texts from us anymore. Reply START to resume."']], draft: null },
    { id: 'T8', ch: 'Email', who: 'Wholesale nursery (illustrative)', client: null, phone: 'avail@example.com', topic: 'vendor', cls: 'vendor_availability', conf: 0.95, urg: 0, assigned: des, when: '5:55 am', sla: 'No SLA', lang: 'EN', unread: false,
      msgs: [['in', '5:55 am', 'Weekly availability attached (PDF, 6 pages). Bluestem #1 short until Jun 1.']], draft: null, agent: 'Routed to the Nursery Availability Parser (A11, V1).' },
  ];
  T.forEach(t => { t.chIcon = CH[t.ch] || 'chat'; t.preview = (t.msgs.find(m => m[0] === 'in') || t.msgs[0])[2]; });
  return T;
}
function threadsFor(c) {
  const all = threads(c), r = c.role;
  if (r === 'estimator') return all.filter(t => t.assigned === c.who || t.topic === 'sales');
  if (r === 'designer') return all.filter(t => t.assigned === c.who || t.topic === 'design');
  if (r === 'bookkeeper') return all.filter(t => t.topic === 'billing');
  if (r === 'crew_lead') return all.filter(t => t.crew);
  return all;
}
RL.screen('web.inbox', (c) => {
  const D = c.D, all = threadsFor(c), view = U('ib-view', 'open');
  const views = [['open', 'Open', all.filter(t => !t.closed).length], ['mine', 'Mine', all.filter(t => t.assigned === c.who).length], ['leads', 'New leads', all.filter(t => t.cls === 'new_lead').length], ['sla', 'SLA at risk', all.filter(t => /risk/.test(t.sla)).length], ['billing', 'Billing', all.filter(t => t.topic === 'billing').length], ['es', 'Spanish', all.filter(t => t.lang === 'ES').length], ['closed', 'Closed', all.filter(t => t.closed).length]];
  const flt = { open: t => !t.closed, mine: t => t.assigned === c.who, leads: t => t.cls === 'new_lead', sla: t => /risk/.test(t.sla), billing: t => t.topic === 'billing', es: t => t.lang === 'ES', closed: t => t.closed }[view] || (() => true);
  const list = all.filter(flt);
  const sel = all.find(t => t.id === U('ib-sel', '')) || list[0] || all[0];
  const triage = c.has('agents_mvp');
  const roleNote = { designer: 'Designer: your assigned design threads only (inbox.conversation RWX/o).', bookkeeper: 'Bookkeeper: billing threads only; contact details limited to billing contacts.', crew_lead: 'Crew lead: threads you were @mentioned on, with client numbers masked behind the relay.', estimator: 'Estimator: your threads and new sales leads.' }[c.role];
  const head = h.page({ title: 'Inbox', sub: `${all.filter(t => !t.closed).length} open · SMS, email, portal, web forms and call summaries in one thread per person`, actions: (triage ? h.pill(`${icon('spark', 's')}Triage today: 46 messages · 23 cr`, 'ai') : lockPill(c, 'agents_mvp', 'AI triage')) + h.btn('Compose', { icon: 'plus', act: 'ib-compose' }) });
  if (!sel) return head + h.empty('No conversations for your role yet.');
  const left = `<div class="cd" style="overflow:hidden"><div style="padding:8px 8px 4px" class="stack8">${views.map(([k, l, n]) => `<button type="button" class="mx-nav" data-ui="ib-view" data-val="${k}"${view === k ? ' aria-current="page"' : ''} style="padding:5px 8px;font-size:.8rem"><span class="grow">${l}</span><span class="tiny t3">${n}</span></button>`).join('')}</div><div class="tiny t3" style="padding:8px 12px 4px;font-weight:700;text-transform:uppercase;letter-spacing:.05em">Channels</div><div class="flex gap4" style="padding:0 10px 10px">${['SMS', 'Email', 'Portal', 'Web form', 'Call'].map(x => h.pill(icon(CH[x] || 'chat', 's') + x)).join('')}${h.pill('Social ' + h.tag('V1'))}</div></div>`;
  const tlist = `<div class="cd" style="overflow:hidden"><div class="li">${list.length ? list.map(t => `<div class="li-i go" data-ui="ib-sel" data-val="${t.id}" role="button" tabindex="0" style="${t.id === sel.id ? 'background:var(--primary-soft)' : ''};grid-template-columns:auto minmax(0,1fr)"><span class="ico ${t.urg >= 2 ? 'danger' : t.cls === 'new_lead' ? 'info' : ''}">${icon(t.chIcon)}</span><div style="min-width:0"><div class="flex between nw"><span class="tt" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t.unread ? '<b>' : ''}${esc(t.who)}${t.unread ? '</b>' : ''}</span><span class="tiny t3 nowrap">${esc(t.when.replace('Yesterday ', 'Yest '))}</span></div><div class="ss" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(t.preview)}</div><div class="flex gap4" style="margin-top:3px">${h.pill(esc(t.ch))}${t.lang === 'ES' ? h.pill('ES', 'info') : ''}${triage && t.cls ? h.pill(esc(t.cls.replace(/_/g, ' ')), 'ai') : ''}</div></div></div>`).join('') : h.empty('Nothing in this view.')}</div></div>`;
  const msg = ([dir, when, text]) => dir === 'in' ? `<div style="max-width:88%;background:var(--surface-2);border:1px solid var(--border);border-radius:10px;padding:8px 10px" class="small"><div class="tiny t3">${esc(when)} · ${esc(sel.ch)} in</div>${esc(text)}</div>`
    : dir === 'tr' ? `<div class="tiny t2" style="padding-left:10px">${icon('globe', 's')} ${esc(text)} <span class="t3">(original preserved)</span></div>`
    : dir === 'note' ? `<div class="small" style="border:1px dashed var(--border-strong);border-radius:10px;padding:8px 10px;background:var(--warn-bg)"><div class="tiny t3">${esc(when)} · Internal note, not visible to the client</div>${esc(text.replace(/^Internal: /, ''))}</div>`
    : dir === 'ai' ? `<div style="margin-left:auto;max-width:88%" class="aic"><div class="ah">${icon('spark')}<span>Lead Follow-up (A3)</span><span class="lv">L2</span><span class="cr">4 cr</span></div><div class="small">${esc(text.replace(/^A3 Lead Follow-up replied: /, ''))}</div><div class="tiny t2">${esc(when)} · sent automatically as a transactional first reply</div></div>`
    : `<div class="tiny t3 flex">${icon('eye', 's')}${esc(when)} · ${esc(text)}</div>`;
  const draftKey = 'ib-draft-' + sel.id;
  const draftUsed = RL.ui[draftKey];
  const draftCard = sel.draft ? (triage ? `<div class="aic"><div class="ah">${icon('spark')}<span>Inbox Triage (A2)</span><span class="lv">L2</span><span class="cr">0.5 cr</span></div><div class="small"><b>${esc(sel.cls.replace(/_/g, ' '))}</b> · confidence ${sel.conf} · urgency ${sel.urg} · ${sel.lang === 'ES' ? 'Spanish, replying in Spanish' : 'English'} · matched to ${esc(sel.client || 'new lead')}</div><div class="small" style="background:var(--surface);border-radius:8px;padding:8px">"${esc(sel.draft)}"</div><div class="flex">${draftUsed ? h.pill('Inserted into the reply for editing', 'ai') : h.btn('Use draft', { sm: true, kind: 'ai', act: 'ib-use', val: sel.id })}${h.btn('Shorter', { sm: true, act: 'ib-redo' })}<span class="tiny t2">Drafts never auto-send. Never quotes internal notes.</span></div></div>` : `<div class="flex">${lockPill(c, 'agents_mvp', 'Triage drafts')}${c.allowed('copilot.use') ? h.btn('Draft with Copilot (1 cr)', { sm: true, kind: 'ai', act: 'ib-use', val: sel.id }) : ''}</div>`) : (sel.agent ? `<div class="aic"><div class="ah">${icon('spark')}<span>Routing</span></div><div class="small">${esc(sel.agent)}</div></div>` : '');
  const canReply = !sel.closed && (c.allowed('inbox.conversation'));
  const smsOk = !(sel.cls === 'opt_out_request');
  const composer = canReply ? `<div class="stack8"><div class="flex gap4">${h.btn('Internal note', { sm: true, act: 'ib-note' })}${h.btn('Snippet', { sm: true, act: 'ib-snip' })}${h.btn('Translate', { sm: true, act: 'ib-tr' })}${c.allowed('payment.collect') && sel.client ? h.btn('Payment link', { sm: true, act: 'ib-pay' }) : ''}</div><textarea class="inp" rows="3" aria-label="Reply" data-ui-input="${draftKey}-t" placeholder="Type a reply...">${esc(U(draftKey + '-t', draftUsed ? sel.draft : ''))}</textarea><div class="flex between"><span class="tiny t3">Send via ${esc(sel.ch === 'Voicemail' ? 'SMS' : sel.ch === 'Web form' ? 'SMS' : sel.ch)} · quiet hours 8 pm to 8 am · ${smsOk ? 'SMS consent: service on' : 'SMS off: email only'}</span><span class="flex">${h.btn('Send', { sm: true, kind: 'primary', act: 'ib-send', val: sel.id })}${h.btn('Send and close', { sm: true, act: 'ib-send', val: sel.id })}</span></div></div>` : h.note(sel.closed ? 'Closed. A new inbound message reopens it.' : 'Read only for your role.');
  const cl = sel.clientId ? D.clients.find(x => x.id === sel.clientId) : null;
  const prop = cl ? D.properties.find(p => p.client === cl.id) : null;
  const nextV = cl ? D.visits.find(v => v.clientId === cl.id) : null;
  const openP = cl ? D.proposals.filter(p => p.clientId === cl.id && p.status !== 'Signed') : [];
  const ctx = h.card({ title: cl ? esc(cl.name) : esc(sel.who), sub: cl ? `${esc(cl.type)} · since ${cl.since}` : 'Not matched to a client yet', body: `${h.kv([['Contact', `${contactVal(c, sel.phone, { billing: sel.topic === 'billing' })}`], prop ? ['Property', `${esc(prop.address)}${prop.zones ? ` · ${prop.zones} zones` : ''}`] : null, cl ? ['Service', esc(cl.service)] : ['Lead', sel.lead ? esc(sel.lead) : 'Unmatched sender'], nextV ? ['Next visit', `${c.winter ? 'Snow route tonight' : 'Today ' + esc(nextV.start)} · ${esc(nextV.crew)}`] : null, openP.length ? ['Open', openP.map(p => h.link(esc(p.id), 'web.proposal', p.id)).join(', ')] : null, cl ? ['AR', balCell(c, cl)] : null, ['Consent', sel.cls === 'opt_out_request' ? `${h.pill('SMS off', 'danger')} ${h.pill('Email on', 'ok')}` : `${h.pill('SMS service on', 'ok')} ${h.pill(cl && cl.autopay ? 'Marketing on' : 'Marketing off')}`], ['Language', sel.lang], ['Assigned', `${h.avatar(sel.assigned)} ${esc(sel.assigned)}`]])}
    <div class="flex gap4">${c.allowed('job') ? h.btn('Work order', { sm: true, icon: 'plus', act: 'ib-qa' }) : ''}${c.allowed('estimate') && c.can('estimate') !== 'R/o' && c.can('estimate') !== 'R/a' ? h.btn('Instant quote', { sm: true, act: 'ib-qa' }) : ''}${c.allowed('visit.dispatch') ? h.btn('Reschedule', { sm: true, act: 'ib-qa' }) : ''}${c.allowed('lead') && !cl ? h.btn('Create lead', { sm: true, act: 'ib-qa' }) : ''}${c.allowed('design') && c.can('design') !== 'R/b' ? h.btn('Start design', { sm: true, act: 'ib-qa' }) : ''}${cl ? h.btn('Client', { sm: true, go: 'web.client', x: cl.id }) : ''}</div>` });
  const center = `<div class="cd"><div class="cd-h"><div><h3>${esc(sel.who)} ${sel.client && sel.client !== sel.who ? `<span class="t3 small">· ${esc(sel.client)}</span>` : ''}</h3><div class="sub">${esc(sel.ch)} · ${contactVal(c, sel.phone, { billing: sel.topic === 'billing' })} · ${esc(sel.sla)}</div></div><div class="flex">${h.select(['Open', 'Pending', 'Snoozed', 'Closed'], sel.closed ? 'Closed' : 'Open', { label: 'Status' })}</div></div><div class="cd-b" style="gap:10px">${sel.msgs.map(msg).join('')}${draftCard}${composer}</div></div>`;
  return head + (roleNote ? h.note(roleNote) : '') + grid('150px minmax(0,0.9fr) minmax(0,1.35fr)', [left, tlist, center]) + grid('minmax(0,1fr) minmax(0,1fr)', [ctx, h.card({ title: 'SLA and routing', sub: 'Defaults per 16 §4.17.2', body: `${row('New lead first response', '5 min')}${row('Existing client question', '2 business h')}${row('Complaint', '1 business h')}${row('Commercial client', '4 business h')}${h.note('Routing: account owner, then territory, then AI topic, then round robin. Billing topics route to the bookkeeper.')}` })]);
});
RL.act('ib-use', (el) => { RL.ui['ib-draft-' + el.dataset.val] = '1'; RL.ui['ib-draft-' + el.dataset.val + '-t'] = ''; });
RL.act('ib-redo', () => { RL.toast('Shorter draft requested (0.5 cr).'); return false; });
RL.act('ib-send', (el) => { RL.toast('Reply sent (mock). Logged on the client timeline.'); RL.ui['ib-draft-' + el.dataset.val + '-t'] = ''; RL.ui['ib-draft-' + el.dataset.val] = ''; });
['ib-note', 'ib-snip', 'ib-tr', 'ib-pay', 'ib-qa', 'ib-compose'].forEach(k => RL.act(k, (el) => { RL.toast({ 'ib-note': 'Internal note added (staff only).', 'ib-snip': 'Snippet inserted: {{next_visit_date}} filled in.', 'ib-tr': 'Outbound translation preview: Spanish.', 'ib-pay': 'Payment link created on the Company\'s Stripe account.', 'ib-qa': 'Created from this message; the link back is preserved.', 'ib-compose': 'New conversation (mock).' }[k]); return false; }));

// ---------- Clients (03 CRM-01, 21 §6.4, §18.3) ----------
const crewOf = c => c.D.crews.find(x => x.lead === c.who || x.members.includes(c.who)) || c.D.crews[0];
const crewClients = c => { const cr = crewOf(c); const ids = new Set(c.D.visits.filter(v => cr && v.crew === cr.name).map(v => v.clientId)); return c.D.clients.filter(x => ids.has(x.id)); };
function pickClient(c) {
  const D = c.D; const pool = c.role === 'crew_lead' ? crewClients(c) : D.clients;
  return pool.find(x => x.id === c.x) || D.properties.filter(p => p.id === c.x).map(p => pool.find(x => x.id === p.client))[0] || pool.find(x => x.id === D.res.clientId) || pool[0] || D.clients[0];
}
const propsOf = (c, cl) => c.D.properties.filter(p => p.client === cl.id);
const agreementOf = (c, cl) => c.D.agreements.find(a => a.clientId === cl.id);
function contactsOf(c, cl) {
  const D = c.D, res = cl.id === D.res.clientId, com = D.com, isCom = cl.type !== 'residential';
  const base = cl.contact || cl.name;
  const mail = n => String(n).toLowerCase().replace(/\(.*?\)/g, '').trim().replace(/[^a-z]+/g, '.').replace(/^\.|\.$/g, '') + '@example.com';
  const ph = n => '(' + (300 + hsh(n) % 600) + ') 555-01' + String(10 + hsh(n) % 89);
  if (!isCom) {
    const list = [{ name: res ? D.res.primary : base, scope: 'Primary', roles: 'Billing, approver', portal: 'Active · passkey', sms: 'Service on · marketing on', email: 'On', lang: 'EN', last: 'Yesterday 8:41 pm' },
      { name: res ? D.res.co_owner : 'Spouse of ' + first(base), scope: 'Co-owner', roles: 'Approver', portal: 'Invited', sms: 'Service on · marketing off', email: 'On', lang: 'EN', last: '-' }];
    if (res) list.push({ name: D.res.resident, scope: 'Property contact', roles: 'Visit notices only', portal: 'Active', sms: 'Service on', email: 'Off', lang: 'ES', last: 'May 4' });
    return list.map(x => Object.assign(x, { email: mail(x.name), phone: ph(x.name) }));
  }
  const hero = cl.name === com.company || cl.name === com.hoa;
  const n = k => hero ? com[k] : ({ primary: base, approver: 'Board member (' + first(base) + ')', billing: 'AP desk', site: 'Facilities lead', viewer: 'Consultant' })[k];
  return [{ name: n('primary') === cl.name ? first(n('billing')) + ' (account primary)' : n('primary'), scope: 'Primary', roles: 'All properties', portal: 'Active · passkey', sms: 'Service on', email: 'On', lang: 'EN', last: 'Today 6:58 am' },
    { name: n('approver'), scope: 'Approver', roles: cl.type === 'hoa' ? '2-of-5 board vote over $5,000' : 'Up to $10,000', portal: 'Active', sms: 'Off', email: 'On', lang: 'EN', last: 'May 8', term: 'Term ends Dec 31' },
    { name: n('billing'), scope: 'Billing', roles: 'Invoices, statements, W-9, tax certificates', portal: 'Active', sms: 'Off', email: 'On', lang: 'EN', last: 'May 10', billing: true },
    { name: n('site'), scope: 'Property contact', roles: hero && com.props ? esc(com.props[0]) + ' only' : 'Main site only', portal: 'Active', sms: 'Service on', email: 'On', lang: 'EN', last: 'May 9' },
    { name: n('viewer'), scope: 'Viewer', roles: 'Shared designs and proposals', portal: 'Invited', sms: 'Off', email: 'On', lang: 'EN', last: '-' }].map(x => Object.assign(x, { email: mail(x.name), phone: ph(x.name) }));
}
const visibleTabsFor = c => {
  const all = ['overview', 'properties', 'work', 'sales', 'designs', 'money', 'comms', 'files', 'notes'];
  if (c.role === 'bookkeeper') return ['overview', 'money', 'comms', 'files'];
  if (c.role === 'crew_lead' || c.role === 'technician') return ['overview', 'properties', 'work'];
  if (finView(c) === 'none') return all.filter(t => t !== 'money');
  return all;
};
function propertyCard(c, p, o) {
  const sec = c.sees('access_secret');
  const gate = p.gate ? (sec ? (/R in window/.test(c.fc('access_secret')) ? `<span class="masked" title="Shown only during the visit window (02 §10.2)">in visit window</span>` : `<b>${esc(p.gate)}</b>`) : h.mask(c, 'access_secret', p.gate)) : 'None';
  return `<div class="flex nw" style="align-items:flex-start;gap:10px"><div style="width:120px;flex:none">${lotSvg(p, { mini: true })}</div><div class="grow small"><div class="b">${esc(p.address)}</div><div class="t3 tiny">${esc(p.city)} · Zone ${zoneOf(c)}</div>${h.kv([['Lot', `${num(p.lot)} sq ft`], ['Turf', `${num(p.turf)} sq ft`], ['Beds', `${p.beds} beds`], ['Access', gate], p.dog ? ['Pets', esc(p.dog)] : null, p.controller ? ['Irrigation', `${p.zones} zones · ${esc(p.controller)}`] : null])}</div>${o && o.go ? h.btn('Open', { sm: true, go: 'web.property', x: p.id }) : ''}</div>`;
}
function lotSvg(p, o) {
  const s = hsh(p.id), hx = 70 + s % 30, hw = 110 + s % 30;
  const mini = o && o.mini;
  return `<svg viewBox="0 0 300 200" role="img" aria-label="Measured lot plan for ${esc(p.address)}" style="width:100%;height:auto;display:block;border-radius:8px;border:1px solid var(--border);background:#cfe0c4">
    <rect x="6" y="6" width="288" height="188" fill="#9cc47e" stroke="#4b453b" stroke-dasharray="5 4" stroke-width="1.2"/>
    <rect x="${hx}" y="22" width="${hw}" height="64" fill="#e9e3d6" stroke="#776e60"/><rect x="${hx + hw + 10}" y="6" width="44" height="96" fill="#cfc6b6"/>
    <path d="M${hx - 34},86 L${hx},86 L${hx},120 C${hx - 12},126 ${hx - 26},122 ${hx - 34},112 Z" fill="#8a6a4f" opacity=".85"/><path d="M${hx + 20},86 L${hx + 90},86 L${hx + 90},104 C${hx + 70},112 ${hx + 40},112 ${hx + 20},104 Z" fill="#8a6a4f" opacity=".85"/>
    <path d="M14,168 C80,150 160,170 286,156 L286,190 L14,190 Z" fill="#8a6a4f" opacity=".85"/>
    <circle cx="44" cy="70" r="26" fill="#3f7d35" opacity=".55" stroke="#2f6428" stroke-dasharray="3 3"/>
    ${mini ? '' : `<text x="${hx + hw / 2}" y="58" text-anchor="middle" style="font:700 10px var(--font-body);fill:#4b453b">House</text><text x="150" y="132" text-anchor="middle" style="font:700 10px var(--font-body);fill:#1c3c19">Turf ${num(p.turf)} sq ft</text><text x="150" y="182" text-anchor="middle" style="font:700 9px var(--font-body);fill:#fff">Back border</text><text x="${hx + hw + 32}" y="60" text-anchor="middle" style="font:700 9px var(--font-body);fill:#4b453b" transform="rotate(-90 ${hx + hw + 32} 60)">Driveway</text><text x="44" y="74" text-anchor="middle" style="font:700 9px var(--font-body);fill:#fff">Maple</text>`}
  </svg>`;
}
RL.screen('web.clients', (c) => {
  const D = c.D;
  const pool = c.role === 'crew_lead' ? crewClients(c) : D.clients;
  const views = [['all', 'Active', pool.length], ['res', 'Residential', pool.filter(x => x.type === 'residential').length], ['com', 'Commercial and HOA', pool.filter(x => x.type !== 'residential').length], ['due', 'Past due', pool.filter(x => x.pastDue).length], ['ren', 'Renewal due', D.agreements.filter(a => pool.some(x => x.id === a.clientId)).length], ['idle', 'No visit in 60 days', pool.filter(x => /Mar/.test(x.lastVisit)).length]];
  const v = U('cl-view', 'all');
  const f = { all: () => true, res: x => x.type === 'residential', com: x => x.type !== 'residential', due: x => x.pastDue, ren: x => D.agreements.some(a => a.clientId === x.id), idle: x => /Mar/.test(x.lastVisit) }[v] || (() => true);
  const rows = pool.filter(f);
  const fin = finView(c);
  const cols = [
    { k: 'name', label: 'Client', fmt: (n, r) => `<div class="b">${esc(n)}</div><div class="tiny t3">${esc(r.id)} · ${c.role === 'bookkeeper' ? contactVal(c, r.email, { billing: true }) : contactVal(c, r.phone)}</div>` },
    { k: 'type', label: 'Type', fmt: t => h.pill(t === 'hoa' ? 'HOA' : t === 'commercial' ? 'Commercial' : 'Residential', t === 'residential' ? '' : 'info') },
    { k: 'address', label: 'Primary property', fmt: a => `<span class="small">${esc(a)}</span>` },
    c.role === 'bookkeeper' ? null : { k: 'service', label: 'Service', fmt: s => `<span class="small">${esc(s)}</span>` },
    { k: 'balance', label: fin === 'chip' ? 'AR status' : 'Balance', n: fin !== 'chip', fmt: (b, r) => balCell(c, r) },
    { k: 'autopay', label: 'Autopay', fmt: a => a ? h.pill('On', 'ok') : '<span class="t3 small">Off</span>' },
    c.role === 'bookkeeper' ? { k: 'since', label: 'Terms', fmt: (s, r) => `<span class="small">${r.type === 'residential' ? 'Due on receipt' : 'Net 30, PO required'}</span>` } : { k: 'lastVisit', label: 'Last visit' },
    fin === 'full' ? { k: 'ltv', label: 'LTV', n: true, fmt: l => kmoney(l) } : null,
  ].filter(Boolean);
  const canNew = c.allowed('client') && /W/.test(c.can('client'));
  return h.page({ title: 'Clients', sub: `${num(c.t.clients)} clients in ${esc(c.t.name)} · showing a sample of ${pool.length}`, actions: (c.allowed('report.export') ? h.btn('Export CSV', { icon: 'download', act: 'cl-export' }) : '') + (canNew ? h.btn('New client', { kind: 'primary', icon: 'plus', act: 'cl-new' }) : '') })
    + ({ bookkeeper: h.note('Bookkeeper view: billing fields only. Gate codes, site notes and designs are hidden (02 §10.2).'), crew_lead: h.note('Crew lead view: clients on your crew\'s routes in the next 14 days, with masked contact actions (21 §5.9).'), estimator: h.note('Estimator view: AR shows as a status chip, not the ledger.'), designer: h.note('Designer view: balances and AR are hidden.'), ops_manager: h.note('Operations view: AR shows as a status chip.') }[c.role] || '')
    + h.tabs('cl-view', views, 'all')
    + `<div class="flex between"><span class="flex">${h.pill(icon('filter', 's') + 'Branch: all')}${h.pill('Sort: name')}${h.pill('Columns')}</span><span class="tiny t3">Saved views: private, role or Company (21 §6.7)</span></div>`
    + h.card({ flush: true, body: h.table(cols, rows, { go: 'web.client', empty: 'No clients in this view.' }) });
});
RL.act('cl-export', (el, ev, c) => { RL.toast(`CSV export queued (${esc(c.can('report.export'))}). Exports over 1,000 clients need dual control.`); return false; });
RL.act('cl-new', () => { RL.toast('New client form (mock): duplicate check runs on name, phone and address (03 LEAD-03).'); return false; });

RL.screen('web.client', (c) => {
  const D = c.D, cl = pickClient(c);
  const props = propsOf(c, cl), ag = agreementOf(c, cl);
  const jobs = D.jobs.filter(j => j.clientId === cl.id), vis = D.visits.filter(v => v.clientId === cl.id);
  const ests = D.estimates.map(e => estOf(c, e)).filter(e => e.clientId === cl.id), props2 = D.proposals.filter(p => p.clientId === cl.id), opps = D.opps.filter(o => o.clientId === cl.id);
  const des = D.designs.filter(d => d.clientId === cl.id), invs = D.invoices.filter(i => i.clientId === cl.id), pays = D.payments.filter(p => p.client === cl.name);
  const tabs = visibleTabsFor(c);
  const labels = { overview: ['Overview'], properties: ['Properties', props.length], work: ['Work', jobs.length + vis.length || null], sales: ['Sales', ests.length + props2.length || null], designs: ['Designs', des.length || null], money: ['Money'], comms: ['Communications'], files: ['Files'], notes: ['Notes'] };
  const tab = tabs.includes(U('cr-tab', 'overview')) ? U('cr-tab', 'overview') : 'overview';
  const fin = finView(c), contacts = contactsOf(c, cl);
  const primary = c.role === 'bookkeeper' ? h.btn('Send statement', { kind: 'primary', act: 'cr-act', val: 'Statement sent' }) : c.role === 'designer' ? h.btn('Start design', { kind: 'primary', go: 'web.studio' }) : c.role === 'estimator' ? h.btn('New estimate', { kind: 'primary', go: 'web.estimate' }) : c.role === 'crew_lead' ? '' : h.btn('Send message', { kind: 'primary', icon: 'chat', go: 'web.inbox' });
  const head = h.page({ crumbs: [['Clients', 'web.clients'], [esc(cl.name)]], title: `${h.avatar(cl.name)} ${esc(cl.name)}`, tags: `${h.pill('Active', 'ok')}${h.pill(cl.type === 'hoa' ? 'HOA' : cl.type === 'commercial' ? 'Commercial' : 'Residential', 'info')}${cl.autopay ? h.pill('Autopay on', 'ok') : ''}${cl.pastDue ? (fin === 'none' ? '' : h.pill('Past due', 'danger')) : ''}`, actions: (c.allowed('job') && /W/.test(c.can('job')) ? h.btn('Create', { icon: 'plus', act: 'cr-act', val: 'Create menu: job, visit, estimate, invoice' }) : '') + primary + h.btn('', { icon: 'dots', act: 'cr-act', val: 'More: merge, archive, export' }) });
  const facts = `<div class="flex" style="gap:6px 18px;font-size:.82rem;padding:8px 12px;background:var(--surface);border:1px solid var(--border);border-radius:10px">${[[`${props.length} ${props.length === 1 ? 'property' : 'properties'}`, ''], [`Client since ${cl.since}`, ''], ['LTV', fin === 'full' ? kmoney(cl.ltv) : mk(`Hidden: lifetime value needs full client_financial; ${c.role} has ${c.fc('client_financial')} (02 §10.2)`)], ['Balance', balCell(c, cl)], ['Agreement', ag ? esc(ag.name) : 'None'], ['Language', cl.name === D.res.client ? 'EN' : 'EN']].map(([k, v]) => `<span><span class="t3">${k}</span>${v ? ' <b>' + v + '</b>' : ''}</span>`).join('<span class="t3">|</span>')}</div>`;
  const tabsHtml = h.tabs('cr-tab', tabs.map(k => [k, labels[k][0], labels[k][1]]), 'overview');
  let body = '';
  const nextVisit = vis[0] ? `${c.winter ? 'Snow route tonight' : 'Today ' + esc(vis[0].start)} · ${esc(vis[0].service)} · ${esc(vis[0].crew)}` : ag ? `${c.winter ? 'Spring start-up, week of Apr 6' : 'Tue May 18'} · ${esc(ag.name)}` : 'None scheduled';
  if (tab === 'overview') {
    body = (c.role === 'bookkeeper' ? h.card({ title: 'Billing summary', body: h.kv([['Bill to', esc(cl.name)], ['Billing contact', contactVal(c, (contacts.find(x => x.billing || x.scope === 'Primary') || {}).email, { billing: true })], ['Terms', cl.type === 'residential' ? 'Due on receipt' : 'Net 30, PO required'], ['Payment method', cl.autopay ? 'Card on file (autopay)' : 'ACH or check'], ['Tax', 'Taxable services: labor exempt, materials taxed (Ohio)'], ['Balance', balCell(c, cl)]]) }) : h.card({ title: 'Properties', flush: true, body: `<div class="stack8" style="padding:4px 12px">${props.map(p => propertyCard(c, p, { go: true })).join('<hr style="border:0;border-top:1px solid var(--border);margin:4px 0">')}</div>` }))
      + (c.role === 'bookkeeper' ? '' : h.card({ title: 'Active work', body: `${ag ? `<div class="small"><b>${esc(ag.name)}</b> · ${esc(ag.billing)}${c.sees('price') ? ' · ' + money(ag.value) + '/season' : ''}</div>` : ''}<div class="small t2">Next visit: ${nextVisit}</div>${jobs.slice(0, 2).map(j => `<div class="flex between small"><span>${h.link(esc(j.id), 'web.job', j.id)} ${esc(j.title)} · phase ${esc(j.phase)}</span><span class="nowrap">${h.mask(c, 'budget_hours', `Budget ${Math.round(100 * j.actualHrs / j.budgetHrs)}%`)}</span></div>`).join('')}` }))
      + (tabs.includes('sales') && props2.length ? h.card({ title: 'Sales', body: props2.map(p => `<div class="flex between small"><span>${h.link(esc(p.id), 'web.proposal', p.id)} ${esc(p.title)} · ${h.mask(c, 'price', money(p.value))} · ${esc(p.viewed)}</span><span class="flex">${stPill(p.status)}${c.allowed('proposal.send') && p.status !== 'Signed' ? h.btn('Nudge', { sm: true, act: 'cr-act', val: 'Nudge sent with message' }) : ''}</span></div>`).join('') }) : '')
      + (tabs.includes('money') ? h.card({ title: 'Money', body: fin === 'chip' ? `<div class="flex">${arChip(cl)}<span class="small t2">AR status only. Invoices and payments live in Money for the office and the bookkeeper.</span></div>` : `${pays[0] ? row('Last payment', `${money(pays[0].amount)} · ${esc(pays[0].date)} · ${esc(pays[0].method)}`) : row('Last payment', 'None this season')}${row('Open invoices', invs.filter(i => i.balance).length ? invs.filter(i => i.balance).map(i => esc(i.id) + ' ' + money(i.balance)).join(', ') : 'None')}` }) : '');
  } else if (tab === 'properties') {
    body = h.table([{ k: 'id', label: 'Property', m: true }, { k: 'address', label: 'Address' }, { k: 'lot', label: 'Lot', n: true, fmt: v => num(v) + ' sq ft' }, { k: 'turf', label: 'Turf', n: true, fmt: v => num(v) + ' sq ft' }, { k: 'beds', label: 'Beds', n: true }, { k: 'gate', label: 'Access', fmt: v => v ? h.mask(c, 'access_secret', esc(v)) : 'None' }], props, { go: 'web.property' });
  } else if (tab === 'work') {
    body = (ag ? h.card({ title: 'Service agreement', body: h.kv([['Agreement', `${esc(ag.id)} ${esc(ag.name)}`], ['Billing', esc(ag.billing)], ['Visits', `${ag.visits} per season`], ['Renews', `${esc(ag.renews)} · ${esc(ag.escalator)}`], c.sees('price') ? ['Value', money(ag.value)] : null]) }) : '')
      + h.card({ title: 'Jobs and visits', flush: true, body: (jobs.length || vis.length) ? h.table([{ k: 'id', label: 'Record', m: true }, { k: 'title', label: 'Work' }, { k: 'status', label: 'Status', fmt: s => stPill(s) }, { k: 'when', label: 'When' }, { k: 'crew', label: 'Crew' }], jobs.map(j => ({ id: j.id, title: j.title, status: j.status, when: 'Start ' + j.start, crew: j.crew })).concat(vis.map(v => ({ id: v.id, title: v.service, status: v.status === 'Done' ? 'Complete' : v.status, when: (c.winter ? 'Last May ' : 'Today ') + v.start, crew: v.crew }))), { go: 'web.job' }) : h.empty('No jobs yet for this client.') });
  } else if (tab === 'sales') {
    body = h.card({ title: 'Opportunities, estimates and proposals', flush: true, body: (opps.length + ests.length + props2.length) ? h.table([{ k: 'id', label: 'Record', m: true }, { k: 'title', label: 'Title' }, { k: 'stage', label: 'Stage', fmt: s => stPill(s) }, { k: 'value', label: 'Value', n: true, fmt: v => h.mask(c, 'price', money(v)) }, { k: 'by', label: 'Owner' }], opps.map(o => ({ id: o.id, title: o.title, stage: o.stage, value: o.value, by: o.owner, go: 'web.pipeline' })).concat(ests.map(e => ({ id: e.id, title: e.title, stage: e.status, value: e.value, by: e.by }))).concat(props2.map(p => ({ id: p.id, title: p.title, stage: p.status, value: p.value, by: '' })))) : h.empty('No sales activity. Start one from an estimate or Quick Quote.') });
  } else if (tab === 'designs') {
    body = des.length ? h.cols('2', des.map(d => h.card({ title: `${esc(d.id)} ${esc(d.title)}`, sub: `${esc(d.status)} · ${esc(d.designer)} · updated ${esc(d.updated)}`, body: `${h.photo('mockup', { badge: 'AI artist rendering', label: d.title })}<div class="flex">${h.pill(d.plants + ' plants')}${h.pill(num(d.area) + ' sq ft')}${h.pill(d.mockups + ' mockups', 'ai')}</div>`, actions: h.btn('Open', { sm: true, go: 'web.studio', x: d.id }) }))) : h.empty('No designs for this client yet.');
  } else if (tab === 'money') {
    body = fin === 'chip' ? h.card({ title: 'Accounts receivable', body: `<div class="flex">${arChip(cl)}<span class="small t2">${esc(c.roleObj.name)} sees AR status only (client_financial = status chip, 02 §10.2). Ask the office for invoice detail.</span></div>` })
      : h.kpis([{ label: 'Balance', value: money(cl.balance) }, { label: 'Past due', value: cl.pastDue ? cl.pastDue + ' days' : 'None', tone: cl.pastDue ? 'danger' : 'ok' }, { label: 'Lifetime value', value: kmoney(cl.ltv) }, { label: 'Autopay', value: cl.autopay ? 'On' : 'Off' }])
      + h.card({ title: 'Invoices', flush: true, body: h.table([{ k: 'id', label: 'Invoice', m: true }, { k: 'date', label: 'Date' }, { k: 'due', label: 'Due' }, { k: 'po', label: 'PO' }, { k: 'amount', label: 'Amount', n: true, fmt: v => money(v) }, { k: 'balance', label: 'Balance', n: true, fmt: v => money(v) }, { k: 'status', label: 'Status', fmt: s => stPill(s) }], invs, { go: 'web.invoice', empty: 'No invoices yet.' }) })
      + h.card({ title: 'Payments', flush: true, body: h.table([{ k: 'id', label: 'Payment', m: true }, { k: 'date', label: 'Date' }, { k: 'method', label: 'Method' }, { k: 'invoice', label: 'Applied to', m: true }, { k: 'amount', label: 'Amount', n: true, fmt: v => money(v) }], pays, { empty: 'No payments this season.' }) });
  } else if (tab === 'comms') {
    const th = threads(c).filter(t => t.clientId === cl.id && (c.role !== 'bookkeeper' || t.topic === 'billing'));
    body = h.card({ title: 'Conversations', sub: 'All channels, one thread per contact', flush: true, body: th.length ? h.list(th.map(t => ({ icon: t.chIcon, title: `${esc(t.who)} · ${esc(t.ch)}`, sub: esc(t.preview), right: `<span class="tiny t3">${esc(t.when)}</span>`, go: 'web.inbox' }))) : h.list([{ icon: 'mail', title: 'Visit summary sent', sub: 'Automated after each visit, with photos', right: '<span class="tiny t3">May 4</span>' }, { icon: 'chat', title: 'Appointment reminder', sub: 'SMS · service consent on', right: '<span class="tiny t3">May 3</span>' }]) });
  } else if (tab === 'files') {
    body = h.card({ title: 'Files', flush: true, body: h.list([['Signed proposal PDF', 'receipt', 'Sales'], ['Certificate of insurance request', 'shield', 'Compliance'], ['W-9 sent to client AP', 'receipt', 'Billing'], ['Site photos (24)', 'camera', 'Work'], ['Plan sheet v3 (PDF)', 'pen', 'Design']].filter(([, , cat]) => c.role !== 'bookkeeper' || cat === 'Billing' || cat === 'Sales').map(([n, ic, cat]) => ({ icon: ic, title: n, sub: cat, right: h.btn('Download', { sm: true, act: 'cr-act', val: 'Download started' }) }))) });
  } else if (tab === 'notes') {
    body = c.sees('internal_note') ? `<div class="stack8">${[[c.owner, '@' + first(castOf(c, 'ops_manager')) + ' client prefers texts after 4 pm; dog is friendly but jumps.', 'May 6'], [castOf(c, 'estimator'), 'Budget conversation: comfortable at $30k if phased over two seasons.', 'Apr 22']].map(([w, t, d]) => `<div class="small" style="border:1px dashed var(--border-strong);border-radius:10px;padding:8px 10px"><div class="tiny t3">${h.pill('Internal')} ${esc(w)} · ${d}</div>${esc(t)}</div>`).join('')}${h.textarea('', { ph: 'Add an internal note. @mention to notify.', label: 'Note' })}</div>` : h.mask(c, 'internal_note', '');
  }
  const tl = h.timeline([
    { when: c.winter ? 'Today 7:42 am' : 'Today 8:41 am', text: `Proposal ${esc((props2[0] || D.proposals[0]).id)} viewed (4th view, iPhone) ${icon('eye', 's')}`, tone: 'ok' },
    vis[0] ? { when: 'May 4', text: `Visit completed ${esc(vis[0].id)} · 3 photos · ${esc(vis[0].crew)}`, tone: '' } : { when: 'May 4', text: 'Visit completed · 3 photos', tone: '' },
    c.has('agents_mvp') ? { when: 'May 3', text: `${icon('spark', 's')} Copilot drafted a renewal email <span class="t3">(AI draft)</span>`, tone: 'ai' } : null,
    fin === 'full' ? { when: 'May 2', text: pays[0] ? `Payment ${money(pays[0].amount)} received` : 'Statement sent', tone: 'info' } : null,
    c.sees('internal_note') ? { when: 'Apr 22', text: `<span style="border:1px dashed var(--border-strong);border-radius:4px;padding:0 4px">Internal</span> Note by ${esc(first(castOf(c, 'estimator')))}`, tone: '' } : null,
  ].filter(Boolean));
  const rail = `<div class="stack12">${h.card({ title: 'Contacts', flush: true, body: h.list(contacts.filter(x => c.role !== 'bookkeeper' || x.billing || x.scope === 'Primary').slice(0, 4).map(x => ({ av: x.name, title: `${esc(x.name)} <span class="tiny t3">${esc(x.scope)}</span>`, sub: `${contactVal(c, x.phone, { billing: x.billing || x.scope === 'Primary' })} · ${contactVal(c, x.email, { billing: x.billing || x.scope === 'Primary' })}` }))), actions: c.allowed('client.contact') ? h.btn('Manage', { sm: true, go: 'web.contacts', x: cl.id }) : '' })}
    ${c.role === 'bookkeeper' ? '' : h.card({ title: 'Upcoming', body: `${row(c.winter ? 'Tonight' : 'Today', vis[0] ? esc(vis[0].service) : 'Nothing today')}${row(c.winter ? 'Apr 6' : 'May 18', ag ? 'Next agreement visit' : 'Follow-up call')}${row(c.winter ? 'Apr 20' : 'Oct 28', c.mod('irrigation') ? 'Irrigation ' + (c.winter ? 'start-up' : 'winterize') : 'Fall cleanup')}` })}
    ${h.card({ title: 'Activity', actions: h.btn('Filter', { sm: true, icon: 'filter', act: 'cr-act', val: 'Filter: system events hidden for non-admins' }), body: tl })}
    ${c.allowed('inbox.conversation') ? h.card({ body: `${h.tabs('cr-comp', [['note', 'Note'], ['sms', 'SMS'], ['email', 'Email']], 'note')}${h.textarea('', { ph: U('cr-comp', 'note') === 'sms' ? 'Text in EN · service consent on' : U('cr-comp', 'note') === 'email' ? 'Email from the Company domain' : 'Internal note', label: 'Composer' })}<div class="flex">${h.btn(U('cr-comp', 'note') === 'note' ? 'Save note' : 'Send', { sm: true, kind: 'primary', act: 'cr-act', val: 'Saved to the timeline' })}</div>` }) : ''}</div>`;
  return head + facts + grid('minmax(0,1fr) 280px', [`<div class="stack12">${tabsHtml}${body}</div>`, rail]);
});
RL.act('cr-act', (el) => { RL.toast(esc(el.dataset.val || 'Done') + ' (mock)'); return false; });

RL.screen('web.property', (c) => {
  const D = c.D, p0 = D.properties.find(p => p.id === c.x);
  const cl = p0 ? D.clients.find(x => x.id === p0.client) : pickClient(c);
  const p = p0 || propsOf(c, cl)[0] || D.properties[0];
  const sec = c.sees('access_secret');
  const ds = D.designs.filter(d => d.clientId === cl.id);
  const vis = D.visits.filter(v => v.clientId === cl.id);
  const bedA = Math.round(p.beds * 128 + 214), hard = Math.round(p.lot * .06);
  const meas = [['Lot (parcel)', num(p.lot) + ' sq ft', 'Parcel data', 'High'], ['Turf', num(p.turf) + ' sq ft', 'Aerial AI, Apr 2026', '0.88'], ['Beds', `${num(bedA)} sq ft (${p.beds} beds)`, c.inLens('V1') ? 'Aerial AI ' + h.tag('V1') : 'Manual, May 2026', '0.81'], ['Hardscape', num(hard) + ' sq ft', 'Manual, May 2026', 'Verified'], ['Bed edge', num(Math.round(bedA / 6.5)) + ' lin ft', 'Derived', '0.80'], ['Slope', '4% average · max 11%', 'USGS 3DEP', 'High']];
  const head = h.page({ crumbs: [['Clients', 'web.clients'], [esc(cl.name), 'web.client', cl.id], [esc(p.id)]], title: esc(p.address), sub: `${esc(p.city)} · ${esc(c.t.region)} · USDA zone ${zoneOf(c)} · ${num(p.lot)} sq ft lot`, actions: (c.allowed('design') && /W/.test(c.can('design')) ? h.btn('Start design', { icon: 'pen', go: 'web.studio' }) : '') + (c.allowed('site_assessment') ? h.btn('Site assessment', { icon: 'clipboard', go: 'web.assessments' }) : '') });
  const zones = p.zones ? Array.from({ length: Math.min(p.zones, 8) }, (_, i) => ({ z: 'Zone ' + (i + 1), area: ['Front turf', 'Front beds (drip)', 'Side yard', 'Back turf east', 'Back turf west', 'Back border (drip)', 'Parkway', 'Patio pots (drip)'][i], heads: ['Rotor x6', 'Drip 48 emitters', 'Spray x8', 'Rotor x7', 'Rotor x7', 'Drip 62 emitters', 'Spray x5', 'Drip 12 emitters'][i], run: ['22 min', '35 min', '14 min', '24 min', '24 min', '40 min', '12 min', '18 min'][i] })) : [];
  const plants = [['Little Lime Hydrangea', 5, 'Bed A', '2024'], ['Little Bluestem', 24, 'Back border', '2024'], ['Serviceberry', 2, 'Back border', '2023'], ["Walker's Low Catmint", 9, 'Bed A', '2024'], ['Green Velvet Boxwood', 3, 'Side bed', '2021'], ['Burning Bush', 1, 'Fence line', 'existing']].map(([n, q, bed, yr]) => { const pl = PL(n); return { n, q, bed, yr, pl }; });
  return head + grid('minmax(0,1.25fr) minmax(0,1fr)', [
    `<div class="stack12">${h.card({ title: 'Map and measurements', sub: 'Measured site plan · north up', body: lotSvg(p) + h.table([{ k: 0, label: 'Feature' }, { k: 1, label: 'Measured', n: true }, { k: 2, label: 'Source' }, { k: 3, label: 'Confidence', fmt: v => h.pill(esc(v), v === 'High' || v === 'Verified' ? 'ok' : +v < 0.85 ? 'warn' : 'info') }], meas, { dense: true }) + h.note('A value under 0.75 confidence must be verified on site before a Quick Quote can be sent (03 EST-11).') })}
     ${zones.length ? h.card({ title: 'Irrigation zones', sub: `${p.zones} zones · ${esc(p.controller)}`, body: h.table([{ k: 'z', label: 'Zone' }, { k: 'area', label: 'Area' }, { k: 'heads', label: 'Heads' }, { k: 'run', label: 'Run time', n: true }], zones, { dense: true }) }) : ''}
     ${h.card({ title: 'Plant inventory', sub: 'From as-built designs and crew plant ID', flush: true, body: h.table([{ k: 'n', label: 'Plant', fmt: (n, r) => `<div class="small b">${esc(n)}</div><div class="tiny t3">${r.pl ? esc(r.pl.botanical) : ''}</div>` }, { k: 'q', label: 'Qty', n: true }, { k: 'bed', label: 'Location' }, { k: 'yr', label: 'Planted' }, { k: 'pl', label: c.t.region, fmt: pl => pl ? ratingPill(pl) : '' }], plants, { dense: true }) })}</div>`,
    `<div class="stack12">${h.card({ title: 'Site notes and access', tone: p.dog ? 'warn' : '', body: h.kv([['Gate', p.gate ? (sec ? (/R in window/.test(c.fc('access_secret')) ? '<span class="masked" title="Shown during the visit window only">in visit window</span>' : `<b>${esc(p.gate)}</b>`) : h.mask(c, 'access_secret', '')) : 'No gate'], ['Pets', p.dog ? esc(p.dog) : 'None noted'], ['Hazards', 'Low branch over driveway; septic lid in back turf'], ['Parking', 'Street only, no trailer in the drive'], ['Deer pressure', h.pill('High', 'warn') + ' (client reported)'], ['Salt exposure', 'Driveway and walk salted in winter']]) + (sec ? '' : h.note('Gate codes and alarm notes are access secrets, hidden for this role (02 §10.2).')) })}
     ${h.card({ title: 'Service history', flush: true, body: h.list((vis.length ? vis.slice(0, 3).map(v => ({ t: v.service, d: (c.winter ? 'May ' : 'Today ') + v.start, s: v.crew })) : []).concat([{ t: 'Spring cleanup', d: 'Apr 14', s: 'Maintenance 2' }, { t: 'Irrigation start-up', d: 'Apr 6', s: 'Irrigation tech' }, { t: 'Fall cleanup', d: 'Nov 3, 2026', s: 'Maintenance 2' }]).slice(0, 5).map(x => ({ icon: 'check', tone: 'ok', title: esc(x.t), sub: `${esc(x.d)} · ${esc(x.s)} · photos`, right: '' }))) })}
     ${h.card({ title: 'Designs', flush: true, body: ds.length ? h.list(ds.map(d => ({ icon: 'pen', tone: 'info', title: `${esc(d.id)} ${esc(d.title)}`, sub: `${esc(d.status)} · ${d.plants} plants`, go: 'web.studio', x: d.id }))) : h.empty('No designs on this property.') })}
     ${h.card({ title: 'Equipment on site', body: h.kv([p.controller ? ['Controller', esc(p.controller)] : null, ['Lighting', c.mod('lighting') ? '300 W transformer, smart timer' : 'None'], ['Backflow', p.zones ? 'PVB, tested Apr 2026' : 'None'], ['Rain sensor', p.zones ? 'Wireless, on gutter' : 'None']]) })}</div>`]);
});

RL.screen('web.contacts', (c) => {
  const D = c.D, cl = pickClient(c), list = contactsOf(c, cl);
  const bk = c.role === 'bookkeeper';
  const editable = x => bk ? !!x.billing || x.scope === 'Primary' && cl.type === 'residential' : /W/.test(c.can('client.contact'));
  const head = h.page({ crumbs: [['Clients', 'web.clients'], [esc(cl.name), 'web.client', cl.id], ['Contacts']], title: 'Contacts and portal access', sub: `${esc(cl.name)} · ${list.length} contacts · portal ${esc(RL.portalBrand ? RL.portalBrand(c).host : c.t.brand.portal)}`, actions: (/W/.test(c.can('client.contact')) ? h.btn('Add contact', { kind: 'primary', icon: 'plus', act: 'ct-act', val: 'Contact added; magic-link invite queued' }) : '') });
  const scopeTone = s => ({ Primary: 'ok', 'Co-owner': 'info', Approver: 'accent', Billing: 'warn', 'Property contact': '', Viewer: '' }[s] || '');
  return head + (bk ? h.note('Bookkeeper: you can edit billing contacts only (client.contact RW/a billing contacts).') : '')
    + h.card({ flush: true, body: h.table([
      { k: 'name', label: 'Contact', fmt: (n, x) => `<div class="flex nw">${h.avatar(n)}<div><div class="b small">${esc(n)}</div><div class="tiny t3">${contactVal(c, x.email, { billing: x.billing || x.scope === 'Primary' })} · ${contactVal(c, x.phone, { billing: x.billing || x.scope === 'Primary' })}</div></div></div>` },
      { k: 'scope', label: 'Role', fmt: (s, x) => `${h.pill(esc(s), scopeTone(s))}<div class="tiny t3">${esc(x.roles)}${x.term ? ' · ' + esc(x.term) : ''}</div>` },
      { k: 'portal', label: 'Portal', fmt: v => h.pill(esc(v), /Active/.test(v) ? 'ok' : 'info') },
      { k: 'sms', label: 'SMS consent', fmt: v => `<span class="small">${esc(v)}</span>` },
      { k: 'email', label: 'Email', fmt: (v, x) => `<span class="small">${esc(x.email ? 'On' : 'Off')}</span>` },
      { k: 'lang', label: 'Lang' },
      { k: 'last', label: 'Last portal visit' },
      { k: 'scope', label: '', fmt: (s, x) => editable(x) ? h.btn('Edit', { sm: true, act: 'ct-act', val: 'Edit contact ' + x.name }) : '<span class="tiny t3">Read only</span>' },
    ], list) })
    + grid('1fr 1fr', [
      h.card({ title: 'What each role can do in the portal', sub: '02 §3.4.4, §5.11', body: h.kv([['Primary', 'Everything on the account. Exactly one per client.'], ['Co-owner', 'View all, approve proposals, pay. Payment methods off by default.'], ['Approver', 'Vote on proposals and change orders within the policy. Rights lapse at term end.'], ['Billing', 'Invoices, statements, payments and tax certificates only.'], ['Property contact', 'Schedule, visit notices and requests for assigned properties. Never prices.'], ['Viewer', 'Read-only shared designs and proposals.']]) }),
      h.card({ title: 'Consent ledger', sub: 'Every change is versioned with source and time (16 §4.21)', body: h.timeline([{ when: 'May 10, 6:02 am', text: `SMS opt-out by reply "stop texting me" · applied before any draft`, tone: 'warn' }, { when: 'Apr 2', text: 'Marketing consent captured on the booking form (text v3)', tone: 'ok' }, { when: 'Mar 18', text: 'Portal invite accepted with passkey', tone: 'info' }]) + h.note('Consent can be turned on only with proof (form, signature or recorded call). Staff cannot toggle marketing on by hand.') })]);
});
RL.act('ct-act', (el) => { RL.toast(esc(el.dataset.val) + ' (mock)'); return false; });

// ---------- Sales: leads, pipeline, assessments (03 §4.1-4.4) ----------
function leadsOf(c) {
  const D = c.D, est = castOf(c, 'estimator', c.owner), des = c.t.cast && c.t.cast.designer;
  return D.leads.map((l, i) => Object.assign({}, l, { owner: i === 4 && des ? des : i % 3 === 2 ? 'Branch pool' : est, phone: '(614) 555-02' + (10 + i * 7), email: first(l.name).toLowerCase() + '@example.com', first: ['1 m 40 s', '2 m 05 s', '58 s', '4 m 12 s', '1 m 15 s', '3 m 30 s', '45 s', '2 m 50 s', '1 m 05 s', '6 m 10 s'][i], dup: i === 3 ? c.D.clients[2] : null }));
}
RL.screen('web.leads', (c) => {
  const D = c.D, all = leadsOf(c), r = c.role;
  const mineOnly = /\/o/.test(c.can('lead')) && !/\/a|\/b/.test(c.can('lead').replace(/R\/b pool/, ''));
  const pool = r === 'estimator' ? all.filter(l => l.owner === c.who || l.owner === 'Branch pool') : r === 'designer' ? all.filter(l => l.owner === c.who) : all;
  const tab = U('ld-tab', 'New');
  const list = tab === 'All' ? pool : pool.filter(l => l.status === tab);
  const sel = pool.find(l => l.id === U('ld-sel', '')) || list[0] || pool[0];
  const head = h.page({ title: 'Leads', sub: `${pool.length} leads · median first response ${c.has('agents_mvp') ? '1 m 40 s with the Lead Follow-up agent' : '22 min'}`, actions: (c.allowed('lead') && /W/.test(c.can('lead')) ? h.btn('New lead', { kind: 'primary', icon: 'plus', act: 'ld-act', val: 'New lead form' }) : '') });
  const tabs = h.tabs('ld-tab', [['New', 'New', pool.filter(l => l.status === 'New').length], ['Contacted', 'Contacted', pool.filter(l => l.status === 'Contacted').length], ['Qualified', 'Qualified', pool.filter(l => l.status === 'Qualified').length], ['All', 'All', pool.length]], 'New');
  if (!sel) return head + tabs + h.empty(r === 'designer' ? 'No leads assigned to you. Designers see their own leads only (lead R/o).' : 'No leads yet.');
  const scoreV1 = c.inLens('V1');
  const items = list.map(l => `<div class="li-i go" role="button" tabindex="0" data-ui="ld-sel" data-val="${l.id}" style="${l.id === sel.id ? 'background:var(--primary-soft);' : ''}grid-template-columns:auto minmax(0,1fr) auto">${h.avatar(l.name)}<div style="min-width:0"><div class="tt">${esc(l.name)}</div><div class="ss">${esc(l.service)} · ${esc(l.source)}</div><div class="ss">${esc(l.age)} ago · ${esc(l.owner)}</div></div><div style="display:grid;gap:3px;justify-items:end">${h.mask(c, 'price', '<span class="small num">' + kmoney(l.value) + '</span>')}${scoreV1 ? h.pill('Score ' + l.score, l.score >= 70 ? 'ok' : l.score >= 50 ? 'info' : '') : ''}</div></div>`).join('') || h.empty('Nothing in this view.');
  const conv = c.has('agents_mvp') ? h.aiCard({ agent: 'Lead Follow-up (A3)', level: 'L2', credits: 4, title: `First reply in ${sel.first}, inside business hours`, body: `<div class="stack8 small"><div><b>Rootline:</b> "Thanks ${esc(first(sel.name))}! A few quick questions so ${esc(first(sel.owner === 'Branch pool' ? castOf(c, 'estimator', c.owner) : sel.owner))} comes prepared: roughly how big is the area, when would you like it done, and does your HOA need to approve it?"</div><div><b>${esc(first(sel.name))}:</b> "${sel.status === 'New' ? 'About 400 sq ft behind the house. Ideally before July. No HOA.' : 'Before July works. No HOA. Thursday is good.'}"</div><div><b>Rootline:</b> "Great. I can book a site visit Thursday 9:00, Friday 1:30 or Monday 10:00."</div></div>`, why: 'Stops on reply from a person, opt-out, booking or takeover. Quiet hours 8 pm to 8 am. Nurture beyond the inquiry needs consent from the form.', actions: h.btn('Take over', { sm: true, act: 'ld-act', val: 'You took over; the agent stopped' }) }) : `<div class="flex">${lockPill(c, 'agents_mvp', 'Lead Follow-up agent')}</div>`;
  const detail = h.card({ title: `${esc(sel.name)} ${h.pill(esc(sel.status), sel.status === 'New' ? 'info' : sel.status === 'Qualified' ? 'ok' : '')}`, sub: `${esc(sel.id)} · ${esc(sel.source)} · ${esc(sel.age)} ago`, body: `${h.kv([['Service', esc(sel.service)], ['Budget band', h.mask(c, 'price', kmoney(sel.value))], ['Address', `${esc(sel.address)}, ${esc(c.t.city.split(',')[0])}`], ['Contact', `${contactVal(c, sel.phone)} · ${contactVal(c, sel.email)}`], ['Service area', h.pill('Inside: north territory, 14 min from the yard', 'ok')], ['Owner', esc(sel.owner)], scoreV1 ? ['Score ' + h.tag('V1'), `${sel.score} · fit ${sel.score > 60 ? 'high' : 'medium'}, source quality, budget vs service`] : null, ['Duplicate check', sel.dup ? `${h.pill('Possible match', 'warn')} ${esc(sel.dup.name)} by phone` : 'No match on name, phone or address']])}
    ${conv}
    <div class="tiny t3" style="font-weight:700;text-transform:uppercase;letter-spacing:.05em">Book a site visit</div><div class="flex">${['Thu 9:00', 'Fri 1:30', 'Mon 10:00'].map(s => doneOr('ld-' + sel.id + s, `<button type="button" class="btn sm" data-act="td-do" data-val="ld-${esc(sel.id + s)}" title="Site visit booked ${s}">${s}</button>`, 'Booked ' + s)).join('')}</div>`,
    actions: /W|X/.test(c.can('lead')) ? h.btn('Convert to opportunity', { sm: true, kind: 'primary', act: 'ld-act', val: 'Opportunity created in Qualified' }) + h.btn('Quick Quote', { sm: true, go: 'web.estimates' }) + h.btn('Mark lost', { sm: true, act: 'ld-act', val: 'Marked lost: reason required' }) : '' });
  return head + (mineOnly || r === 'estimator' ? h.note(`${esc(c.roleObj.name)}: your leads plus the branch pool (lead ${esc(c.can('lead'))}).`) : '') + tabs + grid('minmax(0,0.9fr) minmax(0,1.3fr)', [`<div class="cd" style="overflow:hidden"><div class="li">${items}</div></div>`, detail]);
});
RL.act('ld-act', (el) => { RL.toast(esc(el.dataset.val) + ' (mock)'); return false; });

const STAGES = ['New', 'Qualified', 'Site visit', 'Designing', 'Proposal sent', 'Won'];
RL.screen('web.pipeline', (c) => {
  const D = c.D, r = c.role;
  const scope = r === 'estimator' ? 'mine' : r === 'designer' ? 'design' : U('pi-scope', 'all');
  const opps = D.opps.filter(o => scope === 'mine' ? o.owner === c.who : scope === 'design' ? o.stage === 'Designing' : true);
  const view = U('pi-view', 'board');
  const stale = o => parseInt(o.age, 10) > 21 && o.stage !== 'Won';
  const weighted = sum(opps.filter(o => o.stage !== 'Won'), o => o.value * o.prob / 100);
  const head = h.page({ title: 'Pipeline', sub: `${opps.length} opportunities · ${h.mask(c, 'price', kmoney(sum(opps, o => o.value)))} total · weighted ${h.mask(c, 'price', kmoney(weighted))}`, actions: `${seg('pi-view', [['board', 'Board'], ['table', 'Table']], 'board')}${c.inLens('V1') ? h.btn('Map ' + h.tag('V1'), { sm: true, act: 'ld-act', val: 'Map view' }) : ''}${/W/.test(c.can('opportunity')) ? h.btn('New opportunity', { kind: 'primary', icon: 'plus', act: 'ld-act', val: 'New opportunity' }) : ''}` });
  const kp = h.kpis([{ label: 'Open pipeline', value: h.mask(c, 'price', kmoney(sum(opps.filter(o => o.stage !== 'Won'), o => o.value))) }, { label: 'Weighted', value: h.mask(c, 'price', kmoney(weighted)) }, { label: 'Stale over 21 days', value: opps.filter(stale).length, tone: 'warn', delta: 'Nudge or close' }, { label: 'Win rate (90 d)', value: D.kpi.closeRate + '%' }, { label: c.winter ? 'Spring backlog' : 'Backlog', value: D.kpi.backlogWeeks + ' wk' }]);
  const scopeBar = r === 'estimator' ? h.note('Your pipeline (opportunity RWX/o).') : r === 'designer' ? h.note('Designer: opportunities in the Designing stage, read only.') : `<div class="flex">${seg('pi-scope', [['all', 'Everyone'], ['mine', 'Mine']], 'all')}<span class="tiny t3">Forecast ${h.tag('V1')} uses stage probability x value.</span></div>`;
  const body = view === 'table' ? h.card({ flush: true, body: h.table([{ k: 'id', label: 'Opp', m: true }, { k: 'client', label: 'Client', fmt: (v, o) => `<div class="b small">${esc(v)}</div><div class="tiny t3">${esc(o.title)}</div>` }, { k: 'stage', label: 'Stage', fmt: s => stPill(s) }, { k: 'value', label: 'Value', n: true, fmt: v => h.mask(c, 'price', money(v)) }, { k: 'prob', label: 'Prob.', n: true, fmt: v => v + '%' }, { k: 'owner', label: 'Owner' }, { k: 'next', label: 'Next step' }, { k: 'age', label: 'Age', fmt: (v, o) => stale(o) ? h.pill(v + ' stale', 'warn') : esc(v) }], opps, { go: 'web.client', x: o => o.clientId }) })
    : h.board(STAGES.map(s => { const os = opps.filter(o => o.stage === s); return { title: s, sub: `${os.length} · ${c.sees('price') ? kmoney(sum(os, o => o.value)) : ''}`, cards: os.map(o => ({ title: esc(o.client), sub: `${esc(o.title)} · ${h.mask(c, 'price', money(o.value))}`, meta: `${h.avatar(o.owner)}<span class="tiny t3">${esc(o.next)}</span>${stale(o) ? h.pill(o.age, 'warn') : ''}${/AI/.test(o.next) ? h.pill('AI draft', 'ai') : ''}`, go: 'web.client', x: o.clientId, tone: /AI/.test(o.next) ? 'ai' : '' })) }; }));
  return head + kp + scopeBar + body;
});

function assessments(c) {
  const D = c.D, est = castOf(c, 'estimator', c.owner);
  return [[D.leads[2], 'Synced', 14, 3, 2.4], [D.leads[5], 'Draft estimate ready', 22, 5, 3.1], [{ name: D.res.client, address: D.res.property, service: D.res.project }, 'Complete', 31, 6, 4.0], [D.leads[7], 'Scheduled', 0, 0, 0]].map(([l, s, ph, m, v], i) => ({ id: 'SA-' + (301 + i), who: l.name, address: l.address, service: l.service, status: s, photos: ph, meas: m, voice: v, by: i === 1 && c.t.cast && c.t.cast.designer ? c.t.cast.designer : est, when: ['Today 8:30', 'Yesterday', 'May 6', 'Thu 9:00'][i] }));
}
RL.screen('web.assessments', (c) => {
  const D = c.D, list = assessments(c), sel = list.find(a => a.id === U('as-sel', '')) || list[1];
  const own = sel.by === c.who || c.role === 'owner' || c.role === 'office_manager' || c.role === 'ops_manager';
  const head = h.page({ title: 'Site assessments', sub: 'Captured offline on iPad or phone, synced with photos, measurements and voice notes', tags: h.tag('V1'), actions: /W/.test(c.can('site_assessment')) ? h.btn('Schedule assessment', { kind: 'primary', icon: 'plus', act: 'ld-act', val: 'Site visit scheduled' }) : '' });
  const tbl = h.card({ flush: true, body: `<div class="li">${list.map(a => `<div class="li-i go" role="button" tabindex="0" data-ui="as-sel" data-val="${a.id}" style="${a.id === sel.id ? 'background:var(--primary-soft)' : ''}"><span class="ico ${a.status === 'Draft estimate ready' ? 'ai' : a.status === 'Scheduled' ? '' : 'ok'}">${icon('clipboard')}</span><div style="min-width:0"><div class="tt">${esc(a.id)} ${esc(a.who)}</div><div class="ss">${esc(a.service)} · ${esc(a.when)} · ${esc(first(a.by))}</div></div><div class="flex nw gap4">${a.photos ? h.pill(icon('camera', 's') + a.photos) : ''}${h.pill(esc(a.status), a.status === 'Draft estimate ready' ? 'ai' : a.status === 'Scheduled' ? 'info' : 'ok')}</div></div>`).join('')}</div>` });
  const ai = U('as-ai', '');
  const detail = h.card({ title: `${esc(sel.id)} · ${esc(sel.who)}`, sub: `${esc(sel.address)} · ${esc(sel.when)} · by ${esc(sel.by)}`, body: sel.status === 'Scheduled' ? h.empty('Scheduled. The checklist, property measurements and last season\'s notes are cached for offline use.') : `${grid('repeat(3,minmax(0,1fr))', [h.photo('before', { label: 'Back yard', badge: 'Photo 1 of ' + sel.photos }), h.photo('bed', { label: 'Foundation bed', badge: 'Annotated' }), h.photo('lawn', { label: 'Side yard' })], 8)}
    ${h.table([{ k: 0, label: 'Checklist item' }, { k: 1, label: 'Answer' }], [['Access', 'Gate 42 in: machine fits (x1.10)'], ['Haul distance', '50-150 ft from drop point (x1.10)'], ['Soil', 'Heavy clay (x1.20)'], ['Slope', 'Under 10%'], ['Utilities', 'Called in, flags expected Thu'], ['Deer pressure', 'High (client reported)']], { dense: true })}
    ${h.table([{ k: 0, label: 'Measurement' }, { k: 1, label: 'Value', n: true }, { k: 2, label: 'Source' }], [['Patio area', '320 sq ft', 'Laser, on site'], ['Back border', '1,180 sq ft', 'Aerial AI, verified'], ['Bed edge', '229 lin ft', 'Walked wheel']], { dense: true })}
    <div class="small" style="background:var(--surface-2);border-radius:8px;padding:8px 10px">${icon('mic', 's')} <b>Voice note ${sel.voice} min</b> ${h.tag('V1')} · "Client wants the patio off the kitchen door, about 16 by 20, fire pit later. Deer every night, so nothing they browse. Existing burning bush on the fence line should come out."</div>
    ${c.has('agents_mvp') ? (ai ? h.aiCard({ agent: 'Estimating from notes (A6)', level: 'L2', credits: 8, title: 'Draft estimate created: 9 lines mapped to your price book', body: '<div class="small">Paver patio kit 320 sq ft (herringbone, clay x1.20) · seat wall 18 lin ft · bed prep 1,574 sq ft · mulch 15 cu yd · 86 plants from the regional palette, deer-resistant filter on · burning bush removal.</div>', why: 'Quantities come from the measurements above; prices come only from the estimating engine. 2 lines flagged low confidence.', actions: h.btn('Open draft estimate', { sm: true, kind: 'ai', go: 'web.estimate', x: D.estimates[0].id }) }) : `<div class="flex">${h.btn('Draft estimate from notes (8 cr)', { kind: 'ai', icon: 'spark', ui: 'as-ai', val: '1' })}<span class="tiny t3">${creditLine(c, 8)}</span></div>`) : lockPill(c, 'agents_mvp', 'A6')}` , actions: own ? '' : h.pill('Read only') });
  return head + grid('minmax(0,0.85fr) minmax(0,1.4fr)', [tbl, detail]);
});

// ---------- Estimates and the estimate builder (03 §4.6, 21 §18.5, 17 A6) ----------
const limitFor = c => ({ owner: Infinity, office_manager: 25000, estimator: 15000, ops_manager: 15000 }[c.role] || 0);
const canEditEst = (c, m) => { const g = c.can('estimate'); if (/^RWD\/a|^RW\/a/.test(g)) return true; if (/W[^/]*\/o/.test(g)) return m.own; if (/RW\/b/.test(g)) return true; return false; };
RL.screen('web.estimates', (c, a) => {
  const D = c.D, models = D.estimates.map(e => estModel(c, e));
  const def = c.role === 'estimator' && models.some(m => m.own) ? 'mine' : 'all';
  const tab = U('es-tab', def);
  const f = { all: () => true, mine: m => m.own, Draft: m => m.e.status === 'Draft', 'In review': m => m.e.status === 'In review', Sent: m => m.e.status === 'Sent', Approved: m => m.e.status === 'Approved' }[tab] || (() => true);
  const rows = models.filter(f);
  const lim = a && a.state === 'limit' ? h.banner(`${icon('help')} ${esc(c.plan.name)}: estimating included with a limit (${esc(a.limit)}). Price book items used: 164 of 200.${c.role === 'owner' ? ' ' + h.link('Compare plans', 'web.settings.subscription') : ''}`, 'info') : '';
  const qq = U('es-qq', '') === '1';
  return h.page({ title: 'Estimates', sub: `${rows.length} shown · margin chips follow your field-class visibility`, actions: h.btn(qq ? 'Hide Quick Quote' : 'Quick Quote', { icon: 'bolt', ui: 'es-qq', val: qq ? '' : '1' }) + (c.allowed('estimate') && /W/.test(c.can('estimate')) ? (c.has('agents_mvp') ? h.btn('Draft from notes (8 cr)', { kind: 'ai', icon: 'spark', act: 'es-ai-go' }) : '') + h.btn('New estimate', { kind: 'primary', icon: 'plus', go: 'web.estimate' }) : '') })
    + lim + (qq ? grid('minmax(0,1fr) minmax(0,1fr)', [quickQuoteCard(c), h.card({ title: 'Quick Quote templates', sub: 'At most 5 visible inputs each', flush: true, body: h.list(QQT.slice(0, 5).map(t => ({ icon: 'bolt', title: esc(t[0]), sub: esc(t[1]), right: h.pill(esc(t[3])) }))) })]) : '')
    + h.tabs('es-tab', [['all', 'All', models.length], ['mine', 'Mine', models.filter(m => m.own).length], ['Draft', 'Draft'], ['In review', 'In review'], ['Sent', 'Sent'], ['Approved', 'Approved']], def)
    + h.card({ flush: true, body: h.table([
      { k: 'id', label: 'Estimate', m: true, fmt: (v, m) => esc(m.e.id) },
      { k: 'client', label: 'Client and title', fmt: (v, m) => `<div class="b small">${esc(m.e.client)}</div><div class="tiny t3">${esc(m.e.title)}</div>` },
      { k: 'by', label: 'By', fmt: (v, m) => `<span class="small">${esc(m.e.by)}</span>` },
      { k: 'date', label: 'Date', fmt: (v, m) => esc(m.e.date) },
      { k: 'status', label: 'Status', fmt: (v, m) => stPill(m.e.status) + (m.e.value > 15000 && m.e.status === 'In review' ? ' ' + h.pill('Needs approval', 'warn') : '') },
      { k: 'opts', label: 'Options', n: true, fmt: () => '3' },
      { k: 'price', label: 'Price', n: true, fmt: (v, m) => h.mask(c, 'price', money(m.e.value)) },
      { k: 'cost', label: 'Cost', n: true, fmt: (v, m) => fcOwn(c, 'cost', m.own, money(Math.round(m.T.better.direct))) },
      { k: 'gm', label: 'Margin', fmt: (v, m) => marginCell(c, m.gm, m.netAct, m.own) },
    ], rows, { go: 'web.estimate', x: m => m.e.id }) })
    + h.note('Margin chips: gross margin %, colored by net margin against the 10% net floor (03 EST-09). Designers see price only; operations managers see an indicator.');
});
RL.act('es-ai-go', (el, ev, c) => { RL.ui['es-ai'] = '1'; RL.go('web.estimate', c.D.estimates[0].id); return false; });
const QQT = [['Weekly mowing', 'Turf sq ft (intel), trim lin ft, gate, frequency', 'Mowing visit model', 'Mow / + 5-step / Full care'], ['Mulch top-dress', 'Bed sq ft (intel), depth, product, access, haul', 'MULCH-INSTALL kit', 'Hardwood / Dyed / + edge'], ['Spring cleanup', 'Bed sq ft, turf sq ft, tree count, debris level', 'Cleanup kit', 'Basic / Standard / Premium'], ['Core aeration and overseeding', 'Turf sq ft, seed, slope class', 'Aeration kit', 'Aerate / + overseed / + starter'], ['Irrigation start-up or winterization', 'Zone count, backflow type', 'Base + per zone', 'Single price'], ['Shrub and hedge trimming', 'Count by size class or hedge lin ft', 'Trimming kit', 'Single price']];
const rateTxt = l => l.rate ? (l.rate >= 1 ? `${l.rate} ${l.unit}/mh` : `${(1 / l.rate).toFixed(1)} mh/${l.unit}`) : (l.subc ? 'sub quote' : '-');
const KIT_PAVER = [['Excavation and disposal', '3 dump loads', 180, 13.0], ['Base gravel 3/4 in minus', '10 t', 280, 11.38], ['Bedding sand 1 in', '1.5 t', 48, 3.0], ['Geotextile fabric', '360 sq ft', 64.8, 0], ['Pavers 60 mm, herringbone +10%', '330 sq ft', 1402.5, 31.05], ['Edge restraint + spikes', '7 pcs + 50', 147, 7.0], ['Polymeric sand', '6 bags', 192, 4.5], ['Equipment: mini skid, compactor, saw', 'kit', 625, 0], ['Mobilization 3 days x 4 crew', 'kit', 0, 6.0]];
RL.screen('web.estimate', (c, a) => {
  const D = c.D, e0 = D.estimates.find(x => x.id === c.x) || D.estimates[0], m = estModel(c, e0), e = m.e;
  const opt = U('es-opt', 'better'), T = m.T[opt];
  const edit = canEditEst(c, m), own = m.own || c.role === 'owner';
  const sCost = seesOwn(c, 'cost', m.own), sMar = seesOwn(c, 'margin', m.own), sPrice = c.sees('price');
  const prop = D.proposals.find(p => p.estimate === e.id);
  const ds = D.designs.find(d => d.clientId === e.clientId);
  const linked = ds && /build|plant/.test(m.cat);
  const lim = limitFor(c), over = e.value > lim, belowFloor = m.netAct < 10;
  const ratio = T.price / T.be;
  const kitOpen = U('es-kit', '') === '1';
  const lines = T.lines.map((l, i) => ({ i: i + 1, l }));
  const tbl = h.table([
    { k: 'i', label: '#', n: true },
    { k: 'l', label: 'Item', fmt: (l) => `<div class="small b">${esc(l.name)}</div>${l.kit ? `<div class="tiny"><button type="button" class="btn sm ghost" style="padding:0 4px" data-ui="es-kit" data-val="${kitOpen ? '' : '1'}">${icon('layers', 's')} kit: ${esc(l.kit)}</button></div>` : ''}${linked && /takeoff|Mulch|Plants|edging|Paver|Bed prep/i.test(l.name) ? `<div class="tiny t3">${icon('link', 's')} linked to ${esc(ds.id)} takeoff</div>` : ''}` },
    { k: 'l', label: 'Qty', n: true, fmt: l => `${num(l.qty)} <span class="t3 tiny">${esc(l.unit)}</span>` },
    { k: 'l', label: 'Rate', fmt: l => `<span class="tiny">${rateTxt(l)}</span>` },
    { k: 'l', label: 'Lab h', n: true, fmt: l => h.mask(c, 'budget_hours', l.mh ? l.mh.toFixed(1) : '-') },
    { k: 'l', label: 'Cost', n: true, fmt: l => fcOwn(c, 'cost', m.own, money(Math.round(l.direct))) },
    { k: 'l', label: 'Price', n: true, fmt: l => h.mask(c, 'price', money(Math.round((l.direct + l.oh) * ratio))) },
  ], lines, { dense: true, foot: ['', `${T.lines.length} lines`, '', '', h.mask(c, 'budget_hours', T.mh.toFixed(1)), fcOwn(c, 'cost', m.own, money(Math.round(T.direct))), h.mask(c, 'price', money(T.price))] });
  const kit = kitOpen && T.lines.some(l => /Paver/.test(l.kit)) ? h.card({ title: 'Kit: Paver patio per sq ft v3', sub: 'Inputs: area 320 sq ft · perimeter 70 lin ft · against house 20 lin ft · base 6 in · herringbone · access gate x1.10', body: h.table([{ k: 0, label: 'Component' }, { k: 1, label: 'Purchased' }, { k: 2, label: 'Cost', n: true, fmt: v => fcOwn(c, 'cost', m.own, money(v, { cents: true })) }, { k: 3, label: 'Man-hours', n: true, fmt: v => v ? v.toFixed(2) : '-' }], KIT_PAVER, { dense: true }) + h.note('Formulas run in the sandboxed kit evaluator: base area = area + (perimeter - house edge) x 0.5; gravel t = base area x 0.5 / 27 x 1.15 x 1.4 (03 EST-10). Client sees one line.') }) : '';
  const S = (l, v, o) => `<div class="flex between nw small" style="${o && o.b ? 'font-weight:700;border-top:1px solid var(--border);padding-top:5px' : ''}"><span class="t2">${l}</span><span class="num">${v}</span></div>`;
  const cv = v => fcOwn(c, 'cost', m.own, money(Math.round(v)));
  const summary = h.card({ title: `Summary (${opt[0].toUpperCase() + opt.slice(1)})`, sub: 'Priced from break-even at the target net margin', body: `${S(`Labor ${T.mh.toFixed(1)} h at $${BURDEN}`, cv(T.lab))}${S('Materials (+5% waste)', cv(T.matc))}${S('Equipment', cv(T.eqc))}${S('Subcontractors', cv(T.subc))}${S('Direct cost', cv(T.direct), { b: 1 })}${S(`Overhead recovery (FLH $${FLH}/h)`, cv(T.oh))}${S('Break-even', cv(T.be), { b: 1 })}${S('Price', h.mask(c, 'price', `<b style="font-size:1.05rem">${money(T.price)}</b>`), { b: 1 })}
    ${sMar ? `${S('Gross margin', pct1(T.gm))}${S('Net margin', `<span style="color:${T.net < 10 ? 'var(--warn-text)' : 'var(--ok-text)'}">${pct1(T.net)}</span>`)}${S('Markup on direct cost', pct1(T.markup))}${c.role === 'owner' ? S('Target / floor', '12% net / 10% net') : S('Margin floor', '10% net')}` : `<div class="flex between small"><span class="t2">Margin</span>${marginCell(c, T.gm, T.net, m.own)}</div>`}
    ${S('Deposit 30%', h.mask(c, 'price', money(Math.round(T.price * .3))))}${S('Warranty', opt === 'good' ? '90 days' : opt === 'better' ? '1 year plants' : '2 years with maintenance')}
    ${h.note('Margin is a share of price; markup is a share of cost. Rootline never labels a markup as a margin (03 EST-09).')}` });
  const ohCmp = sCost ? h.card({ title: 'Overhead under each method', sub: 'Generated live from this estimate\'s cost mix', body: h.table([{ k: 0, label: 'Method' }, { k: 1, label: 'Overhead', n: true }, { k: 2, label: `Price at ${m.net}% net`, n: true }], [['FLH ($21.00/h)', T.oh], ['SORS (29.72%)', T.direct * .2972], ['MORS (labor 56.5%)', T.lab * .565 + T.matc * .1 + T.eqc * .25 + T.subc * .05], ['Revenue % (20.16%)', T.direct * .2972]].map(([n, oh]) => [n, money(Math.round(oh)), money(Math.round((T.direct + oh) / (1 - m.net / 100)))]), { dense: true }) }) : '';
  const aiOn = U('es-ai', '') === '1';
  const aiCard = !c.has('agents_mvp') ? `<div class="flex">${lockPill(c, 'agents_mvp', 'AI estimate from notes')}</div>` : aiOn ? h.aiCard({ agent: 'Estimating from notes (A6)', level: 'L2', credits: 8, title: '4 lines drafted from the site visit notes and photos', body: h.table([{ k: 0, label: 'Line' }, { k: 1, label: 'Qty', n: true }, { k: 2, label: 'Why' }, { k: 3, label: 'Confidence', fmt: v => h.pill(v, v === 'high' ? 'ok' : 'warn') }], [['Burning bush removal and stump grind', '1 ea', 'Voice note: "should come out"; listed invasive in Ohio', 'high'], ['Mulch, double-shred, 3 in', '15 cu yd', 'Beds 1,574 sq ft x 3 in / 324, from the design takeoff', 'high'], ['Clay amendment, 2 in compost', '9.7 cu yd', 'Checklist: heavy clay x1.20', 'medium'], ['Downspout extension to rain garden', '1 ea', 'Photo 4 shows downspout into bed; not in scope notes', 'low']], { dense: true }), why: 'The model never invents a price. Mapping to your price book by similarity; prices come from the engine. Accept or edit each line.', actions: h.btn('Accept 3 high and medium', { sm: true, kind: 'ai', act: 'es-acc' }) + h.btn('Discard', { sm: true, ui: 'es-ai', val: '' }) }) : `<div class="aic"><div class="ah">${icon('spark')}<span>Estimating from notes (A6)</span><span class="lv">L2</span><span class="cr">8 cr</span></div><div class="small">Paste site notes, a voice memo transcript or photos; Iris maps them to your price book and kits.</div><div class="flex">${edit ? h.btn('Draft lines (8 cr)', { sm: true, kind: 'ai', ui: 'es-ai', val: '1' }) : ''}<span class="tiny t2">${creditLine(c, 8)}</span></div></div>`;
  const copilot = sCost || c.role === 'ops_manager' ? h.aiCard({ agent: 'Copilot', level: 'L1', credits: 1, title: `Similar ${m.cat === 'build' ? 'patio and planting' : 'jobs'} averaged ${Math.round(T.mh * 1.12)} labor hours`, body: 'Plant install hours here may be low (3.2 plants per man-hour vs 2.8 on your last 5 similar jobs).', why: 'Advisory only. Sources: 5 completed jobs with job-cost actuals.', actions: edit ? h.btn('Show 5 similar jobs', { sm: true, act: 'es-act', val: 'Similar jobs panel' }) + h.btn('Apply +12% to planting', { sm: true, kind: 'ai', act: 'es-act', val: 'Planting hours +12% applied' }) : '' }) : '';
  const approval = c.role === 'owner' ? (e.status === 'In review' || e.status === 'Draft' ? h.btn('Approve', { kind: 'primary', act: 'es-act', val: `${e.id} approved` }) : '') : over || belowFloor ? h.btn(`Request approval${over ? ' (over ' + money(lim) + ')' : ''}`, { kind: 'primary', act: 'es-act', val: `Approval requested from ${c.owner}` }) : '';
  const head = h.page({ crumbs: [['Sales', 'web.pipeline'], ['Estimates', 'web.estimates'], [esc(e.id)]], title: `${esc(e.id)} ${esc(e.client)}: ${esc(e.title)}`, sub: `Client: ${esc(e.client)} · by ${esc(e.by)} · ${esc(e.date)}${linked ? ` · Source: ${h.link(esc(ds.id) + ' v3', 'web.studio', ds.id)} (takeoff linked)` : ''}`, tags: `${stPill(e.status)}${!edit ? h.pill('View only', '') : ''}${over && c.role !== 'owner' && lim ? h.pill(`Over your ${money(lim)} limit`, 'warn') : ''}${belowFloor && (sMar || c.role === 'ops_manager') ? h.pill('Below net floor', 'warn') : ''}${a && a.state === 'limit' ? h.pill('Limit: ' + esc(a.limit), 'info') : ''}`, actions: (prop && c.allowed('proposal.send') ? h.btn('Preview proposal', { icon: 'eye', go: 'web.proposal', x: prop.id }) : '') + approval });
  const banner = linked ? h.banner(`${icon('refresh')} Takeoff changed in ${esc(ds.id)}: Bed B +45 sq ft (+0.42 cu yd mulch); 2 roses replaced by 2 fragrant sumac. ${edit ? '<button type="button" class="btn sm" data-act="es-act" data-val="Takeoff diff accepted">Accept all</button> <button type="button" class="btn sm ghost" data-act="es-act" data-val="Diff review opened">Review</button>' : ''}`, 'info') : '';
  const optTabs = h.tabs('es-opt', [['good', `Good ${sPrice ? '· ' + kmoney(m.T.good.price) : ''}`], ['better', `Better (recommended) ${sPrice ? '· ' + kmoney(m.T.better.price) : ''}`], ['best', `Best ${sPrice ? '· ' + kmoney(m.T.best.price) : ''}`]], 'better');
  const roleNote = c.role === 'designer' ? h.note('Designer view: prices, no cost or margin (cost and margin field classes are hidden by default, 02 §10.2).') : c.role === 'ops_manager' ? h.note('Operations: costs visible, margin shown as an indicator only.') : c.role === 'estimator' && !m.own ? h.note(`Not your estimate: read only, and cost and margin are visible on your own estimates only (estimate RWD/o + R/b).`) : c.role === 'office_manager' ? h.note('Office manager: cost visible, margin hidden by Company setting.') : '';
  return head + banner + roleNote + grid('minmax(0,1fr) 270px', [`<div class="stack12">${optTabs}${h.card({ flush: true, body: tbl })}${edit ? `<div class="flex"><span class="inp" style="max-width:380px;color:var(--text-3)">${icon('search', 's')} Add item: type to search the price book, or /kit</span>${h.btn('Add kit', { sm: true, icon: 'layers', act: 'es-act', val: 'Kit picker' })}${h.btn('Difficulty x1.32', { sm: true, act: 'es-act', val: 'Access gate x1.10, clay x1.20 (combined 1.32)' })}</div>` : ''}${kit}${aiCard}${copilot}</div>`, `<div class="stack12">${summary}${ohCmp}</div>`]);
});
RL.act('es-acc', () => { RL.ui['es-ai'] = ''; RL.toast('3 AI lines accepted into Better; 1 low-confidence line left for you to verify.'); });
RL.act('es-act', (el) => { RL.toast(esc(el.dataset.val) + ' (mock)'); return false; });

// ---------- Proposals (03 §4.7, 21 §18.6) ----------
const TIER_NAMES = { build: ['Refresh', 'Outdoor room', 'Showcase'], plant: ['Refresh', 'Four-season', 'Showcase'], maint: ['Mow only', 'Mow + programs', 'Full care'], enh: ['Basic', 'Standard', 'Premium'], irr: ['Service', 'Service + test', 'Smart upgrade'], snow: ['Push only', 'Push + salt', 'Full winter'], light: ['Path', 'Path + trees', 'Designed night'], lawn: ['5-step', '5-step + grub', 'Full lawn care'], fee: ['Concept', 'Concept + plan', 'Full design'] };
const sigOf = p => p.status === 'Signed' ? h.pill('Signed', 'ok') : p.status === 'Declined' ? h.pill('Declined', 'danger') : p.status === 'Draft' ? '<span class="t3 small">Not sent</span>' : h.pill('Awaiting', 'warn');
RL.screen('web.proposals', (c) => {
  const D = c.D, ps = D.proposals;
  const out = ps.filter(p => ['Sent', 'Viewed'].includes(p.status));
  const sent = c.role === 'estimator' ? ps.filter(p => { const e = D.estimates.find(x => x.id === p.estimate); return e && e.by === c.who; }) : ps;
  return h.page({ title: 'Proposals', sub: 'View tracking, e-signature and deposits on your own Stripe account', actions: c.allowed('proposal.send') ? h.btn('New proposal', { kind: 'primary', icon: 'plus', go: 'web.proposal' }) : '' })
    + h.kpis([{ label: 'Out with clients', value: out.length, delta: h.mask(c, 'price', kmoney(sum(out, p => p.value))) }, { label: 'Viewed 3+ times, unsigned', value: out.filter(p => /3 views/.test(p.viewed)).length, tone: 'warn', delta: 'Nudge drafted' }, { label: 'Signed this month', value: ps.filter(p => p.status === 'Signed').length, tone: 'ok', delta: h.mask(c, 'price', kmoney(sum(ps.filter(p => p.status === 'Signed'), p => p.value))) }, { label: 'Deposits collected', value: h.mask(c, 'price', kmoney(sum(ps.filter(p => p.status === 'Signed'), p => p.deposit))), delta: 'Held as customer deposits', tone: 'info' }])
    + h.card({ flush: true, body: h.table([
      { k: 'id', label: 'Proposal', m: true },
      { k: 'client', label: 'Client and title', fmt: (v, p) => `<div class="b small">${esc(v)}</div><div class="tiny t3">${esc(p.title)}</div>` },
      { k: 'options', label: 'Options', fmt: v => v === 3 ? 'Good / better / best' : v === 2 ? '2 options' : 'Single' },
      { k: 'value', label: 'Value', n: true, fmt: v => h.mask(c, 'price', money(v)) },
      { k: 'status', label: 'Status', fmt: s => stPill(s) },
      { k: 'viewed', label: 'Views', fmt: (v, p) => p.status === 'Draft' ? '<span class="t3 small">-</span>' : `<span class="small">${icon('eye', 's')} ${esc(v)}</span>` },
      { k: 'sig', label: 'E-sign', fmt: (v, p) => sigOf(p) },
      { k: 'deposit', label: 'Deposit 30%', n: true, fmt: (v, p) => `${h.mask(c, 'price', money(v))}<div class="tiny t3">${p.status === 'Signed' ? 'Paid by ACH' : p.status === 'Declined' ? '-' : 'Due at signing'}</div>` },
    ], sent, { go: 'web.proposal' }) });
});
RL.screen('web.proposal', (c) => {
  const D = c.D, p = D.proposals.find(x => x.id === c.x) || D.proposals[0];
  const e0 = D.estimates.find(x => x.id === p.estimate) || D.estimates[0], m = estModel(c, e0);
  const names = TIER_NAMES[m.cat] || TIER_NAMES.build;
  const tiers = [['good', names[0], m.T.good], ['better', names[1], m.T.better], ['best', names[2], m.T.best]];
  const view = U('pp-view', 'edit'), pick = U('pp-tier', 'better'), chosen = m.T[pick];
  const lim = limitFor(c), needs = p.value > lim || m.netAct < 10;
  const canApprove = c.allowed('proposal.approve_internal') && (c.role === 'owner' || p.value <= lim);
  const approved = RL.ui['pp-ok-' + p.id] === '1';
  const dep = Math.round(chosen.price * .3);
  const coName = c.t.name;
  const plantsList = [['Little Lime Hydrangea', 5], ['Little Bluestem', 24], ['Serviceberry', 3], ["Walker's Low Catmint", 9], ['Prairie Dropseed', 15], ['Fragrant Sumac', 9]].map(([n, q]) => ({ p: PL(n), q }));
  const head = h.page({ crumbs: [['Sales', 'web.pipeline'], ['Proposals', 'web.proposals'], [esc(p.id)]], title: `${esc(p.id)} ${esc(p.title)}`, sub: `${esc(p.client)} · from ${h.link(esc(m.e.id), 'web.estimate', m.e.id)} · valid until ${c.winter ? 'Feb 12, 2027' : 'Jun 10, 2027'} · ${esc(p.viewed)}`, tags: `${stPill(p.status)}${needs && !approved && c.role !== 'owner' ? h.pill('Needs internal approval', 'warn') : approved ? h.pill('Approved internally', 'ok') : ''}`, actions: seg('pp-view', [['edit', 'Edit'], ['client', 'Client preview']], 'edit') + (p.status === 'Draft' || p.status === 'Viewed' || p.status === 'Sent' ? (needs && !approved ? (canApprove ? h.btn('Approve and send', { kind: 'primary', act: 'pp-ok', val: p.id }) : h.btn(`Request approval from ${esc(first(c.owner))}`, { kind: 'primary', act: 'pp-req' })) : h.btn(p.status === 'Draft' ? 'Send proposal' : 'Resend', { kind: 'primary', icon: 'send', act: 'pp-send' })) : '') });
  const approvalNote = needs && !approved ? h.banner(`${icon('approve')} ${p.value > lim && lim ? `${money(p.value)} is over the ${money(lim)} limit for ${esc(c.roleObj.name.toLowerCase())}` : m.netAct < 10 ? `Net margin is below the 10% floor` : 'Needs internal approval'}. ${canApprove ? 'You can approve it (proposal.approve_internal ' + esc(c.can('proposal.approve_internal')) + ').' : `It goes to "Pending internal approval" for ${esc(c.owner)} (02 §5.6).`}`, 'warn') : '';
  const tierCard = ([k, n, T], client) => `<div class="cd${k === pick ? ' ok' : ''}" style="${k === pick ? 'border-width:2px' : ''}"><div class="cd-b">${h.photo(k === 'good' ? 'after' : k === 'best' ? 'night' : 'mockup', { badge: 'AI artist rendering', label: n + ' concept' })}<div class="flex between nw"><b>${esc(n)}</b>${k === 'better' ? h.pill('Recommended', 'accent') : ''}</div><div style="font-size:1.25rem;font-weight:750" class="num">${h.mask(c, 'price', money(T.price))}</div><div class="tiny t2">${T.lines.length} scope lines · ${k === 'good' ? '90-day warranty' : k === 'better' ? '1-year plant warranty' : '2-year warranty, lighting'}</div>${client ? h.btn(k === pick ? 'Selected' : 'Select', { sm: true, kind: k === pick ? 'primary' : '', ui: 'pp-tier', val: k }) : `<div class="flex">${h.btn(k === pick ? 'Default' : 'Make default', { sm: true, ui: 'pp-tier', val: k })}${h.btn('Swap mockup', { sm: true, kind: 'ai', go: 'web.mockups' })}</div>`}</div></div>`;
  const cmp = h.table([{ k: 0, label: 'Included' }, { k: 1, label: names[0] }, { k: 2, label: names[1] }, { k: 3, label: names[2] }], m.lines.map(l => [esc(l.name), l.tier === 'g' ? icon('check') : '-', l.tier !== 'x' ? icon('check') : '-', icon('check')]).slice(0, 8), { dense: true });
  const terms = h.kv([['Deposit', `30% (${h.mask(c, 'price', money(dep))}) required to sign · card or ACH`], ['Schedule', '30% deposit, 40% at hardscape complete, 30% at final walkthrough'], ['Warranty', '1-year plant warranty with watering conditions'], ['Changes', 'Change orders in writing, priced by the same engine'], ['Jurisdiction pack', `${esc(c.t.city.split(', ')[1] || 'OH')} home-improvement terms ${h.tag('V1')}`]]);
  if (view === 'client') {
    return head + `<div class="cd" style="max-width:820px;margin:0 auto;overflow:hidden"><div class="flex between" style="padding:10px 14px;border-bottom:1px solid var(--border)"><span class="flex"><span class="logo" style="width:28px;height:28px;border-radius:7px;display:grid;place-items:center;color:#fff;font-weight:800;font-size:.72rem;background:${esc(c.t.brand.color)}">${esc(c.t.brand.logo)}</span><b>${esc(coName)}</b></span><span class="small t2">Questions? ${h.btn('Message', { sm: true, act: 'pp-noop' })}</span></div>
      <div style="padding:14px" class="stack12">${h.photo('mockup', { badge: 'AI artist rendering', label: 'Hero concept' })}<div><h2 style="font-family:var(--font-display);font-size:1.3rem">${esc(p.title)} for ${esc(p.client)}</h2><div class="small t2">Prepared by ${esc(m.e.by)} · valid until ${c.winter ? 'Feb 12, 2027' : 'Jun 10, 2027'}</div></div>
      <b>Choose your option</b>${grid('repeat(3,minmax(0,1fr))', tiers.map(t => tierCard(t, true)), 10)}
      ${grid('minmax(0,1.2fr) minmax(0,1fr)', [`<div>${studioSvg(c, { mini: true, label: 'Your design, to scale' })}</div>`, `<div class="small"><b>Plants in this design</b>${plantsList.map(x => `<div class="flex between nw"><span>${x.q} ${esc(x.p.common)}</span>${NATIVE.test(x.p.common) ? h.pill('native', 'ok') : ''}</div>`).join('')}</div>`])}
      ${h.note('This image is an AI-assisted artist rendering based on your photo and our design. Plants are shown at about 3 years of growth. The written plan and plant list are what we will install.')}
      <div class="flex between" style="background:var(--surface-2);border-radius:10px;padding:10px 12px"><div><div class="small">Total <b class="num">${h.mask(c, 'price', money(chosen.price))}</b></div><div class="small">Deposit due today (30%): <b class="num">${h.mask(c, 'price', money(dep))}</b></div></div><span class="flex">${h.btn('Approve and sign', { kind: 'primary', disabled: true, title: 'Preview only' })}${h.btn('Ask a question', { disabled: true })}${h.btn('Download PDF', { disabled: true })}</span></div>
      <div class="tiny t3">Payments are processed securely by Stripe for ${esc(coName)}. Signing records your name, time and device (ESIGN / UETA).</div></div></div>`;
  }
  const blocks = [['Cover', 'Hero mockup, title, valid until'], ['Personal letter', 'AI draft available'], ['About us', 'License, insurance, 4 reviews'], ['Current conditions', '6 annotated photos'], ['Options', 'Good / better / best'], ['Design plan', 'Static image (interactive V1)'], ['Mockups', '3 concepts, labeled'], ['Scope and plant list', '86 plants'], ['Terms and warranty', 'Ohio pack'], ['Deposit and schedule', '30% to sign'], ['Signature', 'E-sign, all signers']];
  return head + approvalNote + grid('190px minmax(0,1fr) 250px', [
    h.card({ title: 'Blocks', sub: 'Drag to reorder', flush: true, body: `<div class="li">${blocks.map(([b, s], i) => `<div class="li-i" style="grid-template-columns:16px minmax(0,1fr);padding:6px 10px"><span class="t3">${icon('menu', 's')}</span><div><div class="tt small">${esc(b)}${b === 'Design plan' ? ' ' + h.tag('V1') : ''}</div><div class="ss">${esc(s)}</div></div></div>`).join('')}</div>` }),
    `<div class="stack12">${h.card({ title: 'Options', sub: 'Tier prices come from the estimate option sections, never typed', body: grid('repeat(3,minmax(0,1fr))', tiers.map(t => tierCard(t, false)), 8) + cmp })}
     ${h.card({ title: 'Personal letter', body: `<div class="small" style="line-height:1.5">Hi ${esc(first(p.client))}, thank you for walking the yard with us. The Outdoor room option gives you the 16 x 20 ft patio off the kitchen door, a seat wall around the fire pit and a deer-resistant border of native shrubs and grasses chosen for ${esc(c.t.region)}.</div>${c.has('agents_mvp') || c.has('copilot') ? `<div class="flex">${h.btn('Redraft with Copilot (1 cr)', { sm: true, kind: 'ai', act: 'pp-noop' })}</div>` : ''}` })}
     ${h.card({ title: 'Terms, deposit and payment', body: terms + h.note(`Deposits are direct charges on ${esc(coName)}'s own connected Stripe account, held as a customer deposit liability until applied (03 PROP-07, 08).`) })}</div>`,
    `<div class="stack12">${h.card({ title: 'Settings', body: h.kv([['Template', 'Design-build residential'], ['Pricing display', 'Totals per option'], ['Default option', esc(names[['good', 'better', 'best'].indexOf(pick)])], ['Deposit', '30%, required to sign'], ['Methods', 'Card, ACH (default over $5,000)'], ['Signers', p.client.includes(' and ') ? 'Both owners' : 'Primary contact']]) })}
     ${h.card({ title: 'Analytics', body: p.status === 'Draft' ? h.empty('Not sent yet.') : h.timeline([{ when: '2 h ago', text: `Viewed on iPhone · 4 min on Options`, tone: 'ok' }, { when: 'Yesterday 8:41 pm', text: 'Viewed · zoomed the plan', tone: 'ok' }, { when: 'May 8', text: 'Sent by email and SMS', tone: 'info' }]) })}
     ${h.card({ title: 'Approval', body: `${row('Your limit', lim === Infinity ? 'Unlimited' : lim ? money(lim) : 'None')}${row('This proposal', h.mask(c, 'price', money(p.value)))}${row('Net margin', seesOwn(c, 'margin', m.own) ? pct1(m.netAct) : marginCell(c, m.gm, m.netAct, m.own))}${approved ? h.pill('Approved by you', 'ok') : needs ? h.pill(canApprove ? 'You can approve' : 'Routes to ' + esc(c.owner), 'warn') : h.pill('Within limits', 'ok')}` })}</div>`]);
});
RL.act('pp-ok', (el) => { RL.ui['pp-ok-' + el.dataset.val] = '1'; RL.toast('Approved internally and sent to the client (mock).'); });
RL.act('pp-req', (el, ev, c) => { RL.toast(`Approval request sent to ${esc(c.owner)}: one-tap approve from the Daily Owner Briefing.`); return false; });
RL.act('pp-send', () => { RL.toast('Proposal sent by email and SMS (mock). View tracking is on.'); return false; });
RL.act('pp-noop', () => { RL.toast('Mock action'); return false; });

// ---------- Renewals (03 §4.10 REN-03) ----------
RL.screen('web.renewals', (c) => {
  const D = c.D, W = c.winter;
  const rows = D.agreements.map((a, i) => {
    const s = hsh(a.id), actNet = [3.8, 14.2, 9.1, -2.4, 17.5, 11.0, 6.2, 15.8][i % 8], hrs = [121.6, 98, 104, 131, 92, 101, 112, 96][i % 8];
    const fixed = /5%/.test(a.escalator) ? 5 : 4, cpi = 3, mt = Math.min(12, Math.max(0, 100 * ((1 - actNet / 100) / 0.85 - 1)));
    const rec = actNet < 0 ? 'Re-scope or let go' : mt > 8 ? `Renew at +${mt.toFixed(1)}% (margin target)` : actNet > 14 ? `Renew at +${cpi}% (CPI)` : `Renew at +${fixed}% (fixed)`;
    const pctUp = actNet < 0 ? 12 : mt > 8 ? mt : actNet > 14 ? cpi : fixed;
    return { a, actNet, hrs, fixed, cpi, mt, rec, pctUp, days: 12 + s % 40, comp: s % 4 === 0 ? 2 : s % 5 === 0 ? 1 : 0, health: actNet < 0 ? 41 : actNet < 8 ? 68 : 86 };
  });
  const canAgents = c.has('agents_v1');
  const sel = rows.filter(r => U('rn-' + r.a.id, '') === true || U('rn-' + r.a.id, '') === '1');
  return h.page({ title: 'Renewals', sub: `${rows.length} agreements renewing · priced on last season's actual job cost`, tags: h.tag('V1') + (W ? h.pill('Renewal season: notices go out 30-60 days before term end', 'accent') : ''), actions: `${h.btn(`Apply recommended (${sel.length || 'all'})`, { kind: 'primary', act: 'rn-apply' })}${h.btn('Send renewal proposals', { act: 'rn-send' })}` })
    + h.kpis([{ label: 'Up for renewal', value: rows.length, delta: kmoney(sum(rows, r => r.a.value)) }, { label: 'Proposed value', value: h.mask(c, 'price', kmoney(sum(rows, r => r.a.value * (1 + r.pctUp / 100)))), tone: 'ok', delta: `+${pct1(100 * (sum(rows, r => r.a.value * (1 + r.pctUp / 100)) / sum(rows, r => r.a.value) - 1))} blended` }, { label: 'Over 8%: owner approval', value: rows.filter(r => r.pctUp > 8).length, tone: 'warn' }, { label: 'Below break-even last season', value: rows.filter(r => r.actNet < 0).length, tone: 'danger' }])
    + (canAgents ? h.aiCard({ agent: 'Renewal agent (A13)', level: 'L2', credits: 2, title: `${rows.filter(r => r.pctUp > 8).length} renewals need a bigger increase or a scope cut`, body: `${esc(rows.find(r => r.actNet < 0) ? rows.find(r => r.actNet < 0).a.client : rows[0].a.client)} ran ${Math.round((rows.find(r => r.actNet < 0) || rows[0]).hrs - 100)}% over budgeted hours; restoring the 15% net target needs about +13%. Upsell suggestions added: aeration last done 3 years ago on 4 properties.`, why: 'Drafts only. Contract language is checked for an escalator clause; without one the renewal becomes a new proposal needing signature.' }) : `<div class="flex">${lockPill(c, 'agents_v1', 'Renewal agent A13')}</div>`)
    + h.card({ flush: true, body: h.table([
      { k: 'sel', label: '', fmt: (v, r) => `<input type="checkbox" aria-label="Select ${esc(r.a.client)}" data-ui-input="rn-${esc(r.a.id)}"${U('rn-' + r.a.id, '') === '1' || U('rn-' + r.a.id, '') === true ? ' checked' : ''} value="1">` },
      { k: 'a', label: 'Agreement', fmt: (a) => `<div class="b small">${esc(a.client)}</div><div class="tiny t3">${esc(a.id)} · ${esc(a.name)} · renews ${esc(a.renews)}</div>` },
      { k: 'a', label: 'Current', n: true, fmt: a => h.mask(c, 'price', money(a.value)) },
      { k: 'fixed', label: 'Fixed', n: true, fmt: v => '+' + v + '%' },
      { k: 'cpi', label: 'CPI', n: true, fmt: () => '+3% <span class="tiny t3">(2.9%, floor 3)</span>' },
      { k: 'mt', label: 'Margin target', n: true, fmt: v => v < 0.5 ? 'Hold' : '+' + v.toFixed(1) + '%' },
      { k: 'hrs', label: 'Hours vs budget', n: true, fmt: v => `<span style="color:${v > 110 ? 'var(--danger-text)' : 'inherit'}">${Math.round(v)}%</span>` },
      { k: 'actNet', label: 'Actual net', n: true, fmt: v => h.mask(c, 'margin', `<span style="color:${v < 0 ? 'var(--danger-text)' : v < 10 ? 'var(--warn-text)' : 'var(--ok-text)'}">${pct1(v)}</span>`) },
      { k: 'days', label: 'AR days', n: true },
      { k: 'health', label: 'Health', n: true, fmt: v => h.pill(String(v), v < 50 ? 'danger' : v < 75 ? 'warn' : 'ok') },
      { k: 'rec', label: 'Recommended', fmt: (v, r) => `<span class="small">${esc(v)}</span>${r.pctUp > 8 ? `<div>${c.role === 'owner' ? doneOr('rn-ok' + r.a.id, actBtn('Approve', 'rn-ok' + r.a.id, '', 'Increase approved'), 'Approved') : h.pill('Owner approval', 'warn')}</div>` : ''}` },
    ], rows, { dense: true }) })
    + h.note('Escalators never lower a price unless you choose it; increases over 8% need owner approval; auto-renewal notices follow the jurisdiction rule table (03 REN-02, REN-04).');
});
RL.act('rn-apply', () => { RL.toast('Recommended escalators applied to the selected agreements (mock). Over-8% rows wait for the owner.'); return false; });
RL.act('rn-send', () => { RL.toast('Renewal proposals queued: commercial by signature, residential by notice with opt-out.'); return false; });

// ---------- Change orders (03 §4.9) ----------
function coList(c) {
  const D = c.D, j = D.jobs;
  const lead = D.crews[0] ? D.crews[0].lead : c.owner;
  return [
    { id: 'CO-001', job: j[0].id, client: j[0].client, title: 'Hit buried concrete footing at 4 in, about 20 sq ft', type: 'Unforeseen condition', origin: `Field: ${lead}`, delta: 1240, state: 'Pending client', sig: 'Verbal OK 9:12 am, sign within 48 h', verbal: true },
    { id: 'CO-002', job: j[0].id, client: j[0].client, title: 'Enlarge patio from 16 x 20 to 18 x 20 ft', type: 'Add', origin: 'Client request (portal)', delta: 1010, state: 'Approved', sig: 'E-signed May 9' },
    { id: 'CO-003', job: j[1].id, client: j[1].client, title: 'Drop second serviceberry', type: 'Deduct', origin: `Designer revision`, delta: -485, state: 'Applied', sig: 'E-signed May 6' },
    { id: 'CO-004', job: j[2].id, client: j[2].client, title: 'Drainage fix behind wall, T&M not-to-exceed', type: 'T&M NTE', origin: 'Office', delta: 2800, state: 'Draft', sig: '-' },
    { id: 'CO-005', job: j[3].id, client: j[3].client, title: 'Add 6 path lights', type: 'Add', origin: 'Value engineering', delta: 2520, state: 'Rejected', sig: 'Declined May 2' },
  ];
}
RL.screen('web.change_orders', (c) => {
  const D = c.D, list = coList(c), sel = list.find(x => x.id === U('co-sel', '')) || list[0];
  const job = D.jobs.find(j => j.id === sel.job) || D.jobs[0];
  const appr = sum(list.filter(x => x.job === job.id && /Approved|Applied/.test(x.state)), x => x.delta), pend = sum(list.filter(x => x.job === job.id && /Pending|Draft/.test(x.state)), x => x.delta);
  const crew = c.role === 'crew_lead';
  return h.page({ title: 'Change orders', sub: 'Office and field change orders with signature and price delta', tags: h.tag('V1'), actions: /W/.test(c.can('change_order')) ? h.btn(crew ? 'Draft change order (no price)' : 'New change order', { kind: 'primary', icon: 'plus', act: 'co-act', val: 'Change order draft created' }) : '' })
    + grid('minmax(0,1.3fr) minmax(0,1fr)', [h.card({ flush: true, body: `<div class="li">${list.map(x => `<div class="li-i go" role="button" tabindex="0" data-ui="co-sel" data-val="${x.id}" style="${x.id === sel.id ? 'background:var(--primary-soft)' : ''}"><span class="ico ${x.type === 'Unforeseen condition' ? 'warn' : x.delta < 0 ? 'info' : ''}">${icon('clipboard')}</span><div style="min-width:0"><div class="tt">${esc(x.id)} · ${esc(x.job)} ${esc(x.client)}</div><div class="ss">${esc(x.title)} · ${esc(x.type)}</div></div><div class="flex nw gap4"><span class="num small b">${h.mask(c, 'price', (x.delta >= 0 ? '+' : '') + money(x.delta))}</span>${stPill(x.state)}</div></div>`).join('')}</div>` }),
      `<div class="stack12">${h.card({ title: `${esc(sel.id)} ${esc(sel.title)}`, sub: `${esc(sel.type)} · ${esc(sel.origin)}`, body: `${sel.type === 'Unforeseen condition' ? grid('1fr 1fr', [h.photo('before', { badge: 'Field photo 9:04 am' }), h.photo('patio', { badge: 'Marked area' })], 8) : ''}${h.kv([['Job', h.link(esc(job.id), 'web.job', job.id) + ' ' + esc(job.title)], ['Pricing', sel.type === 'T&M NTE' ? 'Labor and equipment at billing rates, cap ' + h.mask(c, 'price', money(sel.delta)) : 'Same engine: excavation in rock x1.35 + disposal'], ['Price delta', h.mask(c, 'price', (sel.delta >= 0 ? '+' : '') + money(sel.delta))], ['Schedule', sel.delta > 1000 ? '+1 day, scheduler notified' : 'No change'], ['Signature', esc(sel.sig)]])}${sel.verbal ? (c.has('change_orders_full') ? h.banner(`${icon('clock')} Verbal emergency approval recorded by ${esc(sel.origin.replace('Field: ', ''))}. Must be e-signed within 48 h or it escalates to operations.`, 'warn') : `<div class="flex">${lockPill(c, 'change_orders_full', 'Verbal emergency COs')}</div>`) : ''}`, actions: /X/.test(c.can('change_order')) && /Pending|Draft/.test(sel.state) ? h.btn('Send for signature', { sm: true, kind: 'primary', act: 'co-act', val: 'Sent to client portal for e-signature' }) : '' })}
      ${h.card({ title: `Change-order log: ${esc(job.id)}`, body: `${row('Original contract', h.mask(c, 'price', money(job.value)))}${row('Approved change orders', h.mask(c, 'price', (appr >= 0 ? '+' : '') + money(appr)))}${row('Pending change orders', h.mask(c, 'price', (pend >= 0 ? '+' : '') + money(pend)))}${row('<b>Revised contract value</b>', h.mask(c, 'price', '<b>' + money(job.value + appr) + '</b>'))}${h.note('Approved changes update the job budget, the schedule and the next progress invoice.')}` })}</div>`]);
});
RL.act('co-act', (el) => { RL.toast(esc(el.dataset.val) + ' (mock)'); return false; });

// ---------- Templates and kits (03 EST-10, EST-11, EST-14, PROP-01) ----------
RL.screen('web.sales_templates', (c, a) => {
  const tab = U('tp-tab', 'kits'), canW = /W/.test(c.can('price_book'));
  const kits = [['Paver patio per sq ft', 'v3', 8, 17, 23], ['Mulch install', 'v4', 4, 3, 61], ['Seat wall per lin ft', 'v2', 5, 9, 7], ['Cleanup kit', 'v2', 4, 6, 44], ['Irrigation per zone', 'v2', 3, 5, 18], ['Lighting per fixture', 'v1', 4, 6, 9], ['Steel edging', 'v1', 2, 3, 31]];
  const head = h.page({ title: 'Templates and kits', sub: 'Kits explode into estimate lines; clients see one line', actions: canW ? h.btn('New kit', { kind: 'primary', icon: 'plus', act: 'co-act', val: 'Kit builder' }) : h.pill('Read only (price_book ' + esc(c.can('price_book')) + ')') });
  const lim = a && a.state === 'limit' ? `<div class="cd"><div class="cd-b">${h.meter('Price book items (Starter: 1 price book, 200 items)', 164, 200)}</div></div>` : '';
  const tabs = h.tabs('tp-tab', [['kits', 'Kits', kits.length], ['qq', 'Quick Quote templates', QQT.length], ['est', 'Estimate templates', 5], ['prop', 'Proposal templates', 4]], 'kits');
  let body = '';
  if (tab === 'kits') body = grid('minmax(0,1fr) minmax(0,1.25fr)', [h.card({ flush: true, body: h.table([{ k: 0, label: 'Kit' }, { k: 1, label: 'Version' }, { k: 2, label: 'Inputs', n: true }, { k: 3, label: 'Components', n: true }, { k: 4, label: 'Used on', n: true }], kits, { dense: true }) }),
    h.card({ title: 'Paver patio per sq ft v3', sub: 'Pinned on 23 estimates · new version shows a diff before upgrade', body: `${h.table([{ k: 0, label: 'Input' }, { k: 1, label: 'Type' }, { k: 2, label: 'Default' }], [['area_sqft', 'number > 0', 'required'], ['perimeter_lf', 'number', 'from design'], ['edge_against_structure_lf', 'number', '0'], ['base_depth_in', 'number 4-12', '6'], ['pattern', 'running bond, herringbone, basket weave', 'running bond'], ['paver_product', 'price book: Pavers', 'Dublin Cobble 60 mm'], ['access', 'difficulty', 'drive-up']], { dense: true })}
      ${h.table([{ k: 0, label: 'Component' }, { k: 1, label: 'Formula', m: true }], [['Base gravel (t)', 'base_area * 0.5 / 27 * 1.15 * 1.4'], ['Bedding sand (t)', 'area / 12 / 27 * 1.10 * 1.35'], ['Pavers (sq ft)', 'area * if(pattern == herringbone, 1.10, 1.05)'], ['Edge restraint (pcs)', 'ceil((perimeter - house_edge) / 8)'], ['Lay pavers (mh)', '0.090 * area * pattern_mult']], { dense: true })}${canW ? '' : h.note('Read only for your role. The owner and office manager maintain kits.')}` })]);
  if (tab === 'qq') body = h.card({ flush: true, body: h.table([{ k: 0, label: 'Service' }, { k: 1, label: 'Visible inputs (prefill)' }, { k: 2, label: 'Engine binding' }, { k: 3, label: 'Default tiers' }], QQT) }) + h.note('Quick Quote is a presentation mode of the same engine: at most 5 visible inputs, 3 condition taps and price nudges within +/-10% (03 EST-11).');
  if (tab === 'est') body = h.card({ flush: true, body: h.table([{ k: 0, label: 'Template' }, { k: 1, label: 'Overhead method' }, { k: 2, label: 'Target' }, { k: 3, label: 'Rounding' }], [['Design-build residential', 'FLH $21.00/h', '12% net', 'Up to $5'], ['Enhancements', 'FLH', '18% net', 'Up to $5'], ['Maintenance agreement', 'FLH', '15% net', 'Up to $1'], ['Commercial bid', 'MORS', '10% net', 'Up to $25'], ['Snow per event', 'SORS 29.72%', '15% net', 'Up to $5']]) });
  if (tab === 'prop') body = h.cols('2', [['Design-build residential', 'Cover, letter, options, plan, mockups, terms, deposit'], ['Compact (Quick Quote)', 'One page, SMS-friendly, e-sign + card on file'], ['Commercial bid', 'Scope by property, PO field, multi-signer'], ['Renewal', 'Old price, new price and the escalator used']].map(([n, s]) => h.card({ title: esc(n), sub: esc(s), body: h.photo('after', { label: n }) })));
  return head + lim + tabs + body;
});

// ---------- Design Studio model (10 §4.3-4.15, 21 §18.7) ----------
// Plan at 6 px per foot: viewBox 600 x 440 covers about 100 x 70 ft.
const BEDS = [
  { id: 'bedA', name: 'Bed A · foundation', d: 'M130,104 L250,104 L250,146 C214,166 166,170 130,156 Z', area: 214, perim: 71, sun: 'Part sun · 4.6 h', lx: 190, ly: 136 },
  { id: 'bedC', name: 'Bed C · driveway side', d: 'M370,104 L446,104 L446,190 C414,184 388,164 370,140 Z', area: 180, perim: 62, sun: 'Full sun · 7.2 h', lx: 404, ly: 136 },
  { id: 'bedB', name: 'Bed B · back border', d: 'M24,336 C140,312 260,330 330,322 C420,314 500,300 576,316 L576,404 L24,404 Z', area: 1180, perim: 96, sun: 'Full sun · 8 h', lx: 300, ly: 398 },
];
const GROUPS = [
  { id: 'hyd', sp: 'Little Lime Hydrangea', bed: 'bedA', spread: 5, pts: [[150, 120], [184, 124], [218, 120]] },
  { id: 'nep', sp: "Walker's Low Catmint", bed: 'bedA', spread: 3, pts: [[144, 146], [166, 152], [190, 154], [214, 150], [236, 138]] },
  { id: 'bux', sp: 'Green Velvet Boxwood', bed: 'bedC', spread: 3, pts: [[388, 116], [410, 116], [432, 118]], fix: 'salt', to: 'Fragrant Sumac' },
  { id: 'ros', sp: 'Knock Out Rose', bed: 'bedC', spread: 4, pts: [[404, 150], [428, 166]], fix: 'deer', to: "Walker's Low Catmint" },
  { id: 'ame', sp: 'Serviceberry', bed: 'bedB', spread: 15, pts: [[80, 370], [300, 362], [512, 350]] },
  { id: 'aro', sp: 'Black Chokeberry', bed: 'bedB', spread: 2.5, pts: [[128, 362], [150, 378], [446, 352], [468, 366], [490, 380]] },
  { id: 'sch', sp: 'Little Bluestem', bed: 'bedB', spread: 2, pts: [[192, 352], [208, 364], [224, 352], [240, 366], [256, 352], [200, 382], [216, 394], [232, 382], [248, 394], [264, 380], [184, 368], [272, 364]] },
  { id: 'ech', sp: 'Purple Coneflower', bed: 'bedB', spread: 2, pts: [[338, 352], [354, 366], [370, 352], [386, 366], [346, 384], [362, 396], [378, 384], [394, 396]] },
  { id: 'spo', sp: 'Prairie Dropseed', bed: 'bedB', spread: 2.5, pts: [[410, 384], [426, 396], [442, 386], [458, 398], [522, 390], [538, 380], [554, 392], [536, 400]] },
  { id: 'cup', sp: 'Leyland Cypress', bed: 'bedB', spread: 15, pts: [[552, 344]], fix: 'rgn', to: 'Serviceberry' },
  { id: 'asa', sp: 'Wild Ginger', bed: 'turf', spread: 1, pts: [[62, 214], [74, 222], [86, 214], [98, 222], [110, 214], [68, 236], [80, 244], [92, 236], [104, 244], [116, 236], [86, 254], [100, 256]] },
];
const MATF = { install: 0.35, y1: 0.5, y5: 0.8, mature: 1 };
const PCOL = { Shrub: ['#5f9952', '#2f6428'], Perennial: ['#b07cc6', '#6b4b88'], Grass: ['#d6c27a', '#8a7431'], Tree: ['#3f7d35', '#1c3c19'], Groundcover: ['#87b67a', '#3f7d35'] };
const studioState = c => {
  const fixed = k => U('st-fix-' + k, '') === '1';
  const groups = GROUPS.map(g => { const sp = g.fix && fixed(g.fix) ? g.to : g.sp; return Object.assign({}, g, { sp, p: PL(sp) || PL(g.sp) }); });
  return { groups, fixed, opt: U('st-opt', 'A'), mat: U('st-mat', 'y5'), sel: U('st-sel', 'bedB') };
};
function studioSvg(c, o) {
  o = o || {};
  const S = studioState(c), f = MATF[o.mat || S.mat] || 0.8, mini = o.mini;
  const L = k => mini ? !['irr', 'dim', 'notes'].includes(k) : h.on('st-l-' + k, !['irr', 'notes'].includes(k));
  const sel = mini ? '' : S.sel, optB = (o.opt || S.opt) === 'B';
  const t = (x, y, s, sz, anchor, col) => `<text x="${x}" y="${y}" text-anchor="${anchor || 'middle'}" style="font:700 ${sz || 8}px var(--font-body);fill:${col || '#34302a'};paint-order:stroke;stroke:rgba(255,255,255,.75);stroke-width:2.5px">${esc(s)}</text>`;
  let s = `<svg viewBox="0 0 600 440" role="img" aria-label="${esc(o.label || 'To-scale design plan')}" style="width:100%;height:auto;display:block;background:#eef3ea;border-radius:8px">`;
  s += `<defs><pattern id="hb" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#d8cfbf"/><path d="M0 6 L6 0 M6 12 L12 6 M0 0 L12 12" stroke="#b3a68f" stroke-width="1"/></pattern><pattern id="fs" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#c9bba2"/><path d="M0 14 L16 10 L22 24 L8 30 Z M22 4 L38 8 L34 20 L24 22 Z M26 28 L40 30 L36 40 L20 38 Z" fill="none" stroke="#8f8575" stroke-width="1"/></pattern><pattern id="mu" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#8a6a4f"/><circle cx="2" cy="2" r=".8" fill="#6f533c"/><circle cx="5" cy="4" r=".7" fill="#a07e60"/></pattern></defs>`;
  if (L('base')) s += `<rect x="0" y="0" width="600" height="440" fill="#dfe8d8"/><rect x="8" y="8" width="584" height="404" fill="#a9cf88"/>${Array.from({ length: 14 }, (_, i) => `<path d="M8,${30 + i * 28} L592,${22 + i * 28}" stroke="#9fc67d" stroke-width="5"/>`).join('')}`;
  s += `<rect x="8" y="8" width="584" height="404" fill="none" stroke="#4b453b" stroke-dasharray="8 5" stroke-width="1.5"/>`;
  if (L('existing')) {
    s += `<rect x="130" y="10" width="300" height="94" fill="#e9e3d6" stroke="#776e60" stroke-width="1.5"/>${t(280, 56, 'House (existing)', 11)}<rect x="304" y="100" width="14" height="5" fill="#776e60"/>${mini ? '' : t(311, 98, 'Kitchen door', 7, 'middle', '#645c4f')}`;
    s += `<rect x="452" y="8" width="96" height="196" fill="#cfc6b6" stroke="#a39a8a"/>${mini ? '' : `<text x="500" y="110" text-anchor="middle" transform="rotate(-90 500 110)" style="font:700 9px var(--font-body);fill:#645c4f">Driveway (salted in winter)</text>`}`;
    s += `<circle cx="86" cy="232" r="56" fill="#3f7d35" opacity=".18" stroke="#2f6428" stroke-dasharray="4 4"/><circle cx="86" cy="232" r="4" fill="#4b453b"/>${mini ? '' : t(86, 292, 'Silver maple (existing)', 7)}`;
    s += `<g><circle cx="38" cy="300" r="10" fill="#b42318" opacity=".75"/><path d="M31 293 L45 307 M45 293 L31 307" stroke="#fff" stroke-width="2"/></g>${mini ? '' : t(38, 322, 'Burning bush: remove', 7, 'start', '#8f1c13')}`;
  }
  if (L('hardscape')) {
    s += `<rect x="250" y="104" width="120" height="96" fill="url(#${optB ? 'fs' : 'hb'})" stroke="${sel === 'patio' ? '#2f7fb5' : '#776e60'}" stroke-width="${sel === 'patio' ? 3 : 1.2}"${sel === 'patio' ? ' stroke-dasharray="6 3"' : ''}/>${t(310, 156, optB ? 'Flagstone patio 320 sq ft' : 'Paver patio 320 sq ft', 8)}${t(310, 166, optB ? 'irregular bluestone' : 'herringbone', 7, 'middle', '#645c4f')}`;
    s += [[330, 220], [352, 236], [374, 250]].map(([x, y]) => `<rect x="${x - 6}" y="${y - 4}" width="12" height="8" rx="2" fill="#cfc6b6" stroke="#8f8575"/>`).join('');
    s += `<circle cx="420" cy="262" r="21" fill="#645c4f" stroke="${sel === 'fire' ? '#2f7fb5' : '#4b453b'}" stroke-width="${sel === 'fire' ? 3 : 1}"/><circle cx="420" cy="262" r="12" fill="#b5562f" opacity=".7"/><path d="M382,248 A40,40 0 0 1 458,248" fill="none" stroke="#a39a8a" stroke-width="7"/>${t(420, 302, 'Fire pit + seat wall 18 ft', 7)}`;
  }
  if (L('beds')) BEDS.forEach(b => { s += `<path d="${b.d}" fill="url(#mu)" stroke="${sel === b.id ? '#2f7fb5' : '#4b453b'}" stroke-width="${sel === b.id ? 3 : 1.5}"${sel === b.id ? ' stroke-dasharray="6 3"' : ''}/>`; });
  if (L('irr')) s += `<path d="M30,392 C150,370 300,384 570,372 M132,140 C170,150 210,150 246,138 M374,120 L440,120 M380,160 L440,172" fill="none" stroke="#2f7fb5" stroke-width="1.5" stroke-dasharray="4 3"/>${t(520, 366, 'Zone 7 drip', 7, 'middle', '#1b4f70')}`;
  if (L('plants')) S.groups.forEach(g => {
    const p = g.p || {}, col = PCOL[p.type] || PCOL.Shrub, r = Math.max(2.5, g.spread * 3 * f), hi = sel === g.id;
    g.pts.forEach(([x, y]) => {
      if (p.type === 'Tree') s += `<circle cx="${x}" cy="${y}" r="${r.toFixed(1)}" fill="${col[0]}" fill-opacity=".45" stroke="${hi ? '#2f7fb5' : col[1]}" stroke-width="${hi ? 2.5 : 1.2}" stroke-dasharray="5 3"/><circle cx="${x}" cy="${y}" r="2.5" fill="${col[1]}"/>`;
      else if (p.type === 'Grass') s += `<circle cx="${x}" cy="${y}" r="${r.toFixed(1)}" fill="${col[0]}" stroke="${hi ? '#2f7fb5' : col[1]}" stroke-width="${hi ? 2 : .8}"/>${[0, 60, 120].map(a => `<path d="M${(x - r * Math.cos(a * Math.PI / 180)).toFixed(1)},${(y - r * Math.sin(a * Math.PI / 180)).toFixed(1)} L${(x + r * Math.cos(a * Math.PI / 180)).toFixed(1)},${(y + r * Math.sin(a * Math.PI / 180)).toFixed(1)}" stroke="${col[1]}" stroke-width=".7"/>`).join('')}`;
      else s += `<circle cx="${x}" cy="${y}" r="${r.toFixed(1)}" fill="${col[0]}" stroke="${hi ? '#2f7fb5' : col[1]}" stroke-width="${hi ? 2 : 1}"/>${p.type === 'Shrub' && r > 5 ? `<path d="M${x - r * .5},${y} L${x + r * .5},${y} M${x},${y - r * .5} L${x},${y + r * .5}" stroke="${col[1]}" stroke-width=".8"/>` : ''}`;
    });
    if (!mini && p.common) { const [x, y] = g.pts[0]; s += t(x, y - Math.max(r, 6) - 3, `${g.pts.length} ${pcode(p)}`, 7); }
  });
  if (L('lighting')) s += [[256, 212], [300, 212], [344, 212], [378, 190], [378, 140], [334, 232], [388, 246], [452, 262], [80, 352], [300, 344]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="#f2cb6b" stroke="#a87410"/>`).join('');
  if (L('beds')) BEDS.forEach(b => { s += t(b.lx, b.ly, `${b.id === 'bedB' ? 'Bed B' : b.id === 'bedA' ? 'Bed A' : 'Bed C'} ${num(b.area)} sq ft`, 8, 'middle', '#fff').replace('fill:#fff;paint-order:stroke;stroke:rgba(255,255,255,.75)', 'fill:#fff;paint-order:stroke;stroke:rgba(52,48,42,.8)'); });
  if (L('dim')) {
    const dim = (x1, y1, x2, y2, label, vert) => `<g stroke="#246690" stroke-width="1"><path d="M${x1},${y1} L${x2},${y2}"/><path d="M${x1 - (vert ? 4 : 0)},${y1 - (vert ? 0 : 4)} L${x1 + (vert ? 4 : 0)},${y1 + (vert ? 0 : 4)} M${x2 - (vert ? 4 : 0)},${y2 - (vert ? 0 : 4)} L${x2 + (vert ? 4 : 0)},${y2 + (vert ? 0 : 4)}"/></g>` + (vert ? `<text x="${x1 - 5}" y="${(y1 + y2) / 2}" text-anchor="middle" transform="rotate(-90 ${x1 - 5} ${(y1 + y2) / 2})" style="font:700 8px var(--font-mono);fill:#1b4f70">${label}</text>` : t((x1 + x2) / 2, y1 - 4, label, 8, 'middle', '#1b4f70'));
    s += dim(250, 224, 370, 224, `20'-0"`) + dim(242, 104, 242, 200, `16'-0"`, true) + dim(24, 418, 576, 418, `92'-0" back border`);
  }
  if (!mini && L('notes')) s += t(150, 190, 'Note: keep 3 ft clear for gas meter', 8, 'start', '#96441f');
  if (!mini) {
    const warn = (x, y, k) => S.fixed(k) ? '' : `<g><path d="M${x},${y - 8} L${x + 8},${y + 6} L${x - 8},${y + 6} Z" fill="#e8b03a" stroke="#6b4806"/><text x="${x}" y="${y + 4}" text-anchor="middle" style="font:800 9px var(--font-body);fill:#34302a">!</text></g>`;
    s += warn(446, 98, 'salt') + warn(440, 168, 'deer') + warn(566, 324, 'rgn') + warn(234, 110, 'fnd');
    s += `<g transform="translate(40,40)"><circle r="14" fill="#fff" stroke="#776e60"/><path d="M0,-10 L5,6 L0,2 L-5,6 Z" fill="#34302a"/><text y="-17" text-anchor="middle" style="font:800 9px var(--font-body);fill:#34302a">N</text></g>`;
    s += `<g transform="translate(20,428)"><rect width="60" height="5" fill="#34302a"/><rect x="60" width="60" height="5" fill="#fff" stroke="#34302a"/><text x="0" y="-3" style="font:700 7px var(--font-mono);fill:#34302a">0</text><text x="60" y="-3" text-anchor="middle" style="font:700 7px var(--font-mono);fill:#34302a">10</text><text x="120" y="-3" text-anchor="middle" style="font:700 7px var(--font-mono);fill:#34302a">20 ft</text></g><text x="590" y="434" text-anchor="end" style="font:600 7px var(--font-mono);fill:#645c4f">1" = 10' · snap 1 ft · imagery Apr 2026</text>`;
  }
  return s + '</svg>';
}
function takeoff(c) {
  const S = studioState(c), optB = S.opt === 'B';
  const plants = {}; S.groups.forEach(g => { if (g.p) plants[g.p.common] = (plants[g.p.common] || 0) + g.pts.length; });
  const rows = [[optB ? 'Flagstone patio, bluestone' : 'Paver patio, herringbone (kit)', 320, 'sq ft', optB ? 31.5 : 25.28], ['Seat wall', 18, 'lin ft', 165], ['Fire pit kit', 1, 'ea', 1850], ['Mulch, double-shred, 3 in', 15, 'cu yd', 115], ['Compost amendment, 2 in', 10, 'cu yd', 78], ['Steel edging', 229, 'lin ft', 9.5], ['Lighting fixtures + transformer', 10, 'ea', 485]]
    .concat(Object.entries(plants).map(([n, q]) => { const p = PL(n); return [`${n} ${plantSize(p)}`, q, 'ea', plantPrice(p), p]; }))
    .concat(U('st-fix-tko', '') === '1' ? [['Boulders and bench (mapped)', 3, 'ea', 260]] : []);
  const price = sum(rows, r => r[1] * r[3]), cost = Math.round(price * 0.618);
  return { rows, price, cost, gm: 100 * (price - cost) / price, plants: sum(Object.values(plants)), unpriced: U('st-fix-tko', '') === '1' ? 0 : 2 };
}
const VAL_RULES = [
  { k: 'salt', id: 'VAL-SALT-01', sc: 'V1', sev: 'warning', t: 'Green Velvet Boxwood within 3 ft of the salted driveway: salt spray burn likely.', fix: "Swap to Fragrant Sumac 'Gro-Low' (salt-tolerant)" },
  { k: 'deer', id: 'VAL-DEER-01', sc: 'V1', sev: 'warning', t: 'Knock Out Rose is browsed by deer; this property reports high deer pressure.', fix: "Swap to Walker's Low Catmint" },
  { k: 'rgn', id: 'VAL-RGN-01', sc: 'MVP', sev: 'warning', t: 'Leyland Cypress is rated Not recommended in this Region (winter burn). Keeping it adds a client disclosure.', fix: 'Swap to Serviceberry (Top performer 5/5)' },
  { k: 'inv', id: 'VAL-INV-01', sc: 'MVP', sev: 'info', t: 'Existing Burning Bush is listed invasive in the state. It is marked for removal.', fix: 'Add removal line to the estimate' },
  { k: 'fnd', id: 'VAL-FND-01', sc: 'MVP', sev: 'warning', t: 'Little Lime Hydrangea is 2 ft from the foundation; it needs 3.5 ft at maturity.', fix: 'Nudge 18 in away from the wall' },
  { k: 'tko', id: 'VAL-TKO-01', sc: 'MVP', sev: 'warning', t: '2 objects are not priced: boulders and a bench.', fix: 'Map to price book items' },
];
const canEditDesign = (c, d) => { const g = c.can('design'); if (/^RWD\/a/.test(g)) return true; if (/RWD\/o/.test(g) || /RW\/o/.test(g)) return d.designer === c.who; return false; };
const pickDesign = c => c.D.designs.find(d => d.id === c.x) || c.D.designs[0];

RL.screen('web.designs', (c) => {
  const D = c.D, tab = U('dl-tab', 'all'), view = U('dl-view', 'table');
  const st = ['Draft', 'In progress', 'Client review', 'Approved', 'As-built'];
  const rows = D.designs.filter(d => tab === 'all' || d.status === tab);
  const seats = c.plan.designer_seats;
  const canNew = /W/.test(c.can('design'));
  return h.page({ title: 'Designs', sub: `${D.designs.length} designs · ${esc(c.t.region)} palette · zone ${zoneOf(c)}`, actions: seg('dl-view', [['table', 'Table'], ['board', 'Board']], 'table') + (canNew ? h.btn('New design', { kind: 'primary', icon: 'plus', go: 'web.studio' }) : '') })
    + h.kpis([{ label: 'In progress', value: D.designs.filter(d => d.status === 'In progress').length }, { label: 'Client review', value: D.designs.filter(d => d.status === 'Client review').length, tone: 'warn', delta: '2 comments waiting' }, { label: 'Approved, ready to estimate', value: D.designs.filter(d => d.status === 'Approved').length, tone: 'ok' }, { label: 'Mockups this month', value: sum(D.designs, d => d.mockups), tone: 'info', delta: `${sum(D.designs, d => d.mockups) * 10} credits` }, { label: 'Designer seats', value: seats == null ? 'Negotiated' : `1 of ${seats}`, delta: esc(c.plan.designer_note || '') }])
    + h.tabs('dl-tab', [['all', 'All', D.designs.length]].concat(st.map(s => [s, s, D.designs.filter(d => d.status === s).length])), 'all')
    + (view === 'board' ? h.board(st.map(s => ({ title: s, cards: D.designs.filter(d => d.status === s).map(d => ({ title: `${esc(d.id)} ${esc(d.title)}`, sub: `${esc(d.client)} · ${d.plants} plants`, meta: `${h.avatar(d.designer)}${d.mockups ? h.pill(d.mockups + ' mockups', 'ai') : ''}`, go: 'web.studio', x: d.id })) })))
      : h.card({ flush: true, body: h.table([
        { k: 'id', label: 'Design', m: true },
        { k: 'title', label: 'Title and client', fmt: (v, d) => `<div class="b small">${esc(v)}</div><div class="tiny t3">${esc(d.client)} · ${esc(d.property)}</div>` },
        { k: 'status', label: 'Status', fmt: s => stPill(s) },
        { k: 'designer', label: 'Designer', fmt: v => `<span class="flex nw">${h.avatar(v)}<span class="small">${esc(v)}</span></span>` },
        { k: 'options', label: 'Options', n: true },
        { k: 'plants', label: 'Plants', n: true },
        { k: 'area', label: 'Area', n: true, fmt: v => num(v) + ' sq ft' },
        { k: 'mockups', label: 'Mockups', n: true },
        { k: 'budget', label: 'Client budget', fmt: v => c.sees('price') ? esc(v) : h.mask(c, 'price', '') },
        { k: 'updated', label: 'Updated' },
      ], rows, { go: 'web.studio', empty: 'No designs in this status.' }) }));
});

RL.screen('web.studio', (c) => {
  const D = c.D, d = pickDesign(c), S = studioState(c), tk = takeoff(c);
  const edit = canEditDesign(c, d);
  const tool = U('st-tool', 'select'), view = U('st-view', '2d'), btab = U('st-btab', 'val');
  const sp = c.sees('price'), sc = c.sees('cost'), sm = c.sees('margin');
  const open = VAL_RULES.filter(r => !S.fixed(r.k));
  const warns = open.filter(r => r.sev === 'warning').length;
  const budgetHi = +((d.budget.match(/\$(\d+)k-\$(\d+)k/) || [0, 0, 32])[2]) * 1000;
  const overBudget = tk.price > budgetHi * 1.1;
  const tools = [['select', 'cursor', 'Select (V)'], ['pan', 'grid', 'Pan (H)'], ['bed', 'leaf', 'Bed (B)'], ['hard', 'box', 'Hardscape (S)'], ['plant', 'sprout', 'Plant (P)'], ['fill', 'layers', 'Fill bed (F)'], ['irr', 'drop', 'Irrigation'], ['light', 'sun', 'Lighting'], ['measure', 'ruler', 'Measure (M)'], ['dim', 'arrow-r', 'Dimension (D)'], ['text', 'pen', 'Text (T)']];
  const rail = `<div style="display:grid;gap:3px;align-content:start;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:4px">${tools.map(([k, ic, l]) => `<button type="button" class="icon-btn" title="${esc(l)}" aria-label="${esc(l)}" data-ui="st-tool" data-val="${k}" aria-pressed="${tool === k}"${!edit && !['select', 'pan', 'measure'].includes(k) ? ' disabled' : ''} style="${tool === k ? 'background:var(--primary-soft);color:var(--primary-soft-text);' : ''}${!edit && !['select', 'pan', 'measure'].includes(k) ? 'opacity:.35;' : ''}width:32px;height:30px;display:grid;place-items:center">${icon(ic)}</button>`).join('')}<button type="button" class="icon-btn" title="AI layout" aria-label="AI layout" data-ui="st-btab" data-val="ai" style="width:32px;height:30px;display:grid;place-items:center;color:var(--ai-text)">${icon('spark')}</button></div>`;
  const toolHint = { select: 'Select: click an object; Shift-click to add to the selection. Marquee shows a selection subtotal.', pan: 'Pan: drag the canvas or hold Space.', bed: 'Bed: click to place vertices, double-click to close. Snap 1 ft is on.', hard: 'Hardscape: draw a polygon, then pick a material and pattern; kit inputs fill from geometry.', plant: 'Plant: pick from the Region palette; spacing guides show mature spread.', fill: 'Fill bed: fills the selected bed from the palette by role and sun class (10 §5.5).', irr: 'Irrigation: zones, heads and drip lines feed the irrigation kit.', light: 'Lighting: fixtures and wire runs; transformer load is checked.', measure: 'Measure: click two points. Cursor 41\'-3" E, 18\'-7" N.', dim: 'Dimension: click two points to place a dimension line.', text: 'Text: add a note to the plan sheet.' }[tool];
  const canvas3d = view !== '2d' ? (c.has('design_3d') ? `<div class="stack8">${h.photo('patio', { badge: '3D view · sun study 3 pm, Jun 21', label: '3D view' })}<div class="flex between"><span class="tiny t2">Growth: Install · Year 1 · <b>Year 5</b> · Mature</span><span class="tiny t2">Season ${h.select(['Summer', 'Fall', 'Winter', 'Spring'], 'Summer', { label: 'Season' })}</span></div></div>` : h.lock(c, 'design_3d')) : '';
  const canvas = view === '3d' ? canvas3d : view === 'split' ? grid('1fr 1fr', [studioSvg(c), canvas3d], 8) : studioSvg(c);
  const selG = S.groups.find(g => g.id === S.sel), selB = BEDS.find(b => b.id === S.sel);
  let insp = '';
  if (selB) { const inBed = S.groups.filter(g => g.bed === selB.id); insp = h.kv([['Object', esc(selB.name)], ['Area', `${num(selB.area)} sq ft`], ['Perimeter', `${selB.perim} ft`], ['Sun', `${selB.sun} ${h.tag('V1')}`], ['Mulch', 'Double-shred hardwood'], ['Depth', '3 in'], ['Edging', 'Steel, 10 ft pcs'], ['Plants', `${sum(inBed, g => g.pts.length)} in ${inBed.length} groups`], ['Phase', 'Phase 1']]); }
  else if (selG) { const p = selG.p; insp = `${h.kv([['Plant', `<b>${esc(p.common)}</b><div class="tiny t3"><i>${esc(p.botanical)}</i></div>`], ['Region', `${ratingPill(p)} <span class="tiny t3">${esc(c.t.region)} ${zoneOf(c)}</span>`], ['Size', `${plantSize(p)} · qty ${selG.pts.length}`], ['Mature', `${selG.spread} ft wide`], ['Spacing', `${Math.max(1, Math.round(selG.spread * .8))} ft on center`], ['Sun', esc(p.sun)], ['Deer', `${esc(p.deer)} resistance`], ['Zones', esc(p.zones)], sp ? ['Price', money(plantPrice(p)) + ' installed'] : null])}${edit ? h.btn('Swap from palette', { sm: true, act: 'st-swap' }) : ''}`; }
  else if (S.sel === 'patio') insp = h.kv([['Object', S.opt === 'B' ? 'Flagstone patio' : 'Paver patio'], ['Area', '320 sq ft (16 x 20 ft)'], ['Pattern', S.opt === 'B' ? 'Irregular bluestone' : 'Herringbone (x1.15 labor)'], ['Base', '6 in compacted, geotextile'], ['Kit', S.opt === 'B' ? 'Flagstone on base v2' : 'Paver patio per sq ft v3'], sp ? ['Price', money(320 * (S.opt === 'B' ? 31.5 : 25.28))] : null]);
  else if (S.sel === 'fire') insp = h.kv([['Object', 'Fire pit + seat wall'], ['Fire pit', '7 ft outside diameter, gas-ready'], ['Seat wall', '18 lin ft, 20 in high'], ['Clearance', `10 ft ring clear ${h.tag('V1')}`]]);
  else insp = h.kv([['Object', 'Silver maple (existing)'], ['Canopy', '18 ft radius'], ['Note', 'Root zone: no hardscape inside the drip line']]);
  const money3 = `<div class="flex between" style="background:var(--surface);border:1px solid ${overBudget ? 'var(--warn-solid)' : 'var(--border)'};border-radius:10px;padding:8px 12px;font-size:.84rem">${sp ? `<span>Price <b class="num">${money(tk.price)}</b></span>` : `<span class="t3">Prices hidden for your role</span>`}${sp ? `<span>Cost ${h.mask(c, 'cost', '<b class="num">' + money(tk.cost) + '</b>')}</span><span>GM ${h.mask(c, 'margin', '<b>' + pct1(tk.gm) + '</b> (target 40%)')}</span>` : ''}${sp ? `<span class="tiny ${overBudget ? '' : 't3'}" style="${overBudget ? 'color:var(--warn-text)' : ''}">Client budget ${esc(d.budget)}</span>` : ''}<span class="flex gap4">${h.pill('0 errors', 'ok')}${h.pill(warns + ' warnings', warns ? 'warn' : 'ok')}${tk.unpriced ? h.pill(tk.unpriced + ' unpriced', 'warn') : ''}</span></div>`;
  const layerKeys = [['base', 'Base aerial'], ['existing', 'Existing'], ['hardscape', 'Hardscape'], ['beds', 'Beds'], ['plants', 'Plants'], ['irr', 'Irrigation'], ['lighting', 'Lighting'], ['dim', 'Dimensions'], ['notes', 'Notes']];
  const objs = [['bedA', 'Bed A · foundation', 'leaf'], ['bedC', 'Bed C · driveway side', 'leaf'], ['bedB', 'Bed B · back border', 'leaf'], ['patio', S.opt === 'B' ? 'Flagstone patio' : 'Paver patio', 'box'], ['fire', 'Fire pit + seat wall', 'box'], ['maple', 'Silver maple (existing)', 'tree']].concat(S.groups.map(g => [g.id, `${g.pts.length} ${g.p.common}`, 'sprout']));
  const bottom = btab === 'lay' ? `<div class="flex">${layerKeys.map(([k, l]) => h.toggle(l, 'st-l-' + k, !['irr', 'notes'].includes(k))).join('')}</div>`
    : btab === 'obj' ? `<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:2px 10px">${objs.map(([k, l, ic]) => `<button type="button" class="mx-nav" data-ui="st-sel" data-val="${k}"${S.sel === k ? ' aria-current="page"' : ''} style="font-size:.78rem;padding:4px 8px">${icon(ic, 's')}<span>${esc(l)}</span></button>`).join('')}</div>`
    : btab === 'com' ? h.list([{ av: D.res.primary, title: `${esc(D.res.primary)} <span class="tiny t3">client, on Bed C</span>`, sub: '"Could the patio be a bit bigger? And nothing the deer eat, please."', right: h.btn('Reply', { sm: true, act: 'st-act', val: 'Reply posted to the portal thread' }) }, { av: castOf(c, 'estimator'), title: `${esc(castOf(c, 'estimator'))} <span class="tiny t3">internal</span>`, sub: '"Keep the Better option under $30k if we can."' }])
    : btab === 'ver' ? h.timeline([{ when: 'v3 · today 10:42 · autosaved', text: 'Bed B widened 45 sq ft; roses flagged', tone: 'ok' }, { when: 'v2 · May 6 · shared with client', text: 'Option B flagstone added', tone: 'info' }, { when: 'v1 · May 3', text: 'Base plan from aerial and site assessment', tone: '' }])
    : btab === 'mock' ? grid('repeat(3,minmax(0,1fr))', [h.photo('mockup', { badge: 'AI artist rendering' }), h.photo('after', { badge: 'AI artist rendering' }), h.photo('night', { badge: 'AI artist rendering' })], 8)
    : btab === 'ai' ? (c.has('ai_layouts') ? h.aiCard({ agent: 'AI layout', level: 'L1', credits: 60, title: 'Fill Bed B with deer-resistant natives, max 3 ft', body: 'Generates 3 to-scale options inside Bed B\'s real dimensions using the Region palette and your filters. You pick one; nothing is placed until you accept.', actions: edit ? h.btn('Generate 3 layouts (60 cr)', { sm: true, kind: 'ai', act: 'st-act', val: 'Generating 3 layouts (60 credits)' }) : '', why: creditLine(c, 60) }) : `<div class="flex">${lockPill(c, 'ai_layouts', 'AI layouts')}<span class="tiny t3">Dimension-aware AI layouts ${h.tag('V1')}. Plant suggestions for a bed (3 cr) are included.</span></div>`)
    : `<div class="li">${VAL_RULES.map(r => { const done = S.fixed(r.k); return `<div class="li-i"><span class="ico ${done ? 'ok' : r.sev === 'warning' ? 'warn' : 'info'}">${icon(done ? 'check' : r.sev === 'warning' ? 'warn' : 'flag')}</span><div style="min-width:0"><div class="tt small">${esc(r.id)} ${h.tag(r.sc)} ${done ? '<span class="t3">resolved</span>' : ''}</div><div class="ss">${esc(r.t)}</div></div><div class="flex nw">${done ? '' : edit ? `<button type="button" class="btn sm" data-act="st-fix" data-val="${r.k}">${esc(r.fix)}</button>` : ''}${!done && edit ? h.btn('Override', { sm: true, act: 'st-act', val: 'Override needs a reason; it is stored and reported' }) : ''}</div></div>`; }).join('')}</div>`;
  const btabs = h.tabs('st-btab', [['val', 'Validation', open.length], ['obj', 'Objects outline'], ['lay', 'Layers'], ['com', 'Comments', 2], ['ver', 'Versions', 3], ['mock', 'Mockups', 3], ['ai', 'AI layout']], 'val');
  const head = h.page({ crumbs: [['Design', 'web.designs'], [esc(d.client), 'web.client', d.clientId], [esc(d.id)]], title: `${esc(d.id)} ${esc(d.title)} v3`, sub: `${esc(d.property)} · zone ${zoneOf(c)} · ${esc(c.t.region)} palette · autosaved 10:42 · ${avs([d.designer, castOf(c, 'estimator')])} live ${h.tag('V1')}`, tags: `${stPill(d.status)}${edit ? '' : h.pill('View only', '')}${c.role === 'crew_lead' ? h.pill('Plan sheets only', 'info') : ''}`, actions: `${seg('st-opt', [['A', 'Option A'], ['B', 'Option B']], 'A')}${h.btn('Share', { sm: true, icon: 'link', act: 'st-act', val: 'Share link for the portal' })}${h.btn('Present', { sm: true, icon: 'play', act: 'st-act', val: 'Presentation mode' })}${edit || c.role === 'designer' ? h.btn(c.role === 'designer' ? 'Hand off takeoff' : 'Push to estimate', { sm: true, kind: 'primary', act: 'st-act', val: 'Takeoff pushed; estimate lines stay linked' }) : ''}` });
  const viewTabs = `<div class="flex between"><span class="flex">${seg('st-view', [['2d', '2D'], ['3d', '3D'], ['split', 'Split']], '2d')}${c.has('design_3d') ? h.pill(c.feat('design_3d').via ? '3D add-on' : '3D included on ' + esc(c.plan.name), 'ok') : lockPill(c, 'design_3d', '3D')}${h.tag('V1')}</span><span class="flex"><span class="tiny t3">Maturity</span>${seg('st-mat', [['install', 'Install'], ['y1', 'Yr 1'], ['y5', 'Yr 5'], ['mature', 'Mature']], 'y5')}</span></div>`;
  const right = `<div class="stack12">${h.card({ title: 'Inspector', body: insp })}${h.card({ title: 'Takeoff (live)', sub: 'Feeds the estimate through the same pricing engine', body: `${tk.rows.slice(0, 7).map(r => row(esc(r[0]), `${num(r[1])} ${esc(r[2])}`)).join('')}${row('<b>Plants</b>', `<b>${tk.plants} ea</b>`)}${sp ? row('<b>Live price</b>', `<b>${money(tk.price)}</b>`) : ''}` })}
    ${h.card({ title: 'Region palette', sub: `${esc(c.t.region)} · deer-resistant filter on`, body: `<div class="flex gap4">${RL.PLANTS.filter(p => rating(p).k === 'rec').slice(0, 8).map(p => h.pill(pcode(p), 'ok')).join('')}</div>${h.note('Not recommended and invasive plants are hidden from the picker by default (12 KB-PRP-01).')}` })}</div>`;
  return head + (edit ? '' : h.note(c.role === 'crew_lead' ? 'Crew lead: read-only plan sheets, no prices (design R/c).' : `View only: ${esc(c.roleObj.name)} has design ${esc(c.can('design'))}${c.role === 'designer' ? ' and this design belongs to ' + esc(d.designer) : ''}.`))
    + viewTabs + grid('42px minmax(0,1fr) 236px', [rail, `<div class="stack8"><div style="border:1px solid var(--border);border-radius:10px;padding:6px;background:var(--surface)">${canvas}</div><div class="tiny t3">${icon('help', 's')} ${esc(toolHint)}</div>${money3}</div>`, right], 10)
    + h.card({ body: btabs + `<div style="padding-top:8px">${bottom}</div>` });
});
RL.act('st-fix', (el) => { RL.ui['st-fix-' + el.dataset.val] = '1'; RL.toast('Fixed: ' + esc((VAL_RULES.find(r => r.k === el.dataset.val) || {}).fix || '') + '. Takeoff and price updated.'); });
RL.act('st-swap', () => { RL.ui['st-btab'] = 'val'; RL.toast('Palette swap drawer: Region-rated alternatives with the same role and sun class.'); });
RL.act('st-act', (el) => { RL.toast(esc(el.dataset.val) + ' (mock)'); return false; });

// ---------- Mockup lab (11 AIM-GEN-A, AIM-FID-01, AIM-FID-07; 21 §18.8) ----------
const STYLES = [['native', 'Native pollinator'], ['modern', 'Modern'], ['cottage', 'Cottage'], ['lowmaint', 'Low-maintenance'], ['med', 'Mediterranean']];
RL.screen('web.mockups', (c, a) => {
  const D = c.D, d = D.designs[0], step = +U('mk-step', '0');
  const left = aiLeft(c), style = U('mk-style', 'native'), keepMaple = h.on('mk-keep', true), src = U('mk-src', 'design');
  const eligible = RL.PLANTS.filter(p => rating(p).n >= 3);
  const conceptsDone = step >= 2;
  const head = h.page({ title: 'Mockup lab', sub: `AI photo mockups of the client's own yard, constrained to the ${esc(c.t.region)} palette`, tags: `${h.pill(`${icon('spark', 's')}40 credits per 4-concept set · 10 per refinement`, 'ai')}${a && a.state === 'limit' ? h.pill('Limit: ' + esc(a.limit), 'info') : ''}`, actions: `<span class="small t2">${left == null ? 'Credits from purchased packs' : `${num(left)} of ${num(c.plan.ai_credits)} credits left`}</span>${h.btn('New mockup', { kind: 'primary', icon: 'plus', ui: 'mk-step', val: '0' })}` });
  const steps = h.steps(['Photo and dimensions', 'Generating', 'Review concepts'], step);
  let body = '';
  if (step === 0) {
    body = grid('minmax(0,1.1fr) minmax(0,1fr)', [
      h.card({ title: 'Property photo', sub: `${esc(d.property)} · back yard from the kitchen door`, body: `${h.photo('before', { label: 'Back yard before', badge: 'Original photo' })}<div class="small"><b>Detected:</b> house, lawn, 2 beds, fence, existing maple</div><div class="flex">${h.toggle('Keep existing maple', 'mk-keep', true)}${h.toggle('Remove burning bush (invasive)', 'mk-bb', true)}</div>` }),
      h.card({ title: 'Settings', body: `${h.field('Scale reference', `<div class="stack8">${[['design', `Use design ${esc(d.id)} v3 (to scale)`], ['known', 'Known length: garage door = 16 ft']].map(([k, l]) => `<label class="flex small"><input type="radio" name="mk-src" data-ui-input="mk-src" value="${k}"${src === k ? ' checked' : ''}> ${l}</label>`).join('')}</div>`)}
        ${h.field('Style', `<div class="flex gap4">${STYLES.map(([k, l]) => h.btn(l + (k === 'med' ? ' *' : ''), { sm: true, ui: 'mk-style', val: k, kind: style === k ? 'primary' : '' })).join('')}</div>`, style === 'med' ? 'Adapted for your region: look-alike plants stand in for lavender and olive in zone ' + zoneOf(c) + '.' : 'Presets resolve to Region palette plants before any pixel is generated.')}
        ${h.field('Season', h.select(['Summer', 'Fall', 'Spring', 'Winter'], 'Summer', { label: 'Season' }))}
        ${h.field('Plants', `<div class="flex">${h.toggle('From the design plant list', 'mk-fromplan', true)}</div>`)}
        <div class="tiny t3" style="font-weight:700;text-transform:uppercase;letter-spacing:.05em">Region-locked palette (${eligible.length} eligible)</div><div class="flex gap4">${eligible.map(p => `<span class="pill ${rating(p).k === 'rec' ? 'ok' : 'warn'}" title="${esc(p.common)} · ${esc(p.rating)}">${esc(pcode(p))}</span>`).join('')}</div>
        <div class="tiny t3">Excluded: ${RL.PLANTS.filter(p => rating(p).n < 3).map(p => esc(p.common) + ' (' + rating(p).l.toLowerCase() + ')').join(', ')}.</div>
        <div class="aic"><div class="ah">${icon('spark')}<span>Photo restyle</span><span class="lv">L1</span><span class="cr">40 cr</span></div><div class="small">${creditLine(c, 40)}</div><div class="flex">${c.allowed('mockup.generate') ? h.btn('Generate 4 concepts (40 credits)', { kind: 'ai', icon: 'spark', ui: 'mk-step', val: '1' }) : '<span class="small">You can view mockups but not generate them.</span>'}</div></div>` })]);
  } else if (step === 1) {
    body = grid('minmax(0,1.1fr) minmax(0,1fr)', [h.card({ title: 'Generating (about 40 s)', body: `<div style="position:relative">${h.photo('before', { badge: 'Segmenting', label: 'Segmentation overlay' })}</div>` }),
      h.aiCard({ agent: 'Working on it', level: 'L1', credits: 40, title: '4 concepts in progress', body: `<div class="stack8 small"><div>${icon('check', 's')} Reading depth and scale</div><div>${icon('check', 's')} Matching beds to ${esc(d.id)} v3</div><div>${icon('clock', 's')} Choosing plants from the ${esc(c.t.region)} palette (deer-resistant, native)</div><div class="t3">${icon('clock', 's')} Rendering 4 concepts</div></div>`, why: `${creditLine(c, 40)} Cancel before rendering finishes and the credits are not charged.`, actions: h.btn('Cancel', { sm: true, ui: 'mk-step', val: '0' }) + h.btn('Show results (mock)', { sm: true, kind: 'ai', ui: 'mk-step', val: '2' }) })]);
  } else {
    const cpt = U('mk-c', 'A');
    const kinds = { A: 'mockup', B: 'after', C: 'bed', D: 'patio' };
    const refined = U('mk-ref', '') === '1';
    body = `${h.card({ body: `<div class="flex between"><span class="flex">${['A', 'B', 'C', 'D'].map(k => h.btn('Concept ' + k + (k === 'A' ? ' *' : ''), { sm: true, ui: 'mk-c', val: k, kind: cpt === k ? 'primary' : '' })).join('')}</span>${seg('mk-cmp', [['side', 'Side by side'], ['slider', 'Slider']], 'side')}</div>` })}
      ${grid('minmax(0,1fr) minmax(0,1fr) 200px', [h.card({ title: 'Before', body: h.photo('before', { badge: 'Original photo' }) }), h.card({ title: `Concept ${cpt}${refined ? ' (refined)' : ''}`, body: h.photo(kinds[cpt], { badge: 'AI artist rendering', label: 'Concept ' + cpt }) }),
        h.card({ title: 'Plants shown', sub: 'From the plan', body: [['Little Lime Hydrangea', 3], ['Little Bluestem', 12], ['Serviceberry', 3], ['Prairie Dropseed', 8], ['Purple Coneflower', 8]].map(([n, q]) => `<div class="flex between small"><span>${q} ${esc(pcode(PL(n)))}</span>${ratingPill(PL(n)).replace(/ \d\/5/, '')}</div>`).join('') })], 10)}
      ${grid('minmax(0,1fr) minmax(0,1fr)', [h.card({ title: 'Refine', body: `${h.input('Make the bed edge curve more', { label: 'Refinement prompt' })}<div class="flex">${h.btn(refined ? 'Applied' : 'Brush area and apply (10 credits)', { sm: true, kind: 'ai', ui: 'mk-ref', val: '1', disabled: refined })}${h.btn('More like this (20 cr)', { sm: true, act: 'mk-act', val: '2 variants re-seeded around Concept ' + cpt })}${h.btn('HD final (20 cr)', { sm: true, act: 'mk-act', val: 'HD render queued' })}</div><div class="small">Plan sync: Concept ${cpt} matches ${esc(d.id)} v3 (62 of 62 plants placed).</div>` }),
        h.card({ title: 'Use it', body: `<div class="flex">${h.btn('Add to proposal', { sm: true, kind: 'primary', go: 'web.proposal' })}${h.btn('Download', { sm: true, icon: 'download', act: 'mk-act', val: 'Downloaded with C2PA credentials' })}${h.btn('Discard', { sm: true, act: 'mk-act', val: 'Concept discarded' })}</div>${h.field('Alt text', h.textarea(`AI artist rendering of the back yard in summer, about 3 years after planting: 3 serviceberry, 12 little bluestem and a herringbone paver patio.`, { label: 'Alt text' }))}${h.note('Disclosure badge "AI artist rendering" is on every image, in the portal and in PDFs, and cannot be removed (11 AIM-FID-07).')}` })])}`;
  }
  const recent = h.card({ title: 'Recent mockup sets', flush: true, body: h.table([{ k: 'id', label: 'Design', m: true }, { k: 'client', label: 'Client' }, { k: 'mockups', label: 'Concepts', n: true }, { k: 'cr', label: 'Credits', n: true }, { k: 'updated', label: 'When' }], D.designs.filter(x => x.mockups).slice(0, 5).map(x => Object.assign({}, x, { cr: x.mockups * 10 })), { go: 'web.studio', dense: true }) });
  return head + steps + body + recent;
});
RL.act('mk-act', (el) => { RL.toast(esc(el.dataset.val) + ' (mock)'); return false; });

// ---------- Plant library and palettes (12 KB-PRP, KB-PAL, KB-TEN) ----------
const PCARE = { 'Little Lime Hydrangea': 'Reliable bloomer here; tolerates our clay if not waterlogged.', 'Green Velvet Boxwood': 'Avoid within 6 ft of salted drives; boxwood blight pressure in shaded, humid beds.', 'Knock Out Rose': 'Deer browse buds heavily; use only with protection.', 'Leyland Cypress': 'Winter burn and canker are common in this Region; choose a native screen.', 'Burning Bush': 'Listed invasive: hidden from the picker and blocked for AI.', Serviceberry: 'Four-season native: spring bloom, June fruit, fall color.' };
RL.screen('web.plants', (c) => {
  const D = c.D, type = U('pl-type', 'All'), showHidden = h.on('pl-hidden', false), deerOnly = h.on('pl-deer', false), nativeOnly = h.on('pl-native', false);
  const all = RL.PLANTS;
  const vis = all.filter(p => (showHidden || rating(p).n >= 2) && (type === 'All' || p.type === type) && (!deerOnly || p.deer === 'High') && (!nativeOnly || NATIVE.test(p.common)));
  const sel = all.find(p => p.id === U('pl-sel', '')) || vis[0] || all[0];
  const favs = ['Little Bluestem', 'Serviceberry', 'Fragrant Sumac'];
  const canW = /W/.test(c.can('tenant_palette'));
  const r = rating(sel);
  const head = h.page({ title: 'Plant library', sub: `${esc(c.t.region)} · USDA zone ${zoneOf(c)} · ${num(3000)} plants in the KB, ${all.length} shown in this sample`, actions: `${h.input('', { ph: 'Search: "deer-resistant shrub for part shade under 4 ft"', label: 'Plant search' }).replace('class="inp"', 'class="inp" style="width:320px"')}${canW ? h.btn('Add private plant', { icon: 'plus', act: 'pl-act', val: 'Private plant form: backbone resolution first (12 KB-TEN-03)' }) : ''}` });
  const filters = `<div class="flex between"><span class="flex">${seg('pl-type', ['All', 'Tree', 'Shrub', 'Perennial', 'Grass', 'Groundcover'].map(t => [t, t]), 'All')}</span><span class="flex">${h.toggle('Deer-resistant', 'pl-deer')}${h.toggle('Native', 'pl-native')}${h.toggle('Show not recommended and invasive', 'pl-hidden')}</span></div>`;
  const hiddenN = all.filter(p => rating(p).n < 2).length;
  const tbl = h.card({ flush: true, body: h.table([
    { k: 'common', label: 'Plant', fmt: (v, p) => `<div class="flex nw">${favs.includes(p.common) ? `<span style="color:var(--marigold-600)">${icon('star', 's')}</span>` : st('display:inline-block;width:12px')}<div><div class="b small">${esc(v)}</div><div class="tiny t3"><i>${esc(p.botanical)}</i></div></div></div>` },
    { k: 'type', label: 'Type' },
    { k: 'zones', label: 'Zones', fmt: v => `<span class="mono small">${esc(v)}</span>` },
    { k: 'sun', label: 'Sun', fmt: v => `<span class="small">${esc(v)}</span>` },
    { k: 'deer', label: 'Deer', fmt: v => h.pill(esc(v), v === 'High' ? 'ok' : v === 'Low' ? 'danger' : '') },
    { k: 'rating', label: 'Region rating', fmt: (v, p) => ratingPill(p) + (NATIVE.test(p.common) ? ' ' + h.pill('native', 'info') : '') },
  ], vis.map(p => Object.assign({}, p)), { empty: 'No plants match these filters.' }).replace(/<tr>(?=<td)/g, '<tr>') });
  const rows = vis.map(p => `<button type="button" class="mx-nav" data-ui="pl-sel" data-val="${p.id}"${p.id === sel.id ? ' aria-current="page"' : ''} style="font-size:.78rem;padding:4px 8px">${esc(p.common)}</button>`).join('');
  const nurs = c.has('nursery_availability') ? h.kv([['Wholesale nursery', `${['In stock', 'Short until Jun 1', 'In stock'][hsh(sel.id) % 3]} · ${plantSize(sel)} · cost ${h.mask(c, 'cost', money(Math.round(plantPrice(sel) * .42)))}`], ['Regional index', 'Good availability (Wave 1)']]) : `<div class="flex">${lockPill(c, 'nursery_availability', 'Nursery availability')}${h.tag('V1')}</div>`;
  const detail = h.card({ title: esc(sel.common), sub: `<i>${esc(sel.botanical)}</i> · ${esc(sel.type)}`, body: `${h.photo(sel.type === 'Tree' ? 'after' : 'bed', { label: sel.common })}
    <div class="flex">${ratingPill(sel)}${NATIVE.test(sel.common) ? h.pill('Native to Ohio', 'info') : ''}${r.k === 'inv' ? h.pill('Hidden from picker, blocked for AI', 'danger') : ''}</div>
    ${h.kv([['Region', `${esc(c.t.region)} ${zoneOf(c)}${r.why ? ' · reason: ' + esc(r.why) : ''}`], ['Zones', esc(sel.zones)], ['Sun', esc(sel.sun)], ['Deer', `${esc(sel.deer)} resistance`], ['Client note', esc(PCARE[sel.common] || 'Reliable with normal care in this Region.')], ['Provenance', 'Inherited from Great Lakes and Ohio Valley, reviewed Mar 2027'], ['Price book', `${plantSize(sel)} ${h.mask(c, 'price', money(plantPrice(sel)) + ' installed')}`]])}
    ${nurs}<div class="flex">${canW && r.n >= 2 ? h.btn('Add to Company palette', { sm: true, kind: 'primary', act: 'pl-act', val: sel.common + ' added to the Company palette' }) : ''}${h.btn(favs.includes(sel.common) ? 'Favorited' : 'Favorite', { sm: true, icon: 'star', act: 'pl-act', val: 'Saved to your favorites' })}</div>` });
  return head + filters + h.note(`Region-filtered: ${vis.length} shown. ${showHidden ? 'Showing hidden plants for reference.' : hiddenN + ' hidden: not recommended or invasive here.'} Rating scale 1-5 plus do-not-use (12 KB-PRP-01).`) + grid('minmax(0,1.35fr) minmax(0,1fr)', [`<div class="stack8">${tbl}<div class="flex gap4">${rows}</div></div>`, detail]);
});
RL.act('pl-act', (el) => { RL.toast(esc(el.dataset.val) + ' (mock)'); return false; });

const PALETTES = [
  { id: 'cp1', scope: 'Company', name: `Signature foundation`, base: 'Central Ohio Pollinator Sun Border + Great Lakes Salt-Tolerant Parkway Strip', uses: 'Foundation, deer-resistant', members: [['Backbone evergreen', 'Fragrant Sumac'], ['Flowering shrub', 'Little Lime Hydrangea'], ['Accent shrub', 'Black Chokeberry'], ['Grass', 'Little Bluestem'], ['Grass', 'Prairie Dropseed'], ['Seasonal color', "Walker's Low Catmint"], ['Seasonal color', 'Purple Coneflower'], ['Small tree', 'Serviceberry']], health: [['ok', 'Every member legal and rated 3+ here'], ['warn', 'Thin in part shade: 1 groundcover'], ['ok', 'Native share 63%']] },
  { id: 'cp2', scope: 'Company', name: 'Shade and woodland edge', base: 'Golden Horseshoe Dry Shade (adapted)', uses: 'Shade garden', members: [['Groundcover', 'Wild Ginger'], ['Grass', 'Northern Sea Oats'], ['Flowering shrub', 'Little Lime Hydrangea'], ['Shade tree', 'Swamp White Oak']], health: [['warn', 'Roles thin: 1 backbone evergreen'], ['ok', 'Bloom gap under 3 weeks']] },
  { id: 'rp1', scope: 'Region', name: 'Central Ohio Pollinator Sun Border', base: 'Platform curated', uses: 'Pollinator, four-season', members: [['Seasonal color', 'Purple Coneflower'], ['Grass', 'Little Bluestem'], ['Grass', 'Prairie Dropseed'], ['Seasonal color', "Walker's Low Catmint"]], health: [['ok', 'Bloom June to October'], ['info', 'Add May bloomers for a longer season']] },
  { id: 'rp2', scope: 'Region', name: 'Great Lakes Salt-Tolerant Parkway Strip', base: 'Platform curated', uses: 'Hell strip, road salt', members: [['Grass', 'Prairie Dropseed'], ['Backbone evergreen', 'Fragrant Sumac'], ['Seasonal color', "Walker's Low Catmint"]], health: [['ok', 'All members salt-tolerant (soil and spray)']] },
  { id: 'rp3', scope: 'Region', name: 'Great Lakes Deer-Resistant Screen', base: 'Platform curated', uses: 'Privacy screen, deer', members: [['Small tree', 'Serviceberry'], ['Shade tree', 'Swamp White Oak']], health: [['info', 'Arborvitae deliberately excluded: heavy winter browse']] },
];
RL.screen('web.palettes', (c) => {
  const sel = PALETTES.find(p => p.id === U('pa-sel', '')) || PALETTES[0];
  const canW = /W/.test(c.can('tenant_palette'));
  const company = sel.scope === 'Company';
  return h.page({ crumbs: [['Plant library', 'web.plants'], ['Palettes']], title: 'Palettes', sub: `Company palettes built on curated ${esc(c.t.region)} Region palettes. The Company palette is the default for designers and for AI.`, actions: canW ? h.btn('New Company palette', { kind: 'primary', icon: 'plus', act: 'pl-act', val: 'New palette from a Region palette' }) : h.pill('Read only (tenant_palette ' + esc(c.can('tenant_palette')) + ')') })
    + grid('260px minmax(0,1fr)', [h.card({ flush: true, body: `<div class="tiny t3" style="padding:6px 12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em">${esc(c.t.name)}</div>${PALETTES.filter(p => p.scope === 'Company').map(p => `<button type="button" class="mx-nav" data-ui="pa-sel" data-val="${p.id}"${p.id === sel.id ? ' aria-current="page"' : ''} style="font-size:.8rem">${icon('leaf', 's')}<span class="grow">${esc(p.name)}</span><span class="tiny t3">${p.members.length}</span></button>`).join('')}<div class="tiny t3" style="padding:10px 12px 6px;font-weight:700;text-transform:uppercase;letter-spacing:.05em">Region palettes (curated)</div>${PALETTES.filter(p => p.scope === 'Region').map(p => `<button type="button" class="mx-nav" data-ui="pa-sel" data-val="${p.id}"${p.id === sel.id ? ' aria-current="page"' : ''} style="font-size:.8rem">${icon('globe', 's')}<span class="grow">${esc(p.name)}</span><span class="tiny t3">${p.members.length}</span></button>`).join('')}` }),
      `<div class="stack12">${h.card({ title: esc(sel.name), sub: `${company ? 'Company palette · based on ' : ''}${esc(sel.base)} · ${esc(sel.uses)}`, actions: company ? (canW ? h.btn('Add plants', { sm: true, go: 'web.plants' }) + h.btn('Create price book items', { sm: true, act: 'pl-act', val: 'Price book items created by size class (#3 shrubs, #1 perennials)' }) : '') : (canW ? h.btn('Copy to Company palette', { sm: true, kind: 'primary', act: 'pl-act', val: 'Copied as a Company palette' }) : ''), flush: true, body: h.table([
        { k: 0, label: 'Role' }, { k: 1, label: 'Plant', fmt: n => `<div class="b small">${esc(n)}</div><div class="tiny t3"><i>${esc(PL(n).botanical)}</i></div>` }, { k: 1, label: 'Sun', fmt: n => `<span class="small">${esc(PL(n).sun)}</span>` }, { k: 1, label: 'Rating', fmt: n => ratingPill(PL(n)) }, { k: 1, label: 'Size and price', n: true, fmt: n => `${plantSize(PL(n))} · ${h.mask(c, 'price', money(plantPrice(PL(n))))}` },
      ], sel.members) })}
      ${grid('1fr 1fr', [h.card({ title: 'Palette health check', sub: '12 KB-PAL-03', body: h.list(sel.health.map(([t, l]) => ({ icon: t === 'ok' ? 'check' : t === 'warn' ? 'warn' : 'help', tone: t === 'ok' ? 'ok' : t === 'warn' ? 'warn' : 'info', title: esc(l) }))) }), h.card({ title: 'Where it is used', body: `${row('Design Studio picker', company ? 'Default' : 'Fallback')}${row('AI mockups and layouts', company ? 'Default palette' : 'When no Company palette')}${row('Proposals plant list', 'Client-safe notes')}${h.note('Resolution order: Company palette, then Region palette, then macro-region (12 KB-PAL-05).')}` })])}</div>`]);
});

// ---------- Symbols and materials, design templates (10 §4.9, §4.19) ----------
const sym = (kind, col) => {
  const [f, s] = col || ['#dcebf5', '#246690'];
  const shapes = { shrub: `<circle cx="24" cy="24" r="16" fill="${f}" stroke="${s}" stroke-width="1.5"/><path d="M14 24 H34 M24 14 V34" stroke="${s}"/>`, tree: `<circle cx="24" cy="24" r="19" fill="${f}" fill-opacity=".5" stroke="${s}" stroke-dasharray="5 3" stroke-width="1.5"/><circle cx="24" cy="24" r="3" fill="${s}"/>`, grass: `<circle cx="24" cy="24" r="14" fill="${f}" stroke="${s}"/><path d="M10 24 H38 M17 12 L31 36 M31 12 L17 36" stroke="${s}" stroke-width=".8"/>`, perennial: `<circle cx="24" cy="24" r="11" fill="${f}" stroke="${s}"/><circle cx="24" cy="24" r="4" fill="${s}"/>`, ground: Array.from({ length: 7 }, (_, i) => `<circle cx="${12 + (i * 9) % 26}" cy="${14 + Math.floor(i * 9 / 26) * 10 + (i % 2) * 4}" r="4" fill="${f}" stroke="${s}" stroke-width=".7"/>`).join(''), light: `<circle cx="24" cy="24" r="6" fill="#f2cb6b" stroke="#a87410" stroke-width="1.5"/><circle cx="24" cy="24" r="14" fill="#f2cb6b" opacity=".25"/>`, head: `<circle cx="24" cy="24" r="5" fill="#2f7fb5"/><path d="M24 24 L40 14 A18 18 0 0 1 40 34 Z" fill="#2f7fb5" opacity=".25"/>`, boulder: `<path d="M10 32 L14 18 L26 12 L38 20 L36 34 Z" fill="#a39a8a" stroke="#645c4f"/>` };
  return `<svg viewBox="0 0 48 48" style="width:48px;height:48px" aria-hidden="true">${shapes[kind] || shapes.shrub}</svg>`;
};
const swatch = (pat) => `<svg viewBox="0 0 48 48" style="width:48px;height:48px;border-radius:6px" aria-hidden="true"><defs><pattern id="sw-${pat}" width="12" height="12" patternUnits="userSpaceOnUse">${{ hb: '<rect width="12" height="12" fill="#d8cfbf"/><path d="M0 6 L6 0 M6 12 L12 6 M0 0 L12 12" stroke="#b3a68f"/>', rb: '<rect width="12" height="12" fill="#cfc6b6"/><path d="M0 0 H12 M0 6 H12 M6 0 V6 M0 6 V12" stroke="#a39a8a"/>', fs: '<rect width="12" height="12" fill="#c9bba2"/><path d="M0 4 L7 2 L9 8 L2 10 Z" fill="none" stroke="#8f8575"/>', mu: '<rect width="12" height="12" fill="#8a6a4f"/><circle cx="3" cy="3" r="1" fill="#6f533c"/><circle cx="9" cy="8" r="1" fill="#a07e60"/>', gr: '<rect width="12" height="12" fill="#b8b2a6"/><circle cx="3" cy="4" r="1.3" fill="#8f8575"/><circle cx="8" cy="9" r="1.2" fill="#d0cabe"/>', tf: '<rect width="12" height="12" fill="#8dbf6a"/><path d="M2 12 V8 M6 12 V7 M10 12 V8" stroke="#6fa34f"/>' }[pat]}</pattern></defs><rect width="48" height="48" fill="url(#sw-${pat})"/></svg>`;
RL.screen('web.design_library', (c) => {
  const tab = U('lb-tab', 'plants'), canW = /W/.test(c.can('design')) && /RWD/.test(c.can('design'));
  const plantSyms = [['Deciduous shrub', 'shrub', PCOL.Shrub, 'Plant symbol, scales with mature spread'], ['Evergreen shrub', 'shrub', ['#2f6428', '#132912'], 'Darker fill marks evergreen'], ['Ornamental tree', 'tree', PCOL.Tree, 'Canopy dashed at maturity'], ['Shade tree', 'tree', ['#5f9952', '#254f20'], '30-60 ft spread'], ['Ornamental grass', 'grass', PCOL.Grass, 'Radial blades'], ['Perennial', 'perennial', PCOL.Perennial, 'Bloom color from the KB'], ['Groundcover drift', 'ground', PCOL.Groundcover, 'Fills a polygon at spacing'], ['Boulder', 'boulder', ['#a39a8a', '#645c4f'], 'Not priced until mapped']];
  const mats = [['Paver, herringbone', 'hb', 'Paver patio per sq ft v3', '$25.28 / sq ft'], ['Paver, running bond', 'rb', 'Paver patio per sq ft v3', '$23.10 / sq ft'], ['Flagstone, bluestone', 'fs', 'Flagstone on base v2', '$31.50 / sq ft'], ['Mulch, double-shred', 'mu', 'Mulch install v4', '$115 / cu yd'], ['Pea gravel', 'gr', 'Gravel path v1', '$6.40 / sq ft'], ['Sod, tall fescue', 'tf', 'Sod install v2', '$1.85 / sq ft']];
  const fixtures = [['Path light, brass', 'light', 'Lighting per fixture v1', '$420 ea'], ['Uplight, 7 W', 'light', 'Lighting per fixture v1', '$445 ea'], ['Rotor head', 'head', 'Irrigation per zone v2', '$68 ea'], ['Spray head', 'head', 'Irrigation per zone v2', '$42 ea']];
  const card = (svg, n, s, r) => `<div class="cd"><div class="cd-b" style="grid-template-columns:52px minmax(0,1fr);align-items:center">${svg}<div style="min-width:0"><div class="b small">${esc(n)}</div><div class="tiny t3">${esc(s)}</div>${r ? `<div class="tiny">${r}</div>` : ''}</div></div></div>`;
  const body = tab === 'plants' ? grid('repeat(4,minmax(0,1fr))', plantSyms.map(([n, k, col, s]) => card(sym(k, col), n, s, k === 'boulder' ? h.pill('Unmapped', 'warn') : h.pill('KB-linked', 'ok'))), 10)
    : tab === 'hard' ? grid('repeat(3,minmax(0,1fr))', mats.map(([n, p, kit, pr]) => card(swatch(p), n, 'Kit: ' + kit, h.mask(c, 'price', pr))), 10)
    : tab === 'light' ? grid('repeat(4,minmax(0,1fr))', fixtures.map(([n, k, kit, pr]) => card(sym(k), n, 'Kit: ' + kit, h.mask(c, 'price', pr))), 10)
    : grid('repeat(3,minmax(0,1fr))', [['North arrow', 'Standard and compass rose'], ['Scale bar', 'Imperial and metric'], ['Title block', `${c.t.name} logo, license number, sheet index`], ['Revision cloud', 'For change orders and as-builts'], ['Utility flag', 'Gas, electric, water, irrigation'], ['Snow storage area', `Feeds VAL-SNOW-01 ${h.tag('V1')}`]].map(([n, s]) => card(sym('boulder', ['#dcebf5', '#246690']), n, s)), 10);
  return h.page({ title: 'Symbols and materials', sub: 'Every symbol and material maps to a Price Book item or kit, so takeoffs price themselves', actions: canW ? h.btn('Upload Company symbol', { icon: 'upload', act: 'pl-act', val: 'SVG symbol upload' }) : '' })
    + h.tabs('lb-tab', [['plants', 'Plant symbols', plantSyms.length], ['hard', 'Hardscape materials', mats.length], ['light', 'Lighting and irrigation', fixtures.length], ['site', 'Site and annotation', 6]], 'plants')
    + body + h.note('Unmapped objects raise VAL-TKO-01 "not priced" in the Studio until they are linked (10 §4.11).');
});
RL.screen('web.design_templates', (c) => {
  const canW = /W/.test(c.can('design')) && /RWD/.test(c.can('design'));
  const tpls = [['Foundation bed, 30 ft, part sun', 'Backbone evergreen, flowering shrub, seasonal color', 'Signature foundation', 23, false], ['Pollinator border, full sun', '7-12 species, bloom June to October', 'Central Ohio Pollinator Sun Border', 14, false], ['Rain garden, clay', 'Bottom, slope and rim zones', 'Central Ohio Clay Rain Garden', 6, false], ['Deer-resistant screen', 'Small tree + deciduous layer', 'Great Lakes Deer-Resistant Screen', 9, false], ['Parkway strip, salt', 'Curb zone and back zone', 'Great Lakes Salt-Tolerant Parkway Strip', 4, false], ['Mediterranean courtyard', 'Silver foliage look-alikes', 'Adapted for your region', 2, true]];
  const thumb = (i) => `<svg viewBox="0 0 160 90" style="width:100%;height:auto;display:block;border-radius:6px;background:#a9cf88" aria-hidden="true"><path d="M0,${60 - i * 3} C40,${44 + i * 2} 90,${66 - i * 2} 160,${50 + i} L160,90 L0,90 Z" fill="#8a6a4f"/>${Array.from({ length: 9 }, (_, k) => `<circle cx="${12 + k * 17}" cy="${70 + (k % 3) * 6 - i}" r="${4 + (k + i) % 4}" fill="${['#5f9952', '#d6c27a', '#b07cc6', '#3f7d35'][(k + i) % 4]}" stroke="#254f20" stroke-width=".6"/>`).join('')}</svg>`;
  return h.page({ title: 'Design templates', sub: 'Reusable bed and layout templates. They reference palette roles, not plants, and resolve to each property\'s Region palette.', tags: h.tag('V1'), actions: canW ? h.btn('Save selection as template', { kind: 'primary', icon: 'plus', act: 'pl-act', val: 'Template saved from the current Studio selection' }) : '' })
    + grid('repeat(3,minmax(0,1fr))', tpls.map(([n, s, pal, used, adapted], i) => h.card({ title: esc(n), sub: esc(s), body: `${thumb(i)}<div class="flex">${adapted ? h.pill('Adapted for your region', 'warn') : h.pill(esc(pal), 'ok')}<span class="tiny t3">used ${used} times</span></div>`, actions: h.btn('Use', { sm: true, act: 'pl-act', val: `${n} placed in the Studio, resolved to the ${c.t.region} palette` }) })), 12)
    + h.note('If fewer than 5 eligible plants remain for a property, the template shows "Adapted for your region" or is hidden (12 KB-PAL-05).');
});
})();
