# Independent Owner-Site Product

## Product decision

LoveThisPlace supports two complementary products:

1. **LoveThisPlace storefront**: platform-led discovery, LoveThisPlace identity, approved Go Elite Global operating context, and attributable inquiries.
2. **Independent owner site**: a property-branded website on a dedicated domain that gives the property a durable home on the open web.

These products may share verified facts and approved optimized media. They must not share identity, canonical URLs, analytics, credentials, deployment configuration, or commercial terms by accident.

## Commercial purpose

The storefront is not merely a listing and the independent site is not merely a brochure.

Together they can provide:

- a durable property identity beyond any single booking platform;
- direct inquiry and client-relationship ownership;
- transparent attribution of LoveThisPlace-introduced demand;
- modern search and AI-discovery foundations;
- a clear traveler journey from discovery to human confirmation;
- a cleaner commercial structure around commission and responsibility.

Fair tourism is the operating philosophy. The product must still solve a concrete owner problem and produce qualified traveler action.

## Two-site strategy

A signed property may use both products when their jobs are documented:

- The LoveThisPlace storefront is the platform discovery surface and may be indexed first.
- The independent owner site is the full property presentation and may remain `private-preview` until its launch gate passes.

This is not accidental duplicate content while only one canonical discovery surface is indexable. Every dual-site property requires a dated decision stating which page is canonical, how inquiries are attributed, and what triggers public indexing of the independent site.

## Themes

- `classic`: information-dense, agency-style conversion flow. Best when rates, logistics, trust signals, and fast comparison dominate.
- `heritage-signature`: cinematic, owner-led presentation. Best when place, history, hosts, land, and original photography create the commercial distinction.

Themes can differ visually, but neither may omit conversion essentials.

## Required product layers

Every independent owner site includes:

- property-specific identity and clean navigation;
- responsive hero and curated image narrative;
- optional chaptered complete gallery;
- verified specifications, rates, inclusions, add-ons, and booking notes;
- owner/host story using approved facts;
- practical location and arrival guidance;
- crawlable traveler FAQs;
- direct inquiry flow with human review;
- property-specific metadata, canonical URL, Open Graph data, and structured data;
- responsive WebP media with stable dimensions;
- accessibility and reduced-motion behavior;
- explicit publication state;
- dedicated deployment isolation.

## World-class quality standard

The result should feel commissioned for that property, not populated from a template. Reuse the engine, spacing system, media pipeline, validators, and components. Do not reuse another property's identity or copy.

A finished page must have:

- balanced desktop composition without accidental empty areas;
- deliberate mobile composition, not a compressed desktop page;
- consistent gallery frames and a stable lightbox;
- distinctive but readable typography;
- concise sections with no repeated facts;
- concrete decision information where the traveler needs it;
- clear operator/provider identity;
- no broken navigation anchors;
- no invented social proof;
- no image added merely to fill space.

## Media standard

The main page is selective. A large approved archive belongs in a separate complete gallery when it adds confidence.

Public media must be:

- authorized and traceable to a private source record;
- metadata-stripped;
- delivered as responsive WebP derivatives;
- dimensioned to prevent layout shift;
- source-faithful, never gratuitously upscaled;
- uniquely described with useful alt text;
- lazy-loaded except for the true first/LCP image;
- checked for exact and near duplicates.

## Search and AI-discovery standard

No ranking or AI citation is guaranteed. We provide foundations that search engines and AI systems can evaluate:

- one consistent property entity and canonical origin;
- accurate property-specific language;
- semantic headings and crawlable answers;
- visible facts aligned with structured data;
- useful destination and traveler information;
- descriptive image alternatives;
- fast responsive media;
- genuine press and reviews described precisely;
- internal links that serve a real user journey.

The owner's existing website does not need to be cited publicly. Source provenance remains in private operating records.

## Inquiry and attribution standard

Every inquiry must carry the correct property identity and source. The traveler receives a clear acknowledgment, and the approved operator receives the lead. Nothing is considered proven until one labeled end-to-end production test confirms the stored lead, operator notification, traveler receipt, and attribution.

The platform may support personalized referral links, but referral attribution is not the same as a complete commission ledger. Do not claim automated reconciliation or payout capability unless it exists and has been tested.

## Publication states

- `private-preview`: open by approved URL, always `noindex`, excluded from sitemaps.
- `public`: eligible for indexing only after the launch gate passes.
- `hidden`: unavailable to discovery and inquiry routing.

Private preview is temporary. Each property needs a dated launch or retirement decision.

## Public-release gates

Do not publish because the design looks finished. Confirm:

- authorization to use content and media;
- signed commercial agreement;
- final property, provider, and operator identities;
- verified rates, taxes, fees, deposits, minimum stays, and cancellation terms;
- approved legal and privacy disclosures;
- custom domain and canonical origin;
- dedicated `VILLA_SLUG` deployment isolation;
- approved email, analytics, Firebase, and payment environments;
- production inquiry test;
- owner approval when required;
- Juan's explicit indexing approval.

## Technical source of truth

- Portfolio state: `docs/PORTFOLIO_STATUS.md`
- Operating workflow: `docs/OWNER_SITE_ONBOARDING_RUNBOOK.md`
- Registry: `src/config/i18n.ts`
- Content: `src/content/villas/{slug}.{lang}.json`
- Themes and routes: `src/pages/villas/[slug]/[lang].astro`
- Heritage renderer: `src/components/HeritageVillaPage.astro`
- Inquiry handler: `src/pages/api/inquire.ts`
- Structured data: `src/lib/schema.ts`
- Discovery boundaries: `src/pages/sitemap.xml.ts`, `src/pages/robots.txt.ts`, `src/layouts/BaseLayout.astro`
- Validation: `scripts/validate-owner-sites.mjs`, `scripts/validate-build-isolation.mjs`, and `npm run check`
