/* Rootline Platform Explorer - UI helper library (RL.h). Every helper returns an HTML string.
   Conventions: tone = ok | warn | danger | info | ai | accent. Iris (ai) only for AI-generated content. */
(() => {
'use strict';
const RL = window.RL;
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const attr = (o) => Object.entries(o || {}).filter(([, v]) => v != null && v !== false).map(([k, v]) => v === true ? ` ${k}` : ` ${k}="${esc(v)}"`).join('');
const money = (n, o) => {
  if (n == null || isNaN(n)) return '-';
  const cents = o && o.cents; const neg = n < 0; const v = Math.abs(n);
  const s = v.toLocaleString('en-US', { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 });
  return (neg ? '-$' : '$') + s;
};
const kmoney = n => n >= 1e6 ? '$' + (n / 1e6).toFixed(n >= 1e7 ? 0 : 1) + 'M' : n >= 1e4 ? '$' + Math.round(n / 1e3) + 'k' : n >= 1e3 ? '$' + (n / 1e3).toFixed(1) + 'k' : money(n);
const num = n => n == null ? '-' : Number(n).toLocaleString('en-US');
const pct = (n, d) => (n == null ? '-' : (Math.round(n * Math.pow(10, d || 0)) / Math.pow(10, d || 0)) + '%');
const initials = name => String(name || '?').replace(/\(.*?\)/g, '').split(/[\s,]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const hash = s => { let h = 0; for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };
const icon = (id, cls) => `<svg class="ic${cls ? ' ' + cls : ''}" aria-hidden="true"><use href="#i-${id}"/></svg>`;

const h = RL.h = {
  esc, attr, money, kmoney, num, pct, initials, icon,
  /* Button. o: { kind: primary|ai|danger|ghost, act, go, x, ui, val, modal, set, icon, sm, disabled, title } */
  btn(label, o) {
    o = o || {};
    const cls = 'btn' + (o.kind ? ' ' + o.kind : '') + (o.sm ? ' sm' : '');
    return `<button type="button" class="${cls}"${attr({ 'data-act': o.act, 'data-go': o.go, 'data-x': o.x, 'data-ui': o.ui, 'data-val': o.val, 'data-modal': o.modal, 'data-set': o.set, disabled: o.disabled, title: o.title, 'aria-pressed': o.pressed })}>${o.icon ? icon(o.icon) : ''}${label}</button>`;
  },
  link(label, go, x) { return `<a href="#" data-go="${esc(go)}"${x ? ` data-x="${esc(x)}"` : ''}>${label}</a>`; },
  tag() { return ''; }, // TEMP shim until screens drop tier tags
  pill(text, tone, ic) { return `<span class="pill${tone ? ' ' + tone : ''}">${ic ? icon(ic) : ''}${text}</span>`; },
  
  chip(v) { const k = v === '-' ? 'N' : String(v)[0]; return `<span class="chip ${k}">${esc(v)}</span>`; },
  ai(text) { return `<span class="ai-mark">${icon('spark')}${text || 'AI'}</span>`; },
  /* Page header. o: { title, sub, crumbs: [[label, routeId, x?]...], actions: html, tags: html } */
  page(o) {
    const cr = o.crumbs ? `<div class="crumbs">${o.crumbs.map(([l, g, x]) => g ? `<button data-go="${esc(g)}"${x ? ` data-x="${esc(x)}"` : ''}>${l}</button>` : `<span>${l}</span>`).join('<span>/</span>')}</div>` : '';
    return `<div class="pg-h"><div class="grow">${cr}<h1>${o.title}</h1>${o.sub ? `<div class="sub">${o.sub}</div>` : ''}${o.tags ? `<div class="flex mt8">${o.tags}</div>` : ''}</div>${o.actions ? `<div class="flex">${o.actions}</div>` : ''}</div>`;
  },
  /* Tabs bound to RL.ui[key]. list: [[id, label, count?]...] */
  tabs(key, list, def) {
    const cur = RL.ui[key] || def || list[0][0];
    return `<div class="tabs" role="tablist">${list.map(([id, l, n]) => `<button type="button" role="tab" data-ui="${esc(key)}" data-val="${esc(id)}" aria-pressed="${cur === id}">${l}${n != null ? `<span class="ct">${n}</span>` : ''}</button>`).join('')}</div>`;
  },
  tab(key, def) { return RL.ui[key] || def; },
  /* KPI tiles: [{ label, value, delta, tone, ai }] */
  kpis(items) { return `<div class="kpis">${items.filter(Boolean).map(k => `<div class="kp${k.ai ? ' ai' : ''}"><span class="l">${k.label}</span><span class="v">${k.value}</span>${k.delta ? `<span class="d ${k.tone || ''}">${k.delta}</span>` : ''}</div>`).join('')}</div>`; },
  /* Card. o: { title, sub, body, actions, tone: warn|danger|ok|ai, flush, cls } */
  card(o) {
    const head = (o.title || o.actions) ? `<div class="cd-h"><div>${o.title ? `<h3>${o.title}</h3>` : ''}${o.sub ? `<div class="sub">${o.sub}</div>` : ''}</div>${o.actions ? `<div class="flex">${o.actions}</div>` : ''}</div>` : '';
    return `<section class="cd${o.tone ? ' ' + o.tone : ''}${o.cls ? ' ' + o.cls : ''}">${head}<div class="cd-b${o.flush ? ' flush' : ''}">${o.body || ''}</div></section>`;
  },
  // An item can be a string, or an array of strings stacked in one column
  cols(kind, items) { return `<div class="cols cols-${kind}">${items.map(i => Array.isArray(i) ? `<div class="stack12" style="min-width:0">${i.join('')}</div>` : i).join('')}</div>`; },
  hash(str) { let x = 2166136261; for (const ch of String(str)) { x ^= ch.charCodeAt(0); x = Math.imul(x, 16777619); } return x >>> 0; },
  /* Table. cols: [{ k, label, n (numeric), m (mono), fmt: (v,row)=>html }], rows: objects. o: { go: routeId, x: row=>id, dense, foot: [..], hl: row=>bool, empty } */
  table(cols, rows, o) {
    o = o || {};
    if (!rows.length) return h.empty(o.empty || 'Nothing here yet.');
    const th = cols.map(c => `<th${c.n ? ' class="n"' : ''}>${c.label}</th>`).join('');
    const tr = rows.map(r => {
      const go = o.go ? ` class="go${o.hl && o.hl(r) ? ' hl' : ''}" data-go="${esc(o.go)}" data-x="${esc(o.x ? o.x(r) : r.id)}"` : (o.hl && o.hl(r) ? ' class="hl"' : (o.ai && o.ai(r) ? ' class="ai"' : ''));
      return `<tr${go}>${cols.map(c => { const v = c.fmt ? c.fmt(r[c.k], r) : esc(r[c.k]); return `<td${c.n ? ' class="n"' : c.m ? ' class="m"' : ''}>${v == null ? '' : v}</td>`; }).join('')}</tr>`;
    }).join('');
    const tf = o.foot ? `<tfoot><tr>${o.foot.map((v, i) => `<td${cols[i] && cols[i].n ? ' class="n"' : ''}>${v == null ? '' : v}</td>`).join('')}</tr></tfoot>` : '';
    return `<div class="tb-wrap"><table class="tb${o.dense ? ' dense' : ''}"><thead><tr>${th}</tr></thead><tbody>${tr}</tbody>${tf}</table></div>`;
  },
  /* List rows: [{ icon, tone, title, sub, right, go, x, act }] */
  list(items) {
    return `<div class="li">${items.map(i => `<div class="li-i${i.go || i.act ? ' go' : ''}"${attr({ 'data-go': i.go, 'data-x': i.x, 'data-act': i.act, role: i.go || i.act ? 'button' : null, tabindex: i.go || i.act ? '0' : null })}>${i.icon ? `<span class="ico ${i.tone || ''}">${icon(i.icon)}</span>` : (i.av ? h.avatar(i.av) : '<span></span>')}<div class="grow"><div class="tt">${i.title}</div>${i.sub ? `<div class="ss">${i.sub}</div>` : ''}</div><div class="flex nw">${i.right || ''}</div></div>`).join('')}</div>`;
  },
  kv(pairs) { return `<dl class="kv">${pairs.filter(Boolean).map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`; },
  /* Kanban: [{ title, sub, cards: [{ title, sub, meta, tone, go, x }] }] */
  board(cols) {
    return `<div class="board">${cols.map(c => `<div class="bcol"><div class="bcol-h"><span>${c.title}</span><span>${c.sub || c.cards.length}</span></div>${c.cards.map(k => `<div class="bcard${k.go ? ' go' : ''}${k.tone === 'ai' ? ' ai' : ''}"${attr({ 'data-go': k.go, 'data-x': k.x })}><span class="tt">${k.title}</span>${k.sub ? `<span class="ss">${k.sub}</span>` : ''}${k.meta ? `<span class="flex gap4">${k.meta}</span>` : ''}</div>`).join('') || '<span class="t3 tiny">Empty</span>'}</div>`).join('')}</div>`;
  },
  /* Timeline: [{ when, text, tone }] */
  timeline(items) { return `<div class="tl">${items.map(i => `<div class="tl-i"><i class="${i.tone || ''}"></i><div><div class="w">${i.when || ''}</div><div>${i.text}</div></div></div>`).join('')}</div>`; },
  /* Horizontal bars: [{ label, value, max?, tone, right }] */
  bars(items, o) {
    const max = (o && o.max) || Math.max(1, ...items.map(i => i.max || i.value));
    return `<div class="bars">${items.map(i => `<div class="bar-r"><span class="nowrap" style="overflow:hidden;text-overflow:ellipsis">${i.label}</span><span class="tr"><i class="${i.tone || ''}" style="width:${Math.max(1, Math.min(100, 100 * i.value / (i.max || max)))}%"></i></span><span class="num t2">${i.right != null ? i.right : num(i.value)}</span></div>`).join('')}</div>`;
  },
  progress(v, max, tone) { return `<div class="prog" role="progressbar" aria-valuenow="${v}" aria-valuemax="${max}"><i class="${tone || ''}" style="width:${Math.max(0, Math.min(100, 100 * v / max))}%"></i></div>`; },
  meter(label, used, total, o) {
    const p = total ? used / total : 0; const tone = p >= 1 ? 'danger' : p >= .8 ? 'warn' : (o && o.tone) || '';
    return `<div class="meter"><div class="flex"><span>${label}</span><span class="num t2">${num(used)} / ${total == null ? 'unlimited' : num(total)}${o && o.unit ? ' ' + o.unit : ''}</span></div>${h.progress(used, total || used || 1, tone)}</div>`;
  },
  spark(vals) {
    const w = 80, ht = 22, mx = Math.max(...vals), mn = Math.min(...vals), sp = mx - mn || 1;
    const pts = vals.map((v, i) => `${(i * w / (vals.length - 1)).toFixed(1)},${(ht - 2 - (v - mn) * (ht - 4) / sp).toFixed(1)}`).join(' L');
    return `<svg class="spark" viewBox="0 0 ${w} ${ht}" aria-hidden="true"><path d="M${pts}"/></svg>`;
  },
  /* Column chart. series: [{ values, cls: c1|c2|c3|c4|cai }], labels: [...] ; o: { h, money, line: values } */
  colchart(labels, series, o) {
    o = o || {}; const W = 560, H = o.h || 170, pad = 22, n = labels.length, gw = (W - pad * 2) / n;
    const mx = Math.max(1, ...series.flatMap(s => s.values), ...(o.line || [0]));
    const bw = Math.min(26, (gw - 6) / series.length);
    let out = `<svg class="chart" viewBox="0 0 ${W} ${H + 18}" role="img" aria-label="${esc(o.label || 'Chart')}"><line class="ax" x1="${pad}" y1="${H}" x2="${W - pad}" y2="${H}"/>`;
    labels.forEach((l, i) => {
      series.forEach((s, j) => { const v = s.values[i] || 0; const bh = (H - 10) * v / mx; out += `<rect class="${s.cls || 'c1'}" x="${(pad + i * gw + (gw - bw * series.length) / 2 + j * bw).toFixed(1)}" y="${(H - bh).toFixed(1)}" width="${(bw - 2).toFixed(1)}" height="${bh.toFixed(1)}" rx="2"><title>${esc(l)}: ${o.money ? money(v) : num(v)}</title></rect>`; });
      out += `<text class="lb" x="${(pad + i * gw + gw / 2).toFixed(1)}" y="${H + 13}" text-anchor="middle">${esc(l)}</text>`;
    });
    if (o.line) { out += `<path class="l2" d="M${o.line.map((v, i) => `${(pad + i * gw + gw / 2).toFixed(1)},${(H - (H - 10) * v / mx).toFixed(1)}`).join(' L')}"/>`; }
    return out + '</svg>';
  },
  donut(p, label) {
    const r = 26, cf = 2 * Math.PI * r, v = Math.max(0, Math.min(1, p));
    return `<svg class="donut" viewBox="0 0 64 64" role="img" aria-label="${esc(label || Math.round(v * 100) + '%')}"><circle class="bg" cx="32" cy="32" r="${r}" fill="none" stroke-width="8"/><circle class="fg" cx="32" cy="32" r="${r}" fill="none" stroke-width="8" stroke-dasharray="${(cf * v).toFixed(1)} ${cf.toFixed(1)}" transform="rotate(-90 32 32)"/><text x="32" y="36" text-anchor="middle" style="font:750 12px var(--font-body);fill:var(--text)">${Math.round(v * 100)}%</text></svg>`;
  },
  /* AI card. o: { agent, title, body, credits, level (L0-L4), actions, why } */
  aiCard(o) {
    return `<div class="aic"><div class="ah">${icon('spark')}<span>${o.agent || 'Copilot'}</span>${o.level ? `<span class="lv">${o.level}</span>` : ''}${o.credits != null ? `<span class="cr">${o.credits} cr</span>` : ''}</div>${o.title ? `<div class="b">${o.title}</div>` : ''}${o.body ? `<div>${o.body}</div>` : ''}${o.why ? `<div class="tiny t2">${o.why}</div>` : ''}${o.actions ? `<div class="flex">${o.actions}</div>` : ''}</div>`;
  },
  empty(text) { return `<div class="empty">${text}</div>`; },
  note(text) { return `<div class="xnote">${text}</div>`; },
  avatar(name, n) { return `<span class="av c${(n != null ? n : hash(name) % 5) + 1}" title="${esc(name)}">${esc(initials(name))}</span>`; },
  /* Masked value for a field class the role cannot see (02 §10.2). */
  mask(c, fc, value) {
    if (c.seesFully ? c.seesFully(fc) : c.sees(fc)) return value;
    const g = c.fcGrant ? c.fcGrant(fc) : '-';
    return `<span class="masked" title="${c.sees(fc) ? `Partial: ${esc(c.role)} gets field class ${fc} as &quot;${esc(g)}&quot; only` : `Hidden: field class ${fc} is not visible to ${esc(c.role)}`} (02 §10.2)">•••</span>`;
  },
  field(label, control, hint) { return `<label class="fld"><span>${label}</span>${control}${hint ? `<span class="hint">${hint}</span>` : ''}</label>`; },
  input(value, o) { o = o || {}; return `<input class="inp${o.ro ? ' ro' : ''}" value="${esc(value)}"${attr({ readonly: o.ro, placeholder: o.ph, type: o.type || 'text', 'data-ui-input': o.ui, 'aria-label': o.label })}>`; },
  textarea(value, o) { o = o || {}; return `<textarea class="inp"${attr({ 'data-ui-input': o.ui, 'aria-label': o.label, placeholder: o.ph })}>${esc(value)}</textarea>`; },
  select(options, value, o) { o = o || {}; return `<select class="inp"${attr({ 'data-ui-input': o.ui, 'aria-label': o.label })}>${options.map(op => { const [v, l] = Array.isArray(op) ? op : [op, op]; return `<option value="${esc(v)}"${String(v) === String(value) ? ' selected' : ''}>${esc(l)}</option>`; }).join('')}</select>`; },
  /* Toggle bound to RL.ui[key] (boolean-ish). */
  toggle(label, key, def) { const on = RL.ui[key] != null ? RL.ui[key] === 'true' || RL.ui[key] === true : !!def; return `<button type="button" class="tgl${on ? ' on' : ''}" data-ui="${esc(key)}" data-val="${on ? 'false' : 'true'}" aria-pressed="${on}"><i></i>${label}</button>`; },
  on(key, def) { return RL.ui[key] != null ? RL.ui[key] === 'true' || RL.ui[key] === true : !!def; },
  steps(labels, active) { return `<div class="steps">${labels.map((l, i) => `<span class="${i < active ? 'done' : i === active ? 'on' : ''}">${i + 1}. ${l}</span>`).join('')}</div>`; },
  banner(text, tone) { return `<div class="mx-banner ${tone || 'info'}"><span>${text}</span></div>`; },
  /* Simple map. o: { pins: [{x,y,n,tone,label}], route: [[x,y],...], h } (coordinates in 0-400 x 0-240) */
  map(o) {
    o = o || {}; const seed = o.seed || 7;
    const tones = { ok: 'var(--ok-solid)', warn: 'var(--warn-solid)', danger: 'var(--danger-solid)', info: 'var(--info-solid)', ai: 'var(--ai-solid)', accent: 'var(--accent)', done: 'var(--stone-450)' };
    let s = `<div class="mapbox"><svg viewBox="0 0 400 ${o.h || 240}" role="img" aria-label="${esc(o.label || 'Map')}"><rect class="mp-bg" width="400" height="${o.h || 240}"/>`;
    s += `<path class="mp-wt" d="M${300 + seed % 40},0 C${320 + seed % 30},60 ${360},90 400,${110 + seed % 30} L400,0 Z"/><rect class="mp-pk" x="${40 + seed % 60}" y="150" width="70" height="46" rx="8"/>`;
    for (let i = 0; i < 6; i++) s += `<path class="mp-rd" d="M0,${30 + i * 40 + (seed * i) % 12} L400,${20 + i * 42 + (seed * (i + 2)) % 18}"/><path class="mp-rd2" d="M${40 + i * 66 + (seed * i) % 20},0 L${30 + i * 70},${o.h || 240}"/>`;
    if (o.route) (Array.isArray(o.route[0][0]) ? o.route : [o.route]).forEach((rt, j) => { s += `<path class="mp-rt" stroke="${(o.colors && o.colors[j]) || ['var(--primary)', 'var(--sky-500)', 'var(--clay-500)', 'var(--marigold-600)', 'var(--iris-500)'][j % 5]}" d="M${rt.map(p => p.join(',')).join(' L')}"/>`; });
    (o.pins || []).forEach(p => { s += `<g class="mp-pin"><circle cx="${p.x}" cy="${p.y}" r="9" fill="${p.color || tones[p.tone] || 'var(--primary)'}"/><text x="${p.x}" y="${p.y}">${esc(p.n != null ? p.n : '')}</text>${p.label ? `<title>${esc(p.label)}</title>` : ''}</g>`; });
    return s + '</svg></div>';
  },
  /* Yard photo placeholder. kind: before|after|mockup|lawn|snow|patio|bed|night ; o: { label } */
  photo(kind, o) {
    o = o || {}; const id = 'g' + hash(kind + (o.label || '')).toString(36);
    const sky = kind === 'night' ? '#1d2440' : kind === 'snow' ? '#dfe6ec' : '#cfe3f1';
    const lawn = kind === 'snow' ? '#f4f6f8' : kind === 'before' ? '#a9b46a' : '#6fa34f';
    let s = `<span class="photo"><svg viewBox="0 0 320 200" role="img" aria-label="${esc(o.label || kind + ' photo')}"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky}"/><stop offset="1" stop-color="${kind === 'night' ? '#2c3a5a' : '#eef4f8'}"/></linearGradient></defs><rect width="320" height="200" fill="url(#${id})"/>`;
    s += `<rect x="70" y="52" width="150" height="78" fill="${kind === 'night' ? '#3a3f52' : '#ece6db'}"/><path d="M60 56 L145 18 L230 56 Z" fill="${kind === 'night' ? '#272b3a' : '#7a6f62'}"/><rect x="132" y="88" width="24" height="42" fill="${kind === 'night' ? '#e8c46a' : '#8a6a4f'}"/>`;
    s += `<rect x="0" y="128" width="320" height="72" fill="${lawn}"/>`;
    if (kind === 'after' || kind === 'mockup' || kind === 'bed' || kind === 'night') s += `<path d="M20 132 Q90 118 160 132 T300 132 L300 150 L20 150Z" fill="${kind === 'night' ? '#3b2e26' : '#8a6a4f'}"/>` + [40, 75, 110, 190, 225, 262].map((x, i) => `<circle cx="${x}" cy="${128 - (i % 2) * 4}" r="${11 + (i % 3) * 3}" fill="${['#3f7d35', '#5f9952', '#b5562f', '#e8b03a', '#2f6428', '#87b67a'][i]}"/>`).join('');
    if (kind === 'patio' || kind === 'mockup') s += `<path d="M150 200 L180 150 L300 150 L320 200Z" fill="#cfc6b6"/><circle cx="248" cy="172" r="12" fill="#645c4f"/>`;
    if (kind === 'night') s += [50, 100, 150, 200, 250].map(x => `<circle cx="${x}" cy="140" r="5" fill="#f2cb6b" opacity=".9"/><circle cx="${x}" cy="140" r="16" fill="#f2cb6b" opacity=".18"/>`).join('');
    if (kind === 'snow') s += `<path d="M0 160 L320 150 L320 200 L0 200Z" fill="#4b453b" opacity=".7"/><path d="M30 175 L290 165" stroke="#f2cb6b" stroke-width="3" stroke-dasharray="14 10"/>`;
    if (kind === 'lawn') s += Array.from({ length: 9 }, (_, i) => `<rect x="${i * 36}" y="128" width="18" height="72" fill="#5f9952" opacity=".5"/>`).join('');
    if (o.badge) s += `<rect x="8" y="8" rx="5" width="${o.badge.length * 6.4 + 14}" height="20" fill="rgba(21,19,15,.72)"/><text x="15" y="22" style="font:700 10px var(--font-body);fill:#fff">${esc(o.badge)}</text>`;
    return s + '</svg></span>';
  },
  /* Lock / upsell card for a gated feature (used by deniedHtml and inline). */
  lock(c, featureKey, unlock) {
    const f = RL.idx.FEATS[featureKey];
    const un = unlock || (c.feat(featureKey).unlock || []);
    const buyer = c.role === 'owner';
    const opts = un.map(u => `<li><b>${esc(u.name)}</b>${u.kind === 'addon' ? ' add-on' : ' plan'}: ${esc(u.price)}</li>`).join('');
    return `<div class="lockc"><div class="lh">${icon('lock')}${esc(f ? f.name : featureKey)}</div><p class="small t2">Not included in <b>${esc(c.plan.name)}</b>.${opts ? '' : ' Contact sales.'}</p>${opts ? `<ul class="small" style="margin:0;padding-left:18px">${opts}</ul>` : ''}<div class="flex">${buyer ? h.btn(un[0] && un[0].kind === 'addon' ? 'Add ' + esc(un[0].name) : 'Compare plans', { kind: 'primary', go: 'web.settings.subscription' }) + h.btn('Start a 30-day module trial', { act: 'trial' }) : `<span class="small t2">Ask ${esc(c.owner)} (owner) to upgrade.</span>`}</div>${h.note('Entitlement UX: plans.json entitlement_ux. Limits and prices: 22 §4.2, §4.5.')}</div>`;
  },
  /* Limit badge for 'L' capabilities */
  limit(c, featureKey) { const f = c.feat(featureKey); return f.s === 'L' ? h.pill('Limit: ' + esc(f.note || 'see plan'), 'info') : ''; },
  dateFmt(d) { return d; },
};
RL.act('trial', (el, ev, c) => { RL.toast('Module trial started (mock): 30 days, once per module per Company (22 §4.6).'); return false; });
})();
