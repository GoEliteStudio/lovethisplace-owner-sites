# LoveThisPlace Owner-Site Engine: Technical Operations

Last reviewed: 2026-08-19

This document describes the current implementation and release controls for the reusable owner-site engine. It is an operating reference, not marketing copy. Do not add performance, ranking, deliverability, revenue, or uptime claims unless a dated test or contract supports them.

## 1. System boundary

The engine produces independent, property-branded websites. It is separate from the LoveThisPlace platform homepage, LoveThisPlace storefronts, Elite Cartagena inventory pages, and source archives supplied by owners.

An owner site may send inquiries into the shared LoveThisPlace inquiry pipeline, but it keeps its own property identity, hostname, canonical URLs, publication state, and deployment.

## 2. Sources of truth

Use these files in this order:

1. `src/config/i18n.ts` - property registry, language list, domains, publication state, currency, theme, and build selection.
2. `src/content/villas/{slug}.{lang}.json` - facts, copy, rates, FAQs, amenities, policies, and media references.
3. `src/config/i18n.ts` `LANG_META` - language labels, locales, and text direction.
4. `src/lib/schema.ts` - structured-data generation.
5. `src/pages/villas/[slug]/[lang].astro` - primary property route.
6. `src/pages/villas/[slug]/[lang]/gallery.astro` - gallery route.
7. `src/pages/api/inquire.ts` - inquiry routing and managed storefront proxies.
8. `scripts/validate-owner-sites.mjs` and `scripts/validate-build-isolation.mjs` - release safeguards.

The registry is authoritative. Do not create a second property list inside a route, deployment script, or document.

## 3. Property lifecycle

| Registry state | Meaning | Search behavior |
| --- | --- | --- |
| `private-preview` | Shareable for review or private selling, not launched for organic discovery | `noindex`, absent from discovery surfaces and the public sitemap |
| `public` | Commercial, factually approved, legally ready, and intentionally launched | indexable and eligible for sitemap inclusion |
| `hidden` | Withdrawn or disabled | not served as an active commercial property |

`active` controls whether the engine treats a record as operational. `visibility` controls publication. Neither substitutes for a signed agreement, confirmed facts, or production verification.

The current commercial portfolio is recorded in `docs/PORTFOLIO_STATUS.md`. Retired speculative demos must not remain active merely because their files still exist.

## 4. Build isolation

`VILLA_SLUG` is the deployment boundary.

### Local development without `VILLA_SLUG`

The engine generates active, non-hidden properties for local comparison and maintenance. Retired records remain excluded.

### Dedicated property deployment

Set `VILLA_SLUG={exact-registry-slug}`. Only that property may be generated. An unknown slug fails the build.

### Shared Vercel build without `VILLA_SLUG`

Only active properties with `visibility: 'public'` may be generated. If none exist, the deployment produces a neutral shell with no property routes or property media. A private preview must never appear because an environment variable was omitted.

### Post-build verification

`npm run build` prunes the rendered output and then runs behavioral isolation validation. For a dedicated build, the output must contain exactly the configured property route and its `assetSlug || slug` media directory. For a shared build, the output must exactly match the active public allowlist, including the valid empty-shell case. Under the top-level image directory, only explicitly shared entries are retained; loose archives, legacy directories, and other unapproved files fail validation. Unexpected routes or media fail the build.

The environment variable is necessary, but output inspection is the proof.

## 5. Routing and clean domains

The engine route is `/villas/{slug}/{lang}/`.

A property with `rootCanonical: true` is presented at clean hostname-root routes such as `/`, `/gallery/`, `/contact/`, `/rates/`, `/terms/`, and `/privacy/`.

The hostname is matched through `domain` and `altDomains`. Clean routes proxy internally to the selected property. Engine paths are implementation details and should not be presented as the owner-facing URL.

For a private preview, `previewOrigin` supplies working Open Graph and canonical-preview URLs until the custom domain is live. When the property becomes public, `canonicalOrigin` becomes authoritative.

## 6. Rendering and themes

The reusable renderer supports property-specific themes without forking the application. Current values are `classic` and `heritage-signature`.

A theme may change layout, typography, section rhythm, galleries, and interaction design. It must not create a second factual model, inquiry implementation, schema generator, or deployment path.

World-class quality means:

- clear property identity in the first viewport;
- responsive layouts without accidental empty panels or misalignment;
- keyboard-accessible navigation, galleries, and controls;
- useful mobile hierarchy rather than a compressed desktop page;
- restrained motion with reduced-motion support;
- consistent pricing and capacity facts across copy, schema, forms, and email; and
- no fabricated reviews, awards, affiliations, urgency, availability, or rankings.

## 7. Content and factual authority

Before implementation, create a fact matrix with a source and approval status for every material claim: names; location and travel times; capacity and rooms; land, coastline, pool, mooring, and accessibility; rates, taxes, deposits, minimum stays, and inclusions; services and add-ons; cancellation and house rules; owners, hosts, operator, and payment roles; and press, awards, testimonials, and reviews.

Owner-supplied written facts outrank reseller copy. Third-party listings may help discover details, but they do not automatically authorize a claim. Resolve contradictions before public launch.

## 8. Media pipeline

Original owner materials stay in a private, ignored source directory. Record archive provenance and hashes where appropriate. Never deploy the original archive.

Public media must be curated derivatives with normalized orientation, stripped metadata, descriptive filenames, real responsive dimensions, modern formats, explicit width and height, meaningful alt text, eager loading only for critical media, and lazy loading below the fold.

Do not upscale weak images. Do not publish near-duplicates just to increase a gallery count. Large galleries need chapters or filters, stable aspect-ratio presentation, and predictable keyboard/mobile behavior.

## 9. Search and AI-discovery foundations

For a public property, verify unique metadata, one canonical origin, correct language alternates, crawlable headings and useful answers, consistent entity and offer facts, relevant internal links, real press/review attribution, and fast stable media.

Structured data supports machine understanding; it does not guarantee rankings, citations, rich results, or AI recommendations. The schema generator derives reviews only from real, attributed testimonials and omits the field when none exist.

A private preview remains `noindex`, absent from the public sitemap, and blocked from discovery even when accessible without a password.

## 10. Inquiry and attribution pipeline

Every inquiry must preserve the public property identity, internal slug, locale, source and campaign attribution, traveler confirmation, operator notification, and a durable lead identifier or equivalent success evidence.

The page must explain who receives and handles the inquiry. Do not imply the owner, LoveThisPlace, and Go Elite Global are interchangeable.

Before launch, run one clearly labeled end-to-end production test. A local success message is insufficient proof.

## 11. Environment configuration

Document variable names and ownership, never values. A dedicated deployment normally requires `VILLA_SLUG`, established server-side inquiry credentials, approved sender/operator notification configuration, and origins represented in the registry.

Secrets belong in the correct Vercel project and environment. Never copy them into Markdown, chat, commits, screenshots, or browser code.

## 12. Required validation

```powershell
npm run validate
npm run check
$env:VILLA_SLUG='{slug}'
npm run build
```

`npm run build` executes validation, Astro type checking, production build, and post-build isolation verification.

Also perform browser QA on desktop, laptop-height, narrow mobile, and short-height/mobile-landscape viewports, plus keyboard navigation and reduced-motion behavior where relevant.

Inspect production after deployment. Never report a preview, localhost, or build log as production verification.

## 13. Deployment procedure

1. Start from a clean, current branch or isolated worktree.
2. Confirm the commercial record and publication state.
3. Set the dedicated Vercel project's `VILLA_SLUG` to the exact registry slug.
4. Build locally with the same slug.
5. Review output and test the inquiry path.
6. Commit only intentional source and documentation changes.
7. Push through the pull-request workflow.
8. Deploy the reviewed commit to the correct Vercel project.
9. Verify the share URL while DNS is pending.
10. Add the custom domain using the exact DNS record Vercel requests.
11. Reverify intended routes on the custom domain.
12. Keep `private-preview` until every indexing gate passes.
13. Change to `public` only in an intentional launch release.

Record the commit, deployment identifier, hostname, configured slug, verification result, and rollback target.

## 14. Production acceptance

A release is incomplete until the actual public hostname proves:

- intended routes return successfully and unrelated property routes return 404;
- exact foreign property-media URLs return 404, while intended responsive image variants return successfully;
- CSS, fonts, and image variants resolve;
- mobile navigation, anchors, galleries, and forms work;
- metadata and Open Graph media resolve;
- visibility, robots, canonical, and sitemap match the registry;
- no fabricated or stale commercial claims remain; and
- one labeled inquiry reaches the intended workflow with correct attribution.

## 15. Rollback and retirement

Keep the last known-good deployment identifier. If verification fails, restore it or redeploy its exact commit before beginning a redesign.

When an owner declines or a relationship ends, update the portfolio record, remove discovery and outreach, disable deployment/domain intentionally, retain only necessary private provenance, remove unnecessary owner data, and verify no shared build exposes the retired property.

See `docs/OWNER_SITE_ONBOARDING_RUNBOOK.md` for the full workflow and `docs/PORTFOLIO_STATUS.md` for the current portfolio.
