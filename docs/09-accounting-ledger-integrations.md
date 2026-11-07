# 09 - Accounting: Built-in Double-Entry Ledger and Integrations

> Rootline keeps the books of a landscape company as a by-product of running the company. Every completed mowing visit, mulch delivery, paver patio milestone, snow push, Stripe payout, vendor bill, payroll run and depreciating zero-turn mower becomes a balanced, immutable journal entry in a real double-entry general ledger, posted automatically from domain events by versioned posting rules and tagged with the dimensions a landscaper actually manages by (division, branch, job, phase, cost type, property, crew). On top of that ledger sit the subledgers (AR, AP with 1099s, inventory, fixed assets, loans, payroll imports), bank and card feeds with AI categorization, landscape-grade job costing (estimated vs actual by phase and cost type, burdened labor, equipment recovery), a WIP schedule with percentage-of-completion and over/under billing for installs, deferred revenue for prepaid programs, LMN-style overhead recovery tracking against the Company Budget, the full statement set, a period-close checklist, an Accountant Hub for outside CPAs, and multi-entity consolidation. Companies that want QuickBooks Online, QuickBooks Desktop, Xero or (later) Sage Intacct keep them, through a sync engine that is explicit about which system is the book of record, maps every account, class and tax code, quarantines failures per record and never double-posts. This module is why a landscaper can cancel two subscriptions, why a CPA can close a 20-person company in under four hours, and why an owner finally sees whether the irrigation division made money in June.

**Document status:** Design proposal v1.0 (2026-11-07). Owner: Money domain team (`ledger` and `integrations` modules). Related docs: [Personas and permissions](02-personas-roles-permissions.md), [CRM, estimating and proposals](03-crm-sales-estimating-proposals.md), [Scheduling](04-scheduling-dispatch-routing.md), [Crew app](05-field-crew-mobile-app.md), [Customer portal](06-customer-portal.md), [Invoicing and billing](07-invoicing-billing-contracts.md), [Payments (BYO Stripe)](08-payments-stripe.md), [Operations, inventory and equipment](13-operations-inventory-equipment.md), [Service lines](14-service-line-modules.md), [Team, HR and payroll](15-team-hr-payroll.md), [AI copilot and automation](17-ai-copilot-automation.md), [Reporting and analytics](18-reporting-analytics.md), [Platform admin](19-platform-admin-portal.md), [Architecture and security](20-architecture-security.md), [UX and sitemaps](21-ux-design-system-sitemaps.md), [Pricing and GTM](22-business-model-pricing-gtm.md), [Moonshots](23-innovation-moonshots.md), [Roadmap](24-roadmap-feature-catalog.md).

**Scope boundary.** This doc owns: the ledger engine and its accounting semantics, the Chart of Accounts and dimensions, the posting-rule registry (including the canonical account codes that [07](07-invoicing-billing-contracts.md) and [08](08-payments-stripe.md) reference as "final codes defined in 09"), AP and bill pay, 1099/T5018, the inventory, fixed asset, loan and payroll subledgers on the accounting side, banking and reconciliation, job costing, WIP and revenue recognition, budgets and overhead recovery tracking, financial statements, period close, the Accountant Hub workflows, year-end, multi-entity consolidation, accounting integrations and QuickBooks migration. It does **not** own: invoice generation, billing schedules, sales tax calculation, collections ([07](07-invoicing-billing-contracts.md)); Stripe money movement and dispute handling ([08](08-payments-stripe.md)); POs, receiving, stock movements and equipment operations ([13](13-operations-inventory-equipment.md)); payroll calculation and time capture ([15](15-team-hr-payroll.md), [05](05-field-crew-mobile-app.md)); management dashboards, KPI definitions and the semantic layer ([18](18-reporting-analytics.md)); the technical invariants L1-L12 and the connector framework ([20](20-architecture-security.md)). Where those meet the ledger we summarize and link.

## Contents

- [1. Goals and non-goals](#1-goals-and-non-goals)
- [2. Market research](#2-market-research)
- [3. Personas and jobs-to-be-done](#3-personas-and-jobs-to-be-done)
- [4. Feature specification](#4-feature-specification)
  - [4.1 Ledger engine](#41-ledger-engine)
  - [4.2 Chart of Accounts and dimensions](#42-chart-of-accounts-and-dimensions)
  - [4.3 Automatic posting rules](#43-automatic-posting-rules)
  - [4.4 Worked journal entries: one month at Reyes Outdoor Living](#44-worked-journal-entries-one-month-at-reyes-outdoor-living)
  - [4.5 Subledgers](#45-subledgers)
  - [4.6 Banking, receipts and reconciliation](#46-banking-receipts-and-reconciliation)
  - [4.7 Job costing](#47-job-costing)
  - [4.8 Revenue recognition, WIP and deferred revenue](#48-revenue-recognition-wip-and-deferred-revenue)
  - [4.9 Budgets, overhead recovery and forecasts](#49-budgets-overhead-recovery-and-forecasts)
  - [4.10 Financial reports](#410-financial-reports)
  - [4.11 Period close](#411-period-close)
  - [4.12 Accountant Hub and the external CPA](#412-accountant-hub-and-the-external-cpa)
  - [4.13 Audit trail and evidence](#413-audit-trail-and-evidence)
  - [4.14 Year-end](#414-year-end)
  - [4.15 Multi-entity books and consolidation](#415-multi-entity-books-and-consolidation)
  - [4.16 Sales tax, use tax and GST/HST on the ledger side](#416-sales-tax-use-tax-and-gsthst-on-the-ledger-side)
  - [4.17 Accounting integrations](#417-accounting-integrations)
  - [4.18 Migration from QuickBooks and opening balances](#418-migration-from-quickbooks-and-opening-balances)
- [5. Key user flows](#5-key-user-flows)
- [6. Screens and wireframes](#6-screens-and-wireframes)
- [7. Data model](#7-data-model)
- [8. Integrations, APIs and events](#8-integrations-apis-and-events)
- [9. Permissions](#9-permissions)
- [10. AI opportunities in this module](#10-ai-opportunities-in-this-module)
- [11. Edge cases, compliance and risks](#11-edge-cases-compliance-and-risks)
- [12. Metrics and KPIs](#12-metrics-and-kpis)
- [13. Beyond the brief: extra ideas](#13-beyond-the-brief-extra-ideas)
- [14. Open questions](#14-open-questions)
- [Sources](#sources)

> **Research note.** This pass was constrained in the same way as [20](20-architecture-security.md) and [R2](research/R2-landscape-specific-platforms.md): the workflow's shared web-search budget was exhausted before this document started, and the vendor developer hosts this module depends on (developer.intuit.com, developer.xero.com, irs.gov) were not reachable from the research environment. Claims below that link to a source were verified by sibling research passes and are cited to the original page. Claims marked **(verify)** come from the author's background knowledge of vendor APIs, tax rules and accounting standards; they are stated because the design depends on them, but each must be checked against the primary source before engineering commits or anything is said externally. No statistic in this document is invented; numeric examples are labeled illustrative.

---

## 1. Goals and non-goals

### 1.1 Goals

| # | Goal | Measure of success (first 12 months after MVP GA) |
|---|------|---------------------------------------------------|
| G1 | **Books as a by-product.** Every operational event with a financial effect posts a balanced entry automatically, with no re-keying. | 97%+ of journal lines in a typical tenant are system-posted; manual entries under 25 per month for a 20-person Company. |
| G2 | **Correct by construction.** The ledger cannot be unbalanced, edited after posting, posted into a locked period or double-posted, and every subledger ties to its control account. | Zero unbalanced entries ever; zero unresolved subledger drift at any month-end ([20](20-architecture-security.md) L1-L12). |
| G3 | **Landscape-native management accounting.** P&L by division, job cost by phase and cost type, burdened labor, equipment recovery, overhead recovery vs the Company Budget, WIP for installs, deferred revenue for prepaid programs. | 80% of design-build tenants post a WIP schedule every month; owners open the division P&L at least weekly in season. |
| G4 | **Close in hours, not weeks.** Automated close checklist, auto-matched bank and Stripe payouts, AI flux commentary. | Median close completed by business day 5; under 4 hours of bookkeeper time for a 20-person Company (the target in [02](02-personas-roles-permissions.md) journey 4.7). |
| G5 | **CPA-trusted.** Outside accountants get free delegated access, a multi-client hub, standard exports and an audit trail they would sign off on. | 300+ accounting firms active in the Hub; 60%+ of native-ledger tenants have an outside accountant connected. |
| G6 | **Optional, honest integrations.** QuickBooks Online, Desktop and Xero are supported in clearly labeled modes; sync failures are per record, explained and fixable in one click. | Fewer than 2 unresolved sync errors per 1,000 synced objects at month-end; zero duplicate customers created by sync. |
| G7 | **Painless migration.** A QuickBooks company moves to the native ledger with opening balances that tie to the cent. | Opening trial balance, AR aging and AP aging tie to the source on 100% of assisted migrations; median migration under 2 working days. |
| G8 | **Replace a subscription.** Small Companies can drop QuickBooks entirely. | 35% of tenants under $2M revenue run native-only by month 12 (estimate to validate in pilots). |
| G9 | **North American from day one.** US and Canada, USD and CAD, sales tax and GST/HST/QST, 1099 and T5018/T4A, GAAP and ASPE-friendly reporting. | Canadian pilot tenants close and file GST/HST from Rootline with no spreadsheet. |
| G10 | **Explainable numbers.** Any number on any report drills to journal lines, then to the source document (visit, invoice, bill, time entry, payout) and the posting rule that created it. | 100% of system entries carry a source link and rule version. |

### 1.2 Non-goals

- **Not a tax preparer.** Rootline produces tax-ready trial balances, depreciation schedules, 1099 files and sales tax reports; it does not prepare or file income tax returns.
- **Not a payroll engine.** Gross-to-net, payroll tax filing and W-2/T4 issuance stay with the payroll provider ([15](15-team-hr-payroll.md)). Rootline imports the payroll journal and allocates labor cost.
- **Not a bank or money transmitter.** Client money stays in the Company's Stripe account and bank ([08](08-payments-stripe.md)); vendor payments leave the Company's own bank, through the bank or a licensed payables partner. Rootline never holds funds.
- **Not a full ERP for $100M roll-ups at launch.** Multi-entity consolidation is in scope; revenue sharing across franchise systems, statutory consolidation of foreign subsidiaries and IFRS reporting are not.
- **Not an audit firm.** The audit trail and evidence locker make audits and reviews cheaper; they do not replace them.
- **Not two books of record.** At any moment exactly one system is the book of record for a legal entity, and every screen says which ([20](20-architecture-security.md) L12).

### 1.3 Design principles

1. **The journal is append-only.** Posted entries never change. Corrections are reversals plus new entries, linked both ways. A typo costs one reversal, not trust.
2. **Posting rules are data, not code paths.** Each rule is a versioned record that maps an event to accounts through **account roles** (for example `ar_control`, `stripe_clearing:USD`), never hard-coded account numbers. Companies can renumber their chart without breaking a single rule.
3. **Subledgers are the truth for detail, the GL is the truth for totals, and they must agree.** AR, AP, inventory, fixed assets, loans, deferred revenue and Stripe clearing each reconcile to a control account nightly; drift opens an integrity case ([20](20-architecture-security.md) L7).
4. **Dimensions instead of account sprawl.** One "Materials" COGS account tagged by division, job, phase and cost type beats 40 lookalike accounts. Account explosion is offered only where an external system needs it.
5. **Accrual by default, cash on demand.** The ledger is accrual. Cash-basis statements are derived views, not a second ledger.
6. **Season-aware.** Landscaping earns 70-80% of its revenue in eight months in most northern markets (illustrative; varies by region and service mix). Budgets phase by month, overhead recovery shows pacing, depreciation can follow engine hours, and winter is when migrations, year-end and budgeting happen.
7. **The bookkeeper is a power user, the owner is a reader.** Bookkeeper screens are dense, keyboard-first and batch-oriented; owner screens are three numbers and a sentence of explanation.
8. **Never silently drop money.** Anything Rootline cannot classify posts to a visible suspense account with a task, never to nowhere.
9. **Integrations are explicit about direction.** Every synced object type has a declared owner system, a declared direction and a declared conflict rule.
10. **AI proposes, people (or explicit policies) dispose.** AI categorizes, matches, drafts and explains; nothing AI-drafted posts to the ledger without a human approval or a tenant-configured auto-post policy with thresholds ([17](17-ai-copilot-automation.md)).

---

## 2. Market research

### 2.1 What competitors do

No landscape or field-service product in our research keeps a real general ledger for small and mid-sized contractors. They sync to QuickBooks or Xero, and the quality of that sync is a recurring complaint category ([R1](research/R1-field-service-platforms.md) section 14.4).

| Product | Accounting approach | Job costing and WIP | Notable limits and complaints | Evidence |
|---|---|---|---|---|
| **Jobber** | One-way sync **to** QuickBooks Online (clients, products/services, invoices, payments, refunds, tips, Jobber Payments payouts); Xero sync also offered. Jobber is the source of truth; edits in QBO are overwritten. | Job costing and Job Profitability on the higher Grow tier; operational, no WIP, no percentage-of-completion, no retainage accounting, no overhead allocation. | Paid status recorded in QBO **does not sync back**; invoices and payments sync only to the **parent** customer, not sub-customers; **QuickBooks Desktop is not supported**; a sync error on one client **blocks all invoices and payments for that client**. Profitability depends on crews logging time and materials against jobs. | [Jobber QBO FAQ](https://help.getjobber.com/es/articles/quickbooks-integration-faqs/), [Jobber sync errors](https://help.getjobber.com/hc/en-us/articles/10466688449431-Common-QuickBooks-Sync-Errors-and-How-to-Fix-Them), [Jobber Job Insights](https://productupdates.getjobber.com/30097-see-revenue-and-cost-trends-with-job-insights), [Jobber community](https://community.getjobber.com/discussions/finances-forum/how-do-you-actually-track-job-profitability-not-just-revenue/15674/replies/15706) |
| **Aspire** (ServiceTitan) | Not a general ledger; integrates with an external accounting system and **reads its vendor list from that system**. Third-party AP automation (Vergo) is sold specifically for Aspire bills. | Strongest landscape job costing; purchases costed at what was paid; work tickets with budgeted vs actual hours. | Long implementations; vendor master lives outside Aspire; AP is a bolt-on. | [Aspire purchasing](https://www.youraspire.com/features/purchasing), [Aspire purchasing guide](https://guide.youraspire.com/docs/using-the-purchasing-module), [Vergo](https://www.getvergo.com/learn/best-ap-automation-software-for-landscape-companies-using-aspire), [Aspire branch vs division](https://guide.youraspire.com/docs/deciding-branch-or-division-for-company-set-up) |
| **LMN** (Granum) | QuickBooks Online and Desktop sync are the commonly cited path (verify); not a general ledger. | Budget-first estimating with labor burden and three overhead recovery methods (MORS, FLH, SORS); "Job Costing Advisor" tracks labor from timesheets and materials from vendor bills against the estimate. | The budget lives in LMN, the actuals live in QuickBooks; overhead recovery is a pricing input, not a tracked result against the GL. | [LMN overhead help](https://intercom.help/lmn/en/articles/15939065-how-lmn-calculates-overhead-labor-burden-and-profit-in-estimates), [LMN estimating FAQ](https://intercom.help/lmn/en/articles/15939077-estimating-faq), [Turf Magazine](https://turfmagazine.com/lmn-introduces-job-costing-advisor-for-landscapers) |
| **SingleOps** (Granum) | QuickBooks sync (verify Online vs Desktop coverage). | Job costing for tree and landscape jobs (verify depth). | Fixed roles, no read-only role for external CPAs. | [SingleOps role permissions](https://docs.singleops.com/hc/articles/43339904495387), [R2](research/R2-landscape-specific-platforms.md) |
| **Service Autopilot** (Xplor) | QuickBooks sync (verify). | Light; automation-centric. | Reviewers describe invoice automation as generic with glitches; processor choice and rate complaints. | [GetApp reviews](https://www.getapp.com/operations-management-software/a/service-autopilot/reviews/), [Capterra](https://www.capterra.com/compare/105508-122075/LawnPro-vs-Service-Autopilot) |
| **Real Green** (WorkWave) | Built-in billing for lawn programs with accounting exports (verify). | Program and route metrics; limited project costing. | A Capterra reviewer called its accounting and invoicing "basically unusable"; support and cloud-migration complaints. | [Capterra Real Green reviews](https://www.capterra.com/p/78106/Service-Assistant/reviews/?page=5) |
| **Arborgold, Yardbook, Copilot CRM, SynkedUP** | QuickBooks Online sync is the common path (verify per product). | SynkedUP sells job costing and overhead-based pricing; others are light. | None keeps books; Yardbook and Copilot target small residential operators. | [SynkedUP features](https://synkedup.com/features/), [Copilot CRM overview](https://help.copilotcrm.com/en/articles/12141481-what-is-copilot-crm), [R2](research/R2-landscape-specific-platforms.md) |
| **ServiceTitan** | Integrates with QuickBooks and mid-market ERPs (for example Sage Intacct, Viewpoint Vista); built for companies with controllers (verify current list). | Strong job costing for HVAC/plumbing tickets. | Enterprise price and implementation; not landscape-shaped. | [R1](research/R1-field-service-platforms.md) section 4 |
| **Housecall Pro** | QuickBooks sync (verify Online and Desktop). | Job costing on higher tiers; analytics add-on vendors sell "beyond built-in reports". | A cottage industry of analytics add-ons is itself evidence of unmet demand. | [HCP advanced reporting](https://housecallpro.com/features/advanced-reporting), [Inzata](https://inzata.ai/blog/housecall-pro-data-analytics-beyond-built-in-reports) |
| **FieldEdge** | Long-standing two-way QuickBooks integration including Desktop. | Moderate. | Proves a segment of contractors buys **because of** accounting fidelity. | [R1](research/R1-field-service-platforms.md) section 4 |

### 2.2 The accounting tools landscapers actually run

| Tool | Where it fits | What matters for Rootline |
|---|---|---|
| **QuickBooks Online** | The default for most small US and Canadian landscapers and their CPAs. Classes and Locations exist on Plus and Advanced; Projects on Plus and Advanced; Simple Start and Essentials lack classes (verify current plan matrix). | Our mapping must work with or without classes; sub-customers (up to several levels) are the natural place for Properties (verify depth limit). Intuit's 2025 App Partner Program meters some API read calls by tier (verify current terms), which pushes us to CDC and webhooks rather than polling reads. |
| **QuickBooks Desktop** (Pro, Premier, Enterprise; Canada editions) | Older, larger design-build firms and many CPAs. Intuit stopped selling new subscriptions of some Desktop editions to new US customers after 2024 while Enterprise continues (verify). | Only reachable through the Web Connector (SOAP polling from the customer's Windows PC) or a third-party Desktop API service; no webhooks. Shrinking but sticky: a strong migration source. |
| **Xero** | Common in Canada and with younger CPAs; strong bank feeds. Only two active tracking categories (verify current limit). | Division and branch must fit in two tracking categories; Xero's developer pricing moved to tiers in 2025-2026 (verify). |
| **Sage Intacct** | $20M+ multi-entity commercial firms and PE roll-ups; rich dimensions and consolidation. | Our dimension model maps naturally; this is the upmarket integration [V2]. |
| **Construction accounting** (Foundation, Sage 100/300 Contractor, Viewpoint) | A minority of large design-build and commercial install firms that bid bonded public work. | They expect WIP schedules, retainage, certified payroll; we meet the WIP and retainage needs natively and export for the rest. |
| **Spreadsheets** | WIP schedules, overhead recovery tracking, budgets, cash forecasts, 1099 lists. | Every spreadsheet a CPA maintains outside the system is a feature we should absorb. |

### 2.3 What users complain about

| Complaint | Evidence | Rootline response |
|---|---|---|
| "QuickBooks and my field software disagree." Duplicate customers, unmapped tax codes, payments recorded twice (once by sync, once by the bookkeeper), deposits that never match the bank because fees are not split. | Jobber documents parent-only customers, no paid-status sync-back and error cascades; R1 synthesizes the category's failure modes. ([Jobber QBO FAQ](https://help.getjobber.com/es/articles/quickbooks-integration-faqs/), [R1](research/R1-field-service-platforms.md) section 14.4) | Native ledger (nothing to sync), or a sync engine with explicit direction, an external reference map, lookup-before-create, per-record quarantine and net-of-fee payout posting ([4.17](#417-accounting-integrations)). |
| "My bookkeeper needs a paid seat and still can't see why a number is what it is." | [02](02-personas-roles-permissions.md) persona research; SingleOps has no read-only role ([SingleOps](https://docs.singleops.com/hc/articles/43339904495387)). | Free Accountant Hub seats, drill-to-source on every number ([4.12](#412-accountant-hub-and-the-external-cpa), [4.13](#413-audit-trail-and-evidence)). |
| "Job costing doesn't match the P&L." | Jobber profitability depends on crews logging time and materials ([Jobber community](https://community.getjobber.com/discussions/finances-forum/how-do-you-actually-track-job-profitability-not-just-revenue/15674/replies/15706)); analytics vendors note missing loaded labor and overhead ([Inzata](https://www.inzata.ai/blog/jobber-job-profitability-tracking), vendor claim). | Job cost **is** the GL, tagged by dimension; applied labor and burden with variance accounts so job cost and P&L tie by construction ([4.7](#47-job-costing)). |
| "Accounting in my lawn software is unusable." | Real Green review ([Capterra](https://www.capterra.com/p/78106/Service-Assistant/reviews/?page=5)). | A real GL designed by accountants, with deferred revenue for prepay programs ([4.8](#48-revenue-recognition-wip-and-deferred-revenue)). |
| "My vendors and bills live somewhere else." | Aspire reads vendors from the accounting system; Vergo sells AP automation for it ([Aspire](https://www.youraspire.com/features/purchasing), [Vergo](https://www.getvergo.com/learn/best-ap-automation-software-for-landscape-companies-using-aspire)). | Rootline owns the vendor master ([13](13-operations-inventory-equipment.md)) and the AP subledger with 3-way match and bill approval ([4.5.2](#452-accounts-payable-bills-approvals-and-bill-pay)). |
| "I priced with overhead recovery but never know if I recovered it." | LMN teaches FLH/SORS/MORS for pricing ([LMN help](https://intercom.help/lmn/en/articles/15939065-how-lmn-calculates-overhead-labor-burden-and-profit-in-estimates)); actual recovery lives in spreadsheets. | Overhead recovery tracker with seasonal pacing, fed by actual billable hours and actual overhead from the GL ([4.9.2](#492-overhead-recovery-tracker)). |
| "QuickBooks Desktop isn't supported." | Jobber ([QBO FAQ](https://help.getjobber.com/es/articles/quickbooks-integration-faqs/)); FieldEdge's niche is built on it ([R1](research/R1-field-service-platforms.md)). | Desktop via Web Connector [V1], plus a one-way migration path to native books ([4.17.3](#4173-quickbooks-desktop-via-web-connector-v1), [4.18](#418-migration-from-quickbooks-and-opening-balances)). |
| "Snow seasons wreck my books." Seasonal contracts, per-push billing and salt inventory straddle fiscal years. | Snow bookkeeping guidance discusses seasonal deferral under ASC 606 and per-push triggers ([Beancount](https://beancount.io/blog/2026/06/03/snow-removal-plowing-ice-management-contractor-bookkeeping-asc-606-seasonal-deferred-revenue-per-push-trigger-section-179-plow-truck-salt-spreader-sima-asca-revenue-per-truck-hour-kpi-guide)). | Seasonal recognition curves, per-event accruals and a snow "risk ledger" per site ([4.8](#48-revenue-recognition-wip-and-deferred-revenue), [13](#13-beyond-the-brief-extra-ideas)). |

### 2.4 The gap we exploit

1. **Nobody keeps the books.** Every competitor outsources the ledger to Intuit or Xero, so every landscaper pays twice and reconciles forever ([R1](research/R1-field-service-platforms.md) pattern 3). A native GL that is genuinely good removes a subscription for small Companies and removes drift for all of them.
2. **Nobody connects the estimate budget to the actuals.** LMN-style overhead recovery and burden are pricing assumptions in one tool; actual overhead and actual hours are in another. Rootline holds both, so "did we recover overhead this year?" becomes a live tile.
3. **Nobody does WIP for small design-build firms.** WIP and over/under billing live in CPA spreadsheets; sureties and banks ask for them. Rootline generates them from job cost and billing data that already exist.
4. **Sync done right is still a differentiator.** For Companies whose CPA insists on QuickBooks, Rootline can be the best-behaved QuickBooks citizen in the category: sub-customers per Property, classes per division, Desktop support, per-record quarantine, paid-status round-trip and net-of-fee deposits.
5. **The CPA is the channel.** A CPA with 14 landscape clients who can close all of them in one Hub becomes a reseller. QuickBooks won small business partly through accountants; we copy that playbook inside a vertical.

> **Competitive edge.** Jobber's QuickBooks Online integration is one-way, parent-customer only, unsupported on Desktop, and blocks every invoice for a client when one record errors ([Jobber QBO FAQ](https://help.getjobber.com/es/articles/quickbooks-integration-faqs/)). Aspire has the best landscape job costing but depends on an external system for its vendor list and leaves AP to add-ons ([Aspire](https://www.youraspire.com/features/purchasing)). LMN taught the industry to price from a budget but leaves the actuals in QuickBooks ([LMN](https://intercom.help/lmn/en/articles/15939065-how-lmn-calculates-overhead-labor-burden-and-profit-in-estimates)). Rootline is the only product where the budget, the estimate, the job cost, the WIP schedule and the general ledger are the same data.

---

## 3. Personas and jobs-to-be-done

Role keys follow [02](02-personas-roles-permissions.md). Running examples: **Reyes Outdoor Living** (Charlotte, NC; residential design-build plus maintenance; about 22 people at peak) with outside CPA **Karen Liu** and part-time in-house bookkeeper **Beth**; **Summit Grounds Group** (Columbus, OH; commercial maintenance, snow and irrigation; three branches; two legal entities); and **Evergreen Edge Landscaping**, whose 2026 Company Budget is the worked example in [03](03-crm-sales-estimating-proposals.md) EST-01.

| Persona (role key) | Jobs-to-be-done in this module | What "great" looks like |
|---|---|---|
| Business Owner (`owner`) | Know if the business is making money, by division and by job, this month; know if cash covers February payroll; approve big bills; sign off on the close. | A Monday "money brief": cash, AR over 60, gross margin by division vs budget, overhead recovery pacing, one sentence on what changed. No accounting vocabulary required. |
| Office / Admin Manager (`office_manager`) | Enter and code bills, match receipts, record checks and cash, answer the CPA's questions, run the AP payment batch. | Inbox-zero AP queue; bills arrive pre-coded to jobs; receipts matched before they ask. |
| Bookkeeper, internal (`bookkeeper`, e.g. Beth) | Categorize bank and card lines, reconcile accounts and Stripe payouts, chase missing receipts, import payroll, prepare the close. | 90% of bank lines auto-categorized; reconciliation is reviewing exceptions, not ticking boxes. |
| Bookkeeper / CPA, external (`bookkeeper` via Accountant Hub, e.g. Karen Liu) | Close 14 clients by business day 10; post adjusting entries; lock periods; produce statements, WIP and tax packages; file 1099s. | One login, all clients, a close checklist that already knows what is wrong, and periods that stay locked. |
| Operations / Account Manager (`ops_manager`) | Code materials and sub bills to jobs and phases; watch job cost vs estimate; approve timesheets so labor cost lands correctly. | A job cost screen that shows burned vs budgeted hours by phase daily and warns before a job goes red. |
| Sales Rep / Estimator (`estimator`) | Learn from actuals: which production rates and equipment rates were wrong last season. | Estimate-vs-actual by assembly feeding next year's production rates ([03](03-crm-sales-estimating-proposals.md)). |
| Landscape Designer (`designer`) | Mostly none; sees design-fee revenue attribution if commissioned. | Nothing to do here, which is the point. |
| Crew Lead / Foreman (`crew_lead`) | Snap receipts for field purchases; confirm materials used; record cash collected. | "Add expense" takes 15 seconds offline; never asked twice for the same receipt. |
| Field Technician (`technician`) | Clock time to the right job (drives labor cost); snap receipts when they hold a card. | Invisible accounting. |
| Subcontractor (`subcontractor`) | Submit invoices against sub work orders, see payment status, provide W-9 and lien waivers. | Paid on time, no phone calls; retainage visible ([13](13-operations-inventory-equipment.md)). |
| Platform Operator (`platform_owner`) | Know how many tenants run native books, sync health across the fleet, integrity incidents; manage chart templates and posting-rule packs. | A fleet "books health" board in the admin console ([19](19-platform-admin-portal.md)) with zero integrity cases open. |
| Platform staff (`platform_support`, `platform_finance`, `platform_engineer`) | Support: diagnose sync errors and posting questions under consented access. Finance: Rootline's own SaaS revenue (not tenant books). Engineer: posting engine, connectors, integrity jobs, break-glass only. | Support resolves "why is my P&L wrong" tickets with the explain tool, never by editing data. |
| Client contacts (`client_residential`, `client_commercial`) | Indirect: statements, credits and deposits shown in the portal come from the AR subledger ([06](06-customer-portal.md)). | The balance in the portal always equals the balance in the books. |

**Top jobs-to-be-done, phrased the way customers say them:**

1. "Tell me which division actually made money last month, after overhead." (owner)
2. "Close March without re-keying anything from the field software." (bookkeeper)
3. "Show the bank what my WIP looks like before the line-of-credit renewal." (owner, CPA)
4. "Make the Stripe deposit match the bank to the penny." (bookkeeper)
5. "Get 1099s out by January 31 without a spreadsheet." (office manager, CPA)
6. "Let my CPA keep QuickBooks, but stop it from drifting." (owner)
7. "Know if I am on pace to recover overhead in a slow spring." (owner)
8. "Move off QuickBooks in January without losing my opening balances." (owner, CPA)

