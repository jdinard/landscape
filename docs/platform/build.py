#!/usr/bin/env python3
"""Validate the platform blueprint data and bundle it for the Platform Explorer.

Usage (from the repository root or anywhere):
    python3 docs/platform/build.py

Reads every *.json file in docs/platform/, checks the cross-references between
them, and writes docs/site/assets/platform-data.js, which defines
window.ROOTLINE_PLATFORM. The explorer (docs/site/app.html) loads that file with
a plain <script> tag so it works from file:// without a server.
Exits non-zero if any check fails.
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'site', 'assets', 'platform-data.js')
FILES = ['roles', 'personas', 'plans', 'segments', 'tenants', 'surfaces']


def load():
    return {f: json.load(open(os.path.join(HERE, f + '.json'), encoding='utf-8')) for f in FILES}


def check(d):
    errs = []
    roles = {r['key'] for r in d['roles']['roles']}
    feats = {f['key'] for f in d['plans']['features']}
    plans = {p['code'] for p in d['plans']['plans']}
    addons = {a['code'] for a in d['plans']['addons']}
    tenants = {t['id']: t for t in d['tenants']['tenants']}
    segs = {s['id'] for s in d['segments']['segments']}
    caps = set()
    for g in d['roles']['tenant_permission_matrix']['groups']:
        for row in g['rows']:
            for c in row['cap'].split(' / '):
                caps.add(c.strip())
    nav = d['roles']['nav_visibility']
    surf = {s['id'] for s in d['surfaces']['surfaces']}
    routes = {r['id']: r for r in d['surfaces']['routes']}
    modules = {m['key'] for m in d['tenants']['module_catalog']} | {'books'}  # books: hidden when QuickBooks or Xero is the system of record
    for t in tenants.values():
        for m in t['modules']:
            if m not in modules: errs.append(f"tenant {t['id']}: unknown module {m}")
    for sg in d['segments']['segments']:
        for m in sg['modules_on']:
            if m not in modules: errs.append(f"segment {sg['id']}: unknown module {m}")
    for tpl in d['roles'].get('custom_role_templates', []):
        for c in tpl['grants']:
            if c not in caps: errs.append(f"custom role {tpl['key']}: unknown capability {c}")
        for n in tpl['nav']:
            if n not in nav['web']['items']: errs.append(f"custom role {tpl['key']}: nav {n} not in web nav table")

    for r in routes.values():
        w = 'route ' + r['id']
        if r['surface'] not in surf: errs.append(f"{w}: unknown surface {r['surface']}")
        if r.get('feature') and r['feature'] not in feats: errs.append(f"{w}: unknown feature {r['feature']}")
        if r.get('perm') and r['perm'] not in caps: errs.append(f"{w}: unknown capability {r['perm']}")
        if r.get('module') and r['module'] not in modules: errs.append(f"{w}: unknown module {r['module']}")
        if r.get('parent') and r['parent'] not in routes: errs.append(f"{w}: unknown parent {r['parent']}")
        for k in r.get('roles', []):
            if k not in roles: errs.append(f"{w}: unknown role {k}")
        if r['surface'] == 'web' and r['nav'] not in nav['web']['items']: errs.append(f"{w}: nav {r['nav']} not in web nav table")
        if r['surface'] == 'console' and r['nav'] not in nav['console']['items']: errs.append(f"{w}: nav {r['nav']} not in console nav table")
        if r['surface'] == 'portal' and r['nav'] not in nav['portal']['items'] and r['nav'] != 'Commercial workspace':
            errs.append(f"{w}: nav {r['nav']} not in portal nav table")
        if r['scope'] not in ('MVP', 'V1', 'V2', 'V3'): errs.append(f"{w}: bad scope {r['scope']}")
    for p in d['personas']['personas']:
        if p['role'] not in roles: errs.append(f"persona {p['id']}: unknown role {p['role']}")
        if p.get('tenant') and p['tenant'] not in tenants: errs.append(f"persona {p['id']}: unknown tenant {p['tenant']}")
        if p.get('landing') and p['landing'] not in routes: errs.append(f"persona {p['id']}: unknown landing {p['landing']}")
    for r in d['roles']['roles']:
        if r['landing'] not in routes: errs.append(f"role {r['key']}: unknown landing {r['landing']}")
    for t in tenants.values():
        if t['plan'] not in plans: errs.append(f"tenant {t['id']}: unknown plan {t['plan']}")
        if t['segment'] not in segs: errs.append(f"tenant {t['id']}: unknown segment {t['segment']}")
        for a in t['addons']:
            if a not in addons: errs.append(f"tenant {t['id']}: unknown add-on {a}")
        for k in t['cast']:
            if k not in roles: errs.append(f"tenant {t['id']}: cast role {k} unknown")
    for s in d['segments']['segments']:
        if s['sample_tenant'] not in tenants: errs.append(f"segment {s['id']}: unknown tenant {s['sample_tenant']}")
        for p in s['default_plans']:
            if p not in plans: errs.append(f"segment {s['id']}: unknown plan {p}")
    for f in d['plans']['features']:
        for pc, a in f['plans'].items():
            if pc not in plans: errs.append(f"feature {f['key']}: unknown plan {pc}")
            if a.get('addon') and a['addon'] not in addons: errs.append(f"feature {f['key']}: unknown add-on {a['addon']}")
    return errs


def main():
    d = load()
    errs = check(d)
    if errs:
        print('\n'.join(errs)); print(f'{len(errs)} problem(s)'); sys.exit(1)
    js = ('/* Generated by docs/platform/build.py from docs/platform/*.json. Do not edit by hand. */\n'
          'window.ROOTLINE_PLATFORM = ' + json.dumps(d, ensure_ascii=False, separators=(',', ':')) + ';\n')
    open(OUT, 'w', encoding='utf-8').write(js)
    n = d['surfaces']['routes']
    print(f"ok: {len(d['roles']['roles'])} roles, {len(d['personas']['personas'])} personas, {len(d['plans']['plans'])} plans, "
          f"{len(d['plans']['features'])} capabilities, {len(d['segments']['segments'])} segments, {len(d['tenants']['tenants'])} tenants, "
          f"{len(n)} routes -> {os.path.relpath(OUT)} ({len(js):,} bytes)")


if __name__ == '__main__':
    main()
