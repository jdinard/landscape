# 16 - Marketing, Growth and Communications

> Rootline's Growth module turns a landscape company's operational truth into demand, and then carries every conversation with prospects and clients through one compliant, AI-assisted communications layer. It contains a landscape-specific **website builder** (service-area pages, an automatic project gallery built from consented job photos, plant pages fed by the [Plant Knowledge Base](12-plant-knowledge-base.md)), **online booking with instant quotes** priced from aerial-measured turf area, the **"See your yard redesigned" AI lead magnet** (powered by [AI Design and Mockups](11-ai-design-mockups.md)), **lead marketplace ingest** (Google Local Services Ads, Angi, Thumbtack), **source attribution down to ledger-grade revenue**, **segments, campaigns, drips, newsletters and a win-back/upsell engine**, **reviews, NPS and referrals**, **route-aware neighborhood marketing** (QR door hangers, neighbor postcards, USPS EDDM), **social auto-posting of before/afters**, a **unified inbox** (SMS, email, web chat, Facebook/Instagram DMs, calls, portal and marketplace messages) with assignment and SLAs, an **AI receptionist** that answers the phone 24/7, **call tracking**, and the compliance plumbing most competitors leave to the customer: **per-tenant 10DLC registration, a TCPA/CASL consent ledger, quiet hours and opt-out handling**. It also owns every **transactional client message** (reminders, on-my-way, visit summaries, invoice notices) and the **notification template and localization system** the rest of the platform uses. It matters because today a typical landscaper stitches together a website builder, a review tool, a call-tracking vendor, an email tool, a texting tool and a lead marketplace inbox, none of which knows what was mowed yesterday, what the client owes, or which plants thrive on that street. Rootline's marketing knows all of it.

**At a glance**

- **What it is:** the Growth module. It covers the website builder, lead capture, online booking with instant quotes, the homeowner AI visualizer, lead-marketplace ingest and attribution, segments, campaigns and journeys, reviews, NPS and referrals, neighborhood marketing, social posting, the unified inbox, the AI receptionist and call tracking. It also owns the compliance layer (per-tenant 10DLC, consent ledger, quiet hours) and every transactional client message and template the platform sends.
- **Decision 1, compliance is a product feature:** each Company gets its own 10DLC brand and campaign, a consent ledger with evidence per contact, channel and purpose, natural-language opt-out detection and strictest-rule quiet hours. A marketplace inquiry or inbound call permits a reply, never marketing ([4.20](#420-10dlc-brand-and-campaign-registration-per-tenant-mvp), [4.21](#421-consent-preferences-and-messaging-compliance-tcpa-can-spam-casl-mvp)).
- **Decision 2, marketing grounded in operations:** campaigns quote personal prices from measured turf and bed areas, route days and installed plants, and ROI is measured to collected revenue and job-costed margin in the built-in Ledger, with spend posted under the rules [09](09-accounting-ledger-integrations.md) owns ([4.5](#45-lead-sources-attribution-and-roi), [4.25](#425-ledger-and-payments-touchpoints-mvp-core-v1-automation)).
- **Decision 3, Leads flow into 03:** this module creates and enriches Leads; Opportunities, pipeline stages, Estimates and Proposals belong to [03](03-crm-sales-estimating-proposals.md).
- **Decision 4, metering follows [22](22-business-model-pricing-gtm.md):** AI actions cost published AI credits (a website visualizer preview set is 24 credits from the Company's pool under a widget cap, default 600 a month). AI receptionist minutes have their own `voice_ai_minutes` meter (add-on $49 a month with 100 minutes, then $0.39 a minute; Pro includes 200). SMS uses segment allowances (500 / 2,500 / 8,000 on Starter / Grow / Pro) with $0.02 overage; inbound SMS is free.
- **Decision 5, client money stays with the Company:** booking deposits, gift certificates and tips are direct charges on the Company's own Stripe account ([08](08-payments-stripe.md)); Rootline never holds client funds.
- **MVP:** unified inbox (SMS, email, web chat, calls and voicemail, portal), forms and embeddable widgets, marketplace email-parser ingest with dedupe, source attribution and ROI, segments, one-off email and SMS campaigns with price blocks, prebuilt journeys, review requests and NPS, call tracking and missed-call text-back, per-tenant 10DLC, consent and quiet hours, lifecycle messages, the EN/ES template system, sending-domain DNS, and the website visualizer widget behind a verify-first gate for design partners.
- **Later:** [V1] website builder, online booking with instant quotes, the AI receptionist, the referral program, native Google LSA and Angi APIs, the journey builder, newsletters, direct mail, the win-back engine, neighborhood marketing, social posting, the growth copilot and gift certificates; [V2] WhatsApp, French-Canadian templates and requested outbound AI callbacks. Tags follow [24](24-roadmap-feature-catalog.md) section 4.6, which is binding where this doc's earlier proposals differ.
- **Differentiators:** personal prices in every campaign, a design-led lead magnet that delivers leads with photos and dimensions, route-aware neighbor marketing, ROI to the ledger, and compliance plumbing that competitors leave to their customers.
- **Key cross-links:** pipeline and pricing engine in [03](03-crm-sales-estimating-proposals.md); visualizer engine in [11](11-ai-design-mockups.md); meters and packaging in [22](22-business-model-pricing-gtm.md); automation and agents in [17](17-ai-copilot-automation.md); posting rules in [09](09-accounting-ledger-integrations.md); preference center in [06](06-customer-portal.md); permission keys in [02](02-personas-roles-permissions.md).

**Document status:** Proposal, 2026-11-07. Priority tags: [MVP] first sellable release, [V1] within ~12 months of MVP, [V2] 12-24 months, [V3] moonshot.

**Related docs:** [CRM, Sales, Estimating, Proposals](03-crm-sales-estimating-proposals.md) (owns Lead/Opportunity pipeline), [Scheduling](04-scheduling-dispatch-routing.md) (capacity, routes, weather), [Crew App](05-field-crew-mobile-app.md) (photos, on-my-way, door hangers), [Customer Portal](06-customer-portal.md) (preference center, portal messages), [Invoicing](07-invoicing-billing-contracts.md), [Payments](08-payments-stripe.md), [Ledger](09-accounting-ledger-integrations.md), [AI Design and Mockups](11-ai-design-mockups.md), [Plant KB](12-plant-knowledge-base.md), [Service Lines](14-service-line-modules.md), [AI Copilot and Automation](17-ai-copilot-automation.md) (automation engine shared with journeys), [Reporting](18-reporting-analytics.md), [Platform Admin](19-platform-admin-portal.md), [Architecture and Security](20-architecture-security.md), [UX and Design System](21-ux-design-system-sitemaps.md), [Pricing and GTM](22-business-model-pricing-gtm.md).

---

## Table of contents

1. [Goals and non-goals](#1-goals-and-non-goals)
2. [Market research](#2-market-research)
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

| # | Goal | How we will know (target, internal estimate) |
|---|------|------|
| G1 | A new Company has a fast, good-looking, SEO-ready website live on its own domain in under 30 minutes, generated from its Rootline profile ([V1]). | Median time from "Create site" to "Published on custom domain" under 30 min; 70% of tenants with Sites enabled publish within 60 days. |
| G2 | Prospects can get a **firm** price and book recurring lawn service online without a site visit for standard properties ([V1]). | At least 60% of residential mowing inquiries in supported regions receive an auto-priced instant quote; repricing after first visit under 3%. |
| G3 | Every inbound lead, from any channel, lands in one inbox and gets a first response in minutes, day or night. | Median speed-to-first-response under 2 minutes (AI or human) across channels; missed-call rate under 5% for tenants with AI receptionist. |
| G4 | Owners can see which marketing dollars produce **profitable** work, using revenue and margin from the built-in [Ledger](09-accounting-ledger-integrations.md), not just "leads". | Attribution coverage (leads with a known source) at least 90%; campaign ROI report reconciles to GL revenue within 1%. |
| G5 | Turn the existing client base into the cheapest growth channel: reviews, referrals, upsells and neighbors. | Review requests sent after at least 80% of eligible completed jobs; referral program live at 40% of tenants within 12 months of its V1 launch; upsell revenue tracked per campaign. |
| G6 | Make messaging compliance invisible but airtight: 10DLC registration, consent evidence, opt-outs, quiet hours, recording disclosures. | 95% of US tenants with approved 10DLC campaign within 10 business days of signup (dependent on carriers); zero sends to opted-out recipients (hard invariant). |
| G7 | Provide all platform modules with one notification and template system that is localized (English and Spanish at launch), brandable and auditable. | 100% of client-facing messages rendered through the template service; Spanish coverage of all platform default templates at MVP. |

### 1.2 Non-goals

- **Not a full digital-advertising agency.** Rootline will not run bid management for Google Ads or Meta Ads at MVP. We ingest spend, capture click IDs, upload offline conversions [V1] and recommend budgets [V2], but campaign creation inside ad platforms is out of scope until [V2] (see 4.5.2-4.5.3 for what we do instead).
- **Not a general-purpose CMS.** The website builder is opinionated for landscape companies. No arbitrary plugins, no custom server code, no e-commerce of physical goods beyond service booking and gift certificates ([V1], sold as gift credits owned by [07](07-invoicing-billing-contracts.md); see 4.25).
- **Not an enterprise contact center.** The AI receptionist and phone system target 1-60 seat companies. We will not build workforce management, predictive dialers or outbound call campaigns.
- **No outbound robocalls, ringless voicemail drops or cold texting.** These carry TCPA exposure that a small business cannot afford (see Section 11). Neighbor outreach uses mail and door hangers, not SMS.
- **No resale of a Company's own leads.** Leads that arrive through a Company's website, widget, phone numbers, campaigns or marketplace accounts belong to that Company; Rootline never resells them or routes them to another Company. The one Rootline-run lead channel is **Rootline Match** [V1], owned by [22](22-business-model-pricing-gtm.md) section 5.3: leads from Rootline's own homeowner app (Rootline Home) are offered exclusively to one subscribing Company first and never to more than 3, with the homeowner's consent, and priced per accepted lead. A Company's widget sends a visitor to Match only with the visitor's consent and the hosting Company's setting. Cross-tenant referral exchange between Companies is a carefully bounded [V3] idea in Section 13.
- **Not the owner of the sales pipeline.** Leads, Opportunities, Estimates and Proposals are specified in [03](03-crm-sales-estimating-proposals.md). This module creates Leads and enriches them; it does not define pipeline stages.

---

## 2. Market research

> **Research note.** Facts below are cited to vendor pages, help centers, review sites, trade press and regulators. Prices and plan names are marked "as of Nov 2026, verify". Verification note: items labeled "background, verify" (state "mini-TCPA" rules, Texas's 2025 extension of its telephone-solicitation law to texts, Canadian telemarketing hours, Global Privacy Control, carrier blocking of unregistered traffic, branded-sender channels) come from general knowledge, are listed separately under background references in Sources, and need first-hand confirmation (and counsel review for any tenant-facing compliance claim) before build.

### 2.1 What competitors do

| Vendor | Website and booking | Campaigns and drips | Reviews and referrals | Phones, inbox, AI receptionist | Notes |
|---|---|---|---|---|---|
| **Jobber** | Website builder bundled; lead forms and online booking flow into Jobber ([Jobber lawn care](https://www.getjobber.com/industries/lawn-care-software/)). | **Marketing Suite** = Campaigns + Reviews + Referrals, listed at $79/mo or each tool separately (as of Nov 2026, verify). June 2026 update: AI builds a **Marketing Plan** from services, job history and schedule; owner approves before sending ([Jobber product update](https://productupdates.getjobber.com/148754-marketing-suite-just-got-more-powerful), [Marketing Suite](https://www.getjobber.com/features/marketing-suite/)). Prompt-to-email campaign generator ([Campaigns](https://www.getjobber.com/features/marketing-tools/campaigns/)). | Automatic review requests by text or email; referral credits applied automatically to the referrer's next service; dashboard of referred leads, jobs and revenue ([Referrals](https://getjobber.com/features/marketing-tools/referrals)). | **AI Receptionist** add-on; price is inconsistent across Jobber pages ($29 vs $99/mo) and included usage is unclear; inbound only ([Carly review](https://www.usecarly.com/blog/jobber-ai-receptionist/), [pricing analysis](https://sagnikbhattacharya.com/blog/lawn-care-software-pricing-small-crew)). Plus plan includes Facebook social posting ([Plus plan](https://help.getjobber.com/hc/en-us/articles/29668508840727-The-Plus-Plan)). | Strongest marketing story among SMB field-service tools, but generic across trades; add-ons stack up ("can quietly push your monthly bill past $600" per [Carly](https://www.usecarly.com/blog/jobber-ai-receptionist/)). |
| **Housecall Pro** | Online booking, website offerings. | Email and **postcard** campaigns; fall 2025 release added postcard targeting by ZIP code or demographic segment ([TechEdge AI](https://techedgeai.com/housecall-pro-rolls-out-fall-2025-ai-powered-update-to-supercharge-home-service-businesses/), [automated marketing](https://www.housecallpro.com/features/automated-marketing/)). | Automated review requests after job completion. | **CSR AI**: optional add-on, 24/7 call answering, call summaries and notifications; the bot identifies itself as AI at the start of each call ([CSR AI overview](https://help.housecallpro.com/en/articles/9740104-csr-ai-overview)); "Tell me more" surfaces job history and balances ([Mechanical Hub](https://mechanical-hub.com/housecall-pro-unveils-major-ai-powered-updates/)). | Home-services generalist; lawn and landscape are secondary verticals ([MowBoss review](https://mowbosshq.pages.dev/guides/housecallpro-review)). |
| **ServiceTitan** | Enterprise; marketing via Marketing Pro. | Marketing Pro Ads with **dynamic call tracking** and campaign attribution; Google call-extension calls must last at least 15 seconds to attribute, and attribution can take up to 4 hours to appear ([call extensions](https://help.servicetitan.com/how-to/manage-call-extensions), [phone integrations](https://help.servicetitan.com/docs/phone-integrations-in-servicetitan)). | Reputation features in Marketing Pro. | **Contact Center Pro**: universal inbox, AI Voice Agents for 24/7 answering and booking, AI transcripts, summaries, sentiment, "Second Chance Leads" for unbooked calls ([call tracking overview](https://help.servicetitan.com/roofing/docs/call-tracking-and-recording-overview-in-contact-center-pro-and-servicetitan.md)). | Gold standard for attribution-to-revenue in HVAC/plumbing; priced and staffed for large shops. |
| **RealGreen (WorkWave)** | Customer Assistant website module; **Measurement Assistant** measures properties from satellite imagery and sends instant quotes without a site visit; measurements save to the customer record ([Measurement Assistant](https://www.realgreen.com/measurement_assistant.html), [satellite measuring](https://realgreen.com/blog/how-to-accurately-measure-lawn-size-using-satellite-imagery)). | Marketing modules layered on Service Assistant; modular quote-based pricing, implementation fee reported around $995 (unverified, [LawnStarter](https://lawnstarter.com/blog/?p=52273)). | Available via modules. | Telephony via integrations. | Deepest lawn-care (chemical program) heritage; acquired by WorkWave. |
| **Service Autopilot (Xplor)** | Online booking. | Known for **automated email and text drips, win-back sequences and seasonal upsells**, but reviewers note "once configured" is doing heavy lifting and the learning curve is steep ([MowBoss review](https://mowbosshq.pages.dev/guides/service-autopilot-review), [Capterra](https://www.capterra.com/p/122075/Service-Autopilot/reviews/?page=3)). | Review collection. | Integrations. | Pricing reported $279-$849/mo flat (as of Apr 2026, verify) ([Software Review](https://softwarereview.com/s/service-autopilot)). Polarizing support reputation post-acquisition. |
| **LawnStarter (consumer marketplace)** | Instant quote from **satellite imagery of mowable area**, presented as a firm price; under 0.2% of mowing jobs needed repricing in the prior 12 months per the company ([How the instant quote works](https://www.lawnstarter.com/blog/lawnstarter/how-does-lawnstarter-instant-quote-work/), [FAQ](https://www.lawnstarter.com/faq)). | Marketplace, not a tool for Companies. | Marketplace reviews. | n/a | Proves homeowners accept firm, satellite-based pricing. Competes with our tenants for the same homeowners. |
| **Deep Lawn** | Satellite-measured instant quote **widget** for lawn-care websites; reported $75-$95/mo and requires a separate CRM ([extruct profile](https://www.extruct.ai/hub/deeplawn-com), [MyQuoteIQ comparison](https://myquoteiq.com/best-ai-estimating-software-lawn-care-2026/)). | No | No | No | Point tool. Validates demand for the feature. |
| **Angi / Thumbtack / Google LSA** | Lead marketplaces. | n/a | Platform-native reviews. | Angi pushes leads in real time as JSON to a partner webhook ([Angi lead integration API](https://intercom.help/angi/en/articles/15304819-angi-lead-integration-api)); Google LSA lead data is exposed read-only through the Google Ads API ([Google Ads API LSA](https://developers.google.com/google-ads/api/docs/campaigns/local-service-campaigns)). | Companies pay per lead and juggle each portal separately. |
| **LMN, Aspire, SingleOps, Arborgold, SynkedUP** | Landscape-specific estimating/ERP leaders (see [01](01-market-landscape.md) and [R2](research/R2-landscape-specific-platforms.md)). | Marketing is not their center of gravity; most rely on integrations or partner tools. Not individually verified for this doc; verify before sales comparisons. | | | Hypothesis to validate in customer interviews: commercial-maintenance shops on these platforms run most marketing outside them. |
| **Yardbook, Copilot CRM** | Low-cost/free lawn tools. One vendor comparison states Yardbook offers no online booking ([MyQuoteIQ](https://myquoteiq.com/best-jobber-alternative-for-landscaping-companies/), unverified). | Basic | Basic | Basic | Price-led; little marketing depth. |
| **Point tools** (Podium, NiceJob, Birdeye, CallRail, Mailchimp, Wix/Squarespace) | Each solves one slice. | | | | The "5-10 tool" sprawl Rootline replaces. None knows the route, the ledger or the plants. |

### 2.2 What users complain about

1. **Canned, inflexible messaging.** A reviewer who left Jobber for LawnPro summarized it as "very good program, cost was very high, only canned text messages" ([Capterra LawnPro reviews](https://www.capterra.com/p/105508/LawnPro/reviews/?page=2)). Landscapers want messages that mention the actual service, the actual crew and the actual yard.
2. **Powerful automation that nobody can configure.** Service Autopilot's drips are its strongest feature and its biggest frustration: "once configured" is the catch ([MowBoss](https://mowbosshq.pages.dev/guides/service-autopilot-review)). Owners do not have a marketing operations person.
3. **Add-on creep and opaque AI pricing.** Jobber's AI Receptionist shows different prices on different pages and does not state included minutes ([Jobber community thread](https://community.getjobber.com/discussions/spring-feature-announcement/customer-q-ai-receptionist-is-the-pricing-im-seeing-on-my-grow-plan-permanent-/2436), [pricing analysis](https://sagnikbhattacharya.com/blog/jobber-ai-receptionist-pricing-one-van-plumber)).
4. **Lead marketplace chaos.** Duplicate leads when both the Angi API and the email parser are enabled ([ClientTether Angi guide](https://support.clienttether.com/home-advisor/)); Google LSA's move to the Google Ads API dropped fields some developers relied on, such as the consumer phone number ([Google Ads API forum](https://groups.google.com/g/adwords-api/c/PP7d0bCOGKg)).
5. **Attribution that stops at the phone call.** Even best-in-class tools attribute calls hours after the fact and count Google call-extension calls only if they last 15+ seconds ([ServiceTitan](https://help.servicetitan.com/how-to/manage-call-extensions)). Few SMB tools connect a campaign to collected revenue and gross margin.
6. **Channels disappear under you.** Google shut down Business Profile chat (new chats stopped July 15, 2024; fully removed July 31, 2024) along with call history in GBP ([9to5Google](https://9to5google.com/2024/05/28/google-business-messages-shutting-down/), [DAC Group](https://dacgroup.com/local-search-news/google-sunsetting-business-profile-call-history-chat)). Companies that built workflows on it had to rebuild.
7. **Compliance anxiety.** 10DLC registration rejections and carrier filtering ([DEV community guide](https://dev.to/alfredo_romero_fc4afdcb68/a2p-10dlc-survival-guide-for-voice-agencies-2026-carrier-filtering-is-now-real-time-29mp)), shifting TCPA rules (the FCC's one-to-one consent rule was vacated on January 24, 2025 ([Morrison Foerster](https://mofo.com/resources/insights/250130-eleventh-circuit-vacates-fcc-s-tcpa-one-to-one-consent-rule)); revocation rules changed again in fall 2026 ([Crowell](https://www.crowell.com/en/insights/client-alerts/fcc-officially-adopts-amendments-to-tcpa-rules))), and Google's enforcement against incentivized or gated reviews ([DAC Group](https://www.dacgroup.com/?p=159133), [Podium on review gating](https://www.podium.com/article/review-gating)).

### 2.3 The gap Rootline exploits

1. **Marketing grounded in operations.** Rootline knows each property's measured turf area, bed area, irrigation zones, installed plants, route day, crew, open AR and last service. That makes **personalized prices in every campaign** ("Core aeration for your 6,200 sq ft lawn: $112, Tuesday route") and **route-aware neighbor marketing** possible. Generic tools cannot do this.
2. **A design-led lead magnet no competitor has.** "See your yard redesigned", the marketing name for the Company-branded "Dream Yard Visualizer", uses Rootline's region-aware plant palettes and mockup engine ([11](11-ai-design-mockups.md), [12](12-plant-knowledge-base.md)). It converts a website visitor into a qualified design lead with a photo, an address and a style preference.
3. **ROI to the ledger.** Because the [Ledger](09-accounting-ledger-integrations.md) is built in, campaign ROI uses collected revenue and job-costed gross margin, and marketing spend can come from tagged GL expenses, not a manually typed budget.
4. **Compliance as a product.** Per-tenant 10DLC registration with auto-generated website opt-in language, a consent ledger with evidence, natural-language opt-out detection and strictest-rule quiet hours across federal, state and Canadian rules. Field-service suites that offer built-in texting generally register their own numbers for their customers. But in the product pages we reviewed, none presents per-message consent evidence, cross-channel natural-language revocation or state-by-state quiet-hour logic as a feature, so tenants carry that risk themselves (verify per competitor before sales use).
5. **One price, no add-on maze.** The inbox, review requests and basic campaigns come with the plan, and every add-on price is published (the website builder is a $49 add-on on Starter and Grow and included on Pro). Usage-heavy items are metered transparently on published meters: AI credits for AI actions, `voice_ai_minutes` for the AI receptionist, SMS segments, and mail pieces at the print provider's per-piece price shown before sending (see [22](22-business-model-pricing-gtm.md) and 4.8.3).

> **Competitive edge:** Jobber's AI-generated marketing plan (June 2026) works from services, job history and schedule. Rootline's works from the same data **plus** measured property geometry, plant inventory per property, the regional horticultural calendar from the Plant KB, route density and GL margin. That is the difference between "Book your fall aeration!" and "Your Kentucky bluegrass lawn (6,200 sq ft) is due for core aeration and overseeding in the Sept 1-Oct 10 window for your region. Tuesday crews are on your street Sept 16. $217, reply YES to book."

---

## 3. Personas and jobs-to-be-done

Role keys follow [02](02-personas-roles-permissions.md). "Prospect" is not a role: it is an anonymous or lightly identified visitor who has not yet become a Client.

| Persona (role key) | Jobs-to-be-done in this module | Primary surfaces |
|---|---|---|
| Business Owner (`owner`) | "Show me which marketing actually makes money." "Get me more reviews than the competitor down the road." "Fill my aeration schedule in September without me writing emails at 10 pm." | Growth dashboard, campaign approvals, site editor, AI marketing plan |
| Office / Admin Manager (`office_manager`) | "Answer every text, call and DM from one place." "Send the spring cleanup campaign to the right clients without texting anyone who opted out." "Keep the website current." | Unified inbox, campaign builder, template manager, site editor |
| Sales Rep / Estimator (`estimator`) | "Get qualified leads with an address, photos and a budget before I drive out." "See where this lead came from and what they were promised." | Inbox (assigned), lead detail, booking calendar, call recordings |
| Landscape Designer (`designer`) | "Turn the AI mockup a homeowner made on our website into a real design consult." "Showcase finished designs in the gallery." | Lead magnet submissions, gallery curation |
| Operations / Account Manager (`ops_manager`) | "Warn clients about rain delays in one action." "Make sure commercial property managers get visit summaries." "Handle complaints within SLA." | Bulk notifications, inbox (accounts), NPS follow-ups |
| Crew Lead (`crew_lead`) | "Send on-my-way texts without typing." "Flag a job as portfolio-worthy and take good before/after shots." "Drop door hangers on the right houses." | Crew app ([05](05-field-crew-mobile-app.md)): on-my-way, photo capture, door-hanger route layer |
| Technician (`technician`) | "Capture photos the system can use." "Know which neighbors get a door hanger." | Crew app |
| Bookkeeper (`bookkeeper`) | "Book referral credits and marketing spend correctly." "Reconcile marketplace lead charges and credits." | Referral reward ledger, marketing spend tagging in GL |
| Subcontractor (`subcontractor`) | Usually none; may receive on-my-way capability for their assigned visits if enabled. | Crew app (limited) |
| Residential client (`client_residential`) | "Get a price without a sales visit." "Know when the crew is coming." "Tell my lawn company something by text and actually get an answer." "Stop the promotional texts but keep the reminders." | Website, instant quote, SMS, email, portal preference center ([06](06-customer-portal.md)) |
| Commercial client (`client_commercial`) | "Get visit summaries with photos for each of my 14 sites." "Route billing emails to AP and service notices to the site manager." | Email digests, portal, per-contact notification routing |
| Platform Operator (`platform_owner`) | "See growth adoption across tenants, keep messaging reputation clean, and stop any tenant that is spamming." | Admin console: messaging health, 10DLC queue, kill switches ([19](19-platform-admin-portal.md)) |
| Platform support (`platform_support`) | "Diagnose why a tenant's texts are failing (10DLC status, carrier errors)." | Admin console with audited tenant impersonation |
| Platform curator (`platform_curator`) | "Make sure plant pages on tenant websites show accurate regional content." "Write seasonal campaign templates for each region." | KB tools, template library |
| Platform finance (`platform_finance`) | "Meter and bill SMS, voice minutes, AI credits and mail pieces." | Usage and billing ([19](19-platform-admin-portal.md)) |
| Platform engineer (`platform_engineer`) | "Monitor channel adapters, webhook failures, deliverability." | Observability, admin |

---

## 4. Feature specification

The module is organized into nine feature groups:

| Group | Sub-sections |
|---|---|
| A. Web presence | 4.1 Website builder, 4.2 Lead capture (forms, widgets, chat) |
| B. Instant demand | 4.3 Online booking and instant quoting, 4.4 "See your yard redesigned" lead magnet |
| C. Attribution | 4.5 Lead sources, attribution and ROI, 4.6 Lead marketplace ingest |
| D. Audience and outbound | 4.7 Segments, 4.8 Campaigns (email, SMS, mail), 4.9 Journeys (drips), 4.10 Newsletters, 4.11 Win-back and upsell engine |
| E. Reputation and advocacy | 4.12 Reviews and reputation, 4.13 NPS and surveys, 4.14 Referral program |
| F. Local and social | 4.15 Neighborhood marketing, 4.16 Social auto-posting |
| G. Conversations | 4.17 Unified inbox, 4.18 AI receptionist, 4.19 Phone system and call tracking |
| H. Compliance | 4.20 10DLC registration, 4.21 Consent and preference management (TCPA, CAN-SPAM, CASL) |
| I. Lifecycle and templates | 4.22 Client lifecycle communications, 4.23 Notification templates and localization, 4.24 Growth copilot and marketing calendar |
| J. Money and books | 4.25 Ledger and payments touchpoints (marketing spend, marketplace fees, referral rewards, gift certificates, booking deposits, tips) |

### 4.1 Website builder ("Sites")

Each Company gets one primary Site (multiple Sites per Company for multi-brand operators [V2]). Sites are rendered by a multi-tenant Next.js renderer on an edge CDN with incremental static regeneration (see [20](20-architecture-security.md)); content is structured data, not free-form HTML, so it can be regenerated, translated and kept in sync with operational data.

**Roadmap and packaging:** Sites ship at [V1] (binding retag in [24](24-roadmap-feature-catalog.md) section 4.6) as the Website + Online Booking add-on ($49 a month on Starter and Grow, one site included on Pro, per [22](22-business-model-pricing-gtm.md)). Sending-domain DNS in 4.1.7 ships at [MVP], because every Company's email needs it from the first day. Until Sites ship, Companies keep their current website and embed Rootline forms, chat and the visualizer widget (4.2.2).

<a id="411-landscape-templates-and-theme-system-mvp"></a>

#### 4.1.1 Landscape templates and theme system [V1]

- **Templates:** at least 8 templates at MVP, designed for the trade: "Clean Cut" (lawn maintenance), "Hardscape Pro" (patio/wall installers, big imagery), "Native and Wild" (ecological design-build), "Estate" (high-end design-build), "Commercial Grounds" (property managers, RFP-oriented), "Snow and Ice" (seasonal toggle), "Tree Care", "Irrigation and Lighting". Each template has a light/dark palette, 3 type pairings and supports the Company brand kit (logo, colors, fonts) defined once in Company settings and reused by proposals, portal and emails.
- **Sections (blocks):** hero with booking CTA, services grid, instant-quote widget, project gallery, before/after slider, reviews carousel, service-area map, team, certifications and licenses (pulled from [15](15-team-hr-payroll.md), e.g., state pesticide applicator license numbers), plant spotlight, FAQ, financing CTA [V1], careers CTA, contact block. Blocks are typed components with validation (e.g., hero image minimum 1600 px wide).
- **Editor:** visual section editor with inline text editing, reorder by drag, per-block visibility by season (e.g., hide the snow block from April 1 to October 15 automatically, using the Company's season calendar).
- **Rules:** publishing requires: a verified business name and address or service-area-only flag, at least one service, a privacy policy page (auto-generated, Section 4.21) and SMS terms page if SMS capture is enabled anywhere on the site.

<a id="412-page-types-and-auto-generated-content-mvp"></a>

#### 4.1.2 Page types and auto-generated content [V1]

| Page type | Data source | Priority |
|---|---|---|
| Home | Company profile, top services, reviews, gallery | [V1] |
| Service pages (one per bookable or showcased service) | [Price Book](03-crm-sales-estimating-proposals.md) items flagged `show_on_site`, service descriptions, typical price ranges (optional "starting at"), gallery filtered by service tag | [V1] |
| Service-area pages (city, town, neighborhood) | Service area definition, local projects, local reviews, region plant palette | [V1] |
| Project gallery and project detail | Completed Jobs with showcase consent (4.1.4) | [V1] |
| Plant pages and plant library | [Plant KB](12-plant-knowledge-base.md) + tenant notes and photos (4.1.5) | [V1] |
| Reviews page | Synced reviews (4.12) | [V1] |
| About, team, careers | Company profile, opted-in employee profiles, open jobs from [15](15-team-hr-payroll.md) | [V1] |
| Blog and seasonal guides | AI-assisted editor (4.1.9) | [V1] |
| Book online / instant quote | 4.3 | [V1] |
| Design inspiration ("See your yard redesigned") | 4.4 (the widget itself is [MVP] on any site) | [V1] |
| Legal: privacy, SMS terms, accessibility statement, cookie notice | Generated from Company settings and consent configuration | [MVP] hosted SMS terms and opt-in page (needed for 10DLC, 4.20); [V1] the rest with Sites |

#### 4.1.3 Service-area pages without doorway-page spam [V1]

Local SEO depends on city pages, but templated pages that differ only by city name are low quality and risk search penalties. Rootline generates a service-area page **only when it has unique local substance**:

- **Eligibility rule:** a city or neighborhood page is generated when the Company has at least 3 completed Jobs in that area in the last 24 months **or** at least 1 showcased project there, **and** the area is inside the declared service area. Otherwise the area is listed on a single "Areas we serve" page.
- **Unique content per page (auto-assembled):** count and type of projects completed locally ("42 lawns maintained weekly in Westfield"), up to 6 showcased local projects, reviews from clients whose Property is in that area, region-specific seasonal guidance (e.g., "In Zone 6a, schedule core aeration and overseeding between late August and early October"), recommended plants from the Region's Plant Palette, local regulations snippet maintained by `platform_curator` (e.g., municipal leaf-blower restrictions or watering-day rules where they exist), and a map of the service radius. AI drafts a 250-400 word introduction that the `office_manager` reviews; the page cannot publish with unreviewed AI text.
- **Privacy:** street-level locations are never shown; project pins snap to neighborhood centroids with at least 500 m jitter.
- **Structured data:** `LocalBusiness` (or a more specific `HomeAndConstructionBusiness` subtype where applicable), `Service`, `areaServed`, `BreadcrumbList`, `FAQPage` where FAQs exist. Self-served star-rating markup is not emitted for the Company's own reviews because search engines generally do not show self-serving review rich results (verify current guidance).

<a id="414-automatic-project-gallery-from-completed-jobs-with-consent-mvp-manual-v1-automatic"></a>

#### 4.1.4 Automatic project gallery from completed jobs, with consent [V1]

- **Consent model:** a Client-level and Job-level **Showcase Consent** with three values: `granted_named_area` (photos may be published with neighborhood name), `granted_anonymous` (photos may be published with no location), `denied` (default when unknown). Captured via a checkbox on the Proposal acceptance page ([03](03-crm-sales-estimating-proposals.md)), in the portal ([06](06-customer-portal.md)), or recorded verbally by staff with a note. Consent is versioned with the disclosure text shown.
- **Photo sources:** Job photos captured in the crew app ([05](05-field-crew-mobile-app.md)) with `photo_kind` = before, progress, after, plus Design renders and approved Mockups from [10](10-design-studio.md) and [11](11-ai-design-mockups.md) (labeled "Design rendering").
- **Auto-curation pipeline [V1]:** when a Job of type Project (or a one-off Work Order above a configurable value, default $2,500) is completed and consent is granted:
  1. Vision model scores photos for quality (sharpness, exposure, composition) and pairs before/after shots taken from similar viewpoints using image embeddings.
  2. Privacy redaction: faces, license plates and house numbers detected and blurred; EXIF GPS stripped; images re-encoded to AVIF/WebP at 3 sizes.
  3. AI drafts a project title and 80-150 word story from the Job record: scope lines, materials (e.g., "420 sq ft of Belgian-block-edged tumbled pavers, 12 tons of 3/4 in clean stone base"), plants installed (linked to KB plant pages), duration.
  4. Project enters a **Gallery review queue**. `owner`, `office_manager` or `designer` approves; nothing auto-publishes unless the Company opts into "auto-publish when quality score is at least 0.8 and consent is granted_named_area" [V2].
- **Takedown:** if a Client revokes consent, the project is unpublished from the site within 15 minutes and queued for deletion from connected social channels (4.16) via API where supported; a takedown task is created for any channel where API deletion is not possible.
- **Tags and filters:** service type, style, materials, plants, city/neighborhood, budget band (optional, owner-controlled).

#### 4.1.5 Plant pages from the Plant KB [V1]

- Plant library pages show KB data relevant to the Company's Region(s): common and botanical names, mature size, light, water, hardiness, bloom time, native status for the ecoregion, deer resistance, and the **Plant Region Profile** rating and notes written by `platform_curator` ([12](12-plant-knowledge-base.md)).
- Tenants can add **"We install this"** notes, their own photos of the plant in their projects, and a typical installed price per container size.
- **Duplicate-content strategy (opinionated):** KB core text is identical across many tenant sites. To avoid thin duplicated pages, a tenant plant page is **indexable only when it has tenant-unique content** (at least 2 tenant project photos featuring the plant and at least 120 words of tenant notes). Otherwise it is rendered for visitors (useful for browsing and proposals) with `noindex` and a canonical link to the Rootline public plant encyclopedia on the marketing site. This protects tenants from duplicate-content dilution and builds a platform-level SEO asset (see [22](22-business-model-pricing-gtm.md)).
- **Plant of the month** block rotates seasonally appropriate plants for the Region (e.g., in Zone 7b mid-Atlantic in October: switchgrass, aromatic aster, winterberry holly).

<a id="416-seo-toolkit-mvp"></a>

#### 4.1.6 SEO toolkit [V1]

- Per-page title, meta description, Open Graph image (auto-generated from the hero photo plus logo), canonical, robots controls; XML sitemap and robots.txt generated; image alt text drafted by AI and editable.
- Redirect manager (301/302) with bulk CSV import; site migration importer [V1] crawls the old site, imports pages and images, and proposes a redirect map.
- Performance budgets: every template must meet Google's "good" Core Web Vitals thresholds on mid-range mobile (LCP at most 2.5 s, INP at most 200 ms, CLS at most 0.1) measured in CI with synthetic tests and in production with real-user monitoring; Lighthouse performance score of at least 90 is a release gate for templates.
- `hreflang` alternates for English and Spanish pages; Spanish pages generated by AI translation and reviewed by the tenant (4.23).
- Google Search Console verification via DNS TXT automation [V1]; GBP linkage (4.12) for name/address/phone consistency checks.
- **Accessibility:** templates conform to WCAG 2.2 AA (contrast, focus states, alt text required, form labels); an accessibility statement page is generated.

#### 4.1.7 Hosting, custom domains and email DNS [MVP]

- Site hosting arrives with Sites at [V1]; the sending-domain setup below is [MVP].
- Default hostname `{company-slug}.rootline.site`; custom domain connection by CNAME or apex A/ALIAS, with automatic TLS certificates issued and renewed via ACME on a "SaaS custom hostname" CDN product (e.g., Cloudflare for SaaS; decision in [20](20-architecture-security.md)).
- **Domain Connect** one-click flow for supported registrars [V1]; guided DNS instructions with live verification otherwise; domain purchase through a reseller API [V2].
- The same flow sets up the **sending domain** for email (SPF include, DKIM CNAMEs, DMARC record starting at `p=none` with reporting to Rootline, upgraded to `p=quarantine` when alignment is clean for 30 days) so that marketing and transactional email send from `@greenleafgrounds.com`, not a shared domain.
- **SLOs:** site availability 99.95% monthly; p75 TTFB under 200 ms from North American edges for cached pages; publish-to-live under 60 seconds.
- Customer Portal ([06](06-customer-portal.md)) can share the domain as `portal.greenleafgrounds.com`.

<a id="418-ai-site-generator-mvp"></a>

#### 4.1.8 AI site generator [V1]

From the onboarding profile (company name, logo, services, service area, years in business, crew photos, license numbers) and the Company's Region, the generator produces a complete draft site in under 2 minutes: chosen template, home page copy, service pages, FAQ, legal pages and a seasonal hero. Copy is grounded in tenant-provided facts only; the generator never invents awards, years in business, certifications or guarantees. Every generated claim that is not sourced from a structured field is highlighted for review before first publish.

#### 4.1.9 Content studio and seasonal blog [V1]

- AI drafts seasonal articles from a regional content calendar curated by `platform_curator` (e.g., "When to aerate in Columbus, Ohio", "Spring mulch: how many cubic yards do you need?" with a calculator), personalized with tenant projects and plant notes.
- Built-in calculators as embeddable blocks: mulch (area x depth to cubic yards), sod (square feet to pallets), paver base (square feet to tons of base), irrigation water use [V2]. Calculators end with a booking CTA and feed lead attribution.

<a id="4110-site-analytics-and-tracking-mvp"></a>

#### 4.1.10 Site analytics and tracking [V1]

- First-party, cookieless page analytics (visits, sources, conversions) on by default.
- Optional third-party tags: Google Analytics 4, Google Ads conversion tag, Meta Pixel. When enabled, a consent banner is shown with region-aware defaults (opt-in for Quebec and for EU visitors; notice with opt-out link in US states that require it). Tag firing respects consent state.
- **Universal opt-out signals [MVP for hosted pages and widgets]:** the renderer reads the browser's Global Privacy Control signal (`Sec-GPC: 1` header and `navigator.globalPrivacyControl`). California's CCPA regulations and several other state privacy laws treat it as a valid opt-out of sale/sharing (background, verify). When the signal is present, the site does not fire advertising pixels (Meta Pixel, Google Ads remarketing) for that visitor. First-party analytics and lead attribution still run because they are a service-provider use. The visitor sees a small "Your opt-out preference signal was honored" note in the cookie panel.
- **Tag governance:** tenants cannot paste arbitrary script tags when Sites launch. Supported tags are configured by ID only, so a tenant cannot break Core Web Vitals or inject session-replay tools that capture form fields (phone numbers, addresses) without consent. A custom-script slot with a performance and privacy review checklist is [V1], restricted to `owner`.
- Session-level attribution capture: landing page, referrer, UTM parameters, `gclid`, `gbraid`, `wbraid`, `fbclid`, `msclkid`, tracking-number shown (4.19). Stored on the Lead when a form, booking, chat or call converts.

### 4.2 Lead capture: forms, embeddable widgets and chat

#### 4.2.1 Form builder [MVP]

- Field types: name, email, phone (E.164 normalization, line-type lookup), address (autocomplete with geocoding and parcel match), service multi-select (from Price Book), budget band, timeframe, free text, photo/video upload (up to 10 files, 50 MB each), preferred contact method, preferred language, how-did-you-hear.
- Every form that collects a phone number includes a **separate, unchecked SMS consent checkbox** with versioned disclosure text (4.21). Submitting the form without checking it still creates the Lead and allows a phone call or email reply, but no marketing SMS.
- Spam protection: invisible challenge (e.g., Cloudflare Turnstile), honeypot field, rate limit per IP (5 submissions per 10 minutes), disposable-email detection, AI spam classifier on free text. Spam is quarantined, not deleted, for 30 days.
- On submit: create or match Client/Contact (dedupe on normalized phone, email and address), create Lead with source attribution ([03](03-crm-sales-estimating-proposals.md)), trigger speed-to-lead journey (4.9), notify assignee.

#### 4.2.2 Embeddable widgets [MVP]

For Companies that keep an external site (WordPress, Wix, Squarespace): a single script tag loads the lead form, chat bubble, review badge and the visualizer widget (4.4) at [MVP], and the booking and instant quote widgets when 4.3 ships at [V1]. Widgets inherit the brand kit, are under 60 KB gzipped for the loader, and post attribution data the same way native pages do.

#### 4.2.3 Web chat widget [MVP human, V1 AI]

- Chat bubble on Rootline sites and embeds. Visitor messages enter the unified inbox (4.17) as a `web_chat` conversation.
- **AI chat agent [V1]:** answers questions grounded in the Company's knowledge pack (services, service area, policies, FAQ, price-book "starting at" prices where the owner allows), runs the instant quote, books site visits, captures contact details and consent, and hands off to a human on request or on low confidence. Same guardrails as the AI receptionist (4.18).
- Offline behavior: outside business hours with no AI, the widget collects contact info and promises a response time based on the Company's SLA settings.
- Visitor identity: if the visitor is a logged-in portal user, the chat attaches to their Client record automatically.

### 4.3 Online booking and instant quoting

The instant quote engine prices standardized residential services from measured property geometry. It is the most important conversion feature in the module for lawn-maintenance-heavy Companies. Online booking and public instant quotes ship at [V1] (binding retag in [24](24-roadmap-feature-catalog.md) section 4.6). The turf measurement pipeline in 4.3.2 is [MVP] because estimators use it for Quick Quotes in [03](03-crm-sales-estimating-proposals.md).

<a id="431-bookable-services-catalog-mvp"></a>

#### 4.3.1 Bookable services catalog [V1]

- Price Book items get `online_booking` settings: bookable (yes/no), quote mode (`instant_firm`, `instant_range`, `request_estimate`), required measurements, eligible property types, minimum lead time, seasonal window (e.g., aeration bookable August 1 - October 15 for cool-season regions), deposit/card-on-file requirement, and capacity pool ([04](04-scheduling-dispatch-routing.md)).
- Services are grouped for display: Lawn care (mowing, fertilization program, aeration, overseeding), Cleanups (spring, fall, leaf removal), Beds (mulch, edging, weeding), Irrigation (start-up, winterization, repair visit), Snow (seasonal contract, per-push), Design consultation, Hardscape consultation.

#### 4.3.2 Aerial measurement pipeline [MVP for turf area, V1 for beds and driveways]

1. **Geocode and parcel match:** address to rooftop coordinates; parcel polygon from parcel data provider (e.g., Regrid); detect multi-parcel and condo/townhome cases (route to `request_estimate`).
2. **Imagery:** latest available aerial or satellite tile at the best resolution licensed for the tenant's plan (standard tiles by default, high-resolution aerial providers for premium tiers, see [10](10-design-studio.md)); record imagery capture date.
3. **Segmentation:** a segmentation model classifies the parcel into turf, planting beds, hardscape (driveway, walks, patio), structures, tree canopy, water and other. Tree canopy over turf is estimated (turf under canopy counted with a confidence penalty).
4. **Terrain:** slope from elevation data (USGS 3DEP where available); flag turf areas with slope over 15% (mower safety and time) and over 30% (string-trim only, route to estimate).
5. **Features:** count obstacles (beds, trees, play sets) inside turf as a complexity score; detect fenced backyard and gate presence where visible; frontage length for edging.
6. **Output:** `PropertyMeasurement` with polygons, areas (sq ft and m²), per-class confidence, imagery date, model version. Measurements are stored on the Property and reused by Design Studio ([10](10-design-studio.md)) and estimating ([03](03-crm-sales-estimating-proposals.md)).
7. **Homeowner confirmation:** the quote page shows the measured lawn outline over the aerial image with "Is this your lawn?" controls: adjust vertices, exclude areas ("the back field is not mowed"), add missing areas. Edits are saved as a `customer_adjusted` measurement; edits that change area by more than 25% downgrade the quote to `instant_range` and flag for staff review.

<a id="433-pricing-rules-mvp"></a>

#### 4.3.3 Pricing rules [V1]

Tenants configure a pricing rule per service, either by typing it or (recommended) by generating it from the estimating cost model in [03](03-crm-sales-estimating-proposals.md) `EST-12`. The generated rule is fitted so it never underprices the visit model by more than 2%, and it is regenerated as a draft for owner approval whenever budgets or rates change. Rule components (the example values describe an illustrative tenant, not the Evergreen Edge example in 03):

| Component | Example configuration (illustrative tenant settings, not market data) |
|---|---|
| Base formula | Mowing per visit = 28.00 + 2.40 x turf area in thousands of sq ft |
| Minimum charge | 40.00 per visit |
| Area bands | Auto-quote up to 20,000 sq ft; above that, `request_estimate` |
| Frequency multiplier | Weekly 1.00; every other week 1.30 (taller growth); on-demand 1.50 |
| Slope modifier | +10% if more than 25% of turf exceeds 15% slope |
| Complexity modifier | +5% per obstacle band above 6 obstacles, capped at +20% |
| Access modifier | +5.00 per visit if backyard is gated and fenced |
| Route density adjustment | -5% if the property is within 400 m of an existing weekly route stop on the same service day (operational efficiency shared with the client) |
| Travel zone | +8.00 per visit beyond the 25-minute drive-time isochrone from the yard |
| Rounding | Round up to the nearest 1.00 |
| Season terms | Season length (e.g., 30 weekly visits, Apr-Nov); optional season-prepay discount 5% |

**Worked example:** 6,200 sq ft of turf, weekly, flat, 4 obstacles, gated backyard, near an existing route: 28.00 + 2.40 x 6.2 = 42.88; +5.00 access = 47.88; -5% route density = 45.49; rounded up = **$46 per visit**, 30 visits.

Other formulas the engine supports out of the box:

- **Core aeration:** rate per sq ft with minimum (e.g., 0.018 x 6,200 = $111.60, minimum $95, rounds to $112); aeration plus overseeding as a bundle rate (e.g., 0.035 per sq ft = $217).
- **Fertilization and weed control program:** per-application rate per 1,000 sq ft (e.g., 9.50 x 6.2 = $58.90 per application, 5 applications = $294.50 per season), with program steps from [14](14-service-line-modules.md) (early-spring pre-emergent, late-spring broadleaf, summer, early-fall, late-fall winterizer).
- **Mulch installation:** bed area x depth to cubic yards (480 sq ft at 3 in = 480 x 3 / 12 / 27 = 4.44 cu yd, rounded to 4.5) x installed price per yard, plus optional edging per linear foot; color choice from Price Book.
- **Spring/fall cleanup:** labor-hour model from bed area, canopy cover and turf area, priced as a range (`instant_range`) by default because leaf load varies; firm after site photos or first visit.
- **Irrigation start-up / winterization:** per controller plus per zone (zone count from the client or from a prior irrigation record).
- **Snow:** driveway area and walk length from segmentation; per-push price at the Company's trigger depth (e.g., 2 in), seasonal contract alternative (fixed price for up to N pushes), salt per application; see [14](14-service-line-modules.md).

<a id="434-confidence-gating-and-firm-price-guarantee-mvp"></a>

#### 4.3.4 Confidence gating and firm-price guarantee [V1]

- `instant_firm` is shown only when: measurement confidence for the needed classes is at least 0.85, imagery is less than 36 months old, area is inside the auto-quote band, the property is inside the service area, and the service is in season. Otherwise the engine shows `instant_range` (low/high bound from confidence interval) or routes to `request_estimate` with a booked site visit.
- **First-visit verification:** the crew lead confirms or corrects conditions in the crew app on the first visit ([05](05-field-crew-mobile-app.md)). If actual conditions differ such that the recalculated price is more than 15% higher, the first visit is honored at the quoted price and a reprice proposal is sent to the client for approval for subsequent visits; the client can cancel without penalty. Repricing rate is a tracked KPI (target under 3%).
- Quotes are valid for 30 days (configurable) and stored as `InstantQuote` records linked to the Lead.

<a id="435-booking-flow-and-capacity-mvp"></a>

#### 4.3.5 Booking flow and capacity [V1]

- **Recurring maintenance:** client picks a start week; Rootline assigns the service day from route capacity ([04](04-scheduling-dispatch-routing.md)) and shows "Your crew will visit on Tuesdays". If capacity in that zone is full, the client can join a **waitlist** or accept another day.
- **One-time services:** client picks a preferred week or date window; exact dates are scheduled by dispatch with weather adjustments.
- **Site visits (estimates, design consults):** client picks a time slot from estimator calendars filtered by travel-aware availability (estimators covering that territory, buffer for drive time).
- **Payment step:** configurable per service: none, card on file via Stripe Elements on the Company's connected Stripe account, or deposit (e.g., 25% for cleanups over $500). See [08](08-payments-stripe.md). Card data never touches Rootline servers.
- **Account creation:** booking creates Client, Property, Contact, an accepted Proposal (for firm-price services, using a one-page service agreement template from [03](03-crm-sales-estimating-proposals.md) with e-signature) and either a Service Agreement (recurring) or a Job. A portal invite is sent ([06](06-customer-portal.md)).
- **Out-of-area:** shows a friendly message, offers waitlist for expansion analytics ("23 requests from Lewis Center this season").

> **Competitive edge:** RealGreen's Measurement Assistant measures from the office and sends quotes, and Deep Lawn adds a quote widget that needs another CRM. LawnStarter shows homeowners will accept a firm satellite price. Rootline combines all three in the Company's own branded site, then **books the client onto a real route day with a card on file and a signed agreement in one flow**, and uses route density to make the neighbor's price better, which none of them can do.

<a id="44-see-your-yard-redesigned-ai-homeowner-lead-magnet-v1"></a>

### 4.4 "See your yard redesigned": AI homeowner lead magnet [MVP website widget; V1 portal-hosted page and Rootline Home]

A public, Company-branded experience that lets a homeowner photograph their front or back yard and receive AI redesign concepts of their own house. In product it is the Company's "Dream Yard Visualizer" with the call to action "Visualize your yard"; "See your yard redesigned" is the marketing headline used in ads and campaigns. It runs on the Company's website through the embeddable widget (4.2.2) at [MVP] and natively in Rootline Sites once they ship at [V1]; it also opens from ads and yard-sign QR codes, and is served on the portal domain at `/visualize` at [V1] ([06](06-customer-portal.md) section 4.17 owns that page). There is one rendering engine ([11](11-ai-design-mockups.md) AIM-AUD-01) and one lead pipeline ([03](03-crm-sales-estimating-proposals.md)); this section specifies the marketing wrapper: attribution, consent, follow-up and economics.

- **Inputs:** guided capture or upload of 1-3 photos (phone camera, minimum 1024 px on the short side), address (enables Region lookup, the service-area check and aerial context), style choice (e.g., Cottage Garden, Modern Minimal, Native Pollinator, Low-Water/Xeriscape, Family Play Yard, Curb Appeal Refresh), the quick questions defined in [11](11-ai-design-mockups.md) (style, budget band, maintenance, deer, pets), optional real dimensions and "must keep" notes ("keep the maple").
- **Region-aware plants:** concepts use the Company's preferred palette for the Region (from [12](12-plant-knowledge-base.md)); only plants rated for the Property's Region can be rendered ([11](11-ai-design-mockups.md) decision 2), so the mockup shows plants that will actually thrive and that the Company actually installs. Each concept includes a plant list with links to plant pages.
- **Verification gate** (tenant setting; modes defined in [11](11-ai-design-mockups.md) AIM-AUD-01): `teaser_then_verify` (the default) shows an anonymous visitor one teaser set of 2 variants at preview resolution, then delivers full 4-variant sets in up to 3 more styles, an HD download of one favorite, the plant list and a ballpark price after a one-time code by email or SMS; `verify_first` shows only a mask preview until the visitor verifies (the MVP setting for design partners, per [24](24-roadmap-feature-catalog.md) section 4.6); `open` allows a few full sets per device for high-volume spring pushes. Name, phone and address are collected at verification, with separate, unchecked consent boxes for SMS and marketing email. The one-time code itself is a transactional message, not marketing consent (4.21). This value exchange produces a qualified, high-intent design lead.
- **Delivery:** results page plus email with the concepts; "Book a design consultation" CTA (site visit booking with designer calendar); "Get a ballpark price" shows a budget band derived from cost-per-square-foot ranges configured by the Company for each style (e.g., planting refresh $12-$25 per sq ft of bed, patio $35-$70 per sq ft) and labeled as an estimate.
- **Hand-off:** "Get a real design and quote" creates a Lead in [03](03-crm-sales-estimating-proposals.md) carrying the photos, masks, dimensions, concepts, chosen style, favorites, budget band, plant list and a pre-filled site assessment request; visualizer signals (render count, favorites, verified contact) feed lead scoring. When a designer opens the Lead, they can "Start Design from concept", which seeds a [Design Studio](10-design-studio.md) project with the property, aerial base and the concept's plant list.
- **Credits and cost controls:** each preview set costs 24 AI credits from the Company's pool, per the rate card in [22](22-business-model-pricing-gtm.md) 4.4.1. Widget spending has its own monthly cap (default 600 credits), which the owner can raise and fund with packs for spring campaigns; on Starter (300 included credits) the setup wizard recommends funding the widget from purchased packs so it cannot use up the office's allowance. Cost-per-lead math is in [11](11-ai-design-mockups.md) section 8.6.
- **Abuse controls:** invisible bot check (e.g., Cloudflare Turnstile); per-IP and per-device rate limits; the address must fall inside the Company's service-area polygon before any render, so out-of-area visitors get a polite message and consume no credits; content moderation on uploads (reject images with people as the main subject and non-yard images); a visible "AI concept, not a final design" watermark; and C2PA content credentials on generated images as specified in [11](11-ai-design-mockups.md).
- **Rootline Home and Rootline Match [V1, owned by [22](22-business-model-pricing-gtm.md)]:** the same engine powers Rootline's own homeowner app, whose renders are paid by Rootline, never from a Company's credits. The Company's widget never sends a visitor to Match without the visitor's consent and the hosting Company's setting.
- **Disclosure:** concepts are illustrative; plant availability, sizes and final pricing are determined in a design consultation. Text is shown on the page and in the email.

> **Competitive edge:** No field-service platform in our research offers a homeowner-facing AI redesign tied to a real plant database and a real design tool. Point "AI landscape design" apps generate pretty pictures with plants that may not survive the region and produce no lead for a local contractor. Rootline's version produces a lead with an address, photos, a style preference and a plant list that flows into a to-scale design.

### 4.5 Lead sources, attribution and ROI

#### 4.5.1 Source taxonomy [MVP]

- Three-level taxonomy: **Channel** (Organic search, Paid search, Paid social, Organic social, Lead marketplace, Referral, Direct mail, Door hanger, Yard sign, Vehicle wrap, Website direct, Phone (untracked), Walk-in, Repeat client, Partner) > **Source** (Google Ads, Google LSA, Angi, Thumbtack, Facebook, Client referral, EDDM Fall 2026, etc.) > **Campaign** (specific campaign or Rootline campaign id).
- Platform default taxonomy, tenant-extensible. Every Lead has `first_touch_source`, `last_touch_source` and `self_reported_source` (from "how did you hear about us"), all retained; conflicts are shown, not overwritten.
- Automatic capture from: UTM/click IDs (4.1.10), tracking numbers (4.19), QR codes (unique per door hanger batch, yard sign or mail piece), referral links (4.14), marketplace ingest (4.6), email/SMS campaign links (4.8).

#### 4.5.2 Attribution models [MVP first/last touch, V1 multi-touch]

- MVP: first-touch and last-touch attribution of Leads, Opportunities, sold Jobs and collected revenue.
- V1: position-based multi-touch (40% first, 20% spread across middle touches, 40% last), with touches recorded as `AttributionTouch` events (web session, call, form, chat, campaign click, door-hanger scan).
- V1: **offline conversion upload** to Google Ads (click IDs plus enhanced conversions for leads using hashed email/phone where consent allows) and Meta Conversions API, sending "qualified lead", "sold job" and "first payment" events with value, so ad platforms optimize toward paying clients, not form fills.
- Rules: attribution window default 90 days for residential, 180 days for commercial; repeat clients are attributed to "Repeat client" unless a campaign touch occurred within 14 days before the new Opportunity.

#### 4.5.3 Spend capture and ROI [MVP manual, V1 automatic]

- **Spend sources:** manual entry per campaign/month; automatic import from Google Ads, Google LSA (lead charges and credits), Meta Ads [V1]; marketplace lead charges via CSV or API where available; and **GL-tagged expenses** from the [Ledger](09-accounting-ledger-integrations.md): any bill or card transaction coded to a marketing expense account can be tagged with a Source/Campaign dimension, so the door-hanger print bill and the EDDM postage are in ROI automatically.
- **ROI metrics per source/campaign:** leads, qualified leads, booked site visits, proposals sent, won Opportunities, sold value, invoiced revenue, collected revenue, **job-costed gross margin** (from [09](09-accounting-ledger-integrations.md)), cost per lead, cost per acquisition, first-year client value, 3-year LTV projection [V1], and payback months.
- Reports render in [18](18-reporting-analytics.md) with drill-down to individual Leads.
- Ledger posting rules for spend, marketplace credits, referral rewards and campaign discounts, and the rule that the Ledger wins over manual spend entries, are in 4.25.

### 4.6 Lead marketplace ingest: Google LSA, Angi, Thumbtack and others

| Source | Ingest method | Notes | Priority |
|---|---|---|---|
| Google Local Services Ads | Google Ads API read-only reports: `local_services_lead` and lead conversation resources, polled every 5 minutes per connected Ads account ([Google Ads API LSA docs](https://developers.google.com/google-ads/api/docs/campaigns/local-service-campaigns), [retrieve leads](https://support.google.com/google-ads/answer/12080108)) | Contact fields may be incomplete through the API (developers report the consumer phone number missing, [forum](https://groups.google.com/g/adwords-api/c/PP7d0bCOGKg)); Rootline stores what is available and links the conversation thread. Lead charge/credit status imported for ROI. Dispute (credit request) workflow links to the LSA dashboard. Recent Google Ads API versions reportedly add limited write operations on LSA leads, such as lead feedback and appending conversation details (background, verify against the current API version). Where available, Rootline posts lead-quality feedback ("booked", "out of area", "spam") so Google's lead quality signal reflects real outcomes. Explore Google's LSA Partner Program for deeper management ([partner program](https://support.google.com/localservices/answer/10209924)). | [V1] native API; at [MVP] its notification emails are ingested by the email parser below |
| Angi | Real-time JSON push to a per-tenant webhook URL; optional `x-api-key` header (max 160 chars); endpoint must return JSON with HTTP 200 or Angi may treat it as a delivery failure; "Send Test Lead" from Angi for Pros ([Angi integration setup](https://intercom.help/angi/en/articles/10288125-setting-up-api-integration-with-angi), [Angi lead API](https://intercom.help/angi/en/articles/15304819-angi-lead-integration-api)) | Rootline auto-disables the email-parser path for Angi when the API path is verified, preventing the known duplicate problem ([ClientTether](https://support.clienttether.com/home-advisor/)). | [V1] native API; at [MVP] its notification emails are ingested by the email parser below |
| Thumbtack | Partner API where access is granted; email-parsing fallback otherwise | API access terms not verified (open question). | [V1] |
| Houzz, Nextdoor, Yelp, BBB, HomeAdvisor legacy, Porch | Email-parsing ingest with AI extraction | Each tenant gets an ingest address `leads-{slug}@in.rootline.app` to set as the notification email in those portals. | [MVP] parser, [V1] per-source parsers |
| Generic | Public Leads API (`POST /v1/leads`), Zapier/Make connector, inbound webhook with field mapping UI | For agencies and custom forms. | [MVP] API, [V1] Zapier |

**Ingest rules (all sources):**

1. Normalize contact fields; geocode address; dedupe against existing Clients, Contacts and open Leads within 30 days (match on phone, email, or address plus last name). Duplicates merge into the existing Lead with an added `AttributionTouch`, never a second Lead.
2. Record **consent provenance** from the marketplace (the consumer requested contact from this business through that platform). Marketplace consent permits responding to the inquiry; it is not treated as consent for ongoing marketing SMS (4.21).
3. Start the speed-to-lead journey: acknowledgment message within 60 seconds on the channel the marketplace allows (SMS reply where consent covers it, marketplace message thread, or email), notify the assigned estimator with push and SMS, and, for LSA phone leads, ensure the call was answered (link to call record).
4. Flag marketplace leads whose service or ZIP code is outside the tenant's area, so the owner can dispute charges and tune marketplace targeting.
5. **Charge capture and dispute tracking [V1]:** every marketplace lead carries `lead_cost`, `charge_status` (`charged`, `credit_requested`, `credited`, `credit_denied`) and a dispute deadline where the marketplace publishes one. A weekly "disputable leads" digest lists leads that are spam, duplicates, wrong service or out of area and still inside the window. Approved credits post as a contra-expense in the Ledger (4.25), so cost per lead in ROI reports is net of credits.
6. **Marketplace scorecard [V1]:** per marketplace, the Growth home shows gross cost, credits, net cost per lead, lead-to-booked rate, collected revenue and job-costed margin. It answers the question owners ask every spring: "Should I keep paying Angi?"

> **Competitive edge:** Landscapers juggle the LSA dashboard, Angi for Pros and Thumbtack's app on top of their field-service tool. Point integrations push the lead into a CRM and stop there. Rootline dedupes across all of them, answers within 60 seconds in the Company's voice, tracks which charges are still disputable, and grades each marketplace on collected revenue and margin from the [Ledger](09-accounting-ledger-integrations.md), not on lead count.


### 4.7 Segments and audiences [MVP]

- **Segment builder** with AND/OR groups over Client, Contact, Property, Service Agreement, Job, Visit, Invoice, Payment, Design, Mockup, NPS, Review, Referral, Campaign engagement and Consent attributes. Examples of filterable fields: client type (residential/commercial), tags, lifecycle stage (lead, active, at-risk, lapsed, former), Region and hardiness zone, turf area, bed area, irrigation present (yes/zone count), grass type (cool/warm season, if recorded), installed plants (from Design or Job materials), services purchased in date range, services **not** purchased, agreement status and renewal date, AR balance and days past due, last visit date, NPS score, preferred language, route day and crew.
- **Dynamic segments** re-evaluate on send and nightly; **static snapshots** are frozen lists for audits and A/B holdouts.
- **Natural-language segments [V1]:** "Mowing clients in Zone 6 with more than 5,000 sq ft of lawn who did not buy aeration last fall" is translated by the copilot into a filter tree the user can inspect and edit before saving ([17](17-ai-copilot-automation.md)).
- **Reachability preview:** every segment shows total contacts and the reachable count per channel after consent, suppression, quiet-hour scheduling and frequency caps (e.g., "812 clients: 790 email-reachable, 604 SMS-reachable for marketing, 22 suppressed for open complaints").
- **Pre-built segments (platform library, curated by `platform_curator`):**

| Segment | Definition (simplified) | Typical use |
|---|---|---|
| Aeration prospects | Active mowing clients, cool-season turf, no aeration in last 12 months | Late-summer aeration and overseeding campaign |
| Irrigation winterization due | Clients with irrigation system, no winterization Visit scheduled by Sept 25 | Winterization booking campaign |
| Spring cleanup repeaters | Bought spring cleanup last year, nothing scheduled this year by Feb 15 | Early-bird spring cleanup |
| Mulch season | Clients with bed area at least 200 sq ft, mulch purchased in prior 2 years | April mulch campaign with per-property yardage |
| Lapsed clients | No paid invoice in 13 months, no open complaint, not "do not market" | Win-back |
| Promoters without referrals | NPS 9-10 in last 6 months, zero referrals | Referral ask |
| Snow-eligible | Commercial lots and residential driveways in snow Regions, no current snow agreement by Oct 1 | Snow contract sales |
| Design-built, phase 2 pending | Design with unbuilt phases or unaccepted Proposal options | "Phase 2 this spring?" |
| New plantings under warranty | Plants installed within warranty period (e.g., 1 year) | Watering guidance and warranty reminders |

### 4.8 Campaigns: email, SMS/MMS and direct mail

#### 4.8.1 Email campaigns [MVP]

- Drag-and-drop block editor (brand kit, header, text, image, before/after, button, review quote, plant card, **personalized offer block**, map block, footer with physical address and unsubscribe).
- **Personalized offer block:** renders a per-recipient price computed by the instant quote engine (4.3) from the recipient's Property measurements and current Price Book, e.g., "Core aeration + overseeding for your 6,200 sq ft lawn: $217. Book for the week of Sept 15." A one-click "Book it" link opens a pre-filled portal acceptance page ([06](06-customer-portal.md)) where the client confirms and the Job is created. Recipients without measurements see the starting price and a "Get my price" link.
- Subject line and preheader A/B testing (up to 4 variants, test on 20% then auto-send winner after 4 hours by click rate or bookings).
- Send-time optimization [V1]: per-contact best hour inferred from historical opens/clicks/replies within allowed sending windows.
- Rendering: responsive HTML compiled from blocks, plain-text alternative, dark-mode-safe images; pre-send checks for broken links, missing alt text, spam-trigger phrases and image-to-text ratio.
- Deliverability: tenant-authenticated sending domain (4.1.7), one-click unsubscribe headers, bounce and complaint processing, automatic suppression of hard bounces and complainers, sending throttles for new domains (warm-up schedule starting at 500 messages per day and doubling while bounce rate stays under 2% and complaint rate under 0.1%).

#### 4.8.2 SMS and MMS campaigns [MVP]

- Composer with live segment counter: GSM-7 messages split at 160 characters (153 per segment when concatenated); any character outside the GSM-7 alphabet (emoji, curly quotes, and Spanish "á", "í", "ó", "ú", although "ñ", "é", "ü", "¿" and "¡" are in GSM-7) switches the whole message to UCS-2 at 70 characters (67 per concatenated segment). This matters for Spanish-language messages, which often double in segment count. The composer offers "replace curly quotes" and "remove emoji" fixes and shows cost in segments and credits.
- Required elements enforced: Company name identification in the first message to a contact for a campaign, opt-out language ("Reply STOP to opt out") on marketing messages at least once per campaign and on the first message to a new contact; link shortening on the Company's branded short domain (generic public shorteners are commonly filtered by carriers).
- **Content screening:** prohibited content classifier (carrier-restricted categories, misleading claims, phishing patterns) blocks or flags before send.
- MMS: before/after image cards (auto-generated 1080 x 1080 image with logo) for seasonal campaigns.
- **Send governance:** marketing SMS only to contacts with `marketing_sms` consent = opted in; quiet hours (4.21) applied per recipient time zone with strictest-rule logic; frequency cap default 4 marketing SMS per contact per 30 days; throughput limited to the tenant's 10DLC campaign throughput tier (4.20).
- **Two-way:** replies land in the unified inbox (4.17) threaded to the client; "YES" / "BOOK" style keyword replies can trigger booking actions defined in the campaign (e.g., reply YES to add aeration on your route week), with confirmation message and Job creation.
- **Keyword-offer rules (reply-to-book) [MVP]:** a reply-to-book SMS creates real work and a real charge, so it runs under strict rules:
  1. **One open keyword offer per contact per number.** If a contact already has an open offer (for example aeration), a second campaign cannot attach a keyword action to the same number until the first expires or is answered. The second campaign falls back to a "Book it" link. This prevents an ambiguous "YES".
  2. **Offer expiry:** default 7 days after send, or the end of the service window if sooner. A YES after expiry gets "This offer has expired; here is today's price" with a link, not an automatic booking.
  3. **Accepted keywords:** YES, Y, BOOK, SI, SÍ, OK and close variants (case-insensitive, punctuation and emoji ignored). Anything else, including "yes but can you come Friday?", goes to the inbox as a conversation with the offer attached, so staff can book it with one click. The AI classifier may suggest "booking intent", but only an exact keyword books automatically.
  4. **Price lock and terms:** the booked Job uses the price, service and route week in the offer snapshot (`campaign_recipient.offer_snapshot_json`), even if the Price Book changed after send. The confirmation SMS restates price, week and cancellation terms and links to the portal ([06](06-customer-portal.md)) for details.
  5. **Payment and agreement prerequisites:** reply-to-book applies only to clients with an active Service Agreement (or accepted terms covering add-on work) and, if the Company requires one, a card on file in the Company's connected Stripe account ([08](08-payments-stripe.md)). Other recipients get a link to a one-page acceptance instead.
  6. **Idempotency and capacity:** a duplicate YES does nothing beyond a "You're already booked" reply. If the route week is full by the time the YES arrives, the client is offered the next available week, and the Job is created only after they confirm.
  7. **Undo:** the confirmation includes "Reply UNDO within 24 hours to cancel this booking." The undo keyword is never CANCEL, because CANCEL is a standard opt-out keyword that carriers and the messaging provider treat as STOP (4.21.2). A client who replies CANCEL is opted out, as they expect. Staff see an inbox prompt asking whether they also meant to cancel the booking.

#### 4.8.3 Direct mail [V1]

- Postcards (4x6, 6x9, 6x11) and letters via a print-and-mail API (e.g., Lob or PostGrid; selection in [20](20-architecture-security.md)), addressed to Clients, Leads or neighbor addresses (4.15). Variable data: name or "Neighbor at", personalized QR code, personalized price where measurable.
- Address verification (CASS/NCOA processing via provider), proofs, cost estimate per piece (provider pricing, as of Nov 2026, verify), scheduled drops, tracking events (in transit, delivered where provider offers it).
- Every mail piece carries a unique QR and optionally a campaign-specific tracking phone number for attribution (4.19).

#### 4.8.4 Seasonal campaign library [MVP basic, V1 full]

Rootline ships region-aware campaign templates curated by `platform_curator`, with send windows that adapt to the tenant's Region. A sample for a cool-season Midwest/Northeast Region (Zone 5-6) and the warm-season adjustments:

| Month | Campaign (cool-season Region) | Warm-season Region adjustment | Segment |
|---|---|---|---|
| Jan-Feb | Spring pre-booking with early-bird 5% off season prepay; renew maintenance agreements | Same, earlier (December-January) | Active and lapsed clients |
| Late Feb-Mar | Crabgrass pre-emergent (timed to soil temperature, often around forsythia bloom); program enrollment | Pre-emergent in late winter | Lawn program prospects |
| Mar-Apr | Spring cleanup; irrigation start-ups; mowing season sign-up | Spring cleanup earlier | Repeaters; irrigation owners |
| Apr-May | **Mulch season** with per-property cubic-yard quotes; bed edging | Mulch or pine straw | Mulch segment |
| May-Jun | Grub preventive; landscape lighting; patio season (hardscape design consults) | Warm-season aeration and sod (late spring to early summer for bermuda, zoysia, St. Augustine) | Program clients; design leads |
| Jul | Summer irrigation audits during drought; "design now, install in fall" | Irrigation audits | Irrigation owners |
| Aug-Sep | **Core aeration and overseeding** (cool-season prime window); fall planting | Fall pre-emergent; overseed with ryegrass where practiced | Aeration prospects |
| Oct | **Fall cleanup and leaf removal**; irrigation winterization; bulb planting; fall fertilizer | Fall cleanup lighter | Repeaters; irrigation owners |
| Nov | Holiday lighting installs; snow contracts; final leaf pickup; agreement renewals | Holiday lighting | Snow-eligible; lighting |
| Dec | Gift certificates [V1]; year-in-review "Yard Report Card" (Section 13); renewals | Same | All active |

Timing can be driven by **weather and growing-degree-day triggers** [V2] (e.g., send pre-emergent reminders when the Region's forecast soil temperature approaches 55 °F), using the weather service in [04](04-scheduling-dispatch-routing.md).

#### 4.8.5 Campaign approval and safety [MVP]

- Campaign states: `draft` -> `in_review` (optional approval step for users without `growth.campaigns.send`) -> `scheduled` -> `sending` -> `sent` (or `paused`, `canceled`, `failed`).
- Pre-flight checklist blocks send if: segment reachability is 0, required compliance elements are missing, the send would occur in quiet hours for more than 0 recipients without per-recipient scheduling, the template has unresolved variables, or a platform kill switch is active for the tenant.
- **Big-send confirmation:** sends over 1,000 SMS recipients or 10,000 email recipients require a typed confirmation and show the estimated SMS segments and any overage cost against the plan allowance ([22](22-business-model-pricing-gtm.md)).
- Undo window: scheduled campaigns can be canceled until the first batch starts; in-flight sends can be paused within seconds (batches of 100 SMS / 1,000 email).

### 4.9 Journeys: drip automations [MVP prebuilt, V1 builder]

Journeys are multi-step, time-based sequences built on the automation engine in [17](17-ai-copilot-automation.md) (trigger -> condition -> action), with marketing-specific steps.

- **Triggers:** lead created (by source), instant quote viewed but not booked, site visit booked, proposal sent/viewed/not signed after N days, proposal declined, job completed, visit completed, invoice paid, agreement expiring in N days, NPS response by score band, birthday/anniversary [V1], date field (e.g., `plants_installed_at` + 7 days), segment entry, manual enrollment.
- **Steps:** wait (duration or until weekday/time), wait-until-event (with timeout), branch (condition or A/B split), send email, send SMS, send portal notification, create task, assign owner, change Lead stage, add/remove tag, update field, enroll in other journey, webhook, AI step (e.g., draft personalized follow-up for human approval).
- **Goals and exits:** each journey has a goal event (e.g., proposal signed) that exits the contact; global exit on opt-out, complaint, or becoming a lost/won Opportunity as configured.
- **Collision rules:** a contact can be in at most 2 marketing journeys at once; transactional journeys are unlimited; marketing sends from journeys count toward frequency caps.
- **Prebuilt journeys [MVP]:**

| Journey | Steps (summary) |
|---|---|
| Speed-to-lead | 0 min: acknowledgment SMS/email with estimator name and next step; 5 min: if unassigned, escalate to `office_manager`; 2 h: if no response, second touch; day 1, 3, 7: follow-ups; exit on reply or booking |
| Instant quote abandonment | 1 h: "Your $46/visit quote is saved"; day 2: social proof (reviews from same neighborhood); day 5: last reminder; stops at 3 touches |
| Proposal follow-up | Day 2, 5, 10, 21 after send if not signed; estimator task on day 5; designer task if design project; owner alert for proposals over $25,000 |
| New client welcome | Portal invite, what to expect, crew intro, how to reach us, preference center link |
| Post-install plant care | Day 1: watering guide personalized to installed plants (from KB care data); day 7: check-in with photo request; day 30: care tips; month 11: warranty expiration reminder and "anything not thriving?" survey |
| Post-job review and referral | See 4.12 and 4.14 |
| Agreement renewal | 60/30/14 days before expiry; renewal proposal with price change explanation ([03](03-crm-sales-estimating-proposals.md), [07](07-invoicing-billing-contracts.md)) |
| Lost-proposal learning | 1 question survey "What made you choose differently?" 3 days after decline |

### 4.10 Newsletters [V1]

- Monthly or seasonal newsletter builder with AI-drafted sections from Company activity: "Projects we finished this month" (gallery items), "Plant of the month" (KB Region content), "Seasonal checklist" (regional calendar), "Crew spotlight" (opt-in employee profile), "Upcoming: book your fall aeration" (personalized offer block).
- Audience: all contacts with `marketing_email` consent; default send cadence cap 2 newsletters per month.
- RSS/blog-to-email automation: new blog posts compile into a digest.
- Archive pages on the website (indexable) for SEO.
- **Auto-draft cadence:** on the 20th of each month (configurable), the copilot assembles the next issue from the last 30 days of activity and the coming 45 days of the regional calendar. It routes the draft to `office_manager` for review. If there are fewer than 2 new gallery projects and no seasonal milestone, the copilot recommends skipping the issue rather than sending filler. A missed newsletter costs nothing; a boring one trains clients to ignore the Company.
- **Section variants by audience:** one issue, several variants chosen per recipient by segment rules. Maintenance clients get "What your crew is doing this month" (e.g., "Final mows the week of Nov 10; leaf cleanups run Nov 3-21"). Lawn-program clients get the next application step and watering guidance. Design-build prospects get project stories. Spanish-preference contacts get the `es-US` version. Each section has `audience_rule_json`; a section with no audience match is omitted for that recipient.
- **Commercial edition [V1]:** a quarterly "Property report" variant for `client_commercial` contacts, with per-Property visit counts, photos, completed enhancements, upcoming seasonal work (color rotations, snow readiness) and proposals awaiting approval. HOA board members and property managers forward it, and it doubles as a retention tool (see Beyond the brief, HOA board pack).
- **Plain-text and accessibility:** every issue ships a plain-text part, has live-text headings (no text baked into images) and alt text on every image, and passes the email pre-send checks in 4.8.1.
- **Metrics:** opens are shown but labeled unreliable, because mail privacy features inflate them. Success is measured on clicks, replies, bookings and revenue attributed within 14 days of send.

### 4.11 Win-back and upsell engine [V1]

A recommendation service that generates **Next Best Offers** per Client and feeds campaigns, journeys, the estimator's task list and the portal.

- **Signals:** service history and gaps vs the Company's catalog, property geometry (turf area, beds, trees, irrigation), installed plants and their age, regional calendar, agreement status, payment behavior, NPS, complaint history, engagement, similar-client purchase patterns within the tenant and (anonymized, opt-in) across Rootline tenants in the same Region [V2].
- **Offer rules (examples):** mowing client with at least 3,000 sq ft of cool-season turf and no lawn program -> 5-step program at personalized price; irrigation present and no start-up booked by April 1 -> start-up; plantings older than 4 years with shrubs -> pruning service; Design with unbuilt phase -> phase 2 proposal; snow Region, commercial lot, no snow agreement by October 1 -> snow contract; lapsed 13+ months -> win-back offer with "we miss you" credit capped by owner.
- **Propensity scoring:** each offer gets a predicted acceptance probability and expected margin (from historical acceptance in similar segments; falls back to rules when data is thin, e.g., under 200 historical offers). Offers ranked by expected margin x probability.
- **Churn risk score:** inputs include skipped visits, complaints, late payments, NPS drop, reduced service scope, competitor mentions in messages (AI classification). At-risk clients route to an `ops_manager` save task, not a marketing blast.
- **Guardrails:** max 1 upsell touch per client per 30 days across channels; suppressed when an open complaint exists, AR is more than 60 days past due, or a proposal is already pending for that service. Every offer is explainable ("Suggested because: 7,800 sq ft cool-season lawn, no aeration since 2024, neighbors on route bought aeration").

> **Competitive edge:** Service Autopilot is known for win-back and upsell drips, but reviewers report they demand heavy configuration. Rootline's engine starts with prebuilt, explainable rules that use property measurements and installed plants, then learns acceptance rates. The owner approves offers; they do not build workflows.

### 4.12 Review generation and reputation management

#### 4.12.1 Review requests [MVP]

- **Trigger:** Job completed (Project or Work Order) or every Nth completed Visit for recurring maintenance (default: after the 4th visit of the season and then at most once per 180 days).
- **Eligibility (uniform rules, no sentiment filtering):** contact has a channel available (email, or SMS with consent covering service messages); client has not been asked in the last 180 days; client has not already left a Google review that Rootline has matched. Eligibility **never** depends on the client's satisfaction, NPS score or complaint status, because selectively soliciting happy customers (review gating) violates Google policy ([BrightLocal guidelines](https://www.brightlocal.com/learn/review-management/dos-and-donts/review-platform-guidelines/), [Podium](https://www.podium.com/article/review-gating)). Owners can delay sends (e.g., until the invoice is paid) as a uniform rule for all clients.
- **Message:** short personalized ask with direct review link (Google "write a review" URL from the Place ID), crew lead's first name and a photo of the finished work. Optional private feedback link is shown **alongside** the public review link, never instead of it.
- **No incentives:** the product does not allow attaching discounts, credits, contests or rewards to review requests, and blocks template text that offers them, because Google prohibits incentivized reviews of any sentiment and may restrict profiles that receive them ([DAC Group](https://www.dacgroup.com/?p=159133), [Search Engine Roundtable](https://seroundtable.com/google-reviews-restrictions-business-profile-violations-38068.html)). Referral rewards (4.14) are separate and never tied to reviews.
- **No staff quotas:** Rootline does not provide per-employee review-count leaderboards (quotas and on-premises pressure are cited as prohibited practices). Crew recognition uses mentions in reviews and NPS (4.13) instead.
- **Platforms:** Google (primary). Facebook recommendations and Houzz as secondary links. **Yelp:** Rootline does not send Yelp review requests (Yelp discourages soliciting reviews); Yelp is monitor-only where data access allows.
- **Follow-up:** one reminder after 3 days if the link was not clicked; then stop.

#### 4.12.2 Reputation monitoring and replies [MVP Google, V1 others]

- **Google Business Profile connection:** OAuth connection to the Company's GBP location(s). Reviews are listed and replied to through the Business Profile APIs, which require Google to approve API access for Rootline's Cloud project (access is gated; quotas are 0 until approval) ([testimonial.to guide](https://testimonial.to/resources/google-business-profile-api)). Getting this approval is a launch dependency owned by `platform_engineer` (Section 14).
- **Matching:** reviews are matched to Clients by reviewer name and timing against recent review requests (confidence shown; manual link available).
- **Alerts:** new review of 3 stars or fewer triggers push/SMS to `owner` and `ops_manager` within 15 minutes and creates a service-recovery task with a 24-hour SLA.
- **AI reply drafts:** for every review, the copilot drafts a reply in the Company's voice that thanks the reviewer, references the specific service when known, never discloses private details (no addresses, prices or account information), and for negative reviews invites offline resolution with a named contact. Replies require human approval [MVP]; auto-post for 5-star reviews with short positive text is an opt-in [V1].
- **Review widgets:** reviews carousel and badge on the website and in proposals; displays the source and date; never edits review text.
- **Multi-location [V2]:** Companies with branches see reviews per location with roll-up.

#### 4.12.3 Listings consistency [V1]

- Check that name, address, phone, hours and website are consistent between Rootline Company profile, website, GBP and major directories; fix GBP fields via API; provide a checklist for others.
- **GBP posts:** publish seasonal offers and project photos to GBP as posts (4.16) where the API supports it.

### 4.13 NPS and surveys [MVP NPS, V1 survey builder]

- **Relationship NPS:** sent twice per year (default May and October) to active clients; one 0-10 question plus optional comment; commercial clients surveyed per contact role (property manager, board member).
- **Transactional CSAT:** 1-5 rating after specific events (install completion, irrigation repair, snow event for commercial); max 1 survey per client per 30 days across all survey types.
- **Closed loop:** detractors (0-6) create a follow-up task for the account owner with a 48-hour SLA; passives (7-8) get a "what would make it a 10?" follow-up; promoters (9-10) become eligible for referral asks (4.14). NPS never gates review requests (4.12.1).
- **Survey builder [V1]:** multi-question surveys (rating, choice, text), e.g., commercial annual account review, post-season snow survey, lost-proposal survey.
- **Reporting:** NPS by crew, service line, Region, client type and tenure; correlation of NPS with renewal and churn ([18](18-reporting-analytics.md)).
- **Crew feedback loop:** positive comments naming crew members are pushed to the crew app as "kudos" ([05](05-field-crew-mobile-app.md)).

<a id="414-referral-program-with-rewards-mvp-basic-v1-full"></a>

### 4.14 Referral program with rewards [V1]

- **Program configuration:** reward for referrer (account credit, gift card [V1], charity donation [V1], or free service such as one free mow), reward for referee (first-service discount or credit), qualification rule (referee's first invoice paid in full, minimum invoice total, within N days of referral), caps (max rewards per referrer per year), and program terms page auto-generated on the website.
- **Referral identity:** each Client gets a unique short link and code (e.g., `greenleafgrounds.com/r/JSMITH`), shareable from portal, emails, SMS and a printable card the crew can leave. Link opens the booking/quote flow with attribution preserved.
- **Lifecycle:** `invited` -> `lead_created` -> `qualified` (rule met) -> `reward_pending_approval` (optional) -> `reward_issued` -> (or `rejected`/`expired`/`reversed` if the referee refunds within 30 days).
- **Fraud checks:** referee cannot share address, phone, email or payment fingerprint with referrer; self-referral blocked; velocity limits; suspicious patterns flagged for owner review.
- **Accounting:** account credits are issued as Credit Memos ([07](07-invoicing-billing-contracts.md)) and posted to a configurable GL account in the [Ledger](09-accounting-ledger-integrations.md) (marketing expense or sales discount, owner's choice with CPA guidance). Gift cards are purchased through a rewards provider (e.g., Tremendous or Tango) on the Company's own payment method and booked as marketing expense.
- **Tax tracking:** cumulative rewards per recipient per calendar year are tracked and the `bookkeeper` is alerted when a recipient approaches the IRS information-reporting threshold for prizes and awards (verify current threshold with the CPA; Canadian treatment differs).
- **Partner referrals [V2]:** realtors, home builders, pool and fence companies, property managers get partner links with commission or reciprocal referral tracking; partner portal with lead status.
- **Referral ask timing:** promoters (NPS 9-10), clients who just accepted a completion sign-off, and clients whose review was 5 stars (the ask is for a referral, never contingent on the review).

> **Competitive edge:** Jobber's referral tool tracks referred leads, jobs and revenue and auto-applies credits. Rootline adds fraud checks, ledger-correct accounting of the reward, tax-threshold tracking, a printable crew-delivered referral card with QR, and route-aware "refer a neighbor on your street" offers that combine referral and density pricing (4.3.3).


### 4.15 Neighborhood marketing (route-aware) [V1]

When a crew works on a street, the neighbors see the result. Rootline turns every completed Visit into a targeted, compliant neighbor touch.

#### 4.15.1 Neighbor targeting engine [V1]

- **Trigger options:** Visit completed (default for installs and cleanups), Job started (for multi-day projects, with yard sign), or a scheduled weekly "route halo" batch (for recurring mowing routes).
- **Target set:** parcels within a configurable radius (default 150 m) or the same street segment, or same subdivision, from the parcel dataset. Exclusions: existing Clients, open Leads, addresses on the Company's physical do-not-market list, addresses contacted by neighbor marketing in the last 60 days (cooldown), parcels outside the service area, non-residential parcels (unless commercial targeting is on), and parcels where measured turf area is below the Company's minimum (e.g., under 1,500 sq ft for mowing offers).
- **Personalization:** for each target address, the instant quote engine (4.3) pre-computes a price where measurable ("Your neighbors at 14 Oak St. just had their beds refreshed. We can mow your lawn on Tuesdays for $44 per visit."). Owner sets which services are offered per campaign.
- **Channel rule:** neighbor outreach uses **physical channels only** (door hangers, mail, yard signs) and, [V2], privacy-safe geo-targeted digital ads. Rootline never texts or calls neighbors: there is no consent, and marketing calls/texts to numbers on the National Do Not Call Registry without an established business relationship expose the Company to TCPA liability.

#### 4.15.2 QR door hangers [V1]

- Generates print-ready door hanger PDFs (standard 4.25 x 11 in die-cut, with bleed) with **a unique QR code per target address** that opens a landing page pre-filled with the address and its instant quote. Batch print at an office printer on pre-cut stock, or order via a print vendor API [V2].
- **Crew app layer:** the target addresses appear as a "door hanger" layer on the crew's route map with a checklist ([05](05-field-crew-mobile-app.md)); the technician marks each as delivered (GPS-stamped), skipped ("No soliciting sign", "dog", "gate locked"). "No soliciting" addresses are auto-added to the do-not-market list.
- **Legal guardrail:** the app instructs crews to hang on doors or gates, never in or on mailboxes; placing unstamped material in mailboxes is prohibited by US federal law (18 U.S.C. 1725, verify) and similar rules apply in Canada.
- **Time accounting:** door-hanger time is logged as a non-billable activity code so marketing labor cost appears in campaign ROI ([15](15-team-hr-payroll.md), [09](09-accounting-ledger-integrations.md)).

#### 4.15.3 Neighbor postcards and USPS EDDM [V1]

- **Addressed neighbor postcards:** sent via the print-and-mail API to "Current Resident" or "Neighbor at {address}" with personalized QR and price. Owner names are not printed by default (privacy and accuracy).
- **EDDM (Every Door Direct Mail):** for broader saturation around job clusters, Rootline selects USPS carrier routes that overlap the Company's active job clusters and service area, shows household counts per route (residential vs business), and generates EDDM-compliant flat-size artwork and the indicia/mailing documentation. Postage estimates use current rates (third-party sources cite EDDM Retail at about $0.26 per piece and BMEU at about $0.259 from July 12, 2026, as of Nov 2026, verify against USPS Notice 123) ([MailPro](https://www.mailpro.org/post/eddm-printing), [Catdi](https://www.catdi.com/guides/eddm/retail-vs-bmeu)); EDDM Retail is commonly described as limited to 5,000 pieces per ZIP Code per day per mailer. Rootline either hands off print files to the Company's printer or orders print-and-drop through a partner [V2].
- EDDM pieces are not individually addressed, so attribution relies on a campaign QR, campaign tracking number and **matched-back attribution**: new Leads from addresses on the selected carrier routes within 60 days are counted as influenced.

#### 4.15.4 Yard signs [V1]

- During installs (with Client consent captured on the Proposal), crews place a branded yard sign with a QR to a **live project page** ("This patio is being built by Greenleaf Grounds; see the design and the finished photos soon") [V2 for live status]. Crew app reminds to retrieve signs after N days (default 14) and logs placement for municipal sign-ordinance or HOA compliance.

#### 4.15.5 Measurement with holdouts [V1]

- Each neighborhood campaign can reserve a random 10% holdout of eligible addresses that receive nothing. Lift = conversion rate of treated addresses minus conversion rate of holdouts over 60 days. This gives owners an honest answer to "do door hangers work?" rather than counting every neighbor who would have called anyway.

> **Competitive edge:** Housecall Pro's fall 2025 postcards target by ZIP code or demographic ([TechEdge AI](https://techedgeai.com/housecall-pro-rolls-out-fall-2025-ai-powered-update-to-supercharge-home-service-businesses/)). Rootline targets by **where the crew already is**, prices each neighbor's actual lawn, discounts for route density, puts the delivery list on the crew's map, and measures lift against a holdout. That is marketing that makes routes denser, which is what makes a maintenance company profitable.

### 4.16 Social auto-posting of before/afters [V1]

- **Connected accounts:** Facebook Page and Instagram professional account (Meta Graph API), Google Business Profile posts, LinkedIn Company Page for commercial-focused Companies [V2], TikTok [V3].
- **Before/after composer:** from gallery-eligible Jobs (consent required, 4.1.4), the system auto-pairs before/after photos, produces formats per channel (1080 x 1350 feed image, 1080 x 1920 story/reel slideshow with a slider wipe animation and the Company logo, GBP-sized image), drafts captions with neighborhood-level location only, relevant hashtags (#paverpatio #landscapedesign #[city]landscaping), plant names linked to the website plant pages, and a CTA link with UTM tags.
- **Approval queue and calendar:** posts land in a content calendar as drafts; the owner/office manager approves, edits or schedules. Auto-posting without review is opt-in per account [V2].
- **Cadence assistant:** suggests 2-3 posts per week in season, flags gaps, and avoids posting the same project twice within 90 days.
- **Privacy:** same redaction pipeline as the gallery (faces, plates, house numbers), no street names, and a 48-hour delay option so posts are not published while the crew is still near the property.
- **Engagement:** comments and DMs from Meta flow into the unified inbox (4.17).

### 4.17 Unified inbox [MVP]

One shared inbox for every conversation with prospects and clients, threaded per person, with assignment, SLAs and AI assistance.

#### 4.17.1 Channels [MVP core channels, V1 social and marketplace threads]

| Channel | Inbound | Outbound constraints | Priority |
|---|---|---|---|
| SMS/MMS (Company's 10DLC or toll-free numbers) | Yes | Consent and quiet-hour rules (4.21); STOP handling | [MVP] |
| Email (shared addresses such as `office@`, connected via forwarding or Gmail/Microsoft 365 OAuth) | Yes | Sent from Company domain; threading by Message-ID | [MVP] |
| Web chat (4.2.3) | Yes | Real-time while visitor is online; falls back to email/SMS (with consent) | [MVP] |
| Voice calls and voicemails (4.19); AI receptionist transcripts (4.18) | Yes | Call back from softphone [V1] | [MVP] calls and voicemails; [V1] AI receptionist transcripts |
| Customer Portal messages ([06](06-customer-portal.md)) | Yes | None beyond portal access | [MVP] |
| Facebook Messenger | Yes | Meta's standard messaging window is 24 hours after the person's last message; replies after that are restricted (Human Agent tag allows manual replies up to 7 days and cannot be used by bots) ([inro glossary](https://www.inro.social/glossary/24-hour-messaging-window), [eesel](https://www.eesel.ai/blog/ai-for-instagram-dms)) | [V1] |
| Instagram DMs | Yes | Same 24-hour window; Human Agent is the only tag available on Instagram per Meta's reference as reported by [eesel](https://www.eesel.ai/blog/ai-for-instagram-dms); conversations started from click-to-message ads may get a longer window (reported change in Sept 2026, single source, verify) ([Spur](https://www.spurnow.com/en/blogs/instagram-messenger-ads-7-day-messaging-window)) | [V1] |
| Google LSA message leads | Yes (via Google Ads API conversation resources) | Reply through LSA where the API does not support replies; deep link | [V1] |
| Google Business Profile chat | Not available | Google discontinued Business Profile chat and Business Messages in July 2024 ([Android Central](https://www.androidcentral.com/apps-software/google-shutting-down-maps-business-chat), [PPC Land](https://ppc.land/google-business-profile-chat-feature-to-sunset-on-july-31-2024)). Rootline's channel-adapter architecture can add a Google channel if Google reintroduces one; until then GBP traffic arrives via calls (tracking number on GBP) and website clicks. | n/a |
| Angi / Thumbtack messages | Where partner API supports it | Otherwise deep link to the marketplace thread | [V1] |
| WhatsApp Business | Yes | Template rules apply outside service windows | [V2] |

#### 4.17.2 Conversation model and behaviors [MVP]

- **Threading:** a Conversation belongs to a Contact (and its Client); all channels for that contact appear in one timeline, with channel badges. Commercial Clients show per-contact threads grouped under the account, filterable by Property.
- **Context panel:** client summary (properties, active agreement, next visit, open proposals, AR balance, NPS, last review, consent status per channel, preferred language), recent jobs with photos, quick actions (create Lead, create Work Order, reschedule visit, send payment link via [08](08-payments-stripe.md), send instant quote, start Design).
- **Statuses:** `open`, `pending` (waiting on client), `snoozed` (until time or event), `closed`. Reopens automatically on new inbound message.
- **Assignment rules (ordered, first match wins):** existing client owner/account manager -> territory (by Property location) -> topic classification by AI (sales, scheduling, billing, complaint, careers, vendor/spam) -> round robin among on-shift members of the matching team. Billing topics can route to `bookkeeper`; careers to the hiring manager ([15](15-team-hr-payroll.md)).
- **SLAs:** configurable first-response and next-response targets by priority and business hours. Defaults: new lead 5 minutes (business hours), existing client question 2 business hours, complaint 1 business hour, commercial client 4 business hours. After hours, the AI agents (4.2.3, 4.18; [V1]) provide first response where enabled; at [MVP], the A2 Inbox Triage and A3 Lead Follow-up agents in [17](17-ai-copilot-automation.md) draft or send templated first replies. SLA timers show on each conversation; breach escalates to the team lead and `owner` digest.
- **Collision detection:** "Maria is typing" indicators and soft locks when two users open the same conversation.
- **Internal notes and mentions:** @mention teammates (including `crew_lead` for job-specific questions [V1], who sees only that thread in the crew app).
- **Snippets:** saved replies with variables (e.g., `{{next_visit_date}}`, `{{crew_lead_first_name}}`), bilingual versions.
- **AI assist:** suggested replies grounded in client context and Company policies, one-click summarization of long threads, sentiment and urgency detection, auto-translation of inbound Spanish (or other languages) with the original preserved, and outbound translation with preview ("Send in Spanish").
- **Opt-out detection:** natural-language revocations ("please stop texting me", "no more messages", "ya no me manden mensajes") are classified and applied (4.21) and confirmed to the agent.
- **Conversions:** any message can be converted to a Lead, a Work Order request, a reschedule request, a change order request ([03](03-crm-sales-estimating-proposals.md)) or a support ticket, preserving the link.
- **Bulk actions:** close, assign, tag; bulk rain-delay notice to all clients on affected routes is initiated from dispatch ([04](04-scheduling-dispatch-routing.md)) and replies come back here.
- **Mobile:** inbox in the Company mobile app for owners and office staff [V1]; push notifications per assignment.
- **Ending shadow channels [V1]:** in most small landscape companies, clients text the owner's or crew lead's personal cell, and that history leaves with the employee. Rootline gives each `crew_lead` and `estimator` a **masked relay number**. Clients who text it reach the shared inbox thread, and the employee sees and answers it in the crew app without exposing a personal number. When an employee leaves, the number is reassigned to the account owner with full history. Staff can forward a screenshot or text from a personal phone to a Company "capture" number, and the copilot attaches it to the right Client thread with the original timestamp noted.
- **Commercial account etiquette:** a reply to a `client_commercial` contact defaults to the email channel with the property name in the subject ("Re: Maple Ridge HOA - Entrance beds"). Replies cc the account's designated notification contacts per the routing rules in 4.21.5, so the board treasurer is not left off a pricing thread.
- **Inbox-level kill switch:** `owner` can put any channel in "read-only" (for example during a 10DLC suspension). Outbound attempts then show why they are blocked and offer the alternate channel, instead of failing silently.

> **Competitive edge:** Podium and similar point inboxes thread SMS, web chat and reviews well, but they do not know the client's route day, AR balance, measured lawn or open proposal. Field-service suites know the job but usually offer only SMS and email threads. Rootline's inbox puts the operational context panel, instant quoting, payment links through the Company's own Stripe account and consent status next to every message. A CSR can answer "how much to aerate, and can you come with my mowing?" in one reply that is priced, scheduled and compliant.

<a id="418-ai-receptionist-voice-agent-v1-mvp-for-after-hours-lead-capture"></a>

### 4.18 AI receptionist voice agent [V1]

An AI voice agent that answers the Company's phone line 24/7 (or after hours, or on overflow), qualifies callers, books site visits, answers client questions from real account data and hands off to humans.

<a id="4181-answering-modes-mvp-after-hours-v1-other-modes"></a>

#### 4.18.1 Answering modes [V1]

| Mode | Behavior |
|---|---|
| After-hours only [V1] | Rings the office during business hours; AI answers outside them and on holidays. Before the receptionist ships, after-hours calls go to voicemail with transcription and missed-call text-back (4.19) [MVP]. |
| Overflow [V1] | Rings staff for N seconds (default 20) or when all lines are busy, then AI answers. |
| AI-first [V1] | AI answers every call, resolves routine requests, transfers when needed. |
| Seasonal surge [V1] | Automatically switches to AI-first when inbound volume exceeds a threshold (e.g., first warm week of spring, first snow event). |

<a id="4182-capabilities-v1-mvp-subset-greeting-new-inquiry-capture-message-taking-emergency-routing"></a>

#### 4.18.2 Capabilities [V1]

- **Greeting and disclosure:** "Thanks for calling Greenleaf Grounds. I'm the virtual assistant and this call is recorded. How can I help?" Disclosure of AI and recording is mandatory and not removable (Section 11).
- **Caller identification:** matches caller ID to Contacts; for identified clients, it can share non-sensitive information (next visit date, service day) directly and requires verification (one-time code by SMS to the number on file, or confirm service address plus last name) before discussing balances or making account changes.
- **New inquiries:** collects name, service address (with parcel match), services wanted, property type, timing, budget band, how they heard, preferred contact method and SMS consent (verbal consent recorded with timestamp and transcript excerpt as evidence); runs the instant quote for eligible services ("For a lawn about 6,200 square feet, weekly mowing would be $46 per visit"); books site visits on estimator calendars; sends an SMS or email confirmation with details.
- **Existing clients:** next visit, skip or reschedule within rules (e.g., cannot move a mowing visit more than 2 days or into a full route day), report an issue (missed spot, damaged sprinkler head) creating a ticket with callback SLA, request a new service, send a payment link by SMS/email ([08](08-payments-stripe.md)). The AI never takes card numbers by voice (keeps PCI scope at SAQ-A).
- **Commercial callers:** recognizes property manager contacts and multi-property accounts; logs service requests per Property; urgent issues (e.g., ice on a hospital walkway) route by emergency rules.
- **Emergency routing:** configurable keywords and intents (fallen tree on house, irrigation main break flooding, snow/ice emergency for contracted sites) trigger warm transfer to the on-call phone tree with a whispered summary; if unanswered, SMS page and callback task with 15-minute SLA.
- **Other intents:** job applicants (collect basics and send the careers link), vendors and solicitors (take message, no transfer), spam/robocalls (detect and end).
- **Languages:** English and Spanish at launch with automatic language detection; caller can switch mid-call; French-Canadian [V2].
- **Handoff to humans:** on request ("talk to a person", "operator"), on low confidence after 2 attempts, on negative sentiment escalation, or on configured intents. Warm transfer includes a whisper ("Caller is Dana Lee, existing client on Tuesday route, asking about a damaged downspout"); if no answer, AI takes a detailed message and creates a callback task.
- **Post-call:** recording, transcript, summary, intent, outcome (booked, lead captured, transferred, message taken, spam), sentiment, follow-up tasks; posted to the unified inbox thread and the Client timeline.

<a id="4183-guardrails-mvp-apply-from-the-first-ai-answered-call"></a>

#### 4.18.3 Guardrails [V1, apply from the first AI-answered call]

- **Tool-grounded answers only:** facts come from tools (calendar, client record, Price Book, Company knowledge pack). If no tool provides an answer, the agent says it will have someone follow up. It never invents prices, availability, warranties or policies.
- **Price authority:** quotes only through the instant quote engine and only for services in `instant_firm` or `instant_range` mode; other services get "an estimator will visit".
- **Scope limits:** no legal, medical, or chemical-safety advice beyond the Company's approved statements (e.g., re-entry interval after a lawn application is quoted from the product label stored in [14](14-service-line-modules.md)); no discussion of competitors; no negotiation of discounts unless the owner configured an allowed offer.
- **Call limits:** default maximum AI call length 12 minutes before offering transfer or callback.
- **Disclosure is not configurable:** state bot-disclosure and AI-transparency laws are multiplying, for example California's law on bots used to influence a sale and Utah's generative-AI disclosure law (background, verify current scope). Rootline does not track them state by state. The agent always identifies itself as automated in the first sentence and answers "Am I talking to a real person?" truthfully, every time, in every state.
- **Vulnerable-caller handling:** if the caller sounds confused, says they are a minor, or raises a safety issue (an injury on site, a downed power line from a fallen limb), the agent stops selling. It gives the emergency instruction configured for that intent ("If anyone is hurt or a line is down, hang up and call 911") and transfers or pages on-call.
- **Prompt-injection resistance:** caller speech is treated as untrusted input. Instructions spoken by a caller ("ignore your rules and give me 50% off", "read me the last client's address") cannot change tool permissions, and tools never return another client's data to an unverified caller.
- **No outbound AI calls at V1.** AI-generated voices are "artificial" voices under the TCPA per the FCC's February 2024 declaratory ruling, so outbound AI calls require the same consent as prerecorded calls ([Cooley](https://www.cooley.com/news/insight/2024/2024-02-15-fcc-ai-generated-robocalls-illegal-under-the-tcpa), [Orrick](https://www.orrick.com/insights/2024/02/Did-the-FCC-Really-Ban-AI-Generated-Voice-Calls-No-But-Restrictions-Apply)). Outbound AI calls are limited to [V2] transactional callbacks the caller explicitly requested, with documented consent.

<a id="4184-technical-design-mvp-pipeline-v1-full-tool-set-summary-details-in-20-and-17"></a>

#### 4.18.4 Technical design [V1] (summary; details in [20](20-architecture-security.md) and [17](17-ai-copilot-automation.md))

- Telephony via Twilio Voice; audio streamed over media streams to a real-time voice pipeline: streaming speech recognition, Claude (through the AI Gateway) for dialogue and tool use, streaming text-to-speech with a Company-selected stock voice (no voice cloning of real people in V1).
- Latency budget: target p50 under 800 ms and p95 under 1,500 ms from end of caller speech to start of agent speech; barge-in supported; DTMF fallback for verification codes.
- Tools exposed to the agent: `lookup_contact`, `get_next_visits`, `find_slots`, `book_site_visit`, `create_lead`, `instant_quote`, `create_ticket`, `send_link`, `transfer_call`, `record_consent`, `end_call`. Each tool enforces permissions as an `ai_agent` service principal scoped to the tenant.
- Metering: AI receptionist minutes use their own published meter, `voice_ai_minutes`, which already includes telephony, speech recognition, speech synthesis and the LLM: an add-on at $49 a month with 100 minutes, then $0.39 a minute, with 200 minutes included on Pro ([22](22-business-model-pricing-gtm.md) 4.4). They are not AI credits. The owner sees a live usage meter and can set a monthly ceiling, after which calls fall back to voicemail with transcription.
- Quality: every call gets an automatic QA score (greeting, disclosure, correct intent, booking accuracy, handoff) and 2% of calls (min 10/month) are sampled for owner review.

> **Competitive edge:** Housecall Pro's CSR AI and Jobber's AI Receptionist both answer and summarize calls; ServiceTitan's Contact Center Pro adds AI voice agents for larger shops. Rootline's receptionist can **quote a firm mowing price from the caller's address during the call**, knows the route day and crew, speaks Spanish, and handles commercial snow emergencies, with one published per-minute price instead of an opaque add-on price.

### 4.19 Phone system and call tracking [MVP basic, V1 full]

- **Numbers:** provision local or toll-free numbers in the US and Canada; port existing numbers [V1] (Rootline guides the Letter of Authorization and timing; porting the main line is optional, forwarding works on day one).
- **Call flows:** business hours, holiday schedule, IVR menu (optional, max 4 options, e.g., "1 for new service, 2 for existing clients, 3 for billing, 4 for snow emergencies"), ring groups, sequential/simultaneous ring to desk phones, softphone (WebRTC in web app [V1], mobile app [V1]) or personal cell (with the business caller ID).
- **Tracking numbers:** static tracking numbers per offline source (vehicle wrap, yard signs, EDDM campaign, door hangers, GBP listing, LSA forwarding is Google's own) and a **dynamic number insertion (DNI) pool** for website visitors so each session sees a unique number and calls map back to the session's source, keyword and landing page. Pool sizing rule: numbers = peak concurrent sessions x 1.2, minimum 4; number reuse after 30 minutes of session inactivity.
- **Whisper and labels:** staff hear "Call from Google Ads" before connecting; the call is labeled with source in the inbox.
- **Recording and transcription:** on by default with disclosure prompt (Section 11); recordings retained 13 months by default (configurable 30 days to 7 years), transcripts searchable.
- **Missed-call text-back [MVP]:** when a call to the main line is missed and the caller is not in the inbox already, send an SMS within 30 seconds: "Sorry we missed you, this is Greenleaf Grounds. How can we help? Reply here or request a visit at greenleafgrounds.com/request. Reply STOP to opt out." Sent only to mobile numbers (line-type lookup), within quiet hours, and as a direct response to the caller's own call; logged with consent basis `inbound_call_response` for that conversation only, not marketing consent.
- **Caller ID trust:** register business name for outbound caller ID display (CNAM) and ensure calls are signed with STIR/SHAKEN attestation through the carrier, so callbacks are not labeled "Spam Likely". Register Company numbers with the analytics-engine registration portals that the major US carriers' spam-labeling partners offer [V1]. Monitor outbound numbers for spam labels weekly, and rotate or remediate any flagged number. Branded caller ID (logo and name on the handset) is a [V2] item (see Beyond the brief).
- **Call analytics:** volume by hour, missed calls, answer rate, first-call booking rate, call outcomes by source.


### 4.20 10DLC brand and campaign registration per tenant [MVP]

US carriers require application-to-person (A2P) traffic on 10-digit long codes to be registered: a **Brand** (the business) and one or more **Campaigns** (use cases). Rootline registers each Company as an ISV customer through its messaging provider (Twilio Trust Hub / A2P APIs, [Twilio ISV onboarding guide](https://www.twilio.com/docs/messaging/compliance/a2p-10dlc/onboarding-isv-api.md)). This is not optional paperwork. Major US carriers moved from fining unregistered 10DLC traffic to blocking it outright in early 2025, and unverified toll-free traffic has been blocked since early 2024 (background, verify current carrier policy). A tenant that skips registration simply cannot text.

**Landscape use-case mapping (what Rootline registers by default):**

| Rootline message family | Registered campaign use case | Example sample message | Notes |
|---|---|---|---|
| On-my-way, appointment reminders, visit summaries, rain delays, invoice and receipt links | Account Notifications / Customer Care | "Greenleaf: Luis's crew is on the way, ETA 9:40-10:10 AM. Track: grnlf.co/t/8KQ2. Reply STOP to opt out." | Registered for every tenant at signup |
| Two-way conversations with prospects and clients (inbox, missed-call text-back) | Customer Care | "Greenleaf: Sorry we missed your call. How can we help? Reply STOP to opt out." | Covered by the same campaign where the provider allows mixed customer-care content |
| Seasonal promotions, upsells, win-back, referral asks | Marketing | "Greenleaf: Aeration + overseeding for your 6,200 sq ft lawn is $217 on your Tuesday route, week of Sept 15. Reply YES to book. STOP to opt out." | Registered only when the tenant enables SMS marketing; requires a published opt-in form |
| Small senders with low volume across all of the above | Mixed / Low-volume mixed | Combination of the above | Recommended for Companies under the provider's low-volume threshold |
| Snow-event alerts for commercial sites (24/7 opt-in) | Account Notifications | "Greenleaf: 2.5 in at Maple Ridge HOA, plows dispatched 3:10 AM. Reply STOP to opt out." | Opt-in captured per commercial contact |

- **Data collection (onboarding wizard):** legal business name exactly as registered with the IRS/CRA, EIN (or sole-proprietor path), business type, industry, address, website (the Rootline site works), authorized contact name, email, phone, and stock ticker if public. The wizard validates EIN format, flags mismatches with the website name, and explains that the legal name must match IRS records.
- **Brand type selection:** Rootline recommends the path by expected volume. Twilio describes Standard brands (with secondary vetting; a $41.50 per-secondary-brand fee is cited in Twilio's help center, as of Nov 2026, verify) and Low-Volume Standard brands that skip vetting at lower cost and lower throughput ([Twilio secondary vetting](https://support.twilio.com/hc/en-us/articles/4403988619163-Secondary-Vetting-for-A2P-10DLC), [Bandwidth guide](https://www.bandwidth.com/blog/how-to-register-with-10dlc-to-avoid-unnecessary-costs-in-2022/)). Companies without an EIN use the Sole Proprietor path, which has lower limits.
- **Campaign registration:** Rootline auto-drafts each campaign: use case (Customer Care + Account Notifications for transactional; Marketing for promotions; or Mixed for small senders), description, **opt-in flow description** with URLs to the exact website form and SMS terms page, sample messages (generated from the tenant's real templates, e.g., "Greenleaf: Your crew (Luis) is on the way, ETA 9:40 AM. Reply STOP to opt out."), opt-in/opt-out/help keywords and messages, embedded links and phone numbers flags, and age-gated/lending/etc. attestations (all "no" for landscapers).
- **Website compliance auto-fix:** carriers review the brand's website and opt-in. Rootline sites auto-publish an **SMS Terms** page (program name, message frequency, "Msg and data rates may apply", STOP/HELP instructions, privacy link) and a privacy policy stating that mobile numbers and SMS consent are not shared with third parties for marketing. For external sites, Rootline provides the snippets and a checklist and scans the site URL before submission [V1].
- **Status tracking:** states `draft` -> `brand_submitted` -> `brand_approved`/`brand_failed` -> `campaign_submitted` -> `campaign_approved`/`campaign_failed` -> `active` (numbers attached) -> `suspended` (carrier action). Failure reasons are translated into plain-language fixes ("Your website does not show SMS opt-in language; we added it, resubmit?"). Average review time shown as an estimate from platform history.
- **Before approval:** marketing SMS is disabled; transactional SMS can use a verified toll-free number as an interim path where the provider allows (verify current toll-free verification rules); email and portal notifications work immediately.
- **Fee handling (decided in [22](22-business-model-pricing-gtm.md) 4.4):** one-time brand registration and campaign vetting fees are absorbed by Rootline on annual Grow and Pro plans and passed through at cost, shown before submission, on Starter and monthly plans. One mixed-use campaign's monthly fee is included in every plan; additional campaigns are at cost. The first re-registration after a rejection is free.
- **Canada:** Canadian long-code traffic is not governed by the US 10DLC regime; Canadian numbers follow carrier-specific requirements (Open question, Section 14). Messages from US numbers to Canadian recipients and vice versa still follow the sender number's registration rules.
- **Platform view:** `platform_support` sees all tenants' registration states, rejection reasons and carrier error rates in the admin console ([19](19-platform-admin-portal.md)) and can resubmit on a tenant's behalf with audit.

### 4.21 Consent, preferences and messaging compliance (TCPA, CAN-SPAM, CASL) [MVP]

#### 4.21.1 Consent ledger [MVP]

- **Granularity:** consent is recorded per **Contact x channel (sms, voice, email, mail) x purpose (`transactional`, `marketing`)**, plus per-number for contacts with multiple phones. Transactional covers appointment reminders, on-my-way, visit summaries, invoices and receipts, service changes. Marketing covers promotions, seasonal campaigns, newsletters, upsells, win-back, referral asks.
- **States:** `unknown`, `opted_in`, `implied` (e.g., CASL implied consent from an existing business relationship, or an inbound call/text conversation scoped to responding), `opted_out`. Each state change is an immutable `ConsentEvent` with: source (`web_form`, `booking_flow`, `portal_checkbox`, `proposal_signature`, `verbal_recorded_call`, `paper_form_upload`, `keyword_optin`, `marketplace_inquiry`, `import_attested`, `stop_keyword`, `nl_optout`, `email_unsubscribe`, `staff_recorded`), disclosure text version hash and the text itself, timestamp, IP and user agent (web), recording/transcript reference (calls), actor, and evidence attachment.
- **Imports:** bulk imports of contacts require the importer to attest the consent basis per column; imported SMS marketing consent without evidence is stored as `unknown` (not sendable) unless the Company uploads evidence; a re-permission campaign by email can collect fresh consent.
- **Hard invariant:** the send pipeline checks consent at **send time** (not at schedule time) inside the same transaction that writes the outbound message record. No user, role, AI agent or API can send a marketing message to a contact whose state is not `opted_in` (or `implied` where the jurisdiction allows it for that channel), and no role can flip an `opted_out` to `opted_in` without a new consent event from the contact (e.g., they text START or check a box).

#### 4.21.2 Opt-out handling [MVP]

- **Keywords:** STOP, STOPALL, UNSUBSCRIBE, CANCEL, END, QUIT (plus provider-handled defaults) and Spanish equivalents (e.g., ALTO, PARAR, BAJA) are processed immediately and confirmed with a single confirmation message. HELP and AYUDA return Company name, contact info and opt-out instructions. START/UNSTOP re-subscribes.
- **Any reasonable means:** the FCC's revocation rules require honoring opt-outs made by any reasonable means and processing them within 10 business days (in effect since April 11, 2025); the FCC's 2026 order allows callers to designate an exclusive revocation method and narrows the "revoke all" requirement, with effective dates that sources report differently (as of Nov 2026, verify) ([Nixon Peabody](https://www.nixonpeabody.com/insights/alerts/2025/04/11/fcc-partially-delays-new-tcpa-consent-revocation-rules), [Mac Murray and Shuster](https://mslawgroup.com/delayed-again-fcc-pushes-back-tcpas-revoke-all-rule-to-january-31-2027/), [Crowell](https://www.crowell.com/en/insights/client-alerts/fcc-officially-adopts-amendments-to-tcpa-rules), [FCC 26-67](https://docs.fcc.gov/public/attachments/FCC-26-67A1.pdf)). **Rootline's design does not depend on the outcome:** it honors revocations from every channel (keyword, natural-language SMS, email reply, voice request on a recorded call, portal toggle, staff entry) **immediately**, far inside any regulatory window, and does not rely on exclusive-method designations.
- **Scope of revocation:** a STOP to a Company number suppresses all SMS from that number to that phone (carrier behavior and user expectation), including transactional. The client is then informed (via email or portal if available) that service notices will arrive by email/push, with an option to re-enable SMS for service notices only (reply START). Natural-language opt-outs that clearly target marketing only ("stop sending me promotions") revoke marketing only; ambiguous ones revoke all SMS and ask the client to clarify by email.
- **Reassigned numbers:** before the first message to a number that has not been messaged in 90+ days, query the FCC Reassigned Numbers Database (where enabled, [V1]) to avoid texting a new owner of the number; line-type lookup prevents SMS to landlines.

#### 4.21.3 Quiet hours, attempt limits and frequency [MVP]

- **Rule table maintained by `platform_curator`/compliance staff** in the admin console: federal default for telephone solicitations (no calls before 8 am or after 9 pm recipient local time) and stricter state rules (several "mini-TCPA" states restrict hours further and cap attempts per 24 hours; table maintained with counsel). **Strictest rule wins** when the contact's area code, Property location and known time zone disagree.
- **Defaults stricter than law:** marketing SMS only 9 am - 7 pm local Monday-Saturday, never on Sundays or federal/provincial holidays (tenant can narrow, not widen beyond legal limits); transactional messages allowed 7 am - 9 pm (on-my-way messages are triggered by the crew's departure and are allowed from 7 am because crews start early; snow-event notices for commercial contacts can be configured for 24/7 with opt-in).
- **Frequency caps:** default 4 marketing SMS and 8 marketing emails per contact per 30 days; caps visible in campaign reachability.
- **Seed rule table (background, verify with counsel before launch).** The engine stores each rule as data (`jurisdiction`, `applies_to` = calls/texts/both, `purpose` = solicitation/all, `window_start`, `window_end`, `days`, `max_attempts_per_24h_same_subject`, `registration_required`, `effective_from`, `source_url`, `reviewed_by`, `reviewed_at`), so counsel can update it without a deploy:

| Jurisdiction | Summary of rule as commonly described | Rootline handling |
|---|---|---|
| US federal (TCPA / FCC rules) | Telephone solicitations only 8 am-9 pm recipient local time; National DNC Registry applies to solicitations without an established business relationship or consent | Federal floor for every US contact |
| Florida (Florida Telephone Solicitation Act, as amended 2023) | Solicitation calls and texts 8 am-8 pm local; at most 3 on the same subject per 24 hours; texts get a 15-day cure period after a STOP reply before a suit can be filed | Default marketing window (9 am-7 pm) is already inside it; attempt cap enforced across SMS and calls per subject (campaign) |
| Oklahoma and Maryland (state telephone solicitation acts modeled on Florida's) | Similar 8 am-8 pm window and 3-per-24-hours cap | Same enforcement as Florida |
| Texas (SB 140, effective September 1, 2025) | Extends Texas's telephone-solicitation statute to text messages and other transmissions; that statute carries a seller registration requirement (with exemptions) and private enforcement through consumer-protection law | Tenants with Texas recipients see a compliance card: "Marketing texts to Texas numbers may require state registration unless an exemption applies. Confirm with counsel." Marketing SMS to Texas numbers stays off until the owner attests to registration or an exemption [V1] |
| Other states with "mini-TCPA" laws (for example Washington's texting statute and state DNC lists) | Varies: hours, attempt caps, state DNC lists, consent formalities | Added to the table as counsel reviews them; until a state is reviewed, the conservative default window applies |
| Canada (CRTC Unsolicited Telecommunications Rules; National DNCL) | Telemarketing calls only 9 am-9:30 pm weekdays and 10 am-6 pm weekends, recipient local time; National DNCL applies to telemarketing calls; commercial texts and emails fall under CASL (4.21.4) | Voice: CRTC window plus DNCL check for any staff-initiated sales call [V1]. SMS and email: CASL consent rules plus the default 9 am-7 pm window |

- **Attempt caps across channels:** the Florida-style "3 per 24 hours on the same subject" cap counts SMS and voice together. A campaign's SMS, the reminder SMS and a staff follow-up call about the same offer all count, so the send pipeline (5.11) checks a per-contact, per-subject attempt counter, not just the channel frequency cap.

#### 4.21.4 Email compliance [MVP]

- **CAN-SPAM:** every commercial email includes a valid physical postal address, a clear unsubscribe that works for at least 30 days, honored immediately (law allows 10 business days), accurate From and subject lines.
- **Mailbox-provider bulk sender requirements:** SPF, DKIM and DMARC alignment on the sending domain, one-click unsubscribe (RFC 8058 List-Unsubscribe-Post) on marketing mail, and complaint rates kept well below the 0.3% threshold Google publishes for bulk senders (background reference, verify current thresholds). Rootline enforces a tenant-level complaint-rate circuit breaker at 0.2% over a rolling 7 days (marketing sends pause; owner and `platform_support` notified).
- **CASL (Canadian recipients):** Commercial electronic messages to Canadian recipients require express or implied consent; implied consent from an existing business relationship expires (commonly 2 years after the last purchase or contract, 6 months after an inquiry; background reference, verify). Rootline computes CASL implied-consent expiry per contact and suppresses marketing email after expiry unless express consent exists; express consent requests are built into booking and portal flows. Unsubscribe processed immediately (CASL allows up to 10 business days). CASL covers commercial **text messages** as well as email, so the same consent, sender-identification and unsubscribe rules apply to marketing SMS to Canadian numbers (background, verify). Rootline evaluates CASL per contact address, not per Company location, so a US Company messaging a snowbird client's Canadian mobile number is covered too.
- **Quebec Law 25 and French language [V2]:** French-language marketing content for Quebec recipients and privacy notices as required (see [20](20-architecture-security.md)).

#### 4.21.5 Client preference center [MVP]

Accessible from every email footer, the portal ([06](06-customer-portal.md)) and by texting PREFS [V1]: toggles per channel and purpose, preferred language, preferred contact (for commercial: per contact role, e.g., invoices to `ap@`, service notices to the site manager), quiet-time preference, and "pause marketing for 3 months". Changes create ConsentEvents.

#### 4.21.6 Do-not-contact lists and DNC [MVP lists, V1 registry scrubbing]

- Company-level suppression lists by phone, email and physical address (for door hangers and mail).
- National Do Not Call Registry scrubbing applies to telemarketing calls and texts to people without an established business relationship or express consent. Rootline does not offer cold outbound calling or texting, so DNC scrubbing is used for staff-initiated outbound calls to Leads older than the EBR inquiry window (warnings in the softphone) [V1].
- Platform-wide suppression of numbers and emails reported for litigation-bait behavior is **not** implemented (fairness and accuracy concerns); instead, consent evidence makes every message defensible.

> **Competitive edge:** A TCPA demand letter to a 12-person landscape company asks three things: what the person agreed to, when, and what happened after they said stop. In most SMB tools the honest answer is a checkbox field with no disclosure text and a texting log in another system. Rootline answers with an immutable consent event (the exact disclosure text and its hash, IP or recording timestamp), the `consent_event_id` stamped on every message sent, and proof that the STOP was applied in under a second. The same design runs Florida-style attempt caps, Texas registration gating and CASL expiry from one data-driven rule table, so the owner never has to know those laws exist to stay inside them.

### 4.22 Client lifecycle communications (transactional) [MVP]

This module sends all client-facing transactional messages for the platform; other modules emit events and own the business logic.

| Message | Trigger (owning module) | Default channels | Rules |
|---|---|---|---|
| Booking/agreement confirmation | Proposal accepted or online booking ([03](03-crm-sales-estimating-proposals.md)) | Email + SMS | Includes service day, first visit week, portal link |
| Appointment reminder | Visit scheduled for one-time services, site visits, installs ([04](04-scheduling-dispatch-routing.md)) | SMS + email | 48 h and/or 24 h before (configurable); not sent for weekly mowing (see next row) |
| Recurring service notice | Start of season, service-day change, holiday shifts | Email + SMS | Weekly mowing clients get a season-start notice and changes only, not weekly reminders (they hate those) unless they opt in |
| Weather delay / reschedule | Dispatch declares rain day ([04](04-scheduling-dispatch-routing.md)) | SMS + push | Bulk, with new expected day; deduplicated if multiple delays in 24 h |
| **On-my-way** | Crew taps "Start driving" or geofence departure ([05](05-field-crew-mobile-app.md)) | SMS | Crew lead first name and photo (opt-in), ETA window from routing, live tracking link valid until arrival plus 30 min; suppressed for weekly mowing unless opted in; never shows other stops |
| Arrived / gate access | Arrival geofence | SMS (optional) | Useful for gated backyards and pets |
| **Running late / ETA change** | Routing recalculates ETA more than 30 minutes past the promised window ([04](04-scheduling-dispatch-routing.md)) | SMS | Sent once per visit with the new window; a second slip triggers an inbox task instead of another automated text |
| **Unable to service** | Crew marks visit blocked: locked gate, dog in yard, vehicle on lawn, standing water, client request at the door ([05](05-field-crew-mobile-app.md)) | SMS + email with photo | Photo and reason code attached; "Reply 1 to reschedule this week, 2 to skip to next visit"; billing outcome (trip charge or no charge) per agreement terms in [07](07-invoicing-billing-contracts.md) |
| **Prep instructions** | N days before services that need client action ([14](14-service-line-modules.md)) | SMS + email | Examples: "Flag sprinkler heads and invisible-fence lines before aeration on Sept 16", "Leave the irrigation controller and backflow accessible for your Oct 21 winterization", "Move cars off the drive by 6 am when snow exceeds 2 in"; content per service from template variables |
| **Pre-storm snow alert** | Forecast crosses the Company's trigger depth for contracted sites ([14](14-service-line-modules.md)) | SMS / email / push | Commercial contacts opt in to 24/7 alerts; residential per-push clients receive "Snow expected tonight; you're on the list" during allowed hours only |
| **Post-application care** | Lawn or plant health application completed ([14](14-service-line-modules.md)) | SMS + email | Product names, EPA registration numbers, re-entry and watering instructions ("Keep kids and pets off until dry; water in within 48 h"), required state posting confirmation |
| **Site visit / estimate appointment confirmation** | Site visit booked ([03](03-crm-sales-estimating-proposals.md)) | SMS + email | Estimator name, photo and short bio, what to have ready ("photos of drainage problem areas"), reschedule link; reminder 24 h before |
| **Visit summary** | Visit completed ([05](05-field-crew-mobile-app.md)) | Email (+ SMS link) | What was done (checklist), before/after photos, notes, materials used, next visit; lawn application notices with product names, EPA registration numbers and re-entry instructions where applicable ([14](14-service-line-modules.md)); commercial clients get per-property summaries or a daily digest |
| Pesticide pre-notification | Scheduled application where a state/municipal registry or client request requires notice ([14](14-service-line-modules.md)) | Per rule (SMS/email/call/sign) | Rule table per jurisdiction maintained by `platform_curator`; logs proof of notification |
| Snow event report | Snow event visit completed ([14](14-service-line-modules.md)) | Email/SMS | Time plowed, depth measured, salt applied, photos; commercial: per-site report for slip-and-fall documentation |
| Estimate/proposal sent and reminders | [03](03-crm-sales-estimating-proposals.md) | Email + SMS | Via journeys 4.9 |
| Invoice issued, payment receipt, payment failed, card expiring, statement | [07](07-invoicing-billing-contracts.md), [08](08-payments-stripe.md) | Email (+ SMS link) | Pay link uses the Company's connected Stripe account; dunning cadence owned by [07](07-invoicing-billing-contracts.md) |
| Plant warranty reminders | Warranty period ending ([03](03-crm-sales-estimating-proposals.md), [14](14-service-line-modules.md)) | Email | 30 days before expiry, with replacement request link |
| Agreement renewal | [07](07-invoicing-billing-contracts.md) | Email + SMS | 60/30/14 days |
| Portal invite, password reset, MFA | [06](06-customer-portal.md) | Email/SMS | Security templates are not editable by tenants beyond branding |

All transactional messages carry the Company's brand, use the client's preferred language and respect transactional consent and quiet hours; SMS versions always include the Company name.

**Transactional message rules (apply to every row above) [MVP]:**

- **Promotion-free transactional content.** A transactional message must not carry a promotional offer. Adding "Book aeration now!" to a visit summary turns it into a marketing message under consent rules and carrier use-case rules. The template linter blocks offer blocks in transactional templates. The one exception is a link to the portal, where offers may appear.
- **Collapse and dedupe:** if multiple events for the same client fire within 10 minutes (for example two Properties serviced back to back), they collapse into one message. A client never receives more than 3 automated transactional SMS per day; everything beyond that rolls into the email visit summary.
- **Channel fallback:** if SMS is opted out or undeliverable (landline, carrier error 30006-class), the message falls back to email, then to push or portal notification, and the fallback is logged on the visit.
- **Per-contact routing for commercial accounts:** `client_commercial` accounts route each message family to roles: visit summaries to the site manager, invoices and statements to AP, snow reports to the facilities manager and risk/insurance contact, proposals to the board or decision contact (see 4.21.5).

**A season of messages for a weekly maintenance client (default configuration):**

```mermaid
flowchart LR
    A["Feb: agreement renewal proposal (promos only with marketing consent)"] --> B["Mar: season-start notice with service day and crew"]
    B --> C["Apr: first visit summary with photos"]
    C --> D["Weekly: no reminder, visit summary email only"]
    D --> E{"Exception during the season?"}
    E -- "Rain day" --> F["Delay notice with new expected day"]
    E -- "Gate locked" --> G["Unable to service with photo and reschedule options"]
    E -- "Aeration booked" --> H["Prep instructions: flag sprinkler heads"]
    E -- "None" --> I["Monthly invoice or autopay receipt"]
    F --> D
    G --> D
    H --> D
    I --> J["Nov: final mow notice and fall cleanup schedule"]
    J --> K["Dec: Yard Report Card and renewal"]
```

### 4.23 Notification templates and localization [MVP]

- **Template registry:** every message is a `NotificationTemplate` keyed by `event_key` (e.g., `visit.on_my_way`), channel (`email`, `sms`, `push`, `portal`, `voice_prompt`, `mail`), audience (`client_residential`, `client_commercial`, internal role), and locale. Platform default templates are authored by Rootline (content team and `platform_curator` for horticultural content) and versioned; tenants override per event/channel/locale; overrides track the platform version they forked from and show a diff when the platform template changes.
- **Template language:** a safe, logic-light templating syntax (Liquid-style) with **typed variables** declared per event (e.g., `visit.eta_window_start: datetime`, `crew_lead.first_name: string`, `property.turf_area: area`); unknown variables fail validation at save, not at send. Formatting helpers: `{{ price | money }}`, `{{ area | area_units }}`, `{{ date | date: "long" }}`, `{{ visit.services | list }}`.
- **Preview and test:** render with sample data or a real record (permission-checked), SMS segment and cost preview, email client previews (desktop/mobile/dark), send test to self.
- **Localization:**
  - Locales at launch: `en-US`, `en-CA`, `es-US` (Latin American Spanish for US clients and crews); `fr-CA` [V2]. Fallback chain: contact locale -> Company default -> `en-US`.
  - Contact `preferred_language` detected from booking form, inbound messages (AI language detection) or set by staff.
  - Units and formats per locale and Company setting: imperial/metric (sq ft vs m², cubic yards vs m³), currency (USD/CAD) with correct symbol and decimal formatting, date and time formats, 12/24 h.
  - Tenant-authored templates can be machine-translated with a "review required" flag; untranslated tenant overrides fall back to the platform translation of the default template rather than sending English to a Spanish-preference client.
  - Glossary enforcement for landscape terms in Spanish (e.g., "aireación", "mantillo"/"mulch" per tenant preference, "resiembra", "poda") curated by the content team, so AI translation stays consistent.
- **Brand kit application:** logo, colors, sender name, reply-to, email footer, SMS signature, voice greeting.
- **Governance:** template changes are audited; security and legal templates (password reset, consent confirmations, STOP confirmations) are locked to branding-only edits.

### 4.24 Growth copilot, marketing calendar and budget [V1]

- **AI marketing plan:** each season (and on demand), the copilot proposes a plan: campaigns with segments, reachable counts, personalized offers, send windows from the regional calendar, expected bookings and revenue using the Company's historical conversion (or platform benchmarks for new tenants, labeled as estimates), cost in credits and mail spend, and capacity check against crew availability ([04](04-scheduling-dispatch-routing.md)) so the plan does not sell more aeration than the crews can do in the window. The owner approves campaign by campaign; nothing sends without approval.
- **Capacity-aware throttling:** if bookings from a campaign approach the capacity of the service window (e.g., 85% of aeration slots for the Sept 8-Oct 10 window), the campaign pauses remaining sends and switches CTA to "Join the waitlist / book spring".
- **Marketing calendar:** unified view of campaigns, journeys, social posts, mail drops, door-hanger runs and newsletters with conflicts and frequency-cap warnings.
- **Budget:** monthly marketing budget by channel, actual spend from GL tags and ad platforms, variance and ROI to date.
- **Benchmarks [V2]:** anonymized peer benchmarks from opted-in tenants (e.g., median aeration campaign booking rate in the Region), via [18](18-reporting-analytics.md).

### 4.25 Ledger and payments touchpoints [MVP core, V1 automation]

Growth moves real money: marketplace lead charges, print and postage bills, referral credits, gift certificates, booking deposits and tips. Every one of these lands in the built-in double-entry [Ledger](09-accounting-ledger-integrations.md) through the posting-rule registry that [09](09-accounting-ledger-integrations.md) owns. Client money moves only through the Company's **own connected Stripe account** ([08](08-payments-stripe.md)), and Rootline never holds client funds. Account codes below are [09](09-accounting-ledger-integrations.md)'s default Chart of Accounts; tenants can remap them, and QuickBooks/Xero-synced tenants map them to their own accounts.

| Growth event | Debit | Credit | Dimensions and rules | Priority |
|---|---|---|---|---|
| Print vendor bill for door hangers or postcards; EDDM postage | 6110 Advertising and Marketing | 2000 Accounts Payable (or 2040-2049 card account) | Bill or card line tagged with `marketing_source` and `marketing_campaign`; tagging is suggested by AI categorization from vendor and memo ("Lob", "USPS EDDM") | [MVP] manual tag, [V1] auto-suggest |
| Marketplace lead charge (LSA, Angi, Thumbtack) imported from the provider statement or card feed | 6120 Lead Generation and Referral Fees | Card or AP account | One line per statement period, with lead-level detail kept in `marketplace_lead_raw`; the ROI report uses lead-level cost | [V1] |
| Marketplace credit granted after a dispute | Card or AP account (or receivable from the marketplace) | 6120 Lead Generation and Referral Fees | Contra-expense on the same source dimension, so net cost per lead is right | [V1] |
| Referral reward as account credit | 6120 Lead Generation and Referral Fees (default) or 4910 Discounts and Allowances (if the CPA prefers contra-revenue) | 2180 Customer Credits and Unapplied Cash | Issued as a Credit Memo by [07](07-invoicing-billing-contracts.md); the choice of debit account is a tenant setting locked after first use in a fiscal year | [V1] |
| Referral reward as gift card bought from a rewards provider | 6120 Lead Generation and Referral Fees | Card or bank account used to fund the provider | Funded by the Company's own payment method; per-recipient annual totals tracked for information-reporting thresholds (4.14) | [V1] |
| "We miss you" win-back credit or campaign discount on an invoice | 4910 Discounts and Allowances | 1200 Accounts Receivable (via the invoice) | Discount line carries `marketing_campaign`, so campaign ROI uses net revenue | [MVP] |
| Gift certificate sold on the website ("Give Mom a spring cleanup") | 1050 Stripe Clearing - USD (1051 for CAD) | 2170 Gift Credit Liability | Charged as a direct charge on the Company's connected Stripe account; no expiry by default because many jurisdictions restrict gift-card expiry and dormancy fees; posting rule P29 in [07](07-invoicing-billing-contracts.md) | [V1] |
| Gift certificate redeemed | 2170 Gift Credit Liability | 1200 Accounts Receivable | Redemption creates a pending Client and Property on first use; unredeemed balances appear in [09](09-accounting-ledger-integrations.md)'s unclaimed-property report where state law requires | [V1] |
| Online booking deposit (e.g., 25% on a $1,200 cleanup) | 1050 Stripe Clearing | 2150 Customer Deposits | Applied to the first invoice by [07](07-invoicing-billing-contracts.md); refunds on cancellation follow the booking terms | [V1] |
| Tip left from a visit summary or review thank-you page | 1050 Stripe Clearing | 2160 Tips Payable | Cleared to payroll by [15](15-team-hr-payroll.md); tips are never treated as Company revenue and never reduce the crew's wage | [V1] |
| Door-hanger delivery time logged by crew | 5180 Non-billable Field Time (via payroll and applied labor) | Payroll accounts per [09](09-accounting-ledger-integrations.md) | Activity code `marketing_door_hanger`; the campaign ROI report adds this labor cost to the campaign's spend | [V1] |

**Rules:**

- **One source of truth for spend.** Campaign ROI reads spend from the Ledger first. Manual spend entries (4.5.3) are allowed only for spend that never passes through the books, such as an owner paying a printer in cash. They are flagged "unreconciled" until matched to a ledger line, so spend is never double-counted.
- **Dimension requirement:** this module asks [09](09-accounting-ledger-integrations.md) for an optional `marketing_source` / `marketing_campaign` dimension pair on 61xx accounts and on discount lines. The dimension is required (policy L14 style) only when the tenant turns on "strict marketing ROI".
- **QuickBooks/Xero tenants:** when the external ledger is the book of record, the same tags sync as QuickBooks Classes/Locations or Xero Tracking Categories per the mapping in [09](09-accounting-ledger-integrations.md), and spend is imported back for ROI.
- **No platform money in the middle:** gift certificates, deposits and tips are direct charges on the Company's connected Stripe account. Any Rootline application fee follows the policy in [08](08-payments-stripe.md) and is booked to 6152 Rootline Platform Fees, never netted silently against marketing spend.

> **Competitive edge:** Field-service suites report "revenue by lead source" from invoices, and QuickBooks holds the marketing expense, so nobody joins the two. Because Rootline's Ledger is built in, the door-hanger print bill, the EDDM postage, the crew's 25 minutes of delivery time, the referral credit and the LSA dispute credit all land on the same campaign dimension as the job-costed margin they produced. "Door hangers returned 8.7x" is then an accounting fact, not a guess.


---

## 5. Key user flows

### 5.1 Instant quote to booked recurring mowing (homeowner, self-serve)

Ships at [V1] with online booking (4.3).

1. Homeowner clicks "Get my price" on the Company site or a Google Ads landing page; attribution (UTM, `gclid`, DNI number) is captured.
2. Enters address; Rootline geocodes, matches the parcel and checks the service area.
3. Aerial measurement runs (cached if the Property was measured in the last 12 months); the lawn outline appears on the aerial image.
4. If confidence and bands allow, a firm per-visit price appears; otherwise a range or a site-visit booking.
5. Homeowner optionally adjusts the outline, picks frequency and start week; capacity assigns a route day or offers the waitlist.
6. Enters contact details; SMS consent is a separate, unchecked box.
7. E-signs the one-page service agreement; adds a card on file via Stripe Elements on the Company's connected account.
8. Rootline creates Client, Property, Contact, Service Agreement and Visits; the welcome journey and portal invite fire; the crew lead verifies conditions on the first visit.

```mermaid
flowchart TD
    A["Visitor enters address on Book Online"] --> B["Geocode and parcel match"]
    B --> C{"Inside service area?"}
    C -- No --> W["Waitlist and expansion analytics"]
    C -- Yes --> D["Aerial measurement: turf, beds, slope"]
    D --> E{"Confidence at least 0.85 and inside auto-quote band?"}
    E -- Yes --> F["Firm price shown with lawn outline"]
    E -- No --> G{"Range possible?"}
    G -- Yes --> H["Price range plus photo upload request"]
    G -- No --> I["Book a site visit on estimator calendar"]
    F --> J["Visitor adjusts outline (optional)"]
    J --> K{"Area changed more than 25 percent?"}
    K -- Yes --> H
    K -- No --> L["Choose frequency and start week"]
    L --> M["Capacity check: assign route day or waitlist"]
    M --> N["Contact details and separate SMS consent"]
    N --> O["E-sign service agreement"]
    O --> P["Card on file via Stripe Elements on Company account"]
    P --> Q["Create Client, Property, Agreement, Visits"]
    Q --> R["Confirmation, portal invite, welcome journey"]
    R --> S["Crew lead verifies conditions on first visit"]
```

### 5.2 "See your yard redesigned" lead magnet to design consult

```mermaid
sequenceDiagram
    autonumber
    participant HO as Homeowner
    participant Site as CompanySite
    participant Growth as GrowthService
    participant KB as PlantKB
    participant AI as AIGateway
    participant CRM as CRM
    participant Des as Designer
    HO->>Site: Upload yard photo, address and style
    Site->>Growth: Request after bot check, rate limit, moderation and service-area check
    Growth->>KB: Get Region palette for address and style
    KB-->>Growth: Plants filtered to Company palette
    Growth->>AI: Teaser set of 2 variants constrained by segmentation and depth
    AI-->>Growth: Teaser images and plant placements
    Growth-->>Site: Teaser at preview resolution (24 credits from widget cap)
    HO->>Site: Verify with one-time code, add name, phone and separate consents
    Site->>Growth: Unlock full sets
    Growth->>AI: Full 4-variant sets in chosen styles
    Growth->>CRM: Create Lead with photos, masks, dimensions, favorites and budget band
    Growth-->>HO: Email with full concepts and plant list
    CRM->>Des: Assign design lead and notify
    Des->>CRM: Start Design from concept
```

### 5.3 After-hours call answered by the AI receptionist

Ships at [V1] with the AI receptionist (4.18); at [MVP], the same call reaches voicemail with transcription and missed-call text-back (4.19).

```mermaid
sequenceDiagram
    autonumber
    participant Caller
    participant Tw as Telephony
    participant VA as VoiceAgent
    participant Tools as RootlineTools
    participant Staff as OnCallStaff
    Caller->>Tw: Calls main line after hours
    Tw->>VA: Media stream starts
    VA->>Caller: Greeting with AI and recording disclosure
    VA->>Tools: lookup_contact by caller ID
    Tools-->>VA: No match, new caller
    Caller->>VA: Wants weekly mowing at an address
    VA->>Tools: instant_quote for the address
    Tools-->>VA: Firm price 46 USD per visit, Tuesday route
    VA->>Caller: Quotes price and offers to book
    Caller->>VA: Agrees and asks for details by text
    VA->>Tools: record_consent verbal SMS transactional
    VA->>Tools: create_lead and send_link for booking
    alt Caller asks for a person
        VA->>Staff: Warm transfer with whisper summary
        Staff-->>Caller: Connected
    else No transfer needed
        VA->>Caller: Confirms next steps and ends call
    end
    VA->>Tools: Post transcript, summary and outcome to inbox
```

### 5.4 Route-aware neighborhood marketing after a completed install

1. Crew completes a front-bed renovation at 14 Oak St.; the Visit is marked complete with after photos.
2. The neighborhood engine finds 38 parcels within 150 m, excludes 6 clients, 2 open leads, 3 do-not-market addresses and 4 parcels contacted in the last 60 days, leaving 23 targets; 10% (2) go to the holdout.
3. Instant prices are computed for the 21 treated addresses (mowing and mulch offers).
4. Door hangers with per-address QR codes print at the office; the 21 addresses appear on Thursday's route map for the crew.
5. Crew marks each hanger delivered (or skipped with reason) in the app.
6. QR scans open the pre-filled quote page; Leads carry the campaign and touch.
7. After 60 days, the report shows treated vs holdout conversion, revenue and cost (print cost from GL, crew time from timesheets).

```mermaid
flowchart LR
    A["Visit completed with after photos"] --> B["Find parcels within radius"]
    B --> C["Exclude clients, open leads, DNC, cooldown, out of area"]
    C --> D["Random 10 percent holdout"]
    D --> E["Compute per-address instant prices"]
    E --> F{"Channel"}
    F -- "Door hangers" --> G["Print QR hangers and add to crew route map"]
    F -- "Postcards" --> H["Print and mail API"]
    F -- "EDDM" --> I["Carrier route selection and print files"]
    G --> J["Crew marks delivered or skipped"]
    H --> K["QR scans and calls tracked"]
    I --> K
    J --> K
    K --> L["Lift report vs holdout at 60 days"]
```

### 5.5 Review request without gating

```mermaid
flowchart TD
    A["Job completed or Nth visit of season"] --> B{"Uniform eligibility: channel available, not asked in 180 days, no matched review"}
    B -- No --> X["Skip and log reason"]
    B -- Yes --> C["Optional uniform delay, e.g. until invoice paid"]
    C --> D["Send request with Google link and optional private feedback link side by side"]
    D --> E{"Link clicked within 3 days?"}
    E -- No --> F["One reminder, then stop"]
    E -- Yes --> G["Await review sync"]
    F --> G
    G --> H{"New review received"}
    H -- "4 or 5 stars" --> I["AI drafts thank-you reply for approval"]
    H -- "3 stars or fewer" --> J["Alert owner within 15 minutes and create recovery task"]
    J --> K["AI drafts empathetic reply for approval"]
```

### 5.6 10DLC registration lifecycle

```mermaid
stateDiagram-v2
    [*] --> draft
    draft --> brand_submitted : wizard complete
    brand_submitted --> brand_approved : TCR and vetting pass
    brand_submitted --> brand_failed : rejected
    brand_failed --> draft : fix data and resubmit
    brand_approved --> campaign_submitted : campaigns auto-drafted
    campaign_submitted --> campaign_approved : carrier review pass
    campaign_submitted --> campaign_failed : rejected
    campaign_failed --> campaign_submitted : fix opt-in or samples
    campaign_approved --> active : numbers attached
    active --> suspended : carrier action
    suspended --> active : remediated
    active --> [*] : tenant offboarded
```

### 5.7 Consent state per contact, channel and purpose

```mermaid
stateDiagram-v2
    [*] --> unknown
    unknown --> opted_in : checkbox, keyword, verbal recorded, signed
    unknown --> implied : EBR or inbound inquiry where allowed
    implied --> opted_in : express consent captured
    implied --> unknown : implied consent expired
    opted_in --> opted_out : STOP, unsubscribe, natural language, staff entry
    implied --> opted_out : any revocation
    unknown --> opted_out : preemptive opt-out
    opted_out --> opted_in : new consent from the contact only
```

### 5.8 Lead marketplace ingest (Angi example) and speed-to-lead

```mermaid
sequenceDiagram
    autonumber
    participant Angi
    participant Hook as IngestWebhook
    participant Lead as LeadService
    participant Inbox
    participant Est as Estimator
    Angi->>Hook: POST lead JSON with x-api-key
    Hook->>Hook: Verify key and store raw payload
    Hook-->>Angi: 200 OK with JSON body
    Hook->>Lead: Normalize, geocode, dedupe
    alt Duplicate within 30 days
        Lead->>Lead: Merge and add attribution touch
    else New lead
        Lead->>Lead: Create Lead with source Angi and consent provenance
        Lead->>Inbox: Open conversation and send acknowledgment within 60 seconds
        Lead->>Est: Push and SMS alert with SLA timer
    end
```

### 5.9 Fall aeration campaign end to end (office manager, cool-season Region)

1. On August 4 the Growth copilot proposes "Fall aeration and overseeding": segment "Aeration prospects" (612 clients; 590 email-reachable, 455 SMS-reachable for marketing), personalized prices from measured turf, send window Aug 12 - Sept 20, capacity 380 aeration slots between Sept 8 and Oct 10 across 3 crews, expected bookings 140-190 (estimate from last year's 27% booking rate).
2. The `office_manager` edits the email (adds a before/after of overseeded lawn) and the SMS: "Greenleaf: Your 6,200 sq ft lawn is due for aeration + overseeding. $217 on your Tuesday route week of Sept 15. Reply YES to book. STOP to opt out."
3. Owner approves; campaign schedules per-recipient sends within quiet hours with a 20% A/B test on subject lines.
4. Replies of YES create aeration Visits on the client's route week (with conflict checks) and send confirmations; questions land in the inbox.
5. At 85% capacity the campaign auto-pauses remaining sends and switches the CTA to "Book spring aeration" for the rest.
6. Revenue and margin by campaign appear in reports after visits are invoiced; seed and labor costs come from job costing.

### 5.10 Referral lifecycle

Ships at [V1] with the referral program (4.14).

```mermaid
stateDiagram-v2
    [*] --> invited
    invited --> lead_created : referee uses link or code
    lead_created --> qualified : first invoice paid and rules met
    lead_created --> expired : no qualification in window
    qualified --> reward_pending_approval : approval required
    qualified --> reward_issued : auto-approve
    reward_pending_approval --> reward_issued : approved
    reward_pending_approval --> rejected : fraud or rule failure
    reward_issued --> reversed : referee refunded within 30 days
    reward_issued --> [*]
    rejected --> [*]
    expired --> [*]
    reversed --> [*]
```

### 5.11 Outbound message send pipeline (all channels)

```mermaid
flowchart TD
    A["Send request from campaign, journey, inbox, AI agent or module event"] --> B["Resolve template, locale and variables"]
    B --> C{"Variables valid and content screen passed?"}
    C -- No --> Z["Reject with reason to sender"]
    C -- Yes --> D["Consent check at send time for contact, channel, purpose"]
    D -- "Not allowed" --> Y["Suppress and log reason"]
    D -- Allowed --> E{"Inside the allowed send window for the recipient (strictest rule)?"}
    E -- "No, quiet hours" --> Q["Defer to next allowed window"]
    E -- Yes --> F{"Frequency cap, per-subject attempt cap and tenant kill switch OK?"}
    F -- No --> Y
    F -- Yes --> G["Write outbound message and outbox event in one transaction"]
    G --> H["Channel adapter sends via provider"]
    H --> I["Provider callbacks update status: delivered, failed, bounced, complained"]
    I --> J["Failures feed suppression and deliverability metrics"]
    Q --> D
```

---

## 6. Screens and wireframes

### 6.1 Screen inventory

| # | Screen | Surface | Primary roles | Priority |
|---|---|---|---|---|
| 1 | Growth home (dashboard: leads, sources, ROI, reviews, inbox SLA, campaigns) | Company web | `owner`, `office_manager` | [MVP] |
| 2 | Unified inbox (list, thread, context panel) | Company web + mobile | `office_manager`, `estimator`, `ops_manager` | [MVP] |
| 3 | Site editor (pages, blocks, theme, SEO, publish) | Company web | `owner`, `office_manager`, `designer` | [V1] |
| 4 | Domain and email DNS setup wizard | Company web | `owner` | [MVP] sending domain, [V1] site domains |
| 5 | Gallery review queue | Company web | `designer`, `office_manager` | [V1] |
| 6 | Online booking and pricing rules settings | Company web | `owner`, `office_manager` | [V1] |
| 7 | Public instant quote and booking flow | Company site (public, mobile-first) | Prospect | [V1] |
| 8 | Public "See your yard redesigned" (Dream Yard Visualizer widget; screens owned by [11](11-ai-design-mockups.md)) | Company site (public) | Prospect | [MVP] widget, [V1] portal-hosted page |
| 9 | Lead sources and attribution report | Company web | `owner`, `bookkeeper` (spend) | [MVP] |
| 10 | Segment builder | Company web | `office_manager` | [MVP] |
| 11 | Campaign builder (email, SMS, mail) with reachability and approvals | Company web | `office_manager`, `owner` | [MVP] |
| 12 | Journey builder and prebuilt journey library | Company web | `office_manager` | [MVP library, V1 builder] |
| 13 | Reviews and reputation (feed, replies, requests, widgets) | Company web + mobile | `owner`, `office_manager` | [MVP] |
| 14 | NPS and surveys | Company web | `owner`, `ops_manager` | [MVP] |
| 15 | Referral program setup and referral ledger | Company web | `owner`, `bookkeeper` | [V1] |
| 16 | Neighborhood marketing map | Company web | `owner`, `office_manager` | [V1] |
| 17 | Door-hanger route layer | Crew app | `crew_lead`, `technician` | [V1] |
| 18 | Social content calendar and post composer | Company web | `office_manager`, `designer` | [V1] |
| 19 | AI receptionist setup (modes, knowledge pack, routing, voice, test call) | Company web | `owner` | [V1] |
| 20 | Phone numbers, call flows, tracking numbers | Company web | `owner`, `office_manager` | [MVP] |
| 21 | Call log with recordings and transcripts | Company web | `owner`, `office_manager`, `estimator` (own) | [MVP] |
| 22 | Messaging compliance (10DLC status, consent settings, quiet hours, suppression) | Company web | `owner`, `office_manager` | [MVP] |
| 23 | Notification templates (event list, editor, preview, translations) | Company web | `owner`, `office_manager` | [MVP] |
| 24 | Client preference center | Customer Portal / email link | `client_residential`, `client_commercial` | [MVP] |
| 25 | Marketing calendar and budget; AI marketing plan | Company web | `owner` | [V1] |
| 26 | Platform messaging health, 10DLC queue, tenant kill switches | Platform Admin | `platform_support`, `platform_owner` | [MVP] |
| 27 | Platform template and seasonal campaign library | Platform Admin | `platform_curator` | [MVP] |
| 28 | Marketplace connections, scorecard and disputable-leads digest | Company web | `owner`, `office_manager`, `bookkeeper` | [V1] |
| 29 | Gift certificates (designs, sales, balances, redemption) | Company web + public site | `owner`, `office_manager`, `bookkeeper` | [V1] |
| 30 | Quiet-hour and state-rule table, with counsel review status | Platform Admin | `platform_support`, `platform_owner` (compliance staff) | [MVP] |

### 6.2 Unified inbox (Company web)

```text
+----------------------------------------------------------------------------------------------------+
| Rootline  | Inbox                                               [Search people, messages]  (bell) MO |
+-----------------+-------------------------------------------+--------------------------------------+
| VIEWS           | Dana Lee  * existing client  [SMS] [Call] | CLIENT                               |
| > Mine (7)      |-------------------------------------------| Dana Lee   Residential   since 2023  |
|   Unassigned (3)| Tue 7:42 AM  SMS in                       | 88 Maple Ct, Westfield  (Zone 6a)    |
|   New leads (5) | "Hi - the crew skipped the side yard      | Weekly mowing  Tue  Crew 2 (Luis)    |
|   SLA at risk(2)|  last week. Also can you do aeration?"    | Turf 6,200 sq ft  Irrigation 6 zones |
|   Billing (1)   |                                           | AR: $0.00   NPS: 9 (May)             |
|   Spanish (2)   | Tue 7:43 AM  AI suggested reply  [Use]    | SMS: service ON  marketing ON        |
|   Closed        |  "Sorry about that, Dana! I'll have Luis   | Email: ON   Lang: EN                 |
|                 |   cover the side yard Tuesday. Aeration +  |--------------------------------------|
| CHANNELS        |   overseeding for your lawn is $217 on     | NEXT VISIT  Tue Sep 9  (mowing)      |
|  SMS  Email     |   your route week of Sep 15. Book it?"     | OPEN: none                           |
|  Chat Calls     |                                           |--------------------------------------|
|  FB   IG  LSA   | Mon 4:10 PM  Visit summary sent  [view]   | QUICK ACTIONS                        |
|  Portal  Angi   | Mon 4:02 PM  Call 2:31  [recording]       | [+ Work order]  [Instant quote]      |
|                 |   Summary: asked about grub control       | [Reschedule]    [Payment link]       |
| SLA             |-------------------------------------------| [Create lead]   [Start design]       |
|  First resp 2h  | [Internal note]  [Snippet]  [Translate]   |--------------------------------------|
|  Breach in 41m  | +---------------------------------------+ | RECENT JOBS                          |
|                 | | Type a reply...                       | |  Sep 2  Mowing     [3 photos]        |
| Assigned: Maria | +---------------------------------------+ |  Aug 26 Mowing     [2 photos]        |
| Status: Open v  | Send via: (SMS v)   [Send]  [Send+close] |  Apr 14 Spring cleanup  $385         |
+-----------------+-------------------------------------------+--------------------------------------+
```

Behavior notes: the AI suggestion uses the instant quote engine and route calendar; "Use" inserts it for editing, never auto-sends. SMS marketing status shown so staff know whether a promotional reply is allowed (an offer in reply to the client's own question is a response to their inquiry; logged accordingly).

### 6.3 Campaign builder with reachability and personalized offer

```text
+----------------------------------------------------------------------------------------------------+
| Campaigns > Fall aeration + overseeding 2026                      Status: Draft  [Preview] [Submit]|
+--------------------------------------+-------------------------------------------------------------+
| 1 AUDIENCE                           | 3 CONTENT                         Channel: [Email] [SMS]    |
| Segment: Aeration prospects (dyn.)   | +---------------------------------------------------------+ |
|  612 clients                         | | [LOGO] Greenleaf Grounds Co.                            | |
|  Email reachable ......... 590       | | Hi {{contact.first_name}},                              | |
|  SMS marketing reachable . 455       | | Your {{property.turf_area | area_units}} lawn is ready  | |
|  Suppressed: complaint 9, AR>60d 14  | | for core aeration + overseeding.                        | |
|  Holdout (10%) ........... 61        | | +-----------------------------------------------------+ | |
|                                      | | | PERSONALIZED OFFER BLOCK                            | | |
| 2 SCHEDULE                           | | | Aeration + overseed  6,200 sq ft      $217          | | |
| Window: Aug 12 - Sep 20              | | | Your route week: Sep 15 (Tuesday)   [ Book it ]     | | |
| Send-time optimization: ON           | | +-----------------------------------------------------+ | |
| Quiet hours: recipient local 9a-7p   | | [Before/after image]  [Review quote: "Lawn came back..."]| |
| A/B subject: 2 variants on 20%       | +---------------------------------------------------------+ |
|                                      | SMS (143 chars, 1 segment, GSM-7)                           |
| 4 CAPACITY GUARD                     | "Greenleaf: Your 6,200 sq ft lawn is due for aeration +     |
| Slots Sep 8 - Oct 10: 380            |  overseeding. $217 on your Tuesday route wk of Sep 15.      |
| Pause at 85% booked: ON              |  Reply YES to book. STOP to opt out"                        |
| Forecast bookings: 140-190 (est.)    | Reply keyword YES -> create aeration visit on route week    |
|                                      |                                                             |
| 5 COST                               | PRE-FLIGHT  [ok] opt-out text  [ok] company name            |
| Email: included  SMS: 455 segments   |             [ok] variables  [!] 3 contacts lack measurement |
+--------------------------------------+-------------------------------------------------------------+
```

### 6.4 Public instant quote (mobile, Company-branded)

```text
+------------------------------------+
| [LOGO] Greenleaf          (Call)   |
|------------------------------------|
| Your lawn at 88 Maple Ct           |
| +--------------------------------+ |
| |  aerial image                  | |
| |    ######## <- lawn outline    | |
| |    ##    ##    (drag points)   | |
| |    ########                    | |
| +--------------------------------+ |
| Measured lawn: 6,200 sq ft         |
| [Looks right]  [Edit outline]      |
|------------------------------------|
| Weekly mowing, edging, blowing     |
|   $46 per visit                    |
|   Tuesdays, Apr - Nov (30 visits)  |
|   Firm price. No site visit.       |
| ( ) Every other week   $58 / visit |
|------------------------------------|
| Add-ons                            |
| [ ] Aeration + overseed   $217     |
| [ ] 5-step lawn program  $295/yr   |
| [ ] Spring cleanup     $280-$360   |
|------------------------------------|
| Start week: [ Apr 6  v ]           |
|                                    |
| [  Continue to book  ]             |
| 4.9 stars, 212 Google reviews      |
+------------------------------------+
```

### 6.5 Neighborhood marketing map

```text
+----------------------------------------------------------------------------------------------------+
| Growth > Neighborhood > "Oak St bed renovation halo"                    [Holdout 10%] [Generate]   |
+---------------------------------------------------------------+------------------------------------+
|  MAP (satellite)                                              | TARGETS                            |
|                                                               | Radius: 150 m   Street segment [x] |
|    o  o  [C]  o  o        o = target   [C] = client           | Parcels found ............ 38      |
|    o  [*]  o  x  o        [*] = this job  x = excluded        | - Clients ................. 6      |
|    o  o  o  [C] o         h = holdout                         | - Open leads .............. 2      |
|    h  o  x  o  o                                              | - Do-not-market ........... 3      |
|                                                               | - Contacted < 60 days ..... 4      |
|  Route overlay: Thu Crew 2  (stops 7-11 nearby)               | Treated 21   Holdout 2             |
|                                                               |------------------------------------|
|                                                               | OFFER                              |
|                                                               | [x] Weekly mowing (instant price)  |
|                                                               | [x] Mulch refresh (cu yd estimate) |
|                                                               | CHANNEL                            |
|                                                               | (o) Door hangers via Crew 2 Thu    |
|                                                               | ( ) Neighbor postcards ~$1.10 ea   |
|                                                               | ( ) EDDM routes  (see carrier map) |
|                                                               |------------------------------------|
|                                                               | Est. cost: 21 hangers + 25 min crew|
|                                                               | [Print PDF] [Send to crew route]   |
+---------------------------------------------------------------+------------------------------------+
```

(The postcard per-piece cost shown is an illustrative placeholder computed from the print provider's live price at generation time.)

### 6.6 Growth home: sources and ROI (owner)

```text
+----------------------------------------------------------------------------------------------------+
| Growth  |  Season to date (Mar 1 - Nov 7, 2026)   Compare: last season v    Attribution: First touch v|
+----------------------------------------------------------------------------------------------------+
| Leads 1,184 (+18%) | Booked 512 | Won value $1.42M | Collected $1.11M | Gross margin 41% | CAC $96 |
+----------------------------------------------------------------------------------------------------+
| SOURCE            Leads  Won  Won value   Spend     CAC    Margin $   ROI    Speed-to-lead (median) |
| Google organic     311   142   $402k        $0       -     $171k      -        1m 50s               |
| Google LSA         206    71   $118k   $14,920    $210     $46k     3.1x       0m 40s (AI)          |
| Instant quote web  188   121   $164k    $3,100     $26     $66k    21.3x       instant              |
| Client referrals    97    61   $236k    $2,440     $40     $104k   42.6x       3m 10s               |
| Door hangers        64    22    $31k    $1,380     $63     $12k     8.7x  lift +3.4 pts vs holdout |
| Angi               143    29    $41k    $8,700    $300     $15k     1.7x       0m 55s               |
| Yard redesign AI    52    14   $268k      $610     $44     $97k   159x        4m 20s               |
| ...                                                                                                |
+----------------------------------------------------------------------------------------------------+
| Reviews: 4.9 (212)  +37 this season   NPS 64   Inbox SLA met 94%   AI receptionist: 318 calls, 61 bookings |
+----------------------------------------------------------------------------------------------------+
```

(All numbers in wireframes are illustrative sample data. ROI = job-costed gross margin attributed to the source divided by spend; CAC = spend divided by won clients.)

### 6.7 Messaging compliance center (Company web)

```text
+----------------------------------------------------------------------------------------------------------+
| Settings > Messaging compliance                                        Health: GOOD  [Run check]         |
+--------------------------------------------------+-------------------------------------------------------+
| 10DLC REGISTRATION (US)                          | CONSENT SNAPSHOT       SMS svc  SMS mkt  Email mkt    |
| Brand: Greenleaf Grounds Co.                     | Opted in                1,912      604      1,488     |
|   EIN ok   Website ok   Status: APPROVED         | Implied (EBR, CASL)         -        -        311     |
| Campaign 1  Account notifications   ACTIVE       | Unknown (no evidence)     188    1,496        102     |
|   Numbers: main, 3 tracking, 2 relay             | Opted out                  41       96         87     |
| Campaign 2  Marketing               ACTIVE       | [Re-permission email to 1,496 unknown]                |
|   Opt-in form: greenleafgrounds.com/sms [view]   |-------------------------------------------------------|
|   SMS terms page: published [view]               | QUIET HOURS, CAPS AND STATE RULES                     |
|--------------------------------------------------| Marketing SMS: 9:00a-7:00p Mon-Sat, local             |
| CARRIER HEALTH (last 30 days)                    | Transactional: 7:00a-9:00p, local                     |
| Delivered 98.7%  Filtered 0.4%  Failed 0.9%      | FL / OK / MD: 3 per 24h per subject      [on]         |
| Marketing opt-out rate 0.8%  (breaker at 2%)     | Texas marketing SMS: OFF  [Attest registration]       |
| Top error: 30006 landline/unreachable (22)       | Caps: 4 mkt SMS and 8 mkt email per 30 days           |
|--------------------------------------------------|-------------------------------------------------------|
| CANADA (CASL)                                    | EVIDENCE                                              |
| Implied consent expiring in 30 days: 37          | [Export consent ledger CSV]  [Look up a number]       |
| [Request express consent]                        | Last STOP processed 2 min ago (0.6 s to apply)        |
+--------------------------------------------------+-------------------------------------------------------+
```

Behavior notes: everything on this screen is computed from the consent ledger, the 10DLC records and provider callbacks (no manual status fields). "Attest registration" for Texas opens a form that records who attested, which exemption or registration number applies and when it expires, and only then enables marketing SMS to Texas numbers (4.21.3). The re-permission button builds an email campaign to `unknown` contacts with a single consent checkbox; it never sends SMS to them.

### 6.8 AI receptionist call detail (Company web)

```text
+----------------------------------------------------------------------------------------------------------+
| Calls > Sat Oct 3, 8:12 PM  (614) 555-0199 -> Main line             Handled by: AI receptionist          |
+--------------------------------------------------+-------------------------------------------------------+
| OUTCOME: Design consult booked, Mon 10:30, Ana   | TRANSCRIPT                  [Play 4:12]  [EN/ES]      |
| Intent: new inquiry, paver patio + plantings     | AI: Thanks for calling Greenleaf. I'm the             |
| Source: Google Ads (DNI) 'paver patio near me'   |     virtual assistant and this call is recorded.      |
| Sentiment: positive     QA score: 96 / 100       | Caller: We want a patio out back, maybe 400           |
|--------------------------------------------------|     square feet, and new beds around it.              |
| CAPTURED                                         | AI: I can book a free design consultation.            |
| Name: Priya Shah (new contact)                   |     What is the property address?                     |
| Address: 41 Birch Ln, Dublin OH (parcel ok)      |     ...                                               |
| Budget band: $15k-$30k     Timing: spring        | AI: May I text you the confirmation and               |
| SMS consent: transactional, verbal, 20:16:08     |     reminders for this appointment?                   |
|   evidence: transcript 03:41-03:49 [play]        | Caller: Yes, please text me.                          |
|--------------------------------------------------|-------------------------------------------------------|
| FOLLOW-UPS                                       | TOOLS CALLED                                          |
| [x] Lead L-2291 created, assigned to Ana         | lookup_contact -> no match                            |
| [x] Confirmation SMS sent 20:17                  | find_slots(design_consult, 43017) -> 6 slots          |
| [ ] Email 'See your yard redesigned' link        | book_site_visit -> Mon 10:30, Ana                     |
| [Listen] [Flag for coaching] [Reassign]          | create_lead, record_consent, send_link                |
+--------------------------------------------------+-------------------------------------------------------+
```

Behavior notes: the consent evidence link jumps the recording to the exact seconds where consent was given, which is what counsel asks for first in a TCPA dispute. "Flag for coaching" adds the call to the QA sample (4.18.4). Tool calls are shown so the owner can see that the price or slot came from the system, not from the model. The confirmation SMS at 20:17 falls inside the 7 am-9 pm transactional window; a call after 9 pm would get an email confirmation immediately and an SMS at 7 am.

### 6.9 Notification template editor with localization (Company web)

```text
+----------------------------------------------------------------------------------------------------------+
| Templates > visit.on_my_way   SMS   client_residential      Locale: [en-US] [es-US *] [en-CA]            |
+--------------------------------------------------+-------------------------------------------------------+
| PLATFORM DEFAULT v7  (override forked from v5)   | PREVIEW   Record: Dana Lee, Tue visit [change]        |
| [View diff v5 -> v7]   [Adopt v7 changes]        | +----------------------------------------------+      |
| TENANT OVERRIDE  es-US   Status: needs review    | | Greenleaf: Luis y su equipo van en camino.   |      |
| +--------------------------------------------+   | | Llegada 9:40-10:10 AM. Siga: grnlf.co/t/8K   |      |
| | {{company.short_name}}: {{crew_lead.       |   | | Responda STOP para no recibir mensajes.      |      |
| | first_name}} y su equipo van en camino.    |   | +----------------------------------------------+      |
| | Llegada {{visit.eta_window | time_range}}. |   | 128 chars   GSM-7   1 segment of the plan allowance   |
| | Siga: {{visit.tracking_link}}. Responda    |   |-------------------------------------------------------|
| | STOP para no recibir mensajes.             |   | CHECKS                                                |
| +--------------------------------------------+   | [ok] Variables typed and resolved (4 of 4)            |
| VARIABLES  (typed, insert with /)                | [ok] Company name present   [ok] STOP text            |
| company.short_name     string                    | [ok] No promotional content (transactional)           |
| crew_lead.first_name   string                    | [ok] Spanish glossary terms                           |
| visit.eta_window       time range                | [!] Translated by AI: review before activating        |
| visit.tracking_link    url (expires +30 min)     |-------------------------------------------------------|
|--------------------------------------------------| [Send test to me]  [Approve and activate]             |
| [Revert to platform default]                     | Audit: last edited by Maria O., Nov 4                 |
+--------------------------------------------------+-------------------------------------------------------+
```

Behavior notes: the editor refuses to save a template with an unknown variable, a missing STOP line on an SMS that requires it, or an offer block in a transactional template (4.22). "Adopt v7 changes" merges the platform's improved default into the tenant override and shows a three-way diff (platform v5, platform v7, tenant override). AI-translated overrides stay in "needs review" and the platform translation is used until a human approves (4.23).

---

## 7. Data model

All tables carry `tenant_id` (the Company) with Postgres row-level security, `created_at`, `updated_at`, `created_by` and soft-delete where noted (see [20](20-architecture-security.md)). Entities owned by other modules (Company, Client, Contact, Property, Lead, Job, Visit, Invoice) are shown only with the fields this module relies on. Geometry uses PostGIS types; embeddings for message search and photo pairing use pgvector.

### 7.1 Key entities

| Entity | Purpose | Key fields and rules |
|---|---|---|
| `site` | A Company website | `template_key`, `theme_json`, `default_locale`, `status` (draft/published/suspended), `published_version_id` |
| `site_page` | Page within a site | `page_type` (home, service, service_area, project, plant, blog, legal, booking, lead_magnet), `slug` unique per site and locale, `content_json` (typed blocks), `seo_json`, `indexable`, `status` |
| `site_domain` | Custom hostnames | `hostname` unique globally, `kind` (primary, redirect, portal), `verification_status`, `tls_status`, `dns_records_json` |
| `sending_domain` | Email authentication | `domain`, `spf_ok`, `dkim_ok`, `dmarc_policy`, `warmup_stage` |
| `showcase_consent` | Permission to publish job photos | `client_id`, `job_id` nullable, `level` (granted_named_area, granted_anonymous, denied), `disclosure_version`, `captured_via`, `revoked_at` |
| `gallery_project` | Published project story | `job_id`, `title`, `story`, `service_tags`, `plant_ids`, `area_label` (neighborhood only), `quality_score`, `status` (queued, approved, published, unpublished) |
| `form` / `form_submission` | Lead forms | form schema JSON; submission `payload_json`, `spam_score`, `lead_id`, `attribution_session_id` |
| `property_measurement` | Aerial measurement result | `property_id`, `source` (aerial_model, customer_adjusted, field_verified, design_studio), `turf_sqft`, `bed_sqft`, `hardscape_sqft`, `driveway_sqft`, `slope_flags_json`, `confidence_json`, `imagery_date`, `model_version`, `geom` (MultiPolygon per class) |
| `quote_rule` | Instant pricing rule | `price_book_item_id`, `formula_json`, `min_charge`, `bands_json`, `modifiers_json`, `rounding`, `quote_mode`, `season_window`, `version` |
| `instant_quote` | Quote shown to a prospect or client | `property_id`, `lead_id`, `items_json` (service, price, mode, confidence), `valid_until`, `status` (shown, booked, expired, superseded), `channel` (web, voice, chat, campaign) |
| `attribution_session` | Web session or call attribution context | `landing_url`, `referrer`, `utm_json`, `click_ids_json`, `dni_number`, `first_seen_at` |
| `attribution_touch` | Touchpoint on a Lead/Client journey | `lead_id`, `client_id`, `touch_type` (session, call, form, chat, campaign_click, qr_scan, referral, marketplace), `source_id`, `campaign_id`, `occurred_at` |
| `lead_source` | Taxonomy node | `channel`, `name`, `parent_id`, `is_platform_default` |
| `marketing_spend` | Spend records | `source_id`, `campaign_id`, `period_start`, `period_end`, `amount`, `currency`, `origin` (manual, google_ads, lsa, meta, gl_tag), `gl_entry_id` |
| `marketplace_connection` / `marketplace_lead_raw` | Ingest config and raw payloads | provider, credentials ref (KMS), webhook secret; raw JSON retained 90 days; per lead `external_lead_id`, `lead_cost`, `charge_status` (charged, credit_requested, credited, credit_denied), `dispute_deadline` |
| `segment` | Audience definition | `kind` (dynamic, static), `filter_json`, `nl_prompt`, `last_count`, `last_evaluated_at` |
| `campaign` | Email/SMS/mail campaign | `channel_mix`, `segment_id`, `status`, `schedule_json`, `ab_test_json`, `holdout_pct`, `capacity_guard_json`, `approved_by`, `sent_at` |
| `campaign_recipient` | Per-recipient state | `campaign_id`, `contact_id`, `variant`, `status` (queued, suppressed, sent, delivered, opened, clicked, replied, booked, bounced, unsubscribed), `suppression_reason`, `offer_snapshot_json` (price, service, route week, terms at send time), `keyword_offer_expires_at` |
| `journey` / `journey_enrollment` | Drip automations | definition graph JSON (on the automation engine of [17](17-ai-copilot-automation.md)); enrollment `current_step`, `status`, `goal_met_at`, `exit_reason` |
| `conversation` | Thread with a contact | `contact_id`, `client_id`, `status`, `assignee_user_id`, `team_id`, `priority`, `sla_due_at`, `topic`, `language`, `last_message_at` |
| `message` | Any inbound or outbound message | `conversation_id`, `direction`, `channel`, `channel_account_id`, `body`, `media_json`, `template_version_id`, `purpose` (transactional, marketing, conversational), `provider_message_id`, `status`, `segments`, `error_code`, `consent_event_id` (basis used), `sent_by` (user, ai_agent, system) |
| `channel_account` | Connected channel | `channel` (sms_number, email_inbox, fb_page, ig_account, gbp_location, lsa_account, angi, thumbtack, web_chat), `external_id`, `credentials_ref`, `status` |
| `phone_number` | Provisioned numbers | `e164`, `kind` (main, tracking_static, tracking_dni_pool, sms_only), `source_id`, `ten_dlc_campaign_id`, `call_flow_id` |
| `call` | Voice call record | `from_e164`, `to_number_id`, `direction`, `started_at`, `duration_s`, `handled_by` (user, ai_receptionist, voicemail), `outcome`, `recording_ref`, `transcript_ref`, `summary`, `sentiment`, `attribution_session_id` |
| `consent_event` | Immutable consent change | `contact_id`, `channel`, `address` (phone or email), `purpose`, `new_state`, `source`, `disclosure_text`, `disclosure_hash`, `ip`, `user_agent`, `evidence_ref`, `actor_type`, `occurred_at` (append-only, no updates or deletes) |
| `consent_state` | Current state projection | unique on (`contact_id`, `channel`, `address`, `purpose`); `state`, `implied_expires_at`, `last_event_id` |
| `suppression` | Do-not-contact entries | `kind` (phone, email, address), `value_normalized`, `reason`, `scope` (company or platform_abuse) |
| `ten_dlc_brand` / `ten_dlc_campaign` | Registration records | provider SIDs, `brand_type`, `status`, `failure_reasons_json`, `use_case`, `sample_messages`, `opt_in_description`, `throughput_tier` |
| `review_request` / `review` / `review_reply` | Reputation | request `channel`, `status`; review `platform`, `external_id`, `rating`, `text`, `author_name`, `matched_client_id`, `match_confidence`; reply `body`, `drafted_by_ai`, `approved_by`, `posted_at` |
| `survey` / `survey_response` | NPS and surveys | survey `type` (nps, csat, custom); response `score`, `comment`, `contact_id`, `job_id`, `follow_up_task_id` |
| `referral_program` / `referral` / `referral_reward` | Referrals | program rules JSON; referral `referrer_client_id`, `referee_lead_id`, `code`, `status`; reward `type`, `amount`, `credit_memo_id`, `gift_card_ref`, `status`, `tax_year` |
| `neighborhood_campaign` / `neighborhood_target` | Route-aware outreach | campaign `origin_visit_id`, `radius_m`, `channel`, `holdout_pct`; target `parcel_id`, `address`, `target_group` (treated, holdout), `qr_code`, `delivery_status`, `skip_reason` |
| `mail_piece` | Postcards and EDDM batches | `provider_id`, `kind` (postcard, letter, eddm_batch), `address` or `carrier_route`, `qr_code`, `cost`, `status` |
| `social_account` / `social_post` | Social publishing | post `gallery_project_id`, `channels`, `caption`, `media_refs`, `scheduled_at`, `status`, `external_ids_json` |
| `notification_template` / `template_version` | Templates | `event_key`, `channel`, `audience`, `locale`, `owner` (platform or tenant), `forked_from_version_id`; version `body`, `variables_schema`, `status` |
| `voice_agent_config` | AI receptionist settings | `mode`, `business_hours_id`, `knowledge_pack_json`, `voice_id`, `languages`, `routing_rules_json`, `monthly_minute_cap` |
| `contact_attempt_counter` | Per-subject attempt caps (4.21.3) | unique on (`contact_id`, `address`, `subject_key`, `window_start`); `attempts`, `channels_json`; rolling 24-hour windows; read and incremented inside the send transaction |
| `messaging_rule` | Quiet-hour, attempt-cap and registration rules (platform-level, no `tenant_id`) | `jurisdiction`, `applies_to`, `purpose`, `window_start`, `window_end`, `days`, `max_attempts_per_24h_same_subject`, `registration_required`, `effective_from`, `source_url`, `reviewed_by`, `reviewed_at` |
| `state_registration_attestation` | Tenant attestations for state telemarketing registration or exemption (e.g., Texas) | `jurisdiction`, `kind` (registered, exempt), `registration_ref`, `exemption_basis`, `attested_by`, `expires_at`, `evidence_ref` |
| `relay_number` | Masked numbers for crew leads and estimators (4.17.2) | `phone_number_id`, `user_id`, `status`, `reassigned_to_user_id`, `reassigned_at` |
| `gift_certificate` | Website-sold gift credits (4.25) | `code`, `purchaser_contact_id`, `recipient_name`, `recipient_email`, `amount`, `currency`, `stripe_payment_intent_id` (on the Company's connected account), `balance`, `redeemed_client_id`, `status` (active, partially_redeemed, redeemed, voided); balances owned by the client wallet in [07](07-invoicing-billing-contracts.md) |

### 7.2 ER diagram: web presence, quotes, attribution and campaigns

```mermaid
erDiagram
    COMPANY ||--o{ SITE : owns
    SITE ||--o{ SITE_PAGE : contains
    SITE ||--o{ SITE_DOMAIN : served_on
    COMPANY ||--o{ SENDING_DOMAIN : authenticates
    CLIENT ||--o{ SHOWCASE_CONSENT : grants
    JOB ||--o| GALLERY_PROJECT : showcased_as
    PROPERTY ||--o{ PROPERTY_MEASUREMENT : measured_by
    PROPERTY ||--o{ INSTANT_QUOTE : priced_in
    QUOTE_RULE ||--o{ INSTANT_QUOTE : prices
    LEAD ||--o{ INSTANT_QUOTE : receives
    LEAD ||--o{ ATTRIBUTION_TOUCH : has
    LEAD_SOURCE ||--o{ ATTRIBUTION_TOUCH : credited
    CAMPAIGN ||--o{ ATTRIBUTION_TOUCH : generates
    LEAD_SOURCE ||--o{ MARKETING_SPEND : incurs
    SEGMENT ||--o{ CAMPAIGN : targets
    CAMPAIGN ||--o{ CAMPAIGN_RECIPIENT : sends_to
    CONTACT ||--o{ CAMPAIGN_RECIPIENT : receives

    SITE {
        uuid id PK
        uuid tenant_id FK
        string template_key
        string status
        string default_locale
        uuid published_version_id
    }
    SITE_PAGE {
        uuid id PK
        uuid site_id FK
        string page_type
        string slug
        string locale
        jsonb content_json
        boolean indexable
        string status
    }
    SITE_DOMAIN {
        uuid id PK
        uuid site_id FK
        string hostname
        string kind
        string tls_status
    }
    SENDING_DOMAIN {
        uuid id PK
        uuid tenant_id FK
        string domain
        string dmarc_policy
        int warmup_stage
    }
    SHOWCASE_CONSENT {
        uuid id PK
        uuid client_id FK
        uuid job_id FK
        string level
        string disclosure_version
        timestamptz revoked_at
    }
    GALLERY_PROJECT {
        uuid id PK
        uuid job_id FK
        string title
        string area_label
        numeric quality_score
        string status
    }
    PROPERTY_MEASUREMENT {
        uuid id PK
        uuid property_id FK
        string source
        numeric turf_sqft
        numeric bed_sqft
        numeric driveway_sqft
        jsonb confidence_json
        date imagery_date
        string model_version
    }
    QUOTE_RULE {
        uuid id PK
        uuid price_book_item_id FK
        jsonb formula_json
        numeric min_charge
        string quote_mode
        int version
    }
    INSTANT_QUOTE {
        uuid id PK
        uuid property_id FK
        uuid lead_id FK
        jsonb items_json
        string channel
        string status
        date valid_until
    }
    ATTRIBUTION_TOUCH {
        uuid id PK
        uuid lead_id FK
        uuid source_id FK
        uuid campaign_id FK
        string touch_type
        timestamptz occurred_at
    }
    LEAD_SOURCE {
        uuid id PK
        string channel
        string name
        uuid parent_id FK
    }
    MARKETING_SPEND {
        uuid id PK
        uuid source_id FK
        uuid campaign_id FK
        numeric amount
        string currency
        string origin
        uuid gl_entry_id FK
    }
    SEGMENT {
        uuid id PK
        string kind
        jsonb filter_json
        int last_count
    }
    CAMPAIGN {
        uuid id PK
        uuid segment_id FK
        string status
        jsonb schedule_json
        numeric holdout_pct
        uuid approved_by FK
    }
    CAMPAIGN_RECIPIENT {
        uuid id PK
        uuid campaign_id FK
        uuid contact_id FK
        string variant
        string status
        string suppression_reason
    }
```

### 7.3 ER diagram: conversations, voice, consent and compliance

```mermaid
erDiagram
    CONTACT ||--o{ CONVERSATION : participates
    CONVERSATION ||--o{ MESSAGE : contains
    CHANNEL_ACCOUNT ||--o{ MESSAGE : carries
    TEMPLATE_VERSION ||--o{ MESSAGE : renders
    NOTIFICATION_TEMPLATE ||--o{ TEMPLATE_VERSION : versions
    CONSENT_EVENT ||--o{ MESSAGE : authorizes
    CONTACT ||--o{ CONSENT_EVENT : records
    CONTACT ||--o{ CONSENT_STATE : projects
    PHONE_NUMBER ||--o{ CALL : receives
    CONTACT ||--o{ CALL : makes
    CALL ||--o| CONVERSATION : logged_in
    TEN_DLC_BRAND ||--o{ TEN_DLC_CAMPAIGN : registers
    TEN_DLC_CAMPAIGN ||--o{ PHONE_NUMBER : authorizes

    CONVERSATION {
        uuid id PK
        uuid contact_id FK
        uuid client_id FK
        string status
        uuid assignee_user_id FK
        string topic
        string language
        timestamptz sla_due_at
    }
    MESSAGE {
        uuid id PK
        uuid conversation_id FK
        uuid channel_account_id FK
        string direction
        string channel
        string purpose
        text body
        string status
        int segments
        uuid consent_event_id FK
        uuid template_version_id FK
        string sent_by
    }
    CHANNEL_ACCOUNT {
        uuid id PK
        string channel
        string external_id
        string credentials_ref
        string status
    }
    NOTIFICATION_TEMPLATE {
        uuid id PK
        string event_key
        string channel
        string audience
        string locale
        string owner
    }
    TEMPLATE_VERSION {
        uuid id PK
        uuid template_id FK
        text body
        jsonb variables_schema
        uuid forked_from_version_id FK
        string status
    }
    CONSENT_EVENT {
        uuid id PK
        uuid contact_id FK
        string channel
        string address
        string purpose
        string new_state
        string source
        string disclosure_hash
        string evidence_ref
        timestamptz occurred_at
    }
    CONSENT_STATE {
        uuid id PK
        uuid contact_id FK
        string channel
        string address
        string purpose
        string state
        timestamptz implied_expires_at
    }
    PHONE_NUMBER {
        uuid id PK
        string e164
        string kind
        uuid source_id FK
        uuid ten_dlc_campaign_id FK
    }
    CALL {
        uuid id PK
        uuid phone_number_id FK
        uuid contact_id FK
        string handled_by
        int duration_s
        string outcome
        string recording_ref
        string transcript_ref
    }
    TEN_DLC_BRAND {
        uuid id PK
        uuid tenant_id FK
        string brand_type
        string provider_sid
        string status
    }
    TEN_DLC_CAMPAIGN {
        uuid id PK
        uuid brand_id FK
        string use_case
        string status
        string throughput_tier
    }
```

### 7.4 ER diagram: reputation, referrals, neighborhood and social

```mermaid
erDiagram
    CLIENT ||--o{ REVIEW_REQUEST : asked
    REVIEW_REQUEST ||--o| REVIEW : results_in
    REVIEW ||--o{ REVIEW_REPLY : answered_by
    CLIENT ||--o{ SURVEY_RESPONSE : answers
    SURVEY ||--o{ SURVEY_RESPONSE : collects
    REFERRAL_PROGRAM ||--o{ REFERRAL : governs
    CLIENT ||--o{ REFERRAL : refers
    REFERRAL ||--o{ REFERRAL_REWARD : earns
    VISIT ||--o{ NEIGHBORHOOD_CAMPAIGN : triggers
    NEIGHBORHOOD_CAMPAIGN ||--o{ NEIGHBORHOOD_TARGET : targets
    NEIGHBORHOOD_TARGET ||--o| MAIL_PIECE : mailed_as
    GALLERY_PROJECT ||--o{ SOCIAL_POST : promoted_in
    SOCIAL_ACCOUNT ||--o{ SOCIAL_POST : publishes

    REVIEW_REQUEST {
        uuid id PK
        uuid client_id FK
        uuid job_id FK
        string channel
        string status
        timestamptz sent_at
    }
    REVIEW {
        uuid id PK
        string platform
        string external_id
        int rating
        text body
        uuid matched_client_id FK
        numeric match_confidence
    }
    REVIEW_REPLY {
        uuid id PK
        uuid review_id FK
        text body
        boolean drafted_by_ai
        uuid approved_by FK
        timestamptz posted_at
    }
    SURVEY {
        uuid id PK
        string type
        jsonb questions_json
    }
    SURVEY_RESPONSE {
        uuid id PK
        uuid survey_id FK
        uuid contact_id FK
        int score
        text comment
        uuid follow_up_task_id FK
    }
    REFERRAL_PROGRAM {
        uuid id PK
        jsonb rules_json
        string status
    }
    REFERRAL {
        uuid id PK
        uuid program_id FK
        uuid referrer_client_id FK
        uuid referee_lead_id FK
        string code
        string status
    }
    REFERRAL_REWARD {
        uuid id PK
        uuid referral_id FK
        string reward_type
        numeric amount
        uuid credit_memo_id FK
        int tax_year
        string status
    }
    NEIGHBORHOOD_CAMPAIGN {
        uuid id PK
        uuid origin_visit_id FK
        int radius_m
        string channel
        numeric holdout_pct
    }
    NEIGHBORHOOD_TARGET {
        uuid id PK
        uuid campaign_id FK
        string parcel_id
        string target_group
        string qr_code
        string delivery_status
        string skip_reason
    }
    MAIL_PIECE {
        uuid id PK
        uuid target_id FK
        string kind
        string carrier_route
        numeric cost
        string status
    }
    SOCIAL_ACCOUNT {
        uuid id PK
        string platform
        string external_id
        string status
    }
    SOCIAL_POST {
        uuid id PK
        uuid gallery_project_id FK
        uuid social_account_id FK
        text caption
        timestamptz scheduled_at
        string status
    }
```

### 7.5 ER diagram: attempt caps, state rules, relay numbers and gift certificates

```mermaid
erDiagram
    CONTACT ||--o{ CONTACT_ATTEMPT_COUNTER : limited_by
    MESSAGING_RULE ||--o{ CONTACT_ATTEMPT_COUNTER : defines_cap
    COMPANY ||--o{ STATE_REGISTRATION_ATTESTATION : attests
    MESSAGING_RULE ||--o{ STATE_REGISTRATION_ATTESTATION : satisfies
    PHONE_NUMBER ||--o| RELAY_NUMBER : masks
    USER ||--o{ RELAY_NUMBER : assigned
    CONTACT ||--o{ GIFT_CERTIFICATE : purchases
    CLIENT ||--o{ GIFT_CERTIFICATE : redeems
    CAMPAIGN_RECIPIENT ||--o| JOB : books_by_keyword

    CONTACT_ATTEMPT_COUNTER {
        uuid id PK
        uuid tenant_id FK
        uuid contact_id FK
        string address
        string subject_key
        timestamptz window_start
        int attempts
    }
    MESSAGING_RULE {
        uuid id PK
        string jurisdiction
        string applies_to
        string purpose
        time window_start
        time window_end
        int max_attempts_per_24h
        boolean registration_required
        date effective_from
        timestamptz reviewed_at
    }
    STATE_REGISTRATION_ATTESTATION {
        uuid id PK
        uuid tenant_id FK
        uuid rule_id FK
        string kind
        string registration_ref
        uuid attested_by FK
        date expires_at
    }
    RELAY_NUMBER {
        uuid id PK
        uuid tenant_id FK
        uuid phone_number_id FK
        uuid user_id FK
        string status
        timestamptz reassigned_at
    }
    GIFT_CERTIFICATE {
        uuid id PK
        uuid tenant_id FK
        string code
        uuid purchaser_contact_id FK
        uuid redeemed_client_id FK
        numeric amount
        numeric balance
        string currency
        string stripe_payment_intent_id
        string status
    }
    CAMPAIGN_RECIPIENT {
        uuid id PK
        uuid campaign_id FK
        uuid contact_id FK
        jsonb offer_snapshot_json
        timestamptz keyword_offer_expires_at
        uuid booked_job_id FK
    }
```

**Data rules worth calling out:**

- `consent_event` is append-only (enforced by a Postgres trigger and RLS policy denying UPDATE/DELETE); `consent_state` is a projection rebuilt from events. Every outbound `message` stores the `consent_event_id` it relied on, so any message can be defended later.
- `message.body` for SMS and email is retained 7 years by default for transactional records (invoices, notices) and 3 years for marketing (configurable down to 1 year), subject to deletion requests under privacy law where retention is not legally required.
- Recordings and transcripts are stored encrypted with per-tenant keys; access is logged.
- `property_measurement` is shared with [10](10-design-studio.md) and [03](03-crm-sales-estimating-proposals.md); the most authoritative source wins (field_verified > design_studio > customer_adjusted > aerial_model).

---

## 8. Integrations, APIs and events

### 8.1 External services

| Service | Use | Notes and constraints | Priority |
|---|---|---|---|
| Twilio Programmable Messaging and Voice | SMS/MMS, voice, numbers, media streams for AI receptionist, A2P 10DLC ISV registration (Trust Hub), Lookup (line type) | ISV onboarding via API ([Twilio ISV guide](https://www.twilio.com/docs/messaging/compliance/a2p-10dlc/onboarding-isv-api.md)); subaccount per tenant for isolation and per-tenant usage metering; abstraction layer allows a second carrier (e.g., Telnyx or Bandwidth) later | [MVP] |
| Postmark or SendGrid | Transactional and marketing email | Separate message streams/IP pools for transactional vs marketing; dedicated IPs for high-volume tenants [V1] | [MVP] |
| Push (APNs/FCM via Expo) | Crew and client app notifications | | [MVP] |
| CDN with SaaS custom hostnames | Tenant sites, TLS automation | Decision in [20](20-architecture-security.md) | [MVP] |
| Parcel data (e.g., Regrid), imagery (Mapbox/Google, optional Nearmap/EagleView), USGS 3DEP elevation | Instant quote measurements, neighbor targeting | Imagery licensing must permit derived measurements and display on tenant sites; shared with [10](10-design-studio.md) | [MVP] |
| AI Gateway (Claude family; image models; segmentation; ASR/TTS vendors) | Copy, classification, receptionist, mockups, measurement | AI actions metered as AI credits; receptionist minutes on the separate `voice_ai_minutes` meter ([17](17-ai-copilot-automation.md), [22](22-business-model-pricing-gtm.md)) | [MVP]; receptionist [V1] |
| Google Business Profile APIs | Reviews list/reply, location data, posts | Access requires Google approval of the Cloud project ([testimonial.to](https://testimonial.to/resources/google-business-profile-api)) | [MVP] |
| Google Ads API | LSA leads and conversations (read-only), spend import, offline conversion upload, enhanced conversions for leads | LSA resources documented in [Google Ads API](https://developers.google.com/google-ads/api/docs/campaigns/local-service-campaigns); developer token approval required | [MVP] LSA, [V1] conversions |
| Meta Graph API | Facebook Page and Instagram messaging, content publishing, Conversions API | App review for messaging and publishing permissions; 24-hour messaging window rules | [V1] |
| Angi Leads API | Real-time lead push | JSON webhook, `x-api-key` ([Angi](https://intercom.help/angi/en/articles/15304819-angi-lead-integration-api)) | [MVP] |
| Thumbtack | Leads and messages | Partner API access to be confirmed | [V1] |
| Print and mail API (e.g., Lob or PostGrid) | Postcards, letters, address verification | Per-piece pricing passed through | [V1] |
| USPS EDDM | Carrier route data and mailing requirements | Via print partner or USPS EDDM tools | [V1] |
| Rewards provider (e.g., Tremendous or Tango) | Referral gift cards | Funded by the Company | [V1] |
| Stripe (Company's connected account) | Payment links in messages; deposits and card on file in booking | Per [08](08-payments-stripe.md); Rootline never holds client funds | [MVP] payment links; [V1] booking deposits and card on file |
| Gmail / Microsoft 365 | Shared inbox connection | OAuth with restricted scopes; security assessments for restricted Gmail scopes required | [V1] |
| Zapier / Make | Generic lead ingest and outbound triggers | | [V1] |
| FCC Reassigned Numbers Database | Reassigned number checks | Subscription per query volume | [V1] |

### 8.2 Domain events emitted (via transactional outbox, see [20](20-architecture-security.md))

| Event | Payload highlights | Typical consumers |
|---|---|---|
| `growth.lead_captured` | lead_id, source, touch, consent summary | CRM ([03](03-crm-sales-estimating-proposals.md)), automation ([17](17-ai-copilot-automation.md)), reporting |
| `growth.instant_quote_created` / `growth.instant_quote_booked` | quote_id, property_id, items, mode | CRM, scheduling |
| `growth.booking_requested` | service, start week, route day, payment method status | Scheduling ([04](04-scheduling-dispatch-routing.md)), billing ([07](07-invoicing-billing-contracts.md)) |
| `growth.mockup_lead_unlocked` | lead_id, concept ids, style | CRM, Design Studio ([10](10-design-studio.md)) |
| `comms.message_received` / `comms.message_sent` / `comms.message_status_changed` | message_id, channel, purpose, status, error | Inbox, reporting, deliverability monitor |
| `comms.conversation_assigned` / `comms.sla_breached` | conversation_id, assignee, priority | Notifications, owner digest |
| `voice.call_completed` | call_id, handled_by, outcome, summary, source | CRM, reporting, attribution |
| `consent.changed` | contact_id, channel, purpose, new_state, source | All senders (cache invalidation), portal |
| `review.requested` / `review.received` / `review.replied` | rating, platform, matched client | Reporting, crew kudos ([05](05-field-crew-mobile-app.md)) |
| `survey.response_received` | score, comment, contact | Ops tasks, reporting |
| `referral.qualified` / `referral.reward_issued` | referral_id, reward type and amount | Invoicing (credit memo), Ledger ([09](09-accounting-ledger-integrations.md)) |
| `campaign.sent` / `campaign.recipient_converted` | campaign_id, counts, conversions | Reporting ([18](18-reporting-analytics.md)) |
| `neighborhood.targets_generated` | campaign_id, addresses for route | Crew app door-hanger layer |
| `social.post_published` / `social.post_removed` | post_id, channel, external id | Gallery, audit |
| `site.published` | site_id, version | CDN purge, search console ping |
| `tendlc.status_changed` | brand/campaign id, status, reasons | Admin console ([19](19-platform-admin-portal.md)), tenant notifications |
| `growth.keyword_offer_booked` | campaign_id, recipient_id, offer snapshot, job_id | Scheduling ([04](04-scheduling-dispatch-routing.md)), invoicing ([07](07-invoicing-billing-contracts.md)), campaign reporting |
| `growth.marketplace_charge_updated` | marketplace, external lead id, cost, charge status | Ledger spend tagging ([09](09-accounting-ledger-integrations.md)), ROI |
| `growth.gift_certificate_sold` / `growth.gift_certificate_redeemed` | certificate id, amount, payment intent, client | Client wallet and posting rule P29 ([07](07-invoicing-billing-contracts.md)), Ledger |
| `comms.send_suppressed` | message request, reason (consent, quiet hours, attempt cap, state rule, kill switch) | Sender feedback, compliance reporting, admin console |

### 8.3 Domain events consumed

| Event (owner) | Reaction in this module |
|---|---|
| `visit.scheduled`, `visit.rescheduled`, `weather.delay_declared` ([04](04-scheduling-dispatch-routing.md)) | Reminders, recurring service notices, delay notices |
| `visit.en_route`, `visit.arrived`, `visit.completed` ([05](05-field-crew-mobile-app.md)) | On-my-way, arrival, visit summary, review request eligibility, neighborhood trigger, gallery candidate |
| `job.completed` ([03](03-crm-sales-estimating-proposals.md)) | Gallery pipeline, review request, post-install journey |
| `proposal.sent`, `proposal.viewed`, `proposal.signed`, `proposal.declined` ([03](03-crm-sales-estimating-proposals.md)) | Proposal follow-up journeys; lost-proposal survey; showcase consent capture |
| `invoice.issued`, `payment.succeeded`, `payment.failed`, `agreement.expiring` ([07](07-invoicing-billing-contracts.md), [08](08-payments-stripe.md)) | Transactional notices; referral qualification; renewal journeys |
| `design.mockup_ready` ([11](11-ai-design-mockups.md)) | Lead magnet delivery |
| `property.measured` ([10](10-design-studio.md)) | Refresh instant quote inputs and personalized offers |
| `plant_kb.region_profile_updated` ([12](12-plant-knowledge-base.md)) | Re-render plant pages and plant-of-the-month blocks |
| `employee.certification_updated` ([15](15-team-hr-payroll.md)) | Update license badges on site |
| `gl.entry_posted` with marketing dimension ([09](09-accounting-ledger-integrations.md)) | Marketing spend records |
| `visit.blocked` ([05](05-field-crew-mobile-app.md)) | "Unable to service" notice with photo and reschedule options |
| `snow.trigger_forecast` ([14](14-service-line-modules.md)) | Pre-storm alerts to opted-in commercial contacts and per-push residential clients |
| `tip.received` ([08](08-payments-stripe.md)) | Thank-you message to client; kudos to crew app |

### 8.4 Public API and webhooks (tenant-facing)

- REST endpoints (OAuth2 client credentials, tenant-scoped, rate-limited 600 requests/min): `POST /v1/leads`, `GET /v1/leads/{id}`, `POST /v1/instant-quotes` (address + services -> quote), `GET /v1/conversations`, `POST /v1/messages` (respects consent and quiet hours; returns `suppressed` with reason rather than failing silently), `GET /v1/reviews`, `POST /v1/consents` (record consent with evidence), `GET /v1/campaigns/{id}/stats`.
- Outbound webhooks (HMAC-SHA256 signed, retries with exponential backoff for 24 h): `lead.created`, `instant_quote.booked`, `message.received`, `call.completed`, `review.received`, `consent.changed`.
- Inbound provider webhooks (Twilio, email provider, Meta, Angi) are verified (signature or shared secret), stored raw for 30-90 days, processed idempotently by provider message id.

---

## 9. Permissions

Legend: **F** = full (create, edit, delete, configure), **E** = create/edit/use, **A** = approve/send, **V** = view, **O** = own/assigned only, **B** = the user's branch only, **cfg** = off by default, Company can enable, **-** = none. Platform roles act through audited support access to a tenant ([19](19-platform-admin-portal.md)) unless noted. Custom roles compose the granular permission keys listed under the table. The keys are this module's namespaced spellings; [02](02-personas-roles-permissions.md) section 5.2 registers them as aliases of its canonical `resource.action` keys (for example `growth.campaigns.send` = `campaign.send`, `reputation.reviews.reply` = `review.respond`, `comms.messages.send` = `inbox.conversation.send`, `growth.site.publish` = `website.publish`), and the template defaults match the master matrix in [02](02-personas-roles-permissions.md) section 10.1, which wins if they differ.

| Capability (permission key) | owner | office_manager | estimator | designer | ops_manager | crew_lead | technician | bookkeeper | subcontractor | client_residential | client_commercial | platform_support | platform_curator | platform_owner |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Edit site content (`growth.site.edit`) | F | E | - | E | - | - | - | - | - | - | - | V | - | V |
| Publish site, manage domains (`growth.site.publish`) | F | A | - | - | - | - | - | - | - | - | - | - | - | - |
| Approve gallery projects (`growth.gallery.approve`) | F | A | - | A | V | - | - | - | - | - | - | - | - | - |
| Configure instant quote pricing rules (`growth.quote_rules.manage`) | F | E | V | - | V | - | - | - | - | - | - | V | - | V |
| View leads and attribution (`growth.leads.view`) | F | V | O | O | V | - | - | V | - | - | - | V | - | V |
| View marketing spend and ROI (`growth.roi.view`) | F | V | - | - | V | - | - | V | - | - | - | - | - | V |
| Build segments (`growth.segments.manage`) | F | E | V | - | E | - | - | - | - | - | - | - | - | - |
| Create campaigns (`growth.campaigns.edit`) | F | E | O (cfg) | E (drafts) | B | - | - | - | - | - | - | - | - | - |
| Send/approve campaigns (`growth.campaigns.send`) | F | A | - | - | A (B) | - | - | - | - | - | - | - | - | - |
| Manage journeys (`growth.journeys.manage`) | F | E | - | - | E | - | - | - | - | - | - | - | - | - |
| Inbox: all conversations (`comms.inbox.view_all`) | F | F | - | - | B | - | - | - | - | - | - | V | - | - |
| Inbox: assigned/own (`comms.inbox.view_assigned`) | F | F | O | O | F | O | - | O | - | - | - | - | - | - |
| Reply to clients (`comms.messages.send`) | F | E | O | O | E | O | - | O (billing threads) | - | - | - | - | - | - |
| Send on-my-way from crew app (`comms.on_my_way.send`) | F | E | - | - | E | E | E | - | O | - | - | - | - | - |
| Listen to call recordings (`voice.recordings.listen`) | F | E | O | - | E | - | - | - | - | - | - | V | - | - |
| Configure AI receptionist and call flows (`voice.config.manage`) | F | E | - | - | - | - | - | - | - | - | - | V | - | - |
| Reply to reviews (`reputation.reviews.reply`) | F | E | - | - | E | - | - | - | - | - | - | - | - | - |
| Manage referral program (`growth.referrals.manage`) | F | E | - | - | - | - | - | V | - | - | - | - | - | - |
| Approve referral rewards (`growth.referrals.approve_reward`) | F | A | - | - | - | - | - | A | - | - | - | - | - | - |
| Neighborhood campaigns (`growth.neighborhood.manage`) | F | E | E | - | E | V | V | - | - | - | - | - | - | - |
| Deliver door hangers (`growth.neighborhood.deliver`) | F | - | - | - | - | E | E | - | O | - | - | - | - | - |
| Social posting (`growth.social.publish`) | F | A | - | E | - | - | - | - | - | - | - | - | - | - |
| Manage templates (`comms.templates.manage`) | F | E | - | - | E | - | - | - | - | - | - | V | F (platform defaults) | F (platform defaults) |
| 10DLC registration (`comms.tendlc.manage`) | F | E | - | - | - | - | - | - | - | - | - | E (with audit) | - | V |
| State registration attestation, e.g. Texas (`comms.state_rules.attest`) | F | - | - | - | - | - | - | - | - | - | - | V | - | V |
| Marketplace connections and charge disputes (`growth.marketplace.manage`) | F | E | V | - | E | - | - | V | - | - | - | V | - | - |
| Gift certificates: sell, void, adjust (`growth.gift_certificates.manage`) | F | E | - | - | - | - | - | E | - | - | - | - | - | - |
| Relay numbers for staff (`comms.relay_numbers.manage`) | F | E | - | - | E | - | - | - | - | - | - | - | - | - |
| Record consent with evidence (`consent.record`) | F | E | E | E | E | E | - | E | - | own (preference center) | own contacts (admin contact) | - | - | - |
| Override opt-out (no such permission) | - | - | - | - | - | - | - | - | - | contact only, by new consent | contact only | - | - | - |
| Export contacts and consent evidence (`consent.export`) | F | - | - | - | - | - | - | - | - | own data (portal export) | own data | V (audited) | - | V |
| Tenant messaging kill switch (`platform.messaging.suspend`) | - | - | - | - | - | - | - | - | - | - | - | E | - | F |
| Platform seasonal campaign library (`platform.content.manage`) | - | - | - | - | - | - | - | - | - | - | - | - | F | F |

Notes:

- `platform_finance` has view access to messaging, voice, AI-credit and mail usage for billing; `platform_engineer` has access to provider health dashboards and webhook logs with message bodies redacted by default.
- Client roles (`client_residential`, `client_commercial` admin contacts) manage their own preferences and those of contacts under their account; additional contacts (spouse, billing contact) manage only their own.
- `subcontractor` can send on-my-way messages only for visits assigned to them, with the Company's branding and without seeing the client's phone number (masked relay).

---

## 10. AI opportunities in this module

| Opportunity | Model/approach | Human control | Priority |
|---|---|---|---|
| AI site generator and SEO copy grounded in tenant facts | LLM (Claude) with structured inputs; claim highlighting | Review before publish | [V1] |
| Aerial turf/bed/driveway segmentation for instant quotes | Segmentation (SAM-family fine-tuned on landscape classes) + slope from elevation | Confidence gating; first-visit verification | [MVP] turf for estimator quotes; [V1] public instant quotes, beds and driveways |
| AI receptionist and AI chat agent | Real-time voice pipeline; LLM with tool calling | Disclosure, handoff, QA sampling | [V1] |
| Inbox triage: topic, urgency, sentiment, language, opt-out intent | LLM classifier with fallbacks | Visible labels, editable | [MVP] |
| Suggested replies and thread summaries | LLM grounded in client context | Never auto-sent by default | [MVP] |
| Translation (English/Spanish, later French) with landscape glossary | LLM translation with glossary constraints | Review flag for tenant templates | [MVP] |
| Campaign and newsletter copy, subject-line variants | LLM | Approval required | [MVP] |
| Natural-language segments | LLM -> filter tree | User sees and edits the filter | [V1] |
| Send-time optimization | Per-contact engagement model | Bounded by quiet hours | [V1] |
| Next best offer and churn risk | Gradient-boosted models per tenant, regional priors | Explanations; owner approval | [V1] |
| Gallery curation: photo quality, before/after pairing, redaction | Vision models, embeddings, face/plate/house-number detection | Review queue | [V1] |
| Review reply drafts and review-to-client matching | LLM; fuzzy matching | Approval required | [MVP] |
| Lead scoring (likelihood to book and expected value) | Model on lead attributes, source, property size, engagement with mockups | Visible score with reasons | [V1] |
| Call QA scoring and coaching for human CSRs | LLM over transcripts | Owner reviews | [V1] |
| Growth copilot marketing plan with capacity check | LLM agent with tools (segments, quotes, capacity, history) | Campaign-by-campaign approval | [V1] |
| Weather/GDD-triggered campaign timing | Rules on weather service data | Owner opt-in | [V2] |
| Lead magnet concepts | Image generation/editing with plant constraints ([11](11-ai-design-mockups.md)) | Watermarked, disclaimed | [MVP] website widget |
| Disputable marketplace lead detection (spam, duplicate, wrong service, out of area) | LLM classifier over lead payload, call transcript and geocode | Weekly digest; owner submits disputes | [V1] |
| Schedule-gap offers from open route capacity | Rules plus next-best-offer model, constrained by the dispatch board | Owner approves each gap offer | [V1] |
| Ledger tagging of marketing spend (vendor, memo, card line to source/campaign) | LLM categorization with tenant-specific few-shot examples | Suggested tag, bookkeeper confirms | [V1] |

**AI guardrails specific to growth and communications:** AI never sends a marketing message without a human-approved campaign or journey; AI agents act as a tenant-scoped service principal with only the tools listed; prompts and outputs are logged for 90 days for QA (excluding payment data, which never reaches the AI); AI-generated content that mentions prices must come from tool calls, not model text; AI identifies itself in voice and chat; AI usage is metered in credits with per-tenant caps ([17](17-ai-copilot-automation.md)).

---

## 11. Edge cases, compliance and risks

### 11.1 Edge cases

| Scenario | Handling |
|---|---|
| Client texts STOP but still needs on-my-way and invoice notices | All SMS from that number stops (carrier behavior). Client receives an email/push explaining service notices continue by email/portal, with "reply START for service texts only" instructions. Crew app shows "SMS opted out" on the visit so crews do not text manually from personal phones. |
| Two contacts share one phone (spouses) | Consent is per phone number and per contact; an opt-out on the number applies to every contact using it. |
| Property sold; new homeowner calls | Consent does not transfer. New Contact and Client created; old Client marked moved; agreement ends per terms ([07](07-invoicing-billing-contracts.md)); new homeowner gets a welcome offer only with fresh consent. |
| Lead submits form with someone else's phone number | Double opt-in for marketing SMS [V1]: first message asks to confirm with YES; no marketing until confirmed. Transactional reply to the inquiry is sent once. |
| Commercial client with 14 properties and 9 contacts | Notification routing per contact role and per Property; digests (daily per-site summary) instead of 14 separate emails; AP contact gets invoices only. |
| Recipient time zone unknown | Use Property time zone; if none, area code time zone; if conflicting, pick the window that satisfies both (strictest wins); if no overlap that day, defer. |
| Spanish-speaking client replies in Spanish to an English campaign | Language detected; contact `preferred_language` suggested for update (staff confirms or auto-update after 2 Spanish messages); future templates use `es-US`. |
| Campaign sent, then dispatch declares rain week | Capacity guard and booking confirmations reference route weeks, not exact days; rain delays shift dates and send delay notices. |
| Instant quote for a property where imagery is outdated (new construction, imagery older than 36 months) | No firm price; range or site visit; flag imagery staleness. |
| Customer-adjusted lawn outline is clearly wrong (draws the neighbor's lawn) | Outline must intersect the matched parcel by at least 80%; otherwise warning and staff review. |
| Showcase consent revoked after posting to Instagram | Unpublish from site within 15 min; delete via API where permitted; task for manual deletion otherwise; audit trail. |
| Review platform API outage or access revoked | Review requests continue (they are links); monitoring degrades gracefully with a banner; reply drafts queue until access returns. |
| Marketplace sends the same lead twice (API + email) | Dedupe on external lead id, phone, email and address within 30 days; API path wins; parser disabled automatically. |
| AI receptionist books a site visit at a time a human just booked | Calendar writes are transactional with slot locking; the second booking gets the next slot and the caller is told before the call ends. |
| Caller in an all-party consent state | Disclosure is always played at the start regardless of state; recording only proceeds after disclosure. |
| Tenant imports 8,000 contacts from an old system and wants to text them all | Imported SMS consent defaults to `unknown` without evidence; the wizard explains why, offers an email re-permission campaign and transactional-only SMS for active clients with an existing service relationship. |
| Tenant tries to put "Leave us a 5-star review and get $10 off" in a template | Content screen blocks incentive language in review-request templates and explains Google's policy. |
| Door hanger crew finds a "No soliciting" sign | Skip with reason; address auto-added to do-not-market for physical channels. |
| Neighbor asks "how did you get my address?" | Response snippet: public property records and the crew's work on the street; one-click addition to do-not-market. |
| Holiday shifts route days (e.g., Thanksgiving week in the US, Thanksgiving in October in Canada) | Recurring service notices generated per Company holiday calendar and locale. |
| Client replies "SÍ" to an aeration offer after the offer expired | No automatic booking; reply with today's price and a link (4.8.2 rule 2). The conversation goes to the inbox with the expired offer attached. |
| Client replies CANCEL meaning "cancel my aeration" | CANCEL is processed as an opt-out (carrier-standard keyword). The confirmation explains how to re-subscribe, and staff get a task to confirm whether the booking should also be canceled. The product never repurposes standard opt-out keywords. |
| Florida client gets an aeration SMS, a reminder SMS and a staff call the same day | The per-subject attempt counter (4.21.3) blocks the third attempt on the same subject within 24 hours and suggests email instead. |
| Snowbird client: Ohio Property, Florida mobile number, winters in Ontario | Strictest rule across area code, Property location and known current location. CASL applies if the number or address is Canadian. Snow alerts follow the Property's time zone, marketing follows the strictest window. |
| Tenant leaves Rootline | Numbers can be ported out (Rootline releases them within the carrier porting window). 10DLC campaigns are deactivated and the brand is released. The consent ledger, recordings and message history export as CSV/JSON plus audio files. The website stays up read-only for 30 days, with the domain pointed wherever the tenant chooses. Stripe needs nothing: the account was always the Company's. |
| Gift certificate bought for an address outside the service area | Checkout warns and asks for the recipient's address. If it is outside the area, the purchase is blocked with a friendly message rather than creating a liability the Company cannot fulfill. |
| Crew lead keeps texting clients from a personal phone | The relay number (4.17.2) is offered. The owner can see a "shadow channel" warning when the AI notices inbound messages saying "as I texted Luis...". The product cannot police personal phones, so it makes the compliant path easier. |
| AI receptionist call ends after 9 pm local time | The confirmation goes by email immediately and by SMS at 7 am the next day (transactional window), unless the caller asked for "text me now" and the tenant has enabled immediate replies to a caller's own request. |
| Lead form submitted with an SMS consent box checked by a bot | Turnstile and honeypot catch most. Consent from a session flagged as likely automated is stored as `unknown` until confirmed by a double opt-in reply. |

### 11.2 Compliance obligations and how the product enforces them

| Area | Obligation (summary, verify with counsel) | Product enforcement |
|---|---|---|
| TCPA consent for marketing texts/calls | Prior express written consent for marketing messages sent with autodialer-type systems or artificial/prerecorded voice; the FCC's one-to-one consent rule was vacated in January 2025 ([Kelley Drye](https://www.kelleydrye.com/viewpoints/blogs/ad-law-access/eleventh-circuit-vacates-tcpa-11-consent-rule), [Wiley](https://www.wiley.law/alert-UPDATE-11th-Circuit-Vacates-FCCs-One-to-One-TCPA-Consent-Rule)), but Rootline still collects single-seller consent by design because the consent is always to the tenant Company only | Separate unchecked checkbox, disclosure versioning, evidence storage, consent check at send |
| TCPA revocation | Honor revocation by any reasonable means within 10 business days; 2026 FCC amendments adjust "revoke all" and allow exclusive methods ([FCC fact sheet](https://docs.fcc.gov/public/attachments/DOC-424844A1.pdf), [National Law Review](https://natlawreview.com/article/fcc-adopts-overhaul-tcpa-consent-revocation-rules-revoke-all-narrowed-exclusive-opt)) | Immediate processing of keywords, natural-language and cross-channel revocations |
| AI voice | AI-generated voice = artificial voice under TCPA ([Perkins Coie](https://perkinscoie.com/insights/update/fcc-declares-ai-generated-robocalls-unlawful)) | No outbound AI calls without consent; inbound AI discloses itself |
| Call recording | All-party consent required in states such as California, Florida, Illinois, Maryland, Massachusetts, Montana, New Hampshire, Pennsylvania and Washington (lists vary by source) ([Kilpatrick Townsend](https://ktslaw.com/blog/globalprivacy-and-cybersecuritylaw/2024/7/wiretap-laws-in-the-united-states), [Metaverse Law](https://www.metaverselaw.com/two-party-consent-requirements-for-recording-calls/)) | Mandatory recording disclosure on every inbound and outbound call; option to disable recording for outbound softphone calls |
| 10DLC / CTIA messaging principles | Brand and campaign registration, opt-in, opt-out, HELP, content restrictions | Registration wizard, auto-generated SMS terms page, keyword handling, content screening |
| CAN-SPAM, CASL, mailbox provider rules | Address, unsubscribe, consent for Canada, authentication | Footer enforcement, unsubscribe processing, CASL implied-consent expiry tracking, SPF/DKIM/DMARC setup |
| Google review policies | No incentives, no gating, no staff quotas ([BrightLocal](https://www.brightlocal.com/learn/review-management/dos-and-donts/review-platform-guidelines/)) | Uniform eligibility, incentive-language blocking, no leaderboards |
| FTC rules on reviews and testimonials | Do not suppress negative reviews or fabricate reviews (background reference: FTC rule on consumer reviews and testimonials, effective 2024, verify) | Review widgets show reviews unedited; no AI-generated reviews; no review-for-reward features |
| Privacy (CCPA/CPRA, PIPEDA, Quebec Law 25, GDPR for any EU visitor) | Notice, access/deletion rights, sensitive data limits, cookie consent | Consent banner, data subject request tooling ([20](20-architecture-security.md)), retention controls |
| Accessibility (ADA web accessibility claims) | Accessible public sites | WCAG 2.2 AA templates, automated checks on publish |
| Mailbox law | No unstamped items in mailboxes (US) | Crew guidance and app reminders |
| Pesticide notification | State/municipal notification and posting rules for lawn applications | Rule table and proof of notification ([14](14-service-line-modules.md)) |
| AI-altered imagery | Avoid deceptive representation of results | Watermarks and disclaimers on concepts; real photos only in gallery |
| State "mini-TCPA" laws (e.g., Florida, Oklahoma, Maryland) | Narrower calling/texting hours (commonly 8 am-8 pm) and caps of 3 attempts per 24 hours on the same subject (background, verify) | Data-driven rule table, per-subject attempt counter across channels, strictest-rule time zone logic (4.21.3) |
| Texas SB 140 (effective Sept 1, 2025) | Marketing texts fall under Texas's telephone-solicitation statute, which carries registration (unless exempt) and private enforcement (background, verify) | Texas marketing SMS off until the owner attests registration or exemption; transactional texts unaffected |
| Canada telemarketing (CRTC rules, National DNCL) | Telemarketing call hours 9 am-9:30 pm weekdays and 10 am-6 pm weekends; DNCL scrubbing; registration with the DNCL operator for telemarketers (background, verify) | Softphone warnings and DNCL check for staff sales calls [V1]; no outbound AI calls |
| Universal opt-out signals (GPC) | Honor Global Privacy Control as an opt-out of sale/sharing where state law requires (background, verify) | Ad pixels suppressed for GPC visitors (4.1.10) |
| Gift card laws | Many US states and Canadian provinces restrict expiry dates and dormancy fees on gift certificates; unclaimed balances may be reportable (background, verify) | No expiry by default, no dormancy fees, liability tracked in 2170 and surfaced in the unclaimed-property report ([09](09-accounting-ledger-integrations.md)) |

### 11.3 Risks and mitigations

| Risk | Likelihood / impact | Mitigation |
|---|---|---|
| A tenant spams and damages shared sending reputation or carrier standing | Medium / High | Per-tenant subaccounts and campaigns, complaint and opt-out rate circuit breakers (pause at more than 2% opt-out on a single SMS campaign or 0.2% email complaint rate), platform kill switch, onboarding education |
| 10DLC approval delays block onboarding value | High / Medium | Email and portal channels work immediately; toll-free interim path; pre-filled compliant website; clear status |
| Google API access (GBP, Ads developer token) delayed or restricted | Medium / Medium | Apply early (pre-MVP); degrade to link-based review requests and CSV imports |
| Instant quote mispricing from bad segmentation | Medium / High | Confidence gating, auto-quote bands, first-visit verification, repricing KPI monitored per Region and model version, quick rollback of model versions |
| AI receptionist error (wrong booking, hallucinated policy) | Medium / Medium | Tool-grounded answers only, confirmation messages, QA sampling, easy human handoff, conservative defaults |
| TCPA litigation against a tenant | Low-Medium / High | Evidence-backed consent, no cold outreach channels, strict quiet hours, documentation exports for counsel |
| Duplicate content penalties from KB plant pages | Medium / Medium | Indexability threshold and canonical strategy (4.1.5) |
| Privacy exposure from gallery/social photos | Low / High | Consent model, automatic redaction, neighborhood-level location only, posting delay |
| Channel deprecation (as with GBP chat) | Medium / Low | Channel adapter abstraction, multi-channel threads, no single-channel dependency in core flows |
| Cost blowouts from AI minutes, mockups or SMS | Medium / Medium | Published meters with ceilings and alerts (AI credits, `voice_ai_minutes`, SMS segments), the widget credit cap, per-feature budgets, abuse controls on the public lead magnet |
| Regulatory drift (state texting laws, FCC revocation rules, carrier policy) outpaces the rule table | High / Medium | Rules stored as reviewed data with `reviewed_at`; quarterly counsel review owned by `platform_owner`; conservative defaults (9 am-7 pm, no Sundays) already inside every known state window |
| Reply-to-book creates unwanted Jobs (misread YES, stale offers) | Medium / Medium | Exact-keyword matching only, one open offer per contact, 7-day expiry, price snapshot, UNDO window, prerequisite agreement and card on file (4.8.2) |

---

## 12. Metrics and KPIs

KPI definitions are shared with [18](18-reporting-analytics.md). Targets are internal goals or estimates, not industry statistics.

### 12.1 Tenant-facing KPIs

| KPI | Definition | Target (internal goal) |
|---|---|---|
| Speed to first response | Median time from inbound lead (form, chat, call, marketplace) to first human or AI response | Under 2 minutes, 24/7 with AI |
| Lead-to-booked rate | Leads that book a site visit or service within 30 days / total qualified leads | Tracked by source; improvement goal +20% vs tenant baseline in first season |
| Instant quote coverage | Residential mowing inquiries receiving a firm or range price / all residential mowing inquiries | At least 60% |
| Instant quote conversion | Instant quotes booked / instant quotes shown | Benchmark by Region after first season |
| Repricing rate | First-visit verifications that trigger repricing / instant-quote bookings | Under 3% |
| Website conversion rate | Visits that produce a lead or booking / total visits | Tracked; template A/B tests aim to lift |
| Review velocity | New Google reviews per 100 completed jobs/visits eligible | Tracked; goal of steady growth without policy risk |
| Average rating and response rate | Mean star rating; % of reviews replied to within 48 h | Reply rate at least 90% |
| NPS | % promoters minus % detractors (relationship survey) | Tracked by crew and service line |
| Detractor follow-up within SLA | Detractor tasks closed within 48 h / total detractor tasks | At least 90% |
| Referral rate | Clients who referred at least one qualified client / active clients (annual) | Tracked; goal set per tenant |
| Campaign revenue per 1,000 recipients | Collected revenue attributed to campaign / recipients x 1,000 | Compare across seasons |
| SMS opt-out rate per campaign | Opt-outs / delivered marketing SMS | Under 1.5% (circuit breaker at 2%) |
| Email deliverability | Delivered / sent; bounce rate; complaint rate | Bounce under 2%, complaints under 0.1% |
| Inbox SLA attainment | Conversations meeting first-response SLA / total | At least 90% |
| Missed call rate | Unanswered calls without voicemail or AI handling / inbound calls | Under 5% with AI receptionist |
| AI receptionist containment and booking rate | Calls resolved without human / AI-handled calls; bookings or qualified leads / new-inquiry calls | Tracked; QA score at least 90% |
| Marketing ROI | Job-costed gross margin attributed to source or campaign / spend | Shown per source; sources with ROI under 1.0x for 2 consecutive quarters flagged |
| CAC and payback | Spend / new clients; months of gross margin to recover CAC | Tracked by source |
| Neighborhood lift | Treated conversion rate minus holdout conversion rate at 60 days | Reported with confidence interval |
| Reply-to-book undo rate | Keyword bookings undone (UNDO or staff cancel within 7 days) / keyword bookings | Under 3%; above that, the campaign's keyword action is auto-disabled for review |
| Marketplace net cost per booked client | (Lead charges minus credits) / clients booked from that marketplace | Shown per marketplace; trend over season |
| Marketplace credit recovery | Credits granted / disputable leads identified | Tracked; the digest exists to raise it |
| Gift certificate redemption | Redeemed value / sold value within 12 months | Tracked; unredeemed balances shown as liability, never as revenue |

### 12.2 Platform-level KPIs (for `platform_owner`)

| KPI | Definition |
|---|---|
| Site activation | % of tenants with a published site on a custom domain within 60 days |
| Messaging activation | % of US tenants with approved 10DLC campaigns; median days to approval |
| Growth module adoption | % of tenants running at least one campaign, review automation, referral program, AI receptionist |
| Messaging health | Platform-wide carrier error rates, opt-out rates, complaint rates; tenants in circuit-breaker state |
| AI credit and voice-minute consumption | Credits by feature (visualizer sets, mockups, copy) and `voice_ai_minutes` used, with margin per credit and per minute ([22](22-business-model-pricing-gtm.md)) |
| Attribution coverage | % of leads with known source across tenants |
| Instant quote model quality | Repricing rate and measurement error vs field-verified areas, by Region and model version |
| Compliance rule freshness | % of `messaging_rule` rows reviewed by counsel in the last 120 days; count of jurisdictions on conservative default only |
| Suppression accuracy | Messages suppressed by reason (consent, quiet hours, attempt cap, state rule) and zero sends to opted-out contacts (audited monthly by replaying the consent ledger) |

---

## 13. Beyond the brief: extra ideas

Ideas the founder did not ask for that compound the module's value. Longer-horizon platform moonshots (homeowner network, AR, IoT) live in [23](23-innovation-moonshots.md).

1. **Route-density pricing as marketing [V1].** Already wired into instant quotes (4.3.3): show prospects "You're on our Tuesday route: save 5%". It turns operations efficiency into a conversion lever and makes routes denser over time.
2. **"Street Club" group offers [V2].** A homeowner can invite neighbors to sign up together; when 3+ addresses on the same street segment book weekly service, each gets a group discount. Shareable link with live progress ("2 of 3 neighbors joined").
3. **Yard Report Card [V1].** An end-of-season personalized report for every maintenance client: visits completed, before/after photos from the season, applications made, rainfall vs irrigation, plant health notes, and next season's recommendations with one-click acceptance. Drives renewals and is highly shareable.
4. **New-homeowner welcome [V2].** Detect recent property sales in the service area from parcel transaction dates and send a welcome postcard with an instant quote within 30 days of closing (physical mail only).
5. **Realtor curb-appeal kit [V2].** Realtor partners order a "list-ready" package (mulch, edging, annual color, mowing) via a partner portal; AI concepts help sellers decide. Concepts are clearly labeled because many MLS rules require disclosure of digitally altered listing photos (verify per MLS).
6. **Weather and growing-degree-day triggers [V2].** Pre-emergent reminders when soil temperatures approach thresholds, irrigation audits during drought declarations, snow contract "last call" when the first forecast snow appears, grub control by GDD.
7. **Commercial RFP radar [V2].** Monitor public bid portals (municipalities, school districts, HOAs that post publicly) for landscape maintenance and snow RFPs in the service area; AI summarizes requirements and drafts a bid package via [03](03-crm-sales-estimating-proposals.md).
8. **Crew thank-you and tips loop [V1].** Clients can thank and tip the crew from the visit summary; tips flow through the Company's Stripe account ([08](08-payments-stripe.md)) and payroll ([15](15-team-hr-payroll.md)); kudos show in the crew app. Morale and retention are growth levers in a labor-constrained industry.
9. **Video proposals and walkthroughs [V1].** Estimators record a 60-second walkthrough video on site; it embeds in the proposal and follow-up journey. Viewing is tracked.
10. **Pollinator and native-yard badges [V2].** Using KB native status per ecoregion, Companies can award clients a shareable "Native Pollinator Yard" badge and yard sign when a planting meets a curated threshold; good PR and a reason for neighbors to ask.
11. **Lost-bid intelligence [V1].** One-question surveys on declined proposals feed a pricing and positioning report ("price" vs "timing" vs "went with someone else"); the copilot suggests price-book adjustments.
12. **Manufacturer and nursery co-op claims [V2].** Where hardscape manufacturers or nurseries offer contractor co-op marketing funds, Rootline packages proof of advertising (mail pieces, posts, invoices) for claims.
13. **Seasonal staffing marketing [V1].** The same campaign engine recruits seasonal crew members in spring (Spanish and English job posts, referral bonuses for employees) with [15](15-team-hr-payroll.md).
14. **Gift certificates and "gift a lawn care season" [V1].** Holiday gift cards for services (for adult children buying for parents), sold through the site as direct charges on the Company's connected Stripe account and booked as gift credit liability (4.25, [07](07-invoicing-billing-contracts.md)).
15. **Privacy-safe lookalike audiences [V3].** Hashed, consented client lists from high-margin segments uploaded to ad platforms to find similar homeowners in the service area, with strict consent checks.
16. **Cross-tenant non-compete referral exchange [V3].** When a tenant cannot serve a request (out of area or service not offered), it can, with the prospect's consent, pass it to a non-competing Rootline tenant (e.g., a tree-care company refers lawn care) for a referral fee settled through each Company's own Stripe account.
17. **Schedule-gap filler [V1].** When a rain-out, cancellation or a fast crew opens capacity on a route day, the copilot finds clients on that route with marketing SMS consent and an open Next Best Offer (4.11), for example "edging + mulch top-up, 2.5 cu yd". It proposes a small, time-boxed offer: "Our Thursday crew has an opening on Elm St. Mulch refresh for your front beds: $265 this Thursday only. Reply YES." The owner approves once per gap and the 4.8.2 keyword rules apply. The crew's idle hours become revenue, and the offer is honest because the gap is real. This is something only a platform that owns both the dispatch board and the campaign engine can do.
18. **Water-wise rebate and incentive finder [V2].** Many water utilities and municipalities, especially in the arid West, pay homeowners to convert lawn to water-wise landscape or to install smart irrigation controllers. The Southern Nevada Water Authority's Water Smart Landscapes program is a well-known example (background, verify current terms). `platform_curator` maintains a rebate table per Region (program, eligible work, rate per sq ft or per device, caps, pre-approval rules, deadlines). The lead magnet (4.4), instant quote and campaigns then show "Your city may pay up to $X toward this conversion; we handle the paperwork." Measured turf area from 4.3.2 is exactly the input those applications ask for, and the Plant KB's water-wise palettes ([12](12-plant-knowledge-base.md)) make the design compliant. Rootline can pre-fill the rebate application packet with before photos and area measurements.
19. **AI search visibility ("answer engine" readiness) [V2].** Homeowners increasingly ask AI assistants and AI search features "who does paver patios near me?" Rootline sites already emit clean structured data, consistent name/address/phone, real reviews and unique local project pages, which are the signals these systems draw on. V2 adds a monthly visibility check that asks major AI assistants a fixed set of local questions for the tenant's services and towns, records whether the Company is mentioned and which sources are cited, and recommends content gaps ("No page explains your irrigation winterization service in Westerville"). No tricks and no generated spam pages: the same quality rules as 4.1.3 apply.
20. **HOA board pack [V1].** For `client_commercial` HOA accounts, a one-click, board-meeting-ready PDF and portal page for each quarter: work completed by Property area, before/after photos, seasonal color rotations, irrigation water use vs last year, snow events serviced with timestamps, open enhancement proposals with renderings from [10](10-design-studio.md) and [11](11-ai-design-mockups.md), and a budget-vs-actual summary for the contract. Board members change every year, and a contractor who makes the property manager look good at the board meeting gets renewed. It is retention marketing disguised as reporting.
21. **Branded and verified sender identity [V2].** Show the Company's verified name and logo wherever the client sees a message. That means BIMI for email (the logo in supporting inboxes, which requires DMARC enforcement, already on the 4.1.7 path), RCS Business Messaging with a verified sender profile as an SMS upgrade where carriers and handsets support it, and branded caller ID programs from carriers and handset makers (Apple Business Connect has announced business caller ID features; background, verify availability for small businesses). Landscapers lose callbacks to "Spam Likely" and unknown-number anxiety, and a verified logo on the on-my-way text and the callback is a measurable answer-rate gain to test.

---

## 14. Open questions

1. **Revocation rule dates:** sources disagree on the effective date of the narrowed "revoke all" rule after the FCC's fall 2026 order (FCC 26-67). Our design honors all revocations immediately, but counsel should confirm whether any tenant-facing settings (exclusive revocation method) are worth offering.
2. **Messaging fees (settled in [22](22-business-model-pricing-gtm.md) 4.4):** segment allowances per tier, $0.02 per overage segment, free inbound SMS, and 10DLC fees absorbed on annual Grow and Pro (see 4.20). Still open: whether the overage price holds once a full season of carrier pass-through costs is measured.
3. **Second carrier:** when to add Telnyx or Bandwidth for redundancy and cost, and how to keep 10DLC registrations portable.
4. **Canadian SMS:** confirm current Canadian carrier requirements for A2P on long codes and short codes, and French-language requirements for Quebec recipients.
5. **Google API approvals:** start GBP API access and Google Ads developer token applications before MVP; confirm whether the LSA Partner Program offers better lead access for a multi-tenant platform.
6. **Thumbtack and other marketplaces:** confirm partner API availability and terms (including any restrictions on moving conversations off-platform).
7. **Plant page SEO strategy:** validate the indexability threshold and canonical approach with an SEO advisor before V1 launch.
8. **Lead magnet economics:** who pays is settled by [22](22-business-model-pricing-gtm.md) (the Company's credit pool at 24 credits per preview set, under a widget cap with a default of 600 credits a month). Still open: what verified-lead conversion rate justifies the cost per Region, and when design partners should move from `verify_first` to the `teaser_then_verify` default.
9. **Recording defaults:** keep "record all calls with disclosure" as default everywhere, or offer per-state defaults?
10. **Imagery licensing:** confirm that chosen imagery and parcel providers permit measurements to be shown to homeowners on tenant sites and stored on the Property.
11. **Instant quote liability:** confirm with counsel the wording of the "firm price" guarantee and first-visit verification terms in the online service agreement.
12. **Website builder scope vs agencies:** do we offer a "done for you" site service via partners at launch, or later?
13. **Facts to verify before external use:** current Jobber, Housecall Pro and ServiceTitan pricing; LMN, Aspire, SingleOps, Arborgold, SynkedUP, Yardbook and Copilot CRM marketing capabilities; current Twilio 10DLC fees; Meta messaging window changes in 2026; USPS EDDM rates; state mini-TCPA windows and caps; Texas SB 140 scope and exemptions; Canadian telemarketing hours; carrier blocking dates for unregistered 10DLC and unverified toll-free traffic; Google Ads API write methods for LSA leads; and branded caller ID availability.
14. **Texas and other state registrations:** which tenant profiles are exempt under Texas's telephone-solicitation statute (for example, texting existing customers), and should Rootline offer a registration filing service or only the attestation gate? Owner: counsel with `platform_owner`.
15. **Reply-to-book scope:** should keyword booking be allowed for new services that change the agreement's annual value by more than a threshold (e.g., $500), or only for add-ons under it? The current proposal applies the agreement's add-on terms; counsel should review the electronic-acceptance wording.
16. **RCS timing:** when RCS Business Messaging with verified senders reaches enough of a tenant's clients (iPhone and Android, US and Canadian carriers) to justify a channel adapter, and whether 10DLC-style registration requirements will carry over.
17. **Gift certificate law matrix:** confirm expiry, dormancy-fee and escheat rules for launch states and provinces before enabling sales. [24](24-roadmap-feature-catalog.md) section 4.6 schedules gift credits for [V1] once this matrix is done, matching [07](07-invoicing-billing-contracts.md) and this doc; [08](08-payments-stripe.md) still lists "Gift a Service" as [V2] and should follow.

---

## Sources

Collected in November 2026. Vendor pages are marketing material; third-party review sites may be affiliated with competitors. Time-sensitive facts are marked "as of Nov 2026, verify" in the text.

**Competitors and point tools**

- Jobber: [Marketing Suite](https://www.getjobber.com/features/marketing-suite/), [Marketing Suite product update (June 2026)](https://productupdates.getjobber.com/148754-marketing-suite-just-got-more-powerful), [Campaigns](https://www.getjobber.com/features/marketing-tools/campaigns/), [Referrals](https://getjobber.com/features/marketing-tools/referrals), [Plus plan help article](https://help.getjobber.com/hc/en-us/articles/29668508840727-The-Plus-Plan), [Lawn care software page](https://www.getjobber.com/industries/lawn-care-software/), [Community thread on AI Receptionist pricing](https://community.getjobber.com/discussions/spring-feature-announcement/customer-q-ai-receptionist-is-the-pricing-im-seeing-on-my-grow-plan-permanent-/2436)
- Jobber AI Receptionist analyses: [Carly review](https://www.usecarly.com/blog/jobber-ai-receptionist/), [Lawn care software pricing analysis](https://sagnikbhattacharya.com/blog/lawn-care-software-pricing-small-crew), [AI Receptionist pricing analysis](https://sagnikbhattacharya.com/blog/jobber-ai-receptionist-pricing-one-van-plumber)
- Housecall Pro: [CSR AI overview](https://help.housecallpro.com/en/articles/9740104-csr-ai-overview), [Automated marketing](https://www.housecallpro.com/features/automated-marketing/), [TechEdge AI on fall 2025 release](https://techedgeai.com/housecall-pro-rolls-out-fall-2025-ai-powered-update-to-supercharge-home-service-businesses/), [Mechanical Hub on fall 2025 release](https://mechanical-hub.com/housecall-pro-unveils-major-ai-powered-updates/), [MowBoss Housecall Pro review](https://mowbosshq.pages.dev/guides/housecallpro-review)
- ServiceTitan: [Manage call extensions in Marketing Pro Ads](https://help.servicetitan.com/how-to/manage-call-extensions), [Phone integrations](https://help.servicetitan.com/docs/phone-integrations-in-servicetitan), [Call tracking and recording in Contact Center Pro](https://help.servicetitan.com/roofing/docs/call-tracking-and-recording-overview-in-contact-center-pro-and-servicetitan.md)
- RealGreen: [Measurement Assistant](https://www.realgreen.com/measurement_assistant.html), [Measuring lawn size with satellite imagery](https://realgreen.com/blog/how-to-accurately-measure-lawn-size-using-satellite-imagery), [LawnStarter review of Real Green](https://lawnstarter.com/blog/?p=52273)
- Service Autopilot: [MowBoss review 2026](https://mowbosshq.pages.dev/guides/service-autopilot-review), [Capterra reviews](https://www.capterra.com/p/122075/Service-Autopilot/reviews/?page=3), [Software Review profile](https://softwarereview.com/s/service-autopilot)
- LawnStarter: [How the instant quote works](https://www.lawnstarter.com/blog/lawnstarter/how-does-lawnstarter-instant-quote-work/), [FAQ](https://www.lawnstarter.com/faq)
- Deep Lawn and alternatives: [Extruct profile of Deep Lawn](https://www.extruct.ai/hub/deeplawn-com), [MyQuoteIQ AI estimating comparison](https://myquoteiq.com/best-ai-estimating-software-lawn-care-2026/), [MyQuoteIQ Jobber alternatives](https://myquoteiq.com/best-jobber-alternative-for-landscaping-companies/)
- User complaints: [Capterra LawnPro reviews (reviewer who left Jobber)](https://www.capterra.com/p/105508/LawnPro/reviews/?page=2)

**Lead marketplaces, Google and Meta**

- Angi: [Setting up API integration with Angi](https://intercom.help/angi/en/articles/10288125-setting-up-api-integration-with-angi), [Angi lead integration API](https://intercom.help/angi/en/articles/15304819-angi-lead-integration-api), [ClientTether Angi integration notes](https://support.clienttether.com/home-advisor/)
- Google Local Services Ads: [Google Ads API local services campaigns](https://developers.google.com/google-ads/api/docs/campaigns/local-service-campaigns), [Retrieve leads using Google Ads API](https://support.google.com/google-ads/answer/12080108), [LSA Partner Program](https://support.google.com/localservices/answer/10209924), [Google Ads API forum on LSA lead report deprecation](https://groups.google.com/g/adwords-api/c/PP7d0bCOGKg)
- Google Business Profile: [API access guide (testimonial.to)](https://testimonial.to/resources/google-business-profile-api); chat shutdown: [9to5Google](https://9to5google.com/2024/05/28/google-business-messages-shutting-down/), [Android Central](https://www.androidcentral.com/apps-software/google-shutting-down-maps-business-chat), [PPC Land](https://ppc.land/google-business-profile-chat-feature-to-sunset-on-july-31-2024), [DAC Group](https://dacgroup.com/local-search-news/google-sunsetting-business-profile-call-history-chat)
- Google review policies: [BrightLocal review platform guidelines](https://www.brightlocal.com/learn/review-management/dos-and-donts/review-platform-guidelines/), [Podium on review gating](https://www.podium.com/article/review-gating), [DAC Group on incentivized review enforcement](https://www.dacgroup.com/?p=159133), [Search Engine Roundtable on review restrictions](https://seroundtable.com/google-reviews-restrictions-business-profile-violations-38068.html)
- Meta messaging windows: [inro 24-hour window glossary](https://www.inro.social/glossary/24-hour-messaging-window), [eesel on Instagram DM rules](https://www.eesel.ai/blog/ai-for-instagram-dms), [Spur on 7-day ad messaging window](https://www.spurnow.com/en/blogs/instagram-messenger-ads-7-day-messaging-window)

**Messaging, telephony and regulation**

- 10DLC: [Twilio ISV onboarding API guide](https://www.twilio.com/docs/messaging/compliance/a2p-10dlc/onboarding-isv-api.md), [Twilio secondary vetting](https://support.twilio.com/hc/en-us/articles/4403988619163-Secondary-Vetting-for-A2P-10DLC), [Bandwidth 10DLC registration guide](https://www.bandwidth.com/blog/how-to-register-with-10dlc-to-avoid-unnecessary-costs-in-2022/), [DEV community 10DLC survival guide 2026](https://dev.to/alfredo_romero_fc4afdcb68/a2p-10dlc-survival-guide-for-voice-agencies-2026-carrier-filtering-is-now-real-time-29mp)
- TCPA one-to-one consent vacatur: [Morrison Foerster](https://mofo.com/resources/insights/250130-eleventh-circuit-vacates-fcc-s-tcpa-one-to-one-consent-rule), [Kelley Drye](https://www.kelleydrye.com/viewpoints/blogs/ad-law-access/eleventh-circuit-vacates-tcpa-11-consent-rule), [Wiley](https://www.wiley.law/alert-UPDATE-11th-Circuit-Vacates-FCCs-One-to-One-TCPA-Consent-Rule)
- TCPA revocation rules: [Nixon Peabody (April 2025)](https://www.nixonpeabody.com/insights/alerts/2025/04/11/fcc-partially-delays-new-tcpa-consent-revocation-rules), [Mac Murray and Shuster (delay to 2027)](https://mslawgroup.com/delayed-again-fcc-pushes-back-tcpas-revoke-all-rule-to-january-31-2027/), [Crowell (2026 amendments)](https://www.crowell.com/en/insights/client-alerts/fcc-officially-adopts-amendments-to-tcpa-rules), [National Law Review](https://natlawreview.com/article/fcc-adopts-overhaul-tcpa-consent-revocation-rules-revoke-all-narrowed-exclusive-opt), [FCC fact sheet, Sept 2026](https://docs.fcc.gov/public/attachments/DOC-424844A1.pdf), [FCC 26-67](https://docs.fcc.gov/public/attachments/FCC-26-67A1.pdf)
- AI voices under TCPA: [Cooley](https://www.cooley.com/news/insight/2024/2024-02-15-fcc-ai-generated-robocalls-illegal-under-the-tcpa), [Orrick](https://www.orrick.com/insights/2024/02/Did-the-FCC-Really-Ban-AI-Generated-Voice-Calls-No-But-Restrictions-Apply), [Perkins Coie](https://perkinscoie.com/insights/update/fcc-declares-ai-generated-robocalls-unlawful)
- Call recording consent: [Kilpatrick Townsend on US wiretap laws](https://ktslaw.com/blog/globalprivacy-and-cybersecuritylaw/2024/7/wiretap-laws-in-the-united-states), [Metaverse Law on two-party consent](https://www.metaverselaw.com/two-party-consent-requirements-for-recording-calls/)
- USPS EDDM rates: [MailPro EDDM printing and rates](https://www.mailpro.org/post/eddm-printing), [Catdi EDDM Retail vs BMEU](https://www.catdi.com/guides/eddm/retail-vs-bmeu)

**Background references (well-established; verify before relying on specifics)**

- FTC, [CAN-SPAM Act: A Compliance Guide for Business](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business)
- CRTC, [Frequently Asked Questions about Canada's Anti-Spam Legislation](https://crtc.gc.ca/eng/com500/faq500.htm)
- Google Workspace Admin Help, [Email sender guidelines](https://support.google.com/a/answer/81126)
- IETF, [RFC 8058: Signaling One-Click Functionality for List Email Headers](https://www.rfc-editor.org/rfc/rfc8058)
- FTC, [Trade Regulation Rule on the Use of Consumer Reviews and Testimonials](https://www.ftc.gov/legal-library/browse/rules/rule-use-consumer-reviews-testimonials)
- FCC, [Reassigned Numbers Database](https://www.reassigned.us/)
- FTC, [National Do Not Call Registry](https://www.donotcall.gov/)
- [18 U.S.C. 1725 (postage-free matter in letter boxes)](https://www.law.cornell.edu/uscode/text/18/1725)
- web.dev, [Web Vitals](https://web.dev/articles/vitals)
- W3C, [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/)

**Background references for state texting rules, Canadian telemarketing, privacy signals and branded-sender channels (general knowledge; verify before relying on specifics)**

- Texas Legislature Online, [SB 140, 89th Legislature (bill history)](https://capitol.texas.gov/BillLookup/History.aspx?LegSess=89R&Bill=SB140): extension of the telephone-solicitation statute to text messages
- Florida Statutes, [Section 501.059, Telephone solicitation (Florida Telephone Solicitation Act)](https://www.flsenate.gov/Laws/Statutes/2024/501.059)
- CRTC, [Unsolicited Telecommunications Rules](https://crtc.gc.ca/eng/trules-reglest.htm) and the [National Do Not Call List](https://www.lnnte-dncl.gc.ca/)
- [Global Privacy Control](https://globalprivacycontrol.org/) and California Attorney General, [CCPA overview](https://oag.ca.gov/privacy/ccpa)
- Schema.org, [LocalBusiness](https://schema.org/LocalBusiness)
- BIMI Group, [Brand Indicators for Message Identification](https://bimigroup.org/)
- Google for Developers, [RCS Business Messaging](https://developers.google.com/business-communications/rcs-business-messaging)
- Apple, [Apple Business Connect](https://www.apple.com/business/connect/)
- Southern Nevada Water Authority, [rebates and Water Smart Landscapes program](https://www.snwa.com/)
