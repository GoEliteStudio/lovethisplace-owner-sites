# LoveThisPlace Owner Sites

Reusable engine for independent, owner-branded villa and yacht websites. It supports isolated per-property deployments, multiple visual themes, multilingual content, optimized media, structured data, inquiry routing, and controlled publication.

This repository is not the LoveThisPlace marketplace and is not the Elite Cartagena website. A property may have both a LoveThisPlace storefront and an independent owner site, but their identity, canonical URL, analytics, deployment, and indexing state must remain explicit.

## Start here

Read these files in order before changing a property or deployment:

1. `docs/PORTFOLIO_STATUS.md` - which properties are active, retained, or retired.
2. `docs/OWNER_SITE_PRODUCT_V2.md` - product boundaries and quality standard.
3. `docs/OWNER_SITE_ONBOARDING_RUNBOOK.md` - canonical intake, build, release, and offboarding workflow.
4. `docs/platform-documentation.md` - current technical architecture and deployment model.
5. `MULTI-LANGUAGE-GUIDE.md` - language-specific implementation and QA.

Property-specific decisions belong in dated documents such as `docs/MOLONTA_TWO_SITE_AND_INDEXING_DECISION_2026-08-19.md`. They do not override the canonical runbook unless the runbook is updated deliberately.

## Current commercial portfolio

- Molonta Heritage Estate: active partner; LoveThisPlace storefront is public, independent owner site is shareable but remains `private-preview` and `noindex`.
- Casa Del Toro: retained Go Elite showcase/inventory; also represented through LoveThisPlace.
- Old speculative owner demos: retired. Do not rebuild, deploy, contact, or present them as active inventory. See `docs/PORTFOLIO_STATUS.md`.

## Non-negotiable deployment rule

Every dedicated owner-site Vercel project must set:

```text
VILLA_SLUG=<registered-property-slug>
```

The production build and `scripts/validate-build-isolation.mjs` must prove that only that property's routes were generated.

For a registry entry with `rootCanonical: true`, postbuild copies the selected property's already-prerendered HTML to the clean root URLs. Clean pages are static files; they must never fetch the same deployment at runtime. Postbuild also verifies byte equality, route isolation, and every complete-gallery derivative after media pruning.

When `VILLA_SLUG` is absent on Vercel, the shared build generates public properties only. Private previews must never appear in a shared deployment. Locally, an unset value may still be used intentionally for shared development.

## Standard commands

```powershell
npm ci
npm run validate
npm run check
npm run build
npm run dev
npm run qa:owner-static -- https://property-domain.example/
```

Production-style isolated build:

```powershell
$env:VILLA_SLUG='property-slug'
$env:VERCEL='1'
npm run build
```

Do not deploy if the build, type check, owner-site validator, or isolation validator fails.

## Core source files

- `src/config/i18n.ts` - registry, visibility, domains, languages, currencies, and deployment selection.
- `src/content/villas/{slug}.{lang}.json` - property-specific content.
- `src/pages/villas/[slug]/[lang].astro` - route and renderer selection.
- `src/components/HeritageVillaPage.astro` - heritage-signature renderer.
- `src/lib/schema.ts` - structured-data graph from verified content.
- `src/pages/api/inquire.ts` - inquiry entry point.
- `src/pages/robots.txt.ts` and `src/pages/sitemap.xml.ts` - discovery boundaries.
- `scripts/validate-owner-sites.mjs` - product and content invariants.
- `scripts/materialize-clean-owner-routes.mjs` - clean static URL materialization for dedicated owner sites.
- `scripts/validate-output-isolation.mjs` - post-prune route, media, clean-page, and complete-gallery validation.
- `scripts/qa-static-owner-output.mjs` - browser QA for clean pages and rapid deep-gallery navigation.

## Publication states

- `private-preview`: open only by its intended URL, always `noindex`, excluded from sitemaps.
- `public`: indexable only after every commercial, legal, domain, inquiry, and QA gate passes.
- `hidden`: unavailable to public discovery and inquiry routing.

A preview URL is not authorization. A finished design is not authorization. Publication requires the release gates in the runbook.

## Security and privacy

- Never commit raw owner archives, credentials, private rates, guest information, or operating records.
- Keep originals in the ignored private source area.
- Publish only approved, resized, metadata-stripped derivatives.
- Never invent reviews, awards, affiliations, rates, or owner identities.
- Never test production inquiries with a real traveler without approval. Use one labeled test and reconcile it.

## Repository hygiene

- Work from a clean branch or isolated worktree.
- Do not combine unrelated properties or tasks in one commit.
- Do not commit `.astro` build artifacts, `.vercel`, `.env*`, raw media, or local audit output.
- Use a reviewed PR for changes to `main`.
- Verify the actual public URL after deployment. Localhost and preview checks are not production evidence.

## License

Proprietary - GoEliteStudio / Go-Elite LLC.
