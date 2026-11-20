# Backlog: work that continues after the proposal

> The working queue for follow-up sessions. It was salvaged from the review agents' notes in the workflow runs that produced this proposal (121 "remaining concerns" across docs 01-23) and checked against the current docs. Items that later passes already resolved were dropped. Founder decisions are not here: they live in [STATUS.md](STATUS.md) section 2.1 and in [24](24-roadmap-feature-catalog.md) section 8.

## How a follow-up session uses this file

1. Take the next unticked items, in order: section E (the prototype), then section A, then section B.
2. Do the work in the docs, citing sources inline and in each doc's Sources section.
3. Run the checks in [tools/docs-check](../tools/docs-check/README.md): 0 broken links and 0 Mermaid failures.
4. Commit and push to the working branch, then tick the item here with a one-line result and the commit.

Ground rules carried over from the founder's direction:

- Describe scope by tier ([MVP], [V1], [V2], [V3]). Add no dates, timelines, team sizes or effort estimates.
- Don't decide section C items; they are listed for the founder.
- The founder asked to make the clickable prototype as complete as possible, so prototype work comes first. New walkthroughs follow [tools/walkthroughs/README.md](../tools/walkthroughs/README.md) and are added to the hub (`docs/site/walkthroughs.html`, rebuilt with `tools/walkthroughs/hub/`).

## E. Prototype: clickable walkthroughs

The hub is [site/walkthroughs.html](site/walkthroughs.html). Each walkthrough follows [tools/walkthroughs/README.md](../tools/walkthroughs/README.md).

- [x] **E0 AI design to a signed project** ([site/prototype.html](site/prototype.html)).
- [x] **E1 Six more walkthroughs:** small and recurring jobs (6ad0ad7), a crew's day (9ae2fd2), invoicing and the books (f3349d4), commercial and HOA (b9d7864), the owner's day with AI agents (2bd5ad4), getting started and the operator console (67c349b).
- [x] **E2 Cross-walkthrough pass** (6f090a9): near-duplicate names renamed, the Okafors placed in Upper Arlington everywhere, all 162 hub deep links resolve, no overflow at 1366 or 400 px, and axe finds 0 WCAG 2.1 AA issues on every page in light and dark themes.
- [x] **E3 Hiring and seasonal crews** (42f2f0a): [site/wt-hiring.html](site/wt-hiring.html).
- [x] **E4 Operations depth** (efef01d): [site/wt-operations.html](site/wt-operations.html).
- [x] **E5 Other service lines** (9b75767): [site/wt-service-lines.html](site/wt-service-lines.html).
- [x] **E6 Design Studio depth** (f6f7e5c): [site/wt-design-studio.html](site/wt-design-studio.html).
- [x] **E7 Getting found** (4b0c0e3): [site/wt-getting-found.html](site/wt-getting-found.html).
- [x] **E8 Moonshots, clearly labeled** (4d8cc4e): [site/wt-future.html](site/wt-future.html).
- [ ] **E9 Usability tests of the walkthroughs** with Great Lakes design partners (homeowners, owners, office managers, crew leads); record what confused people and fix the screens. Needs real participants, so it waits for the founder.

## A. Verification pass

Facts marked "verify" exist because live research was limited while the docs were written. Web search works in follow-up sessions. Direct page fetches to vendor and regulator sites (for example docs.stripe.com, developer.intuit.com, ecfr.gov) are blocked by the session's network policy until the founder allows those hosts. Until then, verify from search results, cite what was found, and write "confirmed via search results; primary page not opened" where that applies.

Ordered so that facts behind product decisions come first:

- [x] **A1 Stripe Connect configuration.** Accounts v2 versus controller properties for full-dashboard merchants, and whether OAuth linking works the same under v2 ([08](08-payments-stripe.md) open question 1, OD-17). **Result:** Accounts v2 is GA (2025-12-15.clover) and supports full-Dashboard merchant accounts, but OAuth-linked accounts must stay on v1, so the OD-17 fallback applies; risk R29 added (d02188e).
- [x] **A2 Stripe Tax on connected accounts.** Can Stripe Tax calculate and track liability for direct charges on Standard-style connected accounts ([07](07-invoicing-billing-contracts.md) open question 1, OD-31)? **Result:** supported with the Company as the liable party and its own registrations; $0.50 per API transaction; fee placement and non-Stripe invoices left for the Stripe spike (aaa2586).
- [x] **A3 Stripe fees.** Cards, ACH Direct Debit (the docs use 0.8% capped at $5), Financial Connections, Tap to Pay and Terminal; Stripe Billing fees for Rootline's own subscriptions ([08](08-payments-stripe.md), [22](22-business-model-pricing-gtm.md)). **Result:** card 2.9% + $0.30, in-person 2.7% + $0.05, ACH 0.8% capped at $5 and Billing 0.7% match 2026 fee guides; Tap to Pay add-on fee still disputed between sources, left as verify (a33add2).
- [x] **A4 Accounting APIs.** QuickBooks Online rate limits, change-data-capture lookback, App Partner Program tiers and metering; QuickBooks Desktop Web Connector status; Xero developer tiers and limits ([09](09-accounting-ledger-integrations.md)). **Result:** QBO 500 req/min per realm and 40 batch/min confirmed; App Partner tiers and CorePlus allowances recorded; Desktop sales ended Sep 2024 (Web Connector status unknown); Xero tiers since 2 Mar 2026 recorded; CDC lookback still unconfirmed (99dd1f3).
- [x] **A5 Launch-state labor rules.** Illinois meal period (One Day Rest in Seven Act) and Paid Leave for All Workers Act, Chicago and Cook County ordinances, Michigan Earned Sick Time Act, Wisconsin meal rules, current minimum wages in Ohio, Michigan, Illinois, Indiana and Wisconsin ([05](05-field-crew-mobile-app.md), [15](15-team-hr-payroll.md)). **Result:** 2026 minimum wages (OH $11.00 above threshold, MI $13.73, IL $15.00, IN and WI $7.25), Illinois meal and day-of-rest rules, PLAWA, Chicago and Cook County leave, Michigan ESTA caps and Wisconsin meal rules recorded in 15 section 2.4; Chicago accrual rate still conflicting (b5dd300).
- [x] **A6 Launch-state pesticide rules.** Applicator recordkeeping, posting and notification-registry rules in Ohio, Michigan, Illinois, Indiana and Wisconsin ([14](14-service-line-modules.md), [05](05-field-crew-mobile-app.md)). **Result:** posting, registry and record rules for all five states recorded in 14 section 4.1.6; Illinois covers fertilizer too, Wisconsin signs stay 72 hours, Michigan and Wisconsin run registries (new founder question C7) (37eb302).
- [x] **A7 Competitor pricing and features.** Jobber, Housecall Pro, LMN (Granum), Aspire, SingleOps, Service Autopilot, Real Green, Copilot CRM, Yardbook and SynkedUP ([01](01-market-landscape.md), [22](22-business-model-pricing-gtm.md), [R1](research/R1-field-service-platforms.md), [R2](research/R2-landscape-specific-platforms.md)). A first search (November 2026) put Jobber at Core $49, Connect $139, Grow $199 and Plus $499 a month on monthly billing, with sources disagreeing on Plus. **Result:** prices re-checked for Jobber (now priced by team size), Housecall Pro, LMN, SingleOps, SynkedUP and Yardbook in 22 section 3; Copilot CRM still unverified; Aspire, Service Autopilot and Real Green kept their existing sources; feature claims were not re-checked (f806352).
- [x] **A8 Messaging rules and fees.** Twilio 10DLC brand and campaign fees; status of the FCC TCPA consent-revocation rule ([16](16-marketing-growth-communications.md), [19](19-platform-admin-portal.md), [20](20-architecture-security.md)). **Result:** Twilio 10DLC fees ($4.50 brand + $41.50 vetting, $15 per campaign vetting, $1.50-$10 a month per campaign) and the FCC 26-67 revocation amendments (effective November 25, 2026) recorded in 16 and 19 (cb10157).
- [x] **A9 Surcharging.** Card-network rules and the rules in the launch states ([08](08-payments-stripe.md)). **Result:** no statutory ban or cap in the five launch states (Michigan disclosure and tax rules, Illinois notice and no debit surcharges; the 1% Illinois cap was a bill that died); the Visa/Mastercard settlement has preliminary approval only (June 2026); doc 08 section 4.10 updated (9fde0ac).
- [x] **A10 Contract and billing law.** Auto-renewal notice and late-fee limits in the launch states ([07](07-invoicing-billing-contracts.md)). **Result:** Illinois consumer auto-renewal notices (30-60 days) and Wisconsin's business-contract reminder rule (15-60 days, terms over a year) recorded in 07 section 4.3.4; Michigan has only a pending bill; late-fee limits were inconclusive and stay "verify" for counsel (fa355f0).
- [x] **A11 Plant data licenses.** USDA PLANTS, Missouri Botanical Garden Plant Finder, NC State Extension Plant Toolbox, Calscape, Lady Bird Johnson Wildflower Center, POWO and WFO, GBIF, Trefle and Perenual terms for commercial reuse ([12](12-plant-knowledge-base.md), [R3](research/R3-design-ai-plant-data.md)). Facts first; counsel still signs off (OD-67). **Result:** USDA PLANTS data CC0 (images need permission), MOBOT commercial use needs permission, GBIF per-dataset CC0/CC BY/CC BY-NC, Trefle CC BY 4.0 recorded in 12 section 4.6; POWO, WFO, Perenual, NC State, Calscape and Lady Bird Johnson terms still unsettled (5dd8d7d).
- [x] **A12 AI image models.** Current licenses and prices for the image-editing models named in [11](11-ai-design-mockups.md) and [R3](research/R3-design-ai-plant-data.md). **Result:** FLUX Kontext $0.04/$0.08, FLUX.2 per megapixel, Gemini 3 Pro Image about $0.134 (1K-2K) and $0.24 (4K), Qwen-Image-Edit 2509/2511 Apache-2.0 confirmed in 11 section 8.6 (3137a8e).
- [x] **A13 Industry numbers.** Market size, firm counts and size distribution for US and Canadian landscaping ([01](01-market-landscape.md), [R4](research/R4-industry-payments-accounting.md)). **Result:** 117,969 employer establishments (CBP 2023, via secondary sources), about 517,000 nonemployers and $176.7B 2026 revenue (IBISWorld) recorded in 01 section 2; all inside the ranges the TAM uses; Canada not re-checked (833be35).
- [ ] **A14 Remaining "verify" markers**, doc by doc: 01-23, then R1-R4. **Progress:** 01 done for launch-relevant facts (employer establishments, QuickBooks Desktop and App Partner Program, 1099 threshold, FY 2026 H-2B supplemental visas); its remaining markers concern California, Nevada, New York and Canadian rules outside the launch region. 08 partly done: 1099-K threshold, Stripe webhook retry window, US dispute counter fee, instant payout pricing and ACH unauthorized returns resolved.

## B. Evidence gaps

- [ ] **B1 Owner quotes.** Reddit (r/landscaping, r/lawncare) and LawnSite quotations behind the ranked pain points ([01](01-market-landscape.md) item E15, [13](13-operations-inventory-equipment.md), [15](15-team-hr-payroll.md), [22](22-business-model-pricing-gtm.md)). **Progress:** web search does not surface Reddit or LawnSite threads; two owner quotes from the Jobber Community (QuickBooks sync) and one secondhand Aspire quote added under 01 section 6.2. Direct Reddit and LawnSite quotes need manual collection or API access.
- [ ] **B2 Competitor matrix.** About 29% of competitor cells in [01](01-market-landscape.md) section 4 are still "?".
- [ ] **B3 Competitor capability gaps** flagged by reviewers: payments ([08](08-payments-stripe.md): ServiceTitan, SingleOps, Arborgold, Yardbook, Copilot CRM, SynkedUP), inventory ([13](13-operations-inventory-equipment.md)), HR and payroll ([15](15-team-hr-payroll.md)), marketing ([16](16-marketing-growth-communications.md)), UX claims such as command palettes and Spanish crew UI ([21](21-ux-design-system-sitemaps.md)).

## C. Product questions reviewers raised (for the founder)

- **C1 Pay-as-you-grow fee on ACH.** The opt-in plan charges 0.5% capped at $10 per payment ([22](22-business-model-pricing-gtm.md) section 5.1.2; [08](08-payments-stripe.md) option B), so a $2,000 ACH payment pays Rootline $10 while Stripe's own ACH fee caps at $5. A lower ACH cap is one option ([22](22-business-model-pricing-gtm.md) open question 2).
- **C2 Gross-margin floor.** The 35% default may be too strict for maintenance and budget-priced work ([03](03-crm-sales-estimating-proposals.md) open question 13).
- **C3 Payroll integration order.** Gusto API at MVP, or file exports first as [R4](research/R4-industry-payments-accounting.md) suggests ([15](15-team-hr-payroll.md) PAY-03).
- **C4 Onboarding cost.** Count it as acquisition cost or cost of revenue ([22](22-business-model-pricing-gtm.md) open question 20).
- **C5 Design assistant for homeowners.** The walkthrough shows the design assistant inside the homeowner visualizer as a [V2] proposal; the spec gives the assistant to designers only ([11](11-ai-design-mockups.md)).
- **C6 Doc length.** Module docs run 30,000-45,000 words. An optional editorial pass could split each into a core spec and appendices.
- **C7 Pesticide registry notices in the MVP.** Michigan and Wisconsin, two of the five launch states, run notification registries, but registry notice is tagged [V1] in [14](14-service-line-modules.md) section 4.1.5 (posting is [MVP]). Pull registry notice into the MVP, or leave Michigan and Wisconsin Companies to handle it outside Rootline at first? Found in verification item A6.

## D. Done in the salvage pass

- [x] The doc checks and the walkthrough's source moved from the session scratchpad into [tools/](../tools/), so they survive the session.
- [x] [05](05-field-crew-mobile-app.md) now uses press-and-hold for irreversible crew actions, matching [21](21-ux-design-system-sitemaps.md) and OD-39.
- [x] The estimator is Sam Kowalski on every concept screen (the office screens said Jose Ramirez).
- [x] Dropped as already resolved: links to docs that didn't exist yet, cross-doc conflicts fixed in the consistency passes, crew and office app-lock timing (consistent: 30 and 15 minutes), and `invoice.issued` (event) versus `invoice.send` (permission).
