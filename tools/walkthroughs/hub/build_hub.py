#!/usr/bin/env python3
"""Builds docs/site/walkthroughs.html, the hub for the clickable walkthroughs.

Inputs (same folder): meta.json (titles, personas, modules, stage map) and
steps.json (each page's acts and steps, written by scrape.js).
Usage from the repo root:
    NODE_PATH=$(npm root -g) node tools/walkthroughs/hub/scrape.js
    python3 tools/walkthroughs/hub/build_hub.py
"""
import html
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "..", "..", "docs", "site", "walkthroughs.html")

meta = json.load(open(os.path.join(HERE, "meta.json")))
steps = json.load(open(os.path.join(HERE, "steps.json")))
E = html.escape

ARROW = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
SPARK = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/></svg>'

persona_name = dict(meta["personas"])
module_name = dict(meta["modules"])
walks = [w for w in meta["walkthroughs"] if steps.get(w["page"])]


def split_act(head):
    m = re.match(r"^(ACT\s*\d+)\s*(.*)$", head, re.I)
    return (m.group(1).upper(), m.group(2)) if m else ("", head)


def count(w):
    acts = steps[w["page"]]["acts"]
    total = sum(len(a["steps"]) for a in acts)
    ai = sum(1 for a in acts for s in a["steps"] if s.get("ai"))
    return total, ai


total_steps = sum(count(w)[0] for w in walks)
total_ai = sum(count(w)[1] for w in walks)
personas_covered = sorted({p for w in walks for p in w["personas"]})
modules_covered = sorted({m for w in walks for m in w["modules"]})

# ---------- cards
cards = []
for i, w in enumerate(walks, 1):
    n, ai = count(w)
    acts_html = []
    for a in steps[w["page"]]["acts"]:
        label, title = split_act(a["head"])
        items = "".join(
            f'<li><a href="{E(w["page"])}#{E(s["id"])}">{E(s["short"])}</a>'
            + (' <span class="ai-dot" title="AI step" aria-label="AI step"></span>' if s.get("ai") else "")
            + "</li>"
            for s in a["steps"]
        )
        acts_html.append(f'<div class="act"><div class="act-h"><b>{E(label)}</b> {E(title)}</div><ol>{items}</ol></div>')
    chips = "".join(f'<span class="pchip">{E(persona_name.get(p, p))}</span>' for p in w["personas"])
    mods = " · ".join(w["modules"])
    cards.append(f'''
<article class="wcard" id="w-{E(w["key"])}" data-personas="{E(" ".join(w["personas"]))}">
  <div class="wc-top"><span class="wc-n">{i:02d}</span><span class="wc-meta tabular">{n} steps · {ai} with AI</span></div>
  <h3><a href="{E(w["page"])}">{E(w["title"])}</a></h3>
  <p class="wc-lede">{E(w["lede"])}</p>
  <div class="pchips" aria-label="Personas">{chips}</div>
  <details><summary>All {n} steps</summary><div class="acts">{"".join(acts_html)}</div></details>
  <div class="wc-foot"><span class="mono tiny muted">Spec: {E(mods)}</span><a class="btn primary sm" href="{E(w["page"])}">Start {ARROW}</a></div>
</article>''')

# ---------- filter chips
filters = ['<button type="button" class="fchip" aria-pressed="true" data-p="all">Everyone</button>'] + [
    f'<button type="button" class="fchip" aria-pressed="false" data-p="{E(k)}">{E(v)}</button>'
    for k, v in meta["personas"]
    if k in personas_covered
]

# ---------- coverage matrices
def matrix(rows, key, caption):
    head = "".join(f'<th scope="col" class="c"><a href="{E(w["page"])}">{i:02d}</a></th>' for i, w in enumerate(walks, 1))
    body = []
    for rk, rn in rows:
        cells = []
        hits = 0
        for w in walks:
            on = rk in w[key]
            hits += on
            cells.append('<td class="c"><span class="dot on" aria-label="covered"></span></td>' if on else '<td class="c"><span class="dot" aria-label="not covered"></span></td>')
        label = f'<span class="mono tiny muted">{E(rk)}</span> {E(rn)}' if key == "modules" else E(rn)
        body.append(f'<tr{" class=\"gap\"" if hits == 0 else ""}><th scope="row">{label}</th>{"".join(cells)}</tr>')
    return f'<div class="table-scroll"><table class="data cov"><caption>{E(caption)}</caption><thead><tr><th scope="col"></th>{head}</tr></thead><tbody>{"".join(body)}</tbody></table></div>'


legend = "".join(f'<li><span class="mono">{i:02d}</span> {E(w["title"])}</li>' for i, w in enumerate(walks, 1))
not_shown = "".join(f"<li>{E(x)}</li>" for x in meta["not_shown"])

page = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Rootline walkthroughs</title>
<meta name="description" content="Clickable walkthroughs of the Rootline product for landscape businesses, one per part of the business.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/rootline.css">
<style>
/* Hub layout: a short hero, the walkthrough cards, then coverage. Uses rootline.css tokens only. */
.hub-hero {{ padding: 44px 0 28px; border-bottom: 1px solid var(--border); }}
.hub-hero h1 {{ margin: 8px 0 12px; }}
.hub-stats {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-top: 22px; }}
.hub-stats div {{ background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-m); padding: 12px 14px; }}
.hub-stats dt {{ font-family: var(--font-mono); font-size: 1.45rem; font-weight: 600; font-variant-numeric: tabular-nums; }}
.hub-stats dd {{ margin: 2px 0 0; color: var(--text-2); font-size: .84rem; }}
.how {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; margin-top: 18px; }}
.how .card p {{ font-size: .88rem; color: var(--text-2); }}
.filters {{ display: flex; flex-wrap: wrap; gap: 6px; margin: 18px 0 16px; }}
.fchip {{ font: inherit; font-size: .8rem; font-weight: 600; padding: 5px 11px; border-radius: 999px; border: 1px solid var(--border-strong); background: var(--surface); color: var(--text-2); cursor: pointer; }}
.fchip[aria-pressed="true"] {{ background: var(--primary); border-color: var(--primary); color: var(--on-primary); }}
.wgrid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(min(340px, 100%), 1fr)); gap: 16px; }}
.wcard {{ background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-l); padding: 18px; display: flex; flex-direction: column; gap: 10px; box-shadow: var(--shadow-1); }}
.wcard[hidden] {{ display: none; }}
.wc-top {{ display: flex; justify-content: space-between; align-items: baseline; }}
.wc-n {{ font-family: var(--font-mono); font-weight: 600; color: var(--accent); }}
.wc-meta {{ font-size: .78rem; color: var(--text-3); }}
.wcard h3 {{ font-family: var(--font-display); font-size: 1.3rem; font-weight: 600; }}
.wcard h3 a {{ color: var(--text); text-decoration: none; }}
.wcard h3 a:hover {{ text-decoration: underline; }}
.wc-lede {{ font-size: .9rem; color: var(--text-2); }}
.pchips {{ display: flex; flex-wrap: wrap; gap: 5px; }}
.pchip {{ font-size: .72rem; font-weight: 600; padding: 2px 8px; border-radius: 999px; background: var(--surface-3); color: var(--text-2); }}
.wcard details {{ border-top: 1px solid var(--border); padding-top: 8px; }}
.wcard summary {{ cursor: pointer; font-size: .84rem; font-weight: 600; color: var(--link); }}
.acts {{ display: grid; gap: 8px; margin-top: 8px; }}
.act-h {{ font-size: .72rem; text-transform: uppercase; letter-spacing: .05em; color: var(--text-3); font-weight: 650; }}
.act-h b {{ color: var(--accent); font-family: var(--font-mono); }}
.acts ol {{ margin: 4px 0 0; padding-left: 20px; font-size: .84rem; display: grid; gap: 2px; }}
.ai-dot {{ display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: var(--ai-solid); vertical-align: 1px; }}
.wc-foot {{ margin-top: auto; display: flex; justify-content: space-between; align-items: center; gap: 8px; padding-top: 6px; }}
table.cov {{ min-width: 560px; }}
table.cov caption {{ text-align: left; font-weight: 650; padding: 0 0 8px; }}
table.cov th.c, table.cov td.c {{ text-align: center; width: 46px; }}
table.cov th.c a {{ font-family: var(--font-mono); text-decoration: none; }}
table.cov tbody th {{ font-weight: 500; font-size: .86rem; text-transform: none; letter-spacing: 0; color: var(--text); }}
table.cov tr.gap th {{ color: var(--text-3); }}
.dot {{ display: inline-block; width: 10px; height: 10px; border-radius: 50%; border: 1.5px solid var(--border-strong); }}
.dot.on {{ background: var(--primary); border-color: var(--primary); }}
.cov-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(min(420px, 100%), 1fr)); gap: 24px; align-items: start; }}
.cov-grid > div, .wgrid > * {{ min-width: 0; }}
.legend-list {{ list-style: none; padding: 0; margin: 10px 0 0; display: grid; gap: 3px; font-size: .84rem; color: var(--text-2); }}
.gaps {{ margin: 8px 0 0; padding-left: 20px; color: var(--text-2); font-size: .9rem; display: grid; gap: 3px; }}
@media (max-width: 480px) {{ .wgrid {{ grid-template-columns: 1fr; }} .cov-grid {{ grid-template-columns: 1fr; }} }}
</style>
</head>
<body>
<a class="skip" href="#main" style="position:absolute;left:-9999px">Skip to content</a>
<header class="site-nav"><div class="inner"><a class="wordmark" href="index.html">Rootline</a><nav aria-label="Proposal"><a href="index.html">Vision</a><a href="walkthroughs.html" aria-current="page">Walkthroughs</a><a href="screens-office.html">Office app</a><a href="screens-design.html">Design and AI</a><a href="screens-field-client-admin.html">Crew, client and admin</a></nav></div></header>
<main id="main">
<section class="hub-hero"><div class="wrap">
  <p class="eyebrow">Clickable prototype · Greenleaf Grounds Co., Columbus, Ohio</p>
  <h1>Walk through the whole business</h1>
  <p class="lede">{len(walks)} guided walkthroughs show Rootline end to end, from a homeowner's first photo or a 2-minute mowing quote to a crew's day, a paid invoice, closed books and the platform owner's console. Every step pairs the product screen with what happens behind it: which agent or automation ran, who approved, the AI credits used and the scope tier.</p>
  <dl class="hub-stats">
    <div><dt>{len(walks)}</dt><dd>walkthroughs</dd></div>
    <div><dt>{total_steps}</dt><dd>clickable steps</dd></div>
    <div><dt>{total_ai}</dt><dd>steps where AI agents or models act</dd></div>
    <div><dt>{len(personas_covered)}</dt><dd>personas shown</dd></div>
    <div><dt>{len(modules_covered)} of {len(meta["modules"])}</dt><dd>spec modules shown</dd></div>
  </dl>
  <div class="how">
    <div class="card"><h3>Product screen</h3><p>The real interface for that person: a phone for crews and homeowners, a browser for the office, the portal and the operator. Buttons, toggles and forms work.</p></div>
    <div class="card"><h3>Behind the scenes</h3><p>The agent or automation trace, who approves and at what autonomy level, the AI credits for the step and the running total, and the spec section it comes from.</p></div>
    <div class="card"><h3>Scope tiers</h3><p><span class="tag mvp">MVP</span> first sellable release · <span class="tag v1">V1</span> next wave · <span class="tag v2">V2</span> later wave · <span class="tag v3">V3</span> moonshot. Tiers describe scope, not dates.</p></div>
  </div>
</div></section>

<section class="section" aria-labelledby="w-h"><div class="wrap">
  <h2 id="w-h">The walkthroughs</h2>
  <div class="filters" role="group" aria-label="Show walkthroughs for">{"".join(filters)}</div>
  <div class="wgrid" id="wgrid">{"".join(cards)}</div>
</div></section>

<section class="section" aria-labelledby="cov-h"><div class="wrap">
  <h2 id="cov-h">What the walkthroughs cover</h2>
  <p class="muted">Columns are the walkthroughs above. A filled dot means the persona or spec module appears in that walkthrough.</p>
  <div class="cov-grid">
    <div>{matrix(meta["personas"], "personas", "Personas")}</div>
    <div>{matrix(meta["modules"], "modules", "Spec modules")}</div>
  </div>
  <ol class="legend-list">{legend}</ol>
  <h3 style="margin-top:22px">Not shown yet</h3>
  <ul class="gaps">{not_shown}</ul>
</div></section>
</main>
<footer class="site-foot"><div class="wrap">Rootline (working name) · design proposal, November 2026 · sample company Greenleaf Grounds Co. Scope tiers come from doc 24; AI credit costs from doc 22 section 4.4.1.</div></footer>
<script>
(function () {{
  var chips = document.querySelectorAll('.fchip');
  var cards = document.querySelectorAll('.wcard');
  chips.forEach(function (c) {{
    c.addEventListener('click', function () {{
      var p = c.getAttribute('data-p');
      chips.forEach(function (x) {{ x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); }});
      cards.forEach(function (card) {{
        var ps = card.getAttribute('data-personas').split(' ');
        card.hidden = !(p === 'all' || ps.indexOf(p) !== -1);
      }});
    }});
  }});
}})();
</script>
</body>
</html>
'''
open(OUT, "w").write(page)
print("Wrote", os.path.normpath(OUT), "-", len(walks), "walkthroughs,", total_steps, "steps")
