# 25 - Platform Blueprint Build Handoff

> The handoff for the autonomous coding agent that will build Rootline from the specs in this repository, the blueprint in [platform/](platform/), the architecture in [20](20-architecture-security.md) and the MVP in [24](24-product-scope-decisions-catalog.md). It contains no dates, durations, effort estimates or staffing.

| Field | Value |
|---|---|
| Document | 25 - Platform Blueprint Build Handoff |
| Date | 2026-11-15 |
| Owner | `platform_owner` (founder) |
| Status | Proposal v1.0. No product code exists yet ([STATUS](STATUS.md) section 2.7) |
| Inputs | [platform/](platform/) JSON and `build.py`; the [Platform Explorer](site/app.html) and [its README](site/app/README.md); docs 02, 17, 20, 21, 22, 24 |
| Authority | No product decisions. Owns the proposed code layout (3.2), generated artifacts (2.4) and definition of done (6) until the code's own docs replace them |
| Main consumers | The build agent, engineering leads, reviewers |

**At a glance**

- **Source of truth.** `docs/platform/*.json` holds roles, grants, field classes, navigation, plans, routes and sample tenants. Code is generated from it and generated files are never edited by hand.
- **Who wins.** Scope: 24. Prices and entitlements: 22. Permissions: 02. Architecture: 20 (1.3).
- **Order.** Foundations, MVP core loop, completes the MVP, then V1 and later (5). The MVP is done when E1-E6 pass and 24 §3.4 is met.
- **Never traded for scope.** Money correctness, offline field work (24 P3, P4), tenant isolation, never blocking a Company from getting paid.
- **Contradictions** found while writing this are listed, unresolved, in 8.1.

## Table of contents

1. [Purpose and how to use this repository](#1-purpose-and-how-to-use-this-repository)
2. [The blueprint data files](#2-the-blueprint-data-files)
3. [Architecture summary and monorepo layout](#3-architecture-summary-and-monorepo-layout)
4. [Gating model end to end](#4-gating-model-end-to-end)
5. [Build order by dependency](#5-build-order-by-dependency)
6. [Definition of done and guardrails](#6-definition-of-done-and-guardrails)
7. [Route-to-spec table](#7-route-to-spec-table)
8. [Risks and open questions](#8-risks-and-open-questions)

---

## 1. Purpose and how to use this repository

### 1.1 What exists

- 24 specification docs on one shared template, plus [README](README.md), [STATUS](STATUS.md) and research reports.
- `docs/platform/*.json`, the blueprint (section 2), checked by `build.py`.
- `docs/site/app.html`, the Platform Explorer: a static mock of every surface, gated by role, plan, market and scope lens from the same JSON. Routes without a registered screen show "Screen not mocked yet" with their purpose and spec.
- No product code, conventions or CI. This document proposes them.

### 1.2 Reading order

Grep headings; read only the sections named.

| Step | Read |
|---|---|
| 1 | This document, then `python3 docs/platform/build.py` and the explorer's atlas pages (roles and access, packages, who sees what, every screen) |
| 2 | 20 §1, §4.2-4.13, §4.18-4.19, §4.22-4.31, Appendix A (ADRs) |
| 3 | 02 §5.1-5.6, §5.13, §5.17, §8, §10 |
| 4 | 24 §1-§4; 22 §4, §8.3, §10.1 |
| 5 | 21 §5, §8, §12-13, §23.1; 17 §4.1-4.4, §4.11 |
| 6 | Before each module: its routes' `spec` sections (section 7), then its data model, events, permissions and open questions. Money: 09 §4.1.1, §4.1.4, §4.17.1, §4.18; 08 §4.22. Field: 05 §4.21; 04 §4.1.3 |

### 1.3 Which doc wins

The owner doc wins (README §9):

| Topic | Owner |
|---|---|
| **Scope tiers, MVP, catalog, dependencies** (24 §4.6 is binding) | **24** |
| **Prices, plans, add-ons, meters, credits, seats, entitlements** (codes in 22 §4.2.2) | **22** |
| **Roles, permission keys, scopes, field classes, support access** (02 §5.2 key catalog and aliases) | **02** |
| **Architecture, entities, events, tenancy, sync, security** | **20** |
| Billing; payments; posting rules and chart of accounts | 07; 08; 09 (24 §4.6 #28) |
| Brand, UX, tokens, sitemaps | 21 |
| Lifecycle state names; lifecycle timings | 19; 22 (24 §4.6 #23) |

The JSON is the source of truth for code; the owner doc is the source of truth for the JSON. If a JSON value differs from the section it cites (for example `02 §10.1`), fix the JSON. The JSON wins over the explorer's JavaScript (4.2).

### 1.4 Repository rules that carry into the build

- No dates, durations, effort or staffing anywhere; scope uses,,,.
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
| `surfaces.json` | 10 surfaces, domain rule, `gating_order`, 154 routes (126 MVP, 28 V1) with nav, path, scope, plan feature, permission, module, roles, spec | 21 §5 |

### 2.2 How `build.py` validates

It exits non-zero, one line per problem, unless every reference resolves: each route's surface, plan feature, permission (rows like `client / property` are split), module (a key from the `module_catalog` in `tenants.json`, or `books`), parent and roles; nav items for web, console and portal routes; scope MVP-V3; landing routes of personas and roles; tenants' plan, segment, add-ons and cast roles; segments' tenants and plans; capabilities' plan and add-on codes. On success it rewrites `docs/site/assets/platform-data.js` deterministically.

It also checks tenant and segment module keys against that catalog and the observer template's capabilities and nav items. It does not check grant grammar, duplicate capabilities (`time_entry` has two rows) or routes tagged later than their feature. The generator adds these checks.

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
| Events, workflows | Outbox to SNS/SQS (MSK), idempotent consumers, CloudEvents, schemas in `packages/events`. Temporal Cloud, deterministic, `tenant_id` in every input | 20 §4.9-4.10, ADR-006, -007 |
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
apps/console/      [20 calls it apps/admin] Platform Admin console; [P] named after surface `console`
apps/portal/       [20] Customer Portal PWA
apps/crew/         [20] Expo: crew mode      ; manager mode, kiosk     
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
packages/i18n/     [P] ICU catalogs EN and ES, glossary (21 §13.6), pseudo-locale
packages/seed/     [P] Synthetic data generator (20 §4.29), sample tenants
packages/testing/  [P] Isolation harness, persona fixtures, access goldens
tools/blueprint/   [P] Generator and drift check
infra/terraform/   [20]
docs/adr/          [20] ADRs
```

Local development follows 20 §4.22, seeded from `tenants.json` (C9).

---

## 4. Gating model end to end

### 4.1 Layers

`RL.access(route, state)` in `site/app/core.js` applies layers 1-6 in this order (`surfaces.json` `gating_order`). Production enforces them on the server for every request, inside two outer layers.

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
| 7 | Scope tier | `route.scope` | Lens filter | Feature flags; later tiers ship dark (19 PA-041) |
| 8 | Field classes | `field_class_defaults` | `c.sees()`, `h.mask()` | Server only: masked fields absent (not null) with `_redactions`; never synced; exports resolved per recipient; AI tools get projected data (02 §5.4, E5, E10) |

Results: `ok` renders; `limit` renders with the limit shown; `locked` shows the unlocking plan or add-on and price; `hidden` and `off` remove the entry; `denied` shows the 21 §5.8 permission state, never the record's title, client or amount; `surface` is not offered.

### 4.2 Explorer shortcuts not to copy

- Permissions are checked only on web routes and only for grant presence. Production checks action and record scope on every call and surface.
- `cfg` grants count as off; production reads the Company setting.
- `observer` grants and navigation come from `roles.json` `custom_role_templates`, a blueprint reading of 02 §5.7; production generates them like any other role once confirmed. `core.js` also gives crew roles `web` and homeowners `www`, which `roles.json` does not.
- Field-class masking treats partial grants (`status chip`, `masked actions`, `self`, `R billing`, `R in window`) as masked in `h.mask`; production projects each partial grant field by field (02 §10.2).
- Its capability index keeps only the second `time_entry` row.
- Buyers are `owner` only; `entitlement_ux` says anyone with `rootline_subscription` write, which today is the same set.

### 4.3 Entitlement UX rules (`plans.json`)

1. A module the Company has not enabled is hidden for everyone.
2. A capability not in the plan (`-`) or sold as an add-on (`A`) is a locked entry, with the unlock and its price, for roles that can buy; hidden for everyone else.
3. A limited capability (`L`) is fully usable; the limit shows where it bites, with an upgrade path for the owner and "ask the owner" for others.
4. Never block a Company from getting paid: invoicing, the portal, client payments and the ledger stay on through dunning, Winter Mode and overruns (22 §4.1 rule 5).
5. Every AI action shows its credit cost before it runs.
6. Seat type follows permissions, not role names (22 §4.3); field work is never blocked for seats; overage is billed.
7. Snow Lite is in every plan. An add-on a higher tier includes is removed on upgrade with prorated credit; a removed add-on leaves its data read-only.

Downgrades follow 19 PA-040 (`hide`, `read_only`, `grace_days`); anything needed to get paid or to work in the field uses `never_block` (22 §10.1).

---

## 5. Build order by dependency

Order follows 24 §4.4 and the critical path in 24 §4.5: tenancy, RLS and Cedar (D1); then money (ledger D2, BYO Stripe D4, QuickBooks migration D3) and field (sync D5, visit state machine D6), with the Plant KB (Region model D7, Wave 1 seed D8) alongside. Stages follow the columns of 24 §3.2; tracks run in parallel once their needs are met. Plant KB content is data work that gates the MVP exit, not code (STATUS §2.6).

### 5.1 Stage 0: foundations

Builds: monorepo, CI module rules, generator (2.4); `iam` (identities, memberships, passkeys, MFA, phone OTP, devices); `tenancy` (provisioning seeds, access class, entitlements and seat counting D18, flags); `authz` (D1: Cedar, scopes, field projection, isolation suite); `audit`; outbox, bus, Temporal, media, notifications; AI Gateway, credit ledger, Tool Registry (D13); tokens, UI shell, i18n, observability, seed data; console shell.

Lights up: `web.today`, `web.settings.company`, `web.settings.users`, `web.settings.security`, `web.settings.subscription`, `console.home`, `console.tenants`, `console.tenant`, `console.flags`, `console.support`, `console.staff`, `console.health`, `console.settings`. No scenario yet.

### 5.2 Stage 1: MVP core loop

What a design partner needs to run real work at all (24 §3.2, core loop).

| Track | Builds | Needs | Lights up |
|---|---|---|---|
| 1A Records, messaging | Clients, Properties, Contacts, Lead Inbox; Price Book, rates, kits (D10); service-line framework; templates, consent ledger, 10DLC, inbox (D15); Weather Service (D11) | 0 | `web.clients`, `web.client`, `web.property`, `web.contacts`, `web.inbox`, `web.settings.notifications`, `web.settings.price_book`, `web.sales_templates`, `web.settings.service_lines`, `console.comms` |
| 1B Money spine | Ledger, posting rules, AR tie-out, Stripe clearing (D2); BYO Stripe, cards, ACH, webhooks, refunds (D4); Billing Engine, invoices, deposits, agreements, tax rates, credit memos, aging, dunning; QBO mirror | 0 | `web.settings.payments`, `web.settings.accounting`, `web.invoices`, `web.invoice`, `web.payments`, `web.ar`, `web.stripe`, `web.agreements`, `web.books`, `web.coa`, `web.journal`, `web.tax`, `web.fin_reports`, `web.sync`, `console.payments` |
| 1C Field spine | Sync (D5); visit states, recurrence (D6); dispatch board, single-crew sequencing, map; crew Today, run sheet, photos, time (D16), pesticide records, signatures, voice notes, Outdoor Mode, Spanish; projects with 811 gate; timesheets, payroll export; sub work orders | 1A | `web.board`, `web.calendar`, `web.map`, `web.programs`, `web.jobs`, `web.job`, `web.visit`, `web.people`, `web.crews`, `web.timesheets`, `web.payroll`, `web.projects`, `crew.today`, `crew.visit`, `crew.chem`, `crew.map`, `crew.time`, `crew.messages`, `crew.more`, `sub.orders`, `sub.order` |
| 1D Sell, design | Leads, pipelines, Company Budget, margin engine, Quick Quote, tiered proposals, e-sign, deposits, Jobs; Region model, Wave 1 profiles, curation, palettes (D7, D8); Studio to takeoff and Estimate (D9); capture, restyle, region-locked palettes, disclosure | 1A; 1B | `web.leads`, `web.pipeline`, `web.estimates`, `web.estimate`, `web.proposals`, `web.proposal`, `web.designs`, `web.studio`, `web.design_library`, `web.mockups`, `web.plants`, `web.palettes`, `console.kb.queue`, `console.ai` |
| 1E Portal core | Action links, magic link, proposal viewer, sign and pay, invoices, autopay, visit summaries | 1B-1D | `portal.home`, `portal.proposals`, `portal.proposal`, `portal.billing`, `portal.history` |
| 1F Ops, reports, Copilot | Items, inventory Off and Light, buy lists, POs, receiving, COI gate, assets; KPI Dictionary (D14), Job Cost Detail, Owner Command Center; Copilot, Cmd-K, number grounding | 1B, 1C | `web.ops`, `web.inventory`, `web.purchasing`, `web.vendors`, `web.equipment`, `web.dashboards` |

### 5.3 Stage 2: completes the MVP

Sellable to the beachhead buyer without workarounds (24 §3.2, second column). Each track closes acceptance scenarios (24 §3.1).

| Track | Builds | Closes | Lights up |
|---|---|---|---|
| 2A Switch, go-to-market | Migration Center, Jobber and LMN kits, QuickBooks migration with opening balances (D3), rollback; onboarding wizard, sandbox; SaaS billing with credits and tax, trials; DSAR, fraud screening, help center; marketing site | E6 | `web.settings.data`, `console.migrations`, `console.billing`, `console.content`, `console.compliance`, `console.risk`, `console.analytics`, `www.home`, `www.product`, `www.solutions`, `www.pricing`, `www.switch`, `www.resources`, `www.trust`, `www.start` |
| 2B Season billing, close | Level billing with true-up, auto-renewal, escalators, statements, late fees; autopay mandates, retries, payout proof; bank feeds, reconciliation, basic close; basic capacity planner; client skip and pause; preference center | E2, E5 | `web.banking`, `web.close`, `web.capacity`, `portal.schedule`, `portal.account` |
| 2C Design-build sale | Offline assessments and Field Design Mode capture; turf auto-measure, basic change orders; Studio validation, PDF plan sets; render packs, evals; 3,000-plant seed; brand kit, custom domains, project tracker, requests, messaging | E1 | `web.assessments`, `web.change_orders`, `home.widget`, `web.settings.portal`, `portal.property`, `portal.requests`, `portal.messages` (estimator mobile capture: C3) |
| 2D Programs, Snow Lite | Lawn and PHC programs with label library and sign gate; irrigation services; Snow Lite log, site list, per-push invoices, PDF proof (D25); credentials, launch-state pay packs, OSHA log; SDS library | E3 | `web.chemicals`, `web.certs`, `web.safety`, `web.snow`, `crew.snow` |
| 2E Job costing | Vendor price lists, 2-way bill match, equipment rates, meters, DVIR; AP bills; job cost by phase against the estimate | E4 | `web.job_costing`, `web.bills`, `crew.equipment`, `sub.invoices` |
| 2F Agents, growth | Approval Inbox; agents A1-A4, A5 reminders, A6 from notes, A18, A28; Automation Builder; dashboards, reports, scheduled delivery; forms, NPS, basic campaigns, call tracking; public API core and webhooks | All six | `web.agents`, `web.automations`, `web.campaigns`, `web.reviews`, `web.receptionist`, `web.settings.integrations` |

| Scenario | Runs in core-loop form after | Passes as written after |
|---|---|---|
| E1 Design-build sale | 1A-1E | 2C |
| E2 Maintenance season | 1B, 1C, 1E | 2B |
| E3 Lawn program round | 1C | 2D |
| E4 Install job costing | 1B, 1C, 1F | 2E |
| E5 Month-end close | 1B | 2B |
| E6 The switch | 1A-1C | 2A |

**Release gate.** General sale needs E1-E6 passing for at least 15 of 20 design partners and every criterion in 24 §3.4 (ledger proofs, isolation canaries, zero offline data loss, budgets in 20 §4.28, load and pen tests, SOC 2 Type I, SAQ-A, 10DLC approvals, KB at Excellent in the six Wave 1 Regions, AI evals). If needed, cut in the order of 24 §3.3, never P3 or P4; additions need an equal cut (OD-71).

### 5.4 Stage 3: V1; Stage 4: V2 and V3

V1 opens the expansion segments, Wave 2 Regions and depth (24 §4.2). Its 28 explorer routes, plus V1 depth inside MVP routes:

| Theme | Routes | Key dependency |
|---|---|---|
| Commercial (S4) | `portal.portfolio`, `portal.approvals`, `portal.documents`, `portal.reports`, `web.weather` | Branches, approval policies (02 §5.9, §5.11) |
| Money depth | `partner.clients`, `partner.referrals`, `partner.resources`, `console.partners` | Ledger proven in production. WIP and percent complete inside `web.job_costing` (Ledger Advanced) |
| Design, AI, growth | `web.design_templates`, `home.start`, `home.measure`, `home.quiz`, `home.concepts`, `home.budget`, `home.quote`, `web.website`, `web.referrals`, `www.compare`, `www.plants`, `www.partners` | KB seed (D8); trust earned at L0-L2 |
| People, reports, field | `web.hiring`, `web.report_builder`, `web.benchmarks`, `web.forecasts`, `crew.manager`, `crew.kiosk` | 10 Companies per benchmark cell (D19) |
| Sales depth | `web.renewals`: the renewal review grid with CPI, cost-plus and margin-target escalators (24 C03-038). Basic renewals with fixed escalators are MVP on `web.agreements` | Renewal agent A13 |

Full Snow & Ice (D12), Canada (D23) and multi-crew optimization extend existing routes. V2 and V3 (24 §4.3) have no routes yet. Rails R-01, R-02, R-03, R-06, R-08, R-09, R-11, R-12, R-14 are MVP and R-04, R-05, R-07, R-10, R-13 are V1 (24 §3.2); rails are never cut.

---

## 6. Definition of done and guardrails

### 6.1 Per screen

1. Matches the explorer screen for its route (layout, states, copy intent), or the route's `spec` sections where it shows "Screen not mocked yet". Deviations are noted in the change.
2. The route is in the manifest; its permission, module, plan and flag gates run on the server; every access state in 4.1 renders.
3. Masking tests per field class and role template: masked fields absent and listed in `_redactions`. Crews never see price, cost or margin; subcontractors never see the sell price; bookkeepers never see gate codes.
4. Row-scope tests for `own`, `crew`, `all` (`branch` from V1); a cross-tenant probe returns "not found".
5. Each state change writes an audit event with `actor_type` (02 §5.17) and an outbox event.
6. ICU strings in EN and ES, no concatenation, pseudo-locale clean (21 §13.3); client text in the client's language (21 §13.2).
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
7. Ships behind a flag with its scope tag and names its catalog row (24 §2).

### 6.3 Global guardrails

| Guardrail | Rule | Source |
|---|---|---|
| Never block getting paid | Invoicing, portal, client payments, Stripe ingest and posting stay on in every state | 22 §4.1; 20 §4.4.7 |
| Field data always accepted | Sync push accepts mutations in every state except `deleted` | 20 §4.4.7 rule 2 |
| Cost and autonomy first | Credit cost and autonomy level (L0-L4) shown before an AI action runs; hold, settle, release | 22 §4.1, §8.3; 17 §4.1.2 |
| T4 never by AI | Charging cards, refunds, Stripe or bank changes, payroll, period close, permissions, signing: AI only navigates and pre-fills | 17 §4.3 |
| Trust before autonomy | L0-L2 with the Approval Inbox; L3 only where 24 allows; AI never sets a price | 24 P6, §3.5; OD-46 |
| Consent per contact per channel | Consent ledger by contact, channel and purpose; quiet hours; opt-outs; no client SMS before 10DLC approval | 16 §4.20-4.21, §5.7 |
| Support access by grant only | Staff have no memberships. Read-only grants by owner or office manager, read-write and task scopes by owner; time-boxed, bannered, logged; break-glass needs two people | 02 §5.13; 20 §4.24.6 |
| No access to client funds | Client money lands in the Company's Stripe; money-moving commands are blocked for staff; `platform_finance` never sees client payments | 20 §1.2; ADR-010 |
| Isolation, plants | Forced RLS with canaries; AI designs use only Region-valid KB plants, labeled artist renderings | 20 §4.4.3; README §1.3 |

---

## 7. Route-to-spec table

Every route in `docs/platform/surfaces.json`, generated by a script and grouped by surface, then by nav in file order. A note after a label names a module gate, or route roles that differ from the surface default. Each route's plan feature and permission are the `feature` and `perm` fields in `surfaces.json` and land in the generated manifest (2.4). Route tags follow 24 (C1 is resolved). Regenerate the tables after any change to `surfaces.json` (proposed: as an output of `tools/blueprint`); do not edit them by hand.

### 7.1 Company web app (`web`)

86 routes: 77 MVP, 9 V1.

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
| | `web.job_costing` | Job costing (module `books`; WIP with Ledger Advanced) | 09 |
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

9 routes: 9 MVP. Roles: `crew_lead`, `technician` unless the row says otherwise.

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

### 7.3 Manager mode (crew app) (`crew_manager`)

1 route: 1 V1. Roles: `owner`, `ops_manager`, `estimator`, `office_manager` unless the row says otherwise.

| Nav | Route | Label | Spec |
|---|---|---|---|
| Today | `crew.manager` | Manager mode | 21 §5.3 |

### 7.4 Shop kiosk (`kiosk`)

1 route: 1 V1. Roles: `crew_lead`, `technician` unless the row says otherwise.

| Nav | Route | Label | Spec |
|---|---|---|---|
| Today | `crew.kiosk` | Shop kiosk | 02 §7.4; 05 |

### 7.5 Subcontractor lite (`sub`)

3 routes: 3 MVP. Roles: `subcontractor` unless the row says otherwise.

| Nav | Route | Label | Spec |
|---|---|---|---|
| Work orders | `sub.orders` | My work orders | 21 §5.3; 02 §5.12 |
|  | `sub.order` | Work order | 21 §5.3 |
| Invoices | `sub.invoices` | Invoices | 21 §5.3; 09 |

### 7.6 Customer Portal (`portal`)

14 routes: 10 MVP, 4 V1.

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

19 routes: 18 MVP, 1 V1.

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
| Staff and audit | `console.staff` | Staff, approvals and audit | 19 §4.17 |
| Settings | `console.settings` | Console settings | 19 |

### 7.8 Partner portal (Accountant Hub) (`partner`)

3 routes: 3 V1. Roles: `partner_admin`, `partner_member` unless the row says otherwise.

| Nav | Route | Label | Spec |
|---|---|---|---|
| Clients | `partner.clients` | Accountant Hub | 02 §7.8; 09 |
| Referrals | `partner.referrals` | Referrals and commissions (`partner_admin`) | 22 §5.4.2; 19 §4.16 |
| Resources | `partner.resources` | Certification and resources | 22 §5.4 |

### 7.9 Public marketing site (`www`)

11 routes: 8 MVP, 3 V1. Roles: `prospect`, `homeowner` unless the row says otherwise.

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

7 routes: 1 MVP, 6 V1. Roles: `homeowner` unless the row says otherwise.

| Nav | Route | Label | Spec |
|---|---|---|---|
| Design my yard | `home.start` | Start | 21 §5.7; 11; 22 §5.3 |
|  | `home.measure` | Locate and measure | 21 §5.7; 11; 22 §5.3 |
|  | `home.quiz` | Style and needs | 21 §5.7; 11; 22 §5.3 |
|  | `home.concepts` | Concepts | 21 §5.7; 11; 22 §5.3 |
|  | `home.budget` | Plant list and budget | 21 §5.7; 11; 22 §5.3 |
|  | `home.quote` | Save or get a quote | 21 §5.7; 11; 22 §5.3 |
|  | `home.widget` | Dream Yard Visualizer widget (on the Company's own site) | 11 AIM-AUD-01; 21 §5.7; 24 §4.6 #14 |

---

## 8. Risks and open questions

### 8.1 Contradictions found while writing this handoff

C1, C2, C4, C5 and C10 are resolved in the blueprint data (the row says how); the rest are unresolved. Apply 1.3, and ask the founder where the row says so.

| # | Topic | What disagrees | Rule or ask |
|---|---|---|---|
| C1 | Route tags vs MVP | `web.assessments`, `web.change_orders`, `web.projects`, `web.capacity` are V1 in `surfaces.json`; offline assessments, basic change orders, phased projects with the 811 gate and the basic capacity planner are MVP (24 §3.2, §4.6 #13). `web.change_orders` uses the MVP feature `change_orders_basic` | **Resolved in the blueprint:** 24 wins; the four routes are retagged MVP (basic versions), with the V1 depth named in each route's purpose |
| C2 | Job costing | E4 needs job cost by phase and 22 §4.1 puts the full ledger in Grow, but `web.job_costing` is V1 behind `ledger_advanced`, a Grow add-on | **Resolved in the blueprint:** `web.job_costing` is MVP behind `ledger_essentials` (job cost by phase and cost type vs estimate); WIP and percent complete stay V1 with Ledger Advanced. Founder to confirm |
| C3 | Estimators on mobile | 03 §4.13 (SALES-01) and 05 §4.0 give estimators and designers mobile capture at MVP; `roles.json` and the crew routes give them no MVP mobile surface; manager mode is V1 (21 §5.1) | Ask |
| C4 | Homeowner widget | 24 §4.6 #14 and 21 §5.1: embeddable widget at MVP behind a verify-first gate; only V1 `home.*` routes exist | **Resolved in the blueprint:** route `home.widget` on the `home` surface, embedded on the Company's site |
| C5 | Observer | In `roles.json` (02 §5.7) and sold as free seats (22 §4.3), but absent from the tenant matrix and nav tables; `core.js` hard-codes it | **Resolved in the blueprint:** `roles.json` `custom_role_templates` holds the observer's nav, grants and field classes, marked as a blueprint reading of 02 §5.7 to confirm |
| C6 | `time_entry` | Two capability rows (own, others) | Key by capability and note |
| C7 | Credit display | 22 §4.1 rule 4: every AI action shows its cost first. 17 §4.1.3, §4.11.5: cost on the button from 5 credits, confirmation above 20 | 22 wins; 17's thresholds as confirmation rules. Confirm |
| C8 | L3 at MVP | 17 §4.3 tags pre-approved templates; 24 §3.5 and OD-46 allow L3 at MVP for two templates | 24 wins. Confirm OD-46 |
| C9 | Sample company | 20 §4.22 seeds "Green Acres Landscaping" (420 clients); 22 §4.6: Greenleaf with 120 clients; `tenants.json`: Greenleaf with 412 | Use `tenants.json`; ask the demo size |
| C10 | Module keys | `build.py` knows 7 keys, only `books` gates a route, `tenants.json` uses others; service-line screens are not module-gated though 21 §5.2 hides disabled modules | **Resolved in the blueprint:** module keys follow 14 §4.0.1 (`tenants.json` `module_catalog`, checked by `build.py`); `web.projects`, `web.chemicals`, `web.snow`, `crew.chem` and `crew.snow` are module-gated |
| C11 | Entitlement names | 19 PA-040 (`boolean`, `quota`, `tier`, `design_studio.3d`) vs 22 §10.1 (`flag`, `limit`, `meter`) and `plans.json` (`design_3d`) | 22 wins |
| C12 | Console app | 20 §4.30 `apps/admin` vs surface `console` | Naming only (3.2) |
| C13 | Summit tenant | "Central Ohio" with Dayton and Cincinnati branches, a Wave 2 Region (24 §1.3) | Sample data |

### 8.2 Open decisions that shape the build

Each has a recommended default in its source. Use it unless the founder decides otherwise; never decide in code.

| Decision | Source |
|---|---|
| Sync read path: adopt an engine or build | OD-58; 20 Q1 |
| Pooling with transaction-local tenant context; Cedar performance (fallback: a TypeScript policy DSL) | 20 Q4, Q11 |
| Stripe Accounts v2 or v1 controller properties | OD-17; 20 Q14 |
| Default book of record | OD-24 |
| MVP autonomy; default image route | OD-46; OD-45 |
| One native app or two; swipe or hold for irreversible crew actions | OD-38, OD-39 |
| Device offline lease | OD-59; 20 Q18 |
| Office manager P&L default; standing support consent | 02 §15 #2, #3 |
| Credit unit name and prices; Contact Arbiter caps | OD-10; OD-50 |

### 8.3 Risks to watch

From 24 §6: MVP breadth (R1), migrations losing balances (R2), offline loss (R6), ledger violations (R7), cross-tenant leaks (R8), seasonal peaks (R9), a wrong agent action (R13), Stripe behavior (R15), 10DLC rejections (R17). Wire each early-warning signal into the console and alerts.

### 8.4 Not for the build agent to decide

Prices, plan contents and credit rates (22); scope tags (24); new roles, keys or default grants (02); anything marked "verify" or awaiting counsel (STATUS §2.2); the rows of 8.1.
