/* screens-console: the Rootline operator console (19, 21 §5.5) and the partner portal (22 §5.4, 02 §7.8).
   Every tenant, number, ticket and person below is illustrative. The 8 sample tenants come from tenants.json with their real plans. */
(() => {
'use strict';
const RL = window.RL, h = RL.h, { esc, icon, money, kmoney, num } = h;
const I = RL.idx;

// ---------- dates relative to the explorer's "today" (May 11, 2027 or Jan 12, 2027) ----------
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const baseT = c => c.winter ? Date.UTC(2027, 0, 12) : Date.UTC(2027, 4, 11);
const day = (c, off) => { const d = new Date(baseT(c) + off * 864e5); const y = d.getUTCFullYear(); return MON[d.getUTCMonth()] + ' ' + d.getUTCDate() + (y !== 2027 ? ', ' + y : ''); };
const ago = n => n <= 0 ? 'today' : n === 1 ? 'yesterday' : n < 45 ? n + 'd ago' : Math.round(n / 30) + ' mo ago';

// ---------- roles, read-only and masking ----------
const ROLE_LBL = { platform_owner: 'Founder', platform_support: 'Support', platform_curator: 'Curator', platform_finance: 'Finance', platform_engineer: 'Engineer' };
const navv = (c, nav) => c.vis('console', nav || c.route.nav) || '-';
const RO = (c, nav) => /^R/.test(navv(c, nav));
const own = c => c.role === 'platform_owner';
const mk = why => `<span class="masked" title="${esc(why)}">•••</span>`;
const pii = (c, v, billingField) => (own(c) || (billingField && c.role === 'platform_finance')) ? v : mk(`PII masked for ${ROLE_LBL[c.role] || c.role} (21 §5.5). Visible only inside a consented View as user session (02 §5.13).`);
const bill = (c, v) => (c.role === 'platform_engineer' || c.role === 'platform_curator') ? mk(`Billing field: ${ROLE_LBL[c.role]} sees technical fields only (21 §5.5)`) : v;
const tech = (c, v) => c.role === 'platform_finance' ? mk('Technical field: Finance sees billing fields only (21 §5.5)') : v;
const mono = s => `<span class="mono tiny">${esc(s)}</span>`;
const sm = s => `<span class="tiny t3">${s}</span>`;
const roBanner = c => RO(c) ? h.banner(`${icon('eye')} Read-only for ${esc(ROLE_LBL[c.role])}: ${esc(navv(c))} in the console navigation table (21 §5.5). Write actions are hidden or disabled.`, 'info') : '';

// Platform staff capability matrix (19 §9.1, 02 §10.4), only the rows the screens act on.
// F full, L limited, Q request (needs approval), A approve (second key), '-' none.
const CAP = {
  note: { platform_owner: 'F', platform_support: 'F', platform_finance: 'L' },
  trial: { platform_owner: 'F', platform_support: 'L', platform_finance: 'F' },
  suspend_pay: { platform_owner: 'F', platform_finance: 'F' },
  suspend_risk: { platform_owner: 'A', platform_support: 'Q' },
  reactivate: { platform_owner: 'F', platform_finance: 'F' },
  delete: { platform_owner: 'A', platform_finance: 'Q', platform_engineer: 'Q' },
  access: { platform_owner: 'F', platform_support: 'F', platform_finance: 'L', platform_engineer: 'F' },
  breakglass: { platform_owner: 'A', platform_support: 'Q', platform_engineer: 'Q' },
  safe: { platform_owner: 'F', platform_support: 'F', platform_finance: 'L', platform_engineer: 'F' },
  credits: { platform_owner: 'F', platform_support: 'L', platform_finance: 'L' },
  refund: { platform_owner: 'F', platform_finance: 'F' },
  catalog: { platform_owner: 'A', platform_finance: 'Q' },
  override: { platform_owner: 'F', platform_support: 'L', platform_finance: 'F', platform_engineer: 'F' },
  flag: { platform_owner: 'F', platform_engineer: 'F' },
  kill: { platform_owner: 'A', platform_engineer: 'Q' },
  beta: { platform_owner: 'F', platform_support: 'F', platform_engineer: 'F' },
  kb: { platform_owner: 'F', platform_curator: 'F' },
  region: { platform_owner: 'F', platform_curator: 'Q' },
  ai: { platform_owner: 'F', platform_engineer: 'F' },
  comms: { platform_owner: 'F', platform_support: 'F', platform_engineer: 'F' },
  payhold: { platform_owner: 'A', platform_finance: 'Q', platform_engineer: 'Q' },
  risk: { platform_owner: 'F', platform_support: 'F' },
  dsar: { platform_owner: 'F', platform_support: 'F', platform_finance: 'F', platform_engineer: 'F' },
  hold: { platform_owner: 'F', platform_finance: 'Q' },
  retention: { platform_owner: 'A', platform_finance: 'Q', platform_engineer: 'Q' },
  incident: { platform_owner: 'F', platform_support: 'F', platform_engineer: 'F' },
  partners: { platform_owner: 'F', platform_finance: 'F' },
  staff: { platform_owner: 'F' },
  seat: { platform_owner: 'F', platform_support: 'L', platform_finance: 'F' },
  export: { platform_owner: 'A', platform_support: 'Q', platform_finance: 'Q', platform_engineer: 'Q' },
  migrate: { platform_owner: 'F', platform_support: 'F', platform_engineer: 'F' },
  content: { platform_owner: 'F', platform_support: 'F', platform_curator: 'F' },
  runbook: { platform_owner: 'A', platform_engineer: 'Q' },
  settings: { platform_owner: 'F' },
};
const LIMIT = {
  trial: { platform_support: 'Support may extend once, by up to 14 days. Further extensions need the founder (PA-035).' },
  credits: { platform_support: 'Goodwill up to $250 or one month of base fee per grant, once per tenant per quarter (PA-034).', platform_finance: 'Credits up to $5,000 per grant (22 §12.2).' },
  override: { platform_support: 'Limits within the plan default +25% only (19 §9.1).' },
  seat: { platform_support: 'Single user, with reason (PA-031).' },
  access: { platform_finance: 'billing_setup scope only (19 §9.1).' },
  note: { platform_finance: 'Finance notes only.' },
  safe: { platform_finance: 'Billing support actions only.' },
};
const can = (c, k, o) => { const g = (CAP[k] || {})[c.role] || '-'; if (RO(c, o && o.nav) && !(o && o.evenRO)) return '-'; return g; };

// Plain button with arbitrary data attributes
const B = (label, o) => { o = o || {}; return `<button type="button" class="btn${o.kind ? ' ' + o.kind : ''}${o.big ? '' : ' sm'}"${h.attr(o.a || {})}${o.dis ? ' disabled' : ''}${o.title ? ` title="${esc(o.title)}"` : ''}>${o.icon ? icon(o.icon) : ''}${label}</button>`; };
/* Privileged action button: reason code always, two-person when the action or grant needs it (PA-003, PA-004). */
function ab(c, k, label, o) {
  o = o || {};
  const g = can(c, k, o);
  if (g === '-') return o.hide ? '' : B(label, { dis: true, icon: o.icon, title: `Not available to ${ROLE_LBL[c.role] || c.role}: ${RO(c, o.nav) ? 'read-only in the console nav (21 §5.5)' : 'not in the staff matrix (19 §9.1)'}` });
  const two = !!o.two || g === 'Q';
  const key = (o.id || label) + ':' + (o.t || '');
  const pend = RL.ui['cx.pend.' + key], done = RL.ui['cx.done.' + key];
  if (pend) return `<span class="pill warn" title="Waiting on a second approver">${icon('clock', 's')}${esc(label)}: ${esc(pend)} pending</span>`;
  if (done && !o.repeat) return `<span class="pill ok">${icon('check', 's')}${esc(label)}: done</span>`;
  return B(label + (two ? ' <span class="tiny" style="opacity:.75">· 2-person</span>' : ''), { kind: o.kind, icon: o.icon, title: o.title,
    a: { 'data-modal': 'cx-act', 'data-k': k, 'data-g': g, 'data-id': o.id || label, 'data-title': label, 'data-tn': o.t || '', 'data-two': two ? '1' : '0', 'data-audit': o.audit || '', 'data-sum': o.sum || '', 'data-extra': o.extra || '', 'data-stepup': o.stepup ? '1' : '0', 'data-blast': o.blast || '' } });
}
const REASONS = ['customer_request', 'bug_remediation', 'billing_adjustment', 'migration', 'fraud_investigation', 'legal_request', 'security_incident', 'compliance_obligation', 'internal_testing', 'goodwill'];
const STRICT = ['legal_request', 'security_incident', 'fraud_investigation'];
const reasonFields = (ph) => h.field('Reason code', h.select([['', 'Choose a reason code']].concat(REASONS), '', { ui: 'cx.reason', label: 'Reason code' }), 'Required for every privileged action (PA-003).')
  + `<div class="cols cols-2">${h.field('Ticket', h.input('', { ui: 'cx.ticket', ph: 'HD-20931', label: 'Ticket' }), 'Required for customer_request.')}${h.field('Justification', h.input('', { ui: 'cx.text', ph: ph || 'Why, in plain words', label: 'Justification' }), 'Min 20 characters for legal, security and fraud reasons.')}</div>`;
const checkReason = () => {
  const r = RL.ui['cx.reason'];
  if (!r) { RL.toast('Pick a reason code first. Every privileged action needs one (PA-003).'); return false; }
  if (r === 'customer_request' && !String(RL.ui['cx.ticket'] || '').trim()) { RL.toast('customer_request needs a ticket reference (PA-003).'); return false; }
  if (STRICT.includes(r) && String(RL.ui['cx.text'] || '').trim().length < 20) { RL.toast(`${r} needs a written justification of at least 20 characters (PA-003).`); return false; }
  return r;
};
const resetReason = () => { RL.ui['cx.reason'] = ''; RL.ui['cx.ticket'] = ''; RL.ui['cx.text'] = ''; };
const aprId = key => 'APR-' + (2310 + h.hash(key) % 480);

RL.modal('cx-act', (c, el) => {
  const d = el.dataset; resetReason();
  const lim = (LIMIT[d.k] || {})[c.role];
  let extra = '';
  if (d.extra === 'days') { RL.ui['cx.days'] = '7'; extra = h.field('Extend by', h.select(c.role === 'platform_support' ? [['7', '7 days'], ['14', '14 days (support maximum, once)']] : [['7', '7 days'], ['14', '14 days'], ['30', '30 days (bulk maximum)']], '7', { ui: 'cx.days', label: 'Days' })); }
  if (d.extra === 'credits') { RL.ui['cx.amt'] = '500'; extra = h.field('Credits', h.select([['250', '250 credits'], ['500', '500 credits'], ['1000', '1,000 credits'], ['2000', '2,000 credits']], '500', { ui: 'cx.amt', label: 'Credits' }), 'Promotional grants expire in 90 days and are consumed after included credits (22 §4.4.1 rule 1).'); }
  if (d.extra === 'amount') extra = h.field('Amount', h.input('', { ui: 'cx.amt', ph: '$0.00', label: 'Amount' }), c.role === 'platform_support' ? 'Support: up to $250 or one month of base fee.' : 'Visible on the Company\'s next Rootline invoice. No secret prices (PA-034).');
  if (d.extra === 'scope') extra = h.field('Restriction', h.select(['SMS broadcasts off', 'New campaigns off', 'Custom domains off', 'AI generation capped at 50 credits'], 'SMS broadcasts off', { ui: 'cx.scope', label: 'Restriction' }));
  const two = d.two === '1';
  const body = `<p>${d.sum ? esc(d.sum) : `You are about to <b>${esc(d.title.toLowerCase())}</b>${d.tn ? ' for <b>' + esc(d.tn) + '</b>' : ''}.`}</p>`
    + (lim ? h.banner(`${icon('sliders')} Limited grant for ${esc(ROLE_LBL[c.role])}: ${esc(lim)}`, 'warn') : '')
    + extra + reasonFields()
    + (two ? h.banner(`${icon('users')} Two-person approval (PA-004): this creates a request in the approvals inbox. A second approver must approve within 4 hours, and you cannot approve your own request.`, 'warn') : '')
    + (d.stepup === '1' ? h.note('Step-up: tap your security key (WebAuthn) to confirm (PA-002).') : '')
    + h.note(`Blast radius: ${esc(d.blast || (d.tn ? '1 tenant' : 'see dry-run count'))}. Audit: ${esc(d.audit || 'console.action')} with before and after diff, hash-chained (PA-005).`);
  return { title: esc(d.title) + (d.tn ? ': ' + esc(d.tn) : ''), body, foot: B('Cancel', { a: { 'data-close': '' }, big: true }) + B(two ? 'Send for approval' : 'Confirm', { kind: two ? '' : 'primary', big: true, a: { 'data-act': 'cx-submit', 'data-id': d.id, 'data-title': d.title, 'data-tn': d.tn, 'data-two': d.two, 'data-audit': d.audit } }) };
});
RL.act('cx-submit', (el) => {
  const d = el.dataset, r = checkReason(); if (!r) return false;
  RL.closeModal();
  const key = d.id + ':' + (d.tn || '');
  if (d.two === '1') { const id = aprId(key); RL.ui['cx.pend.' + key] = id; RL.toast(`${esc(d.title)}: sent to the approvals inbox as ${id}, reason ${r}. Expires in 4 hours (PA-004).`); }
  else { RL.ui['cx.done.' + key] = r; RL.toast(`${esc(d.title)}${d.tn ? ' for ' + esc(d.tn) : ''}: done (mock). Logged as ${esc(d.audit || 'console.action')}, reason ${r}.`); }
  return true;
});

// ---------- staff and approvals ----------
const STAFF = [
  { id: 'STF-001', name: 'You (the founder)', role: 'platform_owner', title: 'Founder, Super Admin', key: 'YubiKey 5C + passkey', last: 'now', status: 'active' },
  { id: 'STF-002', name: 'Rafael Okafor', role: 'platform_owner', title: 'Fractional CTO, trusted second approver (scoped)', key: 'YubiKey 5 NFC', last: '2h ago', status: 'active' },
  { id: 'STF-011', name: 'Maya Delgado', role: 'platform_support', title: 'Support lead (EN/ES)', key: 'Passkey (device-bound)', last: 'now', status: 'active' },
  { id: 'STF-012', name: 'Luis Romero', role: 'platform_support', title: 'Migration specialist (custom role)', key: 'YubiKey 5C', last: '12 min ago', status: 'active' },
  { id: 'STF-013', name: 'Jordan Pike', role: 'platform_support', title: 'Onboarding coach, CSM', key: 'Passkey (device-bound)', last: '1h ago', status: 'active' },
  { id: 'STF-021', name: 'Dr. Priya Raman', role: 'platform_curator', title: 'Senior curator', key: 'YubiKey 5C', last: '25 min ago', status: 'active' },
  { id: 'STF-022', name: 'Ben Carter', role: 'platform_curator', title: 'Contract curator, West Michigan', key: 'Passkey (device-bound)', last: 'yesterday', status: 'active' },
  { id: 'STF-031', name: 'Tom Becker', role: 'platform_finance', title: 'Finance lead', key: 'YubiKey 5C', last: '40 min ago', status: 'active' },
  { id: 'STF-041', name: 'Sam Iverson', role: 'platform_engineer', title: 'SRE, on call this week', key: 'YubiKey 5C', last: 'now', status: 'active' },
  { id: 'STF-042', name: 'Kai Moreno', role: 'platform_engineer', title: 'ML engineer (AI Gateway)', key: 'YubiKey 5 NFC', last: '3h ago', status: 'active' },
  { id: 'STF-043', name: 'Dana Whitlock', role: 'platform_support', title: 'Contractor, offboarded', key: 'revoked', last: '16 days ago', status: 'deprovisioned' },
];
const APPROVALS = [
  { id: 'APR-2291', kind: 'Price version', what: 'Pro 2027.2: monthly list $599 to $629 for new subscribers', by: 'Tom Becker', byRole: 'platform_finance', blast: 'New Pro signups only; 214 existing tenants excluded by the Price Lock Promise', age: '52 min', left: '3h 08m', risk: 'danger', diff: ['pro.monthly: 599 → 629', 'pro.annual: 529 → 549', 'Projected MRR impact: +$1,140/mo at current Pro signup rate'] },
  { id: 'APR-2294', kind: 'Break-glass', what: 'Read-only bastion SQL on TNT-50211 for 60 min (ledger drift, INC-318)', by: 'Sam Iverson', byRole: 'platform_engineer', blast: '1 tenant; tenant notified within 24 h', age: '18 min', left: '3h 42m', risk: 'danger', diff: ['scope: read_only, one tenant', 'duration: 60 min, auto-revoked', 'session recorded, review within 5 business days'] },
  { id: 'APR-2296', kind: 'Refund over $1,000', what: 'Refund $2,988 annual Grow prepay to Blue Spruce Lawn (30-day money-back)', by: 'Tom Becker', byRole: 'platform_finance', blast: '1 tenant; MRR -$249', age: '2h 10m', left: '1h 50m', risk: 'warn', diff: ['refund: $2,988.00 to card on Rootline\'s own Stripe', 'policy: annual 30-day money-back (22 §4.7)'] },
  { id: 'APR-2299', kind: 'Flag rollout (prod)', what: 'route_optimizer_v2 from 25% to 50% of tenants', by: 'Sam Iverson', byRole: 'platform_engineer', blast: '612 tenants added; guardrails healthy for 31 h', age: '35 min', left: '3h 25m', risk: 'warn', diff: ['percentage: 25 → 50', 'freeze: weekdays 05:00-09:00 local still applies'] },
  { id: 'APR-2301', kind: 'Credit rate card', what: 'estimate.draft from 8 to 10 credits, effective in 60 days', by: 'Tom Becker', byRole: 'platform_finance', blast: 'All tenants; notice email in 60 days (22 §4.4.1)', age: '1d 2h', left: 'renewed', risk: 'warn', diff: ['estimate.draft: 8 → 10 credits', '7-day median raw cost $0.071 is 52% of credit revenue at $0.017 (guardrail 45%, 22 §7.4)'] },
  { id: 'APR-2303', kind: 'Suspend for risk', what: 'Suspend TNT-51877 (SMS spam run, opt-out rate 6.8%)', by: 'Maya Delgado', byRole: 'platform_support', blast: '1 tenant; client payments keep working', age: '9 min', left: '3h 51m', risk: 'danger', diff: ['state: active → suspended (risk)', 'feature restriction already applied: SMS broadcasts off'] },
  { id: 'APR-2305', kind: 'Legal hold release', what: 'Release hold LH-2026-07 on Lakeshore Snow Pros (matter closed)', by: 'Tom Becker', byRole: 'platform_finance', blast: '1 tenant; pending deletions resume after 7 days', age: '4h', left: 'expired, re-requested', risk: 'warn', diff: ['hold: active → released', 'deletions resume: 7-day delay (PA-132)'] },
];
const apprState = id => RL.ui['cx.appr.' + id];
RL.modal('cx-appr', (c, el) => {
  const ap = APPROVALS.find(a => a.id === el.dataset.id) || APPROVALS[0]; resetReason();
  const self = ap.byRole === c.role && !own(c);
  const may = own(c) && ap.byRole !== 'platform_owner';
  const body = h.kv([['Request', esc(ap.what)], ['Requested by', `${esc(ap.by)} <span class="t3">(${esc(ap.byRole)})</span>`], ['Blast radius', esc(ap.blast)], ['Expires', esc(ap.left)]])
    + `<div class="cd" style="padding:8px 10px"><div class="tiny t3 b">DIFF</div>${ap.diff.map(x => `<div class="mono tiny">${esc(x)}</div>`).join('')}</div>`
    + (may ? reasonFields('Why you approve or deny') + h.note('Step-up: tap your security key to sign the decision. The decision, diff and both identities go to the platform audit log (PA-004, PA-005).')
      : h.banner(self ? `${icon('lock')} You requested this, so you cannot approve it (PA-004).` : `${icon('lock')} Only the founder or the trusted second approver can decide ${esc(ap.kind.toLowerCase())} requests.`, 'warn'));
  return { title: `${esc(ap.kind)} · ${ap.id}`, body, foot: may ? B('Deny', { big: true, a: { 'data-act': 'cx-decide', 'data-id': ap.id, 'data-dec': 'denied' } }) + B('Approve', { kind: 'primary', big: true, a: { 'data-act': 'cx-decide', 'data-id': ap.id, 'data-dec': 'approved' } }) : B('Close', { big: true, a: { 'data-close': '' } }) };
});
RL.act('cx-decide', (el) => { const r = checkReason(); if (!r) return false; RL.closeModal(); RL.ui['cx.appr.' + el.dataset.id] = el.dataset.dec; RL.toast(`${el.dataset.id} ${el.dataset.dec} (mock), reason ${r}. Requester notified; audit entry written.`); return true; });
const apprRow = (c, ap) => {
  const st = apprState(ap.id);
  return { icon: ap.risk === 'danger' ? 'warn' : 'approve', tone: st ? (st === 'approved' ? 'ok' : '') : ap.risk, title: `${esc(ap.kind)}: ${esc(ap.what)}`, sub: `${mono(ap.id)} · ${esc(ap.by)} · ${esc(ap.age)} ago · ${esc(ap.blast)}`,
    right: st ? h.pill(st, st === 'approved' ? 'ok' : '') : B(own(c) ? 'Review' : 'View', { a: { 'data-modal': 'cx-appr', 'data-id': ap.id } }) };
};

// ---------- tenant directory fixtures (30+ tenants; the 8 sample tenants keep their real plans) ----------
const SAMPLE_X = {
  greenleaf: { tid: 'TNT-48213', state: 'active', health: 82, mrr: 529, office: [7, 8], field: [26, 30], signup: -421, last: 0, csm: 'Jordan P.', src: 'Jobber', stripe: 'on', tdlc: 'live', acct: 'Rootline Ledger', ver: '2.18.1', cell: 'us-1', ai: 3810, sms: 5120, tickets: 1, nps: 9, email: 'erin@greenleafgrounds.example', phone: '(614) 555-0142', tags: ['design partner', 'demo seed source'],
    fac: ['+ Visits on pace with last May (+4%)', '+ 26 of 29 field users active this week', '- 1 open ticket (QBO mapping question)'], note: 'Owner Erin prefers texts. Crew leads Spanish-first. Migrated from Jobber in winter 2026.',
    w: { mrr: 608, field: [9, 30], ai: 1240, sms: 960, health: 79, fac: ['+ Office logins steady through winter', '+ Snow & Ice module active (Nov-Mar)', '- 1 open ticket (QBO mapping question)'] } },
  summit: { tid: 'TNT-48377', state: 'active', health: 74, mrr: 1443, office: [14, 8], field: [118, 30], signup: -503, last: 0, csm: 'Jordan P.', src: 'Aspire export', stripe: 'on', tdlc: 'live', acct: 'Rootline Ledger', ver: '2.18.0', cell: 'us-2', ai: 4420, sms: 7350, tickets: 3, nps: 8, email: 'marcus@summitgrounds.example', phone: '(614) 555-0198', tags: ['commercial', 'multi_branch'],
    fac: ['+ 118 active field users across 3 branches', '- Commercial portal approvals slow (median 3.1 days)', '- 3 tickets in 30 days'], note: 'Three branches. PO numbers required on Crossroads invoices. Controller is Alan Price.',
    w: { mrr: 882, field: [38, 30], ai: 1880, sms: 6100, fac: ['+ Snow events logged on 214 sites', '+ Per-push invoices sent same day', '- 3 tickets in 30 days'] } },
  reyes: { tid: 'TNT-48102', state: 'active', health: 77, mrr: 348, office: [4, 3], field: [16, 10], signup: -458, last: 0, csm: 'Maya D.', src: 'LMN', stripe: 'on', tdlc: 'live', acct: 'Rootline Ledger', ver: '2.18.1', cell: 'us-1', ai: 1610, sms: 1880, tickets: 0, nps: 9, partner: 'Liu & Partners CPAs', email: 'dana@reyesoutdoor.example', phone: '(630) 555-0117', tags: ['design_build'],
    fac: ['+ Proposals sent up 22% vs last May', '+ Books closed by partner firm monthly', '- 2 field users on crew app 2.15'], note: 'Bookkeeping by Karen Liu, CPA (partner firm). Owner Dana Reyes.', w: { mrr: 288, field: [7, 10], ai: 820, sms: 410 } },
  maplehollow: { tid: 'TNT-48650', state: 'active', health: 71, mrr: 197, office: [3, 3], field: [11, 10], signup: -360, last: 0, csm: 'Maya D.', src: 'Service Autopilot', stripe: 'on', tdlc: 'live', acct: 'Rootline Ledger', ver: '2.17.2', cell: 'us-1', ai: 690, sms: 2310, tickets: 1, nps: 8, coupon: 'Founding Customer 25% off base', email: 'gina@maplehollowlawn.example', phone: '(262) 555-0133', tags: ['lawn_programs'],
    fac: ['+ 1,180 clients on programs', '- SMS at 92% of allowance', '- Crew app 2.17 on 4 devices'], note: 'Founding Customer. Five-step program clients, heavy reminder texting.', w: { mrr: 187, field: [4, 10], sms: 300, health: 68 } },
  beacon: { tid: 'TNT-48911', state: 'active', health: 66, mrr: 338, office: [4, 3], field: [15, 10], signup: -330, last: 1, csm: 'Jordan P.', src: 'CSV', stripe: 'req', tdlc: 'live', acct: 'Rootline Ledger', ver: '2.18.0', cell: 'us-2', ai: 540, sms: 2120, tickets: 2, nps: 7, email: 'owen@beaconirrigation.example', phone: '(616) 555-0161', tags: ['irrigation', 'lighting'],
    fac: ['- Stripe: 1 requirement due in 6 days', '+ 2,150 clients, start-ups on schedule', '- 2 tickets (controller import)'], note: 'Irrigation start-up season is April to May. Owner Owen Pike.', w: { mrr: 288, field: [5, 10], stripe: 'on', health: 70 } },
  brookside: { tid: 'TNT-49230', state: 'active', health: 63, mrr: 79, office: [1, 1], field: [3, 3], signup: -290, last: 0, csm: '-', src: 'Spreadsheet (CSV)', stripe: 'on', tdlc: 'live', acct: 'Rootline Ledger', ver: '2.18.1', cell: 'us-1', ai: 120, sms: 410, tickets: 0, nps: 8, email: 'nate@brooksidelawn.example', phone: '(419) 555-0109', tags: ['solo_lawn'],
    fac: ['+ Weekly mowing on schedule', '- Owner is the only office user', '+ Autopay on 61% of clients'], note: 'Solo operator, works out of the truck. Prefers phone.',
    w: { state: 'past_due', due: 9, health: 47, field: [1, 3], ai: 30, sms: 60, fac: ['- Rootline invoice past due, day 9 (expired card)', '+ Winter Mode offered on day 7 (seasonal sensitivity)', '- Only 1 login in 14 days'] } },
  fernwood: { tid: 'TNT-50118', state: 'active', health: 72, mrr: 49, office: [1, 1], field: [0, 0], signup: -180, last: 2, csm: '-', src: 'none', stripe: 'on', tdlc: 'not_started', acct: 'QuickBooks Online (system of record)', ver: 'n/a', cell: 'us-1', ai: 980, sms: 0, tickets: 0, nps: 10, partner: 'Liu & Partners CPAs', email: 'claire@fernwoodgarden.example', phone: '(847) 555-0120', tags: ['design_only'],
    fac: ['+ 14 mockup sets this month', '+ Proposals accepted 5 of 7', '- No SMS (email only by choice)'], note: 'Independent designer, no crews. Books in QuickBooks Online.' },
  kestrel: { tid: 'TNT-50011', state: 'active', health: 69, mrr: 11982, office: [46, 60], field: [212, null], signup: -95, last: 0, csm: 'Jordan P.', src: 'Scoped project (3 systems)', stripe: 'on', tdlc: 'numbers_attached', acct: 'Rootline Ledger', ver: '2.18.1', cell: 'dedicated kl-1', ai: 18800, sms: 41000, tickets: 6, nps: 7, email: 'renee@kestrellawn.example', phone: '(317) 555-0101', tags: ['franchise', 'enterprise', 'V2'],
    fac: ['+ 38 locations, 31 live', '- 7 locations still on the old system (parallel run)', '- 6 tickets, 2 on franchise rollup reports'], note: 'Franchise system, enterprise change freeze on flags. Dedicated database.', w: { field: [96, null], health: 72 } },
};
const X = [
  { id: 'pineridge', tid: 'TNT-48477', name: 'Pine Ridge Grounds', plan: 'pro', region: 'Northeast Ohio', city: 'Akron, OH', state: 'active', health: 31, mrr: 1140, office: [9, 8], field: [24, 30], signup: -388, last: 1, csm: 'Jordan P.', src: 'LMN', stripe: 'on', tdlc: 'live', acct: 'Rootline Ledger', ver: '2.16.0', ai: 410, sms: 2200, tickets: 4, nps: 6, owner: 'Rick Dawson', fac: ['- Invoices sent down 62% vs same weeks last year', '- Office logins: 2 of 9 seats active', '- 4 tickets in 30 days, 1 escalated'] },
  { id: 'hilltop', tid: 'TNT-49012', name: 'Hilltop Lawn Co.', plan: 'grow', region: 'Southeast Wisconsin', city: 'Madison, WI', state: 'past_due', due: 9, health: 36, mrr: 389, office: [4, 3], field: [12, 10], signup: -301, last: 0, csm: 'Maya D.', src: 'Jobber', stripe: 'on', tdlc: 'live', acct: 'QuickBooks Online sync', ver: '2.14.2', ai: 700, sms: 1900, tickets: 2, nps: 5, owner: 'Gary Lindahl', fac: ['- QuickBooks sync failing for 9 days', '- Rootline invoice past due, day 9', '- Crew app 2.14 on 3 devices (min 2.16)'] },
  { id: 'lakeshorehs', tid: 'TNT-48720', name: 'Lakeshore Hardscape', plan: 'grow', region: 'West Michigan', city: 'Holland, MI', state: 'active', health: 38, mrr: 720, office: [6, 3], field: [14, 10], signup: -344, last: 0, csm: 'Jordan P.', src: 'SingleOps export', stripe: 'on', tdlc: 'live', acct: 'Rootline Ledger', ver: '2.18.0', ai: 2900, sms: 1500, tickets: 3, nps: 3, owner: 'Pete Vanden Berg', fac: ['- Owner NPS 3 (April): "3D renders too slow"', '- 2 designer seats idle 30 days', '+ Proposals steady'] },
  { id: 'bluespruce', tid: 'TNT-51240', name: 'Blue Spruce Lawn', plan: 'grow', region: 'West Michigan', city: 'Grand Rapids, MI', state: 'trial', trialDay: 12, ms: 4, ext: true, health: 61, mrr: 0, office: [2, 3], field: [6, null], signup: -12, last: 0, csm: 'Maya D.', src: 'Jobber', stripe: 'none', tdlc: 'brand_pending', acct: 'Rootline Ledger', ver: '2.18.1', ai: 310, sms: 0, tickets: 1, owner: 'Kurt Ensing', fac: ['+ 4 of 6 milestones: earned +14 days', '- Stripe not connected', '+ 412 clients imported from Jobber'] },
  { id: 'cardinal', tid: 'TNT-51233', name: 'Cardinal Outdoor', plan: 'grow', region: 'Central Ohio', city: 'Westerville, OH', state: 'trial', trialDay: 13, ms: 6, health: 82, mrr: 0, office: [3, 3], field: [9, null], signup: -13, last: 0, csm: 'Jordan P.', src: 'CSV', stripe: 'on', tdlc: 'campaign_pending', acct: 'Rootline Ledger', ver: '2.18.1', ai: 440, sms: 0, tickets: 0, owner: 'Alyssa Perez', fac: ['+ 6 of 6 milestones', '+ First invoice paid via own Stripe', '- 10DLC campaign pending day 9'] },
  { id: 'hermanos', tid: 'TNT-51251', name: 'Hermanos Garcia Lawn Care', plan: 'grow', region: 'Chicagoland and Northwest Indiana', city: 'Aurora, IL', state: 'trial', trialDay: 11, ms: 1, health: 34, mrr: 0, office: [1, 3], field: [0, null], signup: -11, last: 3, csm: '-', src: 'none', stripe: 'none', tdlc: 'not_started', acct: 'none chosen', ver: 'n/a', ai: 12, sms: 0, tickets: 0, owner: 'Rogelio Garcia', locale: 'es-US', fac: ['- Stripe not connected after 11 days', '- 0 crew logins', '- Owner locale es-US: assign a Spanish-speaking CSM'] },
  { id: 'northfield', tid: 'TNT-51229', name: 'Northfield Snow & Landscape', plan: 'grow', region: 'Southeast Wisconsin', city: 'Brookfield, WI', state: 'trial', trialDay: 10, ms: 5, health: 70, mrr: 0, office: [3, 3], field: [7, null], signup: -10, last: 0, csm: 'Luis R.', src: 'Service Autopilot', stripe: 'req', tdlc: 'campaign_pending', acct: 'Rootline Ledger', ver: '2.18.1', ai: 260, sms: 0, tickets: 1, owner: 'Brett Kowalczyk', fac: ['+ 5 of 6 milestones', '- 10DLC campaign pending day 11', '- Stripe requirement due (tax ID)'] },
  { id: 'lakeshoresnow', tid: 'TNT-48808', name: 'Lakeshore Snow Pros', plan: 'grow', region: 'Northeast Ohio', city: 'Mentor, OH', state: 'active', health: 64, mrr: 317, office: [3, 3], field: [8, 10], signup: -410, last: 0, csm: 'Luis R.', src: 'Yardbook', stripe: 'on', tdlc: 'live', acct: 'Rootline Ledger', ver: '2.18.0', ai: 90, sms: 980, tickets: 1, nps: 7, owner: 'Dale Kovach', hold: 'LH-2026-07', addons: ['snow_ice'], fac: ['+ Snow sites all have proof-of-service photos', '- Legal hold active (slip-and-fall matter)', '+ Autopay on 74% of commercial sites'], w: { mrr: 396, field: [14, 10], sms: 6200, health: 72 } },
  { id: 'foxvalley', tid: 'TNT-48934', name: 'Fox Valley Tree & Turf', plan: 'grow', region: 'Chicagoland and Northwest Indiana', city: 'St. Charles, IL', state: 'restricted', due: 17, health: 44, mrr: 412, office: [4, 3], field: [13, 10], signup: -366, last: 0, csm: 'Maya D.', src: 'Real Green export', stripe: 'on', tdlc: 'live', acct: 'Rootline Ledger', ver: '2.17.2', ai: 140, sms: 1600, tickets: 2, nps: 6, owner: 'Ken Albrecht', partner: 'Liu & Partners CPAs', fac: ['- Rootline invoice unpaid, day 17 (restricted)', '- 141 unreconciled bank lines', '+ Visits on pace'] },
  { id: 'oakhollow', tid: 'TNT-48299', name: 'Oak Hollow Landscapes', plan: 'pro', region: 'Central Ohio', city: 'Dublin, OH', state: 'active', health: 88, mrr: 1060, office: [10, 8], field: [27, 30], signup: -470, last: 0, csm: 'Jordan P.', src: 'Jobber', stripe: 'on', tdlc: 'live', acct: 'Rootline Ledger', ver: '2.18.1', ai: 5100, sms: 4800, tickets: 0, nps: 10, owner: 'Hannah Merritt', fac: ['+ 3D designs on 61% of proposals', '+ Every office seat active weekly', '+ NPS 10'] },
  { id: 'prairieedge', tid: 'TNT-49377', name: 'Prairie Edge Lawn Care', plan: 'starter', region: 'Chicagoland and Northwest Indiana', city: 'Joliet, IL', state: 'active', health: 67, mrr: 91, office: [1, 1], field: [4, 3], signup: -250, last: 1, csm: '-', src: 'Yardbook', stripe: 'on', tdlc: 'live', acct: 'Rootline Ledger', ver: '2.18.0', ai: 210, sms: 470, tickets: 0, nps: 8, owner: 'Nick Strand', partner: 'Liu & Partners CPAs', fac: ['+ Weekly routes on schedule', '- 1 field seat over allowance', '+ Books closed monthly by partner'] },
  { id: 'cuyahoga', tid: 'TNT-49118', name: 'Cuyahoga Green Works', plan: 'grow', region: 'Northeast Ohio', city: 'Cleveland, OH', state: 'active', health: 74, mrr: 364, office: [4, 3], field: [11, 10], signup: -150, last: 0, csm: 'Maya D.', src: 'Jobber', stripe: 'on', tdlc: 'campaign_rejected', acct: 'Rootline Ledger', ver: '2.18.1', ai: 820, sms: 0, tickets: 1, nps: 8, owner: 'Tanya Brooks', fac: ['- 10DLC campaign rejected: no opt-in on website', '+ Email reminders working', '+ Proposals up'] },
  { id: 'kzoo', tid: 'TNT-49264', name: 'Kalamazoo Stoneworks', plan: 'grow', region: 'West Michigan', city: 'Kalamazoo, MI', state: 'active', health: 58, mrr: 301, office: [3, 3], field: [9, 10], signup: -120, last: 0, csm: 'Jordan P.', src: 'CSV', stripe: 'on', tdlc: 'brand_failed', acct: 'QuickBooks Online sync', ver: '2.17.2', ai: 1200, sms: 0, tickets: 2, nps: 7, owner: 'Matt Hoekstra', fac: ['- 10DLC brand failed: EIN name mismatch', '- QBO sync: 6 records quarantined', '+ Designs per proposal up'] },
  { id: 'ironwood', tid: 'TNT-48561', name: 'Ironwood Hardscapes', plan: 'pro', region: 'Southeast Michigan and Toledo', city: 'Ann Arbor, MI', state: 'active', health: 79, mrr: 942, office: [9, 8], field: [22, 30], signup: -420, last: 0, csm: 'Jordan P.', src: 'Aspire export', stripe: 'on', tdlc: 'live', acct: 'Rootline Ledger', ver: '2.18.1', ai: 3900, sms: 3100, tickets: 1, nps: 9, owner: 'Grace Lindgren', fac: ['+ Job costing used on every install', '+ WIP schedule closed monthly', '- 1 ticket (3D export)'] },
  { id: 'riverbend', tid: 'TNT-49401', name: 'Riverbend Lawn & Snow', plan: 'starter', region: 'Southeast Michigan and Toledo', city: 'Monroe, MI', state: 'suspended', due: 33, health: 22, mrr: 79, office: [1, 1], field: [3, 3], signup: -280, last: 2, csm: 'Maya D.', src: 'Spreadsheet (CSV)', stripe: 'on', tdlc: 'live', acct: 'Rootline Ledger', ver: '2.16.0', ai: 0, sms: 120, tickets: 1, nps: 4, owner: 'Jim Sobczak', snow: true, fac: ['- Suspended for non-payment, day 33', '+ Clients still paying open invoices via portal', '- Owner unreachable by email'] },
  { id: 'willowbend', tid: 'TNT-49002', name: 'Willow Bend Gardens', plan: 'grow', region: 'Southeast Wisconsin', city: 'Milwaukee, WI', state: 'pending_cancellation', health: 41, mrr: 249, office: [2, 3], field: [6, 10], signup: -395, last: 4, csm: 'Maya D.', src: 'Jobber', stripe: 'on', tdlc: 'live', acct: 'QuickBooks Online sync', ver: '2.17.2', ai: 60, sms: 300, tickets: 0, nps: 5, owner: 'Ellen Marsh', fac: ['- Exit survey: price', '- Cancels at period end', '+ Offered Winter Mode and Archive plan'],
    w: { state: 'winter_mode', mrr: 62, fac: ['+ Winter Mode (25% of list) until Mar 1', '- 2 editable office users', '+ Invoicing and autopay still on'] } },
  { id: 'copperleaf', tid: 'TNT-51262', name: 'Copper Leaf Landscape', plan: 'grow', region: 'Central Ohio', city: 'Delaware, OH', state: 'trial', trialDay: 6, ms: 3, health: 55, mrr: 0, office: [2, 3], field: [4, null], signup: -6, last: 0, csm: 'Jordan P.', src: 'CSV', stripe: 'on', tdlc: 'brand_pending', acct: 'Rootline Ledger', ver: '2.18.1', ai: 180, sms: 0, tickets: 0, owner: 'Sean Whalen', fac: ['+ Stripe connected day 2', '- No proposal sent yet', '+ 3 of 6 milestones'] },
  { id: 'tworivers', tid: 'TNT-48990', name: 'Two Rivers Irrigation', plan: 'grow', region: 'Southeast Michigan and Toledo', city: 'Toledo, OH', state: 'active', health: 71, mrr: 338, office: [4, 3], field: [15, 10], signup: -230, last: 0, csm: 'Luis R.', src: 'CSV', stripe: 'on', tdlc: 'live', acct: 'Rootline Ledger', ver: '2.18.0', ai: 300, sms: 2900, tickets: 1, nps: 8, owner: 'Ray Sobel', fac: ['+ 1,640 start-ups booked online', '- SMS at 116% (overage billed)', '+ Autopay 58%'] },
  { id: 'escarpment', tid: 'TNT-51010', name: 'Escarpment Gardens', plan: 'grow', region: 'Ontario (Wave 2)', city: 'Hamilton, ON', country: 'CA', res: 'ca', cur: 'CAD', state: 'active', health: 76, mrr: 339, office: [3, 3], field: [8, 10], signup: -80, last: 0, csm: 'Luis R.', src: 'QuickBooks Online', stripe: 'on', tdlc: 'n/a (CA)', acct: 'Rootline Ledger', ver: '2.18.1', ai: 610, sms: 900, tickets: 1, nps: 9, owner: 'Fiona MacLeod', tags: ['V1'], fac: ['+ GST/HST set up', '+ CASL consent basis recorded on 98%', '- 1 ticket (French invoices, V2)'] },
  { id: 'heartland', tid: 'TNT-48644', name: 'Heartland Turf Pros', plan: 'pro', region: 'Chicagoland and Northwest Indiana', city: 'Wheaton, IL', state: 'active', health: 69, mrr: 812, office: [8, 8], field: [26, 30], signup: -330, last: 0, csm: 'Jordan P.', src: 'Service Autopilot', stripe: 'on', tdlc: 'live', acct: 'Rootline Ledger', ver: '2.18.0', ai: 1400, sms: 6900, tickets: 2, nps: 7, owner: 'Doug Ferrante', partner: 'Liu & Partners CPAs', fac: ['+ Programs renewing on autopay', '- 23 unreconciled bank lines', '- 2 tickets'] },
  { id: 'maplestone', tid: 'TNT-49155', name: 'Maple & Stone LLC', plan: 'grow', region: 'Northeast Ohio', city: 'Medina, OH', state: 'active', health: 52, mrr: 288, office: [3, 3], field: [11, 10], signup: -210, last: 1, csm: 'Maya D.', src: 'Jobber', stripe: 'disc', tdlc: 'live', acct: 'Rootline Ledger', ver: '2.18.0', ai: 260, sms: 1300, tickets: 1, nps: 6, owner: 'Chris Novotny', fac: ['- Stripe disconnected (deauthorized 5d ago)', '- Portal shows "Contact us to pay"', '+ Visits on pace'] },
  { id: 'tallgrass', tid: 'TNT-51270', name: 'Tallgrass Design Studio', plan: 'design_solo', region: 'Chicagoland and Northwest Indiana', city: 'Oak Park, IL', state: 'trial', trialDay: 3, ms: 2, health: 60, mrr: 0, office: [1, 1], field: [0, 0], signup: -3, last: 0, csm: '-', src: 'none', stripe: 'on', tdlc: 'not_started', acct: 'QuickBooks Online (system of record)', ver: 'n/a', ai: 160, sms: 0, tickets: 0, owner: 'Mira Okonkwo', partner: 'Liu & Partners CPAs', fac: ['+ 4 mockup sets in 3 days', '+ Stripe connected', '- No proposal yet'] },
  { id: 'freshcut', tid: 'TNT-50877', name: 'Fresh Cut Mowing', plan: 'grow', region: 'Central Ohio', city: 'Grove City, OH', state: 'trial_expired', roDay: 12, health: 18, mrr: 0, office: [1, 3], field: [0, null], signup: -26, last: 9, csm: '-', src: 'none', stripe: 'none', tdlc: 'not_started', acct: 'none chosen', ver: 'n/a', ai: 40, sms: 0, tickets: 0, owner: 'Tyler Moss', fac: ['- Read-only, day 12 of 60', '- 1 of 6 milestones', '- No logins in 9 days'] },
  { id: 'huronvalley', tid: 'TNT-48405', name: 'Huron Valley Grounds', plan: 'grow', region: 'Southeast Michigan and Toledo', city: 'Brighton, MI', state: 'churned', health: 0, mrr: 0, office: [0, 3], field: [0, 10], signup: -540, last: 41, csm: '-', src: 'Jobber', stripe: 'on', tdlc: 'live', acct: 'Rootline Ledger', ver: '2.15.0', ai: 0, sms: 0, tickets: 0, nps: 4, owner: 'Paul Brandt', fac: ['- Churned: switched to a competitor (exit survey)', '+ Export downloaded', '- 90-day export window, day 41'] },
];
const SEG_OF = { S1: 'solo_lawn', S2: 'design_build', S3: 'maintenance', S4: 'commercial_maintenance', S5: 'irrigation', S6: 'design_only', S7: 'franchise' };
const TC = {};
function allT(c) {
  const k = c.winter ? 'w' : 'p'; if (TC[k]) return TC[k];
  const samples = RL.P.tenants.tenants.map(t => Object.assign({ id: t.id, name: t.name, plan: t.plan, region: t.region === 'Great Lakes + Wave 2' ? 'Great Lakes + Wave 2 (38 locations)' : t.region, city: t.city, owner: (t.cast || {}).owner, addons: t.addons, sample: true, seg: t.segment, people: t.people_peak, crews: t.crews, clients: t.clients, cast: t.cast || {} }, SAMPLE_X[t.id]));
  const list = samples.concat(X).map(t => {
    const o = Object.assign({ country: 'US', res: 'us', cur: 'USD', partner: '', tags: [], addons: [], cell: 'us-' + (1 + h.hash(t.id) % 3) }, t, c.winter && t.w ? t.w : {});
    o.trialLen = o.state === 'trial' ? ((c.winter ? 30 : 14) + (o.ext ? 14 : 0)) : 0;
    o.seg = o.seg ? SEG_OF[o.seg] : (o.plan === 'design_solo' ? 'design_only' : o.tags.includes('commercial') ? 'commercial_maintenance' : o.plan === 'starter' ? 'solo_lawn' : 'design_build');
    o.cur = o.cur || 'USD';
    return o;
  });
  return (TC[k] = list);
}
const findT = (c, id) => allT(c).find(t => t.id === id) || allT(c).find(t => t.id === c.t.id) || allT(c)[0];
const ST_TONE = { trial: 'info', trial_expired: '', active: 'ok', past_due: 'warn', restricted: 'warn', suspended: 'danger', winter_mode: 'info', pending_cancellation: 'warn', churned: '', archive_plan: '', pending_deletion: 'danger' };
const stP = s => h.pill(esc(s), ST_TONE[s] || '');
const bandOf = n => n >= 70 ? 'green' : n >= 40 ? 'yellow' : 'red';
const hP = n => `<span class="pill ${n >= 70 ? 'ok' : n >= 40 ? 'warn' : 'danger'}" title="Health ${n}: ${bandOf(n)} band (PA-013)">${n}</span>`;
const mrrF = t => t.state === 'trial' || t.state === 'trial_expired' ? '<span class="t3">trial</span>' : (t.cur === 'CAD' ? 'C' : '') + money(t.mrr);
const planN = code => (I.PLANS[code] || { name: code }).name;
const STRIPE = { on: ['on', 'ok'], req: ['requirement due', 'warn'], off: ['charges off', 'danger'], none: ['not connected', ''], disc: ['deauthorized', 'danger'] };
const strP = s => h.pill(STRIPE[s] ? STRIPE[s][0] : s, STRIPE[s] ? STRIPE[s][1] : '');
const TDLC_T = { live: 'ok', numbers_attached: 'ok', campaign_approved: 'ok', brand_approved: 'info', campaign_pending: 'info', brand_pending: 'info', profile_submitted: 'info', not_started: '', brand_failed: 'danger', campaign_rejected: 'danger' };
const tdP = s => h.pill(esc(s), TDLC_T[s] || '');
const trialInfo = (c, t) => t.state === 'trial' ? `day ${t.trialDay} of ${t.trialLen}${t.ext ? ' (+14 earned)' : ''}${c.winter ? ', winter trial' : ''}` : t.state === 'trial_expired' ? `read-only day ${t.roDay} of 60` : '';

// ---------- platform metrics (season-aware, illustrative) ----------
const PM = c => c.winter ? {
  mrr: 458300, arr: 5.21, paying: 1126, tenants: 1874, trials7: 164, conv7: 22, act: 39, actTarget: 50, aiMargin: 67, aiDelta: '+1 pt', mrrWk: 3120,
  mv: { start: 455180, nw: 6240, exp: 2310, rea: 480, con: -3460, chu: -2450 }, weeks: ['Nov 23', 'Nov 30', 'Dec 7', 'Dec 14', 'Dec 21', 'Dec 28', 'Jan 4', 'Jan 11'],
  wkNew: [7.1, 6.8, 5.9, 5.2, 3.9, 4.4, 6.0, 6.2], wkLoss: [4.2, 5.8, 6.4, 6.1, 5.0, 4.6, 5.2, 5.9], season: 'Planning season: winter trials run 30 days, Winter Switch migrations peak',
} : {
  mrr: 511820, arr: 5.59, paying: 1214, tenants: 1962, trials7: 211, conv7: 38, act: 44, actTarget: 50, aiMargin: 64, aiDelta: '-3 pts', mrrWk: 9400,
  mv: { start: 502420, nw: 9420, exp: 4180, rea: 610, con: -1940, chu: -2870 }, weeks: ['Mar 22', 'Mar 29', 'Apr 5', 'Apr 12', 'Apr 19', 'Apr 26', 'May 3', 'May 10'],
  wkNew: [9.2, 10.4, 12.1, 13.0, 12.6, 13.8, 13.1, 13.6], wkLoss: [3.1, 3.4, 2.9, 4.2, 3.8, 4.4, 3.9, 4.8], season: 'Spring rush, week 6: crew app tickets from 5 to 9 am jump the queue',
};
const INCIDENTS = c => [
  { id: 'INC-322', sev: 'SEV3', title: c.winter ? 'Snow push texts delayed on one carrier (queueing 4-9 min)' : 'SMS delivery delayed on one carrier (queueing 4-9 min)', state: 'monitoring', when: day(c, 0) + ', 5:48 am', ic: 'Sam I.', tenants: 212, comp: 'Notifications (SMS)' },
  { id: 'INC-321', sev: 'SEV3', title: 'QuickBooks Online sync backlog', state: 'resolved', when: day(c, 0) + ', 1:10-3:12 am', ic: 'Sam I.', tenants: 37, comp: 'Integrations (QuickBooks)' },
  { id: 'INC-318', sev: 'SEV2', title: 'Ledger subledger drift on 1 tenant after an ACH return replay', state: 'postmortem', when: day(c, -3), ic: 'Kai M.', tenants: 1, comp: 'Ledger' },
];
const incList = c => h.list(INCIDENTS(c).map(i => ({ icon: i.state === 'resolved' ? 'check' : 'warn', tone: i.state === 'resolved' ? 'ok' : i.state === 'postmortem' ? 'info' : 'warn', title: `${mono(i.id)} ${esc(i.sev)} · ${esc(i.title)}`, sub: `${esc(i.comp)} · ${i.tenants} tenants · IC ${esc(i.ic)} · ${esc(i.when)}`, right: h.pill(i.state, i.state === 'resolved' ? 'ok' : i.state === 'monitoring' ? 'warn' : 'info') })));
const QUEUES = c => [
  { label: 'Support tickets open', value: c.winter ? 61 : 84, right: c.winter ? '61 · 4 near SLA' : '84 · 7 near SLA', tone: 'warn' },
  { label: 'Plant KB curation', value: 214, right: '214 · 23 conflicts', tone: '' },
  { label: 'Migration projects', value: c.winter ? 58 : 27, right: c.winter ? '58 · Winter Switch' : '27 · 3 at risk', tone: 'info' },
  { label: 'Trust and Safety review', value: 12, right: '12 · 2 high', tone: 'danger' },
  { label: '10DLC pending', value: 41, right: '41 · 4 rejected', tone: 'info' },
  { label: 'DSARs open', value: 7, right: '7 · 2 due in 7d', tone: '' },
  { label: 'Dunning (past_due+)', value: c.winter ? 52 : 44, right: (c.winter ? 52 : 44) + ' tenants', tone: 'warn' },
];

const tabsN = (key, list) => { const ids = list.map(x => x[0]); if (!ids.includes(RL.ui[key])) RL.ui[key] = ids[0]; return [h.tabs(key, list), RL.ui[key]]; };
const pct1 = v => (Math.round(v * 10) / 10) + '%';

// =====================================================================================
// Home and Command Center (19 §4.1, §6.2; 21 §5.5): role-aware
// =====================================================================================
const waterfall = (c, m) => {
  const end = m.start + m.nw + m.exp + m.rea + m.con + m.chu;
  const rows = [['Starting MRR (7 days ago)', m.start, ''], ['New', m.nw, 'ok'], ['Expansion (seats, add-ons, upgrades)', m.exp, 'ok'], ['Reactivation', m.rea, 'ok'], ['Contraction (downgrades, Winter Mode)', m.con, 'warn'], ['Churn', m.chu, 'danger'], ['Ending MRR', end, '']];
  return h.table([{ k: 0, label: 'Movement', fmt: (v, r) => r[2] ? esc(v) : `<b>${esc(v)}</b>` }, { k: 1, label: 'MRR', n: true, fmt: (v, r) => r[2] ? `${v > 0 ? '+' : ''}${money(v)}` : `<b>${money(v)}</b>` }, { k: 2, label: 'Share', fmt: (v, r) => r[2] ? `<div style="width:140px">${h.progress(Math.abs(r[1]), 10000, r[2] === 'ok' ? '' : r[2])}</div>` : '' }], rows, { dense: true });
};
RL.act('cx-nav', (el) => { if (el.dataset.k) RL.ui[el.dataset.k] = el.dataset.v; RL.go(el.dataset.r, el.dataset.x); return false; });
const navB = (label, r, o) => B(label, { kind: (o && o.kind) || 'ghost', icon: o && o.icon, a: { 'data-act': 'cx-nav', 'data-r': r, 'data-k': o && o.k, 'data-v': o && o.v, 'data-x': o && o.x } });
const mrrChart = (c, m) => h.colchart(m.weeks, [{ values: m.wkNew.map(v => Math.round(v * 1000)), cls: 'c1' }, { values: m.wkLoss.map(v => Math.round(v * 1000)), cls: 'c4' }], { money: true, h: 130, label: 'Weekly MRR gained vs lost' })
  + `<div class="flex tiny t3"><span><i style="display:inline-block;width:9px;height:9px;border-radius:2px;background:var(--primary)"></i> New + expansion + reactivation</span><span><i style="display:inline-block;width:9px;height:9px;border-radius:2px;background:var(--clay-500)"></i> Contraction + churn</span><span class="grow"></span><span>Source: MRR movements, metric registry PA-147</span></div>`;
const FUNNEL = c => c.winter
  ? [['Signed up (30 days)', 702], ['Onboarding questionnaire', 611], ['Stripe connected', 402], ['First client imported', 455], ['First proposal sent', 288], ['First visit completed in crew app', 241], ['First invoice paid via own Stripe', 219], ['Activated (PA-020)', 274], ['Converted to paid', 101]]
  : [['Signed up (30 days)', 911], ['Onboarding questionnaire', 820], ['Stripe connected', 588], ['First client imported', 640], ['First proposal sent', 452], ['First visit completed in crew app', 431], ['First invoice paid via own Stripe', 409], ['Activated (PA-020)', 401], ['Converted to paid', 158]];
const funnelBars = c => { const f = FUNNEL(c); return h.bars(f.map(([l, v], i) => ({ label: esc(l), value: v, max: f[0][1], tone: i === 7 ? 'accent' : i === 8 ? 'ok' : '', right: `${num(v)} · ${Math.round(100 * v / f[0][1])}%` }))); };
const atRisk = c => allT(c).filter(t => t.health < 40 && t.mrr >= 75 && !['churned', 'trial', 'trial_expired'].includes(t.state)).sort((a, b) => b.mrr - a.mrr);
const riskTable = (c, rows) => h.table([
  { k: 'name', label: 'Tenant', fmt: (v, t) => `<b>${esc(v)}</b><div>${mono(t.tid)}</div>` },
  { k: 'mrr', label: 'MRR', n: true, fmt: (v, t) => bill(c, mrrF(t)) },
  { k: 'health', label: 'Score', n: true, fmt: v => hP(v) },
  { k: 'fac', label: 'Why (top factors)', fmt: v => `<div class="tiny">${v.filter(f => f[0] === '-').slice(0, 2).map(f => esc(f.slice(2))).join('<br>')}</div>` },
  { k: 'csm', label: 'CSM', fmt: v => esc(v) },
], rows, { go: 'console.tenant', dense: true });
const aiSpend = c => {
  const d = c.winter ? [1.12, 1.08, 1.15, 0.94, 0.88, 1.21, 1.18] : [1.42, 1.51, 1.38, 1.61, 1.88, 1.79, 1.94];
  const f = c.winter ? [1.10, 1.10, 1.12, 1.0, 0.95, 1.15, 1.2] : [1.40, 1.45, 1.45, 1.55, 1.6, 1.6, 1.65];
  const lbl = [-6, -5, -4, -3, -2, -1, 0].map(o => day(c, o).replace(/, \d{4}$/, ''));
  return h.colchart(lbl, [{ values: d.map(v => Math.round(v * 1000)), cls: 'cai' }], { money: true, h: 120, line: f.map(v => Math.round(v * 1000)), label: 'AI provider spend per day vs forecast' })
    + `<div class="flex tiny t3"><span><i style="display:inline-block;width:9px;height:9px;border-radius:2px;background:var(--ai-solid)"></i> Provider cost per day</span><span>- - Forecast</span><span class="grow"></span><span>${c.winter ? 'Within 6% of forecast' : 'Today 118% of forecast: TNT-48877 ran 2,300 mockups in 48 h'}</span></div>`;
};
function homeOwner(c) {
  const m = PM(c), pend = APPROVALS.filter(a => !apprState(a.id));
  const brief = c.inLens('V1') ? h.aiCard({ agent: 'Operator Morning Brief', level: 'L1', title: `${esc(c.today.label)}, generated 6:00 am ET`, body: `<ul style="margin:0;padding-left:18px">
      <li>MRR ${m.mrrWk > 0 ? '+' : ''}${money(m.mrrWk)} this week to <b>${money(m.mrr)}</b>; ${m.trials7} trials started, ${m.conv7} converted.</li>
      <li>${c.winter ? '2 tenants moved to past_due; Winter Mode offered to both' : '3 tenants moved to past_due; 1 restricted (Fox Valley Tree & Turf)'}.</li>
      <li>${c.winter ? 'AI spend within 6% of forecast' : 'Mockup spend +18% vs forecast: TNT-48877 ran 2,300 renders in 48 h'}. ${B('Review', { go: 'console.ai', a: { 'data-go': 'console.ai' } })}</li>
      <li>10DLC: 27 approved, 4 rejected (rejection assistant drafted fixes).</li>
      <li>DSARs due within 7 days: 2. Breach clocks open: 0.</li>
      <li>${c.winter ? 'Spring-Ready Guarantee: 9 of 143 tenants at risk' : 'INC-321 QBO sync backlog resolved 3:12 am'}.</li></ul>`, why: 'Narrates numbers from the metrics layer only; every figure links to its dashboard (PA-008, PA-190). Credits: platform-paid.', actions: B('Ask the Operator Copilot', { kind: 'ai', icon: 'spark', a: { 'data-modal': 'cx-copilot' } }) })
    : h.note('The Operator Morning Brief is V1 and hidden by the MVP scope lens.');
  return h.page({ title: 'Command center', sub: `Good morning. ${esc(c.today.label)} · ${esc(m.season)}`, tags: h.tag('MVP') + (c.inLens('V1') ? ' ' + h.tag('V1') + sm(' Morning Brief') : ''),
    actions: B(`Approvals (${pend.length})`, { icon: 'approve', a: { 'data-go': 'console.staff' } }) + B('Tenants', { icon: 'building', a: { 'data-go': 'console.tenants' } }) })
    + h.kpis([
      { label: 'MRR', value: money(m.mrr), delta: `${m.mrrWk > 0 ? '+' : ''}${money(m.mrrWk)} this week`, tone: 'ok' },
      { label: 'Contracted ARR', value: '$' + m.arr.toFixed(2) + 'M', delta: `${num(m.paying)} paying Companies`, tone: '' },
      { label: 'Trials (7 days)', value: `${m.trials7} started`, delta: `${m.conv7} converted`, tone: 'ok' },
      { label: 'Activation (30-day cohort)', value: m.act + '%', delta: `target ${m.actTarget}%`, tone: 'warn' },
      { label: 'AI gross margin (week)', value: m.aiMargin + '%', delta: m.aiDelta, tone: m.aiDelta[0] === '-' ? 'warn' : 'ok', ai: true },
      { label: 'Incidents', value: '1 open', delta: 'SEV3 monitoring', tone: 'warn' },
    ])
    + h.cols('21', [
      `<div class="stack12">${h.card({ title: `Needs you (${pend.length})`, sub: 'Two-person approvals waiting on the founder or the trusted second approver (PA-004)', flush: true, body: h.list(APPROVALS.slice(0, 5).map(a => apprRow(c, a))), actions: B('Approvals inbox', { kind: 'ghost', a: { 'data-go': 'console.staff' } }) })}
      ${h.card({ title: 'Churn risk: red band, MRR $75 and up', sub: 'Rules-based health score, top factors in plain language (PA-013)', flush: true, body: riskTable(c, atRisk(c)) })}
      ${h.card({ title: 'MRR movement', sub: 'Last 8 weeks and the last 7 days', body: mrrChart(c, m) + waterfall(c, m.mv) })}
      ${h.card({ title: 'Trials and activation funnel', sub: 'Last 30 days of signups. Activated = a crew-app visit completed and an invoice paid through the Company\'s own Stripe within 30 days (PA-020)', body: funnelBars(c) })}</div>`,
      `<div class="stack12">${brief}
      ${h.card({ title: 'Incidents', flush: true, body: incList(c), actions: B('System health', { kind: 'ghost', a: { 'data-go': 'console.health' } }) })}
      ${h.card({ title: 'Queue depths', body: h.bars(QUEUES(c)) })}
      ${h.card({ title: 'AI spend vs forecast', sub: 'Provider cost, last 7 days', body: aiSpend(c), tone: c.winter ? '' : 'warn' })}</div>`,
    ]);
}
function homeSupport(c) {
  const stuck = allT(c).filter(t => t.state === 'trial' && t.ms <= 4);
  const tickets = TICKETS(c);
  return h.page({ title: 'Support home', sub: `${esc(c.today.label)} · ${c.winter ? 'Winter Switch season: migrations and Spanish-language onboarding' : 'Peak-hours routing is on: crew_app and routing tickets from 5 to 9 am local jump the queue (PA-060)'}`, actions: B('Global search', { icon: 'search', a: { 'data-go': 'console.support' } }) })
    + h.kpis([{ label: 'Open tickets', value: c.winter ? 61 : 84, delta: c.winter ? '4 near SLA' : '7 near SLA', tone: 'warn' }, { label: 'Median first response', value: c.winter ? '22 min' : '38 min', delta: 'Grow target 4 business hours', tone: 'ok' }, { label: 'CSAT (30 days)', value: '94%', delta: '+2 pts', tone: 'ok' }, { label: 'Active View as sessions', value: 2, delta: 'both read-only', tone: '' }, { label: 'Trials stuck > 5 days', value: stuck.length, delta: 'CSM tasks created', tone: 'warn' }])
    + h.cols('21', [
      `<div class="stack12">${h.card({ title: 'My queue', sub: 'Sorted by SLA, then peak-hours routing', flush: true, body: ticketTable(c, tickets) })}
      ${h.card({ title: 'Trials stuck at a step for more than 5 days', sub: 'In-app nudge already sent. Spanish-first owners get a bilingual CSM (PA-020)', flush: true, body: h.table([{ k: 'name', label: 'Trial', fmt: (v, t) => `<b>${esc(v)}</b> ${mono(t.tid)}` }, { k: 'trialDay', label: 'Trial', fmt: (v, t) => esc(trialInfo(c, t)) }, { k: 'ms', label: 'Milestones', n: true, fmt: v => `${v}/6` }, { k: 'stripe', label: 'Stripe', fmt: v => strP(v) }, { k: 'fac', label: 'Stuck on', fmt: v => `<span class="tiny">${esc((v.find(f => f[0] === '-') || '').slice(2))}</span>` }], stuck, { go: 'console.tenant', dense: true }) })}</div>`,
      `<div class="stack12">${h.card({ title: 'Active access grants', sub: 'Consented, time-boxed (PA-051)', flush: true, body: h.list(GRANTS(c).slice(0, 3).map(g => ({ icon: 'key', tone: g.scope === 'read_write' ? 'warn' : 'info', title: `${esc(g.tenant)} · ${esc(g.scope)}`, sub: `${esc(g.who)} · approved by ${esc(g.by)} · ends ${esc(g.ends)}` }))) })}
      ${h.card({ title: 'Known issues', flush: true, body: h.list(KNOWN(c).slice(0, 3).map(k => ({ icon: 'warn', tone: k.tone, title: esc(k.title), sub: `${k.tenants} tenants · macro ${esc(k.macro)}` }))) })}
      ${h.card({ title: '10DLC fixes waiting', flush: true, body: h.list(allT(c).filter(t => ['brand_failed', 'campaign_rejected'].includes(t.tdlc)).map(t => ({ icon: 'chat', tone: 'danger', title: esc(t.name), sub: `${t.tdlc} · rejection assistant draft ready`, go: 'console.comms' }))) })}
      ${h.note('Client-level search results stay redacted until the Company grants access (PA-050). PII is masked across the console for Support (21 §5.5).')}</div>`,
    ]);
}
function homeCurator(c) {
  return h.page({ title: 'Plant KB home', sub: `${esc(c.today.label)} · Curation queue, publish velocity and plant-quality flags (21 §5.5)`, actions: B('Open curation queue', { kind: 'primary', icon: 'leaf', a: { 'data-go': 'console.kb.queue' } }) })
    + h.banner(`${icon('shield')} Curators never see tenant business data. Tenant signals below are aggregated and anonymized counts (02 §5.13).`, 'info')
    + h.kpis([{ label: 'Curation queue', value: 214, delta: '60 assigned to you', tone: '' }, { label: 'Published this week', value: 412, delta: 'changes across 6 Regions', tone: 'ok' }, { label: 'Source conflicts open', value: 23, delta: '9 on critical traits', tone: 'warn' }, { label: 'Waiting on 2nd curator', value: 9, delta: 'critical traits (PA-070)', tone: 'warn' }, { label: 'Next KB release', value: c.winter ? 'Jan 13' : 'May 12', delta: 'daily, 2:00 am ET', tone: '' }])
    + h.cols('2', [
      h.card({ title: 'Queue by Region', sub: 'AI-drafted records awaiting review', body: h.bars([['Central Ohio', 38], ['Northeast Ohio', 29], ['Southeast Michigan and Toledo', 41], ['West Michigan', 60], ['Chicagoland and Northwest Indiana', 31], ['Southeast Wisconsin', 15]].map(([l, v]) => ({ label: l, value: v, max: 60, right: v }))) })
      + h.card({ title: 'Plant-quality flags', flush: true, body: h.list([
        { icon: 'warn', tone: 'danger', title: 'Rosa rugosa: invasive status conflicts (2 state lists)', sub: 'Critical trait · second curator required' },
        { icon: 'warn', tone: 'warn', title: "Hydrangea paniculata 'Limelight': deer resistance High vs 3 sources Moderate", sub: 'AI check flagged the nursery feed value' },
        { icon: 'flag', tone: 'info', title: '"This plant failed in my area": 4 reports on Leyland cypress (West Michigan)', sub: 'Anonymized tenant feedback, region profile says Not recommended' },
        { icon: 'search', tone: '', title: 'Search misses: "Pawpaw" (31), "Ninebark Tiny Wine" (18)', sub: 'Tenants searched, plant not in KB' },
      ]) }),
      h.card({ title: 'Region completeness', sub: 'Palette plants with full trait sets, images and region profiles (PA-074)', body: h.bars([['Central Ohio', 98], ['Northeast Ohio', 96], ['Southeast Michigan and Toledo', 95], ['West Michigan', 93], ['Chicagoland and Northwest Indiana', 97], ['Southeast Wisconsin', 94], ['Ontario (Wave 2, V1)', 71]].map(([l, v]) => ({ label: l, value: v, max: 100, tone: v < 90 ? 'warn' : '', right: v + '%' }))) })
      + h.card({ title: 'Recent releases', body: h.timeline([{ when: day(c, -1) + ', 2:00 am', text: 'KB 2027.' + (c.winter ? '01.11' : '05.10') + ': 388 trait changes, 2 Region profiles', tone: 'ok' }, { when: day(c, -2) + ', 2:00 am', text: 'KB release: 241 changes, West Michigan v7 republished (1,212 Properties moved)', tone: 'ok' }, { when: day(c, -3), text: 'Takedown: 3 images with expired CC BY-NC license removed in 6 h', tone: 'warn' }]) })
      + h.card({ title: 'Licenses expiring in 30 days', flush: true, body: h.list([{ icon: 'book', title: 'Regional arboretum image set (CC BY 4.0)', sub: '1,140 images · attribution renewal' }, { icon: 'book', title: 'Nursery photo library (commercial license)', sub: '612 images · contract renews ' + day(c, 24) }]) }),
    ]);
}
function homeFinance(c) {
  const m = PM(c), d = DUNNING(c);
  const mine = APPROVALS.filter(a => a.byRole === 'platform_finance');
  return h.page({ title: 'Finance home', sub: `${esc(c.today.label)} · MRR movement, dunning and approvals you are waiting on (21 §5.5)`, actions: B('Billing', { icon: 'receipt', a: { 'data-go': 'console.billing' } }) })
    + h.kpis([{ label: 'MRR', value: money(m.mrr), delta: `${m.mrrWk > 0 ? '+' : ''}${money(m.mrrWk)} this week`, tone: 'ok' }, { label: 'Past due balance', value: money(d.reduce((s, r) => s + r.amt, 0)), delta: `${d.length} tenants in dunning`, tone: 'warn' }, { label: 'Restricted / suspended', value: `${d.filter(r => r.state === 'restricted').length} / ${d.filter(r => r.state === 'suspended').length}`, delta: 'client payments unaffected', tone: '' }, { label: 'Waiting on approval', value: mine.filter(a => !apprState(a.id)).length, delta: 'refunds, prices, holds', tone: 'warn' }, { label: 'Reconciliation mismatches', value: 2, delta: 'invoice finalization held', tone: 'danger' }])
    + h.cols('21', [
      `<div class="stack12">${h.card({ title: 'MRR movement', body: mrrChart(c, m) + waterfall(c, m.mv) })}
      ${h.card({ title: 'Dunning queue', sub: 'Restricted and suspended never block a Company from getting paid (22 §8.2)', flush: true, body: dunTable(c, d.slice(0, 5)), actions: navB('Open dunning queue', 'console.billing', { k: 'cx.bill', v: 'dunning' }) })}</div>`,
      `<div class="stack12">${h.card({ title: 'Your requests waiting on a second approver', flush: true, body: h.list(mine.map(a => apprRow(c, a))) })}
      ${h.card({ title: 'Usage reconciliation', sub: 'Usage and credit ledgers vs Stripe draft invoices (PA-033)', flush: true, body: h.list([{ icon: 'warn', tone: 'danger', title: 'TNT-48477 Pine Ridge Grounds: SMS overage 412 vs 398 segments', sub: 'Finalization held in the draft-invoice window' }, { icon: 'warn', tone: 'danger', title: 'TNT-48990 Two Rivers Irrigation: pack purchase not on draft', sub: '5,000-credit pack, $100 one-time item' }, { icon: 'check', tone: 'ok', title: '1,212 other draft invoices matched', sub: 'Daily job ran 4:00 am ET' }]) })}
      ${h.card({ title: 'Tax and filings', flush: true, body: h.list([{ icon: 'receipt', title: 'Ohio SaaS sales tax return', sub: 'Due ' + day(c, 12) + ' · Stripe Tax report ready' }, { icon: 'receipt', title: 'GST/HST (Ontario tenants)', sub: 'Quarterly · 11 tenants · registration on file' }]) })}
      ${c.inLens('V1') ? h.card({ title: 'Partner commissions ' + h.tag('V1'), body: h.kv([['Accrued this month', money(4186)], ['Due for payout', money(3920) + ' to 9 partners'], ['Clawbacks', '1 (refund within 60 days)']]) + B('Review payouts', { a: { 'data-go': 'console.partners' } }) }) : ''}</div>`,
    ]);
}
function homeEngineer(c) {
  return h.page({ title: 'Health home', sub: `${esc(c.today.label)} · SLOs, queues, integrations and rollouts (21 §5.5)`, actions: B('System health', { icon: 'server', a: { 'data-go': 'console.health' } }) + B('Flags', { icon: 'flag', a: { 'data-go': 'console.flags' } }) })
    + h.kpis([{ label: 'API availability (30 days)', value: '99.96%', delta: 'SLO 99.9%, 61% budget left', tone: 'ok' }, { label: 'Crew sync within 60 s', value: '99.71%', delta: 'SLO 99.5%', tone: 'ok' }, { label: 'Outbox lag (oldest)', value: '2.4 s', delta: 'p99 under 5 s', tone: 'ok' }, { label: 'Open incidents', value: 1, delta: 'SEV3 SMS carrier delay', tone: 'warn' }, { label: 'Deploys today', value: 4, delta: 'canary cell first', tone: '' }])
    + h.cols('21', [
      `<div class="stack12">${h.card({ title: 'Services', flush: true, body: svcTable(c) })}
      ${h.card({ title: 'Integrations with errors (24 h)', flush: true, body: integTable(c, INTEG(c).filter(x => x.err > 0).slice(0, 5)) })}</div>`,
      `<div class="stack12">${h.card({ title: 'Incidents', flush: true, body: incList(c) })}
      ${h.card({ title: 'Rollouts in flight', flush: true, body: h.list(FLAGS(c).filter(f => f.pct > 0 && f.pct < 100).map(f => ({ icon: 'flag', tone: 'info', title: `${mono(f.key)} at ${f.pct}%`, sub: `${esc(f.type)} · guardrails ${f.guard}` }))) })}
      ${h.card({ title: 'Workflows and queues', body: h.bars(WORKFLOWS(c).slice(0, 5).map(w => ({ label: w.name, value: w.run, max: 2000, tone: w.fail > 5 ? 'warn' : '', right: `${num(w.run)} run · ${w.fail} failed` }))) })}</div>`,
    ]);
}
RL.screen('console.home', (c) => {
  if (c.role === 'platform_support') return homeSupport(c);
  if (c.role === 'platform_curator') return homeCurator(c);
  if (c.role === 'platform_finance') return homeFinance(c);
  if (c.role === 'platform_engineer') return homeEngineer(c);
  return homeOwner(c);
});
RL.modal('cx-copilot', (c) => ({ title: 'Operator Copilot', body: h.aiCard({ agent: 'Operator Copilot', level: 'L1', title: 'Ask about platform metrics and metadata, never tenant content', body: 'Examples: "Which snow tenants in Ohio have not registered 10DLC campaigns yet?" "Why did Pine Ridge Grounds\' health score drop?" Write actions come back as action cards you confirm, with the same reason codes and approvals (PA-190).', why: 'Numeric answers come from the metrics layer, not model arithmetic. Platform-paid; no tenant credits.' }) + h.field('Ask', h.input('', { ph: 'Summarize this week\'s churn reasons', label: 'Ask the Operator Copilot' })), foot: B('Close', { big: true, a: { 'data-close': '' } }) }));

// =====================================================================================
// Tenant directory (19 PA-010, §6.8; 21 §5.5)
// =====================================================================================
const VIEWS = [
  ['all', 'All tenants', () => true],
  ['trials', 'Trials day 10-14 without Stripe', t => t.state === 'trial' && t.trialDay >= 10 && t.trialDay <= 14 && t.stripe !== 'on'],
  ['h50', 'Health < 50', t => t.health < 50 && t.state !== 'churned'],
  ['tdlc', '10DLC rejected', t => ['brand_failed', 'campaign_rejected'].includes(t.tdlc)],
  ['due', 'Past due, MRR $300+', t => ['past_due', 'restricted', 'suspended'].includes(t.state) && t.mrr >= 300],
  ['pay', 'Payments not ready', t => ['none', 'req', 'off', 'disc'].includes(t.stripe) && t.plan !== 'archive'],
];
const selSet = () => String(RL.ui['cx.sel'] || '').split(',').filter(Boolean);
const seatsF = t => `${t.office[0]}/${t.office[1]} · ${t.field[0]}/${t.field[1] == null ? '∞' : t.field[1]}`;
RL.screen('console.tenants', (c) => {
  const view = VIEWS.find(v => v[0] === RL.ui['cx.tview']) || VIEWS[0];
  const q = String(RL.ui['cx.tq'] || '').trim().toLowerCase();
  const rows = allT(c).filter(view[2]).filter(t => !q || (t.name + ' ' + t.tid + ' ' + t.city + ' ' + t.region).toLowerCase().includes(q));
  const sel = selSet(), canBulk = !RO(c);
  const selCol = { k: 'id', label: '', fmt: v => { const on = sel.includes(v); const next = on ? sel.filter(x => x !== v) : sel.concat(v); return `<button type="button" class="btn sm ghost" style="padding:1px 5px" data-ui="cx.sel" data-val="${esc(next.join(','))}" aria-pressed="${on}" aria-label="Select">${on ? '☑' : '☐'}</button>`; } };
  const name = { k: 'name', label: 'Tenant', fmt: (v, t) => `<b>${esc(v)}</b>${t.sample ? ' ' + h.pill('sample', 'accent') : ''} ${mono(t.tid)}<div class="tiny t3">${esc(t.city)} · ${esc(t.region)} · active ${ago(t.last)}</div>` };
  const plan = { k: 'plan', label: 'Plan', fmt: (v, t) => esc(planN(v)) + (t.addons && t.addons.length ? `<div class="tiny t3">+ ${t.addons.map(a => esc((I.ADDONS[a] || { name: a }).name)).join(', ')}</div>` : '') };
  const state = { k: 'state', label: 'State', fmt: (v, t) => stP(v) + (trialInfo(c, t) ? `<div class="tiny t3">${esc(trialInfo(c, t))}${t.state === 'trial' ? ` · ${t.ms}/6` : ''}</div>` : t.due ? `<div class="tiny t3">dunning day ${t.due}</div>` : '') };
  const health = { k: 'health', label: 'Health', n: true, fmt: v => hP(v) };
  const mrr = { k: 'mrr', label: 'MRR', n: true, fmt: (v, t) => mrrF(t) };
  const seats = { k: 'office', label: 'Seats office · field', n: true, fmt: (v, t) => `<span class="num">${seatsF(t)}</span>` };
  const integ = { k: 'stripe', label: 'Stripe · 10DLC', fmt: (v, t) => `${strP(v)}<div style="margin-top:2px">${tdP(t.tdlc)}</div>` };
  const csm = { k: 'csm', label: 'CSM', fmt: v => esc(v) };
  let cols;
  if (c.role === 'platform_finance') cols = [name, plan, state, health, mrr, seats, { k: 'coupon', label: 'Discount', fmt: v => v ? `<span class="tiny">${esc(v)}</span>` : '<span class="t3">none</span>' }, { k: 'signup', label: 'Since', fmt: v => esc(day(c, v)) }];
  else if (c.role === 'platform_engineer') cols = [name, plan, state, health, { k: 'cell', label: 'Cell', fmt: (v, t) => mono(v) + `<div class="tiny t3">data: ${t.res === 'ca' ? 'prod-ca' : 'us'}</div>` }, { k: 'ver', label: 'Crew app', fmt: v => `<span class="mono tiny">${esc(v)}</span>${/^2\.1[45]/.test(v) ? ' ' + h.pill('below min 2.16', 'warn') : ''}` }, integ, { k: 'acct', label: 'Accounting', fmt: v => `<span class="tiny">${esc(v)}</span>` }];
  else cols = (canBulk ? [selCol] : []).concat([name, plan, state, health, mrr, seats, integ, csm]);
  const blast = `${sel.length} tenant${sel.length === 1 ? '' : 's'} (dry-run count)`;
  const bulk = canBulk && sel.length ? h.card({ tone: 'warn', body: `<div class="flex"><b>Selected: ${sel.length}</b>
      ${ab(c, 'note', 'Add tag', { t: sel.length + ' tenants', id: 'bulk-tag', blast, audit: 'tenant.tag.add', repeat: true })}
      ${ab(c, 'note', 'Assign CSM', { t: sel.length + ' tenants', id: 'bulk-csm', blast, audit: 'tenant.csm.assign', repeat: true })}
      ${ab(c, 'trial', 'Extend trial', { t: sel.length + ' tenants', id: 'bulk-trial', blast, extra: 'days', audit: 'tenant.trial.extend', sum: 'Bulk trial extension is capped at +30 days. Non-trial tenants in the selection are skipped by the dry run.', repeat: true })}
      ${ab(c, 'beta', 'Enroll in beta', { t: sel.length + ' tenants', id: 'bulk-beta', blast, audit: 'beta.enroll', repeat: true })}
      ${ab(c, 'content', 'Send announcement', { t: sel.length + ' tenants', id: 'bulk-ann', blast, audit: 'announcement.send', repeat: true })}
      ${ab(c, 'export', 'Export CSV', { t: sel.length + ' tenants', id: 'bulk-export', blast, audit: 'data.export', two: !own(c), stepup: true })}
      ${B('Clear', { kind: 'ghost', a: { 'data-ui': 'cx.sel', 'data-val': '' } })}</div><div class="tiny t3">Every bulk action asks for a reason code and shows a dry-run count before it runs. Exports are audited and need export permission.</div>` }) : '';
  const p = PM(c);
  return h.page({ title: 'Tenants', sub: `${num(p.tenants)} tenants · ${num(p.paying)} paying · showing ${rows.length} illustrative rows in view "${esc(view[1])}"`, actions: `<span style="width:240px">${h.input(RL.ui['cx.tq'] || '', { ui: 'cx.tq', ph: 'Name, TNT id, city, Stripe acct_ or cus_', label: 'Search tenants' })}</span>` + B('Columns', { icon: 'sliders', a: { 'data-act': 'cx-cols' } }) })
    + roBanner(c)
    + `<div class="flex">${VIEWS.map(([id, l, f]) => B(`${esc(l)} <span class="t3">${allT(c).filter(f).length}</span>`, { kind: view[0] === id ? 'primary' : '', a: { 'data-ui': 'cx.tview', 'data-val': id } })).join('')}</div>`
    + bulk
    + h.card({ flush: true, body: h.table(cols, rows, { go: 'console.tenant', dense: true, empty: 'No tenants match this view.' }) })
    + `<div class="flex tiny t3"><span>Bands: ${hP(82)} green 70-100 · ${hP(55)} yellow 40-69 · ${hP(31)} red 0-39 (PA-013)</span><span class="grow"></span><span>Search is exact on IDs, emails, E.164 phones and Stripe IDs; typo-tolerant on names (PA-010).</span></div>`;
});
RL.act('cx-cols', () => { RL.toast('Optional columns: AI credits, SMS segments, 10DLC, accounting mode, migration source, partner, billing owner, Winter Mode months, residency, cell, app versions (PA-010).'); return false; });

// =====================================================================================
// Tenant 360 (19 PA-011, §6.3; 21 §18.13): tabs, ledgers, lifecycle dialogs, consented View as user
// =====================================================================================
const FN = ['Javier', 'Marco', 'Luis', 'Hector', 'Ruben', 'Mateo', 'Carlos', 'José', 'Tyler', 'Cody', 'Jake', 'Brandon', 'Eli', 'Omar', 'Pedro', 'Ivan', 'Kevin', 'Nico'];
const LN = ['Ruiz', 'Reyes', 'Vega', 'Salinas', 'Ortiz', 'Cruz', 'Morales', 'Flores', 'Rivera', 'Gómez', 'Torres', 'Ramos', 'Díaz', 'Grant', 'Brandt', 'Méndez'];
const nm = (seed, i) => FN[(seed + i * 7) % FN.length] + ' ' + LN[(seed * 3 + i * 5) % LN.length];
const usersOf = (t) => {
  const order = ['owner', 'office_manager', 'estimator', 'designer', 'ops_manager', 'bookkeeper', 'crew_lead', 'technician'];
  const s = h.hash(t.id);
  let list = t.sample ? Object.entries(t.cast).filter(([r]) => order.includes(r)).sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0])).map(([r, n]) => ({ name: n, role: r }))
    : [{ name: t.owner, role: 'owner' }].concat(t.office[0] > 1 ? [{ name: nm(s, 1), role: 'office_manager' }] : []).concat(t.field[0] > 0 ? [{ name: nm(s, 2), role: 'crew_lead' }, { name: nm(s, 3), role: 'technician' }] : []);
  return list.map((u, i) => Object.assign(u, { id: 'U-' + (2100 + (s % 700) + i), last: i === 0 ? 'today' : ['today', 'yesterday', '2d ago', '6d ago'][(s + i) % 4], mfa: ['owner', 'office_manager', 'bookkeeper'].includes(u.role) ? 'passkey' : u.role === 'crew_lead' || u.role === 'technician' ? 'PIN + device' : 'TOTP', ver: ['crew_lead', 'technician'].includes(u.role) ? (i % 3 === 2 ? '2.15.3' : t.ver) : 'web', lang: ['crew_lead', 'technician'].includes(u.role) ? 'ES' : 'EN', email: String(u.name).toLowerCase().replace(/[^a-z]+/g, '.').replace(/^\.|\.$/g, '') + '@' + t.id + '.example' }));
};
const GRANTS = c => [
  { tenantId: 'hilltop', tenant: 'Hilltop Lawn Co.', scope: 'read_only', who: 'Maya D.', by: 'Gary Lindahl (owner)', ends: c.winter ? 'Jan 14, 3:40 pm' : 'May 13, 3:40 pm', ticket: 'HD-20977', sessions: 1 },
  { tenantId: 'summit', tenant: 'Summit Grounds Group', scope: 'migration', who: 'Luis R.', by: 'Marcus Bell (owner) + Alan Price (bookkeeper co-sign)', ends: c.winter ? 'Jan 21' : 'May 19', ticket: 'MIG-0418', sessions: 0 },
  { tenantId: 'pineridge', tenant: 'Pine Ridge Grounds', scope: 'read_write', who: 'Maya D.', by: 'Rick Dawson (owner)', ends: c.winter ? 'Jan 13, 9:00 am' : 'May 12, 9:00 am', ticket: 'HD-20981', sessions: 2 },
  { tenantId: 'reyes', tenant: 'Reyes Outdoor Living', scope: 'standing read-only consent', who: 'any support agent', by: 'Dana Reyes (owner), reconfirmed ' + (c.winter ? 'Dec 2' : 'Apr 2'), ends: 'until revoked (90-day reconfirm)', ticket: '-', sessions: 0 },
];
const grantOf = (c, t) => { const s = RL.ui['cx.grant.' + t.id]; if (s) return s; const g = GRANTS(c).find(x => x.tenantId === t.id); return g ? 'active' : 'none'; };
const alertsOf = (c, t) => {
  const a = [];
  if (t.stripe === 'req') a.push(['warn', 'Stripe: 1 requirement due in 6 days (company.tax_id verification)', 'Nudge owner']);
  if (t.stripe === 'disc') a.push(['danger', 'Stripe deauthorized 5 days ago: portal shows "Contact us to pay"', 'CSM task']);
  if (t.stripe === 'none') a.push(['warn', 'Stripe not connected: client payments are off until the owner connects their own account', 'Send guide']);
  if (['brand_failed', 'campaign_rejected'].includes(t.tdlc)) a.push(['danger', `10DLC ${t.tdlc}: rejection assistant has a fix ready`, 'Open in Comms']);
  if (/^2\.1[45]/.test(t.ver)) a.push(['warn', `Crew app ${t.ver} on 3 devices (minimum 2.16)`, 'Send update macro']);
  if (t.due) a.push(['danger', `Rootline invoice unpaid, dunning day ${t.due} (${t.state}). Client payments keep working`, 'Dunning']);
  if (t.hold) a.push(['info', `Legal hold ${t.hold} active: deletion and retention jobs suspended`, 'Compliance']);
  if (t.state === 'trial') a.push(['info', `Trial ${trialInfo(c, t)}; ends ${day(c, t.trialLen - t.trialDay)}`, 'Extend']);
  if (t.ai > (I.PLANS[t.plan].ai_credits || 500) * 0.8) a.push(['warn', `AI credits at ${Math.round(100 * t.ai / (I.PLANS[t.plan].ai_credits || 500))}% of included`, 'Grant credits']);
  if (!a.length) a.push(['ok', 'No active alerts', '']);
  return a;
};
const MILESTONES = ['Company profile complete', 'Stripe connected (charges_enabled)', 'Logo and portal branding', 'Price book seeded', 'First client and property', 'First estimate or proposal', 'First visit scheduled', 'Crew app installed by a crew lead', 'First invoice sent', 'First payment collected', 'Accounting mode chosen', '10DLC submitted'];
const msDone = t => t.state === 'trial' || t.state === 'trial_expired' ? Math.round(t.ms * 2) : t.field[1] === 0 ? 10 : 12;
const seasonality = (c, t) => {
  const w = [12, 14, 40, 180, 236, 244, 238, 230, 210, 160, 70, 20];
  const sc = Math.max(0.2, t.field[0] / 20);
  const now = c.winter ? 0 : 4;
  const ty = w.map((v, i) => i <= now ? Math.round(v * sc * (t.health > 50 ? 1.04 : 0.62)) : 0);
  const ly = t.signup < -365 ? w.map(v => Math.round(v * sc)) : w.map(() => 0);
  return h.colchart(MON, [{ values: ty, cls: 'c1' }, { values: ly, cls: 'c2' }], { h: 110, label: 'Visits completed per month, this year vs last year' }) + `<div class="flex tiny t3"><span><i style="display:inline-block;width:9px;height:9px;border-radius:2px;background:var(--primary)"></i> This year</span><span><i style="display:inline-block;width:9px;height:9px;border-radius:2px;background:var(--sky-500)"></i> Last year</span>${c.inLens('V1') ? `<span class="grow"></span><span>${h.tag('V1')} Seasonality-adjusted against the ${esc(t.region)} cohort curve</span>` : ''}</div>`;
};
const planIncl = t => I.PLANS[t.plan].ai_credits || 500;
const creditLedger = (c, t) => {
  const inc = planIncl(t), d0 = c.winter ? -11 : -10;
  let bal = 0; const rows = [];
  const add = (off, what, delta, note, kind) => { if (kind !== 'hold') bal += delta; rows.push({ id: 'CRL-' + (88100 + h.hash(t.id + what + off) % 9000), when: day(c, off), what, delta, note, bal: kind === 'hold' ? null : bal, kind }); };
  add(d0, `Included credits, ${planN(t.plan)} (${c.winter ? 'Jan' : 'May'})`, inc, 'Expires at period end, no rollover');
  add(d0 + 2, 'Hold: photo mockup set (4 variants)', -40, 'Quoted before run, L1', 'hold');
  add(d0 + 2, 'Settle: photo mockup set', -40, 'Hold settled on success');
  add(d0 + 3, 'Hold: dimension-aware layout', -60, 'Quoted before run', 'hold');
  add(d0 + 3, 'Released: provider timeout', 0, 'Hold released in full (rule 3)', 'rel');
  add(d0 + 4, 'Unusable mockup refund (50%)', 20, 'Reason code: wrong plants; 1 of 10 this month (rule 4)');
  add(d0 + 6, `Inbox triage, ${num(214)} messages at 0.5`, -107, 'Fractional credits settled daily, rounded up');
  add(d0 + 8, 'Estimate drafts (x18 at 8)', -144, 'estimate.draft');
  add(-1, `Copilot and drafting (x${Math.max(1, t.ai - 371)})`, -Math.max(1, t.ai - 371), 'Mostly small-model routes');
  if (t.ai > inc * 0.7) add(-1, 'Pack purchased: 5,000 credits ($100)', 5000, 'FIFO after included; expires ' + day(c, 364));
  return rows;
};
const seatRows = (c, t) => { const s = h.hash(t.id), n = Math.min(7, t.field[0]); const trig = ['Crew app sign-in', 'Clock-in', 'On crew of visit V-58' + (810 + s % 90) + ' (completed)', 'Clock-in', 'Crew app sign-in', 'Token refresh only (stale device)', 'On crew of visit (in_progress)']; return Array.from({ length: n }, (_, i) => ({ id: 'U-' + (2200 + i + s % 300), user: nm(s, i + 4), role: i === 0 ? 'crew_lead' : 'technician', trigger: trig[i % trig.length], when: day(c, -1 - (i * 3) % 9), dispute: trig[i % trig.length].startsWith('Token') })); };
const sparkH = t => h.spark(Array.from({ length: 26 }, (_, i) => Math.max(5, t.health + Math.round(Math.sin((i + h.hash(t.id) % 7) / 2.2) * 6) + (t.health < 40 ? Math.round((26 - i) * 1.4) : 0))));
const mrrBreak = (c, t) => {
  const p = I.PLANS[t.plan]; if (t.state === 'trial' || t.state === 'trial_expired') return `Trial, no Rootline invoice yet${t.plan === 'grow' ? ' (Grow features)' : ''}`;
  const base = p.annual || p.monthly || 0;
  const xo = Math.max(0, t.office[0] - (p.office_seats || 0)), xf = t.field[1] == null ? 0 : Math.max(0, t.field[0] - t.field[1]);
  return `${money(t.mrr)} = ${t.coupon ? money(Math.round(base * .75)) + ' base after Founding 25%' : money(base) + ' base'}${xo ? ` + ${xo} extra office (${money(xo * (p.extra_office || 35))})` : ''}${xf ? ` + ${xf} field over allowance (${money(xf * (p.extra_field || 8))})` : ''}${(t.addons || []).length ? ' + add-ons' : ''}`;
};
RL.screen('console.tenant', (c) => {
  const t = findT(c, c.x);
  const ro = RO(c), g = grantOf(c, t), sess = RL.ui['cx.sess.' + t.id];
  const owner = t.owner || 'the owner';
  const tabsL = [['overview', 'Overview'], ['usage', 'Usage'], ['billing', 'Billing'], ['ai', 'AI'], ['payments', 'Payments'], ['users', 'Users', usersOf(t).length], ['support', 'Support'], ['flags', 'Flags'], ['audit', 'Audit'], ['data', 'Data and compliance'], ['danger', 'Danger zone']]
    .filter(([id]) => !(c.role === 'platform_engineer' && id === 'billing') && !(c.role === 'platform_finance' && id === 'flags'));
  const [tb, cur] = tabsN('cx.t360', tabsL);
  const accessTxt = g === 'active' ? h.pill('Access: ' + ((GRANTS(c).find(x => x.tenantId === t.id) || { scope: 'read_only' }).scope) + ' grant active', 'ok') : g === 'requested' ? h.pill(`Access: requested, waiting on ${esc(owner)} (owner)`, 'warn') : h.pill('Access: none (metadata only)', '');
  const lifecycle = [
    ['trial', 'trial_expired'].includes(t.state) ? ab(c, 'trial', 'Extend trial', { t: t.name, extra: 'days', audit: 'tenant.trial.extend', icon: 'clock', hide: true }) : '',
    ['past_due', 'restricted'].includes(t.state) ? ab(c, 'suspend_pay', 'Suspend for non-payment', { t: t.name, audit: 'tenant.lifecycle.suspend', hide: true, sum: `Office users become read-only except invoicing, payments and AR. The Customer Portal stays up so clients still pay into ${t.name}'s own Stripe. Crew app read-only after the current visit${c.winter && t.snow ? '; snow carve-out keeps dispatch for up to 72 hours per event' : ''}.` }) : '',
    ['past_due', 'restricted', 'suspended', 'churned', 'pending_cancellation'].includes(t.state) ? ab(c, 'reactivate', 'Reactivate', { t: t.name, audit: 'tenant.lifecycle.reactivate', hide: true, icon: 'refresh' }) : '',
  ].join('');
  const viewAs = can(c, 'access', { evenRO: true }) !== '-' ? (g === 'active' ? B('View as user', { kind: 'primary', icon: 'eye', a: { 'data-ui': 'cx.t360', 'data-val': 'support' } }) : g === 'requested' ? '' : B('Request access', { icon: 'key', a: { 'data-modal': 'cx-grant', 'data-tn': t.id } })) : '';
  const head = h.page({ crumbs: [['Tenants', 'console.tenants'], [esc(t.name)]], title: `<span class="logo" style="display:inline-grid;place-items:center;width:30px;height:30px;border-radius:8px;background:${t.sample ? esc(I.TENANTS[t.id].brand.color) : 'var(--stone-600)'};color:#fff;font:800 .72rem var(--font-body);vertical-align:middle;margin-right:6px">${esc(h.initials(t.name))}</span>${esc(t.name)}`,
    sub: `${mono(t.tid)} · ${esc(planN(t.plan))}${(t.addons || []).length ? ' + ' + t.addons.map(a => esc((I.ADDONS[a] || { name: a }).name)).join(' + ') : ''} · ${esc(t.city)} · Region ${esc(t.region)} · since ${esc(day(c, t.signup))} · data ${t.res === 'ca' ? 'prod-ca' : 'US'}`,
    tags: `${stP(t.state)}${trialInfo(c, t) ? sm(esc(trialInfo(c, t))) : ''} <span class="flex nw gap4">Health ${hP(t.health)} ${sparkH(t)}</span> <span>MRR <b>${bill(c, mrrF(t))}</b></span> <span class="t2">Owner ${esc(owner)} · CSM ${esc(t.csm)}${t.partner ? ' · Partner ' + esc(t.partner) : ''}</span> ${accessTxt}`,
    actions: viewAs + lifecycle + ab(c, 'note', 'Add note', { t: t.name, audit: 'tenant.note.create', hide: true, icon: 'pen', repeat: true }) });
  const sessBar = sess ? `<div style="background:var(--clay-500);color:#fff;padding:8px 12px;border-radius:8px;font-weight:700;display:flex;gap:10px;align-items:center;flex-wrap:wrap">${icon('eye')}ROOTLINE SUPPORT (${esc(c.who)}) is viewing as ${esc(sess)} · READ-ONLY · ends ${c.winter ? '10:52 am' : '10:52 am'} (60 min session cap) <span class="grow"></span>${B('End session', { a: { 'data-act': 'cx-endsess', 'data-tn': t.id } })}</div>` : '';
  let body = '';
  if (cur === 'overview') body = t360Overview(c, t);
  else if (cur === 'usage') body = t360Usage(c, t);
  else if (cur === 'billing') body = t360Billing(c, t);
  else if (cur === 'ai') body = t360AI(c, t);
  else if (cur === 'payments') body = t360Payments(c, t);
  else if (cur === 'users') body = t360Users(c, t);
  else if (cur === 'support') body = t360Support(c, t, g, sess);
  else if (cur === 'flags') body = t360Flags(c, t);
  else if (cur === 'audit') body = t360Audit(c, t);
  else if (cur === 'data') body = t360Data(c, t);
  else body = t360Danger(c, t);
  const redact = h.note('Client names, addresses, invoice lines and designs are never shown in Tenant 360: counts and statuses only. Viewing records needs an active grant and a View as user session (PA-011).');
  return head + roBanner(c) + sessBar + tb + body + redact;
});
function t360Overview(c, t) {
  const al = alertsOf(c, t), md = msDone(t), p = I.PLANS[t.plan];
  return h.cols('21', [
    `<div class="stack12">${h.card({ title: 'Alerts', flush: true, body: h.list(al.map(([tone, txt, act]) => ({ icon: tone === 'ok' ? 'check' : 'warn', tone, title: esc(txt), right: act ? `<span class="tiny t3">${esc(act)}</span>` : '' }))) })}
    ${h.card({ title: `Activation checklist ${md}/12`, sub: 'System-detected milestones (PA-020)', body: `<div class="cols cols-2" style="gap:4px 14px">${MILESTONES.map((m, i) => `<div class="tiny">${i < md ? `<span style="color:var(--ok-text)">${icon('check', 's')}</span>` : `<span class="t3">${icon('clock', 's')}</span>`} ${esc(m)}</div>`).join('')}</div>` })}
    ${h.card({ title: 'Seasonality', sub: 'Visits completed per month', body: seasonality(c, t) })}</div>`,
    `<div class="stack12">${h.card({ title: `Health ${t.health} (${bandOf(t.health)})`, sub: 'Model health-v1.3 rules, recomputed nightly', body: `<div class="flex">${hP(t.health)} ${sparkH(t)} <span class="tiny t3">26 weeks</span></div>` + h.list(t.fac.map(f => ({ icon: f[0] === '+' ? 'check' : 'warn', tone: f[0] === '+' ? 'ok' : 'warn', title: esc(f.slice(2)) }))) })}
    ${h.card({ title: 'Account signals', body: h.kv([['NPS', t.nps != null ? String(t.nps) : 'not asked yet'], ['Tickets (30 days)', String(t.tickets)], ['Churn risk', t.health < 40 ? '<b style="color:var(--danger-text)">High</b>' : t.health < 60 ? 'Medium' : 'Low'], ['Expansion', t.plan === 'grow' && t.field[0] > 12 ? 'Pro fit: field overage 3 months running' : (t.addons || []).includes('snow_ice') ? 'Snow & Ice active' : 'Snow & Ice module trial candidate'], ['Segment', mono('segment:' + t.seg)]]) })}
    ${h.card({ title: 'SaaS billing', body: h.kv([['MRR', bill(c, esc(mrrBreak(c, t)))], ['Interval', bill(c, p.annual ? 'Annual (price lock to ' + day(c, t.signup + 730) + ')' : 'Monthly')], ['Next invoice', bill(c, day(c, c.winter ? 20 : 21))], ['Card on file', bill(c, t.due ? '<span style="color:var(--danger-text)">Visa 4242, declined</span>' : 'Visa •••• 4242, current')]]) })}
    ${h.card({ title: 'Integrations', body: h.kv([['Stripe Connect', strP(t.stripe) + ' ' + tech(c, mono('acct_1P' + t.tid.slice(4) + '…'))], ['Accounting', esc(t.acct)], ['10DLC', tdP(t.tdlc)], ['Crew app', tech(c, mono(t.ver))], ['Cell', tech(c, mono(t.cell))]]) })}
    ${t.note ? h.card({ title: 'Pinned note', body: `<div class="small">${esc(t.note)}</div><div class="tiny t3">Visibility: all staff · pinned by ${esc(t.csm === '-' ? 'Maya D.' : t.csm)}</div>` }) : ''}</div>`,
  ]);
}
function t360Usage(c, t) {
  const p = I.PLANS[t.plan], s = Math.max(1, t.field[0]);
  const wau = [['Office (owner, office manager, estimator)', t.office[0], t.office[1]], ['Designers', t.plan === 'pro' ? 3 : t.plan === 'design_solo' ? 1 : 1, p.designer_seats || 1], ['Field (crew lead, technician)', t.field[0], t.field[1] || t.field[0]]];
  return h.kpis([{ label: 'Visits (30 days)', value: num(s * (c.winter ? 9 : 132)) }, { label: 'Invoices issued', value: num(Math.round(s * (c.winter ? 7 : 41))) }, { label: 'Proposals sent', value: num(Math.round(s * 2.4)) }, { label: 'Designs created', value: num(t.plan === 'starter' ? 0 : Math.round(s * .8) + 2) }, { label: 'API calls (30 days)', value: tech(c, num(s * 1840)) }])
    + h.cols('2', [
      h.card({ title: 'Weekly active users by role', body: h.bars(wau.map(([l, a, b]) => ({ label: l, value: a, max: Math.max(a, b || 1), right: `${a} of ${b || a}` }))) + h.note('Office roles weigh more than field in winter (PA-013 engagement).') })
      + h.card({ title: 'Modules used (entitled)', body: `<div class="flex">${['Scheduling', 'Invoicing', 'Portal', 'Crew app', 'Ledger', 'Design Studio', 'Campaigns', 'Lawn programs', 'Snow Lite'].map((m, i) => h.pill(esc(m), (i + h.hash(t.id)) % 4 === 0 ? '' : 'ok')).join('')}</div>` }),
      h.card({ title: 'Meters this period', body: [
        h.meter('AI credits', t.ai, planIncl(t), { unit: 'cr' }),
        h.meter('SMS segments', t.sms, p.sms || 0),
        h.meter('Storage', Math.round(s * 4.2), p.storage_gb || 1000, { unit: 'GB' }),
        h.meter('Parcel lookups', Math.round(s * 9), { starter: 100, grow: 500, pro: 2000 }[t.plan] || 2000),
        h.meter('Active field seats', t.field[0], t.field[1] == null ? null : t.field[1]),
      ].join('') + h.note('Field activity is never blocked for seat reasons; the owner is told at 80% and 100% (PA-031).') }),
    ]);
}
function t360Billing(c, t) {
  const p = I.PLANS[t.plan], led = seatRows(c, t);
  const inv = Array.from({ length: 4 }, (_, i) => ({ id: 'RLI-' + (40210 + (h.hash(t.id) % 900) + i), when: day(c, -30 * i - 10), amt: t.mrr ? Math.round(t.mrr * (i === 0 ? 1 : 0.96 + i * .01)) : 0, st: i === 0 && t.due ? 'open, failed ' + (t.due > 13 ? '4x' : '3x') : 'paid' }));
  return (t.due ? h.banner(`${icon('warn')} Dunning day ${t.due} (${t.state}). Restricted and suspended never block ${esc(t.name)} from getting paid: invoicing, portal payments into its own Stripe and the Ledger keep working (22 §8.2).`, 'warn') : '')
    + h.cols('2', [
      h.card({ title: 'Subscription', body: h.kv([['Plan', `${esc(p.name)} · price version ${t.plan === 'pro' ? '2027.1' : '2026.4'}`], ['Interval', p.annual ? 'Annual prepaid' : 'Monthly'], ['MRR', esc(mrrBreak(c, t))], ['Add-ons', (t.addons || []).length ? t.addons.map(a => esc((I.ADDONS[a] || { name: a }).name) + (a === 'snow_ice' ? (c.winter ? ' (billing Nov-Mar)' : ' <span class="t3">(dormant until Nov 1)</span>') : '')).join(', ') : 'none'], ['Discount', esc(t.coupon || 'none')], ['Payment method', t.due ? 'Visa 4242, declined (card updater on)' : 'Visa •••• 4242 on Rootline\'s own Stripe'], ['Currency', t.cur], ['Billing owner', 'direct']]) + `<div class="flex">${ab(c, 'credits', 'Apply account credit', { t: t.name, extra: 'amount', audit: 'billing.account_credit', hide: true })}${ab(c, 'refund', 'Refund a charge', { t: t.name, extra: 'amount', audit: 'billing.refund', hide: true, sum: 'Monthly plans are not refunded; annual plans carry a 30-day money-back guarantee. Over $1,000 needs a second approver (PA-037).' })}${t.due ? ab(c, 'suspend_pay', 'Grace +14 days', { t: t.name, id: 'grace', audit: 'billing.dunning.grace', hide: true, sum: 'Extends past_due by up to 14 days, once per 12 months (22 §8.2).' }) : ''}</div>` })
      + h.card({ title: 'Rootline invoices', flush: true, body: h.table([{ k: 'id', label: 'Invoice', m: true }, { k: 'when', label: 'Date' }, { k: 'amt', label: 'Amount', n: true, fmt: v => money(v) }, { k: 'st', label: 'Status', fmt: v => h.pill(esc(v), v === 'paid' ? 'ok' : 'danger') }], t.mrr ? inv : [], { dense: true, empty: 'No Rootline invoices yet (trial).' }) }),
      h.card({ title: 'Seat ledger', sub: `Field seats count on activity in the period (22 §4.3). Billed: max(0, active - ${t.field[1] == null ? 'unlimited' : t.field[1]})`, flush: true, body: h.table([{ k: 'user', label: 'Field user', fmt: (v, r) => `${esc(v)} ${mono(r.id)}` }, { k: 'role', label: 'Role', fmt: v => mono(v) }, { k: 'trigger', label: 'Counted because', fmt: (v, r) => r.dispute ? `<span style="color:var(--warn-text)">${esc(v)}</span>` : esc(v) }, { k: 'when', label: 'Event' }, { k: 'dispute', label: '', fmt: (v, r) => v ? ab(c, 'seat', 'Remove from count', { t: r.user, audit: 'billing.seat.adjust', hide: true, sum: `${r.user} counted only because of a stale token refresh. Remove with reason billing_adjustment.` }) : '' }], led, { dense: true, empty: 'No field users counted this period.' })
        + `<div class="cd-b tiny t3">Office seats billed on the peak of enabled users: ${t.office[0]} (included ${t.office[1]}). Shared-login signal (one field user on 3+ devices 15+ km apart) is a CSM signal only, never auto-billed.</div>` }),
    ]);
}
function t360AI(c, t) {
  const rows = creditLedger(c, t), inc = planIncl(t), bal = rows.filter(r => r.bal != null).slice(-1)[0].bal;
  const cost = Math.round(t.ai * 0.0068 * 100) / 100, rev = Math.round(t.ai * 0.021 * 100) / 100;
  return h.kpis([{ label: 'Credit balance', value: num(bal), delta: `${num(inc)} included this period`, ai: true }, { label: 'Used this period', value: num(t.ai), delta: Math.round(100 * t.ai / inc) + '% of included', tone: t.ai > inc * .8 ? 'warn' : '' }, { label: 'Provider cost', value: bill(c, money(cost, { cents: true })), delta: 'AI Gateway, this period' }, { label: 'Credit revenue (alloc.)', value: bill(c, money(rev, { cents: true })), delta: `margin ${Math.round(100 * (1 - cost / Math.max(rev, .01)))}%`, tone: 'ok' }])
    + h.cols('21', [
      h.card({ title: 'Credit ledger', sub: 'Append-only, balance_after on every entry, reconciled daily with Stripe (22 §4.4.1 rule 9)', flush: true, body: h.table([{ k: 'id', label: 'Entry', m: true }, { k: 'when', label: 'Date' }, { k: 'what', label: 'Event', fmt: (v, r) => esc(v) + `<div class="tiny t3">${esc(r.note)}</div>` }, { k: 'delta', label: 'Credits', n: true, fmt: (v, r) => r.kind === 'hold' ? `<span class="t3">hold ${num(v)}</span>` : r.kind === 'rel' ? '<span class="t3">released</span>' : (v > 0 ? '+' : '') + num(v) }, { k: 'bal', label: 'Balance after', n: true, fmt: v => v == null ? '' : num(v) }], rows, { dense: true }) }),
      h.card({ title: 'Rules applied', body: `<ol class="tiny" style="margin:0;padding-left:16px;display:grid;gap:3px"><li>Included credits first, then packs FIFO by expiry.</li><li>Included credits expire at period end; packs after 12 months.</li><li>Hold on start; settle on success; full release on failure, refusal or timeout.</li><li>"Unusable" within 10 minutes refunds 50%, max 10 per user per month.</li><li>Owner caps per user and role; alerts at 50, 80, 100%.</li><li>Auto top-up ${t.ai > inc * .7 ? '<b>on</b>, ceiling 2 per month' : 'off (default)'}.</li><li>Trials: 500 credits, no top-up.</li></ol>` })
      + h.card({ title: 'Credits by feature', body: h.bars([['Copilot and drafting', .34], ['Photo mockups', .28], ['Estimate drafts', .17], ['Inbox triage', .12], ['Layouts and plant palettes', .09]].map(([l, f]) => ({ label: l, value: Math.round(t.ai * f), max: t.ai || 1, tone: 'ai', right: num(Math.round(t.ai * f)) }))) })
      + h.card({ body: `<div class="flex">${ab(c, 'credits', 'Grant credits', { t: t.name, extra: 'credits', audit: 'billing.credit_grant', hide: true, icon: 'spark' })}${ab(c, 'kill', 'Tenant AI kill switch', { t: t.name, audit: 'ai.kill_switch.tenant', hide: true, two: false, sum: 'Turns AI off for this tenant within 15 seconds. In-flight durable jobs pause and resume when re-enabled (PA-095).' })}</div>` }),
    ]);
}
function t360Payments(c, t) {
  const on = t.stripe === 'on' || t.stripe === 'req';
  return h.banner(`${icon('shield')} Metadata only. No charge, refund, payout or dispute-response actions exist here, by design: client money sits in ${esc(t.name)}'s own Stripe account (19 §4.11, §6.10).`, 'info')
    + h.cols('2', [
      h.card({ title: 'Connected account', body: h.kv([['Account', mono('acct_1P' + t.tid.slice(4) + '…' + t.id.slice(0, 3).toUpperCase())], ['Method', mono(t.plan === 'enterprise' ? 'oauth' : t.id.length % 3 === 0 ? 'account_link' : 'oauth') + ' · ' + mono('v1_controller')], ['Country', t.country], ['charges_enabled', on ? h.pill('true', 'ok') : h.pill('false', 'danger')], ['payouts_enabled', on ? h.pill('true', 'ok') : h.pill('false', 'danger')], ['requirements.currently_due', t.stripe === 'req' ? '1 (company.tax_id)' : '0'], ['current_deadline', t.stripe === 'req' ? day(c, 6) : '-'], ['disabled_reason', t.stripe === 'disc' ? 'account.application.deauthorized' : t.stripe === 'none' ? 'not connected' : '-'], ['Last account.updated', on ? day(c, -2) + ', 4:12 pm' : '-'], ['Capabilities', on ? 'card, us_bank_account (ACH), Apple Pay, Google Pay' : '-']])
        + `<div class="flex">${ab(c, 'safe', 'Nudge owner', { t: t.name, audit: 'payments.nudge_owner', hide: true, repeat: true, sum: `In-app and email nudge to ${t.owner || 'the owner'} with a deep link to Stripe's hosted update flow.` })}${ab(c, 'safe', 'Replay Stripe event by ID', { t: t.name, id: 'replay', audit: 'payments.webhook.replay', hide: true, repeat: true, sum: 'Re-fetches the event from the Stripe API; stored payloads are never trusted (PA-112).' })}</div>` }),
      h.card({ title: 'Volume via Rootline (30 days)', body: on ? h.kv([['Charges created', bill(c, num(Math.max(1, t.field[0]) * 38))], ['Volume', bill(c, money(Math.max(1, t.field[0]) * 6120))], ['Card vs ACH', '61% / 39%'], ['Success rate', '98.4%'], ['Portal autopay adoption', '58% of recurring clients'], ['Dispute rate (90 d)', t.id === 'pineridge' ? h.pill('0.82%: CSM alert', 'warn') : '0.12%'], ['Application fee', '$0.00 (not opted in)']]) : h.empty('No connected account. The owner connects their own Stripe; Rootline never holds the funds.') })
      + h.card({ title: 'Webhooks for this account', body: h.kv([['/webhooks/stripe/connect', on ? 'last event 6 min ago · 0 in DLQ' : '-'], ['/webhooks/stripe/v2', on ? 'thin events re-fetched · ok' : '-'], ['Signature failures (24 h)', '0']]) }),
    ]);
}
function t360Users(c, t) {
  return h.card({ title: 'Users', sub: 'No password viewing, ever (we do not have them). Support PIN rotates every 24 hours (PA-061)', flush: true, body: h.table([
    { k: 'name', label: 'User', fmt: (v, u) => `<b>${esc(v)}</b> ${mono(u.id)}<div class="tiny">${pii(c, esc(u.email))}</div>` },
    { k: 'role', label: 'Role', fmt: v => mono(v) },
    { k: 'last', label: 'Last login' },
    { k: 'mfa', label: 'MFA' },
    { k: 'ver', label: 'App', fmt: v => tech(c, `<span class="mono tiny">${esc(v)}</span>`) },
    { k: 'lang', label: 'Lang' },
    { k: 'id', label: '', fmt: (v, u) => `<div class="flex nw gap4">${ab(c, 'safe', 'Resend invite', { t: u.name, id: 'invite', audit: 'tenant.user.invite.resend', hide: true, repeat: true })}${ab(c, 'safe', 'Force logout', { t: u.name, id: 'logout', audit: 'tenant.user.sessions.revoke', hide: true, repeat: true })}${ab(c, 'safe', 'Reset MFA', { t: u.name, id: 'mfa', audit: 'tenant.user.mfa.reset', hide: true, sum: 'Requires the owner to confirm through an emailed link. Phone requests need the support PIN (PA-061).' })}</div>` },
  ], usersOf(t), { dense: true }) });
}
function t360Support(c, t, g, sess) {
  const gr = GRANTS(c).find(x => x.tenantId === t.id) || { scope: 'read_only', who: c.who, by: (t.owner || 'owner') + ' (owner)', ends: c.winter ? 'Jan 15, 3:40 pm' : 'May 14, 3:40 pm', ticket: 'HD-21004' };
  const users = usersOf(t);
  let access;
  if (g === 'none') access = `<p class="small">No grant. You see metadata only (02 §5.13). ${esc(t.owner || 'The owner')} must approve a time-boxed grant before anyone views records.</p><div class="flex">${can(c, 'access', { evenRO: true }) !== '-' ? B('Request access', { kind: 'primary', icon: 'key', a: { 'data-modal': 'cx-grant', 'data-tn': t.id } }) : '<span class="tiny t3">Your role cannot request access.</span>'}${ab(c, 'breakglass', 'Break-glass', { t: t.name, audit: 'support.breakglass', hide: true, stepup: true, two: true, sum: 'Without tenant consent: only for a verified locked-out owner, fraud, legal process or a security incident. 30-120 minutes, read-only, recorded, tenant notified within 24 hours (PA-053).' })}</div>`;
  else if (g === 'requested') access = `<p class="small">Request sent to <b>${esc(t.owner || 'the owner')}</b> (owner): in-app, email. Approval needs their MFA.</p><div class="flex">${B('Simulate owner approval (mock)', { a: { 'data-act': 'cx-grant-ok', 'data-tn': t.id } })}${B('Withdraw', { kind: 'ghost', a: { 'data-act': 'cx-grant-no', 'data-tn': t.id } })}</div>`;
  else access = h.kv([['Scope', mono(gr.scope)], ['Who', esc(gr.who)], ['Approved by', esc(gr.by)], ['Ends', esc(gr.ends)], ['Ticket', mono(gr.ticket)]])
    + (can(c, 'access', { evenRO: true }) === '-' || c.role === 'platform_finance' ? '<span class="tiny t3">Your role cannot start View as user sessions.</span>' : sess ? `<p class="small">Session running as <b>${esc(sess)}</b>.</p>`
      : `<div class="flex">${h.select(users.filter(u => u.role !== 'owner' || gr.by.includes('owner')).map(u => [u.name + ' (' + u.role + ')', `${u.name} (${u.role})`]), RL.ui['cx.vaU'] || '', { ui: 'cx.vaU', label: 'User to view as' })}${B('Start View as user', { kind: 'primary', icon: 'eye', a: { 'data-act': 'cx-viewas', 'data-tn': t.id, 'data-u': `${users[Math.min(1, users.length - 1)].name} (${users[Math.min(1, users.length - 1)].role})` } })}</div><div class="tiny t3">Role ceiling: you can view as users at or below the approver's role. Read-only blocks writes at the API layer.</div>`);
  const sessView = sess ? h.card({ title: `What ${esc(sess)} sees`, sub: 'Rendered with that user\'s permissions, never more', body: viewAsMock(c, t, sess) }) : '';
  return h.cols('2', [
    `<div class="stack12">${h.card({ title: 'Support access', sub: 'Consent-based, time-boxed, logged to the tenant\'s Support Access Log (PA-051, PA-054)', body: access })}${sessView}
    ${h.card({ title: 'Hard limits in every session', body: `<ul class="tiny" style="margin:0;padding-left:16px"><li>No credentials, MFA, owner, Stripe, bank feed or API key changes.</li><li>No messages to clients unless read_write and a second confirmation.</li><li>No charges or refunds, no bulk export, no employee_pii or vendor_banking.</li><li>Deletes are soft and flagged "deleted by Rootline Support". Tenant Copilot is off.</li></ul>` })}</div>`,
    `<div class="stack12">${h.card({ title: 'Tickets', flush: true, body: h.table([{ k: 0, label: 'Ticket', m: true }, { k: 1, label: 'Subject' }, { k: 2, label: 'State', fmt: v => h.pill(v, v === 'open' ? 'warn' : 'ok') }], t.tickets ? [['HD-21' + (h.hash(t.id) % 900 + 100), alertsOf(c, t)[0][1].split(':')[0], 'open'], ['HD-20' + (h.hash(t.id) % 900 + 100), 'Crew app sync pending on one device', 'solved']].slice(0, Math.max(1, Math.min(2, t.tickets))) : [], { dense: true, empty: 'No tickets in 30 days.' }) })}
    ${h.card({ title: 'Access log (what the owner sees)', body: h.timeline([{ when: day(c, -21), text: 'Maya D. · read_only · 14 min · viewed 9 pages, edited 0 records · HD-20311', tone: 'info' }, { when: day(c, -64), text: 'Luis R. · migration · 6 sessions · import batch IB-7731 committed', tone: 'ok' }, { when: day(c, -64), text: 'Grant requested by Luis R., approved by owner with MFA', tone: '' }]) })}
    ${h.card({ title: 'Diagnostics (PII-redacted)', body: tech(c, h.kv([['Errors (24 h)', 'web 3 · crew app 11 · portal 0'], ['Failed jobs', t.acct.includes('QuickBooks') && t.health < 50 ? '<span style="color:var(--danger-text)">qbo.sync 9 days</span>' : '0'], ['Devices', `${Math.max(1, t.field[0])} · ${/^2\.1[45]/.test(t.ver) ? '3 below min version' : 'all current'}`], ['Pending mutations', '0'], ['Email bounces (7 d)', '0.4%']])) + B('Explain this error', { kind: 'ai', icon: 'spark', a: { 'data-act': 'cx-explain' } }) })}</div>`,
  ]);
}
const viewAsMock = (c, t, sess) => {
  let rows;
  if (t.sample && I.TENANTS[t.id].crews > 0) { const D = RL.data(I.TENANTS[t.id]); rows = D.visits.filter(v => v.crewId === 'CR-1').slice(0, 4).map(v => [v.start, v.client, v.service]); }
  else rows = [['7:10', 'Larson residence', 'Weekly mow + trim'], ['7:55', 'Oak Hollow HOA', 'Common area mow'], ['9:05', 'Kessler residence', 'Bed edging'], ['10:20', 'Pruitt residence', 'Spring cleanup']];
  return `<div class="tiny t3">Schedule · Crew 1 · ${esc(c.today.label)}</div>` + h.table([{ k: 0, label: 'Time', m: true }, { k: 1, label: 'Client' }, { k: 2, label: 'Service' }], rows, { dense: true }) + `<div class="flex">${ab(c, 'access', 'Request read-write upgrade', { t: t.name, id: 'rw', evenRO: true, audit: 'support_access.request', sum: `read_write needs ${t.owner || 'the owner'}'s approval per ticket: 24 hours default, 72 maximum, 30-minute sessions (PA-051).` })}</div>`;
};
RL.modal('cx-grant', (c, el) => {
  const t = findT(c, el.dataset.tn); resetReason();
  RL.ui['cx.gscope'] = c.role === 'platform_finance' ? 'billing_setup' : 'read_only'; RL.ui['cx.gdur'] = '72';
  const scopes = c.role === 'platform_finance' ? [['billing_setup', 'billing_setup (owner only, 24 h)']] : [['read_only', 'Read-only: view as user (owner or office manager)'], ['read_write', 'Read-write: act as user (owner only, per ticket)'], ['migration', 'Migration (owner, bookkeeper co-signs financial objects)'], ['ledger', 'Ledger (owner, explicit opt-in)'], ['billing_setup', 'Billing setup (owner only)']];
  const body = `<p>Request time-boxed access to <b>${esc(t.name)}</b> ${mono(t.tid)}.</p>`
    + `<div class="cols cols-2">${h.field('Scope', h.select(scopes, RL.ui['cx.gscope'], { ui: 'cx.gscope', label: 'Scope' }))}${h.field('Duration', h.select([['24', '24 hours'], ['72', '72 hours (read-only default)'], ['168', '7 days (read-only maximum)']], '72', { ui: 'cx.gdur', label: 'Duration' }), 'read_write: max 72 h, 30-minute sessions')}</div>`
    + h.field('Modules', `<div class="flex">${['Scheduling', 'Invoicing', 'Design', 'Settings', 'Portal'].map((m, i) => `<label class="tiny"><input type="checkbox" data-ui-input="cx.gm${i}"${i === 0 ? ' checked' : ''}> ${m}</label>`).join('')}</div>`)
    + reasonFields('Note to owner: checking why 3 Thursday visits are missing from Crew 2')
    + h.kv([['Approver', `${esc(t.owner || 'Owner')} (owner) · notify by app and email`], ['Ticket rule', c.role === 'platform_engineer' ? 'Engineers need a ticket (02 §10.4)' : 'customer_request needs a ticket']])
    + h.note('Role ceiling: an office manager cannot grant "view as owner". The grant shows in the tenant\'s Support Access Log and can be revoked any time; revocation ends sessions within 10 seconds.');
  return { title: 'Request access', body, foot: B('Cancel', { big: true, a: { 'data-close': '' } }) + B('Send request', { kind: 'primary', big: true, a: { 'data-act': 'cx-grant-send', 'data-tn': t.id } }) };
});
RL.act('cx-grant-send', (el, ev, c) => { const r = checkReason(); if (!r) return false; if (c.role === 'platform_engineer' && !String(RL.ui['cx.ticket'] || '').trim()) { RL.toast('Engineers need a ticket reference to request access (02 §10.4).'); return false; } RL.closeModal(); RL.ui['cx.grant.' + el.dataset.tn] = 'requested'; RL.ui['cx.t360'] = 'support'; RL.toast(`Access request sent (${RL.ui['cx.gscope'] || 'read_only'}, ${RL.ui['cx.gdur'] || 72} h). The owner approves in the app with MFA.`); return true; });
RL.act('cx-grant-ok', (el) => { RL.ui['cx.grant.' + el.dataset.tn] = 'active'; RL.toast('Owner approved the read-only grant (mock). support_access.granted written to both audit logs.'); return true; });
RL.act('cx-grant-no', (el) => { RL.ui['cx.grant.' + el.dataset.tn] = 'none'; RL.toast('Request withdrawn.'); return true; });
RL.act('cx-viewas', (el) => { RL.ui['cx.sess.' + el.dataset.tn] = RL.ui['cx.vaU'] || el.dataset.u; RL.toast('View as user started: read-only, 60-minute session cap, owner gets an email summary when it ends (PA-052).'); return true; });
RL.act('cx-endsess', (el) => { RL.ui['cx.sess.' + el.dataset.tn] = ''; RL.toast('Session ended. impersonation.ended logged with pages viewed and records touched; owner emailed a summary.'); return true; });
RL.act('cx-explain', () => { RL.toast('Operator Copilot: "Crew app 2.15 rejects the new visit schema; the 3 devices need the force-update macro." Cites 2 known-issue articles (PA-059).'); return false; });
function t360Flags(c, t) {
  const keys = ['design_3d', 'ai_layouts', 'route_vrp', 'portal_white_label', 'automations', 'snow_ice', 'ledger_advanced', 'api'];
  const rows = keys.map(k => I.FEATS[k]).filter(Boolean).map(f => { const pv = (f.plans[t.plan] || { s: '-' }); const viaAdd = pv.s === 'A' && (t.addons || []).includes(pv.addon); const ov = (t.id === 'summit' && f.key === 'api') ? 'Y until ' + day(c, 50) : ''; return { key: f.key, name: f.name, plan: pv.s + (pv.note ? ' (' + pv.note + ')' : ''), addon: viaAdd ? pv.addon : '', ov, eff: ov ? 'Y' : viaAdd ? 'Y' : pv.s === 'A' ? '-' : pv.s, scope: f.scope }; });
  return h.cols('2', [
    h.card({ title: 'Entitlements, resolved', sub: 'Global default → plan → add-ons → organization → tenant override → kill switch (PA-040)', flush: true, body: h.table([{ k: 'key', label: 'Key', fmt: (v, r) => mono(v) + ' ' + h.tag(r.scope) }, { k: 'plan', label: 'Plan', fmt: v => h.chip(v.split(' ')[0]) }, { k: 'addon', label: 'Add-on', fmt: v => v ? mono(v) : '' }, { k: 'ov', label: 'Override', fmt: v => v ? h.pill(esc(v), 'info') : '' }, { k: 'eff', label: 'Effective', fmt: v => h.chip(v) }], rows, { dense: true }) + `<div class="cd-b">${ab(c, 'override', 'Set tenant override', { t: t.name, audit: 'entitlement.override.set', hide: true, repeat: true, sum: 'Override with expiry and reason; the CSM is told 7 days before it reverts (PA-017).' })}</div>` }),
    h.card({ title: 'Flags evaluated for this tenant', sub: 'Sticky by tenant_id so the office and the crew see the same thing', flush: true, body: h.table([{ k: 0, label: 'Flag', m: true }, { k: 1, label: 'Value', fmt: v => h.pill(v, v === 'on' ? 'ok' : '') }, { k: 2, label: 'Matched rule' }], [
      ['route_optimizer_v2', t.id === 'kestrel' ? 'off' : (h.hash(t.id) % 100) < 25 ? 'on' : 'off', t.id === 'kestrel' ? '1. exclude list (enterprise change freeze)' : `4. percentage, bucket ${h.hash(t.id) % 100}`],
      ['crew.sync_protocol_v3', 'on', '5. default'], ['portal.pay_3ds_friction', t.id === 'pineridge' ? 'on' : 'off', t.id === 'pineridge' ? '1. include (dispute rate)' : '5. default'],
      ['ai.layout_generator_beta', t.plan === 'pro' ? 'on' : 'off', t.plan === 'pro' ? '2. beta program (V1)' : '5. default'], ['crew.min_version', '2.16.0', 'ops: soft prompt 2.17, hard block 2.16'],
    ], { dense: true }) + h.note('Hard version blocks never fire during an active clock-in (PA-044).') }),
  ]);
}
function t360Audit(c, t) {
  const ev = [[0, '7:02 am', 'system', 'health.score.recomputed', '-', t.health + ' (' + bandOf(t.health) + ')'], [-1, '4:18 pm', 'Maya D.', 'support.search', 'customer_request', 'phone ending 0187 (redacted)'], [-2, '11:40 am', 'Tom B.', 'billing.invoice.finalize', 'billing_adjustment', 'RLI-' + (40210 + h.hash(t.id) % 900)], [-6, '9:12 am', 'Jordan P.', 'tenant.note.create', 'customer_request', 'pinned note'], [-9, '2:30 pm', 'system', 'entitlements.changed', '-', 'sms.monthly 2500 → 2500 (pack)'], [-14, '8:05 am', 'Luis R.', 'migration.commit', 'migration', 'IB-7731, 1,214 rows']];
  const vis = c.role === 'platform_finance' ? ev.filter(e => e[3].startsWith('billing')) : c.role === 'platform_engineer' ? ev.filter(e => e[2] === 'system') : ev;
  return h.card({ title: 'Platform audit log, scoped to this tenant', sub: c.role === 'platform_finance' ? 'Finance reads billing events (19 §9.1)' : c.role === 'platform_engineer' ? 'Engineers read system events (19 §9.1)' : 'Append-only, hash-chained, WORM copy (PA-005)', flush: true, body: h.table([{ k: 0, label: 'When', fmt: (v, r) => esc(day(c, v)) + ' ' + esc(r[1]) }, { k: 2, label: 'Actor' }, { k: 3, label: 'Action', m: true }, { k: 4, label: 'Reason', fmt: v => mono(v) }, { k: 5, label: 'Detail' }, { k: 0, label: 'Hash', fmt: (v, r) => mono(h.hash(r[3] + t.id + v).toString(16).padStart(8, '0').slice(0, 8) + '…') }], vis, { dense: true }) });
}
function t360Data(c, t) {
  return h.cols('2', [
    h.card({ title: 'Residency and placement', body: h.kv([['Data residency', t.res === 'ca' ? 'ca (prod-ca)' : 'us (default)'], ['Cell', tech(c, mono(t.cell))], ['Change residency', 'Migration case only, approved by the founder (PA-018)'], ['DPA', 'Click-through accepted ' + day(c, t.signup)], ['Subprocessor notices', 'Subscribed (owner)']]) })
    + h.card({ title: 'Retention overrides', body: h.kv([['Audit logs', '7 years (platform)'], ['Ledger and invoices', 'Tenant-controlled, minimum shown per jurisdiction'], ['Pesticide application records', t.seg === 'maintenance' || (I.TENANTS[t.id] || { modules: [] }).modules.includes('lawn_programs') ? 'Per state rule (Wisconsin: verify)' : 'n/a'], ['GPS breadcrumbs', '13 months'], ['Session replays', '30 days (off by default)']]) }),
    h.card({ title: 'Holds, requests and exports', body: h.kv([['Legal holds', t.hold ? h.pill(t.hold + ' active', 'warn') : 'none'], ['DSARs', t.id === 'greenleaf' ? 'DSAR-0193 deletion, approved with tax exception' : 'none open'], ['Export history', t.state === 'churned' ? 'Full export ' + day(c, -38) + ' by owner' : 'Monthly ledger export by bookkeeper'], ['Deletion schedule', t.state === 'churned' ? 'pending_deletion on ' + day(c, 49) + ' (90-day window)' : t.state === 'trial_expired' ? 'pending_deletion on ' + day(c, 60 - (t.roDay || 0)) : 'none']]) }),
  ]);
}
function t360Danger(c, t) {
  const row = (title, txt, btn) => `<div class="li-i"><span class="ico danger">${icon('warn')}</span><div class="grow"><div class="tt">${title}</div><div class="ss">${txt}</div></div><div class="flex nw">${btn}</div></div>`;
  return h.banner(`${icon('shield')} Every action here needs a reason code, and the risky ones need two people. None of them ever stops ${esc(t.name)}'s clients from paying open invoices into its own Stripe.`, 'warn')
    + h.card({ tone: 'danger', flush: true, body: `<div class="li">
      ${row('Apply feature restriction', 'Immediate, no second approver: for example SMS broadcasts off during a spam run (PA-012, PA-122).', ab(c, 'risk', 'Restrict', { t: t.name, extra: 'scope', audit: 'risk.enforcement.feature_restriction', hide: false }))}
      ${row('Suspend for risk or terms', 'Office read-only except invoicing, payments and AR; crew read-only after the current visit; portal stays up for payments.', ab(c, 'suspend_risk', 'Suspend', { t: t.name, two: true, audit: 'tenant.lifecycle.suspend', kind: 'danger' }))}
      ${row('Rootline payments hold', 'Stops Rootline from creating new charges for this tenant. Never touches funds or Stripe\'s own controls (PA-113).', ab(c, 'payhold', 'Hold', { t: t.name, two: true, audit: 'payments.rootline_hold', kind: 'danger' }))}
      ${row('Schedule deletion', t.hold ? `Blocked: legal hold ${t.hold} is active.` : 'After the export window. Owner and bookkeeper get a final export link 14 days before (dual control).', t.hold ? B('Delete', { dis: true, title: 'Legal hold blocks deletion' }) : ab(c, 'delete', 'Schedule deletion', { t: t.name, two: true, stepup: true, audit: 'tenant.lifecycle.schedule_deletion', kind: 'danger' }))}
      ${row('Ownership transfer ' + h.tag('V1'), 'Owner request, or documentary evidence reviewed by two staff with 7 days\' notice. Never on a phone call alone (PA-016).', ab(c, 'suspend_risk', 'Start transfer case', { t: t.name, two: true, audit: 'tenant.ownership.transfer' }))}
      ${row('Change data residency', 'Freeze-copy-verify-flip migration case (PA-018, V2 tooling).', ab(c, 'settings', 'Open migration case', { t: t.name, two: true, audit: 'tenant.residency.change', nav: 'Tenants / Tenant 360' }))}
    </div>` });
}

/* @@MORE@@ */
})();
