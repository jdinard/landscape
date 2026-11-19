/* Rootline walkthrough engine.
   Renders the shared frame (rail, bar, screen, behind-the-scenes panel) for a walkthrough
   defined in a global WT object (see tools/walkthroughs/README.md). Vanilla JS, no globals
   beyond the helpers below and WT. */
'use strict';
var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
var money = function (n, cents) { var v = Math.abs(n); var s = v.toLocaleString('en-US', { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 }); return (n < 0 ? '-$' : '$') + s; };
var num = function (n, d) { return Number(n).toLocaleString('en-US', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); };
function ic(n, c) { return '<svg class="ic' + (c ? ' ' + c : '') + '" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; }
function tag(t) { return '<span class="tag ' + t + '">' + ({ mvp: 'MVP', v1: 'V1', v2: 'V2', v3: 'V3' }[t] || t) + '</span>'; }
function pill(cls, text, icon) { return '<span class="pill ' + (cls || '') + '">' + (icon ? ic(icon) : '') + esc(text) + '</span>'; }
function aiChip(text) { return '<span class="pill ai">' + ic('spark') + esc(text) + '</span>'; }
function cost(n) { return '<span class="cost">' + n + ' credit' + (n === 1 ? '' : 's') + '</span>'; }
/* ---------- device frames ---------- */
function phone(inner, opt) {
  opt = opt || {};
  var brand = opt.noBrand ? '' : '<div class="brand"><span class="logo">' + ic(opt.logo || 'leaf') + '</span><span><b>' + esc(opt.brand || 'Greenleaf Grounds Co.') + '</b><small>' + esc(opt.sub || '') + '</small></span><span class="sp"></span>' + (opt.right || '<span class="faint">' + ic('menu') + '</span>') + '</div>';
  return '<div class="phone pt-phone" style="position:relative" role="group" aria-label="' + esc(opt.label || 'Phone screen') + '"><div class="status"><span>' + esc(opt.time || '9:41') + '</span><span class="bat">' + (opt.offline ? ic('wifi-off', 's') + ' Offline ' : '5G ') + ic('battery', 's') + '</span></div><div class="body pt-pbody" data-keep="pbody' + (opt.k || '') + '">' + brand + '<div class="pbody-pad">' + inner + '</div>' + (opt.foot ? '<div class="pfoot">' + esc(opt.foot) + '</div>' : '') + '</div></div>';
}
function browser(url, inner, label) {
  return '<div class="frame-scroll"><div class="browser" role="group" aria-label="' + esc(label || 'Desktop screen') + '"><div class="browser-bar"><div class="dots" aria-hidden="true"><i></i><i></i><i></i></div><div class="url">' + esc(url) + '</div></div>' + inner + '</div></div>';
}
var APP_NAV = [['today', 'Today'], ['inbox', 'Inbox'], ['approve', 'Approvals'], ['users', 'Clients'], ['dollar', 'Sales'], ['pen', 'Design'], ['calendar', 'Schedule'], ['clipboard', 'Jobs'], ['bank', 'Money'], ['chart', 'Reports'], ['cog', 'Settings']];
function appShell(active, main, opt) {
  opt = opt || {};
  var counts = opt.counts || {};
  var nav = (opt.nav || APP_NAV).map(function (n) { var on = n[1] === active; var b = counts[n[1]] ? '<span class="badge">' + counts[n[1]] + '</span>' : ''; return '<span class="item' + (on ? ' active' : '') + '"' + (on ? ' aria-current="page"' : '') + '>' + ic(n[0]) + n[1] + b + '</span>'; }).join('');
  var left = START_LEFT - creditsThrough(stepIndex(current));
  var foot = opt.foot != null ? opt.foot : 'AI credits <b>' + num(left) + '</b> of ' + num(ALLOW) + ' left<div class="meter"><i style="width:' + (left / ALLOW * 100).toFixed(1) + '%"></i></div>';
  return '<div class="app pt-app"><nav class="app-side" aria-label="' + esc(opt.navLabel || 'Company app navigation (concept)') + '"><div class="co"><span class="logo">' + ic(opt.logo || 'leaf') + '</span><span><b>' + esc(opt.co || 'Greenleaf Grounds Co.') + '</b><small>' + esc(opt.coSub || 'Columbus, OH · Pro') + '</small></span></div>' + nav + (foot ? '<div class="sidefoot">' + foot + '</div>' : '') + '</nav><div class="app-main">' + main + '</div></div>';
}
function ctxCard(title, items, extra) {
  return '<aside class="big-view" aria-label="About this screen"><div class="card"><h3 style="font-size:.95rem">' + esc(title) + '</h3><ul style="margin:6px 0 0;padding-left:18px;display:grid;gap:5px;font-size:.82rem;color:var(--text-2)">' + items.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul></div>' + (extra || '') + '</aside>';
}
function devRow() { return '<div class="dev-row">' + Array.prototype.slice.call(arguments).join('') + '</div>'; }
function $(s, r) { return (r || document).querySelector(s); }
function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

var S = WT.state || {};
var STEPS = [{ id: 'overview', act: -1, short: 'Start here', title: WT.ovTitle || WT.short }].concat(WT.steps);
var current = 'overview', navSource = 'load', btsOpen = true, timers = [], visited = {};
var CREDITS = WT.credits || {};
var ALLOW = WT.allowance || 6000, START_LEFT = WT.startLeft != null ? WT.startLeft : 6000;

function stepIndex(id) { for (var i = 0; i < STEPS.length; i++) if (STEPS[i].id === id) return i; return 0; }
function creditsThrough(idx) { var t = 0; for (var i = 1; i <= idx; i++) t += CREDITS[STEPS[i].id] || 0; return t; }
var TOTAL_CREDITS = creditsThrough(STEPS.length - 1);
function clearTimers() { timers.forEach(function (t) { clearTimeout(t); }); timers = []; }
function later(fn, ms) { var t = setTimeout(function () { timers = timers.filter(function (x) { return x !== t; }); fn(); update(); }, RM ? 0 : ms); timers.push(t); return t; }

/* ---------- rail ---------- */
function renderRail() {
  var idx = stepIndex(current);
  var h = '<a class="rall" href="walkthroughs.html">' + ic('arrow-l') + 'All walkthroughs</a>';
  h += '<a class="rstart" href="#overview"' + (current === 'overview' ? ' aria-current="step"' : '') + '>' + ic('play') + 'Start here</a>';
  WT.acts.forEach(function (a, ai) {
    h += '<div class="act"><div class="act-h"><b>' + esc(a.n.toUpperCase()) + '</b>' + esc(a.t) + '</div><ol>';
    STEPS.forEach(function (s, i) {
      if (s.act !== ai) return;
      var cls = 'st' + (visited[s.id] && s.id !== current ? ' done' : '');
      h += '<li><a class="' + cls + '" href="#' + s.id + '"' + (s.id === current ? ' aria-current="step"' : '') + ' title="' + esc(s.title) + '"><span class="n">' + (i < 10 ? '0' + i : i) + '</span><span class="t">' + esc(s.short) + '</span>' + (s.ai ? '<span class="ai-dot" aria-label="AI step"></span>' : '<span></span>') + '</a></li>';
    });
    h += '</ol></div>';
  });
  if (TOTAL_CREDITS > 0) {
    var used = creditsThrough(idx);
    h += '<div class="rfoot">AI credits so far <b>' + used + '</b> of ' + TOTAL_CREDITS + '<div class="meter"><i style="width:' + (used / TOTAL_CREDITS * 100).toFixed(1) + '%"></i></div><div class="mt6">' + esc(WT.creditOwner || 'Greenleaf') + ' left this month: <b>' + num(START_LEFT - used) + '</b></div></div>';
  }
  $('#rail').innerHTML = h;
}

/* ---------- bar ---------- */
var THEMES = ['auto', 'light', 'dark'], theme = 'auto';
try { theme = localStorage.getItem('rootline-proto-theme') || 'auto'; } catch (e) { theme = 'auto'; }
function applyTheme() { if (theme === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', theme); }
applyTheme();
function renderBar() {
  var idx = stepIndex(current), s = STEPS[idx], n = STEPS.length - 1;
  var where = idx === 0 ? 'Overview' : WT.acts[s.act].n + ' · ' + WT.acts[s.act].t + ' · step ' + idx + ' of ' + n;
  $('#bar').innerHTML = '<div class="where"><span class="eyebrow">' + esc(where) + '</span><h1 id="step-h" tabindex="-1">' + esc(s.title) + '</h1></div><div class="ctrls"><div class="prog"><span class="track" role="progressbar" aria-valuemin="0" aria-valuemax="' + n + '" aria-valuenow="' + idx + '" aria-label="Walkthrough progress"><i style="width:' + (idx / n * 100).toFixed(1) + '%"></i></span><span class="num">' + idx + ' / ' + n + '</span></div>' +
    '<button type="button" class="btn sm" data-act="prev" data-k="prev"' + (idx === 0 ? ' disabled' : '') + '>' + ic('arrow-l') + 'Back</button><button type="button" class="btn sm primary" data-act="next" data-k="next"' + (idx === n ? ' disabled' : '') + '>' + (idx === 0 ? 'Start' : 'Next') + ic('arrow-r') + '</button><button type="button" class="btn sm ghost" data-act="theme" data-k="theme" aria-label="Theme: ' + theme + '. Change theme">' + ic(theme === 'dark' ? 'moon' : 'sun') + '<span class="tiny">' + theme + '</span></button></div>';
}

/* ---------- behind the scenes ---------- */
function btsHTML() {
  var f = WT.bts[current]; var b = f ? f(S) : null; if (!b) return '';
  var idx = stepIndex(current), h = '';
  h += '<div class="bts-sec"><h3>What\'s happening</h3><p>' + b.what + '</p></div>';
  if (b.agents || b.trace) {
    h += '<div class="bts-sec"><h3>' + ic('spark', 's') + (b.traceTitle || 'Agent and automation trace') + '</h3>' + (b.agents || []).map(function (a) { return '<div class="agent"><span class="badge' + (a[2] ? ' det' : '') + '">' + ic(a[2] ? 'cog' : 'spark') + '</span><span><b>' + esc(a[0]) + '</b><small>' + esc(a[1]) + '</small></span></div>'; }).join('');
    if (b.trace) h += '<ol class="trace">' + b.trace.map(function (t, i) { var st = t.pending ? 'pending' : (t.running ? 'running' : ''); if (t.human) st += ' human'; return '<li class="' + st.trim() + '"><span class="i">' + (i + 1) + '</span><span><code class="' + (t.det ? 'det' : '') + '">' + esc(t.c) + '</code><span class="res">' + esc(t.r || '') + '</span></span><span class="ms">' + (t.pending ? '' : (t.running ? '…' : esc(t.ms || ''))) + '</span></li>'; }).join('') + '</ol>';
    h += '</div>';
  }
  if (b.hitl) h += '<div class="bts-sec"><h3>' + ic('user', 's') + 'Human in the loop</h3><div class="hitl">' + b.hitl.map(function (x) { return '<div>' + ic('check') + '<span><b>' + esc(x[0]) + '</b> ' + esc(x[1]) + '</span></div>'; }).join('') + '</div><div class="lvl">' + (b.levels || []).map(function (l) { return '<span class="pill info">' + esc(l) + '</span>'; }).join('') + '</div></div>';
  var n = CREDITS[current] || 0;
  if (TOTAL_CREDITS === 0 && b.creditNote) h += '<div class="bts-sec"><h3>' + ic('bolt', 's') + 'AI credits</h3><p class="tiny muted" style="margin:0">' + esc(b.creditNote) + '</p></div>';
  else if (TOTAL_CREDITS > 0 || b.creditNote) {
    var run = creditsThrough(idx);
    h += '<div class="bts-sec"><h3>' + ic('bolt', 's') + 'AI credits</h3><div class="cred"><span>This step</span><span class="big">' + n + '</span><span>Running total</span><span class="mono" style="font-weight:600">' + run + ' of ' + TOTAL_CREDITS + '</span><small>' + esc(b.creditNote || (n ? '' : 'No AI runs here; deterministic automation is free.')) + '</small></div>' +
      (TOTAL_CREDITS > 0 ? '<div class="meter" title="Monthly allowance"><i style="width:' + ((ALLOW - START_LEFT + run) / ALLOW * 100).toFixed(1) + '%"></i></div><small class="tiny faint">' + esc(WT.creditOwner || 'Greenleaf') + ' (' + esc(WT.plan || 'Pro') + '): ' + num(START_LEFT - run) + ' of ' + num(ALLOW) + ' credits left this month</small>' : '') + '</div>';
  }
  if (b.tags) h += '<div class="bts-sec"><h3>Scope</h3><div style="display:grid;gap:5px">' + b.tags.map(function (t) { return '<div class="tagrow">' + tag(t[0]) + '<span class="note">' + esc(t[1]) + '</span></div>'; }).join('') + '</div></div>';
  if (b.specs) h += '<div class="bts-sec"><h3>Spec references</h3><div class="specs">' + esc(b.specs) + '</div></div>';
  return h;
}
function renderBTS() {
  var el = $('#bts');
  el.classList.toggle('collapsed', !btsOpen);
  el.innerHTML = '<div class="bts-head"><span class="ai-mark">' + ic('spark') + '</span><h2>Behind the scenes</h2><button type="button" class="btn xs" data-act="bts" data-k="bts" aria-expanded="' + btsOpen + '" aria-controls="bts-body">' + (btsOpen ? 'Hide' : 'Show') + '</button></div><div class="bts-body" id="bts-body">' + btsHTML() + '</div>';
}

/* ---------- overview ---------- */
function overviewHTML() {
  var o = WT.ov;
  var jm = WT.acts.map(function (a, ai) {
    var steps = STEPS.filter(function (s) { return s.act === ai; });
    var nodes = steps.map(function (s, j) {
      var i = stepIndex(s.id);
      return '<a class="jm-node' + (j === steps.length - 1 ? ' last' : '') + '" href="#' + s.id + '"><span class="k">' + (i < 10 ? '0' + i : i) + (s.ai ? '<span class="ai-dot" aria-label="AI step"></span>' : '') + '</span><b>' + esc(s.short) + '</b><span class="who">' + esc(s.who || '') + '</span>' + (s.tags || []).map(tag).join(' ') + '</a>';
    }).join('');
    return '<div class="jm-act"><div class="jh"><b>' + esc(a.n.toUpperCase()) + '</b><span>' + esc(a.t) + '</span><small>' + esc(a.sub || '') + '</small></div><div class="jm-row">' + nodes + '</div></div>';
  }).join('');
  var cast = (o.cast || []).map(function (c) { return '<div class="card"><h3>' + ic(c.icon || 'user') + esc(c.h) + '</h3><ul>' + c.items.map(function (x) { return '<li><b>' + esc(x[0]) + '</b> ' + esc(x[1]) + '</li>'; }).join('') + '</ul></div>'; }).join('');
  return '<div class="ov-hero"><p class="eyebrow">' + esc(o.eyebrow) + '</p><h2>' + esc(o.h) + '</h2><p class="lede">' + o.lede + '</p><div class="flex"><a class="btn primary" href="#' + STEPS[1].id + '" data-k="ov-start">Start walkthrough ' + ic('arrow-r') + '</a><span class="muted small">' + (STEPS.length - 1) + ' steps · use the ← → keys</span></div></div>' +
    '<h3 class="sec-t">The journey</h3><div class="jm">' + jm + '</div>' +
    (cast ? '<h3 class="sec-t">The cast</h3><div class="cast">' + cast + '</div>' : '') + (o.extra || '');
}

/* ---------- screen and routing ---------- */
function renderScreen() {
  var el = $('#screen'), keep = {};
  $$('[data-keep]', el).forEach(function (n) { keep[n.getAttribute('data-keep')] = n.scrollTop; });
  el.innerHTML = current === 'overview' ? (WT.overview ? WT.overview(S) : overviewHTML()) : (WT.screens[current] ? WT.screens[current](S) : '');
  $$('[data-keep]', el).forEach(function (n) { var k = n.getAttribute('data-keep'); if (keep[k] != null) n.scrollTop = keep[k]; });
}
function update() {
  var a = document.activeElement, k = a && a.getAttribute ? a.getAttribute('data-k') : null;
  var sel = a && typeof a.selectionStart === 'number' ? [a.selectionStart, a.selectionEnd] : null;
  renderScreen(); renderBTS(); renderRail(); renderBar();
  if (k) { var n = document.querySelector('[data-k="' + k + '"]'); if (n && !n.disabled) { try { n.focus({ preventScroll: true }); } catch (e) { n.focus(); } if (sel && n.setSelectionRange) { try { n.setSelectionRange(sel[0], sel[1]); } catch (e) {} } } }
}
function go(id, src) { navSource = src || 'link'; if (location.hash.slice(1) === id) route(); else location.hash = id; }
function route() {
  var id = (location.hash || '').replace(/^#/, '');
  if (id !== 'overview' && !WT.screens[id]) id = 'overview';
  var changed = id !== current;
  if (changed) clearTimers();
  var idx = stepIndex(id);
  if (WT.ensure) for (var i = 1; i < idx; i++) { var f = WT.ensure[STEPS[i].id]; if (f) f(S); }
  visited[id] = true; current = id;
  renderScreen(); renderBTS(); renderRail(); renderBar();
  document.title = (id === 'overview' ? '' : STEPS[idx].short + ' · ') + WT.title;
  if (changed) {
    var top = $('#main'); if (top && window.scrollY > top.offsetTop - 60) window.scrollTo(0, Math.max(0, top.offsetTop - 60));
    if (navSource === 'button') { var b = document.querySelector('[data-k="next"]'); if (b && !b.disabled) b.focus({ preventScroll: true }); }
    else if (navSource !== 'load') { var hh = $('#step-h'); if (hh) hh.focus({ preventScroll: true }); }
    if (WT.enter && WT.enter[id]) WT.enter[id](S);
  }
  navSource = 'link';
}
function nav(d) { var i = stepIndex(current) + d; if (i < 0 || i >= STEPS.length) return; go(STEPS[i].id, 'button'); }

/* ---------- events ---------- */
document.addEventListener('click', function (e) {
  var t = e.target.closest ? e.target.closest('[data-act],[data-go]') : null; if (!t) return;
  if (t.hasAttribute('data-go')) { e.preventDefault(); go(t.getAttribute('data-go'), 'link'); return; }
  var a = t.getAttribute('data-act');
  if (a === 'prev') return nav(-1);
  if (a === 'next') return nav(1);
  if (a === 'bts') { btsOpen = !btsOpen; renderBTS(); var bb = document.querySelector('[data-k="bts"]'); if (bb) bb.focus(); return; }
  if (a === 'theme') { theme = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length]; try { localStorage.setItem('rootline-proto-theme', theme); } catch (er) {} applyTheme(); renderBar(); var tb = document.querySelector('[data-k="theme"]'); if (tb) tb.focus(); return; }
  if (WT.actions && WT.actions[a]) { e.preventDefault(); var r = WT.actions[a](t, S, e); if (r !== false) update(); }
});
function onInput(e) {
  var t = e.target; if (!t.getAttribute) return; var k = t.getAttribute('data-in'); if (!k || !WT.inputs || !WT.inputs[k]) return;
  var live = t.type === 'range' || t.type === 'checkbox' || t.type === 'radio' || t.tagName === 'SELECT';
  if (e.type === 'input' && !live && t.getAttribute('data-live') == null) return;
  var r = WT.inputs[k](t, S, e); if (r !== false) update();
}
document.addEventListener('input', onInput);
document.addEventListener('change', onInput);
document.addEventListener('submit', function (e) { e.preventDefault(); var f = e.target.getAttribute('data-submit'); if (f && WT.actions && WT.actions[f]) { WT.actions[f](e.target, S, e); update(); } });
document.addEventListener('keydown', function (e) {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  var t = e.target, tn = t && t.tagName;
  if (tn === 'INPUT' || tn === 'TEXTAREA' || tn === 'SELECT' || (t && t.isContentEditable) || (t && t.getAttribute && t.getAttribute('role') === 'slider')) return;
  if (e.key === 'ArrowRight') { e.preventDefault(); nav(1); } else if (e.key === 'ArrowLeft') { e.preventDefault(); nav(-1); }
});
window.addEventListener('hashchange', route);
route();
