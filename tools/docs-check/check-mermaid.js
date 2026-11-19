// Usage: node check.js <docsDir> [file ...] -> prints JSON of mermaid parse failures
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
(async () => {
  const dir = process.argv[2];
  let files = process.argv.slice(3);
  if (!files.length) {
    files = fs.readdirSync(dir).filter(f => f.endsWith('.md')).map(f => path.join(dir, f));
    const r = path.join(dir, 'research');
    if (fs.existsSync(r)) files.push(...fs.readdirSync(r).filter(f => f.endsWith('.md')).map(f => path.join(r, f)));
  }
  const blocks = [];
  for (const f of files) {
    const lines = fs.readFileSync(f, 'utf8').split('\n');
    let inB = false, start = 0, buf = [];
    lines.forEach((l, i) => {
      if (!inB && /^\s*```mermaid\s*$/.test(l)) { inB = true; start = i + 1; buf = []; }
      else if (inB && /^\s*```\s*$/.test(l)) { inB = false; blocks.push({ file: path.basename(f), line: start, code: buf.join('\n') }); }
      else if (inB) buf.push(l);
    });
  }
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent('<html><body></body></html>');
  await page.addScriptTag({ path: path.join(__dirname, 'node_modules/mermaid/dist/mermaid.min.js') });
  const results = await page.evaluate(async (blocks) => {
    mermaid.initialize({ startOnLoad: false });
    const out = [];
    for (const b of blocks) {
      try { await mermaid.parse(b.code); }
      catch (e) { out.push({ file: b.file, line: b.line, error: String(e.message || e).slice(0, 400) }); }
    }
    return out;
  }, blocks);
  await browser.close();
  console.log(JSON.stringify({ total: blocks.length, failures: results }, null, 1));
})();
