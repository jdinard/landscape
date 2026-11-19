#!/usr/bin/env python3
"""Builds one walkthrough page from tools/walkthroughs/<name>/ into docs/site/<name>.html.

Each walkthrough folder holds page.json ({"title", "description"}), wt.js (defines the
global WT object) and optionally wt.css. Styles and icons are shared with the reference
walkthrough in tools/prototype-src/, so every page looks the same.
Usage from the repo root: python3 tools/walkthroughs/engine/build.py wt-recurring [more names]
"""
import html
import json
import os
import re
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
ENG = os.path.join(ROOT, "tools", "walkthroughs", "engine")
REF = os.path.join(ROOT, "tools", "prototype-src")


def read(p):
    with open(p, encoding="utf-8") as f:
        return f.read()


base_css = re.search(r"<style>(.*?)</style>", read(os.path.join(REF, "head.html")), re.S).group(1)
sprite = re.search(r"(<svg width=\"0\" height=\"0\".*?</svg>)", read(os.path.join(REF, "body.html")), re.S).group(1)
extra_icons = read(os.path.join(ENG, "icons.svg"))
sprite = sprite.replace("</svg>", extra_icons + "\n</svg>", 1) if sprite.rstrip().endswith("</svg>") else sprite
extra_css = read(os.path.join(ENG, "extra.css"))
engine = read(os.path.join(ENG, "engine.js"))
NAV = ('<header class="site-nav"><div class="inner"><a class="wordmark" href="index.html">Rootline</a>'
       '<nav aria-label="Proposal"><a href="index.html">Vision</a><a href="walkthroughs.html" aria-current="page">Walkthroughs</a>'
       '<a href="screens-office.html">Office app</a><a href="screens-design.html">Design and AI</a>'
       '<a href="screens-field-client-admin.html">Crew, client and admin</a></nav></div></header>')

for name in sys.argv[1:]:
    d = os.path.join(ROOT, "tools", "walkthroughs", name)
    meta = json.loads(read(os.path.join(d, "page.json")))
    wt_css = read(os.path.join(d, "wt.css")) if os.path.exists(os.path.join(d, "wt.css")) else ""
    wt_js = read(os.path.join(d, "wt.js"))
    page = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(meta['title'])}</title>
<meta name="description" content="{html.escape(meta['description'])}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/rootline.css">
<style>{base_css}
/* ---------- shared walkthrough additions ---------- */
{extra_css}
/* ---------- this walkthrough ---------- */
{wt_css}
</style>
</head>
<body>
<a class="skip" href="#main">Skip to the walkthrough</a>
{sprite}
{NAV}
<div class="pt-shell">
  <nav class="pt-rail" id="rail" aria-label="Walkthrough steps"></nav>
  <main class="pt-main" id="main">
    <div class="pt-bar" id="bar"></div>
    <div class="pt-body">
      <section class="pt-screen" id="screen" aria-labelledby="step-h"></section>
      <aside class="pt-bts" id="bts" aria-label="Behind the scenes"></aside>
    </div>
  </main>
</div>
<noscript><p style="padding:20px">This walkthrough needs JavaScript to run.</p></noscript>
<script>
{wt_js}
{engine}
</script>
</body>
</html>
"""
    out = os.path.join(ROOT, "docs", "site", name + ".html")
    with open(out, "w", encoding="utf-8") as f:
        f.write(page)
    print("Wrote", os.path.relpath(out, ROOT), f"({len(page) // 1024} KB)")
