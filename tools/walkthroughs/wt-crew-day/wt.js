/* Walkthrough: a crew's day in the Rootline crew app (doc 05). Phone-first, offline-first, EN/ES. */

function L(S, en, es) { return S.lang === 'es' ? es : en; }
function crewPhone(S, inner, opt) {
  opt = opt || {};
  var right = '<span class="flex" style="gap:4px">' + (opt.offline ? '<span class="pill warn">' + ic('wifi-off') + L(S, 'Offline', 'Sin señal') + '</span>' : '<span class="pill ok">' + L(S, 'Synced', 'Sincronizado') + '</span>') + '<button type="button" class="btn xs" data-act="lang" data-k="lang' + (opt.k || '') + '" aria-label="Language">' + (S.lang === 'es' ? 'ES' : 'EN') + '</button></span>';
  return phone(inner, { brand: 'Rootline Crew', sub: opt.sub || 'Crew 2 · Marco Ruiz', logo: 'truck', right: right, offline: opt.offline, label: opt.label || 'Crew app', k: opt.k, time: opt.time });
}
var CREW = [['MR', 'Marco Ruiz', 'Crew lead'], ['ML', 'Maria López', 'Technician'], ['JT', 'Javier Torres', 'Technician']];
var BEDS = [['A', [['ITE LH', 3], ['ILE SH', 4], ['SCH SO', 7], ['ECH PWB', 7]]], ['B', [['CER CAN', 1], ['PAN NW', 7], ['MON CG', 4], ['AMS HUB', 8], ['SCH SO', 9], ['ECH PWB', 3], ['ITE LH', 3]]], ['C', [['MON CG', 3], ['ECH PWB', 5]]], ['D', [['JUN TAY', 1], ['SCH SO', 5]]]];
function bedCount(b) { return b[1].reduce(function (t, x) { return t + x[1]; }, 0); }

var WT = {
  title: 'Rootline walkthrough: a crew\'s day',
  short: 'A crew\'s day',
  ovTitle: 'A crew\'s day in the field app',
  startLeft: 4188,
  acts: [
    { n: 'Act 1', t: 'Morning at the yard', sub: 'Punch in, safety, load out' },
    { n: 'Act 2', t: 'On the route', sub: 'Mowing, a lawn program, a dead zone' },
    { n: 'Act 3', t: 'Install crew', sub: 'Planting the Okafors\' design' },
    { n: 'Act 4', t: 'Issues, money and close-out', sub: 'Voice notes, payments, end of day, winter' }
  ],
  steps: [
    { id: 'c01-punch', act: 0, short: 'Crew punch', title: 'Sign in on the truck tablet and punch in the crew', who: 'Marco, Maria, Javier', tags: ['mvp'] },
    { id: 'c02-safety', act: 0, short: 'Safety checks', title: 'Pre-trip inspection and the morning tailgate talk', who: 'Marco', tags: ['mvp'] },
    { id: 'c03-loadout', act: 0, short: 'Load-out', title: 'Load-out sheet, tool checkout and hour meters', who: 'Marco', tags: ['mvp', 'v1'] },
    { id: 'c04-route', act: 1, short: 'Today\'s route', title: 'Today\'s route, gate codes and "on the way" texts', who: 'Marco', tags: ['mvp'] },
    { id: 'c05-mow', act: 1, short: 'Mowing visit', title: 'A mowing visit, with a photo check before leaving', who: 'Maria', ai: true, tags: ['mvp', 'v1'] },
    { id: 'c06-apply', act: 1, short: 'Lawn program', title: 'A fertilizer round and the wind gate', who: 'Javier', tags: ['mvp'] },
    { id: 'c07-offline', act: 1, short: 'Dead zone', title: 'Working offline, then a sync conflict', who: 'Marco', tags: ['mvp'] },
    { id: 'c08-install', act: 2, short: 'Install', title: 'Crew 1 plants the Okafors\' design', who: 'Andrés Vega', tags: ['mvp', 'v1'] },
    { id: 'c09-issues', act: 3, short: 'Voice note and safety', title: 'A Spanish voice note, a heat check and a small incident', who: 'Javier, Marco', ai: true, tags: ['mvp'] },
    { id: 'c10-pay', act: 3, short: 'Field payment', title: 'Getting paid in the field', who: 'Marco', tags: ['mvp', 'v1'] },
    { id: 'c11-closeout', act: 3, short: 'Close-out', title: 'End-of-day report, time approval and clock-out', who: 'Marco', ai: true, tags: ['mvp', 'v1'] },
    { id: 'c12-snow', act: 3, short: 'Snow Lite', title: 'Winter: a storm night with Snow Lite', who: 'Marco', tags: ['mvp'] },
    { id: 'c13-recap', act: 3, short: 'Recap', title: 'Recap: what the app captured and where it went', who: 'Everyone', tags: [] }
  ],
  credits: { 'c09-issues': 1, 'c11-closeout': 1 },
  state: { lang: 'en', sel: { MR: true, ML: true, JT: true }, punched: false, dvir: false, swap: false, talk: false, qr: false, hours: '', gate: false, navApp: 'Google Maps', afterBack: false, mowDone: false, wind: 'high', sealed: false, online: false, synced: false, resolved: '', planted: { A: false, B: false, C: false, D: false }, sub: false, voice: false, incident: false, payMode: 'tap', paid: false, report: false, approved: false, out: false, push: false, pdf: false },
  ov: {
    eyebrow: 'Clickable walkthrough · the crew app',
    h: 'Most of the work happens in the truck and on the lawn. This is the crew\'s side of Rootline.',
    lede: 'Follow Greenleaf\'s Crew 2 through a Tuesday: a crew punch on the shared truck tablet, the pre-trip inspection and tailgate talk, the load-out, the route, a mowing visit with a photo check, a lawn-program round that the wind gate pauses, a dead zone and a sync conflict. Crew 1 plants the Okafors\' design from the AI design walkthrough. Then a Spanish voice note, a small incident, a field payment, close-out and a winter storm night with Snow Lite. Switch the app between English and Spanish with the EN/ES button on any phone.',
    cast: [
      { h: 'Crew 2 (maintenance)', icon: 'truck', items: [['Marco Ruiz', 'crew lead'], ['Maria López', 'technician'], ['Javier Torres', 'technician, Spanish-first, licensed applicator']] },
      { h: 'Crew 1 (install)', icon: 'sprout', items: [['Andrés Vega', 'crew lead, planting the Okafors\' backyard']] },
      { h: 'Office', icon: 'leaf', items: [['Luis Ortega', 'operations manager'], ['Tasha Greene', 'office manager'], ['Jess Morales', 'designer, approves substitutions']] },
      { h: 'Agents and rules', icon: 'spark', items: [['Field-Note agent (A4)', 'Spanish voice notes to English summaries'], ['Photo QA (A12)', 'checks photo completeness [V1]'], ['Wind gate and rule packs', 'deterministic compliance checks']] }
    ],
    extra: '<p class="wt-note mt14">Product names, EPA registration numbers and state rules in this walkthrough are placeholders or marked "verify". Location is collected only while someone is on the clock.</p>'
  },
  screens: {}, bts: {}, actions: {}, inputs: {}, ensure: {}
};
WT.actions.lang = function (el, S) { S.lang = S.lang === 'es' ? 'en' : 'es'; };

/* c01 */
WT.screens['c01-punch'] = function (S) {
  var body = '<p class="ptitle">' + L(S, 'Good morning, Crew 2', 'Buenos días, Cuadrilla 2') + '</p><p class="psub">' + L(S, 'Truck 12 · Greenleaf yard · Tue', 'Camión 12 · Patio de Greenleaf · mar') + '</p>' +
    '<div class="wt-stack">' + CREW.map(function (c) { var on = S.sel[c[0]]; return '<button type="button" class="crewcard' + (on ? ' on' : '') + '" data-act="sel" data-v="' + c[0] + '" data-k="sel' + c[0] + '"><span class="avb">' + c[0] + '</span><span><b>' + c[1] + '</b><span class="tiny faint" style="display:block">' + (S.punched && on ? L(S, 'On the clock 6:58 AM', 'Trabajando desde 6:58 AM') : (c[2] === 'Crew lead' ? L(S, 'Crew lead', 'Jefe de cuadrilla') : L(S, 'Technician', 'Técnico'))) + '</span></span>' + (on ? ic('check') : '') + '</button>'; }).join('') + '</div>' +
    (S.punched ? '<div class="toast">' + ic('check') + L(S, '3 people clocked in at 6:58 AM · at the yard', '3 personas registradas a las 6:58 AM · en el patio') + '</div>' : '<div class="pcard soft"><div class="tiny">' + L(S, 'Each person confirms with their own 4-digit PIN.', 'Cada persona confirma con su PIN de 4 dígitos.') + '</div><div class="pinpad mt6">' + [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (n) { return '<button type="button" tabindex="-1" aria-hidden="true">' + n + '</button>'; }).join('') + '</div></div><button type="button" class="btn primary bigbtn" data-act="punch" data-k="punch">' + ic('clock') + L(S, 'Clock in selected crew', 'Registrar entrada de la cuadrilla') + '</button>');
  return devRow(crewPhone(S, body, { label: 'Shared truck tablet: crew punch' }), ctxCard('Shared tablet, individual records', ['The truck tablet is enrolled to Crew 2; each person still confirms with their own PIN, so time is per person.', 'One tap clocks in the whole crew; anyone can be detached later (a ride to the shop, a dentist appointment).', 'Language follows the person: Javier\'s screens and messages are in Spanish.', 'Location is collected only while someone is on the clock, never during unpaid meals or off duty.']));
};
WT.actions.sel = function (el, S) { var k = el.getAttribute('data-v'); if (!S.punched) S.sel[k] = !S.sel[k]; };
WT.actions.punch = function (el, S) { S.punched = true; };
WT.ensure['c01-punch'] = function (S) { S.punched = true; };
WT.bts['c01-punch'] = function (S) {
  return {
    what: 'Crew time is event-sourced: each punch is an append-only event with the device, person and place. A crew punch writes one event per person, so payroll and job costing stay per person even on a shared tablet. Everything works offline and syncs later.',
    agents: [['Time service', 'Punch events, geofence check, device enrollment', 1]],
    trace: [{ c: 'device.verify(Truck 12 tablet)', r: 'enrolled to Crew 2, kiosk mode', ms: '20 ms', det: true }, { c: 'time.punched(×3, in, 6:58)', r: S.punched ? 'Marco, Maria, Javier' : 'waiting', ms: S.punched ? '30 ms' : '', det: true, pending: !S.punched }, { c: 'geofence.check(yard)', r: S.punched ? 'inside Greenleaf yard' : '', ms: S.punched ? '5 ms' : '', det: true, pending: !S.punched }],
    hitl: [['Each crew member', 'confirms with their own PIN; Marco can fix a missed punch, and edits keep an audit trail.']],
    tags: [['mvp', 'shared-tablet PIN mode, crew punch, EN/ES, offline']],
    specs: 'Spec: 05 §4.5 (crew time), §4.23 (location privacy) · 02 (kiosk PIN, device trust) · 15 (time segments)'
  };
};

/* c02 */
WT.screens['c02-safety'] = function (S) {
  var items = [[L(S, 'Brakes, lights, horn', 'Frenos, luces, bocina'), 'ok'], [L(S, 'Tires and lug nuts', 'Llantas y tuercas'), 'ok'], [L(S, 'Trailer TR-4: right tail light', 'Remolque TR-4: luz trasera derecha'), 'bad'], [L(S, 'Hitch, chains, ramp latch', 'Enganche, cadenas, rampa'), 'ok']];
  var body = '<p class="ptitle">' + L(S, 'Pre-trip inspection', 'Inspección antes de salir') + '</p><p class="psub">Truck 12 + Trailer TR-4</p><div class="wt-list">' + items.map(function (i) { return '<div class="wt-row' + (i[1] === 'bad' ? '' : ' soft') + '"><span class="wt-ic ' + (i[1] === 'bad' ? 'danger' : 'ok') + '">' + ic(i[1] === 'bad' ? 'warn' : 'check') + '</span><span>' + i[0] + (i[1] === 'bad' ? '<span class="sub">' + L(S, 'Defect · photo attached', 'Defecto · foto adjunta') + '</span>' : '') + '</span><span></span></div>'; }).join('') + '</div>' +
    (S.swap ? '<div class="toast">' + ic('check') + L(S, 'TR-4 out of service. Switched to TR-6; inspection passed.', 'TR-4 fuera de servicio. Cambiado a TR-6; inspección aprobada.') + '</div>' : '<div class="wt-callout danger">' + L(S, 'TR-4 is out of service until a mechanic clears it. It cannot be assigned or driven.', 'TR-4 queda fuera de servicio hasta que un mecánico lo revise.') + '</div><button type="button" class="btn primary" data-act="swap" data-k="swap">' + L(S, 'Switch to trailer TR-6', 'Cambiar al remolque TR-6') + '</button>') +
    '<div class="pcard"><h4>' + ic('shield') + ' ' + L(S, 'Tailgate talk: heat', 'Charla de seguridad: calor') + '</h4><p class="tiny">' + L(S, 'Forecast 88°F, heat index 94°F. Water every 15 minutes, shade breaks, watch each other for cramps and dizziness.', 'Pronóstico 88°F, índice de calor 94°F. Agua cada 15 minutos, descansos a la sombra, cuídense de calambres y mareos.') + '</p>' + (S.talk ? '<div class="okline">' + ic('check') + L(S, 'Signed by Marco, Maria, Javier', 'Firmado por Marco, Maria, Javier') + '</div>' : '<button type="button" class="btn sm" data-act="talk" data-k="talk">' + L(S, 'Collect 3 signatures', 'Recoger 3 firmas') + '</button>') + '</div>';
  return devRow(crewPhone(S, body, { label: 'Crew app: safety checks' }), ctxCard('Safety without paperwork', ['A defect that makes equipment unsafe blocks it: the trailer can\'t be put on a route until a mechanic clears the work order.', 'The pre-trip record (DVIR) is kept with the vehicle for its retention period (verify the FMCSA rule for each fleet).', 'Tailgate talks are bilingual, signed on the device, and counted as training records.']));
};
WT.actions.swap = function (el, S) { S.swap = true; };
WT.actions.talk = function (el, S) { S.talk = true; };
WT.ensure['c02-safety'] = function (S) { S.swap = true; S.talk = true; };
WT.bts['c02-safety'] = function (S) {
  return {
    what: 'The inspection finds a broken tail light on trailer TR-4. Rootline marks it out of service, opens a maintenance work order for the shop and lets Marco swap to another trailer. The heat forecast picks the day\'s tailgate talk; the crew signs on the device.',
    agents: [['Fleet and safety rules', 'DVIR, out-of-service block, work orders', 1]],
    trace: [{ c: 'dvir.submit(Truck 12, TR-4)', r: '1 defect: right tail light', ms: '40 ms', det: true }, { c: 'asset.status_changed(TR-4, out_of_service)', r: 'blocked from routes; work order WO-221 opened', ms: '30 ms', det: true }, { c: 'assignment.swap(TR-4 → TR-6)', r: S.swap ? 'TR-6 inspection passed' : 'waiting', ms: S.swap ? '25 ms' : '', det: true, pending: !S.swap }, { c: 'safety.tailgate_talk(heat, 3 signatures)', r: S.talk ? 'recorded as training' : 'waiting', ms: S.talk ? '15 ms' : '', det: true, pending: !S.talk }],
    hitl: [['Marco', 'records the inspection and swaps the trailer; the shop clears TR-4.']],
    tags: [['mvp', 'DVIR with out-of-service blocking, tailgate talks with signatures']],
    specs: 'Spec: 05 §4.12 (safety) · 13 (DVIR, work orders) · 15 (training records)'
  };
};

/* c03 */
WT.screens['c03-loadout'] = function (S) {
  var mats = [['Granular fertilizer 25-0-5, 50 lb', '4 bags', 'round 4 at 3 lawns'], ['Broadleaf spot-spray concentrate', '1 jug', 'label kept in app'], ['Double-shred hardwood mulch', '2 yd³', 'Kovacs enhancement'], ['Trimmer line .095', '1 spool', '']];
  var body = '<p class="ptitle">' + L(S, 'Load-out · Tuesday', 'Carga · martes') + '</p><div class="pcard"><h4>' + L(S, 'Materials', 'Materiales') + '</h4>' + mats.map(function (m) { return '<label class="check"><input type="checkbox" checked disabled><span><b>' + m[0] + '</b> · ' + m[1] + (m[2] ? ' <span class="faint">(' + m[2] + ')</span>' : '') + '</span></label>'; }).join('') + '</div>' +
    '<div class="pcard"><h4>' + L(S, 'Equipment', 'Equipo') + '</h4><div class="qbox">' + ic('qr') + (S.qr ? '<b>BL-07 ' + L(S, 'backpack blower checked out to Crew 2', 'sopladora asignada a la Cuadrilla 2') + '</b>' : '<button type="button" class="btn sm" data-act="qr" data-k="qr">' + L(S, 'Scan a tool tag', 'Escanear etiqueta') + '</button>') + '</div>' +
    '<label class="fld mt6">' + L(S, '60" zero-turn mower ZT-3 · hour meter', 'Cortacésped ZT-3 · horómetro') + '<span class="unit"><input class="inp" inputmode="decimal" data-in="hours" data-live data-k="hours" value="' + esc(S.hours) + '" placeholder="412.6"><span>h</span></span><span class="hint">' + L(S, 'Last 408.9 h · blade sharpening due at 425 h', 'Último 408.9 h · afilado de cuchillas a las 425 h') + '</span></label></div>';
  return devRow(crewPhone(S, body, { label: 'Crew app: load-out' }), ctxCard('Load-out from the route', ['The sheet is built from the day\'s visits: program rounds, enhancements and the install materials already on the jobs.', 'Tools carry QR tags; a missing blower at day\'s end is flagged to Luis.', 'Hour meters drive preventive maintenance ([V1]) and equipment cost per hour for job costing.']));
};
WT.actions.qr = function (el, S) { S.qr = true; };
WT.inputs.hours = function (el, S) { S.hours = el.value; };
WT.bts['c03-loadout'] = function (S) {
  var h = parseFloat(S.hours);
  return {
    what: 'The load-out sheet lists what the day\'s visits need, so nothing is forgotten and materials post to the right jobs. Tool checkout uses QR tags. The hour meter reading updates the mower\'s cost per hour and triggers maintenance when it\'s due.',
    agents: [['Inventory and equipment', 'Load-out, tool checkout, meters', 1]],
    trace: [{ c: 'loadout.build(Crew 2, Tue)', r: '4 materials from 19 visits', ms: '60 ms', det: true }, { c: 'tool.checkout(BL-07)', r: S.qr ? 'Crew 2 · due back today' : 'waiting', ms: S.qr ? '20 ms' : '', det: true, pending: !S.qr }, { c: 'meter.reading(ZT-3)', r: isNaN(h) ? 'waiting' : (h < 408.9 ? 'rejected: lower than last reading' : h + ' h · ' + (425 - h).toFixed(1) + ' h to blade service'), ms: isNaN(h) ? '' : '10 ms', det: true, pending: isNaN(h) }],
    hitl: [['Marco', 'confirms the load; Luis sees tools not returned at clock-out.']],
    tags: [['mvp', 'load-out sheets, meters, Light inventory'], ['v1', 'QR tool checkout, preventive maintenance by hours']],
    specs: 'Spec: 13 §4.15 (load-out), §4.14 (meters, PM), §4.16 (tools) · 24 §4.6 (retags)'
  };
};

/* c04 */
WT.screens['c04-route'] = function (S) {
  var stops = [['7:30', 'Hollins', L(S, 'Mow, edge, blow', 'Cortar, bordear, soplar'), 'dog'], ['7:58', 'Abel', L(S, 'Mow + hedge', 'Cortar + seto'), ''], ['8:21', 'Ferris', L(S, 'Lawn program round 4', 'Programa de césped, ronda 4'), 'chem'], ['8:50', 'Kovacs', L(S, 'Mow + mulch 2 yd³', 'Cortar + mantillo 2 yd³'), '']];
  var body = '<p class="ptitle">' + L(S, 'Today · 19 stops', 'Hoy · 19 paradas') + '</p><p class="psub">' + L(S, 'Done by about 3:20 PM · 1 h 12 m driving', 'Terminado a las 3:20 PM aprox. · 1 h 12 m manejando') + '</p>' +
    '<div class="wt-list">' + stops.map(function (s, i) { return '<div class="wt-row' + (i === 0 ? ' sel' : ' soft') + '"><span class="mono tiny">' + s[0] + '</span><span><b>' + s[1] + '</b><span class="sub">' + s[2] + '</span></span>' + (s[3] === 'dog' ? pill('warn', L(S, 'Dog', 'Perro')) : s[3] === 'chem' ? pill('info', L(S, 'Licensed', 'Licencia')) : '<span></span>') + '</div>'; }).join('') + '<div class="tiny faint" style="text-align:center">+ 15 ' + L(S, 'more', 'más') + '</div></div>' +
    '<div class="pcard"><h4>Hollins · 1214 Glenmont Ave</h4><div class="wt-callout warn">' + L(S, 'Dog in back yard (Max, friendly). Close the side gate.', 'Perro en el patio trasero (Max, amistoso). Cierra la puerta lateral.') + '</div>' +
    '<div class="flex mt6">' + (S.gate ? '<span class="gate-code">4417</span><span class="tiny faint">' + L(S, 'Visible until 8:00 · viewing is logged', 'Visible hasta las 8:00 · se registra') + '</span>' : '<button type="button" class="btn sm" data-act="gate" data-k="gate">' + ic('lock') + L(S, 'Show gate code', 'Ver código de la puerta') + '</button>') + '</div>' +
    '<div class="fld mt6">' + L(S, 'Navigate with', 'Navegar con') + '<div class="seg">' + ['Google Maps', 'Apple Maps', 'Waze'].map(function (n) { return '<button type="button" data-act="navApp" data-v="' + n + '" data-k="n' + n.replace(' ', '') + '" aria-pressed="' + (S.navApp === n) + '">' + n + '</button>'; }).join('') + '</div></div></div>' +
    '<div class="toast">' + ic('send') + L(S, '"On the way" sent to Hollins: arriving 7:25-7:55', '"En camino" enviado a Hollins: llegada 7:25-7:55') + '</div>';
  return devRow(crewPhone(S, body, { label: 'Crew app: today\'s route' }), ctxCard('What the crew sees', ['The route is cached on the device for the whole day, with the property maps and gate codes the crew is allowed to see.', 'Gate codes are encrypted and revealed only in a time window around the visit; every view is logged.', 'Departing the yard sends the first client an "on the way" text with an arrival window; later stops update as the day goes.', 'Prices and margins are never on the crew device.']));
};
WT.actions.gate = function (el, S) { S.gate = true; };
WT.actions.navApp = function (el, S) { S.navApp = el.getAttribute('data-v'); };
WT.bts['c04-route'] = function (S) {
  return {
    what: 'The day\'s route arrives on the device with everything the crew needs to work offline. Sensitive details stay protected: gate codes reveal only near visit time and leave an audit record, and price, cost and margin columns never reach the device at all.',
    agents: [['Route and messaging', 'Published route, ETA texts, secrets', 1]],
    trace: [{ c: 'route.published(Crew 2, Tue)', r: '19 stops cached with maps', ms: '—', det: true }, { c: 'secret.reveal(gate_code, Hollins)', r: S.gate ? 'shown to Marco · logged' : 'not viewed', ms: S.gate ? '30 ms' : '', det: true, pending: !S.gate }, { c: 'eta.updated(Hollins)', r: '"on the way" sent: 7:25-7:55', ms: '200 ms', det: true }],
    hitl: [['Marco', 'can reorder stops on the day; the office sees the change.']],
    tags: [['mvp', 'Today route, navigation handoff, gate codes with audit, ETA texts']],
    specs: 'Spec: 05 §4.1-4.3 · 02 (access_secret field class) · 04 §4.10.5'
  };
};

/* c05 */
WT.screens['c05-mow'] = function (S) {
  var shot = function (lbl, ok) { return '<div class="qbox" style="padding:8px">' + ic(ok ? 'check' : 'camera') + '<span>' + lbl + '</span></div>'; };
  var body = '<p class="ptitle">Hollins</p><p class="psub">' + L(S, 'Arrived 7:31 · budget 24 min', 'Llegada 7:31 · presupuesto 24 min') + '</p>' +
    '<div class="pcard"><h4>' + L(S, 'Checklist', 'Lista') + '</h4>' + [L(S, 'Mow front and back', 'Cortar frente y atrás'), L(S, 'String trim', 'Recortar orillas'), L(S, 'Edge walk and drive', 'Bordear banqueta y entrada'), L(S, 'Blow hard surfaces', 'Soplar superficies')].map(function (t) { return '<label class="check"><input type="checkbox" checked disabled><span>' + t + '</span></label>'; }).join('') + '</div>' +
    '<div class="pcard"><h4>' + L(S, 'Photos', 'Fotos') + '</h4><div class="g2">' + shot(L(S, 'Before · front', 'Antes · frente'), true) + shot(L(S, 'After · front', 'Después · frente'), true) + shot(L(S, 'Before · back bed', 'Antes · cama trasera'), true) + (S.afterBack ? shot(L(S, 'After · back bed', 'Después · cama trasera'), true) : '<button type="button" class="qbox" data-act="afterBack" data-k="afterBack" style="padding:8px;cursor:pointer;background:var(--surface)">' + ic('camera') + '<span>' + L(S, 'After · back bed', 'Después · cama trasera') + '</span></button>') + '</div></div>' +
    (S.afterBack ? '' : '<div class="ai-box"><div class="ai-h">' + ic('spark') + L(S, 'Photo check', 'Revisión de fotos') + '</div><ul><li>' + L(S, 'Missing: "after" photo of the back bed. Take it before leaving?', 'Falta: foto "después" de la cama trasera. ¿Tomarla antes de salir?') + '</li></ul></div>') +
    (S.mowDone ? '<div class="toast">' + ic('check') + L(S, 'Visit complete · 22 min on site', 'Visita completa · 22 min en sitio') + '</div>' : '<button type="button" class="btn primary bigbtn" data-act="mowDone" data-k="mowDone">' + L(S, 'Complete visit (press and hold)', 'Completar visita (mantener presionado)') + '</button>');
  return devRow(crewPhone(S, body, { sub: 'Maria López · Crew 2', label: 'Crew app: visit run sheet' }), ctxCard('Photo check is coaching, not discipline', ['Before leaving, the app checks that every required photo exists and is from this visit (time and place stamped).', 'A missing photo is a prompt to fix it now, while the crew is still on site.', 'Completeness checks are [V1]; judging workmanship from photos (did they edge the beds?) is [V2].']));
};
WT.actions.afterBack = function (el, S) { S.afterBack = true; };
WT.actions.mowDone = function (el, S) { S.mowDone = true; };
WT.ensure['c05-mow'] = function (S) { S.afterBack = true; S.mowDone = true; };
WT.bts['c05-mow'] = function (S) {
  return {
    what: 'The run sheet is the visit: checklist, required photos and completion. The Photo QA agent checks completeness before the crew leaves, so the client\'s visit summary and any later dispute have the evidence. Completing the visit stamps time on site for job costing.',
    agents: [['Photo QA (A12)', 'Photo completeness and authenticity [V1]', 0], ['Visit service', 'Completion events', 1]],
    trace: [{ c: 'photoqa.check(visit V-7710)', r: '3 of 4 required photos; missing: after, back bed', ms: '1.1 s' }, { c: 'photo.add(after, back bed)', r: S.afterBack ? 'stamped 7:52, on property' : 'waiting', ms: S.afterBack ? '—' : '', det: true, pending: !S.afterBack }, { c: 'visit.completed(V-7710)', r: S.mowDone ? '22 min on site' : 'waiting', ms: S.mowDone ? '—' : '', det: true, pending: !S.mowDone }],
    hitl: [['Maria', 'takes the missing photo or dismisses the prompt with a reason ("bed not in scope today").']],
    levels: ['A12 at L1: suggests only'],
    creditNote: 'Photo QA has no row on the published rate card yet (doc 22); shown here at 0.',
    tags: [['mvp', 'run sheet, required photos, completion'], ['v1', 'Photo QA completeness'], ['v2', 'Photo QA workmanship checks']],
    specs: 'Spec: 05 §4.4 · 17 §4.5.13 (A12)'
  };
};

/* c06 */
WT.screens['c06-apply'] = function (S) {
  var high = S.wind === 'high';
  var body = '<p class="ptitle">Ferris · ' + L(S, 'Round 4 of 5', 'Ronda 4 de 5') + '</p><p class="psub">' + L(S, 'Applicator: Javier Torres · license on file (Ohio, verify category)', 'Aplicador: Javier Torres · licencia registrada') + '</p>' +
    '<div class="wind"><div' + (high ? ' class="bad"' : '') + '><b>' + (high ? '12' : '6') + '</b>mph</div><div' + (high ? ' class="bad"' : '') + '><b>' + (high ? '15' : '9') + '</b>' + L(S, 'gust', 'ráfaga') + '</div><div><b>78°</b>°F</div><div><b>41%</b>RH</div></div>' +
    '<div class="pcard"><h4>' + L(S, 'Products', 'Productos') + '</h4><table class="data tight"><tbody><tr><td>Granular fertilizer 25-0-5<span class="sub">3.0 lb / 1,000 sq ft · 6,240 sq ft ' + L(S, 'from property map', 'del mapa') + '</span></td><td class="num">18.7 lb</td></tr><tr><td>Broadleaf spot spray<span class="sub">EPA Reg. No. 0000-000 (placeholder) · ' + L(S, 'label max wind 10 mph', 'viento máx. 10 mph') + '</span></td><td class="num">0.4 gal</td></tr></tbody></table></div>' +
    (S.sealed ? '<div class="toast">' + ic('lock') + L(S, 'Record signed and sealed 9:04 · lawn markers posted', 'Registro firmado y sellado 9:04 · letreros colocados') + '</div>' :
      (high ? '<div class="wt-callout danger"><b>' + L(S, 'Spray blocked:', 'Aspersión bloqueada:') + '</b> ' + L(S, 'wind 12 mph is above the label maximum of 10 mph. The granular fertilizer can go down now; spray later or skip.', 'el viento de 12 mph supera el máximo de 10 mph de la etiqueta. El fertilizante granular sí se puede aplicar.') + '</div><button type="button" class="btn" data-act="wind" data-k="wind">' + ic('refresh') + L(S, 'Recheck wind (40 min later)', 'Revisar viento (40 min después)') + '</button>' :
        '<div class="okline">' + ic('check') + L(S, 'Wind 6 mph · within the label for both products', 'Viento 6 mph · dentro de la etiqueta') + '</div><div class="wt-callout warn">' + L(S, 'Post lawn markers at the edge of treated turf (Ohio rule pack, verify).', 'Coloca letreros en el césped tratado (regla de Ohio, verificar).') + '</div><button type="button" class="btn primary bigbtn" data-act="seal" data-k="seal">' + ic('pen') + L(S, 'Sign application record', 'Firmar registro de aplicación') + '</button>'));
  return devRow(crewPhone(S, body, { sub: 'Javier Torres · Crew 2', label: 'Crew app: pesticide application record' }), ctxCard('The label is the law', ['Product, rate and EPA number come from Greenleaf\'s product library; the treated area comes from the measured property map.', 'Wind and temperature fill in from the nearest weather station; above the label\'s wind limit, the record cannot be submitted.', 'Once signed, the record is sealed: corrections create a new revision, and the original stays.', 'The client portal shows the application notice; state reports export from these records ([V1]).']));
};
WT.actions.wind = function (el, S) { S.wind = 'ok'; };
WT.actions.seal = function (el, S) { S.sealed = true; };
WT.ensure['c06-apply'] = function (S) { S.wind = 'ok'; S.sealed = true; };
WT.bts['c06-apply'] = function (S) {
  return {
    what: 'A lawn-program round is a regulated pesticide application. The record fills itself from the program, the product library, the property map and live weather. The wind gate is a hard block: the label maximum applies to every product. Signing seals the record so it can serve as evidence.',
    agents: [['Compliance rules', 'Label limits, rule packs, sealing', 1], ['Weather service', 'Nearest station observation', 1]],
    trace: [{ c: 'program.round(Ferris, 4 of 5)', r: 'granular 25-0-5 + broadleaf spot spray', ms: '20 ms', det: true }, { c: 'weather.observe(nearest station)', r: S.wind === 'high' ? 'wind 12 mph, gust 15' : 'wind 6 mph, gust 9', ms: '300 ms', det: true }, { c: 'gate.wind(label max 10 mph)', r: S.wind === 'high' ? 'BLOCKED for spray' : 'passed', ms: '2 ms', det: true }, { c: 'chemical_application.recorded', r: S.sealed ? 'signed by Javier, sealed' : 'waiting', ms: S.sealed ? '40 ms' : '', det: true, pending: !S.sealed }],
    hitl: [['Javier', 'is the licensed applicator and signs the record; nobody can override the label limit.']],
    tags: [['mvp', 'application records, weather auto-fill, wind gate, sealing'], ['v1', 'state report exports']],
    specs: 'Spec: 05 §4.7 · 14 §4.1 (lawn and PHC programs, rule 4.1.8) · 20 (event chemical_application.recorded)'
  };
};

/* c07 */
WT.screens['c07-offline'] = function (S) {
  var off = !S.online;
  var q = [[ic('camera', 's'), 'Photos ×6', '4.1 MB'], [ic('clock', 's'), L(S, 'Arrive and depart Abel', 'Llegada y salida Abel'), ''], [ic('check', 's'), L(S, 'Visit complete: Abel', 'Visita completa: Abel'), ''], [ic('file', 's'), L(S, 'Application record: Ferris (sealed)', 'Registro de aplicación: Ferris'), '']];
  var body = '<p class="ptitle">' + (off ? L(S, 'No signal', 'Sin señal') : L(S, 'Back online', 'Conectado de nuevo')) + '</p><p class="psub">' + (off ? L(S, 'Keep working. Everything is saved on this phone.', 'Sigue trabajando. Todo se guarda en este teléfono.') : L(S, 'Synced 6 items', '6 elementos sincronizados')) + '</p>' +
    '<div class="pcard"><h4>' + L(S, 'Waiting to sync', 'Pendiente de sincronizar') + '</h4><ul class="queue">' + q.map(function (r) { return '<li><span>' + r[0] + '</span><span>' + r[1] + '</span><span class="tiny faint">' + (off ? r[2] : ic('check', 's')) + '</span></li>'; }).join('') + '</ul></div>' +
    (off ? '<button type="button" class="btn" data-act="online" data-k="online">' + ic('refresh') + L(S, 'Drive out of the dead zone', 'Salir de la zona sin señal') + '</button>' :
      '<div class="wt-callout warn"><b>' + L(S, 'Sync issue:', 'Problema de sincronización:') + '</b> ' + L(S, 'the office canceled the Abel visit at 9:12 (client called), but you completed it at 9:20.', 'la oficina canceló la visita de Abel a las 9:12, pero la completaste a las 9:20.') + '</div>' +
      (S.resolved ? '<div class="toast">' + ic('check') + L(S, 'Kept as "completed after cancellation". Tasha decides whether to bill.', 'Guardada como "completada después de cancelar". Tasha decide si se cobra.') + '</div>' : '<div class="flex"><button type="button" class="btn sm primary" data-act="resolve" data-k="resolve">' + L(S, 'Keep my completion and tell the office', 'Mantener y avisar a la oficina') + '</button></div>'));
  return devRow(crewPhone(S, body, { offline: off, label: 'Crew app: offline and sync' }), ctxCard('Nothing is silently lost', ['Every action is written to the phone first, then sent in order when signal returns.', 'Photos, punches and sealed records are append-only, so they never conflict.', 'When the office and the crew both changed the same visit, the app shows a sync issue instead of picking a winner silently.']));
};
WT.actions.online = function (el, S) { S.online = true; };
WT.actions.resolve = function (el, S) { S.resolved = 'kept'; };
WT.ensure['c07-offline'] = function (S) { S.online = true; S.resolved = 'kept'; };
WT.bts['c07-offline'] = function (S) {
  return {
    what: 'Crews work in dead zones every day. The app keeps a local database and an outbox; when signal returns, it pushes changes in order. Append-only records merge cleanly. A real conflict (the office canceled a visit the crew then completed) becomes a visible sync issue resolved by a rule, with the office making the money decision.',
    agents: [['Sync engine', 'Local SQLite, outbox with priority lanes, conflict rules', 1]],
    trace: [{ c: 'outbox.enqueue(×6)', r: 'saved locally while offline', ms: '—', det: true }, { c: 'sync.push(batch)', r: S.online ? '6 mutations accepted' : 'waiting for signal', ms: S.online ? '1.8 s' : '', det: true, pending: !S.online }, { c: 'sync.conflict_detected(visit Abel)', r: S.online ? 'canceled 9:12 vs completed 9:20' : '', ms: S.online ? '—' : '', det: true, pending: !S.online }, { c: 'sync.resolve(rule: completion wins, flag office)', r: S.resolved ? 'kept; office task created' : 'waiting', ms: S.resolved ? '20 ms' : '', det: true, human: S.online && !S.resolved, pending: !S.online }],
    hitl: [['Marco', 'confirms what happened on site.'], ['Tasha', 'decides whether to bill the completed visit.']],
    tags: [['mvp', 'offline-first app, outbox, per-entity conflict rules, sync issues']],
    specs: 'Spec: 05 §4.21 (sync design, conflict rules) · 20 §4.11 (offline sync)'
  };
};

/* c08 */
WT.screens['c08-install'] = function (S) {
  var done = BEDS.reduce(function (t, b) { return t + (S.planted[b[0]] ? bedCount(b) : 0); }, 0);
  var body = '<p class="ptitle">' + L(S, 'Okafor backyard · planting', 'Okafor · plantación') + '</p><p class="psub">1876 Glenn Ave · Design D-1203 v4 · 70 ' + L(S, 'plants', 'plantas') + '</p>' +
    '<div class="prog-bar" aria-label="Planted"><i style="width:' + (done / 70 * 100).toFixed(0) + '%"></i></div><div class="tiny faint">' + done + ' / 70 ' + L(S, 'planted', 'plantadas') + '</div>' +
    '<div class="wt-callout warn">' + L(S, 'Bed C: hand-dig within 5 ft of the gas line. 811 ticket #A-24418 is clear to dig.', 'Cama C: excavar a mano a menos de 5 ft de la línea de gas. Ticket 811 aprobado.') + '</div>' +
    (S.sub ? '<div class="okline">' + ic('check') + L(S, 'Substitution approved by Jess: 2 Ilex glabra \'Gem Box\' for 2 Itea \'Little Henry\'', 'Sustitución aprobada por Jess: 2 Ilex \'Gem Box\' por 2 Itea') + '</div>' : '<div class="wt-callout"><b>' + L(S, 'Nursery shorted 2 Itea \'Little Henry\'.', 'El vivero envió 2 Itea de menos.') + '</b> <button type="button" class="btn xs" data-act="sub" data-k="sub">' + L(S, 'Request substitution', 'Pedir sustitución') + '</button></div>') +
    '<div class="wt-stack">' + BEDS.map(function (b) { var on = S.planted[b[0]]; return '<div class="bedrow"><b class="k">' + L(S, 'Bed', 'Cama') + ' ' + b[0] + '</b><span class="tiny">' + b[1].map(function (x) { return x[1] + ' ' + x[0]; }).join(', ') + '</span>' + (on ? pill('ok', bedCount(b) + ' ✓') : '<button type="button" class="btn xs" data-act="plant" data-v="' + b[0] + '" data-k="plant' + b[0] + '">' + L(S, 'Mark planted', 'Marcar') + '</button>') + '</div>'; }).join('') + '</div>' +
    '<div class="pcard soft tiny">' + L(S, 'As-built: redbud moved 2 ft east to clear the downspout.', 'Plano final: el redbud se movió 2 ft al este por el bajante.') + '</div>';
  return devRow(crewPhone(S, body, { sub: 'Andrés Vega · Crew 1', label: 'Crew app: install planting sheet' }), ctxCard('From design to plants in the ground', ['The planting sheet is the sold Design Version: beds, plant keys and counts, at install size.', 'A shortage becomes a substitution request; Jess approves a swap from the same Region palette.', 'Each planted item becomes a tracked plant with a one-year warranty (drip on), linked to the plan.', 'As-built changes update the plan, so the maintenance crew and the client portal see what is really in the ground.']));
};
WT.actions.sub = function (el, S) { S.sub = true; };
WT.actions.plant = function (el, S) { S.planted[el.getAttribute('data-v')] = true; };
WT.ensure['c08-install'] = function (S) { S.sub = true; S.planted = { A: true, B: true, C: true, D: true }; };
WT.bts['c08-install'] = function (S) {
  var done = BEDS.reduce(function (t, b) { return t + (S.planted[b[0]] ? bedCount(b) : 0); }, 0);
  return {
    what: 'The design from the AI design walkthrough becomes a crew task list. Shortages turn into substitution requests the designer approves. Marking plants installed creates plant records that carry warranties and feed the care guide in the client portal. As-built changes keep the plan true.',
    agents: [['Design and install', 'Construction set, plant records, warranties', 1]],
    trace: [{ c: 'design.construction_set(D-1203 v4)', r: '70 plants in 4 beds', ms: '—', det: true }, { c: 'substitution.request(Itea LH ×2)', r: S.sub ? 'approved: Ilex GB ×2 (Central Ohio palette)' : 'not requested', ms: S.sub ? 'human' : '', human: false, pending: !S.sub }, { c: 'plant.installed(×' + done + ')', r: done + ' plant records, warranties start', ms: done ? '90 ms' : '', det: true, pending: !done }, { c: 'design.as_built(redbud +2 ft E)', r: 'plan updated', ms: '30 ms', det: true }],
    hitl: [['Jess', 'approves substitutions; Andrés marks plants and as-built changes.']],
    tags: [['mvp', 'planting sheet from the sold design, plant records and warranties'], ['v1', 'as-built reconciliation in the Studio']],
    specs: 'Spec: 10 (construction set, as-built, plant_instance) · 05 §4.6 · 13 §4.17 (plant warranties) · 14 §4.5'
  };
};

/* c09 */
WT.screens['c09-issues'] = function (S) {
  var body = '<p class="ptitle">' + L(S, 'Notes and safety', 'Notas y seguridad') + '</p>' +
    '<div class="pcard soft"><div class="flex">' + ic('mic') + '<b>' + L(S, 'Voice note · 0:42', 'Nota de voz · 0:42') + '</b>' + pill('', 'Español') + '</div><p class="tiny mt6" style="font-style:italic">"En la casa Kovacs el árbol del frente tiene ramas muertas encima de la entrada; alguien podría salir lastimado. También el cliente preguntó por un precio para limpiar las canaletas."</p>' +
    (S.voice ? '<div class="ai-box mt6"><div class="ai-h">' + ic('spark') + 'English summary</div><ul><li>Kovacs: dead branches over the driveway on the front tree; safety risk.</li><li>Client asked for a gutter-cleaning price.</li><li>Suggested: tree work estimate request; gutter cleaning quote.</li></ul></div>' : '<button type="button" class="btn sm ai mt6" data-act="voice" data-k="voice">' + ic('send') + L(S, 'Send to the office', 'Enviar a la oficina') + '</button>') + '</div>' +
    '<div class="pcard"><h4>' + ic('sun') + ' ' + L(S, 'Heat check · 1:00 PM', 'Revisión de calor · 1:00 PM') + '</h4><p class="tiny">' + L(S, 'Heat index 94°F. Water and a 10-minute shade break for everyone now.', 'Índice de calor 94°F. Agua y 10 minutos de sombra para todos ahora.') + '</p><div class="okline">' + ic('check') + L(S, 'Break logged for 3 people', 'Descanso registrado para 3 personas') + '</div></div>' +
    '<div class="pcard"><h4>' + ic('warn') + ' ' + L(S, 'Incident', 'Incidente') + '</h4>' + (S.incident ? '<div class="okline">' + ic('check') + L(S, 'Reported: small cut from trimmer line, first aid on site, no lost time. Luis notified.', 'Reportado: corte pequeño, primeros auxilios, sin tiempo perdido. Luis notificado.') + '</div>' : '<button type="button" class="btn sm" data-act="incident" data-k="incident">' + L(S, 'Report a minor injury', 'Reportar una lesión menor') + '</button>') + '</div>';
  return devRow(crewPhone(S, body, { sub: 'Javier Torres · Crew 2', label: 'Crew app: voice note and safety' }), ctxCard('Field notes in any language', ['Javier talks in Spanish; the office reads an English summary, and the original stays attached.', 'The Field-Note agent turns notes into issues and opportunities: here a tree-safety estimate and a gutter quote.', 'Heat checks follow the day\'s heat index; incidents are logged once and feed the OSHA log.']));
};
WT.actions.voice = function (el, S) { S.voice = true; };
WT.actions.incident = function (el, S) { S.incident = true; };
WT.ensure['c09-issues'] = function (S) { S.voice = true; S.incident = true; };
WT.bts['c09-issues'] = function (S) {
  return {
    what: 'Voice notes are the fastest way for crews to report what they see. The Field-Note agent transcribes Spanish, writes an English summary and extracts issues and sales opportunities for the office to approve. Safety records (heat breaks, incidents) are captured where they happen.',
    agents: [['Field-Note agent (A4)', 'ES to EN, issues and opportunities', 0], ['Safety rules', 'Heat procedures, incident reports', 1]],
    trace: [{ c: 'voice.transcribe(es, 0:42)', r: S.voice ? 'transcript, confidence 0.95' : 'waiting', ms: S.voice ? '3.0 s' : '', pending: !S.voice }, { c: 'agent.A4.extract', r: S.voice ? '1 safety issue, 1 opportunity → office approvals' : '', ms: S.voice ? '2.2 s' : '', pending: !S.voice }, { c: 'safety.heat_break(×3)', r: 'logged 1:00 PM', ms: '15 ms', det: true }, { c: 'safety.incident(minor, first aid)', r: S.incident ? 'OSHA log candidate; Luis notified' : 'none', ms: S.incident ? '30 ms' : '', det: true, pending: !S.incident }],
    hitl: [['Tasha and Luis', 'approve anything sent to the client and review the incident.']],
    levels: ['A4 at L2'],
    creditNote: 'Voice note: 1 credit a minute.',
    tags: [['mvp', 'voice notes ES/EN, heat checks, incident reports']],
    specs: 'Spec: 05 §4.11, §4.12 · 17 §4.5.5 (A4) · 15 (OSHA logs, heat illness) · 22 §4.4.1'
  };
};

/* c10 */
WT.screens['c10-pay'] = function (S) {
  var tap = S.payMode === 'tap';
  var body = '<p class="ptitle">' + L(S, 'Collect payment', 'Cobrar') + '</p><p class="psub">Hollins · ' + L(S, 'one-off hedge trimming', 'recorte de setos') + '</p>' +
    '<div class="pcard"><table class="data tight"><tbody><tr><td>' + L(S, 'Hedge trimming, 60 lf', 'Recorte de setos, 60 lf') + '</td><td class="num">$185.00</td></tr><tr><td>' + L(S, 'Sales tax 8.0% (verify)', 'Impuesto 8.0%') + '</td><td class="num">$14.80</td></tr><tr><td><b>Total</b></td><td class="num"><b>$199.80</b></td></tr></tbody></table></div>' +
    '<div class="seg" role="group"><button type="button" data-act="payMode" data-v="tap" data-k="ptap" aria-pressed="' + tap + '">Tap to Pay</button><button type="button" data-act="payMode" data-v="check" data-k="pcheck" aria-pressed="' + (!tap) + '">' + L(S, 'Check', 'Cheque') + '</button></div>' +
    (tap ? (S.paid ? '<div class="toast">' + ic('check') + L(S, 'Paid $199.80 · Visa contactless · receipt texted', 'Pagado $199.80 · Visa sin contacto') + '</div>' : '<div class="qbox" style="padding:20px">' + ic('card') + '<b>' + L(S, 'Hold the card near the top of the phone', 'Acerca la tarjeta a la parte superior del teléfono') + '</b><button type="button" class="btn sm primary" data-act="paid" data-k="paid">' + L(S, 'Simulate tap', 'Simular pago') + '</button></div>') :
      (S.paid ? '<div class="toast">' + ic('check') + L(S, 'Check #1042 photographed · in Marco\'s custody until handed to the office', 'Cheque #1042 fotografiado · bajo custodia de Marco') + '</div>' : '<div class="qbox" style="padding:16px">' + ic('camera') + '<b>' + L(S, 'Photograph front and back', 'Foto del frente y reverso') + '</b><button type="button" class="btn sm primary" data-act="paid" data-k="paid">' + L(S, 'Simulate photos', 'Simular fotos') + '</button></div>')) +
    '<div class="wt-note">' + L(S, 'Payments go to Greenleaf Grounds Co.\'s own Stripe account. Crews never see Greenleaf\'s price book.', 'Los pagos van a la cuenta de Stripe de Greenleaf.') + '</div>';
  return devRow(crewPhone(S, body, { label: 'Crew app: field payment' }), ctxCard('Money in the field', ['Tap to Pay on iPhone takes contactless cards on the crew lead\'s phone ([V1]); the charge is made on Greenleaf\'s own Stripe account and the invoice is marked paid only when Stripe confirms.', 'Checks and cash follow a custody chain at [MVP]: photo on site, in the crew lead\'s custody (1065 Cash in Transit), handed to the office, deposited.', 'Collecting payment is a separate permission from seeing prices.']));
};
WT.actions.payMode = function (el, S) { S.payMode = el.getAttribute('data-v'); S.paid = false; };
WT.actions.paid = function (el, S) { S.paid = true; };
WT.bts['c10-pay'] = function (S) {
  var tap = S.payMode === 'tap';
  return {
    what: tap ? 'Tap to Pay turns the crew lead\'s iPhone into a card reader. The charge is created on Greenleaf\'s connected Stripe account; Rootline marks the invoice paid only when Stripe\'s webhook confirms it, and the ledger posts the payment.' : 'A paper check is photographed on site and tracked through a custody chain until the office deposits it, so the money is never untracked between the lawn and the bank.',
    agents: [['Payments', tap ? 'Stripe Terminal (Tap to Pay), direct charge' : 'Check capture and custody', 1]],
    trace: tap ? [{ c: 'terminal.collect(Tap to Pay, $199.80)', r: S.paid ? 'approved' : 'waiting for card', ms: S.paid ? '2.4 s' : '', det: true, pending: !S.paid }, { c: 'payments.payment.succeeded (webhook)', r: S.paid ? 'invoice INV-3133 paid' : '', ms: S.paid ? '1.1 s' : '', det: true, pending: !S.paid }, { c: 'ledger.post', r: S.paid ? 'Dr 1050 Stripe Clearing / Cr 1200 AR' : '', ms: S.paid ? '12 ms' : '', det: true, pending: !S.paid }] :
      [{ c: 'payments.field_receipt(check #1042)', r: S.paid ? 'photos stored; custody: Marco' : 'waiting', ms: S.paid ? '300 ms' : '', det: true, pending: !S.paid }, { c: 'ledger.post', r: S.paid ? 'Dr 1065 Cash in Transit / Cr 1200 AR' : '', ms: S.paid ? '12 ms' : '', det: true, pending: !S.paid }, { c: 'payments.handover → bank_deposit', r: 'later: 1065 → 1060 → 1010', ms: '', det: true, pending: true }],
    hitl: [['Marco', 'collects within his limit; Tasha confirms the handover and deposit.']],
    tags: [['v1', 'Tap to Pay on iPhone (Android and Canada later)'], ['mvp', 'check and cash custody chain']],
    specs: 'Spec: 05 §4.9 · 08 (Terminal, webhooks, cash and checks) · 09 (field receipt postings) · 24 §4.6 #3'
  };
};

/* c11 */
WT.screens['c11-closeout'] = function (S) {
  var segs = [['Marco', '6:58', '3:41', '0:40', '1:12', '6:21'], ['Maria', '6:58', '3:41', '0:40', '1:12', '6:21'], ['Javier', '6:58', '3:41', '0:40', '1:12', '6:21']];
  var body = '<p class="ptitle">' + L(S, 'End of day', 'Fin del día') + '</p>' +
    '<div class="pcard"><h4>' + L(S, 'Report', 'Reporte') + '</h4>' + (S.report ? '<div class="ai-box"><div class="ai-h">' + ic('spark') + L(S, 'Drafted for Marco', 'Borrador para Marco') + '</div><ul><li>18 of 19 visits done; Abel completed after cancellation (office deciding).</li><li>Ferris round 4 applied after a 40-min wind delay; record sealed.</li><li>Kovacs: dead branches over the driveway; tree estimate requested.</li><li>Trailer TR-4 out of service; TR-6 used. BL-07 returned.</li></ul></div>' : '<button type="button" class="btn sm ai" data-act="report" data-k="report">' + ic('spark') + L(S, 'Draft my report', 'Redactar mi reporte') + '</button>') + '</div>' +
    '<div class="pcard"><h4>' + L(S, 'Time today', 'Tiempo de hoy') + '</h4><table class="data tight"><thead><tr><th></th><th class="num">' + L(S, 'Job', 'Trabajo') + '</th><th class="num">Shop</th><th class="num">' + L(S, 'Drive', 'Manejo') + '</th></tr></thead><tbody>' + segs.map(function (r) { return '<tr><td>' + r[0] + '</td><td class="num">' + r[5] + '</td><td class="num">' + r[3] + '</td><td class="num">' + r[4] + '</td></tr>'; }).join('') + '</tbody></table><div class="wt-note">' + L(S, '30-minute unpaid lunch for each person; total 8 h 13 m paid.', 'Almuerzo de 30 minutos sin pago; 8 h 13 m pagadas.') + '</div>' +
    (S.approved ? '<div class="okline">' + ic('check') + L(S, 'Approved by Marco', 'Aprobado por Marco') + '</div>' : '<button type="button" class="btn sm" data-act="approve" data-k="approve">' + L(S, 'Approve crew time', 'Aprobar el tiempo de la cuadrilla') + '</button>') + '</div>' +
    (S.out ? '<div class="toast">' + ic('check') + L(S, 'Clocked out 3:41 PM · location tracking off', 'Salida 3:41 PM · ubicación desactivada') + '</div>' : '<label class="check"><input type="checkbox" checked disabled><span>' + L(S, 'I was not injured today, or I reported it.', 'No me lastimé hoy, o lo reporté.') + '</span></label><button type="button" class="btn primary bigbtn" data-act="out" data-k="out"' + (S.approved ? '' : ' disabled') + '>' + L(S, 'Clock out crew', 'Registrar salida') + '</button>');
  return devRow(crewPhone(S, body, { label: 'Crew app: close-out' }), ctxCard('Close the day in two minutes', ['The end-of-day report is drafted from the day\'s events ([V1]); Marco edits and sends it.', 'Time is split into job, shop and drive segments, so job costing and payroll both come out right.', 'Each person signs a short attestation at clock-out; meal and rest rules follow the state rule packs (the Great Lakes states at MVP, California at V1).', 'Location tracking stops at clock-out.']));
};
WT.actions.report = function (el, S) { S.report = true; };
WT.actions.approve = function (el, S) { S.approved = true; };
WT.actions.out = function (el, S) { S.out = true; };
WT.ensure['c11-closeout'] = function (S) { S.report = true; S.approved = true; S.out = true; };
WT.bts['c11-closeout'] = function (S) {
  return {
    what: 'Close-out turns the day\'s events into three things: a report for the office (drafted by AI from what happened), approved time segments for payroll and job costing, and signed clock-outs. Tracking stops the moment the crew clocks out.',
    agents: [['Copilot drafting', 'End-of-day report from the day\'s events [V1]', 0], ['Time service', 'Segments, approvals, attestations', 1]],
    trace: [{ c: 'copilot.draft(end_of_day, Crew 2)', r: S.report ? '4 bullets from 41 events' : 'not requested', ms: S.report ? '2.6 s' : '', pending: !S.report }, { c: 'timesheet.approved(×3)', r: S.approved ? 'job 6:21 · shop 0:40 · drive 1:12 each' : 'waiting', ms: S.approved ? '30 ms' : '', det: true, pending: !S.approved }, { c: 'time.punched(×3, out, 3:41)', r: S.out ? 'attestations signed; tracking off' : 'waiting', ms: S.out ? '25 ms' : '', det: true, pending: !S.out }],
    hitl: [['Marco', 'approves his crew\'s time; Tasha exports payroll weekly.']],
    creditNote: 'The drafted report costs 1 credit (Copilot drafting).',
    tags: [['mvp', 'time segments, crew-lead approval, attestations'], ['v1', 'AI-drafted end-of-day report']],
    specs: 'Spec: 05 §4.5, §4.19 (crew lead extras), §4.23 · 15 (timesheets, rule packs) · 17 (Copilot)'
  };
};

/* c12 */
WT.screens['c12-snow'] = function (S) {
  var map = '<svg class="wt-svg" viewBox="0 0 300 150" role="img" aria-label="Snow site map of the Maple Ridge clubhouse lot with priority areas"><rect class="snowsite" width="300" height="150"/><rect class="snowlot" x="20" y="20" width="200" height="110" rx="4"/><rect x="230" y="30" width="56" height="40" fill="var(--stone-450)"/><text x="236" y="54" class="map-label" fill="var(--stone-0)">Clubhouse</text><rect class="snowpri" x="20" y="20" width="200" height="16" opacity=".55"/><text x="26" y="31" class="map-label">Priority 1: fire lane and entrance</text><rect x="222" y="74" width="66" height="10" fill="var(--accent)" opacity=".55"/><text x="226" y="96" class="map-label">P1 walks: salt</text><text x="70" y="90" class="map-label">Lot: push to north pile</text></svg>';
  var body = '<p class="ptitle">' + L(S, 'Storm visit', 'Visita de tormenta') + ' · Maple Ridge HOA</p><p class="psub">' + L(S, 'Clubhouse lot · trigger 2 in · 2:10 AM', 'Estacionamiento · disparador 2 in · 2:10 AM') + '</p>' + map +
    '<div class="pcard"><dl class="kv"><dt>' + L(S, 'Snow on arrival', 'Nieve al llegar') + '</dt><dd>3.5 in</dd><dt>' + L(S, 'Service', 'Servicio') + '</dt><dd>' + L(S, 'Plow lot, shovel and salt walks', 'Arar, palear y salar banquetas') + '</dd><dt>Salt</dt><dd>400 lb ' + L(S, 'treated rock salt', 'sal tratada') + '</dd></dl></div>' +
    '<div class="g2"><div class="qbox">' + ic('camera') + '<span>' + L(S, 'Before 2:14 AM · GPS', 'Antes 2:14 AM · GPS') + '</span></div><div class="qbox">' + ic(S.push ? 'check' : 'camera') + '<span>' + (S.push ? L(S, 'After 3:02 AM · GPS', 'Después 3:02 AM · GPS') : L(S, 'After', 'Después')) + '</span></div></div>' +
    (S.push ? '<div class="toast">' + ic('check') + L(S, 'Push logged: 2:14-3:02 AM, 400 lb salt', 'Servicio registrado: 2:14-3:02 AM, 400 lb de sal') + '</div>' + (S.pdf ? '<div class="okline">' + ic('file') + L(S, 'Proof-of-service PDF ready for the property manager', 'PDF de prueba de servicio listo') + '</div>' : '<button type="button" class="btn sm" data-act="pdf" data-k="pdf">' + ic('file') + L(S, 'Create proof PDF for this site', 'Crear PDF de prueba') + '</button>') : '<button type="button" class="btn primary bigbtn" data-act="push" data-k="push">' + L(S, 'Log push complete', 'Registrar servicio completo') + '</button>');
  return devRow(crewPhone(S, body, { time: '3:02', label: 'Crew app: Snow Lite storm visit' }), ctxCard('Snow Lite, in every plan', ['Great Lakes crews plow all winter, so the MVP includes Snow Lite: a storm visit log per site with timestamped GPS photos and notes, a basic site list with priorities, per-push or per-application invoices from those logs, and a per-site proof PDF.', 'The full Snow & Ice module ([V1]) adds storm events from weather feeds, priorities and routes, salt inventory, seasonal caps and floors, subcontractor plowers and sealed proof packets for slip-and-fall defense.']));
};
WT.actions.push = function (el, S) { S.push = true; };
WT.actions.pdf = function (el, S) { S.pdf = true; };
WT.ensure['c12-snow'] = function (S) { S.push = true; S.pdf = true; };
WT.bts['c12-snow'] = function (S) {
  return {
    what: 'On a storm night the crew logs each site\'s service with timestamped, GPS-stamped photos and the salt used. Those logs produce the per-push and per-application invoice lines and a per-site proof PDF the property manager can keep. It reuses the same visit and photo pipeline as summer work.',
    agents: [['Snow Lite', 'Storm visits on the standard visit pipeline', 1]],
    trace: [{ c: 'visit.started(storm, Maple Ridge clubhouse)', r: '2:14 AM · GPS on site', ms: '—', det: true }, { c: 'visit.completed(storm)', r: S.push ? 'plow + salt 400 lb · 48 min' : 'waiting', ms: S.push ? '—' : '', det: true, pending: !S.push }, { c: 'billable_item.create(per push, per application)', r: S.push ? '2 lines for the monthly invoice' : '', ms: S.push ? '20 ms' : '', det: true, pending: !S.push }, { c: 'proof.pdf(site, storm)', r: S.pdf ? 'photos, times, notes' : 'not created', ms: S.pdf ? '700 ms' : '', det: true, pending: !S.pdf }],
    hitl: [['Marco', 'logs the push; Tasha reviews the storm\'s billing before it goes out.']],
    tags: [['mvp', 'Snow Lite: storm visit logs, site list, per-push billing, proof PDF'], ['v1', 'full Snow & Ice module']],
    specs: 'Spec: 14 §4.3.0 (Snow Lite), §4.3 (full module) · 07 §4.2.10 · 24 OD-05'
  };
};

/* c13 */
WT.screens['c13-recap'] = function (S) {
  var rows = [['Crew punch and time segments', 'Payroll export, job costing', 'Rules'], ['Pre-trip inspection', 'Out-of-service block, shop work order', 'Rules'], ['Load-out, tool checkout, hour meters', 'Job materials, equipment cost per hour, maintenance', 'Rules'], ['Visit photos and completion', 'Client visit summary, invoice lines', 'Rules + Photo QA [V1]'], ['Sealed application record', 'Client notice, compliance archive, state reports [V1]', 'Rules'], ['Offline queue and sync issue', 'Office decision on billing', 'Rules'], ['Planted items and as-built', 'Plant warranties, care guide, the property\'s plan', 'Rules'], ['Voice note', 'Office approvals: tree estimate, gutter quote', 'AI (1 credit)'], ['Field payment', 'Invoice paid, ledger posting', 'Rules'], ['End-of-day report', 'Office summary', 'AI (1 credit)'], ['Storm visit', 'Per-push invoice lines, proof PDF', 'Rules']];
  return '<div class="wt-cols wide-left"><div class="panel"><h4>What the app captured, and where it went</h4><div class="table-scroll"><table class="data tight"><thead><tr><th>Captured in the field</th><th>Flows to</th><th>Kind</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + (/AI/.test(r[2]) ? pill('ai', r[2]) : pill('', r[2])) + '</td></tr>'; }).join('') + '</tbody></table></div><p class="wt-note mt6">2 AI credits for the whole day. Almost everything in the field is deterministic: rules, checks and sync.</p></div>' +
    '<div class="wt-stack"><div class="panel"><h4>Scope</h4><div style="display:grid;gap:5px"><div class="tagrow">' + tag('mvp') + '<span class="note">offline EN/ES app, crew punch, DVIR, tailgate talks, load-out, route, gate codes, run sheet, application records and wind gate, sync issues, planting sheet, voice notes, check custody, close-out, Snow Lite</span></div><div class="tagrow">' + tag('v1') + '<span class="note">Photo QA, QR tool checkout, preventive maintenance, Tap to Pay, AI end-of-day report, full snow module, California rules</span></div><div class="tagrow">' + tag('v2') + '<span class="note">workmanship checks from photos</span></div></div></div>' +
    '<div class="flex"><a class="btn" href="#overview">' + ic('arrow-l') + 'Back to start</a><a class="btn" href="wt-recurring.html">Small and recurring jobs</a><a class="btn primary" href="walkthroughs.html">All walkthroughs ' + ic('arrow-r') + '</a></div></div></div>';
};
WT.bts['c13-recap'] = function (S) {
  return {
    what: 'The crew app is where Rootline\'s records are born: time, safety, materials, photos, compliance, plants, payments and snow. AI helps with language and summaries; everything that carries legal or money weight is deterministic and signed.',
    hitl: [['People', 'signed every record, approved every substitution, time sheet and client message.']],
    creditNote: '2 credits across the whole day.',
    tags: [['mvp', 'most of the day'], ['v1', 'Photo QA, Tap to Pay, AI report, full snow module']],
    specs: 'Spec: 05, 10, 13, 14, 15, 17, 20, 24'
  };
};
