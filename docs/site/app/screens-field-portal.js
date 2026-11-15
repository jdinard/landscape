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
  out += '<!--side-->' + side(T('Device and session', 'Dispositivo y sesión'), h.kv([['Device', 'Personal phone, PIN unlock'], ['Offline limit', '7 days; warns from day 5'], ['Signed in', esc(K.me)]]) + h.note('More holds My week, timesheets, equipment, safety, plant ID and sync (21 §5.3).'));
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
  out += '<!--side-->' + side(`${icon('eye')} ${T('What the office sees', 'Lo que ve la oficina')}`, h.kv([['Inspection', signed ? `Signed by ${esc(first(K.me))}` : `${checked} of ${DVIR.length} items`], ['Defects', defects ? `<b style="color:var(--danger-text)">${defects}: work order drafted</b>` : 'None'], ['Asset cost', h.mask(c, 'cost', money(11400))]]) + h.note('A defect creates a maintenance work order and can mark the asset down (13). Crew lead: equipment RW/c inspections and hours; technician W/c inspections.'));
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
  out += '<!--side-->' + side(`${icon('eye')} ${T('What the office sees', 'Lo que ve la oficina')}`, h.kv([['Site', `P${s.pri} · ${esc(s.client)}`], ['Counts', `${s.counts.push} push · ${s.counts.salt} salt · ${s.counts.walks} walks`], ['Invoice lines', `Per push and per application at Price Book rates: ${h.mask(c, 'price', money(165))}`], ['Proof of service', 'Per-site PDF: times, crew, counts, GPS photos, notes']]) + h.note('Snow Lite writes ordinary Visits and Billable Items; no storm_event or proof_packet records (14 §4.3.0). The client sees these visits in portal history.'));
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
  const base = hoaSide ? ['Main entrance', 'Clubhouse and pool', 'Pond trail', 'North commons'].map(p => `${name.replace(/\s+HOA$/i, '')}: ${p}`) : C.props.slice();
  const pace = W ? .07 : .38;
  let props = base.map((n, i) => { const k = hs(n); const budget = 36000 + (k % 10) * 8000; const over = i === 2; const spent = rnd(budget * (pace + (over ? .13 : ((k >> 4) % 9 - 4) / 100)), 10); return { name: n, i, budget, spent, over, open: (k >> 2) % 3, score: (4 + ((k >> 5) % 9) / 10).toFixed(1), next: W ? ['Jan 12 (storm)', 'Jan 12 (storm)', 'On trigger'][i % 3] : ['Thu May 13', 'Wed May 12', 'Fri May 14'][i % 3], x: 50 + (i * 71) % 300, y: 40 + (i * 53) % 160 }; });
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
