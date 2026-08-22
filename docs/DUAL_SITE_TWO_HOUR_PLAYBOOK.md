# Dual-Site Two-Hour Playbook

This is the fast lane for producing the LoveThisPlace"��y��y�double hitter�w^~)�u:

1. a LoveThisPlace storefront for discovery, attribution, and platform conversion; and
2. an independent owner-branded site for a durable property identity and direct inquiry.

The target is a review-ready pair in no more than two hours of operator work. It is not permission to skip factual, privacy, media, inquiry, or deployment controls.

## What the two-hour promise means

The target applies when:

- the owner has authorized use of the property materials;
- usable photographs and core facts already exist;
- the commercial model and inquiry recipient are known;
- the property fits an existing storefront and owner-site theme;
- no new payment system, booking engine, language, component family, or API integration is required.

The target is for review-ready previews. DNS propagation, owner corrections, signed terms, indexing approval, and third-party deployment queues are external gates and do not belong inside the two-hour build promise.

If a request requires new infrastructure, stop the fast lane. Record the gap once, fix it in the shared engine, add a regression check, and never solve the same gap property-by-property.

## One shared property packet

Create one private, verified property packet before editing either repository. It is the source for both products and contains:

- canonical property name and approved former name;
- owner/operator identity and contact route;
- location, coordinates, airport and destination times;
- capacity, bedrooms, beds, bathrooms, en-suites, and accessibility;
- defining land, water, pool, amenity, and service facts;
- rates, currency, validity, minimum stays, taxes, fees, deposits, and cancellation terms;
- inclusions, optional services, and exclusions;
- owner story, press references, and genuine testimonials;
- commercial model, attribution rule, inquiry recipient, and traveler-service role;
- authorization and source provenance;
- image shortlist: hero candidates, curated sales sequence, and optional complete-gallery chapters.

The packet remains private. Public pages use independently written copy grounded in its verified facts. Never copy broker prose or expose the source matrix.

## Fixed product boundary

### LoveThisPlace storefront

- Brand lead: LoveThisPlace.
- Operating role: Go Elite Global only as approved.
- Job: property discovery, platform narrative, attributable inquiry.
- Repository: LoveThisPlace storefront repository.
- URL, canonical, analytics, and indexing belong to LoveThisPlace.

### Independent owner site

- Brand lead: the property.
- Platform/operator roles appear only where needed for clarity.
- Job: complete property presentation and durable direct web identity.
- Repository: this owner-site engine.
- Dedicated domain, analytics, canonical, and indexing state are explicit.

Do not make the two pages visually identical. They share facts and approved media, not product identity. Record which page is indexed and which is canonical in a dated decision file.

## The 120-minute build

### 2��y��y�10 minutes: commercial and portfolio gate

1. Read PORTFOLIO_STATUS.md.
2. Confirm authorization, commercial model, intended products, and inquiry recipient.
3. Create or update the dated property decision.
4. Start one clean branch/worktree per repository. Do not run two modifying processes in one repository.

Output: approved scope, property slug, publication state, and no accidental prospect revival.

### 1;�u���S25 minutes: property packet and image decision

1. Reconcile owner-supplied facts with official public facts.
2. Omit unresolved claims; do not average conflicts.
3. Select three hero frames and 12�w^~)�w20 curated sales images.
4. Decide whether the archive merits a separate chaptered complete gallery.
5. Choose classic or heritage-signature for the owner site.

Output: one factual packet and one ordered media plan used by both builds.

### 2;�u���S50 minutes: LoveThisPlace storefront

1. Clone the current approved storefront data shape; do not copy another property's identity.
2. Add property-specific copy, price model, FAQs, metadata, schema facts, and inquiry attribution.
3. Use the established responsive image ladder and lightbox.
4. Add the property to approved discovery surfaces only when commercially authorized.
5. Keep the page noindex until its publication decision allows indexing.

Output: complete storefront preview with working inquiry attribution.

### 5;�u���S90 minutes: independent owner site

1. Add one registry entry with unique slug, domain/share origin, visibility, currency, languages, theme, inquiry recipient, and rootCanonical decision.
2. Add property content through the existing renderer.
3. Reuse the existing hero, navigation, gallery, location, FAQ, inquiry, metadata, schema, legal-page, and static-root systems.
4. Configure the same three hero frames. For a cinematic hero, use the proven storefront motion contract:
   - later frames hydrate once after the first load;
   - a frame is shown only after it is complete;
   - class changes stay synchronous;
   - opacity crossfade is 1.2 seconds with ease;
   - image motion is scale(1.035) to scale(1) over 7 seconds with ease;
   - pause while hidden and honor reduced motion.
5. Do not invent custom preloading, decoding gates, self-fetch proxies, carousel engines, or per-property CSS.

Output: complete owner-site preview on clean paths.

### 9;�u���S110 minutes: automated quality gates

For each repository, run its existing validation and production-style isolated build. For the owner site:

    $env:VILLA_SLUG='property-slug'
    $env:VERCEL='1'
    npm run build

Serve .vercel/output/static and run:

    npm run qa:mobile -- http://127.0.0.1:PORT/
    npm run qa:owner-static -- http://127.0.0.1:PORT/

Required proof:

- zero build/type errors;
- only the selected property route and media directory survive;
- clean pages are static and byte-equivalent to the approved prerendered route;
- every declared gallery item and responsive derivative survives pruning;
- mobile menu, hero, anchors, lightbox, and forms work;
- no horizontal overflow;
- no unrelated property identity, route, archive, or media ships.

Output: behavioral evidence, not a source-code assertion.

### 112��y��y�120 minutes: visual review and handoff

Review 1440px desktop, common laptop, 390px mobile, and landscape mobile. Check:

- first mobile and desktop hero composition;
- one full hero transition;
- navigation fit;
- section spacing and sticky release points;
- curated and complete galleries;
- inquiry success state;
- canonical, Open Graph, robots, sitemap, and structured data;
- storefront/owner-site identity separation.

Open the two clean preview URLs. Record what is ready, what remains gated, and the exact next external action.

## Release after approval

Approval of localhost authorizes only the reviewed visual change unless Juan explicitly moves the work forward. The normal release is:

1. inspect status and diffs;
2. exclude generated files, raw sources, private notes, credentials, and unrelated work;
3. commit property-specific files;
4. push the reviewed feature branch;
5. use one reviewed PR;
6. merge only after checks pass;
7. verify the actual custom domain and LoveThisPlace URL;
8. record commit, deployment, indexing state, and production evidence.

Each dedicated owner-site Vercel project must set VILLA_SLUG. A successful dashboard status is not production proof.

## Fast-lane stop conditions

Stop and re-scope if any of these appears:

- missing authorization or uncertain owner identity;
- unclear booking/payment/cancellation responsibility;
- conflicting rates or essential property facts;
- inadequate or unauthorized media;
- a request for custom software, payments, availability sync, or a new integration;
- a design requirement outside existing themes;
- a failing shared-engine control;
- more than one property leaking into a dedicated build.

Do not spend the second hour disguising a first-hour scope problem.

## Definition of a successful double hitter

The pair is successful when:

- each page has a distinct commercial job and identity;
- facts and media agree without duplicate-copy competition;
- both render quickly and cleanly on mobile and desktop;
- inquiries carry the correct property and source;
- the storefront can drive discovery;
- the owner site can become the property's durable direct home;
- private previews remain noindex;
- the next property requires configuration and content, not reinvention.
