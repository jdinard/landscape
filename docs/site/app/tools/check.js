/* Platform Explorer checker.
   Usage: node docs/site/app/tools/check.js [routePrefix ...] [--shots=DIR] [--tenants=a,b] [--quiet]
   For every route matching a prefix (default: all), opens it as every View-as option that uses that
   surface, on several tenants and plans, and reports page errors, console errors, empty screens and
   routes with no registered screen, plus links (data-go, data-set, data-modal) that point at a route,
   role, tenant, plan or modal that does not exist. Needs Playwright (preinstalled in the cloud container). */
const { chromium } = require('playwright');
const path = require('path');
const args = process.argv.slice(2);
const prefixes = args.filter(a => !a.startsWith('--'));
const opt = k => { const a = args.find(x => x.startsWith('--' + k + '=')); return a ? a.split('=')[1] : null; };
const shots = opt('shots');
const tenants = (opt('tenants') || 'greenleaf,summit,brookside,fernwood').split(',');
const file = 'file://' + path.resolve(__dirname, '..', '..', 'app.html');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  const errs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await p.goto(file + '#r=atlas.home');
  await p.waitForTimeout(300);
  const meta = await p.evaluate(() => ({ routes: RL.P.surfaces.routes.map(r => ({ id: r.id, surface: r.surface })), atlas: Object.keys(RL.atlasPages), as: RL.AS.map(o => ({ key: o.key, role: o.role })), surf: RL.SURF }));
  const list = meta.routes.filter(r => !prefixes.length || prefixes.some(px => r.id.startsWith(px)));
  if (!prefixes.length || prefixes.some(px => 'atlas.'.startsWith(px) || px.startsWith('atlas'))) meta.atlas.forEach(a => list.push({ id: a, surface: 'atlas' }));
  const problems = errs.length ? ['page load: ' + errs.join(' | ')] : [], missing = [];
  let opened = 0;
  for (const r of list) {
    const ases = r.surface === 'atlas' ? [{ key: 'owner' }, { key: 'platform_owner' }] : meta.as.filter(o => meta.surf[o.role].includes(r.surface));
    if (r.surface !== 'atlas' && !(await p.evaluate(id => !!RL.screens[id], r.id))) missing.push(r.id);
    for (const t of tenants) for (const o of ases) for (const plan of ['', 'starter']) {
      if (plan && t !== 'greenleaf') continue;
      const before = errs.length;
      await p.evaluate(({ id, as, t, plan }) => { RL.ui = {}; RL.set({ as, t, r: id, plan }); }, { id: r.id, as: o.key, t, plan });
      opened++;
      const n = await p.evaluate(() => document.getElementById('xmain').innerText.trim().length);
      const err = await p.evaluate(() => !!document.querySelector('#xmain .deny .dh') && document.querySelector('#xmain .deny .dh').textContent === 'Screen error');
      const bad = await p.evaluate(() => {
        const out = [], R = RL.idx.ROUTES, A = RL.atlasPages, AS = new Set(RL.AS.map(o => o.key)), T = RL.idx.TENANTS, PL = RL.idx.PLANS;
        const okRoute = id => !!(R[id] || A[id]);
        document.querySelectorAll('#xmain [data-go]').forEach(el => { if (!okRoute(el.dataset.go)) out.push('data-go=' + el.dataset.go); });
        document.querySelectorAll('#xmain [data-modal]').forEach(el => { if (!RL.modals[el.dataset.modal]) out.push('data-modal=' + el.dataset.modal); });
        document.querySelectorAll('#xmain [data-set]').forEach(el => {
          const q = new URLSearchParams(el.dataset.set);
          if (q.get('r') && !okRoute(q.get('r'))) out.push('data-set r=' + q.get('r'));
          if (q.get('as') && !AS.has(q.get('as'))) out.push('data-set as=' + q.get('as'));
          if (q.get('t') && !T[q.get('t')]) out.push('data-set t=' + q.get('t'));
          if (q.get('plan') && !PL[q.get('plan')]) out.push('data-set plan=' + q.get('plan'));
        });
        return [...new Set(out)];
      });
      if (bad.length) problems.push(`${r.id} as=${o.key} t=${t}: broken link ${bad.join(', ')}`);
      if (errs.length > before || n < 40 || err) problems.push(`${r.id} as=${o.key} t=${t}${plan ? ' plan=' + plan : ''}: ${err ? 'SCREEN ERROR ' : ''}${n < 40 ? 'empty ' : ''}${errs.slice(before).join(' | ')}`);
    }
    if (shots && r.surface !== 'atlas') {
      const shotT = id => id.startsWith('portal.portfolio') || id.startsWith('portal.approvals') ? 'summit' : 'greenleaf';
      const o = (await p.evaluate(({ id, list, t }) => list.find(x => ['ok', 'limit'].includes(RL.access(RL.idx.ROUTES[id], Object.assign({}, RL.S, { as: x.key, t, plan: '' })).state)), { id: r.id, list: ases, t: shotT(r.id) })) || ases[0];
      await p.evaluate(({ id, as }) => { RL.ui = {}; RL.set({ as, t: id.startsWith('portal.portfolio') || id.startsWith('portal.approvals') ? 'summit' : 'greenleaf', r: id, plan: '' }); }, { id: r.id, as: o.key });
      await p.screenshot({ path: path.join(shots, r.id + '.png'), fullPage: true });
    }
  }
  // Interaction sweep: click every data-ui / data-act control once on each route as its first role
  for (const r of list.filter(x => x.surface !== 'atlas')) {
    const o = meta.as.find(a => meta.surf[a.role].includes(r.surface));
    await p.evaluate(({ id, as }) => { RL.ui = {}; RL.set({ as, t: 'greenleaf', r: id, plan: '' }); }, { id: r.id, as: o.key });
    const n = await p.evaluate(() => document.querySelectorAll('#xmain [data-ui], #xmain [data-act], #xmain [data-modal]').length);
    for (let i = 0; i < Math.min(n, 25); i++) {
      const before = errs.length;
      await p.evaluate((i) => { const el = document.querySelectorAll('#xmain [data-ui], #xmain [data-act], #xmain [data-modal]')[i]; if (el) el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); }, i);
      await p.evaluate(() => RL.closeModal());
      if (errs.length > before) problems.push(`${r.id} click #${i}: ${errs.slice(before).join(' | ')}`);
      await p.evaluate(({ id, as }) => { if (RL.S.r !== id) RL.set({ as, t: 'greenleaf', r: id, plan: '' }); }, { id: r.id, as: o.key });
    }
  }
  await b.close();
  if (missing.length) console.log('NO SCREEN REGISTERED (' + missing.length + '): ' + missing.join(', '));
  console.log(problems.length ? problems.join('\n') : 'no problems');
  console.log(`opened ${opened} views across ${list.length} routes`);
  process.exit(problems.length || missing.length ? 1 : 0);
})();
