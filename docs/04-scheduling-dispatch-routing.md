# 04 - Scheduling, Dispatch and Route Optimization

> A landscape company does not sell appointments; it sells a **season of capacity**. Two hundred weekly mows from April to November, a 5-round fertilizer program that must land inside soil-temperature windows, 60 fall cleanups crammed into five weeks before the snow, a 9-day paver patio that cannot start until the dig ticket clears, and a 2-inch snow trigger at 3 a.m. all compete for the same four crews, three trailers and one skid steer. This module is the operating heart of Rootline. It turns sold work (from [Proposals](03-crm-sales-estimating-proposals.md) and [Service Agreements](07-invoicing-billing-contracts.md)) into Visits, places those Visits on crew-days with a real road-network vehicle-routing optimizer, protects them against weather, holidays and breakdowns, tracks them live with GPS and geofences, and tells clients the truth about when the crew will show up. Competitors either treat scheduling as a calendar with a "sort by distance" button (Jobber, Yardbook, Copilot CRM), or as an enterprise ERP board that needs a full-time dispatcher (Aspire, ServiceTitan). Rootline's position: **the optimizer proposes, the dispatcher decides, and every change is a reviewable diff that also notifies the right people.**

**Related docs:** [Personas and permissions](02-personas-roles-permissions.md) | [CRM, Estimating, Proposals](03-crm-sales-estimating-proposals.md) | [Crew app](05-field-crew-mobile-app.md) | [Customer Portal](06-customer-portal.md) | [Invoicing and contracts](07-invoicing-billing-contracts.md) | [Design Studio](10-design-studio.md) | [Operations, inventory, equipment](13-operations-inventory-equipment.md) | [Service-line modules](14-service-line-modules.md) | [Team, HR, payroll](15-team-hr-payroll.md) | [Marketing and communications](16-marketing-growth-communications.md) | [AI copilot and automation](17-ai-copilot-automation.md) | [Reporting](18-reporting-analytics.md) | [Architecture](20-architecture-security.md) | [UX and sitemaps](21-ux-design-system-sitemaps.md)

**Ownership boundaries.** This document owns: the Job/Visit scheduling model and the canonical Visit state machine, recurrence and visit generation, holidays and blackouts, capacity planning and backlog, crew/skill/equipment matching for scheduling, the dispatch board, territories, the route optimizer, the weather service and weather playbooks, live tracking and ETA, multi-day project scheduling, subcontractor scheduling, client self-scheduling slot supply, and the scheduling side of Copilot. It does **not** own: on-device geofence mechanics, time punches and location privacy ([05](05-field-crew-mobile-app.md)), message templates and consent ([16](16-marketing-growth-communications.md)), program/round templates, the Storm Event Engine and pesticide compliance ([14](14-service-line-modules.md)), billing ([07](07-invoicing-billing-contracts.md)), or equipment maintenance and deliveries ([13](13-operations-inventory-equipment.md)). Where those modules meet scheduling, this document summarizes the contract and links.

> **Research note.** This module's research ran against a shared web-search budget that was already exhausted when this document was written, and direct fetches of vendor documentation hosts (Google Developers, Mapbox docs) were blocked by the session's network policy. Competitor and complaint evidence therefore comes from the sourced research reports in this repo ([R1](research/R1-field-service-platforms.md), [R2](research/R2-landscape-specific-platforms.md)) and from citations gathered by sibling module docs, re-cited here at their original URLs. Facts drawn from general industry and vendor knowledge without a fresh citation are marked **[B, verify]**. Vendor limits (API element caps, geofence counts) and prices change often: treat every such number as "as of Nov 2026, verify" before engineering commits to it.

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
10. [AI opportunities in this module](#10-ai-opportunities-in-this-module)
11. [Edge cases, compliance and risks](#11-edge-cases-compliance-and-risks)
12. [Metrics and KPIs](#12-metrics-and-kpis)
13. [Beyond the brief: extra ideas](#13-beyond-the-brief-extra-ideas)
14. [Open questions](#14-open-questions)
15. [Sources](#sources)

---

## 1. Goals and non-goals

### 1.1 Goals

| # | Goal | Measurable target | Priority |
|---|---|---|---|
| G1 | **Sold work becomes scheduled work without re-typing.** Accepted proposals and activated agreements generate Visits with durations, skills, equipment and time windows already attached. | 100% of recurring agreement lines produce Visits automatically; median time from "proposal accepted" to "first visit on a route" < 2 minutes of human effort | [MVP] |
| G2 | **A season is planned, not improvised.** Owners see sold crew-hours vs available crew-hours by week for the whole season before April 1. | Capacity view covers 52 weeks forward; forecast error of weekly sold hours vs actual hours worked within +/-10% by week 6 of the season (estimate target) | [MVP] basic, [V1] full |
| G3 | **Real routes on real roads.** Road-network drive times with time-of-day traffic, multi-crew assignment, skills, equipment, time windows, breaks, dump and supply stops. | Drive time reduced 10-20% vs the Company's pre-Rootline routes on the first optimized week (estimate based on typical VRP gains; measured per tenant at onboarding) | [MVP] single crew, [V1] multi-crew |
| G4 | **Weather is a playbook, not a fire drill.** One action handles a rain day across all crews with client notifications. | Rain-day replan for a 6-crew Company (about 120 visits) proposed in < 60 s and applied with notifications in < 5 minutes of dispatcher time | [V1] (manual bulk move [MVP]) |
| G5 | **Clients always know when.** Day-ahead notices, on-my-way texts with live ETA, honest delay notices. | ETA accuracy: 80% of arrivals within +/-15 minutes of the last ETA sent (target) | [MVP] |
| G6 | **Dispatchers work at the speed of thought.** Dense board, keyboard-first, optimistic UI, every drag validated. | Drag-to-confirm < 100 ms optimistic, < 300 ms p95 server confirmation (budget from [20](20-architecture-security.md)); median clicks to schedule a visit <= 3 ([21](21-ux-design-system-sitemaps.md)) | [MVP] |
| G7 | **Stable routes.** Weekly maintenance clients see the same crew on the same day in roughly the same order. | >= 90% of recurring stops keep their route day and crew week over week when no inputs changed | [MVP] |
| G8 | **Projects and maintenance share one schedule.** Multi-day installs with phases and dependencies sit on the same board as mowing routes, competing for the same people and equipment. | 0 double-booked crews or equipment units on published schedules (hard validation) | [V1] |
| G9 | **AI that moves visits, with consent.** Natural-language rescheduling and agentic replans produce a ScheduleDiff that a human approves. | >= 70% of AI-proposed weather diffs accepted without edits by month 3 of use (target) | [V1] |
| G10 | **Works for a 1-truck operator and a 40-crew branch network.** | Single-crew Company can run the season with no optimizer settings touched; multi-branch Companies get branch-scoped boards and depots | [MVP] / [V1] |

### 1.2 Non-goals

- **Not a turn-by-turn navigation app.** Rootline hands off to Google Maps, Apple Maps or Waze from the crew app. Embedded truck-and-trailer navigation is a [V2] evaluation in [05](05-field-crew-mobile-app.md).
- **Not a telematics hardware vendor.** Vehicle GPS units, engine-hour sensors and dashcams come from partners (Samsara, Motive, Geotab, Verizon Connect class; verify integration availability). Rootline ingests their data.
- **Not a general workforce-management (WFM) shift scheduler** for hourly retail-style staffing. Crews are scheduled through crew-days and routes; individual shift bidding and labor-law rest rules are owned by [15](15-team-hr-payroll.md).
- **Not a snow-specific storm engine.** Storm event lifecycle, triggers and proof-of-service packets are in [14](14-service-line-modules.md). This module supplies weather data, routing and live tracking to it.
- **Not a full CPM/EVM construction scheduler** (Primavera-class). Project scheduling supports phases, tasks, finish-to-start and start-to-start dependencies with lags, and a critical path. Resource leveling across dozens of concurrent projects is [V2].
- **No fully autonomous dispatch at MVP.** Every optimizer or AI change is proposed as a diff. Auto-apply is opt-in per rule type in [V2] (for example "auto-apply rain-day moves for mowing only").

### 1.3 Design principles

1. **The season is the unit of planning; the day is the unit of execution.** Planning views (capacity, territories, master routes) think in weeks and seasons. Execution views (dispatch board, live map) think in crew-days and minutes.
2. **Visits know what they need.** Each Visit carries a duration budget, required skills, required equipment class, time window, flexibility class and lock level. The board and optimizer read these; humans do not have to remember that the Oakmont HOA needs the 72-inch mower and a licensed applicator.
3. **Proposals, not surprises.** The optimizer, weather playbooks and Copilot all produce a **ScheduleDiff** (visits moved, from/to, by crew and day, KPI deltas, conflicts, notifications that will go out). Nothing changes until someone accepts it, unless the Company has explicitly opted into auto-apply for that rule.
4. **Stability is a feature.** Recurring clients value the same day and crew more than 3 minutes of saved drive time. The objective function penalizes churn against last week's plan.
5. **Hard constraints are hard.** An expired pesticide license, a trailer already reserved, a client blackout date, a crew already at 12 hours: these block publication (with an explicit, audited override for some), not just show a yellow icon.
6. **Offline truth wins over office intent.** If a crew completes a Visit offline that the office canceled, the completion is preserved and routed to a review queue (conflict rules in [05](05-field-crew-mobile-app.md) and [20](20-architecture-security.md)).
7. **Explain every number.** Every ETA, capacity percentage, route-density score and optimizer saving can be clicked to show its inputs.

---

## 2. Market research: what competitors do, what users complain about, the gap we exploit

### 2.1 What competitors do

| Product | Scheduling and dispatch model | Routing | Weather and live tracking | Evidence |
|---|---|---|---|---|
| **Jobber** | Jobs with one-off or recurring visits (one visit, weekly, monthly, customizable); calendar and "crew scheduling" (Plus tier per third-party trackers) | Two modes: a master route covering all properties and a daily route that only optimizes one day; support advises scheduling visits on a day without a specific time so the optimizer can order them. Users report straight-line ("as the crow flies") distance and difficulty with 30-40 stops per day | GPS waypoints and geofenced "location timers"; on-my-way texts; weather rescheduling is manual drag-and-drop [B] | [Jobber landscaping](https://www.getjobber.com/industries/landscaping-software/), [recurring schedule routing](https://community.getjobber.com/discussions/job-details-scheduling/recurring-schedule-routing/10548/replies/11184), [job routing](https://community.getjobber.com/discussions/job-details-scheduling/job-routing/5443), [straight-line complaint](https://community.getjobber.com/discussions/job-details-scheduling/how-does-jobber-calculate-routes-and-can-it-use-real-driving-directions-instead-/8663/replies/9863), [location timers](https://prnewswire.com/news-releases/timesheets-just-got-easier-with-jobbers-new-location-timers-feature-301965963.html) |
| **Aspire** (ServiceTitan) | Sold contract services become scheduled work tickets with budgeted hours; crews record actual hours against them; branch and division structure; snow module with weather-triggered dispatch | Scheduling board by crew [B, verify depth of optimization] | PIN plus geofence clock-in; Motive telematics in the partner marketplace; argues GPS alone is disputable and must be paired with photos and timestamps | [R2 Aspire](research/R2-landscape-specific-platforms.md), [Aspire crew management](https://www.youraspire.com/industries/landscape-business-software/crew-management), [Motive marketplace](https://marketplace.gomotive.com/app/aspire), [Aspire blog](https://www.youraspire.com/blog/prove-service-delivery-data-ends-disputes), [SIMA on Aspire](https://resources.sima.org/snow-and-ice-resource-center/unlock-profitability-and-efficiency-with-aspire) |
| **LMN** (Granum) | Estimate-driven budgets flow into jobs and time tracking; crew app opened to all crew members in Crew 2.0 (Nov 2025) | Scheduling and routing present [B, verify optimizer depth] | Time tracking feeds job costing | [LMN Crew 2.0](https://golmn.com/blog/introducing-lmn-crew-2-0-crew-for-all), [TechPlugged](https://techplugged.com/lmn-software-transforms-the-crew-experience/) |
| **SingleOps** (Granum) | Scheduling, crew app, job costing with estimated vs actual "visit profit margin" | Map-based scheduling [B, verify] | Not documented in sources reviewed | [R2 SingleOps](research/R2-landscape-specific-platforms.md), [SingleOps](https://singleops.com/?p=1677) |
| **Service Autopilot** (Xplor) | Automation-heavy recurring residential scheduling: "automatically invoices, routes, schedules" once configured | Route-based scheduling [B] | Reviewers cite slow database response when scheduling and post-update glitches; SA Team app shows jobs, routes and GPS map destinations | [Capterra SA](https://www.capterra.com/p/122075/Service-Autopilot/reviews/), [MowBoss review](https://mowbosshq.pages.dev/guides/service-autopilot-review), [SA Team](https://apps.apple.com/us/app/sa-team/id1366612097) |
| **ServiceTitan** | Daily dispatch board with technician timelines, a Jobs tray of unassigned work, status filters, dispatcher preferences; click-to-place from the tray; add-ons such as Scheduling Pro, Dispatch Pro, Fleet Pro | Built for call-driven trades dispatch, not dense recurring routes [B] | Fleet Pro telematics add-on [B] | [Daily Dispatch Board](https://help.servicetitan.com/docs/use-the-daily-dispatch-board), [Jobs tray release](https://help.servicetitan.com/release-hub/docs/move-the-jobs-tray-onto-the-dispatch-board-to-speed-up-scheduling), [R1 ServiceTitan](research/R1-field-service-platforms.md) |
| **Housecall Pro** | Dispatch board, GPS, on-my-way texts, checklists, in-field payments | Designed for call-dispatch-fix-invoice, not route-dense recurring maintenance | GPS tracking, on-my-way | [R1 Housecall Pro](research/R1-field-service-platforms.md) |
| **Real Green** (WorkWave) | Program/round-centric: seasons of applications priced by measured area and scheduled in rounds across routes | Route-based round scheduling; WorkWave also sells standalone route software [B, verify] | Chemical usage records; reporting includes a Scheduling category | [R2 Real Green](research/R2-landscape-specific-platforms.md), [WorkWave training deck](https://documents.workwave.com/workwave/beyond-service/2026/realgreen-making-the-most-of-your-reports-report-options-101.pdf) |
| **Arborgold** | Tree/landscape scheduling with a dedicated crew app and per-crew permissions | [B, verify] | GPS-located tree inventory | [Arborgold crew permissions](https://help.arborgold.com/en/articles/permissions-in-arborgold-crew), [Arborgold 8.1](https://help.arborgold.com/en/articles/new-arborgold-crew-app) |
| **Yardbook** | Free web scheduling and routing for solo operators | Basic single-route ordering [B] | None documented | [FieldServiceSoftware.io](https://fieldservicesoftware.io/software/yardbook/) |
| **Copilot CRM** | Lawn/landscape scheduling, routing, separate "Field Force" crew app | Route optimization marketed; bulk rain-delay style schedule push [B, verify] | Field Force app | [Copilot CRM overview](https://help.copilotcrm.com/en/articles/12141481-what-is-copilot-crm), [Field Force](https://apps.apple.com/ly/app/field-force-by-copilot-crm/id6745098752) |
| **SynkedUP** | Estimating, job costing, scheduling and time tracking for design-build | Not a routing product [B] | n/a | [SynkedUP features](https://synkedup.com/features/) |
| **GorillaDesk / FieldRoutes** | Pest and lawn treatment: route-based scheduling, recurring programs | Route optimization is a core selling point (per-route pricing at GorillaDesk) | Chemical tracking | [R1](research/R1-field-service-platforms.md) |
| **Yeti** (snow) | Snow-specific dispatch with GPS-verified service history, timestamped photos, subcontractor portal, site maps | Event-driven | Weather-driven | [Yeti](https://yetisoftware.com/) |

**Feature matrix (scheduling slice).** Y = documented, P = partial, N = not found, ? = unverified. Synthesized from the matrix in [R1](research/R1-field-service-platforms.md) section 9 plus [R2](research/R2-landscape-specific-platforms.md).

| Capability | Jobber | Aspire | LMN | Service Autopilot | Real Green | ServiceTitan | Rootline |
|---|---|---|---|---|---|---|---|
| Recurring visits with seasonal bounds | Y | Y | Y | Y | Y (rounds) | P (memberships) | [MVP] |
| Application-window rounds | N | P | ? | P | Y | N | [MVP] with [14](14-service-line-modules.md) |
| Growth-adaptive mowing frequency | N | N | N | N | N | N | [V1] rules, [V2] AI |
| Holiday "slide week" automation | ? | ? | ? | ? | ? | N | [MVP] |
| Capacity: sold vs available hours by week | N | P | P | N | N | P | [MVP] basic, [V1] full |
| Single-day route ordering (road network) | P (straight-line reported) | ? | ? | Y | Y | ? | [MVP] |
| Multi-crew VRP with skills, equipment, time windows | N | P | N | N | ? | P | [V1] |
| What-if scenarios with locks | N | N | N | N | N | N | [V1] |
| Weather-driven bulk reschedule with client notices | N | P (snow) | N | ? | ? | N | [MVP] manual, [V1] playbooks |
| Live GPS, geofence arrival, ETA texts | Y | Y | ? | P | ? | Y | [MVP] |
| Late-running alerts and mid-day re-optimization | N | N | N | N | N | P | [V1] |
| Multi-day projects with dependencies on the same board | N | P | P | N | N | P | [V1] |
| Natural-language rescheduling | N | N | N | N | N | ? | [V1] |

### 2.2 What users complain about

| Theme | Evidence | What Rootline does about it |
|---|---|---|
| **Routes ignore real roads** | A Jobber user routing 30 to 40 clients a day says the optimizer uses straight-line distance and has asked since their first week ([Jobber Community](https://community.getjobber.com/discussions/job-details-scheduling/how-does-jobber-calculate-routes-and-can-it-use-real-driving-directions-instead-/8663/replies/9863)) | Road-network matrices with time-of-day buckets (4.8.3) |
| **Optimizer only works if you strip times off visits** | Jobber support advises scheduling visits "anytime" on a day so the daily optimizer can order them ([Jobber Community](https://community.getjobber.com/discussions/job-details-scheduling/recurring-schedule-routing/10548/replies/11184)) | Time windows are first-class constraints; "anytime" is just the widest window (4.1.4) |
| **Master route vs daily route confusion** | Two separate optimization modes ([job routing thread](https://community.getjobber.com/discussions/job-details-scheduling/job-routing/5443)) | One model: a **Master Route** (season template per zone-day) and **Daily Routes** that inherit from it, with drift indicators (4.7) |
| **Slow scheduling screens** | Service Autopilot reviewers cite slow database response when scheduling ([Capterra](https://www.capterra.com/p/122075/Service-Autopilot/reviews/)); [21](21-ux-design-system-sitemaps.md) calls this out as a top complaint | Local-first board state, optimistic moves, performance budgets as release gates (4.6.9) |
| **Configuration burden** | "Once configured" carries a lot of weight in Service Autopilot reviews ([MowBoss](https://mowbosshq.pages.dev/guides/service-autopilot-review)) | Opinionated defaults per service line and region; the Copilot proposes rules in plain language ([17](17-ai-copilot-automation.md)) |
| **Steep learning curve, too many steps** | Aspire "learning curve, and some common tasks require too many steps" ([GetApp UK](https://www.getapp.co.uk/reviews/9108/aspire)) | <= 3 clicks to schedule; "Move to..." and click-to-place; progressive disclosure of optimizer settings |
| **Geofencing that fails where crews work** | Android's own guide: network-location based, 100-150 m minimum radius advised, alerts 2-6 minutes late, may not fire without data ([Android geofencing](https://developer.android.com/develop/sensors-and-location/location/geofencing)); Jobber location timers need "Allow all the time" and unrestricted battery ([PR Newswire](https://prnewswire.com/news-releases/timesheets-just-got-easier-with-jobbers-new-location-timers-feature-301965963.html)) | Dual-path arrival detection on device ([05](05-field-crew-mobile-app.md)); server-side reconciliation of geofence, breadcrumbs and crew taps (4.10) |
| **Rain days are manual** | Weather rescheduling in horizontal FSM tools is drag-and-drop by hand [B, per [R1](research/R1-field-service-platforms.md) section 3.7] | Rain-day playbooks producing a single ScheduleDiff with notifications (4.9) |
| **Offline crews lose the plot** | Jobber community threads on working out of coverage ([thread](https://community.getjobber.com/discussions/job-details-scheduling/out-of-cell-service-area-access/6478)) | Routes and next 2 days of visits cached on device; schedule changes delivered as push-and-pull deltas ([05](05-field-crew-mobile-app.md)) |
| **GPS proof is disputed** | Aspire: GPS alone is disputable; pair it with photos and timestamps ([Aspire blog](https://www.youraspire.com/blog/prove-service-delivery-data-ends-disputes)) | Visit actuals combine geofence, breadcrumb dwell, crew confirmation and photo metadata into one "service evidence" score (4.10.6) |

### 2.3 The gap we exploit

1. **Nobody treats maintenance scheduling as an optimization problem across crews.** Horizontal tools order one crew's day; landscape tools assign route days by hand. A 4-crew company with 180 Tuesday properties actually has a **capacitated, skill-constrained, multi-vehicle routing problem with time windows**, and nobody in the SMB tier solves it ([R1](research/R1-field-service-platforms.md) section 3.7 found no evidence of multi-crew VRP in Jobber; Aspire and ServiceTitan are partial at enterprise prices).
2. **Weather is the landscaper's biggest scheduling variable and every tool ignores it** outside snow. A rain week in May can create a 300-visit backlog. The fix is a deterministic playbook plus a solver, not a forecast widget.
3. **Seasonal capacity is invisible until it is too late.** Owners discover in June that they sold 140% of crew capacity. Rootline shows the capacity curve while the proposals are still being written, and [03](03-crm-sales-estimating-proposals.md) uses it to set start dates and overtime premiums.
4. **Maintenance and installs live on separate boards.** Design-build firms run installs in spreadsheets or project tools and maintenance in route software. One board with one resource model ends double-booking of the skid steer.
5. **The schedule should be the source of truth for clients.** Portal ETAs, on-my-way texts, rain notices and self-scheduling all draw from the same model, so the client never hears three different stories.

> **Competitive edge.** Jobber's routing is a single-crew sort that users say ignores roads; Aspire's board is powerful but assumes a trained dispatcher; Real Green owns rounds but not installs; ServiceTitan's dispatch is built for HVAC calls. Rootline is the only platform in this segment specified to solve the **whole-week, all-crew** problem with road-network times, skills, equipment, time windows, breaks and dump runs, then keep that plan stable week over week and replan it in one action when it rains, at an SMB price.

---

## 3. Personas and jobs-to-be-done

| Persona | Role key | Scheduling surfaces | Peak scheduling moments |
|---|---|---|---|
| Business Owner | `owner` | Capacity planner, season overview, dispatch board (read-mostly), Copilot | February-March season planning; June "are we oversold?"; rain weeks |
| Office / Admin Manager | `office_manager` | Dispatch board, unassigned queue, client reschedule requests, holiday calendar | Daily 6:00-8:00 a.m. adjustments; client calls "can you come Thursday instead?" |
| Operations / Account Manager | `ops_manager` | Dispatch board, route optimizer, scenarios, weather playbooks, live map, project Gantt, Round Planner | Night-before route publish; rain-day decision at 5:30 a.m.; mid-day breakdowns |
| Sales Rep / Estimator | `estimator` | Own calendar of site assessments (non-crew events), capacity overlay when quoting start dates, "best day" for new clients | Spring selling season; promising a start week on a patio |
| Landscape Designer | `designer` | Install sequence from the design ([10](10-design-studio.md)) into project phases; client design meetings on calendar | Handing a sold design to production |
| Crew Lead / Foreman | `crew_lead` | Crew app route, reorder same-day stops, report delays, request help | 6:30 a.m. load-out; 1:00 p.m. "we are 45 minutes behind" |
| Field Technician | `technician` | Crew app today view (read), personal schedule | Knowing which crew and truck they are on |
| Bookkeeper | `bookkeeper` | Read-only: visits completed vs billed, skipped visits | Month-end reconciliation of per-visit billing |
| Subcontractor | `subcontractor` | Offers to accept/decline, own calendar of assigned visits, on-my-way | Irrigation sub accepting 6 winterizations for Friday |
| Residential client | `client_residential` | Portal: next visit, ETA, skip/reschedule requests, booking windows | "Is the crew coming today? I need to let the dog in." |
| Commercial client | `client_commercial` | Portal: multi-property schedule, service calendar, approvals for schedule changes on fixed-date sites | HOA pool opening Saturday; office park needs mowing before 7 a.m. |
| Platform staff | `platform_support`, `platform_engineer` | Read-only diagnostics of optimization runs and routes (consented) | 6-9 a.m. Eastern "my crew can't see today's route" tickets ([02](02-personas-roles-permissions.md)) |

**Jobs-to-be-done**

- *When* I sign a new weekly mowing client in April, *I want* Rootline to tell me which day and crew add the least drive time and still have room, *so that* I can tell the client "your crew comes Tuesdays" before I hang up.
- *When* it is February, *I want* to see sold hours against crew capacity for every week of the season, *so that* I know whether to hire two seasonal technicians or stop selling cleanups.
- *When* the forecast shows 0.6 inches of rain Wednesday, *I want* one button that moves Wednesday's mowing to Thursday and Friday, keeps the HOA fixed, notifies affected clients and tells the crews, *so that* I don't spend 90 minutes dragging cards and texting.
- *When* a mower breaks at 10:40 a.m., *I want* to see which of that crew's remaining 9 stops other crews can absorb within today's hours, *so that* clients are not skipped.
- *When* a fertilizer round window opens, *I want* 1,400 lawns sequenced by subdivision with licensed applicators assigned and wind limits checked, *so that* the round finishes before the window closes.
- *When* a patio project is sold, *I want* its phases to land on the install crew's calendar after the dig ticket clears and after the pavers are delivered, *so that* the crew never shows up to a site they cannot work.
- *When* I'm a crew lead running late, *I want* the app to tell the office and the next clients automatically, *so that* I don't have to call anyone from the truck.
- *When* I'm a homeowner, *I want* to know the crew comes Tuesday and see a live ETA that morning, *so that* I can open the gate.
- *When* I'm a property manager with 14 sites, *I want* one calendar showing every scheduled service and every weather delay, *so that* I can answer my board without calling the landscaper.

---

## 4. Feature specification

Features are grouped by capability. Each carries a priority tag. "Company setting" means a tenant-level configuration in Settings > Scheduling; "branch setting" means it can be overridden per branch.

### 4.1 Scheduling object model and lifecycle

#### 4.1.1 Core objects [MVP]

| Object | What it is | Created by | Example |
|---|---|---|---|
| **Job** | Unit of sold work. Types: `work_order` (one-off), `project` (multi-phase install), `recurring` (work under a Service Agreement) | Proposal acceptance ([03](03-crm-sales-estimating-proposals.md)), manual, portal booking ([16](16-marketing-growth-communications.md)), storm event ([14](14-service-line-modules.md)) | J-1042 "Henderson backyard patio and planting" (project) |
| **Service Schedule** | A recurring line on a recurring Job: what is done, how often, in which season, with what duration, skills and equipment | Agreement activation ([07](07-invoicing-billing-contracts.md)) | "Weekly mowing, Apr 1 - Nov 15, 0.75 crew-hours, 21-inch push mower allowed, Tuesday zone" |
| **Recurrence Rule** | RFC 5545 RRULE plus Rootline extensions (season bounds, frequency profile, route-day anchor, A/B week parity, exceptions) | Service Schedule editor | `FREQ=WEEKLY;BYDAY=TU` within 2027-04-01..2027-11-15 |
| **Job Phase / Job Task** | Ordered parts of a project with dependencies and durations | Project template, Design Studio install sequence ([10](10-design-studio.md)) | "Phase 2: Base prep and pavers (3 crew-days)" |
| **Visit** | A single scheduled occurrence of work on a date for a crew. The atomic unit the crew app executes and billing counts | Recurrence engine, Round Planner, project scheduler, manual | V-58840 "Ortiz weekly mow, Tue Nov 10, 2026, Crew 1, stop 7" |
| **Visit Line** | Work items performed on a Visit (mow, trim, edge, blow; or a round's application; or a project task's share) | Copied from Service Schedule or task | "Mow 6,200 sq ft; edge 180 lf; blow hardscape" |
| **Crew** | Group of employees with a crew lead plus a default vehicle, trailer and equipment kit | Settings > Crews | "Crew 1: Luis (lead) + 2, Truck T-12, 16 ft trailer TR-04" |
| **Crew Day** | A crew's roster, shift, vehicle and equipment for one date. Overrides the crew default | Generated nightly from the crew default; edited on the board | "Crew 1, Tue Nov 10: Luis, Marco, Dani (fill-in for Jesse); 7:00-17:30" |
| **Route** | Ordered Visits for a Crew Day, with depot start/end, breaks and auxiliary stops (dump, supply house) | Optimizer or manual ordering | "Crew 1 Tue: yard -> 18 stops -> green-waste dump -> yard; 6.1 h on site, 1.4 h drive" |
| **Zone (Territory)** | A polygon assigned to one or more route days (and optionally crews) | Territory tool | "Zone T-North = Tuesday, Crews 1 and 3" |
| **Master Route** | The season template sequence for a zone-day, used as the stable baseline for daily routes | Seasonal territory solve | "Tuesday North master: 74 properties, 2 crews" |
| **Resource** | Schedulable equipment: vehicle, trailer, mower class, skid steer, aerator, dump trailer, plow truck, sprayer | [13](13-operations-inventory-equipment.md) asset register | "SK-02 skid steer", "AER-01 stand-on aerator" |
| **Reservation** | A time-bounded claim on a Resource by a Crew Day, Visit or Job Phase | Board, optimizer, project scheduler | "SK-02 reserved for J-1042 Phase 2, Nov 16-18" |
| **Scenario** | A sandboxed copy of part of the schedule for what-if planning | Dispatcher, Copilot | "What if Crew 4 is out all week?" |
| **ScheduleDiff** | A proposed set of changes with KPI deltas, conflicts and notifications to be sent | Optimizer, weather playbook, Copilot, bulk tools | "Rain Wednesday: 41 visits move, +0.6 h OT on Crew 2, 38 client texts" |

#### 4.1.2 Job lifecycle and scheduling gates [MVP]

```mermaid
stateDiagram-v2
    [*] --> draft
    draft --> awaiting_gates : "sold (proposal accepted)"
    awaiting_gates --> ready_to_schedule : "all gates satisfied"
    awaiting_gates --> ready_to_schedule : "gate overridden with reason"
    ready_to_schedule --> scheduled : "first visit or phase placed"
    scheduled --> in_progress : "first visit started"
    in_progress --> on_hold : "hold (weather, client, materials, permit)"
    on_hold --> scheduled : "hold released and replanned"
    in_progress --> completed : "all visits or phases complete"
    completed --> closed : "final invoice and walkthrough"
    draft --> canceled : "canceled"
    awaiting_gates --> canceled : "canceled"
    scheduled --> canceled : "canceled with visit cleanup"
    closed --> [*]
    canceled --> [*]
```

**Scheduling gates** (Company setting per job type; each gate shows owner, status and blocker reason in the backlog):

| Gate | Default for | Satisfied when | Source |
|---|---|---|---|
| Deposit paid | Projects (on), work orders over $2,500 (on), recurring (off) | `payment.deposit_received` for the required amount | [08](08-payments-stripe.md), [06](06-customer-portal.md) |
| Signed and unpaid allowed | Recurring maintenance | Proposal signed | [06](06-customer-portal.md) (signed_unpaid does not block recurring by default) |
| Materials available | Projects, installs with plant lists | All PO lines `received` or delivery `confirmed` with ETA before phase start | [13](13-operations-inventory-equipment.md) |
| Dig ticket clear (811 / Canadian one-call) | Any task with excavation deeper than the Company threshold (default 12 in) | Ticket status `clear` and within its validity window | [14](14-service-line-modules.md) |
| Permit issued | Projects flagged `permit_required` | Permit record `issued` | [14](14-service-line-modules.md) |
| HOA/architectural approval | Projects flagged by the estimator | Approval document attached | [03](03-crm-sales-estimating-proposals.md) |
| Design sold | Projects created from a Design | Design version frozen as `sold` | [10](10-design-studio.md) |
| Pre-application notices sent | Lawn/PHC rounds in notification states | Notices sent and lead time elapsed | [14](14-service-line-modules.md) |

Rules:
- A Job in `awaiting_gates` can be **tentatively placed** on the board (hatched card, "Not confirmed") for capacity planning, but its Visits cannot be `dispatched` and no client notice goes out.
- Overriding a gate requires `job.gate_override` permission, a reason, and is audited. Overriding "dig ticket clear" is never allowed (hard block).

#### 4.1.3 Visit state machine (canonical) [MVP]

The [Architecture](20-architecture-security.md) entity notes list the coarse states `unscheduled -> scheduled -> dispatched -> in_progress -> completed / skipped / canceled`. This module defines the full canonical machine; the crew app ([05](05-field-crew-mobile-app.md) section 5.2) implements the field subset. `en_route`, `on_site` and `paused` roll up to `in_progress` for coarse reporting, and `partially_completed` rolls up to `completed` with a flag.

```mermaid
stateDiagram-v2
    [*] --> unscheduled
    unscheduled --> scheduled : "date assigned"
    scheduled --> unscheduled : "unassigned to backlog"
    scheduled --> dispatched : "route published to crew"
    dispatched --> scheduled : "pulled back before start"
    dispatched --> en_route : "crew starts drive"
    en_route --> dispatched : "drive aborted"
    en_route --> on_site : "arrival confirmed"
    dispatched --> on_site : "arrival without drive start"
    on_site --> in_progress : "work started"
    in_progress --> paused : "pause or leave site"
    paused --> in_progress : "resume"
    in_progress --> completed : "required items done"
    in_progress --> partially_completed : "complete with open tasks"
    on_site --> skipped : "no access, dog loose, unsafe"
    dispatched --> skipped : "skip with reason"
    scheduled --> skipped : "office skip with reason"
    scheduled --> canceled : "office or client cancels"
    dispatched --> canceled : "office cancels"
    unscheduled --> canceled : "canceled"
    scheduled --> missed : "service date passed, not started"
    dispatched --> missed : "service date passed, not started"
    missed --> scheduled : "rescheduled"
    missed --> skipped : "closed as skipped"
    completed --> [*]
    partially_completed --> [*]
    skipped --> [*]
    canceled --> [*]
```

| Transition | Allowed actors | Validations | Side effects |
|---|---|---|---|
| `unscheduled -> scheduled` | office_manager, ops_manager, owner, optimizer (via accepted diff), portal booking | Date within the visit's due window (warn outside, block outside a round's compliance window); property not in blackout | `visit.scheduled`; reservations created; client notice per [16](16-marketing-growth-communications.md) rules |
| `scheduled -> dispatched` | Route publish (manual or nightly auto-publish) | Crew assigned; hard constraints pass (skills, licenses, equipment, no double booking) | `visit.dispatched`; delta pushed to crew devices |
| `dispatched -> en_route / on_site / in_progress / paused` | crew_lead, technician, subcontractor (own) | Server re-validates on sync | `visit.en_route` (ETA text trigger), `visit.arrived`, `visit.started`, `visit.paused` |
| `in_progress -> completed / partially_completed` | crew_lead, technician, subcontractor (own) | Required checklist, photos, chem record, signature ([05](05-field-crew-mobile-app.md) 4.4.5) | `visit.completed` / `visit.partially_completed`; billing, job cost, portal timeline; partial with "return needed" creates an `unscheduled` follow-up Visit linked by `parent_visit_id` |
| `* -> skipped` | crew (on site), office (before start) | Reason code required (rain, no access, dog loose, client request, no growth, unsafe, equipment failure, ran out of time, holiday, other) | `visit.skipped`; agreement skip counters; make-up policy (4.2.6, 4.9.3) |
| `* -> canceled` | office, client (portal, if lead time allows), agreement cancellation | Not allowed from `in_progress` or terminal states | `visit.canceled`; reservations released; notification |
| `scheduled/dispatched -> missed` | System, at 03:00 property-local the day after `service_date` | No start event received (and no pending offline sync flagged for that crew, see below) | `visit.missed`; appears in "Needs attention" queue; never auto-billed |
| `missed -> scheduled` | office, ops, Copilot diff | As `unscheduled -> scheduled` | `visit.rescheduled` |

**Offline guard on `missed`.** If any device on the visit's crew has unsynced commands older than the service date, the system holds the `missed` transition for up to 24 hours and shows "Awaiting crew sync" instead, because the visit may have been completed offline ([05](05-field-crew-mobile-app.md) section 4.21).

**Conflict rule.** Terminal field states win over office states: a Visit completed offline after the office canceled it becomes `completed` with `conflict = canceled_but_performed` and a billing review task ([20](20-architecture-security.md) section 4.11).

**Flags (orthogonal to state):** `weather_hold`, `needs_reschedule`, `late_risk`, `conflict`, `locked`, `client_confirmed`, `presence_required`, `first_visit` (new client: show extra access notes), `do_not_move` (fixed-date commercial events).

#### 4.1.4 Visit timing, flexibility and locks [MVP]

Every Visit carries these scheduling attributes. They are inherited from the Service Schedule or Job Phase and can be overridden per Visit.

| Attribute | Values | Default | Used by |
|---|---|---|---|
| `due_window` | Start and end dates the visit must fall within | Weekly mow: the ISO week. Round: the round's application window. Cleanup: the seasonal calendar window | Backlog aging, optimizer, missed-window alerts |
| `flexibility` | `fixed_date`, `day_flex` (+/- N days, default N = 1), `week_flex` (any working day in the due week), `window_flex` (any date in the due window) | Weekly mow `week_flex` anchored to route day; projects `fixed_date` once confirmed; cleanups `window_flex` | Rain playbooks, optimizer moves |
| `time_window` | `anytime`; `between` (earliest arrival, latest arrival); `fixed_time` (appointment); `before`/`after` shortcuts | `anytime` | Optimizer hard or soft constraint (Company setting per window type) |
| `presence_required` | Boolean, with contact | false; true for design consults, irrigation start-ups with indoor valves, walkthroughs | Self-scheduling shows time slots instead of days |
| `access_window` | Gate or site access hours (e.g., community gate staffed 8:00-16:00; school sites only after 15:30 or on weekends; HOA quiet hours no blowers before 8:00) | From Property access info | Hard constraint |
| `duration_budget` | Crew-hours from the estimate's production rates, plus fixed setup minutes | From estimate ([03](03-crm-sales-estimating-proposals.md)) | Capacity, optimizer, crew hours budget |
| `crew_size_min` / `crew_size_max` | Minimum and maximum people on the visit | 1 / unlimited; tree removals min 3; sod installs min 2 | Assignment validation |
| `priority` | 1 (contractual, e.g., commercial SLA) to 5 (filler) | Commercial 2, residential maintenance 3, upsell 4 | Optimizer drop penalty, rain playbooks |
| `lock` | `none`, `crew`, `day`, `time`, `sequence`, `full` | `none`; client-requested times set `time`; commercial fixed dates set `day` | Optimizer and Copilot will not move locked dimensions |
| `stability_anchor` | Route day, crew and sequence position from the Master Route | Set when the Master Route is published | Stability penalty (4.8.5) |

**Duration from crew-hours to clock-hours.** A Visit's labor is budgeted in crew-hours (person-hours). On-site clock time depends on crew size and an efficiency curve (Company setting, default: 1 person 1.00, 2 people 0.95 each, 3 people 0.90 each, 4 people 0.85 each, 5+ people 0.80 each). Example: a 1.5 crew-hour mow with a 3-person crew takes 1.5 / (3 x 0.90) = 0.56 h, about 34 minutes on site, plus 5 minutes fixed setup (unload/load). The crew app shows the crew's hours budget per Visit in the same units ([05](05-field-crew-mobile-app.md)).

**Learned durations [V1].** After 3 completed occurrences, the system computes an exponentially weighted moving average of actual on-site crew-hours per Service Schedule (alpha 0.3, outliers beyond 2.5 standard deviations ignored, weather-flagged visits down-weighted). The dispatcher sees "Budget 0.75 h, actual trend 0.92 h" and can accept the learned value for scheduling without changing the client's price. Persistent overruns (trend > budget x 1.15 over 6 visits) raise a "re-price candidate" for [03](03-crm-sales-estimating-proposals.md) and [18](18-reporting-analytics.md).

### 4.2 Recurrence engine and visit generation

#### 4.2.1 Recurrence patterns [MVP unless tagged]

Rootline stores recurrence as RFC 5545 RRULE strings plus a Rootline extension record ([20](20-architecture-security.md) section 7.1). The editor never shows RRULE text to users; it offers landscape-native presets.

| Preset | Typical use | RRULE core | Rootline extensions | Notes |
|---|---|---|---|---|
| Weekly on route day | Residential and commercial mowing | `FREQ=WEEKLY;BYDAY=TU` | Season 2027-04-01..2027-11-15; `route_day_anchor = zone` (day follows the zone if the zone's day changes) | The default for maintenance |
| Bi-weekly (A/B weeks) | Budget mowing, shrub maintenance, low-growth turf | `FREQ=WEEKLY;INTERVAL=2;BYDAY=TU` | `parity = A or B` relative to the Company's season week 1 | The optimizer balances A and B so each Tuesday carries a similar load (4.7.4) |
| Twice a month | Commercial detailing, bed maintenance | `FREQ=MONTHLY;BYDAY=1TU,3TU` | Season bounds | Avoids the 5th-week gap problem of "every 2 weeks" when billing monthly |
| Every N days | Irrigation checks, mosquito treatments every 21 days | `FREQ=DAILY;INTERVAL=21` | `snap_to_route_day = true` snaps to the nearest route day within +/- 3 days | Without snapping, every-N-days floats across weekdays and destroys route density; the editor warns |
| Monthly | Irrigation inspections, monthly detailing | `FREQ=MONTHLY;BYDAY=2WE` | Season bounds | |
| Frequency profile (seasonal segments) | Mowing weekly in peak growth, bi-weekly in summer slowdown | Multiple RRULE segments | Segments: weekly Apr 1-Jun 30, bi-weekly Jul 1-Aug 31, weekly Sep 1-Oct 31, bi-weekly Nov 1-Nov 15 | Common in the Southeast and Midwest; billing implications in [07](07-invoicing-billing-contracts.md) |
| Count-limited | "26 mows per season" contracts | `FREQ=WEEKLY;BYDAY=TU;COUNT=26` | Counter tracks completed vs contracted; skipped visits optionally do not consume the count | Lets the season end early or late by weather |
| Seasonal calendar item | Spring cleanup, mulch, aeration and overseeding, fall cleanups, irrigation start-up and winterization, holiday lighting install and takedown | No RRULE: one or more `window_flex` Visits per season | Window per Region (e.g., spring cleanup Mar 20-Apr 30 in zone 6a, Mar 1-Apr 10 in 7b), min gap between multiple occurrences (fall cleanup x2, min 14 days apart) | Generated at agreement activation for the whole season |
| Program round | 5-step fertilizer, 6-round tree and shrub PHC, mosquito | From the Program Engine ([14](14-service-line-modules.md)) | Window, min days since previous round (default 28), compliance gates | Round instances become Visits through the Round Planner (4.2.5) |
| Event-driven | Snow pushes, de-icing, storm cleanups | None | Created by storm events ([14](14-service-line-modules.md)) | Routed by 4.9.6 |
| Growth-adaptive [V1] | Mowing that follows the grass, not the calendar | Base weekly rule | Growth model decides "mow", "skip", or "stretch" per occurrence (4.2.6) | Opt-in per agreement |

**Validation rules**
- Season start must be before season end; a season longer than 12 months is rejected (use renewals).
- Weekly or bi-weekly rules must have exactly one BYDAY that matches one of the Property's zone days, unless the Service Schedule is marked `off_zone` (requires `schedule.off_zone` permission and shows an "off-zone" badge with its estimated drive cost).
- Two Service Schedules on the same Property with overlapping service types (e.g., two mowing schedules) are rejected unless one is explicitly `supplemental`.
- Minimum spacing rule per service type (Company setting): mowing >= 4 days between visits, fertilizer rounds >= 28 days (from [14](14-service-line-modules.md)), aeration >= 300 days. A move that would violate spacing is blocked for compliance-bearing services and warned for others.

#### 4.2.2 Route-day anchoring [MVP]

Most residential recurring Visits do not have a client-chosen day; they have a **zone day**. The recurrence anchors to the zone, not to a fixed weekday:
- If the Company rebalances zones in July and moves "Maple Ridge" from Tuesday to Wednesday, all future `week_flex` Visits anchored to that zone move, with a single bulk client notice ("Starting July 14, your service day is Wednesday").
- Visits with `client_day_lock` (the client insisted on Fridays because of a Saturday party venue) do not follow the zone and are flagged off-zone if the zone moves.

#### 4.2.3 Seasonal service calendar [MVP]

Companies define a **Season Calendar** per Region and branch: service types with their default windows and capacity pool. Defaults ship per Region from platform templates ([19](19-platform-admin-portal.md) manages templates; [14](14-service-line-modules.md) shows the 12-month service-line calendar). Example for a zone 6a Midwest branch:

| Service | Window | Visits per season | Capacity pool | Weather sensitivity |
|---|---|---|---|---|
| Spring cleanup | Mar 20 - Apr 30 | 1 | Maintenance crews | Avoid saturated soil (> 1 in rain in 24 h) |
| Irrigation start-up | Apr 15 - May 15 | 1 | Irrigation techs | Not before last frost risk (soil temp > 40 F and no freeze forecast for 7 days) |
| Mulch install | Apr 15 - May 31 | 1 | Enhancement crews | Rain tolerant |
| Weekly mowing | Apr 1 - Nov 15 | 30-33 | Mowing crews | Skip at >= 0.25 in rain in the crew window |
| Aeration and overseeding | Aug 25 - Oct 10 | 1 | Aeration crew | Moist, not saturated soil |
| Irrigation winterization | Oct 1 - Nov 10 | 1 | Irrigation techs | Prioritize before first hard freeze (28 F or below) |
| Fall cleanup | Oct 20 - Dec 5 | 1-2 | Maintenance crews | Leaves down; after first hard freeze for the last pass |
| Snow season | Nov 1 - Apr 15 | Event-driven | Snow crews and subs | Storm Event Engine |

Season calendar windows can be shifted per year by the owner ("late spring: shift all spring windows +10 days") with a preview of affected Visits.

#### 4.2.4 Visit generation horizon and materialization [MVP]

Visits exist in three forms:

| Form | Persisted? | Horizon | Purpose |
|---|---|---|---|
| **Projected** | No (computed on read from rules) | Rest of the season, up to 52 weeks | Capacity planning, revenue forecast, client portal "season calendar" |
| **Materialized** | Yes (`visit` rows, state `scheduled` or `unscheduled`) | Rolling horizon, Company setting, default **8 weeks** for recurring, whole season for seasonal calendar items and rounds | Board, routes, reservations, client notices |
| **Dispatched** | Yes | Published days (default: today and tomorrow) | Crew devices |

Rules:
- A nightly job (02:00 tenant-local) materializes recurring Visits up to the horizon. Range: 2-26 weeks. Large tenants (> 2,000 recurring schedules) default to 6 weeks to bound row counts.
- Materialization is **idempotent**: each occurrence has a deterministic key `(service_schedule_id, occurrence_date_original)`. Re-running never duplicates.
- Editing a recurrence rule regenerates only **untouched** future materialized Visits. A Visit that was manually moved, re-crewed, locked, or has notes/photos/assets attached is **detached** and kept; the editor shows "3 detached visits will keep their custom settings [Review]".
- Edit scopes: "This visit", "This and following" (splits the Service Schedule at the date, keeping history), "Entire season" (only future, non-detached visits).
- Deleting a Service Schedule cancels future Visits (state `canceled`, reason `schedule_removed`) and never touches completed history.
- Agreement suspension for non-payment ([07](07-invoicing-billing-contracts.md)) pauses materialization and moves already-materialized future Visits to `unscheduled` with flag `on_hold_ar`; crews see "Service on hold" if a held Visit is opened. Reactivation re-materializes from the reactivation date; no automatic make-up of missed occurrences unless the Company setting says so.
- Client vacation holds (portal, [06](06-customer-portal.md)) create Property blackouts (4.2.7).
- Projected Visits for capacity use the same generator code path as materialization (one engine, two outputs) so the forecast and the schedule cannot disagree.

#### 4.2.5 Program rounds hand-off [MVP]

The Program Engine in [14](14-service-line-modules.md) owns round templates, enrollment and round instances. The contract with this module:
1. Round instances carry: Property, round number, application window (start/end), minimum days since previous round, product mix, required license category, measured area, weather guardrails, notification gate status.
2. The **Round Planner** (a view in [14](14-service-line-modules.md)) groups eligible instances by zone and week and calls the scheduling API `POST /scheduling/plans` with `mode = round` and a target week.
3. This module's optimizer sequences them into routes for licensed applicators only (hard skill constraint `pesticide_applicator` with the product's category valid in the Property's state/province), checks hourly wind and rain forecasts per route day (amber/red flags from [14](14-service-line-modules.md) section 4.1), and returns a ScheduleDiff.
4. Accepted Visits link back to the round instance (`visit.round_instance_id`). Rescheduling a round Visit outside its notified window triggers re-notification automatically (rule owned by [14](14-service-line-modules.md); this module emits `visit.rescheduled` with `old_date`/`new_date`).
5. Window protection: a round Visit cannot be moved past its window end. The rain playbook treats rounds with fewer than 5 working days left in their window as priority 1.

#### 4.2.6 Growth-adaptive mowing frequency [V1 rules, V2 AI model]

Grass does not grow on a calendar. In a dry August in Ohio, weekly mowing clients are paying for crews to "mow" dormant turf; in a wet May, bi-weekly clients' lawns get away from the crew. Growth-adaptive frequency lets a Company sell "mow when it needs it" and route accordingly.

**Inputs per Property (daily):**
- Turf type from the Property profile (cool-season: Kentucky bluegrass, tall fescue, perennial ryegrass; warm-season: bermudagrass, zoysia, St. Augustine; mixes), irrigation present (from the Property asset registry in [14](14-service-line-modules.md)).
- Weather service (4.9): daily mean temperature, rainfall over the past 7 days, reference evapotranspiration (ET0) where available.
- A **turfgrass growth potential (GP)** curve: a bell-shaped function of mean air temperature with an optimum near 68 F for cool-season and 88 F for warm-season grasses, as published in the turf-management literature (Gelernter and Stowell's growth potential model; background knowledge, verify before shipping coefficients).
- Crew observations: "no growth" skip reasons and clipping-volume quick tags from the crew app (`none`, `light`, `normal`, `heavy`).

**Rule engine [V1]:**
- `GP_7day` = mean growth potential over the last 7 days, adjusted down by 40% if 7-day rainfall < 0.25 in and the Property is not irrigated (default adjustments, tunable per Region by `platform_curator` templates).
- If `GP_7day < 0.25` for cool-season turf: the next weekly Visit becomes a **stretch candidate** (propose moving to the following week, i.e., temporary bi-weekly).
- If two consecutive crew observations are "none": propose skip of the next occurrence.
- If `GP_7day > 0.75` and the client is bi-weekly with `allow_growth_upgrade = true`: propose an extra mid-cycle mow (billable per visit).

**Contract and billing guardrails (with [07](07-invoicing-billing-contracts.md)):**
- Agreements carry `growth_adaptive = off | suggest | auto`. Default `off`. `suggest` produces dispatcher proposals; `auto` applies after the client-notice lead time (default 24 h) unless the client objects in the portal.
- Per-visit billing: client pays only for performed visits; the client notice says so.
- Fixed monthly (level-pay) billing: growth skips do not change the invoice; the agreement's `max_growth_skips_per_season` (default 4) caps skips so the Company does not under-deliver against a fixed price. Beyond the cap, skips need client consent.
- Every growth skip is logged with its evidence (GP, rainfall, crew observation photo) for dispute defense.

**Routing effect:** stretching 30% of a Tuesday zone in a drought frees whole crew-days. The capacity view shows "Freed: 18.5 crew-hours in week 32", and the Copilot proposes filling them with backlog (aeration pre-sales, bed edging enhancements) or giving crews a 4-day week.

**AI model [V2]:** a per-Region gradient-boosted model trained on clipping-volume tags, visit durations and weather predicts next-week growth class per Property (none/light/normal/heavy) and expected on-site duration. Labels come from crews, so the model improves with use. Platform-level pooled training across tenants requires the opt-in data-sharing setting in [19](19-platform-admin-portal.md).

> **Competitive edge.** No competitor reviewed in [R1](research/R1-field-service-platforms.md) or [R2](research/R2-landscape-specific-platforms.md) documents growth-driven mowing frequency. It is the kind of feature that only works when weather data, property turf data, crew observations, routing and billing live in one system, which is exactly Rootline's architecture.

#### 4.2.7 Holidays, blackouts and closures [MVP]

**Calendars:**
- **Company holiday calendar**, seeded from the country and province/state at provisioning: US federal holidays and Canadian statutory holidays for the Company's provinces (they differ: e.g., Civic Holiday, Family Day, Saint-Jean-Baptiste in Quebec, Remembrance Day observance varies by province; verify per province). The owner toggles which ones the Company observes.
- **Branch calendars** inherit and override (e.g., a Quebec branch observes June 24).
- **Crew blackouts:** crew-wide training days, the annual equipment shop day.
- **Employee time off** comes from [15](15-team-hr-payroll.md) and reduces Crew Day roster and capacity; it does not block the Crew.
- **Property blackouts:** client vacation, HOA events ("no work during the community 5K, Apr 24"), school sites during exams, construction on site, "do not service" holds.
- **Resource blackouts:** equipment down for maintenance from [13](13-operations-inventory-equipment.md).

**Holiday policies** (Company setting per holiday, default shown):

| Policy | Behavior | Default for |
|---|---|---|
| `work` | Normal schedule | Juneteenth, Columbus Day/Indigenous Peoples' Day, Veterans Day, Remembrance Day (configurable) |
| `slide_week` | Holiday's routes move +1 working day, and each following day of that week slides +1, with the last day landing on Saturday (if Saturday is a working day) or splitting across remaining days | Memorial Day, Labor Day, Victoria Day, Canada Day when it falls on a weekday |
| `shift_next` | Only the holiday's routes move to the next working day, merged into that day's routes and re-optimized | Good Friday (where observed) |
| `shift_previous` | Holiday's routes move to the previous working day | July 4 when the Company prefers to work the Saturday before |
| `skip` | Holiday's recurring visits are skipped (reason `holiday`), non-recurring visits move to backlog | Christmas Day, New Year's Day (off-season for most) |
| `compress` | Holiday's routes are distributed across the remaining working days of the week by the optimizer, respecting capacity | Thanksgiving week for fall cleanups |

**Worked example (Memorial Day 2027, Monday May 31).** Policy `slide_week`, Saturday enabled. Monday's 4 routes (96 visits) move to Tuesday June 1; Tuesday's move to Wednesday; ... Friday's 88 visits move to Saturday June 5. Commercial Visits with `lock = day` stay put and are flagged for manual decision. One ScheduleDiff shows 472 moved visits, 0 capacity violations, and one bulk client notice per affected client ("Holiday week: your service moves from Tuesday to Wednesday this week"). Generation of the diff happens 14 days ahead (Company setting) so notices go out with 7 days' lead.

**Observed dates:** when a holiday falls on a weekend, the observed weekday is used if the Company observes it (July 4, 2027 is a Sunday; observed Monday July 5).

**Blackout rules:**
- Placing a Visit on a blacked-out date is a hard block for Property and Resource blackouts, a warning for Company holidays (some companies work holidays for commercial sites at premium pay).
- Creating a blackout over already scheduled Visits opens a resolution dialog: move to next eligible date (default), skip, or keep (only for Company holidays).

#### 4.2.8 Client-driven schedule changes [MVP]

Clients request skips, reschedules and extra visits from the portal ([06](06-customer-portal.md)) or by message. Rules:
- **Skip next visit**: allowed up to the Company's cutoff (default 18:00 the day before service). After cutoff the request becomes an office task. Per-visit billing clients are not charged; fixed-price clients see the agreement's skip policy ("Skips do not reduce your monthly price; 2 skips per season can be made up on request").
- **Reschedule**: the portal offers only dates with capacity in the Property's zone (4.13). Commercial clients with approval workflows route requests to the approver contact first.
- **Pause service** (vacation): creates a Property blackout with start/end; recurring Visits within are skipped with reason `client_pause`.
- All client changes produce `visit.rescheduled` or `visit.skipped` with `actor_type = client`.

### 4.3 Capacity planning and backlog

#### 4.3.1 Capacity model [MVP basic, V1 full]

Capacity is computed in **crew-hours** per **capacity pool** per day, then rolled up by week, month and season.

**Supply (available productive crew-hours) for a Crew Day:**

```text
available = sum over roster members of (shift_hours - unpaid_meal - paid_breaks_not_productive)
            - shop_time (load-out, fueling; default 0.5 h per person per day)
            - drive_allowance (from the crew's trailing 4-week drive share, default 20% of remaining)
```

Example: Crew 1 is 3 people on a 10-hour shift (7:00-17:00) with a 30-minute unpaid meal. Paid hours = 3 x 9.5 = 28.5. Shop time 1.5 crew-hours. Drive allowance 20% x 27.0 = 5.4. **Available productive = 21.6 crew-hours.** At 0.75 crew-hours per average residential mow plus 5 minutes setup (0.25 crew-hours for 3 people), that is about 21 mows per day.

**Capacity pools** group crews by what they can do: `mowing`, `enhancement`, `install_hardscape`, `install_softscape`, `irrigation`, `lawn_application`, `tree`, `snow`, `lighting`. A crew can belong to multiple pools with a primary pool. Employees with skills (4.4) contribute to pools that require those skills.

**Demand (sold crew-hours)** per pool per week:
- Materialized and projected recurring Visits (duration budgets, or learned durations [V1]).
- Seasonal calendar items spread across their windows using a **window-spread curve** (Company setting: `flat`, `front_loaded`, `back_loaded`; default flat). Example: 220 fall cleanups at 3.5 crew-hours each = 770 crew-hours spread over Oct 20-Dec 5 (about 6.5 weeks), so about 118 crew-hours per week.
- Program rounds from [14](14-service-line-modules.md) enrollments.
- Projects: phase durations placed on tentative or confirmed dates.
- **Backlog**: sold, unscheduled work with due windows.
- **Pipeline forecast [V1]**: open opportunities from [03](03-crm-sales-estimating-proposals.md) weighted by stage probability and expected start month, shown as a separate stacked band ("likely to sell").

**Utilization bands** (Company setting): < 75% blue (under-booked), 75-90% green, 90-100% amber, 100-110% orange (overtime likely), > 110% red (not deliverable without hiring, subs or Saturday shifts).

**Overtime projection:** for each employee, scheduled hours per week from Crew Days vs overtime threshold (40 h/week FLSA default; daily overtime rules such as California's 8 h/day come from [15](15-team-hr-payroll.md)). The capacity view shows "Crew 2 projected 51.5 h/week in weeks 19-23: 11.5 h OT each x 4 people".

#### 4.3.2 Capacity planner views [MVP basic, V1 full]

- **Season heatmap** [MVP]: rows = capacity pools (expandable to crews), columns = weeks (52), cells = utilization % with color band. Click a cell for the breakdown: recurring, seasonal, rounds, projects, backlog, pipeline.
- **Week detail** [MVP]: crews x days with available vs scheduled hours, overtime projection and unassigned demand.
- **What-if levers** [V1]: add a crew (from a crew template) for a date range, add Saturday shifts, extend shift to 11 hours, move demand to subcontractors, push a project's start. Each lever shows its effect on the curve and its cost (labor at loaded rate from [15](15-team-hr-payroll.md), sub cost from [13](13-operations-inventory-equipment.md)).
- **Hiring planner** [V1]: "To keep weeks 15-22 under 95%, add 2 seasonal technicians by April 6"; links to recruiting in [15](15-team-hr-payroll.md).
- **Sales throttle** [V1]: capacity feeds [03](03-crm-sales-estimating-proposals.md) so estimators see "Earliest start: week of May 11" on proposals, an optional OT premium when the target month is > 100%, and an owner alert when new sales push any pool above 110%.
- **Season revenue curve** [V1]: projected revenue by week from scheduled and projected visits (price from the agreement lines), handed to [18](18-reporting-analytics.md) for cash-flow forecasting.

#### 4.3.3 Backlog view [MVP]

The backlog is all sold work not yet on a date (or with a date in the past and not done). It replaces the whiteboard of "jobs to get to".

| Column | Meaning |
|---|---|
| Job / Visit | Name, client, property, service type |
| Due window | Start-end; days left in window; overdue badge |
| Value | Price of the work (for prioritizing) |
| Crew-hours | Budget |
| Needs | Skills, equipment class, crew size |
| Gates | Gate status icons (deposit, materials, 811, permit) |
| Zone / nearest route day | For slotting into existing routes |
| Age | Days since sold |
| Source | Proposal, portal request, partial-visit return, rain displacement, storm event |

Behaviors:
- Default sort: **urgency score** = window pressure (days left / window length), priority, value per crew-hour, and age. Formula weights are a Company setting; the score is shown with an "explain" tooltip.
- Filters: pool, zone, service type, gate status, "fits in a gap today".
- **Auto-slot** button [MVP for single items, V1 for batches]: runs best-insertion (4.8.6) for selected items and returns a ScheduleDiff.
- **Backlog aging alerts**: items within 5 days of window end, sold projects older than 21 days without a start date (Company setting), and displaced rain visits not yet replanned after 48 hours.
- Backlog totals by pool feed the capacity view as "backlog hours" and [18](18-reporting-analytics.md) as "backlog weeks" (backlog hours / weekly capacity).

### 4.4 Crew, skill and certification matching

#### 4.4.1 Skills catalog [MVP]

Skills are Company-defined tags on employees with optional jurisdiction, category, level and expiry. Rootline ships a default catalog; certifications and their documents live in [15](15-team-hr-payroll.md).

| Skill key | Type | Example of a requirement | Constraint strength |
|---|---|---|---|
| `pesticide_applicator` | License with state/province and category (e.g., turf and ornamental) | Fertilizer + herbicide round; mosquito treatment | Hard; must be valid on the service date; "under supervision" allowed only where the state permits and a licensed applicator is on the same Crew Day |
| `irrigation_licensed` | License (state-specific, e.g., Texas licensed irrigator) | Irrigation repairs in licensing states | Hard where required by the Company's jurisdiction setting |
| `backflow_tester` | Certification with expiry | Annual backflow test | Hard |
| `cdl_class_a` / `cdl_class_b` | License | Driving a truck/trailer combination that requires a CDL | Hard for the vehicle assignment (4.5) |
| `isa_arborist`, `tree_climber`, `crane_signal` | Certification | Tree removal, crane picks | Hard for task roles |
| `equipment_operator:skid_steer` (also excavator, mini loader) | Company-verified competency | Base prep, grading | Hard |
| `paver_install`, `wall_build`, `lighting_tech` | Competency level 1-3 | Hardscape phases | Soft (level preference) or hard (level >= 2 for crew lead) |
| `plow_operator`, `sidewalk_crew` | Competency | Snow routes | Hard during storm events |
| `spanish`, `french`, `english` | Language | Client prefers Spanish-speaking crew lead | Soft |
| `client_approved` | Property-specific | Gated community requires badge-holders; school sites require background-checked staff | Hard |
| `first_aid_cpr` | Certification | Company policy: one per crew | Hard per Crew Day |

**Rules:**
- A requirement is either on the **Visit** (someone on the crew must have it), on the **crew lead** (the lead must have it), or **all members** (everyone on site must have it, e.g., background-checked staff at schools).
- Expiry is evaluated on the **service date**, not today. A license expiring May 31 makes all assigned June round Visits fail validation on publish, and an alert goes to the owner 30 days before expiry ([15](15-team-hr-payroll.md) emits `certification.expiring`).
- The validation message names the gap: "Visit V-60012 needs `pesticide_applicator` (MN, turf) - nobody on Crew 3 on Jun 2 qualifies. Swap Dani from Crew 1 (licensed) or move to Crew 1."

#### 4.4.2 Crew templates and daily rosters [MVP]

- A **Crew** has a default roster, crew lead, home depot (yard), default vehicle and trailer, default equipment kit, shift template (e.g., Mon-Fri 7:00-17:30, Saturday optional), capacity pools, and color.
- **Crew Days** are generated nightly for the materialization horizon. Changes on a Crew Day (sick call, borrowed member, different truck) affect only that day.
- **Floaters**: employees without a home crew appear in a "Floaters" lane and can be dragged onto Crew Days.
- **Sick-day handling**: when an absence is recorded in [15](15-team-hr-payroll.md) or by the crew lead in the app, the Crew Day's capacity drops, and if scheduled hours exceed the new capacity by > 10%, a `late_risk` alert and a Copilot rebalancing proposal are raised ([17](17-ai-copilot-automation.md) agent A7).
- **Crew pairing preferences** [V1]: soft preferences (keep Marco and Dani together; do not pair two trainees) used when the optimizer fills crews from floaters.
- **Training ride-alongs** [V1]: a trainee can be added as a non-counting member (capacity contribution 0.5 by default) for a configurable number of days.

### 4.5 Equipment, vehicle and trailer reservations

#### 4.5.1 Resource model [MVP basic, V1 full]

Resources come from the asset register in [13](13-operations-inventory-equipment.md). For scheduling, each resource has: class (`truck`, `trailer`, `mower_ztr_72`, `mower_ztr_60`, `mower_walk_36`, `mower_push_21`, `skid_steer`, `mini_excavator`, `aerator`, `overseeder`, `sprayer_200gal`, `dump_trailer`, `plow_truck`, `salt_spreader`, `sod_cutter`, `stump_grinder`, `bucket_truck`, `chipper`), home depot, status (`available`, `down`, `in_shop`, `rented_out`), and **capacities** used by the optimizer:

| Capacity | Unit | Example |
|---|---|---|
| Debris volume | cubic yards | 16 ft dump trailer: 10 cu yd of leaves |
| Material weight | lb / tons | One-ton dump truck: 3 tons of river rock |
| Bulk material volume | cubic yards | Mulch: 6 cu yd per truck load |
| Liquid volume | gallons | 200-gallon sprayer: about 2 acres at 2 gal/1,000 sq ft (illustrative rate) |
| Salt | tons | Plow truck with 2-ton spreader |
| Physical width | inches | 72-inch deck mower cannot pass a 48-inch gate |
| Towing | GVWR/GCWR pounds | Truck T-12 tows up to 14,000 lb; requires CDL above thresholds |
| Energy [V2] | kWh | Battery mower range: about 4.5 h of cutting per charge (illustrative) |

#### 4.5.2 Requirements and reservations [MVP]

- Visits and Job Phases declare **equipment requirements by class** ("needs any `aerator`", "needs `skid_steer` for 2 days", "needs a mower deck <= 52 in because of the 54-inch side gate"), not specific units. Property access info supplies gate widths and "no ZTR on slope > 15 degrees" notes (slope from USGS 3DEP elevation cache in [20](20-architecture-security.md)).
- Crew Days carry the specific units (truck, trailer, kit). The validator checks that the Crew Day's units satisfy every Visit's class requirements, and the trailer can carry the kit (a 16 ft trailer fits one 72-inch ZTR plus one walk-behind; a configurable **trailer layout capacity** in "deck slots" handles this [V1]).
- **Reservations** are created when a unit is assigned to a Crew Day or a Phase. A unit can hold one reservation per time interval. Shared units (one aerator for three crews in September) can be reserved by half-day blocks.
- **Conflict detection** (on drop, on publish, and continuously): double-booked unit, unit `down` or `in_shop` on the date, unit at a different depot than the crew's start, CDL requirement not met by the assigned driver, trailer over GCWR with the assigned truck.
- **Conflict resolution UI**: the conflict panel lists alternatives ranked by cost: another unit of the same class free that day; swap with a crew whose Visits do not need it; move the Visit within its flexibility; rent (creates a non-stock PO draft in [13](13-operations-inventory-equipment.md)).
- **Breakdown flow**: when [13](13-operations-inventory-equipment.md) marks a unit `down` (or a crew reports it in the app), affected Crew Days and Visits for the downtime window get `late_risk`, and the dispatcher sees a substitution proposal (4.10.8 mid-day re-optimization uses this).
- **Equipment-aware routing** [V1]: the optimizer can be asked to choose which crew gets the shared aerator on which day to minimize total drive, treating the aerator as a scarce resource across crews in the week plan.

> **Competitive edge.** Aspire tracks equipment for maintenance and costing; Jobber and Housecall Pro do not schedule equipment at all. Rootline treats a skid steer, a trailer's deck slots and a gate width as scheduling constraints, which is what stops a crew from arriving at a backyard with a mower that does not fit through the gate.

### 4.6 Dispatch board

The dispatch board is the office's cockpit (route `/schedule/board` in [21](21-ux-design-system-sitemaps.md), where the day-view wireframe 18.4 lives). This section specifies its behavior.

#### 4.6.1 Views [MVP unless tagged]

| View | Layout | Best for |
|---|---|---|
| **Day (Gantt by crew)** | Rows = crews (plus subcontractors, non-crew staff and resource lanes), x-axis = time 5:00-21:00 (zoomable), cards sized by on-site duration, drive gaps shown as thin connectors with minutes | Morning adjustments, mid-day recovery |
| **3-day** | Same as Day, 3 columns | Rain-day shifting |
| **Week (crew x day)** | Rows = crews, columns = days; each cell shows stop count, scheduled vs available hours, utilization bar, first/last stop, weather chip; expand a cell to see its sequence | Weekly balancing, holiday slides |
| **Season calendar** | Month grid with counts per day by service type and capacity band | Owner and ops planning |
| **Map** | Routes as colored polylines (one color per crew), numbered stops, unassigned pins, depots, dump/supply sites, live crew positions (4.10), zone overlays, weather radar layer [V1] | Spatial reasoning, "who is closest" |
| **Split** | Board + map side by side (>= 1536 px screens show board, map and unassigned tray simultaneously per [21](21-ux-design-system-sitemaps.md)) | Default for ops managers |
| **List** | Sortable table of Visits with all attributes; bulk edit | Auditing, exports |
| **Resources** [V1] | Rows = equipment units, bars = reservations | Skid steer and aerator contention |
| **People** [V1] | Rows = employees, bars = Crew Day membership, time off, non-crew events | Payroll-heavy weeks, sick days |
| **Project Gantt** [V1] | Rows = projects and phases, dependency arrows (4.11) | Design-build scheduling |

Filters persist per user: branch, pool, crew, service type, status, flags (late risk, unassigned, conflicts, locked), client type. Saved filter sets ("Install crews only", "Lawn applications this week").

#### 4.6.2 Unassigned tray [MVP]

A left-hand tray lists the backlog (4.3.3) for the visible date range: unscheduled Visits, missed Visits, rain-displaced Visits, partial-visit returns, portal requests awaiting approval and tentatively placed Jobs awaiting gates. Each card shows client, service, crew-hours, due window, gates and skill/equipment needs. Sort by urgency score by default. Cards can be dragged onto a crew lane, a specific position in a route, a day cell (week view) or the map (drop on a route polyline inserts at the cheapest position on that route). A WCAG 2.5.7-compliant alternative exists for every drag: select the card, then click a target slot, or use "Move to..." ([21](21-ux-design-system-sitemaps.md) section 18.4).

#### 4.6.3 Drop behaviors and validation [MVP]

| Drop target | Result |
|---|---|
| Crew lane (Day view), empty area | Visit is appended; the board immediately shows a **suggested insertion position** (cheapest insertion) as a ghost; Enter accepts, Esc keeps at end |
| Between two stops | Explicit sequence position; sets `lock = sequence` only if the user holds Shift (otherwise the optimizer may still reorder) |
| Time axis position with Alt | Sets a `fixed_time` appointment at that time |
| Day cell (Week view) | Changes date; crew stays unless dropped on another crew's row |
| Another crew | Reassigns crew; validation runs for skills, equipment, capacity |
| Unassigned tray | Unschedules (`scheduled -> unscheduled`) with reason prompt if the client was already notified |
| Map route polyline | Cheapest insertion into that route |

Every drop runs the **validator** in the browser (instant) and on the server (authoritative). Results are tiered:

| Tier | Display | Examples | Can the user proceed? |
|---|---|---|---|
| **Block** | Red outline, drop rejected with message | Missing hard skill or license; equipment class unavailable; Property or Resource blackout; dig ticket not clear; visit outside a round's compliance window; crew lane is a subcontractor who has not accepted | No |
| **Override** | Orange, modal asks for reason | Exceeds crew shift by > 60 min; client time window violated; visit outside its due window; off-zone placement; spacing rule violated for non-compliance services; holiday placement | Yes, with `schedule.override` permission and a reason (audited) |
| **Warn** | Yellow badge on card | Crew > 100% of productive capacity; drive between stops > 25 min; no on-site crew member speaks client's preferred language; weather risk on that day | Yes |
| **Info** | Gray | "Client was notified for Tuesday; a change notice will be sent" | Yes |

Validator response time budget: < 50 ms in browser for single-card checks against the loaded week; server confirmation < 300 ms p95 ([20](20-architecture-security.md) section 4.28).

#### 4.6.4 Multi-select and bulk actions [MVP]

Shift-click, lasso on map and "select all filtered" allow bulk: move to date, reassign crew, lock/unlock, skip with reason, cancel, change duration budget, add a note to crew, send a custom message to affected clients (through [16](16-marketing-growth-communications.md) templates), print route sheets, and **Optimize selection** (runs the optimizer only over selected crews/days). Bulk changes over 10 Visits always go through a ScheduleDiff preview.

#### 4.6.5 Visit card anatomy [MVP]

Uses the `VisitCard` component from [21](21-ux-design-system-sitemaps.md): service abbreviation (MW, FC, AER+OS, RND3, IRR-W), client short name, time window, duration bar, crew chip, status color, and flag icons: gate code present, dog on property, chemicals, first visit, locked, presence required, late risk, weather risk, conflict, client-confirmed, notes for crew. Hover/focus shows the full card: address, last visit notes, crew-hours budget vs learned, price, special instructions.

#### 4.6.6 Non-crew calendar events [MVP]

Estimator site assessments, design consultations, client walkthroughs, inspections, shop days, training and safety meetings appear on the board as non-crew events in an individual's lane or the "Sales and design" group ([03](03-crm-sales-estimating-proposals.md) section on site visits). They consume the person's time, so a crew lead booked for a 7:00 safety meeting starts the route at 7:30. Two-way calendar sync with Google Calendar and Microsoft 365 for office roles [V1] (busy/free only by default, details opt-in).

#### 4.6.7 Draft and published schedule [MVP]

- Schedules are **drafts** until published. Published days are pushed to crew devices as `dispatched`.
- **Auto-publish** for tomorrow at 15:00 tenant-local (Company setting, range 12:00-20:00). Load-out lists in [13](13-operations-inventory-equipment.md) are generated from the published route and regenerate until their 05:00 lock.
- Changes to a published day are **late changes**: the crew device receives a delta push, the crew app highlights "Route changed: +1 stop, 2 reordered" and the change log records who/why. Late changes after 05:00 also notify the crew lead by push.
- **Unpublish** is allowed until the first Visit of that Crew Day starts.
- The board shows a publish status per Crew Day: Draft, Published, Started, Completed.

#### 4.6.8 Collaboration and concurrency [MVP]

- Presence avatars per day and per crew; a live "ghost" of another dispatcher's drag so two people do not move the same visit ([21](21-ux-design-system-sitemaps.md)).
- Each Visit has a `version` (optimistic concurrency). If a save conflicts, the server returns the current state and the board shows "Ana moved this to Crew 3 a moment ago - keep hers or apply yours?".
- Scenarios (4.8.8) are private until promoted, so planning does not collide with live dispatch.

#### 4.6.9 Performance [MVP]

- Board state is held in a local store (normalized Visits, Crew Days, Routes for the visible range plus one buffer week) hydrated from a delta API and kept fresh by server-sent events/WebSocket topics per tenant-branch-day ([20](20-architecture-security.md) section 4.20).
- Virtualized rendering: a Week view with 40 crews and 3,000 Visits renders in < 1.5 s on a mid-range laptop and scrolls at 60 fps (target).
- Drag interactions do not wait for the network; rollback animates if the server rejects.

#### 4.6.10 Route sheets and exports [MVP]

Printable route sheet per Crew Day (PDF, English/Spanish per crew lead preference): stops in order with address, service lines, time windows, gate codes (only if the Company allows printing access secrets; default off, shows "see app"), notes, map thumbnail, material load-out summary. CSV/ICS export of Visits for a date range. For crews without smartphones, the route sheet is the fallback.

#### 4.6.11 Undo and audit [MVP]

Every change is recorded in `schedule_change` with actor (user, automation, AI agent, client, system), before/after, reason and ScheduleDiff id. Undo (Ctrl/Cmd+Z) reverts the last change or the last applied diff as a whole, if no dependent field events (start/complete) occurred. Notifications already sent are not unsent; undo sends a correction only if the original notice went out (Company setting: "Send correction notices", default on).

### 4.7 Territories, zones and route days

#### 4.7.1 Zones [MVP]

- A **Zone** is a polygon (drawn on the map, generated from ZIP/postal codes, subdivisions, or a radius) assigned to a branch, one or more route days, and optionally preferred crews.
- Properties are auto-assigned to zones by point-in-polygon at geocode (PostGIS). Properties outside any zone go to "Unzoned" and get the nearest zone suggested.
- Zones carry stats: properties, weekly crew-hours, revenue per week, average drive minutes between stops.
- Zones can overlap only if they have different route days (e.g., a dense suburb split into Tuesday-A and Thursday-B by street).

#### 4.7.2 Master routes [MVP]

A **Master Route** is the season template for a zone-day-crew: ordered list of recurring Properties with expected arrival times. Daily routes are generated from it (only that day's due Visits, skipping non-due bi-weekly ones) and then lightly re-optimized for the day's additions and removals, with a strong stability penalty toward the master order. The board shows **drift**: "Tuesday Crew 1 differs from master by 6 stops (3 adds, 2 skips, 1 move)". Re-mastering is an explicit action (monthly or after big sales pushes) that runs the territory or week solver and proposes a new master.

#### 4.7.3 Territory design solver [V1]

For seasonal planning (February, or after acquiring a competitor's route list):
- **Inputs:** all recurring Properties with weekly crew-hours, client day locks, A/B parity, crews and their working days and depots, desired balance tolerance (default +/- 10% hours per crew-day), maximum allowed client day changes (default 15% of clients).
- **Method:** capacitated clustering (balanced k-medoids on road-time distance) to produce zone-day clusters, followed by a week-plan VRP per cluster to verify feasibility; iterated to reduce cross-zone overlap. Runs async; target 120 s for 2,000 properties and 10 crews, up to 10 minutes for 10,000 properties (progress bar, emails when done).
- **Outputs:** proposed zone-day map, per-day hours and drive estimates, list of clients whose day changes with a draft notice, before/after KPIs (total weekly drive hours, average stop gap minutes, revenue per drive hour).
- **Migration plan:** changes can be effective from a chosen week; clients get notice with configurable lead time (default 14 days).

#### 4.7.4 A/B week balancing [MVP]

Bi-weekly clients are assigned parity A or B. The territory solver and the "best day" recommender balance hours so week A and week B loads on the same day differ by no more than 10% (Company setting). Display: the week view shows "Tue (A)" and capacity per parity.

#### 4.7.5 New client slotting, "best day" [MVP]

When a new recurring client is sold (in [03](03-crm-sales-estimating-proposals.md)), booked online ([16](16-marketing-growth-communications.md)), or entered by the office, Rootline runs **cheapest insertion** of the new Property's Visit (duration, skills, equipment) into each candidate master route within the zone's days (and adjacent zones within 10 minutes' drive), and returns the top 3 options:

```text
Best service day for 418 Willow Ln (weekly mow, 0.75 crew-h)
1. Tuesday, Crew 1 - adds 4 min drive, stop between #11 and #12, Tue load 92% -> 95%
2. Thursday, Crew 3 - adds 7 min drive, Thu load 81% -> 84%
3. Tuesday, Crew 3 - adds 9 min drive, Tue load 88% -> 91%
[Assign option 1]   [Waitlist if all > 100%]
```

Target response < 1.5 s p95 (cached master-route matrices). The same API powers the portal's "Your crew will visit on Tuesdays" ([16](16-marketing-growth-communications.md)) and the AI receptionist.

### 4.8 Route optimization engine

The engine is a Python service using **Google OR-Tools' vehicle routing solver** behind Connect-gRPC, stateless and horizontally scaled ([20](20-architecture-security.md) section 4.17; [OR-Tools routing](https://developers.google.com/optimization/routing)). This section specifies the product-level problem it solves.

#### 4.8.1 Optimization modes

| Mode | Problem class | Typical size | Time limit (per [20](20-architecture-security.md)) | Priority |
|---|---|---|---|---|
| `sequence` | Re-order one Crew Day (TSP with time windows, breaks, dump stops) | 10-40 stops | 5 s | [MVP] |
| `insertion` | Best position(s) for 1-20 new Visits across candidate Crew Days | 1-20 visits x up to 30 routes | 1.5 s | [MVP] |
| `day_plan` | Assign and sequence a day's Visits across all crews of a branch (VRPTW with skills, capacities, breaks) | 50-800 stops, 2-40 crews | 30 s | [V1] |
| `week_plan` | Assign flexible Visits to days and crews within a week, then sequence (periodic VRP, decomposed) | 200-4,000 stops | 120 s async | [V1] |
| `territory` | Seasonal zones and master routes (4.7.3) | 500-10,000 properties | 120 s to 10 min async | [V1] |
| `repair` | Mid-day re-optimization from crews' current positions and progress (4.10.8) | Remaining stops of 1-10 crews | 5-10 s | [V1] |
| `storm` | Priority-ordered snow routing with re-service loops (4.9.6) | 20-500 sites | 30 s, repeated | [V1] |

#### 4.8.2 Constraint catalogue

| Constraint | Hard/soft (default) | Modeling note (OR-Tools; verify API details against the current release) | Priority |
|---|---|---|---|
| Start and end at depot (yard); per-crew depot | Hard | Vehicle start/end nodes | [MVP] |
| Start at crew lead's home (take-home trucks) | Hard per crew setting | Per-vehicle start node | [V1] |
| Shift start/end, max shift length | Hard end at shift + max OT (default 2 h); soft beyond shift | Time dimension with vehicle-specific ranges; soft upper bound cost on end cumul | [MVP] |
| Service duration (crew-size adjusted, 4.1.4) | Hard | Transit callback = travel + service time at the from-node | [MVP] |
| Client time window (`between`, `fixed_time`) | `fixed_time` hard; `between` soft by default (Company setting can make hard) | Cumul range or soft bounds with lateness penalty | [MVP] |
| Access window (gate staffed hours, HOA quiet hours, school hours, municipal noise ordinance earliest start) | Hard | Cumul range | [MVP] |
| Lunch/meal break | Hard (where law requires, e.g., meal start before end of the 5th hour of work in California per [15](15-team-hr-payroll.md)); otherwise soft window 11:00-13:00, 30 min | Vehicle break intervals on the time dimension | [MVP] |
| Skills and licenses | Hard | Allowed-vehicles per node | [MVP] single crew check, [V1] assignment |
| Equipment class (aerator, skid steer, deck width vs gate width) | Hard | Allowed-vehicles per node, computed from Crew Day units | [V1] |
| Crew size minimum | Hard | Allowed-vehicles per node | [V1] |
| Debris capacity (leaf cleanup cu yd) with dump runs | Hard | Capacity dimension; dump sites as optional reload nodes (duplicated, penalty-free disjunctions) that reset load via slack | [V1] |
| Material pickup at supply house before visits that need it (mulch, stone, plants) | Hard precedence when material is not loaded at the yard | Pickup-and-delivery pairs on the same vehicle with pickup before delivery | [V1] |
| Spray tank refills (gallons) | Hard | Capacity + reload nodes at the yard or water source | [V1] |
| Salt reload (tons) during storms | Hard | Capacity + reload at salt depot | [V1] |
| Day lock, crew lock, sequence lock | Hard | Fixed vehicle; precedence or fixed rank | [MVP] |
| Stability vs master route / previous plan | Soft | Penalty on changed vehicle or rank; warm start from previous routes | [MVP] |
| Zone adherence | Soft | Penalty when assigned crew/day differs from zone | [V1] |
| Max single drive leg (default 25 min) | Soft | Arc cost surcharge above threshold | [V1] |
| Crew workload balance | Soft | Global span cost coefficient | [V1] |
| Overtime cost | Soft | End-time soft upper bound at shift end | [MVP] |
| Optional visits (fillers, upsells, flexible backlog) | Soft | Disjunction with drop penalty scaled by priority | [V1] |
| Battery equipment energy budget | Hard | Energy dimension with charging stops | [V2] |
| Traffic-dependent travel time | Soft (approximated) | Time-of-day bucketed matrices chosen by planned departure | [V1] |

Gate codes are not constraints; they are restricted access data shown on device for dispatched Visits only ([20](20-architecture-security.md)). What matters for routing is the access window (e.g., "community gate staffed 08:00-16:00; after hours needs the resident") and the Property's trailer-parking note.

#### 4.8.3 Travel-time matrices [MVP]

- **Source:** Google Routes or Mapbox matrix APIs (provider chosen per region and cost; [20](20-architecture-security.md)). Per-request element limits and traffic-aware limits differ by provider and change; verify current limits before sizing batches.
- **Time-of-day buckets:** `early` (05:00-07:00), `am_peak` (07:00-09:30), `midday` (09:30-15:00), `pm_peak` (15:00-18:30), `evening` (18:30-22:00), `night` (22:00-05:00, used for snow). The solver uses the bucket of the planned departure time for each arc (piecewise approximation).
- **Truck-and-trailer factor:** car travel times are multiplied by a Company-tunable factor (default 1.10) plus a fixed 2-minute park-and-unload buffer per stop (accounted in setup time). [V2]: learn per-crew factors from breadcrumbs.
- **Caching:** Redis keys by `(geohash7 origin, geohash7 destination, bucket)` for 14 days ([20](20-architecture-security.md)). Weekly recurring routes hit the cache almost entirely; the estimate in [20](20-architecture-security.md) is a 60-80% reduction in matrix API cost.
- **Pruning:** for `day_plan` and larger, only the k = 30 nearest neighbors per stop (by haversine) plus depots and dump sites are fetched from the provider; other arcs use a haversine-times-detour-factor estimate (default 1.35) with a high cost so the solver rarely uses them. This bounds API calls from O(n^2) to O(n x k). A 600-stop day costs about 18,000 + 2 x 600 depot arcs rather than 360,000 elements (estimate).
- **Fallback:** if the provider is down or quota is exhausted, haversine-with-detour estimates are used and the plan is labeled "Approximate drive times" in the diff.

#### 4.8.4 Objective function [MVP basic, V1 full]

The solver minimizes a weighted sum in **minute-equivalent cost units**. Defaults (Company-tunable via presets, advanced users can edit weights):

| Term | Default weight | Notes |
|---|---|---|
| Drive minutes | 1.0 per minute | Primary cost |
| Overtime minutes (beyond shift end) | 1.5 per minute | Reflects 1.5x pay |
| Soft time-window lateness | 2.0 per minute late | Early arrival waits (no penalty) unless the window is `between` and early arrival is disallowed |
| Dropped optional visit | P1 10,000; P2 3,000; P3 1,000; P4 500; P5 300 | Never drops P1/P2 unless infeasible; dropped visits listed with reasons |
| Stability: changed day | 60 per visit | Recurring visits only |
| Stability: changed crew | 30 per visit | |
| Stability: sequence rank change | 2 per rank moved | Capped at 20 per visit |
| Zone violation | 20 per visit | |
| Drive leg > 25 min | 1.0 per minute above 25 | |
| Workload imbalance | 0.2 x (max route span - min route span) | Only in `day_plan` and above |

**Presets:** "Minimize drive" (stability x 0.3), "Keep routes stable" (default), "Finish early" (overtime weight 3.0, adds end-time cost), "Balance crews" (imbalance x 3), "Storm" (lateness on priority-1 sites x 10, stability 0).

#### 4.8.5 Route stability [MVP]

Residential maintenance clients notice when their mowing day changes; commercial clients notice when the crew arrives at a different time. Stability rules:
- The previous published plan (or the Master Route) is passed as a **warm start** so local search begins from the known solution.
- Stability penalties (4.8.4) apply against the anchor.
- A **route-day change** for a recurring client is never made by the daily optimizer; only `week_plan` or `territory` modes, or a human, can change the day, and they produce client-notice drafts.
- The diff shows a "Stability" KPI: % of stops unchanged in crew, day and +/- 2 positions.

#### 4.8.6 Insertion and best-slot heuristics [MVP]

For single or small batches, a dedicated insertion service evaluates every feasible position in candidate routes (within the Visit's flexibility window and zone days), computing marginal drive minutes, lateness, capacity and stability cost. It returns ranked options with explanations. This powers drag ghosts (4.6.3), "best day" (4.7.5), backlog auto-slot (4.3.3), portal booking availability (4.13) and Copilot answers ("Can we fit the Garcia cleanup this week?").

#### 4.8.7 Locks and pins [MVP]

| Lock | Meaning | Solver encoding |
|---|---|---|
| `crew` | Must stay with this crew, any day within flexibility | Fixed vehicle set |
| `day` | Must stay on this date, any crew | Only that day's vehicles allowed |
| `time` | Must start within +/- 10 min of its set time | Hard cumul range |
| `sequence` | Keep relative order with its neighbors (e.g., "do the Smiths right after the Joneses, same driveway") | Precedence constraints with adjacency |
| `full` | Do not move at all | Node fixed to vehicle and rank; removed from search where possible |
| Route lock | Entire Crew Day frozen (e.g., a commercial route with contract SLA times) | Vehicle excluded from optimization; its stops still count for capacity and equipment |

Locks show a padlock on cards and can be set by drag modifiers, the card menu or bulk actions. Copilot and automations respect locks as hard constraints (rule also stated in [17](17-ai-copilot-automation.md) agent A7).

#### 4.8.8 What-if scenarios [V1]

- **Create** a scenario from the board for a date range and set of crews/branches. The scenario copies Visits, Crew Days and reservations into a sandbox.
- **Levers:** remove or add a crew; change shift hours; mark equipment down; toggle a constraint (e.g., allow Saturday); change objective preset; inject demand (e.g., "add 40 fall cleanups" or "sell the Ridgeview HOA account"); apply a weather playbook.
- **Run** the appropriate mode; scenarios run on the async queue with progress.
- **Compare** up to 3 scenarios side by side: total drive hours, overtime hours, dropped visits, late visits, stability %, revenue per drive hour, utilization by day, client notices required, cost delta in dollars (labor at loaded rates, fuel estimate at Company's $/mile setting).
- **Promote** a scenario to a ScheduleDiff on the live schedule. If the live schedule changed since the scenario was created, a three-way merge runs: non-conflicting changes apply, conflicting Visits are listed for manual choice.
- Limits: 10 active scenarios per user, auto-expire after 14 days (Company setting), not visible to crews or clients.

#### 4.8.9 Route density metrics [MVP]

Definitions shared with [18](18-reporting-analytics.md) (metric keys in backticks):

| Metric | Definition | Typical use |
|---|---|---|
| `stops_per_route_hour` | Completed stops / (route end - route start) in hours | Density across crews and days |
| `drive_time_pct` | Drive minutes / (route end - route start) | Target < 20% for mowing routes (Company target) |
| `route_density_onsite_ratio` | On-site minutes / (on-site + drive minutes) | Primary density KPI in [18](18-reporting-analytics.md) |
| `revenue_per_drive_hour` | Revenue of completed visits / drive hours | Pricing and territory decisions |
| `revenue_per_route_hour` | Revenue / route hours | Crew productivity and price checks |
| `avg_stop_gap_minutes` | Mean drive minutes between consecutive stops | Territory compactness |
| `marginal_drive_cost` per stop | Drive minutes saved if this stop were removed (computed by the solver) | Spotting the "$45 mow 22 miles away" outliers |
| `deadhead_minutes` | Depot-to-first-stop + last-stop-to-depot | Depot placement, take-home truck decisions |
| `route_stability_pct` | Stops unchanged in crew, day and +/- 2 positions vs prior week | Client experience |
| `zone_purity_pct` | Stops on their zone day | Territory hygiene |

Every route in the Day view shows a density chip (e.g., "On-site 78% / Drive 16% / $212 per drive hour"). Stops with marginal drive cost above a threshold (default 12 minutes) get a "low density" badge linking to a re-price or swap suggestion.

> **Competitive edge.** Real Green and GorillaDesk sell on route density for lawn treatment; Jobber users report straight-line ordering. Rootline makes density a measured, per-stop number (marginal drive cost) tied to pricing in [03](03-crm-sales-estimating-proposals.md) and to the "neighbor bundle" offers in [06](06-customer-portal.md), so the owner can see exactly which clients cost more to serve than they pay.

#### 4.8.10 Solver architecture and performance targets [MVP]

- **Search strategy:** first solution by parallel cheapest insertion (or path cheapest arc for single routes), then guided local search with a time limit (OR-Tools routing search parameters; verify names against the release in use). Warm start from the previous plan when one exists.
- **Decomposition:** large problems are split by branch depot and zone clusters; each sub-problem solves in parallel; a cross-cluster pass handles border stops. Snow `storm` mode solves per priority tier.
- **Determinism:** fixed random seed per run; identical inputs produce identical outputs (important for support and testing).
- **Fallback:** on timeout or infeasibility the service returns the best feasible solution found or a greedy insertion plan, flagged in the diff ("Partial optimization: 30 s limit reached; estimated 4% from best"). Infeasible visits are never silently dropped; each is returned with a machine-readable reason (`no_skill`, `no_equipment`, `window_infeasible`, `capacity`, `access_window`, `locked_conflict`).
- **Run records:** every run stores inputs hash, parameters, solver version, duration, objective breakdown and solution; viewable by `platform_engineer` with tenant consent for support ([19](19-platform-admin-portal.md)).

**Performance targets**

| Scenario | Size | Target (p95 wall time) | Quality target |
|---|---|---|---|
| Single crew re-sequence | 30 stops | 2 s (limit 5 s) | Within 2% of a 60 s run on the benchmark set |
| Best-slot insertion | 1 visit, 30 candidate routes | 1.5 s | Exact cheapest insertion |
| Day plan | 300 stops, 12 crews | 15 s (limit 30 s) | Within 5% of a 10-minute run |
| Day plan, large | 800 stops, 40 crews, 2 depots | 30 s | Within 7% of a 10-minute run |
| Week plan | 2,000 stops, 15 crews | 120 s async | Within 8% of a 30-minute run |
| Territory | 5,000 properties, 20 crews | 10 min async | Hours balance within +/- 10% per crew-day |
| Mid-day repair | 3 crews, 25 remaining stops | 5 s | Feasible with all P1-P2 kept |
| Storm re-route cycle | 300 sites, 25 trucks | 20 s, repeat every 15 min | All priority-1 sites within SLA where feasible |
| Matrix fetch (cache miss) | 600 stops pruned | 8 s | n/a |
| Matrix fetch (warm cache) | 600 stops | 300 ms | n/a |

Quality targets are measured nightly against a benchmark suite of anonymized, synthetic tenant-shaped instances (residential mowing, mixed commercial, fall cleanups with dump runs, rounds with licensing, storm) plus standard VRPTW instances (Solomon-style) as a sanity check.

#### 4.8.11 Explainability [MVP basic, V1 full]

- "Why here?" on any stop: the binding constraints (time window, skill, equipment, lock, access window), the next-best position and its cost difference ("Moving to Crew 3 would add 11 min drive and miss the 10:00 window").
- Diff summary in plain language, generated deterministically from the objective breakdown (with optional Copilot rewording): "Saves 47 minutes of driving across 3 crews. Two clients change position by more than 2 stops. Crew 2 finishes 25 minutes earlier."
- Dropped visit report with reasons and one-click fixes ("Add a licensed applicator to Crew 3 on Tuesday").

### 4.9 Weather integration

This module owns Rootline's shared **Weather Service**, consumed by the crew app (chemical auto-fill, heat alerts in [05](05-field-crew-mobile-app.md)), lawn guardrails and storm events ([14](14-service-line-modules.md)), billing evidence ([07](07-invoicing-billing-contracts.md)), holding-yard care ([13](13-operations-inventory-equipment.md)), marketing triggers ([16](16-marketing-growth-communications.md)) and weather-normalized reporting ([18](18-reporting-analytics.md)).

#### 4.9.1 Weather Service [MVP]

- **Provider-agnostic adapter** with at least two providers: the US National Weather Service API for gridpoint hourly forecasts and alerts at no cost ([NWS API](https://www.weather.gov/documentation/services-web-api)); Environment and Climate Change Canada's Meteorological Service of Canada open data for Canada (verify current endpoints and terms); and one commercial provider for consistent North American coverage, minute-level precipitation nowcasts, soil temperature and certified historical reports (vendor selection open; candidates include Tomorrow.io, DTN and The Weather Company class providers; verify terms and pricing).
- **Spatial unit:** forecasts are fetched and cached per H3 hexagon cell (resolution 7, a few square kilometers; verify) that contains at least one Property with a Visit in the next 7 days, plus depots. A 2,000-property Company in one metro typically touches a few hundred cells (estimate).
- **Cadence:** hourly forecast refresh every 60 minutes for cells with Visits in the next 72 hours; every 15 minutes when a playbook trigger is within 20% of threshold or an alert is active; observations hourly; daily summaries at 02:00 local.
- **Variables:** hourly precipitation probability and amount (QPF), precipitation type, snowfall and ice accretion, temperature, dew point, relative humidity, heat index, wind speed and gusts and direction, cloud cover, NWS alerts (watches, warnings, advisories), and where available soil temperature at 2-4 in, reference evapotranspiration, lightning proximity [V2] and air quality index [V1].
- **Derived indices** (computed per cell and per Visit window):

| Index | Definition (default; Company-tunable) | Consumers |
|---|---|---|
| `rain_risk_window` | Max hourly precipitation probability and total QPF during the Visit's planned on-site window | Rain playbooks |
| `soil_saturation_flag` | > 1.0 in rain in the past 24 h, or > 1.5 in in 48 h | Heavy equipment, aeration, sod, mowing on clay soils |
| `spray_window_ok` | Wind below the product's label maximum, no rain within the label's rainfast interval, temperature inside label range | Lawn/PHC rounds ([14](14-service-line-modules.md)) |
| `heat_band` | Heat index bands at 80 F and 95 F (California outdoor heat thresholds; other jurisdictions per [15](15-team-hr-payroll.md)) | Crew safety, heat schedules |
| `freeze_flag` | Forecast low <= 32 F; `hard_freeze` <= 28 F | Irrigation winterization priority, planting holds |
| `growth_potential` | Turf GP from mean temperature (4.2.6) | Growth-adaptive mowing |
| `gdd_base50` | Growing degree days, base 50 F, accumulated from Jan 1 | Pre-emergent and round timing ([14](14-service-line-modules.md)), marketing triggers |
| `snow_trigger_eta` | Forecast time when accumulation crosses each contract trigger depth | Storm events |

- **Snapshots:** every Visit stores a weather snapshot at start and completion (temperature, precipitation last hour, wind) [MVP], used for skip evidence, chemical records and snow billing.

#### 4.9.2 Weather on the board [MVP]

- A **WeatherStrip** above each day column and in the Day view header (hourly precipitation bars, wind, temperature, alerts) using the `WeatherStrip` component in [21](21-ux-design-system-sitemaps.md).
- Per-route **risk chip**: green (no risk), amber (one or more Visits exceed a soft threshold), red (a playbook trigger is met). Clicking shows the affected Visits.
- Rain bands are drawn as hatched overlays on the Gantt where the hourly probability exceeds the Company threshold.
- Forecast confidence note: beyond 72 hours, risk chips are muted and labeled "low confidence".

#### 4.9.3 Rain-delay playbooks [MVP manual, V1 playbooks]

**MVP:** bulk "Move day" and "Slide week" actions on the board (the same engine as holiday slides, 4.2.7) with a ScheduleDiff and bulk client notices.

**V1 playbooks:** a playbook is a saved rule set: trigger, scope, per-service rules, strategy, notifications and approval mode. Rootline ships defaults per service line and Region; the Company edits them in plain language with the Copilot's help ([17](17-ai-copilot-automation.md) section 4.5.8 lists matching agent defaults).

**Triggers (defaults):**

| Service type | Move or skip when | Notes |
|---|---|---|
| Mowing | Precipitation probability >= 60% during the crew's planned window, or QPF >= 0.25 in during the window; or `soil_saturation_flag` on clay-soil properties | Matches [17](17-ai-copilot-automation.md) A7 defaults |
| Fertilizer and herbicide applications | `spray_window_ok` false for the planned hour (label wind, rainfast interval, temperature) | Compliance guardrails owned by [14](14-service-line-modules.md); playbook moves, never overrides labels |
| Hardscape: concrete, polymeric sand, sealing | Rain expected within the product's cure window | Task-level weather sensitivity (4.11) |
| Aeration and overseeding | `soil_saturation_flag` true (over 1 in in 24 h) | Prefer moist not saturated soil |
| Planting and sod | Frozen ground, or `soil_saturation_flag` on heavy equipment access | Favor overcast days (soft preference) |
| Irrigation winterization | Not a rain trigger; prioritized by `hard_freeze` forecast | Moves earlier, not later |
| Tree work | Gusts above Company limit (default 25 mph for climbing; verify crane manufacturer limits), lightning within 10 mi [V2] | Safety rule |
| Fall cleanups | Heavy rain (wet leaves double debris weight and dump fees); soft rule | Prefer to move, not required |

**Strategies** (a playbook picks one per service type; the dispatcher can switch before applying):

| Strategy | Behavior | When it fits |
|---|---|---|
| `slide_day` | Affected day's routes move to the next working day and every later day of the week slides +1; Saturday absorbs (if enabled) or overflow goes to backlog | Whole-day washouts with a weekly mowing business |
| `push_later_in_week` | Only affected Visits move, into spare capacity on later days of the same week via `week_plan` optimization; unaffected days stay intact | Partial rain days, mixed service lines |
| `split_day` | Crews work until forecast onset minus a buffer (default 30 min); remaining stops move per `push_later_in_week` | Afternoon thunderstorms |
| `skip_no_makeup` | Recurring Visits are skipped with reason `rain`; per-visit clients are not billed; fixed-price clients' skip counters increment | Late-season mowing, growth-adaptive clients |
| `swap_to_rain_work` | Crews are reassigned to rain-tolerant backlog: pruning, shop work, preventive maintenance from [13](13-operations-inventory-equipment.md), mulch where acceptable | Companies that guarantee hours to crews |
| `hold_for_decision` | Visits are flagged `weather_hold` and the dispatcher decides at a set time (default 05:30) | Uncertain forecasts |

**Priority rules inside a playbook** (applied in order): fixed-date and `do_not_move` Visits are never moved automatically (listed for decision); round Visits within 5 working days of window end; commercial SLA Visits; first visits for new clients; projects whose delay pushes a milestone; then everything else by urgency score.

**Rain day flow ("Declare rain day")**
1. Dispatcher (or the A7 agent's proposal at 05:00) selects date, branch and pools, or accepts the playbook's automatic trigger.
2. The engine builds a ScheduleDiff: moved and skipped Visits, crews' new day loads, overtime, Saturday usage, stability impact, dropped or backlogged Visits, and the client and crew notices that will be sent.
3. The dispatcher reviews, edits exceptions (keeps the HOA, moves two clients by hand), and applies.
4. Clients receive one notice each ("Rain delay: your service moves from Wednesday to Thursday") through [16](16-marketing-growth-communications.md) templates; notices are deduplicated so a client delayed twice within 24 hours receives one consolidated message ([16](16-marketing-growth-communications.md) deduplication rule). The portal shows a "Weather delay" banner ([06](06-customer-portal.md)).
5. Crews receive a push and an in-app banner ("Rain day: today's route moved to Thursday. Clock in for shop work?" in [05](05-field-crew-mobile-app.md)).
6. The diff is recorded as one `weather.delay_declared` event plus `visit.rescheduled` per Visit.

**Rainy-week cascade.** When displaced hours exceed the remaining capacity of the week (for example three rain days in a row in May), the playbook escalates and shows each option's cost: Saturday shift(s), extended shifts (+1 h per day), temporary bi-weekly for `growth_adaptive` clients, `skip_no_makeup` for per-visit mowing, subcontracting cleanups, or carrying the backlog into next week with a "catch-up week" plan. The capacity view shows backlog burn-down until the Company is caught up.

**Mid-route rain.** The crew lead taps "Rain stop" in the app: remaining Visits of that Crew Day become `weather_hold`; partially completed Visits follow the Partial flow in [05](05-field-crew-mobile-app.md); the playbook re-runs for the held Visits only.

**Approval mode.** `propose` (default; human applies), `auto_after_deadline` (applies at a set time if nobody objects, [V2]), or `auto` for specific service types only ([V2], e.g., per-visit residential mowing). Auto modes still send the dispatcher a summary.

> **Competitive edge.** In Jobber and similar horizontal tools a rain day means dragging cards and texting clients by hand ([R1](research/R1-field-service-platforms.md)). Rootline turns it into one reviewed diff: weather trigger, landscape-specific rules per service, priority for rounds near window close, client notices and crew pushes, in under five minutes of dispatcher time.

#### 4.9.4 Freeze, heat, wind and air-quality alerts [MVP alerts, V1 automations]

| Condition | Default alert | Scheduling action |
|---|---|---|
| `hard_freeze` forecast within 7 days | Owner and ops: "Hard freeze Thursday night; 46 winterizations not yet done" | Reprioritize irrigation winterizations ahead of the freeze, propose Saturday blowout shifts, notify clients of the new date |
| `freeze_flag` overnight | Planting crews and holding yard ([13](13-operations-inventory-equipment.md)) | Hold planting and sod on frozen ground until 10:00 or until forecast temperature > 34 F |
| `heat_band` >= 80 F / >= 95 F | Crew safety banner and shade/water reminders ([05](05-field-crew-mobile-app.md), [15](15-team-hr-payroll.md)) | Optional **heat schedule**: start 1 h earlier, move strenuous tasks (sod, hardscape) before 11:00, insert cool-down breaks into routes as break intervals |
| Wind gusts above limits | Spray and tree crews | Swap spray stops for granular-eligible ones (if the round allows) or move; hold climbing work |
| NWS warnings (severe thunderstorm, tornado, winter storm, flood) | All crews in the warning polygon (push) and dispatcher | Suggest pausing routes; flag Visits inside the polygon |
| Air quality: wildfire smoke [V1] | AQI threshold alerts (California's wildfire smoke rule uses AQI for PM2.5 of 151 or higher as a key threshold; verify current rule) | Respirator reminders; option to shorten outdoor work |
| Lightning within 10 miles [V2] | Crew push "Lightning nearby: shelter in vehicles" | Pause Visits automatically; resume prompt after 30 minutes without strikes (common safety practice, verify provider data) |

#### 4.9.5 Weather evidence [V1]

Each skipped or delayed Visit stores the forecast and observation that justified it. Clients disputing a skipped visit see "Skipped: 0.62 in of rain recorded between 7:00 and 11:00 at the nearest station" in the portal. Snow billing uses observed accumulation of record (station defined in the contract) from [14](14-service-line-modules.md).

#### 4.9.6 Snow and ice event dispatch [V1, with [14](14-service-line-modules.md)]

The Storm Event Engine in [14](14-service-line-modules.md) owns the event lifecycle (watch, pretreat, active, cleanup, monitoring, closed, billed), contracts, triggers and proof-of-service packets. This module supplies:

- **Site activation:** when `snow_trigger_eta` passes a site's contract trigger (e.g., 2 in for lots, any accumulation for zero-tolerance walks), the site's event Visit becomes eligible. Pretreatment Visits are generated for sites with anti-icing in the contract.
- **Storm routing (`storm` mode):** priority tiers (P1 hospitals and "open by 6:00" sites, P2 commercial lots, P3 residential driveways), open-by deadlines as hard time windows, equipment classes (plow truck, loader, skid steer with pusher box, sidewalk crew, salt truck), salt capacity with depot reloads, night travel buckets, and subcontractor-held sites as fixed assignments.
- **Re-service loops:** each serviced site re-enters the queue when accumulation since its last push reaches the re-service increment (e.g., every 4 in on 24-hour sites, per [14](14-service-line-modules.md) contracts). The router re-solves every 15 minutes during `active` (configurable), with stability weight 0 and lateness on P1 x 10.
- **Shift and fatigue rules:** Company maximum continuous shift (default 16 h) with forced relief suggestions; commercial-motor-vehicle drivers may fall under FMCSA hours-of-service rules, and snow operations sometimes qualify for exemptions (verify per state and vehicle class); this module only enforces the Company's configured limits and flags them.
- **Storm live map:** sites colored by status (not triggered, triggered, en route, in service, serviced, needs re-service), trucks with salt load remaining, subs' last check-in time; the Storm Command Center screen lives in [14](14-service-line-modules.md) and embeds this map.

### 4.10 Live GPS tracking, geofences and ETA

#### 4.10.1 Location sources [MVP]

| Source | What it provides | Rules |
|---|---|---|
| Crew app breadcrumbs | Device positions while clocked in (adaptive: every 30 s or 50 m; 2 min when stationary), geofence events (dual-path detection) | Never collected off the clock or during unpaid meals ([05](05-field-crew-mobile-app.md) section 4.23); retention 90 days raw, then visit-level arrival/departure only ([20](20-architecture-security.md)) |
| Telematics [V1] | Vehicle position, ignition, speed, engine hours from partners such as Samsara, Motive, Geotab or Verizon Connect (verify API terms per vendor) | Vehicle-level, not person-level; mapped to Crew Day by vehicle assignment; personal-use periods excluded by schedule |
| Subcontractors | Visit start/complete timestamps and optional on-my-way only | No continuous tracking by default ([05](05-field-crew-mobile-app.md) 4.22.4) |
| Manual | Crew taps arrived/departed | Always accepted; reconciled with other signals |

#### 4.10.2 Live map [MVP]

- Crew markers with heading, crew color, status (`driving`, `on_site`, `on_break` without position during unpaid meals, `at_yard`, `offline since 10:12`), current Visit, next stop with ETA.
- Today's planned route polyline vs actual trail (actual shown only for clocked-in time).
- Schedule adherence ring on each marker: on time (green), 1-15 min behind (amber), > 15 min behind (red), ahead (blue).
- Click a crew: timeline of the day (planned vs actual), remaining stops, hours used vs budget, projected end of day.
- **Playback** [V1]: replay a Crew Day at 10x-60x for disputes and coaching (90-day raw retention window).
- Live updates via WebSocket every 15-30 s per crew when the map is open (last-known positions served from Redis per [20](20-architecture-security.md)).

#### 4.10.3 Arrival and departure reconciliation [MVP]

Device geofence mechanics are owned by [05](05-field-crew-mobile-app.md) (dual-path detection, dwell >= 60 s, 75 m default radius or parcel polygon). Server-side, this module reconciles signals into **visit actuals**:

1. Candidate arrival = earliest of: crew-confirmed arrival, device geofence entry with dwell, telematics vehicle stop (ignition off or speed < 3 mph for >= 2 min) within 75 m of the parcel polygon [V1].
2. Candidate departure = latest of: completion tap, geofence exit (> 100 m for > 3 min), vehicle departure.
3. If signals disagree by > 10 minutes, the visit is flagged `actuals_review` and the dispatcher sees all signals on a mini-timeline. Crew confirmation wins for payroll ([15](15-team-hr-payroll.md)); the discrepancy is recorded.
4. Actuals feed: learned durations (4.1.4), route density metrics, job costing, ETA model, client visit summary.

#### 4.10.4 ETA computation [MVP]

For each remaining stop on an active route:

```text
ETA(stop k) = now
            + remaining_service(current stop)        // max(planned remaining, learned remaining)
            + sum over legs to k of drive_time(leg)  // next leg: live traffic route call; later legs: bucketed matrix
            + sum over intermediate stops of service_duration
            + scheduled breaks and dump/supply stops before k
```

- Recomputed every 60 seconds for the next 3 stops while the route is active, and on every state event (arrival, completion, pause, reorder).
- **Client-facing ETA windows** are rounded and widened with distance in the sequence: next stop +/- 15 minutes (rounded to 5), 2-3 stops ahead +/- 30 minutes, later stops a 2-hour band, before route start a day-level window ("between 9 and noon") derived from the plan.
- **ETA accuracy model** [V1]: per-Company residuals by stop position and time of day widen or narrow windows automatically to keep the 80%-within-window target (G5).
- The portal's ETA refreshes every 60 seconds ([06](06-customer-portal.md)).

#### 4.10.5 Client notices driven by the schedule [MVP]

Templates, consent, channels and quiet hours are owned by [16](16-marketing-growth-communications.md). This module decides **when** and **with what data**:

| Notice | Trigger | Default | Data provided |
|---|---|---|---|
| Route-day assignment | Recurring client gets or changes a service day | On | Day of week, start date, crew name |
| Day-ahead reminder | Route published (default 15:00) for one-time services, installs, consults, irrigation start-ups | On for non-recurring; off for weekly mowing ([16](16-marketing-growth-communications.md)) | Date, day-level window, prep instructions ("unlock the side gate", "pets inside") |
| Morning-of window | Route start | Off (opt-in per Company) | 2-hour window |
| On my way | Crew taps "Start driving" to this stop, or geofence departure from the previous stop | On; suppressed for weekly mowing unless opted in ([16](16-marketing-growth-communications.md)) | ETA window, crew lead first name and photo (opt-in), live link valid until arrival plus 30 min |
| Running late | ETA moves past the communicated window by > 15 min | On for `between` and `fixed_time` windows | New window, apology text |
| Schedule change | Any `visit.rescheduled` after the client was notified, outside rain/holiday bulk flows | On | Old and new date |
| Weather delay | Playbook applied | On | New expected day; consolidated per 24 h |
| Holiday change | Holiday slide applied | On, sent 7 days ahead | New day for that week |
| Project window update | Project phase window changes | On, one consolidated notice per change set | New week window ([06](06-customer-portal.md)) |

Deduplication: at most one schedule-change notice per client per visit per 24 hours; if a Visit is moved several times within 60 minutes, only the final state is sent.

#### 4.10.6 Service evidence score [V1]

Each completed Visit gets an evidence score (0-100) used for disputes and snow billing: arrival/departure signal agreement (30), time on site vs budget (20), photos with in-geofence GPS and capture time inside the visit (30), checklist completion (10), crew signature/attestation (10). Below 60 shows a warning to the dispatcher before the visit is billed (Company setting). This answers the observation that GPS alone is disputable ([Aspire blog](https://www.youraspire.com/blog/prove-service-delivery-data-ends-disputes)).

#### 4.10.7 Late-running and anomaly alerts [MVP basic, V1 full]

| Alert | Condition (default) | Recipient | Priority |
|---|---|---|---|
| Stop late risk | Projected arrival later than a `between`/`fixed_time` window end by > 10 min | Dispatcher (board badge + optional push) | [MVP] |
| Route overrun | Projected route end > shift end + 30 min | Dispatcher, crew lead | [MVP] |
| Long stop | On site > 2x budget and > 20 min over | Crew lead (in-app "Need help or a note?"), dispatcher | [V1] |
| Idle while clocked in | Outside any geofence, not moving, no activity > 45 min ([05](05-field-crew-mobile-app.md) prompts the crew first) | Dispatcher after crew prompt unanswered | [V1] |
| Route not started | No drive start 30 min after shift start | Dispatcher | [MVP] |
| Device not syncing | Clocked-in device not synced > 4 h ([05](05-field-crew-mobile-app.md)) | Dispatcher | [MVP] |
| Off-route | Crew at a Property not on its route | Dispatcher (often a legitimate swap; one-tap "accept as reassignment") | [V1] |

Alerts are grouped per crew and rate-limited (one push per crew per 30 minutes unless severity increases).

#### 4.10.8 Mid-day re-optimization [V1]

Triggers: equipment breakdown, crew member leaves sick, emergency insertion ("main line break, yard flooding"), severe lateness, weather onset.

1. Dispatcher opens **Recover** on the affected crew (or accepts the alert's proposal).
2. `repair` mode takes current positions, in-progress Visits (never moved), completed Visits, remaining stops, other crews' remaining capacity within a radius (default 20 minutes' drive), and the equipment state.
3. Options are returned as up to 3 ScheduleDiffs: (a) resequence only and accept overtime; (b) move N stops to nearby crews with slack; (c) push optional and `week_flex` stops to the next day with client notices.
4. Applying a diff pushes route deltas to affected crews and sends client notices only for Visits whose window changed materially (> 30 min or different day).

**Emergency insertion [MVP basic]:** "Find a tech" shows qualified crews or technicians ranked by ETA to the emergency Property, considering current position, remaining committed stops and skills. One click inserts the job as the next stop and reflows the route.

### 4.11 Multi-day project scheduling

#### 4.11.1 Project structure [V1, basic multi-day jobs MVP]

- **MVP:** a work order can span multiple consecutive days; it creates one Visit per day for the same crew, shown as a continuous bar on the board.
- **V1:** full project schedules: Phases contain Tasks. Each Task has: duration in crew-days (or crew-hours with a crew size), capacity pool and skills, equipment requirements, weather sensitivity (`none`, `rain_sensitive`, `cure_window_hours`, `frozen_ground`), predecessors, and an optional "must start on or after" / "must finish by" constraint.
- **Dependencies:** finish-to-start (FS), start-to-start (SS), finish-to-finish (FF), with positive or negative lag in working days. Examples: "Excavation FS Base install"; "Base install FS +1 day Pavers" (compaction and inspection); "Concrete footing FS +7 days Wall cap install" (cure, illustrative); "Irrigation sleeves SS +0 Base install".
- **Milestones:** zero-duration markers ("Hardscape complete", "Final walkthrough") that billing uses for milestone invoices ([07](07-invoicing-billing-contracts.md) emits on `milestone.reached`).
- **Templates:** per project type (paver patio 400 sq ft, retaining wall, planting install, irrigation system install, landscape lighting install) with default tasks and production-rate-driven durations from the estimate ([03](03-crm-sales-estimating-proposals.md)).
- **From design:** the Design Studio's auto-sequenced install plan ([10](10-design-studio.md)) generates phases and tasks with crew-day estimates; design phases (e.g., "Phase 1: Spring 2027 patio") map to project phases.

#### 4.11.2 Scheduling a project [V1]

- **Forward scheduling** from the earliest start allowed by gates (4.1.2) over the assigned crew's working calendar, honoring dependencies, holidays, crew availability and equipment reservations (the skid steer for 2 days).
- **Critical path** computed and highlighted; each task shows total float. Moving a critical task asks "Move 6 successor tasks too?" and shows the new completion date.
- **Crew allocation:** a task can be assigned to a crew, split across crews, or assigned to a subcontractor (4.12). Partial-day tasks can share a Crew Day with maintenance stops (an install crew finishes a planting at 13:00 and runs 4 enhancement stops).
- **Material dependencies:** deliveries from [13](13-operations-inventory-equipment.md) appear as milestones; a task that needs delivered materials shows a warning if delivery is not `delivered` by task start; rescheduling offers to move dependent deliveries and notify vendors ([13](13-operations-inventory-equipment.md)).
- **Dig ticket windows:** tasks that excavate are gated by a clear locate ticket; tickets have validity periods that vary by state/province (verify per jurisdiction). If a weather delay pushes excavation beyond validity, the system prompts a ticket renewal task ([14](14-service-line-modules.md)).
- **Weather:** weather-sensitive tasks are checked against the forecast for their dates; a rain playbook shifts the dependency chain rather than individual tasks. The client sees a window ("Week of May 12") rather than false-precision dates ([06](06-customer-portal.md)).
- **Change orders:** approved change orders ([03](03-crm-sales-estimating-proposals.md)) add tasks or duration and trigger a replan with a client notice of the new expected completion week.
- **Events:** `job.phase_changed`, `phase.completed`, `milestone.reached`, `project.completed` (consumed by [06](06-customer-portal.md), [07](07-invoicing-billing-contracts.md), [14](14-service-line-modules.md) warranties).

#### 4.11.3 Multi-project resource view [V1, leveling V2]

A Gantt across all active projects for install pools shows crew and equipment loading by week. **V2 resource leveling** proposes start-date shifts to remove over-allocation while minimizing total project delay weighted by contract value and promised windows.

### 4.12 Subcontractor scheduling [V1]

- **Subcontractors as resources:** each subcontractor organization ([13](13-operations-inventory-equipment.md) vendor record) has service types, service area polygon, daily capacity (crews or visits per day), lead time, rates and a certificate of insurance (COI) with expiry.
- **Offer flow:** dispatcher selects Visits or Tasks and "Offer to sub". The sub receives the offer in the subcontractor mode of the crew app ([05](05-field-crew-mobile-app.md) 4.22.4) or by email/SMS link: accept, decline, or propose another date inside the due window. Response SLA (default 4 hours; storms 30 minutes) after which the offer escalates to the next preferred sub or back to the dispatcher.
- **Acceptance** creates a subcontract work order ([13](13-operations-inventory-equipment.md)) and **sub-held Visits** on the board in the sub's lane, so the schedule is complete and capacity counts correctly.
- **Validation:** an expired COI or missing required license blocks dispatch to that sub. Subs see only assigned Visits, no pricing, and gate codes only for the assigned day.
- **Execution:** subs can send on-my-way messages with Company branding through masked relay ([16](16-marketing-growth-communications.md)), record arrival/completion and photos; no continuous location tracking by default.
- **Batch offers:** "6 winterizations in the north zone on Friday" as one offer; the sub orders the stops themselves, or uses Rootline's suggested sequence.

### 4.13 Client self-scheduling windows [MVP basic, V1 full]

The **Availability API** is the single slot supply for the portal ([06](06-customer-portal.md)), online booking ([16](16-marketing-growth-communications.md)), the AI receptionist and staff booking on calls.

`GET /scheduling/availability?property_id&service_type&from&to&mode`

Rules:
- Returns dates (or time slots for `presence_required` services) where the relevant capacity pool has room in the Property's zone days, computed by cheapest insertion against current plans.
- **Lead time** (Company setting per service, default 3 business days), **seasonal window** (e.g., aeration bookable Aug 20 - Oct 15 for cool-season turf, from the season calendar), holiday and Property blackouts.
- **Protected capacity:** a Company-set share of each day's capacity (default 15%) is not offered online, reserved for office priorities, rain recovery and commercial work.
- **Per-day caps** per service and zone (e.g., max 12 aerations per Tuesday per aerator).
- **Modes:** `day` (client picks a day), `week` (client picks a week; Rootline picks the day), `slot` (time slots of duration + 30-min buffer for consults and walkthroughs), `recurring_start` (client picks a start week; service day assigned by best-day, 4.7.5).
- **Holds:** selecting a slot creates a 10-minute reservation (hold) while the client completes deposit or card-on-file; released on timeout or abandon.
- **Confirmation modes:** auto-confirm (default for standard services within caps) or office approval (default for commercial and for services flagged `needs_review`). Commercial client approvers can be required to approve reschedules ([06](06-customer-portal.md)).
- **Waitlist:** when no slot fits, the client can join a waitlist for a date range; cancellations or freed capacity (rain recovery done, growth skips) trigger offers in waitlist order.
- **Estimator self-booking** [V1]: site assessment appointments on estimators' calendars by territory, with travel buffers computed from the matrix between consecutive appointments.

### 4.14 AI scheduler and natural-language rescheduling [V1]

#### 4.14.1 Copilot scheduling commands

The Copilot ([17](17-ai-copilot-automation.md)) exposes scheduling tools (`schedule.query`, `schedule.propose_moves`, `optimizer.run`, `playbook.run`, `availability.find`, `capacity.query`). The LLM translates requests into structured tool calls; the deterministic engine computes the result; the Copilot renders a **ScheduleDiff** card ([17](17-ai-copilot-automation.md) generative UI) that the user accepts, edits on the board, or rejects.

| User says | What happens |
|---|---|
| "Move all of Crew 2's Wednesday stops to Thursday except the Ridgeview HOA" | Selects Crew 2's Wednesday Visits, excludes the HOA, runs `insertion` into Thursday plans with stability, returns diff with overtime impact |
| "Fit the Garcia fall cleanup in this week" | `availability.find` + best insertion; returns top 3 options with added drive and crew loads |
| "Ana went home sick. Who can take her afternoon?" | Reduces Crew 2's capacity from now, runs `repair`, proposes moves to nearby crews |
| "Push the Henderson patio a week, the pavers are late" | Shifts project start constraint by 5 working days, re-runs forward scheduling, shows new completion and affected milestone invoices |
| "Skip Bob Ortiz's mow next week, he's away" | Skip with reason `client_request`; applies agreement skip policy; drafts client confirmation |
| "Rain after 1 tomorrow. Split the day." | Runs the `split_day` playbook strategy for tomorrow |
| "How booked are we for aeration in September?" | `capacity.query` answer with weekly utilization and backlog |
| "Why is Crew 3 driving so much on Fridays?" | Density analysis with low-density stops and a territory suggestion |

Rules:
- The Copilot acts **with the requesting user's permissions**; it cannot propose what the user cannot do.
- Ambiguity is resolved with clarifying chips ("Which Smith? Smith, 12 Elm or Smith Ridge Office Park").
- Locks, fixed dates and compliance windows are hard constraints for AI-initiated changes.
- Every applied diff records `actor_type = ai_agent` with the initiating user ([20](20-architecture-security.md) audit).
- LLM usage for parsing and explanation is metered as AI credits; solver runs are not metered as AI credits but are rate-limited per tenant (default 300 heavy runs per day; [19](19-platform-admin-portal.md) can raise).

#### 4.14.2 Scheduling agent [V1]

The A7 Scheduling Agent in [17](17-ai-copilot-automation.md) runs proactively: weather reschedules 1-3 days ahead, sick-day rebalancing, gap filling from backlog, and capacity proposals for sales. Its proposals arrive in the dispatcher's inbox as ScheduleDiffs with an approval TTL (weather diffs expire at 05:00 on the affected day). Crews are notified only after approval.

#### 4.14.3 Voice for crew leads [V1]

From the crew app: "We're running 40 minutes behind" (triggers the late-running flow and client notices for affected windows), "Swap the next two stops" (resequence request within `crew_lead` permission: same-day reorder only), "Gate locked at 22 Oak, skip it" (skip with reason and photo prompt). Voice transcription and translation are in [05](05-field-crew-mobile-app.md).

### 4.15 Scheduling settings (summary) [MVP]

| Setting | Default | Range / options |
|---|---|---|
| Materialization horizon (recurring) | 8 weeks | 2-26 weeks |
| Auto-publish time for tomorrow | 15:00 | 12:00-20:00 or off |
| Load-out lock ([13](13-operations-inventory-equipment.md)) | 05:00 | 03:00-07:00 |
| Missed-visit sweep | 03:00 the day after | Fixed |
| Client skip cutoff | 18:00 day before | Any time / hours before |
| Self-scheduling lead time | 3 business days | 0-30 days |
| Protected capacity | 15% | 0-50% |
| Crew efficiency curve | 1.00 / 0.95 / 0.90 / 0.85 / 0.80 | Editable |
| Truck-and-trailer drive factor | 1.10 | 1.00-1.50 |
| Max drive leg (soft) | 25 min | 5-60 min |
| Optimizer preset | Keep routes stable | 5 presets + custom weights |
| Rain trigger (mowing) | >= 60% probability or >= 0.25 in QPF in window | Editable per service |
| Holiday policies | Per holiday, see 4.2.7 | 6 policies |
| On-my-way for weekly mowing | Off | On/off |
| Running-late threshold | 15 min beyond window | 5-60 min |
| Late-risk alert | 10 min beyond window | 5-60 min |
| Growth-adaptive mode | Off | Off / suggest / auto per agreement |

---

## 5. Key user flows

### 5.1 Sold weekly maintenance becomes a route stop [MVP]

1. A homeowner signs a proposal for weekly mowing (Apr 1 - Nov 15), a spring cleanup, a mulch install and two fall cleanups ([03](03-crm-sales-estimating-proposals.md)).
2. `proposal.accepted` creates a Client, Property and Service Agreement; [07](07-invoicing-billing-contracts.md) activates the agreement and emits `service_agreement.activated`.
3. This module creates one Service Schedule per recurring line (mowing: weekly, 0.75 crew-hours, zone-anchored) and seasonal calendar Visits (spring cleanup in its window, mulch in its window, two fall cleanups 14+ days apart).
4. Best-day runs (4.7.5): Tuesday, Crew 1, between stops 11 and 12, +4 minutes of drive. The office accepts (or auto-accept if the Company enabled it for new recurring clients).
5. Materialization creates Visits for the next 8 weeks; seasonal Visits are created as `unscheduled` with windows and appear in the backlog when their window approaches (default 21 days before window start).
6. The client receives "Your crew will visit on Tuesdays starting April 6" and sees the season calendar in the portal ([06](06-customer-portal.md)).

```mermaid
flowchart TD
    A["Proposal accepted"] --> B["Service Agreement activated"]
    B --> C["Service Schedules created per recurring line"]
    B --> D["Seasonal calendar visits created as unscheduled"]
    C --> E{"Client chose a fixed day?"}
    E -- "Yes" --> F["Anchor to client day, flag if off-zone"]
    E -- "No" --> G["Best-day insertion across zone days"]
    G --> H["Top 3 options with added drive and load"]
    H --> I["Office accepts option or auto-accept"]
    F --> J["Materialize visits for horizon"]
    I --> J
    J --> K["Visits on Master Route and daily routes"]
    D --> L["Backlog when window approaches"]
    K --> M["Client notified of service day"]
```

### 5.2 Season planning in February [MVP basic, V1 full]

1. The owner opens the Capacity Planner. The season heatmap shows mowing at 96% in May-June, enhancement at 128% in weeks 16-19 (mulch season), fall cleanups at 117% in weeks 43-46.
2. They run the Territory solver (V1) with 2 mowing crews plus a planned third crew from April 12. The proposal rebalances Tuesday and Thursday, changing the service day for 11% of clients.
3. They open a scenario: "Add Saturday shifts for enhancement crews in weeks 16-19" and "Subcontract 40 fall cleanups". The comparison shows overtime cost vs sub cost.
4. They promote the territory plan effective April 1 (client day-change notices drafted for March 18) and set a hiring target in [15](15-team-hr-payroll.md).
5. The sales team sees "Earliest start: week of May 10" for new enhancement proposals ([03](03-crm-sales-estimating-proposals.md)).

```mermaid
sequenceDiagram
    participant Owner
    participant Planner
    participant Solver
    participant Sales
    participant Clients
    Owner->>Planner: Open season heatmap
    Planner->>Owner: Utilization by pool and week
    Owner->>Solver: Run territory plan with 3 mowing crews
    Solver->>Owner: Zone-day map, KPIs, clients whose day changes
    Owner->>Planner: Scenario with Saturday shifts and subs
    Planner->>Owner: Cost and utilization comparison
    Owner->>Planner: Promote plan effective April 1
    Planner->>Clients: Draft day-change notices for review
    Planner->>Sales: Earliest start dates per service line
```

### 5.3 The daily dispatch cycle [MVP]

| Time (tenant-local) | What happens | Owner |
|---|---|---|
| 02:00 | Materialization job extends horizons; Crew Days generated; missed-visit sweep (03:00) | System |
| Every 60 min | Weather refresh for cells with Visits in the next 72 h; risk chips update | Weather Service |
| 05:00 | A7 agent posts any weather or sick-day ScheduleDiff proposals for today and tomorrow ([17](17-ai-copilot-automation.md)); load-out lists lock ([13](13-operations-inventory-equipment.md)) | Agent, system |
| 05:30-07:00 | Dispatcher reviews alerts, applies or edits diffs, handles call-outs; crews clock in and start routes | ops_manager, office_manager |
| 07:00-17:30 | Live map, ETAs, on-my-way texts, late-risk alerts, mid-day recovery | System, dispatcher |
| 12:00-15:00 | Office plans tomorrow: new work from backlog, client requests, optimizer runs | office_manager, ops_manager |
| 15:00 | Tomorrow auto-publishes; day-ahead notices go out for non-recurring Visits; load-out lists generate | System |
| 17:30-21:00 | Late changes (with crew push); route summaries; actuals reconciliation | System |

```mermaid
sequenceDiagram
    participant Sys as Scheduler
    participant Wx as WeatherSvc
    participant Agent as A7Agent
    participant Disp as Dispatcher
    participant Crew
    participant Client
    Sys->>Sys: 02:00 materialize visits and crew days
    Wx->>Sys: Hourly forecast updates
    Agent->>Disp: 05:00 proposed diffs (weather, sick calls)
    Disp->>Sys: Apply or edit diffs
    Sys->>Crew: Route deltas pushed
    Crew->>Sys: En route, arrived, completed events
    Sys->>Client: On-my-way with ETA window
    Sys->>Disp: Late-risk alerts
    Disp->>Sys: Plan tomorrow, run optimizer
    Sys->>Crew: 15:00 publish tomorrow
    Sys->>Client: Day-ahead notices for non-recurring visits
```

### 5.4 Rain day [MVP manual, V1 playbook]

Scenario: Tuesday Nov 10, 2026, forecast 80% rain after 13:00 with 0.6 in expected. Six crews, 118 Visits on Tuesday.

1. At 05:00 the A7 agent applies the Company's "Fall rain" playbook: `split_day` for cleanups and mowing (stop at 12:30), `push_later_in_week` for the afternoon stops, rounds near window close prioritized, the Oakmont commercial site (`do_not_move`) listed for a decision.
2. The diff: 47 Visits move to Wednesday-Friday, 3 to Saturday (Crew 3, opt-in), Crew 2 +1.5 h overtime Thursday, 44 client notices, 0 compliance violations, stability 86%.
3. The dispatcher keeps Oakmont on Tuesday morning (moves it earlier to 7:00), accepts the rest at 05:40.
4. Clients get one consolidated message each; the portal shows "Weather delay: now Thursday". Crews see their shortened Tuesday and updated Wednesday-Friday routes.
5. At 12:10 radar shows rain arriving early; Crew 4's lead taps "Rain stop". Its remaining 3 Visits become `weather_hold`; the playbook re-runs for them and proposes Thursday.

```mermaid
sequenceDiagram
    participant Wx as WeatherSvc
    participant PB as Playbook
    participant Opt as Optimizer
    participant Disp as Dispatcher
    participant Comms
    participant Crew
    Wx->>PB: Forecast meets rain trigger for Tuesday PM
    PB->>PB: Select affected visits by service rules
    PB->>Opt: Week plan for displaced visits with locks
    Opt->>PB: Moves, overtime, stability, drops
    PB->>Disp: ScheduleDiff with notices preview
    Disp->>PB: Edit exceptions and apply
    PB->>Comms: Consolidated client delay notices
    PB->>Crew: Route updates and rain banner
    Crew->>PB: Rain stop at 12:10
    PB->>Opt: Re-run for held visits
    Opt->>Disp: Follow-up diff
```

```mermaid
flowchart TD
    A["Forecast or crew reports rain"] --> B{"Trigger met for service type?"}
    B -- "No" --> C["Keep plan, show amber risk"]
    B -- "Yes" --> D{"Visit locked or fixed date?"}
    D -- "Yes" --> E["List for dispatcher decision"]
    D -- "No" --> F{"Round near window end?"}
    F -- "Yes" --> G["Priority 1 for earliest dry slot"]
    F -- "No" --> H["Apply playbook strategy"]
    G --> I["Optimizer builds ScheduleDiff"]
    H --> I
    E --> I
    I --> J{"Displaced hours fit this week?"}
    J -- "Yes" --> K["Review and apply"]
    J -- "No" --> L["Escalation options: Saturday, longer shifts, skips, subs"]
    L --> K
    K --> M["Notify clients and crews"]
```

### 5.5 Mid-day breakdown recovery [V1]

1. 10:40: Crew 1's ZTR mower throws a belt. The crew lead taps "Equipment issue" in the app; [13](13-operations-inventory-equipment.md) marks the unit `down`.
2. Crew 1's 9 remaining mowing Visits get `late_risk`. The dispatcher opens Recover.
3. `repair` returns: (a) Crew 1 switches to the 48-inch walk-behind on its trailer and finishes at 18:45 (+75 min OT); (b) Crew 3 (12 minutes away, 1.8 h slack) takes 4 stops; Crew 1 completes 5 with the walk-behind by 17:20; (c) 4 `week_flex` stops move to Wednesday with notices.
4. Dispatcher applies (b). Crew 3 gets 4 new stops pushed; 2 clients with afternoon windows get "running late" updates; the other moved stops stay inside their windows so no notices go out.

```mermaid
sequenceDiagram
    participant Lead as CrewLead
    participant Equip as EquipmentSvc
    participant Sys as Scheduler
    participant Opt as Optimizer
    participant Disp as Dispatcher
    participant Crew3
    participant Comms
    Lead->>Equip: Report mower down
    Equip->>Sys: Unit down event
    Sys->>Disp: Late-risk on 9 visits
    Disp->>Opt: Recover Crew 1 (repair mode)
    Opt->>Disp: Three options with KPIs
    Disp->>Sys: Apply option b
    Sys->>Crew3: Push 4 new stops
    Sys->>Lead: Updated route
    Sys->>Comms: Running-late notices for 2 clients
```

### 5.6 Scheduling a fertilizer round inside its window [MVP]

1. Round 2 (broadleaf + fertilizer) window opens May 1 - June 5 for 1,412 enrolled lawns ([14](14-service-line-modules.md)).
2. The Round Planner groups eligible round instances (28+ days since Round 1, notices sent) by zone and week and requests `week_plan` with skill `pesticide_applicator` (state category turf) and sprayer capacity.
3. The optimizer returns routes for 5 licensed applicators over 4 weeks at about 75 lawns per applicator-day (illustrative), with wind/rain flags per day.
4. Two applicators' licenses expire May 31; Visits after that date fail validation and are reassigned before publish, and the owner gets a renewal alert.
5. When a weather playbook moves a round Visit, the window guard prevents moving past June 5 and re-notification fires if the date leaves the notified range.

```mermaid
flowchart LR
    A["Round instances eligible"] --> B["Round Planner groups by zone and week"]
    B --> C["Week plan with license and sprayer constraints"]
    C --> D{"Wind or rain violation forecast?"}
    D -- "Yes" --> E["Flag amber or red, propose alternate day"]
    D -- "No" --> F["Routes ready"]
    E --> F
    F --> G{"Applicator license valid on date?"}
    G -- "No" --> H["Reassign or block publish"]
    G -- "Yes" --> I["Publish and notify per state rules"]
    H --> I
```

### 5.7 Multi-day patio project with dependencies [V1]

J-1042 Henderson patio and planting: deposit paid April 12, 2027; dig ticket clear April 16; pavers delivered April 23.

```mermaid
gantt
    title J-1042 Henderson patio and planting
    dateFormat YYYY-MM-DD
    excludes weekends
    section Gates
    Deposit paid            :milestone, g1, 2027-04-12, 0d
    Dig ticket clear        :milestone, g2, 2027-04-16, 0d
    Pavers delivered        :milestone, g3, 2027-04-23, 0d
    section Phase 1 Demo and grade
    Demo and haul           :t1, 2027-04-19, 1d
    Excavate and rough grade :t2, after t1, 2d
    section Phase 2 Hardscape
    Base install and compaction :t3, after t2, 2d
    Paver install           :t4, after t3, 3d
    Polymeric sand          :t5, after t4, 1d
    Hardscape complete      :milestone, m1, after t5, 0d
    section Phase 3 Softscape
    Planting and mulch      :t6, after t5, 1d
    Lighting install        :t7, after t6, 1d
    Final walkthrough       :milestone, m2, after t7, 0d
```

1. The project is created from the sold design's install sequence ([10](10-design-studio.md)).
2. Forward scheduling places Demo on April 19 (after the dig ticket gate). Paver install depends on base completion and the paver delivery milestone.
3. Rain on April 22 is forecast during base install; the playbook shifts the chain by one day and checks the dig ticket's validity window; the client sees "Hardscape: week of April 26".
4. `milestone.reached` for "Hardscape complete" triggers the 50% milestone invoice in [07](07-invoicing-billing-contracts.md).

### 5.8 Client reschedules from the portal [MVP]

```mermaid
sequenceDiagram
    participant Client
    participant Portal
    participant Avail as AvailabilityAPI
    participant Sched as Scheduler
    participant Office
    Client->>Portal: Reschedule aeration
    Portal->>Avail: Dates for property and service
    Avail->>Portal: Dates with capacity in zone days
    Client->>Portal: Pick Thursday Sept 16
    Portal->>Avail: Place 10 minute hold
    alt Auto-confirm allowed
        Portal->>Sched: Confirm reschedule
        Sched->>Client: Confirmation notice
    else Office approval required
        Portal->>Office: Approval task
        Office->>Sched: Approve
        Sched->>Client: Confirmation notice
    end
```

### 5.9 Natural-language reschedule via Copilot [V1]

```mermaid
sequenceDiagram
    participant User as Dispatcher
    participant Copilot
    participant Tools as SchedulingTools
    participant Opt as Optimizer
    User->>Copilot: Move Crew 2 Wednesday to Thursday except the HOA
    Copilot->>Tools: Query Crew 2 Wednesday visits
    Tools->>Copilot: 19 visits incl. Ridgeview HOA (locked)
    Copilot->>Opt: Insert 18 visits into Thursday plans
    Opt->>Copilot: Diff with overtime and stability
    Copilot->>User: ScheduleDiff card with notices preview
    User->>Copilot: Accept
    Copilot->>Tools: Apply diff as ai_agent for user
```

### 5.10 Snow event routing hand-off [V1]

1. The Storm Event Engine ([14](14-service-line-modules.md)) opens an `active` event; 84 sites have crossed their trigger.
2. This module activates event Visits by priority tier, assigns trucks and subs, and solves `storm` mode with open-by deadlines (P1 by 6:00).
3. Every 15 minutes, accumulation updates re-queue sites for re-service; the router re-solves with stability weight 0.
4. Arrival/departure, depth photos and salt logs flow from the crew app to the proof vault ([14](14-service-line-modules.md)); billing follows event close ([07](07-invoicing-billing-contracts.md)).

---

## 6. Screens and wireframes

### 6.1 Screen inventory

| # | Screen | Surface | Primary roles | Priority |
|---|---|---|---|---|
| S1 | Dispatch board: Day (Gantt by crew) | Web | ops_manager, office_manager | [MVP] (wireframe in [21](21-ux-design-system-sitemaps.md) 18.4) |
| S2 | Dispatch board: Week (crew x day) with unassigned tray | Web | ops_manager, office_manager | [MVP] (6.2) |
| S3 | Map view and live map | Web, manager mode on mobile | ops_manager, owner | [MVP] (6.5) |
| S4 | ScheduleDiff review (optimizer, playbook, Copilot, bulk) | Web | ops_manager, office_manager | [MVP] (6.3) |
| S5 | Capacity planner (season heatmap, week detail) | Web | owner, ops_manager | [MVP] basic (6.4) |
| S6 | Backlog | Web | ops_manager, office_manager | [MVP] |
| S7 | Scenario compare (what-if) | Web | ops_manager, owner | [V1] (6.6) |
| S8 | Territories and zones editor; Master Route editor | Web | ops_manager, owner | [MVP] zones, [V1] solver |
| S9 | Service Schedule editor (recurrence presets, frequency profiles, growth-adaptive) | Web | office_manager, ops_manager | [MVP] |
| S10 | Season calendar settings (per Region and branch) | Web | owner, ops_manager | [MVP] |
| S11 | Holiday and blackout calendars | Web | owner, office_manager | [MVP] |
| S12 | Weather playbooks editor | Web | owner, ops_manager | [V1] |
| S13 | Crews and Crew Day roster editor | Web | ops_manager | [MVP] |
| S14 | Resource reservations view | Web | ops_manager | [V1] |
| S15 | Project Gantt (single and multi-project) | Web | ops_manager, designer, owner | [V1] |
| S16 | Subcontractor offers inbox (sub side) and sub lanes (office side) | Crew app (sub mode), web | subcontractor, ops_manager | [V1] |
| S17 | Crew app: Today route, route changes banner, rain stop, recover requests | Mobile | crew_lead, technician | [MVP] (spec in [05](05-field-crew-mobile-app.md)) |
| S18 | Portal: next visit, ETA, reschedule and skip, booking windows | Portal | client_residential, client_commercial | [MVP] (spec in [06](06-customer-portal.md)) |
| S19 | Route sheet (print/PDF) | Web | office_manager, crew_lead | [MVP] |
| S20 | Optimization run inspector | Web (tenant) and Platform Admin | ops_manager, platform_engineer | [V1] |
| S21 | Scheduling settings | Web | owner | [MVP] |

### 6.2 Dispatch board: Week view with unassigned tray (S2)

```text
+--------------------------------------------------------------------------------------------------------------+
| Schedule / Dispatch   Week of Nov 9, 2026  [< prev] [this week] [next >]  [Day|3-day|Week|Map|Split]          |
| Branch: Columbus North v   Pools: All v   Flags: [ ] late risk [ ] conflicts [ ] unassigned   [Optimize week] |
+---------------------+----------------------------------------------------------------------------------------+
| UNASSIGNED (23)     |              Mon 9          Tue 10         Wed 11         Thu 12         Fri 13    Sat 14|
| Sort: urgency v     | Weather      sun 52F        rain 80% PM   cloudy 48F    sun 50F        sun 54F   cloudy  |
| [Search...........] |              ///////////// RISK: 118 visits Tue PM  [Plan rain day]                    |
|                     |--------------------------------------------------------------------------------------- |
| ! Fall cleanup #2   | Crew 1 (Luis) 18 st 9.6/10h  21 st 10.4/10h! 17 st 9.1/10h  19 st 9.8/10h  16 st 8.5h    -    |
|   Garcia  3.5 ch    |  T-12 TR-04   [===========]  [============]  [==========]   [===========]  [=========]      |
|   due Nov 20 (9d)   | Crew 2 (Ana)  12 st 8.8/9h   14 st 9.0/9h    11 st 8.1/9h   13 st 9.3/9h!  10 st 7.0h    -    |
|   needs dump trlr   |  Commercial   Oakmont(L)...  Ridgeview HOA(L)                                            |
| ! Winterization     | Crew 3 (Tom)  15 st 9.0/10h  15 st 8.7/10h   16 st 9.9/10h  14 st 8.2/10h  15 st 9.0h  opt-in |
|   Patel 0.75 ch     | Irrigation    WINT x9  6.1h  WINT x11 7.4h   WINT x8 5.6h   WINT x10 6.9h  WINT x7     -    |
|   before hard freeze|  (Sam, lic.)  hard freeze Thu night: 46 winterizations not done [Prioritize]           |
|   Thu (3d)          | Install A     J-1042 Henderson patio Phase 2 ============================>  (tentative) |
|   Leaf vac + dump   | Sub: GreenCo  -             WINT x6 (accepted)  -              -             -          |
| ~ Aeration (AER)    | Floaters      Dani (avail)  Jesse (PTO)     -               -              -             |
|   Brown 1.0 ch      |--------------------------------------------------------------------------------------- |
|   window ends Nov 15| Capacity     92%           101%            88%             94%            78%       --    |
| ...                 | Sold hours   212 / 231 h   238 / 236 h     205 / 233 h     220 / 234 h    176 / 226 h        |
| [Auto-slot selected]|--------------------------------------------------------------------------------------- |
| [Waitlist (4)]      | Selected: 3 cards  [Move to...] [Reassign v] [Lock] [Skip...] [Notify clients] [Diff]   |
+---------------------+----------------------------------------------------------------------------------------+
 Legend: st = stops; ch = crew-hours; (L) locked; ! = over capacity or due soon; ~ = window closing; WINT = winterization
```

Behavior notes:
- Each cell expands on click into the Day sequence for that crew-day; double-click opens the Day view.
- Dragging a tray card onto a cell shows a ghost with "+6 min drive, 9.6 -> 10.3 h" before drop.
- The "Plan rain day" call-to-action opens the ScheduleDiff review (6.3) with the playbook pre-run.
- The hard-freeze banner on the irrigation lane links to a pre-filtered backlog and a "Prioritize before freeze" optimizer run.

### 6.3 ScheduleDiff review (S4)

```text
+--------------------------------------------------------------------------------------------------------+
| Review changes: Rain plan for Tue Nov 10 (playbook "Fall rain", proposed by Scheduling Agent 05:00)    |
| Expires 05:00 Nov 10 if not applied                                                       [Edit rules]  |
+--------------------------------------------------------------------------------------------------------+
| SUMMARY                                   | KPIs                    Before      After      Change       |
| 47 visits move  (Wed 18, Thu 21, Fri 5,   | Drive hours (week)      61.4 h      63.0 h     +1.6 h       |
|   Sat 3)                                  | Overtime hours          2.0 h       3.5 h      +1.5 h       |
| 0 visits skipped                          | Late vs client windows  0           1          +1  [view]   |
| 1 needs your decision: Oakmont (locked)   | Route stability         -           86%                     |
| 44 client notices, 6 crew pushes          | Rounds at window risk   0           0                       |
+--------------------------------------------------------------------------------------------------------+
| BY CREW          Tue 10           Wed 11              Thu 12               Fri 13          Sat 14     |
| Crew 1           -9 stops (PM)    +4 (10.3 h)         +5 (10.4 h, OT 0.4)  -               -          |
| Crew 2           -6 stops (PM)    +2                  +4 (OT 1.5 h) !      -               -          |
| Crew 3           -8 stops (PM)    +5                  +3                   +2              +3 (opt-in)|
| ...                                                                                                    |
+--------------------------------------------------------------------------------------------------------+
| NEEDS DECISION                                                                                         |
|  Oakmont Office Park (do_not_move, contract SLA Tue)  ( ) Keep Tue, move to 07:00   ( ) Move to Wed   |
+--------------------------------------------------------------------------------------------------------+
| VISITS (47)  [filter: crew v] [only with notices]                                                      |
|  [x] Ortiz      Weekly mow   Tue 14:10 Crew 1 -> Thu 09:40 Crew 1   notice: SMS (EN)    [edit]         |
|  [x] Patel      Fall cleanup Tue 13:00 Crew 3 -> Wed 08:00 Crew 3   notice: email       [edit]         |
|  [ ] Kim        Weekly mow   Tue 15:20 Crew 1 -> Fri 08:30 Crew 3   crew change!        [edit]         |
|  ...                                                                                                   |
+--------------------------------------------------------------------------------------------------------+
| Notice preview (EN): "Rain is expected Tuesday afternoon. Your service moves to Thursday, Nov 12.      |
|  Reply here with questions. - Green Valley Landscapes"            [ES preview] [Edit template]         |
+--------------------------------------------------------------------------------------------------------+
| [Open in board]  [Apply selected (46)]  [Apply all]  [Discard]                                         |
+--------------------------------------------------------------------------------------------------------+
```

### 6.4 Capacity planner: season heatmap (S5)

```text
+------------------------------------------------------------------------------------------------------+
| Capacity planner  2027 season  Branch: All v  Units: [crew-hours] [% utilization]  [Scenario: Live v] |
+------------------------------------------------------------------------------------------------------+
| Pool / week      W10  W12  W14  W16  W18  W20  W22  W24 ... W36  W38  W40  W42  W44  W46  W48       |
| Mowing (3 crews)  -    -   71%  88%  96%  97%  95%  91% ...  84%  86%  80%  74%  52%   -    -        |
| Enhancement      40%  78%  104% 128% 122% 96%  70%  55% ...  60%  72%  88%  110% 117% 98%  41%       |
| Lawn applications -   64%  92%  85%  90%  88%  79%  75% ...  82%  91%  66%  58%   -    -    -        |
| Irrigation       12%  20%  95%  99%  61%  40%  38%  35% ...  33%  52%  89%  97%  64%   -    -        |
| Install          35%  58%  83%  97%  101% 99%  94%  90% ...  86%  80%  72%  55%  40%  20%   -        |
| Snow (events)     -    -    -    -    -    -    -    -  ...   -    -    -    -   on   on   on        |
+------------------------------------------------------------------------------------------------------+
| Cell W16 Enhancement: 128%  = recurring 0 h + seasonal (mulch, cleanups) 402 h + backlog 61 h          |
|                              + projects 0 h + pipeline (weighted) 38 h   vs available 391 h             |
| Overtime projection: 4 people x 9.5 h/wk          Suggested levers:                                     |
|  [Add Saturday shift W15-W19: -18 pts, $6,840]  [Sub 30 mulch jobs: -12 pts, $9,900]                   |
|  [Hire 2 seasonals from Apr 5: -25 pts, $11,200]  [Push 20 mulch jobs to W20-W21: -9 pts, $0]         |
+------------------------------------------------------------------------------------------------------+
| Legend: < 75% blue  75-90% green  90-100% amber  100-110% orange  > 110% red                           |
+------------------------------------------------------------------------------------------------------+
```

### 6.5 Live map with ETAs and late-risk alerts (S3)

```text
+--------------------------------------------------------------------------------------------------------+
| Live  Tue Nov 10, 10:52   Crews: 6 active  [x] Planned routes [x] Actual trails [ ] Radar [x] Zones     |
+-----------------------------------------------------------------+--------------------------------------+
|                                                                 | ALERTS (3)                           |
|      (1)--(2)--(3)--[C1 >]..(5)..(6)       zone T-North         | ! Crew 1 mower down 10:40            |
|                            \                                    |   9 visits at risk   [Recover]       |
|       YARD [Y]              (7)..(8)                            | ~ Crew 2 +22 min vs plan             |
|          \                                                      |   Ridgeview window 11:00-12:00 OK    |
|           [C3 o] on site: Smith (6/15)                          | ~ Crew 4 not syncing since 09:58     |
|                                                                 |   (last seen Hilltop Rd, low signal) |
|   [C2 >] -> Ridgeview HOA ETA 11:25 (+/-15)                     |--------------------------------------|
|                                                                 | CREW 1  Luis + 2   T-12 / TR-04      |
|            DUMP [D]          SUPPLY [S]                         | Status: on site, Ortiz (7/18)        |
|                                                                 | Hours: 3.6 used / 9.6 budget         |
|  o on site   > driving   = break (no location)   x offline      | Projected end: 18:45 (shift 17:30) ! |
|  ring: green on time, amber 1-15 late, red > 15 late            | Next: Kim  ETA 11:40 (+/-15)         |
|                                                                 | [Message crew] [Reorder] [Recover]   |
+-----------------------------------------------------------------+--------------------------------------+
```

### 6.6 Scenario compare (S7)

```text
+--------------------------------------------------------------------------------------------------------+
| Scenarios for week of Apr 12, 2027                                    [New scenario] [Promote...]      |
+--------------------------------------------------------------------------------------------------------+
| Metric                         Live plan        A: Crew 4 out all week     B: Crew 4 out + Saturday     |
|--------------------------------------------------------------------------------------------------------|
| Visits scheduled               412              396 (-16 to backlog)       412                          |
| Drive hours                    58.2             55.9                       60.4                         |
| Overtime hours                 4.0              21.5                       6.0                          |
| Late vs windows                0                7                          1                            |
| Route stability                -                71%                        78%                          |
| Revenue per drive hour         $214            $205                       $206                         |
| Labor cost delta               -                +$1,410                    +$1,880 (Sat premium)        |
| Client notices needed          0                61                         48                           |
|--------------------------------------------------------------------------------------------------------|
| Levers  A: remove Crew 4 (Apr 12-16)    B: remove Crew 4; add Sat shift Crews 1-3; allow 10.5 h days   |
| [View A on board]  [View B on board]  [Promote B to diff]                                              |
+--------------------------------------------------------------------------------------------------------+
```

---

## 7. Data model

Conventions follow [20](20-architecture-security.md) section 7.1: every table carries `tenant_id` with Postgres row-level security, `branch_id` where relevant, `created_at`, `created_by`, `updated_at`, `version` for optimistic concurrency, soft-delete `archived_at`. Times are `timestamptz` in UTC; business dates (`service_date`) are property-local `date` values using the Property's IANA time zone. Recurrences are RFC 5545 RRULE strings plus extension columns. Tables live in the `ops` schema (scheduling) unless noted; GPS telemetry lives in the separate telemetry cluster.

### 7.1 Work, recurrence and visits

```mermaid
erDiagram
    SERVICE_AGREEMENT ||--o{ SERVICE_SCHEDULE : "defines"
    JOB ||--o{ SERVICE_SCHEDULE : "recurring lines"
    SERVICE_SCHEDULE ||--|| RECURRENCE_RULE : "uses"
    RECURRENCE_RULE ||--o{ RECURRENCE_EXCEPTION : "has"
    SERVICE_SCHEDULE ||--o{ VISIT : "generates"
    JOB ||--o{ JOB_PHASE : "has"
    JOB_PHASE ||--o{ JOB_TASK : "has"
    JOB_TASK ||--o{ TASK_DEPENDENCY : "predecessor of"
    JOB_TASK ||--o{ VISIT : "executed by"
    JOB ||--o{ VISIT : "has"
    JOB ||--o{ JOB_GATE : "gated by"
    VISIT ||--o{ VISIT_LINE : "contains"
    VISIT ||--o{ VISIT_REQUIREMENT : "needs"
    VISIT ||--o{ VISIT_EVENT : "logs"
    VISIT ||--o| VISIT_ACTUAL : "measured as"
    PROPERTY ||--o{ VISIT : "location of"
    SERVICE_AGREEMENT {
        uuid id PK
        uuid tenant_id FK
        uuid client_id FK
        date starts_on
        date ends_on
        string billing_mode
        string growth_adaptive_mode
        int max_growth_skips
    }
    JOB {
        uuid id PK
        uuid tenant_id FK
        uuid property_id FK
        uuid service_agreement_id FK
        string job_type
        string status
        date earliest_start
        date must_finish_by
    }
    JOB_GATE {
        uuid id PK
        uuid job_id FK
        string gate_type
        string status
        uuid overridden_by FK
        string override_reason
    }
    SERVICE_SCHEDULE {
        uuid id PK
        uuid tenant_id FK
        uuid job_id FK
        uuid property_id FK
        string service_type
        numeric duration_crew_hours
        numeric learned_crew_hours
        string flexibility
        string time_window_type
        time window_start
        time window_end
        string capacity_pool
        int priority
        string route_day_anchor
        string parity
        boolean off_zone
    }
    RECURRENCE_RULE {
        uuid id PK
        uuid service_schedule_id FK
        string rrule
        date season_start
        date season_end
        jsonb frequency_profile
        int count_limit
        boolean snap_to_route_day
    }
    RECURRENCE_EXCEPTION {
        uuid id PK
        uuid recurrence_rule_id FK
        date original_date
        string exception_type
        date new_date
    }
    JOB_PHASE {
        uuid id PK
        uuid job_id FK
        string name
        int sequence
        date planned_start
        date planned_finish
        string status
    }
    JOB_TASK {
        uuid id PK
        uuid job_phase_id FK
        string name
        numeric duration_crew_days
        string capacity_pool
        string weather_sensitivity
        date constraint_start_on_or_after
        date constraint_finish_by
        boolean is_milestone
        boolean on_critical_path
    }
    TASK_DEPENDENCY {
        uuid id PK
        uuid predecessor_task_id FK
        uuid successor_task_id FK
        string dependency_type
        int lag_working_days
    }
    VISIT {
        uuid id PK
        uuid tenant_id FK
        uuid job_id FK
        uuid service_schedule_id FK
        uuid job_task_id FK
        uuid round_instance_id FK
        uuid property_id FK
        uuid crew_id FK
        uuid route_id FK
        uuid parent_visit_id FK
        date service_date
        date original_date
        date due_start
        date due_end
        string status
        string flexibility
        string lock_level
        int priority
        timestamptz planned_arrival
        numeric duration_crew_hours
        string occurrence_key
        boolean detached
        int version
    }
    VISIT_LINE {
        uuid id PK
        uuid visit_id FK
        uuid price_book_item_id FK
        numeric quantity
        string unit
        numeric crew_hours
    }
    VISIT_REQUIREMENT {
        uuid id PK
        uuid visit_id FK
        string requirement_type
        string key
        string scope
        string strength
    }
    VISIT_EVENT {
        uuid id PK
        uuid visit_id FK
        string from_state
        string to_state
        string actor_type
        uuid actor_id
        string reason_code
        timestamptz trusted_time
    }
    VISIT_ACTUAL {
        uuid visit_id PK
        timestamptz arrived_at
        timestamptz departed_at
        string arrival_source
        numeric onsite_crew_hours
        int evidence_score
        boolean needs_review
    }
    PROPERTY {
        uuid id PK
        uuid tenant_id FK
        uuid zone_id FK
        string time_zone
        geometry location
        geometry parcel
    }
```

### 7.2 Crews, resources, routes and territories

```mermaid
erDiagram
    CREW ||--o{ CREW_MEMBER : "default roster"
    CREW ||--o{ CREW_DAY : "operates"
    CREW_DAY ||--o{ CREW_DAY_MEMBER : "roster"
    CREW_DAY ||--o| ROUTE : "runs"
    ROUTE ||--o{ ROUTE_STOP : "ordered"
    ROUTE_STOP }o--o| VISIT : "serves"
    EMPLOYEE ||--o{ EMPLOYEE_SKILL : "holds"
    SKILL ||--o{ EMPLOYEE_SKILL : "granted as"
    EMPLOYEE ||--o{ CREW_DAY_MEMBER : "works"
    RESOURCE ||--o{ RESOURCE_RESERVATION : "reserved by"
    CREW_DAY ||--o{ RESOURCE_RESERVATION : "holds"
    ZONE ||--o{ ZONE_DAY : "served on"
    ZONE_DAY ||--o{ MASTER_ROUTE : "templated by"
    MASTER_ROUTE ||--o{ MASTER_ROUTE_STOP : "ordered"
    DEPOT ||--o{ CREW : "home of"
    DEPOT ||--o{ ROUTE : "start and end"
    CREW {
        uuid id PK
        uuid tenant_id FK
        uuid branch_id FK
        string name
        uuid lead_employee_id FK
        uuid depot_id FK
        uuid default_vehicle_id FK
        uuid default_trailer_id FK
        string primary_pool
        jsonb shift_template
        string color
    }
    CREW_MEMBER {
        uuid crew_id FK
        uuid employee_id FK
        date effective_from
        date effective_to
    }
    CREW_DAY {
        uuid id PK
        uuid tenant_id FK
        uuid crew_id FK
        date work_date
        timestamptz shift_start
        timestamptz shift_end
        numeric available_crew_hours
        string publish_status
        timestamptz published_at
        int version
    }
    CREW_DAY_MEMBER {
        uuid crew_day_id FK
        uuid employee_id FK
        string role
        numeric capacity_factor
    }
    EMPLOYEE {
        uuid id PK
        uuid tenant_id FK
        string status
        string preferred_language
    }
    SKILL {
        uuid id PK
        uuid tenant_id FK
        string key
        string skill_type
        boolean jurisdictional
    }
    EMPLOYEE_SKILL {
        uuid id PK
        uuid employee_id FK
        uuid skill_id FK
        string jurisdiction
        string category
        int level
        date expires_on
    }
    RESOURCE {
        uuid id PK
        uuid tenant_id FK
        uuid equipment_id FK
        string resource_class
        uuid depot_id FK
        string status
        jsonb capacities
        int width_inches
    }
    RESOURCE_RESERVATION {
        uuid id PK
        uuid resource_id FK
        uuid crew_day_id FK
        uuid job_task_id FK
        timestamptz starts_at
        timestamptz ends_at
        string source
    }
    ROUTE {
        uuid id PK
        uuid tenant_id FK
        uuid crew_id FK
        uuid crew_day_id FK
        date route_date
        uuid start_depot_id FK
        uuid end_depot_id FK
        int total_drive_minutes
        int total_onsite_minutes
        uuid optimization_run_id FK
        string status
    }
    ROUTE_STOP {
        uuid id PK
        uuid route_id FK
        int sequence
        string stop_type
        uuid visit_id FK
        uuid site_id FK
        timestamptz planned_arrival
        timestamptz planned_departure
        int drive_minutes_from_prev
        boolean sequence_locked
    }
    DEPOT {
        uuid id PK
        uuid tenant_id FK
        string depot_type
        string name
        geometry location
        jsonb hours
    }
    ZONE {
        uuid id PK
        uuid tenant_id FK
        uuid branch_id FK
        string name
        geometry boundary
    }
    ZONE_DAY {
        uuid id PK
        uuid zone_id FK
        int iso_weekday
        string parity
        uuid preferred_crew_id FK
    }
    MASTER_ROUTE {
        uuid id PK
        uuid zone_day_id FK
        uuid crew_id FK
        date effective_from
        int version
    }
    MASTER_ROUTE_STOP {
        uuid id PK
        uuid master_route_id FK
        uuid service_schedule_id FK
        int sequence
        time expected_arrival
    }
```

`DEPOT` covers yards, dump sites, supply houses, salt depots and water sources (`depot_type`). `ROUTE_STOP.stop_type` is one of `visit`, `break`, `dump`, `supply`, `reload`, `depot_start`, `depot_end`.

### 7.3 Planning, weather, tracking and booking

```mermaid
erDiagram
    SCENARIO ||--o{ OPTIMIZATION_RUN : "runs"
    OPTIMIZATION_RUN ||--o| SCHEDULE_DIFF : "produces"
    SCHEDULE_DIFF ||--o{ SCHEDULE_DIFF_ITEM : "contains"
    SCHEDULE_DIFF ||--o{ SCHEDULE_CHANGE : "applied as"
    WEATHER_PLAYBOOK ||--o{ WEATHER_DECLARATION : "instantiated as"
    WEATHER_DECLARATION ||--o| SCHEDULE_DIFF : "proposes"
    WEATHER_CELL ||--o{ WEATHER_FORECAST_HOUR : "forecasts"
    CALENDAR ||--o{ CALENDAR_DATE : "contains"
    BLACKOUT }o--o| PROPERTY : "blocks"
    AVAILABILITY_HOLD }o--|| PROPERTY : "for"
    SUB_OFFER ||--o{ SUB_OFFER_ITEM : "offers"
    SCENARIO {
        uuid id PK
        uuid tenant_id FK
        uuid owner_user_id FK
        string name
        date range_start
        date range_end
        jsonb levers
        string status
        timestamptz expires_at
    }
    OPTIMIZATION_RUN {
        uuid id PK
        uuid tenant_id FK
        uuid scenario_id FK
        string mode
        string preset
        string inputs_hash
        string solver_version
        int stops_count
        int vehicles_count
        int wall_ms
        jsonb objective_breakdown
        string outcome
    }
    SCHEDULE_DIFF {
        uuid id PK
        uuid tenant_id FK
        string source
        uuid initiated_by FK
        string status
        jsonb kpi_before
        jsonb kpi_after
        timestamptz expires_at
        timestamptz applied_at
    }
    SCHEDULE_DIFF_ITEM {
        uuid id PK
        uuid schedule_diff_id FK
        uuid visit_id FK
        string change_type
        date from_date
        date to_date
        uuid from_crew_id FK
        uuid to_crew_id FK
        boolean selected
        boolean notify_client
    }
    SCHEDULE_CHANGE {
        uuid id PK
        uuid tenant_id FK
        uuid visit_id FK
        uuid schedule_diff_id FK
        string actor_type
        uuid actor_id
        jsonb before
        jsonb after
        string reason
        timestamptz changed_at
    }
    WEATHER_PLAYBOOK {
        uuid id PK
        uuid tenant_id FK
        string name
        jsonb triggers
        jsonb strategies
        string approval_mode
        boolean active
    }
    WEATHER_DECLARATION {
        uuid id PK
        uuid playbook_id FK
        date affected_date
        uuid branch_id FK
        string declared_by_type
        string status
    }
    WEATHER_CELL {
        string h3_index PK
        int resolution
        timestamptz last_fetched_at
        string provider
    }
    WEATHER_FORECAST_HOUR {
        string h3_index FK
        timestamptz valid_at
        timestamptz issued_at
        int precip_prob_pct
        numeric qpf_in
        numeric snow_in
        numeric temp_f
        numeric wind_mph
        numeric gust_mph
        numeric heat_index_f
    }
    CALENDAR {
        uuid id PK
        uuid tenant_id FK
        uuid branch_id FK
        string calendar_type
        string jurisdiction
    }
    CALENDAR_DATE {
        uuid id PK
        uuid calendar_id FK
        date the_date
        string name
        string policy
    }
    BLACKOUT {
        uuid id PK
        uuid tenant_id FK
        string scope_type
        uuid scope_id
        date starts_on
        date ends_on
        string reason
        string strength
    }
    AVAILABILITY_HOLD {
        uuid id PK
        uuid tenant_id FK
        uuid property_id FK
        string service_type
        date slot_date
        timestamptz slot_start
        timestamptz expires_at
        string channel
    }
    SUB_OFFER {
        uuid id PK
        uuid tenant_id FK
        uuid vendor_id FK
        string status
        timestamptz respond_by
        uuid subcontract_order_id FK
    }
    SUB_OFFER_ITEM {
        uuid id PK
        uuid sub_offer_id FK
        uuid visit_id FK
        date proposed_date
        string response
    }
```

Telemetry tables (separate cluster, partitioned daily, BRIN on time; [20](20-architecture-security.md) section 4.17): `gps_ping (tenant_id, employee_id, device_id, vehicle_id, recorded_at, lat, lng, accuracy_m, speed_mps, heading, source)`, `geofence_event (tenant_id, visit_id, device_id, event_type, occurred_at, dwell_s, path)`, `telematics_event (tenant_id, vehicle_id, event_type, occurred_at, lat, lng, engine_hours)`. Live positions and ETAs are kept in Redis (`live:crew:{crew_day_id}`, `eta:visit:{visit_id}`) with 24-hour TTL and written back to `visit.planned_arrival` history only on material change (> 10 min).

### 7.4 Entity notes and invariants

| Entity | Rules |
|---|---|
| `visit` | `occurrence_key = service_schedule_id + ':' + original_date` is unique per tenant for recurring visits (idempotent materialization). `service_date` must lie within `due_start..due_end` unless an override is recorded in `schedule_change`. `crew_id` and `route_id` are both null or both set once dispatched. Index `(tenant_id, service_date, crew_id)` ([20](20-architecture-security.md)); partial index on `status in ('unscheduled','missed')` for the backlog. Partitioned by `service_date` year for tenants above 1M visits. |
| `visit.detached` | Set true when a user edits date, crew, lock, duration or adds field data to a materialized recurring visit. Regeneration never overwrites detached visits. |
| `crew_day` | Unique `(crew_id, work_date)`. `available_crew_hours` is recomputed when roster, shift or time off changes (from [15](15-team-hr-payroll.md)). `publish_status` in `draft, published, started, completed`. |
| `route_stop` | Contiguous `sequence` starting at 0 per route. Non-visit stops (`break`, `dump`, `supply`, `reload`) reference `site_id` (a depot) or nothing (break). |
| `resource_reservation` | Exclusion constraint: no overlapping `[starts_at, ends_at)` for the same `resource_id` (Postgres `EXCLUDE USING gist`), except reservations with `source = scenario` which live in scenario copies. |
| `schedule_diff` | Status `proposed, partially_applied, applied, discarded, expired`. Applying is a single transaction per diff (or per crew-day batch for diffs over 500 items) with all `visit.rescheduled` events written to the outbox in the same transaction. |
| `schedule_change` | Append-only; partitioned monthly; feeds undo and audit ([20](20-architecture-security.md) audit stream). |
| `employee_skill` | Validity evaluated on the service date. Jurisdiction uses ISO 3166-2 codes (e.g., `US-MN`, `CA-ON`). |
| `blackout` | `scope_type` in `property, crew, resource, branch, company`; `strength` in `hard, soft`. |
| `availability_hold` | Expires after 10 minutes; a sweeper deletes expired rows every minute; holds count against capacity while active. |
| `weather_forecast_hour` | Retained 30 days for forecasts; observation snapshots per visit retained with the visit. |
| Scenario copies | Stored as JSONB snapshots plus `scenario_id`-scoped working rows in a separate schema (`ops_scenario`) so live RLS queries never see them. |

