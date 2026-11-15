# Rootline design proposal: status, what's done and what remains

> Status as of November 2026. This repository is a **product design proposal**: research, specifications and UI concepts. No product code has been written yet. "Rootline" is a working name.

## At a glance

- **Done:** competitive research, 24 module and scope documents (about 950,000 words), a 747-feature catalog with scope tiers, a published vision site, static concept screens for every surface, two clickable walkthrough prototypes (the AI design flow, and a season of small recurring work), and the **platform blueprint**: machine-readable roles, personas, packages, target markets and every route, the **Platform Explorer** that mocks all 153 screens as any role, package and market, and the handoff documents for the agent that builds the product ([25](25-platform-blueprint-build-handoff.md)) and the agent that markets it ([26](26-agent-led-marketing-playbook.md)).
- **Decided:** bring-your-own Stripe, a built-in double-entry ledger, the Great Lakes launch region, Snow Lite in the MVP, pricing tiers, the region-aware Plant Knowledge Base, and "humans approve AI actions by default".
- **Remains:** founder review of 70 open product decisions, verification of research facts, counsel reviews, interviews and usability tests with Great Lakes design partners, guided walkthroughs for the remaining workflows (office lead-to-cash, a crew member's full day, month-end close, the operator console and commercial approvals; every screen they touch is already in the Platform Explorer), technical proofs of the riskiest ideas, seeding the Plant Knowledge Base, and then the build itself.

## 1. What's done

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
| Business and vision | [22 Business model, pricing and go-to-market](22-business-model-pricing-gtm.md), [23 Innovation and moonshots](23-innovation-moonshots.md) |
| Scope | [24 Product scope and master feature catalog](24-roadmap-feature-catalog.md): scope tiers, the MVP definition and exit criteria, product dependencies, build vs buy, product risks and open decisions |
| Build and market it | [25 Platform blueprint and build handoff](25-platform-blueprint-build-handoff.md), [26 Agent-led marketing playbook](26-agent-led-marketing-playbook.md), and the blueprint data in [platform/](platform/README.md) |

Every module doc follows the same template: goals, market research, personas and jobs, feature spec with scope tags, user flows, wireframes, data model, integrations and events, permissions, AI opportunities, edge cases and compliance, metrics, extra ideas, open questions and sources.

### 1.3 Decisions already made

| Decision | Where it lives |
|---|---|
| Each landscape company connects its own Stripe account; client money never touches Rootline | [08](08-payments-stripe.md) |
| A built-in double-entry ledger is the book of record; QuickBooks and Xero sync are optional | [09](09-accounting-ledger-integrations.md) |
| AI designs use only plants from the operator-curated, region-aware Plant Knowledge Base, and mockups are labeled as artist renderings | [11](11-ai-design-mockups.md), [12](12-plant-knowledge-base.md) |
| Agents draft and humans approve by default, through one Approval Inbox; autonomy is earned per agent and action | [17](17-ai-copilot-automation.md) |
| Launch region: the Great Lakes (six Wave 1 Regions from Columbus to Milwaukee); Ontario and nearby US metros next; a second US cluster chosen later on traction | [22](22-business-model-pricing-gtm.md) section 6.2, [12](12-plant-knowledge-base.md) KB-SEED-04 |
| Snow Lite (storm visit logging, snow site list, per-push invoices, proof PDF) is in the MVP and included in every plan | [14](14-service-line-modules.md) section 4.3.0 |
| Pricing: Starter $69, Grow $249, Pro $529 a month on annual plans; Enterprise from $1,500; published AI credit rate card | [22](22-business-model-pricing-gtm.md) |
| Scope is described by tiers (MVP, V1, V2, V3), not by dates; the proposal makes no build-time or staffing estimates | [24](24-roadmap-feature-catalog.md) |

### 1.4 Visual concepts and prototype

All pages live in [site/](site/) as static HTML that runs in any browser, and are published together as a private claude.ai page.

| Page | What it shows |
|---|---|
| [site/app.html](site/app.html) | **Platform Explorer: the whole platform, as anyone.** Every surface (office web app, crew app and manager mode, kiosk, subcontractor lite, client portal, operator console, partner hub, marketing site, Rootline Home) and all 153 routes, rendered from the blueprint data. Switch the market (eight sample companies across the seven target segments), the package (Starter to Enterprise, Design Solo), who you are viewing as (every tenant role, client contact scope, Rootline staff role, partner and homeowner), the scope lens (MVP to V2), the season and the language. Locked, limited and hidden states follow the real entitlement and permission rules, and a "Why you see this" lens explains each one. Atlas pages cover personas, roles and permission matrices, packages, markets, who sees what, and every screen |
| [site/prototype.html](site/prototype.html) | **Clickable walkthrough of the agentic AI design flow**, from a homeowner's photos and measurements through AI mockups, design-assistant edits, a to-scale plan in the Design Studio, the estimating agent's draft, the proposal, client approval with deposit, and the agents that act afterwards. Each step shows what the agents did, who approved it and the AI credits used |
| [site/recurring.html](site/recurring.html) | **Clickable walkthrough of small and recurring work**: one 9,000 sq ft lawn for one season. A 2-minute Quick Quote with AI turf measurement, the visit model behind $73 a visit (editable), Good / Better / Best with level billing and autopay, the neighbor's online instant quote, season and route insertion, a Tuesday visit in the Spanish-first crew app, a Spanish voice note turned into a $65 add-on, the Scheduling agent's rain-day reshuffle, the June billing run with ledger postings, an expired-card reminder, and the season true-up and +4% renewal. 22 AI credits for the whole season |
| [site/index.html](site/index.html) | The vision site: problem, big bets, personas, lead-to-ledger flow, module atlas, competitive landscape, business model, product scope and architecture |
| [site/screens-office.html](site/screens-office.html) | Static concepts: owner dashboard, client record, dispatch board, estimate builder, client proposal, job costing and ledger |
| [site/screens-design.html](site/screens-design.html) | Static concepts: Design Studio, AI mockup flow, AI layout options, plant search, plant curator console |
| [site/screens-field-client-admin.html](site/screens-field-client-admin.html) | Static concepts: crew app, homeowner and HOA portal, payment drawer, operator console |

### 1.5 Quality passes

Each module doc was written by one agent and then reviewed and deepened by another. Seven consistency reviews and two rounds of fixes reconciled more than 120 contradictions between docs: names, states, events, account codes, permissions and scope tags. All 339 Mermaid diagrams parse and there are no broken links between documents.

### 1.6 By the numbers

| Measure | Count |
|---|---|
| Documents | 26 numbered documents, a README, this status page and 4 research reports |
| Blueprint data | 27 roles, 28 personas, 6 plans, 63 plan capabilities, 20 add-ons, 7 target segments, 8 sample companies, 10 surfaces, 153 routes |
| Words | About 950,000 |
| Cataloged features | 747: 442 [MVP], 255 [V1], 46 [V2], 4 [V3] |
| Open product decisions (with recommended defaults) | 72, of which 2 are decided (launch region, Snow Lite) |
| Product risks in the register | 28 |
| "Verify" markers on facts that need first-hand confirmation | About 1,660 |

## 2. What remains

No step below carries a time or effort estimate. The order within each list is a suggested priority.

### 2.1 Founder decisions

1. **Confirm or drop Snow Lite in the MVP.** It was added because Great Lakes companies plow all winter ([14](14-service-line-modules.md) section 4.3.0).
2. **Moonshot effort scores.** [23](23-innovation-moonshots.md) still rates each bet 1-5 on relative complexity and plots impact against effort. Keep them, or remove the scores and the matrix.
3. **Product name.** Clear "Rootline" for trademark and domains before brand work (OD-65).
4. **Review the open decisions** in [24](24-roadmap-feature-catalog.md) section 8. Each has a recommended default; accepting the defaults is a valid answer. The ones that change the product most:
   - OD-02 free plan for solo operators (default: no free plan)
   - OD-10 AI credit prices (default: publish the rate card in 22, then adjust from a usage study)
   - OD-17 Stripe Accounts v2 vs controller properties at MVP
   - OD-24 default book of record for new companies
   - OD-33 homeowner visualizer on by default at MVP
   - OD-45 default image model route, decided by a plant-fidelity benchmark
   - OD-46 default AI autonomy at MVP
   - OD-38 one crew/manager app or two

### 2.2 Verification and counsel

- **Research facts.** Competitor prices, features and ownership, vendor API terms and industry numbers carry "verify" markers and the November 2026 date. Live web access during research was limited, so a verification pass with primary sources and hands-on trials of competitor products is needed before anything appears in sales material or an investor deck (OD-07). Checklists are at the end of each research report.
- **Legal reviews:**
  - payment surcharging rules
  - auto-renewal and late-fee laws
  - wage and meal-break rules in the launch states (for example Illinois's 20-minute meal period)
  - pesticide application records
  - TCPA and 10DLC texting rules
  - AI image disclosure
  - plant data and photo licenses (OD-67)
  - aerial imagery and parcel data terms (OD-68)
  - benchmarking and pricing-advice antitrust rules (OD-69)
  - Quebec French requirements

### 2.3 Validation with real users

- Interviews with landscape companies in the six Wave 1 Regions, recruited as design partners ([22](22-business-model-pricing-gtm.md) section 6.10).
- Usability tests of the clickable AI design prototype with homeowners and with designers and estimators.
- Usability tests of the recurring work prototype with owners, estimators, office managers, bookkeepers and Spanish-speaking crew leads: is $73 explainable, is level billing with true-up trusted, is the rain-day trade-off clear.
- Glove, sun, offline and in-truck tests of the crew app concepts using the protocols in [21](21-ux-design-system-sitemaps.md).
- Pricing validation from [22](22-business-model-pricing-gtm.md) section 6.10.

### 2.4 More clickable prototypes

Two workflows are clickable: the AI design flow ([site/prototype.html](site/prototype.html)) and small recurring work ([site/recurring.html](site/recurring.html)). The recurring work walkthrough closed the gap this section used to flag as the biggest. It follows the loop the specification describes, step by step:

| Step in the walkthrough | Specified in |
|---|---|
| Quick Quote on a phone with AI turf measurement and three tiers [MVP] | [03](03-crm-sales-estimating-proposals.md) EST-11, INTEL-03 |
| Visit model: 9,000 sq ft at $73 a visit, $2,190 a season, banded prices for online booking [MVP, bands V1] | [03](03-crm-sales-estimating-proposals.md) EST-12 |
| Proposal, e-signature, level billing and card on file [MVP] | [07](07-invoicing-billing-contracts.md) section 4.2.3, [08](08-payments-stripe.md) |
| Neighbor's instant quote and online booking onto the route day [V1] | [16](16-marketing-growth-communications.md) section 4.3 |
| Season of visits and route insertion [MVP] | [04](04-scheduling-dispatch-routing.md) section 4.2 |
| Crew visit, Spot it and a Spanish voice note turned into an add-on [MVP; client message draft V1] | [05](05-field-crew-mobile-app.md) sections 4.10-4.11, [17](17-ai-copilot-automation.md) A4 |
| Rain-day reshuffle by the Scheduling agent [V1] | [17](17-ai-copilot-automation.md) A7 |
| Billing run, autopay on the Company's Stripe, ledger postings [MVP] | [07](07-invoicing-billing-contracts.md), [08](08-payments-stripe.md), [09](09-accounting-ledger-integrations.md) section 4.3 |
| Expired-card reminder [MVP] | [17](17-ai-copilot-automation.md) A5 |
| Season true-up, fixed escalator and renewal [MVP] | [07](07-invoicing-billing-contracts.md) sections 4.2.3, 4.3.3-4.3.7 |

The [Platform Explorer](site/app.html) now mocks every screen on every surface, so each step of the workflows below can already be opened as the right person, package and market. What the explorer does not give is a guided, step-by-step story with agent narration. The workflows that would still benefit from those walkthroughs:

- office lead-to-cash for project work: dispatch board, visit completion, invoicing and payment
- a crew member's full day in the crew app, including clock-in, breaks, offline sync and Snow Lite
- the bookkeeper's month-end close in the ledger
- the operator console and the plant curator's workflow
- commercial and HOA approvals in the portal

### 2.5 Technical proofs of the riskiest ideas

These are the assumptions most likely to break the product. Each should be proven before the related scope is committed:

1. **Plant-faithful AI mockups.** Real Knowledge Base plants must render recognizably while the house stays unchanged. This is measured on a golden set ([11](11-ai-design-mockups.md) sections 4.4 and 8.7).
2. **Plan-to-photo accuracy.** A to-scale plan must project onto phone photos using only the entered dimensions.
3. **AI layout generation.** Generated layouts must pass the Design Studio's validation rules (spacing, sun, zone, deer).
4. **Bring-your-own Stripe.** Onboarding through Connect and direct charges on the connected account (OD-17).
5. **Ledger posting engine.** Balanced, idempotent postings from every money event ([09](09-accounting-ledger-integrations.md)).
6. **Offline crew app sync.** The conflict rules work on low-end phones ([05](05-field-crew-mobile-app.md) section 4.21).
7. **Route optimization** on real Great Lakes route density ([04](04-scheduling-dispatch-routing.md)).

### 2.6 Plant Knowledge Base data

None of the plant data exists yet. The work, in order ([12](12-plant-knowledge-base.md) KB-SEED-05):

1. Confirm the licenses for each data source.
2. Commission seasonal photography; bloom and fall color can only be shot in season.
3. Build the roughly 3,000-plant seed, weighted toward Great Lakes needs (salt, clay, deer, zone 5 cold, ash replacement).
4. Rate plants for the six Wave 1 Regions.
5. Build the launch palettes.

### 2.7 Building the product

Building starts from the MVP definition in [24](24-roadmap-feature-catalog.md) section 3 and the architecture in [20](20-architecture-security.md). [25 - Platform blueprint and build handoff](25-platform-blueprint-build-handoff.md) is the brief for the agent that builds it: what to generate from the blueprint data in [platform/](platform/README.md) (permission and field-class tables, the entitlement table, the route manifest and navigation, seed data), the build order by scope tier, and the acceptance checks, with the [Platform Explorer](site/app.html) as the visual reference for every screen. The repository will need its own code structure, engineering conventions and CI when that work begins.

### 2.8 Marketing it

[26 - Agent-led marketing playbook](26-agent-led-marketing-playbook.md) is the brief for the agent that markets the product: the segments and draft messaging in [platform/segments.json](platform/segments.json), the channels and assets per segment, what the agent may publish on its own and what a person approves, and the claims it may not make until the research facts are verified (section 2.2). Messaging is draft copy to test with design partners, not settled positioning. The spend caps in its section 1.4 are proposals (the specs set no marketing budget), and its section 8.1 lists 13 contradictions between docs that the founder should settle before the agent runs, for example whether Plant Finder pages and comparison pages are [MVP] (22) or [V1] (01, 12, 21, 24).
