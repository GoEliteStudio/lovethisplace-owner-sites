# Independent Owner-Site Product

## Product decision

The Villa Engine now supports a second commercial product alongside the LoveThisPlace storefront:

1. **LoveThisPlace storefront**: platform-led discovery, curated marketplace context, and LoveThisPlace/Go Elite routing.
2. **Independent owner site**: a property-branded canonical website that can live on the owner's own domain and work beside every booking channel.

These products share verified property facts and optimized media, but they do not share identity, canonical URLs, analytics, or deployment by accident.

## Design system

The engine exposes explicit themes in the villa registry:

- `classic`: information-dense, agency-style conversion flow. Useful when rates, trust signals, availability, and operational details must be visible quickly.
- `heritage-signature`: cinematic owner-site presentation with the same conversion essentials. It leads with place, history, hosts, and original photography without sacrificing rates, FAQs, practical details, or inquiry capture.

Molonta is the first hybrid implementation. It combines Casa-style commercial density with a more distinctive editorial presentation.

## What every owner site includes

- Property-specific identity and navigation
- Responsive hero and curated image narrative
- Optional two-layer media: a tightly curated sales-page gallery plus a chaptered complete collection when the owner supplies enough approved photography
- Verified specifications, inclusions, add-ons, rates, and booking notes
- Owner/host story using approved facts
- Practical details and location guidance
- Crawlable traveler FAQs
- Direct inquiry flow with human review
- Property-specific title, description, canonical URL, Open Graph data, and structured data
- Responsive, optimized WebP media
- Accessibility and reduced-motion behavior
- Explicit public/private publication state

## Search and AI-discovery standard

No ranking or AI citation is guaranteed. The engine provides the foundations search engines and AI systems can evaluate:

- one consistent property entity and canonical origin;
- accurate, useful, property-specific copy;
- semantic headings and crawlable answers;
- descriptive image alternatives;
- consistent facts across visible copy and structured data;
- fast responsive media;
- useful location and traveler information;
- no fabricated reviews, awards, rates, or affiliations.

The owner's existing site does not need to be linked or named as an authority. Source provenance and factual verification remain in private operating records.

## Publication states

- `private-preview`: always noindex; excluded from sitemaps; preview URLs are not a substitute for authentication.
- `public`: eligible for indexing only after the release gates below pass.
- `hidden`: unavailable to discovery and inquiry routing.

A public site requires an approved custom domain and canonical origin. Unknown hosts and preview hosts fail closed in `robots.txt`.

## Public-release gates

Do not publish merely because a page looks finished. Confirm:

- written authorization to use the content and media;
- final property identity and operator/provider roles;
- verified rates, taxes, deposits, minimum stays, and cancellation terms;
- signed commercial agreement;
- correct legal, privacy, and traveler-facing terms;
- approved owner and guest email routing;
- durable rate limiting and origin validation for public inquiry endpoints;
- production inquiry test with no secrets or private data exposed;
- owner visual/content approval;
- production canonical, sitemap, robots, analytics, and search-console checks.

## Complete-gallery standard

The main page remains editorial: it shows only the images needed to establish the property and support a decision. A substantial approved archive may also support a dedicated owner-branded gallery route. That route uses meaningful chapters, descriptive alt text, responsive WebP variants, stable image dimensions, lazy loading after the first image, and a contained full-screen viewer.

Do not upscale small originals merely to hit a nominal breakpoint. Preserve the source-faithful largest rendition, keep raw originals out of the public directory, and validate every public derivative against the private approval record.

## Technical source of truth

- Registry: `src/config/i18n.ts`
- Property content: `src/content/villas/{slug}.{lang}.json`
- Themes: `src/pages/villas/[slug]/[lang].astro`
- Heritage renderer: `src/components/HeritageVillaPage.astro`
- Inquiry handler: `src/pages/api/inquire.ts`
- Discovery boundaries: `src/pages/sitemap.xml.ts`, `src/pages/robots.txt.ts`, and `src/layouts/BaseLayout.astro`
- Automated checks: `npm run validate:owner-sites`
