// Reads each walkthrough page's step rail (acts and steps) and writes steps.json.
// Usage (repo root): NODE_PATH=$(npm root -g) node tools/walkthroughs/hub/scrape.js
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const SITE = path.resolve(__dirname, '../../../docs/site');
const meta = JSON.parse(fs.readFileSync(path.join(__dirname, 'meta.json'), 'utf8'));
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1366, height: 900 } });
  const out = {};
  for (const w of meta.walkthroughs) {
    const f = path.join(SITE, w.page);
    if (!fs.existsSync(f)) { out[w.page] = null; continue; }
    const errs = []; p.removeAllListeners('pageerror'); p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + f + '#overview'); await p.waitForTimeout(700);
    out[w.page] = await p.evaluate(() => {
      const rail = document.querySelector('#rail, .pt-rail, nav[aria-label*="step" i]');
      if (!rail) return { acts: [], error: 'no rail' };
      const acts = [];
      rail.querySelectorAll('.act').forEach(a => {
        const h = a.querySelector('.act-h');
        const steps = Array.from(a.querySelectorAll('a[href^="#"]')).map(x => ({
          id: x.getAttribute('href').slice(1),
          short: (x.querySelector('.t') || x).textContent.trim(),
          title: x.getAttribute('title') || '' ,
          ai: !!x.querySelector('.ai-dot')
        })).filter(s => s.id && s.id !== 'overview');
        acts.push({ head: h ? h.textContent.replace(/\s+/g, ' ').trim() : '', steps });
      });
      return { acts };
    });
    out[w.page].errors = errs;
  }
  await b.close();
  fs.writeFileSync(path.join(__dirname, 'steps.json'), JSON.stringify(out, null, 1));
  for (const k in out) console.log(k, out[k] ? out[k].acts.reduce((n, a) => n + a.steps.length, 0) + ' steps' : 'missing', out[k] && out[k].errors && out[k].errors.length ? 'ERRORS' : '');
})();
