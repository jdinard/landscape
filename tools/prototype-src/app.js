/* ============================================================
   App: rail, step bar, behind-the-scenes panel, router, events
   ============================================================ */
var current = 'overview', navSource = 'load', btsOpen = true, timers = [];
function cur() { return current; }
function $(s, r) { return (r || document).querySelector(s); }
function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
function clearTimers() { timers.forEach(function (t) { clearTimeout(t); }); timers = []; }
function later(fn, ms) { var t = setTimeout(function () { timers = timers.filter(function (x) { return x !== t; }); fn(); }, RM ? 0 : ms); timers.push(t); return t; }

var visited = {};
function renderRail() {
  var idx = stepIndex(current);
  var h = '<a class="rall" href="walkthroughs.html">' + ic('arrow-l') + 'All walkthroughs</a><a class="rstart" href="#overview"' + (current === 'overview' ? ' aria-current="step"' : '') + '>' + ic('play') + 'Start here</a>';
  ACTS.forEach(function (a, ai) {
    h += '<div class="act"><div class="act-h"><b>' + a.n.toUpperCase() + '</b>' + esc(a.t) + '</div><ol>';
    STEPS.forEach(function (s, i) {
      if (s.act !== ai) return;
      var cls = 'st' + (visited[s.id] && s.id !== current ? ' done' : '');
      h += '<li><a class="' + cls + '" href="#' + s.id + '"' + (s.id === current ? ' aria-current="step"' : '') + ' title="' + esc(s.title) + '"><span class="n">' + (i < 10 ? '0' + i : i) + '</span><span class="t">' + esc(s.short) + '</span>' + (s.ai ? '<span class="ai-dot" aria-label="AI step"></span>' : '<span></span>') + '</a></li>';
    });
    h += '</ol></div>';
  });
  var used = creditsThrough(idx);
  h += '<div class="rfoot">AI credits so far <b>' + used + '</b> of ' + TOTAL_CREDITS + '<div class="meter"><i style="width:' + (used / TOTAL_CREDITS * 100).toFixed(1) + '%"></i></div><div class="mt6">Greenleaf left this month: <b>' + num(START_LEFT - used) + '</b></div></div>';
  $('#rail').innerHTML = h;
}
function renderBar() {
  var idx = stepIndex(current), s = STEPS[idx], n = STEPS.length - 1;
  var where = idx === 0 ? 'Overview' : ACTS[s.act].n + ' · ' + ACTS[s.act].t + ' · step ' + idx + ' of ' + n;
  var prevDis = idx === 0 ? ' disabled' : '', nextDis = idx === n ? ' disabled' : '';
  $('#bar').innerHTML = '<div class="where"><span class="eyebrow">' + esc(where) + '</span><h1 id="step-h" tabindex="-1">' + esc(s.title) + '</h1></div><div class="ctrls"><div class="prog" aria-label="Progress"><span class="track" role="progressbar" aria-valuemin="0" aria-valuemax="' + n + '" aria-valuenow="' + idx + '" aria-label="Walkthrough progress"><i style="width:' + (idx / n * 100).toFixed(1) + '%"></i></span><span class="num">' + idx + ' / ' + n + '</span></div>' +
    '<button type="button" class="btn sm" data-act="prev" data-k="prev"' + prevDis + '>' + ic('arrow-l') + 'Back</button><button type="button" class="btn sm primary" data-act="next" data-k="next"' + nextDis + '>' + (idx === 0 ? 'Start' : 'Next') + ic('arrow-r') + '</button><button type="button" class="btn sm ghost" data-act="theme" data-k="theme" aria-label="Theme: ' + themeName() + '. Change theme">' + ic(themeName() === 'dark' ? 'moon' : 'sun') + '<span class="tiny">' + themeName() + '</span></button></div>';
}
function btsRender() {
  var b = BTS[current] ? BTS[current]() : null; if (!b) return '';
  var idx = stepIndex(current), s = STEPS[idx], h = '';
  h += '<div class="bts-sec"><h3>What\'s happening</h3><p>' + b.what + '</p></div>';
  if (b.sections) h += b.sections;
  if (b.agents) h += '<div class="bts-sec"><h3>' + ic('spark', 's') + 'Agent trace</h3>' + b.agents.map(function (a) { return '<div class="agent"><span class="badge' + (a[2] ? ' det' : '') + '">' + ic(a[2] ? 'cog' : 'spark') + '</span><span><b>' + esc(a[0]) + '</b><small>' + esc(a[1]) + '</small></span></div>'; }).join('') +
    (b.trace ? '<ol class="trace">' + b.trace.map(function (t, i) { var st = t.done ? '' : (t.running ? ' running' : ' pending'); if (t.human) st += ' human'; return '<li class="' + st.trim() + '"><span class="i">' + (i + 1) + '</span><span><code class="' + (t.det ? 'det' : '') + '">' + esc(t.c) + '</code><span class="res">' + esc(t.r || '') + '</span></span><span class="ms">' + (t.done ? esc(t.ms || '') : (t.running ? '…' : '')) + '</span></li>'; }).join('') + '</ol>' : '') + '</div>';
  if (b.hitl) h += '<div class="bts-sec"><h3>' + ic('user', 's') + 'Human in the loop</h3><div class="hitl">' + b.hitl.map(function (x) { return '<div>' + ic('check') + '<span><b>' + esc(x[0]) + '</b> ' + esc(x[1]) + '</span></div>'; }).join('') + '</div><div class="lvl">' + (b.levels || []).map(function (l) { return '<span class="pill info">' + esc(l) + '</span>'; }).join('') + '</div></div>';
  if (b.credits) { var run = creditsThrough(idx); h += '<div class="bts-sec"><h3>' + ic('bolt', 's') + 'AI credits</h3><div class="cred"><span>This step</span><span class="big">' + b.credits.n + '</span><span>Running total</span><span class="mono" style="font-weight:600">' + run + ' of ' + TOTAL_CREDITS + '</span><small>' + esc(b.credits.note) + '</small></div><div class="meter" title="Greenleaf monthly allowance"><i style="width:' + ((ALLOWANCE - START_LEFT + run) / ALLOWANCE * 100).toFixed(1) + '%"></i></div><small class="tiny faint">Greenleaf (Pro): ' + num(START_LEFT - run) + ' of 6,000 credits left this month</small></div>'; }
  if (b.tags) h += '<div class="bts-sec"><h3>Scope</h3><div style="display:grid;gap:5px">' + b.tags.map(function (t) { return '<div class="tagrow">' + tag(t[0]) + '<span class="note">' + esc(t[1]) + '</span></div>'; }).join('') + '</div></div>';
  if (b.specs) h += '<div class="bts-sec"><h3>Spec references</h3><div class="specs">' + esc(b.specs) + '</div></div>';
  return h;
}
function renderBTS() {
  var el = $('#bts');
  el.classList.toggle('collapsed', !btsOpen);
  var scroll = el.querySelector('.bts-body') ? el.scrollTop : 0;
  el.innerHTML = '<div class="bts-head"><span class="ai-mark">' + ic('spark') + '</span><h2>Behind the scenes</h2><button type="button" class="btn xs" data-act="bts" data-k="bts" aria-expanded="' + btsOpen + '" aria-controls="bts-body">' + (btsOpen ? 'Hide' : 'Show') + '</button></div><div class="bts-body" id="bts-body">' + btsRender() + '</div>';
  el.scrollTop = scroll;
}
function renderScreen() {
  var el = $('#screen');
  var keep = {};
  $$('[data-keep]', el).forEach(function (n) { keep[n.getAttribute('data-keep')] = n.scrollTop; });
  el.innerHTML = SCREEN[current] ? SCREEN[current]() : '';
  $$('[data-keep]', el).forEach(function (n) { var k = n.getAttribute('data-keep'); if (keep[k] != null) n.scrollTop = keep[k]; });
}
function update(opts) {
  opts = opts || {};
  var a = document.activeElement, k = a && a.getAttribute ? a.getAttribute('data-k') : null;
  renderScreen(); renderBTS(); renderRail(); renderBar();
  if (k) { var n = document.querySelector('[data-k="' + k + '"]'); if (n && !n.disabled) { try { n.focus({ preventScroll: true }); } catch (e) { n.focus(); } } }
}
function go(id, src) { navSource = src || 'link'; if (location.hash.slice(1) === id) route(); else location.hash = id; }
function route() {
  var id = (location.hash || '').replace(/^#/, '');
  if (!SCREEN[id]) id = 'overview';
  var idx = stepIndex(id);
  if (id !== current) { clearTimers(); S.card = null; S.typing = null; }
  ensureBefore(idx);
  visited[id] = true;
  var changed = id !== current;
  current = id;
  renderScreen(); renderBTS(); renderRail(); renderBar();
  document.title = (id === 'overview' ? '' : STEPS[idx].short + ' · ') + 'Rootline AI design walkthrough';
  if (changed) {
    var top = $('#main'); if (top && window.scrollY > top.offsetTop - 60) window.scrollTo(0, Math.max(0, top.offsetTop - 60));
    if (navSource === 'button') { var b = document.querySelector('[data-k="next"]') || document.querySelector('[data-k="prev"]'); if (lastBtn) b = document.querySelector('[data-k="' + lastBtn + '"]') || b; if (b && !b.disabled) b.focus({ preventScroll: true }); }
    else if (navSource !== 'load') { var hh = $('#step-h'); if (hh) hh.focus({ preventScroll: true }); }
  }
  navSource = 'link';
  if (id === 's04-ai-working') startRun();
}
var lastBtn = null;
function nav(delta) { var i = stepIndex(current) + delta; if (i < 0 || i >= STEPS.length) return; go(STEPS[i].id, 'button'); }

/* ---------- theme ---------- */
var THEMES = ['auto', 'light', 'dark'], theme = 'auto';
try { theme = localStorage.getItem('rootline-proto-theme') || 'auto'; } catch (e) { theme = 'auto'; }
function themeName() { return theme; }
function applyTheme() { if (theme === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', theme); }
applyTheme();

/* ---------- s04 run sequencer ---------- */
function startRun() {
  var R = S.run;
  if (RM) { if (R.a < 4) R.a = 4; if (R.verified && R.b < 3) R.b = 3; update(); return; }
  var tickA = function () { if (current !== 's04-ai-working') return; if (R.a < 4) { R.a += 1; update(); if (R.a < 4) later(tickA, 480); } };
  var tickB = function () { if (current !== 's04-ai-working') return; if (R.verified && R.b < 3) { R.b += 1; update(); if (R.b < 3) later(tickB, 620); } };
  if (R.a < 4) later(tickA, 380);
  else if (R.verified && R.b < 3) later(tickB, 380);
}

/* ---------- actions ---------- */
function setPath(path, val) { var ks = path.split('.'), o = S; for (var i = 0; i < ks.length - 1; i++) o = o[ks[i]]; o[ks[ks.length - 1]] = val; }
var ACT = {
  next: function (el) { lastBtn = el.getAttribute('data-k') === 'next' ? 'next' : null; nav(1); },
  prev: function () { lastBtn = 'prev'; nav(-1); },
  goto: function (el) { go(el.getAttribute('data-to'), 'link'); },
  noop: function () {},
  theme: function () { theme = THEMES[(THEMES.indexOf(theme) + 1) % 3]; try { localStorage.setItem('rootline-proto-theme', theme); } catch (e) { /* storage unavailable */ } applyTheme(); renderBar(); var b = $('[data-k="theme"]'); if (b) b.focus(); },
  bts: function () { btsOpen = !btsOpen; renderBTS(); var b = $('[data-k="bts"]'); if (b) b.focus(); },
  card: function (el) { S.card = el.getAttribute('data-sp'); S.cardReturn = el.getAttribute('data-k'); update(); var c = $('[data-k="card-close"]'); if (c) c.focus(); },
  closecard: function () { var r = S.cardReturn; S.card = null; update(); if (r) { var n = $('[data-k="' + r + '"]'); if (n) n.focus(); } },
  wrong: function (el) { S.wrong[el.getAttribute('data-sp')] = true; update(); var c = $('[data-k="card-close"]'); if (c) c.focus(); },
  // s02
  shot: function (el) { S.shot = +el.getAttribute('data-i'); update(); },
  take: function () { S.shots[S.shot] = true; if (S.shot < 2 && !S.shots[S.shot + 1]) S.shot += 1; update(); },
  samples: function () { S.shots = [true, true, true]; S.shot = 1; update(); },
  ref: function (el) { S.refOk = el.getAttribute('data-v') === '1'; update(); },
  // s03
  dimset: function (el) { S.dims[el.getAttribute('data-f')] = el.getAttribute('data-v'); update(); },
  style: function (el) { var k = el.getAttribute('data-v'); var on = Object.keys(S.dims.styles).filter(function (x) { return S.dims.styles[x]; }); if (S.dims.styles[k] && on.length === 1) return; S.dims.styles[k] = !S.dims.styles[k]; update(); },
  pet: function (el) { var k = el.getAttribute('data-v'); S.dims.pets[k] = !S.dims.pets[k]; update(); },
  bedwhere: function (el) { var k = el.getAttribute('data-v'); S.dims.beds[k] = !S.dims.beds[k]; update(); },
  // s04
  verify: function () { S.run.verified = true; update(); startRun(); },
  skip: function () { clearTimers(); S.run.a = 4; S.run.code = S.run.code || '482913'; S.run.verified = true; S.run.b = 3; update(); var n = $('[data-k="s04-next"]'); if (n) n.focus(); },
  // s05
  variant: function (el) { S.variant = el.getAttribute('data-v'); S.card = null; update(); },
  fav: function () { S.favs[S.variant] = !S.favs[S.variant]; update(); },
  share: function () { S.share = true; update(); },
  // s06
  prompt: function (el) { runPrompt(el.getAttribute('data-v')); },
  undo: function (el) { var k = el.getAttribute('data-v'); S.edits[k] = false; S.chat = S.chat.filter(function (m) { return m.k !== k; }); S.lastEdit = null; update(); },
  // s07
  qcode: function () { S.quote.code = '307158'; update(); },
  qverify: function () { S.quote.phoneOk = true; update(); var n = $('[data-k="q-sms"]'); if (n) n.focus(); },
  qtime: function (el) { var k = el.getAttribute('data-v'); S.quote.times[k] = !S.quote.times[k]; update(); },
  // s08
  lsel: function (el) { S.lead.sel = el.getAttribute('data-v'); update(); },
  ledit: function () { S.lead.editing = !S.lead.editing; update(); var t = $('[data-k="lead-msg"]'); if (t) t.focus(); },
  lapprove: function () { S.lead.editing = false; S.lead.approved = true; update(); later(function () { S.lead.replied = true; update(); later(function () { S.lead.booked = true; update(); }, 700); }, 1300); },
  // s09
  lpick: function (el) { S.layout = el.getAttribute('data-v'); update(); },
  openstudio: function () { S.studio.tier = S.layout; go('s10-studio', 'link'); },
  // s10
  stier: function (el) { S.studio.tier = el.getAttribute('data-v'); update(); },
  layer: function (el) { var k = el.getAttribute('data-v'); S.studio.layers[k] = S.studio.layers[k] === false; update(); },
  fix: function () { S.studio.fix = true; S.studio.justFixed = true; update(); },
  unfix: function () { S.studio.fix = false; S.studio.justFixed = false; update(); },
  render: function () { S.studio.render = !S.studio.render; update(); },
  // s11
  etier: function (el) { S.est.tier = el.getAttribute('data-v'); update(); },
  sod150: function () { S.est.sodRate = 150; S.est.sodDone = true; update(); },
  soddone: function () { S.est.sodDone = true; update(); },
  subdone: function () { S.est.subDone = true; update(); },
  eapprove: function () { S.est.approved = true; update(); var n = $('[data-k="to-prop"]'); if (n) n.focus(); },
  // s12
  pscope: function () { S.prop.scopeOk = true; update(); },
  pnotes: function () { S.prop.notesOk = true; update(); },
  psend: function () { S.prop.confirm = true; update(); var n = $('[data-k="p-sendok"]'); if (n) n.focus(); },
  psendno: function () { S.prop.confirm = false; update(); },
  psendok: function () { S.prop.confirm = false; S.prop.sent = true; update(); var n = $('[data-k="p-next"]'); if (n) n.focus(); },
  // s13
  pmethod: function (el) { S.portal.method = el.getAttribute('data-v'); update(); },
  pay: function () { S.portal.paying = true; update(); later(function () { S.portal.paying = false; S.portal.paid = true; update(); }, 900); },
  // s14
  dsub: function (el) { S.down.sub = el.getAttribute('data-v'); update(); },
  poapprove: function () { S.down.poOk = true; update(); },
  schedok: function () { S.down.schedOk = true; update(); },
  installed: function () { S.down.installed = true; update(); }
};
function runPrompt(k) {
  if (!k || S.edits[k] || S.typing) return;
  S.typing = k; update();
  later(function () { applyEdit(k); update(); var nxt = $('.chip.ai:not([disabled])'); if (nxt) nxt.focus({ preventScroll: true }); else { var g = $('[data-k="s06-next"]'); if (g) g.focus({ preventScroll: true }); } }, 900);
}
var FORMS = {
  addr: function () { if (S.propFound) return; S.propLoading = true; update(); later(function () { S.propLoading = false; S.propFound = true; update(); var n = $('[data-k="s01-next"]'); if (n) n.focus({ preventScroll: true }); }, 650); },
  otp: function () { S.run.code = ''; update(); later(function () { S.run.code = '482913'; update(); var n = $('[data-k="otp-verify"]'); if (n) n.focus(); }, 500); },
  chat: function (f) {
    var inp = f.querySelector('input'), t = (inp.value || '').toLowerCase(); inp.value = '';
    var k = /deep|bigger|wider|2 ?ft/.test(t) ? 'deeper' : /deer/.test(t) ? 'deer' : /tree|privacy|screen/.test(t) ? 'tree' : null;
    if (k && !S.edits[k]) runPrompt(k);
    else { S.chat.push({ k: 'x' + Date.now(), user: t || '…', ai: 'In this prototype I can make the three suggested changes. In the product I handle resizing, swaps by attribute, budget fits, maintenance tuning, features, views and explanations, and I only use plants from Greenleaf\'s Central Ohio list.', diff: ['No plan change'], val: 'Nothing to validate', plants: wDesign().plants.length }); update(); }
  },
  quote: function () { if (!S.quote.phoneOk) return; S.quote.submitted = true; update(); var n = $('[data-k="s07-next"]'); if (n) n.focus(); },
  sign: function () { var P = S.portal; if (P.name.trim().length > 2 && P.agree) { P.signed = true; update(); var n = $('[data-k="pay"]'); if (n) n.focus(); } }
};

document.addEventListener('click', function (e) {
  var t = e.target.closest('[data-act]');
  if (!t) return;
  if (t.getAttribute('data-self') && e.target !== t) return;
  if (t.disabled) return;
  var fn = ACT[t.getAttribute('data-act')];
  if (fn) { e.preventDefault(); fn(t, e); }
});
document.addEventListener('submit', function (e) {
  var f = e.target.closest('form[data-form]'); if (!f) return;
  e.preventDefault();
  var fn = FORMS[f.getAttribute('data-form')]; if (fn) fn(f);
});
function onBind(e) {
  var el = e.target, path = el.getAttribute && el.getAttribute('data-bind'); if (!path) return;
  var v;
  if (el.type === 'checkbox') v = el.checked;
  else if (el.type === 'number') { v = parseFloat(el.value); if (isNaN(v)) return; }
  else if (el.type === 'range') v = parseInt(el.value, 10);
  else v = el.value;
  if (path.indexOf('dims.') === 0 && el.type === 'number') {
    var lim = { width: [20, 200], depth: [12, 120], bedDepth: [2, 12], patioW: [4, 30], patioD: [4, 30] }[path.slice(5)];
    if (lim) v = Math.max(lim[0], Math.min(lim[1], v));
    setPath(path, v);
    var sum = $('#dims-sum'); if (sum) sum.innerHTML = dimsSummary();
    renderBTS();
    return;
  }
  setPath(path, v);
  if (path === 'portal.name') { var b = $('[data-k="p-sign"]'); if (b) b.disabled = !(S.portal.name.trim().length > 2 && S.portal.agree); return; }
  if (path === 'lead.msg' || path === 'prop.scope') { return; }
  if (path === 'est.sodRate' && e.type === 'input') { return; }
  update();
}
document.addEventListener('input', function (e) {
  var el = e.target;
  if (el.classList && el.classList.contains('ba-range')) {
    S.baPos = +el.value;
    $$('[data-ba]').forEach(function (b) { b.style.setProperty('--pos', S.baPos + '%'); var r = b.querySelector('.ba-range'); if (r && r !== el) r.value = S.baPos; $$('.plabel', b).forEach(function (l) { l.classList.toggle('hide', parseFloat(l.getAttribute('data-u')) < S.baPos); }); });
    return;
  }
  if (el.getAttribute && el.getAttribute('data-bind') === 'studio.year') { S.studio.year = +el.value; update(); return; }
  if (el.getAttribute && el.getAttribute('data-bind') && (el.type === 'number' || el.type === 'text' || el.tagName === 'TEXTAREA')) onBind(e);
});
document.addEventListener('change', function (e) {
  var el = e.target;
  if (el.getAttribute && el.getAttribute('data-file')) { S.shots[S.shot] = true; update(); return; }
  if (el.classList && el.classList.contains('ba-range')) return;
  if (el.getAttribute && el.getAttribute('data-bind') === 'studio.year') return;
  if (el.getAttribute && el.getAttribute('data-bind')) {
    if (el.type === 'number' && el.getAttribute('data-bind').indexOf('dims.') === 0) { onBind(e); update(); return; }
    if (el.getAttribute('data-bind') === 'est.sodRate') { onBind(e); S.est.sodDone = true; update(); return; }
    if (el.tagName === 'TEXTAREA' || el.type === 'text') { onBind(e); return; }
    onBind(e);
  }
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && S.card) { ACT.closecard(); return; }
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
  var t = e.target, tn = t && t.tagName;
  if (tn === 'INPUT' || tn === 'TEXTAREA' || tn === 'SELECT' || (t && t.isContentEditable)) return;
  if (t && t.closest && t.closest('[role="radiogroup"],.seg,[role="slider"]')) return;
  if (S.card) return;
  e.preventDefault();
  lastBtn = e.key === 'ArrowRight' ? 'next' : 'prev';
  nav(e.key === 'ArrowRight' ? 1 : -1);
});
window.addEventListener('hashchange', route);
route();
