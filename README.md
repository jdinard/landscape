# Rootline

**The landscape business operating system** (working name). This repository holds the complete specification for an all-in-one platform for small and medium landscape companies.

Rootline runs a landscape company in one system, from first photo to closed books:

- to-scale designs and honest AI mockups of the client's own yard, using plants rated for the client's region;
- priced proposals with e-signature and deposits;
- crew schedules and routes, run in an offline-first, Spanish-first crew app;
- invoicing and payments through each Company's own Stripe account, with zero markup by default;
- a built-in double-entry ledger that closes the books.

A curated, region-aware Plant Knowledge Base underpins design, estimating and client care.

**How it gets built.** Rootline is two people: the founder and Claude. It ships as **one release, v1**, with everything these documents describe. Claude builds it from the specs ([25](docs/25-platform-blueprint-build-handoff.md)), markets it ([26](docs/26-agent-led-marketing-playbook.md)) and runs Rootline's operations as operator agents in the console, with the founder deciding and approving. Every contradiction between documents and every open decision is settled in the decision record, [24 section 1](docs/24-product-scope-decisions-catalog.md#1-the-decision-record).

Marketing starts in the **Great Lakes**: six Regions across Ohio, Michigan, Chicagoland and Northwest Indiana, and Southeast Wisconsin, where the plant data is seeded first. The product works across the US and Canada. Because Great Lakes crews plow in winter, **Snow Lite** (storm visit logs with GPS-stamped photos, per-push invoices and a per-site proof-of-service PDF) is free in every plan, and the full Snow & Ice module is an add-on.

## Start here

- **[Status](docs/STATUS.md)**: what's done and what happens next.
- **[Platform Explorer](docs/site/app.html)**: the whole platform mocked up, 155 screens across every surface (company app, crew app with its manager and sales modes, customer portal, subcontractor lite, the founder's admin console, the partner hub, the marketing site and the homeowner funnel). View it as any role or persona, on any package, in any target market, with the rule behind each screen.
- **[Decision record and feature catalog](docs/24-product-scope-decisions-catalog.md)**: the binding decisions (one release, two people, every contradiction and open decision settled) and all 747 cataloged features, every one of them in v1.
- **[Build handoff](docs/25-platform-blueprint-build-handoff.md)** and **[agent-led marketing playbook](docs/26-agent-led-marketing-playbook.md)**: how Claude builds Rootline from these specs, and how Claude markets it safely.
- **[Platform blueprint data](docs/platform/)**: machine-readable roles, permissions, personas, packages and entitlements, target segments, sample tenants and every route, for the build to generate code from.
- **[Clickable AI design walkthrough](docs/site/prototype.html)**: step through the agentic design flow, from a homeowner's photos and measurements to AI mockups, a to-scale plan, an estimate, a proposal and client approval.
- **[Clickable recurring work walkthrough](docs/site/recurring.html)**: one 9,000 sq ft lawn for one season, from a Quick Quote and an online booking to route visits in the Spanish-first crew app, a Spot it upsell, a rain-day reshuffle, level billing with autopay, a failed card and the season true-up and renewal.
- **[Product overview](docs/README.md)**: the front door to the documents, with the executive summary, the 10 big bets, personas, the surface map, the lead-to-cash-to-books flow, a map of every module doc, what v1 includes, the business model, reading paths and the glossary.
- **[UI concept screens](docs/site/)**: the vision site (`index.html`), the Platform Explorer (`app.html`), the clickable walkthroughs and static screen mockups (`screens-*.html`). Open them in any browser, with no build step.

## What is in `docs/`

- **01-23**: module docs covering market, personas and permissions, sales and estimating, scheduling, the crew app, the portal, billing, payments, accounting, Design Studio, AI mockups, the Plant KB, operations, service lines, HR, marketing, AI and automation, reporting, the operator console, architecture, UX, pricing and innovation bets.
- **24**: the decision record and the master feature catalog.
- **25-26**: the platform blueprint and build handoff, and the agent-led marketing playbook.
- **platform/**: the blueprint as data (`roles`, `personas`, `plans`, `segments`, `tenants`, `surfaces` JSON) with a validator.
- **research/R1-R4**: research on field-service platforms, landscape software, design tools and plant data, and industry payments and accounting.

Status: complete specification, November 2026; the build is next. Competitor facts are marked "verify" and are checked against a primary source before any public use. Every Rootline price and cost figure is a proposal or an estimate.
