/* Rootline Platform Explorer - core: indexes, state, gating, context, routing, render loop.
   Data: window.ROOTLINE_PLATFORM (assets/platform-data.js, built from docs/platform/*.json).
   Screens register with RL.screen(routeId, ctx => html). See app/README.md. */
(() => {
'use strict';
const P = window.ROOTLINE_PLATFORM;
const RL = window.RL = { P, screens: {}, acts: {}, modals: {}, ui: {}, after: [], version: 1 };

// ---------- indexes ----------
const by = (arr, k) => Object.fromEntries(arr.map(o => [o[k], o]));
const ROUTES = by(P.surfaces.routes, 'id');
const ROLES = by(P.roles.roles, 'key');
const FEATS = by(P.plans.features, 'key');
const PLANS = by(P.plans.plans, 'code');
const ADDONS = by(P.plans.addons, 'code');
const TENANTS = by(P.tenants.tenants, 'id');
const SEGS = by(P.segments.segments, 'id');
const PERSONAS = by(P.personas.personas, 'id');
const SURFACES = by(P.surfaces.surfaces, 'id');
const CAPS = {};
P.roles.tenant_permission_matrix.groups.forEach(g => g.rows.forEach(r => r.cap.split(' / ').forEach(c => { CAPS[c.trim()] = r.grants; })));
const FC = {};
P.roles.field_class_defaults.rows.forEach(r => { FC[r.field_class] = r.grants; });
RL.idx = { ROUTES, ROLES, FEATS, PLANS, ADDONS, TENANTS, SEGS, PERSONAS, SURFACES, CAPS, FC };

// ---------- view-as catalogue ----------
const AS = [];
const asOpt = (key, role, group, label, extra) => AS.push(Object.assign({ key, role, group, label }, extra || {}));
[['owner', 'Owner'], ['office_manager', 'Office manager'], ['estimator', 'Estimator'], ['designer', 'Designer'], ['ops_manager', 'Operations manager'], ['bookkeeper', 'Bookkeeper / CPA'], ['observer', 'Observer (V1)']]
  .forEach(([k, l]) => asOpt(k, k, 'Company staff', l));
[['crew_lead', 'Crew lead'], ['technician', 'Technician'], ['subcontractor', 'Subcontractor']].forEach(([k, l]) => asOpt(k, k, 'Field', l));
asOpt('client_residential.primary', 'client_residential', 'Clients', 'Homeowner (primary contact)', { scope: 'primary' });
asOpt('client_residential.co_owner', 'client_residential', 'Clients', 'Spouse (co-owner)', { scope: 'co_owner' });
asOpt('client_residential.property_contact', 'client_residential', 'Clients', 'Resident tenant (property contact)', { scope: 'property_contact' });
asOpt('client_commercial.primary', 'client_commercial', 'Clients', 'Property manager (primary)', { scope: 'primary' });
asOpt('client_commercial.approver', 'client_commercial', 'Clients', 'HOA board member (approver)', { scope: 'approver' });
asOpt('client_commercial.billing', 'client_commercial', 'Clients', 'AP clerk (billing contact)', { scope: 'billing' });
asOpt('client_commercial.property_contact', 'client_commercial', 'Clients', 'Facilities tech (property contact)', { scope: 'property_contact' });
asOpt('client_commercial.viewer', 'client_commercial', 'Clients', 'Consultant (viewer)', { scope: 'viewer' });
asOpt('partner_admin', 'partner_admin', 'Partners', 'Accountant partner admin (V1)');
asOpt('partner_member', 'partner_member', 'Partners', 'Accountant partner staff (V1)');
[['platform_owner', 'Founder / Super Admin'], ['platform_support', 'Platform Support'], ['platform_curator', 'Plant Curator'], ['platform_finance', 'Platform Finance'], ['platform_engineer', 'Platform Engineer']]
  .forEach(([k, l]) => asOpt(k, k, 'Rootline staff', l));
asOpt('prospect', 'prospect', 'Public', 'Prospect on rootline.com');
asOpt('homeowner', 'homeowner', 'Public', 'Homeowner (Rootline Home, V1)');
const ASK = by(AS, 'key');
RL.AS = AS;

// Surfaces each role may use (first one is the default)
const SURF = {
  owner: ['web', 'crew_manager'], office_manager: ['web', 'crew_manager'], estimator: ['web', 'crew_manager'], designer: ['web'],
  ops_manager: ['web', 'crew_manager'], bookkeeper: ['web'], observer: ['web'], crew_lead: ['crew', 'web', 'kiosk'], technician: ['crew', 'web', 'kiosk'],
  subcontractor: ['sub'], client_residential: ['portal'], client_commercial: ['portal'], partner_admin: ['partner'], partner_member: ['partner'],
  platform_owner: ['console'], platform_support: ['console'], platform_curator: ['console'], platform_finance: ['console'], platform_engineer: ['console'],
  prospect: ['www'], homeowner: ['home', 'www'],
};
RL.SURF = SURF;
const BUYERS = new Set(['owner']);
const SCOPE_RANK = { MVP: 1, V1: 2, V2: 3, V3: 4 };
const LENS = { mvp: 1, v1: 2, v2: 3, all: 9 };
const OBS_NAV = { Today: 'R', Reports: 'R' };
const OBS_CAPS = { dashboard: 'R/a', financial_report: 'R/a', job_cost_report: 'R/a' };

// ---------- state ----------
const DEF = { r: 'atlas.home', as: 'owner', t: 'greenleaf', plan: '', scope: 'all', season: 'peak', lang: 'en', x: '', lens: '1' };
RL.S = Object.assign({}, DEF);
function readHash() {
  const q = new URLSearchParams(location.hash.replace(/^#/, ''));
  const s = Object.assign({}, DEF);
  for (const k of Object.keys(DEF)) if (q.has(k)) s[k] = q.get(k);
  if (!ASK[s.as]) s.as = DEF.as;
  if (!TENANTS[s.t]) s.t = DEF.t;
  if (s.plan && !PLANS[s.plan]) s.plan = '';
  if (!ROUTES[s.r] && !RL.atlasPages[s.r]) s.r = DEF.r;
  return s;
}
function writeHash(s) {
  const q = new URLSearchParams();
  for (const k of Object.keys(DEF)) if (s[k] !== DEF[k] && s[k] !== '') q.set(k, s[k]);
  const h = '#' + q.toString();
  if (location.hash !== h) history.pushState(null, '', h);
}
RL.set = function (patch, opts) {
  const s = Object.assign({}, RL.S, patch);
  if ('as' in patch && patch.as !== RL.S.as) {
    const role = ASK[s.as].role;
    if (!('r' in patch)) s.r = landingFor(role, s);
    if (!('lang' in patch)) s.lang = (role === 'crew_lead' || role === 'technician') ? 'es' : 'en';
    s.x = '';
  }
  if ('t' in patch && patch.t !== RL.S.t) { if (!('plan' in patch)) s.plan = ''; s.x = ''; }
  if ('r' in patch && !('x' in patch)) s.x = '';
  RL.S = s; writeHash(s); render(opts);
};
RL.go = (r, x) => RL.set({ r, x: x || '' });
function landingFor(role, s) {
  const r = ROLES[role];
  return r && ROUTES[r.landing] ? r.landing : 'atlas.home';
}

// ---------- gating ----------
function planCode(s) { return s.plan || TENANTS[s.t].plan; }
function featState(key, s) {
  const f = FEATS[key]; if (!f) return { s: 'Y' };
  const pc = planCode(s);
  const a = Object.assign({}, f.plans[pc] || { s: '-' });
  const t = TENANTS[s.t];
  if (a.s === 'A' && a.addon && t.addons.includes(a.addon)) { a.s = 'Y'; a.via = a.addon; }
  if (a.s === 'A' || a.s === '-') a.unlock = unlockFor(key, pc);
  return a;
}
function unlockFor(key, pc) {
  const order = ['starter', 'grow', 'pro', 'enterprise'];
  const f = FEATS[key]; const cur = f.plans[pc] || {};
  const out = [];
  if (cur.s === 'A' && cur.addon) out.push({ kind: 'addon', code: cur.addon, name: ADDONS[cur.addon] ? ADDONS[cur.addon].name : cur.addon, price: ADDONS[cur.addon] ? ADDONS[cur.addon].price : '' });
  const start = Math.max(0, order.indexOf(pc) + 1);
  for (const p of order.slice(start)) {
    const st = (f.plans[p] || {}).s;
    if (st === 'Y' || st === 'L') { out.push({ kind: 'plan', code: p, name: PLANS[p].name, price: PLANS[p].annual ? '$' + PLANS[p].annual + '/mo annual' : (PLANS[p].annual_note || 'Custom') }); break; }
  }
  return out;
}
function moduleOn(m, s) {
  const t = TENANTS[s.t];
  if (m === 'books') return t.books !== 'qbo_system';
  if (m === 'snow_ice') return t.addons.includes('snow_ice') || planCode(s) === 'enterprise';
  return t.modules.includes(m);
}
function navVis(surface, nav, roleKey, scopeKey) {
  const N = P.roles.nav_visibility;
  if (surface === 'web') {
    if (roleKey === 'observer') return OBS_NAV[nav] || '-';
    const row = N.web.items[nav]; return row ? (row[roleKey] || '-') : 'F';
  }
  if (surface === 'console') { const row = N.console.items[nav]; return row ? (row[roleKey] || '-') : '-'; }
  if (surface === 'portal') {
    if (nav === 'Commercial workspace') {
      if (roleKey !== 'client_commercial') return '-';
      return { primary: 'F', approver: 'F (approvals)', billing: 'R (documents)', property_contact: '-', viewer: 'R', co_owner: 'F' }[scopeKey] || '-';
    }
    const row = N.portal.items[nav]; let v = row ? (row[scopeKey] || '-') : 'F';
    if (/^C \[-\]/.test(v)) v = '-';
    return v;
  }
  return 'F';
}
function grant(cap, roleKey) {
  if (roleKey === 'observer') return OBS_CAPS[cap] || '-';
  const g = CAPS[cap]; return g ? (g[roleKey] || '-') : 'F';
}
function fieldClass(fc, roleKey) {
  if (roleKey === 'observer') return fc === 'margin' || fc === 'price' || fc === 'cost' ? 'R' : '-';
  if (!(roleKey in (FC.price || {}))) return '-';
  const g = FC[fc]; return g ? (g[roleKey] || '-') : 'RW';
}
RL.fieldClass = fieldClass;
const isDash = v => !v || v === '-' || /^-( |$)/.test(v) || v.startsWith('- cfg');

/* access(route, state) -> { ok, state: ok|limit|locked|hidden|denied|off|scope|surface, why: [..], unlock?, limit? } */
function access(rt, s) {
  const o = ASK[s.as], role = o.role, why = [];
  const lensBlocked = SCOPE_RANK[rt.scope] > LENS[s.scope];
  const res = (state, extra) => Object.assign({ ok: state === 'ok' || state === 'limit', state, why, lens: lensBlocked }, extra || {});
  if (!SURF[role].includes(rt.surface)) {
    why.push(`${ROLES[role].name} does not use the ${SURFACES[rt.surface].name}.`);
    return res('surface');
  }
  if (rt.roles && !rt.roles.includes(role)) { why.push(`Only ${rt.roles.map(k => ROLES[k] ? ROLES[k].name : k).join(', ')} can open this.`); return res('denied'); }
  const nv = navVis(rt.surface, rt.nav, role, o.scope);
  if (rt.surface === 'web' || rt.surface === 'console' || rt.surface === 'portal') {
    if (isDash(nv)) { why.push(`Navigation: '${rt.nav}' is hidden for ${o.scope ? o.scope + ' contacts' : role} (${rt.surface === 'web' ? '21 §5.9' : rt.surface === 'console' ? '21 §5.5' : '21 §5.4'}).`); return res('denied', { nav: nv }); }
  }
  if (rt.perm && rt.surface === 'web') {
    const g = grant(rt.perm, role);
    if (isDash(g)) { why.push(`Permission ${rt.perm}: ${g === '-' ? 'none' : g} for ${role} (02 §10.1).`); return res('denied', { grant: g }); }
  }
  if (rt.module && !moduleOn(rt.module, s)) { why.push(`${TENANTS[s.t].name} has not enabled ${rt.module === 'books' ? 'Books (QuickBooks is its system of record)' : rt.module}. Hidden, not greyed out (21 §5.2).`); return res('off'); }
  if (rt.feature) {
    const fs = featState(rt.feature, s);
    const isClient = role.startsWith('client_');
    if (fs.s === 'A' || fs.s === '-') {
      why.push(`${FEATS[rt.feature].name}: ${fs.s === 'A' ? 'add-on' : 'not available'} on ${PLANS[planCode(s)].name}.`);
      if (BUYERS.has(role) && !isClient) return res('locked', { unlock: fs.unlock, feature: rt.feature });
      return res('hidden', { unlock: fs.unlock, feature: rt.feature });
    }
    if (fs.s === 'L') { why.push(`Included with limits on ${PLANS[planCode(s)].name}: ${fs.note || 'see plan'}.`); return res('limit', { limit: fs.note, feature: rt.feature }); }
  }
  return res('ok', { nav: nv });
}
RL.access = access;

// ---------- context ----------
function personFor(o, t) {
  const role = o.role;
  const cast = t.cast || {};
  if (cast[role]) return cast[role];
  const plat = { platform_owner: 'You (the founder)', platform_support: 'Maya', platform_curator: 'Dr. Priya', platform_finance: 'Tom', platform_engineer: 'Sam', partner_admin: 'Karen Liu, CPA', partner_member: 'Devin Shah (staff accountant)', prospect: 'A prospect', homeowner: 'Ellen Park', observer: 'Pat Castillo (silent partner)' };
  if (plat[role]) return plat[role];
  const D = RL.data(t);
  if (role === 'client_residential') return { primary: D.res.primary, co_owner: D.res.co_owner, property_contact: D.res.resident }[o.scope] || D.res.primary;
  if (role === 'client_commercial') return { primary: D.com.primary, approver: D.com.approver, billing: D.com.billing, property_contact: D.com.site, viewer: D.com.viewer }[o.scope] || D.com.primary;
  return ROLES[role] ? ROLES[role].name : role;
}
function ctx() {
  const s = RL.S, o = ASK[s.as], t = TENANTS[s.t], pc = planCode(s);
  const rt = ROUTES[s.r];
  const surface = rt ? rt.surface : 'atlas';
  const c = {
    s, P, RL, t, tenant: t, seg: SEGS[t.segment], planCode: pc, plan: PLANS[pc], as: o, role: o.role, roleObj: ROLES[o.role], scope: o.scope || null,
    route: rt, surface, x: s.x, lang: s.lang, es: s.lang === 'es', season: s.season, winter: s.season === 'winter',
    D: RL.data(t),
  };
  // Usage follows the plan being viewed, so a plan override never shows usage above the plan's allowance
  c.D.kpi.aiUsed = Math.round((c.plan.ai_credits || 600) * .58); c.D.kpi.sms = Math.round((c.plan.sms || 500) * .44);
  c.who = personFor(o, t);
  c.owner = (t.cast && t.cast.owner) || 'the owner';
  c.feat = k => featState(k, s);
  c.has = k => { const f = featState(k, s); return f.s === 'Y' || f.s === 'L'; };
  c.mod = m => moduleOn(m, s);
  c.can = cap => grant(cap, o.role);
  c.allowed = cap => !isDash(grant(cap, o.role));
  c.fc = fcKey => fieldClass(fcKey, o.role);
  c.sees = fcKey => { const v = fieldClass(fcKey, o.role); return !isDash(v); };
  c.vis = (surface, nav) => navVis(surface, nav, o.role, o.scope);
  c.inLens = tag => SCOPE_RANK[tag] <= LENS[s.scope];
  c.tr = (en, es) => (s.lang === 'es' && es != null) ? es : en;
  c.access = id => access(ROUTES[id], s);
  c.today = s.season === 'winter' ? { label: 'Tue Jan 12, 2027', short: 'Jan 12', month: 'January', dow: 'Tuesday' } : { label: 'Tue May 11, 2027', short: 'May 11', month: 'May', dow: 'Tuesday' };
  return c;
}
RL.ctx = ctx;

// ---------- routes helpers ----------
RL.routesFor = (surface) => P.surfaces.routes.filter(r => r.surface === surface);
RL.navGroups = (surface) => { const seen = []; RL.routesFor(surface).forEach(r => { if (!seen.includes(r.nav)) seen.push(r.nav); }); return seen; };
// Visible routes in a nav group for the current state (used by frames)
RL.groupRoutes = (surface, nav, c) => RL.routesFor(surface).filter(r => r.nav === nav && !r.id.endsWith('.manager') && !(r.path.includes(':') && r.parent))
  .map(r => ({ r, a: access(r, c.s) })).filter(({ r, a }) => (a.ok || a.state === 'locked') && c.inLens(r.scope));
RL.screen = (id, fn) => { RL.screens[id] = fn; };
RL.act = (name, fn) => { RL.acts[name] = fn; };
RL.modal = (id, fn) => { RL.modals[id] = fn; };

// ---------- render ----------
let rendering = false;
function render(opts) {
  if (rendering) return; rendering = true;
  try {
    const c = ctx();
    RL.renderBar(c);
    const main = document.getElementById('xmain');
    const lens = document.getElementById('lens');
    document.getElementById('xl').classList.toggle('nolens', RL.S.lens === '0');
    let inner;
    if (RL.atlasPages[RL.S.r]) {
      inner = RL.atlasPages[RL.S.r](c);
      lens.innerHTML = RL.lensAtlas(c);
    } else {
      const rt = c.route, a = access(rt, c.s);
      let body;
      if (a.ok) body = (a.lens ? RL.h.note(`This screen is <b>${rt.scope}</b> scope, outside the current lens. Shown because you navigated to it directly.`) : '') + screenHtml(rt, c, a);
      else body = RL.deniedHtml(rt, c, a);
      inner = (RL.frames[rt.surface] || RL.frames.generic)(c, body, a);
      lens.innerHTML = RL.lensHtml(c, a);
    }
    main.innerHTML = inner;
    RL.after.forEach(fn => { try { fn(c); } catch (e) { console.error(e); } });
    RL.after = [];
    if (!opts || !opts.keepScroll) { const top = document.getElementById('xl').getBoundingClientRect().top + window.scrollY - 110; if (window.scrollY > top) window.scrollTo({ top: Math.max(0, top) }); }
    document.title = (RL.S.r.startsWith('atlas') ? 'Platform Explorer' : (c.route.label + ' · ' + c.who)) + ' · Rootline';
  } finally { rendering = false; }
}
RL.render = render;
function screenHtml(rt, c, a) {
  const fn = RL.screens[rt.id];
  if (!fn) return RL.placeholder(rt, c);
  try { return fn(c, a); } catch (e) { console.error(e); return `<div class="deny"><div class="dh">Screen error</div><pre class="tiny">${RL.h.esc(String(e && e.stack || e))}</pre></div>`; }
}
RL.placeholder = (rt, c) => RL.h.page({ title: rt.label, sub: rt.purpose }) + RL.h.card({ title: 'Screen not mocked yet', body: `<p class="t2">${RL.h.esc(rt.purpose)}</p>` + RL.h.note('Spec: ' + (rt.spec || '')) });

// ---------- events ----------
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-go],[data-act],[data-ui],[data-modal],[data-set],[data-close]');
  if (!el || el.disabled) return;
  if (el.hasAttribute('data-self')) return;
  ev.preventDefault();
  if (el.dataset.close != null) { RL.closeModal(); return; }
  if (el.dataset.go) { RL.closeModal(); RL.go(el.dataset.go, el.dataset.x); return; }
  if (el.dataset.set) { RL.closeModal(); const patch = {}; el.dataset.set.split('&').forEach(kv => { const [k, v] = kv.split('='); patch[k] = v; }); RL.set(patch); return; }
  if (el.dataset.ui) { RL.ui[el.dataset.ui] = el.dataset.val; render({ keepScroll: true }); return; }
  if (el.dataset.modal) { const fn = RL.modals[el.dataset.modal]; if (fn) { const m = fn(ctx(), el); if (m) RL.openModal(m); } return; }
  if (el.dataset.act) { const fn = RL.acts[el.dataset.act]; if (fn) { const r = fn(el, ev, ctx()); if (r !== false) render({ keepScroll: true }); } else RL.toast('Mock action: ' + el.dataset.act); }
});
document.addEventListener('change', ev => {
  const el = ev.target;
  if (el.dataset.xb) { const patch = {}; patch[el.dataset.xb] = el.value; RL.set(patch); return; }
  if (el.dataset.uiInput) { RL.ui[el.dataset.uiInput] = el.type === 'checkbox' ? el.checked : el.value; render({ keepScroll: true }); }
});
document.addEventListener('keydown', ev => { if (ev.key === 'Escape') RL.closeModal(); });
window.addEventListener('popstate', () => { RL.S = readHash(); render(); });
RL.toast = (msg) => {
  let t = document.getElementById('toast'); if (t) t.remove();
  t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status');
  t.innerHTML = RL.h.icon('check') + '<span>' + msg + '</span>'; document.body.appendChild(t);
  clearTimeout(RL._tt); RL._tt = setTimeout(() => t.remove(), 3200);
};
RL.openModal = (m) => {
  RL.closeModal();
  const d = document.createElement('div'); d.className = 'modal-bg'; d.id = 'modal';
  d.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-h"><div class="modal-h"><h2 id="modal-h">${m.title}</h2><button class="icon-btn" data-close aria-label="Close">${RL.h.icon('x')}</button></div><div class="modal-b">${m.body}</div>${m.foot ? '<div class="modal-f">' + m.foot + '</div>' : ''}</div>`;
  d.addEventListener('click', e => { if (e.target === d) RL.closeModal(); });
  document.body.appendChild(d);
  const f = d.querySelector('button, input, select, textarea'); if (f) f.focus();
};
RL.closeModal = () => { const d = document.getElementById('modal'); if (d) d.remove(); };

RL.boot = () => {
  try { const th = localStorage.getItem('rootline-proto-theme'); if (th) document.documentElement.dataset.theme = th; } catch (e) {}
  RL.S = readHash();
  render();
};
})();
