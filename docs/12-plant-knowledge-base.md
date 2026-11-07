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
