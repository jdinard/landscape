/* Rootline Platform Explorer - explorer bar, surface frames, permission states and the lens panel. */
(() => {
'use strict';
const RL = window.RL, h = RL.h, { esc, icon } = h;
const I = RL.idx;
const NAV_ICON = { Today: 'today', Inbox: 'inbox', Clients: 'users', Sales: 'tag', Design: 'pen', Schedule: 'calendar', Jobs: 'clipboard', Money: 'dollar', Books: 'bank', Operations: 'box', Team: 'user', Marketing: 'mega', Reports: 'chart', Automations: 'bolt', Settings: 'cog',
  Home: 'home', 'Tenants / Tenant 360': 'building', Migrations: 'refresh', Billing: 'receipt', 'Entitlements and flags': 'flag', Support: 'help', 'Plant KB': 'leaf', Content: 'book', 'AI Ops': 'spark', Comms: 'chat', 'Payments oversight': 'card', 'Risk and trust': 'shield', Compliance: 'archive', Analytics: 'chart', 'System health': 'server', Partners: 'users', 'Staff and audit': 'key' };
const PRIMARY = ['Today', 'Inbox', 'Clients', 'Sales', 'Design', 'Schedule', 'Jobs', 'Money', 'Books'];
const MORE = ['Operations', 'Team', 'Marketing', 'Reports', 'Automations', 'Settings'];
const SURF_LAND = { web: 'web.today', crew: 'crew.today', crew_manager: 'crew.manager', kiosk: 'crew.kiosk', sub: 'sub.orders', portal: 'portal.home', console: 'console.home', partner: 'partner.clients', www: 'www.home', home: 'home.start' };
RL.SURF_LAND = SURF_LAND;
const SURF_LABEL = { web: 'Web app', crew: 'Crew app', crew_manager: 'Manager mode (V1)', kiosk: 'Shop kiosk (V1)', sub: 'Sub lite', portal: 'Portal', console: 'Console', partner: 'Partner hub', www: 'rootline.com', home: 'Rootline Home' };

// ---------- explorer bar ----------
RL.renderBar = (c) => {
  const s = c.s, el = document.getElementById('xb');
  const active = document.activeElement && document.activeElement.id;
  const groups = {}; RL.AS.forEach(o => { (groups[o.group] = groups[o.group] || []).push(o); });
  const asSel = Object.entries(groups).map(([g, list]) => `<optgroup label="${esc(g)}">${list.map(o => `<option value="${o.key}"${o.key === s.as ? ' selected' : ''}>${esc(o.label)}</option>`).join('')}</optgroup>`).join('');
  const tSel = RL.P.tenants.tenants.map(t => `<option value="${t.id}"${t.id === s.t ? ' selected' : ''}>${esc(t.segment + ' · ' + t.name)}</option>`).join('');
  const pSel = `<option value=""${!s.plan ? ' selected' : ''}>${esc(I.PLANS[c.t.plan].name)} (tenant's plan)</option>` + RL.P.plans.plans.filter(p => p.code !== 'archive').map(p => `<option value="${p.code}"${p.code === s.plan ? ' selected' : ''}>${esc(p.name)}${p.public ? '' : ' (sales-led)'}${p.scope !== 'MVP' ? ' · ' + p.scope : ''}</option>`).join('');
  const seg = (key, opts) => `<span class="seg" role="group">${opts.map(([v, l]) => `<button type="button" data-set="${key}=${v}" aria-pressed="${s[key] === v}">${l}</button>`).join('')}</span>`;
  const surfs = RL.SURF[c.role];
  const surfBtns = surfs.length > 1 ? `<label>Surface<span class="seg" role="group">${surfs.map(sf => `<button type="button" data-set="r=${SURF_LAND[sf]}" aria-pressed="${c.surface === sf}">${SURF_LABEL[sf]}</button>`).join('')}</span></label>` : '';
  const atlas = [['atlas.home', 'Explorer'], ['atlas.personas', 'Personas'], ['atlas.roles', 'Roles and access'], ['atlas.plans', 'Packages'], ['atlas.segments', 'Markets'], ['atlas.compare', 'Who sees what'], ['atlas.routes', 'Every screen']];
  el.innerHTML = `<div class="xb-in">
    <label for="xb-t">Market (tenant)<select id="xb-t" data-xb="t">${tSel}</select></label>
    <label for="xb-plan">Package<select id="xb-plan" data-xb="plan">${pSel}</select></label>
    <label for="xb-as">View as<select id="xb-as" data-xb="as">${asSel}</select></label>
    ${surfBtns}
    <label>Scope lens${seg('scope', [['mvp', 'MVP'], ['v1', '+V1'], ['v2', '+V2'], ['all', 'All']])}</label>
    <label>Season${seg('season', [['peak', 'May'], ['winter', 'January']])}</label>
    <label>Language${seg('lang', [['en', 'EN'], ['es', 'ES']])}</label>
    <span class="sp"></span>
    <span class="who">${h.avatar(String(c.who))}<span><b>${esc(c.who)}</b><span class="t3">${esc(c.as.label)}${['platform', 'public'].includes(c.roleObj.kind) ? '' : ' · ' + esc(c.t.name)}</span></span></span>
  </div><div class="xb-in" style="padding-top:0">
    <span class="flex gap4">${atlas.map(([r, l]) => `<button type="button" class="xbtn" data-go="${r}" aria-pressed="${s.r === r}">${l}</button>`).join('')}</span>
    <span class="sp"></span>
    <button type="button" class="xbtn" data-act="xb-lens" aria-pressed="${s.lens !== '0'}">${icon('eye')}Why you see this</button>
    <button type="button" class="xbtn" data-act="xb-theme">${icon('moon')}Theme</button>
  </div>`;
  if (active && document.getElementById(active)) document.getElementById(active).focus();
};
RL.act('xb-lens', () => { RL.set({ lens: RL.S.lens === '0' ? '1' : '0' }, { keepScroll: true }); return false; });
RL.act('xb-theme', () => {
  const root = document.documentElement;
  const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = dark ? 'light' : 'dark';
  try { localStorage.setItem('rootline-proto-theme', root.dataset.theme); } catch (e) {}
  return false;
});

// ---------- shared pieces ----------
const browser = (url, inner, o) => `<div class="fr"${o && o.max ? ` style="max-width:${o.max}px;margin:0 auto"` : ''}><div class="fr-bar"><span class="dots"><i></i><i></i><i></i></span><span class="url">${esc(url)}</span>${o && o.right ? o.right : ''}</div>${inner}</div>`;
RL.browser = browser;
function navItemState(surface, nav, c) {
  const rs = RL.routesFor(surface).filter(r => r.nav === nav && c.inLens(r.scope));
  if (!rs.length) return null;
  const acc = rs.map(r => RL.access(r, c.s));
  if (acc.some(a => a.ok)) {
    const v = c.vis(surface, nav);
    return { state: 'ok', ro: /^R/.test(v), first: rs[acc.findIndex(a => a.ok)] };
  }
  if (acc.some(a => a.state === 'locked')) return { state: 'locked', first: rs[acc.findIndex(a => a.state === 'locked')] };
  return null;
}
RL.navItemState = navItemState;
function railItem(surface, nav, c) {
  const st = navItemState(surface, nav, c); if (!st) return '';
  const cur = c.route && c.route.nav === nav;
  return `<button type="button" class="mx-nav${st.state === 'locked' ? ' locked' : ''}" data-go="${st.first.id}"${cur ? ' aria-current="page"' : ''}>${icon(NAV_ICON[nav] || 'grid')}<span>${esc(nav.replace(' / Tenant 360', ''))}</span>${st.state === 'locked' ? icon('lock', 's lk') : st.ro ? '<span class="ro" title="Read-mostly (21 §5.9)">R</span>' : ''}</button>`;
}
function subnav(surface, c) {
  if (!c.route) return '';
  const list = RL.groupRoutes(surface, c.route.nav, c);
  if (list.length < 2) return '';
  const curId = c.route.parent && !list.find(x => x.r.id === c.route.id) ? c.route.parent : c.route.id;
  return `<div class="mx-subnav" role="tablist">${list.map(({ r, a }) => `<button type="button" data-go="${r.id}"${r.id === curId ? ' aria-current="page"' : ''}${a.state === 'locked' ? ' class="locked"' : ''}>${a.state === 'locked' ? icon('lock', 's') : ''}${esc(r.label)}${r.scope !== 'MVP' ? ' ' + h.tag(r.scope) : ''}</button>`).join('')}</div>`;
}
const logoBox = (t) => `<span class="logo" style="background:${esc(t.brand.color)}">${esc(t.brand.logo)}</span>`;

// ---------- frames ----------
RL.frames = {};
RL.frames.web = (c, body) => {
  const t = c.t, pl = c.plan;
  const rail = `<nav class="mx-rail" aria-label="Company app">
    <div class="mx-co">${logoBox(t).replace('logo"', 'logo"')}<div class="grow"><b>${esc(t.name)}</b><span>${esc(pl.name)} · ${esc(t.city)}</span></div></div>
    ${PRIMARY.map(n => railItem('web', n, c)).join('')}
    <div class="mx-sep">More</div>
    ${MORE.map(n => railItem('web', n, c)).join('')}
  </nav>`;
  const credits = pl.ai_credits ? `<span class="mx-tb" title="AI credits this month (22 §4.4.1)">${icon('spark', 's')}${h.num(c.D.kpi.aiUsed)} / ${h.num(pl.ai_credits)} cr</span>` : '';
  const fieldWeb = ['crew_lead', 'technician'].includes(c.role) ? h.banner(`${icon('phone')} ${esc(c.who)} normally works in the crew app. Web access for field roles is limited by default and can be disabled per Company (21 §5.9).`, 'info') : '';
  const top = `<div class="mx-top">
    <span class="mx-search">${icon('search')}Search clients, jobs, invoices, plants<span class="kbd">⌘K</span></span>
    ${c.allowed('lead') || c.allowed('job') ? `<span class="mx-tb">${icon('plus', 's')}Create</span>` : ''}
    ${c.allowed('copilot.use') ? `<span class="mx-tb ai" data-modal="copilot" role="button" tabindex="0">${icon('spark', 's')}Copilot</span>` : ''}
    ${credits}
    <span class="mx-tb" aria-label="Notifications">${icon('bell', 's')}3</span>
    <span class="mx-av" title="${esc(c.who)}">${esc(h.initials(c.who))}</span>
  </div>`;
  const trial = c.s.plan === '' && c.t.id === 'greenleaf' ? '' : '';
  return `<div class="fr"><div class="mx">${rail}<div class="mx-body">${top}${fieldWeb}${trial}${subnav('web', c)}<div class="mx-content">${body}</div></div></div></div>`;
};
RL.frames.console = (c, body) => {
  const groups = RL.navGroups('console');
  const staff = c.roleObj;
  const rail = `<nav class="mx-rail" aria-label="Platform console">
    <div class="mx-co"><span class="logo" style="background:var(--moss-700)">${icon('leaf')}</span><div class="grow"><b style="color:#fff">Rootline console</b><span>production · us-east</span></div></div>
    ${groups.map(n => railItem('console', n, c)).join('')}
  </nav>`;
  const top = `<div class="mx-top">
    <span class="mx-search">${icon('search')}Search tenants, users, invoices, plants, tickets<span class="kbd">/</span></span>
    <span class="mx-tb">${icon('approve', 's')}Approvals 3</span>
    <span class="mx-tb">${icon('warn', 's')}Incidents 0</span>
    <span class="mx-tb">${icon('key', 's')}Step-up: security key</span>
    <span class="mx-av" style="background:var(--moss-100);color:var(--moss-800)">${esc(h.initials(c.who))}</span>
  </div>`;
  return browser('https://console.rootline.app' + (c.route.path === '/' ? '' : c.route.path.replace(':id', c.x || c.t.id)), `<div class="mx console">${rail}<div class="mx-body">${top}${h.banner(`${icon('shield')} Signed in as ${esc(c.who)} (${esc(staff.key)}). Every privileged action needs a reason and is written to the platform audit log (19, 02 §5.13).`, 'info')}${subnav('console', c)}<div class="mx-content">${body}</div></div></div>`);
};
function phone(c, o) {
  const time = c.winter ? '4:52' : '7:42';
  return `<div class="ph" aria-label="${esc(o.label || 'Phone')}"><div class="ph-status"><span>${time}</span><span class="flex gap4">${o.offline ? icon('wifi-off', 's') : ''}${icon('battery', 's')}</span></div>${o.head || ''}<div class="ph-body">${o.body}</div>${o.tabs || ''}</div>`;
}
RL.phone = phone;
const splitSide = body => { const i = body.indexOf('<!--side-->'); return i < 0 ? [body, ''] : [body.slice(0, i), body.slice(i + 11)]; };
RL.frames.crew = (c, body) => {
  const tabs = [['crew.today', 'today', c.tr('Today', 'Hoy')], ['crew.map', 'map', c.tr('Map', 'Mapa')], ['crew.time', 'clock', c.tr('Time', 'Tiempo')], ['crew.messages', 'chat', c.tr('Messages', 'Mensajes')], ['crew.more', 'grid', c.tr('More', 'Más')]];
  const cur = c.route.nav;
  const crew = c.D.crews[0] || { name: 'Crew', truck: '' };
  const head = `<div class="ph-head">${h.avatar(String(c.who))}<div class="grow"><b>${esc(c.who)}</b><span>${esc(crew.name)} · ${esc(crew.truck)}</span></div><span class="pill ok">${icon('refresh', 's')}${c.tr('Synced', 'Sincronizado')}</span></div>`;
  const tb = `<nav class="ph-tabs" aria-label="Crew app">${tabs.map(([id, ic, l]) => `<button type="button" data-go="${id}"${I.ROUTES[id].nav === cur ? ' aria-current="page"' : ''}>${icon(ic)}${l}</button>`).join('')}</nav>`;
  const [ph, side] = splitSide(body);
  return `<div class="ph-wrap">${phone(c, { head, body: ph, tabs: tb, label: 'Rootline Crew app' })}${side ? `<div class="ph-side">${side}</div>` : ''}</div>`;
};
RL.frames.crew_manager = (c, body) => {
  const head = `<div class="ph-head">${h.avatar(String(c.who))}<div class="grow"><b>${esc(c.who)}</b><span>${esc(c.t.name)} · ${c.tr('Manager mode', 'Modo gerente')}</span></div>${h.tag('V1')}</div>`;
  const tb = `<nav class="ph-tabs" aria-label="Manager mode">${[['today', 'Today'], ['calendar', 'Schedule'], ['users', 'Clients'], ['camera', 'Capture'], ['grid', 'More']].map(([ic, l], i) => `<button type="button" data-act="mgr-tab"${i === 0 ? ' aria-current="page"' : ''}>${icon(ic)}${l}</button>`).join('')}</nav>`;
  const [ph, side] = splitSide(body);
  return `<div class="ph-wrap">${phone(c, { head, body: ph, tabs: tb, label: 'Manager mode' })}${side ? `<div class="ph-side">${side}</div>` : ''}</div>`;
};
RL.frames.kiosk = (c, body) => browser('Rootline Crew · kiosk mode · ' + c.t.branches[0] + ' yard', `<div class="site-body">${body}</div>`, { max: 980 });
RL.frames.sub = (c, body) => {
  const head = `<div class="ph-head"><span class="logo" style="width:26px;height:26px;border-radius:7px;display:grid;place-items:center;color:#fff;font-size:.66rem;font-weight:800;background:${esc(c.t.brand.color)}">${esc(c.t.brand.logo)}</span><div class="grow"><b>${esc(c.t.name)}</b><span>${c.tr('Work orders for', 'Órdenes de trabajo para')} ${esc(c.who)}</span></div></div>`;
  const tb = `<nav class="ph-tabs" aria-label="Subcontractor">${[['sub.orders', 'clipboard', c.tr('Work orders', 'Órdenes')], ['sub.invoices', 'receipt', c.tr('Invoices', 'Facturas')]].map(([id, ic, l]) => `<button type="button" data-go="${id}"${c.route.nav === I.ROUTES[id].nav ? ' aria-current="page"' : ''}>${icon(ic)}${l}</button>`).join('')}</nav>`;
  const [ph, side] = splitSide(body);
  return `<div class="ph-wrap">${phone(c, { head: `<div class="fr-bar" style="border-radius:0"><span class="url">app.rootline.com/${esc(c.t.id)}/sub${esc(c.route.path.replace('/sub', '').replace(':id', c.x || ''))}</span></div>` + head, body: ph, tabs: tb, label: 'Subcontractor lite' })}${side ? `<div class="ph-side">${side}</div>` : ''}</div>`;
};
RL.portalBrand = (c) => {
  const white = c.has('portal_white_label');
  return white ? { white: true, host: c.t.brand.portal.includes('rootline.app') ? 'portal.' + c.t.id + '.example' : c.t.brand.portal, name: c.t.name, color: c.t.brand.color, logo: c.t.brand.logo }
    : { white: false, host: c.t.id + '.rootline.app', name: c.t.name, color: 'var(--moss-600)', logo: c.t.brand.logo };
};
RL.frames.portal = (c, body) => {
  const b = RL.portalBrand(c);
  const items = RL.routesFor('portal').filter(r => !r.parent && r.id !== 'portal.account').map(r => ({ r, a: RL.access(r, c.s) })).filter(({ r, a }) => a.ok && c.inLens(r.scope));
  const cur = c.route.parent || c.route.id;
  const nav = `<nav aria-label="Portal">${items.map(({ r }) => `<button type="button" data-go="${r.id}"${r.id === cur ? ' aria-current="page"' : ''}>${esc(c.tr(r.label, PORTAL_ES[r.id] || r.label))}</button>`).join('')}<button type="button" data-go="portal.account"${cur === 'portal.account' ? ' aria-current="page"' : ''}>${icon('user', 's')}</button></nav>`;
  const top = `<div class="site-top"><span class="logo" style="background:${b.color}">${esc(b.logo)}</span><b>${esc(b.name)}</b>${b.white ? '' : `<span class="pill">${icon('leaf', 's')}on Rootline</span>`}${nav}</div>`;
  const foot = `<div class="site-foot"><span>${b.white ? esc(b.name) + ' customer portal' : 'Rootline-branded portal (Starter). White-label and custom domain from Grow (22 §4.2.1).'}</span><span>${b.white ? 'Powered by Rootline' : 'rootline.app'}</span></div>`;
  const device = RL.ui['portal.device'] || 'desktop';
  const sw = `<span class="seg" style="display:inline-flex;border:1px solid var(--border);border-radius:6px;overflow:hidden"><button type="button" class="btn sm ghost" data-ui="portal.device" data-val="desktop" aria-pressed="${device === 'desktop'}">Desktop</button><button type="button" class="btn sm ghost" data-ui="portal.device" data-val="phone" aria-pressed="${device === 'phone'}">Phone</button></span>`;
  const [main, side] = splitSide(body);
  if (device === 'phone') {
    const head = `<div class="ph-head"><span class="logo" style="width:26px;height:26px;border-radius:7px;display:grid;place-items:center;color:#fff;font-size:.66rem;font-weight:800;background:${b.color}">${esc(b.logo)}</span><div class="grow"><b>${esc(b.name)}</b><span>${esc(b.host)}</span></div></div>`;
    const tabs = `<nav class="ph-tabs" aria-label="Portal">${items.slice(0, 5).map(({ r }) => `<button type="button" data-go="${r.id}"${r.id === cur ? ' aria-current="page"' : ''}>${icon({ 'portal.home': 'home', 'portal.proposals': 'pen', 'portal.schedule': 'calendar', 'portal.billing': 'card', 'portal.requests': 'plus', 'portal.history': 'clipboard', 'portal.portfolio': 'building', 'portal.approvals': 'approve' }[r.id] || 'grid')}${esc(c.tr(r.label, PORTAL_ES[r.id] || r.label).split(' ')[0])}</button>`).join('')}</nav>`;
    return `<div class="flex mb8" style="justify-content:center">${sw}</div><div class="ph-wrap">${phone(c, { head, body: main, tabs, label: 'Customer portal on a phone' })}${side ? `<div class="ph-side">${side}</div>` : ''}</div>`;
  }
  return browser('https://' + b.host + c.route.path.replace(':id', c.x || ''), `${top}<div class="site-body">${main}${side ? `<div>${side}</div>` : ''}</div>${foot}`, { right: sw });
};
const PORTAL_ES = { 'portal.home': 'Inicio', 'portal.proposals': 'Propuestas y diseños', 'portal.schedule': 'Calendario', 'portal.billing': 'Facturas y pagos', 'portal.requests': 'Solicitudes', 'portal.history': 'Historial', 'portal.property': 'Mi jardín', 'portal.messages': 'Mensajes', 'portal.portfolio': 'Cartera', 'portal.approvals': 'Aprobaciones', 'portal.documents': 'Documentos', 'portal.reports': 'Informes' };
RL.frames.partner = (c, body) => {
  const items = RL.routesFor('partner').map(r => ({ r, a: RL.access(r, c.s) })).filter(({ a }) => a.ok);
  const top = `<div class="site-top"><span class="logo" style="background:var(--moss-700)">${icon('leaf')}</span><b>Rootline Partners</b><span class="pill">Accountant Hub ${h.tag('V1')}</span><nav aria-label="Partner portal">${items.map(({ r }) => `<button type="button" data-go="${r.id}"${r.id === c.route.id ? ' aria-current="page"' : ''}>${esc(r.label)}</button>`).join('')}</nav></div>`;
  return browser('https://partners.rootline.app' + c.route.path, `${top}<div class="site-body">${body}</div>`);
};
RL.frames.www = (c, body) => {
  const items = [['www.product', 'Product'], ['www.solutions', 'Solutions'], ['www.pricing', 'Pricing'], ['www.switch', 'Switch'], ['www.plants', 'Plant Finder'], ['www.resources', 'Resources'], ['www.trust', 'Trust']].filter(([id]) => c.inLens(I.ROUTES[id].scope));
  const top = `<div class="site-top"><span class="logo" style="background:var(--moss-600)">${icon('leaf')}</span><b style="font-family:var(--font-display);font-size:1.1rem">Rootline</b><nav aria-label="Marketing site">${items.map(([id, l]) => `<button type="button" data-go="${id}"${c.route.id === id ? ' aria-current="page"' : ''}>${l}</button>`).join('')}<button type="button" data-go="www.start" class="btn primary sm" style="color:var(--on-primary)">Start free trial</button></nav></div>`;
  const foot = `<div class="site-foot"><span>Rootline · published prices · zero payment markup on your own Stripe</span><span><a href="#" data-go="www.trust">Trust</a> · <a href="#" data-go="www.partners">Partners</a> · <a href="#" data-go="home.start">Design my yard</a></span></div>`;
  return browser('https://rootline.com' + c.route.path.replace(':segment', (c.seg.id || '').toLowerCase()).replace(':vendor', RL.ui['www.vendor'] || 'jobber'), `${top}<div class="site-body">${body}</div>${foot}`);
};
RL.frames.home = (c, body) => {
  const top = `<div class="site-top"><span class="logo" style="background:var(--iris-600)">${icon('sprout')}</span><b style="font-family:var(--font-display)">Rootline Home</b><span class="pill ai">${icon('spark', 's')}AI yard design</span><nav aria-label="Rootline Home"><button type="button" data-go="www.plants">Plant Finder</button><button type="button" data-go="home.start">Start over</button></nav></div>`;
  const [main, side] = splitSide(body);
  return browser('https://rootline.com' + c.route.path, `${top}<div class="site-body">${main}${side ? `<div>${side}</div>` : ''}</div><div class="site-foot"><span>Concepts are AI-generated and labeled as such; plants come from the curated ${esc(c.t.region)} palette.</span><span>Rootline Home ${h.tag('V1')}</span></div>`);
};
RL.frames.generic = (c, body) => `<div class="site-body">${body}</div>`;

// ---------- permission and gating states (21 §5.8) ----------
RL.deniedHtml = (rt, c, a) => {
  const why = a.why.map(w => `<li>${esc(w)}</li>`).join('');
  const idLabel = (c.x ? ' ' + esc(c.x) : '');
  if (a.state === 'surface') {
    const land = SURF_LAND[RL.SURF[c.role][0]];
    return `<div class="deny"><div class="dh">${icon('phone')}${esc(c.who)} works in the ${esc(I.SURFACES[RL.SURF[c.role][0]].name)}</div><ul class="small t2">${why}</ul>${h.btn('Open ' + esc(I.ROUTES[land].label), { kind: 'primary', go: land })}</div>`;
  }
  if (a.state === 'locked') return h.lock(c, a.feature, a.unlock) + `<ul class="small t2">${why}</ul>`;
  if (a.state === 'hidden') return `<div class="deny"><div class="dh">${icon('eye-off')}Not on ${esc(c.plan.name)}</div><p class="small t2">${esc(I.FEATS[a.feature].name)} is not part of this Company's package. Only people who can buy (the owner) see an upgrade prompt; everyone else never sees the entry.</p><ul class="small t2">${why}</ul></div>`;
  if (a.state === 'off') return `<div class="deny"><div class="dh">${icon('eye-off')}Module not enabled</div><ul class="small t2">${why}</ul></div>`;
  return `<div class="deny"><div class="dh">${icon('lock')}You don't have access to this ${esc(rt.label.toLowerCase())}${idLabel}</div><p class="small t2">Ask ${esc(c.owner)} (owner) or request access. The permission state never reveals the record's title, client or amount (21 §5.8).</p><div class="flex">${h.btn('Request access', { act: 'request-access' })}</div><ul class="small t3">${why}</ul></div>`;
};
RL.act('request-access', (el, ev, c) => { RL.toast(`Access request sent to ${c.owner} (mock).`); return false; });

// ---------- lens ----------
const dotFor = st => ({ ok: 'dot-ok', limit: 'dot-ok', locked: 'dot-lock', hidden: 'dot-hide', off: 'dot-hide', denied: 'dot-deny', surface: 'dot-hide', scope: 'dot-scope' }[st] || 'dot-hide');
const stLabel = { ok: 'visible', limit: 'visible, with plan limit', locked: 'locked: upgrade prompt', hidden: 'hidden: not in plan', off: 'hidden: module off', denied: 'hidden: role or permission', surface: 'other surface', scope: 'beyond scope lens' };
RL.lensHtml = (c, a) => {
  const r = c.route, ro = c.roleObj, pl = c.plan, t = c.t;
  const persona = RL.P.personas.personas.find(p => p.role === c.role && p.tenant === t.id && (!p.contact_scope || p.contact_scope === c.scope)) || RL.P.personas.personas.find(p => p.role === c.role && !p.tenant);
  const fs = r.feature ? c.feat(r.feature) : null;
  const grantV = r.perm && r.surface === 'web' ? c.can(r.perm) : null;
  const navV = ['web', 'console', 'portal'].includes(r.surface) ? c.vis(r.surface, r.nav) : null;
  let out = `<h2>Viewing as</h2><div class="lc"><div class="flex nw">${h.avatar(String(c.who))}<div><b>${esc(c.who)}</b><div class="t3">${esc(ro.name)}${c.scope ? ' · contact scope ' + esc(c.scope) : ''}</div></div></div>
    <div class="lr"><span>Role key</span><span class="mono">${esc(ro.key)}</span></div><div class="lr"><span>Seat</span><span>${esc(ro.seat)}</span></div><div class="lr"><span>Sign-in</span><span class="right">${esc(ro.login)}</span></div>
    ${persona ? `<div class="why"><q>${esc(persona.quote)}</q> <span class="t3">(${esc(persona.source)})</span></div><button type="button" class="btn sm" data-go="atlas.personas">Persona details</button>` : ''}</div>`;
  if (!['platform', 'public'].includes(ro.kind)) out += `<h2>Market and package</h2><div class="lc"><div class="lr"><span>Tenant</span><b>${esc(t.name)}</b></div><div class="lr"><span>Segment</span><span>${esc(c.seg.id)} · ${esc(c.seg.name)}</span></div>
    <div class="lr"><span>Plan</span><span>${esc(pl.name)} ${pl.annual ? '· $' + pl.annual + '/mo annual' : pl.monthly ? '· $' + pl.monthly + '/mo' : ''}</span></div>
    <div class="lr"><span>Included</span><span class="right">${pl.office_seats != null ? pl.office_seats + ' office, ' : ''}${pl.field_seats != null ? pl.field_seats + ' active field seats, ' : ''}${pl.ai_credits ? h.num(pl.ai_credits) + ' AI credits' : esc(pl.ai_note || '')}</span></div>
    <div class="lr"><span>Add-ons</span><span>${t.addons.length ? t.addons.map(x => esc(I.ADDONS[x].name)).join(', ') : 'none'}</span></div><div class="lr"><span>Modules</span><span class="right">${t.modules.map(esc).join(', ')}${t.books === 'qbo_system' ? ', Books off' : ''}</span></div></div>`;
  out += `<h2>This screen</h2><div class="lc"><div class="flex"><b>${esc(r.label)}</b>${h.tag(r.scope)}</div><div class="mono tiny t2">${esc(r.surface === 'portal' ? RL.portalBrand(c).host : r.surface === 'web' || r.surface === 'sub' ? 'app.rootline.com/' + c.t.id : I.SURFACES[r.surface].host.split(/[ ;]/)[0].replace(/\/\.\.\.$/, ''))}${esc(r.path)}</div><div class="why">${esc(r.purpose)}</div>
    <div class="gl"><i class="${dotFor(a.state)}"></i><span><b>${esc(stLabel[a.state] || a.state)}</b></span></div>
    ${navV != null ? `<div class="lr"><span>Nav visibility</span><span class="mono">${esc(navV)}</span></div>` : ''}
    ${grantV != null ? `<div class="lr"><span>Permission</span><span class="mono">${esc(r.perm)} = ${esc(grantV)}</span></div>` : ''}
    ${fs ? `<div class="lr"><span>Plan gate</span><span class="mono">${esc(r.feature)} = ${esc(fs.s)}${fs.note ? ' (' + esc(fs.note) + ')' : ''}${fs.via ? ' via add-on' : ''}</span></div>` : ''}
    ${r.module ? `<div class="lr"><span>Module</span><span class="mono">${esc(r.module)}: ${c.mod(r.module) ? 'on' : 'off'}</span></div>` : ''}
    ${a.why.length ? `<ul class="why">${a.why.map(w => `<li>${esc(w)}</li>`).join('')}</ul>` : ''}
    <div class="tiny t3">Spec: ${esc(r.spec || '-')}</div></div>`;
  if (['web', 'console', 'portal', 'crew', 'partner'].includes(r.surface)) {
    const groups = RL.navGroups(r.surface);
    out += `<h2>Navigation for this role</h2><div class="lc">${groups.map(n => {
      const rs = RL.routesFor(r.surface).filter(x => x.nav === n);
      const acc = rs.map(x => ({ x, a: RL.access(x, c.s) }));
      const inL = acc.filter(({ x }) => c.inLens(x.scope));
      let st = inL.length === 0 ? 'scope' : inL.some(({ a }) => a.ok) ? 'ok' : inL.some(({ a }) => a.state === 'locked') ? 'locked' : (inL[0].a.state);
      const lim = inL.find(({ a }) => a.state === 'limit');
      return `<div class="gl"><i class="${dotFor(st)}"></i><span>${esc(n)} <span class="t3">${esc(stLabel[st] || st)}${lim ? ' · ' + esc(lim.a.limit || '') : ''}</span></span></div>`;
    }).join('')}</div>`;
  }
  if (r.surface === 'web' || r.surface === 'crew') {
    out += `<h2>Field classes (02 §10.2)</h2><div class="lc"><div class="chip-row">${RL.P.roles.field_class_defaults.rows.map(fc => { const v = c.fc(fc.field_class); return `<span title="${esc(fc.field_class)}: ${esc(v)}" class="pill ${v === '-' || v.startsWith('- ') ? '' : 'ok'}">${esc(fc.field_class)} ${esc(v === '-' ? 'hidden' : v)}</span>`; }).join('')}</div></div>`;
  }
  const peers = RL.AS.filter(o => RL.SURF[o.role].includes(r.surface) || (r.surface === 'web' && o.group === 'Company staff'));
  if (peers.length > 1) {
    out += `<h2>Same screen, other roles</h2><div class="lc">${peers.map(o => { const st = RL.access(r, Object.assign({}, c.s, { as: o.key })); return `<button type="button" class="gl" style="border:0;background:none;text-align:left;cursor:pointer;padding:1px 0" data-set="as=${o.key}&r=${r.id}"><i class="${dotFor(st.state)}"></i><span>${esc(o.label)} <span class="t3">${esc(stLabel[st.state] || st.state)}</span></span></button>`; }).join('')}</div>`;
  }
  out += `<h2>Legend</h2><div class="lc"><div class="gl"><i class="dot-ok"></i><span>Visible</span><i class="dot-lock"></i><span>Locked: upgrade prompt (buyers only)</span><i class="dot-hide"></i><span>Hidden: plan, module or surface</span><i class="dot-deny"></i><span>Hidden: role or permission</span><i class="dot-scope"></i><span>Beyond the scope lens</span></div></div>`;
  return out;
};
RL.lensAtlas = (c) => `<h2>How to read the explorer</h2><div class="lc why"><div><p>Pick a <b>market</b> (a sample tenant in a target segment), a <b>package</b> (plan) and who to <b>view as</b>. Every screen is gated exactly as the specs say: navigation by role (21 §5), permissions (02 §10), plan entitlements (22 §4) and enabled modules.</p><p class="mt8">The <b>scope lens</b> hides anything beyond MVP, V1 or V2, so a build agent can see the MVP on its own.</p></div></div>
  <h2>Data</h2><div class="lc why"><p>Source of truth: <span class="mono">docs/platform/*.json</span>, bundled by <span class="mono">docs/platform/build.py</span> into <span class="mono">assets/platform-data.js</span>.</p></div>`;

// Copilot modal available from the web top bar
RL.modal('copilot', (c) => ({ title: 'Copilot', body: h.aiCard({ agent: 'Copilot', level: 'L1', credits: 1, title: `Ask anything about ${esc(c.t.name)}`, body: `Answers are limited to what ${esc(c.who)} can already see (copilot.use = ${esc(c.can('copilot.use'))}). Numbers come from the KPI dictionary and cite their source (17, 18).` }) + h.field('Ask', h.input('', { ph: 'Which jobs are over budget this week?' })) + h.note('Each question costs 1 credit, shown before it runs (22 §4.4.1).'), foot: h.btn('Close', { act: 'noop' }) }));
RL.act('noop', () => { RL.closeModal(); return false; });
RL.act('mgr-tab', () => { RL.toast('Manager mode tabs are illustrative in this explorer.'); return false; });
})();
