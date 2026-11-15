/* screens-web-run: Schedule, Jobs, Money and Books screens of the Company web app (04, 05, 07, 08, 09, 14, 18).
   All data comes from c.D (RL.data) plus small deterministic derivations; nothing is random. */
(() => {
'use strict';
const RL = window.RL, h = RL.h, { esc, icon, money, kmoney, num } = h;

// ---------------------------------------------------------------- shared helpers
const hs = s => { let x = 7; for (const ch of String(s)) x = (x * 31 + ch.charCodeAt(0)) >>> 0; return x; };
const rint = (seed, a, b) => a + (hs(seed) % (b - a + 1));
const sum = (arr, f) => arr.reduce((t, x) => t + (f ? f(x) : x), 0);
const r2 = n => Math.round(n * 100) / 100;
const cents = n => money(r2(n), { cents: true });
const toMin = s => { const [a, b] = String(s).split(':').map(Number); return a * 60 + (b || 0); };
const hm = m => { const a = Math.floor(m / 60), b = Math.round(m % 60); return `${a % 12 || 12}:${String(b).padStart(2, '0')} ${a >= 12 ? 'pm' : 'am'}`; };
const h24 = m => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
const isCrew = c => c.role === 'crew_lead' || c.role === 'technician';
const myCrew = c => c.D.crews.find(cr => cr.lead === c.who || cr.members.includes(c.who)) || c.D.crews[0];
const multiBranch = c => c.t.branches.length > 1;
const branchOf = c => (c.role === 'ops_manager' && multiBranch(c)) ? c.t.branches[0] : (multiBranch(c) ? (RL.ui.br || 'all') : 'all');
const first = n => String(n || '').replace(/\(.*?\)/g, '').trim().split(' ')[0];
const last = n => { const p = String(n || '').replace(/\(.*?\)/g, '').trim().split(' '); return p.length > 1 && !/HOA|Association|Center|Park|Plaza|Commons|District|Apartments|Living|Campus|Townhomes|Dental/.test(n) ? p[p.length - 1] : String(n).split(' ').slice(0, 2).join(' '); };
const P = (c, n, o) => h.mask(c, 'price', o && o.cents ? cents(n) : money(n));
const Cst = (c, n, o) => h.mask(c, 'cost', o && o.cents ? cents(n) : money(n));
const Mg = (c, v) => h.mask(c, 'margin', v);
const TONE = { Done: 'ok', Complete: 'ok', Paid: 'ok', Matched: 'ok', Signed: 'ok', Active: 'ok', Approved: 'ok', Posted: 'ok', Reconciled: 'ok', Serviced: 'ok', 'In progress': 'info', 'En route': 'info', Sent: 'info', Viewed: 'info', Scheduled: '', Draft: '', 'On hold': 'warn', Pending: 'warn', 'Needs approval': 'warn', Overdue: 'danger', Declined: 'danger', Failed: 'danger', Triggered: 'warn', Exception: 'danger' };
const st = s => h.pill(esc(s), TONE[s] != null ? TONE[s] : '');
const dot = (color, size) => `<i aria-hidden="true" style="display:inline-block;width:${size || 9}px;height:${size || 9}px;border-radius:50%;background:${color};flex:none"></i>`;
const stack = items => `<div class="stack12">${items.filter(Boolean).join('')}</div>`;
const lockBtn = (c, label, feat) => `<button type="button" class="btn sm" data-modal="run-lock" data-feat="${esc(feat)}" title="Not included in ${esc(c.plan.name)}">${icon('lock')}${label}</button>`;
const lockPill = (c, feat, label) => `<span class="pill warn" data-modal="run-lock" data-feat="${esc(feat)}" role="button" tabindex="0" style="cursor:pointer">${icon('lock', 's')}${label || 'Locked on ' + esc(c.plan.name)}</span>`;
RL.modal('run-lock', (c, el) => ({ title: 'Not in your package', body: h.lock(c, el.dataset.feat), foot: h.btn('Close', { act: 'noop' }) }));
const toast = msg => (el, ev, c) => { RL.toast(typeof msg === 'function' ? msg(c, el) : msg); return false; };
const mini = (label, value, sub) => `<div style="display:grid;gap:1px"><span class="tiny t3">${label}</span><b class="num">${value}</b>${sub ? `<span class="tiny t3">${sub}</span>` : ''}</div>`;
const roNote = (c, what) => h.note(`${esc(c.as.label)}: ${what}`);
const DAYS = c => c.winter ? [['Mon', 'Jan 11'], ['Tue', 'Jan 12'], ['Wed', 'Jan 13'], ['Thu', 'Jan 14'], ['Fri', 'Jan 15'], ['Sat', 'Jan 16']]
  : [['Mon', 'May 10'], ['Tue', 'May 11'], ['Wed', 'May 12'], ['Thu', 'May 13'], ['Fri', 'May 14'], ['Sat', 'May 15']];
const WX = c => c.winter
  ? [['snow', 'Snow 1-3 in', 27, 70], ['snow', 'Snow ends 7 am, 4.5 in', 24, 90], ['sun', 'Clear, cold', 16, 0], ['snow', 'Flurries', 25, 30], ['cloud', 'Cloudy', 31, 10], ['snow', 'Lake-effect bands', 28, 60]]
  : [['sun', 'Sunny', 71, 10], ['rain', 'Rain after 1 pm', 64, 80], ['cloud', 'Partly cloudy', 68, 20], ['sun', 'Sunny', 74, 5], ['rain', 'Showers', 66, 40], ['sun', 'Sunny', 72, 10]];
const branchCtl = c => {
  if (!multiBranch(c)) return '';
  if (c.role === 'ops_manager') return h.pill(icon('lock', 's') + 'Branch scope: ' + esc(c.t.branches[0]), 'info');
  return `<span class="flex nw gap4 tiny t2">Branch <span style="width:150px;display:inline-block">${h.select([['all', 'All branches']].concat(c.t.branches.map(b => [b, b])), RL.ui.br || 'all', { ui: 'br', label: 'Branch' })}</span></span>`;
};
const crewsInScope = c => {
  if (isCrew(c)) return [myCrew(c)].filter(Boolean);
  const b = branchOf(c);
  return b === 'all' ? c.D.crews : c.D.crews.filter(x => x.branch === b);
};
const TAX = c => {
  const s = (c.t.city.match(/,\s*([A-Z]{2})/) || [])[1];
  return ({
    OH: { st: 'OH', jur: /Toledo/.test(c.t.city) ? 'Lucas County, OH' : 'Franklin County, OH', rate: /Toledo/.test(c.t.city) ? 7.75 : 7.5, svc: true, note: 'Ohio taxes landscaping and lawn care services; capital improvements follow contractor rules (verify).', engine: c.planCode === 'starter' ? 'Manual rates' : 'Stripe Tax', freq: 'Monthly, due the 23rd' },
    IL: { st: 'IL', jur: /Evanston/.test(c.t.city) ? 'Evanston, IL' : 'Naperville, IL', rate: 0, matRate: 7.75, svc: false, note: 'Illinois does not tax most services; materials are taxed when separately sold (verify).', engine: 'Stripe Tax', freq: 'Monthly, due the 20th' },
    WI: { st: 'WI', jur: 'Waukesha County, WI', rate: 5.5, svc: true, note: 'Wisconsin taxes landscaping and lawn maintenance services (verify).', engine: 'Stripe Tax', freq: 'Quarterly' },
    MI: { st: 'MI', jur: 'Kent County, MI', rate: 0, matRate: 6, svc: false, note: 'Michigan does not tax services; materials sold separately are taxed at 6% (verify).', engine: 'Manual rates', freq: 'Monthly, due the 20th' },
    IN: { st: 'IN', jur: 'Marion County, IN', rate: 0, matRate: 7, svc: false, note: 'Indiana generally does not tax services (verify).', engine: 'Stripe Tax', freq: 'Monthly' },
  })[s] || { st: s || '-', jur: c.t.city, rate: 0, svc: false, note: 'Rates from the tax engine (verify).', engine: 'Manual rates', freq: 'Monthly' };
};
const seasonWord = c => c.winter ? 'winter' : 'peak season';

// ---------------------------------------------------------------- snow sites and the day's visits
const _cache = {};
const memo = (c, k, fn) => { const key = c.t.id + '|' + c.season + '|' + k; return _cache[key] || (_cache[key] = fn()); };
function snowSites(c) {
  return memo(c, 'snow', () => {
    const cl = c.D.clients.slice().sort((a, b) => (a.type === 'residential') - (b.type === 'residential'));
    return cl.slice(0, Math.min(16, cl.length)).map((x, i) => {
      const com = x.type !== 'residential';
      const p1 = i < 2 || /Medical|Senior|Dental|Library|Plaza|Retail|Shopping/.test(x.name);
      const pr = com ? (p1 ? 1 : 2) : 3;
      return { id: 'SS-' + (210 + i), client: x.name, clientId: x.id, address: x.address, com, priority: pr, trigger: com ? '2 in lots, 0.5 in walks' : '2 in drive', services: com ? 'Plow, salt lot, walks' : 'Plow drive, shovel walk', push: com ? rint(x.id + 'p', 6, 14) * 25 : rint(x.id + 'p', 9, 15) * 5, salt: com ? rint(x.id + 's', 5, 11) * 25 : 0, model: com ? (i % 3 === 0 ? 'Seasonal (6 installments)' : 'Per push') : 'Per push' };
    }).sort((a, b) => a.priority - b.priority).map((s, i) => Object.assign(s, { seq: i + 1 }));
  });
}
function winterVisits(c) {
  return memo(c, 'wv', () => {
    const sites = snowSites(c), crews = c.D.crews.slice(0, Math.max(1, Math.min(4, c.D.crews.length)));
    const out = []; if (!crews.length) return out;
    const now = 292;
    crews.forEach((cr, ci) => {
      let t = 150 + ci * 12;
      sites.filter((s, i) => i % crews.length === ci).slice(0, 7).forEach((s, k) => {
        const dur = s.com ? 35 + (hs(s.id) % 3) * 10 : 20;
        const end = t + dur;
        const status = end <= now ? 'Done' : t <= now ? 'In progress' : (out.filter(v => v.crewId === cr.id && v.status === 'En route').length ? 'Scheduled' : 'En route');
        out.push({ id: 'V-' + (60100 + ci * 20 + k), stop: k + 1, crew: cr.name, crewId: cr.id, client: s.client, clientId: s.clientId, address: s.address, service: k % 3 === 2 && s.com ? 'Salt application' : 'Snow push', start: h24(t), dur, budgetHrs: Math.round(dur / 60 * 10) / 10 * (cr.members.length + 1), status, x: 30 + ((ci * 61 + k * 43) % 340), y: 24 + ((ci * 37 + k * 53) % 200), gate: null, dog: null, site: s });
        t = end + 9 + (hs(s.id) % 3) * 4;
      });
    });
    return out;
  });
}
// Peak day: statuses follow the clock (now 10:20 am) instead of the stop index.
function peakVisits(c) {
  return memo(c, 'pv', () => {
    const now = 620, out = c.D.visits.map(v => Object.assign({}, v));
    c.D.crews.forEach(cr => {
      const mine = out.filter(v => v.crewId === cr.id);
      mine.forEach(v => { const s = toMin(v.start), e = s + v.dur; v.status = e <= now ? 'Done' : s <= now ? 'In progress' : 'Scheduled'; });
      if (!mine.some(v => v.status === 'In progress')) { const nx = mine.find(v => v.status === 'Scheduled'); if (nx) nx.status = 'En route'; }
    });
    return out;
  });
}
const dayVisits = c => c.winter ? winterVisits(c) : peakVisits(c);
const findVisit = (c, id) => dayVisits(c).find(v => v.id === id) || peakVisits(c).find(v => v.id === id) || winterVisits(c).find(v => v.id === id);
const vPrice = v => /mow/i.test(v.service) ? 45 + hs(v.id) % 7 * 5 : /cleanup/i.test(v.service) ? 280 + hs(v.id) % 9 * 30 : /Round|Grub|aeration|Overseed/i.test(v.service) ? 62 + hs(v.id) % 6 * 6
  : /Irrigation|Backflow|Controller|Winter/i.test(v.service) ? 95 + hs(v.id) % 8 * 15 : /Snow|Salt/i.test(v.service) ? (v.site ? (/Salt/.test(v.service) ? v.site.salt || v.site.push : v.site.push) : 85) : /Mulch|prun|edging/i.test(v.service) ? 140 + hs(v.id) % 6 * 20 : 1250;
const vTone = s => ({ Done: 'done', 'In progress': 'ok', 'En route': 'info', Scheduled: 'accent' })[s] || 'accent';
const ROUTE_COLORS = ['var(--primary)', 'var(--sky-500)', 'var(--clay-500)', 'var(--marigold-600)', 'var(--iris-500)'];

// ---------------------------------------------------------------- Schedule: dispatch board (04 §4.6, §6.2, §5.4)
function dayGrid(c, crews, vis) {
  const W = c.winter, H0 = W ? 2 : 7, H1 = W ? 10 : 18, span = (H1 - H0) * 60, now = W ? 292 : 620;
  const L = m => (Math.max(0, Math.min(1, (m - H0 * 60) / span)) * 100);
  const hours = []; for (let x = H0; x <= H1; x++) hours.push(x);
  const cell = 100 / (H1 - H0);
  const gridBg = `background-image:linear-gradient(to right,var(--border) 1px,transparent 1px);background-size:${cell.toFixed(4)}% 100%;`;
  const band = W ? [H0 * 60, 7 * 60] : [13 * 60, H1 * 60];
  const bandHtml = `<div aria-hidden="true" style="position:absolute;top:0;bottom:0;left:${L(band[0]).toFixed(2)}%;width:${(L(band[1]) - L(band[0])).toFixed(2)}%;background:repeating-linear-gradient(135deg,color-mix(in srgb,var(--info-solid) 15%,transparent) 0 5px,transparent 5px 11px)"></div>`;
  const nowHtml = `<div aria-hidden="true" style="position:absolute;top:0;bottom:0;left:${L(now).toFixed(2)}%;width:2px;background:var(--danger-solid);z-index:2"></div>`;
  const precip = W ? [90, 90, 85, 70, 55, 30, 10, 5] : [5, 5, 10, 10, 15, 30, 60, 80, 85, 70, 40];
  const head = `<div style="display:grid;grid-template-columns:200px minmax(0,1fr);border-bottom:1px solid var(--border);background:var(--surface-2)"><div class="tiny t3" style="padding:6px 10px">${W ? 'Storm route' : 'Crew'}</div><div style="position:relative;height:24px">${hours.map(x => `<span class="tiny t3" style="position:absolute;top:5px;left:${L(x * 60).toFixed(2)}%;transform:translateX(${x === H0 ? '2px' : x === H1 ? 'calc(-100% - 2px)' : '-50%'})">${x % 12 || 12}${x < 12 ? 'a' : 'p'}</span>`).join('')}</div></div>`;
  const wx = `<div style="display:grid;grid-template-columns:200px minmax(0,1fr);border-bottom:1px solid var(--border)"><div class="tiny t3 flex nw gap4" style="padding:4px 10px">${icon(W ? 'snow' : 'rain', 's')}${W ? 'Snow chance' : 'Rain chance'}</div><div style="display:grid;grid-template-columns:repeat(${H1 - H0},minmax(0,1fr))">${precip.map(p => `<span class="tiny num" style="text-align:center;padding:3px 0;background:color-mix(in srgb,var(--info-solid) ${Math.round(p * .45)}%,transparent);color:${p >= 60 ? 'var(--info-text)' : 'var(--text-3)'};font-weight:${p >= 60 ? 700 : 500}">${p}%</span>`).join('')}</div></div>`;
  const block = (v, cr) => {
    const s = toMin(v.start), w = Math.max(.9, L(s + v.dur) - L(s));
    const done = v.status === 'Done', prog = v.status === 'In progress', route = v.status === 'En route';
    const bg = done ? 'var(--surface-3)' : prog ? 'var(--ok-bg)' : route ? 'var(--info-bg)' : `color-mix(in srgb,${cr.color} 16%,var(--surface))`;
    const bd = done ? 'var(--border)' : prog ? 'var(--ok-solid)' : route ? 'var(--info-solid)' : cr.color;
    const risk = !W && !done && s >= 13 * 60;
    const label = v.dur >= 40 ? `${v.stop} ${esc(last(v.client))}` : `${v.stop}`;
    return `<button type="button" data-go="web.visit" data-x="${esc(v.id)}" title="${esc(`${hm(s)} · ${v.client} · ${v.service} · ${v.dur} min · ${v.status}${risk ? ' · rain risk' : ''}`)}" style="position:absolute;top:7px;bottom:7px;left:${L(s).toFixed(2)}%;width:calc(${w.toFixed(2)}% - 2px);border:1px solid ${bd};border-left:3px solid ${bd};background:${bg};border-radius:5px;font-size:.64rem;font-weight:650;color:${done ? 'var(--text-3)' : 'var(--text)'};overflow:hidden;white-space:nowrap;text-overflow:ellipsis;padding:0 3px;text-align:left;cursor:pointer;z-index:1">${risk ? '<span style="color:var(--info-text)">☂</span>' : ''}${label}</button>`;
  };
  const rows = crews.map(cr => {
    const vs = vis.filter(v => v.crewId === cr.id);
    const hrs = sum(vs, v => v.dur) / 60, cap = W ? 8 : cr.type === 'install' ? 9 : 9.5;
    return `<div style="display:grid;grid-template-columns:200px minmax(0,1fr);border-bottom:1px solid var(--border)"><div style="padding:6px 10px;display:grid;gap:3px;font-size:.76rem;min-width:0"><div class="flex nw gap4" style="min-width:0" title="${esc(cr.lead + ' + ' + cr.members.length + ' · ' + cr.truck)}">${dot(cr.color)}<b class="nowrap">${esc(cr.name)}</b><span class="t3 nowrap" style="overflow:hidden;text-overflow:ellipsis;min-width:0">${esc(first(cr.lead))}${cr.members.length ? ' +' + cr.members.length : ''}</span></div><div class="flex nw tiny t3" style="justify-content:space-between"><span>${vs.length} ${vs.length === 1 ? 'stop' : 'stops'}</span><span class="num">${hrs.toFixed(1)}/${cap} h</span></div>${h.progress(hrs, cap, hrs > cap ? 'danger' : hrs > cap * .9 ? 'warn' : '')}</div><div style="position:relative;min-height:50px;${gridBg}">${bandHtml}${nowHtml}${vs.map(v => block(v, cr)).join('') || `<span class="tiny t3" style="position:absolute;left:8px;top:16px">${W ? 'Standby: not on a storm route' : 'No visits today'}</span>`}</div></div>`;
  }).join('');
  const legend = `<div class="flex tiny t3" style="padding:8px 10px">${[['var(--surface-3)', 'Done'], ['var(--ok-bg)', 'In progress'], ['var(--info-bg)', 'En route'], ['color-mix(in srgb,var(--primary) 16%,var(--surface))', 'Scheduled']].map(([b, l]) => `<span class="flex nw gap4"><i style="width:14px;height:10px;border-radius:3px;background:${b};border:1px solid var(--border-strong)"></i>${l}</span>`).join('')}<span class="flex nw gap4"><i style="width:14px;height:10px;background:repeating-linear-gradient(135deg,color-mix(in srgb,var(--info-solid) 35%,transparent) 0 3px,transparent 3px 6px)"></i>${W ? 'Snowfall' : 'Rain band (forecast ≥ 60%)'}</span><span class="flex nw gap4"><i style="width:2px;height:12px;background:var(--danger-solid)"></i>Now ${W ? '4:52 am' : '10:20 am'}</span></div>`;
  return `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;background:var(--surface)">${head}${wx}${rows || '<div class="empty">No crews in this scope.</div>'}${legend}</div>`;
}
function weekGrid(c, crews, vis, n) {
  const all = DAYS(c), days = n === 3 ? all.slice(1, 4) : all, wx = WX(c), off = n === 3 ? 1 : 0;
  const applied = RL.ui['board.rain'] === 'applied';
  const rows = crews.map(cr => {
    const base = Math.max(1, vis.filter(v => v.crewId === cr.id).length), baseH = sum(vis.filter(v => v.crewId === cr.id), v => v.dur) / 60 || 7.5;
    const cap = c.winter ? 8 : cr.type === 'install' ? 9 : 9.5;
    const cells = days.map(([d, dt], i) => {
      const di = i + off;
      if (d === 'Sat' && cr.type !== 'maintenance') return '<td class="n t3">-</td>';
      let stops = di === 1 ? base : Math.max(0, base + (hs(cr.id + d) % 5) - 2);
      if (d === 'Sat') stops = Math.round(base / 3);
      if (applied && !c.winter && (d === 'Wed' || d === 'Thu')) stops += 2;
      if (applied && !c.winter && d === 'Tue') stops = Math.max(0, stops - 4);
      const hrs = cr.type === 'install' ? (d === 'Sat' ? 0 : 8.5) : baseH * stops / base;
      const tone = hrs > cap ? 'danger' : hrs > cap * .9 ? 'warn' : '';
      return `<td style="min-width:96px"><div class="flex nw tiny" style="justify-content:space-between"><span>${cr.type === 'install' ? 'J-' + (1042 + crews.indexOf(cr)) : stops + ' st'}</span><span class="num ${tone === 'danger' ? '' : 't2'}" style="${tone === 'danger' ? 'color:var(--danger-text);font-weight:700' : ''}">${hrs.toFixed(1)}/${cap}h</span></div>${h.progress(hrs, cap, tone)}</td>`;
    }).join('');
    return `<tr><td class="nowrap">${dot(cr.color)} <b>${esc(cr.name)}</b><div class="tiny t3">${esc(cr.lead)}</div></td>${cells}</tr>`;
  }).join('');
  const util = days.map(([d], i) => { const p = [88, applied ? 86 : 101, applied ? 97 : 84, applied ? 99 : 91, 86, 42][i + off]; return `<td class="n"><b style="color:${p > 100 ? 'var(--danger-text)' : p > 95 ? 'var(--warn-text)' : 'inherit'}">${p}%</b></td>`; }).join('');
  return `<div class="tb-wrap"><table class="tb dense"><thead><tr><th>Crew</th>${days.map(([d, dt], i) => `<th>${d} ${dt}<div class="tiny t3" style="text-transform:none;letter-spacing:0;font-weight:600">${icon(wx[i + off][0] === 'cloud' ? 'sun' : wx[i + off][0], 's')} ${wx[i + off][2]}°F · ${wx[i + off][3]}%</div></th>`).join('')}</tr></thead><tbody>${rows}</tbody><tfoot><tr><td>Capacity used</td>${util}</tr></tfoot></table></div>`;
}
function backlog(c) {
  return memo(c, 'backlog', () => {
    const W = c.winter, D = c.D;
    const svc = W ? ['Dormant pruning', 'Holiday lighting takedown', 'Snow relocation (hauling)', 'Salt-only callout', 'Tree removal: storm damage', 'Irrigation controller swap']
      : (c.mod('lawn_programs') ? ['Core aeration (window ends May 25)', 'Spring cleanup', 'Mulch install, 12 yd', 'Grub preventive (window open)', 'Irrigation repair', 'Shrub pruning'] : ['Spring cleanup', 'Mulch install, 12 yd', 'Bed edging', 'Irrigation repair', 'Shrub pruning', 'Lighting repair']);
    return svc.map((s, i) => { const cl = D.clients[(i * 4 + 2) % D.clients.length]; return { id: 'BK-' + (40 + i), title: s, client: cl.name, clientId: cl.id, hrs: [3.5, 0.75, 6, 1.5, 2, 4][i], due: (W ? ['Jan 20', 'Jan 15', 'Jan 13', 'Jan 12', 'Jan 14', 'Jan 22'] : ['May 25', 'May 14', 'May 20', 'May 31', 'May 13', 'May 21'])[i], need: (W ? ['Dump trailer', '', 'Skid steer', 'Salt spreader', 'Chainsaw crew', ''] : ['Dump trailer', '', 'Skid steer', 'Applicator license', '', ''])[i], urgent: i === 1 || i === 3 }; });
  });
}
RL.screen('web.board', (c) => {
  const D = c.D, W = c.winter, view = h.tab('board.view', 'day'), crewMode = isCrew(c);
  const crews = crewsInScope(c), ids = new Set(crews.map(x => x.id));
  const vis = dayVisits(c).filter(v => ids.has(v.crewId));
  const days = DAYS(c), pub = RL.ui['board.pub'] === '1', rain = RL.ui['board.rain'];
  const changes = W ? ['Storm route: sites re-ordered by priority (P1 first)', 'Added salt re-application at 2 P1 sites', 'Crew 4 joins storm route from 5:30 am']
    : [`Moved 3 stops Thu to Wed (${crews[1] ? crews[1].name : 'Maintenance 2'})`, `Added ${backlog(c)[1].title.toLowerCase()} for ${backlog(c)[1].client}`, `Reassigned ${D.jobs[2] ? D.jobs[2].id : 'J-1044'} to ${crews[0] ? crews[0].name : 'Crew 1'}`, `Locked the Wed window for ${(D.clients.find(x => x.type !== 'residential') || { name: 'a commercial site' }).name}`, 'New client: first cut Thu', 'Skip: client on vacation'];
  if (rain === 'applied') changes.push('Rain plan applied: afternoon stops moved to Wed-Thu');
  const atRisk = W ? [] : vis.filter(v => toMin(v.start) >= 13 * 60 && v.status !== 'Done');
  const stateP = pub ? h.pill('Published · crews and clients notified', 'ok', 'check') : h.pill(`Draft · ${changes.length} unpublished changes`, 'warn', 'pen');
  const actions = crewMode ? h.btn('Reorder today\'s stops', { icon: 'route', act: 'board-reorder' })
    : [c.has('route_vrp') ? h.btn('Optimize routes', { icon: 'route', act: 'board-optimize' }) : lockBtn(c, 'Optimize all crews', 'route_vrp'),
       h.btn('Move day', { icon: 'calendar', act: 'board-moveday' }),
       pub ? h.btn('Published', { icon: 'check', disabled: true }) : h.btn('Publish changes', { kind: 'primary', icon: 'send', act: 'board-publish' })].join('');
  const sub = `${days[1][0]} ${days[1][1]} · ${crews.length} ${crews.length === 1 ? 'crew' : 'crews'} · ${vis.length} visits · ${vis.filter(v => v.status === 'Done').length} done`;
  const toolbar = `<div class="flex" style="justify-content:space-between">${h.tabs('board.view', [['day', 'Day'], ['3day', '3-day'], ['week', 'Week']], 'day')}<div class="flex">${branchCtl(c)}${crewMode ? '' : stateP}</div></div>`;
  const W0 = WX(c)[1];
  const weatherBar = W ? h.banner(`${icon('snow')} Storm in progress: ${W0[1]}. Storm visits come from Snow & Ice; maintenance routes are paused until Wed.`, 'info')
    : h.banner(`${icon('rain')} ${W0[1]} today (${W0[3]}%, 0.6 in). ${atRisk.length} afternoon visits sit in the rain band.`, 'info');
  let body = view === 'day' ? dayGrid(c, crews, vis) : weekGrid(c, crews, vis, view === '3day' ? 3 : 6);
  // Rain-day reshuffle (A7, V1)
  let ai = '';
  if (!crewMode && !W && c.inLens('V1')) {
    const moves = atRisk.slice(0, 7).map((v, i) => ({ v, to: `${['Wed', 'Thu', 'Wed', 'Thu', 'Fri'][i % 5]} ${hm(7 * 60 + 30 + (i * 47) % 240)}`, notice: i % 3 === 1 ? 'SMS (ES)' : i % 3 === 2 ? 'Email' : 'SMS (EN)' }));
    const lockedSite = (D.clients.find(x => x.type !== 'residential') || { name: D.com.company }).name;
    if (!c.has('agents_v1')) {
      ai = h.card({ title: `Rain-day reshuffle ${h.tag('V1')}`, sub: 'Scheduling agent (A7)', body: `<p class="small t2">The Scheduling agent drafts a rain plan at 5:00 am and quotes its credits before it runs. It is not part of ${esc(c.plan.name)}. The manual tools below (Move day, Slide week) work on every plan.</p><div class="flex">${lockBtn(c, 'See what unlocks it', 'agents_v1')}${h.btn('Slide week', { sm: true, act: 'board-slide' })}</div>` });
    } else if (!rain) {
      ai = h.aiCard({ agent: 'Scheduling agent (A7)', level: 'L2', credits: 15, title: `Rain likely after 1:00 pm: ${atRisk.length} visits at risk`, body: `Playbook <b>Spring rain</b>: split day for mowing (stop at 12:30), push the rest later in the week, keep rounds inside their windows. The run is quoted at <b>15 credits</b> and drafts a change set you review; nothing moves until you apply it.`, why: `Trigger: mowing moves when rain chance is 60% or more in the crew's window (04 §4.9.3). ${h.limit(c, 'agents_v1')}`, actions: h.btn('Run reshuffle (15 cr)', { kind: 'ai', icon: 'spark', ui: 'board.rain', val: 'run' }) + h.btn('Not today', { sm: true, kind: 'ghost', act: 'board-dismiss' }) });
    } else if (rain === 'run') {
      ai = h.card({ tone: 'ai', title: `Proposed rain plan · Tue ${days[1][1]} ${h.tag('V1')}`, sub: 'Drafted by the Scheduling agent (A7, L2) · 15 credits used · expires 12:30 pm', body:
        h.kpis([{ label: 'Visits move', value: moves.length, delta: 'to Wed-Fri' }, { label: 'Drive hours', value: '+1.2 h', delta: 'week total' }, { label: 'Overtime', value: '+0.5 h', delta: 'Thu, one crew', tone: 'warn' }, { label: 'Late vs windows', value: '0', delta: 'no change', tone: 'ok' }])
        + h.table([{ k: 'client', label: 'Client', fmt: (v, r) => `<b>${esc(r.v.client)}</b><div class="tiny t3">${esc(r.v.service)}</div>` }, { k: 'from', label: 'From', fmt: (v, r) => `Tue ${hm(toMin(r.v.start))} · ${esc(r.v.crew)}` }, { k: 'to', label: 'To', fmt: (v, r) => `<b>${r.to}</b> · ${esc(r.v.crew)}` }, { k: 'notice', label: 'Client notice' }], moves, { dense: true })
        + `<div class="cd" style="padding:9px 11px"><b class="small">Needs your decision</b><div class="small t2">${esc(lockedSite)} has a fixed Tuesday window in its contract. Keep it Tuesday and move it to 7:00 am, or move it to Wednesday.</div><div class="flex mt8">${h.btn('Keep Tue 7:00 am', { sm: true, ui: 'board.lockpick', val: 'keep', pressed: RL.ui['board.lockpick'] !== 'move' })}${h.btn('Move to Wed', { sm: true, ui: 'board.lockpick', val: 'move', pressed: RL.ui['board.lockpick'] === 'move' })}</div></div>`
        + `<div class="small t2"><b>Notice preview (EN):</b> "Rain is expected Tuesday afternoon. Your service moves to Wednesday. Reply here with questions. - ${esc(c.t.name)}"</div>`,
        actions: h.btn('Apply all', { kind: 'primary', act: 'board-apply' }) + h.btn('Discard', { kind: 'ghost', ui: 'board.rain', val: '' }) });
    } else {
      ai = h.card({ tone: 'ok', title: 'Rain plan applied', body: `<p class="small">${moves.length} visits moved to Wed-Fri, ${moves.length} client notices queued, crews see updated routes once you publish. Undo is available until the first notice sends.</p><div class="flex">${h.btn('Undo', { sm: true, ui: 'board.rain', val: '' })}</div>` });
    }
  }
  const bl = backlog(c);
  const tray = crewMode ? '' : h.card({ title: `Unassigned backlog`, sub: `${bl.length} cards · ${sum(bl, b => b.hrs).toFixed(1)} crew-hours`, actions: h.btn('Auto-slot all', { sm: true, act: 'board-slotall' }), flush: true, body: h.list(bl.map(b => ({ icon: b.urgent ? 'warn' : 'clipboard', tone: b.urgent ? 'warn' : '', title: `${esc(b.title)} <span class="t3">· ${esc(b.client)}</span>`, sub: `${b.hrs} crew-h · due ${b.due}${b.need ? ' · needs ' + esc(b.need) : ''}`, right: h.btn('Slot', { sm: true, act: 'board-slot' }) }))) });
  const pending = crewMode ? '' : h.card({ title: pub ? 'Published' : 'Draft changes', sub: pub ? 'Crew apps updated; 14 client notices sent' : 'Crews and clients see nothing until you publish', flush: true, body: h.list(changes.map(x => ({ icon: pub ? 'check' : 'pen', tone: pub ? 'ok' : '', title: esc(x) }))) });
  const manual = (crewMode || W) ? '' : h.card({ title: 'Rain day tools', sub: 'Manual, every plan (04 §4.9.3)', body: `<div class="flex">${h.btn('Move day', { sm: true, icon: 'calendar', act: 'board-moveday' })}${h.btn('Slide week', { sm: true, icon: 'arrow-r', act: 'board-slide' })}${h.btn('Notify affected clients', { sm: true, icon: 'chat', act: 'board-notify' })}</div>` });
  const crewNote = crewMode ? h.note(`${esc(c.who)} sees only ${esc(crews[0] ? crews[0].name : 'their crew')} and can reorder today's stops (visit.dispatch = ${esc(c.can('visit.dispatch'))}). Prices are never shown to crews.`) : '';
  const lower = crewMode ? '' : h.cols('2', [stack([ai, pending]), stack([tray, manual])]);
  return h.page({ title: 'Dispatch board', sub, actions }) + toolbar + weatherBar + body + crewNote + lower;
});
RL.act('board-publish', (el, ev, c) => { RL.ui['board.pub'] = '1'; RL.toast('Published: crew apps updated and client notices queued (mock).'); });
RL.act('board-apply', (el, ev, c) => { RL.ui['board.rain'] = 'applied'; RL.ui['board.pub'] = ''; RL.toast('Rain plan applied to the draft. Publish to notify crews and clients.'); });
RL.act('board-optimize', toast('Route optimization queued for all crews: about 6 minutes of drive time saved (mock).'));
RL.act('board-reorder', toast('Stops reordered for today. The office sees the new order (mock).'));
RL.act('board-moveday', toast('Move day: pick a target day; a change set opens for review (mock).'));
RL.act('board-slide', toast('Slide week: each later day moves +1; Saturday absorbs the overflow (mock).'));
RL.act('board-notify', toast('Client notices drafted for the affected visits (mock).'));
RL.act('board-slot', toast('Slotted into Thu on the closest route: +6 min drive (mock).'));
RL.act('board-slotall', toast('Auto-slot placed 5 of 6 cards; 1 needs a dump trailer that is booked (mock).'));
RL.act('board-dismiss', toast('Dismissed. The agent will check the forecast again at 11:00 am.'));

// ---------------------------------------------------------------- Schedule: calendar (estimator appointments)
function appts(c) {
  return memo(c, 'appts', () => {
    const D = c.D, cast = c.t.cast || {};
    const people = [cast.estimator, cast.designer, cast.owner].filter((x, i, a) => x && a.indexOf(x) === i);
    if (!people.length) people.push(c.owner);
    const kinds = c.winter ? ['Spring install consult', 'Design review', 'Snow site walk', 'Renewal meeting', 'Proposal review', 'Commercial bid walk']
      : ['Site visit', 'Design consultation', 'Proposal review', c.mod('irrigation') ? 'Irrigation assessment' : 'Drainage assessment', 'Commercial walkthrough', 'Pre-start walkthrough'];
    const out = [];
    for (let i = 0; i < 14; i++) {
      const o = D.opps[i % D.opps.length], who = people[i % people.length];
      const day = i % 6 === 5 ? (i % 4) : i % 6;
      const start = 8 * 60 + ((i * 97) % 8) * 60 + (i % 2 ? 30 : 0);
      const kind = kinds[(i + (who === cast.designer ? 1 : 0)) % kinds.length];
      out.push({ i, day, start: Math.min(start, 16 * 60), dur: kind === 'Pre-start walkthrough' || kind === 'Proposal review' ? 30 : kind.includes('Commercial') ? 90 : 60, who, kind, client: o.client, clientId: o.clientId, opp: o.id, value: o.value, addr: (D.clients.find(x => x.id === o.clientId) || {}).address || '', crew: kind === 'Pre-start walkthrough' ? (D.crews[0] || {}).name : null });
    }
    // avoid overlaps for the same person on the same day
    out.sort((a, b) => a.day - b.day || a.start - b.start);
    out.forEach((a, k) => { const prev = out.slice(0, k).filter(b => b.day === a.day && b.who === a.who).pop(); if (prev && a.start < prev.start + prev.dur + 30) a.start = Math.min(17 * 60 - a.dur, prev.start + prev.dur + 30); });
    return out;
  });
}
RL.screen('web.calendar', (c) => {
  const D = c.D, days = DAYS(c), cast = c.t.cast || {}, crewMode = isCrew(c);
  let list = appts(c);
  if (crewMode) list = list.filter(a => a.kind === 'Pre-start walkthrough');
  else if (c.role === 'estimator' && !RL.ui['cal.all']) list = list.filter(a => a.who === c.who);
  else if (c.role === 'designer' && !RL.ui['cal.all']) list = list.filter(a => a.who === c.who || a.kind.includes('Design'));
  const ppl = [...new Set(appts(c).map(a => a.who))];
  const colorOf = w => ROUTE_COLORS[(ppl.indexOf(w) + 1) % ROUTE_COLORS.length];
  const sel = list.find(a => String(a.i) === RL.ui['cal.sel']) || list[0];
  const rows = 20, H0 = 8 * 60;
  let grid = `<div style="display:grid;grid-template-columns:48px repeat(6,minmax(0,1fr));grid-template-rows:30px repeat(${rows},24px);border:1px solid var(--border);border-radius:10px;overflow:hidden;background:var(--surface)">`;
  grid += `<div style="grid-row:1;grid-column:1;border-bottom:1px solid var(--border);background:var(--surface-2)"></div>`;
  days.forEach(([d, dt], i) => { grid += `<div style="grid-row:1;grid-column:${i + 2};border-bottom:1px solid var(--border);border-left:1px solid var(--border);background:${i === 1 ? 'var(--primary-soft)' : 'var(--surface-2)'};padding:6px 8px;font-size:.74rem;font-weight:700">${d} <span class="t3">${dt.split(' ')[1]}</span></div>`; });
  for (let r = 0; r < rows; r++) {
    grid += `<div class="tiny t3" style="grid-row:${r + 2};grid-column:1;padding:0 6px;${r % 2 ? '' : 'border-top:1px solid var(--border)'}">${r % 2 ? '' : hm(H0 + r * 30).replace(':00', '')}</div>`;
    for (let d = 0; d < 6; d++) grid += `<div style="grid-row:${r + 2};grid-column:${d + 2};border-left:1px solid var(--border);${r % 2 ? 'border-top:1px dashed color-mix(in srgb,var(--border) 60%,transparent)' : 'border-top:1px solid var(--border)'}"></div>`;
  }
  list.forEach(a => {
    const r0 = Math.max(0, Math.round((a.start - H0) / 30)), span = Math.max(1, Math.round(a.dur / 30));
    const col = colorOf(a.who), on = sel && sel.i === a.i;
    const ell = 'display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
    grid += `<button type="button" data-ui="cal.sel" data-val="${a.i}" title="${esc(`${hm(a.start)} - ${hm(a.start + a.dur)} · ${a.kind} · ${a.client} · ${a.who}`)}" style="grid-row:${r0 + 2} / span ${span};grid-column:${a.day + 2};margin:1px 3px;border-radius:5px;border:1px solid ${col};border-left:3px solid ${col};background:color-mix(in srgb,${col} ${on ? 30 : 13}%,var(--surface));text-align:left;padding:3px 6px;font-size:.68rem;line-height:1.3;overflow:hidden;cursor:pointer;z-index:1;min-width:0"><span style="${ell}"><b>${hm(a.start).replace(' ', '')}</b> ${esc(a.kind)}</span>${span > 1 ? `<span class="t2" style="${ell}">${esc(a.client)}</span>` : ''}</button>`;
  });
  grid += '</div>';
  const legend = `<div class="flex tiny t2">${ppl.map(p => `<span class="flex nw gap4">${dot(colorOf(p))}${esc(p)}</span>`).join('')}${c.role === 'estimator' || c.role === 'designer' ? h.toggle('Show everyone', 'cal.all') : ''}</div>`;
  const detail = sel ? h.card({ title: esc(sel.kind), sub: `${days[sel.day][0]} ${days[sel.day][1]} · ${hm(sel.start)} - ${hm(sel.start + sel.dur)}`, body: h.kv([
    ['Client', crewMode ? esc(sel.client) : h.link(esc(sel.client), 'web.client', sel.clientId)], ['Address', esc(sel.addr)], ['With', esc(sel.who) + (sel.crew ? ' + ' + esc(sel.crew) + ' lead' : '')],
    !crewMode && ['Opportunity', `${esc(sel.opp)} · ${P(c, sel.value)}`], ['Drive', `${rint(sel.opp, 12, 34)} min from previous stop`], ['Reminder', 'Text to client 24 h and 1 h before'],
  ]) + (crewMode ? '' : `<div class="flex">${h.btn('Reschedule', { sm: true, act: 'cal-move' })}${h.btn('Text client', { sm: true, icon: 'chat', act: 'cal-text' })}${h.btn('Start assessment', { sm: true, icon: 'clipboard', go: 'web.assessments' })}</div>`) }) : h.empty('No appointments this week.');
  const slots = crewMode ? '' : h.card({ title: 'Open slots for online booking', sub: 'Shown in the portal and booking page', body: h.list([1, 2, 3, 4].map(k => ({ icon: 'calendar', title: `<span class="nowrap">${days[k][0]} ${days[k][1].split(' ')[1]} · ${hm(9 * 60 + k * 90)}</span>`, sub: `${esc(first(ppl[k % ppl.length]))} · ${['Northwest', 'Central', 'East', 'South'][k - 1]}`, right: h.btn('Hold', { sm: true, act: 'cal-hold' }) }))) });
  const sync = crewMode ? '' : h.card({ title: `Calendar sync ${h.tag('V1')}`, body: `<p class="small t2">Two-way sync with Google or Microsoft 365 keeps personal blocks out of booking slots. Client details never leave Rootline.</p>${h.btn('Connect a calendar', { sm: true, act: 'cal-sync' })}` });
  const count = list.length;
  return h.page({ title: 'Calendar', sub: `Week of ${days[0][1]} · ${count} appointments${c.role === 'estimator' && !RL.ui['cal.all'] ? ' (yours)' : ''}`, actions: crewMode ? '' : h.btn('New appointment', { kind: 'primary', icon: 'plus', act: 'cal-new' }) })
    + legend + grid + (crewMode ? detail : h.cols('3', [detail, slots, sync])) + (crewMode ? h.note('Crew roles see only walkthroughs that include their crew. Deal values are hidden (field class price).') : '');
});
RL.act('cal-new', toast('New appointment: pick a slot, client and type (mock).'));
RL.act('cal-move', toast('Drag the block to a new slot; the client gets a reschedule link (mock).'));
RL.act('cal-text', toast('Text drafted: "See you at the time we set. Reply to reschedule." (mock)'));
RL.act('cal-hold', toast('Slot held for 15 minutes (mock).'));
RL.act('cal-sync', toast('Calendar sync connects in Settings > Integrations (mock).'));

// ---------------------------------------------------------------- Schedule: route map
RL.screen('web.map', (c) => {
  const W = c.winter, crewMode = isCrew(c), crews = crewsInScope(c);
  const ids = new Set(crews.map(x => x.id));
  const all = dayVisits(c).filter(v => ids.has(v.crewId));
  const selId = crewMode ? (crews[0] || {}).id : (RL.ui['map.crew'] || 'all');
  const show = selId === 'all' ? crews : crews.filter(x => x.id === selId);
  const vs = all.filter(v => show.some(x => x.id === v.crewId));
  const live = c.inLens('V1'), allView = show.length > 1;
  // h.map colors routes by index and pins by tone key only, so routes and crew-colored pins are drawn here and injected into its SVG.
  const crewOf = id => show.find(x => x.id === id) || {};
  const own = show.map(cr => { const pts = vs.filter(v => v.crewId === cr.id); return pts.length > 1 ? `<path class="mp-rt" stroke="${cr.color}" d="M${pts.map(v => v.x + ',' + v.y).join(' L')}"/>` : ''; }).join('')
    + (allView ? vs.map(v => `<g class="mp-pin"${v.status === 'Done' ? ' opacity=".5"' : ''}><circle cx="${v.x}" cy="${v.y}" r="9" fill="${crewOf(v.crewId).color || 'var(--primary)'}"/><text x="${v.x}" y="${v.y}">${v.stop}</text><title>${esc(`${v.crew} · ${v.stop}. ${v.client} · ${v.service} · ${v.status}`)}</title></g>`).join('') : '');
  const pins = allView ? [] : vs.map(v => ({ x: v.x, y: v.y, n: v.stop, tone: vTone(v.status), label: `${v.stop}. ${v.client} · ${v.service} · ${v.status}` }));
  const trucks = live ? show.map(cr => { const cur = vs.filter(v => v.crewId === cr.id).find(v => v.status === 'In progress' || v.status === 'En route'); return cur ? { x: cur.x + 9, y: cur.y - 9, n: '▸', tone: 'danger', label: `${cr.name} live position` } : null; }).filter(Boolean) : [];
  const map = h.map({ pins: pins.concat(trucks), h: 260, seed: hs(c.t.id) % 40, label: 'Route map' }).replace(/<g class="mp-pin">/, m => own + m).replace(/<\/svg><\/div>$/, m => (pins.length + trucks.length ? '' : own) + m);
  const tabs = crewMode ? '' : h.tabs('map.crew', [['all', 'All crews', crews.length]].concat(crews.map(cr => [cr.id, esc(cr.name)])), 'all');
  const side = show.map(cr => {
    const mine = vs.filter(v => v.crewId === cr.id), done = mine.filter(v => v.status === 'Done').length, next = mine.find(v => v.status === 'En route' || v.status === 'Scheduled');
    const late = !W && hs(cr.id) % 4 === 1;
    return `<div class="li-i"${show.length > 1 ? ` data-ui="map.crew" data-val="${cr.id}" role="button" tabindex="0" style="cursor:pointer"` : ''}><span style="width:12px;height:30px;border-radius:4px;background:${cr.color};flex:none"></span><div class="grow"><div class="tt">${esc(cr.name)} <span class="t3">· ${esc(cr.lead)}</span></div><div class="ss">${done}/${mine.length} stops${next ? ` · next ${esc(last(next.client))} ETA ${hm(toMin(next.start))}` : ''}</div></div><div class="flex nw">${late ? h.pill('+18 min', 'warn') : h.pill('On time', 'ok')}</div></div>`;
  }).join('');
  const summary = show.length > 1 ? h.table([{ k: 'name', label: 'Route', fmt: (v, r) => `<span class="flex nw gap4">${dot(r.color)}<b>${esc(v)}</b></span>` }, { k: 'n', label: 'Stops', n: true }, { k: 'd', label: 'Done', n: true }, { k: 'drive', label: 'Drive', n: true, fmt: v => v + ' min' }, { k: 'mi', label: 'Miles', n: true }, { k: 'end', label: 'Last stop ends', fmt: v => `<span class="nowrap">${v}</span>` }], show.map(cr => { const m = vs.filter(v => v.crewId === cr.id); const lastV = m[m.length - 1]; return { name: cr.name, color: cr.color, n: m.length, d: m.filter(v => v.status === 'Done').length, drive: m.length * rint(cr.id + 'dr', 7, 12), mi: Math.round(m.length * rint(cr.id + 'mi', 18, 34) / 10), end: lastV ? hm(toMin(lastV.start) + lastV.dur) : '-' }; }), { dense: true }) : '';
  const stops = show.length === 1 ? h.table([{ k: 'stop', label: '#', n: true }, { k: 'client', label: 'Client', fmt: (v, r) => `<b>${esc(v)}</b><div class="tiny t3">${esc(r.address)}</div>` }, { k: 'service', label: 'Service' }, { k: 'start', label: 'ETA', fmt: v => hm(toMin(v)) }, { k: 'status', label: 'Status', fmt: v => st(v) }], vs.filter(v => v.crewId === show[0].id), { go: 'web.visit', dense: true }) : '';
  const opt = crewMode ? h.btn('Reorder my stops', { icon: 'route', act: 'map-opt1' }) : (c.has('route_vrp') ? h.btn('Optimize all routes', { icon: 'route', act: 'map-optall' }) : lockBtn(c, 'Optimize all routes', 'route_vrp')) + (show.length === 1 ? h.btn('Optimize this route', { icon: 'route', act: 'map-opt1' }) : '');
  const alerts = W ? [{ icon: 'snow', tone: 'info', title: 'P1 sites open by 7:00 am', sub: 'Medical and retail first; 3 of 5 done' }, { icon: 'warn', tone: 'warn', title: 'Refreeze risk after 4 pm', sub: 'Salt re-application suggested at P1 sites' }]
    : [{ icon: 'warn', tone: 'warn', title: `${crews[1] ? esc(crews[1].name) : 'Crew 2'} running 18 min behind`, sub: 'Window at 11:00-12:00 still OK' }, { icon: 'rain', tone: 'info', title: 'Rain band from 1:00 pm', sub: 'Afternoon stops at risk; see Dispatch board' }];
  return h.page({ title: 'Route map', sub: `${c.today.label} · ${vs.length} stops · ${show.length} ${show.length === 1 ? 'route' : 'routes'}`, actions: opt })
    + `<div class="flex" style="justify-content:space-between">${tabs}${branchCtl(c)}</div>`
    + h.cols('21', [stack([map, `<div class="flex tiny t3">${allView ? show.map(cr => `<span class="flex nw gap4">${dot(cr.color)}${esc(cr.name)}</span>`).join('') + '<span>Faded pins: done</span>' : [['done', 'Done', 'var(--stone-450)'], ['ok', 'On site', 'var(--ok-solid)'], ['info', 'Driving to', 'var(--info-solid)'], ['accent', 'Scheduled', 'var(--accent)']].map(([k, l, col]) => `<span class="flex nw gap4">${dot(col)}${l}</span>`).join('')}${live ? `<span class="flex nw gap4">${dot('var(--danger-solid)')}Live crew position ${h.tag('V1')}</span>` : '<span>Live GPS arrives in V1; planned routes shown.</span>'}</div>`, summary, stops]),
      stack([h.card({ title: 'Crews', sub: live ? 'Live ETAs from crew phones (V1)' : 'Planned order', flush: true, body: side || h.empty('No crews in scope.') }), crewMode ? '' : h.card({ title: 'Alerts', flush: true, body: h.list(alerts) })])])
    + (crewMode ? h.note('Crew roles see their own route only. Gate codes appear in the crew app inside the visit window.') : '');
});
RL.act('map-optall', toast('Multi-crew optimization: 41 min of drive saved, 2 stops swapped between crews. Review before publishing (mock).'));
RL.act('map-opt1', toast('Route reordered: 9 min of drive saved (mock).'));

// ---------------------------------------------------------------- Schedule: capacity planner (V1)
function pools(c) {
  const m = c.mod, out = [];
  out.push(['Mowing', c.D.crews.filter(x => x.type === 'maintenance').length || 1]);
  if (m('lawn_programs')) out.push(['Lawn applications', c.D.crews.filter(x => x.type === 'lawn').length || 1]);
  out.push(['Enhancements and cleanups', 1]);
  if (m('irrigation')) out.push(['Irrigation', c.D.crews.filter(x => x.type === 'irrigation').length || 1]);
  if (m('design_build') || m('hardscape')) out.push(['Install', c.D.crews.filter(x => x.type === 'install').length || 1]);
  if (m('snow_lite')) out.push(['Snow (events)', 0]);
  return out;
}
const mix = x => { x = (x ^ (x >>> 16)) >>> 0; x = Math.imul(x, 0x45d9f3b) >>> 0; x = (x ^ (x >>> 16)) >>> 0; x = Math.imul(x, 0x45d9f3b) >>> 0; return (x ^ (x >>> 16)) >>> 0; };
RL.screen('web.capacity', (c) => {
  const W = c.winter, start = W ? 2 : 19, weeks = Array.from({ length: 12 }, (_, i) => start + i);
  const pl = pools(c).filter(p => W || p[0] !== 'Snow (events)'), unit = RL.ui['cap.unit'] || 'pct';
  const util = (p, w) => {
    if (p === 'Snow (events)') return W && w < 14 ? -1 : null;
    if (W && w < 12) return p === 'Install' ? 30 + (w * 7) % 25 : p === 'Enhancements and cleanups' ? 15 + w * 3 : null;
    const base = { Mowing: 92, 'Lawn applications': 86, 'Enhancements and cleanups': 104, Irrigation: 74, Install: 97 }[p] || 80;
    return Math.max(20, base + ((mix(hs(p + w)) % 25) - 12) + (p === 'Enhancements and cleanups' && w >= 20 && w <= 22 ? 20 : 0));
  };
  const color = v => v < 75 ? 'var(--info-bg)' : v < 90 ? 'var(--ok-bg)' : v <= 100 ? 'var(--warn-bg)' : v <= 110 ? 'color-mix(in srgb,var(--warn-solid) 45%,var(--surface))' : 'var(--danger-bg)';
  const tcolor = v => v > 110 ? 'var(--danger-text)' : v > 90 ? 'var(--warn-text)' : v < 75 ? 'var(--info-text)' : 'var(--ok-text)';
  const selKey = RL.ui['cap.sel'] || `Enhancements and cleanups|${W ? 10 : 21}`;
  const [sp, sw] = selKey.split('|');
  const hrsAvail = p => 40 * 4 * Math.max(1, (pl.find(x => x[0] === p) || [p, 1])[1]) * (c.D.crews.length > 4 ? 2 : 1);
  const head = `<tr><th>Pool</th>${weeks.map(w => `<th class="n">W${w}</th>`).join('')}</tr>`;
  const body = pl.map(([p]) => `<tr><td class="nowrap"><b>${esc(p)}</b></td>${weeks.map(w => { const v = util(p, w); if (v == null) return '<td class="n t3">-</td>'; if (v === -1) return `<td class="n">${h.pill('on', 'info')}</td>`; const on = sp === p && String(w) === sw; const label = unit === 'pct' ? v + '%' : Math.round(hrsAvail(p) * v / 100); return `<td class="n" style="padding:3px"><button type="button" data-ui="cap.sel" data-val="${esc(p + '|' + w)}" style="width:100%;border:${on ? '2px solid var(--text)' : '1px solid transparent'};border-radius:5px;background:${color(v)};color:${tcolor(v)};font-weight:700;font-size:.72rem;padding:3px 2px;cursor:pointer">${label}</button></td>`; }).join('')}</tr>`).join('');
  const heat = `<div class="tb-wrap"><table class="tb dense">${'<thead>' + head + '</thead>'}<tbody>${body}</tbody></table></div>`;
  const sv = util(sp, Number(sw)) || 100, avail = hrsAvail(sp), need = Math.round(avail * sv / 100);
  const parts = [['Recurring', Math.round(need * .35)], ['Seasonal (mulch, cleanups)', Math.round(need * .42)], ['Backlog', Math.round(need * .13)]];
  parts.push(['Pipeline (weighted)', need - sum(parts, x => x[1])]);
  const levers = [['Add Saturday shift', -18, 6840], ['Sub out 30 mulch jobs', -12, 9900], ['Hire 2 seasonals', -25, 11200], ['Push 20 jobs two weeks later', -9, 0]];
  const sold = weeks.slice(0, 8).map(w => Math.round(sum(pl.filter(p => p[0] !== 'Snow (events)'), ([p]) => { const v = util(p, w); return v > 0 ? hrsAvail(p) * v / 100 : 0; })));
  const crewH = weeks.slice(0, 8).map(w => sum(pl.filter(p => p[0] !== 'Snow (events)'), ([p]) => util(p, w) > 0 ? hrsAvail(p) : 0));
  const chart = h.colchart(weeks.slice(0, 8).map(w => 'W' + w), [{ values: sold, cls: 'c1' }, { values: crewH, cls: 'c4' }], { label: 'Sold hours vs crew hours', h: 150 });
  const over = sum(pl.filter(p => p[0] !== 'Snow (events)'), ([p]) => weeks.slice(0, 8).filter(w => util(p, w) > 100).length);
  const byCrew = crewsInScope(c).map(cr => { const cap = (c.winter ? 8 : cr.type === 'install' ? 9 : 9.5) * 5; const booked = Math.round(cap * (0.8 + (mix(hs(cr.id + 'wk' + c.season)) % 32) / 100)); return { label: `${dot(cr.color)} ${esc(cr.name)}`, value: booked, max: cap, tone: booked > cap ? 'danger' : booked > cap * .9 ? 'warn' : '', right: `${booked} / ${cap} h` }; });
  return h.page({ title: `Capacity planner ${h.tag('V1')}`, sub: `${W ? '2027 season build' : 'Next 12 weeks'} · sold hours vs crew hours by pool`, actions: `<span class="flex nw gap4 tiny t2">Units ${h.btn('%', { sm: true, ui: 'cap.unit', val: 'pct', pressed: unit === 'pct' })}${h.btn('Crew-hours', { sm: true, ui: 'cap.unit', val: 'hrs', pressed: unit === 'hrs' })}</span>${branchCtl(c)}` })
    + h.kpis([{ label: 'Pool-weeks over 100%', value: over, delta: 'next 8 weeks, all pools', tone: over ? 'warn' : 'ok' }, { label: 'Sold hours, next 8 weeks', value: num(sum(sold)) }, { label: 'Crew hours available', value: num(sum(crewH)) }, { label: 'Backlog', value: `${c.D.kpi.backlogWeeks} wk`, delta: 'sold, not scheduled' }])
    + h.card({ title: 'Season heatmap', sub: 'Click a cell to see what fills it. Bands: under 75% blue, 75-90% green, 90-100% amber, over 100% orange and red.', body: heat })
    + h.cols('2', [h.card({ title: `${esc(sp)} · W${sw}: ${sv}%`, sub: `${num(need)} h needed vs ${num(avail)} h available`, body: h.bars(parts.map(([l, v]) => ({ label: l, value: v, right: num(v) + ' h' })), { max: need }) + `<b class="small">Levers</b>` + h.list(levers.map(([l, d, cost]) => ({ icon: 'sliders', title: esc(l), sub: `${d} pts · labor ${h.mask(c, 'cost', cost ? money(cost) : '$0')}`, right: h.btn('Try in scenario', { sm: true, act: 'cap-scn' }) }))) }),
      stack([h.card({ title: 'Sold hours vs crew hours', sub: 'Green: sold; clay: crew hours available', body: chart }), h.card({ title: 'By crew, this week', sub: 'Booked hours vs crew hours (5 days)', body: byCrew.length ? h.bars(byCrew) : h.empty('No crews yet. Add a crew in Settings > Crews.') })])]);
});
RL.act('cap-scn', toast('Scenario created from the live plan; nothing changes until you promote it (mock).'));

// ---------------------------------------------------------------- Schedule: recurring programs (04 §4.2, 14 §4.1)
RL.screen('web.programs', (c) => {
  const D = c.D, W = c.winter, lawn = c.mod('lawn_programs'), irr = c.mod('irrigation'), snow = c.mod('snow_lite');
  const tabsL = [['mow', 'Mowing rounds']].concat(lawn ? [['lawn', '5-step lawn program']] : []).concat(irr ? [['irr', 'Irrigation seasons']] : []).concat(snow ? [['snow', 'Snow events']] : []);
  let tab = h.tab('prog.tab', W && snow ? 'snow' : 'mow');
  if (!tabsL.some(t => t[0] === tab)) tab = tabsL[0][0];
  const crewMode = isCrew(c), clients = c.t.clients;
  let body = '';
  if (tab === 'mow') {
    const routeDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => { const props = Math.round(clients * .55 / 5) + (hs(d + c.t.id) % 9) - 4; const cr = D.crews.filter(x => x.type === 'maintenance')[i % Math.max(1, D.crews.filter(x => x.type === 'maintenance').length)] || D.crews[0] || { name: '-' }; return { d, props, crew: cr.name, weekly: Math.round(props * .78), bi: props - Math.round(props * .78), done: W ? 32 : 5, skips: W ? 3 : 0, rev: props * 52 }; });
    body = h.kpis([{ label: 'Properties on mowing', value: num(sum(routeDays, r => r.props)) }, { label: 'Season', value: 'Apr 5 - Nov 20', delta: '33 weeks' }, { label: W ? 'Renewed for 2027' : 'Visits this week', value: W ? '78%' : num(sum(routeDays, r => r.props)), delta: W ? 'renewals open until Mar 31' : 'week 6 of 33' }, { label: 'Skips credited', value: W ? '214' : '0', delta: W ? 'drought + rain, 2026' : 'season to date' }])
      + h.table([{ k: 'd', label: 'Route day' }, { k: 'crew', label: 'Crew' }, { k: 'props', label: 'Properties', n: true }, { k: 'weekly', label: 'Weekly', n: true }, { k: 'bi', label: 'Biweekly', n: true }, { k: 'done', label: 'Rounds done', n: true, fmt: v => `${v} / 33` }, { k: 'skips', label: 'Skips', n: true }, { k: 'rev', label: 'Revenue / round', n: true, fmt: v => P(c, v) }], routeDays, { dense: true, foot: ['Total', '', num(sum(routeDays, r => r.props)), num(sum(routeDays, r => r.weekly)), num(sum(routeDays, r => r.bi)), '', '', P(c, sum(routeDays, r => r.rev))] })
      + h.cols('2', [h.card({ title: 'Generation rules', body: h.kv([['Frequency', 'Weekly (default), biweekly by request'], ['Generated', 'Rolling 6 weeks ahead; edits never touch locked visits'], ['Holidays', 'Memorial Day: slide week +1, Saturday absorbs'], ['Billing', 'Level billing (8 installments) or per visit, from the agreement']]) }),
        h.card({ title: `Growth-adaptive mowing ${h.tag('V1')}`, body: `<p class="small t2">In slow-growth weeks (mid-summer heat, drought) weekly clients who opted in drop to every other week. Skips credit the client and free up crew hours.</p>${h.toggle('Use growth potential to suggest skips', 'prog.gp', false)}` })]);
  } else if (tab === 'lawn') {
    const R = [['R1', 'Pre-emergent + fertilizer', 'Mar 15 - Apr 30', 100], ['R2', 'Fertilizer + crabgrass', 'May 1 - Jun 10', W ? 100 : 42], ['R3', 'Broadleaf weed control', 'Jun 11 - Jul 31', W ? 100 : 0], ['R4', 'Grub preventive + fertilizer', 'Aug 1 - Sep 15', W ? 98 : 0], ['R5', 'Winterizer', 'Oct 15 - Nov 30', W ? 97 : 0]];
    const enrolled = Math.round(clients * .62);
    body = h.kpis([{ label: 'Enrolled lawns', value: num(enrolled) }, { label: 'Current round', value: W ? 'Season closed' : 'R2', delta: W ? '2027 renewals open' : 'window closes Jun 10' }, { label: 'Applications this week', value: W ? '0' : num(Math.round(enrolled * .11)) }, { label: 'GDD base 50 °F', value: W ? '-' : '312', delta: W ? '' : 'crabgrass germination window', tone: 'info' }])
      + h.table([{ k: 0, label: 'Round' }, { k: 1, label: 'Treatment' }, { k: 2, label: 'Window' }, { k: 3, label: 'Progress', fmt: v => `<div style="min-width:140px">${h.progress(v, 100, v === 100 ? '' : 'info')}</div>` }, { k: 3, label: 'Done', n: true, fmt: v => `${Math.round(enrolled * v / 100)} / ${enrolled}` }, { k: 0, label: 'Status', fmt: (v, r) => r[3] >= 97 ? st('Complete') : r[3] > 0 ? st('In progress') : st('Scheduled') }], R.map(r => Object.assign([], r)), { dense: true })
      + h.cols('2', [h.card({ title: 'Guardrails on every application', sub: '14 §4.1', body: h.list([{ icon: 'wind', tone: 'info', title: 'Spray window', sub: 'Label wind limit, rainfast interval and temperature checked per visit' }, { icon: 'shield', tone: 'ok', title: 'Licensed applicator required', sub: 'Visits route only to crews with a current applicator license' }, { icon: 'bell', title: 'Pre-notification registry', sub: 'Neighbors on the registry get a notice before application' }]) }),
        h.aiCard({ agent: 'Chemical Compliance (A16)', level: 'L1', credits: 1, title: 'Record check after each application', body: 'Checks product, EPA reg. no., rate, area, wind and re-entry interval for completeness before the record locks.', why: 'Blocking warnings only; a person fixes the record. ' + h.tag('V1') })]);
  } else if (tab === 'irr') {
    const n = Math.round(clients * .4);
    body = h.table([{ k: 0, label: 'Program' }, { k: 1, label: 'Window' }, { k: 2, label: 'Properties', n: true }, { k: 3, label: 'Done', n: true }, { k: 4, label: 'Status', fmt: v => st(v) }], [['Spring start-up', 'Apr 1 - May 15', n, W ? n : Math.round(n * .82), W ? 'Complete' : 'In progress'], ['Mid-season check', 'Jul 1 - Aug 15', Math.round(n * .45), W ? Math.round(n * .45) : 0, W ? 'Complete' : 'Scheduled'], ['Backflow test', 'May 1 - Jun 30', Math.round(n * .7), W ? Math.round(n * .7) : Math.round(n * .2), W ? 'Complete' : 'In progress'], ['Winterization', 'Oct 1 - Nov 15 (hard freeze first)', n, W ? n : 0, W ? 'Complete' : 'Scheduled']].map(r => Object.assign([], r)), { dense: true })
      + h.note('Winterizations are prioritized by the hard-freeze forecast (28 °F or below), not moved by rain.');
  } else {
    const sites = snowSites(c);
    const events = [['Jan 12', 'Overnight snow', '4.5 in', W ? 'Active' : 'Closed', sites.length, W ? 9 : sites.length], ['Jan 6', 'Light snow', '2.1 in', 'Closed', sites.filter(s => s.com).length, sites.filter(s => s.com).length], ['Dec 28', 'Ice and sleet', '0.3 in ice', 'Closed', sites.filter(s => s.priority === 1).length, sites.filter(s => s.priority === 1).length], ['Dec 19', 'Lake-effect', '3.2 in', 'Closed', sites.length, sites.length]];
    body = h.kpis([{ label: 'Snow sites', value: sites.length, delta: `${sites.filter(s => s.priority === 1).length} priority 1` }, { label: 'Storms this season', value: W ? 4 : 14 }, { label: 'Pushes logged', value: W ? 61 : 212 }, { label: 'Billing', value: 'Per push + seasonal', delta: 'from storm logs' }])
      + h.table([{ k: 0, label: 'Date' }, { k: 1, label: 'Storm' }, { k: 2, label: 'Accumulation' }, { k: 3, label: 'Status', fmt: v => v === 'Active' ? h.pill('Active', 'info', 'snow') : st('Complete') }, { k: 4, label: 'Sites', n: true }, { k: 5, label: 'Serviced', n: true }], events.map(r => Object.assign([], r)), { dense: true })
      + `<div class="flex">${h.btn('Open Snow & Ice', { icon: 'snow', go: 'web.snow' })}${c.mod('snow_ice') ? h.pill('Storm events and triggers: Snow & Ice add-on', 'ok') : h.pill('Snow Lite: storm visits per site, no triggers', '')}</div>`;
  }
  return h.page({ title: 'Recurring programs', sub: `${esc(c.t.name)} · ${W ? 'January: planning 2027 and running snow' : 'Week 6 of the mowing season'}`, actions: crewMode ? '' : h.btn('New program', { icon: 'plus', act: 'prog-new' }) })
    + h.tabs('prog.tab', tabsL, W && snow ? 'snow' : 'mow') + body + (lawn ? '' : h.note('Lawn programs (5-step rounds) appear when the lawn_programs service line is on (Settings > Service lines).'));
});
RL.act('prog-new', toast('New program: pick a service, window, frequency and the agreement it bills from (mock).'));

// ---------------------------------------------------------------- Schedule: weather center (V1)
RL.screen('web.weather', (c) => {
  const W = c.winter, days = DAYS(c), wx = WX(c), snowFull = c.mod('snow_ice');
  const strip = `<div style="display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px">${days.map(([d, dt], i) => `<div class="kp" style="${i === 1 ? 'border-color:var(--primary)' : ''}"><span class="l">${d} ${dt}</span><span class="flex nw gap4">${icon(wx[i][0] === 'cloud' ? 'sun' : wx[i][0])}<b class="num">${wx[i][2]}°F</b></span><span class="tiny t2">${esc(wx[i][1])}</span><span class="tiny ${wx[i][3] >= 60 ? '' : 't3'}" style="${wx[i][3] >= 60 ? 'color:var(--info-text);font-weight:700' : ''}">${W ? 'Snow' : 'Rain'} ${wx[i][3]}%</span></div>`).join('')}</div>`;
  const trig = W ? [
    ['Snow, lots', 'Accumulation reaches 2 in', '4.5 in observed', 'Triggered', snowFull ? 'Event sites dispatched' : 'Storm visits created for P1-P3 sites'],
    ['Snow, walks', 'Any accumulation (0.5 in)', '4.5 in', 'Triggered', 'Walk crews out at 3:00 am'],
    ['Refreeze', 'Low under 28 °F after melt', '16 °F tonight', 'Triggered', 'Salt re-application at P1 sites'],
    ['Freezing rain', 'Ice accretion over 0.1 in', 'Thu 30%', 'Watch', 'Pre-treat with brine Wed pm'],
  ] : [
    ['Mowing', 'Rain 60% or more in the crew window, or 0.25 in', 'Tue pm 80%, 0.6 in', 'Triggered', 'Split day, push later in week'],
    ['Fertilizer and herbicide', 'Spray window: label wind, rainfast, temperature', 'Wind 14 mph Thu', 'Watch', 'Move Thu am applications to Wed'],
    ['Hardscape: polymeric sand', 'Rain inside the cure window', 'Tue pm', 'Triggered', 'Hold sand on J-1042 until Wed'],
    ['Aeration and overseeding', 'Over 1 in in 24 h (saturated soil)', '0.6 in', 'OK', 'No change'],
    ['Irrigation start-ups', 'Hard freeze 28 °F or below', 'Low 48 °F', 'OK', 'No change'],
  ];
  const playbooks = [['Spring rain', 'Mowing, cleanups', 'split_day then push_later_in_week', 'Review before apply'], ['Washout day', 'All routes', 'slide_day, Saturday absorbs', 'Review before apply'], ['Late-season mowing', 'Mowing after Oct 15', 'skip_no_makeup', 'Auto-apply, notify'], ['Spray window', 'Lawn applications', 'next_valid_window', 'Review before apply']];
  const snowCard = W ? (snowFull ? h.card({ title: `Storm event SE-2027-04 ${h.tag('V1')}`, sub: 'Created from the forecast watch at 8:00 pm Mon', body: h.kv([['Status', h.pill('Active', 'info', 'snow')], ['Started', '1:40 am (observed, station of record)'], ['Accumulation', '4.5 in so far; ends about 7:00 am'], ['Merge window', '6 h: a new start before 1:00 pm is the same event'], ['Sites triggered', `${snowSites(c).length} of ${snowSites(c).length}`]]) + h.btn('Open Storm Command Center', { kind: 'primary', icon: 'snow', go: 'web.snow' }) })
    : h.card({ title: 'Snow triggers', sub: 'Snow Lite: you create storm visits by hand', body: `<p class="small t2">Snow Lite has no weather feeds or automatic triggers. Create storm visits for your priority sites in order, then log pushes in the crew app.</p><div class="flex">${h.btn('Create storm visits (P1 first)', { kind: 'primary', icon: 'snow', act: 'wx-storm' })}${c.role === 'owner' ? lockBtn(c, 'Forecast triggers', 'snow_ice') : ''}</div>` })) : '';
  const a7 = c.has('agents_v1') ? h.aiCard({ agent: 'Scheduling agent (A7)', level: 'L2', credits: 15, title: W ? 'Tomorrow: freezing rain 30%, Thu' : 'Rain plan ready for Tuesday', body: W ? 'Watching Thursday. If ice accretion passes 0.1 in, the agent drafts a brine pre-treat route for P1 sites and quotes the credits before it runs.' : 'The agent drafted a rain plan for Tuesday afternoon. Open the dispatch board to review the change set.', actions: W ? h.btn('Draft pre-treat route (15 cr)', { kind: 'ai', act: 'wx-a7' }) : h.btn('Review on dispatch board', { kind: 'ai', go: 'web.board' }) }) : h.card({ title: 'Scheduling agent (A7)', body: `<p class="small t2">Agent-drafted rain plans are not part of ${esc(c.plan.name)}.</p>${lockBtn(c, 'See what unlocks it', 'agents_v1')}` });
  return h.page({ title: `Weather center ${h.tag('V1')}`, sub: `${esc(c.t.city)} · forecasts per service area, refreshed hourly · ${c.today.label}`, actions: h.btn('Edit playbooks', { icon: 'sliders', act: 'wx-edit' }) })
    + strip
    + h.card({ title: W ? 'Snow and ice triggers' : 'Rain-day and spray triggers', sub: 'Defaults per service line; Company-tunable (04 §4.9.3)', body: h.table([{ k: 0, label: 'Service' }, { k: 1, label: 'Moves or triggers when' }, { k: 2, label: 'Forecast' }, { k: 3, label: 'State', fmt: v => v === 'OK' ? h.pill('OK', 'ok') : v === 'Watch' ? h.pill('Watch', 'warn') : h.pill('Triggered', 'info') }, { k: 4, label: 'Playbook action' }], trig.map(r => Object.assign([], r)), { dense: true }) })
    + h.card({ title: 'Playbooks', sub: 'What happens when a trigger fires', flush: true, body: h.table([{ k: 0, label: 'Playbook', fmt: v => `<b class="nowrap">${esc(v)}</b>` }, { k: 1, label: 'Scope' }, { k: 2, label: 'Strategy', fmt: v => `<span class="mono tiny">${esc(v)}</span>` }, { k: 3, label: 'Approval', fmt: v => /Auto/.test(v) ? h.pill(esc(v), 'info') : esc(v) }], playbooks.map(r => Object.assign([], r)), { dense: true }) })
    + h.cols(snowCard ? '3' : '2', [snowCard, a7, h.card({ title: 'Weather evidence', body: `<p class="small t2">Every visit stores a weather snapshot at start and finish. Snapshots back skip credits, chemical records and snow billing.</p>${h.kv([['Provider', 'National Weather Service + commercial nowcast'], ['Grid', 'Per service-area cell, hourly'], ['Station of record', /Toledo/.test(c.t.city) ? 'KTOL (Toledo Express airport)' : /OH/.test(c.t.city) ? 'KCMH (Columbus airport)' : 'Nearest NWS airport station']])}` })].filter(Boolean));
});
RL.act('wx-edit', toast('Playbook editor: trigger, scope, strategy, notices and approval mode (mock).'));
RL.act('wx-storm', toast('Storm visits created for priority 1 sites, in site order (mock).'));
RL.act('wx-a7', toast('Quoted 15 credits. Draft pre-treat route queued for review (mock).'));

// ---------------------------------------------------------------- Jobs: all jobs
// data.js draws hours used independently of the phase; derive hours from phase progress so hours, phase and percent complete agree.
function jobsX(c) { return memo(c, 'jobsx', () => c.D.jobs.map(j => { const x = Object.assign({}, j, { _r: j.actualHrs / j.budgetHrs }); x.actualHrs = sum(jobPhases(x), p => p.a); return x; })); }
const jobsInScope = c => {
  let jobs = jobsX(c).slice();
  if (isCrew(c)) { const cr = myCrew(c); jobs = jobs.filter(j => cr && j.crew === cr.name); }
  const b = branchOf(c);
  if (b !== 'all' && !isCrew(c)) { const names = new Set(c.D.crews.filter(x => x.branch === b).map(x => x.name)); jobs = jobs.filter(j => names.has(j.crew)); }
  return jobs;
};
const jMargin = j => Math.round(100 * (j.value - j.cost) / j.value);
// data.js draws phases from one list for every job type; show a phase that fits the type.
const dPhase = j => j.status === 'Scheduled' ? 'Not started' : ({ Maintenance: 'Recurring visits', 'Lawn program': 'Round 2 of 5', Irrigation: 'Service visit', Snow: 'Seasonal', Lighting: j.phase === 'Recurring' ? 'Install' : j.phase })[j.type] || (j.phase === 'Recurring' ? 'Install' : j.phase);
const burn = j => {
  const p = j.actualHrs / j.budgetHrs, tone = p > 1 ? 'danger' : p > .9 ? 'warn' : '';
  return `<div style="min-width:120px"><div class="flex nw tiny" style="justify-content:space-between"><span class="num">${j.actualHrs} / ${j.budgetHrs} h</span><span class="num ${tone ? '' : 't3'}" style="${tone === 'danger' ? 'color:var(--danger-text);font-weight:700' : ''}">${Math.round(p * 100)}%</span></div>${h.progress(j.actualHrs, j.budgetHrs, tone)}</div>`;
};
RL.screen('web.jobs', (c) => {
  const crewMode = isCrew(c), jobs = jobsInScope(c), f = h.tab('jobs.f', 'all');
  const cnt = s => jobs.filter(j => j.status === s).length;
  const rows = f === 'all' ? jobs : jobs.filter(j => j.status === f);
  const open = jobs.filter(j => j.status !== 'Complete'), over = jobs.filter(j => j.actualHrs > j.budgetHrs);
  const cols = [
    { k: 'id', label: 'Job', m: true },
    { k: 'title', label: 'Job and client', fmt: (v, r) => `<b>${esc(v)}</b><div class="tiny t3">${esc(r.client)}</div>` },
    { k: 'type', label: 'Type' },
    { k: 'status', label: 'Status', fmt: v => st(v) },
    { k: 'phase', label: 'Phase', fmt: (v, r) => esc(dPhase(r)) },
    { k: 'crew', label: 'Crew' },
    { k: 'actualHrs', label: 'Hours vs budget', fmt: (v, r) => burn(r) },
  ];
  if (!crewMode) cols.push({ k: 'value', label: 'Price', n: true, fmt: v => P(c, v) }, { k: 'cost', label: 'Margin', n: true, fmt: (v, r) => Mg(c, jMargin(r) + '%') });
  const k = crewMode ? [{ label: 'Jobs on your crew', value: jobs.length }, { label: 'In progress', value: cnt('In progress') }, { label: 'Hours used', value: num(sum(jobs, j => j.actualHrs)) + ' h', delta: `of ${num(sum(jobs, j => j.budgetHrs))} h budget` }]
    : [{ label: 'Open jobs', value: open.length, delta: `${cnt('In progress')} in progress` }, { label: 'Over hours budget', value: over.length, tone: over.length ? 'warn' : 'ok', delta: over.length ? 'review job costs' : 'all inside budget' }, { label: 'Open contract value', value: P(c, sum(open, j => j.value)) }, { label: 'Average margin', value: Mg(c, Math.round(sum(jobs, jMargin) / Math.max(1, jobs.length)) + '%'), delta: c.sees('margin') ? 'sold, before overhead' : '' }];
  return h.page({ title: 'All jobs', sub: `${jobs.length} jobs and work orders${branchOf(c) !== 'all' ? ' · ' + esc(branchOf(c)) + ' branch' : ''}${crewMode ? ' · ' + esc(myCrew(c) ? myCrew(c).name : '') : ''}`, actions: (c.can('job').includes('W') ? h.btn('New job', { kind: 'primary', icon: 'plus', act: 'job-new' }) : '') + branchCtl(c) })
    + h.kpis(k)
    + h.tabs('jobs.f', [['all', 'All', jobs.length], ['In progress', 'In progress', cnt('In progress')], ['Scheduled', 'Scheduled', cnt('Scheduled')], ['On hold', 'On hold', cnt('On hold')], ['Complete', 'Complete', cnt('Complete')]], 'all')
    + h.table(cols, rows, { go: 'web.job', hl: r => r.actualHrs > r.budgetHrs, empty: 'No jobs match this filter.' })
    + (crewMode ? h.note('Crew roles see hours only: price, cost and margin are hidden (02 §10.2).') : c.sees('margin') ? '' : h.note(`Margin is hidden for ${esc(c.as.label)} by default (field class margin).`));
});
RL.act('job-new', toast('New job: from a signed proposal, an agreement or a blank work order (mock).'));

// ---------------------------------------------------------------- Jobs: projects (V1)
const PHASES = ['Layout and 811', 'Excavation', 'Base', 'Install', 'Planting', 'Punch list'];
const phaseIdx = j => Math.max(0, ['Layout', 'Excavation', 'Base', 'Install', 'Planting', 'Punch list'].indexOf(j.phase));
RL.screen('web.projects', (c) => {
  const W = c.winter, view = h.tab('proj.view', 'gantt');
  const projs = jobsInScope(c).filter(j => ['Install', 'Design'].includes(j.type)).slice(0, 7);
  if (!projs.length) return h.page({ title: `Projects ${h.tag('V1')}`, sub: 'Gantt and phase board for multi-day installs' }) + h.empty(`No multi-day projects at ${esc(c.t.name)}. Projects appear when the Company sells installs (hardscape, design-build, irrigation or lighting). Recurring maintenance lives in Recurring programs.`) + `<div class="flex" style="justify-content:center">${h.btn('Open recurring programs', { go: 'web.programs' })}</div>`;
  const weeks = W ? ['Mar 1', 'Mar 8', 'Mar 15', 'Mar 22', 'Mar 29', 'Apr 5', 'Apr 12', 'Apr 19'] : ['May 3', 'May 10', 'May 17', 'May 24', 'May 31', 'Jun 7', 'Jun 14', 'Jun 21'];
  const span = 56, today = W ? -1 : 8;
  const durs = j => { const t = j.budgetHrs; const base = [2, 3, 2, 6, 3, 1]; const k = Math.max(.6, Math.min(2.2, t / 120)); return base.map(d => Math.max(1, Math.round(d * k))); };
  const tones = ['var(--sky-500)', 'var(--clay-500)', 'var(--stone-450)', 'var(--primary)', 'var(--moss-400)', 'var(--marigold-600)'];
  const gantt = () => {
    const head = `<div style="display:grid;grid-template-columns:220px minmax(0,1fr);border-bottom:1px solid var(--border);background:var(--surface-2)"><div class="tiny t3" style="padding:6px 10px">Project</div><div style="display:grid;grid-template-columns:repeat(8,minmax(0,1fr))">${weeks.map(w => `<span class="tiny t3" style="padding:6px 6px;border-left:1px solid var(--border)">${w}</span>`).join('')}</div></div>`;
    const rows = projs.map((j, i) => {
      const ds = durs(j), startDay = W ? 7 + i * 4 : [0, 3, 6, 8, 10, 14, 17][i % 7] + (hs(j.id) % 3);
      let d0 = startDay; const segs = ds.map((d, k) => { const s = d0; d0 += d + (k === 2 ? 1 : 0); return { s, d, k }; });
      const cur = W ? -1 : phaseIdx(j);
      const bars = segs.map(sg => `<span title="${esc(PHASES[sg.k])}: ${sg.d} days" style="position:absolute;top:12px;height:16px;left:${(sg.s / span * 100).toFixed(2)}%;width:calc(${(sg.d / span * 100).toFixed(2)}% - 2px);background:${tones[sg.k]};opacity:${sg.k < cur || j.status === 'Complete' ? .45 : 1};border-radius:4px;${sg.k === cur && j.status !== 'Complete' ? 'outline:2px solid var(--text);outline-offset:1px' : ''}"></span>`).join('');
      const ms = `<span title="811 locate cleared" style="position:absolute;top:13px;left:calc(${(startDay / span * 100).toFixed(2)}% - 7px);width:10px;height:10px;transform:rotate(45deg);background:var(--warn-solid);border:1px solid var(--surface)"></span><span title="Materials delivered" style="position:absolute;top:13px;left:calc(${(segs[3].s / span * 100).toFixed(2)}% - 6px);width:10px;height:10px;transform:rotate(45deg);background:var(--info-solid);border:1px solid var(--surface)"></span>`;
      return `<div style="display:grid;grid-template-columns:220px minmax(0,1fr);border-bottom:1px solid var(--border)"><button type="button" data-go="web.job" data-x="${j.id}" style="border:0;background:none;text-align:left;padding:6px 10px;cursor:pointer;min-width:0"><b class="small">${esc(j.id)}</b> <span class="tiny t3">${esc(j.crew)}</span><div class="tiny t2 nowrap" style="overflow:hidden;text-overflow:ellipsis">${esc(j.title)} · ${esc(last(j.client))}</div></button><div style="position:relative;height:42px;background-image:linear-gradient(to right,var(--border) 1px,transparent 1px);background-size:12.5% 100%">${today >= 0 ? `<span aria-hidden="true" style="position:absolute;top:0;bottom:0;left:${(today / span * 100).toFixed(2)}%;width:2px;background:var(--danger-solid)"></span>` : ''}${bars}${ms}</div></div>`;
    }).join('');
    const legend = `<div class="flex tiny t3" style="padding:8px 10px">${PHASES.map((p, k) => `<span class="flex nw gap4"><i style="width:12px;height:8px;border-radius:2px;background:${tones[k]}"></i>${p}</span>`).join('')}<span class="flex nw gap4"><i style="width:8px;height:8px;transform:rotate(45deg);background:var(--warn-solid)"></i>811 locate</span><span class="flex nw gap4"><i style="width:8px;height:8px;transform:rotate(45deg);background:var(--info-solid)"></i>Materials delivered</span></div>`;
    return `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;background:var(--surface)">${head}${rows}${legend}</div>`;
  };
  const board = () => h.board(PHASES.map((p, k) => ({ title: p, cards: projs.filter(j => (W ? 0 : phaseIdx(j)) === k).map(j => ({ title: `${j.id} · ${esc(last(j.client))}`, sub: esc(j.title), meta: `${h.pill(j.actualHrs + '/' + j.budgetHrs + ' h', j.actualHrs > j.budgetHrs ? 'danger' : '')}${c.sees('price') ? h.pill(kmoney(j.value), '') : ''}`, go: 'web.job', x: j.id })) })));
  const gates = h.card({ title: 'Gates before a phase can start', sub: '14 §4.5', flush: true, body: h.list([{ icon: 'flag', tone: 'warn', title: `811 locate ticket on ${projs[0].id}`, sub: 'Cleared May 4; marks expire in 15 days (verify state rule)', right: h.pill('Cleared', 'ok') }, { icon: 'truck', tone: 'info', title: `Paver delivery for ${projs[1] ? projs[1].id : projs[0].id}`, sub: 'Supplier confirmed for Thu 7:00 am', right: h.pill('Confirmed', 'ok') }, { icon: 'rain', tone: 'info', title: 'Polymeric sand hold', sub: 'No sand within the product cure window; rain Tue pm', right: h.pill('Holding', 'warn') }]) });
  const sub = isCrew(c) ? h.note('Crew roles see phases and hours; contract values stay hidden.') : '';
  return h.page({ title: `Projects ${h.tag('V1')}`, sub: `${projs.length} multi-day installs · ${W ? 'spring 2027 build plan' : 'next 8 weeks'}`, actions: h.tabs('proj.view', [['gantt', 'Gantt'], ['board', 'Phase board']], 'gantt') })
    + (view === 'gantt' ? gantt() : board()) + h.cols('2', [gates, h.card({ title: 'Dependencies', body: h.kv([['Excavation', 'starts after 811 clears and the layout is signed off'], ['Install', 'starts when base passes compaction check and materials are on site'], ['Planting', 'can overlap install by 1 day; plants held in the yard'], ['Punch list', 'client walkthrough, then final invoice']]) })]) + sub;
});

// ---------------------------------------------------------------- Jobs: service agreements (07 §4.3, §6.3)
RL.screen('web.agreements', (c) => {
  const D = c.D, W = c.winter, ags = D.agreements;
  if (!ags.length) return h.page({ title: 'Service agreements', sub: 'Recurring work with billing mode, visits and renewal dates' }) + h.empty('No service agreements yet. Agreements start from a signed proposal or a renewal.');
  const sel = ags.find(a => a.id === RL.ui['ag.sel']) || ags[0];
  const done = a => W ? a.visits : Math.min(a.visits, 5 + hs(a.id) % 3);
  const cols = [{ k: 'id', label: 'Agreement', m: true }, { k: 'client', label: 'Client', fmt: (v, r) => `<b>${esc(v)}</b><div class="tiny t3">${esc(r.name)}</div>` }, { k: 'billing', label: 'Billing mode' }, { k: 'visits', label: 'Visits', n: true, fmt: (v, r) => `${done(r)} / ${v}` }, { k: 'value', label: 'Annual value', n: true, fmt: v => P(c, v) }, { k: 'renews', label: 'Renews' }, { k: 'escalator', label: 'Escalator' }, { k: 'autopay', label: 'Autopay', fmt: v => v ? h.pill('Autopay', 'ok') : h.pill('Invoice', '') }];
  const rowsHtml = `<div class="tb-wrap"><table class="tb"><thead><tr>${cols.map(x => `<th${x.n ? ' class="n"' : ''}>${x.label}</th>`).join('')}</tr></thead><tbody>${ags.map(r => `<tr class="go${r.id === sel.id ? ' hl' : ''}" data-ui="ag.sel" data-val="${r.id}">${cols.map(x => `<td${x.n ? ' class="n"' : x.m ? ' class="m"' : ''}>${x.fmt ? x.fmt(r[x.k], r) : esc(r[x.k])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const plan = sel.value, earned = Math.round(plan * done(sel) / sel.visits), level = /Level/.test(sel.billing);
  const billed = W ? plan : level ? Math.round(plan * 2 / 8) : /Prepaid/.test(sel.billing) ? plan : earned, paid = W ? plan : sel.autopay ? billed : Math.round(billed * .6);
  const pos = billed - earned;
  const meter = (l, v) => `<div style="display:grid;grid-template-columns:70px minmax(0,1fr) 90px;gap:8px;align-items:center" class="small"><span class="t3">${l}</span>${h.progress(v, plan, l === 'Paid' ? 'info' : '')}<span class="num right">${P(c, v)}</span></div>`;
  const canCancel = c.allowed('service_agreement.cancel');
  const detail = h.cols('2', [
    h.card({ title: `${esc(sel.id)} · ${esc(sel.client)}`, sub: `${esc(sel.name)} · ${esc(sel.billing)}`, body: `<b class="small">Season meter</b>${meter('Planned', plan)}${meter('Earned', earned)}${meter('Billed', billed)}${meter('Paid', paid)}<div class="small ${pos > 0 ? '' : 't2'}">${pos > 0 ? `Client ahead by ${P(c, pos)} (deferred revenue, account 2150)` : pos < 0 ? `Work ahead of billing by ${P(c, -pos)} (unbilled, accrued at close)` : 'Billing matches earned value'}</div>` + h.kv([['Visits', `${done(sel)} of ${sel.visits} done${W ? ' (season complete)' : ''}`], ['Installments', level ? `8 x ${P(c, Math.round(plan / 8))}, 1st of month Apr-Nov` : esc(sel.billing)], ['Payment', sel.autopay ? 'Autopay, card on file' : 'Invoice, net 15']]) }),
    stack([h.card({ title: 'Service lines', sub: 'What the agreement covers', flush: true, body: h.table([{ k: 0, label: 'Service' }, { k: 1, label: 'Frequency' }, { k: 2, label: 'Visits', n: true }, { k: 3, label: 'Annual', n: true, fmt: v => P(c, v) }], (/residential|mowing/i.test(sel.name) && !/Commercial/.test(sel.name)
        ? [['Mowing, trim and blow', 'Weekly, Apr-Nov', sel.visits - 2, .78], ['Spring cleanup', 'April', 1, .12], ['Fall cleanup and leaves', 'November', 1, .10]]
        : [['Mowing, trim and blow', 'Weekly, Apr-Nov', 28, .46], ['Bed maintenance and weeding', 'Biweekly', 14, .2], ['Mulch, 2 in', 'Spring', 1, .12], ['Spring and fall cleanups', '2 per year', 2, .08], ['Snow: plow and salt', 'Per push, 2 in trigger', '-', .14]]).map(r => [r[0], r[1], r[2], Math.round(sel.value * r[3])]), { dense: true }) }), h.card({ title: 'Policies', body: h.kv([['Escalator', `${esc(sel.escalator)} at renewal`], ['Renewal', `Auto-renews ${esc(sel.renews)}; notice 30 days before (state rule applies)`], ['Cancellation', '14 days notice; prorated true-up'], ['Late fee', 'Off (Company setting)']]) + `<div class="flex">${c.can('service_agreement').includes('W') ? h.btn('Amend', { sm: true, act: 'ag-amend' }) : ''}${h.btn('Preview renewal', { sm: true, go: 'web.renewals' })}${canCancel ? h.btn('Cancel agreement', { sm: true, act: 'ag-cancel' }) : c.role === 'ops_manager' ? h.btn('Request cancellation', { sm: true, act: 'ag-req' }) : ''}</div>` }),
      W ? (c.has('agents_v1') ? h.aiCard({ agent: 'Renewal agent (A13)', level: 'L2', credits: 2, title: `${ags.length} renewals due before Mar 31`, body: 'Drafts renewal letters with the escalator applied and flags clients with skips or complaints for a personal call.', why: h.tag('V1') + ' Quoted per letter before it runs.', actions: h.btn('Draft renewals (2 cr each)', { kind: 'ai', act: 'ag-renew' }) }) : '') : ''])]);
  const acv = sum(ags, a => a.value);
  return h.page({ title: 'Service agreements', sub: `${ags.length} active · ${W ? 'renewal season' : 'season in progress'}`, actions: c.can('service_agreement').includes('W') ? h.btn('New agreement', { kind: 'primary', icon: 'plus', act: 'ag-new' }) : '' })
    + h.kpis([{ label: 'Active agreements', value: ags.length }, { label: 'Annual contract value', value: P(c, acv) }, { label: 'On autopay', value: Math.round(100 * ags.filter(a => a.autopay).length / ags.length) + '%' }, { label: W ? 'Renewals due by Mar 31' : 'Renewals next 60 days', value: W ? ags.filter(a => a.renews === 'Mar 31').length : 0, delta: W ? 'Dec 31 renewals already processed' : 'first renewals Nov 30' }])
    + rowsHtml + detail + (c.role === 'bookkeeper' ? roNote(c, 'read-only. Deferred revenue from level billing posts to 2150 automatically.') : '');
});
RL.act('ag-new', toast('New agreement: services, visits, billing mode and renewal terms (mock).'));
RL.act('ag-amend', toast('Amendment drafted as v2; the client signs in the portal (mock).'));
RL.act('ag-cancel', toast('Cancellation flow: notice date, proration and final true-up (mock).'));
RL.act('ag-req', toast('Cancellation request sent to the office (mock).'));
RL.act('ag-renew', toast('Quoted 2 credits per letter. Drafts land in Renewals for review (mock).'));

// ---------------------------------------------------------------- Jobs: job record (21 §5.2, 14, 09)
function jobPhases(j) {
  const install = ['Install', 'Design'].includes(j.type);
  const names = install ? PHASES : j.type === 'Maintenance' || j.type === 'Lawn program' ? ['Season setup', 'Recurring visits', 'Closeout'] : ['Assessment', 'Service', 'Closeout'];
  const w = install ? [.06, .14, .14, .38, .2, .08] : [.1, .8, .1];
  const cur = j.status === 'Scheduled' ? -1 : install ? phaseIdx(j) : j.status === 'Complete' ? 3 : 1;
  return names.map((n, k) => { const b = Math.max(1, Math.round(j.budgetHrs * w[k])); const a = j.status === 'Complete' || k < cur ? Math.round(b * (.85 + (hs(j.id + k) % 30) / 100)) : k === cur ? Math.round(b * (j._r != null ? j._r : j.actualHrs / j.budgetHrs) * .9) : 0; return { n, b, a, pct: j.status === 'Complete' || k < cur ? 100 : k === cur ? Math.min(95, Math.round(100 * a / b)) : 0, cur: k === cur }; });
}
function jobMaterials(c, j) {
  if (['Install', 'Design'].includes(j.type)) return [['Pavers: concrete cobble', 'sq ft', 420, 380, 3.85], ['Base: 21AA crushed limestone', 'ton', 28, 26, 32], ['Polymeric sand', 'bag', 14, 6, 34], ['Edge restraint', 'piece', 22, 22, 9.5], ['Little Lime Hydrangea #3', 'each', 6, 0, 38], ['Shredded hardwood mulch', 'cu yd', 6, 0, 42]];
  if (j.type === 'Lawn program') return [['Fertilizer 24-0-11 with dimension', 'bag', 12, 7, 41], ['Broadleaf herbicide (3-way amine)', 'gal', 3, 1, 68], ['Lawn signs', 'each', 40, 22, .6]];
  if (j.type === 'Irrigation') return [['Rotor head, 4 in', 'each', 8, 6, 14], ['Drip line, 1/2 in', 'ft', 250, 180, .42], ['Controller (smart, 12 zone)', 'each', 1, 1, 289]];
  return [['Shredded hardwood mulch', 'cu yd', 12, 8, 42], ['Steel edging 16 ft', 'piece', 6, 4, 46], ['Fuel and trimmer line', 'lot', 1, 1, 64]];
}
RL.screen('web.job', (c) => {
  const D = c.D, crewMode = isCrew(c);
  const scoped = jobsInScope(c);
  const j = jobsX(c).find(x => x.id === c.x) || scoped[0] || jobsX(c)[0];
  const tab = h.tab('job.tab', 'overview');
  const crew = D.crews.find(x => x.name === j.crew);
  const ph = jobPhases(j), mats = jobMaterials(c, j);
  const hero = j.client === D.res.client;
  const deposit = hero ? (D.proposals[0] || {}).deposit || Math.round(j.value * .3) : Math.round(j.value * .25);
  const billed = j.status === 'Complete' ? j.value : j.status === 'In progress' ? Math.round(j.value * .5) : deposit;
  const pct = Math.round(100 * sum(ph, p => p.pct * p.b) / Math.max(1, sum(ph, p => p.b)) / 100);
  const costMix = [['Labor and burden', .5], ['Materials', .3], ['Equipment', .08], ['Subcontractor', .12]];
  const eacF = 1 + ((hs(j.id) % 9) - 3) / 100;
  const costRows = costMix.map(([n, w], k) => { const b = Math.round(j.cost * w), a = Math.round(b * pct / 100 * (k === 1 ? 1.12 : .97)), eac = Math.round(b * (k === 1 ? eacF + .04 : eacF)); return { n, b, cm: k === 1 ? Math.round(b * .08) : 0, a, eac, v: b - eac }; });
  const eac = sum(costRows, r => r.eac), projMargin = Math.round(100 * (j.value - eac) / j.value);
  const visits = peakVisits(c).filter(v => v.crewId === (crew || {}).id).slice(0, 6);
  const tabs = [['overview', 'Overview'], ['visits', 'Visits', visits.length], ['phases', 'Phases', ph.length], ['materials', 'Materials', mats.length], ['costs', crewMode ? 'Hours vs budget' : 'Costs vs budget'], ['cos', 'Change orders', 3], ['photos', 'Photos', 6], ['docs', 'Documents', 6], ['timeline', 'Timeline']];
  let body = '';
  if (tab === 'overview') {
    body = h.kpis(crewMode ? [{ label: 'Hours used', value: `${j.actualHrs} h`, delta: `of ${j.budgetHrs} h budget`, tone: j.actualHrs > j.budgetHrs ? 'danger' : '' }, { label: 'Percent complete', value: pct + '%' }, { label: 'Current phase', value: esc(dPhase(j)) }]
      : [{ label: 'Contract', value: P(c, j.value), delta: '1 change order signed' }, { label: 'Billed to date', value: P(c, billed), delta: `deposit ${P(c, deposit)} applied` }, { label: 'Hours', value: `${j.actualHrs} / ${j.budgetHrs} h`, tone: j.actualHrs > j.budgetHrs ? 'danger' : '', delta: j.actualHrs > j.budgetHrs ? 'over budget' : 'inside budget' }, { label: 'Projected margin', value: Mg(c, projMargin + '%'), delta: c.sees('margin') ? `sold ${jMargin(j)}%` : '', tone: projMargin < jMargin(j) - 2 ? 'warn' : 'ok' }])
      + h.cols('2', [h.card({ title: 'Details', body: h.kv([['Client', crewMode ? esc(j.client) : h.link(esc(j.client), 'web.client', j.clientId)], ['Type', esc(j.type)], ['Crew', `${esc(j.crew)}${crew ? ' · lead ' + esc(crew.lead) : ''}`], ['Start', esc(j.start)], ['Status', st(j.status)], ['Proposal', crewMode ? 'Signed' : h.link('PR-2290 (signed)', 'web.proposal', 'PR-2290')], !crewMode && ['Internal note', h.mask(c, 'internal_note', 'Client prefers texts; side gate sticks.')], ['Crew note', c.tr('Park on the street; neighbor\'s drive is shared.', 'Estacionar en la calle; la entrada es compartida.')]]) }),
        h.card({ title: 'Progress by phase', body: h.bars(ph.map(p => ({ label: esc(p.n), value: p.pct, max: 100, tone: p.cur ? 'info' : p.pct === 100 ? '' : 'accent', right: p.pct + '%' }))) })]);
  } else if (tab === 'visits') {
    body = h.table([{ k: 'id', label: 'Visit', m: true }, { k: 'service', label: 'Service' }, { k: 'start', label: 'Start', fmt: v => `${c.today.short} ${hm(toMin(v))}` }, { k: 'crew', label: 'Crew' }, { k: 'dur', label: 'On site', n: true, fmt: v => v + ' min' }, { k: 'budgetHrs', label: 'Budget', n: true, fmt: v => v + ' crew-h' }, { k: 'status', label: 'Status', fmt: v => st(v) }], visits, { go: 'web.visit', empty: 'No visits scheduled.' });
  } else if (tab === 'phases') {
    body = h.table([{ k: 'n', label: 'Phase', fmt: (v, r) => `<b>${esc(v)}</b>${r.cur ? ' ' + h.pill('Current', 'info') : ''}` }, { k: 'b', label: 'Budget hours', n: true }, { k: 'a', label: 'Actual hours', n: true }, { k: 'pct', label: 'Complete', fmt: v => `<div style="min-width:120px">${h.progress(v, 100)}</div>` }, { k: 'pct', label: '', n: true, fmt: v => v + '%' }], ph, { foot: ['Total', sum(ph, p => p.b), sum(ph, p => p.a), '', pct + '%'] })
      + h.note('Phases come from the estimate. Hours flow in from crew time on each visit.');
  } else if (tab === 'materials') {
    body = h.table([{ k: 0, label: 'Item' }, { k: 1, label: 'Unit' }, { k: 2, label: 'Estimated', n: true }, { k: 3, label: 'Used', n: true }, { k: 4, label: 'Unit cost', n: true, fmt: v => Cst(c, v, { cents: true }) }, { k: 4, label: 'Extended', n: true, fmt: (v, r) => Cst(c, v * r[3]) }, { k: 0, label: 'Source', fmt: (v, r) => /Hydrangea|Pavers/.test(v) ? 'PO-3311' : 'Yard stock' }], mats.map(m => Object.assign([], m)), { dense: true, foot: ['Total', '', '', '', '', Cst(c, sum(mats, m => m[3] * m[4])), ''] });
  } else if (tab === 'costs') {
    body = crewMode ? h.table([{ k: 'n', label: 'Phase' }, { k: 'b', label: 'Budget hours', n: true }, { k: 'a', label: 'Actual hours', n: true }, { k: 'pct', label: 'Used', n: true, fmt: (v, r) => Math.round(100 * r.a / r.b) + '%' }], ph) + h.note('Crew roles see hours only. Costs and margin are hidden (field classes cost and margin, 02 §10.2).')
      : h.table([{ k: 'n', label: 'Cost type' }, { k: 'b', label: 'Budget', n: true, fmt: v => Cst(c, v) }, { k: 'cm', label: 'Committed', n: true, fmt: v => Cst(c, v) }, { k: 'a', label: 'Actual', n: true, fmt: v => Cst(c, v) }, { k: 'eac', label: 'Estimate at completion', n: true, fmt: v => Cst(c, v) }, { k: 'v', label: 'Variance', n: true, fmt: v => h.mask(c, 'cost', `<span style="color:${v < 0 ? 'var(--danger-text)' : 'var(--ok-text)'}">${v < 0 ? '-' : '+'}${money(Math.abs(v))}</span>`) }], costRows, { foot: ['Total', Cst(c, sum(costRows, r => r.b)), Cst(c, sum(costRows, r => r.cm)), Cst(c, sum(costRows, r => r.a)), Cst(c, eac), Cst(c, sum(costRows, r => r.v))] })
        + h.cols('2', [h.card({ title: 'Margin', body: h.kv([['Contract', P(c, j.value)], ['Sold margin', Mg(c, jMargin(j) + '%')], ['Projected margin', Mg(c, projMargin + '%')], ['Hours', `${j.actualHrs} / ${j.budgetHrs} h`]]) }), costRows[1].v < 0 ? h.card({ tone: 'warn', title: 'Materials running over', body: `<p class="small">Materials are ${Cst(c, -costRows[1].v)} over: paver waste above the takeoff factor and freight. ${c.sees('cost') ? 'Consider a change order or update the waste factor in the price book.' : ''}</p>${c.allowed('change_order') ? h.btn('Draft change order', { sm: true, act: 'job-co' }) : ''}` }) : h.card({ tone: 'ok', title: 'On budget', body: '<p class="small">All cost types are inside budget.</p>' })]);
  } else if (tab === 'cos') {
    const cos = [['CO-1', 'Seat wall cap upgrade to limestone', 1200, 'Signed', 'Office'], ['CO-2', 'Extra drain line along the north bed', 640, 'Sent', 'Office'], ['CO-3', 'Remove buried stump found during excavation', null, 'Draft', `Field (${crew ? first(crew.lead) : 'crew lead'})`]];
    body = h.table([{ k: 0, label: 'Change order', m: true }, { k: 1, label: 'Description' }, { k: 2, label: 'Price change', n: true, fmt: v => v == null ? '<span class="t3">needs pricing</span>' : P(c, v) }, { k: 3, label: 'Status', fmt: v => st(v === 'Sent' ? 'Pending' : v) }, { k: 4, label: 'Started by' }], cos.map(r => Object.assign([], r)))
      + `<div class="flex">${c.allowed('change_order') ? h.btn(crewMode ? 'Draft change order (no price)' : 'New change order', { icon: 'plus', act: 'job-co' }) : ''}</div>` + (crewMode ? h.note('Crew leads can draft a change order with photos and notes; the office adds the price (change_order = W/c draft, no price).') : '');
  } else if (tab === 'photos') {
    const ks = [['before', 'Before · May 3 7:42 am'], ['before', 'Layout paint · May 4'], ['patio', 'Base compacted · May 7'], ['patio', 'Pavers 60% · May 10'], ['bed', 'Planting plan check'], ['after', 'Design mockup (AI)']];
    body = `<div class="cols cols-3">${ks.map(([k, l], i) => `<div class="stack8">${h.photo(k, { label: l, badge: i === 5 ? 'AI mockup' : l.split(' · ')[1] || '' })}<span class="tiny t2">${esc(l)}${i < 5 ? ` · GPS ${(39.99 + i / 1000).toFixed(4)}, -83.05` : ''}</span></div>`).join('')}</div>`;
  } else if (tab === 'docs') {
    const docs = [['Signed proposal PR-2290', 'PDF · signed by client', 'pen'], ['Design plan DS-410 (v3)', 'PDF · approved', 'layers'], ['811 locate ticket', 'Ticket A2213-0447 · cleared May 4', 'flag'], ['Material list and PO-3311', 'PDF · supplier confirmed', 'box'], [`COI: ${esc(c.t.cast && c.t.cast.subcontractor || 'subcontractor')}`, 'Certificate of insurance · valid to Mar 2028', 'shield'], ['Lien waiver (conditional)', 'Requested at final invoice', 'receipt']];
    body = h.list(docs.map(([t, s, ic]) => ({ icon: ic, title: t, sub: s, right: h.btn('Open', { sm: true, act: 'job-doc' }) })));
  } else {
    body = h.timeline([{ when: 'Apr 19', text: 'Proposal PR-2290 signed in the portal', tone: 'ok' }, { when: 'Apr 19', text: `Deposit ${P(c, deposit)} paid by card (Stripe)`, tone: 'ok' }, { when: 'Apr 26', text: 'Job scheduled; crew assigned', tone: 'info' }, { when: 'May 4', text: '811 locate cleared', tone: 'ok' }, { when: 'May 6', text: 'CO-1 signed by client', tone: 'ok' }, { when: 'May 10', text: `Field note from ${crew ? esc(crew.lead) : 'crew lead'}: stump found, CO-3 drafted`, tone: 'warn' }, { when: 'May 11', text: 'Rain hold on polymeric sand (Weather center)', tone: 'info' }]);
  }
  const canInv = c.can('invoice').includes('W');
  const actions = crewMode ? h.btn('Draft change order', { icon: 'pen', act: 'job-co' }) : (c.allowed('visit.dispatch') ? h.btn('Schedule visit', { icon: 'calendar', go: 'web.board' }) : '') + (c.allowed('change_order') ? h.btn('Change order', { icon: 'pen', act: 'job-co' }) : '') + (canInv ? h.btn('Progress invoice', { kind: 'primary', icon: 'receipt', act: 'job-inv' }) : '');
  return h.page({ crumbs: [['Jobs', 'web.jobs'], [esc(j.id)]], title: `${esc(j.id)} · ${esc(j.title)}`, sub: `${esc(j.client)} · ${esc(j.type)} · ${esc(j.crew)}`, tags: st(j.status) + h.pill(`Phase: ${esc(dPhase(j))}`, 'info') + (j.actualHrs > j.budgetHrs ? h.pill('Over hours budget', 'danger') : ''), actions })
    + h.tabs('job.tab', tabs, 'overview') + body;
});
RL.act('job-co', toast('Change order drafted with photos; the client signs in the portal (mock).'));
RL.act('job-inv', toast('Progress invoice drafted for 50% of contract less deposit (mock).'));
RL.act('job-doc', toast('Document opened (mock).'));

// ---------------------------------------------------------------- Jobs: visit record (05 §4.3-4.8)
const LATLON = { greenleaf: [39.99, -83.06], summit: [39.96, -83.0], brookside: [41.66, -83.58], reyes: [41.75, -88.15], maplehollow: [43.01, -88.23], beacon: [42.96, -85.67], fernwood: [42.05, -87.69], kestrel: [39.77, -86.16] };
const gps = (c, v) => { const b = LATLON[c.t.id] || [40, -84]; return `${(b[0] + (120 - v.y) / 4000).toFixed(4)}, ${(b[1] + (v.x - 200) / 3000).toFixed(4)}`; };
function checklist(v) {
  const s = v.service;
  if (/Snow|Salt/.test(s)) return ['Depth photo at the measuring point (ruler)', 'Plow lot, priority areas first', 'Shovel and blow walks and entrances', 'Salt walks and entrances', 'After photos of each priority 1 area', 'Note hazards or blocked areas'];
  if (/Round|Grub|aeration|Overseed/.test(s)) return ['Confirm area and no-spray zones', 'Check wind and temperature', 'Apply product at label rate', 'Post lawn sign at entry', 'Leave door hanger with re-entry time', 'After photo'];
  if (/Irrigation|Backflow|Controller|Winter/.test(s)) return ['Run each zone and inspect heads', 'Fix or flag broken heads', 'Set controller schedule', 'Backflow device check', 'Photo of controller settings'];
  if (/mow/i.test(s)) return ['Mow front', 'Mow back', 'Trim around beds and fences', 'Edge walks and drive', 'Blow hard surfaces', 'Close gate', 'After photo: front lawn (required)'];
  return ['Review scope with client', 'Complete scope items', 'Haul debris', 'Clean work area', 'After photos'];
}
RL.screen('web.visit', (c) => {
  const D = c.D, crewMode = isCrew(c), W = c.winter;
  const vis = dayVisits(c);
  if (!vis.length) return h.page({ title: 'Visit record', sub: 'No visits for this Company' }) + h.empty('This Company has no crews or visits. Visits appear once scheduling is used.');
  const mine = crewMode ? vis.filter(v => v.crewId === (myCrew(c) || {}).id) : vis;
  const lawnV = mine.find(v => /Round|Grub|aeration|Overseed/.test(v.service) && v.status !== 'Scheduled');
  const v = findVisit(c, c.x) || lawnV || mine.find(x => x.status === 'In progress') || mine[0] || vis[0];
  const crew = D.crews.find(x => x.id === v.crewId) || { name: v.crew, lead: '-', members: [], truck: '' };
  const prop = D.properties.find(p => p.client === v.clientId) || {};
  const items = checklist(v), nDone = v.status === 'Done' ? items.length : v.status === 'In progress' ? Math.ceil(items.length / 2) : 0;
  const s0 = toMin(v.start), lawn = /Round|Grub|aeration|Overseed/.test(v.service), snow = /Snow|Salt/.test(v.service);
  const arrive = v.status === 'Scheduled' || v.status === 'En route' ? null : s0 + 2, depart = v.status === 'Done' ? s0 + v.dur + 1 : null;
  const team = [crew.lead].concat(crew.members);
  const ck = `<div class="stack8">${items.map((it, i) => `<div class="flex nw small">${i < nDone ? `<span style="color:var(--ok-text)">${icon('check')}</span>` : `<span class="t3" style="display:inline-block;width:16px;height:16px;border:1.5px solid var(--border-strong);border-radius:4px"></span>`}<span class="${i < nDone ? '' : 't2'}">${esc(it)}</span>${/required|ruler|Photo/i.test(it) ? h.pill('photo', '') : ''}</div>`).join('')}</div>`;
  const timeC = h.card({ title: 'Time', sub: 'Crew-level punch from the crew app', body: h.kv([['Arrived', arrive != null ? `${hm(arrive)} · geofence + tap` : '<span class="t3">Not yet</span>'], ['Departed', depart != null ? hm(depart) : '<span class="t3">-</span>'], ['On site', arrive != null ? `${v.status === 'Done' ? v.dur : Math.round(v.dur / 2)} min of ${v.dur} planned` : '-'], ['Budget', h.mask(c, 'budget_hours', `${v.budgetHrs} crew-h`)], ['Drive from previous', `${rint(v.id, 6, 18)} min`]]) + h.table([{ k: 'n', label: 'Crew member' }, { k: 'hrs', label: 'Hours', n: true }, { k: 'rate', label: 'Pay rate', n: true }], team.map((n, i) => ({ n: esc(n) + (i === 0 ? ' (lead)' : ''), hrs: arrive != null ? (v.dur / 60 * (v.status === 'Done' ? 1 : .5)).toFixed(2) : '-', rate: h.mask(c, 'pay_rate', money(22 + i * 2, { cents: true }) + '/h') })), { dense: true }) });
  const ph1 = snow ? 'snow' : /cleanup|Mulch|prun|edging/i.test(v.service) ? 'bed' : 'lawn';
  const photos = h.card({ title: 'Photos', sub: 'Timestamped with GPS; originals kept', body: arrive != null ? `<div class="cols cols-2">${[['before', 'Before'], [ph1, v.status === 'Done' ? 'After' : 'In progress']].map(([k, l], i) => `<div class="stack8">${h.photo(snow ? 'snow' : k, { label: l, badge: `${hm(arrive + i * (v.dur - 4))} · ${gps(c, v)}` })}<span class="tiny t2">${l} · device ${hm(arrive + i * (v.dur - 4))}, server ${hm(arrive + i * (v.dur - 4) + 1)}</span></div>`).join('')}</div>` : h.empty('Photos appear when the crew arrives.') });
  const chem = lawn ? h.card({ title: 'Chemical application', sub: `State recordkeeping · ${h.limit(c, 'chemical_logs') || 'complete record'}`, body: h.kv([
    ['Product', /Grub/.test(v.service) ? 'Grub preventive (chlorantraniliprole), granular' : /Round 3|broadleaf/i.test(v.service) ? 'Broadleaf herbicide (3-way amine)' : 'Fertilizer 24-0-11 with dithiopyr'],
    ['EPA reg. no.', '<span class="mono">0000-000</span> <span class="tiny t3">(placeholder format, from catalog)</span>'],
    ['Target', /Grub/.test(v.service) ? 'White grubs (preventive)' : /broadleaf/i.test(v.service) ? 'Dandelion, clover' : 'Crabgrass (pre-emergent), turf feeding'],
    ['Rate', /broadleaf/i.test(v.service) ? '1.5 fl oz / 1,000 sq ft (label 1.0-1.6)' : '3.0 lb product / 1,000 sq ft (label 2.9-4.0)'],
    ['Area treated', `${num(prop.turf || 6400)} sq ft turf`], ['Product used', /broadleaf/i.test(v.service) ? `${(((prop.turf || 6400) / 1000) * 1.5).toFixed(1)} fl oz` : `${(((prop.turf || 6400) / 1000) * 3).toFixed(1)} lb`],
    ['Weather', `Wind 6 mph NW, gust 9 · 64 °F · RH 52% (station 2.4 mi, ${hm((arrive || s0) + 3)})`],
    ['Re-entry interval', 'Until dry; lawn sign posted at entry'], ['Applicator', `${esc(crew.lead)} · ${esc((D.people.find(p => p.name === crew.lead) || {}).cert || 'Applicator 3A, exp Mar 2028')}`],
  ]) + (c.inLens('V1') ? `<div class="aic" style="padding:7px 10px"><div class="ah">${icon('spark')}<span>Chemical Compliance (A16)</span><span class="lv">L1</span><span class="cr">1 cr</span></div><div class="small">Record complete: product, rate, area, wind and re-entry interval all present. ${h.tag('V1')}</div></div>` : '') })
    : h.card({ title: 'Chemical application', body: `<p class="small t2">${snow ? 'De-icing material is logged as counts in Snow Lite (salt applications). Material quantities and spreader settings come with the Snow & Ice add-on.' : 'No product applied on this visit. Lawn program visits capture product, EPA reg. no., rate, area, wind and re-entry interval.'}</p>` });
  const sig = v.status === 'Done' ? `<svg viewBox="0 0 240 60" role="img" aria-label="Client signature" style="width:100%;max-width:260px;height:60px;border-bottom:1px solid var(--border-strong)"><path d="M10 42 C 30 10, 42 52, 60 30 S 92 14, 104 38 S 140 46, 150 24 C 160 10, 172 48, 190 34 S 220 26, 232 30" fill="none" stroke="var(--text)" stroke-width="2" stroke-linecap="round"/></svg><div class="tiny t2">Signed by ${esc(first(v.client))} at ${hm(depart || s0 + v.dur)} on the crew phone · ${gps(c, v)}</div>` : `<p class="small t2">${v.status === 'In progress' ? 'Collected at the end of the visit, or skipped with a reason (client not home: photos are the proof).' : 'Not started.'}</p>`;
  const notes = h.card({ title: 'Notes', body: h.kv([['Crew note', c.tr(v.status === 'Scheduled' ? '-' : 'Back gate latch loose; told client.', 'El pestillo de la puerta trasera está flojo; avisé al cliente.') + (c.es ? '' : ` <span class="tiny t3">(from ES voice note, translated)</span>`)], ['Property note', prop.dog ? `Dog: ${esc(prop.dog)}` : 'No pets'], ['Gate', prop.gate ? h.mask(c, 'access_secret', esc(prop.gate)) : 'No gate code'], ['Internal note', h.mask(c, 'internal_note', 'Asked about fall aeration; send quote.')]]) });
  const bill = crewMode ? '' : h.card({ title: 'Billing', body: h.kv([['Billable item', `${esc(v.service)} · ${P(c, vPrice(v))}`], ['Bills through', snow ? 'Per-push invoice from storm log' : /mow/i.test(v.service) ? 'Agreement (level billing) · no invoice per visit' : 'May billing run'], ['Proof of service', `${arrive != null ? 2 : 0} photos attached to the invoice`]]) });
  const actions = crewMode ? (c.allowed('visit.complete') && v.status !== 'Done' ? h.btn('Mark complete', { kind: 'primary', icon: 'check', act: 'visit-done' }) : '') : h.btn('Message crew', { icon: 'chat', act: 'visit-msg' }) + (c.allowed('visit.dispatch') ? h.btn('Reschedule', { icon: 'calendar', go: 'web.board' }) : '');
  return h.page({ crumbs: [['Jobs', 'web.jobs'], ['Visits'], [esc(v.id)]], title: `${esc(v.service)} · ${esc(v.client)}`, sub: `${esc(v.address)} · ${W ? c.today.short : c.today.short} ${hm(s0)} · ${esc(crew.name)} (${esc(crew.lead)}) · stop ${v.stop}`, tags: st(v.status) + (snow ? h.pill('Storm visit', 'info', 'snow') : '') + (lawn ? h.pill('Application record', 'accent', 'flask') : ''), actions })
    + h.cols('21', [stack([h.card({ title: 'Checklist', sub: `${nDone} of ${items.length} done`, body: ck }), photos, chem]), stack([timeC, notes, h.card({ title: 'Client signature', body: sig }), bill])]);
});
RL.act('visit-done', toast('Marked complete. The office sees it in seconds; offline it syncs later (mock).'));
RL.act('visit-msg', toast('Message sent to the crew app (mock).'));

// ---------------------------------------------------------------- Jobs: Snow & Ice (14 §4.3)
RL.screen('web.snow', (c) => {
  const D = c.D, W = c.winter, crewMode = isCrew(c), full = c.mod('snow_ice'), fullLens = full && c.inLens('V1');
  const sites = snowSites(c);
  if (!sites.length) return h.page({ title: 'Snow & Ice' }) + h.empty('No snow sites yet. Add properties you service in winter.');
  let logs = winterVisits(c).map(v => W ? v : Object.assign({}, v, { status: 'Done' }));
  if (crewMode) logs = logs.filter(v => v.crewId === (myCrew(c) || {}).id);
  const storm = W ? 'Tue Jan 12 · overnight snow, 4.5 in so far' : 'Last storm: Fri Apr 2 · 2.8 in (season closed Apr 15)';
  const selLog = logs.find(l => l.id === RL.ui['snow.log']) || logs.find(l => l.status === 'Done') || logs[0];
  const pushes = l => l.service === 'Salt application' ? 0 : (l.site && l.site.com ? 1 + (hs(l.id) % 2) : 1);
  const salts = l => l.service === 'Salt application' ? 1 : (l.site && l.site.com && hs(l.id) % 3 === 0 ? 1 : 0);
  const siteTbl = h.table([{ k: 'seq', label: '#', n: true }, { k: 'priority', label: 'Priority', fmt: v => h.pill('P' + v, v === 1 ? 'danger' : v === 2 ? 'warn' : '') }, { k: 'client', label: 'Site', fmt: (v, r) => `<b>${esc(v)}</b><div class="tiny t3">${esc(r.address)}</div>` }, { k: 'services', label: 'Services and trigger', fmt: (v, r) => `${esc(v)}<div class="tiny t3">Trigger: ${esc(r.trigger)}</div>` }, { k: 'model', label: 'Billing' }, { k: 'push', label: 'Per push', n: true, fmt: v => crewMode ? '<span class="masked">•••</span>' : P(c, v) }], crewMode ? sites.filter(s => logs.some(l => l.site && l.site.id === s.id)) : sites, { dense: true });
  const logTbl = h.table([{ k: 'start', label: 'Arrived', fmt: v => hm(toMin(v)) }, { k: 'client', label: 'Site', fmt: (v, r) => `<b>${esc(v)}</b>` }, { k: 'crew', label: 'Crew' }, { k: 'dur', label: 'Departed', fmt: (v, r) => r.status === 'Done' ? hm(toMin(r.start) + v) : '-' }, { k: 'id', label: 'Pushes', n: true, fmt: (v, r) => r.status === 'Done' ? pushes(r) : '-' }, { k: 'id', label: 'Salt', n: true, fmt: (v, r) => r.status === 'Done' ? salts(r) : '-' }, { k: 'id', label: 'GPS photos', n: true, fmt: (v, r) => r.status === 'Done' ? 3 : r.status === 'In progress' ? 1 : 0 }, { k: 'status', label: 'Status', fmt: v => st(v) }, { k: 'id', label: '', fmt: v => h.btn('View', { sm: true, ui: 'snow.log', val: v }) }], logs, { dense: true, hl: r => selLog && r.id === selLog.id });
  const logDetail = selLog ? h.card({ title: `Storm visit log · ${esc(selLog.client)}`, sub: `${esc(selLog.crew)} · ${esc(selLog.service)} · ${selLog.status === 'Done' ? `${hm(toMin(selLog.start))} - ${hm(toMin(selLog.start) + selLog.dur)}` : 'in progress'}`, body: `<div class="cols cols-3" style="max-width:760px">${['Arrival: depth ruler', 'After: lot', 'After: entrance salted'].map((l, i) => `<div class="stack8">${h.photo('snow', { label: l, badge: `${hm(toMin(selLog.start) + i * Math.round(selLog.dur / 2))} · ${gps(c, selLog)}` })}<span class="tiny t2">${l}</span></div>`).join('')}</div>` + h.kv([['GPS', gps(c, selLog)], ['Times', 'Device and server timestamps stored on every photo'], ['Notes', c.tr('Two cars parked in row C; plowed around, photo taken.', 'Dos autos estacionados en la fila C; se limpió alrededor, con foto.')], ['Counts', `${pushes(selLog)} push, ${salts(selLog)} salt application`]]) }) : '';
  const byClient = {};
  logs.filter(l => l.status === 'Done' && l.site && l.site.model === 'Per push').forEach(l => { const k = l.client; byClient[k] = byClient[k] || { client: k, pushes: 0, salts: 0, amt: 0 }; byClient[k].pushes += pushes(l); byClient[k].salts += salts(l); byClient[k].amt += pushes(l) * l.site.push + salts(l) * (l.site.salt || 0); });
  const inv = Object.values(byClient);
  const invCard = crewMode ? '' : h.card({ title: W ? 'Per-push invoices from tonight\'s logs' : 'Per-push invoices, last storm', sub: W ? `${inv.length} drafts at Price Book rates; seasonal clients bill by installment` : `Billed Apr 3 from the Apr 2 storm logs; seasonal clients bill by installment`, actions: W && c.can('invoice').includes('W') ? h.btn('Create invoices', { sm: true, kind: 'primary', act: 'snow-inv' }) : '', flush: true, body: h.table([{ k: 'client', label: 'Client', fmt: v => `<b>${esc(v)}</b>` }, { k: 'pushes', label: 'Pushes', n: true }, { k: 'salts', label: 'Salt applications', n: true }, { k: 'amt', label: 'Amount', n: true, fmt: v => P(c, v) }, { k: 'client', label: 'Status', fmt: v => W ? st('Draft') : st(hs(v) % 4 ? 'Paid' : 'Sent') }, { k: 'client', label: 'Proof', fmt: () => `<span class="tiny t2">${icon('camera', 's')} photos + GPS attached</span>` }], inv, { dense: true, empty: 'No completed per-push visits yet.', foot: inv.length ? ['Total', num(sum(inv, i => i.pushes)), num(sum(inv, i => i.salts)), P(c, sum(inv, i => i.amt)), '', ''] : null }) });
  const proof = h.card({ title: 'Proof of service', sub: 'Per-site PDF for a date range', body: `<p class="small t2">Each storm visit with times, crew, services, photos with GPS and device and server timestamps, and notes. The footer says it is a service-log export, not a sealed packet.</p><div class="flex">${h.btn('Export PDF', { icon: 'download', modal: 'snow-proof' })}${full ? h.pill('Sealed packets: Snow & Ice', 'ok', 'shield') : ''}</div>` });
  const addon = full ? '' : h.card({ title: 'What the Snow & Ice add-on adds', sub: `${h.tag('V1')} · Snow Lite stays included on every plan`, body: h.list([['map', 'Site maps with plow areas, stakes, no-service zones and client sign-off'], ['bolt', 'Storm events from weather feeds, per-site triggers and re-service loops'], ['grid', 'Storm Command Center: live map, crews and subs, salt on hand'], ['shield', 'Hash-sealed proof packets with legal hold, 7-year retention'], ['receipt', 'Eight pricing models with caps, floors and per-inch true-ups'], ['users', 'Subcontractor plowers with COI gate and auto-drafted bills']].map(([ic, t]) => ({ icon: ic, title: t }))) + (c.role === 'owner' ? h.lock(c, 'snow_ice') : `<p class="small t2">Ask ${esc(c.owner)} (owner) about the Snow & Ice add-on.</p>`) });
  let command = '';
  if (fullLens) {
    const trig = sites.length, serviced = logs.filter(l => l.status === 'Done').length;
    const p1 = sites.filter(s => s.priority === 1);
    const pins = sites.map((s, i) => { const l = logs.find(x => x.site && x.site.id === s.id); const stt = !W ? 'done' : l ? (l.status === 'Done' ? 'ok' : l.status === 'In progress' ? 'info' : 'warn') : 'warn'; return { x: 30 + ((i * 71) % 340), y: 24 + ((i * 47) % 200), n: s.seq, tone: stt, label: `${s.client} · P${s.priority}` }; });
    const exc = [{ icon: 'warn', tone: 'danger', title: 'Blocked access: parked cars, row C', sub: `${esc(sites[1] ? sites[1].client : sites[0].client)} · photo and note required` }, { icon: 'shield', tone: 'warn', title: 'Sub COI expires in 6 days', sub: `${esc(c.t.cast && c.t.cast.subcontractor || 'Snow subcontractor')} · dispatch blocks on expiry; 30, 14 and 7 day reminders` }];
    command = h.card({ title: `Storm Command Center ${h.tag('V1')}`, sub: W ? `Event SE-2027-04 · active since 1:40 am · merge window 6 h` : 'No active event · season closed Apr 15', actions: W ? h.pill('Active', 'info', 'snow') : h.pill('Off season', ''), body:
      h.kpis(W ? [{ label: 'Sites triggered', value: `${trig}/${trig}` }, { label: 'Serviced', value: `${serviced}/${trig}`, delta: `${trig - serviced} remaining` }, { label: 'Priority 1 open by', value: '6:40 am', delta: 'ETA; target 7:00 am', tone: 'ok' }, { label: 'Salt on hand', value: '38 t', delta: '12 t used this event' }, { label: 'Crews and subs', value: `${Math.min(4, D.crews.length)} + 2`, delta: 'committed at watch' }]
        : [{ label: 'Events this season', value: 14 }, { label: 'Proof packets sealed', value: num(14 * trig) }, { label: 'Salt used', value: '212 t' }, { label: 'Disputes', value: '0' }])
      + h.cols('21', [h.map({ pins, h: 220, seed: 11, label: 'Storm Command Center map' }), stack([h.card({ title: 'Exceptions', flush: true, body: h.list(W ? exc : [{ icon: 'check', tone: 'ok', title: 'No open exceptions' }]) }), h.card({ title: 'Proof packets', body: `<p class="small t2">One per event site: arrival and departure, breadcrumbs, photos, depth, materials, weather. SHA-256 per record, signed manifest, 7-year retention.</p>${h.btn('Legal hold', { sm: true, act: 'snow-hold' })}` })])]) });
  } else if (full) command = h.note('Storm Command Center is V1 scope. Widen the scope lens to see it.');
  const k = crewMode ? [{ label: 'Your storm stops', value: logs.length }, { label: 'Done', value: logs.filter(l => l.status === 'Done').length }]
    : [{ label: 'Snow sites', value: sites.length, delta: `${sites.filter(s => s.priority === 1).length} priority 1` }, { label: W ? 'Storm visits tonight' : 'Storm visits this season', value: W ? logs.length : num(logs.length * 14) }, { label: 'Pushes logged', value: W ? sum(logs.filter(l => l.status === 'Done'), pushes) : num(sum(logs, pushes) * 14) }, { label: W ? 'Ready to bill' : 'Billed from logs', value: P(c, W ? sum(inv, i => i.amt) : sum(sites, s => s.push) * 9) }];
  const banner = W ? h.banner(`${icon('snow')} Active storm: ${esc(storm)}. Crew apps keep logging offline; billing never blocks a storm (72-hour carve-out).`, 'info') : h.banner(`${icon('sun')} ${esc(storm)}. Logs, invoices and proof exports stay available all year.`, 'info');
  const tabsL = [['sites', 'Site list', sites.length], ['logs', 'Storm visit logs', logs.length]].concat(crewMode ? [] : [['inv', 'Per-push invoices', inv.length]]);
  let tab = h.tab('snow.tab', 'sites'); if (!tabsL.some(t => t[0] === tab)) tab = 'sites';
  const lite = h.tabs('snow.tab', tabsL, 'sites') + (tab === 'sites' ? siteTbl + (crewMode ? '' : `<div class="flex">${h.btn('Create storm visits (P1 first)', { icon: 'snow', act: 'snow-create' })}${h.btn('Reorder sites', { act: 'snow-reorder' })}</div>`) : tab === 'logs' ? logTbl + logDetail : invCard);
  return h.page({ title: 'Snow & Ice', sub: `${full ? 'Snow & Ice add-on' : 'Snow Lite (included on every plan)'} · ${esc(c.t.name)}`, tags: full ? h.pill('Snow & Ice add-on', 'ok') : h.pill('Snow Lite', ''), actions: crewMode ? '' : h.btn('Proof of service PDF', { icon: 'download', modal: 'snow-proof' }) })
    + banner + h.kpis(k) + command + lite + (addon ? h.cols('2', [proof, addon]) : proof);
});
RL.modal('snow-proof', (c) => { const s = snowSites(c)[0], l = winterVisits(c)[0]; return { title: 'Proof of service: PDF preview', body: `<div class="cd" style="padding:12px"><b>${esc(c.t.name)}</b><div class="tiny t3">Service log: ${esc(s.client)} · ${esc(s.address)} · Dec 1 - Jan 12</div>${h.table([{ k: 0, label: 'Date' }, { k: 1, label: 'Arrived' }, { k: 2, label: 'Departed' }, { k: 3, label: 'Services' }, { k: 4, label: 'Photos' }], [['Jan 12', '2:30 am', '3:12 am', '1 push, walks', '3 (GPS)'], ['Jan 6', '4:05 am', '4:44 am', '1 push, salt', '3 (GPS)'], ['Dec 28', '5:10 am', '5:31 am', 'Salt (ice)', '2 (GPS)']].map(r => Object.assign([], r)), { dense: true })}<div class="tiny t3 mt8">GPS ${l ? gps(c, l) : ''} · device and server timestamps on each photo. This is a service-log export, not a sealed packet.</div></div>`, foot: h.btn('Download PDF', { kind: 'primary', act: 'snow-pdf' }) + h.btn('Close', { act: 'noop' }) }; });
RL.act('snow-pdf', () => { RL.closeModal(); RL.toast('PDF generated (mock).'); return false; });
RL.act('snow-inv', toast('Per-push invoice drafts created at Price Book rates (mock).'));
RL.act('snow-create', toast('Storm visits created in priority order on the dispatch board (mock).'));
RL.act('snow-reorder', toast('Drag sites to change the sequence inside a priority (mock).'));
RL.act('snow-hold', toast('Legal hold placed: deletion frozen for the selected sites (mock).'));

// ---------------------------------------------------------------- Money helpers
const mdate = (c, s) => c.winter ? String(s).replace(/^May /, 'Jan ').replace(/^Apr /, 'Dec ').replace(/^Mar /, 'Nov ') : s;
const stripeFee = (method, amt) => /ACH/.test(method) ? r2(Math.min(5, amt * .008)) : /Check|Cash/.test(method) ? 0 : r2(amt * .029 + .3);
const ownInvoices = c => {
  let invs = c.D.invoices;
  if (c.role === 'estimator') { const mine = new Set(c.D.opps.filter(o => o.owner === c.who).map(o => o.clientId)); invs = invs.filter(i => mine.has(i.clientId)); }
  return invs;
};
function allPayments(c) {
  return memo(c, 'pays', () => {
    const D = c.D, cl = k => D.clients[k % D.clients.length].name;
    const base = D.payments.map((p, k) => Object.assign({}, p, { method: p.method, payout: /Check|Cash/.test(p.method) ? 'deposit' : k < 4 ? 'po_1021' : 'po_1000' }));
    const extra = [
      ['PY-7698', 'May 9', 7, 'INV-3299', 2140, 'Card', 'po_1014'], ['PY-7699', 'May 9', 9, 'INV-3301', 1074.57, 'Apple Pay', 'po_1014'],
      ['PY-7694', 'May 7', 3, 'INV-3291', 1840, 'Card', 'po_1007'], ['PY-7695', 'May 7', 6, 'INV-3295', 1612.76, 'Card on file (autopay)', 'po_1007'], ['PY-7696', 'May 7', 11, 'INV-3296', 1360, 'Card', 'po_1007'], ['PY-7697', 'May 7', 13, 'INV-3297', 141.24, 'ACH', 'po_1007'],
    ].map(([id, date, k, inv, amount, method, payout]) => ({ id, date, client: cl(k), invoice: inv, amount, method, payout }));
    return base.concat(extra).map(p => Object.assign(p, { fee: stripeFee(p.method, p.amount) })).sort((a, b) => doy(b.date) - doy(a.date) || (a.id < b.id ? 1 : -1));
  });
}
function payouts(c) {
  return memo(c, 'payouts', () => {
    const pays = allPayments(c), bank = c.D.bank;
    const mk = (id, status, arrive, bankLine) => { const ls = pays.filter(p => p.payout === id); const gross = r2(sum(ls, p => p.amount)), fees = r2(sum(ls, p => p.fee)); return { id, status, arrive, gross, fees, refunds: 0, disputes: 0, net: r2(gross - fees), lines: ls, bank: bankLine }; };
    return [mk('po_1021', 'In transit', 'May 12', null), mk('po_1014', 'Paid', bank[4] ? bank[4].date : 'May 10', bank[4]), mk('po_1007', 'Paid', bank[0] ? bank[0].date : 'May 10', bank[0]), mk('po_1000', 'Paid', 'May 4', null)];
  });
}
// data.js draws invoice dates and due dates independently (some are due before they are issued); derive them from terms instead.
const MD = { Jan: 0, Feb: 31, Mar: 59, Apr: 90, May: 120, Jun: 151, Jul: 181, Aug: 212, Sep: 243, Oct: 273, Nov: 304, Dec: 334 };
const doy = s => { const [m, d] = String(s).split(' '); return (MD[m] || 0) + Number(d || 0); };
const fromDoy = n => { let m = 'Jan'; Object.keys(MD).forEach(k => { if (MD[k] < n) m = k; }); return `${m} ${n - MD[m]}`; };
const TODAY = 131;
function invX(c, inv) {
  return memo(c, 'ix' + inv.id, () => {
    const com = (c.D.clients.find(x => x.id === inv.clientId) || {}).type !== 'residential', terms = com ? 30 : 15;
    let d = Math.min(doy(inv.date), TODAY);
    if (inv.status === 'Overdue' && d + terms >= TODAY) d = TODAY - terms - 4 - hs(inv.id) % 26;
    if (inv.status === 'Sent' && d + terms < TODAY) d = TODAY - 1 - hs(inv.id) % 9;
    if (inv.status === 'Draft') d = TODAY;
    return { date: fromDoy(d), due: fromDoy(d + terms), terms, past: inv.status === 'Overdue' ? TODAY - d - terms : 0 };
  });
}
function arQueue(c) {
  return memo(c, 'arq', () => {
    const D = c.D, byC = {};
    D.invoices.filter(i => i.status !== 'Draft' && i.balance > 0).forEach(i => { (byC[i.clientId] = byC[i.clientId] || []).push(Object.assign({}, i, invX(c, i))); });
    return D.clients.filter(x => x.balance > 0 || byC[x.id]).map(x => {
      const inv = byC[x.id] || [], s0 = sum(inv, i => i.balance);
      if (x.balance > s0) { const past = x.pastDue || 0, terms = x.type === 'residential' ? 15 : 30, due = TODAY - past; inv.push({ id: 'INV-' + (3180 + hs(x.id) % 60), date: fromDoy(due - terms), due: fromDoy(due), amount: x.balance - s0, balance: x.balance - s0, status: past ? 'Overdue' : 'Sent', past }); }
      return Object.assign({}, x, { balance: sum(inv, i => i.balance), pastDue: Math.max(0, ...inv.map(i => i.past || 0)), inv });
    }).sort((a, b) => b.pastDue - a.pastDue || b.balance - a.balance);
  });
}
const portalHost = c => RL.portalBrand ? RL.portalBrand(c).host : c.t.id + '.rootline.app';
const qr = seed => { let s = '<svg viewBox="0 0 21 21" role="img" aria-label="QR code for the pay link" style="flex:none;width:84px;height:84px;background:#fff;border:1px solid var(--border);border-radius:6px;padding:4px">'; for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) { const corner = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13); const on = corner ? (x % 6 === 0 || y % 6 === 0 || (x % 7 > 1 && x % 7 < 5 && y % 7 > 1 && y % 7 < 5) || x === 20 || y === 20) : (hs(seed + x * 31 + y) % 3 === 0); if (on && !(corner && (x === 6 && y > 13))) s += `<rect x="${x}" y="${y}" width="1" height="1" fill="#15130f"/>`; } return s + '</svg>'; };

// ---------------------------------------------------------------- Money: invoices, billing runs, approvals (07 §4.4, §4.10, §6.2)
RL.screen('web.invoices', (c) => {
  const D = c.D, W = c.winter, invs = ownInvoices(c), tab = h.tab('inv.tab', 'list'), f = h.tab('inv.f', 'all');
  const cnt = s => invs.filter(i => i.status === s).length;
  const rows = f === 'all' ? invs : invs.filter(i => i.status === f);
  const open = sum(invs.filter(i => i.status !== 'Draft'), i => i.balance), overdue = sum(invs.filter(i => i.status === 'Overdue'), i => i.balance);
  const canRun = c.allowed('billing_run'), estimator = c.role === 'estimator';
  const approvals = invs.filter(i => i.amount >= 2500 && i.status !== 'Paid').slice(0, 4);
  const runN = Math.round(c.t.clients * .72), runTotal = Math.round(c.D.kpi.revenueMTD * .62);
  let body = '';
  if (tab === 'list') {
    body = h.tabs('inv.f', [['all', 'All', invs.length], ['Draft', 'Draft', cnt('Draft')], ['Sent', 'Sent', cnt('Sent')], ['Overdue', 'Overdue', cnt('Overdue')], ['Paid', 'Paid', cnt('Paid')]], 'all')
      + h.table([{ k: 'id', label: 'Invoice', m: true }, { k: 'client', label: 'Client', fmt: (v, r) => `<b>${esc(v)}</b>${r.po ? `<div class="tiny t3">${esc(r.po)}</div>` : ''}` }, { k: 'date', label: 'Date', fmt: (v, r) => `<span class="nowrap">${mdate(c, invX(c, r).date)}</span>` }, { k: 'due', label: 'Due', fmt: (v, r) => { const x = invX(c, r); return `<span class="nowrap">${mdate(c, x.due)}</span>${x.past ? `<div class="tiny" style="color:var(--danger-text)">${x.past} days late</div>` : ''}`; } }, { k: 'amount', label: 'Amount', n: true, fmt: v => P(c, v) }, { k: 'balance', label: 'Balance', n: true, fmt: v => P(c, v) }, { k: 'status', label: 'Status', fmt: v => st(v) }, { k: 'autopay', label: 'Pay', fmt: v => v ? h.pill('Autopay', 'ok') : h.pill('Link', '') }], rows, { go: 'web.invoice', empty: estimator ? 'No invoices for your clients.' : 'No invoices match.' });
  } else if (tab === 'runs') {
    const step = Number(RL.ui['run.step'] || 1);
    const cl = k => D.clients[k % D.clients.length].name;
    const exc = [['Visit not verified', cl(2), 'May 4 mow: no photos', 'warn'], ['PO required', (D.clients.find(x => x.type !== 'residential') || D.clients[0]).name, 'Enhancement $1,140, no PO on file', 'warn'], ['PO ceiling 92% used', (D.clients.filter(x => x.type !== 'residential')[1] || D.clients[1]).name, 'Raise the PO or hold', 'warn'], ['Exemption certificate expired', cl(5), 'Exempt to taxable?', 'danger'], ['Amount anomaly', cl(8), '$1,920 vs usual $240', 'info'], ['No delivery channel', cl(10), 'No email; mail is off', '']];
    body = h.steps(['Scope', 'Exceptions', 'Review', 'Approve', 'Send'], step)
      + h.cols('2', [h.card({ title: `${W ? 'January' : 'May'} 2027 monthly + installments${W ? ' + snow per push' : ''}`, sub: 'Billing run BR-' + (W ? '2027-01' : '2027-05'), body: h.kv([['Invoices', num(runN)], ['Total', P(c, runTotal)], ['Sales tax', P(c, Math.round(runTotal * TAX(c).rate / 100 * .7))], ['Autopay', num(Math.round(runN * c.D.kpi.autopayPct / 100))], ['Email / mail', `${num(Math.round(runN * (1 - c.D.kpi.autopayPct / 100)) - 6)} / 6`], ['Needs approval', `${approvals.length} (over $2,500)`]]) }),
        h.card({ title: 'Compared with last run', body: h.kv([['Invoices', '+14'], ['Total', P(c, -3210)], ['Skips credited', W ? '0' : '22 drought skips'], ['New agreements', '3']]) })])
      + h.card({ title: `Exceptions (${exc.length})`, sub: 'Fix or exclude before review', flush: true, body: h.list(exc.map(([t, who, d, tone]) => ({ icon: 'warn', tone, title: `${esc(t)} <span class="t3">· ${esc(who)}</span>`, sub: esc(d), right: canRun ? h.btn('Fix', { sm: true, act: 'run-fix' }) + h.btn('Exclude', { sm: true, kind: 'ghost', act: 'run-ex' }) : '' }))) })
      + `<div class="flex">${canRun ? (step < 4 ? h.btn(['', 'Review invoices', 'Send for approval', 'Approve run', ''][step] || 'Next', { kind: 'primary', ui: 'run.step', val: String(step + 1) }) : h.btn('Send all', { kind: 'primary', icon: 'send', act: 'run-send' })) + h.btn('Preview 5 random', { act: 'run-prev' }) : roNote(c, 'billing runs are run by the owner, office manager or bookkeeper (billing_run).')}</div>`;
  } else {
    body = approvals.length ? h.table([{ k: 'id', label: 'Invoice', m: true }, { k: 'client', label: 'Client' }, { k: 'amount', label: 'Amount', n: true, fmt: v => P(c, v) }, { k: 'po', label: 'PO', fmt: v => v || '-' }, { k: 'id', label: 'Why', fmt: (v, r) => r.amount >= 5000 ? 'Over $5,000' : 'Over $2,500, first invoice' }, { k: 'id', label: '', fmt: () => c.allowed('invoice.send') && !estimator ? h.btn('Approve', { sm: true, kind: 'primary', act: 'inv-approve' }) + h.btn('Return', { sm: true, kind: 'ghost', act: 'inv-return' }) : '' }], approvals) : h.empty('Nothing waiting for approval.');
    body += h.note('Approval thresholds are Company settings. The office manager approves up to their limit; larger invoices go to the owner.');
  }
  return h.page({ title: 'Invoices', sub: `${invs.length} invoices${estimator ? ' for your clients' : ''} · open ${P(c, open)}`, actions: estimator ? '' : (c.can('invoice').includes('W') ? h.btn('New invoice', { icon: 'plus', act: 'inv-new' }) : '') + (canRun ? h.btn('Start billing run', { kind: 'primary', icon: 'refresh', ui: 'inv.tab', val: 'runs' }) : '') })
    + h.kpis([{ label: 'Open receivables', value: P(c, open), delta: 'sent and overdue, these invoices' }, { label: 'Overdue', value: P(c, overdue), tone: overdue ? 'danger' : 'ok', delta: `${cnt('Overdue')} invoices` }, { label: 'Drafts', value: cnt('Draft') }, { label: 'Paid this month', value: P(c, sum(invs.filter(i => i.status === 'Paid'), i => i.amount)) }, { label: 'On autopay', value: c.D.kpi.autopayPct + '%', delta: 'of clients' }])
    + h.tabs('inv.tab', [['list', 'Invoices', invs.length], ['runs', 'Billing runs'], ['appr', 'Approvals', approvals.length]], 'list') + body
    + (estimator ? roNote(c, 'read-only, own clients only (invoice = R/o).') : c.role === 'ops_manager' ? roNote(c, 'can draft invoices for the branch; sending follows Company settings (invoice = RW/b draft).') : '');
});
RL.act('inv-new', toast('New invoice: pick a client, then add lines from visits, the price book or a job (mock).'));
RL.act('run-fix', toast('Opened the record to fix the exception (mock).'));
RL.act('run-ex', toast('Excluded from this run; it stays on the next run (mock).'));
RL.act('run-prev', toast('Previewing 5 random invoices as the client will see them (mock).'));
RL.act('run-send', (el, ev, c) => { RL.ui['run.step'] = '1'; RL.toast('Run sent: autopay charges queued, emails out, 6 letters to the mail service (mock).'); });
RL.act('inv-approve', toast('Approved and queued to send (mock).'));
RL.act('inv-return', toast('Returned to the preparer with a note (mock).'));

// ---------------------------------------------------------------- Money: invoice editor (07 §4.4, §4.5, §6.6)
function invLines(c, inv) {
  const D = c.D, tax = TAX(c), cl = D.clients.find(x => x.id === inv.clientId) || { type: 'residential' };
  const hero = inv.client === D.res.client && D.res.projectValue;
  const deposit = hero ? (D.proposals[0] || {}).deposit || 0 : 0;
  const matShare = !tax.svc && tax.matRate ? .2 : 0;
  const eff = tax.svc ? tax.rate / 100 : matShare * (tax.matRate || 0) / 100;
  const gross = r2((inv.amount + deposit) / (1 + eff));
  let lines;
  if (hero) lines = [['Progress billing: patio and planting, phase 2 of 3', 1, null, 'capital_improvement_labor'], ['Pavers, base and edging (materials)', 1, null, 'tangible_materials']];
  else if (cl.type !== 'residential') lines = [[`Monthly grounds maintenance, ${mdate(c, 'May')} 2027`, 1, null, 'landscape_maintenance_labor'], ['Enhancement: entrance beds (annuals + mulch)', 1, null, 'landscape_maintenance_labor'], ['Irrigation check and adjustments', 2, null, 'irrigation_service']];
  else lines = [[c.winter ? 'Snow push, driveway (3 storms)' : 'Weekly mowing (4 visits)', c.winter ? 3 : 4, null, c.winter ? 'snow_ice_removal' : 'lawn_maintenance_labor'], ['Shrub pruning and bed edging', 1, null, 'landscape_maintenance_labor'], ['Mulch, 2 cu yd installed', 1, null, 'tangible_materials']];
  const shares = hero ? [.7, .3] : cl.type !== 'residential' ? [.72, .2, .08] : [.46, .3, .24];
  let acc = 0;
  lines = lines.map((l, k) => { const amt = k === lines.length - 1 ? r2(gross - acc) : r2(Math.round(gross * shares[k] / l[1]) * l[1]); acc = r2(acc + amt); return { d: l[0], q: l[1], rate: r2(amt / l[1]), amt, cat: l[3], taxable: tax.svc || (matShare && /materials/.test(l[3])) }; });
  const taxAmt = r2(inv.amount + deposit - gross);
  return { lines, gross, taxAmt, deposit, total: inv.amount, tax, cl, hero };
}
RL.screen('web.invoice', (c) => {
  const D = c.D, invs = ownInvoices(c);
  const inv = invs.find(i => i.id === c.x) || D.invoices.find(i => i.id === c.x && c.role !== 'estimator') || invs.find(i => i.po && i.status !== 'Paid') || invs[0];
  if (!inv) return h.page({ title: 'Invoice editor' }) + h.empty('No invoice to show for your clients.');
  const L = invLines(c, inv), canEdit = c.can('invoice').includes('W') && inv.status !== 'Paid', ro = !canEdit;
  const portal = portalHost(c), link = `https://${portal}/pay/${inv.id}`;
  const po = inv.po ? { n: inv.po, cap: Math.round(inv.amount * (1.6 + (hs(inv.po) % 5) / 10) / 100) * 100 } : null;
  const poUsed = po ? Math.round(po.cap * .3) + inv.amount : 0, X = invX(c, inv);
  const linesTbl = `<div class="tb-wrap"><table class="tb"><thead><tr><th>Description and tax category</th><th class="n">Qty</th><th class="n">Rate</th><th>Taxed</th><th class="n">Amount</th></tr></thead><tbody>${L.lines.map(l => `<tr><td><b>${esc(l.d)}</b><div class="mono tiny t3">${esc(l.cat)}</div></td><td class="n">${l.q}</td><td class="n nowrap">${P(c, l.rate, { cents: true })}</td><td>${l.taxable ? h.pill('Yes', '') : '<span class="tiny t3">No</span>'}</td><td class="n nowrap">${P(c, l.amt, { cents: true })}</td></tr>`).join('')}</tbody><tfoot>
    <tr><td colspan="4">Subtotal</td><td class="n">${P(c, L.gross, { cents: true })}</td></tr>
    <tr><td colspan="4" style="font-weight:500">Sales tax · ${esc(L.tax.jur)} ${L.tax.svc ? L.tax.rate + '%' : L.tax.matRate ? L.tax.matRate + '% on materials' : 'not taxable'} <span class="tiny t3">(${esc(L.tax.engine)})</span></td><td class="n" style="font-weight:500">${P(c, L.taxAmt, { cents: true })}</td></tr>
    ${L.deposit ? `<tr><td colspan="4" style="font-weight:500">Less deposit applied (PR-2290, held in 2100 Customer deposits)</td><td class="n" style="font-weight:500">-${P(c, L.deposit, { cents: true })}</td></tr>` : ''}
    <tr><td colspan="4">Total due</td><td class="n">${P(c, L.total, { cents: true })}</td></tr></tfoot></table></div>`;
  const head = h.cols('3', [h.field('Client', `<div style="padding:7px 0;line-height:1.3">${c.role === 'estimator' ? esc(inv.client) : h.link(esc(inv.client), 'web.client', inv.clientId)}</div>`), h.field('Invoice date', h.input(mdate(c, X.date) + (c.winter && /^(Nov|Dec)/.test(mdate(c, X.date)) ? ', 2026' : ', 2027'), { ro })), h.field('Due', h.input(mdate(c, X.due) + (c.winter && /^(Nov|Dec)/.test(mdate(c, X.due)) ? ', 2026' : ', 2027'), { ro }), X.past ? `${X.past} days past due` : ''), h.field('PO number', h.input(inv.po || '', { ro, ph: L.cl.type === 'residential' ? 'Not required' : 'Required for this client' }), po ? `PO ceiling ${money(po.cap)}; ${Math.min(100, Math.round(100 * poUsed / po.cap))}% used after this invoice` : ''), h.field('Terms', h.select(['Net 15', 'Net 30', 'Due on receipt'], 'Net ' + X.terms, { label: 'Terms' })), h.field('Deliver by', h.select(['Email + portal', 'Email + mail', 'Portal only'], 'Email + portal', { label: 'Delivery' }))]);
  const pay = h.card({ title: 'Pay link', sub: `Paid into ${esc(c.t.name)}'s own Stripe account`, body: `<div class="flex nw" style="align-items:flex-start;gap:12px">${qr(inv.id)}<div class="stack8" style="min-width:0"><span class="mono tiny" style="word-break:break-all">${esc(link)}</span><div class="flex">${h.btn('Copy link', { sm: true, icon: 'copy', act: 'inv-copy' })}${h.btn('Text to client', { sm: true, icon: 'chat', act: 'inv-text' })}</div><div class="tiny t2">Card, ACH bank transfer, Apple Pay and Google Pay. ACH costs the Company far less than cards on large invoices.</div></div></div>${inv.autopay ? h.pill('Autopay on file: charges on the due date', 'ok') : ''}${c.inLens('V1') ? `<div class="tiny t3">Card surcharging and ACH discounts ${h.tag('V1')} follow state rules.</div>` : ''}` });
  const proof = h.card({ title: 'Client view', sub: 'Portal and PDF include proof of service', body: `<div class="cols cols-2">${h.photo(c.winter ? 'snow' : 'lawn', { label: 'Visit photo', badge: mdate(c, 'May 4') + ' 9:12 am' })}${h.photo(c.winter ? 'snow' : 'after', { label: 'Visit photo', badge: mdate(c, 'May 10') + ' 8:40 am' })}</div><div class="tiny t2">${L.cl.type === 'residential' ? '4 visits' : 'Monthly service log'} with photos, crew and times attached. Clients pay from the portal at ${esc(portal)}.</div>` });
  const act = h.card({ title: 'Activity', body: h.timeline([{ when: mdate(c, X.date), text: `Created by the ${c.winter ? 'January' : 'May'} billing run`, tone: 'info' }, inv.status !== 'Draft' && { when: mdate(c, X.date), text: 'Sent by email and portal', tone: 'info' }, inv.status !== 'Draft' && { when: mdate(c, fromDoy(Math.min(TODAY, doy(X.date) + 2))), text: 'Viewed 2 times in the portal' }, inv.status === 'Overdue' && { when: 'Today', text: 'Collections agent (A5) drafted reminder 2 for review', tone: 'ai' }, inv.status === 'Paid' && { when: mdate(c, X.date), text: `Paid in full by ${inv.autopay ? 'autopay' : 'card'}; fee paid to Stripe`, tone: 'ok' }].filter(Boolean)) });
  const actions = ro ? '' : [h.btn('Save draft', { act: 'inv-save' }), c.allowed('payment.record') ? h.btn('Record payment', { modal: 'pay-record' }) : '', c.allowed('invoice.void') ? h.btn('Void', { kind: 'ghost', act: 'inv-void' }) : '', c.allowed('invoice.send') ? h.btn(inv.status === 'Draft' ? 'Send' : 'Resend', { kind: 'primary', icon: 'send', act: 'inv-send' }) : ''].join('');
  const memoF = h.field('Message to client', h.textarea(L.cl.type === 'residential' ? 'Thanks for choosing us this season. Photos from each visit are attached.' : 'Service log and photos attached. Please reference the PO on payment.', { label: 'Message' }));
  return h.page({ crumbs: [['Money', 'web.invoices'], ['Invoices', 'web.invoices'], [esc(inv.id)]], title: `Invoice ${esc(inv.id)}`, sub: `${esc(inv.client)} · ${P(c, inv.amount, { cents: true })} · balance ${P(c, inv.balance, { cents: true })}`, tags: st(inv.status) + (inv.po ? h.pill(esc(inv.po), 'info') : '') + (L.deposit ? h.pill('Deposit applied', 'accent') : ''), actions })
    + (inv.status === 'Paid' ? h.banner(`${icon('lock')} Paid invoices are locked. Use a credit memo or refund to change them (07 §4.6).`, 'info') : '') + (c.role === 'estimator' ? h.banner(`${icon('eye')} Read-only: estimators see invoices for their own clients (invoice = R/o).`, 'info') : '')
    + h.cols('21', [stack([h.card({ title: 'Details', body: head }), h.card({ title: 'Lines', flush: true, body: linesTbl }), h.card({ body: memoF + h.note(esc(L.tax.note) + ' Each invoice stores the tax engine request and response as evidence.') })]), stack([pay, proof, act])]);
});
RL.modal('pay-record', (c) => ({ title: 'Record a payment', body: h.cols('2', [h.field('Method', h.select(['Check', 'Cash', 'ACH outside Stripe'], 'Check', { label: 'Method' })), h.field('Amount', h.input('', { ph: '0.00' })), h.field('Check number', h.input('', { ph: '1187' })), h.field('Deposit to', h.select(['Undeposited funds', 'Operating checking'], 'Undeposited funds', { label: 'Deposit to' }))]) + h.note('Offline payments post to Undeposited funds until the bank deposit matches (09).'), foot: h.btn('Record', { kind: 'primary', act: 'pay-rec-ok' }) + h.btn('Cancel', { act: 'noop' }) }));
RL.act('pay-rec-ok', () => { RL.closeModal(); RL.toast('Payment recorded (mock).'); return false; });
RL.act('inv-save', toast('Draft saved (mock).'));
RL.act('inv-send', toast('Sent by email with the pay link; the portal shows it now (mock).'));
RL.act('inv-void', toast('Void needs a reason and reverses the ledger posting (mock).'));
RL.act('inv-copy', toast('Pay link copied.'));
RL.act('inv-text', toast('Pay link texted to the billing contact (mock).'));

// ---------------------------------------------------------------- Money: payments (08)
RL.screen('web.payments', (c) => {
  const D = c.D, pays = allPayments(c), tab = h.tab('pay.tab', 'pay');
  const gross = sum(pays, p => p.amount), fees = r2(sum(pays, p => p.fee));
  let body = '';
  if (tab === 'pay') {
    body = h.table([{ k: 'id', label: 'Payment', m: true }, { k: 'date', label: 'Date', fmt: v => `<span class="nowrap">${mdate(c, v)}</span>` }, { k: 'client', label: 'Client' }, { k: 'invoice', label: 'Invoice', fmt: v => `<span class="nowrap">${h.link(esc(v), 'web.invoice', v)}</span>` }, { k: 'method', label: 'Method', fmt: v => `<span class="nowrap">${esc(v.replace('Card on file (autopay)', 'Autopay, card'))}</span>` }, { k: 'amount', label: 'Amount', n: true, fmt: v => cents(v) }, { k: 'fee', label: 'Stripe fee', n: true, fmt: v => v ? cents(v) : '<span class="t3">$0.00</span>' }, { k: 'amount', label: 'Net', n: true, fmt: (v, r) => cents(v - r.fee) }, { k: 'payout', label: 'Payout', fmt: v => v === 'deposit' ? '<span class="tiny t2 nowrap">Bank deposit</span>' : `<span class="mono tiny">${v}</span>` }], pays, { dense: true, foot: ['Total', '', '', '', '', cents(gross), cents(fees), cents(gross - fees), ''] }) + `<div class="tiny t2">Rootline fee on every payment: <b>$0.00</b>. Checks and cash go to the bank, not through Stripe.</div>`;
  } else if (tab === 'dep') {
    const deps = D.proposals.filter(p => p.status === 'Signed' || p === D.proposals[0]).map((p, i) => ({ id: p.id, client: p.client, amount: p.deposit, date: ['Apr 19', 'May 2', 'May 6'][i % 3], status: i === 0 ? 'Applied' : 'Held' }));
    body = h.table([{ k: 'id', label: 'Proposal', m: true }, { k: 'client', label: 'Client' }, { k: 'date', label: 'Paid', fmt: v => mdate(c, v) }, { k: 'amount', label: 'Deposit', n: true, fmt: v => money(v) }, { k: 'status', label: 'Status', fmt: v => v === 'Applied' ? h.pill('Applied to invoice', 'ok') : h.pill('Held in 2100', 'info') }], deps) + h.note('Deposits post to 2100 Customer deposits (a liability) and move to revenue only when applied to an invoice. The period close proves 2100 against this list.');
  } else if (tab === 'cm') {
    const cm = [['CM-104', D.clients[1].name, 'Drought skips credited (2 visits)', 110, 'Applied'], ['CM-105', D.clients[4].name, 'Goodwill: sprinkler head damaged by mower', 45, 'Applied'], ['CM-106', D.clients[7].name, 'Duplicate charge refunded to card', 240, 'Refunded']];
    body = h.table([{ k: 0, label: 'Credit memo', m: true }, { k: 1, label: 'Client' }, { k: 2, label: 'Reason' }, { k: 3, label: 'Amount', n: true, fmt: v => money(v) }, { k: 4, label: 'Status', fmt: v => st(v === 'Applied' ? 'Posted' : 'Done').replace(/Posted|Done/, v) }], cm.map(r => Object.assign([], r))) + `<div class="flex">${c.allowed('credit_memo') ? h.btn('New credit memo', { icon: 'plus', act: 'cm-new' }) : ''}${c.allowed('payment.refund') ? h.btn('Refund a payment', { act: 'pay-refund' }) : ''}</div>`;
  } else {
    const com = D.clients.filter(x => x.type !== 'residential' || x.balance).slice(0, 6);
    body = h.table([{ k: 'name', label: 'Client' }, { k: 'type', label: 'Type' }, { k: 'balance', label: 'Balance', n: true, fmt: v => money(v) }, { k: 'pastDue', label: 'Oldest', fmt: v => v ? `${v} days` : 'Current' }, { k: 'email', label: 'Send to', fmt: v => `<span class="tiny">${esc(v)}</span>` }], com) + `<div class="flex">${h.btn('Send statements', { kind: 'primary', icon: 'send', act: 'stmt-send' })}</div>`;
  }
  const plan = c.planCode === 'starter' && c.inLens('V1') ? h.card({ title: `Pay-as-you-grow plan ${h.tag('V1')}`, body: `<p class="small t2">Opt-in: a lower subscription plus 0.5% per payment, capped at $10.00, shown as a Stripe application fee in your own Stripe Dashboard. Tips are never fee'd. Off by default.</p>` }) : '';
  return h.page({ title: 'Payments', sub: `${pays.length} payments · ${esc(c.t.name)}'s own Stripe account`, actions: (c.allowed('payment.record') ? h.btn('Record payment', { icon: 'plus', modal: 'pay-record' }) : '') + h.btn('Stripe payouts', { icon: 'bank', go: 'web.stripe' }) })
    + h.banner(`${icon('shield')} Clients pay you through your own Stripe account. Stripe's fees go to Stripe; Rootline adds nothing (Zero-Markup Pledge, 08 §4.24).`, 'info')
    + h.kpis([{ label: 'Collected', value: money(gross), delta: `since ${mdate(c, 'Apr 1')}` }, { label: 'Stripe fees', value: cents(fees), delta: `${(100 * fees / gross).toFixed(2)}% effective`, tone: 'info' }, { label: 'Rootline markup', value: '$0.00', delta: 'Zero-Markup Pledge', tone: 'ok' }, { label: 'Autopay', value: c.D.kpi.autopayPct + '%', delta: 'of clients, card or ACH on file' }, { label: 'Failed payments', value: '1', delta: 'retry Thu; card update link sent', tone: 'warn' }])
    + h.tabs('pay.tab', [['pay', 'Payments', pays.length], ['dep', 'Deposits'], ['cm', 'Credit memos'], ['stmt', 'Statements']], 'pay') + body + plan
    + h.note('Fees shown use Stripe standard US pricing for illustration (cards 2.9% + 30¢, ACH 0.8% capped at $5). Your rate is whatever Stripe charges your account; verify in your Stripe Dashboard.');
});
RL.act('cm-new', toast('Credit memo: pick the invoice, amount and reason; it posts to the ledger (mock).'));
RL.act('pay-refund', toast('Refund routes for approval above your limit (mock).'));
RL.act('stmt-send', toast('Statements sent with a pay-all link (mock).'));

// ---------------------------------------------------------------- Money: receivables and collections (07 §4.9, §6.4; 17 A5)
RL.screen('web.ar', (c) => {
  const D = c.D, ag = D.aging, total = sum(Object.values(ag)), estimator = c.role === 'estimator';
  let q = arQueue(c);
  if (estimator) { const mine = new Set(D.opps.filter(o => o.owner === c.who).map(o => o.clientId)); q = q.filter(x => mine.has(x.id)); }
  const sel = q.find(x => x.id === RL.ui['ar.sel']) || q[0];
  const draft = RL.ui['ar.draft'];
  const canAct = c.can('invoice').includes('W') && !estimator;
  const bucket = (l, v, tone) => ({ label: l, value: P(c, v), tone, delta: total ? Math.round(100 * v / total) + '% of AR' : '' });
  const queue = h.card({ title: 'Collections queue', sub: `${q.length} clients with open invoices · most days past due first`, flush: true, body: q.length ? `<div class="li">${q.slice(0, 10).map(x => `<div class="li-i go${sel && sel.id === x.id ? '' : ''}" data-ui="ar.sel" data-val="${x.id}" role="button" tabindex="0" style="${sel && sel.id === x.id ? 'background:var(--primary-soft)' : ''}"><span class="ico ${x.pastDue > 60 ? 'danger' : x.pastDue ? 'warn' : ''}">${icon(x.type === 'residential' ? 'user' : 'building')}</span><div class="grow"><div class="tt">${esc(x.name)}</div><div class="ss">${x.pastDue ? x.pastDue + ' days past due' : 'Current'} · ${x.autopay ? (x.pastDue ? 'autopay declined' : 'autopay') : 'invoice'}</div></div><div class="flex nw"><b class="num">${P(c, x.balance)}</b></div></div>`).join('')}</div>` : h.empty('No open balances.') });
  let detail = '';
  if (sel) {
    const rows = sel.inv.slice().sort((a, b) => (b.past || 0) - (a.past || 0));
    const step = sel.pastDue > 45 ? 4 : sel.pastDue > 30 ? 3 : sel.pastDue > 10 ? 2 : sel.pastDue ? 1 : 0;
    const ladder = ['Day 3: friendly email with photos', 'Day 10: email + SMS', 'Day 21: statement', 'Day 30: phone call task', 'Day 45: service hold suggestion (needs approval)'];
    const msg = `Hi ${first(sel.contact)}, a quick note that ${rows[0].id} for ${money(rows[0].balance)} is ${rows[0].past ? rows[0].past + ' days past due' : 'due ' + mdate(c, rows[0].due)}. Photos from each visit are attached. You can pay securely here: https://${portalHost(c)}/pay/${rows[0].id}. Reply if anything looks off. - ${c.t.name}`;
    detail = h.card({ title: esc(sel.name), sub: `${esc(sel.contact)} · ${esc(sel.email)}`, body: h.table([{ k: 'id', label: 'Invoice', m: true, fmt: v => h.link(esc(v), 'web.invoice', v) }, { k: 'date', label: 'Date', fmt: v => mdate(c, v) }, { k: 'due', label: 'Due', fmt: (v, r) => `${mdate(c, v)}${r.past ? ` <span class="tiny" style="color:var(--danger-text)">${r.past} d late</span>` : ''}` }, { k: 'balance', label: 'Balance', n: true, fmt: v => P(c, v) }, { k: 'status', label: 'Status', fmt: v => st(v) }], rows, { dense: true, foot: rows.length > 1 ? ['Total', '', '', P(c, sel.balance), ''] : null })
      + `<b class="small">Reminder ladder</b><div class="stack8">${ladder.map((l, i) => `<div class="flex nw small">${i < step ? `<span style="color:var(--ok-text)">${icon('check')}</span>` : i === step ? `<span style="color:var(--warn-text)">${icon('clock')}</span>` : '<span class="t3">' + icon('clock') + '</span>'}<span class="${i <= step ? '' : 't3'}">${l}</span></div>`).join('')}</div>` + h.note('Service holds are never automatic, and invoicing and the portal stay open whatever the dunning state.') })
      + (estimator ? '' : (draft === sel.id ? h.card({ tone: 'ai', title: 'Reminder draft · Collections (A5)', sub: 'L2: a person sends it · 1 credit used', body: h.textarea(msg, { label: 'Reminder message' }) + `<div class="flex">${h.btn('Send email + SMS', { kind: 'primary', icon: 'send', act: 'ar-send' })}${h.btn('Discard', { kind: 'ghost', ui: 'ar.draft', val: '' })}</div>` })
        : h.aiCard({ agent: 'Collections (A5)', level: 'L2', credits: 1, title: sel.pastDue ? `Next step: ${ladder[Math.min(step, 4)].split(': ')[1]}` : 'No action needed', body: sel.pastDue ? `Drafts a ${sel.type === 'residential' ? 'warm' : 'formal'} reminder with visit photos and the pay link. Quoted at 1 credit; you review before it sends.` : 'Balance is current. The agent checks again tomorrow.', actions: sel.pastDue && canAct ? h.btn('Draft reminder (1 cr)', { kind: 'ai', icon: 'spark', ui: 'ar.draft', val: sel.id }) : '' })))
      + (c.inLens('V1') && !estimator ? h.card({ title: `Payment plan ${h.tag('V1')}`, body: `<p class="small t2">Split ${P(c, sel.balance)} into 3 monthly autopay installments. The full Collections agent ${h.tag('V1')} can offer this and record promises to pay.</p>${c.has('agents_v1') ? h.btn('Offer a plan', { sm: true, act: 'ar-plan' }) : lockBtn(c, 'Offer a plan', 'agents_v1')}` }) : '');
  }
  return h.page({ title: 'Receivables', sub: `AR ${P(c, total)} · DSO 27 days${estimator ? ' · your clients only' : ''}`, actions: canAct ? h.btn('Send statements', { icon: 'send', act: 'stmt-send' }) : '' })
    + h.kpis([bucket('Current', ag.current, 'ok'), bucket('1-30 days', ag.d30, 'warn'), bucket('31-60 days', ag.d60, 'warn'), bucket('Over 60 days', ag.d90, 'danger')])
    + h.cols('12', [queue, stack([detail])]) + (estimator ? roNote(c, 'status only for your own clients; reminders are sent by the office.') : '');
});
RL.act('ar-send', (el, ev, c) => { RL.ui['ar.draft'] = ''; RL.toast('Reminder sent by email and SMS; logged on the client timeline (mock).'); });
RL.act('ar-plan', toast('Plan offer drafted: 3 installments on autopay (mock).'));

// ---------------------------------------------------------------- Money: Stripe payouts and disputes (08 §4.17, §4.19, §6.6)
RL.screen('web.stripe', (c) => {
  const D = c.D, tab = h.tab('stripe.tab', 'payouts'), pos = payouts(c);
  const sel = pos.find(p => p.id === RL.ui['po.sel']) || pos[2];
  const acct = 'acct_1Q' + (hs(c.t.id) % 1e6).toString(36).toUpperCase().padStart(4, 'X') + 'Lm';
  const health = h.list([{ icon: 'check', tone: 'ok', title: 'Charges and payouts enabled', sub: 'No requirements due' }, { icon: 'check', tone: 'ok', title: 'Webhooks healthy', sub: 'Last event 2 min ago' }, { icon: 'bank', title: 'Payouts: daily, 2-day rolling', sub: 'To Operating checking ••4421' }]);
  const takes = h.card({ title: 'What Rootline takes', body: h.kv([['Application fee', '$0.00 on every charge'], ['Stripe fees', 'Paid to Stripe, shown per payout'], ['Checks and cash', 'Deposited to your bank; never through Stripe'], ['Pay-as-you-grow', 'Opt-in only ' + h.tag('V1')]]) });
  let body = '';
  if (tab === 'payouts') {
    const tbl = `<div class="tb-wrap"><table class="tb"><thead><tr><th>Arrives</th><th>Payout</th><th class="n">Gross</th><th class="n">Stripe fees</th><th class="n">Refunds</th><th class="n">Net</th><th>Bank match</th></tr></thead><tbody>${pos.map(p => `<tr class="go${p.id === sel.id ? ' hl' : ''}" data-ui="po.sel" data-val="${p.id}"><td>${mdate(c, p.arrive)}</td><td class="m">${p.id}</td><td class="n">${cents(p.gross)}</td><td class="n">${cents(p.fees)}</td><td class="n">${cents(p.refunds)}</td><td class="n"><b>${cents(p.net)}</b></td><td>${p.bank ? h.pill(`Matched ${p.bank.id} · ${mdate(c, p.bank.date)}`, 'ok', 'check') : p.status === 'In transit' ? h.pill('In transit', 'info') : h.pill('Reconciled (April)', '')}</td></tr>`).join('')}</tbody></table></div>`;
    const ok = Math.abs(sum(sel.lines, l => l.amount - l.fee) - sel.net) < .005;
    const det = h.card({ title: `${sel.id} detail`, sub: `${sel.lines.length} balance transactions · ${sel.status}`, body: h.table([{ k: 'invoice', label: 'Invoice', fmt: v => `<span class="nowrap">${h.link(esc(v), 'web.invoice', v)}</span>` }, { k: 'client', label: 'Client' }, { k: 'method', label: 'Method', fmt: v => `<span class="nowrap">${esc(v.replace('Card on file (autopay)', 'Autopay, card'))}</span>` }, { k: 'amount', label: 'Gross', n: true, fmt: v => cents(v) }, { k: 'fee', label: 'Fee', n: true, fmt: v => cents(v) }, { k: 'amount', label: 'Net', n: true, fmt: (v, r) => cents(v - r.fee) }], sel.lines, { dense: true, foot: ['Sum', '', '', cents(sel.gross), cents(sel.fees), cents(sel.net)] })
      + `<div class="flex">${ok ? h.pill(`Sum of net = ${cents(sel.net)} = payout amount · clearing proof OK`, 'ok', 'check') : h.pill('Mismatch: exception task created', 'danger')}${sel.bank ? h.btn('Open bank line', { sm: true, go: 'web.banking' }) : ''}${sel.id === 'po_1007' ? h.btn('Journal JE-10446', { sm: true, go: 'web.journal' }) : ''}</div>` });
    body = tbl + det;
  } else if (tab === 'disputes') {
    const cl = D.clients.find(x => x.type === 'residential' && !x.hero) || D.clients[0];
    body = h.cols('21', [h.card({ title: `Dispute dp_${(hs(cl.id) % 1e5)} · ${esc(cl.name)}`, sub: 'Reason: product not received · $340.00 · respond by May 24', actions: h.pill('Needs response', 'warn'), body: h.kv([['Charge', 'Fall cleanup, card ending 4242'], ['Stripe dispute fee', '$15.00 (Stripe; refunded if you win, per Stripe policy, verify)'], ['Status', 'Funds withdrawn pending outcome']]) + `<b class="small">Evidence assembled</b>` + h.list([{ icon: 'camera', tone: 'ok', title: 'Visit photos with GPS and timestamps (6)', sub: 'Before and after, Oct 28' }, { icon: 'pen', tone: 'ok', title: 'Signed service agreement', sub: 'Accepted in the portal' }, { icon: 'eye', tone: 'ok', title: 'Portal activity', sub: 'Invoice viewed twice before payment' }, { icon: 'chat', tone: 'ok', title: 'Completion notice and reply', sub: '"Looks great, thanks"' }]) }),
      stack([h.aiCard({ agent: 'Dispute Evidence (A28)', level: 'L2', credits: 2, title: 'Evidence packet drafted', body: 'Assembled from the visit, agreement and portal records for the "product not received" reason code. A person reviews and submits; the agent never submits.', actions: c.allowed('dispute.respond') ? h.btn('Review and submit', { kind: 'primary', act: 'dsp-submit' }) : '' }), h.card({ title: 'Disputes this year', body: h.kv([['Opened', '2'], ['Won', '1'], ['Open', '1'], ['Dispute rate', '0.04%']]) })])]);
  } else {
    const avail = Math.round(sum(pos.filter(p => p.status === 'In transit'), p => p.net) * .4), pend = pos[0].net;
    body = h.kpis([{ label: 'Available', value: cents(avail) }, { label: 'Pending', value: cents(pend) }, { label: 'In transit to bank', value: cents(pos[0].net) }]) + h.note('Instant payouts, where Stripe offers them, are set up in your own Stripe Dashboard at Stripe\'s price. Rootline adds no markup (08 §4.24).');
  }
  return h.page({ title: 'Stripe payouts and disputes', sub: `Read-through to ${esc(c.t.name)}'s connected Stripe account · ${acct}`, actions: h.btn('Open Stripe Dashboard', { icon: 'external', act: 'stripe-open' }) + h.btn('Connection settings', { go: 'web.settings.payments' }) })
    + h.tabs('stripe.tab', [['payouts', 'Payouts', pos.length], ['disputes', 'Disputes', 1], ['balance', 'Balance']], 'payouts') + body
    + h.cols('2', [h.card({ title: 'Account health', flush: true, body: health }), takes]);
});
RL.act('stripe-open', toast('Opens dashboard.stripe.com for this account in a new tab (mock).'));
RL.act('dsp-submit', toast('Evidence submitted to Stripe after your review (mock).'));

// ---------------------------------------------------------------- Books helpers (09)
const acct = (c, code) => (c.D.accounts.find(a => a.code === code) || { balance: 0, name: code }).balance;
const byType = (c, t) => c.D.accounts.filter(a => a.type === t);
const CONTROL = { '1050': 'Payments subledger (Stripe)', '1100': 'AR subledger (open invoices)', '2000': 'AP subledger (open bills)', '2100': 'Unapplied deposits', '2150': 'Agreement season meters', '2200': 'Sales tax report' };
const ledgerMode = c => c.t.books === 'qbo_system' ? 'C' : c.t.id === 'summit' ? 'B' : 'A';
const MODE = { A: ['Native', 'Rootline is the book of record'], B: ['Native + mirror', 'Rootline is the book of record; QuickBooks Online gets a read-only copy for the CPA and lender'], C: ['External sync', 'QuickBooks Online is the book of record; Rootline keeps the operational subledger'] };
const period = c => c.winter ? { name: 'December 2026', short: 'Dec', next: 'BD5 (Jan 8)', ytd: 'FY 2026', mtd: 'Jan to date', mtdK: .02 } : { name: 'April 2027', short: 'Apr', next: 'BD5 (May 7)', ytd: 'Year to date', mtd: 'May to date', mtdK: c.D.kpi.revenueMTD / Math.max(1, c.D.kpi.revenueYTD) };
const pnl = c => {
  const inc = byType(c, 'Income'), cogs = byType(c, 'COGS'), exp = byType(c, 'Expense');
  const ti = sum(inc, a => a.balance), tc = sum(cogs, a => a.balance), te = sum(exp, a => a.balance);
  return { inc, cogs, exp, ti, tc, te, gp: ti - tc, ni: ti - tc - te };
};
const BANK_SAFE = d => String(d).replace('SITEONE LANDSCAPE SUPPLY', 'REGIONAL LANDSCAPE SUPPLY').replace('SHELL OIL 5741', 'FUEL STATION 5741').replace('O REILLY AUTO', 'AUTO PARTS 0417').replace('GUSTO PAYROLL', 'PAYROLL SVC NET PAY');
const explain = (label, value, lines) => `<button type="button" class="btn sm ghost" data-modal="explain" data-label="${esc(label)}" data-value="${esc(value)}" data-lines="${esc(JSON.stringify(lines))}" title="Explain this number">${icon('help')}Explain</button>`;
RL.modal('explain', (c, el) => {
  let lines = []; try { lines = JSON.parse(el.dataset.lines || '[]'); } catch (e) { lines = []; }
  return { title: `Explain this number: ${esc(el.dataset.label)}`, body: `<div class="kp"><span class="l">${esc(el.dataset.label)}</span><span class="v">${esc(el.dataset.value)}</span></div>` + h.list(lines.map(([t, s, go]) => ({ icon: 'link', title: esc(t), sub: esc(s || ''), go: go || null }))) + h.note('Every figure traces to journal lines and their source documents (09 §4.13). The trace is deterministic; a Copilot summary costs 1 credit.'), foot: h.btn('Summarize with Copilot (1 cr)', { kind: 'ai', act: 'explain-ai' }) + h.btn('Close', { act: 'noop' }) };
});
RL.act('explain-ai', () => { RL.closeModal(); RL.toast('Copilot summary queued: 1 credit (mock).'); return false; });
const modeBanner = c => { const m = ledgerMode(c); return m === 'C' ? h.banner(`${icon('warn')} Operational subledger, not the book of record: QuickBooks Online holds the books.`, 'warn') : ''; };

// ---------------------------------------------------------------- Books: overview
RL.screen('web.books', (c) => {
  const D = c.D, W = c.winter, p = pnl(c), pr = period(c), m = ledgerMode(c);
  const cash = acct(c, '1000'), clearing = acct(c, '1050'), ar = acct(c, '1100'), ap = acct(c, '2000');
  const k = pr.mtdK, row = (l, v, o) => `<tr${o && o.b ? ' style="font-weight:700"' : ''}><td${o && o.ind ? ' style="padding-left:22px"' : ''}>${l}</td><td class="n">${money(Math.round(v * k))}</td><td class="n">${money(v)}</td><td class="n t3">${p.ti ? Math.round(100 * v / p.ti) + '%' : ''}</td></tr>`;
  const pl = `<div class="tb-wrap"><table class="tb dense"><thead><tr><th>Account</th><th class="n">${pr.mtd}</th><th class="n">${pr.ytd}</th><th class="n">% rev</th></tr></thead><tbody>${p.inc.map(a => row(esc(a.name), a.balance, { ind: 1 })).join('')}${row('Total revenue', p.ti, { b: 1 })}${p.cogs.map(a => row(esc(a.name), a.balance, { ind: 1 })).join('')}${row('Gross profit', p.gp, { b: 1 })}${p.exp.map(a => row(esc(a.name), a.balance, { ind: 1 })).join('')}${row('Net income', p.ni, { b: 1 })}</tbody></table></div>`;
  const months = W ? ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'] : ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
  const shape = W ? [1, .92, .88, .62, .48, .3] : [.38, .3, .34, .62, .9, .55];
  const revM = shape.map(s => Math.round(p.ti / 4.2 * s)), expM = shape.map((s, i) => Math.round(p.ti / 4.2 * (.46 + s * .42)));
  const close = closeChecks(c), done = close.filter(x => x.done).length;
  const mRev = Math.round(p.ti * k), inflow = [['Stripe payouts', Math.round(mRev * .78)], ['Check deposits', Math.round(mRev * .09)], ['Customer deposits', Math.round(acct(c, '2100') * .4)]];
  const outflow = [['Payroll', Math.round(acct(c, '5000') * k * .82)], ['Materials and plants', Math.round(acct(c, '5100') * k * .7)], ['Fuel and vehicles', Math.round((acct(c, '6000') || p.te * .12) * k)], ['Equipment loan', Math.round(acct(c, '1500') * .012)], ['Rent, insurance, software', Math.round(p.te * k * .3)]];
  const inT = sum(inflow, x => x[1]), outT = sum(outflow, x => x[1]), cmax = Math.max(inT, outT);
  const cashCard = h.card({ title: `Cash this month`, sub: `${pr.mtd} · operating checking`, actions: h.pill(`${inT - outT >= 0 ? '+' : '-'}${money(Math.abs(inT - outT))} net`, inT - outT >= 0 ? 'ok' : 'warn'), body: `<b class="small">In ${money(inT)}</b>` + h.bars(inflow.map(([l, v]) => ({ label: l, value: v, right: money(v) })), { max: cmax }) + `<b class="small">Out ${money(outT)}</b>` + h.bars(outflow.map(([l, v]) => ({ label: l, value: v, tone: 'accent', right: money(v) })), { max: cmax }) });
  return h.page({ title: 'Books', sub: `${MODE[m][0]} ledger · ${MODE[m][1]}`, actions: h.btn('Financial statements', { icon: 'chart', go: 'web.fin_reports' }) + h.btn('Period close', { kind: 'primary', icon: 'check', go: 'web.close' }) })
    + modeBanner(c)
    + h.kpis([{ label: 'Cash', value: money(cash + clearing), delta: `${money(clearing)} in Stripe clearing` }, { label: 'Receivables', value: money(ar), delta: 'ties to AR aging', tone: 'ok' }, { label: 'Payables', value: c.has('ledger_plus') ? money(ap) : '-', delta: c.has('ledger_plus') ? 'due in 30 days' : 'AP needs Ledger Plus' }, { label: `Revenue, ${pr.ytd.toLowerCase()}`, value: kmoney(p.ti) }, { label: 'Net income', value: kmoney(p.ni), delta: `${Math.round(100 * p.ni / p.ti)}% of revenue`, tone: 'ok' }])
    + h.cols('21', [stack([h.card({ title: 'Profit and loss snapshot', sub: 'Accrual basis · posted automatically from invoices, payments, time and bills', actions: explain('Net income', money(p.ni), [['Revenue ' + money(p.ti), 'Posted by billing runs and invoices (4000-4200)', 'web.journal'], ['Direct labor ' + money(acct(c, '5000')), 'Approved timesheets x burdened rates', 'web.journal'], ['Materials ' + money(acct(c, '5100')), 'Bills and receipts coded to jobs', 'web.bills'], ['Processing fees ' + money(acct(c, '6300')), 'Stripe fees from each payout', 'web.stripe']]), flush: true, body: pl }), cashCard]),
      stack([h.card({ title: 'Revenue and expenses', sub: 'Last 6 months', body: h.colchart(months, [{ values: revM, cls: 'c1' }, { values: expM, cls: 'c4' }], { label: 'Revenue and expenses by month', h: 140, money: true }) + `<div class="flex tiny t3"><span class="flex nw gap4">${dot('var(--primary)')}Revenue</span><span class="flex nw gap4">${dot('var(--clay-500)')}Expenses</span></div>` }),
        h.card({ title: `Close: ${pr.name}`, sub: `${done} of ${close.length} checks · target ${pr.next}`, body: h.progress(done, close.length, done === close.length ? '' : 'warn') + h.list(close.filter(x => !x.done).slice(0, 3).map(x => ({ icon: 'clock', tone: x.hard ? 'warn' : '', title: `${x.id} ${esc(x.t)}`, sub: x.hard ? 'Hard check: blocks the lock' : 'Soft check' }))) + h.btn('Open close checklist', { sm: true, go: 'web.close' }) }),
        h.card({ title: 'Bank feeds', flush: true, body: h.list([{ icon: 'bank', tone: 'ok', title: 'Operating checking ••4421', sub: 'Synced 2 h ago · 9 lines to review', right: `<b class="num">${money(cash)}</b>`, go: 'web.banking' }, { icon: 'card', tone: c.has('ledger_plus') ? 'ok' : '', title: 'Business card ••8812', sub: c.has('ledger_plus') ? 'Synced 2 h ago' : 'Ledger Essentials includes 1 bank feed', right: c.has('ledger_plus') ? `<b class="num">${money(-Math.round(cash * .06))}</b>` : lockPill(c, 'ledger_plus', 'Ledger Plus') }]) })])]);
});

// ---------------------------------------------------------------- Books: chart of accounts
RL.screen('web.coa', (c) => {
  const D = c.D, sel = D.accounts.find(a => a.code === RL.ui['coa.sel']) || D.accounts.find(a => a.code === '1100');
  const types = ['Asset', 'Liability', 'Equity', 'Income', 'COGS', 'Expense'];
  const rows = types.map(t => `<tr><td colspan="4" style="background:var(--surface-2);font-size:.7rem;text-transform:uppercase;letter-spacing:.05em;font-weight:750;color:var(--text-3)">${t}</td></tr>` + byType(c, t).map(a => `<tr class="go${a.code === sel.code ? ' hl' : ''}" data-ui="coa.sel" data-val="${a.code}"><td class="m">${a.code}</td><td><b>${esc(a.name)}</b>${CONTROL[a.code] ? ' ' + h.pill('Control', 'info', 'lock') : ''}</td><td>${esc(a.type)}</td><td class="n">${money(a.balance)}</td></tr>`).join('')).join('');
  const tbl = `<div class="tb-wrap"><table class="tb dense"><thead><tr><th>Code</th><th>Account</th><th>Type</th><th class="n">Balance</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  const acts = [['May 10', 'JE-10446', 'Payout po_1007', sel.code === '1000' ? 4812.4 : -Math.round(sel.balance * .03)], ['May 9', 'JE-10447', 'Deposit on PR-2290', Math.round(sel.balance * .02)], ['May 7', 'JE-10431', 'Payroll May 1-7', -Math.round(sel.balance * .05)], ['May 3', 'JE-10402', 'Billing run BR-2027-05', Math.round(sel.balance * .08)]];
  const side = h.card({ title: `${sel.code} ${esc(sel.name)}`, sub: `${esc(sel.type)} · balance ${money(sel.balance)}`, actions: explain(`${sel.code} ${sel.name}`, money(sel.balance), acts.map(([d, je, m, v]) => [`${je} · ${m}`, `${d} · ${money(v)}`, 'web.journal'])), body: (CONTROL[sel.code] ? h.banner(`${icon('lock')} Control account: posted only by ${esc(CONTROL[sel.code])}. Manual journal entries are blocked; adjustments go through ledger.control_account.adjust.`, 'info') : '') + h.table([{ k: 0, label: 'Date', fmt: v => mdate(c, v) }, { k: 1, label: 'Entry', m: true }, { k: 2, label: 'Memo' }, { k: 3, label: 'Amount', n: true, fmt: v => money(v) }], acts.map(r => Object.assign([], r)), { dense: true }) + h.kv([['Dimensions', c.has('ledger_advanced') ? 'Class (division), location (branch), job' : 'Job'], ['Tax line', sel.type === 'Income' ? 'Schedule C line 1 / 1120-S line 1a' : '-'], ['Sync mapping', ledgerMode(c) === 'A' ? 'None (native books)' : 'Mapped to QuickBooks']]) });
  const canEdit = c.can('ledger.account').includes('W');
  return h.page({ title: 'Chart of accounts', sub: `${D.accounts.length} accounts · landscape template · ${c.has('ledger_advanced') ? 'classes and locations on' : 'job dimension on every line'}`, actions: canEdit ? h.btn('New account', { kind: 'primary', icon: 'plus', act: 'coa-new' }) + h.btn('Import from QuickBooks', { act: 'coa-import' }) : '' })
    + modeBanner(c) + h.cols('21', [h.card({ flush: true, body: tbl }), side]);
});
RL.act('coa-new', toast('New account: code, name, type and tax line (mock).'));
RL.act('coa-import', toast('Import maps QuickBooks accounts to the landscape template; opening balances need a proof (mock).'));

// ---------------------------------------------------------------- Books: journal
function journal(c) {
  return memo(c, 'je', () => {
    const D = c.D, inv0 = D.invoices.slice().sort((a, b) => doy(invX(c, b).date) - doy(invX(c, a).date)).find(i => i.status === 'Sent') || D.invoices[0], inv0d = invX(c, inv0).date;
    const extra = [
      { id: 'JE-10431', date: 'May 7', memo: 'Payroll May 1-7 (payroll file import)', source: 'Payroll import', lines: [['5000 Direct labor', 18450, 0], ['1000 Operating checking', 0, 18450]], chain: [['Payroll run May 1-7', 'Approved timesheets, 3 crews', 'web.timesheets'], ['Bank line BL-503', 'Payroll provider net pay', 'web.banking']] },
      { id: 'JE-10439', date: 'May 9', memo: 'Bill B-221 regional supply (2-way matched to PO-3311)', source: 'AP bill', lines: [['5100 Materials and plants', 1840.22, 0], ['2000 Accounts payable', 0, 1840.22]], chain: [['Bill B-221', 'Matched to PO-3311 receipt', 'web.bills'], ['Job J-1042', 'Materials coded to Phase 4', 'web.job']] },
      { id: 'JE-10441', date: inv0d, memo: `Invoice ${inv0.id} posted (${inv0.client})`, source: 'Invoice', lines: [['1100 Accounts receivable', inv0.amount, 0], ['4100 Revenue: maintenance', 0, r2(inv0.amount / (1 + TAX(c).rate / 100))], ['2200 Sales tax payable', 0, r2(inv0.amount - r2(inv0.amount / (1 + TAX(c).rate / 100)))]].filter(l => l[1] || l[2]), chain: [[`Invoice ${inv0.id}`, inv0.client, 'web.invoice', inv0.id], ['Billing run BR-2027-05', 'Monthly + installments', 'web.invoices']] },
    ];
    const base = D.journal.map(j => Object.assign({}, j, { chain: /Payment/.test(j.memo) ? [[j.memo.split(' on ')[0], 'Stripe charge, card', 'web.payments'], [`Invoice ${j.memo.split(' on ')[1]}`, 'Applied in full', 'web.invoice', j.memo.split(' on ')[1]], ['Payout po_1021', 'In transit to bank', 'web.stripe']] : /Payout/.test(j.memo) ? [['Payout po_1007', '4 payments, fees $141.60', 'web.stripe'], ['Bank line BL-500', 'Matched automatically', 'web.banking']] : [['Proposal PR-2290', 'Deposit paid in the portal', 'web.proposal', 'PR-2290'], ['2100 Customer deposits', 'Applied when the progress invoice posts', 'web.coa']] }));
    const key = d => (/^Apr/.test(d) ? 400 : /^Mar/.test(d) ? 300 : 500) + Number(String(d).replace(/\D+/g, '') || 0);
    return base.concat(extra).sort((a, b) => key(b.date) - key(a.date) || (a.id < b.id ? 1 : -1));
  });
}
RL.screen('web.journal', (c) => {
  const jes = journal(c), sel = jes.find(j => j.id === RL.ui['je.sel']) || jes[0], f = h.tab('je.f', 'all');
  const rows = f === 'all' ? jes : f === 'manual' ? [] : jes.filter(j => j.source !== 'Manual');
  const dr = sum(sel.lines, l => l[1]), cr = sum(sel.lines, l => l[2]);
  const tbl = `<div class="tb-wrap"><table class="tb dense"><thead><tr><th>Entry</th><th>Date</th><th>Memo</th><th>Source</th><th class="n">Amount</th></tr></thead><tbody>${rows.map(j => `<tr class="go${j.id === sel.id ? ' hl' : ''}" data-ui="je.sel" data-val="${j.id}"><td class="m">${j.id}</td><td class="nowrap">${mdate(c, j.date)}</td><td>${esc(j.memo)}</td><td>${h.pill(esc(j.source), j.source === 'Manual' ? 'warn' : '')}</td><td class="n">${cents(sum(j.lines, l => l[1]))}</td></tr>`).join('') || `<tr><td colspan="5" class="t3">No manual entries this period. Everything above was posted by the system.</td></tr>`}</tbody></table></div>`;
  const detail = h.card({ title: `${sel.id} · ${mdate(c, sel.date)}`, sub: esc(sel.memo), actions: h.pill(Math.abs(dr - cr) < .005 ? 'Balanced' : 'Out of balance', Math.abs(dr - cr) < .005 ? 'ok' : 'danger'), flush: true, body: h.table([{ k: 0, label: 'Account' }, { k: 1, label: 'Debit', n: true, fmt: v => v ? cents(v) : '' }, { k: 2, label: 'Credit', n: true, fmt: v => v ? cents(v) : '' }, { k: 0, label: '', fmt: (v, r) => explain(v, cents(r[1] || r[2]), sel.chain.map(x => [x[0], x[1], x[2]])) }], sel.lines.map(l => Object.assign([], l)), { dense: true, foot: ['Total', cents(dr), cents(cr), ''] }) });
  const trace = h.card({ title: 'Source chain', sub: 'Where this entry came from', body: `<div class="flex">${sel.chain.map((x, i) => `${i ? `<span class="t3">${icon('arrow-r', 's')}</span>` : ''}<a href="#" data-go="${x[2]}"${x[3] ? ` data-x="${esc(x[3])}"` : ''} class="pill info" style="text-decoration:none">${esc(x[0])}</a>`).join('')}</div>` + h.kv([['Posted by', sel.source === 'Manual' ? esc(c.who) : 'Posting rule ' + esc(sel.source.toLowerCase())], ['Period', `${mdate(c, 'May')} 2027 (open)`], ['Reversible', sel.source === 'Manual' ? 'Yes, with reason' : 'Reverse the source document instead']]) });
  return h.page({ title: 'Journal', sub: `${jes.length} entries this week · every system entry links to its source`, actions: c.can('ledger.journal_entry').includes('W') ? h.btn('New journal entry', { kind: 'primary', icon: 'plus', modal: 'je-new' }) : '' })
    + modeBanner(c) + h.tabs('je.f', [['all', 'All', jes.length], ['system', 'System posted', jes.length], ['manual', 'Manual', 0]], 'all') + h.card({ flush: true, body: tbl }) + h.cols('2', [detail, trace]);
});
RL.modal('je-new', (c) => ({ title: 'New journal entry', body: h.cols('2', [h.field('Date', h.input(mdate(c, 'May 11') + ', 2027')), h.field('Memo', h.input('', { ph: 'Accrue April utilities' }))]) + h.table([{ k: 0, label: 'Account' }, { k: 1, label: 'Debit', n: true }, { k: 2, label: 'Credit', n: true }], [['6100 Insurance', '420.00', ''], ['2000 Accounts payable', '', '420.00']].map(r => Object.assign([], r)), { dense: true }) + h.banner(`${icon('lock')} Control accounts (1050, 1100, 2000, 2100, 2150, 2200) cannot take manual lines.`, 'warn'), foot: h.btn('Post', { kind: 'primary', act: 'je-post' }) + h.btn('Cancel', { act: 'noop' }) }));
RL.act('je-post', () => { RL.closeModal(); RL.toast('Journal entry posted (mock).'); return false; });

// ---------------------------------------------------------------- Books: bills and vendors (Ledger Plus)
function bills(c) {
  return memo(c, 'bills', () => {
    const v = c.D.vendors, sub = c.t.cast && c.t.cast.subcontractor;
    return [
      { id: 'B-221', vendor: v[0].name, date: 'May 9', due: 'Jun 8', amount: 1840.22, po: 'PO-3311', job: 'J-1042 · Install', match: 'Matched', status: 'Approved', lines: [['Pavers, concrete cobble (sq ft)', 380, 380, 3.85, 3.85], ['Base 21AA (ton)', 12, 12, 32, 32], ['Delivery', 1, 1, 33.22, 33.22]] },
      { id: 'B-222', vendor: v[1].name, date: 'May 8', due: 'Jun 7', amount: 2640, po: 'PO-3312', job: 'J-1045 · Planting', match: 'Price variance', status: 'Needs approval', lines: [['Little Lime Hydrangea #3', 24, 24, 38, 39.75], ['Northern Sea Oats #1', 60, 60, 12.5, 12.5], ['Delivery', 1, 1, 0, 0]] },
      { id: 'B-223', vendor: v[2].name, date: 'May 7', due: 'May 14', amount: 612.4, po: '', job: 'Overhead · Fuel', match: 'No PO (rule)', status: 'Approved', lines: [] },
      { id: 'B-224', vendor: sub || v[3].name, date: 'May 10', due: 'May 25', amount: 4800, po: 'PO-3315', job: 'J-1042 · Sub', match: 'Matched', status: 'Pending', note: 'Retainage 10% held; lien waiver requested', lines: [['Seat wall build (lump sum)', 1, 1, 4800, 4800]] },
      { id: 'B-225', vendor: 'Small engine repair (illustrative)', date: 'May 5', due: 'Jun 4', amount: 386, po: '', job: 'Equipment · Mower 2', match: 'No PO', status: 'Draft', ai: true, lines: [] },
    ];
  });
}
RL.screen('web.bills', (c) => {
  const D = c.D, bs = bills(c), tab = h.tab('bill.tab', 'bills'), sel = bs.find(b => b.id === RL.ui['bill.sel']) || bs[1];
  const canPay = c.allowed('bill_payment.approve');
  let body = '';
  if (tab === 'bills') {
    const tbl = `<div class="tb-wrap"><table class="tb"><thead><tr><th>Bill</th><th>Vendor</th><th>Date</th><th>Due</th><th>PO</th><th>Coded to</th><th>2-way match</th><th class="n">Amount</th><th>Status</th></tr></thead><tbody>${bs.map(b => `<tr class="go${b.id === sel.id ? ' hl' : ''}${b.ai ? ' ai' : ''}" data-ui="bill.sel" data-val="${b.id}"><td class="m">${b.id}</td><td>${esc(b.vendor)}${b.ai ? ' ' + h.ai('captured') : ''}</td><td>${mdate(c, b.date)}</td><td>${mdate(c, b.due)}</td><td class="m">${b.po || '-'}</td><td class="tiny">${esc(b.job)}</td><td>${h.pill(esc(b.match), b.match === 'Matched' ? 'ok' : /variance/.test(b.match) ? 'warn' : '')}</td><td class="n">${cents(b.amount)}</td><td>${st(b.status)}</td></tr>`).join('')}</tbody></table></div>`;
    const lines = sel.lines.length ? h.table([{ k: 0, label: 'Line' }, { k: 1, label: 'PO qty', n: true }, { k: 2, label: 'Bill qty', n: true }, { k: 3, label: 'PO price', n: true, fmt: v => cents(v) }, { k: 4, label: 'Bill price', n: true, fmt: (v, r) => v !== r[3] ? `<b style="color:var(--warn-text)">${cents(v)}</b>` : cents(v) }, { k: 4, label: 'Result', fmt: (v, r) => v === r[3] && r[1] === r[2] ? h.pill('OK', 'ok') : h.pill(`+${cents((v - r[3]) * r[2])}`, 'warn') }], sel.lines.map(r => Object.assign([], r)), { dense: true }) : `<p class="small t2">${sel.ai ? 'Captured from the AP inbox; no PO. Code it to a job or overhead, then approve.' : 'No PO: coded by a vendor rule.'}</p>`;
    const variance = sel.lines.length ? r2(sum(sel.lines, l => (l[4] - l[3]) * l[2])) : 0;
    const det = h.card({ title: `${sel.id} · ${esc(sel.vendor)}`, sub: `${sel.po ? 'Matched against ' + sel.po : 'No purchase order'} · tolerance 2% or $50`, body: lines + (variance ? h.banner(`${icon('warn')} Price variance ${cents(variance)} (${(100 * variance / sel.amount).toFixed(1)}%) is inside $50 but needs approval by Company rule.`, 'warn') : '') + h.kv([['Coded to', esc(sel.job)], ['Terms', 'Net 30'], sel.note && ['Note', esc(sel.note)]]) + `<div class="flex">${canPay && sel.status !== 'Approved' ? h.btn('Approve', { kind: 'primary', act: 'bill-approve' }) : ''}${canPay && sel.status === 'Approved' ? h.btn('Schedule payment', { kind: 'primary', act: 'bill-pay' }) : ''}${!canPay ? `<span class="small t2">Bill payments are approved by ${esc(c.owner)} or the bookkeeper (bill_payment.approve).</span>` : ''}</div>` });
    body = tbl + h.cols('2', [det, c.has('agents_v1') ? h.aiCard({ agent: 'AP agent (A9)', level: 'L2', credits: 2, title: 'Vendor bills from the AP inbox', body: 'Reads emailed bills, matches them to POs and receipts, codes them to jobs and flags duplicates. About 2 credits per page, quoted before each batch.', why: h.tag('V1'), actions: h.btn('Process 3 new bills (6 cr)', { kind: 'ai', act: 'bill-ai' }) }) : h.card({ title: 'AP inbox', body: `<p class="small t2">Forward bills to ap@${esc(c.t.id)}.rootline.app; they land as drafts to code and approve.</p>` })]);
  } else {
    body = h.table([{ k: 'name', label: 'Vendor' }, { k: 'category', label: 'Category' }, { k: 'terms', label: 'Terms' }, { k: 'category', label: '1099', fmt: v => v === 'Subcontractor' ? h.pill('1099-NEC', 'info') : '-' }, { k: 'id', label: 'COI and W-9', fmt: (v, r) => r.category === 'Subcontractor' ? h.pill('COI valid to Mar 2028 · W-9 on file', 'ok') : '<span class="t3">-</span>' }, { k: 'id', label: 'Bank details', fmt: () => h.mask(c, 'vendor_banking', '<span class="mono tiny">ACH ••6610 (dual control)</span>') }], D.vendors) + h.note('Vendor bank details need two people to change (dual control). Office managers never see them (field class vendor_banking).');
  }
  const due = sum(bs.filter(b => b.status !== 'Draft'), b => b.amount);
  return h.page({ title: 'Bills and vendors', sub: `${bs.length} open bills · ${cents(due)} due in 30 days`, actions: c.can('bill').includes('W') ? h.btn('New bill', { kind: 'primary', icon: 'plus', act: 'bill-new' }) : '' })
    + modeBanner(c) + h.kpis([{ label: 'Open payables', value: cents(due) }, { label: 'Needs approval', value: bs.filter(b => b.status === 'Needs approval').length, tone: 'warn' }, { label: 'Matched to POs', value: bs.filter(b => b.match === 'Matched').length + ' of ' + bs.filter(b => b.po).length }, { label: '1099 vendors', value: D.vendors.filter(v => v.category === 'Subcontractor').length }])
    + h.tabs('bill.tab', [['bills', 'Bills', bs.length], ['vendors', 'Vendors', D.vendors.length]], 'bills') + body;
});
RL.act('bill-new', toast('New bill: upload or type it, then match to a PO (mock).'));
RL.act('bill-approve', toast('Approved. It joins the next payment run (mock).'));
RL.act('bill-pay', toast('Payment scheduled by ACH for the due date (mock).'));
RL.act('bill-ai', toast('Quoted 6 credits. 3 draft bills created for review (mock).'));

// ---------------------------------------------------------------- Books: bank feeds and reconciliation
RL.screen('web.banking', (c) => {
  const D = c.D, tab = h.tab('bank.tab', 'review'), cash = acct(c, '1000');
  let body = '';
  if (tab === 'review') {
    const lines = D.bank.map(b => Object.assign({}, b, { desc: BANK_SAFE(b.desc), ok: RL.ui['bank.ok.' + b.id] === '1' || /^Matched/.test(b.match) }));
    const conf = b => b.ai ? (.84 + (hs(b.id) % 14) / 100).toFixed(2) : null;
    const tbl = `<div class="tb-wrap"><table class="tb dense"><thead><tr><th>Date</th><th>Description</th><th class="n">Amount</th><th>Suggestion</th><th></th></tr></thead><tbody>${lines.map(b => `<tr class="${b.ai && !b.ok ? 'ai' : ''}"><td class="nowrap">${mdate(c, b.date)}</td><td class="mono tiny">${esc(b.desc)}</td><td class="n" style="color:${b.amount < 0 ? 'inherit' : 'var(--ok-text)'}">${b.amount > 0 ? '+' : ''}${cents(b.amount)}</td><td>${b.ai ? `${h.ai('Suggested ' + conf(b))} ` : ''}<span class="small">${esc(b.match.replace('Suggest: ', ''))}</span></td><td class="nowrap">${b.ok ? h.pill('Done', 'ok', 'check') : /Needs review/.test(b.match) ? h.btn('Categorize', { sm: true, act: 'bank-cat' }) : h.btn('Accept', { sm: true, kind: b.ai ? 'ai' : '', ui: 'bank.ok.' + b.id, val: '1' })}</td></tr>`).join('')}</tbody></table></div>`;
    const left = lines.filter(b => !b.ok).length;
    body = `<div class="flex">${h.pill('Operating checking ••4421 · synced 2 h ago', 'ok')}${c.has('ledger_plus') ? h.pill('Business card ••8812 · synced', 'ok') + h.pill('Payroll checking · reconnect needed', 'warn') : ''}<span class="small t2">${left} of ${lines.length} to review</span></div>` + tbl
      + h.cols('2', [c.has('agents_v1') ? h.aiCard({ agent: 'Bookkeeping agent (A8)', level: 'L2', credits: 3, title: `${lines.filter(b => b.ai && !b.ok).length} suggested matches`, body: 'Matches bank lines to bills, receipts and deposits and proposes categories. Rule-based categories apply on their own; matches wait for you.', why: h.tag('V1') + ' Batch quoted at 3 credits before it runs.', actions: h.btn('Accept all suggestions', { kind: 'ai', act: 'bank-all' }) }) : h.card({ title: 'Matching', body: '<p class="small t2">Payouts and payroll match automatically by amount and reference. Bank rules handle the rest.</p>' }), h.card({ title: 'Why payouts match themselves', body: '<p class="small t2">Each Stripe payout is proven against its charges and fees before it reaches the bank, so the bank line matches one payout entry, not a pile of invoices (08 §5.8).</p>' + h.btn('Stripe payouts', { sm: true, go: 'web.stripe' }) })]);
  } else if (tab === 'rec') {
    const outChecks = [['Check 1183', 'May 10', BANK_SAFE('Wholesale nursery (illustrative), bill B-222'), -2640], ['Check 1184', 'May 10', 'Small engine repair (illustrative), bill B-225', -386]];
    const dit = 1215.5, outSum = sum(outChecks, x => x[3]);
    const stmtEnd = r2(cash - outSum - dit), clearedDep = Math.round(cash * .64 * 100) / 100, clearedPay = Math.round(cash * .58 * 100) / 100;
    const begin = r2(stmtEnd - clearedDep + clearedPay);
    body = h.cols('21', [h.card({ title: `Reconcile 1000 Operating checking ••4421 · statement ${mdate(c, 'Apr')} 1 - ${mdate(c, 'Apr')} 30`, body: h.table([{ k: 0, label: '' }, { k: 1, label: 'Amount', n: true, fmt: v => cents(v) }], [['Beginning balance (reconciled)', begin], ['+ Cleared deposits (38)', clearedDep], ['- Cleared payments and checks (61)', -clearedPay], ['= Cleared balance', stmtEnd], ['Statement ending balance', stmtEnd]].map(r => Object.assign([], r)), { dense: true, foot: ['Difference', '$0.00'] })
      + `<b class="small">Outstanding items</b>` + h.table([{ k: 0, label: 'Item' }, { k: 1, label: 'Date', fmt: v => mdate(c, v) }, { k: 2, label: 'Payee' }, { k: 3, label: 'Amount', n: true, fmt: v => cents(v) }], outChecks.concat([['Deposit in transit', 'May 10', 'Undeposited funds: 2 checks', dit]]).map(r => Object.assign([], r)), { dense: true, foot: ['Book balance', '', '', cents(cash)] })
      + `<div class="tiny t3">${cents(stmtEnd)} ${outSum < 0 ? '-' : '+'} ${cents(Math.abs(outSum))} + ${cents(dit)} = ${cents(cash)}</div>` }),
      stack([h.card({ tone: 'ok', title: 'Ready to finish', body: `<p class="small">All 99 statement lines matched: 71 automatic, 24 by rule, 4 by hand. Difference $0.00.</p><div class="flex">${h.btn('Finish and lock items', { kind: 'primary', act: 'rec-finish' })}${h.btn('Reconciliation PDF', { icon: 'download', act: 'rec-pdf' })}</div>` }), h.card({ title: 'Accounts', flush: true, body: h.list([{ icon: 'bank', tone: 'ok', title: 'Operating checking', sub: `Reconciled through ${mdate(c, 'Mar')} 31` }, { icon: 'card', tone: c.has('ledger_plus') ? 'warn' : '', title: 'Business card', sub: c.has('ledger_plus') ? `${mdate(c, 'Apr')} statement open` : 'Needs Ledger Plus' }]) })])]);
  } else {
    body = h.table([{ k: 0, label: 'When the description contains' }, { k: 1, label: 'Then' }, { k: 2, label: 'Applied', n: true }], [['FUEL STATION', 'Categorize 6000 Fuel, class by truck', 41], ['ROOTLINE SUBSCRIPTION', 'Categorize 6200 Software', 5], ['PAYROLL SVC NET PAY', 'Match payroll run by amount', 18], ['STRIPE PAYOUT', 'Match payout by id (system rule)', 64], ['AUTO PARTS', 'Categorize 6000 Fuel and vehicle; ask if over $250', 9]].map(r => Object.assign([], r))) + `<div class="flex">${h.btn('New rule', { icon: 'plus', act: 'rule-new' })}</div>`;
  }
  return h.page({ title: 'Bank feeds and reconciliation', sub: `${c.has('ledger_plus') ? 'Unlimited feeds (Ledger Plus)' : '1 bank feed (Ledger Essentials)'} · read-only bank connection`, actions: h.btn('Add bank account', { icon: 'plus', act: 'bank-add' }) })
    + modeBanner(c) + h.tabs('bank.tab', [['review', 'Review feed', D.bank.length], ['rec', 'Reconcile'], ['rules', 'Rules', 5]], 'review') + body;
});
RL.act('bank-cat', toast('Pick an account; make it a rule to apply next time (mock).'));
RL.act('bank-all', (el, ev, c) => { c.D.bank.forEach(b => { if (b.ai) RL.ui['bank.ok.' + b.id] = '1'; }); RL.toast('Quoted 3 credits. Suggested matches accepted (mock).'); });
RL.act('rec-finish', toast('Reconciliation finished; cleared items locked (mock).'));
RL.act('rec-pdf', toast('Reconciliation report PDF generated (mock).'));
RL.act('rule-new', toast('New bank rule (mock).'));
RL.act('bank-add', toast('Connect a bank through the read-only aggregator (mock).'));

// ---------------------------------------------------------------- Books: job costing and WIP (V1, Ledger Advanced)
RL.screen('web.job_costing', (c) => {
  const D = c.D, tab = h.tab('jc.tab', 'job');
  const installs = jobsX(c).filter(j => ['Install', 'Design'].includes(j.type)).slice(0, 6);
  const list = installs.length ? installs : jobsX(c).slice(0, 4);
  const along = list.filter(x => x.status === 'In progress').sort((a, b) => phaseIdx(b) - phaseIdx(a))[0];
  const j = list.find(x => x.id === RL.ui['jc.job']) || along || list[0];
  const ph = jobPhases(j), pctDone = ph.map(p => p.pct);
  const wip = list.map(x => { const ps = jobPhases(x); const pct = x.status === 'Complete' ? 100 : Math.round(sum(ps, p => p.pct * p.b) / Math.max(1, sum(ps, p => p.b))); const est = x.cost, ctd = Math.round(est * pct / 100), earned = Math.round(x.value * pct / 100), billed = x.status === 'Complete' ? x.value : Math.round(x.value * (pct > 60 ? .7 : pct > 0 ? .5 : .3)); return { id: x.id, client: x.client, contract: x.value, est, ctd, pct, earned, billed, under: Math.max(0, earned - billed), over: Math.max(0, billed - earned) }; });
  let body = '';
  if (tab === 'job') {
    const rows = ph.map((p, k) => { const bud = Math.round(j.cost * (p.b / Math.max(1, sum(ph, x => x.b)))); const act = Math.round(bud * Math.min(1.15, p.a / Math.max(1, p.b))); const eac = p.pct === 100 ? act : Math.max(bud, Math.round(act / Math.max(.05, p.pct / 100))); return { n: p.n, bud, cm: k === 3 ? Math.round(bud * .04) : 0, act, used: Math.round(100 * act / Math.max(1, bud)), phys: p.pct, eac: p.pct ? Math.min(eac, Math.round(bud * 1.12)) : bud, hrs: `${p.b}/${p.a}` }; });
    const eac = sum(rows, r => r.eac), bud = sum(rows, r => r.bud);
    body = `<div class="flex">${list.map(x => h.btn(x.id, { sm: true, ui: 'jc.job', val: x.id, pressed: x.id === j.id })).join('')}</div>`
      + h.kpis([{ label: 'Contract', value: money(j.value) }, { label: 'Billed', value: money(wip.find(w => w.id === j.id).billed) }, { label: 'Earned (WIP)', value: money(wip.find(w => w.id === j.id).earned) }, { label: 'Sold margin', value: Mg(c, jMargin(j) + '%') }, { label: 'Projected margin', value: Mg(c, Math.round(100 * (j.value - eac) / j.value) + '%'), tone: eac > bud ? 'warn' : 'ok' }])
      + h.table([{ k: 'n', label: 'Phase' }, { k: 'bud', label: 'Budget', n: true, fmt: v => Cst(c, v) }, { k: 'cm', label: 'Committed', n: true, fmt: v => Cst(c, v) }, { k: 'act', label: 'Actual', n: true, fmt: v => Cst(c, v) }, { k: 'used', label: '% used', n: true, fmt: (v, r) => `<span style="${v > r.phys + 15 ? 'color:var(--warn-text);font-weight:700' : ''}">${v}%</span>` }, { k: 'phys', label: 'Physical %', n: true, fmt: v => v + '%' }, { k: 'eac', label: 'EAC', n: true, fmt: v => Cst(c, v) }, { k: 'eac', label: 'Variance', n: true, fmt: (v, r) => h.mask(c, 'cost', `<span style="color:${r.bud - v < 0 ? 'var(--danger-text)' : 'inherit'}">${money(r.bud - v)}</span>`) }, { k: 'hrs', label: 'Hours est/act', n: true }], rows, { dense: true, foot: ['Total', Cst(c, bud), Cst(c, sum(rows, r => r.cm)), Cst(c, sum(rows, r => r.act)), '', '', Cst(c, eac), Cst(c, bud - eac), `${sum(ph, p => p.b)}/${sum(ph, p => p.a)}`] })
      + h.cols('2', [h.card({ title: 'Cost by type', sub: `${j.id} · actual vs budget`, body: h.bars([['Labor and burden', .5, .97], ['Materials', .3, 1.12], ['Equipment', .08, .9], ['Subcontractor', .12, 1]].map(([l, w, f]) => { const b = Math.round(j.cost * w), a = Math.round(b * sum(rows, r => r.act) / Math.max(1, bud) * f); return { label: l, value: a, max: b, tone: a > b ? 'danger' : '', right: c.sees('cost') ? `${money(a)} / ${money(b)}` : h.mask(c, 'cost', '') }; })) }),
        h.card({ title: 'WIP position, all installs', sub: `${wip.length} jobs · as of ${mdate(c, 'Apr')} 30`, body: h.kv([['Underbilled (asset 1215)', money(sum(wip, w => w.under))], ['Overbilled (liability 2210)', money(sum(wip, w => w.over))], ['Net WIP adjustment', money(sum(wip, w => w.under) - sum(wip, w => w.over))], [`${j.id} position`, (() => { const w = wip.find(x => x.id === j.id); return w.under ? `Underbilled ${money(w.under)}` : w.over ? `Overbilled ${money(w.over)}` : 'Billing matches earned'; })()]]) + h.btn('Open WIP schedule', { sm: true, ui: 'jc.tab', val: 'wip' }) })])
      + (eac > bud ? h.card({ tone: 'warn', title: 'Why the forecast moved', body: `<p class="small">${esc(rows.find(r => r.used > r.phys + 15) ? rows.find(r => r.used > r.phys + 15).n : rows[3].n)} has spent more than its physical progress: materials are on site but not yet installed, and waste ran above the takeoff factor.</p><div class="flex">${h.btn('View lines', { sm: true, go: 'web.journal' })}${h.btn('Send to estimator: update waste factor', { sm: true, act: 'jc-est' })}</div>` }) : '');
  } else {
    const tot = k => sum(wip, w => w[k]), under = tot('under'), over = tot('over');
    body = h.table([{ k: 'id', label: 'Job', m: true }, { k: 'client', label: 'Client' }, { k: 'contract', label: 'Contract', n: true, fmt: v => money(v) }, { k: 'est', label: 'Est cost', n: true, fmt: v => Cst(c, v) }, { k: 'ctd', label: 'Cost to date', n: true, fmt: v => Cst(c, v) }, { k: 'pct', label: '% complete', n: true, fmt: v => v + '%' }, { k: 'earned', label: 'Earned', n: true, fmt: v => money(v) }, { k: 'billed', label: 'Billed', n: true, fmt: v => money(v) }, { k: 'under', label: 'Underbilled', n: true, fmt: v => v ? money(v) : '' }, { k: 'over', label: 'Overbilled', n: true, fmt: v => v ? money(v) : '' }], wip, { dense: true, foot: ['Totals', '', money(tot('contract')), Cst(c, tot('est')), Cst(c, tot('ctd')), '', money(tot('earned')), money(tot('billed')), money(under), money(over)] })
      + h.card({ title: 'Entries to post (auto-reverse on the 1st)', body: `<div class="mono tiny">Dr 1215 Costs in excess of billings ${money(under)} / Cr 4000 Revenue: installs ${money(under)}<br>Dr 4000 Revenue: installs ${money(over)} / Cr 2210 Billings in excess of costs ${money(over)}</div><div class="flex mt8">${c.allowed('ledger.journal_entry') ? h.btn('Post WIP', { kind: 'primary', act: 'wip-post' }) : `<span class="small t2">Posting is done by the owner or bookkeeper.</span>`}${h.btn('Surety format', { act: 'wip-surety' })}</div>` });
  }
  return h.page({ title: `Job costing and WIP ${h.tag('V1')}`, sub: `Ledger Advanced${c.feat('ledger_advanced').via ? ' (add-on)' : ''} · cost-to-cost method · as of ${mdate(c, 'Apr')} 30`, actions: h.tabs('jc.tab', [['job', 'Job cost report'], ['wip', 'WIP schedule', wip.length]], 'job') })
    + modeBanner(c) + body + (c.sees('margin') ? '' : h.note(`Margin is hidden for ${esc(c.as.label)} by default (field class margin); costs stay visible.`));
});
RL.act('jc-est', toast('Sent to the estimator with the variance lines (mock).'));
RL.act('wip-post', toast('WIP entries posted; they reverse on the 1st (mock).'));
RL.act('wip-surety', toast('WIP schedule exported in surety format (mock).'));

// ---------------------------------------------------------------- Books: sales tax (07 §4.5, 09 §4.16)
RL.screen('web.tax', (c) => {
  const D = c.D, T = TAX(c), pay = acct(c, '2200'), canEdit = c.can('tax_setting').includes('W');
  const jur = T.svc ? [[T.jur, 'State + county', T.rate, 'Lawn and landscape maintenance labor, materials', 'All service properties in county'], [T.st + ' (other counties)', 'State + county', +(T.rate - .25).toFixed(2), 'Same rules, county rate by property', 'Sourced to the property address']]
    : [[T.jur, 'State + local', T.matRate || 0, 'Materials sold separately; most services not taxed', 'Labor not taxed'], [T.st + ' capital improvements', 'Contractor as consumer', 0, 'Company pays tax when buying materials', 'Use tax accrued on tax-free purchases']];
  const months = c.winter ? ['Dec 2026', 'Nov 2026', 'Oct 2026', 'Sep 2026'] : ['Apr 2027', 'Mar 2027', 'Feb 2027', 'Jan 2027'];
  const filings = months.map((m, i) => ({ m, col: Math.round(pay * [1, .62, .41, .38][i]), status: i === 0 ? 'Due' : 'Filed and paid', due: i === 0 ? (c.winter ? 'Jan 23' : 'May 23') : '-' }));
  const coms = D.clients.filter(x => x.type !== 'residential');
  const certs = [[coms[0] ? coms[0].name : 'Riverside Church (nonprofit)', 'Nonprofit exemption', 'Valid to Dec 2028', 'ok'], [coms[1] ? coms[1].name : 'Tri-County Library District', 'Government', 'Expired Apr 30', 'danger'], [coms[2] ? coms[2].name : 'Lakeside Commons Association', 'Resale (enhancement plants)', 'Requested May 2', 'warn']];
  return h.page({ title: 'Sales tax', sub: `${esc(T.jur)} · ${esc(T.engine)} · files ${esc(T.freq.toLowerCase())}`, actions: canEdit ? h.btn('Tax settings', { icon: 'cog', act: 'tax-set' }) + h.btn('Mark return filed', { kind: 'primary', act: 'tax-file' }) : '' })
    + modeBanner(c)
    + h.kpis([{ label: 'Sales tax payable (2200)', value: money(pay), delta: 'ties to the tax report', tone: 'ok' }, { label: `Collected, ${months[0]}`, value: money(filings[0].col) }, { label: 'Next filing', value: filings[0].due, delta: months[0] + ' return', tone: 'warn' }, { label: 'Use tax accrued', value: T.svc ? '$0' : money(Math.round(pay * .18)), delta: T.svc ? 'none this period' : 'tax-free material purchases' }])
    + h.banner(`${icon('help')} ${esc(T.note)}`, 'info')
    + h.cols('2', [h.card({ title: 'Jurisdictions and rules', flush: true, body: h.table([{ k: 0, label: 'Jurisdiction' }, { k: 1, label: 'Type' }, { k: 2, label: 'Rate', n: true, fmt: v => v + '%' }, { k: 3, label: 'What is taxed' }], jur.map(r => Object.assign([], r)), { dense: true }) }),
      h.card({ title: 'Returns', flush: true, body: h.table([{ k: 'm', label: 'Period' }, { k: 'col', label: 'Tax collected', n: true, fmt: v => money(v) }, { k: 'due', label: 'Due' }, { k: 'status', label: 'Status', fmt: v => v === 'Due' ? h.pill('Due', 'warn') : st('Paid').replace('Paid', v) }], filings, { dense: true }) })])
    + h.card({ title: 'Exemption certificates', flush: true, body: h.table([{ k: 0, label: 'Client' }, { k: 1, label: 'Type' }, { k: 2, label: 'Status', fmt: (v, r) => h.pill(esc(v), r[3]) }, { k: 0, label: '', fmt: (v, r) => r[3] === 'danger' && canEdit ? h.btn('Request renewal', { sm: true, act: 'tax-cert' }) : '' }], certs.map(r => Object.assign([], r)), { dense: true }) })
    + (canEdit ? '' : roNote(c, 'read-only (tax_setting = ' + esc(c.can('tax_setting')) + ').'));
});
RL.act('tax-set', toast('Tax settings: engine, nexus states, categories and overrides (mock).'));
RL.act('tax-file', toast('Return marked filed; payment matched when it clears the bank (mock).'));
RL.act('tax-cert', toast('Certificate request sent through the portal (mock).'));

// ---------------------------------------------------------------- Books: period close (09 §4.11, §6.4)
function closeChecks(c) {
  const adv = c.has('ledger_advanced'), plus = c.has('ledger_plus');
  const ui = k => RL.ui['close.' + k] === '1';
  const list = [
    { id: 'C1', t: plus ? 'Bank and card accounts reconciled (2 of 3)' : 'Bank account reconciled', hard: true, done: !plus || ui('C1'), who: c.t.cast && c.t.cast.bookkeeper || 'Bookkeeper', open: plus ? 'Business card statement open' : '' },
    { id: 'C2', t: 'Stripe clearing proven ($0.00 difference)', hard: true, done: true, who: 'auto' },
    { id: 'C4', t: 'AR ties to 1100', hard: true, done: true, who: 'auto' },
    { id: 'C5', t: 'Customer deposits tie to 2100', hard: true, done: true, who: 'auto' },
    { id: 'C6', t: 'Sales tax payable ties to the tax report', hard: true, done: true, who: 'auto' },
    { id: 'C8', t: 'Payroll complete (2 runs)', hard: true, done: true, who: c.t.cast && c.t.cast.office_manager || 'Office' },
    adv && { id: 'C16', t: 'WIP schedule posted', hard: true, done: ui('C16'), who: c.t.cast && c.t.cast.bookkeeper || 'Bookkeeper', open: '1 estimate at completion is stale' },
    { id: 'C18', t: 'Suspense account is $0.00', hard: true, done: true, who: 'auto' },
    { id: 'C10', t: '3 unapproved timesheets dated the last two days', hard: false, done: ui('C10'), who: 'Ops managers' },
    { id: 'C11', t: 'Completed visits not invoiced: accrued', hard: false, done: true, who: 'auto' },
    { id: 'C22', t: 'Flux review: 4 accounts moved more than 20%', hard: false, done: ui('C22'), who: c.t.cast && c.t.cast.bookkeeper || 'Bookkeeper', ai: true },
  ].filter(Boolean);
  return list;
}
RL.screen('web.close', (c) => {
  const D = c.D, pr = period(c), checks = closeChecks(c), locked = RL.ui['close.locked'] === '1';
  const hardOpen = checks.filter(x => x.hard && !x.done), done = checks.filter(x => x.done).length;
  const canLock = c.allowed('ledger.period.lock');
  const row = x => `<div class="li-i"><span class="ico ${x.done ? 'ok' : x.hard ? 'warn' : ''}">${icon(x.done ? 'check' : x.hard ? 'warn' : 'clock')}</span><div class="grow"><div class="tt">${x.id} · ${esc(x.t)}${x.ai ? ' ' + h.tag('V1') : ''}</div><div class="ss">${x.done ? (x.who === 'auto' ? 'Checked automatically' : 'Done by ' + esc(x.who)) : esc(x.open || 'Open') + ' · ' + esc(x.who)}</div></div><div class="flex nw">${x.done ? h.pill('Done', 'ok') : x.ai && c.has('agents_v1') ? h.btn('Review AI notes (2 cr)', { sm: true, kind: 'ai', ui: 'close.' + x.id, val: '1' }) : h.btn('Mark done', { sm: true, ui: 'close.' + x.id, val: '1' })}</div></div>`;
  const proofs = [['1100', 'Accounts receivable', 'AR aging (open invoices)'], ['1050', 'Stripe clearing', 'Captured, not yet paid out (payout po_1021 in transit)'], ['2100', 'Customer deposits', 'Unapplied deposits on signed proposals'], ['2200', 'Sales tax payable', 'Sales tax report for the period'], ['2150', 'Deferred revenue: level billing', 'Agreement season meters']].concat(c.has('ledger_plus') ? [['2000', 'Accounts payable', 'Open bills']] : []);
  const pt = h.table([{ k: 0, label: 'Account', m: true }, { k: 1, label: 'Name' }, { k: 0, label: 'GL balance', n: true, fmt: v => cents(acct(c, v)) }, { k: 0, label: 'Subledger', n: true, fmt: v => cents(acct(c, v)) }, { k: 2, label: 'Source' }, { k: 0, label: 'Difference', n: true, fmt: () => '$0.00' }, { k: 0, label: '', fmt: (v, r) => h.pill('Proven', 'ok', 'check') }], proofs.map(r => Object.assign([], r)), { dense: true });
  const lockBtnHtml = locked ? h.btn('Reopen period', { act: 'close-reopen' }) : canLock ? h.btn(`Lock ${pr.name}`, { kind: 'primary', icon: 'lock', act: hardOpen.length ? null : 'close-lock', disabled: hardOpen.length > 0, title: hardOpen.length ? `${hardOpen.length} hard check open` : null }) : '';
  return h.page({ title: `Close: ${pr.name}`, sub: `Readiness ${Math.round(100 * done / checks.length)}% (${done}/${checks.length}) · target ${pr.next} · ${esc(c.t.cast && c.t.cast.bookkeeper ? c.t.cast.bookkeeper : 'outside CPA')} with ${esc(c.owner)}`, tags: locked ? h.pill(`${pr.name} locked`, 'ok', 'lock') : h.pill('In progress', 'info'), actions: lockBtnHtml + h.btn('Export close binder', { icon: 'download', act: 'close-binder' }) })
    + modeBanner(c)
    + (locked ? h.banner(`${icon('lock')} ${pr.name} is locked. Postings to it are refused; reopening needs a reason and owner approval, and every reopen is logged (09 §5.8).`, 'ok') : hardOpen.length ? h.banner(`${icon('warn')} Lock is disabled: ${hardOpen.length} hard check${hardOpen.length > 1 ? 's' : ''} open (${hardOpen.map(x => x.id).join(', ')}).`, 'warn') : h.banner(`${icon('check')} All hard checks pass. Ready to lock ${pr.name}.`, 'ok'))
    + h.progress(done, checks.length, hardOpen.length ? 'warn' : '')
    + h.cols('2', [h.card({ title: 'Hard checks', sub: 'Block the lock', flush: true, body: `<div class="li">${checks.filter(x => x.hard).map(row).join('')}</div>` }), stack([h.card({ title: 'Soft checks', sub: 'Warn, do not block', flush: true, body: `<div class="li">${checks.filter(x => !x.hard).map(row).join('')}</div>` }), h.card({ title: 'Sign-off', body: h.list([{ icon: 'user', tone: hardOpen.length ? '' : 'ok', title: `${esc(c.t.cast && c.t.cast.bookkeeper || 'Bookkeeper')}: ready for review`, sub: hardOpen.length ? 'Waiting on hard checks' : 'Marked ready' }, { icon: 'approve', tone: locked ? 'ok' : '', title: `${esc(c.owner)}: owner approval`, sub: locked ? 'Approved and locked' : 'Approves on lock' }]) })])])
    + h.card({ title: 'Control-account proofs', sub: 'Each control account equals its subledger before the period can lock', flush: true, body: pt });
});
RL.act('close-lock', (el, ev, c) => { RL.ui['close.locked'] = '1'; RL.toast(`${period(c).name} locked. Mirror closing date pushed where a mirror is set up (mock).`); });
RL.act('close-reopen', (el, ev, c) => { RL.ui['close.locked'] = ''; RL.toast('Period reopened with a logged reason (mock).'); });
RL.act('close-binder', toast('Close binder exported: reconciliations, proofs and sign-offs (mock).'));

// ---------------------------------------------------------------- Books: financial statements
RL.screen('web.fin_reports', (c) => {
  const D = c.D, tab = h.tab('fr.tab', 'pl'), p = pnl(c), pr = period(c), cmp = h.on('fr.cmp', true);
  const ly = v => Math.round(v * .88);
  const line = (l, v, o) => `<tr${o && o.b ? ' style="font-weight:700"' : ''}><td${o && o.ind ? ' style="padding-left:22px"' : ''}>${l}</td><td class="n">${money(v)}</td>${cmp ? `<td class="n t2">${money(ly(v))}</td><td class="n" style="color:${v >= ly(v) ? 'var(--ok-text)' : 'var(--danger-text)'}">${v ? Math.round(100 * (v - ly(v)) / Math.max(1, ly(v))) + '%' : ''}</td>` : ''}</tr>`;
  const sec = l => `<tr><td colspan="${cmp ? 4 : 2}" style="background:var(--surface-2);font-weight:700;font-size:.74rem">${l}</td></tr>`;
  const head = `<thead><tr><th>Account</th><th class="n">${pr.ytd}</th>${cmp ? '<th class="n">Last year</th><th class="n">Change</th>' : ''}</tr></thead>`;
  let body = '';
  if (tab === 'pl') {
    body = `<table class="tb dense">${head}<tbody>${sec('Revenue')}${p.inc.map(a => line(esc(a.name), a.balance, { ind: 1 })).join('')}${line('Total revenue', p.ti, { b: 1 })}${sec('Cost of goods sold')}${p.cogs.map(a => line(esc(a.name), a.balance, { ind: 1 })).join('')}${line('Gross profit', p.gp, { b: 1 })}${sec('Operating expenses')}${p.exp.map(a => line(esc(a.name), a.balance, { ind: 1 })).join('')}${line('Net income', p.ni, { b: 1 })}</tbody></table>`;
  } else if (tab === 'bs') {
    const as = byType(c, 'Asset'), li = byType(c, 'Liability'), eq = byType(c, 'Equity');
    const ta = sum(as, a => a.balance), tl = sum(li, a => a.balance), te0 = sum(eq, a => a.balance);
    const re = ta - tl - te0 - p.ni;
    const l2 = (l, v, o) => `<tr${o && o.b ? ' style="font-weight:700"' : ''}><td${o && o.ind ? ' style="padding-left:22px"' : ''}>${l}</td><td class="n">${money(v)}</td></tr>`;
    body = `<table class="tb dense"><thead><tr><th>Account</th><th class="n">As of ${c.winter ? 'Dec 31, 2026' : 'Apr 30, 2027'}</th></tr></thead><tbody>${as.map(a => l2(esc(a.name), a.balance, { ind: 1 })).join('')}${l2('Total assets', ta, { b: 1 })}${li.map(a => l2(esc(a.name), a.balance, { ind: 1 })).join('')}${l2('Total liabilities', tl, { b: 1 })}${eq.map(a => l2(esc(a.name), a.balance, { ind: 1 })).join('')}${l2('Retained earnings', re, { ind: 1 })}${l2('Current year earnings', p.ni, { ind: 1 })}${l2('Total equity', te0 + re + p.ni, { b: 1 })}${l2('Total liabilities and equity', tl + te0 + re + p.ni, { b: 1 })}</tbody></table>` + h.pill(ta === tl + te0 + re + p.ni ? 'Balanced: assets equal liabilities plus equity' : 'Out of balance', 'ok', 'check');
  } else {
    const dep = Math.round(acct(c, '1500') * .06), dAR = -Math.round(acct(c, '1100') * .35), dAP = Math.round(acct(c, '2000') * .2), dDep = Math.round(acct(c, '2100') * .5), dDef = Math.round(acct(c, '2150') * .4);
    const ops = p.ni + dep + dAR + dAP + dDep + dDef, inv = -Math.round(acct(c, '1500') * .12), fin = -Math.round(p.ni * .35);
    const net = ops + inv + fin, end = acct(c, '1000'), begin = end - net;
    const l3 = (l, v, o) => `<tr${o && o.b ? ' style="font-weight:700"' : ''}><td${o && o.ind ? ' style="padding-left:22px"' : ''}>${l}</td><td class="n">${money(v)}</td></tr>`;
    body = `<table class="tb dense"><thead><tr><th>Indirect method</th><th class="n">${pr.ytd}</th></tr></thead><tbody>${l3('Net income', p.ni, { ind: 1 })}${l3('Depreciation', dep, { ind: 1 })}${l3('Increase in receivables', dAR, { ind: 1 })}${l3('Increase in payables', dAP, { ind: 1 })}${l3('Customer deposits received', dDep, { ind: 1 })}${l3('Deferred revenue (level billing)', dDef, { ind: 1 })}${l3('Cash from operations', ops, { b: 1 })}${l3('Equipment and vehicles purchased', inv, { ind: 1 })}${l3('Cash from investing', inv, { b: 1 })}${l3("Owner's draws", fin, { ind: 1 })}${l3('Cash from financing', fin, { b: 1 })}${l3('Net change in cash', net, { b: 1 })}${l3('Beginning cash', begin, { ind: 1 })}${l3('Ending cash (1000 Operating checking)', end, { b: 1 })}</tbody></table>`;
  }
  const m = ledgerMode(c);
  return h.page({ title: 'Financial statements', sub: `${esc(c.t.name)} · accrual basis · ${m === 'C' ? 'operational subledger' : 'book of record'}${m === 'B' ? ' (QuickBooks copy labeled as a copy)' : ''}`, actions: `${h.toggle('Compare to last year', 'fr.cmp', true)}${h.btn('PDF', { icon: 'download', act: 'fr-pdf' })}${h.btn('Excel', { icon: 'download', act: 'fr-xls' })}${h.btn('Share with CPA', { act: 'fr-share' })}` })
    + modeBanner(c) + `<div class="flex" style="justify-content:space-between">${h.tabs('fr.tab', [['pl', 'Profit and loss'], ['bs', 'Balance sheet'], ['cf', 'Cash flow']], 'pl')}${multiBranch(c) ? (c.has('ledger_advanced') ? `<span class="flex nw gap4 tiny t2">Location <span style="width:150px;display:inline-block">${h.select([['all', 'All locations']].concat(c.t.branches.map(b => [b, b])), RL.ui['fr.loc'] || 'all', { ui: 'fr.loc', label: 'Location' })}</span></span>` : lockPill(c, 'ledger_advanced', 'Locations: Ledger Advanced')) : ''}</div>`
    + h.card({ flush: true, body: `<div class="tb-wrap">${body}</div>` }) + h.note('Numbers come from posted journal lines only. Click any account in the journal to trace it to source documents.');
});
RL.act('fr-pdf', toast('PDF generated (mock).'));
RL.act('fr-xls', toast('Excel export generated (mock).'));
RL.act('fr-share', toast('Shared with the CPA through the Accountant Hub (mock).'));

// ---------------------------------------------------------------- Books: QuickBooks / Xero sync (09 §4.17, §6.6)
RL.screen('web.sync', (c) => {
  const m = ledgerMode(c), tab = h.tab('sync.tab', 'status'), canResolve = c.allowed('accounting_sync.resolve');
  const cards = ['A', 'B', 'C'].map(k => `<div class="plan-c${k === m ? ' on' : ''}"><b>${k}. ${MODE[k][0]}</b><span class="small t2">${MODE[k][1]}</span><span class="tiny t3">${k === 'A' ? 'Nothing leaves Rootline' : k === 'B' ? 'Push only: daily summary entries or detail documents' : 'Push documents; pull payments, credits, closing date and trial balance'}</span>${k === m ? h.pill('Current mode', 'ok') : ''}</div>`).join('');
  const conns = [['QuickBooks Online', c.has('qbo_sync'), m === 'A' ? 'Not connected' : 'Connected · token ok'], ['Xero', c.has('xero_sync'), 'Not connected'], ['QuickBooks Desktop (Web Connector)', c.has('qbd_sync'), 'Not connected']];
  let body = '';
  if (m === 'A') {
    body = h.card({ title: 'No sync needed', body: `<p class="small t2">${esc(c.t.name)} keeps its books in Rootline. If your CPA or lender wants QuickBooks access, add a read-only mirror: Rootline stays the book of record and the copy is labeled as a copy.</p><div class="flex">${c.allowed('accounting_sync') && c.can('accounting_sync').includes('W') ? h.btn('Set up a QuickBooks mirror', { kind: 'primary', act: 'sync-mirror' }) : ''}</div>` });
  } else {
    const errs = m === 'C' ? [['ERR', 'Invoice INV-3311', 'Tax code not mapped in QuickBooks', 'Map tax code'], ['ERR', 'Payment PY-7712', 'Waits on INV-3311 (no cascade)', ''], ['CONF', `Customer ${c.D.clients[2].name}`, 'Address edited in both systems', 'Keep Rootline']] : [['ERR', 'Summary JE May 10', 'Class "Snow" not found in QuickBooks', 'Map class'], ['CONF', 'Closing date', 'QuickBooks closing date earlier than Rootline lock', 'Push lock date']];
    const tbl = h.table([{ k: 0, label: 'Type', fmt: v => h.pill(v, v === 'ERR' ? 'danger' : 'warn') }, { k: 1, label: 'Object' }, { k: 2, label: 'Problem' }, { k: 3, label: '', fmt: v => canResolve ? (v ? h.btn(esc(v), { sm: true, kind: 'primary', act: 'sync-fix' }) : '') + h.btn('Retry', { sm: true, act: 'sync-retry' }) : '<span class="tiny t3">Resolved by owner or bookkeeper</span>' }], errs.map(r => Object.assign([], r)), { dense: true });
    const mapping = h.table([{ k: 0, label: 'Rootline', m: true }, { k: 1, label: 'QuickBooks account' }, { k: 2, label: 'Status', fmt: v => /AI/.test(v) ? h.ai(v) : h.pill(v, v === 'ok' ? 'ok' : 'warn') }], [['ar_control', 'Accounts Receivable (A/R)', 'ok'], ['stripe_clearing:USD', 'Stripe Clearing (Bank)', 'ok'], ['revenue:maintenance', '4100 Maintenance Revenue', 'ok'], ['revenue:snow', '(unmapped)', 'AI suggests 4600 Snow Removal 0.97'], ['customer_deposits', 'Customer Deposits (Other Current Liability)', 'ok'], ['branch to Location', `Locations ${c.t.branches.length}/${c.t.branches.length}`, 'ok']].map(r => Object.assign([], r)), { dense: true });
    body = h.kpis([{ label: 'Health', value: '98.7%', tone: 'ok', delta: 'last 30 days' }, { label: 'Objects synced', value: num(m === 'C' ? 4812 : 31), delta: m === 'C' ? 'documents, 30 days' : 'daily summary entries' }, { label: 'Open errors', value: m === 'C' ? 2 : 1, tone: 'danger' }, { label: 'Last push', value: '2 min ago' }])
      + h.tabs('sync.tab', [['status', 'Open items', errs.length], ['map', 'Mapping']], 'status') + (tab === 'map' ? mapping : tbl)
      + h.note(m === 'C' ? 'Mode C: bank reconciliation and period locks live in QuickBooks; its closing date is pulled into Rootline.' : 'Mode B: push only. Edits made in the QuickBooks copy are not pulled back.');
  }
  return h.page({ title: 'QuickBooks / Xero sync', sub: `Mode ${m}: ${MODE[m][0]} · ${esc(c.t.name)}`, actions: c.can('accounting_sync').includes('W') ? h.btn('Change mode at period end', { act: 'sync-mode' }) : '' })
    + (m === 'C' ? h.banner(`${icon('book')} Books are off in Rootline for ${esc(c.t.name)}: QuickBooks Online is the system of record. Rootline sends invoices, payments and payouts and pulls back payments recorded there.`, 'info') : '')
    + `<div class="plan-cards">${cards}</div>`
    + h.cols('21', [stack([body]), h.card({ title: 'Connectors', flush: true, body: h.list(conns.map(([n, ok, s]) => ({ icon: 'link', tone: ok && /Connected/.test(s) ? 'ok' : '', title: esc(n), sub: ok ? esc(s) : `Not on ${esc(c.plan.name)}`, right: ok ? '' : lockPill(c, n.startsWith('Xero') ? 'xero_sync' : n.includes('Desktop') ? 'qbd_sync' : 'qbo_sync', 'Locked') }))) })])
    + (c.role === 'office_manager' ? roNote(c, 'read-only; errors are resolved by the owner or bookkeeper.') : '');
});
RL.act('sync-mirror', toast('Mirror setup: connect QuickBooks Online, pick summary or detail, map accounts (mock).'));
RL.act('sync-fix', toast('Mapping saved; the item retries now (mock).'));
RL.act('sync-retry', toast('Retry queued (mock).'));
RL.act('sync-mode', toast('Mode changes take effect at the next period boundary (mock).'));
})();
