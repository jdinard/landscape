# Rootline: status

> November 2026. The specification is complete and the next step is the build. Rootline is two people: the founder and Claude. It ships as **one release, v1**, with everything these documents describe. Claude builds it from [25](25-platform-blueprint-build-handoff.md), markets it under [26](26-agent-led-marketing-playbook.md) and runs Rootline's operations as operator agents in the console; the founder decides and approves. No product code exists yet. "Rootline" is a working name.

## At a glance

- **Done:** research; 26 documents; the binding decision record in [24 section 1](24-product-scope-decisions-catalog.md#1-the-decision-record), which settles every contradiction between documents and closes every open decision; a catalog of 747 features, all in v1; the blueprint data in [platform/](platform/README.md); the [Platform Explorer](site/app.html) with all 155 screens as any role, package and market; two clickable walkthroughs; and the briefs for the build agent ([25](25-platform-blueprint-build-handoff.md)) and the marketing agent ([26](26-agent-led-marketing-playbook.md)).
- **Next:** the build. Claude builds the whole product from [25](25-platform-blueprint-build-handoff.md), in dependency order, against the acceptance checks there.
- **Only the founder:** approves what the agents propose, runs the legal checks in [24 section 1.7](24-product-scope-decisions-catalog.md#1-the-decision-record), and clears the name (OD-65). None of these blocks the build.

## 1. What's here

### 1.1 Research

Four research reports in [research/](research/) cover general field-service platforms (Jobber, Housecall Pro, ServiceTitan and others), landscape-specific platforms (LMN, Aspire, SingleOps, Service Autopilot, Real Green and others), landscape design tools, AI image technology and plant data sources, and industry economics, payments and accounting. [01 - Market landscape](01-market-landscape.md) turns them into a competitor matrix, ranked owner pain points, white space and positioning.

### 1.2 Product specification

| Area | Documents |
|---|---|
| Who it's for | [02 Personas, roles and permissions](02-personas-roles-permissions.md) |
| Sell and design | [03 CRM, estimating and proposals](03-crm-sales-estimating-proposals.md), [10 Design Studio](10-design-studio.md), [11 AI design and mockups](11-ai-design-mockups.md), [12 Plant Knowledge Base](12-plant-knowledge-base.md) |
| Run the work | [04 Scheduling and routing](04-scheduling-dispatch-routing.md), [05 Crew mobile app](05-field-crew-mobile-app.md), [13 Operations, inventory and equipment](13-operations-inventory-equipment.md), [14 Service-line modules](14-service-line-modules.md), [15 Team, HR and payroll](15-team-hr-payroll.md) |
| Clients and money | [06 Customer portal](06-customer-portal.md), [07 Invoicing and contracts](07-invoicing-billing-contracts.md), [08 Payments (bring-your-own Stripe)](08-payments-stripe.md), [09 Accounting ledger and QuickBooks/Xero](09-accounting-ledger-integrations.md) |
| Grow and AI | [16 Marketing and communications](16-marketing-growth-communications.md), [17 AI copilot, agents and automation](17-ai-copilot-automation.md), [18 Reporting and analytics](18-reporting-analytics.md) |
| Platform | [19 Platform admin console](19-platform-admin-portal.md), [20 Architecture and security](20-architecture-security.md), [21 UX, design system and sitemaps](21-ux-design-system-sitemaps.md) |
| Business and innovation | [22 Business model, pricing and go-to-market](22-business-model-pricing-gtm.md), [23 Innovation and moonshots](23-innovation-moonshots.md) |
| Decisions and scope | [24 Product scope, decisions and master feature catalog](24-product-scope-decisions-catalog.md): the decision record (one release, two people, every contradiction and open decision settled) and the 747-feature catalog |
| Build and market it | [25 Platform blueprint and build handoff](25-platform-blueprint-build-handoff.md), [26 Agent-led marketing playbook](26-agent-led-marketing-playbook.md), and the blueprint data in [platform/](platform/README.md) |

Every module doc follows the same template: goals, market research, personas and jobs, feature spec, user flows, wireframes, data model, integrations and events, permissions, AI opportunities, edge cases and compliance, metrics, extra ideas, decisions on former open questions, and sources.

### 1.3 Key decisions

All decisions live in [24 section 1](24-product-scope-decisions-catalog.md#1-the-decision-record). The ones that shape the product most:

| Decision | Where it lives |
|---|---|
| One release: everything specified is in v1; there are no MVP, V1, V2 or V3 tiers, waves or release gates | [24](24-product-scope-decisions-catalog.md) section 1.1 |
| Two people: the founder approves; Claude builds, markets and runs operations as operator agents; staff two-person rules become agent-proposes, founder-approves | [24](24-product-scope-decisions-catalog.md) section 1.2 |
| Every open decision (OD-01 to OD-72) is answered and every module doc's open questions are decided; the build agent records anything new as an ADR and does not stop to ask | [24](24-product-scope-decisions-catalog.md) sections 1.3, 1.5, 1.6 |
| Each landscape company connects its own Stripe account; client money never touches Rootline | [08](08-payments-stripe.md) |
| A built-in double-entry ledger is the book of record; QuickBooks and Xero sync are optional | [09](09-accounting-ledger-integrations.md) |
| AI designs use only plants from the curated, region-aware Plant Knowledge Base, and mockups are labeled as artist renderings | [11](11-ai-design-mockups.md), [12](12-plant-knowledge-base.md) |
| Agents draft and people approve by default, through one Approval Inbox; autonomy is earned per agent and action | [17](17-ai-copilot-automation.md) |
| One native app with crew, manager and sales modes | [05](05-field-crew-mobile-app.md), [24](24-product-scope-decisions-catalog.md) R25-C3 |
| Launch region: the Great Lakes, six Regions from Columbus to Milwaukee, where the plant data is seeded first and marketing starts; the product works across the US and Canada | [24](24-product-scope-decisions-catalog.md) OD-01, [22](22-business-model-pricing-gtm.md) |
| Snow Lite is free in every plan; the full Snow & Ice module is an add-on | [14](14-service-line-modules.md) |
| Pricing: Starter $69, Grow $249, Pro $529 a month on annual plans; Enterprise from $1,500; published AI credit rate card; Founding Customer pricing (25% off plus the Price Lock Promise) for the first 100 paying Companies | [22](22-business-model-pricing-gtm.md), [24](24-product-scope-decisions-catalog.md) R26-12 |

### 1.4 Visual concepts and walkthroughs

All pages live in [site/](site/) as static HTML that runs in any browser, with no build step.

| Page | What it shows |
|---|---|
| [site/app.html](site/app.html) | **Platform Explorer: the whole platform, as anyone.** Every surface (office web app, crew app with its manager and sales modes, kiosk, subcontractor lite, client portal, operator console, partner hub, marketing site, Rootline Home) and all 155 routes, rendered from the blueprint data. Switch the market (eight sample companies across the seven target segments), the package (Starter to Enterprise, Design Solo), who you are viewing as (every Company role, client contact scope, the founder and the operator agents, partners and homeowners), the season and the language. Locked, limited and hidden states follow the real entitlement and permission rules, and a "Why you see this" panel explains each one. Atlas pages cover personas, roles and permission matrices, packages, markets, who sees what, and every screen |
| [site/prototype.html](site/prototype.html) | **Clickable walkthrough of the agentic AI design flow**, from a homeowner's photos and measurements through AI mockups, design-assistant edits, a to-scale plan in the Design Studio, the estimating agent's draft, the proposal, client approval with deposit, and the agents that act afterwards. Each step shows what the agents did, who approved it and the AI credits used |
| [site/recurring.html](site/recurring.html) | **Clickable walkthrough of small and recurring work**: one 9,000 sq ft lawn for one season, from a Quick Quote with AI turf measurement to the season true-up and renewal, with 22 AI credits for the whole season |
| [site/index.html](site/index.html) | The vision site: problem, big bets, personas, lead-to-ledger flow, module atlas, competitive landscape, business model, what v1 includes and architecture |
| [site/screens-office.html](site/screens-office.html) | Static concepts: owner dashboard, client record, dispatch board, estimate builder, client proposal, job costing and ledger |
| [site/screens-design.html](site/screens-design.html) | Static concepts: Design Studio, AI mockup flow, AI layout options, plant search, plant curator console |
| [site/screens-field-client-admin.html](site/screens-field-client-admin.html) | Static concepts: crew app, homeowner and HOA portal, payment drawer, operator console |

### 1.5 Quality passes

Each module doc was written by one agent and reviewed and deepened by another. Seven consistency reviews and two rounds of fixes reconciled more than 120 contradictions between docs. A final pass removed every scope tier, applied the decision record to every document, the blueprint data and the explorer, and turned every module's open questions into decisions. All 322 Mermaid diagrams parse, every table row has the right number of cells, there are no broken links or anchors between documents, and the explorer checker opens every screen as every role on every package without a problem.

### 1.6 By the numbers

| Measure | Count |
|---|---|
| Documents | 26 numbered documents, a README, this status page and 4 research reports |
| Blueprint data | 27 roles, 28 personas, 6 plans, 63 plan capabilities, 20 add-ons, 7 target segments, 8 sample companies, 10 surfaces, 155 routes, 13 service-line modules |
| Words | About 970,000 |
| Cataloged features | 747, all in v1 |
| Open product decisions | None: OD-01 to OD-72 are answered in [24 section 1.6](24-product-scope-decisions-catalog.md#1-the-decision-record) |
| Product risks in the register | 28, each watched by an agent or the founder ([24](24-product-scope-decisions-catalog.md) section 6) |
| "Verify" markers on research facts | About 1,690; the marketing agent checks each against a primary source before it is used publicly (OD-07) |

## 2. What happens next

### 2.1 The build

[25 - Platform blueprint and build handoff](25-platform-blueprint-build-handoff.md) is the brief. Claude builds the whole of v1 from it: the code generated from the blueprint data in [platform/](platform/README.md) (permission and field-class tables, the entitlement table, the route manifest and navigation, seed data with Greenleaf Grounds Co.), the architecture in [20](20-architecture-security.md), and every module doc, with the [Platform Explorer](site/app.html) as the visual reference for every screen. The order follows dependencies, not tiers. The ideas most likely to break the product are built with their acceptance tests early, because so much rests on them:

1. **Plant-faithful AI mockups.** Real Knowledge Base plants must render recognizably while the house stays unchanged, measured on a golden set ([11](11-ai-design-mockups.md) sections 4.4 and 8.7).
2. **Plan-to-photo accuracy.** A to-scale plan must project onto phone photos using only the entered dimensions.
3. **AI layout generation.** Generated layouts must pass the Design Studio's validation rules (spacing, sun, zone, deer).
4. **Bring-your-own Stripe.** Onboarding through Connect and direct charges on the connected account (OD-17).
5. **Ledger posting engine.** Balanced, idempotent postings from every money event ([09](09-accounting-ledger-integrations.md)).
6. **Offline crew app sync.** The conflict rules work on low-end phones ([05](05-field-crew-mobile-app.md)).
7. **Route optimization** on real Great Lakes route density ([04](04-scheduling-dispatch-routing.md)).

The build agent sets up the code structure, engineering conventions and CI as it starts, and records any choice the specs leave open as an ADR ([24 section 1.3](24-product-scope-decisions-catalog.md#1-the-decision-record)).

### 2.2 Plant Knowledge Base data

The plant curator agent builds the plant data ([12](12-plant-knowledge-base.md) KB-SEED-05) from sources the founder has licensed (OD-67): a seed of about 3,000 plants weighted toward Great Lakes needs (salt, clay, deer, zone 5 cold, ash replacement), ratings for the six Great Lakes Regions, and the launch palettes. The founder approves each Region release. Licensed photos stand in until a plant has its own seasonal photography ([24 section 1.8](24-product-scope-decisions-catalog.md#1-the-decision-record)).

### 2.3 Marketing

[26 - Agent-led marketing playbook](26-agent-led-marketing-playbook.md) is the brief for the marketing agent: the segments and messaging in [platform/segments.json](platform/segments.json), the channels and assets per segment, what the agent publishes on its own and what the founder approves, and the rule that no research fact appears in public copy until it is checked against a primary source. The first Companies are customers on the published plans, with Founding Customer pricing as the only early offer.

### 2.4 What only the founder does

- Approve what the operator agents and the marketing agent escalate: prices and plan contents, public claims, refunds and credits above an agent's limit, break-glass access and Plant KB Region releases.
- Run the legal checks in [24 section 1.7](24-product-scope-decisions-catalog.md#1-the-decision-record) before loosening the related default or making the related claim. The product ships with conservative defaults, so none of them blocks the build.
- Clear the name "Rootline" for trademark and domains (OD-65).
