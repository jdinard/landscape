# 12 - Plant Knowledge Base

> The Plant Knowledge Base (KB) is the operator's crown jewel: a curated, region-aware, fully sourced database of thousands of landscape plants that every other part of Rootline trusts. It holds the taxonomy (family down to cultivar, trade names, patents and synonyms), traits (size, form, bloom, foliage, seasonal color), requirements (hardiness and heat zones, sun, water including WUCOLS, soil, pH, drainage, salt), characteristics (deer resistance, pollinator and host-plant value, native and invasive status by jurisdiction, toxicity, allergenicity, fire-wise, maintenance calendar, pests), commercial data (container sizes, cost bands, nursery availability) and licensed media (seasonal photos, 2D plan symbols, 3D archetypes, AI reference images). On top of the plant records sits a geospatial **Region** model that turns any address into a site context (USDA zone, ecoregion, county, metro, operator-drawn Region) and a **Plant Region Profile** layer where curators say, with evidence, how well each plant actually does there on a 1-5 scale. The KB is what keeps a designer from putting a zone 8 plant in a zone 5 bed, stops the AI from rendering a banned Callery pear in Columbus, tells the crew what that shrub is from a photo, writes the client's care guide, and powers SEO plant pages. Curating thousands of plants across dozens of Regions by hand is impossible, so this document also specifies the curation machine: bulk imports with diff preview, AI enrichment that drafts traits with citations and confidence scores, a review queue, field-level provenance, versioned releases, synonym merging against POWO/WFO, quality dashboards and regional rating sessions. No field-service competitor has any of this; design tools that have plant libraries do not know the region, the law or the price.

**Related docs:** [Personas and permissions](02-personas-roles-permissions.md) | [CRM, estimating and proposals](03-crm-sales-estimating-proposals.md) | [Crew app](05-field-crew-mobile-app.md) | [Customer Portal](06-customer-portal.md) | [Design Studio](10-design-studio.md) | [AI design and mockups](11-ai-design-mockups.md) | [Operations, inventory and nurseries](13-operations-inventory-equipment.md) | [Service lines (PHC, tree care, irrigation)](14-service-line-modules.md) | [Marketing and SEO pages](16-marketing-growth-communications.md) | [AI copilot and automation](17-ai-copilot-automation.md) | [Reporting](18-reporting-analytics.md) | [Platform Admin console](19-platform-admin-portal.md) | [Architecture and security](20-architecture-security.md) | [UX and design system](21-ux-design-system-sitemaps.md) | [Business model and GTM](22-business-model-pricing-gtm.md) | [Moonshots](23-innovation-moonshots.md) | [Roadmap](24-roadmap-feature-catalog.md)

**Conventions used in this document**

- Requirement IDs look like `KB-TAX-03`. Each feature carries a priority tag: [MVP], [V1], [V2] or [V3].
- Running examples: **Cedar & Stone Landscapes**, a fictional 38-person design-build-maintain Company in Columbus, Ohio (the same example used in [13](13-operations-inventory-equipment.md)); the curated Region **"Central Ohio"** inside the macro-region **"Great Lakes and Ohio Valley"** (one of the beachhead clusters in [22](22-business-model-pricing-gtm.md)); plus **"Colorado Front Range"** and **"Golden Horseshoe, Ontario"** for contrast.
- Plant facts used in examples (zones, ratings, prices, availability) are illustrative unless a source is cited. Legal and data facts that can change are marked "verify". Estimates are labeled as estimates.
- Botanical names follow the International Code of Nomenclature for Cultivated Plants style: genus and species in italics in the UI, cultivar epithets in single quotes (`Hydrangea paniculata 'Limelight'`), trade names (selling names) shown separately and never inside quotes (`Endless Summer®` is the trade name for `Hydrangea macrophylla 'Bailmer'`).

---

## 1. Goals and non-goals

### 1.1 Goals

| # | Goal | Measure of success |
|---|---|---|
| G1 | **Right plant, right place, every time.** Every plant shown by default, placed by AI or validated in a design is checked against the property's Region, zones, sun, water and legal status. | 99% or better region-compliance on the plant-recommendation eval set (the release gate in [19](19-platform-admin-portal.md)); zero legally prohibited plants in sent proposals |
| G2 | **Breadth.** Cover the plants North American landscape contractors actually buy. | 3,000 plants at Silver completeness or better at MVP launch; 6,000 by V1; 10,000+ by V2 (targets) |
| G3 | **Regional depth where we sell.** Beachhead Regions are "excellent": rated profiles and palettes for every common use. | 600 or more rated plants per beachhead Region; palettes for foundation, pollinator, shade, rain garden, screening, deer-resistant and xeric uses (the coverage bar set in [22](22-business-model-pricing-gtm.md)) |
| G4 | **Trust through provenance.** Every value can answer "who said so, based on what, when?" | 100% of critical traits carry at least one citation and a second-curator review; field-level provenance on 100% of values |
| G5 | **Curation at scale.** A handful of curators can maintain thousands of plants across dozens of Regions. | Curator throughput doubled by AI enrichment (the KPI in [19](19-platform-admin-portal.md)); median review time per non-critical AI suggestion under 30 seconds |
| G6 | **Search that understands landscapers.** Faceted, semantic and visual search that answers real questions. | p95 latency under 300 ms (faceted) and 1.5 s (natural language); zero-result rate under 3%; 40% or more of searches end in an "add" action |
| G7 | **Licensed, beautiful media.** Seasonal photos and symbols that can be printed in proposals without legal risk. | Zero unlicensed assets served; takedowns complete within 24 hours; 95% or more of palette plants with licensed photos in launch Regions |
| G8 | **Fresh and lawful.** Regulatory status (invasive and noxious lists) is current. | Regulatory changes published within 72 hours of a curator learning of them, and before the legal effective date when known |
| G9 | **A learning loop.** Real installs make the KB smarter. | Warranty replacement and plant-failure data (aggregated, k of 10 or more Companies) feed every beachhead Region's ratings by V1 |
| G10 | **Buyable plants.** Designs specify plants that can actually be sourced. | By V1, 70% or more of plants specified in beachhead designs show availability from at least one vendor within 50 miles (target) |

### 1.2 Non-goals

- **Not a taxonomic authority.** Rootline follows an accepted-name backbone (the World Checklist of Vascular Plants as published through Plants of the World Online, cross-referenced to World Flora Online). We do not publish taxonomic opinions; we decide only what name to *display* to the trade.
- **Not a consumer gardening encyclopedia first.** Public plant pages exist for SEO and lead generation ([16](16-marketing-growth-communications.md)), but the KB is built for professionals who design, price, install and warranty plants.
- **Not a pesticide label library.** Chemical products, EPA/PCP registration numbers and application logs live in [05](05-field-crew-mobile-app.md), [13](13-operations-inventory-equipment.md) and [14](14-service-line-modules.md). The KB links pests and diseases to host plants but does not prescribe products.
- **Not nursery production software.** Growers' crop planning is out of scope; the KB only ingests their availability and price lists ([13](13-operations-inventory-equipment.md)).
- **Not medical, veterinary or legal advice.** Toxicity and regulatory data are compiled references with citations and disclaimers, not determinations.
- **Not an open wiki.** Companies can suggest changes and report failures; only platform curators change the global record.
- **Not a full turfgrass agronomy system.** Turfgrass species and cultivars exist as Plants (so lawn programs and overseeding can reference them), but fertility and pest programs are owned by [14](14-service-line-modules.md).

---

## 2. Market research: what competitors do, what users complain about, the gap we exploit

> **Research note.** The run-wide web-search budget was exhausted before this document's research began, and direct fetches to hosts outside the session's network allowlist failed (for example the USDA hardiness map site and Wikipedia). This section therefore relies on (a) sources already gathered and cited by sibling Rootline documents and research reports, and (b) the author's domain knowledge of public plant-data sources, which is clearly marked "verify". See [Sources](#sources).

### 2.1 What competitors do today

| Product (owner) | Plant data today | What that means for a landscaper | Source |
|---|---|---|---|
| Jobber, Housecall Pro, ServiceTitan core, Workiz | Generic product and service catalogs. No plant database, no region model, no plant traits. | A "plant" is a line item with a price. The designer's knowledge lives in their head or a spreadsheet. | [R1 feature matrix](research/R1-field-service-platforms.md) (region-aware plant database: N for every platform reviewed) |
| Service Autopilot (Xplor), Real Green (WorkWave), Yardbook, Copilot CRM | Lawn-care programs and service catalogs. No plant KB. | Good for rounds-based lawn treatments; nothing for design-build. | [R1](research/R1-field-service-platforms.md), [R2](research/R2-landscape-specific-platforms.md) |
| LMN (Granum) | Materials and catalog items for budget-based estimating; SiteOne ordering integration since about 2021. No region-aware plant knowledge. | Plants can be priced and ordered, but nothing says whether they will survive. | [Turf Magazine](https://turfmagazine.com/lmn-integrates-siteone-landscape-supply-in-2021-software/), [LMN blog](https://golmn.com/blog/partner-in-spotlight-siteone-landscape-supply) |
| Aspire (ServiceTitan) | Catalog items with vendor pricing; PropertyIntel measures what exists on a site. No plant KB. | Excellent for measuring and maintaining what is there, not for choosing what should be planted. | [Landscape Management](https://www.landscapemanagement.net/aspire-software-launches-new-propertyintel-measuring-and-estimating-tool/), [R2](research/R2-landscape-specific-platforms.md) |
| SynkedUP | Estimating catalog and kits for landscape quoting. No plant traits. | Fast quotes; plant choice is manual. | [SynkedUP landscaping](https://synkedup.com/industry/landscaping/), [quoting guide](https://synkedup.com/streamline-your-landscape-quoting-process-with-synkedup-a-quick-guide/) |
| SingleOps (Granum) | Tree Inventory (launched March 2025) records trees on a property. | Asset records for arborists; no curated landscape palette, no region ratings. | [SingleOps Tree Inventory](https://singleops.com/features/tree-inventory) |
| Arborgold | GPS-located tree inventory, plant health care programs, a measuring tool. | Tree-focused; species are labels, not a curated KB with regional performance. | [Arborgold blog](https://arborgold.com/blog/tree-care-arborist/the-best-tree-inventory-software-for-tracking-your-trees-and-clients/), [Arborgold help](https://help.arborgold.com/en/articles/4423488-landscape-measuring-tool-basics) |
| PRO Landscape+ (Drafix) | Design software with a plant library and photo imaging. | Reviewers ask for "more native plants suited to their climate zone" and say plant symbols are hard to tell apart. | [Capterra UK](https://www.capterra.co.uk/software/126135/pro-landscape), [Software Advice](https://www.softwareadvice.com/landscaping/pro-landscape-profile) |
| Land F/X, Vectorworks Landmark | CAD plug-ins and BIM tools with plant databases that drive planting schedules. | Professional-grade schedules for landscape architects, but separate from estimating, jobs and invoicing, and not regionally curated. | [Land F/X planting schedules](https://www.landfx.com/docs/planting/schedules.html), [Vectorworks schedules](https://app-help.vectorworks.net/2015/NNA/eng/VW2015_Guide/Worksheets/Creating_Schedules_Automatically.htm) |
| Consumer AI design apps (Neighborbrite and similar) | The image model chooses the plants. | Penn State Extension found a popular tool weak on plants and could not filter to natives without a paid plan; a 2026 guide warns AI tools often suggest plants that will not survive the zone. | [Penn State Extension](https://extension.psu.edu/ai-garden-design-intelligent-choices), [Cognitive Future](https://cognitivefuture.ai/best-ai-tools-for-landscape-design/) |
| Public reference sites (USDA PLANTS, Missouri Botanical Garden Plant Finder, NC State Extension Gardener Plant Toolbox, Lady Bird Johnson Wildflower Center, Calscape) | Deep, authoritative plant data, much of it free to read. | Great for research, but disconnected from design, pricing and jobs; licensing ranges from public domain to all-rights-reserved; regional performance is rarely explicit. | Domain knowledge; see the source registry in 4.6 (verify each source's terms) |

### 2.2 What users complain about

| Pain | Evidence | What it costs a Company |
|---|---|---|
| **Plant libraries that do not know the region.** | PRO Landscape+ reviewers ask for native plants suited to their climate zone ([Capterra UK](https://www.capterra.co.uk/software/126135/pro-landscape)). Design Studio research found generic libraries put zone 8 plants in zone 5 designs ([10](10-design-studio.md)). | Warranty replacements at full cost, lost credibility with clients. |
| **AI that invents or misplaces plants.** | Penn State Extension's review of AI garden tools ([Penn State Extension](https://extension.psu.edu/ai-garden-design-intelligent-choices)); "AI tools regularly suggest plants that will not survive your zone" ([Cognitive Future](https://cognitivefuture.ai/best-ai-tools-for-landscape-design/)); an anecdotal Reddit comment that generic AI invents plants that make no sense for the weather ([Reddit snapshot](https://reddit.sentinel-team.org/posts/1srelgp/snapshots/2026-04-24T23%3A03%3A08.204571Z)). | Clients fall in love with renders the Company cannot build or warranty. |
| **Plant knowledge lives in one person's head.** | Identified as pain P4 in the platform research ([R1](research/R1-field-service-platforms.md), labeled an estimate there). | When the lead designer leaves, quality and margins drop; new estimators guess. |
| **Native filters behind paywalls, symbols that look alike.** | [Penn State Extension](https://extension.psu.edu/ai-garden-design-intelligent-choices), [Software Advice](https://www.softwareadvice.com/landscaping/pro-landscape-profile). | Designers cannot prove "native" or "deer-resistant" claims to clients. |
| **Availability lists arrive as PDFs and spreadsheets.** | Industry practice (domain knowledge): wholesale nurseries send weekly availability lists in PDF or Excel with abbreviated names ("Hyd pan Limelight #5"). Rootline's ops research specifies a parser for exactly this ([13](13-operations-inventory-equipment.md)). | Estimators retype names and sizes; substitutions happen late, on the truck. |
| **Name chaos.** | Domain knowledge: taxonomy changes (Russian sage moved from *Perovskia atriplicifolia* to *Salvia yangii*; many asters to *Symphyotrichum*; *Sedum spectabile* to *Hylotelephium spectabile*), trade names that differ from cultivar names (Knock Out® is `Rosa 'Radrazz'`), and regional common names. | Duplicate items in price books, wrong plants ordered, confused clients. |
| **Legal and safety blind spots.** | Domain knowledge: invasive and noxious lists differ by state and province and change (for example, Ohio's ban on selling Callery pear took effect in 2023, verify); toxicity matters to pet owners and daycare clients. | Fines, ripped-out plantings, liability and reputational harm. |

### 2.3 The reference-data landscape (why "just use free data" does not work)

1. **Fragmented by trait.** Hardiness comes from one place, water use from another (WUCOLS covers California only), deer ratings from a handful of extension lists, toxicity from ASPCA and poison-control references, invasive status from 60+ state and provincial lists. Nobody joins them.
2. **Not regional performance.** A zone range says a plant *survives* the winter. It does not say it *thrives* in Central Ohio's heavy clay, humid summers and deer pressure. That judgment is what experienced horticulturists add, and it is what the Plant Region Profile captures.
3. **Licensing is a minefield.** Government data (USDA PLANTS, EPA ecoregions, the USDA hardiness map, SSURGO soils) is generally public domain; botanic-garden and extension content is usually copyrighted; community photos carry per-photo licenses, often non-commercial. A commercial product must track license per field and per image (4.6).
4. **No workflow.** None of it links to a Price Book item, a design symbol, a nursery availability line, a warranty or a care guide.

### 2.4 The gap we exploit

Rootline is the only platform that connects **curated regional plant intelligence** to **design, AI rendering, estimating, purchasing, installation, warranty and client care** in one data model. The KB is both product (designers and estimators use it daily) and moat (a curated, provenance-tracked regional dataset improves with every install and is hard to copy).

> **Competitive edge: vs Jobber, Housecall Pro, ServiceTitan, Service Autopilot, Yardbook, Copilot CRM.** They have no plant data at all. Rootline's plant picker knows that the Cedar & Stone client in Upper Arlington has clay soil, deer and a dog, and shows only plants rated 3/5 or better for Central Ohio that are deer-resistant and pet-safe, with this week's availability from two local nurseries.

> **Competitive edge: vs LMN, Aspire, SynkedUP.** They price plants; Rootline also knows whether the plant will live. A plant with a 2/5 Region rating triggers a margin-protecting warning before the estimator adds a one-year warranty to a $14,800 install.

> **Competitive edge: vs PRO Landscape+, Land F/X, Vectorworks.** Their libraries are static and national. Rootline's is curated per Region by named horticulturists, versioned weekly, legally aware (state and provincial invasive lists with effective dates) and tied to live nursery availability and the Company's own prices.

> **Competitive edge: vs consumer AI design apps.** They let the image model pick plants. Rootline picks plants from the regional KB first and only then renders them ([11](11-ai-design-mockups.md)), so a homeowner in Denver never falls in love with a hydrangea that will fry on a west-facing hell strip.

---

## 3. Personas and jobs-to-be-done

| Persona (role key) | Jobs-to-be-done | What success sounds like |
|---|---|---|
| Platform Operator (`platform_owner`) | Set KB policy (what counts as evidence, rating rubric, coverage bar per Region), choose and fund Regions, approve data licenses and brand partnerships, protect editorial independence. | "Central Ohio and the Front Range are at Excellent; the Golden Horseshoe hits Excellent before Landscape Ontario Congress." |
| Platform curator (`platform_curator`), levels contributor, curator and senior | Draft and review plant records and Region profiles; run rating sessions; resolve duplicates; manage photos and licenses; publish releases (senior). | "I cleared 140 AI suggestions for xeric perennials before lunch, and every critical trait has two sources." |
| Platform engineer (`platform_engineer`) | Run import profiles, enrichment pipelines, search indexes, embeddings and releases; keep the KB API fast. | "The 2027.04.12 release reindexed in 9 minutes with zero tenant errors." |
| Platform support (`platform_support`) | Answer "why can't I find plant X?" and "why is this plant flagged?" tickets; route suggestions to curators. | "I can see the exact rule and source that flagged burning bush for this Massachusetts property." |
| Business Owner (`owner`) | Standardize what the Company plants and warranties; protect margin; build a Company palette. | "My new estimators pick from our 220 proven plants, and warranty losses are down." |
| Landscape Designer (`designer`) | Find the right plant fast for a bed's sun, soil, size and style; prove claims (native, deer-resistant, pet-safe) to clients; get beautiful symbols and photos. | "I typed 'shade evergreen under 4 ft, clay, deer' and had five good options with availability in ten seconds." |
| Sales Rep / Estimator (`estimator`) | Price plants by size from the Price Book, know availability and substitutes, avoid warranty traps. | "The picker told me 'Green Velvet' boxwood is short this spring and suggested 'Shamrock' inkberry at the same size and price class." |
| Operations / Account Manager (`ops_manager`) | Order the right plants, handle substitutions, plan care in the holding yard, manage warranty replacements. | "The nursery's PDF list became a matched availability table in a minute." |
| Crew Lead (`crew_lead`) and Field Technician (`technician`) | Identify plants on site, install the right plant in the right bed, know care tasks; work offline and in Spanish. | "I snapped a photo of the dead shrub, the app said *Ilex crenata*, likely root rot in wet clay, and logged the warranty claim." |
| Office Manager (`office_manager`) | Generate care guides and plant cards for clients; answer client plant questions. | "The care guide went out automatically after the install closed." |
| Bookkeeper (`bookkeeper`) | Rarely touches the KB; sees plant categories on COGS lines ([09](09-accounting-ledger-integrations.md)). | "Plant purchases map to 'Materials COGS - Plants' automatically." |
| Subcontractor (`subcontractor`) | See the plant list and install specs for assigned work only. | "I knew exactly what went in Bed C." |
| Residential client (`client_residential`) | Understand what is planted, why, and how to care for it; check pet safety. | "Every plant in my yard has a card with watering tips, and the app warned me the lily is toxic to cats." |
| Commercial client (`client_commercial`) | Meet HOA or municipal plant lists, sustainability goals (native share, water use) and budgets across many properties. | "The plan shows 62% native plants and all species on the HOA approved list." |
| Nursery or supplier contact (external, via Nursery Connect in [13](13-operations-inventory-equipment.md)) | Publish availability and prices once and reach every Rootline contractor nearby. | "I upload my weekly list and contractors find my plants in their picker." |
| Public visitor (anonymous) | Learn whether a plant suits their area; find a local pro. | "The page said this plant is rated 5/5 for Central Ohio and linked me to three local designers." |

---

## 4. Feature specification

### 4.0 How the KB is organized

The KB has four layers. Each layer is owned by a different set of people and changes at a different speed.

| Layer | What it holds | Owner | Change cadence | Storage |
|---|---|---|---|---|
| **Global canonical** | Plants, names, traits, media, symbols, pests and diseases | `platform_curator` | Daily releases [MVP] | `kb.*` global tables (no RLS, read-only to tenants) per [20](20-architecture-security.md) |
| **Geographic** | Regions, region layers, jurisdictions, regulatory listings, native ranges, Plant Region Profiles, Plant Palettes | `platform_curator` (Region definitions also `platform_owner`) | Profiles daily; Region geometry rarely, versioned | `kb.*` global tables plus PostGIS |
| **Commercial** | Size specs, nursery listings, availability and price bands | Feeds plus curators | Hourly to weekly | `kb.nursery_*` global plus tenant `vendor_availability` ([13](13-operations-inventory-equipment.md)) |
| **Tenant overlay** | Private plants, favorites, Company palettes, notes, Price Book links, hidden plants, Company ratings | Each Company | Real time | RLS-protected `kb.tenant_*` tables ([20](20-architecture-security.md)) |

```mermaid
flowchart LR
    subgraph SRC["Sources"]
        S1["Taxonomic backbones: WCVP/POWO, WFO, GBIF"]
        S2["Government data: USDA PLANTS, hardiness maps, ecoregions, soils"]
        S3["Extension and botanic garden references"]
        S4["Nursery availability and brand catalogs"]
        S5["Curator field knowledge and rating sessions"]
        S6["Tenant feedback and warranty outcomes"]
    end
    subgraph ING["Ingestion"]
        I1["Bulk import with diff preview"]
        I2["AI enrichment with citations"]
        I3["Feed parsers"]
    end
    subgraph CUR["Curation"]
        C1["Change requests"]
        C2["Review queue and second review"]
        C3["Release builder"]
    end
    subgraph READ["Read models"]
        R1["Compiled plant documents"]
        R2["Facet tables and search index"]
        R3["Vector embeddings"]
        R4["Offline subset for crew app"]
    end
    subgraph USE["Consumers"]
        U1["Design Studio"]
        U2["AI mockups and layouts"]
        U3["Estimating and Price Book"]
        U4["Portal, care guides, SEO pages"]
        U5["Crew app and plant ID"]
        U6["Copilot and public API"]
    end
    SRC --> ING --> CUR --> READ --> USE
    S5 --> C1
    S6 --> C1
```

**Design decision (opinionated):** canonical storage is a typed attribute-value model (one row per trait value, each with its own provenance) because field-level provenance, conflicts and per-Region overrides are first-class requirements. Reads never touch that model directly: every release compiles a denormalized **plant document** (JSONB) per plant and per Region, plus facet columns and embeddings. Writers get rigor; readers get speed.

### 4.1 Plant records, taxonomy and names (KB-TAX)

**KB-TAX-01 Plant record grain [MVP]**
- A **Plant** is either a *taxon record* (species, subspecies, variety, forma or named hybrid, for example `Hydrangea paniculata`) or a *cultivar record* (for example `Hydrangea paniculata 'Limelight'`).
- Cultivar records have `parent_plant_id` pointing to the taxon record and **inherit every inheritable trait** they do not override. The editor shows inherited values in grey with "from species", and an override in black with its own provenance. Changing the species value propagates to children that inherit it in the next release.
- Hybrids of uncertain parentage attach to a genus-level parent record (for example `Hosta 'Sum and Substance'` under `Hosta`). Genus-level records are not placeable in designs unless flagged `placeable_generic` (for example "Hosta, assorted cultivars" in commercial bid work, shown with a warning that traits are approximate).
- **Series and seed strains** (for example a color series of *Echinacea* or a seed-grown strain) are modeled as a `plant_series` that groups cultivar records and can carry shared traits.
- Rule: a cultivar record is created only when it is a distinct buyable item or differs in at least one ornamental, size or requirement trait. Pure marketing renames become trade names on the existing record, not new records.

**KB-TAX-02 Name components [MVP]**

| Field | Example | Rules |
|---|---|---|
| `family` | Hydrangeaceae | From backbone; required |
| `genus` | *Hydrangea* | Required; capitalized |
| `hybrid_marker` | × (as in *× Heucherella* or *Calamagrostis* × *acutiflora*) | Enum: none, interspecific, intergeneric, graft-chimaera |
| `specific_epithet` | *paniculata* | Lowercase |
| `infraspecific_rank`, `infraspecific_epithet` | var. *grandiflora*; subsp. *...*; f. *...* | Rank enum: subsp., var., subvar., f. |
| `cultivar_group` | Group names where used | Optional |
| `cultivar_epithet` | 'Limelight' | Stored without quotes; rendered in single quotes; validated against an ICNCP-style pattern (no "var.", no Latin-form epithets after 1959 rules are enforced only as warnings) |
| `trade_names[]` | Little Lime® on `'Jane'`; Bobo® on `'ILVOBO'`; Endless Summer® on `macrophylla 'Bailmer'`; Knock Out® on `Rosa 'Radrazz'` | Each with mark type (®, ™, none), owner, locale, active dates |
| `breeder`, `introducer`, `introduction_year` | Optional | Used in descriptions and brand partnerships |
| `display_name_botanical` | *Hydrangea paniculata* 'Limelight' | Compiled; never typed by hand |

- Display modes per tenant setting: **botanical-first** ("*Hydrangea paniculata* 'Limelight', Limelight panicle hydrangea"), **common-first** ("Limelight hydrangea (*H. paniculata* 'Limelight')") or **trade-first** ("Endless Summer® hydrangea"). Proposals default to common-first; plant schedules default to botanical-first ([10](10-design-studio.md) DS-PLNT-08).

**KB-TAX-03 Accepted names, synonyms and the trade-name policy [MVP]**
- Every taxon record resolves to an accepted name in the backbone (WCVP via POWO) and stores the POWO/IPNI identifier, plus cross-references to World Flora Online, GBIF, USDA PLANTS symbol (for example `ACRU` for *Acer rubrum*) and ITIS TSN where they exist.
- Synonyms are stored with a type: homotypic, heterotypic, misapplied, orthographic variant, or **trade synonym** (a name the nursery trade uses that is not botanically valid).
- **Policy:** Rootline displays the *accepted* name, and keeps the familiar trade name visible in parentheses until a curator-set `trade_display_until` date (default: 5 years after the change). Example: "*Salvia yangii* (syn. *Perovskia atriplicifolia*), Russian sage". Search matches every synonym forever. Where the backbone itself is unsettled (for example Alaska cedar has moved among *Chamaecyparis*, *Xanthocyparis*, *Callitropsis* and *Cupressus*), a senior curator may pin the displayed name and record the rationale.
- Backbone refresh [V1]: a monthly job diffs our taxa against the latest backbone export and opens change requests for name changes, never applying them automatically.

**KB-TAX-04 Common names in several languages [MVP English and Spanish, V1 French-Canadian]**
- Each common name has `locale` (`en-US`, `en-CA`, `es-US`, `es-MX`, `fr-CA`), optional `region_id` scope (common names vary: "ironwood" means different trees in different places), `is_preferred` per locale and Region, and a source.
- Exactly one preferred name per locale (plus optional Region overrides). If no sourced name exists for a locale, the UI shows the botanical name plus the English common name. **Common names are never machine-translated** without a source; an AI-suggested Spanish name enters the queue as a suggestion like any other value.
- Crew-facing Spanish names [V1]: curators may add "field names" used by Spanish-speaking crews in a Region (sourced to the curator and two tenant confirmations), flagged `informal`.

**KB-TAX-05 Patents, breeders' rights and trademarks [MVP fields, V1 alerts]**
- Fields: US plant patent number (`PP` plus digits), filing date, grant date, computed expected expiry (US plant patents run 20 years from filing; label "estimated, verify"), Canadian Plant Breeders' Rights certificate and term, optional EU Community Plant Variety Rights, trademark text and owner.
- Behaviors: a "Propagation restricted" badge shows for patented or PBR-protected plants to Companies that enable in-house propagation in settings [V1]; proposals render ® and ™ correctly; the trade name is never used as the cultivar epithet in schedules.
- Rootline displays this information as a reference, not legal advice.

**KB-TAX-06 Identifiers [MVP]**
- Internal UUID, a human-readable code (`RL-P-004821`), a stable URL slug (`hydrangea-paniculata-limelight`), and a default schedule key suggestion (`HYD LIM`) that the Design Studio de-duplicates per design ([10](10-design-studio.md) DS-PLNT-08).
- Codes and slugs never change; merges create redirects (KB-CUR-08).

**KB-TAX-07 Plant kinds and categories [MVP]**
- `plant_kind` enum: tree, shrub, perennial, ornamental grass, sedge or rush, groundcover, vine or climber, annual, bulb (including corms and tubers), fern, succulent or cactus, palm or cycad, turfgrass, aquatic or marginal, moss. Edible (fruit tree, berry, herb, vegetable) is a tag, not a kind.
- Subtypes are traits (for example `leaf_persistence = evergreen` plus `foliage_type = needled` for conifers), so facets compose cleanly.

**KB-TAX-08 Record lifecycle [MVP]**
- Plant and Plant Region Profile records move `draft` -> `in_review` -> `approved` -> `published` -> `deprecated`, plus `rejected` and `merged` (the states in [19](19-platform-admin-portal.md) PA-070, with `merged` added for redirects).
- Deprecated plants stay resolvable for existing designs, estimates and warranties but are hidden from search by default, with a reason code: `superseded_by_accepted_name`, `not_in_trade`, `prohibited_in_all_operating_regions`, `data_quality`.

**KB-TAX-09 Turfgrass records [MVP basic]**
- Turfgrass species and major cultivar classes (tall fescue, Kentucky bluegrass, perennial ryegrass, fine fescues, bermudagrass, zoysiagrass, St. Augustinegrass, buffalograss) with turf traits: season type (cool or warm), recommended mowing height range, shade, wear, drought and salt tolerance, and an illustrative seeding-rate field (pounds per 1,000 sq ft, sourced per Region). Lawn programs in [14](14-service-line-modules.md) reference them for overseeding and renovation estimates.

### 4.2 Traits (KB-TRT)

**KB-TRT-01 Trait dictionary [MVP]**
- Traits are defined as data in a registry (`trait_definition`), not as hard-coded columns. Each definition has: key, labels per locale, data type (`enum`, `enum_set`, `num_range`, `number`, `bool`, `month_set`, `color_set`, `text`, `rich_text`, `ref`), unit dimension (length, temperature, depth, volume), allowed values with written definitions, group, **criticality** (`critical` or `standard`), `inheritable` (species to cultivar), `regionalizable` (may be overridden in a Plant Region Profile), `facetable`, `client_visible`, completeness weight and evidence rule.
- Adding a trait is a curator-admin change plus, if facetable, a facet-column migration run by `platform_engineer`. Removing a trait archives values; it never deletes them.

**KB-TRT-02 Value semantics [MVP]**
- Each trait value carries: the value, qualifiers (for example "in cultivated landscapes" vs "in the wild"; "once established" for drought tolerance), and provenance (source, citation with locator, method, confidence, author, reviewer, timestamps).
- Several **candidate** values may exist for one trait (sources disagree); exactly one is **selected** per scope (global or Region). The quality dashboard counts unresolved conflicts.
- Lengths are stored in centimeters and temperatures in Celsius, but the **original value and unit text are preserved** ("3-4 ft") so imperial users never see round-trip drift such as "2.95-3.94 ft". Display rounding: feet to the nearest 0.5 ft under 10 ft and to the nearest 1 ft above; centimeters to the nearest 5 cm under 2 m and to the nearest 0.1 m above.
- **Critical traits** (USDA and Canadian hardiness zones, invasive and noxious status, toxicity, deer-resistance claims, mature size) need at least one Tier 1 citation (4.6) and a second curator's approval before publishing, matching [19](19-platform-admin-portal.md) PA-070.

**Form and ornamental traits**

| Trait key | Type and values | Notes | Priority |
|---|---|---|---|
| `leaf_persistence` | evergreen, semi-evergreen, deciduous, herbaceous (dies back), marcescent | Drives winter rendering and symbols | [MVP] |
| `foliage_type` | broadleaf, needled, scale-like, grass-like, succulent, fern frond | | [MVP] |
| `mature_height`, `mature_spread` | `num_range` (cm) plus typical value | Landscape context by default; "in the wild" stored as a qualifier. Drives symbol size and spacing validation | [MVP] critical |
| `years_to_maturity` | number (years) | Feeds the Design Studio growth slider | [V1] |
| `growth_rate` | slow, moderate, fast | Rootline rubric: trees slow under 30 cm per year, moderate 30-60, fast over 60; shrubs and perennials judged relative to mature size | [MVP] |
| `form` | round, oval, vase, columnar, pyramidal, weeping, spreading, mounding, upright, clumping, fountain, prostrate, climbing, irregular | Same vocabulary as procedural symbols in [10](10-design-studio.md) DS-SYMB-02 | [MVP] |
| `foliage_texture` | fine, medium, coarse | | [MVP] |
| `foliage_color_by_season` | `color_set` for spring, summer, fall, winter (named color plus hex) | Hex used by symbols and 3D archetypes | [MVP] |
| `variegation` | none, margin, center, splash, streak | | [V1] |
| `fall_color_showiness` | 0-3 | 3 = signature fall plant (for example *Nyssa sylvatica*) | [MVP] |
| `bloom_months` | `month_set` with reference Region | Region profiles may shift it (KB-PRP-04) | [MVP] |
| `bloom_colors` | `color_set` | | [MVP] |
| `bloom_showiness` | 0-3 | | [V1] |
| `blooms_on` | old wood, new wood, both, not applicable | Pruning-critical: *Hydrangea macrophylla* (old wood, except reblooming lines) vs *H. paniculata* (new wood) | [MVP] |
| `fruit` | type, months, colors, showiness 0-3, litter 0-3, edible (with caveats) | Litter matters near patios and pools | [V1] |
| `pollinizer_required` | bool plus compatible pollinizers | Dioecious plants, for example winterberry holly (*Ilex verticillata*) needs a compatible male nearby to fruit | [V1] |
| `fragrance` | flowers or foliage, intensity 0-3 | | [V1] |
| `winter_interest` | bark, form, fruit, evergreen foliage (set) | | [V1] |
| `thorns_spines` | none, minor, significant | Play areas, walkways | [MVP] |
| `spread_habit` | clumping, slow-spreading, aggressive (rhizomes, stolons, self-seeding) | Running bamboo, some mints and grasses | [V1] |
| `lifespan` | short-lived (under 3 years), moderate, long-lived | Short-lived perennials hurt warranty margins | [V1] |

**Requirements**

| Trait key | Type and values | Notes | Priority |
|---|---|---|---|
| `usda_zone_min`, `usda_zone_max` | half-zone ordinal (1a=1 through 13b=26) | USDA map is based on average annual extreme minimum temperature in 10°F zones and 5°F half zones (2023 edition uses 1991-2020 data; verify) | [MVP] critical |
| `canada_zone_min`, `canada_zone_max` | Canadian zone ordinal (0a through 9b) | Canada's Natural Resources Canada zones use several climate variables, not only extreme minimum temperature, so they are **not** interchangeable with USDA zones (verify current methodology). Stored separately; never converted | [MVP] critical |
| `ahs_heat_zone_min`, `ahs_heat_zone_max` | 1-12 | American Horticultural Society heat zones are based on average days per year above 86°F (30°C); map and data licensing to verify | [V1] |
| `chill_hours` | number range | Fruit trees and some bulbs | [V2] |
| `sun` | set of: full sun (6+ hours direct), part sun (4-6 hours), part shade (2-4 hours or dappled), full shade (under 2 hours) | Maps to the Design Studio sun classes ([10](10-design-studio.md) DS-SUN-02). Region profiles can add "needs afternoon shade here" | [MVP] |
| `water_need` | very low, low, moderate, high | Generic, all Regions | [MVP] |
| `wucols` | per California WUCOLS region 1-6: VL, L, M, H, not appropriate, unknown | WUCOLS classes are percentages of reference evapotranspiration (VL under 10%, L 10-30%, M 40-60%, H 70-90%; verify). Used for California water-budget compliance (plant factor) and hydrozoning ([14](14-service-line-modules.md)) | [MVP] schema, data per license |
| `plant_factor` | 0.0-1.0 | Derived from WUCOLS where available, otherwise curator-set by Region for water budgets | [V1] |
| `soil_texture` | set of: sand, loam, silt, clay, rocky or gravelly, organic | "Tolerates clay" is the most-used filter in glaciated Midwest soils | [MVP] |
| `soil_ph_min`, `soil_ph_max` | number range | Plus `acid_loving` derived flag (max pH under 6.5) | [MVP] |
| `drainage` | set of: requires sharp drainage, well-drained, moist, tolerates periodic flooding, tolerates standing water | Rain-garden zoning uses this | [MVP] |
| `drought_tolerance` | none, low, moderate, high (once established) | | [MVP] |
| `wet_tolerance` | none, low, moderate, high | | [MVP] |
| `salt_tolerance_soil`, `salt_tolerance_spray` | none, low, moderate, high | Road-salt zones: hell strips, parking islands, driveway edges in snow Regions | [MVP] |
| `urban_tolerance` | set of: compaction, pollution, reflected heat, restricted root zone | Street trees, parking lots | [V1] |
| `wind_tolerance` | low, moderate, high | Coastal and Front Range sites | [V1] |
| `juglone_tolerance` | sensitive, tolerant, unknown | Sites under black walnut | [V1] |
| `erosion_control` | bool plus slope rating | | [V1] |

**Characteristics**

| Trait key | Type and values | Notes | Priority |
|---|---|---|---|
| `deer_resistance` | A rarely damaged, B seldom severely damaged, C occasionally severely damaged, D frequently severely damaged | The A-D scale popularized by Rutgers NJAES lists; also used by [10](10-design-studio.md) VAL-DEER-01. Regionalizable because deer browse varies with pressure and season | [MVP] critical |
| `rabbit_resistance` | high, moderate, low | | [MVP] |
| `pollinator_value` | 0-3 per guild: native bees, honey bees, butterflies, moths, hummingbirds | | [MVP] |
| `larval_host` | bool plus notable species (for example monarch on *Asclepias*) | | [V1] |
| `keystone_plant` | bool per ecoregion | From keystone-plant lists by ecoregion (National Wildlife Federation and Tallamy research; licensing to verify) | [V1] |
| `wildlife_value` | set of: bird food (fruit or seed), nesting cover, winter cover | | [V1] |
| `native_status` | computed per jurisdiction and ecoregion: native, introduced, native cultivar ("nativar"), unknown | See KB-RGN-07. Never a single global boolean | [MVP] |
| `regulatory_status` | computed per jurisdiction from listings: prohibited, restricted, regulated, watch list, advisory (invasive council), none | See KB-RGN-08. Cultivar exemptions supported | [MVP] critical |
| `toxicity` | per receptor (dogs, cats, horses, livestock, humans): none known, mild, moderate, severe; toxic parts; principle | Sources such as the ASPCA toxic and non-toxic plant lists and extension toxicity data (verify terms). Disclaimer and poison-control contacts shown | [MVP] critical |
| `skin_irritant` | none, mild, severe | Sap of some *Euphorbia*; *Toxicodendron* | [V1] |
| `pollen_allergenicity` | low, moderate, high | Proprietary scales (for example OPALS) only under license | [V1] |
| `fire_behavior` | regional rating per sourced list: fire-resistant, moderate, high flammability; attributes (volatile oils, retains dead material, fine fuels) | No plant is fireproof; ratings must cite a regional source | [V1] |
| `maintenance_level` | low, moderate, high | Rubric: low = 0-2 interventions per year; moderate = 3-5; high = 6 or more or specialist work | [MVP] |
| `care_tasks` | list of task templates (KB-TRT-04) | | [MVP] basic, [V1] regional |
| `pest_disease_links` | list of `pest_disease` with susceptibility: resistant, tolerant, susceptible, highly susceptible | Boxwood blight, emerald ash borer, rose rosette, Japanese beetle, oak wilt | [V1] |
| `infrastructure_risk` | root aggressiveness near pipes and pavement, recommended setback from foundations and hardscape | Willows and silver maple near sewer laterals | [V1] |
| `rain_garden_zone` | set of: bottom (wet), slope, rim (dry) | Palette resolution for rain gardens | [V1] |
| `edible` | bool plus parts and caveats | Edible landscapes | [V1] |
| `green_roof_suitability` | bool plus minimum media depth | | [V2] |

**Commercial traits**

| Trait key | Type and values | Notes | Priority |
|---|---|---|---|
| `size_specs` | list of standard sizes the plant is commonly sold in | Container classes (#1, #2, #3, #5, #7, #10, #15, #25 and larger), quarts, 4.5 in pots, plugs (for example 72-cell), flats, bare root, B&B by caliper (1.5-4 in) for shade trees, by height (4-5 ft, 5-6 ft) for evergreens and multi-stems. Conventions follow ANSI Z60.1 (US) and the Canadian Standards for Nursery Stock (verify current editions), matching [13](13-operations-inventory-equipment.md) | [MVP] |
| `cost_band` | per size, per macro-region: low, median, high wholesale cost with as-of date and sample size | Computed from opted-in nursery list prices (4.11). Always labeled "estimate" | [V1] |
| `availability_index` | 0-100 per Region | Share of reporting vendors in the Region listing it in the last 30 days (4.11) | [V1] |
| `seasonality` | bare-root window, B&B dig seasons | | [V1] |
| `brand_program` | brand name (for example a branded shrub program) | Brand content only under partnership license (4.6) | [V1] |
| `gtin` | list of GTIN/UPC codes from brand tags | Tag scanning in the crew app | [V2] |

**KB-TRT-03 Derived traits [MVP]**
- Computed at release time, never edited: `deer_resistant` (A or B), `pet_safe` (dogs and cats: none known), `drought_tolerant` (moderate or high), `four_season_interest` (bloom, fall color and winter interest present), `size_class` (XS under 1 ft, S 1-3 ft, M 3-6 ft, L 6-15 ft, XL 15-30 ft, XXL over 30 ft by mature height).
- Derived traits are facetable and appear in natural-language search parses.

**KB-TRT-04 Care and installation specifications [MVP basic, V1 regional]**
- **Task templates:** prune, shear, cut back, deadhead, divide, fertilize, mulch refresh, winter protection, dormant oil, rake fruit, monitor for pest X. Timing is expressed **phenologically** ("late winter before bud break", "immediately after bloom") and mapped to reference months per Region (for example "late winter" = mid-February to mid-March in Central Ohio; illustrative). Example: "Prune Limelight hydrangea in late winter; it blooms on new wood."
- **Install specs:** default on-center spacing (feeds Design Studio fill-bed DS-PLNT-04), planting depth notes (root flare at grade for trees), staking guidance, establishment watering template (for example "2-3 times per week for the first 4 weeks, then weekly through the first season", illustrative and regionalizable).
- Consumers: client care guides ([06](06-customer-portal.md) 4.12.1), maintenance task generation and PHC programs ([14](14-service-line-modules.md)), crew install sheets ([05](05-field-crew-mobile-app.md)), holding-yard watering ([13](13-operations-inventory-equipment.md) 4.7).

**KB-TRT-05 Pests and diseases sub-KB [V1]**
- `pest_disease` entity: name (common and scientific), type (insect, mite, fungal, bacterial, viral, nematode, abiotic disorder), host plants with susceptibility, signs and symptoms, seasonal activity windows by Region, regional pressure (none, low, moderate, high) and quarantine status (for example emerald ash borer quarantines historically; verify current federal status).
- Used by plant ID ("likely boxwood blight"), PHC program design and tree inventory ([14](14-service-line-modules.md)), and substitutions ("blight-resistant boxwood alternative").
- The KB names pests and susceptibility; it never prescribes pesticide products or rates.

### 4.3 Region model and geospatial lookup (KB-RGN)

A Region answers "where is this property, horticulturally?" Rootline combines public climate, ecological and administrative layers with **operator-drawn curated Regions** that reflect how plants actually perform.

**KB-RGN-01 Region layers [MVP unless noted]**

| Layer | Coverage | Source (license class, verify) | Used for | Priority |
|---|---|---|---|---|
| USDA Plant Hardiness Zones (2023 edition) | US incl. Alaska, Hawaii, Puerto Rico | USDA ARS with Oregon State PRISM; US government work, generally public domain | Hardiness validation, facets | [MVP] |
| Canadian Plant Hardiness Zones and extreme-minimum-temperature zones | Canada | Natural Resources Canada; Open Government Licence - Canada | Hardiness validation in Canada | [MVP] |
| AHS Plant Heat Zones | US | American Horticultural Society; license required | Heat validation | [V1] |
| EPA ecoregions Level III and IV | Conterminous US (about 105 Level III and nearly 1,000 Level IV units) | US EPA; public domain | Native status, palettes, Region recipes | [MVP] |
| CEC North American ecoregions Level I-III | US, Canada, Mexico | Commission for Environmental Cooperation | Cross-border consistency, Canadian Regions | [MVP] |
| Ecological Framework of Canada (ecozones to ecodistricts) | Canada | Government of Canada | Finer Canadian Regions | [V1] |
| States, counties, metros (CBSAs) | US | US Census TIGER/Line; public domain | Jurisdictions, legal status, benchmarking | [MVP] |
| Provinces, census divisions, CMAs | Canada | Statistics Canada Open Licence | Jurisdictions, legal status | [MVP] |
| WUCOLS regions 1-6 | California | Curator-drawn approximation of the published WUCOLS region descriptions | WUCOLS lookup | [MVP] for California tenants |
| Frost dates and climate normals | US, Canada | NOAA 1991-2020 normals; Environment and Climate Change Canada normals | Care calendars, bloom shifts, season defaults | [V1] |
| Soils | US (SSURGO), Canada (Soil Landscapes of Canada, coarser) | USDA NRCS; Agriculture and Agri-Food Canada | Property soil texture, drainage and pH hints (not Regions) | [V1] |
| Wildfire risk | US | USDA Forest Service Wildfire Risk to Communities | Fire-wise defaults | [V2] |
| Elevation | US | USGS 3DEP (already used by [10](10-design-studio.md)) | Elevation bands in mountain Regions | [V1] |
| Custom polygons | Anywhere | Drawn by curators | Curated Region edges | [MVP] |

**KB-RGN-02 Region kinds and hierarchy [MVP]**
- Region `kind`: `admin` (country, state or province, county, metro), `climate` (USDA zone, Canadian zone, heat zone, WUCOLS region), `eco` (EPA Level III and IV, CEC, Canadian ecozones) and `curated`.
- **Curated hierarchy:** country -> macro-region (for example "Great Lakes and Ohio Valley") -> Region (for example "Central Ohio") -> optional microregion (for example "Lake Erie Shore"). The macro-regions are the same ones [18](18-reporting-analytics.md) uses for benchmarking.
- Each curated Region has: name, slug, description, `geom` (MultiPolygon, SRID 4326), definition recipe (KB-RGN-03), parent, coverage tier (KB-RGN-09), lead curator, launch status, climate summary (computed zone mix, heat zone mix, precipitation, frost-free days), reference bloom calendar offset, and priority (tie-breaker).
- Topology rules: curated Regions at the same level may not overlap (checked on publish); a microregion must lie inside its parent within a 50 m tolerance. Until national coverage exists, points outside any curated Region fall back to the macro-region if one contains them, else to `uncurated` with Basic coverage.

**KB-RGN-03 Region definition recipes [MVP]**
- A curated Region is defined as an expression over layers plus manual edits, for example: `(epa_l3 = 55 OR epa_l4 IN [selected units]) AND state = OH AND usda_zone BETWEEN 5b AND 6b`, plus or minus drawn polygons. The recipe is stored, so a Region can be rebuilt when a layer is updated (for example a new hardiness map).
- Geometry is simplified for display (tolerance about 20 m) but lookups use the full-resolution geometry.
- The Region builder map, preview statistics (area, tenants, Properties, plants with profiles, overlaps) and versioned republishing are console features specified in [19](19-platform-admin-portal.md) PA-071.

**KB-RGN-04 Site Context lookup: address to Region [MVP]**
- Input: a geocoded Property point from CRM ([03](03-crm-sales-estimating-proposals.md)), optionally the parcel polygon and building footprint ([10](10-design-studio.md)).
- Algorithm: point-in-polygon against every layer (PostGIS GiST indexes). The primary point is the building-footprint centroid if known, else the parcel centroid, else the geocode. For parcels over 5 acres or multi-building campuses, the service also computes area shares per layer value and sets `spans_multiple = true` when a second value covers more than 15% of the parcel (configurable), so a large HOA common area that straddles 6a and 6b is visible to the designer.
- Leaf curated Region = smallest-area curated Region containing the point; ties are broken by `priority`.
- Results are stored as `property_site_context` (tenant-scoped) with the KB region release id; recomputed on Region republish, map edition change or address change; emits `kb.property_region_changed`.
- Performance target: p95 under 50 ms for a single lookup; batch recompute of 100,000 Properties under 10 minutes.
- Overrides: a Property-level microclimate override (frost pocket, urban heat island, coastal exposure, high elevation) and bed-level overrides in the Design Studio (for example a protected south wall treated half a zone warmer, [10](10-design-studio.md) VAL-ZONE-01). Overrides require a reason and appear in validation messages.
- Edge cases: geocode failure asks the user to drop a pin; points in water (lakefront geocodes) snap to the nearest land polygon within 200 m; points on a boundary use the containing polygon or, if none, the nearest within 100 m and set `boundary_snapped`; PO-box or centroid-of-ZIP geocodes are rejected for Site Context ("needs a street address or a pin").

Example Site Context (illustrative values for a Cedar & Stone client in Upper Arlington, Ohio; verify real values):

```json
{
  "property_id": "prop_7f3c",
  "kb_region_release": "2027.04.12-1",
  "point": { "lat": 40.0256, "lng": -83.0627, "source": "building_centroid" },
  "usda_zone": { "zone": "6b", "edition": "usda_2023", "extreme_min_f": -2.4 },
  "heat_zone": { "zone": 5, "licensed": true },
  "ecoregion": { "epa_l3": "55 Eastern Corn Belt Plains", "epa_l4": "55b" },
  "admin": { "country": "US", "state": "OH", "county": "Franklin", "metro": "Columbus, OH" },
  "curated_region": { "id": "rgn_central_ohio", "name": "Central Ohio", "macro": "Great Lakes and Ohio Valley", "coverage_tier": "excellent" },
  "frost": { "last_spring_median": "04-20", "first_fall_median": "10-21" },
  "soil_hint": { "texture": "silty clay loam", "drainage_class": "somewhat poorly drained", "source": "ssurgo" },
  "flags": { "spans_multiple": false, "boundary_snapped": false },
  "overrides": []
}
```

**KB-RGN-05 Hardiness map editions and transitions [MVP]**
- Every zone value records its map edition (`usda_2012`, `usda_2023`, NRCan edition). The 2023 USDA map moved many locations about half a zone warmer than 2012 (verify the share).
- Adopting a new edition: recompute all Site Contexts, publish a diff report ("1,240 Properties moved from 6a to 6b"), notify affected tenants, re-run validations on **draft** designs only. Sold designs and their warranties are never rewritten.
- Plant zone ranges are not automatically shifted by a map change; curators review plants whose ratings were borderline at the old zone.

**KB-RGN-06 Region climate summaries [V1]**
- Computed per curated Region: frost-free days, median and 90%-probability last spring and first fall frost dates, annual precipitation, July mean maximum, dominant soil textures (aggregated SSURGO), elevation band.
- Used for care-calendar month mapping (KB-TRT-04), default bloom shift (KB-PRP-04), season defaults in scheduling ([04](04-scheduling-dispatch-routing.md)) and Region descriptions.

**KB-RGN-07 Native range model [MVP]**
- Native status is **computed** from `plant_native_range` rows: plant, geography unit (state or province, county where licensed data exists, ecoregion), status (native, introduced, both, absent, unknown) and source.
- Sources: USDA PLANTS state-level native status for the US and Canada (public domain), VASCAN for Canadian provinces (license to verify), curator ecoregion assignments; county-level distribution datasets such as BONAP only under license.
- Display levels, most specific first: "Native to this ecoregion (Eastern Corn Belt Plains)", "Native to Ohio", "Native to North America", "Not native". Cultivars of native species are labeled **nativar** with a short explanation. Tenant setting: whether nativars count toward native-share scorecards (default: counted separately).
- A hybrid with any non-native parent is "not native".

**KB-RGN-08 Regulatory listings: invasive and noxious status [MVP]**
- `jurisdiction` (country, state or province, county or municipality) and `regulatory_listing` rows: taxon scope (applies to all infraspecific taxa and cultivars unless exempted), list name, legal category, effective date, phase-out schedule (for example "sale prohibited after date X"), exemptions (cultivar list or criteria such as "seed-sterile cultivars approved by the state"), citation (statute, regulation or official list), `last_verified_at`.
- Legal effect mapping:

| Listing category | Examples (verify each) | Rootline behavior |
|---|---|---|
| `prohibited` (sale or planting banned) | Ohio's prohibited invasive plant rule added Callery pear (*Pyrus calleryana*, including 'Bradford') with sales banned from 2023; Massachusetts Prohibited Plant List includes Japanese barberry and burning bush | Hidden from picker for Properties in the jurisdiction; validation **error**; cannot be added to proposals or Company palettes for that jurisdiction; only `platform_owner` can grant an exception (for example removal projects) |
| `restricted` or `regulated` | Some states regulate species with permit or cultivar exemptions (for example Oregon's noxious weed rules have allowed approved seed-sterile *Buddleja* cultivars) | Validation error with required override reason, unless the cultivar is exempt |
| `watch` or `advisory` (non-legal invasive council lists) | State invasive plant council lists | Warning with explanation and alternatives |
| `none` | | No message |

- Matching: a species listing applies to every cultivar and infraspecific taxon unless an exemption names it; a genus-level listing applies to all species (rare).
- Monitoring [V1]: each list has a watcher (weekly content-hash check of the official page or document where stable, plus a quarterly human re-verification task). A detected change opens a high-priority change request.
- **Hotfix releases:** regulatory changes ship outside the daily cadence if needed.
- **Tenant alerts:** when a listing changes, Companies with drafts, open proposals, Company palettes, Price Book items or recurring maintenance programs that include the plant in that jurisdiction receive an alert with suggested substitutes (KB-SRCH-07).

**KB-RGN-09 Coverage tiers [MVP]**

| Tier | Criteria | What tenants see | What AI may do |
|---|---|---|---|
| **Excellent** | 600 or more plants with published Region profiles; palettes for at least 7 core uses; named lead curator; profiles reviewed within 24 months; 95% or more palette plants with licensed photos | Green badge "Curated for Central Ohio by our horticulture team" | Auto-layout and mockups use plants rated 3 or above only |
| **Good** | Validated taxonomy and traits; profiles (own or inherited from macro-region) for 200 or more common plants; palettes for at least 3 uses | Blue badge "Regionally reviewed" | Same rule; falls back to macro-region palettes |
| **Basic** | Zone, sun, water and legal validations only; no ratings | Grey badge "Not yet curated for your area: zone-checked only" | AI layouts allowed only with tenant opt-in, using zone-fit plants with an "unrated" disclosure on every output |

The badge implements the "visible coverage badge, so we never over-promise" commitment in [22](22-business-model-pricing-gtm.md).

### 4.4 Plant Region Profiles (KB-PRP)

A Plant Region Profile records how well a plant actually does in a Region. It is where the operator's horticultural judgment lives.

**KB-PRP-01 Rating scale [MVP]**

| Rating | Label | Meaning | Evidence rule | Downstream effect |
|---|---|---|---|---|
| 5 | Top performer | Does great here; specify freely | 2 or more evidence items, at least 1 local (regional trial, curator observation, regional extension list) | Boosted in ranking; preferred by AI |
| 4 | Reliable | Does well with normal care | 1 or more evidence items | Normal |
| 3 | Acceptable with conditions | Works if the listed conditions are met | Conditions required | AI allowed (conditions are checked against bed context) |
| 2 | Marginal | Often struggles; specify with care and client disclosure | Reason code required | Design warning ([10](10-design-studio.md) VAL-RGN-01); excluded from AI |
| 1 | Not recommended | Poor results here | Reason code required | Design warning; hidden from default search |
| flag `do_not_use` | Fails or must not be planted | Illegal, consistently fails, or ecological harm | Senior curator approval | Design **error**; hidden; blocked for AI |
| `not_rated` / `insufficient_evidence` | Unknown | No profile or too little evidence | | Shown with "not yet rated here"; zone-fit only |

Reason codes: `cold_damage`, `heat_stress`, `humidity_disease`, `soil_ph`, `poor_drainage`, `drought`, `deer_browse`, `pest_pressure`, `short_lived`, `invasive_tendency`, `legal`.

**KB-PRP-02 Profile fields [MVP]**
- Rating, `do_not_use` flag, reason codes.
- **Conditions** (structured, machine-checkable where possible): `needs_afternoon_shade`, `needs_amended_soil`, `needs_protected_site`, `needs_supplemental_water`, `avoid_wet_sites`, `avoid_road_salt`, `deer_protection_needed`, plus free text.
- **Notes:** client-safe note (shown on plant cards and proposals, for example "Reliable bloomer in Central Ohio; tolerates our clay if not waterlogged") and internal curator note.
- **Local cultivar picks:** recommended cultivars with reasons ("Prefer 'Shamrock' inkberry for a compact, fuller base") and cultivars to avoid ("Avoid species *Buxus sempervirens* in shaded, humid sites: boxwood blight pressure").
- **Trait overrides** for regionalizable traits: mature size ("15-20 ft here vs 30 ft nationally"), bloom months, deer rating, water need, fire behavior.
- Regional pest and disease pressure (links to KB-TRT-05).
- Native status (computed with optional curator note) and legal status (computed, read-only).
- Availability index (computed, 4.11).
- Evidence list, confidence (high, medium, low), curator, reviewer, `last_reviewed_at`, `next_review_due`, status.

**KB-PRP-03 Inheritance and effective profiles [MVP]**
- Profiles may be authored at macro-region, Region or microregion level and at species or cultivar level. The **effective profile** for (plant, Region) is computed field by field: most specific geography first, then cultivar before species.
- **Legal status always wins:** a plant prohibited in Ohio is `do_not_use` in Central Ohio even if the macro-region profile rates it 4.
- The UI shows where each value came from ("inherited from Great Lakes and Ohio Valley, reviewed by M. Ortiz, Mar 2027").

```mermaid
flowchart TD
    A["Global plant record, release R"] --> B["Macro-region profile"]
    B --> C["Region profile"]
    C --> D["Microregion profile"]
    D --> E["Regulatory overlay for the Property's jurisdictions"]
    E --> F["Tenant overlay: Company notes, rating, hidden, price"]
    F --> G["Property and bed context: zone override, sun class, soil, deer, pets"]
    G --> H["Effective plant view and validations"]
```

**KB-PRP-04 Bloom timing shift [V1]**
- Bloom months can be shifted per Region by a number of weeks relative to the reference Region, or set explicitly.
- Default shift is computed from the difference in median last-frost dates between Regions (a heuristic labeled "estimated") and corrected by curators and, later, by dated crew and client photos (section 13).

**KB-PRP-05 Evidence model [MVP]**
- Evidence item types: `regional_trial` (for example published trial-garden evaluations such as Mt. Cuba Center or Chicago Botanic Garden plant evaluations; verify availability per plant), `extension_list`, `curator_observation` (date, place, photos), `rating_session`, `warranty_aggregate` (k of 10 or more Companies), `literature`, `nursery_grower_report`.
- Each item: citation, date, weight, and whether it supports or contradicts the rating. The profile editor shows evidence for and against.

**KB-PRP-06 Review cadence and staleness [MVP]**
- `next_review_due` = last review + 24 months (the staleness rule in [19](19-platform-admin-portal.md) PA-074).
- Early re-review triggers: warranty replacement rate for the plant in the Region more than 2 standard deviations above the plant-group mean (k of 10 or more Companies); 3 or more tenant failure reports in 90 days; a new pest or quarantine affecting the plant; a regulatory change; a source update on a critical trait.

**KB-PRP-07 Company experience ratings [V1]**
- Each Company can privately rate plants ("our experience: 2/5, losses in wet clay") and set a Company warranty policy per plant (for example "no warranty on *Buxus* in shade").
- Aggregates across Companies (k of 10 or more) appear as a signal in the curator's profile editor, never as an automatic rating change.

### 4.5 Curation workflow at scale (KB-CUR)

Thousands of plants times dozens of Regions times 80-plus traits is millions of facts. The curation system turns that into a queue that a small team can clear.

**KB-CUR-01 Change requests are the unit of work [MVP]**
- Every modification (curator edit, import row, AI suggestion, tenant suggestion, feed-derived update, merge, bulk edit) is a `change_request` with one or more field-level `change_item`s: target record, field, old value, new value, provenance.
- States: `draft` -> `in_review` -> `approved` -> `published` (in a release), or `rejected` or `withdrawn`. Critical items require a second reviewer who is not the author (state diagram in 5.3).
- Change requests are batched by origin (an import, an enrichment run, a rating session) so reviewers can work through them in context.

**KB-CUR-02 Bulk CSV and Google Sheets import with validation and diff preview [MVP]**
- **Import profiles:** saved column mappings per source format (for example "Extension landscape plant list", "Curator rating sheet", "Brand catalog export"). Headers are auto-mapped by name and by an AI mapping suggestion that the curator confirms.
- **Normalization:** units ("3-4'" becomes 91-122 cm with original text kept), enum synonyms ("Full Sun", "FS", "sun" become `full sun`), zone strings ("5-9" becomes 5a-9b; "Zone 4 to 8" likewise), month ranges ("Jun-Aug").
- **Name resolution** per row: `matched`, `new_cultivar_of_existing_taxon`, `new_taxon`, `ambiguous` (several candidates shown), `unresolved`. Resolution uses exact, synonym, fuzzy (trigram) and AI-assisted matching against the backbone.
- **Validation:** types and enums; ranges (height min not greater than max, zone min not greater than max, pH between 3.5 and 9.0); sanity checks (a shrub over 15 m, a perennial with zone min warmer than zone max); license present for every source.
- **Diff preview:** per row and per field, classify as new, changed, unchanged, conflicts with selected value, or **would overwrite a curator-verified value** (never applied automatically). Summary counts at the top; downloadable dry-run CSV with row-level errors.
- **Apply policy** per column: fill empty values only; propose as candidates; overwrite unverified values. The result is a batch of change requests, each value tagged with `source_id` and `license_id` (PA-072).
- Limits: 50,000 rows per import; preview paginated at 200 rows; imports are resumable.
- **Google Sheets:** connect a sheet with a read-only OAuth scope; "pull again" re-runs the diff (used by rating sessions); [V1] write validation results back to a new tab.

**KB-CUR-03 AI-assisted enrichment [MVP seed pipeline, V1 continuous agents]**
- **Target:** a set of plants and a trait group (for example "requirements for 400 xeric perennials for the Front Range") or Region profile drafts.
- **Retrieval:** only from sources in the registry (4.6) whose `allowed_uses` include `fact_extraction`, using licensed APIs, licensed dumps or permitted documents; robots rules and terms of use are respected; no tenant data is ever included.
- **Extraction:** a frontier LLM (Claude family through the AI Gateway, task `kb.enrich`) with a strict output schema per trait: value, unit, verbatim supporting snippet (300 characters or less), locator (URL plus section or page), retrieval date. "Unknown" is an allowed and preferred answer over a guess.
- **Normalization** uses the same normalizers as imports; **cross-checking** compares independent sources and flags conflicts.
- **Confidence score (0-1):** a calibrated function of source tier (Tier 1 base 0.9, Tier 2 0.75, Tier 3 0.5), number of agreeing independent sources, extraction self-consistency (three runs agree), recency and a trait-specific prior. Calibrated monthly on curator decisions (isotonic regression) so that 0.9 means about 90% of such suggestions are accepted without edits.
- **Output:** change requests authored by `ai:kb.enrich@<prompt_version>`, landing in the queue (console PA-073).
- **Bulk accept:** allowed only for non-critical traits with confidence above 0.9 and at least two agreeing sources (PA-073). Critical traits are never bulk-accepted.
- **Descriptions:** the AI drafts original 60-120 word descriptions in English and Spanish ([V1] French-Canadian) from *selected trait values*, not from source prose. A copy check rejects drafts with more than 5% 8-gram overlap with any retrieved source text.
- **MVP vs V1:** at MVP the pipeline is run in batches by `platform_engineer` for the seed set (4.13) and reviewed in the same queue; at V1 it becomes self-serve for curators and runs continuously (the KB Curation agent A26 in [17](17-ai-copilot-automation.md)).
- **Evaluation:** a golden set of 300 curator-verified plants; metrics per prompt version: acceptance rate, edit rate, error rate on critical traits (target under 1% before any rejection by the second reviewer), hallucinated-citation rate (target 0; every locator is fetched and the snippet string-matched).

**KB-CUR-04 Curator review queue [MVP]**
- **Priority score** = impact (count of tenant uses of the plant in the last 90 days, weighted 2x in beachhead Regions) x severity (legal 5, critical trait 3, conflict 2, standard 1) x age factor.
- Filters: Region, plant group, trait, source, author type (AI, import, tenant, curator), confidence band.
- Keyboard-first: `A` accept, `E` edit and accept, `R` reject with reason (reasons feed prompt evaluation), `S` request second opinion, `J`/`K` next and previous, `Shift+A` bulk accept eligible items.
- Side-by-side: current value, proposed value, source snippets with links, other sources' values, usage count.
- Service levels: legal and takedown items 24 hours; tenant failure reports 5 business days; AI suggestions expire after 60 days unreviewed (and are re-generated if still relevant).
- Assignment by Region and plant group (PA-070); workload balancing across curators.

**KB-CUR-05 Field-level provenance [MVP]**
- Every value stores `source_id`, `license_id`, citation locator, method (`imported`, `ai_extracted`, `curator_entered`, `computed`, `tenant_aggregate`, `rating_session`), confidence, author, reviewer, created, approved and published release.
- An info popover on every field shows this history. Client-visible claims (native status, deer resistance, toxicity) show a short public citation on plant cards ("Source: USDA PLANTS; ASPCA").

**KB-CUR-06 Versioning, releases and changelog [MVP]**
- `kb_release` is cut daily at MVP (PA-070), identified like `2027.04.12-1`. A release contains the approved change requests since the last release and produces immutable plant and profile **version snapshots**.
- Consumers pin a release: sold Design Versions and accepted Proposals keep the plant data they were sold with ([10](10-design-studio.md)).
- Tenant changelog digest: "12 plants updated in your Regions this week, 1 regulatory change (Callery pear), 4 new photos."
- **Rollback:** repoint `current_release` to the previous release within minutes. **Hotfix releases** for legal changes and image takedowns.
- Diff view between any two versions of a plant or profile.

**KB-CUR-07 Duplicate detection [MVP]**
- Candidate pairs from: normalized name keys (genus, epithet and cultivar with quotes, case, diacritics and rank abbreviations normalized), trade-name collisions, identical backbone IDs, embedding similarity of name plus traits above 0.92, and perceptual-hash photo overlap.
- Presented in a duplicate queue with side-by-side records and usage counts.

**KB-CUR-08 Merge and synonym resolution against POWO and WFO [MVP]**
- The curator chooses the surviving record and picks values field by field. The losing record becomes `merged` with `merged_into_id`; its names become synonyms of the survivor.
- All references (designs, Price Book items, palettes, tenant overlays, nursery mappings, warranties) resolve through the redirect at read time. A background job rewrites **mutable** references (draft designs, Price Book links, palettes) and leaves sold and snapshotted records untouched, matching [10](10-design-studio.md).
- Merges can be undone for 30 days.
- Name changes from the backbone (KB-TAX-03) use the same flow: the old accepted name becomes a synonym; the record identity does not change.

**KB-CUR-09 Quality dashboard [MVP]**
- **Completeness score per plant (0-100):** critical traits 40%, core requirements 20%, ornamental traits 15%, media 15%, names and translations 10%. Tiers: **Gold** 90 or more, **Silver** 75-89, **Bronze** 50-74, **Stub** under 50.
- Visibility rules: tenant search shows Bronze and above by default (Stubs behind a "show incomplete" toggle); AI layouts and mockups use Silver and above; public SEO pages require Gold (4.12).
- Dashboard tiles: completeness by Region and plant group; conflicts; stale profiles; missing photos per season; license expiries in the next 60 days; invasive-status coverage by jurisdiction; tenant failure reports; search misses (queries with zero or abandoned results). Console layout in [19](19-platform-admin-portal.md) PA-074.

**KB-CUR-10 Bulk edits [MVP]**
- Query-based edits (for example `genus = Hosta` -> `rabbit_resistance = low`) with preview of affected records, required reason and citation. Edits apply to the species record by default; "also apply to cultivars that override this trait" is an explicit checkbox.
- Produces one batch change request; critical traits still require a second reviewer.

**KB-CUR-11 Regional rating sessions [MVP basic, V1 full]**
- A session = Region + plant list (a palette or a query, for example "all shrubs used by 3 or more Companies in Central Ohio") + raters (curators and invited guests such as extension educators or veteran contractors) + mode.
- **Blind then reconcile:** raters score independently (rating 1-5, `do_not_use`, conditions, note, confidence) in a keyboard-driven grid or a Google Sheet; the facilitator sees the spread; items with a spread of 2 or more go to discussion; the facilitator publishes the median (or the discussed value) as profile change requests with evidence type `rating_session` naming the raters.
- [V1] tablet mode for on-site sessions at trial gardens or nurseries, working offline.
- Guest raters sign a contributor agreement (license to Rootline) and a conflict-of-interest disclosure. Throughput planning assumption: 60-100 plants per hour for experienced raters (estimate to validate in the first session).

**KB-CUR-12 Tenant suggestions and failure reports [MVP suggestions, V1 failure reports]**
- "Suggest a correction" on any field (optional citation and photo) creates a change request authored by the tenant.
- "This plant failed here" collects photos, install date, size, the Property's Site Context, bed sun class and soil, and probable cause. Before reaching curators it is **de-identified**: no Client name or address; location coarsened to county and Region.
- [V2] contributor reputation: suggestions from Companies with high historical acceptance get priority.

**KB-CUR-13 Curator scopes and editorial independence [MVP]**
- Curators have scopes (Regions, plant groups) and a level (`contributor`, `curator`, `senior`), matching the "senior curator publishes" rule in [02](02-personas-roles-permissions.md).
- Conflict-of-interest registry: a curator affiliated with a nursery or plant brand must disclose it and cannot be the sole approver for that brand's plants.
- **No paid placement, ever.** Brands and nurseries can license media to us and publish availability, but they cannot buy ratings, palette membership or search ranking. This is a published policy, because trust in the ratings is the product.

### 4.6 Data sources and licensing (KB-SRC)

**KB-SRC-01 Source and license registry [MVP]**
- Every dataset, document family and image source is registered with: publisher, URL, **tier** (Tier 1: government, extension, botanic garden, peer-reviewed; Tier 2: reputable trade sources such as grower and brand catalogs under license, standard reference books under license; Tier 3: general web, used only as weak corroboration), license type, allowed uses, attribution text, contract link, expiry and contact. This is the same registry the console exposes in [19](19-platform-admin-portal.md) PA-075.
- **Allowed uses** are explicit flags: `display_in_app`, `print_in_proposal`, `public_web`, `fact_extraction`, `derived_text`, `ai_reference`, `ai_training`, `api_redistribution`.

**Source plan** (license classes are the author's understanding and must be verified by counsel before use):

| Source | What we take | License class (verify) | Default use policy | Priority |
|---|---|---|---|---|
| World Checklist of Vascular Plants via Plants of the World Online (Kew) | Accepted names, synonyms, native distribution by botanical country | Openly published dataset with attribution | Names, IDs and distributions; attribution in the about page | [MVP] |
| World Flora Online taxonomic backbone | Cross-reference IDs and synonyms | Open data | Cross-reference only | [MVP] |
| GBIF Backbone Taxonomy and occurrence data | Taxon keys; occurrences for range sanity checks | Backbone open with attribution; occurrence data licensed per dataset (CC0, CC BY, CC BY-NC) | Keys and internal checks; no redistribution of non-commercial records | [MVP] |
| ITIS | TSN identifiers | Public domain | IDs | [MVP] |
| USDA PLANTS Database | Symbols, state-level native status (US and Canada), wetland indicator status, growth habit, federal and state noxious listings | Public domain data; images carry individual credits | Facts and IDs; images only per credit terms | [MVP] |
| USDA hardiness map, EPA ecoregions, Census TIGER, NOAA normals, NRCS SSURGO, USGS 3DEP | Region layers and site context | US government works, generally public domain | All uses with courtesy attribution | [MVP] |
| NRCan hardiness zones, Statistics Canada boundaries, ECCC climate normals | Canadian Region layers | Open Government Licence - Canada | All uses with required attribution | [MVP] |
| VASCAN (Database of Vascular Plants of Canada) | Provincial native status | Verify | Facts with citation | [V1] |
| WUCOLS IV (University of California Agriculture and Natural Resources) | Water-use class by California region | Verify terms; seek written permission for bulk use | Facts with citation | [MVP] for California |
| State and provincial regulatory lists | Prohibited, restricted and regulated plants | Public legal records | All uses with citation | [MVP] |
| Invasive plant councils, EDDMapS | Advisory status, distribution | Terms vary | Facts with citation | [V1] |
| ASPCA toxic and non-toxic plant lists; poison-control and extension toxicity references | Pet and human toxicity | Copyrighted pages | Facts with citation and link; pursue partnership | [MVP] |
| Extension publications (for example NC State Extension Gardener Plant Toolbox, state landscape plant lists, Rutgers NJAES deer-resistance ratings, Oregon State fire-resistant plant guides) | Traits, deer ratings, fire behavior, regional notes | Usually copyrighted | Facts with citation; never copy prose; pursue data-sharing agreements with land-grant universities | [MVP] |
| Botanic garden databases and trials (Missouri Botanical Garden Plant Finder, Lady Bird Johnson Wildflower Center, Calscape, Mt. Cuba Center and Chicago Botanic Garden evaluations) | Traits and regional performance evidence | Copyrighted | Facts with citation; partnerships for media | [MVP] facts, [V1] partnerships |
| American Horticultural Society heat zone map | Heat zones | License required | Per license | [V1] |
| Keystone plant lists by ecoregion (National Wildlife Federation with Tallamy research) | Keystone flags | Verify | Facts with citation | [V1] |
| OPALS (Ogren Plant Allergy Scale) | Allergy ratings | Proprietary | Only under license | [V2] |
| Sunset climate zones | Western microclimate zones | Proprietary and trademarked | Only under license | [V2] optional |
| Nursery brands and growers | Trade names, catalog photos, GTINs, availability | Partnership license | Per contract | [V1] |
| Wikimedia Commons | Photos | Per-file free licenses (CC0, CC BY, CC BY-SA share-alike) | Allowed licenses only, with attribution; share-alike images not used in composited AI outputs | [MVP] |
| iNaturalist | Research-grade photos, phenology signals | Per-observation license; many are CC BY-NC (non-commercial) | Only CC0, CC BY and CC BY-SA photos; observations for internal phenology analysis per terms | [V1] |
| Tenant contributions | Photos, failure reports, Company ratings | Rootline contributor terms (opt-in license grant) | Per grant; credit line to the Company | [V1] |
| Rootline-owned | Commissioned photos, curator writing, rating sessions, compiled profiles | Owned | All uses, including licensing | [MVP] |

**KB-SRC-02 Facts-versus-expression policy [MVP]**
- In the US, facts are not protected by copyright (the Supreme Court's *Feist v. Rural Telephone* decision, 1991), but prose, photos and a database's original selection and arrangement can be; the EU adds a separate database right; Canada protects original compilations. Policy, to be confirmed by counsel:
  1. Extract individual facts with citations; write our own descriptions (KB-CUR-03 copy check).
  2. Never copy prose, photos or substantial parts of a restricted source's selection or arrangement.
  3. **Concentration check:** if a single restricted source is the *only* evidence for a trait on more than 20% of plants, the trait goes to legal review and a second source or a license is obtained.
  4. Honor terms of use and robots rules; no scraping where terms prohibit it.
  5. Prefer written data agreements; budget for licenses on high-value sources.

**KB-SRC-03 License enforcement at read time [MVP]**
- Every KB API response that contains media or source-derived text includes attribution strings and the allowed uses for the requested context. The KB service filters assets by context: proposal PDFs and the Customer Portal never receive non-commercial or expired assets (PA-075); public SEO pages receive only `public_web` assets; AI rendering receives only `ai_reference` assets.
- Image takedowns complete platform-wide within 24 hours, replacing the asset with the next-best licensed photo (KB-MED-07).

**KB-SRC-04 Data partnerships [V1]**
- Land-grant universities and extension services (data license plus optional co-branding: "Ratings informed by [university] Extension"), botanic-garden trial programs, nursery brand programs (photos, trade names, GTINs), state and provincial invasive councils, and the paid regional horticulturist network in [19](19-platform-admin-portal.md).

### 4.7 Photo and media pipeline (KB-MED)

**KB-MED-01 Media types and seasonal sets [MVP]**
- Photo roles: `habit` (whole plant), `in_landscape` (designed setting), `flower`, `foliage`, `fruit`, `bark`, `fall_color`, `winter`, `problem` (pest or disease, used for ID training).
- A plant's **seasonal set** is complete when it has a summer habit photo, a bloom photo (if `bloom_showiness` is 1 or more), a fall photo (if `fall_color_showiness` is 2 or more) and a winter photo (if evergreen or with winter interest).
- Non-photo media: 2D plan symbol (KB-MED-04), 3D archetype mapping (KB-MED-05), AI reference packs (KB-MED-06), illustrations.

**KB-MED-02 Ingestion pipeline [MVP]**
1. **Ingest** from upload, licensed source API, partner feed or tenant contribution.
2. **License gate:** license, author, source URL, attribution text and allowed uses are mandatory. Non-commercial and unknown licenses are rejected.
3. **Privacy scrub:** strip GPS and device EXIF (keep capture date); detect faces, house numbers and license plates and blur them, or reject if central. Mandatory for tenant contributions.
4. **De-duplication:** perceptual hash against the library; near-duplicates linked, best kept.
5. **Taxon check:** a vision model compares the image with the claimed plant's existing photos; mismatches go to a curator ("This looks like *Spiraea*, labeled *Physocarpus*").
6. **Quality scoring:** resolution (1,600 px long edge minimum for hero images, 800 px for gallery), blur (variance of Laplacian), exposure, subject framing, watermark detection (watermarked images rejected).
7. **Tagging:** role, season, organ, background (nursery, studio, landscape), dominant colors; AI suggests, curator confirms for hero images.
8. **Focal point and crops** for 1:1, 4:3, 16:9 and plant-card formats.
9. **Derivatives:** 160, 480, 960 and 1,600 px in AVIF and WebP with JPEG fallback, served through the CDN ([20](20-architecture-security.md)).
10. **Attribution string** compiled ("Photo: J. Smith, CC BY 4.0, via Wikimedia Commons").
11. **Hero selection** per plant, season and Region. Regional photos are preferred: an *Agastache* on gravel mulch in Boulder sells better in Denver than the same plant in an English border.

**KB-MED-03 Photo commissioning and contributions [V1]**
- Curator field shoots in beachhead Regions, scheduled by season gaps from the quality dashboard; photo bounties for gaps.
- Tenant contribution program: opt-in license grant; credit line "Photo: Cedar & Stone Landscapes" (which doubles as marketing for the Company). Contributed photos run through the full pipeline.

**KB-MED-04 2D plan symbols [MVP]**
- Every plant maps to a **symbol family** ([21](21-ux-design-system-sitemaps.md)) with parameters from traits (form, texture, foliage color by season, evergreen, bloom color), producing the procedural symbols specified in [10](10-design-studio.md) DS-SYMB-02. Curators can override with a custom symbol.
- Editor preview at typical plan scales (1 in = 10 ft and 1 in = 20 ft). A **distinctness check** warns when plants commonly used together (same palette) render nearly identically, addressing the "symbols are hard to tell apart" complaint.

**KB-MED-05 3D archetypes and models [MVP mapping, V2 hero models]**
- Each plant maps to one of the parametric 3D archetypes defined in [10](10-design-studio.md) DS-3D-02, parameterized by KB height, spread, leaf color, bloom color and density.
- [V2] hero 3D models (photogrammetry or Gaussian-splat captures) for the top 300 plants by usage.

**KB-MED-06 AI reference images [MVP for top plants, V1 broad]**
- Curated reference packs (1-3 best references per season and growth stage) with `ai_reference` license, consumed by the plant render packs in [11](11-ai-design-mockups.md) AIM-FID-02. Render-readiness status per plant is shown in the curator workbench.
- AI-generated images are **never** stored as plant photos. AI-generated illustrations are allowed only when labeled "Illustration".

**KB-MED-07 Takedown [MVP]**
- Removal platform-wide within 24 hours, logged, with automatic replacement by the next-best licensed asset (PA-075).

### 4.8 Search and discovery (KB-SRCH)

**KB-SRCH-01 Name search [MVP]**
- Matches botanical names, common names in all locales, trade names, synonyms and codes; typo tolerant ("hydrangia", "arborvite"); diacritic-insensitive; parses nursery abbreviations with size ("Hyd pan Limelight #5" returns the plant and the #5 size spec).
- Ranking: exact, then prefix, then synonym, then fuzzy. Results show the accepted name and the matched synonym ("matched: *Perovskia*").

**KB-SRCH-02 Faceted filters [MVP]**
- Facets with counts: plant kind; size class and height and spread sliders (ft or m); sun; water need and WUCOLS (California); zone (pre-filled from the Property); soil texture; pH; drainage; salt; deer A-D; rabbit; bloom month and color; foliage and fall color; leaf persistence; form; native (ecoregion, state or province); pollinator, host and keystone; safe for dogs, cats and children; thorns; fire behavior; maintenance level; Region rating at or above n; availability within N miles [V1]; in Company palette; favorites; Company price range.
- **Context by default:** when the picker opens from a Property or Design, Region and zone filters are pre-applied. Removing them shows a persistent banner: "Showing plants outside Central Ohio recommendations."
- Implementation: Postgres facet tables at MVP, OpenSearch index `kb-plants-{release}` at V1 ([20](20-architecture-security.md)). Target p95 under 300 ms.

**KB-SRCH-03 Natural-language semantic search [MVP]**
1. A fast LLM (AI task `kb.search.parse`) parses the query into **hard filters**, **soft preferences** and residual semantic text, as JSON with confidence.
2. Hard filters run on facet tables; candidates are ranked by a hybrid score.
3. The UI shows **"Interpreted as" chips** that the user can edit or remove, so a wrong parse is one click to fix.
4. If fewer than 3 results, a relaxation ladder runs: drop soft preferences, widen numeric ranges by 20%, relax deer B to C, then show "closest matches" with the failed constraint called out.

Worked example: **"shade-tolerant evergreen shrub under 4 ft for zone 6b clay soil deer won't eat"**

| Phrase | Parsed as | Kind |
|---|---|---|
| shade-tolerant | `sun` includes part shade or full shade | Hard |
| evergreen | `leaf_persistence` in (evergreen, semi-evergreen) | Hard (semi-evergreen shown with a badge) |
| shrub | `plant_kind = shrub` | Hard |
| under 4 ft | `mature_height.max` 122 cm or less | Hard (relaxable to 5 ft) |
| zone 6b | `usda_zone_min` at or below 6b and `usda_zone_max` at or above 6b (from the query; overrides the Property zone if they differ, with a notice) | Hard |
| clay soil | `soil_texture` includes clay | Hard |
| deer won't eat | `deer_resistance` in (A, B) | Hard (relaxable to C) |
| (implicit) | Region rating 3 or above in the Property's Region, legal status not prohibited | Context |

Illustrative results for Central Ohio might include compact inkberry cultivars (*Ilex glabra* 'Shamrock' or similar), dwarf Japanese plum yew (*Cephalotaxus harringtonia* cultivars) and boxleaf-type alternatives, each with its Region rating and availability (example data, not KB facts).

- **Hybrid score** = 0.35 BM25 text score + 0.35 vector similarity + 0.20 normalized Region rating + 0.05 Company favorite or palette membership + 0.05 availability. Weights are tunable and evaluated offline against a labeled query set.
- **Embeddings:** per plant, (a) a names document, (b) a traits-and-description document and (c) one document per Region profile's notes; stored in pgvector with HNSW indexes ([20](20-architecture-security.md)); re-embedded per release only for changed documents. Tenant notes are embedded in RLS-protected tenant tables.
- Parse cache: normalized query to parse, 30 days. Latency budget: parse 700 ms or less, retrieval 300 ms or less, p95 total 1.5 s or less.
- Spanish queries supported ("arbusto siempreverde para sombra, menos de 4 pies").
- Queries never include Client PII; the Property context is passed as Region and zone codes only.

**KB-SRCH-04 Visual search and plant ID by photo [V1 online, V2 on-device]**
1. Photo quality check; ask for a leaf or flower close-up if needed.
2. Segmentation (SAM-family model, [SAM](https://arxiv.org/abs/2304.02643), [SAM 2](https://arxiv.org/abs/2408.00714)) isolates the plant; with several plants, the user taps one.
3. A biology-specialized image embedding model (a BioCLIP-class model; license to verify), fine-tuned on licensed KB photos, retrieves nearest neighbors from the KB photo index.
4. **Regional prior:** candidates are re-weighted by presence in the Property's Region profiles, how often tenants install them in the Region, and season-appropriate appearance.
5. A vision-language model verifies the top 5 with organ-level reasoning ("opposite leaves, panicle inflorescence").
6. Output: top 5 with calibrated confidence; **abstain** when top-1 confidence is below 0.5 ("Not sure. Take a close-up of a leaf and a flower.").
- Optional fallback to a commercial plant-ID API (for example Pl@ntNet or Kindwise plant.id; terms and pricing to verify) for plants outside the KB; results map to a backbone taxon and log a KB search miss.
- Uses: site assessments (existing plant inventory), warranty claims, PHC and tree inventory ([14](14-service-line-modules.md)), the crew app ([05](05-field-crew-mobile-app.md)), and "What's this plant?" in the portal ([06](06-customer-portal.md)).
- Targets: top-1 accuracy 80% or more and top-5 95% or more on a regional landscape-plant test set.

**KB-SRCH-05 Compare [MVP]**
- Up to 4 plants side by side: traits, Region ratings and notes, seasonal photos, sizes and Company prices.

**KB-SRCH-06 Similar plants [MVP]**
- Similarity = weighted trait distance (form, size class, sun, water, leaf persistence, bloom color and months, texture) blended with embedding similarity, filtered by Region and validations.

**KB-SRCH-07 Substitution engine [MVP basic, V1 availability-aware]**
- Input: plant, context (Region, bed sun class, size spec, price tolerance plus or minus 20%, palette role).
- Hard constraints: zone, sun, legal status, Region rating 3 or above, size class within one class.
- Output: ranked substitutes with a one-line explanation ("Same evergreen mounding form, 3-4 ft, deer A, available at 2 vendors this week").
- Consumers: Design Studio swap ([10](10-design-studio.md) DS-PLNT-06), estimating, purchasing substitutions ([13](13-operations-inventory-equipment.md)), regulatory alerts (KB-RGN-08), warranty replacements.

**KB-SRCH-08 Search analytics [MVP]**
- Log queries (PII-free), zero-result and abandoned searches, reformulations, clicks and add actions. Search misses roll up into the curator gap list ("'Little Henry' sweetspire searched 41 times in Central Ohio, not in KB").

### 4.9 Plant Palettes and collections (KB-PAL)

**KB-PAL-01 Palette entity [MVP]**
- Scope: `platform` (curated by `platform_curator`) or `tenant` (Company palette).
- Geography: one or more curated Regions or a macro-region.
- **Style tags:** modern, cottage, naturalistic or meadow, formal, Japanese-inspired, Mediterranean, xeric, woodland.
- **Uses:** foundation, pollinator, rain garden, hell strip or parkway, privacy screen, shade garden, deer-resistant, fire-wise, water-wise, four-season, native meadow, parking-lot island, slope and erosion control, kid- and pet-safe, edible.
- **Roles** (the same vocabulary as [10](10-design-studio.md) DS-PLNT-11): backbone evergreen, accent shrub, flowering shrub, seasonal color perennial, grass, groundcover, vertical or vine, specimen tree, small tree, shade tree.
- **Sub-zones** where the use needs them (rain garden bottom, slope and rim).
- Constraints (maximum mature height, sun classes covered) and members with role, sun classes, notes and sort order.

**KB-PAL-02 Palette types [MVP]**
- **Curated:** static member list. **Smart:** a saved query ("Central Ohio, native to Ohio, pollinator value 2 or more, rating 4 or more"). **Hybrid:** a query plus pinned and excluded plants.

**KB-PAL-03 Palette health check [MVP]**
- Each role has 3 or more plants per sun class it claims; pollinator palettes cover bloom in at least 6 months (April to October) with no gap longer than 3 weeks; every member is legal and rated 3 or above in every target Region; native share is displayed. Failures show as fix-it items ("Thin in part shade: 1 groundcover").

**KB-PAL-04 Example palettes (illustrative example data, not KB facts)**

| Palette | Uses and context | Sample members by role or zone | Curator notes |
|---|---|---|---|
| Central Ohio Rain Garden, sun to part sun | Rain garden, pollinator, native | Bottom: *Iris virginica*, *Lobelia cardinalis*, *Asclepias incarnata*, *Carex vulpinoidea*. Slope: *Eutrochium maculatum*, *Rudbeckia fulgida*, *Physostegia virginiana*. Rim: *Schizachyrium scoparium*, *Echinacea purpurea*, *Itea virginica* 'Henry's Garnet' | Bottom-zone plants must tolerate 24-48 hours of standing water; check local stormwater credit rules |
| Front Range Hell Strip | Full sun, reflected heat, road salt, low water | *Bouteloua gracilis* 'Blonde Ambition', *Penstemon pinifolius*, *Agastache rupestris*, *Salvia yangii*, *Eriogonum umbellatum*, *Delosperma* cultivars | Check municipal right-of-way rules on height near driveways and sight triangles |
| Great Lakes Deer-Resistant Screen | Privacy screen, deer pressure, zones 5b-6b | *Juniperus virginiana* 'Taylor', *Picea omorika*, *Picea abies*, *Viburnum dentatum* (deciduous layer) | Arborvitae (*Thuja occidentalis*) is deliberately excluded: deer browse it heavily in winter |
| Central Ohio Pollinator Sun Border | Pollinator, four-season, native-leaning | *Monarda fistulosa*, *Echinacea purpurea*, *Pycnanthemum muticum*, *Asclepias tuberosa*, *Baptisia australis*, *Symphyotrichum novae-angliae*, *Solidago rugosa* 'Fireworks' | Bloom succession June to October; add early bloomers (*Amsonia*, *Penstemon digitalis*) for May |
| Golden Horseshoe Dry Shade | Shade garden, under maples | *Carex pensylvanica*, *Asarum canadense*, *Polystichum acrostichoides*, *Tiarella cordifolia*, *Hydrangea arborescens* 'Annabelle' | Root competition: plant small sizes (plugs, #1) and irrigate the first season |
| Front Range Fire-Wise Foundation | Wildland-urban interface, 5-30 ft from structures | Low-growing, high-moisture perennials and groundcovers from a cited regional fire-resistant list | No plant is fireproof; maintenance (removing dead material) matters more than species; verify local guidance |

**KB-PAL-05 Style resolution [MVP]**
- Design templates ([10](10-design-studio.md) DS-TMPL-03) and AI style presets ([11](11-ai-design-mockups.md)) reference palette **roles and tags**, not plants. At use time they resolve to the Property's Region palettes, filtered by bed sun class and validations. Resolution order: Company palette, then platform Region palette, then macro-region palette; if fewer than 5 eligible plants remain, the style is shown as "Adapted for your region" or hidden (the rule in [11](11-ai-design-mockups.md)).

**KB-PAL-06 Company palettes [MVP]**
- A Company palette is a subset of Region palettes plus Company-only plants, linked to Price Book items. It is the default for designers and for AI outputs when it exists ([11](11-ai-design-mockups.md) AIM-FID-01).

**KB-PAL-07 Client and HOA plant lists [V1]**
- Commercial clients, HOAs and municipalities often require approved or prohibited plant lists. A Company uploads the list (PDF, CSV or photo), the parser resolves it to KB plants, and it becomes a **client palette** attached to the Client. Designs for that Client's Properties validate against it ("Not on Willow Creek HOA approved list").

### 4.10 Tenant layer (KB-TEN)

**KB-TEN-01 Effective plant view [MVP]**
- A read-time merge of the global record, the effective Region profile, regulatory overlays and the tenant overlay (diagram in KB-PRP-03). Tenant data never mutates global records.

**KB-TEN-02 Favorites and Company palette [MVP]**
- Personal favorites per user; a shared Company palette managed by `owner` and `designer` (and roles granted the permission).

**KB-TEN-03 Private plants [MVP]**
- A Company can add a plant missing from the global KB. The system first attempts backbone resolution:
  - Resolved to an existing global taxon: a **private cultivar** is created under it and inherits its traits.
  - Unresolved: a **private stub** with required minimum fields (name, plant kind, zone min and max, sun, mature height and spread) so validations still work.
- Badge: "Company-added, unverified". Private plants cannot claim native status, deer resistance or pet safety without a citation note.
- **No legal loopholes:** legal checks run on the resolved taxon, so a private "Bradford pear" still resolves to *Pyrus calleryana* and is blocked in Ohio.
- "Submit to Rootline" sends the plant to the curator queue. On acceptance, the private plant is merged into a global record and the Company's references redirect.
- Default limit 2,000 private plants per Company (configurable by `platform_owner`).

**KB-TEN-04 Company notes, overrides and policies [MVP notes, V1 policies]**
- Internal notes (staff only) and client-facing notes (plant cards, proposals, care guides); custom care-guide text per plant; hidden plants (excluded from the Company's picker); Company experience rating [V1]; **Company warranty policy per plant** [V1] (for example "1-year warranty except no warranty on *Buxus* in shade"), consumed by proposals ([03](03-crm-sales-estimating-proposals.md)) and warranty tracking ([13](13-operations-inventory-equipment.md)).

**KB-TEN-05 Price Book linkage and price overrides [MVP]**
- Price Book items (owned by [03](03-crm-sales-estimating-proposals.md)) can reference `plant_id` plus `size_spec`. The KB supplies the size-spec catalog and, at V1, regional cost bands.
- **Bulk create** Price Book items from a Company palette: choose sizes per role (for example #3 for shrubs, #1 for perennials, 2 in caliper B&B for shade trees), cost from the latest vendor price, sell price from Company pricing rules by size class (for example 2.0x markup on #1-#3, 1.8x on #5-#7, 1.6x on B&B trees; illustrative). Install labor comes from production-rate assemblies in [03](03-crm-sales-estimating-proposals.md).
- **Price precedence:** Company item price, then Company pricing rule, then KB cost band times default markup (shown only as an estimate, never silently used in a sent proposal).

**KB-TEN-06 Local availability view [V1]**
- The Company's own vendor availability ([13](13-operations-inventory-equipment.md) `vendor_availability`) shows first, then the regional aggregate (4.11).

**KB-TEN-07 Company photos [V1]**
- Project photos tagged with plants (from as-built placements) appear on the Company's plant pages and website ([16](16-marketing-growth-communications.md)).

**KB-TEN-08 Company plant list import [MVP]**
- Companies migrating from spreadsheets or other tools import their plant list (CSV). The import engine (KB-CUR-02, tenant scope) resolves names, creates a Company palette and Price Book items, and turns unresolved rows into private plants.

### 4.11 Nursery and supplier availability and price feeds (KB-NUR)

**KB-NUR-01 Inputs [V1]**
- Nursery Connect uploads ([13](13-operations-inventory-equipment.md), free vendor portal), availability lists forwarded by Companies (PDF, XLSX, CSV, email body), partner APIs, punchout and EDI ([13](13-operations-inventory-equipment.md) levels L2-L4, [V2]) and brand availability feeds [V2].

**KB-NUR-02 Line parsing and matching [V1]**
- The parser ([13](13-operations-inventory-equipment.md) agent 3) extracts name text, size text, quantity, price and notes.
- **Name matching:** an abbreviation dictionary (Hyd = *Hydrangea*, pan = *paniculata*, Ju = *Juniperus*), synonyms and trade names, fuzzy matching, then LLM disambiguation constrained to KB candidates.
- **Size normalization:** "#5", "5 gal", "5G" to container class #5; "2 in cal B&B" to caliper 2.0 in B&B; "5-6' B&B" to height 5-6 ft B&B; "1 qt", "4.5 in", "72 cell plug".
- Each line gets a confidence. Unmatched lines go to the uploading Company (or, for Nursery Connect, to the vendor's mapping screen), then to the curator search-miss list. **The parser never creates canonical plants** ([13](13-operations-inventory-equipment.md)).
- **Mapping memory per vendor:** once "Hyd pan Lime #5" is confirmed for a vendor, future lists match automatically.

**KB-NUR-03 Nursery directory and listings [V1]**
- `nursery` (global, for vendors that opt in to a public presence): name, locations, delivery radius, wholesale-only flag.
- `nursery_listing` (global): plant, size spec, quantity band, public list price (only if the vendor opts in), as-of date, location.
- Company-specific **contract prices** stay in the tenant's `vendor_availability` (RLS) and are never shared.

**KB-NUR-04 Regional aggregates [V1]**
- `availability_index` per plant and Region: share of reporting vendors listing the plant in the last 30 days.
- `cost_band` per size and macro-region from public list prices, shown only with 5 or more vendors; freshness label ("as of Nov 3"); listings older than 21 days are stale.

**KB-NUR-05 Availability in workflows [V1]**
- Picker availability chips ("Available: 3 vendors, as of Nov 3"), "within N miles" filter, substitution suggestions when unavailable, an estimator alert when a sold proposal's plants drop out of availability before install, and handoff to purchase orders ([13](13-operations-inventory-equipment.md)).

**KB-NUR-06 Demand signals to growers [V2]**
- Aggregated, anonymized demand ("Specified in 140 Central Ohio designs this winter", shown only with 10 or more Companies) offered to Nursery Connect vendors to plan crops, and as an input to data products ([22](22-business-model-pricing-gtm.md)).

### 4.12 Consumers of the KB, APIs and public plant pages (KB-API)

**KB-API-01 Consumer map [MVP]**

| Consumer | What it uses | Doc |
|---|---|---|
| Design Studio | Picker, validations, symbols, schedules, growth simulation, substitutions, palettes | [10](10-design-studio.md) |
| AI mockups and layouts | Region-locked palettes (rating 3 or above), reference packs, descriptors | [11](11-ai-design-mockups.md) |
| Estimating and proposals | Price Book links, size specs, plant cards (photo, notes, citations), warranty policies | [03](03-crm-sales-estimating-proposals.md) |
| Purchasing, inventory, holding yard | Availability, size specs, watering needs, nursery guarantees | [13](13-operations-inventory-equipment.md) |
| Crew app | Offline subset, install lists, plant ID, care notes in Spanish | [05](05-field-crew-mobile-app.md) |
| Customer Portal | Plant cards, personalized care guides, toxicity warnings, installed-plant registry | [06](06-customer-portal.md) |
| Service lines | PHC targets and pests, tree species data, turfgrass, plant factors for irrigation water budgets | [14](14-service-line-modules.md) |
| Marketing | Tenant plant pages, seasonal "what's blooming" content, lead magnet | [16](16-marketing-growth-communications.md) |
| Copilot and agents | Grounded plant answers with citations | [17](17-ai-copilot-automation.md) |
| Reporting | Plant usage, warranty rates by plant and Region | [18](18-reporting-analytics.md) |
| Operator console | Curation, Regions, licenses, feeds | [19](19-platform-admin-portal.md) |

**KB-API-02 Internal module API [MVP]**
- The `kb` module exposes a typed interface inside the modular monolith ([20](20-architecture-security.md)). Core calls:

| Call | Purpose |
|---|---|
| `getPlant(id, { release, regionId, tenantId, locale })` | Effective plant view |
| `searchPlants(query, filters, context)` | Name, faceted and natural-language search |
| `resolveName(text, { sizeHint })` | Name and size resolution for imports, parsers and OCR |
| `getSiteContext(propertyId)` | Region, zones, ecoregion, jurisdictions, overrides |
| `getEffectiveProfile(plantId, regionId)` | Inherited, legally overlaid profile |
| `validatePlacement(plantId, placementContext)` | Returns validation codes (the VAL-* rules in [10](10-design-studio.md)) with severity and source |
| `suggestSubstitutes(plantId, context)` | Substitution engine |
| `getCareCalendar(plantId, regionId, locale)` | Care tasks mapped to months |
| `getPalette(id, context)` | Resolved palette for a Property |

- All reads are release-pinned and cached (Redis keys include the release id); cache invalidation on `kb.release_published`.

**KB-API-03 Offline subset for the crew app [MVP]**
- Per Company, the `reference:{tenant}` bundle ([20](20-architecture-security.md)) contains the Company palette, plants on active jobs, and the top plants for the Company's Regions, up to about 1,500 plants: names (English and Spanish), thumbnails, key care notes and toxicity. Delta-synced per release; size budget 20-30 MB (estimate).

**KB-API-04 Public SEO plant pages [V1]**
- Platform pages at `rootline.com/plants/{slug}` (global) and `rootline.com/plants/{slug}/{region-slug}` (regional), published only for **Gold** plants with a published profile in that Region. Content: curated profile notes, licensed seasonal photos (`public_web` only), care calendar, native status, and a "Find a Rootline pro in Central Ohio" call to action routed per [16](16-marketing-growth-communications.md).
- **Thin-content guard:** a regional page is indexable only if its profile has 80 or more words of Region-specific notes or 3 or more fields that differ from the macro-region; otherwise it canonicalizes to the global page.
- Structured data (schema.org and Bioschemas Taxon markup; verify current vocabulary), breadcrumbs, hreflang for English, Spanish and French-Canadian.
- Tenant website plant pages follow [16](16-marketing-growth-communications.md) 4.1.5 (indexable only with Company-unique content).
- Anti-scraping: rate limits, bot management, no public bulk endpoints, and "canary" facts to detect wholesale copying.

**KB-API-05 Partner API and data licensing [V2, V3 bulk licensing]**
- REST API with OAuth client credentials for nurseries, garden centers, irrigation designers, municipalities and ag-tech partners: `GET /v1/plants`, `GET /v1/plants/{id}`, `GET /v1/regions/lookup?lat=&lng=`, `GET /v1/plants/{id}/profiles/{regionId}`, `POST /v1/search`. Only fields whose sources allow `api_redistribution` are returned, with attribution. Metered and priced per [22](22-business-model-pricing-gtm.md).
- [V3] bulk licensing of owned content (ratings, profiles, owned photos) as a data product.

**KB-API-06 Copilot grounding [MVP]**
- Copilot plant answers cite KB records. When the Copilot uses general knowledge not in the KB, it labels it "not verified for your Region" ([17](17-ai-copilot-automation.md)).

### 4.13 Seed strategy: the first 3,000 plants and the first Regions (KB-SEED)

**KB-SEED-01 Principles [MVP]**
- **Breadth at "Good" for what contractors actually buy;** depth at "Excellent" in the beachhead Regions; **legal coverage complete on day one** for every state and province where a Company can sign up (state- and province-level prohibited and regulated lists; advisory council lists for beachhead Regions only).

**KB-SEED-02 Candidate list [MVP]**
- Union of: (a) design-partner Companies' historical plant purchases and estimates (the 20 beachhead design partners in [22](22-business-model-pricing-gtm.md), with consent); (b) wholesale availability lists from beachhead nurseries (frequency of appearance across lists); (c) extension-recommended landscape plant lists for beachhead states and provinces; (d) USDA PLANTS natives with landscape use in beachhead ecoregions; (e) all regulated species in US states and Canadian provinces; (f) turfgrasses and common bedding annuals.
- Score = 0.4 contractor usage + 0.3 nursery frequency + 0.2 extension recommendation + 0.1 native-palette need; regulated species are must-include.

**KB-SEED-03 Composition targets (planning estimate)**

| Group | Records | Notes |
|---|---|---|
| Trees (shade, ornamental, evergreen, conifers) | 450 | Includes street-tree staples and common cultivars |
| Shrubs (deciduous, broadleaf evergreen, conifer) | 850 | The core of foundation and screening work |
| Perennials | 900 | Weighted to beachhead-native and trade staples |
| Ornamental grasses, sedges, rushes | 220 | |
| Groundcovers and vines | 180 | |
| Annuals and tropicals for seasonal color | 120 | Bedding programs for commercial maintenance |
| Bulbs | 60 | |
| Ferns | 50 | |
| Succulents and cacti | 60 | Front Range and Texas needs |
| Turfgrass species and cultivar classes | 20 | Lawn programs ([14](14-service-line-modules.md)) |
| Regulated and invasive reference records | 90 | Present so they can be recognized and blocked |
| **Total** | **3,000** | About 1,100 taxon-level and 1,900 cultivar records (estimate) |

**KB-SEED-04 First Regions (founder decision; default plan)**
- The beachhead choice is open in [22](22-business-model-pricing-gtm.md) ("where is the founder's plant knowledge strongest?"). Default planning assumption:
  - **Wave 1 (MVP):** two beachhead clusters at Excellent. Default: Great Lakes and Ohio Valley (curated Regions Central Ohio, Northeast Ohio, Southeast Michigan, Chicagoland) plus whichever of Front Range Colorado or Mid-Atlantic Piedmont scores higher. About 5-7 curated Regions at Excellent; macro-region profiles at Good where Wave 1 profiles generalize; everywhere else Basic.
  - **Wave 2 (V1):** Golden Horseshoe, Ontario at Excellent before Landscape Ontario Congress (January); 6-10 more Regions at Good.
  - **Wave 3 (V2):** 60-80 curated Regions covering populated US and southern Canada at Good or better (estimate).

**KB-SEED-05 Twenty-week seed plan (plus a prior growing season for photos)**

| Weeks | Work | Exit criteria |
|---|---|---|
| Prior summer and fall | Commission photography in beachhead Regions (summer bloom and fall color cannot be shot in a winter launch window) | Seasonal shot list 60% covered for the top 600 plants |
| 1-3 | Schema, trait dictionary, source and license registry, backbone load (WCVP/POWO, WFO, USDA PLANTS, ITIS IDs), Region layers | Backbone resolves 99% of candidate names |
| 3-6 | Candidate list scored; 3,000 records created with names, kinds, native ranges and USDA PLANTS attributes; regulatory lists entered with second review | Legal coverage complete for all launch jurisdictions |
| 5-11 | AI enrichment in batches of 250 plants; curator review; critical traits dual-reviewed | 100% of critical traits cited and dual-reviewed; Silver or better for 90% of records |
| 8-14 | Rating sessions per Wave 1 Region (for example 8 sessions of 3 hours with 4 raters each); palettes for the 7 core uses | 600 or more rated plants per Wave 1 Region |
| 10-16 | Open-license photo import; gap list; symbol mapping; render packs for the top 300 plants ([11](11-ai-design-mockups.md)) | 95% of palette plants with licensed photos |
| 15-18 | QA: audit sample of 300 plants; evals (500 Region-correct recommendation queries); search eval on design-partner query logs | Audit error rate under 2% non-critical and 0 critical; eval region-compliance 99% or more; zero-result rate under 5% |
| 18-20 | Release candidate; design-partner beta feedback; launch release | Founder sign-off |

**KB-SEED-06 Staffing and effort (estimates)**
- People: 1 lead horticulturist (senior curator, full-time); 2 regional contract curators per Wave 1 cluster (about half-time each); 1 data engineer; half an ML engineer; part-time licensing counsel.
- Effort arithmetic (estimate): 3,000 plants x about 70 traits = about 210,000 values. If about 30% need individual review at about 120 values per curator-hour, that is about 525 curator-hours; dual review of about 24,000 critical values (8 per plant) at about 200 values per hour adds about 240 hours; rating sessions add about 100 curator-hours per Region. Roughly 4-6 curator-months in total, which fits the 20-week plan with the team above.
- AI enrichment spend for the seed set is expected in the low thousands of US dollars of model usage (estimate; depends on model choice and retrieval volume), metered through the AI Gateway.

**KB-SEED-07 Launch quality gates [MVP]**
- Every Wave 1 Region meets the Excellent criteria (KB-RGN-09); 100% of critical traits cited and dual-reviewed; prohibited and regulated lists complete for all US states and Canadian provinces; plant-recommendation eval at 99% or more region-compliance (the gate in [19](19-platform-admin-portal.md)); 95% or more of palette plants with licensed photos; audit error rates as above.

---

## 5. Key user flows

### 5.1 Curator bulk import with diff preview [MVP]

1. Maria (senior curator, `platform_curator`) uploads "Ohio extension landscape shrubs.csv" (612 rows) or connects a Google Sheet, and picks the import profile "Extension list format A". The source and license are selected from the registry; the upload is blocked if none is chosen.
2. The system auto-maps columns; she confirms "Hardiness" to `usda_zone_min/max`, "Light" to `sun`, "Deer" to `deer_resistance`.
3. Normalization and name resolution run: 571 matched, 22 new cultivars of existing taxa, 6 new taxa, 9 ambiguous, 4 unresolved.
4. The diff preview shows 1,840 field changes: 1,210 fill empty values, 402 change unverified values, 211 conflict with selected values, 17 would overwrite curator-verified values (never auto-applied).
5. She resolves the 9 ambiguous names, sets the apply policy ("fill empty" and "propose as candidates" for conflicts), and submits. The import becomes a batch of change requests grouped as "Ohio extension shrubs, Apr 2027".
6. Non-critical, high-agreement items are eligible for bulk accept; critical items route to a second curator. Approved items ship in the next daily release.

```mermaid
flowchart TD
    A["Upload CSV or connect Google Sheet"] --> B{"Source and license selected?"}
    B -- "No" --> B1["Blocked: choose a registered source"]
    B -- "Yes" --> C["Map columns with saved profile"]
    C --> D["Normalize units, enums, zones, months"]
    D --> E["Resolve names against backbone and KB"]
    E --> F{"Ambiguous or unresolved rows?"}
    F -- "Yes" --> F1["Curator resolves or skips rows"]
    F -- "No" --> G["Validate types, ranges and sanity rules"]
    F1 --> G
    G --> H["Diff preview: new, changed, conflict, verified-overwrite"]
    H --> I["Choose apply policy per column"]
    I --> J["Create batch of change requests"]
    J --> K{"Critical trait?"}
    K -- "Yes" --> L["Second curator review"]
    K -- "No" --> M["Review queue or bulk accept if eligible"]
    L --> N["Approved"]
    M --> N
    N --> O["Included in next KB release"]
```

### 5.2 AI enrichment to published release [MVP seed pipeline, V1 self-serve]

1. A curator selects "Front Range xeric perennials, 400 plants, trait group: requirements" and starts an enrichment run (V1 self-serve; at MVP `platform_engineer` launches seed batches).
2. For each plant, the enrichment worker retrieves permitted documents from registered sources and calls the AI Gateway task `kb.enrich`.
3. The model returns values with snippets and locators; the worker verifies every locator (fetch plus exact snippet match), normalizes values, cross-checks sources and computes confidence.
4. Suggestions land in the review queue grouped by plant. Eligible non-critical items can be bulk-accepted; critical items need two humans.
5. Accepted items are published in the next release; rejection reasons feed prompt evaluation in AI Ops ([19](19-platform-admin-portal.md)).

```mermaid
sequenceDiagram
    participant Cur as Curator
    participant Q as ReviewQueue
    participant W as EnrichWorker
    participant Src as SourceRegistry
    participant GW as AIGateway
    participant Rel as ReleaseBuilder
    Cur->>W: Start run for 400 plants, requirements group
    loop Each plant
        W->>Src: Fetch permitted documents
        Src-->>W: Documents with license flags
        W->>GW: kb.enrich with schema and documents
        GW-->>W: Values, snippets, locators
        W->>W: Verify locators, normalize, cross-check, score
        W->>Q: Change requests with confidence
    end
    Cur->>Q: Accept, edit, reject, second opinion
    Q->>Rel: Approved change items
    Rel->>Rel: Daily release build and validation
    Rel-->>Cur: Release published with changelog
```

### 5.3 Change request lifecycle [MVP]

```mermaid
stateDiagram-v2
    [*] --> draft
    draft --> in_review : submit
    draft --> withdrawn : author withdraws
    in_review --> approved : reviewer accepts non-critical
    in_review --> second_review : critical trait or legal
    second_review --> approved : second curator accepts
    second_review --> rejected : second curator rejects
    in_review --> rejected : reviewer rejects with reason
    in_review --> draft : changes requested
    approved --> published : included in release
    published --> superseded : later change replaces value
    rejected --> [*]
    withdrawn --> [*]
    superseded --> [*]
```

Rules: the author can never approve their own critical item; AI-authored items count as authored by the prompt version, so any human may be first reviewer; `approved` items not released within 7 days alert `platform_engineer` (release pipeline stuck).

### 5.4 Address to Region to a filtered plant picker [MVP]

1. An estimator creates the Property "Johnson, 2210 Tremont Rd, Upper Arlington" in CRM; geocoding returns a rooftop point.
2. The CRM module calls `getSiteContext`; the KB returns zone 6b, Eastern Corn Belt Plains, Franklin County, curated Region Central Ohio (Excellent), soil hint silty clay loam (illustrative).
3. The designer opens the Design Studio; the picker pre-applies Region and zone. The bed is tagged part shade from the sun study.
4. Results show only plants legal in Ohio, hardy to 6b, rated 3 or better for Central Ohio, sorted by hybrid score, with Company favorites first.

```mermaid
sequenceDiagram
    participant U as Estimator
    participant CRM as CRMModule
    participant KB as KBService
    participant DB as PostGIS
    participant DS as DesignStudio
    U->>CRM: Create Property with address
    CRM->>CRM: Geocode to rooftop point
    CRM->>KB: getSiteContext for Property
    KB->>DB: Point in polygon for all layers
    DB-->>KB: Zones, ecoregions, jurisdictions, curated Region
    KB-->>CRM: Site Context stored with release id
    U->>DS: Open design and plant picker
    DS->>KB: searchPlants with Region, zone, bed sun class
    KB-->>DS: Ranked plants with ratings, legal status, availability
```

### 5.5 Natural-language search to "add to design" [MVP]

1. In the picker, the designer types "shade-tolerant evergreen shrub under 4 ft, clay, deer won't eat".
2. The parse returns chips: Shrub, Evergreen, Part or full shade, Under 4 ft, Clay, Deer A-B, plus context chips Central Ohio and 6b.
3. Seven results return in 1.1 s; she removes "Evergreen" to see semi-evergreen options, compares three, and clicks "Add to bed B" on one. The Design Studio places it with the KB spacing default and runs validations.

### 5.6 Regional rating session [MVP basic, V1 full]

```mermaid
flowchart TD
    A["Facilitator creates session: Region plus plant list"] --> B["Invite raters and collect COI disclosures"]
    B --> C["Blind rating: 1-5, do-not-use, conditions, notes"]
    C --> D{"Spread of 2 or more?"}
    D -- "Yes" --> E["Discussion round"]
    D -- "No" --> F["Median rating accepted"]
    E --> F
    F --> G["Profile change requests with rating_session evidence"]
    G --> H["Senior curator review"]
    H --> I["Published in next release"]
```

1. Maria creates "Central Ohio shrubs, session 3" with 140 shrubs used by 3 or more Companies in the Region, and invites two contract curators and an extension educator.
2. Raters work blind for 90 minutes in the grid (or a shared Google Sheet).
3. The facilitator view shows 23 items with a spread of 2 or more; the group discusses them (for example boxwood cultivars in shade under current blight pressure) and agrees values.
4. Publishing creates 140 profile change requests with evidence type `rating_session` naming the raters; a senior curator approves them in one batch.

### 5.7 Duplicate detection and merge [MVP]

```mermaid
flowchart TD
    A["Duplicate candidate detected"] --> B["Side-by-side review with usage counts"]
    B --> C{"Same plant?"}
    C -- "No" --> C1["Mark as distinct and suppress future match"]
    C -- "Yes" --> D["Choose survivor and pick values per field"]
    D --> E["Loser becomes merged with redirect"]
    E --> F["Names of loser become synonyms"]
    F --> G["Rewrite mutable references: drafts, Price Book, palettes, overlays"]
    G --> H["Snapshotted records untouched, resolve via redirect"]
    H --> I["Emit kb.plant_merged"]
```

### 5.8 Regulatory change hotfix and tenant alerts [MVP]

1. The list watcher detects that a state's prohibited plant list page changed; a high-priority change request opens.
2. A curator verifies the official text and enters a listing with effective date and phase-out schedule; a second curator approves.
3. A hotfix release publishes within hours; `kb.regulatory_status_changed` is emitted.
4. Each affected Company gets an alert listing draft designs, open proposals, palettes, Price Book items and maintenance programs that include the plant in that jurisdiction, with suggested substitutes.

```mermaid
sequenceDiagram
    participant Wt as ListWatcher
    participant C1 as Curator
    participant C2 as SecondCurator
    participant Rel as ReleaseBuilder
    participant Bus as EventBus
    participant T as TenantNotifier
    Wt->>C1: High-priority change request
    C1->>C1: Verify official text, enter listing
    C1->>C2: Request second review
    C2-->>Rel: Approve for hotfix
    Rel->>Bus: kb.release_published and kb.regulatory_status_changed
    Bus->>T: Affected plant and jurisdiction
    T->>T: Find affected drafts, proposals, palettes, items
    T-->>T: Send alerts with substitutes
```

### 5.9 Nursery availability list to matched availability [V1]

```mermaid
flowchart LR
    A["Nursery list arrives: PDF, XLSX or email"] --> B["Parser extracts lines"]
    B --> C["Vendor mapping memory"]
    C --> D{"Known mapping?"}
    D -- "Yes" --> G["Matched plant and size"]
    D -- "No" --> E["Abbreviation, synonym and fuzzy match"]
    E --> F{"Confidence above threshold?"}
    F -- "Yes" --> G
    F -- "No" --> H["Queue for Company or vendor confirmation"]
    H --> G
    G --> I["Tenant vendor_availability"]
    G --> J["Global nursery_listing if vendor opted in"]
    J --> K["Regional availability index and cost bands"]
```

### 5.10 Field plant ID and failure report [V1]

1. Luis (`crew_lead`) is doing a spring walk-through for a warranty client. He photographs a browned shrub in the crew app.
2. The app segments the plant and calls plant ID; top result "*Ilex crenata*" (0.86) with the regional note "struggles in wet clay in Central Ohio".
3. He confirms the ID, taps "Report problem", picks "dead or dying", adds a second photo of the root zone, and submits.
4. The warranty workflow in [13](13-operations-inventory-equipment.md) opens a replacement task; the de-identified failure report goes to the Central Ohio curator queue.

```mermaid
sequenceDiagram
    participant L as CrewLead
    participant App as CrewApp
    participant ID as PlantID
    participant KB as KBService
    participant WR as WarrantyModule
    participant Q as CuratorQueue
    L->>App: Photo of shrub
    App->>ID: Image plus Region code
    ID->>ID: Segment, embed, nearest neighbors, regional prior
    ID->>KB: Verify top candidates
    KB-->>App: Top 5 with confidence and regional notes
    L->>App: Confirm and report problem
    App->>WR: Replacement task for installed plant
    App->>Q: De-identified failure report
```

### 5.11 Private plant promoted to the global KB [MVP]

1. A designer adds "*Itea virginica* 'Little Henry'", which is missing from the KB. It resolves to the global taxon *Itea virginica*, so a private cultivar is created and inherits species traits; she overrides mature size to 2-3 ft with a nursery tag photo as citation.
2. She clicks "Submit to Rootline". A curator verifies the cultivar, enriches it and publishes a global record.
3. The private record merges into the global one; the Company's designs and Price Book items redirect automatically.

### 5.12 KB release pipeline [MVP]

```mermaid
flowchart TD
    A["Approved change items since last release"] --> B["Release build: apply to staging snapshot"]
    B --> C["Validate: schema, ranges, legal overlays, broken refs"]
    C --> D{"Validation passes?"}
    D -- "No" --> D1["Block release and alert engineer"]
    D -- "Yes" --> E["Compile plant documents and Region profiles"]
    E --> F["Rebuild facet tables and blue-green search index"]
    F --> G["Re-embed changed documents"]
    G --> H["Run eval smoke tests: region compliance, search golden set"]
    H --> I{"Gates pass?"}
    I -- "No" --> D1
    I -- "Yes" --> J["Switch current_release pointer"]
    J --> K["Emit kb.release_published and invalidate caches"]
    K --> L["Tenant changelog digest and offline bundle deltas"]
```

---

## 6. Screens and wireframes

### 6.1 Screen inventory

| # | Screen | Surface | Primary roles | Priority |
|---|---|---|---|---|
| 1 | Curator home (my queue, Region health, releases) | Operator console | `platform_curator`, `platform_owner` | [MVP] |
| 2 | Review queue (AI, imports, tenant suggestions) | Operator console | `platform_curator` | [MVP] |
| 3 | Plant record editor with provenance and inheritance | Operator console | `platform_curator` | [MVP] |
| 4 | Region builder map and Region detail | Operator console | `platform_curator`, `platform_owner` | [MVP] |
| 5 | Region profile grid (all plants for one Region) | Operator console | `platform_curator` | [MVP] |
| 6 | Bulk import wizard and diff preview | Operator console | `platform_curator`, `platform_engineer` | [MVP] |
| 7 | Rating session grid and facilitator view | Operator console, tablet | `platform_curator`, guest raters | [MVP] basic, [V1] |
| 8 | Duplicate and merge queue | Operator console | `platform_curator` | [MVP] |
| 9 | Regulatory listings manager and list watchers | Operator console | `platform_curator` | [MVP] |
| 10 | Media library, license registry, takedowns | Operator console | `platform_curator`, `platform_owner` | [MVP] |
| 11 | Quality dashboard | Operator console | `platform_curator`, `platform_owner` | [MVP] |
| 12 | Release manager and changelog | Operator console | senior `platform_curator`, `platform_engineer` | [MVP] |
| 13 | Palette editor with health check | Operator console and Company app | `platform_curator`, `designer`, `owner` | [MVP] |
| 14 | Plant library (tenant lens) `/plants` | Company web app | `designer`, `estimator`, `owner` | [MVP] |
| 15 | Plant detail (tenant lens) with Region profile, availability, Company notes | Company web app | All Company roles | [MVP] |
| 16 | Design Studio plant picker drawer | Company web app | `designer`, `estimator` | [MVP] |
| 17 | Private plant form and "Submit to Rootline" | Company web app | `designer`, `owner` | [MVP] |
| 18 | Nursery availability view and mapping confirmations | Company web app | `ops_manager`, `estimator` | [V1] |
| 19 | Plant ID camera and results | Crew app | `crew_lead`, `technician` | [V1] |
| 20 | Plant cards and care guide | Customer Portal | `client_residential`, `client_commercial` | [MVP] |
| 21 | Public plant page (global and regional) | Marketing site | Public | [V1] |

### 6.2 Wireframe: curator review queue

```text
+----------------------------------------------------------------------------------------------------+
| ROOTLINE CONSOLE > Plant KB > Review queue                       [Cmd-K]   Maria O. (senior)       |
+----------------------------------------------------------------------------------------------------+
| Filters: Region [Front Range v]  Group [Perennials v]  Author [AI v]  Conf [>=0.7 v]  Critical [any]|
| Queue: 214 items   Eligible for bulk accept: 96   My SLA breaches: 0          [Shift+A bulk accept]|
+------------------------------+---------------------------------------------------------------------+
| > Agastache rupestris  (12)  |  Agastache rupestris (licorice mint hyssop)        used by 31 cos  |
|   Penstemon pinifolius (9)   |  Change request CR-88412  author ai:kb.enrich@v14   run FR-xeric-03 |
|   Salvia yangii        (7)   +---------------------------------------------------------------------+
|   Eriogonum umbellatum (11)  |  FIELD             CURRENT        PROPOSED        CONF   SOURCES    |
|   Zauschneria garrettii (8)  |  usda_zone_min *   (empty)        5a              0.93   T1 x2      |
|   Bouteloua gracilis   (4)   |  usda_zone_max *   (empty)        9b              0.88   T1, T2     |
|   ...                        |  water_need        moderate       low             0.95   T1 x3      |
|                              |  drought_tol       (empty)        high            0.94   T1 x2      |
| * = critical trait           |  deer_resistance * C              B               0.71   T1 vs T1 ! |
|   (needs 2nd reviewer)       |  bloom_months      Jul-Sep        Jul-Oct         0.82   T1, T3     |
|                              +---------------------------------------------------------------------+
|                              |  SOURCE SNIPPETS for deer_resistance                                |
|                              |  [1] Extension list (CO): "...rarely damaged by deer..."  p.4  open |
|                              |  [2] Extension list (NJ): "...occasionally severely..."   row 18 open|
|                              |  Note: sources from different Regions disagree -> consider Region   |
|                              |  profile override instead of global change.                         |
|                              +---------------------------------------------------------------------+
|                              | [A] Accept  [E] Edit+accept  [R] Reject  [S] 2nd opinion  [P] Make  |
|                              | Region override (Front Range)            J/K next/prev   ? shortcuts|
+------------------------------+---------------------------------------------------------------------+
```

### 6.3 Wireframe: plant record editor with provenance and inheritance

```text
+----------------------------------------------------------------------------------------------------+
| Plant KB > Hydrangea paniculata 'Limelight'   RL-P-004821   PUBLISHED  rel 2027.04.12-1   Gold 94  |
| Parent: Hydrangea paniculata (species)   Trade names: none   US PP: on file (expired, verify)      |
| Tabs: [Overview] [Names] [Traits] [Requirements] [Characteristics] [Regions 14] [Media 23]         |
|       [Commercial] [Care] [History] [Duplicates 0]                                                  |
+----------------------------------------------------------------------------------------------------+
| TRAITS (inherited values in grey)                                          [Propose change]        |
|  mature_height     6-8 ft   (183-244 cm)   override   src: T1 extension   cur: M.O.  Mar 2027  (i) |
|  mature_spread     6-8 ft                  override   src: T1 extension   cur: M.O.  Mar 2027  (i) |
|  form              upright, rounded        override   src: curator                             (i) |
|  blooms_on         new wood                inherited from species                               (i) |
|  bloom_months      Jul-Sep  (ref: Great Lakes)  override   src: T1 x2                           (i) |
|  bloom_colors      lime green -> cream -> pink-tinged                                          (i) |
|  usda_zone *       3a-8b                   inherited from species  2 reviewers  Jan 2027       (i) |
|  deer_resistance * C (occasionally severely damaged)  src: Rutgers-style list  2 reviewers     (i) |
|  toxicity *        dogs: mild  cats: mild  humans: mild   src: T1 x2       2 reviewers         (i) |
+----------------------------------------------------------------------------------------------------+
| (i) PROVENANCE: bloom_months                                                                        |
|  v3  Jul-Sep   curator_entered  M. Ortiz   2027-03-02  rel 2027.03.03-1   evidence: 2 citations    |
|  v2  Jul-Aug   ai_extracted     kb.enrich@v9  conf 0.78  2026-11-20  accepted by J. Lee            |
|  v1  (empty)   imported         USDA PLANTS import  2026-10-04                                      |
+----------------------------------------------------------------------------------------------------+
| REGIONS  Central Ohio 5/5  "Top performer; tolerates clay if not waterlogged"  rev Mar 2027        |
|          Front Range 4/5   "Needs afternoon shade on west exposures"           rev Jan 2027        |
|          Golden Horseshoe 4/5 (inherited: Great Lakes)                       [Open Region profiles]|
+----------------------------------------------------------------------------------------------------+
```

### 6.4 Wireframe: Region builder map

```text
+----------------------------------------------------------------------------------------------------+
| Plant KB > Regions > Central Ohio (draft v4)        Parent: Great Lakes and Ohio Valley   EXCELLENT|
+-----------------------------------+----------------------------------------------------------------+
| RECIPE                            |  MAP  [Satellite | Streets]  Layers: [x] USDA 2023 [x] EPA L4  |
|  epa_l3 = 55                      |        [ ] Counties [x] Curated [ ] Heat zones [ ] Soils       |
|  AND state = OH                   |   +----------------------------------------------------------+ |
|  AND usda_zone BETWEEN 5b AND 6b  |   |      .....  NE Ohio  .....                               | |
|  + drawn: "Licking Co. east edge" |   |    ..   +----------------+   ..                          | |
|  - drawn: "Hocking Hills"         |   |   .     |  CENTRAL OHIO  |    .    (hatched = overlap)    | |
|  [Edit recipe] [Draw] [Subtract]  |   |   .     |   * Columbus   |    .                          | |
|                                   |   |    ..   +----------------+  ..                           | |
| PREVIEW (vs published v3)         |   |      .....  SW Ohio  .....                               | |
|  Area           11,940 sq mi      |   +----------------------------------------------------------+ |
|  Tenants inside 37 (+2)           |  Click a point to see its Site Context                         |
|  Properties     21,480 (+610)     |  40.0256, -83.0627 -> 6b | 55b | Franklin Co | Central Ohio    |
|  Plants rated   812               +----------------------------------------------------------------+
|  Overlaps       0                 |  [Validate topology]  [Diff vs v3]  [Submit for review]        |
|  Props changing Region: 610       |  Publishing recomputes Site Context for affected Properties.   |
+-----------------------------------+----------------------------------------------------------------+
```

### 6.5 Wireframe: bulk import diff preview

```text
+----------------------------------------------------------------------------------------------------+
| Import: "Ohio extension landscape shrubs.csv"  profile: Extension list A  source: [OSU Ext list v]  |
| License: Facts with citation (T1)   Rows 612   Step 4 of 5: Diff preview                           |
+----------------------------------------------------------------------------------------------------+
| SUMMARY  matched 571 | new cultivar 22 | new taxon 6 | ambiguous 9 (!) | unresolved 4              |
|          field changes 1,840: fill-empty 1,210 | change-unverified 402 | conflict 211 |           |
|          VERIFIED-OVERWRITE 17 (never auto-applied)                         [Download dry-run CSV] |
+----------------------------------------------------------------------------------------------------+
| ROW  NAME (as given)            RESOLVED TO                     FIELD          OLD      NEW   ACT  |
| 14   Ilex glabra 'Shamrock'     Ilex glabra 'Shamrock'          sun            FS,PS    FS,PS,SH  C |
| 14                                                              wet_tolerance  (empty)  high    F  |
| 37   Perovskia atriplicifolia   Salvia yangii (synonym match)   drought_tol    high     high    =  |
| 52   Euonymus alatus            Euonymus alatus                 deer *         B        A      V!  |
| 88   Viburnum x 'Mohawk'        ? 2 candidates                  [choose v]                     ?   |
| 91   Spirea 'Goldflame'         Spiraea japonica 'Goldflame'    bloom_months   May-Jun  Jun-Jul C  |
+----------------------------------------------------------------------------------------------------+
| Legend: F fill-empty  C conflict  V! overwrites verified  = unchanged  ? ambiguous  * critical     |
| Apply policy: [Fill empty: apply] [Conflicts: propose as candidates] [Unverified: overwrite]       |
|                                                    [Back]  [Create 1,823 change requests ->]       |
+----------------------------------------------------------------------------------------------------+
```

### 6.6 Wireframe: rating session grid

```text
+----------------------------------------------------------------------------------------------------+
| Rating session: Central Ohio shrubs #3   Raters 4 (blind)   Progress 96/140   Time 01:12   [Sheet] |
+----------------------------------------------------------------------------------------------------+
| PLANT                          CURRENT  MY RATING   DNU  CONDITIONS                NOTE      CONF  |
| Aronia melanocarpa 'Viking'    4        [5]         [ ]  -                         heavy... [H]    |
| Buxus sempervirens             3        [2]         [ ]  avoid shade+humid  ...    blight   [M]    |
| Buxus 'Green Velvet'           3        [3]         [ ]  good air flow             ...      [M]    |
| Cornus sericea 'Arctic Fire'   -        [4]         [ ]  -                         ...      [H]    |
| Euonymus alatus                1        [ ]         [x]  legal: check state list   invasive [H]    |
| Ilex crenata                   3        [2]         [ ]  avoid wet clay            rots     [M]    |
| Ilex glabra 'Shamrock'         4        [4]         [ ]  -                         ...      [H]    |
+----------------------------------------------------------------------------------------------------+
| Keys: 1-5 rate  D do-not-use  C conditions  N note  Enter next  Esc skip      [Submit my ratings]  |
| Facilitator only (after submit): spread >= 2 on 23 items -> [Open discussion view]                 |
+----------------------------------------------------------------------------------------------------+
```

### 6.7 Wireframe: tenant plant picker with natural-language search (Design Studio drawer)

```text
+---------------------------------------------------------------------------------------------+
| PLANTS  Johnson front yard / Bed B (part shade, clay)        Central Ohio  Excellent  6b    |
| [ shade-tolerant evergreen shrub under 4 ft clay deer won't eat                      ] (o)  |
| Interpreted as: (Shrub x) (Evergreen x) (Part/full shade x) (Under 4 ft x) (Clay x)          |
|                 (Deer A-B x)  context: (Central Ohio) (6b) (legal in OH)    [Edit filters]  |
+---------------------------------------------------------------------------------------------+
| 7 results  sort: Best match v      [Company palette first: on]   [Availability: 25 mi v]    |
|---------------------------------------------------------------------------------------------|
| [img] Ilex glabra 'Shamrock'      inkberry          4/5 Central Ohio   Deer B   Native OH    |
|       3-4 ft, evergreen, tolerates wet clay        #3 $38.00   Avail: 3 vendors (Nov 3)  [+]|
| [img] Cephalotaxus harringtonia 'Duke Gardens'  Japanese plum yew  4/5   Deer A            |
|       3-4 ft, shade-tolerant conifer               #5 $64.00   Avail: 1 vendor          [+]|
| [img] Buxus 'Green Velvet'        boxwood           3/5 (conditions)  Deer A               |
|       ! Needs air flow: blight pressure in shade   #3 $41.00   Avail: 2 vendors         [+]|
|---------------------------------------------------------------------------------------------|
| Compare (0/4)   Similar   Why these?   Not finding it? [Add Company plant]                  |
| Plant ratings, prices and availability in this wireframe are illustrative example data.     |
+---------------------------------------------------------------------------------------------+
```

---

## 7. Data model

The KB lives in the `kb` domain module ([20](20-architecture-security.md)). Global tables are in schema `kb` with no row-level security (tenants get `SELECT` only); tenant overlays are in RLS-protected `kb.tenant_*` tables keyed by `tenant_id`. Property Site Context is tenant data and lives with the Property.

### 7.1 Entity summary

| Area | Entity | Purpose | Key fields |
|---|---|---|---|
| Taxonomy | `plant` | Canonical plant (taxon or cultivar) | `id`, `code`, `slug`, `parent_plant_id`, `rank` (genus, species, infraspecific, cultivar), `plant_kind`, `family`, `genus`, `hybrid_marker`, `specific_epithet`, `infraspecific_rank`, `infraspecific_epithet`, `cultivar_epithet`, `cultivar_group`, `series_id`, `accepted_backbone_id`, `status`, `completeness_score`, `completeness_tier`, `merged_into_id`, `trade_display_until` |
| Taxonomy | `plant_name` | Common, trade and synonym names | `plant_id`, `name`, `name_kind` (common, trade, synonym, field_name), `synonym_type`, `locale`, `region_id`, `is_preferred`, `mark` (registered, trademark, none), `mark_owner`, `source_id` |
| Taxonomy | `plant_external_id` | Cross-references | `plant_id`, `system` (powo, ipni, wfo, gbif, usda_plants, itis, vascan), `external_id` |
| Taxonomy | `plant_series` | Series and seed strains | `name`, `brand`, `genus` |
| Taxonomy | `plant_patent` | Patents, breeders' rights | `plant_id`, `jurisdiction`, `kind` (us_plant_patent, ca_pbr, eu_cpvr), `number`, `filed_on`, `granted_on`, `expires_on_est` |
| Traits | `trait_definition` | Trait registry | `key`, `data_type`, `unit_dimension`, `group`, `criticality`, `inheritable`, `regionalizable`, `facetable`, `client_visible`, `completeness_weight`, `evidence_rule` |
| Traits | `trait_enum_value` | Allowed values with definitions | `trait_key`, `value`, `label_i18n`, `definition` |
| Traits | `plant_trait_value` | One value with provenance | `plant_id`, `trait_key`, `value_json`, `original_text`, `qualifiers`, `is_selected`, `source_id`, `license_id`, `citation_id`, `method`, `confidence`, `author_id`, `reviewer_id`, `published_release_id` |
| Provenance | `source`, `license`, `citation` | Source registry and citations | tier, license type, `allowed_uses`, attribution, expiry; citation locator, snippet, retrieved_at |
| Geography | `region`, `region_version` | Curated and layer Regions, versioned geometry | `kind`, `layer`, `code`, `name`, `parent_id`, `coverage_tier`, `lead_curator_id`, `recipe`, `geom`, `priority`, `version`, `status` |
| Geography | `jurisdiction`, `regulatory_listing` | Legal status | jurisdiction level and geometry; listing `plant_id` scope, `category`, `effective_on`, `phase_out`, `exemptions`, `citation_id`, `last_verified_at` |
| Geography | `plant_native_range` | Native status by unit | `plant_id`, `unit_kind`, `unit_code`, `status`, `source_id` |
| Profiles | `plant_region_profile` | Performance in a Region | `plant_id`, `region_id`, `rating`, `do_not_use`, `reason_codes`, `conditions`, `client_note`, `internal_note`, `cultivar_picks`, `confidence`, `curator_id`, `reviewer_id`, `last_reviewed_at`, `next_review_due`, `status` |
| Profiles | `profile_trait_override`, `profile_evidence` | Regional trait values and evidence | override `trait_key`, `value_json`; evidence `kind`, `citation_id`, `supports`, `weight` |
| Palettes | `palette`, `palette_member` | Platform palettes | `scope`, `region_ids`, `style_tags`, `uses`, `kind` (curated, smart, hybrid), `query_json`; member `plant_id`, `role`, `sub_zone`, `sun_classes`, `sort` |
| Media | `media_asset`, `plant_media` | Photos and assets | asset `storage_key`, `phash`, `license_id`, `attribution`, `allowed_uses`, `quality_score`; link `plant_id`, `role`, `season`, `region_id`, `is_hero` |
| Media | `symbol_family`, `plant_symbol_map` | 2D symbol mapping | family `key`, `params_schema`; map `plant_id`, `family_key`, `params_json`, `custom_svg_key` |
| Care and pests | `care_task_template`, `pest_disease`, `plant_pest_link` | Care calendars and pests | task `kind`, `phenophase`, `region_month_map`; pest `type`, `regions_pressure`; link `susceptibility` |
| Commercial | `size_spec`, `plant_size_spec` | Standard sizes | `code` (C3, CAL2_BB, HT5_6_BB, QT, PLUG72), `kind`, `min`, `max`, `unit` |
| Commercial | `nursery`, `nursery_listing`, `region_availability` | Opt-in nursery data and aggregates | listing `plant_id`, `size_spec_code`, `qty_band`, `list_price`, `currency`, `as_of`; aggregate `availability_index`, `cost_low`, `cost_median`, `cost_high`, `sample_n` |
| Curation | `change_request`, `change_item` | Unit of work | request `origin` (curator, import, ai, tenant, feed, merge, bulk), `batch_id`, `status`, `priority_score`; item `target_table`, `target_id`, `field`, `old_json`, `new_json`, `is_critical`, `reviewer1_id`, `reviewer2_id` |
| Curation | `kb_release`, `plant_version` | Releases and snapshots | release `code`, `kind` (daily, hotfix), `published_at`, `stats`; version `plant_id`, `release_id`, `doc_json` |
| Curation | `merge_redirect`, `duplicate_candidate` | Merges | `from_plant_id`, `to_plant_id`, `merged_at`, `undo_until` |
| Curation | `import_job`, `import_row`, `enrichment_run`, `rating_session`, `rating_vote`, `feedback_report`, `list_watcher`, `curator_scope`, `coi_disclosure` | Pipelines and workflows | see sections 4.5 and 4.3 |
| Read models | `plant_compiled`, `plant_facet`, `plant_embedding`, `photo_embedding` | Fast reads per release | `release_id`, `region_id`, `doc_json`; facet columns; `vector` |
| Tenant | `tenant_plant` | Private plants | `tenant_id`, `resolved_plant_id`, `fields_json`, `status`, `submitted_cr_id` |
| Tenant | `tenant_plant_overlay` | Notes, hidden, ratings, policies | `tenant_id`, `plant_id`, `internal_note`, `client_note`, `care_text`, `hidden`, `company_rating`, `warranty_policy` |
| Tenant | `tenant_favorite`, `tenant_palette`, `tenant_palette_member` | Favorites and Company or client palettes | `tenant_id`, `user_id`, `client_id` (client palettes), members as above |
| Tenant | `property_site_context` | Cached Site Context | `tenant_id`, `property_id`, `region_release_id`, `context_json`, `overrides_json`, `computed_at` |
| Tenant | `kb_search_log` | PII-free search analytics | `tenant_id`, `query_hash`, `parse_json`, `result_count`, `action` |

### 7.2 Taxonomy, traits and provenance

```mermaid
erDiagram
    plant ||--o{ plant : "parent of"
    plant ||--o{ plant_name : "has"
    plant ||--o{ plant_external_id : "cross-referenced by"
    plant_series ||--o{ plant : "groups"
    plant ||--o{ plant_patent : "protected by"
    trait_definition ||--o{ plant_trait_value : "defines"
    plant ||--o{ plant_trait_value : "described by"
    source ||--o{ plant_trait_value : "supports"
    license ||--o{ source : "governs"
    citation ||--o{ plant_trait_value : "cites"
    source ||--o{ citation : "contains"
    plant ||--o{ plant_media : "illustrated by"
    media_asset ||--o{ plant_media : "used as"
    license ||--o{ media_asset : "governs"
    plant ||--o{ plant_size_spec : "sold as"
    size_spec ||--o{ plant_size_spec : "standardizes"
    plant ||--o{ plant_pest_link : "susceptible to"
    pest_disease ||--o{ plant_pest_link : "affects"
    plant ||--o{ care_task_template : "cared for by"
    plant {
        uuid id PK
        uuid parent_plant_id FK
        uuid series_id FK
        text code
        text slug
        text rank
        text plant_kind
        text family
        text genus
        text specific_epithet
        text infraspecific_rank
        text infraspecific_epithet
        text cultivar_epithet
        text accepted_backbone_id
        text status
        int completeness_score
        uuid merged_into_id FK
        date trade_display_until
    }
    plant_name {
        uuid id PK
        uuid plant_id FK
        text name
        text name_kind
        text locale
        uuid region_id FK
        bool is_preferred
        text mark
        uuid source_id FK
    }
    plant_external_id {
        uuid id PK
        uuid plant_id FK
        text system
        text external_id
    }
    plant_series {
        uuid id PK
        text name
        text brand
    }
    plant_patent {
        uuid id PK
        uuid plant_id FK
        text kind
        text number
        date filed_on
        date expires_on_est
    }
    trait_definition {
        text key PK
        text data_type
        text unit_dimension
        text trait_group
        text criticality
        bool inheritable
        bool regionalizable
        bool facetable
        numeric completeness_weight
    }
    plant_trait_value {
        uuid id PK
        uuid plant_id FK
        text trait_key FK
        jsonb value_json
        text original_text
        bool is_selected
        uuid source_id FK
        uuid citation_id FK
        text method
        numeric confidence
        uuid author_id
        uuid reviewer_id
        uuid published_release_id FK
    }
    source {
        uuid id PK
        text name
        int tier
        uuid license_id FK
        jsonb allowed_uses
    }
    license {
        uuid id PK
        text license_type
        text attribution_template
        date expires_on
    }
    citation {
        uuid id PK
        uuid source_id FK
        text locator
        text snippet
        timestamptz retrieved_at
    }
    media_asset {
        uuid id PK
        text storage_key
        text phash
        uuid license_id FK
        text attribution
        jsonb allowed_uses
        numeric quality_score
    }
    plant_media {
        uuid id PK
        uuid plant_id FK
        uuid media_asset_id FK
        text role
        text season
        uuid region_id FK
        bool is_hero
    }
    size_spec {
        text code PK
        text kind
        numeric min_value
        numeric max_value
        text unit
    }
    plant_size_spec {
        uuid plant_id FK
        text size_spec_code FK
        bool is_common
    }
    pest_disease {
        uuid id PK
        text name
        text pest_type
        jsonb regions_pressure
    }
    plant_pest_link {
        uuid plant_id FK
        uuid pest_disease_id FK
        text susceptibility
    }
    care_task_template {
        uuid id PK
        uuid plant_id FK
        text task_kind
        text phenophase
        jsonb region_month_map
    }
```

### 7.3 Regions, profiles, palettes and nursery data

```mermaid
erDiagram
    region ||--o{ region : "parent of"
    region ||--o{ region_version : "versioned as"
    region ||--o{ plant_region_profile : "rates plants in"
    plant ||--o{ plant_region_profile : "rated by"
    plant_region_profile ||--o{ profile_trait_override : "overrides"
    plant_region_profile ||--o{ profile_evidence : "supported by"
    jurisdiction ||--o{ regulatory_listing : "publishes"
    plant ||--o{ regulatory_listing : "listed in"
    plant ||--o{ plant_native_range : "native in"
    palette ||--o{ palette_member : "contains"
    plant ||--o{ palette_member : "member of"
    region ||--o{ palette : "scopes"
    nursery ||--o{ nursery_listing : "offers"
    plant ||--o{ nursery_listing : "listed as"
    plant ||--o{ region_availability : "aggregated in"
    region ||--o{ region_availability : "aggregates"
    region {
        uuid id PK
        uuid parent_id FK
        text kind
        text layer
        text code
        text name
        text coverage_tier
        uuid lead_curator_id
        int priority
        text status
    }
    region_version {
        uuid id PK
        uuid region_id FK
        int version
        jsonb recipe
        geometry geom
        timestamptz published_at
    }
    plant_region_profile {
        uuid id PK
        uuid plant_id FK
        uuid region_id FK
        int rating
        bool do_not_use
        jsonb reason_codes
        jsonb conditions
        text client_note
        text internal_note
        jsonb cultivar_picks
        text confidence
        uuid curator_id
        uuid reviewer_id
        date last_reviewed_at
        date next_review_due
        text status
    }
    profile_trait_override {
        uuid id PK
        uuid profile_id FK
        text trait_key
        jsonb value_json
        uuid citation_id FK
    }
    profile_evidence {
        uuid id PK
        uuid profile_id FK
        text evidence_kind
        uuid citation_id FK
        bool supports
        numeric weight
    }
    jurisdiction {
        uuid id PK
        text level
        text code
        text name
        geometry geom
    }
    regulatory_listing {
        uuid id PK
        uuid jurisdiction_id FK
        uuid plant_id FK
        text category
        date effective_on
        jsonb phase_out
        jsonb exemptions
        uuid citation_id FK
        date last_verified_at
    }
    plant_native_range {
        uuid id PK
        uuid plant_id FK
        text unit_kind
        text unit_code
        text native_status
        uuid source_id FK
    }
    palette {
        uuid id PK
        text scope
        text name
        text palette_kind
        jsonb style_tags
        jsonb uses
        jsonb query_json
        text status
    }
    palette_member {
        uuid palette_id FK
        uuid plant_id FK
        text role
        text sub_zone
        jsonb sun_classes
        int sort_order
    }
    nursery {
        uuid id PK
        text name
        jsonb locations
        int delivery_radius_mi
        bool wholesale_only
    }
    nursery_listing {
        uuid id PK
        uuid nursery_id FK
        uuid plant_id FK
        text size_spec_code
        text qty_band
        numeric list_price
        text currency
        date as_of
    }
    region_availability {
        uuid plant_id FK
        uuid region_id FK
        text size_spec_code
        int availability_index
        numeric cost_low
        numeric cost_median
        numeric cost_high
        int sample_n
        date as_of
    }
```

### 7.4 Curation, releases and the tenant layer

```mermaid
erDiagram
    change_request ||--o{ change_item : "contains"
    kb_release ||--o{ change_item : "publishes"
    kb_release ||--o{ plant_version : "snapshots"
    plant ||--o{ plant_version : "versioned as"
    plant ||--o{ merge_redirect : "redirects"
    import_job ||--o{ import_row : "has"
    import_job ||--o{ change_request : "creates"
    enrichment_run ||--o{ change_request : "creates"
    rating_session ||--o{ rating_vote : "collects"
    rating_session ||--o{ change_request : "creates"
    feedback_report ||--o| change_request : "may create"
    plant ||--o{ tenant_plant_overlay : "overlaid by"
    plant ||--o{ tenant_plant : "resolves"
    tenant_palette ||--o{ tenant_palette_member : "contains"
    plant ||--o{ tenant_palette_member : "member of"
    kb_release ||--o{ property_site_context : "computed with"
    change_request {
        uuid id PK
        text origin
        uuid batch_id
        text status
        numeric priority_score
        uuid author_id
        text author_kind
        timestamptz created_at
    }
    change_item {
        uuid id PK
        uuid change_request_id FK
        text target_table
        uuid target_id
        text field
        jsonb old_json
        jsonb new_json
        bool is_critical
        uuid reviewer1_id
        uuid reviewer2_id
        uuid release_id FK
    }
    kb_release {
        uuid id PK
        text code
        text release_kind
        timestamptz published_at
        jsonb stats
        bool is_current
    }
    plant_version {
        uuid id PK
        uuid plant_id FK
        uuid release_id FK
        jsonb doc_json
    }
    merge_redirect {
        uuid from_plant_id PK
        uuid to_plant_id FK
        timestamptz merged_at
        timestamptz undo_until
    }
    import_job {
        uuid id PK
        text profile_key
        uuid source_id
        int row_count
        text status
    }
    import_row {
        uuid id PK
        uuid import_job_id FK
        int row_number
        text match_status
        jsonb diff_json
        jsonb errors
    }
    enrichment_run {
        uuid id PK
        text prompt_version
        text trait_group
        int plant_count
        numeric cost_usd
        text status
    }
    rating_session {
        uuid id PK
        uuid region_id
        text mode
        text status
        uuid facilitator_id
    }
    rating_vote {
        uuid id PK
        uuid rating_session_id FK
        uuid plant_id
        uuid rater_id
        int rating
        bool do_not_use
        jsonb conditions
        text confidence
    }
    feedback_report {
        uuid id PK
        uuid tenant_id
        uuid plant_id
        uuid region_id
        text kind
        jsonb deidentified_context
        text status
    }
    tenant_plant {
        uuid id PK
        uuid tenant_id
        uuid resolved_plant_id FK
        jsonb fields_json
        text status
        uuid submitted_change_request_id
    }
    tenant_plant_overlay {
        uuid id PK
        uuid tenant_id
        uuid plant_id FK
        text internal_note
        text client_note
        bool hidden
        int company_rating
        jsonb warranty_policy
    }
    tenant_palette {
        uuid id PK
        uuid tenant_id
        uuid client_id
        text name
        text palette_kind
    }
    tenant_palette_member {
        uuid tenant_palette_id FK
        uuid plant_id FK
        text role
        uuid price_book_item_id
    }
    property_site_context {
        uuid property_id PK
        uuid tenant_id
        uuid region_release_id FK
        jsonb context_json
        jsonb overrides_json
        timestamptz computed_at
    }
```

### 7.5 Key integrity rules

- `plant.code` and `plant.slug` are unique and immutable; `merged_into_id` is set only when `status = merged`.
- At most one `plant_trait_value` per (`plant_id`, `trait_key`, scope) has `is_selected = true` (partial unique index).
- `plant_region_profile` is unique per (`plant_id`, `region_id`); `rating` is 1-5 or null; `do_not_use = true` requires a reason code and a senior reviewer.
- A `change_item` with `is_critical = true` cannot reach `approved` unless `reviewer1_id` and `reviewer2_id` are distinct and neither is the author.
- `regulatory_listing` on a species applies to descendants unless an exemption lists the descendant `plant_id`.
- Tenant tables carry `tenant_id` and RLS policies; global tables are read-only to the application role (`rootline_app`) per [20](20-architecture-security.md).
- Snapshots (`plant_version`) are append-only; consumers that sold work store the `release_id`.

---

## 8. Integrations, APIs and events

### 8.1 External integrations

| Integration | Purpose | Mode | Cadence | Priority |
|---|---|---|---|---|
| WCVP/POWO and WFO exports | Accepted names, synonyms, distributions | Bulk download, diffed into change requests | Monthly | [MVP] |
| GBIF API | Taxon keys, occurrence sanity checks | REST | On demand, cached | [MVP] |
| USDA PLANTS, ITIS | Symbols, native status, noxious lists, TSNs | Bulk download | Quarterly | [MVP] |
| Hardiness maps (USDA, NRCan), EPA and CEC ecoregions, Census TIGER, Statistics Canada boundaries | Region layers | GIS files loaded to PostGIS | On new edition | [MVP] |
| NOAA and ECCC normals, NRCS SSURGO, USFS wildfire risk | Climate summaries, soil hints, fire defaults | GIS and tabular loads | Annual or on new edition | [V1], fire [V2] |
| Google Sheets API | Curator imports and rating sessions | OAuth, read-only scope per sheet | On demand | [MVP] |
| Wikimedia Commons, iNaturalist APIs | Open-license photos (license-filtered) | REST | On demand | [MVP], iNaturalist [V1] |
| Plant ID fallback provider (for example Pl@ntNet, Kindwise) | Out-of-KB identification | REST via AI Gateway | Per request | [V1] optional |
| AI Gateway ([17](17-ai-copilot-automation.md)) | `kb.enrich`, `kb.search.parse`, `kb.describe`, `kb.plant_id.verify`, embeddings | Internal | Per call, metered | [MVP] |
| Nursery Connect, supplier feeds ([13](13-operations-inventory-equipment.md)) | Availability and prices | Upload, email, API, EDI | Hourly to weekly | [V1], partner APIs [V2] |
| Mapbox or Google Maps tiles | Region builder map | JS SDK | Interactive | [MVP] |

### 8.2 Domain events emitted

All events go through the transactional outbox ([20](20-architecture-security.md)) and carry `release_id` where relevant.

| Event | Payload (summary) | Main consumers |
|---|---|---|
| `kb.release_published` | release code, kind, counts, changed plant ids | Search indexer, caches, Design Studio availability badges, crew app bundle builder, tenant changelog |
| `kb.plant_merged` | from id, to id | Design, Price Book, palettes, warranties, reporting |
| `kb.plant_deprecated` | plant id, reason | Design validations, Price Book, palettes |
| `kb.regulatory_status_changed` | plant ids, jurisdiction, category, effective date | Tenant notifier, design validations, proposals, service programs |
| `kb.region_published` | region id, version, Properties affected count | Site Context recompute job, reporting |
| `kb.property_region_changed` | tenant id, property id, old and new Region and zone | CRM, Design Studio, portal care guides |
| `kb.profile_updated` | plant id, region id, old and new rating | AI palette caches, SEO pages, Company alerts if a palette plant drops below 3 |
| `kb.media_taken_down` | asset id | CDN purge, proposal PDF regeneration queue, portal |
| `kb.change_request_submitted` | origin, priority | Curator notifications |
| `kb.tenant_plant_submitted` | tenant id, private plant id | Curator queue |
| `kb.nursery_listing_updated` | nursery id, plants | Availability aggregates, picker chips |

### 8.3 Events consumed

| Event (owner) | KB reaction |
|---|---|
| `property.geocoded` and `property.address_changed` (CRM, [03](03-crm-sales-estimating-proposals.md)) | Compute Site Context |
| `design.version_published`, `design.plant_placed` ([10](10-design-studio.md)) | Usage counts for priority scoring and analytics |
| `warranty.plant_replaced`, `warranty.claim_created` ([13](13-operations-inventory-equipment.md)) | Aggregate failure signals (k of 10 or more) for profile re-review triggers |
| `vendor_availability.updated` ([13](13-operations-inventory-equipment.md)) | Update tenant availability views and, for opted-in vendors, global listings |
| `install.as_built_completed` ([05](05-field-crew-mobile-app.md), [10](10-design-studio.md)) | Installed-plant registry links for care guides ([06](06-customer-portal.md)) |
| `ai.eval_regression` ([19](19-platform-admin-portal.md)) | Block releases that depend on the affected prompt |

### 8.4 Console and tenant APIs

- Console (operator) endpoints are internal and audited: imports, change requests, reviews, releases, Regions, listings, media, sessions. Every write records actor, reason and diff ([19](19-platform-admin-portal.md)).
- Company app endpoints are thin wrappers over the module API (KB-API-02) plus tenant overlay CRUD (`/plants/{id}/overlay`, `/palettes`, `/private-plants`, `/plants/{id}/suggestions`, `/plants/{id}/failure-reports`).
- [V2] partner webhooks: `plant.updated`, `region_profile.updated`, `regulatory_status.changed` for API licensees, signed with HMAC and retried with exponential backoff for 24 hours.

---

## 9. Permissions

Permission keys follow the pattern in [02](02-personas-roles-permissions.md): `plant_kb.read`, `plant_kb.tenant_overlay.manage`, `plant_kb.private_plant.manage`, `plant_kb.company_palette.manage`, `plant_kb.suggest`, `plant_kb.failure_report.create`, `plant_kb.validation.override`, `plant_kb.availability.read`, `plant_kb.cost_band.read`, and platform keys `kb.plant.edit`, `kb.review`, `kb.review.critical`, `kb.release.publish`, `kb.region.edit`, `kb.listing.edit`, `kb.media.manage`, `kb.license.manage`, `kb.import.run`, `kb.enrichment.run`, `kb.session.facilitate`.

### 9.1 Platform staff

Legend: F full, R read, W write (draft), A approve, X execute, - none.

| Capability | `platform_owner` | `platform_curator` contributor | `platform_curator` curator | `platform_curator` senior | `platform_support` | `platform_finance` | `platform_engineer` |
|---|---|---|---|---|---|---|---|
| Read KB, Regions, profiles | F | R (scoped) | R | R | R | - | R |
| Draft plant and profile changes | F | W (scoped Regions and groups) | W | W | - | - | - |
| Approve non-critical changes | A | - | A (not own) | A (not own) | - | - | - |
| Second review of critical traits and legal listings | A | - | - | A (not own) | - | - | - |
| Publish releases, hotfix releases | X | - | - | X | - | - | X (pipeline operation only) |
| Region definitions and republish | F | - | W | A | - | - | - |
| Regulatory listings | F | W | W | A | R | - | - |
| Media and license registry | F | W | W | A | R | R (license costs) | - |
| Takedown (24-hour) | X | - | X | X | X (request) | - | X |
| Run imports | X | - | X | X | - | - | X |
| Run enrichment (seed batches at MVP) | X | - | X ([V1]) | X ([V1]) | - | - | X |
| Facilitate rating sessions | X | Rate only | X | X | - | - | - |
| Merge duplicates | A | - | W | A | - | - | - |
| Curator scopes, COI registry | F | R own | R own | R | - | - | - |
| KB analytics (aggregated, k of 10 or more) | R | R | R | R | R | - | R |
| Tenant business data | Per [02](02-personas-roles-permissions.md) consented access only | - | - | - | Per [02](02-personas-roles-permissions.md) | - | Per [02](02-personas-roles-permissions.md) |

Curators never see tenant business data (Clients, invoices); failure reports and search logs reach them de-identified ([02](02-personas-roles-permissions.md)).

### 9.2 Company roles and Clients

Legend: Y allowed, O own records only, P per Company setting, - none.

| Capability | owner | office_manager | estimator | designer | ops_manager | crew_lead | technician | bookkeeper | subcontractor | client_residential | client_commercial |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Search and view KB (tenant lens) | Y | Y | Y | Y | Y | Y | Y | Y | Assigned jobs | Plant cards on own Properties | Plant cards on own Properties |
| View Region ratings and curator notes | Y | Y | Y | Y | Y | Y | Y | - | - | Client-safe notes | Client-safe notes |
| Favorites (personal) | Y | Y | Y | Y | Y | Y | Y | - | - | Wishlist [V1] | Wishlist [V1] |
| Manage Company palette | Y | P | P | Y | P | - | - | - | - | - | - |
| Create and edit private plants | Y | - | P | Y | P | - | - | - | - | - | - |
| Company notes, care text, hidden plants | Y | Y (client notes) | P | Y | Y | - | - | - | - | - | - |
| Company warranty policy per plant [V1] | Y | - | - | P | Y | - | - | - | - | - | - |
| Link plants to Price Book, bulk create items | Y | P | Y | P | Y | - | - | R | - | - | - |
| View costs and cost bands | Y | P | P | P (default off) | Y | - | - | Y | - | - | - |
| View nursery availability [V1] | Y | Y | Y | Y | Y | Y | - | - | - | - | - |
| Override validation warnings (with reason) | Y | - | Y | Y | Y | - | - | - | - | - | - |
| Override validation errors | - (only legal exceptions via `platform_owner`) | - | - | - | - | - | - | - | - | - | - |
| Suggest corrections to global KB | Y | Y | Y | Y | Y | Y | Y | - | - | - | - |
| File plant failure reports [V1] | Y | Y | Y | Y | Y | Y | Y | - | Assigned jobs | Via warranty request ([06](06-customer-portal.md)) | Via warranty request |
| Plant ID by photo [V1] | Y | Y | Y | Y | Y | Y | Y | - | Assigned jobs | "What's this plant?" [V2] | [V2] |
| Upload client or HOA plant lists [V1] | Y | Y | Y | Y | Y | - | - | - | - | - | Upload for review [V2] |
| Import Company plant list | Y | P | - | Y | P | - | - | - | - | - | - |

Notes: "P" defaults are set in the role templates in [02](02-personas-roles-permissions.md) and can be changed by the `owner`. Validation **errors** (prohibited species, `do_not_use`) cannot be overridden by any Company role; a `platform_owner` exception (for example a removal or research project) is logged and visible to the Company.
