# 25 - Platform Blueprint Build Handoff

> The handoff for the build agent (Claude), which builds all of Rootline as one release, v1, from the specs in this repository, the blueprint in [platform/](platform/), the architecture in [20](20-architecture-security.md) and the decision record in [24](24-product-scope-decisions-catalog.md) section 1. Read 24 section 1 first: it wins over this document and every other. This document contains no dates, durations, effort estimates or staffing.

| Field | Value |
|---|---|
| Document | 25 - Platform Blueprint Build Handoff |
| Date | 2026-11-15 |
| Owner | `platform_owner` (the founder) |
| Status | Version 2: one release, every contradiction and decision closed in 24 section 1. No product code exists yet ([STATUS](STATUS.md) section 2.7) |
| Inputs | 24 section 1 (first); [platform/](platform/) JSON and `build.py`; the [Platform Explorer](site/app.html) and [its README](site/app/README.md); docs 02, 17, 20, 21, 22, 24 |
| Authority | No product decisions. Owns the proposed code layout (3.2), generated artifacts (2.4) and definition of done (6) until the code's own docs replace them |
| Main consumers | The build agent; the founder |

**At a glance**

- **One release.** Everything in the specs and every route in `surfaces.json` is v1. There are no tiers, no stages to sell from and no release gate that waits on people (24 section 1.1).
- **Read 24 section 1 first.** It settles every contradiction (1.5) and every open decision (1.6), and it wins over this document and every module doc.
- **Source of truth.** `docs/platform/*.json` holds roles, grants, field classes, navigation, plans, routes and sample tenants. Code is generated from it and generated files are never edited by hand.
- **Who wins.** 24 section 1, then the owning module doc: prices and entitlements 22, permissions 02, architecture 20 (1.3).
- **Order.** One sequence by dependency: foundations, the money and field spines, selling and design, the customer portal, then everything else (5). v1 is ready when E1-E6 and the launch-readiness checks in 24 section 3 pass.
- **Never traded.** Money correctness, offline field work, tenant isolation, and never blocking a Company from getting paid.
- **Decide and record.** Where the specs leave a choice, the build agent takes the simplest option consistent with them and records it in an ADR (24 section 1.3). Only prices, plan contents, credit rates, legal positions and public claims go to the founder (8.4).

## Table of contents

1. [Purpose and how to use this repository](#1-purpose-and-how-to-use-this-repository)
2. [The blueprint data files](#2-the-blueprint-data-files)
3. [Architecture summary and monorepo layout](#3-architecture-summary-and-monorepo-layout)
4. [Gating model end to end](#4-gating-model-end-to-end)
5. [Build order by dependency](#5-build-order-by-dependency)
6. [Definition of done and guardrails](#6-definition-of-done-and-guardrails)
7. [Route-to-spec table](#7-route-to-spec-table)
8. [Risks and decisions](#8-risks-and-decisions)

---

## 1. Purpose and how to use this repository

### 1.1 What exists

- 24 specification docs on one shared template, plus [README](README.md), [STATUS](STATUS.md) and research reports.
- `docs/platform/*.json`, the blueprint (section 2), checked by `build.py`.
- `docs/site/app.html`, the Platform Explorer: a static mock of every surface, gated by role, plan and market from the same JSON. Routes without a registered screen show "Screen not mocked yet" with their purpose and spec.
- No product code, conventions or CI. This document proposes them.

### 1.2 Reading order

Grep headings; read only the sections named.

| Step | Read |
|---|---|
| 1 | 24 §1, the decision record. It comes first and wins over everything below |
| 2 | This document, then `python3 docs/platform/build.py` and the explorer's atlas pages (roles and access, packages, who sees what, every screen) |
| 3 | 20 §1, §4.2-4.13, §4.18-4.19, §4.22-4.31, Appendix A (ADRs) |
| 4 | 02 §5.1-5.6, §5.13, §5.17, §8, §10 |
| 5 | 24 §3-§4; 22 §4, §8.3, §10.1 |
| 6 | 21 §5, §8, §12-13, §23.1; 17 §4.1-4.4, §4.11 |
| 7 | Before each module: its routes' `spec` sections (section 7), then its data model, events, permissions and decisions on former open questions. Money: 09 §4.1.1, §4.1.4, §4.17.1, §4.18; 08 §4.22. Field: 05 §4.21; 04 §4.1.3 |

### 1.3 Which doc wins

24 section 1 wins over every other document, this one included. After it, the owner doc wins (README §9):

| Topic | Owner |
|---|---|
| **Decisions, contradictions, scope, catalog, dependencies** (24 §1 is binding) | **24** |
| **Prices, plans, add-ons, meters, credits, seats, entitlements** (codes in 22 §4.2.2) | **22**, as amended by 24 §1 |
| **Roles, permission keys, scopes, field classes, support access** (02 §5.2 key catalog and aliases) | **02** |
| **Architecture, entities, events, tenancy, sync, security** | **20** |
| Billing; payments; posting rules and chart of accounts | 07; 08; 09 (24 R24-28) |
| Brand, UX, tokens, sitemaps | 21 |
| Lifecycle state names; lifecycle timings | 19; 19 and 22 (24 R24-23) |

The JSON is the source of truth for code; the owner doc is the source of truth for the JSON. If a JSON value differs from the section it cites (for example `02 §10.1`), fix the JSON. The JSON wins over the explorer's JavaScript (4.2).

### 1.4 Repository rules that carry into the build

- No dates, durations, effort or staffing anywhere, and no scope tiers: every feature and route is v1.
- Plain language, sentence case, no em dashes. Sample data is illustrative; no real company appears as a customer.
- Facts marked "verify" (vendor prices and APIs, model IDs, legal rules) are checked against primary sources before they are hard-coded.

---

## 2. The blueprint data files

### 2.1 What each file holds

| File | Holds | Source |
|---|---|---|
| `roles.json` | 27 roles (10 tenant incl. `observer`, 2 client, 6 contact scopes, 5 platform, 2 partner, 2 public) with surfaces, seat, MFA and landing route. `tenant_permission_matrix`: 94 capability rows by 9 templates. `field_class_defaults`: 12 classes by 9 templates. `platform_permission_matrix`: 24 rows by 5 roles. `client_contact_rights`: 6 scopes. `nav_visibility`: web 15, console 18, portal 10 items | 02 §5.7, §5.11, §10; 21 §5.4, §5.5, §5.9 |
| `personas.json` | 28 personas: role, tenant, landing, what they see and what is hidden, devices, language | 02 §3; others marked `blueprint` |
| `plans.json` | 6 plans; 63 capabilities with a state per plan (`Y`, `L` limited, `A` add-on, `-`); 20 add-ons; 9 meters; 25 AI credit rates; 7 seat types; trial and offer rules; `entitlement_ux`; `rules` | 22 §4, §5 |
| `segments.json` | S1-S7: plan fit, `modules_on`, `today_widgets`, `hidden_by_default`, sample tenant | 22 §6.1 |
| `tenants.json` | 8 sample tenants: plan, add-ons, modules, `books` mode, branches, cast by role, hero clients, brand | 02, 21 §15.3, 22 §4.6 |
| `surfaces.json` | 10 surfaces, domain rule, `gating_order`, 155 routes with nav, path, plan feature, permission, module, roles, purpose and spec | 21 §5 |

No file has a scope field: every plan, add-on, capability and route is v1. Plans and add-ons decide who pays for what, not what exists (24 §1.1).

### 2.2 How `build.py` validates

It exits non-zero, one line per problem, unless every reference resolves: each route's surface, plan feature, permission (rows like `client / property` are split), module (a key from the `module_catalog` in `tenants.json`, or `books`), parent and roles; nav items for web, console and portal routes; landing routes of personas and roles; tenants' plan, segment, add-ons and cast roles; segments' tenants and plans; capabilities' plan and add-on codes. It does not check scope, because the data has none. On success it rewrites `docs/site/assets/platform-data.js` deterministically.

It also checks tenant and segment module keys against that catalog and the observer template's capabilities and nav items. It does not check grant grammar or that capability keys are unique (`time_entry` is two capabilities, `time_entry.own` and `time_entry.others`, 24 R25-C6). The generator adds these checks.

### 2.3 Rules

1. One change carries the owner doc, the JSON, `build.py`, regenerated code and tests. CI regenerates and fails on any diff.
2. Generated files carry a "do not edit" header. Ids are stable API; renames ship as aliases (02 §5.2 rule 4, 22 §4.2.2).
3. An unmapped grant qualifier, module key or field class stops the build. The generator never guesses.
4. Proposal: keep `docs/` in the code monorepo so the generator reads the JSON directly.

### 2.4 Generated artifacts (proposed)

| Artifact | From | Used by |
|---|---|---|
| `packages/authz/generated/capabilities.ts` | Tenant matrix keyed by capability and note: R read, W create and update, D delete, X the row's domain action (02 §5.2); `a b c o` to `all branch crew own`; qualifiers `cfg`, `<=lim` (02 §5.6), footnotes, conditions | Policy engine, role editor, seat classifier |
| `.../role-templates.cedar` | The same rows as Cedar templates (ADR-017); free-text qualifiers ("via Visits", "billing fields") map to hand-written conditions in `packages/authz/conditions` | E3; sync buckets (E10) |
| `.../field-classes.ts` | Read, write and masking mode per class (omit, status chip, masked action, windowed, self, step-up) | Serializers (E5), sync, exports, AI tools (02 §5.4) |
| `.../platform.ts`, `contact-scopes.ts` | Platform matrix; contact rights | Console realm; portal |
| `packages/routes/generated/` | Routes and `nav_visibility` | Routers, navigation, a test that apps and manifest match |
| `packages/entitlements/generated/` | Rows for `plan`, `plan_entitlement`, `entitlement_def`, `addon`, `addon_entitlement` (22 §10.1); meters; credit rates; seat rules | Entitlement service, console catalog, credit quotes |
| `packages/seed/generated/` | Seed tenants and demo company, one user per cast role, persona fixtures, segment onboarding defaults | Environments, demos, tests |
| `packages/testing/generated/access-matrix.json` | A port of the explorer's `access()` over routes, view-as options, tenants and plans | Golden tests for server gating |

Parser facts: 846 grant cells, 106 distinct strings. 755 cells are plain `LETTERS/scope[ + LETTERS/scope]`; the other 91 carry qualifiers and are the review list for `conditions`.

---

## 3. Architecture summary and monorepo layout

### 3.1 Decided in 20 (reopen only through an ADR)

| Area | Decision | Where |
|---|---|---|
| Shape | TypeScript modular monolith `core`: one image run as `api`, `sync`, `realtime`, `webhook-ingest`, `worker`; satellites for AI Gateway, optimizer, GPU, media | 20 §4.2, ADR-001 |
| Modules | `iam`, `tenancy`, `crm`, `sales`, `catalog`, `ops`, `field`, `people`, `billing`, `payments`, `ledger`, `inventory`, `design`, `mockup`, `kb`, `media`, `comms`, `portal`, `growth`, `automation`, `ai`, `integrations`, `reporting`, `platform`, `audit`. Each owns its schema; boundaries are checked in CI | 20 §4.3 |
| Data | Aurora PostgreSQL per cell with PostGIS and pgvector; Redis; S3. UUIDv7 as TypeIDs; integer minor units; quantities as decimal strings plus unit | 20 §4.2, §4.7.2, ADR-002, -004, -005 |
| Tenancy | `tenant_id` everywhere, forced RLS, composite keys, transaction-local context, fail closed, `withTenant` only. Cells; Canada; dedicated cell | 20 §4.4, ADR-003 |
| Identity, authz | In-house auth with passkeys; field phone OTP and PIN; client magic links; staff realm with FIDO2. Cedar, RBAC plus ABAC, enforcement points E1-E10 | 20 §4.5-4.6, ADR-016, -017 |
| Events, workflows | Outbox to SNS/SQS (OD-63), idempotent consumers, CloudEvents, schemas in `packages/events`. Temporal Cloud, deterministic, `tenant_id` in every input | 20 §4.9-4.10, ADR-006, -007 |
| Offline | SQLite (SQLCipher); UI reads local data only; authorization-derived buckets; push lanes; per-entity conflict rules; Rootline owns the write path | 20 §4.11, ADR-008 |
| AI | One AI Gateway; pinned model ids per task; schema outputs; every call metered (hold, settle, release); budgets; no training on customer data | 20 §4.13, ADR-012 |
| Money | BYO Stripe direct charges; webhooks verified, persisted, then processed; Rootline's billing on its own Stripe account; no client funds held. Ledger invariants L1-L12 in the database | 20 §4.18-4.19, ADR-010, -011 |
| Lifecycle | Access class from a versioned billing policy; field data always accepted, client money never blocked, legal holds win | 20 §4.4.7, ADR-019 |
| Entitlements | Catalog in `platform`, resolution in `tenancy`, credits in `ai`; order: default, plan, add-ons, overrides, kill switch; flags share the evaluator | 22 §10; 19 PA-040, PA-041 |
| Platform | AWS (ECS Fargate, CloudFront, WAF); REST `/v1` with OpenAPI 3.1 and signed webhooks; OpenTelemetry without PII; trunk-based CI/CD with flags, expand-and-contract migrations and a canary cell | 20 §4.7, §4.21-4.30 |

### 3.2 Monorepo layout

**[20]** decided in 20 §4.30 (tokens in 21 §8.1, ADRs in 20 Appendix A). **[P]** proposed here.

```text
apps/web/          [20] Company web app (Next.js); [P] also Subcontractor lite at /{slug}/sub (21 §5.1)
apps/console/      [20] Platform Admin console (20 §4.30's apps/admin, renamed per 24 R25-C12)
apps/portal/       [20] Customer Portal PWA
apps/crew/         [20] Expo: crew, manager and sales modes; kiosk
apps/marketing/    [20] rootline.com; [P] Rootline Home funnel at /design
apps/partner/      [P] Accountant Hub
services/core/     [20] Monolith: modules/<name> per 20 §4.3, five entrypoints
services/ai-gateway/, optimizer/, gpu-workers/   [20]
services/media/    [P] Media processor
packages/contracts/, events/, ui/, connector-sdk/   [20]
packages/tokens/   [21] @rootline/tokens via Style Dictionary
packages/authz/    [P] Cedar, generated tables, conditions, scope resolvers, field projection
packages/entitlements/  [P] Generated catalog, resolver, seat classifier, credit quotes
packages/routes/   [P] Generated manifest and navigation
packages/ledger/   [P] Pure posting kernel and property tests; tables and triggers stay in core's ledger module
packages/sync/     [P] Protocol types, lanes, conflict merges shared by apps/crew and core:sync
packages/ai-client/  [P] Typed AI Gateway task client
packages/i18n/     [P] ICU catalogs EN, ES and fr-CA, glossary (21 §13.6), pseudo-locale
packages/seed/     [P] Synthetic data generator (20 §4.29), sample tenants
packages/testing/  [P] Isolation harness, persona fixtures, access goldens
tools/blueprint/   [P] Generator and drift check
infra/terraform/   [20]
docs/adr/          [20] ADRs
```

Local development follows 20 §4.22, seeded from `tenants.json` with Greenleaf Grounds Co. as the demo tenant (24 R25-C9).

---

## 4. Gating model end to end

### 4.1 Layers

`RL.access(route, state)` in `site/app/core.js` applies layers 1-6 in this order (`surfaces.json` `gating_order`). Production enforces them on the server for every request, inside two outer layers, and projects field classes (layer 7) on every response.

| # | Layer | Data | Explorer | Production |
|---|---|---|---|---|
| - | Tenant isolation | `tenant_id` | Not modeled | RLS (E4); cross-tenant and missing records both return "not found" (20 §4.4.3, 21 §5.8) |
| - | Lifecycle | `tenant_access` | Not modeled | Access class at E2, sync and portal; 403 `tenant_restricted` with a reason (20 §4.4.7) |
| 1 | Surface | `roles[].surfaces` | `surface` | Separate apps and origins; staff realm (20 §4.5) |
| 2 | Route roles | `route.roles` | `denied` | Router and API |
| 3 | Navigation | `nav_visibility` (F, R, -, C) | `denied` | Hidden items removed, not greyed. Not security: layer 4 still runs |
| 4 | Permission and scope | Tenant matrix: `own`, `crew` (visibility window), `branch`, `all`; approval limits | `denied` (web routes, grant presence) | Cedar at E3 per command and query; scope as query predicates (02 §5.3); limits create approval requests; anti-escalation (02 §5.8) |
| 5 | Module | Tenant modules from the 14 §4.0.1 catalog (`tenants.json` `module_catalog`); `core_maintenance` always on; `snow_ice` on means Snow Lite, the full module is the `snow_ice` add-on (layer 6); Books off when `books` is `qbo_system` | `off` | Hidden, not greyed (21 §5.2) |
| 6 | Plan entitlement | Feature state per plan plus add-ons | `ok`, `limit`, `locked`, `hidden` | Entitlement service; rules in 4.3 |
| 7 | Field classes | `field_class_defaults` | `c.sees()`, `h.mask()` | Server only: masked fields absent (not null) with `_redactions`; never synced; exports resolved per recipient; AI tools get projected data (02 §5.4, E5, E10) |

Results: `ok` renders; `limit` renders with the limit shown; `locked` shows the unlocking plan or add-on and price; `hidden` and `off` remove the entry; `denied` shows the 21 §5.8 permission state, never the record's title, client or amount; `surface` is not offered.

**Feature flags are not a gating layer.** There is no scope layer and no scope lens: every route is v1. Flags (19 PA-041) have two jobs only: dark launches, where code ships switched off and is turned on when its checks pass, with a kill switch; and per-Company deferral of crew-facing changes during the peak season, so a Company can keep its crews on the version they know until fall (24 §1.8). A flag never hides a finished feature from a Company whose plan includes it.

### 4.2 Explorer shortcuts not to copy

- Permissions are checked only on web routes and only for grant presence. Production checks action and record scope on every call and surface.
- `cfg` grants count as off; production reads the Company setting.
- `observer` grants and navigation come from `roles.json` `custom_role_templates`, a blueprint reading of 02 §5.7 that 24 R25-C5 confirms; production generates them like any other role. `core.js` also gives crew roles `web` and homeowners `www`, which `roles.json` does not.
- Field-class masking treats partial grants (`status chip`, `masked actions`, `self`, `R billing`, `R in window`) as masked in `h.mask`; production projects each partial grant field by field (02 §10.2).
- Buyers are `owner` only; `entitlement_ux` says anyone with `rootline_subscription` write, which today is the same set.

### 4.3 Entitlement UX rules (`plans.json`)

1. A module the Company has not enabled is hidden for everyone.
2. A capability not in the plan (`-`) or sold as an add-on (`A`) is a locked entry, with the unlock and its price, for roles that can buy; hidden for everyone else.
3. A limited capability (`L`) is fully usable; the limit shows where it bites, with an upgrade path for the owner and "ask the owner" for others.
4. Never block a Company from getting paid: invoicing, the portal, client payments and the ledger stay on through dunning, Winter Mode and overruns (22 §4.1 rule 5).
5. Every AI action shows its credit cost before it runs, on or beside its button; an explicit confirmation is required above 20 credits (24 R25-C7).
6. Seat type follows permissions, not role names (22 §4.3); field work is never blocked for seats; overage is billed.
7. Snow Lite is in every plan. An add-on a higher plan includes is removed on upgrade with prorated credit; a removed add-on leaves its data read-only.

Downgrades follow 19 PA-040 (`hide`, `read_only`, `grace_days`); anything needed to get paid or to work in the field uses `never_block` (22 §10.1).

---

## 5. Build order by dependency

One release, built in one sequence. The order follows the product dependencies in 24 §4.1 and the build order in 24 §4.2: foundations; the money and field spines; selling and design; the customer portal; then everything else. A track starts when its needs are met, and independent tracks run side by side. Every route in `surfaces.json` is placed exactly once below. Nothing is sold by step: the order says only what must exist before what. Plant KB content is data work by the plant curator agent that runs alongside the code (STATUS §2.6).

### 5.1 Step 1: foundations

Builds: monorepo, CI module rules, generator (2.4); `iam` (identities, memberships, passkeys for staff, platform users and clients, MFA, phone OTP, devices); `tenancy` (provisioning seeds, access class, entitlements and seat counting D18, flags for dark launches and peak-season deferral); `authz` (D1: Cedar, scopes including `branch`, field projection, isolation suite); `audit`; outbox, bus, Temporal, media, notifications; AI Gateway, credit ledger, Tool Registry (D13); tokens and themes (light, dark, field-sun, field-night), UI shell, i18n (EN, ES, fr-CA), observability, seed data; console shell.

Lights up: `web.today`, `web.settings.company`, `web.settings.users`, `web.settings.security`, `web.settings.subscription`, `console.home`, `console.tenants`, `console.tenant`, `console.flags`, `console.support`, `console.staff`, `console.health`, `console.settings`.

### 5.2 Step 2: the money and field spines

| Track | Builds | Needs | Lights up |
|---|---|---|---|
| 2A Records, messaging | Clients, Properties, Contacts, Lead Inbox; Price Book, rates, kits (D10); service-line framework; templates, consent ledger, 10DLC, inbox (D15); Weather Service (D11) | 1 | `web.clients`, `web.client`, `web.property`, `web.contacts`, `web.inbox`, `web.settings.notifications`, `web.settings.price_book`, `web.sales_templates`, `web.settings.service_lines`, `console.comms` |
| 2B Money spine | Ledger, posting rules, AR tie-out, Stripe clearing (D2); BYO Stripe, cards, ACH, webhooks, refunds (D4); Billing Engine, invoices, deposits, milestones, agreements, tax rates, credit memos, aging, dunning; books-of-record modes with the QuickBooks Online mirror and the Xero connector | 1 | `web.settings.payments`, `web.settings.accounting`, `web.invoices`, `web.invoice`, `web.payments`, `web.ar`, `web.stripe`, `web.agreements`, `web.books`, `web.coa`, `web.journal`, `web.tax`, `web.fin_reports`, `web.sync`, `console.payments` |
| 2C Field spine | Sync (D5); visit states, recurrence (D6); dispatch board, single-crew sequencing and multi-crew optimization, map; crew Today, run sheet, photos, time (D16), pesticide records, signatures, voice notes, Outdoor Mode, Spanish; shop kiosk punch; projects with phases, dependencies and the 811 gate; timesheets, payroll export; sub work orders | 2A | `web.board`, `web.calendar`, `web.map`, `web.programs`, `web.jobs`, `web.job`, `web.visit`, `web.people`, `web.crews`, `web.timesheets`, `web.payroll`, `web.projects`, `crew.today`, `crew.visit`, `crew.chem`, `crew.map`, `crew.time`, `crew.messages`, `crew.more`, `crew.kiosk`, `sub.orders`, `sub.order` |

### 5.3 Step 3: sell and design

| Track | Builds | Needs | Lights up |
|---|---|---|---|
| 3A Sell | Leads, pipelines, scoring and routing; Company Budget, margin engine, Quick Quote; site assessments; tiered proposals, e-sign, deposits, conversion to Jobs; office, field and verbal-emergency change orders; renewals with fixed, CPI, cost-plus and margin-target escalators and the review grid; sales mode in the crew app for estimators and designers (24 R25-C3) | 2A, 2B | `web.leads`, `web.pipeline`, `web.assessments`, `web.estimates`, `web.estimate`, `web.proposals`, `web.proposal`, `web.change_orders`, `web.renewals`, `crew.sales` |
| 3B Plants and design | Region model, Plant Region Profiles for the six Great Lakes Regions, curation, palettes (D7, D8); Studio to takeoff and Estimate (D9) with validation, plan sets, 3D, irrigation and lighting, co-editing, DXF and DWG; capture, restyle, region-locked palettes, render packs, AI layout, disclosure; the Dream Yard Visualizer widget on Company sites, on by default (24 R24-14) | 2A; 3A for push to Estimate | `web.designs`, `web.studio`, `web.design_library`, `web.design_templates`, `web.mockups`, `web.plants`, `web.palettes`, `console.kb.queue`, `console.ai`, `home.widget` |

### 5.4 Step 4: the customer portal

| Track | Builds | Needs | Lights up |
|---|---|---|---|
| 4A Portal | Action links, magic link, client passkeys, proposal viewer, sign and pay, invoices, autopay, visit summaries; skip, reschedule, pause and add-on self-scheduling; requests, messaging, property record and plant care, account and preferences; brand kit and custom domains | 2B, 2C, 3A | `portal.home`, `portal.proposals`, `portal.proposal`, `portal.billing`, `portal.history`, `portal.schedule`, `portal.requests`, `portal.property`, `portal.messages`, `portal.account`, `web.settings.portal` |
| 4B Commercial workspace | Portfolio, enhancement approvals with budgets and POs, quorum and sequential approvals, HOA board workflows, documents, proof-of-service reports; branches and approval policies (02 §5.9, §5.11) | 4A | `portal.portfolio`, `portal.approvals`, `portal.documents`, `portal.reports` |

### 5.5 Step 5: everything else

| Track | Builds | Needs | Lights up |
|---|---|---|---|
| 5A Switch, go-to-market | Migration Center with every switch kit (24 R24-15), QuickBooks migration with opening balances (D3), 7-day rollback; onboarding wizard and the Greenleaf sandbox; SaaS billing with credits and tax, trials; DSAR, fraud screening, help center; marketing site with switch guides, comparison pages (published only after the marketing agent's source check, 24 R26-3) and Plant Finder pages (24 R26-2) | 2A-2C | `web.settings.data`, `console.migrations`, `console.billing`, `console.content`, `console.compliance`, `console.risk`, `console.analytics`, `www.home`, `www.product`, `www.solutions`, `www.pricing`, `www.switch`, `www.compare`, `www.plants`, `www.resources`, `www.trust`, `www.partners`, `www.start` |
| 5B Season billing, close | Level billing with true-up, prepaid seasons, auto-renewal rules, statements, late fees; autopay mandates, retries, payout proof; bank feeds, reconciliation, period close, year-end close, 1099 | 2B, 4A | `web.banking`, `web.close` |
| 5C Scheduling depth | Capacity planner, rain-day playbooks, scenarios, weather alerts and their automations | 2C | `web.capacity`, `web.weather` |
| 5D Programs, safety, snow | Lawn and PHC programs with label library, sign gate and state export formats; irrigation services; credentials, jurisdiction pay packs (24 R24-18), OSHA log; SDS library; Snow Lite (D25) and the full Snow & Ice module on the Storm Event Engine (D12) | 2C | `web.chemicals`, `web.certs`, `web.safety`, `web.snow`, `crew.snow` |
| 5E Operations, job costing | Items and inventory in Off, Light and Standard modes; buy lists, POs, receiving, 2-way and 3-way match; vendors and the subcontractor COI gate; equipment registry, meters, DVIR, rate calculator (D17), preventive maintenance; AP bills; job cost by phase and cost type against the estimate, with WIP on Ledger Advanced (24 R25-C2) | 2B, 2C, 3B | `web.ops`, `web.inventory`, `web.purchasing`, `web.vendors`, `web.equipment`, `web.bills`, `web.job_costing`, `crew.equipment`, `sub.invoices` |
| 5F Agents, automation, reports | Approval Inbox and every agent in 17 at its default autonomy (24 R25-C8); Automation Builder; dashboards on the KPI Dictionary (D14), report builder, scheduled delivery, forecasts and the scenario planner; benchmarks, each cell published at k ≥ 10 (D19); manager mode in the crew app | 2B, 2C, 3A | `web.agents`, `web.automations`, `web.dashboards`, `web.report_builder`, `web.forecasts`, `web.benchmarks`, `crew.manager` |
| 5G Growth, Rootline Home | Forms, reviews, NPS, referrals, campaigns and journeys, website builder with instant quote and booking, AI receptionist, call tracking; public API, webhooks and the MCP server; the Rootline Home funnel and Match routing to opt-in Companies (24 OD-06) | 2A, 3A, 3B | `web.campaigns`, `web.reviews`, `web.referrals`, `web.website`, `web.receptionist`, `web.settings.integrations`, `home.start`, `home.measure`, `home.quiz`, `home.concepts`, `home.budget`, `home.quote` |
| 5H People | Applicant tracking, H-2B workspace, LMS, PTO accrual, embedded payroll through Check (24 OD-53) | 2C | `web.hiring` |
| 5I Partners | Partner program, Accountant Hub, referrals, commissions and payouts (24 R26-5, R26-6) | 2B, 5A | `partner.clients`, `partner.referrals`, `partner.resources`, `console.partners` |

Some v1 depth extends the routes above instead of adding routes: Canada (D23: CAD, PAD, FX, Canadian tax, CASL, fr-CA and the Canadian residency stack, 24 R24-19), SSO and SCIM (R24-16), cells and the dedicated-database option, Tap to Pay (R24-3), and the innovation bets in 23. Each moonshot rail (R-01 to R-14) is built in the track that owns its data, for example stable object IDs with the Studio, the consent ledger with messaging and Action Layer parity with the Tool Registry. Where a bet needs a screen of its own, the build agent adds the route to `surfaces.json` and the catalog first (24 OD-71).

### 5.6 Acceptance scenarios and launch readiness

| Scenario | Runs end to end once these tracks are done |
|---|---|
| E1 Design-build sale | 2A-2C, 3A, 3B, 4A |
| E2 Maintenance season | 2B, 2C, 4A, 5B |
| E3 Lawn program round | 2C, 4A, 5D |
| E4 Install job costing | 2B, 2C, 5E |
| E5 Month-end close | 2B, 5B |
| E6 The switch | 2A-2C, 5A |

**Launch readiness.** v1 is ready for paying Companies when E1-E6 pass end to end as automated tests against the Greenleaf sandbox and as production synthetics, and every launch-readiness check in 24 §3.2 passes: ledger proofs, isolation canaries, zero offline data loss, the budgets in 20 §4.28, load and penetration tests, PCI SAQ-A and SOC 2 Type I readiness, 10DLC approvals, the Plant KB at Excellent in the six Great Lakes Regions, and the AI evals. No check waits on people: there is no design-partner count, interview or pilot. When a check fails, the build agent fixes the product; it never removes features to pass.

---

## 6. Definition of done and guardrails

### 6.1 Per screen

1. Matches the explorer screen for its route (layout, states, copy intent), or the route's `spec` sections where it shows "Screen not mocked yet". Deviations are noted in the change.
2. The route is in the manifest; its permission, module, plan and flag gates run on the server; every access state in 4.1 renders.
3. Masking tests per field class and role template: masked fields absent and listed in `_redactions`. Crews never see price, cost or margin; subcontractors never see the sell price; bookkeepers never see gate codes.
4. Row-scope tests for `own`, `crew`, `branch` and `all`; a cross-tenant probe returns "not found".
5. Each state change writes an audit event with `actor_type` (02 §5.17) and an outbox event.
6. ICU strings in EN, ES and fr-CA, no concatenation, pseudo-locale clean (21 §13.3); client text in the client's language (21 §13.2).
7. WCAG 2.2 AA with axe in CI (21 §12); crew screens meet the glove-and-sun standard (21 §12.4).
8. Crew screens work in airplane mode: local reads, queued mutations in the right lane, conflict rules (20 §4.11.5), "Needs attention" for rejections.
9. AI actions show credit cost and autonomy level before running, carry the AI label and preview (21 §23.1), and send L2 work to the Approval Inbox.
10. Meets its performance budget (20 §4.28), has empty states (21 §15), and is covered by unit, integration (RLS on) and Playwright or Maestro tests.

### 6.2 Per capability

1. Lives in its owning module, writes only its schema, exposes commands, queries and events through `index.ts` (20 §4.3).
2. Its tools are in the Tool Registry with schema, risk tier, permission, idempotency key and eval cases (17 §4.1.3).
3. Money in minor units; postings through ledger events with deterministic keys; invariant property tests (20 §4.18).
4. Long-running steps are Temporal workflows with deterministic ids and `tenant_id` input (20 §4.10).
5. Public objects in OpenAPI with idempotency keys; webhooks projected per scope (20 §4.7).
6. Checks entitlements, records meter usage, quotes and holds credits for AI work (22 §8.3).
7. Names its catalog row (24 §2), and sits behind a flag only for a dark launch or a peak-season deferral (4.1).

### 6.3 Global guardrails

| Guardrail | Rule | Source |
|---|---|---|
| Never block getting paid | Invoicing, portal, client payments, Stripe ingest and posting stay on in every state | 22 §4.1; 20 §4.4.7 |
| Field data always accepted | Sync push accepts mutations in every state except `deleted` | 20 §4.4.7 rule 2 |
| Cost and autonomy first | Credit cost and autonomy level (L0-L4) shown before an AI action runs; hold, settle, release | 22 §4.1, §8.3; 17 §4.1.2 |
| T4 never by AI | Charging cards, refunds, Stripe or bank changes, payroll, period close, permissions, signing: AI only navigates and pre-fills | 17 §4.3 |
| Trust before autonomy | L0-L2 with the Approval Inbox; L3 from the start only for the two OD-46 templates, then earned per agent and action (17); AI never sets a price | 24 R25-C8, OD-46; 17 §4.1.2 |
| Consent per contact per channel | Consent ledger by contact, channel and purpose; quiet hours; opt-outs; no client SMS before 10DLC approval | 16 §4.20-4.21, §5.7 |
| Support access by grant only | Platform roles (the founder and operator agents) have no memberships. Read-only grants by owner or office manager, read-write and task scopes by owner; time-boxed, bannered, logged. Break-glass: an operator agent's request needs the founder's approval; the founder's own use needs step-up authentication and a written reason, and is logged | 02 §5.13; 20 §4.24.6; 24 §1.2 |
| No access to client funds | Client money lands in the Company's Stripe; money-moving commands are blocked for platform roles; `platform_finance` never sees client payments | 20 §1.2; ADR-010 |
| Isolation, plants | Forced RLS with canaries; AI designs use only Region-valid KB plants, labeled artist renderings | 20 §4.4.3; README §1.3 |

---

## 7. Route-to-spec table

Every route in `docs/platform/surfaces.json`, generated by a script and grouped by surface, then by nav in file order: 155 routes on 10 surfaces, all v1. A note after a label names a module gate, or route roles that differ from the surface default. Each route's plan feature and permission are the `feature` and `perm` fields in `surfaces.json` and land in the generated manifest (2.4). Regenerate the tables after any change to `surfaces.json` (proposed: as an output of `tools/blueprint`); do not edit them by hand.

### 7.1 Company web app (`web`)

86 routes.

| Nav | Route | Label | Spec |
|---|---|---|---|
| Today | `web.today` | Today | 21 §6.3; 17 A1 |
| Inbox | `web.inbox` | Inbox | 16; 17 A2 |
| Clients | `web.clients` | Client list | 03 |
|  | `web.client` | Client record | 03; 21 §18 |
|  | `web.property` | Property record | 03; 12 |
|  | `web.contacts` | Contacts and portal access | 02 §5.11; 16 |
| Sales | `web.leads` | Leads | 03; 17 A3 |
|  | `web.pipeline` | Pipeline | 03 |
|  | `web.assessments` | Site assessments | 03 |
|  | `web.estimates` | Estimates | 03 |
|  | `web.estimate` | Estimate builder | 03; 17 A6 |
|  | `web.proposals` | Proposals | 03 |
|  | `web.proposal` | Proposal editor | 03; 06 |
|  | `web.renewals` | Renewals | 03; 07 |
|  | `web.change_orders` | Change orders | 03 |
|  | `web.sales_templates` | Templates and kits | 03 |
| Design | `web.designs` | Designs | 10 |
|  | `web.studio` | Design Studio | 10; 21 §18.7 |
|  | `web.mockups` | Mockup lab | 11; 21 §18.8 |
|  | `web.plants` | Plant library | 12 |
|  | `web.palettes` | Palettes | 12 |
|  | `web.design_library` | Symbols and materials | 10 |
|  | `web.design_templates` | Design templates | 10 |
| Schedule | `web.board` | Dispatch board | 04 |
|  | `web.calendar` | Calendar | 04 |
|  | `web.map` | Route map | 04 |
|  | `web.capacity` | Capacity planner | 04 |
|  | `web.programs` | Recurring programs | 04; 14 |
|  | `web.weather` | Weather center | 04 |
| Jobs | `web.jobs` | All jobs | 04; 14 |
|  | `web.projects` | Projects (module `install_projects`) | 14 |
|  | `web.agreements` | Service agreements | 07 |
|  | `web.job` | Job record | 14; 09 |
|  | `web.visit` | Visit record | 05 |
|  | `web.snow` | Snow & Ice (module `snow_ice`) | 14 §4.3 |
| Money | `web.invoices` | Invoices | 07 |
|  | `web.invoice` | Invoice editor | 07 |
|  | `web.payments` | Payments | 08 |
|  | `web.ar` | Receivables | 07; 17 A5 |
|  | `web.stripe` | Stripe payouts and disputes | 08 |
| Books | `web.books` | Books overview (module `books`) | 09 |
|  | `web.coa` | Chart of accounts (module `books`) | 09 |
|  | `web.journal` | Journal (module `books`) | 09 |
|  | `web.bills` | Bills and vendors (module `books`) | 09; 13 |
|  | `web.banking` | Bank feeds and reconciliation (module `books`) | 09 |
|  | `web.job_costing` | Job costing (module `books`; WIP with Ledger Advanced) | 09 |
|  | `web.tax` | Sales tax (module `books`) | 07; 09 |
|  | `web.close` | Period close (module `books`) | 09 |
|  | `web.fin_reports` | Financial statements (module `books`) | 09 |
|  | `web.sync` | QuickBooks / Xero sync | 09 |
| Operations | `web.ops` | Operations overview | 13 |
|  | `web.inventory` | Inventory and yards | 13 |
|  | `web.purchasing` | Purchase orders | 13 |
|  | `web.vendors` | Vendors and subcontractors | 13 |
|  | `web.equipment` | Equipment and fleet | 13 |
|  | `web.chemicals` | Chemical inventory and SDS (module `lawn_phc`) | 13; 14 |
| Team | `web.people` | People | 15; 02 §7.3 |
|  | `web.crews` | Crews | 15 |
|  | `web.timesheets` | Timesheets | 15 |
|  | `web.payroll` | Payroll export | 15 |
|  | `web.certs` | Certifications and licenses | 15 |
|  | `web.safety` | Safety and incidents | 15 |
|  | `web.hiring` | Hiring | 15 |
| Marketing | `web.campaigns` | Campaigns | 16 |
|  | `web.reviews` | Reviews and NPS | 16 |
|  | `web.referrals` | Referrals | 16 |
|  | `web.website` | Website and booking | 16 |
|  | `web.receptionist` | AI receptionist and calls | 16 |
| Reports | `web.dashboards` | Dashboards | 18 |
|  | `web.report_builder` | Report builder | 18 |
|  | `web.benchmarks` | Peer benchmarks | 18; 22 §5.2.2 |
|  | `web.forecasts` | 13-week forecasts | 18 |
| Automations | `web.automations` | Rules | 17 |
|  | `web.agents` | AI agents | 17 |
| Settings | `web.settings.company` | Company profile and locations | 21 §5.2 |
|  | `web.settings.users` | Users, roles and permissions | 21 §5.2 |
|  | `web.settings.service_lines` | Service lines and modules | 21 §5.2 |
|  | `web.settings.price_book` | Price book and production rates | 21 §5.2 |
|  | `web.settings.payments` | Payments (Stripe connection) | 21 §5.2 |
|  | `web.settings.accounting` | Accounting setup | 21 §5.2 |
|  | `web.settings.portal` | Portal and branding | 21 §5.2 |
|  | `web.settings.notifications` | Notifications and templates | 21 §5.2 |
|  | `web.settings.integrations` | Integrations and API | 21 §5.2 |
|  | `web.settings.data` | Data import and export | 21 §5.2 |
|  | `web.settings.subscription` | Plan, billing and AI credits | 21 §5.2; 22 §9.4 |
|  | `web.settings.security` | Security and audit log | 21 §5.2 |

### 7.2 Crew mobile app ("Rootline Crew") (`crew`)

9 routes. Roles: `crew_lead`, `technician` unless the row says otherwise.

| Nav | Route | Label | Spec |
|---|---|---|---|
| Today | `crew.today` | Today route | 05; 21 §5.3 |
|  | `crew.visit` | Visit screen | 05 |
|  | `crew.chem` | Chemical application log (module `lawn_phc`) | 05; 14 |
|  | `crew.snow` | Storm visit log (Snow Lite) (module `snow_ice`) | 14 §4.3.0 |
| Map | `crew.map` | Map | 05 |
| Time | `crew.time` | Time | 05; 15 |
| Messages | `crew.messages` | Messages | 05 |
| More | `crew.more` | More | 05 |
|  | `crew.equipment` | Equipment checkout and DVIR | 13 |

### 7.3 Manager and sales modes (crew app) (`crew_manager`)

2 routes. Roles: `owner`, `ops_manager`, `office_manager` unless the row says otherwise.

| Nav | Route | Label | Spec |
|---|---|---|---|
| Today | `crew.manager` | Manager mode | 21 §5.3 |
|  | `crew.sales` | Sales mode: assessments and Quick Quote (`estimator`, `designer`, `owner`) | 03 SALES-01; 05 §4.0, §4.16 |

### 7.4 Shop kiosk (`kiosk`)

1 route. Roles: `crew_lead`, `technician` unless the row says otherwise.

| Nav | Route | Label | Spec |
|---|---|---|---|
| Today | `crew.kiosk` | Shop kiosk | 02 §7.4; 05 |

### 7.5 Subcontractor lite (`sub`)

3 routes. Roles: `subcontractor` unless the row says otherwise.

| Nav | Route | Label | Spec |
|---|---|---|---|
| Work orders | `sub.orders` | My work orders | 21 §5.3; 02 §5.12 |
|  | `sub.order` | Work order | 21 §5.3 |
| Invoices | `sub.invoices` | Invoices | 21 §5.3; 09 |

### 7.6 Customer Portal (`portal`)

14 routes.

| Nav | Route | Label | Spec |
|---|---|---|---|
| Home / Next step | `portal.home` | Home | 06; 21 §5.4 |
| Proposals and designs | `portal.proposals` | Proposals and designs | 06 |
|  | `portal.proposal` | Proposal view | 06 |
| Schedule | `portal.schedule` | Schedule | 06 |
| Invoices and payments | `portal.billing` | Invoices and payments | 06; 08 |
| Requests | `portal.requests` | Requests | 06 |
| Service history and visit reports | `portal.history` | Service history | 06 |
| Plants and property | `portal.property` | My landscape | 06; 12 |
| Messages | `portal.messages` | Messages | 06 |
| Account: own language, notifications, consent, passkeys | `portal.account` | Account | 06; 02 §5.11 |
| Commercial workspace | `portal.portfolio` | Portfolio (`client_commercial`) | 06; 21 §18.17 |
|  | `portal.approvals` | Approvals (`client_commercial`) | 06; 02 §5.11 |
|  | `portal.documents` | Documents (`client_commercial`) | 06 |
|  | `portal.reports` | Reports and proof of service (`client_commercial`) | 06; 14 |

### 7.7 Platform Admin console (`console`)

19 routes.

| Nav | Route | Label | Spec |
|---|---|---|---|
| Home | `console.home` | Home and Command Center | 19 §4.1 |
| Tenants / Tenant 360 | `console.tenants` | Tenant directory | 19 §4.2 |
|  | `console.tenant` | Tenant 360 | 19 §4.2; 21 §18.13 |
| Migrations | `console.migrations` | Migration Center | 19 §4.3 |
| Billing | `console.billing` | Catalog and subscriptions | 19 §4.4; 22 |
| Entitlements and flags | `console.flags` | Entitlements and flags | 19 §4.5 |
| Support | `console.support` | Support console | 19 §4.6; 02 §6.3 |
| Plant KB | `console.kb.queue` | Plant KB curation | 19 §4.7; 12; 21 §18.11 |
| Content | `console.content` | Content | 19 §4.8 |
| AI Ops | `console.ai` | AI Ops | 19 §4.9; 17 |
| Comms | `console.comms` | Comms Ops | 19 §4.10; 16 |
| Payments oversight | `console.payments` | Payments oversight | 19 §4.11; 08 |
| Risk and trust | `console.risk` | Risk and trust | 19 §4.12 |
| Compliance | `console.compliance` | Compliance | 19 §4.13 |
| Analytics | `console.analytics` | Platform analytics | 19 §4.14; 22 §7 |
| System health | `console.health` | System health | 19 §4.15; 20 §6.5 |
| Partners | `console.partners` | Partners | 19 §4.16; 22 §5.4 |
| Agents and audit | `console.staff` | Staff, approvals and audit | 19 §4.17 |
| Settings | `console.settings` | Console settings | 19 |

### 7.8 Partner portal (Accountant Hub) (`partner`)

3 routes. Roles: `partner_admin`, `partner_member` unless the row says otherwise.

| Nav | Route | Label | Spec |
|---|---|---|---|
| Clients | `partner.clients` | Accountant Hub | 02 §7.8; 09 |
| Referrals | `partner.referrals` | Referrals and commissions (`partner_admin`) | 22 §5.4.2; 19 §4.16 |
| Resources | `partner.resources` | Certification and resources | 22 §5.4 |

### 7.9 Public marketing site (`www`)

11 routes. Roles: `prospect`, `homeowner` unless the row says otherwise.

| Nav | Route | Label | Spec |
|---|---|---|---|
| Home | `www.home` | Home | 21 §5.6 |
| Product | `www.product` | Product tours | 21 §5.6 |
| Solutions | `www.solutions` | Solutions by segment | 21 §5.6 |
| Pricing | `www.pricing` | Pricing | 21 §5.6; 22 §9.2 |
| Switch | `www.switch` | Switch | 21 §5.6 |
| Compare | `www.compare` | Compare | 21 §5.6 |
| Plant Finder | `www.plants` | Plant Finder | 21 §5.6 |
| Resources | `www.resources` | Resources and calculators | 21 §5.6 |
| Trust | `www.trust` | Trust center | 21 §5.6 |
| Partners | `www.partners` | Partners | 21 §5.6 |
| Start | `www.start` | Start a trial | 21 §5.6 |

### 7.10 Homeowner AI design funnel (Rootline Home) (`home`)

7 routes. Roles: `homeowner` unless the row says otherwise.

| Nav | Route | Label | Spec |
|---|---|---|---|
| Design my yard | `home.start` | Start | 21 §5.7; 11; 22 §5.3 |
|  | `home.measure` | Locate and measure | 21 §5.7; 11; 22 §5.3 |
|  | `home.quiz` | Style and needs | 21 §5.7; 11; 22 §5.3 |
|  | `home.concepts` | Concepts | 21 §5.7; 11; 22 §5.3 |
|  | `home.budget` | Plant list and budget | 21 §5.7; 11; 22 §5.3 |
|  | `home.quote` | Save or get a quote | 21 §5.7; 11; 22 §5.3 |
|  | `home.widget` | Dream Yard Visualizer widget (on the Company's own site) | 11 AIM-AUD-01; 21 §5.7; 24 R24-14 |

---

## 8. Risks and decisions

### 8.1 Contradictions found while writing this handoff

Every contradiction found while writing this handoff is resolved in [24 §1.5](24-product-scope-decisions-catalog.md#15-contradictions-resolved): R25-C1, R25-C2, R25-C3, R25-C4, R25-C5, R25-C6, R25-C7, R25-C8, R25-C9, R25-C10, R25-C11, R25-C12 and R25-C13. The blueprint data and this document follow those answers; nothing is left to ask.

### 8.2 Decisions that shape the build

Every build-shaping decision is closed in [24 §1.6](24-product-scope-decisions-catalog.md#16-every-open-decision-closed). A question a module doc left open takes that doc's default; anything else the build agent decides and records in an ADR (24 §1.3).

| Decision | Answer | Source |
|---|---|---|
| Sync read path | Self-hosted sync service for reads plus an in-house outbox for writes | OD-58; 20 Q1 |
| Connection pooling; Cedar performance | The build agent benchmarks and records an ADR; Cedar's fallback is a TypeScript policy DSL | 20 Q4, Q11; 24 §1.3 |
| Stripe Accounts v2 or v1 controller properties | v2 full-dashboard configuration if it has OAuth parity when payments are built, otherwise v1 controller properties with a migration path; checked against Stripe's documentation and recorded | OD-17; 20 Q14 |
| Default book of record | The ledger always runs; Mode B (native plus QuickBooks mirror) for Companies that name a CPA, Mode A otherwise | OD-24 |
| Autonomy | L3 from the start only for the day-3 payment reminder and visit-completion messages; everything else starts at L0-L2 and graduates | OD-46; R25-C8 |
| Default image route | Benchmark vendor editing models against self-hosted pipelines on the golden set; pick by plant identity and house preservation | OD-45 |
| Native apps; irreversible crew actions | One app with crew, manager and sales modes; press-and-hold | OD-38, OD-39; R25-C3 |
| Renderer and iPad | Web canvas everywhere; a native canvas only if Pencil latency fails | OD-41 |
| Device offline lease | 14 days, Company-configurable from 7 to 30 | OD-59; 20 Q18 |
| Office manager P&L default; standing support consent | Asked during onboarding with a one-question toggle; support consent is opt-in, with a one-tap grant in the chat widget | 02 §15 #2, #3 |
| Credit unit and prices; Contact Arbiter caps | "AI credits" at 22's rate card; residential 2 automated messages a day, commercial 4, snow per-push updates exempt | OD-10; OD-50 |
| Event bus, observability, public API | SNS/SQS; the build agent picks the observability vendor before the first production Company; REST only | OD-63; OD-64 |
| Canadian residency | One regional stack for all Canadian Companies | OD-62 |

### 8.3 Risks to watch

From 24 §6: v1 breadth (R1), migrations losing balances (R2), offline loss (R6), ledger violations (R7), cross-tenant leaks (R8), seasonal peaks (R9), a wrong agent action (R13), Stripe behavior (R15), 10DLC rejections (R17). Wire each early-warning signal into the console and alerts, routed to the agent that watches it.

### 8.4 Not for the build agent to decide

Three things go to the founder: prices, plan contents and credit rates ([22](22-business-model-pricing-gtm.md) as amended by 24 §1); legal positions (24 §1.7); and publishing public claims (24 R26-3, OD-07). Everything else the build agent decides, taking the simplest option consistent with the specs, and records in an ADR (24 §1.3).
