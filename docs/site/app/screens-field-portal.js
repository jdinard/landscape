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
const bb = (label, o) => { o = o || {}; return `<button type="button" class="big-btn${o.ghost ? ' ghost' : ''}"${h.attr({ 'data-act': o.act, 'data-go': o.go, 'data-x': o.x, 'data-ui': o.ui, 'data-val': o.val, 'data-modal': o.modal, disabled: o.disabled, style: o.style })}>${o.icon ? icon(o.icon) : ''}${label}</button>`; };
const sticky = inner => `<div style="position:sticky;bottom:-12px;padding:10px 0 2px;background:linear-gradient(to bottom, transparent, var(--canvas) 26%);display:grid;gap:6px">${inner}</div>`;
const badge = (n, tone) => { const m = { done: ['var(--stone-450)', '#fff'], cur: ['var(--primary)', 'var(--on-primary)'], route: ['var(--sky-500)', '#fff'], sch: ['var(--surface-3)', 'var(--text)'], skip: ['var(--danger-solid)', '#fff'] }[tone] || ['var(--surface-3)', 'var(--text)']; return `<span style="flex:none;width:30px;height:30px;border-radius:50%;display:inline-grid;place-items:center;font-weight:800;font-size:.85rem;background:${m[0]};color:${m[1]}">${n}</span>`; };
const sig = () => `<svg viewBox="0 0 220 50" style="width:100%;height:46px;display:block" aria-label="Signature"><path d="M8 34 C 24 6, 38 46, 54 24 S 84 8, 96 30 S 128 42, 146 16 S 176 30, 186 26 L 212 22" fill="none" stroke="var(--text)" stroke-width="2.2" stroke-linecap="round"/></svg>`;
const side = (title, body, tone) => h.card({ title, body, tone });
const pban = (text, tone) => `<div class="mx-banner ${tone || 'info'}" style="border-radius:10px;border:0">${text}</div>`;
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
  out += '<!--side-->' + side(`${icon('eye')} ${T('What the office sees', 'Lo que ve la oficina')}`, h.kv([
    [T('Crew', 'Cuadrilla'), `${esc(K.crew.name)} · ${esc(K.crew.truck)}`],
    [T('Progress', 'Avance'), `${done} / ${S.length} · ${used <= budget * .55 ? T('on pace', 'a tiempo') : T('slightly behind', 'un poco atrasada')}`],
    [T('Visit price', 'Precio de visita'), h.mask(c, 'price', money(64))],
    [T('Job cost', 'Costo'), h.mask(c, 'cost', money(31))],
    [T('Margin', 'Margen'), h.mask(c, 'margin', '52%')],
  ]) + (moved ? h.note(`Dispatch board: "Reordered by ${esc(first(K.me))}${RL.ui['crew.reason'] ? ' (reason: ' + esc(RL.ui['crew.reason']) + ')' : ''}". Same-day reorders sync as a proposed sequence (05 §4.1.3).`) : h.note('Crew roles see hours budgets, never price, cost or margin (02 §10.2). Masked values show what the office sees behind the scenes.')))
    + side(T('Crew lead vs technician', 'Líder vs técnico'), h.list([
      { icon: 'users', tone: K.lead ? 'ok' : '', title: 'Crew lead', sub: 'Punches the whole crew, edits crew time with a reason, reorders same-day stops, approves crew time (first level).' },
      { icon: 'user', tone: K.lead ? '' : 'ok', title: 'Technician', sub: 'Own time only, the crew\'s stops read-only, checklists and photos.' },
    ]) + `<div class="flex mt8">${h.toggle(T('Simulate no signal', 'Simular sin señal'), 'crew.offline')}</div>`, '');
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
  out += '<!--side-->' + side(`${icon('eye')} ${T('What the office sees', 'Lo que ve la oficina')}`, h.kv([
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
  out += '<!--side-->' + side(`${icon('eye')} ${T('What the office sees', 'Lo que ve la oficina')}`, h.timeline([
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
  else out += h.card({ tone: 'danger', title: `${icon('lock')} ${T('Logging blocked: no applicator license on file', 'Registro bloqueado: no hay licencia de aplicador')}`, body: `<div class="small">${T(`${esc(K.me)} has no license for turf category 3A in this state. There is no override. The record stays a flagged draft and ${esc(K.ops)} is alerted.`, `${esc(K.me)} no tiene licencia para la categoría 3A (césped) en este estado. No hay forma de saltarlo. El registro queda como borrador marcado y se avisa a ${esc(K.ops)}.`)}</div>`
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
  out += '<!--side-->' + side(`${icon('eye')} ${T('What the office sees', 'Lo que ve la oficina')}`, h.kv([
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
  out += '<!--side-->' + side(`${icon('eye')} ${T('What the office sees', 'Lo que ve la oficina')}`, h.kv([['Live location', 'Only while the crew is clocked in (05 §4.23)'], ['Stops', `${S.length} in route order`], ['Offline', 'Route corridor map is cached; pins stay readable without signal']]));
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
    out += '<!--side-->' + side(`${icon('eye')} ${T('What the office sees', 'Lo que ve la oficina')}`, h.kv([['Status', `${esc(K.me)} · ${TST[st][0]}`], ['Pay rate', h.mask(c, 'pay_rate', 'Visible to self') ], ['Edits', 'Only the crew lead or office can edit, always with a reason']]) + h.note('Technician: own time (time_entry W/o + R/o). Daily attestation at clock-out (05 §4.5).'));
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
  out += '<!--side-->' + side(`${icon('eye')} ${T('What the office sees', 'Lo que ve la oficina')}`, h.kv([['Punch mode', 'Crew-level punch from the lead device'], ['Edits', Object.keys(RL.ui).filter(k => k.startsWith('tedit.')).length + ' today, each with a reason, flagged for ' + esc(K.ops)], ['Approval', 'Lead approves first level; office can still edit (05 §4.17.1)']]) + h.note('Crew lead: time_entry RW/c within limits, timesheet.approve first level. Offline punches carry device timestamps.'));
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
  out += '<!--side-->' + side(`${icon('eye')} ${T('What the office sees', 'Lo que ve la oficina')}`, `<div class="small">The office reads crew messages in English with the Spanish original one tap away. Glossary: "orillar" means edge, "desbrozadora" means string trimmer (05 §4.11.2).</div>` + h.note('Crew-office threads and broadcasts at MVP; auto-translate is V1. Client numbers never appear in crew chat.'));
  return out;
});
RL.act('msg-send', (el, ev, c) => { RL.ui['msg.draft'] = ''; RL.toast(c.tr('Sent. Delivers when you have signal.', 'Enviado. Se entrega cuando haya señal.')); });
RL.act('msg-photo', (el, ev, c) => { RL.toast(c.tr('Camera opened (mock).', 'Cámara abierta (simulada).')); return false; });
RL.act('msg-voice', (el, ev, c) => { RL.toast(c.tr('Voice message: 1 credit per minute for transcription.', 'Mensaje de voz: 1 crédito por minuto para transcribir.')); return false; });
