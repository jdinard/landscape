# Clickable walkthroughs: shared conventions

Rootline's clickable prototype is a set of guided walkthroughs, one per part of the business. All of them follow these conventions so they look, behave and read as one product. The first one, the AI design-build walkthrough (`docs/site/prototype.html`, source in `tools/prototype-src/`), is the reference implementation.

## The set

| Page (in `docs/site/`) | Walkthrough | Step ids | Main personas |
|---|---|---|---|
| `prototype.html` | AI design to a signed project (large design-build job) | `s01`-`s15` | homeowner, designer, estimator |
| `wt-recurring.html` | Small and recurring jobs: quote to paid visit | `r01`... | homeowner, estimator, office manager, ops manager, crew, owner |
| `wt-crew-day.html` | A crew's day in the field app | `c01`... | crew lead, technicians |
| `wt-money.html` | Invoicing, payments and the books | `m01`... | office manager, bookkeeper, owner |
| `wt-commercial.html` | Commercial and HOA accounts | `h01`... | property manager, HOA board, ops manager, estimator |
| `wt-owner-ai.html` | The owner's day with AI agents | `a01`... | owner, office manager |
| `wt-onboarding-operator.html` | A new company gets started, and the platform operator's console | `o01`... | new company owner, platform owner, plant curator, support |
| `walkthroughs.html` | Hub: all walkthroughs, the whole-business map, coverage of the spec | none | all |

## Frame (copy it from the reference)

Read `tools/prototype-src/` (head.html styles, body.html shell, app.js shell logic, ui1.js step list) and `docs/site/prototype.html`, and reproduce the same frame:

- Shared site header (exact markup below), then the walkthrough shell: a left **step rail** grouped into acts, a top bar with the step title, "n / N" progress, Back and Next, and the theme toggle (auto, light, dark); the **product screen** in the middle; the collapsible **"Behind the scenes"** panel on the right.
- The behind-the-scenes panel has the same sections in the same order: What's happening; Agent or automation trace (numbered tool calls with short results and durations; label deterministic automation as such); Human in the loop (who approves, autonomy level L0-L4 and risk tier T0-T4 where an agent acts); AI credits (this step and the running total; "0, deterministic" where no AI runs); Scope tag; Spec references as plain text (for example "Spec: 07 §4.2.10").
- The first view, `#overview`, is complete at rest: premise, a clickable journey map of every step grouped by act, the cast, and Start. Put an "All walkthroughs" link to `walkthroughs.html` at the top of the rail.
- Hash routing with plain ids (`#overview`, `#r01-quote`...), left and right arrow keys (not inside inputs), Back and Next, progress bar.
- Product screens sit in `.phone` frames for mobile and `.browser` frames for desktop, using `docs/site/assets/rootline.css` tokens and components, and the reference's `pt-*` shell styles. Keep the shared styles identical; add page-specific styles after them.
- Header markup for every walkthrough page:

```html
<header class="site-nav"><div class="inner"><a class="wordmark" href="index.html">Rootline</a><nav aria-label="Proposal"><a href="index.html">Vision</a><a href="walkthroughs.html" aria-current="page">Walkthroughs</a><a href="screens-office.html">Office app</a><a href="screens-design.html">Design and AI</a><a href="screens-field-client-admin.html">Crew, client and admin</a></nav></div></header>
```

## Source and build

Put each walkthrough's source parts in `tools/walkthroughs/<page-name-without-.html>/` with a `build.sh` that writes `docs/site/<page>.html`, like `tools/prototype-src/build.sh`. The built page is one self-contained file: no external requests except the Google Fonts stylesheet the other pages use and `assets/rootline.css`; no images (inline SVG and CSS only); no external scripts.

## Company and cast (use these everywhere)

- Company: **Greenleaf Grounds Co.**, a design-build-maintain firm in Columbus, Ohio (Central Ohio Region, USDA zone 6b on the 2023 map), on the **Pro** plan (6,000 AI credits a month). Launch region: the Great Lakes.
- Owner **Erin Castillo** (`owner`); office manager **Tasha Greene** (`office_manager`); operations manager **Luis Ortega** (`ops_manager`); estimator **Sam Kowalski** (`estimator`); designer **Jess Morales** (`designer`); bookkeeper **Priya Shah** (`bookkeeper`); maintenance crew lead **Marco Ruiz**, "Crew 2" (`crew_lead`); install crew lead **Andrés Vega**, "Crew 1" (`crew_lead`); technicians **Maria López** and **Javier Torres** on Crew 2 (`technician`, Spanish-first).
- Residential clients: **Ada and Chidi Okafor**, 1876 Glenn Ave, Upper Arlington (the design-build client in `prototype.html`: Better tier $17,590, 30% deposit $5,277.00). Pick other residential clients as needed, in Columbus suburbs.
- Commercial client: **Maple Ridge HOA** (as in `screens-field-client-admin.html`), plus a property manager company if needed.
- Platform side: the founder as **platform owner** (`platform_owner`, shown as "You"), plant curator **Maria Ortiz** (`platform_curator`, senior curator for Great Lakes and Ohio Valley), support agent as needed (`platform_support`).
- Plants: real plants suited to Central Ohio. Claims about deer resistance and natives must be accurate.

## Content rules

- Ground every screen in the spec in `docs/` (grep the relevant module doc for its feature IDs, flows and wireframes). The walkthrough shows the product as specified, with honest scope tags from [24](../../docs/24-roadmap-feature-catalog.md) (catalog in section 2, tag reconciliations in section 4.6): [MVP] first sellable release, [V1] next wave, [V2] later wave, [V3] moonshot.
- AI credit costs come from the rate card in `docs/22-business-model-pricing-gtm.md` section 4.4.1. Deterministic automation is free.
- Iris (the `--ai-*` tokens) marks AI-generated content, agents, Copilot and AI credits only.
- Agents draft and people approve by default (doc 17): show the Approval Inbox, autonomy levels and risk tiers where an agent acts.
- Money: client payments go to the Company's own Stripe account; Rootline never holds client funds (doc 08). The built-in ledger posts balanced entries (doc 09 account codes).
- No Rootline timelines, release dates, team sizes or effort estimates. Sample dates inside the product UI are fine.
- Numbers must agree within a walkthrough and with the other walkthroughs where they share data.

## Page rules (the pages are published as a claude.ai artifact)

- `<!DOCTYPE html>`, `lang="en"`, charset, viewport, a specific `<title>`.
- No `alert`, `confirm`, `prompt` or `window.open`; forms use `preventDefault`; nothing depends on `localStorage`.
- Light and dark themes through the tokens; visible focus; keyboard operable; `prefers-reduced-motion` respected; `aria-label` on SVGs; responsive down to about 400 px (the panel stacks below the screen; wide frames scroll inside their own container, never the page body).
- Dense, realistic, polished product UI, not wireframes. Tabular numbers for money.

## Checks before handing back

Load the page in Playwright (Chromium, 1366 x 900): visit every step by hash, assert no page or console errors and no horizontal overflow of the body at 1366 and 400 px, click every main interaction, and take at most three screenshots to look at. Fix what's visibly broken once.
