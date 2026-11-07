# R4 - Industry economics, payments and accounting landscape

> Raw research for Rootline's money stack and its market thesis. It covers three areas. **(A)** The economics of North American landscape companies: market size and firm counts, size distribution, revenue mix, seasonality, margins, labor and H-2B, pricing models, technology adoption, owner pain points and what residential and commercial clients now expect. **(B)** Payments: how Stripe Connect is configured today (controller properties and Accounts v2 rather than "account types"), how SaaS platforms let customers bring their own Stripe account, charge types and application fees, list pricing for cards, ACH, Terminal and Tap to Pay, ACH and Canadian PAD rules, surcharging law, consumer financing for home improvement, and how field-service vendors make money on payments. **(C)** Accounting: the QuickBooks Online, QuickBooks Desktop (Web Connector) and Xero APIs, Intuit's pricing and partner-program changes, double-entry ledger architecture patterns (immutable journals, Modern Treasury Ledgers, TigerBeetle, Formance), landscaping-specific accounting (job costing, WIP, overhead recovery, deferred revenue for prepaid seasonal contracts, sales tax) and payroll integration options (Gusto, Gusto Embedded, ADP, Check). It ends with concrete lessons for Rootline.

| Field | Value |
|---|---|
| Report | R4 - Industry economics, payments and accounting landscape |
| Date | 2026-11-07 |
| Status | Research input, not a spec. Every material fact carries an evidence tag (section 0). |
| Primary consumers | [07 Invoicing](../07-invoicing-billing-contracts.md), [08 Payments](../08-payments-stripe.md), [09 Accounting](../09-accounting-ledger-integrations.md), [15 Team and payroll](../15-team-hr-payroll.md), [18 Reporting](../18-reporting-analytics.md), [20 Architecture](../20-architecture-security.md), [22 Pricing and GTM](../22-business-model-pricing-gtm.md), [24 Roadmap](../24-roadmap-feature-catalog.md), [01 Market landscape](../01-market-landscape.md) |
| Sibling reports | [R1 Field-service platforms](R1-field-service-platforms.md), [R2 Landscape-specific platforms](R2-landscape-specific-platforms.md), [R3 Design, AI and plant data](R3-design-ai-plant-data.md) |

---

## Contents

- [0. How to read this report: evidence levels and limitations](#0-how-to-read-this-report-evidence-levels-and-limitations)
- [1. Executive summary](#1-executive-summary)
- [Part A. Landscaping industry economics](#part-a-landscaping-industry-economics)
  - [2. Market size and structure](#2-market-size-and-structure)
  - [3. Revenue mix, seasonality and cash flow](#3-revenue-mix-seasonality-and-cash-flow)
  - [4. Margins and cost structure](#4-margins-and-cost-structure)
  - [5. Labor, wages and the H-2B program](#5-labor-wages-and-the-h-2b-program)
  - [6. Pricing models in the field](#6-pricing-models-in-the-field)
  - [7. Technology adoption](#7-technology-adoption)
  - [8. Owner pain points](#8-owner-pain-points)
  - [9. What clients expect: residential and commercial](#9-what-clients-expect-residential-and-commercial)
- [Part B. Payments](#part-b-payments)
  - [10. Stripe Connect today: from account types to controller properties and Accounts v2](#10-stripe-connect-today-from-account-types-to-controller-properties-and-accounts-v2)
  - [11. Charge types and application fees](#11-charge-types-and-application-fees)
  - [12. How SaaS platforms let customers bring their own Stripe](#12-how-saas-platforms-let-customers-bring-their-own-stripe)
  - [13. Stripe pricing reference](#13-stripe-pricing-reference)
  - [14. Bank payments: ACH, Financial Connections, Nacha and Canadian PAD](#14-bank-payments-ach-financial-connections-nacha-and-canadian-pad)
  - [15. Surcharging rules](#15-surcharging-rules)
  - [16. Consumer financing for home improvement](#16-consumer-financing-for-home-improvement)
  - [17. How competitors monetize payments](#17-how-competitors-monetize-payments)
  - [18. The value of embedded payments to field-service vendors](#18-the-value-of-embedded-payments-to-field-service-vendors)
  - [19. Payments compliance notes](#19-payments-compliance-notes)
- [Part C. Accounting](#part-c-accounting)
  - [20. QuickBooks Online API](#20-quickbooks-online-api)
  - [21. QuickBooks Desktop and the Web Connector](#21-quickbooks-desktop-and-the-web-connector)
  - [22. Xero API](#22-xero-api)
  - [23. Intuit pricing changes and their effect on small businesses](#23-intuit-pricing-changes-and-their-effect-on-small-businesses)
  - [24. Unified accounting APIs and bank feeds](#24-unified-accounting-apis-and-bank-feeds)
  - [25. Double-entry ledger architecture patterns](#25-double-entry-ledger-architecture-patterns)
  - [26. Landscaping-specific accounting](#26-landscaping-specific-accounting)
  - [27. Payroll integration options](#27-payroll-integration-options)
- [28. Lessons for Rootline](#28-lessons-for-rootline)
- [29. Beyond the brief](#29-beyond-the-brief)
- [30. Open questions and verification checklist](#30-open-questions-and-verification-checklist)
- [Sources](#sources)

---

## 0. How to read this report: evidence levels and limitations

Money facts age fast. Stripe has renamed its connected-account model twice in three years, Intuit has re-priced QuickBooks every year since 2022, and state surcharging law changed in at least three states in 2025-2026. This report is therefore explicit about how well each statement is supported.

| Tag | Meaning | How to use it |
|---|---|---|
| **[S]** | Sourced in this research run from a primary or credible source (vendor docs, help centers, regulators, trade press, review sites). Linked inline. Most [S] links were retrieved by sibling agents during this run and are re-cited here (see limitations). | Safe to quote with the link. Prices and rules still carry "as of Nov 2026, verify". |
| **[S3P]** | Sourced in this run, but only from third-party aggregators, affiliate pricing sites or competitor-written comparisons. | Directional only. Quote ranges and say "verify". |
| **[B]** | Analyst background knowledge of public documentation, filings, trade press and regulation up to mid-2026, **not re-verified in this run**. | A hypothesis to verify before it appears in investor material, a contract or code. Every [B] number is listed in the verification checklist (section 30). |
| **[E]** | Analyst estimate, inference or worked illustration. | Labeled as an estimate; reasoning shown. Never quote as a statistic. |

**Research limitations (read this first).**

- This report started after the run-wide web-search budget (200 searches shared by every agent in the run) had been used up. **All of this report's own search requests were refused**, and direct fetches to `stripe.com` and `docs.stripe.com` failed DNS resolution under the session's network allowlist. Per the run's rules, no workaround (proxies, readers, curl to search engines) was attempted.
- Sibling agents in the same run had already retrieved many relevant primary sources: Stripe Connect docs (controller properties, typeless Connect, Accounts v2, OAuth, application fees, direct-charge fee behavior, platform pricing tools), competitor payments pages (Jobber, Housecall Pro, LMN, Aspire, Service Autopilot), surcharging law trackers and network rules, Jobber's QuickBooks Online integration docs, the Wilson 360 benchmark, H-2B and wage-hour regulations, SIMA snow documentation guidance and sales-tax material. This report **consolidates that evidence** and re-cites the exact links; it did not reopen those pages, so a second pass should spot-check them.
- Everything else (QuickBooks and Xero API limits, Intuit and Xero partner-program pricing, ledger products, payroll APIs, Census and BLS counts, consumer financing terms) is tagged [B] and collected in the verification checklist. Where the analyst is unsure, the report gives a range or says "not verified" rather than a precise-looking number.
- No statistic in this report was invented. Vendor-reported numbers are labeled "vendor claim"; survey results run by vendors are labeled "vendor-run survey".

---

## 1. Executive summary

1. **The market is huge, fragmented and mostly tiny firms.** Public summaries put annual US landscaping-services revenue in roughly the $150-$200 billion range, spread across several hundred thousand businesses, most of them nonemployers [B, verify exact figures against IBISWorld and Census]. Employer firms are dominated by companies with fewer than 10 employees; the 5-49 employee band that Rootline targets ([22](../22-business-model-pricing-gtm.md) segment S2-S3) is a minority by count but carries a large share of revenue and software spend [E].
2. **Margins are thin and labor-driven.** The Wilson 360 2024 benchmark of $3M-$54M firms reported gross margin near 53% of net revenue and burdened direct labor near 43% ([Lawn & Landscape](https://www.lawnandlandscape.com/article/wilson-360-2024-landscape-industry-benchmark)) [S]. Net profit in the high single digits to low teens is the common rule of thumb [B]. A one-point improvement in labor efficiency or price realization is worth more than any software subscription; this is what Rootline must sell.
3. **Labor is the binding constraint.** Landscaping is commonly reported as the largest user of H-2B visas, whose statutory cap is 66,000 per fiscal year split across two halves ([USCIS](https://www.uscis.gov/working-in-the-united-states/temporary-workers/h-2b-non-agricultural-workers/cap-count-for-h-2b-nonimmigrants)) [S]. About 44.5% of US landscaping and groundskeeping workers were Hispanic in 2024 ([Data USA](https://datausa.io/profile/soc/landscaping-and-groundskeeping-workers)) [S]. Spanish-first crew tools and seasonal workforce features are not optional.
4. **Seasonality shapes everything, including money.** Northern firms earn most revenue April-November and fund spring payroll from winter cash, snow contracts or credit lines [B/E]. Prepaid programs, level billing and seasonal snow contracts create deferred revenue and contract assets that today's FSM tools leave for the bookkeeper to reconstruct [S via [07](../07-invoicing-billing-contracts.md), [14](../14-service-line-modules.md)].
5. **Stripe no longer thinks in "Standard/Express/Custom".** Connected accounts are configured through controller properties (fees payer, losses owner, requirement collection, dashboard type), and the newer Accounts v2 API puts `merchant`, `customer` and `recipient` configurations on a single Account object ([Stripe](https://docs.stripe.com/connect/migrate-to-controller-properties), [Stripe](https://docs.stripe.com/connect/accounts-v2)) [S]. The "bring your own Stripe" configuration Rootline wants is the Standard-equivalent: full Dashboard, Stripe-owned losses, Stripe-collected requirements, account-paid fees.
6. **Direct charges plus optional application fees are the correct charge type for BYO Stripe.** On direct charges to Standard-style accounts the connected account pays Stripe's fees and Stripe charges no Connect fees to either side ([Stripe](https://docs.stripe.com/connect/direct-charges-fee-payer-behavior)) [S]. A platform may add an `application_fee_amount` that sits on top of Stripe's fee ([Stripe](https://docs.stripe.com/connect/application-fees)) [S]. Existing accounts connect via OAuth; new accounts via Account Links or embedded onboarding ([Stripe](https://docs.stripe.com/connect/oauth)) [S].
7. **Payments are the profit center of the incumbents, and the source of their worst reviews.** Jobber Payments runs on Stripe and charges 1% for instant payouts ([Jobber](https://help.getjobber.com/en/articles/instant-payouts/)) [S]; Housecall Pro sells 1% Instapay ([Housecall Pro](https://www.housecallpro.com/features/payment-processing/)) [S]; Service Autopilot users say they "no longer have a choice of processor" after the Xplor acquisition ([GetApp](https://www.getapp.com/operations-management-software/a/service-autopilot/reviews/)) [S]; a payments consultant says LMN Pay accounts are "NOT Stripe accounts you control" ([Merchant Cost Consulting](https://merchantcostconsulting.com/lower-credit-card-processing-fees/lmn-pay-stripe-migration/)) [S, single third-party opinion]. Portability is a sales weapon.
8. **ACH is the margin lever for landscapers.** Stripe ACH Direct Debit is reported at 0.8% capped at $5 versus 2.9% + $0.30 for online cards ([Dodo Payments](https://dodopayments.com/blogs/stripe-ach-fees/), [Superdupr](https://superdupr.com/blog/stripe-fees)) [S3P]. On a $4,800 prepaid lawn program, that is $5 instead of about $139. Steering autopay and large invoices to ACH (and PAD in Canada) saves a mid-size Company more than Rootline's subscription costs [E].
9. **Surcharging is legal in most places but a minefield.** Visa caps US surcharges at 3% (or the merchant's cost) ([AFS Law](https://www.afslaw.com/perspectives/alerts/visa-reduces-its-merchant-surcharge-cap-3-effective-april-15-2023-merchants)) [S]; Canada caps at 2.4% ([Visa Canada](https://www.visa.ca/content/dam/VCOM/regional/na/canada/Support/Documents/surcharging-faq-businesses-en.pdf)) [S]; debit and prepaid cards cannot be surcharged; Connecticut, Massachusetts and Maine ban surcharges, and Colorado and Oklahoma cap them ([LawPay](https://www.lawpay.com/about/blog/credit-card-surcharge-rules/), [Rundoo](https://rundoo.ai/insights/credit-card-surcharge-laws-by-state/)) [S]. Contractors ask vendor forums how to add card fees ([Jobber Community](https://community.getjobber.com/discussions/invoicing-getting-paid/advice-adding-the-credit-card-service-fee-to-invoices/1228/replies/8669)) [S] and get no compliance help.
10. **Consumer financing is table stakes for installs above about $3,000.** Housecall Pro offers Wisetack with terms extended to 84 and 120 months in February 2026, not available through HCP in Canada ([HCP](https://www.housecallpro.com/resources/february-2026-product-updates/), [HCP Help](https://help.housecallpro.com/en/articles/3836042-wisetack-consumer-financing-overview)) [S]. Rootline should integrate financing as a referral/technology provider, never as lender.
11. **Every FSM outsources the books to Intuit, and the sync is the pain.** Jobber's current QuickBooks Online sync is one-way, does not sync paid status back, posts only to parent customers, does not support Desktop, and blocks all of a client's invoices when one client record errors ([Jobber](https://help.getjobber.com/es/articles/quickbooks-integration-faqs/)) [S]. Meanwhile Intuit has raised QuickBooks Online prices repeatedly, stopped selling several Desktop editions to new US subscribers after 2024, and in 2025 introduced an App Partner Program that meters some API reads [B, verify]. A built-in ledger that a CPA trusts is both a differentiator and a hedge against Intuit platform risk.
12. **Ledger engineering is a solved pattern, not a research project.** Immutable, balanced, append-only journals with idempotent posting, reversal-only corrections, period locks and control-account subledgers are well documented (Modern Treasury Ledgers, Formance, TigerBeetle, Stripe's internal Ledger) [B]. For Rootline's volume (thousands of tenants, at most millions of entries per tenant per year), a Postgres-native ledger with those invariants is the right call; a specialized engine like TigerBeetle is overkill for a GL that needs rich dimensions and reporting [E].
13. **Landscaping accounting has five non-generic needs:** burdened labor and equipment job costing, overhead recovery tracking (MORS/FLH/SORS, popularized by LMN ([LMN help](https://intercom.help/lmn/en/articles/15939065-how-lmn-calculates-overhead-labor-burden-and-profit-in-estimates)) [S]), WIP with over/under billings for installs, deferred revenue for prepaid and level-billed seasonal programs (including snow) ([Beancount](https://beancount.io/blog/2026/06/03/snow-removal-plowing-ice-management-contractor-bookkeeping-asc-606-seasonal-deferred-revenue-per-push-trigger-section-179-plow-truck-salt-spreader-sima-asca-revenue-per-truck-hour-kpi-guide)) [S], and per-line sales tax where maintenance, capital improvements and goods are taxed differently by state ([07](../07-invoicing-billing-contracts.md)) [S/B].
14. **Payroll should be integrated first and embedded later.** Most target Companies already run Gusto, ADP, Paychex or QuickBooks Payroll [B]. Embedded payroll APIs (Gusto Embedded, Check) let a vertical platform offer payroll without becoming a payroll tax filer [B]; that is a [V2] revenue line once time capture and job costing are trusted.

---

# Part A. Landscaping industry economics

## 2. Market size and structure

### 2.1 Headline figures

| Metric | Figure | Evidence | Notes |
|---|---|---|---|
| US landscaping services industry revenue | Roughly $150-$200 billion per year in recent public summaries (2024-2025) | [B] IBISWorld public summary pages for "Landscaping Services in the US"; exact figure not verified in this run | IBISWorld counts nonemployers and includes lawn care, tree and some installation work; definitions differ from Census. Do not quote a single number until verified. |
| US businesses (all, incl. nonemployers) | Several hundred thousand | [B] IBISWorld and Census Nonemployer Statistics for NAICS 561730 | The large majority are owner-operators with no payroll (mow-and-go, part-time, seasonal). |
| US employer establishments, NAICS 561730 | On the order of 100,000-130,000 | [B] Census County Business Patterns, verify latest year | The official base for Rootline's TAM. [22](../22-business-model-pricing-gtm.md) section 7 already flags this pull as required. |
| US landscaping and groundskeeping workers (SOC 37-3011) | Roughly 0.9 million wage-and-salary jobs; median wage in the high teens of dollars per hour | [B] BLS OEWS May 2023/2024 releases | Excludes owners and many seasonal or informal workers. |
| Share of landscaping and groundskeeping workers who are Hispanic | About 44.5% (2024) | [S] [Data USA](https://datausa.io/profile/soc/landscaping-and-groundskeeping-workers) | Drives Spanish-first crew UX ([05](../05-field-crew-mobile-app.md), [21](../21-ux-design-system-sitemaps.md)). |
| Canada, NAICS 56173 Landscaping Services | Financial performance benchmarks published by ISED/Statistics Canada | [S] [ISED financial performance data](https://ised-isde.canada.ca/app/ixb/cis/performance/56173) | Business counts by employee band are available in Statistics Canada's Canadian Business Counts tables (not retrieved). Analyst expectation: tens of thousands of establishments, overwhelmingly micro firms [E]. |

> **Analyst note.** The precise top-line number matters less than the shape. Rootline's revenue model ([22](../22-business-model-pricing-gtm.md)) depends on the count of employer firms with 5-49 peak-season employees in the US and Canada, which can be pulled directly from CBP and Statistics Canada by employee band. Until that pull is done, every TAM figure in the doc set is an estimate.

### 2.2 Size distribution (shape, not verified counts)

Census CBP data for small-service NAICS codes typically show a steep pyramid. The illustrative distribution below is an **estimate of the shape** for NAICS 561730 employer establishments, to be replaced by the real CBP pull.

| Employee band (employer establishments) | Illustrative share of establishments [E] | Typical revenue band [E] | Typical software today [B] | Rootline segment ([22](../22-business-model-pricing-gtm.md)) |
|---|---|---|---|---|
| Nonemployer (owner only) | Not in CBP; the majority of all businesses | < $100k | Paper, free apps, Yardbook, QuickBooks Self-Employed or Solopreneur | Outside ICP; self-serve Starter at most |
| 1-4 | ~55-65% | $100k-$500k | Jobber Core/Connect, Yardbook, Housecall Pro Basic, spreadsheets | S1, self-serve |
| 5-9 | ~15-20% | $400k-$1M | Jobber Grow, Service Autopilot, Copilot CRM, QuickBooks Online | S2/S3 (lower end) |
| 10-19 | ~10-12% | $0.8M-$2.5M | LMN, SynkedUP, SingleOps, Jobber Grow/Plus, QBO Plus | **S2/S3 core** |
| 20-49 | ~5-8% | $2M-$6M | LMN Professional, SingleOps, Aspire (lower end), QBO Plus/Advanced or QuickBooks Desktop | **S2/S3/S4** |
| 50-99 | ~1-2% | $5M-$15M | Aspire, LMN Enterprise, Real Green (lawn), BOSS LM | S4 |
| 100+ | < 1% | $10M-$500M+ | Aspire, ServiceTitan, custom ERP, Sage Intacct | S4/S7 (enterprise) |

**Reading the shape.** The 5-49 band is perhaps a quarter to a third of employer establishments by count [E] but buys the most software per firm relative to its sophistication: it has an office manager, a bookkeeper or outside CPA, multiple crews, and enough install work to need design and estimating. Firms above 50 employees are few but carry a disproportionate share of revenue (the national players such as BrightView, which reports billions in annual revenue in its public filings [B], sit at the extreme).

### 2.3 Consolidation and private equity

Landscape maintenance has been a private-equity roll-up target for a decade: recurring commercial contracts, fragmented ownership and route density economics make it attractive [B]. Roll-ups bring standardized ERP (often Aspire), multi-entity accounting and branch-level P&L expectations [B]. Two implications for Rootline: (1) the 20-100 employee firm acquired by a platform company will be forced off whatever tool it uses, which is a churn risk for Rootline in S4; (2) multi-entity books, consolidation and branch dimensions in the ledger ([09](../09-accounting-ledger-integrations.md)) become a sales requirement at the top of the market [E].

Software vendors have consolidated in parallel: ServiceTitan bought Aspire in 2021 alongside a $200M raise at a $9.5B valuation ([TechCrunch](https://techcrunch.com/2021/06/30/servicetitan-acquires-aspire-to-move-into-landscaping-raises-200m-at-a-9-5b-valuation)) [S]; LMN and SingleOps merged under Granum in November 2024 ([R2](R2-landscape-specific-platforms.md)) [S]; Xplor owns Service Autopilot [S via reviewers]; WorkWave owns Real Green [B]. Each camp is pushing embedded payments, which is where most post-acquisition complaints come from (section 17).

---

## 3. Revenue mix, seasonality and cash flow

### 3.1 Service lines and typical mixes

No single verified survey mix was retrievable in this run. Lawn & Landscape's annual "State of the Industry" reader survey and NALP's industry overviews publish service-mix and revenue figures each year [B]; they should be pulled into [01](../01-market-landscape.md). The table below is an **analyst estimate of typical mixes by business model**, consistent with the reference Companies used across the doc set ([02](../02-personas-roles-permissions.md)).

| Business model | Maintenance (mowing, pruning, beds, cleanups) | Enhancements (mulch, seasonal color, small plantings) | Design-build / install | Lawn and plant health care (fertilizer, weed control, PHC) | Irrigation and lighting service | Snow and ice | Evidence |
|---|---|---|---|---|---|---|---|
| Residential mow-and-maintain (S1/S3) | 60-80% | 10-20% | 0-10% | 0-15% | 0-5% | 0-10% (north) | [E] |
| Residential design-build-maintain (S2, beachhead) | 25-40% | 10-15% | 40-60% | 0-10% | 5-10% | 0-10% (north) | [E] |
| Lawn treatment specialist | 0-10% | 0-5% | 0% | 75-95% | 0-10% | 0-5% | [E] |
| Commercial maintenance (S4) | 50-65% | 15-25% (enhancement sales are the profit engine) | 0-15% | 5-10% | 5-10% | 10-30% (north) | [E] |
| Snow-heavy northern commercial | 30-40% | 10-15% | 0-10% | 0-5% | 0-5% | 30-50% | [E] |

**Why the mix matters to money design.** Each line bills differently ([07](../07-invoicing-billing-contracts.md), [14](../14-service-line-modules.md)): maintenance as per-visit, monthly flat or level-billed contracts; enhancements as one-off work orders; installs as deposits plus progress or milestone invoices; lawn programs as per-application or prepaid seasons; snow as per push, per event or seasonal with caps. The ledger must recognize each correctly (section 26).

### 3.2 The seasonal curve

For a northern US company (Ohio, Ontario, Minnesota), a typical monthly revenue profile looks like the estimate below [E]. Southern companies (Texas, Florida, the Carolinas) have a flatter curve with a summer peak and no snow.

```text
Monthly revenue, northern design-build-maintain Company with snow (illustrative, % of annual)
Jan  ███ 4%        (snow, winter pruning, design work for spring)
Feb  ███ 4%        (snow, pre-sold installs signing, deposits arrive)
Mar  █████ 6%      (spring cleanups start late month, irrigation start-ups)
Apr  █████████ 10% (cleanups, first mows, mulch season, installs begin)
May  ███████████ 12%
Jun  ███████████ 11%
Jul  ██████████ 10%
Aug  ██████████ 10%
Sep  █████████ 10% (aeration/overseeding, fall installs)
Oct  ████████ 9%   (fall cleanups, irrigation winterizations, bulbs)
Nov  ██████ 7%     (leaf cleanups, holiday lighting, snow staking)
Dec  ████ 5%       (holiday lighting, snow)
```

**Cash-flow consequences [E]:**

- **The spring cash trough.** Payroll and materials ramp in March-April (rehires, H-2B arrival costs, mulch and plant purchases, equipment down payments) while receivables lag 30-45 days. Owners fund the gap with winter savings, prepay programs, snow cash or a line of credit.
- **Prepay programs are working capital.** Lawn-care firms commonly offer a discount for prepaying the season (Weed Man publicizes prepay and referral discounts ([Weed Man](https://weedman.com/blog/prepay-and-referral-discounts)) [S]). The cash arrives in February-April; the revenue is earned through November. That is deferred revenue (section 26.4).
- **Level billing smooths client payments, not revenue.** A $3,600 season of weekly mowing billed $300/month for 12 months creates a contract asset early in the season and unwinds over winter ([LawnPro level billing](https://lawnprosoftware.com/features/level-billing)) [S].
- **Snow is lumpy.** Per-push revenue arrives in storm bursts; seasonal contracts arrive evenly but carry event risk; both need subcontractor payables posted per event ([14](../14-service-line-modules.md)).

### 3.3 Implications for payments and books

| Seasonal fact | Product implication | Owner doc |
|---|---|---|
| 60-75% of annual card and ACH volume lands April-October [E] | Payments health, webhook capacity and support staffing planned for spring peak; Stripe payout reconciliation must keep up with 3-5x winter volume | [08](../08-payments-stripe.md), [20](../20-architecture-security.md) |
| Prepaid seasons collected Feb-Apr | Deferred-revenue posting and per-visit recognition must be automatic | [07](../07-invoicing-billing-contracts.md), [09](../09-accounting-ledger-integrations.md) |
| Winter headcount roughly a third to two-fifths of peak (illustrative, [02](../02-personas-roles-permissions.md)) | Payroll and seat billing that follow headcount; FUTA/SUTA wage bases front-load spring burden | [15](../15-team-hr-payroll.md), [22](../22-business-model-pricing-gtm.md) |
| Spring cash trough | Cash forecast, deposits on installs, ACH incentives for prepay, financing for large installs | [18](../18-reporting-analytics.md), [08](../08-payments-stripe.md) |

---

## 4. Margins and cost structure

### 4.1 Benchmarks that were retrievable

| Benchmark | Figure | Population | Evidence |
|---|---|---|---|
| Gross margin | About 53% of net revenue | Wilson 360 2024 benchmark, firms with $3M-$54M revenue | [S] [Lawn & Landscape](https://www.lawnandlandscape.com/article/wilson-360-2024-landscape-industry-benchmark) |
| Burdened direct labor | About 43% of net revenue | Same | [S] same |
| Labor as % of revenue (unburdened, vendor blog) | 25-30% | Not stated; definitions differ | [S] [Aspire blog](https://www.youraspire.com/blog/landscaping-labor-percentage-of-revenue) |
| Revenue per man-hour / sales per man-hour | Quoted both as billing rate and output rate; definitions inconsistent | Trade press | [S] [Lawn & Landscape](https://www.lawnandlandscape.com/article/ll0314-business-useful-benchmarks), [SynkedUP](https://synkedup.com/average-man-hour-rate-for-landscape-jobs/) |
| Overhead recovery | "If you don't recoup overhead costs, there's not even $1 of profit in a job" | Trade press | [S] [Total Landscape Care](https://www.totallandscapecare.com/business/article/15034644/how-to-properly-cost-a-job) |

The definitional mess (gross vs net revenue, burdened vs unburdened labor) is itself a finding: [18](../18-reporting-analytics.md) responds with a governed KPI Dictionary.

### 4.2 Net margin rule of thumb

Consultants and trade publications commonly describe net profit margins in the high single digits to low teens for typical firms, with top performers in the mid-to-high teens and many small firms near break-even once owner compensation is normalized [B, no single verified survey in this run]. Rootline's estimating defaults (target net profit 15% maintenance, 12% install, 18% enhancements, [03](../03-crm-sales-estimating-proposals.md)) are aspirational targets, not industry averages.

### 4.3 Illustrative P&L of a beachhead Company [E]

A $2.0M residential design-build-maintain Company in the Midwest with 22 peak employees (S2):

| Line | Amount | % of revenue | Notes |
|---|---|---|---|
| Revenue | $2,000,000 | 100% | 40% install, 35% maintenance, 12% enhancements, 8% snow, 5% irrigation/lighting service |
| Direct labor (burdened) | $760,000 | 38% | Wages plus payroll taxes, workers' comp (class code 0042 "landscape gardening" is commonly cited, verify), benefits, H-2B costs |
| Materials and plants | $380,000 | 19% | Pavers, stone, mulch by the cubic yard, nursery stock |
| Equipment and fuel (direct) | $120,000 | 6% | Internal equipment rates charged to jobs |
| Subcontractors | $90,000 | 4.5% | Concrete, electrical, snow subs |
| **Gross profit** | **$650,000** | **32.5%** | Lower than Wilson 360's 53% because Wilson reports on net revenue with different cost allocation; definitions matter |
| Overhead (office staff, rent, insurance, software, vehicles not on jobs, marketing) | $480,000 | 24% | Software stack today: about $1,000-$1,500/month per [R2](R2-landscape-specific-platforms.md) section 13 [E] |
| **Net operating profit** | **$170,000** | **8.5%** | Before owner add-backs and taxes |
| Card processing (if 60% collected by card at 2.9% + $0.30) | about $36,000 | 1.8% | Could fall to about $15,000 with ACH steering (section 13.4) |

The point of the illustration: card fees alone are about a fifth of this Company's net profit. Payment-method design is a margin feature.

---

## 5. Labor, wages and the H-2B program

### 5.1 Facts

| Fact | Evidence |
|---|---|
| H-2B statutory cap: 66,000 visas per fiscal year, 33,000 for each half (October-March and April-September starts) | [S] [USCIS cap count](https://www.uscis.gov/working-in-the-united-states/temporary-workers/h-2b-non-agricultural-workers/cap-count-for-h-2b-nonimmigrants) (verify current fiscal year) |
| Supplemental H-2B visas have been released in recent fiscal years by joint DHS/DOL rule, in recent years up to roughly 64,700 additional visas, partly reserved for returning workers and nationals of specific countries | [B] verify for FY2026 |
| Landscaping and groundskeeping is commonly reported as the largest single H-2B occupation | [S] via [15](../15-team-hr-payroll.md); [B] for the share (on the order of a third or more of certified positions, verify against DOL OFLC disclosure data) |
| H-2B employer obligations include paying at least the prevailing wage, a three-fourths hours guarantee, corresponding employment, reimbursement of inbound travel and visa costs, and 3-year record retention | [S] [eCFR 20 CFR 655 Subpart A](https://www.ecfr.gov/current/title-20/chapter-V/part-655/subpart-A), [DOL WHD](https://www.dol.gov/agencies/whd/immigration/h2b) |
| Federal OT on the regular rate (including nondiscretionary bonuses and production pay); California daily OT and meal/rest premiums | [S] via [15](../15-team-hr-payroll.md) ([DLSE](https://www.dir.ca.gov/dlse/faq_overtime.htm)) |
| Spanish-speaking share of the workforce is high (44.5% Hispanic in 2024) | [S] [Data USA](https://datausa.io/profile/soc/landscaping-and-groundskeeping-workers) |

### 5.2 What this means financially [E]

- **Labor cost is not just wages.** H-2B adds recruiting agent fees, visa and travel reimbursement, housing and transport. The three-fourths guarantee turns rainy weeks into a cost. Rootline's burden model ([15](../15-team-hr-payroll.md)) must carry these as burden components so job costing is honest.
- **Labor scarcity raises the value of productivity software.** If a Company cannot hire a fifth crew, the only growth lever is more revenue per man-hour: tighter routes, better estimates, fewer return trips, less office re-keying.
- **Seasonal payroll creates seasonal liabilities.** Accrued wages at month-end, PTO accrual reinstatement on rehire, state unemployment experience ratings driven by winter layoffs [B]. These belong in the ledger, not a spreadsheet.

---

## 6. Pricing models in the field

| Model | Typical use | Billing pattern | Accounting treatment (summary, section 26) | Evidence |
|---|---|---|---|---|
| Per visit / per cut | Residential mowing, small commercial | Invoice per visit or batch weekly/monthly | Revenue when visit completed | [S] Jobber batch invoicing ([Jobber Help](https://help.getjobber.com/hc/en-us/articles/115009542848)) |
| Monthly flat / level billing | Residential and commercial maintenance contracts | Equal installments over 8-12 months | Contract asset or liability vs per-visit or ratable recognition | [S] [LawnPro](https://lawnprosoftware.com/features/level-billing) |
| Seasonal prepay | Lawn treatment programs, mowing seasons | Single payment early season, discount 3-10% [B] | Deferred revenue released per application/visit | [S] [Weed Man](https://weedman.com/blog/prepay-and-referral-discounts) |
| Per application (program) | 5-step fertilizer/weed control, grub control, aeration | Invoice after each application | Revenue per application | [B] Real Green-style programs ([R2](R2-landscape-specific-platforms.md)) |
| Time and materials | Enhancements, irrigation repair, cleanups | Hours x rate + materials at markup | Revenue as performed | [B] |
| Fixed-price bid (unit-priced internally) | Installs: paver patios, walls, plantings | Deposit (often 30-50%), progress or milestone invoices, final | Deposits are liabilities; revenue over time (POC) or at completion | [S] deposit flows in [08](../08-payments-stripe.md); [B] deposit norms |
| Unit pricing | Mulch per cubic yard installed, sod per square foot, edging per linear foot | Quantity x unit rate | Revenue as performed | [E] consistent with [03](../03-crm-sales-estimating-proposals.md) |
| Snow per push / per event / seasonal / per inch | Commercial lots, HOAs, residential driveways | Per storm event or fixed monthly with caps and overages | Event revenue or ratable; caps and minimums create true-ups | [S] [Jobber Academy snow bidding](https://www.getjobber.com/academy/snow-removal/how-to-bid-snow-removal/), [Beancount](https://beancount.io/blog/2026/06/03/snow-removal-plowing-ice-management-contractor-bookkeeping-asc-606-seasonal-deferred-revenue-per-push-trigger-section-179-plow-truck-salt-spreader-sima-asca-revenue-per-truck-hour-kpi-guide) |
| Design fees | Design-build firms | Flat or credited against install | Separate performance obligation or credit; liability if creditable | [B] |
| Plant warranty | Installs (often 1 year on plants, conditional on irrigation) | Included in price | Accrued warranty cost (assurance-type) | [B] |
| Escalators | Multi-year commercial contracts | CPI-linked or fixed % at renewal | Not an accounting event until the new price applies | [S] CPI logic in [03](../03-crm-sales-estimating-proposals.md) |

---

## 7. Technology adoption

| Signal | Detail | Evidence |
|---|---|---|
| Embedded payments reach | Stripe describes Jobber's payments customer base as about 200,000 home service professionals | [S] [Stripe case study](https://www.casestudies.com/company/stripe/case-study/jobber-and-stripe-help-200k-home-service-professionals-save-on-payment-fees) (vendor claim) |
| AI belief vs use among commercial landscapers | 43% believe in AI; 15% use it daily, in Aspire's 2026 survey of 1,020 commercial landscape leaders | [S] [Aspire report via Finviz](https://finviz.com/news/401821/aspire-report-finds-commercial-landscapers-prioritizing-growth-as-businesses-navigate-operational-complexity) (vendor-run survey) |
| Bolt-on economy | Aspire customers buy separate tools for site audits (SiteDNA, SiteRecon), AP automation (Vergo), benchmarking (Wilson360), telematics (Motive) | [S] [R2](R2-landscape-specific-platforms.md) section 9 |
| Accounting | Every FSM and landscape vendor syncs to QuickBooks (Online or Desktop) or another external GL; none keeps books | [S] [R1](R1-field-service-platforms.md) section 14, [R2](R2-landscape-specific-platforms.md) section 12.6 |
| Long tail on paper | Many small operators still run on spreadsheets, QuickBooks invoices and paper route sheets | [B] [R2](R2-landscape-specific-platforms.md) |
| Software spend | A 12-person company buying estimating, measurement, design, QuickBooks, reviews and a website plausibly spends $1,000-$1,500/month | [E] [R2](R2-landscape-specific-platforms.md) section 13 |

**Interpretation [E].** Adoption is bimodal: owner-operators adopt cheap horizontal FSM apps (Jobber, Housecall Pro, Yardbook) for quoting, scheduling and getting paid; firms above about $3M adopt landscape ERPs (Aspire, LMN) for estimating discipline and job costing. The middle (10-40 employees, $1-6M) is the most under-served: too complex for horizontal apps, too small for Aspire's implementation, and still running design, books and payroll in separate tools. That is Rootline's beachhead ([22](../22-business-model-pricing-gtm.md)).

---

## 8. Owner pain points

Ranked by how often they appear in this run's evidence (reviews, help-center workarounds, trade press) and by financial impact. Evidence levels per row.

| # | Pain point | Evidence | Financial impact [E] | Rootline response |
|---|---|---|---|---|
| 1 | **Finding and keeping labor**, H-2B uncertainty | [S] H-2B cap and rules; [B] trade surveys consistently rank labor first | Lost revenue from crews not fielded; overtime premiums | [15](../15-team-hr-payroll.md) H-2B workspace, Spanish-first, retention signals |
| 2 | **Pricing for profit** (unrecovered overhead, guessed production rates) | [S] Total Landscape Care; LMN's budget method exists because of this | 2-5 points of net margin on mispriced installs | Budget-based estimating with overhead recovery tracking ([03](../03-crm-sales-estimating-proposals.md), [09](../09-accounting-ledger-integrations.md)) |
| 3 | **Tool sprawl and double entry** (FSM + QuickBooks + design + payroll + reviews + website) | [S] bolt-on economy; [E] stack cost | Office hours; sync errors; software spend | All-in-one with built-in ledger |
| 4 | **Accounting sync that breaks** | [S] Jobber QBO limits; Real Green "basically unusable" accounting ([Capterra](https://www.capterra.com/p/78106/Service-Assistant/reviews/?page=5)) | Bookkeeper hours; wrong AR; bad decisions | Native ledger, or quarantine-based sync ([09](../09-accounting-ledger-integrations.md)) |
| 5 | **Forced or non-portable payment processors** and rate creep | [S] Service Autopilot reviews; LMN Pay opinion | 0.3-1.0 points of processing cost; switching pain | BYO Stripe, zero markup default ([08](../08-payments-stripe.md)) |
| 6 | **Cash-flow seasonality** and slow collections | [B] | Credit-line interest; owner stress | Deposits, prepay, autopay, ACH incentives, cash forecast |
| 7 | **Implementation fees and long onboarding** | [S3P] LMN $797-$1,497 reported, Real Green $995 reported ([R2](R2-landscape-specific-platforms.md)) | Switching cost | Free migration concierge ([22](../22-business-model-pricing-gtm.md)) |
| 8 | **Rising costs**: fuel, insurance, equipment, materials | [B] | Margin compression | Price escalators, fuel surcharge lines, price realization KPI |
| 9 | **Compliance load** (pesticide records, wage-hour, heat, snow liability) | [S] [15](../15-team-hr-payroll.md), [14](../14-service-line-modules.md) | Fines, claims (snow slip-and-fall) | Evidence-grade records |
| 10 | **Client communication** (on-my-way, proof of service, approvals) | [S] [06](../06-customer-portal.md) | Callbacks, disputes | White-label portal, photo proof |
