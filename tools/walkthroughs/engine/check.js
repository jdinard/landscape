// Checks one built walkthrough page in headless Chromium.
// Usage (repo root): NODE_PATH=$(npm root -g) node tools/walkthroughs/engine/check.js wt-recurring.html [hash-to-screenshot ...]
// Visits every step in the rail at 1366 px and 400 px, clicks each on-screen control once,
// and reports page errors and horizontal overflow. Screenshots go to $SHOTS or the current folder.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const page = process.argv[2], shots = process.argv.slice(3);
  const url = 'file://' + path.resolve(__dirname, '../../../docs/site', page);
  const outDir = process.env.SHOTS || '.';
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1366, height: 900 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !/fonts/.test(m.text())) errs.push('console: ' + m.text()); });
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await p.goto(url + '#overview'); await p.waitForTimeout(300);
  const ids = await p.evaluate(() => Array.from(document.querySelectorAll('#rail a[href^="#"]')).map(a => a.getAttribute('href').slice(1)));
  const over = [];
  for (const w of [1366, 400]) {
    await p.setViewportSize({ width: w, height: 900 });
    for (const id of ids) {
      await p.goto(url + '#' + id); await p.waitForTimeout(120);
      const sw = await p.evaluate(() => document.documentElement.scrollWidth);
      if (sw > w + 1) over.push(w + ':' + id + ':' + sw);
      if (w === 1366) {
        const n = await p.evaluate(() => document.querySelectorAll('#screen [data-act]').length);
        for (let i = 0; i < n; i++) {
          const el = (await p.$$('#screen [data-act]'))[i];
          if (el) { try { await el.click({ timeout: 500 }); } catch (e) { /* hidden or disabled */ } }
        }
      }
    }
  }
  await p.setViewportSize({ width: 1366, height: 900 });
  for (const h of shots) {
    await p.goto(url + '#' + h); await p.waitForTimeout(250);
    await p.screenshot({ path: path.join(outDir, page.replace('.html', '') + '-' + h + '.png') });
  }
  console.log(JSON.stringify({ steps: ids.length, errors: [...new Set(errs)].slice(0, 10), overflow: over }));
  await b.close();
})();
