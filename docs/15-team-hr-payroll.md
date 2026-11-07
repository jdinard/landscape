# 15 - Team, HR, Time and Payroll

> Labor is the biggest cost line in a landscape company and the hardest thing to manage. Benchmark studies put burdened direct labor at about 43% of net revenue for mid-size firms ([Lawn & Landscape, Wilson 360 2024 benchmark](https://www.lawnandlandscape.com/article/wilson-360-2024-landscape-industry-benchmark)). Headcount doubles or triples between February and May, much of the workforce prefers Spanish, and many companies depend on the H-2B visa program. Crews also run equipment that needs a license (pesticide applicator, CDL, backflow tester, ISA arborist). The Team module gives Rootline one people system for the whole lifecycle: recruit in Spanish from a phone, onboard with e-signatures, track H-2B milestones, enforce certifications in the schedule, train with bilingual micro-videos, approve timesheets, apply the right overtime and break rules for each state, compute piece-rate, production and commission pay, build certified payroll, export clean pay data to Gusto, ADP, Paychex or QuickBooks Payroll (embedded payroll comes later), keep the OSHA logs, run heat plans, recognize good work and offboard cleanly. Because every hour is tied to a Visit, a Job and a cost code, the same data that pays people also costs jobs, prices estimates and forecasts hiring. No landscape-specific competitor runs this whole loop in one product.

**Document status:** Design proposal v1.0 (2026-11-07). Owner: People and Time domain team (`people` module in [Architecture](20-architecture-security.md)).

**Related docs:** [Personas and permissions](02-personas-roles-permissions.md) · [Estimating and commissions](03-crm-sales-estimating-proposals.md) · [Scheduling and dispatch](04-scheduling-dispatch-routing.md) · [Crew app (punches, attestations, safety capture)](05-field-crew-mobile-app.md) · [Customer portal (ratings, tips)](06-customer-portal.md) · [Invoicing (T&M, certified jobs)](07-invoicing-billing-contracts.md) · [Payments (tips)](08-payments-stripe.md) · [Ledger and job costing](09-accounting-ledger-integrations.md) · [Operations, equipment custody](13-operations-inventory-equipment.md) · [Service lines (chem, tree, snow)](14-service-line-modules.md) · [Marketing and inbox](16-marketing-growth-communications.md) · [AI copilot and agents](17-ai-copilot-automation.md) · [Reporting and KPIs](18-reporting-analytics.md) · [Platform admin](19-platform-admin-portal.md) · [Architecture and security](20-architecture-security.md) · [UX and sitemaps](21-ux-design-system-sitemaps.md) · [Pricing](22-business-model-pricing-gtm.md) · [Moonshots](23-innovation-moonshots.md) · [Roadmap](24-roadmap-feature-catalog.md)

> **Legal posture (applies to the whole document).** Rootline is software, not a law firm, a PEO, an immigration agent or a payroll tax filer (until the embedded payroll option, and even then the licensed partner files). Every jurisdiction rule here is a starting configuration for legal review. The rules are marked "verify" where this document could not confirm current text. Rule packs ship versioned and reviewed by employment counsel before each season ([section 4.9](#49-pay-rules-engine-and-jurisdiction-policy-packs)), and the product says "this is not legal advice" wherever it shows a compliance hint.

> **Research note (November 2026).** This module's research was limited. The shared web-search budget for this workflow run was used up before its own searches ran, and the session's network allowlist blocked direct fetches of government and vendor hosts (dol.gov, osha.gov, dir.ca.gov, docs.checkhq.com). The facts below therefore come from three places. First, research already captured and cited by sibling documents ([05](05-field-crew-mobile-app.md), [02](02-personas-roles-permissions.md), [18](18-reporting-analytics.md), [R1](research/R1-field-service-platforms.md), [R2](research/R2-landscape-specific-platforms.md)). Second, primary regulations cited by section number. Third, general domain knowledge, which is labeled "verify". Competitor capabilities not confirmed in this session carry [B] (analyst belief, confirm in a hands-on teardown). Before this spec turns into tickets, the [V1] research backlog in [section 14](#14-open-questions) must close these gaps.

---

## Table of contents

1. [Goals and non-goals](#1-goals-and-non-goals)
2. [Market research](#2-market-research-what-competitors-do-what-users-complain-about-the-gap-we-exploit)
3. [Personas and jobs-to-be-done](#3-personas-and-jobs-to-be-done)
4. [Feature specification](#4-feature-specification)
5. [Key user flows](#5-key-user-flows)
6. [Screens and wireframes](#6-screens-and-wireframes)
7. [Data model](#7-data-model)
8. [Integrations, APIs and events](#8-integrations-apis-and-events)
9. [Permissions](#9-permissions)
10. [AI opportunities](#10-ai-opportunities-in-this-module)
11. [Edge cases, compliance and risks](#11-edge-cases-compliance-and-risks)
12. [Metrics and KPIs](#12-metrics-and-kpis)
13. [Beyond the brief](#13-beyond-the-brief-extra-ideas)
14. [Open questions](#14-open-questions)
15. [Sources](#sources)

---

## 1. Goals and non-goals

### 1.1 Goals

1. **One people record per human, many stints.** A person hired in 2024, hibernated each winter and rehired each spring keeps one Employee record with a history of Employment stints, pay rates, certifications and training. Spring rehiring takes minutes, not a stack of paper ([02 section 5.18](02-personas-roles-permissions.md)).
2. **Hire faster than the competitor down the road during the March-April rush.** A job post goes live in English and Spanish in under 5 minutes. An applicant applies from a phone in under 3 minutes with no account or résumé. An interview gets booked by SMS the same day.
3. **Make compliance a byproduct of work.** Overtime, California daily overtime, meal and rest premiums, piece-rate rest pay, prevailing wage, sick leave accrual, OSHA 300 logs, heat plans and certification expiry all come from data the crews already create in the [crew app](05-field-crew-mobile-app.md). Nobody re-keys anything.
4. **Payroll-ready by Monday 10 a.m.** Weekly timesheets are approved, exceptions resolved and pay data pushed to the payroll provider without a spreadsheet. Target: the office manager spends 15 minutes or less per pay period for a 30-person company. That is a goal to validate, not a measured result.
5. **Labor cost truth for every job.** Every hour carries a burdened cost (wages + taxes + workers' comp by class code + benefits + PTO). Job costing ([09](09-accounting-ledger-integrations.md)) and estimates ([03](03-crm-sales-estimating-proposals.md)) use the same burden numbers, and actual payroll journals true them up.
6. **Qualified crews only.** A visit that needs a licensed applicator, a CDL driver or a certified backflow tester cannot be dispatched to a crew without one, unless an authorized manager overrides it with a reason that gets logged.
7. **Bilingual by default.** Spanish is a first-class language in the crew app, applicant flow, onboarding documents, training, announcements and pay explanations at launch. French-Canadian comes next ([21](21-ux-design-system-sitemaps.md)).
8. **Retention as a product feature.** Visible pay, earned recognition, a career ladder and an early-warning view of flight risk help the owner keep good people. In this industry, losing a trained crew lead in June costs more than any software.
9. **Payroll-provider agnostic.** Rootline works with what the Company already uses (Gusto, ADP, Paychex, QuickBooks Payroll and, in Canada, Wagepoint, ADP Canada and others) through APIs or files. Later it offers an embedded payroll option for Companies that want everything in one place.
10. **Safety is managed.** Incident reports become OSHA-recordability decisions, logs, 300A summaries and corrective actions. Heat plans run automatically from the forecast.

### 1.2 Non-goals

- **Not a PEO or employer of record.** Rootline never becomes a co-employer.
- **No payroll tax filing or wage money movement at MVP.** Payroll providers compute net pay, withhold taxes, file and pay. With embedded payroll ([V2 GA](#414-embedded-payroll-option)), the licensed partner moves money and files taxes. Rootline never holds wage funds, which matches the "never hold client funds" principle in [08](08-payments-stripe.md).
- **Not an immigration law firm or H-2B agent.** The H-2B workspace tracks milestones, documents, housing and transport and keeps the records the program requires. Filings are prepared by the Company's agent or attorney. Rootline does not give legal advice or tell anyone how to answer a government form.
- **Not the I-9 / W-4 / TD1 system of record at MVP.** Those forms are completed in the payroll provider's onboarding (the hand-off is defined in [02](02-personas-roles-permissions.md)). Rootline stores the completion status only.
- **No automated hiring decisions.** AI may draft, translate, summarize and schedule. It never ranks, scores, rejects or advances applicants ([17, agent A25](17-ai-copilot-automation.md)).
- **No biometric templates.** Photo-at-punch is a plain photo for human review. Rootline does no face matching, which avoids biometric privacy statutes such as Illinois BIPA (verify scope with counsel).
- **Not a general-purpose LMS marketplace.** The training library is built for landscape, safety and the Company's own SOPs. SCORM import is [V2] for Companies that bring their own content.
- **No minute-level productivity surveillance.** GPS and time data serve pay, safety and job costing. No "idle score" exists ([05 section 4.23](05-field-crew-mobile-app.md), [18](18-reporting-analytics.md)).

### 1.3 Scope boundaries with sibling documents

| Topic | Owner doc | This doc's role |
|---|---|---|
| Punch capture, segments, crew punch, geofences, break reminders, attestations, tailgate talks, incident capture, heat checks in the field | [05 Crew app](05-field-crew-mobile-app.md) | Consumes those events. Turns them into timesheets, pay items, OSHA cases and compliance reports |
| Roles, membership lifecycle (invite, hibernate, rehire, offboard), PII field rules | [02 Personas and permissions](02-personas-roles-permissions.md) | Adds HR-specific capabilities and the HR workflows behind the lifecycle |
| Commission plans and commission events | [03 Estimating](03-crm-sales-estimating-proposals.md) (`COMM-01..03`) | Receives commission earnings as pay items. Applies payroll timing and regular-rate effects |
| Crew assignment, capacity, skills-based dispatch | [04 Scheduling](04-scheduling-dispatch-routing.md) | Supplies availability, time off, qualifications and labor-hour rules (max hours, rest windows, minors) |
| Tips collected from clients | [06](06-customer-portal.md), [08](08-payments-stripe.md) | Allocates tips to employees and exports them as tip earnings |
| Labor cost in job costing, payroll journal posting, WIP | [09 Ledger](09-accounting-ledger-integrations.md) | Supplies burdened rates and pay data. Imports payroll journals |
| Equipment and tool custody, PPE inventory | [13 Operations](13-operations-inventory-equipment.md) | Triggers issuance at onboarding and return at offboarding. Owns wage-deduction guardrails |
| Pesticide records, tree work, snow operations | [14 Service lines](14-service-line-modules.md) | Owns the credentials those records require |
| Recruiting campaigns on the Company website | [16 Marketing](16-marketing-growth-communications.md) | Owns job posts, careers page widget and applicant pipeline. The website builder renders them |
| People KPIs (turnover, TRIR, certification compliance) | [18 Reporting](18-reporting-analytics.md) | Supplies the data and adds HR-specific operational dashboards |
| Platform-curated content (training library, credential catalog, rule packs) | [19 Platform admin](19-platform-admin-portal.md) | Defines the content model. Platform staff curate it |

---

## 2. Market research: what competitors do, what users complain about, the gap we exploit

### 2.1 The labor reality this module serves

| Fact | Evidence | Design implication |
|---|---|---|
| Labor is the largest cost. Burdened direct labor is about 43% of net revenue for firms with $3M-$54M revenue in one benchmark study, while other sources quote 25-30% for unburdened labor | [Lawn & Landscape on Wilson 360](https://www.lawnandlandscape.com/article/wilson-360-2024-landscape-industry-benchmark), [Aspire blog](https://www.youraspire.com/blog/landscaping-labor-percentage-of-revenue) (definitions differ, see [18](18-reporting-analytics.md)) | Burden must be explicit, configurable and reconciled to actual payroll ([4.12](#412-labor-burden-and-costing)) |
| About 44.5% of US landscaping and groundskeeping workers were Hispanic in 2024 | [Data USA](https://datausa.io/profile/soc/landscaping-and-groundskeeping-workers) (cited in [21](21-ux-design-system-sitemaps.md)) | Spanish-first applicant flow, documents, training and pay explanations at MVP |
| Headcount is seasonal. Winter headcount in reference Companies is roughly a third to two-fifths of peak (illustrative), and crews ramp to full strength by April | [02 section 5.18](02-personas-roles-permissions.md), [DOL H-2B program](https://www.dol.gov/agencies/whd/immigration/h2b) | Hibernate and rehire, bulk onboarding, seasonal burden curves, H-2B workspace |
| H-2B visas are capped by statute at 66,000 per fiscal year, split between the two halves of the year. Landscaping is commonly reported as the largest H-2B occupation, and supplemental visas have been released in recent years | [USCIS H-2B cap count](https://www.uscis.gov/working-in-the-united-states/temporary-workers/h-2b-non-agricultural-workers/cap-count-for-h-2b-nonimmigrants) (verify current fiscal year figures and supplemental allocations) | Milestone tracker, document checklist, corresponding-employment wage checks, housing and transport ([4.4](#44-h-2b-and-seasonal-worker-program-support)) |
| California daily overtime, meal/rest premiums and PAGA exposure make timekeeping a legal risk | [California Employment Law Report: electronic timekeeping](https://www.californiaemploymentlawreport.com/2021/10/essential-elements-of-electronic-timekeeping-systems-for-california-employers/), [Donohue v. AMN summary](https://www.californiaemploymentlawreport.com/2021/04/california-supreme-court-provides-guidance-on-meal-breaks-donohue-v-amn-services/), [Ogletree California Break Book](https://ogletree.com/app/uploads/solutions/templates/California-Break-Book.pdf), [2026 wage-hour pitfalls](https://www.californiaemploymentlawreport.com/2026/05/scheduling-smarter-five-california-wage-and-hour-pitfalls-employers-should-address-in-2026/) | Versioned jurisdiction rule packs, minute-precision meal punches, attestations, premium pay automation |
| Landscaping is listed among the industries subject to Cal/OSHA's high-heat procedures | [Ogletree on Cal/OSHA heat](https://ogletree.com/insights/the-heat-is-on-in-california-cal-oshas-heat-illness-prevention-requirements-for-outdoor-work-sites/), [DIR 2023-43](https://dir.ca.gov/DIRNews/2023/2023-43.html), [DIR 2026-53](https://dir.ca.gov/DIRNews/2026/2026-53.html) | Written heat illness prevention plan builder plus forecast-driven procedures ([4.15](#415-safety-management)) |
| Pesticide applicators must be certified under EPA standards and state programs | [EPA certification standards](https://www.epa.gov/pesticide-worker-safety/certification-standards-pesticide-applicators) | Certification gates on chemical steps and on dispatch ([4.5](#45-certifications-licenses-and-qualification-enforcement)) |

### 2.2 What competitors ship in this module

Legend: [S] sourced in this repo's research; [B] analyst belief to confirm in a hands-on teardown (see research note).

| Product | Time and timesheets | Payroll connection | HR, hiring, training, safety | Notes |
|---|---|---|---|---|
| **Jobber** | Clock in/out, job timers, timesheets; automatic time tracking on Grow+ [S3P via [R1](research/R1-field-service-platforms.md)] | Timesheet data reaches payroll through QuickBooks Online and partner integrations [B] | Team permission toggles for timesheets, expenses and chemical tracking ([Jobber permissions help](https://help.getjobber.com/hc/en-us/articles/115009568687), via [02](02-personas-roles-permissions.md)). No ATS, LMS, certification enforcement or OSHA logs [B] | Users say permissions "need to be more robust" ([Jobber community](https://community.getjobber.com/discussions/team-management/how-can-teams-manage-user-permissions-and-admin-access-in-jobber/7631)) |
| **Aspire** (ServiceTitan) | PIN clock-in, geofencing, crew leaders punch for members and clock lunches, shared or own device ([Aspire crew management](https://www.youraspire.com/industries/landscape-business-software/crew-management), [Aspire time reporting guide](https://guide.youraspire.com/docs/time-reporting-in-the-crew-mobile-app)) [S] | Payroll export to common providers [B] | Work-ticket hours drive job costing [B]. No native ATS or LMS [B] | The legacy Crew Mobile iOS app averaged 2.28 stars ([AppGoblin](https://appgoblin.info/apps/1392810365), verify) |
| **LMN** (Granum) | LMN Time app. Timesheets feed the Job Costing Advisor ([Turf Magazine](https://turfmagazine.com/lmn-introduces-job-costing-advisor-for-landscapers)) [S] | Payroll export [B] | Budget-based labor burden math ([LMN help](https://intercom.help/lmn/en/articles/15939065-how-lmn-calculates-overhead-labor-burden-and-profit-in-estimates)) [S] | Time tracking "awesome, though sometimes clunky" ([Capterra](https://www.capterra.com/p/142064/LMN/reviews/)). The legacy Crew Member seat could not punch in ([LMN permissions](https://intercom.help/lmn/en/articles/17699017-lmn-user-permissions)) [S] |
| **SynkedUP** | Time tracking tied to estimating and job costing ([SynkedUP features](https://synkedup.com/features/)) [S] | QuickBooks-oriented [B] | Labor burden in pricing [B] | Per-user pricing listed at $297-$399 (as of Nov 2026, verify) ([Capterra](https://www.capterra.com/p/228695/SynkedUP/pricing/)) |
| **SingleOps / Arborgold** | Crew time tracking [B] | Export [B] | Tree-care credentials tracked loosely if at all [B] | Arborgold picks a role at user creation; staff show up in crew pick-lists ([02](02-personas-roles-permissions.md)) |
| **Real Green, Service Autopilot, Copilot CRM** | Timesheets and production reports for route-based lawn work [B] | Production- or commission-style pay reports [B] | Applicator license fields tied to chemical records [B] | Lawn treatment companies often pay technicians on production. That needs regular-rate overtime math ([4.10](#410-compensation-types)) |
| **ServiceTitan** (core) | Timesheets with job, travel and idle codes [B] | Payroll module with performance pay and spiffs, exports to large providers [B] | Built for HVAC/plumbing technician commission culture [B] | The model for "pay drives behavior" but not landscape-aware |
| **Housecall Pro** | Time tracking [B] | Payroll offering or integration [B] | Light | Residential trades focus |
| **Yardbook** | Basic time [B] | None [B] | None | Free tier |
| **Horizontal time clocks** (Workyard, ClockShark, Connecteam) | Offline GPS clock-in that syncs later, geofences, crew punch ([Workyard](https://www.workyard.com/compare/best-gps-time-clocks-offline-remote-areas), [ClockShark](https://clockshark.com/blog/best-lawn-care-time-tracking-apps)) [S] | Strong exports [B] | Connecteam adds training, chat and onboarding [B] | Not connected to estimates, routes, chemical records or invoicing. Companies double-enter |
| **Payroll suites** (Gusto, ADP, Paychex, QuickBooks Payroll) | Basic time add-ons [B] | They are the payroll | Onboarding, I-9/W-4, PTO policies, some ATS and LMS add-ons [B] | No idea what a Visit, a crew, a spray license or a 2-inch snow trigger is |

> **Competitive edge:** Aspire and LMN treat time as an input to job costing. Gusto and ADP treat it as an input to paychecks. Connecteam treats it as an HR feature. Rootline treats one punch as the shared source of truth for paychecks, job cost, invoices (T&M), compliance evidence (meal attestations, heat checks, chemical applicator identity), estimates (production-rate calibration) and hiring forecasts. A landscape Company today needs about four products to get that, and those products disagree with each other.

### 2.3 What users complain about (themes)

| # | Complaint theme | Evidence | Rootline answer |
|---|---|---|---|
| C1 | Field time apps are clunky or crash, so crews revert to paper and the office re-keys | LMN reviews "clunky", crashes after updates ([Capterra](https://www.capterra.com/p/142064/LMN/reviews/), [App Store: LMN Time](https://apps.apple.com/us/app/id1012359605)) [S] | Offline-first crew punch with sync engine ([05](05-field-crew-mobile-app.md)). Timesheets derived from punches |
| C2 | Seat models that make field workers expensive, so owners share logins (which destroys audit trails) | LMN legacy Crew Member seat could not punch in [S]. Shared PIN abuse called out in [02](02-personas-roles-permissions.md) | Seasonal hibernation with no seat charge, kiosk/PIN mode for laborers ([22](22-business-model-pricing-gtm.md)) |
| C3 | Payroll prep is a Monday spreadsheet marathon: missed clock-outs, double entry into the payroll tool, bonus math by hand | Office manager persona goal "Clean timesheets by Monday 10 am" ([02](02-personas-roles-permissions.md)) [B for prevalence] | Exception-first approval board, rule engine, one-click export with validation, bonus engine |
| C4 | Certifications live in a spreadsheet or a binder in the truck. An expired applicator license is discovered by the state inspector | [B] (common forum theme; teardown to confirm) | Credential registry, OCR of license cards, expiry alerts, scheduling enforcement |
| C5 | Spanish-speaking applicants drop out of English-only, résumé-required applications | [B] (industry interviews to confirm) | Mobile apply in Spanish via SMS link or QR code, no résumé, voice answers |
| C6 | H-2B season is a binder of PDFs, a shared calendar and constant calls to the agent | [B] | H-2B workspace with milestone tracker, document checklist, housing and transport boards, agent portal access |
| C7 | Bonus and commission programs are distrusted because crews cannot see how they are calculated | [B]; scorecard guardrails in [05 section 4.15](05-field-crew-mobile-app.md) | Plain-language bonus rules visible to the crew, "Today I earned", pay explainer |
| C8 | Safety paperwork exists only after an incident, so insurance and OSHA documentation is thin | [B] | Tailgate attendance, JHAs, heat logs and incident reports flow into a safety record that exports for insurers and OSHA |

### 2.4 Regulatory map (what the module must support)

All rows are summaries for product design, not legal advice. Verify current text before each season's rule-pack release.

| Area | Rule (summary) | Product feature |
|---|---|---|
| Federal overtime (FLSA) | 1.5x the regular rate for hours over 40 in a workweek. The regular rate includes nondiscretionary bonuses, production pay and shift differentials (29 CFR Part 778) | Rule engine computes regular rate per workweek including bonuses, and recomputes OT when a bonus is earned later ([4.10](#410-compensation-types)) |
| Hours worked | Travel between job sites during the day is compensable; ordinary home-to-work commute generally is not ([DOL Fact Sheet 22](https://www.dol.gov/agencies/whd/fact-sheets/22-flsa-hours-worked)) | Segment pay treatment per policy pack ([05 section 4.5.1](05-field-crew-mobile-app.md)) |
| California | Daily OT over 8 hours (1.5x) and over 12 hours (2x). Seventh consecutive workday: first 8 hours at 1.5x and over 8 at 2x. Meal before the end of the 5th hour, second before the end of the 10th. Rest 10 minutes per 4 hours or major fraction. Premium of one additional hour at the regular rate of compensation per day for each type ([DLSE OT FAQ](https://www.dir.ca.gov/dlse/faq_overtime.htm), [DLSE meal FAQ](https://www.dir.ca.gov/dlse/faq_mealperiods.htm), [DLSE rest FAQ](https://www.dir.ca.gov/dlse/faq_restperiods.htm)) | CA policy pack (reference implementation), premium pay items, attestation evidence |
| California piece rate | Labor Code 226.2: piece-rate workers must be paid separately for rest and recovery periods (at the average hourly rate) and for other nonproductive time (at least minimum wage), with specific pay-stub lines ([Lab. Code 226.2](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=LAB&sectionNum=226.2)) | Piece-rate engine splits productive, rest and nonproductive time from punch segments |
| Other daily-OT jurisdictions | Alaska, Nevada (for workers below a wage threshold) and Colorado (over 12 hours) have daily OT rules. British Columbia has daily OT at 8 and 12 hours, Alberta uses 8/day or 44/week, Ontario 44/week, Quebec 40/week (all verify; Ontario has special rules for landscape gardeners, verify scope) | Rule packs per state and province; Canadian packs [V1] |
| Paid sick leave | Many states and cities mandate accrual (for example California's 40 hours / 5 days minimum since 2024, Washington 1 hour per 40 worked; verify each) | PTO engine with statutory policy templates and reinstatement on rehire ([4.7](#47-availability-time-off-and-pto-accrual)) |
| Prevailing wage | Davis-Bacon and related acts plus state prevailing wage laws. Weekly certified payroll (federal form WH-347 or equivalent; California eCPR) ([DOL WH-347](https://www.dol.gov/agencies/whd/forms/wh347)) | Classification per segment, fringe handling, certified payroll generation ([4.11](#411-prevailing-wage-and-certified-payroll)) |
| H-2B | 20 CFR 655 Subpart A: offered wage at least the prevailing wage, three-fourths hours guarantee, corresponding employment, reimbursement of inbound travel and visa costs, earnings statements, 3-year record retention ([eCFR 20 CFR 655 Subpart A](https://www.ecfr.gov/current/title-20/chapter-V/part-655/subpart-A), [DOL WHD H-2B](https://www.dol.gov/agencies/whd/immigration/h2b)) | H-2B workspace, three-fourths guarantee tracker, wage parity checks |
| OSHA recordkeeping | 29 CFR 1904: OSHA 300 log, 301 incident report within 7 calendar days, 300A summary posted Feb 1-Apr 30. Electronic submission for covered establishments. Severe injury reporting (fatality 8 hours; inpatient hospitalization, amputation, eye loss 24 hours) ([eCFR 29 CFR 1904](https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XVII/part-1904), [OSHA ITA](https://www.osha.gov/injuryreporting)) | OSHA case management, log, 300A generator, ITA CSV export, severe-injury clock |
| Heat | Cal/OSHA 8 CCR 3395 (outdoor). Washington WAC 296-62-095 (outdoor heat exposure). Oregon OAR 437-002-0156. Maryland and Nevada heat rules. A federal OSHA heat injury and illness prevention rule has been in rulemaking since the 2024 proposal (status as of Nov 2026, verify) ([Cal/OSHA 3395](https://www.dir.ca.gov/title8/3395.html), [WAC 296-62-095](https://app.leg.wa.gov/wac/default.aspx?cite=296-62-095), [OSHA heat rulemaking](https://www.osha.gov/heat-exposure/rulemaking)) | Heat illness prevention plan builder, forecast triggers, acclimatization schedules, training records |
| Youth employment | Under-18 workers may not operate chain saws, wood chippers or abrasive cutting discs (Hazardous Occupations Order 14), and driving is restricted. 14-15-year-olds face broader power-machinery limits ([29 CFR 570.65](https://www.ecfr.gov/current/title-29/subtitle-B/chapter-V/subchapter-A/part-570/subpart-E/section-570.65), [YouthRules](https://www.youthrules.gov)) | Age-gated equipment and task restrictions in dispatch and the crew app |
| Pesticides | EPA 40 CFR Part 171 certification standards (including a minimum age of 18 for certified applicators and those under their direct supervision, verify) plus state licensing categories and recertification credits ([EPA](https://www.epa.gov/pesticide-worker-safety/certification-standards-pesticide-applicators)) | Credential categories, CEU tracking, chemical step gates ([14](14-service-line-modules.md)) |
| CDL and DOT | Drug and alcohol Clearinghouse queries (pre-employment full query, annual limited query), DOT medical certificates for CMV drivers ([FMCSA Clearinghouse](https://clearinghouse.fmcsa.dot.gov)) | Driver qualification file checklist, medical card expiry, trailer-combo GVWR checks with [13](13-operations-inventory-equipment.md) |
| Hiring | Pay transparency in job posts (CA, CO, WA, NY, IL and others; BC; Ontario from Jan 1, 2026, including disclosure of AI use in screening; verify each). Fair-chance and ban-the-box laws. FCRA for background checks. NYC Local Law 144 for automated employment decision tools ([NYC AEDT](https://www.nyc.gov/site/dca/about/automated-employment-decision-tools.page)) | Posting validator, background-check partner with adverse-action workflow, no automated ranking |
| Electronic monitoring notices | New York Civil Rights Law 52-c; Ontario written electronic monitoring policy for employers with 25+ employees (verify) ([NY CVR 52-C](https://www.nysenate.gov/legislation/laws/CVR/52-C), [Ontario ESA guide](https://www.ontario.ca/document/your-guide-employment-standards-act-0/written-policy-electronic-monitoring)) | Notice templates and acknowledgment capture at onboarding ([4.3](#43-onboarding)) |

### 2.5 The gap we exploit

1. **Nobody connects the people lifecycle to landscape operations.** Competitors either stop at the timesheet (FSM tools) or know nothing about the work (HR suites). Rootline knows that Luis holds a Category 3A turf license expiring June 30, that Thursday's route includes three pre-emergent applications, and that the nearest licensed applicator is on Crew 4. It can fix the problem before Thursday.
2. **Seasonality is first-class.** Hibernate, rehire, H-2B dates, seasonal burden curves (wage-base caps make FUTA and SUTA front-loaded in spring), seasonal PTO rules and "coming back next season?" signals. Horizontal HR software treats a 60% winter layoff as an edge case.
3. **Spanish is not a translation afterthought.** The applicant flow, onboarding packet, SOP videos, quizzes, pay explanations and announcements are authored bilingually and reviewed by humans.
4. **Pay rules are a product, not a services engagement.** Regular-rate OT with production bonuses, California piece-rate rest pay, prevailing-wage classifications by segment and premium pay from attestations are hard to compute correctly. Rootline ships them as tested, versioned rule packs.
5. **Payroll-provider neutrality, then embedded payroll.** Companies keep their provider at first. Later they can switch on embedded payroll for one fewer login, without losing data.

> **Competitive edge:** ServiceTitan has the deepest technician pay engine in trades but is built for HVAC commissions. Aspire has strong crew time but no hiring, training or H-2B tooling. Connecteam has HR breadth with no job costing. Gusto runs payroll well but has no visits. Rootline is the only design where a single `time_segment` row feeds payroll, job cost, the prevailing-wage report, the OSHA hours denominator, the workers' comp class-code allocation and the H-2B three-fourths guarantee at the same time.

---

## 3. Personas and jobs-to-be-done

### 3.1 Personas for this module

| Persona (role key) | Jobs-to-be-done in Team/HR/Payroll | Pains today | What Rootline gives them |
|---|---|---|---|
| Business Owner (`owner`) | "Staff up for spring without overpaying, keep my best people, stay out of court and keep labor at budget." | Spreadsheets, distrust of bonus math, surprise workers' comp audits, H-2B anxiety | Hiring funnel, labor budget vs actual, burden truth, retention risk, compliance health score |
| Office / Admin Manager (`office_manager`) | "Clean payroll by Monday 10 a.m., new hires onboarded without chasing paper, nothing expires on my watch." | Missed punches, paper onboarding in two languages, expiring licenses | Exception-first approval, onboarding checklists with e-sign, credential alerts, one-click export |
| Operations / Account Manager (`ops_manager`) | "Right people with the right licenses on the right crews; overtime under control." | Discovering certification gaps at dispatch time; crews over hours on Friday | Qualification-aware scheduling, OT forecast, branch timesheet approval |
| Crew Lead / Foreman (`crew_lead`) | "Get my crew paid right, know who is new, keep everyone safe in the heat, and see my bonus." | Fixing teammates' punches, unclear bonus, paperwork in English | Crew time approvals (first level), heat checklists, crew-lead pay and bonus visibility, announcements in Spanish |
| Field Technician / Crew Member (`technician`) | "Know my schedule, my hours and my pay; ask for a day off; learn the job; get recognized." | Pay surprises, no PTO visibility, English-only paperwork | Employee self-service app in Spanish, "Today I earned", PTO requests, micro-training, kudos |
| Bookkeeper / Accountant (`bookkeeper`) | "Payroll journal posts correctly; labor burden matches reality; certified payroll is right." | Re-keying payroll journals, burden guesses | Payroll journal import with GL mapping, burden reconciliation, certified payroll reports |
| Estimator (`estimator`) | "My labor rates in estimates match what labor actually costs." | Stale burden percentages | Burdened labor rates by labor class feed the estimate engine ([03](03-crm-sales-estimating-proposals.md)) |
| Designer (`designer`) | Mostly a self-service user (own time, PTO, training) | | Same ESS |
| Subcontractor (`subcontractor`) | "Upload my COI and licenses once; get onto the job." | Duplicate paperwork | Credential upload for the subcontractor's organization (COI, licenses); no payroll |
| Applicant (no role; external, no login) | "Apply in Spanish from my phone in 3 minutes and hear back fast." | Long English forms, résumé required, silence | SMS/QR apply, voice answers, status texts |
| Platform Operator (`platform_owner`) | "Every tenant gets correct, current rule packs and good training content; payroll partners are healthy." | | Rule-pack release management, content library, partner health ([19](19-platform-admin-portal.md)) |
| Platform staff (`platform_curator`, `platform_engineer`, `platform_support`, `platform_finance`) | Curate the training library and credential catalog (curator); maintain rule packs and payroll connectors (engineer); help tenants without seeing pay or PII unless granted (support); reconcile embedded payroll revenue share (finance) | | Admin tooling in [19](19-platform-admin-portal.md) |

### 3.2 A season in the life (narrative used to test the design)

**Company:** "Green Valley Landscapes", Sacramento, CA. 42 employees at peak, 15 in winter. 12 H-2B workers. Maintenance, enhancements, installs and a lawn-care division. Payroll is on Gusto.

- **Early January.** The owner, Dana, opens the **Season Plan**. Rootline's forecast (from contracted maintenance hours plus the sales pipeline, [18](18-reporting-analytics.md)) shows peak labor demand of 1,760 crew-hours per week in May against 600 hours of winter staff capacity. The plan suggests: rehire 18 returning workers (14 answered "coming back" in the hibernation app), hire 9 new, keep 12 H-2B. The **H-2B tracker** shows the Company's agent filed the labor certification and is waiting on DOL. The next milestone is the USCIS petition.
- **Late February.** The office manager, Rosa, clicks **Post job** and picks "Landscape Laborer - Maintenance". The AI drafts the post in English and Spanish with the pay range California requires. The post publishes to the careers page, Indeed and Facebook and generates a QR flyer for the truck windows. Within a week, 63 people apply from phones. 41 apply in Spanish, and 12 leave voice answers.
- **March.** Rosa runs screening calls from the pipeline board. The scheduler texts interview slots and applicants reply "2" to pick Tuesday at 10 a.m. Offers go out by SMS and are e-signed on phones. Onboarding packets (handbook acknowledgment, heat illness plan training, electronic monitoring notice, uniform sizes, emergency contact) complete in Spanish. The Gusto onboarding link handles the W-4 and I-9 steps. Day 1, each hire picks up a uniform, PPE and a fob, all checked out to them in [13](13-operations-inventory-equipment.md).
- **April 6.** Returning crew members rehire with one tap. Two pesticide licenses expire in April. Rootline flagged them 90 days ago, one renewed, and the other technician is blocked from spray visits until the new card is uploaded. The H-2B workers arrive April 1. Their housing assignments and van routes are on the **Housing board**, and their visa and inbound travel reimbursements are queued in the first payroll ([4.4](#44-h-2b-and-seasonal-worker-program-support)).
- **July 14.** The forecast high is 104 F. The heat plan auto-activates high-heat procedures. Start times shift 1 hour earlier for routes the Company tagged "heat-flex". New hires in their first two weeks get acclimatization check-ins. A technician reports dizziness. The crew lead logs the cool-down and first aid, and the safety admin later determines it is **not recordable** (first aid only), with the rationale saved.
- **Every Monday.** Rosa opens the **Timesheet approval board**. 38 of 42 timesheets are green (crew-lead approved, no exceptions). Four have exceptions: two missed clock-outs (AI proposes 3:42 p.m. and 4:05 p.m. from geofence exits; crew leads confirm), one CA meal premium flag (attested "too busy", premium auto-added), one 13.2-hour Thursday (double time applied). She approves, reviews the pay preview (regular, OT, DT, premiums, production bonus for the install crew, commission for the estimator) and pushes to Gusto. Rootline imports Gusto's payroll journal Tuesday and trues up job cost.
- **October.** Rootline runs the **Season retrospective**: first-90-day retention 81% (illustrative), top quit reason "found year-round work", and the crews with the highest kudos counts had the lowest turnover. Dana sets a "winter bridge" plan: snow crew and holiday lighting work for 8 of the best seasonal workers ([14](14-service-line-modules.md)).
- **November 22.** Bulk hibernation of 24 workers. Each gets a "See you in spring" SMS and a link to their hours history. Equipment returns are checked off. The H-2B workers' return transportation is reimbursed in the final pay, and their departure is logged in the H-2B workspace.

---

## 4. Feature specification

Feature IDs use module prefixes (`HR-`, `ATS-`, `ONB-`, `H2B-`, `CRED-`, `LMS-`, `PTO-`, `TIME-`, `RULE-`, `COMP-`, `PW-`, `BURD-`, `PAY-`, `EMB-`, `SAFE-`, `PERF-`, `ANN-`, `ESS-`, `RET-`, `OFF-`, `I18N-`, `DOC-`) so the roadmap ([24](24-roadmap-feature-catalog.md)) can reference them. Every feature carries a priority tag.

### 4.1 People records and organization structure

**HR-01 Employee record [MVP].** One `employee` per human per Company, separate from a login `membership` (an employee may have no login, and an external CPA may have a login with no employee record; [02](02-personas-roles-permissions.md)). Fields:

| Group | Fields | Rules |
|---|---|---|
| Identity | legal first/last name, preferred name, pronouns (optional), photo, employee number (auto, editable, unique per Company) | Preferred name shows in the crew app and on crew rosters. Legal name shows on payroll, certified payroll and OSHA logs |
| Contact | mobile (E.164, unique per Company among active employees), email (optional), preferred language (`en`, `es`, later `fr-CA`), preferred channel (SMS, WhatsApp [V1], push, email) | Mobile is the primary identifier for field staff. Language drives every message, document and training assignment |
| Employment | status (`applicant_hired`, `onboarding`, `active`, `on_leave`, `hibernated`, `terminated`, `archived`), hire date, original hire date, seniority date, worker type (`w2_employee`, `t4_employee`, `contractor_1099` [V1]), FLSA status (`non_exempt`, `exempt`), employment class (`full_time`, `part_time`, `seasonal`, `temporary`, `h2b`), branch, division, home crew, manager, job title (from position catalog), labor class (for burden and estimates) | Status transitions follow [7.3](#73-employee-and-employment-state-machine). Exempt status requires a salary at or above the jurisdiction threshold (validator warns; verify current federal and state thresholds) |
| Work authorization meta | payroll-provider onboarding status, I-9 completion status (yes/no/date from provider), E-Verify case status (from provider, if any), H-2B flag with visa validity dates and petition reference | Rootline stores status only, not I-9 documents. H-2B fields visible to `owner`, `office_manager` only |
| Sensitive (Restricted class, [20](20-architecture-security.md)) | date of birth, SSN/SIN (only if a file-based payroll export needs it; prefer the provider's employee ID), home address, driver's license number and state, bank details (never stored when a payroll provider is connected) | Field-level encryption. Step-up auth on every read session ([02](02-personas-roles-permissions.md)). DOB is stored to enforce youth rules, but the UI shows only "Under 18: yes/no" to non-HR roles |
| Safety | emergency contacts (2), medical notes the employee chooses to share (allergies such as bee-sting anaphylaxis, carries epinephrine) | Crew leads see emergency contacts and voluntarily shared allergy flags for their own crew ([02](02-personas-roles-permissions.md) safety exception). Medical notes are stored separately from the personnel file (ADA confidentiality; verify) |
| Sizing | shirt, pants, boot, glove, rain gear, hat | Feeds uniform and PPE issuance in [13](13-operations-inventory-equipment.md) |
| Skills | skills with levels (mowing, zero-turn, skid steer, paver install, irrigation troubleshooting, plant ID, Spanish/English fluency), languages spoken | Skills feed scheduling constraints ([04](04-scheduling-dispatch-routing.md)) and the career ladder ([PERF-05](#416-performance-recognition-and-gamification)) |

Validation: duplicate detection on mobile number, or legal name plus DOB, offers to **rehire** the existing record instead of creating a new one. Name changes keep history. Terminated employees cannot be assigned to Visits.

**HR-02 Employment stints and rehire history [MVP].** Each hire creates an `employment` row (start, end, reason, eligible-for-rehire, pay rate at end, employment class). Seniority rules (for PTO tiers, raises, ladder eligibility) are configurable: "cumulative seasons", "continuous since last hire" or "original hire date if rehired within N months" (default 12). California requires previously accrued, unused paid sick leave to be reinstated when an employee is rehired within one year (verify). The PTO engine reads this.

**HR-03 Org structure [MVP].** Company -> Branches -> Divisions (maintenance, enhancements, installation, lawn care, irrigation, snow, tree) -> Crews. Positions catalog with default labor class, default pay band, required credentials and required training. Reporting lines (`manager_employee_id`) feed approval routing. An employee has one home branch and division but can work across them. Hours are costed to the Visit's branch and division, not the employee's home ([09](09-accounting-ledger-integrations.md)).

**HR-04 Personnel file [V1].** A per-employee document vault with folders: Hiring, Onboarding, Pay changes, Credentials, Training, Performance, Discipline, Safety, Separation. Documents can be uploaded, generated (offer letter, pay change notice), or signed in Rootline. Access per folder by role ([9](#9-permissions)). Discipline and medical documents are hidden from crew leads. Every view is logged.

**HR-05 Pay change workflow [MVP].** Pay rate changes are effective-dated and need approval (requester -> `owner` or delegate, configurable threshold such as "raises above $2.00/hour need owner approval"). They generate a pay change notice in the employee's language. Several states require written notice of pay rate changes. California's Wage Theft Prevention Act notice is the reference (verify which states require notice and timing). Changes in a pay period that is already exported go to the next period with a retro adjustment line.

**HR-06 Bulk actions and seasonal lifecycle [MVP].** Bulk import (CSV, payroll-provider pull, last season's roster), bulk rehire, bulk hibernate, bulk pay raise ("+4% for all returning crew members"), bulk credential assignment. The membership lifecycle (invite, hibernate, rehire, offboard) is specified in [02 section 5.18](02-personas-roles-permissions.md). This module adds the HR artifacts (checklists, notices, records) for each transition.

**HR-07 Employee directory and org chart [V1].** Searchable directory with photo, preferred name, crew, phone (masked for technicians unless the Company allows peer phone visibility), languages and skills. Auto-generated org chart.

### 4.2 Recruiting and applicant tracking (spring hiring rush)

**ATS-01 Job requisitions and headcount plan [V1].** Requisitions created from the Season Plan ([RET-04](#419-retention-analytics-and-workforce-planning)) or manually: position, branch, count needed, target start date, pay range, employment class (seasonal, full-time, H-2B corresponding position), hiring manager, approval (owner). A requisition can be "evergreen" (always open for laborers).

**ATS-02 Job post builder, bilingual [V1].** Template library per position (laborer, crew member, crew lead, irrigation tech, lawn applicator, mechanic, account manager, estimator, designer, office). The AI drafts English and Spanish versions from the position and Company profile. A human reviews before publishing, and a translation-reviewed checkbox is required for the Spanish version. Fields: title, pay range (required where the work location's jurisdiction requires it), schedule ("Mon-Fri 7:00-3:30, some Saturdays, Apr-Nov"), benefits, physical requirements, license requirements (for example "CDL Class B preferred", "must obtain a pesticide applicator license within 90 days"), driver's license requirement (only if the job truly requires driving, a fair-chance consideration), "No résumé needed", "Se habla español".

Validation rules (the **posting validator**, part of rule packs):
- Pay range present and within the allowed spread where required. California, Colorado, Washington, New York, Illinois and others require ranges, and Ontario (from Jan 1, 2026) requires compensation information plus disclosure of AI use in screening and whether the vacancy exists (verify each).
- Blocks phrases flagged as potentially discriminatory (age: "young", "recent grads"; national origin: "must be US citizen" unless legally required; "native English speaker").
- Blocks criminal-history screening language where fair-chance laws prohibit it in postings (California, NYC, others; verify).
- If the requisition is tied to an H-2B job order, the post must match the job order's terms (wage, duties, hours) for corresponding employment ([H2B-07](#44-h-2b-and-seasonal-worker-program-support)).

**ATS-03 Distribution [V1].** Publish to: the Company careers page (rendered by the website builder in [16](16-marketing-growth-communications.md)), Indeed (via XML feed or partner API, verify program terms), Google for Jobs (JobPosting structured data on the careers page), Facebook (link post), ZipRecruiter [V2], Craigslist (copy-paste helper), state job banks (copy helper). Also **QR code flyers** (printable PDF in English and Spanish for truck windows, nursery and supply-house bulletin boards, laundromats and churches) and **SMS keyword** ("Text TRABAJO to (916) 555-0100") using the Company's 10DLC number with a separate recruiting campaign registration ([16](16-marketing-growth-communications.md)). Each source has a tracking code for cost-per-hire analytics.

**ATS-04 Mobile apply, Spanish-first [V1].** A no-account, no-résumé, 3-minute flow:
1. Language picker (English / Español) remembered by device.
2. Name, mobile (verified by SMS code), and optionally email.
3. Position-specific knock-out questions, 3 to 6 maximum, written by the Company with templates, for example: "¿Tiene licencia de conducir válida?" / "¿Puede levantar 50 lb?" / "¿Está disponible de abril a noviembre?" / "¿Tiene experiencia con podadoras zero-turn?". Answers can be tap, text or **voice** (30-second recording, transcribed and translated for the reviewer with the original audio kept).
4. Availability grid (days and earliest start date).
5. Optional: upload photos of licenses or certificates, work-history text, referral ("¿Quién le recomendó?").
6. Consents: SMS consent for hiring messages (TCPA), privacy notice (CCPA notice at collection for California applicants; verify), and an EEO voluntary self-identification step only where the Company chooses to collect it. That data is stored separately and never shown to reviewers.
7. Confirmation text with the Company name and the next step.

Rules: no date of birth, SSN, photo of person, immigration status or criminal history questions in the application (blocked in the template builder; "are you authorized to work in the US/Canada?" yes/no is allowed). Questions shown to the applicant are in the selected language. Reviewers see the original plus a machine translation labeled as such. Accessibility: WCAG 2.2 AA, large tap targets, works on low-end Android over 3G, under 300 KB initial load (target).

**ATS-05 Pipeline board [V1].** Kanban per requisition with stages configurable from defaults: `applied -> contacted -> screening -> interview_scheduled -> interviewed -> offer_sent -> offer_accepted -> onboarding -> hired`, plus `withdrawn`, `not_selected`, `no_show`. Card shows name, language, source, knock-out answers (with any failure highlighted but **not auto-rejected** unless the Company enables "auto-decline on failed required knock-out" for objective requirements such as a driver's license, with a templated message), days in stage and last contact. Bulk actions: text a group, move stage, schedule. Duplicate detection merges applicants who apply twice or are former employees (shows "Rehire eligible: yes / no / review").

**ATS-06 Two-way SMS and WhatsApp messaging [V1].** Conversations live in the unified inbox ([16](16-marketing-growth-communications.md)) tagged "Recruiting", visible only to roles with ATS access. Templates in English and Spanish: "Thanks for applying", "Can you talk today?", "Interview confirmation with map", "Bring your driver's license", "Offer", "Not selected" (respectful, optional "keep me in mind for next season"). STOP and opt-out handling per TCPA and carrier rules. WhatsApp [V1] through the Business API for workers who prefer it, which is common among recent immigrants (verify per-market demand).

**ATS-07 Interview scheduling [V1].** Interviewers publish availability blocks ("Tuesdays 9-12 at the yard"). The applicant gets numbered slots by SMS ("Reply 1, 2 or 3"). Confirmations and reminders go out 24 hours and 2 hours before, with a map link to the yard. Group "hiring day" events are supported ("Saturday March 14, 8-12, walk-ins welcome"), with QR check-in at the yard on a kiosk tablet. No-shows are tracked.

**ATS-08 Structured interview kits [V1].** Position-specific question sets with a rubric (1-4 per competency: reliability, safety awareness, equipment experience, teamwork, customer manner for crew leads). The same questions for every candidate in a requisition reduce bias. Interviewer notes support voice dictation. A "working interview" option (paid trial shift) creates a temporary employee record and a time entry so the trial is paid. Unpaid trial shifts are blocked by default because they usually count as hours worked (verify).

**ATS-09 Background checks and MVR [V2].** Partner integration (for example Checkr or a similar FCRA-compliant consumer reporting agency; vendor choice open). Order only **after a conditional offer** where fair-chance laws require it (the default everywhere). The workflow has standalone disclosure and authorization, a pre-adverse action notice with copy of report and summary of rights, a waiting period (default 5 business days, configurable per jurisdiction), and a final adverse action notice. Motor vehicle record (MVR) checks for driving positions, plus continuous MVR monitoring [V2] with consent. Results are Restricted data, visible only to `owner` and `office_manager`.

**ATS-10 Offers [V1].** Offer letter templates (English and Spanish) merged from the requisition: position, pay rate, start date, schedule, employment class, at-will statement (US), seasonal end-date expectation, benefits summary, contingencies. E-signed on phone. The offer expires after N days (default 3). Accept moves the applicant to `onboarding`, creates the Employee record (status `onboarding`) and starts the onboarding checklist. California and New York pay notices (Labor Code 2810.5 and NY Labor Law 195.1; verify) generate at hire in the employee's language.

**ATS-11 Referral program [V1].** Employees share a personal referral link or QR from the self-service app. Referral bonus rules: "$200 after referred hire works 90 days, $100 more after 500 hours" (configurable). Rootline tracks eligibility automatically from hours and exports bonuses to payroll as a supplemental earning when earned. The referral leaderboard is opt-in.

**ATS-12 Talent pool and seasonal re-engagement [V1].** Silver-medalist applicants and "keep me in mind" applicants go into a pool tagged by skills and language. Each January the pool and hibernated workers get a "We're hiring for spring" campaign. Pool records are purged after a retention period (default 2 years) unless the person re-consents.

**ATS-13 Hiring analytics [V1].** Applicants by source, cost per applicant and per hire (source costs entered), stage conversion, time-to-hire, offer acceptance rate, no-show rate, 90-day retention by source ([12](#12-metrics-and-kpis)).

> **Competitive edge:** None of the landscape suites in [R2](research/R2-landscape-specific-platforms.md) documents a native applicant pipeline [B]. Owners use Indeed's dashboard, texts on a personal phone and a paper application at the yard. Rootline's Spanish voice-answer apply flow and SMS slot booking target the real labor market: people who own a smartphone, have no résumé and will take the first job that texts them back.

### 4.3 Onboarding

**ONB-01 Onboarding checklist templates [V1] (basic checklist [MVP] per [02](02-personas-roles-permissions.md)).** Per position and employment class. Default seasonal laborer template:

| # | Task | Owner | Due | Blocking for first shift? |
|---|---|---|---|---|
| 1 | Offer e-signed | Applicant | Before start | Yes |
| 2 | Payroll provider onboarding (W-4/state forms or TD1, direct deposit, I-9 Section 1) via provider link | Employee | Before or on day 1 | No (I-9 Section 1 by first day; status synced) |
| 3 | I-9 Section 2 document examination (in provider, or in person) | `office_manager` | Within 3 business days of start (verify) | No, but escalates on day 2 |
| 4 | Handbook acknowledgment (EN/ES) | Employee | Day 1 | Yes |
| 5 | Safety policy, injury and illness prevention program (IIPP in CA) acknowledgment | Employee | Day 1 | Yes |
| 6 | Heat illness prevention training (CA/WA/OR and where the Company enables it) | Employee | Before outdoor work | Yes in CA during heat season (configurable) |
| 7 | Electronic monitoring and location tracking notice acknowledgment | Employee | Before first punch | Yes where required (NY; Ontario policy distribution; Company setting elsewhere) |
| 8 | Emergency contacts, sizes | Employee | Day 1 | Emergency contact: yes |
| 9 | Equipment issuance: uniforms, PPE (safety glasses, hearing protection, gloves, chaps for saw users), fob, phone or tablet if Company-owned | `office_manager` / yard | Day 1 | PPE: yes |
| 10 | Equipment training modules: mower, trimmer, blower, zero-turn (slope limits), trailer hitching | Employee + crew lead sign-off | First week | Per equipment: blocks operating that equipment |
| 11 | Credential upload (driver's license for drivers, pesticide license, CDL medical card) | Employee | Before relevant work | Blocks relevant tasks only |
| 12 | Buddy assignment (first 2 weeks) | Crew lead | Day 1 | No |
| 13 | 7-day and 30-day check-in | Manager | Day 7, day 30 | No |

Rules: checklist progress is visible to the employee in the self-service app. Overdue items notify the owner of the task and then escalate. Items can be completed by the employee, by staff on the employee's behalf (with attestation), or by the system (training completion).

**ONB-02 E-signature [MVP for handbook acknowledgment, V1 for all documents].** Built-in signature (draw or type, with timestamp, IP or device ID, geolocation if permitted, and a document hash) meeting ESIGN and UETA expectations. Signed PDFs are stored immutably in the personnel file. Bilingual documents carry both language versions or a "language of signature" record. When a translation exists, the PDF states which version controls (default: English controls, configurable; verify with counsel per jurisdiction).

**ONB-03 Payroll-provider onboarding hand-off [MVP].** For Gusto, ADP, Paychex and QuickBooks Payroll, Rootline creates the employee in the provider (where the API allows) or presents the provider's self-onboarding link. It then polls or receives webhooks to mark tax forms, direct deposit and I-9 Section 1 complete. For providers without APIs, the checklist item is manual. Rootline never collects W-4 data itself in MVP, which keeps tax data in the system that files it.

**ONB-04 Handbook builder [V1].** A template handbook (EN/ES) with sections common to landscape companies: attendance and call-in, rain days and weather pay policy, vehicle and equipment use, cell phone use while driving, PPE, drug and alcohol, harassment, timekeeping (no off-the-clock work, how to fix missed punches), meal and rest breaks, heat illness, chemical safety, uniforms, tool loss, social media, client property and photo rules, tips. State supplements are flagged for counsel review. Version control: a new version triggers re-acknowledgment for affected employees. The AI can explain a policy in plain Spanish in the self-service app, quoting the section ([10](#10-ai-opportunities-in-this-module)).

**ONB-05 Equipment and uniform issuance [MVP].** One click issues the position's default kit from inventory ([13](13-operations-inventory-equipment.md)). Custody is recorded per item (serial or quantity) with a signed receipt. Wage-deduction guardrails: Rootline never creates payroll deductions for unreturned or damaged equipment automatically. Where a Company enables a deduction policy, the system requires the employee's signed written authorization and blocks deductions that would reduce pay below minimum wage or overtime due. Several jurisdictions, California among them, largely prohibit such deductions (verify).

**ONB-06 Pre-start welcome [V1].** A welcome SMS with the yard map, start time, what to bring (boots, water bottle, lunch), the crew lead's name and photo, and a 60-second welcome video from the owner in Spanish and English.

**ONB-07 Contractor onboarding [V1].** For 1099 / independent contractors (rare in crews; more common for designers or consultants): W-9 collection, COI upload, contract e-sign, classification checklist (ABC test warning for California and similar states, verify). Subcontractor companies are onboarded in [13](13-operations-inventory-equipment.md).

### 4.4 H-2B and seasonal worker program support

> **Scope and legal guardrail.** The H-2B workspace is an organizer, calendar and record keeper. It does not prepare, file or advise on DOL or USCIS forms, and it does not decide eligibility. Every screen has a persistent banner: "Rootline helps you track your H-2B process. It is not legal advice. Confirm all filings and obligations with your immigration attorney or agent." Agents and attorneys can be invited as **external collaborators** with access limited to the H-2B workspace ([9](#9-permissions)).

**H2B-01 Season program record [V1].** One `h2b_program` per Company per season (for example "2027 Season - date of need April 1, 2027"). Fields: date of need, end date, number of workers requested, job title(s), SOC code, worksite addresses, offered wage per position, agent/attorney contact, DOL case number, USCIS receipt number, cap half (first half Oct 1 or second half Apr 1), status.

**H2B-02 Milestone tracker [V1].** A Gantt-style timeline generated from the date of need, using the program's standard sequence (offsets are defaults the user edits to match the agent's plan; verify current DOL and USCIS timing each season):

| Milestone | Default timing (relative to date of need) | Basis (verify) |
|---|---|---|
| Decide headcount and positions | -150 days | Company planning |
| Prevailing wage request (ETA-9141) submitted | -150 to -120 days | Must be obtained before filing the labor certification |
| Prevailing wage determination received | -90 days | Processing times vary |
| H-2B registration or job order to State Workforce Agency | -90 to -75 days | 20 CFR 655 Subpart A |
| Labor certification application (ETA-9142B) filed | 90 to 75 days before date of need | 20 CFR 655.15 filing window |
| Recruitment (SWA job order, SeasonalJobs.dol.gov posting, contact former US workers, required ads) | After Notice of Acceptance | 20 CFR 655 Subpart A |
| Recruitment report submitted | Per Notice of Acceptance | |
| Labor certification decision | -45 to -30 days | |
| USCIS I-129 petition filed (premium processing optional) | After certification | USCIS cap rules |
| Petition approved | | |
| Consular appointments (DS-160, interview) per worker | -30 to -7 days | Consulate scheduling |
| Worker travel and arrival | Date of need | |
| Mid-season: three-fourths guarantee checkpoints | Every 12 weeks (6 weeks if period under 120 days) | 20 CFR 655.20 |
| Departure and return transport | End date | |
| Records retained | 3 years after certification period | 20 CFR 655.56 (verify section) |

Each milestone has an owner (Company, agent, worker), status, due date, documents and reminders (30/14/7/1 days). The tracker shows risk: "Labor certification filed 3 days before the window closes" turns amber. Copilot can answer "Where are we on H-2B?" from the tracker.

**H2B-03 Worker roster and case files [V1].** Each H-2B worker has a case: name, returning or new, consulate, appointment date, visa issued date, visa validity, entry date, I-94 end date, petition reference, housing assignment, transport assignments, inbound reimbursement status, document checklist (passport copy, visa, I-94, signed job order copy in the worker's language). Document storage is Restricted class, with access limited to `owner`, `office_manager` and invited agents.

**H2B-04 Job order and disclosure delivery [V1].** Stores the certified job order and tracks delivery to each worker in a language the worker understands, no later than the time the worker applies for the visa (20 CFR 655.20, verify). The worker e-acknowledges receipt in the self-service app or on paper (scanned).

**H2B-05 Reimbursements engine [V1].** Creates pay items the payroll export carries:
- Visa, visa-processing, border-crossing and related fees: reimbursed in the first workweek (default; verify).
- Inbound transportation and daily subsistence: tracked per worker. Reimbursement is due by the time the worker completes 50% of the period of employment, or earlier to the extent the FLSA requires (costs that bring first-week wages below the minimum wage must be covered in week 1; verify).
- Return transportation and subsistence: due if the worker completes the period or is dismissed early (verify).

Each item lists the amount, receipt, earning code (non-taxable reimbursement vs taxable, set by the provider mapping) and the date due. The **first-week minimum wage check** computes `(gross wages - worker-borne inbound costs not yet reimbursed) / hours >= applicable minimum wage` and creates the needed reimbursement amount automatically.

**H2B-06 Three-fourths guarantee tracker [V1].** Computes hours offered (scheduled plus worked) against 3/4 of the workdays times the job order's daily hours for each 12-week period (6 weeks for short periods). Weather days count as offered only if the Company offered the hours (rule per program terms; verify). The dashboard shows "Period 2: 312 of 360 guaranteed hours offered, 6 weeks left" and warns when it is projected short. At period end, a shortfall creates a "guarantee pay" pay item for review.

**H2B-07 Corresponding employment and wage parity [V1].** US workers doing substantially the same work as H-2B workers must get at least the same wage and terms (verify scope under the current rule). The rule engine flags any employee in the same position and worksite paid below the H-2B offered wage, and blocks a pay change that would create such a gap unless the owner overrides it with a reason.

**H2B-08 Earnings statement and records [V1].** Validates that payroll exports include the data H-2B earnings statements need (hours offered, hours worked, rate, piece-rate details, deductions). Rootline cannot control the provider's pay stub, but it generates a **supplementary hours statement** per pay period in the worker's language. Retention is locked for the required period.

**H2B-09 Abandonment and early separation notices [V1].** If an H-2B worker misses 5 consecutive working days without consent, the tracker starts the clock for the required notice to DOL and DHS (within 2 working days after the 5th day, verify) and drafts the notice for the agent. Terminations of H-2B workers prompt the same review.

**H2B-10 Housing board [V1].** H-2B does not generally require employer-provided housing (unlike H-2A), but many landscape Companies arrange it (verify obligations if provided). The board covers units (address, landlord, beds, rent, lease dates), bed assignments, move-in and move-out dates, house rules acknowledgment (EN/ES), inspections with photos, maintenance requests from residents, and charges. A housing charge that is deducted from pay requires written authorization. It is checked against the minimum wage floor and flagged for review because deductions primarily benefiting the employer are restricted (verify).

**H2B-11 Transport board [V1].** Arrival logistics (airport or border crossing pickups by flight or bus), and daily transport from housing to the yard: vans, drivers (must hold valid credentials, [4.5](#45-certifications-licenses-and-qualification-enforcement)), seats, pickup times. Optional route optimization for multi-house pickups using the same routing service as [04](04-scheduling-dispatch-routing.md) [V2]. Whether transport time is compensable depends on the facts (verify). Rootline lets the Company choose a segment type for it.

**H2B-12 Season retrospective and next-season start [V1].** Exports a season summary for the agent: headcount by month, hours, wages paid vs offered, guarantee met, departures. One click clones the program for next season.

**H2B-13 Other programs [V2].** The same workspace pattern is generalized for Canada's Temporary Foreign Worker Program (LMIA-based; verify) and for J-1 or other seasonal programs where relevant.

> **Competitive edge:** We found no landscape FSM that tracks H-2B milestones, guarantees and reimbursements [B]. Employers rely on their agent's emails plus spreadsheets. Combining program milestones with live hours (three-fourths guarantee), payroll (reimbursements, wage parity) and housing is something only an operations-plus-payroll platform can do.

### 4.5 Certifications, licenses and qualification enforcement

**CRED-01 Credential catalog [MVP].** Platform-curated catalog (`platform_curator` maintains it, [19](19-platform-admin-portal.md)) with Company-defined additions. Each `credential_type` has an issuing authority, jurisdiction, categories, validity rules, renewal requirements (CEUs), document requirements and verification method. Launch catalog (US and Canada; all details verify per jurisdiction):

| Credential | Typical rules to model | Gates |
|---|---|---|
| Pesticide applicator license (commercial/certified, by state or province and category; for example, turf and ornamental) | Expiry date, category list, recertification credits per cycle, "under supervision" status for non-certified technicians where the state allows | Chemical application step in the crew app, restricted-use product issue ([13](13-operations-inventory-equipment.md)), dispatch of chem visits ([14](14-service-line-modules.md)) |
| Pesticide business license (Company-level) | Expiry; required to offer the service | Lawn-care program sales and visits |
| Driver's license (class, endorsements, restrictions) | Expiry, state, class | Assigning as driver of any vehicle |
| CDL (Class A/B, endorsements) + DOT medical certificate | Expiry of both, Clearinghouse pre-employment and annual queries, drug and alcohol testing program enrollment | Assigning CMV vehicles or trailer combos over thresholds ([13](13-operations-inventory-equipment.md) checks GVWR) |
| ICPI / CMHA Concrete Paver Installer (ICPI is now part of the Concrete Masonry and Hardscapes Association; verify program name) | Certification date, recert requirements | Optional required-for on paver patio jobs (Company setting; some manufacturer warranties require it, verify) |
| ISA Certified Arborist (and TRAQ, Utility Specialist) | Expiry, CEU count (ISA recertification commonly cited as 30 CEUs every 3 years; verify) | Tree risk assessments, arborist reports in [14](14-service-line-modules.md) |
| TCIA CTSP, EHAP (electrical hazards awareness for tree workers) | Expiry | Line-clearance-adjacent tree work |
| Backflow prevention assembly tester (state or municipal, for example ASSE 5110-based) | Expiry, test-gauge calibration date (often annual) | Backflow test visits and test report signing ([14](14-service-line-modules.md)) |
| Irrigation licenses (for example Texas Licensed Irrigator / Irrigation Technician; New Jersey certified irrigation contractor; Irrigation Association CIT/CLIA/CIC) | Expiry, CEUs, license number printed on permits | Irrigation installs in licensing states |
| Landscape Industry Certified (NALP) | Expiry | Optional, ladder progression |
| First Aid / CPR / AED | Expiry (commonly 2 years) | Each crew must have at least one current holder (Company rule) |
| Forklift / powered industrial truck | Evaluation every 3 years (29 CFR 1910.178, verify) | Yard forklift use |
| Skid steer, mini excavator, aerial lift, crane (NCCCO for cranes) | Company-defined or third-party | Equipment assignment |
| Chainsaw / chipper operator (Company competency sign-off) | Annual re-check (Company) | Tree and storm cleanup tasks |
| Low-voltage lighting contractor license (where required, verify state) | Expiry | Lighting installs ([14](14-service-line-modules.md)) |
| Snow: SIMA Advanced Snow Manager (optional) | Expiry | None by default |
| Contractor license (Company-level, for example California C-27 Landscaping Contractor; verify) | Expiry, bond, classification | Project proposals above thresholds |
| Subcontractor COI and licenses | Expiry, coverage limits, additional insured | Sub assignment ([13](13-operations-inventory-equipment.md)) |

**CRED-02 Credential records [MVP].** Holder (employee, subcontractor org, or Company), type, number (Restricted if a driver's license), jurisdiction, categories, issue date, expiry date, status (`pending_verification`, `active`, `expiring`, `expired`, `suspended`, `revoked`), document images (front and back), verification (method, verifier, date), CEUs earned toward renewal. Employees can upload their own from the self-service app by photographing the card. **OCR + AI extraction** [V1] reads the name, number, category and expiry and asks the employee to confirm. A manager verifies before status becomes `active`. Optional lookup against public state license databases where available [V2] (scraping is not used where terms forbid it; official APIs or manual verification otherwise).

**CRED-03 Expiry alerts [MVP].** Configurable lead times (default 90, 60, 30, 14, 7, 1 days) to the holder (SMS/push in their language) and to `office_manager` and `ops_manager`. Weekly digest: "4 credentials expire in the next 30 days." Copilot shows renewal steps for common credentials (links to the issuing authority, CEU count needed) [V1].

**CRED-04 Requirement rules [MVP].** Rules map work to credentials:
- `service` or Price Book item requires credential (for example "Pre-emergent application requires pesticide applicator, category Turf & Ornamental, in the Property's state").
- `equipment` or vehicle class requires credential (for example "Truck + 14k trailer combo requires Class A CDL or non-CDL if under threshold, with medical card if CMV").
- `task type` requires a minimum age (18 for chain saws, chippers, abrasive cutting discs under HO 14; 18 for certified pesticide application; driving restrictions under 18; verify).
- `crew composition` rule: "Each crew needs at least one current First Aid/CPR holder", "Chem visit crew needs at least one certified applicator on site when non-certified technicians apply under supervision" (state permitting).
- `job` requires credential (customer- or contract-mandated, for example a municipal contract requiring ISA arborist on site).

**CRED-05 Scheduling enforcement [MVP].** In dispatch ([04](04-scheduling-dispatch-routing.md)) and the crew app ([05](05-field-crew-mobile-app.md)):

| Enforcement level | Behavior | Default for |
|---|---|---|
| `hard_block` | Cannot assign. No override except `owner` with reason (logged and reported) | Legal requirements: pesticide application by uncertified person where supervision not allowed, CDL-required vehicle, under-18 hazardous tasks |
| `override_with_reason` | Assignment allowed by `ops_manager`/`office_manager` with reason picker ("renewal submitted - receipt on file", "supervisor present") | Credentials in grace period, Company policy requirements |
| `warn` | Visible warning chip on the visit and the crew | Recommended credentials |

Checks run on assignment, on route publish, at punch-in (the crew app re-checks offline against cached credential status), and at the chemical step. An expiring credential that will lapse before a scheduled visit date creates a **future conflict** list for dispatchers: "3 visits on May 2 need an applicator; Luis's license expires April 30."

**CRED-06 CEU tracking [V1].** Training completions and external CEU certificates (uploaded) count toward the renewal requirements of credentials. Progress bar: "Pesticide recert: 9 of 12 credits, 2 in category 3A needed, due Dec 31." Copilot suggests approved courses (from a curated list, not invented).

**CRED-07 Company credential wallet and bid packet [V1].** Company-level licenses, COIs, safety program documents and employee credential summaries can be packaged into a bid compliance packet ([03](03-crm-sales-estimating-proposals.md) `BID-05`) or a commercial client's vendor onboarding portal.

**CRED-08 Driver qualification file [V1].** For CMV drivers: application for employment, MVR at hire and annually, road test or equivalent, medical certificate, Clearinghouse queries, annual review (49 CFR 391, verify applicability). Checklist with expiry tracking. For non-CMV drivers: Company policy (MVR annually, insurance carrier approval).

> **Competitive edge:** Real Green and lawn-care tools tie applicator license fields to chemical records [B], and Aspire, Jobber and LMN rely on custom fields [B]. Rootline enforces credentials where the risk happens (dispatch, punch-in and the chemical step) and works offline. It looks ahead to scheduled dates, so an expiring license is a planning problem in March instead of a fine in May.

### 4.6 Training and LMS

**LMS-01 Content library [V1] (tailgate talks [MVP] in [05](05-field-crew-mobile-app.md)).** Three tiers:
1. **Platform library** (curated by `platform_curator` with safety and horticulture SMEs, EN/ES at launch): equipment safety (mower slopes, zero-turn rollover, trimmer, blower, hedge trimmer, chainsaw, chipper, skid steer basics, trailer hitching and load securement), heat illness, cold stress, lightning, lifting, PPE, chemical handling and label reading, spill response, silica dust when cutting pavers, traffic safety in roadside work, bees and wasps, poison ivy, customer property etiquette (gates, pets, photos), plant ID basics (by region, linked to the Plant KB in [12](12-plant-knowledge-base.md)), pruning basics, mulching standards (2-3 inches, no volcano mulching), mowing standards (one-third rule, stripe patterns), irrigation start-up and winterization procedures, snow plowing safety.
2. **Company SOPs:** the Company records its own videos ("How we edge beds at Green Valley") on a phone. Rootline transcribes, subtitles in both languages, cuts to under 3 minutes with AI-suggested chapters and lets the author add a quiz.
3. **Partner content** [V2]: manufacturer equipment training, association courses (NALP, state associations), SCORM 1.2/xAPI import.

**LMS-02 Micro-lessons [V1].** Format: vertical video of 60-180 seconds, captions in EN/ES, audio track per language (human voice preferred, or AI voice dubbing reviewed by a bilingual human before publish), 1-3 question quiz, offline download on Wi-Fi. Each lesson has tags (equipment, task, service line, hazard, credential CEU eligibility).

**LMS-03 Quizzes and competency sign-offs [V1].** Question types: picture choice ("¿Cuál es el EPP correcto?" with photos), true/false, ordering steps, and "show me" practical sign-off where the crew lead observes and signs ("Luis hitched trailer correctly: chains crossed, breakaway connected, lights checked"). Pass threshold per lesson (default 80%) with unlimited retries and spaced-repetition review prompts at 7 and 30 days [V2]. Quiz results never feed automated discipline.

**LMS-04 Assignment rules [V1].** Auto-assign by position, equipment authorization, credential renewal, onboarding stage, season ("Snow safety refresher" on Nov 1), incident follow-up ("Trailer backing" after a backing incident), language. Due dates and reminders. Training time is paid working time. Each lesson start and finish creates a `training` time segment in the crew app (with the employee clocked in) or a manual time entry for review if completed off the clock. The app warns: "Training must be done on the clock."

**LMS-05 Equipment authorization matrix [V1].** Each equipment class (from [13](13-operations-inventory-equipment.md)) has required lessons and a practical sign-off. The matrix shows people x equipment with authorized / in training / not authorized. Assigning an unauthorized operator to equipment in dispatch is a `warn` or `override_with_reason` per Company setting. Underage workers are hard-blocked for HO-restricted equipment.

**LMS-06 Safety training records [MVP for tailgate attendance export, V1 full].** Every tailgate talk, lesson, quiz, sign-off and external training certificate is stored with date, trainer, language, attendees, duration and content version. Exports cover OSHA documentation, insurer loss-control reviews, Cal/OSHA IIPP and heat training records, and pesticide CEU submissions.

**LMS-07 Career ladder learning paths [V2].** Paths per ladder step ("Crew Member II -> Crew Lead: leading a tailgate talk, client communication, timesheet approval, basic estimating") with progress tied to [PERF-05](#416-performance-recognition-and-gamification).

**LMS-08 English and Spanish language learning [V2].** Optional micro-lessons in "Job-site English" and "Spanish for supervisors", both of which help promotions. Partner content or AI-generated lessons reviewed by humans.

### 4.7 Availability, time off and PTO accrual

**PTO-01 Availability [MVP].** Employees set recurring availability (days, earliest start, latest end) and exceptions ("Saturdays only after May 15"). Students and part-timers can set a max hours per week. Availability feeds scheduling ([04](04-scheduling-dispatch-routing.md)) as soft constraints, or hard ones for minors (school-hour limits for 14-15-year-olds under federal rules; verify state rules).

**PTO-02 Time-off requests [MVP].** From the self-service app: type (vacation/PTO, sick, unpaid, bereavement, jury duty, voting, other), dates or partial day, note (sick reason is optional and never required where laws prohibit requiring it, verify). Routing goes to the manager, then optionally to `office_manager`. Approval checks crew coverage ("Crew 3 would be at 2 of 4 on May 8"), blackout dates (for example "No vacation April 1-May 31 except approved exceptions" with an override path, and never applied to statutory sick leave), and the balance. Approved time off removes the person from schedules and notifies dispatch.

**PTO-03 Balances from payroll provider [MVP].** When the payroll provider owns accrual policies (common with Gusto, ADP and Paychex), Rootline reads balances where the API allows and shows them in the self-service app with a "last synced" time. Approved PTO hours export as PTO earnings so the provider deducts the balance.

**PTO-04 Native accrual engine [V1].** For Companies that want Rootline as the system of record (and required for embedded payroll). Policy definitions:

| Parameter | Options |
|---|---|
| Method | per hour worked (e.g., 1 hour per 30 hours), per pay period, annual frontload, frontload with proration for seasonal start |
| Eligible hours | all hours, excluding OT, excluding training (configurable; statutory sick leave usually counts all hours, verify) |
| Waiting period | days before use (e.g., 90 days) |
| Caps | accrual cap (balance), annual usage cap, carryover cap, max balance |
| Year | calendar, anniversary, fiscal |
| Payout | on termination (required in some states for vacation, for example California treats vested vacation as wages; verify), not paid, or per policy |
| Rehire | reinstate unused balance if rehired within N months (California sick leave: 1 year, verify) |
| Tenure tiers | 0-1 seasons: 40 h; 2-4 seasons: 60 h; 5+: 80 h |
| Holidays | Company holiday calendar (paid / unpaid, eligibility after N days, holiday pay rules if worked) |

**Statutory templates** (platform-maintained, versioned with rule packs): California paid sick leave, Washington paid sick leave, Oregon sick time, New York paid sick leave, Colorado HFWA, New Jersey earned sick leave, Illinois Paid Leave for All Workers Act, Minnesota ESST, and city ordinances such as NYC, Chicago and Seattle. Canadian provincial vacation pay (4% or 6% of wages paid per period or accrued) and personal emergency leave are also covered. All are verify-before-release. Each template locks fields that the law requires and lets the Company be more generous.

The ledger of PTO transactions (`accrual`, `usage`, `adjustment`, `payout`, `forfeit`, `reinstatement`) is append-only. The balance is a derived sum. Each pay period's accrual is computed from approved timesheets at period close.

**PTO-05 PTO liability [V1].** The accrued unused PTO balance x current rate (+ burden option) gives the liability report and a monthly journal entry suggestion for the Ledger ([09](09-accounting-ledger-integrations.md)).

**PTO-06 Rain days and weather call-offs [MVP].** "Rain day" bulk action from dispatch sends a call-off message in each employee's language and records whether the Company pays show-up or reporting-time pay. California reporting time pay (half the scheduled day, minimum 2 hours, maximum 4, at the regular rate, when an employee reports but is given less than half the usual work; verify, with exceptions for acts of God) and similar rules in other states are evaluated by the rule pack from punches (shop-arrival punch with less than the threshold of work). Optional "rain day PTO" lets employees elect to use PTO for the lost hours. This is never forced where law prohibits it.

### 4.8 Time and attendance: timesheets and approvals

Punch capture is owned by the crew app ([05 section 4.5](05-field-crew-mobile-app.md)). Punches are append-only events and timesheets are derived server-side ([20](20-architecture-security.md)). This module owns the approval workflow, the pay calculation and the exports.

**TIME-01 Timesheet derivation [MVP].** For each employee and workweek, the server builds `time_segment` rows from punch events. Segment types are `shop`, `drive`, `job`, `meal_break`, `rest_break`, `training`, `equipment_repair` and others, each with: cost object (Visit, Job phase/task, overhead bucket, equipment WO), branch, division, work location (address and tax jurisdiction), pay classification (for prevailing wage), piece-rate units (if any), and source (punch, crew punch, manual, kiosk, AI-suggested). Rules:
- Overlaps are impossible for one employee. If two devices produce overlapping segments, the later-received is flagged `conflict` for review, never silently dropped.
- Gaps between clock-in and clock-out without a segment become `unallocated` (paid, flagged).
- Rounding: optional per Company for non-meal punches only (nearest 5, 6 or 15 minutes, neutral), never for meal segments, and disabled entirely in California by default given case law skepticism of rounding (verify).
- Work location per segment drives multi-state and local tax allocation ([PAY-06](#413-payroll-integrations-and-pay-period-close)).

**TIME-02 Exception detection [MVP].** Each timesheet is scored for exceptions before approval:

| Exception | Rule | Severity |
|---|---|---|
| Missing clock-out | Open shift > 14 h or clock-out absent at day end | Blocking |
| Long shift | > 12 h in a day (configurable) | Warning |
| Short or missing meal (jurisdiction) | Per rule pack (CA: meal start after 5:00 of work, meal < 30 min, second meal after 10:00) | Blocking until attested or premium accepted |
| Attestation "No" (meal or rest not provided) | From [05 section 4.5.7](05-field-crew-mobile-app.md) `premium_pay.flagged` | Auto-premium, requires approver acknowledgement |
| Punch far from any geofence | > 500 m from any scheduled property, shop, dump or supplier | Warning with map |
| Edited after crew approval | Any edit with reason | Info, audit trail |
| Overtime threshold crossed | Daily or weekly per rule pack | Info, cost visibility |
| Unallocated time > 15 min | Gaps between segments | Warning |
| Job time without a Visit | Segment of type `job` with no Visit | Warning, assign before approval |
| Minor working beyond allowed hours | Youth hours rules | Blocking |
| Training off the clock | Training completion with no time segment | Warning, add entry |
| H-2B guarantee risk | Projected shortfall | Info |
| Prevailing wage classification missing | Segment on a certified job without a classification | Blocking for certified jobs |

**TIME-03 Multi-level approval [MVP].** Level 1: crew lead approves daily at end of day (from [05](05-field-crew-mobile-app.md)). Level 2: `ops_manager` (branch) or `office_manager` approves weekly. Level 3 (optional): `owner` for timesheets with blocking exceptions overridden. The employee **acknowledges** their weekly timesheet in the self-service app (optional by Company; recommended in CA). A dispute opens a comment thread instead of blocking payroll. Approved timesheets lock. Post-approval changes require `timesheet.edit_approved` (owner, office_manager), create a correction record with reason, and flow as an adjustment to the next export if the period is already exported ([02](02-personas-roles-permissions.md) limits on edit hours apply).

**TIME-04 Approval board [MVP].** The web screen ([6.2](#62-wireframe-timesheet-approval-board)) is exception-first. It shows green timesheets collapsed and supports a bulk "approve all clean". The exception queue has suggested fixes (AI anomaly agent A17 from [17](17-ai-copilot-automation.md) proposes clock-out times from geofence exits and visit completions, and a supervisor accepts or edits every suggestion). Per-row hours split (REG/OT/DT/premiums/PTO) and an estimated gross preview appear for roles allowed to see pay rates.

**TIME-05 Manual time entries [MVP].** For people without devices or for missed days: entered by staff with a required reason, attributed to the enterer, and visible to the employee for acknowledgment. Manual entries above a threshold (default 4 hours per week per employee) are flagged in compliance reports.

**TIME-06 Kiosk and shop clock [V1].** Wall tablet at the yard ([05](05-field-crew-mobile-app.md) kiosk mode) for clock-in by PIN with an optional photo (no face matching). Also shows announcements, daily crew assignments and safety talk sign-ins.

**TIME-07 Shop, drive and job time policy [MVP].** Company settings define how shop and drive segments are paid (always paid by default) and costed (overhead, allocated to the next visit, or spread across the day's visits; [05](05-field-crew-mobile-app.md) and [09](09-accounting-ledger-integrations.md)). Prevailing wage jobs may require travel at a specific rate (rule per contract).

**TIME-08 Weekly timesheet acknowledgment and pay explainer [V1].** The employee sees a bilingual breakdown: "Regular 40.0 h x $21.00 = $840.00; Overtime 6.5 h x $32.18 = $209.17 (overtime rate includes your production bonus); Meal premium 1 x $21.45 = $21.45; Production bonus $62.00; Tips $35.00 (from 3 clients)." The employee can tap any line for an explanation in Spanish (Copilot, grounded in the rule pack text). Disputes route to the office.

### 4.9 Pay rules engine and jurisdiction policy packs

**RULE-01 Policy packs [MVP: Federal baseline + California + Washington + Oregon + Colorado + New York; V1: all US states + DC, Ontario, British Columbia, Alberta, Quebec; V2: city ordinances beyond sick leave].** A policy pack is a versioned, platform-maintained bundle (`platform_engineer` maintains the code, counsel-reviewed content is released through [19](19-platform-admin-portal.md)). It contains:
- Workweek and overtime rules (weekly thresholds, daily thresholds, 7th-day rules, double time, alternative workweek schedules where adopted with proof of a valid election).
- Meal and rest rules (windows, durations, waivers, premiums, on-duty meal agreements).
- Reporting-time, split-shift and call-in pay.
- Minimum wages (state, county, city; effective-dated, with scheduled increases loaded in advance).
- Exempt salary thresholds.
- Piece-rate rules (California Labor Code 226.2 separate pay).
- Paid sick leave templates ([PTO-04](#47-availability-time-off-and-pto-accrual)).
- Youth hour and task limits.
- Final pay timing rules.
- Pay-stub and notice requirements (used for validations and templates).
- Heat rule thresholds ([SAFE-05](#415-safety-management)).

Packs are evaluated by **work location of each segment** (a Nevada crew working a Lake Tahoe property in California gets California rules for those hours; verify multi-state rules with counsel). Each pack version has an effective date range, so recalculating an old week uses the pack in force that week. Companies can be **more generous** (e.g., OT after 8 hours in all states), never less, for locked statutory fields. A Company override of an unlocked field records who changed it and why.

**RULE-02 Overtime calculation [MVP].** Per employee per workweek:
1. Sum hours worked by day from approved segments (excluding unpaid meals).
2. Apply daily thresholds first (where the pack has them), then weekly, then 7th-day rules, without double-counting hours (hours already paid as daily OT do not count again toward weekly OT; verify per state).
3. Compute the **regular rate** for the week: `(sum of straight-time earnings for all hours at their rates + nondiscretionary bonuses allocated to the week + piece-rate earnings + shift differentials + commissions allocated to the week + other includable pay) / total hours worked`. Excludable items (expense reimbursements, discretionary bonuses, PTO pay for hours not worked, premiums already at 1.5x) are excluded per 29 CFR Part 778 (verify specifics).
4. OT premium = `0.5 x regular rate x OT hours` for hours already paid at straight time (or `1.5 x` when straight time was not paid for those hours). Double time is handled analogously.
5. **Multiple rates in a week** (e.g., $20/hour mowing and $24/hour irrigation): weighted average regular rate by default. "Rate in effect when OT was worked" is offered only where permitted by agreement (verify).

Worked example (illustrative): a crew member paid $20.00/hour works 46 hours in a federal-only state and earns a $92 production bonus that week.
- Straight time: 46 x $20.00 = $920.00. Bonus: $92.00.
- Regular rate: ($920 + $92) / 46 = $22.00.
- OT premium: 0.5 x $22.00 x 6 = $66.00.
- Total: $1,078.00. A naive calculation (40 x $20 + 6 x $30 + $92 = $1,072) underpays by $6.00. Across 30 workers and 30 weeks that is about $5,400 of back wages plus potential liquidated damages. Rootline never makes this mistake.

**RULE-03 Retroactive bonus OT true-up [V1].** A nondiscretionary bonus earned over several weeks (monthly production bonus, end-of-season retention bonus promised in April) is allocated to the workweeks in which it was earned (evenly per week or proportionally to hours; Company choice where permitted). An additional OT premium is computed for each week with OT hours: `bonus_allocated_to_week / hours_in_week x 0.5 x OT_hours_in_week`. California flat-sum bonuses follow the formula in *Alvarado v. Dart Container* (bonus divided by non-overtime hours, times 1.5 for OT hours; verify). Output: a `bonus_ot_trueup` pay item with a week-by-week audit table attached to the export.

**RULE-04 Meal and rest premiums [MVP for CA].** Premium triggers come from timesheet evaluation (late, short or missed meals not validly waived) and from attestations ([05](05-field-crew-mobile-app.md)). At most one meal premium and one rest premium per workday (California; verify). Premium rate = regular rate of compensation for the workweek (*Ferra v. Loews Hollywood Hotel*, 2021; verify). Premiums are wages, so they appear on the export as distinct earnings codes and are excluded from regular-rate computation.

**RULE-05 Minimum wage floor checks [MVP].** For each workweek (and each day where state law evaluates per hour or per day, verify), check that pay for all hours meets the applicable minimum for each work location. That matters for piece-rate, production pay, deductions and H-2B reimbursements. A shortfall creates a `min_wage_makeup` pay item and alerts the office.

**RULE-06 Max hours, rest between shifts and fatigue [V1].** Company rules (e.g., no more than 14 hours in a day, 10 hours rest between shifts; for snow events "max 16 hours on, 8 off") plus legal limits (minors, CMV hours-of-service for CDL drivers in interstate commerce; verify applicability). Scheduling warnings when a planned route would breach them ([04](04-scheduling-dispatch-routing.md), [17](17-ai-copilot-automation.md) scheduling agent).

**RULE-07 Rule pack test harness [MVP, platform-side].** Every pack ships with at least 50 fixture timesheets per jurisdiction with expected outputs. The fixtures include split weeks across pack versions, multi-state weeks, 7th-day scenarios, piece-rate weeks, bonus true-ups, meal waivers and minors. A release cannot publish if any fixture fails. Diffs between versions are shown to `platform_owner` with plain-language release notes that tenants see ("California minimum wage increase effective Jan 1 loaded").

### 4.10 Compensation types

**COMP-01 Pay rates [MVP].** Effective-dated pay rates per employee with dimensions: default rate, rate by labor class or work type (mowing $19, irrigation $23, chemical application $22, snow plowing $26), crew-lead differential, shift differential (night snow +$3), and prevailing-wage classification overrides. Resolution order for a segment: prevailing-wage classification rate (if certified job) -> work-type rate -> role differential added -> default rate.

**COMP-02 Salary [MVP].** Exempt salary (annual amount, pay frequency, exempt classification test checklist: salary threshold, duties). Warning when a salaried crew lead is marked exempt, because manual-work-heavy crew leads rarely meet duties tests (verify). Non-exempt salaried with OT supported (fixed salary for a regular schedule, OT on the derived rate). The fluctuating workweek method is available only where permitted (not in California; verify).

**COMP-03 Hourly [MVP].** Standard.

**COMP-04 Piece rate [V1].** Piece definitions linked to Price Book services or production units: per lawn mowed by size band, per aeration, per lawn application, per bed edged (linear feet), per cubic yard of mulch installed, per tree planted by caliper, per snow push. Units come from completed Visits and crew-app quantities ([05](05-field-crew-mobile-app.md)). For crews, units are split among members by hours on the Visit (default) or equally. Rules:
- FLSA: regular rate = total earnings / total hours, OT premium at 0.5x regular rate.
- California Labor Code 226.2: rest and recovery periods paid separately at the average hourly rate, other nonproductive time (drive, shop, loading, waiting for parts) paid at no less than minimum wage, with separate pay-stub lines for each. Rootline derives productive vs nonproductive time from segment types automatically, which is the hardest part of piece-rate compliance in practice.

Worked California example (illustrative; uses $16.90 as the minimum wage for illustration, verify current rate): an aeration technician completes 60 aerations at $12.00 = $720.00 in a week with 48 hours worked, of which 3.0 hours are rest periods and 5.0 hours are nonproductive (shop and loading, not drive between jobs if the Company treats drive as productive for that piece plan; configurable).
- Nonproductive pay: 5.0 x $16.90 = $84.50.
- Average hourly rate for rest pay: ($720.00 + $84.50) / (48 - 3) = $17.88.
- Rest and recovery pay: 3.0 x $17.88 = $53.63.
- Straight-time total: $858.13. Regular rate: $858.13 / 48 = $17.88. Weekly OT premium for 8 hours: 0.5 x $17.88 x 8 = $71.51 (daily OT evaluated per day in the real calculation).
- Gross: $929.64, with stub lines "Piece earnings", "Nonproductive time", "Rest and recovery periods", "Overtime premium".

**COMP-05 Production and efficiency bonuses (gain share) [V1].** The landscape-classic crew incentive: the crew shares the value of hours saved against the estimate budget.
- Pool per Visit or per Job phase: `max(0, budgeted_hours - actual_hours) x pool_rate x share_pct`. Example: budget 6.0 crew-hours, actual 5.0, pool rate $30, share 30% gives $9.00.
- **Quality gates** (all must pass): QA score at or above the threshold (e.g., 85; [05](05-field-crew-mobile-app.md)), no callback or redo within 7 days, no client complaint, required photos present. A later callback reverses the bonus with a visible reason, but only before payout.
- **Safety and break neutrality (hard-coded):** legally required rest breaks and the meal period are **added to the budget** before comparison. Taking a break can never reduce a bonus, and skipping one can never increase it. Hours on Visits with an open safety incident or a heat procedure violation are excluded from the pool.
- Caps: per Visit, per week, per person (e.g., max 20% of base pay).
- Distribution: by hours worked on qualifying Visits (default), by role weight (crew lead 1.25x), or equal.
- Visibility: the crew sees the rule in plain language and a live tally ("This week: $46 earned, $12 pending QA").
- Payroll: weekly or per pay period as a nondiscretionary bonus, included in the regular rate (RULE-02/03).

**COMP-06 Crew-lead pay [MVP].** Modes: higher base rate as a position; differential added only for segments where the employee is the acting crew lead that day (from crew assignment in [04](04-scheduling-dispatch-routing.md)); weekly lead stipend; crew-lead share of the production pool. Acting-lead detection is automatic, so a crew member who leads Crew 7 on Friday gets the differential for Friday's hours.

**COMP-07 Sales commissions [V1].** Commission plans and events are defined in [03](03-crm-sales-estimating-proposals.md) (`COMM-01..03`). This module:
- Receives `commission.earned` and `commission.clawed_back` events as pay items, timed by the plan's payout schedule (e.g., paid in the pay period after the client's payment clears).
- Allocates commissions to workweeks for regular-rate purposes when the earner is non-exempt (inside sales reps who also run crews; verify allocation method).
- Handles draws against commission (recoverable or non-recoverable), with balance tracking and minimum wage checks per workweek.
- Requires a written, signed commission agreement for California employees (Labor Code 2751; verify), generated from the plan with e-signature.

**COMP-08 Tips [MVP].** Tips from client payments ([08](08-payments-stripe.md)) and the portal ([06](06-customer-portal.md)) arrive as `payments.tip.allocated` with Visit and employees. Default allocation is by hours on the Visit. Rootline exports tips as credit-card tips (paid through payroll) and lets crew members report cash tips in the app. Rootline never applies a tip credit against minimum wage by default. Tips belong to the employees, and managers and owners cannot share in them where law prohibits it (FLSA tip retention rules; verify).

**COMP-09 Reimbursements, allowances and stipends [MVP].** BYOD phone stipend (prompted in California setup per [05](05-field-crew-mobile-app.md)), mileage (rate configurable; the IRS standard rate is a common default; verify each year), boot allowance, tool allowance, per diem for out-of-town installs, H-2B reimbursements ([H2B-05](#44-h-2b-and-seasonal-worker-program-support)). Each maps to a provider earning code that marks taxable or non-taxable treatment (the provider is the tax authority of record).

**COMP-10 On-call and snow event pay [V1].** Snow season standby: on-call stipend per night or per week. If on-call restrictions are heavy enough that the time counts as hours worked, the Company must pay it as such (fact-specific; verify). Rootline records the on-call roster and restrictions so the policy is explicit. Event call-out minimums (e.g., guaranteed 4 hours when called out for a 2-inch trigger push) are configurable pay rules. Night differential applies automatically by segment clock time.

**COMP-11 Spot bonuses and recognition rewards [V1].** Manager-initiated bonuses ("$50 for staying late to finish the Patel patio before the storm"), referral bonuses, safety-reporting rewards ([SAFE-09](#415-safety-management)) and kudos-based rewards. Each needs an approver and a reason, and is flagged as discretionary or nondiscretionary. The UI explains the regular-rate impact, because promised bonuses are nondiscretionary.

**COMP-12 Earning codes registry [MVP].**

| Code | Description | Regular-rate inclusion | Typical provider mapping |
|---|---|---|---|
| `REG` | Regular hourly | Yes | Regular |
| `OT` | Overtime 1.5x | Premium excluded | Overtime |
| `DT` | Double time 2x | Premium excluded | Double overtime |
| `PIECE` | Piece earnings | Yes | Piecework / custom |
| `NONPROD` | CA piece-rate nonproductive time | Yes | Custom |
| `RESTREC` | CA piece-rate rest and recovery | Yes (verify) | Custom |
| `MEAL_PREM` / `REST_PREM` | Meal / rest premium | No | Custom |
| `RPT_TIME` | Reporting-time pay | Verify | Custom |
| `BONUS_PROD` | Production bonus (nondiscretionary) | Yes | Bonus (nondiscretionary) |
| `BONUS_DISC` | Discretionary bonus | No | Bonus |
| `BONUS_OT_TRUEUP` | Retro OT on bonus | Premium excluded | Overtime adjustment |
| `COMM` | Commission | Yes (non-exempt) | Commission |
| `LEAD_DIFF` / `SHIFT_DIFF` | Differentials | Yes | Custom |
| `PW_DIFF` | Prevailing wage differential | Yes | Custom |
| `PW_FRINGE_CASH` | Fringe paid in cash | Excluded for DBA OT (verify) | Custom |
| `PTO` / `SICK` / `HOL` | Paid time off types | No | Provider PTO policies |
| `TIP_CC` / `TIP_CASH` | Tips | No | Tips |
| `REIMB_*` | Reimbursements | No | Reimbursement |
| `H2B_VISA` / `H2B_INBOUND` / `H2B_RETURN` | H-2B reimbursements | No | Reimbursement (provider decides taxability) |
| `GUARANTEE` | H-2B three-fourths shortfall | Verify | Custom |
| `MIN_WAGE_MAKEUP` | Minimum wage make-up | Yes (verify) | Custom |

### 4.11 Prevailing wage and certified payroll

**PW-01 Prevailing wage projects [V1].** A Job ([03](03-crm-sales-estimating-proposals.md)) is flagged as prevailing wage with: governing law (federal Davis-Bacon and Related Acts for construction such as a park or school landscape install; federal Service Contract Act for grounds maintenance contracts with federal agencies; state prevailing wage laws; verify classification of maintenance work per state), wage determination number and date, classifications with base hourly rate and fringe rate per hour (e.g., "Landscape Laborer $28.40 + $9.15 fringe", illustrative), apprentice ratios [V2], certified payroll submission method, prime contractor contact.

**PW-02 Segment classification [V1].** Segments on a PW job must carry a classification. The crew app asks the crew lead at segment start ("¿Clasificación? Laborer / Operator / Irrigation Fitter") with a default per employee and per task. Office corrects before approval. Mixed-classification days are split by segment. Without a classification the timesheet cannot be approved (TIME-02).

**PW-03 Pay computation [V1].** For PW segments: pay at least the classification base rate. The fringe obligation is met by bona fide benefit contributions (credit computed per hour, with annualization of plan contributions across all hours worked including private work; verify DOL guidance) and/or a cash fringe. OT on DBA-covered work is 1.5x the basic rate plus straight fringe (fringe is not multiplied; verify). Differences from the employee's normal rate become `PW_DIFF` pay items.

**PW-04 Certified payroll reports [V1].** Weekly per project: WH-347 format (PDF and data) with employee identifiers (last four of SSN only as the form permits; verify current form version), classification, hours per day, rates, gross, deductions (from payroll journal import), net, and the statement of compliance e-signed by the authorized signer. "No work performed" weeks are generated automatically. State formats: California DIR eCPR XML export (verify current schema), LCPtracker and similar CSV templates [V2]. Deductions and net pay come from the payroll provider's register import (PAY-08). Until that import arrives, the report shows "Draft - awaiting payroll register".

**PW-05 Fringe benefit statements and apprentice tracking [V2].** Apprentice registration numbers, ratios per classification, and fringe statements for audits.

> **Competitive edge:** Public-works landscaping (parks, schools, highway medians, federal grounds) pays well but is avoided by small firms because certified payroll is painful. Rootline makes it a weekly button. This is a revenue unlocker that sales can pitch ("bid public work with confidence"), and we found no landscape FSM that documents it [B].

### 4.12 Labor burden and costing

**BURD-01 Burden profiles [MVP].** A burden profile per labor class and state or province (e.g., "Maintenance Laborer - CA", "Irrigation Tech - CA", "Office - CA") with components:

| Component | Input | Basis |
|---|---|---|
| Employer Social Security | 6.2% up to the annual wage base | Statutory (verify annual base) |
| Employer Medicare | 1.45% | Statutory |
| FUTA | 0.6% on first $7,000 per employee, plus credit reduction where applicable | Statutory (verify credit-reduction states yearly) |
| SUTA | Company rate x state taxable wage base | Company's assigned rate |
| Canada: CPP/QPP, EI (employer 1.4x employee premium), provincial health taxes (e.g., Ontario EHT above threshold) | Rates and maximums | Statutory (verify yearly) |
| Workers' comp | Rate per $100 of payroll by class code x experience mod (or per hour worked in Washington's system) | Policy declarations |
| General liability rated on payroll | % of payroll | Policy |
| Health, dental, retirement match | $ per hour, per month or % | Plan |
| Paid non-productive time | PTO, sick, holidays, paid training, rain-day reporting pay | Policies + history |
| Uniforms, PPE, recruiting, H-2B program costs | $ per employee per season, amortized over expected hours | Actuals from Ledger and H-2B workspace |
| Payroll service fees | $ per employee per month + base | Provider invoice |

**BURD-02 Burden calculation [MVP].** Rootline computes burden **per productive hour** (the unit estimates and job costing use):

Illustrative calculation (all rates are examples, not advice): a $20.00/hour laborer in California with 1,500 paid hours per season, of which 80 are non-productive (40 sick/PTO, 24 holiday, 16 training), so 1,420 productive hours.

| Line | Amount |
|---|---|
| Productive wages (1,420 x $20) | $28,400 |
| Non-productive paid time (80 x $20) | $1,600 |
| Social Security 6.2% of $30,000 | $1,860 |
| Medicare 1.45% | $435 |
| FUTA 0.6% x $7,000 | $42 |
| SUTA 3.4% x $7,000 (illustrative rate and base) | $238 |
| Workers' comp, landscape gardening class at $5.50 per $100 (illustrative) | $1,650 |
| General liability at 1.0% of payroll (illustrative) | $300 |
| Uniforms and PPE | $250 |
| Payroll service fees (allocated) | $54 |
| **Total labor cost** | **$34,829** |
| **Burden on productive wages** | **22.6%** |
| **Burdened cost per productive hour** | **$24.53** |

Add H-2B program costs (fees, agent, transport, recruiting) amortized over a worker's season hours, and burden for an H-2B worker can be several dollars per hour higher. The burden profile makes that visible instead of hiding it in overhead.

**BURD-03 Seasonal burden curve [V1].** Wage-base caps front-load FUTA and SUTA. A $20/hour worker reaches a $7,000 base after 350 hours, about 8 weeks into the season. Rootline shows actual-period burden by month and offers job-costing modes: `annualized` (smoothed, default for estimates and job costing) or `actual_period` (true monthly cost, for cash and P&L analysis). The difference is posted as a burden variance in the Ledger ([09](09-accounting-ledger-integrations.md)).

**BURD-04 Workers' comp class allocation [V1].** Each service or task type maps to a workers' comp class code per state (e.g., landscape gardening and tree trimming are distinct classes in NCCI states, commonly 0042 and 0106; verify per state and bureau, including California WCIRB codes). Hours by segment are allocated to classes. The **WC audit report** shows payroll by class with supporting hours, which the premium auditor needs before payroll can be split across classes for one employee (rules vary by state; verify). Where the state excludes the overtime premium from WC payroll (common under NCCI rules; verify), the report excludes it. Washington: quarterly hours by risk class export for L&I reporting (verify format).

**BURD-05 Burdened labor rates to estimating [MVP].** Labor classes publish a burdened cost rate to the estimating engine ([03](03-crm-sales-estimating-proposals.md)). When a burden profile changes, estimators see "Labor cost rate updated from $24.10 to $24.53 on Mar 1" and open estimates are flagged for repricing if margin falls below target. This matches LMN's budget order: wage, then burden, then overhead, then profit ([LMN help](https://intercom.help/lmn/en/articles/15939065-how-lmn-calculates-overhead-labor-burden-and-profit-in-estimates)).

**BURD-06 Actual-vs-estimated burden reconciliation [V1].** After payroll journal import, Rootline compares actual employer taxes, WC accruals and benefits to the burden applied in job costing for the period and shows the variance by labor class. If variance stays above 2 points for two months, the Copilot suggests updating the profile.

**BURD-07 Labor cost simulator [V1].** "What if we raise all laborers $1.50/hour?" shows the effect on burdened cost, required price increase on maintenance contracts to hold margin, and the renewal letter draft for [07](07-invoicing-billing-contracts.md). See also [Beyond the brief](#13-beyond-the-brief-extra-ideas).

### 4.13 Payroll integrations and pay period close

**PAY-01 Pay calendars [MVP].** Multiple calendars per Company (weekly for field, biweekly or semi-monthly for office). Each has a workweek definition (FLSA fixed 168-hour period, e.g., Sunday 00:00 to Saturday 23:59 in the Company time zone), period start/end, timesheet cutoff (e.g., Monday 10:00), provider submission deadline (e.g., Tuesday 17:00 for Friday pay date with direct deposit lead time), and holiday shifts.

**PAY-02 Pay period close wizard [MVP].** Steps with progress bar ([6.6](#66-wireframe-pay-period-close-wizard)):
1. **Lock check:** all timesheets in the period approved at the required level, or listed as blockers.
2. **Compute:** rule engine produces `pay_item` rows per employee (hours by earnings code and work location, amounts where Rootline computes them (bonuses, premiums, piece-rate, reimbursements), and rates).
3. **Validate:** unmapped employees, unmapped earnings codes, terminated employees with hours, missing work locations, H-2B minimum-wage week-1 check, minors' hours, prevailing-wage classifications, negative values, period overlaps, duplicate submissions.
4. **Preview:** totals by earnings code, by employee and by division, with comparison to the last period and to the forecast ("Gross +18% vs last week, expected: season ramp").
5. **Approve:** by `owner`, `office_manager` or `bookkeeper` (`payroll_export.run`). Optional two-person rule for gross above a threshold.
6. **Push / export:** API push or file. Idempotency key per batch. Partial failures are listed per employee with retry.
7. **Confirm:** provider confirmation (API status or manual "Submitted in provider").
8. **Post:** payroll journal import (PAY-08) closes the loop.

**PAY-03 Connectors [MVP/V1/V2].**

| Provider | Method | Data pushed | Data pulled | Priority |
|---|---|---|---|---|
| Gusto | Partner API (OAuth). Payroll hours and earnings per employee per payroll; employee create for onboarding hand-off ([Gusto developer docs](https://docs.gusto.com)) | Hours by earning type, bonuses, reimbursements, work address per employee (verify support for multiple work locations per period) | Employees, job/pay rates, PTO balances (verify), payroll totals for journal | [MVP] |
| QuickBooks Online Payroll | QBO Accounting API **TimeActivity** entities (employee, customer/job, service item, hours, billable flag), which QBO Payroll can pull into paychecks; bonuses and other earnings entered in QBO Payroll or via file (verify) ([Intuit TimeActivity reference](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/timeactivity)) | Hours per employee per job per day | Employees, payroll JEs in QBO | [MVP] |
| QuickBooks Desktop Payroll | Web Connector time-tracking transactions ([09](09-accounting-ledger-integrations.md) connector) | Time data | Employees | [V1] |
| ADP Workforce Now | ADP Marketplace partner API for pay data input (verify program and endpoints) ([ADP developer portal](https://developers.adp.com)) | Pay data batch | Workers, rates | [V1] |
| ADP RUN | Time import file (provider template) | Hours and earnings | Manual | [MVP] |
| Paychex Flex | Paychex API (pay components / checks; verify) ([Paychex developer portal](https://developer.paychex.com)); file import fallback | Hours and earnings | Workers | [MVP] file, [V1] API |
| Paylocity, Paycom, Paycor, isolved | Provider file templates; API via partner programs later | Hours and earnings | Optional via unified API | [V1] file, [V2] API |
| Unified employment API (for example Finch) | Read roster, pay rates, pay statements across many providers (verify write capabilities) ([Finch developer docs](https://developer.tryfinch.com)) | Limited | Roster, rates, pay statements | [V1] evaluate |
| Canada: Wagepoint, ADP Canada, Payworks, Ceridian Dayforce, QBO Payroll Canada | File templates first | Hours, earnings, vacation pay | Manual | [V1] |
| Generic CSV builder | Column mapper with saved templates | Anything | n/a | [MVP] |

**PAY-04 Mapping [MVP].** Employee mapping (provider employee ID, auto-match by email, phone or name with confirmation). Earnings code mapping (Rootline code -> provider earning type). Department or division mapping (for providers that support labor allocation). Work location mapping. Unmapped items block export with a fix-it link.

**PAY-05 Corrections and off-cycle [MVP].** After export, corrections create an adjustment batch for the next period. Final pay: termination triggers an off-cycle export option with jurisdiction timing guidance. For example, California requires final wages immediately at involuntary termination and within 72 hours for a quit without notice (verify). The UI shows the deadline countdown and a "not legal advice" note. Retro pay (late-approved raises) is computed per affected week, including regular-rate effects.

**PAY-06 Multi-state and local work-location allocation [V1].** Hours and earnings per work location (state, county, municipality) for each employee. This feeds providers that support per-location wages and produces a report for those that do not. Relevant for crews crossing state lines (e.g., Kansas City metro, the New York-New Jersey area, Lake Tahoe) and for local income taxes based on work location (e.g., Ohio municipalities, Pennsylvania local earned income tax; verify rules).

**PAY-07 Payroll data quality guardrails [MVP].** Never export an employee whose rate in Rootline differs from the provider's rate by more than $0.01 without confirmation (where the provider exposes rates). Block hours for a hibernated or terminated employee outside their final period. Flag any employee with more than 80 hours in a weekly period. Detect duplicate batches by content hash.

**PAY-08 Payroll journal import [V1] (manual entry [MVP]).** Import the payroll register or journal from the provider (API where available, CSV otherwise): gross by earnings code, employee taxes, employer taxes, deductions, net pay, employer benefit costs. Post to the Rootline Ledger when it is the system of record ([09](09-accounting-ledger-integrations.md)). Debits: wages expense by division (direct labor to COGS, office to G&A), employer taxes, benefits. Credits: net pay clearing (bank), tax liabilities, deduction liabilities. Tips Payable clears ([08](08-payments-stripe.md), [07](07-invoicing-billing-contracts.md) P30). Then **job cost true-up**: actual burden replaces estimated burden on the period's job costs in proportion to hours, if the Company chose actual-period costing.

**PAY-09 Year-end and records [V1].** Hours and earnings history per employee per year (for the employee's "My records" view, [02](02-personas-roles-permissions.md)). Links to W-2 or T4 in the provider. ACA hours tracking for Applicable Large Employers (measurement periods, variable-hour seasonal employees; verify) [V2].

### 4.14 Embedded payroll option

**EMB-01 Embedded payroll (US) [V1 pilot, V2 GA].** For Companies that want one less system, Rootline offers payroll inside the app through a licensed embedded payroll partner. Candidates named in the brief are **Check** and **Gusto Embedded** ([Check](https://www.checkhq.com), [Gusto Embedded](https://embedded.gusto.com)). The partner computes taxes, moves money (debits the Company, pays employees and tax agencies), files payroll taxes and issues W-2s. Rootline provides the UI, time, pay rules, PTO and onboarding. **Rootline never holds wage funds** ([08](08-payments-stripe.md)).

Scope:
- Company onboarding (KYB) in the partner's hosted or embedded components: legal entity, EIN, state tax accounts, bank verification, signatory.
- Employee onboarding: W-4 and state forms, direct deposit, I-9 Section 1 (if the partner supports it), in English and Spanish.
- Payroll run: Rootline-computed pay items go straight into the partner's payroll draft. Partner computes taxes and net. Preview and approve in Rootline. Funding deadline countdown.
- Off-cycle runs (final pay, bonuses, corrections).
- Contractor payments (1099) for designers and consultants, if the partner supports it.
- Pay stubs in the self-service app (bilingual rendering where the partner allows), tax forms, year-end.
- Mid-year migration: prior YTD import from the old provider (quarter-start go-lives recommended).
- Journal entries posted natively to the Ledger.

**EMB-02 Partner selection criteria [V1 decision].** To be decided with diligence. Rootline will not publish a choice before contracts are signed.

| Criterion | Why it matters |
|---|---|
| State coverage, local taxes, and multi-state support | Crews cross state and municipal lines |
| White-label depth (APIs vs hosted components) | Bilingual, on-brand experience |
| Piece-rate, CA premium and custom earning code support | Landscape pay is not standard hourly |
| Same-day or next-day direct deposit and funding timelines | Seasonal workers live paycheck to paycheck |
| Support model (who answers the tax notice call) | Office managers need one number |
| Canada roadmap | US + Canada launch markets ([22](22-business-model-pricing-gtm.md)) |
| Economics (per employee per month, revenue share) | Add-on pricing in [22](22-business-model-pricing-gtm.md) |
| Liability allocation for tax errors and penalties | Must sit with the licensed partner |

**EMB-03 Embedded payroll in Canada [V2-V3].** Depends on partner availability (verify). File-based exports until then.

**EMB-04 Earned wage access [V2].** Through a partner, employees can access a portion of earned, approved wages before payday. Rootline supplies verified earned amounts from approved time (not unapproved punches). Fees are transparent and a no-fee option is preferred. Regulatory treatment of EWA varies by state (verify), so it is off by default.

> **Competitive edge:** Horizontal FSMs mostly bolt on a payroll provider [B]. Rootline's embedded option is fed by a landscape-aware rules engine. Piece-rate rest pay, regular-rate bonus true-ups, H-2B reimbursements and prevailing-wage differentials arrive at the partner already computed. Neither generic payroll nor generic FSM software can do that.

