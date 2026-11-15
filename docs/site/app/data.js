/* Rootline Platform Explorer - deterministic sample data per tenant: RL.data(tenant) -> D.
   Everything is illustrative. Sizes scale with the tenant (people, crews, clients, modules). */
(() => {
'use strict';
const RL = window.RL;
const cache = {};
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const hs = s => { let h = 7; for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };

const FIRST = ['Ava', 'Ben', 'Carla', 'Derek', 'Elena', 'Frank', 'Grace', 'Hank', 'Iris', 'Jamal', 'Kara', 'Leo', 'Mina', 'Noah', 'Olivia', 'Paul', 'Quinn', 'Rita', 'Sean', 'Tara', 'Umar', 'Vera', 'Wes', 'Yara', 'Zach', 'Nadia', 'Owen', 'Priyanka', 'Diego', 'Hannah', 'Malik', 'Sofia', 'Eli', 'June', 'Kenji', 'Lena'];
const LAST = ['Abbott', 'Brennan', 'Carver', 'Delgado', 'Erikson', 'Fitch', 'Gallo', 'Haines', 'Ibarra', 'Jansen', 'Keller', 'Lindqvist', 'Moreau', 'Nakamura', 'Osei', 'Pruitt', 'Quintero', 'Rasmussen', 'Sato', 'Thorne', 'Underwood', 'Vance', 'Whitaker', 'Yoder', 'Zielinski', 'Kowal', 'Mbeki', 'Novak', 'Ortega', 'Patel', 'Reinholt', 'Stroud'];
const CREWF = ['Javier', 'Marco', 'Luis', 'Andrés', 'Hector', 'Ruben', 'Mateo', 'Carlos', 'José', 'Miguel', 'Tyler', 'Cody', 'Jake', 'Brandon', 'Eli', 'Omar', 'Pedro', 'Raúl', 'Sergio', 'Ivan', 'Kevin', 'Alex', 'Nico', 'Dario'];
const CREWL = ['Ruiz', 'Reyes', 'Vega', 'Salinas', 'Ortiz', 'Cruz', 'Morales', 'Flores', 'Rivera', 'Gómez', 'Torres', 'Ramos', 'Diaz', 'Grant', 'Brandt', 'Mendez', 'Castro', 'Herrera', 'Luna', 'Soto'];
const STREET = ['Oak', 'Maple', 'Elm', 'Willow', 'Birch', 'Cedar', 'Linden', 'Hawthorn', 'Juniper', 'Sycamore', 'Chestnut', 'Hickory', 'Aspen', 'Magnolia', 'Spruce', 'Laurel', 'Ridge', 'Meadow', 'Brook', 'Prairie'];
const SUF = ['St', 'Ave', 'Ln', 'Dr', 'Ct', 'Rd', 'Way', 'Pl'];
const COM = ['Lakeside Commons Association', 'Fox Run Office Park', 'Harbor Point Retail Center', 'Northgate Medical Plaza', 'Cedar Ridge Apartments', 'Riverbend Business Center', 'Stonebridge HOA', 'Parkview Senior Living', 'Westfield Corporate Campus', 'Maple Grove Townhomes HOA', 'Summit Square Shopping Center', 'Tri-County Library District'];
const SERVICES = {
  maintenance: ['Weekly mowing', 'Biweekly mowing', 'Spring cleanup', 'Fall cleanup', 'Mulch install', 'Shrub pruning', 'Bed edging'],
  design_build: ['Paver patio', 'Foundation planting', 'Retaining wall', 'Backyard renovation', 'Front walk + beds', 'Fire pit and seat wall'],
  hardscape: ['Paver patio', 'Retaining wall', 'Flagstone path'],
  lawn_programs: ['Round 2 fertilizer + crabgrass', 'Round 3 broadleaf weed', 'Grub preventive', 'Core aeration', 'Overseeding'],
  irrigation: ['Irrigation start-up', 'Irrigation repair', 'Backflow test', 'Controller upgrade', 'Winterization'],
  lighting: ['Lighting upgrade', 'Transformer replacement', 'Holiday lighting'],
  commercial: ['Commercial maintenance', 'Enhancement: entrance beds', 'Parking lot sweep', 'Tree replacement'],
  snow_lite: ['Snow push', 'Salt application'], design_only: ['Design consultation', 'Planting plan', 'Concept design'],
};
const PLANTS = [
  ['Little Lime Hydrangea', "Hydrangea paniculata 'Jane'", 'Shrub', '3-8', 'Full sun to part shade', 'Moderate', 'Recommended'],
  ['Fragrant Sumac', "Rhus aromatica 'Gro-Low'", 'Shrub', '3-9', 'Sun to part shade', 'High', 'Recommended'],
  ['Little Bluestem', "Schizachyrium scoparium 'Standing Ovation'", 'Grass', '3-9', 'Full sun', 'High', 'Recommended'],
  ["Walker's Low Catmint", "Nepeta x faassenii 'Walker's Low'", 'Perennial', '4-8', 'Full sun', 'High', 'Recommended'],
  ['Purple Coneflower', 'Echinacea purpurea', 'Perennial', '3-8', 'Full sun', 'Moderate', 'Recommended'],
  ['Serviceberry', 'Amelanchier x grandiflora', 'Tree', '4-9', 'Sun to part shade', 'Low', 'Recommended'],
  ['Black Chokeberry', "Aronia melanocarpa 'Low Scape Mound'", 'Shrub', '3-7', 'Sun to part shade', 'High', 'Recommended'],
  ['Prairie Dropseed', 'Sporobolus heterolepis', 'Grass', '3-9', 'Full sun', 'High', 'Recommended'],
  ['Green Velvet Boxwood', "Buxus 'Green Velvet'", 'Shrub', '5-8', 'Part shade', 'High', 'Use with care (salt, blight)'],
  ['Knock Out Rose', "Rosa 'Radrazz'", 'Shrub', '5-9', 'Full sun', 'Low', 'Use with care (deer)'],
  ['Leyland Cypress', 'x Cuprocyparis leylandii', 'Tree', '6-10', 'Full sun', 'Low', 'Not recommended here (winter burn)'],
  ['Wild Ginger', 'Asarum canadense', 'Groundcover', '3-7', 'Shade', 'High', 'Recommended'],
  ['Swamp White Oak', 'Quercus bicolor', 'Tree', '4-8', 'Full sun', 'Moderate', 'Recommended'],
  ['Hameln Fountain Grass', "Pennisetum alopecuroides 'Hameln'", 'Grass', '5-9', 'Full sun', 'High', 'Recommended'],
  ['Burning Bush', 'Euonymus alatus', 'Shrub', '4-8', 'Sun', 'High', 'Invasive: do not plant (state lists)'],
  ['Northern Sea Oats', 'Chasmanthium latifolium', 'Grass', '5-9', 'Part shade', 'High', 'Recommended'],
].map(([common, botanical, type, zones, sun, deer, rating], i) => ({ id: 'PL-' + (1100 + i), common, botanical, type, zones, sun, deer, rating }));
RL.PLANTS = PLANTS;

const OVERRIDE = {
  reyes: { res: { primary: 'Jennifer Thompson', co_owner: 'Mark Thompson', resident: 'Rosa Alvarez (resident)', client: 'Jennifer and Mark Thompson', property: '1190 Hobson Rd, Naperville', project: 'Backyard patio, fire pit and foundation beds', projectValue: 28000 } },
  greenleaf: { res: { primary: 'Dana Henderson', co_owner: 'Mark Henderson', resident: 'Kim Tran (resident)', client: 'Dana and Mark Henderson', property: '1847 Wyandotte Rd, Upper Arlington', project: 'Backyard patio and planting design', projectValue: 31400 } },
  summit: { com: { company: 'Crossroads Property Management', primary: 'Patricia Gomez', approver: 'Bob Patterson (Willow Creek HOA)', billing: 'Denise Okafor', site: 'Jorge Medina (Westgate Plaza)', viewer: 'Alan Reese, RLA (consultant)', hoa: 'Willow Creek HOA', props: ['Westgate Plaza', 'Easton Commons', 'Polaris Corners', 'Hilliard Station', 'Dublin Crossing', 'Grove City Market', 'Worthington Square', 'Gahanna Point', 'Reynoldsburg Center'] } },
};

function build(t) {
  const R = rng(hs(t.id));
  const pick = a => a[Math.floor(R() * a.length)];
  const int = (a, b) => a + Math.floor(R() * (b - a + 1));
  const round = (n, s) => Math.round(n / s) * s;
  const city = t.city.split(',')[0];
  const D = { t, plants: PLANTS };
  const big = t.people_peak >= 100, solo = t.people_peak <= 3;
  const designOnly = t.modules.includes('design_only');
  const mods = t.modules.filter(m => SERVICES[m]);
  const servicePool = mods.flatMap(m => SERVICES[m]);
  const person = () => pick(FIRST) + ' ' + pick(LAST);
  const crewPerson = () => pick(CREWF) + ' ' + pick(CREWL);
  const addr = () => `${int(100, 9800)} ${pick(STREET)} ${pick(SUF)}`;

  // ---- people and crews ----
  const cast = t.cast || {};
  const crewCount = Math.max(designOnly ? 0 : 1, Math.min(t.crews, 8));
  const crewTypes = t.modules.includes('snow_ice') ? ['maintenance', 'maintenance', 'install', 'irrigation', 'maintenance', 'enhancement', 'maintenance', 'maintenance']
    : t.modules.includes('lawn_programs') ? ['lawn', 'maintenance', 'lawn', 'maintenance', 'install', 'maintenance', 'lawn', 'maintenance']
    : t.modules.includes('irrigation') && !t.modules.includes('design_build') ? ['irrigation', 'irrigation', 'lighting', 'irrigation', 'maintenance']
    : ['maintenance', 'install', 'maintenance', 'install', 'maintenance', 'enhancement', 'maintenance', 'install'];
  D.crews = Array.from({ length: crewCount }, (_, i) => {
    const type = crewTypes[i % crewTypes.length];
    const lead = i === 0 && cast.crew_lead ? cast.crew_lead : crewPerson();
    const size = type === 'install' ? 3 : type === 'lawn' || type === 'irrigation' ? 1 : solo ? 2 : 3;
    const members = Array.from({ length: size - 1 }, (_, j) => (i === 0 && j === 0 && cast.technician) ? cast.technician : crewPerson());
    return { id: 'CR-' + (i + 1), name: `${type[0].toUpperCase() + type.slice(1)} ${i + 1}`, type, lead, members, truck: 'Truck ' + (12 + i * 3), color: ['var(--primary)', 'var(--sky-500)', 'var(--clay-500)', 'var(--marigold-600)', 'var(--iris-500)', 'var(--moss-400)', 'var(--sky-700)', 'var(--clay-300)'][i % 8], branch: t.branches[i % t.branches.length] };
  });
  D.people = [];
  Object.entries(cast).forEach(([role, name]) => { if (!['subcontractor'].includes(role)) D.people.push({ id: 'U-' + (100 + D.people.length), name, role, status: 'active', seat: ['crew_lead', 'technician'].includes(role) ? 'field' : role === 'bookkeeper' ? 'free' : 'office', lang: ['crew_lead', 'technician'].includes(role) ? 'ES' : 'EN' }); });
  D.crews.forEach(c => [c.lead, ...c.members].forEach(n => { if (!D.people.find(p => p.name === n)) D.people.push({ id: 'U-' + (100 + D.people.length), name: n, role: n === c.lead ? 'crew_lead' : 'technician', crew: c.name, status: 'active', seat: 'field', lang: R() < .7 ? 'ES' : 'EN' }); }));
  const extraField = Math.max(0, Math.min(t.people_peak, 40) - D.people.length);
  for (let i = 0; i < extraField; i++) D.people.push({ id: 'U-' + (100 + D.people.length), name: crewPerson(), role: 'technician', crew: D.crews[i % Math.max(1, D.crews.length)] ? D.crews[i % D.crews.length].name : null, status: i % 4 === 3 ? 'hibernated' : 'active', seat: 'field', lang: R() < .7 ? 'ES' : 'EN' });
  D.people.forEach(p => { p.cert = p.role === 'crew_lead' ? (R() < .8 ? 'Applicator 3A, exp ' + pick(['Dec 2027', 'Mar 2028', 'Oct 2027']) : null) : null; p.phone = '(' + int(212, 989) + ') 555-01' + int(10, 99); });

  // ---- clients and properties ----
  const nClients = Math.min(48, Math.max(8, Math.round(t.clients / 10)));
  const comShare = t.segment === 'S4' ? .8 : t.segment === 'S7' ? .3 : t.segment === 'S1' ? .1 : t.segment === 'S6' ? 0 : .08;
  D.clients = []; D.properties = [];
  const addClient = (o) => {
    const id = 'C-0' + (400 + D.clients.length * 7 % 600 + D.clients.length);
    const pid = 'P-' + (1180 + D.properties.length * 3);
    const c = Object.assign({ id, since: 2019 + int(0, 7), tags: [], properties: [pid] }, o);
    D.properties.push({ id: pid, client: id, clientName: c.name, address: c.address, city, lot: int(6, 30) * 1000, turf: int(3, 18) * 1000, beds: int(2, 9), gate: R() < .4 ? 'Gate code ' + int(1000, 9999) : null, dog: R() < .3 ? pick(['Biscuit', 'Moose', 'Luna', 'Rocky']) + ' (friendly)' : null, zones: t.modules.includes('irrigation') ? int(4, 12) : null, controller: t.modules.includes('irrigation') ? pick(['Hunter Pro-C, garage', 'Rain Bird ESP-TM2, side yard', 'Rachio 3, basement']) : null });
    D.clients.push(c); return c;
  };
  (t.hero_clients || []).forEach(hc => addClient({ name: hc.name, type: hc.type, address: hc.property, service: hc.service, autopay: hc.autopay, balance: hc.type === 'residential' ? 0 : int(2, 30) * 400, pastDue: 0, hero: true, contact: hc.name.replace(/^(\w+) and \w+ (\w+)/, '$1 $2') }));
  while (D.clients.length < nClients) {
    const isCom = R() < comShare;
    const type = isCom ? (R() < .35 ? 'hoa' : 'commercial') : 'residential';
    const name = isCom ? COM[(D.clients.length * 5) % COM.length] + (D.clients.length > COM.length ? ' ' + (D.clients.length % 3 + 2) : '') : person();
    const bal = R() < .3 ? round(int(120, isCom ? 9000 : 1800), 5) : 0;
    addClient({ name, type, address: isCom ? addr() : addr(), service: pick(servicePool), autopay: !isCom && R() < .62, balance: bal, pastDue: bal && R() < .45 ? pick([14, 31, 47, 63, 92]) : 0, contact: isCom ? person() : name });
  }
  D.clients.forEach(c => { c.ltv = round(int(2, 60) * (c.type === 'residential' ? 900 : 4000), 10); c.lastVisit = pick(['May 10', 'May 7', 'May 4', 'Apr 30', 'Apr 22', 'Mar 28']); if (c.pastDue) c.tags.push('Past due'); if (c.autopay) c.tags.push('Autopay'); if (c.type !== 'residential') c.tags.push(c.type === 'hoa' ? 'HOA' : 'Commercial'); c.email = c.contact.toLowerCase().replace(/[^a-z]+/g, '.').replace(/^\.|\.$/g, '') + '@example.com'; c.phone = '(' + int(212, 989) + ') 555-0' + int(100, 199); });

  // ---- residential and commercial personas for the portal ----
  const ov = OVERRIDE[t.id] || {};
  const firstRes = D.clients.find(c => c.type === 'residential') || D.clients[0];
  D.res = Object.assign({ primary: firstRes ? firstRes.contact : 'Homeowner', co_owner: 'Spouse of ' + (firstRes ? firstRes.contact : 'homeowner'), resident: 'Resident tenant', client: firstRes ? firstRes.name : 'Homeowner', property: firstRes ? firstRes.address : '-', project: designOnly ? 'Front garden redesign' : 'Backyard refresh: beds and paver patio', projectValue: designOnly ? 2400 : 18600 }, ov.res || {});
  D.res.clientId = (D.clients.find(c => c.name === D.res.client) || firstRes || {}).id;
  const firstCom = D.clients.find(c => c.type !== 'residential');
  D.com = Object.assign({ company: firstCom ? firstCom.name : 'Lakeside Commons Association', primary: firstCom ? firstCom.contact : person(), approver: person() + ' (board member)', billing: person() + ' (AP)', site: person() + ' (facilities)', viewer: person() + ', RLA (consultant)', hoa: 'Lakeside Commons Association', props: [firstCom ? firstCom.name : 'Lakeside Commons', 'North Lot', 'Clubhouse grounds'] }, ov.com || {});

  // ---- sales ----
  const est = cast.estimator || cast.owner || person();
  const sales = [cast.estimator, cast.owner].filter(Boolean);
  const stages = ['New', 'Qualified', 'Site visit', 'Designing', 'Proposal sent', 'Won'];
  const bigTicket = t.modules.includes('design_build') || t.modules.includes('commercial') || designOnly;
  const val = () => round(bigTicket ? int(3, 60) * 900 : int(4, 40) * 120, 50);
  D.leads = Array.from({ length: 10 }, (_, i) => ({ id: 'L-' + (880 + i), name: person(), source: pick(['Website form', 'Referral', 'Google Business', 'Rootline Match (V1)', 'Phone call', 'Instant quote (V1)', 'Yard sign']), service: pick(servicePool), value: val(), age: pick(['12 min', '1 h', '3 h', 'Yesterday', '2 days']), score: int(38, 96), status: i < 3 ? 'New' : i < 6 ? 'Contacted' : 'Qualified', address: addr() }));
  D.opps = Array.from({ length: 16 }, (_, i) => { const c = D.clients[(i * 3) % D.clients.length]; return { id: 'O-' + (560 + i), client: c.name, clientId: c.id, title: pick(servicePool), stage: stages[i % stages.length], value: i === 0 && D.res.projectValue ? D.res.projectValue : val(), prob: [10, 25, 40, 55, 70, 100][i % 6], owner: sales[i % Math.max(1, sales.length)] || est, next: pick(['Call back Thu', 'Site visit Fri 9:00', 'Send revised options', 'Follow-up drafted (AI)', 'Waiting on HOA vote', 'Deposit pending']), age: int(1, 40) + ' d' }; });
  D.estimates = D.opps.slice(0, 10).map((o, i) => { const cost = Math.round(o.value * (0.5 + R() * .12)); return { id: 'E-' + (2290 + i), client: o.client, clientId: o.clientId, title: o.title, value: o.value, cost, margin: Math.round(100 * (o.value - cost) / o.value), status: pick(['Draft', 'In review', 'Sent', 'Approved']), by: o.owner, date: pick(['May 10', 'May 8', 'May 6', 'May 3']) }; });
  D.proposals = D.estimates.slice(0, 8).map((e, i) => ({ id: 'PR-' + (2290 + i), estimate: e.id, client: e.client, clientId: e.clientId, title: e.title, value: e.value, options: i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1, status: ['Viewed', 'Sent', 'Signed', 'Draft', 'Viewed', 'Declined', 'Signed', 'Sent'][i], viewed: i % 2 ? '3 views, last 2 h ago' : 'Opened yesterday', deposit: Math.round(e.value * .3) }));
  if (D.res.projectValue) { D.proposals[0].client = D.res.client; D.proposals[0].title = D.res.project; D.proposals[0].value = D.res.projectValue; D.proposals[0].deposit = Math.round(D.res.projectValue * .3); D.proposals[0].clientId = D.res.clientId; }

  // ---- work ----
  const jobType = s => /mow|cleanup|prun|edging|Mulch/i.test(s) ? 'Maintenance' : /Round|Grub|aeration|Overseed/i.test(s) ? 'Lawn program' : /Irrigation|Backflow|Controller|Winter/i.test(s) ? 'Irrigation' : /Snow|Salt/i.test(s) ? 'Snow' : /Light/i.test(s) ? 'Lighting' : /Design|Planting plan|Concept/i.test(s) ? 'Design' : 'Install';
  D.jobs = Array.from({ length: 14 }, (_, i) => { const c = D.clients[(i * 2 + 1) % D.clients.length]; const title = i === 0 && D.res.project ? D.res.project : pick(servicePool); const v = i === 0 && D.res.projectValue ? D.res.projectValue : val(); const bh = Math.max(4, Math.round(v / 95)); const ah = Math.round(bh * (0.55 + R() * .6)); return { id: 'J-' + (1042 + i), client: i === 0 ? D.res.client : c.name, clientId: i === 0 ? D.res.clientId : c.id, title, type: jobType(title), status: pick(['Scheduled', 'In progress', 'In progress', 'Complete', 'On hold']), value: v, cost: Math.round(v * (.48 + R() * .2)), budgetHrs: bh, actualHrs: ah, phase: pick(['Layout', 'Excavation', 'Base', 'Install', 'Planting', 'Punch list', 'Recurring']), crew: D.crews.length ? D.crews[i % D.crews.length].name : '-', start: pick(['May 3', 'May 10', 'May 12', 'May 17', 'Apr 26']) }; });
  D.visits = [];
  D.crews.forEach((cr, ci) => {
    const n = cr.type === 'install' ? 1 : cr.type === 'lawn' ? 14 : cr.type === 'irrigation' ? 9 : 11;
    let tmin = 7 * 60 + 15;
    for (let k = 0; k < Math.min(n, 12); k++) {
      const c = D.clients[(ci * 7 + k * 3) % D.clients.length];
      const svc = cr.type === 'install' ? (D.jobs.find(j => j.type === 'Install') || D.jobs[0]).title : cr.type === 'lawn' ? pick(SERVICES.lawn_programs) : cr.type === 'irrigation' ? pick(SERVICES.irrigation) : pick(SERVICES.maintenance.slice(0, 2));
      const dur = cr.type === 'install' ? 480 : cr.type === 'lawn' ? 25 : cr.type === 'irrigation' ? 45 : int(25, 55);
      const status = k < 3 ? 'Done' : k === 3 ? 'In progress' : k === 4 ? 'En route' : 'Scheduled';
      D.visits.push({ id: 'V-' + (58813 + ci * 40 + k), stop: k + 1, crew: cr.name, crewId: cr.id, client: c.name, clientId: c.id, address: c.address, service: svc, start: `${Math.floor(tmin / 60)}:${String(tmin % 60).padStart(2, '0')}`, dur, budgetHrs: Math.round(dur / 60 * 10) / 10 * (cr.members.length + 1), status, x: 30 + ((ci * 53 + k * 37) % 340), y: 24 + ((ci * 31 + k * 47) % 200), gate: (D.properties.find(p => p.client === c.id) || {}).gate, dog: (D.properties.find(p => p.client === c.id) || {}).dog });
      tmin += dur + int(6, 18);
    }
  });
  D.agreements = D.clients.filter(c => c.type !== 'residential' || c.autopay).slice(0, 12).map((c, i) => ({ id: 'AG-' + (310 + i), client: c.name, clientId: c.id, name: c.type === 'residential' ? 'Weekly mowing, Apr-Nov' : 'Commercial maintenance + snow', billing: c.type === 'residential' ? pick(['Level billing (8 installments)', 'Per visit', 'Prepaid season']) : 'Monthly fixed + per push', value: c.type === 'residential' ? round(int(14, 40) * 100, 10) : round(int(18, 90) * 1000, 100), visits: c.type === 'residential' ? 30 : 34, renews: pick(['Nov 30', 'Dec 31', 'Mar 31']), escalator: pick(['4% fixed', 'CPI, cap 6%', '5% fixed']), autopay: c.autopay }));

  // ---- money ----
  D.invoices = Array.from({ length: 18 }, (_, i) => { const c = D.clients[(i * 5) % D.clients.length]; const amt = c.type === 'residential' ? round(int(4, 60) * 25, 5) : round(int(8, 120) * 100, 10); const st = ['Paid', 'Paid', 'Sent', 'Overdue', 'Draft', 'Paid', 'Sent', 'Paid', 'Overdue', 'Paid'][i % 10]; return { id: 'INV-' + (3307 + i), client: c.name, clientId: c.id, date: pick(['May 10', 'May 7', 'May 3', 'Apr 30', 'Apr 15', 'Apr 1']), due: pick(['May 25', 'May 17', 'May 1', 'Apr 15']), amount: amt, balance: st === 'Paid' ? 0 : amt, status: st, po: c.type !== 'residential' ? 'PO-' + int(40000, 49999) : '', autopay: c.autopay }; });
  D.payments = D.invoices.filter(i => i.status === 'Paid').map((i, k) => ({ id: 'PY-' + (7710 + k), client: i.client, invoice: i.id, amount: i.amount, date: i.date, method: i.autopay ? 'Card on file (autopay)' : pick(['ACH', 'Card', 'Check', 'Apple Pay']), fee: i.autopay ? Math.round(i.amount * .029 * 100 + 30) / 100 : 0, payout: 'po_' + (1000 + k * 7) }));
  const ar = D.invoices.filter(i => i.balance);
  const arBase = Math.round(t.people_peak * (t.segment === 'S6' ? 140000 : 72000) * (t.segment === 'S4' ? .12 : .085));
  D.agingFromInvoices = { current: ar.filter(i => i.status === 'Sent').reduce((a, i) => a + i.balance, 0), d30: Math.round(ar.filter(i => i.status === 'Overdue').reduce((a, i) => a + i.balance, 0) * .6), d60: Math.round(ar.filter(i => i.status === 'Overdue').reduce((a, i) => a + i.balance, 0) * .3), d90: Math.round(ar.filter(i => i.status === 'Overdue').reduce((a, i) => a + i.balance, 0) * .1) };
  D.aging = { current: Math.round(arBase * .62), d30: Math.round(arBase * .21), d60: Math.round(arBase * .11), d90: Math.round(arBase * .06) };

  // ---- design ----
  const designer = cast.designer || cast.owner || 'Designer';
  D.designs = Array.from({ length: designOnly ? 9 : 7 }, (_, i) => { const c = i === 0 ? { name: D.res.client, id: D.res.clientId, address: D.res.property } : D.clients[(i * 4) % D.clients.length]; return { id: 'DS-' + (410 + i), client: c.name, clientId: c.id, property: c.address, title: i === 0 ? D.res.project : pick(['Front foundation refresh', 'Pollinator border', 'Shade garden', 'Patio and seat wall', 'Rain garden', 'Deer-resistant screen']), status: ['Client review', 'In progress', 'Draft', 'Approved', 'In progress', 'As-built', 'Draft', 'Client review', 'Approved'][i], designer, options: i % 3 + 1, plants: int(18, 64), area: int(300, 2400), mockups: int(0, 8), updated: pick(['2 h ago', 'Yesterday', 'May 6', 'Apr 29']), budget: i === 0 ? '$25k-$32k' : pick(['$4k-$9k', '$12k-$18k', '$20k-$35k']) }; });

  // ---- books ----
  const rev = Math.round(t.people_peak * (t.segment === 'S6' ? 140000 : 72000));
  D.kpi = {
    revenueYTD: Math.round(rev * .29), revenueMTD: Math.round(rev * .045), revenueLY: rev, cash: Math.round(rev * .07), ar: Object.values(D.aging).reduce((a, b) => a + b, 0) || Math.round(rev * .03),
    gm: t.segment === 'S4' ? 31 : t.segment === 'S1' ? 44 : 41, backlogWeeks: t.segment === 'S2' ? 7.5 : 3.2, closeRate: t.segment === 'S2' ? 38 : 46, deposits: Math.round(rev * .012),
    crewsOut: D.crews.length, visitsToday: D.visits.length, visitsDone: D.visits.filter(v => v.status === 'Done').length, laborEff: 96, autopayPct: Math.round(100 * D.clients.filter(c => c.autopay).length / D.clients.length),
    seatsField: D.people.filter(p => p.seat === 'field' && p.status === 'active').length, seatsOffice: D.people.filter(p => p.seat === 'office').length,
    aiUsed: Math.round((RL.idx.PLANS[t.plan].ai_credits || 600) * .58), sms: Math.round((RL.idx.PLANS[t.plan].sms || 500) * .44),
  };
  D.accounts = [['1000', 'Operating checking', 'Asset', D.kpi.cash], ['1050', 'Stripe clearing', 'Asset', Math.round(D.kpi.cash * .04)], ['1100', 'Accounts receivable', 'Asset', D.kpi.ar], ['1200', 'Inventory: plants and materials', 'Asset', Math.round(rev * .01)], ['1500', 'Equipment and vehicles', 'Asset', Math.round(rev * .22)], ['2000', 'Accounts payable', 'Liability', Math.round(rev * .018)], ['2100', 'Customer deposits', 'Liability', D.kpi.deposits], ['2150', 'Deferred revenue: level billing', 'Liability', Math.round(rev * .02)], ['2200', 'Sales tax payable', 'Liability', Math.round(rev * .003)], ['3000', "Owner's equity", 'Equity', Math.round(rev * .2)], ['4000', 'Revenue: installs', 'Income', Math.round(D.kpi.revenueYTD * .5)], ['4100', 'Revenue: maintenance', 'Income', Math.round(D.kpi.revenueYTD * .4)], ['4200', 'Revenue: snow', 'Income', Math.round(D.kpi.revenueYTD * .1)], ['5000', 'Direct labor', 'COGS', Math.round(D.kpi.revenueYTD * .34)], ['5100', 'Materials and plants', 'COGS', Math.round(D.kpi.revenueYTD * .21)], ['5200', 'Subcontractors', 'COGS', Math.round(D.kpi.revenueYTD * .04)], ['6000', 'Fuel', 'Expense', Math.round(D.kpi.revenueYTD * .035)], ['6100', 'Insurance', 'Expense', Math.round(D.kpi.revenueYTD * .03)], ['6200', 'Software', 'Expense', Math.round(D.kpi.revenueYTD * .006)], ['6300', 'Payment processing fees', 'Expense', Math.round(D.kpi.revenueYTD * .011)]].map(([code, name, type, bal]) => ({ code, name, type, balance: bal }));
  D.journal = D.payments.slice(0, 4).map((p, i) => ({ id: 'JE-' + (10442 + i), date: p.date, memo: `Payment ${p.id} on ${p.invoice}`, source: 'Stripe', lines: [['1050 Stripe clearing', p.amount, 0], ['1100 Accounts receivable', 0, p.amount]] }))
    .concat([{ id: 'JE-10446', date: 'May 10', memo: 'Payout po_1007 to Operating checking', source: 'Stripe payout', lines: [['1000 Operating checking', 4812.4, 0], ['6300 Processing fees', 141.6, 0], ['1050 Stripe clearing', 0, 4954]] }, { id: 'JE-10447', date: 'May 9', memo: 'Deposit received on PR-2290', source: 'Portal', lines: [['1050 Stripe clearing', D.proposals[0].deposit, 0], ['2100 Customer deposits', 0, D.proposals[0].deposit]] }]);
  D.bank = Array.from({ length: 9 }, (_, i) => ({ id: 'BL-' + (500 + i), date: pick(['May 10', 'May 9', 'May 8', 'May 7']), desc: ['STRIPE PAYOUT po_1007', 'LAKESHORE LANDSCAPE SUPPLY', 'FUEL STOP 5741', 'PAYROLL ACH 0510', 'STRIPE PAYOUT po_1014', 'NURSERY WHOLESALE INC', 'ROOTLINE SUBSCRIPTION', 'CHECK 1182 DEPOSIT', 'AUTO PARTS 2231'][i], amount: [4812.4, -1840.22, -212.65, -18450.0, 3120.75, -2640.0, -249.0, 950.0, -86.4][i], match: ['Matched: payout po_1007', 'Suggest: Bill B-221 (2-way match)', 'Rule: Fuel', 'Matched: payroll JE-10431', 'Matched: payout po_1014', 'Suggest: PO-3311 receipt', 'Rule: Software', 'Suggest: INV-3311 check', 'Needs review'][i], ai: [false, true, false, false, false, true, false, true, false][i] }));

  // ---- team, ops, marketing ----
  D.timesheets = D.people.filter(p => p.seat === 'field' && p.status === 'active').slice(0, 12).map((p, i) => ({ person: p.name, crew: p.crew || '-', hrs: round(36 + R() * 12, .25), ot: Math.max(0, round(R() * 6 - 1, .25)), exceptions: i % 5 === 1 ? 'Missed lunch punch' : i % 7 === 3 ? 'Edited by crew lead (reason: forgot to clock out)' : '', status: i % 4 === 0 ? 'Approved' : 'Pending' }));
  const EQ = [['Zero-turn mower 60"', 'mower', ' h', ['Blades due', 'Oil change in 12 h', 'OK']], ['Stand-on mower 52"', 'mower', ' h', ['Oil change in 12 h', 'OK', 'Blades due']], ['Pickup 3/4-ton #12', 'vehicle', ' mi x100', ['DVIR overdue', 'Annual DOT inspection Jun 3', 'OK']], ['Mini track loader', 'heavy_equipment', ' h', ['Grease and track check in 20 h', 'OK']], ['Backpack blowers (6)', 'handheld', ' h', ['Air filters due', 'OK']], ['Enclosed trailer 7x16', 'trailer', '', ['Annual DOT inspection Jun 3', 'Tire check', 'OK']], ['Ride-on spreader-sprayer', 'applicator', ' h', ['Calibration due before next round', 'OK']], ['8 ft straight-blade plow', 'snow_equipment', '', ['Pre-season hydraulic check', 'Stored for summer']]];
  D.equipment = EQ.slice(0, Math.max(3, Math.min(8, t.crews + 3))).map(([n, kind, unit, nexts], i) => ({ id: 'EQ-' + (20 + i), name: n, kind, meter: unit ? int(120, 1900) + unit : '-', next: pick(nexts), crew: D.crews.length ? D.crews[i % D.crews.length].name : '-' }));
  D.inventory = [['Shredded hardwood mulch', 'cu yd', 42, 20], ['Pea gravel', 'ton', 6, 4], ['Paver: tumbled cobble, charcoal', 'sq ft', 380, 0], ['Polymeric sand', 'bag', 18, 10], ['Fertilizer 24-0-11 w/ dimension', 'bag', 64, 40], ['Little Lime Hydrangea #3', 'each', 12, 0], ['Steel edging 16 ft', 'piece', 30, 12]].map(([n, u, q, min], i) => ({ id: 'IT-' + (300 + i), name: n, uom: u, qty: q, min, yard: t.branches[0] + ' yard' }));
  D.vendors = [['Regional landscape supply (illustrative)', 'Materials', 'Net 30'], ['Wholesale nursery (illustrative)', 'Plants', 'Net 30'], ['Fuel card provider', 'Fuel', 'Weekly'], [cast.subcontractor || 'Dobbs Irrigation', 'Subcontractor', 'Net 15, COI on file']].map(([n, cat, terms], i) => ({ id: 'VN-' + (60 + i), name: n, category: cat, terms }));
  D.campaigns = [['Spring aeration + overseed', 'Sent', 1840, 31, 12], ['Mulch refresh reminder', 'Scheduled May 14', 920, null, null], ['Fall cleanup early-bird', 'Draft', 0, null, null], ['Review request after visit (journey)', 'Always on', 610, 58, 44]].map(([n, st, sent, open, conv], i) => ({ id: 'CM-' + (40 + i), name: n, status: st, sent, open, conv }));
  D.reviews = [['Ada L.', 5, 'Crew was careful with the gate and the dog. Lawn looks great.'], ['Tom B.', 5, 'Booked online in two minutes, first cut was Tuesday.'], ['R. Kim', 4, 'Good work; one bed edge missed, fixed next visit.'], ['M. Osei', 3, 'Communication slow on the patio timeline.']].map(([n, s, txt], i) => ({ id: 'RV-' + i, name: n, stars: s, text: txt, when: pick(['2 d ago', '5 d ago', 'May 2', 'Apr 28']) }));
  D.agents = [['A1', 'Daily Owner Briefing', 'L4', 'Every day 6:00 am', 2], ['A2', 'Inbox Triage', 'L2', 'Per inbound message', 0.5], ['A3', 'Lead Follow-up', 'L2', 'Per conversation', 4], ['A4', 'Field-Note', 'L2', 'Per voice minute', 1], ['A5', 'Collections reminders', 'L2', 'Daily', 1], ['A6', 'Estimating from notes', 'L1', 'On request', 8], ['A7', 'Scheduling (V1)', 'L2', 'Nightly', 15]].map(([id, name, level, cadence, cr]) => ({ id, name, level, cadence, credits: cr }));
  return D;
}
RL.data = t => cache[t.id] || (cache[t.id] = build(t));
})();
