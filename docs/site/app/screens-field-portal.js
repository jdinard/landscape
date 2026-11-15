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
