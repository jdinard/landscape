// Usage: node linkcheck.js <docsDir> [file.md ...]  -> lists broken relative links/anchors (GitHub slug rules)
const fs = require('fs'), path = require('path');
const dir = path.resolve(process.argv[2]);
let files = process.argv.slice(3).map(f => path.resolve(dir, f));
const all = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (p.endsWith('.md')) all.push(p); } })(dir);
if (!files.length) files = all;
function slugs(file) {
  const out = new Set(), seen = {};
  let inCode = false;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) { inCode = !inCode; continue; }
    if (inCode) continue;
    const m = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line); if (!m) continue;
    let s = m[2].replace(/<[^>]+>/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/`/g, '').toLowerCase().trim()
      .replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');
    if (seen[s] !== undefined) { seen[s]++; out.add(s + '-' + seen[s]); } else { seen[s] = 0; out.add(s); }
  }
  for (const a of fs.readFileSync(file, 'utf8').matchAll(/<a\s+(?:name|id)="([^"]+)"/g)) out.add(a[1]);
  return out;
}
const cache = {};
const broken = [];
for (const f of files) {
  let inCode = false;
  fs.readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    if (/^\s*(```|~~~)/.test(line)) { inCode = !inCode; return; }
    if (inCode) return;
    for (const m of line.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      const href = m[1];
      if (/^(https?:|mailto:|tel:)/.test(href)) continue;
      const [p, anchor] = href.split('#');
      const target = p ? path.resolve(path.dirname(f), decodeURI(p)) : f;
      if (!fs.existsSync(target)) { broken.push(`${path.relative(dir, f)}:${i + 1} missing file -> ${href}`); continue; }
      if (anchor && target.endsWith('.md')) {
        cache[target] = cache[target] || slugs(target);
        if (!cache[target].has(decodeURIComponent(anchor).toLowerCase())) broken.push(`${path.relative(dir, f)}:${i + 1} missing anchor -> ${href}`);
      }
    }
  });
}
console.log(broken.length ? broken.join('\n') : 'No broken relative links.');
console.log(`\n${broken.length} broken link(s) in ${files.length} file(s).`);
