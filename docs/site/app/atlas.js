/* Rootline Platform Explorer - Atlas pages: overview, personas, roles and access, packages, markets, who sees what, every screen. */
(() => {
'use strict';
const RL = window.RL, h = RL.h, { esc, icon } = h, I = RL.idx, P = RL.P;
const A = RL.atlasPages = {};
const OPEN_AS = { web: 'owner', crew: 'crew_lead', crew_manager: 'owner', kiosk: 'crew_lead', sub: 'subcontractor', portal: 'client_residential.primary', console: 'platform_owner', partner: 'partner_admin', www: 'prospect', home: 'homeowner' };
const openAs = (r) => r.surface === 'portal' && r.roles && r.roles.includes('client_commercial') ? 'client_commercial.primary' : OPEN_AS[r.surface];
const viewBtn = (label, set, kind) => `<button type="button" class="btn sm${kind ? ' ' + kind : ''}" data-set="${esc(set)}">${label}</button>`;
const asKeyFor = p => p.role.startsWith('client_') ? p.role + '.' + (p.contact_scope || 'primary') : p.role;
const personaSet = p => `as=${asKeyFor(p)}${p.tenant ? '&t=' + p.tenant : ''}&r=${p.landing}&lang=${/^(ES|ES\/EN)/.test(p.language || '') || p.role === 'crew_lead' || p.role === 'technician' ? 'es' : 'en'}`;
const sec = (title, sub, body) => `<section class="stack12"><div><h2 style="font-size:1.35rem">${title}</h2>${sub ? `<p class="t2 small mt8">${sub}</p>` : ''}</div>${body}</section>`;
const tabs = (key, list, def) => h.tabs(key, list, def);

// ---------- overview ----------
A['atlas.home'] = (c) => {
  const routes = P.surfaces.routes, bySurf = {};
  routes.forEach(r => { bySurf[r.surface] = bySurf[r.surface] || { n: 0 }; bySurf[r.surface].n++; });
  const picks = [
    ['You, the founder', 'Platform console: MRR, churn risk, approvals, incidents', 'as=platform_owner&r=console.home', 'shield'],
    ['Erin, owner of Greenleaf (Pro)', 'Company web app, role-aware Today', 'as=owner&t=greenleaf&r=web.today', 'today'],
    ['Dana, owner of Reyes (Grow)', 'Same app, smaller package', 'as=owner&t=reyes&r=web.today', 'today'],
    ['Sofia, designer', 'Design Studio and AI mockups', 'as=designer&t=reyes&r=web.studio', 'pen'],
    ['Miguel, crew lead (Spanish)', 'Offline crew app: route, visit, chemicals', 'as=crew_lead&t=reyes&r=crew.today&lang=es', 'phone'],
    ['Jennifer, homeowner', 'Portal: proposal with mockups, sign and pay', 'as=client_residential.primary&t=reyes&r=portal.home', 'home'],
    ['Patricia, property manager', 'Commercial workspace with approvals', 'as=client_commercial.primary&t=summit&r=portal.home', 'building'],
    ['Bob, HOA board member', 'Votes on enhancements, 2 of 5 over $5,000', 'as=client_commercial.approver&t=summit&r=portal.approvals', 'approve'],
    ['Karen, CPA', 'Books, close and the Accountant Hub', 'as=bookkeeper&t=reyes&r=web.books', 'bank'],
    ['Support agent', 'Consented View as user and access grants, founder approves', 'as=platform_support&r=console.support', 'help'],
    ['Plant curator agent', 'Plant KB curation queue', 'as=platform_curator&r=console.kb.queue', 'leaf'],
    ['A prospect', 'Pricing page with the stack calculator', 'as=prospect&r=www.pricing', 'globe'],
  ];
  const surfRows = P.surfaces.surfaces.map(s => ({ ...s, n: (bySurf[s.id] || {}).n || 0 }));
  return `<div class="at"><div class="at-hero"><span class="eyebrow">Platform Explorer</span><h1>The whole Rootline platform, as each person sees it</h1>
    <p class="lede">Every surface (company app, crew app, customer portal, subcontractor lite, founder console, partner hub, marketing site and the homeowner funnel) with ${routes.length} screens, gated by role, package and market exactly as the specs define. All of it is v1: there are no later phases. Pick a market, a package and who to view as in the bar above. Turn on <b>Why you see this</b> to see the rule behind every screen.</p>
    <div class="flex">${h.pill(P.roles.roles.length + ' roles', 'ok')}${h.pill(P.personas.personas.length + ' personas', 'ok')}${h.pill(P.plans.plans.length + ' packages', 'info')}${h.pill(P.plans.features.length + ' gated capabilities', 'info')}${h.pill(P.segments.segments.length + ' target markets', 'accent')}${h.pill(routes.length + ' screens', '')}</div></div>
    ${sec('Start here', 'One click sets the market, package and person.', `<div class="at-pick">${picks.map(([t, s, set, ic]) => `<div class="pc"><div class="ph-n"><span class="li-i" style="padding:0;border:0"><span class="ico">${icon(ic)}</span></span><div><b>${t}</b><span>${s}</span></div></div><div class="act">${viewBtn('View', set, 'primary')}</div></div>`).join('')}</div>`)}
    ${sec('Same company, different packages', 'Greenleaf Grounds Co. seen by its owner on each plan. Locked entries show the upgrade path; nothing is greyed out for people who cannot buy.', `<div class="flex">${['starter', 'grow', 'pro', 'enterprise', 'design_solo'].map(p => viewBtn(I.PLANS[p].name, `as=owner&t=greenleaf&plan=${p}&r=web.today`)).join('')}${viewBtn('Compare all plans side by side', 'r=atlas.compare', 'primary')}</div>`)}
    ${sec('Different markets', 'Each target segment has a sample tenant with the modules, data and default package that segment buys.', `<div class="at-pick">${P.segments.segments.map(s => `<div class="pc"><b>${esc(s.id)} · ${esc(s.name)}</b><span class="t3 tiny">${esc(s.size)} people · ${esc(s.plan)} · ${esc(s.gtm_focus)}</span><span class="small">${esc(I.TENANTS[s.sample_tenant].name)}</span><q>${esc(s.message.headline)}</q><div class="act flex">${viewBtn('Owner view', `as=owner&t=${s.sample_tenant}&r=web.today`)}${viewBtn('Their pricing page', `as=prospect&t=${s.sample_tenant}&r=www.solutions`)}</div></div>`).join('')}</div>`)}
    ${sec('Surfaces', 'Hosts and sign-in per surface (21 §5.1). Domain rule: ' + esc(P.surfaces.domain_rule), h.table([
      { k: 'name', label: 'Surface', fmt: (v, r) => `<b>${esc(v)}</b>` }, { k: 'users', label: 'Who' }, { k: 'host', label: 'Host', m: true }, { k: 'auth', label: 'Sign-in' }, { k: 'n', label: 'Screens', n: true },
      { k: 'id', label: '', fmt: (v) => { const first = P.surfaces.routes.find(r => r.surface === v); return first ? viewBtn('Open', `as=${openAs(first)}&r=${RL.SURF_LAND[v]}`) : ''; } }], surfRows, { dense: true }))}
  </div>`;
};

// ---------- personas ----------
A['atlas.personas'] = (c) => {
  const kind = p => { const k = I.ROLES[p.role].kind; return k === 'platform' ? 'staff' : p.role === 'crew_lead' || p.role === 'technician' || p.role === 'subcontractor' ? 'field' : k === 'tenant' ? 'company' : k === 'client' ? 'clients' : 'other'; };
  const f = RL.ui['at.pf'] || 'all';
  const list = P.personas.personas.filter(p => f === 'all' || (f === 'blueprint' ? p.source.startsWith('blueprint') : kind(p) === f));
  const card = p => `<article class="pc"><div class="ph-n">${h.avatar(p.name)}<div><b>${esc(p.name)}</b><span>${esc(p.title)}</span></div></div>
    <div class="flex gap4"><span class="pill">${esc(p.role)}${p.contact_scope ? ' · ' + esc(p.contact_scope) : ''}</span>${p.tenant ? `<span class="pill">${esc(I.TENANTS[p.tenant].name)}</span>` : ''}<span class="tiny t3">${esc(p.source)}</span></div>
    <q>${esc(p.quote)}</q>
    ${h.kv([['Who', esc(p.who)], ['Goals', esc(p.goals)], ['Frustrations', esc(p.frustrations)], ['Success', esc(p.success)], ['Sees first', esc(p.sees)], ['Never sees', esc(p.hidden)], ['Device', esc(p.devices || '-')], ['Tech, language', esc((p.tech || '-') + ' · ' + (p.language || '-'))]])}
    <div class="act">${viewBtn('View as ' + esc(p.name.split(/[ ,]/)[0]), personaSet(p), 'primary')}</div></article>`;
  return `<div class="at">${sec('Personas', 'Composite personas from 02 §3 (illustrative names, companies and quotes) plus blueprint personas for markets the specs name but do not personify. Each card says what the person sees first and what they never see; <b>View as</b> opens their real landing screen.',
    tabs('at.pf', [['all', 'All', P.personas.personas.length], ['staff', 'Rootline: founder and agents'], ['company', 'Company staff'], ['field', 'Field and subs'], ['clients', 'Clients'], ['other', 'Partners and public'], ['blueprint', 'Blueprint additions']], 'all') + `<div class="at-pick" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr))">${list.map(card).join('')}</div>`)}
    ${sec('Seat and sign-in by persona', 'From 02 §3.1 persona map and 22 §4.3 seat model.', h.table([{ k: 'name', label: 'Role', fmt: (v, r) => `<b>${esc(v)}</b><div class="mono tiny t3">${esc(r.key)}</div>` }, { k: 'surfaces', label: 'Surfaces', fmt: v => v.map(esc).join(', ') }, { k: 'seat', label: 'Seat' }, { k: 'login', label: 'Sign-in' }, { k: 'device', label: 'Device', fmt: v => esc(v || '-') }, { k: 'language', label: 'Language', fmt: v => esc(v || '-') }], P.roles.roles.filter(r => r.kind === 'tenant' || r.kind === 'client' || r.kind === 'platform'), { dense: true }))}</div>`;
};

// ---------- roles and access ----------
A['atlas.roles'] = (c) => {
  const rolesT = P.roles.tenant_permission_matrix.roles;
  const cur = c.role;
  const thR = rs => rs.map(r => `<th class="${r === cur ? 'hl' : ''}">${esc(r.replace('platform_', 'p_').replace('_', ' '))}</th>`).join('');
  const cell = (v, r) => `<td class="${r === cur ? 'hl' : ''}"><span class="g${v === '-' ? ' none' : ''}">${esc(v)}</span></td>`;
  const navTbl = (items, rs) => `<div class="mtx-wrap"><table class="mtx"><thead><tr><th>Destination</th>${thR(rs)}</tr></thead><tbody>${Object.entries(items).map(([n, row]) => `<tr><th>${esc(n)}</th>${rs.map(r => `<td class="${r === cur ? 'hl' : ''}">${h.chip(String(row[r] || '-').split(' ')[0])}${String(row[r] || '').includes(' ') ? `<div class="tiny t3" style="white-space:normal">${esc(String(row[r]).split(' ').slice(1).join(' '))}</div>` : ''}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const g = RL.ui['at.pg'] || P.roles.tenant_permission_matrix.groups[0].group;
  const grp = P.roles.tenant_permission_matrix.groups.find(x => x.group === g);
  const t = RL.ui['at.rt'] || 'catalogue';
  let body = '';
  if (t === 'catalogue') body = h.table([{ k: 'name', label: 'Role', fmt: (v, r) => `<b>${esc(v)}</b><div class="mono tiny t3">${esc(r.key)}</div>` }, { k: 'kind', label: 'Kind' }, { k: 'summary', label: 'What it can do' }, { k: 'seat', label: 'Seat' }, { k: 'mfa', label: 'MFA' }, { k: 'spec', label: 'Spec', fmt: v => `<span class="tiny t3">${esc(v)}</span>` }, { k: 'key', label: '', fmt: (v, r) => { const o = RL.AS.find(a => a.role === v); return o ? viewBtn('View as', `as=${o.key}&r=${r.landing}`) : ''; } }], P.roles.roles, { dense: true });
  if (t === 'webnav') body = `<p class="small t2">${esc(P.roles.nav_visibility.web.note)} (21 §5.9). Observer (starter custom role) sees Today and Reports only.</p>` + navTbl(P.roles.nav_visibility.web.items, rolesT);
  if (t === 'perms') body = tabs('at.pg', P.roles.tenant_permission_matrix.groups.map(x => [x.group, x.group, x.rows.length]), g) + `<p class="small t2 mt8">${esc(P.roles._legend.grants)}</p><div class="mtx-wrap mt8"><table class="mtx"><thead><tr><th>Capability</th>${thR(rolesT)}</tr></thead><tbody>${grp.rows.map(r => `<tr><th><span class="mono">${esc(r.cap)}</span>${r.note ? `<div class="tiny t3">${esc(r.note)}</div>` : ''}</th>${rolesT.map(k => cell(r.grants[k], k)).join('')}</tr>`).join('')}</tbody></table></div><ol class="tiny t3">${P.roles.tenant_permission_matrix.footnotes.map(f => `<li>${esc(f)}</li>`).join('')}</ol>`;
  if (t === 'fields') body = `<p class="small t2">Masking is enforced server-side; the explorer masks these values with ••• for roles that cannot see them.</p><div class="mtx-wrap"><table class="mtx"><thead><tr><th>Field class</th>${thR(rolesT)}</tr></thead><tbody>${P.roles.field_class_defaults.rows.map(r => `<tr><th class="mono">${esc(r.field_class)}</th>${rolesT.map(k => cell(r.grants[k], k)).join('')}</tr>`).join('')}</tbody></table></div>`;
  const plat = P.roles.platform_permission_matrix.roles;
  if (t === 'console') body = `<p class="small t2">${esc(P.roles.nav_visibility.console.note)} (21 §5.5)</p>` + navTbl(P.roles.nav_visibility.console.items, plat) + `<h3 class="mt16">Platform staff permissions (02 §10.4)</h3><div class="mtx-wrap mt8"><table class="mtx"><thead><tr><th>Capability</th>${thR(plat)}</tr></thead><tbody>${P.roles.platform_permission_matrix.rows.map(r => `<tr><th>${esc(r.cap)}</th>${plat.map(k => `<td class="l${k === cur ? ' hl' : ''}"><span class="g">${esc(r.grants[k])}</span></td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const sc = ['primary', 'co_owner', 'approver', 'billing', 'property_contact', 'viewer'];
  if (t === 'portal') body = `<p class="small t2">${esc(P.roles.nav_visibility.portal.note)} (21 §5.4)</p>` + navTbl(P.roles.nav_visibility.portal.items, sc) + `<h3 class="mt16">Contact rights (02 §5.11)</h3>` + h.table([{ k: 'scope', label: 'Contact role', m: true }, ...Object.keys(P.roles.client_contact_rights.rows[0].rights).map(k => ({ k, label: esc(k), fmt: (v, r) => esc(r.rights[k]) }))], P.roles.client_contact_rights.rows, { dense: true });
  return `<div class="at">${sec('Roles and access', 'Every role, the navigation it gets on each surface, and the permission matrix behind it, parsed verbatim from 02 and 21. The column for the role you are viewing as is highlighted.',
    tabs('at.rt', [['catalogue', 'All roles', P.roles.roles.length], ['webnav', 'Web app navigation'], ['perms', 'Tenant permissions', P.roles.tenant_permission_matrix.groups.reduce((a, x) => a + x.rows.length, 0)], ['fields', 'Field classes'], ['console', 'Console: founder and agents'], ['portal', 'Portal contact scopes']], 'catalogue') + body)}</div>`;
};

// ---------- packages ----------
A['atlas.plans'] = (c) => {
  const pcs = ['starter', 'grow', 'pro', 'enterprise', 'design_solo'];
  const cards = P.plans.plans.map(p => `<div class="plan-c${p.code === c.planCode ? ' on' : ''}"><div class="flex between"><b style="font-size:1.05rem">${esc(p.name)}</b></div>
    <div class="pr">${p.annual ? '$' + p.annual : p.monthly ? '$' + p.monthly : 'Custom'}<small>${p.annual ? '/mo annual' + (p.monthly ? ` · $${p.monthly} monthly` : '') : p.monthly ? '/mo' : ''}</small></div>
    <span class="small t2">${esc(p.for)}</span>${p.annual_note ? `<span class="tiny t3">${esc(p.annual_note)}</span>` : ''}
    ${h.kv([['Office seats', esc(p.office_note || (p.office_seats != null ? p.office_seats : '-'))], ['Active field seats', esc(p.field_note || (p.field_seats != null ? p.field_seats : '-'))], ['Designer seats', esc(p.designer_seats != null ? p.designer_seats + (p.designer_note ? ' (' + p.designer_note + ')' : '') : p.designer_note || '-')], ['AI credits / mo', esc(p.ai_note || (p.ai_credits ? h.num(p.ai_credits) : '-'))], ['SMS / mo', esc(p.sms_note || (p.sms ? h.num(p.sms) : '-'))], ['Support', esc(p.support || '-')], ['Segments', esc((p.segments || []).join(', ') || '-')]])}
    ${p.code !== 'archive' ? viewBtn('Owner view on ' + esc(p.name), `as=owner&plan=${p.code}&r=web.today`) : ''}${p.assumption ? `<span class="tiny t3">${esc(p.assumption)}</span>` : ''}</div>`).join('');
  const mods = [...new Set(P.plans.features.map(f => f.module))];
  const t = RL.ui['at.pl'] || 'matrix';
  let body = '';
  if (t === 'matrix') body = `<p class="small t2">${esc(P.plans._legend.s)}. Hover a chip for its limit.</p><div class="mtx-wrap"><table class="mtx"><thead><tr><th>Capability</th>${pcs.map(p => `<th class="${p === c.planCode ? 'hl' : ''}">${esc(I.PLANS[p].name)}</th>`).join('')}</tr></thead><tbody>${mods.map(m => `<tr class="grp"><th colspan="${pcs.length + 1}">${esc(m)}</th></tr>` + P.plans.features.filter(f => f.module === m).map(f => `<tr><th>${esc(f.name)}<div class="mono tiny t3">${esc(f.key)}</div></th>${pcs.map(p => { const a = f.plans[p] || { s: '-' }; const tip = [a.note, a.addon ? 'add-on: ' + (I.ADDONS[a.addon] ? I.ADDONS[a.addon].name + ' ' + I.ADDONS[a.addon].price : a.addon) : ''].filter(Boolean).join(' · '); return `<td class="${p === c.planCode ? 'hl' : ''}" title="${esc(tip)}">${h.chip(a.s)}${a.note ? `<div class="tiny t3" style="white-space:normal;max-width:130px;margin:0 auto">${esc(a.note)}</div>` : ''}</td>`; }).join('')}</tr>`).join('')).join('')}</tbody></table></div>`;
  if (t === 'addons') body = h.table([{ k: 'name', label: 'Add-on', fmt: (v, r) => `<b>${esc(v)}</b><div class="mono tiny t3">${esc(r.code)}</div>` }, { k: 'price', label: 'Price' }, { k: 'available_on', label: 'On' }, { k: 'includes', label: 'Includes' }, { k: 'why', label: 'Why an add-on' }], P.plans.addons, { dense: true });
  if (t === 'meters') body = h.table([{ k: 'key', label: 'Meter', m: true }, { k: 'unit', label: 'Unit' }, { k: 'included', label: 'Included S / G / P' }, { k: 'overage', label: 'Overage or pack' }, { k: 'enforcement', label: 'Enforcement' }], P.plans.meters, { dense: true }) + `<h3 class="mt16">AI credit rate card (22 §4.4.1)</h3>` + h.table([{ k: 'action', label: 'AI action' }, { k: 'credits', label: 'Credits', n: true }, { k: 'notes', label: 'Notes' }], P.plans.ai_credit_rates, { dense: true });
  if (t === 'seats') body = h.table([{ k: 'seat', label: 'Seat type', fmt: v => `<b>${esc(v)}</b>` }, { k: 'assigned_when', label: 'Assigned when' }, { k: 'default_roles', label: 'Default roles' }, { k: 'billing', label: 'Billing rule' }], P.plans.seat_types, { dense: true }) + `<h3 class="mt16">Trials and offers (22 §4.6)</h3>` + h.table([{ k: 'item', label: 'Offer', fmt: v => `<b>${esc(v)}</b>` }, { k: 'rule', label: 'Rule' }], P.plans.trial_and_offers, { dense: true });
  if (t === 'ux') body = `<div class="cd"><div class="cd-b"><b>${esc(P.plans.entitlement_ux.source)}</b><ol class="small">${P.plans.entitlement_ux.rules.map(r => `<li>${esc(r)}</li>`).join('')}</ol><b>Packaging rules</b><ul class="small">${P.plans.rules.map(r => `<li>${esc(r)}</li>`).join('')}</ul></div></div><h3 class="mt16">Homeowner tiers (Rootline Home, 22 §5.3.1)</h3>` + h.table([{ k: 'tier', label: 'Tier', fmt: v => `<b>${esc(v)}</b>` }, { k: 'price', label: 'Price' }, { k: 'features', label: 'Features' }], P.plans.homeowner_tiers, { dense: true }) + `<h3 class="mt16">Partner tracks (22 §5.4.1)</h3>` + h.table([{ k: 'track', label: 'Track', fmt: v => `<b>${esc(v)}</b>` }, { k: 'they_get', label: 'They get' }, { k: 'rootline_gets', label: 'Rootline gets' }, { k: 'terms', label: 'Terms' }], P.plans.partner_tracks, { dense: true });
  return `<div class="at">${sec('Packages', 'Plans, capabilities by plan, add-ons, meters and the AI credit rate card, parsed from 22 §4. All prices are proposed and validated in pricing tests (22 §6.10).', `<div class="plan-cards">${cards}</div>`)}
    ${tabs('at.pl', [['matrix', 'Capabilities by plan', P.plans.features.length], ['addons', 'Add-ons', P.plans.addons.length], ['meters', 'Meters and AI credits'], ['seats', 'Seats, trials, offers'], ['ux', 'Entitlement rules, homeowner, partners']], 'matrix')}${body}</div>`;
};

// ---------- markets ----------
A['atlas.segments'] = (c) => {
  const S = P.segments;
  const segCard = s => { const t = I.TENANTS[s.sample_tenant]; return `<article class="cd${s.icp ? ' ok' : ''}"><div class="cd-h"><div><h3>${esc(s.id)} · ${esc(s.name)} ${s.icp ? h.pill('ICP and beachhead', 'ok') : ''}</h3><div class="sub">${esc(s.size)} people · ${esc(s.revenue)} · ${esc(s.motion)} · ${esc(s.gtm_focus)}</div></div><div class="flex">${viewBtn('Owner view', `as=owner&t=${s.sample_tenant}&r=web.today`, 'primary')}${viewBtn('Solution page', `as=prospect&t=${s.sample_tenant}&r=www.solutions`)}</div></div>
    <div class="cd-b"><div class="cols cols-2"><div class="stack8">
      <div class="aic" style="background:var(--surface-2);border-color:var(--border)"><b style="font-family:var(--font-display);font-size:1.1rem">${esc(s.message.headline)}</b><span class="small t2">${esc(s.message.subhead)}</span><span class="tiny t3">${esc(s.message.status)}</span></div>
      ${h.kv([['Service mix', esc(s.service_mix)], ['Current stack', esc(s.current_stack)], ['Fit', esc(s.fit)], ['Plans', s.default_plans.map(p => esc(I.PLANS[p].name)).join(', ')], ['Sample tenant', `${esc(t.name)} (${esc(t.city)}, ${esc(t.region)})`], ['Modules on', s.modules_on.map(esc).join(', ')], ['Offer', esc(s.offer)]])}
    </div><div class="stack8">
      ${h.kv([['Pains', `<ul style="margin:0;padding-left:16px">${s.pains.map(p => `<li>${esc(p)}</li>`).join('')}</ul>`], ['Pillars', s.pillars.map(esc).join(' · ')], ['Proof to verify', `<ul style="margin:0;padding-left:16px">${s.proof_points_to_verify.map(p => `<li>${esc(p)}</li>`).join('')}</ul>`], ['Objections', s.objections.map(([o, a]) => `<div><b>${esc(o)}</b>: <span class="t2">${esc(a)}</span></div>`).join('')], ['Channels', s.channels.map(esc).join(', ')], ['Today shows', s.today_widgets.map(esc).join(' · ')], ['Hidden by default', s.hidden_by_default.map(esc).join(', ') || 'nothing']])}
    </div></div></div></article>`; };
  return `<div class="at">${sec('Target markets', 'Seven segments from 22 §6.1, each with a sample tenant you can view as. Messaging is draft copy for the marketing agent to test (22 §6.3, §6.10); proof points must be verified before use.', `<div class="cd"><div class="cd-b"><b>Positioning</b><p class="small">${esc(S.positioning.statement)}</p><div class="flex">${S.positioning.taglines.map(t => h.pill(esc(t), 'accent')).join('')}</div></div></div>`)}
    ${S.segments.map(segCard).join('')}
    ${sec('ICP scorecard', '70+ routes to inside sales; 50-69 to self-serve nurture (22 §6.1).', h.table([{ k: 'attribute', label: 'Attribute' }, { k: 'points', label: 'Points', n: true }], S.icp_scorecard, { dense: true, foot: ['Total', S.icp_scorecard.reduce((a, x) => a + x.points, 0)] }))}</div>`;
};

// ---------- who sees what ----------
A['atlas.compare'] = (c) => {
  const t = RL.ui['at.cmp'] || 'roles';
  const st = (r, patch) => RL.access(r, Object.assign({}, c.s, patch));
  const sym = a => ({ ok: h.chip('F'), limit: h.chip('L'), locked: `<span class="chip A">${icon('lock', 's')}</span>`, hidden: h.chip('-'), off: '<span class="chip N">off</span>', denied: h.chip('-'), surface: '<span class="chip N">·</span>' }[a.state] || h.chip('-'));
  let body = '';
  const webRoutes = P.surfaces.routes.filter(r => r.surface === 'web');
  if (t === 'roles') {
    const roles = RL.AS.filter(o => o.group === 'Company staff' || ['crew_lead', 'technician'].includes(o.key));
    body = `<p class="small t2">Every company web screen for every staff role, at <b>${esc(c.t.name)}</b> on <b>${esc(c.plan.name)}</b>. F visible, L visible with a plan limit, lock = upgrade prompt, - hidden, off = module not enabled.</p><div class="mtx-wrap"><table class="mtx"><thead><tr><th>Screen</th>${roles.map(o => `<th>${esc(o.label.replace(' / CPA', ''))}</th>`).join('')}</tr></thead><tbody>${RL.navGroups('web').map(n => `<tr class="grp"><th colspan="${roles.length + 1}">${esc(n)}</th></tr>` + webRoutes.filter(r => r.nav === n).map(r => `<tr><th>${esc(r.label)}</th>${roles.map(o => `<td><button type="button" class="icon-btn" data-set="as=${o.key}&r=${r.id}" title="Open as ${esc(o.label)}">${sym(st(r, { as: o.key }))}</button></td>`).join('')}</tr>`).join('')).join('')}</tbody></table></div>`;
  }
  if (t === 'plans') {
    const pcs = ['starter', 'grow', 'pro', 'enterprise', 'design_solo'];
    body = `<p class="small t2">What <b>the owner</b> of ${esc(c.t.name)} sees on each package. Locks are upgrade prompts; '-' means the entry is not there at all.</p><div class="mtx-wrap"><table class="mtx"><thead><tr><th>Screen</th>${pcs.map(p => `<th>${esc(I.PLANS[p].name)}</th>`).join('')}</tr></thead><tbody>${RL.navGroups('web').map(n => `<tr class="grp"><th colspan="${pcs.length + 1}">${esc(n)}</th></tr>` + webRoutes.filter(r => r.nav === n).map(r => `<tr><th>${esc(r.label)}</th>${pcs.map(p => `<td><button type="button" class="icon-btn" data-set="as=owner&plan=${p}&r=${r.id}" title="Open on ${esc(I.PLANS[p].name)}">${sym(st(r, { as: 'owner', plan: p }))}</button></td>`).join('')}</tr>`).join('')).join('')}</tbody></table></div>`;
  }
  if (t === 'markets') {
    const ts = P.tenants.tenants;
    body = `<p class="small t2">The owner's web navigation in each market, on that tenant's own package and modules.</p><div class="mtx-wrap"><table class="mtx"><thead><tr><th>Screen</th>${ts.map(x => `<th>${esc(x.segment)}<div class="tiny" style="text-transform:none">${esc(x.name.split(' ')[0])} · ${esc(I.PLANS[x.plan].name)}</div></th>`).join('')}</tr></thead><tbody>${RL.navGroups('web').map(n => `<tr class="grp"><th colspan="${ts.length + 1}">${esc(n)}</th></tr>` + webRoutes.filter(r => r.nav === n).map(r => `<tr><th>${esc(r.label)}</th>${ts.map(x => `<td><button type="button" class="icon-btn" data-set="as=owner&t=${x.id}&plan=&r=${r.id}">${sym(st(r, { as: 'owner', t: x.id, plan: '' }))}</button></td>`).join('')}</tr>`).join('')).join('')}</tbody></table></div>`;
  }
  if (t === 'portal') {
    const scopes = RL.AS.filter(o => o.group === 'Clients');
    const pr = P.surfaces.routes.filter(r => r.surface === 'portal');
    body = `<p class="small t2">Customer portal destinations by contact scope at ${esc(c.t.name)} on ${esc(c.plan.name)}.</p><div class="mtx-wrap"><table class="mtx"><thead><tr><th>Screen</th>${scopes.map(o => `<th>${esc(o.label)}</th>`).join('')}</tr></thead><tbody>${pr.map(r => `<tr><th>${esc(r.label)}</th>${scopes.map(o => `<td><button type="button" class="icon-btn" data-set="as=${o.key}&r=${r.id}">${sym(st(r, { as: o.key }))}</button></td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  if (t === 'console') {
    const staff = RL.AS.filter(o => o.group === 'Rootline: founder and agents');
    const cr = P.surfaces.routes.filter(r => r.surface === 'console');
    body = `<p class="small t2">Founder console by platform role (21 §5.5).</p><div class="mtx-wrap"><table class="mtx"><thead><tr><th>Screen</th>${staff.map(o => `<th>${esc(o.label)}</th>`).join('')}</tr></thead><tbody>${cr.map(r => `<tr><th>${esc(r.label)}</th>${staff.map(o => `<td><button type="button" class="icon-btn" data-set="as=${o.key}&r=${r.id}">${sym(st(r, { as: o.key }))}</button></td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  return `<div class="at">${sec('Who sees what', 'Computed live from the same gating engine the screens use. Click any cell to open that screen as that person.', tabs('at.cmp', [['roles', 'Company roles'], ['plans', 'Packages'], ['markets', 'Markets'], ['portal', 'Client contacts'], ['console', 'Founder and agents']], 'roles') + body)}</div>`;
};

// ---------- every screen ----------
A['atlas.routes'] = (c) => {
  const sf = RL.ui['at.sf'] || 'all';
  const list = P.surfaces.routes.filter(r => (sf === 'all' || r.surface === sf));
  const done = id => !!RL.screens[id];
  return `<div class="at">${sec('Every screen', `${P.surfaces.routes.length} routes across ${P.surfaces.surfaces.length} surfaces from docs/platform/surfaces.json. Gates are applied in this order: ${P.surfaces.gating_order.map(esc).join(' → ')}.`,
    tabs('at.sf', [['all', 'All', P.surfaces.routes.length], ...P.surfaces.surfaces.map(s => [s.id, s.name.replace(/ \(.*\)/, ''), P.surfaces.routes.filter(r => r.surface === s.id).length])], 'all') +
    h.table([{ k: 'label', label: 'Screen', fmt: (v, r) => `<b>${esc(v)}</b><div class="tiny t3">${esc(r.purpose)}</div>` }, { k: 'surface', label: 'Surface' }, { k: 'nav', label: 'Nav' }, { k: 'path', label: 'Path', m: true },
      { k: 'feature', label: 'Plan gate', fmt: v => v ? `<span class="mono tiny">${esc(v)}</span>` : '' }, { k: 'perm', label: 'Permission', fmt: v => v ? `<span class="mono tiny">${esc(v)}</span>` : '' }, { k: 'module', label: 'Module', fmt: v => esc(v || '') }, { k: 'spec', label: 'Spec', fmt: v => `<span class="tiny">${esc(v || '')}</span>` },
      { k: 'id', label: '', fmt: (v, r) => `${done(v) ? '' : '<span class="pill warn">todo</span>'}${viewBtn('Open', `as=${openAs(r)}&r=${v}`)}` }], list, { dense: true }))}</div>`;
};
})();
