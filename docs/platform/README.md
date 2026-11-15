# Platform blueprint data

Machine-readable definitions of the whole Rootline platform: who uses it, what each person can see and do, what each package includes, which markets it serves, and every screen on every surface. A build agent generates code from these files; the [Platform Explorer](../site/app.html) renders a clickable mock from them; a marketing agent reads its segments and messaging from them.

The JSON files are the source of truth for the blueprint. Matrices that already exist in the specs were parsed from the spec tables verbatim (each block names its source section), so a change of policy starts in the spec and is mirrored here.

| File | What it holds | Parsed from |
|---|---|---|
| `roles.json` | 27 roles: 9 tenant role templates plus the Observer starter role, client roles and 6 contact scopes, 5 platform staff roles, 2 partner roles, prospect and homeowner. The tenant permission matrix (94 capabilities), field-class defaults, the platform staff matrix, client contact rights, and navigation visibility for the web app, console and portal. | 02 §3.1, §5.7, §5.11, §10.1, §10.2, §10.4; 21 §5.4, §5.5, §5.9 |
| `personas.json` | 28 named personas: the composites from 02 §3 mapped to sample tenants, plus blueprint personas (marked `source: blueprint`) for markets the specs name but do not personify. Each has goals, frustrations, success, a quote, what they see first and what they never see. | 02 §3; 22 §6.1 |
| `plans.json` | 6 plans with prices and inclusions; 63 capabilities with availability per plan (`Y`, `L` with the limit, `A` with the add-on code, `-`) and scope tag; 20 add-ons; 9 usage meters; the AI credit rate card; seat types; trial and onboarding offers; homeowner tiers; partner tracks; the entitlement UX rules. | 22 §4.2-§4.6, §5.3.1, §5.4.1 |
| `segments.json` | Target markets S1-S7 with size, revenue, service mix, current stack, plan fit, sales motion, sample tenant, modules on, pains, draft messaging, proof points to verify, objections, channels and what the segment sees first. Plus the ICP scorecard and the positioning statement. | 22 §6.1-§6.5 (messaging is draft copy to test) |
| `tenants.json` | 8 sample tenants, one or more per segment, with plan, add-ons, modules, Region, size, brand, cast (role to person) and hero clients. Reyes and Summit come from 02; Greenleaf is the sample dataset (21 §15.3, 22 §4.6) and the cast of the other walkthroughs; the rest are illustrative. | 02 §3; 21; 22 |
| `surfaces.json` | 10 surfaces with hosts and sign-in, and 154 routes. Each route has its surface, navigation group, path, scope tag, purpose, the plan feature that gates it, the module that must be on, the permission it needs and the spec that owns it. | 21 §5.1-§5.7; 19 §6.1 |

## Gating order

A screen is shown when all of these pass, in this order (the same order the explorer's `RL.access` uses):

1. **Surface**: the role uses this surface (a crew lead uses the crew app; a property manager uses the portal).
2. **Role**: the route's `roles` list for non-web surfaces, or navigation visibility for the web app, console and portal.
3. **Permission**: the route's `perm` capability has a grant other than `-` for the role (02 §10.1). Inside a screen, field classes decide which values are masked (02 §10.2).
4. **Module**: the tenant has the module on (Books, lawn programs, Snow & Ice). Off means hidden, not greyed out (21 §5.2).
5. **Plan**: the route's `feature` is `Y` or `L` on the plan, or bought as an add-on. Otherwise the owner sees a locked entry with the upgrade path and everyone else sees nothing (`plans.json` `entitlement_ux`).
6. **Scope lens**: MVP, V1, V2 or V3, from 24.

## Using the data

```bash
python3 docs/platform/build.py
```

`build.py` checks every cross-reference (routes to features, capabilities, modules, roles and parents; personas to roles, tenants and landing routes; tenants to plans, segments and add-ons; features to add-ons) and writes `docs/site/assets/platform-data.js` for the explorer. It exits non-zero on any broken reference.

For implementation, generate code from these files rather than copying values: the authorization layer's permission and field-class tables from `roles.json`, the entitlement table from `plans.json`, the route manifest and navigation from `surfaces.json`, seed and demo data from `tenants.json`. See [25 - Platform blueprint and build handoff](../25-platform-blueprint-build-handoff.md).

## Conventions

- Scope tags follow 24: `MVP`, `V1`, `V2`, `V3`. No delivery dates.
- Names, companies and quotes are illustrative. Hosts on `.example` are placeholders.
- Where the specs are silent, the value is marked as a blueprint assumption (for example the Design Solo plan's capability list).
