/* screens-console: the Rootline operator console (19, 21 §5.5) and the partner portal (22 §5.4, 02 §7.8).
   Every tenant, number, ticket and person below is illustrative. The 8 sample tenants come from tenants.json with their real plans. */
(() => {
'use strict';
const RL = window.RL, h = RL.h, { esc, icon, money, kmoney, num } = h;
const I = RL.idx;
const hsh = s => { let x = 0; for (const ch of String(s)) x = (x * 31 + ch.charCodeAt(0)) >>> 0; return x; };

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
const aprId = key => 'APR-' + (2310 + hsh(key) % 480);

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
    const o = Object.assign({ country: 'US', res: 'us', cur: 'USD', partner: '', tags: [], addons: [], cell: 'us-' + (1 + hsh(t.id) % 3) }, t, c.winter && t.w ? t.w : {});
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
  const s = hsh(t.id);
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
  const add = (off, what, delta, note, kind) => { if (kind !== 'hold') bal += delta; rows.push({ id: 'CRL-' + (88100 + hsh(t.id + what + off) % 9000), when: day(c, off), what, delta, note, bal: kind === 'hold' ? null : bal, kind }); };
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
const seatRows = (c, t) => { const s = hsh(t.id), n = Math.min(7, t.field[0]); const trig = ['Crew app sign-in', 'Clock-in', 'On crew of visit V-58' + (810 + s % 90) + ' (completed)', 'Clock-in', 'Crew app sign-in', 'Token refresh only (stale device)', 'On crew of visit (in_progress)']; return Array.from({ length: n }, (_, i) => ({ id: 'U-' + (2200 + i + s % 300), user: nm(s, i + 4), role: i === 0 ? 'crew_lead' : 'technician', trigger: trig[i % trig.length], when: day(c, -1 - (i * 3) % 9), dispute: trig[i % trig.length].startsWith('Token') })); };
const sparkH = t => h.spark(Array.from({ length: 26 }, (_, i) => Math.max(5, t.health + Math.round(Math.sin((i + hsh(t.id) % 7) / 2.2) * 6) + (t.health < 40 ? Math.round((26 - i) * 1.4) : 0))));
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
      + h.card({ title: 'Modules used (entitled)', body: `<div class="flex">${['Scheduling', 'Invoicing', 'Portal', 'Crew app', 'Ledger', 'Design Studio', 'Campaigns', 'Lawn programs', 'Snow Lite'].map((m, i) => h.pill(esc(m), (i + hsh(t.id)) % 4 === 0 ? '' : 'ok')).join('')}</div>` }),
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
  const inv = Array.from({ length: 4 }, (_, i) => ({ id: 'RLI-' + (40210 + (hsh(t.id) % 900) + i), when: day(c, -30 * i - 10), amt: t.mrr ? Math.round(t.mrr * (i === 0 ? 1 : 0.96 + i * .01)) : 0, st: i === 0 && t.due ? 'open, failed ' + (t.due > 13 ? '4x' : '3x') : 'paid' }));
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
    `<div class="stack12">${h.card({ title: 'Tickets', flush: true, body: h.table([{ k: 0, label: 'Ticket', m: true }, { k: 1, label: 'Subject' }, { k: 2, label: 'State', fmt: v => h.pill(v, v === 'open' ? 'warn' : 'ok') }], t.tickets ? [['HD-21' + (hsh(t.id) % 900 + 100), alertsOf(c, t)[0][1].split(':')[0], 'open'], ['HD-20' + (hsh(t.id) % 900 + 100), 'Crew app sync pending on one device', 'solved']].slice(0, Math.max(1, Math.min(2, t.tickets))) : [], { dense: true, empty: 'No tickets in 30 days.' }) })}
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
      ['route_optimizer_v2', t.id === 'kestrel' ? 'off' : (hsh(t.id) % 100) < 25 ? 'on' : 'off', t.id === 'kestrel' ? '1. exclude list (enterprise change freeze)' : `4. percentage, bucket ${hsh(t.id) % 100}`],
      ['crew.sync_protocol_v3', 'on', '5. default'], ['portal.pay_3ds_friction', t.id === 'pineridge' ? 'on' : 'off', t.id === 'pineridge' ? '1. include (dispute rate)' : '5. default'],
      ['ai.layout_generator_beta', t.plan === 'pro' ? 'on' : 'off', t.plan === 'pro' ? '2. beta program (V1)' : '5. default'], ['crew.min_version', '2.16.0', 'ops: soft prompt 2.17, hard block 2.16'],
    ], { dense: true }) + h.note('Hard version blocks never fire during an active clock-in (PA-044).') }),
  ]);
}
function t360Audit(c, t) {
  const ev = [[0, '7:02 am', 'system', 'health.score.recomputed', '-', t.health + ' (' + bandOf(t.health) + ')'], [-1, '4:18 pm', 'Maya D.', 'support.search', 'customer_request', 'phone ending 0187 (redacted)'], [-2, '11:40 am', 'Tom B.', 'billing.invoice.finalize', 'billing_adjustment', 'RLI-' + (40210 + hsh(t.id) % 900)], [-6, '9:12 am', 'Jordan P.', 'tenant.note.create', 'customer_request', 'pinned note'], [-9, '2:30 pm', 'system', 'entitlements.changed', '-', 'sms.monthly 2500 → 2500 (pack)'], [-14, '8:05 am', 'Luis R.', 'migration.commit', 'migration', 'IB-7731, 1,214 rows']];
  const vis = c.role === 'platform_finance' ? ev.filter(e => e[3].startsWith('billing')) : c.role === 'platform_engineer' ? ev.filter(e => e[2] === 'system') : ev;
  return h.card({ title: 'Platform audit log, scoped to this tenant', sub: c.role === 'platform_finance' ? 'Finance reads billing events (19 §9.1)' : c.role === 'platform_engineer' ? 'Engineers read system events (19 §9.1)' : 'Append-only, hash-chained, WORM copy (PA-005)', flush: true, body: h.table([{ k: 0, label: 'When', fmt: (v, r) => esc(day(c, v)) + ' ' + esc(r[1]) }, { k: 2, label: 'Actor' }, { k: 3, label: 'Action', m: true }, { k: 4, label: 'Reason', fmt: v => mono(v) }, { k: 5, label: 'Detail' }, { k: 0, label: 'Hash', fmt: (v, r) => mono(hsh(r[3] + t.id + v).toString(16).padStart(8, '0').slice(0, 8) + '…') }], vis, { dense: true }) });
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

// =====================================================================================
// Migration Center (19 PA-020 to PA-023, §6.5)
// =====================================================================================
const MIG_STATES = ['requested', 'scoping', 'awaiting_files', 'mapping', 'validating', 'tenant_review', 'committing', 'reconciling', 'live'];
const MIGS = c => [
  { id: 'MIG-0412', t: 'bluespruce', name: 'Blue Spruce Lawn', src: 'Jobber export (Jan 2027)', state: 'validating', spec: 'Luis R.', cut: 5, live: 19, sla: 'day 6 of 15', clients: 1228, ent: 'Free: 1 source system on annual Grow' },
  { id: 'MIG-0418', t: 'kestrel', name: 'Kestrel Lawn franchise system', src: 'Scoped project: 7 remaining locations', state: 'committing', spec: 'Luis R.', cut: 2, live: 9, sla: 'scoped plan, on track', clients: 6400, ent: 'Enterprise scoped project' },
  { id: 'MIG-0421', t: 'northfield', name: 'Northfield Snow & Landscape', src: 'Service Autopilot reports', state: 'mapping', spec: 'Jordan P.', cut: 9, live: 24, sla: 'day 3 of 15', clients: 640, ent: '$499 per source (monthly), credited if annual in 60 days' },
  { id: 'MIG-0425', t: 'cardinal', name: 'Cardinal Outdoor', src: 'Generic CSV', state: 'tenant_review', spec: 'Jordan P.', cut: 1, live: 6, sla: 'day 8 of 15', clients: 388, ent: 'Free: 1 source system on annual Grow' },
  { id: 'MIG-0427', t: 'hermanos', name: 'Hermanos Garcia Lawn Care', src: 'Spreadsheets (unknown)', state: 'requested', spec: 'unassigned (ES)', cut: 14, live: 30, sla: 'scoping call due in 1 business day', clients: 0, ent: 'Trial: self-serve or $499 per source' },
  { id: 'MIG-0409', t: 'copperleaf', name: 'Copper Leaf Landscape', src: 'Generic CSV', state: 'awaiting_files', spec: 'Jordan P.', cut: 12, live: 26, sla: 'files 2 days late', clients: 0, ent: 'Trial' },
  { id: 'MIG-0401', t: 'kzoo', name: 'Kalamazoo Stoneworks', src: 'CSV + QuickBooks Online', state: 'reconciling', spec: 'Luis R.', cut: -2, live: 2, sla: 'day 13 of 15', clients: 510, ent: 'Free: 1 source (QBO counted as a second, $499)' },
  { id: 'MIG-0398', t: 'escarpment', name: 'Escarpment Gardens', src: 'QuickBooks Online (OAuth)', state: 'live', spec: 'Luis R.', cut: -20, live: -8, sla: 'met', clients: 290, ent: 'Free: 1 source system on annual Grow' },
  { id: 'MIG-0403', t: 'maplestone', name: 'Maple & Stone LLC', src: 'Card data copy from a vendor-controlled account', state: 'scoping', spec: 'Maya D.', cut: 0, live: 10, sla: 'blocked: source vendor refused copy', clients: 0, ent: 'Payment method continuity (V1)', blocked: true },
];
RL.screen('console.migrations', (c) => {
  const ms = MIGS(c), selId = RL.ui['cx.mig'] || 'MIG-0412', m = ms.find(x => x.id === selId) || ms[0], ro = RO(c);
  const cols = MIG_STATES.map(s => ({ title: s, cards: ms.filter(x => x.state === s).map(x => ({ title: esc(x.name), sub: `${x.id} · ${esc(x.src)}`, meta: `${h.pill(esc(x.sla), x.blocked ? 'danger' : /late|due|13 of/.test(x.sla) ? 'warn' : '')}${x.id === m.id ? h.pill('open below', 'accent') : ''}` })) }));
  const obj = [['Clients', 1228, 1192, 22, 0, '14 (phone format)'], ['Properties', 1401, 1379, 22, 0, '31 (unit or suite parsed)'], ['Recurring services', 318, 312, 6, 0, '0'], ['Open invoices', 87, 86, 0, 1, '0'], ['Price book', 146, 146, 0, 0, '9 (unit normalized)'], ['Employees', 24, 24, 0, 0, 'SSN column blocked by rule']];
  const stepIdx = { requested: 0, scoping: 0, awaiting_files: 0, mapping: 1, validating: 2, tenant_review: 4, committing: 5, reconciling: 6, live: 7 }[m.state];
  return h.page({ title: 'Migration Center', sub: `${ms.length} white-glove projects shown · ${c.winter ? 'Winter Switch season: maintenance Companies are steered to November-February cutovers' : 'Spring: mid-season migrations use parallel-run mode'}`, actions: ro ? '' : B('New project', { kind: 'primary', icon: 'plus', a: { 'data-act': 'cx-newmig' } }) })
    + roBanner(c)
    + `<div class="flex">${ms.map(x => B(x.id, { kind: x.id === m.id ? 'primary' : 'ghost', a: { 'data-ui': 'cx.mig', 'data-val': x.id } })).join('')}</div>`
    + h.board(cols.slice(0, 9))
    + h.card({ title: `${m.id} · ${esc(m.name)}`, sub: `Source: ${esc(m.src)} · state ${m.state}`, actions: B('Tenant 360', { kind: 'ghost', a: { 'data-go': 'console.tenant', 'data-x': m.t } }), body: h.kv([['Specialist', esc(m.spec)], ['Cutover', day(c, m.cut)], ['Go-live target', day(c, m.live)], ['SLA', esc(m.sla)], ['Entitlement', esc(m.ent)], ['Data access', 'Support Access Grant, scope migration (14 days)']])
      + h.steps(['Files', 'Mapping', 'Validation', 'Dry run', 'Approve', 'Commit', 'Reconcile', 'Live'], stepIdx) })
    + h.cols('21', [
      h.card({ title: 'Validation report', sub: 'Rows land in a per-migration staging schema, never in live tables', flush: true, body: h.table([{ k: 0, label: 'Object' }, { k: 1, label: 'Rows', n: true, fmt: v => num(v) }, { k: 2, label: 'Ready', n: true, fmt: v => num(v) }, { k: 3, label: 'Warnings', n: true, fmt: v => v ? `<span style="color:var(--warn-text)">${v}</span>` : '0' }, { k: 4, label: 'Errors', n: true, fmt: v => v ? `<b style="color:var(--danger-text)">${v}</b>` : '0' }, { k: 5, label: 'Auto-fixed' }], obj, { dense: true })
        + `<div class="li">${[
          ['danger', 'ERROR INV-3381: balance -$45.00 not marked as credit', ab(c, 'migrate', 'Mark as credit memo', { t: 'INV-3381', audit: 'migration.fix', hide: true }) + ab(c, 'migrate', 'Exclude', { t: 'INV-3381', id: 'excl', audit: 'migration.fix', hide: true })],
          ['warn', 'WARN 22 addresses geocoded at interpolated precision', B('Review on map', { a: { 'data-act': 'cx-mapreview' } })],
          ['warn', 'WARN 6 schedules "every 7-10 days"', ab(c, 'migrate', 'Set to weekly', { t: '6 schedules', audit: 'migration.fix', hide: true }) + ab(c, 'migrate', 'Set to 10-day', { t: '6 schedules', id: 'ten', audit: 'migration.fix', hide: true })],
          ['warn', 'WARN 14 possible duplicate clients (Jaro-Winkler > 0.92)', B('Review merges', { a: { 'data-act': 'cx-merges' } })],
        ].map(([tone, txt, act]) => `<div class="li-i"><span class="ico ${tone}">${icon('warn')}</span><div class="grow tiny">${esc(txt)}</div><div class="flex nw">${act}</div></div>`).join('')}</div>`
        + `<div class="cd-b"><div class="flex"><span class="mono tiny">AR check: source $48,255.55 · staged $48,210.55 · diff $45.00 (INV-3381)</span><span class="grow"></span>${ro ? '' : B('Run dry run', { dis: true, title: 'Blocked: 1 error' }) + ab(c, 'migrate', 'Commit', { t: m.name, audit: 'migration.commit', hide: true, sum: 'Commits in batches of 1,000 with import_batch_id on every record, after the tenant owner (and bookkeeper for financial objects) approves. 72-hour rollback window.' })}</div></div>` }),
      `<div class="stack12">${h.card({ title: 'Mapping profile', sub: 'AI-proposed, confidence under 0.8 needs a human', body: h.table([{ k: 0, label: 'Source column', m: true }, { k: 1, label: 'Rootline field', m: true }, { k: 2, label: 'Conf.', n: true, fmt: v => v < .8 ? `<span class="pill warn">${v}</span>` : v }], [['Client Name', 'client.name', .99], ['Service Street 1', 'property.line1', .97], ['Visit Frequency', 'agreement.rrule', .74], ['Tags', 'client.tags', .66], ['Balance', 'invoice.balance', .95]], { dense: true }) + h.note('Saved as profile jobber-2027-01, reusable for the next Jobber export.') })}
      ${c.inLens('V1') ? h.card({ title: 'Spring-Ready Guarantee ' + h.tag('V1'), sub: 'Annual Grow or Pro signed by Feb 15 and live by Mar 31, or 3 months free', body: c.winter ? h.kv([['Eligible tenants', '143'], ['At risk (5+ business days behind)', '<b style="color:var(--warn-text)">9</b>, routed to the top of the queue'], ['Countdown', `${79} days to Mar 31`]]) : h.kv([['Apr 1 sweep', '143 eligible · 138 met'], ['Tenant-caused misses', '3 (files never supplied), evidence recorded'], ['Rootline-caused misses', '2: 3-month credit applied with reason goodwill']]) }) : ''}
      ${h.card({ title: 'Payment method continuity ' + h.tag('V1'), body: h.kv([['Own Stripe account', '61% of migrations: saved cards already there'], ['Vendor-controlled account', '27%: copy requested, 1 refused (MIG-0403)'], ['No portable data', '12%: "update your payment method" campaign 10 days before first autopay']]) })}</div>`,
    ]);
});
RL.act('cx-newmig', () => { RL.toast('New migration project (mock): pick the tenant, sources and scope. A scoping call is due within 2 business days (PA-022).'); return false; });
RL.act('cx-mapreview', () => { RL.toast('Map review (mock): 22 interpolated addresses; routing needs rooftop or parcel precision.'); return false; });
RL.act('cx-merges', () => { RL.toast('Merge review (mock): 14 candidate pairs by normalized email, phone or name plus address.'); return false; });

// =====================================================================================
// Billing (19 PA-030 to PA-038; 22 §4, §8.2)
// =====================================================================================
const DUNNING = c => {
  const T = id => findT(c, id);
  const rows = [
    { tid: T('hilltop').tid, x: 'hilltop', name: 'Hilltop Lawn Co.', plan: 'grow', day: 9, state: 'past_due', amt: 389, last: 'card_declined (insufficient_funds)', next: 'Day 12: "features restrict in 2 days"', mrr: 389 },
    { tid: T('foxvalley').tid, x: 'foxvalley', name: 'Fox Valley Tree & Turf', plan: 'grow', day: 17, state: 'restricted', amt: 824, last: 'ACH return R01, retried', next: 'Day 25: suspension notice', mrr: 412 },
    { tid: T('riverbend').tid, x: 'riverbend', name: 'Riverbend Lawn & Snow', plan: 'starter', day: 33, state: 'suspended', amt: 237, last: 'expired_card', next: 'Day 55: final notice with export link', mrr: 79, snow: c.winter },
    { tid: 'TNT-49577', x: '', name: 'Evergreen Edge Lawn', plan: 'grow', day: 3, state: 'past_due', amt: 249, last: 'card_declined (do_not_honor)', next: 'Day 7: email + SMS + CSM task', mrr: 249 },
    { tid: 'TNT-49031', x: '', name: 'Rolling Hills Grounds', plan: 'pro', day: 26, state: 'restricted', amt: 1058, last: 'card_declined (stolen card reported)', next: 'Grace candidate (stolen card)', mrr: 529 },
    { tid: 'TNT-49702', x: '', name: 'Blackbird Landscape', plan: 'starter', day: 1, state: 'past_due', amt: 79, last: 'Smart Retry scheduled', next: 'Day 3: email', mrr: 79 },
  ];
  if (c.winter) rows.unshift({ tid: T('brookside').tid, x: 'brookside', name: 'Brookside Lawn Co.', plan: 'starter', day: 9, state: 'past_due', amt: 79, last: 'expired_card', next: 'Winter Mode offered on day 7', mrr: 79, wm: true });
  return rows;
};
const dunTable = (c, rows) => h.table([
  { k: 'name', label: 'Tenant', fmt: (v, r) => `<b>${esc(v)}</b> ${mono(r.tid)}${r.snow ? `<div>${h.pill('snow carve-out: 41 of 72 h used this event', 'info')}</div>` : ''}${r.wm ? `<div>${h.pill('Winter Mode offer sent', 'info')}</div>` : ''}` },
  { k: 'day', label: 'Day', n: true },
  { k: 'state', label: 'State', fmt: v => stP(v) },
  { k: 'amt', label: 'Due', n: true, fmt: v => money(v) },
  { k: 'last', label: 'Last attempt', fmt: v => `<span class="tiny">${esc(v)}</span>` },
  { k: 'next', label: 'Next step', fmt: v => `<span class="tiny">${esc(v)}</span>` },
], rows, { dense: true });
const PLAN_SUBS = { starter: 437, grow: 552, pro: 191, enterprise: 4, design_solo: 30, archive: 21 };
RL.screen('console.billing', (c) => {
  const P = RL.P.plans, ro = RO(c);
  const [tb, cur] = tabsN('cx.bill', [['catalog', 'Catalog'], ['subs', 'Subscriptions'], ['dunning', 'Dunning queue', DUNNING(c).length], ['coupons', 'Coupons and credits'], ['revenue', 'Revenue']]);
  let body = '';
  if (cur === 'catalog') {
    const pend = apprState('APR-2291');
    body = h.card({ title: 'Plans', sub: 'Rootline is the source of truth; synced to Stripe Products and Prices on Rootline\'s own account. USD and CAD are separate price points (PA-030)', flush: true, body: h.table([
      { k: 'name', label: 'Plan', fmt: (v, p) => `<b>${esc(v)}</b> ${mono(p.code)} ${h.tag(p.scope)}${p.public ? '' : ' <span class="tiny t3">sales-led</span>'}` },
      { k: 'monthly', label: 'Monthly', n: true, fmt: (v, p) => v ? money(v) : '-' },
      { k: 'annual', label: 'Annual /mo', n: true, fmt: (v, p) => v ? money(v) : `<span class="tiny">${esc(p.annual_note || '-')}</span>` },
      { k: 'monthly_cad', label: 'CAD', n: true, fmt: (v, p) => v ? 'C' + money(v) + (p.annual_cad ? ' / C' + money(p.annual_cad) : '') : '-' },
      { k: 'office_seats', label: 'Seats o · f · d', n: true, fmt: (v, p) => `${v == null ? '-' : v} · ${p.field_seats == null ? '∞' : p.field_seats} · ${p.designer_seats == null ? 'neg.' : p.designer_seats}` },
      { k: 'extra_office', label: 'Extra o · f · d', n: true, fmt: (v, p) => v ? `$${v} · $${p.extra_field} · $${p.extra_designer}` : '-' },
      { k: 'ai_credits', label: 'Credits', n: true, fmt: v => v ? num(v) : '-' },
      { k: 'sms', label: 'SMS', n: true, fmt: v => v ? num(v) : '-' },
      { k: 'code', label: 'Version · subs', n: true, fmt: v => `${v === 'pro' ? '2027.1' : '2026.4'} · ${num(PLAN_SUBS[v] || 0)}` },
    ], P.plans, { dense: true }) })
      + h.cols('21', [
        h.card({ title: 'Draft price change: Pro 2027.2', tone: 'warn', sub: 'Finance drafts, the founder approves (two-person, PA-030)', body: h.kv([['Change', 'pro.monthly $599 → $629; pro.annual $529 → $549'], ['Applies to', 'New subscribers. Existing tenants stay on 2027.1 until a migration is scheduled'], ['Price Lock Promise', '214 tenants excluded (annual, under 24 months); later raises capped at 7%/yr, 90 days\' notice'], ['Projected MRR', '+$1,140/mo at the current Pro signup rate'], ['Status', pend ? h.pill(pend, pend === 'approved' ? 'ok' : '') : h.pill('APR-2291 waiting on the founder', 'warn')]])
          + `<div class="flex">${own(c) && !pend ? B('Review APR-2291', { kind: 'primary', a: { 'data-modal': 'cx-appr', 'data-id': 'APR-2291' } }) : ''}${ab(c, 'catalog', 'Draft a price change', { id: 'price-draft', audit: 'billing.price.change', hide: true, two: true, stepup: true, blast: 'Price migration tool lists every excluded tenant', sum: 'Creates a new price version. Existing subscribers stay on their version; the migration tool refuses any schedule that breaks the Price Lock Promise.' })}</div>` }),
        h.card({ title: 'Trials and offers', flush: true, body: h.table([{ k: 'item', label: 'Item' }, { k: 'rule', label: 'Rule', fmt: v => `<span class="tiny">${esc(v.length > 110 ? v.slice(0, 108) + '…' : v)}</span>` }, { k: 'scope', label: '', fmt: v => h.tag(v) }], P.trial_and_offers.slice(0, 6), { dense: true }) }),
      ])
      + h.card({ title: 'Add-ons', sub: 'Seasonal add-ons carry a billing month mask: Snow & Ice shows "dormant until Nov 1", not canceled (PA-032)', flush: true, body: h.table([{ k: 'name', label: 'Add-on', fmt: (v, a) => `<b>${esc(v)}</b> ${mono(a.code)}` }, { k: 'price', label: 'Price', fmt: v => `<span class="tiny">${esc(v)}</span>` }, { k: 'available_on', label: 'Available on', fmt: v => `<span class="tiny">${esc(v)}</span>` }, { k: 'billing_months', label: 'Months', fmt: v => v ? mono(v.join(' ')) : '<span class="t3">all</span>' }, { k: 'scope', label: '', fmt: v => h.tag(v) }], P.addons, { dense: true }) })
      + h.cols('2', [
        h.card({ title: 'Usage meters', flush: true, body: h.table([{ k: 'key', label: 'Meter', m: true }, { k: 'included', label: 'Included S / G / P', fmt: v => `<span class="tiny">${esc(v)}</span>` }, { k: 'overage', label: 'Overage', fmt: v => `<span class="tiny">${esc(v)}</span>` }, { k: 'scope', label: '', fmt: v => h.tag(v) }], P.meters, { dense: true }) }),
        h.card({ title: 'AI credit rate card', sub: 'Published action prices held 12 months; an increase needs 60 days\' notice and two people (PA-033)', flush: true, body: h.table([{ k: 'action', label: 'Action', fmt: v => `<span class="tiny">${esc(v)}</span>` }, { k: 'credits', label: 'Credits', n: true, fmt: v => `<b>${esc(v)}</b>` }, { k: 'scope', label: '', fmt: v => h.tag(v) }], P.ai_credit_rates.filter(r => c.inLens(r.scope)).slice(0, 14), { dense: true }) + `<div class="cd-b">${ab(c, 'catalog', 'Propose a rate change', { id: 'ratecard', audit: 'billing.rate_card.change', hide: true, two: true, stepup: true, blast: 'All tenants; 60-day notice email' })}</div>` }),
      ]);
  } else if (cur === 'subs') {
    const rows = allT(c).filter(t => !['trial', 'trial_expired', 'churned'].includes(t.state));
    body = h.card({ title: 'Subscriptions', sub: `${num(PM(c).paying)} paying · illustrative rows`, flush: true, body: h.table([
      { k: 'name', label: 'Tenant', fmt: (v, t) => `<b>${esc(v)}</b> ${mono(t.tid)}` }, { k: 'plan', label: 'Plan', fmt: v => esc(planN(v)) },
      { k: 'plan', label: 'Interval', fmt: (v, t) => (I.PLANS[v].annual && !['brookside', 'riverbend', 'prairieedge'].includes(t.id)) ? 'annual' : 'monthly' },
      { k: 'mrr', label: 'MRR', n: true, fmt: (v, t) => mrrF(t) }, { k: 'coupon', label: 'Discount', fmt: v => v ? `<span class="tiny">${esc(v)}</span>` : '' },
      { k: 'state', label: 'Status', fmt: v => stP(v) }, { k: 'signup', label: 'Next invoice', fmt: (v, t) => esc(day(c, 20 + (hsh(t.id) % 9))) },
    ], rows, { go: 'console.tenant', dense: true }) });
  } else if (cur === 'dunning') {
    const d = DUNNING(c);
    body = h.banner(`${icon('shield')} Restricted and suspended never block a Company from getting paid: scheduling (restricted), invoicing, the Customer Portal, client payments into the Company's own Stripe, the Ledger and exports keep working. Snow carve-out: a snow tenant keeps crew dispatch and per-push logging for up to 72 hours per forecast event (22 §8.2, PA-012).`, 'info')
      + h.kpis([{ label: 'In dunning', value: d.length }, { label: 'Past due', value: money(d.reduce((s, r) => s + r.amt, 0)) }, { label: 'Recovered (30 days)', value: '71%', delta: 'Smart Retries + card updater', tone: 'ok' }, { label: 'Involuntary churn (90 d)', value: '0.4%', tone: '' }])
      + h.card({ title: 'Ladder', body: `<div class="steps">${['Day 0 email + banner', 'Day 3 email', 'Day 7 email, SMS, CSM task', 'Day 12 notice', 'Day 14 restricted', 'Day 25 notice', 'Day 30 suspended', 'Day 55 final notice', 'Day 60 churned'].map((s, i) => `<span class="${[4, 6, 8].includes(i) ? 'on' : ''}">${esc(s)}</span>`).join('')}</div><div class="tiny t3">Messages go to the owner and billing contacts only. Crew and clients never see billing messages. Maintenance and snow tenants on monthly plans get a Winter Mode offer on day 7 in their off-season.</div>` })
      + h.card({ title: 'Queue', flush: true, body: h.table([
        { k: 'name', label: 'Tenant', fmt: (v, r) => `<b>${esc(v)}</b> ${mono(r.tid)}${r.snow ? `<div>${h.pill('snow carve-out: 41 of 72 h used this event', 'info')}</div>` : ''}${r.wm ? `<div>${h.pill('Winter Mode offer sent', 'info')}</div>` : ''}` },
        { k: 'day', label: 'Day', n: true }, { k: 'state', label: 'State', fmt: v => stP(v) }, { k: 'amt', label: 'Due', n: true, fmt: v => money(v) },
        { k: 'last', label: 'Last attempt', fmt: v => `<span class="tiny">${esc(v)}</span>` }, { k: 'next', label: 'Next', fmt: v => `<span class="tiny">${esc(v)}</span>` },
        { k: 'tid', label: '', fmt: (v, r) => `<div class="flex nw gap4">${ab(c, 'suspend_pay', 'Grace +14 d', { t: r.name, id: 'grace', audit: 'billing.dunning.grace', hide: true, sum: 'Extends past_due by up to 14 days, once per 12 months, with a reason code (22 §8.2).' })}${ab(c, 'safe', 'Pay-now link', { t: r.name, id: 'paylink', audit: 'billing.dunning.paylink', hide: true, repeat: true })}</div>` },
      ], d, { dense: true }) });
  } else if (cur === 'coupons') {
    body = h.cols('2', [
      h.card({ title: 'Programs', flush: true, body: h.table([{ k: 0, label: 'Program' }, { k: 1, label: 'Discount' }, { k: 2, label: 'Use', n: true }, { k: 3, label: '', fmt: v => h.tag(v) }], [['Founding Customer (Wave 1 Regions, first 100)', '25% off base while subscribed', '87 of 100', 'MVP'], ['Accountant Partner client', '10% off base, year 1', '41', 'V1'], ['Association member', '10% off base, year 1', '63', 'V1'], ['Switching credit (proof of contract)', 'Up to 3 months free', '118', 'MVP'], ['Spring-Ready Guarantee credit', '3 months free on a Rootline miss', '2', 'V1']], { dense: true }) })
      + h.card({ title: 'Recent account credits', flush: true, body: h.table([{ k: 0, label: 'Tenant' }, { k: 1, label: 'Amount', n: true }, { k: 2, label: 'Reason', m: true }, { k: 3, label: 'By' }], [['Pine Ridge Grounds', '$250', 'goodwill', 'Maya D.'], ['Ironwood Hardscapes', '$1,200', 'billing_adjustment', 'Tom B.'], ['Cardinal Outdoor', '3 months', 'switching credit', 'Jordan P.'], ['Hilltop Lawn Co.', '$100', 'overage waiver', 'Maya D.']], { dense: true }) + `<div class="cd-b">${ab(c, 'credits', 'Apply account credit', { extra: 'amount', audit: 'billing.account_credit', hide: true, repeat: true })}</div>` }),
      h.card({ title: 'Discount authority ladder', sub: 'All audited; discounts never apply to usage meters except in Enterprise contracts (PA-034)', flush: true, body: h.table([{ k: 0, label: 'Who' }, { k: 1, label: 'May apply' }], [['platform_support', 'Switching credit up to 3 months; goodwill up to $250 or 1 month base per grant, once a quarter; overage waivers up to $100 per period'], ['platform_finance', 'Credits up to $5,000 per grant; deal-desk discounts up to 20% recorded by sales'], ['platform_owner', 'Anything above 20%, or any discount without an expiry'], ['Sales rep / sales lead', 'Up to 10% / 20%, applied by finance']], { dense: true }) })
      + h.card({ title: 'Promotion codes', flush: true, body: h.table([{ k: 0, label: 'Code', m: true }, { k: 1, label: 'Rule' }, { k: 2, label: 'Redeemed', n: true }], [['LIUCPA10', 'Partner: 10% client discount, year 1', '9'], ['CENTSWINTER', 'Trade show: switching credit, first-time only', '44'], ['SPRINGREADY', 'Guarantee eligibility tag', '143']], { dense: true }) }),
    ]);
  } else {
    const m = PM(c);
    body = h.kpis([{ label: 'MRR', value: money(m.mrr) }, { label: 'ARPA', value: money(Math.round(m.mrr / m.paying)), delta: 'model target $421 (22 §7.2)' }, { label: 'Usage revenue (30 d)', value: money(c.winter ? 9840 : 21460), delta: 'credit packs + SMS overage' }, { label: 'Deferred revenue', value: '$1.31M', delta: 'annual prepaid, ratable' }, { label: 'Application fees', value: '$0', delta: 'opt-in only, 0 tenants' }])
      + h.cols('2', [
        h.card({ title: 'MRR by plan', body: h.bars([['Starter', 41500], ['Grow', 208900], ['Pro', 171300], ['Enterprise', 52600], ['Design Solo', 1470], ['Archive', 189]].map(([l, v]) => ({ label: l, value: v, max: 210000, right: money(v) }))) }),
        h.card({ title: 'MRR by Region', body: h.bars([['Central Ohio', 124000], ['Chicagoland and NW Indiana', 118000], ['Southeast Michigan and Toledo', 86000], ['Northeast Ohio', 64000], ['West Michigan', 58000], ['Southeast Wisconsin', 49000], ['Ontario (Wave 2)', 12800]].map(([l, v]) => ({ label: l, value: v, max: 125000, right: money(v) }))) }),
      ])
      + h.card({ title: 'MRR movement', body: mrrChart(c, m) + waterfall(c, m.mv) });
  }
  return h.page({ title: 'Billing', sub: 'Rootline bills Companies on its own Stripe account, completely separate from the Companies\' connected accounts (19 §4.4)' }) + roBanner(c) + tb + body;
});

// =====================================================================================
// Entitlements and flags (19 PA-040 to PA-044, §6.6)
// =====================================================================================
const FLAGS = c => [
  { key: 'route_optimizer_v2', type: 'release', pct: 25, owner: 'Sam I.', exp: day(c, 81), guard: 'healthy', target: 'Exclude 2 · beta Routing Labs (64) · CA off · 25% of maintenance, snow' },
  { key: 'design.render_hd_selfhosted', type: 'release', pct: 60, owner: 'Kai M.', exp: day(c, 45), guard: 'healthy', target: '60% of Grow and Pro, sticky by tenant' },
  { key: 'proposal.ai_scope_v2', type: 'experiment', pct: 50, owner: 'Kai M.', exp: day(c, 30), guard: 'acceptance +3.1 pts', target: 'A/B 50/50, metric: proposal acceptance' },
  { key: 'crew.sync_protocol_v3', type: 'release', pct: 100, owner: 'Sam I.', exp: day(c, -12), guard: 'stale: fully rolled out 94 days', target: 'All tenants' },
  { key: 'geocoder.fallback', type: 'ops', pct: 0, owner: 'Sam I.', exp: '-', guard: 'off', target: 'Use fallback geocoder' },
  { key: 'portal.pay_3ds_friction', type: 'ops', pct: 1, owner: 'Tom B.', exp: '-', guard: 'include list (3)', target: 'Tenants with dispute or card-testing alerts' },
  { key: 'sms.broadcasts', type: 'kill_switch', pct: 100, owner: 'Founder', exp: 'permanent', guard: 'on', target: 'Global; per-tenant off for 1' },
  { key: 'ai.layout_generator_beta', type: 'permission', pct: 4, owner: 'Kai M.', exp: day(c, 60), guard: 'beta program', target: 'Beta program: AI Layout Generator (V1)' },
  { key: 'trial.reverse_pro', type: 'experiment', pct: 10, owner: 'Founder', exp: day(c, 40), guard: 'conversion +1.2 pts', target: 'V1 experiment: Pro-feature reverse trial' },
];
RL.screen('console.flags', (c) => {
  const ro = RO(c), F = RL.P.plans.features, plans = ['starter', 'grow', 'pro', 'enterprise', 'design_solo'];
  const [tb, cur] = tabsN('cx.flg', [['flags', 'Feature flags', FLAGS(c).length], ['matrix', 'Plan matrix'], ['overrides', 'Tenant overrides'], ['kill', 'Kill switches'], ['freeze', 'Change freeze'], ['versions', 'App versions']].concat(c.inLens('V1') ? [['beta', 'Beta programs ' + h.tag('V1')]] : []));
  let body = '';
  if (cur === 'matrix') {
    const groups = {}; F.forEach(f => { (groups[f.module] = groups[f.module] || []).push(f); });
    body = h.card({ title: 'Plan matrix', sub: 'From plans.json (22 §4.2.1). Y included, L included with limits, A add-on, - not available. Hover a cell for the note', flush: true, body: `<div class="mtx-wrap"><table class="mtx"><thead><tr><th>Feature</th>${plans.map(p => `<th>${esc(planN(p))}</th>`).join('')}<th>Scope</th></tr></thead><tbody>${Object.entries(groups).map(([g, fs]) => `<tr class="grp"><th colspan="${plans.length + 2}">${esc(g)}</th></tr>` + fs.map(f => `<tr><th>${esc(f.name)} <span class="g none">${esc(f.key)}</span></th>${plans.map(p => { const v = f.plans[p] || { s: '-' }; return `<td title="${esc(v.note || '')}${v.addon ? ' add-on ' + esc(v.addon) : ''}">${h.chip(v.s)}</td>`; }).join('')}<td>${h.tag(f.scope)}</td></tr>`).join('')).join('')}</tbody></table></div>` });
  } else if (cur === 'overrides') {
    body = h.card({ title: 'Per-tenant overrides', sub: 'Every override has an expiry and reason; expired ones revert automatically and the CSM hears 7 days before (PA-017)', flush: true, body: h.table([{ k: 0, label: 'Tenant' }, { k: 1, label: 'Key', m: true }, { k: 2, label: 'Plan default', n: true }, { k: 3, label: 'Override', n: true }, { k: 4, label: 'Expires' }, { k: 5, label: 'Reason', m: true }, { k: 6, label: 'By' }], [
      ['Summit Grounds Group', 'seats.office', '8', '14 (billed as extra)', day(c, 50), 'customer_request', 'Jordan P.'], ['Kestrel Lawn franchise system', 'api.rate_per_day', '250k', '500k', 'contract end', 'customer_request', 'Founder'], ['Hermanos Garcia Lawn Care', 'ai_credits.cap', '500', '50 (allow_with_limits)', 'until verified', 'fraud_investigation', 'system (risk)'], ['Pine Ridge Grounds', 'sms.daily_cap', '2,400', '2,000', day(c, 14), 'customer_request', 'Maya D.'], ['Oak Hollow Landscapes', 'storage_gb', '1,000', '1,250 (+25%)', day(c, 30), 'goodwill', 'Maya D.']], { dense: true }) + `<div class="cd-b">${ab(c, 'override', 'New override', { audit: 'entitlement.override.set', hide: true, repeat: true })}</div>` });
  } else if (cur === 'kill') {
    body = h.card({ title: 'Kill switches', sub: 'Effect within 15 seconds. Global switches need two people except during a declared SEV1 or SEV2, where the incident commander may act alone (PA-095)', flush: true, body: h.table([{ k: 0, label: 'Switch', m: true }, { k: 1, label: 'Level' }, { k: 2, label: 'State', fmt: v => h.pill(v, v === 'on' ? 'ok' : v === 'degraded' ? 'warn' : 'danger') }, { k: 3, label: 'Last change' }, { k: 0, label: '', fmt: (v, r) => ab(c, 'kill', r[2] === 'on' ? 'Kill' : 'Restore', { t: v, two: r[1] === 'global', stepup: true, audit: 'flag.kill_switch', hide: true }) }], [['ai.all', 'global', 'on', day(c, -40)], ['ai.provider.image_primary', 'provider', 'degraded', 'today 5:20 am'], ['sms.broadcasts', 'global', 'on', day(c, -90)], ['portal.payments', 'global', 'on', 'never (protected: payments stay up)'], ['crew.photo_upload_hd', 'task', 'on', day(c, -8)], ['tenant:TNT-51877.sms', 'tenant', 'off', 'today 6:44 am']], { dense: true }) });
  } else if (cur === 'freeze') {
    body = h.card({ title: 'Peak-season change freeze', sub: 'Risky rollouts are blocked by default in these windows; only the founder can override (PA-042)', flush: true, body: h.table([{ k: 0, label: 'Window' }, { k: 1, label: 'Scope' }, { k: 2, label: 'Status', fmt: v => h.pill(v, v === 'active now' ? 'warn' : '') }], [['Weekdays 05:00-09:00 local', 'All Regions, dispatch window', c.winter ? 'scheduled' : 'active now'], ['Apr 1-14 by Region spring start', 'Central Ohio, Chicagoland, SE Michigan', 'scheduled'], ['Forecast snow events (24 h before to 12 h after)', 'Snow tenants in affected Regions', c.winter ? 'active now' : 'scheduled'], ['First 2 business days of each month', 'Invoice runs', 'scheduled'], ['Kestrel Lawn enterprise freeze', 'TNT-50011', 'active now']], { dense: true }) + `<div class="cd-b">${own(c) ? B('Override freeze (founder)', { a: { 'data-modal': 'cx-act', 'data-k': 'flag', 'data-g': 'F', 'data-id': 'freeze', 'data-title': 'Override change freeze', 'data-tn': '', 'data-two': '0', 'data-audit': 'flag.freeze.override', 'data-sum': 'Overrides the freeze for one rollout step. Recorded on the flag history.', 'data-extra': '', 'data-stepup': '1', 'data-blast': 'one rollout step' } }) : '<span class="tiny t3">Only the founder can override a freeze.</span>'}</div>` });
  } else if (cur === 'versions') {
    body = h.card({ title: 'Crew app version control', sub: 'Hard blocks never fire during an active clock-in (PA-044)', body: h.kv([['Latest', mono('2.18.1')], ['Soft prompt below', mono('2.17.0')], ['Hard block below', mono('2.16.0')], ['Devices below hard block', '41 on 2.14-2.15 across 9 tenants'], ['OTA channel', 'production 92%, canary 8%']]) + h.bars([['2.18.x', 71], ['2.17.x', 22], ['2.16.x', 5], ['2.15 and older', 2]].map(([l, v]) => ({ label: l, value: v, max: 100, tone: l.startsWith('2.15') ? 'danger' : '', right: v + '%' }))) });
  } else if (cur === 'beta') {
    body = h.card({ title: 'Beta programs', flush: true, body: h.table([{ k: 0, label: 'Program' }, { k: 1, label: 'Members', n: true }, { k: 2, label: 'Capacity', n: true }, { k: 3, label: 'Graduation' }], [['AI Layout Generator beta', 38, 50, 'after eval gate'], ['Routing Labs', 64, 80, 'with route_optimizer_v2'], ['Snow Ops 2027', 22, 40, 'before Nov 1']], { dense: true }) + `<div class="cd-b">${ab(c, 'beta', 'Invite tenants', { audit: 'beta.invite', hide: true, repeat: true })}</div>` });
  } else {
    const sel = FLAGS(c).find(f => f.key === RL.ui['cx.flag']) || FLAGS(c)[0];
    body = h.card({ title: 'Flags', sub: 'Entitlements answer "has this tenant paid for it?", flags answer "is this code path on for them right now?" (19 §4.5)', flush: true, body: h.table([
      { k: 'key', label: 'Flag', fmt: (v, f) => `<button type="button" class="btn sm ghost mono" data-ui="cx.flag" data-val="${esc(v)}" aria-pressed="${sel.key === v}">${esc(v)}</button>` },
      { k: 'type', label: 'Type', fmt: v => h.pill(v, v === 'kill_switch' ? 'danger' : v === 'experiment' ? 'info' : '') },
      { k: 'pct', label: 'Rollout', n: true, fmt: v => `<div style="width:90px" class="flex nw gap4">${h.progress(v, 100)}<span class="tiny">${v}%</span></div>` },
      { k: 'target', label: 'Targeting', fmt: v => `<span class="tiny">${esc(v)}</span>` },
      { k: 'guard', label: 'Guardrails', fmt: v => `<span class="tiny">${esc(v)}</span>` },
      { k: 'owner', label: 'Owner' }, { k: 'exp', label: 'Expires' },
    ], FLAGS(c), { dense: true }) })
      + h.card({ title: `Flag editor: ${mono(sel.key)}`, sub: `type ${sel.type} · owner ${esc(sel.owner)} · expires ${esc(sel.exp)}`, body: h.cols('2', [
        `<div><div class="tiny t3 b">TARGETING (top to bottom)</div><ol class="small" style="margin:4px 0;padding-left:18px"><li>Exclude tenants: ${mono('TNT-50011')}, ${mono('TNT-50290')} (enterprise change freeze)</li><li>Include beta program "Routing Labs" (64 tenants)</li><li>If country = CA: off (metric distance QA pending)</li><li>Percentage ${sel.pct}% sticky by ${mono('tenant_id')} · segments maintenance, snow</li><li>Default: off</li></ol>
          <div class="tiny t3 b mt8">ROLLOUT PLAN</div>${h.steps(['internal', '5%', '25% (soak 31 of 48 h)', '50%', '100%'], 2)}<div class="tiny t3 mt8">Freeze: ${c.winter ? 'forecast snow events' : 'weekdays 05:00-09:00 local is active now'}</div></div>`,
        `<div><div class="tiny t3 b">GUARDRAILS (auto-rollback after 15 min breach)</div>${h.table([{ k: 0, label: 'Metric' }, { k: 1, label: 'Now', n: true }, { k: 2, label: 'Threshold', n: true }], [['Optimizer error rate', '0.4%', '< 2%'], ['Dispatcher overrides per route', '1.3', '< 2.5'], ['Drive minutes vs v1', '-11%', '< +5%'], ['"routing" tickets per 100 tenants/day', '0.7', '< 1.5']], { dense: true })}</div>`,
      ]) + `<div class="flex">${ab(c, 'flag', 'Pause rollout', { t: sel.key, audit: 'flag.rollout.pause', hide: true })}${ab(c, 'kill', 'Kill', { t: sel.key, audit: 'flag.kill_switch', hide: true, stepup: true, kind: 'danger' })}${ab(c, 'flag', 'Advance to 50%', { t: sel.key, two: true, audit: 'flag.rollout.advance', hide: true, blast: '612 tenants added', sum: 'Production change: needs a peer approval, and the change freeze must not be active (PA-042).' })}${B('Audit history', { kind: 'ghost', a: { 'data-act': 'cx-flaghist' } })}</div>` });
  }
  return h.page({ title: 'Entitlements and flags', sub: 'Shared evaluation service, managed and audited separately. Resolution: default → plan → add-ons → organization → tenant override → kill switch' }) + roBanner(c) + tb + body;
});
RL.act('cx-flaghist', () => { RL.toast('route_optimizer_v2: created by Sam I., 5% → 25% approved by Rafael O., soak timer 31 h (mock).'); return false; });

// =====================================================================================
// Support console (19 PA-050 to PA-061; 02 §5.13, §6.3)
// =====================================================================================
const TICKETS = c => [
  { id: 'HD-21044', x: 'hilltop', tenant: 'Hilltop Lawn Co.', plan: 'grow', subj: 'Crew app shows "sync pending" for 37 visits', tag: 'crew_app', lang: 'ES', age: '18 min', sla: '3h 42m left', peak: !c.winter, tone: '' },
  { id: 'HD-21041', x: 'pineridge', tenant: 'Pine Ridge Grounds', plan: 'pro', subj: 'Invoice batch totals look off vs last month', tag: 'billing', lang: 'EN', age: '52 min', sla: '8 min left (Pro: 1 h)', tone: 'warn' },
  { id: 'HD-21027', x: 'maplestone', tenant: 'Maple & Stone LLC', plan: 'grow', subj: 'Clients see "Contact us to pay" in the portal', tag: 'payments', lang: 'EN', age: '5h 10m', sla: 'breached by 1h 10m', tone: 'danger' },
  { id: 'HD-21039', x: 'cardinal', tenant: 'Cardinal Outdoor', plan: 'grow', subj: 'Where do I approve the import?', tag: 'migration', lang: 'EN', age: '1h 10m', sla: '2h 50m left', tone: '' },
  { id: 'HD-21036', x: 'kestrel', tenant: 'Kestrel Lawn franchise system', plan: 'enterprise', subj: 'Franchise rollup report missing 2 locations', tag: 'reports', lang: 'EN', age: '2h', sla: '2h left (contract SLA)', tone: '' },
  { id: 'HD-21031', x: 'hermanos', tenant: 'Hermanos Garcia Lawn Care', plan: 'grow', subj: '¿Cómo conecto mi cuenta de Stripe?', tag: 'payments', lang: 'ES', age: '3h', sla: '1h left', tone: 'warn' },
];
const ticketTable = (c, rows) => h.table([
  { k: 'id', label: 'Ticket', fmt: (v, r) => `${mono(v)} <b>${esc(r.subj)}</b>${r.peak && r.tag === 'crew_app' ? ' ' + h.pill('peak hours: jumped queue', 'info') : ''}` },
  { k: 'tenant', label: 'Tenant', fmt: (v, r) => `<a href="#" data-go="console.tenant" data-x="${esc(r.x)}">${esc(v)}</a>` },
  { k: 'tag', label: 'Tag', fmt: v => mono(v) }, { k: 'lang', label: 'Lang' },
  { k: 'sla', label: 'SLA', fmt: (v, r) => h.pill(esc(v), r.tone) },
], rows, { dense: true });
const KNOWN = c => [
  { title: 'Crew app 2.15 rejects the new visit schema after sync', tenants: 9, macro: 'force-update (EN/ES)', tone: 'warn' },
  { title: c.winter ? 'Snow push texts delayed on one carrier (INC-322)' : 'SMS delayed on one carrier (INC-322)', tenants: 212, macro: 'carrier-delay-status', tone: 'danger' },
  { title: 'QBO "Duplicate Name Exists" on customer sync', tenants: 22, macro: 'qbo-duplicate-name', tone: 'warn' },
  { title: 'Autopay mandates must be re-collected for migrated clients', tenants: 31, macro: 'update-payment-method', tone: 'info' },
];
const MACROS = [
  ['force-update', 'EN/ES', 'Your crew app is out of date. Open the App Store or Play Store and tap Update...', 'Clear device sync cursor (safe)', false],
  ['qbo-duplicate-name', 'EN', 'QuickBooks already has a customer with this name. We renamed the copy with a suffix...', 'Re-trigger QBO sync (safe)', false],
  ['trial-extend-7', 'EN/ES', 'We added 7 days to your trial so you can finish importing...', 'Extend trial +7 (safe, within limit)', false],
  ['goodwill-credit', 'EN', 'Sorry about the trouble this week. We applied a credit to your next invoice...', 'Goodwill credit up to $250 (safe, within limit)', false],
  ['price-update-agreements', 'EN', 'We updated the per-visit price on your mowing agreements as you asked...', 'Bulk price update on Service Agreements (grant required, dry run first)', true],
  ['regen-visits', 'EN', 'We re-generated next month\'s recurring visits from your agreements...', 'Re-generate a month of recurring visits (grant required)', true],
];
RL.screen('console.support', (c) => {
  const ro = RO(c);
  const [tb, cur] = tabsN('cx.sup', [['search', 'Global search'], ['grants', 'Access grants and sessions', GRANTS(c).length], ['queue', 'Queue', TICKETS(c).length], ['macros', 'Macros and actions'], ['known', 'Known issues', KNOWN(c).length], ['pin', 'Caller verification']].concat(c.inLens('V1') ? [['runbooks', 'Runbooks ' + h.tag('V1')], ['replay', 'Session replay ' + h.tag('V1')]] : []));
  let body = '';
  if (cur === 'search') {
    const q = RL.ui['cx.q'] || '(614) 555-0187';
    const grp = (title, items) => h.card({ title, flush: true, body: h.list(items) });
    body = `<div class="flex"><span style="flex:1 1 320px">${h.input(q, { ui: 'cx.q', label: 'Search', ph: 'Phone, email, invoice number, Stripe ID, tenant' })}</span>${B('Search', { kind: 'primary', icon: 'search', a: { 'data-act': 'cx-search' } })}</div>`
      + h.banner(`${icon('eye-off')} Without an active grant, client-level results are redacted. Matching uses hashed, normalized phone and email indexes. This query was logged as ${mono('support.search')} by ${esc(c.who)} (PA-050).`, 'info')
      + h.cols('2', [
        grp('Tenants', [{ icon: 'building', title: `Greenleaf Grounds Co. ${mono('TNT-48213')}`, sub: 'matched on business phone · Pro · active', go: 'console.tenant', x: 'greenleaf' }])
        + grp('Tenant users', [{ icon: 'user', title: `Tasha Greene (office_manager) ${mono('U-2184')}`, sub: `matched on mobile ${pii(c, '(614) 555-0187')}` }])
        + grp('Clients (metadata only)', [{ icon: 'users', title: `Client ${mono('C-10293')} · Greenleaf Grounds Co.`, sub: 'matched on phone ending 0187 · name and address redacted without a grant' }]),
        grp('Invoices and payments', [{ icon: 'receipt', title: `Invoice ${mono('INV-20418')} · $412.00 · paid`, sub: 'No line items in the console' }, { icon: 'card', title: `Stripe ${mono('cus_Q8x…41f')} on ${mono('acct_1P48213…')}`, sub: 'Connected-account customer; metadata only' }])
        + grp('Tickets and migrations', [{ icon: 'help', title: `${mono('HD-20311')} Crew 2 route missing Thursday visits`, sub: 'solved · CSAT 5' }]),
      ]);
  } else if (cur === 'grants') {
    body = h.card({ title: 'Active grants', sub: 'Who, what scope, how long, why and who approved (PA-051)', flush: true, body: h.table([{ k: 'tenant', label: 'Tenant', fmt: (v, g) => `<a href="#" data-go="console.tenant" data-x="${esc(g.tenantId)}">${esc(v)}</a>` }, { k: 'scope', label: 'Scope', fmt: v => h.pill(esc(v), v === 'read_write' ? 'warn' : 'info') }, { k: 'who', label: 'Staff' }, { k: 'by', label: 'Approved by', fmt: v => `<span class="tiny">${esc(v)}</span>` }, { k: 'ends', label: 'Ends' }, { k: 'ticket', label: 'Ticket', m: true }], GRANTS(c), { dense: true }) })
      + h.card({ title: 'Active View as user sessions', flush: true, body: `<div class="li">${[['Maya D.', 'Javier Ruiz (crew_lead)', 'Hilltop Lawn Co.', 'read_only', '3:40 pm', '22 min'], ['Maya D.', 'Rick Dawson (owner)', 'Pine Ridge Grounds', 'read_write', '9:00 am', '11 min']].map(s => `<div class="li-i"><span class="ico ${s[3] === 'read_write' ? 'warn' : 'info'}">${icon('eye')}</span><div class="grow"><div class="tt">${esc(s[0])} as ${esc(s[1])} · ${esc(s[2])}</div><div class="ss">${s[3]} · grant ends ${s[4]} · session ${s[5]} of ${s[3] === 'read_write' ? '30' : '60'} min</div></div><div class="flex nw">${own(c) ? B('End session', { a: { 'data-act': 'cx-endother' } }) : ''}</div></div>`).join('')}</div>` })
      + h.cols('2', [
        h.card({ title: 'Grant scopes', flush: true, body: h.table([{ k: 0, label: 'Scope', m: true }, { k: 1, label: 'Approver' }, { k: 2, label: 'Default / max' }, { k: 3, label: 'Session' }], [['read_only', 'owner or office_manager', '72 h / 7 days', '60 min'], ['read_write', 'owner, per ticket', '24 h / 72 h', '30 min'], ['billing_setup', 'owner', '24 h / 72 h', '30 min'], ['ledger', 'owner, opt-in', '24 h / 7 days', '60 min'], ['migration', 'owner (+ bookkeeper)', '14 days', '60 min'], ['standing read-only', 'owner toggle', 'until revoked, 90-day reconfirm', '60 min']], { dense: true }) }),
        h.card({ title: 'Banner preview', body: `<div style="background:var(--clay-500);color:#fff;padding:8px 10px;border-radius:8px;font-weight:700;font-size:.8rem">ROOTLINE SUPPORT (Maya D.) is viewing as Javier Ruiz (crew_lead) · READ-ONLY · ends 3:40 pm · End session</div>` + h.note('Clay impersonation band, token color.banner.impersonation (21 §8.3). Tenant users see a subtle header indicator and the event in the Support Access Log.') }),
      ]);
  } else if (cur === 'queue') {
    body = h.kpis([{ label: 'Open', value: c.winter ? 61 : 84 }, { label: 'Near SLA', value: c.winter ? 4 : 7, tone: 'warn', delta: 'Pro 1 h, Grow 4 h, Starter 1 day' }, { label: 'Breached today', value: 1, tone: 'danger' }, { label: 'Spanish-language', value: '31%', delta: 'routed by locale' }])
      + (c.winter ? '' : h.banner(`${icon('clock')} Peak-hours routing (April-June): crew_app and routing tickets from 5 to 9 am in the tenant's time zone jump the queue (PA-060).`, 'info'))
      + h.card({ title: 'Queue', flush: true, body: ticketTable(c, TICKETS(c)) });
  } else if (cur === 'macros') {
    body = h.card({ title: 'Macros', sub: 'Canned replies in English and Spanish, optionally bundled with support actions that run with your permissions and the conversation\'s grant (PA-057)', flush: true, body: h.table([{ k: 0, label: 'Macro', m: true }, { k: 1, label: 'Lang' }, { k: 2, label: 'Reply', fmt: v => `<span class="tiny">${esc(v)}</span>` }, { k: 3, label: 'Bundled action', fmt: (v, r) => `<span class="tiny">${esc(v)}</span>${r[4] ? ' ' + h.pill('grant required', 'warn') : ' ' + h.pill('safe', 'ok')}` }, { k: 0, label: '', fmt: (v, r) => ro ? '' : B('Dry run', { a: { 'data-act': 'cx-macro', 'data-m': v } }) }], MACROS, { dense: true }) });
  } else if (cur === 'known') {
    body = h.card({ title: 'Known issues', flush: true, body: h.list(KNOWN(c).map(k => ({ icon: 'warn', tone: k.tone, title: esc(k.title), sub: `${k.tenants} tenants affected · macro ${mono(k.macro)} · help article linked`, right: h.pill(k.tone === 'danger' ? 'incident' : 'open', k.tone) }))) });
  } else if (cur === 'pin') {
    body = h.cols('2', [
      h.card({ title: 'Verify a caller', sub: 'Identity or access changes by phone or email need the PIN, an in-app confirmation from another owner, or the documentary process (PA-061)', body: h.field('Tenant', h.select(allT(c).slice(0, 12).map(t => [t.id, t.name]), 'greenleaf', { ui: 'cx.pinT', label: 'Tenant' })) + h.field('Support PIN (6 digits, rotates every 24 h)', h.input('', { ui: 'cx.pin', ph: '••••••', label: 'PIN' })) + B('Check PIN', { kind: 'primary', a: { 'data-act': 'cx-pin' } }) + h.note('Nobody can override caller verification, including the founder (19 §9.1). Three failed attempts in 24 hours flag the tenant for Trust and Safety review and notify the owner.') }),
      h.card({ title: 'Recent verification events', body: h.timeline([{ when: 'today 7:51 am', text: 'Hilltop Lawn Co.: PIN verified for MFA reset request (owner)', tone: 'ok' }, { when: 'yesterday 4:02 pm', text: 'Pine Ridge Grounds: owner email change refused, no PIN; documentary process offered', tone: 'warn' }, { when: day(c, -3), text: 'Maple & Stone LLC: 3 failed PIN attempts, T&S review opened', tone: 'danger' }]) }),
    ]);
  } else if (cur === 'runbooks') {
    body = h.card({ title: 'Runbook actions', sub: 'Code-reviewed repair functions. No free-form SQL against production (PA-058)', flush: true, body: h.table([{ k: 0, label: 'Runbook', m: true }, { k: 1, label: 'Needs' }, { k: 2, label: 'Last run' }], [['rebuild_route_geometry_cache(tenant, date)', 'engineer, grant, ticket', day(c, -4)], ['replay_outbox(tenant, from, to)', 'engineer, grant, dry run', day(c, -9)], ['recompute_ledger_balances(tenant, period)', 'engineer, grant, 2nd approver over 1,000 rows', day(c, -3)]], { dense: true }) });
  } else {
    body = h.card({ title: 'Session replay', body: h.kv([['Default', 'Off. The owner enables it for the Company or one user for 7 days'], ['Masking', 'All inputs, data-pii elements, property photos blurred; Stripe Elements never recorded'], ['Retention', '30 days'], ['Enabled now', '3 tenants (owner opt-in)']]) });
  }
  return h.page({ title: 'Support console', sub: 'Find the tenant and the problem in 10 seconds, fix it without an engineer, and never see more than the Company allowed' }) + roBanner(c) + tb + body;
});
RL.act('cx-search', () => { RL.toast('Search ran (mock). Results are redacted without a grant; the query is in the audit log.'); return false; });
RL.act('cx-endother', () => { RL.toast('Session ended by the founder (mock). The agent and the tenant owner are notified.'); return false; });
RL.act('cx-macro', (el) => { RL.toast(`Macro ${esc(el.dataset.m)}: dry run shows 1 conversation and its bundled action's blast radius. Nothing sent (mock).`); return false; });
RL.act('cx-pin', () => { const p = String(RL.ui['cx.pin'] || ''); RL.toast(/^\d{6}$/.test(p) ? 'PIN matches the current rotation (mock). It rotates now that it was used.' : 'Enter the 6-digit PIN the caller reads from Help > Contact support.'); return false; });

// =====================================================================================
// Plant KB curation (19 PA-070 to PA-076, §6.9; 21 §18.11)
// =====================================================================================
const KBQ = [
  { id: 'KBR-77120', plant: "Aronia melanocarpa 'Low Scape Mound'", common: 'Black chokeberry', field: 'Salt tolerance (soil)', cur: 'Moderate', prop: 'High', conf: 0.94, src: ['State extension road-salt plant list', 'Regional arboretum plant database'], crit: false },
  { id: 'KBR-77121', plant: "Rhus aromatica 'Gro-Low'", common: 'Fragrant sumac', field: 'Deer resistance', cur: 'High', prop: 'High (re-confirm)', conf: 0.88, src: ['University deer-resistance survey', 'Nursery grower notes'], crit: true },
  { id: 'KBR-77124', plant: "Calamagrostis x acutiflora 'Karl Foerster'", common: 'Feather reed grass', field: 'Bloom period', cur: 'Jun-Jul', prop: 'Jun-Aug', conf: 0.91, src: ['Botanic garden records', 'Grower catalog', 'Extension fact sheet'], crit: false },
  { id: 'KBR-77126', plant: 'Rosa rugosa', common: 'Rugosa rose', field: 'Invasive status', cur: 'none', prop: 'Watch list (2 state lists)', conf: 0.97, src: ['State invasive species list', 'Regional invasive plant council'], crit: true },
  { id: 'KBR-77129', plant: 'Juniperus horizontalis', common: 'Creeping juniper', field: 'Mature height', cur: '6-12 in', prop: '4-12 in', conf: 0.83, src: ['Grower catalog'], crit: false },
  { id: 'KBR-77131', plant: "Hydrangea paniculata 'Limelight'", common: 'Panicle hydrangea', field: 'Deer resistance', cur: 'Moderate', prop: 'High (nursery feed)', conf: 0.62, src: ['Nursery availability feed'], crit: true, conflict: 'Deer resistance "High" conflicts with 3 extension sources rating it Moderate.' },
  { id: 'KBR-77133', plant: 'Pyrus calleryana', common: 'Callery pear', field: 'Invasive status', cur: 'Invasive: do not plant', prop: 'Invasive: sale banned (state rule)', conf: 0.99, src: ['State department of agriculture rule', 'Extension bulletin', 'Invasive plant council'], crit: true },
];
const REGIONS = ['Central Ohio', 'Northeast Ohio', 'Southeast Michigan and Toledo', 'West Michigan', 'Chicagoland and Northwest Indiana', 'Southeast Wisconsin'];
RL.screen('console.kb.queue', (c) => {
  const ro = RO(c), reg = RL.ui['cx.kbreg'] || 'West Michigan';
  const [tb, cur] = tabsN('cx.kb', [['queue', 'Curation queue', 214], ['region', 'Region builder'], ['releases', 'Releases'], ['quality', 'Quality'], ['licenses', 'Licenses']].concat(c.inLens('V1') ? [['nursery', 'Nursery feeds ' + h.tag('V1')]] : []));
  let body = '';
  if (cur === 'queue') {
    const sel = KBQ.find(k => k.id === RL.ui['cx.kbi']) || KBQ[0];
    const fields = [['Mature height', '6-8 ft', '6-8 ft'], ['Mature width', '6-8 ft', '6-10 ft'], ['Bloom', 'Jul-Sep', 'Jul-Sep'], ['USDA zones', '3-8', '3-9'], [sel.field, sel.cur, sel.prop]];
    body = `<div class="flex"><span style="width:280px">${h.select(REGIONS.map(r => [r, r + (r === 'West Michigan' ? ' (v7)' : '')]), reg, { ui: 'cx.kbreg', label: 'Region' })}</span><span class="tiny t3">Source: ${mono('kb.enrich')} prompt v3.2 · assigned to you: 60</span><span class="grow"></span>${ab(c, 'kb', 'Bulk accept safe (31 eligible)', { id: 'bulk-kb', audit: 'kb.bulk_accept', hide: true, blast: '31 non-critical traits, confidence over 0.9, 2+ agreeing sources', sum: 'Bulk accept never includes critical traits (invasiveness, toxicity, deer resistance, hardiness) (PA-073).' })}</div>`
      + h.cols('12', [
        h.card({ title: 'Queue', flush: true, body: `<div class="li">${KBQ.map(k => `<div class="li-i go" data-ui="cx.kbi" data-val="${k.id}" role="button" tabindex="0" style="${k.id === sel.id ? 'background:var(--primary-soft)' : ''}"><span class="ico ${k.crit ? 'warn' : ''}">${icon(k.crit ? 'warn' : 'leaf')}</span><div class="grow"><div class="tt" style="font-style:italic">${esc(k.plant)}</div><div class="ss">${esc(k.field)} · conf ${k.conf}${k.crit ? ' · critical: 2nd curator' : ''}</div></div></div>`).join('')}</div>` }),
        h.card({ title: `<i>${esc(sel.plant)}</i>`, sub: `${esc(sel.common)} · ${sel.id} · Status: in review · Region profile: ${esc(reg)}`, body:
          h.table([{ k: 0, label: 'Field' }, { k: 1, label: 'Current' }, { k: 2, label: 'Proposed', fmt: (v, r) => r[1] === v ? `<span class="t3">${esc(v)}</span>` : `<b>${esc(v)}</b>` }, { k: 1, label: '', fmt: (v, r) => r[1] === r[2] ? '<span class="t3">=</span>' : h.pill('changed', 'info') }], fields, { dense: true, hl: r => r[0] === sel.field })
          + `<div class="tiny t3 b">SOURCES (${sel.src.length}${sel.src.length > 1 ? ' agree' : ''})</div>${sel.src.map((s, i) => `<div class="tiny">${String.fromCharCode(65 + i)} · ${esc(s)}</div>`).join('')}`
          + h.kv([['Region rating', h.select(['Recommended', 'Use with care', 'Not recommended here', 'Invasive: do not plant'], 'Recommended', { ui: 'cx.kbrate', label: 'Region rating' })], ['Tenant signals', '12 tenants planted · 2 warranty claims per 340 installs (aggregated, anonymized)']])
          + (sel.conflict ? h.aiCard({ agent: 'KB conflict check', level: 'L0', title: 'Possible conflict', body: esc(sel.conflict), why: 'AI flags only; a curator decides. Platform-paid (no tenant credits).' }) : '')
          + (sel.crit ? h.banner(`${icon('users')} Critical trait: a second curator other than the author must review before publish (PA-070).`, 'warn') : '')
          + `<div class="flex">${ab(c, 'kb', 'Accept', { t: sel.id, audit: 'kb.record.accept', hide: true, kind: 'primary' })}${ab(c, 'kb', 'Edit and accept', { t: sel.id, id: 'edit', audit: 'kb.record.accept', hide: true })}${ab(c, 'kb', 'Reject', { t: sel.id, id: 'rej', audit: 'kb.record.reject', hide: true, sum: 'The rejection reason feeds back into the kb.enrich prompt evaluation (PA-073).' })}${ab(c, 'kb', 'Second opinion', { t: sel.id, id: '2nd', audit: 'kb.record.second_opinion', hide: true })}</div>` }),
      ]);
  } else if (cur === 'region') {
    const L = [['usda', 'USDA 2023 zones 5b-6b', true], ['eco', 'EPA Level III: Southern Michigan / Northern Indiana Drift Plains', true], ['cty', 'Counties: Kent, Ottawa, Allegan, Kalamazoo, Muskegon, Van Buren', true], ['ber', 'County: Berrien', false], ['prec', 'Climate filter: annual precipitation 34-40 in', false]];
    body = h.cols('21', [
      h.card({ title: `Region builder: ${esc(reg)}`, sub: 'Draft v8 (published v7). Union and intersection of layers (PA-071)', body: h.map({ seed: 11, h: 220, label: 'Region map preview', pins: [{ x: 120, y: 90, n: 'GR', tone: 'accent', label: 'Grand Rapids' }, { x: 70, y: 120, n: 'H', tone: 'info', label: 'Holland' }, { x: 150, y: 170, n: 'K', tone: 'info', label: 'Kalamazoo' }] })
        + `<div class="stack8">${L.map(([k, l, d]) => h.toggle(esc(l), 'cx.l.' + k, d)).join('')}</div>` }),
      `<div class="stack12">${h.card({ title: 'Preview', body: h.kv([['Tenants inside', '38 (count only)'], ['Properties', '21,406'], ['Plants with profiles', '612'], ['Overlap with Southeast Michigan and Toledo', '3%'], ['Republish moves', '1,212 Properties to this Region']]) + `<div class="flex">${B('Preview diff', { a: { 'data-act': 'cx-regdiff' } })}${ab(c, 'region', 'Submit for approval', { t: reg, audit: 'kb.region.publish', hide: true, two: c.role === 'platform_curator', sum: 'A senior curator other than the author (or the founder) approves. Republishing recomputes Property assignments and reports the moves.' })}</div>` })}
      ${h.card({ title: 'Wave 1 launch Regions', flush: true, body: h.list(REGIONS.map(r => ({ icon: 'map', title: esc(r), sub: r === reg ? 'editing' : 'published · Excellent coverage', right: B('Open', { kind: 'ghost', a: { 'data-ui': 'cx.kbreg', 'data-val': r } }) }))) })}</div>`,
    ]);
  } else if (cur === 'releases') {
    body = h.card({ title: 'KB releases', sub: 'Daily at MVP; tenants see changes at the next release (PA-070)', flush: true, body: h.table([{ k: 0, label: 'Release', m: true }, { k: 1, label: 'Published' }, { k: 2, label: 'Changes', n: true }, { k: 3, label: 'Notes' }, { k: 4, label: 'By' }], [['KB-' + (c.winter ? '2027.01.12' : '2027.05.11'), 'tonight 2:00 am ET (scheduled)', 214, 'Pending queue', '-'], ['KB-' + (c.winter ? '2027.01.11' : '2027.05.10'), day(c, -1), 388, '2 Region profiles', 'Dr. Priya R.'], ['KB-' + (c.winter ? '2027.01.10' : '2027.05.09'), day(c, -2), 241, 'West Michigan v7 (1,212 Properties moved)', 'Dr. Priya R.'], ['KB-' + (c.winter ? '2027.01.09' : '2027.05.08'), day(c, -3), 96, 'Takedown: 3 images (license expired)', 'Ben C.']], { dense: true }) + `<div class="cd-b">${ab(c, 'kb', 'Publish release now', { audit: 'kb.release.publish', hide: true, stepup: true, sum: 'Publishing is limited to a senior curator or the founder (02 §10.4).' })}</div>` });
  } else if (cur === 'quality') {
    body = h.cols('2', [
      h.card({ title: 'Completeness by Region', body: h.bars(REGIONS.map((r, i) => ({ label: r, value: [98, 96, 95, 93, 97, 94][i], max: 100, right: [98, 96, 95, 93, 97, 94][i] + '%' }))) }),
      h.card({ title: 'Quality signals', body: h.kv([['Source conflicts', '23 (9 critical)'], ['Stale (24+ months)', '41 records'], ['Missing images', '18 palette plants'], ['Invasive coverage', 'OH, MI, IL, IN, WI: 100% · ON: 84%'], ['"Failed in my area" reports', '7 this month (anonymized)'], ['Search misses', 'Pawpaw (31), Ninebark Tiny Wine (18)']]) }),
    ]);
  } else if (cur === 'licenses') {
    body = h.card({ title: 'License registry', sub: 'Non-commercial or expired images are blocked from proposals and the portal; takedowns run platform-wide within 24 hours (PA-075)', flush: true, body: h.table([{ k: 0, label: 'Dataset or image set' }, { k: 1, label: 'License', m: true }, { k: 2, label: 'Allowed uses' }, { k: 3, label: 'Expires' }, { k: 4, label: 'Assets', n: true }], [['Regional arboretum image set', 'CC BY 4.0', 'display, print in proposals', 'n/a', '1,140'], ['Nursery photo library', 'commercial', 'display, print, no AI training', day(c, 24), '612'], ['Extension trait tables', 'public domain', 'all', 'n/a', '3,980'], ['Hobbyist plant photos', 'CC BY-NC', 'display only, blocked from proposals', 'n/a', '210']], { dense: true }) + `<div class="cd-b">${ab(c, 'kb', 'Start takedown', { audit: 'kb.license.takedown', hide: true })}</div>` });
  } else {
    body = h.card({ title: 'Nursery availability feeds', body: h.kv([['Feeds', '14 nurseries (Nursery Connect uploads)'], ['Freshness', '12 within 7 days'], ['SKU match rate to KB plants', '91%'], ['Errors (7 days)', '2 parse failures']]) });
  }
  return h.page({ title: 'Plant KB', sub: 'Curator workbench. Curators never see tenant business data; tenant signals are aggregated counts (02 §5.13)' }) + roBanner(c) + tb + body;
});
RL.act('cx-regdiff', () => { RL.toast('Region diff (mock): +1 county (Berrien off), 1,212 Properties change Region, 38 tenants notified at release.'); return false; });

// =====================================================================================
// Content (19 PA-080 to PA-084)
// =====================================================================================
const contentEdit = (c, tab) => own(c) || (c.role === 'platform_support' && ['help', 'announce'].includes(tab)) || (c.role === 'platform_curator' && ['palettes', 'samples', 'pricebooks'].includes(tab));
RL.screen('console.content', (c) => {
  const [tb, cur] = tabsN('cx.cnt', [['templates', 'Templates'], ['pricebooks', 'Starter price books'], ['help', 'Help center'], ['announce', 'Announcements'], ['samples', 'Sample datasets'], ['palettes', 'Palettes and symbols'], ['notes', 'Release notes']]);
  const ed = contentEdit(c, cur);
  const edB = (label, audit, o) => ed ? B(label, Object.assign({ a: { 'data-modal': 'cx-act', 'data-k': 'content', 'data-g': 'F', 'data-id': label, 'data-title': label, 'data-tn': '', 'data-two': (o && o.two) ? '1' : '0', 'data-audit': audit, 'data-sum': (o && o.sum) || '', 'data-extra': '', 'data-stepup': '0', 'data-blast': (o && o.blast) || '' } }, o && o.kind ? { kind: o.kind } : {})) : '';
  let body = '';
  if (cur === 'templates') body = h.card({ title: 'Template library', sub: 'Forked templates show "Update available" with a three-way diff; subscribed (legal) templates propagate and need a second reviewer (PA-081)', flush: true, body: h.table([{ k: 0, label: 'Template', m: true }, { k: 1, label: 'Type' }, { k: 2, label: 'Version' }, { k: 3, label: 'Locales' }, { k: 4, label: 'Model', fmt: v => h.pill(v, v === 'subscribed' ? 'warn' : '') }, { k: 5, label: 'Reach', n: true }], [['proposal.residential_maintenance', 'Proposal', 'v12', 'en-US, es-US, en-CA', 'forked', '1,104'], ['proposal.design_build_install', 'Proposal', 'v9', 'en-US, es-US', 'forked', '688'], ['sms.on_our_way', 'SMS', 'v6', 'en-US, es-US', 'forked', '1,412'], ['legal.tcpa_consent', 'Legal clause', 'v4', 'en-US, es-US', 'subscribed', '1,962'], ['legal.pesticide_notice.wi', 'Legal clause', 'v2', 'en-US', 'subscribed', '214'], ['coa.us_landscape', 'Chart of accounts', 'v5', 'en-US', 'forked', '1,301'], ['checklist.irrigation_winterization', 'Checklist', 'v3', 'en-US, es-US', 'forked', '402']], { dense: true }) + `<div class="cd-b flex">${edB('Publish update', 'template.publish', { blast: '1,104 tenants see "update available"' })}${edB('Publish legal clause', 'template.publish.subscribed', { two: true, blast: '1,962 tenants receive it automatically' })}</div>` });
  else if (cur === 'pricebooks') body = h.card({ title: 'Starter price books and production rates', sub: 'By service line and Region; copied into the tenant at onboarding', flush: true, body: h.table([{ k: 0, label: 'Price book' }, { k: 1, label: 'Region' }, { k: 2, label: 'Items', n: true }, { k: 3, label: 'Updated' }], [['Maintenance (mow, edge, cleanup)', 'Central Ohio', 146, day(c, -30)], ['Design-build (beds, patios, walls)', 'Chicagoland and NW Indiana', 212, day(c, -12)], ['Lawn programs (5-step)', 'Southeast Wisconsin', 38, day(c, -60)], ['Irrigation and lighting', 'West Michigan', 94, day(c, -21)]], { dense: true }) + `<div class="cd-b">${edB('Edit price book', 'content.pricebook.edit')}</div>` });
  else if (cur === 'help') body = h.card({ title: 'Help center', sub: 'EN/ES at launch; drafts are never retrievable by the in-app Copilot (PA-082)', flush: true, body: h.table([{ k: 0, label: 'Article' }, { k: 1, label: 'Audience', m: true }, { k: 2, label: 'Lang' }, { k: 3, label: 'Helpful', n: true }, { k: 4, label: 'State', fmt: v => h.pill(v, v === 'published' ? 'ok' : '') }], [['Connect your own Stripe account', 'owner', 'EN, ES', '94%', 'published'], ['Actualizar la app de cuadrilla', 'technician', 'ES, EN', '97%', 'published'], ['Why texting needs carrier approval (10DLC)', 'owner', 'EN, ES', '88%', 'published'], ['Snow carve-out during billing holds', 'owner', 'EN', '-', 'draft']], { dense: true }) + `<div class="cd-b flex">${edB('New article', 'help.article.create')}${ed ? B('AI draft and translate', { kind: 'ai', icon: 'spark', a: { 'data-act': 'cx-aidraft' } }) : ''}</div>` });
  else if (cur === 'announce') body = h.card({ title: 'In-app announcements', sub: 'Frequency caps: one modal per user per day, never in the crew app during a visit, never on the dispatch board 5-9 am local (PA-084)', flush: true, body: h.table([{ k: 0, label: 'Announcement' }, { k: 1, label: 'Type' }, { k: 2, label: 'Targeting', fmt: v => `<span class="tiny">${esc(v)}</span>` }, { k: 3, label: 'Window' }, { k: 4, label: 'State', fmt: v => h.pill(v, v === 'live' ? 'ok' : '') }], [['Snow & Ice module: storm command center', 'banner', 'plan grow+, segment snow, role owner', c.winter ? 'live' : 'Oct 15', c.winter ? 'live' : 'scheduled'], ['Carrier SMS delays (INC-322)', 'banner (critical)', 'tenants with SMS on affected carrier', 'until resolved', 'live'], ['Plant palette update for your Region', 'toast', 'design roles, by Region', 'next KB release', 'scheduled'], ['NPS (owners, quarterly)', 'survey', 'role owner, not 5-9 am', day(c, 14), 'scheduled']], { dense: true }) + `<div class="cd-b">${edB('New announcement', 'announcement.create', { sum: 'Critical banners bypass caps and need a second review.' })}</div>` });
  else if (cur === 'samples') body = h.card({ title: 'Sample datasets', sub: 'The demo Company every trial can toggle (22 §4.6)', body: h.kv([['Standard', '"Greenleaf Grounds Co.": 120 clients, a year of visits, designs, invoices and GL'], ['Large (sales demos)', '180 residential + 22 commercial clients, two HOAs with board approvals, 260 Properties'], ['Demo tenants', '48 active, flagged is_demo, excluded from revenue and health, auto-delete after 30 days idle']]) + edB('Regenerate seed', 'content.sample.regenerate') });
  else if (cur === 'palettes') body = h.card({ title: 'Palettes and symbol families', flush: true, body: h.table([{ k: 0, label: 'Palette' }, { k: 1, label: 'Region' }, { k: 2, label: 'Plants', n: true }, { k: 3, label: 'Symbol families' }], [['Low-maintenance shrubs', 'Central Ohio', 34, 'Deciduous shrub, evergreen shrub'], ['Pollinator border', 'Chicagoland and NW Indiana', 41, 'Perennial, grass'], ['Salt-tolerant drive edge', 'West Michigan', 22, 'Shrub, grass, groundcover'], ['Shade woodland', 'Southeast Wisconsin', 28, 'Perennial, fern, groundcover']], { dense: true }) + `<div class="cd-b">${edB('Edit palette', 'kb.palette.edit')}</div>` });
  else body = h.card({ title: 'Release notes', sub: '"What\'s new" shows only what a tenant actually has, unless marked as an upsell (PA-083)', body: h.timeline([{ when: day(c, -2), text: 'Crew app 2.18: offline photo retry, Spanish voice notes', tone: 'ok' }, { when: day(c, -9), text: 'Design Studio: HD render on self-hosted route (Grow, Pro)', tone: 'ok' }, { when: day(c, -16), text: 'Portal: autopay mandate re-collection link', tone: 'ok' }]) });
  return h.page({ title: 'Content', sub: 'Templates, starter price books, help center, announcements and sample datasets' }) + (!ed ? h.banner(`${icon('eye')} Read-only for ${esc(ROLE_LBL[c.role])} on this tab (${esc(navv(c))}, 21 §5.5).`, 'info') : '') + tb + body;
});
RL.act('cx-aidraft', () => { RL.toast('AI draft and translation queued for human review (mock). Drafts are never retrievable by the tenant Copilot.'); return false; });

// =====================================================================================
// AI Ops (19 PA-090 to PA-096, §6.7; 22 §7.4)
// =====================================================================================
const AIR = [
  ['copilot.chat', 'claude-mid > claude-small', '3.1 s', 0.2, 0.011, 'on'], ['proposal.write_scope', 'claude-mid > claude-frontier', '9.8 s', 0.4, 0.042, 'on'], ['estimate.draft_from_notes', 'claude-mid > claude-small', '7.2 s', 0.3, 0.071, 'on'],
  ['restyle.preview', 'image-primary > image-fallback', '21 s', 1.9, 0.090, 'degraded'], ['layout.plan', 'claude-frontier + solver', '34 s', 0.8, 0.150, 'on'], ['kb.answer', 'claude-small + KB retrieval', '1.4 s', 0.1, 0.003, 'on'],
  ['kb.enrich', 'claude-mid (batch)', 'batch', 0.2, 0.004, 'on'], ['inbox.classify', 'claude-small', '0.9 s', 0.1, 0.0009, 'on'], ['receipt.extract', 'claude-small (batch)', 'batch', 0.3, 0.006, 'on'],
];
const RATES = [['Copilot answer', 1, 0.005], ['Estimate or proposal draft', 8, 0.071], ['Photo mockup set (4)', 40, 0.24], ['Mockup refinement', 10, 0.07], ['Dimension-aware layout (3)', 60, 0.41], ['Plant palette recommendation', 3, 0.012], ['Document page', 2, 0.008], ['Presentation 4K re-render (V1)', 40, 0.21]];
RL.screen('console.ai', (c) => {
  const role = c.role;
  let list = [['routing', 'Model routing'], ['prompts', 'Prompt registry'], ['evals', 'Evals'], ['cost', 'Cost and margin'], ['moderation', 'Moderation', 12], ['kill', 'Kill switches']];
  if (role === 'platform_curator') list = [['evals', 'Plant-related evals']];
  if (role === 'platform_finance') list = [['cost', 'Cost and margin']];
  const [tb, cur] = tabsN('cx.ai', list);
  const day0 = c.winter ? { cr: '121K', cost: '$1,020', rev: '$2,560', m: 60 } : { cr: '214K', cost: '$1,610', rev: '$4,490', m: 64 };
  let body = '';
  if (cur === 'routing') body = h.card({ title: 'Model routing by task', sub: 'Route labels are tier aliases resolved by the AI Gateway; a model upgrade is a routing change behind an eval gate (19 §6.7)', flush: true, body: h.table([{ k: 0, label: 'Task', m: true }, { k: 1, label: 'Route (primary > fallback)', m: true }, { k: 2, label: 'p95', n: true }, { k: 3, label: 'Errors', n: true, fmt: v => v > 1 ? `<span style="color:var(--warn-text)">${v}%</span>` : v + '%' }, { k: 4, label: 'Cost/call', n: true, fmt: v => '$' + v.toFixed(v < .01 ? 4 : 3) }, { k: 5, label: 'Switch', fmt: v => h.pill(v, v === 'on' ? 'ok' : 'warn') }], AIR, { dense: true }) + `<div class="cd-b flex">${ab(c, 'ai', 'Edit route', { id: 'route', audit: 'ai.route.edit', hide: true, two: role === 'platform_engineer', sum: 'Staging first. Production needs the eval gate and a peer approval (19 §9.1).' })}<span class="tiny t3">Provider health: primary text p95 2.9 s, headroom 64% · image primary 1.9% errors, failover armed</span></div>` });
  else if (cur === 'prompts') body = h.card({ title: 'Prompt registry', sub: 'Versioned artifacts referenced by key; no prompt text in services (PA-091)', flush: true, body: h.table([{ k: 0, label: 'Prompt', m: true }, { k: 1, label: 'Version', m: true }, { k: 2, label: 'dev' }, { k: 3, label: 'staging' }, { k: 4, label: 'prod-canary' }, { k: 5, label: 'prod' }, { k: 6, label: 'Eval suite', m: true }], [['proposal.write_scope', '4.3.0', '4.4.0-rc1', '4.3.0', '4.3.0', '4.2.1', 'scope-150'], ['kb.enrich', '3.2.0', '3.3.0', '3.2.0', '-', '3.2.0', 'kb-enrich-400'], ['inbox.classify', '2.0.4', '2.0.4', '2.0.4', '-', '2.0.4', 'inbox-1k'], ['restyle.plan', '1.9.0', '2.0.0', '1.9.0', '1.9.0', '1.8.2', 'mockup-300']], { dense: true }) + `<div class="cd-b flex">${ab(c, 'ai', 'Promote to prod', { id: 'promote', audit: 'ai.prompt.promote', hide: true, two: true, sum: 'Blocked automatically if any gating metric regresses beyond tolerance (PA-092).' })}${ab(c, 'ai', 'Roll back', { id: 'rollback', audit: 'ai.prompt.rollback', hide: true })}</div>` });
  else if (cur === 'evals') {
    const all = [['kb.answer region-fit', '99.4%', '>= 99%', 'ok', true], ['kb.enrich acceptance (curators)', '87%', '>= 80%', 'ok', true], ['palette.recommend zone-correct', '99.7%', '>= 99%', 'ok', true], ['proposal.write_scope match', '93.1%', '>= 92%', 'ok', false], ['restyle.preview fidelity', '4.2 / 5', '>= 4.0', 'ok', false], ['estimate.draft hallucination', '3.8%', '<= 5%', 'ok', false], ['restyle.plan 2.0.0 plant-in-palette', '97.9%', '>= 99%', 'blocked', false]];
    const rows = role === 'platform_curator' ? all.filter(r => r[4]) : all;
    body = h.card({ title: role === 'platform_curator' ? 'Plant-related evals' : 'Eval suites', sub: 'Release gates: a change cannot reach prod if a gating metric regresses (PA-092)', flush: true, body: h.table([{ k: 0, label: 'Suite', m: true }, { k: 1, label: 'Score', n: true }, { k: 2, label: 'Gate', n: true }, { k: 3, label: 'Status', fmt: v => h.pill(v, v === 'ok' ? 'ok' : 'danger') }], rows, { dense: true }) + (role === 'platform_curator' ? h.note('Curators review plant outputs as part of human sampling; other suites are not shown to this role (21 §5.5).') : '') });
  } else if (cur === 'cost') {
    body = h.kpis([{ label: 'Credits today', value: day0.cr, ai: true }, { label: 'Provider cost', value: day0.cost }, { label: 'Credit revenue (alloc.)', value: day0.rev }, { label: 'Margin', value: day0.m + '%', tone: 'ok', delta: 'target 72% blended' }])
      + h.card({ title: 'Cost per action vs credit price', sub: 'Guardrail: alert when the 7-day median raw cost exceeds 45% of credit revenue at the lowest pack price ($0.017 per credit) (22 §7.4)', flush: true, body: h.table([{ k: 0, label: 'Action' }, { k: 1, label: 'Credits', n: true }, { k: 1, label: 'Revenue at $0.017', n: true, fmt: v => '$' + (v * 0.017).toFixed(3) }, { k: 2, label: 'Median raw cost', n: true, fmt: v => '$' + v.toFixed(3) }, { k: 2, label: 'Cost share', n: true, fmt: (v, r) => { const s = v / (r[1] * 0.017) * 100; return `<span style="color:${s > 45 ? 'var(--danger-text)' : 'inherit'}">${Math.round(s)}%</span>`; } }, { k: 2, label: 'Guardrail', fmt: (v, r) => v / (r[1] * 0.017) > .45 ? h.pill('breach: re-price or re-route', 'danger') : h.pill('ok', 'ok') }], RATES, { dense: true }) + `<div class="cd-b tiny t3">Estimate drafts breach the guardrail: APR-2301 proposes 8 → 10 credits with 60 days' notice. Re-routing to a cached small model is the alternative.</div>` })
      + h.cols('2', [h.card({ title: 'Top tenants by AI cost (7 days)', flush: true, body: h.table([{ k: 0, label: 'Tenant' }, { k: 1, label: 'Cost', n: true }, { k: 2, label: 'vs subscription', n: true }], [['TNT-48877 (illustrative)', '$412', c.winter ? '0.4x' : '1.6x'], ['Kestrel Lawn franchise system', '$188', '0.02x'], ['Oak Hollow Landscapes', '$61', '0.06x'], ['Lakeshore Hardscape', '$44', '0.06x']], { dense: true }) }), h.card({ title: 'Alerts', body: h.list([{ icon: 'warn', tone: 'warn', title: c.winter ? 'No tenant over 3x its 7-day average' : 'TNT-48877 spend 12x its 7-day average', sub: 'Mockups: 2,300 in 48 h' }, { icon: 'check', tone: 'ok', title: 'Platform spend ' + (c.winter ? '96%' : '118%') + ' of daily forecast', sub: 'Alert threshold 120%' }]) })]);
  } else if (cur === 'moderation') body = h.card({ title: 'Moderation and image-quality queue', sub: 'Prompt-injection attempts are blocked and sampled here (PA-094)', flush: true, body: h.table([{ k: 0, label: 'Item', m: true }, { k: 1, label: 'Type' }, { k: 2, label: 'Tenant' }, { k: 3, label: 'Signal' }], [['MOD-5512', 'Image: third-party logo in mockup', 'TNT-49155', 'auto-blocked'], ['MOD-5509', 'Prompt injection in inbound email to agent', 'TNT-48644', 'blocked, 7 today'], ['MOD-5507', 'Face in uploaded property photo', 'TNT-48720', 'auto-blurred'], ['MOD-5503', 'Volume anomaly: scripted mockups', 'TNT-48877', 'sent to Risk']], { dense: true }) });
  else body = h.card({ title: 'AI kill switches', sub: 'Global, provider, model, task, tenant, user. Effect within 15 seconds; in-flight durable jobs pause and resume (PA-095)', flush: true, body: h.table([{ k: 0, label: 'Level' }, { k: 1, label: 'Target', m: true }, { k: 2, label: 'State', fmt: v => h.pill(v, v === 'on' ? 'ok' : v === 'degraded' ? 'warn' : 'danger') }, { k: 1, label: '', fmt: (v, r) => ab(c, 'kill', r[2] === 'on' ? 'Degrade or kill' : 'Restore', { t: v, two: r[0] === 'Global', stepup: true, audit: 'ai.kill_switch', hide: true }) }], [['Global', 'ai.*', 'on'], ['Provider', 'image-primary', 'degraded'], ['Task', 'layout.plan', 'on'], ['Tenant', 'TNT-48877', 'degraded']], { dense: true }) });
  return h.page({ title: 'AI Ops', sub: `Today: ${day0.cr} credits · provider cost ${day0.cost} · credit revenue (allocated) ${day0.rev} · margin ${day0.m}%` }) + roBanner(c) + tb + body;
});

// =====================================================================================
// Comms Ops (19 PA-100 to PA-104)
// =====================================================================================
RL.screen('console.comms', (c) => {
  const ro = RO(c), T = allT(c);
  const [tb, cur] = tabsN('cx.com', [['tdlc', '10DLC board'], ['numbers', 'Numbers'], ['domains', 'Sender domains'], ['deliver', 'Deliverability'], ['consent', 'Opt-out and consent']].concat(c.inLens('V1') ? [['surge', 'Surge planning ' + h.tag('V1')], ['voice', 'Voice and push ' + h.tag('V1')]] : []));
  let body = '';
  if (cur === 'tdlc') {
    const cols = [['not_started', 112], ['profile_submitted', 18], ['brand_pending', 14], ['brand_failed', 3], ['campaign_pending', 23], ['campaign_rejected', 4], ['live', 1203]];
    const fail = T.find(t => t.tdlc === 'campaign_rejected') || T[0];
    body = h.kpis([{ label: 'Live campaigns', value: num(1203) }, { label: 'Pending', value: 55, delta: 'median 11 days (estimate 2-4 weeks)' }, { label: 'Rejected or failed', value: 7, tone: 'danger', delta: 'assistant drafted fixes' }, { label: 'Sole proprietor brands', value: 61, delta: 'flag for upgrade once EIN exists' }])
      + h.board(cols.map(([s, n]) => ({ title: s, sub: num(n), cards: T.filter(t => t.tdlc === s).slice(0, 4).map(t => ({ title: esc(t.name), sub: `${t.tid} · ${t.state === 'trial' ? 'trial: SMS off until live' : planN(t.plan)}`, meta: t.tdlc.includes('fail') || t.tdlc.includes('reject') ? h.pill('fix ready', 'danger') : '', go: 'console.tenant', x: t.id })) })))
      + h.cols('2', [
        h.aiCard({ agent: 'Rejection assistant', level: 'L1', title: `${esc(fail.name)}: campaign rejected`, body: 'Carrier reason: "Opt-in not verifiable." Plain-language fix: your website does not show an SMS opt-in or a privacy policy. We added both to your Rootline site and rewrote the campaign description from your real reminder templates.', why: 'Drafted by AI from the carrier rejection code; a person resubmits. Platform-paid, no tenant credits.', actions: ab(c, 'comms', 'Resubmit campaign', { t: fail.name, audit: 'comms.10dlc.resubmit', hide: true }) }),
        h.card({ title: 'Brand sizing for snow tenants', body: `<p class="small">Snow tenants are sized on storm-day peak, not monthly average: a 300-lot contractor sends "pushed at 4:10 am" proof texts in a burst. Recommend a standard brand when forecast peak-day volume exceeds the low-volume daily cap (verify current caps).</p>` + h.kv([['Snow tenants on low-volume brands', '14'], ['Recommended upgrade', '6']]) }),
      ]);
  } else if (cur === 'numbers') body = h.card({ title: 'Phone numbers', sub: 'One Twilio subaccount per tenant. Released 30 days after churn, with a port-out option (PA-101)', flush: true, body: h.table([{ k: 0, label: 'Tenant' }, { k: 1, label: 'Number', m: true }, { k: 2, label: 'Type' }, { k: 3, label: 'Status', fmt: v => h.pill(v, v === 'active' ? 'ok' : 'info') }], [['Greenleaf Grounds Co.', '+1 614 555 01••', 'local', 'active'], ['Summit Grounds Group', '+1 614 555 02••', 'ported in (FOC ' + day(c, -200) + ')', 'active'], ['Northfield Snow & Landscape', '+1 262 555 01••', 'local', 'waiting on campaign'], ['Huron Valley Grounds', '+1 810 555 01••', 'local', 'release on ' + day(c, -11 + 30)], ['Kestrel Lawn franchise system', '38 numbers', 'local per location', 'active']], { dense: true }) });
  else if (cur === 'domains') body = h.card({ title: 'Sender domains', sub: 'Validated against Gmail, Yahoo and Outlook.com bulk-sender rules: one pass or fail per provider (PA-102)', flush: true, body: h.table([{ k: 0, label: 'Tenant' }, { k: 1, label: 'Domain', m: true }, { k: 2, label: 'SPF · DKIM · DMARC' }, { k: 3, label: 'Gmail · Yahoo · Outlook' }], [['Greenleaf Grounds Co.', 'mail.greenleafgrounds.example', 'pass · pass · p=quarantine', h.pill('pass', 'ok') + h.pill('pass', 'ok') + h.pill('pass', 'ok')], ['Reyes Outdoor Living', 'reyes.mail.rootline.app', 'managed', h.pill('pass', 'ok') + h.pill('pass', 'ok') + h.pill('pass', 'ok')], ['Lakeshore Hardscape', 'mail.lakeshorehardscape.example', 'pass · fail · p=none', h.pill('fail', 'danger') + h.pill('pass', 'ok') + h.pill('fail', 'danger')]].map(r => r), { dense: true }) });
  else if (cur === 'deliver') body = h.kpis([{ label: 'Delivery rate (7 d)', value: '99.1%', tone: 'ok' }, { label: 'Hard bounces', value: '0.42%' }, { label: 'Spam complaints', value: '0.04%', delta: 'warn 0.1 · throttle 0.2 · pause 0.3', tone: 'ok' }, { label: 'SMS delivered', value: c.winter ? '96.4%' : '97.8%', delta: 'INC-322 carrier delay', tone: 'warn' }])
    + h.card({ title: 'Tenants near a threshold', flush: true, body: h.table([{ k: 0, label: 'Tenant' }, { k: 1, label: 'Stream' }, { k: 2, label: 'Complaints', n: true }, { k: 3, label: 'Action', fmt: v => h.pill(v, v.includes('throttle') ? 'warn' : '') }], [['TNT-51877 (illustrative)', 'SMS broadcast', '6.8% opt-out', 'restricted, suspension requested'], ['Lakeshore Hardscape', 'Email broadcast', '0.14%', 'warned'], ['Two Rivers Irrigation', 'Email broadcast', '0.21%', 'auto-throttle broadcasts']], { dense: true }) + `<div class="cd-b">${ab(c, 'comms', 'Remove a suppression', { audit: 'comms.suppression.remove', hide: true, repeat: true, sum: 'For example a client fixed their mailbox. Reason code required.' })}</div>` });
  else if (cur === 'consent') body = h.cols('2', [h.card({ title: 'Revocation by any reasonable means (US)', body: h.kv([['Keyword opt-outs (7 d)', '1,912'], ['Free-text revocations, high confidence', '138 opted out immediately'], ['Medium confidence', '41 sent to tenant inbox, auto-apply in 24 h'], ['Languages', 'English and Spanish']]) }), h.card({ title: 'CASL (Canadian recipients)', body: h.kv([['Consent basis recorded', '98.2%'], ['Implied consent lapsing in 30 days', '212 recipients'], ['Blocked marketing sends (7 d)', '17']]) })]);
  else if (cur === 'surge') body = h.card({ title: 'Surge forecast', sub: 'Scheduled reminders, recurring invoice runs and weather (PA-104)', body: h.colchart(['Today', '+1', '+2', '+3', '+4', '+5', '+6'], [{ values: c.winter ? [180, 420, 210, 190, 160, 150, 140] : [310, 290, 340, 300, 280, 120, 110], cls: 'c2' }], { h: 120, label: 'Forecast SMS segments (thousands)' }) + h.note(c.winter ? '+1 day: 4-inch snowfall forecast across West Michigan and Southeast Wisconsin. 14 brands pre-checked against throughput; 2 warned.' : 'Monday reminder runs peak. No weather surge expected.') });
  else body = h.card({ title: 'Voice and push', body: h.kv([['CNAM registered', '1,102 numbers'], ['STIR/SHAKEN attestation', 'A on 98%'], ['Two-party consent states', 'recording disclosure on'], ['APNs/FCM credentials', 'expire in 211 days'], ['Push delivery', '99.3% (crew app 2.18)']]) });
  return h.page({ title: 'Comms Ops', sub: 'Rootline is the ISV: each Company is its own 10DLC brand with its own campaigns and Twilio subaccount' }) + roBanner(c) + tb + body;
});

// =====================================================================================
// Payments oversight (19 PA-110 to PA-115, §6.10): read-only by design
// =====================================================================================
RL.screen('console.payments', (c) => {
  const T = allT(c).filter(t => t.stripe !== 'none' || ['greenleaf', 'hermanos'].includes(t.id));
  const extra = [{ name: 'Coastline Hardscape (illustrative)', tid: 'TNT-49611', stripe: 'rak', id: '' }];
  const views = [['all', 'All', () => true], ['deadline', 'Deadline 7 days or less', t => t.stripe === 'req'], ['charges', 'Charges off', t => ['off', 'disc'].includes(t.stripe)], ['disc', 'Disconnected', t => t.stripe === 'disc' || t.stripe === 'none'], ['rak', 'Restricted key failing', t => t.stripe === 'rak']];
  const v = views.find(x => x[0] === RL.ui['cx.pv']) || views[0];
  const rows = T.concat(extra).filter(v[2]);
  const [tb, cur] = tabsN('cx.pay', [['accounts', 'Connected accounts'], ['webhooks', 'Webhooks'], ['disputes', 'Disputes and fraud ' + h.tag('V1')], ['volume', 'Volume via Rootline'], ['rules', 'Compliance rule tables']]);
  let body = '';
  if (cur === 'accounts') body = `<div class="flex">${views.map(([id, l, f]) => B(`${esc(l)} <span class="t3">${T.concat(extra).filter(f).length}</span>`, { kind: v[0] === id ? 'primary' : '', a: { 'data-ui': 'cx.pv', 'data-val': id } })).join('')}</div>`
    + h.card({ flush: true, body: h.table([
      { k: 'name', label: 'Tenant', fmt: (x, t) => `<b>${esc(x)}</b> ${mono(t.tid)}` },
      { k: 'stripe', label: 'Method · gen', fmt: x => mono(x === 'rak' ? 'restricted_key' : 'oauth') + ' ' + mono(x === 'rak' ? '-' : 'v1') },
      { k: 'stripe', label: 'Charges', fmt: x => h.pill(['on', 'req', 'rak'].includes(x) ? 'on' : 'off', ['on', 'req', 'rak'].includes(x) ? 'ok' : 'danger') },
      { k: 'stripe', label: 'Payouts', fmt: x => h.pill(['on', 'req', 'rak'].includes(x) ? 'on' : 'off', ['on', 'req', 'rak'].includes(x) ? 'ok' : 'danger') },
      { k: 'stripe', label: 'Due', n: true, fmt: x => x === 'req' ? '1' : '-' },
      { k: 'stripe', label: 'Deadline', fmt: x => x === 'req' ? esc(day(c, 6)) : '-' },
      { k: 'stripe', label: 'Reason', fmt: x => `<span class="tiny">${x === 'disc' ? 'deauthorized ' + esc(day(c, -5)) : x === 'none' ? 'not connected (trial)' : x === 'rak' ? 'key check failed 2 h ago' : x === 'req' ? 'company.tax_id' : '-'}</span>` },
      { k: 'name', label: '', fmt: (x, t) => ['req', 'disc', 'none', 'rak'].includes(t.stripe) ? ab(c, 'safe', t.stripe === 'disc' ? 'CSM task' : 'Nudge', { t: x, audit: 'payments.nudge_owner', hide: true, repeat: true, nav: 'Payments oversight' }) : '' },
    ], rows, { dense: true }) }) + h.note('Nudges go to the owner and office manager at 7 and 2 days before current_deadline, and immediately when charges_enabled turns false (PA-110).');
  else if (cur === 'webhooks') body = h.card({ title: 'Stripe endpoints', sub: 'Replays re-fetch from the Stripe API; stored payloads are never trusted (PA-112)', flush: true, body: h.table([{ k: 0, label: 'Endpoint', m: true }, { k: 1, label: 'Rate', n: true }, { k: 2, label: 'p95', n: true }, { k: 3, label: 'DLQ', n: true }, { k: 4, label: 'Sig failures 24 h', n: true }], [['/webhooks/stripe/connect', '212/min', '1.8 s', 3, 0], ['/webhooks/stripe/platform', '3/min', '0.4 s', 0, 0], ['/webhooks/stripe/v2', '41/min', '0.9 s', 0, 0], ['/webhooks/stripe/direct/{token}', '2/min', '0.6 s', 0, 0], ['/webhooks/stripe/saas', '6/min', '0.5 s', 0, 0]], { dense: true }) + `<div class="cd-b flex">${ab(c, 'safe', 'Replay event by ID', { audit: 'payments.webhook.replay', hide: true, repeat: true, nav: 'Payments oversight' })}${ab(c, 'safe', 'Reprocess DLQ', { audit: 'payments.webhook.dlq_reprocess', hide: true, nav: 'Payments oversight', blast: '3 events, 2 tenants' })}</div>` });
  else if (cur === 'disputes') body = h.kpis([{ label: 'Platform dispute rate (90 d)', value: '0.21%' }, { label: 'Above 0.75% (CSM alert)', value: 3, tone: 'warn' }, { label: 'Near network thresholds', value: 0, tone: 'ok' }, { label: 'Top reason', value: 'not received', delta: 'per-visit mowing' }])
    + h.card({ title: 'Watch list', sub: 'Internal thresholds: watch 0.5%, CSM 0.75%, risk review 1.0%, and no alert under 5 disputes in 30 days (PA-113)', flush: true, body: h.table([{ k: 0, label: 'Tenant' }, { k: 1, label: '30 d', n: true }, { k: 2, label: '90 d', n: true }, { k: 3, label: 'Pattern' }], [['Pine Ridge Grounds', '0.91%', '0.82%', '"Service not rendered" on per-visit mowing: crew GPS and photos are the evidence'], ['TNT-49611 (illustrative)', '1.1%', '0.6%', 'Card testing on the portal pay page: 3DS friction flag on'], ['Fernwood Garden Design', '0%', '0.4%', 'Below the 5-dispute floor: no alert']], { dense: true }) + `<div class="cd-b">${ab(c, 'payhold', 'Rootline payments hold', { two: true, audit: 'payments.rootline_hold', hide: true, nav: 'Payments oversight', sum: 'Stops Rootline from creating new charges for one tenant. Does not touch funds or Stripe\'s own controls.' })}</div>` });
  else if (cur === 'volume') body = h.kpis([{ label: 'Volume via Rootline (30 d)', value: c.winter ? '$9.8M' : '$31.4M' }, { label: 'Card vs ACH', value: '58% / 42%' }, { label: 'Portal autopay adoption', value: '54%' }, { label: 'Avg days to pay', value: '6.1' }]) + h.card({ title: 'By segment', body: h.bars([['design_build', 12.1], ['commercial_maintenance', 8.4], ['maintenance', 5.2], ['lawn_programs', 3.6], ['irrigation', 2.1]].map(([l, x]) => ({ label: l, value: x, max: 13, right: '$' + (c.winter ? (x * .31).toFixed(1) : x) + 'M' }))) });
  else body = h.card({ title: 'Payments compliance rule tables', sub: 'Versioned data with effective dates. Finance drafts with a citation per row; the founder approves; effective 7+ days out (PA-115). Values are placeholders to verify with counsel', flush: true, body: h.table([{ k: 0, label: 'Jurisdiction' }, { k: 1, label: 'Card surcharge' }, { k: 2, label: 'Max', n: true }, { k: 3, label: 'Debit excluded' }, { k: 4, label: 'Version' }], [['Ohio', 'allowed with disclosure (verify)', '3.0%', 'yes', '2027.1'], ['Michigan', 'allowed with disclosure (verify)', '3.0%', 'yes', '2027.1'], ['Illinois', 'allowed with disclosure (verify)', '3.0%', 'yes', '2027.1'], ['Indiana', 'allowed with disclosure (verify)', '3.0%', 'yes', '2027.1'], ['Wisconsin', 'allowed with disclosure (verify)', '3.0%', 'yes', '2027.1'], ['Ontario', 'allowed under network rules (verify)', '2.4%', 'yes', '2027.1']], { dense: true }) + `<div class="cd-b flex">${ab(c, 'catalog', 'Draft rule-set 2027.2', { two: true, audit: 'payments.rules.publish', hide: true, nav: 'Payments oversight', blast: 'Tenants with surcharging on in changed jurisdictions' })}</div>` });
  return h.page({ title: 'Payments oversight', sub: `${num(1342)} connected accounts · 97.9% charges enabled` }) + h.banner(`${icon('shield')} No charge, refund, payout or dispute-response actions exist on this screen, by design. Client money sits in each Company's own Stripe account (19 §6.10, 08).`, 'warn') + roBanner(c) + tb + body;
});

// =====================================================================================
// Risk and trust (19 PA-120 to PA-123)
// =====================================================================================
RL.screen('console.risk', (c) => {
  const Q = [
    ['RSK-3301', 'SMS abuse', 'TNT-51877 (illustrative)', 'high', 'Opt-out 6.8% on one campaign; purchased-list pattern', 'feature_restriction applied; suspension requested (APR-2303)'],
    ['RSK-3298', 'Signup manual_review', 'TNT-51288 (illustrative)', 'high', 'VoIP owner phone, device reused across 3 trials, proxy IP', 'allow_with_limits: no SMS, AI capped at 50 credits'],
    ['RSK-3295', 'AI moderation', 'TNT-48877 (illustrative)', 'medium', '2,300 mockups in 48 h; credit-farming pattern', 'throttled'],
    ['RSK-3290', 'Phishing scan', 'portal.custom-domain.example', 'high', 'New custom domain hosts a non-Rootline login form', 'domain disabled pending review'],
    ['RSK-3287', 'Dispute alert', 'Pine Ridge Grounds', 'low', 'Dispute rate 0.82% (90 d)', 'CSM contacted'],
    ['RSK-3284', 'Signup manual_review', 'Hermanos Garcia Lawn Care', 'low', 'Disposable email domain on a second user', 'cleared: business verified'],
  ];
  const [tb, cur] = tabsN('cx.rsk', [['queue', 'Review queue', Q.length], ['ladder', 'Enforcement ladder'], ['appeals', 'Appeals'], ['signals', 'Signup screening']]);
  let body = '';
  if (cur === 'queue') body = h.card({ title: 'Trust and Safety queue', sub: 'SLA: 4 business hours for high severity, 2 business days for low (PA-123)', flush: true, body: h.table([{ k: 0, label: 'Case', m: true }, { k: 1, label: 'Type' }, { k: 2, label: 'Subject' }, { k: 3, label: 'Sev', fmt: v => h.pill(v, v === 'high' ? 'danger' : v === 'medium' ? 'warn' : '') }, { k: 4, label: 'Signals', fmt: v => `<span class="tiny">${esc(v)}</span>` }, { k: 5, label: 'Status', fmt: v => `<span class="tiny">${esc(v)}</span>` }, { k: 0, label: '', fmt: (v, r) => `<div class="flex nw gap4">${ab(c, 'risk', 'Warn', { t: v, audit: 'risk.enforcement.warning', hide: true })}${ab(c, 'risk', 'Restrict', { t: v, id: 'restrict', extra: 'scope', audit: 'risk.enforcement.feature_restriction', hide: true })}${ab(c, 'suspend_risk', 'Suspend', { t: v, two: true, audit: 'tenant.lifecycle.suspend', hide: true })}</div>` }], Q, { dense: true }) });
  else if (cur === 'ladder') body = h.card({ title: 'Enforcement ladder', sub: 'Never deletes data. Each step carries evidence, the Acceptable Use Policy clause, a notice template and a 14-day appeal window (PA-122)', body: `<div class="steps"><span class="done">warning</span><span class="done">feature_restriction</span><span class="on">suspension (two-person)</span><span>termination (two-person + founder)</span></div>` + h.kv([['Support', 'warn and restrict now; suspension needs a second approver'], ['Founder', 'approves suspension and termination'], ['Termination', 'moves the tenant to suspended with export-only access, then normal churn retention'], ['Client payments', 'keep flowing to the Company\'s own Stripe unless a Rootline payments hold is approved']]) });
  else if (cur === 'appeals') body = h.card({ title: 'Appeals', flush: true, body: h.table([{ k: 0, label: 'Appeal', m: true }, { k: 1, label: 'Enforcement' }, { k: 2, label: 'Reviewer (not the enforcer)' }, { k: 3, label: 'Due' }], [['APL-0112', 'feature_restriction SMS on TNT-49801', 'Founder', day(c, 6)], ['APL-0109', 'allow_with_limits on TNT-51203', 'Maya D.', day(c, 2)]], { dense: true }) });
  else body = h.card({ title: 'Signup screening (7 days)', body: h.bars([['allow', 188], ['allow_with_limits', 17], ['manual_review', 5], ['block', 1]].map(([l, v]) => ({ label: l, value: v, max: 188, tone: l === 'block' ? 'danger' : l === 'manual_review' ? 'warn' : '', right: v }))) + h.note('Signals: disposable email, VoIP owner phone, IP reputation and proxy, device reuse, geography mismatch, velocity, card checks on card-required trials (PA-120).') });
  return h.page({ title: 'Risk and trust', sub: 'Review queue and enforcement with reason codes' }) + roBanner(c) + tb + body;
});

// =====================================================================================
// Compliance (19 PA-130 to PA-136, §6.11)
// =====================================================================================
RL.screen('console.compliance', (c) => {
  const list = c.role === 'platform_support' ? [['dsar', 'DSAR queue', 7]] : [['dsar', 'DSAR queue', 7], ['holds', 'Legal holds', 3], ['retention', 'Retention'], ['subproc', 'Subprocessors'], ['soc2', 'SOC 2 evidence'], ['breach', 'Breach register'], ['audit', 'Audit search']];
  const [tb, cur] = tabsN('cx.cmp', list);
  const D = [
    ['DSAR-0193', 'deletion', 'homeowner (client of 2 tenants)', 'processor', 'routed to Greenleaf (approved, tax exception) and Clintonville Commons HOA manager (awaiting owner)', day(c, 9) + ' CCPA'],
    ['DSAR-0197', 'access', 'tenant user', 'controller', 'identity verified; export package building', day(c, 33) + ' GDPR'],
    ['DSAR-0198', 'opt-out of sale/sharing', 'site visitor', 'controller', 'auto-fulfilled (marketing cookies off)', 'done'],
    ['DSAR-0199', 'correction', 'trial signup', 'controller', 'email verification sent', day(c, 28) + ' PIPEDA'],
    ['DSAR-0200', 'deletion', 'client of Reyes Outdoor Living', 'processor', 'fulfillment kit sent to the Company', day(c, 4) + ' CCPA'],
  ];
  let body = '';
  if (cur === 'dsar') body = h.card({ title: 'DSAR queue', sub: 'Controller requests Rootline fulfils; processor requests route to the Company with a fulfillment kit. Escalation at 7 and 2 days before due (PA-130)', flush: true, body: h.table([{ k: 0, label: 'Request', m: true }, { k: 1, label: 'Type' }, { k: 2, label: 'Subject' }, { k: 3, label: 'Role', fmt: v => h.pill(v, v === 'processor' ? 'info' : '') }, { k: 4, label: 'Status', fmt: v => `<span class="tiny">${esc(v)}</span>` }, { k: 5, label: 'Due', fmt: v => /CCPA/.test(v) && /^(May 15|Jan 16)/.test(v) ? `<b style="color:var(--warn-text)">${esc(v)}</b>` : esc(v) }], D, { dense: true }) + `<div class="cd-b flex">${ab(c, 'dsar', 'New DSAR', { audit: 'compliance.dsar.create', hide: true, repeat: true })}${c.role === 'platform_support' ? '<span class="tiny t3">Support has read access to the DSAR queue only (21 §5.5).</span>' : ''}</div>` });
  else if (cur === 'holds') body = h.card({ title: 'Legal holds', sub: 'Visible only to compliance-permissioned staff. A hold suspends lifecycle deletion, DSAR deletion and retention jobs (PA-132)', flush: true, body: h.table([{ k: 0, label: 'Hold', m: true }, { k: 1, label: 'Scope' }, { k: 2, label: 'Matter' }, { k: 3, label: 'Since' }, { k: 0, label: '', fmt: v => ab(c, 'hold', 'Release', { t: v, two: true, audit: 'compliance.legal_hold.release', hide: true, sum: 'Release re-enables pending deletions after a 7-day delay.' }) }], [['LH-2026-07', 'Tenant: Lakeshore Snow Pros, data classes: snow logs, photos', 'Slip-and-fall claim (client of the Company)', day(c, -120)], ['LH-2026-11', 'User: 1 tenant user', 'Employment dispute', day(c, -60)], ['LH-2027-02', 'Tenant: TNT-51877, all classes', 'SMS abuse investigation', day(c, -1)]], { dense: true }) + `<div class="cd-b">${ab(c, 'hold', 'Apply legal hold', { audit: 'compliance.legal_hold.apply', hide: true, repeat: true })}</div>` });
  else if (cur === 'retention') body = h.card({ title: 'Retention policies', sub: 'Nightly jobs with dry-run reports; any change is two-person and versioned (PA-131)', flush: true, body: h.table([{ k: 0, label: 'Data class' }, { k: 1, label: 'Default' }, { k: 2, label: 'Tenant override' }], [['Platform audit log', '7 years', 'no'], ['Ledger and invoices', 'tenant-controlled, jurisdiction minimum shown', 'yes'], ['Pesticide application records', 'per state rule (verify)', 'longer only'], ['GPS breadcrumbs', '13 months', 'shorter only'], ['Session replays', '30 days', 'no'], ['Call recordings', '90 days', 'yes'], ['Migration files', '30 days after commit', 'no']], { dense: true }) + `<div class="cd-b">${ab(c, 'retention', 'Propose policy change', { two: true, audit: 'compliance.retention.change', hide: true })}</div>` });
  else if (cur === 'subproc') body = h.card({ title: 'Subprocessor registry', sub: 'Public page generated from here; new subprocessors announced 30+ days before use (PA-133)', flush: true, body: h.table([{ k: 0, label: 'Category' }, { k: 1, label: 'Purpose' }, { k: 2, label: 'Data' }, { k: 3, label: 'Location' }, { k: 4, label: 'Review' }], [['Cloud hosting', 'Compute, Postgres, storage', 'all tenant data', 'US; CA for prod-ca', day(c, -40)], ['Payments (Stripe)', 'SaaS billing; Connect metadata', 'billing, account status', 'US', day(c, -90)], ['Messaging (Twilio)', 'SMS, voice', 'phone numbers, message bodies', 'US', day(c, -75)], ['Email delivery', 'Transactional and broadcast email', 'emails, message bodies', 'US', day(c, -75)], ['AI providers', 'Text and image models, zero retention', 'prompts, photos', 'US', day(c, -20)], ['Maps and parcel data', 'Geocoding, routing, parcels', 'addresses', 'US', day(c, -110)]], { dense: true }) });
  else if (cur === 'soc2') body = h.cols('2', [h.card({ title: 'SOC 2 evidence (Security)', body: h.kv([['Controls with automated evidence', '96%'], ['Quarterly access review', 'Q' + (c.winter ? '4' : '1') + ' signed, 0 exceptions'], ['Offboarding within 15 min', '100% (1 this quarter)'], ['Approval records for risky changes', '214 this quarter'], ['Backup restore test', day(c, -18) + ' passed'], ['Postmortems linked', '3 of 3']]) }), h.card({ title: 'Policies', flush: true, body: h.table([{ k: 0, label: 'Policy' }, { k: 1, label: 'Version' }, { k: 2, label: 'Acknowledged', n: true }], [['Information security', 'v3', '10/10'], ['Acceptable use (staff)', 'v2', '10/10'], ['Incident response', 'v4', '9/10']], { dense: true }) })]);
  else if (cur === 'breach') body = h.card({ title: 'Breach register', sub: 'Every confidentiality incident is recorded, including ones that need no notification. Clocks start when a case opens (PA-136)', flush: true, body: h.table([{ k: 0, label: 'Case', m: true }, { k: 1, label: 'Opened' }, { k: 2, label: 'Scope' }, { k: 3, label: 'Outcome' }], [['BRC-2026-003', day(c, -84), 'Misdirected export email, 1 tenant, 12 client contacts', 'no notification required; retained to 2028'], ['BRC-2026-002', day(c, -170), 'Support search over-broad (internal)', 'access review tightened']], { dense: true }) + h.note('Open breach cases: 0. Card data is out of scope by design (SAQ-A, card data only in Stripe Elements).') });
  else body = h.card({ title: 'Audit search', body: `<div class="flex"><span style="flex:1 1 260px">${h.input('', { ui: 'cx.aq', ph: 'actor, tenant, action, reason code, date range', label: 'Audit search' })}</span>${B('Search', { a: { 'data-act': 'cx-search' } })}</div>` + h.note('Same index as Staff and audit; results respect your role\'s audit scope (19 §9.1).') });
  return h.page({ title: 'Compliance desk', sub: 'DSARs open 7 (2 due in 7 days) · legal holds 3 · breach cases 0 · evidence 96%' }) + roBanner(c) + tb + body;
});

// =====================================================================================
// Platform analytics (19 PA-140 to PA-147; 22 §7)
// =====================================================================================
RL.screen('console.analytics', (c) => {
  const r = c.role;
  let list = [['revenue', 'Revenue and churn'], ['cohorts', 'Cohorts'], ['funnel', 'Activation funnel'], ['adoption', 'Feature adoption']].concat(c.inLens('V1') ? [['nps', 'NPS and CSAT ' + h.tag('V1')], ['unit', 'Unit economics ' + h.tag('V1')]] : []);
  if (r === 'platform_curator') list = [['kb', 'KB metrics']];
  if (r === 'platform_support') list = [['funnel', 'Activation funnel'], ['adoption', 'Feature adoption'], ['support', 'Support metrics']].concat(c.inLens('V1') ? [['nps', 'NPS and CSAT ' + h.tag('V1')]] : []);
  if (r === 'platform_engineer') list = [['funnel', 'Activation funnel'], ['adoption', 'Feature adoption']].concat(c.inLens('V1') ? [['unit', 'Unit economics (cost only) ' + h.tag('V1')]] : []);
  const [tb, cur] = tabsN('cx.ana', list);
  const m = PM(c);
  let body = '';
  if (cur === 'revenue') body = h.kpis([{ label: 'Logo churn (trailing 12 mo)', value: '1.7%/mo', delta: 'model 1.6% Grow, 3.5% Starter', tone: '' }, { label: 'GRR (12 mo)', value: '91%' }, { label: 'NRR (12 mo)', value: '108%', delta: 'target 105%+', tone: 'ok' }, { label: 'Involuntary share', value: '24%', delta: 'of churned MRR' }, { label: 'Winter Mode contraction', value: c.winter ? '$11.2k' : '$0', delta: 'reported apart from churn' }])
    + h.cols('2', [h.card({ title: 'MRR movement', body: mrrChart(c, m) }), h.card({ title: 'Churn reasons (90 days)', sub: 'Exit survey + CSM classification. Seasonal lens: Winter Mode is not churn (PA-141)', body: h.bars([['Price', 31], ['Went out of business', 18], ['Switched to a competitor', 16], ['Missing feature', 14], ['Seasonal (no Winter Mode yet)', 12], ['Sold business', 9]].map(([l, v]) => ({ label: l, value: v, max: 31, tone: 'warn', right: v + '%' }))) })]);
  else if (cur === 'cohorts') {
    const rows = [['Jan 2026', 96, 93, 90, 88, 86, 84], ['Mar 2026', 97, 94, 91, 89, 87, ''], ['May 2026', 95, 92, 89, 88, '', ''], ['Aug 2026', 96, 93, 91, '', '', ''], ['Nov 2026', 98, 96, '', '', '', ''], ['Jan 2027', 98, '', '', '', '', '']].slice(0, c.winter ? 6 : 6);
    const cell = v => v === '' ? '<span class="t3">-</span>' : `<span style="display:inline-block;min-width:38px;padding:1px 4px;border-radius:4px;background:color-mix(in srgb, var(--primary) ${Math.round((v - 80) * 4)}%, transparent)">${v}%</span>`;
    body = h.card({ title: 'Logo retention by signup cohort', sub: 'Measured on a trailing-12-month basis so winter pauses do not inflate churn (PA-142)', flush: true, body: h.table([{ k: 0, label: 'Cohort' }].concat(['M1', 'M3', 'M6', 'M9', 'M12', 'M15'].map((l, i) => ({ k: i + 1, label: l, n: true, fmt: cell }))), rows, { dense: true }) })
      + h.card({ title: 'By migration source (12-month logo retention)', body: h.bars([['Came from Jobber', 90], ['Came from LMN', 92], ['Came from Service Autopilot', 88], ['Spreadsheets', 81], ['No prior system', 74]].map(([l, v]) => ({ label: l, value: v, max: 100, right: v + '%' }))) });
  } else if (cur === 'funnel') body = h.card({ title: 'Activation funnel', sub: 'visit → signup → ... → Activated → paid → 90-day retained (PA-143)', body: funnelBars(c) }) + h.card({ title: 'Drop-off reasons (micro-surveys)', body: h.bars([['"Not ready to connect Stripe yet"', 38], ['"Importing takes too long"', 24], ['"Crew still on the old app"', 21], ['"Waiting for texting approval"', 17]].map(([l, v]) => ({ label: esc(l), value: v, max: 40, right: v + '%' }))) });
  else if (cur === 'adoption') body = h.card({ title: 'Feature adoption', sub: '% of entitled tenants using it in the last 30 days; keys match entitlement and flag keys (PA-144)', flush: true, body: h.table([{ k: 0, label: 'Feature', m: true }, { k: 1, label: 'Adoption', fmt: v => `<div style="width:160px" class="flex nw gap4">${h.progress(v, 100)}<span class="tiny">${v}%</span></div>` }, { k: 2, label: 'Depth', n: true }, { k: 3, label: 'Retention lift', n: true }], [['crew_app', 94, '41 visits/wk', '+9 pts'], ['portal_branded', 81, '62% clients', '+6 pts'], ['ai_mockups', 57, '9 sets/mo', '+5 pts'], ['ledger_essentials', 63, '-', '+11 pts'], ['automations', 38, '3 rules', '+3 pts'], ['design_3d', 29, '4 renders/mo', '+2 pts']], { dense: true }) });
  else if (cur === 'nps') body = h.kpis([{ label: 'Owner NPS (quarterly)', value: '+46' }, { label: 'Office users', value: '+38' }, { label: 'Field users', value: '+52', delta: 'Spanish-first +57' }, { label: 'CSAT after tickets', value: '94%' }]) + h.aiCard({ agent: 'Verbatim themes', level: 'L0', title: 'Top themes this quarter', body: '1. "Crew app works offline in the back lots" (praise). 2. "3D renders are slow on big yards". 3. "Texting approval took weeks".', why: 'AI clusters verbatims; numbers come from the survey table. Platform-paid.' });
  else if (cur === 'unit') {
    const costOnly = r === 'platform_engineer';
    body = h.card({ title: 'Unit economics by tier', sub: 'Model from 22 §7 next to measured trailing-90-day values. Allocations, not exact costs' + (costOnly ? '. Engineers see cost lines only (19 §9.1)' : ''), flush: true, body: h.table([{ k: 0, label: 'Tier' }, { k: 1, label: 'ARPA model / measured', n: true, fmt: v => costOnly ? mk('Revenue: hidden for Engineer') : v }, { k: 2, label: 'COGS model / measured', n: true }, { k: 3, label: 'GM', n: true, fmt: v => costOnly ? mk('Margin: hidden for Engineer') : v }, { k: 4, label: 'Churn/mo', n: true }, { k: 5, label: 'Payback', n: true, fmt: v => costOnly ? mk('Hidden') : v }], [['Starter', '$95 / $91', '$26.80 / $28.10', '72% / 69%', '3.5% / 3.9%', '8.8 / 9.6 mo'], ['Grow', '$340 / $352', '$90.50 / $86.20', '73% / 76%', '1.6% / 1.4%', '10.1 / 9.2 mo'], ['Pro', '$860 / $905', '$225 / $214', '74% / 76%', '1.0% / 0.8%', '11.8 / 10.9 mo'], ['Enterprise', '$3,200 / $11,982', '$850 / $1,910', '73% / 84%', '0.6% / 0%', 'n/a (1 logo)']], { dense: true }) })
      + h.card({ title: 'COGS per Grow account (measured)', body: h.bars([['Support and run-time CS', 21], ['SMS and voice', 17.4], ['Cloud infra', 16.8], ['Maps and parcels', 9.6], ['AI inference', 9.9], ['SaaS payment processing', 8.2], ['Bank feeds and other', 3.3]].map(([l, v]) => ({ label: l, value: v, max: 22, right: '$' + v.toFixed(2) }))) });
  } else if (cur === 'kb') body = h.kpis([{ label: 'Plant searches (30 d)', value: '48,210' }, { label: 'Search misses', value: '1.9%' }, { label: 'Palette plants used in designs', value: '612 of 640' }, { label: '"Failed in my area" reports', value: 7 }]) + h.card({ title: 'Most-used palette plants (anonymized)', body: h.bars([['Little bluestem', 1840], ["Walker's Low catmint", 1622], ['Serviceberry', 1210], ['Fragrant sumac', 1105], ['Prairie dropseed', 980]].map(([l, v]) => ({ label: l, value: v, max: 1840, right: num(v) }))) + h.note('Counts across tenants, never per-tenant business data (02 §5.13).') });
  else body = h.kpis([{ label: 'Tickets per 100 tenants (wk)', value: c.winter ? '3.1' : '6.9' }, { label: 'First response median', value: c.winter ? '22 min' : '38 min' }, { label: 'Deflected by help Copilot', value: '41%' }, { label: 'Escalations to engineering', value: '4%' }]) + h.card({ title: 'Ticket volume forecast', body: h.colchart(['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], [{ values: [420, 690, 880, 720, 540, 480], cls: 'c2' }], { h: 120, label: 'Forecast tickets per month' }) + h.note('Spring spike in March-May; snow-event spikes in winter for snow tenants (PA-060).') });
  return h.page({ title: 'Platform analytics', sub: 'Every metric has a definition, owner, source and change log, shared with investor reporting (PA-147)' }) + roBanner(c) + tb + body;
});

// =====================================================================================
// System health (19 PA-150 to PA-155; 20 §6.5 Integrity center)
// =====================================================================================
const SVCS = [['Company web app', '182 ms', '640 ms', 0.08, '99.97%', '99.9%'], ['Crew app sync', '410 ms', '1.9 s', 0.21, '99.71%', '99.5%'], ['Customer portal', '240 ms', '810 ms', 0.05, '99.98%', '99.9%'], ['Payments (Rootline side)', '120 ms', '390 ms', 0.02, '99.99%', '99.95%'], ['Notifications (SMS, email)', '1.1 s', '9.4 s', 1.4, '99.2%', '99.5%'], ['Design Studio and AI', '3.1 s', '21 s', 0.6, '99.6%', '99.0%'], ['Integrations (QuickBooks, Xero)', '820 ms', '4.2 s', 0.9, '99.4%', '99.0%'], ['Admin API and console', '95 ms', '310 ms', 0.01, '99.99%', '99.9%']];
const svcTable = () => h.table([{ k: 0, label: 'Service' }, { k: 1, label: 'p50', n: true }, { k: 2, label: 'p99', n: true }, { k: 3, label: 'Errors', n: true, fmt: v => v > 1 ? `<span style="color:var(--warn-text)">${v}%</span>` : v + '%' }, { k: 4, label: '30-day', n: true }, { k: 5, label: 'SLO', n: true, fmt: (v, r) => parseFloat(r[4]) < parseFloat(v) ? h.pill(v + ' burning', 'warn') : h.pill(v, 'ok') }], SVCS, { dense: true });
const INTEG = c => [
  { name: 'Stripe (Connect + Billing)', tenants: 1342, err: 3, top: 'DLQ: 3 events, 2 tenants', quota: '-', cred: 'ok' },
  { name: 'QuickBooks Online', tenants: 214, err: 37, top: '"Duplicate Name Exists" (22 tenants)', quota: '61%', cred: '4 refresh failures' },
  { name: 'Twilio (SMS, voice)', tenants: 1188, err: 212, top: 'carrier delay 4-9 min (INC-322)', quota: '44%', cred: 'ok' },
  { name: 'Plaid (bank feeds)', tenants: 611, err: 9, top: 'ITEM_LOGIN_REQUIRED', quota: '-', cred: 'ok' },
  { name: 'AI providers (text, image)', tenants: 1702, err: 14, top: 'image primary 1.9% errors, failover armed', quota: '64% headroom', cred: 'ok' },
  { name: 'Regrid (parcels)', tenants: 1500, err: 1, top: 'timeout', quota: '72%', cred: 'ok' },
  { name: 'Routing and maps', tenants: 1500, err: 0, top: '-', quota: '48%', cred: 'ok' },
  { name: 'Email delivery', tenants: 1902, err: 0, top: '-', quota: '31%', cred: 'ok' },
  { name: 'Xero (V1)', tenants: 22, err: 0, top: '-', quota: '-', cred: 'ok' },
];
const integTable = (c, rows) => h.table([{ k: 'name', label: 'Integration' }, { k: 'tenants', label: 'Tenants', n: true, fmt: v => num(v) }, { k: 'err', label: 'With errors', n: true, fmt: v => v ? `<b style="color:var(--warn-text)">${v}</b>` : '0' }, { k: 'top', label: 'Top error', fmt: v => `<span class="tiny">${esc(v)}</span>` }, { k: 'quota', label: 'Quota', n: true }, { k: 'cred', label: 'Credentials', fmt: v => `<span class="tiny">${esc(v)}</span>` }], rows, { dense: true });
const WORKFLOWS = c => [{ name: 'Recurring visit generation', run: 1820, fail: 0 }, { name: 'Nightly invoice runs', run: 1214, fail: 2 }, { name: 'Health score recompute', run: 1962, fail: 0 }, { name: 'Mockup batches', run: c.winter ? 410 : 940, fail: 11 }, { name: 'Migration commits', run: 6, fail: 0 }, { name: 'Retention jobs', run: 48, fail: 0 }];
RL.screen('console.health', (c) => {
  const [tb, cur] = tabsN('cx.hl', [['services', 'Services'], ['queues', 'Queues and jobs'], ['integ', 'Integrations'], ['incidents', 'Incidents and status'], ['integrity', 'Integrity center'], ['maint', 'Maintenance']].concat(c.inLens('V1') ? [['cells', 'Cells ' + h.tag('V1')]] : []));
  let body = '';
  if (cur === 'services') body = h.kpis([{ label: 'API availability (30 d)', value: '99.96%', tone: 'ok', delta: 'error budget 61% left' }, { label: 'Crew sync within 60 s', value: '99.71%', tone: 'ok' }, { label: 'DB replica lag', value: '180 ms' }, { label: 'RLS violations blocked (24 h)', value: '0', tone: 'ok' }]) + h.card({ title: 'Golden signals by service', flush: true, body: svcTable(c) });
  else if (cur === 'queues') body = h.cols('2', [h.card({ title: 'Temporal workflows (24 h)', flush: true, body: h.table([{ k: 'name', label: 'Workflow' }, { k: 'run', label: 'Completed', n: true, fmt: v => num(v) }, { k: 'fail', label: 'Failed', n: true, fmt: v => v ? `<b style="color:var(--warn-text)">${v}</b>` : '0' }, { k: 'name', label: '', fmt: (v, w) => w.fail ? ab(c, 'incident', 'Retry failed', { t: v, audit: 'workflow.retry', hide: true, repeat: true }) : '' }], WORKFLOWS(c), { dense: true }) }), h.card({ title: 'Lag and backlog', body: h.kv([['Outbox oldest unpublished', '2.4 s'], ['Event bus consumer lag (max)', 'billing-projector 14 s'], ['Mobile pending mutations', '1,204 across 388 devices'], ['Sync conflicts per hour', '3.1'], ['Scheduled jobs', 'recurring visits 2:00 am, invoice runs 4:00 am, health 5:00 am ET']]) + `<div class="flex">${ab(c, 'incident', 'Pause a consumer', { audit: 'queue.consumer.pause', hide: true })}${ab(c, 'incident', 'Drain to dead-letter', { audit: 'queue.drain', hide: true })}</div>` })]);
  else if (cur === 'integ') body = h.card({ title: 'Integration error console', sub: 'Example: "QBO sync: 214 tenants, 37 with errors in the last 24 h" (PA-152)', flush: true, body: integTable(c, INTEG(c)) });
  else if (cur === 'incidents') body = h.cols('21', [h.card({ title: 'Incidents', flush: true, body: incList(c), actions: ab(c, 'incident', 'Declare incident', { audit: 'incident.declare', hide: true, repeat: true }) }), h.card({ title: 'Status page', body: h.list([['Company web app', 'ok'], ['Crew app sync', 'ok'], ['Customer Portal', 'ok'], ['Payments (Rootline side)', 'ok'], ['Notifications (SMS/email)', 'warn'], ['Design Studio and AI', 'ok'], ['Integrations', 'ok'], ['API', 'ok']].map(([l, t]) => ({ icon: t === 'ok' ? 'check' : 'warn', tone: t, title: esc(l), right: h.pill(t === 'ok' ? 'operational' : 'degraded', t) }))) + `<div class="cd-b">${ab(c, 'incident', 'Publish update', { audit: 'status.publish', hide: true, repeat: true })}</div>` })]) + h.note('Season-aware on-call: heavier 5-9 am coverage per time zone in April-June and during forecast snow events (PA-154).');
  else if (cur === 'integrity') body = h.banner(`${icon('shield')} Metadata only: counts, ids, amounts, error codes. Opening a tenant's records still needs a Support Access Grant (20 §6.5).`, 'info')
    + h.cols('3', [h.card({ title: 'Ledger (L1-L12)', body: h.kv([['Unbalanced entries', '0'], ['L7 drift cases open', '1'], ['L4 duplicate attempts', '17'], ['Chain-head anchor', 'OK 02:00']]) }), h.card({ title: 'Stripe webhooks', body: h.kv([['Ingest p99', '140 ms'], ['DLQ depth', '3 (2 tenants)'], ['Unknown account quarantine', '1'], ['Sig failures/min', '0.1']]) }), h.card({ title: 'Crew sync', body: h.kv([['Applied first time', '99.7%'], ['Rejected (open)', '41'], ['Devices > 3 d unsynced', '12'], ['Below min protocol', '4']]) })])
    + h.card({ title: 'Open cases', flush: true, body: h.table([{ k: 0, label: 'Sev' }, { k: 1, label: 'Type' }, { k: 2, label: 'Tenant (cell)' }, { k: 3, label: 'Detail' }, { k: 4, label: 'Age' }, { k: 1, label: '', fmt: (v, r) => ab(c, 'runbook', r[5], { t: r[2], audit: 'runbook.execute', hide: true, two: true, sum: 'Versioned Runbook Action: dry run first, reason code required, written to both audit logs.' }) }], [['P1', 'L7 Stripe clearing', 'TNT-50211 (us-2)', 'Drift $412.18 vs payout', '3 h', 'Resync payout'], ['P2', 'Webhook DLQ', 'Reyes Outdoor Living (us-1)', 'charge.dispute.created', '5 h', 'Replay event'], ['P2', 'Accounting sync', 'Kalamazoo Stoneworks (us-3)', 'QBO: 6 records quarantined 3 d', '3 d', 'Notify bookkeeper'], ['P3', 'Sync rejections', 'Summit Grounds Group (us-2)', '14 visit.complete after cancel', '1 d', 'Nudge ops manager']], { dense: true }) });
  else if (cur === 'maint') body = h.card({ title: 'Maintenance windows', body: h.kv([['Default', 'Sunday 1-4 am Eastern'], ['Never', 'Weekday mornings 5-10 am local in any served time zone; first business days of the month'], ['Notice', '72 hours via status page and in-app'], ['Next', day(c, 5) + ', 1:00-2:30 am ET: Postgres minor upgrade, canary cell first']]) });
  else body = h.card({ title: 'Cell placement', sub: 'About 2,500 tenants per US cell is the planning estimate (PA-018)', flush: true, body: h.table([{ k: 0, label: 'Cell', m: true }, { k: 1, label: 'Tenants', n: true }, { k: 2, label: 'Schema', m: true }, { k: 3, label: 'Replica lag', n: true }, { k: 4, label: 'Hottest tenant' }], [['us-1 (canary)', 702, '2027.05.2', '120 ms', 'Oak Hollow Landscapes'], ['us-2', 688, '2027.05.1', '180 ms', 'Summit Grounds Group'], ['us-3', 524, '2027.05.1', '90 ms', 'Lakeshore Hardscape'], ['prod-ca', 47, '2027.05.1', '70 ms', 'Escarpment Gardens'], ['dedicated kl-1', 1, '2027.05.1', '40 ms', 'Kestrel Lawn franchise system']], { dense: true }) + `<div class="cd-b">${ab(c, 'runbook', 'Request rebalance', { two: true, audit: 'cell.rebalance', hide: true })}</div>` });
  return h.page({ title: 'System health', sub: 'Services, queues, integrations, incidents and the Integrity center' }) + roBanner(c) + tb + body;
});

// =====================================================================================
// Partners (19 PA-160 to PA-163; 22 §5.4) [V1]
// =====================================================================================
const PARTNERS = [
  { id: 'PRT-0031', name: 'Liu & Partners CPAs', track: 'Accountants / CPAs', tier: 'Silver', refs: 9, terms: '15% for 24 months or 10% client discount, per client', accrued: 612, status: 'active' },
  { id: 'PRT-0044', name: 'Lakeside Bookkeeping Co.', track: 'Accountants / CPAs', tier: 'Registered', refs: 3, terms: '15% for 24 months or 10% client discount, per client', accrued: 141, status: 'active' },
  { id: 'PRT-0012', name: 'GreenPath Business Coaching', track: 'Consultants and coaches', tier: 'Gold', refs: 27, terms: '20% revenue share, year 1', accrued: 2210, status: 'active' },
  { id: 'PRT-0058', name: 'Turf Talk with Dee (creator)', track: 'Creators / affiliates', tier: 'Silver', refs: 14, terms: '20% of first-year revenue, 60-day cookie', accrued: 1015, status: 'active' },
  { id: 'PRT-0063', name: 'Lakes Region Landscape Association (illustrative)', track: 'Associations', tier: 'Silver', refs: 11, terms: '10% member discount + 10% share, year 1', accrued: 208, status: 'active' },
  { id: 'PRT-0071', name: 'Hollow Creek Horticulture Program', track: 'Schools', tier: 'Registered', refs: 0, terms: 'Free education tenants', accrued: 0, status: 'active' },
];
RL.screen('console.partners', (c) => {
  const [tb, cur] = tabsN('cx.prt', [['dir', 'Directory', PARTNERS.length], ['comm', 'Commissions'], ['payouts', 'Payouts'], ['attr', 'Attribution']]);
  let body = '';
  if (cur === 'dir') body = h.card({ title: 'Partner directory', sub: 'Tiers: Registered 0-4, Silver 5-19, Gold 20+ referred paying Companies; downgrades wait 90 days (PA-160)', flush: true, body: h.table([{ k: 'name', label: 'Partner', fmt: (v, p) => `<b>${esc(v)}</b> ${mono(p.id)}` }, { k: 'track', label: 'Track' }, { k: 'tier', label: 'Tier', fmt: v => h.pill(v, v === 'Gold' ? 'accent' : v === 'Silver' ? 'info' : '') }, { k: 'refs', label: 'Paying refs', n: true }, { k: 'terms', label: 'Terms', fmt: v => `<span class="tiny">${esc(v)}</span>` }], PARTNERS, { dense: true }) + h.note('Neutrality guard: no partner field can influence plant recommendations, design suggestions or Price Book defaults; sponsored placements are labeled "Sponsored" (PA-160).') });
  else if (cur === 'comm') body = h.card({ title: `Commissions accrued (${c.winter ? 'December' : 'April'})`, sub: 'Accrue monthly on collected subscription revenue, excluding usage, taxes and refunds; clawback on refunds within 60 days', flush: true, body: h.table([{ k: 'name', label: 'Partner' }, { k: 'refs', label: 'Refs', n: true }, { k: 'accrued', label: 'Accrued', n: true, fmt: v => money(v) }, { k: 'accrued', label: 'Payout', fmt: v => v >= 100 ? h.pill('due', 'ok') : h.pill('below $100, carries over', '') }], PARTNERS, { dense: true, foot: ['Total', '', money(PARTNERS.reduce((s, p) => s + p.accrued, 0)), ''] }) + `<div class="cd-b">${ab(c, 'partners', 'Approve commissions', { audit: 'partners.commission.approve', hide: true, blast: '5 partners, ' + money(4186) })}</div>` });
  else if (cur === 'payouts') body = h.card({ title: 'Payouts', sub: 'Rootline\'s own money, monthly once the balance is $100+, through Rootline\'s AP on its own Ledger. W-9 before the first payout (PA-162)', flush: true, body: h.table([{ k: 0, label: 'Payout', m: true }, { k: 1, label: 'Partner' }, { k: 2, label: 'Amount', n: true }, { k: 3, label: 'Tax form' }, { k: 4, label: 'Status', fmt: v => h.pill(v, v === 'paid' ? 'ok' : v === 'held' ? 'warn' : 'info') }], [['PO-2291', 'GreenPath Business Coaching', '$2,210.00', 'W-9 on file', 'scheduled'], ['PO-2290', 'Liu & Partners CPAs', '$612.00', 'W-9 on file', 'scheduled'], ['PO-2289', 'Turf Talk with Dee (creator)', '$1,015.00', 'W-9 missing', 'held'], ['PO-2271', 'GreenPath Business Coaching', '$1,980.00', 'W-9 on file', 'paid']], { dense: true }) });
  else body = h.card({ title: 'Attribution conflicts', sub: 'First-touch link or code valid 60 days; a registered deal locks attribution for 90 days; finance resolves conflicts by the earliest valid registration', flush: true, body: h.table([{ k: 0, label: 'Company' }, { k: 1, label: 'Claims' }, { k: 2, label: 'Earliest valid' }, { k: 3, label: 'Decision' }], [['Cardinal Outdoor', 'GreenPath (link, ' + day(c, -40) + ') · Turf Talk (code, ' + day(c, -14) + ')', 'GreenPath', ab(c, 'partners', 'Resolve', { t: 'Cardinal Outdoor', audit: 'partners.attribution.resolve', hide: true })]], { dense: true }) });
  return h.page({ title: 'Partners', sub: 'Directory, commissions and payouts', tags: h.tag('V1') }) + roBanner(c) + tb + body;
});

// =====================================================================================
// Staff, approvals and audit (19 PA-004, PA-005, PA-170 to PA-173)
// =====================================================================================
const AUDIT = c => [
  ['7:44 am', 'Maya Delgado', 'staff', 'support.search', '-', 'customer_request', 'phone ending 0187 (redacted)', 'support'],
  ['7:31 am', 'system', 'system', 'health.score.recomputed', '1,962 tenants', '-', 'model health-v1.3', 'system'],
  ['7:12 am', 'Sam Iverson', 'staff', 'breakglass.request', 'TNT-50211', 'security_incident', 'APR-2294', 'system'],
  ['6:44 am', 'Maya Delgado', 'staff', 'risk.enforcement.feature_restriction', 'TNT-51877', 'fraud_investigation', 'SMS broadcasts off', 'support'],
  ['6:02 am', 'Tom Becker', 'staff', 'billing.price.change.request', 'catalog', 'billing_adjustment', 'APR-2291', 'billing'],
  ['5:48 am', 'pagerduty', 'system', 'incident.declared', 'INC-322', '-', 'SEV3', 'system'],
  ['3:12 am', 'Sam Iverson', 'staff', 'incident.resolved', 'INC-321', '-', 'QBO backlog drained', 'system'],
  ['yesterday', 'Tom Becker', 'staff', 'billing.refund', 'TNT-49230', 'billing_adjustment', '$69.00', 'billing'],
  ['yesterday', 'Dr. Priya Raman', 'staff', 'kb.release.publish', 'KB release', 'compliance_obligation', '388 changes', 'kb'],
];
RL.screen('console.staff', (c) => {
  const eng = c.role === 'platform_engineer';
  const [tb, cur] = tabsN('cx.stf', eng ? [['audit', 'Audit log (system events)']] : [['approvals', 'Approvals inbox', APPROVALS.filter(a => !apprState(a.id)).length], ['staff', 'Staff and roles', STAFF.length], ['reviews', 'Access reviews'], ['audit', 'Audit log']].concat(c.inLens('V1') ? [['tokens', 'Admin API tokens ' + h.tag('V1')]] : []));
  let body = '';
  if (cur === 'approvals') body = h.banner(`${icon('users')} Two-person rule: requests expire after 4 hours, nobody approves their own, and the founder's trusted second approver is Rafael Okafor (fractional CTO) for the solo-founder phase (PA-004).`, 'info')
    + h.card({ title: 'Approvals inbox', flush: true, body: h.list(APPROVALS.map(a => apprRow(c, a))) });
  else if (cur === 'staff') body = h.card({ title: 'Staff', sub: 'SSO only, phishing-resistant MFA, 8-hour sessions, 30-minute idle timeout. Role changes are two-person (PA-002, PA-170)', flush: true, body: h.table([{ k: 'name', label: 'Person', fmt: (v, s) => `<b>${esc(v)}</b> ${mono(s.id)}<div class="tiny t3">${esc(s.title)}</div>` }, { k: 'role', label: 'Role', fmt: v => mono(v) }, { k: 'key', label: 'Authenticator', fmt: v => `<span class="tiny">${esc(v)}</span>` }, { k: 'last', label: 'Last active' }, { k: 'status', label: 'Status', fmt: v => h.pill(v, v === 'active' ? 'ok' : '') }, { k: 'id', label: '', fmt: (v, s) => s.status === 'active' && s.role !== 'platform_owner' ? ab(c, 'staff', 'Change role', { t: s.name, two: true, audit: 'staff.role.change', hide: true }) : '' }], STAFF, { dense: true }) + `<div class="cd-b">${ab(c, 'staff', 'Invite staff', { audit: 'staff.invite', hide: true, repeat: true })}</div>` });
  else if (cur === 'reviews') body = h.card({ title: `Quarterly access review (Q${c.winter ? '1' : '2'} 2027)`, sub: 'Unreviewed access auto-revokes after 14 days; results are archived as SOC 2 evidence (PA-172)', body: h.meter('Attested', 8, 10) + h.table([{ k: 0, label: 'Staff' }, { k: 1, label: 'Role', m: true }, { k: 2, label: 'Reviewer' }, { k: 3, label: 'State', fmt: v => h.pill(v, v === 'attested' ? 'ok' : 'warn') }], STAFF.filter(s => s.status === 'active').slice(0, 6).map((s, i) => [s.name, s.role, 'Founder', i < 4 ? 'attested' : 'due in 9 days']), { dense: true }) + h.list([{ icon: 'warn', tone: 'warn', title: 'Anomaly flag: a support agent viewed 40 tenants in an hour without tickets', sub: 'Last quarter; reviewed and closed (training session)' }]) });
  else if (cur === 'tokens') body = h.card({ title: 'Admin API service tokens', sub: 'Scoped, IP-restricted, 90-day maximum lifetime, owner and purpose required (PA-180)', flush: true, body: h.table([{ k: 0, label: 'Token', m: true }, { k: 1, label: 'Purpose' }, { k: 2, label: 'Scopes', m: true }, { k: 3, label: 'Expires' }], [['svc_wh_…7Qa', 'Warehouse metrics export', 'metrics:read', day(c, 61)], ['svc_slack_…2Lm', 'Morning Brief to Slack', 'metrics:read, incidents:read', day(c, 34)]], { dense: true }) + `<div class="cd-b">${ab(c, 'staff', 'Create token', { two: true, audit: 'admin_api.token.create', hide: true })}</div>` });
  else {
    const rows = eng ? AUDIT(c).filter(r => r[7] === 'system') : AUDIT(c);
    body = h.card({ title: eng ? 'Platform audit log: system and infra events' : 'Platform audit log', sub: 'Append-only, SHA-256 hash chain, WORM copy with daily anchor; 7-year retention (PA-005)' + (eng ? '. Engineers read system events only (19 §9.1)' : ''), flush: true, body: h.table([{ k: 0, label: 'When' }, { k: 1, label: 'Actor' }, { k: 3, label: 'Action', m: true }, { k: 4, label: 'Target', m: true }, { k: 5, label: 'Reason', m: true }, { k: 6, label: 'Detail', fmt: v => `<span class="tiny">${esc(v)}</span>` }, { k: 3, label: 'Hash', fmt: (v, r) => mono(hsh(v + r[0]).toString(16).padStart(8, '0').slice(0, 8) + '…') }], rows, { dense: true }) + `<div class="cd-b tiny t3">Daily anchor ${day(c, 0)} 00:00 UTC verified at 2:00 am. Nightly verifier: chain intact.</div>` });
  }
  return h.page({ title: 'Staff, approvals and audit', sub: 'Separate identity realm: no staff member holds a tenant membership (02 §5.13)' }) + roBanner(c) + tb + body;
});

// =====================================================================================
// Console settings (19 PA-002, PA-018; 20)
// =====================================================================================
RL.screen('console.settings', (c) => {
  const edit = (label, audit, two) => ab(c, 'settings', label, { audit, hide: true, two, stepup: true });
  return h.page({ title: 'Console settings', sub: 'Security, regions and data residency, Rootline-owned integration keys' }) + roBanner(c)
    + h.cols('2', [
      h.card({ title: 'Security', body: h.kv([['Sign-in', 'SSO only (Google Workspace); Okta or Entra ' + h.tag('V1')], ['MFA', 'WebAuthn security keys or device-bound passkeys; SMS OTP not allowed'], ['Sessions', '8 hours, 30-minute idle timeout'], ['Step-up', 'impersonation, break-glass, price changes, global kill switches, exports, DSAR deletions'], ['Network', 'IP allowlist + device posture via SSO; identity-aware proxy ' + h.tag('V1')]]) + edit('Edit security policy', 'settings.security.edit', true) })
      + h.card({ title: 'Two-person approval policy', body: h.kv([['Trusted second approver', 'Rafael Okafor (fractional CTO), scoped console account'], ['Requests expire', 'after 4 hours'], ['SEV1 exception', 'incident commander may toggle kill switches; approval is retroactive'], ['Default list', 'break-glass, hard delete, legal hold release, global AI kill switch, price and rate-card changes, credits over $1,000, refunds over $1,000, staff elevation, retention changes, regulator notices']]) + edit('Edit approval policy', 'settings.approvals.edit', true) }),
      h.card({ title: 'Regions and data residency', body: h.kv([['US stack', 'us-east, cells us-1 (canary), us-2, us-3, dedicated kl-1'], ['Canada stack', 'prod-ca for PIPEDA and Quebec Law 25 sensitive customers (verify legal need per customer)'], ['Residency rule', 'set at signup from the billing address; immutable without a migration case'], ['Launch Regions', 'Wave 1: ' + REGIONS.join(', ') + '. Wave 2 (Ontario + 4) ' + h.tag('V1')]]) })
      + h.card({ title: 'Rootline-owned integration keys', sub: 'Prefixes only; nobody can reveal a key', flush: true, body: h.table([{ k: 0, label: 'Integration' }, { k: 1, label: 'Key', m: true }, { k: 2, label: 'Rotated' }, { k: 3, label: 'Scope check', fmt: v => h.pill(v, v === 'ok' ? 'ok' : 'warn') }], [['Stripe (SaaS billing account)', 'rk_live_…9fQ', day(c, -48), 'ok'], ['Twilio ISV parent account', 'AC…41e', day(c, -102), 'ok'], ['AI Gateway providers', 'sk-…', day(c, -31), 'ok'], ['Maps and parcels', 'pk.…Xr2', day(c, -175), 'rotate in 5 days']], { dense: true }) + `<div class="cd-b">${edit('Rotate a key', 'settings.key.rotate', false)}</div>` }),
    ]);
});

// =====================================================================================
// Partner portal: Accountant Hub, referrals, resources (02 §7.8; 22 §5.4; 19 PA-161) [V1]
// =====================================================================================
const HUB = c => [
  { id: 'reyes', name: 'Reyes Outdoor Living', close: '6 / 9 steps', cs: 6, unrec: 23, ar90: 4180, tax: 'IL ' + day(c, 9), lock: c.winter ? 'Nov' : 'Mar', sync: 0, grant: 'standing (owner)', assigned: 'Devin Shah', books: 'Rootline Ledger' },
  { id: 'heartland', name: 'Heartland Turf Pros', close: 'Done', cs: 9, unrec: 0, ar90: 0, tax: 'IL ' + day(c, 9), lock: c.winter ? 'Dec' : 'Apr', sync: 0, grant: 'standing (owner)', assigned: 'Karen Liu', books: 'Rootline Ledger' },
  { id: 'foxvalley', name: 'Fox Valley Tree & Turf', close: '2 / 9 steps', cs: 2, unrec: 141, ar90: 12920, tax: 'IL ' + day(c, 9), lock: c.winter ? 'Oct' : 'Feb', sync: 0, grant: 'standing (owner)', assigned: 'Devin Shah', books: 'Rootline Ledger', warn: true },
  { id: 'prairieedge', name: 'Prairie Edge Lawn Care', close: 'Not started', cs: 0, unrec: 8, ar90: 640, tax: '-', lock: c.winter ? 'Nov' : 'Mar', sync: 0, grant: 'tax season, ends ' + day(c, 19), assigned: 'Devin Shah', books: 'Rootline Ledger' },
  { id: 'fernwood', name: 'Fernwood Garden Design', close: 'QuickBooks is the system of record', cs: -1, unrec: 0, ar90: 0, tax: '-', lock: '-', sync: 2, grant: 'standing (owner)', assigned: 'Karen Liu', books: 'QuickBooks Online sync' },
  { id: 'tallgrass', name: 'Tallgrass Design Studio', close: 'QuickBooks is the system of record', cs: -1, unrec: 0, ar90: 0, tax: '-', lock: '-', sync: 0, grant: 'trial, owner invited firm', assigned: 'Karen Liu', books: 'QuickBooks Online sync' },
];
RL.screen('partner.clients', (c) => {
  const member = c.role === 'partner_member';
  const rows = HUB(c).filter(r => !member || r.assigned === 'Devin Shah');
  const period = c.winter ? 'December 2026' : 'April 2027';
  return h.page({ title: 'Liu & Partners CPAs · Accountant Hub', sub: `${esc(c.who)} (${member ? 'staff accountant: assigned clients only' : 'firm admin'}) · close period ${period}`, tags: h.tag('V1'), actions: member ? '' : B('Invite staff', { icon: 'plus', a: { 'data-act': 'cx-pinvite' } }) })
    + h.kpis([{ label: 'Client Companies', value: rows.length }, { label: 'Closed for ' + period.split(' ')[0], value: rows.filter(r => r.cs === 9).length }, { label: 'Unreconciled lines', value: num(rows.reduce((s, r) => s + r.unrec, 0)), tone: 'warn' }, { label: 'Sync errors', value: rows.reduce((s, r) => s + r.sync, 0), tone: rows.some(r => r.sync) ? 'warn' : '' }, { label: 'Grants expiring (30 d)', value: rows.filter(r => /ends/.test(r.grant)).length }])
    + h.card({ title: 'Client Companies', sub: 'Every number is computed by a per-tenant call made under that Company\'s delegation grant. No cross-tenant query (02 §7.8)', flush: true, body: h.table([
      { k: 'name', label: 'Client company', fmt: (v, r) => `<b>${esc(v)}</b><div class="tiny t3">${esc(r.books)} · ${esc(r.assigned)}</div>` },
      { k: 'close', label: 'Close status', fmt: (v, r) => r.cs < 0 ? `<span class="tiny t3">${esc(v)}</span>` : `<div style="width:120px">${h.progress(r.cs, 9, r.cs === 9 ? '' : r.cs < 3 ? 'warn' : 'info')}</div><span class="tiny">${esc(v)}</span>` },
      { k: 'unrec', label: 'Unreconciled', n: true, fmt: v => v > 50 ? `<b style="color:var(--warn-text)">${v} lines</b>` : v + ' lines' },
      { k: 'ar90', label: 'AR > 90 d', n: true, fmt: v => v > 10000 ? `<b style="color:var(--danger-text)">${money(v)}</b>` : money(v) },
      { k: 'sync', label: 'Sync errors', n: true, fmt: v => v ? h.pill(v + ' errors', 'warn') : '0' },
      { k: 'tax', label: 'Sales tax due' }, { k: 'lock', label: 'Lock' },
      { k: 'id', label: '', fmt: (v, r) => `<button type="button" class="btn sm primary" data-set="as=bookkeeper&t=${I.TENANTS[v] ? v : 'reyes'}&r=${r.cs < 0 ? 'web.sync' : 'web.close'}"${I.TENANTS[v] ? '' : ' disabled title="Illustrative client: the explorer only opens the 8 sample tenants"'}>Open books</button>` },
    ], rows, { dense: true }) })
    + h.cols('2', [
      h.card({ title: 'Delegated access', body: h.list(rows.map(r => ({ icon: 'key', tone: /ends|trial/.test(r.grant) ? 'warn' : 'ok', title: esc(r.name), sub: `bookkeeper role · grant: ${esc(r.grant)}`, right: /ends/.test(r.grant) ? B('Ask owner to extend', { a: { 'data-act': 'cx-pextend' } }) : '' }))) + h.note('A Company that revokes the firm disappears from this list on the next refresh, and its cached tiles are purged. Free bookkeeper seats: 2+ per Company when linked to a verified Accountant Partner firm (22 §4.3).') }),
      h.card({ title: 'Close checklist (Reyes Outdoor Living)', body: h.steps(['Bank feeds', 'Reconcile', 'AR review', 'AP review', 'Payroll JE', 'WIP', 'Sales tax', 'Review', 'Lock'], 6) + h.list([{ icon: 'bank', tone: 'warn', title: '23 unreconciled bank lines', sub: 'Operating checking, since ' + day(c, -18) }, { icon: 'receipt', tone: 'info', title: 'Illinois sales tax return', sub: 'Due ' + day(c, 9) }]) }),
    ]);
});
RL.act('cx-pinvite', () => { RL.toast('Invite sent (mock): partner_member, MFA required. Members see assigned clients only and no commissions.'); return false; });
RL.act('cx-pextend', () => { RL.toast('Request sent to the Company owner to extend the delegation grant (mock).'); return false; });
RL.screen('partner.referrals', (c) => {
  const refs = [
    ['Reyes Outdoor Living', 'grow', 'active', 'rev share', 'month 8 of 24', 52.20], ['Heartland Turf Pros', 'pro', 'active', 'rev share', 'month 11 of 24', 121.80], ['Fox Valley Tree & Turf', 'grow', 'restricted', 'client discount', '10% off base, year 1', 0],
    ['Prairie Edge Lawn Care', 'starter', 'active', 'client discount', '10% off base, year 1', 0], ['Fernwood Garden Design', 'design_solo', 'active', 'rev share', 'month 6 of 24', 7.35], ['Tallgrass Design Studio', 'design_solo', 'trial', 'undecided', 'choose before conversion', 0],
  ];
  const opt = RL.ui['cx.ropt'] || 'share';
  return h.page({ title: 'Referrals and commissions', sub: 'Referred Companies show lifecycle state and plan only, never tenant data (PA-161)', tags: h.tag('V1') + ' ' + h.pill('Silver partner: 9 paying referrals', 'info') })
    + h.kpis([{ label: 'Paying referrals', value: 9, delta: 'Gold at 20' }, { label: 'Accrued this month', value: money(612) }, { label: 'Balance for payout', value: money(612), delta: 'paid monthly once $100+', tone: 'ok' }, { label: 'Clawbacks (60 d)', value: 0 }])
    + h.cols('21', [
      h.card({ title: 'Referred Companies', flush: true, body: h.table([{ k: 0, label: 'Company' }, { k: 1, label: 'Plan', fmt: v => esc(planN(v)) }, { k: 2, label: 'State', fmt: v => stP(v) }, { k: 3, label: 'Option', fmt: v => h.pill(v, v === 'rev share' ? 'ok' : v === 'undecided' ? 'warn' : 'info') }, { k: 4, label: 'Term', fmt: v => `<span class="tiny">${esc(v)}</span>` }, { k: 5, label: 'Accrued', n: true, fmt: v => money(v, { cents: true }) }], refs, { dense: true }) }),
      `<div class="stack12">${h.card({ title: 'Per-client choice', sub: '15% revenue share for 24 months, or a 10% discount for the client. You choose per client (22 §5.4.1)', body: `<div class="flex">${B('15% revenue share, 24 months', { kind: opt === 'share' ? 'primary' : '', a: { 'data-ui': 'cx.ropt', 'data-val': 'share' } })}${B('10% client discount', { kind: opt === 'disc' ? 'primary' : '', a: { 'data-ui': 'cx.ropt', 'data-val': 'disc' } })}</div>` + h.kv(opt === 'share' ? [['Example (Grow annual $249)', '$37.35/mo to the firm for 24 months'], ['Accrues on', 'collected subscription revenue, not usage, taxes or refunds']] : [['Example (Grow annual $249)', 'Client pays $224.10/mo in year 1'], ['Firm earns', 'no commission on this client']]) + B('Apply to Tallgrass Design Studio', { kind: 'primary', a: { 'data-act': 'cx-ropt' } }) })}
      ${h.card({ title: 'Your link and code', body: h.kv([['Link', mono('rootline.com/p/liu-partners')], ['Code', mono('LIUCPA10')], ['Attribution', 'first touch, 60 days; registered deals lock for 90 days']]) + B('Register a deal', { a: { 'data-act': 'cx-rdeal' } }) })}
      ${h.card({ title: 'Statements and payouts', body: h.list([{ icon: 'receipt', title: (c.winter ? 'December' : 'April') + ' statement', sub: money(612) + ' · scheduled PO-2290' }, { icon: 'receipt', title: (c.winter ? 'November' : 'March') + ' statement', sub: money(574) + ' · paid by ACH' }]) + h.note('W-9 on file. Commissions are paid from Rootline\'s own funds; your clients\' money never moves through Rootline.') })}</div>`,
    ]);
});
RL.act('cx-ropt', () => { RL.toast(`Saved (mock): Tallgrass Design Studio uses ${RL.ui['cx.ropt'] === 'disc' ? 'the 10% client discount' : 'the 15% revenue share for 24 months'}. Applied at conversion.`); return false; });
RL.act('cx-rdeal', () => { RL.toast('Deal registration (mock): locks attribution for 90 days once finance confirms no earlier claim.'); return false; });
RL.screen('partner.resources', (c) => {
  const member = c.role === 'partner_member';
  const courses = [['Rootline Ledger for landscape firms', 100, 'certified'], ['Month-end close with WIP and job costing', 100, 'certified'], ['Migrating books from QuickBooks Online', 60, 'in progress'], ['Payroll exports and piece-rate (V1)', 0, 'not started']];
  return h.page({ title: 'Certification and resources', sub: member ? `${esc(c.who)}: your courses and the firm's shared kit` : 'Certification, practice listing and co-marketing kit', tags: h.tag('V1') + ' ' + h.pill('Certified Rootline Accountant', 'ok') })
    + h.cols('2', [
      h.card({ title: 'Certification courses', body: courses.map(([n, p, s]) => `<div class="stack8" style="gap:3px"><div class="flex"><b class="small">${esc(n)}</b><span class="grow"></span>${h.pill(s, s === 'certified' ? 'ok' : s === 'in progress' ? 'info' : '')}</div>${h.progress(p, 100, p === 100 ? '' : 'info')}</div>`).join('') + B('Continue course', { kind: 'primary', a: { 'data-act': 'cx-course' } }) })
      + h.card({ title: 'Practice listing', body: member ? h.note('Only the firm admin edits the practice listing.') : h.kv([['Listed as', 'Liu & Partners CPAs · Naperville, IL'], ['Specialties', 'Landscape and snow contractors, job costing, sales tax (IL, IN)'], ['Languages', 'English, Mandarin'], ['Shown to', 'Companies in Chicagoland and Northwest Indiana']]) + (member ? '' : B('Edit listing', { a: { 'data-act': 'cx-listing' } })) }),
      h.card({ title: 'Co-marketing kit', body: h.list([{ icon: 'download', title: 'Co-branded one-pager: "Close your books in Rootline"', sub: 'PDF, EN and ES' }, { icon: 'download', title: 'Webinar deck: winter planning for landscape firms', sub: 'Slides with speaker notes' }, { icon: 'download', title: 'Email templates for client introductions', sub: 'Uses your referral link' }]) })
      + h.card({ title: 'Partner-scoped access', body: `<p class="small">Implementation help (migrations, setup) uses partner-scoped Support Access Grants with the same consent model as Rootline staff: the Company's owner approves scope and duration, and every session shows in their Support Access Log (PA-161).</p>` + h.note('Partner users have no Operator Console access (19 §9.2).') }),
    ]);
});
RL.act('cx-course', () => { RL.toast('Course resumed (mock): "Migrating books from QuickBooks Online", lesson 4 of 7.'); return false; });
RL.act('cx-listing', () => { RL.toast('Practice listing editor (mock). Listings never influence plant or design recommendations.'); return false; });
})();
