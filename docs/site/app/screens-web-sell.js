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

/* @@SECTIONS */
})();
