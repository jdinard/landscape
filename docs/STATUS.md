# Rootline design proposal: status, what's done and what remains

> Status as of November 2026. This repository is a **product design proposal**: research, specifications and UI concepts. No product code has been written yet. "Rootline" is a working name.

## At a glance

- **Done:** competitive research, 24 module and scope documents (about 950,000 words), a 747-feature catalog with scope tiers, a published vision site, static concept screens for every surface, and a clickable prototype of 13 guided walkthroughs (162 steps) covering every persona, from the AI design flow to weekly mowing, the crew's day, the books, hiring, operations, service lines, marketing and the operator console.
- **Decided:** bring-your-own Stripe, a built-in double-entry ledger, the Great Lakes launch region, Snow Lite in the MVP, pricing tiers, the region-aware Plant Knowledge Base, and "humans approve AI actions by default".
- **Remains** (the working queue is [BACKLOG.md](BACKLOG.md)): founder review of 70 open product decisions, verification of research facts, counsel reviews, interviews and usability tests with Great Lakes design partners, usability tests on the 13 built walkthroughs (section 2.4), technical proofs of the riskiest ideas, seeding the Plant Knowledge Base, and then the build itself.

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
| [site/walkthroughs.html](site/walkthroughs.html) | **Hub for the clickable prototype**: 13 walkthroughs and 162 steps, filterable by persona, with deep links to every step and coverage matrices by persona and by spec module |
| [site/wt-recurring.html](site/wt-recurring.html), [site/wt-crew-day.html](site/wt-crew-day.html), [site/wt-money.html](site/wt-money.html), [site/wt-commercial.html](site/wt-commercial.html), [site/wt-owner-ai.html](site/wt-owner-ai.html), [site/wt-onboarding-operator.html](site/wt-onboarding-operator.html) | Walkthroughs: small and recurring jobs; a crew's day; invoicing, payments and the books; commercial and HOA accounts; the owner's day with AI agents; getting started and the operator console |
| [site/wt-hiring.html](site/wt-hiring.html), [site/wt-operations.html](site/wt-operations.html), [site/wt-service-lines.html](site/wt-service-lines.html), [site/wt-design-studio.html](site/wt-design-studio.html), [site/wt-getting-found.html](site/wt-getting-found.html), [site/wt-future.html](site/wt-future.html) | Walkthroughs: hiring and seasonal crews; purchasing, inventory, fleet and subcontractors; irrigation, lighting and other service lines; Design Studio in depth; getting found (website, AI receptionist, campaigns, reviews); clearly labeled V2 and V3 moonshots |
| [site/prototype.html](site/prototype.html) | **Clickable walkthrough of the agentic AI design flow**, from a homeowner's photos and measurements through AI mockups, design-assistant edits, a to-scale plan in the Design Studio, the estimating agent's draft, the proposal, client approval with deposit, and the agents that act afterwards. Each step shows what the agents did, who approved it and the AI credits used |
| [site/index.html](site/index.html) | The vision site: problem, big bets, personas, lead-to-ledger flow, module atlas, competitive landscape, business model, product scope and architecture |
| [site/screens-office.html](site/screens-office.html) | Static concepts: owner dashboard, client record, dispatch board, estimate builder, client proposal, job costing and ledger |
| [site/screens-design.html](site/screens-design.html) | Static concepts: Design Studio, AI mockup flow, AI layout options, plant search, plant curator console |
| [site/screens-field-client-admin.html](site/screens-field-client-admin.html) | Static concepts: crew app, homeowner and HOA portal, payment drawer, operator console |

### 1.5 Quality passes and tools

Each module doc was written by one agent and then reviewed and deepened by another. Seven consistency reviews and two rounds of fixes reconciled more than 120 contradictions between docs: names, states, events, account codes, permissions and scope tags. All 339 Mermaid diagrams parse and there are no broken links between documents. The checks that prove it are in [tools/docs-check](../tools/docs-check/README.md). The AI design walkthrough's source is in [tools/prototype-src](../tools/prototype-src/README.md); the other twelve are built on a shared engine described in [tools/walkthroughs](../tools/walkthroughs/README.md). Every walkthrough step is checked in a browser at desktop and phone widths, and axe finds no WCAG 2.1 AA issues on any page in light or dark themes.

### 1.6 By the numbers

| Measure | Count |
|---|---|
| Documents | 24 numbered documents, a README, this status page and 4 research reports |
| Words | About 950,000 |
| Cataloged features | 747: 442 [MVP], 255 [V1], 46 [V2], 4 [V3] |
| Open product decisions (with recommended defaults) | 72, of which 2 are decided (launch region, Snow Lite) |
| Product risks in the register | 29 |
| "Verify" markers on facts that need first-hand confirmation | About 1,570 |

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

- **Research facts.** A web-search verification pass has covered the facts behind product decisions (BACKLOG items A1-A13): Stripe Accounts v2 and OAuth, Stripe Tax for connected accounts, Stripe fees, QuickBooks and Xero API terms, launch-state labor, pesticide, surcharging, auto-renewal and late-fee rules, competitor prices, plant data licenses, image-model prices and industry size. Each result is written into the module doc with sources and marked "confirmed via search results" where the primary page could not be opened. Items it could not settle stay "verify" (for example the QuickBooks CDC lookback, the Tap to Pay add-on fee and several plant-data licenses). The long tail (A14) is being worked doc by doc, launch-region facts first: so far the federal DOT rules (where the MCS-150 schedule was found backwards and fixed), launch-state HR and payroll rules (Michigan sick time, Chicago leave, Illinois meal periods, Ohio city pay-range laws, the new W-2 codes, the final tipped-occupation list), Ohio sales tax on landscaping (taxable above $5,000 a year) and its vendor's discount cap, the FTC and Ohio in-home cancellation rules, the five launch states' invasive plant rules, sales tax on landscaping in all five launch states, workers' comp report deadlines in all five states, the FCC drone action and the Chicago-area leaf-blower rules. Minors' break rules are settled for all five launch states (Indiana repealed its own in 2020), and the California pack's headline figures (2026 minimum wage and exempt salary, outdoor heat thresholds, premium rate, claim-form and training rules) are confirmed. The Claude model prices behind the AI cost model and credit pricing were re-checked (Fable 5.2 is now the top tier; Sonnet 5.5 cache reads are cheaper than assumed, so the estimates are slightly conservative), QuickBooks batch limits are confirmed, and two dated items surfaced for tenants: OSHA's employer deadline for the 2024 hazard-communication changes on substances was November 20, 2026, and Ohio has been under a statewide spotted lanternfly quarantine since February 17, 2026. Two checks changed the design: New York's renewal-notice law requires personal service or certified mail, so the renewal engine now sends New York notices by certified mail instead of email; and the lawn-program timing triggers had mixed two crabgrass growing-degree-day models, so each trigger now names its base temperature. Each doc's Sources section now ends with a list of the links behind its search-confirmed facts. On competitors (B2), 230 of 901 capability cells in [01](01-market-landscape.md) section 4 are still unknown (25.5%), after a pass on routing, weather rescheduling, booking, e-sign, financing, offline and Spanish crew apps; the latest pass found Spanish crew apps at five competitors and that Aspire translates office-entered text, which narrows Rootline's Spanish edge to Spanish-first voice notes, pay explainers, training and hiring. The rest of the long tail, hands-on competitor trials and counsel review are still needed before anything appears in sales material or an investor deck (OD-07).
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
- Usability tests of the 13 clickable walkthroughs: the AI design flow with homeowners, designers and estimators; the others with owners, office managers, bookkeepers and crew leads.
- Glove, sun, offline and in-truck tests of the crew app concepts using the protocols in [21](21-ux-design-system-sitemaps.md).
- Pricing validation from [22](22-business-model-pricing-gtm.md) section 6.10.

### 2.4 Clickable prototype: what's left

All planned walkthroughs are built, including the small and recurring jobs that were the biggest gap ([site/wt-recurring.html](site/wt-recurring.html)). A claims audit checked every regulatory statement in the 13 walkthroughs against the confirmed facts (it corrected the youth equipment rule, stale tax tags and an Ohio auto-renewal rule that doesn't exist). They now also show rules confirmed in the verification pass: the 3-business-day cancellation window when a quote is signed at the client's home, Michigan's tax treatment of lawn care at onboarding, Ohio's 20-day city income tax count at crew close-out and Ohio's Callery pear ban in the Design Studio. What remains needs people, not pages:

- Usability tests of the walkthroughs with homeowners, owners, office managers and crew leads in the Wave 1 Regions (see 2.3), then fixes to whatever confuses them.
- A Spanish pass on the crew-facing screens by native speakers (the crew app screens offer an English and Spanish toggle; the copy has not been reviewed by a translator).
- Real photography and plant imagery once licenses are settled (OD-67); the walkthroughs use drawn illustrations on purpose.

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

Building starts from the MVP definition in [24](24-roadmap-feature-catalog.md) section 3 and the architecture in [20](20-architecture-security.md). The repository will need its own code structure, engineering conventions and CI when that work begins.
