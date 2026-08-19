# Owner-Site Portfolio Status

Last reviewed: 2026-08-19

This file is the commercial and deployment gate for properties in this repository. Check it before building, deploying, indexing, contacting an owner, or using a property as a demonstration.

Code presence is not commercial authorization. An old content file or image directory does not make a property active.

## Active partner

### Molonta Heritage Estate

- Status: active partner under the founding performance model discussed with the owners.
- LoveThisPlace storefront: public and indexable.
- Independent owner site: deployed and shareable, currently `private-preview` and `noindex`.
- Working share URL: `https://molonta-heritage-estate.vercel.app/`
- Intended custom domain: `https://molonta.lovethisplace.co/`
- Deployment project: dedicated Molonta Vercel project.
- Required build variable: `VILLA_SLUG=molonta-heritage-estate`.
- Inquiry route: established LoveThisPlace villa pipeline with Molonta identity and source attribution.
- Public indexing gate: defined in `MOLONTA_TWO_SITE_AND_INDEXING_DECISION_2026-08-19.md`.

Do not change Molonta to `public` on the independent site until that gate passes. Do not create a second Molonta codebase or deployment.

## Retained Go Elite showcase

### Casa Del Toro

- Status: retained Go Elite inventory and design/conversion showcase.
- Primary commercial presence: Elite Cartagena.
- LoveThisPlace presence: platform storefront/card as currently approved.
- Owner-site engine implementation: may be retained as an internal reusable reference, but it is not evidence of a separate external owner-site agreement.
- Deployment rule: do not create or publish a new independent Casa Del Toro domain without a specific commercial decision.

Casa Del Toro may be used to study conversion density, FAQs, maps, image behavior, and commercial detail. Never copy its Cartagena facts, pricing, identity, analytics, or operating terms into another property.

## Retired speculative demonstrations

The following properties were speculative demonstrations presented to owners who did not proceed. They are not active partners or inventory:

- Domaine des Montarels (`ddm-preview-4f9p3`)
- Casa de la Muralla (`cdm-preview-2q5n8`)
- Mount Zurich (`mz-preview-8x7k2`)
- Villa Kassandra (`villa-kassandra`)
- Villa Orama (`villa-orama`)

Rules:

- Do not contact these owners as if a relationship exists.
- Do not present these sites as active LoveThisPlace inventory.
- Do not index, advertise, or create dedicated production projects for them.
- Do not reuse their photography or copy for another prospect.
- Registry state: disabled (`active: false`, `visibility: hidden`). Dedicated builds reject these slugs, shared builds omit them, and post-build validation rejects their routes or media.
- Historical source files may remain temporarily for controlled retention, but they are not deployable inventory and must not be reactivated without a new written commercial decision.
- Preserve only what is legally and operationally necessary; raw owner or prospect materials remain private and should be removed when retention is no longer justified.

Git history is not a deployment source. A future agent must not restore a retired property merely because old files remain available.

## Adding a new property

A property moves into the active portfolio only after Juan records:

1. property and owner identity;
2. authorization to use supplied materials;
3. the commercial model;
4. the intended product: LoveThisPlace storefront, independent owner site, or both;
5. inquiry, booking, payment, and guest-service roles;
6. its publication state and launch gate.

Create a dated property decision record for every signed property. Update this portfolio file in the same PR that introduces its registry entry.

## Removing or declining a property

When a prospect declines or a relationship ends:

1. mark it retired here immediately;
2. remove it from active discovery and deployment configuration;
3. disable inquiry and payment routing;
4. remove or redirect its domain only after confirming no active booking depends on it;
5. archive or delete private materials according to authorization and retention needs;
6. verify its former public URLs return the intended status;
7. record the final state without publishing private commercial details.
