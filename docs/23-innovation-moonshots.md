# 23 - Innovation and Moonshots

> Rootline's core modules ([03](03-crm-sales-estimating-proposals.md) through [20](20-architecture-security.md)) replace the 5-10 tools a landscape company juggles today. This document goes further. It describes how one platform that holds the **geometry** of every property, the **plants** in it, every **visit**, **photo** and **chemical application**, and the Company's **real books** can do things that a stack of separate tools never can. We specify a portfolio of **33 ambitious bets**: a persistent property digital twin, AR for homeowners and crews, robotic mower fleets, closed-loop smart irrigation, plant health AI, ESG reporting, turf-rebate automation, a "Carfax for landscapes", a homeowner network, a nursery supply exchange, a labor marketplace, embedded fintech, franchise mode, a voice-first crew assistant, generative video, predictive pricing, a self-driving back office, an app and MCP ecosystem, an academy, a community, climate-adaptive planting and more. Each bet states the problem, the concept, the data moat it builds on, technical readiness, dependencies, a phase tag and a "headline demo". We also define the **rails** that MVP and V1 must lay so these bets stay possible. Without those rails, they quietly become impossible. The document ends with an impact-versus-effort prioritization matrix and a narrative of a landscape company running on Rootline in 2031. It matters because software in this category is converging on parity features. The durable advantage goes to the platform whose data compounds, and every bet here is designed to make Rootline's data more valuable each season it is used.

**Related docs:** [Market landscape](01-market-landscape.md) | [Personas and RBAC](02-personas-roles-permissions.md) | [CRM and estimating](03-crm-sales-estimating-proposals.md) | [Scheduling and routing](04-scheduling-dispatch-routing.md) | [Crew app](05-field-crew-mobile-app.md) | [Customer portal](06-customer-portal.md) | [Invoicing](07-invoicing-billing-contracts.md) | [Payments](08-payments-stripe.md) | [Ledger](09-accounting-ledger-integrations.md) | [Design Studio](10-design-studio.md) | [AI design and mockups](11-ai-design-mockups.md) | [Plant Knowledge Base](12-plant-knowledge-base.md) | [Operations and equipment](13-operations-inventory-equipment.md) | [Service lines](14-service-line-modules.md) | [Team, HR and payroll](15-team-hr-payroll.md) | [Marketing and growth](16-marketing-growth-communications.md) | [AI copilot and automation](17-ai-copilot-automation.md) | [Reporting and analytics](18-reporting-analytics.md) | [Platform admin](19-platform-admin-portal.md) | [Architecture and security](20-architecture-security.md) | [UX and sitemaps](21-ux-design-system-sitemaps.md) | [Business model and GTM](22-business-model-pricing-gtm.md) | [Roadmap and feature catalog](24-roadmap-feature-catalog.md)

**Document status:** Proposal v1.0, 2026-11-07. Priority tags: **[MVP]** first sellable release, **[V1]** within about 12 months of MVP, **[V2]** 12-24 months, **[V3]** moonshot, 2+ years. Most bets carry several tags: early "rails" ship at MVP or V1, and the full bet lands later. [24-roadmap-feature-catalog.md](24-roadmap-feature-catalog.md) is the authority if tags conflict.

> **Research basis (as of Nov 2026).** This document reuses sources already gathered and checked in [research/R1](research/R1-field-service-platforms.md), [research/R2](research/R2-landscape-specific-platforms.md) and the sibling module docs (competitor AI, payments and financing, measurement vendors, smart-irrigation APIs, pesticide and heat rules, MCP). The live web-search budget for this writing session ran out before module-specific searches could be done, and several vendor and regulator hosts could not be reached from the research environment. So facts about robotics vendors, emissions and turf rules, drone policy, climate datasets and fintech regulation come from general industry and regulatory knowledge through mid-2026. Those facts are marked **"verify"** and have to be re-checked before anything is committed in a roadmap, pitch or contract. No statistics are invented. Figures we derived ourselves are labeled **estimate**.

---

## Table of contents

1. [Goals and non-goals](#1-goals-and-non-goals)
2. [Market research: the frontier, the complaints, the gap](#2-market-research-the-frontier-the-complaints-the-gap)
3. [Personas and jobs-to-be-done](#3-personas-and-jobs-to-be-done)
4. [Feature specification: the moonshot portfolio](#4-feature-specification-the-moonshot-portfolio)
5. [Key user flows](#5-key-user-flows)
6. [Screens and wireframes](#6-screens-and-wireframes)
7. [Data model](#7-data-model)
8. [Integrations, APIs and events](#8-integrations-apis-and-events)
9. [Permissions](#9-permissions)
10. [AI opportunities across the portfolio](#10-ai-opportunities-across-the-portfolio)
11. [Edge cases, compliance and risks](#11-edge-cases-compliance-and-risks)
12. [Metrics and KPIs](#12-metrics-and-kpis)
13. [Beyond the brief: extra ideas](#13-beyond-the-brief-extra-ideas)
14. [Open questions](#14-open-questions)
15. [Prioritization matrix: impact vs effort](#15-prioritization-matrix-impact-vs-effort)
16. [Rootline in 2031: a narrative](#16-rootline-in-2031-a-narrative)
17. [Sources](#sources)

---

## 1. Goals and non-goals

### 1.1 Goals

| # | Goal | How we will know |
|---|---|---|
| G1 | **Give the founder a ranked, defensible portfolio of big bets** that extend Rootline from "the system of record" to "the system that runs the yard". | 33 bets, each with problem, concept, moat, readiness, dependencies, phase and demo. Ranked in section 15. |
| G2 | **Protect optionality by specifying the rails now.** Each bet names the MVP/V1 data and architecture it needs, such as geotagged photos tied to objects, stable plant-instance IDs and device abstractions. Those rails get built even if the bet itself waits three years. | Every rail appears in section 4.2 and is referenced from the module docs. |
| G3 | **Compound the data moats.** Each bet should make the Property Graph, the Plant Performance Ledger, production rates or the Ledger richer, so the next bet is easier and a copycat starts further behind. | Each card has a "Builds on" line and a "Feeds back" line. |
| G4 | **Make the first slice of every bet estimable.** Engineers get rules, states, validations and edge cases for the first shippable increment, not just the dream. | Section 4 "First slice" blocks; sections 5-9 cover flows, data, events and permissions. |
| G5 | **Create new revenue lines without betraying the core promises**: bring-your-own Stripe, zero markup by default, tenant-owned data, operator neutrality on plant recommendations. | Every monetized bet states its model and the guardrail it respects ([22](22-business-model-pricing-gtm.md)). |
| G6 | **Delight.** At least one bet per persona should make someone say "I didn't know software could do that." Examples: a homeowner walking through their Year-5 garden in AR, a crew lead painting bed lines guided by the phone, an owner waking up to a closed month. | The headline demos in section 4. |

### 1.2 Non-goals

1. **Not a commitment.** This is a portfolio, not a roadmap. Sequencing, staffing and dates live in [24](24-roadmap-feature-catalog.md). A bet can be killed at any readiness gate (section 4.3).
2. **No hardware manufacturing.** Rootline orchestrates robots, sensors, drones and RTK receivers made by others. We may certify or resell partner kits ([V3]), but we will not design mowers or controllers.
3. **No balance-sheet lending, no insurance carrier risk, no money transmission.** Fintech bets are built as referral marketplaces and data rails for licensed partners. Rootline never holds client funds, which is consistent with [08](08-payments-stripe.md).
4. **No autonomous control of safety-critical actions without a human in the loop.** Examples are restricted-use pesticide prescriptions, robot operation in public spaces outside geofences, and irrigation changes that exceed water-budget or ordinance limits.
5. **No cross-tenant data use without explicit opt-in.** Every network bet (benchmarks, marketplace, nursery exchange, Plant Performance Ledger) runs on opted-in, aggregated or explicitly shared data. Thresholds match [22](22-business-model-pricing-gtm.md) section 5.2.
6. **No consumer social network.** The homeowner network is a utility (records, care, requests, payments), not a feed.
7. **No replacement of central-control irrigation systems** for golf and large campuses. Rootline coordinates with those systems; it does not replace them (consistent with [14](14-service-line-modules.md)).

### 1.3 Innovation principles

1. **Data exhaust first.** Prefer bets that turn data crews already create (photos, time, chemical logs, plant installs) into value, over bets that ask crews to do extra work.
2. **Rails before rockets.** Ship the cheap data structures early: stable object IDs, geotags, consent records and device abstraction. These are the hard-to-retrofit parts.
3. **The Company is the hero.** Every network feature strengthens the Company's relationship with its Clients. Nothing lets Rootline or another tenant poach a Client.
4. **Neutral and explainable.** Plant, pricing and vendor recommendations are never for sale. Every AI recommendation shows its evidence.
5. **Earn autonomy.** Automation climbs a trust ladder (suggest, then draft, then act with undo, then act on exceptions) based on measured accuracy per tenant and per task ([17](17-ai-copilot-automation.md)).
6. **Metered, not surprising.** Heavy compute (video, photogrammetry, 3D) uses AI credits, and the cost is estimated before the user commits ([22](22-business-model-pricing-gtm.md) section 4.4).
7. **Kill fast.** Each bet has a readiness gate and a kill criterion. A moonshot portfolio without kills is a wish list.

---

## 2. Market research: the frontier, the complaints, the gap

### 2.1 What competitors do at the frontier (as of Nov 2026, verify)

The landscape and field-service software market is busy at the frontier, but the activity is narrow: AI receptionists, AI copilots over operational data, embedded payments and financing, and measurement add-ons. Nobody is building the physical-world layer (twins, robots, sensors, AR) on top of a joined business system.

| Vendor | Frontier activity we could document | What is missing | Evidence |
|---|---|---|---|
| **Jobber** | Copilot (2024) over historical business data; AI Receptionist; Jobber Voice; Campaign Generator; app marketplace with third-party AI apps; Stripe partnership for financing and instant payouts | No design, plant or property-geometry layer. AI is front-office and analytics only. No robotics, IoT or twin | [R1](research/R1-field-service-platforms.md); [PR Newswire](https://prnewswire.com/news-releases/jobber-launches-copilot-the-first-of-several-ai-powered-products-aimed-at-making-home-service-business-ownership-simpler-than-ever-before-302264047.html); [ACHR News](https://www.achrnews.com/articles/143559-jobber-partners-with-stripe-to-activate-financing-and-instant-payouts-for-home-service-businesses); [Jobber community](https://community.getjobber.com/discussions/operations-forum/just-launched-in-the-app-marketplace-an-ai-dispatcher-that-books-right-into-your/15079) |
| **ServiceTitan (incl. Aspire)** | "Titan Intelligence" and the Atlas agent (Pantheon 2025); Aspire PropertyIntel measurement (from the Go iLawn and LandOne acquisitions); marketplace; built-in consumer financing | Atlas is built for HVAC and plumbing first. PropertyIntel is a separate add-on. No plant intelligence, no twin, no robotics | [ServiceTitan press](https://www.servicetitan.com/press/servicetitan-introducing-the-next-evolution-of-ai-at-pantheon-2025-keynote); [Turf Magazine](https://turfmagazine.com/aspire-announces-launch-of-propertyintel); [Aspire marketplace](https://marketplace.youraspire.com/partners/implementation-services?taxon_id=8) |
| **LMN and SingleOps (Granum)** | AI through partners: Attentive.ai mapping (Feb 2025), Beam AI takeoffs (Feb 2026), "AI crew notes" beta; LMN Pay relaunched on Stripe (Mar 2026); Job Costing Advisor; SingleOps tree inventory | AI is partner-sourced and limited to measurement. Tree inventory is a separate module. No design-to-twin loop | [R2](research/R2-landscape-specific-platforms.md); [Attentive.ai](https://attentive.ai/blog/lmn-and-attentive-ai-announce-strategic-partnership); [Landscape Management](https://www.landscapemanagement.net/lmn-by-granum-launches-new-financial-infrastructure-platform-in-partnership-with-stripe/); [Turf Magazine](https://turfmagazine.com/lmn-introduces-job-costing-advisor-for-landscapers) |
| **Housecall Pro** | Consumer financing through Wisetack; AI features vary by tier | Horizontal home services. No landscape depth | [HCP Help](https://help.housecallpro.com/en/articles/3836042-wisetack-consumer-financing-overview) |
| **Real Green (WorkWave), Service Autopilot (Xplor), Copilot CRM, Yardbook** | Rule-based automation, satellite measurement (Real Green Measurement Assistant), marketing automation | We found no documented generative-AI copilot for Real Green or Service Autopilot as of Nov 2026 (negative finding). No physical-world layer | [R2](research/R2-landscape-specific-platforms.md); [Capterra comparison](https://www.capterra.com/compare/78106-176935/Service-Assistant-vs-SingleOps) |
| **Arborgold, SynkedUP** | Tree/PHC workflows and measurement tool (Arborgold); estimating-first with production rates (SynkedUP) | No twin, IoT or marketplace | [R2](research/R2-landscape-specific-platforms.md) |
| **Measurement specialists** (SiteRecon, Attentive.ai, Beam AI, Deep Lawn) | AI property mapping, takeoffs, geolocated site-audit reports | Measurements live outside the estimate, design and crew map | [R2](research/R2-landscape-specific-platforms.md); [SourceForge LMN vs SiteRecon](https://www.sourceforge.net/software/compare/LMN-vs-SiteRecon) |
| **Consumer design and AR apps** (iScape, Neighborbrite, Yardzen-style services, PRO Landscape+ AI Outdoor Living Designer) | Photo-based AI garden mockups; AR yard visualization; paid online design | Outputs are "conceptual only", not to scale. AR crashes on complex scenes. Install handoff is a referral, not a system | [11](11-ai-design-mockups.md); [AI Tools Bakery](https://aitoolsbakery.com/blog/iscape-review/); [Neighborbrite (App Store)](https://apps.apple.com/app/id6742585344); [Turf Magazine](https://turfmagazine.com/ai-meets-design-prolandscape-unveils-next-gen-tools) |
| **Equipment OEM software** (Husqvarna Fleet Services and Automower Connect, Toro, STIHL connected tools, Kress/Positec fleet apps) | Equipment telematics and robotic-mower fleet apps, each limited to one brand (verify current product names and API access) | Each OEM sees only its own machines. None knows the Company's schedule, Client, contract or job cost | General industry knowledge (verify); [05](05-field-crew-mobile-app.md) mentions Husqvarna Fleet Services |

> **Competitive edge - the frontier is empty where it matters.** Competitors' AI work is concentrated in the office: answering calls, summarizing data and drafting campaigns. The physical layer (what is actually growing, wet, dying, mowed or installed on each property) is either unowned or split across single-brand OEM apps. Rootline is the only platform designed to hold the property geometry ([10](10-design-studio.md)), the plant identity ([12](12-plant-knowledge-base.md)), visit evidence ([05](05-field-crew-mobile-app.md)) and the books ([09](09-accounting-ledger-integrations.md)) in one graph. Every bet below uses that joined graph, and a competitor would need three acquisitions and a re-platform to match it.

### 2.2 Adjacent technology readiness (as of mid-2026, verify)

We rate readiness with a simplified **Technology Readiness Level (TRL)** scale: 1-3 research, 4-6 prototypes and pilots, 7-9 proven in production. "Rootline TRL" means how ready the technology is for *our* use case, not in general.

| Technology | State of the art (summary) | Rootline TRL | Implication |
|---|---|---|---|
| **Commercial robotic mowers** | Wire-free RTK/GNSS robots for large turf (Husqvarna CEORA and EPOS virtual boundaries; Kress RTKn by Positec; consumer-grade Segway Navimow and Mammotion); autonomous ride-on/zero-turn platforms and retrofit kits (Scythe M.52, Greenzie, Electric Sheep); OEM fleet portals (verify all models and availability) | 6-7 | Integrate, don't build. Value is in orchestration, job costing and ROI planning |
| **AR on phones** | ARKit/ARCore with LiDAR depth on Pro iPhones and iPads; geospatial anchoring (ARCore Geospatial API, ARKit location anchors) in covered areas; USDZ/GLB Quick Look | 7 for previews; 5 for cm-accurate layout without RTK | Homeowner preview is ready now. Crew layout needs RTK or control points |
| **Consumer/prosumer RTK GNSS** | Bluetooth RTK receivers with NTRIP correction services give roughly centimeter-level horizontal accuracy in open sky (verify vendor specs); degraded under tree canopy | 6 | Viable for stakeout. Canopy and multipath are the main edge cases |
| **Drone photogrammetry** | Mature: orthomosaics, DSMs, point clouds and meshes via commercial (Pix4D, DroneDeploy) and open-source (OpenDroneMap) pipelines; Gaussian splatting gives photoreal 3D ([3DGS paper](https://arxiv.org/abs/2308.04079)); US Part 107 and Remote ID, Canadian drone certificates | 7 | Feasible. Regulation, pilot labor and OEM availability are the constraints |
| **Segmentation and depth** | SAM-family promptable segmentation ([SAM 2](https://arxiv.org/abs/2408.00714)); monocular metric depth ([Depth Anything V2](https://arxiv.org/abs/2406.09414), [Depth Pro](https://arxiv.org/abs/2410.02073)) | 7 | Powers change detection, mockups and twin registration |
| **Generative video** | Text/image-to-video models with strong coherence (e.g., Google Veo 3, OpenAI Sora 2, Runway; verify current versions and API terms) | 5 for faithful-to-design walkthroughs | Must condition on our own 3D render to stay truthful. Cost per second is still high |
| **Plant ID and disease detection** | Plant ID APIs (Pl@ntNet, Kindwise plant.id with health assessment; verify terms); research datasets such as PlantVillage generalize poorly from lab to field | 5-6 for ornamentals in the field | Use as triage plus expert-in-the-loop, never as an autonomous prescriber |
| **IoT soil moisture and weather** | Cheap LoRaWAN and cellular soil moisture probes; personal weather stations with APIs; smart controllers with APIs (Hydrawise, Rachio, Rain Bird IQ4; [14](14-service-line-modules.md)) | 7 | Closed loop is technically easy. Trust, liability and sensor upkeep are the hard parts |
| **Voice AI** | Real-time speech-to-text and text-to-speech with good Spanish; LLM intent parsing; noisy outdoor audio still hard | 6 | Push-to-talk with Bluetooth headsets beats wake words next to a 60-inch mower |
| **Agentic LLMs and MCP** | Frontier models (Claude family) run multi-step tool use. Model Context Protocol is a cross-vendor standard for connecting tools to AI ([MCP specification](https://modelcontextprotocol.io/specification)) | 7 | Autopilot and the ecosystem are feasible on the Action Layer ([17](17-ai-copilot-automation.md)) |
| **Climate projections** | USDA's 2023 Plant Hardiness Zone Map update shifted roughly half of the US a half-zone warmer; downscaled CMIP6 projections (e.g., NASA NEX-GDDP-CMIP6, LOCA2) are public (verify) | 6 | Climate-adaptive palettes are a curation and UX problem more than a science problem |

### 2.3 Regulatory and market tailwinds (verify each before use)

| Tailwind | What it is | Bet it powers |
|---|---|---|
| **California small off-road engine (SORE) rules** | AB 1346 (2021) directed CARB to require zero-emission small off-road engines. Under CARB's rules, most new small engines, including lawn and garden equipment, must be zero-emission starting with model year 2024, and portable generators follow later. Existing gas equipment can still be used. CARB has said that one hour of commercial leaf blower use produces smog-forming emissions comparable to driving a passenger car roughly 1,100 miles ([CARB SORE program](https://ww2.arb.ca.gov/our-work/programs/small-off-road-engines-sore), verify figure and dates) | M-06 Electrification planner, M-09 ESG |
| **Local gas leaf-blower restrictions** | A growing patchwork of city and county restrictions on the sale or use of gas leaf blowers (examples often cited: Washington, DC; many California cities; Montgomery County, Maryland; verify each jurisdiction's scope and effective dates) | M-06 |
| **Nonfunctional turf rules** | Nevada AB 356 (2021) prohibits Colorado River water for nonfunctional turf in the Las Vegas Valley from 2027. California AB 1572 (2023) phases out potable irrigation of nonfunctional turf on commercial, institutional, industrial, government and HOA common areas from about 2027 into the early 2030s. Colorado restricts nonfunctional turf in new commercial developments (SB24-005) (verify all scopes and dates) | M-10 Turf rebate automation, M-07, M-09 |
| **Turf-replacement rebates** | Many water utilities pay per square foot to replace lawn with water-wise landscape, for example SoCal Water$mart (Metropolitan Water District member agencies) and Southern Nevada Water Authority's Water Smart Landscapes (verify current rates and rules) | M-10 |
| **Corporate climate disclosure** | California SB 253 (Scope 1-3 emissions disclosure for large companies doing business in California) and SB 261 (climate-risk reports); the EU CSRD affects multinational property owners (verify phase-in dates, which have shifted) | M-09 ESG reporting for commercial Clients |
| **Wildfire mitigation** | California's 100-foot defensible space law (PRC 4291) and the ongoing "Zone 0" ember-resistant rulemaking (AB 3074); the insurance regulator's "Safer from Wildfires" discount framework (verify status) | M-27 Wildfire-ready landscapes |
| **Heat illness rules** | Cal/OSHA outdoor heat rules (shade at 80 F, high-heat procedures at 95 F) ([Ogletree](https://ogletree.com/insights/the-heat-is-on-in-california-cal-oshas-heat-illness-prevention-requirements-for-outdoor-work-sites/)); state rules elsewhere; a proposed federal OSHA heat standard (status uncertain, verify) | M-31 Heat-safe crews |
| **Labor scarcity** | The H-2B seasonal visa program has a statutory annual cap ([DOL H-2B](https://www.dol.gov/agencies/whd/immigration/h2b)), and landscaping is consistently among its largest users (verify current share). Workers are tied to the petitioning employer | M-05 Robotics, M-15 Labor marketplace, M-20 Voice |
| **Climate zone shift** | USDA's 2023 hardiness map shifted many areas a half-zone warmer ([USDA PHZM](https://planthardiness.ars.usda.gov/)) | M-11 Climate-adaptive planting |
| **Open AI tool standards** | MCP has been adopted across major AI vendors (verify governance status) | M-24 App marketplace and MCP |

### 2.4 What users complain about (that these bets answer)

The module docs and research reports collected these pain points. They are summarized here only where a moonshot is the answer.

| Pain point | Who | Source | Bet that answers it |
|---|---|---|---|
| "Measurements live in a different product from the estimate, the design and the crew's map." | Estimators, owners | [R2](research/R2-landscape-specific-platforms.md) executive summary | M-01 Twin, M-02 Drone |
| AI garden design apps are "conceptual only, not precise measurements or construction drawings"; AR crashes on complex designs | Homeowners, designers | [11](11-ai-design-mockups.md); [AI Tools Bakery](https://aitoolsbakery.com/blog/iscape-review/) | M-03 AR, M-21 Video |
| AI receptionists "cannot handle the messy cases" and have no context about the property or design | Office managers | [R1](research/R1-field-service-platforms.md) P15; [TechRadar](https://www.techradar.com/pro/software-services/jobber-crm-review) | M-23 Autopilot (context-rich), M-13 Homeowner app |
| Payments, card vaults and financing are locked to the vendor | Owners | [R1](research/R1-field-service-platforms.md) section on payments pattern | M-16-M-18 fintech built on BYO Stripe and partner neutrality |
| Contractors re-key controller data, keep zone maps on paper and retype backflow results | Irrigation techs | [14](14-service-line-modules.md) | M-07 Closed-loop irrigation, M-12 Passport |
| Office staff shortage; "short on office staff, not short on software" | Owners | [17](17-ai-copilot-automation.md) | M-23 Autopilot |
| Labor is the largest cost line and the hardest constraint | Owners | [Aspire blog](https://www.youraspire.com/blog/landscaping-labor-percentage-of-revenue) | M-05, M-15, M-20, M-22 |
| Survey: 43% of commercial landscape leaders believe in AI, but only 15% use it daily (vendor-run survey) | Commercial owners | [R2](research/R2-landscape-specific-platforms.md) | All. Adoption has to be ambient (photos, voice), not a new chore |
| Plant availability arrives as emailed spreadsheets; substitutions break designs | Designers, purchasers | [17](17-ai-copilot-automation.md) nursery-sheet agent; [13](13-operations-inventory-equipment.md) | M-14 Nursery network |

### 2.5 The gap we exploit

1. **The joined Property Graph.** Geometry (Design), objects (plants, heads, fixtures, hardscape), time (visits, photos, applications) and money (estimates, invoices, job costs) live in one tenant-scoped graph. Competitors own one or two of the four.
2. **A curated, region-aware plant brain.** The operator-curated Plant KB, with Region Profiles ([12](12-plant-knowledge-base.md)), turns raw imagery into horticultural meaning: "that is a 'Limelight' hydrangea in zone 6a, planted in May 2027, under warranty until May 2028".
3. **True books.** The built-in double-entry Ledger ([09](09-accounting-ledger-integrations.md)) makes underwriting, ESG cost allocation, franchise royalties and predictive pricing trustworthy. Spreadsheet-grade data cannot do this.
4. **Neutral money rails.** BYO Stripe means fintech bets are a marketplace of partners and never a lock-in tax. That trust is what lets a Company share its books with a lender through Rootline.
5. **Seasonal repetition.** Landscaping revisits the same property 20 to 40 times a year (for example, weekly mowing from April to November is about 30 visits). No other trade gets so many observations of the same asset. Our twin, plant-performance and pricing models feed on that repetition.

---

## 3. Personas and jobs-to-be-done

Moonshots touch every persona from [02](02-personas-roles-permissions.md) and introduce several **external participants**. External participants are not tenant users. They are network partners with scoped, contractual access.

| Persona (role key) | Job-to-be-done in the moonshot era | Bets |
|---|---|---|
| Business Owner (`owner`) | "Run a $3M company with the office headcount of a $1M company." "Know my real numbers, borrow on them, and plan my fleet's transition." | M-16, M-17, M-18, M-22, M-23, M-06, M-19 |
| Office / Admin Manager (`office_manager`) | "Handle the exceptions; let the system do the routine." | M-23, M-10, M-24 |
| Sales Rep / Estimator (`estimator`) | "Walk a property once, leave with a measured model, a price I trust and a video the client will share." | M-01, M-02, M-21, M-22 |
| Landscape Designer (`designer`) | "Design with plants that will still thrive in 2045, that are in stock now, and show it in the client's yard." | M-03, M-11, M-14, M-29 |
| Operations / Account Manager (`ops_manager`) | "Know the condition of 140 commercial properties without driving to them; prove our value to property managers." | M-01, M-07, M-09, M-05 |
| Crew Lead / Foreman (`crew_lead`) | "Lay out a bed exactly as designed without a tape measure argument; get answers hands-free." | M-04, M-20, M-31 |
| Field Technician (`technician`) | "Speak Spanish to my phone with gloves on and have it do the paperwork; stay safe in the heat." | M-20, M-31, M-25 |
| Bookkeeper / Accountant (`bookkeeper`) | "Close the month in two days; give the lender a clean package without a week of exports." | M-23, M-16 |
| Subcontractor (`subcontractor`) | "Find steady overflow work from reputable Companies and get paid fast." | M-15 |
| Residential homeowner (`client_residential`) | "See my future yard, keep my home's landscape records, and sell my house with them." | M-03, M-12, M-13, M-08 |
| Commercial property manager (`client_commercial`) | "Report water saved and emissions avoided to my ESG team; get rebates and comply with turf bans." | M-09, M-10, M-07, M-28 |
| Platform Operator (`platform_owner`) | "Grow a network, not just a SaaS, without compromising tenant trust." | All. Governance in [19](19-platform-admin-portal.md) |
| Plant curator (`platform_curator`) | "Turn thousands of real-world installs into better Region Profiles and climate-ready palettes." | M-11, M-29, M-08 |
| Platform finance (`platform_finance`) | "Run partner programs (lenders, insurers, nurseries) with clean attribution and compliance." | M-14, M-16-M-18, M-24 |
| Platform engineer (`platform_engineer`) | "Integrate robots, sensors and partner APIs safely, without a separate code path per vendor." | M-05, M-07, M-24 |
| Platform support (`platform_support`) | "Diagnose a misbehaving sensor or robot integration from the console." | M-05, M-07 |
| **External: nursery partner** | "Publish availability once and get orders from every Rootline designer in my delivery radius." | M-14 |
| **External: lender / insurer partner** | "Get consented, verified operating data to price risk on a seasonal business." | M-16, M-17, M-18 |
| **External: robot or sensor OEM** | "Get my machines scheduled and billed inside contractors' real workflows." | M-05, M-07 |
| **External: water utility / municipality** | "Receive complete, verified rebate applications and compliance data, not shoebox submissions." | M-10, M-28 |
| **External: franchisor** (organization admin) | "Standardize price books and brand, roll up KPIs and royalties across 80 locations." | M-19 |
| **External: app developer** | "Build on Rootline's API and MCP server and reach thousands of landscape companies." | M-24 |
| **External: real estate agent and home buyer** | "Know what is in the yard, under it and what has been applied to it before closing." | M-12 |

---
