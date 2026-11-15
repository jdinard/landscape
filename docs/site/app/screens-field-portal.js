/* screens-field-portal: crew app, manager mode, shop kiosk, subcontractor lite and the customer portal.
   Crew strings go through c.tr(en, es) (Spanish-first). Crew roles never see price, cost or margin (02 §10.2). */
(() => {
'use strict';
const RL = window.RL, h = RL.h, { esc, icon, money } = h;

// ---------- small utilities ----------
const hs = s => { let x = 7; for (const ch of String(s)) x = (x * 31 + ch.charCodeAt(0)) >>> 0; return x; };
const strip = n => String(n == null ? '' : n).replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
const first = n => strip(n).split(' ')[0] || '';
const f1 = n => (Math.round(n * 10) / 10).toFixed(1);
const rnd = (n, s) => Math.round(n / s) * s;
const U = (k, d) => (RL.ui[k] != null && RL.ui[k] !== '' ? RL.ui[k] : d);
const isOn = (k, d) => h.on(k, d);
const toMin = s => { const p = String(s).split(':').map(Number); return p[0] * 60 + (p[1] || 0); };
const t12 = m => { let hh = Math.floor(m / 60) % 24; const mm = m % 60; const ap = hh >= 12 ? 'pm' : 'am'; hh = hh % 12 || 12; return `${hh}:${String(mm).padStart(2, '0')} ${ap}`; };
const dur = m => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
const abbr = name => String(name).split(/\s+/).filter(w => /^[A-Z]/.test(w)).map(w => w[0]).join('').slice(0, 4) || 'PO';
const bb = (label, o) => { o = o || {}; return `<button type="button" class="big-btn${o.ghost ? ' ghost' : ''}"${h.attr({ 'data-act': o.act, 'data-go': o.go, 'data-x': o.x, 'data-ui': o.ui, 'data-val': o.val, 'data-modal': o.modal, disabled: o.disabled, style: (o.style || '') + (o.disabled ? ';opacity:.5;cursor:not-allowed' : '') || null })}>${o.icon ? icon(o.icon) : ''}${label}</button>`; };
const sticky = inner => `<div style="position:sticky;bottom:-12px;padding:10px 0 2px;background:linear-gradient(to bottom, transparent, var(--canvas) 26%);display:grid;gap:6px">${inner}</div>`;
const badge = (n, tone) => { const m = { done: ['var(--stone-450)', '#fff'], cur: ['var(--primary)', 'var(--on-primary)'], route: ['var(--sky-500)', '#fff'], sch: ['var(--surface-3)', 'var(--text)'], skip: ['var(--danger-solid)', '#fff'] }[tone] || ['var(--surface-3)', 'var(--text)']; return `<span style="flex:none;width:30px;height:30px;border-radius:50%;display:inline-grid;place-items:center;font-weight:800;font-size:.85rem;background:${m[0]};color:${m[1]}">${n}</span>`; };
const sig = () => `<svg viewBox="0 0 220 50" style="width:100%;height:46px;display:block" aria-label="Signature"><path d="M8 34 C 24 6, 38 46, 54 24 S 84 8, 96 30 S 128 42, 146 16 S 176 30, 186 26 L 212 22" fill="none" stroke="var(--text)" stroke-width="2.2" stroke-linecap="round"/></svg>`;
const side = (title, body, tone) => h.card({ title, body, tone });
const pban = (text, tone) => `<div class="mx-banner ${tone || 'info'}" style="border-radius:10px;border:0">${text}</div>`;
// Grid children with overflow (tabs, table wraps) collapse to 0 height inside .ph-body; a plain wrapper keeps them visible.
const wrap = x => `<div style="min-width:0">${x}</div>`;
const meta = (k, v) => `<div class="flex between tiny"><span class="t3">${k}</span><span class="num">${v}</span></div>`;

// ---------- Spanish for services, statuses, weather ----------
const SVC_ES = {
  'Weekly mowing': 'Corte semanal', 'Biweekly mowing': 'Corte quincenal', 'Spring cleanup': 'Limpieza de primavera', 'Fall cleanup': 'Limpieza de otoño', 'Mulch install': 'Instalación de mantillo', 'Shrub pruning': 'Poda de arbustos', 'Bed edging': 'Orillado de camas',
  'Round 2 fertilizer + crabgrass': 'Ronda 2: fertilizante + pasto cangrejo', 'Round 3 broadleaf weed': 'Ronda 3: maleza de hoja ancha', 'Grub preventive': 'Preventivo de gusano blanco', 'Core aeration': 'Aireación', 'Overseeding': 'Resiembra',
  'Irrigation start-up': 'Arranque de riego', 'Irrigation repair': 'Reparación de riego', 'Backflow test': 'Prueba de contraflujo', 'Controller upgrade': 'Cambio de controlador', 'Winterization': 'Invernización',
  'Lighting upgrade': 'Mejora de iluminación', 'Transformer replacement': 'Cambio de transformador', 'Holiday lighting': 'Luces navideñas', 'Paver patio': 'Patio de adoquines', 'Retaining wall': 'Muro de contención', 'Flagstone path': 'Camino de laja',
  'Foundation planting': 'Plantas de base', 'Backyard renovation': 'Renovación del patio', 'Front walk + beds': 'Camino y camas del frente', 'Fire pit and seat wall': 'Fogata y muro banco', 'Backyard patio and planting design': 'Patio trasero y diseño de plantas',
  'Backyard patio, fire pit and foundation beds': 'Patio, fogata y camas de base', 'Backyard refresh: beds and paver patio': 'Renovación: camas y patio de adoquines', 'Commercial maintenance': 'Mantenimiento comercial', 'Enhancement: entrance beds': 'Mejora: camas de entrada',
  'Parking lot sweep': 'Barrido del estacionamiento', 'Tree replacement': 'Reemplazo de árboles', 'Snow push': 'Despeje de nieve', 'Salt application': 'Aplicación de sal', 'Front garden redesign': 'Rediseño del jardín delantero',
};
const svc = (c, s) => esc(c.tr(s, SVC_ES[s] || s));
const ST = { Done: ['Done', 'Hecha', 'ok', 'done'], 'In progress': ['In progress', 'En curso', 'info', 'cur'], 'En route': ['En route', 'En camino', 'warn', 'route'], Scheduled: ['Scheduled', 'Programada', '', 'sch'], Skipped: ['Skipped', 'Omitida', 'danger', 'skip'] };
const stPill = (c, s) => { const m = ST[s] || [s, s, '', 'sch']; return h.pill(c.tr(m[0], m[1]), m[2]); };
const stTone = s => (ST[s] || [])[3] || 'sch';
const DIR_ES = { NW: 'NO', SW: 'SO', N: 'N', W: 'O' };
const wx = c => c.winter ? { t: 25, sky: ['Light snow', 'Nieve ligera'], wind: 9, dir: 'NW', gust: 14, rh: 82, rain: ['Snow ends about 7 am', 'La nieve para cerca de las 7 am'] } : { t: 62, sky: ['Clear', 'Despejado'], wind: 6, dir: 'NW', gust: 9, rh: 54, rain: ['Rain 60% after 3 pm', 'Lluvia 60% después de las 3 pm'] };
const dirTr = (c, d) => c.tr(d, DIR_ES[d] || d);

// ---------- crew context ----------
function crewCtx(c) {
  const D = c.D, cast = c.t.cast || {}, crew = D.crews[0] || null, lead = c.role === 'crew_lead';
  const roster = crew ? [crew.lead].concat(crew.members) : [];
  if (crew && cast.technician && !roster.includes(cast.technician)) roster.push(cast.technician);
  const me = lead ? (crew ? crew.lead : strip(c.who)) : (cast.technician || (crew && (crew.members[0] || crew.lead)) || strip(c.who));
  if (crew && !roster.includes(me)) roster.push(me);
  const stops = crew ? D.visits.filter(v => v.crewId === crew.id).map(v => Object.assign({}, v, { status: RL.ui['vskip.' + v.id] ? 'Skipped' : RL.ui['vdone.' + v.id] ? 'Done' : v.status })) : [];
  const ord = RL.ui['crew.order'];
  if (ord) { const ids = String(ord).split(','); stops.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id)); }
  stops.forEach((v, i) => { v.seq = i + 1; });
  const person = n => D.people.find(p => p.name === n) || { name: n, cert: null };
  return { D, crew, lead, me, roster, stops, person, cast, ops: strip(cast.ops_manager || cast.office_manager || c.owner), office: strip(cast.office_manager || c.owner) };
}
const curStop = K => K.stops.find(v => v.status === 'In progress') || K.stops.find(v => v.status === 'En route') || K.stops.find(v => v.status === 'Scheduled') || K.stops[0];
const nextStop = (K, cur) => K.stops.find(v => v !== cur && (v.status === 'En route' || v.status === 'Scheduled'));
const inWindow = v => v && (v.status === 'In progress' || v.status === 'En route');
const kindOf = s => /Round|Grub|aeration|Overseed/i.test(s) ? 'lawn' : /Irrigation|Backflow|Controller|Winter/i.test(s) ? 'irr' : /mow|cleanup|prun|edging|Mulch|sweep|maintenance/i.test(s) ? 'mow' : 'inst';
const noCrew = c => h.card({ title: c.tr('No crew assigned today', 'Sin cuadrilla asignada hoy'), body: `<p class="small t2">${c.tr('This Company has no field crews set up, so there is no route to show. Ask the office to add you to a crew.', 'Esta empresa no tiene cuadrillas. Pide a la oficina que te agregue a una cuadrilla.')}</p>` });

// Storm route for winter (Snow Lite): priority order, commercial sites first.
function stormSites(c, K) {
  const D = c.D, seen = new Set(), base = [];
  (K.stops.length ? K.stops : D.visits).forEach(v => { if (!seen.has(v.clientId)) { seen.add(v.clientId); base.push(v); } });
  if (!base.length) D.clients.slice(0, 6).forEach((cl, i) => base.push({ clientId: cl.id, client: cl.name, address: cl.address, x: 40 + i * 52, y: 50 + (i * 37) % 140 }));
  const typ = id => (D.clients.find(x => x.id === id) || {}).type || 'residential';
  const list = base.map(v => ({ v, com: typ(v.clientId) !== 'residential' })).sort((a, b) => (b.com ? 1 : 0) - (a.com ? 1 : 0)).slice(0, 8);
  return list.map((o, i) => {
    const v = o.v, id = 'SV-' + (7101 + i);
    const st = RL.ui['snow.out.' + id] ? 'Done' : i < 3 ? 'Done' : i === 3 ? 'In progress' : i === 4 ? 'En route' : 'Scheduled';
    const base0 = i < 3 ? { push: o.com ? 2 : 1, salt: 1, walks: 1 } : i === 3 ? { push: 1, salt: 0, walks: 0 } : { push: 0, salt: 0, walks: 0 };
    ['push', 'salt', 'walks'].forEach(k => { base0[k] += Number(RL.ui['snow.' + k + '.' + id] || 0); });
    const start = 110 + i * 50;
    return { id, seq: i + 1, clientId: v.clientId, client: v.client, address: v.address, x: v.x, y: v.y, com: o.com, pri: o.com ? (i < 2 ? 1 : 2) : 3, start, out: st === 'Done' ? start + 34 : null, status: st, counts: base0, gate: v.gate,
      svc: o.com ? ['Plow lot, salt lot and walks', 'Despejar lote, sal en lote y aceras'] : ['Push drive and walks, ice melt', 'Despejar entrada y aceras, deshielo'] };
  });
}

// ---------- chemical products (placeholder EPA numbers, not real products) ----------
const CHEM = {
  pre: { en: 'Crabgrass preventer + fertilizer 24-0-11', es: 'Preventivo de pasto cangrejo + fertilizante 24-0-11', epa: '00000-101', ai: 'Dithiopyr 0.10%', form: ['Granular', 'Granulado'], rate: 3.0, unit: 'lb', label: '2.6-3.6 lb', labelMax: 20, coMax: 15, signal: 'Caution', target: [['Crabgrass', 'Pasto cangrejo'], ['Foxtail', 'Cola de zorra']], rei: ['Keep people and pets off until watered in (label).', 'Mantener personas y mascotas fuera hasta regar (etiqueta).'], method: ['Rotary spreader', 'Esparcidora rotativa'] },
  broad: { en: 'Broadleaf herbicide, 3-way amine', es: 'Herbicida de hoja ancha, amina triple', epa: '00000-202', ai: '2,4-D, MCPP-p, dicamba (amine salts)', form: ['Liquid', 'Líquido'], rate: 1.5, unit: 'fl oz', label: '1.0-1.6 fl oz', labelMax: 15, coMax: 10, signal: 'Warning', target: [['Dandelion', 'Diente de león'], ['Clover', 'Trébol'], ['Plantain', 'Llantén']], rei: ['Keep people and pets off until the spray has dried (label).', 'Mantener personas y mascotas fuera hasta que seque (etiqueta).'], method: ['Ride-on sprayer', 'Rociadora montable'] },
  grub: { en: 'Grub preventive, granular', es: 'Preventivo de gusano blanco, granulado', epa: '00000-303', ai: 'Chlorantraniliprole 0.08%', form: ['Granular', 'Granulado'], rate: 2.3, unit: 'lb', label: '1.5-2.3 lb', labelMax: 20, coMax: 15, signal: 'Caution', target: [['White grubs', 'Gusano blanco']], rei: ['Water in with 1/2 in; re-enter after watering (label).', 'Regar 1/2 pulgada; reingreso después de regar (etiqueta).'], method: ['Rotary spreader', 'Esparcidora rotativa'] },
  spot: { en: 'Non-selective herbicide, spot spray', es: 'Herbicida no selectivo, aplicación puntual', epa: '00000-404', ai: 'Glyphosate 41%', form: ['Liquid', 'Líquido'], rate: 1.5, unit: 'fl oz', label: '1.0-2.0 fl oz', labelMax: 15, coMax: 10, signal: 'Caution', target: [['Weeds in beds and cracks', 'Maleza en camas y grietas']], rei: ['Keep people and pets off until the spray has dried (label).', 'Mantener personas y mascotas fuera hasta que seque (etiqueta).'], method: ['Backpack sprayer', 'Mochila rociadora'] },
};
const chemKey = s => /broadleaf/i.test(s) ? 'broad' : /Grub/i.test(s) ? 'grub' : /crabgrass|fertilizer/i.test(s) ? 'pre' : /Round/i.test(s) ? 'broad' : null;
const licOf = (D, name) => { const p = D.people.find(x => x.name === name); return p && p.cert ? p.cert : null; };
const licensedPeople = (D, not) => D.people.filter(p => p.cert && p.name !== not && p.status === 'active');
// Turf split for a client's property (front 40%, back 60%).
const turfOf = (D, clientId) => { const p = D.properties.find(x => x.client === clientId) || {}; const t = p.turf || 8000; return { total: t, front: rnd(t * .4, 10), back: t - rnd(t * .4, 10), prop: p }; };
// Who logged an application on a visit (applicator, or the licensed supervisor when the applicator has no license).
function applicatorFor(D, crewName) {
  const cr = D.crews.find(x => x.name === crewName) || D.crews[0] || { lead: 'Crew lead' };
  const lic = licOf(D, cr.lead);
  const sup = lic ? null : (licensedPeople(D, cr.lead)[0] || null);
  return { name: cr.lead, lic, sup };
}

// =====================================================================
// CREW APP: Today
// =====================================================================
function clockRow(c, K) {
  const T = c.tr, st = U('time.me', 'JOB');
  const label = K.lead ? T(`Crew on the clock: ${K.roster.length} of ${K.roster.length}`, `Cuadrilla en el reloj: ${K.roster.length} de ${K.roster.length}`) : (st === 'OUT' ? T('Clocked out', 'Fuera del reloj') : T('On the clock: job', 'En el reloj: trabajo'));
  const off = isOn('crew.offline');
  return `<div class="flex between"><span class="pill ${st === 'OUT' && !K.lead ? '' : 'ok'}">${icon('clock', 's')}${label}</span>${off ? h.pill(T('3 to send', '3 por enviar'), 'warn', 'wifi-off') : h.pill(T('0 to send', '0 por enviar'), '', 'refresh')}</div>`
    + (off ? pban(`${icon('wifi-off')} ${T('No signal for 0:42. 3 changes saved on this phone (2 photos, 1 checklist). They send when signal returns.', 'Sin señal desde hace 0:42. 3 cambios guardados en el teléfono (2 fotos, 1 lista). Se envían al volver la señal.')}`, 'warn') : '');
}
function weatherCard(c) {
  const W = wx(c), T = c.tr;
  return `<div class="cd" style="padding:9px 12px;display:flex;gap:10px;align-items:center">${icon(c.winter ? 'snow' : 'sun', 'l')}<div class="grow"><b class="num">${W.t}°F</b> <span class="small">${T(W.sky[0], W.sky[1])}</span><div class="tiny t3">${T('Wind', 'Viento')} ${W.wind} mph ${dirTr(c, W.dir)} · ${T(W.rain[0], W.rain[1])}</div></div>${h.pill(c.today.short, '')}</div>`;
}
function stopCard(c, K, v, o) {
  o = o || {};
  const T = c.tr, win = inWindow(v), ck = chemKey(v.service), tone = stTone(v.status);
  const haz = [];
  if (win && v.dog) haz.push(h.pill(T('Dog', 'Perro') + ': ' + esc(first(v.dog)), 'warn', 'warn'));
  if (win && v.gate) haz.push(h.pill(T('Gate code', 'Código de portón'), 'info', 'key'));
  if (!win && v.status === 'Scheduled' && (v.dog || v.gate)) haz.push(`<span class="tiny t3">${icon('lock', 's')} ${T('Access and hazards show in the visit window', 'Acceso y riesgos se ven en la ventana de visita')}</span>`);
  if (ck && v.status !== 'Done') haz.push(h.pill(T('Chemical record', 'Registro químico'), 'accent', 'flask'));
  const move = o.reorder && v.status === 'Scheduled' ? `<span class="flex gap4">${h.btn(icon('arrow-l'), { sm: true, act: 'crew-move', val: v.id + ':up', title: T('Move up', 'Subir') }).replace('<svg class="ic"', '<svg class="ic" style="transform:rotate(90deg)"')}${h.btn(icon('arrow-r'), { sm: true, act: 'crew-move', val: v.id + ':down', title: T('Move down', 'Bajar') }).replace('<svg class="ic"', '<svg class="ic" style="transform:rotate(90deg)"')}</span>` : '';
  const hl = v.status === 'In progress' ? 'border:2px solid var(--primary);' : RL.ui['crew.moved'] === v.id ? 'border:2px dashed var(--sky-500);' : '';
  return `<div class="cd" style="padding:10px 11px;display:grid;gap:6px;${hl}${v.status === 'Done' ? 'opacity:.78;' : ''}"${o.reorder ? '' : ` data-go="crew.visit" data-x="${esc(v.id)}" role="button" tabindex="0"`}>
    <div class="flex nw">${badge(v.seq, tone)}<div class="grow"><b class="small" style="display:block;line-height:1.25">${esc(v.client)}</b><span class="tiny t3">${esc(v.address)}</span></div>${move || stPill(c, v.status)}</div>
    <div class="flex between tiny"><span class="t2">${svc(c, v.service)}</span><span class="num t2">${t12(toMin(v.start))}${c.sees('budget_hours') ? ' · ' + f1(v.budgetHrs) + ' ' + T('crew-h', 'h-cuad.') : ''}</span></div>
    ${haz.length ? `<div class="flex gap4">${haz.join('')}</div>` : ''}
  </div>`;
}
RL.screen('crew.today', (c) => {
  const K = crewCtx(c), T = c.tr;
  if (!K.crew) return noCrew(c);
  if (c.winter) return stormToday(c, K);
  const S = K.stops, cur = curStop(K), nxt = nextStop(K, cur);
  const done = S.filter(v => v.status === 'Done').length;
  const budget = S.reduce((a, v) => a + v.budgetHrs, 0);
  const used = S.filter(v => v.status === 'Done').reduce((a, v) => a + v.budgetHrs * 1.08, 0) + (cur && cur.status === 'In progress' ? cur.budgetHrs * .5 : 0);
  const left = S.filter(v => v.status !== 'Done' && v.status !== 'Skipped');
  const finish = (cur ? toMin(cur.start) : 540) + left.reduce((a, v) => a + v.dur + 9, 0);
  const reorder = K.lead && isOn('crew.reorder');
  const talk = RL.ui['crew.talk'] === 'done';
  const dvirOverdue = K.D.equipment.some(e => e.crew === K.crew.name && /DVIR overdue/.test(e.next)) && !RL.ui['dvir.signed'];
  let out = clockRow(c, K) + weatherCard(c);
  if (K.lead) out += h.card({ title: T('Before you roll', 'Antes de salir'), body: h.list([
    { icon: 'shield', tone: talk ? 'ok' : 'warn', title: T('Tailgate talk: heat illness basics', 'Charla de seguridad: golpe de calor'), sub: talk ? T(`${K.roster.length} of ${K.roster.length} signed`, `${K.roster.length} de ${K.roster.length} firmaron`) : T(`1 of ${K.roster.length} signed`, `1 de ${K.roster.length} firmaron`), right: talk ? h.pill(T('Done', 'Hecho'), 'ok') : h.btn(T('Present', 'Presentar'), { sm: true, act: 'crew-talk' }) },
    { icon: 'truck', tone: dvirOverdue ? 'danger' : 'ok', title: T(`Pre-trip inspection: ${K.crew.truck}`, `Inspección previa: ${K.crew.truck}`), sub: dvirOverdue ? T('Mower inspection overdue', 'Inspección de podadora vencida') : T('Done 6:52 am', 'Hecha 6:52 am'), go: 'crew.equipment', right: icon('arrow-r') },
  ]), flush: true });
  out += `<div class="cd" style="padding:10px 12px;display:grid;gap:6px"><div class="flex between"><b>${done} / ${S.length} ${T('stops done', 'paradas hechas')}</b><span class="tiny t2">${T('Finish about', 'Fin aprox.')} ${t12(finish)}</span></div>`
    + (c.sees('budget_hours') ? h.meter(T('Crew hours vs budget', 'Horas de cuadrilla vs presupuesto'), Number(f1(used)), Number(f1(budget)), { unit: 'h' }) : '')
    + `<div class="tiny t3">${T('Hours, not dollars: prices stay in the office.', 'Horas, no dólares: los precios se quedan en la oficina.')}</div></div>`;
  out += `<div class="flex between"><b class="small">${T('Route', 'Ruta')} · ${esc(K.crew.name)}</b>${K.lead ? h.btn(reorder ? T('Done reordering', 'Listo') : T('Reorder', 'Reordenar'), { sm: true, ui: 'crew.reorder', val: reorder ? 'false' : 'true', icon: 'route' }) : `<span class="tiny t3">${T('Only the crew lead reorders', 'Solo el líder cambia el orden')}</span>`}</div>`;
  if (reorder) out += `<div class="cd" style="padding:8px 10px">${h.field(T('Reason for the office (optional)', 'Motivo para la oficina (opcional)'), h.select([['', T('Choose a reason', 'Elige un motivo')], ['party', T('Client asked for later', 'El cliente pidió más tarde')], ['traffic', T('Road closed', 'Calle cerrada')], ['dump', T('Dump run on the way', 'Ir al vertedero en el camino')]], U('crew.reason', ''), { ui: 'crew.reason', label: 'Reason' }))}</div>`;
  out += S.map(v => stopCard(c, K, v, { reorder })).join('');
  const target = cur && cur.status === 'In progress' ? cur : (nxt || cur);
  out += sticky(target ? bb(cur && cur.status === 'In progress' ? T(`Continue stop ${cur.seq}`, `Seguir parada ${cur.seq}`) : T(`Start next stop (${target.seq})`, `Iniciar siguiente parada (${target.seq})`), { go: 'crew.visit', x: target.id, icon: 'play' }) : bb(T('End of day report', 'Informe de fin de día'), { modal: 'crew-eod', icon: 'clipboard' }));
  const moved = RL.ui['crew.order'];
  out += '<!--side-->' + side(`${icon('eye')} What the office sees`, h.kv([
    ['Crew', `${esc(K.crew.name)} · ${esc(K.crew.truck)}`],
    ['Progress', `${done} / ${S.length} · ${used <= budget * .55 ? 'on pace' : 'slightly behind'}`],
    ['Visit price', h.mask(c, 'price', money(64))],
    ['Job cost', h.mask(c, 'cost', money(31))],
    ['Margin', h.mask(c, 'margin', '52%')],
  ]) + (moved ? h.note(`Dispatch board: "Reordered by ${esc(first(K.me))}${RL.ui['crew.reason'] ? ' (reason: ' + esc(RL.ui['crew.reason']) + ')' : ''}". Same-day reorders sync as a proposed sequence (05 §4.1.3).`) : h.note('Crew roles see hours budgets, never price, cost or margin (02 §10.2). Masked values show what the office sees behind the scenes.')))
    + side('Crew lead vs technician', h.list([
      { icon: 'users', tone: K.lead ? 'ok' : '', title: 'Crew lead', sub: 'Punches the whole crew, edits crew time with a reason, reorders same-day stops, approves crew time (first level).' },
      { icon: 'user', tone: K.lead ? '' : 'ok', title: 'Technician', sub: 'Own time only, the crew\'s stops read-only, checklists and photos.' },
    ]) + `<div class="flex mt8">${h.toggle('Simulate no signal', 'crew.offline')}</div>`, '');
  return out;
});
RL.act('crew-move', (el, ev, c) => {
  const K = crewCtx(c), p = String(el.dataset.val || '').split(':');
  const ids = K.stops.map(v => v.id), i = ids.indexOf(p[0]), j = p[1] === 'up' ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= ids.length) return false;
  if (K.stops[j].status !== 'Scheduled') { RL.toast(c.tr('Only stops that have not started can move.', 'Solo se mueven paradas sin empezar.')); return false; }
  const tmp = ids[i]; ids[i] = ids[j]; ids[j] = tmp;
  RL.ui['crew.order'] = ids.join(','); RL.ui['crew.moved'] = p[0];
});
RL.act('crew-talk', (el, ev, c) => { RL.ui['crew.talk'] = 'done'; RL.toast(c.tr('Talk presented. Each member signed with their PIN on this device.', 'Charla presentada. Cada miembro firmó con su PIN en este dispositivo.')); });
RL.modal('crew-eod', (c) => {
  const K = crewCtx(c), T = c.tr, S = K.stops;
  return { title: T('End of day report', 'Informe de fin de día'), body: h.kv([
    [T('Visits', 'Visitas'), `${S.filter(v => v.status === 'Done').length} ${T('done', 'hechas')}, ${S.filter(v => v.status === 'Skipped').length} ${T('skipped', 'omitidas')}`],
    [T('Hours', 'Horas'), `${f1(S.reduce((a, v) => a + v.budgetHrs, 0) * 1.04)} h ${T('of', 'de')} ${f1(S.reduce((a, v) => a + v.budgetHrs, 0))} h ${T('budget', 'presupuesto')}`],
    [T('Safety', 'Seguridad'), T('Talk signed, DVIR done, 0 incidents', 'Charla firmada, DVIR hecho, 0 incidentes')],
    [T('Spot it', 'Spot it'), T('2 submitted', '2 enviados')],
  ]) + h.note(T('Template at MVP; the AI draft arrives in V1 (05 §4.17.4).', 'Plantilla en MVP; el borrador con IA llega en V1 (05 §4.17.4).')), foot: h.btn(T('Submit report', 'Enviar informe'), { kind: 'primary', act: 'crew-eod-send' }) };
});
RL.act('crew-eod-send', (el, ev, c) => { RL.closeModal(); RL.toast(c.tr('Report sent to operations.', 'Informe enviado a operaciones.')); return false; });

// Winter Today: storm route from Snow Lite (14 §4.3.0)
function stormToday(c, K) {
  const T = c.tr, sites = stormSites(c, K), done = sites.filter(s => s.status === 'Done').length;
  const cur = sites.find(s => s.status === 'In progress') || sites.find(s => s.status !== 'Done');
  let out = clockRow(c, K) + weatherCard(c);
  out += `<div class="cd warn" style="padding:10px 12px;display:grid;gap:4px"><div class="flex between"><b>${icon('snow')} ${T('Storm route', 'Ruta de tormenta')}</b>${h.pill(T('3.5 in since 1:10 am', '3.5 in desde 1:10 am'), 'warn')}</div><div class="tiny t2">${T('The office created storm visits in priority order. Log pushes, salt and walks with photos at each site.', 'La oficina creó visitas de tormenta por prioridad. Registra despejes, sal y aceras con fotos en cada sitio.')}</div></div>`;
  out += `<div class="flex between"><b class="small">${done} / ${sites.length} ${T('sites done', 'sitios hechos')}</b><span class="tiny t3">${T('Priority 1 first: lots open by 7 am', 'Prioridad 1 primero: lotes abiertos a las 7 am')}</span></div>`;
  out += sites.map(s => `<div class="cd" style="padding:10px 11px;display:grid;gap:5px;${s.status === 'In progress' ? 'border:2px solid var(--primary);' : ''}${s.status === 'Done' ? 'opacity:.78;' : ''}" data-go="crew.snow" data-x="${s.id}" role="button" tabindex="0">
    <div class="flex nw">${badge(s.seq, stTone(s.status))}<div class="grow"><b class="small" style="display:block;line-height:1.25">${esc(s.client)}</b><span class="tiny t3">${esc(s.address)}</span></div>${stPill(c, s.status)}</div>
    <div class="flex between tiny"><span class="t2">${esc(T(s.svc[0], s.svc[1]))}</span>${h.pill('P' + s.pri, s.pri === 1 ? 'danger' : s.pri === 2 ? 'warn' : '')}</div>
    ${s.status === 'Done' ? `<div class="tiny t3">${T('Served', 'Atendido')} ${t12(s.start)}-${t12(s.out)} · ${s.counts.push} ${T('push', 'despeje')} · ${s.counts.salt} ${T('salt', 'sal')}</div>` : ''}
  </div>`).join('');
  out += sticky(cur ? bb(T(`Log site ${cur.seq}`, `Registrar sitio ${cur.seq}`), { go: 'crew.snow', x: cur.id, icon: 'snow' }) : '');
  out += '<!--side-->' + side(`${icon('eye')} What the office sees`, h.kv([
    ['Storm', 'Jan 12 · 3.5 in · started 1:10 am'], ['Route', `${esc(K.crew.name)} · ${done} of ${sites.length} sites`], ['Billing', 'Per-push and per-application lines from logged counts. Rates: ' + h.mask(c, 'price', money(165))],
  ]) + h.note('Snow Lite: storm visits are ordinary Visits in the office\'s priority order; no triggers or weather feeds (14 §4.3.0).'));
  return out;
}

// =====================================================================
// CREW APP: Visit
// =====================================================================
const CHECK = {
  mow: [['Mow front (height 3.5 in)', 'Cortar frente (altura 3.5 in)'], ['Mow back', 'Cortar atrás'], ['Edge walks and drive', 'Orillar aceras y entrada'], ['Trim around beds and fence', 'Recortar camas y cerca'], ['Blow hard surfaces', 'Soplar superficies duras'], ['After photos (2)', 'Fotos después (2)']],
  lawn: [['Check client flags (pets, no-spray)', 'Revisar avisos del cliente (mascotas, no rociar)'], ['Confirm turf area on the plan', 'Confirmar área de césped en el plano'], ['Apply product and log the record', 'Aplicar producto y guardar el registro'], ['Post lawn markers (photo)', 'Poner banderas de aviso (foto)'], ['Leave door hanger', 'Dejar aviso en la puerta'], ['After photos (2)', 'Fotos después (2)']],
  irr: [['Run each zone 2 minutes', 'Correr cada zona 2 minutos'], ['Inspect heads, adjust arcs', 'Revisar cabezas, ajustar arcos'], ['Check controller and rain sensor', 'Revisar controlador y sensor de lluvia'], ['Log repairs and parts', 'Registrar reparaciones y piezas'], ['After photos (2)', 'Fotos después (2)']],
  inst: [['Layout matches the plan sheet', 'El trazo coincide con el plano'], ['Excavation to depth', 'Excavación a profundidad'], ['Base compacted in lifts', 'Base compactada por capas'], ['Set pavers and cut edges', 'Colocar adoquines y cortar bordes'], ['Daily progress photos (2)', 'Fotos de avance del día (2)']],
};
function visitOf(c, K) { return K.stops.find(v => v.id === c.x) || curStop(K); }
function checkState(v, list) {
  const pre = v.status === 'Done' ? list.length : v.status === 'In progress' ? 3 : 0;
  const photos = v.status === 'Done' || RL.ui['ph.' + v.id] === 'true';
  return list.map((it, i) => { const k = RL.ui['ck.' + v.id + '.' + i]; const last = i === list.length - 1; return last ? photos : k != null ? k === 'true' : i < pre; });
}
RL.screen('crew.visit', (c) => {
  const K = crewCtx(c), T = c.tr;
  if (!K.crew || !K.stops.length) return noCrew(c);
  const v = visitOf(c, K), kind = kindOf(v.service), list = CHECK[kind], st = checkState(v, list), win = inWindow(v);
  const ck = chemKey(v.service), saved = RL.ui['chem.saved.' + v.id] || (v.status === 'Done' && ck);
  const prop = K.D.properties.find(p => p.client === v.clientId) || {};
  const code = v.gate ? String(v.gate).replace(/\D/g, '') : '';
  const reveal = RL.ui['reveal.' + v.id] === 'true';
  const dogOk = RL.ui['dog.' + v.id] === 'true';
  const photos = v.status === 'Done' || RL.ui['ph.' + v.id] === 'true';
  const signed = RL.ui['sig.' + v.id] === 'true' || v.status === 'Done';
  const voice = RL.ui['voice.' + v.id] === 'true';
  const orig = isOn('crew.orig');
  const nDone = st.filter(Boolean).length;
  const onsite = v.status === 'In progress' ? 18 : 0;
  let out = `<div class="flex between"><button type="button" class="btn sm ghost" data-go="crew.today">${icon('arrow-l')}${T('Route', 'Ruta')}</button><span class="tiny t3 mono">${esc(v.id)} · ${T('stop', 'parada')} ${v.seq} ${T('of', 'de')} ${K.stops.length}</span></div>`;
  out += `<div class="cd" style="padding:11px 12px;display:grid;gap:5px"><div class="flex nw"><div class="grow"><b style="font-size:1.02rem;display:block;line-height:1.25">${esc(v.client)}</b><span class="tiny t3">${esc(v.address)}</span></div>${stPill(c, v.status)}</div>
    <div class="small t2">${svc(c, v.service)}</div>
    <div class="flex gap4">${h.pill(`${T('Window', 'Ventana')} ${t12(toMin(v.start))}-${t12(toMin(v.start) + v.dur + 15)}`, '', 'clock')}${c.sees('budget_hours') ? h.pill(`${T('Budget', 'Presupuesto')} ${f1(v.budgetHrs)} ${T('crew-h', 'h-cuad.')}`, 'info') : ''}${onsite ? h.pill(`${T('On site', 'En sitio')} 0:${onsite}`, 'ok') : ''}</div>
    <div class="flex gap4">${h.btn(T('Navigate', 'Navegar'), { sm: true, act: 'crew-nav', icon: 'route' })}${h.btn(T('Call client', 'Llamar'), { sm: true, act: 'crew-call', icon: 'phone' })}${K.lead && v.status !== 'Done' ? h.btn(T('Skip', 'Omitir'), { sm: true, modal: 'crew-skip', icon: 'x' }) : ''}</div></div>`;
  // access and hazards: only inside the visit window (access_secret: R in window)
  if (win) {
    out += h.card({ title: `${icon('warn')} ${T('Access and hazards', 'Acceso y riesgos')}`, tone: 'warn', body: [
      v.gate ? `<div class="flex between"><span class="small"><b>${T('Gate code', 'Código del portón')}</b> <span class="mono" style="font-size:1.05rem">${reveal ? esc(code) : '••••'}</span></span>${reveal ? `<span class="tiny t3">${T('Logged 9:12', 'Registrado 9:12')}</span>` : h.btn(T('Tap to reveal', 'Tocar para ver'), { sm: true, ui: 'reveal.' + v.id, val: 'true', icon: 'eye' })}</div>` : `<div class="small t2">${T('No gate code on file.', 'Sin código de portón.')}</div>`,
      v.dog ? `<div class="flex between"><span class="small"><b>${T('Dog', 'Perro')}:</b> ${esc(v.dog.replace('friendly', c.tr('friendly', 'amigable')))} · ${T('back yard', 'patio trasero')}</span>${dogOk ? h.pill(T('Secured', 'Asegurado'), 'ok', 'check') : h.btn(T('Dog secured', 'Perro asegurado'), { sm: true, ui: 'dog.' + v.id, val: 'true' })}</div>` : '',
      prop.zones ? `<div class="small">${icon('drop', 's')} ${T(`Irrigation heads at the bed edge (zones 2-3): no blade edging there.`, `Cabezas de riego al borde de las camas (zonas 2-3): no orillar con disco ahí.`)}</div>` : `<div class="small">${icon('drop', 's')} ${T('Shallow sprinkler line along the drive: no stakes.', 'Línea de riego poco profunda junto a la entrada: no clavar estacas.')}</div>`,
    ].join('') });
  } else {
    out += `<div class="cd" style="padding:9px 12px" ><span class="small t2">${icon('lock', 's')} ${v.status === 'Done' ? T('Visit window closed. Gate code and hazard notes were removed from this phone.', 'Ventana cerrada. El código y los riesgos se borraron del teléfono.') : T(`Gate code and hazards appear in the visit window (from ${t12(toMin(v.start) - 15)}).`, `El código y los riesgos aparecen en la ventana de visita (desde ${t12(toMin(v.start) - 15)}).`)}</span></div>`;
  }
  const noteEn = kind === 'lawn' ? 'Please water the new seed by the patio. Kids play in the back yard after 3 pm.' : 'Close the side gate when you leave. Do not mow the wildflower patch behind the shed.';
  const noteEs = kind === 'lawn' ? 'Por favor rieguen la semilla nueva junto al patio. Los niños juegan atrás después de las 3 pm.' : 'Cierren el portón lateral al salir. No corten el parche de flores silvestres detrás del cobertizo.';
  out += h.card({ title: T('Client note', 'Nota del cliente') + ' ' + h.pill(T('Changed May 7', 'Cambió 7 may'), 'info'), actions: c.es ? h.btn(orig ? 'Ver traducción' : 'Ver original', { sm: true, ui: 'crew.orig', val: orig ? 'false' : 'true' }) : '', body: `<div class="small">"${esc(c.es && !orig ? noteEs : noteEn)}"</div>${c.es && !orig ? `<div class="tiny t3">${icon('globe', 's')} Traducido del inglés</div>` : ''}` });
  out += h.card({ title: `${T('Checklist', 'Lista')} <span class="t3 num">${nDone}/${list.length}</span>`, flush: true, body: `<div class="li">${list.map((it, i) => {
    const last = i === list.length - 1, on = st[i];
    const ctl = last ? '' : ` data-ui="ck.${v.id}.${i}" data-val="${on ? 'false' : 'true'}" role="button" tabindex="0"`;
    return `<div class="li-i${last ? '' : ' go'}"${ctl} style="min-height:44px"><span class="ico ${on ? 'ok' : ''}">${icon(on ? 'check' : last ? 'camera' : 'list')}</span><div class="grow"><div class="tt" style="${on ? 'text-decoration:line-through;color:var(--text-3)' : ''}">${esc(T(it[0], it[1]))}</div>${last ? `<div class="ss">${T('Required before you complete', 'Obligatorio para completar')}</div>` : ''}</div><span></span></div>`;
  }).join('')}</div>` });
  out += h.card({ title: T('Photos', 'Fotos'), body: `<div class="cols cols-2" style="gap:6px">${h.photo('before', { badge: T('Before 9:13', 'Antes 9:13') })}${h.photo('lawn', { badge: T('Before 9:13', 'Antes 9:13') })}</div>`
    + (photos ? `<div class="cols cols-2" style="gap:6px">${h.photo('after', { badge: T('After 9:34', 'Después 9:34') })}${h.photo('bed', { badge: T('After 9:35', 'Después 9:35') })}</div>` : bb(T('Take after photos (0 of 2)', 'Tomar fotos después (0 de 2)'), { act: 'crew-photo', val: v.id, icon: 'camera', ghost: true })) });
  out += h.card({ title: T('Materials', 'Materiales'), actions: h.btn(T('Add or scan', 'Añadir o escanear'), { sm: true, act: 'crew-mat', icon: 'plus' }), body: kind === 'lawn' ? meta(esc(T(CHEM[ck || 'pre'].en, CHEM[ck || 'pre'].es)), T('3 bags planned · 2 used', '3 bolsas planeadas · 2 usadas')) : kind === 'inst' ? meta(T('Pavers, tumbled', 'Adoquines'), '380 ft²') + meta(T('Polymeric sand', 'Arena polimérica'), T('6 bags', '6 bolsas')) : `<span class="tiny t3">${T('None planned for this stop.', 'Nada planeado para esta parada.')}</span>` });
  if (ck) out += h.card({ title: `${icon('flask')} ${T('Chemical application record', 'Registro de aplicación química')}`, tone: saved ? 'ok' : 'warn', body: `<div class="small">${esc(T(CHEM[ck].en, CHEM[ck].es))} · EPA ${CHEM[ck].epa}</div><div class="tiny t3">${saved ? T('Saved and locked. A correction creates an amendment.', 'Guardado y bloqueado. Una corrección crea una enmienda.') : T('Required before you complete this visit.', 'Obligatorio antes de completar esta visita.')}</div>${h.btn(saved ? T('View record', 'Ver registro') : T('Open record', 'Abrir registro'), { sm: true, go: 'crew.chem', x: v.id, icon: 'arrow-r' })}` });
  out += h.card({ title: `${icon('mic')} ${T('Voice note', 'Nota de voz')}`, body: voice ? h.aiCard({ agent: 'A4 Field-Note', level: 'L1', credits: 1, title: T('Transcribed and translated (0:42)', 'Transcrita y traducida (0:42)'), body: `<div class="small"><b>ES</b> "La señora pide cotización para limpieza de otoño y más mantillo en las camas del frente."</div><div class="small"><b>EN</b> "The client asks for a fall cleanup quote and more mulch in the front beds."</div>`, why: T('The office gets a draft opportunity to review. Nothing is sent to the client by AI.', 'La oficina recibe un borrador para revisar. La IA no envía nada al cliente.') })
    : `<div class="flex between"><span class="tiny t3">${T('A4 Field-Note: 1 credit per minute, L1 (drafts only). Records offline, transcribes on sync.', 'A4 Field-Note: 1 crédito por minuto, L1 (solo borradores). Graba sin señal, transcribe al sincronizar.')}</span></div>${bb(T('Hold to talk', 'Mantén para hablar'), { act: 'crew-voice', val: v.id, icon: 'mic', ghost: true })}` });
  out += `<div class="cols cols-2" style="gap:8px">${bb(T('Spot it', 'Spot it'), { modal: 'crew-spotit', icon: 'camera', ghost: true })}${bb(T('Report issue', 'Reportar'), { act: 'crew-issue', icon: 'flag', ghost: true })}</div>`;
  if (c.inLens('V1')) out += h.card({ title: `${T('Client signature', 'Firma del cliente')} ${h.tag('V1')}`, body: signed ? `${sig()}<div class="tiny t3">${T('Signed on this phone 9:36 am, attached to the visit report.', 'Firmado en este teléfono 9:36 am, adjunto al informe.')}</div>` : `<div style="border:1px dashed var(--border-strong);border-radius:10px;height:56px;display:grid;place-items:center" class="tiny t3">${T('Hand the phone to the client to sign', 'Pasa el teléfono al cliente para firmar')}</div>${h.btn(T('Capture signature', 'Capturar firma'), { sm: true, ui: 'sig.' + v.id, val: 'true', icon: 'pen' })}` });
  if (K.lead) out += h.card({ title: T('Crew time on this visit', 'Tiempo de cuadrilla en la visita'), body: K.roster.map((n, i) => meta(esc(n) + (n === K.crew.lead ? ' (' + T('lead', 'líder') + ')' : ''), onsite ? `0:${onsite - i * 2}` : '-')).join('') });
  out += sticky(v.status === 'Done' ? bb(T('Visit complete', 'Visita completada'), { ghost: true, icon: 'check', go: 'crew.today' }) : bb(T('Complete visit', 'Completar visita'), { act: 'crew-complete', val: v.id, icon: 'check' }));
  out += '<!--side-->' + side(`${icon('eye')} What the office sees`, h.timeline([
    { when: '9:02', text: `En route. Client texted "on the way, ETA 9:10-9:40".`, tone: 'info' },
    { when: '9:11', text: 'Arrived (geofence and tap).', tone: 'ok' },
    reveal ? { when: '9:12', text: `Gate code revealed by ${esc(first(K.me))} on this visit (audit log).`, tone: 'warn' } : null,
    { when: '9:13', text: '2 before photos synced.', tone: 'ok' },
    photos ? { when: '9:34', text: '2 after photos synced.', tone: 'ok' } : null,
  ].filter(Boolean)) + h.kv([['Visit price', h.mask(c, 'price', money(68))], ['Client phone', `<span class="masked" title="Calls go through a masked number (05 §4.3.1)">(•••) •••-••••</span>`], ['Internal note', h.mask(c, 'internal_note', 'Upsell aeration')]]) + h.note('Gate codes and hazards show only inside the visit window and are purged from the phone 24 h after the visit (05 §4.3.3).'));
  return out;
});
RL.act('crew-nav', (el, ev, c) => { RL.toast(c.tr('Opening Google Maps at the access point (side entrance).', 'Abriendo Google Maps en el punto de acceso (entrada lateral).')); return false; });
RL.act('crew-call', (el, ev, c) => { RL.toast(c.tr('Calling through a masked number. Your phone never stores the client number.', 'Llamando con número oculto. Tu teléfono no guarda el número del cliente.')); return false; });
RL.act('crew-photo', (el, ev, c) => { RL.ui['ph.' + el.dataset.val] = 'true'; RL.toast(c.tr('2 after photos saved with time and GPS.', '2 fotos después guardadas con hora y GPS.')); });
RL.act('crew-mat', (el, ev, c) => { RL.toast(c.tr('Scanner opened (mock). Price Book names only, no prices.', 'Escáner abierto (simulado). Solo nombres del catálogo, sin precios.')); return false; });
RL.act('crew-voice', (el, ev, c) => { RL.ui['voice.' + el.dataset.val] = 'true'; RL.toast(c.tr('Voice note saved (0:42). 1 credit used.', 'Nota de voz guardada (0:42). 1 crédito usado.')); });
RL.act('crew-issue', (el, ev, c) => { RL.toast(c.tr('Issue sent to operations with your photos.', 'Problema enviado a operaciones con tus fotos.')); return false; });
RL.act('crew-complete', (el, ev, c) => {
  const K = crewCtx(c), v = K.stops.find(x => x.id === el.dataset.val); if (!v) return false;
  const T = c.tr, miss = [];
  if (RL.ui['ph.' + v.id] !== 'true') miss.push(T('after photos (0 of 2)', 'fotos después (0 de 2)'));
  if (chemKey(v.service) && !RL.ui['chem.saved.' + v.id]) miss.push(T('chemical record', 'registro químico'));
  if (miss.length) { RL.toast(T('Missing: ', 'Falta: ') + miss.join(', ')); return false; }
  RL.ui['vdone.' + v.id] = 'true'; RL.toast(T('Visit complete. The client gets the visit report.', 'Visita completada. El cliente recibe el informe.'));
});
RL.modal('crew-skip', (c) => {
  const T = c.tr, rs = [['No access (gate locked)', 'Sin acceso (portón cerrado)'], ['Dog loose', 'Perro suelto'], ['Rain or wet turf', 'Lluvia o césped mojado'], ['Client asked to skip', 'El cliente pidió omitir']];
  return { title: T('Skip with a reason', 'Omitir con motivo'), body: rs.map((r, i) => `<label class="flex small" style="padding:8px 0;border-bottom:1px solid var(--border)"><input type="radio" name="skipr"${i === 0 ? ' checked' : ''}> ${T(r[0], r[1])}</label>`).join('') + h.note(T('A timestamped photo is required for "No access" (evidence for billing). The client gets a reschedule offer.', 'Se requiere foto con hora para "Sin acceso". El cliente recibe una oferta para reprogramar.')), foot: h.btn(T('Cancel', 'Cancelar'), { act: 'noop' }) + h.btn(T('Skip stop', 'Omitir parada'), { kind: 'danger', act: 'crew-skip-do' }) };
});
RL.act('crew-skip-do', (el, ev, c) => { const K = crewCtx(c), v = visitOf(c, K); if (v) RL.ui['vskip.' + v.id] = 'true'; RL.closeModal(); RL.toast(c.tr('Stop skipped. Dispatch and the client were notified.', 'Parada omitida. Se avisó a despacho y al cliente.')); });
RL.modal('crew-spotit', (c) => {
  const T = c.tr, lead = c.role === 'crew_lead';
  return { title: T('Spot it', 'Spot it: reportar o sugerir trabajo'), body: `<div class="cols cols-2" style="gap:6px">${h.photo('lawn', { badge: T('Zone 3 · 9:21', 'Zona 3 · 9:21') })}${h.photo('bed', { badge: '9:22' })}</div>`
    + h.aiCard({ agent: T('Spot it classifier', 'Clasificador Spot it'), level: 'L1', credits: 1, title: T('Irrigation: broken rotor head (92%)', 'Riego: cabeza de rotor rota (92%)'), body: T('Suggested work: replace 1 rotor head, zone 3, back lawn.', 'Trabajo sugerido: cambiar 1 cabeza de rotor, zona 3, césped trasero.'), why: T('Runs when you submit; offline it is classified once you are back online.', 'Corre al enviar; sin señal se clasifica al volver la conexión.') })
    + `<div class="small b">${T('How urgent?', '¿Qué tan urgente?')}</div><div class="flex">${[['Can wait', 'Puede esperar'], ['Soon', 'Pronto'], ['Now', 'Ahora']].map((u, i) => `<label class="flex small"><input type="radio" name="urg"${i === 1 ? ' checked' : ''}> ${T(u[0], u[1])}</label>`).join('')}</div>`
    + (lead ? `<div class="xnote">${T('The client pre-approved small irrigation fixes, so you can fix it now. Parts and time are logged; the office prices it.', 'El cliente pre-aprobó arreglos menores de riego: puedes arreglarlo ahora. Se registran piezas y tiempo; la oficina pone el precio.')}</div>` : `<div class="xnote">${T('Your crew lead decides on fix-now work.', 'Tu líder decide si se arregla ahora.')}</div>`),
    foot: (lead ? h.btn(T('Fix it now', 'Arreglar ahora'), { act: 'spot-fix' }) : '') + h.btn(T('Send to estimator', 'Enviar al estimador'), { kind: 'primary', act: 'spot-send' }) };
});
RL.act('spot-send', (el, ev, c) => { RL.closeModal(); RL.toast(c.tr('Sent. The estimator gets photos, the pin and a draft scope. You get spotter credit if it sells.', 'Enviado. El estimador recibe fotos, el pin y un borrador. Ganas crédito si se vende.')); return false; });
RL.act('spot-fix', (el, ev, c) => { RL.closeModal(); RL.toast(c.tr('Fix logged: 1 rotor head and 0.3 h. The client gets before and after photos.', 'Arreglo registrado: 1 cabeza de rotor y 0.3 h. El cliente recibe fotos de antes y después.')); return false; });

// =====================================================================
// CREW APP: Chemical application log (05 §4.7, 21 §18.19)
// =====================================================================
RL.screen('crew.chem', (c, a) => {
  const K = crewCtx(c), T = c.tr, D = c.D;
  if (!K.crew || !K.stops.length) return noCrew(c);
  const v = K.stops.find(x => x.id === c.x) || K.stops.find(x => chemKey(x.service) && x.status !== 'Done') || curStop(K);
  const key = U('chem.prod', chemKey(v.service) || 'spot'), P = CHEM[key] || CHEM.spot;
  const turf = turfOf(D, v.clientId);
  const area = key === 'spot' ? 1200 : turf.total;
  const total = Math.round(P.rate * area / 100) / 10;
  const W = wx(c), wind = Number(U('chem.wind', String(W.wind)));
  const lic = isOn('chem.lic', !!licOf(D, K.me)) ? (licOf(D, K.me) || 'Applicator 3A, exp Oct 2027') : null;
  const sups = licensedPeople(D, K.me);
  const sup = U('chem.sup', '');
  const canSave = !!lic || !!sup;
  const overLabel = wind > P.labelMax, overCo = !overLabel && wind > P.coMax;
  const override = RL.ui['chem.ovr'] === 'true';
  const saved = RL.ui['chem.saved.' + v.id];
  const step = Number(U('chem.step', '3'));
  let out = `<div class="flex between"><button type="button" class="btn sm ghost" data-go="crew.visit" data-x="${esc(v.id)}">${icon('arrow-l')}${T('Visit', 'Visita')}</button><span class="tiny t3">${T('Step', 'Paso')} ${step} ${T('of', 'de')} 4</span></div>`;
  out += `<div><b>${T('Application record', 'Registro de aplicación')}</b> ${a && a.state === 'limit' ? h.pill(T('Plan limit: ', 'Límite del plan: ') + esc(a.limit || ''), 'info') : ''}<div class="tiny t3">${esc(v.client)} · ${esc(v.address)} · ${T('stop', 'parada')} ${v.seq}</div></div>`;
  out += h.steps([T('Product', 'Producto'), T('Area', 'Área'), T('Weather', 'Clima'), T('Sign', 'Firmar')], step - 1);
  // applicator license check
  if (lic) out += pban(`${icon('shield')} ${T('Applicator', 'Aplicador')}: <b>${esc(K.me)}</b> · ${esc(lic)} · ${T('valid for this product category', 'válida para esta categoría')}`, 'info');
  else out += h.card({ tone: 'danger', title: `${icon('lock')} ${T('Logging blocked: no applicator license on file', 'Registro bloqueado: no hay licencia de aplicador')}`, body: `<div class="small">${T(`${esc(K.me)} has no license for turf category 3A in this state, so you cannot save this record yourself. Name a licensed applicator supervising on site (if state rules allow), or it stays a flagged draft and ${esc(K.ops)} is alerted.`, `${esc(K.me)} no tiene licencia para la categoría 3A (césped) en este estado, así que no puedes guardar este registro. Nombra a un aplicador con licencia que supervise en sitio (si el estado lo permite) o queda como borrador marcado y se avisa a ${esc(K.ops)}.`)}</div>`
    + (sups.length ? h.field(T('Licensed applicator supervising on site (if state rules allow)', 'Aplicador con licencia supervisando en sitio (si el estado lo permite)'), h.select([['', T('Choose a licensed applicator', 'Elige un aplicador con licencia')]].concat(sups.slice(0, 4).map(p => [p.name, `${p.name} · ${p.cert}`])), sup, { ui: 'chem.sup', label: 'Supervisor' })) : `<div class="tiny t3">${T('No licensed applicator is active in this Company.', 'No hay aplicadores con licencia activos en esta empresa.')}</div>`) });
  out += h.card({ title: T('Product', 'Producto'), body: h.select(Object.keys(CHEM).map(k => [k, T(CHEM[k].en, CHEM[k].es)]), key, { ui: 'chem.prod', label: 'Product' })
    + h.kv([[T('EPA Reg. No.', 'Reg. EPA'), `<span class="mono">${P.epa}</span> <span class="tiny t3">${T('(placeholder)', '(ejemplo)')}</span>`], [T('Active ingredient', 'Ingrediente activo'), esc(P.ai)], [T('Form', 'Forma'), T(P.form[0], P.form[1]) + ' · ' + T('signal word', 'palabra de aviso') + ' ' + P.signal], [T('Target', 'Objetivo'), P.target.map(t => esc(T(t[0], t[1]))).join(', ')], [T('Method', 'Método'), T(P.method[0], P.method[1])]]) });
  out += h.card({ title: T('Area and rate', 'Área y dosis'), body: (key === 'spot' ? meta(T('Beds and pavement cracks', 'Camas y grietas'), '1,200 ft²') : meta(T('Front turf', 'Césped frente'), h.num(turf.front) + ' ft²') + meta(T('Back turf', 'Césped atrás'), h.num(turf.back) + ' ft²'))
    + meta(`<b>${T('Total area', 'Área total')}</b>`, `<b>${h.num(area)} ft²</b>`) + meta(T('Rate', 'Dosis'), `${P.rate} ${P.unit} / 1,000 ft² (${T('label', 'etiqueta')} ${P.label})`) + meta(`<b>${T('Product used', 'Producto usado')}</b>`, `<b>${total} ${P.unit}</b>`)
    + `<div class="tiny t3">${T('Area comes from the measured property plan; you confirm instead of typing.', 'El área viene del plano medido; tú confirmas en vez de escribir.')}</div>` });
  out += h.card({ tone: overLabel ? 'danger' : overCo ? 'warn' : 'ok', title: `${icon('wind')} ${T('Weather (auto, editable)', 'Clima (automático, editable)')}`, body: `<div class="small"><b>${T('Wind', 'Viento')} ${wind} mph ${dirTr(c, W.dir)}</b> · ${T('gust', 'ráfaga')} ${wind + 3} · ${W.t}°F · ${T('RH', 'HR')} ${W.rh}%</div><div class="tiny t3">${T('Station 2.8 mi away, 9:52 am. Source is stored with the record.', 'Estación a 2.8 mi, 9:52 am. La fuente se guarda con el registro.')}</div>`
    + meta(T('Label max wind', 'Viento máximo de etiqueta'), P.labelMax + ' mph') + meta(T('Company limit', 'Límite de la empresa'), P.coMax + ' mph')
    + (overLabel ? `<div class="small b" style="color:var(--danger-text)">${T(`Over the label maximum. No override: the label is the law.`, `Sobre el máximo de la etiqueta. No se puede saltar: la etiqueta es la ley.`)}</div>`
      : overCo ? (K.lead ? `<div class="small">${T('Above the Company limit but within the label. You can override with a reason.', 'Sobre el límite de la empresa pero dentro de la etiqueta. Puedes continuar con un motivo.')}</div>${override ? h.pill(T('Override: granular, low boom height', 'Excepción: granulado, altura baja'), 'warn') : h.btn(T('Override with reason', 'Continuar con motivo'), { sm: true, ui: 'chem.ovr', val: 'true' })}` : `<div class="small">${T('Above the Company limit. Ask your crew lead to override.', 'Sobre el límite de la empresa. Pide al líder que lo autorice.')}</div>`)
      : `<div class="small" style="color:var(--ok-text)">${icon('check', 's')} ${T('Wind OK for this product.', 'Viento OK para este producto.')}</div>`) });
  out += h.card({ title: T('Re-entry and posting', 'Reingreso y avisos'), body: `<div class="small"><b>${T('Re-entry interval', 'Intervalo de reingreso')}:</b> ${esc(T(P.rei[0], P.rei[1]))}</div>`
    + h.toggle(T('Lawn markers posted (photo)', 'Banderas de aviso puestas (foto)'), 'chem.flags', true) + h.toggle(T('Door hanger left', 'Aviso en la puerta'), 'chem.door', false)
    + `<div class="tiny t3">${T('The re-entry text goes to the client report in their language.', 'El texto de reingreso va al informe del cliente en su idioma.')}</div>` });
  const blocked = !canSave ? T('Blocked: license required', 'Bloqueado: se requiere licencia') : overLabel ? T(`Can't apply now: wind ${wind} mph, label max ${P.labelMax}`, `No se puede aplicar: viento ${wind} mph, máx. ${P.labelMax}`) : overCo && !override ? T('Waiting on wind override', 'Esperando autorización por viento') : '';
  out += sticky(saved ? bb(T('Saved and locked 9:31', 'Guardado y bloqueado 9:31'), { ghost: true, icon: 'lock', go: 'crew.visit', x: v.id })
    : blocked ? `${bb(blocked, { disabled: true, icon: 'lock', style: 'background:var(--danger-solid);color:#fff;opacity:.92' })}${overLabel ? `<div class="cols cols-2" style="gap:6px">${bb(T('Skip step', 'Omitir paso'), { ghost: true, act: 'chem-hold', val: 'skip' })}${bb(T('Reschedule', 'Reprogramar'), { ghost: true, act: 'chem-hold', val: 'resched' })}</div>` : !canSave ? bb(T('Save flagged draft', 'Guardar borrador marcado'), { ghost: true, act: 'chem-draft' }) : ''}`
    : bb(T('Hold to save application', 'Mantén para guardar'), { act: 'chem-save', val: v.id, icon: 'check' }));
  out += '<!--side-->' + side(`${icon('eye')} What the office sees`, h.kv([
    ['Record', `CHM-${String(hs(v.id) % 9000 + 1000)} · ${saved ? 'locked' : canSave ? 'in progress' : 'flagged draft'}`], ['Applicator', esc(K.me) + (sup ? ` under ${esc(sup)}` : '')], ['License', lic ? esc(lic) : '<b style="color:var(--danger-text)">missing</b>'], ['Product', `${esc(P.en)} · ${total} ${P.unit}`], ['Wind', `${wind} mph (label ${P.labelMax}, Company ${P.coMax})`],
  ]) + h.note('Records are immutable after signature; corrections create an amendment. Default retention 7 years. State reports in V1 (05 §4.7).'))
    + side('Try the gates', `<div class="small b">Simulate wind</div><div class="flex gap4">${['6', '12', '17'].map(w => h.btn(w + ' mph', { sm: true, ui: 'chem.wind', val: w, kind: String(wind) === w ? 'primary' : '' })).join('')}</div>${h.toggle('License on file for ' + esc(first(K.me)), 'chem.lic', !!licOf(D, K.me))}${h.note('From data: ' + esc(K.me) + (licOf(D, K.me) ? ' holds ' + esc(licOf(D, K.me)) : ' has no applicator license on file') + '.')}`);
  return out;
});
RL.act('chem-save', (el, ev, c) => { RL.ui['chem.saved.' + el.dataset.val] = 'true'; RL.ui['chem.step'] = '4'; RL.toast(c.tr('Application saved and locked. It appears in the client visit report.', 'Aplicación guardada y bloqueada. Aparece en el informe del cliente.')); });
RL.act('chem-draft', (el, ev, c) => { RL.toast(c.tr('Saved as a flagged draft. Operations was alerted.', 'Guardado como borrador marcado. Se avisó a operaciones.')); return false; });
RL.act('chem-hold', (el, ev, c) => { RL.toast(el.dataset.val === 'skip' ? c.tr('Step marked weather hold. The office reschedules it.', 'Paso marcado por clima. La oficina lo reprograma.') : c.tr('Reschedule request sent to dispatch.', 'Solicitud de reprogramar enviada a despacho.')); return false; });

// =====================================================================
// CREW APP: Map
// =====================================================================
RL.screen('crew.map', (c) => {
  const K = crewCtx(c), T = c.tr;
  if (!K.crew) return noCrew(c);
  const S = c.winter ? stormSites(c, K) : K.stops;
  if (!S.length) return noCrew(c);
  const toneOf = s => s === 'Done' ? 'done' : s === 'In progress' ? 'accent' : s === 'En route' ? 'info' : s === 'Skipped' ? 'danger' : 'ok';
  const pts = S.filter(v => v.x != null);
  const sel = S.find(v => v.id === RL.ui['map.sel']) || S.find(v => v.status === 'In progress') || S[0];
  const sat = isOn('map.sat');
  let out = `<div class="flex between"><b>${c.winter ? T('Storm route', 'Ruta de tormenta') : T("Today's route", 'Ruta de hoy')}</b>${h.toggle(T('Satellite', 'Satélite'), 'map.sat')}</div>`;
  out += `<div style="${sat ? 'filter:saturate(.55) brightness(.92) hue-rotate(-15deg)' : ''}">${h.map({ pins: pts.map(v => ({ x: v.x, y: v.y, n: v.seq, tone: toneOf(v.status), label: v.client })), route: pts.map(v => [v.x, v.y]), seed: hs(K.crew.id) % 50, label: 'Route map' })}</div>`;
  out += `<div class="flex gap4 tiny">${h.pill(T('Done', 'Hecha'), '')}${h.pill(T('Current', 'Actual'), 'accent')}${h.pill(T('Next', 'Siguiente'), 'info')}${h.pill(T('Planned', 'Planeada'), 'ok')}</div>`;
  const drive = 6 + hs(sel.id) % 9;
  out += h.card({ title: `${badge(sel.seq, stTone(sel.status))} ${esc(sel.client)}`, body: `<div class="tiny t3">${esc(sel.address)}</div><div class="flex between small"><span>${c.winter ? esc(T(sel.svc[0], sel.svc[1])) : svc(c, sel.service)}</span>${stPill(c, sel.status)}</div><div class="tiny t2">${T('Drive', 'Manejo')} ${drive} min · ${T('access point: side entrance', 'punto de acceso: entrada lateral')}</div><div class="flex">${h.btn(T('Navigate', 'Navegar'), { sm: true, act: 'crew-nav', icon: 'route' })}${h.btn(T('Open', 'Abrir'), { sm: true, go: c.winter ? 'crew.snow' : 'crew.visit', x: sel.id })}</div>` });
  out += h.card({ flush: true, body: h.list(S.map(v => ({ icon: v.status === 'Done' ? 'check' : 'pin', tone: v.status === 'Done' ? 'ok' : v.id === sel.id ? 'info' : '', title: `${v.seq}. ${esc(v.client)}`, sub: esc(v.address), act: 'map-pick', x: v.id, right: v.id === sel.id ? h.pill(T('Selected', 'Elegida'), 'info') : '' }))) });
  out += K.lead ? `<div class="tiny t3">${T('Reorder from Today. The office sees your proposed sequence.', 'Reordena desde Hoy. La oficina ve tu secuencia propuesta.')}</div>` : `<div class="tiny t3">${T('Read-only map: your Company lets technicians view the route.', 'Mapa de solo lectura: tu empresa permite a técnicos ver la ruta.')}</div>`;
  out += '<!--side-->' + side(`${icon('eye')} What the office sees`, h.kv([['Live location', 'Only while the crew is clocked in (05 §4.23)'], ['Stops', `${S.length} in route order`], ['Offline', 'Route corridor map is cached; pins stay readable without signal']]));
  return out;
});
RL.act('map-pick', (el, ev, c) => { RL.ui['map.sel'] = el.dataset.x; });

// =====================================================================
// CREW APP: Time (05 §4.5)
// =====================================================================
const TST = { JOB: ['Job', 'Trabajo', 'ok'], DRIVE: ['Drive', 'Manejo', 'info'], SHOP: ['Shop', 'Taller', ''], REST: ['Rest 10', 'Descanso 10', 'warn'], MEAL: ['Meal 30', 'Comida 30', 'warn'], OUT: ['Clocked out', 'Fuera', 'danger'] };
const tPill = (c, k) => h.pill(c.tr(TST[k][0], TST[k][1]), TST[k][2]);
RL.screen('crew.time', (c) => {
  const K = crewCtx(c), T = c.tr;
  if (!K.crew) return noCrew(c);
  const W = c.winter;
  const segs = W ? [['1:30', 'SHOP', T('Load salt, pre-trip', 'Cargar sal, inspección')], ['1:45', 'DRIVE', T('To site 1', 'Al sitio 1')], ['1:50', 'JOB', T('Sites 1-3', 'Sitios 1-3')], ['4:20', 'JOB', T('Site 4 (now)', 'Sitio 4 (ahora)')]]
    : [['6:52', 'SHOP', T('Load-out and pre-trip', 'Carga e inspección')], ['7:05', 'DRIVE', T('To stop 1', 'A la parada 1')], ['7:15', 'JOB', T('Stops 1-3', 'Paradas 1-3')], ['8:55', 'REST', T('Rest break', 'Descanso')], ['9:05', 'DRIVE', T('To stop 4', 'A la parada 4')], ['9:11', 'JOB', T('Stop 4 (now)', 'Parada 4 (ahora)')]];
  const segList = h.timeline(segs.map(s => ({ when: t12(toMin(s[0])), text: `${tPill(c, s[1])} <span class="small">${esc(s[2])}</span>`, tone: TST[s[1]][2] || '' })));
  const ts = K.D.timesheets.find(x => x.person === K.me) || { hrs: 38.5, ot: 0 };
  if (!K.lead) {
    const st = U('time.me', 'JOB');
    let out = `<div class="cd" style="padding:14px;display:grid;gap:6px;text-align:center"><span class="tiny t3">${T('My clock', 'Mi reloj')} · ${esc(K.me)}</span><div style="font-size:1.6rem;font-weight:800" class="num">${st === 'OUT' ? '0:00' : W ? '3:22' : '2:50'}</div><div>${tPill(c, st)}</div><div class="tiny t3">${T('Clocked in by your crew lead at', 'Tu líder marcó tu entrada a las')} ${W ? '1:30 am' : '6:52 am'}</div></div>`;
    out += `<div class="cols cols-2" style="gap:8px">${bb(T('Rest 10', 'Descanso 10'), { ghost: true, act: 'time-me', val: 'REST', icon: 'pause' })}${bb(T('Meal 30', 'Comida 30'), { ghost: true, act: 'time-me', val: 'MEAL', icon: 'clock' })}</div>`;
    out += pban(`${icon('clock')} ${T('Meal must start by 11:45 am (state rule).', 'La comida debe empezar antes de las 11:45 am (regla estatal).')}`, 'info');
    out += h.card({ title: T('Today', 'Hoy'), body: segList });
    out += h.card({ title: T('My week', 'Mi semana'), body: meta(T('Hours this week', 'Horas esta semana'), `${f1(ts.hrs)} h`) + meta(T('Overtime', 'Horas extra'), `${f1(ts.ot)} h`) + `<div class="tiny t3">${T('You see only your own time. Your crew lead punches the crew.', 'Solo ves tu propio tiempo. Tu líder marca a la cuadrilla.')}</div>` });
    out += sticky(st === 'OUT' ? bb(T('Clock in', 'Marcar entrada'), { act: 'time-me', val: 'JOB', icon: 'play' }) : bb(T('Clock out', 'Marcar salida'), { modal: 'time-attest', icon: 'clock' }));
    out += '<!--side-->' + side(`${icon('eye')} What the office sees`, h.kv([['Status', `${esc(K.me)} · ${TST[st][0]}`], ['Pay rate', h.mask(c, 'pay_rate', 'Visible to self') ], ['Edits', 'Only the crew lead or office can edit, always with a reason']]) + h.note('Technician: own time (time_entry W/o + R/o). Daily attestation at clock-out (05 §4.5).'));
    return out;
  }
  const sel = K.roster.map((n, i) => RL.ui['tsel.' + i] !== 'false');
  const stOf = i => U('tst.' + i, i === 2 ? 'DRIVE' : 'JOB');
  let out = `<div class="flex between"><b>${T('Crew clock', 'Reloj de cuadrilla')} · ${esc(K.crew.name)}</b><span class="tiny t3">${c.today.short}</span></div>`;
  out += pban(`${icon('pin')} ${T('Crew status: job at stop 4 since 9:11 am', 'Estado: trabajo en parada 4 desde 9:11 am')}`, 'info');
  out += h.card({ flush: true, body: `<div class="li">${K.roster.map((n, i) => `<div class="li-i" style="min-height:52px"><button type="button" class="icon-btn" data-ui="tsel.${i}" data-val="${sel[i] ? 'false' : 'true'}" aria-pressed="${sel[i]}" aria-label="Select">${icon(sel[i] ? 'check' : 'user')}</button><div class="grow"><div class="tt">${esc(n)}${n === K.crew.lead ? ' (' + T('lead', 'líder') + ')' : ''}</div><div class="ss">${stOf(i) === 'OUT' ? T('Clocked out', 'Fuera') : `${f1(2.8 - i * .1)} h ${T('today', 'hoy')} · ${T('meal by', 'comida antes de')} 11:45`}${RL.ui['tedit.' + i] ? ' · ' + T('edited with reason', 'editado con motivo') : ''}</div></div><span class="flex gap4">${tPill(c, stOf(i))}${h.btn(T('Edit', 'Editar'), { sm: true, modal: 'time-edit', val: String(i) })}</span></div>`).join('')}</div>` });
  out += `<div class="small b">${T('Switch selected to', 'Cambiar seleccionados a')}</div><div class="cols cols-3" style="gap:6px">${['DRIVE', 'JOB', 'SHOP', 'REST', 'MEAL'].map(k => h.btn(T(TST[k][0], TST[k][1]), { act: 'time-switch', val: k })).join('')}</div>`;
  out += h.card({ title: T('Crew segments today', 'Segmentos de hoy'), body: segList });
  out += h.card({ title: T('Approve crew time', 'Aprobar tiempo de la cuadrilla'), body: `<div class="small">${T('Yesterday: 2 people, 18.5 h. 1 flag: missed meal punch (Javier).', 'Ayer: 2 personas, 18.5 h. 1 aviso: falta marca de comida (Javier).')}</div>${h.btn(RL.ui['tappr'] ? T('Approved', 'Aprobado') : T('Approve day', 'Aprobar día'), { sm: true, act: 'time-approve', kind: RL.ui['tappr'] ? '' : 'primary', disabled: !!RL.ui['tappr'] })}` });
  out += sticky(bb(T('Clock out selected', 'Marcar salida a seleccionados'), { act: 'time-switch', val: 'OUT', icon: 'clock' }));
  out += '<!--side-->' + side(`${icon('eye')} What the office sees`, h.kv([['Punch mode', 'Crew-level punch from the lead device'], ['Edits', Object.keys(RL.ui).filter(k => k.startsWith('tedit.')).length + ' today, each with a reason, flagged for ' + esc(K.ops)], ['Approval', 'Lead approves first level; office can still edit (05 §4.17.1)']]) + h.note('Crew lead: time_entry RW/c within limits, timesheet.approve first level. Offline punches carry device timestamps.'));
  return out;
});
RL.act('time-switch', (el, ev, c) => { const K = crewCtx(c); let n = 0; K.roster.forEach((x, i) => { if (RL.ui['tsel.' + i] !== 'false') { RL.ui['tst.' + i] = el.dataset.val; n++; } }); RL.toast(c.tr(`${n} switched to ${TST[el.dataset.val][0]}`, `${n} cambiados a ${TST[el.dataset.val][1]}`)); });
RL.act('time-me', (el, ev, c) => { RL.ui['time.me'] = el.dataset.val; RL.toast(c.tr('Punch saved with time and location.', 'Marca guardada con hora y ubicación.')); });
RL.act('time-approve', (el, ev, c) => { RL.ui['tappr'] = 'true'; RL.toast(c.tr('Crew day approved. The office can still edit.', 'Día aprobado. La oficina aún puede editar.')); });
RL.modal('time-edit', (c, el) => {
  const K = crewCtx(c), T = c.tr, i = Number(el && el.dataset.val || 0), n = K.roster[i] || K.me;
  RL.ui['tedit.pending'] = String(i);
  return { title: T(`Edit time: ${n}`, `Editar tiempo: ${n}`), body: h.field(T('Segment', 'Segmento'), h.select([T('Clock-in 6:52 am', 'Entrada 6:52 am'), T('Rest 8:55 am', 'Descanso 8:55 am'), T('Clock-out yesterday 4:58 pm', 'Salida ayer 4:58 pm')], '')) + h.field(T('New time', 'Nueva hora'), h.input('6:45 am')) + h.field(T('Reason (required)', 'Motivo (obligatorio)'), h.select([T('Forgot to clock in', 'Olvidó marcar entrada'), T('Phone died', 'Se apagó el teléfono'), T('Worked through rest (paid)', 'Trabajó en descanso (pagado)')], '')) + h.note(T('Edits are logged with your name and reason and flagged for the office.', 'Las ediciones se guardan con tu nombre y motivo y se avisan a la oficina.')), foot: h.btn(T('Cancel', 'Cancelar'), { act: 'noop' }) + h.btn(T('Save with reason', 'Guardar con motivo'), { kind: 'primary', act: 'time-edit-save' }) };
});
RL.act('time-edit-save', (el, ev, c) => { RL.ui['tedit.' + (RL.ui['tedit.pending'] || '0')] = 'true'; RL.closeModal(); RL.toast(c.tr('Edit saved with reason. Operations sees it on the timesheet.', 'Edición guardada con motivo. Operaciones la ve en la hoja de tiempo.')); });
RL.modal('time-attest', (c) => {
  const T = c.tr, qs = [['Did you take your rest and meal breaks?', '¿Tomaste tus descansos y comida?'], ['Were you injured at work today?', '¿Te lastimaste hoy en el trabajo?'], ['Are your hours today correct?', '¿Tus horas de hoy están correctas?']];
  return { title: T('Before you clock out', 'Antes de marcar salida'), body: qs.map((q, i) => `<div class="small b">${T(q[0], q[1])}</div><div class="flex"><label class="flex small"><input type="radio" name="q${i}"${i !== 1 ? ' checked' : ''}> ${T('Yes', 'Sí')}</label><label class="flex small"><input type="radio" name="q${i}"${i === 1 ? ' checked' : ''}> No</label></div>`).join('') + h.note(T('A "No" answer goes to your supervisor, never blocks the punch.', 'Un "No" va a tu supervisor y nunca bloquea la marca.')), foot: h.btn(T('Clock out', 'Marcar salida'), { kind: 'primary', act: 'time-out' }) };
});
RL.act('time-out', (el, ev, c) => { RL.ui['time.me'] = 'OUT'; RL.closeModal(); RL.toast(c.tr('Clocked out. Attestation saved.', 'Salida marcada. Declaración guardada.')); });

// =====================================================================
// CREW APP: Messages
// =====================================================================
RL.screen('crew.messages', (c) => {
  const K = crewCtx(c), T = c.tr, tx = isOn('msg.tx', true) && c.inLens('V1');
  const ops = K.ops, off = K.office;
  const threads = [
    { id: 'office', name: T('Office', 'Oficina') + ' · ' + first(ops), last: T('Stop 6 asked for a text 20 min before.', 'La parada 6 pidió un mensaje 20 min antes.'), n: 1 },
    { id: 'crew', name: K.crew ? K.crew.name : T('Crew', 'Cuadrilla'), last: T('Gloves and water in the truck.', 'Guantes y agua en el camión.'), n: 0 },
    { id: 'all', name: T('Company announcements', 'Avisos de la empresa'), last: T('Payday is Friday.', 'El pago es el viernes.'), n: 0 },
  ];
  const cur = U('msg.th', 'office');
  const msg = (who, mine, en, es, origLang, when, extra) => {
    const showEs = c.es ? (origLang === 'es' || tx) : (origLang === 'es' && !tx);
    const text = showEs ? es : en;
    const translated = (c.es && origLang === 'en' && tx) || (!c.es && origLang === 'es' && tx);
    return `<div style="display:grid;justify-items:${mine ? 'end' : 'start'};gap:2px"><div style="max-width:86%;padding:8px 10px;border-radius:12px;font-size:.84rem;background:${mine ? 'var(--primary)' : 'var(--surface)'};color:${mine ? 'var(--on-primary)' : 'var(--text)'};border:1px solid ${mine ? 'var(--primary)' : 'var(--border)'}">${extra || ''}${esc(text)}</div><span class="tiny t3">${esc(who)} · ${when}${translated ? ' · ' + T('translated', 'traducido') : ''}</span></div>`;
  };
  const bodies = {
    office: [msg(first(ops), false, 'Rain is likely after 3 pm. Finish lawn applications before 1 pm.', 'Probable lluvia después de las 3 pm. Terminen las aplicaciones antes de la 1 pm.', 'en', '6:40 am'),
      msg(first(ops), false, 'Stop 6 asked for a text 20 minutes before you arrive.', 'La parada 6 pidió un mensaje 20 minutos antes de llegar.', 'en', '7:58 am'),
      msg(first(K.me), true, "OK, I'll text them from the app.", 'Ok, les aviso desde la app.', 'es', '8:02 am'),
      msg(first(K.me), true, 'Broken head in zone 3, sent with Spot it.', 'Cabeza rota en zona 3, la mandé con Spot it.', 'es', '9:21 am', `<span style="display:block;width:150px;margin-bottom:6px">${h.photo('lawn', { badge: 'Zona 3' })}</span>`)],
    crew: [msg(first(K.crew ? K.crew.lead : K.me), K.lead, 'Gloves and water are in the truck. Hydrate every hour.', 'Guantes y agua en el camión. Tomen agua cada hora.', 'es', '6:55 am'),
      msg(first(K.roster[1] || K.me), !K.lead, 'Got it. I take the trimmer.', 'Entendido. Yo llevo la desbrozadora.', 'es', '6:57 am')],
    all: [msg(first(off), false, 'Payday is Friday. Safety talk Monday: heat illness.', 'El pago es el viernes. Charla de seguridad el lunes: golpe de calor.', 'en', T('Yesterday', 'Ayer'))],
  };
  let out = `<div class="flex gap4">${threads.map(t => `<button type="button" class="btn sm${t.id === cur ? ' primary' : ''}" data-ui="msg.th" data-val="${t.id}">${esc(t.name)}${t.n ? ` <span class="pill warn" style="padding:0 6px">${t.n}</span>` : ''}</button>`).join('')}</div>`;
  if (c.inLens('V1')) out += `<div class="flex between">${h.toggle(T('Auto-translate', 'Traducir automáticamente'), 'msg.tx', true)}${h.tag('V1')}</div>`;
  out += `<div style="display:grid;gap:10px;padding:6px 0">${(bodies[cur] || bodies.office).join('')}</div>`;
  out += sticky(`<div class="flex nw">${h.btn(icon('camera'), { act: 'msg-photo', title: 'Photo' })}<input class="inp" placeholder="${esc(T('Message', 'Mensaje'))}" aria-label="Message" data-ui-input="msg.draft" value="${esc(U('msg.draft', ''))}">${h.btn(icon('mic'), { act: 'msg-voice', title: 'Voice' })}${h.btn(icon('send'), { kind: 'primary', act: 'msg-send', title: 'Send' })}</div>`);
  out += '<!--side-->' + side(`${icon('eye')} What the office sees`, `<div class="small">The office reads crew messages in English with the Spanish original one tap away. Glossary: "orillar" means edge, "desbrozadora" means string trimmer (05 §4.11.2).</div>` + h.note('Crew-office threads and broadcasts at MVP; auto-translate is V1. Client numbers never appear in crew chat.'));
  return out;
});
RL.act('msg-send', (el, ev, c) => { RL.ui['msg.draft'] = ''; RL.toast(c.tr('Sent. Delivers when you have signal.', 'Enviado. Se entrega cuando haya señal.')); });
RL.act('msg-photo', (el, ev, c) => { RL.toast(c.tr('Camera opened (mock).', 'Cámara abierta (simulada).')); return false; });
RL.act('msg-voice', (el, ev, c) => { RL.toast(c.tr('Voice message: 1 credit per minute for transcription.', 'Mensaje de voz: 1 crédito por minuto para transcribir.')); return false; });

// =====================================================================
// CREW APP: More, Equipment, Snow
// =====================================================================
RL.screen('crew.more', (c) => {
  const K = crewCtx(c), T = c.tr;
  const pend = isOn('crew.offline') ? 3 : 0;
  const days = [['Mon', 'Lun', 9.2], ['Tue', 'Mar', 2.8], ['Wed', 'Mié', 0], ['Thu', 'Jue', 0], ['Fri', 'Vie', 0], ['Sat', 'Sáb', 0]];
  const certs = licOf(c.D, K.me);
  let out = h.card({ title: T('My week', 'Mi semana'), body: `<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:4px;text-align:center">${days.map((d, i) => `<div style="padding:6px 0;border-radius:8px;background:${i === 1 ? 'var(--primary-soft)' : 'var(--surface-2)'}"><div class="tiny t3">${T(d[0], d[1])}</div><div class="small b num">${d[2] ? f1(d[2]) : '-'}</div></div>`).join('')}</div><div class="tiny t3">${T('Wed-Sat: weekly routes, same stops as last week.', 'Mié-Sáb: rutas semanales, mismas paradas que la semana pasada.')}</div>` });
  const items = [
    { icon: 'clock', title: K.lead ? T('Timesheets and approvals', 'Hojas de tiempo y aprobaciones') : T('My timesheet', 'Mi hoja de tiempo'), sub: K.lead ? T('1 day waiting for you', '1 día te espera') : T('This week 12.0 h', 'Esta semana 12.0 h'), go: 'crew.time', right: K.lead ? h.pill('1', 'warn') : icon('arrow-r') },
    c.access('crew.equipment').ok ? { icon: 'truck', title: T('Equipment checkout and inspection', 'Equipo e inspección'), sub: K.crew ? esc(K.crew.truck) + ' · ' + T('pre-trip inspection', 'inspección previa') : '', go: 'crew.equipment', right: icon('arrow-r') } : null,
    c.access('crew.snow').ok ? { icon: 'snow', title: T('Storm visit log', 'Registro de tormenta'), sub: c.winter ? T('Storm route active', 'Ruta de tormenta activa') : T('No storm active', 'Sin tormenta activa'), go: 'crew.snow', right: icon('arrow-r') } : null,
    { icon: 'shield', tone: 'warn', title: T('Safety: talks, SDS, incident report', 'Seguridad: charlas, SDS, incidentes'), sub: c.winter ? T('This week: cold stress and slips on ice', 'Esta semana: frío y resbalones en hielo') : T('This week: heat illness basics', 'Esta semana: golpe de calor'), act: 'more-safety', right: h.tag('V1') },
    { icon: 'key', title: T('Training and certifications', 'Capacitación y certificaciones'), sub: certs ? esc(certs) : T('No applicator license on file', 'Sin licencia de aplicador'), act: 'more-cert', right: certs ? h.pill(T('Valid', 'Vigente'), 'ok') : h.pill(T('Missing', 'Falta'), 'warn') },
    { icon: 'leaf', title: T('Plant ID and plant guide', 'Identificar plantas y guía'), sub: T('Photo to plant suggestion, care notes', 'Foto a sugerencia de planta, cuidados'), act: 'more-plant', right: h.tag('V1') },
  ].filter(Boolean);
  out += h.card({ flush: true, body: h.list(items) });
  out += h.card({ title: T('Sync and settings', 'Sincronización y ajustes'), body: meta(T('Pending changes', 'Cambios pendientes'), pend ? h.pill(pend + ' ' + T('to send', 'por enviar'), 'warn') : h.pill(T('All sent 7:41 am', 'Todo enviado 7:41 am'), 'ok'))
    + meta(T('Offline route data', 'Ruta sin conexión'), T('Today to next Tuesday, 18 MB', 'Hoy al próximo martes, 18 MB')) + meta(T('Theme', 'Tema'), T('Outdoor (high contrast)', 'Exterior (alto contraste)')) + meta(T('Text size', 'Tamaño de texto'), T('Large', 'Grande'))
    + `<div class="flex between small"><span class="t3">${T('Language', 'Idioma')}</span><span class="flex gap4">${h.btn('Español', { sm: true, set: 'lang=es', kind: c.es ? 'primary' : '' })}${h.btn('English', { sm: true, set: 'lang=en', kind: c.es ? '' : 'primary' })}</span></div>`
    + h.btn(T('Sync now', 'Sincronizar ahora'), { sm: true, act: 'more-sync', icon: 'refresh' }) });
  if (K.lead) out += h.card({ title: T('End of day', 'Fin del día'), body: `<div class="small t2">${T('Submit after every stop is done or skipped and crew time is approved.', 'Envía cuando todas las paradas estén hechas u omitidas y el tiempo aprobado.')}</div>${h.btn(T('Open end of day report', 'Abrir informe de fin de día'), { sm: true, modal: 'crew-eod', icon: 'clipboard' })}` });
  out += '<!--side-->' + side('Device and session', h.kv([['Device', 'Personal phone, PIN unlock'], ['Offline limit', '7 days; warns from day 5'], ['Signed in', esc(K.me)]]) + h.note('More holds My week, timesheets, equipment, safety, plant ID and sync (21 §5.3).'));
  return out;
});
RL.act('more-safety', (el, ev, c) => { RL.toast(c.tr('Safety hub: talk library, SDS sheets (cached offline) and incident report.', 'Centro de seguridad: charlas, hojas SDS (sin conexión) y reporte de incidentes.')); return false; });
RL.act('more-cert', (el, ev, c) => { RL.toast(c.tr('Upload a photo of your license; the office verifies it.', 'Sube una foto de tu licencia; la oficina la verifica.')); return false; });
RL.act('more-plant', (el, ev, c) => { RL.toast(c.tr('Plant ID uses the curated regional palette (V1).', 'Identificar plantas usa la paleta regional (V1).')); return false; });
RL.act('more-sync', (el, ev, c) => { RL.ui['crew.offline'] = 'false'; RL.toast(c.tr('Synced. Nothing waiting.', 'Sincronizado. Nada pendiente.')); });

const DVIR = [['Tires and wheels', 'Llantas y ruedas'], ['Lights and signals', 'Luces y direccionales'], ['Brakes', 'Frenos'], ['Hitch, chains and pins', 'Enganche, cadenas y pasadores'], ['Mirrors and glass', 'Espejos y vidrios'], ['Fluids and leaks', 'Líquidos y fugas'], ['Mower blades and guards', 'Cuchillas y protectores']];
RL.screen('crew.equipment', (c, a) => {
  const K = crewCtx(c), T = c.tr, D = c.D;
  if (!K.crew) return noCrew(c);
  const mine = D.equipment.filter(e => e.crew === K.crew.name);
  const eq = mine.length ? mine : D.equipment.slice(0, 2);
  const res = DVIR.map((d, i) => U('dvir.' + i, ''));
  const defects = res.filter(r => r === 'def').length, checked = res.filter(Boolean).length;
  const signed = RL.ui['dvir.signed'];
  let out = `<div class="flex between"><button type="button" class="btn sm ghost" data-go="crew.more">${icon('arrow-l')}${T('More', 'Más')}</button>${a && a.state === 'limit' ? h.pill(T('Plan limit: ', 'Límite: ') + esc(a.limit || ''), 'info') : ''}</div>`;
  out += h.card({ title: T('Checked out to your crew', 'Asignado a tu cuadrilla'), flush: true, body: h.list([{ icon: 'truck', title: esc(K.crew.truck), sub: T('Odometer 41,882 mi', 'Odómetro 41,882 mi'), right: h.pill(T('Out', 'Asignado'), 'ok') }].concat(eq.map(e => {
    const out2 = RL.ui['co.' + e.id] !== 'false';
    return { icon: 'wrench', tone: /overdue/.test(e.next) && !signed ? 'warn' : '', title: esc(e.name), sub: `${esc(e.meter)} · ${/overdue/.test(e.next) && !signed ? T('Inspection overdue', 'Inspección vencida') : esc(e.next === 'OK' ? T('OK', 'OK') : e.next)}`, right: h.btn(out2 ? T('Return', 'Devolver') : T('Check out', 'Sacar'), { sm: true, ui: 'co.' + e.id, val: out2 ? 'false' : 'true' }) };
  }))) });
  out += h.card({ title: `${T('Pre-trip inspection', 'Inspección previa')} · ${esc(K.crew.truck)} <span class="t3 num">${checked}/${DVIR.length}</span>`, flush: true, body: `<div class="li">${DVIR.map((d, i) => `<div class="li-i" style="min-height:48px"><span class="ico ${res[i] === 'ok' ? 'ok' : res[i] === 'def' ? 'danger' : ''}">${icon(res[i] === 'def' ? 'warn' : res[i] === 'ok' ? 'check' : 'list')}</span><div class="grow"><div class="tt">${esc(T(d[0], d[1]))}</div>${res[i] === 'def' ? `<div class="ss">${T('Defect: photo and note required', 'Defecto: foto y nota obligatorias')}</div>` : ''}</div><span class="flex gap4">${h.btn('OK', { sm: true, ui: 'dvir.' + i, val: 'ok', kind: res[i] === 'ok' ? 'primary' : '' })}${h.btn(T('Defect', 'Defecto'), { sm: true, ui: 'dvir.' + i, val: 'def', kind: res[i] === 'def' ? 'danger' : '' })}</span></div>`).join('')}</div>` });
  out += h.card({ title: T('Hour meter', 'Horómetro'), body: h.field(esc(eq[0].name), h.input(String(parseInt(eq[0].meter, 10) + 3), { ui: 'eq.hours', label: 'Hours' }), T('Last reading', 'Última lectura') + ' ' + esc(eq[0].meter)) });
  out += sticky(signed ? bb(T('Inspection signed', 'Inspección firmada'), { ghost: true, icon: 'check' }) : bb(checked < DVIR.length ? T(`Check ${DVIR.length - checked} more items`, `Faltan ${DVIR.length - checked} puntos`) : T('Sign inspection', 'Firmar inspección'), { act: 'dvir-sign', icon: 'pen', disabled: checked < DVIR.length }));
  out += '<!--side-->' + side(`${icon('eye')} What the office sees`, h.kv([['Inspection', signed ? `Signed by ${esc(first(K.me))}` : `${checked} of ${DVIR.length} items`], ['Defects', defects ? `<b style="color:var(--danger-text)">${defects}: work order drafted</b>` : 'None'], ['Asset cost', h.mask(c, 'cost', money(11400))]]) + h.note('A defect creates a maintenance work order and can mark the asset down (13). Crew lead: equipment RW/c inspections and hours; technician W/c inspections.'));
  return out;
});
RL.act('dvir-sign', (el, ev, c) => { const defects = DVIR.filter((d, i) => RL.ui['dvir.' + i] === 'def').length; RL.ui['dvir.signed'] = 'true'; RL.toast(defects ? c.tr(`Signed with ${defects} defect. The shop got a work order.`, `Firmada con ${defects} defecto. El taller recibió una orden.`) : c.tr('Inspection signed. Safe to roll.', 'Inspección firmada. Listo para salir.')); });

RL.screen('crew.snow', (c) => {
  const K = crewCtx(c), T = c.tr;
  if (!K.crew) return noCrew(c);
  const sites = stormSites(c, K);
  if (!c.winter) {
    const past = [['Mar 4', '2.2 in', 7], ['Feb 16', '6.3 in', 8], ['Jan 12', '3.5 in', 8]];
    return h.card({ title: `${icon('snow')} ${T('No storm active', 'Sin tormenta activa')}`, body: `<div class="small t2">${T('Storm mode starts when the office creates storm visits for your snow sites. They show up in Today in priority order.', 'El modo tormenta empieza cuando la oficina crea visitas de tormenta. Aparecen en Hoy por prioridad.')}</div>` })
      + h.card({ title: T('Snow sites for your crew', 'Sitios de nieve de tu cuadrilla'), flush: true, body: h.list(sites.map(s => ({ icon: 'pin', title: `P${s.pri} · ${esc(s.client)}`, sub: esc(s.address), right: h.pill(s.com ? T('Lot + walks', 'Lote + aceras') : T('Drive + walks', 'Entrada + aceras'), '') }))) })
      + h.card({ title: T('Last season', 'Temporada pasada'), flush: true, body: h.list(past.map(p => ({ icon: 'snow', title: `${p[0]} · ${p[1]}`, sub: `${p[2]} ${T('sites logged with photos', 'sitios registrados con fotos')}`, right: h.pill(T('Logged', 'Registrado'), 'ok') }))) })
      + '<!--side-->' + side('Snow Lite (14 §4.3.0)', '<div class="small">Included on every plan at no charge. Storm visit logs with timestamped GPS photos, a priority-ordered site list, per-push and per-application invoices and a per-site proof-of-service PDF.</div>' + (c.has('snow_ice') ? h.note('This Company also has the Snow and Ice add-on: triggers, depth and proof packets arrive with the full module (V1).') : ''));
  }
  const s = sites.find(x => x.id === c.x) || sites.find(x => x.status === 'In progress') || sites[0];
  const arrived = s.status !== 'Scheduled' && s.status !== 'En route' || RL.ui['snow.in.' + s.id];
  const left = s.status === 'Done';
  const ctr = (k, en, es) => `<div class="cd" style="padding:10px;display:grid;gap:6px;justify-items:center"><span class="tiny t3">${T(en, es)}</span><b style="font-size:1.5rem" class="num">${s.counts[k]}</b><span class="flex gap4">${h.btn('-', { sm: true, act: 'snow-inc', val: s.id + ':' + k + ':-1', disabled: left || !arrived })}${h.btn('+', { sm: true, kind: 'primary', act: 'snow-inc', val: s.id + ':' + k + ':1', disabled: left || !arrived })}</span></div>`;
  let out = `<div class="flex between"><button type="button" class="btn sm ghost" data-go="crew.today">${icon('arrow-l')}${T('Storm route', 'Ruta de tormenta')}</button>${h.pill('P' + s.pri, s.pri === 1 ? 'danger' : 'warn')}</div>`;
  out += `<div class="cd" style="padding:11px 12px;display:grid;gap:4px"><div class="flex nw"><div class="grow"><b style="display:block">${esc(s.client)}</b><span class="tiny t3">${esc(s.address)}</span></div>${stPill(c, s.status)}</div><div class="small t2">${esc(T(s.svc[0], s.svc[1]))}</div><div class="tiny t3">${T('Storm Jan 12 · 3.5 in since 1:10 am · last served Jan 3', 'Tormenta 12 ene · 3.5 in desde 1:10 am · último servicio 3 ene')}</div></div>`;
  out += `<div class="cols cols-2" style="gap:8px">${arrived ? `<div class="cd" style="padding:9px;text-align:center"><span class="tiny t3">${T('Arrived', 'Llegada')}</span><div class="b num">${t12(s.start)}</div></div>` : bb(T('Arrive', 'Llegar'), { act: 'snow-arrive', val: s.id, icon: 'pin' })}${left ? `<div class="cd" style="padding:9px;text-align:center"><span class="tiny t3">${T('Departed', 'Salida')}</span><div class="b num">${t12(s.out)}</div></div>` : `<div class="cd" style="padding:9px;text-align:center"><span class="tiny t3">${T('On site', 'En sitio')}</span><div class="b num">${arrived ? '0:32' : '-'}</div></div>`}</div>`;
  out += `<div class="cols cols-3" style="gap:6px">${ctr('push', 'Pushes', 'Despejes')}${ctr('salt', 'Salt', 'Sal')}${ctr('walks', 'Walks', 'Aceras')}</div>`;
  const nPh = Number(U('snow.ph.' + s.id, left ? 2 : 1));
  out += h.card({ title: `${T('Photos with time and GPS', 'Fotos con hora y GPS')} <span class="t3 num">${nPh}</span>`, body: `<div class="cols cols-2" style="gap:6px">${Array.from({ length: Math.min(nPh, 4) }, (_, i) => h.photo('snow', { badge: `${t12(s.start + 6 + i * 9).toUpperCase()} · 39.98${i}, -83.04${i}` })).join('')}</div>${left ? '' : h.btn(T('Take photo', 'Tomar foto'), { sm: true, act: 'snow-photo', val: s.id, icon: 'camera' })}` });
  out += h.card({ title: T('Notes', 'Notas'), body: h.textarea(U('snow.note.' + s.id, ''), { ui: 'snow.note.' + s.id, ph: T('Drifting at the east entrance; walks re-salted.', 'Acumulación en la entrada este; aceras con sal otra vez.'), label: 'Notes' }) + `<div class="tiny t3">${T('Works offline. Logs and photos sync with device and server time.', 'Funciona sin señal. Registros y fotos se sincronizan con hora del equipo y del servidor.')}</div>` });
  out += sticky(left ? bb(T('Site logged', 'Sitio registrado'), { ghost: true, icon: 'check', go: 'crew.today' }) : bb(T('Depart and log site', 'Salir y registrar sitio'), { act: 'snow-depart', val: s.id, icon: 'check', disabled: !arrived }));
  out += '<!--side-->' + side(`${icon('eye')} What the office sees`, h.kv([['Site', `P${s.pri} · ${esc(s.client)}`], ['Counts', `${s.counts.push} push · ${s.counts.salt} salt · ${s.counts.walks} walks`], ['Invoice lines', `Per push and per application at Price Book rates: ${h.mask(c, 'price', money(165))}`], ['Proof of service', 'Per-site PDF: times, crew, counts, GPS photos, notes']]) + h.note('Snow Lite writes ordinary Visits and Billable Items; no storm_event or proof_packet records (14 §4.3.0). The client sees these visits in portal history.'));
  return out;
});
RL.act('snow-inc', (el, ev) => { const p = String(el.dataset.val).split(':'); const k = 'snow.' + p[1] + '.' + p[0]; RL.ui[k] = String(Math.max(-3, Number(RL.ui[k] || 0) + Number(p[2]))); });
RL.act('snow-arrive', (el, ev, c) => { RL.ui['snow.in.' + el.dataset.val] = 'true'; RL.toast(c.tr('Arrival logged with GPS.', 'Llegada registrada con GPS.')); });
RL.act('snow-photo', (el, ev, c) => { const k = 'snow.ph.' + el.dataset.val; RL.ui[k] = String(Number(RL.ui[k] || 1) + 1); });
RL.act('snow-depart', (el, ev, c) => { RL.ui['snow.out.' + el.dataset.val] = 'true'; RL.toast(c.tr('Site logged. Next site is on your route.', 'Sitio registrado. El siguiente sitio está en tu ruta.')); });

// =====================================================================
// MANAGER MODE (V1, 21 §5.3)
// =====================================================================
RL.screen('crew.manager', (c) => {
  const D = c.D, T = c.tr, k = D.kpi, tab = h.tab('mgr.tab', 'today');
  const crew0 = D.crews[0], lead0 = crew0 ? crew0.lead : 'Crew lead';
  const noLic = crew0 && !licOf(D, lead0) && D.visits.some(v => v.crewId === crew0.id && chemKey(v.service));
  const dvir = D.equipment.find(e => /DVIR overdue/.test(e.next));
  const canTime = c.allowed('timesheet.approve'), canDispatch = c.allowed('visit.dispatch');
  let out = wrap(h.tabs('mgr.tab', [['today', T('Today', 'Hoy')], ['approve', T('Approvals', 'Aprobar'), canTime ? 3 : 1], ['capture', T('Capture', 'Capturar')]], 'today'));
  if (tab === 'today') {
    out += `<div class="kpis" style="grid-template-columns:repeat(2,minmax(0,1fr))">${[
      { l: T('Visits done', 'Visitas hechas'), v: `${k.visitsDone} / ${k.visitsToday}` }, { l: T('Crews out', 'Cuadrillas fuera'), v: k.crewsOut },
      { l: T('Labor efficiency', 'Eficiencia'), v: k.laborEff + '%' }, { l: T('Revenue this month', 'Ingresos del mes'), v: h.mask(c, 'price', h.kmoney(k.revenueMTD)) },
      { l: T('Gross margin', 'Margen bruto'), v: h.mask(c, 'margin', k.gm + '%') }, { l: T('Autopay clients', 'Clientes con autopago'), v: k.autopayPct + '%' },
    ].map(x => `<div class="kp"><span class="l">${x.l}</span><span class="v" style="font-size:1.1rem">${x.v}</span></div>`).join('')}</div>`;
    const alerts = [
      noLic ? { icon: 'flask', tone: 'danger', title: T(`Chemical record flagged: ${lead0} has no applicator license`, `Registro químico marcado: ${lead0} sin licencia`), sub: T(`${crew0.name} · lawn program stops today`, `${crew0.name} · paradas de programa hoy`) } : null,
      crew0 ? { icon: 'clock', tone: 'warn', title: T(`${crew0.name} 0.3 h over budget at stop 4`, `${crew0.name} 0.3 h sobre presupuesto en parada 4`), sub: T('Hours vs budget, live from the crew app', 'Horas vs presupuesto, en vivo') } : null,
      dvir ? { icon: 'truck', tone: 'warn', title: T(`Inspection overdue: ${dvir.name}`, `Inspección vencida: ${dvir.name}`), sub: esc(dvir.crew) } : null,
      { icon: 'rain', tone: 'info', title: T('Rain 60% after 3 pm', 'Lluvia 60% después de las 3 pm'), sub: T('Lawn applications should finish by 1 pm', 'Aplicaciones deben terminar a la 1 pm') },
    ].filter(Boolean);
    out += h.card({ title: T('Alerts', 'Alertas'), flush: true, body: h.list(alerts) });
    const un = [{ id: 'V-60101', t: T('Irrigation repair, zone 2 leak', 'Reparación de riego, fuga zona 2'), a: (D.clients[5] || D.clients[0]).address }, { id: 'V-60102', t: T('Bed edging, front walk', 'Orillado, camino del frente'), a: (D.clients[8] || D.clients[0]).address }];
    out += h.card({ title: T('Quick reassign', 'Reasignar rápido'), body: canDispatch && D.crews.length ? un.map(u => `<div style="display:grid;gap:4px;padding:6px 0;border-bottom:1px solid var(--border)"><div class="small b">${esc(u.t)}</div><div class="tiny t3">${esc(u.a)} · ${T('unassigned', 'sin asignar')}</div><div class="flex nw">${h.select(D.crews.slice(0, 5).map(cr => [cr.id, cr.name]), U('mgr.re.' + u.id, D.crews[1 % D.crews.length].id), { ui: 'mgr.re.' + u.id, label: 'Crew' })}${h.btn(RL.ui['mgr.did.' + u.id] ? T('Assigned', 'Asignada') : T('Assign', 'Asignar'), { sm: true, kind: 'primary', act: 'mgr-assign', val: u.id, disabled: !!RL.ui['mgr.did.' + u.id] })}</div></div>`).join('') : `<div class="small t2">${T('Dispatch is not part of your role. You can view crews and stops.', 'Despachar no es parte de tu rol. Puedes ver cuadrillas y paradas.')}</div>` });
  } else if (tab === 'approve') {
    const items = [
      canTime ? { id: 'ap1', icon: 'clock', title: T('Time edit: Javier, clock-in 6:45 am', 'Edición de tiempo: Javier, entrada 6:45 am'), sub: T('Reason: phone died. Edited by crew lead.', 'Motivo: se apagó el teléfono. Editado por el líder.') } : null,
      canTime ? { id: 'ap2', icon: 'calendar', title: T('Time off: Fri May 21', 'Permiso: vie 21 may'), sub: T('1 day, crew covered', '1 día, cuadrilla cubierta') } : null,
      { id: 'ap3', icon: 'camera', title: T('Spot it: broken rotor head, zone 3', 'Spot it: rotor roto, zona 3'), sub: T('From the crew, photos and pin attached. Price it as an estimate.', 'De la cuadrilla, con fotos y pin. Cotizar como estimado.') },
      c.allowed('change_order') ? { id: 'ap4', icon: 'pen', title: T('Change order draft from the field', 'Borrador de orden de cambio'), sub: T('Add 2 yd mulch to back beds. Crew drafts have no price; you add it.', 'Agregar 2 yd de mantillo. La cuadrilla no pone precio; tú lo agregas.') } : null,
    ].filter(Boolean);
    out += h.card({ flush: true, body: `<div class="li">${items.map(i => `<div class="li-i"><span class="ico ${RL.ui['mgr.ap.' + i.id] ? 'ok' : 'warn'}">${icon(RL.ui['mgr.ap.' + i.id] ? 'check' : i.icon)}</span><div class="grow"><div class="tt">${i.title}</div><div class="ss">${i.sub}</div></div><span class="flex gap4">${RL.ui['mgr.ap.' + i.id] ? h.pill(T('Done', 'Hecho'), 'ok') : h.btn(T('Approve', 'Aprobar'), { sm: true, kind: 'primary', act: 'mgr-ap', val: i.id })}</span></div>`).join('')}</div>` });
    if (!canTime) out += `<div class="tiny t3">${T('Timesheet approvals go to operations and the office; they are not part of your role.', 'Las aprobaciones de tiempo van a operaciones y oficina; no son parte de tu rol.')}</div>`;
  } else {
    const cl = D.clients.find(x => x.type === 'residential' && !x.hero) || D.clients[0];
    const steps = Number(U('mgr.cap', '1'));
    out += h.card({ title: T('Site assessment', 'Evaluación del sitio'), sub: esc(cl.name) + ' · ' + esc(cl.address), body: h.steps([T('Photos', 'Fotos'), T('Measure', 'Medir'), T('Notes', 'Notas'), T('Send', 'Enviar')], steps)
      + `<div class="cols cols-3" style="gap:5px">${h.photo('before', { badge: 'Front' })}${h.photo('bed', { badge: 'Beds' })}${h.photo('lawn', { badge: 'Back' })}</div>`
      + meta(T('Front lawn (satellite measure)', 'Césped frente (medido por satélite)'), '3,240 ft²') + meta(T('Back lawn', 'Césped atrás'), '5,110 ft²') + meta(T('Beds', 'Camas'), '640 ft²')
      + h.textarea(U('mgr.note', 'Wants a paver patio off the back door, about 16 x 20 ft. Slope drains toward the house.'), { ui: 'mgr.note', label: 'Notes' }) });
    out += h.aiCard({ agent: 'A6 Estimating from notes', level: 'L2', credits: 8, title: T('Draft an estimate from this assessment', 'Borrador de estimado con esta evaluación'), body: T('Uses your photos, measurements and notes. Creates a draft only; a person reviews before anything is sent.', 'Usa fotos, medidas y notas. Solo crea un borrador; una persona lo revisa antes de enviar.'), actions: h.btn(T('Draft estimate (8 cr)', 'Borrador (8 cr)'), { kind: 'ai', sm: true, act: 'mgr-draft' }) });
    out += bb(T('Save assessment', 'Guardar evaluación'), { act: 'mgr-cap', icon: 'check' });
  }
  out += '<!--side-->' + side(`Manager mode for ${esc(c.roleObj.name)}`, h.list([
    { icon: 'approve', tone: canTime ? 'ok' : '', title: 'Time approvals', sub: canTime ? 'Yes (timesheet.approve = ' + esc(c.can('timesheet.approve')) + ')' : 'Not in this role' },
    { icon: 'route', tone: canDispatch ? 'ok' : '', title: 'Quick reassign', sub: canDispatch ? 'Yes (visit.dispatch = ' + esc(c.can('visit.dispatch')) + ')' : 'Not in this role' },
    { icon: 'camera', tone: 'ok', title: 'Site assessment capture', sub: 'site_assessment = ' + esc(c.can('site_assessment')) },
    { icon: 'dollar', tone: c.sees('margin') ? 'ok' : '', title: 'Margin KPI', sub: c.sees('margin') ? 'Visible' : 'Masked for this role (02 §10.2)' },
  ]) + h.note('Manager mode replaces the crew tab bar for owner, ops manager, estimator and office manager on a phone (21 §5.3).'));
  return out;
});
RL.act('mgr-assign', (el, ev, c) => { RL.ui['mgr.did.' + el.dataset.val] = 'true'; RL.toast(c.tr('Visit assigned. The crew sees it at the next sync.', 'Visita asignada. La cuadrilla la ve en la próxima sincronización.')); });
RL.act('mgr-ap', (el, ev, c) => { RL.ui['mgr.ap.' + el.dataset.val] = 'true'; RL.toast(c.tr('Approved.', 'Aprobado.')); });
RL.act('mgr-draft', (el, ev, c) => { RL.toast(c.tr('Draft estimate created (8 credits). It waits for your review in Sales.', 'Borrador creado (8 créditos). Espera tu revisión en Ventas.')); return false; });
RL.act('mgr-cap', (el, ev, c) => { RL.ui['mgr.cap'] = '3'; RL.toast(c.tr('Assessment saved to the client record.', 'Evaluación guardada en el cliente.')); });

// =====================================================================
// SHOP KIOSK (V1, 02 §7.4)
// =====================================================================
RL.screen('crew.kiosk', (c) => {
  const D = c.D, T = c.tr, W = c.winter;
  const field = D.people.filter(p => p.seat === 'field' && p.status === 'active').slice(0, 12);
  if (!field.length) return noCrew(c);
  const who = RL.ui['kiosk.who'], pin = String(U('kiosk.pin', ''));
  const P = field.find(p => p.name === who);
  const talk = W ? ['Cold stress and slips on ice', 'Estrés por frío y resbalones en hielo'] : ['Heat illness prevention', 'Prevención de golpe de calor'];
  const acks = field.map((p, i) => i % 3 !== 2 || RL.ui['kiosk.ack.' + p.name] === 'true');
  const crewOf = p => (p.name === (c.t.cast || {}).technician && D.crews[0]) || D.crews.find(cr => cr.lead === p.name || cr.members.includes(p.name)) || D.crews[0] || { name: '-', truck: '-' };
  const tile = (p, i) => `<button type="button" data-act="kiosk-who" data-val="${esc(p.name)}" style="border:2px solid ${p.name === who ? 'var(--primary)' : 'var(--border)'};background:var(--surface);border-radius:14px;padding:12px 6px;display:grid;justify-items:center;gap:6px;cursor:pointer;min-height:118px"><span class="av c${i % 5 + 1}" style="width:54px;height:54px;font-size:1rem">${esc(h.initials(p.name))}</span><b class="small" style="line-height:1.2;text-align:center">${esc(p.name)}</b><span class="tiny t3">${esc(crewOf(p).name)}</span></button>`;
  const key = d => `<button type="button" data-act="kiosk-key" data-val="${d}" style="min-height:58px;border-radius:12px;border:1px solid var(--border-strong);background:var(--surface);font-size:1.35rem;font-weight:750;cursor:pointer">${d === 'del' ? icon('arrow-l') : d === 'ok' ? 'OK' : d}</button>`;
  let right;
  if (!P) {
    right = h.card({ title: T("Today's crews", 'Cuadrillas de hoy'), flush: true, body: h.list(D.crews.slice(0, 6).map(cr => { const first0 = D.visits.find(v => v.crewId === cr.id); return { icon: 'truck', title: `${esc(cr.name)} · ${esc(cr.truck)}`, sub: `${esc([cr.lead].concat(cr.members).map(first).join(', '))}${first0 ? ' · ' + T('first stop', 'primera parada') + ' ' + esc(first0.address) : ''}`, right: h.pill(T('Out 7:05', 'Sale 7:05'), '') }; })) })
      + h.card({ title: `${icon('shield')} ${T('Tailgate talk', 'Charla de seguridad')}: ${T(talk[0], talk[1])}`, body: h.progress(acks.filter(Boolean).length, acks.length) + `<div class="tiny t3">${acks.filter(Boolean).length} ${T('of', 'de')} ${acks.length} ${T('acknowledged. Tap your photo, enter your PIN, then acknowledge.', 'confirmaron. Toca tu foto, pon tu PIN y confirma.')}</div>` });
  } else if (pin.length < 4) {
    right = `<div class="cd" style="padding:16px;display:grid;gap:12px;justify-items:center"><div class="flex nw">${h.avatar(P.name)}<b>${T('Hi', 'Hola')}, ${esc(first(P.name))}</b></div><div class="small t2">${T('Enter your PIN', 'Ingresa tu PIN')}</div><div class="flex">${[0, 1, 2, 3].map(i => `<span style="width:18px;height:18px;border-radius:50%;border:2px solid var(--text-2);background:${i < pin.length ? 'var(--text)' : 'transparent'}"></span>`).join('')}</div>
      <div style="display:grid;grid-template-columns:repeat(3,72px);gap:8px">${['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'ok'].map(key).join('')}</div>
      <div class="flex">${h.btn(T('Not you?', '¿No eres tú?'), { sm: true, act: 'kiosk-done' })}<span class="tiny t3">${T('5 wrong tries locks the PIN for 5 minutes.', '5 intentos fallidos bloquean el PIN 5 minutos.')}</span></div></div>`;
  } else {
    const cr = crewOf(P), st = U('kiosk.st.' + P.name, '');
    const ack = RL.ui['kiosk.ack.' + P.name] === 'true' || acks[field.indexOf(P)];
    right = `<div class="cd" style="padding:14px;display:grid;gap:10px"><div class="flex between"><div class="flex nw">${h.avatar(P.name)}<b>${T('Hi', 'Hola')}, ${esc(first(P.name))}</b></div>${st ? h.pill(T(st === 'in' ? 'Clocked in 6:44 am' : st === 'brk' ? 'On break' : st === 'sw' ? 'Switched job' : 'Clocked out', st === 'in' ? 'Entrada 6:44 am' : st === 'brk' ? 'En descanso' : st === 'sw' ? 'Cambio de trabajo' : 'Salida'), 'ok') : ''}</div>
      <div class="cols cols-2" style="gap:8px">${[['in', 'Clock in', 'Entrada', 'play'], ['brk', 'Break', 'Descanso', 'pause'], ['sw', 'Switch job', 'Cambiar trabajo', 'refresh'], ['out', 'Clock out', 'Salida', 'clock']].map(b => `<button type="button" class="btn${b[0] === 'in' ? ' primary' : ''}" data-act="kiosk-punch" data-val="${b[0]}" style="min-height:56px;justify-content:center;font-size:1rem">${icon(b[3])}${T(b[1], b[2])}</button>`).join('')}</div>
      ${h.card({ title: T('Your assignment today', 'Tu asignación hoy'), body: meta(T('Crew', 'Cuadrilla'), esc(cr.name)) + meta(T('Truck', 'Camión'), esc(cr.truck)) + meta(T('Lead', 'Líder'), esc(cr.lead)) + meta(T('Leaves the yard', 'Sale del patio'), '7:05 am') })}
      ${h.card({ title: `${icon('shield')} ${T(talk[0], talk[1])}`, body: `<div class="small t2">${W ? T('Walk like a penguin on ice, three points of contact on trucks, layers you can remove.', 'Camina como pingüino en el hielo, tres puntos de apoyo en camiones, ropa en capas.') : T('Drink water every 15 minutes, rest in the shade, watch new crew members (first 2 weeks).', 'Toma agua cada 15 minutos, descansa en la sombra, cuida a los nuevos (primeras 2 semanas).')}</div>${ack ? h.pill(T('Acknowledged', 'Confirmado'), 'ok', 'check') : h.btn(T('I attended this talk', 'Asistí a esta charla'), { kind: 'primary', ui: 'kiosk.ack.' + P.name, val: 'true' })}` })}
      ${h.btn(T('Done', 'Listo'), { act: 'kiosk-done' })}</div>`;
  }
  return `<div class="flex between"><div><h1 style="font-family:var(--font-display);font-size:1.5rem">${esc(c.t.name)} · ${T(esc(c.t.branches[0]) + ' yard', 'Taller ' + esc(c.t.branches[0]))}</h1><div class="small t2">${c.today.label} · ${W ? '4:52 am' : '6:44 am'} · ${T('Shop kiosk', 'Kiosco del taller')} ${h.tag('V1')}</div></div><span class="flex">${h.btn('EN', { sm: true, set: 'lang=en', kind: c.es ? '' : 'primary' })}${h.btn('ES', { sm: true, set: 'lang=es', kind: c.es ? 'primary' : '' })}<button type="button" class="btn danger" data-act="kiosk-sos">${icon('warn')}${T('Emergency', 'Emergencia')}</button></span></div>`
    + `<div class="cols cols-21"><div class="stack12"><b>${T('Who are you?', '¿Quién eres?')}</b><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:10px">${field.map(tile).join('')}</div>`
    + h.card({ title: `${icon('mega')} ${T('Announcements', 'Avisos')}`, body: `<div class="small">${W ? T('Storm shift pay applies tonight. Salt yard is open 24 h.', 'Pago de turno de tormenta aplica esta noche. El patio de sal abre 24 h.') : T('Payday Friday. Truck 15 is in the shop; Maintenance 2 takes Truck 21.', 'Pago el viernes. El camión 15 está en el taller; Mantenimiento 2 usa el camión 21.')}</div>` })
    + `</div><div class="stack12">${right}</div></div>`
    + h.note('Kiosk shows no client data except today\'s assignments. PIN per punch; optional punch photo; works offline against hashed PINs (05 §4.0.2, 02 §7.4).');
});
RL.act('kiosk-key', (el, ev, c) => {
  const d = el.dataset.val, p = String(RL.ui['kiosk.pin'] || '');
  if (d === 'del') RL.ui['kiosk.pin'] = p.slice(0, -1);
  else if (d === 'ok') { if (p.length < 4) { RL.toast(c.tr('Enter 4 digits.', 'Ingresa 4 dígitos.')); return false; } }
  else if (p.length < 4) RL.ui['kiosk.pin'] = p + d;
});
RL.act('kiosk-punch', (el, ev, c) => { RL.ui['kiosk.st.' + RL.ui['kiosk.who']] = el.dataset.val; RL.toast(c.tr('Punch saved.', 'Marca guardada.')); });
RL.act('kiosk-who', (el) => { RL.ui['kiosk.who'] = el.dataset.val; RL.ui['kiosk.pin'] = ''; });
RL.act('kiosk-done', () => { RL.ui['kiosk.who'] = ''; RL.ui['kiosk.pin'] = ''; });
RL.act('kiosk-sos', (el, ev, c) => { RL.toast(c.tr('Emergency: calling 911 and alerting the safety contact. No PIN needed.', 'Emergencia: llamando al 911 y avisando al contacto de seguridad. Sin PIN.')); return false; });

// =====================================================================
// SUBCONTRACTOR LITE (02 §3.3.9, §5.12; 21 §5.3)
// =====================================================================
const SO_FLOW = ['Offered', 'Accepted', 'Scheduled', 'In progress', 'Complete', 'Invoiced', 'Paid'];
function subCtx(c) {
  const D = c.D, T = c.tr, W = c.winter;
  const vend = (D.vendors.find(v => v.category === 'Subcontractor') || { name: 'Dobbs Irrigation' }).name;
  const trade = /irrig/i.test(vend) ? 'irr' : /hardscape|paver/i.test(vend) ? 'hard' : 'gen';
  const tpl = {
    irr: [[W ? 'Spring start-up, 12 zones (standing order)' : 'Start-up and backflow test, 12 zones', 185, 'Offered'], ['Backflow preventer repair: replace cracked bonnet', 340, 'Scheduled'], ['Zone 4 leak: replace 2 rotors and swing joint', 260, 'Complete'], ['Controller swap to smart controller', 420, 'Invoiced'], ['Winterization blowout, 9 zones', 95, 'Paid']],
    hard: [['Paver patio install, 420 ft², with seat wall (sheet A2)', 14800, 'Offered'], ['Retaining wall repair, 18 ft', 2250, 'Scheduled'], ['Flagstone path, 60 ft', 3100, 'Complete'], ['Fire pit kit install', 1450, 'Invoiced'], ['Paver walkway reset', 980, 'Paid']],
    gen: [['Tree removal, 2 dead ash', 1600, 'Offered'], ['Stump grinding, 3 stumps', 450, 'Scheduled'], ['Crane lift for boulder set', 900, 'Complete'], ['Hedge removal', 700, 'Invoiced'], ['Storm cleanup', 520, 'Paid']],
  }[trade];
  const dates = W ? [['Apr 12', '8:00-12:00'], ['Jan 12', '10:00-2:00'], ['Jan 8', ''], ['Dec 14', ''], ['Nov 3', '']] : [['May 13', '8:00-12:00'], ['May 11', '10:00-2:00'], ['May 7', ''], ['Apr 29', ''], ['Apr 20', '']];
  const props = D.properties.length ? D.properties : [{ address: '1 Main St', gate: null }];
  const orders = tpl.map((t, i) => {
    const id = 'SO-' + (4412 - i * 3), p = trade === 'hard' && i === 0 && D.res.property ? { address: D.res.property, gate: (D.properties.find(x => x.client === D.res.clientId) || {}).gate } : props[(i * 3 + 2) % props.length];
    const status = RL.ui['so.st.' + id] || t[2];
    return { id, scope: t[0], amount: t[1], status, base: t[2], addr: p.address, gate: p.gate || 'Lockbox 2814', date: dates[i][0], window: dates[i][1], po: 'PO-' + (3311 + i * 4), today: i === 1 };
  });
  return { D, vend, trade, orders, terms: 'Net 15', who: strip(c.who) === c.roleObj.name ? vend : strip(c.who) };
}
const soPill = (c, s) => h.pill(c.tr(s, { Offered: 'Ofrecida', Accepted: 'Aceptada', Scheduled: 'Programada', 'In progress': 'En curso', Complete: 'Completa', Invoiced: 'Facturada', Paid: 'Pagada', Declined: 'Rechazada' }[s] || s), { Offered: 'warn', Scheduled: 'info', 'In progress': 'info', Complete: 'ok', Invoiced: 'ai', Paid: 'ok', Declined: 'danger' }[s] || '');
RL.screen('sub.orders', (c) => {
  const S = subCtx(c), T = c.tr, tab = h.tab('so.tab', 'open');
  const open = S.orders.filter(o => !['Invoiced', 'Paid', 'Declined'].includes(o.status)), done = S.orders.filter(o => ['Invoiced', 'Paid', 'Declined'].includes(o.status));
  const list = tab === 'open' ? open : done;
  let out = `<div><b>${T('My work orders', 'Mis órdenes')}</b><div class="tiny t3">${esc(S.who)} · ${T('only orders assigned to your company', 'solo órdenes asignadas a tu empresa')}</div></div>`;
  out += pban(`${icon('shield')} ${T('Certificate of insurance valid to Mar 31, 2028. W-9 on file.', 'Seguro vigente hasta 31 mar 2028. W-9 en archivo.')}`, 'info');
  const offered = open.filter(o => o.status === 'Offered');
  if (offered.length) out += `<div class="cd warn" style="padding:10px 12px;display:grid;gap:6px"><b class="small">${offered.length} ${T('new order waiting for you', 'orden nueva te espera')}</b>${h.btn(T('Accept all in one tap', 'Aceptar todas'), { kind: 'primary', act: 'so-accept-all' })}</div>`;
  out += wrap(h.tabs('so.tab', [['open', T('Open', 'Abiertas'), open.length], ['done', T('Billed and paid', 'Facturadas y pagadas'), done.length]], 'open'));
  out += list.map(o => `<div class="cd" style="padding:10px 12px;display:grid;gap:5px" data-go="sub.order" data-x="${o.id}" role="button" tabindex="0"><div class="flex nw"><span class="mono tiny t3">${o.id}</span><span class="grow"></span>${soPill(c, o.status)}</div><b class="small" style="line-height:1.3">${esc(o.scope)}</b><div class="tiny t3">${icon('pin', 's')} ${esc(o.addr)}</div><div class="flex between tiny"><span>${o.window ? `${esc(o.date)} · ${esc(o.window)}` : esc(o.date)}</span><span class="b num">${T('Your PO', 'Tu PO')} ${money(o.amount)}</span></div>${o.today && ['Scheduled', 'In progress'].includes(o.status) ? h.pill(T('Today: access info opens at check-in', 'Hoy: el acceso se abre al registrar llegada'), 'info', 'key') : ''}</div>`).join('') || h.empty(T('Nothing here.', 'Nada aquí.'));
  out += '<!--side-->' + side('What subcontractors never see', h.list([{ icon: 'eye-off', title: 'The Company\'s sell price', sub: 'Only your own PO amount and terms.' }, { icon: 'eye-off', title: 'Client legal name and billing', sub: 'Site address and a masked on-site contact only.' }, { icon: 'eye-off', title: 'Other subs and other properties', sub: 'Access ends 7 days after completion.' }]) + h.note('Subcontractor: subcontract_order RWX/o accept and complete; bill W/o submit own (02 §5.12).'));
  return out;
});
RL.act('so-accept-all', (el, ev, c) => { subCtx(c).orders.filter(o => o.status === 'Offered').forEach(o => { RL.ui['so.st.' + o.id] = 'Accepted'; }); RL.toast(c.tr('Accepted. The Company sees it on the dispatch board.', 'Aceptadas. La empresa lo ve en despacho.')); });
RL.screen('sub.order', (c) => {
  const S = subCtx(c), T = c.tr;
  const o = S.orders.find(x => x.id === c.x) || S.orders.find(x => x.status === 'Scheduled') || S.orders[0];
  const idx = SO_FLOW.indexOf(o.status);
  const inWin = o.today && ['Scheduled', 'In progress'].includes(o.status);
  const checked = RL.ui['so.in.' + o.id] === 'true' || o.status === 'In progress';
  const nPh = Number(U('so.ph.' + o.id, ['Complete', 'Invoiced', 'Paid'].includes(o.status) ? 3 : 0));
  const mats = Number(U('so.mat.' + o.id, ['Complete', 'Invoiced', 'Paid'].includes(o.status) ? 2 : 0));
  const prop = RL.ui['so.prop.' + o.id];
  let out = `<div class="flex between"><button type="button" class="btn sm ghost" data-go="sub.orders">${icon('arrow-l')}${T('Orders', 'Órdenes')}</button>${soPill(c, o.status)}</div>`;
  out += `<div><span class="mono tiny t3">${o.id}</span><div class="b" style="line-height:1.3">${esc(o.scope)}</div></div>`;
  out += o.status === 'Declined' ? h.pill(T('Declined', 'Rechazada'), 'danger') : h.steps(['Accept', 'Schedule', 'Work', 'Complete', 'Bill', 'Paid'].map(x => T(x, { Accept: 'Aceptar', Schedule: 'Programar', Work: 'Trabajo', Complete: 'Completar', Bill: 'Facturar', Paid: 'Pagada' }[x])), Math.max(0, idx - 1));
  out += h.card({ title: T('Site', 'Sitio'), body: h.map({ pins: [{ x: 200, y: 110, n: '1', tone: 'accent', label: o.addr }], seed: hs(o.id) % 40, h: 180 }) + `<div class="small">${icon('pin', 's')} ${esc(o.addr)}</div>` + meta(T('On-site contact', 'Contacto en sitio'), `${h.btn(T('Call (masked)', 'Llamar (oculto)'), { sm: true, act: 'so-call', icon: 'phone' })}`) + meta(T('Work window', 'Ventana de trabajo'), o.window ? `${esc(o.date)} · ${esc(o.window)}` : esc(o.date)) });
  out += h.card({ title: `${icon('key')} ${T('Access', 'Acceso')}`, tone: inWin && checked ? 'warn' : '', body: inWin ? (checked ? `<div class="small"><b>${esc(o.gate)}</b></div><div class="tiny t3">${T('Shown after GPS check-in within 150 m. Logged.', 'Se muestra tras registrar llegada por GPS a 150 m. Queda registrado.')}</div>` : `<div class="small t2">${T('Check in on site to see the gate code.', 'Registra tu llegada en sitio para ver el código.')}</div>${h.btn(T('Check in (GPS)', 'Registrar llegada (GPS)'), { sm: true, kind: 'primary', act: 'so-checkin', val: o.id, icon: 'pin' })}`) : `<div class="small t2">${['Complete', 'Invoiced', 'Paid'].includes(o.status) ? T('Work window ended. Access info is no longer shown.', 'La ventana terminó. El acceso ya no se muestra.') : T(`Access info appears in your work window (${o.date}${o.window ? ', ' + o.window : ''}).`, `El acceso aparece en tu ventana de trabajo (${o.date}${o.window ? ', ' + o.window : ''}).`)}</div>` });
  out += h.card({ title: T('Scope and files', 'Alcance y archivos'), body: `<div class="small">${esc(o.scope)}</div>` + h.list([{ icon: 'book', title: S.trade === 'irr' ? T('Zone map and controller location (PDF)', 'Mapa de zonas y controlador (PDF)') : T('Design sheet A2, layout and details (PDF)', 'Plano A2, trazo y detalles (PDF)'), act: 'so-file', right: icon('download') }]) });
  out += h.card({ title: T('Your PO', 'Tu PO'), body: meta('PO', `<span class="mono">${o.po}</span>`) + meta(T('Amount', 'Monto'), `<b>${money(o.amount)}</b>`) + meta(T('Terms', 'Términos'), S.terms) + `<div class="tiny t3">${T('This is your amount to the Company. The client price is never shown here.', 'Este es tu monto a la empresa. El precio al cliente nunca se muestra aquí.')}</div>` });
  if (o.status === 'Offered') {
    out += prop ? pban(`${icon('calendar')} ${T('Proposed', 'Propuesto')}: ${esc(prop)}. ${T('Waiting for the Company.', 'Esperando a la empresa.')}`, 'info') : '';
    out += sticky(`<div class="cols cols-2" style="gap:6px">${bb(T('Decline', 'Rechazar'), { ghost: true, modal: 'so-decline' })}${bb(T('Propose date', 'Proponer fecha'), { ghost: true, modal: 'so-date' })}</div>${bb(T('Accept order', 'Aceptar orden'), { act: 'so-set', val: o.id + ':Accepted', icon: 'check' })}`);
  } else if (['Accepted', 'Scheduled', 'In progress'].includes(o.status)) {
    out += h.card({ title: `${T('Completion photos', 'Fotos de terminación')} <span class="t3 num">${nPh}/3</span>`, body: (nPh ? `<div class="cols cols-3" style="gap:5px">${Array.from({ length: Math.min(nPh, 3) }, (_, i) => h.photo(S.trade === 'hard' ? 'patio' : 'after', { badge: `${['2:10', '2:12', '2:15'][i]} PM` })).join('')}</div>` : '') + h.btn(T('Add photo', 'Añadir foto'), { sm: true, act: 'so-photo', val: o.id, icon: 'camera', disabled: nPh >= 3 }) + `<div class="tiny t3">${T('The Company requires 3 photos to complete.', 'La empresa pide 3 fotos para completar.')}</div>` });
    out += h.card({ title: T('Materials used', 'Materiales usados'), body: (mats ? (S.trade === 'irr' ? [['Rotor head', '2'], ['Swing joint', '1']] : [['Polymeric sand, bags', '6'], ['Base stone, tons', '4']]).slice(0, mats).map(m => meta(esc(m[0]), m[1])).join('') : `<span class="tiny t3">${T('None logged yet.', 'Nada registrado.')}</span>`) + h.btn(T('Add material', 'Añadir material'), { sm: true, act: 'so-mat', val: o.id, icon: 'plus' }) });
    out += sticky(bb(T('Mark complete', 'Marcar completa'), { act: 'so-complete', val: o.id, icon: 'check', disabled: nPh < 3 }));
  } else if (o.status === 'Complete') {
    out += h.card({ title: T('Completion', 'Terminación'), body: `<div class="cols cols-3" style="gap:5px">${[0, 1, 2].map(i => h.photo(S.trade === 'hard' ? 'patio' : 'after', { badge: o.date })).join('')}</div>` });
    out += sticky(bb(T('Submit bill against this PO', 'Enviar factura contra este PO'), { go: 'sub.invoices', x: o.id, icon: 'receipt' }));
  } else {
    out += h.card({ title: T('Billing', 'Facturación'), body: meta(T('Bill', 'Factura'), 'B-' + o.id.slice(3)) + meta(T('Status', 'Estado'), soPill(c, o.status)) + h.btn(T('See invoices', 'Ver facturas'), { sm: true, go: 'sub.invoices' }) });
  }
  out += '<!--side-->' + side(`${icon('eye')} What ${esc(c.t.name)} sees`, h.kv([['Order', `${o.id} · ${o.status}`], ['Vendor', esc(S.vend)], ['PO', `${o.po} · ${money(o.amount)}`], ['Sell price to client', '<span class="masked" title="Never shown to subcontractors (02 §5.12)">hidden from sub</span>'], ['Photos', `${nPh} of 3`]]) + h.note('Access secrets need a GPS check-in within 150 m or an office override. Sub-to-client messages go through the Company inbox.'));
  return out;
});
RL.act('so-set', (el, ev, c) => { const p = String(el.dataset.val).split(':'); RL.ui['so.st.' + p[0]] = p[1]; RL.toast(c.tr('Order accepted.', 'Orden aceptada.')); });
RL.act('so-checkin', (el, ev, c) => { RL.ui['so.in.' + el.dataset.val] = 'true'; RL.ui['so.st.' + el.dataset.val] = 'In progress'; RL.toast(c.tr('Checked in 41 m from the site. Access info unlocked.', 'Llegada a 41 m del sitio. Acceso desbloqueado.')); });
RL.act('so-photo', (el) => { const k = 'so.ph.' + el.dataset.val; RL.ui[k] = String(Math.min(3, Number(RL.ui[k] || 0) + 1)); });
RL.act('so-mat', (el) => { const k = 'so.mat.' + el.dataset.val; RL.ui[k] = String(Math.min(2, Number(RL.ui[k] || 0) + 1)); });
RL.act('so-complete', (el, ev, c) => { if (Number(RL.ui['so.ph.' + el.dataset.val] || 0) < 3) { RL.toast(c.tr('Add 3 completion photos first.', 'Primero añade 3 fotos.')); return false; } RL.ui['so.st.' + el.dataset.val] = 'Complete'; RL.toast(c.tr('Marked complete. You can bill against the PO now.', 'Completa. Ya puedes facturar contra el PO.')); });
RL.act('so-call', (el, ev, c) => { RL.toast(c.tr('Calling through a masked number.', 'Llamando por número oculto.')); return false; });
RL.act('so-file', (el, ev, c) => { RL.toast(c.tr('Shared file opened (view only).', 'Archivo compartido abierto (solo ver).')); return false; });
RL.modal('so-decline', (c) => {
  const T = c.tr, o = subCtx(c).orders.find(x => x.id === c.x) || subCtx(c).orders[0];
  RL.ui['so.pending'] = o.id;
  return { title: T('Decline order', 'Rechazar orden') + ' ' + o.id, body: h.field(T('Reason (required)', 'Motivo (obligatorio)'), h.select([T('Fully booked that week', 'Sin espacio esa semana'), T('Outside our service area', 'Fuera de nuestra zona'), T('Scope needs a site visit first', 'El alcance necesita visita primero')], '')) + h.textarea('', { ph: T('Note for the Company (optional)', 'Nota para la empresa (opcional)') }), foot: h.btn(T('Cancel', 'Cancelar'), { act: 'noop' }) + h.btn(T('Decline', 'Rechazar'), { kind: 'danger', act: 'so-decline-do' }) };
});
RL.act('so-decline-do', (el, ev, c) => { RL.ui['so.st.' + RL.ui['so.pending']] = 'Declined'; RL.closeModal(); RL.toast(c.tr('Declined with your reason. The Company will reassign it.', 'Rechazada con tu motivo. La empresa la reasigna.')); });
RL.modal('so-date', (c) => {
  const T = c.tr, o = subCtx(c).orders.find(x => x.id === c.x) || subCtx(c).orders[0];
  RL.ui['so.pending'] = o.id;
  const opts = c.winter ? ['Apr 13, 8:00-12:00', 'Apr 14, 12:00-4:00', 'Apr 15, 8:00-12:00'] : ['May 14, 8:00-12:00', 'May 17, 12:00-4:00', 'May 18, 8:00-12:00'];
  return { title: T('Propose another date', 'Proponer otra fecha'), body: opts.map((d, i) => `<label class="flex small" style="padding:8px 0;border-bottom:1px solid var(--border)"><input type="radio" name="sod"${i === 0 ? ' checked' : ''} data-self> ${d}</label>`).join(''), foot: h.btn(T('Send proposal', 'Enviar propuesta'), { kind: 'primary', act: 'so-date-do', val: opts[0] }) };
});
RL.act('so-date-do', (el, ev, c) => { RL.ui['so.prop.' + RL.ui['so.pending']] = el.dataset.val; RL.closeModal(); RL.toast(c.tr('Date proposed. The Company confirms or picks another.', 'Fecha propuesta. La empresa confirma o elige otra.')); });
RL.screen('sub.invoices', (c) => {
  const S = subCtx(c), T = c.tr;
  const billable = S.orders.filter(o => o.status === 'Complete');
  const bills = S.orders.filter(o => ['Invoiced', 'Paid'].includes(o.status));
  const sel = billable.find(o => o.id === (U('sub.billfor', '') || c.x)) || billable[0];
  let out = `<div><b>${T('Invoices', 'Facturas')}</b><div class="tiny t3">${esc(S.who)} · ${T('bills go to', 'facturas para')} ${esc(c.t.name)}</div></div>`;
  out += `<div class="kpis" style="grid-template-columns:repeat(2,minmax(0,1fr))"><div class="kp"><span class="l">${T('Waiting for payment', 'Por cobrar')}</span><span class="v" style="font-size:1.1rem">${money(bills.filter(o => o.status === 'Invoiced').reduce((a, o) => a + o.amount, 0))}</span></div><div class="kp"><span class="l">${T('Paid last 30 days', 'Pagado 30 días')}</span><span class="v" style="font-size:1.1rem">${money(bills.filter(o => o.status === 'Paid').reduce((a, o) => a + o.amount, 0))}</span></div></div>`;
  if (sel) out += h.card({ title: T('New bill', 'Nueva factura'), body: h.field(T('Work order', 'Orden'), h.select(billable.map(o => [o.id, `${o.id} · ${o.scope.slice(0, 32)}`]), sel.id, { ui: 'sub.billfor', label: 'Order' }))
    + meta('PO', `<span class="mono">${sel.po}</span>`) + h.field(T('Amount', 'Monto'), h.input(money(sel.amount, { cents: true }), { label: 'Amount' }), T(`Up to the PO amount (${money(sel.amount)}). More needs an approved change.`, `Hasta el monto del PO (${money(sel.amount)}). Más requiere un cambio aprobado.`))
    + h.field(T('Your invoice number', 'Tu número de factura'), h.input('DI-' + (2040 + hs(sel.id) % 50), { label: 'Invoice number' }))
    + `<div class="flex">${h.btn(T('Upload PDF', 'Subir PDF'), { sm: true, act: 'sub-pdf', icon: 'upload' })}<span class="tiny t3">${T('or use this simple form', 'o usa este formulario')}</span></div>` + h.btn(T('Submit bill', 'Enviar factura'), { kind: 'primary', act: 'sub-bill', val: sel.id, icon: 'send' }) });
  else out += h.card({ body: `<div class="small t2">${T('No completed orders waiting for a bill.', 'No hay órdenes completas por facturar.')}</div>` });
  out += h.card({ title: T('Your bills', 'Tus facturas'), flush: true, body: h.list(bills.map(o => ({ icon: o.status === 'Paid' ? 'check' : 'receipt', tone: o.status === 'Paid' ? 'ok' : 'info', title: `B-${o.id.slice(3)} · ${money(o.amount)}`, sub: `${o.po} · ${o.status === 'Paid' ? T(`Paid ${o.date} by ACH`, `Pagada ${o.date} por ACH`) : T('Approved, scheduled for payment in 15 days', 'Aprobada, pago programado en 15 días')}`, right: soPill(c, o.status) }))) });
  out += h.card({ title: T('Payout account', 'Cuenta de pago'), body: meta(T('Checking', 'Cuenta'), '•••• 6621') + `<div class="tiny t3">${T('Changing bank details needs a passkey and the Company confirms by phone.', 'Cambiar datos bancarios requiere passkey y la empresa confirma por teléfono.')}</div>` });
  out += '<!--side-->' + side(`${icon('eye')} What ${esc(c.t.name)} sees`, `<div class="small">Bills land in accounts payable, matched to the PO and the work order (2-way match). Payment status flows back here.</div>` + h.note('Sub portal with all orders, COI and W-9 uploads and banking is V1; single-order links work at MVP (02 §5.12).'));
  return out;
});
RL.act('sub-pdf', (el, ev, c) => { RL.toast(c.tr('PDF attached (mock).', 'PDF adjunto (simulado).')); return false; });
RL.act('sub-bill', (el, ev, c) => { RL.ui['so.st.' + el.dataset.val] = 'Invoiced'; RL.ui['sub.billfor'] = ''; RL.toast(c.tr('Bill submitted against the PO.', 'Factura enviada contra el PO.')); });

// =====================================================================
// CUSTOMER PORTAL: shared context (06; 21 §5.4; 02 §5.11)
// =====================================================================
const isPhone = () => RL.ui['portal.device'] === 'phone';
const pcols = (kind, items) => isPhone() ? `<div class="stack12">${items.filter(Boolean).join('')}</div>` : h.cols(kind, items.filter(Boolean));
const ptable = (cols, rows, o) => wrap(h.table(cols, rows, o));
const handled = c => `<div class="cd" style="padding:12px;display:flex;gap:10px;align-items:center">${icon('lock')}<div><b class="small">${c.tr('This item is handled by the account holder', 'Este asunto lo maneja el titular de la cuenta')}</b><div class="tiny t3">${c.tr('Billing and proposals for this property go to the account holder.', 'La facturación y las propuestas de esta propiedad van al titular.')}</div></div></div>`;
function greet(c, nameOverride) {
  const n = strip(nameOverride || c.who);
  const co = strip(c.D.com.company), cl = strip(c.D.res.client);
  if (!n || n === co || n === cl || /HOA|Association|family|household|Resident tenant/i.test(n)) return c.tr('Welcome back', 'Bienvenido');
  return c.tr('Hi', 'Hola') + ' ' + first(n);
}
const CM = c => c.role === 'client_commercial';
function resCtx(c) {
  const D = c.D, R = D.res, cast = c.t.cast || {}, W = c.winter;
  const cl = D.clients.find(x => x.id === R.clientId) || D.clients[0] || {};
  const prop = D.properties.find(p => p.client === R.clientId) || { address: R.property, turf: 8000, beds: 5, gate: null, dog: null, zones: null };
  const V = R.projectValue || 18600;
  const designOnly = c.t.modules.includes('design_only');
  const tiers = [{ k: 'good', en: 'Good', es: 'Básica', price: rnd(V * .8, 100) }, { k: 'better', en: 'Better', es: 'Mejor', price: V, rec: true }, { k: 'best', en: 'Best', es: 'Superior', price: rnd(V * 1.22, 100) }];
  const opt = tiers.find(t => t.k === U('pp.opt', 'better')) || tiers[1];
  const autopay = cl.autopay !== false;
  const visits = D.visits.filter(v => v.clientId === R.clientId);
  const lawn = c.mod('lawn_programs');
  let inv;
  if (designOnly) inv = [{ id: 'INV-3301', date: W ? 'Dec 2' : 'Apr 20', desc: ['Design consultation and site measure', 'Consulta de diseño y medición'], amount: 250, due: '', status: 'Paid', paid: W ? 'Dec 2' : 'Apr 20' }];
  else if (W) inv = [{ id: 'INV-3341', date: 'Jan 11', desc: ['Snow push, Jan 10 (drive and walks)', 'Despeje de nieve, 10 ene (entrada y aceras)'], amount: 65, due: 'Jan 25', status: 'Open' }, { id: 'INV-3302', date: 'Dec 1', desc: ['Fall cleanup (2 of 2)', 'Limpieza de otoño (2 de 2)'], amount: 420, due: 'Dec 15', status: 'Paid', paid: 'Dec 15' }, { id: 'INV-3277', date: 'Nov 3', desc: ['Weekly mowing, October (level billing 8 of 8)', 'Corte semanal, octubre (pago nivelado 8 de 8)'], amount: 212, due: 'Nov 17', status: 'Paid', paid: 'Nov 17' }];
  else {
    inv = [{ id: 'INV-3336', date: 'May 11', desc: lawn ? ['Lawn program round 2 (May 11)', 'Programa de césped ronda 2 (11 may)'] : ['Weekly mowing, May (level billing 2 of 8)', 'Corte semanal, mayo (pago nivelado 2 de 8)'], amount: lawn ? 74 : 212, due: 'May 25', status: 'Open' }];
    D.invoices.filter(i => i.clientId === R.clientId).forEach(i => inv.push({ id: i.id, date: i.date, desc: ['Weekly mowing and edging', 'Corte semanal y orillado'], amount: i.amount, due: i.due, status: i.status === 'Paid' ? 'Paid' : i.status === 'Overdue' ? 'Overdue' : 'Open', paid: i.status === 'Paid' ? i.date : '' }));
    inv.push({ id: 'INV-3290', date: 'Apr 12', desc: ['Spring cleanup and bed edging', 'Limpieza de primavera y orillado'], amount: 385, due: 'Apr 26', status: 'Paid', paid: 'Apr 26' });
  }
  inv.forEach(i => { if (RL.ui['paid.' + i.id]) { i.status = 'Paid'; i.paid = c.today.short; } });
  const open = inv.filter(i => i.status !== 'Paid');
  const step = U('pp.step', 'review');
  const crewM = D.crews.find(cr => cr.type === 'maintenance') || D.crews[0] || null;
  const done = visits.find(v => v.status === 'Done');
  const live = visits.find(v => v.status === 'In progress' || v.status === 'En route');
  return { D, R, cl, prop, V, tiers, opt, dep: Math.round(opt.price * .3), est: strip(cast.estimator || cast.designer || c.owner), designer: strip(cast.designer || cast.estimator || c.owner), autopay, visits, lawn, inv, open, bal: open.reduce((a, i) => a + i.amount, 0), step, crewM, done, live, designOnly, pr: D.proposals[0] };
}
function comCtx(c) {
  const D = c.D, C = D.com, sc = c.scope, W = c.winter, T = c.tr;
  const hoaSide = sc === 'approver' && C.hoa && C.hoa !== C.company && String(C.approver).includes(C.hoa);
  const name = hoaSide ? C.hoa : C.company;
  const isHoa = hoaSide || /HOA|Association/i.test(name);
  const base = hoaSide ? ['Main entrance', 'Clubhouse and pool', 'Pond trail', 'North commons'] : C.props.slice();
  const pace = W ? .07 : .38;
  let props = base.map((n, i) => { const k = hs(n); const budget = 36000 + (k % 10) * 8000; const over = i === 2; const spent = rnd(budget * (pace + (over ? .13 : ((k >>> 4) % 9 - 4) / 100)), 10); return { name: n, i, budget, spent, over, open: (k >>> 2) % 3, score: (4 + ((k >>> 5) % 9) / 10).toFixed(1), next: W ? ['Jan 12 (storm)', 'Jan 12 (storm)', 'On trigger'][i % 3] : ['Thu May 13', 'Wed May 12', 'Fri May 14'][i % 3], x: 50 + (i * 71) % 300, y: 40 + (i * 53) % 160 }; });
  const siteName = (String(C.site).match(/\(([^)]+)\)/) || [])[1];
  if (sc === 'property_contact') props = [props.find(p => p.name === siteName) || props[0]];
  const pm = strip(C.primary) === strip(C.company) ? (isHoa ? 'Community manager' : 'Account manager') : strip(C.primary);
  const ap = strip(C.approver);
  const board = [ap, 'Linda Park', 'Raj Mehta', 'Carol Diaz', 'Tom Ellison'];
  const pre = abbr(name);
  const po = i => `${pre}-${String(204110 + i * 37).padStart(6, '0')}`;
  const P = i => props[Math.min(i, props.length - 1)].name;
  const items = isHoa ? [
    { id: 'PR-2318', title: [`${P(0)}: entrance renovation`, `${P(0)}: renovación de la entrada`], prop: P(0), amount: 18400, mode: 'vote', voted: 2 },
    { id: 'PR-2321', title: [`${P(2)}: replace 14 trees`, `${P(2)}: reemplazar 14 árboles`], prop: P(2), amount: 7300, mode: 'vote', voted: 0 },
    { id: 'CO-0121', title: [`${P(0)}: add 6 boulders`, `${P(0)}: agregar 6 rocas`], prop: P(0), amount: 1480, mode: 'any' },
  ] : [
    { id: 'PR-2304', title: [`${P(0)}: replace 6 Bradford pears`, `${P(0)}: reemplazar 6 perales`], prop: P(0), amount: 7850, mode: 'seq', first: W ? 'Jan 8' : 'May 10' },
    { id: 'CO-0117', title: [`${P(2)}: backflow preventer repair`, `${P(2)}: reparación de contraflujo`], prop: P(2), amount: 1240, mode: 'limit' },
    W ? { id: 'WO-3390', title: [`${P(1)}: snow hauling after the Jan 12 storm`, `${P(1)}: retiro de nieve tras la tormenta`], prop: P(1), amount: 2600, mode: 'auto' } : { id: 'PR-2310', title: [`${P(1)}: summer color rotation`, `${P(1)}: rotación de flores de verano`], prop: P(1), amount: 4380, mode: 'limit' },
  ];
  items.forEach(it => { it.st = RL.ui['ap.' + it.id] || ''; });
  const invoices = props.slice(0, 6).map((p, i) => ({ id: 'INV-' + (3344 + i), prop: p.name, desc: W ? T('Snow services, Jan 1-12', 'Servicios de nieve, 1-12 ene') : T('Monthly maintenance, May', 'Mantenimiento mensual, mayo'), po: po(i), gl: '6420-' + (110 + i * 10), amount: rnd(2200 + (hs(p.name) % 30) * 95, 5), due: W ? 'Feb 10' : 'Jun 10', status: RL.ui['paid.INV-' + (3344 + i)] ? 'Paid' : i < 2 ? 'Paid' : 'Open' }));
  const budget = { name: W ? 'Enhancements 2027' : 'Enhancements 2027', total: isHoa ? 60000 : 90000, used: isHoa ? 21400 : 38600 };
  return { D, C, name, isHoa, props, pm, ap, board, vp: 'Dan Whitfield', po, items, invoices, budget, hoaSide, limit: isHoa ? 5000 : 5000 };
}
const comPhoto = (k, badge) => h.photo(k, { badge });
// "What the Company sees" side card for portal screens (frame renders it beside the page).
function pside(c, note) {
  const id = c.route.id, com = CM(c), sc = c.scope;
  const X = com ? null : resCtx(c), K = com ? comCtx(c) : null;
  const scope = `<span class="mono" style="word-break:break-all">${esc(c.role)}.${esc(sc || '-')}</span>`;
  const P = {
    'portal.home': com ? [['Account', esc(K.name)], ['Contact scope', scope], ['Open approvals', String(K.items.filter(i => !i.st && i.mode !== 'auto').length)], ['Open requests', String(K.props.reduce((a, p) => a + p.open, 0))]]
      : [['Proposal ' + X.pr.id, sc === 'property_contact' ? 'Not shared with this contact' : 'Viewed 3 times, last 2 h ago'], ['Contact scope', scope], ['Autopay', sc === 'property_contact' ? 'Not shown to this contact' : X.autopay ? 'On, Visa 4242' : 'Off'], ['ETA text', 'Sent 9:58 am']],
    'portal.proposals': com ? [['Routed by policy', K.isHoa ? 'Vote 2 of 5 over $5,000' : 'Sequential over $5,000']] : [['Engagement', 'Opened 3 times, 4 min on options'], ['Status', esc(X.step)]],
    'portal.schedule': [['Skip cutoff', '6:00 pm the day before'], ['Skips used', String(1 + Object.keys(RL.ui).filter(k => k.startsWith('skip.') && RL.ui[k]).length) + ' of 3 this season'], ['Arrival window', '2 h, shown to the client'], ['Contact scope', scope]],
    'portal.billing': com ? [['Open', money(K.invoices.filter(i => i.status !== 'Paid').reduce((a, i) => a + i.amount, 0))], ['PO on invoices', '100%'], ['Processor', 'Company\'s own Stripe account']] : [['Open balance', money(X.bal, { cents: true })], ['Autopay', X.autopay ? 'On' : 'Off'], ['Deposits post to', '2100 Customer deposits'], ['Processor', 'Company\'s own Stripe account']],
    'portal.requests': [['Lands in', 'Unified inbox, ops manager'], ['Response target', '1 business day'], ['Contact scope', scope]],
    'portal.history': [['Reports', 'Sent after each completed visit'], ['Application records', 'Immutable, kept 7 years'], ['Rating', RL.ui.rate === 'down' ? 'Thumbs down: follow-up task opened' : RL.ui.rate === 'up' ? 'Thumbs up' : 'Not rated yet']],
    'portal.property': [['Access notes', 'Changes notify the ops manager'], ['Gate code', 'Encrypted; crew sees it on the visit day'], ['Contact scope', scope]],
    'portal.messages': [['Inbox', 'Unified inbox, assigned to the office'], ['Channels', 'Portal, SMS and email per consent'], ['Contact scope', scope]],
    'portal.account': [['Consent', 'Per contact, per channel, with source and time'], ['Contact changes', 'Primary only, with step-up'], ['Contact scope', scope]],
    'portal.approvals': com ? [['Policy', K.isHoa ? 'Vote: 2 yes of 5 over $5,000' : 'Sequential: primary then regional VP over $5,000'], ['Ballot evidence', 'Identity, method, time, version hash'], ['Contact scope', scope]] : [],
    'portal.documents': com ? [['COI', 'Valid to Mar 31, 2028; renewal tracked'], ['Shared with', esc(K.name)], ['Contact scope', scope]] : [],
    'portal.reports': com ? [['Snow events', c.winter ? '7 this season' : '11 this season'], ['Proof', c.has('snow_ice') ? 'Snow Lite export now; sealed packets in V1' : 'Snow Lite service-log export'], ['Contact scope', scope]] : [],
  }[id] || [['Contact scope', scope]];
  return '<!--side-->' + h.card({ title: `${icon('eye')} What ${esc(c.t.name)} sees`, body: h.kv(P) + (note ? h.note(note) : '') });
}


// ---------- portal.home ----------
function nextStepCard(c, X) {
  const T = c.tr, st = X.step;
  if (st === 'done') return h.card({ tone: 'ok', title: `${icon('check')} ${T('Deposit received. Next: scheduling your project', 'Depósito recibido. Siguiente: programar tu proyecto')}`, body: `<div class="small t2">${T(`${esc(X.est)} will confirm a start window. You can follow every phase here.`, `${esc(X.est)} confirmará la fecha de inicio. Puedes seguir cada fase aquí.`)}</div>` });
  const steps = [T('Review options', 'Revisar opciones'), T('Sign', 'Firmar'), T('Pay 30% deposit', 'Pagar 30% de depósito')];
  const at = st === 'sign' ? 1 : st === 'deposit' ? 2 : 0;
  return h.card({ title: T('Your next step', 'Tu siguiente paso'), body: `<div class="${isPhone() ? 'stack8' : 'cols cols-21'}" style="gap:12px;align-items:center"><div class="stack8"><b style="font-size:1.05rem">${at === 2 ? T('Pay your deposit to lock in your spot', 'Paga tu depósito para apartar tu lugar') : at === 1 ? T('Sign your proposal', 'Firma tu propuesta') : T(`Review your ${X.designOnly ? 'design' : 'patio'} proposal with AI mockups`, `Revisa tu propuesta con imágenes generadas por IA`)}</b><div class="small t2">${esc(X.R.project)} · ${T('3 options from', '3 opciones desde')} ${money(X.tiers[0].price)}. ${T('Deposit', 'Depósito')} ${money(X.dep)} (30%) ${T('goes to', 'va a')} ${esc(c.t.name)} ${T("through its own Stripe account.", 'por su propia cuenta de Stripe.')}</div>${h.steps(steps, at)}<div class="flex">${h.btn(at === 0 ? T('Review proposal', 'Revisar propuesta') : at === 1 ? T('Sign now', 'Firmar ahora') : T('Pay deposit', 'Pagar depósito'), { kind: 'primary', go: 'portal.proposal', x: X.pr.id })}${h.btn(T('Ask a question', 'Hacer una pregunta'), { go: 'portal.messages' })}</div></div><div>${h.photo('mockup', { badge: T('AI-generated concept', 'Concepto generado por IA') })}</div></div>` });
}
function visitReportCard(c, X, o) {
  const T = c.tr, v = X.done, ck = v && chemKey(v.service);
  const when = v ? `${T('Today', 'Hoy')} ${t12(toMin(v.start))}` : (c.winter ? 'Jan 10' : 'May 4');
  const what = v ? svc(c, v.service) : c.winter ? T('Snow push, drive and walks', 'Despeje de nieve, entrada y aceras') : T('Weekly mowing', 'Corte semanal');
  const crew = v ? (c.D.crews.find(cr => cr.name === v.crew) || {}).lead : (X.crewM || {}).lead;
  const A = v && ck ? applicatorFor(c.D, v.crew) : null;
  return h.card({ title: T('Latest visit report', 'Último informe de visita'), sub: `${when} · ${what}${crew ? ' · ' + T('crew of', 'cuadrilla de') + ' ' + esc(first(crew)) : ''}`, actions: h.btn(T('Full report', 'Informe completo'), { sm: true, go: 'portal.history' }), body: `<div class="cols cols-2" style="gap:6px">${h.photo(c.winter ? 'snow' : 'before', { badge: T('Before', 'Antes') })}${h.photo(c.winter ? 'snow' : 'after', { badge: T('After', 'Después') })}</div><div class="small">"${c.winter ? T('Drive and walks cleared, ice melt on the steps.', 'Entrada y aceras despejadas, deshielo en los escalones.') : ck ? T('Granular application on front and back turf. Lawn markers posted.', 'Aplicación granulada en el frente y atrás. Banderas de aviso puestas.') : T('Mowed at 3.5 in, edged walks and drive, beds blown clean.', 'Cortado a 3.5 in, aceras orilladas, camas limpias.')}"</div>${ck ? pban(`${icon('flask')} ${esc(T(CHEM[ck].en, CHEM[ck].es))}: ${esc(T(CHEM[ck].rei[0], CHEM[ck].rei[1]))}`, 'warn') + `<div class="tiny t3">${T('Applicator', 'Aplicador')}: ${esc(A.name)}${A.lic ? ' · ' + esc(A.lic) : A.sup ? ' ' + T('under supervision of', 'bajo supervisión de') + ' ' + esc(A.sup.name) + ' (' + esc(A.sup.cert) + ')' : ''}</div>` : ''}${o && o.noRate ? '' : `<div class="flex">${h.btn(icon('check') + T('Looks great', 'Se ve bien'), { sm: true, ui: 'rate', val: 'up', kind: RL.ui.rate === 'up' ? 'primary' : '' })}${h.btn(T('Something is off', 'Algo no está bien'), { sm: true, ui: 'rate', val: 'down', kind: RL.ui.rate === 'down' ? 'danger' : '' })}</div>`}` });
}
function etaCard(c, X) {
  const T = c.tr;
  if (X.designOnly || !X.crewM) return h.card({ title: T('Coming up', 'Próximamente'), body: `<div class="small">${T('Design review meeting, Tue May 18 at 10:00 am', 'Reunión de revisión de diseño, mar 18 may 10:00 am')}</div>` });
  if (X.live) return h.card({ tone: 'ok', title: `${icon('truck')} ${X.live.status === 'In progress' ? T('Your crew is on site now', 'Tu cuadrilla está en sitio ahora') : T('Your crew is on the way', 'Tu cuadrilla va en camino')}`, body: `<div class="small">${svc(c, X.live.service)} · ${T('crew of', 'cuadrilla de')} ${esc(first((c.D.crews.find(cr => cr.name === X.live.crew) || {}).lead || ''))}</div>` });
  const lead = first(X.crewM.lead);
  return h.card({ tone: 'ok', title: `${icon('truck')} ${c.winter ? T('Snow crew on the way', 'Cuadrilla de nieve en camino') : T('Your crew is on the way', 'Tu cuadrilla va en camino')}`, body: `<div class="flex nw">${h.avatar(X.crewM.lead)}<div class="grow"><b style="font-size:1.15rem">${c.winter ? 'ETA 5:30-6:00 am' : 'ETA 10:20-10:50 am'}</b><div class="small t2">${c.winter ? T('Snow push, drive and walks', 'Despeje de nieve, entrada y aceras') : T('Weekly mowing', 'Corte semanal')} · ${esc(lead)} · ${esc(X.crewM.truck)}</div></div></div><div class="tiny t3">${T('Live ETA window; the link stays valid until 30 minutes after arrival.', 'Ventana de llegada en vivo; el enlace vale hasta 30 minutos después de llegar.')}</div>` });
}
RL.screen('portal.home', (c) => {
  const T = c.tr;
  if (CM(c)) return comHome(c);
  const X = resCtx(c), sc = c.scope;
  const addr = X.prop.address || X.R.property;
  if (sc === 'property_contact') {
    return h.page({ title: greet(c), sub: `${esc(addr)} · ${T('resident', 'residente')}` })
      + pcols('21', [`<div class="stack12">${h.card({ title: T('Your next step', 'Tu siguiente paso'), body: `<b>${c.winter ? T('Snow crew comes this morning: please move cars off the drive', 'La cuadrilla de nieve viene esta mañana: mueve los autos de la entrada') : T('Mowing today 10:20-10:50 am: please keep the dog inside', 'Corte hoy 10:20-10:50 am: por favor deja al perro adentro')}</b><div class="flex">${h.btn(T('Update access notes', 'Actualizar notas de acceso'), { kind: 'primary', go: 'portal.property' })}${h.btn(T('Request a fix', 'Pedir un arreglo'), { go: 'portal.requests' })}</div>` })}${visitReportCard(c, X)}</div>`,
        `<div class="stack12">${etaCard(c, X)}${handled(c)}</div>`])
      + pside(c, `Property contact (resident): visits and requests only. No prices, invoices or proposals; money links show "handled by the account holder" with no amount (21 §5.4, 02 §5.11).`);
  }
  const co = sc === 'co_owner';
  const bal = X.bal, nextInv = X.open[0];
  const right = `<div class="stack12">${h.card({ title: T('Balance', 'Saldo'), body: `<div style="font-size:1.6rem;font-weight:750" class="num">${money(bal, { cents: true })}</div><div class="small t2">${bal ? (X.autopay ? T(`Autopay on: Visa ending 4242 is charged ${nextInv.due}.`, `Autopago activo: se cobra a la Visa 4242 el ${nextInv.due}.`) : T(`Due ${nextInv.due}.`, `Vence ${nextInv.due}.`)) : T('You are all paid up.', 'Estás al día.')}</div>${co ? `<div class="tiny t3">${T(`Payment methods are managed by ${first(X.R.primary)} (primary contact).`, `Los métodos de pago los maneja ${first(X.R.primary)} (contacto principal).`)}</div>` : ''}<div class="flex">${bal ? h.btn(T('Pay now', 'Pagar ahora'), { kind: X.autopay ? '' : 'primary', go: 'portal.billing' }) : ''}${h.btn(T('Billing', 'Facturación'), { sm: true, go: 'portal.billing' })}</div>` })}
    ${h.card({ title: T('Coming up', 'Próximamente'), flush: true, body: h.list(X.designOnly ? [{ icon: 'calendar', title: T('Design review meeting', 'Reunión de revisión'), sub: 'Tue May 18 · 10:00 am' }] : (c.winter ? [{ icon: 'snow', title: T('Snow service on trigger (2 in)', 'Servicio de nieve al llegar a 2 in'), sub: T('Drive and walks', 'Entrada y aceras') }, { icon: 'leaf', title: T('Spring cleanup window', 'Ventana de limpieza de primavera'), sub: 'Mar 22 - Apr 9' }] : [{ icon: 'calendar', title: T('Weekly mowing', 'Corte semanal'), sub: 'Tue May 18 · 8:00-10:00 am' }, X.lawn ? { icon: 'leaf', title: T('Lawn round 3: broadleaf weed control', 'Ronda 3: control de hoja ancha'), sub: 'Jun 7-18' } : null, { icon: 'calendar', title: T('Weekly mowing', 'Corte semanal'), sub: 'Tue May 25 · 8:00-10:00 am' }].filter(Boolean))) })}
    ${h.card({ title: T('Quick actions', 'Acciones rápidas'), body: `<div class="flex">${h.btn(T('Request service', 'Pedir servicio'), { go: 'portal.requests', icon: 'plus' })}${h.btn(T('Message us', 'Escríbenos'), { go: 'portal.messages', icon: 'chat' })}${h.btn(T('Pay', 'Pagar'), { go: 'portal.billing', icon: 'card' })}</div>` })}</div>`;
  const left = `<div class="stack12">${nextStepCard(c, X)}${etaCard(c, X)}${visitReportCard(c, X)}</div>`;
  return h.page({ title: greet(c), sub: `${esc(addr)} · ${X.lawn && !c.winter ? T('2027 lawn program: round 2 of 6 done', 'Programa de césped 2027: ronda 2 de 6') : esc(c.t.name)}` }) + pcols('21', [left, right])
    + pside(c, co ? 'Co-owner: can view, sign and pay; payment methods and autopay are managed by the primary contact by default (02 §5.11).' : 'Primary contact: full rights. The Next step card only offers actions inside the contact\'s scope (21 §5.4).');
});
function comHome(c) {
  const T = c.tr, K = comCtx(c), sc = c.scope;
  const pend = K.items.filter(i => !i.st && i.mode !== 'auto');
  if (sc === 'property_contact') {
    const p = K.props[0];
    return h.page({ title: greet(c), sub: `${esc(p.name)} · ${T('property contact', 'contacto de la propiedad')}` })
      + pcols('21', [`<div class="stack12">${h.card({ title: T('Report a problem', 'Reportar un problema'), body: `<div class="small t2">${T('A photo and a pin are enough. You get a photo when it is fixed.', 'Una foto y un pin son suficientes. Recibes una foto cuando quede arreglado.')}</div>${h.btn(T('New request', 'Nueva solicitud'), { kind: 'primary', go: 'portal.requests', icon: 'camera' })}` })}${h.card({ title: T('Latest visit', 'Última visita'), sub: c.winter ? T('Today 5:02-5:31 am · plow and salt', 'Hoy 5:02-5:31 am · despeje y sal') : T('Thu May 6 · weekly maintenance', 'jue 6 may · mantenimiento semanal'), body: `<div class="cols cols-2" style="gap:6px">${comPhoto(c.winter ? 'snow' : 'before', T('Before', 'Antes'))}${comPhoto(c.winter ? 'snow' : 'after', T('After', 'Después'))}</div>` })}</div>`,
        `<div class="stack12">${h.card({ title: T('Next visit', 'Próxima visita'), body: `<b>${c.winter ? T('On snow trigger (2 in)', 'Al llegar a 2 in de nieve') : T('Thu May 13, 7:00-9:00 am', 'jue 13 may, 7:00-9:00 am')}</b><div class="tiny t3">${T('We text you when the crew is on the way.', 'Te avisamos cuando la cuadrilla vaya en camino.')}</div>` })}${h.card({ title: T('Your requests', 'Tus solicitudes'), flush: true, body: h.list([{ icon: 'check', tone: 'ok', title: T('Broken sprinkler head flooding the sidewalk', 'Cabeza de aspersor rota inundando la acera'), sub: T('Fixed May 7 · after photo', 'Arreglado 7 may · foto después'), go: 'portal.requests' }, { icon: 'clock', tone: 'info', title: T('Litter in the front beds', 'Basura en las camas del frente'), sub: T('Scheduled with next visit', 'Programado con la próxima visita'), go: 'portal.requests' }]) })}</div>`])
      + pside(c, 'Property contact: assigned property only. No prices, invoices or other properties (02 §3.4.4).');
  }
  if (sc === 'billing') {
    const open = K.invoices.filter(i => i.status !== 'Paid');
    return h.page({ title: greet(c), sub: `${esc(K.name)} · ${T('billing contact', 'contacto de facturación')}` })
      + pcols('21', [h.card({ title: T('Your next step', 'Tu siguiente paso'), body: `<b style="font-size:1.05rem">${open.length} ${T('invoices due', 'facturas por pagar')} ${open[0] ? open[0].due : ''}: ${money(open.reduce((a, i) => a + i.amount, 0))}</b><div class="small t2">${T('Every invoice carries its PO and property GL code. Pay them all in one ACH payment.', 'Cada factura lleva su PO y código contable. Págalas en un solo pago ACH.')}</div><div class="flex">${h.btn(T('Review and pay', 'Revisar y pagar'), { kind: 'primary', go: 'portal.billing' })}${h.btn(T('Download statement', 'Descargar estado de cuenta'), { act: 'pt-dl', icon: 'download' })}</div>` + ptable([{ k: 'id', label: 'Invoice', m: true }, { k: 'prop', label: 'Property' }, { k: 'po', label: 'PO', m: true }, { k: 'amount', label: 'Amount', n: true, fmt: v => money(v) }], open, { dense: true }) }),
        h.card({ title: T('Documents for AP', 'Documentos para cuentas por pagar'), flush: true, body: h.list([{ icon: 'archive', title: 'W-9 (2027)', sub: T('Signed Jan 2027', 'Firmado ene 2027'), go: 'portal.documents' }, { icon: 'shield', title: T('Certificate of insurance', 'Certificado de seguro'), sub: T('Valid to Mar 31, 2028', 'Vigente al 31 mar 2028'), go: 'portal.documents' }]) })])
      + pside(c, 'Billing contact: money only. No schedules, photos or proposals (02 §5.11).');
  }
  if (sc === 'approver') {
    const mine = K.items.filter(i => i.mode === 'vote' || i.mode === 'seq' || i.mode === 'limit');
    return h.page({ title: greet(c), sub: `${esc(K.name)} · ${K.isHoa ? T('board member, approver', 'miembro de la junta, aprobador') : T('approver', 'aprobador')}` })
      + pcols('21', [h.card({ title: T('Your next step', 'Tu siguiente paso'), body: pend.filter(i => i.mode === 'vote').slice(0, 1).map(i => `<b style="font-size:1.05rem">${T('Your vote is needed', 'Se necesita tu voto')}: ${esc(T(i.title[0], i.title[1]))} (${money(i.amount)})</b><div class="small t2">${T(`Board vote: ${i.voted} of 5 voted. Passes at 2 yes votes. Votes are revealed when the vote closes.`, `Votación: ${i.voted} de 5 votaron. Se aprueba con 2 votos a favor.`)}</div>${h.progress(i.voted, 5)}`).join('') + `<div class="flex">${h.btn(T('Review and vote', 'Revisar y votar'), { kind: 'primary', go: 'portal.approvals' })}</div>` + h.list(mine.map(i => ({ icon: 'approve', title: `${i.id} · ${esc(T(i.title[0], i.title[1]))}`, sub: money(i.amount), go: 'portal.approvals' }))) }),
        h.card({ title: T('Your approver access', 'Tu acceso de aprobador'), body: `<div class="small">${T('Ends Dec 31, 2027 with your board term.', 'Termina el 31 dic 2027 con tu periodo en la junta.')}</div><div class="tiny t3">${T(`Items under ${money(K.limit)} are approved by the ${K.isHoa ? 'community manager' : 'property manager'}.`, `Los asuntos menores a ${money(K.limit)} los aprueba el administrador.`)}</div>` })])
      + pside(c, 'Approver: home shows approvals only; acts only within the approval policy (21 §5.4, 02 §5.11).');
  }
  const viewer = sc === 'viewer';
  const spent = K.props.reduce((a, p) => a + p.spent, 0), budget = K.props.reduce((a, p) => a + p.budget, 0);
  return h.page({ title: greet(c), sub: `${esc(K.name)} · ${K.props.length} ${T('properties with', 'propiedades con')} ${esc(c.t.name)}`, tags: viewer ? h.pill(T('View only', 'Solo lectura'), 'info', 'eye') : '' })
    + h.kpis([{ label: T('Waiting on you', 'Te esperan'), value: viewer ? '-' : String(pend.filter(i => i.mode === 'limit').length), delta: viewer ? '' : money(pend.filter(i => i.mode === 'limit').reduce((a, i) => a + i.amount, 0)) }, { label: T('Open requests', 'Solicitudes abiertas'), value: String(K.props.reduce((a, p) => a + p.open, 0)) }, { label: T('Visits on schedule', 'Visitas a tiempo'), value: '97%' }, viewer ? { label: T('Snow events this season', 'Eventos de nieve'), value: c.winter ? '7' : '11' } : { label: T('Spend YTD', 'Gasto del año'), value: h.kmoney(spent), delta: `${Math.round(100 * spent / budget)}% ${T('of budget', 'del presupuesto')}` }])
    + pcols('21', [`<div class="stack12">${viewer ? '' : h.card({ title: T('Your next step', 'Tu siguiente paso'), body: pend.filter(i => i.mode === 'limit').slice(0, 1).map(i => `<b style="font-size:1.05rem">${T('Approve', 'Aprobar')} ${i.id}: ${esc(T(i.title[0], i.title[1]))} (${money(i.amount)})</b><div class="small t2">${T('Within your approval limit. A PO number is required.', 'Dentro de tu límite. Se requiere número de PO.')}</div>`).join('') + h.btn(T('Open approvals', 'Abrir aprobaciones'), { kind: 'primary', go: 'portal.approvals' }) })}
      ${h.card({ title: c.winter ? T('Storm today across your sites', 'Tormenta hoy en tus sitios') : T('Today across your sites', 'Hoy en tus sitios'), flush: true, body: h.list(K.props.slice(0, 4).map((p, i) => ({ icon: c.winter ? 'snow' : 'truck', tone: i === 0 ? 'ok' : i === 1 ? 'info' : '', title: esc(p.name), sub: c.winter ? [T('Plowed and salted 5:02-5:31 am', 'Despejado y con sal 5:02-5:31 am'), T('Crew on site', 'Cuadrilla en sitio'), T('Next in route', 'Siguiente en ruta'), T('Queued (priority 2)', 'En cola (prioridad 2)')][i] : [T('Maintenance done 8:40 am', 'Mantenimiento hecho 8:40 am'), T('Crew on site', 'Cuadrilla en sitio'), T('Scheduled Thu', 'Programado jue'), T('Scheduled Fri', 'Programado vie')][i] }))) })}</div>`,
      `<div class="stack12">${h.card({ title: T('Portfolio', 'Cartera'), body: h.bars(K.props.slice(0, 5).map(p => ({ label: esc(p.name), value: viewer ? p.budget * .4 : p.spent, max: viewer ? p.budget : p.budget, tone: p.over && !viewer ? 'warn' : '', right: viewer ? p.score : h.kmoney(p.spent) }))) + h.btn(T('Open portfolio', 'Abrir cartera'), { sm: true, go: 'portal.portfolio' }) })}</div>`])
    + pside(c, viewer ? 'Viewer: read-only on shared items; no requests, no money (02 §5.11).' : 'Commercial primary: portfolio workspace with approvals, POs and proof of service (06 §4.16).');
}
RL.act('pt-dl', (el, ev, c) => { RL.toast(c.tr('PDF downloaded (mock).', 'PDF descargado (simulado).')); return false; });

// ---------- portal.proposals and portal.proposal ----------
function comProposal(c, K, id) {
  const it = K.items.find(i => i.id === id) || K.items[0];
  return { id: it.id, title: it.title, amount: it.amount, prop: it.prop, it };
}
RL.screen('portal.proposals', (c) => {
  const T = c.tr, viewer = c.scope === 'viewer';
  if (CM(c)) {
    const K = comCtx(c);
    const rows = K.items.filter(i => i.id.startsWith('PR') || i.id.startsWith('CO')).map(i => ({ id: i.id, title: T(i.title[0], i.title[1]), prop: i.prop, amount: i.amount, status: i.st === 'approved' || i.st === 'yes' ? T('Approved', 'Aprobada') : i.mode === 'vote' ? T('Board vote', 'Votación') : i.mode === 'seq' ? T('Waiting on regional VP', 'Esperando VP regional') : T('Waiting for approval', 'Esperando aprobación') }));
    return h.page({ title: T('Proposals and designs', 'Propuestas y diseños'), sub: `${esc(K.name)} · ${T('enhancements routed by your approval policy', 'mejoras según tu política de aprobación')}`, tags: viewer ? h.pill(T('Shared with you, view only', 'Compartido contigo, solo lectura'), 'info', 'eye') : '' })
      + h.card({ flush: true, body: ptable([{ k: 'id', label: T('Proposal', 'Propuesta'), m: true }, { k: 'title', label: T('Title', 'Título') }, { k: 'prop', label: T('Property', 'Propiedad') }, { k: 'amount', label: T('Amount', 'Monto'), n: true, fmt: v => money(v) }, { k: 'status', label: T('Status', 'Estado'), fmt: v => h.pill(v, /Approved|Aprobada/.test(v) ? 'ok' : 'warn') }], rows, { go: 'portal.proposal' }) })
      + h.card({ title: T('Designs shared with you', 'Diseños compartidos'), body: `<div class="${isPhone() ? 'stack8' : 'cols cols-3'}">${['mockup', 'bed', 'night'].map((k, i) => `<div class="stack8">${h.photo(k, { badge: i === 0 ? T('AI-generated', 'Generado por IA') : T('Design plan', 'Plano') })}<span class="small b">${esc(K.props[i % K.props.length].name)}</span></div>`).join('')}</div>` });
  }
  const X = resCtx(c);
  const sts = { review: T('Ready for you', 'Lista para ti'), sign: T('Ready to sign', 'Lista para firmar'), deposit: T('Signed, deposit due', 'Firmada, depósito pendiente'), done: T('Signed and deposit paid', 'Firmada y depósito pagado') };
  const rows = [{ id: X.pr.id, title: esc(X.R.project), amount: X.opt.price, sent: c.winter ? 'Jan 6' : 'May 9', status: sts[X.step] || sts.review, cur: true }, { id: 'PR-2241', title: X.designOnly ? T('Planting plan, phase 1', 'Plan de plantas, fase 1') : T('Spring cleanup and mulch 2027', 'Limpieza de primavera y mantillo 2027'), amount: X.designOnly ? 900 : 640, sent: 'Mar 2', status: T('Signed', 'Firmada') }];
  return h.page({ title: T('Proposals and designs', 'Propuestas y diseños'), sub: esc(X.prop.address || X.R.property) })
    + pcols('21', [h.card({ title: T('Open proposal', 'Propuesta abierta'), body: `<div class="${isPhone() ? 'stack8' : 'cols cols-2'}" style="gap:12px;align-items:center">${h.photo('mockup', { badge: T('AI-generated concept', 'Concepto generado por IA') })}<div class="stack8"><b style="font-size:1.1rem">${esc(X.R.project)}</b><div class="small t2">${T('Prepared by', 'Preparada por')} ${esc(X.est)} · ${T('valid until', 'válida hasta')} ${c.winter ? 'Feb 5' : 'Jun 8'}</div><div class="small">${T('3 options', '3 opciones')}: ${X.tiers.map(t => `${T(t.en, t.es)} ${money(t.price)}`).join(' · ')}</div>${h.pill(sts[X.step] || sts.review, X.step === 'done' ? 'ok' : 'warn')}${h.btn(T('Open proposal', 'Abrir propuesta'), { kind: 'primary', go: 'portal.proposal', x: X.pr.id })}</div></div>` }),
      h.card({ title: T('All proposals', 'Todas las propuestas'), flush: true, body: h.list(rows.map(r => ({ icon: 'pen', title: `${r.id} · ${r.title}`, sub: `${money(r.amount)} · ${T('sent', 'enviada')} ${r.sent} · ${r.status}`, go: r.cur ? 'portal.proposal' : null, x: r.cur ? r.id : null }))) })]);
});
const LINES = (c, X, k) => {
  const T = c.tr;
  if (X.designOnly) return [[T('Site visit and measurements', 'Visita y medición'), .15], [T('Concept plan, 2 revision rounds', 'Plano concepto, 2 rondas'), .35], [T('Planting plan with plant list', 'Plan de plantas con lista'), .35], [T('AI mockups, 3 views', 'Imágenes IA, 3 vistas'), .15]];
  const base = [[T('Concrete paver patio, 420 ft², tumbled finish', 'Patio de adoquines, 420 ft², acabado envejecido'), .46], [T('Seat wall, 18 in high, 24 ft', 'Muro banco, 18 in, 24 ft'), .16], [T('Foundation beds: 38 plants, mulch, steel edging', 'Camas de base: 38 plantas, mantillo, borde de acero'), .2], [T('Grading, drainage and restoration', 'Nivelación, drenaje y restauración'), .18]];
  if (k === 'good') return [[base[0][0], .62], [base[2][0], .22], [base[3][0], .16]];
  if (k === 'best') return base.map(l => [l[0], l[1] * .82]).concat([[T('Gas fire pit and 6 path lights', 'Fogata de gas y 6 luces de camino'), .18]]);
  return base;
};
RL.screen('portal.proposal', (c) => {
  const T = c.tr, sc = c.scope, viewer = sc === 'viewer';
  if (CM(c)) return comProposalView(c);
  const X = resCtx(c), st = X.step, slide = Number(U('pp.slide', '0'));
  const slides = [['mockup', T('AI-generated mockup: patio and beds', 'Imagen generada por IA: patio y camas'), true], ['before', T('Your yard today (photo)', 'Tu jardín hoy (foto)'), false], ['night', T('AI-generated mockup: evening lighting', 'Imagen generada por IA: iluminación de noche'), true]];
  const s = slides[slide % 3];
  const lines = LINES(c, X, X.opt.k).map(l => ({ d: l[0], amt: rnd(X.opt.price * l[1], 10) }));
  const diff = X.opt.price - lines.reduce((a, l) => a + l.amt, 0); lines[0].amt += diff;
  const stepUp = X.opt.price > 10000;
  let action;
  if (st === 'done') action = h.card({ tone: 'ok', title: `${icon('check')} ${T('Signed and deposit paid', 'Firmada y depósito pagado')}`, body: `<div class="small">${T(`Receipt sent. ${money(X.dep)} was paid to ${esc(c.t.name)}.`, `Recibo enviado. Se pagaron ${money(X.dep)} a ${esc(c.t.name)}.`)}</div>${h.btn(T('Download signed PDF', 'Descargar PDF firmado'), { sm: true, act: 'pt-dl', icon: 'download' })}` });
  else if (st === 'sign') action = h.card({ title: T('Sign your proposal', 'Firma tu propuesta'), body: h.field(T('Type your full name', 'Escribe tu nombre completo'), h.input(strip(c.who), { label: 'Name' }))
      + (stepUp ? `<div class="xnote">${T(`Over ${money(10000)}, we confirm it is you: a 6-digit code was sent to your phone on file ending 0142.`, `Por encima de ${money(10000)} confirmamos tu identidad: enviamos un código de 6 dígitos a tu teléfono que termina en 0142.`)}</div>${h.field(T('Verification code', 'Código de verificación'), h.input('', { ph: '••••••', label: 'Code' }))}` : '')
      + `<label class="flex small"><input type="checkbox" checked data-self> ${T('I agree to the terms and the 1-year plant warranty conditions.', 'Acepto los términos y las condiciones de garantía de plantas de 1 año.')}</label>` + h.btn(stepUp ? T('Verify and sign', 'Verificar y firmar') : T('Sign', 'Firmar'), { kind: 'primary', ui: 'pp.step', val: 'deposit', icon: 'pen' }) });
  else if (st === 'deposit') action = h.card({ title: T('Pay your 30% deposit', 'Paga tu depósito de 30%'), body: `<div style="font-size:1.4rem;font-weight:750" class="num">${money(X.dep, { cents: true })}</div>${wrap(h.tabs('pp.pm', [['card', T('Card', 'Tarjeta')], ['ach', T('Bank (ACH)', 'Banco (ACH)')], ['saved', 'Visa 4242']], 'card'))}`
      + (h.tab('pp.pm', 'card') === 'saved' ? `<div class="small t2">${T('Paying with a saved card needs a quick sign-in check (code or passkey).', 'Pagar con una tarjeta guardada requiere confirmar tu identidad (código o passkey).')}</div>` : h.tab('pp.pm', 'card') === 'ach' ? h.field(T('Bank account', 'Cuenta bancaria'), h.input('', { ph: T('Connect your bank', 'Conecta tu banco') })) : `<div class="${isPhone() ? 'stack8' : 'cols cols-2'}" style="gap:8px">${h.field(T('Card number', 'Número de tarjeta'), h.input('', { ph: '1234 1234 1234 1234' }))}${h.field(T('Expiry and CVC', 'Vencimiento y CVC'), h.input('', { ph: 'MM / YY   CVC' }))}</div>`)
      + `<div class="tiny t3">${T(`Paid to ${esc(c.t.name)} through its own Stripe account. Card details never touch ${esc(c.t.name)}'s systems.`, `Pago a ${esc(c.t.name)} por su propia cuenta de Stripe.`)}</div>` + h.btn(`${T('Pay', 'Pagar')} ${money(X.dep)}`, { kind: 'primary', ui: 'pp.step', val: 'done', icon: 'card' }) });
  else action = viewer ? h.card({ body: `<div class="small t2">${T('View only.', 'Solo lectura.')}</div>` }) : h.card({ title: `${T('Total', 'Total')} ${money(X.opt.price)}`, body: `<div class="small">${T('Deposit due at signing (30%)', 'Depósito al firmar (30%)')}: <b>${money(X.dep)}</b></div><div class="flex">${h.btn(T('Approve and sign', 'Aprobar y firmar'), { kind: 'primary', ui: 'pp.step', val: 'sign', icon: 'check' })}${h.btn(T('Ask a question', 'Hacer una pregunta'), { modal: 'pp-q', val: 'General' })}${h.btn('PDF', { act: 'pt-dl', icon: 'download' })}</div>${stepUp ? `<div class="tiny t3">${T(`Signing over ${money(10000)} needs a one-time code to your phone on file.`, `Firmar por más de ${money(10000)} requiere un código a tu teléfono.`)}</div>` : ''}` });
  const hero = `<div class="stack8"><div style="position:relative">${h.photo(s[0], { badge: s[2] ? T('AI-generated', 'Generado por IA') : T('Photo', 'Foto') })}</div><div class="flex between"><span class="small">${s[2] ? h.ai(T('AI concept', 'Concepto IA')) + ' ' : ''}${esc(s[1])}</span><span class="flex gap4">${slides.map((x, i) => h.btn(String(i + 1), { sm: true, ui: 'pp.slide', val: String(i), kind: i === slide % 3 ? 'primary' : '' })).join('')}</span></div><div class="tiny t3">${T('Mockups are AI-generated illustrations. The plan and plant list are what gets built.', 'Las imágenes son ilustraciones generadas por IA. Se construye lo del plano y la lista de plantas.')}</div></div>`;
  const tiers = `<div class="${isPhone() ? 'stack8' : 'cols cols-3'}" style="gap:8px">${X.tiers.map(t => `<button type="button" data-ui="pp.opt" data-val="${t.k}" class="cd" style="text-align:left;padding:12px;cursor:pointer;display:grid;gap:4px;border:2px solid ${t.k === X.opt.k ? 'var(--primary)' : 'var(--border)'}"><span class="small b">${T(t.en, t.es)}${t.rec ? ' · ' + T('Recommended', 'Recomendada') : ''}</span><span style="font-size:1.25rem;font-weight:750" class="num">${money(t.price)}</span><span class="tiny t3">${esc(LINES(c, X, t.k).map(l => l[0].split(',')[0]).slice(0, 3).join(' · '))}</span>${t.k === X.opt.k ? h.pill(T('Selected', 'Seleccionada'), 'ok', 'check') : ''}</button>`).join('')}</div>`;
  const plants = RL.PLANTS.filter(p => p.rating === 'Recommended').slice(0, 5);
  return h.page({ title: esc(X.R.project), sub: `${X.pr.id} · ${T('prepared by', 'preparada por')} ${esc(X.est)} · ${T('valid until', 'válida hasta')} ${c.winter ? 'Feb 5' : 'Jun 8'}`, crumbs: [[T('Proposals', 'Propuestas'), 'portal.proposals'], [X.pr.id]] })
    + pcols('21', [`<div class="stack12">${hero}<b>${T('Choose your option', 'Elige tu opción')}</b>${tiers}${h.card({ title: T("What's included", 'Qué incluye'), flush: true, body: ptable([{ k: 'd', label: T('Line item', 'Concepto') }, { k: 'amt', label: T('Amount', 'Monto'), n: true, fmt: v => money(v) }, { k: 'q', label: '', fmt: (v, r) => viewer ? '' : h.btn(T('Ask', 'Preguntar'), { sm: true, modal: 'pp-q', val: r.d.slice(0, 40) }) }], lines, { foot: [T('Total', 'Total'), money(X.opt.price), ''] }) })}${h.card({ title: T('Plants in this design', 'Plantas del diseño'), flush: true, body: h.list(plants.map((p, i) => ({ icon: 'leaf', tone: 'ok', title: `${[12, 24, 3, 18, 9][i]} ${esc(p.common)}`, sub: `<i>${esc(p.botanical)}</i> · ${esc(p.sun)}` }))) })}</div>`,
      `<div class="stack12">${action}${h.card({ title: T('Terms', 'Términos'), body: `<div class="small t2">${T('1-year plant warranty with watering conditions. Start window confirmed after the deposit, weather permitting.', 'Garantía de plantas de 1 año con condiciones de riego. Fecha de inicio confirmada tras el depósito, según el clima.')}</div>` })}</div>`])
    + h.note(`E-sign then deposit through Stripe on ${esc(c.t.name)}'s connected account. Step-up code above the Company threshold (default $10,000; 06 §4.2.5). AI never signs or pays (tier T4).`);
});
RL.modal('pp-q', (c, el) => ({ title: c.tr('Ask about this line', 'Preguntar sobre este concepto'), body: `<div class="small t2">${esc(el && el.dataset.val || '')}</div>` + h.textarea('', { ph: c.tr('Can we use a darker paver color?', '¿Podemos usar un adoquín más oscuro?') }) + h.note(c.tr('Your question opens a thread with the estimator on this line.', 'Tu pregunta abre una conversación con el estimador sobre este concepto.')), foot: h.btn(c.tr('Send', 'Enviar'), { kind: 'primary', act: 'pp-q-send' }) }));
RL.act('pp-q-send', (el, ev, c) => { RL.closeModal(); RL.toast(c.tr('Question sent. You will get a text when they answer.', 'Pregunta enviada. Te avisamos por mensaje.')); return false; });
function comProposalView(c) {
  const T = c.tr, K = comCtx(c), sc = c.scope, P = comProposal(c, K, c.x), it = P.it;
  const over = P.amount > K.limit;
  const canAct = (sc === 'primary' && (it.mode === 'limit')) || (sc === 'approver' && it.mode === 'vote');
  let act;
  if (sc === 'viewer') act = `<div class="small t2">${T('Shared with you, view only.', 'Compartido contigo, solo lectura.')}</div>`;
  else if (sc === 'approver') act = it.mode === 'vote' ? `<div class="small">${T('Over $5,000: board vote, 2 yes votes of 5 needed.', 'Más de $5,000: votación, se necesitan 2 votos a favor de 5.')}</div>${h.btn(T('Go to ballot', 'Ir a la boleta'), { kind: 'primary', go: 'portal.approvals' })}` : `<div class="small t2">${T(`Under ${money(K.limit)}: the community manager approves this alone.`, `Menos de ${money(K.limit)}: lo aprueba el administrador.`)}</div>`;
  else act = it.mode === 'seq' ? `<div class="small">${T(`You approved on ${it.first}. Waiting on ${K.vp} (regional VP), second in sequence.`, `Aprobaste el ${it.first}. Falta ${K.vp} (VP regional), segundo en la secuencia.`)}</div>` : canAct ? `<div class="small">${T(`Within your authority, up to ${money(K.limit)}.`, `Dentro de tu autoridad, hasta ${money(K.limit)}.`)}</div>${h.btn(T('Approve with PO', 'Aprobar con PO'), { kind: 'primary', go: 'portal.approvals' })}` : `<div class="small t2">${T('Pre-approved at contract unit rates.', 'Pre-aprobado a tarifas del contrato.')}</div>`;
  return h.page({ title: esc(T(P.title[0], P.title[1])), sub: `${P.id} · ${esc(P.prop)} · ${money(P.amount)}`, crumbs: [[T('Proposals', 'Propuestas'), 'portal.proposals'], [P.id]] })
    + pcols('21', [`<div class="stack12">${h.photo('mockup', { badge: T('AI-generated concept', 'Concepto generado por IA') })}<div class="tiny t3">${T('AI-generated illustration. Scope and plant list are binding.', 'Ilustración generada por IA. El alcance y la lista de plantas son lo que se construye.')}</div>${h.card({ title: T('Scope', 'Alcance'), flush: true, body: ptable([{ k: 'd', label: T('Line', 'Concepto') }, { k: 'a', label: T('Amount', 'Monto'), n: true, fmt: v => money(v) }], [{ d: esc(T(P.title[0], P.title[1])), a: rnd(P.amount * .78, 10) }, { d: T('Disposal, restoration and mulch', 'Retiro, restauración y mantillo'), a: P.amount - rnd(P.amount * .78, 10) }], { foot: [T('Total', 'Total'), money(P.amount)] }) })}</div>`,
      h.card({ title: T('Approval', 'Aprobación'), body: act + `<div class="tiny t3">${T(`This uses ${money(P.amount)} of ${money(K.budget.total - K.budget.used)} remaining enhancement budget.`, `Usa ${money(P.amount)} de ${money(K.budget.total - K.budget.used)} restantes del presupuesto.`)}</div>${over ? `<div class="tiny t3">${T('Approving over $5,000 asks for an SMS code or passkey.', 'Aprobar más de $5,000 pide código SMS o passkey.')}</div>` : ''}` })]);
}

// ---------- portal.schedule ----------
function monthCal(c, marks) {
  const T = c.tr, off = c.winter ? 5 : 6, today = c.winter ? 12 : 11;
  const dows = c.es ? ['D', 'L', 'M', 'M', 'J', 'V', 'S'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  let cells = dows.map(d => `<div class="tiny t3" style="text-align:center;font-weight:700">${d}</div>`).join('');
  for (let i = 0; i < off; i++) cells += '<div></div>';
  for (let d = 1; d <= 31; d++) { const m = marks[d]; cells += `<div style="text-align:center;padding:6px 0;border-radius:7px;font-size:.78rem;${d === today ? 'outline:2px solid var(--primary);' : ''}${m ? `background:var(--${m}-bg);color:var(--${m}-text);font-weight:700` : ''}">${d}</div>`; }
  return `<div class="flex between"><b class="small">${c.winter ? T('January 2027', 'Enero 2027') : T('May 2027', 'Mayo 2027')}</b><span class="flex gap4 tiny">${h.pill(T('Visit', 'Visita'), 'ok')}${h.pill(T('Program', 'Programa'), 'info')}${h.pill(T('Skipped', 'Omitida'), 'warn')}</span></div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px">${cells}</div>`;
}
RL.screen('portal.schedule', (c) => {
  const T = c.tr, sc = c.scope, ro = sc === 'approver' || sc === 'viewer', W = c.winter;
  if (CM(c)) {
    const K = comCtx(c), sel = K.props.find(p => p.name === RL.ui['sch.prop']) || K.props[0];
    const rows = (W ? [[T('Today', 'Hoy'), T('Storm: plow and salt lot, walks', 'Tormenta: despejar y sal en lote, aceras'), T('In progress', 'En curso')], ['Jan 19', T('Winter site check', 'Revisión de invierno'), T('Scheduled', 'Programada')], [T('On trigger', 'Al llegar a 2 in'), T('Snow service, 2 in push trigger', 'Despeje al llegar a 2 in'), T('Standing', 'Permanente')]]
      : [['Thu May 13', T('Weekly maintenance: mow, edge, litter', 'Mantenimiento semanal: corte, orillado, basura'), T('Scheduled', 'Programada')], ['Thu May 20', T('Weekly maintenance and bed weeding', 'Mantenimiento y deshierbe de camas'), T('Scheduled', 'Programada')], ['May 24-28', T('Seasonal color install (if approved)', 'Instalación de flores (si se aprueba)'), T('Pending approval', 'Pendiente de aprobación')], ['Jun 2', T('Irrigation mid-season audit', 'Auditoría de riego'), T('Scheduled', 'Programada')]]).map(r => ({ d: r[0], s: r[1], st: r[2] }));
    return h.page({ title: T('Schedule', 'Calendario'), sub: `${esc(sel.name)}${ro ? ' · ' + T('view only', 'solo lectura') : ''}` })
      + (K.props.length > 1 ? `<div style="max-width:320px">${h.select(K.props.map(p => p.name), sel.name, { ui: 'sch.prop', label: 'Property' })}</div>` : '')
      + pcols('21', [h.card({ title: T('Upcoming visits', 'Próximas visitas'), flush: true, body: ptable([{ k: 'd', label: T('When', 'Cuándo') }, { k: 's', label: T('Service', 'Servicio') }, { k: 'st', label: T('Status', 'Estado'), fmt: v => h.pill(v, /progress|curso/i.test(v) ? 'info' : /Pending|Pendiente/.test(v) ? 'warn' : '') }], rows) }),
        h.card({ body: monthCal(c, W ? { 3: 'ok', 12: 'ok', 19: 'info' } : { 6: 'ok', 13: 'ok', 20: 'ok', 27: 'ok', 24: 'info', 25: 'info' }) + `<div class="tiny t3">${T('Reschedule requests route to your approver first when a policy applies.', 'Las solicitudes de cambio van primero a tu aprobador si hay política.')}</div>` + (ro ? '' : h.btn(T('Request a change', 'Pedir un cambio'), { sm: true, modal: 'sch-move' })) })])
      + pside(c, sc === 'property_contact' ? 'Property contact: assigned property only (21 §5.4).' : 'Commercial schedule per property; arrival windows shown per Company setting (06 §4.7.1).');
  }
  const X = resCtx(c);
  if (X.designOnly) return h.page({ title: T('Schedule', 'Calendario'), sub: esc(X.R.property) }) + h.card({ title: T('Design appointments', 'Citas de diseño'), flush: true, body: h.list([{ icon: 'calendar', title: T('Design review meeting', 'Reunión de revisión'), sub: 'Tue May 18 · 10:00 am · ' + esc(X.designer) }, { icon: 'pen', title: T('Final plan delivery', 'Entrega del plano final'), sub: T('After your review', 'Después de tu revisión') }]) });
  const visits = W ? [{ id: 'sv1', d: T('On trigger', 'Al llegar a 2 in'), s: T('Snow push, drive and walks', 'Despeje de nieve, entrada y aceras'), w: T('Within 4 h of snowfall end', 'Dentro de 4 h tras la nevada'), skip: false }, { id: 'sv2', d: 'Mar 22 - Apr 9', s: T('Spring cleanup', 'Limpieza de primavera'), w: T('We confirm the date a week before', 'Confirmamos la fecha una semana antes'), skip: false, move: true }]
    : [{ id: 'v1', d: T('Today', 'Hoy'), s: T('Weekly mowing', 'Corte semanal'), w: '10:20-10:50 am · ' + T('crew on the way', 'cuadrilla en camino'), skip: false, today: true }, { id: 'v2', d: 'Tue May 18', s: T('Weekly mowing', 'Corte semanal'), w: '8:00-10:00 am', skip: true }, { id: 'v3', d: 'Tue May 25', s: T('Weekly mowing', 'Corte semanal'), w: '8:00-10:00 am', skip: true }, X.lawn ? { id: 'v4', d: 'Jun 7-18', s: T('Lawn round 3: broadleaf weed control', 'Ronda 3: control de hoja ancha'), w: T('We text 2 days before', 'Avisamos 2 días antes'), skip: false, move: true } : null].filter(Boolean);
  const skipped = visits.filter(v => RL.ui['skip.' + v.id]).length;
  const prog = X.lawn ? [['Round 1: pre-emergent + fertilizer', 'Ronda 1: preemergente + fertilizante', 'Mar 29', 'done'], ['Round 2: fertilizer + crabgrass', 'Ronda 2: fertilizante + pasto cangrejo', 'May 11', 'done'], ['Round 3: broadleaf weed control', 'Ronda 3: control de hoja ancha', 'Jun 7-18', 'next'], ['Round 4: summer fertilizer + grub preventive', 'Ronda 4: fertilizante de verano + gusano blanco', 'Jul 12-23', ''], ['Round 5: fall fertilizer and aeration', 'Ronda 5: fertilizante de otoño y aireación', 'Sep 15-Oct 10', ''], ['Round 6: winterizer', 'Ronda 6: invernal', 'Nov 1-15', '']]
    : [['Mowing season: 30 visits', 'Temporada de corte: 30 visitas', 'Apr-Nov', 'next'], ['Spring cleanup', 'Limpieza de primavera', 'Apr 12', 'done'], ['Fall cleanup', 'Limpieza de otoño', 'Oct 25-Nov 12', '']];
  return h.page({ title: T('Schedule', 'Calendario'), sub: `${esc(X.prop.address || X.R.property)}${ro ? ' · ' + T('view only', 'solo lectura') : ''}` })
    + pcols('21', [`<div class="stack12">${h.card({ title: T('Upcoming visits', 'Próximas visitas'), flush: true, body: `<div class="li">${visits.map(v => { const sk = RL.ui['skip.' + v.id]; return `<div class="li-i"><span class="ico ${v.today ? 'ok' : sk ? 'warn' : ''}">${icon(v.today ? 'truck' : sk ? 'x' : 'calendar')}</span><div class="grow"><div class="tt">${esc(v.d)} · ${esc(v.s)}</div><div class="ss">${sk ? T('Skip requested: no charge for a skipped per-visit mow', 'Omisión pedida: no se cobra un corte omitido') : esc(v.w)}</div></div><span class="flex gap4">${ro || sc === 'property_contact' && !v.skip ? '' : v.today ? `<span class="tiny t3">${T('Past the cutoff', 'Pasó la hora límite')}</span>` : v.skip ? h.btn(sk ? T('Undo', 'Deshacer') : T('Skip', 'Omitir'), { sm: true, ui: 'skip.' + v.id, val: sk ? '' : 'true' }) : v.move ? h.btn(T('Reschedule', 'Reprogramar'), { sm: true, modal: 'sch-move' }) : ''}</span></div>`; }).join('')}</div>` })}
      ${h.card({ title: T('Skip and reschedule rules', 'Reglas para omitir y reprogramar'), body: `<div class="small t2">${T(`Weekly mowing can be skipped until 6:00 pm the day before. ${3 - 1 - skipped} of 3 skips left this season. Skipped per-visit mows are not charged.`, `El corte semanal se puede omitir hasta las 6:00 pm del día anterior. Te quedan ${3 - 1 - skipped} de 3 omisiones. Los cortes omitidos no se cobran.`)}</div>${ro ? '' : h.btn(T('Vacation hold', 'Pausa por vacaciones'), { sm: true, modal: 'sch-hold', icon: 'pause' })}` })}</div>`,
      `<div class="stack12">${h.card({ body: monthCal(c, W ? { 10: 'ok', 3: 'ok' } : Object.assign({ 4: 'ok', 11: 'ok', 18: 'ok', 25: 'ok' }, RL.ui['skip.v2'] ? { 18: 'warn' } : {}, RL.ui['skip.v3'] ? { 25: 'warn' } : {})) })}${h.card({ title: X.lawn ? T('2027 lawn program', 'Programa de césped 2027') : T('Your program', 'Tu programa'), flush: true, body: h.list(prog.map(p => ({ icon: p[3] === 'done' ? 'check' : 'leaf', tone: p[3] === 'done' ? 'ok' : p[3] === 'next' ? 'info' : '', title: esc(T(p[0], p[1])), sub: p[2], right: p[3] === 'next' ? h.pill(T('Next', 'Siguiente'), 'info') : '' }))) })}</div>`])
    + pside(c, ro ? 'Read-only schedule for this contact scope.' : 'Skip and reschedule follow Company rules: cutoff, billing effect and max skips per season (06 §4.10.4).');
});
RL.modal('sch-move', (c) => ({ title: c.tr('Pick a new time', 'Elige otra fecha'), body: ['Wed Jun 9 · 8:00-12:00', 'Thu Jun 10 · 12:00-4:00', 'Mon Jun 14 · 8:00-12:00'].map((s, i) => `<label class="flex small" style="padding:8px 0;border-bottom:1px solid var(--border)"><input type="radio" name="slot"${i === 0 ? ' checked' : ''} data-self> ${s}</label>`).join('') + h.note(c.tr('Slots come from the Company calendar. The office confirms.', 'Las fechas vienen del calendario de la empresa. La oficina confirma.')), foot: h.btn(c.tr('Request this time', 'Pedir esta fecha'), { kind: 'primary', act: 'sch-req' }) }));
RL.modal('sch-hold', (c) => ({ title: c.tr('Vacation hold', 'Pausa por vacaciones'), body: h.field(c.tr('From', 'Desde'), h.input('Jun 21')) + h.field(c.tr('To', 'Hasta'), h.input('Jul 2')) + `<label class="flex small"><input type="checkbox" checked data-self> ${c.tr('Mow the day before we return', 'Cortar el día antes de volver')}</label>`, foot: h.btn(c.tr('Pause visits', 'Pausar visitas'), { kind: 'primary', act: 'sch-req' }) }));
RL.act('sch-req', (el, ev, c) => { RL.closeModal(); RL.toast(c.tr('Request sent. You get a confirmation text.', 'Solicitud enviada. Recibirás un mensaje de confirmación.')); return false; });

// ---------- portal.billing ----------
RL.screen('portal.billing', (c) => {
  const T = c.tr, sc = c.scope;
  if (sc === 'property_contact') return handled(c);
  if (CM(c)) {
    const K = comCtx(c), open = K.invoices.filter(i => i.status !== 'Paid');
    const sel = open.filter(i => RL.ui['bsel.' + i.id] !== 'false');
    const tot = sel.reduce((a, i) => a + i.amount, 0);
    return h.page({ title: T('Invoices and payments', 'Facturas y pagos'), sub: `${esc(K.name)} · ${T('remit to', 'pagar a')} ${esc(c.t.name)}` })
      + h.kpis([{ label: T('Open', 'Abierto'), value: money(open.reduce((a, i) => a + i.amount, 0)) }, { label: T('Invoices with a PO', 'Facturas con PO'), value: '100%', tone: 'ok', delta: T('PO required by your policy', 'PO requerido por tu política') }, { label: T('Next due', 'Próximo vencimiento'), value: open[0] ? open[0].due : '-' }])
      + h.card({ title: T('Open invoices', 'Facturas abiertas'), flush: true, body: ptable([{ k: 'sel', label: '', fmt: (v, r) => `<button type="button" class="icon-btn" data-ui="bsel.${r.id}" data-val="${RL.ui['bsel.' + r.id] !== 'false' ? 'false' : 'true'}" aria-label="Select">${icon(RL.ui['bsel.' + r.id] !== 'false' ? 'check' : 'list')}</button>` }, { k: 'id', label: T('Invoice', 'Factura'), m: true }, { k: 'prop', label: T('Property', 'Propiedad') }, { k: 'desc', label: T('Description', 'Descripción') }, { k: 'po', label: 'PO', m: true }, { k: 'gl', label: 'GL', m: true }, { k: 'due', label: T('Due', 'Vence') }, { k: 'amount', label: T('Amount', 'Monto'), n: true, fmt: v => money(v) }], open, { empty: T('Nothing open. Thank you.', 'Nada abierto. Gracias.') }) })
      + (open.length ? `<div class="flex">${h.btn(`${T('Pay by ACH', 'Pagar por ACH')} ${money(tot)} (${sel.length})`, { kind: 'primary', modal: 'pay-ach', disabled: !sel.length })}${h.btn(T('Download CSV', 'Descargar CSV'), { act: 'pt-dl', icon: 'download' })}${h.btn(T('Statement PDF', 'Estado de cuenta PDF'), { act: 'pt-dl', icon: 'download' })}</div>` : '')
      + pcols('2', [h.card({ title: T('Payment methods', 'Métodos de pago'), body: meta('ACH', T('Operating account •••• 3120', 'Cuenta •••• 3120')) + `<div class="tiny t3">${T('Adding or removing a method needs a passkey or code each time.', 'Agregar o quitar un método requiere passkey o código cada vez.')}</div>` + (sc === 'viewer' || sc === 'approver' ? '' : h.btn(T('Add bank account', 'Agregar cuenta'), { sm: true, modal: 'stepup' })) }),
        h.card({ title: T('Paid', 'Pagadas'), flush: true, body: h.list(K.invoices.filter(i => i.status === 'Paid').map(i => ({ icon: 'check', tone: 'ok', title: `${i.id} · ${money(i.amount)}`, sub: `${esc(i.prop)} · ${i.po}` }))) })])
      + pside(c, 'Every invoice carries the PO and the property GL code; one ACH payment allocates across invoices (06 §4.16.8). Payments are never blocked.');
  }
  const X = resCtx(c), co = sc === 'co_owner';
  const ap = U('autopay', X.autopay ? 'on' : 'off') === 'on';
  return h.page({ title: T('Invoices and payments', 'Facturas y pagos'), sub: `${T('Paid to', 'Pagos a')} ${esc(c.t.name)} ${T('through its own Stripe account', 'por su propia cuenta de Stripe')}` })
    + pcols('21', [`<div class="stack12">${h.card({ title: T('Open', 'Por pagar'), flush: true, body: X.open.length ? ptable([{ k: 'id', label: T('Invoice', 'Factura'), m: true }, { k: 'desc', label: T('Description', 'Descripción'), fmt: v => esc(T(v[0], v[1])) }, { k: 'due', label: T('Due', 'Vence') }, { k: 'amount', label: T('Amount', 'Monto'), n: true, fmt: v => money(v, { cents: true }) }], X.open) + `<div class="flex" style="padding:8px 12px">${h.btn(`${T('Pay', 'Pagar')} ${money(X.bal, { cents: true })}`, { kind: 'primary', modal: 'pay-card' })}${ap ? `<span class="tiny t3">${T(`Or let autopay charge it on ${X.open[0].due}.`, `O deja que el autopago lo cobre el ${X.open[0].due}.`)}</span>` : ''}</div>` : h.empty(T('Nothing to pay. Thank you.', 'Nada por pagar. Gracias.')) })}
      ${h.card({ title: T('Paid', 'Pagadas'), flush: true, body: ptable([{ k: 'id', label: T('Invoice', 'Factura'), m: true }, { k: 'desc', label: T('Description', 'Descripción'), fmt: v => esc(T(v[0], v[1])) }, { k: 'paid', label: T('Paid', 'Pagada') }, { k: 'amount', label: T('Amount', 'Monto'), n: true, fmt: v => money(v, { cents: true }) }, { k: 'r', label: '', fmt: () => h.btn(T('Receipt', 'Recibo'), { sm: true, act: 'pt-dl' }) }], X.inv.filter(i => i.status === 'Paid')) })}</div>`,
      `<div class="stack12">${h.card({ title: T('Autopay', 'Autopago'), body: `<div class="flex between"><b>${ap ? T('On', 'Activo') : T('Off', 'Inactivo')}</b>${co ? h.pill(T(`Managed by ${first(X.R.primary)}`, `Lo maneja ${first(X.R.primary)}`), 'info', 'lock') : h.btn(ap ? T('Turn off', 'Desactivar') : T('Turn on', 'Activar'), { sm: true, modal: 'stepup', val: ap ? 'off' : 'on' })}</div><div class="small t2">${ap ? T('Invoices are charged to Visa ending 4242 on their due date. You get a receipt each time.', 'Las facturas se cobran a la Visa 4242 al vencer. Recibes un recibo cada vez.') : T('Turn on autopay to skip paying each invoice.', 'Activa el autopago para no pagar cada factura.')}</div>` })}
      ${h.card({ title: T('Payment methods', 'Métodos de pago'), body: meta('Visa •••• 4242', T('Default, exp 08/29', 'Principal, vence 08/29')) + meta(T('Bank •••• 6789', 'Banco •••• 6789'), 'ACH') + (co ? `<div class="tiny t3">${T(`${first(X.R.primary)} (primary contact) manages saved methods and autopay. You can still pay with a new card.`, `${first(X.R.primary)} (principal) maneja los métodos guardados y el autopago. Puedes pagar con una tarjeta nueva.`)}</div>` : h.btn(T('Add method', 'Agregar método'), { sm: true, modal: 'stepup' })) })}
      ${h.card({ title: T('Statements', 'Estados de cuenta'), flush: true, body: h.list((c.winter ? ['December 2026', 'November 2026'] : ['April 2027', 'March 2027']).map(m => ({ icon: 'download', title: m, act: 'pt-dl' }))) })}</div>`])
    + pside(c, co ? 'Co-owner: pays, but payment methods and autopay are Company-configurable and off by default (21 §5.4).' : 'Changing autopay or payment methods always needs step-up (06 §4.2.5). Never block a Company from getting paid.');
});
RL.modal('pay-card', (c) => { const X = resCtx(c); return { title: `${c.tr('Pay', 'Pagar')} ${money(X.bal, { cents: true })}`, body: `<div class="small t2">${c.tr('Paid to', 'Pago a')} <b>${esc(c.t.name)}</b> ${c.tr('through its own Stripe account.', 'por su propia cuenta de Stripe.')}</div>` + h.field(c.tr('Card number', 'Número de tarjeta'), h.input('', { ph: '1234 1234 1234 1234' })) + h.field(c.tr('Expiry and CVC', 'Vencimiento y CVC'), h.input('', { ph: 'MM / YY   CVC' })) + h.note(c.tr('A new card needs no extra code. Using the saved Visa 4242 asks for a quick sign-in check.', 'Una tarjeta nueva no requiere código. Usar la Visa 4242 guardada pide confirmar identidad.')), foot: h.btn(c.tr('Pay', 'Pagar'), { kind: 'primary', act: 'pay-do' }) }; });
RL.modal('pay-ach', (c) => { const K = comCtx(c); const sel = K.invoices.filter(i => i.status !== 'Paid' && RL.ui['bsel.' + i.id] !== 'false'); return { title: c.tr('One ACH payment', 'Un pago ACH'), body: h.table([{ k: 'id', label: 'Invoice', m: true }, { k: 'po', label: 'PO', m: true }, { k: 'amount', label: 'Allocated', n: true, fmt: v => money(v) }], sel, { dense: true, foot: ['Total', '', money(sel.reduce((a, i) => a + i.amount, 0))] }) + h.note(c.tr('From operating account •••• 3120. Remittance detail goes to the Company with each PO.', 'Desde la cuenta •••• 3120. El detalle va a la empresa con cada PO.')), foot: h.btn(c.tr('Send payment', 'Enviar pago'), { kind: 'primary', act: 'pay-ach-do' }) }; });
RL.act('pay-do', (el, ev, c) => { resCtx(c).open.forEach(i => { RL.ui['paid.' + i.id] = 'true'; }); RL.closeModal(); RL.toast(c.tr('Payment received. Receipt emailed.', 'Pago recibido. Recibo enviado.')); });
RL.act('pay-ach-do', (el, ev, c) => { comCtx(c).invoices.filter(i => i.status !== 'Paid' && RL.ui['bsel.' + i.id] !== 'false').forEach(i => { RL.ui['paid.' + i.id] = 'true'; }); RL.closeModal(); RL.toast(c.tr('ACH payment scheduled. Clears in 2-4 business days.', 'Pago ACH programado. Se acredita en 2-4 días hábiles.')); });
RL.modal('stepup', (c, el) => { const v = el && el.dataset.val; return { title: c.tr('Confirm it is you', 'Confirma que eres tú'), body: `<div class="small">${c.tr('We sent a 6-digit code to your phone on file ending 0142. Or use your passkey.', 'Enviamos un código de 6 dígitos a tu teléfono que termina en 0142. O usa tu passkey.')}</div>` + h.input('', { ph: '••••••', label: 'Code' }) + h.note(c.tr('Payment methods, autopay and contacts always need this check (06 §4.2.5).', 'Métodos de pago, autopago y contactos siempre lo requieren.')), foot: h.btn(c.tr('Use passkey', 'Usar passkey'), { act: 'stepup-do', val: v }) + h.btn(c.tr('Verify', 'Verificar'), { kind: 'primary', act: 'stepup-do', val: v }) }; });
RL.act('stepup-do', (el, ev, c) => { if (el.dataset.val === 'on' || el.dataset.val === 'off') RL.ui.autopay = el.dataset.val; RL.closeModal(); RL.toast(c.tr('Verified. Change saved.', 'Verificado. Cambio guardado.')); });

// ---------- portal.requests ----------
RL.screen('portal.requests', (c) => {
  const T = c.tr, sc = c.scope, com = CM(c);
  const K = com ? comCtx(c) : null, X = com ? null : resCtx(c);
  const props = com ? K.props.map(p => p.name) : [X.prop.address || X.R.property];
  const sent = RL.ui['rq.sent'];
  const nPh = Number(U('rq.ph', '0'));
  const list = com && sc === 'property_contact' ? [
    { t: ['Broken sprinkler head flooding the sidewalk', 'Cabeza de aspersor rota inundando la acera'], st: 'done', when: 'May 6', end: T('Fixed May 7, 9:40 am', 'Arreglado 7 may, 9:40 am'), photo: true },
    { t: ['Litter in the front beds', 'Basura en las camas del frente'], st: 'sched', when: 'May 9', end: T('Scheduled with the Thu May 13 visit', 'Programado con la visita del jue 13 may') },
  ] : com ? [
    { t: [`${props[0]}: broken sprinkler head flooding the sidewalk`, `${props[0]}: aspersor roto inundando la acera`], st: 'done', when: 'May 6', end: T('Fixed May 7 · reported by the site contact', 'Arreglado 7 may · reportado por el contacto'), photo: true, po: K.po(7) },
    { t: [`${props[1 % props.length]}: dead shrubs at the entrance`, `${props[1 % props.length]}: arbustos secos en la entrada`], st: 'quote', when: 'May 8', end: T('Proposal sent for approval', 'Propuesta enviada para aprobación'), po: '' },
    { t: [`${props[2 % props.length]}: pothole near the dumpster pad`, `${props[2 % props.length]}: bache cerca de los contenedores`], st: 'new', when: 'May 10', end: T('Received, triage today', 'Recibida, revisión hoy'), po: '' },
  ] : [
    { t: ['Drainage near the downspout', 'Drenaje junto al bajante'], st: 'quote', when: 'May 9', end: sc === 'property_contact' ? T('Quote sent to the account holder', 'Cotización enviada al titular') : T('Site visit Fri May 14, then a quote', 'Visita vie 14 may, luego cotización') },
    { t: ['Broken sprinkler head, zone 3', 'Aspersor roto, zona 3'], st: 'done', when: 'May 3', end: T('Fixed May 4 · after photo', 'Arreglado 4 may · foto después'), photo: true },
  ];
  if (sent) list.unshift({ t: [U('rq.desc', 'New request'), U('rq.desc', 'Nueva solicitud')], st: 'new', when: T('Just now', 'Ahora'), end: T('Received. We reply within 1 business day.', 'Recibida. Respondemos en 1 día hábil.') });
  const stp = { done: [T('Completed', 'Completada'), 'ok'], sched: [T('Scheduled', 'Programada'), 'info'], quote: [T('Quote', 'Cotización'), 'warn'], new: [T('Submitted', 'Enviada'), ''] };
  const form = h.card({ title: T('New request', 'Nueva solicitud'), body: (props.length > 1 ? h.field(T('Property', 'Propiedad'), h.select(props, props[0], { ui: 'rq.prop' })) : `<div class="small t2">${icon('pin', 's')} ${esc(props[0])}</div>`)
    + h.field(T('What do you need?', '¿Qué necesitas?'), h.select([T('Something is broken', 'Algo está roto'), T('Irrigation', 'Riego'), T('Plants or trees', 'Plantas o árboles'), T('New work or a quote', 'Trabajo nuevo o cotización'), T('Other', 'Otro')], ''))
    + h.field(T('Describe it', 'Descríbelo'), h.textarea(U('rq.desc', ''), { ui: 'rq.desc', ph: T('A sprinkler head is spraying the sidewalk by the east door.', 'Un aspersor moja la acera junto a la puerta este.'), label: 'Description' }))
    + `<div class="flex">${Array.from({ length: Math.min(nPh, 2) }, () => `<span style="width:84px">${h.photo('lawn')}</span>`).join('')}${h.btn(T('Add photo', 'Añadir foto'), { sm: true, act: 'rq-photo', icon: 'camera' })}</div>`
    + (com && c.inLens('V1') && sc !== 'property_contact' ? h.field(`${T('PO number', 'Número de PO')} ${h.tag('V1')}`, h.input('', { ph: K.po(9) }), T(`Format ${abbr(K.name)}-000000; the invoice carries it.`, `Formato ${abbr(K.name)}-000000; la factura lo lleva.`)) : '')
    + h.btn(T('Send request', 'Enviar solicitud'), { kind: 'primary', act: 'rq-send', icon: 'send' }) });
  const track = h.card({ title: T('Your requests', 'Tus solicitudes'), flush: true, body: `<div class="li">${list.map(r => `<div class="li-i" style="align-items:start"><span class="ico ${stp[r.st][1]}">${icon(r.st === 'done' ? 'check' : r.st === 'quote' ? 'pen' : 'clock')}</span><div class="grow"><div class="tt">${esc(T(r.t[0], r.t[1]))}</div><div class="ss">${T('Sent', 'Enviada')} ${r.when} · ${esc(r.end)}${r.po ? ' · PO ' + r.po : ''}</div>${r.photo ? `<div class="cols cols-2" style="gap:6px;max-width:300px;margin-top:6px">${h.photo('before', { badge: T('Reported', 'Reportado') })}${h.photo('after', { badge: T('Fixed', 'Arreglado') })}</div>` : ''}</div>${h.pill(stp[r.st][0], stp[r.st][1])}</div>`).join('')}</div>` });
  return h.page({ title: T('Requests', 'Solicitudes'), sub: T('Send a photo and we take it from there.', 'Manda una foto y nosotros nos encargamos.') }) + pcols('12', [form, track])
    + pside(c, sc === 'property_contact' ? 'Property contact: requests for the assigned property; quotes go to the account holder with no amount shown here.' : 'Requests create a service request or an opportunity for the office; commercial work orders carry a PO (V1).');
});
RL.act('rq-photo', () => { RL.ui['rq.ph'] = String(Number(RL.ui['rq.ph'] || 0) + 1); });
RL.act('rq-send', (el, ev, c) => { RL.ui['rq.sent'] = 'true'; RL.toast(c.tr('Request sent with your photos.', 'Solicitud enviada con tus fotos.')); });

// ---------- portal.history ----------
RL.screen('portal.history', (c) => {
  const T = c.tr, sc = c.scope, com = CM(c), W = c.winter, D = c.D;
  const K = com ? comCtx(c) : null, X = com ? null : resCtx(c);
  const clientId = com ? null : X.R.clientId;
  const crewA = D.crews[0] || null;
  const todayV = com ? null : X.done;
  const ck = todayV && chemKey(todayV.service);
  const A = ck ? applicatorFor(D, todayV.crew) : null;
  const turf = com ? { total: 18400 } : turfOf(D, clientId);
  const W0 = wx(c);
  const entries = [];
  if (W) {
    entries.push({ id: 'h0', when: com ? 'Jan 12, 5:02-5:31 am' : 'Jan 10, 6:15-6:38 am', what: T('Snow service: push and salt', 'Servicio de nieve: despeje y sal'), note: T('2 pushes, 1 salt application, walks cleared. 4 photos with GPS.', '2 despejes, 1 aplicación de sal, aceras. 4 fotos con GPS.'), kind: 'snow' });
    entries.push({ id: 'h1', when: 'Jan 3, 4:40-5:05 am', what: T('Snow service: push', 'Servicio de nieve: despeje'), note: T('1 push, walks cleared.', '1 despeje, aceras.'), kind: 'snow' });
    entries.push({ id: 'h2', when: 'Nov 12', what: T('Fall cleanup (2 of 2)', 'Limpieza de otoño (2 de 2)'), note: T('Leaves removed, beds cut back.', 'Hojas retiradas, camas recortadas.'), kind: 'after' });
  } else {
    if (todayV) entries.push({ id: 'h0', when: `${T('Today', 'Hoy')} ${t12(toMin(todayV.start))}`, what: svc(c, todayV.service), note: ck ? T('Granular application on front and back turf; lawn markers posted.', 'Aplicación granulada en frente y atrás; banderas puestas.') : T('Service completed.', 'Servicio completado.'), kind: 'after', chem: ck });
    entries.push({ id: 'h1', when: 'May 4', what: com ? T('Weekly maintenance', 'Mantenimiento semanal') : T('Weekly mowing', 'Corte semanal'), note: T('Mowed at 3.5 in, edged walks, beds blown clean.', 'Cortado a 3.5 in, aceras orilladas, camas limpias.'), kind: 'after' });
    entries.push({ id: 'h2', when: 'Apr 27', what: T('Weekly mowing', 'Corte semanal'), note: T('First cut of the season.', 'Primer corte de la temporada.'), kind: 'lawn' });
    if (!com && X.lawn) entries.push({ id: 'h3', when: 'Mar 29', what: T('Lawn round 1: pre-emergent + fertilizer', 'Ronda 1: preemergente + fertilizante'), note: T('Granular application, front and back.', 'Aplicación granulada, frente y atrás.'), kind: 'lawn', chem: 'pre', old: true });
    entries.push({ id: 'h4', when: 'Apr 12', what: T('Spring cleanup', 'Limpieza de primavera'), note: T('Beds cleaned and edged, 3 yd mulch.', 'Camas limpias y orilladas, 3 yd de mantillo.'), kind: 'bed' });
  }
  const tab = h.tab('hist.tab', 'all');
  const shown = entries.filter(e => tab === 'all' || (tab === 'chem' ? e.chem : e.kind !== 'lawn'));
  const open = U('hist.open', 'h0');
  const chemBlock = (key, old) => { const P = CHEM[key], a = old ? { name: crewA ? crewA.lead : 'Crew lead', lic: licOf(D, crewA && crewA.lead) || null, sup: licOf(D, crewA && crewA.lead) ? null : licensedPeople(D, crewA && crewA.lead)[0] } : A; return h.card({ tone: 'warn', title: `${icon('flask')} ${T('Application record', 'Registro de aplicación')}`, body: h.kv([[T('Product', 'Producto'), esc(T(P.en, P.es))], [T('EPA Reg. No.', 'Reg. EPA'), `<span class="mono">${P.epa}</span> <span class="tiny t3">${T('(placeholder)', '(ejemplo)')}</span>`], [T('Active ingredient', 'Ingrediente activo'), esc(P.ai)], [T('Rate and area', 'Dosis y área'), `${P.rate} ${P.unit} / 1,000 ft² · ${h.num(turf.total)} ft²`], [T('Target', 'Objetivo'), P.target.map(t => esc(T(t[0], t[1]))).join(', ')], [T('Weather', 'Clima'), `${W0.t}°F · ${T('wind', 'viento')} ${W0.wind} mph ${dirTr(c, W0.dir)}`], [T('Applicator', 'Aplicador'), `${esc(a.name)}${a.lic ? ' · ' + esc(a.lic) : a.sup ? ' · ' + T('under supervision of', 'bajo supervisión de') + ' ' + esc(a.sup.name) + ' (' + esc(a.sup.cert) + ')' : ''}`]]) + pban(`<b>${T('Re-entry', 'Reingreso')}:</b>&nbsp;${esc(T(P.rei[0], P.rei[1]))}`, 'warn') }); };
  return h.page({ title: T('Service history', 'Historial de servicio'), sub: com ? esc(K.props[0].name) + (K.props.length > 1 ? ` ${T('and', 'y')} ${K.props.length - 1} ${T('more', 'más')}` : '') : esc(X.prop.address || X.R.property) })
    + wrap(h.tabs('hist.tab', [['all', T('All', 'Todo'), entries.length], ['photos', T('With photos', 'Con fotos')], ['chem', T('Applications', 'Aplicaciones'), entries.filter(e => e.chem).length]], 'all'))
    + (shown.length ? shown.map(e => { const isOpen = open === e.id; return h.card({ title: `${esc(e.when)} · ${e.what}`, sub: esc(e.note), actions: h.btn(isOpen ? T('Hide', 'Ocultar') : T('Open report', 'Ver informe'), { sm: true, ui: 'hist.open', val: isOpen ? 'none' : e.id }), body: isOpen ? `<div class="${isPhone() ? 'stack8' : 'cols cols-3'}" style="gap:8px">${h.photo(e.kind === 'snow' ? 'snow' : 'before', { badge: T('Before', 'Antes') })}${h.photo(e.kind === 'snow' ? 'snow' : e.kind === 'lawn' ? 'lawn' : 'after', { badge: T('After', 'Después') })}${e.kind === 'snow' ? h.photo('snow', { badge: '5:24 AM · 39.97, -83.04' }) : h.photo('bed', { badge: T('Beds', 'Camas') })}</div>`
      + `<div class="small">${T('Checklist', 'Lista')}: ${e.kind === 'snow' ? T('lot plowed, salt applied, walks cleared', 'lote despejado, sal aplicada, aceras') : T('mow, edge, trim, blow; after photos', 'cortar, orillar, recortar, soplar; fotos')}</div>`
      + (e.chem ? chemBlock(e.chem, e.old) : '')
      + (com || sc === 'property_contact' ? (sc === 'property_contact' ? `<div class="tiny t3">${icon('lock', 's')} ${T('Billing for this visit: handled by the account holder.', 'Facturación de esta visita: la maneja el titular.')}</div>` : '') : `<div class="tiny t3">${T('Billed on your level-billing plan; no separate charge.', 'Incluido en tu plan de pago nivelado; sin cargo aparte.')}</div>`) : '' }); }).join('') : h.empty(T('No applications on record for this property.', 'No hay aplicaciones registradas para esta propiedad.')))
    + pside(c, 'Visit reports show who, when, what, photos and chemical applications with label re-entry text, never improvised by AI (06 §4.7.5).');
});

// ---------- portal.property ----------
RL.screen('portal.property', (c) => {
  const T = c.tr, sc = c.scope, com = CM(c), ro = ['property_contact', 'approver', 'viewer'].includes(sc) && !(sc === 'property_contact' && !com);
  const X = com ? null : resCtx(c), K = com ? comCtx(c) : null;
  const prop = com ? null : X.prop;
  const plants = RL.PLANTS.filter(p => p.rating === 'Recommended').slice(0, 6);
  const care = [['Water 2 gallons twice a week until fall.', 'Riega 2 galones dos veces por semana hasta el otoño.'], ['Cut back to 6 in in early spring.', 'Recorta a 6 in a principios de primavera.'], ['Leave seed heads for winter birds.', 'Deja las semillas para los pájaros en invierno.'], ['No fertilizer needed.', 'No necesita fertilizante.'], ['Prune right after flowering.', 'Poda justo después de la floración.'], ['Mulch 2 in, keep off the stem.', 'Mantillo de 2 in, lejos del tallo.']];
  const editable = !com && (sc === 'primary' || sc === 'co_owner' || sc === 'property_contact');
  const access = h.card({ title: T('Access notes and instructions', 'Notas de acceso e instrucciones'), body: h.kv([
    [T('Gate code', 'Código del portón'), `<span class="mono">${com ? '••••' : (prop && prop.gate ? '•••• ' : T('none', 'ninguno'))}</span> <span class="tiny t3">${T('stored encrypted; the crew sees it only on the visit day', 'guardado cifrado; la cuadrilla lo ve solo el día de la visita')}</span>`],
    [T('Pets', 'Mascotas'), com ? '-' : esc(prop && prop.dog ? prop.dog.replace('friendly', T('friendly', 'amigable')) + ' · ' + T('back yard', 'patio trasero') : T('Dog inside on Tuesdays', 'Perro adentro los martes'))],
    [T('Parking', 'Estacionamiento'), com ? T('Trailer parking at the rear lot', 'Remolque en el lote trasero') : T('Street, do not block the drive', 'En la calle, no bloquear la entrada')],
    [T('Irrigation controller', 'Controlador de riego'), esc(prop && prop.controller ? prop.controller : T('Garage wall', 'Pared del garaje'))],
  ]) + (editable ? h.btn(T('Edit notes', 'Editar notas'), { sm: true, act: 'prop-edit', icon: 'pen' }) : `<div class="tiny t3">${T('View only for your access.', 'Solo lectura para tu acceso.')}</div>`) });
  if (com) {
    return h.page({ title: T('Properties', 'Propiedades'), sub: esc(K.name) })
      + h.card({ flush: true, body: ptable([{ k: 'name', label: T('Property', 'Propiedad') }, { k: 'next', label: T('Next visit', 'Próxima visita') }, { k: 'open', label: T('Open requests', 'Solicitudes'), n: true }, { k: 'score', label: T('Inspection score', 'Puntaje de inspección'), n: true }], K.props) })
      + pcols('2', [access, h.card({ title: T('Site plan', 'Plano del sitio'), body: h.map({ pins: K.props.slice(0, 6).map((p, i) => ({ x: p.x, y: p.y, n: i + 1, tone: 'accent', label: p.name })), seed: 11, h: 200 }) })]);
  }
  return h.page({ title: T('My landscape', 'Mi jardín'), sub: esc(prop.address || X.R.property) + ` · ${h.num(prop.turf || 8000)} ft² ${T('lawn', 'césped')} · ${prop.beds || 5} ${T('beds', 'camas')}` })
    + pcols('21', [h.card({ title: T('Plants on your property', 'Plantas en tu propiedad'), flush: true, body: ptable([{ k: 'common', label: T('Plant', 'Planta'), fmt: (v, r) => `<b>${esc(v)}</b><div class="tiny t3"><i>${esc(r.botanical)}</i></div>` }, { k: 'inst', label: T('Installed', 'Plantada') }, { k: 'war', label: T('Warranty', 'Garantía'), fmt: v => h.pill(v, /Active|Vigente/.test(v) ? 'ok' : '') }, { k: 'care', label: T('Care tip', 'Cuidado') }], plants.map((p, i) => Object.assign({}, p, { inst: i < 3 ? 'Oct 2026' : 'May 2025', war: i < 3 ? T('Active to Oct 2027', 'Vigente a oct 2027') : T('Ended', 'Terminó'), care: T(care[i][0], care[i][1]) }))) }), access])
    + pside(c, 'Plant care tips come from the curated Plant KB; warranty tracking links to install records (06 §4.12).');
});
RL.act('prop-edit', (el, ev, c) => { RL.toast(c.tr('Notes saved. The crew sees a "changed" badge on the next visit.', 'Notas guardadas. La cuadrilla verá "cambió" en la próxima visita.')); return false; });

// ---------- portal.messages ----------
RL.screen('portal.messages', (c) => {
  const T = c.tr, sc = c.scope, com = CM(c), cast = c.t.cast || {};
  const est = strip(cast.estimator || c.owner), off = strip(cast.office_manager || c.owner), bk = strip(cast.bookkeeper || cast.office_manager || c.owner);
  let threads = sc === 'billing' ? [{ id: 'bill', name: T('Billing', 'Facturación'), who: bk }]
    : com ? [{ id: 'site', name: T('Service team', 'Equipo de servicio'), who: off }, { id: 'bill', name: T('Billing', 'Facturación'), who: bk }]
    : [{ id: 'prop', name: T('Proposal questions', 'Preguntas de la propuesta'), who: est }, { id: 'site', name: T('Visits', 'Visitas'), who: off }, { id: 'bill', name: T('Billing', 'Facturación'), who: bk }];
  if (sc === 'property_contact') threads = threads.filter(t => t.id === 'site');
  const cur = threads.find(t => t.id === RL.ui['pm.th']) || threads[0];
  const me = first(c.who) || T('You', 'Tú');
  const bubble = (mine, who, text, when) => `<div style="display:grid;justify-items:${mine ? 'end' : 'start'};gap:2px"><div style="max-width:80%;padding:9px 12px;border-radius:12px;font-size:.86rem;background:${mine ? 'var(--primary)' : 'var(--surface-2)'};color:${mine ? 'var(--on-primary)' : 'var(--text)'}">${text}</div><span class="tiny t3">${esc(who)} · ${when}</span></div>`;
  const msgs = {
    prop: [bubble(true, me, T('Can the patio be a darker color? And is the fire pit gas or wood?', '¿El patio puede ser más oscuro? ¿La fogata es de gas o leña?'), 'May 9, 7:12 pm'), bubble(false, est, T('Yes, charcoal blend is the same price. The Best option has a gas fire pit; Better has a wood-burning kit.', 'Sí, el gris carbón tiene el mismo precio. La opción Superior tiene fogata de gas; la Mejor, de leña.'), 'May 10, 8:05 am')],
    site: com && sc === 'property_contact' ? [bubble(true, me, T('Sprinkler head broken by the east door, water on the sidewalk.', 'Cabeza de aspersor rota junto a la puerta este, agua en la acera.'), 'May 6, 2:10 pm'), bubble(false, off, T('Fixed this morning. After photo is in your request.', 'Arreglado esta mañana. La foto está en tu solicitud.'), 'May 7, 9:48 am')]
      : [bubble(false, off, c.winter ? T('Snow crew is on the way, ETA 5:30-6:00 am.', 'La cuadrilla de nieve va en camino, llegada 5:30-6:00 am.') : T('Your crew is on the way, ETA 10:20-10:50 am.', 'Tu cuadrilla va en camino, llegada 10:20-10:50 am.'), T('Today 9:58 am', 'Hoy 9:58 am')), bubble(true, me, T('Thanks! The side gate is unlocked.', '¡Gracias! El portón lateral está abierto.'), T('Today 10:02 am', 'Hoy 10:02 am'))],
    bill: [bubble(false, bk, com ? T('The May statement is ready. Every line carries its PO.', 'El estado de mayo está listo. Cada línea lleva su PO.') : T('Your receipt for INV-3290 is attached.', 'Adjuntamos tu recibo de INV-3290.'), 'May 3'), bubble(true, me, T('Got it, thank you.', 'Recibido, gracias.'), 'May 3')],
  };
  const list = h.card({ flush: true, body: h.list(threads.map(t => ({ icon: t.id === 'bill' ? 'receipt' : t.id === 'prop' ? 'pen' : 'truck', tone: t.id === cur.id ? 'info' : '', title: t.name, sub: esc(t.who), act: 'pm-th', x: t.id }))) });
  const conv = h.card({ title: `${cur.name} · ${esc(cur.who)}`, body: `<div style="display:grid;gap:10px">${(msgs[cur.id] || []).join('')}</div><div class="flex nw mt8"><input class="inp" placeholder="${esc(T('Write a message', 'Escribe un mensaje'))}" aria-label="Message">${h.btn(icon('camera'), { act: 'pm-photo', title: 'Photo' })}${h.btn(T('Send', 'Enviar'), { kind: 'primary', act: 'pm-send' })}</div>` });
  return h.page({ title: T('Messages', 'Mensajes'), sub: `${T('Threads with', 'Conversaciones con')} ${esc(c.t.name)}` }) + pcols('12', [list, conv])
    + pside(c, sc === 'billing' ? 'Billing contact: billing threads only (21 §5.4).' : 'Messages land in the Company unified inbox; staff replies come back here and by SMS or email per consent.');
});
RL.act('pm-th', (el) => { RL.ui['pm.th'] = el.dataset.x; });
RL.act('pm-send', (el, ev, c) => { RL.toast(c.tr('Message sent.', 'Mensaje enviado.')); return false; });
RL.act('pm-photo', (el, ev, c) => { RL.toast(c.tr('Photo attached (mock).', 'Foto adjunta (simulada).')); return false; });

// ---------- portal.account ----------
RL.screen('portal.account', (c) => {
  const T = c.tr, sc = c.scope, com = CM(c), manage = sc === 'primary';
  const K = com ? comCtx(c) : null, R = c.D.res;
  const contacts = com ? [[K.pm, 'primary', T(`All ${K.props.length}`, `Todas (${K.props.length})`), K.isHoa ? '-' : money(K.limit)], [K.isHoa ? K.ap + ' + 4 board' : K.vp + ' (regional VP)', 'approver', T('All', 'Todas'), K.isHoa ? T('Vote, 2 of 5 over $5,000', 'Voto, 2 de 5 sobre $5,000') : T('Unlimited, second', 'Ilimitado, segundo')], [strip(c.D.com.billing), 'billing', T('All', 'Todas'), '-'], [strip(c.D.com.site), 'property_contact', (String(c.D.com.site).match(/\(([^)]+)\)/) || [, '-'])[1], '-'], [strip(c.D.com.viewer), 'viewer', T('Shared items', 'Compartidos'), '-']]
    : [[strip(R.primary), 'primary', T('All', 'Todo'), T('Yes', 'Sí')], [strip(R.co_owner), 'co_owner', T('All', 'Todo'), T('Pays; methods managed by primary', 'Paga; métodos los maneja el principal')], [strip(R.resident), 'property_contact', esc(R.property), T('No money', 'Sin dinero')]];
  const ch = [['sms', 'Text messages', 'Mensajes de texto', true], ['email', 'Email', 'Correo', true], ['mkt', 'Seasonal offers', 'Ofertas de temporada', false]];
  return h.page({ title: T('Account', 'Cuenta'), sub: `${esc(strip(c.who))} · ${esc(c.as.label)}` })
    + pcols('2', [`<div class="stack12">${h.card({ title: T('Language', 'Idioma'), body: `<div class="flex">${h.btn('English', { set: 'lang=en', kind: c.es ? '' : 'primary' })}${h.btn('Español', { set: 'lang=es', kind: c.es ? 'primary' : '' })}</div><div class="tiny t3">${T('Texts, emails and visit reports follow your language.', 'Mensajes, correos e informes siguen tu idioma.')}</div>` })}
      ${h.card({ title: T('Notifications and consent', 'Notificaciones y consentimiento'), body: ch.map(x => `<div class="flex between">${h.toggle(T(x[1], x[2]), 'cons.' + x[0], x[3])}<span class="tiny t3">${x[3] ? T('Opted in May 2, 2027 via portal', 'Aceptado el 2 may 2027 en el portal') : T('Not opted in', 'Sin aceptar')}</span></div>`).join('') + `<div class="tiny t3">${T('Consent is stored per channel with source and time. Reply STOP to any text to opt out.', 'El consentimiento se guarda por canal con fuente y hora. Responde STOP para salir.')}</div>` })}
      ${h.card({ title: T('Sign-in and security', 'Acceso y seguridad'), body: meta(T('Passkey', 'Passkey'), RL.ui['pk.added'] ? T('iPhone, added today', 'iPhone, agregada hoy') : T('None yet', 'Ninguna')) + meta(T('Active sessions', 'Sesiones activas'), T('2 (this browser, iPhone)', '2 (este navegador, iPhone)')) + `<div class="flex">${h.btn(T('Add a passkey', 'Agregar passkey'), { sm: true, ui: 'pk.added', val: 'true', icon: 'key' })}${h.btn(T('Sign out everywhere', 'Cerrar sesión en todo'), { sm: true, act: 'acc-out' })}</div>` })}</div>`,
      h.card({ title: T('People on this account', 'Personas en esta cuenta'), actions: manage ? h.btn(T('Invite', 'Invitar'), { sm: true, kind: 'primary', modal: 'stepup', icon: 'plus' }) : '', flush: true, body: ptable([{ k: 0, label: T('Person', 'Persona'), fmt: v => `<b>${esc(v)}</b>` }, { k: 1, label: T('Scope', 'Alcance'), fmt: v => h.pill(v, v === sc ? 'info' : '') }, { k: 2, label: T('Properties', 'Propiedades') }, { k: 3, label: com ? T('Approval limit', 'Límite de aprobación') : T('Money', 'Dinero') }], contacts) + `<div class="tiny t3" style="padding:8px 12px">${manage ? T('Only the primary contact adds or removes people, and each change needs a code or passkey.', 'Solo el contacto principal agrega o quita personas, con código o passkey.') : T('Only the primary contact can change who has access.', 'Solo el contacto principal cambia quién tiene acceso.')}</div>` })])
    + pside(c, 'Account: contacts and scopes (primary only), own language, notifications, consent and passkeys for everyone (21 §5.4).');
});
RL.act('acc-out', (el, ev, c) => { RL.toast(c.tr('Signed out of all other sessions.', 'Sesiones cerradas en otros dispositivos.')); return false; });

// =====================================================================
// COMMERCIAL WORKSPACE (V1; 06 §4.16; 21 §18.17)
// =====================================================================
RL.screen('portal.portfolio', (c) => {
  const T = c.tr, K = comCtx(c), sc = c.scope, money_ = sc !== 'viewer', ops = sc !== 'billing';
  const spent = K.props.reduce((a, p) => a + p.spent, 0), budget = K.props.reduce((a, p) => a + p.budget, 0);
  const pendBy = n => K.items.filter(i => i.prop === n && !i.st && i.mode !== 'auto').length;
  const cols = [{ k: 'name', label: T('Property', 'Propiedad'), fmt: (v, r) => `<b>${esc(v)}</b>${r.over && money_ ? ` ${h.pill(T('Over pace', 'Sobre el ritmo'), 'warn')}` : ''}` }];
  if (ops) cols.push({ k: 'next', label: T('Next visit', 'Próxima visita') }, { k: 'open', label: T('Open requests', 'Solicitudes'), n: true });
  if (sc !== 'billing') cols.push({ k: 'pend', label: T('Pending approvals', 'Aprobaciones'), n: true, fmt: (v, r) => pendBy(r.name) ? h.pill(String(pendBy(r.name)), 'warn') : '0' });
  if (money_) cols.push({ k: 'spent', label: T('YTD spend vs budget', 'Gasto vs presupuesto'), fmt: (v, r) => `<div style="min-width:150px">${h.progress(r.spent, r.budget, r.over ? 'warn' : '')}<span class="tiny t2 num">${h.kmoney(r.spent)} / ${h.kmoney(r.budget)}</span></div>` });
  if (ops) cols.push({ k: 'score', label: T('Inspection', 'Inspección'), n: true });
  const kp = [{ label: T('Properties', 'Propiedades'), value: String(K.props.length) }];
  if (money_) kp.push({ label: T('Spend YTD', 'Gasto del año'), value: h.kmoney(spent), delta: `${Math.round(100 * spent / budget)}% ${T('of', 'de')} ${h.kmoney(budget)}` });
  if (sc !== 'billing') kp.push({ label: T('Pending approvals', 'Aprobaciones pendientes'), value: String(K.items.filter(i => !i.st && i.mode !== 'auto').length) });
  if (ops) kp.push({ label: T('Visits on schedule', 'Visitas a tiempo'), value: '97%', tone: 'ok', delta: T('last 30 days', 'últimos 30 días') }, { label: T('Snow events this season', 'Eventos de nieve'), value: c.winter ? '7' : '11' });
  return h.page({ title: T('Portfolio', 'Cartera'), sub: `${esc(K.name)} · ${c.winter ? T('fiscal year 2027, January', 'año fiscal 2027, enero') : T('fiscal year 2027, through May', 'año fiscal 2027, hasta mayo')}`, tags: sc === 'viewer' ? h.pill(T('View only', 'Solo lectura'), 'info', 'eye') : sc === 'billing' ? h.pill(T('Billing view: money only', 'Vista de facturación: solo dinero'), 'info') : '' })
    + h.kpis(kp)
    + h.card({ title: T('Properties', 'Propiedades'), flush: true, body: ptable(cols, K.props, { hl: r => r.over && money_ }) })
    + pcols('2', [h.card({ title: T('Map', 'Mapa'), body: h.map({ pins: K.props.map((p, i) => ({ x: p.x, y: p.y, n: i + 1, tone: p.over && money_ ? 'warn' : 'accent', label: p.name })), seed: 23, h: 220 }) }), money_ ? h.card({ title: T('Spend by property', 'Gasto por propiedad'), body: h.bars(K.props.map(p => ({ label: esc(p.name), value: p.spent, max: p.budget, tone: p.over ? 'warn' : '', right: `${Math.round(100 * p.spent / p.budget)}%` }))) }) : h.card({ title: T('Inspection scores', 'Puntajes de inspección'), body: h.bars(K.props.map(p => ({ label: esc(p.name), value: Number(p.score), max: 5, right: p.score }))) })])
    + h.note(sc === 'billing' ? 'Billing contact sees spend and budgets only; schedules, requests and photos stay hidden (02 §5.11).' : sc === 'viewer' ? 'Viewer: no money unless the client shares it.' : 'Budgets are the client\'s own figures, entered once a year (06 §4.16.9).');
});
RL.screen('portal.approvals', (c) => {
  const T = c.tr, K = comCtx(c), sc = c.scope;
  const label = it => esc(T(it.title[0], it.title[1]));
  const statusOf = it => {
    if (it.mode === 'vote') { const v = it.voted + (['yes', 'no'].includes(it.st) ? 1 : 0); return it.st === 'yes' && it.voted >= 1 ? `<b style="color:var(--ok-text)">${T('Passed: 2 yes reached', 'Aprobada: 2 votos a favor')}</b> <span class="tiny t3">(${v} ${T('of 5 voted', 'de 5 votaron')})</span>` : `${T('Board vote', 'Votación')}: ${v} ${T('of 5 voted', 'de 5 votaron')}${h.progress(v, 5)}<span class="tiny t3">${T('Passes at 2 yes. Votes stay sealed until it closes.', 'Se aprueba con 2 a favor. Los votos se revelan al cerrar.')}</span>`; }
    if (it.mode === 'seq') return `${h.pill(`${first(K.pm)}: ${T('approved', 'aprobó')} ${it.first}`, 'ok')} → ${h.pill(`${first(K.vp)} (${T('regional VP', 'VP regional')}): ${it.st === 'approved' ? T('approved', 'aprobó') : T('waiting', 'pendiente')}`, it.st === 'approved' ? 'ok' : 'warn')}`;
    if (it.mode === 'auto') return h.pill(T('Pre-approved at contract unit rates', 'Pre-aprobado a tarifas del contrato'), 'ok');
    if (it.mode === 'any') return `${h.pill(T('Community manager decides (under $5,000)', 'Decide el administrador (menos de $5,000)'), '')}`;
    return it.st === 'approved' ? h.pill(`${T('Approved with PO', 'Aprobado con PO')} ${RL.ui['ap.po.' + it.id] || K.po(3)}`, 'ok') : it.st === 'declined' ? h.pill(T('Declined', 'Rechazado'), 'danger') : h.pill(T('Waiting on you', 'Te espera'), 'warn');
  };
  const actionOf = it => {
    if (sc === 'billing' || sc === 'viewer') return '';
    if (it.st) return '';
    if (sc === 'approver' && it.mode === 'vote') return `${h.btn(T('Vote yes', 'Votar sí'), { sm: true, kind: 'primary', modal: 'ap-vote', val: it.id + ':yes' })}${h.btn(T('Vote no', 'Votar no'), { sm: true, modal: 'ap-vote', val: it.id + ':no' })}`;
    if (sc === 'primary' && it.mode === 'limit') return `${h.btn(T('Approve', 'Aprobar'), { sm: true, kind: 'primary', modal: 'ap-approve', val: it.id })}${h.btn(T('Ask', 'Preguntar'), { sm: true, modal: 'pp-q', val: it.id })}${h.btn(T('Decline', 'Rechazar'), { sm: true, act: 'ap-decline', val: it.id })}`;
    return `<span class="tiny t3">${T('Not yours to decide under the policy', 'No te corresponde según la política')}</span>`;
  };
  const rows = K.items.map(it => ({ id: it.id, it }));
  const pendTotal = K.items.filter(i => !i.st && i.mode !== 'auto' && i.mode !== 'any').reduce((a, i) => a + i.amount, 0);
  const left = K.budget.total - K.budget.used;
  const policy = K.isHoa ? T(`Over $5,000: board vote, 2 yes of 5 (${K.board.map(first).join(', ')}). Under $5,000: the community manager approves alone. Approving over $5,000 needs an SMS code or passkey.`, `Más de $5,000: votación, 2 a favor de 5. Menos de $5,000: aprueba el administrador. Más de $5,000 requiere código SMS o passkey.`)
    : T(`Up to $5,000: ${K.pm} approves. Over $5,000: ${K.pm}, then ${K.vp} (regional VP), in sequence. A PO in format ${abbr(K.name)}-000000 is required.`, `Hasta $5,000: aprueba ${K.pm}. Más de $5,000: ${K.pm} y luego ${K.vp} (VP regional). Se requiere PO formato ${abbr(K.name)}-000000.`);
  return h.page({ title: T('Approvals', 'Aprobaciones'), sub: `${esc(K.name)} · ${sc === 'approver' ? (K.isHoa ? T('your vote counts toward the board rule', 'tu voto cuenta para la regla de la junta') : T('your approval limit is set by policy', 'tu límite lo fija la política')) : sc === 'primary' ? T(`your approval limit: ${money(K.limit)} per item`, `tu límite: ${money(K.limit)} por asunto`) : T('read only', 'solo lectura')}` })
    + h.card({ title: T('Approval policy', 'Política de aprobación'), body: `<div class="small">${policy}</div>` })
    + h.card({ title: T('Queue', 'Pendientes'), flush: true, body: `<div class="li">${rows.map(r => `<div class="li-i" style="align-items:start"><span class="ico ${r.it.st ? 'ok' : 'warn'}">${icon(r.it.mode === 'vote' ? 'users' : r.it.mode === 'seq' ? 'route' : 'approve')}</span><div class="grow stack8"><div class="tt">${r.id} · ${label(r.it)}</div><div class="ss">${esc(r.it.prop)} · <b class="num">${money(r.it.amount)}</b>${sc !== 'billing' ? ` · ${T('uses', 'usa')} ${money(r.it.amount)} ${T('of', 'de')} ${money(left)} ${T('left in', 'restantes en')} ${esc(K.budget.name)}` : ` · PO ${K.po(r.id.length)}`}</div><div class="small">${statusOf(r.it)}</div></div><span class="flex gap4">${actionOf(r.it)}</span></div>`).join('')}</div>` })
    + pcols('2', [h.card({ title: T('Budget', 'Presupuesto'), body: `<div class="flex between small"><b>${esc(K.budget.name)}</b><span class="num">${money(K.budget.used)} ${T('approved of', 'aprobado de')} ${money(K.budget.total)}</span></div>${h.progress(K.budget.used, K.budget.total)}<div class="tiny t2">${T(`Pending items ${money(pendTotal)} would leave ${money(left - pendTotal)}.`, `Pendientes ${money(pendTotal)} dejarían ${money(left - pendTotal)}.`)}</div>` }),
      h.card({ title: T('Recently decided', 'Decididos recientemente'), body: h.timeline([{ when: c.winter ? 'Dec 14' : 'Apr 28', text: `CO-0109 ${T('irrigation controller upgrade', 'cambio de controlador')} · ${money(2240)} · ${T('approved by', 'aprobado por')} ${esc(first(K.isHoa ? K.ap : K.pm))}`, tone: 'ok' }, { when: c.winter ? 'Nov 30' : 'Apr 14', text: `PR-2241 ${T('fall color program', 'programa de color de otoño')} · ${money(3900)} · ${T('declined (over budget)', 'rechazado (sobre presupuesto)')}`, tone: 'danger' }]) + `<div class="flex">${h.btn(T('Approval log (PDF)', 'Registro de aprobaciones (PDF)'), { sm: true, act: 'pt-dl', icon: 'download' })}${K.isHoa ? h.btn(T('Ballot record for minutes', 'Boleta para el acta'), { sm: true, act: 'pt-dl', icon: 'download' }) : ''}</div>` })])
    + pside(c, K.isHoa ? 'HOA: vote mode, required yes 2 of 5 over $5,000; votes bind to the proposal version hash and reset on a price change (02 §5.11).' : 'Property manager: sequential mode over $5,000 (primary, then regional VP); PO required on approval; invoices carry the PO (06 §4.16.3).');
});
RL.modal('ap-vote', (c, el) => { const p = String(el && el.dataset.val || ':yes').split(':'); RL.ui['ap.pending'] = el && el.dataset.val; return { title: c.tr(`Confirm your ${p[1] === 'yes' ? 'yes' : 'no'} vote`, `Confirma tu voto`), body: `<div class="small">${esc(p[0])} · ${c.tr('Over $5,000, so we confirm it is you: a code was sent to your phone ending 0142, or use your passkey.', 'Más de $5,000: enviamos un código a tu teléfono que termina en 0142, o usa tu passkey.')}</div>` + h.input('', { ph: '••••••', label: 'Code' }) + h.textarea('', { ph: c.tr('Comment for the board (optional)', 'Comentario para la junta (opcional)') }) + h.note(c.tr('Your ballot stores identity, method, time and the proposal version.', 'Tu boleta guarda identidad, método, hora y versión de la propuesta.')), foot: h.btn(c.tr('Cast vote', 'Votar'), { kind: 'primary', act: 'ap-vote-do' }) }; });
RL.act('ap-vote-do', (el, ev, c) => { const p = String(RL.ui['ap.pending'] || '').split(':'); if (p[0]) RL.ui['ap.' + p[0]] = p[1]; RL.closeModal(); RL.toast(c.tr('Vote recorded.', 'Voto registrado.')); });
RL.modal('ap-approve', (c, el) => { const K = comCtx(c), id = el && el.dataset.val; RL.ui['ap.pending'] = id; return { title: c.tr('Approve', 'Aprobar') + ' ' + esc(id || ''), body: h.field(c.tr('PO number (required)', 'Número de PO (obligatorio)'), h.input(K.po(3), { label: 'PO' }), c.tr(`Format ${abbr(K.name)}-000000`, `Formato ${abbr(K.name)}-000000`)) + h.note(c.tr('Within your limit. The invoice for this work will carry this PO.', 'Dentro de tu límite. La factura llevará este PO.')), foot: h.btn(c.tr('Approve', 'Aprobar'), { kind: 'primary', act: 'ap-approve-do' }) }; });
RL.act('ap-approve-do', (el, ev, c) => { const id = RL.ui['ap.pending']; if (id) RL.ui['ap.' + id] = 'approved'; RL.closeModal(); RL.toast(c.tr('Approved. The Company was notified.', 'Aprobado. Se avisó a la empresa.')); });
RL.act('ap-decline', (el, ev, c) => { RL.ui['ap.' + el.dataset.val] = 'declined'; RL.toast(c.tr('Declined. Your reason goes to the estimator.', 'Rechazado. Tu motivo va al estimador.')); });

RL.screen('portal.documents', (c) => {
  const T = c.tr, K = comCtx(c), tab = h.tab('doc.tab', 'all'), billing = c.scope === 'billing';
  const docs = [
    ['agr', T('Service agreement 2027 (maintenance and snow)', 'Contrato de servicio 2027 (mantenimiento y nieve)'), T('Signed Mar 2, 2027', 'Firmado 2 mar 2027'), 'ok'],
    ['agr', T('Snow terms addendum', 'Anexo de términos de nieve'), T('Signed Oct 15, 2026', 'Firmado 15 oct 2026'), 'ok'],
    ['ins', T(`Certificate of insurance: ${K.name} named as additional insured`, `Certificado de seguro: ${K.name} como asegurado adicional`), T('General liability $2M · valid to Mar 31, 2028', 'Responsabilidad general $2M · vigente al 31 mar 2028'), 'ok'],
    ['ins', 'W-9', T('Signed Jan 2027', 'Firmado ene 2027'), 'ok'],
    ['ins', T('Pesticide business license', 'Licencia comercial de pesticidas'), T('Valid to Dec 31, 2027', 'Vigente al 31 dic 2027'), 'ok'],
    ['sds', T('SDS: treated rock salt', 'SDS: sal de roca tratada'), T('English and Spanish', 'Inglés y español'), ''],
    ['sds', T('SDS: calcium chloride ice melt', 'SDS: deshielo de cloruro de calcio'), T('English and Spanish', 'Inglés y español'), ''],
    ['sds', T('SDS: non-selective herbicide (spot spray)', 'SDS: herbicida no selectivo'), T('Placeholder product', 'Producto de ejemplo'), ''],
    ['prop', T('PR-2304 proposal and approval record', 'PR-2304 propuesta y registro de aprobación'), T('PDF with ballot trail', 'PDF con registro'), ''],
  ].filter(d => !billing || d[0] === 'ins' || d[0] === 'agr');
  const cats = [['all', T('All', 'Todo')], ['agr', T('Agreements', 'Contratos')], ['ins', T('Insurance and tax', 'Seguro e impuestos')]].concat(billing ? [] : [['sds', 'SDS'], ['prop', T('Proposals', 'Propuestas')]]);
  const shown = docs.filter(d => tab === 'all' || d[0] === tab);
  return h.page({ title: T('Documents', 'Documentos'), sub: `${esc(K.name)} · ${T('vendor compliance packet from', 'paquete de cumplimiento de')} ${esc(c.t.name)}` })
    + wrap(h.tabs('doc.tab', cats.map(x => [x[0], x[1], x[0] === 'all' ? docs.length : docs.filter(d => d[0] === x[0]).length]), 'all'))
    + h.card({ flush: true, body: h.list(shown.map(d => ({ icon: d[0] === 'ins' ? 'shield' : d[0] === 'sds' ? 'flask' : d[0] === 'prop' ? 'pen' : 'archive', tone: d[3], title: esc(d[1]), sub: esc(d[2]), right: h.btn(T('Download', 'Descargar'), { sm: true, act: 'pt-dl', icon: 'download' }) }))) })
    + (billing ? '' : h.card({ title: T('Your uploads', 'Tus documentos'), body: `<div class="small t2">${T('Tax-exempt certificate and site rules for contractors.', 'Certificado de exención y reglas del sitio para contratistas.')}</div>${h.btn(T('Upload', 'Subir'), { sm: true, act: 'pt-up', icon: 'upload' })}` }))
    + pside(c, 'One place for the current COI, W-9, licenses, SDS and signed agreements (06 §4.16.11). COIs renew automatically in this vault.');
});
RL.act('pt-up', (el, ev, c) => { RL.toast(c.tr('File uploaded (mock).', 'Archivo subido (simulado).')); return false; });

RL.screen('portal.reports', (c) => {
  const T = c.tr, K = comCtx(c), W = c.winter, billing = c.scope === 'billing';
  const events = W ? [['EV-07', 'Jan 12, 2027', 3.5, T('in progress', 'en curso')], ['EV-06', 'Jan 3, 2027', 2.4, ''], ['EV-05', 'Dec 18, 2026', 5.1, '']] : [['EV-11', 'Mar 4, 2027', 2.2, ''], ['EV-09', 'Feb 16, 2027', 6.3, ''], ['EV-07', 'Jan 12, 2027', 3.5, '']];
  const ev = events.find(e => e[0] === RL.ui['rp.ev']) || events[0];
  const prop = K.props.find(p => p.name === RL.ui['rp.prop']) || K.props[0];
  const log = K.props.slice(0, 6).map((p, i) => { const s = 5 * 60 - 18 + i * 22 + hs(p.name + ev[0]) % 9; return { prop: p.name, arr: t12(s), dep: t12(s + 27 + i * 2), push: ev[2] > 4 ? 2 : 1, salt: T(`${(1 + (i % 3) * .5).toFixed(1)} tons treated salt`, `${(1 + (i % 3) * .5).toFixed(1)} ton de sal tratada`), walks: T('Cleared', 'Despejadas'), photos: 3 + i % 3 }; });
  const sel = log.find(l => l.prop === prop.name) || log[0];
  const q = U('rp.q', W ? 'Jan 12, 6:10 am' : 'Jan 12, 6:10 am');
  const freq = K.props.slice(0, 6).map((p, i) => ({ name: p.name, done: (W ? 2 : 18) - (i === 2 ? 1 : 0), sched: W ? 2 : 18 }));
  if (billing) return h.page({ title: T('Reports', 'Informes'), sub: T('Invoice backup for your AP team', 'Respaldo de facturas para cuentas por pagar') })
    + h.card({ title: T('Snow billing backup', 'Respaldo de facturación de nieve'), sub: `${ev[1]} · ${ev[2]} in`, flush: true, body: ptable([{ k: 'prop', label: T('Property', 'Propiedad') }, { k: 'push', label: T('Pushes', 'Despejes'), n: true }, { k: 'salt', label: T('Salt', 'Sal') }, { k: 'po', label: 'PO', m: true }], log.map((l, i) => Object.assign({}, l, { po: K.po(i) }))) })
    + h.note('Billing contacts get counts that back each invoice line; photos and service logs stay with operations contacts.');
  return h.page({ title: T('Reports and proof of service', 'Informes y prueba de servicio'), sub: esc(K.name), actions: h.btn(T('Monthly report (PDF)', 'Informe mensual (PDF)'), { act: 'pt-dl', icon: 'download' }) })
    + h.card({ title: `${icon('search')} ${T('What happened at a site at a given time?', '¿Qué pasó en un sitio a cierta hora?')}`, body: `<div class="${isPhone() ? 'stack8' : 'cols cols-3'}" style="gap:8px">${h.field(T('Property', 'Propiedad'), h.select(K.props.map(p => p.name), prop.name, { ui: 'rp.prop' }))}${h.field(T('Date and time', 'Fecha y hora'), h.input(q, { ui: 'rp.q', label: 'Date and time' }))}<div style="align-self:end">${h.btn(T('Find records', 'Buscar registros'), { kind: 'primary', ui: 'rp.ev', val: 'EV-07' })}</div></div>`
      + pban(`${icon('check')} <span><b>${esc(prop.name)}, Jan 12:</b> ${T(`plowed and salted ${sel.arr}-${sel.dep}, walks cleared, ${sel.photos} photos with GPS. Next check 9:40 am.`, `despejado y con sal ${sel.arr}-${sel.dep}, aceras despejadas, ${sel.photos} fotos con GPS.`)}</span>`, 'info') })
    + h.card({ title: `${icon('snow')} ${T('Snow event log', 'Registro de eventos de nieve')}`, sub: `${ev[1]} · ${ev[2]} in${ev[3] ? ' · ' + ev[3] : ''} · ${T('station of record: airport', 'estación oficial: aeropuerto')}`, actions: `<span class="flex gap4">${events.map(e => h.btn(e[1].replace(', 2027', '').replace(', 2026', ''), { sm: true, ui: 'rp.ev', val: e[0], kind: e[0] === ev[0] ? 'primary' : '' })).join('')}</span>`, flush: true, body: ptable([{ k: 'prop', label: T('Property', 'Propiedad') }, { k: 'arr', label: T('Arrived', 'Llegada') }, { k: 'dep', label: T('Departed', 'Salida') }, { k: 'push', label: T('Pushes', 'Despejes'), n: true }, { k: 'salt', label: T('De-icer', 'Deshielo') }, { k: 'walks', label: T('Walks', 'Aceras') }, { k: 'photos', label: T('Photos', 'Fotos'), n: true }], log, { hl: r => r.prop === prop.name }) })
    + pcols('2', [h.card({ title: `${T('Photos', 'Fotos')} · ${esc(prop.name)}`, body: `<div class="cols cols-2" style="gap:6px">${h.photo('snow', { badge: `${sel.arr.toUpperCase()} · 39.97, -83.12` })}${h.photo('snow', { badge: `${sel.dep.toUpperCase()} · 39.97, -83.12` })}</div><div class="tiny t3">${T('Device and server timestamps with GPS on every photo.', 'Hora del equipo y del servidor con GPS en cada foto.')}</div><div class="flex">${h.btn(T('Evidence package (PDF)', 'Paquete de evidencia (PDF)'), { sm: true, act: 'pt-dl', icon: 'download' })}${h.btn('CSV', { sm: true, act: 'pt-dl', icon: 'download' })}</div>${c.has('snow_ice') ? '' : `<div class="tiny t3">${T('Service-log export, not a sealed proof packet (Snow Lite).', 'Exportación del registro, no un paquete sellado (Snow Lite).')}</div>`}` }),
      h.card({ title: T('Service frequency', 'Frecuencia de servicio'), sub: W ? T('January to date', 'Enero a la fecha') : T('Mar 1 to May 11', '1 mar a 11 may'), body: h.bars(freq.map(f => ({ label: esc(f.name), value: f.done, max: f.sched, tone: f.done < f.sched ? 'warn' : '', right: `${f.done}/${f.sched}` }))) + `<div class="tiny t3">${T('Visits completed vs the contract schedule.', 'Visitas hechas vs el calendario del contrato.')}</div>` })])
    + pside(c, `Snow logs with timestamps and photos for slip-and-fall defense (06 §4.16.7)${c.has('snow_ice') ? '; sealed proof packets with the full Snow and Ice module (V1)' : ''}.`);
});
})();
