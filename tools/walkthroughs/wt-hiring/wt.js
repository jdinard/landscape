/* Walkthrough: hiring and seasonal crews (doc 15, with 02, 04, 05, 09, 13, 17). Greenleaf Grounds Co., Columbus, Ohio.
   Payroll journal uses doc 09 accounts 2310, 2320, 2360, 5190 (posting rules labor.LB1, payroll.PR1). */

function L(S, en, es) { return S.lang === 'es' ? es : en; }
function langBtn(S, k) { return '<button type="button" class="btn xs" data-act="lang" data-k="lang' + (k || '') + '" aria-label="Language">' + (S.lang === 'es' ? 'ES' : 'EN') + '</button>'; }
function je(rows, note) {
  var d = 0, c = 0;
  var body = rows.map(function (r) { d += r[1] || 0; c += r[2] || 0; return '<tr><td>' + esc(r[0]) + '</td><td class="n">' + (r[1] ? money(r[1], true) : '') + '</td><td class="n">' + (r[2] ? money(r[2], true) : '') + '</td></tr>'; }).join('');
  return '<table class="wt-je"><thead><tr><th>Account</th><th class="n">Debit</th><th class="n">Credit</th></tr></thead><tbody>' + body + '<tr class="tot"><td>' + (note || (Math.abs(d - c) < 0.005 ? 'Balanced' : 'NOT BALANCED')) + '</td><td class="n">' + money(d, true) + '</td><td class="n">' + money(c, true) + '</td></tr></tbody></table>';
}
var TEAM_NAV = [['today', 'Today'], ['approve', 'Approvals'], ['users', 'Team'], ['user', 'Hiring'], ['shield', 'Credentials'], ['book', 'Training'], ['globe', 'H-2B'], ['clock', 'Timesheets'], ['dollar', 'Payroll'], ['calendar', 'Schedule'], ['cog', 'Settings']];
function teamShell(active, main, counts) { return appShell(active, main, { nav: TEAM_NAV, counts: counts, navLabel: 'Team module navigation (concept)' }); }

/* Payroll week Sun Apr 18 - Sat Apr 24, 2027 (27 field employees). */
var PAY = { reg: 1032.0, ot: 38.5, sick: 8.0, rate: 21.10 };
PAY.regAmt = 21775.20; PAY.otAmt = 1218.53; PAY.sickAmt = 180.00;
PAY.gross = 23173.73; PAY.applied = 22587.55; PAY.variance = 586.18; PAY.net = 18306.73; PAY.withheld = 4867.00; PAY.otPrem = 406.18;

var WT = {
  title: 'Rootline walkthrough: hiring and seasonal crews',
  short: 'Hiring and seasonal crews',
  ovTitle: 'Hiring and seasonal crews',
  startLeft: 4310,
  acts: [
    { n: 'Act 1', t: 'Hire for spring', sub: 'Plan, post, apply, interview' },
    { n: 'Act 2', t: 'Ready for day one', sub: 'Offer, onboarding, training, credentials, H-2B' },
    { n: 'Act 3', t: 'In season', sub: 'Time off, timesheets, payroll, pay explainer' }
  ],
  steps: [
    { id: 'hr01-plan', act: 0, short: 'Season plan', title: 'The season plan shows the hiring gap', who: 'Erin Castillo', tags: ['v1'] },
    { id: 'hr02-post', act: 0, short: 'Job post', title: 'A bilingual job post, checked before it goes out', who: 'Tasha Greene, Marco Ruiz', ai: true, tags: ['v1'] },
    { id: 'hr03-apply', act: 0, short: 'Apply by phone', title: 'Applying in Spanish from a phone in 3 minutes', who: 'Rafael Gómez', ai: true, tags: ['v1'] },
    { id: 'hr04-pipeline', act: 0, short: 'Interview', title: 'Pipeline, interview times by text and a structured interview', who: 'Tasha, Marco', ai: true, tags: ['v1'] },
    { id: 'hr05-offer', act: 1, short: 'Offer and onboarding', title: 'Offer by text, onboarding through the payroll provider', who: 'Tasha, Rafael', tags: ['mvp', 'v1'] },
    { id: 'hr06-train', act: 1, short: 'Training', title: 'Bilingual micro-lessons and a practical sign-off', who: 'Rafael, Marco', tags: ['mvp', 'v1'] },
    { id: 'hr07-creds', act: 1, short: 'Credentials', title: 'Credentials enforced at dispatch', who: 'Luis Ortega, Javier Torres', ai: true, tags: ['mvp'] },
    { id: 'hr08-h2b', act: 1, short: 'H-2B season', title: 'The H-2B season workspace', who: 'Tasha, outside agent', tags: ['v1'] },
    { id: 'hr09-timeoff', act: 2, short: 'Time off', title: 'A time-off request with the schedule impact', who: 'Andrés Vega, Tasha', tags: ['mvp'] },
    { id: 'hr10-timesheets', act: 2, short: 'Timesheets', title: 'Exception-first timesheet approval', who: 'Luis', ai: true, tags: ['mvp', 'v1'] },
    { id: 'hr11-payroll', act: 2, short: 'Payroll close', title: 'Closing the pay period and exporting to Gusto', who: 'Tasha, Erin, Priya Shah', tags: ['mvp'] },
    { id: 'hr12-explain', act: 2, short: 'Pay explainer', title: 'Rafael\'s pay, explained in Spanish', who: 'Rafael', ai: true, tags: ['v1'] },
    { id: 'hr13-recap', act: 2, short: 'Recap', title: 'Recap: one people system for a seasonal crew', who: 'Everyone', tags: [] }
  ],
  credits: { 'hr02-post': 2, 'hr03-apply': 1, 'hr04-pipeline': 1, 'hr07-creds': 2, 'hr10-timesheets': 10, 'hr12-explain': 1 },
  state: { lang: 'es', reqs: false, fixed: false, published: false, ap: 0, ans: '', voice: false, slots: false, reply: false, rubric: {}, offer: 0, kit: false, signoff: false, proof: 0, lease: false, remind: false, pto: '', ex: {}, clean: false, pstep: 2, mismatch: false, appr1: false, appr2: false, pushed: false, posted: false, why: false, confirmed: false },
  ov: {
    eyebrow: 'Clickable walkthrough · Team, HR, time and payroll',
    h: 'Headcount doubles every spring. Rootline hires, trains, schedules and pays a bilingual seasonal crew from one system.',
    lede: 'Greenleaf Grounds Co. needs 4 more people by early April. Follow the season plan, a job post in English and Spanish, an applicant who applies from his phone in Spanish, interviews and an offer by text, onboarding through the payroll provider, training with a practical sign-off, a license that would have blocked next week\'s weed control, the H-2B workspace, and then the in-season loop: time off, timesheet approval, payroll export and a pay stub explained in Spanish.',
    cast: [
      { h: 'Greenleaf office', icon: 'building', items: [['Erin Castillo', 'owner'], ['Tasha Greene', 'office manager, runs hiring'], ['Luis Ortega', 'ops manager, approves time'], ['Priya Shah', 'bookkeeper']] },
      { h: 'Field', icon: 'truck', items: [['Marco Ruiz', 'Crew 2 lead, bilingual'], ['Andrés Vega', 'Crew 1 lead'], ['Javier Torres', 'technician, licensed applicator'], ['Rafael Gómez', 'applicant, then crew member']] },
      { h: 'Agents', icon: 'spark', items: [['Hiring assistant (A25)', 'drafts posts, summarizes applications; never ranks or rejects'], ['Timesheet Anomaly (A17)', 'proposes corrections with evidence'], ['Document reading', 'reads a renewed license photo']] }
    ],
    extra: '<p class="wt-note mt14">Set in Columbus, Ohio in spring 2027. Rootline is software, not a law firm, a PEO or a payroll tax filer: every compliance hint is a starting point for review, and items marked verify need first-hand confirmation.</p>'
  },
  screens: {}, bts: {}, actions: {}, inputs: {}, ensure: {}
};
WT.actions.lang = function (el, S) { S.lang = S.lang === 'es' ? 'en' : 'es'; };

/* hr01 */
WT.screens['hr01-plan'] = function (S) {
  var months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], need = [16, 28, 28, 27, 26, 26], have = [16, 24, 24, 24, 24, 24];
  if (S.reqs) have = [16, 28, 28, 28, 28, 28];
  var bars = '<div style="display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px;align-items:end;height:150px;padding:6px 0">' + months.map(function (m, i) {
    var gap = need[i] - Math.min(have[i], need[i]);
    return '<div style="display:grid;gap:3px;align-items:end;height:100%;grid-template-rows:1fr auto"><div style="display:flex;gap:3px;align-items:end;height:100%"><span title="Need ' + need[i] + '" style="flex:1;height:' + (need[i] / 30 * 100) + '%;background:var(--surface-3);border:1px solid var(--border-strong);border-radius:4px 4px 0 0"></span><span title="Have ' + Math.min(have[i], need[i]) + '" style="flex:1;height:' + (Math.min(have[i], need[i]) / 30 * 100) + '%;background:' + (gap ? 'var(--marigold-100)' : 'var(--moss-200)') + ';border-radius:4px 4px 0 0"></span></div><div class="tiny" style="text-align:center"><b>' + m + '</b><br>' + (gap ? '<span style="color:var(--warn-text)">−' + gap + '</span>' : '<span style="color:var(--ok-text)">OK</span>') + '</div></div>';
  }).join('') + '</div>';
  var main = '<div class="apphead"><span class="crumb">Team › Season plan</span><h3>2027 field headcount</h3><span class="sp"></span>' + pill(S.reqs ? 'ok' : 'warn', S.reqs ? 'Requisitions open' : 'Gap from April') + '</div>' +
    '<div class="wt-cols wide-left"><div class="panel"><h4>Need vs have, field staff</h4>' + bars + '<div class="wt-note">Grey: needed from sold agreements, the install backlog and production rates. Green or amber: people on the roster.</div></div>' +
    '<div class="wt-stack"><div class="panel"><h4>Where April\'s 24 come from</h4><dl class="kv"><dt>Year-round field</dt><dd>14</dd><dt>H-2B (arrive Apr 1)</dt><dd>8</dd><dt>Seasonal, returning</dt><dd>2 of 3 re-engaged</dd><dt>Gap</dt><dd><b>3 crew members, 1 lawn applicator</b></dd></dl></div>' +
    '<div class="panel"><h4>Requisitions</h4><div class="tiny">REQ-27-01 · Crew member × 3 · $18-$22/h<br>REQ-27-02 · Lawn applicator × 1 · $21-$25/h</div>' + (S.reqs ? '<div class="okline mt6">' + ic('check') + 'Approved by Erin; Tasha notified</div>' : '<button type="button" class="btn sm primary mt6" data-act="reqs" data-k="reqs">Approve both requisitions</button>') + '</div></div></div>';
  return browser('app.rootline.com/team/season-plan', teamShell('Team', main), 'Season plan');
};
WT.actions.reqs = function (el, S) { S.reqs = true; };
WT.ensure['hr01-plan'] = function (S) { S.reqs = true; };
WT.bts['hr01-plan'] = function (S) {
  return {
    what: 'Hiring starts from the work already sold. The season plan turns maintenance agreements, the install backlog and production rates into crew-hours per week, compares that with the roster (year-round staff, H-2B arrivals and seasonal staff coming back from hibernation) and shows the gap by month. The owner approves requisitions with a pay range.',
    agents: [['Season plan (RET-04)', 'Demand from sold work vs roster', 1], ['Requisitions (ATS-01)', 'Position, count, pay range, approval', 1]],
    trace: [{ c: 'demand.crew_hours(2027, by week)', r: 'peak 28 field staff, weeks of Apr 5 to May 31', ms: '1.4 s', det: true }, { c: 'roster.project(year-round, H-2B, re-engaged)', r: '24 from April', ms: '200 ms', det: true }, { c: 'requisition.approve(REQ-27-01, REQ-27-02)', r: S.reqs ? 'approved by Erin' : 'waiting for the owner', ms: S.reqs ? 'human' : '', human: !S.reqs }],
    hitl: [['Erin', 'approves the requisitions and the pay ranges.']],
    tags: [['v1', 'season plan, requisitions and headcount planning'], ['mvp', 'seasonal hibernation and re-engagement of last year\'s staff']],
    specs: 'Spec: 15 RET-04, ATS-01, §4.1 (seasonal hibernation), §5.1 · 04 (production rates)'
  };
};

/* hr02 */
WT.screens['hr02-post'] = function (S) {
  var checks = [['Pay range shown ($18-$22/h)', true], ['No age-coded or exclusionary words', S.fixed], ['Fair-chance wording', true], ['Pay matches or beats the H-2B job order for the same work', true], ['Spanish reviewed by a bilingual staff member', true]];
  var phrase = S.fixed ? '<span class="field-diff"><span class="new">dependable, able to lift 50 lb with or without reasonable accommodation</span></span>' : '<mark style="background:var(--warn-bg);color:inherit">young, energetic team players</mark>';
  var main = '<div class="apphead"><span class="crumb">Hiring › REQ-27-01</span><h3>Crew member · post</h3>' + aiChip('Drafted by the Hiring assistant') + '</div>' +
    '<div class="wt-cols"><div class="panel"><h4>English</h4><p class="tiny"><b>Landscape crew member</b> · $18-$22/hour · Mon-Fri 7:00-3:30, April to November, some Saturdays<br>Mow, trim, mulch and plant across Columbus with a crew that trains you. We\'re looking for ' + phrase + '. No résumé needed; apply from your phone in 3 minutes.</p>' +
    '<h4 class="mt10">Español</h4><p class="tiny"><b>Miembro de cuadrilla de paisajismo</b> · $18-$22/hora · lun-vie 7:00-3:30, abril a noviembre, algunos sábados<br>Cortar, recortar, poner mulch y plantar en Columbus con un equipo que le capacita. No necesita currículum; solicite desde su celular en 3 minutos.</p><div class="wt-note">Reviewed by Marco Ruiz (bilingual) · 2 edits</div></div>' +
    '<div class="wt-stack"><div class="panel"><h4>Posting check</h4><ul class="wt-list">' + checks.map(function (c) { return '<li class="wt-row soft"><span class="wt-ic ' + (c[1] ? 'ok' : 'warn') + '">' + ic(c[1] ? 'check' : 'warn') + '</span><span>' + c[0] + '</span><span></span></li>'; }).join('') + '</ul>' + (S.fixed ? '' : '<button type="button" class="btn sm mt6" data-act="fixpost" data-k="fixpost">Use the suggested wording</button>') + '</div>' +
    '<div class="panel"><h4>Publish to</h4><div class="tiny">Careers page · Indeed · Google for Jobs · Facebook · QR flyer for the yard and the tienda · text <b>TRABAJO</b> or <b>JOBS</b> to (614) 555-0100</div>' + (S.published ? '<div class="okline mt6">' + ic('check') + 'Live in 5 places; flyer PDF ready</div>' : '<button type="button" class="btn sm primary mt6" data-act="publish" data-k="publish"' + (S.fixed ? '' : ' disabled') + '>Publish</button>') + '</div></div></div>';
  return browser('app.rootline.com/team/hiring/REQ-27-01/post', teamShell('Hiring', main), 'Job post builder');
};
WT.actions.fixpost = function (el, S) { S.fixed = true; };
WT.actions.publish = function (el, S) { S.published = true; };
WT.ensure['hr02-post'] = function (S) { S.fixed = true; S.published = true; };
WT.bts['hr02-post'] = function (S) {
  return {
    what: 'The Hiring assistant drafts the post in English and Spanish from the requisition. A posting check then looks for the pay range, age-coded or exclusionary words, fair-chance wording and H-2B wage parity before anything is published. A bilingual staff member reviews the Spanish. One click publishes it to the careers page and job boards and makes a QR flyer and a text keyword.',
    agents: [['Hiring assistant (A25)', 'Drafts bilingual posts; no ranking or rejection', 0], ['Posting check', 'Rules for pay transparency and wording', 1]],
    trace: [{ c: 'agent.A25.draft_post(REQ-27-01, en+es)', r: '2 drafts', ms: '6 s' }, { c: 'posting.validate', r: S.fixed ? 'all checks pass' : '1 phrase flagged: "young, energetic"', ms: '300 ms', det: true }, { c: 'review.spanish(Marco)', r: '2 edits', ms: '—', det: true }, { c: 'distribute(careers, Indeed, Google, Facebook, QR, SMS keyword)', r: S.published ? 'live' : 'waiting', ms: S.published ? '2.2 s' : '', det: true, pending: !S.published }],
    hitl: [['Tasha', 'edits and publishes.'], ['Marco', 'reviews the Spanish.']],
    tags: [['v1', 'bilingual post builder, posting check, distribution, QR flyer and SMS keyword']],
    specs: 'Spec: 15 ATS-02, ATS-03, H2B-07 · 17 A25 · 16 (careers page)'
  };
};

/* hr03 */
WT.screens['hr03-apply'] = function (S) {
  var body;
  if (S.ap === 0) {
    body = '<p class="ptitle">' + L(S, 'Landscape crew member', 'Miembro de cuadrilla') + '</p><p class="psub">$18-$22/' + L(S, 'hour', 'hora') + ' · ' + L(S, 'Mon-Fri 7:00-3:30, Apr-Nov', 'lun-vie 7:00-3:30, abr-nov') + '</p>' +
      '<div class="pcard tiny">' + L(S, 'No résumé needed. Takes 3 minutes.', 'No necesita currículum. Toma 3 minutos.') + '</div>' +
      '<label class="fld">' + L(S, 'Name', 'Nombre') + '<input class="inp" value="Rafael Gómez" readonly></label><label class="fld mt6">' + L(S, 'Mobile', 'Celular') + '<input class="inp" value="(614) 555-0187" readonly></label>' +
      '<button type="button" class="btn primary mt10" style="justify-content:center" data-act="ap" data-k="ap0">' + L(S, 'Text me a code', 'Enviar código por texto') + '</button>';
  } else if (S.ap === 1) {
    var opts = [['a', L(S, 'Yes, more than 1 season', 'Sí, más de 1 temporada')], ['b', L(S, 'Yes, less than 1 season', 'Sí, menos de 1 temporada')], ['c', L(S, 'No, but I want to learn', 'No, pero quiero aprender')]];
    body = '<p class="psub">' + L(S, 'Question 2 of 4', 'Pregunta 2 de 4') + '</p><p class="ptitle" style="font-size:1.05rem">' + L(S, 'Do you have experience with zero-turn mowers?', '¿Tiene experiencia con cortacésped zero-turn?') + '</p>' +
      opts.map(function (o) { return '<button type="button" class="choice' + (S.ans === o[0] ? ' sel' : '') + '" data-act="ans" data-v="' + o[0] + '" data-k="ans' + o[0] + '">' + o[1] + '</button>'; }).join('') +
      '<p class="tiny muted" style="text-align:center;margin:6px 0">' + L(S, 'or answer with your voice:', 'o responda con su voz:') + '</p>' +
      (S.voice ? '<div class="wt-bubble ai">"Sí, dos temporadas con una Scag en Dublin, y sé usar sopladora y orilladora."<small>0:14 · ' + L(S, 'transcribed', 'transcrito') + '</small></div>' : '<button type="button" class="mic-btn" data-act="voice" data-k="voice">' + ic('mic') + L(S, 'Hold to talk', 'Mantenga para hablar') + '</button>') +
      '<button type="button" class="btn primary mt10" style="justify-content:center" data-act="ap" data-k="ap1"' + (S.ans || S.voice ? '' : ' disabled') + '>' + L(S, 'Next', 'Siguiente') + '</button>';
  } else {
    body = '<p class="ptitle">' + L(S, 'All set, Rafael!', '¡Listo, Rafael!') + '</p><div class="pcard tiny">' + L(S, 'We received your application for Landscape crew member. We\'ll text you about an interview, usually in 1-2 days.', 'Recibimos su solicitud para Miembro de cuadrilla. Le enviaremos un texto para una entrevista, normalmente en 1-2 días.') + '</div>' +
      '<label class="fld">' + L(S, 'Who referred you? (optional)', '¿Quién le recomendó? (opcional)') + '<input class="inp" value="Marco Ruiz" readonly></label><div class="okline mt6">' + ic('check') + L(S, 'Confirmation text sent', 'Texto de confirmación enviado') + '</div>';
  }
  var right = langBtn(S, 'a');
  return devRow(phone(body, { brand: 'Greenleaf Grounds Co.', sub: L(S, 'Careers', 'Empleos'), right: right, label: 'Applicant phone: mobile apply', k: 'ap' }),
    ctxCard('Behind this form', ['<b>No account.</b> A texted code proves the phone.', '<b>Spanish first.</b> Switch languages any time.', '<b>Four questions,</b> each with a voice option.', '<b>Knock-out answers</b> are flagged for a person, never auto-rejected by default.']));
};
WT.actions.ap = function (el, S) { S.ap = Math.min(2, S.ap + 1); };
WT.actions.ans = function (el, S) { S.ans = el.getAttribute('data-v'); };
WT.actions.voice = function (el, S) { S.voice = true; if (!S.ans) S.ans = 'a'; };
WT.ensure['hr03-apply'] = function (S) { S.ap = 2; S.ans = 'a'; S.voice = true; };
WT.bts['hr03-apply'] = function (S) {
  return {
    what: 'Mobile apply is built for the people landscape companies actually hire: no account, no résumé, Spanish first, four questions that can be answered by voice, and an instant confirmation text. A referral credits Marco in the referral program.',
    agents: [['Mobile apply (ATS-04)', 'No-account bilingual application', 1], ['Transcription and translation', 'Voice answers into text for the office', 0]],
    trace: [{ c: 'otp.verify((614) 555-0187)', r: S.ap >= 1 ? 'verified' : 'waiting', ms: S.ap >= 1 ? '1.1 s' : '', det: true, pending: S.ap < 1 }, { c: 'voice.transcribe(es, 0:14) + translate(en)', r: S.voice ? '"Yes, two seasons on a Scag in Dublin…"' : 'not used yet', ms: S.voice ? '2.0 s' : '', pending: !S.voice }, { c: 'applicant.create + sms.confirm', r: S.ap >= 2 ? 'APP-2207 · referral: Marco Ruiz' : '', ms: S.ap >= 2 ? '400 ms' : '', det: true, pending: S.ap < 2 }],
    hitl: [['Rafael', 'answers and submits.'], ['Tasha', 'sees every applicant; nothing is rejected automatically unless Greenleaf turns on objective auto-decline.']],
    tags: [['v1', 'Spanish-first mobile apply, voice answers, referral tracking']],
    specs: 'Spec: 15 ATS-04, ATS-05, ATS-11, §6.4 wireframe · 05 (voice capture)'
  };
};

/* hr04 */
WT.screens['hr04-pipeline'] = function (S) {
  var cols = [['Applied', [['Rafael Gómez', 'ES · referred by Marco · voice answer', true], ['Kyle Brandt', 'EN · Indeed'], ['D. Nguyen', 'EN · flag: age 15 (no power mowers or trimmers)', false, true]]], ['Contacted', [['José Ramos', 'ES · QR flyer'], ['Emma Hart', 'EN · careers page']]], ['Interview', [['Luis Cano', 'ES · Tue 9:00']]], ['Offer', [['Tom Reilly', 'EN · sent']]]];
  if (S.reply) { cols[0][1].shift(); cols[2][1].unshift(['Rafael Gómez', 'ES · Tue 10:30 · Marco', true]); }
  var kan = '<div class="kan">' + cols.map(function (c) { return '<div class="col"><h5>' + c[0] + ' (' + c[1].length + ')</h5>' + c[1].map(function (k) { return '<div class="kc' + (k[2] ? ' sel' : '') + '"><b>' + k[0] + '</b><small>' + k[1] + '</small>' + (k[3] ? pill('warn', 'Needs a person') : '') + '</div>'; }).join('') + '</div>'; }).join('') + '</div>';
  var thread = '<div class="wt-sms"><div class="wt-bubble them">Hola Rafael, soy Tasha de Greenleaf. ¿Puede venir a una entrevista en el patio? Responda 1, 2 o 3:<br>1) mar 9:00 · 2) mar 10:30 · 3) mié 9:00</div>' + (S.reply ? '<div class="wt-bubble me">2</div><div class="wt-bubble them">Perfecto: martes 10:30 con Marco Ruiz. Le mandamos un recordatorio el lunes.<small>Sent automatically</small></div>' : '') + '</div>';
  var rub = [['reliability', 'Reliability'], ['safety', 'Safety awareness'], ['equip', 'Equipment experience'], ['team', 'Teamwork']];
  var main = '<div class="apphead"><span class="crumb">Hiring › REQ-27-01</span><h3>Pipeline · crew member</h3><span class="sp"></span>' + pill('info', '14 applicants in 6 days · 7 shown') + '</div>' + kan +
    '<div class="wt-cols mt10"><div class="panel"><h4>' + ic('spark') + ' Application summary · Rafael</h4><p class="tiny">Two seasons on a zero-turn (Scag) with a Dublin company; uses blowers and edgers; available Mon-Sat; has a driver\'s license; prefers Spanish. Referred by Marco Ruiz.</p><div class="wt-note">Summary and translation only. The assistant never scores, ranks or rejects applicants.</div>' +
    (S.slots ? thread : '<button type="button" class="btn sm primary mt6" data-act="slots" data-k="slots">Text interview times</button>') + (S.slots && !S.reply ? '<button type="button" class="btn xs mt6" data-act="reply" data-k="reply">Simulate Rafael\'s reply</button>' : '') + '</div>' +
    '<div class="panel"><h4>Structured interview · Marco</h4>' + rub.map(function (r) { var v = S.rubric[r[0]] || 0; return '<div class="flex" style="justify-content:space-between;margin-bottom:4px"><span class="tiny">' + r[1] + '</span><span class="seg">' + [1, 2, 3, 4].map(function (n) { return '<button type="button" data-act="rub" data-v="' + r[0] + ':' + n + '" data-k="r' + r[0] + n + '" aria-pressed="' + (v === n) + '"' + (S.reply ? '' : ' disabled') + '>' + n + '</button>'; }).join('') + '</span></div>'; }).join('') + '<div class="wt-note">Same questions for every candidate, scored 1-4. ' + (S.reply ? '' : 'Opens once the interview is booked.') + '</div></div></div>';
  return browser('app.rootline.com/team/hiring/REQ-27-01', teamShell('Hiring', main, { Hiring: 14 }), 'Hiring pipeline');
};
WT.actions.slots = function (el, S) { S.slots = true; };
WT.actions.reply = function (el, S) { S.reply = true; };
WT.actions.rub = function (el, S) { var p = el.getAttribute('data-v').split(':'); S.rubric[p[0]] = +p[1]; };
WT.ensure['hr04-pipeline'] = function (S) { S.slots = true; S.reply = true; S.rubric = { reliability: 4, safety: 3, equip: 4, team: 4 }; };
WT.bts['hr04-pipeline'] = function (S) {
  return {
    what: 'The pipeline is a board per requisition. Knock-out answers are highlighted for a person to decide, not auto-rejected: a 15-year-old can\'t run power mowers or trimmers under federal youth rules but could do hand work, and 16- and 17-year-olds are kept off chain saws and chippers. Interview times go out by text and the applicant replies with a number; reminders follow. Every candidate gets the same structured questions with a 1-4 rubric. The assistant summarizes and translates but never ranks.',
    agents: [['Hiring assistant (A25)', 'Summary and translation of the application', 0], ['Scheduling by text (ATS-07)', 'Numbered slots, confirmations, reminders', 1]],
    trace: [{ c: 'agent.A25.summarize(APP-2207, es→en)', r: '5-line summary', ms: '3 s' }, { c: 'sms.slots(3 options)', r: S.slots ? 'sent' : 'waiting', ms: S.slots ? '500 ms' : '', det: true, pending: !S.slots }, { c: 'sms.reply_parse("2")', r: S.reply ? 'Tue 10:30 booked with Marco' : '', ms: S.reply ? '80 ms' : '', det: true, pending: !S.reply }, { c: 'interview.score(rubric)', r: Object.keys(S.rubric).length + ' of 4 scored', ms: '—', det: true, human: true }],
    hitl: [['Tasha', 'moves candidates; nobody is rejected by software.'], ['Marco', 'interviews and scores.']],
    tags: [['v1', 'pipeline board, SMS scheduling, structured interview kits, application summaries'], ['v2', 'background checks after a conditional offer']],
    specs: 'Spec: 15 ATS-05 to ATS-09 · 17 A25 (no ranking or rejection) · 16 (unified inbox, recruiting tag)'
  };
};

/* hr05 */
WT.screens['hr05-offer'] = function (S) {
  var steps = [['Offer e-signed', S.offer >= 2, 'v1'], ['Employee record EMP-0197 created', S.offer >= 2, 'mvp'], ['Gusto onboarding link: W-4, I-9 section 1, direct deposit', S.offer >= 2, 'mvp'], ['Handbook and heat-plan acknowledgments (ES)', S.offer >= 2, 'mvp'], ['I-9 section 2: documents checked in person on day 1', false, 'mvp'], ['Kit issued from inventory', S.kit, 'mvp'], ['Buddy: Javier Torres', S.offer >= 2, 'v1']];
  var sms = '<p class="ptitle" style="font-size:1rem">Oferta de trabajo</p><div class="pcard tiny"><dl class="kv"><dt>Puesto</dt><dd>Miembro de cuadrilla</dd><dt>Pago</dt><dd>$19.50/hora</dd><dt>Inicio</dt><dd>lunes 5 de abril, 7:00</dd><dt>Temporada</dt><dd>abril a noviembre</dd></dl></div>' +
    (S.offer >= 2 ? '<div class="okline">' + ic('check') + 'Firmado · Rafael Gómez</div>' : S.offer === 1 ? '<button type="button" class="btn primary" style="justify-content:center" data-act="offer" data-k="offer1">Firmar</button>' : '<p class="tiny muted">Waiting for the office to send it.</p>');
  var main = '<div class="apphead"><span class="crumb">Hiring › Rafael Gómez</span><h3>Offer and onboarding</h3></div><div class="panel"><h4>Checklist · seasonal crew member</h4><ul class="wt-list">' + steps.map(function (s) { return '<li class="wt-row' + (s[1] ? ' soft' : '') + '"><span class="wt-ic ' + (s[1] ? 'ok' : '') + '">' + ic(s[1] ? 'check' : 'clock') + '</span><span>' + s[0] + '</span>' + tag(s[2]) + '</li>'; }).join('') + '</ul>' +
    (S.offer === 0 ? '<button type="button" class="btn sm primary mt10" data-act="offer" data-k="offer0">Send the offer by text</button>' : '') + (S.offer >= 2 && !S.kit ? '<button type="button" class="btn sm mt10" data-act="kit" data-k="kit">Issue the crew member kit</button>' : '') +
    (S.kit ? '<div class="wt-note mt6">Issued: 3 shirts, hi-vis vest, safety glasses, ear protection, gloves. Custody recorded per item.</div>' : '') + '</div>';
  return withPhone(browser('app.rootline.com/team/people/rafael-gomez', teamShell('Hiring', main), 'Onboarding checklist'), phone(sms, { brand: 'Greenleaf Grounds Co.', sub: 'Texto · (614) 555-0100', label: 'Rafael\'s phone: offer', k: 'of' }));
};
WT.actions.offer = function (el, S) { S.offer = Math.min(2, S.offer + 1); };
WT.actions.kit = function (el, S) { S.kit = true; };
WT.ensure['hr05-offer'] = function (S) { S.offer = 2; S.kit = true; };
WT.bts['hr05-offer'] = function (S) {
  return {
    what: 'The offer goes out by text in Spanish and is signed on the phone. Accepting it creates the employee record and starts the onboarding checklist. Tax forms, I-9 section 1 and direct deposit happen in the payroll provider (Gusto here) through a hand-off link, because Rootline is not the payroll system of record. Kit issued from inventory is tracked per item so it comes back at season end.',
    agents: [['Onboarding', 'Checklist, e-signature, payroll-provider hand-off, kit issuance', 1]],
    trace: [{ c: 'offer.send(sms, es)', r: S.offer >= 1 ? 'sent' : 'waiting', ms: S.offer >= 1 ? '400 ms' : '', det: true, pending: S.offer < 1 }, { c: 'esign.complete(offer)', r: S.offer >= 2 ? 'signed, hash stored' : '', ms: S.offer >= 2 ? '—' : '', det: true, pending: S.offer < 2 }, { c: 'gusto.employee.create + onboarding_link', r: S.offer >= 2 ? 'created in Gusto' : '', ms: S.offer >= 2 ? '1.6 s' : '', det: true, pending: S.offer < 2 }, { c: 'inventory.issue(kit: crew member)', r: S.kit ? '5 items in custody' : '', ms: S.kit ? '200 ms' : '', det: true, pending: !S.kit }],
    hitl: [['Tasha', 'sends the offer and checks I-9 documents in person.'], ['Rafael', 'signs and completes the Gusto forms.']],
    tags: [['mvp', 'basic onboarding checklist, payroll-provider hand-off, handbook e-sign, kit issuance'], ['v1', 'offer letters by text, full e-signature, buddy assignment']],
    specs: 'Spec: 15 ATS-10, ONB-01 to ONB-06, §5.1 · 13 (custody) · 02 (credentials from the start date)'
  };
};

/* hr06 */
WT.screens['hr06-train'] = function (S) {
  var lessons = [[L(S, 'Heat: preventing heat illness', 'Calor: cómo prevenir golpes de calor'), '2 min · ' + L(S, 'quiz 3/3', 'prueba 3/3'), true], [L(S, 'Zero-turn: safety and slopes', 'Zero-turn: seguridad y pendientes'), '3 min · ' + L(S, 'quiz 4/4', 'prueba 4/4'), true], [L(S, 'Trailers: hitch and chains', 'Remolques: enganche y cadenas'), '2 min', false]];
  var body = '<p class="ptitle">' + L(S, 'Learn', 'Aprender') + '</p>' + lessons.map(function (l) { return '<div class="lesson mt6"><span class="thumb">' + ic('play') + '</span><span><b>' + l[0] + '</b><small>' + l[1] + '</small></span>' + (l[2] ? '<span class="wt-ic ok">' + ic('check') + '</span>' : pill('', L(S, 'Next', 'Sigue'))) + '</div>'; }).join('') +
    '<p class="tiny muted mt10">' + L(S, 'Today\'s tailgate talk: signed by 6 of 6', 'Charla de hoy: firmada por 6 de 6') + '</p>';
  var checks = ['Pre-operation check done out loud', 'Stays off slopes over the mower\'s limit', 'Seat belt on with the rollover bar up', 'Disengages blades before leaving the seat'];
  var lead = '<p class="ptitle" style="font-size:1rem">Sign-off · Rafael Gómez</p><p class="psub">Zero-turn mower · practical</p>' + checks.map(function (c) { return '<label class="check" style="margin-bottom:6px"><input type="checkbox" checked disabled><span class="tiny">' + c + '</span></label>'; }).join('') +
    (S.signoff ? '<div class="okline">' + ic('check') + 'Authorized · Marco Ruiz</div>' : '<button type="button" class="btn primary" style="justify-content:center" data-act="signoff" data-k="signoff">Authorize Rafael</button>');
  return devRow(phone(body, { brand: 'Rootline Crew', sub: 'Rafael Gómez · Crew 2', logo: 'truck', right: langBtn(S, 't'), label: 'Rafael\'s crew app: training', k: 'tr' }), phone(lead, { brand: 'Rootline Crew', sub: 'Marco Ruiz · Crew 2 lead', logo: 'truck', label: 'Marco\'s crew app: practical sign-off', k: 'so' }));
};
WT.actions.signoff = function (el, S) { S.signoff = true; };
WT.ensure['hr06-train'] = function (S) { S.signoff = true; };
WT.bts['hr06-train'] = function (S) {
  return {
    what: 'Training is short vertical video with captions and audio in English and Spanish, assigned automatically by position and equipment. Lessons and quizzes are not enough to run a machine: the crew lead does a practical "show me" sign-off, and that sign-off is what authorizes Rafael on the equipment matrix the schedule checks.',
    agents: [['Training (LMS)', 'Assignment rules, lessons, quizzes, sign-offs', 1]],
    trace: [{ c: 'lms.assign(position: crew member, equipment: zero-turn)', r: '3 lessons', ms: '100 ms', det: true }, { c: 'quiz.score', r: 'heat 3/3, zero-turn 4/4', ms: '—', det: true }, { c: 'signoff.practical(zero-turn, Marco)', r: S.signoff ? 'authorized' : 'waiting for the crew lead', ms: S.signoff ? 'human' : '', human: !S.signoff }, { c: 'equipment_matrix.update', r: S.signoff ? 'Rafael: zero-turn AUTH' : '', ms: '', det: true, pending: !S.signoff }],
    hitl: [['Marco', 'watches Rafael do it and signs off; nobody is authorized by a quiz alone.']],
    tags: [['mvp', 'tailgate talks and attendance export'], ['v1', 'micro-lesson library, quizzes, practical sign-offs, equipment authorization matrix']],
    specs: 'Spec: 15 LMS-01 to LMS-06 · 05 (tailgate talks) · 13 (equipment classes)'
  };
};

/* hr07 */
WT.screens['hr07-creds'] = function (S) {
  function c(t, cls) { return '<td>' + (t === '—' ? '<span class="faint">—</span>' : pill(cls || 'ok', t)) + '</td>'; }
  var jav = S.proof >= 2 ? c('OK · renewed', 'ok') : c('EXP in 12 d', 'danger');
  var rows = '<tr><td>Andrés Vega (L)</td>' + c('OK 2029') + c('Med card 47 d', 'warn') + c('—') + c('AUTH') + c('AUTH') + '</tr>' +
    '<tr><td>Marco Ruiz (L)</td>' + c('OK 2028') + c('—') + c('—') + c('AUTH') + c('AUTH') + '</tr>' +
    '<tr><td>Javier Torres</td>' + c('OK 2028') + c('—') + jav + c('AUTH') + c('TRN', 'info') + '</tr>' +
    '<tr><td>Maria López</td>' + c('OK 2030') + c('—') + c('OK 2028') + c('AUTH') + c('AUTH') + '</tr>' +
    '<tr><td>Rafael Gómez</td>' + c('OK 2031') + c('—') + c('—') + (S.signoff ? c('AUTH') : c('TRN', 'info')) + c('TRN', 'info') + '</tr>';
  var conflict = S.proof >= 2 ? '<div class="wt-callout mt10">' + ic('check') + ' Resolved: Javier\'s renewed license is on file (number and expiry read from his photo, confirmed by Tasha). Tuesday\'s 3 weed-control rounds stay on Crew 2.</div>' :
    '<div class="wt-callout danger mt10"><b>Next Tuesday:</b> 3 weed-control rounds on Crew 2 need an Ohio commercial pesticide license. Javier\'s expires Monday.<div class="flex mt6"><button type="button" class="btn xs" data-act="proof" data-k="proof"' + (S.proof ? ' disabled' : '') + '>' + (S.proof ? 'Requested by text…' : 'Request renewal proof from Javier') + '</button><button type="button" class="btn xs">Reassign to Maria López</button><span class="tiny muted">Override: not allowed (state law, hard block)</span></div></div>';
  var main = '<div class="apphead"><span class="crumb">Team › Credentials</span><h3>Qualification matrix · Columbus</h3></div><div class="panel" style="overflow-x:auto" tabindex="0" role="region" aria-label="Qualification matrix"><table class="data tight cm"><thead><tr><th>Person</th><th>Driver lic.</th><th>CDL-B + med</th><th>Ohio pesticide</th><th>Zero-turn</th><th>Trailer</th></tr></thead><tbody>' + rows + '</tbody></table></div>' + conflict +
    (S.proof === 1 ? '<div class="panel mt10"><h4>' + ic('camera') + ' Javier replied with a photo</h4><dl class="kv"><dt>Read from the card</dt><dd>Ohio commercial applicator · categories match · new expiry date found</dd><dt>Confidence</dt><dd>0.97</dd></dl><button type="button" class="btn sm primary mt6" data-act="proofok" data-k="proofok">Confirm and update</button></div>' : '');
  return browser('app.rootline.com/team/credentials', teamShell('Credentials', main, { Credentials: S.proof >= 2 ? 0 : 2 }), 'Credentials matrix');
};
WT.actions.proof = function (el, S) { S.proof = 1; };
WT.actions.proofok = function (el, S) { S.proof = 2; };
WT.ensure['hr07-creds'] = function (S) { S.proof = 2; };
WT.bts['hr07-creds'] = function (S) {
  return {
    what: 'Credentials are enforced, not just stored. Requirement rules map work to credentials (pesticide applications need a state license; a truck and trailer over the weight limit need a CDL and medical card; a zero-turn needs an equipment authorization). The schedule looks ahead and flags conflicts before the day. A pesticide license is a hard block by law; company-policy rules can allow an override with a reason.',
    agents: [['Credential rules (CRED-04, CRED-05)', 'Look-ahead conflicts in dispatch and the crew app', 1], ['Document reading', 'Reads the renewed license photo', 0]],
    trace: [{ c: 'schedule.lookahead(14 days)', r: '2 conflicts: Javier pesticide, Andrés med card', ms: '300 ms', det: true }, { c: 'sms.request_proof(Javier, es)', r: S.proof >= 1 ? 'photo received' : 'waiting', ms: S.proof >= 1 ? '—' : '', det: true, pending: S.proof < 1 }, { c: 'doc.read(license photo)', r: S.proof >= 1 ? 'number, categories, expiry · 0.97' : '', ms: S.proof >= 1 ? '3 s' : '', pending: S.proof < 1 }, { c: 'credential.update (confirmed by Tasha)', r: S.proof >= 2 ? 'conflict cleared' : '', ms: '', det: true, pending: S.proof < 2, human: S.proof === 1 }],
    hitl: [['Tasha', 'confirms what the AI read before the record changes.'], ['Luis', 'can reassign the work instead.']],
    creditNote: 'Reading one document page is 2 credits.',
    tags: [['mvp', 'credential catalog and records, expiry alerts, requirement rules, scheduling enforcement']],
    specs: 'Spec: 15 CRED-01 to CRED-05, §5.5, §6.3 · 04 (dispatch checks) · 14 (chemical records) · 22 §4.4.1 (document understanding)'
  };
};

/* hr08 */
WT.screens['hr08-h2b'] = function (S) {
  var ms = [['Prevailing wage determination', 'Agent', 'Dec 18', pill('ok', 'Done')], ['Labor certification filed (Jan 1 window)', 'Agent', 'Jan 2', pill('ok', 'Done')], ['Recruitment report', 'Agent', 'Jan 28', pill('ok', 'Done')], ['Labor certification decision', 'DOL', 'Feb 12', pill('ok', 'Certified')], ['Petition (I-129) filed', 'Agent', 'Feb 19', pill('ok', 'Done')], ['Petition receipt and cap result', 'USCIS', '—', pill('info', 'Waiting')], ['Consular appointments (8)', 'Workers', 'Mar 8-26', pill(S.remind ? 'info' : 'warn', S.remind ? '5 reminded' : '3 of 8 booked')], ['Housing ready (2 units, 8 beds)', 'Office', 'Mar 25', S.lease ? pill('ok', 'Ready') : pill('warn', 'Unit B lease unsigned')], ['Arrival transport plan', 'Office', 'Mar 28', pill('', 'Draft')]];
  var main = '<div class="apphead"><span class="crumb">Team › H-2B</span><h3>2027 season · date of need April 1 · 8 workers (6 returning)</h3></div><div class="wt-callout warn">Not legal advice. Confirm every filing and obligation with your attorney or agent. Agent: Lakeshore Seasonal Visa Services (outside collaborator, this workspace only).</div>' +
    '<div class="panel mt10"><div class="ms-row h"><span>Milestone</span><span>Owner</span><span>Due</span><span>Status</span></div>' + ms.map(function (m) { return '<div class="ms-row"><span>' + m[0] + '</span><span>' + m[1] + '</span><span class="mono tiny">' + m[2] + '</span><span>' + m[3] + '</span></div>'; }).join('') +
    '<div class="flex mt10">' + (S.lease ? '' : '<button type="button" class="btn sm" data-act="lease" data-k="lease">' + ic('upload') + 'Upload the signed Unit B lease</button>') + (S.remind ? '' : '<button type="button" class="btn sm" data-act="remind" data-k="remind">' + ic('chat') + 'Text the 5 workers about appointments (ES)</button>') + '</div></div>' +
    '<div class="wt-cols mt10"><div class="panel"><h4>Three-fourths guarantee</h4><dl class="kv"><dt>Period 1</dt><dd>Apr 1 - Jun 23</dd><dt>Required offer</dt><dd>360 h each (¾ × 60 workdays × 8 h)</dd><dt>Offered so far</dt><dd>0 h · tracked from the schedule</dd></dl></div>' +
    '<div class="panel"><h4>Reimbursements and parity</h4><dl class="kv"><dt>Week 1 pay</dt><dd>inbound travel and visa fees queued, so week 1 stays above minimum wage</dd><dt>Wage parity</dt><dd>5 US workers doing the same work · 0 conflicts</dd></dl></div></div>';
  return browser('app.rootline.com/team/h2b/2027', teamShell('H-2B', main), 'H-2B season workspace');
};
WT.actions.lease = function (el, S) { S.lease = true; };
WT.actions.remind = function (el, S) { S.remind = true; };
WT.ensure['hr08-h2b'] = function (S) { S.lease = true; S.remind = true; };
WT.bts['hr08-h2b'] = function (S) {
  return {
    what: 'Many Great Lakes landscape companies depend on H-2B workers. The workspace turns the date of need into a milestone tracker shared with the outside agent, keeps a case file per worker, tracks housing and transport, and computes obligations from real data: the three-fourths hours guarantee from the schedule, reimbursements carried into the payroll export, and wage parity with US workers doing the same job.',
    agents: [['H-2B workspace', 'Milestones, worker cases, guarantee, reimbursements, parity', 1]],
    trace: [{ c: 'h2b.milestones(date_of_need: 2027-04-01)', r: '9 milestones · 5 done', ms: '150 ms', det: true }, { c: 'guarantee.compute(period 1)', r: '360 h required per worker', ms: '40 ms', det: true }, { c: 'parity.check(corresponding employees)', r: '0 conflicts', ms: '90 ms', det: true }, { c: 'housing.update(Unit B)', r: S.lease ? 'lease on file' : 'unsigned', ms: '', det: true, pending: !S.lease }, { c: 'sms.remind(5 workers, es)', r: S.remind ? 'sent' : '', ms: S.remind ? '600 ms' : '', det: true, pending: !S.remind }],
    hitl: [['Tasha and the agent', 'own the filings; the workspace tracks and reminds.']],
    tags: [['v1', 'H-2B workspace: milestones, case files, guarantee, reimbursements, wage parity, housing and transport']],
    specs: 'Spec: 15 §4.4 (H2B-01 to H2B-14), §5.6, §6.5 · R-files cited in doc 15 (verify current rules)'
  };
};

/* hr09 */
WT.screens['hr09-timeoff'] = function (S) {
  var body = '<p class="ptitle">' + L(S, 'Request a day off', 'Pedir un día') + '</p><div class="pcard tiny"><dl class="kv"><dt>' + L(S, 'Type', 'Tipo') + '</dt><dd>' + L(S, 'Vacation', 'Vacaciones') + '</dd><dt>' + L(S, 'Date', 'Fecha') + '</dt><dd>' + L(S, 'Fri, May 14 (8 h)', 'vie 14 de mayo (8 h)') + '</dd><dt>' + L(S, 'Balance', 'Saldo') + '</dt><dd>32 h · ' + L(S, 'from Gusto', 'de Gusto') + '</dd></dl></div>' +
    (S.pto ? '<div class="okline">' + ic('check') + L(S, 'Approved by Tasha. Enjoy your day!', 'Aprobado por Tasha. ¡Disfrute su día!') + '</div>' : '<p class="tiny muted">' + L(S, 'Sent. You\'ll get a text when the office answers.', 'Enviado. Le avisamos por texto cuando la oficina responda.') + '</p>');
  var main = '<div class="apphead"><span class="crumb">Approvals › Time off</span><h3>Andrés Vega · Fri, May 14</h3></div><div class="panel"><h4>Schedule impact</h4><dl class="kv"><dt>Crew 1 that day</dt><dd>14 stops, 3 people (lead out)</dd><dt>Acting lead</dt><dd>Tomás Herrera (Crew 1, has led before)</dd><dt>Fill-in</dt><dd>Rafael Gómez from Crew 2 (light Friday) · zero-turn authorized · 32 h scheduled that week</dd><dt>Others off</dt><dd>none on Crew 1</dd></dl>' +
    (S.pto ? '<div class="okline mt6">' + ic('check') + 'Approved · schedule updated · Tomás and Rafael notified in their languages</div>' : '<div class="flex mt10"><button type="button" class="btn sm primary" data-act="pto" data-k="pto">Approve with the fill-in</button><button type="button" class="btn sm">Decline</button></div>') + '</div>';
  return withPhone(browser('app.rootline.com/approvals/time-off/TO-0412', teamShell('Approvals', main, { Approvals: S.pto ? 0 : 1 }), 'Time-off approval'), phone(body, { brand: 'Rootline Crew', sub: 'Andrés Vega · ' + L(S, 'Me', 'Yo'), logo: 'truck', right: langBtn(S, 'p'), label: 'Andrés\'s crew app: time off', k: 'pt' }));
};
WT.actions.pto = function (el, S) { S.pto = 'ok'; };
WT.ensure['hr09-timeoff'] = function (S) { S.pto = 'ok'; };
WT.bts['hr09-timeoff'] = function (S) {
  return {
    what: 'Crew members request time off from the self-service tab of the crew app, in their language, and see their balance from the payroll provider. The office sees the schedule impact before approving: who leads the crew, who fills in, and whether the fill-in is authorized on the equipment.',
    agents: [['Time off (PTO-01 to PTO-03)', 'Requests, balances from Gusto, schedule impact', 1]],
    trace: [{ c: 'gusto.pto_balance(Andrés)', r: '32 h vacation', ms: '700 ms', det: true }, { c: 'schedule.impact(Crew 1, May 14)', r: 'acting lead Tomás; fill-in Rafael (authorized)', ms: '200 ms', det: true }, { c: 'timeoff.approve', r: S.pto ? 'approved; 3 people notified' : 'waiting', ms: S.pto ? 'human' : '', human: !S.pto }],
    hitl: [['Tasha', 'approves; the schedule only changes when she does.']],
    tags: [['mvp', 'availability, time-off requests, balances read from the payroll provider, rain-day call-offs']],
    specs: 'Spec: 15 PTO-01 to PTO-03, PTO-06, §5.9 · 04 (schedule impact) · 05 (self-service tab)'
  };
};

/* hr10 */
WT.screens['hr10-timesheets'] = function (S) {
  var ex = [
    ['rafael', 'Rafael Gómez · Crew 2 · Tue Apr 20', 'Missing clock-out', 'Last segment: job at 1866 Bedford Rd until 3:24 PM', 'Suggest 3:42 PM: left the property geofence 3:24, 14 min drive, yard gate 3:38, unloading', 'Accept 3:42 PM'],
    ['javier', 'Javier Torres · Crew 2 · Thu Apr 22', 'Job time without a Visit (0.6 h)', 'Near the Patel property; their mulch was scheduled Friday', 'Suggest: attach to the Patel mulch Visit, done a day early (photos at 2:10 PM)', 'Attach to the Visit'],
    ['andres', 'Andrés Vega · Crew 1 · week', 'Overtime 6.5 h', '46.5 h: storm cleanup Wed, approved by Luis', 'Weekly overtime over 40 h (Ohio and federal pack)', 'Approve']
  ];
  var done = Object.keys(S.ex).length;
  var main = '<div class="apphead"><span class="crumb">Team › Timesheets</span><h3>Week Sun Apr 18 - Sat Apr 24 · weekly field</h3><span class="sp"></span>' + pill('warn', 'Cutoff Mon 10:00') + '</div>' +
    '<div class="panel"><h4>Exceptions (' + (3 - done) + ')</h4><ul class="wt-list">' + ex.map(function (e) { var ok = S.ex[e[0]]; return '<li class="wt-row' + (ok ? ' soft' : ' ai') + '" style="grid-template-columns:auto minmax(0,1fr) minmax(0,1.1fr) auto"><span class="wt-ic ' + (ok ? 'ok' : 'warn') + '">' + ic(ok ? 'check' : 'warn') + '</span><span><b>' + e[1] + '</b><span class="sub">' + e[2] + ' · ' + e[3] + '</span></span><span class="tiny">' + (e[0] === 'andres' ? '' : ic('spark') + ' ') + e[4] + '</span>' + (ok ? pill('ok', 'Done') : '<button type="button" class="btn xs primary" data-act="ex" data-v="' + e[0] + '" data-k="ex' + e[0] + '">' + e[5] + '</button>') + '</li>'; }).join('') + '</ul></div>' +
    '<div class="panel mt10 flex" style="justify-content:space-between"><span><b>Clean (24)</b> <span class="tiny muted">Crew 1 (4) · Crew 2 (4) · Crew 3 (5) · Crew 4 (5) · Install (6)</span></span>' + (S.clean ? pill('ok', 'Approved') : '<button type="button" class="btn sm primary" data-act="clean" data-k="clean">Approve all clean (24)</button>') + '</div>' +
    '<div class="wt-kpis mt10"><div class="wt-kpi"><div class="l">Regular</div><div class="v">' + num(PAY.reg, 1) + '</div><div class="d">hours</div></div><div class="wt-kpi"><div class="l">Overtime</div><div class="v">' + num(PAY.ot, 1) + '</div><div class="d">hours</div></div><div class="wt-kpi"><div class="l">Sick</div><div class="v">' + num(PAY.sick, 1) + '</div><div class="d">hours</div></div><div class="wt-kpi"><div class="l">Est. gross</div><div class="v">' + money(PAY.gross) + '</div><div class="d">labor budget 96%</div></div></div>';
  return browser('app.rootline.com/team/timesheets/2027-04-18', teamShell('Timesheets', main, { Timesheets: 3 - done }), 'Timesheet approval board');
};
WT.actions.ex = function (el, S) { S.ex[el.getAttribute('data-v')] = true; };
WT.actions.clean = function (el, S) { S.clean = true; };
WT.ensure['hr10-timesheets'] = function (S) { S.ex = { rafael: true, javier: true, andres: true }; S.clean = true; };
WT.bts['hr10-timesheets'] = function (S) {
  var n = Object.keys(S.ex).length;
  return {
    what: 'Timesheets are built from the crew app\'s punch stream (shop, drive, job and break segments), approved daily by crew leads and weekly here. The board shows exceptions first and collapses clean timesheets into one bulk approval. The Timesheet Anomaly agent proposes fixes with evidence (geofence exits, gate entry, Visit photos), and a supervisor accepts each one. Approved hours post to each Visit\'s job cost at once.',
    agents: [['Timesheet Anomaly (A17)', 'Proposes corrections with evidence; never edits approved time [V1]', 0], ['Pay rules (Ohio and federal pack)', 'Weekly overtime, minors\' breaks', 1]],
    trace: [{ c: 'timesheet.derive(27 people)', r: '27 timesheets', ms: '1.8 s', det: true }, { c: 'agent.A17.scan(week)', r: '3 exceptions, 2 with suggested fixes', ms: '9 s' }, { c: 'approve(exceptions)', r: n + ' of 3 resolved by Luis', ms: '—', det: true, human: n < 3 }, { c: 'approve(clean ×24) → labor.LB1 to job costs', r: S.clean ? 'posted' : 'waiting', ms: S.clean ? '1.2 s' : '', det: true, pending: !S.clean }],
    hitl: [['Luis', 'accepts each suggestion; the evidence and his name are stored with it.'], ['Crew leads', 'approved each day already.']],
    levels: ['A17 at L2: suggests, a person approves'],
    tags: [['mvp', 'timesheet derivation, exceptions, multi-level approval, approval board, Ohio and federal pay rules'], ['v1', 'A17 suggestions with evidence']],
    specs: 'Spec: 15 TIME-01 to TIME-05, §6.2 · 17 A17 · 09 labor.LB1-LB3 · 05 (punch segments)'
  };
};

/* hr11 */
WT.screens['hr11-payroll'] = function (S) {
  var steps = ['Lock', 'Compute', 'Validate', 'Preview', 'Approve', 'Push', 'Post'];
  var at = S.posted ? 7 : S.pushed ? 6 : S.appr2 ? 5 : S.mismatch ? 4 : 2;
  var main = '<div class="apphead"><span class="crumb">Payroll › Close period</span><h3>Weekly field · Apr 18-24 · pay date Fri Apr 30 · Gusto</h3></div><div class="wt-steps">' + steps.map(function (t, i) { return '<span class="' + (i < at ? 'done' : i === at ? 'on' : '') + '">' + (i + 1) + ' ' + t + '</span>'; }).join('') + '</div>' +
    '<div class="wt-cols wide-left mt10"><div class="wt-stack"><div class="panel"><h4>Validation</h4><ul class="wt-list"><li class="wt-row soft"><span class="wt-ic ok">' + ic('check') + '</span><span>26 employees match Gusto</span><span></span></li>' +
    '<li class="wt-row' + (S.mismatch ? ' soft' : '') + '"><span class="wt-ic ' + (S.mismatch ? 'ok' : 'warn') + '">' + ic(S.mismatch ? 'check' : 'warn') + '</span><span>Maria López: Rootline $22.50, Gusto $22.00<span class="sub">Raise effective Apr 11, signed by Erin</span></span>' + (S.mismatch ? pill('ok', 'Confirmed') : '<button type="button" class="btn xs primary" data-act="mismatch" data-k="mismatch">Confirm $22.50</button>') + '</li>' +
    '<li class="wt-row soft"><span class="wt-ic info">' + ic('flag') + '</span><span>Qualified overtime premium tagged: ' + money(PAY.otPrem, true) + '<span class="sub">Information for W-2 reporting, not tax advice</span></span><span></span></li></ul></div>' +
    '<div class="panel"><h4>Approval</h4><div class="tiny">Two people approve any period over $20,000.</div><div class="flex mt6">' + (S.appr1 ? pill('ok', 'Tasha approved') : '<button type="button" class="btn sm primary" data-act="appr1" data-k="appr1"' + (S.mismatch ? '' : ' disabled') + '>Approve (Tasha)</button>') + (S.appr2 ? pill('ok', 'Erin approved') : '<button type="button" class="btn sm" data-act="appr2" data-k="appr2"' + (S.appr1 ? '' : ' disabled') + '>Second approval (Erin)</button>') + '</div>' +
    (S.appr2 && !S.pushed ? '<button type="button" class="btn sm primary mt6" data-act="push" data-k="push">Push to Gusto</button>' : '') + (S.pushed && !S.posted ? '<button type="button" class="btn sm mt6" data-act="post" data-k="post">Import Gusto\'s payroll journal</button>' : '') + (S.pushed ? '<div class="okline mt6">' + ic('check') + '27 employees sent to Gusto; Gusto computes taxes and pays</div>' : '') + '</div></div>' +
    '<div class="wt-stack"><div class="panel"><h4>Earnings</h4><table class="data tight"><tbody><tr><td>Regular</td><td class="num">' + num(PAY.reg, 1) + ' h</td><td class="num">' + money(PAY.regAmt, true) + '</td></tr><tr><td>Overtime</td><td class="num">' + num(PAY.ot, 1) + ' h</td><td class="num">' + money(PAY.otAmt, true) + '</td></tr><tr><td>Sick</td><td class="num">' + num(PAY.sick, 1) + ' h</td><td class="num">' + money(PAY.sickAmt, true) + '</td></tr><tr><td><b>Total gross</b></td><td></td><td class="num"><b>' + money(PAY.gross, true) + '</b></td></tr></tbody></table></div>' +
    (S.posted ? '<div class="panel"><h4>Payroll journal (payroll.PR1)</h4>' + je([['2310 Accrued Wages (applied from approved time)', PAY.applied, 0], ['5190 Field Labor Variance (OT premium, sick pay)', PAY.variance, 0], ['2360 Payroll Clearing (net pay)', 0, PAY.net], ['2320 Payroll Taxes Payable (withholdings)', 0, PAY.withheld]]) + '<div class="wt-note mt6">Employer taxes post through 2390 Applied Labor Burden Clearing (not shown). Priya sees it in the close checklist.</div></div>' : '') + '</div></div>';
  return browser('app.rootline.com/payroll/close/2027-04-18', teamShell('Payroll', main), 'Pay period close');
};
WT.actions.mismatch = function (el, S) { S.mismatch = true; };
WT.actions.appr1 = function (el, S) { S.appr1 = true; };
WT.actions.appr2 = function (el, S) { S.appr2 = true; };
WT.actions.push = function (el, S) { S.pushed = true; };
WT.actions.post = function (el, S) { S.posted = true; };
WT.ensure['hr11-payroll'] = function (S) { S.mismatch = true; S.appr1 = true; S.appr2 = true; S.pushed = true; S.posted = true; };
WT.bts['hr11-payroll'] = function (S) {
  return {
    what: 'Rootline is not a payroll engine: it hands clean hours and earnings to the payroll provider. The close wizard locks the week, applies the pay rules, blocks on data problems (a pay rate that doesn\'t match the provider), needs two approvals above a threshold, pushes to Gusto and then imports Gusto\'s payroll journal. Job costs already carry every approved hour at base rate, so the journal only books the difference to a variance account.',
    agents: [['Pay period close (PAY-02)', 'Lock, compute, validate, approve, push, post', 1], ['Ledger', 'Payroll journal import (payroll.PR1)', 1]],
    trace: [{ c: 'pay_rules.compute(Ohio + federal)', r: 'OT 38.5 h; qualified premium ' + money(PAY.otPrem, true), ms: '700 ms', det: true }, { c: 'guardrail.rate_match(Gusto)', r: S.mismatch ? 'confirmed $22.50 for Maria' : '1 mismatch blocks export', ms: '400 ms', det: true }, { c: 'approve(two-person > $20,000)', r: S.appr2 ? 'Tasha, Erin' : S.appr1 ? 'Tasha; waiting for Erin' : 'waiting', ms: '—', det: true, human: !S.appr2 }, { c: 'gusto.payroll.push(27)', r: S.pushed ? 'accepted' : '', ms: S.pushed ? '3.2 s' : '', det: true, pending: !S.pushed }, { c: 'ledger.import(payroll journal)', r: S.posted ? 'balanced · variance ' + money(PAY.variance, true) : '', ms: S.posted ? '600 ms' : '', det: true, pending: !S.posted }],
    hitl: [['Tasha and Erin', 'approve; nothing reaches Gusto without both.'], ['Priya', 'reviews the journal in the month-end close.']],
    tags: [['mvp', 'pay calendars, close wizard, rate guardrails, Gusto/QuickBooks Payroll/ADP/Paychex exports, payroll journal import, qualified-overtime tagging']],
    specs: 'Spec: 15 PAY-01 to PAY-08, §5.3, §6.6 · 09 §4.5.7, payroll.PR1-PR3, E13 example'
  };
};

/* hr12 */
WT.screens['hr12-explain'] = function (S) {
  var lines = [[L(S, 'Regular 40.0 h × $19.50', 'Regular 40.0 h × $19.50'), '$780.00'], [L(S, 'Overtime 4.5 h × $29.25', 'Horas extra 4.5 h × $29.25'), '$131.63']];
  var body = '<p class="psub">' + L(S, 'My pay · week of Apr 18-24', 'Mi pago · semana 18-24 abr') + '</p><p class="ptitle">$911.63</p><p class="psub">' + L(S, 'Gross (estimate) · paid Fri, Apr 30', 'Bruto (estimado) · pago viernes 30 de abril') + '</p>' +
    '<div class="pcard">' + lines.map(function (l) { return '<div class="pay-line"><span>' + l[0] + '</span><b>' + l[1] + '</b></div>'; }).join('') + '<button type="button" class="btn xs mt6" data-act="why" data-k="why">' + L(S, 'Why?', '¿Por qué?') + '</button></div>' +
    (S.why ? '<div class="wt-bubble ai">' + L(S, 'You worked 44.5 hours. The first 40 are paid at your rate of $19.50. The 4.5 extra hours are paid at time and a half: $19.50 × 1.5 = $29.25. On Tuesday you didn\'t clock out; Luis approved 3:42 PM from when you got back to the yard.', 'Trabajó 44.5 horas. Las primeras 40 se pagan a su tarifa de $19.50. Las 4.5 horas extra se pagan a tiempo y medio: $19.50 × 1.5 = $29.25. El martes no marcó la salida; Luis aprobó 3:42 p. m. según su llegada al patio.') + '</div>' : '') +
    '<p class="tiny muted mt6">' + L(S, 'Qualified overtime (federal): $43.88 this week. Information, not tax advice.', 'Horas extra calificadas (federal): $43.88 esta semana. Información, no es consejo fiscal.') + '</p>' +
    (S.confirmed ? '<div class="okline">' + ic('check') + L(S, 'Confirmed', 'Confirmado') + '</div>' : '<div class="flex"><button type="button" class="btn sm">' + ic('play') + L(S, 'Listen', 'Escuchar') + '</button><button type="button" class="btn sm">' + L(S, 'Ask the office', 'Hablar con la oficina') + '</button><button type="button" class="btn sm primary" data-act="confirm" data-k="confirm">' + L(S, 'Confirm', 'Confirmar') + '</button></div>');
  return devRow(phone(body, { brand: 'Rootline Crew', sub: 'Rafael Gómez · ' + L(S, 'Pay', 'Pago'), logo: 'truck', right: langBtn(S, 'x'), label: 'Rafael\'s crew app: pay explainer', k: 'px' }),
    ctxCard('How the explainer works', ['<b>Numbers</b> come from the pay-rules audit trail, never computed by AI.', '<b>Words:</b> AI writes plain Spanish or English around those numbers.', '<b>Questions:</b> "Ask the office" opens a thread with Tasha.', '<b>The final pay stub</b> comes from Gusto on payday.']));
};
WT.actions.why = function (el, S) { S.why = true; };
WT.actions.confirm = function (el, S) { S.confirmed = true; };
WT.ensure['hr12-explain'] = function (S) { S.why = true; S.confirmed = true; };
WT.bts['hr12-explain'] = function (S) {
  return {
    what: 'Pay confusion is a top reason seasonal crew members leave. Each week Rafael sees his hours and pay before payday, and every line opens a plain-language explanation. The numbers come from the pay-rules audit trail; the AI only narrates them in his language and can\'t change them. Confirming or disputing goes back to the office before the payroll closes next time.',
    agents: [['Pay explainer (TIME-08)', 'Narrates audited numbers in the employee\'s language [V1]', 0]],
    trace: [{ c: 'pay_rules.audit(Rafael, week)', r: '40.0 REG, 4.5 OT, missing clock-out fixed (3:42 PM)', ms: '60 ms', det: true }, { c: 'explain.narrate(es, numbers fixed)', r: S.why ? '3 sentences' : 'on tap', ms: S.why ? '1.4 s' : '', pending: !S.why }, { c: 'timesheet.acknowledge(Rafael)', r: S.confirmed ? 'confirmed' : 'waiting', ms: '', det: true, pending: !S.confirmed }],
    hitl: [['Rafael', 'confirms or asks the office.']],
    tags: [['v1', 'weekly acknowledgment and pay explainer'], ['mvp', 'qualified-overtime tagging']],
    specs: 'Spec: 15 TIME-08, §6.8 · 17 (LLM narrates, never computes) · 22 §4.4.1'
  };
};

/* hr13 */
WT.screens['hr13-recap'] = function (S) {
  var rows = [['Season plan and requisitions', 'Erin', 'V1'], ['Bilingual job post with a posting check', 'Tasha, Marco, A25', 'V1'], ['Mobile apply in Spanish with voice', 'Rafael', 'V1'], ['Pipeline, SMS interviews, structured scoring', 'Tasha, Marco', 'V1'], ['Offer, onboarding, Gusto hand-off, kit', 'Tasha, Rafael', 'MVP and V1'], ['Micro-lessons and practical sign-off', 'Rafael, Marco', 'V1'], ['Credentials enforced at dispatch', 'Luis, Javier', 'MVP'], ['H-2B workspace', 'Tasha, agent', 'V1'], ['Time off with schedule impact', 'Andrés, Tasha', 'MVP'], ['Exception-first timesheets', 'Luis, A17', 'MVP and V1'], ['Close and export to Gusto, journal import', 'Tasha, Erin, Priya', 'MVP'], ['Pay explained in Spanish', 'Rafael', 'V1']];
  return '<div class="panel"><table class="data tight"><thead><tr><th>Step</th><th>Who</th><th>Scope</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>'; }).join('') + '</tbody></table><p class="tiny muted mt10">AI used ' + 17 + ' credits across the whole season-start: drafts, summaries, a document read, a timesheet scan and an explanation. AI never ranked an applicant, approved time or computed pay.</p></div>' +
    '<div class="flex mt14"><a class="btn" href="#overview">' + ic('arrow-l') + 'Back to start</a><a class="btn" href="wt-crew-day.html">A crew\'s day in the field app</a><a class="btn primary" href="walkthroughs.html">All walkthroughs ' + ic('arrow-r') + '</a></div>';
};
WT.bts['hr13-recap'] = function (S) {
  return {
    what: 'One people system follows the season: plan, hire, onboard, train, schedule only qualified people, track H-2B obligations, approve time with evidence, and hand clean pay data to the payroll provider. The same approved hour feeds payroll, job costing and future estimates.',
    hitl: [['Office', 'approves requisitions, offers, time, payroll and every AI suggestion.'], ['Crew leads', 'interview, sign off on equipment and approve daily time.']],
    tags: [['mvp', 'credentials, time off, timesheets, payroll export and journal'], ['v1', 'recruiting, LMS, H-2B, A17, pay explainer'], ['v2', 'background checks, embedded payroll for every company']],
    specs: 'Spec: 15 (whole module) · 02, 04, 05, 09, 13, 17, 22'
  };
};
